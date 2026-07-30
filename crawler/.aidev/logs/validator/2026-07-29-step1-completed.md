# 2026-07-29 开发日志 — Step 1 (半自动化基建) 归档

### 🎯 目标 (Objective)

完成自动化验证流水线 Step 1（代码生成 + 无头录屏）的闭环，并根治录屏黑屏/空白问题，使其产物可被 Step 2 的 AI 裁判消费。

### 🔗 上下文 (Context)

- **相关规划**: `.aidev/plans.md/auto_test.md`
- **相关规则**: `.aidev/SYSTEM_RULES.md`（归档指令）
- **前置日志**: `.aidev/2024-08-01-workflow-setup.md`（AI 工作流基础设施搭建）
- **关键代码**: `crawler/validator_step1.js`（独立 Step 1 脚本）、`crawler/validator.js`（Step 2 AI 裁判）、`crawler/analyzer.js`，

---

### 📝 关键交互与发现 (Interaction Log)

- **目录结构不一致 → 统一为扁平命名**：原 `auto_test.md` 与 `analyzer.js` 默认把产物放进 `validation_output/<component>/` 子目录，与实际 `validator.js` 的扁平约定（`*_test.html` / `*_generated.webm` 等）冲突。已统一为「扁平 + 组件名 (kebab-case)」并修正 `analyzer.js` 的 `TARGET_SKILLS_DIR` 默认值到本机路径。
- **Framer Motion CDN / 全局变量错误**：正确 UMD 为 `unpkg.com/framer-motion@11/dist/framer-motion.js`，全局变量是 `window.Motion`（非 `window.FramerMotion`，且无 `.umd.js` 文件）。早期修复曾因 `validator.js` 在 step2 提交中被重写为 Step2-only 而丢失，后从 `9b55d3d` 恢复时一并带回。
- **Step 1 代码在 step2 提交中被删除**：git HEAD `1bef566` 将 `validator.js` 重写为只剩 Step 2，删除了 `recordComponentVideo` / `chromium.launch`。已新建独立 `crawler/validator_step1.js`，以 `9b55d3d` 的 Step 1 为底本恢复并修复，支持 `node validator_step1.js <component>`。
- **录屏空白（根因 1 — scroll-driven）**：`bento-button-stagger-hover` 用 `useScroll` 绑定 `h-[300vh]`，旧录制器只做鼠标交互从不滚动，只录到静止首帧。修复：生成 Prompt 新增「自动演示模式」（`window.__AUTO_DEMO__`），录制器注入该标志并兜底执行滚动。
- **录屏黑屏（根因 2 — 单向滚动 + 全程录制）**：自动演示单向 0→1 滚动到末尾时 item 透明度降为 0.2 并转出屏幕，画面全黑；`page.video()` 又录下创建到关闭全程（~30s，有效运动仅几秒）。**彻底改造录制器**：
  1. 弃用 `page.video()`，改为「主动驱动动画 + 逐帧截图 + ffmpeg 合成 webm」；
  2. 等待策略改为 `domcontentloaded` + 轮询 `#root` 有子元素，不再等 networkidle 拖时长；
  3. 可滚动页面执行 **0→1→0 正弦往返滚动**（不停在末尾暗淡态），非滚动页面执行悬停/点击/拖拽兜底序列；
  4. 固定 6.5s / 10fps，产出严格 6.5s 的 `<component>_generated.webm`；
  5. 录制后用 ffmpeg 抽帧做亮度与 md5 差异校验：平均亮度 < 5 或不同帧数 ≤ 1 直接报错，杜绝「黑屏/空白」伪通过。
- **环境阻塞（非脚本缺陷）**：本沙箱 `HTTP_PROXY` 对 Gemini 接口返回 502、直连超时，导致 Step 1 的 AI 生成与 Step 2 的 AI 裁判端到端无法在此环境跑通。需在可访问 Gemini 的网络环境下运行。

### ✅ 产出 (Outcome)

- **状态**: Step 1（半自动化基建：代码生成 + 无头录屏 + 渲染/运动校验）已完成并归档。
- **产物**: `crawler/validator_step1.js` 可独立运行；`auto_test.md` 已标记 Step 1 / Step 2 为 `[已完成]`，并补充扁平目录约定、临时 Hack 备注与 Step 4 端到端规划。
- **遗留 TEMPORARY（待 Step 4 清理）**:
  - `validation_output/bento-button-stagger-hover.mp4` 临时参考视频；
  - `validator.js` 的 `findTempReferenceFallback()` 回退逻辑；
  - `validator_step1.js` 取 `references/` 首个 `.md` 的临时 hack（正确逻辑见 Step 4）。
- **下一步**:
  - 在可联网 Gemini 的环境跑通 `node validator_step1.js <component>` → `node validator.js` 的 AI 裁判闭环；
  - 推进 Step 3（自迭代 Self-Healing）与 Step 4（正确端到端串联：新增 references → Step 1 → 与 `output/item_<n>/raw_video.mp4` 按 `resolved_name.txt` 映射比较）。


## step2 现在代码开发完成
终端测试结果：
```
node validator.js
🔍 AI 裁判已就位，扫描到 1 个待评估产物...
 
⚖️  [AI 裁判] 开始评估组件: bento-button-stagger-hover...
❌ [拦截] 分数: 70/80 | bento-button-stagger-hover 未达标!
   🚨 核心缺陷:
      1. Implement dynamic `scale` transformation for carousel items: Items must scale up to `1.0` when approaching the viewport center and scale down when moving away, as explicitly described in the 'Core Experience' and 'Detailed Timeline Sequence' (e.g., 'Card 02 moves in (Rotate to center, Scale up to 1.0)').
      2. Implement dynamic `opacity` transformation for carousel items: Items must fade in to full opacity when approaching the viewport center and fade out when moving away, as specified in the 'Core Experience' and 'Detailed Timeline Sequence' (e.g., 'Card 01 moves out (Rotate left, Fade)'). This applies to the large numbers, buttons, and descriptions.
      3. Ensure text content (button and description) dynamically appears/fades in conjunction with the item's central position, as implied by '文本内容显现' (text content appears) for items moving into focus.
   💾 完整案发现场已保存至: /Users/mac/Documents/code/vibe-motion/crawler/validation_output/bento-button-stagger-hover_validation_report.json (为 Step 3 自愈系统铺路)
 
🏁 自动化验证测试环节执行完毕！
```
