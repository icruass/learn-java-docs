import { defineConfig } from "umi";
import { docRoutes, flattenDocRoutes } from "./src/routes/docRoutes";

/**
 * 文档相关的二级路由：由 docRoutes 树拍平而来，统一挂在 DocLayout 之下。
 * 单独用一个变量接收，方便后续与其它顶层路由组合。
 */
const docPageRoutes = [
  // 进入 / 根路径时，跳回「上次浏览」的页（无记录则默认第一篇）。
  // 用组件而非静态 redirect：目标要在运行时读 localStorage 才能确定。
  { path: "/", component: "@/pages/index" },
  ...flattenDocRoutes(docRoutes),
];

export default defineConfig({
  npmClient: "pnpm",
  title: "Learn Java · 文档",
  // 关闭 umi 内置的 mfsu 以外的复杂特性，保持框架清爽
  // 关键修改：设置静态资源的基础路径
  base: "/learn-java-docs/",
  publicPath: "/learn-java-docs/", // 告诉 Umi 所有 JS/CSS 都从这个路径加载
  routes: [
    { path: "/", component: "@/pages/index" },
    // 文档主框架：左侧侧边栏 + 右侧内容，所有文档页都是它的子路由
    {
      path: "/",
      component: "@/layouts/DocLayout",
      routes: docPageRoutes,
    },
    // 兜底 404
    { path: "/*", component: "@/pages/404" },
  ],
});
