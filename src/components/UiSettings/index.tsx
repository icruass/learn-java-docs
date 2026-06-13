import React, { useEffect, useRef, useState } from "react";
import { useUiSettings } from "@/hooks/useUiSettings";
import {
  FONT_OPTIONS,
  NUMBER_FIELDS,
  applyUiSettings,
  getUiSettings,
  isDefaultUiSettings,
  resetUiSettings,
  setFontFamily,
  stepNumberSetting,
} from "@/utils/uiSettings";
import { cx } from "@/utils/cx";
import styles from "./index.less";

/**
 * 字体下拉（自定义 listbox，替代原生 <select>）。
 *
 * 为什么不用原生 select：原生 select 的选中态与键盘行为由浏览器 / OS 接管，
 * 做不到「按实际值高亮选中」与「↑/↓ 即选即应用」，逐项的字体预览跨平台也不可靠。
 *
 * 行为：
 * - 选中项以「值相等」判断（opt.value === value），高亮 + ✓；
 * - ↑/↓ 直接选中并立即应用（即选即应用），打开时定位到当前项并滚动到可见；
 * - Enter / 点击 选定并关闭；Esc / 点外部 关闭（Esc 不会连带关掉外层设置面板）。
 */
const FontSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 始终持有最新 value，避免按住方向键连发时闭包读到旧值导致跳格。
  const valueRef = useRef(value);
  valueRef.current = value;

  // 渲染用：当前选中项（找不到则回退到第一项「系统默认」）。
  const selectedIndex = Math.max(
    0,
    FONT_OPTIONS.findIndex((o) => o.value === value),
  );
  const current = FONT_OPTIONS[selectedIndex];

  // 打开时聚焦列表，让键盘直接可用。
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // 打开 / 选中项变化时，把选中项滚动到可见区域。
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, value]);

  // 点击下拉外部（可能仍在设置面板内）时，仅关闭本下拉。
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const closeAndFocus = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const currentIdx = () =>
    Math.max(
      0,
      FONT_OPTIONS.findIndex((o) => o.value === valueRef.current),
    );

  // 选中第 i 项（夹取范围）并立即应用；保持下拉打开（即选即应用）。
  const selectAt = (i: number) => {
    const opt = FONT_OPTIONS[Math.min(FONT_OPTIONS.length - 1, Math.max(0, i))];
    if (opt.value !== valueRef.current) onChange(opt.value);
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        selectAt(currentIdx() + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        selectAt(currentIdx() - 1);
        break;
      case "Home":
        e.preventDefault();
        selectAt(0);
        break;
      case "End":
        e.preventDefault();
        selectAt(FONT_OPTIONS.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        closeAndFocus();
        break;
      case "Escape":
        // 只关本下拉；阻断到 document，避免外层设置面板的 Esc 监听把整个面板也关掉。
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        closeAndFocus();
        break;
      case "Tab":
        setOpen(false); // 不拦截 Tab，让焦点正常移走
        break;
    }
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (
      !open &&
      (e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "Enter" ||
        e.key === " ")
    ) {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className={styles.select} ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.selectTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="字体"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
      >
        <span
          className={styles.selectValue}
          style={current.value ? { fontFamily: current.value } : undefined}
        >
          {current.label}
        </span>
        <svg
          className={cx(styles.selectCaret, open && styles.selectCaretOpen)}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          className={styles.options}
          role="listbox"
          aria-label="字体"
          aria-activedescendant={`font-opt-${selectedIndex}`}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
        >
          {FONT_OPTIONS.map((opt, i) => {
            const selected = opt.value === value;
            return (
              <li
                key={opt.label}
                id={`font-opt-${i}`}
                role="option"
                aria-selected={selected}
                className={cx(styles.option, selected && styles.optionSelected)}
                style={opt.value ? { fontFamily: opt.value } : undefined}
                onClick={() => {
                  if (opt.value !== value) onChange(opt.value);
                  closeAndFocus();
                }}
              >
                <span className={styles.optionCheck} aria-hidden="true">
                  {selected ? "✓" : ""}
                </span>
                <span className={styles.optionLabel}>{opt.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

/**
 * 顶部导航栏的「界面设置」按钮 + 弹出层。
 *
 * 设置全局排版（字体大小 / 字体 / 行高 / 字间距），逐行展示：
 * - 数字项不可直接输入，用后置的 − / + 步进按钮调整；
 * - 字体为下拉，提供尽可能多的本地字体；
 * 修改即时写入 localStorage，并以 CSS 变量覆盖 <body> 的默认样式。
 * 点击外部或按 Esc 关闭。
 */
const UiSettings: React.FC = () => {
  const settings = useUiSettings();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 首屏挂载时把已保存的设置应用到 <html>（useSyncExternalStore 不负责副作用）
  useEffect(() => {
    applyUiSettings(getUiSettings());
  }, []);

  // 点击外部 / 按 Esc 关闭
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const atDefault = isDefaultUiSettings(settings);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="界面设置"
        title="界面设置"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {/* sliders / 调节滑块 图标 */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      </button>

      {open && (
        <div className={styles.popover} role="dialog" aria-label="界面设置">
          <div className={styles.header}>
            <span className={styles.title}>界面设置</span>
            <button
              type="button"
              className={styles.reset}
              disabled={atDefault}
              onClick={() => resetUiSettings()}
            >
              恢复默认
            </button>
          </div>

          <div className={styles.body}>
            {/* ── 数字项：步进器 ─────────────────────────── */}
            {NUMBER_FIELDS.map((field) => {
              const value = settings[field.key];
              const atMin = value <= field.min;
              const atMax = value >= field.max;
              const display = value.toFixed(field.decimals) + field.unit;
              return (
                <div className={styles.row} key={field.key}>
                  <span className={styles.label}>{field.label}</span>
                  <div className={styles.stepper}>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      aria-label={`减小${field.label}`}
                      disabled={atMin}
                      onClick={() => stepNumberSetting(field.key, -1)}
                    >
                      −
                    </button>
                    <span className={styles.value}>{display}</span>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      aria-label={`增大${field.label}`}
                      disabled={atMax}
                      onClick={() => stepNumberSetting(field.key, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}

            {/* ── 字体：自定义下拉（listbox） ─────────────── */}
            <div className={styles.row}>
              <span className={styles.label}>字体</span>
              <FontSelect value={settings.fontFamily} onChange={setFontFamily} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UiSettings;
