---
version: beta-v2
name: plot-device-activation
name_zh: "情节装置激活"
cover_video: "../assets/plot-device-activation.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/plot-device-activation.mp4"
tags: ["Button", "Click"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  一个机械装置的激活动效。一个红色的按钮方块被按下时，会向内滑动并带有一个清脆的机械回弹感。
  紧接着，一个红色的指示点会沿着透明轨道迅速移动到目标位置，整个过程精准而富有科技感。
  触发词：[机械激活、按钮回弹、指示灯移动]
website: "https://x.com/reijowrites/status/2078226632481898551"

assets:
  required: true
  items:
    - name: "Device 3D Render"
      type: "Image/Video"
      description: "完整的3D渲染图片或视频，包含装置主体、红色按钮方块和透明指示轨道。"
  dependencies:
    - "framer-motion@^11.0.0"

motion_tokens:
  selected_preset: "PRESET_SPRING_STIFF"
  transform_origin: "center center"
  stagger_delay: "80ms" # Red dot starts moving 80ms after button's primary motion initiates

  active_physics:
    stiffness: 500
    damping: 40
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)" # For general smooth deceleration
  duration: "150ms" # Duration for the main spring animation of the button
---

# 情节装置激活 / Plot Device Activation Specification & Implementation Protocol

## 0. 准备工作 (Prerequisite Check - MUST READ)

> **⚠️ 核心指令（针对 AI Assistant）：**
> 在阅读下方具体的动效规范前，你必须首先检查用户当前的项目上下文中是否已准备好以下前置条件：
> - [ ] **依赖项检查**：项目中是否安装了 `framer-motion` 等对应库。
> - [ ] **素材检查**：提取 YAML 中的 assets 描述，检查上下文是否具备。
>
> **If (用户未提供或环境未满足)** {
>    停止生成具体的 React/CSS 动效代码;
>    直接向用户发出友好询问：“为了完美实现此动效，我需要您先提供 [具体素材描述] 并确认已安装 [依赖包]...”
> } **Else** {
>    继续按照下方的动效规范，完美还原物理插值曲线。
> }

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Snappy-Mechanical
- **Core Experience**: This interaction simulates the activation of a sophisticated mechanical "plot device". A prominent red button block is pressed, sliding inward with a swift, firm, and responsive mechanical feel, almost like engaging a toggle switch. Immediately after, a small, vibrant red indicator dot illuminates and glides along a clear, confined track to a designated "active" position. The overall impression is one of precision, decisive action, and technical engagement.
- **Interaction Flow**: The primary interaction is a "click" or "press" action on the red square button.
    1.  **Button Engagement**: The red square button visually translates horizontally (moves left) into the device body, accompanied by a quick, stiff spring animation.
    2.  **Indicator Activation**: A short delay after the button engagement, a red indicator dot becomes visible and slides smoothly along its track to a final position, signifying the device's activated state.

## 2. Component DOM Mapping (元素与动效节点映射)

_Vision-Agent: Map the visual elements in the video to a virtual DOM structure before defining motion._

-   **[Main Device Container]** (e.g., `div` - Encapsulating the entire device visualization)
    -   Acts as the primary viewport for the interaction.
-   **[Red Square Button]** (e.g., `motion.div` - The interactive red block on the left)
    -   Animates `x` (horizontal translation) based on activation state.
-   **[Red Indicator Dot]** (e.g., `motion.div` - The small red circle on the right track)
    -   Animates `x` (horizontal translation) and `opacity` based on activation state.
-   **[Static Device Elements]** (e.g., `div` - The metallic body, dials, and track)
    -   These elements remain static during the animation, serving as the visual context.

## 3. Detailed Timeline Sequence (时序编排)

_Vision-Agent: Define the exact motion sequence in milliseconds based on video analysis._

-   **[0ms - 150ms] Button Engage Phase**:
    -   **Red Square Button**: On activation, it translates `x` from its initial position (`0`) to `-10px` (inward) using `PRESET_SPRING_STIFF` (`stiffness: 500, damping: 40, mass: 1`). This provides the snappy, mechanical "click" feel.
-   **[80ms - 400ms] Indicator Activation Phase**:
    -   **Red Indicator Dot**: With a `stagger_delay` of `80ms` after the button begins its movement, the dot transitions from `opacity: 0` and `x: -20px` (off-track left) to `opacity: 1` and `x: 30px` (active position on track). This motion should use a `cubic-bezier(0.16, 1, 0.3, 1)` easing for a smooth, decisive slide and settle over approximately `320ms`.
-   **[Exit Phase] De-activation Sequence (Reversal)**:
    -   Upon a de-activation trigger, both animations reverse to their initial states.
    -   **Red Indicator Dot**: Translates back to `x: -20px` and fades out (`opacity: 0`).
    -   **Red Square Button**: Translates back to `x: 0px` (initial position).
    -   Both exit animations should ideally use a `cubic-bezier(0.4, 0, 0.2, 1)` (standard ease-in-out) with a duration of `200ms` for a quick, clean reset.

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
// Defaulting to React + Tailwind CSS + Framer Motion as package.json was not accessible.

import React, { useState } from "react";
import { motion } from "framer-motion";

const buttonPhysics = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 1,
};

const dotEase = [0.16, 1, 0.3, 1]; // cubic-bezier for smooth deceleration
const exitEase = [0.4, 0, 0.2, 1]; // standard ease-in-out for exit

export const PlotDeviceActivation = () => {
  const [isActive, setIsActive] = useState(false);

  const handleActivate = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div
      className="relative flex items-center justify-center p-8 bg-black min-h-screen"
      style={{ overflow: "hidden" }} // Prevents potential clipping if elements move outside bounds
    >
      {/* This is a structural placeholder for the actual device render.
          In a real implementation, this would be your 3D model, image, or complex SVG.
          We're just showing the interactive parts on top for motion demo. */}
      <div className="relative w-[500px] h-[180px] bg-gray-700 rounded-xl flex items-center justify-between p-4 border border-gray-600 shadow-lg">
        {/* Placeholder for left static elements and the slot for the red button */}
        <div className="absolute top-0 left-0 w-[160px] h-full bg-gray-800 rounded-l-xl flex items-center justify-center">
          <div className="grid grid-cols-2 gap-2 p-2">
            <div className="w-8 h-8 rounded-full bg-gray-600 opacity-70"></div>
            <div className="w-8 h-8 rounded-full bg-gray-600 opacity-70"></div>
            <div className="w-8 h-8 rounded-full bg-gray-600 opacity-70"></div>
            <div className="w-8 h-8 rounded-full bg-gray-600 opacity-70"></div>
          </div>
        </div>

        {/* Red Square Button */}
        <motion.div
          className="absolute left-[130px] w-20 h-20 bg-red-600 rounded-md cursor-pointer flex items-center justify-center"
          initial={false}
          animate={{ x: isActive ? -10 : 0 }}
          transition={buttonPhysics}
          onClick={handleActivate}
          style={{ zIndex: 10 }}
        >
          <div className="w-8 h-8 rounded-full bg-red-800 opacity-50"></div>
        </motion.div>

        {/* Placeholder for middle dials */}
        <div className="absolute left-[200px] flex gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-600 border border-gray-500"></div>
          <div className="w-16 h-16 rounded-full bg-gray-600 border border-gray-500"></div>
        </div>

        {/* Indicator Track and Red Dot */}
        <div
          className="absolute right-4 w-[120px] h-10 border border-gray-500 rounded-full flex items-center overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)", zIndex: 5 }}
        >
          <motion.div
            className="w-5 h-5 bg-red-500 rounded-full"
            initial={{ x: -20, opacity: 0 }}
            animate={isActive ? { x: 30, opacity: 1 } : { x: -20, opacity: 0 }}
            transition={{
              x: {
                delay: isActive ? 0.08 : 0, // Stagger delay
                ease: dotEase,
                duration: isActive ? 0.32 : 0.2, // Longer duration for dot travel
              },
              opacity: {
                delay: isActive ? 0.08 : 0, // Stagger delay
                ease: exitEase,
                duration: isActive ? 0.1 : 0.2, // Quicker fade-in, longer fade-out
              },
            }}
            style={{ position: "absolute", left: "0", top: "50%", translateY: "-50%" }}
          />
        </div>
      </div>
    </div>
  );
};
```