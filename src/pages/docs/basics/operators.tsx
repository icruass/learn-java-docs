import React from 'react';
import { Title, Paragraph, Subtitle, CodeBlock, Tag } from '@/components/doc';

const code = `int a = 10, b = 3;
System.out.println(a + b);  // 13
System.out.println(a - b);  // 7
System.out.println(a * b);  // 30
System.out.println(a / b);  // 3（整数除法）
System.out.println(a % b);  // 1（取余）`;

const Operators: React.FC = () => (
  <article>
    <Tag>Java 基础</Tag>
    <Title>运算符</Title>
    <Paragraph>
      Java 提供算术、关系、逻辑、位等多类运算符。下面演示最常用的算术运算符。
    </Paragraph>
    <Subtitle>算术运算符</Subtitle>
    <CodeBlock code={code} language="java" />
  </article>
);

export default Operators;
