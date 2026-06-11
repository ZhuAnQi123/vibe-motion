---
name: interaction-library
description: 按触发词加载预设的高级交互动效与微交互实现方案（包含动画曲线、组件状态流转和物理参数）。当用户提到 弹性列表、丝滑侧边栏、流体卡片、苹果风动效、动态岛、物理抛掷等具体动效意图时使用。
---

# 交互动效库 (Interaction Library)

## 快速开始

1. 识别用户想要的交互模式（从下方「动效索引」中匹配）
2. 读取对应 `references/<interaction>.md` 全文
3. 根据该动效规范输出具体的代码实现（如 Framer Motion、CSS Animations 等），**全文使用中文**

## 动效索引

| 动效 ID | 触发词 / 场景 | 参考文件 | 演示媒体 (资产) |
|---|---|---|---|
| fluid-tabs | 流体标签、滑动Tab、Apple风Tab | [references/fluid-tabs.md](references/fluid-tabs.md) | `assets/fluid-tabs.gif` |

> **提示**：新增交互时，复制 `references/_template.md` 并填写参数，将动图/视频放入 `assets/` 目录，随后在本表追加记录。

## 输出模板

匹配到动效后，严格按以下结构输出给用户：

```markdown
## 动效解析
- 核心感受：
- 关键动作拆解：

## 物理与时间参数
- 缓动曲线 (Easing/Spring)：
- 时长 (Duration)：
- 延迟与交错 (Stagger)：

## 代码实现
- 推荐库：[如 Framer Motion / 纯 CSS]
- 代码片段：
[具体的 React/Vue/CSS 代码]

## 参考素材
- 查看效果：[输出对应的本地媒体相对路径，如 `assets/xxx.gif`]
```

## 决策规则

- 动效必须是流畅的、性能友好的，优先使用 `transform` 和 `opacity` 进行动画。
- 如果是 React 环境，优先推荐并使用 `Framer Motion`，因为它在物理动效（Spring）上表现最好。
- 必须考虑降级：包含 `@media (prefers-reduced-motion: reduce)` 的处理逻辑。
