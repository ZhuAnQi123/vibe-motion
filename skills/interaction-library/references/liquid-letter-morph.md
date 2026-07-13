---
version: beta-v2
name: liquid-letter-morph
name_zh: "流体字母变形"
cover_video: "../assets/liquid-letter-morph.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/liquid-letter-morph.mp4"
tags: ["Elastic", "Hover", "Button"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  这是一个极简的黑白动效研究，展示了一个流体变形的小写字母，随着顶部导航按钮的选择而改变形状。动效的核心体感是字母在不同形态之间平滑且带有弹性感的过渡变形，同时被选中的按钮也会有明确的视觉反馈。
  触发词：[流体变形, 字母动画, 弹性过渡, 按钮选择]
website: "https://x.com/quantapar/status/2068122566859149516"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms" # 主字母动画无子元素交错延迟

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" } # 这些通用变体主要适用于元素的出现/消失，而非字母本身的形状变形
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# 流体字母变形 / Liquid Letter Morph Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 点击顶部导航按钮时，页面中央的字母会以一种平滑、富有弹性的流体效果变形为目标字母的形状。字母的边缘仿佛具有液体般的粘滞感，在变形过程中呈现出圆润、柔软的视觉特性，伴随轻微的回弹效果。同时，被选中的导航按钮会立即高亮显示。
- **Interaction Flow**:
  1.  用户点击顶部导航栏中的任意字母按钮（'a', 'b', 'c', 'd'）。
  2.  被点击的按钮背景色在极短时间内变为白色，文字颜色变为黑色，以示选中状态。
  3.  页面中央的大写字母几乎同时开始从当前形状向目标字母形状进行液态变形，整个过程平滑且富有弹性，没有生硬的跳变。
  4.  字母变形完成后保持静止，直到新的按钮被点击。

## 2. Component DOM Mapping (元素与动效节点映射)

-   **[Parent Container]** (`div` - Page Wrapper)
    -   作为整个页面的背景容器。
-   **[Navigation Bar]** (`div` - Top Navigation)
    -   包含一系列可点击的字母按钮。
-   **[Navigation Button]** (`div` - Individual Button `a`, `b`, `c`, `d`)
    -   改变背景色和文字颜色（从透明背景+白字到白背景+黑字）。
    -   `transform_origin: center center` for any potential micro-scale on hover/tap (视频中不明显，但可用于增强交互反馈)。
-   **[Morphing Letter Display]** (`svg` 或 `path` 元素 - Central Letter)
    -   这是动效的核心元素，一个大的SVG `path` 元素。
    -   其 `d` (path data) 属性在不同字母形态之间进行插值动画，实现流体变形效果。
    -   应用 `transform_origin: center center`，确保变形以字母中心为基准。

## 3. Detailed Timeline Sequence (时序编排)

-   **[0ms - 50ms] Trigger & Button Highlight**:
    -   用户点击导航按钮后，按钮的背景色和文字颜色立即进行 `50ms` 的 `ease-out` 渐变，切换到选中状态。
-   **[0ms - 350ms] Main Letter Morph**:
    -   几乎与按钮点击同时，中央的字母SVG `path` 元素开始从当前字母的路径数据平滑地变形到目标字母的路径数据。
    -   这个变形过程遵循 `PRESET_SPRING_SMOOTH` 定义的弹性物理曲线 (`stiffness: 200, damping: 25, mass: 1`)，使得变形富有弹性、流畅自然，并带有轻微的“粘滞感”和回弹。
    -   变形动画持续约 `350ms`。
-   **[Exit Phase]**: 无明确的退出动画，字母持续存在并进行变形。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.
>
> **Specific Directive for this interaction**:
> -   The core morphing effect should be achieved by animating the `d` attribute of an SVG `path` element. Framer Motion (and similar libraries) can directly interpolate SVG path data. Ensure the path data for all letters ('a', 'b', 'c', 'd') are accurately defined and available.

## 5. Generated Code Skeleton (示例代码)

// Defaulting to React + Tailwind CSS + Framer Motion as `package.json` is not provided.
import React, { useState } from "react";
import { motion } from "framer-motion";

// Physics configuration for the elastic morphing
const morphPhysics = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Example SVG Path Data for demonstration purposes (simplified, not exact from video)
// In a real implementation, these would be precise, optimized paths for smooth morphing.
const letterPaths = {
  a: "M 200 150 A 50 50 0 1 1 200 250 A 50 50 0 1 0 200 150 M 200 200 L 250 200", // Simplified 'a'
  b: "M 180 150 L 180 250 A 50 50 0 1 0 180 150 M 180 200 A 30 30 0 1 0 180 250", // Simplified 'b'
  c: "M 250 150 A 70 70 0 1 0 150 150 L 150 170 A 50 50 0 0 1 230 170 L 250 150", // Simplified 'c'
  d: "M 220 150 L 220 250 A 50 50 0 1 1 220 150", // Simplified 'd'
};

const navLetters = ["a", "b", "c", "d"];

export const LiquidLetterMorphInteraction = () => {
  const [selectedLetter, setSelectedLetter] = useState("a");

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      {/* Navigation Buttons */}
      <div className="flex space-x-4 mb-16">
        {navLetters.map((letter) => (
          <motion.button
            key={letter}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer ${
              selectedLetter === letter
                ? "bg-white text-black"
                : "bg-transparent text-white border border-gray-700"
            }`}
            onClick={() => handleLetterSelect(letter)}
            initial={false} // Prevents initial animation on mount if component re-renders
            animate={{
              backgroundColor: selectedLetter === letter ? "#FFFFFF" : "transparent",
              color: selectedLetter === letter ? "#000000" : "#FFFFFF",
              borderColor: selectedLetter === letter ? "transparent" : "#4A5568", // Gray-700
            }}
            transition={{ duration: 0.1, ease: "easeOut" }} // Quick transition for button highlight
          >
            {letter}
          </motion.button>
        ))}
      </div>

      {/* Morphing Letter Display */}
      <motion.svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        className="w-80 h-80 sm:w-96 sm:h-96"
      >
        <motion.path
          d={letterPaths[selectedLetter]}
          fill="white"
          initial={false} // Prevents initial 'd' attribute animation on mount from a default value
          animate={{ d: letterPaths[selectedLetter] }}
          transition={morphPhysics}
          style={{ transformOrigin: "center center" }}
        />
      </motion.svg>
    </div>
  );
};
```