import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import "dotenv/config"; // 引入环境变量

// 核心账本路径
const HISTORY_FILE_PATH = path.join(process.cwd(), "processed_urls.json");

// 读取已处理过的账本链接
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
  const TARGET_WEBSITE = process.env.TARGET_WEBSITE 

  try {
    console.log(`🌐 正在打开 website: ${TARGET_WEBSITE}`);
    await page.goto(TARGET_WEBSITE, { waitUntil: "networkidle" });

    // 1. 切换到 Motion 视图
    console.log('🎯 正在寻找并点击 "Motion" 筛选标签...');
    const motionButton = page
      .locator(
        'button:has-text("Motion"), a:has-text("Motion"), div:has-text("Motion")',
      )
      .first();
    await motionButton.waitFor({ state: "visible", timeout: 5000 });
    await motionButton.click();
    console.log("✨ 已成功切换到 Motion 筛选视图，等待列表加载...");
    await page.waitForTimeout(3000);

    // 2. 模拟向下滚动（增加滚动次数到 6 次，确保刷出至少 20-30 个卡片）
    console.log("📜 正在向下滚动页面以加载更多动态内容...");
    for (let i = 0; i < 6; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await page.waitForTimeout(1200);
    }

    // 3. 收集当前页面上所有属于 Motion 的卡片链接
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

    // 去重
    const uniqueCardUrls = [...new Set(cardSelectors)];
    console.log(
      `📚 页面总共刷出 ${uniqueCardUrls.length} 个 Motion 条目链接。`,
    );

    // 🌟 【核心去重硬核逻辑】与历史账本进行比对过滤
    const processedUrls = getProcessedUrls();
    const newCardUrls = uniqueCardUrls.filter(
      (url) => !processedUrls.includes(url),
    );
    console.log(`🔍 账本过滤后：发现 ${newCardUrls.length} 个未爬取的新品。`);

    if (newCardUrls.length === 0) {
      console.log(
        "🏁 首页全是熟面孔，没有发现新品。本次抓取全自动化安全退出。",
      );
      return;
    }

    // 🌟 【效率提升】限制单次抓取数量提升到 20 个
    const maxItemsToFetch = Math.min(newCardUrls.length, 20);
    console.log(`🚀 本次将自动流水线式抓取前 ${maxItemsToFetch} 个新品...`);

    const outputBaseDir = path.join(process.cwd(), "output");
    // 如果存在老 output 文件夹，先清空它，确保本次生产线文件夹不混淆
    if (fs.existsSync(outputBaseDir)) {
      fs.rmSync(outputBaseDir, { recursive: true, force: true });
    }
    fs.mkdirSync(outputBaseDir);

    // 4. 循环遍历每一个动效详情页
    for (let index = 0; index < maxItemsToFetch; index++) {
      const cardUrl = newCardUrls[index];
      console.log(`\n--------------------------------------------------`);
      console.log(
        `🔄 [${index + 1}/${maxItemsToFetch}] 正在跳转至独立详情: ${cardUrl}`,
      );

      try {
        await page.goto(cardUrl, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForSelector("video", { timeout: 10000 });
        await page.waitForTimeout(1000);

        // 精准数据提取
        const metaData = await page.evaluate(() => {
          const titleEl = document.querySelector('h1, [class*="title"]');
          const title = titleEl ? titleEl.innerText.trim() : "Unknown Title";

          const pNodes = Array.from(
            document.querySelectorAll('p, [class*="description"]'),
          );
          let description = "";
          for (const p of pNodes) {
            const txt = p.innerText || "";
            if (
              txt.length > 20 &&
              !txt.includes("Subscribe") &&
              !txt.includes("online")
            ) {
              description = txt.trim();
              break;
            }
          }

          const info = {
            source: "",
            category: "",
            style: [],
            color: "",
            interaction: "",
          };
          const allElements = Array.from(
            document.querySelectorAll("div, tr, li"),
          );
          allElements.forEach((el) => {
            const innerText = el.innerText || "";
            if (innerText.startsWith("Source") && el.querySelector("a")) {
              const sourceLink = el.querySelector("a");
              if (sourceLink) info.source = sourceLink.href;
            }
            if (innerText.includes("Category")) {
              info.category = innerText
                .replace("Category", "")
                .replace(/\n/g, " ")
                .trim();
            }
            if (innerText.includes("Color")) {
              info.color = innerText
                .replace("Color", "")
                .replace(/\n/g, " ")
                .trim();
            }
            if (innerText.includes("Interaction")) {
              info.interaction = innerText
                .replace("Interaction", "")
                .replace(/\n/g, " ")
                .trim();
            }
            if (innerText.includes("Style")) {
              const styleText = innerText.replace("Style", "").trim();
              info.style = styleText
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
            }
          });

          const videoEl =
            document.querySelector("video source") ||
            document.querySelector("video");
          const videoUrl = videoEl ? videoEl.src : "";

          return { title, description, videoUrl, ...info };
        });

        // 🌟 将卡片原始的详情链接(cardUrl)写入到 meta.json 中，方便后续 analyzer 追踪
        metaData.cardUrl = cardUrl;

        console.log(`🎉 成功抓取 [Item ${index}]:`, metaData);

        if (!metaData.videoUrl) {
          console.log(`⚠️ 条目 ${index} 未找到有效视频，跳过下载。`);
          continue;
        }

        const itemDir = path.join(outputBaseDir, `item_${index}`);
        if (!fs.existsSync(itemDir)) fs.mkdirSync(itemDir);

        // 存储当前条目的元数据
        fs.writeFileSync(
          path.join(itemDir, "meta.json"),
          JSON.stringify(metaData, null, 2),
          "utf-8",
        );

        // 下载视频
        await downloadVideo(
          metaData.videoUrl,
          path.join(itemDir, "raw_video.mp4"),
        );
      } catch (itemError) {
        console.error(
          `❌ 抓取单条数据失败 [索引 ${index}]:`,
          itemError.message,
        );
      }
    }

    console.log("\n==================================================");
    console.log(`🏁 批量抓取任务结束！所有全新数据已存放至 output/ 文件夹下。`);
    console.log(
      `💡 下一步：请开启代理的 TUN 模式，并运行 node analyzer.js 进行 AI 解析！`,
    );
  } catch (error) {
    console.error("❌ 脚本运行期间发生严重错误:", error);
  } finally {
    await browser.close();
    console.log("🤖 自动化浏览器已关闭。");
  }
}

run();
