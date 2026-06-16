import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "umi";
import type { DocRoute } from "@/routes/types";
import { docRoutes } from "@/routes/docRoutes";
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

  // 激活项：刷新进入 / 跳转后，把自身滚动到侧边栏可视区顶部（避开吸顶分组标题）
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    // 向上找到可滚动的祖先（侧边栏 nav）
    let scroller: HTMLElement | null = el.parentElement;
    while (scroller && scroller.scrollHeight <= scroller.clientHeight) {
      scroller = scroller.parentElement;
    }
    if (!scroller) return;
    // 等布局稳定（父级分组展开完成）后再计算位置
    const id = requestAnimationFrame(() => {
      const target =
        el.getBoundingClientRect().top -
        scroller!.getBoundingClientRect().top +
        scroller!.scrollTop -
        STICKY_OFFSET;
      scroller!.scrollTop = Math.max(0, target);
    });
    return () => cancelAnimationFrame(id);
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
  const [open, setOpen] = useState(initiallyOpen);
  // 路由变化导致本组「包含激活项」时自动展开（刷新进入 / 跳转皆生效）；
  // 不主动收起，保留用户手动折叠的选择。
  useEffect(() => {
    if (initiallyOpen) setOpen(true);
  }, [initiallyOpen]);
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
        // 子树包含当前路由则展开；显式传入的 initiallyOpen 作为兜底默认
        initiallyOpen={initiallyOpen || containsActivePath(node, pathname)}
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

  return (
    <aside
      className={`${styles.sidebar} ${drawerOpen ? styles.drawerOpen : ""}`}
    >
      <div className={styles.brand}>
        <span className={styles.brandText}>Java Docs</span>
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
    </aside>
  );
};

export default Sidebar;
