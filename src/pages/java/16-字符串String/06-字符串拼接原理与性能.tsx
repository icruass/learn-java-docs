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
    <Title>字符串拼接原理与性能</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节学了 <InlineCode>StringBuilder</InlineCode>，但你可能疑惑：平时写
        <InlineCode>"a" + "b"</InlineCode> 也没慢啊，到底什么时候才需要它？
        答案藏在 <InlineCode>+</InlineCode> 拼接的<Text bold>底层编译机制</Text>里。本节揭开
        <InlineCode>+</InlineCode> 的真面目：<Text bold>编译期常量折叠</Text>与
        <Text bold>运行时 StringBuilder 转换</Text>，讲清「为什么常量拼接很快、循环拼接很慢」，
        让你彻底明白何时该用 <InlineCode>+</InlineCode>、何时必须用 <InlineCode>StringBuilder</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading3>1. 编译期常量折叠：纯字面量拼接是「免费」的</Heading3>
    <Paragraph>
      当 <InlineCode>+</InlineCode> 两边都是<Text bold>编译期常量</Text>（字面量，或 <InlineCode>final</InlineCode>
      修饰的常量）时，编译器会在<Text bold>编译阶段</Text>直接算出结果，运行时根本没有拼接动作：
    </Paragraph>
    <CodeBlock
      title="常量折叠示例"
      code={`public class ConstFold {
    public static void main(String[] args) {
        // 编译后等价于 String s = "abc"; 直接进常量池
        String s = "a" + "b" + "c";

        final String x = "he";
        String s2 = x + "llo";    // x 是 final 常量，同样在编译期折叠为 "hello"

        // 三者指向常量池同一对象
        System.out.println(s == "abc");      // true
        System.out.println(s2 == "hello");   // true
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`true
true`}
    />
    <Callout type="tip" title="为什么 == 是 true">
      因为 <InlineCode>"a" + "b" + "c"</InlineCode> 在编译期就变成了字面量 <InlineCode>"abc"</InlineCode>，
      与常量池里已有的 <InlineCode>"abc"</InlineCode> 是同一个对象，所以 <InlineCode>==</InlineCode> 成立。
      （常量池的概念见本章第 1 节《字符串的创建与特点》。）
    </Callout>

    <Heading3>2. 运行时拼接：+ 实际是 StringBuilder</Heading3>
    <Paragraph>
      一旦 <InlineCode>+</InlineCode> 涉及<Text bold>变量</Text>（运行时才知道值），编译器无法提前算出结果，
      就会把它<Text bold>翻译成 StringBuilder 的 append</Text>。下面两段代码<Text bold>编译后几乎等价</Text>：
    </Paragraph>
    <CodeBlock
      title="你写的代码"
      code={`String name = "Java";
String msg = "Hello, " + name + "!";`}
    />
    <CodeBlock
      language="text"
      title="编译器实际生成的等价逻辑（JDK8 视角）"
      code={`String name = "Java";
String msg = new StringBuilder()
        .append("Hello, ")
        .append(name)
        .append("!")
        .toString();`}
    />
    <Callout type="note" title="JDK9+ 的变化（了解即可）">
      从 JDK9 起，编译器改用 <InlineCode>invokedynamic</InlineCode> + <InlineCode>StringConcatFactory</InlineCode>
      来做字符串拼接，运行时由 JVM 动态生成更优的拼接代码，比固定的 StringBuilder 更高效。
      但对开发者而言结论不变：<Text bold>单行的变量 + 拼接，JVM 已帮你优化好，可以放心写。</Text>
    </Callout>

    <Heading3>3. 关键陷阱：循环里的 + 拼接</Heading3>
    <Paragraph>
      既然 <InlineCode>+</InlineCode> 会被转成 StringBuilder，那循环里用 <InlineCode>+</InlineCode> 不也一样快吗？
      <Text bold>恰恰相反</Text>——问题在于 StringBuilder 的创建位置：
    </Paragraph>
    <CodeBlock
      title="循环 + 拼接的真相"
      code={`String s = "";
for (int i = 0; i < n; i++) {
    s = s + i;
}`}
    />
    <CodeBlock
      language="text"
      title="编译后等价逻辑——注意 StringBuilder 在循环体内反复新建"
      code={`String s = "";
for (int i = 0; i < n; i++) {
    s = new StringBuilder()   // 每次循环都 new 一个新的 StringBuilder！
            .append(s)         // 还要把已有的 s 整个拷进去
            .append(i)
            .toString();       // 再转回 String
}`}
    />
    <Callout type="danger" title="O(n²) 的性能灾难">
      每次循环都：<Text bold>新建一个 StringBuilder + 把越来越长的 s 整体拷贝一遍 + 生成新 String</Text>。
      第 i 次拷贝长度约为 i，总代价 1+2+…+n ≈ <InlineCode>O(n²)</InlineCode>。
      n 上万时就会明显卡顿。<Text bold>这是「+ 转 StringBuilder」最容易被误解的地方</Text>：
      单行拼接被优化了，但循环让优化失效，因为 StringBuilder 没能复用。
    </Callout>

    <Heading3>4. 正解：循环外建一个 StringBuilder 复用</Heading3>
    <CodeBlock
      title="对比演示：两种写法的差异"
      code={`public class ConcatPerf {
    public static void main(String[] args) {
        int n = 50000;

        // 写法一：循环内 + 拼接（慢，O(n²)）
        long t1 = System.nanoTime();
        String bad = "";
        for (int i = 0; i < n; i++) {
            bad = bad + "x";
        }
        long t2 = System.nanoTime();

        // 写法二：复用一个 StringBuilder（快，O(n)）
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append("x");
        }
        String good = sb.toString();
        long t3 = System.nanoTime();

        System.out.println("结果长度是否相等: " + (bad.length() == good.length()));
        System.out.println("+ 拼接耗时(ms):        " + (t2 - t1) / 1_000_000);
        System.out.println("StringBuilder耗时(ms): " + (t3 - t2) / 1_000_000);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（耗时随机器不同，量级差异是关键）"
      code={`结果长度是否相等: true
+ 拼接耗时(ms):        1200
StringBuilder耗时(ms): 2`}
    />
    <Paragraph>
      两者结果完全一样，但耗时相差<Text bold>数百倍</Text>。差距随 n 增大而急剧拉大，
      这就是「循环外建一个 StringBuilder 复用」的价值。
    </Paragraph>

    <Heading3>5. 决策表：什么时候用哪个</Heading3>
    <Table
      head={['场景', '推荐写法', '原因']}
      rows={[
        ['纯字面量拼接 "a"+"b"', '直接用 +', '编译期折叠，零开销'],
        ['少量变量单行拼接 a+b+c', '直接用 +', 'JVM 已优化为一次 StringBuilder'],
        ['循环 / 大量动态拼接', 'StringBuilder（循环外创建）', '避免反复新建与拷贝，O(n)'],
        ['多线程共享拼接', 'StringBuffer', '线程安全'],
        ['用固定分隔符拼接列表', 'String.join / StringJoiner', '简洁，自动处理分隔符'],
      ]}
    />
    <Callout type="tip" title="一句话经验法则">
      <Text bold>能一行写完的拼接，放心用 +；只要出现循环，就用 StringBuilder。</Text>
    </Callout>

    <Heading3>6. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>编译期常量（字面量 / final 常量）的 <InlineCode>+</InlineCode> 会被<Text bold>常量折叠</Text>，零运行时开销。</ListItem>
        <ListItem>含变量的 <InlineCode>+</InlineCode> 会被编译成 <InlineCode>StringBuilder.append</InlineCode>（JDK9+ 用 invokedynamic 进一步优化）。</ListItem>
        <ListItem>循环里用 <InlineCode>+</InlineCode> 会<Text bold>每轮新建 StringBuilder 并整体拷贝</Text>，退化为 O(n²)。</ListItem>
        <ListItem>正确做法：<Text bold>循环外创建一个 StringBuilder，循环内 append 复用</Text>。</ListItem>
        <ListItem>法则：单行拼接用 <InlineCode>+</InlineCode>，循环拼接用 <InlineCode>StringBuilder</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断 == 结果"
      code={`String a = "hello";
String b = "hel" + "lo";              // 都是字面量
String c = "hel";
String d = c + "lo";                  // c 是变量
final String e = "hel";
String f = e + "lo";                  // e 是 final 常量

System.out.println(a == b);  // ?
System.out.println(a == d);  // ?
System.out.println(a == f);  // ?

问：三个 == 分别输出什么？为什么？`}
      answerCode={`答案：
a == b  ->  true
a == d  ->  false
a == f  ->  true

解析：
- b = "hel"+"lo" 全是字面量，编译期折叠成 "hello"，与 a 同为常量池对象 → true。
- d = c + "lo" 中 c 是普通变量，运行时通过 StringBuilder 拼接，结果是堆上的新对象 → 与常量池的 a 不同 → false。
- f = e + "lo" 中 e 是 final 常量，编译期可确定其值，同样折叠成 "hello" → true。

结论：决定能否折叠的关键是「+ 两边在编译期能否确定」。final 常量能，普通变量不能。`}
    />

    <CodeBlock
      qa
      title="练习2：把慢代码改快"
      code={`// 下面这段把 1~1000 拼成 "1,2,3,...,1000" 的代码很慢，请改用 StringBuilder 优化。
// 输出形如：1,2,3,...,1000（无尾部逗号）

public class JoinNums {
    public static void main(String[] args) {
        String s = "";
        for (int i = 1; i <= 1000; i++) {
            s = s + i + ",";
        }
        s = s.substring(0, s.length() - 1); // 去掉最后的逗号
        System.out.println(s.substring(0, 10) + "...");
    }
}`}
      answerCode={`public class JoinNums {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();   // 循环外创建，复用
        for (int i = 1; i <= 1000; i++) {
            sb.append(i);
            if (i != 1000) {
                sb.append(",");                    // 不是最后一个才加逗号
            }
        }
        String s = sb.toString();
        System.out.println(s.substring(0, 10) + "...");
    }
}

/* 控制台输出：
1,2,3,4,5,...

解析：循环外建一个 StringBuilder 全程复用，把 O(n²) 降到 O(n)。
      同时用「不是最后一个才加逗号」的判断，省去了原来 substring 去尾逗号的步骤。
      若用 JDK8+，还能更简洁：IntStream.rangeClosed(1,1000).mapToObj(String::valueOf)
                              .collect(Collectors.joining(","))。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：概念辨析"
      code={`判断对错并说明理由：
① 任何字符串拼接都应该用 StringBuilder，+ 一律不要用。
② "a" + "b" + "c" 在运行时会创建 StringBuilder 对象。
③ 循环里用 + 拼接，编译器会自动优化成只创建一个 StringBuilder。
④ StringBuffer 比 StringBuilder 慢，是因为它的方法加了 synchronized。`}
      answerCode={`答案：
① 错。纯字面量、单行少量拼接用 + 更易读，且 JVM 已优化，无需上 StringBuilder。
   "能一行写完用 +，出现循环用 StringBuilder"。
② 错。三个都是字面量，编译期常量折叠为 "abc"，运行时没有任何拼接，也不创建 StringBuilder。
③ 错。恰恰相反——编译器是在「循环体内」每轮各新建一个 StringBuilder 并拷贝已有内容，
   导致 O(n²)。它不会聪明到把 StringBuilder 提到循环外，这需要你手写。
④ 对。StringBuffer 的方法用 synchronized 保证线程安全，带来同步开销，故比 StringBuilder 慢。

解析：核心就是分清「编译期能确定（折叠）」「单行变量拼接（已优化）」「循环拼接（需手动复用）」三种情形。`}
    />
  </article>
);

export default index;
