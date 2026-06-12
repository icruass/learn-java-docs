import React from 'react';
import {
  Title,
  Heading3,
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
    <Title>比较运算符</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        比较运算符用来判断两个值的大小关系，结果<Text bold>一定是 boolean 类型</Text>（
        <InlineCode>true</InlineCode> 或 <InlineCode>false</InlineCode>）。
        本节重点讲三个常见坑：<InlineCode>=</InlineCode> 与 <InlineCode>==</InlineCode> 混用、
        不能用连续比较、以及基本类型与对象的比较差异。
      </Paragraph>
    </Callout>

    <Heading3>1. 六个比较运算符</Heading3>
    <Table
      head={['运算符', '含义', '示例', '结果']}
      rows={[
        [<InlineCode>{'>'}</InlineCode>, '大于', '5 > 3', 'true'],
        [<InlineCode>{'<'}</InlineCode>, '小于', '5 < 3', 'false'],
        [<InlineCode>{'>='}</InlineCode>, '大于等于', '5 >= 5', 'true'],
        [<InlineCode>{'<='}</InlineCode>, '小于等于', '3 <= 5', 'true'],
        [<InlineCode>==</InlineCode>, '等于', '5 == 5', 'true'],
        [<InlineCode>!=</InlineCode>, '不等于', '5 != 3', 'true'],
      ]}
    />
    <Paragraph>
      比较运算符的结果是 <InlineCode>boolean</InlineCode>，可以直接打印，
      也可以赋给 boolean 变量，或用在 if、while 等条件判断中。
    </Paragraph>

    <Heading3>2. 注意点</Heading3>
    <Callout type="danger" title="坑 1：= 是赋值，== 才是判断相等">
      <Paragraph>
        <InlineCode>a = 5</InlineCode> 是把 5 赋给 a（赋值，不返回 boolean）；
        <InlineCode>a == 5</InlineCode> 是判断 a 是否等于 5（返回 boolean）。
      </Paragraph>
      <Paragraph>
        在条件判断中误用 <InlineCode>=</InlineCode> 是高频错误：
        <InlineCode>if (a = 5)</InlineCode> 在 Java 中会编译报错（因为 int 不能直接作为 boolean），
        但在某些其它语言里不会报错，结果就是 bug。养成习惯：条件里用 <InlineCode>==</InlineCode>。
      </Paragraph>
    </Callout>
    <Callout type="danger" title="坑 2：不能写连续比较">
      <Paragraph>
        数学里可以写 1 &lt; x &lt; 3，但 Java 不行。
        <InlineCode>1 &lt; x &lt; 3</InlineCode> 会先算 <InlineCode>1 &lt; x</InlineCode>
        得到 boolean，再把 boolean 与 3 比大小——boolean 不能和 int 比较，
        <Text bold>编译直接报错</Text>。
      </Paragraph>
      <Paragraph>
        正确写法是用逻辑与 <InlineCode>&&</InlineCode> 连接两个比较：
        <InlineCode>x &gt; 1 &amp;&amp; x &lt; 3</InlineCode>。
      </Paragraph>
    </Callout>
    <Callout type="warning" title="== 比较对象时比的是地址">
      <Paragraph>
        <InlineCode>==</InlineCode> 用于<Text bold>基本类型</Text>时比的是值；
        用于<Text bold>对象（引用类型）</Text>时比的是内存地址（是否同一个对象），
        不是内容。
      </Paragraph>
      <Paragraph>
        字符串内容比较要用 <InlineCode>equals()</InlineCode> 方法：
        <InlineCode>str1.equals(str2)</InlineCode>。
        对象相关的细节在面向对象章节再展开，这里先留个印象。
      </Paragraph>
    </Callout>

    <Heading3>3. 示例代码与控制台输出</Heading3>
    <CodeBlock
      title="CompareDemo.java"
      code={`public class CompareDemo {
    public static void main(String[] args) {
        int a = 5, b = 3, c = 5;

        System.out.println(a > b);   // true
        System.out.println(a < b);   // false
        System.out.println(a >= c);  // true
        System.out.println(b <= c);  // true
        System.out.println(a == c);  // true
        System.out.println(a != b);  // true

        // boolean 结果可以存入变量
        boolean result = (a == c);
        System.out.println(result);  // true

        // 字符串比较：== 比的是地址，equals() 比的是内容
        String s1 = new String("hello");
        String s2 = new String("hello");
        System.out.println(s1 == s2);       // false（两个不同对象）
        System.out.println(s1.equals(s2));  // true（内容相同）
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`true
false
true
true
true
true
true
false
true`}
    />
    <Paragraph>
      注意最后两行：两个用 <InlineCode>new String("hello")</InlineCode> 创建的字符串，
      内容相同但是两个独立对象，<InlineCode>==</InlineCode> 比地址得 false，
      <InlineCode>equals()</InlineCode> 比内容得 true。
    </Paragraph>

    <Heading3>4. 连续比较的正确写法</Heading3>
    <CodeBlock
      title="RangeCheck.java"
      code={`public class RangeCheck {
    public static void main(String[] args) {
        int x = 2;

        // 错误写法（编译报错）：
        // boolean wrong = 1 < x < 3;

        // 正确写法：用 && 连接两个比较
        boolean inRange = x > 1 && x < 3;
        System.out.println(inRange); // true

        int y = 5;
        System.out.println(y > 1 && y < 3); // false
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`true
false`}
    />

    <Heading3>5. 练习题</Heading3>
    <CodeBlock
      qa
      title="练习 1：预测比较表达式的结果"
      code={`// 不运行代码，预测每行打印的 true 或 false

public class Quiz1 {
    public static void main(String[] args) {
        int x = 10;
        System.out.println(x > 5);    // ?
        System.out.println(x >= 10);  // ?
        System.out.println(x < 10);   // ?
        System.out.println(x == 10);  // ?
        System.out.println(x != 9);   // ?
        System.out.println(x <= 9);   // ?
    }
}`}
      answerCode={`x = 10
x > 5    → true  （10 大于 5）
x >= 10  → true  （10 等于 10，>= 包含等于）
x < 10   → false （10 不小于 10）
x == 10  → true  （10 等于 10）
x != 9   → true  （10 不等于 9）
x <= 9   → false （10 大于 9，不满足小于等于）`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：找出错误并改正"
      code={`问：下面代码有两处错误，请指出并给出正确写法。

int score = 85;

// 错误 1：判断 score 是否等于 100
if (score = 100) {
    System.out.println("满分");
}

// 错误 2：判断 score 在 60 到 100 之间（含两端）
boolean pass = 60 <= score <= 100;`}
      answerCode={`错误 1：if (score = 100)
  = 是赋值运算符，不是判断。score = 100 把 100 赋给 score，
  结果是 int，不能作为 if 的条件（Java 要求 boolean），编译报错。
  正确写法：if (score == 100)

错误 2：boolean pass = 60 <= score <= 100;
  60 <= score 先求值得 boolean，然后 boolean <= 100 类型不匹配，编译报错。
  数学连续比较在 Java 中不合法，要用 && 拆开：
  正确写法：boolean pass = score >= 60 && score <= 100;`}
    />

    <Heading3>小结</Heading3>
    <UnorderedList>
      <ListItem>比较运算符结果一定是 <InlineCode>boolean</InlineCode>。</ListItem>
      <ListItem><InlineCode>==</InlineCode> 判断相等，<InlineCode>=</InlineCode> 是赋值，绝对不要混用。</ListItem>
      <ListItem>Java 不支持连续比较，范围判断用 <InlineCode>&amp;&amp;</InlineCode> 连接两个比较。</ListItem>
      <ListItem>比较对象内容用 <InlineCode>equals()</InlineCode>，<InlineCode>==</InlineCode> 比的是地址。</ListItem>
    </UnorderedList>
  </article>
);

export default index;
