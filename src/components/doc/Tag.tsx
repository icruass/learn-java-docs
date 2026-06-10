import React from 'react';
import styles from './doc.less';

interface TagProps {
  children: React.ReactNode;
  /** 样式变体：soft（默认柔和底色）/ solid（实心）/ outline（描边） */
  variant?: 'soft' | 'solid' | 'outline';
  className?: string;
}

/** 着重点文本标签 */
const Tag: React.FC<TagProps> = ({ children, variant = 'soft', className }) => {
  const variantClass =
    variant === 'solid'
      ? styles.tagSolid
      : variant === 'outline'
        ? styles.tagOutline
        : '';
  return (
    <span className={`${styles.tag} ${variantClass} ${className ?? ''}`}>
      {children}
    </span>
  );
};

export default Tag;
