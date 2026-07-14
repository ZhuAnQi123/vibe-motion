---
version: beta-v2
name: metal-shader-usage-counter
name_zh: "金属着色器使用计数器"
cover_video: "../assets/metal-shader-usage-counter.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/metal-shader-usage-counter.mp4"
tags: ["Microinteraction", "Typographic", "Experimental"]
preview: { backgroundColor: "#000000", textColor: "#a1e3b5" }
description: >
  这是一个带有液体填充效果的数字计数器动效。当数字变化时，旧数字（特指个位）的填充会迅速清空，新数字的个位则以流动的液体形式从顶部填充，并带有明显的弹性回弹和微小的颗粒感。整体动效呈现出科幻、精致且极具触感的微交互体验。
  触发词：[液体填充, 数字计数器, 微交互, 科幻, 弹性填充]
website: "https://cdn.recent.design/items/hvnrid0/0/720x720.mp4"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "40ms" # Individual digits don't stagger, but phases of animation do.

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms" # Primary transition duration, liquid fill might be longer.

  variants:
    initial: { opacity: 0, scale: 0.95, y: 10, filter: "blur(4px)" }
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# 液体数字计数器 / Metal Shader Usage Counter Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: The counter displays two large, textured digits. When the usage limit decrements (e.g., from 77 to 76), the animation focuses on the changing digit. The old digit's liquid fill quickly empties, and the new digit appears, briefly scaling down then springing back to size with a subtle elastic pop. Critically, the new digit then fills with a vibrant green, granular liquid effect that flows from top to bottom, exhibiting a satisfying elastic overshoot and bounce upon completion. The non-changing digit retains its static, textured appearance.
- **Interaction Flow**: A change in the displayed numeric value (e.g., triggered by an internal system event) initiates the animation. The display transitions from the old two-digit number to the new, with the most prominent effect being the sequential emptying and filling of the changing digit.

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - Usage Counter Wrapper)
  - Acts as a flex container for the two individual digit components.
  - Applies global stylistic properties like font and background.
- **[Digit Component]** (e.g., `span` - Individual Digit)
  - Each digit (tens and units place) is treated as an independent component for animation.
  - When a digit's value changes, it triggers an `AnimatePresence`-controlled re-render to apply the `initial`, `animate`, `exit` variants.
  - For the units digit, an overlay element (`div`) is used to simulate the liquid filling effect via `clipPath` or an advanced shader.
  - The digit's base appearance includes a dark outline and a transparent interior (for the liquid fill) or a static textured fill (for non-changing digits).

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 50ms] Digit Value Update & Reset**:
  - The changing digit's (e.g., units place) value updates (e.g., from '7' to '6').
  - The visual representation of the *old* changing digit rapidly clears any existing liquid fill and initiates a quick `exit` animation (`scale` to 0.9, `opacity` to 0).
  - Simultaneously, the *new* changing digit's base form quickly scales in from `0.9` to `1.0` (using `PRESET_SPRING_SMOOTH`) with an `initial` to `animate` transition.
- **[50ms - 400ms] Liquid Fill Animation**:
  - After a short delay, the new changing digit (e.g., '6') begins its unique liquid filling animation.
  - The liquid smoothly flows from the top of the digit shape downwards, utilizing a `clipPath` or similar masking technique.
  - The fill exhibits a noticeable elastic overshoot and bounce at the end, before settling into its final state, emphasizing the "fluid" physics.
  - The texture/appearance of the non-changing digit (e.g., '7') remains consistent throughout, displaying its own static, granular texture.
  - The entire counter (Parent Container) might subtly scale up (`1.01`) and back to (`1.0`) during this phase, synchronized with the spring effect of the liquid filling, providing a holistic feedback.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as per system rule.
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Insert custom physics from motion_tokens
const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Represents a single digit with dynamic styling and an optional liquid filling effect.
// Note: The "Metal Shader" granular and reflective liquid effect is highly complex
// and would typically require WebGL/GLSL shaders or advanced SVG filters.
// This implementation uses CSS clip-path to visually represent the *motion* of the fill.
const AnimatedDigit = ({ value, isFillingDigit }) => {
  // Variants for the digit's overall appearance/disappearance
  const digitVariants = {
    initial: { scale: 0.95, opacity: 0, y: 10, filter: "blur(4px)" },
    animate: { scale: 1, opacity: 1, y: 0, filter: "blur(0px)", transition: { ...physicsConfig, delay: isFillingDigit ? 0.05 : 0 } },
    exit: { scale: 0.95, opacity: 0, y: -10, filter: "blur(2px)", transition: { duration: 0.1 } } // Quick exit for old digit
  };

  // Variants for the liquid fill effect (applied via clipPath)
  const fillVariants = {
    empty: { clipPath: "inset(100% 0 0 0)" }, // Fully clipped (empty state)
    filled: { clipPath: "inset(0% 0 0 0)", transition: { ...physicsConfig, delay: 0.15, duration: 0.5 } }, // Fills from top to bottom
  };

  const baseDigitStyle = {
    WebkitTextStroke: "2px #4b5d51", // Dark outline for the digit
    color: isFillingDigit ? "transparent" : "#a1e3b5", // Transparent for the digit that gets filled, solid for static ones
  };

  return (
    <AnimatePresence mode="wait" initial={false}> {/* `mode="wait"` ensures exit animation completes before new enters */}
      <motion.span
        key={value} // Unique key to trigger re-animation on value change
        variants={digitVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative text-[200px] font-bold inline-block overflow-hidden" // `overflow-hidden` is crucial for clipPath
        style={baseDigitStyle}
      >
        {value}
        {/* Conditional rendering for the liquid fill overlay */}
        {isFillingDigit && (
          <motion.div
            variants={fillVariants}
            initial="empty"
            animate="filled"
            className="absolute inset-0 z-10"
            style={{
              backgroundImage: "linear-gradient(to bottom, #a1e3b5, #6dbb83)", // Green liquid gradient
              WebkitBackgroundClip: "text", // Clip background to text shape
              WebkitTextFillColor: "transparent", // Make the text transparent to show the clipped background
              fontSize: "inherit",
              fontWeight: "inherit",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {value} {/* Text content for the fill layer */}
          </motion.div>
        )}
      </motion.span>
    </AnimatePresence>
  );
};


export const UsageCounter = () => {
  const [counter, setCounter] = useState(77);

  useEffect(() => {
    // Simulate counter decrementing from 77 down to 74, then resetting to 77.
    const interval = setInterval(() => {
      setCounter((prev) => (prev > 74 ? prev - 1 : 77));
    }, 2500); // Updates every 2.5 seconds to showcase the animation
    return () => clearInterval(interval);
  }, []);

  // Extract individual digits
  const firstDigit = Math.floor(counter / 10);
  const secondDigit = counter % 10;

  return (
    <div className="flex justify-center items-center h-screen bg-black" style={{ fontFamily: 'monospace' }}>
      <AnimatedDigit value={firstDigit} isFillingDigit={false} />
      <AnimatedDigit value={secondDigit} isFillingDigit={true} />
      <p className="absolute bottom-10 text-gray-400 text-lg">Codex - Resets July 18</p>
    </div>
  );
};
```