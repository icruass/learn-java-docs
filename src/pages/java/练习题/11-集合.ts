import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "collections",
  name: "集合",
  problems: [
    {
      title: "List、Set、Map 三者的区别",
      difficulty: "简单",
      question:
        "Java 集合框架中最常用的三类接口是 List、Set、Map。请分别说明它们的核心特点（是否有序、元素是否可重复、存储的是单个元素还是键值对），并各举一个常见的实现类。",
      answer:
        "三者的核心区别：\n1. List（列表）：有序（保留元素的插入顺序，可按下标访问），元素可以重复。常见实现类：ArrayList、LinkedList。\n2. Set（集合）：元素不可重复（靠 equals/hashCode 去重）；是否有序取决于实现——HashSet 无序，LinkedHashSet 按插入顺序，TreeSet 按大小排序。常见实现类：HashSet、TreeSet。\n3. Map（映射）：存储的是「键值对（key-value）」，键不可重复、值可以重复，通过键来快速查找值；是否有序同样取决于实现——HashMap 无序，LinkedHashMap 按插入顺序，TreeMap 按键排序。常见实现类：HashMap、TreeMap。\n一句话概括：List 是「可重复的有序队列」，Set 是「不重复的集合」，Map 是「键到值的字典」。其中 List 和 Set 都继承自 Collection 接口，而 Map 是独立的体系。",
      tags: ["List", "Set", "Map"],
    },
    {
      title: "ArrayList 的增删改查",
      difficulty: "简单",
      question:
        "请使用泛型 ArrayList<String> 完成以下操作并打印结果：\n1. 创建一个 ArrayList，依次添加 \"A\"、\"B\"、\"C\"；\n2. 在下标 1 处插入 \"X\"；\n3. 把下标 0 的元素修改为 \"a\"；\n4. 删除元素 \"C\"；\n5. 打印最终列表和它的大小（size）。请写出代码以及最终打印出的列表内容。",
      hint: "add(e) 末尾添加，add(index, e) 指定位置插入，set(index, e) 修改，remove 可按下标也可按对象删除，get(index) 取值。",
      answer:
        "依次操作后列表的变化过程：\n- 添加 A、B、C 后：[A, B, C]\n- 在下标 1 插入 X 后：[A, X, B, C]\n- 把下标 0 改为 a 后：[a, X, B, C]\n- 删除元素 \"C\"（按对象删）后：[a, X, B]\n所以最终列表是 [a, X, B]，size 为 3。\n注意 remove 的两种重载：remove(int index) 按下标删，remove(Object o) 按内容删；对于 ArrayList<Integer>，remove(1) 会被当成「删下标 1」而不是「删元素 1」，需用 remove(Integer.valueOf(1)) 区分。本题元素是 String，remove(\"C\") 走的是按对象删除。",
      answerCode: `import java.util.ArrayList;
import java.util.List;

public class ArrayListDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");        // [A, B, C]

        list.add(1, "X");     // [A, X, B, C]  下标1插入
        list.set(0, "a");     // [a, X, B, C]  修改下标0
        list.remove("C");     // [a, X, B]     按对象删除

        System.out.println(list);          // [a, X, B]
        System.out.println(list.size());   // 3
        System.out.println(list.get(1));   // X
    }
}`,
      tags: ["ArrayList", "增删改查", "泛型"],
    },
    {
      title: "用 HashSet 去重并预测输出",
      difficulty: "中等",
      question:
        "现有一个含重复元素的整数数组 {3, 1, 2, 3, 1, 5}，请用 HashSet 对它去重。阅读下面的代码，回答：(1) 打印 set 的 size 是多少？(2) set.contains(3) 的结果？(3) 为什么直接打印 HashSet 看到的元素顺序可能和插入顺序不同？",
      code: `int[] arr = {3, 1, 2, 3, 1, 5};
Set<Integer> set = new HashSet<>();
for (int x : arr) {
    set.add(x);
}
System.out.println(set.size());        // (1)
System.out.println(set.contains(3));   // (2)
System.out.println(set);               // (3)`,
      hint: "Set 自动去重，重复 add 同一个元素不会增加大小。HashSet 底层是哈希表，元素位置由哈希值决定。",
      answer:
        "(1) size 为 4。数组里不重复的元素是 {3, 1, 2, 5}，共 4 个；HashSet 的 add 在元素已存在时不会重复添加，所以重复的 3 和 1 被自动去掉。\n(2) set.contains(3) 为 true，因为 3 确实在集合中。\n(3) HashSet 底层是哈希表，元素的存放位置由其哈希值计算得到，而不是按插入先后排列，因此遍历/打印的顺序通常与插入顺序无关（本例常见输出为 [1, 2, 3, 5]，按哈希分布而非插入顺序）。如果需要保持插入顺序，应使用 LinkedHashSet；如果需要排序，应使用 TreeSet。\n小结：HashSet 适合「快速判断是否存在 + 去重」，但不保证顺序。",
      answerCode: `import java.util.HashSet;
import java.util.Set;

public class HashSetDemo {
    public static void main(String[] args) {
        int[] arr = {3, 1, 2, 3, 1, 5};
        Set<Integer> set = new HashSet<>();
        for (int x : arr) {
            set.add(x);
        }
        System.out.println(set.size());       // 4
        System.out.println(set.contains(3));  // true
        System.out.println(set);              // 例如 [1, 2, 3, 5]（无序）
    }
}`,
      tags: ["HashSet", "去重", "输出预测"],
    },
    {
      title: "HashMap 的两种遍历方式",
      difficulty: "中等",
      question:
        "给定一个 HashMap<String, Integer>，里面存了几个学生的分数。请写出遍历这个 Map 的两种常见方式：(1) 通过 keySet() 遍历所有键，再用 get(key) 取值；(2) 通过 entrySet() 直接遍历键值对。并说明这两种方式在效率上有什么差别。",
      code: `Map<String, Integer> scores = new HashMap<>();
scores.put("Tom", 90);
scores.put("Jerry", 85);
scores.put("Bob", 78);`,
      hint: "entrySet() 返回 Set<Map.Entry<K,V>>，每个 entry 有 getKey() 和 getValue()。",
      answer:
        "两种遍历方式：\n方式一（keySet）：先用 map.keySet() 拿到所有键的集合，遍历每个键，再调用 map.get(key) 取出对应的值。缺点是每次 get(key) 都要再做一次哈希查找。\n方式二（entrySet）：用 map.entrySet() 直接拿到所有「键值对」的集合，每个 Map.Entry 同时提供 getKey() 和 getValue()，一次遍历即可同时拿到键和值。\n效率差别：当需要同时使用键和值时，entrySet 更高效，因为它只遍历一遍、不需要额外的 get 查找；而 keySet 方式相当于多了一次按键查找的开销。因此「既要键又要值」时优先用 entrySet；如果只用到键，用 keySet 即可。\n（注：JDK 8+ 还可以用 map.forEach((k, v) -> ...) 这种更简洁的写法。）",
      answerCode: `import java.util.HashMap;
import java.util.Map;

public class HashMapTraverse {
    public static void main(String[] args) {
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Tom", 90);
        scores.put("Jerry", 85);
        scores.put("Bob", 78);

        // 方式一：keySet + get
        for (String key : scores.keySet()) {
            System.out.println(key + " = " + scores.get(key));
        }

        // 方式二：entrySet（推荐，键值都用时更高效）
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + " = " + entry.getValue());
        }

        // 方式三（JDK8+）：forEach
        scores.forEach((k, v) -> System.out.println(k + " = " + v));
    }
}`,
      tags: ["HashMap", "遍历", "entrySet"],
    },
    {
      title: "ArrayList 与 LinkedList 的区别",
      difficulty: "困难",
      question:
        "ArrayList 和 LinkedList 都实现了 List 接口，使用上几乎一样，但底层结构完全不同。请从底层数据结构、随机访问（按下标 get）、在中间/头部插入删除、内存占用四个方面对比它们，并说明各自更适合什么场景。",
      hint: "ArrayList 底层是数组（连续内存、有下标），LinkedList 底层是双向链表（靠前后指针串起来）。",
      answer:
        "底层结构：\n- ArrayList 底层是「动态数组」，元素存放在一块连续的内存中，每个元素有固定下标。\n- LinkedList 底层是「双向链表」，每个节点保存数据以及指向前一个、后一个节点的引用，节点在内存中不连续。\n\n四个方面对比：\n1. 随机访问 get(index)：ArrayList 是数组，可以根据下标直接定位，时间复杂度 O(1)，很快；LinkedList 需要从头（或尾）一个节点一个节点地走到第 index 个，时间复杂度 O(n)，较慢。\n2. 中间/头部插入删除：ArrayList 在中间或头部插入删除时，需要移动后面的所有元素，平均 O(n)；LinkedList 只要找到位置后改动前后节点的指针即可（找位置仍是 O(n)，但若已持有节点引用则改指针是 O(1)），在头尾增删尤其高效。\n3. 扩容：ArrayList 数组满了需要扩容（复制到更大的新数组）；LinkedList 没有扩容问题，按需创建节点。\n4. 内存占用：ArrayList 通常更省内存（只存数据 + 可能有少量预留容量）；LinkedList 每个节点要额外存两个指针，内存开销更大。\n\n适用场景：\n- 频繁按下标随机访问、查询多于增删 → 选 ArrayList（最常用，默认首选）。\n- 频繁在头部/中间增删、很少随机访问，或需要当作队列/栈使用 → 选 LinkedList。\n实践中绝大多数情况用 ArrayList 即可。",
      tags: ["ArrayList", "LinkedList", "底层结构"],
    },
  ],
};

export default category;
