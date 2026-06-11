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
    <Title>Math 工具类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        编程中经常需要求绝对值、乘方、开方、取整、生成随机数……这些都不用自己动手实现，
        Java 内置的 <Text bold>java.lang.Math</Text> 工具类已经为我们准备好了。
        <InlineCode>Math</InlineCode> 位于 <InlineCode>java.lang</InlineCode> 包，
        无需导包，所有方法和常量都是静态的，直接用 <InlineCode>Math.方法名()</InlineCode> 调用。
        本节重点掌握绝对值、极值、幂、开方、三种取整方式、随机数以及常量 PI 的用法，
        并深入辨析 <InlineCode>ceil</InlineCode>、<InlineCode>floor</InlineCode>、
        <InlineCode>round</InlineCode> 的区别。
      </Paragraph>
    </Callout>

    <Heading3>1. Math 类特点</Heading3>
    <UnorderedList>
      <ListItem>
        位于 <InlineCode>java.lang</InlineCode> 包，<Text bold>无需 import</Text>，JVM 自动加载。
      </ListItem>
      <ListItem>
        构造方法是 <InlineCode>private</InlineCode> 的，不能创建实例，只能通过类名调用静态成员。
      </ListItem>
      <ListItem>
        全部是<Text bold>静态方法</Text>和<Text bold>静态常量</Text>，用法：
        <InlineCode>Math.方法名(参数)</InlineCode>。
      </ListItem>
      <ListItem>
        大多数方法操作 <InlineCode>double</InlineCode> 类型，返回值也是 <InlineCode>double</InlineCode>；
        少数有 <InlineCode>int</InlineCode> / <InlineCode>long</InlineCode> 重载。
      </ListItem>
    </UnorderedList>

    <Heading3>2. 常用成员总览</Heading3>
    <Table
      head={['成员', '说明', '返回类型']}
      rows={[
        ['Math.PI', '圆周率 π ≈ 3.141592653589793', 'double（常量）'],
        ['Math.E', '自然常数 e ≈ 2.718281828459045', 'double（常量）'],
        ['Math.abs(x)', '绝对值，支持 int/long/float/double 重载', '与参数类型相同'],
        ['Math.max(a, b)', '返回 a、b 中的较大值，支持四种数字类型', '与参数类型相同'],
        ['Math.min(a, b)', '返回 a、b 中的较小值', '与参数类型相同'],
        ['Math.pow(a, b)', '返回 a 的 b 次幂，即 a^b', 'double'],
        ['Math.sqrt(x)', '返回 x 的算术平方根（x >= 0）', 'double'],
        ['Math.cbrt(x)', '返回 x 的立方根', 'double'],
        ['Math.ceil(x)', '向上取整（天花板），返回 >= x 的最小整数（double 形式）', 'double'],
        ['Math.floor(x)', '向下取整（地板），返回 <= x 的最大整数（double 形式）', 'double'],
        ['Math.round(x)', '四舍五入，float 参数返回 int，double 参数返回 long', 'int 或 long'],
        ['Math.random()', '返回 [0.0, 1.0) 的随机 double', 'double'],
        ['Math.log(x)', '以 e 为底的自然对数 ln(x)', 'double'],
        ['Math.log10(x)', '以 10 为底的常用对数', 'double'],
      ]}
    />

    <Heading3>3. 常量：Math.PI 与 Math.E</Heading3>
    <Paragraph>
      <InlineCode>Math.PI</InlineCode> 是 Java 内置的最精确圆周率常量，
      计算圆的面积、周长时直接使用，无需自己定义 3.14。
    </Paragraph>
    <CodeBlock
      title="MathConstantDemo.java"
      code={`public class MathConstantDemo {
    public static void main(String[] args) {
        System.out.println("PI = " + Math.PI);
        System.out.println("E  = " + Math.E);

        double radius = 5.0;
        double area = Math.PI * radius * radius;
        double circumference = 2 * Math.PI * radius;
        System.out.printf("半径 %.1f 的圆：面积 = %.4f，周长 = %.4f%n",
                radius, area, circumference);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`PI = 3.141592653589793
E  = 2.718281828459045
半径 5.0 的圆：面积 = 78.5398，周长 = 31.4159`} />

    <Heading3>4. Math.abs() —— 绝对值</Heading3>
    <Paragraph>
      <InlineCode>Math.abs(x)</InlineCode> 返回 x 的绝对值，负数变正数，正数和 0 不变。
      支持 <InlineCode>int</InlineCode>、<InlineCode>long</InlineCode>、
      <InlineCode>float</InlineCode>、<InlineCode>double</InlineCode> 四种重载。
    </Paragraph>
    <CodeBlock
      title="MathAbsDemo.java"
      code={`public class MathAbsDemo {
    public static void main(String[] args) {
        System.out.println(Math.abs(-10));     // int 版本
        System.out.println(Math.abs(10));      // 正数不变
        System.out.println(Math.abs(-3.14));   // double 版本
        System.out.println(Math.abs(0));       // 0 的绝对值还是 0
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`10
10
3.14
0`} />

    <Heading3>5. Math.max() 与 Math.min() —— 极值</Heading3>
    <Paragraph>
      <InlineCode>Math.max(a, b)</InlineCode> 返回较大值，<InlineCode>Math.min(a, b)</InlineCode>
      返回较小值。两者都可以链式嵌套以比较更多数字。
    </Paragraph>
    <CodeBlock
      title="MathMaxMinDemo.java"
      code={`public class MathMaxMinDemo {
    public static void main(String[] args) {
        System.out.println(Math.max(10, 20));         // 20
        System.out.println(Math.min(10, 20));         // 10
        System.out.println(Math.max(-5, -3));         // -3（-3 更大）
        System.out.println(Math.min(3.5, 2.8));       // 2.8

        // 嵌套求三个数的最大值
        int a = 7, b = 15, c = 11;
        int maxOf3 = Math.max(a, Math.max(b, c));
        System.out.println("三数最大值：" + maxOf3);   // 15
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`20
10
-3
2.8
三数最大值：15`} />

    <Heading3>6. Math.pow() —— 幂运算</Heading3>
    <Paragraph>
      <InlineCode>Math.pow(a, b)</InlineCode> 计算 a 的 b 次幂，参数和返回值均为
      <InlineCode>double</InlineCode>。若需要整数结果，用强制类型转换
      <InlineCode>(int)</InlineCode> 或 <InlineCode>(long)</InlineCode> 处理。
    </Paragraph>
    <Callout type="warning" title="pow 返回 double，整数结果需强转">
      <InlineCode>Math.pow(2, 10)</InlineCode> 返回 <InlineCode>1024.0</InlineCode>（double），
      不是 <InlineCode>1024</InlineCode>（int）。
      需要整数时写 <InlineCode>(int) Math.pow(2, 10)</InlineCode>。
    </Callout>
    <CodeBlock
      title="MathPowDemo.java"
      code={`public class MathPowDemo {
    public static void main(String[] args) {
        System.out.println(Math.pow(2, 10));          // 1024.0
        System.out.println(Math.pow(3, 3));           // 27.0
        System.out.println(Math.pow(9, 0.5));         // 3.0（即根号 9）

        // 强转为 int 使用
        int result = (int) Math.pow(2, 8);
        System.out.println("2 的 8 次方 = " + result); // 256
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`1024.0
27.0
3.0
2 的 8 次方 = 256`} />

    <Heading3>7. Math.sqrt() —— 平方根</Heading3>
    <Paragraph>
      <InlineCode>Math.sqrt(x)</InlineCode> 返回 x 的非负平方根，参数和返回值都是
      <InlineCode>double</InlineCode>。传入负数会返回 <InlineCode>NaN</InlineCode>（Not a Number）。
    </Paragraph>
    <CodeBlock
      title="MathSqrtDemo.java"
      code={`public class MathSqrtDemo {
    public static void main(String[] args) {
        System.out.println(Math.sqrt(9));     // 3.0
        System.out.println(Math.sqrt(2));     // 1.4142135623730951
        System.out.println(Math.sqrt(0));     // 0.0
        System.out.println(Math.sqrt(-1));    // NaN（负数无实数平方根）
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`3.0
1.4142135623730951
0.0
NaN`} />

    <Heading3>8. ceil、floor、round —— 三种取整方式</Heading3>
    <Paragraph>
      这三个方法都能把小数处理为整数，但策略完全不同，是初学者最容易混淆的地方。
    </Paragraph>
    <Table
      head={['方法', '取整策略', '返回类型', '记忆口诀']}
      rows={[
        ['Math.ceil(x)', '向上取整：取 >= x 的最小整数（天花板）', 'double', '往大里取'],
        ['Math.floor(x)', '向下取整：取 <= x 的最大整数（地板）', 'double', '往小里取'],
        ['Math.round(x)', '四舍五入：加 0.5 再向下取整', 'int（float 参数）或 long（double 参数）', '加半往下'],
      ]}
    />
    <Callout type="warning" title="ceil 和 floor 返回 double，不是 int">
      <InlineCode>Math.ceil(3.2)</InlineCode> 返回 <InlineCode>4.0</InlineCode>，
      类型是 <InlineCode>double</InlineCode>，不是 <InlineCode>int 4</InlineCode>。
      需要整数时要强转：<InlineCode>(int) Math.ceil(3.2)</InlineCode>。
    </Callout>

    <Heading4>三种方法在不同输入下的对比</Heading4>
    <Table
      head={['输入 x', 'Math.ceil(x)', 'Math.floor(x)', 'Math.round(x)', '说明']}
      rows={[
        ['3.1', '4.0', '3.0', '3', '3.1 不到 3.5，round 取 3'],
        ['3.5', '4.0', '3.0', '4', '3.5 达到 0.5，round 取 4（五入）'],
        ['3.9', '4.0', '3.0', '4', '3.9 超过 3.5，round 取 4'],
        ['-3.1', '-3.0', '-4.0', '-3', '负数注意：ceil 往大取，floor 往小取'],
        ['-3.5', '-3.0', '-4.0', '-3', 'round(-3.5) = -3（加 0.5 得 -3.0，floor(-3.0)=-3）'],
        ['-3.9', '-3.0', '-4.0', '-4', 'round(-3.9) = -4（加 0.5 得 -3.4，floor(-3.4)=-4）'],
        ['5.0', '5.0', '5.0', '5', '整数值三者结果相同'],
      ]}
    />
    <Callout type="tip" title="round 的本质公式">
      <InlineCode>Math.round(x)</InlineCode> 等价于 <InlineCode>(long) Math.floor(x + 0.5)</InlineCode>。
      对于负数如 -3.5：-3.5 + 0.5 = -3.0，floor(-3.0) = -3.0，所以结果是 -3，
      这与"数学四舍五入"中 -3.5 取 -4 的定义不同，要特别注意。
    </Callout>
    <CodeBlock
      title="MathRoundingDemo.java"
      code={`public class MathRoundingDemo {
    public static void main(String[] args) {
        double[] values = {3.1, 3.5, 3.9, -3.1, -3.5, -3.9};

        System.out.printf("%-8s %-10s %-10s %-10s%n", "x", "ceil", "floor", "round");
        System.out.println("---------------------------------------------");
        for (double v : values) {
            System.out.printf("%-8.1f %-10.1f %-10.1f %-10d%n",
                    v, Math.ceil(v), Math.floor(v), Math.round(v));
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`x        ceil       floor      round
---------------------------------------------
3.1      4.0        3.0        3
3.5      4.0        3.0        4
3.9      4.0        3.0        4
-3.1     -3.0       -4.0       -3
-3.5     -3.0       -4.0       -3
-3.9     -3.0       -4.0       -4        `} />

    <Heading3>9. Math.random() —— 随机数</Heading3>
    <Paragraph>
      <InlineCode>Math.random()</InlineCode> 返回一个<Text bold>[0.0, 1.0) 范围内的随机 double</Text>，
      即包含 0.0，但不包含 1.0。通过简单的数学变换，可以生成任意整数区间的随机数。
    </Paragraph>
    <Table
      head={['目标范围', '公式', '示例']}
      rows={[
        ['[0, n) 的随机 int', '(int)(Math.random() * n)', '(int)(Math.random() * 10) → 0~9'],
        ['[1, n] 的随机 int', '(int)(Math.random() * n) + 1', '(int)(Math.random() * 6) + 1 → 1~6（骰子）'],
        ['[min, max] 的随机 int', '(int)(Math.random() * (max - min + 1)) + min', '[5, 10] → (int)(Math.random() * 6) + 5'],
      ]}
    />
    <CodeBlock
      title="MathRandomDemo.java"
      code={`public class MathRandomDemo {
    public static void main(String[] args) {
        // 原始 [0.0, 1.0) 随机数
        System.out.println(Math.random());

        // 生成 0~9 的随机整数
        int rand0to9 = (int) (Math.random() * 10);
        System.out.println("0~9 随机数：" + rand0to9);

        // 模拟掷骰子：1~6
        int dice = (int) (Math.random() * 6) + 1;
        System.out.println("骰子点数：" + dice);

        // 生成 50~100 之间的随机整数
        int rand50to100 = (int) (Math.random() * 51) + 50;
        System.out.println("50~100 随机数：" + rand50to100);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（示例，每次运行结果不同）" code={`0.7342918503621475
0~9 随机数：4
骰子点数：3
50~100 随机数：72`} />
    <Callout type="tip" title="需要更强的随机能力用 Random 类">
      <InlineCode>Math.random()</InlineCode> 底层使用 <InlineCode>java.util.Random</InlineCode>。
      若需要生成多种类型（nextInt、nextBoolean 等）或指定种子，直接使用
      <InlineCode>new Random()</InlineCode> 更灵活。
      <InlineCode>Math.random()</InlineCode> 适合简单场景，代码更简洁。
    </Callout>

    <Heading3>10. 综合示例</Heading3>
    <Paragraph>
      综合运用多个 Math 方法，计算直角三角形斜边长，并生成两个随机操作数进行求幂与取整演示。
    </Paragraph>
    <CodeBlock
      title="MathComprehensive.java"
      code={`public class MathComprehensive {
    public static void main(String[] args) {
        // 1. 勾股定理：斜边 = sqrt(a^2 + b^2)
        double a = 3, b = 4;
        double hypotenuse = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        System.out.printf("直角边 %.0f 和 %.0f，斜边 = %.2f%n", a, b, hypotenuse);

        // 2. 圆柱体积：PI * r^2 * h
        double r = 3.0, h = 7.0;
        double volume = Math.PI * Math.pow(r, 2) * h;
        System.out.printf("半径 %.1f 高 %.1f 的圆柱体积 = %.4f%n", r, h, volume);

        // 3. 取整对比
        double price = 9.3;
        System.out.println("价格 " + price + "：");
        System.out.println("  向上取整（ceil）  = " + (int) Math.ceil(price));
        System.out.println("  向下取整（floor） = " + (int) Math.floor(price));
        System.out.println("  四舍五入（round） = " + Math.round(price));

        // 4. 求绝对值差
        int x = -15, y = 8;
        int diff = Math.abs(x - y);
        System.out.println(x + " 与 " + y + " 的差的绝对值 = " + diff);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`直角边 3 和 4，斜边 = 5.00
半径 3.0 高 7.0 的圆柱体积 = 197.9203
价格 9.3：
  向上取整（ceil）  = 10
  向下取整（floor） = 9
  四舍五入（round） = 9
-15 与 8 的差的绝对值 = 23`} />
    <Paragraph>
      勾股定理中 3² + 4² = 9 + 16 = 25，sqrt(25) = 5.00，经典的 3-4-5 勾股数组。
      圆柱体积 = π × 3² × 7 = 63π ≈ 197.9203。
      价格 9.3 的 ceil 为 10.0（强转 int 后为 10），floor 为 9.0，round 为 9（9.3 &lt; 9.5，四舍）。
    </Paragraph>

    <Callout type="success" title="小结">
      <Paragraph>
        Math 工具类核心要点：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          位于 <InlineCode>java.lang</InlineCode>，无需导包；所有成员都是静态的，用
          <InlineCode>Math.xxx()</InlineCode> 调用。
        </ListItem>
        <ListItem>
          <InlineCode>Math.PI</InlineCode> 是精确圆周率常量，计算圆时优先使用。
        </ListItem>
        <ListItem>
          <InlineCode>Math.pow(a, b)</InlineCode> 和 <InlineCode>Math.sqrt(x)</InlineCode>
          返回 <InlineCode>double</InlineCode>，需要整数结果时记得强转。
        </ListItem>
        <ListItem>
          取整三剑客：<InlineCode>ceil</InlineCode> 往大取、<InlineCode>floor</InlineCode> 往小取、
          <InlineCode>round</InlineCode> 四舍五入；前两者返回 double，后者返回 int/long。
          负数行为要特别注意，尤其是 -3.5 的 round 结果是 -3 而非 -4。
        </ListItem>
        <ListItem>
          <InlineCode>Math.random()</InlineCode> 生成 [0.0, 1.0) 的随机数；
          乘以范围再强转 int，即可生成指定区间的随机整数。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>11. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：计算圆的面积与斜边"
      code={`// 要求：
// 1. 已知圆半径 r = 7，用 Math.PI 和 Math.pow() 计算面积，保留 2 位小数打印。
// 2. 已知直角边 a = 5，b = 12，用勾股定理算斜边，保留 2 位小数打印。

public class Exercise01 {
    public static void main(String[] args) {
        // 请在这里补全代码
    }
}`}
      answerCode={`public class Exercise01 {
    public static void main(String[] args) {
        // 圆面积
        double r = 7;
        double area = Math.PI * Math.pow(r, 2);
        System.out.printf("半径 %.0f 的圆面积 = %.2f%n", r, area);

        // 斜边（勾股定理）
        double a = 5, b = 12;
        double hypotenuse = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        System.out.printf("直角边 %.0f 和 %.0f，斜边 = %.2f%n", a, b, hypotenuse);
    }
}

/* 控制台输出：
半径 7 的圆面积 = 153.94
直角边 5 和 12，斜边 = 13.00

解析：面积 = PI * 7^2 = 153.938...，保留 2 位小数为 153.94；
      5^2 + 12^2 = 25 + 144 = 169，sqrt(169) = 13.00（经典勾股数 5-12-13）。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：取整三剑客对比"
      code={`// 要求：对 2.5、-2.5、7.9、-7.1 四个数，
// 分别用 ceil、floor、round 取整，打印对比结果。
// 格式示例：
// x=2.5:  ceil=3.0  floor=2.0  round=3

public class Exercise02 {
    public static void main(String[] args) {
        double[] values = {2.5, -2.5, 7.9, -7.1};
        // 请在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {
    public static void main(String[] args) {
        double[] values = {2.5, -2.5, 7.9, -7.1};
        for (double v : values) {
            System.out.printf("x=%.1f:  ceil=%.1f  floor=%.1f  round=%d%n",
                    v, Math.ceil(v), Math.floor(v), Math.round(v));
        }
    }
}

/* 控制台输出：
x=2.5:  ceil=3.0  floor=2.0  round=3
x=-2.5:  ceil=-2.0  floor=-3.0  round=-2
x=7.9:  ceil=8.0  floor=7.0  round=8
x=-7.1:  ceil=-7.0  floor=-8.0  round=-7

解析：
  2.5 → round = 3（加 0.5 = 3.0，floor = 3）
  -2.5 → round = -2（加 0.5 = -2.0，floor = -2），注意不是 -3！
  7.9 → round = 8（7.9 >= 7.5，五入）
  -7.1 → ceil = -7.0（往大取），floor = -8.0（往小取），round = -7
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：随机猜数游戏核心逻辑"
      code={`// 要求：
// 用 Math.random() 生成一个 1~100 的随机整数作为"答案"，
// 设定一个猜测值 guess = 58，
// 打印：
//   如果猜对：  "猜对了！答案是 xx"
//   如果猜小：  "猜小了！差了 xx"（用 Math.abs 求差值）
//   如果猜大：  "猜大了！差了 xx"

public class Exercise03 {
    public static void main(String[] args) {
        int answer = (int) (Math.random() * 100) + 1;
        int guess = 58;
        // 请在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {
    public static void main(String[] args) {
        int answer = (int) (Math.random() * 100) + 1;
        int guess = 58;
        System.out.println("答案是：" + answer + "，猜测：" + guess);
        if (guess == answer) {
            System.out.println("猜对了！答案是 " + answer);
        } else if (guess < answer) {
            System.out.println("猜小了！差了 " + Math.abs(answer - guess));
        } else {
            System.out.println("猜大了！差了 " + Math.abs(answer - guess));
        }
    }
}

/* 控制台输出（示例，answer 每次随机，以 answer=73 为例）：
答案是：73，猜测：58
猜小了！差了 15

解析：(int)(Math.random() * 100) + 1 生成 1~100 的随机整数；
      Math.abs(answer - guess) 保证差值永远是正数，无论猜大猜小都正确。
*/`}
    />
  </article>
);

export default index;
