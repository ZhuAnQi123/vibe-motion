# Vibe Motion Crawler 🎬

这是一个专为 `vibe-motion` 动效资产库设计的多模态全自动抓取、媒体预处理与 AI 分析工具链。它能够自动化地从目标动效网站获取灵感，利用 Playwright 进行高精准的数据清洗，**通过 FFmpeg 自动化进行视频压缩与格式转码**，并直接投喂给 Gemini 1.5 Pro 多模态大模型，最终全自动输出符合严格排版规范的动效技术说明书（Markdown），并将重命名后的高品质视频同步推送至 Cloudflare R2 云存储。

---

## 📂 目录结构

项目采用高内聚、低耦合的设计，整体嵌套在 `vibe-motion` 仓库的根目录下：

```text
vibe-motion/
├── skills/
│   └── interaction-library/
│       └── references/          # 🎯 AI 脚本解析出的 .md 规范最终落盘于此
└── crawler/                     # 🚀 爬虫与 AI 全家桶核心目录
    ├── .aidev/                  # 📓 AI 辅助开发工作区 (包含指南、日志、规划)
    │   ├── AIDEV_GUIDE.md       # 📖 AI 辅助开发团队协作与使用指南
    │   └── plans/auto_test.md   # 🚥 自动化测试与自迭代架构的演进路线图
    ├── .env                     # 🔒 本地私密环境变量（API Key、R2 凭证、路径等）
    ├── .gitignore               # 🚫 Git 忽略配置文件（防止凭证泄露）
    ├── package.json             # 📦 项目依赖与运行脚本
    ├── AI_WORKFLOW_PROMPT.md    # 📝 塞给 Gemini 的核心动效分析 Prompt 模板
    ├── processed_urls.json      # 💾 增量更新历史账本（以详情页 cardUrl 为准，防止重复抓取）
    ├── spy.js                   # 🕷️ 阶段一：Playwright 自动化列表与详情页爬虫（含智能防弹窗干扰机制）
    ├── analyzer.js              # 🤖 阶段二：FFmpeg 预处理、Gemini 多模态解析与 R2 上传器
    ├── validator_step1.js        # 🧪 阶段三·Step1：读 .md 规范 → AI 生成单文件 HTML → Playwright 无头录制
    ├── validator.js             # 🧪 阶段三·Step2：多模态 AI 裁判，对比 原始视频/生成视频/规范 并打分
    └── output/                  # 📁 临时媒体缓存（执行完一轮后建议手动或脚本自动清空）

```

---

## 🛠️ 环境准备与安装

### 1. 安装系统底层依赖 (Mac)

由于项目集成了视频自动化转码与极限压缩逻辑，系统必须具备 `ffmpeg` 命令行工具：

```bash
brew install ffmpeg

```

### 2. 安装项目依赖

在终端中进入 `crawler` 目录，执行以下命令安装核心依赖：

```bash
cd crawler
npm install

```

### 3. 补全浏览器内核

首次运行前需要补全 Playwright 专属的 Chromium 浏览器内核：

```bash
npx playwright install chromium

```

### 4. 配置本地环境变量 `.env`

在 `crawler` 目录下创建一个 `.env` 文件，并根据你的本地实际路径、API 密钥以及 Cloudflare 凭证进行配置：

```env
# 谷歌大模型 API 密钥
GEMINI_API_KEY="AIzaSyYourActualGeminiApiKeyHere..."

# 目标动效抓取站点
TARGET_WEBSITE="[https://recent.design/](https://recent.design/)"

# 最终生成的 Markdown 规范落盘绝对路径
TARGET_SKILLS_DIR="/Users/mac/Documents/code/vibe-motion/skills/interaction-library/references"

# Cloudflare R2 云存储配置
CLOUDFLARE_ACCOUNT_ID="你的32位账户ID"
R2_ACCESS_KEY_ID="你的API令牌AccessKeyID"
R2_SECRET_ACCESS_KEY="你的API令牌SecretAccessKey"
R2_BUCKET_NAME="vibe-motion-assets"

```

---

## 🏃 核心工作流使用指南

整个全自动流分为**两个阶段**执行：

### 阶段一：动效数据与视频抓取 (`spy.js`)

运行爬虫脚本，它将自动打开浏览器，全自动检测并**无痕驱散全屏订阅弹窗干扰**，随后切换至 `Motion` 视图，模拟向下滚动加载最新动效。

```bash
node spy.js

```

- **卡片级去重机制**：该脚本在后续运行时会自动读取 `processed_urls.json` 历史账本，比对详情页链接（`cardUrl`），**精准做到首页新品增量抓取**。如果首页条目均已处理过，脚本将直接安全退出，绝不二次重复下载，最大化保护本地带宽。

### 阶段二：媒体预处理与 AI 解析 (`analyzer.js`)

运行 AI 解析脚本，它会扫描 `output/` 目录下的暂存素材，开启多道自动化关卡过滤与解析：

```bash
node analyzer.js

```

- **质量守门员（需求 3）**：自动检测。若没有成功下载到视频，或者目标格式是动图（`.gif`/`.webp`），将自动**摒弃并跳过该资源**，同时将其 `cardUrl` 记入账本，防止以后重复扫描。
- **格式安全锁（需求 2）**：若抓取到的非 `.mp4` 格式（如 `.mov`, `.webm`），全自动调用 FFmpeg 将其标准化转换为标准封装的 `.mp4`。
- **体积压榨机（需求 1）**：若视频体积**超过 2MB**，FFmpeg 将自动启用 H.264 (CRF 28) 进行智能极限压缩，确保加载速度体验。
- **大模型解析 & 云同步**：最终经优化后的高质视频会被转化为 Base64 送入 Gemini 1.5 Pro 进行动效体验拆解，并以大模型最终生成的英文规范名 `name` 为准，自动上传视频到 Cloudflare R2 并将 Markdown 说明书落盘到 `vibe-motion` 项目中。

### 阶段三：自动化验证与 AI 裁判（Step 1 + Step 2）

基于 `analyzer.js` 产出的 `.md` 规范，对动效做"机器自己实现 + 自己验收"：

```bash
# Step 1：读规范 → AI 生成单文件 HTML → Playwright 无头录制
#   <component> 对应 TARGET_SKILLS_DIR 下某个 <component>.md
node validator_step1.js <component>
#   产物落在 crawler/validation_output/：
#     <component>_test.html             生成的单文件测试页
#     <component>_generated.webm        无头录制视频（Step 2 裁判对象）
#     <component>_debug_screenshot.png  渲染校验截图

# Step 2：多模态 AI 裁判，对比 原始视频 / 生成视频 / 规范 并打分
node validator.js
#   扫描 validation_output/*_generated.webm，对每个组件取三元组：
#     1) <component>_generated.webm          (Step 1 产物)
#     2) <TARGET_SKILLS_DIR>/<component>.md  (analyzer.js 规范)
#     3) output/item_*/raw_video.mp4         (经该 item 的 resolved_name.txt 反查组件名匹配)
#   三样缺任一则跳过；齐全则调 Gemini 裁判，报告落盘 <component>_validation_report.json
```

- **渲染校验**：`validator_step1.js` 在录制前会检查页面是否真正画出元素（`#root` 子节点数等），空白页面会直接报错退出，避免"流程跑通但视频空白"。
- **前置依赖**：`.env` 配好 `GEMINI_API_KEY`（Step 1 生成与 Step 2 裁判都需要联网调用 Gemini）；首次运行确保 `npx playwright install chromium` 已执行。

---

## ⚠️ 极其重要的运维规范（FAQ）

### 🚨 每次跑完 `analyzer.js` 后，我需要删除 `output/` 文件夹吗？

**是的，强烈建议每次跑完之后，手动或通过命令清空整个 `output/` 文件夹。**

因为 `spy.js` 生成的缓存目录采用的是纯数字索引命名（如 `item_0`, `item_1`），如果不执行清理，当下一次抓取的新品数量少于上一次时，多余的旧条目会残留在 `output/` 中，从而在第二阶段引发数据污染或导致 `analyzer.js` 产生无意义的二次检查消耗。只要 `analyzer.js` 成功落盘了 Markdown 且写入了 `processed_urls.json`，清理 `output/` 是百分之百安全的。
