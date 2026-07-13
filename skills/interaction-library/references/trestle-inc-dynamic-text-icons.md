---
version: beta-v2
name: trestle-inc-dynamic-text-icons
name_zh: "Trestle Inc. 动态文字与图标浮现"
cover_video: "../assets/trestle-inc-dynamic-text-icons.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/trestle-inc-dynamic-text-icons.mp4"
tags: ["Reveal", "Typographic", "Transition"]
preview: { backgroundColor: "#F8F7F2", textColor: "#333333" }
description: >
  这是一个简约品牌的展示动效。主要的品牌标语通过流畅的垂直滑动和淡入淡出进行切换，每次切换都带有轻微的弹性回弹。同时，许多线条艺术风格的品牌相关小图标以柔软的弹性“弹出”效果随机或有序地出现在背景中，增强了视觉趣味性。
  触发词：[文字切换、弹性弹出、图标浮现、简约品牌]
website: "https://x.com/jakedowsmith/status/2069423581453230341"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "N/A" # Text phrases replace each other, not staggered. Icons appear individually.

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

# Trestle Inc. 动态文字与图标浮现 / Trestle Inc. Dynamic Text and Icon Reveal Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

-   **Visual Physics Class**: Fluid-Elastic
-   **Core Experience**: The central brand message transitions smoothly, with each phrase gently sliding up and fading into view, accompanied by a subtle elastic bounce. Concurrently, a collection of minimalist line-art icons pop into existence around the main text, each with a soft, spring-like expansion and fade-in, contributing to a dynamic yet clean aesthetic.
-   **Interaction Flow**: Sequential text replacement triggers the previous text to gracefully slide out and fade, while the new text performs its entrance. Icons appear and disappear throughout the presentation, enhancing the overall visual narrative without direct user interaction.

## 2. Component DOM Mapping (元素与动效节点映射)

-   **[Main Text Container]** (`div` or `p` - Central changing text block)
    -   Handles the dynamic text phrase replacement, animating `opacity`, `transform` (y-axis and scale), and `filter` (blur). Requires `AnimatePresence` for exit animations.
-   **[Floating Icons]** (`div` or `svg` - Individual icon elements)
    -   Each icon animates independently upon appearance, utilizing `opacity` and `transform` (scale, possibly slight rotation). Their positions are pre-determined or randomized within the background.

## 3. Detailed Timeline Sequence (时序编排)

-   **[0ms - 350ms] Text In Transition**:
    -   The *new* text phrase starts animating immediately upon entering the DOM. It transitions from `opacity: 0`, `y: 15px`, `scale: 0.95`, `filter: blur(4px)` to `opacity: 1`, `y: 0px`, `scale: 1`, `filter: blur(0px)`. This uses the `PRESET_SPRING_SMOOTH` physics.
-   **[0ms - 350ms] Text Out Transition**:
    -   The *old* text phrase animates concurrently when exiting the DOM (managed by `AnimatePresence`). It transitions from `opacity: 1`, `y: 0px`, `scale: 1`, `filter: blur(0px)` to `opacity: 0`, `y: -10px`, `scale: 0.95`, `filter: blur(2px)`. This also uses `PRESET_SPRING_SMOOTH`.
-   **[50ms - 400ms] Icon Appearance (Intermittent)**:
    -   Various background icons appear at different, often random, timings. Each icon transitions from `opacity: 0`, `scale: 0.8` to `opacity: 1`, `scale: 1`. Some may include a slight `rotate` or `y` shift. The animation employs `PRESET_SPRING_SMOOTH`.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Complete production-ready implementation of Trestle Inc. 动态文字与图标浮现
// Assuming React + Tailwind CSS + Framer Motion as per default directive.
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Insert custom physics from motion_tokens
const springPhysics = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

const textVariants = {
  initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: springPhysics },
  exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)", transition: springPhysics },
};

const iconVariants = {
  initial: { opacity: 0, scale: 0.8, rotate: -15 },
  animate: { opacity: 1, scale: 1, rotate: 0, transition: { ...springPhysics, delay: 0.05 } },
  exit: { opacity: 0, scale: 0.8, rotate: 15, transition: { duration: 0.2, ease: "easeOut" } }, // Slightly snappier exit for icons
};

// Dummy icon data with positions (example based on video)
const iconsData = [
  { id: 1, content: "👁️", x: "10%", y: "20%", size: "w-8 h-8" },
  { id: 2, content: "📌", x: "85%", y: "10%", size: "w-10 h-10" },
  { id: 3, content: "🌿", x: "18%", y: "85%", size: "w-9 h-9" },
  { id: 4, content: "📝", x: "70%", y: "70%", size: "w-7 h-7" },
  { id: 5, content: "⚙️", x: "5%", y: "60%", size: "w-10 h-10" },
  { id: 6, content: "👂", x: "30%", y: "5%", size: "w-8 h-8" },
  { id: 7, content: "💡", x: "90%", y: "40%", size: "w-9 h-9" },
  { id: 8, content: "🔍", x: "60%", y: "25%", size: "w-9 h-9" },
  { id: 9, content: "👐", x: "40%", y: "75%", size: "w-10 h-10" },
  { id: 10, content: "✨", x: "25%", y: "45%", size: "w-7 h-7" },
  { id: 11, content: "🔄", x: "75%", y: "90%", size: "w-8 h-8" },
];

export const TrestleIncAnimation = () => {
  const phrases = [
    "meets people",
    "in person",
    "makes things that last",
    "is based in New York City",
    "listens before it decides",
    "takes people seriously",
    "wants you to love your tools",
    "is a company with opinions",
    "solves things that matter",
    "believes in Relay",
    "respects",
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [activeIcons, setActiveIcons] = useState<number[]>([]);

  useEffect(() => {
    // Phrase cycling interval
    const phraseInterval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 2000); // Change phrase every 2 seconds

    // Random icon appearance/disappearance interval
    const iconInterval = setInterval(() => {
      const randomIconIndex = Math.floor(Math.random() * iconsData.length);
      const newIconId = iconsData[randomIconIndex].id;

      setActiveIcons((prev) => {
        if (prev.includes(newIconId)) {
          // 25% chance to remove an existing icon
          if (Math.random() < 0.25 && prev.length > 0) {
            return prev.filter(id => id !== newIconId);
          }
          return prev;
        } else {
          // 50% chance to add a new icon if not present
          if (Math.random() < 0.5) {
            return [...prev, newIconId];
          }
          return prev;
        }
      });
    }, 800); // Check for icon changes every 0.8 seconds

    return () => {
      clearInterval(phraseInterval);
      clearInterval(iconInterval);
    };
  }, [phrases.length]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F8F7F2] overflow-hidden p-8 text-black">
      {/* Background Icons Layer */}
      <div className="absolute inset-0 z-0 opacity-50 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full max-w-4xl max-h-[80vh]"> {/* Constrain icon area */}
          <AnimatePresence>
            {activeIcons.map((iconId) => {
              const icon = iconsData.find(d => d.id === iconId);
              if (!icon) return null;
              return (
                <motion.div
                  key={icon.id}
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`absolute ${icon.size} font-bold text-gray-500`}
                  style={{ left: icon.x, top: icon.y }}
                >
                  {icon.content}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Text Content */}
      <h1 className="relative z-10 text-6xl font-serif font-normal text-center max-w-2xl leading-tight text-[#333333]">
        <span className="block">Trestle Inc.</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentPhraseIndex} // Key changes to trigger AnimatePresence exit/enter
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="block mt-2"
          >
            {phrases[currentPhraseIndex]}
          </motion.span>
        </AnimatePresence>
      </h1>

      {/* Footer Links (Static) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-600 space-x-4 z-20">
        <a href="#" className="hover:underline">Ledger</a>
        <a href="#" className="hover:underline">Relay</a>
        <a href="#" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">Terms</a>
      </div>

      {/* Top Left Recording Label (Static) */}
      <div className="absolute top-4 left-4 text-xs text-gray-600 z-20">
        RECORDING N° 725 IN LONDON
      </div>
      {/* Top Red Dot (Static) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full z-20"></div>
    </div>
  );
};
```