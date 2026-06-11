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
    <Title>哈希表（Hash Table）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        哈希表（Hash Table），又叫<Text bold>散列表</Text>，是最重要的数据结构之一。
        它的核心思想是：借助<Text bold>哈希函数</Text>把 key 映射成数组下标，从而用数组的随机访问特性
        实现平均 O(1) 的增、删、查。Java 中的 <InlineCode>HashMap</InlineCode>、
        <InlineCode>HashSet</InlineCode> 底层都是哈希表。
        本节系统讲解哈希函数原理、哈希冲突及解决方案、负载因子与扩容机制、
        <InlineCode>hashCode()</InlineCode> 与 <InlineCode>equals()</InlineCode> 的约定，
        以及 JDK 8 中 <InlineCode>HashMap</InlineCode> 的底层结构。
      </Paragraph>
    </Callout>

    <Heading3>1. 哈希表的核心思想</Heading3>
    <Paragraph>
      普通数组靠<Text bold>整数下标</Text>实现 O(1) 随机访问，但现实中的 key 往往是字符串、对象等非整数。
      哈希表通过一个<Text bold>哈希函数（Hash Function）</Text>把任意 key 转换成一个整数下标，
      再把 value 存入该位置的数组槽（称为<Text bold>桶，Bucket</Text>），从而把任意 key 的查找开销
      降低到 O(1)（平均）。
    </Paragraph>
    <CodeBlock
      language="text"
      title="哈希表核心思路示意"
      code={`key（任意类型）
    │
    ▼  哈希函数 hash(key)
    │
    ▼  对数组长度取模  index = hash(key) % capacity
    │
    ▼
┌─────────────────────────────────────────┐
│ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │…  │  ← 底层数组（桶数组）
└─────────────────────────────────────────┘
          ▲
          │  value 存入对应槽（桶）`}
    />
    <Paragraph>
      例如数组长度为 16，key 为字符串 <InlineCode>"apple"</InlineCode>，
      假设 <InlineCode>hash("apple") = 93029210</InlineCode>，
      则下标 = 93029210 % 16 = 10，value 就放在下标 10 的桶里。
      查找时同样算一次 hash，直接定位，无需遍历。
    </Paragraph>

    <Heading3>2. 哈希函数</Heading3>
    <Paragraph>
      哈希函数需要满足两个基本要求：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>确定性</Text>：相同的 key 每次计算结果相同（同一 JVM 生命周期内）。
      </ListItem>
      <ListItem>
        <Text bold>均匀分布</Text>：不同的 key 尽量散落在不同的桶，减少冲突。
      </ListItem>
    </OrderedList>
    <Paragraph>
      Java 中，每个对象都有 <InlineCode>hashCode()</InlineCode> 方法，返回一个 int。
      <InlineCode>HashMap</InlineCode> 在此基础上再做一次扰动（将高 16 位与低 16 位异或），
      进一步减少碰撞：
    </Paragraph>
    <CodeBlock
      language="text"
      title="JDK HashMap 的扰动哈希（伪代码）"
      code={`static int hash(Object key) {
    int h = key.hashCode();
    return h ^ (h >>> 16);   // 高 16 位与低 16 位异或，减少低位碰撞
}`}
    />
    <Paragraph>
      最终下标 = <InlineCode>(capacity - 1) &amp; hash</InlineCode>，
      当容量为 2 的幂次时，该位运算等价于取模，且速度更快。
    </Paragraph>

    <Heading3>3. 哈希冲突与解决方案</Heading3>
    <Paragraph>
      不同的 key 可能被映射到同一个下标，这称为<Text bold>哈希冲突（Hash Collision）</Text>。
      冲突无法完全避免（key 空间远大于数组长度），因此必须有处理方案。
    </Paragraph>
    <Table
      head={['解决方案', '原理', 'Java 是否采用']}
      rows={[
        ['链地址法（拉链法）', '每个桶存一条链表（或红黑树），冲突元素追加到链表尾部', '是（HashMap 采用）'],
        ['开放定址法（线性探测）', '冲突时顺序探测下一个空桶，直到找到空位', '否（ThreadLocalMap 有类似实现）'],
        ['再哈希法', '冲突时用第二个哈希函数重新计算下标', '否'],
      ]}
    />

    <Heading4>3.1 链地址法（拉链法）详解</Heading4>
    <Paragraph>
      <Text bold>链地址法</Text>：每个桶不只存一个元素，而是存一条<Text bold>链表（或红黑树）</Text>。
      发生冲突时，新元素追加到对应桶的链表末尾。查找时先定位桶，再在链表中逐一用
      <InlineCode>equals()</InlineCode> 比较。
    </Paragraph>
    <CodeBlock
      language="text"
      title="链地址法结构示意"
      code={`桶数组
index 0: null
index 1: [Entry(key1,v1)] → [Entry(key2,v2)] → null   ← key1 和 key2 哈希冲突
index 2: [Entry(key3,v3)] → null
index 3: null
...
index 7: [Entry(key4,v4)] → [Entry(key5,v5)] → [Entry(key6,v6)] → null
           （链表过长时，JDK 8 会把链表转成红黑树）`}
    />

    <Heading4>3.2 开放定址法（线性探测）简述</Heading4>
    <Paragraph>
      <Text bold>开放定址法</Text>中所有元素都存在数组本身，不使用链表。
      发生冲突时，沿数组向后逐格探测（线性探测），找到第一个空格就存入。
      删除操作需要打标记而非真正清空，否则后续探测链会断裂。
      优点是内存紧凑、缓存友好；缺点是高负载时性能退化严重，实现也较复杂。
    </Paragraph>
    <Callout type="tip" title="Java HashMap 采用拉链法">
      <InlineCode>HashMap</InlineCode> 选择拉链法，因为它删除方便、高负载时性能退化温和。
      数组 + 链表/红黑树的混合结构兼顾了内存利用率和查询效率。
    </Callout>

    <Heading3>4. 负载因子与扩容（rehash）</Heading3>
    <Paragraph>
      <Text bold>负载因子（load factor）</Text>= 已存元素数量 ÷ 桶数组容量，
      默认值为 <InlineCode>0.75</InlineCode>。当实际存储量超过
      <InlineCode>capacity × loadFactor</InlineCode> 时，触发<Text bold>扩容（rehash）</Text>：
    </Paragraph>
    <OrderedList>
      <ListItem>新建一个容量为原来 <Text bold>2 倍</Text>的桶数组。</ListItem>
      <ListItem>遍历旧数组的每条链表/红黑树，对每个元素重新计算下标（rehash），放入新数组。</ListItem>
      <ListItem>原数组被垃圾回收。</ListItem>
    </OrderedList>
    <Callout type="warning" title="扩容是耗时操作，应提前预估容量">
      扩容需要重新散列所有元素，时间复杂度 O(n)。若能预估数据量，创建时指定初始容量
      可以避免多次扩容，例如：
      存 1000 个元素，建议初始容量 = 1000 / 0.75 + 1 ≈ 1334，
      可传 <InlineCode>new HashMap&lt;&gt;(2048)</InlineCode>（取大于 1334 的 2 的幂次）。
    </Callout>
    <Table
      head={['参数', '默认值', '说明']}
      rows={[
        ['初始容量（initialCapacity）', '16', '桶数组初始长度，必须是 2 的幂次'],
        ['负载因子（loadFactor）', '0.75', '控制何时扩容，值越小冲突越少但内存浪费越多'],
        ['扩容倍数', '2 倍', '每次扩容后容量 = 旧容量 × 2'],
        ['树化阈值', '8（链表长度）且容量 ≥ 64', '链表转红黑树的触发条件'],
        ['退树化阈值', '6', '红黑树元素减少到 6 时退化回链表'],
      ]}
    />

    <Heading3>5. hashCode() 与 equals() 的约定</Heading3>
    <Paragraph>
      哈希表依赖两个方法协同工作：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>hashCode()</Text>：计算对象的哈希码，决定放在哪个桶。
      </ListItem>
      <ListItem>
        <Text bold>equals()</Text>：在桶内逐一比较，判断是否是同一个 key。
      </ListItem>
    </OrderedList>
    <Callout type="danger" title="核心约定：equals 相等则 hashCode 必须相等">
      <Paragraph>Java 规范要求：</Paragraph>
      <UnorderedList>
        <ListItem>
          若 <InlineCode>a.equals(b)</InlineCode> 为 <InlineCode>true</InlineCode>，
          则 <InlineCode>a.hashCode() == b.hashCode()</InlineCode> <Text bold>必须</Text>成立。
        </ListItem>
        <ListItem>
          反之不要求：两个 hashCode 相等的对象，equals 不一定为 true（这就是哈希冲突）。
        </ListItem>
      </UnorderedList>
      <Paragraph>
        违反此约定会导致：两个业务上「相等」的对象被存入不同的桶，
        <InlineCode>get(key)</InlineCode> 永远找不到对应的 value。
        因此，<Text bold>重写 equals 的同时必须重写 hashCode</Text>，反之亦然。
      </Paragraph>
    </Callout>
    <Table
      head={['情形', '结论']}
      rows={[
        ['只重写 equals，不重写 hashCode', '两个内容相同的对象 hashCode 不同，HashMap 认为它们是不同 key，put 两次、get 找不到'],
        ['只重写 hashCode，不重写 equals', '冲突时桶内比较用 equals（Object 默认地址比较），内容相同的对象仍被视为不同 key'],
        ['两者都重写（正确做法）', 'equals 相等 → 同一个桶 → equals 再次确认 → 正确识别为同一 key'],
      ]}
    />

    <Heading3>6. JDK 8 HashMap 底层结构（数组 + 链表 + 红黑树）</Heading3>
    <Paragraph>
      JDK 8 之前，<InlineCode>HashMap</InlineCode> 底层是「数组 + 链表」。
      JDK 8 起引入红黑树优化：当某个桶的链表长度超过 <Text bold>8</Text>，
      且数组总容量 ≥ <Text bold>64</Text> 时，该链表会转换成<Text bold>红黑树</Text>，
      把桶内查找从 O(n) 优化到 O(log n)。
      当红黑树节点减少到 <Text bold>6</Text> 时，再退化回链表（避免频繁转换）。
    </Paragraph>
    <CodeBlock
      language="text"
      title="JDK 8 HashMap 内部结构示意"
      code={`HashMap 内部：Node<K,V>[] table（桶数组，容量为 2 的幂次）

table[0]  → null
table[1]  → Node(k1,v1) → Node(k2,v2) → null          （普通链表）
table[2]  → null
table[3]  → TreeNode(k3,v3)                             （红黑树根节点，链表转树）
              ├─ TreeNode(k4,v4)
              └─ TreeNode(k5,v5)
               ...（树节点，链表长度 > 8 且容量 ≥ 64 时触发）
table[4]  → Node(k6,v6) → null
...`}
    />

    <Heading3>7. HashMap 查找/插入完整流程</Heading3>
    <OrderedList>
      <ListItem>
        计算 key 的 <InlineCode>hashCode()</InlineCode>，再做扰动处理得到最终 hash 值。
      </ListItem>
      <ListItem>
        用 <InlineCode>(capacity - 1) &amp; hash</InlineCode> 计算桶下标，定位到桶数组的某个槽。
      </ListItem>
      <ListItem>
        若桶为空（null），直接存入新节点（插入）或返回 null（查找未命中）。
      </ListItem>
      <ListItem>
        若桶非空，逐一对比桶内节点：先比 hash 值，再用 <InlineCode>equals()</InlineCode> 比较 key 内容。
        找到匹配节点则返回/更新其 value；找不到则追加到链表尾（或红黑树插入）。
      </ListItem>
      <ListItem>
        插入后检查是否超过 <InlineCode>capacity × loadFactor</InlineCode>，若超过则扩容。
      </ListItem>
    </OrderedList>
    <Table
      head={['操作', '平均时间复杂度', '最坏时间复杂度（全部冲突到一个桶）']}
      rows={[
        ['put(key, value)', 'O(1)', 'O(log n)（JDK 8 红黑树）'],
        ['get(key)', 'O(1)', 'O(log n)（JDK 8 红黑树）'],
        ['remove(key)', 'O(1)', 'O(log n)（JDK 8 红黑树）'],
        ['扩容 rehash', 'O(n)（均摊到每次操作极小）', 'O(n)'],
      ]}
    />

    <Heading3>8. 示例代码</Heading3>

    <Heading4>示例 1：HashMap&lt;String, Integer&gt; 词频统计</Heading4>
    <Paragraph>
      统计一段文字中每个单词出现的次数，最终按单词打印频次。
    </Paragraph>
    <CodeBlock
      title="WordCount.java"
      code={`import java.util.HashMap;
import java.util.Map;

public class WordCount {
    public static void main(String[] args) {
        String[] words = {"apple", "banana", "apple", "cherry", "banana", "apple"};

        // HashMap<String, Integer> 存储 单词 -> 出现次数
        HashMap<String, Integer> freqMap = new HashMap<>();

        for (String word : words) {
            // getOrDefault：若 key 不存在则返回默认值 0，再 +1 存回
            freqMap.put(word, freqMap.getOrDefault(word, 0) + 1);
        }

        // 遍历所有键值对
        for (Map.Entry<String, Integer> entry : freqMap.entrySet()) {
            System.out.println(entry.getKey() + " 出现了 " + entry.getValue() + " 次");
        }

        // 查询特定 key
        System.out.println("\n查询 apple 的频次：" + freqMap.get("apple"));
        System.out.println("查询 grape 的频次：" + freqMap.get("grape")); // 不存在，返回 null
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`apple 出现了 3 次
banana 出现了 2 次
cherry 出现了 1 次

查询 apple 的频次：3
查询 grape 的频次：null`}
    />
    <Paragraph>
      <InlineCode>getOrDefault(key, defaultValue)</InlineCode> 是词频统计的惯用写法：
      key 存在时返回当前计数，不存在时返回 0，再加 1 写回，简洁高效。
      <InlineCode>get()</InlineCode> 对不存在的 key 返回 <InlineCode>null</InlineCode>，
      实际使用中可配合 <InlineCode>getOrDefault</InlineCode> 避免空指针。
    </Paragraph>

    <Heading4>示例 2：自定义对象正确重写 hashCode() 与 equals()</Heading4>
    <Paragraph>
      自定义类 <InlineCode>Student</InlineCode>，以学号（id）和姓名（name）共同确定唯一性，
      作为 <InlineCode>HashMap</InlineCode> 的 key。演示重写前后的差异。
    </Paragraph>
    <CodeBlock
      title="Student.java"
      code={`import java.util.Objects;

public class Student {
    private int id;
    private String name;

    public Student(int id, String name) {
        this.id = id;
        this.name = name;
    }

    // 重写 equals：id 和 name 都相同才认为是同一个学生
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Student)) return false;
        Student other = (Student) obj;
        return this.id == other.id && Objects.equals(this.name, other.name);
    }

    // 重写 hashCode：与 equals 使用相同的字段
    @Override
    public int hashCode() {
        return Objects.hash(id, name);  // id 和 name 共同生成 hashCode
    }

    @Override
    public String toString() {
        return "Student{id=" + id + ", name='" + name + "'}";
    }
}`}
    />
    <CodeBlock
      title="StudentMapDemo.java"
      code={`import java.util.HashMap;

public class StudentMapDemo {
    public static void main(String[] args) {
        HashMap<Student, String> scoreMap = new HashMap<>();

        Student s1 = new Student(1001, "张三");
        scoreMap.put(s1, "优秀");

        // 用内容相同但不同对象的 key 查询
        Student s2 = new Student(1001, "张三");
        System.out.println("s1.equals(s2) = " + s1.equals(s2));
        System.out.println("s1.hashCode() = " + s1.hashCode());
        System.out.println("s2.hashCode() = " + s2.hashCode());
        System.out.println("用 s2 查询结果：" + scoreMap.get(s2));  // 正确重写后应查到

        // 不同学生
        Student s3 = new Student(1002, "李四");
        scoreMap.put(s3, "良好");
        System.out.println("用 s3 查询结果：" + scoreMap.get(s3));
        System.out.println("HashMap 大小：" + scoreMap.size());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`s1.equals(s2) = true
s1.hashCode() = 776580    （实际值依 JVM 而定，但 s1 和 s2 必然相同）
s2.hashCode() = 776580
用 s2 查询结果：优秀
用 s3 查询结果：良好
HashMap 大小：2`}
    />
    <Paragraph>
      <InlineCode>Objects.hash(id, name)</InlineCode> 是 JDK 7+ 提供的工具方法，
      自动根据传入字段组合生成 hashCode，与 <InlineCode>equals</InlineCode> 使用相同字段，
      保证了「equals 相等则 hashCode 相等」的约定。
      若不重写 hashCode，<InlineCode>s1</InlineCode> 和 <InlineCode>s2</InlineCode>
      虽然内容相同，却会因地址不同而散落到不同桶，<InlineCode>get(s2)</InlineCode> 将返回 null。
    </Paragraph>

    <Heading4>示例 3：HashMap 常用操作速查</Heading4>
    <CodeBlock
      title="HashMapOps.java"
      code={`import java.util.HashMap;
import java.util.Map;

public class HashMapOps {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();

        // put：插入或覆盖
        map.put("语文", 90);
        map.put("数学", 95);
        map.put("英语", 88);
        map.put("数学", 98);  // 覆盖已有 key

        // get：查找
        System.out.println("数学成绩：" + map.get("数学"));

        // containsKey / containsValue
        System.out.println("含 key 英语：" + map.containsKey("英语"));
        System.out.println("含 value 100：" + map.containsValue(100));

        // remove
        map.remove("英语");
        System.out.println("删除英语后 size = " + map.size());

        // 遍历键值对
        System.out.println("--- 遍历 ---");
        for (Map.Entry<String, Integer> e : map.entrySet()) {
            System.out.println(e.getKey() + " : " + e.getValue());
        }

        // putIfAbsent：key 不存在时才插入
        map.putIfAbsent("数学", 60);   // 数学已存在，不覆盖
        System.out.println("putIfAbsent 后 数学 = " + map.get("数学"));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`数学成绩：98
含 key 英语：true
含 value 100：false
删除英语后 size = 2
--- 遍历 ---
语文 : 90
数学 : 98
putIfAbsent 后 数学 = 98`}
    />

    <Heading3>9. 要点汇总</Heading3>
    <Table
      head={['要点', '结论']}
      rows={[
        ['核心原理', '哈希函数把 key 映射成数组下标，实现平均 O(1) 增删查'],
        ['哈希冲突', '不可避免；Java HashMap 用链地址法（拉链法）解决'],
        ['JDK 8 优化', '链表长度 > 8 且容量 ≥ 64 时转红黑树，最坏 O(log n)'],
        ['负载因子', '默认 0.75；超过 capacity × 0.75 触发 2 倍扩容（rehash）'],
        ['hashCode + equals', '必须同时重写；equals 相等则 hashCode 必须相等'],
        ['HashMap 无序', '遍历顺序不保证与插入顺序一致；需有序用 LinkedHashMap 或 TreeMap'],
        ['线程不安全', '多线程环境需用 ConcurrentHashMap'],
      ]}
    />
    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>哈希表 = 数组 + 哈希函数，平均 O(1) 是核心优势。</ListItem>
        <ListItem>冲突用拉链法解决；JDK 8 的红黑树兜底了最坏情况。</ListItem>
        <ListItem>负载因子 0.75 是空间与时间的折中，预估数据量时设好初始容量避免扩容。</ListItem>
        <ListItem>自定义对象做 key：必须同时、一致地重写 <InlineCode>hashCode()</InlineCode> 和 <InlineCode>equals()</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>10. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：统计字符串中每个字符出现的次数"
      code={`// 要求：
// 给定字符串 s = "hello world"（含空格），
// 统计每个字符（含空格）出现的次数，并按如下格式打印：
//   字符 'h' 出现 1 次
//   字符 'e' 出现 1 次
//   ...（不要求固定顺序）
// 提示：用 HashMap<Character, Integer>，遍历字符串每个字符

public class CharCount {
    public static void main(String[] args) {
        String s = "hello world";
        // 补全代码
    }
}`}
      answerCode={`import java.util.HashMap;
import java.util.Map;

public class CharCount {
    public static void main(String[] args) {
        String s = "hello world";
        HashMap<Character, Integer> map = new HashMap<>();

        for (char c : s.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }

        for (Map.Entry<Character, Integer> entry : map.entrySet()) {
            System.out.println("字符 '" + entry.getKey() + "' 出现 " + entry.getValue() + " 次");
        }
    }
}

/* 控制台输出（顺序可能不同）：
字符 'h' 出现 1 次
字符 'e' 出现 1 次
字符 'l' 出现 3 次
字符 'o' 出现 2 次
字符 ' ' 出现 1 次
字符 'w' 出现 1 次
字符 'r' 出现 1 次
字符 'd' 出现 1 次

解析：s.toCharArray() 把字符串转成 char 数组逐字符遍历；
      getOrDefault(c, 0) + 1 是统计频次的惯用写法。
      HashMap 的遍历顺序不保证与插入顺序一致，所以输出顺序可能不同。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：两数之和（用哈希表实现 O(n) 解法）"
      code={`// 要求：
// 给定整数数组 nums 和目标值 target，找出数组中两个下标 i 和 j（i != j），
// 使得 nums[i] + nums[j] == target，返回这两个下标。
// 保证恰好有一个答案，不能重复使用同一个元素。
//
// 示例：nums = {2, 7, 11, 15}，target = 9
// 输出：下标 [0, 1]（因为 nums[0] + nums[1] = 2 + 7 = 9）
//
// 要求用哈希表实现，时间复杂度 O(n)，不得用双重循环 O(n^2)。

import java.util.Arrays;
import java.util.HashMap;

public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        // 补全：用 HashMap<Integer, Integer> 存 值->下标 的映射
        // 遍历时，对当前元素 nums[i]，查 map 里是否已有 (target - nums[i])
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println(Arrays.toString(twoSum(nums, target)));
    }
}`}
      answerCode={`import java.util.Arrays;
import java.util.HashMap;

public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        // 哈希表：存 值 -> 下标
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];  // 需要配对的另一个数
            if (map.containsKey(complement)) {
                // 找到了，返回两个下标
                return new int[]{map.get(complement), i};
            }
            // 还没找到，先把当前元素存入哈希表
            map.put(nums[i], i);
        }
        return new int[]{};  // 题目保证有解，不会到达这里
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println(Arrays.toString(twoSum(nums, target)));
    }
}

/* 控制台输出：
[0, 1]

解析：核心思路——「边走边查」。
  遍历到 nums[i] 时，检查 map 中是否已有 target - nums[i]（即之前遍历过的某个数）。
  - i=0, nums[0]=2, complement=7, map 为空，未找到，存入 map: {2->0}
  - i=1, nums[1]=7, complement=2, map 中有 2->0，找到！返回 [0, 1]
  只需一次遍历，时间复杂度 O(n)，比双重循环 O(n^2) 快得多。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：判断两个字符串是否互为字母异位词"
      code={`// 要求：
// 给定两个字符串 s 和 t，判断 t 是否是 s 的字母异位词（Anagram）。
// 字母异位词：两个字符串包含相同的字母，且每个字母的出现次数完全相同，顺序可不同。
// 例：s = "anagram"，t = "nagaram" → true
//     s = "rat"，    t = "car"    → false
//
// 要求用哈希表实现。

import java.util.HashMap;

public class IsAnagram {
    public static boolean isAnagram(String s, String t) {
        // 补全代码
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram")); // true
        System.out.println(isAnagram("rat", "car"));         // false
    }
}`}
      answerCode={`import java.util.HashMap;

public class IsAnagram {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;

        HashMap<Character, Integer> map = new HashMap<>();

        // 对 s 的每个字符计数 +1
        for (char c : s.toCharArray()) {
            map.put(c, map.getOrDefault(c, 0) + 1);
        }

        // 对 t 的每个字符计数 -1；若 key 不存在或减到负数，说明不是异位词
        for (char c : t.toCharArray()) {
            if (!map.containsKey(c)) return false;
            map.put(c, map.get(c) - 1);
            if (map.get(c) < 0) return false;
        }

        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram")); // true
        System.out.println(isAnagram("rat", "car"));         // false
    }
}

/* 控制台输出：
true
false

解析：先对字符串 s 建立字符频次表（+1），再遍历 t 对频次 -1。
  若最终所有字符的计数都能归零（由长度相等保证），说明两者用了完全相同的字符。
  遇到 t 中出现而 s 中没有的字符（key 不存在），或某字符在 t 中出现比 s 中更多（计数 < 0），
  直接返回 false。
*/`}
    />
  </article>
);

export default index;
