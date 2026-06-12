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
    <Title>Scanner 键盘输入</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        之前的程序数据都是直接写死在代码里的，运行结果固定不变。
        <Text bold>Scanner</Text> 类让程序可以在运行时从控制台读取用户输入，
        实现真正的"人机交互"。本节讲清 Scanner 的三步使用流程，
        梳理四个常用输入方法的区别与适用场景，
        并特别说明 <InlineCode>nextInt()</InlineCode> 后接 <InlineCode>nextLine()</InlineCode> 的换行残留陷阱。
      </Paragraph>
    </Callout>

    <Heading3>1. Scanner 的三步使用流程</Heading3>
    <Paragraph>
      Scanner 是 <InlineCode>java.util</InlineCode> 包中的类，使用前必须完成三步：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>导包</Text>：在类定义之前写 <InlineCode>import java.util.Scanner;</InlineCode>
      </ListItem>
      <ListItem>
        <Text bold>创建对象</Text>：<InlineCode>Scanner sc = new Scanner(System.in);</InlineCode>
        —— <InlineCode>System.in</InlineCode> 代表标准输入（键盘）
      </ListItem>
      <ListItem>
        <Text bold>调用方法接收输入</Text>：根据需要接收的数据类型，调用对应的方法
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="text"
      title="Scanner 三步格式"
      code={`// 第一步：导包
import java.util.Scanner;

// 第二步：创建对象（写在 main 方法内）
Scanner sc = new Scanner(System.in);

// 第三步：调用方法
int n = sc.nextInt();          // 接收整数
double d = sc.nextDouble();    // 接收小数
String word = sc.next();       // 接收单词（遇空白结束）
String line = sc.nextLine();   // 接收整行（遇回车结束）`}
    />
    <Callout type="tip" title="变量名 sc 只是约定">
      <InlineCode>sc</InlineCode> 是惯例命名，你完全可以写 <InlineCode>scanner</InlineCode> 或
      <InlineCode>input</InlineCode>。重要的是：同一个 <InlineCode>Scanner</InlineCode> 对象可以反复调用多次，
      不需要每次都 <InlineCode>new</InlineCode> 一个新的。
    </Callout>

    <Heading3>2. 常用方法对比</Heading3>
    <Table
      head={['方法', '接收类型', '遇到什么停止', '注意点']}
      rows={[
        ['nextInt()', 'int 整数', '遇到空白（空格/Tab/回车）停止，但不消耗回车', '输入非整数会抛出异常'],
        ['nextDouble()', 'double 小数', '遇到空白停止，不消耗回车', '整数输入也能接收，会转为 double'],
        ['next()', 'String（单词）', '遇到空白停止，不消耗回车', '不能接收含空格的字符串'],
        ['nextLine()', 'String（整行）', '遇到回车停止，同时消耗回车', '能接收含空格的整行，注意换行残留问题'],
      ]}
    />
    <Paragraph>
      <Text bold>最关键的区别</Text>：<InlineCode>nextInt()</InlineCode>、<InlineCode>nextDouble()</InlineCode>、
      <InlineCode>next()</InlineCode> 读取完数据后，<Text bold>不消耗回车符</Text>，回车符还留在缓冲区里。
      而 <InlineCode>nextLine()</InlineCode> 会<Text bold>消耗回车符</Text>，直到读到回车才停止并将回车丢弃。
    </Paragraph>

    <Heading3>3. 示例代码</Heading3>

    <Heading4>示例 1：接收整数，计算两数之和</Heading4>
    <CodeBlock
      title="SumDemo.java"
      code={`import java.util.Scanner;

public class SumDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("请输入第一个整数：");
        int a = sc.nextInt();

        System.out.print("请输入第二个整数：");
        int b = sc.nextInt();

        int sum = a + b;
        System.out.println(a + " + " + b + " = " + sum);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`请输入第一个整数：15
请输入第二个整数：27
15 + 27 = 42`} />
    <Paragraph>
      程序运行到 <InlineCode>sc.nextInt()</InlineCode> 时会暂停，等待用户在控制台输入数字并按回车。
      输入完成后，<InlineCode>nextInt()</InlineCode> 读取整数部分，程序继续往下执行。
    </Paragraph>

    <Heading4>示例 2：接收三个数，找最大值</Heading4>
    <CodeBlock
      title="MaxDemo.java"
      code={`import java.util.Scanner;

public class MaxDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("请依次输入三个整数（每个按回车确认）：");
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();

        int max = a;
        if (b > max) max = b;
        if (c > max) max = c;

        System.out.println("三个数中最大值为：" + max);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`请依次输入三个整数（每个按回车确认）：
34
89
56
三个数中最大值为：89`} />
    <Paragraph>
      连续调用三次 <InlineCode>nextInt()</InlineCode>，每次等用户按回车后读取一个整数。
      三次输入也可以写在同一行用空格分隔（如 <InlineCode>34 89 56</InlineCode>），
      <InlineCode>nextInt()</InlineCode> 会依次读取，空格是天然的分隔符。
    </Paragraph>

    <Heading4>示例 3：nextDouble 与 next 接收字符串</Heading4>
    <CodeBlock
      title="StudentInfo.java"
      code={`import java.util.Scanner;

public class StudentInfo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("请输入姓名（单个词）：");
        String name = sc.next();           // 遇空白停止，不能含空格

        System.out.print("请输入成绩（小数）：");
        double score = sc.nextDouble();

        System.out.println("姓名：" + name + "，成绩：" + score);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`请输入姓名（单个词）：LiMing
请输入成绩（小数）：92.5
姓名：LiMing，成绩：92.5`} />

    <Heading4>示例 4：nextLine 接收含空格的整行</Heading4>
    <CodeBlock
      title="SentenceDemo.java"
      code={`import java.util.Scanner;

public class SentenceDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("请输入一句话：");
        String sentence = sc.nextLine();   // 读取整行，包含空格

        System.out.println("你输入的是：" + sentence);
        System.out.println("字符数（含空格）：" + sentence.length());
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`请输入一句话：Hello Java World
你输入的是：Hello Java World
字符数（含空格）：15`} />

    <Heading3>4. 换行残留陷阱：nextInt() 后接 nextLine()</Heading3>
    <Callout type="danger" title="nextInt() 不消耗回车，nextLine() 会立即读到空行">
      <Paragraph>
        <InlineCode>nextInt()</InlineCode>（以及 <InlineCode>nextDouble()</InlineCode>、
        <InlineCode>next()</InlineCode>）读取完数据后，用户按下的那个<Text bold>回车符仍然留在输入缓冲区</Text>中。
        紧接着调用 <InlineCode>nextLine()</InlineCode> 时，它会把这个残留的回车符当作一整行，
        立即返回一个<Text bold>空字符串</Text>，根本来不及等用户输入新内容。
      </Paragraph>
    </Callout>

    <Heading4>错误示范（出现空行问题）</Heading4>
    <CodeBlock
      title="BugDemo.java（有问题）"
      code={`import java.util.Scanner;

public class BugDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("请输入年龄：");
        int age = sc.nextInt();       // 用户输入 18 并回车，回车残留在缓冲区

        System.out.print("请输入姓名：");
        String name = sc.nextLine();  // 直接读到残留的回车，name = ""，没有等用户输入！

        System.out.println("年龄：" + age + "，姓名：" + name);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（出现 bug）" code={`请输入年龄：18
请输入姓名：
年龄：18，姓名：`} />
    <Paragraph>
      可以看到"请输入姓名："提示刚打印出来就立刻结束了，
      <InlineCode>name</InlineCode> 得到的是空字符串，根本没有等用户输入。
    </Paragraph>

    <Heading4>解决方案：在 nextLine() 之前多调用一次 nextLine() 消耗残留回车</Heading4>
    <CodeBlock
      title="FixDemo.java（已修复）"
      code={`import java.util.Scanner;

public class FixDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("请输入年龄：");
        int age = sc.nextInt();
        sc.nextLine();            // 消耗残留的回车符，不使用返回值

        System.out.print("请输入姓名：");
        String name = sc.nextLine();  // 现在才会正确等待用户输入整行

        System.out.println("年龄：" + age + "，姓名：" + name);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（修复后）" code={`请输入年龄：18
请输入姓名：Li Ming
年龄：18，姓名：Li Ming`} />
    <Callout type="tip" title="记忆规则">
      <UnorderedList>
        <ListItem>如果后面只用 <InlineCode>nextInt()</InlineCode> / <InlineCode>nextDouble()</InlineCode> / <InlineCode>next()</InlineCode>，无需特别处理。</ListItem>
        <ListItem>如果在 <InlineCode>nextInt()</InlineCode> 等方法之后要调用 <InlineCode>nextLine()</InlineCode>，先多写一行 <InlineCode>sc.nextLine();</InlineCode> 消耗残留回车。</ListItem>
        <ListItem>如果全程只用 <InlineCode>nextLine()</InlineCode>，读取整数时可以用 <InlineCode>Integer.parseInt(sc.nextLine())</InlineCode> 转换，完全避开此问题。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5. 综合示例：简单学生信息录入</Heading3>
    <CodeBlock
      title="StudentInput.java"
      code={`import java.util.Scanner;

public class StudentInput {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("请输入学号：");
        int id = sc.nextInt();
        sc.nextLine();                     // 消耗残留回车

        System.out.print("请输入姓名（可含空格）：");
        String name = sc.nextLine();

        System.out.print("请输入平均分：");
        double avg = sc.nextDouble();

        System.out.println("-------- 录入结果 --------");
        System.out.println("学号：" + id);
        System.out.println("姓名：" + name);
        System.out.println("平均分：" + avg);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`请输入学号：1001
请输入姓名（可含空格）：Zhang San
请输入平均分：88.5
-------- 录入结果 --------
学号：1001
姓名：Zhang San
平均分：88.5`} />
    <Callout type="success" title="小结">
      <Paragraph>Scanner 核心要点：</Paragraph>
      <UnorderedList>
        <ListItem>三步：<InlineCode>import java.util.Scanner;</InlineCode> → <InlineCode>Scanner sc = new Scanner(System.in);</InlineCode> → 调用 <InlineCode>sc.nextXxx()</InlineCode> 方法。</ListItem>
        <ListItem><InlineCode>nextInt()</InlineCode>/<InlineCode>nextDouble()</InlineCode>/<InlineCode>next()</InlineCode> 不消耗回车；<InlineCode>nextLine()</InlineCode> 消耗回车读整行。</ListItem>
        <ListItem>在 <InlineCode>nextInt()</InlineCode> 等之后紧接 <InlineCode>nextLine()</InlineCode>，需先多调用一次 <InlineCode>sc.nextLine();</InlineCode> 消耗残留回车。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：计算矩形面积"
      code={`// 要求：用 Scanner 从键盘读取矩形的宽（整数）和高（整数），
// 计算并打印面积。

public class RectArea {
    public static void main(String[] args) {
        // 请在这里补全代码（import 写在类外面）
    }
}`}
      answerCode={`import java.util.Scanner;

public class RectArea {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("请输入宽度：");
        int width = sc.nextInt();

        System.out.print("请输入高度：");
        int height = sc.nextInt();

        int area = width * height;
        System.out.println("矩形面积 = " + width + " * " + height + " = " + area);
    }
}

/* 控制台输出（用户输入 6 和 4）：
请输入宽度：6
请输入高度：4
矩形面积 = 6 * 4 = 24

解析：两次 nextInt() 连续调用，第一次读取宽度，第二次读取高度，
      均在用户按回车后返回，乘积即为面积。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：输入姓名和年龄，格式化输出"
      code={`// 要求：先用 nextLine() 读取姓名（可含空格），再用 nextInt() 读取年龄，
// 最后打印 "姓名：xxx，年龄：xx 岁"。
// 注意：本题先读姓名再读年龄，顺序与常见陷阱相反，不需要额外处理。

public class NameAge {
    public static void main(String[] args) {
        // 请在这里补全代码
    }
}`}
      answerCode={`import java.util.Scanner;

public class NameAge {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("请输入姓名：");
        String name = sc.nextLine();    // 先读整行姓名

        System.out.print("请输入年龄：");
        int age = sc.nextInt();         // 再读整数年龄，无换行残留问题

        System.out.println("姓名：" + name + "，年龄：" + age + " 岁");
    }
}

/* 控制台输出（用户输入 "Li Ming" 和 20）：
请输入姓名：Li Ming
请输入年龄：20
姓名：Li Ming，年龄：20 岁

解析：此处先调用 nextLine() 再调用 nextInt()，不存在换行残留问题。
      换行残留只在 nextInt() 等"不消耗回车的方法"之后紧接 nextLine() 时才会出现。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：修复换行残留 bug"
      code={`// 问：下面代码存在换行残留 bug，运行时城市名会被读成空字符串。
// 请修复它，使程序能正确读取城市名。

import java.util.Scanner;

public class TravelPlan {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("请输入出行天数：");
        int days = sc.nextInt();
        // 此处缺少消耗回车的代码

        System.out.print("请输入目的地城市：");
        String city = sc.nextLine();   // bug：直接读到残留回车

        System.out.println("计划去 " + city + " 旅行 " + days + " 天");
    }
}`}
      answerCode={`import java.util.Scanner;

public class TravelPlan {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("请输入出行天数：");
        int days = sc.nextInt();
        sc.nextLine();               // 修复：消耗 nextInt() 留下的回车符

        System.out.print("请输入目的地城市：");
        String city = sc.nextLine();

        System.out.println("计划去 " + city + " 旅行 " + days + " 天");
    }
}

/* 控制台输出（用户输入 7 和 "Tokyo"）：
请输入出行天数：7
请输入目的地城市：Tokyo
计划去 Tokyo 旅行 7 天

解析：在 nextInt() 之后、nextLine() 之前插入 sc.nextLine(); 消耗残留的回车符，
      后续的 nextLine() 才能正常等待用户输入并读取完整的城市名称。
*/`}
    />
  </article>
);

export default index;
