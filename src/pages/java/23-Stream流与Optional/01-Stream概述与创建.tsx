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
    <Title>Stream 流概述与创建</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Stream（流）是 JDK8 处理集合数据的「神器」，它把「<Text bold>遍历 + 筛选 + 转换 + 统计</Text>」
        从一堆 for 循环变成一条<Text bold>声明式的流水线</Text>。本节先用对比感受 Stream 的威力，
        讲清它的三段式结构（创建 → 中间操作 → 终结操作）和「惰性求值」「不修改源」等核心特性，
        再系统讲解如何从集合、数组等<Text bold>创建 Stream</Text>。
      </Paragraph>
    </Callout>

    <Heading3>1. 先感受一下：传统循环 vs Stream</Heading3>
    <Paragraph>
      需求：从一组名字中，挑出以「张」开头的，转成大写，按字典序排序，收集成新列表。
    </Paragraph>
    <CodeBlock
      title="传统写法"
      code={`import java.util.*;

public class OldWay {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("张三", "李四", "张伟", "王五");
        List<String> result = new ArrayList<>();
        for (String name : names) {
            if (name.startsWith("张")) {        // 筛选
                result.add(name.toUpperCase());  // 转换
            }
        }
        Collections.sort(result);                // 排序
        System.out.println(result);
    }
}`}
    />
    <CodeBlock
      title="Stream 写法"
      code={`import java.util.*;
import java.util.stream.Collectors;

public class StreamWay {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("张三", "李四", "张伟", "王五");

        List<String> result = names.stream()
                .filter(name -> name.startsWith("张"))   // 筛选
                .map(String::toUpperCase)                // 转换
                .sorted()                                // 排序
                .collect(Collectors.toList());           // 收集

        System.out.println(result);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（两种写法相同）" code={`[张三, 张伟]`} />
    <Callout type="tip" title="Stream 的价值：声明式、可读、可链式">
      Stream 把「怎么做（how）」的循环细节隐藏，让你只描述「做什么（what）」：筛选、映射、排序、收集。
      代码像读句子一样自然，且每一步职责单一、易组合。
    </Callout>

    <Heading3>2. Stream 的三段式结构</Heading3>
    <CodeBlock
      language="text"
      title="一条 Stream 流水线"
      code={`数据源.stream()                    ← ① 创建：获取 Stream
      .filter(...)                 ← ② 中间操作：可以有 0~多个
      .map(...)                    ←    （返回新 Stream，可链式）
      .collect(...);               ← ③ 终结操作：有且仅有一个，触发执行`}
    />
    <Table
      head={['阶段', '作用', '返回', '能否多次']}
      rows={[
        ['创建', '从集合/数组等得到 Stream', 'Stream', '一次'],
        ['中间操作', 'filter/map/sorted 等加工', '新的 Stream', '可 0 到多个'],
        ['终结操作', 'collect/forEach/count 等', '结果/副作用（非 Stream）', '有且仅有一个'],
      ]}
    />

    <Heading3>3. 三大核心特性</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>不修改数据源。</Text>Stream 操作不会改变原集合，<InlineCode>filter</InlineCode> 等都返回新流。
      </ListItem>
      <ListItem>
        <Text bold>惰性求值（lazy）。</Text>中间操作不会立即执行，只有遇到<Text bold>终结操作</Text>才真正运行——
        没有终结操作，中间操作里的代码一行都不会跑。
      </ListItem>
      <ListItem>
        <Text bold>一次性。</Text>一个 Stream 被终结操作消费后就「用完了」，不能再次使用，否则抛
        <InlineCode>IllegalStateException</InlineCode>。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      title="验证「惰性」与「一次性」"
      code={`import java.util.*;
import java.util.stream.Stream;

public class StreamFeatures {
    public static void main(String[] args) {
        // 惰性：只有中间操作，没有终结操作 —— peek 里的打印不会执行
        Stream.of("a", "b", "c")
              .peek(s -> System.out.println("看到: " + s));  // 无终结操作
        System.out.println("上面的 peek 没有任何输出（惰性）");

        System.out.println("---");

        // 一次性：流被消费后不能再用
        Stream<String> stream = Stream.of("x", "y");
        stream.forEach(System.out::println);   // 第一次：正常
        try {
            stream.count();                     // 再次使用 -> 异常
        } catch (IllegalStateException e) {
            System.out.println("流已被消费，不能重复使用");
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`上面的 peek 没有任何输出（惰性）
---
x
y
流已被消费，不能重复使用`}
    />

    <Heading3>4. 创建 Stream 的常见方式</Heading3>
    <Table
      head={['来源', '创建方式']}
      rows={[
        ['集合 Collection', 'collection.stream()'],
        ['数组', 'Arrays.stream(arr)'],
        ['一组零散值', 'Stream.of(a, b, c)'],
        ['Map', '先 map.entrySet().stream() / keySet().stream()'],
        ['数值范围', 'IntStream.range(1, 10) / rangeClosed(1, 10)'],
        ['无限流（少用）', 'Stream.iterate / Stream.generate（需配 limit）'],
      ]}
    />
    <CodeBlock
      title="各种创建方式"
      code={`import java.util.*;
import java.util.stream.*;

public class CreateStream {
    public static void main(String[] args) {
        // ① 集合
        List<String> list = Arrays.asList("a", "b", "c");
        list.stream().forEach(System.out::print);    // abc
        System.out.println();

        // ② 数组
        int[] nums = {1, 2, 3};
        System.out.println("数组求和: " + Arrays.stream(nums).sum());

        // ③ 零散值
        Stream.of("x", "y", "z").forEach(System.out::print);  // xyz
        System.out.println();

        // ④ 数值范围（rangeClosed 含右端）
        int sum = IntStream.rangeClosed(1, 100).sum();
        System.out.println("1到100之和: " + sum);

        // ⑤ Map：通过 entrySet
        Map<String, Integer> map = new HashMap<>();
        map.put("张三", 90);
        map.put("李四", 85);
        map.entrySet().stream()
           .forEach(e -> System.out.println(e.getKey() + "=" + e.getValue()));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（HashMap 顺序可能不同）"
      code={`abc
数组求和: 6
xyz
1到100之和: 5050
张三=90
李四=85`}
    />
    <Callout type="tip" title="基本类型用 IntStream/LongStream/DoubleStream">
      针对 int/long/double 有专门的 <InlineCode>IntStream</InlineCode> 等，提供 <InlineCode>sum()</InlineCode>、
      <InlineCode>average()</InlineCode>、<InlineCode>max()</InlineCode> 等数值专属方法，
      还能避免装箱拆箱的开销。求和求平均时优先用它们。
    </Callout>

    <Heading3>5. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>Stream 把集合处理写成声明式流水线：<Text bold>创建 → 中间操作（多个）→ 终结操作（一个）</Text>。</ListItem>
        <ListItem>三大特性：<Text bold>不改源数据、惰性求值（无终结操作不执行）、一次性（用完即废）</Text>。</ListItem>
        <ListItem>创建：集合 <InlineCode>.stream()</InlineCode>、<InlineCode>Arrays.stream</InlineCode>、<InlineCode>Stream.of</InlineCode>、<InlineCode>IntStream.range</InlineCode>。</ListItem>
        <ListItem>数值计算用 <InlineCode>IntStream/LongStream/DoubleStream</InlineCode>，有 sum/average 等专属方法。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断对错"
      code={`① 中间操作 filter 会立即执行并返回结果。
② 一个 Stream 可以被多次终结操作消费。
③ Stream 操作会修改原始集合。
④ 一条 Stream 流水线可以有多个中间操作，但只能有一个终结操作。`}
      answerCode={`答案：
① 错。中间操作是惰性的，返回新 Stream，只有遇到终结操作才真正执行。
② 错。Stream 是一次性的，被终结操作消费后再用会抛 IllegalStateException。
③ 错。Stream 不修改源数据，所有操作都产生新流/新结果。
④ 对。中间操作可链式叠加多个，终结操作有且仅有一个（它触发整条流水线执行）。`}
    />

    <CodeBlock
      qa
      title="练习2：多种方式创建并求和"
      code={`// 分别用三种方式求 1~10 的和：
// ① 用 IntStream.rangeClosed
// ② 用 Arrays.stream 对数组 {1..10}
// ③ 用 Stream.of(整数) 然后 mapToInt
// 都应输出 55

import java.util.*;
import java.util.stream.*;

public class Test {
    public static void main(String[] args) {
        // 补全三种
    }
}`}
      answerCode={`import java.util.*;
import java.util.stream.*;

public class Test {
    public static void main(String[] args) {
        // ① IntStream.rangeClosed（含右端 10）
        int s1 = IntStream.rangeClosed(1, 10).sum();

        // ② Arrays.stream
        int[] arr = {1,2,3,4,5,6,7,8,9,10};
        int s2 = Arrays.stream(arr).sum();

        // ③ Stream.of + mapToInt（把 Stream<Integer> 转成 IntStream 才有 sum）
        int s3 = Stream.of(1,2,3,4,5,6,7,8,9,10)
                       .mapToInt(Integer::intValue)
                       .sum();

        System.out.println(s1 + " " + s2 + " " + s3);
    }
}

/* 控制台输出：
55 55 55

解析：sum() 是 IntStream 的方法，所以 Stream<Integer> 要先 mapToInt 转成 IntStream。
      rangeClosed(1,10) 含 10；range(1,10) 不含 10（只到 9）——注意区别。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：解释惰性求值"
      code={`import java.util.stream.Stream;

public class Test {
    public static void main(String[] args) {
        Stream<Integer> s = Stream.of(1, 2, 3)
            .filter(n -> {
                System.out.println("filter检查: " + n);
                return n > 1;
            });
        System.out.println("=== 还没调用终结操作 ===");
        long count = s.count();   // 终结操作
        System.out.println("个数: " + count);
    }
}

问：输出顺序是怎样的？为什么 filter 的打印在 "===" 之后？`}
      answerCode={`答案（输出顺序）：
=== 还没调用终结操作 ===
filter检查: 1
filter检查: 2
filter检查: 3
个数: 2

原因：filter 是中间操作，惰性——定义流水线时不执行。所以先打印 "=== 还没调用终结操作 ===”。
直到 count() 这个终结操作被调用，整条流水线才真正运行，filter 的检查这时才逐个执行。
最终大于 1 的元素是 2、3，count 为 2。

解析：这道题直观展示「惰性求值」——中间操作只是「记录要做什么」，终结操作才「真正开跑」。
      理解这点对调试 Stream（比如发现 peek/map 没执行）非常关键。`}
    />
  </article>
);

export default index;
