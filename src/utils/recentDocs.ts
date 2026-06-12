/**
 * 「最近浏览」数据源。
 *
 * - 每篇文档加载后调用 recordDoc 写入，按 path 去重（同一篇只保留一条，且置顶为最新）。
 * - 持久化到 localStorage，刷新/重开后仍在。
 * - 内置极简发布订阅，配合 useRecentDocs（useSyncExternalStore）让 popover 实时刷新。
 */

export interface RecentDoc {
  path: string;
  name: string;
  /** 最近一次访问的时间戳（ms） */
  ts: number;
}

const STORAGE_KEY = "recent-docs";
/** 最多保留的条数 */
const MAX = 12;

type Listener = () => void;
const listeners = new Set<Listener>();

/** 内存缓存，保证 getSnapshot 返回稳定引用（仅在写入时更换引用）。 */
let cache: RecentDoc[] | null = null;

function read(): RecentDoc[] {
  if (cache) return cache;
  try {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(list: RecentDoc[]): void {
  cache = list;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    /* localStorage 不可用时静默降级，仅内存生效 */
  }
  listeners.forEach((fn) => fn());
}

/** 当前列表（最新的在前）。返回引用稳定，可直接用于 useSyncExternalStore。 */
export function getRecentDocs(): RecentDoc[] {
  return read();
}

/** 记录一次访问：按 path 去重，置顶为最新，超出上限截断。 */
export function recordDoc(doc: { path: string; name: string }): void {
  const ts =
    typeof performance !== "undefined" && performance.timeOrigin
      ? performance.timeOrigin + performance.now()
      : new Date().getTime();
  const next = read().filter((d) => d.path !== doc.path);
  next.unshift({ path: doc.path, name: doc.name, ts });
  write(next.slice(0, MAX));
}

/** 删除单条。 */
export function removeRecentDoc(path: string): void {
  write(read().filter((d) => d.path !== path));
}

/** 清空全部。 */
export function clearRecentDocs(): void {
  write([]);
}

/** 订阅变更，返回取消订阅函数。 */
export function subscribeRecentDocs(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
