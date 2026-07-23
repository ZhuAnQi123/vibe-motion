---
version: beta-v3
name: receipt-collage-running-animation
name_zh: "收据拼贴跑动动画"
cover_video: "../assets/receipt-collage-running-animation.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/receipt-collage-running.mp4"
tags: ["Reveal"]
preview: { backgroundColor: "#FFFFFF", textColor: "#000000" }
description: >
  这是一个高对比度的黑白拼贴动画，一个手绘风格的人物在动态变化的收据背景上持续跑动，
  文字元素以像素化和渐变的形式出现与消失，营造出实验性的视觉节奏感。
  触发词：[拼贴动画、连续跑动、像素化文字]
website: "https://www.instagram.com/p/DZ7p71NtmhK/"

# ==========================================
# 🛑 ENGINE ROUTING ( Vision-Agent 必须精准评估渲染引擎 )
# ==========================================
rendering_engine: "CANVAS_2D"

# ==========================================
# 🛡️ ASSET CONTRACT ( 素材契约与依赖项定义 )
# ==========================================
assets:
  required: true
  items:
    - name: "Running Character Sprite"
      type: "PNG (透明背景) / SVG"
      description: "手绘风格的跑步人物序列帧图像或单张雪碧图，用于Canvas逐帧动画渲染。"
      specs:
        aspect_ratio: "variable"
        sampling_required: true # 需要进行像素采样以处理透明度和绘制
    - name: "Receipt Background Assets"
      type: "PNG / JPEG"
      description: "多张黑白收据背景图片，用于Canvas拼贴和切换。"
      specs:
        aspect_ratio: "variable"
        sampling_required: false # 无需像素采样，直接绘制即可
    - name: "Text Elements (RUNNING)"
      type: "Font / SVG"
      description: "动态文字元素 'RUNNING' 的字体或SVG路径，用于在Canvas上渲染并实现像素化效果。"
      specs:
        aspect_ratio: "variable"
        sampling_required: true # 需要对文字进行像素级操作以实现像素化效果
  dependencies:
    - "framer-motion@^11.0.0" # 可用于Canvas容器的高级交互，但核心动画为原生Canvas

# ==========================================
# ⚙️ MOTION TOKENS ( 动效物理预设 )
# ==========================================
motion_tokens:
  selected_preset: "PRESET_EASE_IN_OUT" # 适用于内部元素（如文字）的出现/消失过渡
  transform_origin: "center center"
  stagger_delay: "0ms" # 核心为连续动画，无明显交错

  active_physics:
    stiffness: 100 # 对于非交互式连续动画，此值影响较小，作为默认参考
    damping: 20
    mass: 1
  css_fallback_easing: "cubic-bezier(0.42, 0, 0.58, 1)" # ease-in-out
  duration: "500ms" # 适用于文字元素等微动画的过渡时长

  variants: # 主要针对Canvas内部元素的过渡效果（如文字）
    initial: { opacity: 0, pixelation_strength: 10 } # 假设Canvas内部会处理像素化强度
    animate: { opacity: 1, pixelation_strength: 0 }
    exit: { opacity: 0, pixelation_strength: 10 }
---

# 收据拼贴跑动动画 / Receipt Collage Running Animation Specification & Implementation Protocol

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

- **Visual Physics Class**: Particle-Dissolve / Linear-Smooth
- **Core Experience**: 一个高对比度的黑白拼贴动画，手绘风格人物在不断变化的收据背景上循环跑动，伴随像素化的文字出现与消失，营造出实验性的视觉节奏感。
- **Interaction Flow**: 连续的动画循环。人物跑步动画序列帧循环播放；收据背景元素随机切换或平移，形成视觉拼贴效果；文本 "RUNNING" 在特定时间点以自定义的像素化或渐变效果出现，保持一段时间后以反向效果消失。

## 2. Component DOM Mapping (原子组件结构映射)

*_Vision-Agent: 将视频中的视觉元素解耦并映射为单个可复用的 DOM/Canvas 架构。_*

- **[Stage Container]** (`div`)
  - 作为Canvas的父容器，管理Canvas的大小和定位。
- **[Motion Node]** (`canvas`)
  - 核心渲染画布，所有动画元素（人物、背景、文字）均在此Canvas上绘制，并通过`requestAnimationFrame`进行逐帧更新。
- **[Layer Elements]**
  - 无独立的DOM层，所有视觉元素在Canvas内部作为图像、文本或像素数据进行管理和渲染。

## 3. Detailed Timeline Sequence (精确时序编排)

*_Vision-Agent: 基于视频帧分析导出以毫秒为单位的时序。_*

- **[0ms - Nms] Continuous Loop Phase (连续动画循环)**:
  - **人物跑步动画**: 帧动画循环播放，根据雪碧图或序列帧以固定帧率绘制人物。
  - **收据背景切换/平移**: Canvas背景区域在预设时间间隔内切换不同的收据图片，或通过平移、缩放等效果模拟拼贴变化。
  - **文本 "RUNNING" 出现**: 在循环的特定时刻，文本 "RUNNING" 开始从完全像素化（或透明）状态，在约 `500ms` 内，逐渐清晰显现（同时减少像素化强度）。
  - **文本 "RUNNING" 保持**: 文本清晰显示一段时间（例如 `1000ms - 2000ms`）。
  - **文本 "RUNNING" 消失**: 文本在约 `500ms` 内，以反向效果（再次像素化并淡出）消失。
  - 整个过程在 `requestAnimationFrame` 驱动下无限循环。

## 4. Implementation Directives for Code-Agent (硬性编码指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NON-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection**: 优先读取项目根目录 `package.json` 判定环境，默认输出 React + Tailwind CSS + Framer Motion（若为 Canvas/WebGL 需引入原生 Canvas 或 Three.js）。
> 2. **Performance Guard**: 严禁触发 Reflow。DOM 路线仅允许动画 `transform`, `opacity`, `filter`；Canvas 路线必须注意粒子数量控制与 Canvas 清除机制 (`clearRect`)。
> 3. **Business De-coupling**: 变量命名、Props 接口定义必须完全抽象化（如 `iconUrl`, `activeColor`），禁止使用业务专有名词。

**针对 Canvas_2D 实现的额外指令：**
- 必须使用 `HTML5 Canvas API` 创建 `2D context`。
- 实现一个 `requestAnimationFrame` 循环来驱动所有动画。
- 加载人物雪碧图或序列帧，实现跑步动画的逐帧绘制。
- 加载收据背景图片，并实现其在Canvas上的绘制、切换与可能的变换。
- 对于文字 "RUNNING"，需要实现自定义的像素化（或字符重组）和渐变（alpha）效果。这可能涉及：
    1. 在离屏Canvas上绘制文本。
    2. 获取文本区域的像素数据 (`getImageData`)。
    3. 根据动画状态对像素数据进行处理（例如，分组像素、修改颜色或透明度）。
    4. 将处理后的像素数据绘制回主Canvas (`putImageData`)。
- 确保动画循环中及时调用 `clearRect` 清除上一帧内容，以避免残影。

## 5. Generated Code Skeleton (示例代码模板)

*_Vision-Agent: 生成一份符合 rendering_engine 要求的完整单体组件示例代码。_*

```tsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion"; // Framer Motion可用于Canvas容器的整体动画或挂载/卸载动画

interface ReceiptAnimationCanvasProps {
  runnerSpriteSheetUrl: string;
  receiptImageUrls: string[];
  runningText: string;
  className?: string;
}

/**
 * 通用收据拼贴跑动动画Canvas组件
 */
export const ReceiptAnimationCanvas: React.FC<ReceiptAnimationCanvasProps> = ({
  runnerSpriteSheetUrl,
  receiptImageUrls,
  runningText,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 动画状态管理
  const frameCount = 8; // 跑步动画的帧数示例
  const runnerFrameWidth = 100; // 每帧宽度示例
  const runnerFrameHeight = 100; // 每帧高度示例
  const [currentFrame, setCurrentFrame] = useState(0);
  const [receiptIndex, setReceiptIndex] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const [pixelationStrength, setPixelationStrength] = useState(10); // 0-10, 0 is no pixelation

  // 加载所有所需图片
  const runnerImage = useRef<HTMLImageElement | null>(null);
  const receiptImages = useRef<HTMLImageElement[]>([]);

  const loadImage = useCallback((url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }, []);

  useEffect(() => {
    const loadAllImages = async () => {
      try {
        runnerImage.current = await loadImage(runnerSpriteSheetUrl);
        const loadedReceipts = await Promise.all(
          receiptImageUrls.map((url) => loadImage(url))
        );
        receiptImages.current = loadedReceipts;
        setImagesLoaded(true);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };
    loadAllImages();
  }, [runnerSpriteSheetUrl, receiptImageUrls, loadImage]);

  // Canvas 绘制逻辑
  const draw = useCallback(
    (context: CanvasRenderingContext2D, width: number, height: number) => {
      context.clearRect(0, 0, width, height);

      // 1. 绘制收据背景
      if (receiptImages.current[receiptIndex]) {
        context.drawImage(
          receiptImages.current[receiptIndex],
          0,
          0,
          width,
          height
        );
      }

      // 2. 绘制跑步人物
      if (runnerImage.current) {
        const sx = currentFrame * runnerFrameWidth;
        const sy = 0; // Assume single row sprite sheet
        const sWidth = runnerFrameWidth;
        const sHeight = runnerFrameHeight;
        const dx = width / 2 - runnerFrameWidth / 2;
        const dy = height - runnerFrameHeight - 20; // Position near bottom
        context.drawImage(
          runnerImage.current,
          sx,
          sy,
          sWidth,
          sHeight,
          dx,
          dy,
          sWidth,
          sHeight
        );
      }

      // 3. 绘制带有像素化和透明度效果的文字
      if (runningText) {
        context.save();
        context.globalAlpha = textOpacity;

        // Create an off-screen canvas for pixelation effect
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        const offscreenCtx = offscreenCanvas.getContext("2d")!;

        offscreenCtx.font = "bold 48px sans-serif";
        offscreenCtx.textAlign = "center";
        offscreenCtx.fillStyle = "black";
        offscreenCtx.fillText(runningText, width / 2, height / 4);

        if (pixelationStrength > 0) {
          const pixelSize = Math.max(1, pixelationStrength);
          // Scale down
          offscreenCtx.drawImage(
            offscreenCanvas,
            0,
            0,
            offscreenCanvas.width,
            offscreenCanvas.height,
            0,
            0,
            offscreenCanvas.width / pixelSize,
            offscreenCanvas.height / pixelSize
          );
          // Scale up
          context.drawImage(
            offscreenCanvas,
            0,
            0,
            offscreenCanvas.width / pixelSize,
            offscreenCanvas.height / pixelSize,
            0,
            0,
            width,
            height
          );
        } else {
          context.font = "bold 48px sans-serif";
          context.textAlign = "center";
          context.fillStyle = "black";
          context.fillText(runningText, width / 2, height / 4);
        }

        context.restore();
      }
    },
    [
      currentFrame,
      receiptIndex,
      textOpacity,
      pixelationStrength,
      runningText,
    ]
  );

  // 动画循环
  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let lastRunnerUpdateTime = 0;
    let lastReceiptUpdateTime = 0;
    let lastTextUpdateTime = 0;
    const runnerFrameDuration = 80; // ms per runner frame
    const receiptChangeDuration = 3000; // ms per receipt change
    const textAnimationDuration = 500; // ms for text fade/pixelate in/out
    const textDisplayDuration = 2000; // ms for text to stay visible

    let textState: "hidden" | "fadeIn" | "display" | "fadeOut" = "hidden";
    let textAnimationStartTime = 0;

    const animate = (time: DOMHighResTimeStamp) => {
      // Update runner frame
      if (time - lastRunnerUpdateTime > runnerFrameDuration) {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % frameCount);
        lastRunnerUpdateTime = time;
      }

      // Update receipt background
      if (time - lastReceiptUpdateTime > receiptChangeDuration) {
        setReceiptIndex(
          (prevIndex) => (prevIndex + 1) % receiptImages.current.length
        );
        lastReceiptUpdateTime = time;
      }

      // Update text animation
      if (time - lastTextUpdateTime > receiptChangeDuration / 3) { // Example: text appears every 1/3 of receipt change cycle
        if (textState === "hidden") {
          textState = "fadeIn";
          textAnimationStartTime = time;
        }
        lastTextUpdateTime = time;
      }

      if (textState === "fadeIn") {
        const elapsed = time - textAnimationStartTime;
        if (elapsed < textAnimationDuration) {
          const progress = elapsed / textAnimationDuration;
          setTextOpacity(progress);
          setPixelationStrength(10 - progress * 10);
        } else {
          setTextOpacity(1);
          setPixelationStrength(0);
          textState = "display";
          textAnimationStartTime = time; // Reuse for display duration
        }
      } else if (textState === "display") {
        const elapsed = time - textAnimationStartTime;
        if (elapsed > textDisplayDuration) {
          textState = "fadeOut";
          textAnimationStartTime = time; // Reuse for fade out
        }
      } else if (textState === "fadeOut") {
        const elapsed = time - textAnimationStartTime;
        if (elapsed < textAnimationDuration) {
          const progress = elapsed / textAnimationDuration;
          setTextOpacity(1 - progress);
          setPixelationStrength(progress * 10);
        } else {
          setTextOpacity(0);
          setPixelationStrength(10);
          textState = "hidden";
        }
      }


      draw(context, canvas.width, canvas.height);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [imagesLoaded, draw, frameCount, receiptImages]); // Add all dependencies for useCallback/useEffect

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        width={720} // Example width, should be dynamic or based on container
        height={1280} // Example height, should be dynamic or based on container
        className="block w-full h-full object-contain"
      />
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white text-black">
          Loading assets...
        </div>
      )}
    </motion.div>
  );
};

```