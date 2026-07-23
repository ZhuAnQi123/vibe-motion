---
version: beta-v3
name: slot-text-transition
name_zh: "文字滚动切换动效"
cover_video: "../assets/slot-text-transition.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/slot-text-transition.mp4"
tags: ["Typographic", "Text", "Scroll", "Reveal", "Transition"]
preview: { "backgroundColor": "#FFFFFF", "textColor": "#333333" }
description: >
  该交互通过平滑的垂直滚动切换单个单词或短语，模拟老虎机或翻牌效果。
  伴随文本内容的更新，字体颜色也可能发生变化，创造出动态且富有活力的文本展示。
  触发词：[文字滚动, 文本切换, 老虎机效果, 字符翻转]
website: "Original design URL (Optional)"

rendering_engine: "DOM_CSS"

assets:
  required: true
  items:
    - name: "Text content"
      type: "String"
      description: "需要切换的文本内容，通常是单个单词或短语。"
  dependencies:
    - "framer-motion@^11.0.0"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "50ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  duration: "500ms"

  variants:
    initial: { "y": "100%", "opacity": 0 }
    animate: { "y": "0%", "opacity": 1 }
    exit: { "y": "-100%", "opacity": 0 }
---

# 文字滚动切换动效 / Slot Text Transition Specification & Implementation Protocol

## 0. Prerequisite & Guardrail (防降级校验)

> **⚠️ 核心编码规则：**
> 1. **单体原子化原则**：仅导出 1 个高度可复用的原子 UI 组件（如 `<MotionTextSlot />`），业务属性暴露为 `props`。
> 2. **轻量通用性**：不依赖外部 3D 资源库，保证开箱即用。

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 文本内容以平滑的垂直滚动方式进行切换，旧文本向上或向下滚出，新文本从相反方向滚入，伴随透明度和颜色的渐变，模拟数字翻牌或老虎机效果。整个过程流畅且富有弹性。
- **Interaction Flow**: Text Content Update -> Old text `y` animates to `-100%` (or `100%`) and `opacity` to `0`; New text `y` animates from `100%` (or `-100%`) to `0%` and `opacity` to `1`. Color transitions are often integrated.

## 2. Component DOM Mapping (原子组件结构映射)

- **[Stage Container]** (`div` - 外层视口，设置 `overflow: hidden` 来剪裁滚出/滚入的文本)
- **[Text Wrapper]** (`motion.div` - 包裹旧文本和新文本，用于管理整体的文本切换，如果需要整体动画)
- **[Old Text Node]** (`motion.span` - 承载即将滚出视口的旧文本)
- **[New Text Node]** (`motion.span` - 承载即将滚入视口的新文本)

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 500ms] Text Transition Phase**: 
  - 当 `text` prop 发生变化时：
    - **旧文本 (Exiting)**：`y` 属性从 `0%` 动画到 `-100%`（或 `100%`），同时 `opacity` 从 `1` 动画到 `0`。颜色可同步或异步过渡到目标颜色或透明。
    - **新文本 (Entering)**：`y` 属性从 `100%`（或 `-100%`）动画到 `0%`，同时 `opacity` 从 `0` 动画到 `1`。颜色从初始状态（如透明或特定颜色）动画到最终显示颜色。
  - 两个文本元素的动画重叠执行，确保无缝切换。单个字符的动画可以通过 `staggerChildren` 实现。

## 4. Finite State Machine (FSM) & Technical Directives

> **⚠️ [CRITICAL RULE FOR VISION AGENT]**
> 绝对禁止输出任何具体的 React/Vue/CSS 纯代码块！
> 你的职责是作为“系统分析师”，将视频拆解为供 Code Agent 执行的**有限状态机 (FSM)** 与 **技术实现指导算法**。

### 4.1 State Machine & Asset Transition Matrix (状态转换与资产矩阵)

| 触发阶段 (State) | 触发条件 (Event/Trigger) | 主体元素姿态/形态 (Primary Asset) | 关联目标姿态 (Target Element) | 关键物理参数与动画细节 |
| :--- | :--- | :--- | :--- | :--- |
| **Idle** | 初始加载 / 文本未变化 | `motion.span` 显示当前文本，`y: 0%`, `opacity: 1`, `color: current_color` | N/A | 无 |
| **Text Update (Exiting)** | `text` prop 发生变化 | 旧文本 `motion.span` 姿态：`y: 0% -> -100%`, `opacity: 1 -> 0`, `color: current_color -> transparent` | N/A | `selected_preset` 定义的平滑弹簧曲线 |
| **Text Update (Entering)** | `text` prop 发生变化 | 新文本 `motion.span` 姿态：`y: 100% -> 0%`, `opacity: 0 -> 1`, `color: transparent -> new_color` | N/A | `selected_preset` 定义的平滑弹簧曲线 |

---

### 4.2 Implementation Logic Blueprint (技术实现逻辑蓝图)

请为 Code Agent 编写逻辑清晰的**技术实现指导（Pseudo-Logic）**，明确说明需要使用的框架 API 与状态控制手段：

#### 1. 状态管理依赖 (State Requirements)
- **核心状态变量**：需要跟踪当前的 `text` prop 和前一个 `text` prop，以便在每次更新时，能够同时渲染旧文本（用于退出动画）和新文本（用于进入动画）。可以使用 `useState` 结合 `useEffect` 来管理当前和前一个文本。
- **Frameless Motion Key**: 对于每一个动画中的文本单元（例如，每个单词或整个短语），需要为其分配一个唯一的 `key`，以便 Framer Motion 的 `AnimatePresence` 能够正确识别组件的进入和退出。

#### 2. 碰撞与判定算法 (Collision & Hit Detection)
- 不适用于此文本切换动效。

#### 3. 多元素时序编排 (Orchestration & Choreography)
- **文本内容拆分与渲染**：如果需要实现每个字符或单词的独立动画，则需要将文本字符串拆分为字符数组或单词数组，并为每个部分渲染一个独立的 `motion.span` 元素。
- **`AnimatePresence` 的应用**：使用 Framer Motion 的 `AnimatePresence` 组件包裹可变的文本元素。当 `text` prop 更新导致旧文本元素被替换时，`AnimatePresence` 会处理旧元素的 `exit` 动画和新元素的 `initial`/`animate` 动画。
- **动画方向控制**：`initial` 和 `exit` 变体的 `y` 值应设计为相反方向（例如，`initial: { y: '100%' }`, `exit: { y: '-100%' }`），以实现向上或向下滚动的视觉效果。
- **颜色动画**：颜色属性的动画可以直接通过 Framer Motion 的 `animate` prop 来实现，或者在 `variants` 中定义，与 `y` 和 `opacity` 动画同步。
- **Staggering (错开)**：如果文本被拆分为多个部分（如每个字符），可以使用 `transition.staggerChildren` 来创建错开的动画效果，使每个字符按序进入或退出，增强动态感。

---