import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "umi";
import type { DocRoute } from "@/routes/types";
import { docRoutes } from "@/routes/docRoutes";
import AiChatDialog from "@/components/AiChatDialog";
import styles from "./index.less";

/** 按层级取样式类（1→3 字体由大到小、颜色由深到浅，超过 3 级按 3 级处理） */
const levelClass = (level: number) =>
  level <= 1 ? styles.level1 : level === 2 ? styles.level2 : styles.level3;

/** 该节点子树（含自身）是否包含当前激活路由，用于刷新/跳转时自动展开父级 */
const containsActivePath = (node: DocRoute, pathname: string): boolean =>
  node.path === pathname ||
  !!node.routes?.some((child) => containsActivePath(child, pathname));

/** 激活项滚动到侧边栏顶部时，预留的吸顶分组标题高度（约两级 sticky 表头） */
const STICKY_OFFSET = 72;

/** 单个叶子菜单项（可点击跳转的文档页） */
const LeafItem: React.FC<{
  node: DocRoute;
  active: boolean;
  level: number;
}> = ({ node, active, level }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  // 激活项：刷新进入 / 跳转（含「最近浏览」跳转）后，把自身滚动到侧边栏可视区顶部
  // （避开吸顶分组标题）。用双 rAF 等父级分组展开后的布局稳定，再计算位置。
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    // 向上找到「真正可滚动」的祖先（侧边栏 nav）：必须是 overflow auto/scroll 且当前确有溢出。
    // 旧实现仅按 scrollHeight<=clientHeight 向上找，nav 内容恰好不溢出时会越过它取到 null，
    // 导致跳转后不滚动定位。
    const getScroller = (node: HTMLElement): HTMLElement | null => {
      let p: HTMLElement | null = node.parentElement;
      while (p) {
        const oy = getComputedStyle(p).overflowY;
        if ((oy === "auto" || oy === "scroll") && p.scrollHeight > p.clientHeight)
          return p;
        p = p.parentElement;
      }
      return null;
    };

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const scroller = getScroller(el);
        if (!scroller) return;
        // 仅当激活项不在侧边栏可视区内时才滚动定位（刷新进入 /「最近浏览」跳转）。
        // 点击侧边栏菜单时该项本就可见，无需再滚到顶部，避免点击时的跳动。
        const elRect = el.getBoundingClientRect();
        const scRect = scroller.getBoundingClientRect();
        const visible =
          elRect.top >= scRect.top + STICKY_OFFSET && elRect.bottom <= scRect.bottom;
        if (visible) return;
        const target =
          elRect.top - scRect.top + scroller.scrollTop - STICKY_OFFSET;
        scroller.scrollTop = Math.max(0, target);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [active]);

  return (
    <Link
      ref={ref}
      to={node.path}
      className={`${styles.item} ${levelClass(level)} ${
        active ? styles.itemActive : ""
      }`}
    >
      {node.icon && <span className={styles.itemIcon}>{node.icon}</span>}
      <span className={styles.itemLabel}>{node.name}</span>
    </Link>
  );
};

/** 分组（带子项的可折叠区块） */
const GroupItem: React.FC<{
  node: DocRoute;
  pathname: string;
  level: number;
  initiallyOpen?: boolean;
}> = ({ node, pathname, level, initiallyOpen = false }) => {
  // 本组子树是否包含当前激活路由
  const hasActive = containsActivePath(node, pathname);
  const [open, setOpen] = useState(initiallyOpen || hasActive);
  // 每次路由变化都重新判定：只要子树包含当前激活项就自动展开（刷新进入 / 侧边栏点击 /
  // 「最近浏览」跳转皆生效，且在同组内不同页之间切换也会再次确保展开）。
  // 依赖里带上 pathname，使「同组内换页 / 之前被手动折叠」时也能重新展开定位。
  // 不主动收起，保留用户在其它分组上的手动折叠选择。
  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive, pathname]);
  return (
    <div className={styles.group}>
      <button
        type="button"
        className={`${styles.groupHeader} ${styles[`groupHeader_${level}`]} ${
          open ? styles.groupHeaderOpen : ""
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        {node.icon && <span className={styles.itemIcon}>{node.icon}</span>}
        <span className={`${styles.groupTitle} ${levelClass(level)}`}>
          {node.name}
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>
          ›
        </span>
      </button>
      {open && (
        <div className={styles.groupBody}>
          {node.routes?.map((child) => (
            <RouteNode
              key={child.path}
              node={child}
              pathname={pathname}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/** 根据节点是分组还是叶子，分发渲染 */
const RouteNode: React.FC<{
  node: DocRoute;
  pathname: string;
  level: number;
  initiallyOpen?: boolean;
}> = ({ node, pathname, level, initiallyOpen }) => {
  if (node.routes?.length) {
    return (
      <GroupItem
        node={node}
        pathname={pathname}
        level={level}
        // 是否包含当前激活项由 GroupItem 自行判定；这里仅透传「默认展开」兜底（如第一组）
        initiallyOpen={initiallyOpen}
      />
    );
  }
  return <LeafItem node={node} active={pathname === node.path} level={level} />;
};

/** 左侧侧边栏：桌面端固定在左侧，移动端作为抽屉从左滑入 */
const Sidebar: React.FC<{
  drawerOpen?: boolean;
  onClose?: () => void;
}> = ({ drawerOpen = false, onClose }) => {
  const { pathname } = useLocation();
  const [pageAiOpen, setPageAiOpen] = useState(false);

  return (
    <aside
      className={`${styles.sidebar} ${drawerOpen ? styles.drawerOpen : ""}`}
    >
      <div className={styles.brand}>
        <span className={styles.brandText}>Java Docs</span>
        <button
          type="button"
          className={styles.aiEntryBtn}
          onClick={() => setPageAiOpen(true)}
          title="针对本页内容的 AI 问答"
          aria-label="打开 AI 问答"
        >
          AI 🤖
        </button>
        {/* Close button: only visible inside the mobile drawer */}
        <button
          className={styles.closeBtn}
          aria-label="关闭菜单"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <nav className={styles.nav}>
        {docRoutes.map((node, i) => (
          <RouteNode
            key={node.path}
            node={node}
            pathname={pathname}
            level={1}
            initiallyOpen={i === 0}
          />
        ))}
      </nav>

      <AiChatDialog
        open={pageAiOpen}
        onClose={() => setPageAiOpen(false)}
        scope="page"
      />
    </aside>
  );
};

export default Sidebar;
