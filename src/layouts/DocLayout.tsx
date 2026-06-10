import React from 'react';
import { Outlet } from 'umi';
import Sidebar from '@/components/Sidebar';
import ThemeSwitch from '@/components/ThemeSwitch';
import styles from './DocLayout.less';

/**
 * 文档主框架布局：左侧侧边栏 + 右侧内容区。
 * 右侧顶部有一个 header，主题切换开关固定在其右侧。
 * 所有文档页面（docRoutes）都作为该布局的子路由，通过 <Outlet /> 渲染到内容区。
 */
const DocLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.content}>
        <header className={styles.topbar}>
          <ThemeSwitch size="11px" />
        </header>
        <div className={styles.contentInner}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DocLayout;
