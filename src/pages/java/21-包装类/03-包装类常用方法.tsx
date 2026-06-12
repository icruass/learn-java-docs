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
    <Title>包装类常用方法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        包装类不只是「装基本值的盒子」，还提供了大量<Text bold>实用的静态常量与方法</Text>：
        取值范围常量、字符串与数值互转、进制转换、数值比较等。本节系统梳理
        <InlineCode>Integer</InlineCode> 等包装类最常用的 API（字符串↔数值在「字符串」章节已涉及，
        这里从包装类角度再做完整归纳），是处理输入解析、边界判断的基础工具箱。
      </Paragraph>
    </Callout>

    <Heading3>1. 取值范围常量</Heading3>
    <Paragraph>
      每个数值包装类都有 <InlineCode>MAX_VALUE</InlineCode>/<InlineCode>MIN_VALUE</InlineCode> 常量，
      表示该类型能表示的最大/最小值，做边界判断时很有用：
    </Paragraph>
    <CodeBlock
      title="MinMaxDemo.java"
      code={`public class MinMaxDemo {
    public static void main(String[] args) {
        System.out.println("int  最大: " + Integer.MAX_VALUE);
        System.out.println("int  最小: " + Integer.MIN_VALUE);
        System.out.println("long 最大: " + Long.MAX_VALUE);
        System.out.println("byte 最大: " + Byte.MAX_VALUE);
        System.out.println("int 占位数: " + Integer.SIZE + " 位");
        System.out.println("int 占字节: " + Integer.BYTES + " 字节");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`int  最大: 2147483647
int  最小: -2147483648
long 最大: 9223372036854775807
byte 最大: 127
int 占位数: 32 位
int 占字节: 4 字节`}
    />
    <Callout type="warning" title="注意整数溢出">
      <InlineCode>Integer.MAX_VALUE + 1</InlineCode> 会<Text bold>溢出</Text>变成
      <InlineCode>Integer.MIN_VALUE</InlineCode>（-2147483648），而不是报错。
      做累加/累乘时如果担心超界，应改用 <InlineCode>long</InlineCode> 或 <InlineCode>BigInteger</InlineCode>。
    </Callout>

    <Heading3>2. 字符串转数值：parseXxx 与 valueOf</Heading3>
    <Table
      head={['方法', '返回类型', '用途']}
      rows={[
        ['Integer.parseInt(s)', 'int（基本类型）', '字符串转 int，参与运算'],
        ['Integer.valueOf(s)', 'Integer（包装对象）', '字符串转 Integer，含缓存'],
        ['Integer.parseInt(s, radix)', 'int', '按指定进制解析（如二进制字符串）'],
        ['Double.parseDouble(s)', 'double', '字符串转小数'],
        ['Boolean.parseBoolean(s)', 'boolean', '字符串转布尔'],
      ]}
    />
    <CodeBlock
      title="ParseDemo.java"
      code={`public class ParseDemo {
    public static void main(String[] args) {
        int n = Integer.parseInt("256");
        double d = Double.parseDouble("3.14");
        System.out.println("n + 1 = " + (n + 1));
        System.out.println("d * 2 = " + (d * 2));

        // 按进制解析：把二进制字符串 "1010" 解析成十进制
        int bin = Integer.parseInt("1010", 2);
        System.out.println("二进制 1010 = " + bin);

        // 非法格式抛 NumberFormatException
        try {
            Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            System.out.println("解析失败: " + e.getMessage());
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`n + 1 = 257
d * 2 = 6.28
二进制 1010 = 10
解析失败: For input string: "abc"`}
    />

    <Heading3>3. 数值转字符串与进制转换</Heading3>
    <CodeBlock
      title="ToStringRadix.java"
      code={`public class ToStringRadix {
    public static void main(String[] args) {
        int n = 60;

        // 转普通十进制字符串
        System.out.println(Integer.toString(n));

        // 进制转换（十进制 -> 其它进制字符串）
        System.out.println("二进制: " + Integer.toBinaryString(n));   // 111100
        System.out.println("八进制: " + Integer.toOctalString(n));    // 74
        System.out.println("十六进制: " + Integer.toHexString(n));    // 3c

        // 任意进制：第二参数 radix
        System.out.println("五进制: " + Integer.toString(n, 5));      // 220
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`60
二进制: 111100
八进制: 74
十六进制: 3c
五进制: 220`}
    />

    <Heading3>4. 数值比较：compare 与 max / min / sum</Heading3>
    <Paragraph>
      包装类提供静态的比较与运算方法，常用于排序的比较器、求极值：
    </Paragraph>
    <CodeBlock
      title="CompareDemo.java"
      code={`import java.util.Arrays;
import java.util.Comparator;

public class CompareDemo {
    public static void main(String[] args) {
        // compare(a, b)：a<b 返回负，a==b 返回 0，a>b 返回正
        System.out.println(Integer.compare(3, 5));    // -1
        System.out.println(Integer.compare(5, 5));    // 0

        // max / min / sum（JDK8）
        System.out.println("max: " + Integer.max(3, 9));
        System.out.println("min: " + Integer.min(3, 9));
        System.out.println("sum: " + Integer.sum(3, 9));

        // 实战：用 Integer.compare 写降序比较器（避免 a-b 溢出）
        Integer[] arr = {3, 1, 4, 1, 5};
        Arrays.sort(arr, (a, b) -> Integer.compare(b, a));   // 降序
        System.out.println("降序: " + Arrays.toString(arr));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`-1
0
max: 9
min: 3
sum: 12
降序: [5, 4, 3, 1, 1]`}
    />
    <Callout type="tip" title="比较器用 Integer.compare 比 a-b 更安全">
      写比较器时常见 <InlineCode>(a, b) -&gt; a - b</InlineCode>，但当 a、b 是很大或很小的数时，
      <InlineCode>a - b</InlineCode> 可能<Text bold>溢出</Text>导致排序错误。
      用 <InlineCode>Integer.compare(a, b)</InlineCode> 内部做了安全处理，是更稳妥的写法。
    </Callout>

    <Heading3>5. Character 的常用判断方法</Heading3>
    <Paragraph>
      <InlineCode>Character</InlineCode> 提供一组静态方法判断字符类别，处理文本时很实用：
    </Paragraph>
    <CodeBlock
      title="CharacterDemo.java"
      code={`public class CharacterDemo {
    public static void main(String[] args) {
        System.out.println(Character.isDigit('7'));      // 是数字吗
        System.out.println(Character.isLetter('A'));     // 是字母吗
        System.out.println(Character.isWhitespace(' ')); // 是空白吗
        System.out.println(Character.isUpperCase('a'));  // 是大写吗
        System.out.println(Character.toUpperCase('a'));  // 转大写

        // 统计字符串中数字字符的个数
        String s = "a1b2c3!";
        int count = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) count++;
        }
        System.out.println("数字字符个数: " + count);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`true
true
true
false
A
数字字符个数: 3`}
    />

    <Heading3>6. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>MAX_VALUE/MIN_VALUE</InlineCode> 取边界；注意整数运算可能<Text bold>溢出</Text>。</ListItem>
        <ListItem>字符串转数值：<InlineCode>parseInt</InlineCode>（基本）/<InlineCode>valueOf</InlineCode>（对象），可带进制参数；非法抛 <InlineCode>NumberFormatException</InlineCode>。</ListItem>
        <ListItem>进制转换：<InlineCode>toBinaryString/toOctalString/toHexString</InlineCode> 或 <InlineCode>toString(n, radix)</InlineCode>。</ListItem>
        <ListItem><InlineCode>Integer.compare/max/min/sum</InlineCode>；比较器优先用 <InlineCode>compare</InlineCode> 防溢出。</ListItem>
        <ListItem><InlineCode>Character.isDigit/isLetter/toUpperCase</InlineCode> 等用于字符分类与转换。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测输出"
      code={`System.out.println(Integer.parseInt("FF", 16));
System.out.println(Integer.toBinaryString(5));
System.out.println(Integer.compare(10, 3));
System.out.println(Integer.MAX_VALUE + 1);
System.out.println(Character.isLetter('9'));

问：五行分别输出什么？`}
      answerCode={`答案：
255          —— "FF" 按 16 进制解析 = 15*16 + 15 = 255
101          —— 5 的二进制
1            —— 10 > 3，compare 返回正数（具体为 1）
-2147483648  —— MAX_VALUE 加 1 溢出，回绕到 MIN_VALUE
false        —— '9' 是数字字符，不是字母

解析：重点是第4行的「整数溢出回绕」——超过 int 上界不会报错，而是变成最小值。`}
    />

    <CodeBlock
      qa
      title="练习2：判断回文数（用包装类方法）"
      code={`// 判断一个整数是否为回文数（正读反读相同），如 12321 是，123 不是。
// 提示：用 Integer.toString 转成字符串，再用 StringBuilder.reverse 比较。

public class Palindrome {
    static boolean isPalindrome(int n) {
        // 补全
        return false;
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome(12321));
        System.out.println(isPalindrome(123));
    }
}`}
      answerCode={`public class Palindrome {
    static boolean isPalindrome(int n) {
        String s = Integer.toString(n);             // 数字转字符串
        String r = new StringBuilder(s).reverse().toString();
        return s.equals(r);
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome(12321));
        System.out.println(isPalindrome(123));
    }
}

/* 控制台输出：
true
false

解析：Integer.toString 把 int 转成字符串，再借助 StringBuilder.reverse 反转后比较。
      12321 反转还是 12321（回文），123 反转是 321（非回文）。
      这题串联了「包装类转字符串」与「字符串章节的 reverse」。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：统计字符串里各类字符数量"
      code={`// 统计字符串中：字母、数字、其它字符 各有多少个。
// 输入: "Java8 是 2014 年发布!"
// 用 Character 的判断方法实现。
// 预期输出：字母=4 数字=5 其它=...（含空格、中文、标点）

public class CharCount {
    public static void main(String[] args) {
        String s = "Java8 2014!";   // 简化输入便于核对
        // 补全：统计 letter / digit / other
    }
}`}
      answerCode={`public class CharCount {
    public static void main(String[] args) {
        String s = "Java8 2014!";
        int letter = 0, digit = 0, other = 0;

        for (char c : s.toCharArray()) {
            if (Character.isLetter(c)) {
                letter++;
            } else if (Character.isDigit(c)) {
                digit++;
            } else {
                other++;
            }
        }
        System.out.println("字母=" + letter + " 数字=" + digit + " 其它=" + other);
    }
}

/* 控制台输出：
字母=4 数字=5 其它=2

解析："Java8 2014!" 中：字母 J/a/v/a=4；数字 8/2/0/1/4=5；
      其它是 1 个空格 + 1 个感叹号 = 2。
      Character.isLetter / isDigit 让字符分类一目了然，比手动比较 ASCII 范围清晰得多。
*/`}
    />
  </article>
);

export default index;
