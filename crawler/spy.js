import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

async function downloadVideo(url, outputPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
    const fileStream = fs.createWriteStream(outputPath);
    await pipeline(Readable.fromWeb(response.body), fileStream);
    console.log(`✅ 视频成功下载至: ${outputPath}`);
  } catch (err) {
    console.error(`❌ 视频下载失败 (${url}):`, err.message);
  }
}

async function run() {
  console.log('🚀 正在启动浏览器...');
  const browser = await chromium.launch({ headless: false }); // 建议保持 false 观察其批量行为
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  const TARGET_WEBSITE = process.env.TARGET_WEBSITE;

  try {
    console.log('🌐 正在打开 website...');
    await page.goto(TARGET_WEBSITE, { waitUntil: 'networkidle' });

    // 1. 切换到 Motion 视图
    console.log('🎯 正在寻找并点击 "Motion" 筛选标签...');
    const motionButton = page.locator('button:has-text("Motion"), a:has-text("Motion"), div:has-text("Motion")').first();
    await motionButton.waitFor({ state: 'visible', timeout: 5000 });
    await motionButton.click();
    console.log('✨ 已成功切换到 Motion 筛选视图，等待列表加载...');
    await page.waitForTimeout(3000);

    // 2. 模拟向下滚动，加载更多卡片
    console.log('📜 正在向下滚动页面以加载更多动态内容...');
    for (let i = 0; i < 3; i++) { // 滚动3次，大约能刷出几十个。你可以根据需要调大循环次数
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await page.waitForTimeout(1500);
    }

    // 3. 收集当前页面上所有属于 Motion 的卡片选择器或索引
    // 页面上的作品链接通常带有固定格式，或者我们直接找网格中的 a 标签
    const cardSelectors = await page.evaluate(() => {
      // 找到主要内容区域里带有跳转箭头的或者卡片链接
      const links = Array.from(document.querySelectorAll('main a, .grid a, [class*="card"] a'));
      // 过滤掉左侧边栏、工具栏里无关的链接，只保留真正作品的 href
      return links
        .map(a => a.href)
        .filter(href => href && (href.includes('/i/') || href.includes('/post/')));
    });

    // 去重
    const uniqueCardUrls = [...new Set(cardSelectors)];
    console.log(`📚 成功收集到 ${uniqueCardUrls.length} 个 Motion 条目链接。准备开始批量抓取...`);

    // 限制抓取数量，这里示例先抓前 10 个（你可以改为 uniqueCardUrls.length 抓取全部）
    const maxItemsToFetch = Math.min(uniqueCardUrls.length, 10); 
    const outputBaseDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputBaseDir)) fs.mkdirSync(outputBaseDir);

    // 4. 循环遍历每一个动效详情页
    for (let index = 0; index < maxItemsToFetch; index++) {
      const cardUrl = uniqueCardUrls[index];
      console.log(`\n--------------------------------------------------`);
      console.log(`🔄 [${index + 1}/${maxItemsToFetch}] 正在跳转至详情: ${cardUrl}`);
      
      try {
        // 直接新开或跳转到详情页 URL，这样提取数据环境最干净，不会受到主页干扰
        await page.goto(cardUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForSelector('video', { timeout: 10000 });
        await page.waitForTimeout(1000); // 稳妥等待动画加载完毕

        // 精准数据提取
        const metaData = await page.evaluate(() => {
          // 1. 提取标题：通常是页面唯一的 h1，或者面包屑之后的标题
          const titleEl = document.querySelector('h1, [class*="title"]');
          const title = titleEl ? titleEl.innerText.trim() : 'Unknown Title';

          // 2. 提取描述：在详情面板中，通常紧跟在标题和作者后面的那个段落
          // 排除包含 "Subscribe" 或 "online" 的全局段落
          const pNodes = Array.from(document.querySelectorAll('p, [class*="description"]'));
          let description = '';
          for (const p of pNodes) {
            const txt = p.innerText || '';
            if (txt.length > 20 && !txt.includes('Subscribe') && !txt.includes('online')) {
              description = txt.trim();
              break;
            }
          }

          // 3. 提取侧边栏/信息栏的各项标签 (Source, Category, Style, Color, Interaction)
          const info = { source: '', category: '', style: [], color: '', interaction: '' };
          
          // 遍历全页所有的 div，寻找包含特定文本的项目
          const allElements = Array.from(document.querySelectorAll('div, tr, li'));
          allElements.forEach(el => {
            const innerText = el.innerText || '';
            
            // 针对 Source 的精准解析 (结合你发来的 HTML 截图结构)
            if (innerText.startsWith('Source') && el.querySelector('a')) {
              const sourceLink = el.querySelector('a');
              if (sourceLink) info.source = sourceLink.href;
            }
            
            // 针对其他表格元数据的解析
            if (innerText.includes('Category')) {
              info.category = innerText.replace('Category', '').replace(/\n/g, ' ').trim();
            }
            if (innerText.includes('Color')) {
              info.color = innerText.replace('Color', '').replace(/\n/g, ' ').trim();
            }
            if (innerText.includes('Interaction')) {
              info.interaction = innerText.replace('Interaction', '').replace(/\n/g, ' ').trim();
            }
            // Style 往往有多个标签，我们用数组存
            if (innerText.includes('Style')) {
              const styleText = innerText.replace('Style', '').trim();
              info.style = styleText.split('\n').map(s => s.trim()).filter(Boolean);
            }
          });

          // 4. 提取视频直链
          const videoEl = document.querySelector('video source') || document.querySelector('video');
          const videoUrl = videoEl ? videoEl.src : '';

          return { title, description, videoUrl, ...info };
        });

        console.log(`🎉 成功抓取 [Item ${index}]:`, metaData);

        if (!metaData.videoUrl) {
          console.log(`⚠️ 条目 ${index} 未找到有效视频，跳过下载。`);
          continue;
        }

        // 5. 按索引 index 分组创建专属文件夹保存
        const itemDir = path.join(outputBaseDir, `item_${index}`);
        if (!fs.existsSync(itemDir)) fs.mkdirSync(itemDir);

        // 存储当前条目的元数据
        fs.writeFileSync(
          path.join(itemDir, 'meta.json'), 
          JSON.stringify(metaData, null, 2), 
          'utf-8'
        );

        // 下载当前文件夹对应的视频
        await downloadVideo(metaData.videoUrl, path.join(itemDir, 'raw_video.mp4'));

      } catch (itemError) {
        console.error(`❌ 抓取单条数据失败 [索引 ${index}]:`, itemError.message);
      }
    }

    console.log('\n==================================================');
    console.log(`🏁 批量抓取任务结束！所有数据已分类存放至 output/ 文件夹下。`);

  } catch (error) {
    console.error('❌ 脚本运行期间发生严重错误:', error);
  } finally {
    await browser.close();
    console.log('🤖 自动化浏览器已关闭。');
  }
}

run();