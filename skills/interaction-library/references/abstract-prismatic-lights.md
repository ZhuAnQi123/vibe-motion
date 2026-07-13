---
version: beta-v2
name: abstract-prismatic-lights
name_zh: "抽象棱镜光束"
cover_video: "../assets/abstract-prismatic-lights.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/abstract-prismatic-lights.mp4"
tags: ["Elastic", "Reveal"]
preview: { backgroundColor: "#000022", textColor: "#FFFFFF" }
description: >
  一个充满活力的抽象动态视觉，以发光的棱镜光束和玻璃状的蓝紫色形态为特色，它们在屏幕上以流畅、充满能量的运动进行变形和掠过。动画中使用了色散和镜头光斑效果，营造出速度感和光线折射的体验。
  触发词：[抽象光效、棱镜折射、能量流动、色散效果]
website: "https://x.com/benfryc/status/2066868488933662738"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "40ms" # For potential sequential abstract elements

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

# 抽象棱镜光束 / Abstract Prismatic Lights Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 这是一个非交互式的抽象动态序列，专为开场动画、背景视觉或转场设计，专注于视觉能量和光线动态。动画以发光的棱镜光束和玻璃状元素为核心，它们以动态、流畅的运动出现、掠过和折射，营造出数字光线和玻璃的快速而充满活力的感觉。
- **Interaction Flow**: This is a non-interactive abstract motion sequence, designed for intro sequences, background visuals, or transitions, focusing on visual energy and light dynamics. Elements morph and streak with a continuous, fluid animation loop.

## 2. Component DOM Mapping (元素与动效节点映射)

_Vision-Agent: This animation is abstract and does not map directly to traditional UI components. Instead, we describe its visual elements as conceptual layers or objects within a dynamic visual space._

-   **[Main Light Streaks/Forms]** (e.g., `div` with linear gradients and `filter: blur`)
    -   Represents the primary glowing elements that dynamically emerge, sweep, and morph across the screen. These forms animate with changes in `transform` (scale, translate, rotate), `opacity`, and `filter` (blur, hue-rotate for chromatic aberration).
-   **[Prismatic Refractions]** (e.g., `div` elements representing glass-like blocks)
    -   These elements appear as transparent, refractive blocks or surfaces, often with sharp edges, reflecting and refracting light. They animate with complex `transform` (rotation, scale, skew) and `opacity` transitions, simulating glass properties.
-   **[Background Glows/Flares]** (e.g., `div` with radial gradients, `box-shadow` or `filter: drop-shadow`)
    -   Subtle, diffuse light sources or intense lens flares that provide depth, enhance the luminosity, and simulate camera effects. These elements primarily animate `opacity` and subtle `transform` for breathing effects.

## 3. Detailed Timeline Sequence (时序编排)

_Vision-Agent: Since this is a continuous abstract animation, the timeline describes typical transition phases observed in the video, rather than a single event._

-   **[0ms - 500ms] Initial Light Streak & Reveal**:
    -   A dominant light streak (e.g., at 0:00-0:01) quickly emerges, expanding and sweeping across the view. Its `opacity` and `scale` ramp up using `PRESET_SPRING_SMOOTH`.
    -   Associated `filter` properties (e.g., `blur`, `hue-rotate` for chromatic aberration) animate to create a fast, energetic appearance.
-   **[500ms - 1500ms] Prismatic Form Transitions**:
    -   Glass-like blocks or shapes appear (e.g., at 0:01-0:03), often with an initial `scale` from zero or a quick `translate` into view, then rotate and dissolve. These transitions utilize `PRESET_SPRING_SMOOTH` for fluid yet energetic motion.
    -   Complex refractive effects and light trails accompany their movement, achieved through dynamic `filter` changes and overlapping light elements.
-   **[1500ms - 3000ms+] Dynamic Light Resurgence & Morphing**:
    -   The animation cycles through phases where light forms morph, split, or merge, maintaining high energy and fluid transitions. Each new form or streak adheres to the `PRESET_SPRING_SMOOTH` physics.
    -   The entire sequence can loop or transition to a final bright streak or fade to black, depending on context.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

_Vision-Agent: This abstract animation is best achieved with a custom renderer (e.g., WebGL, Canvas) or a highly customized `motion.div` setup. The following is a simplified React + Framer Motion example for a single "prismatic light streak" element, demonstrating the core physics and visual style._

```tsx
// This implementation assumes React + Tailwind CSS + Framer Motion as the default stack.
import React from "react";
import { motion } from "framer-motion";

// Insert custom physics from motion_tokens
const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

export const AbstractPrismaticLight = () => {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#000011] to-[#000033] overflow-hidden flex items-center justify-center">
      {/* Example of a Prismatic Light Streak */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0, rotate: 45, filter: "blur(20px) hue-rotate(0deg)" }}
        animate={{
          opacity: 1,
          scaleX: [0, 1.2, 0.8, 1], // Simulating a quick stretch and settle
          rotate: [45, 50, 48, 45], // Subtle rotation
          filter: ["blur(20px) hue-rotate(0deg)", "blur(0px) hue-rotate(30deg)"], // Blur and color shift
          transition: {
            ...physicsConfig,
            duration: 1.5, // Longer duration for this complex animation
            ease: "easeOut",
            repeat: Infinity, // For a continuous abstract loop
            repeatType: "mirror",
          },
        }}
        style={{ transformOrigin: "left center" }}
        className="absolute w-[80%] h-8 bg-gradient-to-r from-purple-500 via-blue-400 to-cyan-300 rounded-full"
      />

      {/* Example of a "Prismatic Block" element */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotateY: 0, rotateX: 0 }}
        animate={{
          opacity: [0, 1, 1, 0], // Appear, stay, then disappear
          scale: [0, 1, 1.1, 0.5], // Pop in and slightly expand before shrinking
          rotateY: [0, 90, 180, 270], // Rotate on Y-axis
          rotateX: [0, 45, 90, 135], // Rotate on X-axis
          transition: {
            ...physicsConfig,
            delay: 0.8, // Appears after the light streak starts
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          },
        }}
        className="absolute w-24 h-24 bg-white/20 backdrop-filter backdrop-blur-sm shadow-lg border border-white/30"
        style={{ perspective: 1000 }} // For 3D rotation
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