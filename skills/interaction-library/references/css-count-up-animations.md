---
version: beta-v2
name: css-count-up-animations
name_zh: "CSS 数字计数动画"
cover_video: "../assets/css-count-up-animations.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/css-count-up-animations.mp4"
tags: ["Reveal", "Typographic", "Clean"]
preview: { backgroundColor: "#F5F5F5", textColor: "#333333" }
description: >
  这是一组数字计数器动画，数字在方形容器内通过快速垂直滑动进行切换，整体视觉风格简洁且响应迅速。部分交互元素（如背景色块或图标）可能伴随轻微的弹性形变，但核心的数字变化是流畅的滚动效果。
  触发词：[数字计数, 垂直滑动, 快速切换, 弹性形变, 遮罩切换]
website: "https://x.com/yui540/status/2068927699721363735"

motion_tokens:
  selected_preset: "PRESET_SPRING_STIFF" # 选择硬朗弹簧，以捕捉整体快速响应和部分元素的轻微弹性
  transform_origin: "center center"
  stagger_delay: "0ms" # 多个单元格动画独立，无明显交错

  active_physics:
    stiffness: 500
    damping: 40
    mass: 1
  css_fallback_easing: "cubic-bezier(0.4, 0, 0.2, 1)" # 标准 ease-in-out，用于数字的平滑滑动
  duration: "250ms" # 快速完成动画，符合视频中的节奏

  variants:
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" } # 通用初始状态 (如果适用)
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } # 通用动画状态 (如果适用)
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" } # 通用退出状态 (如果适用)
---

# CSS 数字计数动画 Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Snappy-Mechanical / Linear-Smooth (混合，数字变化为线性滑动，部分辅助元素可能有硬朗弹簧感)
- **Core Experience**: 这组动画的核心体感是数字在固定的方形容器内进行快速、平滑的垂直滚动切换。每个数字变化都伴随着上一个数字滑出视图、下一个数字滑入视图的遮罩效果，给人一种简洁而高效的数字化更新感。视频中部分非数字方块的切换也体现了快速响应的特性，可能伴有轻微的弹性或直接切换。
- **Interaction Flow**: 每个方块独立工作，其内部的数字或图标根据某种逻辑（例如计时器或数据更新）进行连续变化。数字的变化通过一个遮罩（`overflow: hidden`）内的 `translateY` 动画实现，旧数字向上或向下退出，新数字从对应方向进入。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - Grid Cell Wrapper)
  - 负责每个独立方块的布局和基本的视觉样式（如背景、圆角、阴影）。
  - 应用 `overflow: hidden` 来创建数字滚动的遮罩效果。
- **[Child Node A]** (`div` or `span` - Number Element)
  - 包含实际显示的数字。
  - 通过 `transform: translateY` 和 `opacity` 进行动画，实现数字的滑入滑出。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 50ms] Trigger & Initial State**:
  - 当数字更新触发时，新的数字元素准备就绪，其 `y` 轴位置根据滚动方向设置在可见区域的上方或下方（例如，向上滚动则新数字从下方 `y: 100%` 处进入）。
- **[50ms - 250ms] Number Slide Transition**:
  - 新数字从初始位置(`y: 100%` 或 `y: -100%`)快速滑动至 `y: 0%` (居中可见)，同时旧数字从 `y: 0%` 滑出至反方向 (`y: -100%` 或 `y: 100%`)。
  - 此过程使用 `cubic-bezier(0.4, 0, 0.2, 1)`（标准 `ease-in-out`）缓动函数，总时长约 `250ms`。
  - 在此期间，数字的 `opacity` 也从 `0` 动画到 `1` (新数字) 或从 `1` 动画到 `0` (旧数字)。
- **[Exit Phase] Dismiss Sequence**:
  - (不适用于视频中连续计数场景，但在需要组件卸载时，元素应反向执行上述滑出动画，确保在完全退出视口或透明度为0后再从DOM中移除，通常由 `<AnimatePresence>` 管理。)

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2. **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3. **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4. **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not provided.
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Defined easing for number slide (based on css_fallback_easing from motion_tokens)
const numberSlideEase = [0.4, 0, 0.2, 1];
const slideDuration = 0.25; // 250ms from motion_tokens.duration

// Variants for the individual number's slide animation
const numberVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "100%" : "-100%", // New number starts below (+1) or above (-1)
    opacity: 0,
    transition: { ease: numberSlideEase, duration: slideDuration },
  }),
  center: {
    y: "0%", // Current number in view
    opacity: 1,
    transition: { ease: numberSlideEase, duration: slideDuration },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%", // Old number exits above (+1) or below (-1)
    opacity: 0,
    transition: { ease: numberSlideEase, duration: slideDuration },
  }),
};

interface NumberCounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
  intervalMs?: number;
}

export const NumberCounter: React.FC<NumberCounterProps> = ({
  initialValue = 0,
  min = 0,
  max = 3,
  intervalMs = 1000,
}) => {
  const [currentNumber, setCurrentNumber] = useState(initialValue);
  const [direction, setDirection] = useState(1); // 1 for increment (slide up), -1 for decrement (slide down)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNumber((prev) => {
        const next = (prev + 1) % (max + 1);
        // Determine slide direction: if next number is greater, or loops from max to min
        setDirection(next > prev || (next === min && prev === max) ? 1 : -1);
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [currentNumber, max, min, intervalMs]);

  return (
    <div
      className="relative w-24 h-24 bg-white rounded-lg flex items-center justify-center overflow-hidden"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentNumber} // Key change triggers enter/exit animations
          custom={direction}
          variants={numberVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute text-5xl font-bold text-gray-800"
        >
          {currentNumber}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Example Usage of the NumberCounter in a grid
export const CountUpAnimationGrid: React.FC = () => {
  const initialValues = [0, 1, 2, 3, 0, 1, 2, 3, 0]; // Simulating initial states from the video
  const maxNumber = 3; // Max number observed in the video

  return (
    <div className="grid grid-cols-3 gap-4 p-8 bg-gray-100 min-h-screen place-items-center">
      {initialValues.map((val, index) => (
        // Each NumberCounter component is independent
        <NumberCounter key={index} initialValue={val} max={maxNumber} intervalMs={1000 + index * 50} />
      ))}
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