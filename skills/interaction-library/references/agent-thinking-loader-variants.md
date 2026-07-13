---
version: beta-v2
name: agent-thinking-loader-variants
name_zh: "代理思考加载动效变体"
cover_video: "../assets/agent-thinking-loader-variants.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/agent-thinking-loader-variants.mp4"
tags: ["Elastic", "Reveal"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  这是一个探索代理界面四种思考状态的暗色系动效研究，通过细微的循环图标变化，呈现出流畅、富有韵律的加载体感。
  每个变体都展示了元素连续、平滑的动态过程，有的具有弹性伸缩感，有的则通过子元素的交错显现来营造思考的氛围。
  触发词：[循环加载, 状态指示, 流畅动效, 抽象图标]
website: "https://x.com/xchylerdrenth/status/2072203766523363623"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "50ms" # 多个子元素或连续帧之间的交错延迟

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "1000ms" # 对于循环动画，此duration指单次完整循环的预估时长

  variants:
    initial: { opacity: 0, scale: 0.95 } # loaders are usually always visible
    animate: { opacity: 1, scale: 1 } # continuous looping
---

# 代理思考加载动效变体 (Agent Thinking Loader Variants) Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic / Linear-Smooth (Mix of both, leaning towards Fluid for overall smoothness)
- **Core Experience**: 动效为四个独立的、无限循环的“思考中”状态指示器。视觉元素持续地进行平滑、有节奏的变形或显隐。整体体感流畅且富有韵律，传达出智能代理正在后台进行处理的印象。
- **Interaction Flow**: 这些是自循环的、非交互式的状态指示动效。当代理进入“思考”状态时触发，并持续循环播放直到状态结束。

## 2. Component DOM Mapping (元素与动效节点映射)

_Vision-Agent: Map the visual elements in the video to a virtual DOM structure before defining motion._

- **[Parent Container]** (`div` - Icon Wrapper)
  - 承载整个加载图标，确保居中显示。
- **[Child Node A]** (e.g., `div` - Sphere/Lines/Dots segments)
  - 构成图标核心视觉元素的各个部分。例如，变体1中的环形层、变体2中的点、变体3和4中的线段。
  - 这些子元素独立进行位移、缩放、透明度或形状变换，并可能带有交错延迟。

## 3. Detailed Timeline Sequence (时序编排)

_Vision-Agent: Define the exact motion sequence in milliseconds based on video analysis._

由于这些是连续循环动画，我们描述每个变体在一个循环周期内的核心行为模式：

-   **[Variant 1 - Globe] (Duration: ~1000ms per loop)**:
    -   环形分层结构持续旋转，同时各层之间进行微妙的垂直位移和缩放，模拟弹性压缩和扩展的视觉效果，形成一种流动的球体感。
-   **[Variant 2 - Dots] (Duration: ~1000ms per loop)**:
    -   围绕中心点，一系列点以径向或圆周路径交错出现、移动和消失。
    -   点可能通过 `opacity` 和 `scale` 进行淡入淡出，并配合小幅 `translate`。
-   **[Variant 3 - Horizontal Lines] (Duration: ~1200ms per loop)**:
    -   多条水平线段在各自的Y轴位置上交错进行宽度（或X轴缩放）的扩展和收缩，同时伴随轻微的垂直位移。
    -   部分线段可能进行淡入淡出。
-   **[Variant 4 - Vertical Lines] (Duration: ~1200ms per loop)**:
    -   类似于变体3，但动画应用于垂直线段，它们进行高度（或Y轴缩放）的扩展和收缩，并伴随轻微的水平位移。
    -   同样可能伴随淡入淡出。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

_Vision-Agent: Generate a complete, working component code block based on your analysis of the tech stack in package.json (or default to the React block below)._

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not provided.
import React from "react";
import { motion } from "framer-motion";

// Helper for continuous looping animations
const loopTransition = {
  duration: 1.5, // Total duration for one cycle of the animation
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "loop",
};

// Example for State Variant 1 (Globe-like)
const GlobeVariant = () => {
  return (
    <motion.div
      className="relative w-16 h-16 flex items-center justify-center"
      style={{ perspective: 600 }} // Add perspective for 3D effect
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-2 bg-white rounded-full opacity-70"
          style={{ transformOrigin: "center center" }}
          initial={{
            rotateX: 0,
            scaleY: 1,
            opacity: 0.7,
            y: (i - 2) * 8, // Stagger initial Y position
          }}
          animate={{
            rotateX: [0, 360],
            scaleY: [1, 0.8, 1.2, 1], // Subtle elastic scale
            opacity: [0.7, 0.9, 0.7],
            y: [(i - 2) * 8, (i - 2) * 8 - 4, (i - 2) * 8 + 4, (i - 2) * 8], // Subtle vertical shift
          }}
          transition={{
            ...loopTransition,
            duration: loopTransition.duration + i * 0.1, // Staggered duration for a wave effect
            delay: i * 0.05, // Staggered start delay
          }}
        />
      ))}
    </motion.div>
  );
};

// Example for State Variant 2 (Dots)
const DotsVariant = () => {
  const numDots = 8;
  const radius = 20;

  return (
    <motion.div className="relative w-16 h-16 flex items-center justify-center">
      {[...Array(numDots)].map((_, i) => {
        const angle = (i / numDots) * 2 * Math.PI;
        const initialX = radius * Math.cos(angle);
        const initialY = radius * Math.sin(angle);

        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: initialX,
              y: initialY,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: [0, 1, 1, 0], // Fade in, stay, fade out
              scale: [0.5, 1, 1, 0.5],
              x: [initialX, initialX * 1.2, initialX * 0.8, initialX], // Subtle movement
              y: [initialY, initialY * 1.2, initialY * 0.8, initialY],
            }}
            transition={{
              ...loopTransition,
              duration: 1.8,
              delay: i * 0.15, // Staggered appearance
            }}
          />
        );
      })}
    </motion.div>
  );
};

export const AgentThinkingLoader = ({ variant = 1 }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-lg space-y-4">
      {variant === 1 && <GlobeVariant />}
      {variant === 2 && <DotsVariant />}
      {/* Add more variants here based on the video analysis */}
      <p className="text-white text-sm mt-2">Agent thinking.. State variant {variant}</p>
    </div>
  );
};

// Example usage:
// <AgentThinkingLoader variant={1} />
// <AgentThinkingLoader variant={2} />
```

## 🛑 AI Anti-Patterns & Blocklist (AI 避坑防偏与硬性禁忌)

> **⚠️ [SYSTEM RULE]** As a Senior Motion Developer, you must strictly AVOID the following anti-patterns. Violating any of these rules will result in layout shift and rendering stutter.

### 1. The "Sticky Animation" Trap (时长失控)
- ❌ **DON'T**: Do NOT write transitions or spring animations with a duration exceeding `400ms` unless specifically requested. It makes the UI feel laggy and sticky.
- **DO**: Default to snappy durations (`150ms - 300ms`). High-frequency micro-interactions (like buttons/taps) must be under `150ms`.
  _Note: For continuous looping loaders, a longer overall loop duration (e.g., 1-2s) is acceptable, but individual segment transitions within the loop should still be fluid and not appear "sticky"._

### 2. The "Layout Thrashing" Catastrophe (严禁非 GPU 加速属性)
- ❌ **DON'T**: NEVER use `transition: all`. Never animate layout-shifting properties: `width`, `height`, `top`, `left`, `margin`, `padding`, or `border-width`.
- **DO**: Only animate `transform` (scale, translate, rotate) and `opacity`. If you need to animate border changes, use `box-shadow: inset` or a pseudo-element (`::after`) with opacity scale.

### 3. Dark Mode Shadow Pollution (暗黑模式脏阴影)
- ❌ **DON'T**: Do NOT apply standard dark shadows (`rgba(0,0,0,0.5)`) on dark-themed components—they become invisible or look muddy. NEVER use bright white shadows.
- **DO**: In dark mode, replace floating shadows with a subtle semi-transparent border (e.g., `border: 1px solid rgba(255, 255, 255, 0.08)`) and a slight background highlight (elevation tint).

### 4. Instantly Vanishing Exit (销毁无动画)
- ❌ **DON'T**: Do NOT let elements disappear instantly from the DOM when they are closed or unmounted.
- **DO**: You must wrap conditional rendering with `<AnimatePresence>` (Framer Motion) or leverage CSS transition-end event listeners to ensure the `exit` state plays out fully before node destruction.