---
version: beta-v2
name: sanna-granqvist-gradient-shift
name_zh: "渐变形态切换动效"
cover_video: "../assets/sanna-granqvist-gradient-shift.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/sanna-granqvist-gradient-shift.mp4"
tags: ["Elastic", "Button", "Click"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  这是一个交互式渐变背景切换动效，用户通过点击底部按钮，可以观察背景渐变在曲线、平坦和斜坡三种不同形态之间进行平滑过渡。每个过渡都带有微妙的弹性阻尼感，创造出流体般的视觉体验，仿佛背景在随着交互“呼吸”和变形。
  触发词：[渐变切换、流体变形、弹性阻尼、按钮交互]
website: "https://x.com/SannaGranqvistX/status/2027695019188990205"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center" # This refers to general components. For gradient strips, specific origins apply.
  stagger_delay: "20ms" # Applied to individual gradient strips for subtle wave effect

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" } # Generic variants, not directly for gradient shape
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# 渐变形态切换动效 / Gradient Form Shift Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 背景渐变根据用户点击的按钮，在曲线、平坦和斜坡三种预设形态之间进行平滑且带有弹性阻尼感的切换。这种过渡营造出一种流体般的视觉效果，使得背景仿佛具有生命力，对用户的交互做出响应性变形。
- **Interaction Flow**: 用户点击屏幕底部区域的 "Curve", "Flat", 或 "Ramp" 按钮 -> 背景中的像素化渐变图层会立即开始平滑过渡到对应的形态。每次过渡均使用弹性缓动曲线，在目标状态处有轻微的“回弹”效果，增强了交互的物理感。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - `GradientCanvas`)
  - 充当整个渐变背景的容器，管理其子元素的布局和整体视觉呈现。
- **[Child Node A]** (`div` - `GradientStrip` array)
  - 由多个宽度相同、高度可变的垂直条组成，共同构成整个渐变背景的视觉形态。每个条（柱）的 `transform: scaleY` 或 `transform: translateY` 属性是主要的动画目标。
  - `transform-origin`: `bottom center`。这些条从底部向上或向下动画，形成不同的形状。
- **[Child Node B]** (`div` - `ButtonContainer`)
  - 包含三个可点击的交互按钮（Curve, Flat, Ramp），用于触发渐变形态的切换。
  - 按钮本身可能有简单的 `whileHover` 和 `whileTap` 动画。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 350ms] Trigger Phase (Button Click)**:
  - 当用户点击 "Curve", "Flat", 或 "Ramp" 按钮时，会触发一个状态更新，指示目标渐变形态。
  - **Gradient Strips (`Child Node A`)**:
    - 每个渐变条（`GradientStrip`）同时开始动画其 `scaleY`（或 `translateY`）属性，从当前形态值平滑过渡到目标形态值。
    - 动画使用 `PRESET_SPRING_SMOOTH` 物理参数 (`stiffness: 200, damping: 25, mass: 1`)，产生流体般的弹性效果。
    - 尽管整体视觉效果是统一的波浪或形态变化，但若将每个条视为独立元素，可引入 `stagger_delay: 20ms` 以增加细微的序列感，使过渡更具动态层次。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`). For the gradient strips, animate `transform: scaleY` (from `transform-origin: bottom`) instead of `height` to maintain performance.
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not available.
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Custom physics from motion_tokens
const springPhysics = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// --- Helper for gradient forms ---
const gradientForms = {
  curve: (index: number, total: number) => {
    const progress = index / (total - 1); // Normalized progress from 0 to 1
    // Creates a smooth curve, adjusted to range from ~100px to ~200px
    const value = Math.sin(progress * Math.PI) * 0.5 + 0.5; // Sine wave from 0.5 to 1.5
    return value * 200 + 50; // Max height around 250, min around 50
  },
  flat: () => 150, // Flat height of 150px
  ramp: (index: number, total: number) => {
    const progress = index / (total - 1);
    return progress * 200 + 50; // Linear ramp up from 50px to 250px
  },
};

const NUM_GRADIENT_STRIPS = 60; // Number of vertical bars for the gradient
const STRIP_WIDTH_PERCENT = 100 / NUM_GRADIENT_STRIPS; // Width of each bar as a percentage
const MAX_BAR_HEIGHT_PX = 300; // Define a consistent max height for scaleY calculation

export const InteractiveGradientBackground = () => {
  const [gradientType, setGradientType] = useState<keyof typeof gradientForms>("curve");

  const getStripsData = useMemo(() => {
    return Array.from({ length: NUM_GRADIENT_STRIPS }, (_, i) => {
      const targetHeight = gradientForms[gradientType](i, NUM_GRADIENT_STRIPS);
      return {
        id: i,
        scaleY: targetHeight / MAX_BAR_HEIGHT_PX, // Normalize target height to scale factor
        colorHue: 200 + i * 2, // Example color gradient from blue to teal
        colorLightness: 30 + i * 0.5,
      };
    });
  }, [gradientType]);

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-end overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
        <AnimatePresence>
          {getStripsData.map((strip, index) => (
            <motion.div
              key={strip.id}
              initial={{ scaleY: 0, opacity: 0 }} // Initial state for new elements entering
              animate={{
                scaleY: strip.scaleY,
                opacity: 1,
                transition: {
                  ...springPhysics,
                  delay: index * 0.02, // Stagger delay for individual strips
                },
              }}
              exit={{ scaleY: 0, opacity: 0 }} // Exit state for elements leaving
              style={{
                width: `${STRIP_WIDTH_PERCENT}%`,
                backgroundColor: `hsl(${strip.colorHue}, 80%, ${strip.colorLightness}%)`,
                transformOrigin: "bottom", // Crucial for scaling from the bottom
              }}
              className="absolute bottom-0 h-full flex-shrink-0" // Base height and position for scaleY calculation
              // Position each strip horizontally
              left={`${index * STRIP_WIDTH_PERCENT}%`}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="relative z-10 flex gap-4 p-8 mb-8">
        <motion.button
          className="px-6 py-3 rounded-full bg-white text-black font-semibold text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGradientType("curve")}
        >
          Curve
        </motion.button>
        <motion.button
          className="px-6 py-3 rounded-full bg-white text-black font-semibold text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGradientType("flat")}
        >
          Flat
        </motion.button>
        <motion.button
          className="px-6 py-3 rounded-full bg-white text-black font-semibold text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGradientType("ramp")}
        >
          Ramp
        </motion.button>
      </div>
    </div>
  );
};
```