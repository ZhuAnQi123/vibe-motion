import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { setGlobalDispatcher, ProxyAgent } from "undici";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import ffmpeg from "fluent-ffmpeg";

if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
  setGlobalDispatcher(new ProxyAgent({ uri: proxyUrl }));
}

const ai = new GoogleGenAI({});

const CURRENT_DIR = process.cwd();
const OUTPUT_DIR = path.join(CURRENT_DIR, "output");
const PROMPT_FILE_PATH = path.join(CURRENT_DIR, "AI_WORKFLOW_PROMPT.md");
const HISTORY_FILE_PATH = path.join(CURRENT_DIR, "processed_urls.json");
const TARGET_SKILLS_DIR =
  process.env.TARGET_SKILLS_DIR ||
  "/Users/v.sophie.zhu/Documents/code/vibe-ui/vibe-motion/skills/interaction-library/references";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

function processVideoWithFFmpeg(inputPath, outputPath, shouldCompress) {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath).toFormat("mp4");

    if (shouldCompress) {
      console.log(`🎬 [FFmpeg] 视频超过 3MB，启用 H.264 极限压缩...`);
      command = command.videoCodec("libx264").outputOptions(["-crf 28", "-preset fast"]);
    } else {
      console.log(`🎬 [FFmpeg] 标准化转码为 MP4 格式...`);
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

async function uploadVideoToR2(localFilePath, fileNameOnR2) {
  const fileStream = fs.createReadStream(localFilePath);
  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `${fileNameOnR2}.mp4`,
    Body: fileStream,
    ContentType: "video/mp4",
  };

  try {
    console.log(`☁️ 上传视频至 Cloudflare R2: ${fileNameOnR2}.mp4 ...`);
    await r2Client.send(new PutObjectCommand(uploadParams));
    console.log(`🚀 [R2] 视频成功同步至存储桶！`);
  } catch (err) {
    console.error(`❌ [R2] 上传失败:`, err.message);
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
    console.log(`📝 已记录到历史账本: ${url}`);
  }
}

// 🎯 定义 Gemini Structured Output (结构化输出) 的严格 Schema
const geminiAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    shouldSkip: {
      type: Type.BOOLEAN,
      description: "Must be set to true if the video is a 3D model/render, Three.js particle array, heavy WebGL geometry deformation, or non-UI CG animation.",
    },
    skipReason: {
      type: Type.STRING,
      description: "Detailed reason for skipping if shouldSkip is true.",
    },
    name: {
      type: Type.STRING,
      description: "Unique kebab-case English component name, e.g., 'magnetic-hover-button'. Required if shouldSkip is false.",
    },
    markdownDoc: {
      type: Type.STRING,
      description: "The complete, formatted Markdown document following the AI_WORKFLOW_PROMPT structure, including frontmatter with all parameters properly filled out.",
    },
  },
  required: ["shouldSkip", "name", "markdownDoc"],
};

async function analyzeItem(itemFolderName) {
  const itemDirPath = path.join(OUTPUT_DIR, itemFolderName);
  const metaPath = path.join(itemDirPath, "meta.json");
  let videoPath = path.join(itemDirPath, "raw_video.mp4");

  if (!fs.existsSync(metaPath) || !fs.existsSync(videoPath)) {
    console.log(`⚠️ [跳过] ${itemFolderName} 缺乏必要的元数据或视频源。`);
    return;
  }

  const metaData = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const targetUrl = metaData.cardUrl;

  const processedUrls = getProcessedUrls();
  if (targetUrl && processedUrls.includes(targetUrl)) {
    console.log(`⏭️ 账本显示已处理过，跳过: ${metaData.title}`);
    return;
  }

  const stats = fs.statSync(videoPath);
  const fileSizeInMegabytes = stats.size / (1024 * 1024);

  // 🛡️ 防线 2：通过文件大小二次剔除（大型 3D/CG 渲染片段体积往往较大）
  if (fileSizeInMegabytes > 15.0) {
    console.log(`⚠️ [跳过] 视频体积达 ${fileSizeInMegabytes.toFixed(2)}MB，判定为超复杂场景/非 UI 动画。`);
    if (targetUrl) saveToHistory(targetUrl);
    return;
  }

  const isTooLarge = fileSizeInMegabytes > 3.0;
  const needConversion = metaData.videoUrl && !metaData.videoUrl.toLowerCase().endsWith(".mp4");
  let finalProcessedVideoPath = videoPath;

  if (isTooLarge || needConversion) {
    const processedVideoPath = path.join(itemDirPath, "processed_video.mp4");
    try {
      await processVideoWithFFmpeg(videoPath, processedVideoPath, isTooLarge);
      finalProcessedVideoPath = processedVideoPath;
    } catch (ffmpegErr) {
      console.error(`❌ FFmpeg 处理失败，回退使用原始视频...`);
    }
  }

  console.log(`\n🤖 [Gemini] 开始分析 [${itemFolderName}]: ${metaData.title}...`);
  const workflowPrompt = fs.readFileSync(PROMPT_FILE_PATH, "utf-8");
  const videoPart = fileToGenerativePart(finalProcessedVideoPath, "video/mp4");

  const userInstructions = `
你现在是一个资深的物理动效专家和多模态视觉 Agent。
请根据我提供的【原始动效视频】以及【抓取到的元数据】，严格按照下面提供的 \`AI_WORKFLOW_PROMPT.md\` 规范与筛选准则进行判断和生成。

---
【爬虫抓取到的元数据】
- 原始标题: ${metaData.title || "无"}
- 原始介绍: ${metaData.description || "无"}
- 来源 (Source): ${metaData.source || "无"}
- 类别 (Category): ${metaData.category || "Motion"}
- 风格 (Style): ${Array.isArray(metaData.style) ? metaData.style.join(", ") : metaData.style || "无"}

---
【判断与输出规则】
1. 评估视频是否包含：纯 3D 角色/模型/场景渲染、Three.js 粒子阵列、WebGL 几何体复杂形变，或纯 CG 效果。如果属于上述任意一种，请将 \`shouldSkip\` 设为 \`true\`，并提供 \`skipReason\`。
2. 若属于可被 Web 标准（DOM / CSS / 基础 Canvas）还原的 UI 交互，将 \`shouldSkip\` 设为 \`false\`。
3. 请在 JSON 中的 \`name\` 属性直接返回合法的英文 kebab-case 名称（如 \`elastic-card-hover\`）。
4. 在 \`markdownDoc\` 中返回完整规范的 Markdown 文档。其中 Frontmatter 中的 \`cover_video\` 填写为 \`../assets/\${name}.mp4\`，\`cdn_video_url\` 填写为 \`https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/\${name}.mp4\`。

---
【AI_WORKFLOW_PROMPT.md 规范模板】
${workflowPrompt}
`;

  try {
    // 🎯 开启 Structured Outputs 模式
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-pro",
      contents: [videoPart, userInstructions],
      config: {
        responseMimeType: "application/json",
        responseSchema: geminiAnalysisSchema,
      },
    });

    const result = JSON.parse(response.text);

    // 🛡️ 防线 3：捕获 Gemini 校验结果并跳过
    if (result.shouldSkip) {
      console.log(`🚫 [Gemini 拦截跳过] 原因: ${result.skipReason || "属于 3D/粒子/非 UI 动画场景"}`);
      if (targetUrl) saveToHistory(targetUrl);
      return;
    }

    // 🎯 零正则表达式直接获取关键字段
    const fileName = result.name ? result.name.trim() : null;
    if (!fileName) {
      throw new Error("Gemini 返回的 JSON 中 lacked 有效的 name 字段。");
    }

    console.log(`🎯 Gemini 成功分析！组件命名 (name): ${fileName}`);

    await uploadVideoToR2(finalProcessedVideoPath, fileName);

    if (!fs.existsSync(TARGET_SKILLS_DIR)) {
      fs.mkdirSync(TARGET_SKILLS_DIR, { recursive: true });
    }

    const finalMdPath = path.join(TARGET_SKILLS_DIR, `${fileName}.md`);
    fs.writeFileSync(finalMdPath, result.markdownDoc, "utf-8");
    console.log(`💾 Markdown 技术规范已写入: ${finalMdPath}`);

    fs.writeFileSync(path.join(itemDirPath, "resolved_name.txt"), fileName, "utf-8");

    if (targetUrl) saveToHistory(targetUrl);
  } catch (error) {
    console.error(`❌ Gemini 分析或 R2 上传 [${itemFolderName}] 失败:`, error.message);
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log("❌ 未找到 output/ 目录，请先运行 spy.js 爬取数据。");
    return;
  }

  const folders = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.startsWith("item_"))
    .sort((a, b) => parseInt(a.split("_")[1]) - parseInt(b.split("_")[1]));

  console.log(`🔍 扫描到 ${folders.length} 个待解析的本地缓存条目...`);

  for (const folder of folders) {
    await analyzeItem(folder);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("\n🏁 所有合法 Web 动效素材已解析完毕并同步至 Cloudflare R2！");
}

main();