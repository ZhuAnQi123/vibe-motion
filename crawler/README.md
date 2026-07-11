# Vibe Motion Crawler 🎬

这是一个专为 `vibe-motion` 动效资产库设计的多模态全自动抓取与分析工具链。它能够自动化地从目标动效网站获取灵感，利用 Playwright 进行高精准的数据清洗，并直接投喂给 Gemini 1.5 Pro 多模态大模型，最终全自动输出符合严格排版规范的动效技术说明书（Markdown）。

---

## 📂 目录结构

项目采用高内聚、低耦合的设计，整体嵌套在 `vibe-motion` 仓库的根目录下：

```text
vibe-motion/
├── skills/
│   └── interaction-library/
│       └── references/          # 🎯 AI 脚本解析出的 .md 规范最终落盘于此
└── crawler/                     # 🚀 爬虫与 AI 全家桶核心目录
    ├── .env                     # 🔒 本地私密环境变量（API Key、路径等）
    ├── .gitignore               # 🚫 Git 忽略配置文件（防止凭证泄露）
    ├── package.json             # 📦 项目依赖与运行脚本
    ├── AI_WORKFLOW_PROMPT.md    # 📝 塞给 Gemini 的核心动效分析 Prompt 模板
    ├── processed_urls.json      # 📓 增量更新历史账本（自动生成，防止重复抓取）
    ├── spy.js                   # 🕷️ 阶段一：Playwright 自动化列表与详情页爬虫
    ├── analyzer.js              # 🤖 阶段二：Gemini 多模态视觉 Agent 深度解析器
    └── output/                  # 📁 临时媒体缓存（包含各个 item_x 的视频与原始 json）

```

---

## 🛠️ 环境准备与安装

### 1. 安装项目依赖

在终端中进入 `crawler` 目录，执行以下命令安装核心依赖：

```bash
cd crawler
npm install

```

### 2. 补全浏览器内核

由于采用了 Playwright 驱动，首次运行前需要补全 Chromium 浏览器内核：

```bash
npx playwright install chromium

```

### 3. 配置本地环境变量 `.env`

在 `crawler` 目录下创建一个 `.env` 文件，并根据你的本地实际路径和 API 密钥进行配置：

```env
# 谷歌大模型 API 密钥
GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyHere...

# 目标动效抓取站点
TARGET_WEBSITE=

# 最终生成的 Markdown 规范落盘绝对路径,例如"/Users/v.sophie.zhu/Documents/code/vibe-ui/vibe-motion/skills/interaction-library/references"
TARGET_SKILLS_DIR=

```

---

## 🏃 核心工作流使用指南

整个全自动流分为**两个阶段**执行：

### 阶段一：动效数据与视频抓取 (`spy.js`)

运行爬虫脚本，它将自动打开浏览器，切换至 `Motion` 视图，自动向下滚动加载最新动效，并排除无关干扰，将视频和原始元数据下载到 `output/item_x` 分组文件夹中。

```bash
node spy.js

```

- **增量更新机制**：该脚本在后续运行时会自动比对 `processed_urls.json` 账本，**仅抓取首页新发布的、未处理过的动效新品**，永远不会重复下载。

### 阶段二：Gemini 多模态视觉解析 (`analyzer.js`)

运行 AI 解析脚本，它会扫描 `output/` 目录下的暂存素材，将视频文件（Base64 投喂）与原始数据一并送入 Gemini 1.5 Pro。大模型将用“眼睛”直观分析物体的缓动回弹、微动和交错延迟，并严格按照 `AI_WORKFLOW_PROMPT.md` 模板规范生成技术说明。

```bash
node analyzer.js

```

- **自动落盘**：大模型生成特定的英文 `name` 后，脚本会自动将其转化为 `名称.md`，直接精准写入到你的 `vibe-motion` 技能库中。

---

## ⚠️ 注意事项与维护

1. **凭证安全**：`.env` 包含你的敏感 API 密钥，`output/` 和 `processed_urls.json` 为本地生产线缓存，**上述文件均已列入 `.gitignore`，切勿提交至远程 Git 仓库**。
2. **频率限制**：`analyzer.js` 内部默认在处理完一个条目后会强制等待 2 秒（Cooldown），以防止因多模态高并发请求触发 Gemini API 的速率限制（Rate Limit）。

## ❓ 常见问题与坑位指南 (FAQ)

以下是项目搭建与日常运行中可能遇到的核心问题与解决方案，供参考排查：

### 1. 运行 `analyzer.js` 报错：`TypeError: Cannot read properties of undefined (reading 'project')`

- **原因**：Google 官方最新的 `@google/genai` SDK 在使用 ESM (`import`) 语法实例化客户端时，如果直接写 `new GoogleGenAI()`，其内部由于默认参数未传会直接引发空指针异常。
- **解决办法**：实例化时必须显式传入一个空对象，修改代码为：
  ```javascript
  const ai = new GoogleGenAI({});
  ```

````

### 2. 运行 `analyzer.js` 频繁报 `fetch failed` 错误

* **原因**：Node.js 18+ 引入了原生的 `fetch` 接口用于网络请求。但在国内网络环境下，大模型接口必须走代理。令人踩坑的是，**Node.js 的原生 `fetch` 默认不会读取系统的或 `.env` 里的 `HTTP_PROXY` 环境变量**，导致请求直接撞墙。
* **解决办法（二选一）**：
* **推荐（一劳永逸）**：打开你的代理软件（如 SakuraCat / Clash），**开启「TUN 模式」**（虚拟网卡接管模式）。开启后，整台 Mac 的底层网络流量（包括 Node.js 原生 fetch）将全自动强制走代理出国，无需修改任何代码。
* **修改代码**：安装 `undici` 库，并在 `analyzer.js` 的最顶部手动挂载全局代理适配器：
```javascript
import { setGlobalDispatcher, ProxyAgent } from 'undici';
setGlobalDispatcher(new ProxyAgent({ uri: '[http://127.0.0.1:7890](http://127.0.0.1:7890)' }));

````

### 3. 运行 `spy.js` 提示：`browserType.launch: Executable doesn't exist...`

- **原因**：在移动代码仓库目录、换设备或者全新安装依赖后，Playwright 专用的 Chromium 浏览器内核尚未下载到系统的缓存目录中。
- **解决办法**：在 `crawler` 目录下执行以下命令补全 Chromium 内核即可：

```bash
npx playwright install chromium

```

### 4. 运行 `analyzer.js` 提示 `Error: ENOENT: no such file or directory... AI_WORKFLOW_PROMPT.md`

- **原因**：脚本在执行时会在当前运行目录下寻找提示词模板。当你把整个 `crawler` 文件夹移入 `vibe-motion` 根目录后，该模板文件可能遗留在了原本的旧工作区中。
- **解决办法**：请确保将 `AI_WORKFLOW_PROMPT.md` 文件复制一份，妥善存放在 `crawler/` 目录下，或者在 `analyzer.js` 内部将 `PROMPT_FILE_PATH` 修改为该文件的绝对路径。
