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
    <Title>基本类型与字符串互转</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        从控制台读到的、从文件/网络拿到的数据往往都是<Text bold>字符串</Text>，
        但参与运算又需要 <InlineCode>int</InlineCode>、<InlineCode>double</InlineCode> 等基本类型；
        反过来，数字要拼进提示信息或写入文件时又要转回字符串。本节系统讲清
        <Text bold>「字符串 ↔ 基本类型」</Text>双向转换的标准做法、易混的
        <InlineCode>parseXxx</InlineCode> 与 <InlineCode>valueOf</InlineCode> 区别，
        以及转换失败时的 <InlineCode>NumberFormatException</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading3>1. 字符串 → 基本类型：parseXxx</Heading3>
    <Paragraph>
      每个基本类型都有对应的<Text bold>包装类</Text>，包装类提供静态方法 <InlineCode>parseXxx</InlineCode>
      把字符串解析成对应的基本类型：
    </Paragraph>
    <Table
      head={['目标类型', '转换方法', '示例']}
      rows={[
        ['int', 'Integer.parseInt(s)', 'Integer.parseInt("123") → 123'],
        ['long', 'Long.parseLong(s)', 'Long.parseLong("100") → 100L'],
        ['double', 'Double.parseDouble(s)', 'Double.parseDouble("3.14") → 3.14'],
        ['float', 'Float.parseFloat(s)', 'Float.parseFloat("1.5") → 1.5f'],
        ['boolean', 'Boolean.parseBoolean(s)', 'Boolean.parseBoolean("true") → true'],
        ['byte / short', 'Byte.parseByte / Short.parseShort', '同理'],
      ]}
    />
    <CodeBlock
      title="ParseDemo.java"
      code={`public class ParseDemo {
    public static void main(String[] args) {
        String numStr = "100";
        String dblStr = "3.14";

        int n = Integer.parseInt(numStr);
        double d = Double.parseDouble(dblStr);

        // 转成基本类型后就能参与运算
        System.out.println("n + 50 = " + (n + 50));
        System.out.println("d * 2  = " + (d * 2));

        // 注意：字符串拼接 vs 数值相加
        System.out.println("\\"100\\" + 50 = " + (numStr + 50)); // 字符串拼接
        System.out.println("100 + 50  = " + (n + 50));            // 数值相加
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`n + 50 = 150
d * 2  = 6.28
"100" + 50 = 10050
100 + 50  = 150`}
    />
    <Callout type="warning" title="字符串 + 数字 是拼接，不是相加">
      <InlineCode>"100" + 50</InlineCode> 得到的是 <InlineCode>"10050"</InlineCode>（拼接），
      只有先 <InlineCode>parseInt</InlineCode> 转成 <InlineCode>int</InlineCode> 才会做数值加法。
      这是新手做控制台输入计算时最常见的 bug 来源。
    </Callout>

    <Heading3>2. 转换失败：NumberFormatException</Heading3>
    <Paragraph>
      如果字符串不是合法的数字格式，<InlineCode>parseXxx</InlineCode> 会抛出运行时异常
      <InlineCode>NumberFormatException</InlineCode>：
    </Paragraph>
    <CodeBlock
      title="ParseError.java"
      code={`public class ParseError {
    public static void main(String[] args) {
        System.out.println(Integer.parseInt("123"));   // OK

        try {
            Integer.parseInt("12a");   // 含非数字字符
        } catch (NumberFormatException e) {
            System.out.println("解析失败: " + e.getMessage());
        }

        try {
            Integer.parseInt("3.14");  // 小数不是合法 int
        } catch (NumberFormatException e) {
            System.out.println("解析失败: " + e.getMessage());
        }

        try {
            Integer.parseInt("");      // 空串
        } catch (NumberFormatException e) {
            System.out.println("解析失败: " + e.getMessage());
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`123
解析失败: For input string: "12a"
解析失败: For input string: "3.14"
解析失败: For input string: ""`}
    />
    <Callout type="danger" title="解析外部输入务必防异常">
      对用户输入、文件、网络等<Text bold>不可信来源</Text>的字符串做 <InlineCode>parseInt</InlineCode>，
      要么用 <InlineCode>try-catch</InlineCode> 兜住，要么先校验格式（如正则 <InlineCode>\\d+</InlineCode>），
      否则一个非法输入就会让程序崩溃。注意 <InlineCode>"3.14"</InlineCode> 对 <InlineCode>parseInt</InlineCode>
      也是非法的——它只接受整数。
    </Callout>

    <Heading3>3. parseInt 与 valueOf 的区别</Heading3>
    <Paragraph>
      包装类还有一个 <InlineCode>valueOf</InlineCode> 方法，和 <InlineCode>parseInt</InlineCode> 很像，
      区别在<Text bold>返回类型</Text>：
    </Paragraph>
    <Table
      head={['方法', '返回类型', '说明']}
      rows={[
        ['Integer.parseInt(s)', 'int（基本类型）', '直接得到基本类型，用于运算'],
        ['Integer.valueOf(s)', 'Integer（包装类对象）', '得到对象，内部仍调用 parseInt，且有缓存'],
      ]}
    />
    <CodeBlock
      title="ParseVsValueOf.java"
      code={`public class ParseVsValueOf {
    public static void main(String[] args) {
        int prim = Integer.parseInt("42");      // 基本类型 int
        Integer obj = Integer.valueOf("42");    // 包装对象 Integer

        System.out.println(prim);
        System.out.println(obj);

        // valueOf 对 -128~127 有缓存，同值返回同一对象
        Integer a = Integer.valueOf("100");
        Integer b = Integer.valueOf("100");
        System.out.println("a == b (100, 在缓存范围): " + (a == b));

        Integer c = Integer.valueOf("200");
        Integer d = Integer.valueOf("200");
        System.out.println("c == d (200, 超出缓存):  " + (c == d));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`42
42
a == b (100, 在缓存范围): true
c == d (200, 超出缓存):  false`}
    />
    <Callout type="tip" title="选用建议">
      要参与数值运算就用 <InlineCode>parseInt</InlineCode>（直接拿基本类型）；需要包装对象（如放进集合
      <InlineCode>List&lt;Integer&gt;</InlineCode>）则用 <InlineCode>valueOf</InlineCode>。
      上面 100 与 200 的 <InlineCode>==</InlineCode> 差异，源于 <InlineCode>Integer</InlineCode> 的
      <InlineCode>-128~127</InlineCode> 缓存池——这也说明<Text bold>比较包装对象的值应该用 equals 而非 ==</Text>。
    </Callout>

    <Heading3>4. 基本类型 → 字符串：三种方式</Heading3>
    <Table
      head={['方式', '写法', '特点']}
      rows={[
        ['空串拼接', 'x + ""', '最简短，但会创建额外对象，不推荐用于大量场景'],
        ['String.valueOf', 'String.valueOf(x)', '推荐，语义清晰，且对 null 安全'],
        ['包装类 toString', 'Integer.toString(x)', '明确指定类型，可带进制参数'],
      ]}
    />
    <CodeBlock
      title="ToStringDemo.java"
      code={`public class ToStringDemo {
    public static void main(String[] args) {
        int n = 255;
        double d = 3.14;

        // 方式1：拼空串（简单但不优雅）
        String s1 = n + "";
        // 方式2：String.valueOf（推荐）
        String s2 = String.valueOf(d);
        // 方式3：包装类 toString，还能指定进制
        String s3 = Integer.toString(n);
        String hex = Integer.toString(n, 16);   // 转 16 进制字符串
        String bin = Integer.toString(n, 2);    // 转 2 进制字符串

        System.out.println(s1 + " | " + s2 + " | " + s3);
        System.out.println("255 的十六进制: " + hex);
        System.out.println("255 的二进制:   " + bin);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`255 | 3.14 | 255
255 的十六进制: ff
255 的二进制:   11111111`}
    />

    <Heading3>5. 综合示例：从输入字符串求和</Heading3>
    <CodeBlock
      title="SumInput.java"
      code={`public class SumInput {
    public static void main(String[] args) {
        // 模拟用户输入的一行数字（空格分隔）
        String input = "10 20 30 40";

        String[] parts = input.split(" ");   // 拆成字符串数组
        int sum = 0;
        for (String p : parts) {
            sum += Integer.parseInt(p);        // 每段转 int 再累加
        }

        // 结果转回字符串拼进提示
        String result = String.format("共 %d 个数，和为 %d", parts.length, sum);
        System.out.println(result);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`共 4 个数，和为 100`}
    />
    <Paragraph>
      这个例子完整串起了本章知识：<InlineCode>split</InlineCode> 拆分 → <InlineCode>parseInt</InlineCode>
      转数值运算 → <InlineCode>String.format</InlineCode> 把结果拼回字符串，是处理文本数据的典型流程。
    </Paragraph>

    <Heading3>6. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>字符串转基本类型用包装类的 <InlineCode>parseXxx</InlineCode>（<InlineCode>Integer.parseInt</InlineCode> 等）。</ListItem>
        <ListItem>非法格式会抛 <InlineCode>NumberFormatException</InlineCode>，解析外部输入要防异常。</ListItem>
        <ListItem><InlineCode>parseInt</InlineCode> 返回基本类型 int，<InlineCode>valueOf</InlineCode> 返回包装对象 Integer（有缓存）。</ListItem>
        <ListItem>基本类型转字符串推荐 <InlineCode>String.valueOf(x)</InlineCode>（对 null 安全）。</ListItem>
        <ListItem><InlineCode>"100" + 50</InlineCode> 是拼接得 "10050"，数值相加需先转换。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测输出与判错"
      code={`System.out.println("3" + 4 + 5);
System.out.println(3 + 4 + "5");
System.out.println(Integer.parseInt("3") + 4 + 5);
System.out.println(String.valueOf(100) + 1);
// 下面这行会怎样？
System.out.println(Integer.parseInt("3.0"));

问：前 4 行输出什么？第 5 行的结果是？`}
      answerCode={`答案：
"3" + 4 + 5            -> 345    （从左到右：字符串"3"拼4得"34"，再拼5得"345"）
3 + 4 + "5"            -> 75     （先算 3+4=7，再拼"5"得"75"）
Integer.parseInt("3")+4+5 -> 12  （3+4+5 全是数值相加）
String.valueOf(100)+1  -> 1001   （"100" 拼 1）
Integer.parseInt("3.0")          -> 抛 NumberFormatException

解析：+ 遇到字符串就变拼接，且严格从左到右计算。parseInt 只接受整数格式，
      "3.0" 含小数点，非法 → NumberFormatException（要解析小数得用 Double.parseDouble）。`}
    />

    <CodeBlock
      qa
      title="练习2：安全地解析一批输入"
      code={`// 输入字符串里混有非法项，要求：能解析的累加求和，不能解析的跳过并计数。
// 输入: "10 abc 20 3.5 30"
// 预期输出：
//   合法数字之和: 60
//   跳过的非法项: 2   （abc 和 3.5）

public class SafeParse {
    public static void main(String[] args) {
        String input = "10 abc 20 3.5 30";
        // 补全
    }
}`}
      answerCode={`public class SafeParse {
    public static void main(String[] args) {
        String input = "10 abc 20 3.5 30";
        String[] parts = input.split(" ");

        int sum = 0;
        int skipped = 0;
        for (String p : parts) {
            try {
                sum += Integer.parseInt(p);   // 成功才累加
            } catch (NumberFormatException e) {
                skipped++;                     // 失败则计数并跳过
            }
        }

        System.out.println("合法数字之和: " + sum);
        System.out.println("跳过的非法项: " + skipped);
    }
}

/* 控制台输出：
合法数字之和: 60
跳过的非法项: 2

解析：用 try-catch 包住 parseInt，把"abc"和"3.5"（含小数点，对 int 非法）都捕获跳过。
      这是处理不可信输入的标准写法——不让单个坏数据搞崩整个程序。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：进制转换小工具"
      code={`// 给定一个十进制整数 n，输出它的二进制、八进制、十六进制字符串表示。
// n = 100
// 预期输出：
//   二进制: 1100100
//   八进制: 144
//   十六进制: 64

public class RadixTool {
    public static void main(String[] args) {
        int n = 100;
        // 补全（提示：Integer.toString(n, radix)）
    }
}`}
      answerCode={`public class RadixTool {
    public static void main(String[] args) {
        int n = 100;
        System.out.println("二进制: " + Integer.toString(n, 2));
        System.out.println("八进制: " + Integer.toString(n, 8));
        System.out.println("十六进制: " + Integer.toString(n, 16));

        // 等价的便捷方法：
        // Integer.toBinaryString(n) / toOctalString(n) / toHexString(n)
    }
}

/* 控制台输出：
二进制: 1100100
八进制: 144
十六进制: 64

解析：Integer.toString(n, radix) 把整数转成指定进制的字符串，radix 取值 2~36。
      Java 还提供专用快捷方法 toBinaryString / toOctalString / toHexString。
      反向解析（指定进制的字符串转 int）用 Integer.parseInt(s, radix)。
*/`}
    />
  </article>
);

export default index;
