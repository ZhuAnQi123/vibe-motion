import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { setGlobalDispatcher, ProxyAgent } from "undici";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import ffmpeg from "fluent-ffmpeg";

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

// 3. 初始化 Cloudflare R2 客户端
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// ✨ 新增：使用 ffmpeg 处理视频转换与压缩的 Promise 封装
function processVideoWithFFmpeg(inputPath, outputPath, shouldCompress) {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath).toFormat("mp4");

    if (shouldCompress) {
      console.log(`🎬 [FFmpeg] 视频大小超过 3MB，正在启用 H.264 极限压缩...`);
      command = command
        .videoCodec("libx264")
        .outputOptions(["-crf 28", "-preset fast"]); // crf 28 兼顾清晰度与压榨体积
    } else {
      console.log(`🎬 [FFmpeg] 正在标准化转码为 MP4 格式...`);
    }

    command
      .on("end", () => {
        console.log(`✨ [FFmpeg] 视频流处理完成！`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`❌ [FFmpeg] 处理失败:`, err.message);
        reject(err);
      })
      .save(outputPath);
  });
}

// 上传视频到 Cloudflare R2
async function uploadVideoToR2(localFilePath, fileNameOnR2) {
  const fileStream = fs.createReadStream(localFilePath);
  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `${fileNameOnR2}.mp4`,
    Body: fileStream,
    ContentType: "video/mp4",
  };

  try {
    console.log(`☁️ 正在上传视频到 Cloudflare R2: ${fileNameOnR2}.mp4 ...`);
    await r2Client.send(new PutObjectCommand(uploadParams));
    console.log(`🚀 [R2] 视频成功同步至云端存储桶！`);
  } catch (err) {
    console.error(`❌ [R2] 视频上传失败:`, err.message);
    throw err;
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
  let videoPath = path.join(itemDirPath, "raw_video.mp4");

  // 🛠️ 需求 3：基本校验，如果没有视频源，说明不是动效资产，直接跳过并弃用该目录
  if (!fs.existsSync(metaPath) || !fs.existsSync(videoPath)) {
    console.log(`⚠️ [跳过] ${itemFolderName} 未成功下载到任何视频源。`);
    return;
  }

  const metaData = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

  // 需求 3：校验是否是动图（GIF / WebP）。如果是，则直接过滤摒弃，不添加该资源
  const targetUrl = metaData.cardUrl;
  if (
    metaData.videoUrl &&
    (metaData.videoUrl.endsWith(".gif") || metaData.videoUrl.endsWith(".webp"))
  ) {
    console.log(
      `⚠️ [跳过] 检测到该资源为静态/动态图片 (${metaData.videoUrl})，不符合高品质动效库要求。`,
    );
    if (targetUrl) saveToHistory(targetUrl); // 记录到历史，防止下次重复扫描
    return;
  }
  const processedUrls = getProcessedUrls();
  if (targetUrl && processedUrls.includes(targetUrl)) {
    console.log(`⏭️ 账本显示该动效已处理过，跳过: ${metaData.title}`);
    return;
  }

  // 🛠️ 需求 1 & 2：检查文件体积与格式
  const stats = fs.statSync(videoPath);
  const fileSizeInBytes = stats.size;
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

  const isTooLarge = fileSizeInMegabytes > 3.0;
  // 此处简单通过 URL 或抓取元数据判断是否需要强制格式转码（比如抓到了 webm 或 mov）
  const needConversion =
    metaData.videoUrl && !metaData.videoUrl.toLowerCase().endsWith(".mp4");

  let finalProcessedVideoPath = videoPath;

  if (isTooLarge || needConversion) {
    console.log(
      `⚙️ [优化触发] 视频体积: ${fileSizeInMegabytes.toFixed(2)}MB, 是否需要转码: ${needConversion}`,
    );
    const processedVideoPath = path.join(itemDirPath, "processed_video.mp4");
    try {
      await processVideoWithFFmpeg(videoPath, processedVideoPath, isTooLarge);
      finalProcessedVideoPath = processedVideoPath; // 将上传路径和投喂路径指向处理后的标准 MP4
    } catch (ffmpegErr) {
      console.error(`❌ FFmpeg 预处理失败，将尝试使用原视频兜底投喂...`);
    }
  }

  console.log(
    `\n🤖 [Gemini] 开始分析 [${itemFolderName}]: ${metaData.title}...`,
  );
  const workflowPrompt = fs.readFileSync(PROMPT_FILE_PATH, "utf-8");

  // 投喂经过优化/转码后的视频
  const videoPart = fileToGenerativePart(finalProcessedVideoPath, "video/mp4");

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
      model: process.env.GEMINI_MODEL,
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

    // 触发自动化 R2 云端视频上传
    await uploadVideoToR2(finalProcessedVideoPath, fileName);

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
