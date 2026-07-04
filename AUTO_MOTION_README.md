# 🤖 自动化动效规范生成工具

> 一键将网站录屏转化为标准动效规范文件，视频上传 Cloudflare R2，自动提交到 GitHub 仓库。

## 🎯 它能做什么？

当你看到一个喜欢的网站动效时，只需提供 **录屏视频 + 网站 URL**，这个工具会自动：

1. 📹 将视频发给 Gemini AI，结合 `AI_WORKFLOW_PROMPT.md` 模板进行逆向工程
2. 📝 自动提取规范中的 `name` 字段作为文件名
3. 🎬 用 FFmpeg 压缩视频为 .mp4 格式（同名）
4. ☁️ 将压缩后的视频上传至 Cloudflare R2 CDN
5. 📂 将 `.md` 文件保存到 `references/`
6. 🔄 提交推送 `vibe-motion`，并可选同步 `vibe-ui-web` 子模块

## 📦 环境要求

- Node.js 16+
- FFmpeg（[下载安装](https://ffmpeg.org/download.html)）
- Git（已配置 SSH 密钥或个人访问令牌）
- Gemini API Key（[获取地址](https://aistudio.google.com/apikey)）
- Cloudflare R2 存储桶及 API Token（[R2 文档](https://developers.cloudflare.com/r2/)）

## 🚀 快速开始

### 1. 克隆并安装依赖

```bash
git clone https://github.com/ZhuAnQi123/vibe-motion.git
cd vibe-motion
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件（参考 `.env.example`）：

```env
GEMINI_API_KEY=你的_API_密钥
R2_ACCOUNT_ID=你的_Cloudflare_账户_ID
R2_ACCESS_KEY_ID=你的_R2_Access_Key
R2_SECRET_ACCESS_KEY=你的_R2_Secret_Key
R2_BUCKET_NAME=你的_R2_存储桶名称
MOTION_CDN_BASE=https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev

# 可选：自动同步 vibe-ui-web 子模块
VIBE_UI_WEB_LOCAL_PATH=/Users/你的用户名/Projects/vibe-ui-web
```

### 3. 运行脚本

```bash
node auto-motion.js /path/to/录屏文件.mov https://目标网站.com
```

**示例：**

```bash
node auto-motion.js ~/Desktop/magnetic-button.mov https://linear.app
```

## 📂 文件输出位置

- **规范文件**：`vibe-motion/skills/interaction-library/references/[name].md`
- **演示视频**：`https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/[name].mp4`（Cloudflare R2 CDN）
- **Git 提交**：先 push `vibe-motion`，再更新 `vibe-ui-web` 的 `vibe-motion` 子模块（如已配置 `VIBE_UI_WEB_LOCAL_PATH`）

## ⚙️ 自定义配置

| 配置项 | 说明 | 默认值 |
| --- | --- | --- |
| `GEMINI_API_KEY` | Gemini API 密钥 | 从 `.env` 读取 |
| `R2_ACCOUNT_ID` | Cloudflare 账户 ID | 必填 |
| `R2_ACCESS_KEY_ID` | R2 API Access Key | 必填 |
| `R2_SECRET_ACCESS_KEY` | R2 API Secret Key | 必填 |
| `R2_BUCKET_NAME` | R2 存储桶名称 | 必填 |
| `MOTION_CDN_BASE` | 视频公开访问 CDN 基址 | R2 Public Development URL |
| `VIBE_UI_WEB_LOCAL_PATH` | vibe-ui-web 本地路径 | 可选，不填则跳过子模块同步 |
| `MODEL_NAME` | Gemini 模型 | `gemini-2.5-flash` |

## ❓ 常见问题

### Q: 视频必须用 .mov 格式吗？

A: 支持任何 FFmpeg 能处理的格式（.mov、.mp4、.avi 等），但推荐使用 .mov。

### Q: 提取的 `name` 字段不符合预期怎么办？

A: 检查 Gemini 返回的 Markdown 开头是否有 `name: xxx`，确保 `AI_WORKFLOW_PROMPT.md` 格式正确。

### Q: Git push 失败怎么办？

A: 确保你已配置好 SSH 密钥，或使用 Personal Access Token。也可以手动执行最后的 commit/push。

### Q: 可以批量处理多个视频吗？

A: 可以写一个循环脚本，但需要确保每个视频独立调用，避免文件名冲突。

### Q: 还需要在仓库里放 mp4 吗？

A: 不需要。视频托管在 Cloudflare R2，`.md` 中的 `cover_video: "../assets/[name].mp4"` 仅作为文件名标识，Web 构建时会自动解析为 CDN URL。

## 🧪 测试建议

先用一个简单的视频测试流程：

```bash
node auto-motion.js test.mov https://example.com
```

观察日志输出，检查：

- Gemini 是否正常响应
- R2 上传是否成功（日志会打印 CDN URL）
- Git 操作是否成功

## 📝 注意事项

- ⚠️ 确保 R2 存储桶已开启 Public Development URL 或自定义域名
- ⚠️ 视频文件名须与规范 `name` 字段一致（如 `magnetic-button-hover.mp4`）
- ⚠️ 运行脚本前，目标 Git 仓库不能有未提交的变更（或确认继续）
- ⚠️ 首次运行会消耗 Gemini API 配额，注意查看用量

## 🤝 贡献

欢迎提交 Issue 或 PR 改进脚本！

---

**维护者**：ZhuAnQi123  
**最后更新**：2026-07-04
