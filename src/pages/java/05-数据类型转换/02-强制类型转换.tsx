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
    <Title>强制类型转换</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上节的自动类型转换只走"小转大"这条安全路。若要反过来——把<Text bold>取值范围大的类型</Text>
        转成<Text bold>取值范围小的类型</Text>，就必须程序员亲自动手，写
        <Text accent>强制类型转换（显式转换）</Text>。
        强制转换的代价是：<Text bold>可能丢失数据或造成溢出</Text>。
        本节把两个最重要的风险点讲透：小数截断和整数溢出。
      </Paragraph>
    </Callout>

    <Heading3>1. 语法格式</Heading3>
    <Paragraph>
      强制类型转换的格式非常固定，只需在要转换的值前面加上
      <Text bold>圆括号括起来的目标类型</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      title="强制类型转换语法"
      code={`(目标类型) 值或变量

示例：
  double d = 3.9;
  int i = (int) d;    // 把 double 强制转成 int，结果 i = 3`}
    />

    <Heading3>2. 风险一：小数转整数——截断，不是四舍五入</Heading3>
    <Callout type="danger" title="截断取整，不是四舍五入">
      <Paragraph>
        把浮点数强制转换为整数时，Java <Text bold>直接丢弃小数部分</Text>，
        <Text bold>不做四舍五入</Text>。
        无论小数部分是 0.1 还是 0.9，统统截掉。
        <InlineCode>(int) 3.9</InlineCode> 结果是 <Text bold>3</Text>，
        不是 4。
        <InlineCode>(int) -3.9</InlineCode> 结果是 <Text bold>-3</Text>，
        不是 -4。
      </Paragraph>
    </Callout>
    <CodeBlock
      title="CastTruncate.java"
      code={`public class CastTruncate {
    public static void main(String[] args) {
        double d1 = 3.1;
        double d2 = 3.9;
        double d3 = -3.1;
        double d4 = -3.9;

        System.out.println("(int) 3.1  = " + (int) d1);   // 直接截断 → 3
        System.out.println("(int) 3.9  = " + (int) d2);   // 直接截断 → 3，不是 4！
        System.out.println("(int) -3.1 = " + (int) d3);   // 直接截断 → -3
        System.out.println("(int) -3.9 = " + (int) d4);   // 直接截断 → -3，不是 -4！
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`(int) 3.1  = 3
(int) 3.9  = 3
(int) -3.1 = -3
(int) -3.9 = -3`}
    />
    <Paragraph>
      正负数都向<Text bold>零的方向</Text>截断（学术上叫"截断取整"或"向零取整"）。
      如果你需要四舍五入，应该用 <InlineCode>Math.round()</InlineCode> 方法，而不是强制转换。
    </Paragraph>

    <Heading3>3. 风险二：整数溢出——数据失真</Heading3>
    <Paragraph>
      把一个整数强制转换成<Text bold>取值范围更小</Text>的整数类型时，
      如果该值超出了目标类型的范围，就会发生<Text bold>溢出</Text>，
      结果是一个看起来毫不相关的数字。
    </Paragraph>
    <Heading4>溢出原理：只保留低位字节</Heading4>
    <Paragraph>
      强制转换时，Java 只保留目标类型所需的<Text bold>低位字节</Text>，高位直接丢弃，
      然后按目标类型的规则（补码）解读剩余位。
    </Paragraph>
    <CodeBlock
      language="text"
      title="(byte)300 的溢出推导过程"
      code={`目标类型 byte：1 字节 = 8 位，范围 -128 ~ 127

300 的二进制（int，4 字节 / 32 位）：
  00000000  00000000  00000001  00101100
  (高24位)             (低8位) ←── 只保留这 8 位

低 8 位：00101100

用 byte 的补码规则解读 00101100：
  最高位是 0 → 正数
  值 = 0*128 + 0*64 + 1*32 + 0*16 + 1*8 + 1*4 + 0*2 + 0*1
     = 32 + 8 + 4 = 44

结论：(byte)300 = 44`}
    />
    <Callout type="tip" title="更快的心算方法：对 256 取模再映射">
      <Paragraph>
        byte 的范围是 -128 ~ 127，共 256 个值。
        快速估算方法：先对 256 取模得到一个 0~255 的值，
        若结果大于 127 则减去 256（因为 byte 用补码，128~255 映射到 -128~-1）。
      </Paragraph>
      <CodeBlock
        language="text"
        title="快速估算公式"
        code={`300 % 256 = 44      → 44 <= 127，直接取 44     → (byte)300 = 44
130 % 256 = 130     → 130 > 127，130 - 256 = -126 → (byte)130 = -126
200 % 256 = 200     → 200 > 127，200 - 256 = -56  → (byte)200 = -56
256 % 256 = 0       → 0 <= 127，直接取 0           → (byte)256 = 0`}
      />
    </Callout>

    <Heading3>4. 完整示例：各种强制转换</Heading3>
    <CodeBlock
      title="ForceCastDemo.java"
      code={`public class ForceCastDemo {
    public static void main(String[] args) {
        // ① double → int：截断小数
        double d = 3.99;
        int i = (int) d;
        System.out.println("(int) 3.99 = " + i);       // 3（截断，不是4）

        // ② double → int：负数截断
        double d2 = -3.9;
        int i2 = (int) d2;
        System.out.println("(int) -3.9 = " + i2);      // -3（向零截断）

        // ③ int → byte：正常范围，不溢出
        int n1 = 100;
        byte b1 = (byte) n1;
        System.out.println("(byte) 100 = " + b1);      // 100（在-128~127范围内）

        // ④ int → byte：超出范围，溢出
        int n2 = 130;
        byte b2 = (byte) n2;
        System.out.println("(byte) 130 = " + b2);      // -126（溢出！）

        // ⑤ int → byte：更大的值，溢出
        int n3 = 300;
        byte b3 = (byte) n3;
        System.out.println("(byte) 300 = " + b3);      // 44（溢出！）

        // ⑥ long → int：截断高位
        long bigL = 10000000000L;   // 100亿，超出 int 范围
        int fromLong = (int) bigL;
        System.out.println("(int) 10000000000L = " + fromLong);  // 1410065408（溢出）
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`(int) 3.99 = 3
(int) -3.9 = -3
(byte) 100 = 100
(byte) 130 = -126
(byte) 300 = 44
(int) 10000000000L = 1410065408`}
    />
    <Paragraph>
      注意 <InlineCode>(byte) 100 = 100</InlineCode> 是正常的——100 在 byte 的范围
      <InlineCode>-128 ~ 127</InlineCode> 之内，不会溢出。
      而 130 和 300 都超出了这个范围，结果变成了完全不同的数字，
      这就是强制转换的风险所在。
    </Paragraph>

    <Heading3>5. 与自动转换的完整对比</Heading3>
    <Table
      head={['对比项', '自动类型转换', '强制类型转换']}
      rows={[
        ['方向', '小范围 → 大范围', '大范围 → 小范围'],
        ['写法', '直接赋值，无需额外代码', '必须写 (目标类型) 显式声明'],
        ['安全性', '安全，数据无损', '有风险，可能截断或溢出'],
        ['小数丢失', '不涉及', '小数部分直接截断'],
        ['整数溢出', '不会', '可能发生，结果难以预料'],
        ['编译器', '自动处理', '程序员负责，编译器不警告'],
      ]}
    />

    <Heading3>6. 强制转换的括号优先级</Heading3>
    <Callout type="warning" title="注意括号的作用范围">
      <Paragraph>
        强制转换只作用于<Text bold>紧跟在后面的那一个值或表达式</Text>。
        如果要转换一个表达式的结果，必须用括号把整个表达式括起来。
      </Paragraph>
      <CodeBlock
        title="括号优先级示例"
        code={`double x = 10.5;
double y = 3.2;

// 错误写法：(int) 先转 x 得到 10，再加 y，结果是 double 13.2
double r1 = (int) x + y;    // r1 = 10 + 3.2 = 13.2（double）

// 正确写法：先算 x + y = 13.7，再整体转 int，结果 = 13
int r2 = (int) (x + y);     // r2 = 13`}
      />
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己推算，再点 <Text accent>「看答案 →」</Text>核对。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：预测强制转换结果"
      code={`// 预测下列表达式的值，并说明原因。
// （提示：截断 or 溢出？先判断目标类型的范围）

(1) (int) 3.99
(2) (int) -3.9
(3) (byte) 127
(4) (byte) 128
(5) (byte) 130
(6) (byte) 300`}
      answerCode={`(1) (int) 3.99   = 3
    原因：小数直接截断，不是四舍五入。

(2) (int) -3.9   = -3
    原因：负数也是向零方向截断，-3.9 → -3（不是 -4）。

(3) (byte) 127   = 127
    原因：127 在 byte 范围 [-128, 127] 之内，不溢出，直接保留。

(4) (byte) 128   = -128
    原因：128 超出 byte 上限 127，溢出。
    推算：128 % 256 = 128 > 127，所以 128 - 256 = -128。

(5) (byte) 130   = -126
    原因：130 超出 byte 上限 127，溢出。
    推算：130 % 256 = 130 > 127，所以 130 - 256 = -126。

(6) (byte) 300   = 44
    原因：300 超出 byte 范围，溢出。
    推算：300 % 256 = 44，44 <= 127，直接取 44。`}
    />
    <CodeBlock
      qa
      title="练习 2：找出代码中的问题并修复"
      code={`// 下面的代码有两处问题，找出来并改正。
// 要求：① 把 d1 转成 int 时做四舍五入（结果应为 4）
//       ② 把 price 的总价算出来并存为 int（去掉小数部分）

public class FixCast {
    public static void main(String[] args) {
        double d1 = 3.6;
        int rounded = (int) d1;         // 问题①：希望得到 4，实际得到 3
        System.out.println(rounded);

        double price = 9.99;
        int count = 3;
        int total = (int) price * count; // 问题②：希望得到 29（先算9.99*3=29.97再取整），实际得到 27
        System.out.println(total);
    }
}`}
      answerCode={`public class FixCast {
    public static void main(String[] args) {
        double d1 = 3.6;
        // 修复①：用 Math.round() 做四舍五入，结果为 4
        int rounded = (int) Math.round(d1);
        System.out.println(rounded);   // 输出 4

        double price = 9.99;
        int count = 3;
        // 修复②：用括号括住整个表达式，先算乘法再转 int
        int total = (int) (price * count);   // (int)(9.99 * 3) = (int)29.97 = 29
        System.out.println(total);     // 输出 29
    }
}

/* 问题分析：
   问题①：(int) 3.6 = 3（截断），不是四舍五入。要四舍五入用 Math.round()。
   问题②：(int) price * count = (int)(9.99) * 3 = 9 * 3 = 27。
           强制转换的优先级高于乘法，只转了 price，不是整个表达式。
           修复：(int)(price * count) 先乘后转，结果正确。
*/`}
    />
    <UnorderedList>
      <ListItem>
        <Text bold>截断不等于四舍五入</Text>：强制转 int 总是向零截断，需要四舍五入请用
        <InlineCode>Math.round()</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>操作之前先确认范围</Text>：把整数转成 byte/short 之前，先判断值是否在目标类型范围内，
        否则溢出后结果完全不可预期。
      </ListItem>
      <ListItem>
        <Text bold>括号控制转换范围</Text>：<InlineCode>(int) a + b</InlineCode> 和
        <InlineCode>(int)(a + b)</InlineCode> 含义截然不同，务必加括号明确意图。
      </ListItem>
    </UnorderedList>
  </article>
);

export default index;
