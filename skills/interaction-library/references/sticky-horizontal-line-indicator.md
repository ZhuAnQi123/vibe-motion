```yaml
version: alpha
name: magnetic-circular-button-hover
cover_video: ""
description: >
  这是一种带有明显物理引力与非对称磁性磁吸吸附的圆形按钮悬停动效。当鼠标指针移入圆形区域时，整体不仅伴随着果冻状的呼吸收缩与描边反色，内部的文本和整个黑色圆形基座更是会产生轻微的异步空间错位吸附，为微观交互注入极佳的物理生命力。
  触发词：圆形磁吸吸附, 异步空间位移, 弹性描边反色, 物理重力感, 微观呼吸弹性

# 结构化的物理动效参数（供 AI 读取，极度重要）
motion_tokens:
  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: 260
    damping: 22
    mass: 1.1
  
  # CSS 缓动曲线与时间
  css_easing: "cubic-bezier(0.25, 1, 0.3, 1)"
  duration: "450ms"
  
  # 关键变体状态流转
  variants:
    button_base:
      initial: { scale: 1, backgroundColor: "#1a1a1a", borderColor: "transparent" }
      hover: { scale: 1.05, backgroundColor: "transparent", borderColor: "#1a1a1a" }
    text_label:
      initial: { x: 0, y: 0, color: "#ffffff" }
      hover: { color: "#1a1a1a" }
components: []
effects: []
---

# 磁性动态吸附圆形按钮 (Magnetic Circular Button Hover) 规范

## 1. 动效体感 (Feel & Vibe)
- **视觉感受**：整体动效呈现出一种**灵敏、带有微弱磁场黏性与高级反色呼吸感**的交互体感。圆形实体按钮在被指针触碰的瞬间，不仅形态上展现出富有质量的弹性缓冲，而且从纯黑填充柔和蜕变为利落的空心描边，完成了完美的正负形反转。
- **交互逻辑**：当鼠标指针滑入巨大的黑色圆形按钮区（*Visit Synopsis*）时，按钮整体产生微弱的放大（过冲回弹），并敏锐地捕捉指针所在的相对坐标，使其内部正中央的文本甚至整个圆形基座顺着鼠标移动方向进行轻微的“异步视差平移（Magnetic Pull）”。当鼠标指针划出圆形热区，元素在瞬间恢复纯黑填充的同时，伴随着果冻般的阻尼颤动回归物理原位。
- **适用场景**：独立创意工作室官网的全局大核心 CTA、高端作品集案例跳转按钮、全屏滚动到结尾处的“触点激活（Get in Touch）”圆形磁吸块。

## 2. 媒体参考 (Reference Asset)
- **文件路径**：`../assets/magnetic-circular-button-hover.mp4`

## 3. Technical Implementation Details (技术实现要点)
### 推荐库
- **首选**：Framer Motion (通过监听父级热区容器的 `onMouseMove` 动态计算偏移向量，实现丝滑、无重排掉帧的磁性物理悬停联动)。
### 关键属性
- **磁吸向量偏移（X/Y Vector Offset）**：需要通过 JavaScript 实时计算指针相对按钮几何中心的坐标差 $(x, y)$，并赋予一定的衰减系数（如 `0.2`），应用到内部文本的 `transform: translate3d(x, y, 0)` 上。
- **平滑反色（Smooth Inversion）**：背景的黑色填充衰减与外层 `border-width` / `border-color` 的出现必须在极速弹簧驱动下完成，防止在形变边缘出现锯齿与闪烁。
- 必须要对最核心的三个交互组件开启 `will-change: transform` 硬件加速，确保在 120Hz 高刷屏下的极端平稳度。

## 4. 示例代码骨架 (Code Skeleton)
```tsx
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MagneticCircularButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 定义 Framer Motion 的弹性吸附过渡配置，完美对齐视频体感
  const springConfig = { stiffness: 260, damping: 22, mass: 1.1 };
  
  // 实时磁吸坐标控制
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    // 计算鼠标相对按钮中心点的位移矢量
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // 磁吸吸附范围控制：拉动最大不超过 15px
    const distanceX = (clientX - centerX) * 0.18;
    const distanceY = (clientY - centerY) * 0.18;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full h-80 bg-neutral-200 flex items-center justify-center select-none p-8">
      {/* 隐藏的磁吸全局热区 Hitbox，比实际圆形更大保证捕获引力 */}
      <div
        ref={buttonRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-64 h-64 flex items-center justify-center cursor-pointer rounded-full z-10"
      >
        {/* 核心：共享磁吸联动物理位移与反色过渡的圆形按钮基座 */}
        <motion.div
          style={{ x: springX, y: springY }}
          animate={{
            scale: isHovered ? 1.05 : 1,
            backgroundColor: isHovered ? 'rgba(26,26,26,0)' : 'rgba(26,26,26,1)',
            borderColor: isHovered ? 'rgba(26,26,26,1)' : 'rgba(26,26,26,0)',
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
          transition={{ type: 'spring', ...springConfig }}
          className="w-56 h-56 rounded-full flex items-center justify-center overflow-hidden shadow-sm"
        >
          {/* 内部文本组件：带有二次异步位移，强化物理引力深度 */}
          <motion.span
            style={{ x: useSpring(x, { stiffness: 300, damping: 25 }) }}
            animate={{ color: isHovered ? '#1a1a1a' : '#ffffff' }}
            transition={{ duration: 0.2 }}
            className="text-xl font-medium tracking-tight pointer-events-none"
          >
            Visit Synopsis
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

```

## 5. 易错点与禁忌 (Gotchas & Don'ts)

* **绝对不要**：对鼠标坐标（MouseMove）应用普通的 CSS 过渡延时（例如 `transition: transform 0.2s`），这会导致滑块坐标计算出现由于过度平滑而产生的“物理滑丝与滞后感”，必须用极其跟手且弹性有力的物理弹簧（Spring）机制来做缓冲计算。
* **绝对不要**：忘记在移出热区时重置坐标为 $(0,0)$。否则当鼠标极速滑离时，按钮和内部文字会死锁在偏离中心点的某个尴尬断面上，无法复位。
* **交互兜底**：必须将鼠标悬停触发点事件（MouseEnter/Move）绑定在最外层隐藏的 Hitbox 大盒子上。如果是直接绑定在变小、变空心的按钮本身上，在边缘拉伸移动时，指针会反复进入、离开按钮边界，引发毁灭性的疯狂抖动（Flutter Loop）。
