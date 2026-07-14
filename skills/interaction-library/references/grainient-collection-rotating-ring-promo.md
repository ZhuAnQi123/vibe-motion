---
version: beta-v2
name: grainient-collection-rotating-ring-promo
name_zh: "渐变纹理圆环宣传动效"
cover_video: "../assets/grainient-collection-rotating-ring-promo.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/grainient-collection-rotating-ring-promo.mp4"
tags: ["Carousel", "Abstract", "Fluid"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  这是一个展示全新渐变纹理系列产品的宣传动效。一系列色彩鲜艳、具有流体光泽的方形渐变纹理卡片，在一个黑色背景的3D空间中形成一个连续旋转的圆环。卡片在旋转过程中保持平滑的轨迹，表面光泽随视角变化而流动，营造出一种高端、科技感的视觉体验。核心文案“NEW GRAINIENT COLLECTION ADDED”位于圆环中央，清晰醒目。
  触发词：[连续旋转、渐变纹理、流体光泽、3D圆环]
website: "https://x.com/basit_designs/status/2070901935369277775"

motion_tokens:
  selected_preset: "PRESET_EASE_IN_OUT"
  transform_origin: "center center"
  stagger_delay: "0ms" # 连续旋转，无单独子元素出现延迟

  active_physics: {} # N/A for ease presets
  css_fallback_easing: "cubic-bezier(0.4, 0, 0.2, 1)"
  duration: "3000ms" # 估算一个完整旋转周期

  variants:
    initial: { opacity: 0, scale: 0.9, rotateY: -15 } # 环形整体入场前状态
    animate: { opacity: 1, scale: 1, rotateY: 0, transition: { duration: 0.8, ease: "easeOut" } } # 环形整体入场动画
    # 注意：视频中是连续循环旋转，单个卡片的appear/exit不明显，这里主要描述整体环的出现。
---

# 渐变纹理圆环宣传动效 / Grainient Collection Rotating Ring Promo Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Linear-Smooth
- **Core Experience**: 圆环由多个色彩鲜艳、表面光滑如液体的渐变纹理卡片组成，在深色背景下以平滑、连续的轨迹在三维空间中旋转。卡片在旋转时，其表面的光泽和色彩深度会随观看角度产生细微而流畅的变化，营造出一种动态且富有未来感的视觉感受。整体动效旨在突出产品的高级质感和独特的视觉吸引力。
- **Interaction Flow**: 该动效为连续循环播放，无用户交互触发。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - Rotating Ring Wrapper)
  - 承载整个旋转圆环，负责其3D变换和旋转动画。
  - 应用 `transform_origin: "center center"`。
- **[Child Node]** (`motion.div` - Gradient Tile)
  - 构成圆环的单个渐变纹理卡片。
  - 每个卡片都具有独特的渐变和流体光泽视觉效果。
  - 在父容器的旋转动画中，每个子节点会随之移动，并可能基于其在圆环中的位置（如靠近观察者时）进行微小的深度或光泽调整。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 800ms] Initial Reveal**:
  - `Rotating Ring Wrapper` 及其内部 `Gradient Tiles` 从 `opacity: 0, scale: 0.9, rotateY: -15` 状态，平滑过渡到 `opacity: 1, scale: 1, rotateY: 0`。此阶段使用 `easeOut` 缓动，持续 `800ms`。
- **[800ms - ∞] Continuous Rotation Phase**:
  - `Rotating Ring Wrapper` 开始沿其Y轴进行连续、线性的3D旋转。一个完整旋转周期估算为 `3000ms`，并无限重复。
  - `Gradient Tiles` 随 `Rotating Ring Wrapper` 整体旋转，其表面光泽和色彩在旋转过程中持续更新，模拟光照变化。

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
import { motion } from "framer-motion";

// Define animation properties for the continuous rotation of the ring
const ringRotationVariants = {
  initial: { opacity: 0, scale: 0.9, rotateY: -15 },
  animate: {
    opacity: 1,
    scale: 1,
    rotateY: 360, // Animate to 360 for continuous loop
    transition: {
      opacity: { duration: 0.8, ease: "easeOut" },
      scale: { duration: 0.8, ease: "easeOut" },
      rotateY: {
        duration: 3, // 3 seconds per rotation cycle
        ease: "linear", // Continuous rotation is linear
        repeat: Infinity, // Loop indefinitely
      },
    },
  },
};

// Styles for an individual gradient tile, representing its visual properties
const gradientTileStyle = {
  width: "150px", // Example size
  height: "150px", // Example size
  borderRadius: "20px",
  background: "linear-gradient(135deg, #FF6B6B, #4D4AEB, #20E3B2)", // Example vibrant gradient
  // Additional properties to simulate gloss/fluidity could involve overlay elements or complex shaders
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: "1.2rem",
  fontWeight: "bold",
  textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
};

export const GrainientRingPromo = () => {
  // In a full implementation, you'd dynamically position multiple tiles around a circle
  // and apply their individual rotational offsets.
  // This example focuses on the overall ring motion and a single tile's appearance.

  const tiles = Array.from({ length: 8 }, (_, i) => i); // Example 8 tiles

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1000px", // For 3D effect
        overflow: "hidden", // Hide parts of the tiles if they go out of bounds
      }}
    >
      <motion.div
        variants={ringRotationVariants}
        initial="initial"
        animate="animate"
        style={{
          position: "relative",
          width: "400px", // Diameter of the ring
          height: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transformStyle: "preserve-3d", // Crucial for child 3D rotations
        }}
      >
        {tiles.map((_, index) => (
          <motion.div
            key={index}
            style={{
              ...gradientTileStyle,
              position: "absolute",
              // Distribute tiles around the circle. Each tile will have its own rotation
              // This part would be calculated dynamically in a real component to place them.
              // For simplicity, we place one at the "front" visually and suggest others.
              transform: `rotateY(${index * (360 / tiles.length)}deg) translateZ(200px)`, // Position around the circle
            }}
            // Individual tiles don't have separate initial/animate states here,
            // they move as part of the parent ring's rotation.
            // If they had micro-animations, they'd go here.
          >
            Tile {index + 1}
          </motion.div>
        ))}
      </motion.div>
      {/* Central Text Element */}
      <div
        style={{
          position: "absolute",
          color: "white",
          fontSize: "3rem",
          fontWeight: "bold",
          textAlign: "center",
          letterSpacing: "-0.05em",
          zIndex: 10,
        }}
      >
        NEW GRAINIENT <br /> COLLECTION ADDED
      </div>
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