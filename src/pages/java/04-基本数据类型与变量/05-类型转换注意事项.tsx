import React from 'react';
import {
  Title,
  Heading3,
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
    <Title>类型转换注意事项</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前两节讲了"能不能转、怎么转"，本节专门讲<Text accent>常见坑</Text>。
        这些坑不会被编译器明确报错提示（有时甚至能通过编译），但运行结果和你预期的完全不同。
        遇到过一次就很难忘——不如提前把它们都踩一遍。
      </Paragraph>
    </Callout>

    <Heading3>1. byte / short / char 参与运算会自动提升为 int</Heading3>
    <Paragraph>
      Java 规定：<InlineCode>byte</InlineCode>、<InlineCode>short</InlineCode>、
      <InlineCode>char</InlineCode> 三种类型，只要参与<Text bold>算术运算</Text>，
      结果就会自动提升为 <InlineCode>int</InlineCode>，哪怕两个操作数都是同一种小类型。
      这意味着，把运算结果赋回 <InlineCode>byte</InlineCode> 变量，
      <Text bold>必须加强制转换</Text>，否则编译报错。
    </Paragraph>
    <CodeBlock
      title="ByteAdd.java"
      code={`public class ByteAdd {
    public static void main(String[] args) {
        byte b1 = 10;
        byte b2 = 20;

        // ❌ 编译报错：b1 + b2 的结果是 int，不能直接赋给 byte
        // byte b3 = b1 + b2;  // 错误：incompatible types: possible lossy conversion from int to byte

        // ✅ 正确写法：加强制转换
        byte b3 = (byte) (b1 + b2);
        System.out.println("b1 + b2 = " + b3);  // 30

        // short 同理
        short s1 = 100;
        short s2 = 200;
        // short s3 = s1 + s2;  // ❌ 编译报错
        short s3 = (short) (s1 + s2);
        System.out.println("s1 + s2 = " + s3);  // 300

        // char 同理
        char c1 = 'a';   // ASCII 97
        char c2 = 'b';   // ASCII 98
        // char c3 = c1 + c2;  // ❌ 编译报错
        int sumOfChars = c1 + c2;  // 结果是 int 195
        System.out.println("'a' + 'b' = " + sumOfChars);  // 195
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`b1 + b2 = 30
s1 + s2 = 300
'a' + 'b' = 195`}
    />
    <Callout type="warning" title="为什么 Java 要这样设计">
      CPU 做整数运算的基本单位通常是 32 位（int）。
      把 byte/short 先"拓展"到 int 再运算，是为了与底层 CPU 指令对齐，
      也能避免小类型溢出时的歧义。这是 Java 语言规范的明确规定，记住就好。
    </Callout>

    <Heading3>2. 常量表达式是例外——编译期折叠</Heading3>
    <Paragraph>
      上一条规则有一个重要例外：如果参与运算的都是<Text bold>字面量常量</Text>（编译期已知的值），
      编译器会在编译期直接把结果算出来，并检查结果是否在目标类型范围内。
      若在范围内，则<Text bold>不需要强制转换</Text>，直接赋值合法。
      这个机制叫做<Text accent>常量折叠（Constant Folding）</Text>。
    </Paragraph>
    <CodeBlock
      title="ConstantFolding.java"
      code={`public class ConstantFolding {
    public static void main(String[] args) {
        // ✅ 合法：3 和 4 都是字面量，编译器直接算出 7，7 在 byte 范围内
        byte b = 3 + 4;
        System.out.println("byte b = " + b);  // 7

        // ✅ 合法：10 * 10 = 100，100 在 short 范围内
        short s = 10 * 10;
        System.out.println("short s = " + s); // 100

        // ❌ 编译报错：200 + 200 = 400，超出 byte 范围 [-128, 127]
        // byte overflow = 200 + 200;  // 报错：integer number too large for byte

        // ❌ 注意：只要有变量参与，常量折叠就失效
        byte x = 1;
        byte y = 2;
        // byte z = x + y;   // ❌ 报错，x 和 y 是变量，编译器不再折叠，结果是 int
        byte z = (byte)(x + y);  // ✅ 必须加强制转换
        System.out.println("byte z = " + z);  // 3
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`byte b = 7
short s = 100
byte z = 3`}
    />
    <Table
      head={['情况', '是否需要强制转换', '原因']}
      rows={[
        ['byte b = 3 + 4', '不需要', '全是字面量，编译期折叠，结果 7 在范围内'],
        ['byte b = x + y（x、y 是变量）', '必须', '有变量，运行期才知道值，结果是 int'],
        ['byte b = 200 + 200', '无法编译', '全是字面量但结果 400 超出 byte 范围，直接报错'],
      ]}
    />

    <Heading3>3. 整数除法丢失小数</Heading3>
    <Paragraph>
      当两个 <InlineCode>int</InlineCode>（或 <InlineCode>long</InlineCode>）相除时，
      结果也是 <InlineCode>int</InlineCode>，<Text bold>小数部分直接丢弃</Text>（截断），
      不是四舍五入。这是初学者最容易被坑的运算之一。
    </Paragraph>
    <CodeBlock
      title="IntDivide.java"
      code={`public class IntDivide {
    public static void main(String[] args) {
        // int / int = int，小数截断
        int a = 5;
        int b = 2;
        int result1 = a / b;
        System.out.println("5 / 2 = " + result1);         // 2，不是 2.5！

        // 要得到 2.5，必须让至少一个操作数是浮点数
        double result2 = 5.0 / 2;
        System.out.println("5.0 / 2 = " + result2);       // 2.5

        double result3 = 5 / 2.0;
        System.out.println("5 / 2.0 = " + result3);       // 2.5

        // 或者用强制转换把其中一个转成 double
        double result4 = (double) a / b;
        System.out.println("(double)5 / 2 = " + result4); // 2.5

        // 注意：(double)(a / b) 先除后转，仍然是 2.0！
        double result5 = (double) (a / b);
        System.out.println("(double)(5/2) = " + result5); // 2.0，不是 2.5
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`5 / 2 = 2
5.0 / 2 = 2.5
5 / 2.0 = 2.5
(double)5 / 2 = 2.5
(double)(5/2) = 2.0`}
    />
    <Callout type="danger" title="(double)(a / b) 和 (double)a / b 结果不同">
      <InlineCode>(double)(a / b)</InlineCode>：先做整数除法得到 2，再转成 double 得到 2.0。
      <InlineCode>(double)a / b</InlineCode>：先把 a 转成 double，再做 double 除以 int，得到 2.5。
      括号位置决定了转换的时机，一定要分清楚。
    </Callout>

    <Heading3>4. char 参与 + 运算的特殊行为</Heading3>
    <Paragraph>
      当 <InlineCode>char</InlineCode> 与数字相加时，char 会先自动提升为 <InlineCode>int</InlineCode>
      （取其 Unicode 码值），然后再做加法，结果是 <InlineCode>int</InlineCode>，
      <Text bold>不再是字符</Text>。
    </Paragraph>
    <CodeBlock
      title="CharPlusInt.java"
      code={`public class CharPlusInt {
    public static void main(String[] args) {
        // 'a' 的 ASCII 码是 97，提升为 int 后加 1
        int result1 = 'a' + 1;
        System.out.println("'a' + 1 = " + result1);   // 98，不是 'b'！

        // 要得到字符 'b'，必须再强制转回 char
        char result2 = (char) ('a' + 1);
        System.out.println("(char)('a'+1) = " + result2); // b

        // char + char：两个 char 都提升为 int，结果是 int
        char c1 = 'a';  // 97
        char c2 = 'A';  // 65
        int sumChar = c1 + c2;
        System.out.println("'a' + 'A' = " + sumChar);  // 162

        // 连接字符串时，+ 不是加法，是字符串拼接
        String s1 = "result: " + 'a' + 1;   // "result: " + 'a' 先拼接 → "result: a"，再 + 1 → "result: a1"
        String s2 = "result: " + ('a' + 1); // 先算 'a'+1=98，再拼接 → "result: 98"
        System.out.println(s1);  // result: a1
        System.out.println(s2);  // result: 98
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`'a' + 1 = 98
(char)('a'+1) = b
'a' + 'A' = 162
result: a1
result: 98`}
    />
    <Callout type="danger" title="字符串拼接中 + 的坑">
      <Paragraph>
        当 <InlineCode>+</InlineCode> 左边是字符串时，它的含义变成了<Text bold>字符串拼接</Text>，
        不再是数学加法。运算方向是<Text bold>从左到右</Text>，所以
        <InlineCode>"x" + 'a' + 1</InlineCode> 先拼接得到 <InlineCode>"xa"</InlineCode>，
        再拼接 1 得到 <InlineCode>"xa1"</InlineCode>。
        要让后面的 <InlineCode>'a' + 1</InlineCode> 先算出 98，必须用括号：
        <InlineCode>"x" + ('a' + 1)</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading3>5. 浮点数精度问题</Heading3>
    <Paragraph>
      <InlineCode>float</InlineCode> 和 <InlineCode>double</InlineCode>
      使用二进制浮点格式（IEEE 754），无法精确表示所有十进制小数。
      某些看起来很简单的计算，结果会带上微小的误差，让人困惑。
    </Paragraph>
    <CodeBlock
      title="FloatPrecision.java"
      code={`public class FloatPrecision {
    public static void main(String[] args) {
        // 著名的精度问题
        System.out.println(0.1 + 0.2);    // 不是 0.3！
        System.out.println(0.1 + 0.2 == 0.3);  // false！

        // float 精度更低，问题更明显
        float f1 = 0.1f;
        float f2 = 0.2f;
        System.out.println(f1 + f2);      // 也不精确

        // 正确做法1：用 BigDecimal（金融场景必用）
        // 正确做法2：判断差值是否小于误差范围（epsilon 比较）
        double a = 0.1 + 0.2;
        double b = 0.3;
        double epsilon = 1e-10;  // 允许的误差范围
        System.out.println(Math.abs(a - b) < epsilon);  // true，这才是正确的浮点数比较方式
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`0.30000000000000004
false
0.3
true`}
    />
    <Callout type="warning" title="浮点数不要用 == 比较">
      永远不要用 <InlineCode>==</InlineCode> 直接比较两个 <InlineCode>double</InlineCode> 或
      <InlineCode>float</InlineCode> 是否相等。
      正确做法是判断二者之差的绝对值是否小于一个极小的误差范围（如 <InlineCode>1e-9</InlineCode>），
      或使用 <InlineCode>BigDecimal</InlineCode>（需要时学习）。
    </Callout>

    <Heading3>6. 常见坑速查表</Heading3>
    <Table
      head={['坑', '错误示范', '正确做法', '说明']}
      rows={[
        [
          'byte/short 变量相加',
          'byte b = b1 + b2',
          'byte b = (byte)(b1 + b2)',
          '运算结果自动提升为 int，需显式转回',
        ],
        [
          '整数除法丢小数',
          'double d = 5 / 2',
          'double d = 5.0 / 2 或 (double)5 / 2',
          'int/int = int，先转类型再除',
        ],
        [
          'char + 数字不是字符',
          "char c = 'a' + 1",
          "char c = (char)('a' + 1)",
          "char 提升为 int 运算，结果是 int 98，不是字符 'b'",
        ],
        [
          '浮点数精度误差',
          '0.1 + 0.2 == 0.3',
          'Math.abs(a - b) < 1e-9',
          'IEEE 754 浮点数天生有误差，不能用 == 比较',
        ],
        [
          '字符串 + 运算顺序',
          '"x" + 1 + 2 得到 "x12"',
          '"x" + (1 + 2) 得到 "x3"',
          '+ 从左到右，左边是字符串时变拼接',
        ],
      ]}
    />

    <Heading3>7. 练习题</Heading3>
    <CodeBlock
      qa
      language="text"
      title="练习 1：预测这些表达式的结果"
      code={`// 不运行代码，直接判断每个表达式的结果（值和类型）。
// 若会编译报错，说明原因。

byte x = 1, y = 2;

(1) x + y               的结果类型是？值是？
(2) byte b = x + y;     能通过编译吗？
(3) byte b = 1 + 2;     能通过编译吗？值是？
(4) 5 / 2               的结果类型是？值是？
(5) 5.0 / 2             的结果类型是？值是？
(6) 0.1 + 0.2 == 0.3    结果是 true 还是 false？
(7) 'a' + 1             的结果类型是？值是？`}
      answerCode={`(1) x + y 的结果类型是 int，值是 3。
    原因：byte 参与运算自动提升为 int，3（int）。

(2) byte b = x + y; 不能通过编译，报错。
    原因：x + y 结果是 int（3），不能直接赋给 byte，需写 (byte)(x + y)。

(3) byte b = 1 + 2; 能通过编译，值是 3（byte）。
    原因：1 和 2 都是字面量，编译器折叠成 3，3 在 byte 范围内，合法。

(4) 5 / 2 的结果类型是 int，值是 2。
    原因：int / int = int，小数截断。

(5) 5.0 / 2 的结果类型是 double，值是 2.5。
    原因：double / int，int 自动提升为 double，结果是 double 2.5。

(6) 0.1 + 0.2 == 0.3 结果是 false。
    原因：0.1 + 0.2 实际上等于 0.30000000000000004，不等于 0.3。

(7) 'a' + 1 的结果类型是 int，值是 98。
    原因：char 'a' 提升为 int 97，97 + 1 = 98（int）。`}
    />
    <CodeBlock
      qa
      title="练习 2：修复下面有问题的代码"
      code={`// 下面的代码有 3 处问题，找出来并改正。

public class BugFix {
    public static void main(String[] args) {
        // 问题①：想计算平均分（应为 85.5）
        int score1 = 86, score2 = 85;
        double avg = score1 + score2 / 2;
        System.out.println("平均分: " + avg);

        // 问题②：想判断 0.1 + 0.2 是否等于 0.3
        boolean eq = 0.1 + 0.2 == 0.3;
        System.out.println("0.1+0.2==0.3: " + eq);

        // 问题③：想用两个 byte 相加后仍存为 byte
        byte a = 50, b = 60;
        byte c = a + b;
        System.out.println("50 + 60 = " + c);
    }
}`}
      answerCode={`public class BugFix {
    public static void main(String[] args) {
        // 修复①：运算优先级问题。score2 / 2 先算（整数除法得 42），再加 score1 得 128.0。
        // 正确写法：把整个加法括起来再除，并确保除数是 2.0 或先转 double
        int score1 = 86, score2 = 85;
        double avg = (score1 + score2) / 2.0;
        System.out.println("平均分: " + avg);   // 85.5

        // 修复②：浮点数不能用 == 比较，用误差范围判断
        double sum = 0.1 + 0.2;
        boolean eq = Math.abs(sum - 0.3) < 1e-9;
        System.out.println("0.1+0.2≈0.3: " + eq);  // true

        // 修复③：byte + byte 结果是 int，必须强制转回 byte
        byte a = 50, b = 60;
        byte c = (byte)(a + b);   // 50+60=110，110 在 [-128,127] 内，不溢出
        System.out.println("50 + 60 = " + c);  // 110
    }
}

/* 说明：
   ① (86 + 85) / 2.0 = 171 / 2.0 = 85.5，加了括号确保先求和再除。
   ② Math.abs(a - b) < 1e-9 是标准的浮点比较写法。
   ③ (byte)(a + b) 强制转回 byte，50+60=110 不超界，结果正确。
*/`}
    />
    <UnorderedList>
      <ListItem>
        <Text bold>byte/short/char 运算自动提升 int</Text>，结果赋回小类型必须强制转换，
        除非操作数全是字面量且结果在范围内（常量折叠）。
      </ListItem>
      <ListItem>
        <Text bold>整数除法截断小数</Text>，想得到浮点结果，至少一个操作数要是浮点数，
        或用强制转换在除法前转换类型。
      </ListItem>
      <ListItem>
        <Text bold>浮点数用 == 比较不可靠</Text>，用误差范围（epsilon）或 BigDecimal 代替。
      </ListItem>
    </UnorderedList>
  </article>
);

export default index;
