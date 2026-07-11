---
version: beta-v2
name: opacity-liquid-type
name_zh: "不透明度液体字形动效"
cover_video: "../assets/opacity-liquid-type.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/opacity-liquid-type.mp4"
tags: ["Elastic", "Reveal"]
preview: { backgroundColor: "#CBD9E6", textColor: "#FFFFFF" }
description: >
  这是一个展示品牌名称“OPACITY”的动态Logo研究，其中字母“O”展现出独特的液体状扭曲和脉冲效果。整个字母组以3D光泽感呈现，背景模糊而柔和，营造出一种超现实的氛围。动效核心体感是“流畅的弹性扭曲”，如同水滴或凝胶般形变，循环往复。
  触发词：[液体扭曲、弹性形变、3D字形、动态Logo、脉冲]
website: "https://x.com/NotoriousUSB/status/2071587492084494570"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms" # 字母“O”的内部动画是连续的，无子元素交错。

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms" # 针对非循环的单次过渡，循环动画的周期由animate属性控制。

  variants:
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" }
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# 不透明度液体字形动效 / Opacity Liquid Type Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: "OPACITY" 品牌Logo中的字母“O”呈现出一种富有弹性的液体状扭曲和脉冲效果，其内部形状如同水滴或凝胶般持续变形、扩张与收缩，营造出一种连绵不绝的流动感。整个Logo以3D光泽感和模糊的背景增强了抽象艺术气息。
- **Interaction Flow**: 这是一个自动循环播放的Logo展示动效，无需用户交互触发，持续进行“O”字的内部形状扭曲与恢复。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` or `span` - Text Wrapper for "OPACITY")
  - 承载整个“OPACITY”文本，如果需要淡入淡出，可在此处应用整体的 `opacity` 和 `transform` 动画。
- **[Child Node A]** (`span` or `svg` - Letter 'O' Container)
  - 字母 'O' 的容器，内部包含实际的液体扭曲元素。
- **[Child Node B]** (`svg path` or `div` - Inner 'O' Liquid Element)
  - 字母 'O' 内部实现液体扭曲效果的形状元素，通常通过 SVG Path 或 CSS Shapes 与 `transform` 动画实现。其形状、大小、位置和旋转会持续变化。

## 3. Detailed Timeline Sequence (时序编排)

- **[Continuous Loop] Liquid Distortion Phase**:
  - **Inner 'O' Liquid Element**: 持续进行复杂的 `transform` 动画，包括 `scale` (从 `1.0` 到 `1.1` 再到 `0.9` 循环), `rotate` (轻微摇摆 `±5deg`), 和 `translate` (在 `x` `y` 轴上轻微位移 `±3px`)，结合可能隐藏的 `mask` 或 `filter` 效果，模拟液体的扩张、收缩和流动感。
  - **Animation Duration**: 每次完整的扭曲循环周期约为 `1500ms` 至 `2000ms`，并设置为无限循环 (`loop: Infinity`)。缓动曲线采用 `PRESET_SPRING_SMOOTH` 的特性或自定义的 `cubic-bezier` 以保持液体的自然弹性。
- **[Initial Load/Reveal] (Optional)**:
  - Parent Container (整个“OPACITY”文本) 可从 `opacity: 0`, `scale: 0.95`, `y: 15` 动画至 `opacity: 1`, `scale: 1`, `y: 0`，使用 `PRESET_SPRING_SMOOTH` 物理参数，持续 `350ms`。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not provided.
import React from "react";
import { motion } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Variants for the overall text appearance (optional, if text needs to fade in/out)
const textVariants = {
  initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: physicsConfig },
};

// Variants for the "O" character's inner liquid distortion
const liquidOVars = {
  animate: {
    scale: [1, 1.1, 0.9, 1], // Pulse effect
    rotate: [0, 5, -5, 0],   // Subtle rotation
    x: [0, 3, -3, 0],        // Subtle horizontal shift
    y: [0, -3, 3, 0],        // Subtle vertical shift
    transition: {
      duration: 1.8, // Duration for one full cycle of distortion
      ease: "easeInOut",
      repeat: Infinity, // Loop indefinitely
      repeatType: "mirror", // Play forwards and then backwards
    },
  },
};

export const OpacityLiquidTypeLogo = () => {
  return (
    <motion.div
      variants={textVariants}
      initial="initial"
      animate="animate"
      className="flex items-center justify-center font-bold text-6xl text-white tracking-widest"
      style={{
        textShadow: '0 4px 15px rgba(0,0,0,0.2)', // Soft shadow for 3D glossy feel
        background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.9) 100%)', // Glossy effect
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      <span className="relative">
        O
        <motion.span
          variants={liquidOVars}
          animate="animate"
          className="absolute inset-0 flex items-center justify-center"
          // This represents the inner liquid part of the 'O'
          // A more complex implementation would use SVG path morphing or filters.
          // Here, we simulate it with a scaled/rotated pseudo-element or inner div.
        >
          <motion.div
            className="w-8 h-8 rounded-full bg-white opacity-50"
            style={{ filter: "blur(8px)" }} // Simulating the liquid blur
            // This inner div will get the liquidOVars animation
            animate={liquidOVars.animate}
          />
        </motion.span>
      </span>
      PACITY
    </motion.div>
  );
};
```

## 🛑 AI Anti-Patterns & Blocklist (AI 避坑防偏与硬性禁忌)

> **⚠️ [SYSTEM RULE]** As a Senior Motion Developer, you must strictly AVOID the following anti-patterns. Violating any of these rules will result in layout shift and rendering stutter.

### 1. The "Sticky Animation" Trap (时长失控)
- ❌ **DON'T**: Do NOT write transitions or spring animations with a duration exceeding `400ms` unless specifically requested. It makes the UI feel laggy and sticky.
- **DO**: Default to snappy durations (`150ms - 300ms`). High-frequency micro-interactions (like buttons/taps) must be under `150ms`.

### 2. The "Layout Thrashing" Catastrophe (严禁非 GPU 加速属性)
- ❌ **DON'T**: NEVER use `transition: all`. Never animate layout-shifting properties: `width`, `height`, `top`, `left`, `margin`, `padding`, or `border-width`.
- **DO**: Only animate `transform` (scale, translate, rotate) and `opacity`. If you need to animate border changes, use `box-shadow: inset` or a pseudo-element (`::after`) with opacity scale.

### 3. Dark Mode Shadow Pollution (暗黑模式脏阴影)
- ❌ **DON'T**: Do NOT apply standard dark shadows (`rgba(0,0,0,0.5)`) on dark-themed components—they become invisible or look muddy. NEVER use bright white shadows.
- **DO**: In dark mode, replace floating shadows with a subtle semi-transparent border (e.g., `border: 1px solid rgba(255, 255, 255, 0.08)`) and a slight background highlight (elevation tint).

### 4. Instantly Vanishing Exit (销毁无动画)
- ❌ **DON'T**: Do NOT let elements disappear instantly from the DOM when they are closed or unmounted.
- **DO**: You must wrap conditional rendering with `<AnimatePresence>` (Framer Motion) or leverage CSS transition-end event listeners to ensure the `exit` state plays out fully before node destruction.