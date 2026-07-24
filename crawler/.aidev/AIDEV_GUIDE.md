# 🤖 AI-Driven Development (AIDEV) Team Guide

## 1. 为什么需要这份指南？
## 1. 为什么需要这份指南？ (Why This Guide?)

随着我们越来越多地利用 AI Agent (如 Cursor, Gemini) 辅助开发，个人的对话历史变得零散且难以追溯。为了让团队协作更加透明、高效，并沉淀开发过程中的“智能资产”，我们引入此份指南。

**核心原则**：将与 AI 的关键交互视为项目的一等公民，并将所有的记录收拢到统一的 `.aidev` 目录中，防止污染业务代码根目录。

## 2. `.aidev` 目录：AI 交互的“飞行黑匣子”

**此目录必须提交到 Git 版本控制中。**

### 目录结构

```text
.aidev/
├── AIDEV_GUIDE.md        # 本指南文件
├── SYSTEM_RULES.md       # 🤖 AI Agent 必须遵守的系统级行为准则
├── plans/                # 存放长期的史诗规划 (Epic Roadmap)，例如 auto_test.md
├── prompts/              # 存放可复用的、高质量的系统级 Prompt 模板
└── logs/                 # 按功能或日期记录每天的碎片化开发日志
    └── validator/        # 例如：存放 validator 相关的每日纪要
        └── 2024-05-20-step1-completed.md
```

## 3. 【核心工作流】如何使用 AI 自动归档？

为了不打断你的心流，**你不需要手动去写 Markdown 日志。** 

请在与 AI 交互的过程中保持自然对话。当一天的开发结束，或者你完成了一个里程碑（例如：完成了 Step 1，准备明天做 Step 2）时，向 AI 发送以下“魔法口令”：

> 📦 **口令： `/archive`** （或者说：“**请帮我归档今天的交互进度**”）

收到该口令后，AI Agent 将会自动执行以下操作：

1. **梳理上下文**：阅读今天的整个聊天记录，提取核心目标、关键 Bug 发现和解决方案。
2. **更新长线规划**：自动读取 `.aidev/plans/` 下相关的架构路线图（如 `auto_test.md`），帮你把今天完成的任务打上 `[x]`。
3. **生成每日日志**：自动为你输出一段 Markdown 代码，它会提示你将这段内容保存到 `.aidev/logs/` 下对应的以日期命名的文件中。

## 4. 开发日志模板参考 (`TASK_LOG.md`)

AI 在执行 `/archive` 时，通常会采用以下结构输出当日纪要，供你 Code Review：

```markdown
### 🎯 目标 (Objective)

一句话清晰描述本次任务的目标。
*例如：为 validator.js 实现 AI 裁判功能，使其能对比视频相似度。*

### 🔗 上下文 (Context)

- **相关规划**: `.aidev/plans/auto_test.md`
- **前置日志**: `../validator/2024-05-19-setup.md`

---

### 📝 关键交互与发现 (Interaction Log)

- **Bug 记录**: 发现了依赖版本不兼容导致的 `TypeError: webidl.util.markAsUncloneable is not a function`，通过将 `undici` 降级到 v6 解决。
- **Prompt 优化**: 发现 AI 生成的单文件 HTML 容易缺失依赖，调整 Prompt 强制要求注入 CDN 并在 `<head>` 中处理。

---

### ✅ 产出 (Outcome)

- **状态**: Step 1 (半自动化基建) 已完成。
- **下一步**: 准备进入 Step 2 (全自动化验证 - AI裁判)，预期引入多模态比对逻辑。
```

## 5. Git 工作流集成

1.  **提交代码时**: 将你通过 `/archive` 得到的 `.aidev/logs/` 纪要文件与你的功能代码一同暂存和提交。
2.  **Commit Message**: 在 Commit Message 中引用你创建的日志文件，提供详尽背景。
    ```
    feat(validator): add headless browser recording

    完成了自动化测试的 Step 1，实现了基于 Prompt 的代码生成和 Playwright 无头录制功能。

    Ref: crawler/.aidev/logs/validator/2024-05-20-step1.md
    ```