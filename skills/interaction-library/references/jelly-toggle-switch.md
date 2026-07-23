---
version: beta-v3
name: jelly-toggle-switch
name_zh: "果冻拨动开关"
cover_video: "../assets/jelly-toggle-switch.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/jelly-toggle-switch.mp4"
tags: ["Elastic", "Button", "Click"]
preview: { backgroundColor: "#F0F0F0", textColor: "#333333" }
description: >
  这是一个WebGPU驱动的拨动开关动效，表现为果冻状物体，通过SDF渲染实现有机、物理驱动的变形和发光颜色过渡。
  触发词：[流体形变、光晕过渡、弹性物理]
website: "https://x.com/iwoplaza/status/1988556641583714392"

# ==========================================
# 🛑 ENGINE ROUTING ( Vision-Agent 必须精准评估渲染引擎 )
# ==========================================
rendering_engine: "WEBGL_3D"

# ==========================================
# 🛡️ ASSET CONTRACT ( 素材契约与依赖项定义 )
# ==========================================
assets:
  required: true
  items:
    - name: "Procedural SDF Shape & Shader"
      type: "Shader Code / Procedural Definition"
      description: "用于在GPU上通过符号距离函数 (SDF) 实时生成、渲染和变形果冻状开关的几何体，并实现基于物理的弹性形变与发光效果。无需外部图像资产，完全程序化生成。"
      specs:
        aspect_ratio: "N/A"
        sampling_required: true # WebGL/WebGPU渲染需要像素采样
  dependencies:
    - "three@^0.160.0" # 代表性的WebGL渲染库
    - "@react-three/fiber@^8.0.0" # 用于在React中集成Three.js

# ==========================================
# ⚙️ MOTION TOKENS ( 动效物理预设 )
# ==========================================
motion_tokens:
  selected_preset: "PRESET_SPRING_BOUNCE"
  transform_origin: "center center"
  stagger_delay: "0ms"

  active_physics:
    stiffness: 80 # 较低的刚度，使物体更柔软
    damping: 15 # 较低的阻尼，产生更多回弹
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)" # 仅作为CSS fallback，WebGL/WebGPU内建物理
  duration: "600ms" # 动画完成大致时间

  variants:
    initial: { slider_position_x: 0, jelly_color: "#4C7CFF", glow_intensity: 0.3, deformation_strength: 0 } # 初始蓝色，轻微发光，无形变
    animate: { slider_position_x: 1, jelly_color: "#A020F0", glow_intensity: 1.0, deformation_strength: 1 } # 激活紫色，强烈发光，明显形变
    exit: { slider_position_x: 0, jelly_color: "#4C7CFF", glow_intensity: 0.3, deformation_strength: 0 } # 恢复到初始状态
---

# 果冻拨动开关 / Jelly Toggle Switch Specification & Implementation Protocol

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
- **Core Experience**: 这是一个模拟果冻质感的拨动开关，在切换状态时，开关主体会产生柔软、弹性的流体形变，并伴随发光颜色的平滑过渡，营造出愉悦且真实的物理反馈。
- **Interaction Flow**: Click -> 开关滑块沿X轴平移并触发表皮的流体形变（挤压、拉伸、回弹），同时内部发光颜色从初始色（如蓝色）过渡到激活色（如紫色或黄色），发光强度增强；再次点击时，过程反向，平滑恢复初始状态。

## 2. Component DOM Mapping (原子组件结构映射)

*_Vision-Agent: 将视频中的视觉元素解耦并映射为单个可复用的 DOM/Canvas 架构。_*

- **[Stage Container]** (`div` - WebGL Canvas 视口容器)
  - 负责设置 Canvas 尺寸、位置及外部交互（如点击事件捕获）。
- **[Motion Node]** (`canvas` - WebGL 渲染上下文)
  - 通过 `Three.js` (或原生 WebGPU API) 建立场景、相机、灯光和渲染器。
  - 在此 Canvas 上，使用 Shader 程序（GLSL）基于 SDF 算法实时生成和渲染果冻状几何体。
  - 物理模拟（形变、弹性回弹）将在 Shader 或 CPU 侧的物理引擎中计算，并通过 Uniform 变量传递给 Shader 进行渲染。
  - 光照和发光效果也通过 Shader 实现，根据开关状态改变颜色和强度。
- **[Layer Elements]**
  - 无直接 DOM 层图像元素，所有视觉元素（开关主体、滑杆、发光效果）均通过 Shader 程序化生成。

## 3. Detailed Timeline Sequence (精确时序编排)

*_Vision-Agent: 基于视频帧分析导出以毫秒为单位的时序。_*

- **[0ms - 600ms] Trigger Phase (点击切换到激活状态)**:
  - **0ms**: 开关处于初始状态（左侧，蓝色，低发光，无形变）。
  - **0ms - 200ms**:
    - 滑块（如果独立于果冻）开始沿X轴平移到右侧。
    - 果冻主体受“点击”或“滑块移动”的初始冲击，开始形变：首先可能在移动方向上稍有挤压，随后在拉伸方向上变形，并开始呈现激活色（例如从蓝色过渡到紫色）。
    - 发光强度逐渐增强，周围环境光也可能受其影响。
  - **200ms - 600ms**:
    - 滑块抵达目标位置，形变动能传递至果冻，使其在达到最大形变后产生几次弹性回弹震荡，逐渐趋于稳定。
    - 颜色过渡完成，发光强度达到峰值并稳定。
    - 物理形变效果在约600ms处完全衰减，果冻稳定在激活状态下的形态。
- **[Exit Phase] Reverse Sequence (再次点击，切换回初始状态)**:
  - **0ms - 600ms (相对于再次点击触发)**:
    - 滑块沿X轴反向平移回左侧初始位置。
    - 果冻主体形变反向进行，经历类似的挤压、拉伸、回弹过程，逐渐恢复到未变形的静态状态。
    - 颜色从激活色平滑过渡回初始色（蓝色），发光强度逐渐减弱。
    - 物理形变在约600ms处完全衰减，果冻完全恢复到初始的静态、非激活状态。

## 4. Implementation Directives for Code-Agent (硬性编码指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NON-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection**: 优先读取项目根目录 `package.json` 判定环境，默认输出 React + Tailwind CSS + Framer Motion（若为 Canvas/WebGL 需引入原生 Canvas 或 Three.js）。
>    - **本案例强制要求 WebGL/WebGPU 渲染**，应优先使用 `Three.js` 或直接 WebGPU API 结合 React 进行实现。
> 2. **Performance Guard**: 严禁触发 Reflow。DOM 路线仅允许动画 `transform`, `opacity`, `filter`；Canvas 路线必须注意粒子数量控制与 Canvas 清除机制 (`clearRect`)。
>    - **本案例为 WebGL 路线**，需确保 Shader 优化，GPU计算高效，`requestAnimationFrame` 循环稳定。
> 3. **Business De-coupling**: 变量命名、Props 接口定义必须完全抽象化（如 `iconUrl`, `activeColor`），禁止使用业务专有名词。

## 5. Generated Code Skeleton (示例代码模板)

*_Vision-Agent: 生成一份符合 rendering_engine 要求的完整单体组件示例代码。_*

```tsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

// 示例 Shader Code (简化版，仅用于演示概念)
// 实际的SDF和物理模拟将复杂得多
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uDeformationStrength;
  uniform vec3 uBaseColor;
  uniform vec3 uActiveColor;
  uniform float uGlowIntensity;
  uniform float uToggleState; // 0 for off, 1 for on
  varying vec2 vUv;

  void main() {
    // 模拟基于SDF的形状（这里简化为一个圆角矩形）
    // 实际的SDF会更复杂，包含布尔运算和形变逻辑
    vec2 pos = vUv - 0.5;
    float dist = length(max(abs(pos) - vec2(0.3, 0.2), 0.0)) - 0.05; // Simplified rounded rect

    // 模拟物理形变 (简化：基于时间做震荡)
    // 真实的物理形变会通过CPU计算或更复杂的Shader实现
    float deformation = sin(uTime * 10.0 + uDeformationStrength * 5.0) * uDeformationStrength * 0.02;
    dist -= deformation * pos.y; // Simple y-axis wobble

    // 混合颜色
    vec3 color = mix(uBaseColor, uActiveColor, uToggleState);

    // 模拟发光
    float glow = smoothstep(0.0, 0.1, dist); // Distance from shape edge
    color += color * glow * uGlowIntensity;

    if (dist > 0.0) {
      discard; // Transparent outside the shape
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface JellySwitchProps {
  initialColor?: string;
  activeColor?: string;
  className?: string;
}

// Three.js场景中的果冻物体
const JellyObject: React.FC<
  JellySwitchProps & { toggleState: number; deformationStrength: number; glowIntensity: number; }
> = ({ initialColor = "#4C7CFF", activeColor = "#A020F0", toggleState, deformationStrength, glowIntensity }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();

  const baseColor = new THREE.Color(initialColor);
  const actColor = new THREE.Color(activeColor);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uDeformationStrength.value = deformationStrength;
      materialRef.current.uniforms.uGlowIntensity.value = glowIntensity;
      materialRef.current.uniforms.uToggleState.value = toggleState;
    }
    // Simple slider movement for the entire object
    // In a real scenario, the slider part might be a separate mesh or shader offset
    if (meshRef.current) {
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, toggleState * viewport.width * 0.1, 0.1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width * 0.2, viewport.height * 0.2, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uDeformationStrength: { value: deformationStrength },
          uBaseColor: { value: baseColor },
          uActiveColor: { value: actColor },
          uGlowIntensity: { value: glowIntensity },
          uToggleState: { value: toggleState },
        }}
        transparent={true}
      />
    </mesh>
  );
};

/**
 * 通用果冻拨动开关动效组件
 */
export const JellyToggleSwitch: React.FC<JellySwitchProps> = ({
  initialColor,
  activeColor,
  className = "",
}) => {
  const [isToggled, setIsToggled] = useState(false);
  const [deformationStrength, setDeformationStrength] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0.3);
  const [toggleState, setToggleState] = useState(0); // For color/position lerp

  const handleClick = useCallback(() => {
    setIsToggled((prev) => !prev);
    setDeformationStrength(1); // Trigger deformation
    setGlowIntensity(1.0); // Trigger glow
    setToggleState(isToggled ? 0 : 1); // Update toggle state for color/position lerp
  }, [isToggled]);

  // Simulate physics decay for deformation and glow
  useEffect(() => {
    if (deformationStrength > 0) {
      const timeout = setTimeout(() => {
        setDeformationStrength(0); // Decay deformation
      }, 600); // Corresponds to duration in motion_tokens
      return () => clearTimeout(timeout);
    }
    if (glowIntensity > 0.3 && !isToggled) { // Fade glow only if turning off
        const timeout = setTimeout(() => {
            setGlowIntensity(0.3);
        }, 600);
        return () => clearTimeout(timeout);
    }
  }, [deformationStrength, glowIntensity, isToggled]);

  return (
    <div
      className={`relative w-48 h-24 cursor-pointer rounded-full flex items-center justify-center overflow-hidden 
                  ${isToggled ? "bg-purple-900" : "bg-gray-200"} transition-colors duration-500 ease-in-out
                  ${className}`}
      onClick={handleClick}
    >
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <JellyObject
          initialColor={initialColor}
          activeColor={activeColor}
          toggleState={toggleState}
          deformationStrength={deformationStrength}
          glowIntensity={glowIntensity}
        />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg pointer-events-none">
        {isToggled ? "ON" : "OFF"}
      </div>
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