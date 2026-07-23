---
version: beta-v3
name: interaction-name-analysis
name_zh: "动效中文名称"
cover_video: "../assets/replace-with-name.mp4" # 必须直接替换为 name 字段的实际值
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/replace-with-name.mp4" # 必须直接替换为 name 字段的实际值
# 📢 统一标签规范：必须且只能从以下 12 个精选 Motion 标签中选择 1~3 个放入数组中
# 可选标签：["Elastic", "Magnetic", "Scroll", "Reveal", "Proximity", "Curtain", "Hover", "Button", "Card", "Carousel", "Accordion", "Click", "3D", "Particle"]
tags: ["Hover", "Button"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  详细描述该交互的“核心物理体感与图形反馈”。
  ⚠️ 严禁出现具体业务/品牌名称（如 Stripe、GHO、Supabase 等），必须解耦为通用的 UI/图形交互描述。
  例如：“这是一个通用的 3D 卡片/徽章悬停翻转动效，鼠标悬停时围绕 Y 轴旋转并产生深度透视，伴随阻尼回弹。”
  触发词：[填入通用触发词，如 3D翻转、粒子消散、流体展开、阻尼回弹]
website: "Original design URL (Optional)"

# ==========================================
# 🛑 ENGINE ROUTING ( Vision-Agent 必须精准评估渲染引擎 )
# ==========================================
# 可选值:
# - DOM_CSS: 基础 2D UI 交互 (按钮悬停、卡片展开、平移、缩放、透明度)
# - DOM_3D: 轻量 CSS 3D 变换 (rotateY/rotateX，涉及 perspective 和 preserve-3d)
# - CANVAS_2D: 像素级采样、粒子消散/重组、2D 物理引擎碰撞、复杂线条轨迹
# - WEBGL_3D: 带光影/材质/深度贴图的真实 3D 模型或复杂的 Shader 特效
rendering_engine: "DOM_CSS"

# ==========================================
# 🛡️ ASSET CONTRACT ( 素材契约与依赖项定义 )
# ==========================================
# Vision-Agent 指引：
# 1. 业务解耦：严禁按业务定义多个重复素材，只定义【单个原子组件】所需的核心图元/贴图。
# 2. 技术规格精确化：若为 Canvas/WebGL 动效，必须在 specs 中声明像素采样要求。
assets:
  required: true
  items:
    - name: "Core Graphic/Texture Asset"
      type: "SVG / PNG (高对比度/透明背景)"
      description: "描述完成该单体原子组件所需的矢量或位图结构"
      specs:
        aspect_ratio: "1:1"
        sampling_required: false # 若为粒子/Canvas动效，设为 true 并注明需要 alpha 通道/像素提取
  dependencies:
    - "framer-motion@^11.0.0"

# ==========================================
# ⚙️ MOTION TOKENS ( 动效物理预设 )
# ==========================================
motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH" # 选项: PRESET_SPRING_BOUNCE | PRESET_SPRING_SMOOTH | PRESET_SPRING_STIFF | PRESET_EASE_OUT_EXPO | PRESET_EASE_IN_OUT
  transform_origin: "center center"
  stagger_delay: "0ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 1, scale: 1, rotateY: 0 }
    animate: { opacity: 1, scale: 1.05, rotateY: 90 }
    exit: { opacity: 0, scale: 0.95 }
---

# [动效中文名称 / English Name] Specification & Implementation Protocol

## 0. 准备工作与防逃跑校验 (Prerequisite & Guardrail - MUST READ)

> **⚠️ 核心指令（针对 Code-Agent）：**
> 在开始编写代码前，你必须校验以下规则，严禁“偷工减料”：
> 
> 1. **引擎防降级约束 (ANTI-FALLBACK RULE)**：
>    - 若 `rendering_engine` 为 `CANVAS_2D` 或 `WEBGL_3D`：**严禁使用 `<motion.img>` 或 CSS 模糊 (blur) 来伪造粒子/流体效果**！必须使用 HTML5 Canvas API 或 Three.js 编写完整的像素采样与 `requestAnimationFrame` 动画循环！
>    - 若 `rendering_engine` 为 `DOM_3D`：必须在父节点包含 `perspective` 透视视口，并在动画节点开启 `transformStyle: 'preserve-3d'`，严禁生成扁平无深度的纸片旋转！
> 
> 2. **单体原子化代码原则 (ATOMIC COMPONENT RULE)**：
>    - 即使视频中展示了多个重复元素，你**只需且只能导出 1 个高度复用的原子组件**（如 `<MotionCard />`）。背景色、图标路径等必须暴露为 `props` 动态传入，严禁硬编码重复节点！
> 
> 3. **素材与算法兼容性拦截 (ASSET COMPATIBILITY CHECK)**：
>    - **If (渲染引擎为 Canvas/WebGL，但用户仅提供了一个普通静态 SVG/PNG，且未编写像素采样代码)** {
>        停止直接生成简单的 CSS 代码；
>        向用户发出明确提示：“此动效需要 Canvas/WebGL 逐像素采样渲染。我将为你编写算法，请确认你上传的图片具有清晰的高对比度轮廓...”
>    }

## 1. Interaction & Feel Vibe (动效体感与业务解耦)

- **Visual Physics Class**: [Choose one: Fluid-Elastic / Snappy-Mechanical / Linear-Smooth / Particle-Dissolve / 3D-Perspective]
- **Core Experience**: [抽象描述极佳的物理反馈。严禁提及品牌名字。例如：“鼠标悬停时，元素呈现带有阻尼感的光晕拉伸与 3D 轴向侧翻，移出时平滑复位。”]
- **Interaction Flow**: [E.g., Hover -> Scale (1.0 -> 1.05) & RotateY (0deg -> 90deg); Mouse Out -> Reverse via PRESET_SPRING_SMOOTH.]

## 2. Component DOM Mapping (原子组件结构映射)

*_Vision-Agent: 将视频中的视觉元素解耦并映射为单个可复用的 DOM/Canvas 架构。_*

- **[Stage Container]** (e.g., `div` - 视角与透视容器)
  - 根据 `rendering_engine` 决定是否应用 `perspective` 或建立 Canvas 上下文。
- **[Motion Node]** (e.g., `motion.div` 或 `canvas`)
  - 核心动效载体，承载物理参数与动画状态机。
- **[Layer Elements]** (e.g., `img`, `svg`, `shadow-layer`)
  - 解耦后的图像与辅助光影层。

## 3. Detailed Timeline Sequence (精确时序编排)

*_Vision-Agent: 基于视频帧分析导出以毫秒为单位的时序。_*

- **[0ms - 350ms] Trigger Phase (悬停/点击触发)**:
  - 描述核心属性变化轨迹 (`scale`, `transform`, `opacity`, `particle_velocity`)。
- **[Exit Phase] Reverse Sequence (撤销/移出阶段)**:
  - 描述退场或恢复初始状态的逻辑。

## 4. Implementation Directives for Code-Agent (硬性编码指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NON-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection**: 优先读取项目根目录 `package.json` 判定环境，默认输出 React + Tailwind CSS + Framer Motion（若为 Canvas/WebGL 需引入原生 Canvas 或 Three.js）。
> 2. **Performance Guard**: 严禁触发 Reflow。DOM 路线仅允许动画 `transform`, `opacity`, `filter`；Canvas 路线必须注意粒子数量控制与 Canvas 清除机制 (`clearRect`)。
> 3. **Business De-coupling**: 变量命名、Props 接口定义必须完全抽象化（如 `iconUrl`, `activeColor`），禁止使用业务专有名词。

## 5. Generated Code Skeleton (示例代码模板)

*_Vision-Agent: 生成一份符合 rendering_engine 要求的完整单体组件示例代码。_*

```tsx
// 示例：单体原子组件导出 (React + Framer Motion / Canvas)
import React from "react";
import { motion } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

interface MotionComponentProps {
  iconUrl?: string;
  className?: string;
}

/**
 * 通用单体原子动效组件
 */
export const MotionComponent: React.FC<MotionComponentProps> = ({
  iconUrl,
  className = "",
}) => {
  return (
    <div className="perspective-1000 flex items-center justify-center">
      <motion.div
        initial="initial"
        whileHover="animate"
        transition={physicsConfig}
        style={{ transformStyle: "preserve-3d" }}
        className={`relative cursor-pointer ${className}`}
      >
        {/* 图形/渲染层 */}
        {iconUrl ? (
          <img src={iconUrl} alt="Motion Asset" className="w-full h-full object-contain" />
        ) : (
          <div className="w-20 h-20 bg-neutral-800 rounded-xl" />
        )}
      </motion.div>
    </div>
  );
};

```

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