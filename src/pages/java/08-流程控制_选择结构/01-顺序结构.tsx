import React from 'react';
import {
  Title,
  Heading3,
  Heading4,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>顺序结构</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        顺序结构是程序的<Text bold>最基础的执行方式</Text>——代码从第一行到最后一行，
        按书写顺序<Text bold>逐条执行，不跳过、不重复、不分叉</Text>。
        它是所有流程控制的基础，后续的选择结构和循环结构也都是在顺序结构之上叠加的。
        本节通过两个例子讲清顺序结构的本质，并特别强调"语句先后顺序会影响结果"这一常见坑。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是顺序结构</Heading3>
    <Paragraph>
      顺序结构（Sequential Structure）是指程序按照代码的<Text bold>书写顺序</Text>，
      从上到下依次执行每一条语句。每条语句执行完毕后，自动跳到下一条，直到所有语句执行完毕。
    </Paragraph>
    <Paragraph>
      在没有 <InlineCode>if</InlineCode>、<InlineCode>for</InlineCode> 等控制语句的情况下，
      Java 程序天然就是顺序结构。我们之前写的每一个 <InlineCode>HelloWorld</InlineCode> 都是顺序结构。
    </Paragraph>
    <Callout type="tip" title="顺序结构的执行特点">
      <UnorderedList>
        <ListItem>第 1 行执行完，才执行第 2 行；第 2 行执行完，才执行第 3 行……</ListItem>
        <ListItem>每条语句都会且只会执行一次（在本次运行中）。</ListItem>
        <ListItem>执行顺序与<Text bold>代码书写顺序完全一致</Text>，上下换行就会改变结果。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>2. 示例一：顺序打印</Heading3>
    <Paragraph>
      最直观的例子：三条打印语句，输出顺序与代码顺序一致。
    </Paragraph>
    <CodeBlock
      title="SequentialDemo.java"
      code={`public class SequentialDemo {
    public static void main(String[] args) {
        System.out.println("第一步：准备材料");
        System.out.println("第二步：开始烹饪");
        System.out.println("第三步：装盘上桌");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`第一步：准备材料
第二步：开始烹饪
第三步：装盘上桌`} />
    <Paragraph>
      输出顺序与代码顺序完全一致。如果把第三行和第一行的 <InlineCode>println</InlineCode> 对调，
      打印顺序也会随之对调——这就是顺序结构"代码顺序即执行顺序"的体现。
    </Paragraph>

    <Heading3>3. 示例二：借助第三个变量交换两个变量的值</Heading3>
    <Paragraph>
      这是顺序结构里的<Text bold>经典例题</Text>。需求：把变量 <InlineCode>a</InlineCode> 和
      <InlineCode>b</InlineCode> 的值互换。
      直接写 <InlineCode>a = b; b = a;</InlineCode> 是行不通的——执行第一句后 <InlineCode>a</InlineCode>
      的原始值就被覆盖了，第二句再把已经变成 <InlineCode>b</InlineCode> 值的 <InlineCode>a</InlineCode>
      赋给 <InlineCode>b</InlineCode>，结果两个变量都等于 <InlineCode>b</InlineCode> 的初始值。
      正确做法是先用第三个变量 <InlineCode>temp</InlineCode> 保存其中一个值：
    </Paragraph>
    <CodeBlock
      title="SwapDemo.java"
      code={`public class SwapDemo {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;

        System.out.println("交换前：a = " + a + "，b = " + b);

        // 第一步：把 a 的值存入临时变量 temp，防止被覆盖
        int temp = a;   // temp = 10, a = 10, b = 20
        // 第二步：把 b 的值赋给 a
        a = b;          // temp = 10, a = 20, b = 20
        // 第三步：把 temp（原来的 a）赋给 b
        b = temp;       // temp = 10, a = 20, b = 10

        System.out.println("交换后：a = " + a + "，b = " + b);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`交换前：a = 10，b = 20
交换后：a = 20，b = 10`} />

    <Heading4>逐步拆解：每一步的内存状态</Heading4>
    <Paragraph>
      三步操作的顺序<Text bold>不能乱</Text>，逻辑如下：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>int temp = a;</InlineCode>——把 <InlineCode>a</InlineCode> 的值（10）先"备份"到
        <InlineCode>temp</InlineCode>，此时 a=10、b=20、temp=10。
      </ListItem>
      <ListItem>
        <InlineCode>a = b;</InlineCode>——把 <InlineCode>b</InlineCode> 的值（20）写入
        <InlineCode>a</InlineCode>，此时 a=20、b=20、temp=10。
      </ListItem>
      <ListItem>
        <InlineCode>b = temp;</InlineCode>——把备份的原始值（10）写入 <InlineCode>b</InlineCode>，
        此时 a=20、b=10、temp=10。交换完成。
      </ListItem>
    </UnorderedList>
    <Callout type="warning" title="顺序不能颠倒">
      <Paragraph>
        如果先执行 <InlineCode>a = b;</InlineCode> 再执行 <InlineCode>int temp = a;</InlineCode>，
        那么 <InlineCode>a</InlineCode> 的原始值（10）就已经被 20 覆盖了，
        <InlineCode>temp</InlineCode> 拿到的是 20 而非 10，交换结果将是错误的。
      </Paragraph>
      <Paragraph>
        这正是顺序结构的核心特点：<Text bold>语句先后顺序直接决定结果，一旦乱序就会出 bug。</Text>
      </Paragraph>
    </Callout>

    <Heading3>4. 顺序结构的注意点</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>先赋值，后使用</Text>：Java 局部变量必须先赋值才能使用，否则编译报错。
        如果把 <InlineCode>int a = 10;</InlineCode> 写在 <InlineCode>System.out.println(a);</InlineCode>
        后面，编译器会直接提示"变量 a 可能尚未初始化"。
      </ListItem>
      <ListItem>
        <Text bold>变量只能在声明之后才可见</Text>：在同一个方法里，如果你在第 5 行声明了变量
        <InlineCode>x</InlineCode>，第 3 行就没有办法使用它。
      </ListItem>
      <ListItem>
        <Text bold>语句之间有依赖关系时务必想清楚顺序</Text>：像上面交换变量的例子，
        依赖关系是"备份 → 覆盖 → 还原"，三步缺一不可，且顺序固定。
      </ListItem>
    </UnorderedList>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己预测或动手写，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：预测顺序执行的输出"
      code={`问：下面代码运行后，控制台输出什么？

public class Predict {
    public static void main(String[] args) {
        int x = 5;
        System.out.println("x = " + x);
        x = x + 3;
        System.out.println("x = " + x);
        x = x * 2;
        System.out.println("x = " + x);
    }
}`}
      answerCode={`x = 5
x = 8
x = 16

逐步分析：
  第 1 步：int x = 5;          → x 的值为 5
  第 2 步：println("x = " + x) → 打印 "x = 5"
  第 3 步：x = x + 3;          → x = 5 + 3 = 8
  第 4 步：println("x = " + x) → 打印 "x = 8"
  第 5 步：x = x * 2;          → x = 8 * 2 = 16
  第 6 步：println("x = " + x) → 打印 "x = 16"

要点：每次对 x 赋新值，用的都是"当前时刻"x 的值，
而不是初始值 5。顺序执行，步步影响下一步。`}
    />
    <CodeBlock
      qa
      title="练习 2：用顺序结构交换两个变量的值"
      code={`// 要求：已有 int m = 100, int n = 200，用顺序结构（借助第三个变量）
// 完成交换，最终打印：
//   交换前：m = 100，n = 200
//   交换后：m = 200，n = 100

public class SwapExercise {
    public static void main(String[] args) {
        int m = 100;
        int n = 200;

        System.out.println("交换前：m = " + m + "，n = " + n);

        // 请在这里补全三行交换代码


        System.out.println("交换后：m = " + m + "，n = " + n);
    }
}`}
      answerCode={`public class SwapExercise {
    public static void main(String[] args) {
        int m = 100;
        int n = 200;

        System.out.println("交换前：m = " + m + "，n = " + n);

        // 第一步：备份 m 的值
        int temp = m;   // temp=100, m=100, n=200
        // 第二步：把 n 的值赋给 m
        m = n;          // temp=100, m=200, n=200
        // 第三步：把备份值赋给 n
        n = temp;       // temp=100, m=200, n=100

        System.out.println("交换后：m = " + m + "，n = " + n);
    }
}

/* 控制台输出：
交换前：m = 100，n = 200
交换后：m = 200，n = 100
*/`}
    />
  </article>
);

export default index;
