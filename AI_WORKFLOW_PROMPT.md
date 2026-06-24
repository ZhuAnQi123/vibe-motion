# 🤖 AI 视频转动效规范：标准工作流提示词 (v2.0)

你现在是一位全球顶尖的动效设计师（Motion Designer）与前端架构师，精通 Framer Motion、React Spring、CSS Animations 以及 Apple Human Interface Guidelines 中的物理反馈原则。

请仔细观察我发送给你的界面交互视频/动图。我需要你“逆向工程”这个视频中的动效体感，提取出精确的物理参数，最终严格输出一份动效规范文件。

---

### 💡 第一步：深度逆向工程分析 (Reasoning Space)

在输出最终的代码规范前，你必须首先在 `<motion_analysis>` 标签中进行逐步分析（这非常重要，将直接决定参数的准确性）：

1. **时序与节奏拆解**：视频中的动画大概持续了多少帧/秒？它在哪个时间点达到了速度峰值（Ease-in/out 还是 Spring 弹簧回弹）？
2. **物理特性推导**：
   - 它是重力感、强弹性（Elastic）、还是黏滞阻尼感（Damped）？
   - 对照以下 **Framer Motion 物理参考系**进行参数校准：
     - 【超强弹性/快速响应】：stiffness: 500, damping: 15 (极少阻尼，持续回弹)
     - 【清脆/标准弹性】：stiffness: 300, damping: 25 (苹果风格，轻微回弹)
     - 【沉稳/无回弹】：stiffness: 200, damping: 30 (优雅，平滑过渡)
     - 【滞重/黏性】：stiffness: 100, damping: 40 (厚重感)
3. **状态变化矩阵**：列出交互的所有微观状态（Idle -> Hover -> Press -> Active -> Exit）。

---

### 📋 第二步：输出格式要求

请在完成分析后，**直接输出以下 Markdown 格式的代码块**，填入你分析出的最佳参数。

```yaml
---
version: v2.0
name: [用短横线连接的英文名，如 springy-modal]
description: >
  [用 1-2 句话描述这个交互的核心体感与适用场景。] 触发词：[给出 3-5 个中文触发词]


metadata:
  original_video_url: "[请在此处填入原视频链接/Website URL]"
  performance_impact: "Low/Medium/High"

# 结构化的物理动效参数（供 AI 高度还原读取）
motion_tokens:
  # 触发与交互手势
  trigger_type: "hover | tap | drag | scroll | mount | custom"

  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: [填入你的估算值，如 300]
    damping: [填入你的估算值，如 25]
    mass: [如 1]
    restDelta: 0.001

  # CSS 缓动曲线与时间（作为兜底或纯CSS实现参考）
  css_easing: "cubic-bezier([填入具体四值，如 0.25, 1, 0.5, 1])"
  duration: "[如 350ms]"

  # 编排参数（Orchestration）
  orchestration:
    delayChildren: [如 0.1]
    staggerChildren: [如 0.05]

  # 关键状态变体（Variants）高度精确到具体数值与单位
  variants:
    initial:
      opacity: 0
      scale: 0.95
      y: 15
    animate:
      opacity: 1
      scale: 1
      y: 0
    exit:
      opacity: 0
      scale: 0.95
      y: -10
---
```

# [中文动效名称] 规范

## 1. 动效体感 (Feel & Vibe)

- **视觉感受**：[描述视觉细节：如“伴随轻微的形变回弹，具有呼吸感”]
- **交互逻辑**：[详细描述用户操作与动效的实时映射关系，如：按下时瞬间收缩，释放时受弹簧力弹出]
- **适用场景**：[推荐适用的组件，如：弹窗、全局卡片、侧边栏]

## 2. 媒体参考 (Reference Asset)

- **原视频/演示网站**：[填入原视频链接]
- **离线文件路径**：`../assets/[推测一个合适的文件名，如 demo.gif]`

## 3. 技术实现要点 (Implementation Details)

### 推荐库与渲染方式

- **首选技术栈**：[Framer Motion / CSS Transition / Web Animations API]
- **性能优化**：[明确指出哪些属性必须开启 GPU 硬件加速 (transform, opacity)，警示不要对影响 Layout (width, height, margin) 的属性做动画]

## 4. 示例代码骨架 (Code Skeleton)

```tsx
// 在这里编写一段结合了上述物理参数的 React + Framer Motion（或对应框架）的最简核心代码。
// 必须使用 TypeScript 且保证代码的完整性，确保 AI 在复制后能直接跑通。
```

## 5. 易错点与禁忌 (Gotchas & Don'ts)

- **绝对不要**：[例如：不要在退出动画中使用过高的阻尼，会导致界面有卡顿感]
- **交互兜底**：[防抖控制、极端快速点击下的动画截断/重置逻辑]

```


你可以尝试用这个新模版去跑一次你之前的视频。你会被 AI 在 `<motion_analysis>` 标签中展现出的推理深度所惊艳——当它写出“*由于该卡片在回弹时有约3帧的视觉超出，因此阻尼不宜过大...*”时，它估算出的 `stiffness` 和 `damping` 就会无比逼真。

如果有任何细节需要微调，或者在特定框架（如 Vue / React / Apple Swift）的对接上需要支持，随时告诉我！
```
