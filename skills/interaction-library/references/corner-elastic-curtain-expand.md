````yaml
version: alpha
name: corner-elastic-curtain-expand
name_zh: "角落弹性幕布展开"
cover_video: "../assets/corner-elastic-curtain-expand.mp4"
description: >
  这是一种极具戏剧张力与空间延伸感的右上角圆角幕布展开（全屏菜单）动效。通过将一个微小的胶囊按钮作为动效发生源，以非对称的物理弹簧速度向左下方急速膨胀展开，转化为饱满的全屏白幕，并联动内部文本的物理擦除显现。
  触发词：角落幕布展开, 胶囊源点膨胀, 视差边界流转, 异步排版显现, 物理弹性形变

# 结构化的物理动效参数（供 AI 读取，极度重要）
motion_tokens:
  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: 240
    damping: 22
    mass: 1.3

  # CSS 缓动曲线与时间
  css_easing: "cubic-bezier(0.85, 0, 0.15, 1)"
  duration: "600ms"

  # 关键变体状态流转
  variants:
    curtain_panel:
      initial: { width: "120px", height: "48px", borderRadius: "9999px", top: "24px", right: "24px" }
      open: { width: "100%", height: "100%", borderRadius: "0px", top: "0px", right: "0px" }
    menu_items:
      initial: { opacity: 0, y: 30, skewY: 4 }
      open: { opacity: 1, y: 0, skewY: 0 }
components: ["Container"]
effects: ["Elastic","Expand"]
---

# 角落弹性幕布全屏展开 (Corner Elastic Curtain Expand) 规范

## 1. 动效体感 (Feel & Vibe)
- **视觉感受**：动效带有极强的**张力、体量感与丝滑的包裹感**。它巧妙地利用右上角的“Menu”小胶囊作为爆发点，在激活的瞬间，胶囊仿佛打破了某种物理表面张力，化作一块巨大的白色幕布向全屏席卷，圆角在展开过程中平滑消失。
- **交互逻辑**：点击右上角的小圆角按钮后，按钮本身作为容器开始经历非线性的宽高暴增。它以右上方为不动点，向左侧和下方呈弧线轨迹急速扩散。当白幕即将覆盖全屏并趋于稳定的瞬间，内部的极简文字菜单（*works*, *about*, *contact*）伴随着轻微的纵向视差与微弱的倾斜度（Skew）修正，错落有致地浮现出来。
- **适用场景**：前沿设计工作室官网的全屏导航（Full Screen Menu）、创意数字营销 agency 的沉浸式全局转场。

## 2. 媒体参考 (Reference Asset)
- **文件路径**：`../assets/corner-elastic-curtain-expand.mp4`

## 3. 技术实现要点 (Implementation Details)
### 推荐库
- **首选**：Framer Motion (利用其强大的组件跨状态布局变换 `layout` 属性，能够最完美、流畅地处理从“胶囊按钮”无缝变形成“全屏视窗”的几何形态剧变)。
### 关键属性
- **尺寸形变与圆角衰减（Size & Radius Attenuation）**：随着宽高的弹性扩张，`border-radius` 必须从按钮状态的 `9999px` 或 `24px` 动态衰减为全屏状态的 `0px`。
- **排版延迟联动（Staggered Typography）**：菜单文本的入场必须通过 `staggerChildren` 进行微小的交错延迟处理（如每行相隔 `0.05s`），并且配合 `clip-path` 或由下至上的平移。
- 整个白幕容器必须设置 `overflow: hidden`，防止在剧烈形变的过程中，内部还未对齐的菜单文本、底部 Email 和社交图标发生溢出抖动。

## 4. 示例代码骨架 (Code Skeleton)
```tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CornerCurtainMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 模拟视频中略带大质量、丝滑铺开的物理弹簧参数
  const curtainSpring = { type: 'spring', stiffness: 220, damping: 24, mass: 1.2 };
  const textSpring = { type: 'spring', stiffness: 280, damping: 22 };

  return (
    <div className="relative w-full h-screen bg-[#0d0d0d] overflow-hidden flex items-center justify-center">
      {/* 触发源点 / 导航菜单主体 */}
      <motion.div
        layout
        transition={curtainSpring}
        style={{
          borderRadius: isOpen ? '0px' : '9999px',
        }}
        className={`absolute z-50 bg-white text-black flex flex-col justify-between ${
          isOpen ? 'inset-0 p-16 w-full h-full' : 'top-6 right-6 w-28 h-12 items-center justify-center cursor-pointer shadow-lg'
        }`}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {!isOpen ? (
          // 初始状态：极简 Menu 按钮文本
          <motion.span layout="position" className="text-sm font-bold tracking-wider">
            MENU ↗
          </motion.span>
        ) : (
          // 展开状态：全屏菜单面板
          <div className="w-full h-full flex flex-col justify-between items-start relative">
            {/* 右上角关闭按钮 */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
            >
              <span className="text-xs text-neutral-500">close</span>
              <span className="font-bold text-sm">✕</span>
            </button>

            {/* 核心联动菜单项：错落浮现 */}
            <div className="flex flex-col space-y-4 my-auto pl-8">
              {['works', 'about', 'contact'].map((item, i) => (
                <div key={item} className="overflow-hidden">
                  <motion.h2
                    initial={{ y: 80, opacity: 0, skewY: 4 }}
                    animate={{ y: 0, opacity: 1, skewY: 0 }}
                    transition={{ ...textSpring, delay: 0.2 + i * 0.06 }}
                    className="text-6xl font-black tracking-tighter cursor-pointer hover:pl-4 transition-all duration-300 origin-left flex items-center gap-4"
                  >
                    <span className="opacity-0 hover:opacity-100 transition-opacity text-4xl">•</span>
                    {item}
                  </motion.h2>
                </div>
              ))}
            </div>

            {/* 底部页脚信息 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full flex justify-between items-center text-sm border-t border-neutral-200 pt-6"
            >
              <span className="font-mono text-neutral-500">hello@agency.com</span>
              <div className="flex gap-4 font-medium">
                <span>IG</span><span>TW</span><span>BE</span>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

````

## 5. 易错点与禁忌 (Gotchas & Don'ts)

- **绝对不要**：在展开时使用纯百分比的 `width` / `height` 与固定的 `px` 混合做普通 CSS 过渡。因为这会打断浏览器的盒模型计算，导致圆角（`border-radius`）和定位瞬间突变跳动，失去从“点”自然延展成“面”的平滑弧度。
- **绝对不要**：让内部文本在幕布刚开始动的时候就同步显现。文字必须有 **`0.15s - 0.2s` 左右的等待滞后（Delay）**，等到白色幕布将屏幕主体撕开大半后，文字再顺势破茧而出，否则在视觉上会形成极为混乱的重叠挤压。
- **交互兜底**：在白幕处于极速扩张的 600ms 过程中，应当暂时将全屏的其它点击事件挂起（Pointer Events Lock），直至 `onLayoutAnimationComplete` 触发，防止用户在动画中途误触其它不可见的隐藏交互。
