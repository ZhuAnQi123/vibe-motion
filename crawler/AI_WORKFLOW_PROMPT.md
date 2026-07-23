# 🌟 AI 动效过滤与生成规范 (SYSTEM DIRECTIVE)

> **⚠️ [REJECTION RULES / 拒绝跳过准则]** 
> 作为一个专门服务于 "Web 界面 UI/UX 动效" 的 Agent，你的目标是生成可由标准 Web 技术（DOM, CSS, Framer Motion, 基础 2D Canvas）高质量还原的代码。
> 
> **当你分析视频时，如果发现包含以下任意特征，必须将返回的 JSON 字段 `shouldSkip` 设为 `true`，并说明 `skipReason`：**
> 1. **3D 渲染与模型**：包含具象的 3D 人物/物体、Blender/C4D/Spline 导出的三维模型渲染。
> 2. **Three.js 粒子阵列与流体**：包含复杂的 3D 粒子流、流体动力学解算、烟雾/火焰粒子等。
> 3. **复杂几何体 Shader 变形**：依赖复杂顶点着色器（Vertex Shader）实现的数学噪声网格弯曲或扭曲。
> 4. **纯 CG 动画**：与 UI 交互组件（按钮、卡片、导航、模态框、悬停反馈等）完全无关的 CG 片头或影视特效。

---
version: beta-v3
name: interaction-name-analysis
name_zh: "动效中文名称"
cover_video: "../assets/replace-with-name.mp4" # 替换为 name 字段实际值
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/replace-with-name.mp4" # 替换为 name 字段实际值
# 可选标签：["Elastic", "Magnetic", "Scroll", "Reveal", "Proximity", "Curtain", "Hover", "Button", "Card", "Carousel", "Accordion", "Click"]
tags: ["Hover", "Button"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  详细描述该交互的“核心物理体感与图形反馈”。
  ⚠️ 严禁出现具体业务/品牌名称，必须解耦为通用的 UI 交互描述。
  触发词：[填入通用触发词，如 按钮拉伸、卡片展开、阻尼回弹、吸附效果]
website: "Original design URL (Optional)"

# ==========================================
# 🛑 ENGINE ROUTING
# ==========================================
# 可选值:
# - DOM_CSS: 基础 2D UI 交互 (按钮悬停、卡片展开、平移、缩放、透明度)
# - DOM_3D: 轻量 CSS 3D 变换 (rotateY/rotateX，涉及 perspective 和 preserve-3d)
# - CANVAS_2D: 像素级采样、基础 2D 粒子微动、2D 碰撞
rendering_engine: "DOM_CSS"

# ==========================================
# 🛡️ ASSET CONTRACT
# ==========================================
assets:
  required: true
  items:
    - name: "Core Graphic Asset"
      type: "SVG / PNG"
      description: "描述完成该单体 UI 原子组件所需的矢量或图元结构"
  dependencies:
    - "framer-motion@^11.0.0"

# ==========================================
# ⚙️ MOTION TOKENS
# ==========================================
motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH" # 选项: PRESET_SPRING_BOUNCE | PRESET_SPRING_SMOOTH | PRESET_SPRING_STIFF | PRESET_EASE_OUT_EXPO
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

# [动效中文名称 / English Name] Specification & Implementation Protocol

## 0. Prerequisite & Guardrail (防降级校验)

> **⚠️ 核心编码规则：**
> 1. **单体原子化原则**：仅导出 1 个高度可复用的原子 UI 组件（如 `<MotionButton />`），业务属性暴露为 `props`。
> 2. **轻量通用性**：不依赖外部 3D 资源库，保证开箱即用。

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: [Fluid-Elastic / Snappy-Mechanical / Linear-Smooth]
- **Core Experience**: [抽象描述物理反馈，如“悬停时元素随阻尼拉伸，带有平滑弹性复位。”]
- **Interaction Flow**: [Hover -> Scale (1.0 -> 1.05); Mouse Out -> Reverse.]

## 2. Component DOM Mapping (原子组件结构映射)

- **[Stage Container]** (`div` - 外层视口与容器)
- **[Motion Node]** (`motion.div` - 承载 Framer Motion 物理特性的节点)
- **[Content Layer]** (`span`, `svg` 等内容节点)

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 350ms] Trigger Phase**: 描述核心属性变化（`scale`, `opacity`, `translate`）。
- **[Exit Phase] Reverse Sequence**: 描述复位与退场时序。

## 4. Finite State Machine (FSM) & Technical Directives

> **⚠️ [CRITICAL RULE FOR VISION AGENT]**
> 绝对禁止输出任何具体的 React/Vue/CSS 纯代码块！
> 你的职责是作为“系统分析师”，将视频拆解为供 Code Agent 执行的**有限状态机 (FSM)** 与 **技术实现指导算法**。

### 4.1 State Machine & Asset Transition Matrix (状态转换与资产矩阵)

必须梳理出交互过程中**所有涉及元素**在不同状态下的视觉姿态、资产形态及物理响应：

| 触发阶段 (State) | 触发条件 (Event/Trigger) | 主体元素姿态/形态 (Primary Asset) | 关联目标姿态 (Target Element) | 关键物理参数与动画细节 |
| :--- | :--- | :--- | :--- | :--- |
| **Idle** | 初始加载 / 重置完成 | 默认形态 (例: 📄 文件图标), Scale: 1, Static | 默认形态 (例: 🗑️ 静态垃圾桶) | 无 |
| **Active Drag** | `onDragStart` / 按住拖拽 | 悬浮形态, 伴随位移跟手, Shadow 放大, 旋转跟随位移 | 静态 / 或呈现 Hover 高亮状态 | `scale: 1.05`, 动态跟手倾斜 `rotate: f(vx)` |
| **Release: Hit** | 松手且命中碰撞区域 | **[资产突变/销毁]** 快速向目标中心缩放/旋转/透明度归零 | **[关联触发]** 垃圾桶执行“吞咽/抖动”二次动画 | 极快缩放 `scale: 0`, `rotate: 360deg`, 触发 Success Toast |
| **Release: Miss**| 松手且未命中碰撞区域 | **[形态切换]** 突变为球体/纸团形态 (📄 -> ⚪️) | 保持 Idle 或触发 Miss 计数器增加 | 提取 `info.velocity` 动量，执行碰撞落地/反弹归位动画 |

---

### 4.2 Implementation Logic Blueprint (技术实现逻辑蓝图)

请为 Code Agent 编写逻辑清晰的**技术实现指导（Pseudo-Logic）**，明确说明需要使用的框架 API 与状态控制手段：

#### 1. 状态管理依赖 (State Requirements)
- **核心状态变量**：需定义哪些本地状态？（例如：`isDragging`, `isCrumpled` [形态是否突变], `isHit`, `missCount`）
- **物理量采集**：需要监听哪些实时物理量？（例如：Framer Motion 的 `useMotionValue` 结合 `useTransform` 映射旋转角，`onDragEnd` 的 `info.velocity` 动量控制）

#### 2. 碰撞与判定算法 (Collision & Hit Detection)
- 描述精确的碰撞检测逻辑（例如：基于 DOM 包围盒 `getBoundingClientRect()` 的 Overlap 计算，或距离圆心的 Radius 计算）。

#### 3. 多元素时序编排 (Orchestration & Choreography)
- **关联动画触发机制**：当主体元素（如文件）处于某个状态时，目标元素（如垃圾桶）如何配合动作？（例如：使用 Framer Motion 的 `useAnimation` 模块，在 `Hit` 事件触发后通过 `await controls.start({ scale: [1, 1.2, 1] })` 播放垃圾桶吞咽动画）。
- **形态突变与资产切换**：说明在什么条件下进行条件渲染（Conditional Rendering）或 SVG Path 变形（Morphing）。

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

