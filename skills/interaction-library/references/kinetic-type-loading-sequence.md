---
version: beta-v2
name: kinetic-type-loading-sequence
name_zh: "动态文字加载序列"
cover_video: "../assets/kinetic-type-loading-sequence.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/kinetic-type-loading-sequence.mp4"
tags: ["Reveal", "Elastic"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  这是一个简约的动态文字加载序列，抽象的字符形态在进度条上方组装、变换，最终形成清晰的单词“CONSYG”，并带有快速而精准的捕捉感。随后单词和进度条消失，完成加载循环。
  触发词：[动态文字加载, 抽象字符重组, 进度条动画, 极简加载]
website: "https://x.com/figma/status/2067457292010746176"

motion_tokens:
  selected_preset: "PRESET_SPRING_STIFF"
  transform_origin: "center center"
  stagger_delay: "50ms" # 适用于 CONSYG 单词中每个字母的交错出现

  active_physics:
    stiffness: 500
    damping: 40
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "300ms" # 单个字符或元素变换的持续时间

  variants:
    initial: { opacity: 0, scale: 0.9, y: 10, filter: "blur(4px)" }
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.9, y: -10, filter: "blur(2px)" }
---

# 动态文字加载序列 / Kinetic Type Loading Sequence Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Snappy-Mechanical / Linear-Smooth
- **Core Experience**: 抽象字符以快速、近乎故障的动态效果组装和变换，最终精确地捕捉并呈现出清晰的单词“CONSYG”，并伴随着一个平稳填充的进度条。整个序列具有简洁而有力的数字感。
- **Interaction Flow**: 自动加载序列。从抽象形态的快速出现，到清晰单词的逐步显现，同时进度条从左向右填充，最后所有元素快速消失并重置。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Main Container]** (`div` - Loading Wrapper)
  - 承载整个加载动画，包括文本和进度条。
- **[Kinetic Text Container]** (`div` - Text Animation Area)
  - 负责显示抽象字符的动态组装和最终单词“CONSYG”的展示。
  - **[Letter Element]** (`span` for each character of "CONSYG")
    - 当“CONSYG”单词最终清晰显现时，每个字母会应用交错延迟和物理动画。
- **[Progress Bar Container]** (`div` - Progress Bar Wrapper)
  - 承载进度条的背景。
  - **[Progress Fill Bar]** (`div` - Progress Fill Element)
    - 负责从左到右填充的动画效果。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - ~1500ms] Abstract Build-up Phase**:
  - 抽象的字符碎片以快速、无序的运动出现和消失。这些碎片可能由多个小元素组成，每个小元素都带有短暂且锐利的出现/消失动画 (`stiffness: 500, damping: 40`)。
  - 进度条的基线或背景在此阶段显现。
- **[~1500ms - ~3500ms] Word Resolution & Progress Fill Phase**:
  - 抽象字符开始解析，最终在 ~2000ms 左右，单词“CONSYG”的每个字母（`Letter Element`）以 `stagger_delay` 50ms 和 `PRESET_SPRING_STIFF`（`opacity: 0 -> 1, y: 10 -> 0, scale: 0.9 -> 1`）迅速弹出并稳定在位。
  - `Progress Fill Bar` 同时开始从 `width: 0%` 动画到 `100%`，使用 `cubic-bezier(0.4, 0, 0.2, 1)` 或 `ease-in-out` 缓动函数，持续约 2000ms。
- **[~3500ms - ~4000ms] Hold & Exit Phase**:
  - 单词“CONSYG”和充满的进度条短暂保持。
  - 随后，单词的每个字母 (`Letter Element`) 以 `exit` 变体 (`opacity: 1 -> 0, y: 0 -> -10, scale: 1 -> 0.9`) 快速淡出并向上移动。
  - `Progress Fill Bar` 和 `Progress Bar Container` 也会在此阶段迅速消失或重置。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not accessible.
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 1,
};

const wordVariants = {
  animate: {
    transition: {
      staggerChildren: 0.05, // Stagger delay for individual letters
    },
  },
};

const letterVariants = {
  initial: { opacity: 0, y: 10, scale: 0.9, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: physicsConfig },
  exit: { opacity: 0, y: -10, scale: 0.9, filter: "blur(2px)", transition: { duration: 0.2, ease: "easeOut" } },
};

export const KineticTypeLoadingSequence = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate complex loading and word display
    const loadingSequence = async () => {
      // Phase 1: Abstract build-up (represented by a delay here, actual animation would be more complex)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Phase 2: Word resolution & progress fill
      setIsLoading(true); // Show CONSYG
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
        }
      }, 20); // Simulate progress fill over ~2 seconds (20ms * 100)

      await new Promise(resolve => setTimeout(resolve, 2000)); // Time for CONSYG to appear and progress to fill

      // Phase 3: Hold & Exit
      await new Promise(resolve => setTimeout(resolve, 500)); // Hold
      setIsLoading(false); // Hide CONSYG
      setProgress(0); // Reset progress visually
      await new Promise(resolve => setTimeout(resolve, 500)); // Allow exit animation to complete
      
      // Loop or final state
      setTimeout(() => setIsLoading(true), 500); // For looping demo
    };

    loadingSequence();
    const loopId = setInterval(loadingSequence, 4500); // Total cycle time ~4.5s
    return () => clearInterval(loopId);
  }, []);

  const word = "CONSYG";

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-black">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-text"
            variants={wordVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex text-white text-4xl md:text-5xl font-bold mb-4"
          >
            {word.split("").map((char, i) => (
              <motion.span key={char + i} variants={letterVariants} className="inline-block px-[2px]">
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden mt-8">
        <motion.div
          key="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-white rounded-full"
        />
      </div>
    </div>
  );
};
```