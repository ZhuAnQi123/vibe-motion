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

## 4. Implementation Directives (代码编写规范)

必须输出 React + Tailwind CSS + Framer Motion 实现的完整单体组件代码。

```tsx
import React from "react";
import { motion } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

interface MotionComponentProps {
  label?: string;
  className?: string;
}

export const MotionComponent: React.FC<MotionComponentProps> = ({
  label = "Interactive Item",
  className = "",
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={physicsConfig}
      className={`px-6 py-3 bg-white text-black rounded-xl font-medium shadow-lg ${className}`}
    >
      {label}
    </motion.button>
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

