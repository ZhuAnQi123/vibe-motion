````yaml
version: alpha
name: typographic-carousel-slide
name_zh: "排版轮播滑动切换"
cover_video: "../assets/typographic-carousel-slide.mov"
description: >
  这是一种极具视觉冲击力的巨型排版视差无缝滚动（轮播）切换动效。通过巨型背景文字、段落文本以非对称的物理速度进行纵向视差推移，创造出一种宛如巨幕拉开、层级分明的空间穿梭体感。
  触发词：巨幕视差滚动, 纵向无缝轮播, 排版层级推移, 丝滑物理非对称, 空间穿梭感

# 结构化的物理动效参数（供 AI 读取，极度重要）
motion_tokens:
  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: 180
    damping: 24
    mass: 1.4

  # CSS 缓动曲线与时间
  css_easing: "cubic-bezier(0.25, 1, 0.3, 1)"
  duration: "800ms"

  # 关键变体状态流转
  variants:
    bg_giant_text:
      initial: { y: "100%", opacity: 0.1 }
      animate: { y: "0%", opacity: 0.15 }
      exit: { y: "-100%", opacity: 0 }
    body_text:
      initial: { y: 120, opacity: 0 }
      animate: { y: 0, opacity: 1 }
      exit: { y: -120, opacity: 0 }
components: ["Carousel"]
effects: ["Slide"]
---

# 巨幕排版视差轮播 (Typographic Carousel Slide) 规范

## 1. 动效体感 (Feel & Vibe)
- **视觉感受**：整体动效呈现出一种**宏大、沉稳且具有深度空间感**的视觉体感。由于不同层级的元素（巨型背景字、正文、小图标）上升速度不一致，形成了一种强烈的“三维视差”错觉，文字的进出场极为丝滑，像是在浏览实体艺术展。
- **交互逻辑**：当页面触发切换（滚动或点击）时，当前屏的内容整体向上滑出并淡出。下一屏的元素从下方以**非对称的速度**错落涌现：巨型的背景品牌词（如 *MONOLOG*）以极大的动量首先重构视觉中心，而细腻的正文段落则稍显滞后地平滑上浮就位，带有大质量物体的温和惯性回弹。
- **适用场景**：高端品牌官网首页（Hero Section）、故事性强的内容叙事转场、沉浸式数字展厅介绍。

## 2. 媒体参考 (Reference Asset)
- **文件路径**：`../assets/typographic-carousel-slide.mp4`

## 3. 技术实现要点 (Implementation Details)
### 推荐库
- **首选**：Framer Motion 配合 `AnimatePresence`（利用非对称的 `transition.delay` 和不同的 `stiffness` 完美还原多层视差）。
### 关键属性
- **多层视差（Multi-layered Tailwind/CSS）**：必须将背景巨字、正文、地球图标分为独立图层（Layer）。
- 背景巨字推荐使用 `vh` / `vw` 或 `clamp()` 实现响应式超大排版，且需开启 `will-change: transform`。
- 动画主要通过 `y`（轴位移）和 `opacity` 驱动，绝对不要去动物理布局宽高，以确保 60fps/120fps 的高刷流畅度。

## 4. 示例代码骨架 (Code Skeleton)
```tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideData {
  id: number;
  bgWord: string;
  subTitle?: string;
  bodyText: string;
}

export const TypographicCarousel: React.FC<{ activeIndex: number; slides: SlideData[] }> = ({ activeIndex, slides }) => {
  const current = slides[activeIndex];

  // 模拟视频中大质量物体的舒缓弹簧
  const baseSpring = { stiffness: 180, damping: 24, mass: 1.4 };

  return (
    <div className="relative w-full h-screen bg-[#0d0d0d] text-white overflow-hidden flex flex-col justify-between p-16 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="absolute inset-0 w-full h-full flex flex-col justify-center px-20"
        >
          {/* Layer 1: 巨型背景字（视差速度：快，位移距离大） */}
          <motion.div
            initial={{ y: '80%', opacity: 0 }}
            animate={{ y: '0%', opacity: 0.12 }}
            exit={{ y: '-80%', opacity: 0 }}
            transition={{ ...baseSpring, type: 'spring' }}
            className="absolute left-0 right-0 text-center font-black text-[25vw] tracking-tighter text-neutral-400 select-none pointer-events-none z-0"
            style={{ top: '15%' }}
          >
            {current.bgWord}
          </motion.div>

          {/* Layer 2: 上方辅助信息与图标（轻微滞后入场） */}
          {current.subTitle && (
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ ...baseSpring, type: 'spring', delay: 0.1 }}
              className="z-10 max-w-md text-sm text-neutral-400 mb-8 space-y-2"
            >
              <div className="w-8 h-8 border border-neutral-600 rounded-full flex items-center justify-center mb-4">🌐</div>
              <p>{current.subTitle}</p>
            </motion.div>
          )}

          {/* Layer 3: 主正文段落（视差速度：中，完美跟手） */}
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ ...baseSpring, type: 'spring', delay: 0.05 }}
            className="z-10 text-4xl md:text-5xl font-normal leading-snug max-w-4xl tracking-tight text-neutral-200"
          >
            {current.bodyText}
          </motion.h1>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

````

## 5. 易错点与禁忌 (Gotchas & Don'ts)

- **绝对不要**：让各图层的进入动画时间与位移完全一致。如果没有**时间差（Delay）**和**速度差（Velocity Diff）**，整个动效就会退化为普通的平面滑动，失去视频中惊艳的“巨幕剥离感”。
- **绝对不要**：忽略巨型文字在移动时的边缘裁剪。由于字体极大，必须确保外层容器拥有 `overflow: hidden`，同时避免因字体渲染（Font Rendering）导致低端设备上的短暂卡顿（可开启 `text-rendering: optimizeLegibility`）。
- **交互兜底**：由于该动效涉及全屏多图层渲染，切换频率不宜过高。建议在用户滚动触发时，加入至少 `800ms` 的滚动截断锁定（Scroll Lock），等待上一屏动画完全进入稳定态后，再允许响应下一次滚动。

```

```
