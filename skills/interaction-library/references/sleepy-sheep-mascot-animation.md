---
version: beta-v3
name: sleepy-sheep-mascot-animation
name_zh: "睡眠应用引导吉祥物动效"
cover_video: "../assets/sleepy-sheep-mascot-animation.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/sleepy-sheep-mascot-animation.mp4"
tags: ["Reveal", "Elastic"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  这是一个通用的毛绒吉祥物（如小羊）的动效，旨在营造温馨宁静的氛围。
  角色以柔软的、带有弹性阻尼感的体感，进行缓慢而循环的微小浮动与姿态调整（包括轻微的上下位移、缩放和摇摆），仿佛在呼吸或漂浮。
  该动效适用于产品引导、加载状态或背景装饰，以提升用户情感体验。
  触发词：[循环漂浮、弹性呼吸、微动摇摆]
website: "https://x.com/todelsz/status/2076671901733138787"

rendering_engine: "DOM_CSS"

assets:
  required: true
  items:
    - name: "Mascot Character Graphic"
      type: "SVG / PNG (高对比度/透明背景)"
      description: "用于展示吉祥物形象的矢量或位图文件，推荐包含透明背景。"
      specs:
        aspect_ratio: "1:1"
        sampling_required: false
  dependencies:
    - "framer-motion@^11.0.0"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "0ms" # 针对单个原子组件，无交错延迟

  active_physics:
    stiffness: 100 # 调整为更柔和的弹性
    damping: 15 # 调整为更柔和的阻尼
    mass: 1
  css_fallback_easing: "cubic-bezier(0.42, 0, 0.58, 1)" # 更平滑的缓动
  duration: "1500ms" # 单次循环动画时长

  variants:
    initial: { opacity: 0, y: 10, scale: 0.95 } # 初始隐匿且略小略低
    reveal: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20, mass: 1 } } # 首次出现动画
    idle_float: { y: -5, scale: 1.02, rotateZ: 2, transition: { duration: 1.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" } } # 循环漂浮动画
---

# 睡眠应用引导吉祥物动效 (Sleepy Sheep Mascot Animation) Specification & Implementation Protocol

## 0. 准备工作与防逃跑校验 (Prerequisite & Guardrail - MUST READ)

> **⚠️ 核心指令（针对 Code-Agent）：**
> 在开始编写代码前，你必须校验以下规则，严禁“偷工减料”：
>
> 1. **引擎防降级约束 (ANTI-FALLBACK RULE)**：
>    - 若 `rendering_engine` 为 `CANVAS_2D` 或 `WEBGL_3D`：**严禁使用 `<motion.img>` 或 CSS 模糊 (blur) 来伪造粒子/流体效果**！必须使用 HTML5 Canvas API 或 Three.js 编写完整的像素采样与 `requestAnimationFrame` 动画循环！
>    - 若 `rendering_engine` 为 `DOM_3D`：必须在父节点包含 `perspective` 透视视口，并在动画节点开启 `transformStyle: 'preserve-3d'`，严禁生成扁平无深度的纸片旋转！
>
> 2. **单体原子化代码原则 (ATOMIC COMPONENT RULE)**：
>    - 即使视频中展示了多个重复元素，你**只需且只能导出 1 个高度复用的原子组件**（如 `<MotionCard />`）。背景色、图标路径等必须暴露为 `props` 动态传入，严禁硬编码重复节点！
>
> 3. **素材与算法兼容性拦截 (ASSET COMPATIBILITY CHECK)**：
>    - **If (渲染引擎为 Canvas/WebGL，但用户仅提供了一个普通静态 SVG/PNG，且未编写像素采样代码)** {
>        停止直接生成简单的 CSS 代码；
>        向用户发出明确提示：“此动效需要 Canvas/WebGL 逐像素采样渲染。我将为你编写算法，请确认你上传的图片具有清晰的高对比度轮廓...”
>    }

## 1. Interaction & Feel Vibe (动效体感与业务解耦)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 角色在首次出现时平滑且带有弹性地从小范围浮现并放大，随后进入循环的微小漂浮状态。这种漂浮感通过轻微的上下位移、缩放和平面摇摆（Z轴旋转）实现，营造出如呼吸般的生命感和梦幻般的宁静氛围。
- **Interaction Flow**: On Load -> Reveal (Opacity 0 -> 1, Y 10 -> 0, Scale 0.95 -> 1) with spring physics; After Reveal -> Loop Idle (Y -5px -> 5px, Scale 1.0 -> 1.02, RotateZ -2deg -> 2deg) repeating infinitely with "mirror" type, eased by "easeInOut".

## 2. Component DOM Mapping (原子组件结构映射)

*_Vision-Agent: 将视频中的视觉元素解耦并映射为单个可复用的 DOM/Canvas 架构。_*

- **[Stage Container]** (`div`)
  - 作为组件的外部容器，提供基础定位和尺寸约束。
- **[Motion Node]** (`motion.div`)
  - 核心动效载体，承载吉祥物图形，并应用 Framer Motion 的物理参数和动画状态机。
- **[Graphic Element]** (`img` 或 `svg`)
  - 吉祥物的实际图形内容，作为 `Motion Node` 的子元素。

## 3. Detailed Timeline Sequence (精确时序编排)

*_Vision-Agent: 基于视频帧分析导出以毫秒为单位的时序。_*

- **[0ms - ~300ms] Reveal Phase (首次出现)**:
  - `opacity`: 从 0 渐变为 1。
  - `y`: 从 `10px` 上移至 `0px`。
  - `scale`: 从 `0.95` 放大至 `1`。
  - 使用 Spring 物理效果进行过渡，展现柔和弹性。
- **[~300ms - ∞] Idle Loop Phase (循环漂浮)**:
  - **连续循环**: 动画无缝衔接，无限重复。
  - `y`: 在 `0px` 到 `-5px` 之间上下浮动，`repeatType: "mirror"`, `ease: "easeInOut"`, `duration: 1500ms`。
  - `scale`: 在 `1` 到 `1.02` 之间轻微缩放，与 `y` 同步，产生“呼吸”感。
  - `rotateZ`: 在 `0deg` 到 `2deg` 之间轻微左右摇摆，增强梦幻漂浮感。

## 4. Implementation Directives for Code-Agent (硬性编码指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NON-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection**: 优先读取项目根目录 `package.json` 判定环境，默认输出 React + Tailwind CSS + Framer Motion（若为 Canvas/WebGL 需引入原生 Canvas 或 Three.js）。
> 2. **Performance Guard**: 严禁触发 Reflow。DOM 路线仅允许动画 `transform`, `opacity`, `filter`；Canvas 路线必须注意粒子数量控制与 Canvas 清除机制 (`clearRect`)。
> 3. **Business De-coupling**: 变量命名、Props 接口定义必须完全抽象化（如 `iconUrl`, `activeColor`），禁止使用业务专有名词。

## 5. Generated Code Skeleton (示例代码模板)

*_Vision-Agent: 生成一份符合 rendering_engine 要求的完整单体组件示例代码。_*

```tsx
// 示例：单体原子组件导出 (React + Framer Motion)
import React from "react";
import { motion } from "framer-motion";

interface MascotAnimationProps {
  /**
   * 吉祥物图形的URL，可以是SVG或PNG
   */
  graphicUrl: string;
  /**
   * 自定义CSS类名
   */
  className?: string;
}

/**
 * 通用毛绒吉祥物循环漂浮动效组件
 */
export const MascotAnimation: React.FC<MascotAnimationProps> = ({
  graphicUrl,
  className = "",
}) => {
  const springPhysics = {
    type: "spring",
    stiffness: 150, // 首次出现时的弹簧刚度
    damping: 20,    // 首次出现时的阻尼
    mass: 1,
  };

  const idleFloatTransition = {
    duration: 1.5, // 每次循环时长
    repeat: Infinity,
    repeatType: "mirror" as const, // 镜像反转动画，平滑来回
    ease: "easeInOut",
  };

  const animationVariants = {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    reveal: { opacity: 1, y: 0, scale: 1, transition: springPhysics },
    idle_float: {
      y: [-5, 5, -5], // 上下漂浮
      scale: [1.0, 1.02, 1.0], // 呼吸式缩放
      rotateZ: [0, 2, 0, -2, 0], // 轻微摇摆
      transition: {
        y: idleFloatTransition,
        scale: idleFloatTransition,
        rotateZ: { ...idleFloatTransition, duration: idleFloatTransition.duration * 2 }, // 摇摆周期可以更长
      },
    },
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.div
        variants={animationVariants}
        initial="initial"
        animate={["reveal", "idle_float"]} // 先播放reveal，然后无缝衔接idle_float
        style={{ transformOrigin: "center center" }}
        className="w-20 h-20" // 默认尺寸，可由外部className覆盖
      >
        <img
          src={graphicUrl}
          alt="Mascot Character"
          className="w-full h-full object-contain"
          draggable="false"
        />
      </motion.div>
    </div>
  );
};
```

## 🛑 AI Anti-Patterns & Blocklist (AI 硬性禁忌)

> **⚠️ [SYSTEM RULE]** Code-Agent 必须严禁以下反模式：

### 1. The "Canvas-to-CSS" Downgrade (技术降级)

* ❌ **DON'T**: 严禁将 Canvas 粒子/Shader/流体效果降级使用 `<motion.img>` + `filter: blur()` 进行假粒子渲染。
* **DO**: 必须编写 Canvas 2D / WebGL 逐帧更新逻辑。

### 2. Business Overfitting & Hardcoding (业务硬编码与节点重复)

* ❌ **DON me**: 严禁在代码中写死具体品牌名称或在 Demo 中复制粘贴多个相同的动效节点。
* **DO**: 导出一个纯粹的原子组件，利用 `props` 实现复用。

### 3. Flat 3D Spinning (无透视的 2D 假 3D)

* ❌ **DON'T**: 严禁在不配置 `perspective` 和 `transform-style: preserve-3d` 的情况下直接使用 3D 旋转。
* **DO**: 必须建立 3D 视口，保证旋转具有立体空间感。