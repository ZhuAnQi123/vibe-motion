# 🌟 AI 动效过滤与生成规范 (SYSTEM DIRECTIVE)

> ⚠️ **输出格式严格准则**：
> 1. 必须从第一行的三个减号 `---` 开始输出，`---` 前后必须各保留一个标准换行，严禁将 YAML 属性挤在同一行。
> 2. 控制全局描述精炼度，严禁在文字描述部分长篇大论，避免触及 Token 上限导致输出截断。

> **⚠️ [REJECTION RULES / 拒绝跳过准则]** 
> 作为一个专门服务于 "Web 界面 UI/UX 动效" 的 Agent，你的目标是生成可由标准 Web 技术（DOM, CSS, 基础 2D Canvas）高品质还原的代码。
> 
> **当你分析视频时，如果发现包含以下任意特征，必须将 YAML 字段 `shouldSkip` 设为 `true`，并说明 `skipReason`：**
> 1. **3D 渲染与模型**：包含具象的 3D 人物/物体、Blender/C4D/Spline 导出的三维模型渲染、涉及三维空间深度或网格变形。
> 2. **Three.js 粒子阵列与流体**：包含复杂的 3D 粒子流、流体动力学解算、烟雾/火焰粒子等。
> 3. **复杂几何体 Shader 变形**：依赖复杂顶点着色器（Vertex Shader）实现的数学噪声网格弯曲或扭曲。
> 4. **纯 CG 动画**：与 UI 交互组件（按钮、卡片、导航、模态框、悬停反馈等）完全无关的 CG 片头或影视特效。

---
version: v4-declarative-spec
name: interaction-name-analysis
name_zh: "动效中文名称"
cover_video: "../assets/replace-with-name.mp4"
cdn_video_url: "https://pub-78bb53484bcd4179b692b8ebeee0e014.r2.dev/replace-with-name.mp4"
tags: ["Hover", "Button"]
preview: { backgroundColor: "#171717", textColor: "#FFFFFF" }
description: >
  详细描述该交互的“核心物理体感与图形反馈”。
  ⚠️ 严禁出现具体业务/品牌名称，必须解耦为通用的 UI 交互描述。
  触发词：[填入通用触发词，如 按钮拉伸、卡片展开、阻尼回弹、吸附效果]
website: "Original design URL (Optional)"

# ==========================================
# 🛑 ENGINE ROUTING
# ==========================================
# 可选值:
# - DOM_CSS: 基础 2D UI 交互 (按钮悬停、卡片展开、平移、缩放、透明度)
# - DOM_3D: 轻量 CSS 3D 变换 (rotateY/rotateX，涉及 perspective 和 preserve-3d)
# - CANVAS_2D: 像素级采样、基础 2D 粒子微动、2D 物理碰撞
rendering_engine: "DOM_CSS"

# ==========================================
# 📐 INTERACTION ALGORITHM & COLLIDER SPEC (交互与碰撞算法声明)
# ==========================================
# 用于指导下游跨框架 Code Agent 的精确数学实现
interaction_spec:
  hit_detection:
    type: "BOUNDING_BOX_OVERLAP" # 可选: BOUNDING_BOX_OVERLAP (矩形包围盒重叠) | RADIUS_DISTANCE (圆心距离磁吸) | NONE
    threshold: 0.5 # 如果是 OVERLAP，指拖拽物自身面积的重叠比例；如果是 DISTANCE，指相对目标宽度的距离比例
  drag_constraints:
    bounded: true # 是否开启边界碰撞保护，防止飞出视口
    elasticity: 0.2
  boundary_containment: "VIEWPORT" # VIEWPORT | CONTAINER | UNBOUNDED

# ==========================================
# 🛡️ ASSET & STATE MAPPING CONTRACT
# ==========================================
assets:
  required: true
  items:
    - name: "Primary Drag Asset"
      type: "SVG / Component"
      description: "主拖拽/交互元素资产"
    - name: "Secondary State Asset"
      type: "SVG / Component"
      description: "形态突变/拖拽中资产 (例如: 纸团/小球)"

> **⚠️ Hitbox (碰撞盒) 声明原则**：
> 明确区分“视觉容器 (Visual Box)”与“有效碰撞区 (Hitbox)”。如果 Target 资产带有较大的透明留白或 Padding，必须在逻辑描述中提示 Code Agent 缩减检测范围或指定内部 Ref 节点来缩小真实判定区域，防止“空气墙”阻挡或误触判定失败。

# ==========================================
# ⚙️ MOTION TOKENS (物理与时序参数)
# ==========================================
motion_tokens:
  selected_preset: "PRESET_SPRING_SMOOTH" # 选项: PRESET_SPRING_BOUNCE | PRESET_SPRING_SMOOTH | PRESET_SPRING_STIFF | PRESET_EASE_OUT_EXPO
  transform_origin: "center center"
  
  active_physics:
    stiffness: 200
    damping: 25
    mass: 1
  css_fallback_easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  duration: "350ms"
---

# [动效中文名称 / English Name] Specification & Implementation Protocol

## 0. Prerequisite & Guardrail (防降级校验)

> **⚠️ 跨框架与通用编码原则：**
> 1. **单体原子化原则**：导出的代码必须是高度解耦的 UI 组件，业务属性通过框架参数（Props/Attributes）暴露。
> 2. **框架无关性与严密算法**：逻辑必须抽象为通用的 DOM API 与状态计算，严禁依赖特定框架专属的非标准语法。

## 1. Interaction & Feel Vibe (动效体感)

- **Visual Physics Class**: [Fluid-Elastic / Snappy-Mechanical / Linear-Smooth]
- **Core Experience**: [抽象描述物理反馈，如“拖拽抛掷时元素形态突变并带有惯性，未命中撞击边缘产生自然阻尼反弹。”]
- **Interaction Flow**: [Idle -> Drag (Asset Morph) -> Release (Collider Check) -> Hit/Miss Secondary Animation]

## 2. Component DOM Structure (组件 DOM 逻辑结构)

- **[Stage Container]** (`div` - 外层视口与拖拽限定约束区域)
- **[Interactive Node]** (主交互与承载物理特性的 DOM 节点)
- **[Target Container]** (作为碰撞目标的响应节点，如垃圾桶/接收区)

## 3. Finite State Machine (FSM) & Technical Directives

> **⚠️ [CRITICAL RULE FOR VISION AGENT]**
> 绝对禁止输出任何具体的 React/Vue/CSS 纯代码块！
> 你的职责是作为“系统分析师”，将视频拆解为结构化的**有限状态机 (FSM)** 与 **跨框架通用的技术算法**。

### 3.1 State Machine & Asset Transition Matrix (状态转换与资产矩阵)

必须梳理出交互过程中**所有涉及元素**在不同状态下的视觉姿态、资产形态及物理响应：

| 触发阶段 (State) | 触发条件 (Trigger Event) | 关联主资产 (Active Asset) | 坐标与位移姿态 (Transform / Pose) | 关联目标/环境响应 (Target Element) |
| :--- | :--- | :--- | :--- | :--- |
| **Idle** | 初始加载 / 重置完成 | Primary Asset (例: 📄 文件) | Scale: 1, Position: (0,0) | Target Static (例: 🗑️ 静态垃圾桶) |
| **Active Drag** | `onDragStart` / 拖拽激活 | **[形态切换]** Secondary Asset (例: ⚪️ 纸团) | 实时跟随 Pointer + 旋转 `rotate: f(velocity_x)` | Target Hover State (高亮/准备接收) |
| **Release: Hit** | `onDragEnd` && 碰撞判断为 True | Secondary Asset (⚪️) | 向 Target 中心线缩放 `scale: 0, opacity: 0` | Target 执行“吞咽/弹跳”二次动画 + Toast 提示 |
| **Release: Miss**| `onDragEnd` && 碰撞判断为 False | Secondary Asset (⚪️) -> 恢复 Primary Asset | 抛物线阻尼落地/反弹归位，衰减至 static | Target 保持 Static / 错误计数器 +1 |

---

### 3.2 Implementation Logic Blueprint (技术实现逻辑蓝图)

请为 Code Agent 编写逻辑清晰的**技术实现指导算法**，明确说明状态逻辑与碰撞机制：

#### 1. 核心状态逻辑 (Core State Drivers)
- **状态驱动变量**：声明实现该动效所需的最小状态集（如 `isDragging`, `currentMorphAsset`, `isHit`, `missCount`）。
- **资产条件渲染规则**：明确写出形态切换机制，如：`isDragging === true` 时强制替换主节点资产，拖拽结束归位后切回原资产。

#### 2. 碰撞检测算子规范 (Collider Algorithm)
- 必须基于视频特性指定最合理的碰撞算法：
  - **优先推荐 `RADIUS_DISTANCE` (圆心距离磁吸算法)**：对于投掷、投入类交互，必须计算 `Interactive Node` 中心点与 `Target Node` 中心点（或 Hitbox 中心点）的直线距离。当距离小于设定阈值（如 Target 宽度的 50%）时判定为命中。
  - **若使用 `BOUNDING_BOX_OVERLAP` (矩形交集)**：严禁计算 `交集面积 / Target总面积`！必须通过 `getBoundingClientRect()` 计算交集，并以 **`交集面积 / 拖拽主节点自身的面积`** 作为重叠率。当拖拽物自身面积超过设定阈值（如 50%）进入目标区域时，判定为命中。

#### 3. 物理边界与反弹轨道 (Boundary & Physics)
- 拖拽归位逻辑：拖拽释放未命中时，必须计算当前末速度向量（Velocity Vector），配合阻尼系数（Damping）实现缓动复位，严禁产生超越 viewport 的非法坐标。

---

## 🛑 Universal Code Agent Implementation Contract (下游跨框架代码 Agent 执行契约)

> **⚠️ [SYSTEM DIRECTIVE FOR CODE AGENT]** 
> 无论你使用 React、Vue、Svelte 还是 Vanilla Native JS，编写代码时必须严格遵守以下工程规范：

1. **绝对禁止单点/鼠标坐标碰撞判定 (No Pointer-Only Hit Detection)**：
   - ❌ **严禁**仅仅使用 `event.clientX/Y` 或 `pointer.x/y` (鼠标指针坐标) 作为碰撞依据！
   - ✅ **必须**使用矩形包围盒交集算法 (Bounding Box Overlap) 或 中心点距离算法 (Radius Distance)，判断元素实体与目标的重叠关系。

2. **统一世界坐标系计算 (Unified Coordinate System) [CRITICAL]**：
   - ✅ 在进行任何碰撞、距离或交集计算前，**必须**使用 `getBoundingClientRect()` 将参与计算的所有 DOM 节点的坐标统一映射到 Client Viewport (视口坐标系)。
   - ❌ **严禁**直接混合使用 `offsetLeft/Top` 与 CSS `transform` 位移值进行数学比较，以免因父级容器定位(relative/absolute)或层级嵌套导致坐标系错乱，引发“视觉对齐但代码判定失败”的 Bug。

3. **状态驱动形态突变 (State-Driven Asset Morphing)**：
   - ❌ **严禁**把形态突变（如文件变纸团）仅写在松手释放的回调函数中。
   - ✅ **必须**基于拖拽激活状态 (`isDragging`) 进行条件渲染/路径变形。拖拽开始即刻切换为拖拽形态，拖拽结束完全归位后恢复。

4. **视口边界防护 (Viewport Safety)**：
   - ✅ 必须设置最大偏移范围与边界阻尼限制，防止抛掷或反弹物理将 DOM 元素推到可视区域之外。

5. **无假动画与组件拆分 (No Fake Scale Down & Component Separation)**：
   - 必须把主交互物与配合的目标物（如垃圾桶、Toast）拆分为互相独立但由全局状态/事件驱动的 DOM 节点，严禁把所有东西塞进单个 div 内。

## 🛑 AI Anti-Patterns & Blocklist (AI 硬性禁忌)

* ❌ **DON'T (技术降级)**: 严禁将 Canvas 粒子/2D 碰撞降级为 CSS `filter: blur()` 进行假效果糊弄。
* ❌ **DON'T (业务硬编码)**: 严禁在代码中写死具体品牌名称，导出的必须是纯粹、解耦的 UI 组件。
* ❌ **DON'T (无透视 3D)**: 在 CSS 3D 旋转中，严禁漏掉 `perspective` 和 `transform-style: preserve-3d` 导致 3D 扁平化。