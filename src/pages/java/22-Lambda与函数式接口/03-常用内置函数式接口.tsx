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
    <Title>常用内置函数式接口</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        我们不必每次都自定义函数式接口——JDK8 在 <InlineCode>java.util.function</InlineCode> 包里
        预置了一批通用的函数式接口，覆盖了「消费、提供、转换、判断」四类最常见需求。
        本节讲透四大核心接口：<InlineCode>Supplier</InlineCode>、<InlineCode>Consumer</InlineCode>、
        <InlineCode>Function</InlineCode>、<InlineCode>Predicate</InlineCode>，
        以及它们的组合与变体。掌握它们，才能读懂和使用 Stream API。
      </Paragraph>
    </Callout>

    <Heading3>1. 四大核心接口总览</Heading3>
    <Table
      head={['接口', '抽象方法', '含义', '记忆']}
      rows={[
        ['Supplier<T>', 'T get()', '不要参数，提供一个 T', '生产者（供给）'],
        ['Consumer<T>', 'void accept(T t)', '消费一个 T，无返回', '消费者'],
        ['Function<T,R>', 'R apply(T t)', '把 T 转换成 R', '转换器（映射）'],
        ['Predicate<T>', 'boolean test(T t)', '判断 T 是否满足条件', '断言（判断）'],
      ]}
    />
    <Callout type="tip" title="按「有没有入参 / 有没有返回」记忆">
      <UnorderedList>
        <ListItem>无入参、有返回 → <InlineCode>Supplier</InlineCode>（凭空给一个值）</ListItem>
        <ListItem>有入参、无返回 → <InlineCode>Consumer</InlineCode>（拿来用掉）</ListItem>
        <ListItem>有入参、有返回 → <InlineCode>Function</InlineCode>（转换）</ListItem>
        <ListItem>有入参、返回 boolean → <InlineCode>Predicate</InlineCode>（判断）</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>2. Supplier&lt;T&gt;：供给者</Heading3>
    <CodeBlock
      title="SupplierDemo.java"
      code={`import java.util.function.Supplier;

public class SupplierDemo {
    public static void main(String[] args) {
        // 无参，返回一个值
        Supplier<String> greeting = () -> "Hello";
        System.out.println(greeting.get());

        // 常用于「延迟创建/惰性求值」
        Supplier<Double> randomSupplier = () -> Math.random();
        System.out.println("随机数: " + randomSupplier.get());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（随机数随运行不同）"
      code={`Hello
随机数: 0.7341...`}
    />

    <Heading3>3. Consumer&lt;T&gt;：消费者</Heading3>
    <Paragraph>
      接收一个值做处理，无返回。<InlineCode>forEach</InlineCode> 接收的就是它。
      还能用 <InlineCode>andThen</InlineCode> 串联两个消费动作：
    </Paragraph>
    <CodeBlock
      title="ConsumerDemo.java"
      code={`import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

public class ConsumerDemo {
    public static void main(String[] args) {
        Consumer<String> print = s -> System.out.println("打印: " + s);
        print.accept("数据A");

        // andThen：先执行前者，再执行后者
        Consumer<String> printLen = s -> System.out.println("长度: " + s.length());
        Consumer<String> combined = print.andThen(printLen);
        combined.accept("hello");

        // List.forEach 接收的就是 Consumer
        List<String> list = Arrays.asList("a", "b", "c");
        list.forEach(e -> System.out.print(e + " "));
        System.out.println();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`打印: 数据A
打印: hello
长度: 5
a b c`}
    />

    <Heading3>4. Function&lt;T, R&gt;：转换器</Heading3>
    <Paragraph>
      把类型 T 的输入转换成类型 R 的输出。可用 <InlineCode>andThen</InlineCode>/<InlineCode>compose</InlineCode>
      把多个转换串起来：
    </Paragraph>
    <CodeBlock
      title="FunctionDemo.java"
      code={`import java.util.function.Function;

public class FunctionDemo {
    public static void main(String[] args) {
        // String -> Integer：取长度
        Function<String, Integer> length = s -> s.length();
        System.out.println("长度: " + length.apply("hello"));

        // Integer -> Integer：平方
        Function<Integer, Integer> square = n -> n * n;

        // andThen：先 length 再 square（先执行调用者）
        Function<String, Integer> lenThenSquare = length.andThen(square);
        System.out.println("长度的平方: " + lenThenSquare.apply("hello")); // 5 -> 25

        // compose：先 square 再 length（先执行参数）—— 顺序相反
        // 这里类型需匹配，演示 andThen 即可
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`长度: 5
长度的平方: 25`}
    />
    <Callout type="warning" title="andThen 与 compose 的顺序">
      <InlineCode>f.andThen(g)</InlineCode>：先执行 f，再把结果给 g（f → g）。
      <InlineCode>f.compose(g)</InlineCode>：先执行 g，再把结果给 f（g → f）。
      记忆：<Text bold>andThen 顺着读，compose 倒着读</Text>。
    </Callout>

    <Heading3>5. Predicate&lt;T&gt;：断言</Heading3>
    <Paragraph>
      判断输入是否满足条件，返回 boolean。它支持 <InlineCode>and</InlineCode>、<InlineCode>or</InlineCode>、
      <InlineCode>negate</InlineCode> 组合多个条件，这正是 Stream <InlineCode>filter</InlineCode> 的参数类型：
    </Paragraph>
    <CodeBlock
      title="PredicateDemo.java"
      code={`import java.util.function.Predicate;

public class PredicateDemo {
    public static void main(String[] args) {
        Predicate<Integer> isPositive = n -> n > 0;
        Predicate<Integer> isEven = n -> n % 2 == 0;

        System.out.println("5 是正数? " + isPositive.test(5));

        // and：既是正数又是偶数
        Predicate<Integer> positiveEven = isPositive.and(isEven);
        System.out.println("6 正且偶? " + positiveEven.test(6));
        System.out.println("3 正且偶? " + positiveEven.test(3));

        // or / negate
        System.out.println("-2 正或偶? " + isPositive.or(isEven).test(-2));
        System.out.println("非正数(5)? " + isPositive.negate().test(5));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`5 是正数? true
6 正且偶? true
3 正且偶? false
-2 正或偶? true
非正数(5)? false`}
    />

    <Heading3>6. 其它常见变体</Heading3>
    <Table
      head={['接口', '说明']}
      rows={[
        ['BiFunction<T,U,R>', '接收两个参数 T、U，返回 R'],
        ['BinaryOperator<T>', '两个同类型 T 运算得 T（如 a+b），是 BiFunction 特例'],
        ['UnaryOperator<T>', '一个 T 转一个 T，是 Function<T,T> 特例'],
        ['BiConsumer<T,U>', '消费两个参数（Map.forEach 用它）'],
        ['IntPredicate / IntFunction...', '针对基本类型 int/long/double 的特化版，避免装箱'],
      ]}
    />
    <CodeBlock
      title="BiFunction 与 BinaryOperator"
      code={`import java.util.function.BiFunction;
import java.util.function.BinaryOperator;

public class BiDemo {
    public static void main(String[] args) {
        // 两个参数：拼接姓名和年龄
        BiFunction<String, Integer, String> info = (name, age) -> name + "(" + age + ")";
        System.out.println(info.apply("张三", 20));

        // BinaryOperator：两个同类型相加
        BinaryOperator<Integer> max = (a, b) -> a > b ? a : b;
        System.out.println("较大值: " + max.apply(3, 9));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`张三(20)
较大值: 9`}
    />

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>四大核心：<InlineCode>Supplier</InlineCode>（供给 get）、<InlineCode>Consumer</InlineCode>（消费 accept）、<InlineCode>Function</InlineCode>（转换 apply）、<InlineCode>Predicate</InlineCode>（判断 test）。</ListItem>
        <ListItem>按「有无入参 / 有无返回 / 返回是否 boolean」即可区分。</ListItem>
        <ListItem>可组合：<InlineCode>Consumer.andThen</InlineCode>、<InlineCode>Function.andThen/compose</InlineCode>、<InlineCode>Predicate.and/or/negate</InlineCode>。</ListItem>
        <ListItem>变体：<InlineCode>BiFunction</InlineCode>/<InlineCode>BinaryOperator</InlineCode>/<InlineCode>UnaryOperator</InlineCode>/基本类型特化版。</ListItem>
        <ListItem>这些接口是 Stream API 的基础：<InlineCode>filter</InlineCode> 收 Predicate、<InlineCode>map</InlineCode> 收 Function、<InlineCode>forEach</InlineCode> 收 Consumer。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：选对接口"
      code={`为下列需求选择合适的内置函数式接口：
① 不接收参数，随机生成一个 UUID 字符串。
② 接收一个订单对象，把它打印到日志（无返回）。
③ 接收一个字符串，返回它的大写形式。
④ 接收一个年龄，判断是否成年（>=18）。`}
      answerCode={`答案：
① Supplier<String>     —— 无入参、有返回，供给一个值
② Consumer<Order>      —— 有入参、无返回，消费掉
③ Function<String, String>（或 UnaryOperator<String>）—— 入参出参都是 String 的转换
④ Predicate<Integer>   —— 有入参、返回 boolean，做判断

解析：判断口诀——无参有返回=Supplier，有参无返回=Consumer，转换=Function，返回布尔=Predicate。`}
    />

    <CodeBlock
      qa
      title="练习2：组合 Predicate"
      code={`// 用 Predicate 的 and/or/negate 实现：
// 从 1~20 中筛选出「3 的倍数 且 不是偶数」的数（即只被3整除的奇数）。
// 预期输出：3 9 15

import java.util.function.Predicate;

public class Test {
    public static void main(String[] args) {
        Predicate<Integer> mul3 = n -> n % 3 == 0;
        Predicate<Integer> even = n -> n % 2 == 0;
        // 补全：组合出「是3的倍数 且 非偶数」的条件并筛选打印
    }
}`}
      answerCode={`import java.util.function.Predicate;

public class Test {
    public static void main(String[] args) {
        Predicate<Integer> mul3 = n -> n % 3 == 0;
        Predicate<Integer> even = n -> n % 2 == 0;

        // 3的倍数 且 不是偶数
        Predicate<Integer> target = mul3.and(even.negate());

        for (int i = 1; i <= 20; i++) {
            if (target.test(i)) {
                System.out.print(i + " ");
            }
        }
        System.out.println();
    }
}

/* 控制台输出：
3 9 15

解析：even.negate() 得到「不是偶数」，再用 mul3.and(...) 与「3的倍数」做与运算。
      1~20 中被3整除的有 3,6,9,12,15,18，其中奇数是 3,9,15。
      Predicate 的 and/or/negate 让复杂条件像搭积木一样组合，可读性远胜一长串 &&/||。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：用 Function 串联转换"
      code={`// 用 Function.andThen 把「去空格 -> 转大写 -> 加前缀[OK]」三步串成一个转换。
// 输入: "  hello  "
// 预期输出：[OK]HELLO

import java.util.function.Function;

public class Test {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.util.function.Function;

public class Test {
    public static void main(String[] args) {
        Function<String, String> trim = s -> s.trim();
        Function<String, String> upper = s -> s.toUpperCase();
        Function<String, String> prefix = s -> "[OK]" + s;

        // andThen 顺序执行：trim -> upper -> prefix
        Function<String, String> pipeline = trim.andThen(upper).andThen(prefix);

        System.out.println(pipeline.apply("  hello  "));
    }
}

/* 控制台输出：
[OK]HELLO

解析：andThen 把多个 Function 顺序串联成一条「处理流水线」：
      "  hello  " --trim--> "hello" --upper--> "HELLO" --prefix--> "[OK]HELLO"。
      这种「函数组合」思想正是 Stream 中 map().map() 链式调用的本质。
*/`}
    />
  </article>
);

export default index;
