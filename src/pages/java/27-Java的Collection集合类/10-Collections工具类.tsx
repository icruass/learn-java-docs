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
    <Title>Collections 工具类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>java.util.Collections</InlineCode>（注意末尾有 <Text bold>s</Text>，
        别和接口 <InlineCode>Collection</InlineCode> 搞混）是一个<Text bold>工具类</Text>，
        里面全是操作集合的静态方法：排序、查找、反转、打乱、求最值、线程安全包装等。
        它就像数组的 <InlineCode>Arrays</InlineCode> 工具类一样，能让集合操作一行搞定。
        本节系统讲解常用方法，并辅以可运行示例。
      </Paragraph>
    </Callout>

    <Heading3>1. Collection 与 Collections 的区别</Heading3>
    <Table
      head={['名称', '是什么', '作用']}
      rows={[
        ['Collection（无 s）', '接口', '单列集合的根接口，定义 add/remove 等'],
        ['Collections（有 s）', '工具类', '提供操作集合的静态方法 sort/max 等'],
      ]}
    />
    <Callout type="warning" title="最容易混淆的命名">
      二者只差一个字母 s，含义却完全不同。记忆口诀：
      <Text bold>带 s 的是「工具」（复数表示一堆工具方法）</Text>，
      不带 s 的是「接口」。<InlineCode>Collections</InlineCode> 的所有方法都是 <InlineCode>static</InlineCode>，
      直接用类名调用。
    </Callout>

    <Heading3>2. 常用静态方法一览</Heading3>
    <Table
      head={['方法', '功能']}
      rows={[
        ['sort(List list)', '按自然顺序升序排序'],
        ['sort(List list, Comparator c)', '按指定比较器排序'],
        ['reverse(List list)', '反转列表元素顺序'],
        ['shuffle(List list)', '随机打乱列表顺序'],
        ['max(Collection c)', '返回最大元素（按自然顺序）'],
        ['min(Collection c)', '返回最小元素'],
        ['binarySearch(List l, key)', '二分查找（要求列表已升序）'],
        ['swap(List l, i, j)', '交换两个下标处的元素'],
        ['fill(List l, obj)', '用指定元素替换所有位置'],
        ['frequency(Collection c, obj)', '统计某元素出现的次数'],
        ['addAll(Collection c, T... e)', '批量添加多个元素'],
        ['synchronizedList(List l)', '返回线程安全的列表包装'],
        ['unmodifiableList(List l)', '返回只读列表（不可修改）'],
      ]}
    />

    <Heading3>3. 排序：sort 与自定义比较器</Heading3>
    <CodeBlock
      title="SortDemo.java"
      code={`import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SortDemo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        Collections.addAll(list, 5, 2, 8, 1, 9, 3);  // 批量添加
        System.out.println("原始: " + list);

        // 自然升序
        Collections.sort(list);
        System.out.println("升序: " + list);

        // 自定义降序（Lambda 比较器）
        Collections.sort(list, (a, b) -> b - a);
        System.out.println("降序: " + list);

        // 反转
        Collections.reverse(list);
        System.out.println("反转后: " + list);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`原始: [5, 2, 8, 1, 9, 3]
升序: [1, 2, 3, 5, 8, 9]
降序: [9, 8, 5, 3, 2, 1]
反转后: [1, 2, 3, 5, 8, 9]`}
    />
    <Callout type="tip" title="sort 只能用于 List">
      <InlineCode>Collections.sort</InlineCode> 只接受 <InlineCode>List</InlineCode>（因为需要按索引排序）。
      <InlineCode>Set</InlineCode> / <InlineCode>Map</InlineCode> 不能直接 sort——
      要排序就改用 <InlineCode>TreeSet</InlineCode> / <InlineCode>TreeMap</InlineCode>，或先转成 List 再排。
    </Callout>

    <Heading3>4. 求最值、查找、统计</Heading3>
    <CodeBlock
      title="MaxMinDemo.java"
      code={`import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MaxMinDemo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        Collections.addAll(list, 5, 2, 8, 1, 9, 3, 8);

        System.out.println("最大值: " + Collections.max(list));
        System.out.println("最小值: " + Collections.min(list));
        System.out.println("8 出现次数: " + Collections.frequency(list, 8));

        // 二分查找必须先排序！
        Collections.sort(list);            // [1, 2, 3, 5, 8, 8, 9]
        int idx = Collections.binarySearch(list, 5);
        System.out.println("元素5的下标: " + idx);

        // 查找不存在的元素，返回负数
        int notFound = Collections.binarySearch(list, 100);
        System.out.println("查找100的返回值(负数): " + notFound);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`最大值: 9
最小值: 1
8 出现次数: 2
元素5的下标: 3
查找100的返回值(负数): -8`}
    />
    <Callout type="warning" title="binarySearch 的两个前提与返回值">
      <UnorderedList>
        <ListItem><Text bold>前提：列表必须已按升序排好</Text>，否则结果未定义（错误）。</ListItem>
        <ListItem>找到时返回下标；<Text bold>找不到时返回负数</Text>，
        具体是 <InlineCode>-(应插入位置) - 1</InlineCode>，可据此推算该元素该插到哪里。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5. 打乱与交换：洗牌效果</Heading3>
    <CodeBlock
      title="ShuffleDemo.java"
      code={`import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ShuffleDemo {
    public static void main(String[] args) {
        List<String> poker = new ArrayList<>();
        Collections.addAll(poker, "A", "2", "3", "4", "5");
        System.out.println("洗牌前: " + poker);

        Collections.shuffle(poker);   // 随机打乱（每次运行结果不同）
        System.out.println("洗牌后: " + poker);

        Collections.swap(poker, 0, 4); // 交换第0和第4个
        System.out.println("交换首尾后: " + poker);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（shuffle 结果随机，仅为示意）"
      code={`洗牌前: [A, 2, 3, 4, 5]
洗牌后: [3, A, 5, 2, 4]
交换首尾后: [4, A, 5, 2, 3]`}
    />
    <Callout type="tip" title="shuffle 是实现「随机抽取/发牌」的标准做法">
      斗地主发牌、抽奖、随机出题等场景，把元素放进 <InlineCode>List</InlineCode> 后用
      <InlineCode>Collections.shuffle</InlineCode> 打乱，再按顺序取出即可，无需自己写随机算法。
    </Callout>

    <Heading3>6. 线程安全与只读包装</Heading3>
    <Paragraph>
      <InlineCode>Collections</InlineCode> 还能把普通集合「包装」成具有特殊性质的集合：
    </Paragraph>
    <CodeBlock
      title="WrapDemo.java"
      code={`import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class WrapDemo {
    public static void main(String[] args) {
        // 1. 线程安全包装：多线程环境下安全
        List<String> safe = Collections.synchronizedList(new ArrayList<>());
        safe.add("线程安全");
        System.out.println("同步列表: " + safe);

        // 2. 只读包装：任何修改都会抛异常
        List<String> readOnly = Collections.unmodifiableList(
                new ArrayList<>(List.of("不可", "修改")));
        System.out.println("只读列表: " + readOnly);
        try {
            readOnly.add("试图添加");      // 抛 UnsupportedOperationException
        } catch (UnsupportedOperationException e) {
            System.out.println("修改只读列表被拒绝: " + e.getClass().getSimpleName());
        }

        // 3. 空集合 / 单元素集合（常用于返回值）
        List<String> empty = Collections.emptyList();
        List<String> single = Collections.singletonList("唯一");
        System.out.println("空集合: " + empty + ", 单元素集合: " + single);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`同步列表: [线程安全]
只读列表: [不可, 修改]
修改只读列表被拒绝: UnsupportedOperationException
空集合: [], 单元素集合: [唯一]`}
    />

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>Collections</InlineCode>（带 s）是工具类，方法全为 static；<InlineCode>Collection</InlineCode> 是接口，二者别混。</ListItem>
        <ListItem>排序 <InlineCode>sort</InlineCode>、反转 <InlineCode>reverse</InlineCode>、打乱 <InlineCode>shuffle</InlineCode> 只适用于 <InlineCode>List</InlineCode>。</ListItem>
        <ListItem><InlineCode>max</InlineCode>/<InlineCode>min</InlineCode>/<InlineCode>frequency</InlineCode> 适用于任意 <InlineCode>Collection</InlineCode>。</ListItem>
        <ListItem><InlineCode>binarySearch</InlineCode> 必须先升序排序，找不到返回 <InlineCode>-(插入点)-1</InlineCode> 的负数。</ListItem>
        <ListItem><InlineCode>synchronizedList</InlineCode> 加线程安全，<InlineCode>unmodifiableList</InlineCode> 变只读。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：辨析与预测"
      code={`① Collections 和 Collection 有什么区别？
② Collections.sort() 能给 HashSet 排序吗？为什么？
③ 对未排序的 List 调用 binarySearch 会怎样？
④ 下面代码输出什么？
   List<Integer> l = new ArrayList<>();
   Collections.addAll(l, 3, 1, 3, 2, 3);
   System.out.println(Collections.frequency(l, 3));`}
      answerCode={`答案：
① Collections 是工具类(静态方法集合)；Collection 是单列集合根接口。差一个 s，含义完全不同。
② 不能。sort 只接受 List(需要按索引操作)。要让元素有序应改用 TreeSet，
   或先 new ArrayList<>(hashSet) 转成 List 再排序。
③ 结果未定义（可能返回错误下标）。binarySearch 的前提是列表已升序排好。
④ 输出 3 —— frequency 统计元素 3 在列表中出现的次数，共 3 个。`}
    />

    <CodeBlock
      qa
      title="练习2：洗牌发牌"
      code={`// 用 Collections 模拟简单发牌：
// 1) 准备一副只含 1~10 的牌（用 List<Integer>）
// 2) 洗牌
// 3) 发给 2 个玩家，每人 5 张（交替发牌）
// 打印两位玩家手牌。

import java.util.*;

public class DealCards {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.util.*;

public class DealCards {
    public static void main(String[] args) {
        // 1) 准备牌
        List<Integer> deck = new ArrayList<>();
        for (int i = 1; i <= 10; i++) deck.add(i);

        // 2) 洗牌
        Collections.shuffle(deck);

        // 3) 交替发牌
        List<Integer> p1 = new ArrayList<>();
        List<Integer> p2 = new ArrayList<>();
        for (int i = 0; i < deck.size(); i++) {
            if (i % 2 == 0) p1.add(deck.get(i));
            else            p2.add(deck.get(i));
        }

        // 各自整理(排序)后展示
        Collections.sort(p1);
        Collections.sort(p2);
        System.out.println("玩家1: " + p1);
        System.out.println("玩家2: " + p2);
    }
}

/* 控制台输出（shuffle 随机，示意）：
玩家1: [1, 3, 5, 8, 9]
玩家2: [2, 4, 6, 7, 10]

解析：shuffle 负责随机性，按 i%2 交替发牌，最后用 sort 整理手牌。
      每次运行手牌内容不同，但两人各 5 张、合起来恰是 1~10 不变。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：求最值与二分查找"
      code={`// 给定分数 [88, 95, 70, 60, 88, 100]
// ① 打印最高分、最低分
// ② 统计 88 出现了几次
// ③ 排序后用 binarySearch 找出 95 的下标
// ④ 用 binarySearch 找不存在的 50，打印返回值并解释

import java.util.*;

public class ScoreStat {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.util.*;

public class ScoreStat {
    public static void main(String[] args) {
        List<Integer> scores = new ArrayList<>();
        Collections.addAll(scores, 88, 95, 70, 60, 88, 100);

        System.out.println("最高分: " + Collections.max(scores));
        System.out.println("最低分: " + Collections.min(scores));
        System.out.println("88出现次数: " + Collections.frequency(scores, 88));

        Collections.sort(scores);   // [60, 70, 88, 88, 95, 100]
        System.out.println("排序后: " + scores);
        System.out.println("95的下标: " + Collections.binarySearch(scores, 95));
        System.out.println("查找50返回: " + Collections.binarySearch(scores, 50));
    }
}

/* 控制台输出：
最高分: 100
最低分: 60
88出现次数: 2
排序后: [60, 70, 88, 88, 95, 100]
95的下标: 4
查找50返回: -1

解析：max/min/frequency 直接对集合操作。binarySearch 前必须 sort。
      50 不存在，应插入到下标0(最前)，按公式 -(插入点)-1 = -(0)-1 = -1。
      负返回值不仅表示「没找到」，其绝对值还能算出该元素应插入的位置。
*/`}
    />
  </article>
);

export default index;
