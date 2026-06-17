```yaml
version: alpha
name: kinetic-scroll-typography-reveal
cover_video: ""
description: >
  这是一种带有明显物理阻尼感与动态遮罩擦除的卡片切换与文字启幕动效。适用于高端作品集、创意工作室官网或画廊展示等强调排版美感与视觉叙事的场景。
  触发词：视差擦除, 物理滚动切换, 动态遮罩, 文字启幕, 阻尼滑块

# 结构化的物理动效参数（供 AI 读取，极度重要）
motion_tokens:
  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: 280
    damping: 26
    mass: 1.2
  
  # CSS 缓动曲线与时间
  css_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "550ms"
  
  # 关键变体状态流转
  variants:
    initial: { opacity: 0, y: 40, clipPath: "inset(100% 0% 0% 0%)" }
    animate: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }
    exit: { opacity: 0, y: -40, clipPath: "inset(0% 0% 100% 0%)" }
components: []
effects: []
---

# 动力学滚动文字启幕 (Kinetic Typography Reveal) 规范

## 1. 动效体感 (Feel & Vibe)
- **视觉感受**：动效呈现出一种高级的**杂志翻页感与液体擦除感**。新卡片切入时，文字并不是生硬地平移，而是伴随着由下至上的 `clip-path` 遮罩解冻，如同墨水在纸张上舒展，带有温和且沉稳的阻尼回弹。
- **交互逻辑**：点击切换箭头（或检测到滚动触发）后，当前卡片整体向上位移并向上方边缘“擦除隐藏”；与此同时，新卡片从下方微微上浮，通过非对称的遮罩剪裁快速“擦除展开”，文字伴随轻微的纵向视差平滑就位。
- **适用场景**：名人名言、客户评价（Testimonials）、品牌故事、大字报排版展示。

## 2. 媒体参考 (Reference Asset)
- **文件路径**：`../assets/kinetic-scroll-typography-reveal.mp4`

## 3. 技术实现要点 (Implementation Details)
### 推荐库
- **首选**：Framer Motion (便于管理 `AnimatePresence` 退出动画及物理弹簧参数)。
### 关键属性
- 使用 CSS `clip-path: inset(...)` 属性实现文字与图片的上下擦除裁剪效果。
- 必须对 `transform (y)` 和 `clip-path` 开启硬件加速。
- 文字部分可微调 `letter-spacing` 或配合少许 `skew-y`（纵向倾斜）来增强速度感。

## 4. 示例代码骨架 (Code Skeleton)
```tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestimonialProps {
  currentIdx: number;
  data: { text: string; author: string; company: string }[];
}

export const KineticReveal: React.FC<TestimonialProps> = ({ currentIdx, data }) => {
  // 定义符合视频体感的物理阻尼配置
  const springConfig = { stiffness: 280, damping: 26, mass: 1.2 };

  return (
    <div className="relative w-full h-[400px] overflow-hidden bg-[#0a0a0a] text-white p-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 40, clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ opacity: 0, y: -40, clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{
            type: 'spring',
            ...springConfig,
            opacity: { duration: 0.3 } // 渐变稍快于物理位移
          }}
          className="absolute inset-0 flex flex-col justify-between p-12"
        >
          {/* 评价正文 */}
          <h2 className="text-2xl font-light leading-relaxed max-w-2xl tracking-wide">
            "{data[currentIdx].text}"
          </h2>
          
          {/* 作者信息 */}
          <div className="mt-8 flex items-center gap-4">
            <div>
              <p className="font-medium text-lg">{data[currentIdx].author}</p>
              <p className="text-gray-400 text-sm">{data[currentIdx].company}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

```

## 5. 易错点与禁忌 (Gotchas & Don'ts)

* **绝对不要**：使用 `height` 或 `margin-top` 来做内容推移，这会导致浏览器重排（Reflow），引发大面积掉帧。
* **绝对不要**：让退出动画（Exit）的延迟过长。视频中的连续快速点击（如 `01/03` 快速切到 `03/03`）要求动画必须支持**快速打断（Interruptible）**，否则动效会严重堆积。
* **交互兜底**：在切换按钮上必须添加防抖（Debounce）或在动画未进入完全稳定态前禁用点击（直到当前 `AnimatePresence` 锁释放），避免快速连点导致 DOM 节点错位。

```

```