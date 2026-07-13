---
version: beta-v2
name: planet-selector-3d-distortion
name_zh: "3D 行星选择器与鼠标形变"
cover_video: "../assets/planet-selector-3d-distortion.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/planet-selector-3d-distortion.mp4"
tags: ["Hover", "Click", "Proximity"]
preview: { backgroundColor: "#000000", textColor: "#FFFFFF" }
description: >
  一个高度沉浸式的3D行星选择器。用户通过悬停左侧菜单切换行星，右侧3D行星模型随之平滑更新，并实时响应鼠标位置产生表面形变。点击确认后，一系列行星在空间中汇聚，最终聚焦至所选行星，并持续展示独特的形变互动效果。
  触发词：[3D行星, 鼠标形变, 流体切换, 群组汇聚]
website: "https://x.com/DesignedByPaul/status/2070593914076315877"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center center"
  stagger_delay: "40ms"

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"

  variants:
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" }
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.95, y: -10, filter: "blur(2px)" }
---

# 3D 行星选择器与鼠标形变 / Planet Selector with 3D Distortion Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

-   **Visual Physics Class**: Fluid-Elastic
-   **Core Experience**: 用户悬停在左侧行星名称时，右侧3D行星模型平滑切换，其表面会实时响应鼠标位置产生流体般的形变。点击选定行星后，左侧菜单淡出，多个行星从屏幕外围汇聚形成一个环绕动画，随后快速聚焦并放大至所选行星，并持续展示独特的鼠标驱动形变互动效果。
-   **Interaction Flow**:
    -   **Hover (List Item)**: 左侧行星名称旁的小圆点放大并高亮，文本颜色改变。
    -   **Hover (3D Planet)**: 右侧3D行星模型无缝切换纹理和颜色，并伴随细微的自转。
    -   **Proximity (Cursor over 3D Planet)**: 鼠标在3D行星模型上方移动时，行星表面材质会根据鼠标的相对位置实时产生局部形变效果。
    -   **Click (Select Planet)**:
        1.  左侧行星名称列表快速淡出并向上微移。
        2.  多个3D行星（包括行星环）从屏幕边缘以错开的时间和略微的弹性动效出现，围绕中心旋转。
        3.  被选中的行星从环绕队列中分离，快速放大并移动至屏幕中心，带有明显的弹性回弹效果。
        4.  其他未被选中的行星同时淡出并移出视图。
        5.  居中的行星保持自转和鼠标形变互动。

## 2. Component DOM Mapping (元素与动效节点映射)

_Vision-Agent: Map the visual elements in the video to a virtual DOM structure before defining motion._

-   **`div` - App Container**: 整体应用容器。
    -   **`div` - Planet Selector Wrapper (Left)**
        -   **`ul` - Planet List**: 承载行星名称列表。
            -   **`li` - Planet Item**: 单个行星选择项。
                -   `span` - Selection Dot: 行星名称旁的指示点。
                -   `span` - Planet Name Text: 行星名称文本。
    -   **`canvas` - 3D Planet Scene (Right)**
        -   *_WebGL/Three.js Rendered Elements_*:
            -   **`mesh` - Current Active Planet**: 负责显示当前选中的或悬停的行星模型、纹理、自转和形变效果。
            -   **`mesh` - Multiple Planets Array**: 临时出现的行星群组，用于点击后的过渡动画。

## 3. Detailed Timeline Sequence (时序编排)

_Vision-Agent: Define the exact motion sequence in milliseconds based on video analysis._

-   **[0ms - 250ms] Hover/Selection Phase**:
    -   `li` (Selection Dot): `scale`从`0`到`1`，`opacity`从`0`到`1`，使用`PRESET_SPRING_SMOOTH`。
    -   `li` (Planet Name Text): `color`从默认色到高亮色，`duration: 150ms`, `ease: linear`.
    -   `mesh` (Active Planet): 材质/纹理渐变切换到新选行星，同时发生轻微的`rotation`变化，`duration: 200ms`, `PRESET_SPRING_SMOOTH`.
    -   **Real-time Interaction**: 鼠标`x, y`坐标作为参数驱动 `shader`，实时在`mesh` (Active Planet)表面产生形变效果。

-   **[250ms - 500ms] Click (Initial Transition) Phase**:
    -   `ul` (Planet List): `opacity`从`1`到`0`，`translateY`从`0`到`-15px`，`duration: 250ms`, `cubic-bezier(0.16, 1, 0.3, 1)`.
    -   `mesh` (Multiple Planets Array): 以`stagger_delay: 40ms`错开出现，`opacity`从`0`到`1`，`scale`从`0.8`到`1`，并开始围绕中心点旋转，`duration: 350ms`, `PRESET_SPRING_SMOOTH`.

-   **[500ms - 850ms] Click (Zoom & Focus) Phase**:
    -   `mesh` (Selected Planet): 从其在数组中的位置快速`scale`到全屏大小（例如`scale 1 -> 5`），并移动到屏幕中心，带有显著的弹性回弹，使用`PRESET_SPRING_STIFF` (stiffness: 400, damping: 15, mass: 1)。
    -   `mesh` (Other Planets in Array): `opacity`从`1`到`0`，`scale`从`1`到`0.5`，快速移出视线，`duration: 200ms`, `PRESET_EASE_OUT_EXPO`.
    -   **持续交互**: 居中显示的行星继续其自转和鼠标驱动的形变效果。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1.  **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2.  **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3.  **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4.  **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.
> 5.  **3D Rendering**: 由于这是一个复杂的3D交互，实际的行星模型、纹理切换、自转和鼠标形变效果将需要借助 WebGL 库（如 Three.js 或 Babylon.js）来实现，并通过 `canvas` 元素进行渲染。Framer Motion 将主要用于协调 UI 元素的出现/消失以及3D场景的整体缩放/过渡，但**不直接处理3D模型内部的物理动画和着色器效果**。

## 5. Generated Code Skeleton (示例代码)

_Vision-Agent: Generate a complete, working component code block based on your analysis of the tech stack in package.json (or default to the React block below)._

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not accessible.
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three"; // Placeholder for 3D library
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Example for controls

// Insert custom physics from motion_tokens
const physicsConfig = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Placeholder for a custom shader material that would handle distortion
const PlanetShaderMaterial = (planetTexture: THREE.Texture) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      u_texture: { value: planetTexture },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) }, // Normalized mouse coords
      u_time: { value: 0 },
      // Add other uniforms for distortion parameters
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D u_texture;
      uniform vec2 u_mouse;
      uniform float u_time;
      varying vec2 vUv;

      void main() {
        // Simple distortion example based on mouse position
        vec2 distortedUv = vUv;
        float dist = distance(vUv, u_mouse);
        dist = smoothstep(0.0, 0.5, dist); // Blur edge
        dist = sin(dist * 3.14159 * 2.0 - u_time * 0.5) * 0.05 * (1.0 - dist); // Wave effect
        distortedUv.x += dist;
        distortedUv.y += dist;

        vec4 color = texture2D(u_texture, distortedUv);
        gl_FragColor = color;
      }
    `,
  });
};

// --- Mock 3D Planet Component ---
const Planet3D: React.FC<{
  textureUrl: string;
  isZoomed: boolean;
  onMouseMove: (event: MouseEvent) => void;
  initialScale?: number;
  position?: [number, number, number];
}> = ({ textureUrl, isZoomed, onMouseMove, initialScale = 1, position = [0, 0, 0] }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const planetMeshRef = useRef<THREE.Mesh>();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    camera.position.z = 2;

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureUrl, (texture) => {
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const material = PlanetShaderMaterial(texture); // Use custom shader for distortion
      const sphere = new THREE.Mesh(geometry, material);
      sphere.scale.set(initialScale, initialScale, initialScale);
      sphere.position.set(position[0], position[1], position[2]);
      scene.add(sphere);
      planetMeshRef.current = sphere;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      if (planetMeshRef.current) {
        planetMeshRef.current.rotation.y += 0.002;
        // Update shader uniforms for distortion
        (planetMeshRef.current.material as THREE.ShaderMaterial).uniforms.u_mouse.value.copy(mouse.current);
        (planetMeshRef.current.material as THREE.ShaderMaterial).uniforms.u_time.value += 0.01;
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
    window.addEventListener('resize', handleResize);

    const handleCanvasMouseMove = (event: MouseEvent) => {
      if (currentMount) {
        const rect = currentMount.getBoundingClientRect();
        mouse.current.x = (event.clientX - rect.left) / rect.width;
        mouse.current.y = 1 - (event.clientY - rect.top) / rect.height; // Invert Y for WebGL
        onMouseMove(event); // Propagate for potential other uses
      }
    };
    currentMount.addEventListener('mousemove', handleCanvasMouseMove);


    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('mousemove', handleCanvasMouseMove);
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
      if (planetMeshRef.current) {
        planetMeshRef.current.geometry.dispose();
        (planetMeshRef.current.material as THREE.ShaderMaterial).dispose();
      }
    };
  }, [textureUrl, isZoomed, onMouseMove, initialScale, position]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};
// --- End Mock 3D Planet Component ---


const planetData = [
  { name: "Venus", texture: "https://docs.mapbox.com/mapbox-gl-js/assets/venus.png" },
  { name: "Earth", texture: "https://docs.mapbox.com/mapbox-gl-js/assets/earth.png" },
  { name: "Mars", texture: "https://docs.mapbox.com/mapbox-gl-js/assets/mars.png" },
  { name: "Jupiter", texture: "https://docs.mapbox.com/mapbox-gl-js/assets/jupiter.png" },
];

export const PlanetSelector: React.FC = () => {
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState(1); // Default to Earth
  const [hoveredPlanetIndex, setHoveredPlanetIndex] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handlePlanetClick = (index: number) => {
    setSelectedPlanetIndex(index);
    setIsConfirmed(true);
  };

  return (
    <div className="relative w-screen h-screen bg-black flex items-center justify-center font-sans text-white overflow-hidden">
      {/* Left Menu */}
      <AnimatePresence>
        {!isConfirmed && (
          <motion.ul
            key="planet-list"
            className="absolute left-1/4 top-1/2 -translate-y-1/2 z-10 space-y-4 text-xl"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, transition: { ...physicsConfig, duration: 0.25 } }}
          >
            {planetData.map((planet, index) => (
              <motion.li
                key={planet.name}
                className="flex items-center space-x-3 cursor-pointer"
                onMouseEnter={() => setHoveredPlanetIndex(index)}
                onMouseLeave={() => setHoveredPlanetIndex(selectedPlanetIndex)} // Revert to selected on leave
                onClick={() => handlePlanetClick(index)}
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-white transition-colors duration-150"
                  initial={{ scale: 0 }}
                  animate={hoveredPlanetIndex === index ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0.5 }}
                  transition={physicsConfig}
                />
                <motion.span
                  className="text-gray-400"
                  animate={hoveredPlanetIndex === index ? { color: "#FFF" } : { color: "#9CA3AF" }}
                  transition={{ duration: 0.15 }}
                >
                  {planet.name}
                </motion.span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Right 3D Planet Display */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[300px] h-[300px] z-0">
        <AnimatePresence>
          {!isConfirmed && (
            <motion.div
              key={`planet-display-${hoveredPlanetIndex}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={physicsConfig}
            >
              <Planet3D
                textureUrl={planetData[hoveredPlanetIndex].texture}
                isZoomed={false}
                onMouseMove={handleMouseMove}
              />
            </motion.div>
          )}

          {isConfirmed && (
            <motion.div
              key="confirmed-scene"
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...physicsConfig, delay: 0.3 }} // Delay after list exits
            >
              {/* This section would render the array of planets and then zoom to the selected one.
                  For simplicity, we'll directly render the selected planet zoomed in.
                  The full array animation would be more complex with individual 3D objects. */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1.5 }} // Simulating zoom
                transition={{ ...physicsConfig, stiffness: 400, damping: 15, mass: 1, delay: 0.5 }}
              >
                <Planet3D
                  textureUrl={planetData[selectedPlanetIndex].texture}
                  isZoomed={true}
                  onMouseMove={handleMouseMove}
                  initialScale={0.8} // Smaller initially if part of an array
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Note: The `Planet3D` component is a simplified illustration.
// A real-world implementation would involve more sophisticated 3D scene management,
// particularly for the multi-planet array and the detailed convergence animation.
// The `PlanetShaderMaterial` provides a basic example of how cursor distortion
// might be achieved using GLSL shaders.
```