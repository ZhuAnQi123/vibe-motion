````yaml
version: alpha
name: magnetic-button-magnetic-arrow
description: >
  这是一种带有微弱磁性吸附（Magnetic Effect）与动态拉伸的回弹胶囊按钮动效。当鼠标悬停在其核心操作区（如右侧圆形箭头）时，内部元素产生非对称的吸引和膨胀，营造出一种高级的物理张力与引力感。
  触发词：磁性吸附按钮, 动态胶囊拉伸, 引力反馈, 异步回弹, 物理边缘磁吸

# 结构化的物理动效参数（供 AI 读取，极度重要）
motion_tokens:
  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: 350
    damping: 22
    mass: 1.1

  # CSS 缓动曲线与时间
  css_easing: "cubic-bezier(0.25, 1, 0.5, 1)"
  duration: "400ms"

  # 关键变体状态流转
  variants:
    capsule_button:
      initial: { scale: 1, paddingRight: "16px" }
      hover: { scale: 1.02, paddingRight: "24px" }
    arrow_circle:
      initial: { x: 0, scale: 1 }
      hover: { x: 8, scale: 1.05 }
---

# 磁性动态回弹胶囊按钮 (Magnetic Button & Arrow) 规范

## 1. 动效体感 (Feel & Vibe)
- **视觉感受**：整体呈现一种**带有磁场引力与极强阻尼感**的高级物理交互。右侧的圆形操作区仿佛具有磁性，在被激活（悬停）时，它会脱离原本的绝对对称中心，向右侧产生轻微的位移突围，整个胶囊外壳也随之发生了平滑的拉伸变化，充满了呼吸感。
- **交互逻辑**：当鼠标指针靠近或悬停在右侧圆形箭头区域时，按钮整体产生微弱的等比例放大；同时，内部的黑色圆形箭头图标在水平方向（X 轴）产生异步位移，拉长了整个按钮的横向视觉比重。移开时，元素伴随着果冻般的轻微过冲快速回弹复位。
- **适用场景**：Hero 区域的核心行动点按钮（CTA - Call to Action）、高端设计作品集的“Next Project”指引、全屏表单的提交控件。

## 2. 媒体参考 (Reference Asset)
- **文件路径**：`../assets/magnetic-button-magnetic-arrow.mp4`

## 3. 技术实现要点 (Implementation Details)
### 推荐库
- **首选**：Framer Motion (通过监听 `whileHover` 来绑定联动，或者结合自定义的鼠标坐标偏移来实现微观的磁吸跟随效果)。
### 关键属性
- **非对称联动（Asymmetric Linking）**：外层的胶囊和内层的圆形箭头过渡不能共用完全一致的过渡曲线。圆形箭头的位移应该比外壳的形变略微更具“冲劲”（更高的 `stiffness`）。
- 按钮整体需要使用 `border-radius: 9999px`（全圆角胶囊），在形变拉伸时，要确保圆角比例不会失真（避免使用固定的四角半径动画，建议交给 `layout` 或纯 `padding` 调节）。
- 内部的箭头符号（$\rightarrow$）在圆形区域放大时应当保持绝对的居中和矢量清晰，防止抖动。

## 4. 示例代码骨架 (Code Skeleton)
```tsx
import React from 'react';
import { motion } from 'framer-motion';

export const MagneticButton = () => {
  // 定义模拟视频中带有磁性吸引的物理弹簧参数
  const capsuleSpring = { type: 'spring', stiffness: 300, damping: 25, mass: 1.2 };
  const arrowSpring = { type: 'spring', stiffness: 380, damping: 20, mass: 1.0 };

  return (
    <div className="w-full h-48 bg-[#0f1115] flex items-center justify-center select-none">
      <motion.button
        whileHover="hover"
        initial="initial"
        transition={capsuleSpring}
        className="flex items-center bg-neutral-200 text-black pl-8 pr-4 py-4 rounded-full font-bold text-xl tracking-wider cursor-pointer group"
        variants={{
          initial: { scale: 1, paddingRight: '16px' },
          hover: { scale: 1.02, paddingRight: '24px' }
        }}
      >
        <span className="mr-6 group-hover:text-neutral-900 transition-colors">
          NEXT WORK
        </span>

        {/* 右侧核心磁吸圆形区域 */}
        <motion.div
          variants={{
            initial: { x: 0, scale: 1 },
            hover: { x: 6, scale: 1.05 }
          }}
          transition={arrowSpring}
          className="w-14 h-14 rounded-full bg-[#16181d] flex items-center justify-center text-white shadow-lg"
        >
          <motion.svg
            xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
            variants={{
              initial: { x: 0 },
              hover: { x: 2 }
            }}
            transition={arrowSpring}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </motion.svg>
        </motion.div>
      </motion.button>
    </div>
  );
};

````

## 5. 易错点与禁忌 (Gotchas & Don'ts)

- **绝对不要**：对整体胶囊使用单纯的 `transform: skew()` 或生硬的宽度（Width）数值递增动画，这会破坏圆角的几何轮廓，使高级的物理形变退化为廉价的盒模型拉伸。
- **绝对不要**：将回弹的阻尼（Damping）设得过低（导致按钮产生漫长且剧烈的晃动）。视频中的物理反馈非常富有克制美，属于**瞬时响应、微弱冲出、快速锁死**。
- **交互兜底**：为了避免鼠标在按钮边缘高频微颤时动效产生死循环抖动（Hover Fluttering），应确保最外层有一个比按钮实际尺寸略大的隐形热区容器（Hitbox）来承载悬停事件监听，或者保证 `whileHover` 拥有足够的物理惯性缓冲。
