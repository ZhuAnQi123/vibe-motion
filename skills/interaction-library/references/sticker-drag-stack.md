---
version: beta-v2
name: sticker-drag-stack
name_zh: "贴纸拖拽堆叠动效"
cover_video: "../assets/sticker-drag-stack.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/sticker-drag-stack.mp4"
tags: ["Elastic", "Click"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  这是一个趣味十足的贴纸拖拽动效。用户可以点击并拖拽屏幕上的多个全息贴纸，每个贴纸在被拖动时会轻微浮起并带有弹性形变，释放后会流畅地弹回原位或堆叠至屏幕中心形成一个整齐的贴纸堆。整个过程充满弹性与活力。
  触发词：[贴纸拖拽、弹性堆叠、全息动效、微交互]
website: "https://x.com/Nomandsign/status/2074955482704593210"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "40ms" # Not directly applicable to the dragging of individual items, but could be for initial load or pile-up.

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 1, scale: 1, rotate: 0 } # Base state of a sticker
    drag: { scale: 1.05, rotate: 5, zIndex: 100, filter: "brightness(1.1)" } # State when being dragged
    snapBack: { scale: 1, rotate: 0, zIndex: 1, filter: "brightness(1)" } # State when snapping back
    stacked: { scale: 0.8, rotate: [0, 5, -5, 0], zIndex: 1, filter: "brightness(1)" } # State when part of the stack
---

# 贴纸拖拽堆叠动效 / Sticker Drag & Stack Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 用户点击并拖拽屏幕上的贴纸时，贴纸会有一个轻微的“剥离”和浮起效果，并带有弹性形变，紧随鼠标移动。释放贴纸后，它会以流畅且带有轻微反弹的弹簧动效，迅速归位或与其他贴纸堆叠到屏幕中心，形成一个错落有致的贴纸堆。整个交互过程自然、生动，并凸显了贴纸材质的全息光泽。
- **Interaction Flow**:
    1.  **Initial State**: 多个贴纸分散在黑色背景上。
    2.  **Drag Start (Click & Hold)**: 目标贴纸被“拾起”，伴随 `scale` 增加 (1 -> 1.05)、`rotate` 轻微变化 (0 -> 5度)、`translateY` 抬升以及 `zIndex` 提升，以模拟从平面剥离的效果。此阶段使用 `PRESET_SPRING_SMOOTH`。
    3.  **Dragging**: 贴纸位置跟随鼠标移动，保持“拾起”状态的 `scale` 和 `rotate`。
    4.  **Drag End (Release)**:
        *   **Snap Back**: 若未拖至堆叠区域，贴纸会以 `PRESET_SPRING_SMOOTH` 动效，回弹至其初始位置，`scale`、`rotate`、`translateY` 恢复到 `initial` 状态，`zIndex` 降低。
        *   **Stacking**: 若拖至堆叠区域，贴纸会以 `PRESET_SPRING_SMOOTH` 动效，快速移动到堆叠中心，并进行 `scale` 缩小 (1.05 -> 0.8) 和 `rotate` 的最终调整，与其他已堆叠的贴纸形成视觉上的层次感，`zIndex` 根据其在堆叠中的顺序调整。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - Draggable Sticker Item)
  - Applies `transform_origin: center center`.
  - Handles drag events and applies `scale`, `rotate`, `translateY`, `zIndex` animations.
- **[Child Node A]** (`img` - Sticker Image)
  - The actual image content of the sticker.
  - Inherits transformations from the Parent Container.

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms] Initial State**: All stickers are rendered with `initial` variant (scale: 1, rotate: 0, zIndex: 1).
- **[Drag Start - ~150ms] Peel-Off & Lift Phase**:
  - `motion.div` (Sticker Item) transitions from `initial` to `drag` variant.
  - Properties: `scale: 1 -> 1.05`, `rotate: 0 -> 5deg`, `translateY: 0 -> -10px`, `zIndex: 1 -> 100`, `filter: brightness(1) -> brightness(1.1)`.
  - Timing: Driven by `PRESET_SPRING_SMOOTH` physics.
- **[During Drag] Follow Cursor Phase**:
  - The sticker's `x` and `y` positions are directly controlled by the drag gesture. No specific animation duration, as it's user-driven.
- **[Drag End - ~350ms] Snap/Stack Phase**:
  - `motion.div` (Sticker Item) transitions from `drag` to either `snapBack` (if returning) or `stacked` (if forming a pile).
  - **Snap Back**: `scale: 1.05 -> 1`, `rotate: 5deg -> 0`, `translateY: -10px -> 0`, `zIndex: 100 -> 1`, `filter: brightness(1.1) -> brightness(1)`.
  - **Stacking**: `scale: 1.05 -> 0.8`, `rotate: 5deg -> [0, 5, -5, 0]` (a subtle wobble), `translateY: -10px -> target_y_in_stack`, `zIndex: 100 -> new_stack_zIndex`, `filter: brightness(1.1) -> brightness(1)`.
  - Timing: Both snap back and stacking are driven by `PRESET_SPRING_SMOOTH` physics, typically resolving within `350ms`.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.
> 5.  **Drag Constraints**: Implement drag constraints for the draggable stickers to prevent them from being dragged completely off-screen, or to define a specific drop zone for stacking.
> 6.  **Z-Index Management**: Ensure `zIndex` is dynamically managed for the dragged sticker to always appear on top, and for stacked stickers to have correct layering.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not accessible.
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Represents a single sticker
const Sticker = ({ id, src, initialX, initialY, onStack, isStacked }) => {
  const [isDragging, setIsDragging] = useState(false);

  const variants = {
    initial: {
      x: initialX,
      y: initialY,
      scale: 1,
      rotate: 0,
      zIndex: 1,
      filter: "brightness(1)",
    },
    drag: {
      scale: 1.1, // Slightly larger when dragged
      rotate: 5, // Slight rotation when dragged
      zIndex: 100, // Always on top when dragging
      filter: "brightness(1.1)", // Slightly brighter
    },
    snapBack: {
      x: initialX,
      y: initialY,
      scale: 1,
      rotate: 0,
      zIndex: 1,
      filter: "brightness(1)",
      transition: physicsConfig,
    },
    stacked: (custom) => ({
      x: custom.x,
      y: custom.y,
      scale: 0.8,
      rotate: [0, custom.rotateWobble[0], custom.rotateWobble[1], 0], // Subtle wobble on stack
      zIndex: custom.zIndex,
      filter: "brightness(1)",
      transition: physicsConfig,
    }),
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight }} // Constrain to viewport
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        // Simplified stacking logic: if released near the center, stack it
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const distance = Math.sqrt(
          Math.pow(info.point.x - centerX, 2) + Math.pow(info.point.y - centerY, 2)
        );
        if (distance < 150) { // If within 150px of center
          onStack(id, centerX, centerY);
        } else {
          // If not stacking, let Framer Motion handle the snap back to the initial position
        }
      }}
      variants={variants}
      initial="initial"
      animate={isStacked ? "stacked" : (isDragging ? "drag" : "snapBack")}
      custom={isStacked ? {
        x: window.innerWidth / 2 - 50 + Math.random() * 100 - 50, // Slight random offset for stacking visual
        y: window.innerHeight / 2 - 50 + Math.random() * 100 - 50,
        rotateWobble: [Math.random() * 10 - 5, Math.random() * 10 - 5],
        zIndex: 5 + Math.floor(Math.random() * 5), // Random zIndex for stacking
      } : {}}
      whileTap={{ scale: 0.95 }} // Slight squish on tap
      style={{
        position: "absolute",
        cursor: "grab",
        width: 100,
        height: 100,
        borderRadius: "10px", // Assuming stickers are somewhat rounded
        transformOrigin: "center center",
      }}
      className="flex items-center justify-center bg-gray-700/50" // Placeholder for holographic effect
    >
      <img src={src} alt="sticker" className="w-full h-full object-contain" />
    </motion.div>
  );
};

export const StickerStackInteraction = () => {
  const [stickers, setStickers] = useState([
    { id: "hello", src: "/path/to/hello.png", initialX: 50, initialY: 50, isStacked: false },
    { id: "dog", src: "/path/to/dog.png", initialX: 200, initialY: 80, isStacked: false },
    { id: "wwdc", src: "/path/to/wwdc.png", initialX: 100, initialY: 200, isStacked: false },
    { id: "donut", src: "/path/to/donut.png", initialX: 300, initialY: 250, isStacked: false },
    { id: "skull", src: "/path/to/skull.png", initialX: 450, initialY: 150, isStacked: false },
    { id: "eyes", src: "/path/to/eyes.png", initialX: 500, initialY: 300, isStacked: false },
  ]);

  const handleStack = (idToStack) => {
    setStickers((prevStickers) =>
      prevStickers.map((s) => (s.id === idToStack ? { ...s, isStacked: true } : s))
    );
  };

  return (
    <div
      className="w-full h-screen bg-black relative overflow-hidden" // Assuming black background from video
    >
      <AnimatePresence>
        {stickers.map((sticker) => (
          <Sticker
            key={sticker.id}
            id={sticker.id}
            src={sticker.src} // Replace with actual sticker image paths
            initialX={sticker.initialX}
            initialY={sticker.initialY}
            onStack={handleStack}
            isStacked={sticker.isStacked}
          />
        ))}
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