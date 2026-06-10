import React, { useState } from 'react';
import { Link, useLocation } from 'umi';
import type { DocRoute } from '@/routes/types';
import { docRoutes } from '@/routes/docRoutes';
import styles from './index.less';

/** 按层级取样式类（1→3 字体由大到小、颜色由深到浅，超过 3 级按 3 级处理） */
const levelClass = (level: number) =>
  level <= 1 ? styles.level1 : level === 2 ? styles.level2 : styles.level3;

/** 单个叶子菜单项（可点击跳转的文档页） */
const LeafItem: React.FC<{ node: DocRoute; active: boolean; level: number }> = ({
  node,
  active,
  level,
}) => (
  <Link
    to={node.path}
    className={`${styles.item} ${levelClass(level)} ${
      active ? styles.itemActive : ''
    }`}
  >
    {node.icon && <span className={styles.itemIcon}>{node.icon}</span>}
    <span className={styles.itemLabel}>{node.name}</span>
  </Link>
);

/** 分组（带子项的可折叠区块） */
const GroupItem: React.FC<{ node: DocRoute; pathname: string; level: number }> = ({
  node,
  pathname,
  level,
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.group}>
      <button
        type="button"
        className={`${styles.groupHeader} ${open ? styles.groupHeaderOpen : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        {node.icon && <span className={styles.itemIcon}>{node.icon}</span>}
        <span className={`${styles.groupTitle} ${levelClass(level)}`}>
          {node.name}
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
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
const RouteNode: React.FC<{ node: DocRoute; pathname: string; level: number }> = ({
  node,
  pathname,
  level,
}) => {
  if (node.routes?.length) {
    return <GroupItem node={node} pathname={pathname} level={level} />;
  }
  return (
    <LeafItem node={node} active={pathname === node.path} level={level} />
  );
};

/** 左侧侧边栏：由 docRoutes 树渲染，风格参考 reactbits.dev */
const Sidebar: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandText}>Learn Java Docs</span>
      </div>

      <nav className={styles.nav}>
        {docRoutes.map((node) => (
          <RouteNode key={node.path} node={node} pathname={pathname} level={1} />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
