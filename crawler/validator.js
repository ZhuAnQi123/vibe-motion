import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import path from "path";
import "dotenv/config";

// 🌐 代理配置 (复用 analyzer.js 基建)
import { setGlobalDispatcher, ProxyAgent } from "undici";
if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
  setGlobalDispatcher(
    new ProxyAgent({
      uri: proxyUrl,
      connect: { timeout: 60000 },
    })
  );
}

const ai = new GoogleGenAI({});
const CURRENT_DIR = process.cwd();
const VALIDATION_DIR = path.join(CURRENT_DIR, "validation_output");
const OUTPUT_DIR = path.join(CURRENT_DIR, "output");
const TARGET_SKILLS_DIR =
  process.env.TARGET_SKILLS_DIR ||
  "/Users/mac/Documents/code/vibe-motion/skills/interaction-library/references";

// 定义及格分数线
const PASSING_SCORE_THRESHOLD = 80;

// 📦 将本地文件转换为 Base64 内联数据
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType,
    },
  };
}

// 🎯 Step 2.1: 定义裁判结果的数据结构 (Structured Output Schema)
// ⚠️ TEMPORARY: 临时回退路径（仅用于跑通闭环测试，后续必须删除）
// 当 output/ 下没有通过 resolved_name.txt 匹配到的 raw_video.mp4 时，
// 回退到 validation_output/<component>.mp4 或 .mov 作为参考源。
// 这些临时参考文件（如 bento-button-stagger-hover.mp4）不是固定产物，
// 待 auto_test.md「Step 4 正确逻辑」落地（references 新增文件 → Step1 → 与 output/ 视频按名映射比较）后，
// 应移除本回退逻辑并删掉这些临时文件。
function findTempReferenceFallback(componentName) {
  for (const ext of ["mp4", "mov"]) {
    const p = path.join(VALIDATION_DIR, `${componentName}.${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}


// 取消了 passed 字段，让模型专心打分和输出评价，判断逻辑交由 Node.js 控制
const validationSchema = {
  type: Type.OBJECT,
  properties: {
    similarity_score: {
      type: Type.INTEGER,
      description: "0 to 100 score indicating how perfectly the generated video matches the raw reference video based on the Markdown specification.",
    },
    dimensions_analysis: {
      type: Type.OBJECT,
      properties: {
        timing_and_speed: {
          type: Type.STRING,
          description: "Evaluation of animation duration, delays, and overall speed.",
        },
        easing_curves: {
          type: Type.STRING,
          description: "Evaluation of the physics, bounciness, and easing functions (e.g., cubic-bezier, spring).",
        },
        visual_deformation: {
          type: Type.STRING,
          description: "Evaluation of spatial properties like scale, translation, rotation, and skew.",
        },
      },
      required: ["timing_and_speed", "easing_curves", "visual_deformation"],
    },
    discrepancies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of specific, actionable discrepancies found in the generated video compared to the reference.",
    },
  },
  required: ["similarity_score", "dimensions_analysis", "discrepancies"],
};

// 🎯 Step 2.2 & 2.3: 核心判断逻辑与 Prompt 设计
// 通过 output/ 下各 item_<n>/resolved_name.txt 反查组件名对应的原始参考视频
function findRawVideoForComponent(componentName) {
  if (!fs.existsSync(OUTPUT_DIR)) return null;
  const items = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.startsWith("item_") && fs.statSync(path.join(OUTPUT_DIR, f)).isDirectory());

  for (const item of items) {
    const resolvedPath = path.join(OUTPUT_DIR, item, "resolved_name.txt");
    if (fs.existsSync(resolvedPath)) {
      const name = fs.readFileSync(resolvedPath, "utf-8").trim();
      if (name === componentName) {
        const rawPath = path.join(OUTPUT_DIR, item, "raw_video.mp4");
        return fs.existsSync(rawPath) ? rawPath : null;
      }
    }
  }
  // ⚠️ TEMPORARY: 兜底到 validation_output 下的临时参考（闭环测试用，见 findTempReferenceFallback 注释）
  return findTempReferenceFallback(componentName);
}

async function validateComponent(componentName) {
  // 扁平、按组件名命名的真实分布：
  //   - 生成视频: validation_output/<component>_generated.webm    (Step 1 产物)
  //   - 规范文件: TARGET_SKILLS_DIR/<component>.md               (analyzer.js 产物)
  //   - 原始视频: output/item_*/raw_video.mp4                    (spy.js 产物，经 resolved_name.txt 关联)
  const generatedVideoPath = path.join(VALIDATION_DIR, `${componentName}_generated.webm`);
  const mdSpecPath = path.join(TARGET_SKILLS_DIR, `${componentName}.md`);
  const rawVideoPath = findRawVideoForComponent(componentName);

  if (!fs.existsSync(generatedVideoPath)) {
    console.log(`⚠️ [跳过] ${componentName} 缺少生成视频 ${componentName}_generated.webm。`);
    return;
  }
  if (!fs.existsSync(mdSpecPath)) {
    console.log(`⚠️ [跳过] ${componentName} 缺少规范文件 ${componentName}.md (TARGET_SKILLS_DIR)。`);
    return;
  }
  if (!rawVideoPath) {
    console.log(`⚠️ [跳过] ${componentName} 在 output/ 中找不到对应的 raw_video.mp4 (resolved_name.txt 未匹配)。`);
    return;
  }

  console.log(`\n⚖️  [AI 裁判] 开始评估组件: ${componentName}...`);
  
  const mdContent = fs.readFileSync(mdSpecPath, "utf-8");

  // 构建多模态输入（按扩展名选择原始参考视频的 MIME，兼容临时 .mov 回退）
  const rawExt = path.extname(rawVideoPath).toLowerCase();
  const rawMime = rawExt === ".mov" ? "video/quicktime" : "video/mp4";
  const rawVideoPart = fileToGenerativePart(rawVideoPath, rawMime);
  const generatedVideoPart = fileToGenerativePart(generatedVideoPath, "video/webm"); // Playwright 默认格式

  const refereePrompt = `
你现在是一个极其严格、无情的“像素与体感级”前端动效裁判 (UI/UX Motion QA)。

我将提供给你三个核心输入：
1. [视频 1]: 原始参考动效 (Raw Reference Video)。
2. [视频 2]: 机器生成的复现动效 (Generated Reproduction Video)。
3. [Markdown 规范]: 提取出的动效技术规范 (Technical Spec)。

【你的任务】
仔细对比两个视频。以 [视频 1] 和 [Markdown 规范] 作为绝对真理，严厉审视 [视频 2] 的实现效果。
请评估以下维度：
- 触发时机与速度 (Timing & Speed)
- 物理缓动与弹性体感 (Easing & Physics)
- 形变、位移与视觉还原度 (Visual Deformation & Layout)

【评分规则】
- 给出 0-100 的整数 similarity_score。
- 90-100: 肉眼难以分辨差异，完全符合规范。
- 80-89: 体感基本一致，但有微小的数值偏差（如弹性不够、某段位移差几个像素）。
- 70-79: 明显感觉出物理曲线不一致，或遗漏了次要动画（如只做了位移没做透明度渐变）。
- <70: 粗制滥造，连基本的交互状态都没还原。

【动效规范参考 (Markdown Spec)】
---
${mdContent}
---
`;

  try {
    // 调用最新模型 gemini-2.5-pro
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-pro",
      // 注意顺序：Prompt -> 视频1 -> 视频2
      contents: [refereePrompt, rawVideoPart, generatedVideoPart],
      config: {
        responseMimeType: "application/json",
        responseSchema: validationSchema,
        temperature: 0.1, // 裁判需要极低的随机性，保持客观严谨
      },
    });

    const report = JSON.parse(response.text);
    const score = report.similarity_score;
    
    // 🎯 Step 2.4: 决策分流与状态落盘 (Decision Routing)
    const isPassed = score >= PASSING_SCORE_THRESHOLD;
    
    report.passed = isPassed; // 将阈值判断结果注入最终报告

    const reportPath = path.join(VALIDATION_DIR, `${componentName}_validation_report.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");

    if (isPassed) {
      console.log(`✅ [通过] 分数: ${score}/${PASSING_SCORE_THRESHOLD} | ${componentName}`);
      console.log(`   📝 评价摘要: 速度评估[${report.dimensions_analysis.timing_and_speed}]`);
      // 这里可以衔接将通过的组件标记为 Verified 或进行 R2 二次整理
    } else {
      console.log(`❌ [拦截] 分数: ${score}/${PASSING_SCORE_THRESHOLD} | ${componentName} 未达标!`);
      console.log(`   🚨 核心缺陷:`);
      report.discrepancies.forEach((d, i) => console.log(`      ${i + 1}. ${d}`));
      console.log(`   💾 完整案发现场已保存至: ${reportPath} (为 Step 3 自愈系统铺路)`);
    }

  } catch (error) {
    console.error(`💥 [AI 裁判] 评估 ${componentName} 时发生异常:`, error.message || error);
  }
}

async function main() {
  if (!fs.existsSync(VALIDATION_DIR)) {
    console.log("❌ 未找到 validation_output/ 目录，请确认 Step 1 已正确输出数据。");
    return;
  }

  const generatedFiles = fs
    .readdirSync(VALIDATION_DIR)
    .filter((f) => f.endsWith("_generated.webm"));
  const components = generatedFiles.map((f) => f.replace(/_generated\.webm$/, ""));

  console.log(`🔍 AI 裁判已就位，扫描到 ${components.length} 个待评估产物...`);

  for (const name of components) {
    await validateComponent(name);
    // 防止请求速率超限 (Rate Limit)
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  console.log("\n🏁 自动化验证测试环节执行完毕！");
}

main();