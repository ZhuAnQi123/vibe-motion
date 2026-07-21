---
version: beta-v2
name: stamp-detail-expand
name_zh: "邮票详情展开动效"
cover_video: "../assets/stamp-detail-expand.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/stamp-detail-expand.mp4"
tags: ["Elastic", "Click", "Card"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  这是一个邮票卡片详情展开动效。当用户点击一张邮票时，该邮票会平滑地放大并移动到屏幕中央，同时背景色从浅色过渡到深色，创造沉浸式的详情展示体验。展开过程带有流畅的弹性阻尼感。
  触发词：[邮票展开、全屏卡片、沉浸式详情、弹性缩放]
website: "https://x.com/loficosmos1/status/2076867314062946408"

assets:
  required: true
  items:
    - name: "Stamp Image with Shader"
      type: "WebGL Shader / Image"
      description: "完成该动效必需的邮票视觉元素，其表面应用了自定义 WebGL 着色器，以渲染出带有 UV 印刷效果的油画厚涂纹理和斑驳的光影效果。"
  dependencies:
    - "framer-motion@^11.0.0"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms" # Note: Duration for spring is approximate, controlled by physics

  variants:
    initial: { scale: 1, x: 0, y: 0, backgroundColor: "#F7F7F7" } # Resting state of the stamp, assumed light background
    expanded: { scale: 1.5, x: "calc(50vw - 50%)", y: "calc(50vh - 50%)", backgroundColor: "#171717" } # Expanded state, scale and position to fill screen, dark background
    exit: { scale: 1, x: 0, y: 0, backgroundColor: "#F7F7F7" } # Revert to initial state
---

# 邮票详情展开动效 / Stamp Detail Expand Specification & Implementation Protocol

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

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 用户点击一张邮票后，邮票会以流畅、带有弹性回弹的动效放大并居中，同时页面背景色从浅色优雅地过渡到深色，营造出沉浸式的详情查看体验。
- **Interaction Flow**:
    1.  **Initial**: 邮票以较小尺寸在页面中呈现。
    2.  **Click**:
        *   邮票（主容器）开始放大并移动到屏幕中心。
        *   页面背景色从浅色 (`#F7F7F7`) 变为深色 (`#171717`)。
        *   邮票的放大和移动遵循 `PRESET_SPRING_SMOOTH` 的物理曲线。
    3.  **Close (Implied)**: 点击关闭按钮或空白处，邮票收缩回初始位置，背景色恢复。

## 2. Component DOM Mapping (元素与动效节点映射)

-   **[Parent Container]** (`div` - Stamp Wrapper)
    -   包裹邮票图像及可能的文字内容。
    -   应用 `transform_origin: "center center"`。
    -   负责自身的 `scale` 和 `translate` 变换。
    -   同时驱动或受控于页面的 `backgroundColor` 变化。
-   **[Child Node]** (`img` or `div` with WebGL Canvas - Stamp Visual)
    -   邮票的主体视觉元素，包含 WebGL 着色器效果。
    -   通常作为 Parent Container 的直接子元素，随 Parent Container 一起变换。

## 3. Detailed Timeline Sequence (时序编排)

-   **[0ms] Trigger Phase (Click)**:
    -   用户点击邮票。
-   **[0ms - ~350ms (Spring Dependent)] Main Expansion**:
    -   Parent Container (Stamp Wrapper) 开始以 `PRESET_SPRING_SMOOTH` 的物理效果进行以下变换：
        -   `scale` 从 `1` 放大到 `1.5` (或更大以适应全屏)。
        -   `x` 和 `y` 位置从当前位置移动到屏幕中心 (`calc(50vw - 50%)`, `calc(50vh - 50%)`)。
        -   `backgroundColor` 从 `#F7F7F7` 过渡到 `#171717` (此背景色变换可由父组件或全局状态控制)。
-   **[Exit Phase] Dismiss Sequence (Implied Close)**:
    -   反向动画，邮票收缩回原始位置和大小，背景色恢复为浅色，也应遵循 `PRESET_SPRING_SMOOTH`。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json was not accessible.

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Insert custom physics from motion_tokens
const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// This component assumes it's one of multiple stamps.
// When clicked, it expands to fill a larger portion of the screen,
// and the surrounding environment's background changes.
export const StampDetailExpand = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // A simple way to handle background change, in a real app this might be global state
  const appBackgroundColor = isExpanded ? "#171717" : "#F7F7F7";

  return (
    <div
      className="flex items-center justify-center min-h-screen transition-colors duration-300"
      style={{ backgroundColor: appBackgroundColor }}
    >
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            key="expanded-stamp"
            initial={{ scale: 1, x: 0, y: 0, opacity: 0 }}
            animate={{
              scale: 1.5,
              x: "calc(50vw - 50%)", // Adjust based on the actual stamp size and desired fill
              y: "calc(50vh - 50%)",
              opacity: 1,
              transition: { ...physicsConfig, delay: 0.1 }, // Add slight delay for background to catch up
            }}
            exit={{
              scale: 1,
              x: 0,
              y: 0,
              opacity: 0,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
            style={{
              transformOrigin: "center center",
              width: "200px", // Example width, adjust as needed
              height: "200px", // Example height, adjust as needed
              position: "fixed", // To allow moving to screen center
              zIndex: 50,
              cursor: "pointer",
            }}
            onClick={() => setIsExpanded(false)}
            className="flex items-center justify-center border border-white/20 rounded-lg p-4 shadow-xl"
          >
            {/* Replace with your actual stamp image/WebGL canvas */}
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold">NEW CRAFT SOCIETY</h2>
              <p className="text-sm mt-2">01/2025</p>
              <p className="text-xs mt-4">Click to close</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="initial-stamp"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            whileHover={{ scale: 1.05, transition: physicsConfig }}
            onClick={() => setIsExpanded(true)}
            style={{
              transformOrigin: "center center",
              width: "120px", // Initial smaller size
              height: "120px",
              cursor: "pointer",
              // Simulating the shader texture with a gradient/pattern
              background: "linear-gradient(45deg, #a7e4b1, #7dc28c)",
              boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
            }}
            className="relative flex flex-col items-center justify-center border border-gray-300 rounded-lg overflow-hidden"
          >
            {/* Stamp content */}
            <p className="absolute top-2 left-2 text-xs font-mono text-gray-700">NEW CRAFT SOCIETY</p>
            <div className="w-full h-full flex items-center justify-center p-2">
              {/* This is where your WebGL shader or image would go */}
              <span className="text-sm font-bold text-gray-800">MAP</span>
            </div>
            <p className="absolute bottom-2 right-2 text-xs font-mono text-gray-700">01/2025</p>
            <motion.div
                className="absolute -top-6 bg-black text-white px-2 py-1 text-xs rounded-full"
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ pointerEvents: 'none' }} // Prevent it from blocking click
            >
                NEW CRAFT SOCIETY
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```
