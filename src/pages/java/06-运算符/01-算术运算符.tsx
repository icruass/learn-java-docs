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
    <Title>算术运算符</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        算术运算符是最基础的运算，包括加减乘除、取余，以及自增自减。
        看起来简单，但<Text bold>整数除法截断</Text>、<Text bold>除以零的行为</Text>和
        <Text bold>自增自减的前缀/后缀区别</Text>是新手最常出错的地方，本节逐一讲透。
      </Paragraph>
    </Callout>

    <Heading3>1. 基本算术运算符</Heading3>
    <Table
      head={['运算符', '名称', '示例', '结果']}
      rows={[
        [<InlineCode>+</InlineCode>, '加法', <InlineCode>3 + 2</InlineCode>, '5'],
        [<InlineCode>-</InlineCode>, '减法', <InlineCode>3 - 2</InlineCode>, '1'],
        [<InlineCode>*</InlineCode>, '乘法', <InlineCode>3 * 2</InlineCode>, '6'],
        [<InlineCode>/</InlineCode>, '除法', <InlineCode>7 / 2</InlineCode>, '3（整数截断）'],
        [<InlineCode>%</InlineCode>, '取余（取模）', <InlineCode>7 % 2</InlineCode>, '1'],
      ]}
    />

    <Heading4>整数除法：结果截断，不四舍五入</Heading4>
    <Paragraph>
      两个整数相除，结果仍是整数，<Text bold>小数部分直接丢弃</Text>（不是四舍五入）。
      例如 <InlineCode>7 / 2</InlineCode> 得 <InlineCode>3</InlineCode> 而不是 3.5。
      如果需要小数结果，至少有一个操作数是浮点数即可：
      <InlineCode>7.0 / 2</InlineCode> 或 <InlineCode>7 / 2.0</InlineCode> 均得 3.5。
    </Paragraph>

    <Heading4>取余：余数符号跟被除数</Heading4>
    <Paragraph>
      Java 中 <InlineCode>%</InlineCode> 的余数符号与<Text bold>被除数</Text>相同：
    </Paragraph>
    <UnorderedList>
      <ListItem><InlineCode>7 % 2</InlineCode> → <InlineCode>1</InlineCode>（被除数正，余数正）</ListItem>
      <ListItem><InlineCode>-7 % 2</InlineCode> → <InlineCode>-1</InlineCode>（被除数负，余数负）</ListItem>
      <ListItem><InlineCode>7 % -2</InlineCode> → <InlineCode>1</InlineCode>（被除数正，余数正）</ListItem>
    </UnorderedList>

    <Heading4>除以零的行为</Heading4>
    <Table
      head={['类型', '操作', '结果']}
      rows={[
        ['整数', <InlineCode>5 / 0</InlineCode>, '运行时抛出 ArithmeticException（程序崩溃）'],
        ['浮点数', <InlineCode>5.0 / 0.0</InlineCode>, '得到 Infinity（不抛异常）'],
        ['浮点数', <InlineCode>0.0 / 0.0</InlineCode>, '得到 NaN（Not a Number，不抛异常）'],
      ]}
    />
    <Callout type="danger" title="整数除以 0 会崩溃">
      <InlineCode>int x = 5 / 0;</InlineCode> 会在运行时抛出
      <InlineCode>java.lang.ArithmeticException: / by zero</InlineCode>。
      浮点除以 0.0 不会抛异常，而是得到特殊值 <InlineCode>Infinity</InlineCode> 或
      <InlineCode>NaN</InlineCode>。两者行为完全不同，务必区分。
    </Callout>

    <Heading4>+ 也用于字符串拼接</Heading4>
    <Paragraph>
      当 <InlineCode>+</InlineCode> 的任意一侧是字符串时，Java 会把另一侧转成字符串再拼接：
      <InlineCode>"分数：" + 90</InlineCode> 结果是字符串 <InlineCode>"分数：90"</InlineCode>。
    </Paragraph>

    <Heading3>2. 自增自减运算符</Heading3>
    <Paragraph>
      <InlineCode>++</InlineCode> 让变量加 1，<InlineCode>--</InlineCode> 让变量减 1。
      关键在于<Text bold>前缀</Text>（<InlineCode>++i</InlineCode>）和
      <Text bold>后缀</Text>（<InlineCode>i++</InlineCode>）的区别：
    </Paragraph>
    <Table
      head={['写法', '执行顺序', '示例', '结果']}
      rows={[
        [
          <InlineCode>++i</InlineCode>,
          '先自增，再取值',
          'int c = 5; int d = ++c;',
          'd = 6，c = 6',
        ],
        [
          <InlineCode>i++</InlineCode>,
          '先取值，再自增',
          'int a = 5; int b = a++;',
          'b = 5，a = 6',
        ],
      ]}
    />
    <Callout type="tip" title="单独成行时无区别">
      如果 <InlineCode>i++</InlineCode> 或 <InlineCode>++i</InlineCode> 单独一行（不在表达式中），
      两者效果完全相同，都只是让 i 加 1。区别只在它们<Text bold>作为表达式的一部分</Text>、
      其返回值被使用的时候。
    </Callout>

    <Heading3>3. 示例代码与控制台输出</Heading3>
    <CodeBlock
      title="ArithmeticDemo.java"
      code={`public class ArithmeticDemo {
    public static void main(String[] args) {
        // ---- 基本运算 ----
        System.out.println(7 + 2);   // 9
        System.out.println(7 - 2);   // 5
        System.out.println(7 * 2);   // 14
        System.out.println(7 / 2);   // 3  （整数截断）
        System.out.println(7.0 / 2); // 3.5（浮点除法）
        System.out.println(7 % 2);   // 1
        System.out.println(-7 % 2);  // -1 （余数符号跟被除数）

        // ---- 除以零 ----
        System.out.println(5.0 / 0.0); // Infinity
        System.out.println(0.0 / 0.0); // NaN
        // int bad = 5 / 0;            // 取消注释会抛 ArithmeticException

        // ---- 字符串拼接 ----
        System.out.println("分数：" + 90); // 分数：90

        // ---- 自增自减 ----
        int a = 5;
        int b = a++;   // b 取到 a 的旧值 5，然后 a 变为 6
        System.out.println("b=" + b + ", a=" + a); // b=5, a=6

        int c = 5;
        int d = ++c;   // c 先变为 6，b 取到新值 6
        System.out.println("d=" + d + ", c=" + c); // d=6, c=6

        // ---- 单独成行：前后缀无区别 ----
        int x = 10;
        x++;
        System.out.println(x); // 11
        ++x;
        System.out.println(x); // 12
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`9
5
14
3
3.5
1
-1
Infinity
NaN
分数：90
b=5, a=6
d=6, c=6
11
12`}
    />
    <Paragraph>
      逐行核对要点：<InlineCode>7 / 2</InlineCode> 输出 3（不是 3.5）；
      <InlineCode>-7 % 2</InlineCode> 输出 -1（符号随被除数）；
      <InlineCode>b = a++</InlineCode> 时 b 拿到旧值 5；
      <InlineCode>d = ++c</InlineCode> 时 d 拿到自增后的新值 6。
    </Paragraph>

    <Heading3>4. 进阶陷阱：int i = 1; i = i++;</Heading3>
    <Paragraph>
      这是一道经典题目，结果出乎很多人意料：
    </Paragraph>
    <CodeBlock
      title="TrickyIncrement.java"
      code={`public class TrickyIncrement {
    public static void main(String[] args) {
        int i = 1;
        i = i++;           // 看起来像 i 变成 2，实际上 i 仍为 1
        System.out.println(i); // 1
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`1`}
    />
    <Callout type="warning" title="为什么 i = i++ 之后 i 仍为 1？">
      <Paragraph>
        <InlineCode>i++</InlineCode> 是后缀自增：先把 i 的<Text bold>旧值 1</Text> 作为表达式结果，
        然后 i 自增变为 2。但紧接着 <InlineCode>i = ...</InlineCode> 把那个旧值 1
        <Text bold>重新赋给了 i</Text>，覆盖掉了刚才自增的结果。
        所以最终 i 仍是 1。
      </Paragraph>
      <Paragraph>
        实际工作中不应该写这种表达式。理解它是为了看懂别人代码、不踩坑，
        自己写代码时应把自增单独成行：先 <InlineCode>i++;</InlineCode>，再另起一行赋值。
      </Paragraph>
    </Callout>

    <Heading3>5. 练习题</Heading3>
    <CodeBlock
      qa
      title="练习 1：预测输出"
      code={`// 阅读下面代码，预测每行打印的结果（不要运行，先用纸算）

public class Quiz1 {
    public static void main(String[] args) {
        System.out.println(10 / 3);
        System.out.println(10 % 3);
        System.out.println(-10 % 3);
        System.out.println(1.0 / 0.0);

        int m = 7;
        int n = m--;
        System.out.println("n=" + n + ", m=" + m);

        int p = 7;
        int q = --p;
        System.out.println("q=" + q + ", p=" + p);
    }
}`}
      answerCode={`10 / 3   → 3    （整数截断，不是 3.33...）
10 % 3   → 1
-10 % 3  → -1   （余数符号跟被除数 -10，所以是负数）
1.0/0.0  → Infinity

int m = 7; int n = m--;
  → n 先取旧值 7，m 再减为 6
  → 打印：n=7, m=6

int p = 7; int q = --p;
  → p 先减为 6，q 取新值 6
  → 打印：q=6, p=6`}
    />
    <CodeBlock
      qa
      title="练习 2：经典陷阱题"
      code={`// 下面两段代码运行后，i 和 j 各是多少？

// 片段 A
int i = 3;
i = i++;
System.out.println(i); // i = ?

// 片段 B
int j = 3;
j = ++j;
System.out.println(j); // j = ?`}
      answerCode={`片段 A：i = 3
  i++ 先返回旧值 3，再让 i 自增到 4；
  但 i = 3 这条赋值又把 3 覆盖写回去，所以 i 最终仍是 3。

片段 B：j = 4
  ++j 先让 j 自增到 4，再返回 4；
  j = 4 赋值的就是自增后的新值，所以 j 是 4。

关键区别：
  i++ 返回旧值（自增发生在赋值之前，但旧值已被捕获）
  ++j 返回新值（赋值拿到的是自增后的结果）`}
    />
  </article>
);

export default index;
