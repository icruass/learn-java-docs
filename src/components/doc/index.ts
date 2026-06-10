/**
 * 文档内容组件统一出口。
 * 页面里这样使用：
 *   import { Title, Subtitle, Paragraph, Text, Tag, CodeBlock, Table, Callout } from '@/components/doc';
 */
export { default as Text } from './Text';
export type { TextProps } from './Text';
export { Title, Subtitle, Heading3, Heading4 } from './Headings';
export { Paragraph, Secondary, InlineCode } from './Paragraph';
export { default as Tag } from './Tag';
export { default as CodeBlock } from './CodeBlock';
export type { CodeBlockProps } from './CodeBlock';
export { default as Callout } from './Callout';
export type { CalloutType } from './Callout';
export { default as Table } from './Table';
export { UnorderedList, OrderedList, ListItem } from './List';
export { default as Divider } from './Divider';
export { default as DocLink } from './DocLink';
