```yaml
version: alpha
name: fluid-elastic-button-hover
cover_video: ""
description: >
  一种高动态反馈的微交互按钮。鼠标悬停时，按钮通过带有强烈Q弹感和物理惯性的缩放进行反馈，迅速吸引视觉焦点并提升点击欲，适用于行动呼吁（CTA）按钮。
  触发词：按钮悬停、弹性缩放、微动效、Q弹反馈、CTA按钮
motion_tokens:
  spring:
    stiffness: 450
    damping: 18
    mass: 0.8
  css_easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  duration: "300ms"
  variants:
    initial: { transform: "scale(1)" }
    animate: { transform: "scale(1.08)" }
    exit: { transform: "scale(1)" }
components: []
effects: []
---

# 弹性缩放微动效按钮规范

## 1. 动效体感 (Feel & Vibe)
* **视觉感受**：**极具生机、Q弹且轻盈**。按钮的放大并非机械的线性缩放，而是在到达最大值时伴随有细微的“果冻般”过冲与回弹，给用户带来极其舒适的物理确认感。
* **交互逻辑**：
  1. **悬停触发（Hover）**：当鼠标指针滑入按钮区域时，按钮瞬间向外扩张放大（约 1.08 倍），并在边缘产生轻微的惯性抖动。
  2. **移出复原（Leave）**：鼠标指针离开后，按钮快速且顺滑地收缩回原始大小。
* **适用场景**：网页核心转化入口（如“立即预订”、“提交订单”、“加入购物车”等核心 CTA 按钮）。

## 2. 媒体参考 (Reference Asset)
* **文件路径**：`../assets/book-unit-button-hover.gif`

## 3. 视觉配色记录 (UI Palette)

| 颜色角色 | 核心 HEX 码 | 视觉表现 |
| :--- | :--- | :--- |
| **按钮主体背景** | `#8E44AD` / `#9B5DE5` | 醒目的明亮丁香紫/电光紫，具备极高的视觉权重。 |
| **按钮文本** | `#000000` | 纯黑色，高粗细（Bold），确保在彩色背景上的绝对可读性。 |
| **网页大背景** | `#F4F0EA` | 温暖的浅米色/燕麦色底色，作为柔和的画布衬托紫色按钮。 |

## 4. 技术实现要点 (Implementation Details)
### 推荐库
* **首选**：Framer Motion (通过 `whileHover` 属性可以近乎完美地用一行代码还原这种物理弹簧手感)。
### 关键属性
* **必须开启硬件加速**：严格使用 `transform: scale()` 进行缩放。
* **避坑指南**：**绝对不要**通过改变按钮的 `width`、`height` 或 `padding` 来放大按钮，否则会导致整页像素重排，彻底失去丝滑感。
* **基准点锁定**：确保 `transform-origin: center center`，使按钮以中心为轴均匀向四周膨胀。

## 5. 示例代码骨架 (Code Skeleton)

```tsx
import { motion } from 'framer-motion';

// 超高刚度、低阻尼的Q弹弹簧参数
const elasticSpring = { 
  type: "spring", 
  stiffness: 450, 
  damping: 18, 
  mass: 0.8 
};

export default function BookUnitButton() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F4F0EA' }}>
      <motion.button
        style={{
          backgroundColor: '#9B5DE5',
          color: '#000000',
          padding: '20px 48px',
          borderRadius: '20px',
          border: 'none',
          fontSize: '24px',
          fontWeight: 'bold',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: '0px 8px 24px rgba(155, 93, 229, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: '1.2',
        }}
        // 核心悬停动效配置
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }} // 附加点击下压反馈，提升完整度
        transition={elasticSpring}
      >
        <span>Book your</span>
        <span>Unit</span>
      </motion.button>
    </div>
  );
}

```

## 6. 易错点与禁忌 (Gotchas & Don'ts)

* **绝对不要**：缩放比例切勿设置过大（例如超过 1.15 倍），过大的形变会显得粗糙并破坏页面的整体精致感。
* **文字抖动处理**：在某些低分屏浏览器上，CSS 缩放可能会导致文字边缘短暂模糊或抖动。可以在按钮样式中加入 `-webkit-font-smoothing: antialiased` 和 `will-change: transform` 来提前通知浏览器进行硬件渲染优化。

```

```