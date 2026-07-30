/**
 * validator_step1.js — 自动化验证体系 Step 1（半自动化基建）
 *
 * 职责：读取某个动效的 Markdown 技术规范（由 analyzer.js 产出），
 *       调用 AI 生成自包含单文件 HTML，再用 Playwright 无头浏览器
 *       加载、主动驱动动画（滚动/悬停/点击/拖拽）并逐帧截图，
 *       最后由 ffmpeg 合成为 <component>_generated.webm，供 Step 2 的 AI 裁判对比。
 *
 * 环境依赖：Node.js + Playwright + ffmpeg（用于帧合成与录制后校验）
 *
 * 用法：
 *   node validator_step1.js <component>   读取 <TARGET_SKILLS_DIR>/<component>.md
 *   node validator_step1.js              不传参时取 TARGET_SKILLS_DIR 下第一个 .md
 *
 * 产物（均落在 validation_output/）：
 *   <component>_test.html            生成的单文件测试页
 *   <component>_generated.webm      无头录制视频（Step 2 裁判对象）
 *   <component>_debug_screenshot.png 渲染校验截图（失败时排查用）
 */

import { GoogleGenAI } from "@google/genai";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import "dotenv/config";
import { setGlobalDispatcher, ProxyAgent } from "undici";

// 🌐 代理配置（复用 analyzer.js 的逻辑）
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
// 本机默认规范目录；可通过环境变量 TARGET_SKILLS_DIR 覆盖
const TARGET_SKILLS_DIR =
  process.env.TARGET_SKILLS_DIR ||
  "/Users/mac/Documents/code/vibe-motion/skills/interaction-library/references";
const VALIDATION_OUTPUT_DIR = path.join(CURRENT_DIR, "validation_output");

// 确保存储生成结果的目录存在
if (!fs.existsSync(VALIDATION_OUTPUT_DIR)) {
  fs.mkdirSync(VALIDATION_OUTPUT_DIR, { recursive: true });
}

/**
 * 核心 1：调用 AI 将 Markdown 规范转换为单文件 HTML 代码
 * @param {string} markdownSpec 动效技术规范（.md 内容）
 * @param {string} componentName 组件名（kebab-case），仅用于日志
 * @returns {Promise<string>} 完整的单文件 HTML 文本
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

【自动化录屏要求（必须实现）】
为了让无头浏览器在无人手动交互的情况下，也能自动录制到完整的动效（否则录屏只会是静止的首帧），生成的页面必须内置“自动演示模式”：
1. 在脚本最开头检测全局变量 \`window.__AUTO_DEMO__\`；当且仅当它为真时，页面加载约 300ms 后自动把动效从头到尾演示一遍，并且**不要停在末尾暗淡/空白状态**：
   - 滚动驱动（scroll-linked / useScroll）：用 setInterval / requestAnimationFrame 程序化滚动（\`window.scrollTo(0, y)\` 或滚动对应容器），做 **0→1→0 往返（ping-pong）**，持续约 5-7 秒，让内容反复经过中心高亮区域。
   - 悬停 / 点击驱动：用定时器在目标元素上循环切换 hover / active 状态，循环 3-4 次，保持元素始终可见。
   - 拖拽驱动：用定时器模拟 drag 进度做往返摆动，不要拖出屏幕或拖到透明度为 0 的状态。
2. 演示期间把 \`window.__AUTO_DEMO_ACTIVE__ = true\` 置位，便于录制器识别；演示结束时可以把 \`window.__AUTO_DEMO_ACTIVE__ = false\`。
3. 正常打开（\`window.__AUTO_DEMO__\` 为假）时，行为与之前一致，仍由用户交互驱动。

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
 * 录制后校验：基于已捕获的 PNG 帧，确保有可见内容且存在帧间差异。
 * @param {string} framesDir 帧图片目录
 * @param {string} componentName
 */
async function assertVideoHasMotion(framesDir, componentName) {
  const pngs = fs
    .readdirSync(framesDir)
    .filter((f) => f.endsWith(".png"))
    .sort()
    .map((f) => path.join(framesDir, f));

  if (pngs.length === 0) {
    throw new Error("未找到任何录制帧，无法校验。");
  }

  // 均匀采样 5 帧
  const sample = [];
  const step = Math.max(1, Math.floor(pngs.length / 5));
  for (let i = 0; i < pngs.length && sample.length < 5; i += step) {
    sample.push(pngs[i]);
  }

  const exec = (cmd, args) =>
    new Promise((resolve, reject) => {
      execFile(cmd, args, { timeout: 30000 }, (err, stdout) => {
        if (err) reject(err);
        else resolve(stdout);
      });
    });

  try {
    let totalBrightness = 0;
    const hashes = [];
    for (const png of sample) {
      const gray = await exec("ffmpeg", [
        "-y", "-i", png,
        "-vf", "format=gray,scale=1x1:flags=area",
        "-f", "rawvideo", "-pix_fmt", "gray", "-",
      ]);
      totalBrightness += gray.charCodeAt(0);
      const hash = await exec("md5", [png]).then((out) => out.trim().split("=").pop().trim());
      hashes.push(hash);
    }

    const avgBrightness = totalBrightness / sample.length;
    const unique = new Set(hashes).size;

    console.log(`🎬 [录制校验] 采样帧=${sample.length}, 平均亮度=${avgBrightness.toFixed(1)}/255, 不同帧=${unique}/${sample.length}`);

    if (avgBrightness < 5) {
      throw new Error(`录制结果过暗（平均亮度 ${avgBrightness.toFixed(1)}），疑似黑屏。`);
    }
    if (unique <= 1) {
      throw new Error("录制结果各帧几乎相同，未捕捉到运动。");
    }
  } catch (err) {
    if (/过暗|黑屏|未捕捉到运动|未找到任何录制帧/.test(err.message)) throw err;
    console.warn("⚠️ 录制后校验失败（非致命）:", err.message);
  }
}

/**
 * 核心 2：使用 Playwright 渲染 HTML 并录制交互视频
 * @param {string} htmlFilePath 生成的 HTML 本地路径
 * @param {string} outputVideoPath 录制视频输出路径
 * @param {string} componentName 组件名（用于命名调试截图）
 */
async function recordComponentVideo(htmlFilePath, outputVideoPath, componentName) {
  console.log(`🎥 [无头录制] 启动 Playwright 逐帧捕获组件视频...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 800, height: 600 },
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));

  const ANIMATION_DURATION_MS = 6500; // 0->1->0 往返滚动约 6.5s
  const FPS = 10;
  const TOTAL_FRAMES = Math.round((ANIMATION_DURATION_MS * FPS) / 1000);
  const framesDir = fs.mkdtempSync(path.join(os.tmpdir(), `vibe-motion-${componentName}-`));

  try {
    const fileUrl = `file://${htmlFilePath}`;
    // 不等所有网络资源完全静默，先等 DOM 就绪；避免 networkidle 因 CDN 慢拖成 30s 长视频
    await page.goto(fileUrl, { waitUntil: "domcontentloaded", timeout: 120000 });
    // 再轮询等待 React/组件真正挂载（#root 有子元素，或 body 内已有可见元素）
    await page.waitForFunction(
      () => {
        const root = document.getElementById("root");
        const bodyHasContent = document.body && document.body.querySelectorAll("*").length > 1;
        return (root && root.childElementCount > 0) || bodyHasContent;
      },
      { timeout: 30000 }
    );

    // === Step 1 渲染校验：页面必须实际画出东西 ===
    const renderInfo = await page.evaluate(() => {
      const root = document.getElementById("root");
      return {
        rootExists: !!root,
        rootChildCount: root ? root.childElementCount : 0,
        bodyElementCount: document.body ? document.body.querySelectorAll("*").length : 0,
        bodyText: document.body ? document.body.innerText.trim().slice(0, 200) : "",
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

    // === 主动驱动动画并逐帧捕获，不把命运交给 LLM 的自动演示 ===
    const scrollInfo = await page.evaluate(() => {
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      return {
        isScrollable: docH > winH * 1.3,
        maxScroll: Math.max(0, docH - winH),
        docH,
        winH,
      };
    });

    if (scrollInfo.isScrollable) {
      console.log(
        `👉 [主动驱动] 检测到可滚动页面（scrollHeight=${scrollInfo.docH}, innerHeight=${scrollInfo.winH}），执行 0→1→0 往返滚动并逐帧捕获...`
      );
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const p = i / (TOTAL_FRAMES - 1);
        // 正弦往返：0 -> 1 -> 0，避免停在末尾暗淡状态
        const scrollY = Math.round(scrollInfo.maxScroll * Math.sin(p * Math.PI));
        await page.evaluate((y) => window.scrollTo(0, y), scrollY);
        await page.screenshot({ path: path.join(framesDir, `frame_${String(i).padStart(4, "0")}.png`) });
      }
    } else {
      console.log(`👉 [兜底交互] 非滚动页面，执行通用触发并逐帧捕获...`);
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const p = i / (TOTAL_FRAMES - 1);
        // 分阶段鼠标交互，覆盖悬停/点击/拖拽
        if (i === 5) await page.mouse.move(400, 300, { steps: 5 });
        if (i === 20) await page.mouse.down();
        if (i === 25) await page.mouse.move(450, 250, { steps: 5 });
        if (i === 35) await page.mouse.up();
        if (i === 45) await page.mouse.move(10, 10, { steps: 5 });
        if (i === 55) await page.mouse.move(400, 300, { steps: 5 });
        await page.screenshot({ path: path.join(framesDir, `frame_${String(i).padStart(4, "0")}.png`) });
      }
    }

    console.log(`✅ [帧捕获完成] 共 ${TOTAL_FRAMES} 帧，正在用 ffmpeg 编码为 webm...`);

    // 用 ffmpeg 把 PNG 序列编码为 webm（VP8，兼容性好）
    await new Promise((resolve, reject) => {
      execFile(
        "ffmpeg",
        [
          "-y",
          "-framerate", String(FPS),
          "-i", path.join(framesDir, "frame_%04d.png"),
          "-c:v", "libvpx",
          "-pix_fmt", "yuv420p",
          "-b:v", "1M",
          "-auto-alt-ref", "0",
          outputVideoPath,
        ],
        { timeout: 60000 },
        (err, stdout, stderr) => {
          if (err) {
            console.error("ffmpeg stderr:", stderr);
            reject(new Error(`ffmpeg 编码失败: ${err.message}`));
          } else {
            resolve(stdout);
          }
        }
      );
    });

    console.log(`✅ [视频生成完毕] 路径: ${outputVideoPath}`);

    // 录制后校验：黑屏/无运动直接失败
    await assertVideoHasMotion(framesDir, componentName);
  } finally {
    await context.close();
    await browser.close();
    // 清理临时帧
    try { fs.rmSync(framesDir, { recursive: true, force: true }); } catch {}
  }
}

async function main() {
  console.log("🚀 开始执行 Step 1 (半自动化验证基建)...");

  const argName = process.argv[2];
  let componentName;
  let mdContent;

  if (argName) {
    // 显式指定组件：读取 TARGET_SKILLS_DIR/<component>.md
    const specPath = path.join(TARGET_SKILLS_DIR, `${argName}.md`);
    if (!fs.existsSync(specPath)) {
      console.error(`❌ 未找到规范文件: ${specPath}`);
      console.error(`   请先由 analyzer.js 生成该组件的规范，或用 TARGET_SKILLS_DIR 指向正确目录。`);
      process.exit(1);
    }
    componentName = argName;
    mdContent = fs.readFileSync(specPath, "utf-8");
  } else {
    // 兜底：取 TARGET_SKILLS_DIR 下第一个 .md
    if (!fs.existsSync(TARGET_SKILLS_DIR)) {
      console.error(`❌ 未找到动效规范目录: ${TARGET_SKILLS_DIR}`);
      process.exit(1);
    }
    const mdFiles = fs.readdirSync(TARGET_SKILLS_DIR).filter((file) => file.endsWith(".md"));
    if (mdFiles.length === 0) {
      console.log("🤷 规范目录下没有任何 .md 文件，请先运行 analyzer.js 生成规范。");
      return;
    }
    const testFile = mdFiles[0];
    componentName = testFile.replace(".md", "");
    mdContent = fs.readFileSync(path.join(TARGET_SKILLS_DIR, testFile), "utf-8");
  }

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
  console.error("\n❌ Step 1 验证失败:");
  console.error(err.message || err);
  process.exit(1);
});
