# 侧边栏顶部页面级 AI 问答 — 设计

## 背景

站内已有一个针对单个代码片段的 AI 问答功能：`CodeBlock` 工具栏上的「AI 🤖」按钮打开 `AiChatDialog`（从底部滑入的 80% 高度抽屉），基于「当前页面标题 + 大纲 + 这段代码」回答问题，并支持「发现问题」自动生成引导性提问标签。底层由 `src/utils/aiChat.ts`（DeepSeek，OpenAI 兼容 `/chat/completions`，流式）+ `src/config/ai.ts`（模型与 Key 配置）支撑。

现在需要在侧边栏顶部新增一个入口：点击后弹出一个**全屏**（而非 80%）的问答弹窗，问题边界收窄为「当前页面的知识内容」（标题 + 大纲），不针对某一段代码，其余交互（发现问题、输入框、流式回答、Markdown 渲染）与现有代码问答一致。

## 目标 / 非目标

- 目标：侧边栏品牌行新增 AI 入口；打开后是页面级问答，全屏展示；复用现有对话机制与视觉语言。
- 非目标：不引入新的后端/API；不做超出「标题+大纲」范围的更深内容抽取（已与用户确认只用标题+大纲，与代码问答的上下文抽取方式一致）；不改动 `CodeBlock` 现有的代码问答行为。

## 设计

### 1. `AiChatDialog` 改造为支持两种 scope

新增 prop：

```ts
scope?: 'snippet' | 'page'; // 默认 'snippet'，向后兼容现有 CodeBlock 用法
code?: string;   // scope='snippet' 时必填；scope='page' 时不传
language?: string; // 同上
```

- `scope='snippet'`（默认）：行为、样式与现状完全一致（80% 高度抽屉、系统提示词含代码小节、欢迎语/建议标签用现有文案）。`CodeBlock.tsx` 不需要任何改动。
- `scope='page'`：
  - 抽屉改为全屏：新增 `.fullscreen` 样式变体（`height: 100%`、`border-radius: 0`、去掉 `border-top`），沿用相同的 `translateY(100%) → 0` 滑入动画与时长/曲线。
  - systemPrompt 不再拼「相关代码」小节，只用 `collectPageContext()`（已存在，标题 + h2/h3 大纲，逻辑不变）。边界措辞加强，明确「只回答当前页面标题与大纲覆盖的知识范围；问题明显与本页无关时礼貌说明并引导用户提出与本页相关的问题」。
  - 欢迎语与默认建议标签换一套页面级文案（例如「针对《{title}》这篇文档，问我任何问题 👇」；建议标签如「这页讲了什么？」「举例说明本页的知识点」「这页最容易混淆/出错的地方？」）。「发现问题」逻辑不变，仍基于 systemPrompt 生成问题列表。

这是对现有组件的扩展改造，不是复制出一个新组件，避免两套几乎相同的抽屉/流式/中断/Markdown 渲染逻辑并存。

### 2. 切页自动关闭并清空对话

`AiChatDialog` 内部新增对 `useLocation().pathname` 的监听：当弹窗处于打开状态时，若 `pathname` 发生变化，则自动关闭弹窗并清空 `messages`/`chips`/`error` 等内部状态（等价于「重新打开一个新会话」）。

原因：该弹窗即将挂载在常驻的 `Sidebar` 组件里，路由切换不会让 `Sidebar`/弹窗重新 mount，若不主动处理，用户切到别的文档页后弹窗仍开着、还带着上一页的对话历史和上下文，会产生「答非所问」的体验（已与用户确认此为不期望行为，选择自动关闭而非重新绑定上下文）。

对 `scope='snippet'` 场景（挂在 `CodeBlock` 里）影响：`CodeBlock` 本身随所在文档页整体卸载/挂载，理论上路由变化时该 dialog 实例就已随父组件销毁，这个新逻辑对它是无操作的安全增强，不改变现状行为。

### 3. 侧边栏入口

`Sidebar`（`src/components/Sidebar/index.tsx`）在 `.brand` 行内、"Java Docs" 标题右侧新增一个 AI 按钮：

- 视觉复用 `CodeBlock.less` 里 `.aiBtn` 的强调色风格（`color-accent` 文字/边框 + `color-accent-soft` 背景，hover 反色）。
- 本地 state：`pageAiOpen`（初始 `false`）。点击按钮 `setPageAiOpen(true)`。
- 渲染：`<AiChatDialog open={pageAiOpen} onClose={() => setPageAiOpen(false)} scope="page" />`（不传 `code`/`language`）。
- 移动端：抽屉式侧边栏本身会被这个全屏问答盖住，不需要额外处理（弹窗用 `createPortal` 挂到 `document.body`，z-index 高于侧边栏抽屉）。

### 4. 流式生成时不打断用户手动滚动

现状问题：`AiChatDialog` 里有一个 `useEffect`，只要 `messages`/`loading` 变化（每收到一段流式增量都会变化）就无条件执行 `el.scrollTop = el.scrollHeight`。这会在 AI 还在生成答案时，持续把用户手动往上滚看历史的滚动条拽回底部，用户滚不动。

修复为聊天类应用的标准「跟随到底部」模式：

- 新增 `stickToBottomRef`（默认 `true`），并在消息容器（`scrollRef` 所在元素）上监听 `scroll` 事件：如果当前 `scrollTop` 与「底部」的距离超过一个阈值（如 48px），说明用户主动上滚，置 `stickToBottomRef.current = false`；如果又滚回阈值内，置回 `true`。
- 原来「新内容到达时滚动到底部」的效果，改为仅当 `stickToBottomRef.current === true` 时才执行 `el.scrollTop = el.scrollHeight`；否则跳过，尊重用户当前滚动位置。
- 用户主动发送新消息（调用 `send()`）时，视为明确意图，强制 `stickToBottomRef.current = true` 并立即滚到底部——这是唯一的强制滚动时机，其余情况都不打断用户滚动。
- 弹窗重新打开（`open` 由 false→true）时，重置 `stickToBottomRef.current = true`，保证每次新会话默认跟随到底部。

此修复对 `scope='snippet'` 和 `scope='page'` 两种场景都生效（同一份滚动逻辑），随第 1 点的改造一起在 `AiChatDialog/index.tsx` 里完成，不需要新增文件。

## 改动范围

- 修改：`src/components/AiChatDialog/index.tsx`、`src/components/AiChatDialog/index.less`、`src/components/Sidebar/index.tsx`、`src/components/Sidebar/index.less`
- 不改动：`src/utils/aiChat.ts`、`src/config/ai.ts`、`src/components/doc/CodeBlock.tsx`、`src/components/doc/CodeBlock.less`

## 风险 / 已知限制

- 「边界约束」是系统提示词层面的软约束（依赖模型遵循指令），不是硬性的技术过滤——与现有代码问答功能的约束方式一致，非本次新增风险。
- `src/config/ai.ts` 中的 API Key 是写死在前端产物里的（纯静态站点、无后端），这是既有风险，本次改动不放大也不缩小该风险（新增入口会增加调用频次，但额度控制仍靠现有的 Key 本身限额）。
