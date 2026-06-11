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
    <Title>基本数据类型</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 是<Text bold>强类型语言</Text>——每一个变量在声明时都必须指定类型，
        编译器会据此分配内存并检查赋值是否合法。Java 内置了
        <Text bold> 8 种基本数据类型</Text>（primitive type），它们是语言的地基，
        直接存储数值本身（不同于对象引用）。本节把这 8 种类型的字节大小、取值范围、
        字面量写法以及最高频的编译陷阱全部讲清楚。
      </Paragraph>
    </Callout>

    <Heading3>1. 8 种基本数据类型总览</Heading3>
    <Paragraph>
      按用途分成四组：<Text bold>整数类型</Text>（4 种）、
      <Text bold>浮点类型</Text>（2 种）、<Text bold>字符类型</Text>（1 种）、
      <Text bold>布尔类型</Text>（1 种）。
    </Paragraph>
    <Table
      head={['分类', '类型', '占用字节', '取值范围', '说明']}
      rows={[
        ['整数', <InlineCode>byte</InlineCode>, '1 字节（8 bit）', '-128 ~ 127', '最小整数类型，常用于文件流、网络字节操作'],
        ['整数', <InlineCode>short</InlineCode>, '2 字节（16 bit）', '-32768 ~ 32767', '较少单独使用'],
        ['整数', <InlineCode>int</InlineCode>, '4 字节（32 bit）', '-2147483648 ~ 2147483647（约 ±21 亿）', '整数的默认类型，日常最常用'],
        ['整数', <InlineCode>long</InlineCode>, '8 字节（64 bit）', '约 ±9.2 × 10¹⁸', '超大整数，字面量须加后缀 L'],
        ['浮点', <InlineCode>float</InlineCode>, '4 字节（32 bit）', '约 ±3.4 × 10³⁸，精度约 7 位十进制', '单精度，字面量须加后缀 F'],
        ['浮点', <InlineCode>double</InlineCode>, '8 字节（64 bit）', '约 ±1.8 × 10³⁰⁸，精度约 15~16 位十进制', '双精度，小数的默认类型'],
        ['字符', <InlineCode>char</InlineCode>, '2 字节（16 bit）', '0 ~ 65535（对应 Unicode 码点）', '单个字符，用单引号，如 \'A\''],
        ['布尔', <InlineCode>boolean</InlineCode>, '逻辑 1 bit（JVM 实现不定）', 'true / false', '只有两个值，用于条件判断'],
      ]}
    />

    <Heading3>2. 整数类型详解</Heading3>
    <Heading4>① 默认类型是 int</Heading4>
    <Paragraph>
      在 Java 中，直接写下一个整数字面量（如 <InlineCode>100</InlineCode>、
      <InlineCode>-50</InlineCode>），编译器默认把它当作 <InlineCode>int</InlineCode> 类型处理。
      因此把 <InlineCode>int</InlineCode> 范围内的整数赋给 <InlineCode>byte</InlineCode> 或
      <InlineCode>short</InlineCode> 时编译器会自动完成兼容赋值（字面量在范围内即可）；
      但超出 <InlineCode>int</InlineCode> 范围时就必须使用 <InlineCode>long</InlineCode> 并加后缀。
    </Paragraph>

    <Heading4>② long 字面量必须加后缀 L</Heading4>
    <Callout type="danger" title="常见坑：long 赋值超出 int 范围不加 L 导致编译报错">
      <Paragraph>
        <InlineCode>10000000000</InlineCode>（100 亿）超出了 <InlineCode>int</InlineCode> 的最大值
        约 21 亿，编译器会直接报错"<Text bold>integer number too large</Text>"。
        必须在数字后面加 <InlineCode>L</InlineCode>（大写，推荐）或 <InlineCode>l</InlineCode>（小写，
        但 l 和 1 字形太像，强烈建议用大写 <InlineCode>L</InlineCode>）。
      </Paragraph>
      <CodeBlock
        title="long 赋值示范"
        code={`long correct = 10000000000L;  // ✅ 加了 L，正确
long wrong   = 10000000000;   // ❌ 编译报错：integer number too large

// 如果数字在 int 范围内，不加 L 也没事（int 能自动提升到 long）
long small = 100;             // ✅ 100 在 int 范围内，可以不加 L`}
      />
    </Callout>

    <Heading3>3. 浮点类型详解</Heading3>
    <Heading4>① 默认类型是 double</Heading4>
    <Paragraph>
      直接写一个小数字面量（如 <InlineCode>3.14</InlineCode>），编译器默认把它当作
      <InlineCode>double</InlineCode>。因此把 <InlineCode>3.14</InlineCode> 赋给
      <InlineCode>float</InlineCode> 变量会报"<Text bold>类型不兼容</Text>"错误——
      因为 <InlineCode>double</InlineCode>（8 字节）向 <InlineCode>float</InlineCode>（4 字节）
      赋值属于"大转小"，可能丢失精度，编译器拒绝自动转换。
    </Paragraph>

    <Heading4>② float 字面量必须加后缀 F</Heading4>
    <Callout type="danger" title="常见坑：float 赋值不加 F 导致编译报错">
      <Paragraph>
        必须在小数后面加 <InlineCode>F</InlineCode>（大写）或 <InlineCode>f</InlineCode>（小写）
        来告诉编译器"这是 float"。
      </Paragraph>
      <CodeBlock
        title="float 赋值示范"
        code={`float correct = 3.14F;   // ✅ 加了 F，正确
float wrong   = 3.14;   // ❌ 编译报错：incompatible types: possible lossy conversion from double to float

double d = 3.14;        // ✅ 小数默认就是 double，不需要后缀`}
      />
    </Callout>

    <Callout type="warning" title="浮点数精度问题">
      浮点数在计算机内部以二进制存储，某些十进制小数（如 <InlineCode>0.1</InlineCode>）
      无法被精确表示，因此浮点运算可能出现细微误差。涉及金融计算时应使用
      <InlineCode>BigDecimal</InlineCode> 而非 <InlineCode>double</InlineCode>。
    </Callout>

    <Heading3>4. 字符类型 char</Heading3>
    <Paragraph>
      <InlineCode>char</InlineCode> 存储单个字符，必须用<Text bold>英文单引号</Text>括起来，
      如 <InlineCode>'A'</InlineCode>、<InlineCode>'中'</InlineCode>、<InlineCode>'0'</InlineCode>。
      Java 的 <InlineCode>char</InlineCode> 占 2 个字节，基于 Unicode 编码，
      因此能存储中文字符（中文 Unicode 码点均在 0~65535 范围内）。
    </Paragraph>
    <Callout type="warning" title="单引号 vs 双引号">
      <InlineCode>'A'</InlineCode> 是 <Text bold>char</Text>（字符），
      <InlineCode>"A"</InlineCode> 是 <Text bold>String</Text>（字符串，引用类型）。
      两者类型不同，混用会导致编译报错。此外，<InlineCode>char</InlineCode> 只能存
      <Text bold>单个字符</Text>，<InlineCode>'AB'</InlineCode> 是非法的。
    </Callout>

    <Heading3>5. 布尔类型 boolean</Heading3>
    <Paragraph>
      <InlineCode>boolean</InlineCode> 只有两个值：<InlineCode>true</InlineCode> 和
      <InlineCode>false</InlineCode>（全部小写，这是 Java 关键字）。
      它主要用在条件判断中，后面学 <InlineCode>if</InlineCode>、
      <InlineCode>while</InlineCode> 时会大量用到。
    </Paragraph>
    <Callout type="danger" title="Java 的 boolean 不能用 0 / 1 代替">
      与 C/C++ 不同，Java 中 <InlineCode>boolean</InlineCode> 和整数是完全不同的类型，
      不能把 <InlineCode>0</InlineCode> 或 <InlineCode>1</InlineCode> 赋给
      <InlineCode>boolean</InlineCode> 变量，否则直接编译报错。
    </Callout>

    <Heading3>6. 综合示例：定义并打印所有类型</Heading3>
    <CodeBlock
      title="PrimitiveTypes.java"
      code={`public class PrimitiveTypes {
    public static void main(String[] args) {
        // 整数类型
        byte   b  = 127;
        short  s  = 32767;
        int    i  = 2147483647;
        long   l  = 10000000000L;    // 注意：加 L

        // 浮点类型
        float  f  = 3.14F;           // 注意：加 F
        double d  = 3.141592653589;

        // 字符类型（单引号）
        char   c  = 'J';

        // 布尔类型
        boolean flag = true;

        System.out.println("byte    : " + b);
        System.out.println("short   : " + s);
        System.out.println("int     : " + i);
        System.out.println("long    : " + l);
        System.out.println("float   : " + f);
        System.out.println("double  : " + d);
        System.out.println("char    : " + c);
        System.out.println("boolean : " + flag);
    }
}`}
    />
    <Paragraph>运行后控制台输出：</Paragraph>
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`byte    : 127
short   : 32767
int     : 2147483647
long    : 10000000000
float   : 3.14
double  : 3.141592653589
char    : J
boolean : true`}
    />
    <Callout type="tip" title="float 输出为什么不是 3.14F">
      打印 <InlineCode>float</InlineCode> 时，Java 会自动去掉后缀 F，只显示数值本身。
      另外 <InlineCode>float</InlineCode> 精度约 7 位有效数字，打印 <InlineCode>3.14F</InlineCode>
      结果正好是 <InlineCode>3.14</InlineCode>，但更复杂的小数可能会看到尾部误差。
    </Callout>

    <Heading3>7. 关键要点汇总</Heading3>
    <Table
      head={['类型', '字面量示例', '是否需要后缀', '常见错误']}
      rows={[
        [<InlineCode>long</InlineCode>, <InlineCode>10000000000L</InlineCode>, '超出 int 范围时必须加 L', '不加 L 且超出 int 范围 → 编译报错'],
        [<InlineCode>float</InlineCode>, <InlineCode>3.14F</InlineCode>, '必须加 F（小数默认是 double）', '不加 F → 编译报错'],
        [<InlineCode>double</InlineCode>, <InlineCode>3.14</InlineCode>, '无需后缀（默认）', '无'],
        [<InlineCode>char</InlineCode>, <InlineCode>'A'</InlineCode>, '无后缀，用单引号', '用双引号或多个字符 → 编译报错'],
        [<InlineCode>boolean</InlineCode>, <InlineCode>true</InlineCode> , '无后缀', '用 0/1 代替 → 编译报错'],
      ]}
    />

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先独立思考，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：判断哪些写法编译报错"
      code={`// 下面 6 行代码，哪几行会编译报错？为什么？

(1)  long a = 100;
(2)  long b = 10000000000;
(3)  float c = 3.14;
(4)  float d = 3.14F;
(5)  boolean e = 1;
(6)  char f = "A";`}
      answerCode={`报错的是：(2)(3)(5)(6)，分析如下：

(1)  long a = 100;
     ✅ 正确。100 在 int 范围内，int 可自动提升为 long，不需要加 L。

(2)  long b = 10000000000;
     ❌ 编译报错：integer number too large
     原因：10000000000（100 亿）超出 int 的最大值（约 21 亿），
     编译器先把它当 int 处理就已经溢出报错。应写：long b = 10000000000L;

(3)  float c = 3.14;
     ❌ 编译报错：incompatible types: possible lossy conversion from double to float
     原因：3.14 默认是 double（8 字节），赋给 float（4 字节）属于"大转小"，
     编译器不自动转换。应写：float c = 3.14F;

(4)  float d = 3.14F;
     ✅ 正确。加了 F 后缀，明确告诉编译器这是 float 字面量。

(5)  boolean e = 1;
     ❌ 编译报错：incompatible types: int cannot be converted to boolean
     原因：Java 的 boolean 与整数完全独立，不能用 0/1 代替。
     应写：boolean e = true;

(6)  char f = "A";
     ❌ 编译报错：incompatible types: String cannot be converted to char
     原因：双引号 "A" 是 String 类型，char 必须用单引号。
     应写：char f = 'A';`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习 2：填写字面量后缀使代码正确编译"
      code={`// 在空白处填入正确的后缀（L / F），使下面的代码能正确编译。
// 如果不需要后缀，填"不需要"并说明原因。

public class LiteralSuffix {
    public static void main(String[] args) {
        long  population = 1400000000____;   // 中国人口约 14 亿
        long  distance   = 384400000____;    // 月地距离约 3.844 亿米
        float pi         = 3.14159____;
        float discount   = 0.8____;
        double ratio     = 0.618;            // 此处是否需要后缀？
    }
}`}
      answerCode={`public class LiteralSuffix {
    public static void main(String[] args) {
        long  population = 1400000000L;   // 14 亿 > int 最大值（约 21 亿）…等等！
        // 注意：14 亿 = 1_400_000_000，实际上 < 2147483647，在 int 范围内，
        // 但习惯上给 long 类型变量加 L 更清晰，也是推荐写法。
        // 严格来说不加也能编译，但加上 L 是好习惯。

        long  distance   = 384400000L;    // 3.844 亿 < int 最大值，技术上不加也行，
        // 同样建议加 L 表明这是 long 类型的字面量。

        float pi         = 3.14159F;      // 必须加 F！小数默认 double，不加编译报错。
        float discount   = 0.8F;          // 必须加 F！同上。

        double ratio     = 0.618;         // 不需要后缀。小数默认就是 double，无需任何后缀。
    }
}

// 核心规则总结：
// · 小数默认 double，赋给 float 必须加 F；
// · 整数默认 int，超出 int 范围赋给 long 必须加 L；
//   未超出 int 范围可不加，但声明为 long 时加 L 是好习惯。`}
    />

    <UnorderedList>
      <ListItem>
        <Text bold>整数默认 int，小数默认 double</Text>——这是 Java 字面量最核心的规则。
      </ListItem>
      <ListItem>
        超出 <InlineCode>int</InlineCode> 范围的整数赋给 <InlineCode>long</InlineCode> 必须加
        <InlineCode>L</InlineCode>；小数赋给 <InlineCode>float</InlineCode> 必须加
        <InlineCode>F</InlineCode>。
      </ListItem>
      <ListItem>
        <InlineCode>char</InlineCode> 用<Text bold>单引号</Text>，
        <InlineCode>boolean</InlineCode> 只有 <InlineCode>true</InlineCode> 和
        <InlineCode>false</InlineCode>，不能用 0/1 替代。
      </ListItem>
    </UnorderedList>
  </article>
);

export default index;
