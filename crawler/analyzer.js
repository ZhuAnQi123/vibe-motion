import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // ✨ 自动加载当前目录下的 .env 文件
import { setGlobalDispatcher, ProxyAgent } from 'undici';

// 强制将 Node.js 的全局原生 fetch 流量转发至本地代理端口
if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
  const dispatcher = new ProxyAgent({ uri: proxyUrl });
  setGlobalDispatcher(dispatcher);
  console.log(`📡 已成功为原生 fetch 挂载代理适配器: ${proxyUrl}`);
}
// 1. 初始化 Gemini API 客户端 (传一个空对象 {} 防止 SDK 内部报 undefined 错误)
const ai = new GoogleGenAI({}); 

// 2. 配置路径
const CURRENT_DIR = process.cwd();
const OUTPUT_DIR = path.join(CURRENT_DIR, 'output');
const PROMPT_FILE_PATH = path.join(CURRENT_DIR, 'AI_WORKFLOW_PROMPT.md');
const HISTORY_FILE_PATH = path.join(CURRENT_DIR, 'processed_urls.json');

// ✨ 优先读取环境或 .env 变量，如果没有则 fallback 到你的真实本地绝对路径
const TARGET_SKILLS_DIR = process.env.TARGET_SKILLS_DIR || '/Users/v.sophie.zhu/Documents/code/vibe-ui/vibe-motion/skills/interaction-library/references';

// 将本地文件转换为 Gemini API 所需的 InlineData 格式
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

// 读取已处理的账本
function getProcessedUrls() {
  if (fs.existsSync(HISTORY_FILE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(HISTORY_FILE_PATH, 'utf-8'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

// 记录到账本
function saveToHistory(url) {
  const urls = getProcessedUrls();
  if (!urls.includes(url)) {
    urls.push(url);
    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(urls, null, 2), 'utf-8');
    console.log(`📝 已将链接记录到账本: ${url}`);
  }
}

async function analyzeItem(itemFolderName) {
  const itemDirPath = path.join(OUTPUT_DIR, itemFolderName);
  const metaPath = path.join(itemDirPath, 'meta.json');
  const videoPath = path.join(itemDirPath, 'raw_video.mp4');

  if (!fs.existsSync(metaPath) || !fs.existsSync(videoPath)) {
    console.log(`⚠️ ${itemFolderName} 缺少 meta.json 或 raw_video.mp4，跳过。`);
    return;
  }

  // 读取元数据
  const metaData = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  
  // 检查账本，如果这个 URL 已经处理过，直接跳过（双重保险）
  const processedUrls = getProcessedUrls();
  if (metaData.videoUrl && processedUrls.includes(metaData.videoUrl)) {
    console.log(`⏭️ 账本显示该动效已生成过，跳过: ${metaData.title}`);
    return;
  }

  console.log(`\n🤖 [Gemini] 开始分析 [${itemFolderName}]: ${metaData.title}...`);

  // 读取你的标准提示词模板
  const workflowPrompt = fs.readFileSync(PROMPT_FILE_PATH, 'utf-8');

  // 构建塞给 Gemini 的多模态输入数组
  const videoPart = fileToGenerativePart(videoPath, 'video/mp4');
  
  const userInstructions = `
你现在是一个资深的物理动效专家和多模态视觉 Agent。
请根据我提供的【原始动效视频】以及【爬虫抓取到的元数据】，严格按照下面给出的 \`AI_WORKFLOW_PROMPT.md\` 规范模板，生成最终的动效技术规范 Markdown。

---
【爬虫抓取到的元数据】
- 原始标题: ${metaData.title || '无'}
- 原始介绍: ${metaData.description || '无'}
- 来源 (Source): ${metaData.source || '无'}
- 类别 (Category): ${metaData.category || 'Motion'}
- 风格 (Style): ${Array.isArray(metaData.style) ? metaData.style.join(', ') : (metaData.style || '无')}
- 颜色 (Color): ${metaData.color || '无'}
- 交互 (Interaction): ${metaData.interaction || '无'}
- 原设计链接: ${metaData.videoUrl || '无'}

---
【你的输出硬性标准】
1. 你的返回结果必须**仅包含纯 Markdown 文本**，不要包裹在 \`\`\`markdown \`\`\` 块外面，直接从 \`--- \` Frontmatter 开始。
2. 仔细观察视频中物体的缓动（Stiffness, Damping）、微动、以及子元素的交错出现顺序（Stagger Delay）。
3. 必须在 Frontmatter 中解析出一个独一无二的英文 \`name\` 字段（作为后续的文件名，例如: donmolinico-intro-menu-hover）。
4. 严格将 Frontmatter 中的 \`cover_video\` 替换为 \`../assets/\${name}.mp4\`。
5. 严格将 Frontmatter 中的 \`cdn_video_url\` 替换为 \`https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/\${name}.mp4\`。

---
【AI_WORKFLOW_PROMPT.md 规范模板如下】
${workflowPrompt}
`;

  try {
    // 调用 Gemini 1.5 Pro（处理视频和深度分析动效体验的最佳选择）
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        videoPart,
        userInstructions
      ],
    });

    const markdownResult = response.text;
    
    // 从生成的 Markdown 中精准提取 frontmatter 里的 name 字段
    const nameMatch = markdownResult.match(/name:\s*['"]?([a-zA-Z0-9-_]+)['"]?/);
    if (!nameMatch || !nameMatch[1]) {
      throw new Error('Gemini 响应中未找到有效的 name 字段，无法保存文件。');
    }
    
    const fileName = nameMatch[1].trim();
    console.log(`🎯 Gemini 解析成功！提取到动效名 (name): ${fileName}`);

    // 创建目标目录（如果不存在）
    if (!fs.existsSync(TARGET_SKILLS_DIR)) {
      fs.mkdirSync(TARGET_SKILLS_DIR, { recursive: true });
    }

    // 写入到你的 vibe-motion 技能库中
    const finalMdPath = path.join(TARGET_SKILLS_DIR, `${fileName}.md`);
    fs.writeFileSync(finalMdPath, markdownResult, 'utf-8');
    console.log(`💾 完美！Markdown 规范已写入: ${finalMdPath}`);

    // 将生成的 name 回传存储在当前的 item 文件夹中，方便第三步上传视频重命名时使用
    fs.writeFileSync(path.join(itemDirPath, 'resolved_name.txt'), fileName, 'utf-8');

    // 处理成功，记入历史账本
    if (metaData.videoUrl) {
      saveToHistory(metaData.videoUrl);
    }

  } catch (error) {
    console.error(`❌ Gemini 解析 [${itemFolderName}] 失败:`, error.message);
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log('❌ 未找到 output/ 文件夹，请先运行 spy.js 爬取数据。');
    return;
  }

  // 读取 output 下所有的 item_x 文件夹
  const folders = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.startsWith('item_'))
    .sort((a, b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));

  console.log(`🔍 扫描到 ${folders.length} 个待解析的缓存条目...`);

  for (const folder of folders) {
    await analyzeItem(folder);
    // 适当等待，防止触发 API 限流
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n🏁 所有本地素材已由 Gemini 1.5 Pro 转换完毕！');
}

main();