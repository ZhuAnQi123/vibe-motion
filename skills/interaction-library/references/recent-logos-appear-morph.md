---
version: beta-v2
name: recent-logos-appear-morph
name_zh: "动态 Logo 出现与变形集合"
cover_video: "../assets/recent-logos-appear-morph.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/recent-logos-appear-morph.mp4"
tags: ["Elastic", "Reveal"]
preview: { backgroundColor: "#FF0000", textColor: "#FFFFFF" }
description: >
  这是一个展示多个抽象 Logo 出现和变形动效的集合。每个 Logo 都以独特的方式动画入场，通过平滑的弹性形变、旋转或缩放，从中心点优雅地展现出来，带有微妙的物理阻尼感，使视觉感受流畅而富有生机。
  触发词：[弹性形变、Logo 入场、平滑阻尼]
website: "https://x.com/SebCornelius/status/2066488019037909124"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, scale: 0.8, rotate: -20, filter: "blur(5px)" }
    animate: { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# 动态 Logo 出现与变形集合 / Recent Logos Appear & Morph Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 每个抽象 Logo 都通过一个平滑且带有微妙弹性的动画效果“展现”出来，通常伴随着从中心点进行的缩放、旋转或形变。这种动画体验自然流畅，富有生动感。
- **Interaction Flow**: 非用户交互式。这是一个自动播放的序列，其中每个独特的 Logo 动画都会在各自的阶段展现，通常从一个较小、不明确的状态过渡到其最终形态。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Logo Element Container]** (`div` or `svg` - individual logo container)
  - 核心元素，负责承载和展示单个 Logo 图形。
  - 应用 `transform_origin: "center center"`，并进行缩放 (`scale`)、旋转 (`rotate`)、透明度 (`opacity`) 和模糊 (`filter`) 的变换。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 100ms] Initial State (起始状态)**:
  - Logo 元素处于隐藏状态：`opacity: 0`，`scale: 0.8`，`rotate: -20deg`，`filter: blur(5px)`。
- **[100ms - 450ms] Reveal Phase (展现阶段)**:
  - Logo 元素开始动画入场，使用 `PRESET_SPRING_SMOOTH` 物理参数。
  - 目标状态为：`opacity: 1`，`scale: 1`，`rotate: 0deg`，`filter: blur(0px)`。
  - 动画持续约 `350ms`（由弹簧物理特性决定）。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Complete production-ready implementation of 动态 Logo 出现与变形集合
// Assuming React + Tailwind CSS + Framer Motion as per default directive.
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Define variants for the logo's appearance animation
const logoVariants = {
  initial: { opacity: 0, scale: 0.8, rotate: -20, filter: "blur(5px)" },
  animate: { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)", transition: physicsConfig },
  exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)", transition: { duration: 0.2, ease: "easeOut" } },
};

export const LogoRevealComponent = () => {
  const [showLogo, setShowLogo] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-600 p-8">
      <button
        onClick={() => setShowLogo(!showLogo)}
        className="mb-8 px-6 py-3 bg-white text-red-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
      >
        {showLogo ? "Hide Logo" : "Show Logo"}
      </button>

      <AnimatePresence>
        {showLogo && (
          <motion.div
            key="animated-logo"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ transformOrigin: "center center" }}
            className="relative w-48 h-48 bg-white rounded-xl flex items-center justify-center shadow-lg"
          >
            {/* Example abstract logo shape - can be replaced with an SVG or image */}
            <motion.div
              className="w-24 h-24 bg-red-600 rounded-full"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            />
            <span className="absolute text-red-600 font-bold text-2xl">L</span>
          </motion.div>
        )}
      </AnimatePresence>
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