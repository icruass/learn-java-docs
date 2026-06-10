import React from 'react';
import styles from './doc.less';

interface ListProps {
  children: React.ReactNode;
  className?: string;
}

/** 无序列表（对应 markdown 的 - / * 列表）。可嵌套。 */
export const UnorderedList: React.FC<ListProps> = ({ children, className }) => (
  <ul className={`${styles.ul} ${className ?? ''}`}>{children}</ul>
);

/** 有序列表（对应 markdown 的 1. 2. 3. 列表）。可嵌套。 */
export const OrderedList: React.FC<ListProps> = ({ children, className }) => (
  <ol className={`${styles.ol} ${className ?? ''}`}>{children}</ol>
);

/** 列表项 */
export const ListItem: React.FC<ListProps> = ({ children, className }) => (
  <li className={`${styles.li} ${className ?? ''}`}>{children}</li>
);
