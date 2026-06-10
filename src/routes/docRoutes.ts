import type { DocRoute } from './types';

/**
 * ============================================================================
 * 文档侧边栏 / 路由 树状数据（单一数据源）
 * ============================================================================
 * 这份数组是站点最重要的一块数据：
 *   1. 渲染左侧侧边栏（分组 + 菜单项）
 *   2. 经 `flattenDocRoutes` 转换后，作为 Umi 的二级路由挂在 DocLayout 下
 *
 * 约定：
 *   - 有 `component` 的节点 = 一个真实页面（侧边栏可点击的叶子项）
 *   - 没有 `component` 但有 `routes` 的节点 = 仅作为侧边栏分组标题（不产生路由）
 *
 * 先用几条测试数据把框架跑通，后续直接往这棵树里加节点即可。
 */
export const docRoutes: DocRoute[] = [
  {
    path: '/docs/basics',
    name: 'Java 基础',
    icon: '📦',
    routes: [
      {
        path: '/docs/basics/variables',
        name: '变量与数据类型',
        component: '@/pages/docs/basics/variables',
      },
      {
        path: '/docs/basics/operators',
        name: '运算符',
        component: '@/pages/docs/basics/operators',
      },
    ],
  },
  {
    path: '/docs/oop',
    name: '面向对象',
    icon: '🧩',
    routes: [
      {
        path: '/docs/oop/class',
        name: '类与对象',
        component: '@/pages/docs/oop/class',
      },
      {
        path: '/docs/oop/inheritance',
        name: '继承与多态',
        component: '@/pages/docs/oop/inheritance',
      },
    ],
  },
  {
    path: '/docs/mysql',
    name: 'MySQL',
    icon: '🐬',
    routes: [
      { path: '/docs/mysql/00', name: '教程总览', component: '@/pages/mysql/00-教程总览' },
      {
        path: '/docs/mysql/01',
        name: '数据库基本概念',
        routes: [
          { path: '/docs/mysql/01/01', name: '为什么需要数据库', component: '@/pages/mysql/01-数据库基本概念/01-为什么需要数据库' },
          { path: '/docs/mysql/01/02', name: 'DB、DBMS、SQL', component: '@/pages/mysql/01-数据库基本概念/02-DB-DBMS-SQL' },
          { path: '/docs/mysql/01/03', name: '数据库的层级模型', component: '@/pages/mysql/01-数据库基本概念/03-数据库的层级模型' },
          { path: '/docs/mysql/01/04', name: '关系型数据库 RDBMS', component: '@/pages/mysql/01-数据库基本概念/04-关系型数据库RDBMS' },
          { path: '/docs/mysql/01/05', name: '非关系型数据库 NoSQL', component: '@/pages/mysql/01-数据库基本概念/05-非关系型数据库NoSQL' },
          { path: '/docs/mysql/01/06', name: '关系型与非关系型对比', component: '@/pages/mysql/01-数据库基本概念/06-关系型与非关系型对比' },
          { path: '/docs/mysql/01/07', name: '常见关系型数据库软件', component: '@/pages/mysql/01-数据库基本概念/07-常见关系型数据库软件' },
          { path: '/docs/mysql/01/08', name: '常见 NoSQL：Redis 与 MongoDB', component: '@/pages/mysql/01-数据库基本概念/08-常见NoSQL-Redis与MongoDB' },
          { path: '/docs/mysql/01/09', name: 'MySQL 的历史与特点', component: '@/pages/mysql/01-数据库基本概念/09-MySQL的历史与特点' },
          { path: '/docs/mysql/01/10', name: '本章小结与面试问答', component: '@/pages/mysql/01-数据库基本概念/10-本章小结与面试问答' },
        ],
      },
      { path: '/docs/mysql/02', name: 'MySQL安装卸载与服务管理', component: '@/pages/mysql/02-MySQL安装卸载与服务管理' },
      { path: '/docs/mysql/03', name: 'SQL概述与通用语法', component: '@/pages/mysql/03-SQL概述与通用语法' },
      { path: '/docs/mysql/04', name: 'DDL-操作数据库', component: '@/pages/mysql/04-DDL-操作数据库' },
      { path: '/docs/mysql/05', name: 'DDL-操作表与图形化工具', component: '@/pages/mysql/05-DDL-操作表与图形化工具' },
      { path: '/docs/mysql/06', name: 'DML-数据增删改', component: '@/pages/mysql/06-DML-数据增删改' },
      { path: '/docs/mysql/07', name: 'DQL-基础查询与条件查询', component: '@/pages/mysql/07-DQL-基础查询与条件查询' },
      { path: '/docs/mysql/08', name: 'DQL-排序-聚合-分组-分页', component: '@/pages/mysql/08-DQL-排序-聚合-分组-分页' },
      { path: '/docs/mysql/09', name: '约束', component: '@/pages/mysql/09-约束' },
      { path: '/docs/mysql/10', name: '多表关系设计', component: '@/pages/mysql/10-多表关系设计' },
      { path: '/docs/mysql/11', name: '数据库三大范式', component: '@/pages/mysql/11-数据库三大范式' },
      { path: '/docs/mysql/12', name: '数据库备份与还原', component: '@/pages/mysql/12-数据库备份与还原' },
      { path: '/docs/mysql/13', name: '多表查询', component: '@/pages/mysql/13-多表查询' },
      { path: '/docs/mysql/14', name: '事务', component: '@/pages/mysql/14-事务' },
      { path: '/docs/mysql/15', name: 'DCL-用户与权限管理', component: '@/pages/mysql/15-DCL-用户与权限管理' },
      { path: '/docs/mysql/16', name: 'JDBC核心详解', component: '@/pages/mysql/16-JDBC核心详解' },
      { path: '/docs/mysql/17', name: 'JDBC事务管理', component: '@/pages/mysql/17-JDBC事务管理' },
      { path: '/docs/mysql/18', name: '数据库连接池', component: '@/pages/mysql/18-数据库连接池' },
      { path: '/docs/mysql/19', name: 'JDBCTemplate', component: '@/pages/mysql/19-JDBCTemplate' },
    ],
  },
];

/** 站点默认进入的文档页（首页重定向到此处） */
export const DEFAULT_DOC_PATH = '/docs/mysql/00';

/**
 * 将树状文档数据「拍平」为 Umi 可用的路由数组。
 * 只保留带有 component 的节点（真实页面）；分组节点本身不生成路由，
 * 但其子节点会被递归收集。
 *
 * 注意：此函数在 Node（.umirc.ts 构建期）和浏览器端都可安全运行（纯数据处理）。
 */
export function flattenDocRoutes(routes: DocRoute[]): DocRoute[] {
  const result: DocRoute[] = [];

  const walk = (nodes: DocRoute[]) => {
    nodes.forEach((node) => {
      if (node.component) {
        result.push({
          path: node.path,
          name: node.name,
          component: node.component,
        });
      }
      if (node.routes?.length) {
        walk(node.routes);
      }
    });
  };

  walk(routes);
  return result;
}
