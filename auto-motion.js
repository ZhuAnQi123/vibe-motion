#!/usr/bin/env node

/**
 * 自动化动效规范生成工具
 * 用法: node auto-motion.js <视频路径> <网站URL>
 * 示例: node auto-motion.js ~/Desktop/demo.mov https://linear.app
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const ffmpeg = require('fluent-ffmpeg');
const fse = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');
require('dotenv').config();

// ======================== 配置区域（请根据实际情况修改） ========================

// Gemini API 配置（从 .env 读取）
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const REPO_ROOT = process.env.VIBE_UI_WEB_LOCAL_PATH
if (!GEMINI_API_KEY) {
  console.error('❌ 错误: 请在 .env 文件中设置 GEMINI_API_KEY');
  process.exit(1);
}

// 文件路径配置
const PROMPT_TEMPLATE_PATH = path.join(__dirname, 'AI_WORKFLOW_PROMPT.md');


// 子模块配置（通常不需要改）
const SUBMODULE_PATH = 'skills/interaction-library';
const REFERENCES_DIR = path.join(SUBMODULE_PATH, 'references');
const ASSETS_DIR = path.join(SUBMODULE_PATH, 'assets');

// ======================== 辅助函数 ========================

/**
 * 从 Gemini 响应中提取 name 字段
 * 支持 YAML frontmatter 格式
 */
function extractNameFromResponse(text) {
  // 方法1: 尝试解析 YAML frontmatter
  const yamlMatch = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (yamlMatch) {
    try {
      const frontMatter = yaml.load(yamlMatch[1]);
      if (frontMatter.name) {
        return frontMatter.name.trim();
      }
    } catch (e) {
      console.warn('⚠️ YAML 解析失败，尝试备用方法...');
    }
  }

  // 方法2: 使用正则直接提取（备用）
  const regexMatch = text.match(/name:\s*([^\s\n]+)/);
  if (regexMatch) {
    return regexMatch[1].trim();
  }

  throw new Error('无法从响应中提取 name 字段，请检查生成的内容格式。');
}

/**
 * 检查文件是否存在
 */
async function fileExists(filePath) {
  try {
    await fse.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 检查 Git 仓库状态
 */
function checkGitStatus(repoPath) {
  try {
    const status = execSync('git status --porcelain', {
      cwd: repoPath,
      encoding: 'utf-8',
    });
    return status.trim() === '';
  } catch (error) {
    console.warn('⚠️ 无法检查 Git 状态:', error.message);
    return false;
  }
}

// ======================== 主函数 ========================

async function main() {
  console.log('🚀 启动自动化动效规范生成工具...\n');

  // 1. 解析命令行参数
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('❌ 用法: node auto-motion.js <视频路径> <网站URL>');
    console.error('📌 示例: node auto-motion.js ~/Desktop/demo.mov https://linear.app');
    process.exit(1);
  }

  const [videoPath, websiteUrl] = args;

  // 2. 验证视频文件
  console.log(`📹 视频文件: ${videoPath}`);
  if (!(await fileExists(videoPath))) {
    console.error(`❌ 视频文件不存在: ${videoPath}`);
    process.exit(1);
  }

  console.log(`🔗 网站 URL: ${websiteUrl}\n`);

  // 3. 验证提示词模板
  console.log('📄 加载提示词模板...');
  if (!(await fileExists(PROMPT_TEMPLATE_PATH))) {
    console.error(`❌ 提示词模板不存在: ${PROMPT_TEMPLATE_PATH}`);
    process.exit(1);
  }
  const promptTemplate = await fse.readFile(PROMPT_TEMPLATE_PATH, 'utf-8');

  // 4. 验证仓库路径
  console.log(`📂 目标仓库: ${REPO_ROOT}`);
  if (!(await fileExists(REPO_ROOT))) {
    console.error(`❌ 仓库路径不存在: ${REPO_ROOT}`);
    console.error('💡 请修改脚本中的 REPO_ROOT 配置');
    process.exit(1);
  }

  // 5. 验证子模块目录
  const refsDir = path.join(REPO_ROOT, REFERENCES_DIR);
  const assetsDir = path.join(REPO_ROOT, ASSETS_DIR);
  await fse.ensureDir(refsDir);
  await fse.ensureDir(assetsDir);
  console.log(`✅ 子模块目录已就绪\n`);

  // 6. 读取视频并转换为 Base64
  console.log('📤 准备发送视频到 Gemini...');
  const videoBuffer = await fse.readFile(videoPath);
  const videoBase64 = videoBuffer.toString('base64');
  
  // 检测视频 MIME 类型
  const ext = path.extname(videoPath).toLowerCase();
  const mimeTypeMap = {
    '.mov': 'video/quicktime',
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.webm': 'video/webm',
  };
  const mimeType = mimeTypeMap[ext] || 'video/quicktime';
  console.log(`📹 视频类型: ${mimeType}\n`);

  // 7. 构建提示词
  const prompt = `
你是一位全球顶尖的动效设计师与前端架构师。

请仔细观察我发送的界面交互视频，并按照以下模板进行逆向工程分析。

网站 URL（供参考上下文）: ${websiteUrl}

${promptTemplate}

请严格按照上述模板的格式输出 Markdown 规范文件。
`;

  // 8. 调用 Gemini API
  console.log('🤖 调用 Gemini API 分析视频...');
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-thinking-exp-1219',
    generationConfig: {
      temperature: 0.2,
      topK: 1,
      topP: 0.8,
    },
  });

  let responseText;
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: videoBase64,
              },
            },
          ],
        },
      ],
    });
    responseText = result.response.text();
    console.log('✅ Gemini 分析完成\n');
  } catch (error) {
    console.error('❌ Gemini API 调用失败:', error.message);
    if (error.message.includes('API key')) {
      console.error('💡 请检查 GEMINI_API_KEY 是否正确');
    }
    process.exit(1);
  }

  // 9. 提取 name 字段
  console.log('📝 提取文件名...');
  let baseName;
  try {
    baseName = extractNameFromResponse(responseText);
    console.log(`✅ 提取成功: ${baseName}\n`);
  } catch (error) {
    console.error('❌ 提取失败:', error.message);
    console.log('📄 Gemini 返回内容预览:');
    console.log(responseText.substring(0, 500) + '...\n');
    process.exit(1);
  }

  // 10. 保存 Markdown 文件
  console.log('💾 保存规范文件...');
  const mdFileName = `${baseName}.md`;
  const mdPath = path.join(refsDir, mdFileName);
  
  if (await fileExists(mdPath)) {
    console.warn(`⚠️ 文件已存在，将覆盖: ${mdFileName}`);
  }
  
  await fse.writeFile(mdPath, responseText);
  console.log(`✅ 规范文件已保存: ${mdPath}\n`);

  // 11. 压缩视频
  console.log('🎬 压缩视频...');
  const mp4FileName = `${baseName}.mp4`;
  const mp4Path = path.join(assetsDir, mp4FileName);
  
  if (await fileExists(mp4Path)) {
    console.warn(`⚠️ 文件已存在，将覆盖: ${mp4FileName}`);
  }

  await new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(mp4Path)
      .videoCodec('libx264')
      .audioCodec('aac')
      .size('640x?')
      .on('start', (cmd) => {
        console.log(`🔧 FFmpeg 命令: ${cmd}`);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\r⏳ 压缩进度: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log('\n✅ 视频压缩完成');
        resolve();
      })
      .on('error', (err) => {
        console.error('\n❌ 视频压缩失败:', err.message);
        reject(err);
      })
      .run();
  });
  console.log(`✅ 视频已保存: ${mp4Path}\n`);

  // 12. Git 操作
  console.log('📦 更新子模块并提交...');
  process.chdir(REPO_ROOT);

  // 检查 Git 状态
  if (!checkGitStatus(REPO_ROOT)) {
    console.warn('⚠️ 检测到未提交的变更，请先提交或暂存');
    console.warn('是否继续？(y/N)');
    // 简单实现：等待用户确认
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = await new Promise((resolve) => {
      readline.question('继续？(y/N): ', resolve);
    });
    readline.close();
    if (answer.toLowerCase() !== 'y') {
      console.log('❌ 用户取消操作');
      process.exit(0);
    }
  }

  try {
    console.log('⏳ 更新子模块...');
    execSync('git submodule update --remote', { 
      stdio: 'inherit',
      cwd: REPO_ROOT,
    });

    console.log('⏳ 添加变更...');
    execSync(`git add ${SUBMODULE_PATH}`, { 
      stdio: 'inherit',
      cwd: REPO_ROOT,
    });

    console.log('⏳ 提交变更...');
    execSync(`git commit -m "feat: 添加动效规范 ${baseName}"`, { 
      stdio: 'inherit',
      cwd: REPO_ROOT,
    });

    console.log('⏳ 推送到远程...');
    execSync('git push', { 
      stdio: 'inherit',
      cwd: REPO_ROOT,
    });

    console.log('🎉 全部完成！');
  } catch (error) {
    console.error('❌ Git 操作失败:', error.message);
    console.error('💡 请手动执行 Git 操作:');
    console.error(`  cd ${REPO_ROOT}`);
    console.error('  git submodule update --remote');
    console.error(`  git add ${SUBMODULE_PATH}`);
    console.error(`  git commit -m "feat: 添加动效规范 ${baseName}"`);
    console.error('  git push');
    process.exit(1);
  }
}

// ======================== 错误处理 ========================

process.on('unhandledRejection', (error) => {
  console.error('❌ 未处理的错误:', error);
  process.exit(1);
});

// ======================== 执行 ========================

main().catch((error) => {
  console.error('❌ 执行失败:', error.message);
  console.error(error.stack);
  process.exit(1);
});