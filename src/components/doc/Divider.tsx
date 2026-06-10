import React from 'react';
import styles from './doc.less';

/** 分隔线（对应 markdown 的 ---） */
const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <hr className={`${styles.divider} ${className ?? ''}`} />
);

export default Divider;
