---
version: beta-v3
name: neumorphic-stepper-button-hover
name_zh: "拟物步进器按钮悬停"
cover_video: "../assets/neumorphic-stepper-button-hover.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/neumorphic-stepper-button-hover.mp4"
tags: ["Hover", "Button", "Soft UI"]
preview: { backgroundColor: "#F2F2F2", textColor: "#4C4C4C" }
description: >
  悬停时步进器按钮表面产生轻微下压的拟物效果，伴随细致的亮部与阴影变化，增强按压的体感反馈。
  触发词：[按钮下压、拟物效果、柔和阴影、弹性回弹]
website: "https://x.com/BrettFromDJ/status/2074924933918892124"

rendering_engine: "DOM_CSS"

assets:
  required: true
  items:
    - name: "Button Base Shape"
      type: "SVG / CSS Shape"
      description: "基础的圆角矩形按钮结构，包含内部加号/减号图标。"
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
    initial: { scale: 1 }
    animate: { scale: 0.98 }
    exit: { scale: 1 }
---

# 拟物步进器按钮悬停 / Neumorphic Stepper Button Hover Specification & Implementation Protocol

## 0. Prerequisite & Guardrail (防降级校验)

> **⚠️ 核心编码规则：**
> 1. **单体原子化原则**：仅导出 1 个高度可复用的原子 UI 组件（如 `<MotionButton />`），业务属性暴露为 `props`。
> 2. **轻量通用性**：不依赖外部 3D 资源库，保证开箱即用。

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 悬停时按钮表面轻微内凹，通过亮部和阴影的微妙变化模拟拟物化的按压感。
- **Interaction Flow**: Hover -> Scale Down (1.0 -> 0.98) & Adjust Shadows/Highlights; Mouse Out -> Reverse smoothly.

## 2. Component DOM Mapping (原子组件结构映射)

- **[Stage Container]** (`div` - 外层容器，包含整个步进器)
- **[Button Wrapper]** (`motion.div` - 单个按钮容器，承载悬停动画)
- **[Content Layer]** (`span`, `svg` 等内容节点，例如加号/减号图标或文本)

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 350ms] Trigger Phase**: 鼠标悬停在按钮上，按钮 `scale` 从 `1` 变为 `0.98`，同时 `box-shadow` 和 `background` 渐变色发生反转，模拟内凹效果。动画使用 `PRESET_SPRING_SMOOTH` 预设。
- **[Exit Phase] Reverse Sequence**: 鼠标移开按钮，所有属性（`scale`, `box-shadow`, `background`）平滑地恢复到 `initial` 状态，动画保持 `PRESET_SPRING_SMOOTH` 预设。

## 4. Finite State Machine (FSM) & Technical Directives

> **⚠️ [CRITICAL RULE FOR VISION AGENT]**
> 绝对禁止输出任何具体的 React/Vue/CSS 纯代码块！
> 你的职责是作为“系统分析师”，将视频拆解为供 Code Agent 执行的**有限状态机 (FSM)** 与 **技术实现指导算法**。

### 4.1 State Machine & Asset Transition Matrix (状态转换与资产矩阵)

| 触发阶段 (State) | 触发条件 (Event/Trigger) | 主体元素姿态/形态 (Primary Asset) | 关联目标姿态 (Target Element) | 关键物理参数与动画细节 |
| :--- | :--- | :--- | :--- | :--- |
| **Idle** | 初始加载 / 鼠标移出 | 按钮处于默认凸起状态，`scale: 1`，正常 `box-shadow` 和 `background` 渐变。 | N/A | 无 |
| **Hover** | `onMouseEnter` | 按钮轻微内凹，`scale: 0.98`，`box-shadow` 和 `background` 渐变反转，模拟按压。 | N/A | `stiffness: 200`, `damping: 25`, `mass: 1`，实现平滑回弹。 |

---

### 4.2 Implementation Logic Blueprint (技术实现逻辑蓝图)

请为 Code Agent 编写逻辑清晰的**技术实现指导（Pseudo-Logic）**，明确说明需要使用的框架 API 与状态控制手段：

#### 1. 状态管理依赖 (State Requirements)
- **核心状态变量**：需定义 `isHovering` (布尔值，用于控制按钮的悬停状态)。
- **物理量采集**：无需复杂的物理量采集，主要依赖 Framer Motion 的 `whileHover` 属性。

#### 2. 碰撞与判定算法 (Collision & Hit Detection)
- 无需碰撞检测，交互纯粹通过鼠标悬停事件触发。

#### 3. 多元素时序编排 (Orchestration & Choreography)
- **关联动画触发机制**：每个按钮将独立响应鼠标的 `onMouseEnter` 和 `onMouseLeave` 事件。可以使用 Framer Motion 的 `whileHover` 属性来声明悬停时的动画。当鼠标进入时，按钮状态从 `initial` 转换为 `animate`；当鼠标离开时，按钮状态从 `animate` 恢复到 `initial`。
- **形态突变与资产切换**：无形态突变，纯粹的样式和变换动画。拟物效果将通过调整 CSS 属性（如 `box-shadow` 和 `background-image` 或 `filter` 属性）来实现亮部和阴影的变化，模拟按钮的深度感和按压感。可能需要使用多个伪元素或嵌套 `div` 来精确控制光影细节。

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
