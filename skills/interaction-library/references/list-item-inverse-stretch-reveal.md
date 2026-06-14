````yaml
version: alpha
name: list-item-inverse-stretch-reveal
description: >
  这是一种带有明显物理拉伸感与反色遮罩效果的列表项切换动效。当鼠标在列表间穿梭时，黑色高亮背景块在不同项之间以一种动态拉伸、挤压并伴随错位擦除的方式流转，营造出极强的果冻般物理弹性。
  触发词：弹性反色块, 纵向拉伸切换, 错位遮罩擦除, 液体弹性高亮, 列表果冻流转

# 结构化的物理动效参数（供 AI 读取，极度重要）
motion_tokens:
  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: 420
    damping: 24
    mass: 0.9

  # CSS 缓动曲线与时间
  css_easing: "cubic-bezier(0.175, 0.885, 0.32, 1.15)"
  duration: "450ms"

  # 关键变体状态流转
  variants:
    hover_bg:
      initial: { scaleY: 0.3, opacity: 0 }
      animate: { scaleY: 1, opacity: 1 }
    text_content:
      initial: { color: "#000000", y: 0 }
      hover_active: { color: "#ffffff", y: [0, -4, 0] }
---

# 弹性反色拉伸列表 (List Item Inverse Stretch Reveal) 规范

## 1. 动效体感 (Feel & Vibe)
- **视觉感受**：动效呈现出一种类似**液体/果冻在狭缝中瞬间拉伸并填充**的趣味物理质感。黑色高亮条在切换时，并不是死板地在项与项之间生硬淡入，而是展现出一种在纵向上先拉伸膨胀、再快速收缩就位的“动态弹性肉感”。
- **交互逻辑**：当鼠标指针滑入某个列表项（如 *Wesley College Website*）时，底层的黑色矩形背景从中心或移动方向瞬间纵向拉伸展开。文字颜色随之从纯黑反转为纯白。当指针快速向下移动到其他项时，黑块会带有一定的**物理拖拽形变（Stretch）**，并将上一个项的文字以错位擦除的形式送出，同时将新项平滑吞噬并高亮。
- **适用场景**：创意设计工作室官网项目列表、极简大字报式交互菜单、个性化导航组件。

## 2. 媒体参考 (Reference Asset)
- **文件路径**：`../assets/list-item-inverse-stretch-reveal.mp4`

## 3. 技术实现要点 (Implementation Details)
### 推荐库
- **首选**：Framer Motion (非常适合处理带有 `layoutId` 的跨元素背景共享布局动画，能天然实现拉伸形变流转)。
### 关键属性
- **共享布局弹性（Shared Layout Stretch）**：给高亮背景矩形设置相同的 `layoutId="active-bg"`。当改变激活索引时，Framer Motion 会自动计算新旧位置的几何差异，自动生成视频中那种神奇的拉伸果冻感。
- 为了完美重现视频中文字随之微微错位和反色的体感，建议使用双层文本结构配合 `clip-path`，或者在激活状态下对文字应用微弱的 `y` 轴震荡。
- 背景必须保持完美的纯黑/纯白高对比反色，以凸显排版的利落与力量感。

## 4. 示例代码骨架 (Code Skeleton)
```tsx
import React, { useState } from 'react';
import { motion, LayoutGroup } from 'framer-motion';

const ITEMS = [
  'Wesley College Website',
  'Korowa Website',
  'AMPLIFY Website',
  'Melbourne Girls Grammar Website',
  'Chargefox Website',
  'AFL Players\' Association Website'
];

export const ElasticInvertList = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 还原视频中高刚度、低阻尼、略带过冲果冻感的弹簧参数
  const elasticSpring = { type: 'spring', stiffness: 420, damping: 24, mass: 0.9 };

  return (
    <LayoutGroup>
      <div className="w-full max-w-2xl bg-white text-black font-sans p-4 border-t border-b border-black select-none">
        {ITEMS.map((item, index) => {
          const isHovered = hoveredIdx === index;
          return (
            <motion.div
              key={item}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative flex items-center h-20 px-6 border-b border-gray-200 last:border-none cursor-pointer overflow-hidden"
            >
              {/* 核心：共享 layoutId 的动态拉伸背景块 */}
              {isHovered && (
                <motion.div
                  layoutId="elasticStickyBg"
                  initial={{ scaleY: 0.8 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0.8 }}
                  transition={elasticSpring}
                  className="absolute inset-0 bg-black z-0 origin-center"
                />
              )}

              {/* 列表文字内容：根据激活状态反色，并带有微弱的物理震荡微调 */}
              <motion.span
                animate={{
                  color: isHovered ? '#ffffff' : '#000000',
                  y: isHovered ? [0, -3, 0] : 0
                }}
                transition={{
                  color: { duration: 0.15 },
                  y: elasticSpring
                }}
                className="text-2xl font-medium tracking-tight z-10"
              >
                {item}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </LayoutGroup>
  );
};

````

## 5. 易错点与禁忌 (Gotchas & Don'ts)

- **绝对不要**：对高亮背景块使用普通的 `transition: top 0.3s`，这会导致矩形块只是生硬地整体平移，完全丢失视频中黑块在两个列表项之间动态拉伸、变形的物理液体感。
- **绝对不要**：忽略快速扫过列表时的状态堆积。当鼠标从第一项极速划到第六项时，动画必须能跟手打断。通过使用 Framer Motion 的 `LayoutGroup` 结合较低的物理质量（`mass: 0.9`），可以完美避免高亮块产生严重滞后的黏滞效应。
- **布局兜底**：列表项必须拥有固定的高度（如示例中的 `h-20`），确保背景块在计算布局形变（Scale / Position）时拥有绝对对称的边界参照，防止高度不一致引起的形变坍塌。

```

```
