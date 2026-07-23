version: beta-v3
name: fall-guy-app-icon
name_zh: "软萌眨眼图标"
cover_video: "../assets/fall-guy-app-icon.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/fall-guy-app-icon.mp4"
tags: ["Hover", "Button"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  悬停时，一个软萌的粉色图标角色会进行眨眼动画，并伴随轻微的缩放反馈。
  触发词：[图标缩放、眨眼动画、弹性反馈]
website: "Original design URL (Optional)"

rendering_engine: "DOM_CSS"

assets:
  required: true
  items:
    - name: "Core Graphic Asset"
      type: "SVG / PNG"
      description: "一个可矢量化的圆形粉色图标图形，包含两个独立的眼睛元素。"
  dependencies:
    - "framer-motion@^11.0.0"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 1, scale: 1 }
    animate: { opacity: 1, scale: 1.05 }
    exit: { opacity: 0, scale: 0.95 }
---

# 软萌眨眼图标 / Fall Guy App Icon Specification & Implementation Protocol

## 0. Prerequisite & Guardrail (防降级校验)

> **⚠️ 核心编码规则：**
> 1. **单体原子化原则**：仅导出 1 个高度可复用的原子 UI 组件（如 `<MotionButton />`），业务属性暴露为 `props`。
> 2. **轻量通用性**：不依赖外部 3D 资源库，保证开箱即用。

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 悬停时图标边缘轻微膨胀，同时其内部眼睛元素进行平滑的眨眼动画。
- **Interaction Flow**: Hover -> Icon Scale (1.0 -> 1.05) & Eyes Blink Animation (Open -> Closed -> Open); Mouse Out -> Reverse Scale.

## 2. Component DOM Mapping (原子组件结构映射)

- **[Stage Container]** (`div` - 外层视口与容器)
- **[Motion Node]** (`motion.div` - 承载 Framer Motion 物理特性的节点，用于整体图标的缩放)
- **[Icon Graphic]** (`svg` - 承载图标的主要图形，包括粉色 blob 主体和眼睛)
- **[Eye Elements]** (`motion.rect` 或 `motion.path` - 位于 SVG 内部，两个独立的眼睛元素，用于眨眼动画)

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 200ms] Hover In Phase**: 
  - **Icon Body**: Scales from `scale: 1` to `scale: 1.05` using a smooth spring animation.
  - **Eyes**: Simultaneously, eyes animate from `scaleY: 1` (open) to `scaleY: 0` (closed) and back to `scaleY: 1` (open) over approximately 150-200ms. This can be a sequence: `[scaleY: 1, scaleY: 0, scaleY: 1]`.
- **[200ms - 350ms] Idle Hover State**: Icon remains at `scale: 1.05`, eyes remain open.
- **[Exit Phase] Hover Out Phase**: 
  - **Icon Body**: Scales back from `scale: 1.05` to `scale: 1` using a smooth spring animation.
  - **Eyes**: Remain open (or complete any ongoing blink animation before settling to open state).

## 4. Finite State Machine (FSM) & Technical Directives

> **⚠️ [CRITICAL RULE FOR VISION AGENT]**
> 绝对禁止输出任何具体的 React/Vue/CSS 纯代码块！
> 你的职责是作为“系统分析师”，将视频拆解为供 Code Agent 执行的**有限状态机 (FSM)** 与 **技术实现指导算法**。

### 4.1 State Machine & Asset Transition Matrix (状态转换与资产矩阵)

| 触发阶段 (State) | 触发条件 (Event/Trigger) | 主体元素姿态/形态 (Primary Asset) | 关联目标姿态 (Target Element) | 关键物理参数与动画细节 |
| :--- | :--- | :--- | :--- | :--- |
| **Idle** | 初始加载 / 鼠标移出 | Icon: `scale: 1`. Eyes: `scaleY: 1` (open) | N/A | 无 |
| **Hover** | `onMouseEnter` / 鼠标悬停 | Icon: `scale: 1.05`. Eyes: `scaleY` sequence `[1, 0, 1]` | N/A | Icon `stiffness: 200`, `damping: 25`. Eyes `scaleY` with `duration: 150ms`, `ease: "easeInOut"` |

---

### 4.2 Implementation Logic Blueprint (技术实现逻辑蓝图)

请为 Code Agent 编写逻辑清晰的**技术实现指导（Pseudo-Logic）**，明确说明需要使用的框架 API 与状态控制手段：

#### 1. 状态管理依赖 (State Requirements)
- **核心状态变量**：
  - `isHovered`: `boolean`，通过 `useHover` 或 `onMouseEnter`/`onMouseLeave` 事件管理，控制整体图标的缩放。
- **物理量采集**：
  - 无需复杂的物理量采集，主要依赖 Framer Motion 的 `animate` 和 `whileHover` 属性。

#### 2. 碰撞与判定算法 (Collision & Hit Detection)
- 无碰撞检测，纯 UI 交互。

#### 3. 多元素时序编排 (Orchestration & Choreography)
- **关联动画触发机制**：
  - 主体 `motion.div` 使用 `whileHover={{ scale: 1.05 }}` 控制图标的缩放。
  - 眼睛的眨眼动画：在 SVG 内部，两个眼睛元素（例如 `motion.rect` 或 `motion.path`）监听父组件的 `isHovered` 状态。当 `isHovered` 变为 `true` 时，通过 `animate` 属性触发一个 `scaleY` 的关键帧序列动画：`animate={{ scaleY: [1, 0, 1] }}`，并设置合适的 `transition`（例如 `duration: 0.15`, `ease: "easeInOut"`）以模拟眨眼。可以设置 `repeat: 0` 或 `repeat: 1` 如果只希望眨一次。
- **形态突变与资产切换**：
  - 无形态突变，主要为 SVG 元素的属性动画。

---

## 🛑 Code Agent Execution Directives (下游代码大模型硬性执行规范)

> **⚠️ [SYSTEM DIRECTIVE FOR CODE AGENT]** 
> 当你读取本 MD 文件编写代码时，必须严格遵守以下工程规范：

1. **拒绝假动画 (No Fake Scale Down)**：如果状态矩阵指出了 `Asset Transition`（如文件变成纸团），必须通过条件渲染（如 `isCrumpled ? <CrumpledIcon /> : <FileIcon />`）或路径变形实现，严禁仅用简单的 `scale: 0` 糊弄。
2. **物理动量还原 (Velocity Awareness)**：如果交互涉及“抛掷 (Toss)”或“反弹 (Bounce)”，必须在 `onDragEnd` 中读取拖拽的末速度 `info.velocity`，并传递给 `dragTransition` 或计算反弹轨迹曲线。
3. **状态解耦与多元素联动**：严禁把所有动画写在一个 `motion.div` 内。必须将关联组件（如目标桶、提示 Toast、主拖拽物）分离，并通过状态共享或 Animation Controls 编排复杂的二次反馈（Secondary Animation）。
## 🛑 AI Anti-Patterns & Blocklist (AI 硬性禁忌)

> **⚠️ [SYSTEM RULE]** Code-Agent 必须严禁以下反模式：

### 1. The "Canvas-to-CSS" Downgrade (技术降级)

* ❌ **DON'T**: 严禁将 Canvas 粒子/Shader/流体效果降级使用 `<motion.img>` + `filter: blur()` 进行假粒子渲染。
* **DO**: 必须编写 Canvas 2D / WebGL 逐帧更新逻辑。

### 2. Business Overfitting & Hardcoding (业务硬编码与节点重复)

* ❌ **DON me**: 严禁在代码中写死具体品牌名称或在 Demo 中复制粘贴多个相同的动效节点。
* **DO**: 导出一个纯粹的原子组件，利用 `props` 实现复用。

### 3. Flat 3D Spinning (无透视的 2D 假 3D)

* ❌ **DON'T**: 严禁在不配置 `perspective` 和 `transform-style: preserve-3d` 的情况下直接使用 3D 旋转。
* **DO**: 必须建立 3D 视口，保证旋转具有立体空间感。
