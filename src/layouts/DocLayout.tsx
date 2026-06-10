import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "umi";
import Sidebar from "@/components/Sidebar";
import ThemeSwitch from "@/components/ThemeSwitch";
import styles from "./DocLayout.less";

const DocLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // Close drawer whenever the user navigates to a new page
  useEffect(() => {
    setDrawerOpen(false);
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
        <ThemeSwitch />
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
      <main className={styles.content}>
        {/* Desktop-only topbar; hidden on mobile (replaced by mobileTopbar) */}
        <header className={styles.topbar}>
          <ThemeSwitch />
        </header>
        <div className={styles.contentInner}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DocLayout;
