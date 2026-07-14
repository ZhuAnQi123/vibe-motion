---
version: beta-v2
name: evilrabbit-kinetic-logo-reveal
name_zh: "邪恶兔子动感标志揭示"
cover_video: "../assets/evilrabbit-kinetic-logo-reveal.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/evilrabbit-kinetic-logo-reveal.mp4"
tags: ["Reveal"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  这是一个动感标志揭示动效，通过反射性金属条组建一个抽象标识。元素以精确、迅速的运动出现，并伴随着动态、横扫的光线反射效果，赋予其高科技组装的体感。
  触发词：[标志揭示、动感反射、金属质感、快速组装]
website: "https://x.com/evilrabbit_/status/2067180128786895326"

motion_tokens:
  selected_preset: "PRESET_SPRING_STIFF"
  transform_origin: "center center"
  stagger_delay: "50ms" # 子元素（左右E和斜杠）的交错出现延迟

  active_physics:
    stiffness: 500
    damping: 40
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" }
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# 邪恶兔子动感标志揭示 (Evilrabbit Kinetic Logo Reveal) Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Snappy-Mechanical
- **Core Experience**: "A sharp, kinetic logo reveal where metallic elements emerge with a precise, reflective shimmer, giving a sense of high-tech assembly. The overall impression is one of crispness and controlled motion."
- **Interaction Flow**: "On load, the individual metallic bar groups composing the 'E/\E' logo (Left E, Diagonal Slash, Right E) sequentially appear from left to right. Each group performs a subtle scale-up and fade-in animation, powered by a stiff spring physics, accompanied by a dynamic, sweeping light reflection across their surfaces, creating a 'reveal' effect."

## 2. Component DOM Mapping (元素与动效节点映射)

-   **[Parent Container]** (`div` - Logo Wrapper)
    -   Serves as the main container for the entire `E/\E` logo.
    -   Coordinates the staggered appearance of its child elements.
-   **[Child Node A]** (`div` - Left "E" Group)
    -   Represents the left 'E' part of the logo.
    -   Animates its `opacity`, `scale`, and `y` position using the defined spring physics.
-   **[Child Node B]** (`div` - Diagonal Slash)
    -   Represents the diagonal slash '/' part.
    -   Animates its `opacity`, `scale`, and `y` position, with a `stagger_delay` after the Left "E".
-   **[Child Node C]** (`div` - Right "E" Group)
    -   Represents the right 'E' part of the logo.
    -   Animates its `opacity`, `scale`, and `y` position, with a `stagger_delay` after the Diagonal Slash.

## 3. Detailed Timeline Sequence (时序编排)

-   **[0ms - 50ms] Container Initialization**:
    -   Parent Container starts with all children in `initial` state (e.g., `opacity: 0`, `scale: 0.95`, `y: 15`).
-   **[50ms - 400ms] Left "E" Reveal**:
    -   **Child Node A** (Left "E") begins animating to `animate` state (e.g., `opacity: 1`, `scale: 1`, `y: 0`) using `PRESET_SPRING_STIFF` physics.
    -   Concurrently, a simulated reflective light sweep (e.g., `background-position` animation) starts moving across the Left "E".
-   **[100ms - 450ms] Diagonal Slash Reveal**:
    -   **Child Node B** (Diagonal Slash) begins animating to `animate` state, with a `50ms` stagger delay after Child Node A's animation starts.
    -   The reflective light sweep continues to move across the Diagonal Slash.
-   **[150ms - 500ms] Right "E" Reveal**:
    -   **Child Node C** (Right "E") begins animating to `animate` state, with a `50ms` stagger delay after Child Node B's animation starts.
    -   The reflective light sweep concludes its traversal across the Right "E", completing the logo's illumination.
-   **[Exit Phase] Dismiss Sequence (if applicable)**:
    -   Upon a close or exit trigger, all child elements reverse to their `exit` state (e.g., `opacity: 0`, `scale: 0.95`, `y: -10`) within `350ms` using `PRESET_EASE_OUT_EXPO` for a clean, non-bouncy exit.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.
> 5.  **Reflective Shine**: Implement the reflective light sweep using CSS `background` properties (e.g., `linear-gradient` or `mask`) animated with `background-position` or `mask-position` for a smooth, performant visual effect. This animation should be separate from the elements' `transform` and `opacity` animations.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not accessible.
import React from "react";
import { motion } from "framer-motion";

// Insert custom physics from motion_tokens
const physicsConfig = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 1,
};

// Variants for the parent container to control stagger
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delayChildren: 0.05, // Initial delay before children start animating
      staggerChildren: 0.05, // Delay between each child's animation start
    },
  },
};

// Variants for individual child elements
const itemVariants = {
  initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: physicsConfig },
  exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)", transition: { ease: [0.16, 1, 0.3, 1], duration: 0.35 } }
};

// A simplified reflective shine animation (CSS-based)
const shineKeyframes = `
  @keyframes shine {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const reflectiveShineStyle = {
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
  backgroundSize: '200% 100%',
  animation: 'shine 2s infinite linear',
  WebkitBackgroundClip: 'text', // For text, but can be applied to elements with masks
  backgroundClip: 'text',
};

export const EvilrabbitLogoReveal = () => {
  return (
    <>
      <style>{shineKeyframes}</style>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        // For a full logo reveal, `whileHover` and `whileTap` are typically not needed
        className="flex justify-center items-center h-screen w-full bg-black text-white"
        style={{ fontFamily: 'monospace', fontSize: '10rem', letterSpacing: '-0.1em' }}
      >
        <motion.span variants={itemVariants} className="inline-block relative overflow-hidden" style={reflectiveShineStyle}>
          E
        </motion.span>
        <motion.span variants={itemVariants} className="inline-block relative overflow-hidden rotate-[25deg] mx-[-0.2em]" style={reflectiveShineStyle}>
          /
        </motion.span>
        <motion.span variants={itemVariants} className="inline-block relative overflow-hidden" style={reflectiveShineStyle}>
          E
        </motion.span>
      </motion.div>
    </>
  );
};
```