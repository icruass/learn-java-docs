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
    <Title>do-while 循环</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>do-while 循环</Text>是三种循环中最特殊的一种——它"<Text bold>先执行、后判断</Text>"，
        无论条件是否成立，循环体<Text bold>至少执行一次</Text>。这个特点让它在"必须先做一次"的场景下
        非常好用（如菜单交互、输入验证）。本节讲清语法、和 while 的区别，并通过对比示例直观感受两者不同。
      </Paragraph>
    </Callout>

    <Heading3>1. 语法格式</Heading3>
    <CodeBlock
      language="text"
      title="do-while 循环语法"
      code={`do {
    // 循环体：先执行，再判断条件
} while (循环条件);   // 注意：末尾有分号！`}
    />
    <Callout type="warning" title="末尾的分号不能省">
      do-while 语句的 <InlineCode>while(条件)</InlineCode> 后面<Text bold>必须跟一个分号</Text>。
      这是 do-while 区别于 while 的独特语法，漏写会编译报错。
    </Callout>

    <Paragraph>执行顺序：</Paragraph>
    <UnorderedList>
      <ListItem><Text bold>第一步：执行循环体</Text>（无条件，直接执行）。</ListItem>
      <ListItem><Text bold>第二步：判断条件</Text>，为 true 则回到第一步继续，为 false 则退出。</ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      title="do-while 执行顺序示意图"
      code={`   [执行循环体] ◄──────────────────────┐
         │                              │
         ▼                              │
   [判断条件]                           │
     │       │                          │
   false    true ──────────────────────┘
     │
     ▼
  退出循环`}
    />

    <Heading3>2. 示例一：do-while 基础示例</Heading3>
    <CodeBlock
      title="DoWhileDemo.java"
      code={`public class DoWhileDemo {
    public static void main(String[] args) {
        int i = 1;
        do {
            System.out.println("第 " + i + " 次执行");
            i++;
        } while (i <= 3);   // 判断在后
        System.out.println("循环结束，i = " + i);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`第 1 次执行
第 2 次执行
第 3 次执行
循环结束，i = 4`}
    />

    <Heading3>3. 与 while 的关键区别：条件初始为 false 时</Heading3>
    <Paragraph>
      当条件一开始就为 false 时，<Text bold>while 执行 0 次，do-while 执行 1 次</Text>。
      下面用同一个条件做对比：
    </Paragraph>
    <CodeBlock
      title="WhileVsDoWhile.java"
      code={`public class WhileVsDoWhile {
    public static void main(String[] args) {
        int x = 10;

        // while 版：条件 x < 5 初始就是 false，直接跳过
        System.out.println("=== while 版 ===");
        while (x < 5) {
            System.out.println("while 循环体执行，x = " + x);
            x++;
        }
        System.out.println("while 结束后 x = " + x);  // x 仍是 10

        x = 10; // 重置 x

        // do-while 版：先执行一次，再判断条件
        System.out.println("=== do-while 版 ===");
        do {
            System.out.println("do-while 循环体执行，x = " + x);
            x++;
        } while (x < 5);  // 执行后 x=11，11<5 为 false，退出
        System.out.println("do-while 结束后 x = " + x);  // x 是 11
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`=== while 版 ===
while 结束后 x = 10

=== do-while 版 ===
do-while 循环体执行，x = 10
do-while 结束后 x = 11`}
    />
    <Paragraph>
      结论非常清晰：同样的初始条件 <InlineCode>x = 10</InlineCode>、同样的循环条件
      <InlineCode>x &lt; 5</InlineCode>（初始为 false），while 循环体执行了 0 次，
      do-while 循环体执行了 1 次。
    </Paragraph>

    <Table
      head={['对比项', 'while', 'do-while']}
      rows={[
        ['判断时机', '先判断，后执行', '先执行，后判断'],
        ['最少执行次数', '0 次', '1 次'],
        ['条件初始为 false', '循环体不执行', '循环体执行一次'],
        ['末尾分号', '无', <><InlineCode>while(条件);</InlineCode> 末尾有分号</>],
        ['典型适用场景', '可能一次都不需要执行', '至少需要执行一次的场景'],
      ]}
    />

    <Heading3>4. do-while 的典型应用：输入验证</Heading3>
    <Paragraph>
      "先做一次，再根据结果决定是否重复"的场景非常适合 do-while，
      例如提示用户输入正数（必须至少提示一次）：
    </Paragraph>
    <CodeBlock
      title="InputValidation.java（示意）"
      code={`import java.util.Scanner;

public class InputValidation {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int num;
        do {
            System.out.print("请输入一个正整数：");
            num = sc.nextInt();
            if (num <= 0) {
                System.out.println("输入有误，请重新输入！");
            }
        } while (num <= 0);  // 输入不合法就继续提示
        System.out.println("您输入的正整数是：" + num);
    }
}`}
    />
    <Callout type="tip" title="do-while 在输入验证中最常用">
      用 while 做输入验证时，循环前必须先给 num 一个初始值来触发循环，写法比较别扭。
      do-while 直接"先提示一次"，逻辑更自然。
    </Callout>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己思考并动手写，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：用 do-while 打印 1~5"
      code={`// 要求：用 do-while 循环打印 1 到 5（每行一个数字）。

public class DoWhilePrint {
    public static void main(String[] args) {
        int i = 1;
        // 请在这里补全 do-while 循环
    }
}`}
      answerCode={`public class DoWhilePrint {
    public static void main(String[] args) {
        int i = 1;
        do {
            System.out.println(i);
            i++;
        } while (i <= 5);
    }
}

/* 控制台输出：
1
2
3
4
5
*/`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习 2：预测输出差异"
      code={`问：下面两段代码，各自会输出什么？请先预测，再对照答案。

// 代码 A（while）
int a = 5;
while (a < 5) {
    System.out.println("A 执行，a = " + a);
    a++;
}
System.out.println("A 结束，a = " + a);

// 代码 B（do-while）
int b = 5;
do {
    System.out.println("B 执行，b = " + b);
    b++;
} while (b < 5);
System.out.println("B 结束，b = " + b);`}
      answerCode={`代码 A 的输出：
A 结束，a = 5

代码 B 的输出：
B 执行，b = 5
B 结束，b = 6

分析：
  · 代码 A：初始 a=5，条件 a<5 立刻为 false，循环体一次都不执行。
    循环结束后 a 仍是 5。
  · 代码 B：do-while 先执行一次循环体（打印 b=5，然后 b 变成 6），
    再判断 6<5 为 false，退出循环。最终 b=6。

关键差异：同样的初始值 5、同样的条件 b<5，
  while  → 0 次执行
  do-while → 1 次执行`}
    />
  </article>
);

export default index;
