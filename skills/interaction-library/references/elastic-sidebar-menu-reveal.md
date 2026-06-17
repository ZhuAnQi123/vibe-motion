````yaml
version: alpha
name: elastic-sidebar-menu-reveal
name_zh: "弹性侧边栏菜单揭示"
cover_video: "../assets/elastic-sidebar-menu-reveal.mov"
description: >
  一种高动态反馈的侧边栏/菜单抽屉展开与导航项动感交互。菜单面板展开时具备平滑的果冻物理回弹，内部导航项在悬停时采用自适应高亮块移动，适用于创意先锋、极简主义风格的网站全局导航。
  触发词：菜单展开、侧边栏抽屉、弹性回弹、导航悬停、高亮跟随
motion_tokens:
  spring:
    stiffness: 380
    damping: 22
    mass: 0.95
  css_easing: "cubic-bezier(0.25, 1, 0.5, 1)"
  duration: "500ms"
  variants:
    initial: { x: "100%", borderRadius: "40px" }
    animate: { x: "0%", borderRadius: "24px" }
    exit: { x: "100%", borderRadius: "40px" }
components: ["Navigation"]
effects: ["Elastic","Reveal"]
---

# 弹性抽屉菜单与动感导航项规范

## 1. 动效体感 (Feel & Vibe)
* **视觉感受**：**丝滑、Q弹且具备极强的空间包裹感**。菜单面板的进场不是生硬的线性平移，而是在到达终点时有细微的伸缩与物理回弹（Overshoot）；内部导航项的悬停则通过箭头生出与背景微亮化，提供极其明确的指向性。
* **交互逻辑**：
  1. **面板展开（Menu Trigger）**：点击右上角“MENU”按钮，主菜单面板从右下角向左上角平滑滑入。面板左上角带有优雅的大圆角，随着完全展开，圆角会产生一个细腻的拉伸过渡。同时，右上角按钮文本由“MENU”无缝切换为“CLOSE”。
  2. **导航项悬停（Nav Hover）**：鼠标指针悬停在某个导航项（如 Work、Home）上时，该项背景瞬间包裹上一层淡灰色的圆角高亮块，同时文字向右微移，左侧平滑淡入一个指向箭头（$\rightarrow$）。
  3. **面板收起（Menu Close）**：点击“CLOSE”，整个面板顺滑地依原路径向右下角退场消失。
* **适用场景**：全面屏导航菜单、响应式移动端抽屉、独立工作室作品集导航。

## 2. 媒体参考 (Reference Asset)
* **文件路径**：`../assets/menu-drawer-elastic-reveal.gif`

## 3. 视觉配色记录 (UI Palette)
该组件完美承接了前序页面的高级暗黑/冷淡风，但在菜单内部使用了大面积的浅色画布来提亮视觉：

| 颜色角色 | 核心 HEX 码 | 视觉表现 |
| :--- | :--- | :--- |
| **基础大背景** | `#2A2C2E` | 偏冷的深暗灰色，作为底框衬托。 |
| **菜单面板背景** | `#DCDFE0` / `#E5E7E8` | 柔和的浅浅雾霾蓝灰/高级浅灰，与暗色背景形成强烈的明暗反差。 |
| **导航文字颜色** | `#111111` | 接近纯黑的深石墨色，粗体（Bold），确保极高的文本易读性。 |
| **悬停高亮背景** | `rgba(0, 0, 0, 0.05)` | 极淡的黑色透明度层，或者比面板略深的灰色块，用于视觉聚焦。 |
| **右上角切换按钮** | `#111111` | 黑色高胶囊按钮，内部文字为白色，在轻微拉伸中切换 MENU / CLOSE。 |

## 4. 技术实现要点 (Implementation Details)
### 推荐库
* **首选**：Framer Motion (结合 `AnimatePresence` 处理菜单的销毁进出场，并利用 `layoutId` 可以完美实现导航高亮块的丝滑跟随)。
### 关键属性
* **硬件加速**：面板位移必须使用 `transform: translate3d()`。
* **圆角自然过渡**：面板在滑入时由于带有弹性形变，其 `borderTopLeftRadius` 可以从较大的像素（如 `40px`）随位移动画自然收缩至标准的 `24px`，这会带来极佳的触觉体感。
* **层级控制**：确保菜单面板的 `zIndex` 高于内容层，但略低于右上角的全局控制按钮（MENU/CLOSE）。

## 5. 示例代码骨架 (Code Skeleton)

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const menuVariants = {
  hidden: { x: '100%', y: '10%', borderTopLeftRadius: '100px', opacity: 0.9 },
  visible: {
    x: '0%',
    y: '0%',
    borderTopLeftRadius: '32px',
    opacity: 1,
    transition: { type: 'spring', stiffness: 350, damping: 24, mass: 0.9 }
  },
  exit: {
    x: '100%',
    y: '20%',
    borderTopLeftRadius: '100px',
    opacity: 0.5,
    transition: { ease: 'easeInOut', duration: 0.3 }
  }
};

const itemVariants = {
  rest: { x: 0 },
  hover: { x: 12, transition: { type: 'spring', stiffness: 400, damping: 20 } }
};

const arrowVariants = {
  rest: { opacity: 0, x: -10 },
  hover: { opacity: 1, x: 0 }
};

export default function NavDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuItems = ["Home", "Studio", "Work", "Contact"];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#2A2C2E', overflow: 'hidden' }}>
      {/* 顶部全局控制栏 */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100, display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ padding: '12px 32px', borderRadius: '24px', background: '#111', color: '#FFF', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
        >
          {isOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* 侧边栏抽屉 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '450px',
              height: 'calc(100vh - 80px)', // 顶部给按钮留出呼吸空间
              backgroundColor: '#E5E7E8',
              padding: '80px 40px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-20px 0px 60px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '40px' }}>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item}
                  initial="rest"
                  whileHover="hover"
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  style={{
                    position: 'relative',
                    padding: '16px 24px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: hoveredIndex === index ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  {/* 悬停箭头 */}
                  <motion.span variants={arrowVariants} style={{ fontSize: '28px', color: '#111', fontWeight: '300' }}>
                    →
                  </motion.span>

                  {/* 文本主位移 */}
                  <motion.span variants={itemVariants} style={{ fontSize: '36px', fontWeight: 'bold', color: '#111' }}>
                    {item}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

````

## 6. 易错点与禁忌 (Gotchas & Don'ts)

- **绝对不要**：切勿将菜单的出场（Exit）也设置得过于Q弹。进场需要物理反馈来惊艳用户，但**出场（关闭菜单）必须迅速、干脆**，以防阻碍用户的下一步实质操作。
- **穿透限制**：当抽屉面板展开时，必须在代码中锁定下方底层页面的滚动（`document.body.style.overflow = 'hidden'`），避免用户在操作菜单时触发底层内容的错位滚动。

```

```
