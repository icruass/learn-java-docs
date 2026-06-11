import React from 'react';
import {
  Title,
  Heading3,
  Heading4,
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
    <Title>三元运算符</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        三元运算符（也叫条件运算符）是 Java 里唯一一个需要三个操作数的运算符。
        它是 <InlineCode>if-else</InlineCode> 的简洁替代，适合在赋值或打印时
        <Text bold>根据条件返回两个值之一</Text>。
        本节讲清语法格式、使用限制，以及嵌套三元的写法。
      </Paragraph>
    </Callout>

    <Heading3>1. 语法格式</Heading3>
    <CodeBlock
      language="text"
      title="三元运算符格式"
      code={`条件表达式 ? 值1 : 值2`}
    />
    <Table
      head={['部分', '说明']}
      rows={[
        ['条件表达式', '结果必须是 boolean 类型'],
        ['值1', '条件为 true 时，整个表达式的值'],
        ['值2', '条件为 false 时，整个表达式的值'],
      ]}
    />
    <Paragraph>
      三元运算符是一个<Text bold>表达式</Text>，有返回值，
      这个值必须被使用——赋给变量或直接打印。
      不能像语句一样单独写一行什么也不做。
    </Paragraph>
    <Callout type="warning" title="值1 和值2 的类型必须兼容">
      编译器需要确定整个表达式的类型，因此 <InlineCode>?</InlineCode> 两侧的类型必须兼容。
      例如 <InlineCode>true ? 1 : "hello"</InlineCode> 会编译报错，
      因为 int 和 String 不兼容。
    </Callout>

    <Heading3>2. 执行过程</Heading3>
    <UnorderedList>
      <ListItem>先计算条件表达式。</ListItem>
      <ListItem>若条件为 <InlineCode>true</InlineCode>，计算并返回<Text bold>值1</Text>，值2 不执行。</ListItem>
      <ListItem>若条件为 <InlineCode>false</InlineCode>，计算并返回<Text bold>值2</Text>，值1 不执行。</ListItem>
    </UnorderedList>

    <Heading3>3. 典型用法</Heading3>
    <Heading4>求两数最大值</Heading4>
    <CodeBlock
      title="MaxValue.java"
      code={`public class MaxValue {
    public static void main(String[] args) {
        int a = 8, b = 13;
        int max = a > b ? a : b;
        System.out.println("最大值：" + max); // 最大值：13
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`最大值：13`} />

    <Heading4>判断奇偶</Heading4>
    <CodeBlock
      title="OddEven.java"
      code={`public class OddEven {
    public static void main(String[] args) {
        int n = 7;
        String result = n % 2 == 0 ? "偶数" : "奇数";
        System.out.println(n + " 是" + result); // 7 是奇数

        n = 4;
        System.out.println(n + " 是" + (n % 2 == 0 ? "偶数" : "奇数")); // 4 是偶数
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`7 是奇数
4 是偶数`} />

    <Heading4>嵌套三元：求三数最大值</Heading4>
    <Paragraph>
      三元运算符可以嵌套，但建议<Text bold>最多嵌套一层</Text>，层数过多可读性会急剧下降。
    </Paragraph>
    <CodeBlock
      title="MaxOfThree.java"
      code={`public class MaxOfThree {
    public static void main(String[] args) {
        int a = 5, b = 12, c = 9;
        // 先求 a 和 b 的最大值，再与 c 比较
        int max = a > b ? (a > c ? a : c) : (b > c ? b : c);
        System.out.println("三数最大值：" + max); // 三数最大值：12
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`三数最大值：12`} />
    <Callout type="tip" title="嵌套三元可读性差">
      嵌套超过一层时，强烈建议改用 <InlineCode>if-else</InlineCode> 语句，
      更清晰，出错率更低。三元运算符最适合<Text bold>简单的二选一场景</Text>。
    </Callout>

    <Heading3>4. 不能单独成句</Heading3>
    <CodeBlock
      title="WrongUsage.java（演示错误）"
      code={`public class WrongUsage {
    public static void main(String[] args) {
        int x = 5;

        // 错误：三元表达式的结果没有被使用
        // x > 3 ? System.out.println("大") : System.out.println("小");
        // 编译器报错：不是语句

        // 正确：把结果赋给变量或直接打印
        String msg = x > 3 ? "大" : "小";
        System.out.println(msg); // 大

        // 或者直接在 println 里用
        System.out.println(x > 3 ? "大" : "小"); // 大
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`大
大`} />

    <Heading3>5. 练习题</Heading3>
    <CodeBlock
      qa
      title="练习 1：用三元运算符判断正负零"
      code={`// 要求：给定 int n，用三元运算符（可嵌套一次）
// 打印 "正数"、"负数" 或 "零"

public class Quiz1 {
    public static void main(String[] args) {
        int n = -5;
        String label = /* 在这里补全三元表达式 */;
        System.out.println(n + " 是" + label);
    }
}`}
      answerCode={`public class Quiz1 {
    public static void main(String[] args) {
        int n = -5;
        String label = n > 0 ? "正数" : (n < 0 ? "负数" : "零");
        System.out.println(n + " 是" + label); // -5 是负数
    }
}

// 验证三种情况：
// n =  5 → 正数
// n = -5 → 负数
// n =  0 → 零`}
    />
    <CodeBlock
      qa
      title="练习 2：预测输出并解释"
      code={`// 预测每行打印什么，并解释三元运算符的执行过程

public class Quiz2 {
    public static void main(String[] args) {
        int a = 10, b = 20;

        System.out.println(a > b ? a : b);                  // ?
        System.out.println(a == 10 ? "等于十" : "不等于十"); // ?

        // 嵌套三元：求绝对值
        int n = -8;
        int abs = n >= 0 ? n : -n;
        System.out.println("绝对值：" + abs);               // ?

        // 奇偶判断
        int x = 6;
        System.out.println(x % 2 == 0 ? "偶" : "奇");       // ?
    }
}`}
      answerCode={`a > b ? a : b
  a=10, b=20，10 > 20 为 false，取值2（b=20）
  → 打印 20

a == 10 ? "等于十" : "不等于十"
  10 == 10 为 true，取值1
  → 打印 等于十

n >= 0 ? n : -n，n=-8
  -8 >= 0 为 false，取值2（-n = -(-8) = 8）
  → 打印 绝对值：8

x % 2 == 0 ? "偶" : "奇"，x=6
  6 % 2 == 0 为 true，取值1
  → 打印 偶`}
    />
  </article>
);

export default index;
