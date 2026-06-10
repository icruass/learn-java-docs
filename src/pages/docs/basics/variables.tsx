import React from 'react';
import { Title, Paragraph, Subtitle, CodeBlock, Tag } from '@/components/doc';

const code = `int age = 25;            // 整型
double price = 9.99;     // 双精度浮点
char grade = 'A';        // 字符
boolean active = true;   // 布尔
String name = "Java";    // 字符串（引用类型）`;

const Variables: React.FC = () => (
  <article>
    <Tag>Java 基础</Tag>
    <Title>变量与数据类型</Title>
    <Paragraph>
      Java 是强类型语言，每个变量都必须先声明类型。基本数据类型包括整型、浮点型、字符型和布尔型。
    </Paragraph>
    <Subtitle>常见类型示例</Subtitle>
    <CodeBlock code={code} language="java" />
  </article>
);

export default Variables;
