# 🌟 Vibe Motion MD
# Vibe Motion (Interaction Protocol Library)

> 专为 Vibecoding 设计的**页面交互与动效库**。提供各种创意特效，选中你想要的特效，把对应的包含精确物理参数的 Markdown 文件丢给 AI，让它瞬间写出高还原的交互特效，摆脱沉闷页面与代码。
这里存放了所有精细化物理动效的交互协议和时序规约。

## 💡 为什么需要这个库？
## 🏷️ 动效分类标签准则 (Standard Motion Tags)

UI 设计系统（如颜色、间距）决定了界面**“长什么样”**，而 Interaction MD 决定了界面**“怎么动、什么感觉”**。大模型很难仅凭“丝滑一点”的形容词写出好动效，但如果你给它精确的**弹簧刚度 (stiffness)、阻尼 (damping) 和贝塞尔曲线**，它就能完美还原带完美阻尼感、呼吸感和丝滑过渡的顶级交互。
为了让前端页面能够实现极致精简的单层滚动交互筛选，我们废弃了复杂的 `domains`, `aesthetics`, `components`, `effects` 的三维解析逻辑，将其扁平化为统一的 `tags`。

## 🚀 如何使用 (For Cursor Users)
### 唯一合法的 Motion 12个标准标签
所有新采集或生成的动效必须且只能从以下 12 个标准词条中选择 1~3 个填入 `tags` 数组：

1. 下载本项目中的 `skills/interaction-library` 文件夹。
2. 将其复制到你项目的 `.cursor/skills/` 目录下（如果没有该目录请新建）。
3. 你的目录结构看起来像这样（**所有引用规范一律扁平放置在 references 中**）：

   ```text
   你的项目/
   └── .cursor/
       └── skills/
           └── interaction-library/
               ├── SKILL.md                 # 路由大脑：内部根据 Vibes 维护索引
               └── references/
                   ├── fluid-tabs.md        # 带有 Vibe & Interaction 标签的规范文件
                   └── typographic-menu.md

   ```

4. **触发体验**：在 Agent 聊天框中 @ 对应的文件，建议不要只发 MD。建议附带一句："请根据以下动效规范，为我编写一个符合我当前技术栈（如：Next.js + Tailwind CSS + Framer Motion）的 React 组件，注意严格遵守 YAML 中的物理参数。"”

## 🗂 多维度分类规范(Standard Motion Tags)

为了让前端页面能够实现极致精简的单层滚动交互筛选，所有新采集或生成的动效必须且只能从以下 12 个标准词条中选择 1~3 个填入 `tags` 数组：

1. **Elastic** (物理回弹)
2. **Magnetic** (磁吸附)
3. **Scroll** (滚动驱动)
4. **Reveal** (渐显启幕)
5. **Hover** (鼠标悬停)
6. **Proximity** (距离联动)
7. **Curtain** (幕布展开)
8. **Button** (按钮组件)
9. **Card** (卡片组件)
10. **Carousel** (轮播组件)
11. **Accordion** (手风琴组件)
12. **Click** (点击微交互)

---

## 🎬 贡献指南：如何添加你喜欢的交互？

看到一个惊艳的 UI 动效？你可以结合 **Gemini 1.5 Pro (或 GPT-4o)** 的视频解析能力，带上 [AI_WORKFLOW_PROMPT](./AI_WORKFLOW_PROMPT.md) 的提示词一键将其转化为本库支持的 `.md` 规范。

### 1. 准备资产 (Assets)

- 录制该动效的高质量预览视频（推荐 MP4 格式，控制在 2MB 以内）。
- 将视频上传至 Cloudflare R2 存储桶（与现有动效同一 bucket）。
- **命名规范**：文件名须与规范 `name` 字段一致，例如 `magnetic-circular-button-hover.mp4`。
- **CDN 地址**：`https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/{filename}.mp4`
- **注意**：视频不再随 Git 仓库提交，Web 端构建时会根据 `cover_video` 中的文件名自动拼接 CDN URL。

### 2. 创建规范文件

在 `skills/interaction-library/references/` 下创建 Markdown 文件，并在顶部的 YAML 元数据中**必须包含以下关键字段**：

`````yaml
````yaml
version: alpha
name: magnetic-circular-button-hover
cover_video: "../assets/magnetic-circular-button-hover.mp4" # 填写文件名（相对路径格式，构建时解析为 CDN URL）
components: ["Button", "CTA"]                # 明确组件归属（如 Button, Navigation, Modal）
effects: ["Magnetic", "Elastic"]             # 明确动效特征（如 Elastic, Reveal, Fluid）
`````

_注：Web 端展示卡片时，会根据 `cover_video` 的文件名从 CDN 拉取视频循环播放，并提取 `components` 和 `effects` 作为标签。_

## 📁 目录说明

- `skills/interaction-library/SKILL.md`：给 Cursor Agent 的“路由大脑”。
- `skills/interaction-library/references/`：存放具体的动效拆解参数文件（`.md`）。
- 动效演示视频托管于 Cloudflare R2 CDN，不再存放于本仓库。
1. **Elastic** (物理回弹)
2. **Magnetic** (磁吸附)
3. **Scroll** (滚动驱动)
4. **Reveal** (渐显启幕)
5. **Hover** (鼠标悬停)
6. **Proximity** (距离联动)
7. **Curtain** (幕布展开)
8. **Button** (按钮组件)
9. **Card** (卡片组件)
10. **Carousel** (轮播组件)
11. **Accordion** (手风琴组件)
12. **Click** (点击微交互)
