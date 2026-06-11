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
    <Title>常量的打印输出</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节认识了各类常量，本节学习怎么把它们打印到控制台。核心是两个方法：
        <InlineCode>System.out.println</InlineCode>（打印后换行）和
        <InlineCode>System.out.print</InlineCode>（打印后不换行）。
        同时深入理解<Text bold>字符串拼接</Text>和
        <Text bold>加号运算顺序</Text>——这是初学者最容易踩坑的地方。
      </Paragraph>
    </Callout>

    <Heading3>1. println 与 print 的区别</Heading3>
    <Paragraph>
      Java 提供两个最基础的输出方法，区别只有一个：结尾要不要换行。
    </Paragraph>
    <Table
      head={['方法', '全称', '效果']}
      rows={[
        [
          <InlineCode>System.out.println(...)</InlineCode>,
          'print line',
          '打印内容，然后换行（光标移到下一行开头）',
        ],
        [
          <InlineCode>System.out.print(...)</InlineCode>,
          'print',
          '打印内容，不换行（光标留在同一行末尾）',
        ],
      ]}
    />

    <Heading4>对比示例</Heading4>
    <CodeBlock
      title="PrintDemo.java"
      code={`public class PrintDemo {
    public static void main(String[] args) {
        // println：每次打印后换行
        System.out.println("第一行");
        System.out.println("第二行");

        // print：打印后不换行，下一次 print/println 紧跟在后面
        System.out.print("A");
        System.out.print("B");
        System.out.print("C");
        System.out.println();   // 单独换行（括号内什么都不传）

        System.out.println("最后一行");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`第一行
第二行
ABC
最后一行`}
    />
    <Paragraph>
      逐行分析：前两行 <InlineCode>println</InlineCode> 各自换行，所以分两行显示；
      接着三个 <InlineCode>print</InlineCode> 不换行，三个字母紧挨着输出 <InlineCode>ABC</InlineCode>；
      再调一次空的 <InlineCode>System.out.println()</InlineCode> 补一个换行；
      最后 <InlineCode>println("最后一行")</InlineCode> 另起一行。
    </Paragraph>
    <Callout type="tip" title="println() 无参数 = 只输出一个换行">
      <InlineCode>System.out.println()</InlineCode> 括号里什么都不写，效果等同于打印一个空行，
      常用于在若干 <InlineCode>print</InlineCode> 之后手动换行。
    </Callout>

    <Heading3>2. 字符串拼接：+ 遇到字符串就是"拼"</Heading3>
    <Paragraph>
      在 Java 里，<InlineCode>+</InlineCode> 有两种身份：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        两边都是数字时：<Text bold>算术加法</Text>，计算数值之和。
      </ListItem>
      <ListItem>
        任意一边是字符串时：<Text bold>字符串拼接</Text>，把另一边转换成字符串后连接起来。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      title="ConcatDemo.java"
      code={`public class ConcatDemo {
    public static void main(String[] args) {
        // 两边都是数字 → 加法
        System.out.println(1 + 2);           // 3

        // 左边是字符串 → 拼接
        System.out.println("年龄:" + 18);     // 年龄:18

        // 右边是字符串 → 拼接
        System.out.println(18 + "岁");        // 18岁

        // 拼接不同类型
        System.out.println("结果=" + true);   // 结果=true
        System.out.println("字符=" + 'A');    // 字符=A
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`3
年龄:18
18岁
结果=true
字符=A`}
    />

    <Heading3>3. 重点：+ 从左到右运算，顺序决定结果</Heading3>
    <Paragraph>
      Java 的 <InlineCode>+</InlineCode> 运算是<Text bold>从左到右</Text>依次执行的（同优先级）。
      "遇到字符串就转为拼接"这个规则也是按从左到右逐步判断的。因此，<Text bold>同样的数字和字符串，顺序不同，结果完全不同。</Text>
    </Paragraph>
    <CodeBlock
      title="OrderDemo.java"
      code={`public class OrderDemo {
    public static void main(String[] args) {
        // 示例 A：字符串在最左边
        System.out.println("结果:" + 1 + 2);
        // 运算过程：("结果:" + 1) → "结果:1"，再 + 2 → "结果:12"
        // 输出：结果:12

        // 示例 B：字符串在最右边
        System.out.println(1 + 2 + "结果");
        // 运算过程：(1 + 2) → 3（两边都是数字，先做加法），再 + "结果" → "3结果"
        // 输出：3结果

        // 示例 C：用括号改变优先级
        System.out.println("和=" + (1 + 2));
        // 括号内先算：(1 + 2) → 3，再拼接 → "和=3"
        // 输出：和=3
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`结果:12
3结果
和=3`}
    />

    <Callout type="danger" title="高频易错：+ 号的顺序陷阱">
      <Paragraph>
        <Text bold>示例 A</Text>：<InlineCode>"结果:" + 1 + 2</InlineCode>
      </Paragraph>
      <Paragraph>
        从左到右：先算 <InlineCode>"结果:" + 1</InlineCode>，左边是字符串，触发拼接，
        得到 <InlineCode>"结果:1"</InlineCode>；
        再算 <InlineCode>"结果:1" + 2</InlineCode>，左边仍是字符串，继续拼接，
        得到 <InlineCode>"结果:12"</InlineCode>。
        <Text bold>最终输出 结果:12，而不是 结果:3。</Text>
      </Paragraph>
      <Paragraph>
        <Text bold>示例 B</Text>：<InlineCode>1 + 2 + "结果"</InlineCode>
      </Paragraph>
      <Paragraph>
        从左到右：先算 <InlineCode>1 + 2</InlineCode>，两边都是整数，做加法，得到
        <InlineCode>3</InlineCode>；
        再算 <InlineCode>3 + "结果"</InlineCode>，右边是字符串，触发拼接，
        得到 <InlineCode>"3结果"</InlineCode>。
        <Text bold>最终输出 3结果，而不是 12结果。</Text>
      </Paragraph>
      <Paragraph>
        想让数字先相加再拼接，用<Text bold>括号</Text>强制改变运算顺序：
        <InlineCode>"和=" + (1 + 2)</InlineCode> 输出 <InlineCode>和=3</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading3>4. 综合示例：混合使用 print / println / 拼接</Heading3>
    <CodeBlock
      title="MixDemo.java"
      code={`public class MixDemo {
    public static void main(String[] args) {
        // print 不换行，拼在一起
        System.out.print("姓名:");
        System.out.println("张三");

        // 字符串 + 字符：字符 'a' 被转为字符串 "a"
        System.out.println("a" + 'b' + 1);

        // 整数加法，然后拼接字符串
        System.out.println(1 + 2 + "ab");

        // 字符串在左，全部拼接
        System.out.println("ab" + 1 + 2);

        // 用括号先算加法
        System.out.println("sum=" + (10 + 20 + 30));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`姓名:张三
ab1
3ab
ab12
sum=60`}
    />
    <Paragraph>逐行分析：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>print("姓名:")</InlineCode> 不换行，紧接 <InlineCode>println("张三")</InlineCode>，合并成一行输出。
      </ListItem>
      <ListItem>
        <InlineCode>"a" + 'b' + 1</InlineCode>：先 <InlineCode>"a" + 'b'</InlineCode>
        ，字符 <InlineCode>'b'</InlineCode> 转为字符串拼接得 <InlineCode>"ab"</InlineCode>，
        再 <InlineCode>"ab" + 1</InlineCode> 拼接得 <InlineCode>"ab1"</InlineCode>。
      </ListItem>
      <ListItem>
        <InlineCode>1 + 2 + "ab"</InlineCode>：先 <InlineCode>1 + 2 = 3</InlineCode>（整数加法），
        再 <InlineCode>3 + "ab" = "3ab"</InlineCode>。
      </ListItem>
      <ListItem>
        <InlineCode>"ab" + 1 + 2</InlineCode>：先 <InlineCode>"ab" + 1 = "ab1"</InlineCode>，
        再 <InlineCode>"ab1" + 2 = "ab12"</InlineCode>。
      </ListItem>
      <ListItem>
        <InlineCode>"sum=" + (10 + 20 + 30)</InlineCode>：括号内 <InlineCode>10 + 20 + 30 = 60</InlineCode>，
        再拼接得 <InlineCode>"sum=60"</InlineCode>。
      </ListItem>
    </UnorderedList>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先独立预测输出，再点右上角 <Text accent>「看答案 →」</Text>对照。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：预测 println / print 输出"
      code={`问：下面代码运行后，控制台输出什么？（注意换行位置）

public class Test1 {
    public static void main(String[] args) {
        System.out.print("X");
        System.out.print("Y");
        System.out.println("Z");
        System.out.println("M");
        System.out.print("N");
        System.out.println();
        System.out.println("O");
    }
}`}
      answerCode={`输出：
XYZ
M
N
O

逐行解析：
  print("X")   → 输出 X，不换行
  print("Y")   → 输出 Y，不换行
  println("Z") → 输出 Z，然后换行  → 第1行：XYZ
  println("M") → 输出 M，然后换行  → 第2行：M
  print("N")   → 输出 N，不换行
  println()    → 空 println，只换行 → 第3行：N
  println("O") → 输出 O，然后换行  → 第4行：O`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：预测字符串拼接的输出"
      code={`问：下面每行 println 分别输出什么？请逐行写出答案。

① System.out.println("" + 1 + 2);
② System.out.println(1 + 2 + "");
③ System.out.println("a" + 'b' + 1);
④ System.out.println('a' + 1 + "b");
⑤ System.out.println("x=" + (3 + 4));
⑥ System.out.println("x=" + 3 + 4);`}
      answerCode={`① "" + 1 + 2
   "" + 1 → "1"（字符串拼接），"1" + 2 → "12"
   输出：12

② 1 + 2 + ""
   1 + 2 → 3（整数加法），3 + "" → "3"（拼接）
   输出：3

③ "a" + 'b' + 1
   "a" + 'b' → "ab"（字符 'b' 转为字符串），"ab" + 1 → "ab1"
   输出：ab1

④ 'a' + 1 + "b"
   注意：'a' 是字符，和整数 1 相加时发生"字符提升为 int"运算！
   'a' 的 Unicode 值为 97，97 + 1 = 98，98 + "b" → "98b"
   输出：98b
   （这是一个进阶易错点：字符与整数相加时是数值运算，不是拼接！）

⑤ "x=" + (3 + 4)
   括号先算：3 + 4 = 7，"x=" + 7 → "x=7"
   输出：x=7

⑥ "x=" + 3 + 4
   "x=" + 3 → "x=3"（字符串拼接），"x=3" + 4 → "x=34"
   输出：x=34`}
    />
  </article>
);

export default index;
