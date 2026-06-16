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
    <Title>ASCII 编码表</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前面几节多次出现"<InlineCode>'a'</InlineCode> 对应 97"、
        "<InlineCode>'A'</InlineCode> 对应 65"这样的说法。
        这一节把背后的原理讲清楚：Java 的 <InlineCode>char</InlineCode> 类型到底存的是什么，
        以及如何利用字符与整数的映射关系做<Text accent>大小写转换</Text>、
        <Text accent>char 与 int 互转</Text>等实用操作。
      </Paragraph>
    </Callout>

    <Heading3>1. char 的本质：存的是码值，不是字符本身</Heading3>
    <Paragraph>
      计算机只能存数字，不能直接存"字母"或"符号"。为了表示字符，
      人们制定了一张<Text bold>编码表</Text>，规定每个字符对应哪个整数。
      Java 的 <InlineCode>char</InlineCode> 在内存中存储的就是这个整数（2 个字节，无符号，范围 0~65535）。
    </Paragraph>
    <Paragraph>
      Java 使用 <Text bold>Unicode 编码</Text>，它兼容最经典的
      <Text bold>ASCII 编码</Text>（American Standard Code for Information Interchange，
      美国信息交换标准代码）。ASCII 只定义了 128 个字符（0~127），
      覆盖英文字母、数字、常用符号和控制字符，在 Unicode 中码值完全一致。
    </Paragraph>
    <Callout type="tip" title="三个最重要的码值，必须记住">
      <UnorderedList>
        <ListItem>
          <InlineCode>'0'</InlineCode> 对应 <Text bold>48</Text>（数字字符 0~9 从 48 开始连续排列）
        </ListItem>
        <ListItem>
          <InlineCode>'A'</InlineCode> 对应 <Text bold>65</Text>（大写字母 A~Z 从 65 开始连续排列）
        </ListItem>
        <ListItem>
          <InlineCode>'a'</InlineCode> 对应 <Text bold>97</Text>（小写字母 a~z 从 97 开始连续排列）
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>2. 常用 ASCII 码表</Heading3>
    <Table
      head={['字符', '十进制码值', '说明']}
      rows={[
        ["'0'", '48', '数字 0（注意不是整数 0）'],
        ["'1'", '49', '数字 1'],
        ["'9'", '57', '数字 9（0~9 共 10 个，48~57）'],
        ["'A'", '65', '大写字母 A'],
        ["'B'", '66', '大写字母 B'],
        ["'Z'", '90', '大写字母 Z（A~Z 共 26 个，65~90）'],
        ["'a'", '97', '小写字母 a'],
        ["'b'", '98', '小写字母 b'],
        ["'z'", '122', '小写字母 z（a~z 共 26 个，97~122）'],
        ["' '（空格）", '32', '空格字符'],
        ["'\\n'", '10', '换行符（Line Feed）'],
        ["'\\t'", '9', '制表符（Tab）'],
      ]}
    />
    <Paragraph>
      关键规律：<Text bold>同一套字母的大小写码值相差 32</Text>。
      大写 A(65) 到小写 a(97)，差值正好是 32；B(66) 到 b(98)，同样差 32。
      这个规律是大小写转换技巧的基础。
    </Paragraph>

    <Heading3>3. char 与 int 互转</Heading3>
    <Heading4>① char 转 int：获取字符的码值</Heading4>
    <CodeBlock
      title="CharToIntDemo.java"
      code={`public class CharToIntDemo {
    public static void main(String[] args) {
        // 方法一：直接赋给 int 变量（自动类型转换）
        char c1 = 'A';
        int code1 = c1;
        System.out.println("'A' 的码值 = " + code1);   // 65

        // 方法二：强制转换（效果相同）
        int code2 = (int) 'a';
        System.out.println("'a' 的码值 = " + code2);   // 97

        // 方法三：直接打印时用拼接强制转 int
        System.out.println("'0' 的码值 = " + (int)'0'); // 48
        System.out.println("'Z' 的码值 = " + (int)'Z'); // 90
        System.out.println("'z' 的码值 = " + (int)'z'); // 122
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`'A' 的码值 = 65
'a' 的码值 = 97
'0' 的码值 = 48
'Z' 的码值 = 90
'z' 的码值 = 122`}
    />

    <Heading4>② int 转 char：把码值变成字符</Heading4>
    <CodeBlock
      title="IntToCharDemo.java"
      code={`public class IntToCharDemo {
    public static void main(String[] args) {
        // 必须用强制转换（int → char 是大转小）
        char c1 = (char) 65;
        System.out.println("码值 65 = " + c1);   // A

        char c2 = (char) 97;
        System.out.println("码值 97 = " + c2);   // a

        char c3 = (char) 48;
        System.out.println("码值 48 = " + c3);   // 0

        char c4 = (char) 98;
        System.out.println("码值 98 = " + c4);   // b

        // 用变量
        int code = 90;
        char ch = (char) code;
        System.out.println("码值 90 = " + ch);   // Z
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`码值 65 = A
码值 97 = a
码值 48 = 0
码值 98 = b
码值 90 = Z`}
    />

    <Heading3>4. 大小写转换技巧</Heading3>
    <Paragraph>
      利用大写字母和小写字母之间固定相差 <Text bold>32</Text> 的规律，
      可以用简单的加减法实现大小写转换。
    </Paragraph>
    <Table
      head={['目标', '方向', '操作', '示例']}
      rows={[
        ['大写 → 小写', '码值 +32', "(char)(大写字母 + 32)", "(char)('A' + 32) = 'a'"],
        ['小写 → 大写', '码值 -32', "(char)(小写字母 - 32)", "(char)('a' - 32) = 'A'"],
      ]}
    />
    <CodeBlock
      title="CaseConvert.java"
      code={`public class CaseConvert {
    public static void main(String[] args) {
        // 大写转小写：+32
        char upper1 = 'A';
        char lower1 = (char) (upper1 + 32);
        System.out.println("'A' + 32 = " + lower1);   // a

        char upper2 = 'Z';
        char lower2 = (char) (upper2 + 32);
        System.out.println("'Z' + 32 = " + lower2);   // z

        // 小写转大写：-32
        char lower3 = 'a';
        char upper3 = (char) (lower3 - 32);
        System.out.println("'a' - 32 = " + upper3);   // A

        char lower4 = 'b';
        char upper4 = (char) (lower4 - 32);
        System.out.println("'b' - 32 = " + upper4);   // B

        // 差值验证：'a' - 'A' = 32
        int diff = 'a' - 'A';
        System.out.println("'a' - 'A' = " + diff);    // 32
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`'A' + 32 = a
'Z' + 32 = z
'a' - 32 = A
'b' - 32 = B
'a' - 'A' = 32`}
    />
    <Callout type="tip" title="实际开发更推荐 API">
      上述加减法虽然经典，但实际开发中更推荐使用 Java 标准库方法：
      <InlineCode>Character.toUpperCase('a')</InlineCode> 和
      <InlineCode>Character.toLowerCase('A')</InlineCode>，
      或 <InlineCode>String.toUpperCase()</InlineCode> / <InlineCode>String.toLowerCase()</InlineCode>。
      加减 32 的方法只适用于 ASCII 范围内的英文字母，对中文、重音字母等 Unicode 字符会出错。
    </Callout>

    <Heading3>5. char 参与加法的注意点</Heading3>
    <Paragraph>
      当 <InlineCode>char</InlineCode> 与数字用 <InlineCode>+</InlineCode> 运算时，
      char 提升为 <InlineCode>int</InlineCode>，结果也是 <InlineCode>int</InlineCode>，
      <Text bold>不再是字符</Text>。若要得到字符结果，必须再强制转回 <InlineCode>char</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="CharArith.java"
      code={`public class CharArith {
    public static void main(String[] args) {
        // 'a' + 1 的结果是 int 98，不是字符 'b'
        System.out.println('a' + 1);           // 98（int）

        // 要得到字符 'b'，必须强制转回 char
        System.out.println((char)('a' + 1));   // b（char）

        // 'A' + 1 = 66（int）
        System.out.println('A' + 1);           // 66（int）

        // 要得到字符 'B'
        System.out.println((char)('A' + 1));   // B（char）

        // 利用数字字符和数字 0 的差值提取数字值
        char digit = '7';
        int numValue = digit - '0';  // '7'(55) - '0'(48) = 7
        System.out.println("字符 '7' 对应的数字值: " + numValue);  // 7
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`98
b
66
B
字符 '7' 对应的数字值: 7`}
    />
    <Callout type="tip" title="字符数字转整数的技巧">
      <InlineCode>digit - '0'</InlineCode> 是把字符形式的数字（如 <InlineCode>'7'</InlineCode>）
      转换成对应整数值（7）的经典写法。
      <InlineCode>'7'</InlineCode> 的码值是 55，<InlineCode>'0'</InlineCode> 的码值是 48，
      二者之差 55 - 48 = 7。这在处理字符串中的数字字符时非常实用。
    </Callout>

    <Heading3>6. 完整综合示例</Heading3>
    <CodeBlock
      title="AsciiSummary.java"
      code={`public class AsciiSummary {
    public static void main(String[] args) {
        // 1. 打印 A~E 的码值
        System.out.println("=== 字母码值 ===");
        for (char c = 'A'; c <= 'E'; c++) {
            System.out.println(c + " = " + (int) c);
        }

        // 2. 大小写转换
        System.out.println("=== 大小写转换 ===");
        char upper = 'G';
        char lower = (char) (upper + 32);
        System.out.println(upper + " → " + lower);

        char small = 'm';
        char big = (char) (small - 32);
        System.out.println(small + " → " + big);

        // 3. 字符数字提取
        System.out.println("=== 数字字符转整数 ===");
        char ch = '5';
        int val = ch - '0';
        System.out.println("字符 '" + ch + "' 的数值 = " + val);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`=== 字母码值 ===
A = 65
B = 66
C = 67
D = 68
E = 69
=== 大小写转换 ===
G → g
m → M
=== 数字字符转整数 ===
字符 '5' 的数值 = 5`}
    />

    <Heading3>7. 练习题</Heading3>
    <CodeBlock
      qa
      language="text"
      title="练习 1：预测结果"
      code={`// 不运行代码，直接预测每个表达式的值（类型 + 数值/字符）。

(1) (int) 'A'
(2) (int) 'a'
(3) (int) '0'
(4) (char) 98
(5) (char) 65
(6) 'A' + 1
(7) (char)('A' + 1)
(8) (char)('a' - 32)
(9) 'z' - 'a'`}
      answerCode={`(1) (int) 'A'          = 65      (int)    'A' 的 ASCII 码值
(2) (int) 'a'          = 97      (int)    'a' 的 ASCII 码值
(3) (int) '0'          = 48      (int)    字符 '0' 的 ASCII 码值，不是整数 0
(4) (char) 98          = 'b'     (char)   码值 98 对应字符 b
(5) (char) 65          = 'A'     (char)   码值 65 对应字符 A
(6) 'A' + 1            = 66      (int)    'A'(65) 提升为 int，65 + 1 = 66
(7) (char)('A' + 1)    = 'B'     (char)   66 转回 char，对应字符 B
(8) (char)('a' - 32)   = 'A'     (char)   97 - 32 = 65，转为 char 是 'A'
(9) 'z' - 'a'          = 25      (int)    'z'=122，'a'=97，122-97=25（小写字母共26个，z是第26个，索引25）`}
    />
    <CodeBlock
      qa
      title="练习 2：实现数字字符判断与提取"
      code={`// 已知变量 char ch，完成以下两个任务：
// ① 判断 ch 是否是数字字符（'0'~'9'）
// ② 如果是，提取其对应的整数值
// ③ 判断 ch 是否是大写字母，如果是，转成小写字母

public class CharCheck {
    public static void main(String[] args) {
        char ch = '7';

        // 任务①②：判断是否数字字符并提取值
        // 在这里补全代码...

        char ch2 = 'C';

        // 任务③：判断是否大写字母并转成小写
        // 在这里补全代码...
    }
}`}
      answerCode={`public class CharCheck {
    public static void main(String[] args) {
        char ch = '7';

        // 任务①②：判断是否数字字符（码值在 48~57 之间）并提取值
        if (ch >= '0' && ch <= '9') {
            int numValue = ch - '0';  // 提取数字值
            System.out.println(ch + " 是数字字符，对应整数值：" + numValue);
        } else {
            System.out.println(ch + " 不是数字字符");
        }
        // 输出：7 是数字字符，对应整数值：7

        char ch2 = 'C';

        // 任务③：判断是否大写字母（码值在 65~90 之间）并转成小写
        if (ch2 >= 'A' && ch2 <= 'Z') {
            char lower = (char) (ch2 + 32);
            System.out.println(ch2 + " 是大写字母，对应小写字母：" + lower);
        } else {
            System.out.println(ch2 + " 不是大写字母");
        }
        // 输出：C 是大写字母，对应小写字母：c
    }
}

/* 关键点：
   · 数字字符 '0'~'9' 码值范围 48~57；判断用 ch >= '0' && ch <= '9'
   · 提取数字值：ch - '0'（利用连续排列的规律）
   · 大写字母 'A'~'Z' 码值范围 65~90；判断用 ch >= 'A' && ch <= 'Z'
   · 大写转小写：(char)(ch + 32)
*/`}
    />
    <UnorderedList>
      <ListItem>
        <Text bold>char 存的是 Unicode 码值</Text>，与 int 可以互转：char 赋给 int 自动转换，int 赋给 char 需强制转换。
      </ListItem>
      <ListItem>
        <Text bold>三个必记码值</Text>：<InlineCode>'0'</InlineCode>=48，<InlineCode>'A'</InlineCode>=65，<InlineCode>'a'</InlineCode>=97。
      </ListItem>
      <ListItem>
        <Text bold>大小写差值恒为 32</Text>：大写 +32 得小写，小写 -32 得大写，转换后需 <InlineCode>(char)</InlineCode> 强制转回。
      </ListItem>
      <ListItem>
        <Text bold>char 参与运算结果是 int</Text>：<InlineCode>'a' + 1 = 98</InlineCode>（int），要得字符需 <InlineCode>(char)('a' + 1)</InlineCode>。
      </ListItem>
    </UnorderedList>
    <ChapterExercises categoryKey="datatypes" />
  </article>
);

export default index;
