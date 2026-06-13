/**
 * 「界面设置」（全局 UI）数据源。
 *
 * - 管理字体大小、字体、行高、字间距等会覆盖 <body> 默认样式的全局排版项。
 * - 持久化到 localStorage，刷新/重开后仍生效。
 * - 写入时把各项转成 CSS 变量挂到 <html> 上（global.less 的 body 读取它们）。
 * - 内置极简发布订阅，配合 useUiSettings（useSyncExternalStore）让面板实时刷新。
 *
 * 设计上与 recentDocs.ts 保持一致：模块级缓存 + localStorage + 发布订阅。
 */

export interface UiSettings {
  /** 字体大小（px） */
  fontSize: number;
  /** 字体族；空串表示「系统默认」，回退到主题的 --font-sans */
  fontFamily: string;
  /** 行高（无单位倍数） */
  lineHeight: number;
  /** 字间距（px） */
  letterSpacing: number;
}

/** 默认值需与 global.less 中 body 的回退值保持一致。 */
export const DEFAULT_UI_SETTINGS: UiSettings = {
  fontSize: 15,
  fontFamily: "",
  lineHeight: 2.2,
  letterSpacing: 0.5,
};

/**
 * 数字类型设置项的元数据：用步进器（−/+）调整，不允许直接输入。
 * decimals 控制显示与取整精度，避免 0.1 累加产生的浮点误差。
 */
export interface NumberFieldMeta {
  key: "fontSize" | "lineHeight" | "letterSpacing";
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  decimals: number;
}

export const NUMBER_FIELDS: NumberFieldMeta[] = [
  {
    key: "fontSize",
    label: "字体大小",
    min: 12,
    max: 28,
    step: 1,
    unit: "px",
    decimals: 0,
  },
  {
    key: "lineHeight",
    label: "行高",
    min: 1,
    max: 3,
    step: 0.1,
    unit: "",
    decimals: 1,
  },
  {
    key: "letterSpacing",
    label: "字间距",
    min: -2,
    max: 10,
    step: 0.5,
    unit: "px",
    decimals: 1,
  },
];

/**
 * 字体下拉选项：尽量覆盖各平台常见的本地字体（中文 / 西文无衬线 / 衬线 / 等宽 / 趣味）。
 * value 为完整的 font-family 栈，未安装时自动回退到同族通用字体。
 */
export interface FontOption {
  label: string;
  value: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { label: "系统默认", value: "" },

  // ── 中文 ──────────────────────────────
  { label: "苹方 PingFang SC", value: '"PingFang SC", sans-serif' },
  { label: "微软雅黑 Microsoft YaHei", value: '"Microsoft YaHei", sans-serif' },
  { label: "黑体 SimHei", value: "SimHei, sans-serif" },
  { label: "宋体 SimSun", value: "SimSun, serif" },
  { label: "楷体 KaiTi", value: 'KaiTi, "STKaiti", serif' },
  { label: "仿宋 FangSong", value: 'FangSong, "STFangsong", serif' },
  { label: "等线 DengXian", value: "DengXian, sans-serif" },
  { label: "华文黑体 STHeiti", value: '"STHeiti", "Heiti SC", sans-serif' },
  {
    label: "思源黑体 Source Han Sans",
    value: '"Source Han Sans SC", "Noto Sans CJK SC", sans-serif',
  },

  // ── 西文 · 无衬线 ─────────────────────
  { label: "Segoe UI", value: '"Segoe UI", sans-serif' },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica Neue", value: '"Helvetica Neue", Helvetica, sans-serif' },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Trebuchet MS", value: '"Trebuchet MS", sans-serif' },
  { label: "Roboto", value: "Roboto, sans-serif" },

  // ── 西文 · 衬线 ───────────────────────
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
  { label: "Cambria", value: "Cambria, serif" },

  // ── 等宽 ──────────────────────────────
  { label: "Consolas", value: "Consolas, monospace" },
  { label: "Courier New", value: '"Courier New", Courier, monospace' },
  { label: "Menlo / Monaco", value: "Menlo, Monaco, monospace" },

  // ── 趣味 ──────────────────────────────
  { label: "Comic Sans MS", value: '"Comic Sans MS", cursive' },
];

const STORAGE_KEY = "ui-settings";

type Listener = () => void;
const listeners = new Set<Listener>();

/** 内存缓存，保证 getSnapshot 返回稳定引用（仅在写入时更换引用）。 */
let cache: UiSettings | null = null;

/** 把数值夹到 [min, max] 并按 decimals 取整，消除浮点误差。 */
function clampNumber(value: number, meta: NumberFieldMeta): number {
  const clamped = Math.min(meta.max, Math.max(meta.min, value));
  const factor = Math.pow(10, meta.decimals);
  return Math.round(clamped * factor) / factor;
}

/** 读取并与默认值合并，丢弃未知字段；保证类型安全。 */
function sanitize(raw: any): UiSettings {
  const merged: UiSettings = { ...DEFAULT_UI_SETTINGS };
  if (raw && typeof raw === "object") {
    for (const meta of NUMBER_FIELDS) {
      const v = raw[meta.key];
      if (typeof v === "number" && Number.isFinite(v)) {
        merged[meta.key] = clampNumber(v, meta);
      }
    }
    if (typeof raw.fontFamily === "string") {
      merged.fontFamily = raw.fontFamily;
    }
  }
  return merged;
}

function read(): UiSettings {
  if (cache) return cache;
  try {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;
    cache = sanitize(raw ? JSON.parse(raw) : null);
  } catch {
    cache = { ...DEFAULT_UI_SETTINGS };
  }
  return cache;
}

/**
 * 把设置项写成 CSS 变量挂到 <html>，body 据此覆盖默认排版。
 * fontFamily 为空时移除变量，回退到 global.less 里的 var(--font-sans)。
 */
export function applyUiSettings(s: UiSettings): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--ui-font-size", `${s.fontSize}px`);
  root.style.setProperty("--ui-line-height", String(s.lineHeight));
  root.style.setProperty("--ui-letter-spacing", `${s.letterSpacing}px`);
  if (s.fontFamily) {
    root.style.setProperty("--ui-font-family", s.fontFamily);
  } else {
    root.style.removeProperty("--ui-font-family");
  }
}

function write(next: UiSettings): void {
  cache = next;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    /* localStorage 不可用时静默降级，仅内存生效 */
  }
  applyUiSettings(next);
  listeners.forEach((fn) => fn());
}

/** 当前设置。返回引用稳定，可直接用于 useSyncExternalStore。 */
export function getUiSettings(): UiSettings {
  return read();
}

/** 更新单个数字项（步进），自动夹取范围与取整。 */
export function stepNumberSetting(
  key: NumberFieldMeta["key"],
  dir: 1 | -1
): void {
  const meta = NUMBER_FIELDS.find((m) => m.key === key)!;
  const current = read();
  const nextVal = clampNumber(current[key] + dir * meta.step, meta);
  if (nextVal === current[key]) return; // 已到边界，无变化
  write({ ...current, [key]: nextVal });
}

/** 设置字体族（下拉选择）。 */
export function setFontFamily(value: string): void {
  const current = read();
  if (value === current.fontFamily) return;
  write({ ...current, fontFamily: value });
}

/** 恢复全部默认。 */
export function resetUiSettings(): void {
  write({ ...DEFAULT_UI_SETTINGS });
}

/** 是否仍为全部默认（用于「恢复默认」按钮的禁用态）。 */
export function isDefaultUiSettings(s: UiSettings): boolean {
  return (
    s.fontSize === DEFAULT_UI_SETTINGS.fontSize &&
    s.fontFamily === DEFAULT_UI_SETTINGS.fontFamily &&
    s.lineHeight === DEFAULT_UI_SETTINGS.lineHeight &&
    s.letterSpacing === DEFAULT_UI_SETTINGS.letterSpacing
  );
}

/** 订阅变更，返回取消订阅函数。 */
export function subscribeUiSettings(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
