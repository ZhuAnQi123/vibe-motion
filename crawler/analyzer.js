import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { setGlobalDispatcher, ProxyAgent } from "undici";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // ✨ 引入 S3 客户端

// 1. 自动挂载网络代理（确保 TUN 模式或本地端口畅通）
if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
  setGlobalDispatcher(new ProxyAgent({ uri: proxyUrl }));
}

const ai = new GoogleGenAI({});

// 2. 配置路径
const CURRENT_DIR = process.cwd();
const OUTPUT_DIR = path.join(CURRENT_DIR, "output");
const PROMPT_FILE_PATH = path.join(CURRENT_DIR, "AI_WORKFLOW_PROMPT.md");
const HISTORY_FILE_PATH = path.join(CURRENT_DIR, "processed_urls.json");
const TARGET_SKILLS_DIR =
  process.env.TARGET_SKILLS_DIR ||
  "/Users/v.sophie.zhu/Documents/code/vibe-ui/vibe-motion/skills/interaction-library/references";

// 3. ✨ 初始化 Cloudflare R2 客户端
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// ✨ 新增：上传视频到 Cloudflare R2 的函数
async function uploadVideoToR2(localFilePath, fileNameOnR2) {
  const fileStream = fs.createReadStream(localFilePath);
  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `${fileNameOnR2}.mp4`, // 上传到 R2 后的文件名
    Body: fileStream,
    ContentType: "video/mp4",
  };

  try {
    console.log(`☁️ 正在上传视频到 Cloudflare R2: ${fileNameOnR2}.mp4 ...`);
    await r2Client.send(new PutObjectCommand(uploadParams));
    console.log(`🚀 [R2] 视频成功同步至云端存储桶！`);
  } catch (err) {
    console.error(`❌ [R2] 视频上传失败:`, err.message);
    throw err; // 抛出错误以防止计入历史账本
  }
}

function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };
}

function getProcessedUrls() {
  if (fs.existsSync(HISTORY_FILE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(HISTORY_FILE_PATH, "utf-8"));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveToHistory(url) {
  const urls = getProcessedUrls();
  if (!urls.includes(url)) {
    urls.push(url);
    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(urls, null, 2), "utf-8");
    console.log(`📝 已将链接记录到账本: ${url}`);
  }
}

async function analyzeItem(itemFolderName) {
  const itemDirPath = path.join(OUTPUT_DIR, itemFolderName);
  const metaPath = path.join(itemDirPath, "meta.json");
  const videoPath = path.join(itemDirPath, "raw_video.mp4");

  if (!fs.existsSync(metaPath) || !fs.existsSync(videoPath)) {
    console.log(`⚠️ ${itemFolderName} 缺少文件，跳过。`);
    return;
  }

  const metaData = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const targetUrl = metaData.cardUrl || metaData.videoUrl;

  const processedUrls = getProcessedUrls();
  if (targetUrl && processedUrls.includes(targetUrl)) {
    console.log(`⏭️ 账本显示该动效已处理过，跳过: ${metaData.title}`);
    return;
  }

  console.log(
    `\n🤖 [Gemini] 开始分析 [${itemFolderName}]: ${metaData.title}...`,
  );
  const workflowPrompt = fs.readFileSync(PROMPT_FILE_PATH, "utf-8");
  const videoPart = fileToGenerativePart(videoPath, "video/mp4");

  const userInstructions = `
你现在是一个资深的物理动效专家和多模态视觉 Agent。
请根据我提供的【原始动效视频】以及【爬虫抓取到的元数据】，严格按照下面给出的 \`AI_WORKFLOW_PROMPT.md\` 规范模板，生成最终的动效技术规范 Markdown。

---
【爬虫抓取到的元数据】
- 原始标题: ${metaData.title || "无"}
- 原始介绍: ${metaData.description || "无"}
- 来源 (Source): ${metaData.source || "无"}
- 类别 (Category): ${metaData.category || "Motion"}
- 风格 (Style): ${Array.isArray(metaData.style) ? metaData.style.join(", ") : metaData.style || "无"}
- 颜色 (Color): ${metaData.color || "无"}
- 交互 (Interaction): ${metaData.interaction || "无"}
- 原设计链接: ${metaData.videoUrl || "无"}

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
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: [videoPart, userInstructions],
    });

    const markdownResult = response.text;
    const nameMatch = markdownResult.match(
      /name:\s*['"]?([a-zA-Z0-9-_]+)['"]?/,
    );
    if (!nameMatch || !nameMatch[1]) {
      throw new Error("Gemini 响应中未找到有效的 name 字段，无法保存文件。");
    }

    const fileName = nameMatch[1].trim();
    console.log(`🎯 Gemini 解析成功！提取到动效名 (name): ${fileName}`);

    // ✨ 触发自动化 R2 云端视频上传（以大模型起的标准英文名命名）
    await uploadVideoToR2(videoPath, fileName);

    // 写入本地 Markdown 技能库
    if (!fs.existsSync(TARGET_SKILLS_DIR)) {
      fs.mkdirSync(TARGET_SKILLS_DIR, { recursive: true });
    }
    const finalMdPath = path.join(TARGET_SKILLS_DIR, `${fileName}.md`);
    fs.writeFileSync(finalMdPath, markdownResult, "utf-8");
    console.log(`💾 完美！Markdown 规范已写入: ${finalMdPath}`);

    // 本地缓存 resolved_name 记录
    fs.writeFileSync(
      path.join(itemDirPath, "resolved_name.txt"),
      fileName,
      "utf-8",
    );

    // 写入去重历史账本
    if (targetUrl) {
      saveToHistory(targetUrl);
    }
  } catch (error) {
    console.error(
      `❌ Gemini 解析或 R2 上传 [${itemFolderName}] 失败:`,
      error.message,
    );
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log("❌ 未找到 output/ 文件夹，请先运行 spy.js 爬取数据。");
    return;
  }

  const folders = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.startsWith("item_"))
    .sort((a, b) => parseInt(a.split("_")[1]) - parseInt(b.split("_")[1]));

  console.log(`🔍 扫描到 ${folders.length} 个待解析的缓存条目...`);

  for (const folder of folders) {
    await analyzeItem(folder);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log(
    "\n🏁 所有本地素材已由 Gemini 1.5 Pro 转换并同步至 Cloudflare R2！",
  );
}

main();
