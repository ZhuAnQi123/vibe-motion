# 🤖 自动化动效规范生成工具

> 一键将网站录屏转化为标准动效规范文件，自动提交到 GitHub 仓库。

## 🎯 它能做什么？

当你看到一个喜欢的网站动效时，只需提供 **录屏视频 + 网站 URL**，这个工具会自动：

1. 📹 将视频发给 Gemini AI，结合 `AI_WORKFLOW_PROMPT.md` 模板进行逆向工程
2. 📝 自动提取规范中的 `name` 字段作为文件名
3. 🎬 用 FFmpeg 压缩视频为 .mp4 格式（同名）
4. 📂 将 .md 文件放到 `references/`，.mp4 文件放到 `assets/`
5. 🔄 自动更新子模块（vibe-ui-web）并 commit + push

## 📦 环境要求

- Node.js 16+
- FFmpeg（[下载安装](https://ffmpeg.org/download.html)）
- Git（已配置 SSH 密钥或个人访问令牌）
- Gemini API Key（[获取地址](https://aistudio.google.com/apikey)）

## 🚀 快速开始

### 1. 克隆并安装依赖

```bash
git clone https://github.com/ZhuAnQi123/vibe-motion.git
cd vibe-motion
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
GEMINI_API_KEY=你的_API_密钥
```

### 3. 修改脚本路径配置

编辑 `auto-motion.js`，找到 `REPO_ROOT` 并改为你的 `vibe-ui-web` 仓库路径：

```javascript
const REPO_ROOT = "/Users/你的用户名/Projects/vibe-ui-web" // 👈 改成你的路径
```

### 4. 运行脚本

```bash
node auto-motion.js /path/to/录屏文件.mov https://目标网站.com
```

**示例：**

```bash
node auto-motion.js ~/Desktop/magnetic-button.mov https://linear.app
```

## 📂 文件输出位置

- **规范文件**：`vibe-motion/skills/interaction-library/references/[name].md`
- **压缩视频**：`vibe-motion/skills/interaction-library/assets/[name].mp4`
- **最终提交**：自动推送到 `vibe-ui-web` 仓库

## ⚙️ 自定义配置

| 配置项                 | 说明            | 默认值                       |
| ---------------------- | --------------- | ---------------------------- |
| `GEMINI_API_KEY`       | Gemini API 密钥 | 从 `.env` 读取               |
| `PROMPT_TEMPLATE_PATH` | 提示词模板路径  | `./AI_WORKFLOW_PROMPT.md`    |
| `REPO_ROOT`            | 父仓库路径      | **必须手动修改**             |
| `SUBMODULE_PATH`       | 子模块相对路径  | `skills/interaction-library` |

## ❓ 常见问题

### Q: 视频必须用 .mov 格式吗？

A: 支持任何 FFmpeg 能处理的格式（.mov、.mp4、.avi 等），但推荐使用 .mov。

### Q: 提取的 `name` 字段不符合预期怎么办？

A: 检查 Gemini 返回的 Markdown 开头是否有 `name: xxx`，确保 `AI_WORKFLOW_PROMPT.md` 格式正确。

### Q: Git push 失败怎么办？

A: 确保你已配置好 SSH 密钥，或使用 Personal Access Token。也可以手动执行最后的 commit/push。

### Q: 可以批量处理多个视频吗？

A: 可以写一个循环脚本，但需要确保每个视频独立调用，避免文件名冲突。

## 🧪 测试建议

先用一个简单的视频测试流程：

```bash
node auto-motion.js test.mov https://example.com
```

观察日志输出，检查：

- Gemini 是否正常响应
- 文件是否正确生成
- Git 操作是否成功

## 📝 注意事项

- ⚠️ 确保 `vibe-ui-web` 仓库在运行前已同步最新代码（`git pull`）
- ⚠️ 运行脚本前，`vibe-ui-web` 不能有未提交的变更（或确保能自动合并）
- ⚠️ 首次运行会消耗 Gemini API 配额，注意查看用量

## 🤝 贡献

欢迎提交 Issue 或 PR 改进脚本！

---

**维护者**：ZhuAnQi123  
**最后更新**：2026-06-25
