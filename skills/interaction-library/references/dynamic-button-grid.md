---
version: beta-v2
name: dynamic-button-grid
name_zh: "动态按钮网格"
cover_video: "../assets/dynamic-button-grid.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/dynamic-button-grid.mp4"
tags: ["Elastic", "Button", "Reveal"]
preview: { backgroundColor: "#F8F8F8", textColor: "#333333" }
description: >
  一个充满活力的动效，其中一组操作按钮在一个干净的白色界面上动态出现、散布并重新组合，
  每个按钮都以轻快的弹簧效果和微妙的模糊效果呈现，营造出一种俏皮和响应的感觉。
  触发词：[动态网格、弹性出现、按钮群]
website: "https://x.com/raunofreiberg/status/2068432740249133112"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "40ms"

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

# 动态按钮网格 / Dynamic Button Grid Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

-   **Visual Physics Class**: Fluid-Elastic
-   **Core Experience**: The animation provides an energetic and playful feel, showcasing a dynamic arrangement of action buttons. Each button animates in with a soft, bouncy spring effect, accompanied by a subtle blur-to-clear transition and a slight upward translate. Elements appear and disappear in a staggered sequence, creating a natural, flowing motion as the grid reforms.
-   **Interaction Flow**: This animation simulates a refresh or dynamic update of a command palette or tag cloud. Upon a trigger (e.g., search or filter change), existing buttons animate out with a staggered, slightly downward motion, fading and blurring. Subsequently, new or reordered buttons animate in from slightly below, scaling up, fading in, and clearing blur, also in a staggered fashion.

## 2. Component DOM Mapping (元素与动效节点映射)

-   **[Parent Container]** (`div` - Button Grid Wrapper)
    -   This container holds all the individual action buttons. It orchestrates the staggered animations of its children using Framer Motion's `staggerChildren` property.
-   **[Child Node]** (`button` - Individual Action Button, e.g., "Compose", "Save", "Delete")
    -   Each button is an independent animated element. It animates its `opacity`, `scale`, `translateY` position, and `filter` (blur) properties according to the `initial`, `animate`, and `exit` variants defined. These animations are coordinated by the parent's `staggerChildren` property.

## 3. Detailed Timeline Sequence (时序编排)

-   **[0ms - 150ms] Exit Phase (Staggered)**:
    -   Triggered when elements are removed from the DOM (e.g., a filter change).
    -   Individual buttons transition from their `animate` state to their `exit` state:
        -   `opacity`: `1` -> `0`
        -   `scale`: `1` -> `0.95`
        -   `y`: `0` -> `-10px`
        -   `filter`: `blur(0px)` -> `blur(2px)`
    -   Each button's exit animation begins with a `40ms` stagger delay from its predecessor, in reverse order (`staggerDirection: -1`). The transition uses a faster ease-out curve for snappier dismissal.
-   **[~100ms - 450ms] Entry Phase (Staggered)**:
    -   Triggered when new or updated elements are added to the DOM.
    -   Individual buttons transition from their `initial` state to their `animate` state:
        -   `opacity`: `0` -> `1`
        -   `scale`: `0.95` -> `1`
        -   `y`: `15px` -> `0px`
        -   `filter`: `blur(4px)` -> `blur(0px)`
    -   Each button's entry animation begins with a `40ms` stagger delay from its predecessor. The animation employs the `PRESET_SPRING_SMOOTH` physics.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as no package.json was provided.

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Insert custom physics from motion_tokens
const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Variants for the individual buttons
const itemVariants = {
  initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: physicsConfig },
  exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)", transition: { duration: 0.25, ease: "easeOut" } },
};

// Variants for the container to orchestrate stagger
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.04, // stagger_delay: 40ms
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1, // Stagger in reverse on exit
    },
  },
};

interface ButtonData {
  id: string;
  label: string;
  colorClass: string; // e.g., "bg-red-500 text-white"
}

export const DynamicButtonGrid = ({ buttons }: { buttons: ButtonData[] }) => {
  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="initial" // Provide an initial state context for children
        animate="animate"
        exit="exit" // AnimatePresence will handle exit of the children through this
        className="flex flex-wrap gap-2 p-4 max-w-2xl mx-auto justify-center" // Tailwind classes for layout
      >
        {buttons.map((button) => (
          <motion.button
            key={button.id}
            variants={itemVariants}
            exit="exit" // Explicitly define exit for AnimatePresence
            className={`px-4 py-2 rounded-full text-sm font-medium ${button.colorClass}`}
          >
            {button.label}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

/*
// Example Usage:
import React, { useState } from 'react';

const dummyButtonsInitial: ButtonData[] = [
  { id: "1", label: "Compose +", colorClass: "bg-orange-500 text-white" },
  { id: "2", label: "Update", colorClass: "bg-orange-400 text-white" },
  { id: "3", label: "Schedule", colorClass: "bg-orange-300 text-white" },
  { id: "4", label: "Download", colorClass: "bg-blue-500 text-white" },
  { id: "5", label: "Upload", colorClass: "bg-blue-400 text-white" },
  { id: "6", label: "Assign +", colorClass: "bg-blue-300 text-white" },
  { id: "7", label: "Subscribe", colorClass: "bg-gray-800 text-white" },
  { id: "8", label: "Deploy", colorClass: "bg-yellow-500 text-white" },
  { id: "9", label: "Discard", colorClass: "bg-red-400 text-white" },
  { id: "10", label: "Remove", colorClass: "bg-red-300 text-white" },
  { id: "11", label: "Track +", colorClass: "bg-green-500 text-white" },
  { id: "12", label: "Tag", colorClass: "bg-green-400 text-white" },
  { id: "13", label: "Chat", colorClass: "bg-gray-800 text-white" },
];

const dummyButtonsSecondState: ButtonData[] = [
  { id: "14", label: "Publish", colorClass: "bg-red-500 text-white" },
  { id: "15", label: "Save", colorClass: "bg-red-400 text-white" },
  { id: "16", label: "Open", colorClass: "bg-red-300 text-white" },
  { id: "17", label: "Retry", colorClass: "bg-yellow-500 text-white" },
  { id: "18", label: "Continue", colorClass: "bg-gray-800 text-white" },
  { id: "19", label: "Restore", colorClass: "bg-yellow-300 text-white" },
  { id: "20", label: "Dismiss", colorClass: "bg-red-400 text-white" },
  { id: "21", label: "Archive", colorClass: "bg-orange-300 text-white" },
  { id: "22", label: "Delete", colorClass: "bg-red-600 text-white" },
  { id: "23", label: "Approve", colorClass: "bg-green-500 text-white" },
  { id: "24", label: "Export", colorClass: "bg-blue-500 text-white" },
];


function App() {
  const [buttons, setButtons] = useState(dummyButtonsInitial);
  const [isFirstState, setIsFirstState] = useState(true);

  const toggleButtons = () => {
    setIsFirstState(!isFirstState);
    setButtons(isFirstState ? dummyButtonsSecondState : dummyButtonsInitial);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <button
        onClick={toggleButtons}
        className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Toggle Buttons
      </button>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl min-h-[300px] flex items-center justify-center">
        <DynamicButtonGrid buttons={buttons} />
      </div>
    </div>
  );
}
*/
```

## 🛑 AI Anti-Patterns & Blocklist (AI 避坑防偏与硬性禁忌)

> **⚠️ [SYSTEM RULE]** As a Senior Motion Developer, you must strictly AVOID the following anti-patterns. Violating any of these rules will result in layout shift and rendering stutter.

### 1. The "Sticky Animation" Trap (时长失控)
-   ❌ **DON'T**: Do NOT write transitions or spring animations with a duration exceeding `400ms` unless specifically requested. It makes the UI feel laggy and sticky.
-   **DO**: Default to snappy durations (`150ms - 300ms`). High-frequency micro-interactions (like buttons/taps) must be under `150ms`.

### 2. The "Layout Thrashing" Catastrophe (严禁非 GPU 加速属性)
-   ❌ **DON'T**: NEVER use `transition: all`. Never animate layout-shifting properties: `width`, `height`, `top`, `left`, `margin`, `padding`, or `border-width`.
-   **DO**: Only animate `transform` (scale, translate, rotate) and `opacity`. If you need to animate border changes, use `box-shadow: inset` or a pseudo-element (`::after`) with opacity scale.

### 3. Dark Mode Shadow Pollution (暗黑模式脏阴影)
-   ❌ **DON'T**: Do NOT apply standard dark shadows (`rgba(0,0,0,0.5)`) on dark-themed components—they become invisible or look muddy. NEVER use bright white shadows.
-   **DO**: In dark mode, replace floating shadows with a subtle semi-transparent border (e.g., `border: 1px solid rgba(255, 255, 255, 0.08)`) and a slight background highlight (elevation tint).

### 4. Instantly Vanishing Exit (销毁无动画)
-   ❌ **DON'T**: Do NOT let elements disappear instantly from the DOM when they are closed or unmounted.
-   **DO**: You must wrap conditional rendering with `<AnimatePresence>` (Framer Motion) or leverage CSS transition-end event listeners to ensure the `exit` state plays out fully before node destruction.