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
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>死循环与循环嵌套</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节讲两个进阶话题：<Text bold>死循环</Text>（无限循环）的写法、用途与风险；
        以及<Text bold>循环嵌套</Text>（循环里面套循环）的执行规律。
        嵌套循环是打印图案、九九乘法表等经典题目的基础，理解"外慢内快"的规律是关键。
      </Paragraph>
    </Callout>

    <Heading3>1. 死循环</Heading3>
    <Paragraph>
      死循环（无限循环）是指条件永远为 true、永远不会自行退出的循环。
      Java 中最常见的两种写法：
    </Paragraph>
    <CodeBlock
      title="死循环的两种标准写法"
      code={`// 写法一：for(;;) —— 三个部分全部省略，条件默认为 true
for (;;) {
    // 循环体
}

// 写法二：while(true) —— 条件直接写 true
while (true) {
    // 循环体
}`}
    />
    <Paragraph>
      两种写法效果完全相同，<InlineCode>while(true)</InlineCode> 更直观、更常用。
    </Paragraph>

    <Heading4>死循环的合理用途</Heading4>
    <UnorderedList>
      <ListItem>
        <Text bold>服务器/后台程序持续运行</Text>：如 Web 服务器不断监听请求，
        游戏主循环持续刷新画面，不需要也不应该自动停止。
      </ListItem>
      <ListItem>
        <Text bold>等待某个事件发生</Text>：在循环内检测条件，满足时用 <InlineCode>break</InlineCode> 退出。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      title="死循环 + break 退出示例"
      code={`public class ServerSimulation {
    public static void main(String[] args) {
        int requestCount = 0;
        while (true) {
            requestCount++;
            System.out.println("处理第 " + requestCount + " 个请求");
            if (requestCount >= 3) {
                System.out.println("达到上限，关闭服务");
                break;   // 满足条件时用 break 退出死循环
            }
        }
        System.out.println("服务已停止");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`处理第 1 个请求
处理第 2 个请求
处理第 3 个请求
达到上限，关闭服务
服务已停止`}
    />

    <Callout type="danger" title="死循环的风险">
      没有 break 出口的真正死循环会<Text bold>让程序永远无法结束</Text>，
      占用 CPU 资源，在 IDE 中需要手动点"停止"按钮（或在命令行按 Ctrl+C）才能终止。
      凡是写死循环，<Text bold>必须确保循环体内存在能到达的 break 语句</Text>。
    </Callout>

    <Heading3>2. 循环嵌套</Heading3>
    <Paragraph>
      循环嵌套是指一个循环（外层循环）的循环体内包含另一个循环（内层循环）。
    </Paragraph>
    <CodeBlock
      title="嵌套循环基本结构"
      code={`for (int i = 1; i <= 外层次数; i++) {      // 外层循环
    for (int j = 1; j <= 内层次数; j++) {  // 内层循环
        // 最内层代码
    }
}`}
    />

    <Heading4>"外慢内快"规律</Heading4>
    <Paragraph>
      嵌套循环的执行规律：<Text bold>外层循环执行一次，内层循环从头到尾完整跑一遍</Text>。
      可以类比时钟的时针和分针——时针（外层）走一格，分针（内层）转一圈。
    </Paragraph>
    <CodeBlock
      title="ExecutionOrder.java（演示外慢内快）"
      code={`public class ExecutionOrder {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {         // 外层：执行 3 次
            for (int j = 1; j <= 2; j++) {     // 内层：每次都从 1 跑到 2
                System.out.println("i=" + i + ", j=" + j);
            }
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`i=1, j=1
i=1, j=2
i=2, j=1
i=2, j=2
i=3, j=1
i=3, j=2`}
    />
    <Paragraph>
      外层 i 从 1 到 3，每当 i 固定时，内层 j 从 1 到 2 跑一遍。
      共执行 3 × 2 = 6 次内层代码。
    </Paragraph>

    <Heading3>3. 经典例子一：打印矩形星号图案</Heading3>
    <Paragraph>
      打印 3 行 4 列的矩形星号图案（外层控制行，内层控制每行的列）：
    </Paragraph>
    <CodeBlock
      title="StarRectangle.java"
      code={`public class StarRectangle {
    public static void main(String[] args) {
        int rows = 3;   // 行数
        int cols = 4;   // 列数
        for (int i = 1; i <= rows; i++) {        // 外层：控制行
            for (int j = 1; j <= cols; j++) {    // 内层：控制每行输出多少个 *
                System.out.print("* ");           // print 不换行
            }
            System.out.println();                 // 每行结束后换行
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`* * * *
* * * *
* * * * `}
    />

    <Heading3>4. 经典例子二：打印直角三角形星号图案</Heading3>
    <Paragraph>
      打印 5 行的直角三角形：第 1 行 1 个星号，第 2 行 2 个，……第 5 行 5 个。
      内层循环次数随外层变量 i 变化——这是三角形的关键。
    </Paragraph>
    <CodeBlock
      title="StarTriangle.java"
      code={`public class StarTriangle {
    public static void main(String[] args) {
        int rows = 5;
        for (int i = 1; i <= rows; i++) {     // 外层：第 i 行
            for (int j = 1; j <= i; j++) {   // 内层：第 i 行打印 i 个 *
                System.out.print("* ");
            }
            System.out.println();             // 每行结束换行
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`*
* *
* * *
* * * *
* * * * * `}
    />

    <Heading3>5. 经典例子三：九九乘法表</Heading3>
    <Paragraph>
      九九乘法表是循环嵌套最经典的练习：外层 i 从 1 到 9 控制行，
      内层 j 从 1 到 i 控制每行的列（保证每行只打印到 j*i 为止），
      用 <InlineCode>\t</InlineCode>（制表符）对齐各列。
    </Paragraph>
    <CodeBlock
      title="MultiplicationTable.java"
      code={`public class MultiplicationTable {
    public static void main(String[] args) {
        for (int i = 1; i <= 9; i++) {          // 外层：行（被乘数）
            for (int j = 1; j <= i; j++) {      // 内层：列（乘数，从 1 到 i）
                System.out.print(j + "*" + i + "=" + (i * j) + "\t");
            }
            System.out.println();               // 每行结束后换行
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`1*1=1
1*2=2	2*2=4
1*3=3	2*3=6	3*3=9
1*4=4	2*4=8	3*4=12	4*4=16
1*5=5	2*5=10	3*5=15	4*5=20	5*5=25
1*6=6	2*6=12	3*6=18	4*6=24	5*6=30	6*6=36
1*7=7	2*7=14	3*7=21	4*7=28	5*7=35	6*7=42	7*7=49
1*8=8	2*8=16	3*8=24	4*8=32	5*8=40	6*8=48	7*8=56	8*8=64
1*9=9	2*9=18	3*9=27	4*9=36	5*9=45	6*9=54	7*9=63	8*9=72	9*9=81	`}
    />
    <Paragraph>
      内层循环上限是 i（而不是 9），保证第 i 行只有 i 列，
      形成左下角的三角形布局。制表符 <InlineCode>\t</InlineCode> 使各列大致对齐。
    </Paragraph>

    <Heading3>6. 注意点：嵌套循环中 break/continue 只影响所在层</Heading3>
    <Callout type="warning" title="break/continue 不会自动跳出外层">
      <Paragraph>
        在嵌套循环中，<InlineCode>break</InlineCode> 和 <InlineCode>continue</InlineCode>
        只对<Text bold>直接包含它们的那一层循环</Text>起作用，不会影响外层循环。
      </Paragraph>
      <CodeBlock
        title="break 只退出内层循环示例"
        code={`for (int i = 1; i <= 3; i++) {
    System.out.println("外层 i = " + i);
    for (int j = 1; j <= 5; j++) {
        if (j == 3) break;          // 只退出内层 for，外层继续
        System.out.println("  内层 j = " + j);
    }
}`}
      />
      <CodeBlock
        language="text"
        title="控制台输出"
        code={`外层 i = 1
  内层 j = 1
  内层 j = 2
外层 i = 2
  内层 j = 1
  内层 j = 2
外层 i = 3
  内层 j = 1
  内层 j = 2`}
      />
      <Paragraph>
        内层每次执行到 j=3 就 break，但外层 i 不受影响，仍然从 1 跑到 3。
        若要同时跳出外层，需要使用前一节介绍的带标签的 break。
      </Paragraph>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己思考并动手写，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：打印指定行数的星号三角形"
      code={`// 要求：读入变量 n = 4，打印 4 行的直角三角形（左对齐），
// 第 1 行 1 个 *，第 2 行 2 个 *，……第 4 行 4 个 *。

public class StarTriangleN {
    public static void main(String[] args) {
        int n = 4;
        // 请在这里补全代码
    }
}`}
      answerCode={`public class StarTriangleN {
    public static void main(String[] args) {
        int n = 4;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}

/* 控制台输出：
*
* *
* * *
* * * *
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：打印九九乘法表"
      code={`// 要求：用嵌套循环打印完整的九九乘法表。
// 格式：每项用 j*i=结果 表示，制表符 \t 分隔，每行换行。

public class MultiTable {
    public static void main(String[] args) {
        // 请在这里补全代码
    }
}`}
      answerCode={`public class MultiTable {
    public static void main(String[] args) {
        for (int i = 1; i <= 9; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(j + "*" + i + "=" + (i * j) + "\t");
            }
            System.out.println();
        }
    }
}

/* 控制台输出：
1*1=1
1*2=2   2*2=4
1*3=3   2*3=6   3*3=9
1*4=4   2*4=8   3*4=12  4*4=16
1*5=5   2*5=10  3*5=15  4*5=20  5*5=25
1*6=6   2*6=12  3*6=18  4*6=24  5*6=30  6*6=36
1*7=7   2*7=14  3*7=21  4*7=28  5*7=35  6*7=42  7*7=49
1*8=8   2*8=16  3*8=24  4*8=32  5*8=40  6*8=48  7*8=56  8*8=64
1*9=9   2*9=18  3*9=27  4*9=36  5*9=45  6*9=54  7*9=63  8*9=72  9*9=81

关键点：
  · 外层 i 从 1 到 9，控制行（被乘数）
  · 内层 j 从 1 到 i，控制每行的列数
  · 内层上限用 i 而非 9，使第 i 行只有 i 项，形成三角形排列
*/`}
    />
    <ChapterExercises categoryKey="flow" />
  </article>
);

export default index;
