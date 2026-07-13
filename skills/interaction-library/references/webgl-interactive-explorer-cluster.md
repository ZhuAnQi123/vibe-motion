---
version: beta-v2
name: webgl-interactive-explorer-cluster
name_zh: "WebGL 互动探索器 - 图像集群动效"
cover_video: "../assets/webgl-interactive-explorer-cluster.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/webgl-interactive-explorer-cluster.mp4"
tags: ["Elastic", "Hover", "Click"]
preview: { backgroundColor: "#F0F0F0", textColor: "#333333" }
description: >
  这是一个动态的 WebGL 交互探索器，展示了一个由多个图像组成的球形集群。
  动效的核心体感在于：鼠标悬停在右侧的类别名称上时，集群中的对应图像会略微放大；点击类别名称后，一个中心图像会以流畅的弹性动效展开，同时其详细描述显示在左侧，而周围的图像集群则会优雅地向外散开，为中心内容腾出空间。
  触发词：[WebGL 图像集群、弹性展开、散射动效、悬停预览]
website: "https://x.com/usernametiago/status/2067278942394855777"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "20ms" # For the subtle scattering of surrounding small images

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" } # Example for text/description
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# WebGL 互动探索器 - 图像集群动效 / WebGL Interactive Explorer - Image Cluster Motion Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: The interactive explorer provides an engaging and responsive experience. The central image expands with a smooth, almost rubber-band-like elasticity, giving a sense of depth and fluidity. The surrounding smaller images gracefully re-position themselves to accommodate the expansion, creating a dynamic visual space. Hovering over category names provides subtle visual feedback before a click triggers the main event.
- **Interaction Flow**:
    1.  **Initial Load**: A black oval expands rapidly into a circular cluster of numerous small images (0s-2s).
    2.  **Category Hover**: Hovering over a category name (e.g., "Afterimage Bodies" at 0:05s) causes its corresponding larger image (if applicable) to briefly highlight or show a quick preview within the cluster.
    3.  **Category Click**: Clicking a category name (e.g., "Afterimage Bodies" at 0:06s) triggers:
        *   **Central Image Expansion**: A large, relevant image expands from the center of the cluster with an elastic, spring-like motion.
        *   **Text Description Reveal**: A descriptive text block for the selected category fades in from the left.
        *   **Cluster Scattering**: The surrounding smaller images in the cluster subtly scatter outwards and become slightly translucent, giving prominence to the central image.
    4.  **Category Switch**: Clicking another category (e.g., "Soft Geometry" at 0:09s) causes the current central image to elastically shrink and fade, and the new selected image elastically expands, while the text description updates. The surrounding images may adjust their positions again.

## 2. Component DOM Mapping (元素与动效节点映射)

- **`div` - Main Viewport / Background**
  - Static.
- **`div` - Image Cluster Container**
  - Contains all the small image thumbnails. Initially expands from a central point.
- **`motion.img` - Individual Small Thumbnail Image (within cluster)**
  - On cluster activation: Positioned dynamically in a circular layout.
  - On central image expansion: Moves radially outwards, scales slightly, and reduces opacity.
  - On central image collapse: Returns to original cluster position, scale, and opacity.
- **`div` - Category List Container (Right Side)**
  - Contains `motion.a` (or `motion.li`) elements for each category.
- **`motion.a` / `motion.li` - Category Name Item (e.g., "Afterimage Bodies")**
  - On hover: Text color changes, possibly a subtle scale.
  - On click: Triggers central image expansion and text description reveal.
- **`motion.img` - Central Large Image (e.g., the glowing figure at 0:06s)**
  - On category click: Scales up from a small/invisible state to a prominent central position with `PRESET_SPRING_SMOOTH`.
  - On category switch/deselection: Scales down and fades out.
- **`motion.div` - Text Description Container (Left Side)**
  - On category click: Fades in and slides in from the left (`y` or `x` translation) with `PRESET_EASE_OUT_EXPO` or `PRESET_SPRING_SMOOTH` for entry.
  - On category switch/deselection: Fades out and slides out.

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 200ms] Initial Load (Conceptual)**:
  - Black oval transforms into Image Cluster Container.
  - Individual Small Thumbnail Images appear simultaneously or with a radial stagger (if implemented).
- **[On Category Name Hover]**:
  - Category Name Item: Text color change (`200ms` `ease-in-out`).
  - (Optional) Individual Small Thumbnail Image (corresponding to category): Slight scale up (`150ms` `PRESET_SPRING_STIFF`).
- **[On Category Name Click]**:
  - **[0ms - 350ms] Central Image Expansion**:
    - Central Large Image: Scales from `0` (or `0.95`) to `1` using `PRESET_SPRING_SMOOTH`.
    - Central Large Image: Opacity from `0` to `1`.
  - **[50ms - 400ms] Text Description Reveal**:
    - Text Description Container: `opacity` from `0` to `1`, `x` (or `y`) from `15px` to `0px` using `cubic-bezier(0.16, 1, 0.3, 1)`.
  - **[0ms - 250ms] Cluster Scattering**:
    - Individual Small Thumbnail Images (all or only those near center): `scale` from `1` to `1.05`, `opacity` from `1` to `0.3`, and `translateX/Y` (radially outwards) using `PRESET_SPRING_SMOOTH` with a `stagger_delay` of `20ms`.
- **[Exit/Deselection Phase]**:
  - Central Large Image: Scales from `1` to `0` (or `0.95`) and fades out (`opacity: 0`) using `PRESET_SPRING_SMOOTH` (reverse).
  - Text Description Container: Fades out and slides out (`opacity: 0`, `x: -15px`) using `cubic-bezier(0.4, 0, 0.2, 1)`.
  - Individual Small Thumbnail Images: Return to `scale: 1`, `opacity: 1`, and original `translateX/Y` (radially inwards) using `PRESET_SPRING_SMOOTH` (reverse).

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.
> 5.  **Dynamic Content Handling**: Ensure the `motion` components are correctly keyed when displaying dynamic central images and descriptions to enable proper exit/enter animations using `AnimatePresence`.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as per instructions.
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

const textVariants = {
  initial: { opacity: 0, x: -50, filter: "blur(8px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 } },
  exit: { opacity: 0, x: -20, filter: "blur(4px)", transition: { ease: [0.4, 0, 0.2, 1], duration: 0.3 } },
};

const imageVariants = {
  initial: { opacity: 0, scale: 0.5, filter: "blur(10px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: physicsConfig },
  exit: { opacity: 0, scale: 0.8, filter: "blur(5px)", transition: physicsConfig },
};

// Simplified representation of small images scattering
const scatterVariants = {
  active: (custom: { x: number; y: number; opacity: number; scale: number }) => ({
    x: custom.x,
    y: custom.y,
    opacity: custom.opacity,
    scale: custom.scale,
    transition: { type: "spring", stiffness: 100, damping: 15, mass: 0.5 },
  }),
  inactive: { x: 0, y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15, mass: 0.5 } },
};

const categories = [
  { id: "engineered-light", name: "Engineered Light", description: "A precise study of machines, optics...", imageUrl: "https://via.placeholder.com/300/409EFF/FFFFFF?text=EngineeredLight" },
  { id: "sacred-grace", name: "Sacred Grace", description: "A quiet study of faith, light, and divine presence...", imageUrl: "https://via.placeholder.com/300/7F00FF/FFFFFF?text=SacredGrace" },
  { id: "afterimage-bodies", name: "Afterimage Bodies", description: "A dreamlike study of blurred identity...", imageUrl: "https://via.placeholder.com/300/FF007F/FFFFFF?text=AfterimageBodies" },
  { id: "soft-geometry", name: "Soft Geometry", description: "A warm study of shape, color, and emotion...", imageUrl: "https://via.placeholder.com/300/FFD700/000000?text=SoftGeometry" },
];

// Placeholder for individual small images in the cluster
const smallImages = Array.from({ length: 150 }).map((_, i) => {
  const angle = (i / 150) * Math.PI * 2;
  const radius = 100 + Math.random() * 50;
  return {
    id: `thumb-${i}`,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    initialX: Math.cos(angle) * 0, // for initial collapsed state
    initialY: Math.sin(angle) * 0, // for initial collapsed state
    src: `https://picsum.photos/id/${i + 10}/50/50`,
  };
});


export const WebGLInteractiveExplorer = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const selectedCategory = categories.find((cat) => cat.id === activeCategory);
  const isCentralImageActive = activeCategory !== null;

  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Description Panel (Left) */}
      <div className="absolute left-10 w-1/4 max-w-sm z-20">
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              key={selectedCategory.id + "-description"}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-gray-800 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-bold mb-2">{selectedCategory.name}</h2>
              <p className="text-sm">{selectedCategory.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Cluster */}
      <div className="relative w-[500px] h-[500px] flex items-center justify-center">
        {/* Central Large Image */}
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.img
              key={selectedCategory.id + "-main-image"}
              src={selectedCategory.imageUrl}
              alt={selectedCategory.name}
              className="absolute rounded-lg shadow-2xl object-cover"
              style={{ width: 300, height: 300 }}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
          )}
        </AnimatePresence>

        {/* Small Images in Cluster */}
        <div className="absolute inset-0 flex items-center justify-center">
          {smallImages.map((img, index) => (
            <motion.img
              key={img.id}
              src={img.src}
              alt="thumbnail"
              className="absolute rounded-sm"
              style={{ width: 40, height: 40 }}
              initial={{ x: img.initialX, y: img.initialY, opacity: 0.5, scale: 0.8 }}
              animate={isCentralImageActive ? "active" : "inactive"}
              custom={{
                x: img.x * (isCentralImageActive ? 1.5 : 1), // Scatter further when active
                y: img.y * (isCentralImageActive ? 1.5 : 1),
                opacity: isCentralImageActive ? 0.2 : 1,
                scale: isCentralImageActive ? 1.1 : 1,
              }}
              variants={scatterVariants}
              transition={{ ...physicsConfig, delay: index * 0.005 }} // Subtle stagger for scatter
            />
          ))}
        </div>
      </div>


      {/* Category List (Right) */}
      <div className="absolute right-10 w-1/4 max-w-[200px] text-right z-20">
        <ul className="space-y-2">
          {categories.map((category) => (
            <motion.li
              key={category.id}
              className={`cursor-pointer text-gray-700 font-medium text-lg
                ${activeCategory === category.id ? "text-blue-600 font-bold" : "hover:text-gray-900"}
              `}
              whileHover={{ scale: 1.05, x: -5, color: "#1a202c" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};
```