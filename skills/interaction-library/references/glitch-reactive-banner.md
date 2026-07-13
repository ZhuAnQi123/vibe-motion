---
version: beta-v2
name: glitch-reactive-banner
name_zh: "故障反应式横幅"
cover_video: "../assets/glitch-reactive-banner.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/glitch-reactive-banner.mp4"
tags: ["Elastic", "Hover", "Reveal"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  这是一个具有故障艺术风格的互动式横幅动效。当鼠标光标在横幅区域移动时，背景中的几何条纹或像素块会快速且弹性地（PRESET_SPRING_STIFF）产生视觉扭曲、颜色变化或形状重组效果，模拟出数据损坏或数字信号干扰的赛博朋克美学。单个元素的反应瞬时且具有回弹感，营造出一种即时响应的数字生命力。
  触发词：[故障艺术、像素扰动、几何扭曲、鼠标感应]
website: "https://x.com/yahyavision/status/2074553659736596921"

motion_tokens:
  selected_preset: "PRESET_SPRING_STIFF"
  transform_origin: "center center"
  stagger_delay: "20ms" # For individual cells reacting in a ripple
  active_physics:
    stiffness: 500
    damping: 40
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "200ms" # For individual cell transitions

  variants:
    initial: { opacity: 0, scale: 0.5, y: 0, filter: "blur(2px)" } # Inactive state for a grid cell
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } # Active state for a grid cell
    exit: { opacity: 0, scale: 0.5, y: 0, filter: "blur(2px)" } # Reverting to inactive
---

# 故障反应式横幅 / Glitch Reactive Banner Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Snappy-Mechanical
- **Core Experience**: 横幅背景中的几何元素（条纹或像素）对鼠标光标的接近和移动做出即时且具有弹性回弹的反应，呈现出故障艺术的视觉扭曲效果。整个交互感觉数字化、高对比度且充满活力。
- **Interaction Flow**: 鼠标进入横幅区域或在区域内移动时，附近的背景几何元素开始激活，改变其尺寸、透明度、颜色或位置，模拟数据损坏或信号干扰。鼠标移开或移至远处时，元素迅速恢复到其默认的非活动状态。

## 2. Component DOM Mapping (元素与动效节点映射)

- **Banner Container** (`div`)
  - 作为整个横幅的容器，负责检测鼠标事件（如 `onMouseMove`, `onMouseEnter`, `onMouseLeave`）。
- **Background Grid** (`div`)
  - 作为一个视觉层，包含大量**Grid Cells/Blocks**。
- **Grid Cell/Block** (`div`)
  - 构成背景网格的单个几何元素（条纹或像素）。
  - 每个 `Grid Cell` 都根据其与鼠标光标的距离和方向，独立地进行 `opacity`、`scale`、`x/y` 位置和 `background-color` 的变化。
  - 在顶部的黑白版本中，单元格可能改变其宽度和高度。在底部的彩色版本中，单元格可能改变其颜色。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 200ms] Activation/Deactivation Phase (Per Cell)**:
  - **Trigger**: 鼠标光标移动到单个 `Grid Cell` 的感应范围内。
  - **Reaction**: 该 `Grid Cell` 立即通过 `PRESET_SPRING_STIFF` 物理参数，从 `initial` 状态（非活动）快速过渡到 `animate` 状态（活动）。这包括：
    - `opacity` 从 `0` 变为 `1`。
    - `scale` 从 `0.5` 变为 `1`。
    - `filter: blur` 从 `2px` 变为 `0px`。
    - （*实际实现中可能还包含 `x/y` 偏移、`width/height` 变化或 `background-color` 切换等额外属性，以实现更丰富的故障效果*）。
  - **Revert**: 鼠标光标移出感应范围后，`Grid Cell` 迅速通过相同的物理参数，从 `animate` 状态过渡回 `exit` 状态（非活动），恢复其原始外观。
- **Ripple Effect**: 多个相邻的 `Grid Cells` 在鼠标移动时可能以 `20ms` 的 `stagger_delay` 产生连锁反应，形成视觉上的波纹效果。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2. **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3. **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4. **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not accessible.
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Insert custom physics from motion_tokens
const physicsConfig = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 1,
};

// Variants for a single reactive grid cell
const cellVariants = {
  initial: { opacity: 0, scale: 0.5, y: 0, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.5, y: 0, filter: "blur(2px)" },
};

export const GlitchReactiveBanner = () => {
  // In a full implementation, you would track mouse position
  // and dynamically determine the 'isActive' state for each cell
  // based on its proximity to the cursor.
  // This example demonstrates a single cell's state transition based on a toggle.
  const [isCellActive, setIsCellActive] = React.useState(false);

  return (
    <div
      className="relative w-full h-48 bg-black flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsCellActive(true)}
      onMouseLeave={() => setIsCellActive(false)}
    >
      {/* Main text content - positioned above the glitch background */}
      <h3 className="relative z-10 text-white text-3xl font-bold px-4 text-center">
        Helping Creators And Brands Turn Ideas Into Engaging Visuals.
      </h3>

      {/* Example of a single reactive grid cell.
          In a full banner, this would be mapped over a grid of many cells.
          Each cell's 'animate' prop would be conditionally set based on mouse proximity. */}
      <motion.div
        variants={cellVariants}
        initial="initial"
        animate={isCellActive ? "animate" : "exit"}
        transition={physicsConfig}
        style={{ transformOrigin: "center center" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-400 rounded-sm"
      />

      {/* Another example cell for visual diversity */}
      <motion.div
        variants={cellVariants}
        initial="initial"
        animate={isCellActive ? "animate" : "exit"}
        transition={{ ...physicsConfig, delay: 0.1 }}
        style={{ transformOrigin: "center center" }}
        className="absolute top-[30%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-sm"
      />
    </div>
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