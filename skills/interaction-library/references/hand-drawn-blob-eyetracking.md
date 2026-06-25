---
version: alpha
name: hand-drawn-blob-eyetracking
name_zh: "手绘涂鸦软泥与视线追踪联动动效"
cover_video: "../assets/hand-drawn-blob-eyetracking.mp4"
components: ["手绘画布", "视线追踪组件", "物理弹性图层"]
effects:
  ["线条逐帧抖动 (Line Boiling)", "果冻形变 (Squish/Blob)", "瞳孔约束位移"]
interaction_types: ["鼠标跟随", "多层视差推离"]
description: >
  这是一个极具个性和趣味性的手绘涂鸦风交互空间。中心是由粉色不规则线条构成的“软泥怪”面部，其边缘伴随着手绘特有的随机微幅抖动。当鼠标在屏幕上移动时，面部的眼睛会产生平滑的视线追踪；同时，原本重叠在面部下方的文字（Hello, Design, World, Play, Let's）会被一种无形的“排斥力”向四周推开，形成非线性的发散视差。
trigger_words: [手绘风、逐帧抖动、史莱姆形变、视线追踪、交互排斥]
website: "未知（实验性创意设计）"

motion_tokens:
  # 眼神追踪的物理弹性
  eye_tracking_spring:
    stiffness: 250
    damping: 22
    mass: 0.6

  # 背景文字被推开的排斥系数
  text_repulsion:
    max_displacement: 120 # 最大被推开的像素距离
    radius: 300 # 鼠标影响的半径范围

  # 线条抖动频率 (SVG Noise Filter)
  line_boiling:
    frequency_hz: 8 # 每秒改变 8 次噪声基频，模拟手绘逐帧
    base_frequency: 0.02
---

# 手绘涂鸦软泥与视线追踪联动规范

## 1. 动效体感 (Feel & Vibe)

- **视觉感受**：**俏皮、灵动、不完美主义（Wabi-Sabi）**。通过打破数字界面的绝对平滑与规则几何，利用模拟有机的“不规则手绘线条”和“软泥弹性”，让界面充满幽默感。
- **交互逻辑**：
  - **常态动画（Idle Motion）**：即使鼠标不动，所有的粉色手绘线条（包括背景文字和面部轮廓）也在以约 8Hz-12Hz 的频率进行微小的**波纹扭曲（Boiling Effect）**，假装自己是逐帧动画。
  - **眼神跟随（Eye Tracking）**：眼珠（内圈实心粉圆）会跟随鼠标指针位置在眼白（外圈圆环）内部移动。运动带有轻微的延迟感（Damping），且边缘有硬性边界约束，不会跳出眼白。
  - **文字排斥视差（Text Repulsion）**：初始状态下，手绘文字重叠堆积在面部中心；当鼠标晃动激活交互后，文字根据其距离中心的角度，如同被吹散一般向四周平滑位移，鼠标移开后缓慢回弹。

## 2. 媒体参考 (Reference Asset)

- **文件路径**：`../assets/hand-drawn-blob-eyetracking.mp4`
- **来源引用**：手绘风格创意前端交互

## 3. 技术实现要点 (Implementation Details)

### 推荐库

- **首选方案**：React + Framer Motion (用于处理鼠标位移与文字的弹性排斥) + **原生 SVG `<filter>` (用于实现线条抖动)**。
- **关键突破点（如何做出手绘抖动感？）**：
  无需真的画好几帧图片切换，在 CSS 中挂载一个 SVG 的 `feTurbulence`（湍流噪声）滤镜，用 JavaScript 写一个定时器（或 `requestAnimationFrame`），每隔 100ms 随机微调 `baseFrequency` 或 `seed` 的数值，即可让包裹该滤镜的 HTML 文字和 SVG 线条产生极其逼真的手绘抖动特效。

```html
<svg
  xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
  style="display:none"
>
  <filter id="hand-drawn-filter">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.04"
      numOctaves="2"
      result="noise"
      seed="1"
    />
    <feDisplacementMap
      in="SourceGraphic"
      in2="noise"
      scale="4"
      xChannelSelector="R"
      yChannelSelector="G"
    />
  </filter>
</svg>
```

### 关键属性

- **眼神边界计算**：
  设眼白中心坐标为
  $$(X_0, Y_0)$$

，眼白半径为
$$R_{white}$$

，眼珠半径为
$$R_{pupil}$$

。当鼠标位于
$$(X_m, Y_m)$$

时，计算目标向量，眼珠的最大移动矢量模长不得超过
$$R_{white} - R_{pupil}$$

。

- **排斥动画硬件加速**：背景文字推开时，必须通过 `transform: translate3d(x, y, 0)` 实现，切勿改动 `top/left`。

## 4. 示例代码骨架 (Code Skeleton)

```tsx
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export const HandDrawnHero = () => {
  const [filterSeed, setFilterSeed] = useState(1);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 使用 Spring 增加眼珠移动的丝滑阻尼感
  const eyeX = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const eyeY = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });

  // 1. 定时器：驱动 SVG 滤镜的 Seed 改变，制造手绘每秒抖动感 (Line Boiling)
  useEffect(() => {
    const interval = setInterval(() => {
      setFilterSeed(Math.random() * 100);
    }, 120); // 约 8 帧/秒
    return () => clearInterval(interval);
  }, []);

  // 2. 监听鼠标移动，映射给眼珠 (限制在最大 15px 的范围内)
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 归一化计算 (-1 到 1)
    const moveX = (clientX / width - 0.5) * 2 * 15;
    const moveY = (clientY / height - 0.5) * 2 * 15;

    eyeX.set(moveX);
    eyeY.set(moveY);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-[#fcf5ec] flex items-center justify-center overflow-hidden"
      style={{ filter: "url(#hand-drawn-sketch)" }} // 全局挂载手绘滤镜
    >
      {/* 动态 SVG 滤镜定义 */}
      <svg className="absolute w-0 h-0">
        <filter id="hand-drawn-sketch">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="1"
            seed={filterSeed}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
        </filter>
      </svg>

      {/* 背景手绘文字（此处仅写一个示意排斥，实际需结合鼠标距离计算） */}
      <motion.div className="absolute text-pink-400 font-bold text-7xl select-none">
        Design
      </motion.div>

      {/* 中心怪脸容器 */}
      <div className="relative w-80 h-80 border-4 border-pink-500 rounded-full flex items-center justify-center">
        {/* 左眼 */}
        <div className="absolute left-24 top-28 w-12 h-12 border-4 border-pink-500 rounded-full flex items-center justify-center bg-white">
          <motion.div
            style={{ x: eyeX, y: eyeY }}
            className="w-5 h-5 bg-pink-500 rounded-full"
          />
        </div>
        {/* 右眼 */}
        <div className="absolute right-24 top-28 w-12 h-12 border-4 border-pink-500 rounded-full flex items-center justify-center bg-white">
          <motion.div
            style={{ x: eyeX, y: eyeY }}
            className="w-5 h-5 bg-pink-500 rounded-full"
          />
        </div>
        {/* 标志性大鼻子线条 */}
        <svg className="absolute w-16 h-20 top-36 fill-none stroke-pink-500 stroke-[4px]">
          <path d="M 10 10 Q 40 20 20 60" />
        </svg>
      </div>
    </div>
  );
};
```

## 5. 易错点与禁忌 (Gotchas & Don'ts)

- **忌滤镜频率过快或形变（Scale）过大**：`feDisplacementMap` 的 `scale` 属性如果大于 `8`，线条会碎裂解体，产生电子噪声感，从而失去“手绘”的温润感；抖动间隔（Interval）维持在 `100ms - 150ms` 最为舒适，太快会引起视觉疲劳甚至像屏幕闪烁故障。
- **文字排斥的归位边界**：鼠标离开视口（MouseLeave）或停止移动时，背景文字必须丝滑地弹回原始叠加状态，回弹动效的 `damping` 必须偏高，避免文字像硬质弹簧一样无休止地晃动。
