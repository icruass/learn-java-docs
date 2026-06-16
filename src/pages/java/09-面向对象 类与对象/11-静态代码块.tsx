import React from 'react';
import ChapterExercises from "@/pages/java/练习题/ChapterExercises";
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
    <Title>静态代码块</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        除了构造方法和普通方法，Java 还提供了一种特殊的代码块：
        <Text bold>静态代码块（static initializer）</Text>。
        它在类第一次被加载时自动执行，且<Text bold>只执行一次</Text>，
        优先于任何构造方法和对象创建。
        本节讲清静态代码块的格式、执行时机、典型用途，
        并通过打印顺序的示例把"静态代码块 → 构造方法"这条执行次序演示得一清二楚。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是静态代码块</Heading3>
    <Paragraph>
      静态代码块是写在<Text bold>类中、方法外</Text>，以 <InlineCode>static</InlineCode> 开头的花括号代码块。
      它不是方法，没有名字，也不能被主动调用——由 JVM 在<Text bold>类加载时自动触发</Text>，
      并且无论之后创建多少个对象，它<Text bold>只执行一次</Text>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="静态代码块格式"
      code={`public class 类名 {

    // 静态代码块：写在类中、方法外
    static {
        // 只在类第一次加载时执行一次
        // 通常用于静态变量的复杂初始化
    }

    // 其他成员...
}`}
    />

    <Heading3>2. 执行时机与特点</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>类加载时执行</Text>：JVM 第一次使用这个类（创建对象、调用静态方法、
        访问静态变量等）时，会先加载该类，静态代码块在加载完成后立即执行。
      </ListItem>
      <ListItem>
        <Text bold>只执行一次</Text>：无论之后 <InlineCode>new</InlineCode> 多少个对象，
        静态代码块只在类加载时执行这一次，不会重复。
      </ListItem>
      <ListItem>
        <Text bold>优先于构造方法</Text>：静态代码块在构造方法之前执行；
        第一次 <InlineCode>new</InlineCode> 对象前，静态代码块已经跑完了。
      </ListItem>
      <ListItem>
        <Text bold>只能访问静态成员</Text>：静态代码块与静态方法一样，
        不依赖对象，因此只能直接访问静态变量和静态方法，不能访问实例成员。
      </ListItem>
      <ListItem>
        <Text bold>一个类可以有多个静态代码块</Text>：按照在源码中<Text bold>从上到下</Text>的顺序依次执行。
      </ListItem>
    </UnorderedList>

    <Heading3>3. 典型用途</Heading3>
    <Paragraph>
      静态代码块最常见的用途是对静态变量做<Text bold>一次性的复杂初始化</Text>——
      当初始化逻辑无法用一行赋值语句完成时（例如需要循环填充数组、加载配置文件、
      注册驱动等），就放进静态代码块里。
    </Paragraph>
    <UnorderedList>
      <ListItem>初始化静态数组或集合（填充默认数据）。</ListItem>
      <ListItem>加载数据库驱动（如 <InlineCode>Class.forName("com.mysql.jdbc.Driver")</InlineCode>）。</ListItem>
      <ListItem>读取配置文件，把结果保存到静态变量中。</ListItem>
      <ListItem>对静态变量做需要多步计算的赋值。</ListItem>
    </UnorderedList>

    <Heading3>4. 执行顺序：静态代码块 vs 构造方法</Heading3>
    <Paragraph>
      理解执行顺序是本节重点。下面先用表格梳理，再用代码精确验证：
    </Paragraph>
    <Table
      head={['步骤', '触发时机', '执行次数', '说明']}
      rows={[
        ['① 静态代码块', '类第一次被加载时', '只执行一次', '优先于一切对象操作'],
        ['② 构造方法', '每次 new 对象时', '每 new 一次执行一次', '在静态代码块之后执行'],
      ]}
    />
    <Callout type="tip" title="记忆口诀">
      <Text bold>静态先行，构造随行；静态只一次，构造次次有。</Text>
    </Callout>

    <Heading3>5. 示例代码</Heading3>
    <Heading4>示例 1：观察执行顺序（核心示例）</Heading4>
    <Paragraph>
      通过打印语句，清晰展示静态代码块、构造方法的执行先后顺序。
      重点观察：创建多个对象时，静态代码块只打印一次，构造方法每次都打印。
    </Paragraph>
    <CodeBlock
      title="OrderDemo.java"
      code={`public class OrderDemo {

    // 静态变量
    static String brand;

    // 静态代码块：类加载时执行，只执行一次
    static {
        brand = "Oracle";
        System.out.println("【静态代码块】执行了，brand = " + brand);
    }

    // 实例变量
    String name;

    // 构造方法：每次 new 对象时执行
    public OrderDemo(String name) {
        this.name = name;
        System.out.println("【构造方法】执行了，name = " + name);
    }

    public static void main(String[] args) {
        System.out.println("--- main 方法开始 ---");

        OrderDemo obj1 = new OrderDemo("第一个对象");
        OrderDemo obj2 = new OrderDemo("第二个对象");
        OrderDemo obj3 = new OrderDemo("第三个对象");

        System.out.println("--- main 方法结束 ---");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`--- main 方法开始 ---
【静态代码块】执行了，brand = Oracle
【构造方法】执行了，name = 第一个对象
【构造方法】执行了，name = 第二个对象
【构造方法】执行了，name = 第三个对象
--- main 方法结束 ---`}
    />
    <Paragraph>
      关键观察：静态代码块只打印了<Text bold>一次</Text>（第一次 new 之前），
      而构造方法打印了<Text bold>三次</Text>（每次 new 各执行一次）。
      这精确验证了"静态代码块只执行一次，且优先于构造方法"的规则。
    </Paragraph>

    <Heading4>示例 2：静态代码块用于复杂初始化</Heading4>
    <Paragraph>
      用静态代码块初始化一个静态整数数组，填入 1 到 5 的平方值。
      这种多步逻辑写在赋值语句里不方便，放进静态代码块恰到好处。
    </Paragraph>
    <CodeBlock
      title="SquareTable.java"
      code={`public class SquareTable {

    // 静态数组：存放 1~5 的平方
    static int[] squares = new int[5];

    // 静态代码块：循环填充数组，只做一次
    static {
        System.out.println("【静态代码块】初始化平方表...");
        for (int i = 0; i < squares.length; i++) {
            squares[i] = (i + 1) * (i + 1);
        }
    }

    // 静态方法：查询某数的平方（下标从 0 开始，查 1~5 的平方）
    public static int getSquare(int n) {
        if (n < 1 || n > 5) {
            return -1;
        }
        return squares[n - 1];
    }

    public static void main(String[] args) {
        System.out.println("3 的平方 = " + SquareTable.getSquare(3));
        System.out.println("5 的平方 = " + SquareTable.getSquare(5));
        System.out.println("再次查询 2 的平方 = " + SquareTable.getSquare(2));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`【静态代码块】初始化平方表...
3 的平方 = 9
5 的平方 = 25
再次查询 2 的平方 = 4`}
    />
    <Paragraph>
      静态代码块只在类加载时执行一次，后续无论调用多少次
      <InlineCode>getSquare()</InlineCode>，都直接使用已经初始化好的
      <InlineCode>squares</InlineCode> 数组，不会重复初始化，效率高。
    </Paragraph>

    <Heading4>示例 3：多个静态代码块——按顺序执行</Heading4>
    <Paragraph>
      一个类中可以定义多个静态代码块，JVM 会按照它们在源码中<Text bold>从上到下</Text>的顺序依次执行。
    </Paragraph>
    <CodeBlock
      title="MultiStaticBlock.java"
      code={`public class MultiStaticBlock {

    static int value;

    // 第一个静态代码块
    static {
        value = 10;
        System.out.println("第一个静态代码块，value = " + value);
    }

    // 第二个静态代码块（在第一个之后执行）
    static {
        value = value * 2;
        System.out.println("第二个静态代码块，value = " + value);
    }

    public MultiStaticBlock() {
        System.out.println("构造方法，value = " + value);
    }

    public static void main(String[] args) {
        System.out.println("创建第一个对象：");
        new MultiStaticBlock();
        System.out.println("创建第二个对象：");
        new MultiStaticBlock();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`第一个静态代码块，value = 10
第二个静态代码块，value = 20
创建第一个对象：
构造方法，value = 20
创建第二个对象：
构造方法，value = 20`}
    />
    <Paragraph>
      两个静态代码块在类加载时按顺序执行完毕（先 10，再变成 20），
      之后创建两个对象各自触发构造方法，但静态代码块<Text bold>不再重复执行</Text>。
    </Paragraph>

    <Heading4>示例 4：静态代码块 vs 构造方法——综合对比</Heading4>
    <Paragraph>
      加入实例代码块（非静态初始化块），完整展示三者的执行顺序：
      <Text bold>静态代码块（一次） → 实例代码块（每次 new） → 构造方法（每次 new）</Text>。
      了解实例代码块即可，实际开发中较少使用。
    </Paragraph>
    <CodeBlock
      title="InitOrderDemo.java"
      code={`public class InitOrderDemo {

    // 静态代码块：类加载时执行，只执行一次
    static {
        System.out.println("① 静态代码块（类加载，只一次）");
    }

    // 实例代码块（非静态）：每次 new 对象时执行，在构造方法之前
    {
        System.out.println("② 实例代码块（每次 new 执行）");
    }

    // 构造方法：每次 new 对象时执行，在实例代码块之后
    public InitOrderDemo() {
        System.out.println("③ 构造方法（每次 new 执行）");
    }

    public static void main(String[] args) {
        System.out.println("=== 第一次 new ===");
        new InitOrderDemo();
        System.out.println("=== 第二次 new ===");
        new InitOrderDemo();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`① 静态代码块（类加载，只一次）
=== 第一次 new ===
② 实例代码块（每次 new 执行）
③ 构造方法（每次 new 执行）
=== 第二次 new ===
② 实例代码块（每次 new 执行）
③ 构造方法（每次 new 执行）`}
    />
    <Paragraph>
      输出精确展示了三段代码的执行顺序：静态代码块在类加载时最先执行，且只执行一次；
      第二次 <InlineCode>new</InlineCode> 时，静态代码块<Text bold>不再打印</Text>，
      只有实例代码块和构造方法各执行一次。
    </Paragraph>

    <Table
      head={['代码块类型', '格式', '执行时机', '执行次数']}
      rows={[
        ['静态代码块', 'static { ... }', '类第一次加载时', '只执行一次'],
        ['实例代码块', '{ ... }（无 static）', '每次 new 对象时，在构造方法前', '每 new 一次执行一次'],
        ['构造方法', 'public 类名() { ... }', '每次 new 对象时，在实例代码块后', '每 new 一次执行一次'],
      ]}
    />

    <Callout type="success" title="小结">
      <Paragraph>
        静态代码块核心要点：
      </Paragraph>
      <UnorderedList>
        <ListItem>格式：<InlineCode>static {'{'} ... {'}'}</InlineCode>，写在类中、方法外。</ListItem>
        <ListItem>执行时机：类第一次被加载时自动执行，<Text bold>只执行一次</Text>。</ListItem>
        <ListItem>执行顺序：<Text bold>静态代码块 → 构造方法</Text>（静态永远先行）。</ListItem>
        <ListItem>用途：对静态变量做复杂的一次性初始化，例如填充数组、加载驱动等。</ListItem>
        <ListItem>多个静态代码块按源码中从上到下的顺序依次执行。</ListItem>
        <ListItem>只能直接访问静态成员，不能访问实例成员（与静态方法规则相同）。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：预测执行顺序与输出"
      code={`// 问：下面代码的控制台输出是什么？请逐行分析。

public class Quiz1 {

    static int num;

    static {
        num = 5;
        System.out.println("静态块 A，num = " + num);
    }

    static {
        num = num + 3;
        System.out.println("静态块 B，num = " + num);
    }

    public Quiz1() {
        System.out.println("构造方法，num = " + num);
    }

    public static void main(String[] args) {
        new Quiz1();
        new Quiz1();
    }
}`}
      answerCode={`/* 控制台输出：
静态块 A，num = 5
静态块 B，num = 8
构造方法，num = 8
构造方法，num = 8

逐步分析：
  类加载时先执行静态块 A：num = 5，打印"静态块 A，num = 5"。
  紧接着执行静态块 B：num = 5 + 3 = 8，打印"静态块 B，num = 8"。
  两个静态块合计只执行这一次。
  第一次 new Quiz1()：执行构造方法，打印"构造方法，num = 8"。
  第二次 new Quiz1()：再次执行构造方法，打印"构造方法，num = 8"。
  注意：两次 new 时静态块不会重复执行。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：用静态代码块初始化数组"
      code={`// 要求：定义 DayNames 类，包含：
//   - 静态 String 数组 days，长度为 7
//   - 在静态代码块中依次赋值：
//       "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
//   - 静态方法 getDayName(int n)，n 从 1 到 7，返回对应星期几的名称，
//     超出范围返回 "Unknown"
// 在 main 里测试 getDayName(1)、getDayName(5)、getDayName(7)、getDayName(8)。

public class DayNames {

    static String[] days = new String[7];

    static {
        // 补全静态代码块
    }

    public static String getDayName(int n) {
        // 补全方法
    }

    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`public class DayNames {

    static String[] days = new String[7];

    static {
        days[0] = "Monday";
        days[1] = "Tuesday";
        days[2] = "Wednesday";
        days[3] = "Thursday";
        days[4] = "Friday";
        days[5] = "Saturday";
        days[6] = "Sunday";
        System.out.println("【静态代码块】星期名称表初始化完成");
    }

    public static String getDayName(int n) {
        if (n < 1 || n > 7) {
            return "Unknown";
        }
        return days[n - 1];
    }

    public static void main(String[] args) {
        System.out.println(DayNames.getDayName(1));  // Monday
        System.out.println(DayNames.getDayName(5));  // Friday
        System.out.println(DayNames.getDayName(7));  // Sunday
        System.out.println(DayNames.getDayName(8));  // Unknown
    }
}

/* 控制台输出：
【静态代码块】星期名称表初始化完成
Monday
Friday
Sunday
Unknown

解析：静态代码块在类加载时执行一次，把 days 数组填满；
      后续多次调用 getDayName() 直接读取已初始化好的数组，不会重复初始化。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：综合——静态代码块与构造方法执行次数对比"
      code={`// 要求：定义 Robot 类：
//   - 静态变量 model（String），在静态代码块中赋值为 "RX-100"，并打印 "型号已初始化：RX-100"
//   - 实例变量 robotId（int）
//   - 静态变量 nextId（int），初始值为 1
//   - 构造方法：把 nextId 赋给 robotId，然后 nextId++，打印 "机器人 RX-100 #<robotId> 创建完成"
//   - 在 main 里依次创建 3 个 Robot 对象
// 预测并验证：静态代码块打印几次？构造方法打印几次？

public class Robot {

    // 补全代码

    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`public class Robot {

    static String model;
    static int nextId = 1;
    int robotId;

    static {
        model = "RX-100";
        System.out.println("型号已初始化：" + model);
    }

    public Robot() {
        robotId = nextId;
        nextId++;
        System.out.println("机器人 " + model + " #" + robotId + " 创建完成");
    }

    public static void main(String[] args) {
        new Robot();
        new Robot();
        new Robot();
    }
}

/* 控制台输出：
型号已初始化：RX-100
机器人 RX-100 #1 创建完成
机器人 RX-100 #2 创建完成
机器人 RX-100 #3 创建完成

解析：
  静态代码块只打印了 1 次（类加载时执行一次）。
  构造方法打印了 3 次（每次 new 执行一次）。
  nextId 是静态变量，三个对象共享，依次递增，所以编号分别是 1、2、3。
*/`}
    />
    <ChapterExercises categoryKey="oop" />
  </article>
);

export default index;
