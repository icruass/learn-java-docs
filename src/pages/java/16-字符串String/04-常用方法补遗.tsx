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
    <Title>字符串常用方法补遗</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节讲了 <InlineCode>length</InlineCode>、<InlineCode>substring</InlineCode> 等高频方法。
        本节补充实际开发中同样常用、却容易被忽略的一批方法：判空
        <InlineCode>isEmpty</InlineCode>/<InlineCode>isBlank</InlineCode>、去空白
        <InlineCode>strip</InlineCode> 系列、重复 <InlineCode>repeat</InlineCode>、拼接
        <InlineCode>String.join</InlineCode>、字典序比较 <InlineCode>compareTo</InlineCode>、
        以及最容易踩坑的 <Text bold>replace 与 replaceAll 的区别</Text>。
        其中带 (JDK11) 标记的是较新版本才有的方法。
      </Paragraph>
    </Callout>

    <Heading3>1. 判空：isEmpty 与 isBlank</Heading3>
    <Table
      head={['方法', '判断标准', '版本']}
      rows={[
        ['isEmpty()', '长度是否为 0，即 length()==0', 'JDK6'],
        ['isBlank()', '是否为空 或 只含空白字符（空格/制表/换行）', 'JDK11'],
      ]}
    />
    <CodeBlock
      title="IsEmptyBlank.java"
      code={`public class IsEmptyBlank {
    public static void main(String[] args) {
        String empty = "";
        String spaces = "   ";
        String text = " hi ";

        System.out.println("empty.isEmpty():  " + empty.isEmpty());
        System.out.println("spaces.isEmpty(): " + spaces.isEmpty()); // 有空格，非空
        System.out.println("spaces.isBlank(): " + spaces.isBlank()); // 全是空白
        System.out.println("text.isBlank():   " + text.isBlank());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`empty.isEmpty():  true
spaces.isEmpty(): false
spaces.isBlank(): true
text.isBlank():   false`}
    />
    <Callout type="warning" title="判空前先防 null">
      <InlineCode>isEmpty</InlineCode>/<InlineCode>isBlank</InlineCode> 是实例方法，
      若字符串本身是 <InlineCode>null</InlineCode>，调用会抛 <InlineCode>NullPointerException</InlineCode>。
      工程中常用 <InlineCode>{`str == null || str.isEmpty()`}</InlineCode> 这种短路写法，
      或借助工具类（如 <InlineCode>StringUtils.isBlank</InlineCode>）统一处理。
    </Callout>

    <Heading3>2. 去空白：trim 与 strip(JDK11)</Heading3>
    <Paragraph>
      二者都去除字符串<Text bold>首尾</Text>空白（不影响中间），区别在「空白」的判定范围：
    </Paragraph>
    <Table
      head={['方法', '去除范围', '说明']}
      rows={[
        ['trim()', '只去 ASCII ≤ 空格(0x20) 的字符', '老方法，对全角空格等 Unicode 空白无效'],
        ['strip()', '去所有 Unicode 空白', 'JDK11，更现代、更全面'],
        ['stripLeading()', '只去开头空白', 'JDK11'],
        ['stripTrailing()', '只去结尾空白', 'JDK11'],
      ]}
    />
    <CodeBlock
      title="TrimStrip.java"
      code={`public class TrimStrip {
    public static void main(String[] args) {
        String s = "  Hello World  ";
        System.out.println("[" + s.trim() + "]");
        System.out.println("[" + s.strip() + "]");
        System.out.println("[" + s.stripLeading() + "]");
        System.out.println("[" + s.stripTrailing() + "]");

        // 全角空格(\\u3000)：trim 去不掉，strip 可以
        String full = "\\u3000中文\\u3000";
        System.out.println("trim 后长度:  " + full.trim().length());
        System.out.println("strip 后长度: " + full.strip().length());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`[Hello World]
[Hello World]
[Hello World  ]
[  Hello World]
trim 后长度:  4
strip 后长度: 2`}
    />

    <Heading3>3. 重复与拼接：repeat、String.join</Heading3>
    <CodeBlock
      title="RepeatJoin.java"
      code={`public class RepeatJoin {
    public static void main(String[] args) {
        // repeat(n)：把字符串重复 n 次（JDK11）
        System.out.println("=".repeat(20));
        System.out.println("Ha".repeat(3));

        // String.join(分隔符, 元素...)：用分隔符把多段拼起来
        String csv = String.join(",", "张三", "李四", "王五");
        System.out.println(csv);

        // 也可传一个集合
        java.util.List<String> list = java.util.List.of("a", "b", "c");
        System.out.println(String.join(" -> ", list));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`====================
HaHaHa
张三,李四,王五
a -> b -> c`}
    />
    <Callout type="tip" title="join 是拼接的优雅之选">
      想把多个字符串用逗号、斜杠等连起来时，<InlineCode>String.join</InlineCode> 比手动循环加分隔符
      （还要处理「最后一个不加逗号」）干净得多，不会出现尾部多余分隔符。
    </Callout>

    <Heading3>4. 字典序比较：compareTo</Heading3>
    <Paragraph>
      <InlineCode>equals</InlineCode> 只回答「相不相等」，而 <InlineCode>compareTo</InlineCode>
      回答「谁大谁小」，用于<Text bold>排序</Text>。它按字符的 Unicode 编码逐位比较，返回 int：
    </Paragraph>
    <UnorderedList>
      <ListItem><Text bold>负数</Text>：调用者小于参数（排在前）</ListItem>
      <ListItem><Text bold>0</Text>：内容完全相等</ListItem>
      <ListItem><Text bold>正数</Text>：调用者大于参数（排在后）</ListItem>
    </UnorderedList>
    <CodeBlock
      title="CompareTo.java"
      code={`public class CompareTo {
    public static void main(String[] args) {
        System.out.println("apple".compareTo("banana")); // a(97)-b(98) = -1
        System.out.println("banana".compareTo("apple")); // 1
        System.out.println("abc".compareTo("abc"));       // 0
        // 长度不同、前缀相同：返回长度差
        System.out.println("abc".compareTo("ab"));        // 1（多一个字符）
        // 忽略大小写比较
        System.out.println("HELLO".compareToIgnoreCase("hello")); // 0
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`-1
1
0
1
0`}
    />
    <Callout type="tip" title="compareTo 是排序的基石">
      <InlineCode>Collections.sort</InlineCode>、<InlineCode>Arrays.sort</InlineCode>、
      <InlineCode>TreeSet</InlineCode>/<InlineCode>TreeMap</InlineCode> 对字符串排序，
      底层调用的正是 <InlineCode>String.compareTo</InlineCode>（自然顺序 = 字典序）。
    </Callout>

    <Heading3>5. 重点辨析：replace 与 replaceAll 的天坑</Heading3>
    <Paragraph>
      这是新手最容易混淆、也最容易出 bug 的地方。三个替换方法长得像，<Text bold>参数语义却不同</Text>：
    </Paragraph>
    <Table
      head={['方法', '第一个参数是', '替换范围']}
      rows={[
        ['replace(old, new)', '普通字符 / 字符串（按字面量）', '替换所有匹配'],
        ['replaceAll(regex, new)', '正则表达式', '替换所有匹配'],
        ['replaceFirst(regex, new)', '正则表达式', '只替换第一个匹配'],
      ]}
    />
    <CodeBlock
      title="ReplaceTrap.java"
      code={`public class ReplaceTrap {
    public static void main(String[] args) {
        String s = "a.b.c.d";

        // replace：把所有「字面量的点」换成下划线 —— 符合直觉
        System.out.println(s.replace(".", "_"));

        // replaceAll：第一个参数是正则！"." 在正则里表示「任意字符」
        System.out.println(s.replaceAll(".", "_"));   // 全被换成 _ ！

        // 用 replaceAll 想匹配真正的点，必须转义
        System.out.println(s.replaceAll("\\\\.", "_"));

        // replaceFirst：只换第一个
        System.out.println(s.replaceFirst("\\\\.", "_"));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`a_b_c_d
_______
a_b_c_d
a_b.c.d`}
    />
    <Callout type="danger" title="记住这条铁律">
      <Text bold>替换普通字符，永远优先用 replace</Text>（参数是字面量，不会被当正则解释）。
      只有当你<Text bold>确实要用正则</Text>时才用 <InlineCode>replaceAll</InlineCode>，
      且像 <InlineCode>.</InlineCode>、<InlineCode>*</InlineCode>、<InlineCode>|</InlineCode>、
      <InlineCode>\\</InlineCode> 这些正则特殊字符必须转义。上例中 <InlineCode>replaceAll(".", "_")</InlineCode>
      把每个字符都换成了下划线，正是把 <InlineCode>.</InlineCode> 当成了「任意字符」。
    </Callout>

    <Heading3>6. 任意类型转字符串：String.valueOf</Heading3>
    <Paragraph>
      <InlineCode>String.valueOf(x)</InlineCode> 是把<Text bold>任意类型</Text>安全转为字符串的标准方式，
      尤其能正确处理 <InlineCode>null</InlineCode>：
    </Paragraph>
    <CodeBlock
      title="ValueOf.java"
      code={`public class ValueOf {
    public static void main(String[] args) {
        System.out.println(String.valueOf(100));      // int -> "100"
        System.out.println(String.valueOf(3.14));     // double -> "3.14"
        System.out.println(String.valueOf(true));     // boolean -> "true"
        System.out.println(String.valueOf('A'));       // char -> "A"

        // 关键：对 null 安全，返回字符串 "null" 而不抛异常
        Object obj = null;
        System.out.println(String.valueOf(obj));        // "null"
        // 对比：obj.toString() 会抛 NullPointerException
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`100
3.14
true
A
null`}
    />

    <Heading3>7. 本节方法汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>isEmpty</InlineCode> 判长度为 0；<InlineCode>isBlank</InlineCode>(JDK11) 判全空白。</ListItem>
        <ListItem><InlineCode>strip</InlineCode> 系列(JDK11) 比 <InlineCode>trim</InlineCode> 更全，能去 Unicode 空白。</ListItem>
        <ListItem><InlineCode>repeat</InlineCode>(JDK11) 重复字符串；<InlineCode>String.join</InlineCode> 用分隔符优雅拼接。</ListItem>
        <ListItem><InlineCode>compareTo</InlineCode> 返回正负零，是字典序排序的基础。</ListItem>
        <ListItem><Text bold>替换普通字符用 replace，replaceAll 第一个参数是正则</Text>——这是高频 bug 点。</ListItem>
        <ListItem><InlineCode>String.valueOf</InlineCode> 任意类型转串，且对 null 安全。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测输出"
      code={`String s = "1-2-3";
System.out.println(s.replace("-", "+"));
System.out.println(s.replaceAll("-", "+"));
System.out.println("Go".repeat(2) + "!");
System.out.println(String.join("/", "2026", "06", "12"));
System.out.println("   ".isBlank());

问：以上 5 行分别输出什么？`}
      answerCode={`答案：
1+2+3      —— replace 按字面量替换 "-"
1+2+3      —— "-" 在正则里没有特殊含义，结果与 replace 相同
GoGo!      —— repeat(2) 重复两次再拼 "!"
2026/06/12 —— join 用 "/" 连接，常用于拼日期/路径
true       —— 全是空格，isBlank 为 true

解析：注意这里 replace 和 replaceAll 结果相同，是因为 "-" 恰好不是正则特殊字符。
      若把 "-" 换成 "."，replaceAll 就会把所有字符都替换掉（见正文铁律）。`}
    />

    <CodeBlock
      qa
      title="练习2：把句子里的单词首尾对齐输出"
      code={`// 给定单词数组，要求：
// 1) 去掉每个单词的首尾空白
// 2) 用 " | " 连接
// 3) 整行用一条 30 个 = 组成的分隔线包裹（上下各一行）
// 输入: {" apple ", "  banana", "cherry  "}
// 预期输出：
// ==============================
// apple | banana | cherry
// ==============================

public class WordLine {
    public static void main(String[] args) {
        String[] words = {" apple ", "  banana", "cherry  "};
        // 补全
    }
}`}
      answerCode={`public class WordLine {
    public static void main(String[] args) {
        String[] words = {" apple ", "  banana", "cherry  "};

        // 1) 去空白
        for (int i = 0; i < words.length; i++) {
            words[i] = words[i].strip();   // 或 trim()
        }

        // 2) 用 " | " 连接
        String line = String.join(" | ", words);

        // 3) 分隔线
        String sep = "=".repeat(30);
        System.out.println(sep);
        System.out.println(line);
        System.out.println(sep);
    }
}

/* 控制台输出：
==============================
apple | banana | cherry
==============================

解析：strip 去首尾空白，String.join 一步完成带分隔符拼接，repeat 生成等号分隔线。
      三个本节方法组合，比手写循环简洁得多。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：字符串字典序排序"
      code={`// 用 compareTo 的思想，对字符串数组按字典序升序排序（手写冒泡，不用 Arrays.sort）。
// 输入: {"banana", "apple", "cherry"}
// 预期输出: [apple, banana, cherry]

import java.util.Arrays;

public class StrSort {
    public static void main(String[] args) {
        String[] arr = {"banana", "apple", "cherry"};
        // 补全：手写冒泡，用 compareTo 比较
        System.out.println(Arrays.toString(arr));
    }
}`}
      answerCode={`import java.util.Arrays;

public class StrSort {
    public static void main(String[] args) {
        String[] arr = {"banana", "apple", "cherry"};

        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {
                // compareTo > 0 说明前者更大，交换让它后移
                if (arr[j].compareTo(arr[j + 1]) > 0) {
                    String t = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = t;
                }
            }
        }
        System.out.println(Arrays.toString(arr));
    }
}

/* 控制台输出：
[apple, banana, cherry]

解析：compareTo 返回正数表示 arr[j] 字典序更大，应排到后面，于是交换。
      这正是 Arrays.sort/Collections.sort 对字符串排序的内部逻辑（自然顺序=字典序）。
*/`}
    />
  </article>
);

export default index;
