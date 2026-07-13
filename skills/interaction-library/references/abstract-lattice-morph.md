---
version: beta-v2
name: abstract-lattice-morph
name_zh: "抽象网格形变动效"
cover_video: "../assets/abstract-lattice-morph.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/abstract-lattice-morph.mp4"
tags: ["Elastic", "Abstract"]
preview: { backgroundColor: "#FFFFFF", textColor: "#333333" }
description: >
  这是一个极简的循环动画，抽象的灰色网格形态在白色背景上进行柔和的形变和拉伸，呈现出有机生物感。网格的线条和内部单元格持续地膨胀、收缩和扭曲，整体保持流体弹性。
  触发词：[网格形变, 有机拉伸, 柔和形变, 弹性形变]
website: "https://x.com/_andresjasso/status/2068096608877552129"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms" # Not applicable for a single morphing object

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "800ms" # Duration for one phase of the morphing cycle

  variants:
    # These variants describe general bounding box properties; the complex internal shape morphing is conceptual
    initial: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } # Represents a slightly more 'compact' state
    animate: { opacity: 1, scale: 1.05, y: 0, filter: "blur(0px)" } # Represents a slightly more 'expanded' state for oscillation
    exit: { opacity: 0 } # Not applicable for this continuous loop
---

# 抽象网格形变动效 / Abstract Lattice Morph Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 抽象的网格结构在白色背景上连续地进行形变，其线条和内部空隙呈现出柔和、有机的弹性拉伸和收缩。整个形态如同一个有生命的组织在“呼吸”和蠕动，每一次形变都伴随着流畅的阻尼感，没有明显的开始和结束，循环往复。
- **Interaction Flow**: 这是一个自动循环的动画，没有用户交互。形变在预设的物理参数下持续发生。

## 2. Component DOM Mapping (元素与动效节点映射)

*Vision-Agent: Map the visual elements in the video to a virtual DOM structure before defining motion.*

- **[Lattice Container]** (`div` or `svg` - Represents the entire abstract lattice shape)
  - 核心形变发生在此容器的内部结构上。虽然动效主要集中在内部线条的有机扭曲和单元格的膨胀收缩，但其整体外部轮廓也可能伴随轻微的缩放和形变。
  - 应用 `transform_origin` 为 `center center`。

## 3. Detailed Timeline Sequence (时序编排)

*Vision-Agent: Define the exact motion sequence in milliseconds based on video analysis.*

- **[0ms - 800ms] Expansion Phase**:
  - Lattice Container（概念上）从初始的相对紧凑状态，平滑地“膨胀”到更舒展、内部单元格更大的形态，其线条也变得更加弯曲和有机。
  - 此过程遵循 `PRESET_SPRING_SMOOTH` 的物理曲线。
- **[800ms - 1600ms] Contraction Phase**:
  - Lattice Container（概念上）从舒展状态平滑地“收缩”回相对紧凑的状态，为下一次膨胀做准备。线条和单元格恢复到更规则的形态。
  - 此过程同样遵循 `PRESET_SPRING_SMOOTH` 的物理曲线。
- **[Loop]**:
  - 整个 1600ms 的膨胀-收缩循环无限重复，形成流畅的连续形变效果。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

*Vision-Agent: Generate a complete, working component code block based on your analysis of the tech stack in package.json (or default to the React block below).*

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not provided.

import React from "react";
import { motion } from "framer-motion";

// Insert custom physics from motion_tokens
const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Variants to simulate the two extreme states of the morph (for scale property)
const morphVariants = {
  initialState: { scale: 1 },
  morphState: { scale: 1.05 },
};

export const AbstractLatticeMorph = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <motion.div
        variants={morphVariants}
        initial="initialState"
        animate={{
          scale: [1, 1.05, 1], // Oscillate between scale 1 and 1.05
          transition: {
            ...physicsConfig,
            repeat: Infinity, // Loop indefinitely
            repeatType: "mirror", // Animate back and forth
            duration: 1.6, // Total duration for one full cycle (e.g., 0ms -> 1.05 at 0.8s -> 1.0 at 1.6s)
          },
        }}
        style={{
          transformOrigin: "center center",
          width: "200px",
          height: "200px",
          backgroundColor: "#4A4A4A", // Placeholder for the lattice shape, typically this would be an SVG or canvas
          borderRadius: "15%", // Giving it a slightly soft edge
        }}
        className="relative"
      >
        {/*
          NOTE: For true lattice morphing as seen in the video,
          this would typically involve SVG path animation or a WebGL shader.
          The current Framer Motion example above demonstrates the 'breathing'
          and elastic feel using scale, but would need advanced techniques
          to replicate the intricate internal shape changes of the lattice.
          For a simplified visual, you could use a CSS mask image that morphs,
          or draw the lattice dynamically on a canvas.
        */}
        <div className="absolute inset-0 flex items-center justify-center text-white text-xs opacity-70">
          Lattice placeholder
        </div>
      </motion.div>
    </div>
  );
};
```

## 🛑 AI Anti-Patterns & Blocklist (AI 避坑防偏与硬性禁忌)

> **⚠️ [SYSTEM RULE]** As a Senior Motion Developer, you must strictly AVOID the following anti-patterns. Violating any of these rules will result in layout shift and rendering stutter.

### 1. The "Sticky Animation" Trap (时长失控)
- ❌ **DON'T**: Do NOT write transitions or spring animations with a duration exceeding `400ms` unless specifically requested. It makes the UI feel laggy and sticky.
- **DO**: Default to snappy durations (`150ms - 300ms`). High-frequency micro-interactions (like buttons/taps) must be under `150ms`. **(Note: For this continuous loop, a longer duration of 1.6s for a full cycle is explicitly chosen to achieve the organic, slow "breathing" effect, with each half-phase being 800ms.)**

### 2. The "Layout Thrashing" Catastrophe (严禁非 GPU 加速属性)
- ❌ **DON'T**: NEVER use `transition: all`. Never animate layout-shifting properties: `width`, `height`, `top`, `left`, `margin`, `padding`, or `border-width`.
- **DO**: Only animate `transform` (scale, translate, rotate) and `opacity`. If you need to animate border changes, use `box-shadow: inset` or a pseudo-element (`::after`) with opacity scale.

### 3. Dark Mode Shadow Pollution (暗黑模式脏阴影)
- ❌ **DON'T**: Do NOT apply standard dark shadows (`rgba(0,0,0,0.5)`) on dark-themed components—they become invisible or look muddy. NEVER use bright white shadows.
- **DO**: In dark mode, replace floating shadows with a subtle semi-transparent border (e.g., `border: 1px solid rgba(255, 255, 255, 0.08)`) and a slight background highlight (elevation tint).

### 4. Instantly Vanishing Exit (销毁无动画)
- ❌ **DON'T**: Do NOT let elements disappear instantly from the DOM when they are closed or unmounted.
- **DO**: You must wrap conditional rendering with `<AnimatePresence>` (Framer Motion) or leverage CSS transition-end event listeners to ensure the `exit` state plays out fully before node destruction.
---