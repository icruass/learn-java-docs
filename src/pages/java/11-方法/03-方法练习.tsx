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
  OrderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>方法练习</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节通过四个典型案例把方法的定义与调用练到位：
        判断两数是否相等（boolean 返回值）、求 1~n 累加和（循环 + 返回值）、
        求三个数中最大值（多分支 + 返回值）、判断整数奇偶（简洁 boolean 方法）。
        每个案例先讲清<Text bold>思路</Text>，再给出完整代码和输出讲解，
        最后用练习题巩固。
      </Paragraph>
    </Callout>

    <Heading3>1. 典型案例讲解</Heading3>

    <Heading4>1.1 判断两个整数是否相等（返回 boolean）</Heading4>
    <Paragraph>
      思路：接收两个 int 参数，用 <InlineCode>==</InlineCode> 判断是否相等，
      直接把比较表达式作为 return 的值，一行搞定。
      返回 <InlineCode>true</InlineCode> 表示相等，<InlineCode>false</InlineCode> 表示不等。
    </Paragraph>
    <CodeBlock
      title="IsEqualDemo.java"
      code={`public class IsEqualDemo {

    // 判断两个整数是否相等，返回 boolean
    public static boolean isEqual(int a, int b) {
        return a == b;   // 比较表达式的结果本身就是 boolean
    }

    public static void main(String[] args) {
        System.out.println(isEqual(5, 5));    // true
        System.out.println(isEqual(3, 8));    // false
        System.out.println(isEqual(0, 0));    // true

        // 也可以用赋值调用做后续判断
        boolean result = isEqual(10, 20);
        if (!result) {
            System.out.println("10 和 20 不相等");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`true
false
true
10 和 20 不相等`} />
    <Paragraph>
      <InlineCode>return a == b;</InlineCode> 等价于先算出 <InlineCode>a == b</InlineCode> 的
      true/false，再把该布尔值返回。比写 if-else 分别 return true / return false 更简洁。
    </Paragraph>

    <Heading4>1.2 求 1~n 累加和（循环 + 返回值）</Heading4>
    <Paragraph>
      思路：在方法体内声明一个局部变量 <InlineCode>sum</InlineCode> 初始化为 0，
      用 for 循环从 1 累加到 n，最后 return sum。
      调用者只需传入 n，拿到结果即可，不关心内部循环细节——这就是方法封装的意义。
    </Paragraph>
    <CodeBlock
      title="SumDemo.java"
      code={`public class SumDemo {

    // 求 1 到 n 的累加和
    public static int sumToN(int n) {
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        return sum;
    }

    public static void main(String[] args) {
        System.out.println("1~10 之和：" + sumToN(10));
        System.out.println("1~100 之和：" + sumToN(100));

        int s = sumToN(5);
        System.out.println("1~5 之和：" + s);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`1~10 之和：55
1~100 之和：5050
1~5 之和：15`} />

    <Heading4>1.3 求三个整数中的最大值（多分支 + 返回值）</Heading4>
    <Paragraph>
      思路一（两次比较）：先比较 a 和 b 取较大值存入 max，再把 max 与 c 比较，
      最终的 max 就是三者中最大的。
      思路二（三元运算符嵌套）：<InlineCode>a &gt;= b ? (a &gt;= c ? a : c) : (b &gt;= c ? b : c)</InlineCode>，
      一行完成但可读性稍差。推荐思路一。
    </Paragraph>
    <CodeBlock
      title="MaxThreeDemo.java"
      code={`public class MaxThreeDemo {

    // 返回三个整数中的最大值
    public static int maxOfThree(int a, int b, int c) {
        int max = a;          // 假设 a 最大
        if (b > max) {
            max = b;          // b 更大，更新 max
        }
        if (c > max) {
            max = c;          // c 更大，再次更新 max
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(maxOfThree(3, 7, 5));     // 7
        System.out.println(maxOfThree(10, 10, 9));   // 10
        System.out.println(maxOfThree(-1, -5, -3));  // -1
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`7
10
-1`} />
    <Paragraph>
      传入 <InlineCode>(-1, -5, -3)</InlineCode> 时：max 初始为 -1，
      -5 不大于 -1，max 不变；-3 不大于 -1，max 仍为 -1，最终返回 -1。
      全为负数时逻辑依然正确。
    </Paragraph>

    <Heading4>1.4 判断整数奇偶（简洁 boolean 方法）</Heading4>
    <Paragraph>
      思路：对 2 取余，结果为 0 则是偶数（返回 true），否则为奇数（返回 false）。
      特别注意：负数取余在 Java 中结果可以为负，但 <InlineCode>n % 2 == 0</InlineCode>
      对负偶数同样成立（如 -4 % 2 == 0），不需要特殊处理。
    </Paragraph>
    <CodeBlock
      title="OddEvenDemo.java"
      code={`public class OddEvenDemo {

    // 判断是否为偶数，返回 boolean
    public static boolean isEven(int n) {
        return n % 2 == 0;
    }

    // 判断是否为奇数（复用 isEven）
    public static boolean isOdd(int n) {
        return !isEven(n);   // 奇偶互斥，取反即可
    }

    public static void main(String[] args) {
        System.out.println("4 是偶数：" + isEven(4));    // true
        System.out.println("7 是偶数：" + isEven(7));    // false
        System.out.println("-6 是偶数：" + isEven(-6));  // true
        System.out.println("9 是奇数：" + isOdd(9));     // true
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`4 是偶数：true
7 是偶数：false
-6 是偶数：true
9 是奇数：true`} />
    <Callout type="tip" title="方法可以调用方法">
      <InlineCode>isOdd</InlineCode> 直接调用了 <InlineCode>isEven</InlineCode> 并取反，
      这是方法复用的典型体现：把已有逻辑封装成方法后，其他方法可以直接调用，
      避免重复编写 <InlineCode>n % 2 != 0</InlineCode> 这样的代码。
    </Callout>

    <Heading3>2. 综合案例：方法协作</Heading3>
    <Paragraph>
      下面的案例把多个方法组合使用——打印一张成绩汇总表，展示方法协作的威力：
      主方法只负责"指挥"，具体的等级判断、分隔线打印各由独立方法承担。
    </Paragraph>
    <CodeBlock
      title="ScoreReport.java"
      code={`public class ScoreReport {

    // 根据分数返回等级字符串
    public static String getGrade(int score) {
        if (score >= 90) return "优秀";
        if (score >= 75) return "良好";
        if (score >= 60) return "及格";
        return "不及格";
    }

    // 打印一条分隔线
    public static void printSeparator() {
        System.out.println("+--------+------+--------+");
    }

    // 打印一行成绩记录
    public static void printRecord(String name, int score) {
        String grade = getGrade(score);   // 调用 getGrade 方法
        System.out.println("| " + name + " | " + score + " | " + grade + " |");
    }

    public static void main(String[] args) {
        printSeparator();
        printRecord("小明", 92);
        printRecord("小红", 78);
        printRecord("小刚", 65);
        printRecord("小李", 48);
        printSeparator();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`+--------+------+--------+
| 小明 | 92 | 优秀 |
| 小红 | 78 | 良好 |
| 小刚 | 65 | 及格 |
| 小李 | 48 | 不及格 |
+--------+------+--------+`} />

    <Heading3>3. 方法设计思路小结</Heading3>
    <Table
      head={['场景', '推荐返回值类型', '思路关键点']}
      rows={[
        ['判断是/否', 'boolean', '直接 return 比较表达式，如 return a == b;'],
        ['计算数值', 'int / double', '方法体内计算，最后 return 结果'],
        ['返回文字描述', 'String', '分支判断，各分支 return 对应字符串'],
        ['只做动作（打印等）', 'void', '不需要 return 值，执行完毕自动结束'],
      ]}
    />
    <Callout type="success" title="好的方法三要素">
      <OrderedList>
        <ListItem><Text bold>单一职责</Text>：一个方法只做一件事，方法名能直接说明功能。</ListItem>
        <ListItem><Text bold>参数最少化</Text>：只传必要的数据，不传冗余信息。</ListItem>
        <ListItem><Text bold>返回值明确</Text>：有计算结果就 return；纯动作操作就 void。</ListItem>
      </OrderedList>
    </Callout>

    <Heading3>4. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：求两个整数的最小值"
      code={`// 要求：定义 min(int a, int b) 方法，返回 a 和 b 中较小的值。
// 在 main 里测试 min(10, 3)、min(7, 7)、min(-5, -2)，打印结果。

public class Exercise01 {

    public static int min(int a, int b) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise01 {

    public static int min(int a, int b) {
        return a <= b ? a : b;
    }

    public static void main(String[] args) {
        System.out.println(min(10, 3));    // 3
        System.out.println(min(7, 7));     // 7
        System.out.println(min(-5, -2));   // -5
    }
}

/* 控制台输出：
3
7
-5

解析：a <= b 为 true 则返回 a，否则返回 b。
      两个相等时返回任意一个都正确，这里返回 a（即 7）。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：打印乘法口诀表的一行"
      code={`// 要求：定义 void 方法 printRow(int n)，打印乘法口诀表第 n 行。
// 例如 n=3，打印：1x3=3  2x3=6  3x3=9
// 在 main 里调用 printRow(3) 和 printRow(5)。

public class Exercise02 {

    public static void printRow(int n) {
        // 在这里补全代码（循环从 1 到 n，打印 i+"x"+n+"="+i*n，末尾加空格或换行）
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {

    public static void printRow(int n) {
        for (int i = 1; i <= n; i++) {
            System.out.print(i + "x" + n + "=" + (i * n) + "  ");
        }
        System.out.println();   // 每行结束后换行
    }

    public static void main(String[] args) {
        printRow(3);
        printRow(5);
    }
}

/* 控制台输出：
1x3=3  2x3=6  3x3=9
1x5=5  2x5=10  3x5=15  4x5=20  5x5=25

解析：循环 i 从 1 到 n，每次打印 "ixn=i*n" 后加两个空格；
      循环结束后调用 println() 换行，使下一次调用从新行开始。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：判断一个整数是否为质数"
      code={`// 要求：定义 isPrime(int n) 方法，返回 boolean。
// 质数定义：大于 1 且只能被 1 和自身整除的正整数。
// 思路提示：n <= 1 直接返回 false；
//           从 i=2 循环到 i*i <= n，若 n % i == 0 则返回 false；
//           循环结束后返回 true。
// 在 main 里测试 2、7、9、1、13，打印结果。

public class Exercise03 {

    public static boolean isPrime(int n) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {

    public static boolean isPrime(int n) {
        if (n <= 1) {
            return false;           // 1 及以下不是质数
        }
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                return false;       // 找到因数，不是质数
            }
        }
        return true;                // 没有找到因数，是质数
    }

    public static void main(String[] args) {
        System.out.println("2 是质数：" + isPrime(2));    // true
        System.out.println("7 是质数：" + isPrime(7));    // true
        System.out.println("9 是质数：" + isPrime(9));    // false
        System.out.println("1 是质数：" + isPrime(1));    // false
        System.out.println("13 是质数：" + isPrime(13));  // true
    }
}

/* 控制台输出：
2 是质数：true
7 是质数：true
9 是质数：false
1 是质数：false
13 是质数：true

解析：
  9 = 3*3，循环到 i=3 时 9%3==0，提前返回 false。
  i*i <= n 的写法比 i <= n 效率更高：只需检查到 sqrt(n) 即可，
  因为因数总是成对出现，若 n 有大于 sqrt(n) 的因数，必然有小于 sqrt(n) 的配对因数。
*/`}
    />
  </article>
);

export default index;
