import React from 'react';

export interface TextProps {
  children: React.ReactNode;
  /** 自定义颜色：可传 CSS 颜色值，或 'accent' 使用主题强调色 */
  color?: string;
  /** 快捷开启强调色（等价 color="accent"） */
  accent?: boolean;
  /** 加粗 */
  bold?: boolean;
  /** 斜体 */
  italic?: boolean;
  /** 下划线 */
  underline?: boolean;
  /**
   * 相对字号：
   *  - 数字 => 相对倍数（1.2 表示 1.2em）
   *  - 字符串 => 原样作为 font-size（如 "14px"）
   */
  size?: number | string;
  /** 渲染的标签，默认 span */
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 通用文本组件：支持动态调整 颜色/强调色、加粗、斜体、相对字号、下划线。
 * 文档正文中需要内联强调某段文字时使用。
 *
 * <Text accent bold>重点</Text>
 * <Text size={1.2} italic>放大的斜体</Text>
 * <Text color="#22c55e" underline>成功</Text>
 */
const Text: React.FC<TextProps> = ({
  children,
  color,
  accent,
  bold,
  italic,
  underline,
  size,
  as,
  className,
  style,
}) => {
  const Tag = as || 'span';

  const resolvedColor = accent ? 'var(--color-accent)' : color;
  const fontSize =
    typeof size === 'number' ? `${size}em` : size || undefined;

  const computedStyle: React.CSSProperties = {
    // 单词过长时强制换行，避免超出屏幕
    wordBreak: 'break-all',
    color: resolvedColor,
    fontWeight: bold ? 700 : undefined,
    fontStyle: italic ? 'italic' : undefined,
    textDecoration: underline ? 'underline' : undefined,
    fontSize,
    ...style,
  };

  return (
    <Tag className={className} style={computedStyle}>
      {children}
    </Tag>
  );
};

export default Text;
