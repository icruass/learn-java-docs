import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "umi";
import Sidebar from "@/components/Sidebar";
import ThemeSwitch from "@/components/ThemeSwitch";
import PrevNextNav from "@/components/PrevNextNav";
import RecentHistory from "@/components/RecentHistory";
import UiSettings from "@/components/UiSettings";
import ScrollToggle from "@/components/ScrollToggle";
import { getDocByPath } from "@/routes/docRoutes";
import { recordDoc } from "@/utils/recentDocs";
import { setLastDocPath } from "@/utils/lastDoc";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import styles from "./DocLayout.less";

const DocLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname, hash } = useLocation();

  // 内容区是真正的滚动容器（自身 overflow-y:auto），续看续读位置都基于它读写
  const contentRef = useRef<HTMLElement>(null);
  useScrollRestoration(contentRef, pathname, hash);

  // Close drawer whenever the user navigates to a new page
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // 每篇文档加载后记录到「最近浏览」（按 path 去重由 recordDoc 内部处理），
  // 同时把它存为「上次浏览」续看锚点，供下次从根路径进入时直接跳回（见 @/pages/index）。
  useEffect(() => {
    const doc = getDocByPath(pathname);
    if (doc) {
      recordDoc(doc);
      setLastDocPath(doc.path);
    }
  }, [pathname]);

  return (
    <div className={styles.layout}>
      {/* ── Mobile-only top bar ───────────────────────────────────── */}
      <header className={styles.mobileTopbar}>
        <button
          className={styles.menuBtn}
          aria-label="打开菜单"
          onClick={() => setDrawerOpen(true)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect y="2" width="18" height="2" rx="1" />
            <rect y="8" width="18" height="2" rx="1" />
            <rect y="14" width="18" height="2" rx="1" />
          </svg>
        </button>
        <span className={styles.brandMobile}>Java Docs</span>
        <div className={styles.topbarActions}>
          <RecentHistory />
          <UiSettings />
          <ThemeSwitch />
        </div>
      </header>

      {/* ── Drawer backdrop (mobile only, always rendered for CSS transition) */}
      <div
        className={`${styles.backdrop} ${drawerOpen ? styles.backdropVisible : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar (normal on desktop / drawer on mobile) ────────── */}
      <Sidebar drawerOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className={styles.content} ref={contentRef}>
        {/* Desktop-only topbar; hidden on mobile (replaced by mobileTopbar) */}
        <header className={styles.topbar}>
          <div className={styles.topbarActions}>
            <RecentHistory />
            <UiSettings />
            <ThemeSwitch />
          </div>
        </header>
        <div className={styles.contentInner}>
          <Outlet />
          <PrevNextNav />
        </div>
        <ScrollToggle scrollRef={contentRef} />
      </main>
    </div>
  );
};

export default DocLayout;
