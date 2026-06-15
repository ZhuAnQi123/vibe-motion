---
version: alpha
name: interaction-name-analysis
description: >
  详细描述该交互的“核心体感”。例如：
  “这是一个类似 iOS 控制中心的流体扩展动效，元素展开时带有明显的阻尼感，松手时有基于初速度的惯性回弹。”
  触发词：[填入触发词，如 流体展开、阻尼回弹、iOS风卡片]
website: [原设计来源网站 URL，可选]

# 结构化的物理动效参数（供 AI 直接读取应用，极度重要）
motion_tokens:
  # Framer Motion 物理弹簧推荐参数
  spring:
    stiffness: 400
    damping: 30
    mass: 1
  
  # CSS 缓动曲线推荐参数
  css_easing: "cubic-bezier(0.25, 1, 0.5, 1)"
  duration: "400ms"
  
  # 变体状态
  variants:
    initial: { opacity: 0, scale: 0.95, y: 20 }
    animate: { opacity: 1, scale: 1, y: 0 }
    exit: { opacity: 0, scale: 0.95, y: -20 }
---

# [动效名称] 规范

## 1. 动效体感 (Feel & Vibe)
- **视觉感受**：[例如：黏滞感、丝滑轻盈、机械干脆]
- **交互逻辑**：[例如：用户长按时元素略微缩小（scale 0.95），松手瞬间迅速放大并超出原始比例（scale 1.05），最后回弹至原状。]
- **适用场景**：[例如：图片相册查看、重要设置项展开]

## 2. 媒体参考 (Reference Asset)
> 存放你收集的 GIF 或 MP4 的相对路径，方便人工或 AI 回溯。
- **文件路径**：`../assets/your-animation-demo.gif`
- **来源引用**：[如 Twitter @xxx, Dribbble 链接]

## 3. 技术实现要点 (Implementation Details)
### 推荐库
- **首选**：Framer Motion (React)
- **次选**：纯 CSS Transition

### 关键属性
- **硬件加速**：必须动画化 `transform` 而不是 `width`/`height` 或 `top`/`left` 以防掉帧。
- **布局平滑 (Layout Animation)**：如果涉及尺寸变化，在 Framer Motion 中需开启 `layout` 属性。

## 4. 示例代码骨架 (Code Skeleton)

```tsx
// 这里存放一个经过你验证的、能完美还原该动效的最简代码模板
import { motion } from 'framer-motion';

export const InteractionComponent = () => {
  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
    >
      Content
    </motion.div>
  );
};
```

## 5. 易错点与禁忌 (Gotchas & Don'ts)
- **不要过长**：入场时间严禁超过 500ms。
- **防止误触**：动效播放期间的遮罩或阻止重复点击逻辑。
