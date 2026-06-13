/**
 * 「按文档记忆滚动位置」数据源。
 *
 * - 每篇文档在浏览时持续把滚动条位置（scrollTop）写入，按 path 归档。
 * - 再次进入同一篇（含从根路径 `/` 续看「上次浏览」的那篇）时还原到原位置。
 * - 与 lastDoc（续看锚点，只记 path）配合：lastDoc 决定「跳回哪一篇」，
 *   本模块决定「跳回那一篇的哪个位置」。两者解耦，互不影响。
 *
 * 持久化到 localStorage，并按写入新近度做 LRU 截断，避免无限增长。
 * 只「写于滚动 / 读于切页」，没有组件订阅它，故无需发布订阅，保持最小实现。
 */

const STORAGE_KEY = "doc-scroll-pos";
/** 最多记忆多少篇文档的滚动位置（超出按最久未写入淘汰） */
const MAX = 50;

type ScrollMap = Record<string, number>;

/** 内存缓存，避免每次读写都走 JSON.parse。 */
let cache: ScrollMap | null = null;

function read(): ScrollMap {
  if (cache) return cache;
  try {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;
    const parsed = raw ? JSON.parse(raw) : {};
    cache =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as ScrollMap)
        : {};
  } catch {
    cache = {};
  }
  return cache;
}

function write(map: ScrollMap): void {
  cache = map;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    }
  } catch {
    /* localStorage 不可用时静默降级，仅内存生效 */
  }
}

/** 记录某篇文档的滚动位置（重新插入以刷新 LRU 新近度，超限淘汰最旧）。 */
export function saveScrollPos(path: string, top: number): void {
  if (!path) return;
  const map = read();
  // 对象按插入顺序遍历：先删后插使该 key 成为「最新」，便于超限时淘汰最旧的
  if (path in map) delete map[path];
  map[path] = Math.max(0, Math.round(top));
  const keys = Object.keys(map);
  if (keys.length > MAX) delete map[keys[0]];
  write(map);
}

/** 读取某篇文档记忆的滚动位置；无记录时返回 0（即页首）。 */
export function getScrollPos(path: string): number {
  const v = read()[path];
  return typeof v === "number" && v >= 0 ? v : 0;
}

/** 清除滚动记忆：传 path 清单篇，不传清空全部。 */
export function clearScrollPos(path?: string): void {
  if (path == null) {
    write({});
    return;
  }
  const map = read();
  if (path in map) {
    delete map[path];
    write(map);
  }
}
