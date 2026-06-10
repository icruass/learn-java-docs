/**
 * 文档路由节点类型。
 *
 * 这是整个站点的核心数据结构：一份树状数组，既用于 Umi 的路由配置，
 * 也用于左侧侧边栏的渲染。两者共用同一份数据源，保证「路由 = 侧边栏」永远一致。
 */
export interface DocRoute {
  /** 路由路径（建议以 /docs 开头，保持二级路由结构） */
  path: string;
  /** 侧边栏显示的标题 */
  name: string;
  /** 对应 src/pages 下的页面组件，分组节点（仅作为侧边栏标题）可不填 */
  component?: string;
  /** 侧边栏图标（可选，emoji 或字符即可，后续可替换为图标组件） */
  icon?: string;
  /** 子节点。该字段同时是 Umi 的嵌套路由字段，也是侧边栏的子菜单 */
  routes?: DocRoute[];
}
