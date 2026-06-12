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
    <Title>Stream 中间操作</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        中间操作是 Stream 流水线的「加工车间」——每个都返回一个新的 Stream，因此可以
        <Text bold>链式叠加</Text>。本节系统讲解最常用的中间操作：筛选 <InlineCode>filter</InlineCode>、
        映射 <InlineCode>map</InlineCode>、排序 <InlineCode>sorted</InlineCode>、去重 <InlineCode>distinct</InlineCode>、
        截断 <InlineCode>limit/skip</InlineCode>、扁平化 <InlineCode>flatMap</InlineCode>，
        每个都配「输入→输出」演示。记住：它们都是<Text bold>惰性</Text>的，不写终结操作不会执行。
      </Paragraph>
    </Callout>

    <Heading3>1. 中间操作一览</Heading3>
    <Table
      head={['操作', '作用', '参数类型']}
      rows={[
        ['filter(predicate)', '保留满足条件的元素', 'Predicate'],
        ['map(function)', '把每个元素转换成另一个值', 'Function'],
        ['sorted() / sorted(cmp)', '排序（自然顺序 / 比较器）', 'Comparator（可选）'],
        ['distinct()', '去重（依赖 equals/hashCode）', '无'],
        ['limit(n)', '只取前 n 个', 'long'],
        ['skip(n)', '跳过前 n 个', 'long'],
        ['flatMap(function)', '把「流的流」压平成一个流', 'Function（返回 Stream）'],
        ['peek(consumer)', '查看元素（常用于调试）', 'Consumer'],
      ]}
    />

    <Heading3>2. filter：筛选</Heading3>
    <CodeBlock
      title="filter 保留满足条件的元素"
      code={`import java.util.*;
import java.util.stream.Collectors;

public class FilterDemo {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8);

        List<Integer> evens = nums.stream()
                .filter(n -> n % 2 == 0)        // 只留偶数
                .collect(Collectors.toList());
        System.out.println("偶数: " + evens);

        long count = nums.stream().filter(n -> n > 5).count();
        System.out.println("大于5的个数: " + count);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`偶数: [2, 4, 6, 8]
大于5的个数: 3`} />

    <Heading3>3. map：映射/转换</Heading3>
    <Paragraph>
      <InlineCode>map</InlineCode> 把每个元素「<Text bold>一对一</Text>」地转成另一个值（可以变类型），
      是最常用的中间操作之一：
    </Paragraph>
    <CodeBlock
      title="map 转换元素"
      code={`import java.util.*;
import java.util.stream.Collectors;

public class MapDemo {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("apple", "banana", "cherry");

        // String -> Integer：取每个单词的长度
        List<Integer> lengths = words.stream()
                .map(String::length)
                .collect(Collectors.toList());
        System.out.println("长度: " + lengths);

        // String -> String：转大写
        List<String> upper = words.stream()
                .map(String::toUpperCase)
                .collect(Collectors.toList());
        System.out.println("大写: " + upper);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`长度: [5, 6, 6]
大写: [APPLE, BANANA, CHERRY]`} />
    <Callout type="tip" title="map 与 filter 的区别">
      <InlineCode>filter</InlineCode> 改变元素的「<Text bold>数量</Text>」（挑出一部分），元素本身不变；
      <InlineCode>map</InlineCode> 改变元素的「<Text bold>内容/类型</Text>」（每个都换一个值），数量不变。
    </Callout>

    <Heading3>4. sorted：排序</Heading3>
    <CodeBlock
      title="sorted 自然排序与自定义排序"
      code={`import java.util.*;
import java.util.stream.Collectors;

public class SortedDemo {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(3, 1, 4, 1, 5, 9, 2);

        // 自然升序
        System.out.println(nums.stream().sorted().collect(Collectors.toList()));

        // 自定义降序
        System.out.println(nums.stream()
                .sorted((a, b) -> b - a)
                .collect(Collectors.toList()));

        // 按字符串长度排序
        List<String> words = Arrays.asList("ccc", "a", "bb");
        System.out.println(words.stream()
                .sorted(Comparator.comparingInt(String::length))
                .collect(Collectors.toList()));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`[1, 1, 2, 3, 4, 5, 9]
[9, 5, 4, 3, 2, 1, 1]
[a, bb, ccc]`}
    />

    <Heading3>5. distinct / limit / skip</Heading3>
    <CodeBlock
      title="去重、截断、跳过"
      code={`import java.util.*;
import java.util.stream.Collectors;

public class SliceDemo {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1, 1, 2, 3, 3, 4, 5, 6);

        // distinct 去重
        System.out.println("去重: " +
            nums.stream().distinct().collect(Collectors.toList()));

        // limit 取前 3 个
        System.out.println("前3个: " +
            nums.stream().distinct().limit(3).collect(Collectors.toList()));

        // skip 跳过前 2 个
        System.out.println("跳过前2: " +
            nums.stream().distinct().skip(2).collect(Collectors.toList()));

        // 组合：分页效果（跳过2个，取2个）
        System.out.println("分页: " +
            nums.stream().distinct().skip(2).limit(2).collect(Collectors.toList()));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`去重: [1, 2, 3, 4, 5, 6]
前3个: [1, 2, 3]
跳过前2: [3, 4, 5, 6]
分页: [3, 4]`}
    />
    <Callout type="warning" title="distinct 去自定义对象的重，需重写 equals/hashCode">
      <InlineCode>distinct</InlineCode> 判断重复用的是元素的 <InlineCode>equals</InlineCode>/<InlineCode>hashCode</InlineCode>。
      对 String、Integer 等没问题；但对<Text bold>自定义对象</Text>，若没重写这两个方法，
      «内容相同»的对象不会被去重（参见「Object 类」章节）。
    </Callout>

    <Heading3>6. flatMap：扁平化「流的流」</Heading3>
    <Paragraph>
      当每个元素本身又是一个集合/数组时，<InlineCode>map</InlineCode> 会得到「流的流」，
      用 <InlineCode>flatMap</InlineCode> 把它们<Text bold>压平成一个流</Text>：
    </Paragraph>
    <CodeBlock
      title="flatMap 压平嵌套结构"
      code={`import java.util.*;
import java.util.stream.Collectors;

public class FlatMapDemo {
    public static void main(String[] args) {
        // 每个元素是一个 List —— 想把所有元素汇成一个列表
        List<List<Integer>> nested = Arrays.asList(
                Arrays.asList(1, 2),
                Arrays.asList(3, 4),
                Arrays.asList(5));

        List<Integer> flat = nested.stream()
                .flatMap(list -> list.stream())   // 每个子 List 变成流，再压平
                .collect(Collectors.toList());
        System.out.println("压平后: " + flat);

        // 把多个句子拆成所有单词
        List<String> sentences = Arrays.asList("hello world", "java stream");
        List<String> words = sentences.stream()
                .flatMap(s -> Arrays.stream(s.split(" ")))
                .collect(Collectors.toList());
        System.out.println("所有单词: " + words);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`压平后: [1, 2, 3, 4, 5]
所有单词: [hello, world, java, stream]`}
    />
    <Callout type="tip" title="map vs flatMap">
      <InlineCode>map</InlineCode>：一个元素 → 一个元素。
      <InlineCode>flatMap</InlineCode>：一个元素 → 一个<Text bold>流</Text>（多个元素），最后合并成一个流。
      凡是「嵌套集合想拍平」「一拆多」的场景就用 flatMap。
    </Callout>

    <Heading3>7. 链式组合</Heading3>
    <CodeBlock
      title="多个中间操作链式叠加"
      code={`import java.util.*;
import java.util.stream.Collectors;

public class ChainDemo {
    public static void main(String[] args) {
        List<String> names = Arrays.asList(
                "tom", "jerry", "tom", "alice", "bob", "jerry");

        List<String> result = names.stream()
                .distinct()                          // 去重
                .filter(s -> s.length() >= 3)        // 长度>=3
                .map(String::toUpperCase)            // 转大写
                .sorted()                            // 排序
                .collect(Collectors.toList());

        System.out.println(result);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`[ALICE, JERRY, TOM]`} />

    <Heading3>8. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>中间操作都返回新 Stream，可链式叠加，且都<Text bold>惰性</Text>。</ListItem>
        <ListItem><InlineCode>filter</InlineCode> 改数量、<InlineCode>map</InlineCode> 改内容；<InlineCode>map</InlineCode> 一对一，<InlineCode>flatMap</InlineCode> 一对多并压平。</ListItem>
        <ListItem><InlineCode>sorted</InlineCode> 排序、<InlineCode>distinct</InlineCode> 去重（靠 equals/hashCode）。</ListItem>
        <ListItem><InlineCode>limit</InlineCode>/<InlineCode>skip</InlineCode> 组合可做分页。</ListItem>
        <ListItem><InlineCode>peek</InlineCode> 用于调试观察，不改变元素。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>9. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测输出"
      code={`List<Integer> list = Arrays.asList(5, 3, 5, 1, 2, 3, 4);
List<Integer> r = list.stream()
    .distinct()
    .filter(n -> n > 2)
    .sorted()
    .limit(2)
    .collect(Collectors.toList());
System.out.println(r);

问：r 是什么？逐步分析。`}
      answerCode={`答案：[3, 4]

逐步分析：
原始:      [5, 3, 5, 1, 2, 3, 4]
distinct:  [5, 3, 1, 2, 4]        （去掉重复的 5 和 3）
filter>2:  [5, 3, 4]              （只留大于2的）
sorted:    [3, 4, 5]              （升序）
limit(2):  [3, 4]                 （取前2个）

解析：中间操作按书写顺序依次作用，理清每一步的中间结果是读懂 Stream 的关键。
      注意操作顺序会影响结果（先 sorted 再 limit 取的是最小的两个）。`}
    />

    <CodeBlock
      qa
      title="练习2：提取并处理数据"
      code={`// 给定员工列表（姓名+部门+薪资），用 Stream 完成：
// 找出「技术部」员工，按薪资降序，取出他们的姓名列表。
import java.util.*;
import java.util.stream.Collectors;

class Emp {
    String name, dept; int salary;
    Emp(String name, String dept, int salary){ this.name=name; this.dept=dept; this.salary=salary; }
}

public class Test {
    public static void main(String[] args) {
        List<Emp> emps = Arrays.asList(
            new Emp("张三","技术部",15000),
            new Emp("李四","市场部",12000),
            new Emp("王五","技术部",18000),
            new Emp("赵六","技术部",13000));
        // 补全：技术部 -> 按薪资降序 -> 取姓名
        // 预期输出：[王五, 张三, 赵六]
    }
}`}
      answerCode={`import java.util.*;
import java.util.stream.Collectors;

class Emp {
    String name, dept; int salary;
    Emp(String name, String dept, int salary){ this.name=name; this.dept=dept; this.salary=salary; }
}

public class Test {
    public static void main(String[] args) {
        List<Emp> emps = Arrays.asList(
            new Emp("张三","技术部",15000),
            new Emp("李四","市场部",12000),
            new Emp("王五","技术部",18000),
            new Emp("赵六","技术部",13000));

        List<String> result = emps.stream()
                .filter(e -> e.dept.equals("技术部"))             // 筛技术部
                .sorted((a, b) -> b.salary - a.salary)            // 薪资降序
                .map(e -> e.name)                                 // 取姓名
                .collect(Collectors.toList());

        System.out.println(result);
    }
}

/* 控制台输出：
[王五, 张三, 赵六]

解析：filter 筛部门 → sorted 按薪资降序（18000>15000>13000）→ map 抽取姓名。
      这种「筛选-排序-映射-收集」的链式处理，是 Stream 在业务开发中最典型的用法。
      排序也可写 .sorted(Comparator.comparingInt((Emp e)->e.salary).reversed())。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：flatMap 统计所有标签"
      code={`// 每篇文章有多个标签，求所有文章去重后的全部标签（排序）。
// 文章标签：["java","web"]、["web","db"]、["java","db","cache"]
// 预期输出：[cache, db, java, web]

import java.util.*;
import java.util.stream.Collectors;

public class Test {
    public static void main(String[] args) {
        List<List<String>> articleTags = Arrays.asList(
            Arrays.asList("java","web"),
            Arrays.asList("web","db"),
            Arrays.asList("java","db","cache"));
        // 补全
    }
}`}
      answerCode={`import java.util.*;
import java.util.stream.Collectors;

public class Test {
    public static void main(String[] args) {
        List<List<String>> articleTags = Arrays.asList(
            Arrays.asList("java","web"),
            Arrays.asList("web","db"),
            Arrays.asList("java","db","cache"));

        List<String> allTags = articleTags.stream()
                .flatMap(List::stream)     // 把每篇的标签列表压平成一个标签流
                .distinct()                // 去重
                .sorted()                  // 排序
                .collect(Collectors.toList());

        System.out.println(allTags);
    }
}

/* 控制台输出：
[cache, db, java, web]

解析：每个元素是 List<String>，flatMap(List::stream) 把它们全部展开合并成一个 String 流，
      再 distinct 去重、sorted 排序。这是 flatMap「一对多并压平」的经典应用——
      处理「集合的集合」时的标准手法。
*/`}
    />
  </article>
);

export default index;
