---
version: beta-v2
name: ar-typography-exploration
name_zh: "AR 沉浸式文字探索"
cover_video: "../assets/ar-typography-exploration.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/ar-typography-exploration.mp4"
tags: ["Reveal", "Elastic"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  这是一个沉浸式AR文字动效，文字元素以流体弹性（Spring Smooth）的方式旋转、缩放并从模糊到清晰地显现，同时背景场景进行切换。每个文字片段之间存在微妙的交错延迟，营造出动态且富有层次感的视觉叙事。
  触发词：[流体弹性、文字显现、场景切换、分层延迟]
website: "https://x.com/gabbisoong/status/2067413097862881428"

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
    initial: { opacity: 0, scale: 0.8, rotateX: 20, filter: "blur(4px)" }
    animate: { opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.9, rotateX: -10, filter: "blur(2px)" }
---

# AR 沉浸式文字探索 / AR Typography Exploration Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 文字元素以一种流畅、富有弹性的方式逐行显现，伴随着轻微的旋转、缩放效果，并从模糊逐渐变得清晰。整个过程感觉自然且富有生命力，背景场景的切换也为文字内容提供了沉浸式的舞台。
- **Interaction Flow**: 沉浸式场景切换触发 -> 文字元素以弹性动画和交错延迟的方式按顺序浮现并定位。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - Scene Wrapper)
  - 承载整个3D文字场景，并可能管理背景图像或视频的切换。
- **[Text Line Element]** (`span` 或 `div` - 单行文本容器)
  - 每个独立的文本行或文本块。
  - 应用 `opacity`（透明度）、`scale`（缩放）、`rotateX`（X轴旋转）和 `filter`（模糊）的动画效果。
  - 各个文本行之间会应用 `stagger_delay` 来实现交错显现。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 350ms] 显现阶段**:
  - 当新的场景或文字内容加载时，每个 `[Text Line Element]` 从 `initial` 状态 (`opacity: 0`, `scale: 0.8`, `rotateX: 20`, `filter: "blur(4px)"`) 动画到 `animate` 状态 (`opacity: 1`, `scale: 1`, `rotateX: 0`, `filter: "blur(0px)"`)。
  - 动画采用 `PRESET_SPRING_SMOOTH` 的物理参数，提供流体弹性体感。
  - 每行文本之间存在 `stagger_delay: 40ms` 的交错延迟，使文本逐行优雅地浮现。
- **[退出阶段] 消失序列**:
  - 当文字需要消失以切换到新内容时，`[Text Line Element]` 将过渡到 `exit` 状态 (`opacity: 0`, `scale: 0.9`, `rotateX: -10`, `filter: "blur(2px)"`)。
  - 同样使用 `PRESET_SPRING_SMOOTH` 或类似弹簧动效进行快速退出，可以考虑反向的交错延迟效果以匹配进入。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2. **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3. **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4. **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Complete production-ready implementation of AR 沉浸式文字探索
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not provided.
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Insert custom physics from motion_tokens
const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Variants for individual text lines
const textVariants = {
  initial: { opacity: 0, scale: 0.8, rotateX: 20, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)", transition: physicsConfig },
  exit: { opacity: 0, scale: 0.9, rotateX: -10, filter: "blur(2px)", transition: { duration: 0.3 } },
};

// Container variants for stagger effect
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.04, // stagger_delay: 40ms
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1, // Reverse stagger on exit
    },
  },
};

interface ARTextSceneProps {
  textLines: string[];
  sceneKey: string; // Used to trigger AnimatePresence for scene changes
}

export const ARTextScene: React.FC<ARTextSceneProps> = ({ textLines, sceneKey }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background content or scene transitions can go here */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 -z-10" />

      <AnimatePresence mode="wait"> {/* Use mode="wait" to ensure exit animation completes before new enters */}
        <motion.div
          key={sceneKey} // Change key to trigger exit/enter animations
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col items-center justify-center p-4 text-white text-center font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
          style={{ perspective: 1000 }} // Add perspective for 3D rotation effect
        >
          {textLines.map((line, index) => (
            <motion.span
              key={index}
              variants={textVariants}
              style={{ transformOrigin: "center center" }}
              className="block my-2" // Each line as a block
            >
              {line}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Example Usage:
// const [currentScene, setCurrentScene] = useState(0);
// const scenes = [
//   { key: 'scene1', lines: ['The Arched', 'Fictional Symphony', 'Jacobus de', 'Quartz & Waffling'] },
//   { key: 'scene2', lines: ['Bibliothèque-Musée', 'Nationale', "De l'Opéra", 'Moderne', "D'Orsay", 'Médailles'] },
//   // ... more scenes
// ];
// <ARTextScene textLines={scenes[currentScene].lines} sceneKey={scenes[currentScene].key} />
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