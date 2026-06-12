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
    <Title>逻辑运算符</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        逻辑运算符用于组合多个 boolean 表达式。Java 提供了两套"与/或"：
        普通的 <InlineCode>&amp;</InlineCode>/<InlineCode>|</InlineCode> 和短路的
        <InlineCode>&amp;&amp;</InlineCode>/<InlineCode>||</InlineCode>。
        两者的核心区别在于<Text bold>短路效果</Text>——即右边的表达式是否一定会被执行。
        这不只是性能问题，还会影响程序行为，是本节重点。
      </Paragraph>
    </Callout>

    <Heading3>1. 六个逻辑运算符一览</Heading3>
    <Table
      head={['运算符', '名称', '含义', '示例', '结果']}
      rows={[
        [<InlineCode>&amp;</InlineCode>, '逻辑与', '两边都为 true 才为 true', 'true & false', 'false'],
        [<InlineCode>|</InlineCode>, '逻辑或', '两边有一个为 true 就为 true', 'true | false', 'true'],
        [<InlineCode>!</InlineCode>, '逻辑非', '取反', '!true', 'false'],
        [<InlineCode>^</InlineCode>, '逻辑异或', '相同为 false，不同为 true', 'true ^ false', 'true'],
        [<InlineCode>&amp;&amp;</InlineCode>, '短路与', '同 &，但左边为 false 时右边不执行', 'true && false', 'false'],
        [<InlineCode>||</InlineCode>, '短路或', '同 |，但左边为 true 时右边不执行', 'true || false', 'true'],
      ]}
    />

    <Heading3>2. 真值表</Heading3>
    <Table
      head={['A', 'B', 'A & B', 'A | B', 'A ^ B', '!A']}
      rows={[
        ['true', 'true', 'true', 'true', 'false', 'false'],
        ['true', 'false', 'false', 'true', 'true', 'false'],
        ['false', 'true', 'false', 'true', 'true', 'true'],
        ['false', 'false', 'false', 'false', 'false', 'true'],
      ]}
    />
    <Callout type="tip" title="异或 ^ 的记忆口诀">
      <Text bold>相同为 false，不同为 true</Text>。
      两边一致（同真或同假）→ false；两边不一致（一真一假）→ true。
    </Callout>

    <Heading3>3. 短路运算符的核心：右边可能不执行</Heading3>
    <Paragraph>
      <InlineCode>&amp;&amp;</InlineCode> 和 <InlineCode>||</InlineCode> 叫"短路"运算符，
      原因如下：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>短路与 &amp;&amp;</Text>：左边为 <InlineCode>false</InlineCode> 时，
        整体结果必然是 false，<Text bold>右边直接跳过不执行</Text>。
      </ListItem>
      <ListItem>
        <Text bold>短路或 ||</Text>：左边为 <InlineCode>true</InlineCode> 时，
        整体结果必然是 true，<Text bold>右边直接跳过不执行</Text>。
      </ListItem>
      <ListItem>
        <Text bold>普通与 &amp; / 普通或 |</Text>：无论左边结果如何，<Text bold>两边都要执行</Text>。
      </ListItem>
    </UnorderedList>
    <Callout type="danger" title="短路可能跳过副作用">
      <Paragraph>
        如果右边的表达式有副作用（例如 <InlineCode>i++</InlineCode>），
        短路与普通运算符的结果会不同。
      </Paragraph>
      <Paragraph>
        示例：<InlineCode>int i = 0; boolean r = false &amp;&amp; (i++ &gt; 0);</InlineCode>
        由于左边是 false，短路跳过右边，<InlineCode>i++</InlineCode> 不执行，i 仍为 0。
        换成 <InlineCode>false &amp; (i++ &gt; 0)</InlineCode>，右边必须执行，i 变为 1。
      </Paragraph>
    </Callout>

    <Heading3>4. 示例代码与控制台输出</Heading3>
    <CodeBlock
      title="LogicDemo.java"
      code={`public class LogicDemo {
    public static void main(String[] args) {
        // ---- 基本逻辑运算 ----
        System.out.println(true & false);  // false
        System.out.println(true | false);  // true
        System.out.println(!true);         // false
        System.out.println(true ^ false);  // true
        System.out.println(true ^ true);   // false

        // ---- 短路与 && 的副作用演示 ----
        int i = 0;
        boolean r1 = false && (i++ > 0);  // 左边 false，右边短路，i++ 不执行
        System.out.println("短路&&后 i=" + i); // i=0

        // ---- 普通与 & 的副作用演示 ----
        int j = 0;
        boolean r2 = false & (j++ > 0);   // 普通 &，两边都执行，j++ 执行
        System.out.println("普通&后 j=" + j);  // j=1

        // ---- 短路或 || 的副作用演示 ----
        int m = 0;
        boolean r3 = true || (m++ > 0);   // 左边 true，右边短路，m++ 不执行
        System.out.println("短路||后 m=" + m); // m=0

        // ---- 普通或 | 的副作用演示 ----
        int n = 0;
        boolean r4 = true | (n++ > 0);    // 普通 |，两边都执行，n++ 执行
        System.out.println("普通|后 n=" + n);  // n=1
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`false
true
false
true
false
短路&&后 i=0
普通&后 j=1
短路||后 m=0
普通|后 n=1`}
    />
    <Paragraph>
      对比 i 和 j 的结果：短路 <InlineCode>&amp;&amp;</InlineCode> 左边为 false 时跳过右边，
      i 仍为 0；普通 <InlineCode>&amp;</InlineCode> 两边都执行，j 变为 1。
      短路 <InlineCode>||</InlineCode> 左边为 true 时跳过右边，m 仍为 0；
      普通 <InlineCode>|</InlineCode> 两边都执行，n 变为 1。
    </Paragraph>

    <Heading3>5. 实际中如何选择</Heading3>
    <UnorderedList>
      <ListItem>
        绝大多数情况下用 <Text bold>短路运算符 &amp;&amp; 和 ||</Text>，
        因为性能更好（避免不必要的计算），而且还能防止空指针等问题
        （如 <InlineCode>obj != null &amp;&amp; obj.getX() &gt; 0</InlineCode>，
        obj 为 null 时右边不会执行，不会报空指针）。
      </ListItem>
      <ListItem>
        只有明确需要"两边都必须执行"时才用 <InlineCode>&amp;</InlineCode>/<InlineCode>|</InlineCode>，
        这种场景在日常业务代码中极少见。
      </ListItem>
    </UnorderedList>

    <Heading3>6. 练习题</Heading3>
    <CodeBlock
      qa
      title="练习 1：预测短路相关输出"
      code={`// 预测每个 println 的输出（不要运行，先手算）

public class Quiz1 {
    public static void main(String[] args) {
        int a = 0;
        boolean r1 = true && (a++ > 0);
        System.out.println("a=" + a);  // ?

        int b = 0;
        boolean r2 = false || (b++ > 0);
        System.out.println("b=" + b);  // ?

        int c = 0;
        boolean r3 = true || (c++ > 0);
        System.out.println("c=" + c);  // ?

        int d = 0;
        boolean r4 = false && (d++ > 0);
        System.out.println("d=" + d);  // ?
    }
}`}
      answerCode={`r1：true && (a++ > 0)
  左边是 true，&& 不短路（左边为 true 时右边必须执行来决定最终结果）
  所以右边 a++ 执行，a 从 0 变为 1
  → a=1

r2：false || (b++ > 0)
  左边是 false，|| 不短路（左边为 false 时右边必须执行）
  所以右边 b++ 执行，b 从 0 变为 1
  → b=1

r3：true || (c++ > 0)
  左边是 true，|| 短路！右边不执行
  c 仍为 0
  → c=0

r4：false && (d++ > 0)
  左边是 false，&& 短路！右边不执行
  d 仍为 0
  → d=0

规律：
  && 短路条件：左边为 false → 右边不执行
  || 短路条件：左边为 true  → 右边不执行`}
    />
    <CodeBlock
      qa
      title="练习 2：判断下列说法正误"
      code={`// 判断下面每条说法是"正确"还是"错误"，并简要说明理由。

// 1. a && b 与 a & b 的运算结果（最终 boolean 值）一定相同。
// 2. 用 && 代替 & 可能改变程序行为（不仅是性能差异）。
// 3. 异或 ^ 中，true ^ true 的结果是 true。
// 4. 短路或 || 中，左边为 false 时右边不执行。`}
      answerCode={`1. 正确。
   && 和 & 的最终 boolean 结果完全相同（真值表一致）。
   区别只在于是否执行右边的表达式（副作用），不影响逻辑结果本身。

2. 正确。
   如果右边的表达式有副作用（如 i++、方法调用），
   短路运算符可能跳过右边不执行，导致副作用不发生，程序行为就不同了。

3. 错误。
   异或 ^：相同为 false，不同为 true。
   true ^ true 两边相同，结果是 false，不是 true。

4. 错误。
   短路或 || 的短路条件是"左边为 true"时跳过右边。
   左边为 false 时，右边必须执行（因为还不能确定最终结果）。`}
    />
  </article>
);

export default index;
