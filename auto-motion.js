#!/usr/bin/env node

/**
 * 自动化动效规范生成工具
 * 用法: node auto-motion.js <视频路径> <网站URL>
 * 示例: node auto-motion.js ~/Desktop/demo.mov https://linear.app
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server"); // 👈 引入文件管理器解决大视频传输超时
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const ffmpeg = require("fluent-ffmpeg");
const fse = require("fs-extra");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const yaml = require("js-yaml");
require("dotenv").config();

// ======================== 代理配置（解决 Node 18+ fetch 不走系统代理的问题） ========================
try {
  const { setGlobalDispatcher, ProxyAgent } = require("undici");
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (proxyUrl) {
    setGlobalDispatcher(new ProxyAgent(proxyUrl));
    console.log(`🔌 检测到环境变量，已通过 undici 启用 HTTP 代理: ${proxyUrl}`);
  }
} catch (e) {
  console.log(
    "💡 提示: 如果网络连接失败，可执行 `npm install undici` 并在 .env 中配置 HTTP_PROXY 来开启代理。",
  );
}

// ======================== 配置区域 ========================

// Gemini API 配置（从 .env 读取）
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const VIBE_UI_WEB_PATH = process.env.VIBE_UI_WEB_LOCAL_PATH;
const MODEL_NAME = process.env.MODEL_NAME;
const MOTION_CDN_BASE =
  process.env.MOTION_CDN_BASE ??
  "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev";
if (!GEMINI_API_KEY) {
  console.error("❌ 错误: 请在 .env 文件中设置 GEMINI_API_KEY");
  process.exit(1);
}

// 文件路径配置
const PROMPT_TEMPLATE_PATH = path.join(__dirname, "AI_WORKFLOW_PROMPT.md");
const MOTION_REPO_ROOT = __dirname;
const REFERENCES_DIR = path.join(
  MOTION_REPO_ROOT,
  "skills/interaction-library/references",
);
const VIBE_MOTION_SUBMODULE = "vibe-motion";

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
      console.warn("⚠️ YAML 解析失败，尝试备用方法...");
    }
  }

  // 方法2: 使用正则直接提取（备用）
  const regexMatch = text.match(/name:\s*([^\s\n]+)/);
  if (regexMatch) {
    return regexMatch[1].trim();
  }

  throw new Error("无法从响应中提取 name 字段，请检查生成的内容格式。");
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
    const status = execSync("git status --porcelain", {
      cwd: repoPath,
      encoding: "utf-8",
    });
    return status.trim() === "";
  } catch (error) {
    console.warn("⚠️ 无法检查 Git 状态:", error.message);
    return false;
  }
}

async function uploadVideoToR2(localPath, key) {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(
      "请在 .env 中配置 R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME",
    );
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const body = await fse.readFile(localPath);
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "video/mp4",
    }),
  );

  return `${MOTION_CDN_BASE}/${key}`;
}

async function confirmContinueIfDirty(repoPath, repoLabel) {
  if (checkGitStatus(repoPath)) {
    return true;
  }

  console.warn(`⚠️ ${repoLabel} 检测到未提交的变更，请先提交或暂存`);
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await new Promise((resolve) => {
    readline.question("是否继续？(y/N): ", resolve);
  });
  readline.close();
  return answer.toLowerCase() === "y";
}

async function commitAndPush(repoPath, addPaths, message) {
  execSync(`git add ${addPaths.join(" ")}`, {
    stdio: "inherit",
    cwd: repoPath,
  });
  execSync(`git commit -m "${message}"`, {
    stdio: "inherit",
    cwd: repoPath,
  });
  execSync("git push", {
    stdio: "inherit",
    cwd: repoPath,
  });
}

// ======================== 主函数 ========================

async function main() {
  console.log("🚀 启动自动化动效规范生成工具...\n");

  // 1. 解析命令行参数
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("❌ 用法: node auto-motion.js <视频路径> <网站URL>");
    console.error(
      "📌 示例: node auto-motion.js ~/Desktop/demo.mov https://linear.app",
    );
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
  console.log("📄 加载提示词模板...");
  if (!(await fileExists(PROMPT_TEMPLATE_PATH))) {
    console.error(`❌ 提示词模板不存在: ${PROMPT_TEMPLATE_PATH}`);
    process.exit(1);
  }
  const promptTemplate = await fse.readFile(PROMPT_TEMPLATE_PATH, "utf-8");

  // 4. 验证目录
  const refsDir = REFERENCES_DIR;
  await fse.ensureDir(refsDir);
  console.log(`📂 规范输出目录: ${refsDir}`);
  if (VIBE_UI_WEB_PATH) {
    console.log(`📂 Web 仓库路径: ${VIBE_UI_WEB_PATH}`);
    if (!(await fileExists(VIBE_UI_WEB_PATH))) {
      console.error(`❌ Web 仓库路径不存在: ${VIBE_UI_WEB_PATH}`);
      process.exit(1);
    }
  }
  console.log(`✅ 目录已就绪\n`);

  // 6. 检测视频 MIME 类型并使用 File API 上传到 Gemini
  console.log("📤 正在将视频上传到 Gemini (File API)...");

  const ext = path.extname(videoPath).toLowerCase();
  const mimeTypeMap = {
    ".mov": "video/quicktime",
    ".mp4": "video/mp4",
    ".avi": "video/x-msvideo",
    ".webm": "video/webm",
  };
  const mimeType = mimeTypeMap[ext] || "video/quicktime";
  console.log(`📹 视频类型: ${mimeType}`);

  const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);

  // 上传文件至 Gemini 临时存储
  const uploadResult = await fileManager.uploadFile(videoPath, {
    mimeType: mimeType,
    displayName: path.basename(videoPath),
  });
  console.log(`✅ 视频已上传成功，URI: ${uploadResult.file.uri}`);

  // 轮询等待视频处理完成（Gemini 会在云端对视频文件进行分帧和预处理）
  console.log("⏳ 等待 Gemini 预处理视频文件...");
  let fileState = await fileManager.getFile(uploadResult.file.name);
  while (fileState.state === "PROCESSING") {
    process.stdout.write(".");
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 每 3 秒轮询一次
    fileState = await fileManager.getFile(uploadResult.file.name);
  }

  if (fileState.state === "FAILED") {
    console.error("\n❌ Gemini 视频处理失败！");
    process.exit(1);
  }
  console.log("\n✅ 视频预处理完成，准备开始分析！\n");

  // 7. 构建提示词（动态注入真正的 _template.md）
  const templatePath = path.join(__dirname, "_template.md");
  let templateContent = "";
  if (await fileExists(templatePath)) {
    templateContent = await fse.readFile(templatePath, "utf-8");
  } else {
    console.warn("⚠️ 未找到 _template.md，将回退使用内置默认格式");
  }

  const prompt = `
    你是一位全球顶尖的动效设计师与前端架构师。

    请仔细观察我发送的界面交互视频，并按照以下模板进行逆向工程分析。

    网站 URL（供参考上下文）: ${websiteUrl}

    ${promptTemplate}

    ⚠️【硬性要求】：请忽略上面 Prompt 中可能存在的旧格式说明，你必须严格使用下方《最新动效规范模板》中的 YAML 属性名和 Markdown 标题结构来输出你的分析结果：

    ================ 最新动效规范模板 ================
    ${templateContent}
    ================================================

    请严格按照上述模板的格式输出 Markdown 规范文件。
  `;

  // 8. 调用 Gemini API 分析视频
  console.log("🤖 调用 Gemini API 分析视频...");
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
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
          role: "user",
          parts: [
            { text: prompt },
            {
              fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
              },
            },
          ],
        },
      ],
    });
    responseText = result.response.text();
    console.log("✅ Gemini 分析完成\n");

    // 分析完成后清理云端视频临时文件（推荐实践）
    try {
      await fileManager.deleteFile(uploadResult.file.name);
      console.log("🧹 已自动清理 Gemini 云端的临时视频文件\n");
    } catch (cleanupErr) {
      console.warn("⚠️ 自动清理云端文件失败（可忽略）:", cleanupErr.message);
    }
  } catch (error) {
    console.error("❌ Gemini API 调用失败:", error.message);
    if (error.message.includes("API key")) {
      console.error("💡 请检查 GEMINI_API_KEY 是否正确");
    }
    process.exit(1);
  }

  // 9. 提取 name 字段
  console.log("📝 提取文件名...");
  let baseName;
  try {
    baseName = extractNameFromResponse(responseText);
    console.log(`✅ 提取成功: ${baseName}\n`);
  } catch (error) {
    console.error("❌ 提取失败:", error.message);
    console.log("📄 Gemini 返回内容预览:");
    console.log(responseText.substring(0, 500) + "...\n");
    process.exit(1);
  }

  // 10. 保存 Markdown 文件
  console.log("💾 保存规范文件...");
  const mdFileName = `${baseName}.md`;
  const mdPath = path.join(refsDir, mdFileName);

  if (await fileExists(mdPath)) {
    console.warn(`⚠️ 文件已存在，将覆盖: ${mdFileName}`);
  }

  await fse.writeFile(mdPath, responseText);
  console.log(`✅ 规范文件已保存: ${mdPath}\n`);

  // 11. 压缩视频并上传至 Cloudflare R2
  console.log("🎬 压缩视频...");
  const mp4FileName = `${baseName}.mp4`;
  const mp4Path = path.join(os.tmpdir(), mp4FileName);

  await new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(mp4Path)
      .videoCodec("libx264")
      .audioCodec("aac")
      .size("640x?")
      .on("start", (cmd) => {
        console.log(`🔧 FFmpeg 命令: ${cmd}`);
      })
      .on("progress", (progress) => {
        if (progress.percent) {
          process.stdout.write(
            `\r⏳ 压缩进度: ${Math.round(progress.percent)}%`,
          );
        }
      })
      .on("end", () => {
        console.log("\n✅ 视频压缩完成");
        resolve();
      })
      .on("error", (err) => {
        console.error("\n❌ 视频压缩失败:", err.message);
        reject(err);
      })
      .run();
  });

  console.log("☁️ 上传视频至 Cloudflare R2...");
  let publicVideoUrl;
  try {
    publicVideoUrl = await uploadVideoToR2(mp4Path, mp4FileName);
    console.log(`✅ 视频已上传: ${publicVideoUrl}\n`);
  } finally {
    await fse.remove(mp4Path).catch(() => {});
  }

  // 12. Git 操作
  console.log("📦 提交 vibe-motion 并同步 vibe-ui-web...");

  try {
    if (!(await confirmContinueIfDirty(MOTION_REPO_ROOT, "vibe-motion"))) {
      console.log("❌ 用户取消操作");
      process.exit(0);
    }

    console.log("⏳ 提交 vibe-motion...");
    await commitAndPush(
      MOTION_REPO_ROOT,
      [`skills/interaction-library/references/${mdFileName}`],
      `feat: 添加动效规范 ${baseName}`,
    );

    if (VIBE_UI_WEB_PATH) {
      if (!(await confirmContinueIfDirty(VIBE_UI_WEB_PATH, "vibe-ui-web"))) {
        console.log("❌ 用户取消操作");
        process.exit(0);
      }

      console.log("⏳ 更新 vibe-ui-web 子模块...");
      execSync(`git submodule update --remote ${VIBE_MOTION_SUBMODULE}`, {
        stdio: "inherit",
        cwd: VIBE_UI_WEB_PATH,
      });

      console.log("⏳ 提交 vibe-ui-web 子模块指针...");
      await commitAndPush(
        VIBE_UI_WEB_PATH,
        [VIBE_MOTION_SUBMODULE],
        `feat: update vibe-motion submodule (${baseName})`,
      );
    } else {
      console.log(
        "💡 未配置 VIBE_UI_WEB_LOCAL_PATH，已跳过 vibe-ui-web 子模块同步",
      );
    }

    console.log("🎉 全部完成！");
    console.log(`🎬 视频地址: ${publicVideoUrl}`);
  } catch (error) {
    console.error("❌ Git 操作失败:", error.message);
    console.error("💡 请手动执行 Git 操作:");
    console.error(`  cd ${MOTION_REPO_ROOT}`);
    console.error(
      `  git add skills/interaction-library/references/${mdFileName}`,
    );
    console.error(`  git commit -m "feat: 添加动效规范 ${baseName}"`);
    console.error("  git push");
    if (VIBE_UI_WEB_PATH) {
      console.error(`  cd ${VIBE_UI_WEB_PATH}`);
      console.error(`  git submodule update --remote ${VIBE_MOTION_SUBMODULE}`);
      console.error(`  git add ${VIBE_MOTION_SUBMODULE}`);
      console.error(
        `  git commit -m "feat: update vibe-motion submodule (${baseName})"`,
      );
      console.error("  git push");
    }
    process.exit(1);
  }
}

// ======================== 错误处理 ========================

process.on("unhandledRejection", (error) => {
  console.error("❌ 未处理的错误:", error);
  process.exit(1);
});

// ======================== 执行 ========================

main().catch((error) => {
  console.error("❌ 执行失败:", error.message);
  console.error(error.stack);
  process.exit(1);
});
