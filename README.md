# Learn Java Docs

基于 **Umi 4 + React 18 + TypeScript** 的文档知识网站。左侧侧边栏 + 右侧内容，支持暗色/亮色主题。

## 启动

```bash
pnpm install     # 安装依赖（postinstall 会自动 umi setup）
pnpm dev         # 启动开发服务器，默认 http://localhost:8001
pnpm build       # 生产构建
pnpm tsc         # 类型检查
```

## 核心架构

### 1. 路由 = 侧边栏（单一数据源）

`src/routes/docRoutes.ts` 导出的 **树状数组 `docRoutes`** 是站点最重要的数据：

- 直接用于渲染左侧侧边栏（`src/components/Sidebar`）
- 经 `flattenDocRoutes()` 拍平后，作为 **二级路由** 挂在 `DocLayout` 之下（见 `.umirc.ts`）

节点约定：

- 有 `component` → 真实页面（侧边栏可点击叶子项）
- 仅有 `routes` → 侧边栏分组标题（不产生路由）

> 文档路由单独用 `docPageRoutes` 变量接收后再并入主路由，方便后续扩展其它顶层路由。新增文档只需往 `docRoutes` 加节点 + 在 `src/pages` 建对应组件。

### 2. 目录结构

```
src/
├── routes/        路由 + 侧边栏的树状数据源（docRoutes）
├── layouts/       DocLayout：侧边栏 + <Outlet/> 内容区
├── components/
│   ├── Sidebar/        左侧导航（参考 reactbits 风格）
│   ├── ThemeProvider/  主题 Context
│   ├── ThemeToggle/    主题切换按钮
│   └── doc/            文档排版组件（见下）
├── hooks/         useTheme
├── utils/         通用工具（cx 等）
├── pages/         路由匹配的页面组件
├── styles/        主题设计令牌（CSS 变量）
├── global.less    全局样式 + 重置
└── app.tsx        运行时配置（rootContainer 挂载 ThemeProvider）
```

### 3. 主题（暗色 / 亮色）

所有颜色都来自 `src/styles/theme.less` 的 **CSS 变量**，通过 `<html data-theme="dark|light">` 切换。
组件取色一律用 `var(--color-*)`，因此天生适配双主题。状态由 `useTheme()` 读写并持久化到 localStorage。

### 4. 文档排版组件（`@/components/doc`）

| 组件 | 用途 |
| --- | --- |
| `Text` | 通用文本，支持 `color`/`accent`/`bold`/`italic`/`underline`/`size`(相对字号) |
| `Title` / `Subtitle` / `Heading3` | 一/二/三级标题 |
| `Paragraph` / `Secondary` | 主要内容文本 / 次要内容文本 |
| `InlineCode` | 行内代码 |
| `Tag` | 着重点标签，`variant`: soft / solid / outline |
| `CodeBlock` | 代码块，随主题切换高亮配色，支持高度滚动、全屏、一键复制 |

`src/pages/docs/intro.tsx` 是这些组件的完整示例页。
