---
version: beta-v2
name: iridescent-bar-chart-morph
name_zh: "虹彩柱状图变形"
cover_video: "../assets/iridescent-bar-chart-morph.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/iridescent-bar-chart-morph.mp4"
tags: ["Elastic"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  这是一个流动的3D动效研究，展示了虹彩柱状图在拱形和M形结构之间平滑变形。单个柱体的运动是顺序交错的，产生波浪状的过渡效果，并伴随着棱镜般的蓝色和紫色光效。
  触发词：[流体变形、虹彩光效、序列波浪、动态曲线]
website: "https://x.com/benfryc/status/2075275106301903067"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center bottom" # 假设柱体从底部中心变形
  stagger_delay: "40ms" # 多子元素交错延迟时间

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "500ms" # 单个柱体完成一次显著变换的感知时长

  variants:
    initial: { opacity: 0.8, y: 20, scaleY: 0.2 } # 假设柱体起始状态为略透明、略低、高度短
    animate: { opacity: 1, y: 0, scaleY: 1 } # 柱体变为不透明、基线、完整高度
    exit: { opacity: 0, y: -20, scaleY: 0.2 } # 柱体淡出、向上移动、高度缩短（仅为模板补充，视频为循环动效无显式exit）
---

# 虹彩柱状图变形 / Iridescent Bar Chart Morph Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: This animation presents a continuous, fluid transformation of iridescent bar-chart columns. The columns gracefully morph between distinct arc and M-shaped configurations. The movement is characterized by a smooth, almost elastic physics, where individual bars respond sequentially, creating a captivating wave-like flow. The holographic blue and purple lighting further enhances the dynamic and ethereal feel.
- **Interaction Flow**: This is a non-interactive, looping motion study. The flow is a continuous, seamless transition between two primary geometric shapes (arc and M-shape), with individual bar elements contributing to the overall form through synchronized yet staggered vertical shifts and height changes.

## 2. Component DOM Mapping (元素与动效节点映射)

The animation primarily consists of multiple individual "bar" elements (`div` or `mesh` in a 3D context) that are dynamically grouped to form a larger composite shape.

- **[Parent Container]** (`div` - Visualizer Wrapper)
  - Acts as the overall stage for the bar-chart formation. No direct animation properties are applied here, but it dictates the coordinate system for its children.
- **[Child Node: Individual Bar Column]** (e.g., `div` - Bar Element)
  - Each bar is an independent element. Its primary animated properties are `transform` (specifically `translateY` to adjust vertical position and `scaleY` to adjust height), and potentially `opacity` for subtle entry/exit effects if it were not a continuous loop.
  - Each bar's animation is staggered relative to its neighbors, creating the wave-like motion across the formation.
  - Iridescent material/shader applied to render the prismatic lighting effect.

## 3. Detailed Timeline Sequence (时序编排)

The animation is a seamless loop, so the "timeline" describes the continuous morphing rather than discrete start/end states.

- **[Continuous Loop Cycle: Arc to M-shape]**:
  - **Individual Bar Motion**: Each bar element undergoes a dynamic change in its `translateY` and `scaleY` properties.
  - **Staggered Activation**: The changes are applied with a `stagger_delay` of `40ms` across the series of bars. This creates a ripple or wave effect, where one side of the formation begins to change, followed sequentially by adjacent bars.
  - **Arc Formation**: Bars dynamically adjust their `translateY` and `scaleY` to follow an arc path, with central bars being taller/higher and outer bars shorter/lower.
  - **M-shape Formation**: Following the arc, the bars transition to an M-shape, where specific bars adjust to create two peaks and a central dip.
  - **Physics Application**: All transitions for `translateY` and `scaleY` utilize the `PRESET_SPRING_SMOOTH` physics (`stiffness: 200`, `damping: 25`, `mass: 1`), ensuring a fluid and natural deformation.
  - **Lighting & Material**: The iridescent material dynamically refracts the light as the bars move, creating shifting blue and purple hues, enhancing the sense of depth and motion.
- **[Continuous Loop Cycle: M-shape back to Arc]**:
  - The process reverses, with bars transitioning from the M-shape back to the arc, maintaining the staggered, fluid motion.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.
> 5.  **3D Context**: Note that the full iridescent material and complex 3D shape morphing may require a dedicated 3D rendering library (e.g., Three.js, R3F) or custom shaders, which goes beyond a simple CSS/Framer Motion component for this level of visual fidelity. The provided code skeleton focuses on the *motion* aspect of individual bars within a conceptual framework.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Complete production-ready implementation of Iridescent Bar Chart Morph
// This example defaults to React + Tailwind CSS + Framer Motion.
// Note: This skeleton demonstrates the motion principles (stagger, spring) for individual bars.
// Achieving the full 3D iridescent effect and complex shape morphing shown in the video
// would typically require a dedicated 3D rendering library (e.g., Three.js/React Three Fiber)
// with custom shaders for the material.

import React from "react";
import { motion } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

const barVariants = {
  initial: {
    y: 20,
    scaleY: 0.2,
    opacity: 0.8,
  },
  arc: (i: number) => ({
    y: -Math.sin(i * 0.2) * 30, // Example arc calculation based on index
    scaleY: 0.5 + Math.cos(i * 0.2) * 0.5, // Height variation for arc
    opacity: 1,
    transition: {
      ...physicsConfig,
      delay: i * 0.04, // Stagger delay
      repeat: Infinity,
      repeatType: "mirror",
      duration: 3, // Full morph cycle duration
    },
  }),
  mShape: (i: number) => ({
    y: -Math.abs(Math.cos(i * 0.2)) * 40, // Example M-shape calculation
    scaleY: 0.3 + Math.abs(Math.sin(i * 0.2)) * 0.7, // Height variation for M-shape
    opacity: 1,
    transition: {
      ...physicsConfig,
      delay: i * 0.04, // Stagger delay
      repeat: Infinity,
      repeatType: "mirror",
      duration: 3, // Full morph cycle duration
    },
  }),
};

interface BarProps {
  index: number;
  totalBars: number;
}

const Bar: React.FC<BarProps> = ({ index, totalBars }) => {
  // A simplified alternating state for demonstration purposes
  const animationState = index % 2 === 0 ? "arc" : "mShape";

  return (
    <motion.div
      className="relative w-4 h-full bg-gradient-to-b from-blue-300 to-purple-500 rounded-sm shadow-lg overflow-hidden"
      style={{ transformOrigin: "bottom center" }}
      variants={barVariants}
      initial="initial"
      animate={animationState}
      custom={index}
    >
      {/* Simulate iridescent effect with pseudo-elements or background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-pink-300 to-purple-600 mix-blend-screen opacity-75"></div>
    </motion.div>
  );
};

export const IridescentBarChartMorph = () => {
  const numberOfBars = 20; // Adjust as needed
  const bars = Array.from({ length: numberOfBars }, (_, i) => (
    <Bar key={i} index={i} totalBars={numberOfBars} />
  ));

  return (
    <div className="flex items-end justify-center h-48 w-full gap-1 p-4 bg-black">
      {bars}
    </div>
  );
};
```

## 🛑 AI Anti-Patterns & Blocklist (AI 避坑防偏与硬性禁忌)

> **⚠️ [SYSTEM RULE]** As a Senior Motion Developer, you must strictly AVOID the following anti-patterns. Violating any of these rules will result in layout shift and rendering stutter.

### 1. The "Sticky Animation" Trap (时长失控)
- ❌ **DON'T**: Do NOT write transitions or spring animations with a duration exceeding `400ms` unless specifically requested. It makes the UI feel laggy and sticky.
- **DO**: Default to snappy durations (`150ms - 300ms`). High-frequency micro-interactions (like buttons/taps) must be under `150ms`. For continuous looping animations, the overall cycle can be longer, but individual element transformations should still adhere to fluid principles.

### 2. The "Layout Thrashing" Catastrophe (严禁非 GPU 加速属性)
- ❌ **DON'T**: NEVER use `transition: all`. Never animate layout-shifting properties: `width`, `height`, `top`, `left`, `margin`, `padding`, or `border-width`.
- **DO**: Only animate `transform` (scale, translate, rotate) and `opacity`. If you need to animate border changes, use `box-shadow: inset` or a pseudo-element (`::after`) with opacity scale.

### 3. Dark Mode Shadow Pollution (暗黑模式脏阴影)
- ❌ **DON'T**: Do NOT apply standard dark shadows (`rgba(0,0,0,0.5)`) on dark-themed components—they become invisible or look muddy. NEVER use bright white shadows.
- **DO**: In dark mode, replace floating shadows with a subtle semi-transparent border (e.g., `border: 1px solid rgba(255, 255, 255, 0.08)`) and a slight background highlight (elevation tint).

### 4. Instantly Vanishing Exit (销毁无动画)
- ❌ **DON'T**: Do NOT let elements disappear instantly from the DOM when they are closed or unmounted.
- **DO**: You must wrap conditional rendering with `<AnimatePresence>` (Framer Motion) or leverage CSS transition-end event listeners to ensure the `exit` state plays out fully before node destruction.