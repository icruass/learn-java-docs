import React from 'react';
import { Title, Paragraph, Subtitle, CodeBlock, Tag } from '@/components/doc';

const code = `class Animal {
    public void speak() {
        System.out.println("Some sound");
    }
}

class Cat extends Animal {
    @Override
    public void speak() {       // 多态：重写父类方法
        System.out.println("Meow");
    }
}

Animal a = new Cat();
a.speak();  // 输出 Meow`;

const Inheritance: React.FC = () => (
  <article>
    <Tag>面向对象</Tag>
    <Title>继承与多态</Title>
    <Paragraph>
      子类通过 extends 继承父类的字段与方法，并可重写（Override）父类方法实现多态。
    </Paragraph>
    <Subtitle>继承与方法重写</Subtitle>
    <CodeBlock code={code} language="java" />
  </article>
);

export default Inheritance;
