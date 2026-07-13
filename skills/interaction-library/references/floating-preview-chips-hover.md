---
version: beta-v2
name: floating-preview-chips-hover
name_zh: "浮动预览卡片悬停"
cover_video: "../assets/floating-preview-chips-hover.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/floating-preview-chips-hover.mp4"
tags: ["Elastic", "Hover", "Button"]
preview: { backgroundColor: "#FFFFFF", textColor: "#333333" }
description: >
  这是一个带有预览功能的悬停动效。当鼠标悬停在卡片（或称“芯片”）上时，卡片会平滑地浮起并略微放大，同时卡片内部的文本内容被一个立体风格的预览图替换。移开鼠标时，卡片和内容平滑恢复到初始状态。
  触发词：[浮动卡片、预览切换、弹性悬停、内容替换]
website: "https://x.com/nitishkmrk/status/2073657126174507116"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "40ms" # 用于内部元素切换的微小延迟

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    # 针对预览图片（Preview Image）的生命周期动画
    initial: { opacity: 0, scale: 0.9, y: 15, filter: "blur(4px)" } # 预览图初始隐藏状态
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } # 预览图显示状态
    exit: { opacity: 0, scale: 0.9, y: -10, filter: "blur(2px)" } # 预览图退出状态
---

# 浮动预览卡片悬停 / Floating Preview Chips Hover Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 当鼠标悬停时，整个卡片以柔和的弹性动效平滑地浮起并放大。同时，卡片内部的内容区域会进行快速的交叉淡入淡出，将原有文本或图标替换为一个带有微弱模糊到清晰过渡的立体预览图。移开鼠标时，所有元素同样以平滑的弹性回弹至初始状态。
- **Interaction Flow**: Hover -> Card scales up (1.0 -> 1.05) and lifts up (translateY: 0 -> -10px); Simultaneously, original content fades out, and preview image fades in and scales up (0.9 -> 1.0). Mouse Leave -> All elements smoothly reverse to initial state.

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - Chip Wrapper)
  - 负责整体的浮起 (translateY) 和缩放 (scale) 动效。
  - 应用 `transform_origin: center center` 以确保缩放居中。
- **[Child Node A]** (`div` - Original Content / Text/Icon)
  - 在悬停时淡出 (`opacity: 1 -> 0`)。
- **[Child Node B]** (`div` - Preview Image)
  - 在悬停时淡入 (`opacity: 0 -> 1`)，并从略小的尺寸和轻微的Y轴偏移处缩放至正常大小，同时伴随模糊渐变为清晰 (`filter: blur(Xpx) -> 0px`)。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 350ms] Hover In Phase**:
  - **Chip Wrapper**:
    - `translateY` 从 `0px` 动画到 `-10px`，使用 `PRESET_SPRING_SMOOTH`。
    - `scale` 从 `1.0` 动画到 `1.05`，使用 `PRESET_SPRING_SMOOTH`。
  - **Original Content**:
    - `opacity` 从 `1` 动画到 `0`，持续 `150ms`，使用 `cubic-bezier(0.4, 0, 0.2, 1)`。
  - **Preview Image**:
    - `opacity` 从 `0` 动画到 `1`，`scale` 从 `0.9` 动画到 `1`，`y` 从 `15px` 动画到 `0px`，`filter: blur(4px)` 动画到 `blur(0px)`。此动画在主 Wrapper 动画开始后约 `40ms` 启动，使用 `PRESET_SPRING_SMOOTH`。
- **[350ms+] Hover Out Phase**:
  - 所有元素平滑反向动画，回到初始状态，使用 `PRESET_SPRING_SMOOTH`。Preview Image 使用 `exit` variants 定义。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2. **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3. **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4. **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Complete production-ready implementation of 浮动预览卡片悬停
// Assuming React + Tailwind CSS + Framer Motion as default framework and styling system.
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Variants for the preview image's appearance/disappearance
const previewVariants = {
  initial: { opacity: 0, scale: 0.9, y: 15, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.04, // Stagger delay for content inside chip
      ...physicsConfig,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    filter: "blur(2px)",
    transition: {
      ease: [0.16, 1, 0.3, 1], // Fallback easing for exit
      duration: 0.25,
    },
  },
};

interface ChipProps {
  text: string;
  icon: React.ReactNode;
  previewImageSrc: string;
  altText: string;
}

export const FloatingPreviewChip: React.FC<ChipProps> = ({
  text,
  icon,
  previewImageSrc,
  altText,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ y: 0, scale: 1 }}
      whileHover={{ y: -10, scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={physicsConfig}
      style={{ transformOrigin: "center center" }}
      className="relative w-40 h-28 flex items-center justify-center rounded-2xl bg-white p-4 cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <AnimatePresence mode="wait">
        {isHovered ? (
          <motion.div
            key="preview"
            variants={previewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex items-center justify-center p-2"
          >
            <img
              src={previewImageSrc}
              alt={altText}
              className="w-full h-full object-contain"
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }} // Keep content visible when not hovered
            exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }} // Quick fade out on exit
            className="flex flex-col items-center gap-1 text-center"
          >
            {icon}
            <span className="text-gray-800 text-sm font-semibold">{text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Example Usage (for demonstration, not part of the component itself)
const ExampleChipsGrid = () => (
  <div className="flex flex-wrap gap-4 p-8 bg-gray-100">
    <FloatingPreviewChip
      text="Yarn"
      icon={<span className="text-3xl">🧶</span>}
      previewImageSrc="https://via.placeholder.com/150/FFDDC1/FF8C00?text=Yarn"
      altText="Yarn Preview"
    />
    <FloatingPreviewChip
      text="Charcoal"
      icon={<span className="text-3xl">⚫</span>}
      previewImageSrc="https://via.placeholder.com/150/555555/FFFFFF?text=Charcoal"
      altText="Charcoal Preview"
    />
    <FloatingPreviewChip
      text="Gloss"
      icon={<span className="text-3xl">✨</span>}
      previewImageSrc="https://via.placeholder.com/150/ADD8E6/0000FF?text=Gloss"
      altText="Gloss Preview"
    />
    {/* Add more chips as needed */}
  </div>
);
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