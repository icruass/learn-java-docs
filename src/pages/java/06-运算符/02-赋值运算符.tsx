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
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>赋值运算符</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        赋值运算符负责把一个值存进变量。除了最基本的 <InlineCode>=</InlineCode>，
        还有 <InlineCode>+=</InlineCode>、<InlineCode>-=</InlineCode> 等复合赋值运算符。
        复合赋值运算符有一个极易被忽略的特性：<Text bold>自带隐式强制类型转换</Text>，
        这会导致 <InlineCode>b = b + 5</InlineCode> 与 <InlineCode>b += 5</InlineCode>
        在编译层面表现完全不同。
      </Paragraph>
    </Callout>

    <Heading3>1. 基本赋值运算符 =</Heading3>
    <Paragraph>
      <InlineCode>=</InlineCode> 把右边的值赋给左边的变量，
      <Text bold>从右往左结合</Text>（即先计算右边表达式，再赋给左边）。
    </Paragraph>
    <Callout type="danger" title="= 与 == 不要混淆">
      <InlineCode>=</InlineCode> 是<Text bold>赋值</Text>，把右边的值写进左边的变量。
      <InlineCode>==</InlineCode> 是<Text bold>判断相等</Text>，返回 boolean 结果。
      两者功能完全不同，混用是高频错误。
    </Callout>

    <Heading3>2. 复合赋值运算符</Heading3>
    <Table
      head={['运算符', '等价写法', '示例（a = 10）', '结果']}
      rows={[
        [<InlineCode>+=</InlineCode>, 'a = a + b', 'a += 3', 'a = 13'],
        [<InlineCode>-=</InlineCode>, 'a = a - b', 'a -= 3', 'a = 7'],
        [<InlineCode>*=</InlineCode>, 'a = a * b', 'a *= 3', 'a = 30'],
        [<InlineCode>/=</InlineCode>, 'a = a / b', 'a /= 3', 'a = 3'],
        [<InlineCode>%=</InlineCode>, 'a = a % b', 'a %= 3', 'a = 1'],
      ]}
    />
    <Paragraph>
      复合赋值是一种<Text bold>简写形式</Text>，<InlineCode>a += b</InlineCode>
      大多数情况下等价于 <InlineCode>a = a + b</InlineCode>。
      但"大多数情况"有一个重要例外：涉及类型转换时两者行为不同，见下文。
    </Paragraph>

    <Heading3>3. 重点：复合赋值自带隐式强制类型转换</Heading3>
    <Callout type="danger" title="byte b += 5 与 b = b + 5 的区别">
      <Paragraph>
        声明 <InlineCode>byte b = 10;</InlineCode> 之后：
      </Paragraph>
      <Paragraph>
        <InlineCode>b += 5;</InlineCode> — 编译通过。
        复合赋值运算符内部等价于 <InlineCode>b = (byte)(b + 5);</InlineCode>，
        即<Text bold>自动加了强制类型转换</Text>，结果 15 在 byte 范围内，没问题。
      </Paragraph>
      <Paragraph>
        <InlineCode>b = b + 5;</InlineCode> — <Text bold>编译报错</Text>。
        <InlineCode>b + 5</InlineCode> 中 b 被自动提升为 int，结果是 int 类型的 15，
        直接把 int 赋给 byte 会丢失精度，编译器拒绝。
        若想编译通过，必须显式强转：<InlineCode>b = (byte)(b + 5);</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading4>类型提升规则（快速回顾）</Heading4>
    <Paragraph>
      Java 进行算术运算时，<InlineCode>byte</InlineCode>、<InlineCode>short</InlineCode>、
      <InlineCode>char</InlineCode> 会被自动提升为 <InlineCode>int</InlineCode>，
      因此 <InlineCode>byte + int</InlineCode> 的结果是 <InlineCode>int</InlineCode>。
      复合赋值运算符通过内置的隐式强制转换绕过了这一限制，而普通的 <InlineCode>=</InlineCode> 不会自动转型。
    </Paragraph>

    <Heading3>4. 示例代码与控制台输出</Heading3>
    <CodeBlock
      title="AssignmentDemo.java"
      code={`public class AssignmentDemo {
    public static void main(String[] args) {
        // ---- 基本赋值 ----
        int a = 10;
        System.out.println(a); // 10

        // ---- 复合赋值 ----
        a += 5;
        System.out.println(a); // 15

        a -= 3;
        System.out.println(a); // 12

        a *= 2;
        System.out.println(a); // 24

        a /= 4;
        System.out.println(a); // 6

        a %= 4;
        System.out.println(a); // 2

        // ---- byte 的对比 ----
        byte b = 10;
        b += 5;                 // OK：复合赋值自带 (byte) 强转
        System.out.println(b);  // 15

        // b = b + 5;           // 编译错误：b+5 结果是 int，不能直接赋给 byte
        b = (byte)(b + 5);      // 显式强转后可以编译
        System.out.println(b);  // 20
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`10
15
12
24
6
2
15
20`}
    />

    <Heading3>5. 练习题</Heading3>
    <CodeBlock
      qa
      title="练习 1：预测复合赋值结果"
      code={`// 预测每个 println 的输出（先手算，不要运行）

public class Quiz1 {
    public static void main(String[] args) {
        int x = 20;
        x += 5;
        System.out.println(x);  // ?

        x -= 8;
        System.out.println(x);  // ?

        x *= 3;
        System.out.println(x);  // ?

        x /= 7;
        System.out.println(x);  // ?

        x %= 3;
        System.out.println(x);  // ?
    }
}`}
      answerCode={`初始 x = 20
x += 5   → x = 25，打印 25
x -= 8   → x = 17，打印 17
x *= 3   → x = 51，打印 51
x /= 7   → x = 7（整数截断：51 / 7 = 7），打印 7
x %= 3   → x = 1（7 % 3 = 1），打印 1`}
    />
    <CodeBlock
      qa
      title="练习 2：byte 的编译问题"
      code={`// 下面三行代码，哪行能编译通过？哪行会报错？请解释原因。

byte b = 100;
b += 10;            // 行 A
b = b + 10;         // 行 B
b = (byte)(b + 10); // 行 C`}
      answerCode={`行 A：b += 10        → 编译通过
  复合赋值运算符自带隐式强制类型转换，等价于 b = (byte)(b + 10)，合法。

行 B：b = b + 10     → 编译报错
  b + 10 中 b 被提升为 int，结果是 int 类型；
  把 int 直接赋给 byte 丢失精度，编译器报错：
  "不兼容的类型: 从 int 转换到 byte 可能会有损失"

行 C：b = (byte)(b + 10) → 编译通过
  加了显式强制类型转换 (byte)，告知编译器"我接受截断风险"，合法。

总结：复合赋值 += 隐含了强转，普通赋值 = 不会自动转型，两者有本质差别。`}
    />
  </article>
);

export default index;
