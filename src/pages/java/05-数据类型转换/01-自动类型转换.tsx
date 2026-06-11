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
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>自动类型转换</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 是<Text bold>强类型语言</Text>，每个变量都有固定的类型。
        当不同类型的数据混在一起运算或赋值时，就需要"转换"。
        本节讲<Text accent>自动类型转换</Text>——也叫<Text bold>隐式转换</Text>：
        编译器帮你悄悄完成，不需要写任何额外代码。
        核心规则只有一句：<Text bold>取值范围小的类型可以自动转成取值范围大的类型</Text>，反之不行。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是自动类型转换</Heading3>
    <Paragraph>
      把一个<Text bold>取值范围较小</Text>的类型的值赋给<Text bold>取值范围较大</Text>的类型变量时，
      Java 编译器会自动完成转换，无需程序员手动干预。
      因为小范围的值一定能"装进"大范围，不会丢失数据，所以编译器认为这样做是安全的。
    </Paragraph>
    <Paragraph>
      最典型的例子：把 <InlineCode>int</InlineCode> 赋给 <InlineCode>double</InlineCode>。
      整数 <InlineCode>10</InlineCode> 可以无损地表示成浮点数 <InlineCode>10.0</InlineCode>，
      不会损失任何信息，所以编译器允许并自动完成这个转换。
    </Paragraph>

    <Heading3>2. 转换方向（从小到大）</Heading3>
    <Paragraph>
      Java 中整数和浮点数的自动转换方向如下图所示（箭头代表"可以自动转向"）：
    </Paragraph>
    <CodeBlock
      language="text"
      title="自动类型转换方向"
      code={`整数链：
  byte  →  short  →  int  →  long  →  float  →  double
  (1字节)  (2字节)  (4字节) (8字节)  (4字节)   (8字节)

字符链：
  char  →  int  →  long  →  float  →  double
  (2字节)  (4字节)

说明：
  · 箭头左边的类型可以自动转换成右边任意类型
  · char 可以自动转 int（按 Unicode/ASCII 码值）
  · float 虽然只有 4 字节，但其表示范围远大于 long（8 字节），
    所以 long → float 是合法的自动转换（但可能丢失精度，见注意事项章节）`}
    />

    <Callout type="tip" title="记忆技巧">
      把这条链想成"水往低处流"反过来：数据往<Text bold>容量更大</Text>的容器里倒，
      自然不会溢出，编译器放行。往小容器倒就可能溢出，必须手动强制转换（下节内容）。
    </Callout>

    <Heading3>3. 八大基本类型的取值范围对比</Heading3>
    <Table
      head={['类型', '字节', '取值范围', '默认值']}
      rows={[
        [<InlineCode>byte</InlineCode>, '1', '-128 ~ 127', '0'],
        [<InlineCode>short</InlineCode>, '2', '-32768 ~ 32767', '0'],
        [<InlineCode>int</InlineCode>, '4', '-2^31 ~ 2^31-1（约 ±21亿）', '0'],
        [<InlineCode>long</InlineCode>, '8', '-2^63 ~ 2^63-1', '0L'],
        [<InlineCode>float</InlineCode>, '4', '约 ±3.4×10^38（精度约 7 位）', '0.0f'],
        [<InlineCode>double</InlineCode>, '8', '约 ±1.8×10^308（精度约 15 位）', '0.0'],
        [<InlineCode>char</InlineCode>, '2', '0 ~ 65535（Unicode 码点）', "'\\u0000'"],
        [<InlineCode>boolean</InlineCode>, '1', 'true / false', 'false'],
      ]}
    />
    <Callout type="warning" title="boolean 不参与类型转换">
      <InlineCode>boolean</InlineCode> 类型既不能转换成其它类型，其它类型也不能转换成
      <InlineCode>boolean</InlineCode>。它只有 <InlineCode>true</InlineCode> 和
      <InlineCode>false</InlineCode> 两个值，与数字完全隔离。
    </Callout>

    <Heading3>4. 示例代码与控制台输出</Heading3>
    <Heading4>① 数值类型的自动转换</Heading4>
    <CodeBlock
      title="AutoCastDemo.java"
      code={`public class AutoCastDemo {
    public static void main(String[] args) {
        // byte → int：自动转换，无需写任何额外代码
        byte b = 100;
        int i = b;          // byte 100 自动变成 int 100
        System.out.println("byte b = " + b);
        System.out.println("int i = " + i);

        // int → long：自动转换
        int num = 12345;
        long l = num;       // int 12345 自动变成 long 12345
        System.out.println("int num = " + num);
        System.out.println("long l = " + l);

        // int → double：自动转换，整数变浮点数
        int x = 10;
        double d = x;       // int 10 自动变成 double 10.0
        System.out.println("int x = " + x);
        System.out.println("double d = " + d);

        // long → float：自动转换
        long bigNum = 100000L;
        float f = bigNum;   // long 100000 自动变成 float 100000.0
        System.out.println("long bigNum = " + bigNum);
        System.out.println("float f = " + f);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`byte b = 100
int i = 100
int num = 12345
long l = 12345
int x = 10
double d = 10.0
long bigNum = 100000
float f = 100000.0`}
    />
    <Paragraph>
      可以看到 <InlineCode>int x = 10</InlineCode> 赋给 <InlineCode>double d</InlineCode> 后，
      输出变成了 <InlineCode>10.0</InlineCode>——整数值被自动"扩展"为浮点数表示，数值没有任何损失。
    </Paragraph>

    <Heading4>② char 自动转 int（Unicode 码值）</Heading4>
    <Paragraph>
      <InlineCode>char</InlineCode> 类型存储的本质是字符对应的 <Text bold>Unicode 码值</Text>（一个整数）。
      因此 <InlineCode>char</InlineCode> 可以自动转换为 <InlineCode>int</InlineCode> 及更大的类型，
      转换结果就是该字符的 Unicode 编号。
    </Paragraph>
    <CodeBlock
      title="CharToInt.java"
      code={`public class CharToInt {
    public static void main(String[] args) {
        // char → int：得到字符的 Unicode（ASCII）码值
        char c1 = 'a';
        int n1 = c1;        // 'a' 的 ASCII 码是 97
        System.out.println("char c1 = " + c1);
        System.out.println("int n1 = " + n1);

        char c2 = 'A';
        int n2 = c2;        // 'A' 的 ASCII 码是 65
        System.out.println("char c2 = " + c2);
        System.out.println("int n2 = " + n2);

        char c3 = '0';
        int n3 = c3;        // '0' 的 ASCII 码是 48（注意：字符'0'不等于数字0）
        System.out.println("char c3 = " + c3);
        System.out.println("int n3 = " + n3);

        // char → double：多级自动转换，char → int → long → float → double
        char c4 = 'B';      // 'B' 的 ASCII 码是 66
        double d = c4;
        System.out.println("char c4 = " + c4);
        System.out.println("double d = " + d);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`char c1 = a
int n1 = 97
char c2 = A
int n2 = 65
char c3 = 0
int n3 = 48
char c4 = B
double d = 66.0`}
    />
    <Callout type="tip" title="字符 '0' 不等于数字 0">
      字符 <InlineCode>'0'</InlineCode> 转成 <InlineCode>int</InlineCode> 是 <Text bold>48</Text>，
      不是 0。数字字符和对应的整数在 Java 里是两回事，混淆这点是新手常见错误。
      常记：<InlineCode>'0'</InlineCode>=48，<InlineCode>'A'</InlineCode>=65，<InlineCode>'a'</InlineCode>=97。
    </Callout>

    <Heading4>③ 运算时自动提升</Heading4>
    <Paragraph>
      不同类型的数据参与<Text bold>运算</Text>时，结果会自动提升为参与运算的<Text bold>最大类型</Text>：
    </Paragraph>
    <CodeBlock
      title="MixedCalc.java"
      code={`public class MixedCalc {
    public static void main(String[] args) {
        int i = 10;
        double d = 3.14;
        // int + double → 结果自动提升为 double
        double result = i + d;
        System.out.println("10 + 3.14 = " + result);

        long l = 100L;
        // int + long → 结果自动提升为 long
        long r2 = i + l;
        System.out.println("10 + 100L = " + r2);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`10 + 3.14 = 13.14
10 + 100L = 110`}
    />

    <Heading3>5. 自动转换规则总结</Heading3>
    <Table
      head={['场景', '是否自动转换', '说明']}
      rows={[
        ['byte → int', '是', '小范围整数赋给大范围整数'],
        ['int → double', '是', '整数赋给浮点数'],
        ['char → int', '是', '字符按 Unicode 码值转整数'],
        ['double → int', '否', '大转小，必须强制转换（下节）'],
        ['int → byte', '否', '大转小，必须强制转换（下节）'],
        ['boolean → int', '否', 'boolean 完全独立，禁止互转'],
      ]}
    />

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己判断，再点 <Text accent>「看答案 →」</Text>核对。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：判断哪些赋值合法"
      code={`// 下面哪些赋值语句能通过编译（自动类型转换）？哪些会报错？请逐条分析。

byte  a = 10;
int   b = a;          // (1)
double c = b;         // (2)
long  d = 3.14;       // (3)
float e = 100;        // (4)
int   f = true;       // (5)
char  g = 'X';
int   h = g;          // (6)`}
      answerCode={`(1) int b = a;       ✅ 合法。byte → int，小转大，自动转换。
(2) double c = b;    ✅ 合法。int → double，小转大，自动转换。
(3) long d = 3.14;   ❌ 报错。3.14 是 double（取值范围大于 long），double 不能自动转 long。
                        需写：long d = (long)3.14;（强制转换，结果为 3）
(4) float e = 100;   ✅ 合法。整数字面量 100（int）可自动转 float，结果 100.0f。
(5) int f = true;    ❌ 报错。boolean 完全独立，不参与任何数值类型转换。
(6) int h = g;       ✅ 合法。char → int，'X' 的 Unicode 码值是 88，所以 h = 88。`}
    />
    <CodeBlock
      qa
      title="练习 2：预测输出结果"
      code={`// 预测下面程序的控制台输出，并说明原因。

public class Predict {
    public static void main(String[] args) {
        int i = 200;
        long l = i;
        float f = l;
        double d = f;

        System.out.println(i);
        System.out.println(l);
        System.out.println(f);
        System.out.println(d);

        char c = 'Z';
        int n = c;
        System.out.println(n);
    }
}`}
      answerCode={`控制台输出：
200
200
200.0
200.0
90

逐行分析：
  · i = 200（int），直接打印 200
  · l = i = 200（int → long 自动转换），打印 200
  · f = l = 200.0f（long → float 自动转换，整数变浮点数），打印 200.0
  · d = f = 200.0（float → double 自动转换），打印 200.0
  · 'Z' 的 Unicode / ASCII 码值是 90，char → int 自动转换，n = 90，打印 90`}
    />
  </article>
);

export default index;
