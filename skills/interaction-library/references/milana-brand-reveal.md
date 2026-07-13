---
version: beta-v2
name: milana-brand-reveal
name_zh: "Milana 品牌动效展示"
cover_video: "../assets/milana-brand-reveal.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/milana-brand-reveal.mp4"
tags: ["Reveal", "Elastic"]
preview: { backgroundColor: "#F7F7F7", textColor: "#1A1A1A" }
description: >
  这是一个充满活力的品牌动效展示，以高光渐变形状、多场景的Logo揭示和在服装、笔记本电脑等媒介上的模型展示为特色。
  动效通过流体扩展和弹性的几何形状，营造出一种现代、生动且吸引人的品牌体验。
  触发词：[品牌揭示, 渐变形状, 流体过渡, 活力动效]
website: "https://x.com/jameygannon/status/2053875385507479809"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "80ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, scale: 0.9, y: 15 }
    animate: { opacity: 1, scale: 1, y: 0 }
    exit: { opacity: 0, scale: 0.9, y: -10 }
---

# Milana 品牌动效展示 Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 动效核心体感是充满活力的品牌揭示，通过一系列流体且富有弹性的过渡动画，展示了品牌Logo和视觉元素。高光渐变形状的运动具有明显的弹性回弹，而UI界面的切换则更为平滑和快速。整体营造出一种科技感与玩趣兼备的现代品牌形象。
- **Interaction Flow**: 这是一个非交互式的品牌宣传视频，动效流主要围绕不同场景下品牌Logo和元素的顺序揭示、转换和展示。从抽象图形到具体应用（如网站、产品），元素按精心编排的序列出现，确保视觉连贯性和冲击力。

## 2. Component DOM Mapping (元素与动效节点映射)

_此视频包含多个场景和复杂元素，此处映射以代表性场景为例进行概念性描述。_

- **[Scene Container]** (e.g., `div` - 主场景容器)
  - 负责整体背景颜色变化和场景过渡，可能应用全局的淡入淡出或滑入效果。
- **[Brand Icon / Logo Element]** (e.g., `svg` 或 `img` - 品牌图标或Logo)
  - 通常以 `scale` (放大缩小) 和 `opacity` (透明度) 的组合进行揭示，常伴随 `PRESET_SPRING_SMOOTH` 的弹性效果。
- **[Abstract Gradient Shapes]** (e.g., `div` - 抽象渐变形状组)
  - 内部元素通过 `stagger_delay` 错位出现，并伴随 `rotate`, `translate` 和 `scale` 的弹性动画，形成动态的视觉背景。
- **[UI Mockup Card / Screen]** (e.g., `div` - 网站或应用界面卡片)
  - 通过 `translateY` (垂直位移) 和 `opacity` 进行快速平滑的滑入和淡入，通常使用 `css_fallback_easing` 保证流畅。
- **[Merchandise Graphic]** (e.g., `img` - 服装、帽子上的Logo或图案)
  - 通常通过 `opacity` 和 `scale` 进行直接的呈现，与背景或产品本身结合。

## 3. Detailed Timeline Sequence (时序编排)

_此视频的动画流程复杂，以下为关键动效阶段的概述：_

- **[0ms - 1000ms] Initial App Icon Reveal**:
  - Milana app icon从 `opacity: 0` 和 `scale: 0.8` 快速放大并淡入到 `opacity: 1` 和 `scale: 1`，伴随 `PRESET_SPRING_SMOOTH` 的轻微弹性。
- **[1000ms - 2500ms] Full-screen Abstract Shapes Transition**:
  - 场景迅速切换至全屏抽象渐变形状，这些形状以 `stagger_delay` 错位出现，并进行 `scale` 和 `rotate` 动画，展现出强烈的设计感。
- **[2500ms - 4000ms] UI Mockup Slide-in & Reveal**:
  - 多个Web UI卡片从屏幕外部滑入，或通过 `opacity` 和 `translateY` 从底部淡入。每个卡片可能带有轻微的 `stagger_delay`。
- **[4000ms - 5500ms] Stacked Shapes Assembly**:
  - 多个圆柱形渐变形状逐一从底部堆叠而上，每个形状在定位时都有清晰的 `PRESET_SPRING_SMOOTH` 弹性回弹，形成立体感。
- **[5500ms - 7000ms] Merchandise & Laptop Showcase**:
  - 带有Milana Logo的服装、帽子以及笔记本电脑的屏幕内容通过平滑的 `fade-in` 或 `slide-in` 效果进行展示。
- **[7000ms - 8000ms] Final Logo Presentation**:
  - 最终的Milana文字Logo以简洁有力的 `fade-in` 和 `scale-up` 效果呈现在白色背景上，完成品牌揭示。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2. **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3. **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4. **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not accessible.
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Insert custom physics from motion_tokens
const springPhysics = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Variants for sequential element reveal
const itemVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { ...springPhysics, duration: 0.5 } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { ease: [0.4, 0, 0.2, 1], duration: 0.2 } },
};

// Container variants for stagger effect
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.08, // stagger_delay from motion_tokens
      delayChildren: 0.2 // Initial delay before first child animation
    }
  }
};

export const MilanaBrandRevealSection = () => {
  const [showContent, setShowContent] = React.useState(true); // Simulate a mount/unmount for demo

  // In a real application, this would be triggered by scroll, route change, etc.
  // For a video-like reveal, elements would typically just animate on mount.

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <AnimatePresence>
        {showContent && (
          <motion.div
            key="milana-reveal-container"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center gap-6"
          >
            <motion.h1 
              variants={itemVariants} 
              className="text-6xl font-extrabold text-black"
            >
              Milana
            </motion.h1>
            <motion.p 
              variants={itemVariants} 
              className="text-xl text-gray-700 max-w-2xl text-center"
            >
              A vibrant motion brand presentation with glossy gradient shapes, captivating logo reveals, and dynamic mockups.
            </motion.p>
            <div className="flex gap-4 mt-8">
              <motion.div 
                variants={itemVariants} 
                className="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-lg shadow-lg flex items-center justify-center text-white text-4xl font-bold"
              >
                M
              </motion.div>
              <motion.div 
                variants={itemVariants} 
                className="w-32 h-32 bg-gradient-to-br from-pink-400 to-red-600 rounded-full shadow-lg flex items-center justify-center text-white text-4xl font-bold"
              >
                R
              </motion.div>
            </div>
            <motion.button 
              variants={itemVariants} 
              className="mt-12 px-8 py-3 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
              onClick={() => setShowContent(false)} // Simulate exit
            >
              Explore Milana
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        className="fixed bottom-8 px-6 py-2 bg-gray-200 text-gray-800 rounded-full" 
        onClick={() => setShowContent(!showContent)}
      >
        Toggle Reveal
      </button>
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