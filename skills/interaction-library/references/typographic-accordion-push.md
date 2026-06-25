---
version: alpha
name: typographic-accordion-push
name_zh: "瑞士粗野主义：巨幅排版手风琴联动挤压"
cover_video: "../assets/typographic-accordion-push.mp4"
components: ["手风琴折叠栏", "巨幅文本条", "内容揭示容器"]
effects: ["弹性高度动态挤压", "层级交错渐显 (Stagger Reveal)", "边界顺滑裁切"]
interaction_types: ["点击切换", "布局弹性联动"]
description: >
  这是一种充满现代粗野主义（Brutalist）与瑞士平面设计感的手风琴折叠动效。每一个分类都以极具视觉冲击力的巨幅黑色粗体字、高饱和度纯色块（蓝、绿、紫、粉、黄）和背景图片叠加呈现。当用户点击其中一个条目时，该条目会以带有明显惯性缓冲的节奏平滑“膨胀”展开，展示内部的详细内容与行动按钮（CTA），而其他未被选中的条目则会被优雅地向上或向下“推挤”缩小。
trigger_words: [粗野主义、巨幅排版、手风琴联动、动态挤压、高饱和色块]
website: "未知（艺术创意或社会运动组织官网）"

motion_tokens:
  # 高度自适应流体过渡参数
  layout_spring:
    stiffness: 180
    damping: 24
    mass: 0.9

  # 内部文字与按钮子元素的交错（Stagger）延迟
  stagger_children:
    delay_between: 0.08
    initial_y_offset: 20

  css_easing: "cubic-bezier(0.16, 1, 0.3, 1)" # 超平滑的 EaseOut 曲线
  duration: "550ms"
---

# 瑞士粗野主义：巨幅排版手风琴联动挤压规范

## 1. 动效体感 (Feel & Vibe)

- **视觉感受**：**强反差、模块化、机械感与流体感的动态结合**。未展开时，密集堆叠的高饱色彩条带和巨幅文字带来蓄势待发的紧凑感；展开后，大面积纯色与留白瞬间释放，给予视线极强的聚焦。
- **交互逻辑**：
  - **联动排挤（Layout Squeezing）**：点击某一个色彩条带（例如 "OUR SUPPORTERS"），其容器的 `height`（或 `flex-grow`）在约 500ms 内平滑放大至内容撑起的高度。与此同时，其他兄弟节点的空间被等比例平滑压缩。
  - **内容异步揭示（Content Unveiling）**：内部的大图、描述文案以及右侧的白底按钮，在高度展开的过程中，通过 `opacity` 从 0 到 1 渐显，并伴随一个向上微幅推移（y: 20 -> 0）的交错动画（Stagger），避免图文生硬突兀地闪现。

## 2. 媒体参考 (Reference Asset)

- **文件路径**：`../assets/typographic-accordion-push.mp4`
- **来源引用**：The Push / 青年音乐创意运动官网

## 3. 技术实现要点 (Implementation Details)

### 推荐库

- **首选**：Framer Motion (React) 中的 `<motion.div layout />`。这是处理 CSS 高度变化（`height: auto` 动画化）最完美的现代方案。
- **次选**：现代 CSS Grid 动画。通过对 `grid-template-rows: 0fr` 到 `1fr` 的 `transition` 过渡来实现纯 CSS 的顺滑展开。

### 关键属性

- **防止内容溢出抖动**：手风琴在膨胀或闭合的过程中，其内部子组件的整体高度一直在剧烈变动。为了防止文字产生折行闪烁、图片比例变形，外层包裹容器必须设置 `overflow: hidden`，并配合 `will-change: height` 以确保动画期间的重绘效率。
- **色彩与层级深度**：每一个条目在激活时，其 `z-index` 应短暂提升，避免在高度拉伸的瞬间被相邻条目的阴影或边框遮挡。

## 4. 示例代码骨架 (Code Skeleton)

```tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const accordionData = [
  { id: "young", title: "OUR YOUNG PEOPLE", color: "bg-[#0091ff]" },
  { id: "parents", title: "OUR PARENTS & GUARDIANS", color: "bg-[#00c853]" },
  { id: "supporters", title: "OUR SUPPORTERS", color: "bg-[#e040fb]" },
];

export const BrutalistAccordion = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="w-full min-h-screen flex flex-col bg-black text-black">
      {accordionData.map((item) => {
        const isExpanded = expandedId === item.id;

        return (
          <motion.div
            key={item.id}
            layout // Framer Motion 的核心：开启自动布局平滑重绘
            onClick={() => setExpandedId(isExpanded ? null : item.id)}
            className={`cursor-pointer overflow-hidden border-b-4 border-black transition-colors ${item.color} ${
              isExpanded ? "flex-grow min-h-[400px]" : "h-20 flex items-center"
            }`}
          >
            {/* 未展开时的标题条（保持巨幅粗体字） */}
            <div className="p-6 select-none flex items-center justify-between w-full">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                {item.title}
              </h2>
            </div>

            {/* 展开后的详细内容区 */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
                >
                  {/* 左侧内容描述，带 Stagger 错位入场体感 */}
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="max-w-xl text-xl font-bold"
                  >
                    <p>
                      Learn about how you can support our movement and create
                      more opportunities for everyone.
                    </p>
                  </motion.div>

                  {/* 右侧白底黑字粗野主义行动按钮 */}
                  <motion.div
                    initial={{ y: 30 }}
                    animate={{ y: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <button className="bg-white border-4 border-black p-4 text-left font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
                      Partner With Us ➔
                    </button>
                    <button className="bg-white border-4 border-black p-4 text-left font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
                      Become a Donor ➔
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
```

## 5. 易错点与禁忌 (Gotchas & Don'ts)

- **忌不设最小高度（Min-Height）**：当展开某一项时，若内部文字极少，整个条目会因为没有撑起足够的 Z 轴视觉空间而显得局促。必须强制指定展开后的 `min-height`（如 `400px`），确保大面积色块能完全暴露，维持粗野主义风格。
- **避免文本原生换行抖动**：巨幅英文字体（如 `text-6xl`）在容器宽度被挤压收缩时，容易因为空间不足被迫自动换行，导致原本一行写完的标题变成两行。应为标题文字加上 `white-space: nowrap` 结合 `text-overflow: clip`，允许其在收缩时被自然裁切，而不是生硬地换行将页面撑爆。
