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
    <Title>字符串的常用方法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        String 类提供了丰富的内置方法，覆盖了日常字符串处理的绝大多数需求：
        获取长度、按下标取字符、查找子串位置、截取、替换、大小写转换、分割、转数组等。
        本节按功能分组，先给出方法签名表，再配代码示例与输出，逐一讲透用法和注意点。
      </Paragraph>
    </Callout>

    <Heading3>1. 常用方法速查表</Heading3>
    <Table
      head={['方法', '返回类型', '功能简述']}
      rows={[
        ['length()', 'int', '返回字符串的字符个数（长度）'],
        ['charAt(int index)', 'char', '返回指定下标处的字符，下标从 0 开始'],
        ['indexOf(String str)', 'int', '返回子串第一次出现的下标；找不到返回 -1'],
        ['indexOf(String str, int fromIndex)', 'int', '从 fromIndex 开始查找子串，找不到返回 -1'],
        ['substring(int begin)', 'String', '从 begin 截取到末尾（含 begin）'],
        ['substring(int begin, int end)', 'String', '截取 [begin, end)，含头不含尾'],
        ['equals(Object obj)', 'boolean', '区分大小写地比较内容'],
        ['equalsIgnoreCase(String s)', 'boolean', '忽略大小写比较内容'],
        ['contains(CharSequence s)', 'boolean', '是否包含指定子串'],
        ['startsWith(String prefix)', 'boolean', '是否以指定前缀开头'],
        ['endsWith(String suffix)', 'boolean', '是否以指定后缀结尾'],
        ['replace(CharSequence old, CharSequence new)', 'String', '将所有 old 替换为 new，返回新字符串'],
        ['trim()', 'String', '去除首尾空白字符（空格、制表符等），返回新字符串'],
        ['toUpperCase()', 'String', '转大写，返回新字符串'],
        ['toLowerCase()', 'String', '转小写，返回新字符串'],
        ['split(String regex)', 'String[]', '按正则表达式切割，返回字符串数组'],
        ['toCharArray()', 'char[]', '将字符串转为字符数组'],
        ['concat(String str)', 'String', '拼接字符串，等价于 + 运算符'],
      ]}
    />
    <Callout type="tip" title="String 方法都不修改原对象">
      所有 String 方法均返回<Text bold>新的字符串对象</Text>，原字符串内容永远不变。
      如果不接收返回值，方法调用等于白调——比如 <InlineCode>s.toUpperCase();</InlineCode>
      不赋值，s 本身丝毫没变。
    </Callout>

    <Heading3>2. length() 和 charAt()</Heading3>
    <Paragraph>
      <InlineCode>length()</InlineCode> 返回字符串中字符的总个数（注意：是方法调用，不是数组的
      <InlineCode>.length</InlineCode> 属性，有括号）。
      <InlineCode>charAt(index)</InlineCode> 按下标取单个字符，下标从 <InlineCode>0</InlineCode> 开始，
      最大有效下标为 <InlineCode>length() - 1</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="LengthCharAt.java"
      code={`public class LengthCharAt {
    public static void main(String[] args) {
        String s = "Hello";

        System.out.println(s.length());    // 5：共 5 个字符
        System.out.println(s.charAt(0));   // H：下标 0 的字符
        System.out.println(s.charAt(4));   // o：下标 4（最后一个）

        // 遍历字符串的每个字符
        for (int i = 0; i < s.length(); i++) {
            System.out.print(s.charAt(i) + " ");
        }
        System.out.println();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`5
H
o
H e l l o`} />
    <Callout type="danger" title="下标越界 StringIndexOutOfBoundsException">
      访问 <InlineCode>charAt(index)</InlineCode> 时，如果 index &lt; 0 或 index &gt;= length()，
      会抛出 <InlineCode>StringIndexOutOfBoundsException</InlineCode>。
      确保 index 在 <InlineCode>[0, length()-1]</InlineCode> 范围内。
    </Callout>

    <Heading3>3. indexOf()</Heading3>
    <Paragraph>
      <InlineCode>indexOf(str)</InlineCode> 返回子串第一次出现位置的起始下标；
      若不存在，返回 <Text bold>-1</Text>（非常重要，常用来判断是否包含子串）。
      也可以指定起始搜索位置 <InlineCode>indexOf(str, fromIndex)</InlineCode>，
      从 <InlineCode>fromIndex</InlineCode> 处开始向后查找。
    </Paragraph>
    <CodeBlock
      title="IndexOfDemo.java"
      code={`public class IndexOfDemo {
    public static void main(String[] args) {
        String s = "banana";

        System.out.println(s.indexOf("a"));      // 1：第一个 'a' 在下标 1
        System.out.println(s.indexOf("an"));     // 1：子串 "an" 第一次出现在下标 1
        System.out.println(s.indexOf("a", 2));   // 3：从下标 2 开始找，下一个 'a' 在 3
        System.out.println(s.indexOf("a", 4));   // 5：继续向后找，下标 5 还有一个 'a'
        System.out.println(s.indexOf("xyz"));    // -1：不存在

        // 常见用法：判断是否包含
        if (s.indexOf("nan") != -1) {
            System.out.println("包含 nan");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`1
1
3
5
-1
包含 nan`} />

    <Heading3>4. substring()</Heading3>
    <Paragraph>
      <InlineCode>substring(begin)</InlineCode> 从下标 <InlineCode>begin</InlineCode> 截取到末尾；
      <InlineCode>substring(begin, end)</InlineCode> 截取 <InlineCode>[begin, end)</InlineCode>，
      即<Text bold>含头不含尾</Text>——包含 begin 处字符，不包含 end 处字符。
    </Paragraph>
    <CodeBlock
      title="SubstringDemo.java"
      code={`public class SubstringDemo {
    public static void main(String[] args) {
        String s = "HelloWorld";
        //下标：    0123456789

        System.out.println(s.substring(5));      // World：从下标 5 到末尾
        System.out.println(s.substring(0, 5));   // Hello：[0, 5) 即下标 0~4
        System.out.println(s.substring(2, 7));   // lloWo：[2, 7) 即下标 2~6
        System.out.println(s.substring(0));      // HelloWorld：从 0 到末尾，等于完整字符串

        // 提取文件扩展名
        String filename = "report.pdf";
        int dotIndex = filename.indexOf(".");
        String ext = filename.substring(dotIndex + 1);  // "pdf"
        System.out.println("扩展名：" + ext);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`World
Hello
lloWo
HelloWorld
扩展名：pdf`} />
    <Callout type="warning" title="含头不含尾，end 不能超过 length()">
      <InlineCode>substring(begin, end)</InlineCode> 中 end 最大只能等于 <InlineCode>length()</InlineCode>；
      若 end &gt; length() 会抛出 <InlineCode>StringIndexOutOfBoundsException</InlineCode>。
      截取的字符数 = end - begin。
    </Callout>

    <Heading3>5. contains()、startsWith()、endsWith()</Heading3>
    <Paragraph>
      这三个方法都返回 <InlineCode>boolean</InlineCode>，用于判断字符串与特定子串的包含关系，
      语义直观，代码可读性高。
    </Paragraph>
    <CodeBlock
      title="ContainsStartEnd.java"
      code={`public class ContainsStartEnd {
    public static void main(String[] args) {
        String url = "https://www.example.com/index.html";

        System.out.println(url.contains("example"));       // true
        System.out.println(url.contains("google"));        // false
        System.out.println(url.startsWith("https"));       // true
        System.out.println(url.startsWith("http://"));     // false
        System.out.println(url.endsWith(".html"));         // true
        System.out.println(url.endsWith(".pdf"));          // false

        // 实际应用：判断文件类型
        String file = "photo.jpg";
        if (file.endsWith(".jpg") || file.endsWith(".png")) {
            System.out.println(file + " 是图片文件");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`true
false
true
false
true
false
photo.jpg 是图片文件`} />

    <Heading3>6. replace()、trim()</Heading3>
    <Heading4>replace —— 替换所有匹配子串</Heading4>
    <Paragraph>
      <InlineCode>replace(oldStr, newStr)</InlineCode> 将字符串中<Text bold>所有</Text>的
      <InlineCode>oldStr</InlineCode> 替换为 <InlineCode>newStr</InlineCode>，返回新字符串。
      原字符串不变。
    </Paragraph>
    <CodeBlock
      title="ReplaceDemo.java"
      code={`public class ReplaceDemo {
    public static void main(String[] args) {
        String s = "I like Java. Java is great!";

        String replaced = s.replace("Java", "Python");
        System.out.println(replaced);   // 两处 Java 都被替换

        // 原字符串不变
        System.out.println(s);

        // 删除某个字符：替换为空字符串
        String noSpace = "h e l l o".replace(" ", "");
        System.out.println(noSpace);    // hello
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`I like Python. Python is great!
I like Java. Java is great!
hello`} />

    <Heading4>trim —— 去除首尾空白</Heading4>
    <Paragraph>
      <InlineCode>trim()</InlineCode> 去除字符串首尾的空格、制表符等空白字符，
      中间的空白<Text bold>不会</Text>被去除。常用于处理用户输入。
    </Paragraph>
    <CodeBlock
      title="TrimDemo.java"
      code={`public class TrimDemo {
    public static void main(String[] args) {
        String input = "   hello world   ";
        String trimmed = input.trim();

        System.out.println("[" + input + "]");    // 显示原样，首尾有空格
        System.out.println("[" + trimmed + "]");  // 首尾空格已去除，中间保留
        System.out.println(trimmed.length());     // 11
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`[   hello world   ]
[hello world]
11`} />

    <Heading3>7. toUpperCase() 和 toLowerCase()</Heading3>
    <Paragraph>
      两个方法都返回<Text bold>新字符串</Text>，不修改原字符串。
      非字母字符（数字、符号、汉字）保持原样不变。
    </Paragraph>
    <CodeBlock
      title="CaseConvert.java"
      code={`public class CaseConvert {
    public static void main(String[] args) {
        String s = "Hello, Java 2024!";

        System.out.println(s.toUpperCase());  // 全部大写
        System.out.println(s.toLowerCase());  // 全部小写
        System.out.println(s);               // 原字符串不变

        // 常见用途：统一大小写再比较
        String input = "HELLO";
        System.out.println(input.toLowerCase().equals("hello")); // true
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`HELLO, JAVA 2024!
hello, java 2024!
Hello, Java 2024!
true`} />

    <Heading3>8. split() —— 分割字符串</Heading3>
    <Paragraph>
      <InlineCode>split(regex)</InlineCode> 按正则表达式切割字符串，返回 <InlineCode>String[]</InlineCode> 数组。
      日常最常用的分隔符是普通字符（逗号、空格等），但如果分隔符是正则特殊字符（如
      <InlineCode>.</InlineCode>、<InlineCode>|</InlineCode>）则需要转义。
    </Paragraph>
    <CodeBlock
      title="SplitDemo.java"
      code={`public class SplitDemo {
    public static void main(String[] args) {
        // 按逗号分割
        String csv = "apple,banana,cherry";
        String[] fruits = csv.split(",");
        System.out.println("数组长度：" + fruits.length);  // 3
        for (String fruit : fruits) {
            System.out.println(fruit);
        }

        System.out.println("----------");

        // 按空格分割
        String sentence = "Hello Java World";
        String[] words = sentence.split(" ");
        for (String word : words) {
            System.out.println(word);
        }

        System.out.println("----------");

        // 点是正则特殊字符，必须转义为 "\\."
        String filename = "report.2024.pdf";
        String[] parts = filename.split("\\.");
        for (String part : parts) {
            System.out.println(part);
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`数组长度：3
apple
banana
cherry
----------
Hello
Java
World
----------
report
2024
pdf`} />
    <Callout type="warning" title="点号 . 在 split 中需要转义">
      <InlineCode>split(".")</InlineCode> 中的点号是正则中的"匹配任意字符"，
      会导致结果错误（分割出空数组）。按字面点号分割必须写
      <InlineCode>split("\\.")</InlineCode>。
      同理，竖线 <InlineCode>|</InlineCode> 需写 <InlineCode>split("\\|")</InlineCode>。
    </Callout>

    <Heading3>9. toCharArray() —— 转为字符数组</Heading3>
    <Paragraph>
      <InlineCode>toCharArray()</InlineCode> 将字符串拆分成 <InlineCode>char[]</InlineCode> 数组，
      每个元素对应字符串中的一个字符。在需要逐字符操作（如统计、过滤、反转）时非常常用。
    </Paragraph>
    <CodeBlock
      title="ToCharArrayDemo.java"
      code={`public class ToCharArrayDemo {
    public static void main(String[] args) {
        String s = "Java";
        char[] chars = s.toCharArray();

        System.out.println("数组长度：" + chars.length);  // 4
        for (char c : chars) {
            System.out.print(c + " ");
        }
        System.out.println();

        // 修改字符数组不影响原字符串（String 不可变）
        chars[0] = 'j';
        System.out.println("原字符串：" + s);         // Java（未变）
        System.out.println("修改后数组：" + new String(chars)); // java
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`数组长度：4
J a v a
原字符串：Java
修改后数组：java`} />

    <Heading3>10. concat() —— 拼接字符串</Heading3>
    <Paragraph>
      <InlineCode>concat(str)</InlineCode> 将参数拼接到当前字符串末尾，返回新字符串，
      等价于 <InlineCode>+</InlineCode> 运算符。日常更常见的是直接用 <InlineCode>+</InlineCode>，
      因为它更简洁且支持非 String 类型的自动转换。
    </Paragraph>
    <CodeBlock
      title="ConcatDemo.java"
      code={`public class ConcatDemo {
    public static void main(String[] args) {
        String s1 = "Hello";
        String s2 = " World";

        // concat 方式
        String result1 = s1.concat(s2);
        System.out.println(result1);  // Hello World

        // + 运算符方式（更常用）
        String result2 = s1 + s2;
        System.out.println(result2);  // Hello World

        // + 还能自动将其他类型转为字符串
        int year = 2024;
        System.out.println("Year: " + year);  // Year: 2024
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`Hello World
Hello World
Year: 2024`} />

    <Heading3>11. 综合示例：方法链式调用</Heading3>
    <Paragraph>
      由于每个 String 方法都返回新的 String 对象，可以将多个方法连续调用（链式调用），
      代码更简洁。但要注意执行顺序是从左到右。
    </Paragraph>
    <CodeBlock
      title="MethodChain.java"
      code={`public class MethodChain {
    public static void main(String[] args) {
        String raw = "  Hello, Java World!  ";

        // 链式：去首尾空格 -> 转小写 -> 把空格替换为下划线
        String result = raw.trim().toLowerCase().replace(" ", "_");
        System.out.println(result);  // hello,_java_world!

        // 提取域名示例
        String url = "https://www.example.com/path";
        String domain = url.substring(url.indexOf("//") + 2, url.indexOf("/", 8));
        System.out.println("域名：" + domain);  // www.example.com

        // 判断邮箱格式（简化版）
        String email = "user@example.com";
        boolean valid = email.contains("@") && email.endsWith(".com");
        System.out.println("邮箱有效：" + valid);  // true
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`hello,_java_world!
域名：www.example.com
邮箱有效：true`} />

    <Heading3>12. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：字符串信息提取"
      code={`// 给定字符串 s = "Java Programming Language"
// 要求：
// 1. 打印字符串长度
// 2. 打印第一个字符和最后一个字符
// 3. 打印 "Programming" 的起始下标
// 4. 截取并打印 "Java"（前4个字符）
// 5. 截取并打印 "Language"（最后8个字符）

public class Exercise01 {
    public static void main(String[] args) {
        String s = "Java Programming Language";
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise01 {
    public static void main(String[] args) {
        String s = "Java Programming Language";

        System.out.println(s.length());                          // 25
        System.out.println(s.charAt(0));                         // J
        System.out.println(s.charAt(s.length() - 1));            // e
        System.out.println(s.indexOf("Programming"));            // 5
        System.out.println(s.substring(0, 4));                   // Java
        System.out.println(s.substring(s.length() - 8));         // Language
    }
}

/* 控制台输出：
25
J
e
5
Java
Language

解析：
  length()-1 是最后一个字符的下标。
  indexOf("Programming") 返回 P 所在的下标 5。
  substring(0,4) 截取 [0,4)，即下标 0~3，共 4 个字符 "Java"。
  substring(length()-8) 从倒数第 8 个字符截取到末尾，得 "Language"。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：字符串处理综合"
      code={`// 给定用户输入 input = "  hello@WORLD.com  "
// 要求依次：
// 1. 去除首尾空格
// 2. 转为小写
// 3. 判断是否包含 "@" 并打印
// 4. 按 "@" 分割，打印 "@" 前后两部分

public class Exercise02 {
    public static void main(String[] args) {
        String input = "  hello@WORLD.com  ";
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {
    public static void main(String[] args) {
        String input = "  hello@WORLD.com  ";

        String clean = input.trim().toLowerCase();  // 去空格并转小写
        System.out.println(clean);                  // hello@world.com

        System.out.println(clean.contains("@"));    // true

        String[] parts = clean.split("@");
        System.out.println("用户名：" + parts[0]);  // 用户名：hello
        System.out.println("域名：" + parts[1]);    // 域名：world.com
    }
}

/* 控制台输出：
hello@world.com
true
用户名：hello
域名：world.com
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：统计子串出现次数"
      code={`// 要求：统计字符串 "abcabcabcabc" 中子串 "abc" 出现的次数。
// 思路：每次用 indexOf(str, fromIndex) 找到后，将 fromIndex 移到下一个位置继续找。

public class Exercise03 {
    public static void main(String[] args) {
        String s = "abcabcabcabc";
        String sub = "abc";
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {
    public static void main(String[] args) {
        String s = "abcabcabcabc";
        String sub = "abc";

        int count = 0;
        int fromIndex = 0;
        while (true) {
            int idx = s.indexOf(sub, fromIndex);
            if (idx == -1) break;       // 找不到，退出循环
            count++;
            fromIndex = idx + sub.length(); // 移动起始位置，避免重复统计
        }
        System.out.println("\"abc\" 出现了 " + count + " 次");
    }
}

/* 控制台输出：
"abc" 出现了 4 次

解析：
  第1次：indexOf("abc", 0)  找到下标 0，count=1，fromIndex=3
  第2次：indexOf("abc", 3)  找到下标 3，count=2，fromIndex=6
  第3次：indexOf("abc", 6)  找到下标 6，count=3，fromIndex=9
  第4次：indexOf("abc", 9)  找到下标 9，count=4，fromIndex=12
  第5次：indexOf("abc", 12) 返回 -1，退出循环
*/`}
    />
  </article>
);

export default index;
