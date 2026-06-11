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
    <Title>Iterator 迭代器与增强 for</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        遍历集合是最高频的操作。本节讲解集合通用的两种遍历方式：
        <Text bold>Iterator 迭代器</Text>和<Text bold>增强 for 循环（foreach）</Text>。
        重点剖析迭代器的三大方法、增强 for 的本质（语法糖）、以及初学者最容易踩的
        <Text bold>并发修改异常（ConcurrentModificationException）</Text>，
        并给出正确删除元素的标准写法。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要迭代器</Heading3>
    <Paragraph>
      不同集合的底层结构不同（数组、链表、哈希表……），遍历方式各异。
      <InlineCode>List</InlineCode> 可以用索引 <InlineCode>get(i)</InlineCode> 遍历，
      但 <InlineCode>Set</InlineCode> 没有索引，根本无法用 <InlineCode>get</InlineCode>。
      为了给所有集合提供<Text bold>统一的遍历方式</Text>，Java 设计了
      <InlineCode>Iterator</InlineCode>（迭代器）接口——不管底层是什么结构，
      都用同样的方式「一个一个取出」。
    </Paragraph>
    <Callout type="tip" title="迭代器模式">
      迭代器是经典的设计模式：把「遍历逻辑」从集合中抽离出来，由专门的迭代器对象负责，
      使用者不必关心集合内部如何存储。<InlineCode>Collection</InlineCode> 通过
      <InlineCode>iterator()</InlineCode> 方法返回一个迭代器。
    </Callout>

    <Heading3>2. Iterator 的三个核心方法</Heading3>
    <Table
      head={['方法', '功能', '返回值']}
      rows={[
        ['boolean hasNext()', '判断是否还有下一个元素', 'true 表示还有，false 表示到底了'],
        ['E next()', '取出下一个元素，并把指针后移一位', '当前元素'],
        ['void remove()', '删除 next() 刚返回的那个元素', '无'],
      ]}
    />
    <Callout type="warning" title="next() 越界会抛 NoSuchElementException">
      如果在 <InlineCode>hasNext()</InlineCode> 返回 <InlineCode>false</InlineCode> 后仍调用
      <InlineCode>next()</InlineCode>，会抛出 <InlineCode>NoSuchElementException</InlineCode>。
      因此标准写法是先 <InlineCode>hasNext()</InlineCode> 判断，再 <InlineCode>next()</InlineCode> 取值。
    </Callout>

    <Heading3>3. 迭代器的工作原理（指针模型）</Heading3>
    <Paragraph>
      可以把迭代器想象成一个停在「第一个元素之前」的指针，每次 <InlineCode>next()</InlineCode>
      就「跨过一个元素并返回它」：
    </Paragraph>
    <CodeBlock
      language="text"
      title="迭代器指针移动示意"
      code={`集合: [ A , B , C ]

初始:   ^                 hasNext()=true
       指针在 A 之前

next(): 返回 A，指针移到 A 和 B 之间
            ^             hasNext()=true

next(): 返回 B，指针移到 B 和 C 之间
                ^         hasNext()=true

next(): 返回 C，指针移到 C 之后
                    ^     hasNext()=false  （遍历结束）`}
    />

    <Heading3>4. 迭代器标准遍历写法</Heading3>
    <CodeBlock
      title="IteratorDemo.java"
      code={`import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("Java");
        list.add("Python");
        list.add("Go");

        // 1. 获取迭代器
        Iterator<String> it = list.iterator();

        // 2. while + hasNext + next 标准三段式
        while (it.hasNext()) {
            String e = it.next();
            System.out.println("取出: " + e);
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`取出: Java
取出: Python
取出: Go`}
    />

    <Heading3>5. 增强 for 循环（foreach）</Heading3>
    <Paragraph>
      增强 for 是 JDK 5 引入的语法糖，写法极其简洁，适用于<Text bold>数组</Text>
      和任何实现了 <InlineCode>Iterable</InlineCode> 接口的集合：
    </Paragraph>
    <CodeBlock
      language="text"
      title="增强 for 语法"
      code={`for (元素类型 变量名 : 集合或数组) {
    // 每次循环，变量名 自动取到下一个元素
}`}
    />
    <CodeBlock
      title="ForEachDemo.java"
      code={`import java.util.ArrayList;
import java.util.List;

public class ForEachDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("Java");
        list.add("Python");
        list.add("Go");

        // 增强 for：简洁明了
        for (String e : list) {
            System.out.println("元素: " + e);
        }

        // 也可遍历数组
        int[] nums = {10, 20, 30};
        int sum = 0;
        for (int n : nums) {
            sum += n;
        }
        System.out.println("数组求和: " + sum);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`元素: Java
元素: Python
元素: Go
数组求和: 60`}
    />
    <Callout type="tip" title="增强 for 的本质就是迭代器">
      编译器会把遍历集合的增强 for 自动翻译成 <InlineCode>Iterator</InlineCode> 写法。
      所以增强 for 同样存在「遍历时不能修改集合」的限制（见下一节）。
      二者的取舍：只读遍历用增强 for（简洁）；遍历中需要删除元素用迭代器（安全）。
    </Callout>

    <Heading3>6. 并发修改异常 ConcurrentModificationException</Heading3>
    <Paragraph>
      <Text bold>这是初学者最常踩的坑：</Text>在用增强 for 或迭代器遍历集合的<Text bold>同时</Text>，
      调用集合自身的 <InlineCode>add</InlineCode> / <InlineCode>remove</InlineCode> 方法修改它，
      会抛出 <InlineCode>ConcurrentModificationException</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="错误示范：遍历中用集合的 remove"
      code={`import java.util.ArrayList;
import java.util.List;

public class WrongRemove {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("Java");
        list.add("删我");
        list.add("Go");

        // 错误：增强 for 遍历时调用 list.remove
        for (String e : list) {
            if ("删我".equals(e)) {
                list.remove(e);   // 抛 ConcurrentModificationException
            }
        }
        System.out.println(list);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（运行时异常）"
      code={`Exception in thread "main" java.util.ConcurrentModificationException
	at java.base/java.util.ArrayList$Itr.checkForComodification(...)
	at java.base/java.util.ArrayList$Itr.next(...)
	at WrongRemove.main(...)`}
    />
    <Callout type="warning" title="原理：modCount 与 expectedModCount 不一致">
      集合内部维护一个修改计数器 <InlineCode>modCount</InlineCode>，迭代器创建时记录了一份
      <InlineCode>expectedModCount</InlineCode>。每次 <InlineCode>next()</InlineCode> 都会检查两者是否相等。
      你用 <InlineCode>list.remove</InlineCode> 修改了集合，<InlineCode>modCount</InlineCode> 变了，
      但迭代器的 <InlineCode>expectedModCount</InlineCode> 没变，检查不通过，于是抛异常——
      这是一种「快速失败（fail-fast）」机制，目的是尽早暴露错误。
    </Callout>

    <Heading3>7. 正确删除：使用迭代器自己的 remove()</Heading3>
    <Paragraph>
      遍历过程中要删除元素，正确做法是调用<Text bold>迭代器的 </Text>
      <InlineCode>it.remove()</InlineCode>，而不是集合的 <InlineCode>remove</InlineCode>。
      迭代器的 <InlineCode>remove</InlineCode> 会同步更新 <InlineCode>expectedModCount</InlineCode>，不会触发异常。
    </Paragraph>
    <CodeBlock
      title="RightRemove.java"
      code={`import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class RightRemove {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("Java");
        list.add("删我");
        list.add("Go");
        list.add("删我");

        Iterator<String> it = list.iterator();
        while (it.hasNext()) {
            String e = it.next();
            if ("删我".equals(e)) {
                it.remove();   // 正确：用迭代器删除当前元素
            }
        }
        System.out.println("删除后: " + list);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`删除后: [Java, Go]`}
    />
    <Callout type="tip" title="JDK 8+ 还可以用 removeIf">
      如果只是按条件删除，JDK 8 起可以一行搞定，底层同样安全：
      <InlineCode>{`list.removeIf(e -> "删我".equals(e));`}</InlineCode>。
    </Callout>

    <Heading3>8. 三种遍历方式对比</Heading3>
    <Table
      head={['遍历方式', '写法简洁度', '能否删除', '适用集合', '能否获取索引']}
      rows={[
        ['普通 for + get(i)', '中', '可（需手动调索引）', '仅 List', '能'],
        ['增强 for', '最简洁', '不能（会抛异常）', 'List/Set 等所有', '不能'],
        ['Iterator 迭代器', '中', '能（用 it.remove）', 'List/Set 等所有', '不能'],
      ]}
    />

    <Heading3>9. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>遍历集合的通用方式是 <InlineCode>Iterator</InlineCode>：<InlineCode>hasNext</InlineCode> + <InlineCode>next</InlineCode> + （可选）<InlineCode>remove</InlineCode>。</ListItem>
        <ListItem>增强 for 是迭代器的语法糖，适合只读遍历，简洁但不能修改集合。</ListItem>
        <ListItem>遍历中用<Text bold>集合的</Text> <InlineCode>remove</InlineCode> 会抛 <InlineCode>ConcurrentModificationException</InlineCode>（fail-fast）。</ListItem>
        <ListItem>遍历中删除元素请用<Text bold>迭代器的</Text> <InlineCode>it.remove()</InlineCode>，或 JDK 8 的 <InlineCode>removeIf</InlineCode>。</ListItem>
        <ListItem><InlineCode>next()</InlineCode> 越界会抛 <InlineCode>NoSuchElementException</InlineCode>，必须先 <InlineCode>hasNext()</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>10. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断对错"
      code={`判断下列说法是否正确，并说明理由：
  ① 增强 for 可以遍历 HashSet。
  ② 在增强 for 里调用 list.remove() 一定会抛异常。
  ③ Iterator 的 next() 方法只是返回元素，不会移动指针。
  ④ 调用 it.remove() 前必须先调用过 it.next()。`}
      answerCode={`答案：
  ① 正确。HashSet 实现了 Iterable，增强 for 适用于所有集合。
  ② 基本正确（对 ArrayList/HashSet 等 fail-fast 集合而言）。遍历时用集合的 remove
     修改了 modCount，下次 next() 检查时抛 ConcurrentModificationException。
     （严格说：若删的恰是倒数第二个元素，存在不抛异常的特殊情况，但绝不能依赖，视为「一定出错」。）
  ③ 错误。next() 既返回当前元素，又把指针后移一位。
  ④ 正确。remove() 删除的是「上一次 next() 返回的元素」，没先 next() 就 remove 会抛
     IllegalStateException。`}
    />

    <CodeBlock
      qa
      title="练习2：用迭代器删除所有偶数"
      code={`// 集合: [1, 2, 3, 4, 5, 6]
// 要求：用 Iterator 删除其中所有偶数，打印删除后的结果。
// 预期输出：[1, 3, 5]

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class RemoveEven {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 6; i++) list.add(i);
        // 补全：用迭代器删除偶数
    }
}`}
      answerCode={`import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class RemoveEven {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        for (int i = 1; i <= 6; i++) list.add(i);

        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            int n = it.next();
            if (n % 2 == 0) {
                it.remove();   // 用迭代器删除当前偶数
            }
        }
        System.out.println(list);
    }
}

/* 控制台输出：
[1, 3, 5]

解析：遍历中删除务必用 it.remove()。注意 next() 返回的是 Integer，
      自动拆箱为 int 后做 %2 判断。
      也可以用 JDK8 写法一行：list.removeIf(n -> n % 2 == 0);
*/`}
    />

    <CodeBlock
      qa
      title="练习3：手写遍历，不用增强 for"
      code={`// 不使用增强 for，用 Iterator 遍历下面的 Set 并求所有数字之和。
// Set 内容: {10, 20, 30, 40}
// 预期输出：100

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

public class SumSet {
    public static void main(String[] args) {
        Set<Integer> set = new HashSet<>();
        set.add(10); set.add(20); set.add(30); set.add(40);
        // 补全
    }
}`}
      answerCode={`import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

public class SumSet {
    public static void main(String[] args) {
        Set<Integer> set = new HashSet<>();
        set.add(10); set.add(20); set.add(30); set.add(40);

        int sum = 0;
        Iterator<Integer> it = set.iterator();
        while (it.hasNext()) {
            sum += it.next();   // 自动拆箱累加
        }
        System.out.println(sum);
    }
}

/* 控制台输出：
100

解析：Set 没有索引，无法用 get(i)，只能用迭代器（或增强 for）遍历。
      这正体现了迭代器「为所有集合提供统一遍历方式」的价值。
*/`}
    />
  </article>
);

export default index;
