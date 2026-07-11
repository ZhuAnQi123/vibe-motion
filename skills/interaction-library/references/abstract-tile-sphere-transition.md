---
version: beta-v2
name: abstract-tile-sphere-transition
name_zh: "抽象卡片球体切换动效"
cover_video: "../assets/abstract-tile-sphere-transition.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/abstract-tile-sphere-transition.mp4"
tags: ["Elastic", "Card", "Transitions"]
preview: { backgroundColor: "#F0F0F0", textColor: "#333333" }
description: >
  这是一个流畅的抽象动效研究，通过圆角卡片和柔和的球体在干净的浅色背景上进行位置、旋转和大小的平滑切换。元素在移动时带有明显的阻尼感和弹性，球体则伴随着模糊和透明度的变化，整体呈现出有机且动态的视觉效果。
  触发词：[流畅切换、抽象动效、弹性重排]
website: "https://x.com/shiv_visual/status/2072452181157130273"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "60ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "450ms"

  variants:
    initial: { opacity: 0.8, scale: 0.95, filter: "blur(2px)" } # 通用初始状态（稍模糊、小一点）
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" } # 通用动画目标状态（清晰、原始大小）
    exit: { opacity: 0, scale: 0.7, filter: "blur(8px)" } # 通用退出状态（完全模糊、消失、缩小）
---

# 抽象卡片球体切换动效 / Abstract Tile Sphere Transition Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 这是一个类似流体布局重组的动效，圆角卡片和柔和的球体在响应抽象触发器时，进行位置、旋转和大小的平滑切换。元素移动时带有阻尼和弹性体感，而球体则伴随微妙的模糊和透明度变化，整体呈现出有机且动态的视觉效果。
- **Interaction Flow**: 动效在两个抽象状态（视频中标记为A和B）之间进行循环切换。当切换发生时，所有可见元素会根据目标状态重新计算其位置、旋转和缩放，并以平滑的弹性曲线进行过渡。子元素之间存在微小的交错延迟，营造出波浪般的重排感。

## 2. Component DOM Mapping (元素与动效节点映射)

- **`div` - `TransitionContainer`** (Parent Container)
  - 作为一个相对定位的容器，用于包裹所有可动画的卡片和球体。
- **`div` - `TileItem`** (Card/Tile Element)
  - 每个圆角卡片，应用 `x`, `y`, `rotate`, `scale` 动效。
  - `layoutId` 属性用于在布局变化时实现“魔法移动”效果。
- **`div` - `SphereItem`** (Sphere Element)
  - 每个模糊的球体，应用 `x`, `y`, `scale`, `opacity`, `filter` (blur) 动效。
  - `layoutId` 属性同样用于位置和大小的平滑过渡。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 450ms] Transition Phase**:
  - 动效在两个抽象布局（A和B）之间循环切换。当布局状态改变时，Framer Motion 的 `layout` 动画机制被触发。
  - 所有 `TileItem`s 和 `SphereItem`s 同时计算它们在目标布局中的 `x`, `y` 位置，`rotate` 角度和 `scale` 因子。
  - 它们使用 `PRESET_SPRING_SMOOTH` 物理参数 (`stiffness: 200`, `damping: 25`, `mass: 1`) 进行动画过渡。
  - `SphereItem`s 除了位置和大小变化外，还会动画 `opacity` 和 `filter: blur` 以模拟它们的出现、消失或模糊化。
  - 整个过渡过程会应用 `60ms` 的 `stagger_delay`，使得各个元素并非同时开始移动，而是错落有致地形成连贯的重排效果。
  - 动效是连续且循环的，没有明确的“退出”阶段，元素通过平滑过渡从一个配置流向另一个。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as per instructions.
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 动效物理预设词典: PRESET_SPRING_SMOOTH
const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// 模拟布局数据 (在实际应用中，这些数据将由状态管理或计算生成)
const layoutA = [
  { id: "tile1", type: "tile", x: -100, y: -50, rotate: -15, scale: 1.05, bg: "linear-gradient(135deg, #FF7B7B, #FFDAB9)" },
  { id: "tile2", type: "tile", x: 0, y: 0, rotate: 0, scale: 1, bg: "linear-gradient(135deg, #ADD8E6, #90EE90)" },
  { id: "tile3", type: "tile", x: 100, y: 50, rotate: 15, scale: 0.95, bg: "linear-gradient(135deg, #87CEEB, #E6E6FA)" },
  { id: "sphere1", type: "sphere", x: -180, y: -70, scale: 1, opacity: 1, blur: 0, color: "#FFA07A" },
  { id: "sphere2", type: "sphere", x: 180, y: 70, scale: 0.8, opacity: 0.6, blur: 4, color: "#FF6347" },
  { id: "sphere3", type: "sphere", x: -50, y: 120, scale: 0.5, opacity: 0.3, blur: 8, color: "#FFD700" },
];

const layoutB = [
  { id: "tile1", type: "tile", x: 0, y: 0, rotate: 0, scale: 1, bg: "linear-gradient(135deg, #ADD8E6, #90EE90)" },
  { id: "tile2", type: "tile", x: -100, y: 50, rotate: 15, scale: 1.05, bg: "linear-gradient(135deg, #FF7B7B, #FFDAB9)" },
  { id: "tile3", type: "tile", x: 100, y: -50, rotate: -15, scale: 0.95, bg: "linear-gradient(135deg, #87CEEB, #E6E6FA)" },
  { id: "sphere1", type: "sphere", x: -100, y: 80, scale: 0.8, opacity: 0.6, blur: 4, color: "#FFA07A" },
  { id: "sphere2", type: "sphere", x: 150, y: -80, scale: 1, opacity: 1, blur: 0, color: "#FF6347" },
  { id: "sphere3", type: "sphere", x: 80, y: 100, scale: 0.5, opacity: 0.3, blur: 8, color: "#FFD700" },
];

// 通用变体配置 (针对非布局动画属性，如 opacity 和 blur)
const itemVariants = {
  initial: { opacity: 0.8, scale: 0.95, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.7, filter: "blur(8px)" },
};

export const AbstractTileSphereTransition = () => {
  const [currentLayout, setCurrentLayout] = useState(layoutA);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLayout((prevLayout) => (prevLayout === layoutA ? layoutB : layoutA));
    }, 3000); // 每3秒切换一次布局
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[600px] h-[400px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      <AnimatePresence>
        {currentLayout.map((item, index) => {
          const transitionDelay = index * 0.06; // 交错延迟

          if (item.type === "tile") {
            return (
              <motion.div
                key={item.id}
                layoutId={item.id} // 启用布局动画，处理 x, y, rotate, scale
                // initial/animate/exit 将主要用于非布局属性，但在此示例中，布局动画接管了大部分
                // 可以覆盖variants来控制其他属性，例如：
                // initial={{ opacity: 0.8 }} animate={{ opacity: 1 }}
                transition={{ ...physicsConfig, delay: transitionDelay }}
                style={{
                  transformOrigin: "center center",
                  position: "absolute",
                  // x, y, rotate, scale 由 layoutId 及其目标值驱动
                  background: item.bg,
                }}
                className="w-32 h-32 rounded-xl shadow-md"
              >
                {/* 图片或其他内容 */}
              </motion.div>
            );
          } else if (item.type === "sphere") {
            return (
              <motion.div
                key={item.id}
                layoutId={item.id} // 启用布局动画，处理 x, y, scale
                initial={{ opacity: 0, scale: 0.5, filter: "blur(8px)" }} // 球体的特定初始状态
                animate={{ opacity: item.opacity, scale: item.scale, filter: `blur(${item.blur}px)` }} // 球体的特定动画目标状态
                exit={{ opacity: 0, scale: 0.5, filter: "blur(8px)" }} // 球体的特定退出状态
                transition={{ ...physicsConfig, delay: transitionDelay }}
                style={{
                  position: "absolute",
                  background: item.color,
                }}
                className={`w-20 h-20 rounded-full`}
              ></motion.div>
            );
          }
          return null;
        })}
      </AnimatePresence>
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