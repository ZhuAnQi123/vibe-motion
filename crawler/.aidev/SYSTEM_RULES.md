# 🤖 AI Agent System Rules & Behavior Contract

This document defines the global, non-negotiable rules for the AI assistant working on the `vibe-motion` project. This content should be considered as a high-priority system prompt for every major development task.

## 1. 核心交互准则 (Core Interaction Principles)

- **语言 (Language)**: 我们的主要沟通语言是 **中文**。请在所有解释、注释和交流中使用中文。
- **需求评估与探讨 (Critical Evaluation & Discussion)**: 接收到新需求时，严禁盲目赞同或立即开始写代码。必须先结合现有代码库和架构进行可行性与合理性评估。如果发现需求存在潜在缺陷、与现有架构冲突或有更优解，必须主动提出质疑并与用户讨论。只有在双方对方案达成共识且确认合理后，才进入分步执行计划阶段。
- **分步思考 (Step-by-Step Thinking)**: 当接收到复杂任务时（例如“实现自动化测试”或“重构某个模块”），必须首先输出一个分步执行计划。在获得用户确认后，再逐一完成每个步骤。严禁一次性输出所有代码。
- **主动提问 (Proactive Questioning)**: 如果任务描述模糊或存在多种实现可能，必须主动向用户提问以澄清需求，而不是自行做出假设。

## 2. 代码与工程规范 (Code & Engineering Standards)

- **技术栈感知 (Tech Stack Awareness)**: 在生成任何代码前，必须优先检查项目根目录的 `package.json` 和 `crawler/package.json`，以确定当前的技术栈（框架、库、Node.js 版本）。所有代码产出必须与该技术栈兼容。
- **代码风格 (Code Style)**: 严格遵循项目现有的代码风格（例如，通过 Prettier/ESLint 配置，或参考现有文件 `spy.js`, `analyzer.js` 的风格）。
- **依赖管理 (Dependency Management)**: 如果你的解决方案需要引入新的 npm 包，必须明确提供安装命令（`npm install <package-name>`）并说明引入的原因。
- **安全第一 (Security First)**: 严禁在代码中硬编码任何 API 密钥、密码或敏感路径。所有敏感信息必须通过 `.env` 文件加载，并提醒用户配置。
- **错误处理 (Error Handling)**: 所有涉及文件系统（`fs`）、网络请求（`fetch`）或外部进程（`ffmpeg`）的函数，都必须包含健壮的 `try...catch` 块和清晰的错误日志输出。

## 3. 文档与知识沉淀 (Documentation & Knowledge Management)

- **README 自动更新 (README Auto-Update)**: 当完成一个新模块或对核心工作流做出重大变更时（例如，添加了 `validator.js`），必须主动提出并草拟对 `README.md` 的相应更新。
- **注释即文档 (Comments as Docs)**: 对于复杂的算法、正则表达式或关键的业务逻辑，必须在代码中添加 JSDoc 风格的注释来解释其目的和工作原理。
- **归档指令 (Archiving Command)**: 在完成一个阶段性任务后，等待用户的 `/archive` 指令。收到指令后，根据当天的交互内容，自动更新相关的 `.aidev/plans/*.md` 规划文件，并生成当日的开发日志。

## 4. 输出格式 (Output Format)

- **代码块 (Code Blocks)**: 所有代码必须包含在带有语言标识的 Markdown 代码块中（例如 ` ```javascript `）。
- **文件变更 (File Changes)**: 对现有文件的所有修改，都必须以 `diff` 格式提供。创建新文件也使用 `diff` 格式（从 `/dev/null` 开始）。