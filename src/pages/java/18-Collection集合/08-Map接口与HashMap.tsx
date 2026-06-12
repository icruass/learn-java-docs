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
    <Title>Map 接口与 HashMap</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前面学习的 List、Set 都是<Text bold>单列集合</Text>，每个元素只存一个值。
        而 <Text bold>Map</Text> 是<Text bold>双列集合</Text>，每次存储一对数据：
        <Text bold>键（key）</Text> 和 <Text bold>值（value）</Text>，合称一个
        <Text bold>键值对（Entry）</Text>。Map 中 key 唯一、value 可重复，
        一个 key 对应唯一一个 value，通过 key 可以快速找到对应的 value。
        本节重点掌握：Map 接口的常用方法、
        HashMap 的底层特点、两种遍历方式，以及自定义对象作为 key 时的注意事项。
      </Paragraph>
    </Callout>

    <Heading3>1. Map 接口概述</Heading3>
    <Paragraph>
      <InlineCode>java.util.Map&lt;K, V&gt;</InlineCode> 是所有双列集合的顶层接口，
      其中 <InlineCode>K</InlineCode> 表示键的类型，<InlineCode>V</InlineCode> 表示值的类型。
      Map 与 Collection 是<Text bold>并列</Text>的两大集合体系，Map 不继承 Collection。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>key 唯一</Text>：同一 Map 中不允许存在重复的 key；向已存在的 key 再次 put，会覆盖原来的 value。
      </ListItem>
      <ListItem>
        <Text bold>value 可重复</Text>：不同的 key 可以映射到相同的 value。
      </ListItem>
      <ListItem>
        <Text bold>key-value 一一对应</Text>：一个 key 只能对应一个 value，通过 key 可以精准找到 value。
      </ListItem>
      <ListItem>
        Map 中的每一对键值对都被封装为一个 <InlineCode>Map.Entry&lt;K, V&gt;</InlineCode> 对象。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="Map 与 Collection 的关系">
      Map 和 Collection 是 Java 集合框架中并列的两大体系。Collection 存单个元素，
      Map 存键值对。两者互不继承，但 Map 提供的 <InlineCode>keySet()</InlineCode>、
      <InlineCode>values()</InlineCode>、<InlineCode>entrySet()</InlineCode>
      方法可以将 Map 的内容转成 Collection 视图，从而借助 for-each 遍历。
    </Callout>

    <Heading3>2. Map 接口的常用方法</Heading3>
    <Table
      head={['方法签名', '说明', '返回值说明']}
      rows={[
        ['put(K key, V value)', '添加/覆盖键值对', 'key 已存在则返回被覆盖的旧 value；key 不存在则返回 null'],
        ['get(Object key)', '根据 key 获取对应的 value', '找不到 key 则返回 null'],
        ['remove(Object key)', '根据 key 删除对应的键值对', '返回被删除的 value；key 不存在则返回 null'],
        ['containsKey(Object key)', '判断是否包含指定 key', '返回 boolean'],
        ['containsValue(Object value)', '判断是否包含指定 value', '返回 boolean'],
        ['size()', '获取键值对的总数量', '返回 int'],
        ['isEmpty()', '判断 Map 是否为空', '返回 boolean'],
        ['clear()', '清空所有键值对', '返回 void'],
        ['keySet()', '获取所有 key 组成的 Set 集合', '返回 Set&lt;K&gt;'],
        ['values()', '获取所有 value 组成的 Collection', '返回 Collection&lt;V&gt;'],
        ['entrySet()', '获取所有键值对组成的 Set 集合', '返回 Set&lt;Map.Entry&lt;K, V&gt;&gt;'],
      ]}
    />
    <Callout type="warning" title="put 方法的返回值容易被忽略">
      <InlineCode>put(K key, V value)</InlineCode> 有返回值：
      若 key <Text bold>已存在</Text>，则用新 value 覆盖旧 value，并<Text bold>返回旧 value</Text>；
      若 key <Text bold>不存在</Text>，则新增该键值对，返回 <InlineCode>null</InlineCode>。
      实际开发中通常不关心返回值，直接调用 put 即可；但理解此行为有助于排查 bug。
    </Callout>

    <Heading3>3. HashMap 底层原理与特点</Heading3>
    <Paragraph>
      <InlineCode>java.util.HashMap&lt;K, V&gt;</InlineCode> 是 Map 接口最常用的实现类，
      底层采用<Text bold>哈希表</Text>（数组 + 链表/红黑树）存储数据，与 HashSet 底层结构相同——
      实际上 HashSet 内部就持有一个 HashMap。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>存取无序</Text>：遍历顺序与插入顺序无关，每次遍历结果可能不同。
      </ListItem>
      <ListItem>
        <Text bold>key 不允许重复</Text>：依赖 key 的 <InlineCode>hashCode()</InlineCode> 和
        <InlineCode>equals()</InlineCode> 判断唯一性。
      </ListItem>
      <ListItem>
        <Text bold>允许 null 键和 null 值</Text>：HashMap 允许一个 null key 和任意数量的 null value。
      </ListItem>
      <ListItem>
        <Text bold>线程不安全</Text>：多线程并发读写时不保证安全，需要时使用
        <InlineCode>ConcurrentHashMap</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>查询效率高</Text>：理想情况下 get/put 时间复杂度为 O(1)。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="Java 8 对 HashMap 的优化">
      Java 8 起，当同一个桶（bucket）中的链表长度超过 8 且数组长度不小于 64 时，
      链表会自动转换为<Text bold>红黑树</Text>，查询时间复杂度从 O(n) 降至 O(log n)，
      进一步提升了性能。
    </Callout>

    <Heading3>4. 两种遍历方式</Heading3>
    <Heading4>方式一：keySet() 遍历</Heading4>
    <Paragraph>
      先调用 <InlineCode>keySet()</InlineCode> 拿到所有 key 的 <InlineCode>Set&lt;K&gt;</InlineCode>，
      再用 for-each 遍历 Set，每次通过 <InlineCode>get(key)</InlineCode> 取对应的 value。
      这种方式<Text bold>直观易懂</Text>，但每次 get 需要再查一次哈希表，效率略低。
    </Paragraph>
    <CodeBlock
      language="text"
      title="keySet() 遍历格式"
      code={`for (K key : map.keySet()) {
    V value = map.get(key);
    // 处理 key 和 value
}`}
    />

    <Heading4>方式二：entrySet() 遍历（推荐）</Heading4>
    <Paragraph>
      调用 <InlineCode>entrySet()</InlineCode> 直接拿到所有键值对的
      <InlineCode>Set&lt;Map.Entry&lt;K, V&gt;&gt;</InlineCode>，每个 Entry 同时包含
      key 和 value，通过 <InlineCode>entry.getKey()</InlineCode> 和
      <InlineCode>entry.getValue()</InlineCode> 直接获取，无需二次 get 查找，
      <Text bold>效率更高，推荐使用</Text>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="entrySet() 遍历格式"
      code={`for (Map.Entry<K, V> entry : map.entrySet()) {
    K key   = entry.getKey();
    V value = entry.getValue();
    // 处理 key 和 value
}`}
    />
    <Table
      head={['遍历方式', '核心方法', '优点', '缺点']}
      rows={[
        ['keySet()', 'map.keySet() + map.get(key)', '直观，适合只需要 key 的场景', '多一次 get 查找，效率略低'],
        ['entrySet()', 'map.entrySet() + entry.getKey/getValue', '一次获取 key 和 value，效率高', '写法稍长，但推荐'],
      ]}
    />

    <Heading3>5. 自定义对象作 key 必须重写 hashCode 和 equals</Heading3>
    <Paragraph>
      HashMap 判断两个 key 是否相同，需要先比较 <InlineCode>hashCode()</InlineCode>，
      哈希值相同时再用 <InlineCode>equals()</InlineCode> 比较内容。
      若使用自定义类作为 key 而<Text bold>不重写</Text>这两个方法，
      则 HashMap 默认使用继承自 <InlineCode>Object</InlineCode> 的版本——
      比较的是<Text bold>对象地址</Text>，内容相同但地址不同的两个对象会被视为不同的 key，
      导致重复存储、无法正确 get 等问题。
    </Paragraph>
    <Callout type="danger" title="自定义类作 key：必须同时重写 hashCode 和 equals">
      规则：<Text bold>两个对象 equals 为 true，其 hashCode 必须相同</Text>。
      若只重写 equals 不重写 hashCode，HashMap 可能将逻辑相等的 key 分到不同桶，
      导致 get 返回 null 的 bug。IDE（如 IntelliJ IDEA）可以自动生成这两个方法，建议一并生成。
    </Callout>

    <Heading3>6. 完整示例：增删改查与两种遍历</Heading3>
    <Paragraph>
      用 <InlineCode>HashMap&lt;String, Integer&gt;</InlineCode> 存储学生姓名与分数，
      演示 put（新增与覆盖）、get、remove、containsKey，以及 keySet 和 entrySet 两种遍历。
    </Paragraph>
    <CodeBlock
      title="HashMapDemo.java"
      code={`import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class HashMapDemo {
    public static void main(String[] args) {
        // 1. 创建 HashMap
        Map<String, Integer> map = new HashMap<String, Integer>();

        // 2. put：新增键值对
        map.put("Alice", 90);
        map.put("Bob",   85);
        map.put("Carol", 92);
        map.put("Dave",  78);
        System.out.println("初始 map：" + map);
        System.out.println("size = " + map.size());

        // 3. put：key 已存在则覆盖，返回旧值
        Integer oldScore = map.put("Bob", 95);
        System.out.println("\\n覆盖 Bob 的分数，旧值 = " + oldScore);
        System.out.println("覆盖后 map：" + map);

        // 4. get：根据 key 获取 value
        System.out.println("\\nAlice 的分数：" + map.get("Alice"));
        System.out.println("不存在的 key 返回：" + map.get("Zara"));

        // 5. containsKey / containsValue
        System.out.println("\\n包含 key Carol？" + map.containsKey("Carol"));
        System.out.println("包含 value 100？" + map.containsValue(100));

        // 6. remove：根据 key 删除
        Integer removed = map.remove("Dave");
        System.out.println("\\n删除 Dave，返回旧值 = " + removed);
        System.out.println("删除后 map：" + map);

        // 7. 遍历方式一：keySet()
        System.out.println("\\n--- 方式一：keySet() 遍历 ---");
        for (String key : map.keySet()) {
            System.out.println(key + " -> " + map.get(key));
        }

        // 8. 遍历方式二：entrySet()（推荐）
        System.out.println("\\n--- 方式二：entrySet() 遍历（推荐）---");
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }

        // 9. 遍历所有 value
        System.out.println("\\n所有分数：" + map.values());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`初始 map：{Alice=90, Carol=92, Bob=85, Dave=78}
size = 4

覆盖 Bob 的分数，旧值 = 85
覆盖后 map：{Alice=90, Carol=92, Bob=95, Dave=78}

Alice 的分数：90
不存在的 key 返回：null

包含 key Carol？true
包含 value 100？false

删除 Dave，返回旧值 = 78
删除后 map：{Alice=90, Carol=92, Bob=95}

--- 方式一：keySet() 遍历 ---
Alice -> 90
Carol -> 92
Bob -> 95

--- 方式二：entrySet() 遍历（推荐）---
Alice -> 90
Carol -> 92
Bob -> 95

所有分数：[90, 92, 95]`}
    />
    <Paragraph>
      注意：HashMap 遍历顺序与插入顺序无关（本例中 Alice、Carol、Bob 的顺序由哈希值决定），
      两种遍历方式输出的内容完全相同，只是获取 value 的方式不同。
      <InlineCode>entrySet()</InlineCode> 方式避免了重复的哈希查找，大数据量时性能更优。
    </Paragraph>

    <Heading3>7. 示例：自定义对象作 key</Heading3>
    <Paragraph>
      以学生对象 <InlineCode>Student</InlineCode> 作为 key，演示必须重写
      <InlineCode>hashCode()</InlineCode> 和 <InlineCode>equals()</InlineCode> 才能正确去重。
    </Paragraph>
    <CodeBlock
      title="Student.java"
      code={`import java.util.Objects;

public class Student {
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 必须重写 hashCode 和 equals，否则内容相同的对象会被视为不同 key
    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Student)) return false;
        Student s = (Student) o;
        return age == s.age && Objects.equals(name, s.name);
    }

    @Override
    public String toString() {
        return name + "(" + age + ")";
    }
}`}
    />
    <CodeBlock
      title="StudentMapDemo.java"
      code={`import java.util.HashMap;
import java.util.Map;

public class StudentMapDemo {
    public static void main(String[] args) {
        Map<Student, String> map = new HashMap<Student, String>();

        map.put(new Student("张三", 18), "计算机系");
        map.put(new Student("李四", 20), "数学系");
        // 与第一个 key 内容相同，会覆盖（因为重写了 hashCode/equals）
        map.put(new Student("张三", 18), "软件工程系");

        System.out.println("map.size() = " + map.size());  // 2，而非 3

        for (Map.Entry<Student, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`map.size() = 2
张三(18) -> 软件工程系
李四(20) -> 数学系`}
    />
    <Paragraph>
      第三次 <InlineCode>put(new Student("张三", 18), "软件工程系")</InlineCode>
      与第一次的 key 内容相同（hashCode 和 equals 均一致），因此覆盖了"计算机系"，
      最终 map 只有 2 个键值对。若不重写 hashCode/equals，则会存入 3 个键值对，
      且 <InlineCode>get(new Student("张三", 18))</InlineCode> 会返回 null。
    </Paragraph>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：统计字符串中每个字符出现的次数"
      code={`// 要求：
// 给定字符串 "abracadabra"，统计每个字符出现的次数。
// 用 HashMap<Character, Integer> 存储，key 为字符，value 为出现次数。
// 最后用 entrySet() 遍历打印结果，格式：字符=次数

import java.util.HashMap;
import java.util.Map;

public class CharCount {
    public static void main(String[] args) {
        String str = "abracadabra";

        Map<Character, Integer> map = new HashMap<Character, Integer>();

        // 补全：统计每个字符出现的次数

        // 补全：用 entrySet() 遍历打印
    }
}`}
      answerCode={`import java.util.HashMap;
import java.util.Map;

public class CharCount {
    public static void main(String[] args) {
        String str = "abracadabra";

        Map<Character, Integer> map = new HashMap<Character, Integer>();

        // 统计每个字符出现的次数
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (map.containsKey(c)) {
                map.put(c, map.get(c) + 1);  // key 已存在，次数 +1
            } else {
                map.put(c, 1);               // key 不存在，初始化为 1
            }
        }

        // 用 entrySet() 遍历打印
        for (Map.Entry<Character, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + "=" + entry.getValue());
        }
    }
}

/* 控制台输出（HashMap 无序，实际顺序可能不同）：
a=5
b=2
r=2
c=1
d=1

解析：遍历字符串每个字符，先用 containsKey 判断是否已记录过。
      若已存在，则取出旧次数加 1 再 put 回去（覆盖旧值）；
      若不存在，则 put(c, 1) 初始化。
      最终 "abracadabra" 中 a 出现 5 次、b 和 r 各 2 次、c 和 d 各 1 次。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：商品库存管理"
      code={`// 要求：
// 用 HashMap<String, Integer> 模拟商品库存（key=商品名，value=库存数量）。
// 完成以下操作：
//   1. 添加商品：苹果=100，香蕉=50，橙子=80
//   2. 进货：苹果增加 30（即苹果库存变为 130）
//   3. 售出：香蕉减少 20（即香蕉库存变为 30）
//   4. 下架：删除橙子
//   5. 查询：打印是否存在"葡萄"，以及"苹果"的当前库存
//   6. 用 entrySet() 遍历打印最终库存清单，格式：商品名：库存数量

import java.util.HashMap;
import java.util.Map;

public class StockManager {
    public static void main(String[] args) {
        Map<String, Integer> stock = new HashMap<String, Integer>();

        // 补全上述 6 步操作
    }
}`}
      answerCode={`import java.util.HashMap;
import java.util.Map;

public class StockManager {
    public static void main(String[] args) {
        Map<String, Integer> stock = new HashMap<String, Integer>();

        // 1. 添加商品
        stock.put("苹果", 100);
        stock.put("香蕉", 50);
        stock.put("橙子", 80);

        // 2. 进货：苹果增加 30
        stock.put("苹果", stock.get("苹果") + 30);

        // 3. 售出：香蕉减少 20
        stock.put("香蕉", stock.get("香蕉") - 20);

        // 4. 下架：删除橙子
        stock.remove("橙子");

        // 5. 查询
        System.out.println("是否存在葡萄：" + stock.containsKey("葡萄"));
        System.out.println("苹果当前库存：" + stock.get("苹果"));

        // 6. 遍历打印最终库存清单
        System.out.println("\\n--- 库存清单 ---");
        for (Map.Entry<String, Integer> entry : stock.entrySet()) {
            System.out.println(entry.getKey() + "：" + entry.getValue());
        }
    }
}

/* 控制台输出：
是否存在葡萄：false
苹果当前库存：130

--- 库存清单 ---
苹果：130
香蕉：30

解析：
  进货用 put("苹果", get("苹果") + 30) 先取旧值再加上增量覆盖；
  售出同理，取旧值减去销量再覆盖；
  remove("橙子") 删除橙子条目；
  最终 map 只剩苹果和香蕉两条记录。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：两种遍历方式对比输出"
      code={`// 要求：
// 给定如下 map，分别用 keySet() 和 entrySet() 两种方式遍历，
// 打印格式均为 "key -> value"，观察两种方式输出结果是否一致。

import java.util.HashMap;
import java.util.Map;

public class TwoTraversals {
    public static void main(String[] args) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("CN", "中国");
        map.put("US", "美国");
        map.put("JP", "日本");
        map.put("UK", "英国");

        System.out.println("=== keySet() 遍历 ===");
        // 补全：用 keySet() 遍历

        System.out.println("\\n=== entrySet() 遍历 ===");
        // 补全：用 entrySet() 遍历
    }
}`}
      answerCode={`import java.util.HashMap;
import java.util.Map;

public class TwoTraversals {
    public static void main(String[] args) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("CN", "中国");
        map.put("US", "美国");
        map.put("JP", "日本");
        map.put("UK", "英国");

        System.out.println("=== keySet() 遍历 ===");
        for (String key : map.keySet()) {
            System.out.println(key + " -> " + map.get(key));
        }

        System.out.println("\n=== entrySet() 遍历 ===");
        for (Map.Entry<String, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}

/* 控制台输出（HashMap 无序，实际顺序可能不同）：
=== keySet() 遍历 ===
CN -> 中国
JP -> 日本
US -> 美国
UK -> 英国

=== entrySet() 遍历 ===
CN -> 中国
JP -> 日本
US -> 美国
UK -> 英国

解析：两种方式打印的内容完全一致，区别在于：
  keySet() 方式先拿到所有 key 的集合，再调用 map.get(key) 查一次哈希表取 value；
  entrySet() 方式直接拿到 Entry 对象，getKey() 和 getValue() 均不需要二次查找，效率更高。
  大数据量场景下，推荐使用 entrySet() 遍历。
*/`}
    />
  </article>
);

export default index;
