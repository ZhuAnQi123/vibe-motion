---
version: beta-v2
name: composio-brand-system-motion
name_zh: "Composio 品牌系统动效"
cover_video: "../assets/composio-brand-system-motion.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/composio-brand-system-motion.mp4"
tags: ["Reveal", "Elastic"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  这是一个展示 Composio 品牌系统动效的视频，其中包含流体平滑的几何图形变换、文字渐显打字效果、以及带有弹性的元素揭示。所有动效都遵循一致的流畅动效语言，强调品牌的高级感和科技感。
  触发词：[流体平滑, 几何变换, 弹性揭示, 品牌动效]
website: "https://x.com/ayushsoni_io/status/2058799812808692104"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "40ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" }
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# Composio 品牌系统动效 / Composio Brand System Motion Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 视频展示了一套流畅且富有弹性的品牌动效语言。几何图形（如矩形、立方体、球体）通过平滑的变形、旋转、位移和颜色渐变进行揭示与过渡，营造出科技感和高级感。文字内容则通过打字机效果、渐显和模糊过渡的方式有序出现，整体节奏明快且具有引导性。动效体感介于平滑与轻微弹性之间，没有过度的回弹，保持了专业性。
- **Interaction Flow**: 视频呈现的是一个预设的品牌展示序列，而非用户交互。动效流程是元素按时间轴依次出现、变化和消失，常伴随子元素的交错显示和路径绘制。

## 2. Component DOM Mapping (元素与动效节点映射)

*_Vision-Agent: Map the visual elements in the video to a virtual DOM structure before defining motion._*

-   **[Main Scene Container]** (`div` - e.g., Full-screen brand intro wrapper)
    -   Controls overall scene transitions, background changes, and global opacity/scale.
-   **[Geometric Shape Elements]** (`div` or `svg` - e.g., Rectangles, cubes, spheres)
    -   Apply `transform` (scale, rotate, translate) with `PRESET_SPRING_SMOOTH` physics.
    -   Individual shapes often have internal `filter` (blur) or `background` (gradient) animations.
    -   May transition from outline to filled states, or one shape to another.
-   **[Text Block / Characters]** (`span` or `div` - e.g., "hey there", "Composio", "SKILLS THAT EVOLVE")
    -   Apply `opacity`, `y` (translateY), and `filter` (blur) transitions.
    -   Characters often appear with a `stagger_delay` to create a typing or sequential reveal effect.
-   **[Logo Elements]** (`svg` - e.g., Composio icon or full logo)
    -   Involve `stroke-dashoffset` for drawing effects and `fill` animations for color reveals.
    -   Often accompanied by subtle scale or rotation transitions.

## 3. Detailed Timeline Sequence (时序编排)

*_Vision-Agent: Define the exact motion sequence in milliseconds based on video analysis._*

-   **[0ms - 300ms] Initial Scene Entry**:
    -   `Main Scene Container` background fades in (`opacity: 0 -> 1`).
    -   `Geometric Shape Elements` (rectangles) from the initial perspective shot slide in (`translateZ`, `translateX`) and scale up (`scale: 0.8 -> 1`) with `PRESET_SPRING_SMOOTH`, staggered by `40ms`.
-   **[300ms - 800ms] Text Typing & Logo Reveal**:
    -   `Text Block` (e.g., "hey there") characters appear sequentially with `stagger_delay` (approx. `40ms`), animating `opacity: 0 -> 1` and `y: 15px -> 0px`.
    -   `Logo Elements` (Composio icon) draws its path (stroke animation) and then fills with color.
-   **[800ms - 2000ms] Complex Shape & Text Transition**:
    -   Current `Geometric Shape Elements` gracefully exit (e.g., `opacity: 1 -> 0`, `scale: 1 -> 0.95`).
    -   New `Geometric Shape Elements` (e.g., lines forming the 'C' logo, stacked rectangles, cubes) animate into view using a combination of `transform` properties (`scale`, `rotate`, `translate`) and `opacity` with `PRESET_SPRING_SMOOTH` physics, sometimes staggered.
    -   `Text Block` content fades in with a blur transition (`filter: blur(4px) -> blur(0px)`), possibly with a slight `translateY` offset.
-   **[2000ms - End] Final Shape Transformation**:
    -   A geometric shape (e.g., a cube) transforms into another (e.g., a sphere) via continuous `rotate`, `scale`, and internal gradient `background` animations, typically over `300-500ms`.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

// Defaulting to React + Tailwind CSS + Framer Motion as `package.json` was not provided.
// Complete production-ready implementation of Composio 品牌系统动效
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Insert custom physics from motion_tokens
const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Variants for parent container (to stagger children)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04, // Use stagger_delay from motion_tokens
      delayChildren: 0.1, // Initial delay before children start animating
    },
  },
};

// Variants for child elements (individual items being revealed)
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: physicsConfig, // Apply spring physics to individual items
  },
};

export const ComposioBrandIntro = () => {
  // This component demonstrates a sequential reveal pattern often seen in the brand video
  const elementsToReveal = [
    "SKILLS THAT EVOLVE",
    "LEARN IN REALTIME",
    "AUTOMATE WORKFLOWS",
    "AI AGENTS FOR ALL",
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 p-8 bg-gray-900 rounded-lg shadow-lg max-w-lg w-full text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500 mb-2"
          style={{ transformOrigin: "center center" }}
        >
          Composio
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl text-gray-300">
          Electric Brand System
        </motion.p>
        <div className="h-0.5 bg-gradient-to-r from-teal-400 to-purple-500 my-4 opacity-50" />
        <motion.div className="flex flex-col gap-3">
          {elementsToReveal.map((text, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-800 p-3 rounded-md flex items-center justify-center text-lg font-medium tracking-wide border border-transparent hover:border-teal-500 transition-colors"
            >
              {text}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

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