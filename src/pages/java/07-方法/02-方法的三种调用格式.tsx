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
    <Title>方法的三种调用格式</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        定义好方法之后，如何使用它？Java 提供了三种调用方式：
        <Text bold>单独调用</Text>、<Text bold>打印调用</Text>、<Text bold>赋值调用</Text>。
        三种方式各有适用场景，并且<Text bold>有无返回值决定了哪些方式可以使用</Text>。
        本节把三种格式逐一讲清楚，并重点说明 void 方法的限制及常见编译报错。
      </Paragraph>
    </Callout>

    <Heading3>1. 三种调用方式概览</Heading3>
    <Table
      head={['调用方式', '语法格式', '典型使用场景']}
      rows={[
        ['单独调用', '方法名(实参);', '只需要方法的副作用（打印、修改数据），不需要返回值'],
        ['打印调用', 'System.out.println(方法名(实参));', '直接打印返回结果，无需中间变量'],
        ['赋值调用', '数据类型 变量名 = 方法名(实参);', '把返回值保存起来供后续逻辑使用'],
      ]}
    />

    <Heading3>2. 单独调用</Heading3>
    <Paragraph>
      单独调用是最简单的形式：把方法调用写成一条独立语句，末尾加分号。
      如果方法有返回值，该返回值会被<Text bold>直接丢弃</Text>，不保存也不打印。
      这种方式最常用于 <InlineCode>void</InlineCode> 方法，因为 void 方法本来就没有返回值。
    </Paragraph>
    <CodeBlock
      title="CallAlone.java"
      code={`public class CallAlone {

    // void 方法：打印问候语
    public static void greet(String name) {
        System.out.println("你好，" + name + "！");
    }

    // 有返回值的方法：求两数之和
    public static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        greet("小明");       // 单独调用 void 方法，标准用法
        greet("小红");

        add(3, 5);          // 单独调用有返回值的方法，合法，但返回值 8 被丢弃
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`你好，小明！
你好，小红！`} />
    <Paragraph>
      <InlineCode>add(3, 5)</InlineCode> 虽然合法，但返回值 8 被丢弃，没有任何实际意义。
      在实际开发中，有返回值的方法几乎都会用打印调用或赋值调用。
    </Paragraph>

    <Heading3>3. 打印调用</Heading3>
    <Paragraph>
      把方法调用直接放进 <InlineCode>System.out.println()</InlineCode> 的括号里。
      Java 先执行内层方法得到返回值，再把该返回值传给 <InlineCode>println</InlineCode> 打印。
      适合只需查看结果、不需要保存的场景，代码最简洁。
    </Paragraph>
    <CodeBlock
      title="CallPrint.java"
      code={`public class CallPrint {

    public static int multiply(int a, int b) {
        return a * b;
    }

    public static boolean isEven(int n) {
        return n % 2 == 0;
    }

    public static String getGrade(int score) {
        if (score >= 90) return "优秀";
        if (score >= 60) return "及格";
        return "不及格";
    }

    public static void main(String[] args) {
        System.out.println(multiply(6, 7));   // 先算 6*7=42，再打印 42
        System.out.println(isEven(10));        // 先算 true，再打印 true
        System.out.println(getGrade(85));      // 先得到 "及格"，再打印
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`42
true
及格`} />

    <Heading3>4. 赋值调用</Heading3>
    <Paragraph>
      把方法的返回值赋给一个变量保存起来，后续代码可以多次引用该变量，
      也可以在赋值之后继续做计算或条件判断。
      这是三种方式中<Text bold>最灵活</Text>的一种。
    </Paragraph>
    <CodeBlock
      title="CallAssign.java"
      code={`public class CallAssign {

    public static int square(int n) {
        return n * n;
    }

    public static double average(int a, int b, int c) {
        return (a + b + c) / 3.0;
    }

    public static void main(String[] args) {
        // 赋值调用：保存返回值供后续使用
        int sq = square(9);
        System.out.println("9 的平方：" + sq);
        System.out.println("平方的两倍：" + (sq * 2));   // 多次使用 sq

        double avg = average(80, 90, 70);
        System.out.println("平均分：" + avg);
        if (avg >= 80) {
            System.out.println("平均分达到 80，成绩良好！");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`9 的平方：81
平方的两倍：162
平均分：80.0
平均分达到 80，成绩良好！`} />
    <Paragraph>
      <InlineCode>sq</InlineCode> 保存了 <InlineCode>square(9)</InlineCode> 的结果 81，
      后续两行分别打印了 <InlineCode>sq</InlineCode> 和 <InlineCode>sq * 2</InlineCode>，
      而不需要重复调用方法。
    </Paragraph>

    <Heading3>5. void 方法的调用限制</Heading3>
    <Paragraph>
      <InlineCode>void</InlineCode> 方法<Text bold>没有返回值</Text>，因此：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>可以</Text>单独调用——这是 void 方法唯一合法的调用方式。
      </ListItem>
      <ListItem>
        <Text bold>不能</Text>放进 <InlineCode>System.out.println()</InlineCode> 里打印——没有值可打印，编译直接报错。
      </ListItem>
      <ListItem>
        <Text bold>不能</Text>赋值给变量——没有值可赋，编译直接报错。
      </ListItem>
    </UnorderedList>
    <Callout type="danger" title="void 方法放进 println 或用于赋值会编译报错">
      <CodeBlock
        title="错误示范（无法编译通过）"
        code={`public class VoidError {

    public static void sayHello() {
        System.out.println("Hello!");
    }

    public static void main(String[] args) {
        // 错误 1：void 方法放进 println——void 无法提供值
        System.out.println(sayHello());   // 编译错误

        // 错误 2：void 方法赋值给变量——void 无法赋给 int
        int x = sayHello();               // 编译错误
    }
}`}
      />
      <Paragraph>
        两行错误的共同原因：<InlineCode>void</InlineCode> 就是"什么都不返回"，
        自然无法被 <InlineCode>println</InlineCode> 打印，也无法被赋给任何变量。
      </Paragraph>
    </Callout>

    <Heading3>6. 三种调用方式综合对比</Heading3>
    <Table
      head={['调用方式', '有返回值方法', 'void 方法', '备注']}
      rows={[
        ['单独调用', '合法（返回值被丢弃）', '合法，最常用', '有返回值时一般不建议单独调用，浪费计算'],
        ['打印调用', '合法', '编译报错', 'println 需要有值的表达式，void 不满足'],
        ['赋值调用', '合法', '编译报错', '变量赋值需要一个具体的值，void 不满足'],
      ]}
    />

    <Heading3>7. 综合示例</Heading3>
    <Paragraph>
      用同一个有返回值的方法 <InlineCode>calcSum</InlineCode> 演示三种调用方式，
      再用 <InlineCode>void</InlineCode> 方法说明只能单独调用。
    </Paragraph>
    <CodeBlock
      title="ThreeCallWays.java"
      code={`public class ThreeCallWays {

    // 有返回值：求两数之和
    public static int calcSum(int a, int b) {
        return a + b;
    }

    // void：打印分隔线
    public static void printLine() {
        System.out.println("----------");
    }

    public static void main(String[] args) {
        // ① 单独调用（返回值被丢弃，实际开发少用）
        calcSum(1, 2);

        // ② 打印调用（最简洁，直接看结果）
        System.out.println(calcSum(10, 20));

        // ③ 赋值调用（保存结果，灵活使用）
        int result = calcSum(100, 200);
        System.out.println("赋值结果：" + result);
        System.out.println("结果加 50：" + (result + 50));

        printLine();   // void 方法只能单独调用
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`30
赋值结果：300
结果加 50：350
----------`} />
    <Callout type="tip" title="如何选择调用方式">
      <UnorderedList>
        <ListItem>方法是 <InlineCode>void</InlineCode>：只能单独调用。</ListItem>
        <ListItem>只需打印结果、不需要保存：打印调用，最简洁。</ListItem>
        <ListItem>需要保存结果以便后续计算或判断：赋值调用。</ListItem>
        <ListItem>只关心副作用、不需要返回值（少见）：可以单独调用。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：判断哪些调用方式合法"
      code={`// 给定以下两个方法：
//   public static int cube(int n)   { return n * n * n; }
//   public static void printLine() { System.out.println("---"); }
//
// 逐一判断下列调用是否合法，若非法请说明原因：
//
// A: cube(3);
// B: System.out.println(cube(3));
// C: int x = cube(3);
// D: System.out.println(printLine());
// E: printLine();
// F: String s = printLine();`}
      answerCode={`// A: cube(3);
//    合法。单独调用，返回值 27 被丢弃。
//
// B: System.out.println(cube(3));
//    合法。打印调用，cube(3)=27，打印 27。
//
// C: int x = cube(3);
//    合法。赋值调用，x = 27。
//
// D: System.out.println(printLine());
//    编译报错。printLine() 是 void，没有返回值，
//    println 需要一个有值的表达式。
//
// E: printLine();
//    合法。void 方法单独调用，标准用法。
//
// F: String s = printLine();
//    编译报错。void 没有值可以赋给 String 变量。

/* 总结：
   cube（有返回值）：A、B、C 三种全部合法
   printLine（void）：只有 E 合法，D 和 F 编译报错
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：三种方式各用一次"
      code={`// 已有方法 getMax(int a, int b) 返回两数中较大值（int）。
// 在 main 里：
//   ① 打印调用：打印 getMax(15, 8) 的结果
//   ② 赋值调用：保存 getMax(100, 200) 的结果，再判断是否大于 150 并打印提示
//   ③ 单独调用：调用 getMax(3, 7)（演示用，返回值被丢弃）

public class Exercise02 {

    public static int getMax(int a, int b) {
        return a >= b ? a : b;
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {

    public static int getMax(int a, int b) {
        return a >= b ? a : b;
    }

    public static void main(String[] args) {
        // ① 打印调用
        System.out.println(getMax(15, 8));

        // ② 赋值调用
        int max = getMax(100, 200);
        if (max > 150) {
            System.out.println(max + " 大于 150");
        }

        // ③ 单独调用（返回值被丢弃）
        getMax(3, 7);
    }
}

/* 控制台输出：
15
200 大于 150

解析：
  ① getMax(15,8) 返回 15，println 打印 15。
  ② getMax(100,200) 返回 200，200>150 为 true，打印提示。
  ③ getMax(3,7) 返回 7 被丢弃，无输出。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：找出并修复 void 调用错误"
      code={`// 下面的代码有两处编译错误，请找出并修复。

public class Exercise03 {

    public static void printDouble(int n) {
        System.out.println(n * 2);
    }

    public static int triple(int n) {
        return n * 3;
    }

    public static void main(String[] args) {
        int a = printDouble(5);              // 第一处错误
        System.out.println(printDouble(6));  // 第二处错误
        System.out.println(triple(4));
    }
}`}
      answerCode={`public class Exercise03 {

    public static void printDouble(int n) {
        System.out.println(n * 2);
    }

    public static int triple(int n) {
        return n * 3;
    }

    public static void main(String[] args) {
        // 修复一：void 不能赋值，改为单独调用
        printDouble(5);

        // 修复二：void 不能放进 println，改为单独调用
        printDouble(6);

        System.out.println(triple(4));
    }
}

/* 控制台输出：
10
12
12

解析：
  printDouble(5) 在方法内打印 5*2=10。
  printDouble(6) 在方法内打印 6*2=12。
  triple(4) 返回 12，println 打印 12。
*/`}
    />
  </article>
);

export default index;
