import React from 'react';
import {
  Title,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>注释</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        注释是写给<Text bold>人</Text>看的说明文字，编译器会<Text bold>直接忽略</Text>它——
        既不参与编译，也不会出现在运行结果里。它的作用是解释“这段代码在干嘛、为什么这么写”，
        是写出可读代码的基本功。Java 有三种注释，本节讲清它们的写法、区别和两个容易忽略的注意点。
      </Paragraph>
    </Callout>

    <Heading3>1. 三种注释</Heading3>
    <Table
      head={['类型', '写法', '用途']}
      rows={[
        [
          '单行注释',
          <InlineCode>// 注释内容</InlineCode>,
          '从 // 到本行末尾，最常用',
        ],
        [
          '多行注释',
          <InlineCode>/* 注释内容 */</InlineCode>,
          '可跨多行，从 /* 到 */ 之间全是注释',
        ],
        [
          '文档注释',
          <InlineCode>/** 注释内容 */</InlineCode>,
          '写在类/方法上方，可被 javadoc 工具提取成 API 文档',
        ],
      ]}
    />

    <Heading3>2. 三种注释各看一眼</Heading3>
    <CodeBlock
      title="CommentDemo.java"
      code={`/**
 * 文档注释：通常写在类或方法上方，描述它是干什么的。
 * 可以用 javadoc 工具生成成网页版 API 文档。
 *
 * @author 张三
 */
public class CommentDemo {
    public static void main(String[] args) {
        // 单行注释：解释下面这行在做什么
        System.out.println("Hello"); // 也可以跟在代码后面

        /*
           多行注释：
           适合写一大段说明，
           或临时把暂不需要的代码“注释掉”。
        */
        System.out.println("World");
    }
}`}
    />
    <Paragraph>运行结果（注释完全不影响输出）：</Paragraph>
    <CodeBlock language="text" title="控制台输出" code={`Hello
World`} />

    <Heading3>3. 两个必须知道的注意点</Heading3>
    <Callout type="danger" title="坑 1：多行注释不能嵌套">
      <Paragraph>
        <InlineCode>/* ... */</InlineCode> 内部<Text bold>不能再套一个</Text>
        <InlineCode>/* ... */</InlineCode>。因为编译器遇到<Text bold>第一个</Text>
        <InlineCode>*/</InlineCode> 就认为注释结束了，后面残留的 <InlineCode>*/</InlineCode>
        会变成无效代码导致报错。
      </Paragraph>
      <CodeBlock
        title="❌ 错误示范：嵌套多行注释"
        code={`/* 外层注释开始
   /* 内层注释 */   // ← 注释在这里就被判定结束了
   这行以及后面的 */ 会被当成代码，编译报错
*/`}
      />
    </Callout>
    <Callout type="warning" title="注意点 2：单行 // 只到行尾">
      <InlineCode>//</InlineCode> 的作用范围<Text bold>只到当前行末尾</Text>，下一行就不再是注释了。
      想注释多行，要么每行都加 <InlineCode>//</InlineCode>，要么用 <InlineCode>/* */</InlineCode>。
    </Callout>

    <Heading3>4. 注释的正确姿势</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>解释“为什么”，而不是复读“是什么”</Text>。
        例如 <InlineCode>i++; // i 加 1</InlineCode> 属于废话注释；
        <InlineCode>// 重试 3 次，避免偶发网络抖动</InlineCode> 才有价值。
      </ListItem>
      <ListItem>
        调试时可以用注释<Text bold>临时屏蔽</Text>某段代码，快速验证问题出在哪。
      </ListItem>
      <ListItem>
        关键的类、方法用<Text bold>文档注释</Text>，方便别人（和未来的你）快速看懂用法。
      </ListItem>
    </UnorderedList>

    <Heading3>5. 练习题</Heading3>
    <CodeBlock
      qa
      language="text"
      title="练习 1：判断输出"
      code={`问：下面这段代码运行后，控制台会打印什么？

public class Test {
    public static void main(String[] args) {
        // System.out.println("A");
        System.out.println("B"); /* System.out.println("C"); */
        System.out.println("D");
    }
}`}
      answerCode={`只会打印：
B
D

逐行分析：
  · "A" 被单行注释 // 屏蔽 —— 不执行；
  · "B" 正常执行 —— 打印 B；
  · "C" 整句被包在 /* ... */ 里 —— 不执行；
  · "D" 正常执行 —— 打印 D。

记住：被注释掉的代码 = 不存在，编译器看不见它。`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：这段代码为什么编译报错"
      code={`问：下面代码会编译报错，原因是什么？

/* 这是说明
   /* 补充说明 */
   继续说明 */
public class Demo { }`}
      answerCode={`原因：多行注释不能嵌套。

编译器从第一个 /* 开始进入注释，遇到第一个 */（“补充说明”后面那个）
就认为注释结束了。于是：
   继续说明 */
这部分被当成了普通代码，而 “继续说明 */” 不是合法的 Java 语句，
因此编译报错。

修复：去掉内层的 /* */，或整体改用其它写法，保证一对 /* */ 不互相嵌套。`}
    />
  </article>
);

export default index;
