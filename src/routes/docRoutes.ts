import type { DocRoute } from "./types";
import javaDocRoutes from "./java";
import mysqlDocRoutes from "./mysql";
import mybatisDocRoutes from "./MyBatis";
import springBootDocRoutes from "./SpringBoot";

export const docRoutes: DocRoute[] = [
  ...javaDocRoutes,
  ...mysqlDocRoutes,
  ...mybatisDocRoutes,
  ...springBootDocRoutes,
];

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

/** 按路径查找对应的文档页（仅真实页面，分组节点不计）。找不到返回 null。 */
export function getDocByPath(
  pathname: string,
): { path: string; name: string } | null {
  const page = flattenDocRoutes(docRoutes).find((p) => p.path === pathname);
  return page ? { path: page.path, name: page.name } : null;
}

/** 相邻页面导航项（上一篇 / 下一篇）。 */
export interface PrevNextItem {
  path: string;
  name: string;
}

/**
 * 取得指定路径的「上一篇 / 下一篇」。
 *
 * 顺序来自 flattenDocRoutes（即侧边栏从上到下的真实页面顺序）。
 * 为避免跨知识体系跳转（如 Java 最后一篇直接跳到 MySQL 第一篇），
 * 上一篇/下一篇被限制在「同一个顶级 section」内——即 path 第一段相同。
 * 处于 section 首/尾时，对应方向返回 null。
 */
export function getPrevNext(pathname: string): {
  prev: PrevNextItem | null;
  next: PrevNextItem | null;
} {
  const pages = flattenDocRoutes(docRoutes);
  const index = pages.findIndex((p) => p.path === pathname);
  if (index === -1) return { prev: null, next: null };

  const sectionOf = (p: string) => p.split("/")[1] ?? "";
  const section = sectionOf(pathname);

  const pick = (i: number): PrevNextItem | null => {
    const node = pages[i];
    if (!node || sectionOf(node.path) !== section) return null;
    return { path: node.path, name: node.name };
  };

  return { prev: pick(index - 1), next: pick(index + 1) };
}
