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
  OrderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>Random 随机数</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        游戏中的骰子点数、抽奖系统的幸运号码、验证码的随机字符……
        这些都需要程序能生成随机数。Java 提供了 <Text bold>Random</Text> 类来完成这项工作。
        本节讲清 Random 的三步使用流程，重点掌握 <InlineCode>nextInt(n)</InlineCode> 生成指定范围随机整数的方法，
        以及推导"生成任意区间随机数"的万能公式，最后用一个猜数字小游戏综合演练。
      </Paragraph>
    </Callout>

    <Heading3>1. Random 的三步使用流程</Heading3>
    <Paragraph>
      Random 在 <InlineCode>java.util</InlineCode> 包中，使用前同样遵循"导包 → 创建对象 → 调用方法"三步：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>导包</Text>：<InlineCode>import java.util.Random;</InlineCode>
      </ListItem>
      <ListItem>
        <Text bold>创建对象</Text>：<InlineCode>Random r = new Random();</InlineCode>
      </ListItem>
      <ListItem>
        <Text bold>调用方法生成随机数</Text>：<InlineCode>int n = r.nextInt(bound);</InlineCode>
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="text"
      title="Random 三步格式"
      code={`// 第一步：导包
import java.util.Random;

// 第二步：创建对象（写在 main 方法内）
Random r = new Random();

// 第三步：调用方法
int n1 = r.nextInt();      // 整个 int 范围的随机整数（含负数，不常用）
int n2 = r.nextInt(10);    // 生成 [0, 10) 即 0~9 的随机整数（最常用）`}
    />

    <Heading3>2. 常用方法说明</Heading3>
    <Table
      head={['方法', '返回类型', '范围说明', '示例']}
      rows={[
        ['nextInt()', 'int', '整个 int 范围：-2147483648 ~ 2147483647，含负数，不常用', 'r.nextInt()'],
        ['nextInt(int n)', 'int', '[0, n) 即 0 到 n-1，不含 n 本身，n 必须为正整数', 'r.nextInt(6)  →  0~5'],
        ['nextDouble()', 'double', '[0.0, 1.0) 即 0.0 到 1.0 之间（不含 1.0）', 'r.nextDouble()'],
        ['nextBoolean()', 'boolean', '随机返回 true 或 false，各 50% 概率', 'r.nextBoolean()'],
      ]}
    />
    <Callout type="tip" title="nextInt(n) 是重点，牢记范围是左闭右开 [0, n)">
      <InlineCode>r.nextInt(n)</InlineCode> 生成的范围是 <Text bold>[0, n)</Text>，
      即最小值是 0，最大值是 <Text bold>n-1</Text>，n 本身取不到。
      例如 <InlineCode>r.nextInt(6)</InlineCode> 的结果是 0、1、2、3、4、5 六个值之一，不会出现 6。
    </Callout>

    <Heading3>3. 生成任意范围随机整数的公式</Heading3>
    <Paragraph>
      实际开发中常常需要生成指定区间内的随机数，而不只是从 0 开始。
      掌握以下公式即可推导任意区间：
    </Paragraph>
    <Table
      head={['目标范围', '公式', '示例（生成 1~6）']}
      rows={[
        ['[0, n)  即 0 ~ n-1', 'r.nextInt(n)', 'r.nextInt(6)  →  0~5'],
        ['[1, n]  即 1 ~ n', 'r.nextInt(n) + 1', 'r.nextInt(6) + 1  →  1~6'],
        ['[min, max]  即 min ~ max', 'r.nextInt(max - min + 1) + min', 'r.nextInt(4) + 3  →  3~6'],
      ]}
    />
    <Paragraph>
      <Text bold>公式推导思路</Text>：要生成 <InlineCode>[min, max]</InlineCode> 范围内的整数：
    </Paragraph>
    <OrderedList>
      <ListItem>区间共有 <InlineCode>max - min + 1</InlineCode> 个整数。</ListItem>
      <ListItem>用 <InlineCode>r.nextInt(max - min + 1)</InlineCode> 生成 <InlineCode>0 ~ (max - min)</InlineCode>。</ListItem>
      <ListItem>整体加上 <InlineCode>min</InlineCode>，得到 <InlineCode>min ~ max</InlineCode>。</ListItem>
    </OrderedList>

    <Heading3>4. 示例代码</Heading3>

    <Heading4>示例 1：基础用法——生成多个随机数</Heading4>
    <CodeBlock
      title="RandomBasic.java"
      code={`import java.util.Random;

public class RandomBasic {
    public static void main(String[] args) {
        Random r = new Random();

        // 生成 [0, 10) 的随机整数，即 0~9
        System.out.println("0~9 随机整数：" + r.nextInt(10));

        // 生成 [1, 6] 的随机整数，模拟骰子
        int dice = r.nextInt(6) + 1;
        System.out.println("骰子点数（1~6）：" + dice);

        // 生成 [50, 100] 的随机整数
        int score = r.nextInt(51) + 50;   // 51 = 100 - 50 + 1
        System.out.println("随机分数（50~100）：" + score);

        // 生成随机 double，范围 [0.0, 1.0)
        System.out.println("随机小数（0.0~1.0）：" + r.nextDouble());

        // 生成随机 boolean
        System.out.println("随机布尔值：" + r.nextBoolean());
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（随机，每次运行不同）" code={`0~9 随机整数：7
骰子点数（1~6）：3
随机分数（50~100）：76
随机小数（0.0~1.0）：0.4182736509
随机布尔值：true`} />
    <Callout type="warning" title="每次运行结果不同">
      Random 生成的是伪随机数，每次运行程序结果不同（除非指定相同的种子 seed）。
      控制台输出仅为示例，你的运行结果会与上面不同，这是正常现象。
    </Callout>

    <Heading4>示例 2：循环生成多个随机数，统计各区间频次</Heading4>
    <CodeBlock
      title="RandomCount.java"
      code={`import java.util.Random;

public class RandomCount {
    public static void main(String[] args) {
        Random r = new Random();
        int small = 0;  // 统计 1~5 的次数
        int large = 0;  // 统计 6~10 的次数

        // 生成 100 个 1~10 的随机整数，统计大小分布
        for (int i = 0; i < 100; i++) {
            int num = r.nextInt(10) + 1;   // [1, 10]
            if (num <= 5) {
                small++;
            } else {
                large++;
            }
        }

        System.out.println("生成 100 个 1~10 的随机数：");
        System.out.println("1~5  出现次数：" + small);
        System.out.println("6~10 出现次数：" + large);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（随机，每次运行不同，但两数之和为 100）" code={`生成 100 个 1~10 的随机数：
1~5  出现次数：52
6~10 出现次数：48`} />
    <Paragraph>
      两组数值之和始终等于 100，但各自的具体数值每次运行都不同。
      次数越多，两组数值会越趋近各占 50%，体现了概率均匀的特性。
    </Paragraph>

    <Heading4>示例 3：综合案例——猜数字小游戏</Heading4>
    <Paragraph>
      程序随机生成一个 1~100 的整数，用户不断猜测，程序提示"猜大了""猜小了"，
      直到猜中为止，并打印猜测次数。
    </Paragraph>
    <CodeBlock
      title="GuessNumber.java"
      code={`import java.util.Random;
import java.util.Scanner;

public class GuessNumber {
    public static void main(String[] args) {
        Random r = new Random();
        Scanner sc = new Scanner(System.in);

        // 生成 1~100 的随机整数作为答案
        int answer = r.nextInt(100) + 1;
        int count = 0;   // 猜测次数

        System.out.println("我已经想好了一个 1~100 之间的数，请猜！");

        while (true) {
            System.out.print("请输入你的猜测：");
            int guess = sc.nextInt();
            count++;

            if (guess < answer) {
                System.out.println("猜小了！");
            } else if (guess > answer) {
                System.out.println("猜大了！");
            } else {
                System.out.println("恭喜你，猜对了！答案就是 " + answer);
                System.out.println("你总共猜了 " + count + " 次。");
                break;   // 猜中，退出循环
            }
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（示例，答案随机，本例假设答案为 63）" code={`我已经想好了一个 1~100 之间的数，请猜！
请输入你的猜测：50
猜小了！
请输入你的猜测：75
猜大了！
请输入你的猜测：63
恭喜你，猜对了！答案就是 63
你总共猜了 3 次。`} />
    <Paragraph>
      程序执行流程：<InlineCode>r.nextInt(100) + 1</InlineCode> 生成 1~100 的随机整数赋给
      <InlineCode>answer</InlineCode>；
      <InlineCode>while(true)</InlineCode> 循环反复接收用户输入，
      每次比较猜测值与答案，不对就继续循环，猜中时打印结果并执行 <InlineCode>break</InlineCode> 退出循环。
    </Paragraph>

    <Heading3>5. 随机数范围公式速查</Heading3>
    <CodeBlock
      title="RandomFormula.java（各种常用范围示例）"
      code={`import java.util.Random;

public class RandomFormula {
    public static void main(String[] args) {
        Random r = new Random();

        // [0, 9]   — 0 到 9
        int a = r.nextInt(10);

        // [1, 10]  — 1 到 10
        int b = r.nextInt(10) + 1;

        // [0, 100] — 0 到 100（共 101 个数）
        int c = r.nextInt(101);

        // [5, 15]  — 5 到 15（共 11 个数，15-5+1=11）
        int d = r.nextInt(11) + 5;

        // [-5, 5]  — -5 到 5（共 11 个数，5-(-5)+1=11）
        int e = r.nextInt(11) - 5;

        System.out.println("[0,  9] : " + a);
        System.out.println("[1, 10] : " + b);
        System.out.println("[0,100] : " + c);
        System.out.println("[5, 15] : " + d);
        System.out.println("[-5, 5] : " + e);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（随机，每次运行不同）" code={`[0,  9] : 4
[1, 10] : 7
[0,100] : 83
[5, 15] : 11
[-5, 5] : -2`} />

    <Callout type="success" title="小结">
      <Paragraph>Random 核心要点：</Paragraph>
      <UnorderedList>
        <ListItem>三步：<InlineCode>import java.util.Random;</InlineCode> → <InlineCode>Random r = new Random();</InlineCode> → <InlineCode>r.nextInt(n)</InlineCode>。</ListItem>
        <ListItem><InlineCode>r.nextInt(n)</InlineCode> 生成 <Text bold>[0, n)</Text> 即 0 ~ n-1 的随机整数，n 不包含在内。</ListItem>
        <ListItem>生成 [min, max] 的万能公式：<InlineCode>r.nextInt(max - min + 1) + min</InlineCode>。</ListItem>
        <ListItem>生成 1~n 的简便公式：<InlineCode>r.nextInt(n) + 1</InlineCode>。</ListItem>
        <ListItem>每次运行结果不同——这正是随机数的意义，输出示例仅供参考。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：生成指定范围的随机数"
      code={`// 要求：用 Random 分别生成以下三个随机整数并打印：
// 1. [1, 6] —— 模拟一颗骰子
// 2. [10, 20] —— 10 到 20 之间的整数
// 3. [0, 99] —— 两位数（含 0）

public class RangeRandom {
    public static void main(String[] args) {
        // 请在这里补全代码（import 写在类外面）
    }
}`}
      answerCode={`import java.util.Random;

public class RangeRandom {
    public static void main(String[] args) {
        Random r = new Random();

        // 1. [1, 6]：nextInt(6) 生成 0~5，加 1 得 1~6
        int dice = r.nextInt(6) + 1;
        System.out.println("骰子（1~6）：" + dice);

        // 2. [10, 20]：共 11 个数（20-10+1=11），nextInt(11)+10
        int mid = r.nextInt(11) + 10;
        System.out.println("10~20：" + mid);

        // 3. [0, 99]：共 100 个数，nextInt(100)
        int twoDigit = r.nextInt(100);
        System.out.println("0~99：" + twoDigit);
    }
}

/* 控制台输出（随机，每次不同，例如）：
骰子（1~6）：4
10~20：13
0~99：67

解析：
  [1, 6]  = nextInt(6-1+1) + 1  = nextInt(6) + 1
  [10,20] = nextInt(20-10+1) + 10 = nextInt(11) + 10
  [0, 99] = nextInt(99-0+1) + 0  = nextInt(100)
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：随机生成 10 个整数，统计正负数个数"
      code={`// 要求：生成 10 个 [-10, 10] 范围内的随机整数，
// 统计其中正数（> 0）、负数（< 0）、零的个数，最后打印统计结果。

public class PositiveNegative {
    public static void main(String[] args) {
        // 请在这里补全代码
    }
}`}
      answerCode={`import java.util.Random;

public class PositiveNegative {
    public static void main(String[] args) {
        Random r = new Random();
        int positive = 0, negative = 0, zero = 0;

        for (int i = 0; i < 10; i++) {
            // [-10, 10]：共 21 个数（10-(-10)+1=21），nextInt(21)-10
            int num = r.nextInt(21) - 10;
            System.out.print(num + " ");

            if (num > 0) {
                positive++;
            } else if (num < 0) {
                negative++;
            } else {
                zero++;
            }
        }

        System.out.println();
        System.out.println("正数：" + positive + " 个");
        System.out.println("负数：" + negative + " 个");
        System.out.println("零：" + zero + " 个");
    }
}

/* 控制台输出（随机，每次不同，例如）：
-7 3 0 5 -2 8 -4 1 -9 6
正数：4 个
负数：4 个
零：1 个

解析：
  [-10, 10] 共 21 个整数，公式 nextInt(21) - 10。
  正数、负数、零的总和始终等于 10，但各自数量每次运行都可能不同。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：改进猜数字——限制最多 7 次机会"
      code={`// 要求：在猜数字游戏基础上增加限制：
// 程序随机生成 1~100 的整数，玩家最多猜 7 次。
// 每次猜测后显示剩余次数；7 次内猜中则胜利，否则显示"挑战失败，答案是 xx"。

import java.util.Random;
import java.util.Scanner;

public class GuessWith7Chances {
    public static void main(String[] args) {
        // 请在这里补全代码
    }
}`}
      answerCode={`import java.util.Random;
import java.util.Scanner;

public class GuessWith7Chances {
    public static void main(String[] args) {
        Random r = new Random();
        Scanner sc = new Scanner(System.in);

        int answer = r.nextInt(100) + 1;  // 1~100 的随机答案
        int maxChances = 7;

        System.out.println("我想好了一个 1~100 的数，你有 " + maxChances + " 次机会！");

        for (int chance = 1; chance <= maxChances; chance++) {
            System.out.print("第 " + chance + " 次猜测（剩余 " + (maxChances - chance + 1) + " 次）：");
            int guess = sc.nextInt();

            if (guess < answer) {
                System.out.println("猜小了！");
            } else if (guess > answer) {
                System.out.println("猜大了！");
            } else {
                System.out.println("恭喜你，第 " + chance + " 次猜中！答案是 " + answer);
                return;  // 猜中，直接结束 main 方法
            }
        }

        // 7 次都没猜中，挑战失败
        System.out.println("挑战失败，答案是 " + answer + "，下次加油！");
    }
}

/* 控制台输出（示例，假设答案为 42）：
我想好了一个 1~100 的数，你有 7 次机会！
第 1 次猜测（剩余 7 次）：50
猜大了！
第 2 次猜测（剩余 6 次）：25
猜小了！
第 3 次猜测（剩余 5 次）：42
恭喜你，第 3 次猜中！答案是 42

解析：
  用 for 循环控制最多 7 次，猜中时用 return 退出整个 main 方法；
  循环正常结束（7 次未猜中）后执行挑战失败的提示。
  r.nextInt(100) + 1 生成 [1, 100] 的随机整数。
*/`}
    />
  </article>
);

export default index;
