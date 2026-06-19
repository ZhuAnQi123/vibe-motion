```yaml
version: alpha
name: multi-section-sticky-overlap
name_zh: "多区块粘性叠层滚动"
cover_video: "../assets/multi-section-sticky-overlap.mp4"
description: >
  一种基于大屏滚动的多层卡片堆叠与视差覆盖交互。当页面向下滚动时，当前全屏板块会被下一个板块向上推开并直接覆盖，呈现出极具空间纵深感的高级转场，适用于创意工作室、品牌官网及服务介绍页。
  触发词：页面堆叠、视差覆盖、粘性滚动、全屏卡片推开、多层级错开
motion_tokens:
  spring:
    stiffness: 180
    damping: 24
    mass: 1.1
  css_easing: "cubic-bezier(0.645, 0.045, 0.355, 1)"
  duration: "700ms"
  variants:
    initial: { y: "100vh", scale: 1 }
    animate: { y: "0vh", scale: 1 }
    exit: { y: "0vh", scale: 0.95, opacity: 0.8 }
components: ["Container"]
effects: ["Sticky"]
---

# 多层级视差堆叠覆盖转场规范

## 1. 动效体感 (Feel & Vibe)
* **视觉感受**：**沉浸、厚重且富有戏剧性**。每个板块就像是一张巨大的实体卡片，后一个板块在滚动时以绝对的视觉权重“盖过”前一个板块，产生强烈的空间层级感。
* **交互逻辑**：
  1. **粘性锁定（Sticky）**：当某一板块滚动到视口顶部时，它会短暂固定（Sticky），作为底色画布。
  2. **视差覆盖（Overlap）**：继续向下滚动时，下一个板块以 1:1 的滚动速度从屏幕底部向上升起，直接覆盖在前一个板块之上。
  3. **底层微调（Exit Mini-scale）**：被覆盖的底层板块并非完全静止，而是伴随轻微的向后推开感（如微小的缩放或变暗），以拉开纵深。
* **适用场景**：故事性叙述页面、大类业务板块切换（如：Brand Identities -> Smart Development -> Marketing Campaigns）。

## 2. 媒体参考 (Reference Asset)
* **文件路径**：`../assets/brand-services-sticky-overlap.gif`

## 3. 视觉配色记录 (UI Palette)
该页面采用了高级的暗黑主义与极简灰调相交替的冷淡风设计，通过微妙的色彩深浅交替打破长页面的单调：

| 颜色角色 | 核心 HEX 码 | 视觉表现 |
| :--- | :--- | :--- |
| **主板底色 A (深暗)** | `#111111` | 纯黑或接近纯黑的深石墨色（如 Brand Identities / Marketing Campaigns 板块），营造高端、深邃的品牌调性。 |
| **主板底色 B (中灰)** | `#2A2C2E` / `#333639` | 带有冷色调的深灰色（如 Smart Development / 3D Visualization 板块），与深暗色产生交替层级。 |
| **主标标题文字** | `#FFFFFF` | 纯白色，超大字号（Heading），具备极强的视觉冲击力。 |
| **副文本/标签文字** | `#B0B5B8` | 浅灰白色，降低视觉重心，确保核心内容与次要信息对比鲜明。 |
| **胶囊标签背景** | `#222426` | 略浅于底色的微亮胶囊框，用于包裹子分类（如 Logo, Typography 等）。 |
| **顶部右侧按钮** | `#F4F0EA` / `#FFFFFF` | 奶白色高亮胶囊按钮（CHAT WITH SOHUB），作为页面中唯一的全亮色全局常驻元素。 |

## 4. 技术实现要点 (Implementation Details)
### 推荐库
* **首选**：CSS `position: sticky` 结合 Framer Motion 或者是原生的 CSS Scroll-driven Animations（滚动驱动动画）。
### 关键属性
* **层级管理**：必须严格控制每个板块的 `zIndex`（随着滚动递增，如 section1=1, section2=2）。
* **必须开启硬件加速**：使用 `will-change: transform` 优化大图或多文字在滚动覆盖时的性能，防止大面积重绘导致的卡顿。
* **高度锁定**：每个参与堆叠的 Section 高度建议强制设为 `height: 100vh`，确保覆盖动作正好在一个视口内完美发生。

## 5. 示例代码骨架 (Code Skeleton)

```tsx
import React from 'react';

interface SectionProps {
  title: string;
  bgColor: string;
  zIndex: number;
  tags: string[];
  desc: string;
}

const Section: React.FC<SectionProps> = ({ title, bgColor, zIndex, tags, desc }) => {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        backgroundColor: bgColor,
        zIndex: zIndex,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 10%',
        boxShadow: '0px -10px 40px rgba(0,0,0,0.5)', // 给卡片顶部加微弱投影，强化覆盖感
        overflow: 'hidden'
      }}
    >
      <h1 style={{ fontSize: '80px', color: '#FFF', margin: '0 0 40px 0', fontWeight: 'bold' }}>
        {title}
      </h1>
      
      {/* 标签栏 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
        {tags.map(tag => (
          <span key={tag} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.08)', color: '#B0B5B8', borderRadius: '20px', fontSize: '14px' }}>
            {tag}
          </span>
        ))}
      </div>

      <p style={{ color: '#B0B5B8', fontSize: '20px', maxWidth: '600px', lineHeight: '1.6' }}>
        {desc}
      </p>
    </div>
  );
};

export default function StickyOverlapPage() {
  const sections = [
    { title: "Brand Identities", bgColor: "#111111", tags: ["Logo", "Typography", "Color Palette"], desc: "Our team will assist in developing a consistent brand voice..." },
    { title: "Smart Development", bgColor: "#2A2C2E", tags: ["Web Development", "App Development", "UI/UX Design"], desc: "We build highly scalable and optimized digital products..." },
    { title: "Marketing Campaigns", bgColor: "#111111", tags: ["Digital Marketing", "SEO", "Social Media"], desc: "At SOHub, we recognize that effective marketing goes beyond..." },
    { title: "3D Visualization", bgColor: "#333639", tags: ["Architecture", "Engineering", "Interior Design"], desc: "Our company specializes in envisioning images and animations..." }
  ];

  return (
    <div style={{ backgroundColor: '#000', minHeight: '400vh' }}>
      {sections.map((sec, index) => (
        <Section 
          key={sec.title}
          title={sec.title}
          bgColor={sec.bgColor}
          zIndex={index + 1}
          tags={sec.tags}
          desc={sec.desc}
        />
      ))}
    </div>
  );
}

```

## 6. 易错点与禁忌 (Gotchas & Don'ts)

* **绝对不要**：不要让前一个卡片在被覆盖时完全静止，如果不加投影或无任何视差，后一个卡片的升起会显得非常死板。建议在两层交界处加一层淡淡的 `box-shadow`。
* **页面高度崩塌**：由于使用了 `position: sticky`，外层包裹容器（Container）千万**不能**写 `overflow: hidden`，否则会直接掐断 sticky 的吸顶效果。

```

```