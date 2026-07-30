/**
 * validator_step3.js — 自动化验证体系 Step 3 (自迭代闭环系统 Self-Healing)
 *
 * 职责：读取 Step 2 AI 裁判输出的 validation_report.json，
 *       若未通过，则提取 discrepancies 缺陷报告，
 *       连同原有的 Markdown 规范发给 AI 进行反思与修正，
 *       最后覆盖写入原 .md 文件，完成自愈闭环。
 *
 * 用法：
 *   node validator_step3.js <component>   修复指定组件
 *   node validator_step3.js               自动扫描 validation_output 寻找未通过的报告进行修复
 */

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { setGlobalDispatcher, ProxyAgent } from "undici";

// 🌐 代理配置
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
const TARGET_SKILLS_DIR =
  process.env.TARGET_SKILLS_DIR ||
  "/Users/mac/Documents/code/vibe-motion/skills/interaction-library/references";

async function healComponent(componentName) {
  console.log(`\n🏥 [自愈系统] 开始为组件启动 Step 3 修复流程: ${componentName}`);

  const reportPath = path.join(VALIDATION_DIR, `${componentName}_validation_report.json`);
  const mdSpecPath = path.join(TARGET_SKILLS_DIR, `${componentName}.md`);

  if (!fs.existsSync(reportPath)) {
    console.error(`❌ 找不到验证报告: ${reportPath}`);
    return;
  }
  if (!fs.existsSync(mdSpecPath)) {
    console.error(`❌ 找不到原规范文件: ${mdSpecPath}`);
    return;
  }

  const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));

  if (report.passed) {
    console.log(`✅ 组件 ${componentName} 已经通过验证，无需修复。`);
    return;
  }

  const discrepancies = report.discrepancies;
  if (!discrepancies || discrepancies.length === 0) {
    console.log(`⚠️ 组件 ${componentName} 未通过验证，但未提供具体的缺陷 (discrepancies)，无法修复。`);
    return;
  }

  const mdContent = fs.readFileSync(mdSpecPath, "utf-8");
  console.log(`🛠️ 检测到 ${discrepancies.length} 个缺陷，正在呼叫 AI 重新生成规范...`);

  const prompt = `
你是一个顶尖的前端动效工程师。
我们之前基于一份 Markdown 动效规范生成了代码并进行了自动化录屏验证，但 QA 裁判指出了以下实现与原视频不符的缺陷（Discrepancies）：

【缺陷报告】
${discrepancies.map((d, i) => `${i + 1}. ${d}`).join("\n")}

【当前的动效规范】
${mdContent}

【你的任务】
请仔细阅读缺陷报告，并对上方的【当前的动效规范】进行**针对性修改和完善**。
请确保在规范的 'Core Experience', 'Detailed Timeline Sequence' 以及物理参数（如 easing, duration）中，明确增加或修正相关描述，以解决裁判指出的问题。

【输出要求】
1. 只输出完整的、修正后的 Markdown 规范内容。
2. 不要包含在 \`\`\`markdown \`\`\` 标记中，直接输出纯文本。
3. 不要输出任何额外的解释文本。
`;

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-1.5-pro-latest",
      contents: prompt,
    });

    let newMdContent = response.text.trim();
    if (newMdContent.startsWith("```markdown")) newMdContent = newMdContent.replace(/^```markdown\n/, "");
    if (newMdContent.startsWith("```")) newMdContent = newMdContent.replace(/^```\n/, "");
    if (newMdContent.endsWith("```")) newMdContent = newMdContent.replace(/\n```$/, "").trim();

    // 备份旧文件
    const backupPath = path.join(TARGET_SKILLS_DIR, `${componentName}.md.bak`);
    fs.copyFileSync(mdSpecPath, backupPath);
    console.log(`📋 已备份旧规范至: ${backupPath}`);

    // 覆盖写入新文件
    fs.writeFileSync(mdSpecPath, newMdContent, "utf-8");
    console.log(`✅ [自愈成功] 已将修正后的规范写入: ${mdSpecPath}`);
    console.log(`   👉 请重新运行 Step 1 和 Step 2 进行再次验证:`);
    console.log(`      node validator_step1.js ${componentName}`);
    console.log(`      node validator.js`);

  } catch (error) {
    console.error(`💥 [AI 修复] 尝试修复 ${componentName} 时发生异常:`, error.message || error);
  }
}

async function main() {
  const argName = process.argv[2];

  if (argName) {
    await healComponent(argName);
  } else {
    console.log("🔍 [自愈系统] 正在扫描 validation_output 目录寻找未通过的报告...");
    const files = fs.readdirSync(VALIDATION_DIR).filter(f => f.endsWith("_validation_report.json"));

    if (files.length === 0) {
      console.log("🤷 没有找到任何 `_validation_report.json` 文件。");
      return;
    }

    for (const reportFile of files) {
      try {
        const report = JSON.parse(fs.readFileSync(path.join(VALIDATION_DIR, reportFile), "utf-8"));
        if (!report.passed) {
          const componentName = reportFile.replace("_validation_report.json", "");
          await healComponent(componentName);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 避免速率超限
        }
      } catch (e) {
        console.warn(`⚠️ 无法解析报告文件 ${reportFile}，已跳过。错误: ${e.message}`);
      }
    }
  }
  console.log("\n🏁 Step 3 自愈流程执行完毕！");
}

main().catch((err) => {
  console.error("\n❌ Step 3 修复失败:", err.message || err);
  process.exit(1);
});