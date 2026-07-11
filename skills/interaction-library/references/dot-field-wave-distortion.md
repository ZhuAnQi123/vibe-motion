---
version: beta-v2
name: dot-field-wave-distortion
name_zh: "点场波纹失真"
cover_video: "../assets/dot-field-wave-distortion.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/dot-field-wave-distortion.mp4"
tags: ["Elastic", "Reveal"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  这是一个抽象的黑白动画点场，其粒子在画面中以波浪般的扭曲形成涟漪，呈现出流体和弹性的体感。粒子根据其与波源的距离，以错开的时间和阻尼弹性效果发生位移，然后再平滑地返回原位。
  触发词：[点场波纹、流体失真、弹性涟漪]
website: "https://x.com/Inspector_9/status/2071285728646950937"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "30ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { x: 0, y: 0, opacity: 1 }
    wave: { y: -15, scale: 1.1, opacity: 0.8 } # Placeholder for wave effect
    return: { x: 0, y: 0, scale: 1, opacity: 1 }
---

# 点场波纹失真 / Dot Field Wave Distortion Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 一个抽象的点场，其单个粒子以一种流体、弹性的方式对屏幕上不可见的“波源”做出反应。当波纹通过时，粒子会从其初始位置轻微位移、可能略微缩放，并带有明显的阻尼回弹感，然后平滑地返回原位。整个过程营造出一种有机且连续的波浪扩散和消散效果。
- **Interaction Flow**: 这是一个自动循环播放的背景动画。波纹随机地在画面中生成并扩散，随后消散，形成一个连续的、无缝的视觉循环。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - Dot Field Container)
  - 充当所有独立点元素的容器，管理整体布局。
- **[Child Node A]** (`div` - Individual Dot)
  - 每个点都是一个独立的元素，通过其相对于“波源”的位置和时间来独立动画。
  - 应用 `transform: translate` (y轴位移) 和 `scale` 来模拟波纹效果。
  - `opacity` 可以略微变化以增强动态感。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 50ms] Wave Origin Trigger**:
  - 动画内部随机选择一个或多个“波源”点。
- **[50ms - 300ms] Dot Displacement & Stagger**:
  - 距离波源最近的点开始向外位移（例如，y 轴负方向）。
  - 这些点的 `y` 轴位移和 `scale` 动画采用 `PRESET_SPRING_SMOOTH` 物理参数。
  - 距离波源较远的点以 `stagger_delay`（基于距离比例）依次触发，形成波浪状扩散。
- **[250ms - 800ms] Return & Dissipation**:
  - 随着波纹的扩散，已经受到影响的点开始使用相同的 `PRESET_SPRING_SMOOTH` 物理参数平滑地返回到其初始位置。
  - 波纹效果持续循环，新的波纹可能会在旧波纹完全消散前开始。

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
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

const DOT_COUNT = 500; // Number of dots
const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 600;
const DOT_SIZE = 4; // Size of each dot
const WAVE_RADIUS = 150; // Radius of the wave influence
const WAVE_STRENGTH = 15; // Max y displacement for a dot

interface DotProps {
  id: number;
  x: number;
  y: number;
  waveCenter: { x: number; y: number } | null;
  waveActive: boolean;
}

const Dot: React.FC<DotProps> = ({ id, x, y, waveCenter, waveActive }) => {
  const [currentY, setCurrentY] = useState(y);

  useEffect(() => {
    if (waveActive && waveCenter) {
      const distance = Math.sqrt(
        Math.pow(x - waveCenter.x, 2) + Math.pow(y - waveCenter.y, 2)
      );

      let displacement = 0;
      let delay = 0;

      if (distance < WAVE_RADIUS) {
        // Calculate displacement based on distance from wave center
        const normalizedDistance = distance / WAVE_RADIUS; // 0 to 1
        // Use a function to make the displacement peak near the center and fall off
        displacement = WAVE_STRENGTH * (1 - normalizedDistance * normalizedDistance);
        // Stagger delay based on distance, so closer dots react first
        delay = normalizedDistance * parseFloat("30ms") * 10; // Scale stagger_delay
      }

      setCurrentY(y - displacement);

      const timer = setTimeout(() => {
        setCurrentY(y); // Return to original position after wave passes
      }, delay + 500); // Allow time for the wave to pass and spring to settle

      return () => clearTimeout(timer);
    } else {
      setCurrentY(y); // Reset if wave is not active
    }
  }, [waveActive, waveCenter, x, y]);

  return (
    <motion.div
      key={id}
      initial={{ x: x, y: y, opacity: 1, scale: 1 }}
      animate={{ y: currentY, opacity: currentY !== y ? 0.8 : 1, scale: currentY !== y ? 1.1 : 1 }}
      transition={{ ...physicsConfig, delay: 0 }} // Delay is handled by the useEffect for wave propagation
      style={{
        position: "absolute",
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: "50%",
        backgroundColor: "white",
      }}
    />
  );
};

export const DotFieldWaveDistortion = () => {
  const dots = useRef<{ x: number; y: number; id: number }[]>([]);
  const [waveCenter, setWaveCenter] = useState<{ x: number; y: number } | null>(null);
  const [waveActive, setWaveActive] = useState(false);

  useEffect(() => {
    // Generate static dot positions once
    if (dots.current.length === 0) {
      dots.current = Array.from({ length: DOT_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * FIELD_WIDTH,
        y: Math.random() * FIELD_HEIGHT,
      }));
    }

    // Periodically trigger a new wave
    const interval = setInterval(() => {
      setWaveActive(false); // Deactivate current wave
      setWaveCenter(null);

      // Randomly choose a new wave center
      const newWaveCenter = {
        x: Math.random() * FIELD_WIDTH,
        y: Math.random() * FIELD_HEIGHT,
      };
      setWaveCenter(newWaveCenter);
      setWaveActive(true);

      // After some time, deactivate the wave to allow dots to settle
      setTimeout(() => {
        setWaveActive(false);
        setWaveCenter(null);
      }, 1500); // Duration of a single wave cycle
    }, 2500); // Interval between new waves

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: FIELD_WIDTH,
        height: FIELD_HEIGHT,
        backgroundColor: "black",
        position: "relative",
        overflow: "hidden", // Ensures dots don't go outside the field
      }}
    >
      {dots.current.map((dot) => (
        <Dot
          key={dot.id}
          {...dot}
          waveCenter={waveCenter}
          waveActive={waveActive}
        />
      ))}
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