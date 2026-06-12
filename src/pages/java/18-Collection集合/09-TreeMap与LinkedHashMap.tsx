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
    <Title>TreeMap 与 LinkedHashMap</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>HashMap</InlineCode> 键是无序的。当我们需要「键按顺序排列」或「保留插入顺序」时，
        就要用它的两个兄弟：基于红黑树、键自动排序的 <InlineCode>TreeMap</InlineCode>，
        和在哈希表上叠加双向链表、保留插入顺序的 <InlineCode>LinkedHashMap</InlineCode>。
        本节对比三种 Map 的特性，讲解 <InlineCode>TreeMap</InlineCode> 独有的导航方法，
        并演示它们各自的典型应用场景。
      </Paragraph>
    </Callout>

    <Heading3>1. 三种 Map 一图看懂</Heading3>
    <Table
      head={['实现类', '底层结构', '键的顺序', '性能', '允许 null 键']}
      rows={[
        ['HashMap', '哈希表(数组+链表/红黑树)', '无序', '增删查 O(1)', '允许一个'],
        ['LinkedHashMap', '哈希表 + 双向链表', '按插入顺序(或访问顺序)', '约 O(1)', '允许一个'],
        ['TreeMap', '红黑树', '按键自动排序', 'O(log n)', '不允许'],
      ]}
    />
    <Callout type="tip" title="三者是兄弟，方法用法完全一致">
      <InlineCode>put</InlineCode>、<InlineCode>get</InlineCode>、<InlineCode>remove</InlineCode>、
      <InlineCode>keySet</InlineCode>、<InlineCode>entrySet</InlineCode> 等 <InlineCode>Map</InlineCode> 接口方法
      三者通用，区别只在<Text bold>遍历时键的顺序</Text>和<Text bold>底层性能</Text>。
    </Callout>

    <Heading3>2. LinkedHashMap：保留插入顺序</Heading3>
    <Paragraph>
      <InlineCode>LinkedHashMap</InlineCode> 继承自 <InlineCode>HashMap</InlineCode>，
      额外用一条<Text bold>双向链表</Text>把所有键按插入先后串起来。因此遍历时顺序与 <InlineCode>put</InlineCode>
      的顺序完全一致——既有哈希表的快速存取，又有可预期的顺序。
    </Paragraph>
    <CodeBlock
      title="HashMap vs LinkedHashMap 顺序对比"
      code={`import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

public class OrderDemo {
    public static void main(String[] args) {
        // HashMap：顺序不可预期
        Map<String, Integer> hash = new HashMap<>();
        hash.put("banana", 1);
        hash.put("apple", 2);
        hash.put("cherry", 3);
        System.out.println("HashMap:       " + hash);

        // LinkedHashMap：严格保留插入顺序
        Map<String, Integer> linked = new LinkedHashMap<>();
        linked.put("banana", 1);
        linked.put("apple", 2);
        linked.put("cherry", 3);
        System.out.println("LinkedHashMap: " + linked);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（HashMap 顺序仅为示意，可能不同）"
      code={`HashMap:       {banana=1, cherry=3, apple=2}
LinkedHashMap: {banana=1, apple=2, cherry=3}`}
    />
    <Callout type="tip" title="LinkedHashMap 还能做 LRU 缓存">
      <InlineCode>LinkedHashMap</InlineCode> 构造方法的第三个参数 <InlineCode>accessOrder</InlineCode>
      传 <InlineCode>true</InlineCode> 时，会按「最近访问顺序」排列；
      再重写 <InlineCode>removeEldestEntry</InlineCode> 就能实现一个 LRU（最近最少使用）缓存。
      这是它一个很实用的高级用法，进阶时可深入。
    </Callout>

    <Heading3>3. TreeMap：键自动排序</Heading3>
    <Paragraph>
      <InlineCode>TreeMap</InlineCode> 底层红黑树，会把<Text bold>键</Text>按自然顺序（或传入的
      <InlineCode>Comparator</InlineCode>）排序。和 <InlineCode>TreeSet</InlineCode> 一样，
      键所属的类必须可比较（实现 <InlineCode>Comparable</InlineCode> 或提供 <InlineCode>Comparator</InlineCode>）。
    </Paragraph>
    <CodeBlock
      title="TreeMap 键自动排序"
      code={`import java.util.TreeMap;

public class TreeMapDemo {
    public static void main(String[] args) {
        TreeMap<String, Integer> map = new TreeMap<>();
        map.put("banana", 1);
        map.put("apple", 2);
        map.put("cherry", 3);
        // 键按字典序自动升序
        System.out.println("TreeMap: " + map);

        // 数字键也会自动升序
        TreeMap<Integer, String> scores = new TreeMap<>();
        scores.put(85, "张三");
        scores.put(92, "李四");
        scores.put(78, "王五");
        System.out.println("按分数升序: " + scores);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`TreeMap: {apple=2, banana=1, cherry=3}
按分数升序: {78=王五, 85=张三, 92=李四}`}
    />
    <CodeBlock
      title="自定义排序：键降序"
      code={`import java.util.TreeMap;
import java.util.Comparator;

public class TreeMapComparator {
    public static void main(String[] args) {
        // 传入比较器，让键按降序排列
        TreeMap<Integer, String> map = new TreeMap<>(Comparator.reverseOrder());
        map.put(85, "张三");
        map.put(92, "李四");
        map.put(78, "王五");
        System.out.println("按分数降序: " + map);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`按分数降序: {92=李四, 85=张三, 78=王五}`}
    />

    <Heading3>4. TreeMap 独有的导航方法</Heading3>
    <Paragraph>
      键有序，<InlineCode>TreeMap</InlineCode> 因此提供了一组按大小关系查找键值对的方法（来自 <InlineCode>NavigableMap</InlineCode>）：
    </Paragraph>
    <Table
      head={['方法', '功能']}
      rows={[
        ['firstKey() / lastKey()', '返回最小 / 最大的键'],
        ['firstEntry() / lastEntry()', '返回最小 / 最大键对应的整个键值对'],
        ['floorKey(k)', '返回 ≤ k 的最大键'],
        ['ceilingKey(k)', '返回 ≥ k 的最小键'],
        ['lowerKey(k) / higherKey(k)', '严格 < k 的最大键 / 严格 > k 的最小键'],
        ['headMap(k)', '返回所有键 < k 的子 Map'],
        ['tailMap(k)', '返回所有键 ≥ k 的子 Map'],
      ]}
    />
    <CodeBlock
      title="TreeMap 导航方法示例"
      code={`import java.util.TreeMap;

public class TreeMapNav {
    public static void main(String[] args) {
        TreeMap<Integer, String> map = new TreeMap<>();
        map.put(10, "A"); map.put(20, "B");
        map.put(30, "C"); map.put(40, "D");

        System.out.println("最小键 firstKey: " + map.firstKey());
        System.out.println("最大键 lastKey: " + map.lastKey());
        System.out.println("floorKey(25) ≤25最大键: " + map.floorKey(25));
        System.out.println("ceilingKey(25) ≥25最小键: " + map.ceilingKey(25));
        System.out.println("headMap(30) 键<30: " + map.headMap(30));
        System.out.println("tailMap(30) 键>=30: " + map.tailMap(30));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`最小键 firstKey: 10
最大键 lastKey: 40
floorKey(25) ≤25最大键: 20
ceilingKey(25) ≥25最小键: 30
headMap(30) 键<30: {10=A, 20=B}
tailMap(30) 键>=30: {30=C, 40=D}`}
    />
    <Callout type="tip" title="范围查询的典型场景">
      这类导航方法非常适合「按区间取数据」的需求，例如「查找成绩在 60~80 之间的所有同学」、
      「找出某时间点之前的所有日志」，用 <InlineCode>subMap(from, to)</InlineCode> 一步到位，
      这是 <InlineCode>HashMap</InlineCode> 做不到的。
    </Callout>

    <Heading3>5. 综合示例：统计字符出现次数并排序输出</Heading3>
    <Paragraph>
      下面用 <InlineCode>TreeMap</InlineCode> 统计字符串中各字符出现次数，结果天然按字符升序排列：
    </Paragraph>
    <CodeBlock
      title="CharCount.java"
      code={`import java.util.Map;
import java.util.TreeMap;

public class CharCount {
    public static void main(String[] args) {
        String text = "banana";
        TreeMap<Character, Integer> count = new TreeMap<>();

        for (char c : text.toCharArray()) {
            // getOrDefault：键不存在时返回默认值 0
            count.put(c, count.getOrDefault(c, 0) + 1);
        }

        // TreeMap 遍历时键自动升序
        for (Map.Entry<Character, Integer> e : count.entrySet()) {
            System.out.println(e.getKey() + " 出现 " + e.getValue() + " 次");
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`a 出现 3 次
b 出现 1 次
n 出现 2 次`}
    />

    <Heading3>6. 如何选择三种 Map</Heading3>
    <Table
      head={['需求', '推荐']}
      rows={[
        ['只要快速存取，不关心顺序', 'HashMap（默认首选）'],
        ['要保留键的插入顺序（如配置项、菜单顺序）', 'LinkedHashMap'],
        ['要键自动排序、或做范围查询', 'TreeMap'],
        ['要实现 LRU 缓存', 'LinkedHashMap（accessOrder=true）'],
      ]}
    />

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>三种 Map 用法相同，区别在键的顺序：<InlineCode>HashMap</InlineCode> 无序、<InlineCode>LinkedHashMap</InlineCode> 插入序、<InlineCode>TreeMap</InlineCode> 排序。</ListItem>
        <ListItem><InlineCode>LinkedHashMap</InlineCode> = 哈希表 + 双向链表，保留插入顺序，还可做 LRU 缓存。</ListItem>
        <ListItem><InlineCode>TreeMap</InlineCode> 底层红黑树，键必须可比较（Comparable 或 Comparator），不允许 null 键。</ListItem>
        <ListItem><InlineCode>TreeMap</InlineCode> 提供 <InlineCode>floorKey/ceilingKey/headMap/tailMap</InlineCode> 等范围查询方法。</ListItem>
        <ListItem><InlineCode>getOrDefault</InlineCode> 是统计计数的利器：键不存在返回默认值，避免空指针。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测遍历顺序"
      code={`分别用 HashMap、LinkedHashMap、TreeMap 依次 put 以下键：
  "C", "A", "B"（值随意）

问：三者遍历输出的键顺序分别是怎样的？`}
      answerCode={`答案：
  HashMap：       顺序不可预期（由哈希值决定，常见可能是 A, B, C，但不保证）
  LinkedHashMap： C, A, B —— 严格按插入顺序
  TreeMap：       A, B, C —— 按键的字典序自动升序

解析：
  - HashMap 不承诺任何顺序，编码时绝不能依赖它的遍历顺序。
  - LinkedHashMap 用双向链表记录插入顺序，输出 = put 顺序。
  - TreeMap 用红黑树按键排序，String 键按字典序升序。`}
    />

    <CodeBlock
      qa
      title="练习2：统计单词词频并按字母序输出"
      code={`// 给定句子，统计每个单词出现次数，并按单词字母升序打印。
// 输入: "the cat sat on the mat the cat"
// 预期输出：
//   cat -> 2
//   mat -> 1
//   on -> 1
//   sat -> 1
//   the -> 3

import java.util.Map;
import java.util.TreeMap;

public class WordCount {
    public static void main(String[] args) {
        String s = "the cat sat on the mat the cat";
        // 补全
    }
}`}
      answerCode={`import java.util.Map;
import java.util.TreeMap;

public class WordCount {
    public static void main(String[] args) {
        String s = "the cat sat on the mat the cat";
        String[] words = s.split(" ");

        TreeMap<String, Integer> count = new TreeMap<>();
        for (String w : words) {
            count.put(w, count.getOrDefault(w, 0) + 1);
        }

        for (Map.Entry<String, Integer> e : count.entrySet()) {
            System.out.println(e.getKey() + " -> " + e.getValue());
        }
    }
}

/* 控制台输出：
cat -> 2
mat -> 1
on -> 1
sat -> 1
the -> 3

解析：用 split 按空格拆词；getOrDefault 实现「有则+1、无则从0开始」；
      TreeMap 自动让键(单词)按字母升序排列，遍历即得有序结果。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：用 TreeMap 做成绩区间查询"
      code={`// 一张「分数->姓名」表：90张三, 75李四, 60王五, 85赵六, 50钱七
// 要求：用 TreeMap 找出分数在 [60, 85] 区间(含两端)的所有记录并打印。
// 预期输出：{60=王五, 75=李四, 85=赵六}

import java.util.TreeMap;

public class ScoreRange {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.util.TreeMap;

public class ScoreRange {
    public static void main(String[] args) {
        TreeMap<Integer, String> map = new TreeMap<>();
        map.put(90, "张三");
        map.put(75, "李四");
        map.put(60, "王五");
        map.put(85, "赵六");
        map.put(50, "钱七");

        // subMap(from, fromInclusive, to, toInclusive)
        // 取 [60, 85] 闭区间
        System.out.println(map.subMap(60, true, 85, true));
    }
}

/* 控制台输出：
{60=王五, 75=李四, 85=赵六}

解析：TreeMap 键自动升序，subMap 带 inclusive 参数可精确控制区间开闭。
      若用 subMap(60, 85) 的两参版本则是 [60,85) 左闭右开，会漏掉 85，
      所以这里用四参版本把右端也设为 true。这类范围查询正是 TreeMap 的核心价值。
*/`}
    />
  </article>
);

export default index;
