import { useLayoutEffect, useEffect } from "react";

/** SSR 安全：服务端无 DOM，useLayoutEffect 会告警，退化为 useEffect。 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 文档滚动容器的「切页归零」。
 *
 * 滚动发生在右侧内容区（DocLayout 的 <main>，自身 overflow-y:auto），而非 window，
 * 所以直接对该容器元素归零，而不是 window.scrollTo。
 *
 * 带 #锚点 的导航交给浏览器原生锚点逻辑，不做归零处理。
 *
 * @param containerRef 滚动容器（内容区 <main>）
 * @param pathname     当前路由 path
 * @param hash         当前路由 hash（带锚点时跳过归零）
 */
export function useScrollRestoration(
  containerRef: React.RefObject<HTMLElement>,
  pathname: string,
  hash: string,
): void {
  useIsomorphicLayoutEffect(() => {
    if (hash) return;
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [containerRef, pathname, hash]);
}
