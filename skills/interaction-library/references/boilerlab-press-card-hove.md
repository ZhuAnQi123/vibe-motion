---
version: beta-v2
name: boilerlab-press-card-hover
name_zh: "BoilerLab 媒体卡片悬浮聚焦"
cover_video: "../assets/boilerlab-press-card-hover.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/boilerlab-press-card-hover.mp4"
tags: ["Hover", "Card", "Proximity"]
preview: { backgroundColor: "#0A0A0A", textColor: "#FFFFFF" }
description: >
  这是一个应用于暗黑科技风网格布局的卡片悬浮聚焦动效。当鼠标划过媒体卡片时，目标卡片平滑放大并提升亮度，同时非悬停卡片轻微暗化，伴随丝滑的流体阻尼感。
  触发词：[暗黑卡片悬浮、非焦点暗化、流体缩放]
website: "https://boilerlab.ai/"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "300ms"

  variants:
    initial: { opacity: 0.85, scale: 1, filter: "brightness(0.9)" }
    animate: { opacity: 1, scale: 1.03, filter: "brightness(1.15)" }
    exit: { opacity: 0.85, scale: 1, filter: "brightness(0.9)" }
---

# BoilerLab 媒体卡片悬浮聚焦 Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 卡片在鼠标悬停时像气垫一样平滑隆起（微放大），并通过明暗对比（Brightness/Opacity）将视觉重心瞬间聚焦在当前卡片上，离开后平滑回弹，无生硬感。
- **Interaction Flow**: Hover -> Scale Up 1.03 + Brightness Up; Hover Out -> Smoothly reverse to initial dim state.

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Grid Wrapper]** (`div` - 网格容器)
  - 维护全局 `hoveredIndex` 状态，用于控制子元素的邻近暗化（Proximity Dimming）效果。
- **[Press Card Node]** (`motion.div` - 单个媒体卡片)
  - 承载 `whileHover` 的缩放与发光升变，应用 `transform_origin: center`。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 200ms] Hover In Phase**:
  - 当前卡片在 200ms 内通过 `PRESET_SPRING_SMOOTH` 从 `scale: 1` 放大至 `1.03`。
  - 亮度与不透明度同步提升。其余卡片不透明度微降至 `0.6`。
- **[Hover Out Phase] Return Sequence**:
  - 鼠标移出后，卡片在 150ms 内平滑回弹至初始状态，不产生多余晃动。

## 4. Implementation Directives for Code-Agent (核心指令)

1. **Framework Auto-Detection**: 优先检查 `package.json`。无上下文时默认使用 **React + Tailwind CSS + Framer Motion**。
2. **Performance Guard**: 仅允许对 `transform`、`opacity` 和 `filter` 进行 GPU 加速动画，严禁修改布局属性。
3. **Dark Mode Optimization**: 针对暗黑背景，悬浮时使用背景微亮色或高光边框（`rgba(255,255,255,0.05)`）代替传统阴影，避免脏阴影视觉污染。

## 5. Generated Code Skeleton (示例代码)

```tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

export const BoilerLabGrid = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black p-8 text-white">
      {items.map((item, index) => (
        <motion.div
          key={index}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
          animate={{
            scale: hoveredIndex === index ? 1.03 : 1,
            opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
            filter: hoveredIndex === index ? "brightness(1.1)" : "brightness(0.9)",
          }}
          transition={physicsConfig}
          style={{ transformOrigin: "center center" }}
          className="border border-neutral-800 rounded-xl p-6 bg-neutral-900/50 cursor-pointer backdrop-blur-sm"
        >
          <span className="text-sm text-neutral-400">{item.author}</span>
          <p className="mt-2 text-lg font-medium">{item.content}</p>
        </motion.div>
      ))}
    </div>
  );
};

```

## 🛑 AI Anti-Patterns & Blocklist (AI 避坑防偏与硬性禁忌)

* ❌ **严禁时长失控**：响应时间严禁超过 `300ms`，微交互需保持灵敏。
* ❌ **严禁非 GPU 加速**：不得在 Hover 时改变 `margin`, `padding` 或 `border-width` 导致页面抖动（Layout Thrashing）。
* ❌ **严禁暗色阴影**：在纯黑背景上禁止使用黑色 `box-shadow`，聚焦感应完全通过 `opacity` 和 `brightness` 驱动。

