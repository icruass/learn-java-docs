import type { DocRoute } from "./types";
import javaDocRoutes from "./java";
import mysqlDocRoutes from "./mysql";

export const docRoutes: DocRoute[] = [...javaDocRoutes, ...mysqlDocRoutes];

/** 站点默认进入的文档页：始终取菜单树里的「第一个可点击 item」，首页重定向到此处 */
export const DEFAULT_DOC_PATH = flattenDocRoutes(docRoutes)[0]?.path ?? "";

/**
 * 将树状文档数据「拍平」为 Umi 可用的路由数组。
 * 只保留带有 component 的节点（真实页面）；分组节点本身不生成路由，
 * 但其子节点会被递归收集。
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
