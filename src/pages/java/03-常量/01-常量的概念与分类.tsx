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
    <Title>常量的概念与分类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        变量是"可以变化的量"，而<Text bold>常量</Text>是"在程序运行过程中值不会改变的量"。
        本节先讲最基础的一类常量——<Text bold>字面量常量（literal）</Text>，即直接写在代码里的固定值，
        例如 <InlineCode>100</InlineCode>、<InlineCode>3.14</InlineCode>、
        <InlineCode>'A'</InlineCode>、<InlineCode>"Hello"</InlineCode>、
        <InlineCode>true</InlineCode>、<InlineCode>null</InlineCode>。
        掌握它们的分类和写法规则，是理解变量类型、赋值、打印输出的前提。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是常量</Heading3>
    <Paragraph>
      <Text bold>常量（constant）</Text>是在程序运行过程中<Text bold>值不会发生改变</Text>的量。
      Java 中常量分两种：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>字面量常量</Text>：直接写在代码里的固定值，如 <InlineCode>42</InlineCode>、
        <InlineCode>'A'</InlineCode>、<InlineCode>"Hello"</InlineCode>——本节重点讲这种。
      </ListItem>
      <ListItem>
        <Text bold>final 常量</Text>：用关键字 <InlineCode>final</InlineCode> 修饰的变量，
        赋值后不可再更改，如 <InlineCode>final int MAX = 100;</InlineCode>——后续章节介绍。
      </ListItem>
    </UnorderedList>

    <Heading3>2. 字面量常量的六大分类</Heading3>
    <Paragraph>Java 的字面量常量按数据类型分为以下六类：</Paragraph>
    <Table
      head={['分类', '示例', '说明']}
      rows={[
        [
          '整数常量',
          <InlineCode>0  100  -99  0xFF</InlineCode>,
          '不带小数点的整数，支持十进制、十六进制等写法',
        ],
        [
          '小数常量',
          <InlineCode>3.14  -0.5  1.0E3</InlineCode>,
          '带小数点的数，也称浮点常量',
        ],
        [
          '字符常量',
          <InlineCode>\'A\'  \'0\'  \'中\'</InlineCode>,
          '用单引号括起来，有且仅有一个字符（包括转义字符）',
        ],
        [
          '字符串常量',
          <InlineCode>"Hello"  ""  "你好"</InlineCode>,
          '用双引号括起来，可以是零个到任意多个字符',
        ],
        [
          '布尔常量',
          <InlineCode>true  false</InlineCode>,
          '只有这两个值，全部小写，表示真/假',
        ],
        [
          '空常量',
          <InlineCode>null</InlineCode>,
          '表示"没有引用任何对象"，不能用 println 直接单独使用（编译报错）',
        ],
      ]}
    />

    <Heading3>3. 字符常量详解</Heading3>
    <Paragraph>
      字符常量用<Text bold>单引号</Text>括起来，内部<Text bold>有且仅有一个字符</Text>。
      "一个字符"包含普通字母、数字、标点，也包含转义字符（如 <InlineCode>'\n'</InlineCode>
      表示换行，它虽然写成两个符号，但代表的是一个字符）。
    </Paragraph>
    <Table
      head={['写法', '是否合法', '原因']}
      rows={[
        [<InlineCode>'A'</InlineCode>, '合法', '单引号内正好一个字符'],
        [<InlineCode>'0'</InlineCode>, '合法', '数字字符，注意它是字符不是整数 0'],
        [<InlineCode>'中'</InlineCode>, '合法', '汉字也是一个字符（Unicode）'],
        [<InlineCode>'\n'</InlineCode>, '合法', '转义字符，代表换行，逻辑上是一个字符'],
        [<InlineCode>''</InlineCode>, '非法', '单引号内没有字符，编译报错'],
        [<InlineCode>'ab'</InlineCode>, '非法', '单引号内有两个字符，编译报错'],
        [<InlineCode>'ABC'</InlineCode>, '非法', '单引号内有三个字符，编译报错'],
      ]}
    />

    <Callout type="danger" title="最常见的坑：字符常量 vs 字符串常量">
      <Paragraph>
        <Text bold>单引号</Text>是字符常量，内部<Text bold>必须恰好一个字符</Text>，
        多一个少一个都编译报错。<Text bold>双引号</Text>是字符串常量，内部可以是零个或任意多个字符。
      </Paragraph>
      <Paragraph>
        初学者最容易犯的两个错：第一，把 <InlineCode>'A'</InlineCode> 写成
        <InlineCode>"A"</InlineCode>（类型不同，某些场合不能互换）；
        第二，想写空字符而写了 <InlineCode>''</InlineCode>（空单引号是非法的，
        空字符串应写成 <InlineCode>""</InlineCode>）。
      </Paragraph>
    </Callout>

    <Heading3>4. 示例：用 println 打印各类常量</Heading3>
    <Heading4>代码示例</Heading4>
    <CodeBlock
      title="ConstantDemo.java"
      code={`public class ConstantDemo {
    public static void main(String[] args) {
        // 整数常量
        System.out.println(100);
        System.out.println(-99);

        // 小数常量
        System.out.println(3.14);
        System.out.println(-0.5);

        // 字符常量
        System.out.println('A');
        System.out.println('中');

        // 字符串常量
        System.out.println("Hello, Java!");
        System.out.println("");   // 空字符串，打印空行

        // 布尔常量
        System.out.println(true);
        System.out.println(false);

        // 空常量：null 不能直接传给 println，需要借助字符串变量演示
        // System.out.println(null);  // 编译报错：reference to println is ambiguous
    }
}`}
    />
    <Paragraph>运行结果：</Paragraph>
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`100
-99
3.14
-0.5
A
中
Hello, Java!

true
false`}
    />
    <Callout type="tip" title="null 不能直接 println">
      <InlineCode>System.out.println(null)</InlineCode> 会编译报错，原因是
      <InlineCode>println</InlineCode> 有多个重载版本，编译器无法判断应该用哪一个。
      如果需要打印 <InlineCode>null</InlineCode>，通常把它赋给一个变量后再打印，例如
      <InlineCode>String s = null; System.out.println(s);</InlineCode>——这会输出
      <InlineCode>null</InlineCode> 这四个字母（后续章节讲变量时会演示）。
    </Callout>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先独立判断，再点右上角 <Text accent>「看答案 →」</Text>对照。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：判断常量类型与合法性"
      code={`问：下列写法各属于哪种常量？是否合法？
（在空白处填写：常量类型 / 是否合法）

① 'A'          → 类型：___    合法：___
② "A"          → 类型：___    合法：___
③ ''           → 类型：___    合法：___
④ 'ab'         → 类型：___    合法：___
⑤ '12'         → 类型：___    合法：___
⑥ "12"         → 类型：___    合法：___
⑦ true         → 类型：___    合法：___
⑧ "true"       → 类型：___    合法：___
⑨ 3.14         → 类型：___    合法：___
⑩ null         → 类型：___    合法：___`}
      answerCode={`① 'A'    → 类型：字符常量    合法：是
                  （单引号，一个字符，完全正确）

② "A"    → 类型：字符串常量  合法：是
                  （双引号，包含一个字符的字符串，合法）

③ ''     → 类型：字符常量    合法：否
                  （单引号内没有字符，编译报错：empty character literal）

④ 'ab'   → 类型：字符常量    合法：否
                  （单引号内有两个字符，编译报错：too many characters in character literal）

⑤ '12'   → 类型：字符常量    合法：否
                  （单引号内有两个字符 '1' 和 '2'，编译报错，同上）

⑥ "12"   → 类型：字符串常量  合法：是
                  （双引号，包含两个字符的字符串，合法）

⑦ true   → 类型：布尔常量    合法：是
                  （Java 关键字，只有 true / false 两个值）

⑧ "true" → 类型：字符串常量  合法：是
                  （双引号括起来的，是字符串，不是布尔值）

⑨ 3.14   → 类型：小数常量    合法：是
                  （带小数点，是浮点字面量）

⑩ null   → 类型：空常量      合法：是（作为常量本身合法，但不能直接传给 println）`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：改错题"
      code={`// 下面代码中有 3 处关于常量写法的错误，请找出并说明如何修改。

public class ConstantFix {
    public static void main(String[] args) {
        System.out.println('');        // 第 1 处
        System.out.println('Java');    // 第 2 处
        System.out.println('3.14');    // 第 3 处
    }
}`}
      answerCode={`错误 1：System.out.println('');
  原因：单引号内没有字符，字符常量不允许为空。
  修改：如果想打印空行，改用空字符串 System.out.println("");

错误 2：System.out.println('Java');
  原因：单引号内有 4 个字符，字符常量只能有一个字符。
  修改：改用双引号 System.out.println("Java");

错误 3：System.out.println('3.14');
  原因：单引号内有 4 个字符，同上。
  修改：
    · 如果要打印小数常量，去掉引号：System.out.println(3.14);
    · 如果要打印字符串 "3.14"，改用双引号：System.out.println("3.14");

修复后的代码：
public class ConstantFix {
    public static void main(String[] args) {
        System.out.println("");       // 打印空行
        System.out.println("Java");   // 打印字符串 Java
        System.out.println(3.14);     // 打印小数常量 3.14
    }
}

控制台输出：

Java
3.14`}
    />
  </article>
);

export default index;
