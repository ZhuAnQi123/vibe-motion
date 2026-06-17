```yaml
version: alpha
name: typographic-menu-preview-card
name_zh: "排版菜单预览卡片"
cover_video: "../assets/typographic-menu-preview-card.mov"
description: >
  这是一种大字报风格的文本菜单悬停联动媒体预览的动效。当鼠标划过排版字块时，文字颜色高亮，同时右侧的跟随预览卡片通过微弱的惯性位移与平滑的图片淡入淡出进行内容切换，展现极佳的丝滑体感。
  触发词：大字报菜单, 悬停联动预览, 遮罩渐变切换, 排版高亮, 视差缩放

# 结构化的物理动效参数（供 AI 读取，极度重要）
motion_tokens:
  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: 320
    damping: 30
    mass: 1.0
  
  # CSS 缓动曲线与时间
  css_easing: "cubic-bezier(0.215, 0.610, 0.355, 1.000)"
  duration: "400ms"
  
  # 关键变体状态流转
  variants:
    menu_item:
      initial: { color: "rgba(255, 255, 255, 0.2)", scale: 1 }
      hover: { color: "rgba(255, 255, 255, 1)", scale: 1.02 }
    preview_card:
      initial: { opacity: 0, scale: 0.95, y: 15 }
      animate: { opacity: 1, scale: 1, y: 0 }
      exit: { opacity: 0, scale: 0.98, y: -10 }
components: ["Navigation","Card"]
effects: ["Motion"]
---

# 文本菜单联动媒体预览 (Typographic Menu Preview Card) 规范

## 1. 动效体感 (Feel & Vibe)
- **视觉感受**：整体呈现一种**极其现代、灵敏且平滑（Buttery Smooth）**的视觉感官。大字报菜单的激活与未激活状态过渡极其柔和；右侧图片卡片的切入伴随着轻微的纵向位移与缩放，仿佛卡片在三维空间中向用户面轻微靠拢，极具优雅感。
- **交互逻辑**：当鼠标指针在不同菜单项（如 *Website Design*、*Visual Identity*）之间穿梭时，被悬停的文字瞬间高亮，其他文字恢复暗淡。右侧的预览区域在捕捉到菜单切换时，旧图快速淡出，新图从下方带有一点点缓动上浮、放大并淡入。
- **适用场景**：创意机构官网服务列表（Services）、时尚电商分类导航、个人作品集项目列表（Case Studies）。

## 2. 媒体参考 (Reference Asset)
- **文件路径**：`../assets/typographic-menu-preview-card.mp4`

## 3. 技术实现要点 (Implementation Details)
### 推荐库
- **首选**：Framer Motion (通过监听 `hover` 状态来驱动多组件联动，并利用 `AnimatePresence` 保证卡片淡入淡出的重叠感)。
### 关键属性
- 菜单文字的颜色渐变建议使用 CSS 的 `color` 属性配合 `transition`，或者单独提取为 Framer Motion 的变体。
- 预览卡片需要设置固定的容器宽高与 `overflow: hidden`，内部图片通过 `transform: scale()` 和 `opacity` 进行切换。
- 考虑到视频中的预览卡片位置随菜单高低有些许微调，可以为其加入轻微的随鼠标 Y 轴方向上的**视差位移**或**位置跟随**。

## 4. 示例代码骨架 (Code Skeleton)
```tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
  { id: 1, title: 'Brand Strategy', img: '/img1.jpg' },
  { id: 2, title: 'Visual Identity', img: '/img2.jpg' },
  { id: 3, title: 'Website Strategy', img: '/img3.jpg' },
  { id: 4, title: 'Website Design', img: '/img4.jpg' },
  { id: 5, title: 'Website Development', img: '/img5.jpg' },
];

export const TypographicMenu = () => {
  const [activeIndex, setActiveIndex] = useState<number>(3); // 默认高亮某一项

  return (
    <div className="relative w-full min-h-screen bg-[#0f0f0f] flex items-center justify-between px-16 overflow-hidden select-none">
      {/* 左侧大字报菜单 */}
      <div className="flex flex-col space-y-2 max-w-2xl z-10">
        {MENU_ITEMS.map((item, index) => (
          <motion.h2
            key={item.id}
            onMouseEnter={() => setActiveIndex(index)}
            className="text-6xl font-bold cursor-pointer transition-colors duration-300 origin-left"
            style={{
              color: activeIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.15)'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {item.title}
          </motion.h2>
        ))}
      </div>

      {/* 右侧联动预览卡片 */}
      <div className="relative w-[360px] h-[480px] flex items-center justify-center mr-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 30,
              mass: 1.0
            }}
            className="absolute w-full h-full rounded-xl overflow-hidden bg-[#1a1a1a] shadow-2xl"
          >
            {/* 模拟视频中的多媒介卡片展示 */}
            <img 
              src={MENU_ITEMS[activeIndex].img} 
              alt="preview" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

```

## 5. 易错点与禁忌 (Gotchas & Don'ts)

* **绝对不要**：将右侧卡片的 `AnimatePresence` 设置为默认的非 `wait` 模式同时不加绝对定位，否则新旧卡片在切换瞬间会发生上下或左右错位排挤。
* **绝对不要**：对文字放大使用 `font-size` 动画。必须使用 `scale`，否则会导致每次悬停时周围文本行高重新计算，产生抖动。
* **交互兜底**：当鼠标快速从最上方划到最下方时，预览卡片会收到密集的触发信号。确保代码中使用了合理的 `key` 绑定，使 Framer Motion 能自动平滑打断（Interrupt）上一段未完成的动画。

```

```