import { GoogleGenAI } from "@google/genai";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { setGlobalDispatcher, ProxyAgent } from "undici";

// 🌐 代理配置 (复用 analyzer.js 的逻辑)
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
let hasValidationError = false;
const TARGET_SKILLS_DIR = process.env.TARGET_SKILLS_DIR || "/Users/v.sophie.zhu/Documents/code/vibe-ui/vibe-motion/skills/interaction-library/references";
const VALIDATION_OUTPUT_DIR = path.join(CURRENT_DIR, "validation_output");

// 确保存储生成结果的目录存在
if (!fs.existsSync(VALIDATION_OUTPUT_DIR)) {
  fs.mkdirSync(VALIDATION_OUTPUT_DIR, { recursive: true });
}

/**
 * 核心 1：调用 AI 将 Markdown 规范转换为单文件 HTML 代码
 */
async function generateTestCode(markdownSpec, componentName) {
  console.log(`🤖 [代码生成] 正在基于规范生成单文件测试页面...`);
  
  const prompt = `
你是一个顶尖的前端动效工程师。
请阅读以下 Markdown 动效规范，并将其实现为一个**独立、完整、可直接在浏览器双击运行的单文件 HTML**。

【环境要求】
1. 必须是单文件 HTML，包含完整的 <html>, <head>, <body>。
2. 不要有任何构建步骤（No Vite, No Webpack）。
3. 所有的 CSS 和 JS 必须内联在文件中。
4. 如果你需要使用 React, ReactDOM, 或 Framer Motion，必须通过 CDN (unpkg) 以 UMD 格式引入，并使用 Babel standalone 编译包含 JSX 的 <script type="text/babel">。注意：Framer Motion v11 在 unpkg 的 UMD 文件路径是 "https://unpkg.com/framer-motion@11/dist/framer-motion.js"（不是 "framer-motion.umd.js"），全局变量名为 "window.Motion"，API 通过 "const { motion, AnimatePresence } = window.Motion;" 获取。如果你使用 Vanilla JS 或 GSAP，同样通过 CDN 引入；强烈推荐优先使用 Vanilla JS/CSS 或 GSAP 以降低网络依赖风险。

【视觉要求】
1. 全局背景颜色请读取规范中 preview.backgroundColor 的值，或者默认使用深色 #171717。
2. 将动效目标元素放置在屏幕绝对的正中央 (使用 flexbox 居中)。

【交互要求】
1. 严格实现规范中定义的状态机 (FSM) 和物理参数 (Motion Tokens)。
2. 确保组件的 Hitbox 足够大，能够响应鼠标悬停 (Hover) 或拖拽 (Drag) 事件。

【输出限制】
只能输出纯 HTML 代码文本，不要包含在 \`\`\`html \`\`\` 标记中，不要输出任何额外的解释文本。

【动效规范】
${markdownSpec}
`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-pro",
      contents: prompt,
    });

    let htmlContent = response.text.trim();
    // 移除可能带有的 markdown code block 标记
    if (htmlContent.startsWith("```html")) htmlContent = htmlContent.replace(/^```html\n/, "");
    if (htmlContent.startsWith("```")) htmlContent = htmlContent.replace(/^```\n/, "");
    if (htmlContent.endsWith("```")) htmlContent = htmlContent.replace(/\n```$/, "");

    return htmlContent;
  } catch (error) {
    console.error("❌ 代码生成失败:", error);
    throw error;
  }
}

/**
 * 核心 2：使用 Playwright 渲染 HTML 并录制交互视频
 */
async function recordComponentVideo(htmlFilePath, outputVideoPath, componentName) {
  console.log(`🎥 [无头录制] 启动 Playwright 录制组件视频...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 800, height: 600 },
    recordVideo: {
      dir: path.dirname(outputVideoPath),
      size: { width: 800, height: 600 }
    }
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));

  try {
    // 加载本地 HTML 文件
    const fileUrl = `file://${htmlFilePath}`;
    await page.goto(fileUrl, { waitUntil: "networkidle", timeout: 30000 });

    // 给 CDN 资源加载和框架初始化留一点时间
    await page.waitForTimeout(2000);

    // === Step 1 渲染校验：页面必须实际画出东西 ===
    const renderInfo = await page.evaluate(() => {
      const root = document.getElementById("root");
      return {
        rootExists: !!root,
        rootChildCount: root ? root.childElementCount : 0,
        bodyElementCount: document.body ? document.body.querySelectorAll("*").length : 0,
        bodyText: document.body ? document.body.innerText.trim().slice(0, 200) : ""
      };
    });

    const debugScreenshotPath = path.join(VALIDATION_OUTPUT_DIR, `${componentName}_debug_screenshot.png`);
    await page.screenshot({ path: debugScreenshotPath, fullPage: false });

    if (renderInfo.rootChildCount === 0 && renderInfo.bodyElementCount <= 1) {
      throw new Error(
        `Step 1 渲染校验失败：页面未渲染出任何可见元素。\n` +
        `#root 子元素: ${renderInfo.rootChildCount}, body 元素数: ${renderInfo.bodyElementCount}\n` +
        `控制台错误: ${consoleErrors.join("; ") || "无"}\n` +
        `页面 JS 错误: ${pageErrors.join("; ") || "无"}\n` +
        `调试截图: ${debugScreenshotPath}`
      );
    }

    console.log(`✅ [渲染校验通过] #root 子元素: ${renderInfo.rootChildCount}, body 元素数: ${renderInfo.bodyElementCount}`);

    // === 通用探活交互脚本 (模拟人类测试) ===
    console.log(`👉 [交互模拟] 居中悬停...`);
    await page.mouse.move(400, 300, { steps: 20 });
    await page.waitForTimeout(1000); // 观察 Hover 态

    console.log(`👉 [交互模拟] 点击/按住...`);
    await page.mouse.down();
    await page.waitForTimeout(500); // 观察 Active/Drag 态

    console.log(`👉 [交互模拟] 小范围拖动...`);
    await page.mouse.move(450, 250, { steps: 10 });
    await page.waitForTimeout(500);

    console.log(`👉 [交互模拟] 释放...`);
    await page.mouse.up();
    await page.waitForTimeout(1500); // 观察释放后的回弹/物理动画

    console.log(`👉 [交互模拟] 移出视区...`);
    await page.mouse.move(10, 10, { steps: 10 });
    await page.waitForTimeout(1500); // 观察复位动画

  } finally {
    // 关闭 context 触发视频保存
    await context.close();
    await browser.close();

    // Playwright 会生成一个随机名称的 webm 视频，我们需要重命名它
    const recordedVideoPath = await page.video().path();
    if (fs.existsSync(recordedVideoPath)) {
      fs.renameSync(recordedVideoPath, outputVideoPath);
      console.log(`✅ [视频生成完毕] 路径: ${outputVideoPath}`);
    }
  }
}

async function main() {
  console.log("🚀 开始执行 Step 1 (半自动化验证基建)...");

  if (!fs.existsSync(TARGET_SKILLS_DIR)) {
    console.error(`❌ 未找到动效规范目录: ${TARGET_SKILLS_DIR}`);
    return;
  }

  // 扫读所有的 .md 规范
  const mdFiles = fs.readdirSync(TARGET_SKILLS_DIR).filter(file => file.endsWith('.md'));
  
  if (mdFiles.length === 0) {
      console.log("🤷 规范目录下没有任何 .md 文件。");
      return;
  }

  // 这里为了演示，暂时只取第一个进行测试验证
  const testFile = mdFiles[0]; 
  const componentName = testFile.replace('.md', '');
  const mdContent = fs.readFileSync(path.join(TARGET_SKILLS_DIR, testFile), "utf-8");
  
  console.log(`\n📌 正在测试组件: ${componentName}`);
  const outputHtmlPath = path.join(VALIDATION_OUTPUT_DIR, `${componentName}_test.html`);
  const outputVideoPath = path.join(VALIDATION_OUTPUT_DIR, `${componentName}_generated.webm`);

  // 1. 生成代码
  const htmlCode = await generateTestCode(mdContent, componentName);
  fs.writeFileSync(outputHtmlPath, htmlCode, "utf-8");
  console.log(`💾 临时测试页面已保存: ${outputHtmlPath}`);

  // 2. 无头录屏（内部包含 Step 1 渲染校验）
  await recordComponentVideo(outputHtmlPath, outputVideoPath, componentName);

  console.log(`\n🎉 Step 1 测试流程跑通且渲染校验通过！`);
  console.log(`👀 请前往 ${VALIDATION_OUTPUT_DIR} 目录查看生成的 HTML 源码与实录视频。`);
}

main().catch((err) => {
  hasValidationError = true;
  console.error("\n❌ Step 1 验证失败:");
  console.error(err.message || err);
  process.exit(1);
});