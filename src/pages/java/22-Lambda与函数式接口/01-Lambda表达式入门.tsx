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
    <Title>Lambda 表达式入门</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        JDK8 最重要的特性就是 <Text bold>Lambda 表达式</Text>，它把「函数」当作参数传递，
        让代码从「面向对象的冗长」走向「函数式的简洁」。本节从大家熟悉的<Text bold>匿名内部类</Text>
        引入，演示 Lambda 如何把它一步步简化，讲清 Lambda 的语法、省略规则和适用前提，
        为后面的函数式接口与 Stream 打好基础。
      </Paragraph>
    </Callout>

    <Heading3>1. 从匿名内部类说起</Heading3>
    <Paragraph>
      回忆开启一个线程：要传一个 <InlineCode>Runnable</InlineCode>。用匿名内部类写法很啰嗦：
    </Paragraph>
    <CodeBlock
      title="匿名内部类（啰嗦）"
      code={`public class OldWay {
    public static void main(String[] args) {
        // 匿名内部类：真正有用的只有 println 那一行，其余全是模板代码
        Runnable r = new Runnable() {
            @Override
            public void run() {
                System.out.println("线程运行中...");
            }
        };
        new Thread(r).start();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`线程运行中...`} />
    <Paragraph>
      上面这段，<InlineCode>new Runnable()</InlineCode>、<InlineCode>public void run()</InlineCode>
      都是「编译器其实能推断出来」的模板代码——我们真正想表达的只是「run 时打印一句话」。
      Lambda 就是来去掉这些冗余的。
    </Paragraph>

    <Heading3>2. 用 Lambda 改写</Heading3>
    <CodeBlock
      title="Lambda（简洁）"
      code={`public class NewWay {
    public static void main(String[] args) {
        // 一行搞定：() 是 run 的参数列表，-> 后面是方法体
        Runnable r = () -> System.out.println("线程运行中...");
        new Thread(r).start();

        // 甚至直接传给 Thread
        new Thread(() -> System.out.println("再来一个线程")).start();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`线程运行中...
再来一个线程`}
    />
    <Callout type="tip" title="Lambda 的本质">
      Lambda 是「<Text bold>一个匿名函数</Text>」的简写——只保留参数和方法体，
      把类名、方法名、返回类型等编译器能推断的统统省掉。它<Text bold>不是新建对象语法糖那么简单</Text>，
      但用起来可以理解为「实现某个接口的那唯一一个方法」。
    </Callout>

    <Heading3>3. Lambda 的标准语法</Heading3>
    <CodeBlock
      language="text"
      title="语法结构"
      code={`(参数列表) -> { 方法体 }

  ┌─参数列表─┐  ┌─箭头─┐  ┌──方法体──┐
  (int a, int b)   ->     { return a + b; }

三部分：
  · 参数列表：对应要实现的那个抽象方法的参数（类型可省略）
  · ->      ：读作 "goes to"，分隔参数与方法体
  · 方法体   ：方法的实现逻辑`}
    />
    <CodeBlock
      title="各种形态的 Lambda"
      code={`import java.util.function.*;

public class LambdaForms {
    public static void main(String[] args) {
        // 无参，无返回值
        Runnable r = () -> System.out.println("hi");
        r.run();

        // 一个参数，无返回值
        Consumer<String> print = (String s) -> System.out.println("收到: " + s);
        print.accept("数据");

        // 两个参数，有返回值（方法体含多条语句要用 {} 和 return）
        BinaryOperator<Integer> add = (a, b) -> {
            int sum = a + b;
            return sum;
        };
        System.out.println("和: " + add.apply(3, 5));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`hi
收到: 数据
和: 8`}
    />

    <Heading3>4. 省略规则（让 Lambda 更短）</Heading3>
    <Paragraph>
      Lambda 在保证编译器能推断的前提下，可以进一步精简：
    </Paragraph>
    <Table
      head={['可省略的部分', '规则']}
      rows={[
        ['参数类型', '类型可由上下文推断，全部省略（不能只省一部分）'],
        ['参数的小括号', '当且仅当只有一个参数时，可省略 ()'],
        ['方法体的大括号', '方法体只有一条语句时，可省略 {} '],
        ['return 关键字', '方法体只有一条 return 语句时，省 {} 的同时也要省 return'],
      ]}
    />
    <CodeBlock
      title="逐步精简"
      code={`import java.util.function.Function;

public class Simplify {
    public static void main(String[] args) {
        // 完整写法
        Function<Integer, Integer> f1 = (Integer x) -> { return x * x; };

        // ① 省略参数类型
        Function<Integer, Integer> f2 = (x) -> { return x * x; };

        // ② 单参数省略小括号
        Function<Integer, Integer> f3 = x -> { return x * x; };

        // ③ 单语句省略 {} 和 return（最简）
        Function<Integer, Integer> f4 = x -> x * x;

        System.out.println(f4.apply(6));
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`36`} />
    <Callout type="warning" title="省略的两条注意">
      <UnorderedList>
        <ListItem>参数类型要省就<Text bold>全省</Text>，不能一个写类型一个不写。</ListItem>
        <ListItem>省 <InlineCode>{`{}`}</InlineCode> 时必须同时省 <InlineCode>return</InlineCode>；
        反之保留 <InlineCode>{`{}`}</InlineCode> 时若有返回值则必须写 <InlineCode>return</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5. Lambda 的使用前提</Heading3>
    <Callout type="danger" title="只能赋值给「函数式接口」">
      Lambda 不能随便用，它必须有一个明确的「目标类型」——即一个<Text bold>函数式接口</Text>
      （只有一个抽象方法的接口，下一节详讲）。因为 Lambda 本质是「实现那唯一的抽象方法」，
      编译器要靠这个接口推断参数类型、返回类型。<InlineCode>Runnable</InlineCode>、
      <InlineCode>Comparator</InlineCode> 都是函数式接口，所以能接收 Lambda。
    </Callout>

    <Heading3>6. Lambda vs 匿名内部类</Heading3>
    <Table
      head={['对比', '匿名内部类', 'Lambda']}
      rows={[
        ['适用接口', '任意接口/抽象类', '仅函数式接口（一个抽象方法）'],
        ['代码量', '多（模板代码）', '极简'],
        ['this 指向', '指向匿名类自己', '指向外部类（不创建新作用域）'],
        ['编译产物', '生成单独的 .class 文件', '不生成额外类文件（invokedynamic）'],
      ]}
    />

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>Lambda 是匿名函数的简写，专治匿名内部类的冗长。</ListItem>
        <ListItem>语法：<InlineCode>(参数) -&gt; {`{方法体}`}</InlineCode>，三部分。</ListItem>
        <ListItem>省略规则：参数类型可省、单参数省 ()、单语句省 <InlineCode>{`{}`}</InlineCode> 与 <InlineCode>return</InlineCode>（要省一起省）。</ListItem>
        <ListItem>Lambda 必须有目标类型——只能赋给<Text bold>函数式接口</Text>。</ListItem>
        <ListItem>与匿名内部类的关键区别：仅限函数式接口、更简洁、<InlineCode>this</InlineCode> 指向外部类。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：精简 Lambda"
      code={`把下面的 Lambda 精简到最简形式：
① (String s) -> { return s.length(); }
② (a, b) -> { return a + b; }
③ (x) -> { System.out.println(x); }
④ () -> { return 42; }`}
      answerCode={`答案：
① s -> s.length()          （省类型、省单参括号、省 {} 和 return）
② (a, b) -> a + b          （两个参数必须保留括号；省 {} 和 return）
③ x -> System.out.println(x)  （单参省括号；单语句省 {}；无返回值无需 return）
④ () -> 42                 （无参必须保留空括号；单 return 省 {} 和 return）

解析：核心三条——单参数省括号、单语句省大括号、省大括号必同时省 return。
      但「无参的 ()」和「多参数的 (a,b)」括号不能省。`}
    />

    <CodeBlock
      qa
      title="练习2：用 Lambda 改写匿名内部类"
      code={`// 把下面的匿名内部类改写成 Lambda。
import java.util.Arrays;
import java.util.Comparator;

public class Test {
    public static void main(String[] args) {
        Integer[] arr = {3, 1, 4, 1, 5};
        Arrays.sort(arr, new Comparator<Integer>() {
            @Override
            public int compare(Integer a, Integer b) {
                return b - a;   // 降序
            }
        });
        System.out.println(Arrays.toString(arr));
    }
}`}
      answerCode={`import java.util.Arrays;

public class Test {
    public static void main(String[] args) {
        Integer[] arr = {3, 1, 4, 1, 5};

        // Comparator 是函数式接口，匿名内部类可直接换成 Lambda
        Arrays.sort(arr, (a, b) -> b - a);   // 降序

        System.out.println(Arrays.toString(arr));
    }
}

/* 控制台输出：
[5, 4, 3, 1, 1]

解析：Comparator 只有一个抽象方法 compare，是函数式接口，所以能用 Lambda。
      (a, b) -> b - a 就是 compare 的实现（降序）。
      更稳妥可用 (a, b) -> Integer.compare(b, a) 防溢出（见包装类章节）。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：判断哪些能用 Lambda"
      code={`下列接口/类，哪些可以用 Lambda 实现？说明理由。
A: interface I1 { void run(); }
B: interface I2 { void a(); void b(); }
C: interface I3 { }
D: abstract class C1 { abstract void go(); }`}
      answerCode={`答案：只有 A 可以用 Lambda。

理由：Lambda 只能用于「函数式接口」——恰好有一个抽象方法的接口。
A: 有且仅有一个抽象方法 run() → 是函数式接口 → 可以用 Lambda。 ✓
B: 有两个抽象方法 a()、b() → 不是函数式接口 → 不能用 Lambda（编译器不知道实现哪个）。 ✗
C: 没有抽象方法 → 不是函数式接口 → 不能。 ✗
D: 是抽象类，不是接口 → Lambda 只支持接口 → 不能（只能用匿名内部类）。 ✗

解析：记住 Lambda 的硬性前提——目标必须是「单抽象方法的接口」。
      下一节会讲如何用 @FunctionalInterface 注解显式标记并校验函数式接口。`}
    />
  </article>
);

export default index;
