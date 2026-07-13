---
version: beta-v2
name: x-notification-toasts-stack
name_zh: "X通知堆叠动效"
cover_video: "../assets/x-notification-toasts-stack.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/x-notification-toasts-stack.mp4"
tags: ["Elastic", "Transitions", "Microinteraction"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  这是一个模拟X（原Twitter）通知的堆叠动效。每个通知卡片从屏幕底部向上浮现，伴随着微小的弹性缩放和模糊渐变效果，形成一个整齐堆叠的通知流。其核心体感是流畅且带有轻微弹性，赋予通知生命力。
  触发词：[弹性浮现、堆叠通知、微动交互]
website: "https://x.com/benjitaylor/status/2069168413306667353"

motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH"
  transform_origin: "center bottom" # 通知从底部向上浮现，所以缩放原点更接近底部
  stagger_delay: "50ms" # 多个通知卡片依次出现的时间间隔

  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)" # 对应 easeOutExpo 曲线
  duration: "350ms" # 单个通知的入场动画时长

  variants:
    initial: { opacity: 0, scale: 0.95, y: 30, filter: "blur(8px)" } # 初始状态更模糊、更小、更低
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
    exit: { opacity: 0, scale: 0.9, y: -20, filter: "blur(4px)" } # 退出时向上消失，略微缩小并模糊
---

# X Notification Toasts Stack Specification & Implementation Protocol

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: Fluid-Elastic
- **Core Experience**: 通知卡片以流畅且带有弹性的方式从屏幕底部依次向上浮现，形成一个叠层效果。每个卡片在出现时伴随着从模糊到清晰、从小到大的过渡，营造出轻盈、现代且用户友好的体验。退出时，卡片则轻微向上移动并逐渐模糊消散。
- **Interaction Flow**: 当新通知触发时，单个通知卡片执行 `initial` 到 `animate` 的过渡。多个通知卡片按 `stagger_delay` 依次播放入场动画，形成动态堆叠。当通知需要清除时，卡片执行 `exit` 动画。

## 2. Component DOM Mapping (元素与动效节点映射)

- **[Parent Container]** (`div` - Notifications Stack Wrapper)
  - 负责容纳所有独立的通知卡片，并管理整体的堆叠布局。
- **[Child Node]** (`div` - Individual Toast Card)
  - 每一个独立的通知卡片。
  - 应用 `transform_origin: center bottom`，使其在 `y` 轴方向上有弹性效果。
  - 在 `initial` 状态下，`opacity: 0`, `scale: 0.95`, `y: 30`, `filter: "blur(8px)"`。
  - 在 `animate` 状态下，`opacity: 1`, `scale: 1`, `y: 0`, `filter: "blur(0px)"`。
  - 在 `exit` 状态下，`opacity: 0`, `scale: 0.9`, `y: -20`, `filter: "blur(4px)"`。
  - 动画通过 `PRESET_SPRING_SMOOTH` 的物理参数实现。

## 3. Detailed Timeline Sequence (时序编排)

- **[0ms - 50ms] Stagger Delay**:
  - 每隔 `50ms`，下一个通知卡片开始其入场动画。
- **[0ms - 350ms] Entrance Phase (Per Toast Card)**:
  - **Opacity**: 从 `0` 渐变到 `1`。
  - **Scale**: 从 `0.95` 弹性地缩放到 `1`。
  - **TranslateY**: 从 `30px` 弹性地移动到 `0px`。
  - **Filter**: 从 `blur(8px)` 渐变到 `blur(0px)`。
  - 所有这些属性同时通过 `PRESET_SPRING_SMOOTH` 物理配置进行动画。
- **[Exit Phase] Dismiss Sequence (Per Toast Card)**:
  - **Opacity**: 从 `1` 渐变到 `0`。
  - **Scale**: 从 `1` 弹性地缩放到 `0.9`。
  - **TranslateY**: 从 `0px` 弹性地移动到 `-20px`。
  - **Filter**: 从 `blur(0px)` 渐变到 `blur(4px)`。
  - 退出动画使用相同的 `PRESET_SPRING_SMOOTH` 物理配置，或者可以根据需求调整为更快速的 `ease-out`。

## 4. Implementation Directives for Code-Agent (核心指令)

> **⚠️ CRITICAL IMPLEMENTATION RULES (NO-NEGOTIABLE):**
>
> 1. **Framework Auto-Detection (Priority 0)**: You MUST inspect `package.json` in the root folder to detect the framework (React/Next.js/Svelte/Vue) and styling system (Tailwind v3/v4, CSS Modules) currently in use. Adapt your output code to the exact versions found. If package.json is missing or not accessible, default to **React + Tailwind CSS + Framer Motion** and explicitly state this assumption in the first line of your code output.
> 2. **Performance Guard**: ONLY animate GPU-accelerated properties (`transform`, `opacity`, `filter`). Do NOT transition properties that cause Reflow (e.g., `width`, `height`, `top`, `left`, `margin`).
> 3. **Exit Animation Safeguard**: If using React, ensure components use `<AnimatePresence>` (or equivalent framework lifecycle hooks) so exit animations play fully before unmounting. Do not let elements disappear instantly.
> 4. **Clipping & Shadow Prevention**: Ensure container divs have proper padding or avoid `overflow: hidden` if the floating card shadow gets clipped during scaling.

## 5. Generated Code Skeleton (示例代码)

```tsx
// Defaulting to React + Tailwind CSS + Framer Motion as package.json is not accessible.
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Insert custom physics from motion_tokens
const springPhysics = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

// Variants for individual toast cards
const toastVariants = {
  initial: { opacity: 0, scale: 0.95, y: 30, filter: "blur(8px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.9, y: -20, filter: "blur(4px)" },
};

interface ToastProps {
  id: string;
  message: string;
  avatar: string;
  username: string;
  staggerDelay?: number;
}

const ToastCard: React.FC<ToastProps> = ({ id, message, avatar, username, staggerDelay = 0 }) => {
  return (
    <motion.div
      key={id} // Key is important for AnimatePresence to track
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        ...springPhysics,
        delay: staggerDelay, // Apply stagger delay here
        duration: 0.35, // Base duration for CSS fallback
      }}
      style={{ transformOrigin: "center bottom" }}
      className="absolute bottom-4 right-4 z-50 flex items-center p-3 w-72 h-fit bg-neutral-900/90 backdrop-blur-lg rounded-xl shadow-lg border border-white/10"
    >
      <img src={avatar} alt={username} className="w-8 h-8 rounded-full mr-3" />
      <div className="flex flex-col text-sm">
        <span className="font-semibold text-white">@{username}</span>
        <span className="text-neutral-400">{message}</span>
      </div>
    </motion.div>
  );
};

export const XNotificationToastsStack = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [toastIdCounter, setToastIdCounter] = useState(0);

  const addToast = (
    message: string,
    username: string,
    avatar: string
  ) => {
    setToastIdCounter((prev) => prev + 1);
    const newToast: ToastProps = {
      id: `toast-${toastIdCounter}`,
      message,
      username,
      avatar,
    };

    // To simulate stacking, we might need to manage positions or use a different stacking method.
    // For this example, let's just add new toasts and let Framer Motion handle presence.
    setToasts((prev) => [newToast, ...prev].slice(0, 3)); // Keep only the latest 3 toasts
  };

  React.useEffect(() => {
    // Simulate incoming notifications
    const avatars = [
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/51.jpg",
    ];
    const messages = [
      "sent you a message",
      "reposted your post",
      "liked your post",
      "just followed you",
    ];
    const usernames = [
      "alexabraham",
      "nikitabier",
      "benjitaylor",
      "nicoduc",
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < 6) { // Simulate 6 notifications
        const randomUser = usernames[Math.floor(Math.random() * usernames.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        addToast(randomMessage, randomUser, randomAvatar);
        count++;
      } else {
        clearInterval(interval);
      }
    }, 1500); // New toast every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* We need to arrange toasts vertically. This usually requires calculating Y positions dynamically */}
      {/* For a simple stack from bottom-up, let's try mapping with dynamic positioning. */}
      {/* Or, a simpler approach for a fixed stack: have an array of toast data and render them. */}
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              ...springPhysics,
              delay: index * 0.05, // Stagger delay based on position in stack
              duration: 0.35,
            }}
            style={{ transformOrigin: "center bottom", bottom: `${4 + index * 70}px`, right: "16px" }} // Position each toast
            className="absolute z-50 flex items-center p-3 w-72 h-fit bg-neutral-900/90 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 pointer-events-auto"
          >
            <img src={toast.avatar} alt={toast.username} className="w-8 h-8 rounded-full mr-3" />
            <div className="flex flex-col text-sm">
              <span className="font-semibold text-white">@{toast.username}</span>
              <span className="text-neutral-400">{toast.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Example usage of XNotificationToastsStack:
// <XNotificationToastsStack />
```

## 🛑 AI Anti-Patterns & Blocklist (AI 避坑防偏与硬性禁忌)

> **⚠️ [SYSTEM RULE]** As a Senior Motion Developer, you must strictly AVOID the following anti-patterns. Violating any of these rules will result in layout shift and rendering stutter.

### 1. The "Sticky Animation" Trap (时长失控)
- ❌ **DON'T**: Do NOT write transitions or spring animations with a duration exceeding `400ms` unless specifically requested. It makes the UI feel laggy and sticky.
- **DO**: Default to snappy durations (`150ms - 300ms`). High-frequency micro-interactions (like buttons/taps) must be under `150ms`.

### 2. The "Layout Thrashing" Catastrophe (严禁非 GPU 加速属性)
- ❌ **DON'T**: NEVER use `transition: all`. Never animate layout-shifting properties: `width`, `height`, `top`, `left`, `margin`, `padding`, or `border-width`.
- **DO**: Only animate `transform` (scale, translate, rotate) and `opacity`. If you need to animate border changes, use `box-shadow: inset` or a pseudo-element (`::after`) with opacity scale.

### 3. Dark Mode Shadow Pollution (暗黑模式脏阴影)
- ❌ **DON'T**: Do NOT apply standard dark shadows (`rgba(0,0,0,0.5)`) on dark-themed components—they become invisible or look muddy. NEVER use bright white shadows.
- **DO**: In dark mode, replace floating shadows with a subtle semi-transparent border (e.g., `border: 1px solid rgba(255, 255, 255, 0.08)`) and a slight background highlight (elevation tint). (Note: The provided video uses a dark background with white/light text and a subtle border, not a strong shadow, which aligns with this DO rule.)

### 4. Instantly Vanishing Exit (销毁无动画)
- ❌ **DON'T**: Do NOT let elements disappear instantly from the DOM when they are closed or unmounted.
- **DO**: You must wrap conditional rendering with `<AnimatePresence>` (Framer Motion) or leverage CSS transition-end event listeners to ensure the `exit` state plays out fully before node destruction.