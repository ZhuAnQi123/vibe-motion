---
version: alpha
name: text-liquid-wave-distortion
name_zh: "文字局部近接液态波纹动效"
cover_video: "../assets/portfolio-text-wave.mp4"
tags: ["Proximity", "Hover"]
preview: { backgroundColor: "#fcf5ec", textColor: "#171717" }
description: >
  这是一种应用于大字重网页排版的“鼠标邻近液态水波纹”动效。
  其核心体感是：文字在静止状态下保持绝对的刚性几何形态。当鼠标悬停于文字之上时，只有“鼠标指针直接触及的单个字母”以及“其左右相邻的 1-2 个字母”会产生高频、丝滑的液态正弦扭曲。
  远离鼠标的字母保持静止，扭曲强度随距离呈指数级衰减。鼠标离开后，字母带有阻尼感地恢复原状。
  触发词：局部水波纹、字符拆分扭曲、鼠标近接衰减、SVG Proximity Displacement
website: ["https://aikawakenichi.com/"]

# 结构化的物理动效参数（供 AI 直接读取应用）
motion_tokens:
  proximity_influence:
    target_char_scale: 50      # 直接鼠标悬停的字母，最大像素偏移量值
    sibling_1_scale: 20        # 左右相邻第1个字母，衰减后的偏移量值
    sibling_2_scale: 5         # 左右相邻第2个字母，衰减后的偏移量值
    frequency: "0.04 0.08"     # 水波纹的基准频率 (X Y 轴)
  
  transition_properties:
    css_easing: "cubic-bezier(0.25, 1, 0.5, 1)" # 恢复刚性时的缓动曲线
    enter_duration: "150ms"    # 鼠标滑入，扭曲迅速反应的时间
    leave_duration: "400ms"    # 鼠标滑出，文字恢复原状的阻尼时间
---

# 文字局部近接液态波纹 规范

## 1. 动效体感 (Feel & Vibe)

- **视觉感受**：高频、局部、磁吸般的液体反应。当鼠标划过一串文字时，波纹就像指尖划过琴弦或水面一样，紧紧跟随鼠标的轨迹局部荡漾，未触及处平静如镜。
- **交互逻辑**：
  1. 页面加载时，文字为普通的静态排版。
  2. 鼠标滑入某个字符 $Char_n$，该字符立即加载液态滤镜。
  3. 协同反应：$Char_{n-1}$ 与 $Char_{n+1}$ 同步触发较低强度的同款滤镜。
  4. 鼠标移开后，波纹的振幅（Scale）在 400ms 内迅速归零，不产生晃动的余波，干净利落。
- **禁忌现象**：**严禁整个文本块（Text Block）无差别整体晃动**，这会导致视觉上的廉价感和眩晕感。

## 2. 媒体参考 (Reference Asset)

- **文件路径**：`../assets/portfolio-text-wave.gif`
- **来源引用**：https://aikawakenichi.com/ 视频 00:00 - 00:03。对比用户实验文件（录屏2026-06-27 18.11.42.mov）中的全局晃动，必须严格限制受控范围。

## 3. 技术实现要点 (Implementation Details)

### 推荐库 / 技术栈
- **DOM 结构重构**：必须在运行时使用 JS（或通过 React/Vue 组件）将目标文本利用 `split("")` 拆分为独立的 `<span>` 字符流。
- **驱动方式**：
  - **方法 A (纯 CSS 方案)**：定义多个不同强度的 SVG 滤镜（如 `#wave-max`, `#wave-mid`），利用 CSS 兄弟选择器 `.char:hover { filter: url(#wave-max); }` 以及 `.char:hover + .char { filter: url(#wave-mid); }` 实现无 JS 延迟的邻近衰减。
  - **方法 B (JS 动态映射)**：利用 JS 监听组件容器的 `mouseover`，获取当前 `target` 字符的 `index`，动态为 `index-1`、`index`、`index+1` 动态修改 `–wave-scale` 核心 CSS 变量。

## 4. 示例代码骨架 (CSS 变量 + SVG 局部驱动方案)

```html
<!-- SVG 共享全局波纹噪声（仅作为源，不直接挂载到大容器上） -->
<svg style="position: absolute; width: 0; height: 0;">
  <defs>
    <!-- 独立的滤镜，扭曲强度由 CSS 变量 --wave-scale 动态控制 -->
    <filter id="proximal-liquid-filter">
      <feTurbulence type="fractalNoise" baseFrequency="0.03 0.07" numOctaves="1" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" id="svg-disp-map" />
    </filter>
  </defs>
</svg>

<div class="text-container">
  <!-- 文字必须被拆解为单字符 -->
  <span class="char">B</span><span class="char">r</span><span class="char">i</span><span class="char">d</span><span class="char">g</span><span class="char">i</span><span class="char">n</span><span class="char">g</span>
</div>

<style>
  /* 基础状态：每个字符独立启用硬件加速，并应用滤镜占位 */
  .char {
    display: inline-block;
    transform: translateZ(0); 
    transition: filter 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    /* 默认不扭曲 */
    filter: none;
  }

  /* 使用 JS 或 CSS 动态为当前及邻近字符挂载带有不同 scale 表现的 class */
  .char.state-active {
    /* 可以在 JS 中动态改变 #svg-disp-map 的 scale 属性，或者单独为不同状态定义多个 filter */
    filter: url(#liquid-filter-heavy); 
  }
  .char.state-sibling {
    filter: url(#liquid-filter-light);
  }
</style>

## 5. 易错点与禁忌 (Gotchas & Don'ts)

* **避免全文字体模糊**：扭曲的是“位置”（Displacement），而不是加模糊（Blur）。笔画的边缘在扭曲时应当依旧保持锐利。
* **波纹速度不可过快**：过快的速度会像屏幕花屏或系统报错（Glitch），应当保持一种流水般的优雅阻尼感，单次扫过时间建议在 2s - 3s 之间。
* **CPU 过载防范**：如果使用 SVG 滤镜，高分辨率大屏幕下可能会掉帧。Agent 在生成代码时，如发现掉帧，应果断降级为 Canvas (WebGL) 渲染文字。
* Layout 塌陷（Word-break）：字符被拆分为 <span> 并变为 inline-block 后，可能会导致空格丢失或在换行处断开。请确保空格使用 &nbsp; 或利用 CSS white-space: pre; 保持原生句子的排版。
* 边界裁剪（Overflow）：单个字母因扭曲产生像素位移时，极易在其 <span> 的虚拟边界处被切平。务必给 .char 增加微量的 padding: 0 10px; 和 margin: 0 -10px; 来确保扭曲的边缘自然延伸。
* 性能优化：由于同一时间只有 3 个字符在运行滤镜，性能远好于全局滤镜。离开后务必将 filter 设为 none，彻底释放 GPU 算力。
