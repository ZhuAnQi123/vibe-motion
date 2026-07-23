---
version: beta-v3
name: football-momentum-visualization
name_zh: "足球比赛动能可视化"
cover_video: "../assets/football-momentum-visualization.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/football-momentum-visualization.mp4"
tags: ["3D", "Geometric"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  这是一个数据驱动的3D足球比赛动能可视化动效。它通过动态变化的红色（西班牙队）和蓝色（阿根廷队）曲面来表示两队的实时动能，曲面高度和颜色强度随比赛进程和关键事件（如进球）平滑起伏。底部动能图表同步更新，并在比赛结束时展示最终数据统计。
  触发词：[动态3D曲面形变、数据驱动、实时热力图、比分更新]
website: "https://www.instagram.com/reel/Da_hW8XvYBS/"

rendering_engine: "WEBGL_3D"

assets:
  required: true
  items:
    - name: "Procedural 3D Field Mesh"
      type: "Generated at runtime"
      description: "表示足球场地的三维网格，其顶点高度和颜色由比赛数据实时驱动，通过顶点着色器和片段着色器进行渲染。无需预设静态纹理，图形完全由算法和实时数据生成。"
      specs:
        aspect_ratio: "dynamic, adapts to canvas size"
        sampling_required: true # 需要对输入数据（如 momentum 值）进行采样以驱动着色器
  dependencies:
    - "three.js@^0.160.0" # 用于3D场景渲染和网格管理

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH" # 适用于UI元素的过渡，主3D曲面形变由数据驱动
  transform_origin: "center center"
  stagger_delay: "0ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 1 }
    animate: { opacity: 1 }
    exit: { opacity: 0 }
---

# 足球比赛动能可视化 (Football Momentum Visualization) Specification & Implementation Protocol

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
- **Core Experience**: 通过数据驱动的动态3D曲面形变和颜色渐变，实时可视化足球比赛的动能变化。红色区域代表一支队伍的动能，蓝色区域代表另一支队伍的动能，曲面高度和颜色强度随比赛进程和关键事件（如进球）而起伏，为用户提供直观的战况概览。底部的动能图表同步更新，最终展示比赛统计数据。
- **Interaction Flow**: Continuous data stream updates -> 3D surface mesh deformation (height & color intensity changes) driven by real-time game momentum data -> score/time/game event updates with smooth transitions. A significant game event (e.g., a goal) triggers a rapid, pronounced peak in the corresponding team's momentum surface and an update to the score, potentially with an associated label.

## 2. Component DOM Mapping (原子组件结构映射)

*Vision-Agent: 将视频中的视觉元素解耦并映射为单个可复用的 DOM/Canvas 架构。*

- **[Stage Container]** (`div`): 作为整个可视化容器，负责布局和尺寸管理。
- **[WebGL Canvas]** (`canvas`): 核心渲染区域，Three.js 实例将在此处绘制动态的3D足球场曲面。
- **[UI Overlay]** (`div`): 包含比分、时间、球队名称、以及底部的动能图和最终统计数据等UI元素，这些元素将通过DOM/CSS定位在Canvas之上。
  - **[Score/Time Display]** (`div` / `span`): 显示比赛时间、半场信息和比分。
  - **[Momentum Graph]** (`svg` / `canvas` / `div` with CSS animations): 底部展示历史动能变化的图表。
  - **[Match Stats Overlay]** (`div`): 比赛结束时弹出的最终数据统计卡片。

## 3. Detailed Timeline Sequence (精确时序编排)

*Vision-Agent: 基于视频帧分析导出以毫秒为单位的时序。*

- **[0ms - 120min+] Continuous Data-Driven Update Phase**:
  - **Momentum Data Ingestion**: 实时比赛数据流（如预期进球xG、控球率、射门次数等）被持续摄取并转换为“动能”值。
  - **3D Surface Deformation**: 这些动能值作为着色器统一变量 (uniforms) 或顶点属性 (attributes) 输入到 Three.js 渲染管线。顶点着色器根据动能数据实时调整场地的网格顶点高度，形成波动的曲面。
  - **Color Gradient**: 片段着色器根据每个点的动能强度和所属队伍（红/蓝）计算颜色，实现动态的颜色混合和强度变化，形成热力图效果。
  - **UI Sync**: 比赛时间、比分和底部动能图表与3D曲面动画同步更新。
- **[106'] Goal Event (Spain)**:
  - **Momentum Peak**: 在西班牙队进球时，红色区域（西班牙队）的曲面高度会迅速且显著地升高，并伴随颜色饱和度增强，表现为一个尖锐的波峰。
  - **Score Update**: 比分从 "0 - 0" 平滑过渡到 "1 - 0"，比分数字进行一次快速的缩放或颜色高亮动画（约100-200ms）。
  - **Player Label**: 短暂显示进球球员姓名 "F. Torres"，然后淡出（约500ms）。
- **[120'] Full Time & Stats Overlay**:
  - **Field Transition**: 比赛结束时，3D曲面可以平滑地回落至一个更平坦或静态的状态，或逐渐淡出。
  - **Stats Reveal**: 一个包含最终比赛统计数据（xG、射门、角球、牌）的UI卡片从屏幕中央或底部以弹性（PRESET_SPRING_SMOOTH）动画出现（约350ms）。数据条目可能带有交错延迟 (`stagger_delay`) 逐一显示。

## 4. Implementation Directives for Code-Agent (硬性编码指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NON-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection**: 优先读取项目根目录 `package.json` 判定环境，默认输出 React + Tailwind CSS + Framer Motion（若为 Canvas/WebGL 需引入原生 Canvas 或 Three.js）。
> 2. **Performance Guard**: 严禁触发 Reflow。DOM 路线仅允许动画 `transform`, `opacity`, `filter`；Canvas 路线必须注意粒子数量控制与 Canvas 清除机制 (`clearRect`)。
> 3. **Business De-coupling**: 变量命名、Props 接口定义必须完全抽象化（如 `iconUrl`, `activeColor`），禁止使用业务专有名词。

- 使用 `Three.js` 库进行 3D 渲染。
- 创建一个 `PlaneGeometry` 作为足球场的基础网格。
- 实现自定义的 `ShaderMaterial`，包含 `vertexShader` 和 `fragmentShader`。
  - `vertexShader` 应该根据传入的动能数据（作为 uniform 或 texture）计算并调整每个顶点的高度 (`position.y`)。
  - `fragmentShader` 应该根据顶点高度和动能归属（红/蓝）计算像素颜色，实现颜色渐变和热力图效果。
- 设置 `requestAnimationFrame` 循环，持续更新 Three.js 场景，并根据传入的比赛数据更新着色器 uniform。
- UI 元素（比分、时间、图表、统计卡片）应使用 React DOM 和 Tailwind CSS 布局，并通过 `framer-motion` 实现其过渡动画。
- 比分和时间更新应是平滑的数字过渡或简单的透明度/缩放动画。
- 最终统计卡片应在比赛结束后以弹性动画（`PRESET_SPRING_SMOOTH`）展示。

## 5. Generated Code Skeleton (示例代码模板)

*Vision-Agent: 生成一份符合 rendering_engine 要求的完整单体组件示例代码。*

```tsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// GLSL Shader for the dynamic football field surface
const vertexShader = `
  uniform float time;
  uniform sampler2D momentumDataTexture; // Texture to hold momentum data
  uniform float fieldWidth;
  uniform float fieldHeight;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vMomentumStrength; // Pass momentum strength to fragment shader

  void main() {
    vUv = uv;
    vNormal = normal;

    // Sample momentum data based on UV coordinates
    // Assuming momentumDataTexture contains normalized momentum values for the field
    vec4 momentumSample = texture2D(momentumDataTexture, uv);
    // Let's say red channel is team A momentum, green is team B
    // For simplicity, we can blend them or pick one based on a hypothetical dominant team
    float teamAMomentum = momentumSample.r;
    float teamBMomentum = momentumSample.g;

    // Combine or choose momentum for height
    // Example: Use a weighted average or simply sum them up for overall "activity"
    vMomentumStrength = max(teamAMomentum, teamBMomentum); // Use the higher momentum for height

    // Apply deformation based on momentum strength
    // The height factor can be adjusted to control the visual impact
    float displacement = vMomentumStrength * 10.0; // Max height of 10 units (adjust as needed)

    vec3 newPosition = position + normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform sampler2D momentumDataTexture;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vMomentumStrength; // Received from vertex shader

  // Define team colors
  vec3 teamAColor = vec3(1.0, 0.0, 0.0); // Red for Spain
  vec3 teamBColor = vec3(0.0, 0.0, 1.0); // Blue for Argentina

  void main() {
    // Re-sample momentum data to get individual team strengths
    vec4 momentumSample = texture2D(momentumDataTexture, vUv);
    float teamAMomentum = momentumSample.r;
    float teamBMomentum = momentumSample.g;

    // Determine the dominant team's momentum for color blending
    vec3 finalColor = mix(teamAColor, teamBColor, smoothstep(0.0, 1.0, teamBMomentum / (teamAMomentum + teamBMomentum + 0.0001))); // Blend based on relative strength

    // Increase saturation/brightness based on overall momentum strength
    finalColor = mix(vec3(0.2, 0.2, 0.2), finalColor, vMomentumStrength * 1.5); // Blend with dark base, intensify with momentum

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const UI_SPRING_CONFIG = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

interface FootballMomentumVisualizationProps {
  initialScoreA?: number;
  initialScoreB?: number;
  teamAName?: string;
  teamBName?: string;
  // In a real scenario, this would be a data stream or a series of updates
  matchEvents?: { minute: number; type: 'goalA' | 'goalB' | 'momentumChange'; value?: number; player?: string; }[];
}

interface MatchStats {
  xG_A: number;
  xG_B: number;
  shots_A: number;
  shots_B: number;
  corners_A: number;
  corners_B: number;
  cards_A: number;
  cards_B: number;
}

/**
 * 足球比赛动能可视化组件 (WebGL + UI Overlay)
 */
export const FootballMomentumVisualization: React.FC<FootballMomentumVisualizationProps> = ({
  initialScoreA = 0,
  initialScoreB = 0,
  teamAName = "SPA",
  teamBName = "ARG",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [minute, setMinute] = useState(0);
  const [half, setHalf] = useState("1ST HALF");
  const [scoreA, setScoreA] = useState(initialScoreA);
  const [scoreB, setScoreB] = useState(initialScoreB);
  const [lastGoalPlayer, setLastGoalPlayer] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [matchStats, setMatchStats] = useState<MatchStats | null>(null);

  // Example: Momentum data (would be updated by a data stream in a real app)
  const momentumDataRef = useRef(new Uint8Array(64 * 64 * 4)); // RGBA texture
  const momentumTextureRef = useRef<THREE.DataTexture | null>(null);

  // Function to simulate real-time momentum updates
  const updateMomentumData = useCallback(() => {
    // This is a placeholder for actual data integration
    // In a real application, this data would come from a websocket or API
    const data = momentumDataRef.current;
    const size = 64; // Texture size

    // Simulate a "hill" for team A and a "valley" for team B, shifting over time
    const timeFactor = minute / 120; // 0 to 1 over match duration
    const peakPositionA = new THREE.Vector2(0.3 + Math.sin(timeFactor * Math.PI * 2) * 0.2, 0.5);
    const peakPositionB = new THREE.Vector2(0.7 - Math.cos(timeFactor * Math.PI * 2) * 0.2, 0.5);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const x = i / (size - 1);
        const y = j / (size - 1);

        const distA = peakPositionA.distanceTo(new THREE.Vector2(x, y));
        const distB = peakPositionB.distanceTo(new THREE.Vector2(x, y));

        let momentumA = Math.max(0, 1 - distA * 2.5) * (1 + (scoreA / 5)); // Base momentum + score influence
        let momentumB = Math.max(0, 1 - distB * 2.5) * (1 + (scoreB / 5));

        // Simulate a goal peak if recently scored by A
        if (lastGoalPlayer && teamAName === "SPA" && minute >= 106 && minute < 107) {
            momentumA = Math.min(1.0, momentumA + 0.5); // Add a burst
        } else if (lastGoalPlayer && teamBName === "ARG" && minute >= 106 && minute < 107) {
            momentumB = Math.min(1.0, momentumB + 0.5); // Add a burst
        }

        const idx = (j * size + i) * 4;
        data[idx + 0] = Math.floor(momentumA * 255); // Red channel for Team A
        data[idx + 1] = Math.floor(momentumB * 255); // Green channel for Team B
        data[idx + 2] = 0; // Blue (unused)
        data[idx + 3] = 255; // Alpha
      }
    }
    if (momentumTextureRef.current) {
        momentumTextureRef.current.needsUpdate = true;
    }
  }, [minute, scoreA, scoreB, lastGoalPlayer, teamAName, teamBName]);


  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha for transparent background if needed
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Initial momentum texture setup
    const textureSize = 64;
    momentumTextureRef.current = new THREE.DataTexture(
      momentumDataRef.current,
      textureSize,
      textureSize,
      THREE.RGBAFormat,
      THREE.UnsignedByteType
    );
    momentumTextureRef.current.needsUpdate = true;

    // Create a plane geometry representing the football field
    const fieldGeometry = new THREE.PlaneGeometry(30, 20, 128, 128); // Width, Height, SegmentsX, SegmentsY
    const fieldMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        momentumDataTexture: { value: momentumTextureRef.current },
        fieldWidth: { value: 30 },
        fieldHeight: { value: 20 },
      },
      wireframe: false, // Set to true for debugging mesh
    });
    const fieldMesh = new THREE.Mesh(fieldGeometry, fieldMaterial);
    fieldMesh.rotation.x = -Math.PI / 2; // Orient the plane horizontally
    scene.add(fieldMesh);

    camera.position.set(0, 25, 20); // Adjust camera position for a good view
    camera.lookAt(0, 0, 0);

    // Lighting (optional, but makes the surface more discernible)
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      if (fieldMaterial.uniforms) {
        fieldMaterial.uniforms.time.value += 0.01;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
      fieldGeometry.dispose();
      fieldMaterial.dispose();
      if (momentumTextureRef.current) {
        momentumTextureRef.current.dispose();
      }
    };
  }, [updateMomentumData]); // Re-run effect if updateMomentumData changes (unlikely for this simple version)


  // Simulate match progression
  useEffect(() => {
    const timer = setInterval(() => {
      setMinute((prevMinute) => {
        const newMinute = prevMinute + 1;
        if (newMinute <= 45) {
          setHalf("1ST HALF");
        } else if (newMinute > 45 && newMinute <= 90) {
          setHalf("2ND HALF");
        } else if (newMinute > 90 && newMinute <= 120) {
          setHalf("EXTRA TIME");
        } else {
          clearInterval(timer);
          setShowStats(true);
          // Simulate final stats
          setMatchStats({
            xG_A: 1.94, xG_B: 0.22,
            shots_A: 20, shots_B: 2,
            corners_A: 9, corners_B: 4,
            cards_A: 0, cards_B: 7,
          });
          return 120; // Full time
        }

        // Simulate a goal at 106 minutes
        if (newMinute === 106 && scoreA === 0) { // Check if goal hasn't been scored yet
          setScoreA(1);
          setLastGoalPlayer("F. Torres");
          setTimeout(() => setLastGoalPlayer(null), 3000); // Clear player name after a few seconds
        }

        return newMinute;
      });
    }, 200); // Update every 200ms to simulate fast-forwarded time (real game minute/sec)

    return () => clearInterval(timer);
  }, [scoreA]);

  // Update momentum texture based on simulated minute/score
  useEffect(() => {
    updateMomentumData();
  }, [minute, scoreA, scoreB, lastGoalPlayer, updateMomentumData]);


  return (
    <div className="relative w-full h-screen bg-neutral-900 overflow-hidden">
      {/* WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 text-white font-mono flex justify-between items-start">
        {/* Scoreboard */}
        <div className="flex items-center space-x-4 text-4xl">
          <div className="flex items-center">
            <span className="inline-block w-6 h-4 bg-orange-500 mr-2"></span>
            <span>{teamAName}</span>
            <motion.span
              key={scoreA} // Key for re-animating score change
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={UI_SPRING_CONFIG}
              className="ml-4 font-bold"
            >
              {scoreA}
            </motion.span>
          </div>
          <div className="text-gray-500">-</div>
          <div className="flex items-center">
            <motion.span
              key={scoreB} // Key for re-animating score change
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={UI_SPRING_CONFIG}
              className="mr-4 font-bold"
            >
              {scoreB}
            </motion.span>
            <span>{teamBName}</span>
            <span className="inline-block w-6 h-4 bg-blue-500 ml-2"></span>
          </div>
        </div>

        {/* Match Time & Half */}
        <div className="text-right text-xl">
          <motion.div
            key={minute}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {minute}'
          </motion.div>
          <motion.div
            key={half}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="text-sm text-gray-400"
          >
            {half}
          </motion.div>
        </div>
      </div>

      {/* Goal Scorer Notification */}
      <AnimatePresence>
        {lastGoalPlayer && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={UI_SPRING_CONFIG}
            className="absolute top-24 left-1/2 -translate-x-1/2 text-white text-lg font-bold bg-neutral-800 px-4 py-2 rounded-full z-20"
          >
            {lastGoalPlayer}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Momentum Graph (Simplified Placeholder) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-64px)] h-16 bg-gradient-to-r from-red-500/30 via-neutral-700 to-blue-500/30 rounded-lg opacity-50 z-10">
        {/* A simple bar to represent momentum over time, not interactive in this skeleton */}
        <div className="absolute left-0 top-1/2 w-full h-1 bg-white opacity-20 transform -translate-y-1/2" />
        <div
          className="absolute left-0 top-0 h-full w-1 bg-white transform -translate-x-1/2"
          style={{ left: `${(minute / 120) * 100}%` }}
        />
      </div>

      {/* Match Stats Overlay */}
      <AnimatePresence>
        {showStats && matchStats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={UI_SPRING_CONFIG}
            className="absolute inset-0 bg-neutral-900/90 flex items-center justify-center z-50 p-8"
          >
            <div className="bg-neutral-800 p-8 rounded-xl shadow-lg text-white font-mono space-y-4 max-w-md w-full">
              <h2 className="text-3xl font-bold text-center mb-6">FULL TIME</h2>
              <div className="grid grid-cols-3 items-center gap-y-4 text-lg">
                <span className="text-red-400 text-left">{matchStats.xG_A} xG</span>
                <span className="text-center">xG</span>
                <span className="text-blue-400 text-right">{matchStats.xG_B} xG</span>

                <span className="text-red-400 text-left">{matchStats.shots_A}</span>
                <span className="text-center">SHOTS</span>
                <span className="text-blue-400 text-right">{matchStats.shots_B}</span>

                <span className="text-red-400 text-left">{matchStats.corners_A}</span>
                <span className="text-center">CORNERS</span>
                <span className="text-blue-400 text-right">{matchStats.corners_B}</span>

                <span className="text-red-400 text-left">{matchStats.cards_A}</span>
                <span className="text-center">CARDS</span>
                <span className="text-blue-400 text-right">{matchStats.cards_B}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Example Usage (in App.tsx or similar):
// function App() {
//   return (
//     <div className="App">
//       <FootballMomentumVisualization />
//     </div>
//   );
// }
// export default App;

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