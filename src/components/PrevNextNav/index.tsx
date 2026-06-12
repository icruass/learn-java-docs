import React from "react";
import { Link, useLocation } from "umi";
import { getPrevNext } from "@/routes/docRoutes";
import styles from "./index.less";

/**
 * 页面底部的「上一篇 / 下一篇」导航卡片。
 *
 * 顺序与上一篇/下一篇的取值逻辑完全交给 getPrevNext（基于侧边栏的真实页面顺序，
 * 并限制在同一顶级 section 内）。本组件只负责渲染。
 * 当前路径不是文档页（prev、next 都为 null）时不渲染任何内容。
 */
const PrevNextNav: React.FC = () => {
  const { pathname } = useLocation();
  const { prev, next } = getPrevNext(pathname);

  if (!prev && !next) return null;

  return (
    <nav className={styles.nav} aria-label="上一篇 / 下一篇">
      {prev ? (
        <Link to={prev.path} className={`${styles.card} ${styles.prev}`}>
          <span className={styles.dir}>
            <span className={styles.arrow} aria-hidden="true">
              ←
            </span>
            上一篇
          </span>
          <span className={styles.title}>{prev.name}</span>
        </Link>
      ) : (
        // 占位，保证只有「下一篇」时它仍然靠右
        <span className={styles.placeholder} aria-hidden="true" />
      )}

      {next ? (
        <Link to={next.path} className={`${styles.card} ${styles.next}`}>
          <span className={styles.dir}>
            下一篇
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </span>
          <span className={styles.title}>{next.name}</span>
        </Link>
      ) : (
        <span className={styles.placeholder} aria-hidden="true" />
      )}
    </nav>
  );
};

export default PrevNextNav;
