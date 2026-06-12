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
    <Title>方法引用</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        当一个 Lambda 的全部工作就是「<Text bold>调用一个已有的方法</Text>」时，
        可以用更简洁的<Text bold>方法引用（Method Reference）</Text>来替代，写法是
        <InlineCode>类名::方法名</InlineCode>。本节讲解方法引用的四种形式
        （静态方法、实例方法、特定类型任意对象的实例方法、构造方法），
        以及什么时候能用、怎么用，让你的函数式代码进一步精简。
      </Paragraph>
    </Callout>

    <Heading3>1. 从 Lambda 到方法引用</Heading3>
    <Paragraph>
      看一个常见场景——遍历打印。Lambda 写法已经够简洁，但它做的事仅仅是「调用
      <InlineCode>System.out.println</InlineCode>」，连这一层包装都可以省掉：
    </Paragraph>
    <CodeBlock
      title="Lambda → 方法引用"
      code={`import java.util.Arrays;
import java.util.List;

public class FromLambda {
    public static void main(String[] args) {
        List<String> list = Arrays.asList("a", "b", "c");

        // Lambda：参数 s 原封不动传给 println
        list.forEach(s -> System.out.println(s));

        // 方法引用：等价，更简洁
        list.forEach(System.out::println);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`a
b
c
a
b
c`}
    />
    <Callout type="tip" title="使用前提：Lambda 只是「转调」一个方法">
      只有当 Lambda 的形式是「<Text bold>把参数原样交给某个已有方法</Text>」时，才能改成方法引用。
      <InlineCode>s -&gt; System.out.println(s)</InlineCode> 符合，所以能写成
      <InlineCode>System.out::println</InlineCode>；而 <InlineCode>s -&gt; System.out.println("[" + s + "]")</InlineCode>
      做了额外加工，<Text bold>不能</Text>用方法引用。
    </Callout>

    <Heading3>2. 方法引用的语法：双冒号 ::</Heading3>
    <CodeBlock
      language="text"
      title="四种形式总览"
      code={`① 静态方法引用：       类名::静态方法名      Integer::parseInt
② 实例方法引用：       对象::实例方法名      System.out::println
③ 特定类型任意对象：   类名::实例方法名      String::toUpperCase
④ 构造方法引用：       类名::new            ArrayList::new`}
    />

    <Heading3>3. 形式①：引用静态方法</Heading3>
    <CodeBlock
      title="静态方法引用"
      code={`import java.util.function.Function;

public class StaticRef {
    public static void main(String[] args) {
        // Lambda：s -> Integer.parseInt(s)
        Function<String, Integer> f1 = s -> Integer.parseInt(s);
        // 方法引用：Integer 的静态方法 parseInt
        Function<String, Integer> f2 = Integer::parseInt;

        System.out.println(f2.apply("123") + 1);   // 124
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`124`} />

    <Heading3>4. 形式②：引用某个对象的实例方法</Heading3>
    <CodeBlock
      title="特定对象的实例方法引用"
      code={`import java.util.function.Supplier;

public class InstanceRef {
    public static void main(String[] args) {
        String text = "Hello World";

        // Lambda：() -> text.toUpperCase()
        Supplier<String> s1 = () -> text.toUpperCase();
        // 方法引用：引用 text 这个具体对象的 toUpperCase 方法
        Supplier<String> s2 = text::toUpperCase;

        System.out.println(s2.get());

        // System.out 也是一个对象，println 是它的实例方法
        java.util.function.Consumer<String> printer = System.out::println;
        printer.accept("方法引用打印");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`HELLO WORLD
方法引用打印`}
    />

    <Heading3>5. 形式③：引用特定类型「任意对象」的实例方法</Heading3>
    <Paragraph>
      这是最容易绕的一种。<InlineCode>String::toUpperCase</InlineCode> 看起来像静态引用，
      但 <InlineCode>toUpperCase</InlineCode> 其实是实例方法。它的含义是：
      <Text bold>第一个参数作为方法的调用者</Text>，其余参数作为方法的入参。
    </Paragraph>
    <CodeBlock
      title="任意对象的实例方法引用"
      code={`import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

public class ArbitraryRef {
    public static void main(String[] args) {
        // Lambda：s -> s.toUpperCase()  （s 自己调用 toUpperCase）
        Function<String, String> f1 = s -> s.toUpperCase();
        // 方法引用：String::toUpperCase —— 传入的那个 String 当调用者
        Function<String, String> f2 = String::toUpperCase;
        System.out.println(f2.apply("hello"));

        // 在 Stream/排序中极常用
        List<String> list = Arrays.asList("banana", "Apple", "cherry");
        list.stream()
            .map(String::toUpperCase)        // 每个元素调自己的 toUpperCase
            .forEach(System.out::println);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`HELLO
BANANA
APPLE
CHERRY`}
    />
    <Callout type="warning" title="区分形式②与形式③">
      <UnorderedList>
        <ListItem>形式②是 <InlineCode>对象::方法</InlineCode>（<InlineCode>text::toUpperCase</InlineCode>），调用者是<Text bold>那个固定对象</Text>。</ListItem>
        <ListItem>形式③是 <InlineCode>类名::方法</InlineCode>（<InlineCode>String::toUpperCase</InlineCode>），调用者是<Text bold>传进来的参数</Text>。</ListItem>
      </UnorderedList>
      两者写法相似（左边一个是对象、一个是类名），含义不同，要结合上下文理解。
    </Callout>

    <Heading3>6. 形式④：引用构造方法</Heading3>
    <CodeBlock
      title="构造方法引用"
      code={`import java.util.function.Function;
import java.util.function.Supplier;
import java.util.ArrayList;
import java.util.List;

public class ConstructorRef {
    public static void main(String[] args) {
        // Lambda：() -> new ArrayList<>()
        Supplier<List<String>> s1 = () -> new ArrayList<>();
        // 方法引用：ArrayList::new
        Supplier<List<String>> s2 = ArrayList::new;
        List<String> list = s2.get();
        list.add("x");
        System.out.println(list);

        // 带参构造：String::new 等价于 str -> new String(str)
        Function<char[], String> makeStr = String::new;
        System.out.println(makeStr.apply(new char[]{'h', 'i'}));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`[x]
hi`}
    />

    <Heading3>7. 四种形式速查</Heading3>
    <Table
      head={['形式', '写法', '等价 Lambda']}
      rows={[
        ['静态方法', 'Integer::parseInt', 's -> Integer.parseInt(s)'],
        ['特定对象实例方法', 'System.out::println', 's -> System.out.println(s)'],
        ['任意对象实例方法', 'String::toUpperCase', 's -> s.toUpperCase()'],
        ['构造方法', 'ArrayList::new', '() -> new ArrayList<>()'],
      ]}
    />

    <Heading3>8. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>当 Lambda 只是「转调一个已有方法」时，可用方法引用 <InlineCode>::</InlineCode> 进一步简化。</ListItem>
        <ListItem>四种：静态 <InlineCode>类::静态方法</InlineCode>、特定对象 <InlineCode>对象::方法</InlineCode>、任意对象 <InlineCode>类::实例方法</InlineCode>、构造 <InlineCode>类::new</InlineCode>。</ListItem>
        <ListItem>易混点：<InlineCode>对象::方法</InlineCode>（调用者固定）vs <InlineCode>类::方法</InlineCode>（调用者是参数）。</ListItem>
        <ListItem>Lambda 做了额外加工（不只是转调）时<Text bold>不能</Text>用方法引用。</ListItem>
        <ListItem>方法引用在 Stream（<InlineCode>map/forEach/collect</InlineCode>）中极其常见。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>9. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：能否改成方法引用"
      code={`判断下列 Lambda 能否改成方法引用；能的话写出来。
① s -> Integer.parseInt(s)
② s -> System.out.println(s)
③ s -> s.length()
④ (a, b) -> a + b
⑤ s -> System.out.println("值=" + s)`}
      answerCode={`答案：
① 能 → Integer::parseInt           （静态方法）
② 能 → System.out::println         （特定对象实例方法）
③ 能 → String::length              （任意对象实例方法，参数 s 当调用者）
④ 不能 → a + b 是运算，不是「转调一个已有方法」
⑤ 不能 → 拼接了 "值=" 做了额外加工，不是单纯转调 println

解析：判定标准——Lambda 体是否「原样地只调用一个现成方法」。
      ④⑤都掺入了额外逻辑（加法、字符串拼接），无法用方法引用表达。`}
    />

    <CodeBlock
      qa
      title="练习2：用方法引用简化排序与转换"
      code={`// 把下面的 Lambda 都改成方法引用。
import java.util.*;
import java.util.stream.Collectors;

public class Test {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("tom", "JERRY", "Alice");

        // ① 按自然顺序排序
        names.sort((a, b) -> a.compareTo(b));

        // ② 全部转大写并收集
        List<String> upper = names.stream()
                .map(s -> s.toUpperCase())
                .collect(Collectors.toList());

        // ③ 逐个打印
        upper.forEach(s -> System.out.println(s));
    }
}`}
      answerCode={`import java.util.*;
import java.util.stream.Collectors;

public class Test {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(Arrays.asList("tom", "JERRY", "Alice"));

        // ① String::compareTo（任意对象实例方法：a 当调用者，b 当参数）
        names.sort(String::compareTo);

        // ② String::toUpperCase
        List<String> upper = names.stream()
                .map(String::toUpperCase)
                .collect(Collectors.toList());

        // ③ System.out::println
        upper.forEach(System.out::println);
    }
}

/* 控制台输出：
ALICE
JERRY
TOM

解析：
① (a,b)->a.compareTo(b) 的两个参数恰好是「调用者+入参」，可写 String::compareTo。
② s->s.toUpperCase() → String::toUpperCase（任意对象实例方法）。
③ s->System.out.println(s) → System.out::println（特定对象实例方法）。
排序后字典序：Alice < JERRY < tom？注意大写字母 ASCII 小于小写，故 'A'(65)<'J'(74)<'t'(116)，
得到 ALICE、JERRY、TOM。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：辨析两种实例方法引用"
      code={`String hello = "Hello";

// 下面两个方法引用，分别等价于哪个 Lambda？含义有何不同？
A: Supplier<Integer> a = hello::length;
B: Function<String, Integer> b = String::length;

System.out.println(a.get());
System.out.println(b.apply("World"));`}
      answerCode={`答案：
A: hello::length  等价于  () -> hello.length()
   含义：调用者是「固定对象 hello」，无需再传参，所以是 Supplier（无入参）。
   a.get() 输出 5（"Hello" 的长度）。

B: String::length 等价于  s -> s.length()
   含义：调用者是「传进来的那个 String 参数」，所以是 Function<String,Integer>（有入参）。
   b.apply("World") 输出 5（"World" 的长度）。

控制台输出：
5
5

解析：这就是「特定对象::方法」与「类名::方法」的本质区别——
      前者调用者已固定（对应函数式接口少一个入参），后者调用者由参数提供（多一个入参）。
      所以 A 是 Supplier，B 是 Function。`}
    />
  </article>
);

export default index;
