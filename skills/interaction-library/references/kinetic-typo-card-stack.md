---
version: beta-v2
name: kinetic-typo-card-stack
name_zh: "动态排版卡片堆叠切换"
cover_video: "../assets/kinetic-typo-card-stack.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/kinetic-typo-card-stack.mp4"
tags: ["Card", "Reveal", "Transitions"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  这是一个动态排版卡片堆叠切换动效，多张卡片以流畅的弹性阻尼效果交错滑入和滑出，模拟物理堆叠感，并伴有轻微的旋转和位移变化，形成富有活力的内容切换。
  触发词：[卡片切换、堆叠、弹性阻尼、动态排版]
website: "https://x.com/bylorenzodesign/status/2070542855613890864"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "40ms" # For potential sub-elements within a card, or when multiple cards reveal sequentially

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, scale: 0.9, y: 30, rotate: -8, filter: "blur(4px)" }
    animate: { opacity: 1, scale: 1, y: 0, rotate: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.9, y: -20, rotate: 8, filter: "blur(2px)" }
---

# 动态排版卡片堆叠切换 / Kinetic Typographic Card Stack Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 卡片在屏幕上以一种物理堆叠感进行切换，带有流畅的弹性阻尼效果。新的卡片从屏幕外侧（例如下方或侧方）滑入，并伴有轻微的旋转和缩放，同时逐渐清晰，旧卡片则以相似的动态滑出并模糊消失，整个过程体现出一种生动活泼而又控制得当的节奏感。
- **Interaction Flow**: 默认状态下，一张卡片居中显示。当触发切换事件时，当前卡片平滑地滑出（可能伴随轻微旋转和缩放），同时一张新卡片从相反方向滑入，同样带有旋转和缩放，最终在新位置稳定下来。此过程循环往复，形成连续的卡片堆叠切换体验。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - Card Wrapper):
  - 应用 `transform_origin` 为 `center center`。
  - 主要的 `opacity`, `scale`, `y`, `rotate`, `filter` 动画应用于此层，控制卡片的整体进出场和堆叠感。
- **[Child Node A]** (`div` - Text Block/Graphic Elements):
  - 位于 Card Wrapper 内部，随父元素一同动画。在此动效中，子元素没有明显的独立动画，但可以基于 `stagger_delay` 实现内部文本或图形的延迟加载效果。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 350ms] Card Entry/Transition Phase**:
  - `Parent Container` (Card Wrapper) 从 `initial` 状态 (`opacity: 0, scale: 0.9, y: 30, rotate: -8, filter: "blur(4px)"`) 开始，通过 `PRESET_SPRING_SMOOTH` 物理动画过渡到 `animate` 状态 (`opacity: 1, scale: 1, y: 0, rotate: 0, filter: "blur(0px)"`)。
  - 动画过程中，卡片从略微偏离中心和倾斜的位置进入，逐渐放大、扶正、清晰，并平稳停留在中心位置。
- **[0ms - 350ms] Card Exit Phase (Simultaneous or slightly staggered)**:
  - 当一个新卡片进入时，旧卡片从 `animate` 状态通过 `PRESET_SPRING_SMOOTH` 或 `EASE_OUT_EXPO` 过渡到 `exit` 状态 (`opacity: 0, scale: 0.9, y: -20, rotate: 8, filter: "blur(2px)"`)。
  - 旧卡片向相反方向（例如略微向上和倾斜）滑出，同时缩小并模糊消失。
- **Note**: 视频中卡片切换并非严格的 `stagger_delay` 内部元素，而是卡片整体的替换。如果存在卡片内部文本的动画，则会在此处体现。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2. **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3. **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4. **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Complete production-ready implementation of 动态排版卡片堆叠切换
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not provided.
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cardPhysicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.9, y: 30, rotate: -8, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, y: 0, rotate: 0, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.9, y: -20, rotate: 8, filter: "blur(2px)" },
};

const cardsData = [
  { id: 1, title: "EVERYTHING SIGNAL 003", content: "To Something", bgColor: "bg-red-500", textColor: "text-white" },
  { id: 2, title: "CONNECTION IS THE EASY PART", content: "Nodes: 47", bgColor: "bg-blue-500", textColor: "text-white" },
  { id: 3, title: "EVERYTHING CONNECTS", content: "NODES: 47", bgColor: "bg-red-500", textColor: "text-white" },
  { id: 4, title: "NODES: 47 SIGNAL EDGES: 213", content: "", bgColor: "bg-black", textColor: "text-red-500" },
];

export const KineticTypoCardStack = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cardsData.length);
  };

  return (
    <div
      className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-black"
      onClick={handleNextCard} // Simulate interaction to change card
      style={{ cursor: "pointer" }}
    >
      <AnimatePresence initial={false} mode="wait"> {/* 'wait' mode ensures exit finishes before new enters */}
        <motion.div
          key={cardsData[currentIndex].id}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={cardPhysicsConfig}
          style={{ transformOrigin: "center center" }}
          className={`absolute w-[400px] h-[450px] rounded-lg p-8 flex flex-col justify-between items-center text-center shadow-lg
                      ${cardsData[currentIndex].bgColor} ${cardsData[currentIndex].textColor}`}
        >
          <div className="relative w-full h-full flex flex-col justify-center items-center">
            {/* Example: Dynamic content based on card data */}
            {cardsData[currentIndex].id === 1 && (
              <motion.div
                className="w-full h-full flex flex-col justify-between items-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div className="relative w-full text-white text-3xl font-bold p-2 bg-red-600 -rotate-3 mb-4">EVERYTHING</div>
                <div className="relative w-2/3 text-red-600 text-6xl font-extrabold p-2 bg-white rotate-6 mt-4 mb-4">SIGNAL</div>
                <div className="relative w-full text-white text-3xl font-bold p-2 bg-red-600 rotate-3 mt-4">003</div>
                <div className="relative w-full text-white text-3xl font-bold p-2 bg-red-600 -rotate-3 mt-4">TO SOMETHING</div>
                {/* Simplified diagram for illustrative purposes */}
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                  <line x1="10" y1="50" x2="90" y2="50" stroke="black" strokeWidth="0.5" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke="black" strokeWidth="0.5" />
                  <circle cx="25" cy="50" r="15" stroke="black" fill="transparent" strokeWidth="0.5" />
                  <circle cx="75" cy="50" r="15" stroke="black" fill="transparent" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="10" stroke="black" strokeDasharray="2 2" fill="transparent" strokeWidth="0.5" />
                  <circle cx="25" cy="50" r="2" fill="black" />
                  <circle cx="75" cy="50" r="2" fill="black" />
                </svg>
              </motion.div>
            )}
            {cardsData[currentIndex].id === 2 && (
              <motion.div
                className="w-full h-full flex flex-col justify-between items-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                 <div className="text-white text-3xl font-bold mb-4 bg-blue-600 p-2">CONNECTION</div>
                 <div className="text-white text-3xl font-bold mb-8 bg-blue-600 p-2">IS</div>
                 <div className="text-white text-3xl font-bold mt-auto bg-blue-600 p-2">THE EASY PART</div>
                 {/* Simplified diagram */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-md flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="30" cy="50" r="10" stroke="gray" fill="transparent" strokeWidth="1" />
                        <circle cx="70" cy="50" r="10" stroke="gray" fill="transparent" strokeWidth="1" />
                        <ellipse cx="50" cy="50" rx="20" ry="10" stroke="gray" fill="transparent" strokeWidth="1" />
                        <line x1="30" y1="50" x2="70" y2="50" stroke="gray" strokeWidth="1" />
                    </svg>
                 </div>
              </motion.div>
            )}
            {cardsData[currentIndex].id === 3 && (
              <motion.div
                className="w-full h-full flex flex-col justify-between items-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div className="text-white text-3xl font-bold mb-4 bg-red-600 p-2">EVERYTHING</div>
                <div className="text-white text-3xl font-bold mb-4 bg-red-600 p-2">CONNECTS</div>
                <div className="text-white text-4xl font-extrabold my-8 bg-black p-2 rounded">NODES: 47</div>
                <div className="text-white text-3xl font-bold mt-auto bg-red-600 p-2">TO SOMETHING</div>
                {/* Simplified network diagram */}
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                    {Array.from({ length: 47 }).map((_, i) => (
                        <circle key={i} cx={Math.random() * 80 + 10} cy={Math.random() * 80 + 10} r={Math.random() * 1 + 0.5} fill="gray" />
                    ))}
                    <path d="M10 50 Q50 10, 90 50 T10 50" stroke="white" strokeWidth="0.5" fill="none"/>
                </svg>
              </motion.div>
            )}
            {cardsData[currentIndex].id === 4 && (
              <motion.div
                className="w-full h-full flex flex-col justify-center items-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div className="text-red-500 text-4xl font-bold my-4 bg-black p-2 rounded">NODES: 47</div>
                <div className="text-red-500 text-4xl font-bold my-4 bg-black p-2 rounded">SIGNAL</div>
                <div className="text-red-500 text-4xl font-bold my-4 bg-black p-2 rounded">EDGES: 213</div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
```