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
    <Title>TreeSet 与两种排序方式</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>TreeSet</InlineCode> 是 <InlineCode>Set</InlineCode> 的又一实现，
        它在「去重」的基础上还能<Text bold>自动排序</Text>，底层是红黑树。
        本节讲解 <InlineCode>TreeSet</InlineCode> 的特性、它独有的范围查询方法，
        并重点讲透两种排序方案：让元素自身实现
        <Text bold>Comparable（自然排序）</Text>，或单独提供一个
        <Text bold>Comparator（比较器排序）</Text>。这套排序机制在整个 Java 中通用，务必掌握。
      </Paragraph>
    </Callout>

    <Heading3>1. TreeSet 的三大特性</Heading3>
    <UnorderedList>
      <ListItem><Text bold>不重复：</Text>同样是 <InlineCode>Set</InlineCode>，自动去重。</ListItem>
      <ListItem><Text bold>有序：</Text>元素按「大小」自动排序（默认升序），而不是插入顺序。</ListItem>
      <ListItem><Text bold>底层红黑树：</Text>一种自平衡二叉查找树，增删查的时间复杂度都是 O(log n)。</ListItem>
    </UnorderedList>
    <Callout type="tip" title="TreeSet 的去重不靠 hashCode/equals">
      <InlineCode>HashSet</InlineCode> 靠 <InlineCode>hashCode()</InlineCode> + <InlineCode>equals()</InlineCode> 去重；
      而 <InlineCode>TreeSet</InlineCode> 靠<Text bold>比较结果</Text>去重——
      只要比较方法返回 <InlineCode>0</InlineCode>，就认为是同一个元素。
      这是 <InlineCode>TreeSet</InlineCode> 一个非常关键、容易忽视的细节。
    </Callout>

    <Heading3>2. 第一种排序：自然排序 Comparable</Heading3>
    <Paragraph>
      <InlineCode>String</InlineCode>、<InlineCode>Integer</InlineCode> 等类天生就实现了
      <InlineCode>Comparable</InlineCode> 接口，定义了「自己和别人怎么比」，所以可以直接放进
      <InlineCode>TreeSet</InlineCode> 自动排序。<InlineCode>Comparable</InlineCode> 只有一个方法：
    </Paragraph>
    <CodeBlock
      language="text"
      title="Comparable 接口"
      code={`public interface Comparable<T> {
    // 返回值规则（this 与 o 比较）：
    //   负数：this 排在 o 前面（this 较小）
    //   0   ：this 与 o 相等（TreeSet 视为重复，舍弃）
    //   正数：this 排在 o 后面（this 较大）
    int compareTo(T o);
}`}
    />
    <CodeBlock
      title="自然排序：String 与 Integer"
      code={`import java.util.TreeSet;

public class NaturalOrder {
    public static void main(String[] args) {
        // 数字：自动升序
        TreeSet<Integer> nums = new TreeSet<>();
        nums.add(30); nums.add(10); nums.add(20); nums.add(10); // 10重复
        System.out.println("数字升序去重: " + nums);

        // 字符串：按字典序
        TreeSet<String> words = new TreeSet<>();
        words.add("banana"); words.add("apple"); words.add("cherry");
        System.out.println("字符串字典序: " + words);

        // TreeSet 独有的导航方法
        System.out.println("最小 first: " + nums.first());
        System.out.println("最大 last: " + nums.last());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`数字升序去重: [10, 20, 30]
字符串字典序: [apple, banana, cherry]
最小 first: 10
最大 last: 30`}
    />

    <Heading3>3. 给自定义类实现 Comparable</Heading3>
    <Paragraph>
      自定义类（如 <InlineCode>Student</InlineCode>）默认没有比较规则，直接放进 <InlineCode>TreeSet</InlineCode>
      会在运行时抛 <InlineCode>ClassCastException</InlineCode>。解决方法是让它实现
      <InlineCode>Comparable</InlineCode>，定义自己的「自然顺序」：
    </Paragraph>
    <CodeBlock
      title="Student implements Comparable"
      code={`import java.util.TreeSet;

class Student implements Comparable<Student> {
    String name;
    int score;

    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    // 定义自然排序：按成绩升序
    @Override
    public int compareTo(Student o) {
        return this.score - o.score;   // 升序；改成 o.score - this.score 即降序
    }

    @Override
    public String toString() {
        return name + "(" + score + ")";
    }
}

public class ComparableDemo {
    public static void main(String[] args) {
        TreeSet<Student> set = new TreeSet<>();
        set.add(new Student("张三", 85));
        set.add(new Student("李四", 92));
        set.add(new Student("王五", 78));
        System.out.println("按成绩升序: " + set);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`按成绩升序: [王五(78), 张三(85), 李四(92)]`}
    />
    <Callout type="warning" title="注意 compareTo 返回 0 会被当作重复">
      若两个学生成绩相同，<InlineCode>this.score - o.score</InlineCode> 返回 0，
      <InlineCode>TreeSet</InlineCode> 会认为它们是同一个，<Text bold>只保留一个</Text>！
      若希望「成绩相同但姓名不同的学生都保留」，需在比较里追加第二排序条件，例如：
      成绩相同时再按姓名比较 <InlineCode>this.name.compareTo(o.name)</InlineCode>。
    </Callout>

    <Heading3>4. 第二种排序：比较器 Comparator</Heading3>
    <Paragraph>
      有时不方便（或不想）修改元素类的源码，或者想<Text bold>临时换一种排序规则</Text>，
      这时可以在创建 <InlineCode>TreeSet</InlineCode> 时传入一个
      <InlineCode>Comparator</InlineCode> 比较器。它是独立于元素类的「外部裁判」：
    </Paragraph>
    <CodeBlock
      language="text"
      title="Comparator 接口"
      code={`public interface Comparator<T> {
    // 比较 o1 和 o2：
    //   负数：o1 排前面    0：相等    正数：o1 排后面
    int compare(T o1, T o2);
}`}
    />
    <CodeBlock
      title="Comparator：按成绩降序"
      code={`import java.util.Comparator;
import java.util.TreeSet;

class Stu {
    String name;
    int score;
    Stu(String name, int score) { this.name = name; this.score = score; }
    @Override public String toString() { return name + "(" + score + ")"; }
}

public class ComparatorDemo {
    public static void main(String[] args) {
        // 传入比较器：按成绩降序；成绩相同按姓名升序（避免被当重复丢弃）
        TreeSet<Stu> set = new TreeSet<>(new Comparator<Stu>() {
            @Override
            public int compare(Stu a, Stu b) {
                if (b.score != a.score) {
                    return b.score - a.score;      // 成绩降序
                }
                return a.name.compareTo(b.name);    // 成绩相同，姓名升序
            }
        });

        set.add(new Stu("张三", 85));
        set.add(new Stu("李四", 92));
        set.add(new Stu("王五", 85));   // 与张三同分，但姓名不同，保留
        System.out.println("成绩降序: " + set);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`成绩降序: [李四(92), 张三(85), 王五(85)]`}
    />
    <Callout type="tip" title="Lambda 写法更简洁（JDK 8+）">
      <InlineCode>Comparator</InlineCode> 是函数式接口，可用 Lambda 大幅简化：
      <InlineCode>{`new TreeSet<>((a, b) -> b.score - a.score)`}</InlineCode>。
      还能用 <InlineCode>Comparator.comparingInt(...)</InlineCode>、<InlineCode>.thenComparing(...)</InlineCode>
      链式组合多级排序，后续学到 Stream 时会频繁用到。
    </Callout>

    <Heading3>5. Comparable 与 Comparator 对比</Heading3>
    <Table
      head={['对比项', 'Comparable（自然排序）', 'Comparator（比较器排序）']}
      rows={[
        ['所在包', 'java.lang', 'java.util'],
        ['方法', 'compareTo(T o)', 'compare(T o1, T o2)'],
        ['谁来实现', '元素类自己实现', '单独写一个比较器对象'],
        ['是否改源码', '需要修改元素类', '不需要改元素类'],
        ['灵活性', '一个类只有一种自然顺序', '可随时切换多种排序规则'],
        ['使用场景', '类有公认的默认顺序(如数字)', '临时排序、多种排序、不可改源码时'],
      ]}
    />
    <Callout type="tip" title="两者同时存在时，Comparator 优先">
      如果元素类实现了 <InlineCode>Comparable</InlineCode>，同时又给 <InlineCode>TreeSet</InlineCode>
      传了 <InlineCode>Comparator</InlineCode>，则<Text bold>以 Comparator 为准</Text>，
      自然排序被忽略。
    </Callout>

    <Heading3>6. TreeSet 独有的范围/导航方法</Heading3>
    <Paragraph>
      因为元素有序，<InlineCode>TreeSet</InlineCode> 提供了一批按「大小关系」查找的方法（来自 <InlineCode>NavigableSet</InlineCode>）：
    </Paragraph>
    <Table
      head={['方法', '功能']}
      rows={[
        ['first() / last()', '返回最小 / 最大元素'],
        ['floor(e)', '返回 ≤ e 的最大元素（地板）'],
        ['ceiling(e)', '返回 ≥ e 的最小元素（天花板）'],
        ['lower(e)', '返回 < e 的最大元素（严格小于）'],
        ['higher(e)', '返回 > e 的最小元素（严格大于）'],
        ['headSet(e)', '返回所有 < e 的子集'],
        ['tailSet(e)', '返回所有 ≥ e 的子集'],
      ]}
    />
    <CodeBlock
      title="NavigableDemo.java"
      code={`import java.util.TreeSet;

public class NavigableDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>();
        for (int v : new int[]{10, 20, 30, 40, 50}) set.add(v);

        System.out.println("floor(25)   ≤25的最大: " + set.floor(25));
        System.out.println("ceiling(25) ≥25的最小: " + set.ceiling(25));
        System.out.println("lower(30)   <30的最大: " + set.lower(30));
        System.out.println("higher(30)  >30的最小: " + set.higher(30));
        System.out.println("headSet(30) <30的子集: " + set.headSet(30));
        System.out.println("tailSet(30) >=30的子集: " + set.tailSet(30));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`floor(25)   ≤25的最大: 20
ceiling(25) ≥25的最小: 30
lower(30)   <30的最大: 20
higher(30)  >30的最小: 40
headSet(30) <30的子集: [10, 20]
tailSet(30) >=30的子集: [30, 40, 50]`}
    />

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>TreeSet</InlineCode> 底层红黑树，既去重又自动排序，操作 O(log n)。</ListItem>
        <ListItem><InlineCode>TreeSet</InlineCode> 靠<Text bold>比较结果是否为 0</Text> 去重，与 hashCode/equals 无关。</ListItem>
        <ListItem><InlineCode>Comparable</InlineCode>：元素类自己实现 <InlineCode>compareTo</InlineCode>，定义自然顺序。</ListItem>
        <ListItem><InlineCode>Comparator</InlineCode>：外部比较器，传给 <InlineCode>TreeSet</InlineCode> 构造方法，更灵活，优先级更高。</ListItem>
        <ListItem>比较返回值规则：<Text bold>负前、0 等、正后</Text>；升序 <InlineCode>a-b</InlineCode>，降序 <InlineCode>b-a</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测输出"
      code={`import java.util.TreeSet;

class Box implements Comparable<Box> {
    int size;
    Box(int size) { this.size = size; }
    public int compareTo(Box o) { return this.size - o.size; }
    public String toString() { return "Box" + size; }
}

public class Q1 {
    public static void main(String[] args) {
        TreeSet<Box> set = new TreeSet<>();
        set.add(new Box(3));
        set.add(new Box(1));
        set.add(new Box(2));
        set.add(new Box(1));   // 注意这一行
        System.out.println(set);
        System.out.println("size = " + set.size());
    }
}

问：输出是什么？为什么 size 不是 4？`}
      answerCode={`输出：
[Box1, Box2, Box3]
size = 3

解析：compareTo 按 size 比较。两个 Box(1) 比较时 1-1=0，TreeSet 判定为「重复元素」，
      只保留第一个，第二个 Box(1) 被丢弃。因此最终只有 3 个元素，且按 size 升序排列。
      这说明 TreeSet 的去重完全依据 compareTo 是否返回 0，而非 equals。`}
    />

    <CodeBlock
      qa
      title="练习2：用 Comparator 实现字符串按长度排序"
      code={`// 用 TreeSet + Comparator，把下列字符串按「长度升序」排列；
// 长度相同则按字典序升序。
// 输入: "banana", "kiwi", "apple", "fig", "pear"
// 预期输出: [fig, kiwi, pear, apple, banana]

import java.util.TreeSet;

public class Q2 {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.util.TreeSet;

public class Q2 {
    public static void main(String[] args) {
        TreeSet<String> set = new TreeSet<>((a, b) -> {
            if (a.length() != b.length()) {
                return a.length() - b.length();  // 长度升序
            }
            return a.compareTo(b);               // 长度相同按字典序
        });
        set.add("banana");
        set.add("kiwi");
        set.add("apple");
        set.add("fig");
        set.add("pear");
        System.out.println(set);
    }
}

/* 控制台输出：
[fig, kiwi, pear, apple, banana]

解析：长度 fig(3) < kiwi(4)=pear(4) < apple(5) < banana(6)。
      kiwi 与 pear 同为长度4，按字典序 k<p，故 kiwi 在前。
      务必加上「长度相同按字典序」这条，否则同长度的不同单词会因 compare 返回0 被去重丢失。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：员工按工资降序，工资相同按工号升序"
      code={`// 用 TreeSet 存员工，主排序：工资从高到低；次排序：工号从小到大。
// 数据：(101, 8000), (102, 12000), (103, 8000)
// 预期输出：[102/12000, 101/8000, 103/8000]

import java.util.TreeSet;

class Emp {
    int id, salary;
    Emp(int id, int salary) { this.id = id; this.salary = salary; }
    public String toString() { return id + "/" + salary; }
}

public class Q3 {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.util.TreeSet;

class Emp {
    int id, salary;
    Emp(int id, int salary) { this.id = id; this.salary = salary; }
    public String toString() { return id + "/" + salary; }
}

public class Q3 {
    public static void main(String[] args) {
        TreeSet<Emp> set = new TreeSet<>((a, b) -> {
            if (b.salary != a.salary) {
                return b.salary - a.salary;   // 工资降序
            }
            return a.id - b.id;               // 工资相同，工号升序
        });
        set.add(new Emp(101, 8000));
        set.add(new Emp(102, 12000));
        set.add(new Emp(103, 8000));
        System.out.println(set);
    }
}

/* 控制台输出：
[102/12000, 101/8000, 103/8000]

解析：工资降序 → 102(12000) 最前；101 和 103 同为 8000，按工号升序 101<103，
      故 101 在 103 前。次排序条件不仅决定顺序，也防止同工资员工被误判为重复而丢失。
*/`}
    />
  </article>
);

export default index;
