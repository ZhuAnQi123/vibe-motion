# 🌟 Vibe Motion MD

> 专为 Vibecoding 设计的**页面交互与动效库**。提供各种创意特效，选中你想要的特效，把对应的包含精确物理参数的 Markdown 文件丢给 AI，让它瞬间写出高还原的交互特效，摆脱沉闷页面与代码。

## 💡 为什么需要这个库？

UI 设计系统（如颜色、间距）决定了界面**“长什么样”**，而 Interaction MD 决定了界面**“怎么动、什么感觉”**。大模型很难仅凭“丝滑一点”的形容词写出好动效，但如果你给它精确的**弹簧刚度 (stiffness)、阻尼 (damping) 和贝塞尔曲线**，它就能完美还原带完美阻尼感、呼吸感和丝滑过渡的顶级交互。

## 🚀 如何使用 (For Cursor Users)

1. 下载本项目中的 `skills/interaction-library` 文件夹。
2. 将其复制到你项目的 `.cursor/skills/` 目录下（如果没有该目录请新建）。
3. 你的目录结构看起来像这样（**所有引用规范一律扁平放置在 references 中**）：

   ```text
   你的项目/
   └── .cursor/
       └── skills/
           └── interaction-library/
               ├── SKILL.md                 # 路由大脑：内部根据 Vibes 维护索引
               ├── assets/                  # 存放配套的动效演示视频或 GIF
               └── references/
                   ├── fluid-tabs.md        # 带有 Vibe & Interaction 标签的规范文件
                   └── typographic-menu.md

   ```

4. **触发体验**：在 Agent 聊天框中 @ 对应的文件，建议不要只发 MD。建议附带一句："请根据以下动效规范，为我编写一个符合我当前技术栈（如：Next.js + Tailwind CSS + Framer Motion）的 React 组件，注意严格遵守 YAML 中的物理参数。"”

## 🗂 多维度分类规范

为了更契合开发者与 AI Agent 的检索直觉，本库抛弃了传统的单层文件夹分类，采用 **“扁平存储 + 多维标签 (Front-matter Tags)”** 的网状架构。每个动效规范文件都包含以下两个维度的元数据：

### 维度 A：情绪基调与行业 (Vibes & Domains)

- 🛠 **DevTools (极客/效率)**：暗黑、等宽字体、高对比度、机械感动效。（类 Linear, Cursor）
- 🧘‍♀️ **Calm (治愈/心理)**：低饱和、大圆角、舒缓渐变、弹性慢动效。（类 Tiimo, Headspace）
- 🎨 **Creative (张扬/创意)**：新粗野主义、大色块、硬阴影、粗体排版。（类 Figma, Gumroad）
- 🏢 **Enterprise (企业看板)**：便当盒布局、高信息密度、干净的蓝灰配色。（类 Stripe, Notion）

### 维度 B：交互类型 (Interaction Types)

- 🖱 **Micro-interactions (微交互)**：按钮点击、Hover 态、开关切换。
- 🗺 **Navigations (导航流转)**：侧边栏丝滑展开、流体 Tabs、底部导航吸附。
- 🔔 **Feedback (反馈机制)**：成功撒花、错误抖动、加载骨架屏过渡。

---

## 🎬 贡献指南：如何添加你喜欢的交互？

看到一个惊艳的 UI 动效？你可以结合 **Gemini 1.5 Pro (或 GPT-4o)** 的视频解析能力，带上 [AI_WORKFLOW_PROMPT](./AI_WORKFLOW_PROMPT.md) 的提示词一键将其转化为本库支持的 `.md` 规范。

### 1. 准备资产 (Assets)

- 录制该动效的高质量预览视频（推荐使用 MP4 格式，控制在 2MB 以内，或者使用 GIF）。
- 将视频文件放入本仓库的 `skills/interaction-library/assets/` 目录下。
- **注意**：本仓库采用“随仓库存储”方案，Web 端在构建时会自动读取并展示这些本地视频。

### 2. 创建规范文件

在 `skills/interaction-library/references/` 下创建 Markdown 文件，并在顶部的 YAML 元数据中**必须包含以下关键字段**：

`````yaml
````yaml
version: alpha
name: magnetic-circular-button-hover
cover_video: "../assets/magnetic-button.mp4" # 必须填写相对路径
components: ["Button", "CTA"]                # 明确组件归属（如 Button, Navigation, Modal）
effects: ["Magnetic", "Elastic"]             # 明确动效特征（如 Elastic, Reveal, Fluid）
`````

_注：Web 端展示卡片时，会自动读取 `cover_video` 进行循环播放，并提取 `components` 和 `effects` 作为标签。_

## 📁 目录说明

- `skills/interaction-library/SKILL.md`：给 Cursor Agent 的“路由大脑”。
- `skills/interaction-library/references/`：存放具体的动效拆解参数文件（`.md`）。
- `skills/interaction-library/assets/`：存放配套的动效演示视频或 GIF，方便你和 AI 回溯体感。
