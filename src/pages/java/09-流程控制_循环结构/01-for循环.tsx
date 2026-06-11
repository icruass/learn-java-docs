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
    <Title>for 循环</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>for 循环</Text>是 Java 中使用最频繁的循环结构，尤其适合<Text bold>循环次数已知</Text>的场景。
        本节讲清语法格式、执行顺序（这是理解 for 循环的核心），再给出两个经典例子，最后罗列两个新手
        最容易踩的坑。
      </Paragraph>
    </Callout>

    <Heading3>1. 语法格式</Heading3>
    <Paragraph>
      for 循环的完整语法如下，共有三个控制部分，用英文分号隔开：
    </Paragraph>
    <CodeBlock
      language="text"
      title="for 循环语法"
      code={`for (初始化语句; 循环条件; 迭代语句) {
    // 循环体：每次条件为 true 时执行
}`}
    />
    <Table
      head={['部分', '说明', '示例']}
      rows={[
        ['初始化语句', '循环开始前执行一次，通常声明并初始化循环变量', <InlineCode>int i = 0</InlineCode>],
        ['循环条件', '布尔表达式，每次循环前判断；为 true 则继续，为 false 则退出', <InlineCode>i &lt; 5</InlineCode>],
        ['迭代语句', '每次循环体执行完毕后执行，通常用来更新循环变量', <InlineCode>i++</InlineCode>],
      ]}
    />

    <Heading3>2. 执行顺序（最重要）</Heading3>
    <Paragraph>
      理解执行顺序是掌握 for 循环的关键。顺序如下：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>第一步：初始化语句</Text>，只执行<Text bold>一次</Text>，在整个循环开始之前运行。
      </ListItem>
      <ListItem>
        <Text bold>第二步：判断循环条件</Text>，为 <InlineCode>true</InlineCode> 则继续，为
        <InlineCode>false</InlineCode> 则立即退出循环。
      </ListItem>
      <ListItem>
        <Text bold>第三步：执行循环体</Text>，即花括号内的语句。
      </ListItem>
      <ListItem>
        <Text bold>第四步：执行迭代语句</Text>（如 <InlineCode>i++</InlineCode>），然后跳回第二步再次判断条件。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      title="执行顺序示意图"
      code={`   ┌──────────────────────────────────────────────┐
   │  for (初始化; 条件; 迭代)                       │
   └──────────────────────────────────────────────┘
         │
         ▼
   [初始化语句] ──只执行一次──┐
         │                    │
         ▼                    │
   [判断条件]◄────────────────┘
     │       │
   false    true
     │       │
     ▼       ▼
  退出循环  [执行循环体]
              │
              ▼
          [执行迭代语句]
              │
              └──────────► 回到 [判断条件]`}
    />

    <Heading3>3. 示例一：求 1 到 100 的和</Heading3>
    <CodeBlock
      title="Sum1To100.java"
      code={`public class Sum1To100 {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;   // 每次把 i 累加到 sum
        }
        System.out.println("1 到 100 的和为：" + sum);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`1 到 100 的和为：5050`}
    />
    <Paragraph>
      执行过程：<InlineCode>i</InlineCode> 从 <InlineCode>1</InlineCode> 开始，每次加 1，当
      <InlineCode>i</InlineCode> 变成 <InlineCode>101</InlineCode> 时条件
      <InlineCode>i &lt;= 100</InlineCode> 为 <InlineCode>false</InlineCode>，循环结束。
      累加了 1+2+3+…+100 = 5050。
    </Paragraph>

    <Heading3>4. 示例二：打印 1 到 5</Heading3>
    <CodeBlock
      title="Print1To5.java"
      code={`public class Print1To5 {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("当前数字：" + i);
        }
        System.out.println("循环结束");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`当前数字：1
当前数字：2
当前数字：3
当前数字：4
当前数字：5
循环结束`}
    />

    <Heading3>5. 特别注意点</Heading3>

    <Heading4>① for 语句后面误加分号</Heading4>
    <Callout type="danger" title="坑：for(...); 让循环体变成空语句">
      <Paragraph>
        for 循环的括号后面<Text bold>绝不能加分号</Text>，否则分号本身成为循环体（空语句），
        真正的花括号代码块只执行一次，而且循环变量的值已经是循环结束后的值。
      </Paragraph>
      <CodeBlock
        title="错误示范（加了多余的分号）"
        code={`// 错误：for 后面多了一个分号
for (int i = 1; i <= 5; i++);   // ← 这个分号就是循环体（空语句）
{
    System.out.println(i);       // 编译报错：i 在这里已超出作用域
}`}
      />
      <CodeBlock
        title="正确写法"
        code={`for (int i = 1; i <= 5; i++) {   // 括号后紧跟 {，无分号
    System.out.println(i);
}`}
      />
    </Callout>

    <Heading4>② 循环变量的作用域</Heading4>
    <Callout type="warning" title="循环变量仅在 for 内部有效">
      在 for 括号的初始化语句中声明的变量（如 <InlineCode>int i = 0</InlineCode>），
      其<Text bold>作用域仅限于 for 循环内部</Text>。循环结束后，该变量不再存在，
      若在循环外使用会编译报错。
      <CodeBlock
        title="作用域示例"
        code={`for (int i = 0; i < 3; i++) {
    System.out.println(i);   // 合法
}
// System.out.println(i);    // 编译报错：找不到符号 i`}
      />
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考并动手写，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：求 1~100 的偶数和"
      code={`// 要求：用 for 循环求 1~100 中所有偶数的和，并输出结果。
// 提示：偶数满足 i % 2 == 0

public class EvenSum {
    public static void main(String[] args) {
        int sum = 0;
        // 请在这里补全代码

        System.out.println("1~100 偶数和：" + sum);
    }
}`}
      answerCode={`public class EvenSum {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            if (i % 2 == 0) {
                sum += i;
            }
        }
        System.out.println("1~100 偶数和：" + sum);
    }
}

/* 控制台输出：
1~100 偶数和：2550

解析：偶数为 2, 4, 6, ..., 100，共 50 个，
      等差数列求和 = (2 + 100) * 50 / 2 = 2550
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：打印 1~n（n 由变量指定）"
      code={`// 要求：定义变量 n = 7，用 for 循环打印从 1 到 n 的所有整数（每行一个）。

public class Print1ToN {
    public static void main(String[] args) {
        int n = 7;
        // 请在这里补全代码
    }
}`}
      answerCode={`public class Print1ToN {
    public static void main(String[] args) {
        int n = 7;
        for (int i = 1; i <= n; i++) {
            System.out.println(i);
        }
    }
}

/* 控制台输出：
1
2
3
4
5
6
7
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：求 n 的阶乘"
      code={`// 要求：定义变量 n = 6，用 for 循环求 n!（n 的阶乘），并输出结果。
// 阶乘定义：n! = 1 × 2 × 3 × ... × n，规定 0! = 1

public class Factorial {
    public static void main(String[] args) {
        int n = 6;
        long result = 1;   // 用 long 防止大数溢出
        // 请在这里补全代码

        System.out.println(n + "! = " + result);
    }
}`}
      answerCode={`public class Factorial {
    public static void main(String[] args) {
        int n = 6;
        long result = 1;
        for (int i = 2; i <= n; i++) {  // 从 2 开始，乘到 n
            result *= i;
        }
        System.out.println(n + "! = " + result);
    }
}

/* 控制台输出：
6! = 720

解析：6! = 1×2×3×4×5×6 = 720
      循环变量 i 从 2 到 6，依次乘进 result：
        i=2: result=2
        i=3: result=6
        i=4: result=24
        i=5: result=120
        i=6: result=720
*/`}
    />
  </article>
);

export default index;
