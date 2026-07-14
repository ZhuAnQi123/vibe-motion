---
version: beta-v2
name: brand-tile-info-hover-reveal
name_zh: "品牌磁贴悬停信息揭示"
cover_video: "../assets/brand-tile-info-hover-reveal.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/brand-tile-info-hover-reveal.mp4"
tags: ["Hover", "Button", "Card"]
preview: { backgroundColor: "#FFFFFF", textColor: "#333333" }
description: >
  这是一个简洁的鼠标驱动动效，当用户悬停在带有品牌Logo的圆角磁贴上时，磁贴会平滑放大并略微抬升，同时在上方区域平滑显示该品牌的描述信息。整体动效流畅，带有iOS风格的柔和阻尼感。
  触发词：[品牌磁贴、悬停反馈、信息揭示、iOS风格、流体放大]
website: "https://x.com/hours/status/2065058598867415448"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "40ms" # For potential internal elements, though here it's more about sequential animation of text.

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, y: 15, filter: "blur(4px)" }
    animate: { opacity: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, y: -10, filter: "blur(2px)" }
---

# 品牌磁贴悬停信息揭示 (Brand Tile Info Hover Reveal) Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 当鼠标悬停在品牌磁贴上时，磁贴会以一种柔和、有弹性的方式放大并向上轻微抬升，同时，上方对应的品牌描述文本会同步地从下方淡入并向上滑动，带来清晰且优雅的信息揭示。鼠标离开时，所有元素平滑回退到初始状态。
- **Interaction Flow**: Hover -> Individual Brand Tile scales up (1.0 -> 1.04) and lifts (shadow deepens); concurrently, a descriptive text element *above* the tile row fades in and slides up (Y: 15px -> 0px). Mouse Leave -> All elements reverse to initial states smoothly.

## 2. Component DOM Mapping (元素与动效节点映射)

- **`div` - Main Container (Tile Row Wrapper)**
  - Acts as a flex container for the brand tiles.
- **`div` - Descriptive Text Display**
  - Positioned above the tile row.
  - This element will animate its `opacity`, `y` position, and `filter` (blur) based on the currently hovered tile's data. It utilizes `AnimatePresence` for smooth entry/exit.
- **`div` - Brand Tile (Individual Item)**
  - Apply `transform_origin: center center`.
  - On hover, scales up (`scale: 1.04`) and `boxShadow` transitions to give a lifted effect.
  - Contains the brand logo (e.g., `img` or `svg`) or text.

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 250ms] Tile Hover Phase**:
  - Individual Brand Tile: Scales from `1.0` to `1.04` and `boxShadow` transitions from a shallow state to a more pronounced floating state (e.g., `0 4px 6px` to `0 10px 15px`) using `PRESET_SPRING_SMOOTH`.
- **[80ms - 350ms] Descriptive Text Reveal Phase**:
  - Descriptive Text Display: Begins animating after a slight delay relative to the tile's scale. `opacity` from `0` to `1`, `y` from `15px` to `0px`, and `filter: blur(4px)` to `blur(0px)`. This uses `PRESET_SPRING_SMOOTH` properties for entry, and `cubic-bezier(0.16, 1, 0.3, 1)` for exit.
- **[Exit Phase] Mouse Leave**:
  - Individual Brand Tile: Reverses scale and shadow to initial state using `PRESET_SPRING_SMOOTH`.
  - Descriptive Text Display: Fades out (`opacity: 0`), slides up (`y: -10px`), and blurs (`filter: blur(2px)`) using the `exit` variant of its `motion_tokens.variants`.

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not provided.
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Custom physics from motion_tokens
const tilePhysics = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

const textVariants = {
  initial: { opacity: 0, y: 15, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { ease: [0.16, 1, 0.3, 1], duration: 0.35 } },
  exit: { opacity: 0, y: -10, filter: "blur(2px)", transition: { ease: [0.16, 1, 0.3, 1], duration: 0.3 } },
};

interface BrandData {
  id: string;
  logo: React.ReactNode;
  description: string;
}

const brands: BrandData[] = [
  { id: "apple", logo: <span className="text-4xl"></span>, description: "Apple — Worldwide taste leader" },
  { id: "arte", logo: <span className="font-bold text-xl">arte</span>, description: "Arte — The European culture TV channel" },
  { id: "unknown1", logo: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M12 2L2 22h20L12 2zm0 4.14L17.5 17h-11L12 6.14z"></path></svg>, description: "Generic Brand — Innovation in Tech" },
  { id: "scyal", logo: <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"></path></svg>, description: "ScyAI — Solving risk intelligence" },
  { id: "more", logo: <span className="text-3xl">...</span>, description: "And many more" },
];

// Individual Brand Tile Component
const BrandTile: React.FC<{
  brand: BrandData;
  onHoverStart: (brand: BrandData) => void;
  onHoverEnd: () => void;
}> = ({ brand, onHoverStart, onHoverEnd }) => {
  return (
    <motion.div
      initial={{ scale: 1, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        transition: tilePhysics,
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => onHoverStart(brand)}
      onHoverEnd={onHoverEnd}
      style={{ transformOrigin: "center center" }}
      className="relative flex items-center justify-center w-24 h-24 bg-white rounded-2xl cursor-pointer"
    >
      {brand.logo}
    </motion.div>
  );
};

// Main Interaction Component
export const BrandTileInfoHoverReveal = () => {
  const [hoveredBrand, setHoveredBrand] = useState<BrandData | null>(null);

  const handleHoverStart = (brand: BrandData) => {
    setHoveredBrand(brand);
  };

  const handleHoverEnd = () => {
    setHoveredBrand(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-gray-50 text-gray-800">
      <div className="mb-8 h-8 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {hoveredBrand && (
            <motion.p
              key={hoveredBrand.id}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-lg text-gray-700 whitespace-nowrap"
            >
              {hoveredBrand.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex space-x-4 p-2 bg-white/60 backdrop-blur-md rounded-3xl border border-gray-100 shadow-lg">
        {brands.map((brand) => (
          <BrandTile
            key={brand.id}
            brand={brand}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          />
        ))}
      </div>
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