```yaml
version: alpha
name: minimalist-text-menu-hover
name_zh: "极简文字菜单悬停"
cover_video: "../assets/minimalist-text-menu-hover.mp4"
description: >
  这是一种极简主义的通栏式文本导航菜单悬停动效。通过反色背景条块的平滑纵向位移（或淡入淡出）以及隐藏箭头的平移显现，为经典列表注入高级的、具有物理质感的交互反馈。
  触发词：极简菜单高亮, 反色背景跟随, 箭头平移显现, 通栏导航, 瞬时阻尼反馈

# 结构化的物理动效参数（供 AI 读取，极度重要）
motion_tokens:
  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: 380
    damping: 32
    mass: 0.8
  
  # CSS 缓动曲线与时间
  css_easing: "cubic-bezier(0.25, 1, 0.5, 1)"
  duration: "300ms"
  
  # 关键变体状态流转
  variants:
    hover_bg:
      initial: { opacity: 0, scaleY: 0.8 }
      hover: { opacity: 1, scaleY: 1 }
    arrow:
      initial: { opacity: 0, x: -20 }
      hover: { opacity: 1, x: 0 }
    text:
      initial: { color: "#8a8a8a" }
      hover: { color: "#000000" }
components: ["Navigation","List","Typography"]
effects: ["Hover"]
---

# 极简文本菜单悬停 (Minimalist Text Menu Hover) 规范

## 1. 动效体感 (Feel & Vibe)
- **视觉感受**：整体动效呈现出一种**干净利落、毫无拖泥带水**的机械精致感。背景高亮块的出现伴随着轻微的纵向拉伸与淡入，文字颜色的反转极其敏捷，右侧箭头的平移滑入为视线提供了完美的视觉终点。
- **交互逻辑**：当鼠标指针划过列表项（如 *About*、*Services*）时，一个通栏的白色矩形块瞬间在文字底层展开，将文字颜色由浅灰/白色反转为纯黑。与此同时，原本隐藏在最右侧的箭头符号（$\rightarrow$）以更快的速度向右方平移滑出，形成视觉动量。
- **适用场景**：极简主义企业官网、全屏通栏导航菜单（Full-screen Overlay Menu）、后台侧边栏核心非激活/激活状态流转。

## 2. 媒体参考 (Reference Asset)
- **文件路径**：`../assets/minimalist-text-menu-hover.mp4`

## 3. 技术实现要点 (Implementation Details)
### 推荐库
- **首选**：CSS Transitions / Tailwind CSS（因为其结构极其规律，纯 CSS 的性能损耗最低）；若需要复杂的跨行背景跟随（Shared Layout），可选用 Framer Motion 的 `layoutId`。
### 关键属性
- 背景块的出现切忌直接动画化 `height`，推荐使用 `transform: scaleY()` 配合 `opacity` 进行融合。
- 右侧箭头使用 `transform: translateX()`，其动画曲线应比背景块略微“陡峭”（即速度更快），以此强调箭头的破局感。
- 为了保证文字在反色背景下的清晰度，可以直接改变 `color`，或利用 CSS 的 `mix-blend-mode: difference` 达成智能反色。

## 4. 示例代码骨架 (Code Skeleton)
```tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = ['About', 'Work', 'Process', 'Services', 'Resources', 'Contact'];

export const MinimalistMenu = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-4xl bg-[#0a0a0a] p-8 text-white font-sans select-none">
      <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gray-500 inline-block"></span>
        Navigation
      </div>
      
      <nav className="flex flex-col border-t border-neutral-800">
        {NAV_ITEMS.map((item, index) => (
          <motion.div
            key={item}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative flex items-center justify-between py-5 px-4 border-b border-neutral-800 cursor-pointer overflow-hidden group"
          >
            {/* 动态反色背景块 */}
            <motion.div 
              className="absolute inset-0 bg-white z-0 origin-center"
              initial={{ opacity: 0, scaleY: 0.8 }}
              animate={{ 
                opacity: hoveredIndex === index ? 1 : 0,
                scaleY: hoveredIndex === index ? 1 : 0.8
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />

            {/* 菜单文本 */}
            <motion.span 
              className="text-4xl font-semibold z-10 transition-colors duration-200"
              animate={{ color: hoveredIndex === index ? '#000000' : '#ffffff' }}
            >
              {item}
            </motion.span>

            {/* 右侧平移滑入箭头 */}
            <motion.span 
              className="text-3xl z-10"
              initial={{ opacity: 0, x: -15 }}
              animate={{ 
                opacity: hoveredIndex === index ? 1 : 0,
                x: hoveredIndex === index ? 0 : -15
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 28,
                delay: hoveredIndex === index ? 0.02 : 0 
              }}
              style={{ color: hoveredIndex === index ? '#000000' : 'transparent' }}
            >
              &rarr;
            </motion.span>
          </motion.div>
        ))}
      </nav>
    </div>
  );
};

```

## 5. 易错点与禁忌 (Gotchas & Don'ts)

* **绝对不要**：为箭头进入设置过长的延迟（Delay），视频中的切换极度跟手，任何明显的滞后感都会打破极简主义的“干练”体感。
* **绝对不要**：忽略容器边缘的 `overflow-hidden`。如果高亮背景块在缩放（Scale）时超出了单行的边界，会导致视觉边界溢出，干扰邻近的文本。
* **交互兜底**：当鼠标从列表底部极速划到顶部时，会产生密集的悬停移入和移出。此处的物理弹簧必须设置**低质量（mass: 0.8）**与**高刚度（stiffness: 380）**，以确保动效状态可以瞬间被新触发重置，不产生视觉粘滞。

```

```