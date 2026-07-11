---
version: beta-v2
name: toggle-switch-glossy-pastel
name_zh: "光泽柔和开关动效"
cover_video: "../assets/toggle-switch-glossy-pastel.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/toggle-switch-glossy-pastel.mp4"
tags: ["Elastic", "Button", "Click"]
preview: { backgroundColor: "#F0F0F0", textColor: "#333333" }
description: >
  这是一个带有光泽感和柔和3D阴影的切换开关动效。当开关被激活时，内部按钮从红色平滑滑动到绿色，并伴有轻微的弹性回弹，轨道颜色也随之过渡。整个动效呈现出简洁、现代的软UI风格。
  触发词：[软UI开关、弹性滑动、光泽按钮、状态切换]
website: "https://x.com/ZaydenSaaSgtfs/status/2070070246577422705"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms" # Not applicable for this single component's primary action

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    # Note: These variants are for the toggle component itself if it were to enter/exit the DOM.
    # The primary toggle interaction (on/off) is handled by 'x' translation and color properties.
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" }
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# 光泽柔和开关动效 / Glossy Pastel Toggle Switch Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: A glossy toggle switch interaction with soft 3D shading. The switch thumb slides smoothly across the track, accompanied by a subtle elastic bounce upon reaching its destination. The track color transitions fluidly from a light pastel red to a light pastel green, enhancing the soft UI aesthetic.
- **Interaction Flow**: Click/Tap on the toggle switch -> The thumb slides horizontally (e.g., from OFF position to ON position, or vice versa) -> The toggle track's background color updates simultaneously -> Both animations utilize a fluid spring physics for a soft, elastic rebound when the thumb settles.

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - Toggle Wrapper)
  - Represents the overall oval shape of the toggle switch.
  - Contains the toggle track and the moving thumb.
  - Applies a subtle outer shadow and border for a soft UI look.
- **[Child Node A]** (`div` - Toggle Track)
  - The inner background oval of the switch.
  - Its `background-color` transitions between the 'off' (pastel red) and 'on' (pastel green) states.
- **[Child Node B]** (`div` - Toggle Thumb)
  - The circular button that slides horizontally within the track.
  - Possesses distinct glossy highlights and shadows, giving it a 3D "bubble" appearance.
  - Its `x` (translateX) property animates, and its `background-color` also changes to reflect the state.

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 250ms] Trigger Phase (Toggle Activation)**:
  - User clicks/taps the toggle switch.
  - `Toggle Thumb` (`Child Node B`) begins to translate horizontally (`x` property) from its current position (e.g., `0px` for OFF) to the target position (e.g., `64px` for ON).
  - Simultaneously, the `Toggle Track` (`Child Node A`) smoothly transitions its `background-color` (e.g., from pastel red to pastel green).
  - The `Toggle Thumb` (`Child Node B`) also transitions its `background-color` (e.g., from main red to main green).
  - All these animations are driven by `PRESET_SPRING_SMOOTH` physics.
- **[250ms - 350ms] Settle Phase**:
  - The `Toggle Thumb` reaches its destination with a subtle, fluid elastic rebound, indicating the state change is complete.
  - The `Toggle Track` and `Toggle Thumb` color transitions fully settle into their new state colors.
- **[Exit Phase] Dismiss Sequence**: Not applicable for the primary interaction of the toggle switch. If the entire `Toggle Wrapper` component were to be removed from the DOM, it would fade out and scale down using standard exit animations as per `motion_tokens.variants.exit`.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2. **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3. **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4. **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as no package.json was provided.
import React, { useState } from "react";
import { motion } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

export const GlossyToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => setIsOn(!isOn);

  // Tailwind equivalent classes for visual dimensions and spacing
  const TRACK_WIDTH_PX = 112; // w-28
  const TRACK_HEIGHT_PX = 48; // h-12
  const THUMB_SIZE_PX = 40;   // w-10 h-10
  const PADDING_PX = 4;       // p-1

  // Calculate thumb's x position
  const thumbOnXPosition = TRACK_WIDTH_PX - THUMB_SIZE_PX - (2 * PADDING_PX); // 112 - 40 - 8 = 64px

  return (
    <motion.div
      className="relative flex items-center p-1 rounded-full cursor-pointer"
      style={{
        width: TRACK_WIDTH_PX,
        height: TRACK_HEIGHT_PX,
        // Background color transition for the track
        background: isOn
          ? "#a8f2e7" // Light pastel green for ON
          : "#ffc9c9", // Light pastel red for OFF
        border: "1px solid rgba(255,255,255,0.8)", // Soft white border
        boxShadow: "inset 0 0 5px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)", // Soft inner/outer shadow
      }}
      onClick={toggleSwitch}
      transition={physicsConfig} // Apply spring to the background color change
    >
      <motion.div
        className="absolute rounded-full"
        layout // Enable Framer Motion layout animations for smooth x-translation
        transition={physicsConfig}
        style={{
          width: THUMB_SIZE_PX,
          height: THUMB_SIZE_PX,
          // X-translation for the thumb
          x: isOn ? thumbOnXPosition : PADDING_PX,
          // Background color for the thumb
          backgroundColor: isOn
            ? "#00c4a7" // Main green for ON
            : "#ff5e5e", // Main red for OFF
          // Glossy 3D effect for the thumb
          boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 0 5px rgba(255,255,255,0.8), inset 0 0 15px rgba(255,255,255,0.2)",
        }}
      />
    </motion.div>
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