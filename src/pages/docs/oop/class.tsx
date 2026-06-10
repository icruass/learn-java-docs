import React from 'react';
import { Title, Paragraph, Subtitle, CodeBlock, Tag } from '@/components/doc';

const code = `public class Dog {
    private String name;        // 字段

    public Dog(String name) {   // 构造方法
        this.name = name;
    }

    public void bark() {        // 方法
        System.out.println(name + " says: Woof!");
    }
}

Dog d = new Dog("Buddy");
d.bark();`;

const ClassPage: React.FC = () => (
  <article>
    <Tag>面向对象</Tag>
    <Title>类与对象</Title>
    <Paragraph>
      类是对象的模板，定义了字段（状态）与方法（行为）。通过 new 关键字基于类创建对象实例。
    </Paragraph>
    <Subtitle>定义一个类</Subtitle>
    <CodeBlock code={code} language="java" title="Dog.java" />
  </article>
);

export default ClassPage;
