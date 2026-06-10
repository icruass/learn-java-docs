import React from 'react';
import styles from './doc.less';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/** 大标题（页面主标题，h1） */
export const Title: React.FC<HeadingProps> = ({ children, className, id }) => (
  <h1 id={id} className={`${styles.title} ${className ?? ''}`}>
    {children}
  </h1>
);

/** 二级标题（h2） */
export const Subtitle: React.FC<HeadingProps> = ({ children, className, id }) => (
  <h2 id={id} className={`${styles.subtitle} ${className ?? ''}`}>
    {children}
  </h2>
);

/** 三级标题（h3） */
export const Heading3: React.FC<HeadingProps> = ({ children, className, id }) => (
  <h3 id={id} className={`${styles.heading3} ${className ?? ''}`}>
    {children}
  </h3>
);

/** 四级标题（h4） */
export const Heading4: React.FC<HeadingProps> = ({ children, className, id }) => (
  <h4 id={id} className={`${styles.heading4} ${className ?? ''}`}>
    {children}
  </h4>
);
