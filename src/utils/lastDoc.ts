/**
 * 「上次浏览」续看锚点。
 *
 * - 记录用户最后停留的文档 path（埋点在 DocLayout 的切页 effect 里）。
 * - 下次进入站点根路径 `/` 时，由 @/pages/index 读取并直接跳回该页。
 * - 与「最近浏览」(recentDocs) 刻意解耦：清空浏览历史不影响续看锚点。
 *
 * 只「写于切页、读于入口」，没有组件订阅它，所以无需发布订阅，保持最小实现。
 */

const STORAGE_KEY = "last-doc-path";

/** 记录最后浏览的文档 path。 */
export function setLastDocPath(path: string): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, path);
    }
  } catch {
    /* localStorage 不可用时静默降级，仅本次会话内存生效（实际不影响功能） */
  }
}

/** 读取最后浏览的文档 path；无记录或不可用时返回 null。 */
export function getLastDocPath(): string | null {
  try {
    return typeof localStorage !== "undefined"
      ? localStorage.getItem(STORAGE_KEY)
      : null;
  } catch {
    return null;
  }
}
