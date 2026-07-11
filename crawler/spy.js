import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import "dotenv/config";

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
  const browser = await chromium.launch({ headless: false }); // 建议保持 false 观察其批量行为
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  const TARGET_WEBSITE = process.env.TARGET_WEBSITE;

  try {
    console.log("🌐 正在打开 website..." + TARGET_WEBSITE);
    await page.goto(TARGET_WEBSITE, { waitUntil: "networkidle" });

    // 1. 切换到 Motion 视图 (优化：增加多情况兼容)
    console.log('🎯 正在寻找并点击 "Motion" 筛选标签...');
    const motionButton = page
      .locator("button, a, div")
      .filter({ hasText: /^Motion$/i }) // 精准匹配单词 Motion，忽略大小写
      .first();

    await motionButton.waitFor({ state: "visible", timeout: 8000 });
    await motionButton.click();
    console.log("✨ 已点击 Motion 筛选，等待列表刷新...");
    // 优化：与其死等3秒，不如等待网络空闲
    await page.waitForLoadState("networkidle");

    // 2. 模拟向下滚动，加载更多卡片
    console.log("📜 正在向下滚动页面以加载更多动态内容...");
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await page.waitForTimeout(1500);
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

    const uniqueCardUrls = [...new Set(cardSelectors)];
    console.log(`📚 成功收集到 ${uniqueCardUrls.length} 个 Motion 条目链接。`);

    const maxItemsToFetch = Math.min(uniqueCardUrls.length, 10);
    const outputBaseDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputBaseDir)) fs.mkdirSync(outputBaseDir);

    // 💡 核心修改：循环遍历详情页
    for (let index = 0; index < maxItemsToFetch; index++) {
      const cardUrl = uniqueCardUrls[index];
      console.log(`\n--------------------------------------------------`);
      console.log(
        `🔄 [${index + 1}/${maxItemsToFetch}] 正在跳转至详情: ${cardUrl}`,
      );

      // 💡 关键改动：为每个条目创建独立的独立页面，防止互相污染和崩溃
      const detailPage = await context.newPage();

      try {
        // 使用新页面跳转
        await detailPage.goto(cardUrl, {
          waitUntil: "networkidle",
          timeout: 30000,
        });

        // 增加对人机验证/加载失败的判断
        try {
          await detailPage.waitForSelector("video", { timeout: 8000 });
        } catch (e) {
          console.log(
            `⚠️ 页面可能未加载出视频元素(可能触发了验证码或格式不同)，跳过此条目。`,
          );
          continue;
        }

        await detailPage.waitForTimeout(1000);

        // 精准数据提取 (改用 detailPage)
        const metaData = await detailPage.evaluate(() => {
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
            if (innerText.includes("Category"))
              info.category = innerText
                .replace("Category", "")
                .replace(/\n/g, " ")
                .trim();
            if (innerText.includes("Color"))
              info.color = innerText
                .replace("Color", "")
                .replace(/\n/g, " ")
                .trim();
            if (innerText.includes("Interaction"))
              info.interaction = innerText
                .replace("Interaction", "")
                .replace(/\n/g, " ")
                .trim();
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

        console.log(`🎉 成功抓取 [Item ${index}]:`, metaData);

        if (!metaData.videoUrl) {
          console.log(`⚠️ 条目 ${index} 未找到有效视频，跳过下载。`);
          continue;
        }

        const itemDir = path.join(outputBaseDir, `item_${index}`);
        if (!fs.existsSync(itemDir)) fs.mkdirSync(itemDir);

        fs.writeFileSync(
          path.join(itemDir, "meta.json"),
          JSON.stringify(metaData, null, 2),
          "utf-8",
        );
        await downloadVideo(
          metaData.videoUrl,
          path.join(itemDir, "raw_video.mp4"),
        );
      } catch (itemError) {
        console.error(
          `❌ 抓取单条数据失败 [索引 ${index}]:`,
          itemError.message,
        );
      } finally {
        // 💡 关键改动：无论成功还是失败，抓完一定要关闭这个标签页，释放内存
        await detailPage.close();
        // 稍微休眠 1.5 秒，避免请求频率过高被封 IP
        await page.waitForTimeout(1500);
      }
    }

    console.log("\n==================================================");
    console.log(`🏁 批量抓取任务结束！所有数据已分类存放至 output/ 文件夹下。`);
  } catch (error) {
    console.error("❌ 脚本运行期间发生严重错误:", error);
  } finally {
    await browser.close();
    console.log("🤖 自动化浏览器已关闭。");
  }
}

run();
