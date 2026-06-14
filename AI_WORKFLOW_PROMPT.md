# 🤖 AI 视频转动效规范：标准工作流提示词

```markdown
你现在是一位全球顶尖的动效设计师（Motion Designer）与前端架构师，精通 Framer Motion、CSS Animations 以及 Apple Human Interface Guidelines 中的物理反馈原则。

请仔细观察我发送给你的界面交互视频/动图。我需要你“逆向工程”这个视频中的动效体感，并提取出精确的物理参数，最终严格按照我提供的 YAML+Markdown 格式输出一份动效规范文件。

### 你的分析任务：
1. **拆解视觉体感**：是黏滞的、轻盈的、机械的，还是带呼吸感的？
2. **捕捉核心动作**：元素在交互时经历了哪些状态流转（如长按缩小、松手回弹超出边界）。
3. **量化物理参数（最关键）**：
   - 估算它如果使用 Framer Motion 的 `spring` 弹簧，合理的 `stiffness`（刚度）和 `damping`（阻尼）应该是多少？
   - 如果用纯 CSS，合理的贝塞尔曲线 `cubic-bezier` 是什么？
   - 动画时长（duration）大概是多少毫秒？

### 输出格式要求：
请不要解释你的思考过程，**直接输出以下格式的代码块**，填入你分析出的最佳参数和规范说明。

---
version: alpha
name: [用短横线连接的英文名，如 fluid-sidebar]
description: >
  [用 1-2 句话描述这个交互的核心体感与适用场景。]
  触发词：[给出 3-5 个中文触发词]

# 结构化的物理动效参数（供 AI 读取，极度重要）
motion_tokens:
  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: [填入你的估算值，如 400]
    damping: [填入你的估算值，如 30]
    mass: [如 1]
  
  # CSS 缓动曲线与时间
  css_easing: "[填入如 cubic-bezier(0.25, 1, 0.5, 1)]"
  duration: "[如 400ms]"
  
  # 关键变体状态流转
  variants:
    initial: { [填写初始 CSS/属性] }
    animate: { [填写变化后的 CSS/属性] }
    exit: { [如果适用，填写退出态] }
---

# [中文动效名称] 规范

## 1. 动效体感 (Feel & Vibe)
- **视觉感受**：[填入你的分析]
- **交互逻辑**：[详细描述从开始触发到结束的状态变化]
- **适用场景**：[适合什么类型的组件]

## 2. 媒体参考 (Reference Asset)
- **文件路径**：`../assets/[根据视频推测一个合适的文件名，如 demo.gif]`

## 3. 技术实现要点 (Implementation Details)
### 推荐库
- **首选**：[通常是 Framer Motion 或 CSS]
### 关键属性
- [指出哪些属性必须开启硬件加速，如 transform, opacity，以及不要去动画化宽高等]

## 4. 示例代码骨架 (Code Skeleton)
[在这里编写一段结合了上述物理参数的 React + Framer Motion（或对应框架）的最简核心代码，确保代码能够直接跑通并还原该效果]

## 5. 易错点与禁忌 (Gotchas & Don'ts)
- **绝对不要**：[如 过度拖泥带水的退出动画]
- **交互兜底**：[如 防抖、防多次点击逻辑]
```
