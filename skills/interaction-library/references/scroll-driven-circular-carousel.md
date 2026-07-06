---
version: beta-v2
name: scroll-driven-circular-carousel
name_zh: "滚动驱动圆弧传送带交互"
cover_video: "../assets/scroll-driven-circular-carousel.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/scroll-driven-carousel.mp4"
components: ["Carousel", "ScrollWrapper"]
effects: ["Fluid Expand", "Scroll-driven"]
interaction_types: ["Scroll-driven"]
description: >
  这是一个由页面滚动驱动的圆弧传送带叙事交互。随着用户向下滚动，底部的巨大圆形刻度盘（轨道）发生旋转，原本位于两侧的卡片/数字（"01", "02", "03"）和插画元素沿着弧形轨道依次切入视觉中心，并相对应地伴随淡入、缩放与微弱的浮动物理感，形成了一种沉浸式的产品特点探索体验。
  触发词：[滚动驱动、圆弧旋转、切入切出、叙事传送带]
website: "https://buckssauce.com/"

# ==========================================
# VISION-AGENT GUIDE: 动效物理预设词典
# ==========================================
motion_tokens:
  selected_preset: "PRESET_EASE_OUT_EXPO"
  transform_origin: "center 800px" # 以底部轨道圆心作为旋转原点
  stagger_delay: "0ms"

  # Framer Motion / CSS 映射参数
  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "scroll-linked"

  # 结构化状态变体
  variants:
    left_offscreen: { opacity: 0.2, rotate: -30, scale: 0.8 }
    active_center: { opacity: 1, rotate: 0, scale: 1 }
    right_offscreen: { opacity: 0.2, rotate: 30, scale: 0.8 }
---

# 滚动驱动圆弧传送带交互 / Scroll-driven Circular Carousel Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Linear-Smooth (Scroll-linked)
- **Core Experience**: 组件的运动完全由页面的滚动进度（`scrollYProgress`）锁定。卡片组并非直线横移，而是附着在一个巨大的不可见圆形轨道的边缘。滚动时，卡片伴随着角度旋转（Rotate）与缩放（Scale）顺畅过渡，当元素滑向舞台中央时，其透明度变满、字重或比例达到顶峰，带来极强的空间感和方向操控感。
- **Interaction Flow**: Scroll Down -> Circle Track Rotates Clockwise -> Card 01 moves out (Rotate left, Fade) -> Card 02 moves in (Rotate to center, Scale up to 1.0) -> Card 03 follows on track.

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Scroll ScrollContainer]** (`div` - Section Wrapper)
  - 使用 `scroll-timeline` 或 `useScroll` 捕获当前区域的滚动容器，高度通常设为 `200vh` - `300vh` 以锁定视口（Sticky Position）。
- **[Rotating Track Ring]** (`motion.div` - Inner Carousel Container)
  - 设置绝对定位与极大的 `transform-origin`（如 `center 100%` 或具体像素），接收滚动进度并直接转化为 `rotate` 属性。
- **[Carousel Item Cards]** (`motion.div` - Item Wrapper)
  - 分布在圆环上的子节点，分别设置初始的角度偏置。在自身接近视口中心时，触发自身的局部 `opacity` 和 `scale` 变化。

## 3. Detailed Timeline Sequence (时序编排)

- **[Scroll Progression 0% - 33%] Phase 1**:
  - 第一组卡片 "01" 处于中心（`rotate: 0deg`, `opacity: 1`）。随着滚动加深，大容器整体顺时针旋转，"01" 旋转至 `-25deg` 并淡出。
- **[Scroll Progression 33% - 66%] Phase 2**:
  - 第二组卡片 "02" 伴随旋转从右侧（`25deg`）滑入到正中央（`0deg`），同时放大至 `1.0`，文本内容显现。
- **[Scroll Progression 66% - 100%] Phase 3**:
  - 重复该圆弧传送交替，"02" 旋出，"03" 旋转切入。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Priority**: 优先使用现代浏览器原生 CSS `@scroll-timeline` 或 Framer Motion 的 `useScroll` 与 `useTransform`。
> 2. **Performance Guard**: 必须将轨道旋转限制在单个容器的 `transform: rotate()`，严禁对多张卡片进行独立的复杂绝对定位重算，以防止滚动导致严重的掉帧（Jank）。

## 5. Generated Code Skeleton (示例代码)

```tsx
// Complete production-ready implementation of Scroll-driven Circular Carousel
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const CircularCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 捕获该容器在视口中的滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 将滚动进度（0 到 1）映射为圆环的旋转角度（从 0deg 到 -60deg）
  const trackRotation = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const items = [
    { id: "01", title: "SMALL BATCHES", desc: "Small runs. No conveyor belts..." },
    { id: "02", title: "REAL INGREDIENTS", desc: "Real fruit. Fresh peppers. No syrups..." },
    { id: "03", title: "OH, THIS?", desc: "Philly Hot Sauce Fest Winner..." }
  ];

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-[#0d0a07] text-white">
      {/* 钉住视口的核心展示区域 */}
      <div className="sticky top-0 flex flex-col items-center justify-center h-screen overflow-hidden">
        
        {/* 弧形大轨道容器 */}
        <motion.div
          style={{ 
            rotate: trackRotation,
            transformOrigin: "center 1200px" // 极其重要的中心原点外置设定
          }}
          className="absolute top-[20vh] flex justify-center w-[2000px] h-[2000px]"
        >
          {items.map((item, index) => {
            // 每张卡片根据索引在圆环上平铺（间隔 30 度）
            const itemRotation = index * 30; 

            return (
              <div
                key={item.id}
                style={{
                  transform: `rotate(${itemRotation}deg)`,
                  transformOrigin: "center 1200px",
                  position: "absolute"
                }}
                className="w-[400px] text-center flex flex-col items-center"
              >
                <span className="text-[12rem] font-bold opacity-20 block leading-none">{item.id}</span>
                <div className="px-6 py-2 bg-[#fcf9f2] text-black font-bold rounded-full uppercase tracking-wider text-sm my-4">
                  ✦ {item.title}
                </div>
                <p className="text-gray-400 text-lg max-w-sm">{item.desc}</p>
              </div>
            );
          })}
        </motion.div>
        
        {/* 视口中心辅助线或静态装饰元素可在此层叠 */}
        <div className="absolute bottom-10 w-full text-center pointer-events-none opacity-30">
          ─── ✦ ───
        </div>
      </div>
    </div>
  );
};
```