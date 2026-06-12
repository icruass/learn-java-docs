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
import styles from "./index.less";

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

            {/* ── 字体：下拉 ─────────────────────────────── */}
            <div className={styles.row}>
              <span className={styles.label}>字体</span>
              <select
                className={styles.select}
                value={settings.fontFamily}
                aria-label="字体"
                onChange={(e) => setFontFamily(e.target.value)}
              >
                {FONT_OPTIONS.map((opt) => (
                  <option
                    key={opt.label}
                    value={opt.value}
                    style={opt.value ? { fontFamily: opt.value } : undefined}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UiSettings;
