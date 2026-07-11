---
version: beta-v2
name: gear-selector-interaction
name_zh: "变速杆换挡动效"
cover_video: "../assets/gear-selector-interaction.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/gear-selector-interaction.mp4"
tags: ["Click", "Button", "Elastic"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  这是一个模拟汽车变速杆的换挡动效。用户在操作时，拨杆会以精准机械的弹性迅速卡入指定档位，并伴随清脆的物理反馈音效。同时，选定档位旁的指示灯会即时点亮，提供清晰的视觉确认。
  触发词：[换挡、变速杆、机械弹性、档位切换]
website: "https://x.com/reijowrites/status/2069505241884553295"

motion_tokens:
  selected_preset: "PRESET_SPRING_STIFF"
  transform_origin: "center center"
  stagger_delay: "0ms"

  active_physics:
    stiffness: 500
    damping: 40
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "300ms"

  variants:
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" } # Default for supporting elements
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }    # Default for supporting elements
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }   # Default for supporting elements
---

# 变速杆换挡动效 / Gear Selector Interaction Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Snappy-Mechanical
- **Core Experience**: 变速杆在每次换挡时，以精确且带有机械阻尼感的动作迅速移动到位，并伴随清脆的卡扣声。相应的档位指示灯即时点亮，强化了操作的反馈感。
- **Interaction Flow**: User drags or clicks the shifter knob to select a new gear position (P, R, N, D, S, L). The knob snaps into the new position with a robust mechanical spring effect, simulating a physical latching mechanism. The indicator light corresponding to the selected gear illuminates instantly, providing clear visual feedback.

## 2. Component DOM Mapping (元素与动效节点映射)

- **Shifter Base Container** (`div` - Outer casing of the gear gate)
  - Acts as the fixed background for the gear positions.
- **Shifter Knob** (`div` - The black spherical knob)
  - Translates precisely along the predefined "gear gate" path (X and Y coordinates).
  - Main animated element driven by user interaction.
- **Gear Indicator Lights** (`span` or `div` for P, R, N, D, S, L positions)
  - Changes `background-color` and `opacity` to indicate the currently selected gear.
  - Positioned adjacent to each gear letter.

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 150ms] Shifter Knob Movement**:
  - Upon user interaction (e.g., `onDragEnd` or `onClick` to target a gear), the Shifter Knob translates (`x`, `y`) from its current position to the new gear's target coordinates.
  - Motion: Driven by `PRESET_SPRING_STIFF` (stiffness: 500, damping: 40, mass: 1), ensuring a swift and decisive snap into place.
- **[0ms] Gear Indicator Light Activation**:
  - Concurrently with the knob reaching its new position (or with minimal delay), the target gear's indicator light immediately transitions its `background-color` (e.g., from subtle grey to vibrant green/orange/red) and `opacity` from `0` to `1`.
  - Transition: `duration: 50ms`, `ease: "linear"` for instantaneous feedback.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not accessible.
import React, { useState } from "react";
import { motion } from "framer-motion";

// Gear positions (example coordinates, actual values would depend on design)
const gearPositions = {
  P: { x: 0, y: 0, color: "#10B981" }, // Green
  R: { x: 50, y: 0, color: "#F59E0B" }, // Orange
  N: { x: 0, y: 50, color: "#3B82F6" }, // Blue
  D: { x: 50, y: 50, color: "#EF4444" }, // Red
  S: { x: 0, y: 100, color: "#6366F1" }, // Indigo
  L: { x: 50, y: 100, color: "#A855F7" }, // Purple
};

type Gear = keyof typeof gearPositions;

const physicsConfig = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 1,
};

export const GearSelector = () => {
  const [currentGear, setCurrentGear] = useState<Gear>("P");

  const handleGearChange = (gear: Gear) => {
    setCurrentGear(gear);
  };

  return (
    <div className="relative w-[150px] h-[200px] bg-[#1a1a1a] rounded-xl flex items-center justify-center p-4">
      {/* Gear gate visual (simplified) */}
      <div className="absolute inset-0 bg-gray-800 rounded-lg p-2 flex flex-col justify-around">
        {Object.entries(gearPositions).map(([gear, { x: _, y: _, color }]) => (
          <div
            key={gear}
            className="flex items-center text-gray-400 font-bold text-lg"
            style={{
              position: 'absolute',
              // These coordinates would need to be adjusted to match visual layout
              // For a grid-like layout, this can be simplified.
              // For complex S-gate, specific CSS grid areas or absolute positioning is needed.
              left: (gearPositions[gear as Gear].x / 100) * 80 + '%', // Example scaling
              top: (gearPositions[gear as Gear].y / 100) * 80 + '%', // Example scaling
              transform: `translate(-50%, -50%)`, // Center the text
              zIndex: 1,
            }}
          >
            {gear}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: currentGear === gear ? 1 : 0 }}
              transition={{ duration: 0.05, ease: "linear" }}
              className="w-2 h-2 rounded-full ml-2"
              style={{ backgroundColor: color }}
            />
          </div>
        ))}
      </div>

      {/* Shifter Knob */}
      <motion.div
        className="absolute w-12 h-12 bg-gray-700 rounded-full cursor-pointer shadow-lg"
        style={{
          x: gearPositions[currentGear].x,
          y: gearPositions[currentGear].y,
        }}
        animate={{
          x: gearPositions[currentGear].x,
          y: gearPositions[currentGear].y,
        }}
        transition={physicsConfig}
        // Simplified click interaction for demo, drag would be more complex
        onClick={() => {
          // Cycle through gears for demonstration
          const gears = Object.keys(gearPositions) as Gear[];
          const currentIndex = gears.indexOf(currentGear);
          const nextIndex = (currentIndex + 1) % gears.length;
          handleGearChange(gears[nextIndex]);
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