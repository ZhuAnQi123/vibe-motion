version: beta-v3
name: interactive-cardboard-box
name_zh: "交互式纸箱"
cover_video: "../assets/interactive-cardboard-box.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/interactive-cardboard-box.mp4"
tags: ["Hover", "Geometric", "Minimal", "Illustration"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  An interactive cardboard box illustration where hovering over different areas triggers specific opening/closing animations for flaps and pushing in/out effects for handle cutouts, mimicking real-world box interactions with a clean, geometric style.
website: "https://x.com/aaronmahlke/status/2075488112776544750"

rendering_engine: "DOM_CSS"

assets:
  required: true
  items:
    - name: "Box SVG Illustration"
      type: "SVG"
      description: "The complete SVG artwork of the cardboard box, segmented into individual interactive parts (flaps, handles) for animation."
  dependencies:
    - "framer-motion@^11.0.0"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "varying per element (e.g., top-left for a flap)"
  stagger_delay: "0ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)
  duration: "350ms"

  variants:
    initial: {}
    animate: {}
    exit: {}
---

# 交互式纸箱 / Interactive Cardboard Box Specification & Implementation Protocol

## 0. Prerequisite & Guardrail (防降级校验)

> **⚠️ 核心编码规则：**
> 1. **单体原子化原则**：仅导出 1 个高度可复用的原子 UI 组件（如 `<MotionButton />`），业务属性暴露为 `props`。
> 2. **轻量通用性**：不依赖外部 3D 资源库，保证开箱即用。

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 悬停在纸箱的不同区域时，箱盖会围绕其铰链线旋转打开，而手提孔则会轻微内凹，提供仿真的触觉反馈。
- **Interaction Flow**: Hover -> Flap rotates open / Handle translates inward; Mouse Out -> Reverse animation.

## 2. Component DOM Mapping (原子组件结构映射)

- **[Stage Container]** (`div` - 外层视口与容器)
- **[Box SVG]** (`svg` - 承载整个箱子的基础线条图)
- **[Flap Elements]** (`motion.path` or `motion.g` within SVG - 代表可旋转的箱盖，每个箱盖需定义独立的 `transform-origin`)
- **[Handle Elements]** (`motion.path` or `motion.g` within SVG - 代表手提孔的线条，用于轻微位移)

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 350ms] Trigger Phase**: 当鼠标悬停在特定箱盖区域时，该箱盖会围绕其铰链线（例如，使用 `rotateX` 或 `rotateY`）从 0 度旋转到约 -90 度。手提孔区域会轻微向内平移（例如，`translateY` 约 -2px）。所有动画均使用平滑的弹簧预设。
- **[Exit Phase] Reverse Sequence**: 鼠标移开时，元素以相同的弹簧物理效果平滑返回到初始状态。

## 4. Finite State Machine (FSM) & Technical Directives

> **⚠️ [CRITICAL RULE FOR VISION AGENT]**
> 绝对禁止输出任何具体的 React/Vue/CSS 纯代码块！
> 你的职责是作为“系统分析师”，将视频拆解为供 Code Agent 执行的**有限状态机 (FSM)** 与 **技术实现指导算法**。

### 4.1 State Machine & Asset Transition Matrix (状态转换与资产矩阵)

| 触发阶段 (State) | 触发条件 (Event/Trigger) | 主体元素姿态/形态 (Primary Asset) | 关联目标姿态 (Target Element) | 关键物理参数与动画细节 |
| :--- | :--- | :--- | :--- | :--- |
| **Idle** | 初始加载 / 鼠标移出完成 | 所有箱盖关闭 (`rotate: 0deg`), 手提孔正常 (`translate: 0px`) | N/A | 无 |
| **Flap Hover** | `onMouseEnter` 悬停在特定箱盖区域 | 目标箱盖围绕其铰链线旋转打开 | N/A | `rotateX` 或 `rotateY` (例如：0deg 到 -90deg) 使用 `PRESET_SPRING_SMOOTH` |
| **Handle Hover** | `onMouseEnter` 悬停在特定手提孔区域 | 目标手提孔轻微向内平移 | N/A | `translateY` (例如：0px 到 -2px) 使用 `PRESET_SPRING_SMOOTH` |
| **Flap Exit** | `onMouseLeave` 鼠标移出箱盖区域 | 目标箱盖旋转回关闭状态 | N/A | `rotateX` 或 `rotateY` (例如：-90deg 到 0deg) 使用 `PRESET_SPRING_SMOOTH` |
| **Handle Exit** | `onMouseLeave` 鼠标移出手提孔区域 | 目标手提孔平移回正常状态 | N/A | `translateY` (例如：-2px 到 0px) 使用 `PRESET_SPRING_SMOOTH` |

---

### 4.2 Implementation Logic Blueprint (技术实现逻辑蓝图)

请为 Code Agent 编写逻辑清晰的**技术实现指导（Pseudo-Logic）**，明确说明需要使用的框架 API 与状态控制手段：

#### 1. 状态管理依赖 (State Requirements)
- **核心状态变量**：对于此简单悬停效果，可以直接在每个可交互 `motion` 组件上使用 Framer Motion 的 `whileHover` prop，无需额外定义本地状态变量。
- **物理量采集**：不需监听实时物理量。动画的物理特性通过 `motion_tokens` 中的 `active_physics` 配置由 Framer Motion 内部管理。

#### 2. 碰撞与判定算法 (Collision & Hit Detection)
- 悬停检测由标准 DOM 事件 `onMouseEnter` 和 `onMouseLeave` 处理。SVG 中的各个可交互部分（箱盖、手提孔）应作为独立的 `motion` 组件或包裹在 `motion.div` 中，以接收这些事件。

#### 3. 多元素时序编排 (Orchestration & Choreography)
- 整个纸箱的 SVG 可以作为基础图形。SVG 内部的各个可交互路径 (`path` 或 `g`) 元素应被独立抽象为 Framer Motion 组件（例如，`<motion.g whileHover={{ rotateX: -90, transformOrigin: "top center" }} />`）。
- 动画是独立的局部行为，每个交互元素（箱盖、手提孔）根据其自身的 `onMouseEnter`/`onMouseLeave` 事件触发各自的 `whileHover` 动画，无需复杂的全局状态共享或跨组件协调。

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
