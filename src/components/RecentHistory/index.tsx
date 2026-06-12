import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "umi";
import { useRecentDocs } from "@/hooks/useRecentDocs";
import { clearRecentDocs, removeRecentDoc } from "@/utils/recentDocs";
import styles from "./index.less";

/**
 * 顶部导航栏的「最近浏览」按钮 + 弹出层。
 *
 * 数据来自 useRecentDocs（每篇文档加载后由 DocLayout 记录、按 path 去重）。
 * 点击图标展开 popover，列出最近浏览的文档；点击某项跳转并关闭；
 * 支持单条删除与一键清空。点击外部或按 Esc 关闭。
 */
const RecentHistory: React.FC = () => {
  const recent = useRecentDocs();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="最近浏览"
        title="最近浏览"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {/* history / clock-rewind 图标 */}
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
          <path d="M3 3v5h5" />
          <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
          <path d="M12 7v5l3 2" />
        </svg>
      </button>

      {open && (
        <div className={styles.popover} role="dialog" aria-label="最近浏览">
          <div className={styles.header}>
            <span className={styles.title}>最近浏览</span>
            {recent.length > 0 && (
              <button
                type="button"
                className={styles.clear}
                onClick={() => clearRecentDocs()}
              >
                清空
              </button>
            )}
          </div>

          {recent.length === 0 ? (
            <div className={styles.empty}>暂无浏览记录</div>
          ) : (
            <ul className={styles.list}>
              {recent.map((doc) => (
                <li key={doc.path} className={styles.item}>
                  <button
                    type="button"
                    className={styles.link}
                    onClick={() => go(doc.path)}
                    title={doc.name}
                  >
                    <span className={styles.dot} aria-hidden="true" />
                    <span className={styles.name}>{doc.name}</span>
                  </button>
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`移除 ${doc.name}`}
                    title="移除"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentDoc(doc.path);
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentHistory;
