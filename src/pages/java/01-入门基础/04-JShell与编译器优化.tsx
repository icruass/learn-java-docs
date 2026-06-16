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
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>JShell 与编译器优化（常量折叠）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节介绍两个实用工具性知识：一是 JDK 9 起自带的交互式工具
        <Text bold>JShell</Text>，能让你不写 class、不写 main，直接一行一行地跑 Java 表达式，
        非常适合快速验证语法；二是编译器的一项幕后优化——
        <Text bold>常量折叠（Constant Folding）</Text>，
        解释了为什么 <InlineCode>byte b = 3 + 4;</InlineCode> 能编译通过而
        <InlineCode>byte b = b1 + b2;</InlineCode> 却报错，与前面"数据类型转换"章节紧密呼应。
      </Paragraph>
    </Callout>

    <Heading3>1. JShell：交互式 Java REPL</Heading3>
    <Heading4>1.1 什么是 JShell</Heading4>
    <Paragraph>
      <Text bold>REPL</Text> 是 Read-Eval-Print Loop（读取-求值-打印-循环）的缩写，
      就是那种"输一行、跑一行、立刻看结果"的交互式环境。Python、Node.js 都有，
      Java 从 <Text bold>JDK 9</Text> 开始也内置了自己的 REPL，叫做 <Text bold>JShell</Text>。
    </Paragraph>
    <Paragraph>
      JShell 的最大优势是<Text bold>省掉了所有脚手架代码</Text>——不需要写
      <InlineCode>public class Xxx</InlineCode>，不需要写
      <InlineCode>public static void main</InlineCode>，
      直接敲表达式或语句就能看到结果，用于快速试验语法、验证想法效率极高。
    </Paragraph>

    <Heading4>1.2 怎么启动 JShell</Heading4>
    <CodeBlock
      language="bash"
      title="命令行启动 JShell（需要 JDK 9+）"
      code={`# 确认 JDK 版本（需 9 或以上）
java -version

# 启动 JShell
jshell`}
    />
    <Paragraph>
      启动后会显示欢迎信息和 <InlineCode>jshell&gt;</InlineCode> 提示符，
      之后就可以逐行输入 Java 代码了。输入 <InlineCode>/exit</InlineCode> 退出。
    </Paragraph>

    <Heading4>1.3 JShell 会话示例</Heading4>
    <Paragraph>下面演示几个典型的 JShell 交互片段：</Paragraph>
    <CodeBlock
      language="text"
      title="JShell 示例 — 基本表达式"
      code={`jshell> 1 + 2
$1 ==> 3

jshell> 10 * 3.14
$2 ==> 31.4

jshell> "Hello" + " " + "World"
$3 ==> "Hello World"`}
    />
    <Paragraph>
      JShell 会自动把表达式的结果赋给一个临时变量（如 <InlineCode>$1</InlineCode>、
      <InlineCode>$2</InlineCode>），并用 <InlineCode>==&gt;</InlineCode> 展示其值。
      这些临时变量在后续输入里还可以继续使用。
    </Paragraph>
    <CodeBlock
      language="text"
      title="JShell 示例 — 声明变量与方法"
      code={`jshell> int a = 5
a ==> 5

jshell> int b = 3
b ==> 3

jshell> a + b
$3 ==> 8

jshell> int max(int x, int y) { return x > y ? x : y; }
|  已创建 方法 max(int,int)

jshell> max(10, 20)
$5 ==> 20`}
    />
    <CodeBlock
      language="text"
      title="JShell 示例 — 常用命令"
      code={`jshell> /list          // 列出目前输入过的所有代码片段
jshell> /vars          // 列出当前所有变量
jshell> /methods       // 列出当前定义的所有方法
jshell> /exit          // 退出 JShell`}
    />
    <Callout type="tip" title="JShell 的最佳用途">
      <UnorderedList>
        <ListItem>快速验证一个运算结果（比如 <InlineCode>17 % 3</InlineCode> 是多少）。</ListItem>
        <ListItem>测试一个字符串方法（比如 <InlineCode>"hello".toUpperCase()</InlineCode>）。</ListItem>
        <ListItem>试验类型转换、自动装箱等行为，不想新建文件时非常方便。</ListItem>
      </UnorderedList>
    </Callout>
    <Callout type="warning" title="JShell 只是学习/探索工具">
      JShell 不适合写正式项目代码。生产代码仍然要写完整的 <InlineCode>.java</InlineCode> 文件、
      正常编译运行。JShell 退出后，当前会话的所有变量和方法定义全部消失。
    </Callout>

    <Heading3>2. 编译器优化——常量折叠</Heading3>
    <Heading4>2.1 现象引入</Heading4>
    <Paragraph>
      先看一个让很多初学者困惑的现象：
    </Paragraph>
    <CodeBlock
      title="常量折叠现象对比"
      code={`public class FoldingDemo {
    public static void main(String[] args) {

        // ✅ 编译通过
        byte b1 = 3 + 4;

        // ❌ 编译报错：不兼容的类型，int 无法转换为 byte
        byte x = 3;
        byte y = 4;
        byte b2 = x + y;
    }
}`}
    />
    <Paragraph>
      同样是"3 加 4"，为什么字面量写法能通过，而变量写法却报错？
      答案就藏在<Text bold>常量折叠</Text>里。
    </Paragraph>

    <Heading4>2.2 什么是常量折叠</Heading4>
    <Paragraph>
      <Text bold>常量折叠（Constant Folding）</Text>是编译器的一项优化：
      如果一个表达式的所有操作数在<Text bold>编译期</Text>就能确定（即都是字面量或
      <InlineCode>final</InlineCode> 常量），编译器会直接把整个表达式计算出来，
      替换成一个常量值，并检查该值是否在目标类型的范围内。
    </Paragraph>
    <Table
      head={['表达式', '编译期能确定？', '结果', '赋给 byte 能否通过']}
      rows={[
        ['3 + 4', '能（都是字面量）', '编译器算出 7，在 byte 范围 -128~127 内', '通过'],
        ['x + y（x、y 是 byte 变量）', '不能（运行期才知道值）', '编译器按 int 处理，结果类型是 int', '报错'],
        ['100 + 100', '能', '编译器算出 200，但 200 超出 byte 范围', '报错（overflow）'],
      ]}
    />
    <Callout type="tip" title="为什么变量相加结果是 int">
      即使两个 <InlineCode>byte</InlineCode> 变量相加，Java 也会先把它们<Text bold>提升为 int</Text>
      再运算（这是"整型运算自动提升"规则，byte/short/char 参与运算时统一提升为 int），
      结果类型是 <InlineCode>int</InlineCode>，不能直接赋给 <InlineCode>byte</InlineCode>，
      必须显式强转。常量折叠绕过了这一步，因为编译器直接算出结果并确认在范围内。
    </Callout>

    <Heading4>2.3 完整代码验证</Heading4>
    <CodeBlock
      title="ConstantFoldingDemo.java"
      code={`public class ConstantFoldingDemo {
    public static void main(String[] args) {

        // ✅ 常量折叠：3 + 4 在编译期被算成 7，7 在 byte 范围内，通过
        byte b1 = 3 + 4;
        System.out.println("b1 = " + b1);

        // ❌ 变量相加：x + y 运行期才知道值，结果类型是 int，赋给 byte 报错
        // byte x = 3, y = 4;
        // byte b2 = x + y;    // 编译报错

        // ✅ 加强转可以通过（但要自己保证不溢出）
        byte x = 3, y = 4;
        byte b3 = (byte)(x + y);
        System.out.println("b3 = " + b3);

        // ✅ 100 + 28 = 128，超出 byte 最大值 127，常量折叠仍然报错（编译期就能发现溢出）
        // byte b4 = 100 + 28;   // 编译报错：incompatible types: possible lossy conversion

        // ✅ 没超范围的常量折叠
        short s = 200 + 300;   // int 自动折叠为 500，500 在 short 范围 -32768~32767 内
        System.out.println("s = " + s);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`b1 = 7
b3 = 7
s = 500`} />

    <Heading4>2.4 final 常量也触发常量折叠</Heading4>
    <Paragraph>
      用 <InlineCode>final</InlineCode> 修饰的变量是<Text bold>编译期常量</Text>——
      编译器知道它的值永远不变，会把它<Text bold>内联</Text>进表达式，
      同样触发常量折叠。
    </Paragraph>
    <CodeBlock
      title="final 常量折叠示例"
      code={`public class FinalFolding {
    public static void main(String[] args) {

        final int A = 3;
        final int B = 4;

        // ✅ A、B 都是 final，编译期值确定，3 + 4 折叠成 7，赋给 byte 没问题
        byte b = (byte)(A + B);   // 不加 (byte) 也行：byte b = A + B; 同样通过
        System.out.println("b = " + b);

        // 对比：非 final 变量就不行
        int m = 3;
        int n = 4;
        // byte b2 = m + n;   // 编译报错：m、n 不是常量，运行期才知道值
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`b = 7`} />
    <Callout type="success" title="常量折叠总结">
      <UnorderedList>
        <ListItem>
          <Text bold>字面量</Text>（如 <InlineCode>3 + 4</InlineCode>）和
          <Text bold>final 常量</Text>（如 <InlineCode>final int A = 3</InlineCode>）构成的表达式：
          编译期可算，触发常量折叠，编译器直接替换成结果值并做范围检查。
        </ListItem>
        <ListItem>
          <Text bold>普通变量</Text>（哪怕当前赋了固定值）：运行期才确定，不触发常量折叠，
          参与运算后类型提升为 <InlineCode>int</InlineCode>，赋给 byte/short 必须强转。
        </ListItem>
        <ListItem>
          常量折叠是<Text bold>编译器的能力范围</Text>，它只能看"编译期能确定的信息"，
          其余留给运行期。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>3. 练习题</Heading3>
    <Paragraph>
      先自己判断，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：判断下列赋值能否编译通过"
      code={`判断以下每条语句能否编译通过，并简要说明原因。
（运行环境：Java 8+，假设每条语句独立执行）

(1) byte b = 3 + 4;
(2) byte b1 = 3;
    byte b2 = 4;
    byte b3 = b1 + b2;
(3) byte b = 200;
(4) byte b1 = 3;
    byte b2 = 4;
    byte b3 = (byte)(b1 + b2);
(5) final byte A = 10;
    final byte B = 20;
    byte c = A + B;`}
      answerCode={`(1) byte b = 3 + 4;
    ✅ 通过。常量折叠：3 + 4 在编译期被算成 7，7 在 byte 范围 (-128~127) 内，合法。

(2) byte b3 = b1 + b2;
    ❌ 报错。b1、b2 是变量，运行期才知道值；byte + byte 先提升为 int，
    结果类型是 int，不能直接赋给 byte。
    错误信息：incompatible types: possible lossy conversion from int to byte

(3) byte b = 200;
    ❌ 报错。200 是 int 字面量，虽然是常量，但 200 超出 byte 最大值 127，
    编译器发现溢出，拒绝赋值。

(4) byte b3 = (byte)(b1 + b2);
    ✅ 通过。加了 (byte) 强转，开发者主动承担溢出风险。3+4=7，未溢出，值正确。
    若实际值超出范围则按截断规则处理，编译不报错但结果可能不符预期。

(5) byte c = A + B;
    ✅ 通过。A 和 B 都是 final，是编译期常量，触发常量折叠，10 + 20 = 30，
    30 在 byte 范围内，合法。`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：JShell 操作题"
      code={`假设你已经启动了 JShell，请写出完成以下操作的输入内容，
并写出 JShell 会显示什么结果。

(1) 计算 2 的 10 次方（使用 Math.pow(2, 10)）
(2) 声明 int 变量 x = 100，然后查看 x 的值
(3) 定义方法 double square(double n)，返回 n 的平方，然后调用 square(5.0)
(4) 退出 JShell`}
      answerCode={`(1) 计算 2 的 10 次方：
    jshell> Math.pow(2, 10)
    $1 ==> 1024.0
    （Math.pow 返回 double，所以显示 1024.0）

(2) 声明变量并查看：
    jshell> int x = 100
    x ==> 100
    jshell> x
    $2 ==> 100

(3) 定义方法并调用：
    jshell> double square(double n) { return n * n; }
    |  已创建 方法 square(double)
    jshell> square(5.0)
    $3 ==> 25.0

(4) 退出：
    jshell> /exit
    |  再见

注：JShell 退出后，以上所有定义（变量 x、方法 square）全部消失。`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 3：常量折叠深入——final 与非 final 对比"
      code={`下面代码中，哪几行会编译报错？请逐行标出并说明原因。

public class Quiz {
    public static void main(String[] args) {
        final int A = 127;
        final int B = 1;
        int c = 5;

        byte r1 = A + B;        // 行①
        byte r2 = A;            // 行②
        byte r3 = c + 1;        // 行③
        byte r4 = (byte)(c + 1); // 行④
    }
}`}
      answerCode={`行① byte r1 = A + B;
    ❌ 报错。A=127，B=1，都是 final，折叠后 = 128。
    但 128 超出 byte 最大值 127，编译期检测到溢出，拒绝赋值。

行② byte r2 = A;
    ❌ 报错。A 是 final int，值为 127，虽然 127 在 byte 范围内，
    但 final int 赋给 byte 仍需要强转（类型不相同）。
    应写：byte r2 = (byte) A; 或直接 final byte A = 127;

行③ byte r3 = c + 1;
    ❌ 报错。c 是普通 int 变量，不是常量，c + 1 结果类型是 int，
    不能直接赋给 byte。

行④ byte r4 = (byte)(c + 1);
    ✅ 通过。加了强转，编译器接受，开发者自行承担截断风险。

总结：第①②③行报错，第④行通过。`}
    />
    <ChapterExercises categoryKey="basics" />
  </article>
);

export default index;
