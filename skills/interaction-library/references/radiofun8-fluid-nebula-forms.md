---
version: beta-v2
name: radiofun8-fluid-nebula-forms
name_zh: "霓虹流体椭圆动效"
cover_video: "../assets/radiofun8-fluid-nebula-forms.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/radiofun8-fluid-nebula-forms.mp4"
tags: ["Reveal", "Card"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  这是一个深色抽象动效研究，两个圆角椭圆容器中流动着霓虹色的流体光晕。光晕色彩变幻，形态波动，营造出迷幻而有机的美感，像漂浮的星云。视频中未展示交互，动效为连续的视觉呈现。
  触发词：[霓虹流体, 抽象光晕, 迷幻波动]
website: "https://x.com/radiofun8/status/2068734787343528138"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms" # 两个容器各自独立，无交错延迟

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" }
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# 霓虹流体椭圆动效 / Fluid Nebula Forms Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 动画呈现了两个独立的圆角椭圆容器中持续流动、变幻的霓虹色流体光晕。内部光晕有机地波动、改变颜色和形态，创造出一种抽象、动态的视觉效果，如同液体星云或熔岩灯般迷幻而沉静。视频中未展示用户交互；此动效为持续的、自包含的视觉研究。
- **Interaction Flow**: N/A - 这是一个被动式视觉研究。如果这些容器作为UI组件，它们可能会通过平滑的流体式入场/退场动画来显示或隐藏，而内部的流体动效则保持持续。

## 2. Component DOM Mapping (元素与动效节点映射)

- **`div` - Screen Container**
  - 作为背景，颜色为纯黑色。
- **`motion.div` - Left Oval Form** (主容器，应用于入场/退场动画)
  - 样式：宽64px，高96px，圆角32px，背景色深灰，`overflow: hidden`。
  - 内部包含：
    - **`div` - Fluid Glow Layer**：实现霓虹流体效果（通过着色器、Canvas或视频纹理实现）。
    - **`svg` - Burger Icon**：白色，静态。
- **`motion.div` - Right Oval Form** (主容器，应用于入场/退场动画)
  - 样式：同左侧容器。
  - 内部包含：
    - **`div` - Fluid Glow Layer**：实现霓虹流体效果。
    - **`div` - Dotted Grid Icon**：由25个白色小圆点组成的5x5网格，静态。

## 3. Detailed Timeline Sequence (时序编排)

- **[Continuous Loop] Fluid Glow Animation**:
  - 两个椭圆容器内部的霓虹流体光晕持续进行有机波动、色彩变换（左侧以青色/品红色为主，右侧以灰度/蓝色为主）和形态转换。这是一个永恒的背景动效研究，没有明确的开始或结束阶段，视觉上无限循环。
- **[Implicit Entry/Exit] Form Reveal (假定交互触发)**:
  - 如果`Left Oval Form`和`Right Oval Form`作为UI元素入场，它们将使用`animate`状态，通过`PRESET_SPRING_SMOOTH`缓动曲线在`350ms`内平滑淡入（`opacity: 0 -> 1`）、从小尺寸放大（`scale: 0.95 -> 1`）并去除模糊效果（`filter: blur(4px) -> 0px`）。
  - 如果退场，它们将反向动画至`exit`状态。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2. **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3. **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4. **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as per rule 1.
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Custom physics from motion_tokens for the container forms
const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Variants for the container forms
const containerVariants = {
  initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: physicsConfig },
  exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)", transition: { duration: 0.2 } },
};

// Simplified conceptual component for the fluid glow.
// In a production environment, this would likely be implemented using
// WebGL shaders (e.g., Three.js, React Three Fiber), a Canvas API,
// or a pre-rendered video texture for complex, continuous fluid dynamics.
const FluidGlow = ({ colors }) => (
  <div
    className="absolute inset-0 rounded-[32px] blur-xl opacity-75"
    style={{
      background: `radial-gradient(circle at center, ${colors.join(', ')})`,
      // The actual fluid motion animation would be handled by a complex shader or canvas.
      // Below is a placeholder CSS animation for illustrative purposes.
      animation: "fluid-shift 15s infinite alternate ease-in-out",
      transformOrigin: "center center",
      backgroundSize: "200% 200%", // For gradient movement effect
    }}
  >
    {/*
    Corresponding CSS keyframes (would be in a global CSS file or utility layer):
    @keyframes fluid-shift {
      0% {
        transform: scale(1) translateX(0) translateY(0) rotate(0deg);
        background-position: 0% 0%;
      }
      25% {
        transform: scale(1.1) translateX(10%) translateY(-5%) rotate(10deg);
        background-position: 100% 0%;
      }
      50% {
        transform: scale(1.05) translateX(-10%) translateY(5%) rotate(0deg);
        background-position: 100% 100%;
      }
      75% {
        transform: scale(1.15) translateX(5%) translateY(10%) rotate(-10deg);
        background-position: 0% 100%;
      }
      100% {
        transform: scale(1) translateX(0) translateY(0) rotate(0deg);
        background-position: 0% 0%;
      }
    }
    */}
  </div>
);

export const FluidNebulaForms = () => {
  // `showForms` state is for demonstrating the AnimatePresence entry/exit.
  // In the original video, the forms are continuously present.
  const [showForms, setShowForms] = React.useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-4 gap-8">
      <AnimatePresence>
        {showForms && (
          <>
            {/* Left Oval Form */}
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ transformOrigin: "center center" }}
              className="relative w-64 h-96 rounded-[32px] overflow-hidden bg-gray-900 flex items-center justify-center"
            >
              <FluidGlow colors={["#FF00FF", "#00FFFF", "#8000FF", "#3300FF"]} />
              <div className="relative z-10 p-4">
                <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <rect y="0" width="48" height="4" rx="2" fill="currentColor"/>
                  <rect y="14" width="48" height="4" rx="2" fill="currentColor"/>
                  <rect y="28" width="48" height="4" rx="2" fill="currentColor"/>
                </svg>
              </div>
            </motion.div>

            {/* Right Oval Form */}
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ transformOrigin: "center center" }}
              className="relative w-64 h-96 rounded-[32px] overflow-hidden bg-gray-900 flex items-center justify-center"
            >
              <FluidGlow colors={["#FFFFFF", "#CCCCCC", "#0000FF", "#808080"]} />
              <div className="relative z-10 p-4 grid grid-cols-5 gap-2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white opacity-70"></div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Optional: A button to toggle visibility for demo purposes */}
      <button
        onClick={() => setShowForms(!showForms)}
        className="absolute bottom-8 px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition-colors"
      >
        Toggle Forms
      </button>
    </div>
  );
};
```