# 🌟 Vibe Motion MD

> 专为 Vibecoding 设计的**页面交互与动效库**。提供各种创意特效，选中你想要的特效，把对应的包含精确物理参数的 Markdown 文件丢给 AI，让它瞬间写出高还原的交互特效，摆脱沉闷页面与代码。

## 💡 为什么需要这个库？
UI 设计系统（如颜色、间距）决定了界面**“长什么样”**，而 Interaction MD 决定了界面**“怎么动、什么感觉”**。
大模型很难仅凭“丝滑一点”的形容词写出好动效，但如果你给它精确的**弹簧刚度 (stiffness)、阻尼 (damping) 和贝塞尔曲线**，它就能完美还带完美阻尼感、呼吸感和丝滑过渡的原顶级交互。

## 🚀 如何使用 (For Cursor Users)

1. 下载本项目中的 `skills/interaction-library` 文件夹。
2. 将其复制到你项目的 `.cursor/skills/` 目录下（如果没有该目录请新建）。
3. 你的目录结构看起来像这样：
   ```text
   你的项目/
   └── .cursor/
       └── skills/
           └── interaction-library/
               ├── SKILL.md
               ├── assets/
               └── references/
                   └── fluid-tabs.md
   ```
4. **触发体验**：在 Cursor 聊天框中说：*“帮我写一个 Tab 切换组件，交互请严格参考库里的「流体标签」动效。”*

## 🎬 贡献指南：如何添加你喜欢的交互？

看到一个惊艳的 UI 动图？你可以结合 **Gemini 1.5 Pro (或 GPT-4o)** 的视频解析能力，一键将其转化为本库支持的 `.md` 规范。

👉 **[查看基于 AI 的自动化入库工作流](./AI_WORKFLOW_PROMPT.md)**

## 📁 目录说明
- `skills/interaction-library/SKILL.md`：给 Cursor Agent 的“路由大脑”。
- `skills/interaction-library/references/`：存放具体的动效拆解参数文件（`.md`）。
- `skills/interaction-library/assets/`：存放配套的动效演示视频或 GIF，方便你和 AI 回溯体感。
