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
    <Title>List 接口与 ArrayList</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>List</Text> 是 Collection 集合体系中最常用的子接口，它在父接口的基础上增加了
        <Text bold>「有序、有索引」</Text>的特性。
        <Text bold>ArrayList</Text> 是 List 最经典的实现类，底层基于可变数组，
        适合查询密集型场景。本节将完整讲解 List 新增的带索引方法、ArrayList 的底层原理、
        三种遍历方式，并重点剖析存储 Integer 时 remove 方法的重载陷阱。
      </Paragraph>
    </Callout>

    <Heading3>1. List 接口的四大特点</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>有序（ordered）</Text>：元素的存入顺序与取出顺序完全一致，底层按索引位置保存。
      </ListItem>
      <ListItem>
        <Text bold>有索引（indexed）</Text>：每个元素都有一个从 0 开始的整数索引，可按索引精确操作。
      </ListItem>
      <ListItem>
        <Text bold>元素可重复</Text>：同一个元素（equals 相等）可以多次出现在列表的不同位置。
      </ListItem>
      <ListItem>
        <Text bold>允许存 null</Text>：可以将 <InlineCode>null</InlineCode> 作为合法元素添加到列表。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="与 Set 的对比记忆">
      List：有序、有索引、可重复；Set：无序（LinkedHashSet 除外）、无索引、不可重复。
      两者互为对立，理解 List 的特点时对比 Set 会更清晰。
    </Callout>

    <Heading3>2. List 在 Collection 基础上新增的带索引方法</Heading3>
    <Paragraph>
      Collection 接口提供的方法（add、remove、contains、size、iterator 等）List 全部继承。
      在此之上，List 额外提供了一组<Text bold>带 int index 参数</Text>的方法：
    </Paragraph>
    <Table
      head={['方法签名', '返回值', '说明']}
      rows={[
        ['add(int index, E element)', 'void', '在指定索引处插入元素，原位置及之后的元素整体后移'],
        ['remove(int index)', 'E', '删除并返回指定索引处的元素，其后元素整体前移'],
        ['set(int index, E element)', 'E', '用新元素替换指定索引处的旧元素，返回被替换的旧元素'],
        ['get(int index)', 'E', '返回指定索引处的元素，不删除'],
        ['indexOf(Object o)', 'int', '返回元素第一次出现的索引，不存在返回 -1'],
        ['lastIndexOf(Object o)', 'int', '返回元素最后一次出现的索引，不存在返回 -1'],
        ['subList(int fromIndex, int toIndex)', 'List&lt;E&gt;', '返回 [fromIndex, toIndex) 范围的子列表视图'],
      ]}
    />
    <Callout type="warning" title="索引越界会抛出异常">
      使用 <InlineCode>get</InlineCode>、<InlineCode>set</InlineCode>、<InlineCode>add(index, e)</InlineCode>、
      <InlineCode>remove(index)</InlineCode> 时，若索引 &lt; 0 或 &ge; size()，
      将抛出 <InlineCode>IndexOutOfBoundsException</InlineCode>，操作前务必做范围检查。
    </Callout>

    <Heading3>3. remove(int index) 与 remove(Object o) 的重载陷阱</Heading3>
    <Paragraph>
      List 同时拥有两个 remove 方法：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>remove(int index)</InlineCode>：按<Text bold>索引</Text>删除，返回被删除的元素。
      </ListItem>
      <ListItem>
        <InlineCode>remove(Object o)</InlineCode>（继承自 Collection）：按<Text bold>元素值</Text>删除第一个匹配项，返回 boolean。
      </ListItem>
    </UnorderedList>
    <Callout type="danger" title="存储 Integer 时的重载陷阱">
      <Paragraph>
        当列表泛型为 <InlineCode>List&lt;Integer&gt;</InlineCode> 时，直接传入一个整型字面量（如 <InlineCode>list.remove(1)</InlineCode>），
        Java 会优先匹配 <InlineCode>remove(int index)</InlineCode>，即<Text bold>按索引删除</Text>，
        而不是删除值为 1 的元素！
      </Paragraph>
      <Paragraph>
        若要按<Text bold>值</Text>删除，必须显式装箱：<InlineCode>list.remove(Integer.valueOf(1))</InlineCode>
        或 <InlineCode>list.remove((Integer) 1)</InlineCode>，
        这样编译器才会匹配 <InlineCode>remove(Object o)</InlineCode>。
      </Paragraph>
      <CodeBlock
        title="Integer 列表的 remove 陷阱演示"
        code={`List<Integer> nums = new ArrayList<>();
nums.add(10);
nums.add(20);
nums.add(30);

// 陷阱：remove(1) 匹配的是 remove(int index)，删除索引 1 处的元素（值为 20）
nums.remove(1);
System.out.println(nums);   // [10, 30]

// 正确：删除值为 10 的元素，需要装箱
nums.remove(Integer.valueOf(10));
System.out.println(nums);   // [30]`}
      />
    </Callout>

    <Heading3>4. ArrayList 的底层原理</Heading3>
    <Paragraph>
      <InlineCode>ArrayList&lt;E&gt;</InlineCode> 底层维护一个 <InlineCode>Object[]</InlineCode> 数组。
      以下是其核心行为：
    </Paragraph>
    <Table
      head={['特性', '说明']}
      rows={[
        ['初始容量', '无参构造时初始为空数组；第一次 add 时扩容到 10'],
        ['扩容策略', '当数组满时，扩容为原来的 1.5 倍（oldCapacity + oldCapacity >> 1）'],
        ['查询（get）', 'O(1)，直接按下标访问数组，速度极快'],
        ['尾部增删', '均摊 O(1)，只操作末尾元素，不涉及元素移动'],
        ['中间增删', 'O(n)，需要将后续所有元素整体移动（System.arraycopy）'],
        ['线程安全', '非线程安全，多线程环境需用 Collections.synchronizedList 或 CopyOnWriteArrayList'],
      ]}
    />
    <Callout type="tip" title="预估容量时使用有参构造节省扩容开销">
      若已知数据量大约为 N，推荐使用 <InlineCode>new ArrayList&lt;&gt;(N)</InlineCode>
      预设初始容量，避免多次扩容带来的数组复制开销。
    </Callout>

    <Heading3>5. ArrayList 的三种遍历方式</Heading3>
    <Paragraph>
      ArrayList 支持三种常见遍历方式，各有适用场景：
    </Paragraph>
    <Table
      head={['遍历方式', '语法特点', '适用场景']}
      rows={[
        ['普通 for + get(index)', '可通过索引精确访问和修改元素', '需要操作索引时（增删改按位置）'],
        ['迭代器 Iterator', '通用遍历接口，支持安全删除（iterator.remove()）', '遍历中需要删除元素时'],
        ['增强 for（for-each）', '语法简洁，底层也是迭代器', '只读遍历，不需要索引时'],
      ]}
    />
    <Callout type="warning" title="遍历中不能用 list.remove() 删除元素">
      在增强 for 或迭代器遍历过程中，如果调用 <InlineCode>list.remove()</InlineCode>（集合本身的方法），
      会抛出 <InlineCode>ConcurrentModificationException</InlineCode>。
      遍历中需要删除元素，只能调用<Text bold>迭代器自身</Text>的 <InlineCode>iterator.remove()</InlineCode>。
    </Callout>

    <Heading3>6. 完整示例与控制台输出</Heading3>
    <Heading4>示例 1：List 带索引方法演示</Heading4>
    <Paragraph>
      演示 <InlineCode>add(index, e)</InlineCode>、<InlineCode>remove(index)</InlineCode>、
      <InlineCode>set</InlineCode>、<InlineCode>get</InlineCode>、
      <InlineCode>indexOf</InlineCode>、<InlineCode>subList</InlineCode> 的用法。
    </Paragraph>
    <CodeBlock
      title="ListMethodDemo.java"
      code={`import java.util.ArrayList;
import java.util.List;

public class ListMethodDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("苹果");
        list.add("香蕉");
        list.add("橙子");
        list.add("香蕉");   // 允许重复
        System.out.println("初始列表: " + list);

        // add(int index, E element)：在索引 1 处插入"草莓"，原来的"香蕉"后移
        list.add(1, "草莓");
        System.out.println("add(1, 草莓) 后: " + list);

        // remove(int index)：删除索引 2 处的元素（"香蕉"），返回被删元素
        String removed = list.remove(2);
        System.out.println("remove(2) 删除了: " + removed + "，当前列表: " + list);

        // set(int index, E element)：将索引 0 处替换为"葡萄"，返回旧值
        String old = list.set(0, "葡萄");
        System.out.println("set(0, 葡萄) 旧值为: " + old + "，当前列表: " + list);

        // get(int index)：获取索引 1 处的元素
        String item = list.get(1);
        System.out.println("get(1) = " + item);

        // indexOf / lastIndexOf：查找"香蕉"第一次和最后一次出现的索引
        System.out.println("indexOf(香蕉)     = " + list.indexOf("香蕉"));
        System.out.println("lastIndexOf(香蕉) = " + list.lastIndexOf("香蕉"));

        // subList(fromIndex, toIndex)：返回 [1, 3) 的子列表视图
        List<String> sub = list.subList(1, 3);
        System.out.println("subList(1, 3) = " + sub);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`初始列表: [苹果, 香蕉, 橙子, 香蕉]
add(1, 草莓) 后: [苹果, 草莓, 香蕉, 橙子, 香蕉]
remove(2) 删除了: 香蕉，当前列表: [苹果, 草莓, 橙子, 香蕉]
set(0, 葡萄) 旧值为: 苹果，当前列表: [葡萄, 草莓, 橙子, 香蕉]
get(1) = 草莓
indexOf(香蕉)     = 3
lastIndexOf(香蕉) = 3
subList(1, 3) = [草莓, 橙子]`}
    />
    <Paragraph>
      注意 <InlineCode>indexOf</InlineCode> 和 <InlineCode>lastIndexOf</InlineCode> 在只有一个「香蕉」时返回相同值 3。
      <InlineCode>subList(1, 3)</InlineCode> 是<Text bold>左闭右开</Text>区间，包含索引 1、2，不包含索引 3。
    </Paragraph>

    <Heading4>示例 2：Integer 列表的 remove 重载陷阱</Heading4>
    <CodeBlock
      title="RemoveOverloadDemo.java"
      code={`import java.util.ArrayList;
import java.util.List;

public class RemoveOverloadDemo {
    public static void main(String[] args) {
        List<Integer> scores = new ArrayList<>();
        scores.add(100);
        scores.add(90);
        scores.add(80);
        scores.add(70);
        System.out.println("原始: " + scores);

        // remove(int index)：删除索引 2 处的元素（值 80）
        scores.remove(2);
        System.out.println("remove(2) 后（按索引删）: " + scores);

        // remove(Integer.valueOf(90))：按值删除元素 90
        scores.remove(Integer.valueOf(90));
        System.out.println("remove(Integer.valueOf(90)) 后（按值删）: " + scores);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`原始: [100, 90, 80, 70]
remove(2) 后（按索引删）: [100, 90, 70]
remove(Integer.valueOf(90)) 后（按值删）: [100, 70]`}
    />
    <Paragraph>
      <InlineCode>remove(2)</InlineCode> 匹配的是 <InlineCode>remove(int index)</InlineCode>，删除了索引 2 处的 80，而非删除值为 2 的元素。
      要按值删除 90，必须传入 <InlineCode>Integer.valueOf(90)</InlineCode> 或 <InlineCode>(Integer) 90</InlineCode>。
    </Paragraph>

    <Heading4>示例 3：三种遍历方式对比</Heading4>
    <CodeBlock
      title="ArrayListTraverseDemo.java"
      code={`import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ArrayListTraverseDemo {
    public static void main(String[] args) {
        List<String> cities = new ArrayList<>();
        cities.add("北京");
        cities.add("上海");
        cities.add("广州");
        cities.add("深圳");

        // 方式一：普通 for + get(index)，可以通过索引精确操作
        System.out.println("=== 普通 for ===");
        for (int i = 0; i < cities.size(); i++) {
            System.out.println("索引" + i + ": " + cities.get(i));
        }

        // 方式二：迭代器，遍历中可调用 iterator.remove() 安全删除
        System.out.println("=== 迭代器 ===");
        Iterator<String> it = cities.iterator();
        while (it.hasNext()) {
            String city = it.next();
            System.out.println(city);
            if (city.equals("广州")) {
                it.remove();   // 安全删除，不会触发 ConcurrentModificationException
            }
        }
        System.out.println("删除广州后: " + cities);

        // 方式三：增强 for（for-each），只读遍历，语法最简洁
        System.out.println("=== 增强 for ===");
        for (String city : cities) {
            System.out.println(city);
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`=== 普通 for ===
索引0: 北京
索引1: 上海
索引2: 广州
索引3: 深圳
=== 迭代器 ===
北京
上海
广州
深圳
删除广州后: [北京, 上海, 深圳]
=== 增强 for ===
北京
上海
深圳`}
    />
    <Paragraph>
      迭代器遍历时调用了 <InlineCode>it.remove()</InlineCode> 删除了「广州」，
      这是遍历中删除元素的唯一安全方式。第三种增强 for 遍历的是删除后的列表，所以只有三个城市。
    </Paragraph>

    <Heading3>7. ArrayList 要点汇总</Heading3>
    <Table
      head={['维度', '说明']}
      rows={[
        ['接口关系', 'ArrayList 实现 List 接口，List 继承 Collection 接口'],
        ['底层结构', '可变 Object[] 数组，默认初始容量 10，扩容因子 1.5'],
        ['有序性', '存取顺序一致，按插入顺序维护索引'],
        ['重复 / null', '元素可重复，允许存 null'],
        ['查询效率', 'O(1) 随机访问，按索引直接定位数组'],
        ['增删效率', '尾部均摊 O(1)；中间或头部 O(n)，需移动后续元素'],
        ['线程安全', '非线程安全，并发场景需要额外同步'],
        ['remove 重载', '泛型为 Integer 时，remove(int) 按索引，remove(Integer) 按值'],
      ]}
    />
    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>List = Collection + 有序 + 有索引 + 可重复 + 允许 null。</ListItem>
        <ListItem>ArrayList 底层数组，查询 O(1)，中间增删 O(n)，适合读多写少场景。</ListItem>
        <ListItem>
          <InlineCode>List&lt;Integer&gt;</InlineCode> 中 <InlineCode>remove(n)</InlineCode> 是按索引，
          按值删除须写 <InlineCode>remove(Integer.valueOf(n))</InlineCode>。
        </ListItem>
        <ListItem>遍历中删除元素必须用迭代器的 <InlineCode>iterator.remove()</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：List 带索引方法综合操作"
      code={`// 要求：
// 1. 创建 List<String> 并依次添加："Java"、"Python"、"C++"、"Go"、"Python"
// 2. 在索引 2 处插入 "Rust"
// 3. 删除索引 0 处的元素，打印被删元素
// 4. 将索引 1 处的元素改为 "Kotlin"，打印旧值
// 5. 打印 "Python" 第一次和最后一次出现的索引
// 6. 打印整个列表

import java.util.ArrayList;
import java.util.List;

public class ListExercise1 {
    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`import java.util.ArrayList;
import java.util.List;

public class ListExercise1 {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("Java");
        list.add("Python");
        list.add("C++");
        list.add("Go");
        list.add("Python");

        list.add(2, "Rust");

        String removed = list.remove(0);
        System.out.println("被删除的元素: " + removed);

        String oldVal = list.set(1, "Kotlin");
        System.out.println("被替换的旧值: " + oldVal);

        System.out.println("Python 第一次出现索引: " + list.indexOf("Python"));
        System.out.println("Python 最后一次出现索引: " + list.lastIndexOf("Python"));

        System.out.println("最终列表: " + list);
    }
}

/* 控制台输出：
被删除的元素: Java
被替换的旧值: Python
Python 第一次出现索引: 3
Python 最后一次出现索引: 4
最终列表: [Python, Kotlin, Rust, C++, Go, Python]

解析：
  add(2, "Rust") 后列表为 [Java, Python, Rust, C++, Go, Python]
  remove(0) 删除 "Java" 后: [Python, Rust, C++, Go, Python]
  set(1, "Kotlin") 将 "Rust" 改为 "Kotlin": [Python, Kotlin, C++, Go, Python]
  indexOf("Python") 返回 0，lastIndexOf("Python") 返回 4
*/`}
    />

    <CodeBlock
      qa
      title="练习2：Integer 列表中正确按值删除"
      code={`// 要求：
// 创建 List<Integer>，添加元素：5、3、8、3、1
// 分别完成以下操作并打印结果：
//   (1) 删除索引为 1 的元素
//   (2) 删除值为 8 的元素（注意区分重载！）
//   (3) 打印最终列表

import java.util.ArrayList;
import java.util.List;

public class ListExercise2 {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>();
        nums.add(5);
        nums.add(3);
        nums.add(8);
        nums.add(3);
        nums.add(1);

        // (1) 删除索引为 1 的元素
        // 补全

        // (2) 删除值为 8 的元素
        // 补全

        System.out.println(nums);
    }
}`}
      answerCode={`import java.util.ArrayList;
import java.util.List;

public class ListExercise2 {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>();
        nums.add(5);
        nums.add(3);
        nums.add(8);
        nums.add(3);
        nums.add(1);

        // (1) remove(int index) -- 按索引删除索引 1 处的元素（值为 3）
        nums.remove(1);
        System.out.println("删除索引1后: " + nums);   // [5, 8, 3, 1]

        // (2) remove(Integer.valueOf(8)) -- 按值删除 8，必须显式装箱
        nums.remove(Integer.valueOf(8));
        System.out.println("删除值8后:   " + nums);   // [5, 3, 1]

        System.out.println("最终: " + nums);
    }
}

/* 控制台输出：
删除索引1后: [5, 8, 3, 1]
删除值8后:   [5, 3, 1]
最终: [5, 3, 1]

解析：
  remove(1) 匹配 remove(int index)，删除索引 1 处的 3，而不是删除值 1。
  删除值 8 必须写 remove(Integer.valueOf(8))，让编译器匹配 remove(Object o)。
  如果误写 remove(8)，会尝试删除索引 8，而此时列表只有 4 个元素，
  会抛出 IndexOutOfBoundsException。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：迭代器遍历并删除特定元素"
      code={`// 要求：
// 创建 List<String>，添加："Alice"、"Bob"、"Anna"、"Charlie"、"Amy"
// 用迭代器遍历，删除所有以字母 'A' 开头的名字，最后打印列表。

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ListExercise3 {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        names.add("Anna");
        names.add("Charlie");
        names.add("Amy");

        // 用迭代器删除以 'A' 开头的名字
        // 补全代码

        System.out.println(names);
    }
}`}
      answerCode={`import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ListExercise3 {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        names.add("Anna");
        names.add("Charlie");
        names.add("Amy");

        Iterator<String> it = names.iterator();
        while (it.hasNext()) {
            String name = it.next();
            if (name.startsWith("A")) {
                it.remove();   // 必须用迭代器的 remove，不能用 names.remove(name)
            }
        }

        System.out.println(names);
    }
}

/* 控制台输出：
[Bob, Charlie]

解析：
  Alice、Anna、Amy 都以 'A' 开头，被迭代器依次删除。
  遍历中若改用 names.remove(name) 则会触发 ConcurrentModificationException，
  因为集合结构被修改但迭代器的游标没有同步更新。
  迭代器的 remove() 会同步更新游标，是遍历中删除的唯一安全方式。
*/`}
    />
  </article>
);

export default index;
