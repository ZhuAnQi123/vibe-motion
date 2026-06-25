---
version: alpha
name: scroll-parallax-stagger-reveal
name_zh: "流式滚动视差与非对称交错揭示"
cover_video: "../assets/scroll-parallax-stagger-reveal.mp4"
components: ["卡片组件", "图文流布局", "网格系统"]
effects: ["滚动视差", "揭示过渡", "异步位移"]
interaction_types: ["滚动联动", "视差悬浮"]
description: >
  这是一个基于页面滚动深度的非对称视差联动动效。当用户向下滚动时，左侧大字体的文本流以标准速率位移，而右侧的插图、卡片及背景色块以略微滞后或加速的“异步速度”向上推移。这种物理速度差消除了传统网页滚动的生硬感，营造出元素仿佛悬浮在不同空间维度的“流体层叠感”。
trigger_words: [滚动视差、异步交错、非对称流、视觉层叠]
website: "https://safetonet.com"

motion_tokens:
  # 推荐使用滚动轴驱动的线性映射 (Scroll-Driven Animations)
  scroll_mapping:
    text_layer: "speed * 1.0"
    image_card_layer: "speed * 1.25" # 略微加快，形成超越文字的动态包抄感
    background_gradient: "speed * 0.8" # 慢速大面积移动，保证视觉重心稳固

  # 如果使用基于 Framer Motion 的 Webhook 触发
  spring:
    stiffness: 120
    damping: 25
    mass: 1.2

  css_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "滚动进度实时关联"

  variants:
    initial: { opacity: 0, y: 60 }
    animate: { opacity: 1, y: 0 }
---

# 流式滚动视差与非对称交错揭示规范

## 1. 动效体感 (Feel & Vibe)

- **视觉感受**：**空间层叠感、呼吸感、叙事平滑**。通过打破传统的“整页齐头并进”的滚动模式，赋予页面深度的 Z 轴空间幻觉。
- **交互逻辑**：
  - **视差联动**：随着用户向下滚动，页面右侧的带有圆角的彩色渐变容器（如 "The Gold Standard", "Turning the Lights On" 卡片）以比左侧纯文本略快的速度（大约 1.2 倍系数）向上滑入。
  - **留白呼吸**：元素之间并非紧密排列，而是随着滚动在交错的位移差中释放出更多负空间（Negative Space），使得多图文排版在运动中保持呼吸感，避免视觉压迫。
- **适用场景**：企业官网产品功能介绍、品牌故事长叙事页面、艺术设计类作品集展示。

## 2. 媒体参考 (Reference Asset)

> 动态行为源自实际网页的滚动行为捕获。

- **文件路径**：`../assets/scroll-parallax-stagger-reveal.mp4`
- **来源引用**：SafeToNet 官方网站产品介绍流

## 3. 技术实现要点 (Implementation Details)

### 推荐库

- **首选**：Framer Motion (结合 `useScroll` 与 `useTransform`) 或 ScrollTrigger (GSAP)
- **次选**：现代 CSS `animation-timeline: scroll()` (原生滚动驱动动画)

### 关键属性

- **异步转化系数**：必须对左右两侧的容器设置不同的 `y` 轴偏移映射区间。例如左侧 `y` 从 0 到 -100，右侧卡片 `y` 从 50 到 -150。
- **视口预加载 (Will-Change)**：由于大面积带渐变色及圆角的阴影卡片（如 "The Gold Standard" 的毛玻璃/白底卡片）在视差滚动时极易引发浏览器重绘（Repaint），必须对滚动视差图层开启 `will-change: transform` 以激活 GPU 硬件加速，防止滚动撕裂。

## 4. 示例代码骨架 (Code Skeleton)

```tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ParallaxSection = () => {
  const containerRef = useRef(null);

  // 监听容器相对于视口的滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 核心：为文字和卡片赋予不同的滚动位移系数（非对称位移）
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const cardY = useTransform(scrollYProgress, [0, 1], [100, -150]); // 移动速度更快，形成赶超视差
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-between px-12 py-24 overflow-hidden"
    >
      {/* 左侧文字层 */}
      <motion.div style={{ y: textY }} className="w-1/2 max-w-xl">
        <h2 className="text-6xl font-serif tracking-tight text-gray-900 leading-none">
          Turning the Lights On
        </h2>
        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          SafeToNet shines a light on the unprotected, darker side of the
          Internet...
        </p>
      </motion.div>

      {/* 右侧加速滑入的视差卡片层 */}
      <motion.div
        style={{ y: cardY }}
        className="w-5/12 bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-100"
      >
        <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-300 rounded-xl mb-6 overflow-hidden">
          {/* 插图或动态元素 */}
        </div>
        <h3 className="text-2xl font-bold mb-2">The Gold Standard</h3>
        <p className="text-sm text-gray-500">Real-time on-device protection.</p>
      </motion.div>
    </div>
  );
};
```

## 5. 易错点与禁忌 (Gotchas & Don'ts)

- **忌位移系数过大**：视差滚动的异步系数不可调得过于激进（右侧速度超过左侧 1.5 倍以上），否则会导致用户在快速滚动时产生眩晕感，或导致内容过早滑出屏幕、与上下游组件发生视觉重叠（Overlap 冲突）。
- **动能平滑处理**：如果用户使用的是机械鼠标滚轮（带段落感），原生的滚动会非常生硬。建议页面配合 `lenis` 或 `smooth-scrollbar` 进行平滑滚动拦截，才能完美还原视频中那种如同奶油般丝滑的推进体感。
- **移动端降级**：在手机或平板端，由于屏幕宽度限制，双栏布局会降级为单栏垂直排列。此时**必须关闭 Z 轴/Y 轴的视差错位**，恢复为正常的流式线性滚动，否则会导致极差的阅读阻碍。
