import React from 'react';
import { Link } from 'umi';

interface DocLinkProps {
  /** 站内路由路径（如 /docs/mysql/02-mysql安装卸载与服务管理）或外部 http 链接 */
  to: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * 文档链接。站内路径用 umi <Link> 跳转，http(s) 外链用普通 <a>（新窗口打开）。
 */
const DocLink: React.FC<DocLinkProps> = ({ to, children, className }) => {
  const isExternal = /^https?:\/\//.test(to);
  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};

export default DocLink;
