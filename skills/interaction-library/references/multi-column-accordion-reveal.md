````yaml
version: alpha
name: multi-column-accordion-reveal
name_zh: "多列手风琴展开揭示"
cover_video: "../assets/multi-column-accordion-reveal.mov"
description: >
  一种基于多列卡片展开与文字渐进式排版呈现的交互。通过平滑的缩放和延迟文字淡入，将大量信息在有限空间内进行优雅的切换与展示，适用于官网落地页、产品特性介绍及卡片式风琴折叠菜单。
  触发词：卡片折叠、风琴式展开、多列交替、文本渐进淡入、网格布局切换
motion_tokens:
  spring:
    stiffness: 280
    damping: 26
    mass: 0.9
  css_easing: "cubic-bezier(0.25, 1, 0.5, 1)"
  duration: "450ms"
  variants:
    initial: { width: "33.3%", opacity: 0.8 }
    animate: { width: "50%", opacity: 1 }
    exit: { width: "25%", opacity: 0.6 }
components: ["Accordion"]
effects: ["Reveal"]
---

# 多列卡片风琴式展开与文本渐进淡入规范

## 1. 动效体感 (Feel & Vibe)
* **视觉感受**：**现代、丝滑且具有呼吸感**。卡片容器的横向拉伸伴随着内部内容的自然流动，毫无生硬的机械感。
* **交互逻辑**：
  1. **容器流转**：点击或激活某一列卡片时，该列迅速横向平滑展开，其余列对应等比例收缩。
  2. **内容交替**：在容器体积发生变化的同时，旧文本以模糊或淡出的形式离开，新文本（如第 2 页的“智能科技”列表、第 3 页的“24/7 服务”列表）通过**从下至上（Y轴偏移）加渐显（Opacity）**的编排动画（Stagger Effect）依次淡入，营造出一种信息被“注入”的精致感。
* **适用场景**：多栏目特性介绍、团队介绍、详情卡片扩展。

## 2. 媒体参考 (Reference Asset)
* **文件路径**：`../assets/screen-recording-2026-06-14.gif`

## 3. 视觉配色记录 (UI Palette)
为了完美还原该设计，以下是视频中提取的核心色彩令牌（Color Tokens）：

| 颜色角色 | 核心 HEX 码 | 视觉表现 |
| :--- | :--- | :--- |
| **主特征色 1 (左)** | `#FFE600` | 明亮的高饱和柠檬黄，用于强调首序。 |
| **主特征色 2 (中)** | `#19FF53` | 高亮荧光绿，带来极强的年轻与科技感。 |
| **主特征色 3 (右)** | `#3690FF` | 科技天蓝色，提供视觉平衡与安全感。 |
| **背景调和色** | `#F4F0EA` | 温暖的燕麦色/米白色底色，中和高饱和度色彩的刺眼感。 |
| **暗色点缀/文字** | `#111111` | 接近纯黑的深石墨色，确保极佳的文本可读性。 |
| **深色背景强调** | `#2B1D52` / `#A557FF` | 房间内景中出现的深紫与霓虹紫，用于丰富空间层次。 |

## 4. 技术实现要点 (Implementation Details)
### 推荐库
* **首选**：Framer Motion (利用其强大的 `layout` 属性可以完美解决 Flex/Grid 布局改变时的平滑过渡，无需手动计算宽度)。
### 关键属性
* **必须开启硬件加速**：使用 `transform: translateX() translateY()` 以及 `opacity`。
* **避坑指南**：严禁直接对 `width` 属性进行 CSS 传统的 `transition: width` 动画，这会导致浏览器频繁触发重排（Reflow），引发掉帧。应使用 Framer Motion 的 `layout` 机制或 Flex-grow 动画。
* **溢出处理**：卡片容器必须设置 `overflow: hidden`，防止内部文字在容器收缩时溢出边界。

## 5. 示例代码骨架 (Code Skeleton)

```tsx
import { motion } from 'framer-motion';
import { useState } from 'react';

// 动效配置
const cardSpring = { stiffness: 280, damping: 26, mass: 0.9 };
const textVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' }
  })
};

export default function AccordionFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    { id: 0, title: "Practical ease", color: "#FFE600", items: ["All-inclusive rent", "Smooth check-in", "Guided tours"] },
    { id: 1, title: "A new take", color: "#19FF53", items: ["Community-first", "Smart technology", "Sustainable living"] },
    { id: 2, title: "Security & comfort", color: "#3690FF", items: ["24/7 Security", "Fast maintenance", "24/7 Hot water"] },
  ];

  return (
    <div style={{ display: 'flex', gap: '16px', background: '#F4F0EA', padding: '40px', height: '500px' }}>
      {cards.map((card, index) => {
        const isActive = activeIndex === index;
        return (
          <motion.div
            key={card.id}
            layout // 核心：开启布局自动平滑过渡
            transition={cardSpring}
            onClick={() => setActiveIndex(index)}
            style={{
              flex: isActive ? 2 : 1, // 动态改变 flex 占比实现风琴拉伸
              backgroundColor: card.color,
              borderRadius: '24px',
              padding: '24px',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
          >
            <motion.h2 layout="position">{card.title}</motion.h2>

            {/* 渐进式文字淡入 */}
            {isActive && (
              <div style={{ marginTop: '20px' }}>
                {card.items.map((item, i) => (
                  <motion.p
                    key={item}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    style={{ margin: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}
                  >
                    {item}
                  </motion.p>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

````

## 6. 易错点与禁忌 (Gotchas & Don'ts)

- **绝对不要**：不要让未激活卡片内部的文字在收缩时直接被“压扁”或换行。在收缩动作触发的瞬间，应立刻将非激活卡的详细列表通过 `display: none` 或 `opacity: 0` 隐藏，只保留主标题。
- **交互兜底**：必须为频繁点击切换做防抖处理，或者确保在动画未完成时再次点击能流畅中断（Interruptible Animation），Framer Motion 的 `layout` 默认已原生支持这种中断恢复。

```

```
