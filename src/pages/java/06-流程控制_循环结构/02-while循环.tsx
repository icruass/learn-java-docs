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
    <Title>while 循环</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>while 循环</Text>是另一种常用的循环结构，适合<Text bold>循环次数不确定</Text>、
        只要满足某个条件就持续执行的场景。它的特点是"<Text bold>先判断、后执行</Text>"，
        条件一开始就为假时，循环体一次都不执行。本节讲清语法、适用场景，
        并着重强调防止死循环的注意事项。
      </Paragraph>
    </Callout>

    <Heading3>1. 语法格式</Heading3>
    <CodeBlock
      language="text"
      title="while 循环语法"
      code={`while (循环条件) {
    // 循环体：条件为 true 时反复执行
    // 必须包含能让条件最终变为 false 的语句
}`}
    />
    <Paragraph>
      执行顺序：<Text bold>先判断条件，条件为 true 则执行循环体，执行完再回头判断条件</Text>，
      直到条件为 false 才退出。
    </Paragraph>
    <CodeBlock
      language="text"
      title="while 执行顺序示意图"
      code={`   [判断条件] <──────────────────────┐
     │       │                       │
   false    true                     │
     │       │                       │
     ▼       ▼                       │
  退出循环  [执行循环体] ─────────────┘`}
    />

    <Heading3>2. 适用场景</Heading3>
    <Paragraph>
      while 循环最适合用在<Text bold>循环次数预先不确定</Text>的情况，典型场景：
    </Paragraph>
    <UnorderedList>
      <ListItem>读取用户输入，直到用户输入合法值为止。</ListItem>
      <ListItem>不断轮询某个状态，直到达到目标条件。</ListItem>
      <ListItem>数学计算中，不知道需要几步才能收敛（如数字各位拆分、辗转相除法）。</ListItem>
    </UnorderedList>

    <Heading3>3. 示例一：1 到 100 求和（while 版）</Heading3>
    <Paragraph>
      与 for 循环实现同一需求，对比体会两种写法的异同：
    </Paragraph>
    <CodeBlock
      title="Sum1To100While.java"
      code={`public class Sum1To100While {
    public static void main(String[] args) {
        int sum = 0;
        int i = 1;          // 初始化放在 while 前面
        while (i <= 100) {  // 循环条件
            sum += i;
            i++;            // 迭代语句放在循环体内
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
      注意：for 循环的三个部分（初始化、条件、迭代）在 while 里被分开了——
      初始化在 while 之前，迭代在循环体末尾。效果完全一致，选哪种看具体场景。
    </Paragraph>

    <Heading3>4. 示例二：累加直到满足条件</Heading3>
    <Paragraph>
      求从 1 开始累加，第一次使累加和超过 200 时，输出当时的 i 和 sum：
    </Paragraph>
    <CodeBlock
      title="SumUntil200.java"
      code={`public class SumUntil200 {
    public static void main(String[] args) {
        int sum = 0;
        int i = 0;
        while (sum <= 200) {  // 只要和不超过 200，就继续加下一个数
            i++;
            sum += i;
        }
        System.out.println("加到第 " + i + " 个数时，累加和首次超过 200");
        System.out.println("此时 sum = " + sum);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`加到第 20 个数时，累加和首次超过 200
此时 sum = 210`}
    />
    <Paragraph>
      这类题用 for 循环不方便，因为不知道循环几次。while 则天然契合"满足条件就停"的语义。
      验证：1+2+…+19 = 190，再加 20 变成 210，首次超过 200。
    </Paragraph>

    <Heading3>5. 重要注意点</Heading3>

    <Heading4>① 必须有能让条件变 false 的语句</Heading4>
    <Callout type="danger" title="最危险的坑：忘记迭代语句，导致死循环">
      <Paragraph>
        while 循环体内<Text bold>必须包含能让循环条件最终变为 false 的语句</Text>，
        否则程序会永远运行（死循环），最终只能强制终止进程。
      </Paragraph>
      <CodeBlock
        title="死循环示范（不要这样写）"
        code={`int i = 1;
while (i <= 10) {
    System.out.println(i);
    // 忘记写 i++，i 永远是 1，条件永远为 true，程序无法结束
}`}
      />
      <CodeBlock
        title="正确写法（包含 i++ 迭代）"
        code={`int i = 1;
while (i <= 10) {
    System.out.println(i);
    i++;  // 保证 i 最终会超过 10，循环能正常结束
}`}
      />
    </Callout>

    <Heading4>② 条件初始为 false，循环一次都不执行</Heading4>
    <Callout type="warning" title="先判断，可能执行 0 次">
      while 是"先判断后执行"，如果条件一开始就为 false，循环体<Text bold>一次都不会执行</Text>。
      <CodeBlock
        title="执行 0 次的示例"
        code={`int i = 100;
while (i < 10) {           // 100 < 10 是 false，直接跳过循环体
    System.out.println("这行不会执行");
}
System.out.println("循环后继续执行");  // 直接执行这里`}
      />
    </Callout>

    <Table
      head={['特性', 'for 循环', 'while 循环']}
      rows={[
        ['初始化位置', '在 for(;;) 括号内', '在 while 语句之前'],
        ['迭代语句位置', '在 for(;;) 括号内', '在循环体末尾手动写'],
        ['典型场景', '次数已知', '次数不确定'],
        ['最少执行次数', '0 次（条件初始为 false）', '0 次（条件初始为 false）'],
      ]}
    />

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考并动手写，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：用 while 求 n 的阶乘"
      code={`// 要求：用 while 循环求 8 的阶乘（8!），并输出结果。
// 阶乘：n! = 1 × 2 × 3 × ... × n

public class FactorialWhile {
    public static void main(String[] args) {
        int n = 8;
        long result = 1;
        int i = 2;
        // 请在这里补全 while 循环

        System.out.println(n + "! = " + result);
    }
}`}
      answerCode={`public class FactorialWhile {
    public static void main(String[] args) {
        int n = 8;
        long result = 1;
        int i = 2;
        while (i <= n) {
            result *= i;
            i++;
        }
        System.out.println(n + "! = " + result);
    }
}

/* 控制台输出：
8! = 40320

计算过程：1×2×3×4×5×6×7×8 = 40320
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：数位拆分——求整数各位数字之和"
      code={`// 要求：给定正整数 n = 12345，用 while 循环拆分各位数字，
// 求各位之和，并输出每一位和最终结果。
// 提示：n % 10 取个位，n / 10 去掉个位，重复直到 n 为 0。

public class DigitSum {
    public static void main(String[] args) {
        int n = 12345;
        int sum = 0;
        // 请在这里补全代码

        System.out.println("12345 各位数字之和：" + sum);
    }
}`}
      answerCode={`public class DigitSum {
    public static void main(String[] args) {
        int n = 12345;
        int sum = 0;
        while (n > 0) {
            int digit = n % 10;   // 取出个位
            sum += digit;
            System.out.println("取出数字：" + digit + "，当前 sum = " + sum);
            n = n / 10;           // 去掉个位
        }
        System.out.println("12345 各位数字之和：" + sum);
    }
}

/* 控制台输出：
取出数字：5，当前 sum = 5
取出数字：4，当前 sum = 9
取出数字：3，当前 sum = 12
取出数字：2，当前 sum = 14
取出数字：1，当前 sum = 15
12345 各位数字之和：15

解析：1+2+3+4+5 = 15
      每次 n%10 取个位，n/10 整除去掉个位，直到 n 变成 0 为止。
*/`}
    />
  </article>
);

export default index;
