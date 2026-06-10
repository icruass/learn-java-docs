import React from 'react';
import styles from './doc.less';

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

/** 主要内容文本 */
export const Paragraph: React.FC<ParagraphProps> = ({ children, className }) => (
  <p className={`${styles.paragraph} ${className ?? ''}`}>{children}</p>
);

/** 次要内容文本（说明、注释等，颜色更浅、字号略小） */
export const Secondary: React.FC<ParagraphProps> = ({ children, className }) => (
  <p className={`${styles.secondary} ${className ?? ''}`}>{children}</p>
);

/** 行内代码 */
export const InlineCode: React.FC<ParagraphProps> = ({ children, className }) => (
  <code className={`${styles.inlineCode} ${className ?? ''}`}>{children}</code>
);
