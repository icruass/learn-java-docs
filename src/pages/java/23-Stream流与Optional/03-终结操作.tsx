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
    <Title>Stream 终结操作</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        终结操作是流水线的「出口」——它<Text bold>触发整条流执行</Text>并产生最终结果
        （一个值、一个集合，或一个副作用），之后流就用完了。本节讲解最常用的终结操作：
        遍历 <InlineCode>forEach</InlineCode>、计数 <InlineCode>count</InlineCode>、
        匹配 <InlineCode>anyMatch/allMatch</InlineCode>、查找 <InlineCode>findFirst</InlineCode>、
        归约 <InlineCode>reduce</InlineCode>，以及最重要的<Text bold>收集 collect</Text>
        （配合 <InlineCode>Collectors</InlineCode> 转成 List/Map/分组/拼接）。
      </Paragraph>
    </Callout>

    <Heading3>1. 终结操作一览</Heading3>
    <Table
      head={['操作', '作用', '返回']}
      rows={[
        ['forEach(consumer)', '逐个消费（如打印）', 'void'],
        ['count()', '统计元素个数', 'long'],
        ['collect(collector)', '收集成 List/Set/Map 等', '集合等'],
        ['reduce(...)', '归约（累加/累乘/拼接等）', '值 / Optional'],
        ['anyMatch / allMatch / noneMatch', '匹配判断', 'boolean'],
        ['findFirst / findAny', '查找元素', 'Optional'],
        ['min / max', '求最值', 'Optional'],
        ['toArray()', '转成数组', '数组'],
      ]}
    />
    <Callout type="warning" title="终结操作只能有一个，且会消费流">
      一条流水线<Text bold>必须以一个终结操作结尾</Text>才会执行；执行后流即失效，
      不能再接其它操作。常见 <InlineCode>min/max/findFirst</InlineCode> 返回的是
      <InlineCode>Optional</InlineCode>（可能没有元素），下一节专门讲它。
    </Callout>

    <Heading3>2. forEach 与 count</Heading3>
    <CodeBlock
      title="遍历与计数"
      code={`import java.util.*;

public class ForEachCount {
    public static void main(String[] args) {
        List<String> list = Arrays.asList("a", "b", "c", "d");

        // forEach 遍历
        list.stream().forEach(s -> System.out.print(s + " "));
        System.out.println();

        // count 统计（配合 filter 统计满足条件的个数）
        long n = list.stream().filter(s -> s.compareTo("b") >= 0).count();
        System.out.println("不小于 b 的个数: " + n);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`a b c d
不小于 b 的个数: 3`} />

    <Heading3>3. 匹配与查找</Heading3>
    <CodeBlock
      title="anyMatch / allMatch / findFirst"
      code={`import java.util.*;

public class MatchFind {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(2, 4, 6, 7, 8);

        // anyMatch：是否存在满足条件的
        System.out.println("有奇数吗? " + nums.stream().anyMatch(n -> n % 2 != 0));
        // allMatch：是否全部满足
        System.out.println("全是偶数吗? " + nums.stream().allMatch(n -> n % 2 == 0));
        // noneMatch：是否一个都不满足
        System.out.println("没有负数吗? " + nums.stream().noneMatch(n -> n < 0));

        // findFirst：找第一个满足条件的（返回 Optional）
        Optional<Integer> first = nums.stream().filter(n -> n > 5).findFirst();
        System.out.println("第一个大于5的: " + first.get());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`有奇数吗? true
全是偶数吗? false
没有负数吗? true
第一个大于5的: 6`}
    />
    <Callout type="tip" title="匹配操作是「短路」的">
      <InlineCode>anyMatch</InlineCode> 一旦找到满足的就立即返回 true（不再遍历剩余），
      <InlineCode>allMatch</InlineCode> 一旦发现不满足就返回 false。这种短路特性对大数据流是重要的性能优化。
    </Callout>

    <Heading3>4. min / max</Heading3>
    <CodeBlock
      title="求最值（需要比较器）"
      code={`import java.util.*;

public class MinMax {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(3, 9, 1, 7, 5);

        Optional<Integer> max = nums.stream().max(Comparator.naturalOrder());
        Optional<Integer> min = nums.stream().min(Comparator.naturalOrder());
        System.out.println("最大: " + max.get() + ", 最小: " + min.get());

        // 按字符串长度求最长
        List<String> words = Arrays.asList("a", "ccc", "bb");
        String longest = words.stream()
                .max(Comparator.comparingInt(String::length))
                .get();
        System.out.println("最长: " + longest);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`最大: 9, 最小: 1
最长: ccc`}
    />

    <Heading3>5. reduce：归约</Heading3>
    <Paragraph>
      <InlineCode>reduce</InlineCode> 把流中所有元素「<Text bold>两两合并</Text>」成一个结果，
      用于求和、求积、拼接等聚合：
    </Paragraph>
    <CodeBlock
      title="reduce 归约"
      code={`import java.util.*;

public class ReduceDemo {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);

        // 带初始值：从 0 开始累加，结果一定有值（返回 int）
        int sum = nums.stream().reduce(0, (a, b) -> a + b);
        System.out.println("求和: " + sum);

        // 求积
        int product = nums.stream().reduce(1, (a, b) -> a * b);
        System.out.println("求积: " + product);

        // 不带初始值：返回 Optional（流可能为空）
        Optional<Integer> max = nums.stream().reduce((a, b) -> a > b ? a : b);
        System.out.println("最大: " + max.get());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`求和: 15
求积: 120
最大: 5`}
    />
    <Callout type="tip" title="reduce 的两个版本">
      <UnorderedList>
        <ListItem>带初始值 <InlineCode>reduce(初值, 累加器)</InlineCode>：返回普通值，流为空时返回初值。</ListItem>
        <ListItem>不带初始值 <InlineCode>reduce(累加器)</InlineCode>：返回 <InlineCode>Optional</InlineCode>（因为流可能为空，没有结果）。</ListItem>
      </UnorderedList>
      简单求和求平均更推荐用 <InlineCode>IntStream.sum()/average()</InlineCode>，更直观。
    </Callout>

    <Heading3>6. collect：收集（最重要）</Heading3>
    <Paragraph>
      <InlineCode>collect</InlineCode> 配合 <InlineCode>Collectors</InlineCode> 工具类，
      能把流收集成各种结果，是终结操作里最强大、最常用的：
    </Paragraph>
    <Table
      head={['Collectors 方法', '作用']}
      rows={[
        ['toList() / toSet()', '收集成 List / Set'],
        ['toMap(k, v)', '收集成 Map'],
        ['joining(分隔符)', '把字符串流拼接'],
        ['groupingBy(分类函数)', '按某属性分组成 Map<K, List<V>>'],
        ['counting()', '配合分组统计每组数量'],
        ['summingInt / averagingInt', '求和 / 求平均'],
      ]}
    />
    <CodeBlock
      title="collect 各种用法"
      code={`import java.util.*;
import java.util.stream.Collectors;

public class CollectDemo {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("张三", "李四", "王五", "李雷");

        // ① 收集成 List
        List<String> list = names.stream()
                .filter(s -> s.startsWith("李"))
                .collect(Collectors.toList());
        System.out.println("姓李: " + list);

        // ② joining 拼接
        String joined = names.stream().collect(Collectors.joining(", ", "[", "]"));
        System.out.println("拼接: " + joined);

        // ③ groupingBy 分组：按姓氏（首字符）分组
        Map<Character, List<String>> byFirst = names.stream()
                .collect(Collectors.groupingBy(s -> s.charAt(0)));
        System.out.println("按姓分组: " + byFirst);

        // ④ 分组计数
        Map<Character, Long> countByFirst = names.stream()
                .collect(Collectors.groupingBy(s -> s.charAt(0), Collectors.counting()));
        System.out.println("各姓人数: " + countByFirst);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`姓李: [李四, 李雷]
拼接: [张三, 李四, 王五, 李雷]
按姓分组: {王=[王五], 张=[张三], 李=[李四, 李雷]}
各姓人数: {王=1, 张=1, 李=2}`}
    />
    <Callout type="warning" title="toMap 遇到重复 key 会抛异常">
      <InlineCode>Collectors.toMap(k, v)</InlineCode> 若出现<Text bold>重复 key</Text>会抛
      <InlineCode>IllegalStateException</InlineCode>。需要处理冲突时用三参版本
      <InlineCode>toMap(k, v, (old, new) -&gt; new)</InlineCode> 指定合并策略。
    </Callout>

    <Heading3>7. 综合示例</Heading3>
    <CodeBlock
      title="一条流水线完成统计"
      code={`import java.util.*;
import java.util.stream.Collectors;

public class Summary {
    public static void main(String[] args) {
        List<Integer> scores = Arrays.asList(88, 92, 76, 65, 90, 58);

        // 及格(>=60)人数、平均分、最高分一次算出
        long passCount = scores.stream().filter(s -> s >= 60).count();
        double avg = scores.stream().mapToInt(Integer::intValue).average().orElse(0);
        int max = scores.stream().max(Comparator.naturalOrder()).orElse(0);

        System.out.println("及格人数: " + passCount);
        System.out.printf("平均分: %.1f%n", avg);
        System.out.println("最高分: " + max);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`及格人数: 5
平均分: 78.2
最高分: 92`}
    />

    <Heading3>8. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>终结操作触发流执行并产生结果，<Text bold>一条流水线只能有一个</Text>。</ListItem>
        <ListItem><InlineCode>forEach</InlineCode> 遍历、<InlineCode>count</InlineCode> 计数、<InlineCode>anyMatch/allMatch</InlineCode> 匹配（短路）、<InlineCode>findFirst/min/max</InlineCode> 返回 Optional。</ListItem>
        <ListItem><InlineCode>reduce</InlineCode> 归约：带初值返回值、不带初值返回 Optional。</ListItem>
        <ListItem><InlineCode>collect</InlineCode> + <InlineCode>Collectors</InlineCode> 最强大：<InlineCode>toList/toMap/joining/groupingBy/counting</InlineCode>。</ListItem>
        <ListItem><InlineCode>toMap</InlineCode> 重复 key 会异常，需提供合并函数。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>9. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：选择合适的终结操作"
      code={`为下列需求选择终结操作：
① 判断列表里是否「存在」一个负数。
② 把所有用户名用「,」拼成一个字符串。
③ 按城市把用户分组成 Map<城市, List<用户>>。
④ 计算所有订单金额的总和。`}
      answerCode={`答案：
① anyMatch(n -> n < 0)              —— 存在性判断，短路
② collect(Collectors.joining(","))  —— 字符串拼接
③ collect(Collectors.groupingBy(User::getCity))  —— 分组
④ mapToInt(Order::getAmount).sum()  （或 reduce / Collectors.summingInt）—— 求和

解析：存在性→anyMatch；拼接→joining；分组→groupingBy；求和优先用 IntStream.sum。
      选对终结操作能让代码既简洁又表意清晰。`}
    />

    <CodeBlock
      qa
      title="练习2：分组统计词频"
      code={`// 统计单词列表中每个单词出现的次数，结果为 Map<String, Long>。
// 输入: ["a","b","a","c","b","a"]
// 预期输出（顺序可能不同）：{a=3, b=2, c=1}

import java.util.*;
import java.util.stream.Collectors;

public class Test {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("a","b","a","c","b","a");
        // 补全
    }
}`}
      answerCode={`import java.util.*;
import java.util.stream.Collectors;

public class Test {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("a","b","a","c","b","a");

        Map<String, Long> freq = words.stream()
                .collect(Collectors.groupingBy(
                        w -> w,                 // 按单词本身分组
                        Collectors.counting()   // 每组统计数量
                ));

        System.out.println(freq);
    }
}

/* 控制台输出：
{a=3, b=2, c=1}

解析：groupingBy(分类函数, 下游收集器) 是经典组合——
      第一个参数决定「按什么分组」，第二个 counting() 统计每组个数。
      这比手写 Map + getOrDefault 循环更声明式。若想保证顺序可用 groupingBy(..., LinkedHashMap::new, counting())。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：用 reduce 拼接与求最值"
      code={`// 用 reduce（不要用 IntStream.sum/max）完成：
// ① 把 ["Hello","World","Java"] 用空格拼成一句话
// ② 求 [3,7,2,9,4] 中的最大值
import java.util.*;

public class Test {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("Hello","World","Java");
        List<Integer> nums = Arrays.asList(3,7,2,9,4);
        // 补全
    }
}`}
      answerCode={`import java.util.*;

public class Test {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("Hello","World","Java");
        List<Integer> nums = Arrays.asList(3,7,2,9,4);

        // ① 拼接：带初始值 ""，两两拼接
        String sentence = words.stream()
                .reduce("", (a, b) -> a.isEmpty() ? b : a + " " + b);
        System.out.println(sentence);

        // ② 求最大值：不带初始值，返回 Optional
        Optional<Integer> max = nums.stream().reduce((a, b) -> a > b ? a : b);
        System.out.println("最大: " + max.get());
    }
}

/* 控制台输出：
Hello World Java
最大: 9

解析：
① reduce 把元素两两合并。判断 a.isEmpty() 避免开头多一个空格（初值是 ""）。
   实际拼接更推荐 Collectors.joining(" ")，这里为练习 reduce。
② 不带初值的 reduce 返回 Optional（空流时无结果）。两两比较保留较大者，得到最大值 9。
*/`}
    />
  </article>
);

export default index;
