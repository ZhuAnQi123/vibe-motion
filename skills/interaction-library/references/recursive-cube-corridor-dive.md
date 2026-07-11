---
version: beta-v2
name: recursive-cube-corridor-dive
name_zh: "递归空心立方体走廊潜行"
cover_video: "../assets/recursive-cube-corridor-dive.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/recursive-cube-corridor-dive.mp4"
tags: ["Elastic", "Reveal"]
preview: { backgroundColor: "#D3D3D3", textColor: "#333333" }
description: >
  这是一个迷人的 3D 运动研究，展示了一个递归的空心立方体在无限几何走廊中平滑、连续地移动和旋转。
  动画通过流畅的摄像机运镜和对象自身的微动，创造出一种深邃且富有结构层次的视觉体验，强调递归美学与空间流动感。
  触发词：[3D动画, 递归结构, 几何抽象, 空间潜行, 流体运动]
website: "https://x.com/jn3008/status/1345852769681469441"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms" # 这是一个连续动画，没有明确的子元素交错出现

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.4, 0, 0.2, 1)" # For continuous, non-spring like motions
  duration: "8000ms" # Represents a full loop cycle

  variants:
    initial: { opacity: 1 } # Continuous animation, conceptual states for a looping component
    animate: { opacity: 1 }
    exit: { opacity: 0 }
---

# 递归空心立方体走廊潜行 / Recursive Cube Corridor Dive Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic (指其运动的连续性和平滑性，而非用户触发的弹性回弹)
- **Core Experience**: 这个动效的核心体感是一种沉浸式的空间探索。一个递归的空心立方体在纯净、无限的几何空间中以持续、流畅的姿态移动和旋转。摄像机运镜与立方体的运动协同，创造出一种平静而引人入胜的视觉节奏，没有明显的开始或结束，更像是一个循环播放的冥想式动态画面。
- **Interaction Flow**: 本动效是一个非交互式的 3D 运动研究。它的“流程”是一个连续循环的动画，不依赖于用户输入。动效通过物体和摄像机的持续位移、旋转和透视变化来展现其视觉叙事。

## 2. Component DOM Mapping (元素与动效节点映射)

*_Vision-Agent: 本动效是一个复杂的 3D 渲染场景，而非典型的 web UI 组件。以下映射是基于对场景中关键视觉元素的抽象，以提供Framer Motion的概念性实现方式。一个完整的复刻需要 3D 引擎（如 Three.js, Blender）._*

- **[Root Scene Container]** (`div` - 假想的整个 3D 场景或画布)
  - 承载所有的 3D 元素和摄像机视图。其动效主要是摄像机（或全局视图）的连续平移和旋转。
- **[Recursive Hollow Cube - Outer]** (`motion.div` - 外层空心立方体)
  - 连续的旋转 (around X, Y, Z axes) 和位移 (沿 Z 轴或其他轴)，模拟在走廊中穿梭。
  - 应用透视效果，其运动速度和旋转轴心与摄像机保持协调。
- **[Recursive Hollow Cube - Inner]** (`motion.div` - 内层空心立方体)
  - 与外层立方体同步进行旋转和位移，但可能具有微小的相对偏移或独立的缩放/旋转因子，以增强递归感。
- **[Geometric Corridor Elements]** (`div` - 走廊的结构）
  - 通常是静态或与摄像机同步移动的几何体，构成背景环境。本例中通过摄像机在几何结构中穿梭来“揭示”它们。

## 3. Detailed Timeline Sequence (时序编排)

*_Vision-Agent: 本动画是一个连续循环的运动，没有明确的“触发”和“结束”阶段。以下是基于一个假想的完整循环的描述，持续时间约为 8 秒。_*

- **[0ms - 8000ms (Loop)] Continuous Motion Phase**:
  - **Global Camera/View**: 摄像机或全局透视以平滑的缓动曲线（接近 `ease-in-out` 或自定义三次贝塞尔曲线）进行连续的 Z 轴平移（深入走廊），并伴随轻微的 Y 轴或 Z 轴旋转，创造出穿梭和转向的错觉。整个过程是一个无缝循环。
  - **Outer Cube Animation**:
    - **Rotation**: 沿 X、Y 轴或两者以不同的角速度持续旋转，模拟其在空间中的翻滚。例如，`rotateX: [0, 360], rotateY: [0, 180]` 循环。
    - **Translation**: 沿 Z 轴（与摄像机运动方向相同或相反，形成相对位移感）进行小幅度来回平移，或在局部空间内进行微小的“浮动” (`translateY: [0, 5, 0]`)，增加动态感。
    - **Scale**: 可能伴随微小的缩放变化，增强景深感。
  - **Inner Cube Animation**:
    - **Synchronization**: 与外层立方体保持高度同步，但可能具有微小的相位差或不同的旋转速度/方向，以维持其“内部”特性。
    - **Relative Motion**: 相对外层立方体进行微小的独立旋转或浮动。
  - **Timing**: 所有动画元素都采用连续、循环的动画设置，通过缓动函数保证过渡的流畅性，避免任何突兀的帧。`PRESET_SPRING_SMOOTH` 的物理特性在这里用于描述其运动的平滑和受控感，而非弹性回弹。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2. **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3. **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4. **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

*_Vision-Agent: 本视频展示的是复杂的 3D 渲染动画，通常使用 Three.js、WebGL 或专用 3D 软件制作。以下 Framer Motion 代码示例旨在概念性地模拟其中一个立方体的连续运动和旋转，而非完全复刻整个 3D 场景。_*

```tsx
// This code assumes React + Tailwind CSS + Framer Motion.
import React from "react";
import { motion } from "framer-motion";

// 定义用于连续循环动画的物理配置
const continuousPhysics = {
  duration: 8, // 循环一次的持续时间，单位秒
  ease: "easeInOut", // 平滑过渡，使循环更自然
  repeat: Infinity,
  repeatType: "loop",
};

export const RecursiveCubeAnimation = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100 overflow-hidden relative">
      {/* 模拟几何走廊的背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-white -z-10" />

      {/* 外层空心立方体 */}
      <motion.div
        className="relative w-48 h-48 border-4 border-gray-400 flex justify-center items-center"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 180],
          y: [0, 10, 0], // 模拟轻微浮动
          transition: {
            ...continuousPhysics,
            rotateY: { ...continuousPhysics, duration: 10 }, // Y轴旋转稍慢
            rotateX: { ...continuousPhysics, duration: 8 }, // X轴旋转
            y: { ...continuousPhysics, duration: 4, ease: "linear" }, // 浮动速度
          },
        }}
      >
        {/* 内层空心立方体 */}
        <motion.div
          className="w-24 h-24 border-2 border-gray-600 flex justify-center items-center"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: [0, -360], // 反向旋转
            rotateX: [0, -180], // 反向旋转
            z: [0, 5, 0], // 模拟内部相对位移
            transition: {
              ...continuousPhysics,
              rotateY: { ...continuousPhysics, duration: 12 },
              rotateX: { ...continuousPhysics, duration: 9 },
              z: { ...continuousPhysics, duration: 3, ease: "linear" },
            },
          }}
        >
          {/* 模拟内层立方体内部的一个小点或元素 */}
          <motion.div
            className="w-2 h-2 bg-gray-800 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
              transition: { ...continuousPhysics, duration: 2 },
            }}
          />
        </motion.div>
      </motion.div>

      {/* 简单的走廊线条效果 */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-gray-300 to-transparent"
        initial={{ y: "100%" }}
        animate={{
          y: ["100%", "-100%"],
          transition: { ...continuousPhysics, duration: 20, ease: "linear" }, // 模拟场景移动
        }}
      />
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