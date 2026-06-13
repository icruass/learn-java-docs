import { useEffect, useLayoutEffect, useRef } from "react";
import { getScrollPos, saveScrollPos } from "@/utils/scrollMemory";

/** SSR 安全：服务端无 DOM，useLayoutEffect 会告警，退化为 useEffect。 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 文档滚动容器的「记忆 + 还原」。
 *
 * 滚动发生在右侧内容区（DocLayout 的 <main>，自身 overflow-y:auto），
 * 而非 window，所以读写都针对该容器元素。
 *
 * 行为：
 * - 浏览时持续把「当前路径」的滚动位置写入存储（rAF 节流），确保离开本页前
 *   位置已是最新——切页时旧内容可能已被卸载导致 scrollTop 归零，故不依赖切页时再读。
 * - 切页 / 首次进入后，等目标文档「加载完成」（容器高度足以容纳目标位置）再还原，
 *   用 rAF 轮询兜底异步分包 / 图片撑高带来的高度滞后，避免还原到错位置或闪烁。
 * - 带 #锚点 的导航交给浏览器原生锚点逻辑，既不还原也不保存（避免锚点偏移污染记忆）。
 *
 * 关键防御：还原进行中（含切页瞬间旧内容卸载、内容高度变化触发的「夹断」滚动、
 * 以及程序化设置 scrollTop）产生的滚动事件都不是用户行为，必须跳过保存，
 * 否则会把瞬态值（常为 0）误记到目标路径名下，导致下次还原到页首。
 *
 * @param containerRef 滚动容器（内容区 <main>）
 * @param pathname     当前路由 path
 * @param hash         当前路由 hash（带锚点时跳过还原与保存）
 */
export function useScrollRestoration(
  containerRef: React.RefObject<HTMLElement>,
  pathname: string,
  hash: string,
): void {
  // 监听器始终把位置归档到「此刻正在浏览」的 path；切页时由布局副作用更新它。
  const trackedPathRef = useRef(pathname);
  // 还原进行中：期间一律不保存，屏蔽夹断 / 程序化滚动等非用户事件。
  const restoringRef = useRef(false);
  // 当前 hash：带锚点时不保存，防止锚点偏移被当成阅读位置写入。
  const hashRef = useRef(hash);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let frame = 0;
    // 仅保存「用户主动滚动」：还原中或带锚点时跳过
    const shouldSkip = () => restoringRef.current || !!hashRef.current;
    const flush = () => {
      frame = 0;
      if (shouldSkip()) return;
      saveScrollPos(trackedPathRef.current, el.scrollTop);
    };
    const onScroll = () => {
      if (frame || shouldSkip()) return; // rAF 节流 + 跳过非用户滚动
      frame = requestAnimationFrame(flush);
    };
    // 离开页面 / 切到后台时立即落盘，防止 rAF 还没来得及 flush 就被冻结
    const persistNow = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      if (shouldSkip()) return;
      saveScrollPos(trackedPathRef.current, el.scrollTop);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") persistNow();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", persistNow);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", persistNow);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [containerRef]);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // 后续监听都归档到新 path（须在任何「内容变矮→scrollTop 被夹断→scroll 事件」之前更新）
    trackedPathRef.current = pathname;
    hashRef.current = hash;

    // 锚点导航交给浏览器原生处理，期间不保存（见 shouldSkip）
    if (hash) {
      restoringRef.current = false;
      return;
    }

    restoringRef.current = true;
    // 还原结束后多等一拍再恢复保存，吞掉「设置 scrollTop / 内容增减」引发的非用户滚动事件
    let settleTimer = 0;
    const done = () => {
      settleTimer = window.setTimeout(() => {
        restoringRef.current = false;
      }, 0);
    };

    const target = getScrollPos(pathname);
    let raf = 0;

    // 新页面（无记忆）直接回到页首：此时容器可能还停留在上一篇的滚动位置，需显式归零
    if (target <= 0) {
      el.scrollTop = 0;
      done();
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(settleTimer);
        restoringRef.current = false;
      };
    }

    // 内容可能异步分包 / 含图片，首帧高度不足；轮询到「装得下目标位置」再还原
    let attempts = 0;
    const MAX_ATTEMPTS = 60; // ~1s @60fps 的兜底上限
    const restore = () => {
      const maxTop = el.scrollHeight - el.clientHeight;
      if (maxTop >= target || attempts >= MAX_ATTEMPTS) {
        el.scrollTop = Math.max(0, Math.min(target, maxTop));
        done();
        return;
      }
      attempts += 1;
      raf = requestAnimationFrame(restore);
    };
    raf = requestAnimationFrame(restore);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      restoringRef.current = false;
    };
  }, [containerRef, pathname, hash]);
}
