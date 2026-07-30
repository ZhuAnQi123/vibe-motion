# 🤖 Vibe Motion 自动化验证测试体系 (Validator)

本文档记录了 `vibe-motion` 动效库从“自动化采集”向“自动化验证与迭代”演进的架构设计与开发计划。

## 1. 当前手动测试流程评估

当前采用 **"人在环路" (Human-in-the-Loop)** 的验证模式：
1. 接收 `analyzer.js` 输出的 `.md` 动效规范。
2. **手动**在前端项目中基于 Prompt 编写代码实现。
3. **手动**录屏实现效果。
4. **手动**将 [原始视频 + 新录屏 + .md] 上传给 AI 进行对比纠错。
5. **手动**确认无误后上传 R2。

*   **痛点**：效率极低，无法随着动效库的扩容而规模化，完全抵消了前置数据采集的自动化优势。

## 2. 自动化验证架构设计 (Three-Stage Pipeline)

我们将引入第三个自动化阶段 `validator.js`，形成完整的流水线：

```text
+---------------------+      +-----------------------+      +--------------------------+
|      阶段一         |      |        阶段二         |      |          阶段三          |
|      spy.js         |----->|      analyzer.js      |----->|       validator.js       |
| (数据与视频抓取)    |      | (AI 动效规范生成)     |      | (自动化实现、录制与评估) |
+---------------------+      +-----------------------+      +--------------------------+
                                                             |
                                                             v
                                                   [产出物与决策闭环]
```

`validator.js` 的核心职责模仿人类测试员：**代码生成 -> 浏览器渲染录制 -> AI 对比评估**。

## 3. 开发计划与演进路线 (Roadmap)

### 🟢 Step 1: 半自动化基建 (代码生成 + 无头录屏) - [已完成]
- [x] **代码生成代理**: 读取 `.md` 规范，调用 AI 生成单文件、自包含的 HTML/JS/CSS 交互页面。
- [x] **标准化渲染舞台**: 使用 Playwright 启动无头浏览器，加载生成的 HTML。
- [x] **主动驱动动画 + 逐帧截图合成视频**: 不再依赖 Playwright 内置 `page.video()`（对滚动/Transform 页面易录到黑屏或超长暗场），改为：
  1. 等待 React/组件挂载（`#root` 有子元素）即开始录制；
  2. 录制器主动判断页面类型：可滚动页面执行 **0→1→0 正弦往返滚动**，非滚动页面执行悬停/点击/拖拽序列；
  3. 每 100ms 截一张 PNG，最后用 `ffmpeg` 合成为固定 6.5s 的 `<component-name>_generated.webm`；
  4. 录制后用 ffmpeg 抽帧校验：平均亮度低于阈值或各帧几乎相同则直接报错，避免“黑屏/空白”伪通过。
- *人工介入点*：此时流程暂停，由开发者手动对比 `output/item_<n>/raw_video.mp4` 与 `<component-name>_generated.webm`，验证代码生成代理的可靠性。

> **依赖**: `validator_step1.js` 现在需要系统安装 `ffmpeg`（用于 PNG 序列合成 webm 与录制后校验）。

> **⚠️ 临时测试 Hack（待 Step 4 修正）**：当前 `validator_step1.js` 在未传参时，会取 `TARGET_SKILLS_DIR` 下**第一个** `.md` 作为测试对象（因为阶段一/二尚在联调）。这不对——正确逻辑应是处理 `references/` 中**新增**的规范文件（见 Step 4）。生成页仍建议内置“自动演示模式”（`window.__AUTO_DEMO__`）供手动预览，但录制器不再依赖它，而是自己驱动核心动画并逐帧捕获。

###  Step 2: 全自动化验证 (AI 裁判引入) - [已完成]
- [x] **多模态 AI 裁判**: 将原始视频、生成视频、规范 `.md` 三者打包，调用最新的 Gemini 2.5 Pro 视觉模型。
- [x] **裁判 Prompt 设计**: 设计专门用于对比物理体感、时序、缓动曲线的系统指令，强制输出结构化 `dimensions_analysis`。
- [x] **决策逻辑**: 在 Node.js 侧硬编码分数阈值 (>= 80 为通过)，并将 `discrepancies` 连同判断结果统一落盘至 `validation_report.json` 供后续消费。

> **📝 附注：Step 2 实际文件目录结构约定（扁平 + 组件命名）**
> 三处产物按「组件名」(kebab-case) 分散在各目录，**并非**统一放进 `validation_output/<component>/` 子目录：
> ```text
> output/
>  └── item_<n>/
>       ├── raw_video.mp4          (spy.js 抓取的原始参考视频)
>       ├── meta.json
>       └── resolved_name.txt      (记录该条目对应的组件名 <component-name>)
>
> <TARGET_SKILLS_DIR>/
>  └── <component-name>.md         (analyzer.js 生成的动效规范)
>
> validation_output/
>  ├── <component-name>_test.html              (Step 1: 生成的单文件测试页)
>  ├── <component-name>_generated.webm         (Step 1: Playwright 无头录屏产物)
>  ├── <component-name>_debug_screenshot.png   (Step 1: 渲染校验截图)
>  └── <component-name>_validation_report.json (Step 2: 裁判落盘的打分与差异报告)
> ```
> `validator.js` 的 Step 2 通过 `validation_output/<component-name>_generated.webm` 反推组件名，再分别从 `TARGET_SKILLS_DIR/<component-name>.md` 与 `output/` 下匹配 `resolved_name.txt` 的 `raw_video.mp4` 取齐三元组。

### 🔴 Step 3: 自迭代闭环系统 (Self-Healing)
- [ ] **错误反馈解析**: 提取 AI 裁判输出的 `discrepancies` (不一致点)。
- [ ] **Prompt 修正与重试**: 将反馈信息自动转化为修正指令，重新调用 `analyzer.js` 重新生成 v2 版本的 `.md`，再次进入 Step 1 验证，实现机器自我纠错。

### 🟡 Step 4: 正确的端到端串联逻辑（待实现 / 规划）
当前 Step 1 / Step 2 仅是联调用的“半自动”：Step 1 拿 references 第一个 md 测试、Step 2 临时回退参考视频。上线前应改为以下正确逻辑：

1. **输入源 = references 新增文件**：`validator_step1.js` 不应扫“第一个 .md”，而应处理 `skills/interaction-library/references/` 中**本次新增**的规范（建议用待处理清单 / 队列，或对比上次处理快照）。每新增一个组件规范，就自动跑一次 Step 1 生成 + 录制。
2. **参考视频 = crawler/output 下的原始视频**：Step 2 的裁判对象 `<component>_generated.webm` 必须与 `crawler/output/item_<n>/raw_video.mp4` 对应比较。
3. **名称映射挑战（关键）**：`output/` 下的视频都以**序号**命名（`item_1` / `item_2` / ...），与组件名（kebab-case）不是直接对应。现有映射机制是 `output/item_<n>/resolved_name.txt`（记录该条目对应的组件名）。因此必须保证：**每新增一个 `references/<component>.md`，都有对应的 `output/item_<n>/` 且其 `resolved_name.txt` 内容等于 `<component>`**。缺失映射时 Step 2 应跳过并明确报错，而非静默误判。
4. **落地后清理**：删除 Step 2 中 `findTempReferenceFallback` 的临时回退逻辑，并删除 `validation_output/` 下的临时参考文件（如 `bento-button-stagger-hover.mp4`、`.mov`）。

> **📌 TEMPORARY 备注（闭环测试用，务必后续清理）**
> - `validation_output/bento-button-stagger-hover.mp4` 是由 `自己录的.mov` 临时转码的**参考视频**，仅用于在没有 `output/` 映射时跑通 Step 2 闭环测试，**不是固定产物**，正式串联（Step 4）后必须删除。
> - `validator.js` 的 `findTempReferenceFallback()` 目前会在 `output/` 找不到匹配时回退到这里；Step 4 落地后需移除该函数与调用。

---

## 📅 归档记录 (Archive Log)

- **2026-07-29**: Step 1 正式归档。当日开发日志见 `.aidev/logs/validator/2026-07-29-step1-completed.md`。
  - Step 1 核心闭环已完成：代码生成代理 + 主动驱动动画 + 逐帧截图合成 + 亮度/运动校验（根治黑屏/空白）。
  - 遗留 TEMPORARY 项（临时 mp4 参考、findTempReferenceFallback、取首个 md hack）待 Step 4 清理。
  - 相关代码变更：`crawler/validator_step1.js`（新增）、`crawler/validator.js`、`crawler/analyzer.js`、`crawler/README.md`、`crawler/.aidev/plans.md/auto_test.md`（均尚未提交 git，待与功能代码一同 commit）。

---

## 4. 待攻克的隐性难点 (Hidden Complexities)

在推进上述计划时，需重点关注以下技术挑战：

1. **代码生成代理的稳定性与环境依赖**：
   - *难点*：动效规范可能要求使用 React 或 Framer Motion，但无头浏览器最容易运行的是单文件 HTML。
   - *对策*：在 Step 1 的 Prompt 中，强制要求 AI 使用 CDN 引入 React/Babel/Framer-Motion 等依赖，确保生成的 HTML 文件无需构建工具（Webpack/Vite）即可直接在浏览器双击运行。

2. **渲染环境的一致性 (Rendering Stage Consistency)**：
   - *难点*：Playwright 录制时的视口大小、背景颜色（暗黑/白天模式）、目标元素的初始位置，如果与原视频差异过大，会严重干扰后续 AI 裁判的判断。
   - *对策*：在代码生成 Prompt 中强加严格的全局 CSS 设定（如 `body { display: flex; justify-content: center; align-items: center; background: #171717; height: 100vh; margin: 0; }`）。

3. **交互时机的不可控性**：
   - *难点*：有些是 Hover 触发，有些是 Drag 触发。Playwright 如何知道该模拟什么动作？
   - *对策*：在 Playwright 中编写一套“通用探活交互脚本”（依次执行：鼠标移动到中心 -> 停留 -> 按下 -> 拖拽 -> 释放 -> 移出可视区），以此触发所有可能的状态机分支。

4. **AI 裁判的评估成本与“黑盒”问题**：
   - *难点*：多模态视频对比极其消耗 Token。且 AI 的 `similarity_score` 可能是玄学。
   - *对策*：在 Step 2 阶段，不仅要求输出分数，必须要求输出结构化的对比维度（如：速度是否一致？缓动是否一致？形变是否一致？），以增强可解释性。