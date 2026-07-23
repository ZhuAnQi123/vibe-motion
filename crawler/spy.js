import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import "dotenv/config";

const HISTORY_FILE_PATH = path.join(process.cwd(), "processed_urls.json");

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
    console.log(`📝 已将链接记录至历史账本: ${url}`);
  }
}

async function downloadVideo(url, outputPath) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    const fileStream = fs.createWriteStream(outputPath);
    await pipeline(Readable.fromWeb(response.body), fileStream);
    console.log(`✅ 视频成功下载至: ${outputPath}`);
  } catch (err) {
    console.error(`❌ 视频下载失败 (${url}):`, err.message);
  }
}

async function run() {
  console.log("🚀 正在启动浏览器...");
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  const TARGET_WEBSITE = process.env.TARGET_WEBSITE || "https://recent.design/";

  try {
    console.log(`🌐 正在打开 website: ${TARGET_WEBSITE}`);
    await page.goto(TARGET_WEBSITE, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2000);

    console.log("🔍 正在检测是否存在订阅弹窗干扰...");
    const isModalVisible = await page.evaluate(() => {
      return (
        document.body.innerText.includes("Stay ahead of trends") ||
        document.body.innerText.includes("Subscribe")
      );
    });

    if (isModalVisible) {
      console.log("🚨 侦测到订阅弹窗挡路！正在执行空白处点击以关闭弹窗...");
      await page.mouse.click(100, 100);
      await page.waitForTimeout(1000);
      console.log("👍 弹窗已成功驱散。");
    }

    console.log('🎯 正在寻找并点击 "Motion" 筛选标签...');
    const motionButton = page
      .locator(
        'button:has-text("Motion"), a:has-text("Motion"), [class*="tag"]:has-text("Motion")',
      )
      .first();
    await motionButton.waitFor({ state: "visible", timeout: 5000 });
    await motionButton.click({ force: true });
    console.log("✨ 已成功切换到 Motion 筛选视图，等待列表加载...");
    await page.waitForTimeout(3000);

    console.log("📜 正在向下滚动页面以加载更多动态内容...");
    for (let i = 0; i < 6; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await page.waitForTimeout(1200);
    }

    const cardSelectors = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll('main a, .grid a, [class*="card"] a'),
      );
      return links
        .map((a) => a.href)
        .filter(
          (href) => href && (href.includes("/i/") || href.includes("/post/")),
        );
    });

    const uniqueCardUrls = [...new Set(cardSelectors)];
    console.log(`📚 页面总共刷出 ${uniqueCardUrls.length} 个 Motion 条目链接。`);

    const processedUrls = getProcessedUrls();
    const newCardUrls = uniqueCardUrls.filter(
      (url) => !processedUrls.includes(url),
    );
    console.log(`🔍 账本过滤后：发现 ${newCardUrls.length} 个未爬取的新品。`);

    if (newCardUrls.length === 0) {
      console.log("🏁 首页均为已处理条目，自动化爬取安全退出。");
      return;
    }

    const maxItemsToFetch = Math.min(newCardUrls.length, 20);
    const outputBaseDir = path.join(process.cwd(), "output");
    if (fs.existsSync(outputBaseDir)) {
      fs.rmSync(outputBaseDir, { recursive: true, force: true });
    }
    fs.mkdirSync(outputBaseDir);

    for (let index = 0; index < maxItemsToFetch; index++) {
      const cardUrl = newCardUrls[index];
      console.log(`\n--------------------------------------------------`);
      console.log(`🔄 [${index + 1}/${maxItemsToFetch}] 跳转至独立详情: ${cardUrl}`);

      try {
        await page.goto(cardUrl, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForSelector("video", { timeout: 10000 });
        await page.waitForTimeout(1000);

        const metaData = await page.evaluate(() => {
          const titleEl = document.querySelector('h1, [class*="title"]');
          const title = titleEl ? titleEl.innerText.trim() : "Unknown Title";

          const pNodes = Array.from(document.querySelectorAll('p, [class*="description"]'));
          let description = "";
          for (const p of pNodes) {
            const txt = p.innerText || "";
            if (txt.length > 20 && !txt.includes("Subscribe") && !txt.includes("online")) {
              description = txt.trim();
              break;
            }
          }

          const info = { source: "", category: "", style: [], color: "", interaction: "" };
          const allElements = Array.from(document.querySelectorAll("div, tr, li"));
          allElements.forEach((el) => {
            const innerText = el.innerText || "";
            if (innerText.startsWith("Source") && el.querySelector("a")) {
              const sourceLink = el.querySelector("a");
              if (sourceLink) info.source = sourceLink.href;
            }
            if (innerText.includes("Category")) {
              info.category = innerText.replace("Category", "").replace(/\n/g, " ").trim();
            }
            if (innerText.includes("Color")) {
              info.color = innerText.replace("Color", "").replace(/\n/g, " ").trim();
            }
            if (innerText.includes("Interaction")) {
              info.interaction = innerText.replace("Interaction", "").replace(/\n/g, " ").trim();
            }
            // 🎯 提取 Style 标签列表
            if (innerText.includes("Style")) {
              const styleText = innerText.replace("Style", "").trim();
              info.style = styleText.split("\n").map((s) => s.trim()).filter(Boolean);
            }
          });

          const videoEl = document.querySelector("video source") || document.querySelector("video");
          const videoUrl = videoEl ? videoEl.src : "";

          return { title, description, videoUrl, ...info };
        });

        metaData.cardUrl = cardUrl;
        console.log(`🎉 抓取页面元数据 [Item ${index}]:`, metaData);

        if (!metaData.videoUrl) {
          console.log(`⚠️ 条目 ${index} 未找到有效视频，跳过下载。`);
          saveToHistory(cardUrl);
          continue;
        }

        // 🛡️ 防线 1：根据详情页的 Style 列表、Title 和 Description 进行精准拦截
        const blacklist = [
          "3d",
          "particle",
          "particles",
          "three.js",
          "threejs",
          "webgl",
          "cinema 4d",
          "c4d",
          "blender",
          "spline",
          "octane",
          "character animation",
          "geometry deformation"
        ];

        // 检查 Style 数组（例如包含 ["Abstract", "Minimal", "3D", "High Contrast"]）
        const hasBlacklistedStyle = Array.isArray(metaData.style) && metaData.style.some((styleTag) =>
          blacklist.includes(styleTag.toLowerCase().trim())
        );

        // 检查全局 Meta 字段
        const fullMetaText = JSON.stringify(metaData).toLowerCase();
        const hasBlacklistedKeyword = blacklist.some((keyword) => fullMetaText.includes(keyword));

        if (hasBlacklistedStyle || hasBlacklistedKeyword) {
          console.log(`🛑 [过滤跳过] 条目 ${index} 属于 3D/粒子/WebGL 场景（Style 包含 3D 或相关关键字），不适合 UI 交互库收录。`);
          saveToHistory(cardUrl);
          continue;
        }

        const itemDir = path.join(outputBaseDir, `item_${index}`);
        if (!fs.existsSync(itemDir)) fs.mkdirSync(itemDir);

        fs.writeFileSync(path.join(itemDir, "meta.json"), JSON.stringify(metaData, null, 2), "utf-8");

        await downloadVideo(metaData.videoUrl, path.join(itemDir, "raw_video.mp4"));
      } catch (itemError) {
        console.error(`❌ 抓取单条数据失败 [索引 ${index}]:`, itemError.message);
      }
    }

    console.log("\n==================================================");
    console.log(`🏁 抓取阶段结束！未被过滤的素材已存放至 output/ 目录。`);
  } catch (error) {
    console.error("❌ 脚本运行发生严重错误:", error);
  } finally {
    await browser.close();
    console.log("🤖 浏览器已关闭。");
  }
}

run();