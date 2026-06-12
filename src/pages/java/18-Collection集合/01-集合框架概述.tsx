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
    <Title>集合框架概述</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 集合框架（Java Collections Framework，JCF）是 Java 中存储和管理一组对象的核心基础设施。
        本节先从「为什么需要集合」入手，说明数组的局限性；然后介绍集合框架的两大体系——
        <Text bold>Collection（单列集合）</Text>与<Text bold>Map（双列集合）</Text>；
        再通过 ASCII 继承体系图和对比表全面呈现各接口与实现类的关系；
        最后解释泛型在集合中的重要作用。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要集合</Heading3>
    <Paragraph>
      在学习集合之前，我们已经掌握了数组。数组固然简单，但在实际开发中暴露出诸多不足：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>长度固定，无法动态扩容。</Text>
        数组一旦创建，<InlineCode>length</InlineCode> 就不可变。要在运行时动态存放数量未知的对象，
        只能手动创建更大数组再复制——繁琐且低效。
      </ListItem>
      <ListItem>
        <Text bold>增删操作麻烦。</Text>
        向数组中间插入或删除一个元素，需要手动移动后续所有元素，代码量大且容易出错。
      </ListItem>
      <ListItem>
        <Text bold>只能按索引访问，功能单一。</Text>
        数组不提供查找、排序、去重、键值映射等高级功能，所有业务逻辑都要自己实现。
      </ListItem>
      <ListItem>
        <Text bold>只能存储同一种类型（或 Object），类型安全弱。</Text>
        没有泛型约束的 <InlineCode>Object[]</InlineCode> 存取时需要强制类型转换，容易产生
        <InlineCode>ClassCastException</InlineCode>。
      </ListItem>
    </OrderedList>
    <Paragraph>
      集合框架正是为解决这些问题而生。它提供了一套接口 + 实现类的体系，
      涵盖动态数组、链表、哈希表、树形结构等多种底层数据结构，
      搭配泛型使用后既灵活又类型安全。
    </Paragraph>
    <Callout type="tip" title="集合只能存储引用类型">
      集合中存放的是对象的<Text bold>引用</Text>，不能直接存放基本数据类型（int、double 等）。
      存放基本类型时需要使用对应的包装类（<InlineCode>Integer</InlineCode>、<InlineCode>Double</InlineCode> 等），
      Java 的自动装箱/拆箱机制让这个过程对开发者透明。
    </Callout>

    <Heading3>2. 集合框架两大体系总览</Heading3>
    <Paragraph>
      Java 集合框架的顶层分为两大独立体系，根接口分别是
      <InlineCode>java.util.Collection</InlineCode> 和 <InlineCode>java.util.Map</InlineCode>：
    </Paragraph>
    <Table
      head={['体系', '根接口', '存储形式', '典型实现']}
      rows={[
        ['单列集合', 'Collection&lt;E&gt;', '每次存一个元素', 'ArrayList、HashSet、LinkedList'],
        ['双列集合', 'Map&lt;K, V&gt;', '每次存一对键值对（key-value）', 'HashMap、TreeMap、LinkedHashMap'],
      ]}
    />
    <Paragraph>
      两大体系相互独立，<InlineCode>Collection</InlineCode> 和 <InlineCode>Map</InlineCode>
      之间没有继承关系。本章重点介绍 <InlineCode>Collection</InlineCode> 体系。
    </Paragraph>

    <Heading3>3. Collection 体系继承图</Heading3>
    <Paragraph>
      <InlineCode>Collection&lt;E&gt;</InlineCode> 接口下分三个主要子接口：
      <InlineCode>List</InlineCode>（有序可重复）、<InlineCode>Set</InlineCode>（无序不重复）、
      <InlineCode>Queue</InlineCode>（队列）。
    </Paragraph>
    <CodeBlock
      language="text"
      title="Collection 体系继承关系（ASCII 图）"
      code={`java.util.Collection<E>  （接口）
├── java.util.List<E>        （接口：有序、可重复、可按索引访问）
│   ├── ArrayList<E>         （实现类：动态数组，查询快，增删慢）
│   ├── LinkedList<E>        （实现类：双向链表，增删快，查询慢；同时实现 Queue）
│   └── Vector<E>            （实现类：线程安全的动态数组，已过时，了解即可）
│
├── java.util.Set<E>         （接口：无序、不重复）
│   ├── HashSet<E>           （实现类：哈希表，存取最快，完全无序）
│   ├── LinkedHashSet<E>     （实现类：哈希表 + 双向链表，保留插入顺序）
│   └── TreeSet<E>           （实现类：红黑树，自动按自然顺序或比较器排序）
│
└── java.util.Queue<E>       （接口：先进先出队列）
    ├── LinkedList<E>        （实现类：同时实现 List 和 Queue）
    ├── ArrayDeque<E>        （实现类：双端队列，可替代 Stack）
    └── PriorityQueue<E>     （实现类：优先级队列，按元素优先级出队）`}
    />
    <Callout type="tip" title="LinkedList 同时实现 List 和 Deque">
      <InlineCode>LinkedList</InlineCode> 实现了 <InlineCode>List</InlineCode> 接口，
      也实现了 <InlineCode>Deque</InlineCode>（双端队列）接口，因此它既可以当列表用，
      也可以当队列或栈用，是一个非常灵活的实现类。
    </Callout>

    <Heading3>4. Map 体系继承图</Heading3>
    <Paragraph>
      <InlineCode>Map&lt;K, V&gt;</InlineCode> 存储键值对，键不可重复，值可以重复。
      常见实现类如下：
    </Paragraph>
    <CodeBlock
      language="text"
      title="Map 体系继承关系（ASCII 图）"
      code={`java.util.Map<K, V>      （接口）
├── HashMap<K, V>            （实现类：哈希表，存取最快，键无序，允许一个 null 键）
├── LinkedHashMap<K, V>      （实现类：哈希表 + 双向链表，保留键的插入顺序）
├── TreeMap<K, V>            （实现类：红黑树，按键的自然顺序或比较器排序）
└── Hashtable<K, V>          （实现类：线程安全，已过时，不允许 null 键或 null 值）`}
    />
    <Table
      head={['实现类', '底层结构', '键是否有序', '线程安全', '允许 null 键']}
      rows={[
        ['HashMap', '哈希表', '无序', '否', '是（最多一个）'],
        ['LinkedHashMap', '哈希表 + 双向链表', '按插入顺序', '否', '是'],
        ['TreeMap', '红黑树', '按键排序', '否', '否'],
        ['Hashtable', '哈希表', '无序', '是（已过时）', '否'],
      ]}
    />

    <Heading3>5. 接口与实现类的关系</Heading3>
    <Paragraph>
      集合框架采用<Text bold>接口 + 实现类</Text>的设计模式，两者分工明确：
    </Paragraph>
    <Table
      head={['角色', '职责', '示例']}
      rows={[
        ['接口', '定义规范：有哪些方法、语义是什么', 'Collection、List、Set、Map'],
        ['实现类', '提供具体的存储结构与算法实现', 'ArrayList、HashSet、HashMap'],
      ]}
    />
    <Paragraph>
      开发中推荐<Text bold>面向接口编程</Text>：变量类型声明为接口，
      实例化时才指定具体实现类。这样切换实现类时只需改一处 <InlineCode>new</InlineCode>，
      其余代码不变：
    </Paragraph>
    <CodeBlock
      language="text"
      title="面向接口编程示意"
      code={`// 推荐：左边是接口，右边才是具体实现
List<String> list = new ArrayList<>();
Set<String>  set  = new HashSet<>();
Map<String, Integer> map = new HashMap<>();

// 不推荐：左右都写成实现类，扩展性差
ArrayList<String> list2 = new ArrayList<>();`}
    />

    <Heading3>6. 集合 vs 数组对比</Heading3>
    <Table
      head={['对比维度', '数组', '集合']}
      rows={[
        ['长度', '固定，创建后不可变', '动态，可自动扩容'],
        ['元素类型', '基本类型或引用类型均可', '只能存引用类型（基本类型需包装）'],
        ['增删操作', '需手动移位，繁琐', '提供 add / remove 等方法，方便'],
        ['功能丰富度', '仅基础索引访问', '排序、查找、去重、遍历等一应俱全'],
        ['类型安全', '弱（Object[] 需强转）', '泛型保证编译期类型检查，无需强转'],
        ['适用场景', '数量固定、追求极致性能', '数量动态变化、需要丰富操作'],
      ]}
    />

    <Heading3>7. 泛型在集合中的意义</Heading3>
    <Paragraph>
      在 JDK 5 之前，集合存取元素都使用 <InlineCode>Object</InlineCode> 类型，
      存入任何对象都可以，但取出时必须强制类型转换，稍有不慎就会抛出
      <InlineCode>ClassCastException</InlineCode>（运行时错误，难以排查）。
    </Paragraph>
    <Paragraph>
      JDK 5 引入泛型后，集合可以在声明时指定元素类型，例如
      <InlineCode>List&lt;String&gt;</InlineCode> 表示只存字符串。好处有两点：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>编译期类型检查。</Text>
        往 <InlineCode>List&lt;String&gt;</InlineCode> 里加入 <InlineCode>Integer</InlineCode> 会直接报编译错误，
        而不是等到运行时才崩溃。
      </ListItem>
      <ListItem>
        <Text bold>取出时无需强转。</Text>
        <InlineCode>list.get(0)</InlineCode> 直接返回 <InlineCode>String</InlineCode>，
        不再需要写 <InlineCode>(String) list.get(0)</InlineCode>，代码更简洁。
      </ListItem>
    </OrderedList>
    <CodeBlock
      title="泛型对比示例"
      code={`import java.util.ArrayList;
import java.util.List;

public class GenericDemo {
    public static void main(String[] args) {
        // 不用泛型（旧写法，不推荐）
        ArrayList rawList = new ArrayList();
        rawList.add("hello");
        rawList.add(100);       // 编译通过，但逻辑混乱
        String s = (String) rawList.get(0);  // 必须强转
        // String s2 = (String) rawList.get(1); // 运行时 ClassCastException！

        // 使用泛型（推荐）
        List<String> typedList = new ArrayList<>();
        typedList.add("hello");
        typedList.add("world");
        // typedList.add(100);  // 编译错误，类型不匹配
        String s3 = typedList.get(0);   // 无需强转，直接得到 String
        System.out.println("泛型取值：" + s3);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`泛型取值：hello`} />
    <Callout type="warning" title="泛型只在编译期有效（类型擦除）">
      Java 的泛型是编译期语法糖，编译后字节码中并不保留泛型信息（类型擦除）。
      这意味着运行时 <InlineCode>List&lt;String&gt;</InlineCode> 和 <InlineCode>List&lt;Integer&gt;</InlineCode>
      实际上是同一个类。这是 Java 泛型与 C++ 模板的本质区别，在集合使用中了解这一点即可。
    </Callout>

    <Heading3>8. 集合框架总览示例</Heading3>
    <Paragraph>
      下面用一个综合示例，简单演示三大核心集合的基本用法，后续章节会逐一深入：
    </Paragraph>
    <CodeBlock
      title="CollectionOverview.java"
      code={`import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class CollectionOverview {
    public static void main(String[] args) {
        // List：有序、可重复
        List<String> list = new ArrayList<>();
        list.add("Java");
        list.add("Python");
        list.add("Java");       // 允许重复
        System.out.println("List: " + list);
        System.out.println("List 大小: " + list.size());

        System.out.println();

        // Set：无序（HashSet）、不重复
        Set<String> set = new HashSet<>();
        set.add("Java");
        set.add("Python");
        set.add("Java");        // 重复，自动忽略
        System.out.println("Set: " + set);
        System.out.println("Set 大小: " + set.size());

        System.out.println();

        // Map：键值对，键不可重复
        Map<String, Integer> map = new HashMap<>();
        map.put("张三", 90);
        map.put("李四", 85);
        map.put("张三", 95);    // 键重复，后者覆盖前者
        System.out.println("Map: " + map);
        System.out.println("张三的成绩: " + map.get("张三"));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`List: [Java, Python, Java]
List 大小: 3

Set: [Java, Python]
Set 大小: 2

Map: {李四=85, 张三=95}
张三的成绩: 95`}
    />
    <Paragraph>
      从输出可以清楚看到三者特点：<InlineCode>List</InlineCode> 保留了两个 "Java"；
      <InlineCode>Set</InlineCode> 自动去重只剩一个 "Java"；
      <InlineCode>Map</InlineCode> 中 "张三" 的值被覆盖为 95。
      <InlineCode>HashSet</InlineCode> 输出的顺序不一定与插入顺序相同，这是「无序」的体现。
    </Paragraph>

    <Heading3>9. 各实现类选型指南</Heading3>
    <Table
      head={['需求场景', '推荐集合']}
      rows={[
        ['需要按索引随机访问，增删较少', 'ArrayList'],
        ['需要频繁在头尾或中间增删，不常随机访问', 'LinkedList'],
        ['需要去重，不关心顺序', 'HashSet'],
        ['需要去重，同时保留插入顺序', 'LinkedHashSet'],
        ['需要去重，同时按元素自然顺序排列', 'TreeSet'],
        ['需要键值对映射，不关心键的顺序', 'HashMap'],
        ['需要键值对映射，保留键的插入顺序', 'LinkedHashMap'],
        ['需要键值对映射，键按自然顺序排列', 'TreeMap'],
        ['需要先进先出队列', 'ArrayDeque 或 LinkedList'],
        ['需要按优先级出队', 'PriorityQueue'],
      ]}
    />
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>集合解决了数组长度固定、增删麻烦、功能弱的三大痛点。</ListItem>
        <ListItem>集合框架两大体系：<InlineCode>Collection&lt;E&gt;</InlineCode>（单列）和 <InlineCode>Map&lt;K, V&gt;</InlineCode>（双列）。</ListItem>
        <ListItem>Collection 下分 List（有序可重复）、Set（无序不重复）、Queue（队列）三个子接口。</ListItem>
        <ListItem>推荐面向接口编程：声明用接口类型，实例化才指定具体实现类。</ListItem>
        <ListItem>泛型让集合在编译期就保证类型安全，取出元素无需强转。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>10. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断集合特性"
      code={`问：根据以下需求，分别选择最合适的集合实现类，并说明原因。

① 存储一批学生姓名，姓名可以重复，需要按插入顺序遍历。
② 存储一批学生学号，学号不能重复，需要按学号从小到大排序。
③ 存储学生姓名与成绩的对应关系，需要通过姓名快速查找成绩，不关心顺序。`}
      answerCode={`答案：

① ArrayList<String>
   理由：List 有序可重复，ArrayList 按插入顺序存储，满足「允许重复 + 保持顺序」的需求。

② TreeSet<Integer>（或 TreeSet<String>，取决于学号类型）
   理由：Set 不重复，TreeSet 底层是红黑树，自动按自然顺序（数字从小到大）排序。

③ HashMap<String, Integer>
   理由：Map 存储键值对，HashMap 按键（姓名）快速查找值（成绩），不关心顺序时首选。

解析：选集合的核心维度——
  是否重复 → 重复选 List，不重复选 Set；
  是否需要键值对 → 需要选 Map；
  是否需要有序 → 需要顺序选 Linked 系列或 Tree 系列。`}
    />

    <CodeBlock
      qa
      title="练习2：泛型的类型安全"
      code={`// 下面代码有一处编译错误，请找出并改正，然后补全 main 方法使其正常运行。
// 预期输出：
//   苹果
//   香蕉

import java.util.ArrayList;
import java.util.List;

public class FruitList {
    public static void main(String[] args) {
        List<String> fruits = new ArrayList<>();
        fruits.add("苹果");
        fruits.add("香蕉");
        fruits.add(100);    // 此处有错误

        for (/* 补全 */ f : fruits) {
            System.out.println(f);
        }
    }
}`}
      answerCode={`import java.util.ArrayList;
import java.util.List;

public class FruitList {
    public static void main(String[] args) {
        List<String> fruits = new ArrayList<>();
        fruits.add("苹果");
        fruits.add("香蕉");
        // fruits.add(100);  // 编译错误：int 无法自动转为 String，应删除此行

        for (String f : fruits) {   // 补全泛型类型 String
            System.out.println(f);
        }
    }
}

/* 控制台输出：
苹果
香蕉

解析：List<String> 声明了集合只存 String，添加 int 字面量 100 时编译器直接报错。
      增强 for 循环的循环变量类型也应与泛型一致，写 String f 即可，无需强转。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：List 与 Set 的区别验证"
      code={`// 要求：分别用 ArrayList 和 HashSet 存储以下 5 个字符串：
// "banana", "apple", "cherry", "apple", "banana"
// 打印两者的内容和 size，观察区别。

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ListVsSet {
    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ListVsSet {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("banana");
        list.add("apple");
        list.add("cherry");
        list.add("apple");   // 重复
        list.add("banana");  // 重复
        System.out.println("ArrayList 内容: " + list);
        System.out.println("ArrayList 大小: " + list.size());

        System.out.println();

        Set<String> set = new HashSet<>();
        set.add("banana");
        set.add("apple");
        set.add("cherry");
        set.add("apple");    // 重复，忽略
        set.add("banana");   // 重复，忽略
        System.out.println("HashSet 内容: " + set);
        System.out.println("HashSet 大小: " + set.size());
    }
}

/* 控制台输出（HashSet 输出顺序可能不同）：
ArrayList 内容: [banana, apple, cherry, apple, banana]
ArrayList 大小: 5

HashSet 内容: [banana, cherry, apple]
HashSet 大小: 3

解析：ArrayList 保留了全部 5 个元素（含重复），size 为 5；
      HashSet 自动去重，3 个不同字符串只保留一份，size 为 3。
      HashSet 输出顺序不保证与插入顺序相同，这就是「无序」。
*/`}
    />
  </article>
);

export default index;
