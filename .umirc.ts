import { defineConfig } from 'umi';
import { docRoutes, flattenDocRoutes, DEFAULT_DOC_PATH } from './src/routes/docRoutes';

/**
 * 文档相关的二级路由：由 docRoutes 树拍平而来，统一挂在 DocLayout 之下。
 * 单独用一个变量接收，方便后续与其它顶层路由组合。
 */
const docPageRoutes = [
  // 进入 /docs 根路径时，默认重定向到第一篇文档
  { path: '/docs', redirect: DEFAULT_DOC_PATH },
  ...flattenDocRoutes(docRoutes),
];

export default defineConfig({
  npmClient: 'pnpm',
  title: 'Learn Java · 文档',
  // 关闭 umi 内置的 mfsu 以外的复杂特性，保持框架清爽
  routes: [
    // 顶层：根路径重定向到默认文档
    { path: '/', redirect: DEFAULT_DOC_PATH },
    // 文档主框架：左侧侧边栏 + 右侧内容，所有文档页都是它的子路由
    {
      path: '/docs',
      component: '@/layouts/DocLayout',
      routes: docPageRoutes,
    },
    // 兜底 404
    { path: '/*', component: '@/pages/404' },
  ],
});
