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
    <Title>Set 接口与 HashSet</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>Set</Text> 是 Collection 体系中与 List 并列的另一大分支，
        其最核心的特征是<Text bold>元素唯一（不重复）、无索引</Text>。
        本节首先介绍 Set 接口的共性特点，再深入讲解最常用的实现类
        <Text bold>HashSet</Text>——其底层是哈希表（本质是 HashMap），
        增删查的平均时间复杂度为 O(1)；接着剖析去重原理（hashCode + equals 双重校验），
        演示自定义对象必须重写这两个方法才能正确去重；最后介绍
        <Text bold>LinkedHashSet</Text>——在 HashSet 基础上用双向链表维护插入顺序，
        让遍历结果有序可预期。
      </Paragraph>
    </Callout>

    <Heading3>1. Set 接口概述</Heading3>
    <Paragraph>
      <InlineCode>java.util.Set</InlineCode> 接口继承自 <InlineCode>Collection</InlineCode>，
      它没有在 Collection 之上新增额外方法，但规定了三条行为约束：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>元素唯一</Text>：Set 中不允许存放重复元素。尝试添加已存在的元素时，
        <InlineCode>add()</InlineCode> 方法返回 <InlineCode>false</InlineCode>，集合内容不变。
      </ListItem>
      <ListItem>
        <Text bold>无索引</Text>：Set 不提供 <InlineCode>get(int index)</InlineCode> 方法，
        无法通过下标随机访问元素，只能用迭代器或增强 for 遍历。
      </ListItem>
      <ListItem>
        <Text bold>默认无序（HashSet）</Text>：大多数 Set 实现（HashSet）不保证元素的存储或遍历顺序。
        如需有序，可选 LinkedHashSet（插入顺序）或 TreeSet（排序顺序）。
      </ListItem>
    </OrderedList>
    <Table
      head={['实现类', '底层结构', '元素顺序', '增删查时间复杂度', '特点']}
      rows={[
        ['HashSet', '哈希表（HashMap）', '无序', 'O(1) 平均', '最常用，性能最好'],
        ['LinkedHashSet', '哈希表 + 双向链表', '插入顺序', 'O(1) 平均', '有序版 HashSet'],
        ['TreeSet', '红黑树', '自然/比较器排序', 'O(log n)', '自动排序，下节详讲'],
      ]}
    />

    <Heading3>2. HashSet 底层原理</Heading3>
    <Paragraph>
      <InlineCode>HashSet</InlineCode> 的底层实际上是一个 <InlineCode>HashMap</InlineCode>——
      添加到 HashSet 中的元素，被存储为 HashMap 的 <Text bold>key</Text>，
      对应的 value 统一是一个固定的占位对象 <InlineCode>PRESENT</InlineCode>（一个 <InlineCode>Object</InlineCode> 常量）。
      因此 HashSet 的所有特性（唯一性、无序、O(1) 操作）本质上都来自 HashMap。
    </Paragraph>
    <Callout type="tip" title="哈希表的桶（bucket）结构">
      <Paragraph>
        HashMap 内部维护一个数组，数组的每个槽位称为一个"桶"。
        添加元素时，先调用元素的 <InlineCode>hashCode()</InlineCode> 计算哈希值，
        再对数组长度取模，确定存入哪个桶；取元素时同样先定位桶，再在桶内的链表（或红黑树）中查找。
        这就是为什么平均时间复杂度是 O(1)——大多数情况下直接定位到桶，不需要逐一比较。
      </Paragraph>
    </Callout>

    <Heading3>3. HashSet 去重原理：hashCode() + equals()</Heading3>
    <Paragraph>
      HashSet 判断两个元素是否"重复"的流程分两步：
    </Paragraph>
    <OrderedList>
      <ListItem>
        调用新元素的 <InlineCode>hashCode()</InlineCode>，计算出它应存入的桶位置。
        如果该桶<Text bold>为空</Text>，直接存入，不存在重复，结束。
      </ListItem>
      <ListItem>
        如果该桶<Text bold>不为空</Text>（已有元素），则逐一调用
        <InlineCode>equals()</InlineCode> 与桶中已有元素比较。
        只要有一次 <InlineCode>equals()</InlineCode> 返回 <InlineCode>true</InlineCode>，
        就认为是重复元素，<Text bold>不存入</Text>；全部返回 <InlineCode>false</InlineCode> 才存入。
      </ListItem>
    </OrderedList>
    <Callout type="danger" title="自定义对象必须同时重写 hashCode() 和 equals()">
      <Paragraph>
        如果不重写这两个方法，<InlineCode>Object</InlineCode> 默认的 <InlineCode>hashCode()</InlineCode>
        基于对象内存地址生成，默认的 <InlineCode>equals()</InlineCode> 也是比较内存地址（即 ==）。
        这意味着：即使两个对象的<Text bold>字段值完全相同</Text>，
        因为它们是不同的内存地址，hashCode 不同，会落入不同的桶，
        HashSet 认为它们不重复，<Text bold>两个"相同"对象都会被存入</Text>！
      </Paragraph>
      <Paragraph>
        正确做法：重写 <InlineCode>hashCode()</InlineCode> 让字段值相同的对象产生相同哈希值，
        重写 <InlineCode>equals()</InlineCode> 让字段值相同的对象返回 <InlineCode>true</InlineCode>。
        两者缺一不可。
      </Paragraph>
    </Callout>
    <Table
      head={['场景', 'hashCode 相同？', 'equals 结果', 'HashSet 行为']}
      rows={[
        ['两个不同桶', '不同', '不调用', '直接存入（不重复）'],
        ['同桶，equals = false', '相同', 'false', '存入（不重复）'],
        ['同桶，equals = true', '相同', 'true', '不存入（去重）'],
      ]}
    />
    <Callout type="warning" title="hashCode 相同不代表 equals 为 true（哈希冲突）">
      两个完全不同的对象也可能产生相同的 hashCode（称为哈希冲突），
      这时它们落入同一个桶，再由 equals 区分。
      所以单独重写 hashCode 而不重写 equals，无法保证正确去重。
    </Callout>

    <Heading3>4. HashSet 常用方法</Heading3>
    <Paragraph>
      HashSet 继承自 Collection，没有专属新方法，常用操作如下：
    </Paragraph>
    <Table
      head={['方法', '说明', '返回值']}
      rows={[
        ['add(E e)', '添加元素；成功返回 true，元素已存在返回 false', 'boolean'],
        ['remove(Object o)', '删除指定元素；存在且删除成功返回 true', 'boolean'],
        ['contains(Object o)', '判断是否包含某元素', 'boolean'],
        ['size()', '返回元素个数', 'int'],
        ['isEmpty()', '判断是否为空', 'boolean'],
        ['clear()', '清空所有元素', 'void'],
        ['iterator()', '返回迭代器，用于遍历', 'Iterator&lt;E&gt;'],
      ]}
    />

    <Heading3>5. 示例一：HashSet 基本去重（String）</Heading3>
    <Paragraph>
      <InlineCode>String</InlineCode> 类已经重写了 <InlineCode>hashCode()</InlineCode> 和
      <InlineCode>equals()</InlineCode>（按字符内容比较），
      所以 <InlineCode>HashSet&lt;String&gt;</InlineCode> 可以直接对字符串去重。
    </Paragraph>
    <CodeBlock
      title="HashSetBasicDemo.java"
      code={`import java.util.HashSet;
import java.util.Set;

public class HashSetBasicDemo {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();

        // 添加元素，重复的添加失败
        System.out.println(set.add("apple"));   // true
        System.out.println(set.add("banana"));  // true
        System.out.println(set.add("apple"));   // false，已存在
        System.out.println(set.add("cherry"));  // true
        System.out.println(set.add("banana"));  // false，已存在

        System.out.println("集合大小：" + set.size());         // 3
        System.out.println("是否包含 apple：" + set.contains("apple")); // true

        // 遍历（顺序不保证与插入顺序一致）
        System.out.println("遍历结果：");
        for (String s : set) {
            System.out.println("  " + s);
        }

        // 删除
        set.remove("banana");
        System.out.println("删除 banana 后：" + set);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`true
true
false
true
false
集合大小：3
是否包含 apple：true
遍历结果：
  cherry
  apple
  banana
删除 banana 后：[cherry, apple]`}
    />
    <Paragraph>
      遍历输出的顺序与插入顺序不同（cherry 出现在最前），这正是 HashSet
      <Text bold>无序</Text>的体现——元素在桶中的位置由 hashCode 决定，与插入先后无关。
    </Paragraph>

    <Heading3>6. 示例二：自定义对象 Student——不重写 vs 重写 hashCode/equals</Heading3>
    <Heading4>6.1 不重写：相同内容的对象被当作不同元素</Heading4>
    <CodeBlock
      title="StudentNoOverride.java"
      code={`import java.util.HashSet;
import java.util.Set;

// 没有重写 hashCode() 和 equals() 的 Student 类
class StudentNoOverride {
    String name;
    int age;

    public StudentNoOverride(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return name + "(" + age + ")";
    }
}

public class NoOverrideDemo {
    public static void main(String[] args) {
        Set<StudentNoOverride> set = new HashSet<>();

        StudentNoOverride s1 = new StudentNoOverride("张三", 18);
        StudentNoOverride s2 = new StudentNoOverride("张三", 18); // 内容与 s1 完全相同
        StudentNoOverride s3 = new StudentNoOverride("李四", 20);

        set.add(s1);
        set.add(s2); // 期望被去重，实际不会
        set.add(s3);

        System.out.println("集合大小（期望 2，实际）：" + set.size());
        System.out.println("集合内容：" + set);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`集合大小（期望 2，实际）：3
集合内容：[张三(18), 张三(18), 李四(20)]`}
    />
    <Paragraph>
      s1 和 s2 内容完全相同，却都被存入了 HashSet，因为没有重写
      <InlineCode>hashCode()</InlineCode>，两者的哈希值（基于内存地址）不同，
      落入不同的桶，HashSet 判断它们不重复。
    </Paragraph>

    <Heading4>6.2 重写 hashCode 和 equals：正确去重</Heading4>
    <CodeBlock
      title="Student.java"
      code={`import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

// 正确重写 hashCode() 和 equals() 的 Student 类
class Student {
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 重写 hashCode：用字段值生成哈希，name 和 age 相同则 hashCode 相同
    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }

    // 重写 equals：name 和 age 都相同才认为是同一个学生
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Student)) return false;
        Student other = (Student) o;
        return age == other.age && Objects.equals(name, other.name);
    }

    @Override
    public String toString() {
        return name + "(" + age + ")";
    }
}

public class StudentHashSetDemo {
    public static void main(String[] args) {
        Set<Student> set = new HashSet<>();

        set.add(new Student("张三", 18));
        set.add(new Student("张三", 18)); // 内容重复，被去重
        set.add(new Student("李四", 20));
        set.add(new Student("王五", 18));
        set.add(new Student("李四", 20)); // 内容重复，被去重

        System.out.println("集合大小（期望 3）：" + set.size());
        System.out.println("遍历结果：");
        for (Student s : set) {
            System.out.println("  " + s);
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`集合大小（期望 3）：3
遍历结果：
  王五(18)
  李四(20)
  张三(18)`}
    />
    <Paragraph>
      重写后，name 和 age 相同的两个 Student 对象产生相同的 hashCode，
      落入同一个桶，再经 <InlineCode>equals()</InlineCode> 比较返回 <InlineCode>true</InlineCode>，
      HashSet 识别为重复元素，只保留一个。集合大小正确为 3。
    </Paragraph>

    <Heading3>7. LinkedHashSet：保证插入顺序的 HashSet</Heading3>
    <Paragraph>
      <InlineCode>LinkedHashSet&lt;E&gt;</InlineCode> 继承自 <InlineCode>HashSet</InlineCode>，
      底层在哈希表的基础上额外维护了一条<Text bold>双向链表</Text>，
      链表按元素<Text bold>插入顺序</Text>将所有元素串联起来。
      遍历时沿链表走，因此输出顺序与插入顺序一致。
    </Paragraph>
    <Table
      head={['特性', 'HashSet', 'LinkedHashSet']}
      rows={[
        ['底层结构', '哈希表（HashMap）', '哈希表 + 双向链表（LinkedHashMap）'],
        ['元素唯一', '是', '是'],
        ['遍历顺序', '无序（不可预期）', '按插入顺序'],
        ['增删查复杂度', 'O(1) 平均', 'O(1) 平均'],
        ['内存开销', '较小', '略大（多维护链表指针）'],
      ]}
    />
    <Callout type="tip" title="LinkedHashSet 的使用场景">
      当你需要 Set 的去重功能，同时又希望遍历结果的顺序与添加顺序一致时，
      使用 <InlineCode>LinkedHashSet</InlineCode>。
      典型场景：对一个列表去重后保留原有顺序。
    </Callout>

    <Heading3>8. 示例三：LinkedHashSet 保持插入顺序</Heading3>
    <CodeBlock
      title="LinkedHashSetDemo.java"
      code={`import java.util.LinkedHashSet;
import java.util.Set;

public class LinkedHashSetDemo {
    public static void main(String[] args) {
        // 用 HashSet：顺序不可预期
        Set<String> hashSet = new java.util.HashSet<>();
        hashSet.add("香蕉");
        hashSet.add("苹果");
        hashSet.add("橙子");
        hashSet.add("苹果"); // 重复
        hashSet.add("葡萄");
        System.out.println("HashSet 遍历（无序）：" + hashSet);

        System.out.println();

        // 用 LinkedHashSet：严格按插入顺序遍历
        Set<String> linkedSet = new LinkedHashSet<>();
        linkedSet.add("香蕉");
        linkedSet.add("苹果");
        linkedSet.add("橙子");
        linkedSet.add("苹果"); // 重复，不存入
        linkedSet.add("葡萄");
        System.out.println("LinkedHashSet 遍历（插入顺序）：" + linkedSet);

        // 演示：对带重复元素的列表去重且保留顺序
        java.util.List<String> original = new java.util.ArrayList<>();
        original.add("C");
        original.add("A");
        original.add("B");
        original.add("A");
        original.add("C");
        original.add("D");

        Set<String> deduped = new LinkedHashSet<>(original);
        System.out.println();
        System.out.println("原列表：" + original);
        System.out.println("去重后（保留顺序）：" + deduped);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`HashSet 遍历（无序）：[葡萄, 苹果, 橙子, 香蕉]
LinkedHashSet 遍历（插入顺序）：[香蕉, 苹果, 橙子, 葡萄]

原列表：[C, A, B, A, C, D]
去重后（保留顺序）：[C, A, B, D]`}
    />
    <Paragraph>
      HashSet 的遍历顺序与插入顺序无关（受哈希值影响）；
      LinkedHashSet 严格按照"香蕉→苹果→橙子→葡萄"的插入顺序输出，
      重复的"苹果"被去重而不影响已有元素的位置。
      利用 <InlineCode>new LinkedHashSet&lt;&gt;(list)</InlineCode> 可一步完成"去重且保留顺序"。
    </Paragraph>

    <Heading3>9. Set 接口与 HashSet 要点汇总</Heading3>
    <Table
      head={['要点', '说明']}
      rows={[
        ['元素唯一', '不允许重复，add() 重复时返回 false'],
        ['无索引', '不能用下标访问，只能迭代器或增强 for 遍历'],
        ['HashSet 底层', '本质是 HashMap，元素作为 key 存储'],
        ['去重两步骤', '先 hashCode() 定桶，再 equals() 比较；两者缺一不可'],
        ['自定义对象去重', '必须同时重写 hashCode() 和 equals()，通常用 Objects.hash()'],
        ['LinkedHashSet', '哈希表 + 双向链表，按插入顺序遍历，其余与 HashSet 相同'],
      ]}
    />
    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>Set 的核心是唯一性，HashSet 是首选实现，增删查 O(1)，但无序。</ListItem>
        <ListItem>
          存自定义对象时，务必同时重写 <InlineCode>hashCode()</InlineCode> 和
          <InlineCode>equals()</InlineCode>，缺少任意一个都无法正确去重。
        </ListItem>
        <ListItem>需要保持插入顺序时，改用 <InlineCode>LinkedHashSet</InlineCode>，用法完全兼容 HashSet。</ListItem>
        <ListItem>需要自动排序时，改用 <InlineCode>TreeSet</InlineCode>（下节详讲）。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>10. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：列表去重（保留插入顺序）"
      code={`// 要求：给定一个含重复元素的 List<Integer>，
// 用 LinkedHashSet 对其去重，并保留原有顺序，最后打印去重后的结果。
// 原始列表：[5, 3, 8, 3, 1, 5, 9, 1, 2]

import java.util.*;

public class ListDedup {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>(Arrays.asList(5, 3, 8, 3, 1, 5, 9, 1, 2));
        System.out.println("原始列表：" + list);

        // 补全：用 LinkedHashSet 去重，打印去重后的集合
    }
}`}
      answerCode={`import java.util.*;

public class ListDedup {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>(Arrays.asList(5, 3, 8, 3, 1, 5, 9, 1, 2));
        System.out.println("原始列表：" + list);

        // LinkedHashSet 构造时传入 list，自动去重且保留顺序
        Set<Integer> deduped = new LinkedHashSet<>(list);
        System.out.println("去重后：" + deduped);
    }
}

/* 控制台输出：
原始列表：[5, 3, 8, 3, 1, 5, 9, 1, 2]
去重后：[5, 3, 8, 1, 9, 2]

解析：LinkedHashSet 按插入顺序（即 list 的顺序）保留第一次出现的元素，
      重复出现的 3、1、5 被去除，顺序与原列表首次出现的顺序一致。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：统计不重复单词数"
      code={`// 要求：给定一段英文句子，统计其中共有多少个不重复的单词（忽略大小写）。
// 输入句子："to be or not to be that is the question"
// 期望输出：不重复单词数：8

import java.util.*;

public class UniqueWordCount {
    public static void main(String[] args) {
        String sentence = "to be or not to be that is the question";
        String[] words = sentence.split(" ");

        // 补全：将 words 存入 HashSet（注意全部转小写），打印不重复单词数和单词集合

    }
}`}
      answerCode={`import java.util.*;

public class UniqueWordCount {
    public static void main(String[] args) {
        String sentence = "to be or not to be that is the question";
        String[] words = sentence.split(" ");

        Set<String> uniqueWords = new HashSet<>();
        for (String word : words) {
            uniqueWords.add(word.toLowerCase()); // 统一小写后加入，保证大小写不影响去重
        }

        System.out.println("不重复单词数：" + uniqueWords.size());
        System.out.println("单词集合：" + uniqueWords);
    }
}

/* 控制台输出：
不重复单词数：8
单词集合：[that, be, not, to, or, the, question, is]

解析：原句 10 个词，"to" 出现 2 次、"be" 出现 2 次，去重后剩 8 个。
      HashSet 的 add() 在遇到重复时静默忽略（返回 false），最终 size() 即为不重复数。
      String 已内置 hashCode/equals，无需额外处理。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：自定义对象 Student 去重"
      code={`// 要求：
// 定义 Student 类，包含 name（String）和 id（int，学号）。
// 规定：学号相同即为同一个学生（忽略 name 是否一致）。
// 请正确重写 hashCode() 和 equals()，使 HashSet<Student> 能按学号去重。
// 测试：添加以下 4 个 Student，期望去重后集合大小为 3：
//   new Student("张三", 1001)
//   new Student("李四", 1002)
//   new Student("张三2", 1001)  // 与第一个学号相同，应被去重
//   new Student("王五", 1003)

import java.util.*;

class Student {
    String name;
    int id;

    public Student(String name, int id) {
        this.name = name;
        this.id = id;
    }

    // 补全：重写 hashCode() —— 只基于 id
    // 补全：重写 equals()   —— 只比较 id

    @Override
    public String toString() {
        return name + "(id=" + id + ")";
    }
}

public class StudentSetDemo {
    public static void main(String[] args) {
        Set<Student> set = new HashSet<>();
        set.add(new Student("张三",  1001));
        set.add(new Student("李四",  1002));
        set.add(new Student("张三2", 1001)); // 学号重复，应被去重
        set.add(new Student("王五",  1003));

        System.out.println("集合大小（期望 3）：" + set.size());
        for (Student s : set) {
            System.out.println("  " + s);
        }
    }
}`}
      answerCode={`import java.util.*;

class Student {
    String name;
    int id;

    public Student(String name, int id) {
        this.name = name;
        this.id = id;
    }

    // 只基于 id 生成哈希值
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // 只比较 id
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Student)) return false;
        Student other = (Student) o;
        return this.id == other.id;
    }

    @Override
    public String toString() {
        return name + "(id=" + id + ")";
    }
}

public class StudentSetDemo {
    public static void main(String[] args) {
        Set<Student> set = new HashSet<>();
        set.add(new Student("张三",  1001));
        set.add(new Student("李四",  1002));
        set.add(new Student("张三2", 1001)); // 学号重复，被去重
        set.add(new Student("王五",  1003));

        System.out.println("集合大小（期望 3）：" + set.size());
        for (Student s : set) {
            System.out.println("  " + s);
        }
    }
}

/* 控制台输出：
集合大小（期望 3）：3
  王五(id=1003)
  李四(id=1002)
  张三(id=1001)

解析：hashCode() 和 equals() 都只基于 id 字段。
      "张三2(id=1001)" 与 "张三(id=1001)" 的 hashCode 相同（均为 id=1001 的哈希），
      equals 也返回 true，因此 HashSet 将其识别为重复元素，只保留先加入的那个。
*/`}
    />
  </article>
);

export default index;
