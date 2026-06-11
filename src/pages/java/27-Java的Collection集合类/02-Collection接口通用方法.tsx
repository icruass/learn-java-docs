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
    <Title>Collection 接口通用方法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>Collection&lt;E&gt;</InlineCode> 是单列集合体系的根接口，
        <InlineCode>List</InlineCode>、<InlineCode>Set</InlineCode>、<InlineCode>Queue</InlineCode>
        都继承自它。这意味着只要掌握了 <InlineCode>Collection</InlineCode> 定义的这套通用方法，
        就掌握了所有单列集合的「公共操作」。本节系统梳理这些方法的<Text bold>签名、参数、返回值和注意点</Text>，
        并通过一份完整示例验证每个方法的真实输出。
      </Paragraph>
    </Callout>

    <Heading3>1. Collection 在体系中的位置</Heading3>
    <Paragraph>
      <InlineCode>Collection</InlineCode> 是一个接口，本身不能被实例化，必须通过它的实现类来创建对象。
      它定义的方法被所有子接口和实现类继承，因此具有「一处定义、处处可用」的通用性。
    </Paragraph>
    <CodeBlock
      language="text"
      title="Collection 的继承位置"
      code={`Iterable<E>            （更上层接口，提供 iterator()，使集合支持增强 for）
└── Collection<E>      （单列集合根接口，本节主角）
    ├── List<E>        （有序可重复）
    ├── Set<E>         （无序不重复）
    └── Queue<E>       （队列）`}
    />
    <Callout type="tip" title="Collection 继承自 Iterable">
      正因为 <InlineCode>Collection</InlineCode> 继承了 <InlineCode>Iterable</InlineCode>，
      所有集合才都能用增强 for 循环（foreach）遍历，也都拥有 <InlineCode>iterator()</InlineCode> 方法。
      这部分内容将在下一节「Iterator 迭代器」中详细展开。
    </Callout>

    <Heading3>2. 通用方法一览表</Heading3>
    <Paragraph>
      以下方法是 <InlineCode>Collection</InlineCode> 接口定义的全部常用方法，按功能分类记忆：
    </Paragraph>
    <Table
      head={['方法签名', '功能说明', '返回值']}
      rows={[
        ['boolean add(E e)', '把指定元素添加到集合', '添加后集合是否变化（true/false）'],
        ['boolean addAll(Collection c)', '把另一个集合的所有元素加进来', '集合是否变化'],
        ['boolean remove(Object o)', '删除指定的一个元素（删第一个匹配）', '是否真的删掉了'],
        ['boolean removeAll(Collection c)', '删除两个集合的交集部分', '集合是否变化'],
        ['boolean retainAll(Collection c)', '只保留交集（求交集）', '集合是否变化'],
        ['void clear()', '清空集合所有元素', '无'],
        ['boolean contains(Object o)', '判断是否包含指定元素', 'true/false'],
        ['boolean containsAll(Collection c)', '判断是否包含另一集合的全部元素', 'true/false'],
        ['boolean isEmpty()', '判断集合是否为空', 'true/false'],
        ['int size()', '返回元素个数', 'int'],
        ['Object[] toArray()', '把集合转成 Object 数组', 'Object[]'],
        ['Iterator iterator()', '返回迭代器，用于遍历', 'Iterator'],
      ]}
    />
    <Callout type="warning" title="contains / remove 依赖 equals 方法">
      <InlineCode>contains(Object o)</InlineCode> 和 <InlineCode>remove(Object o)</InlineCode>
      在判断「是否相等」时调用的是元素的 <InlineCode>equals()</InlineCode> 方法。
      对于 <InlineCode>String</InlineCode> 等已重写 <InlineCode>equals</InlineCode> 的类没问题；
      但如果集合里装的是<Text bold>自定义对象</Text>且没有重写 <InlineCode>equals</InlineCode>，
      则比较的是地址，往往得不到预期结果。
    </Callout>

    <Heading3>3. add 与 remove 的返回值含义</Heading3>
    <Paragraph>
      初学者常忽略 <InlineCode>add</InlineCode> / <InlineCode>remove</InlineCode> 的
      <InlineCode>boolean</InlineCode> 返回值，它表达的是「调用之后集合内容是否发生了变化」：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>add</InlineCode> 对 <InlineCode>List</InlineCode> 永远返回 <InlineCode>true</InlineCode>（List 允许重复，一定加得进去）；
        对 <InlineCode>Set</InlineCode> 则可能返回 <InlineCode>false</InlineCode>（元素已存在，添加失败）。
      </ListItem>
      <ListItem>
        <InlineCode>remove(Object o)</InlineCode> 删到了返回 <InlineCode>true</InlineCode>，
        集合里根本没有这个元素则返回 <InlineCode>false</InlineCode>。
      </ListItem>
    </UnorderedList>

    <Heading3>4. addAll / removeAll / retainAll：集合间的运算</Heading3>
    <Paragraph>
      这三个方法接收另一个集合作为参数，相当于数学上的集合运算：
    </Paragraph>
    <Table
      head={['方法', '数学含义', '效果（A 调用，参数为 B）']}
      rows={[
        ['A.addAll(B)', '并集（A ∪ B）', 'A 中追加 B 的全部元素'],
        ['A.removeAll(B)', '差集（A − B）', 'A 删除掉同时存在于 B 的元素'],
        ['A.retainAll(B)', '交集（A ∩ B）', 'A 只保留同时存在于 B 的元素'],
      ]}
    />
    <Callout type="tip" title="这些方法修改的是调用者本身">
      <InlineCode>A.removeAll(B)</InlineCode> 改变的是 A，B 不受影响。
      这是「原地修改」而非返回新集合，使用时一定要清楚哪个集合被改动了。
    </Callout>

    <Heading3>5. 完整示例：逐一演示通用方法</Heading3>
    <CodeBlock
      title="CollectionMethodDemo.java"
      code={`import java.util.ArrayList;
import java.util.Collection;

public class CollectionMethodDemo {
    public static void main(String[] args) {
        // 用 ArrayList 作为 Collection 的实现类
        Collection<String> c = new ArrayList<>();

        // 1. add：添加元素
        c.add("Java");
        c.add("Python");
        c.add("C++");
        System.out.println("add 之后: " + c);

        // 2. size / isEmpty
        System.out.println("元素个数 size: " + c.size());
        System.out.println("是否为空 isEmpty: " + c.isEmpty());

        // 3. contains：是否包含
        System.out.println("是否包含 Java: " + c.contains("Java"));
        System.out.println("是否包含 Go: " + c.contains("Go"));

        // 4. remove：删除
        boolean removed = c.remove("C++");
        System.out.println("删除 C++ 成功? " + removed + " -> " + c);
        System.out.println("删除不存在的 Go? " + c.remove("Go"));

        // 5. addAll：并集
        Collection<String> other = new ArrayList<>();
        other.add("Go");
        other.add("Rust");
        c.addAll(other);
        System.out.println("addAll 之后: " + c);

        // 6. toArray：转数组
        Object[] arr = c.toArray();
        System.out.println("转成数组长度: " + arr.length);

        // 7. clear：清空
        c.clear();
        System.out.println("clear 之后: " + c + ", isEmpty: " + c.isEmpty());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`add 之后: [Java, Python, C++]
元素个数 size: 3
是否为空 isEmpty: false
是否包含 Java: true
是否包含 Go: false
删除 C++ 成功? true -> [Java, Python]
删除不存在的 Go? false
addAll 之后: [Java, Python, Go, Rust]
转成数组长度: 4
clear 之后: [], isEmpty: true`}
    />
    <Paragraph>
      可以看到，<InlineCode>remove("Go")</InlineCode> 因集合中没有该元素而返回 <InlineCode>false</InlineCode>，
      集合内容不变；<InlineCode>clear()</InlineCode> 之后集合变为空 <InlineCode>[]</InlineCode>，
      <InlineCode>isEmpty()</InlineCode> 返回 <InlineCode>true</InlineCode>。
    </Paragraph>

    <Heading3>6. 示例：集合间的并、差、交运算</Heading3>
    <CodeBlock
      title="CollectionSetOps.java"
      code={`import java.util.ArrayList;
import java.util.Collection;

public class CollectionSetOps {
    public static void main(String[] args) {
        Collection<Integer> a = new ArrayList<>();
        a.add(1); a.add(2); a.add(3); a.add(4);

        Collection<Integer> b = new ArrayList<>();
        b.add(3); b.add(4); b.add(5);

        // 交集：retainAll（先拷贝一份避免破坏原集合）
        Collection<Integer> inter = new ArrayList<>(a);
        inter.retainAll(b);
        System.out.println("交集 A∩B: " + inter);

        // 差集：removeAll
        Collection<Integer> diff = new ArrayList<>(a);
        diff.removeAll(b);
        System.out.println("差集 A-B: " + diff);

        // 并集：addAll（注意 List 不会去重）
        Collection<Integer> union = new ArrayList<>(a);
        union.addAll(b);
        System.out.println("并集 A∪B(含重复): " + union);

        // containsAll：A 是否包含 B 全部
        System.out.println("A 包含 B 全部? " + a.containsAll(b));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`交集 A∩B: [3, 4]
差集 A-B: [1, 2]
并集 A∪B(含重复): [1, 2, 3, 4, 3, 4, 5]
A 包含 B 全部? false`}
    />
    <Callout type="warning" title="ArrayList 的并集会保留重复">
      上例并集出现了重复的 3、4，因为 <InlineCode>ArrayList</InlineCode> 允许重复。
      若想得到「真正的数学并集」（自动去重），应改用 <InlineCode>Set</InlineCode>（如 <InlineCode>HashSet</InlineCode>）来做 <InlineCode>addAll</InlineCode>。
    </Callout>

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>Collection</InlineCode> 是单列集合根接口，方法被 List / Set / Queue 共享。</ListItem>
        <ListItem><InlineCode>add</InlineCode>/<InlineCode>remove</InlineCode> 的返回值表示「集合是否发生变化」。</ListItem>
        <ListItem><InlineCode>contains</InlineCode>/<InlineCode>remove(Object)</InlineCode> 依赖元素的 <InlineCode>equals()</InlineCode> 方法。</ListItem>
        <ListItem><InlineCode>addAll</InlineCode>/<InlineCode>removeAll</InlineCode>/<InlineCode>retainAll</InlineCode> 分别对应并、差、交，且<Text bold>原地修改调用者</Text>。</ListItem>
        <ListItem><InlineCode>size</InlineCode>、<InlineCode>isEmpty</InlineCode>、<InlineCode>clear</InlineCode>、<InlineCode>toArray</InlineCode> 是基础查询/转换方法。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测返回值"
      code={`已知：
  Collection<String> c = new ArrayList<>();
  c.add("a");
  c.add("a");   // List 允许重复

问：以下各表达式的结果分别是什么？
  ① c.size()
  ② c.add("b")
  ③ c.remove("a")
  ④ c.remove("z")
  ⑤ c.contains("a")  （在执行完 ③ 之后）`}
      answerCode={`答案：
  ① 2     —— 两个 "a" 都被存进去了（List 允许重复）
  ② true  —— List 的 add 永远返回 true
  ③ true  —— 删除成功（删掉第一个 "a"）
  ④ false —— 集合中没有 "z"，删除失败
  ⑤ true  —— 删掉一个 "a" 后还剩一个 "a"，仍然包含

解析：add/remove 的返回值是「集合是否变化」；List 中 remove(Object) 只删第一个匹配项。`}
    />

    <CodeBlock
      qa
      title="练习2：求两个班级的共同选修课"
      code={`// 班级A选修：["语文", "数学", "英语", "物理"]
// 班级B选修：["数学", "英语", "化学"]
// 要求：用 Collection 的方法求出
//   ① 两班都选的课（交集）
//   ② 只有 A 选的课（差集 A-B）
// 注意不要破坏原始集合。

import java.util.ArrayList;
import java.util.Collection;

public class CommonCourse {
    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`import java.util.ArrayList;
import java.util.Collection;
import java.util.Arrays;

public class CommonCourse {
    public static void main(String[] args) {
        Collection<String> a = new ArrayList<>(Arrays.asList("语文", "数学", "英语", "物理"));
        Collection<String> b = new ArrayList<>(Arrays.asList("数学", "英语", "化学"));

        // 交集：拷贝 a 再 retainAll
        Collection<String> common = new ArrayList<>(a);
        common.retainAll(b);
        System.out.println("两班都选: " + common);

        // 差集：拷贝 a 再 removeAll
        Collection<String> onlyA = new ArrayList<>(a);
        onlyA.removeAll(b);
        System.out.println("只有A选: " + onlyA);
    }
}

/* 控制台输出：
两班都选: [数学, 英语]
只有A选: [语文, 物理]

解析：retainAll 求交集，removeAll 求差集，二者都会修改调用者，
      所以先用 new ArrayList<>(a) 拷贝一份，保护原始集合 a 不被破坏。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：自定义对象的 contains 陷阱"
      code={`// 下面代码期望输出 true，实际却输出 false，请说明原因并修正。

import java.util.ArrayList;
import java.util.Collection;

class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
}

public class ContainsTrap {
    public static void main(String[] args) {
        Collection<Point> points = new ArrayList<>();
        points.add(new Point(1, 2));
        System.out.println(points.contains(new Point(1, 2)));
    }
}`}
      answerCode={`// 原因：Point 没有重写 equals()，contains 调用默认的 Object.equals
// （比较地址）。两个 new Point(1,2) 是不同对象，地址不同，故返回 false。
// 修正：重写 equals（和 hashCode）。

import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
}

public class ContainsTrap {
    public static void main(String[] args) {
        Collection<Point> points = new ArrayList<>();
        points.add(new Point(1, 2));
        System.out.println(points.contains(new Point(1, 2)));
    }
}

/* 控制台输出：
true

解析：contains 依赖元素的 equals 判断相等。重写 equals 后，按内容(x,y)比较，
      两个坐标相同的 Point 被视为相等，contains 正确返回 true。
      重写 equals 时应同时重写 hashCode，保持二者一致（为后续 HashSet/HashMap 使用做准备）。
*/`}
    />
  </article>
);

export default index;
