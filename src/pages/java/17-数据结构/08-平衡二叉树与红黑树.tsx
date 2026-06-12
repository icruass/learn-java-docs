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
    <Title>平衡二叉树与红黑树</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节讲到 BST 的致命缺陷：按有序数据插入会退化为链表，性能跌至 O(n)。
        解决思路是引入<Text bold>自平衡机制</Text>，让树的高度始终维持在 O(log n)。
        本节介绍两种最重要的自平衡树：
        ① <Text bold>AVL 树</Text>——严格平衡，通过四种旋转保持任意节点左右子树高度差 ≤ 1；
        ② <Text bold>红黑树</Text>——近似平衡，通过变色 + 旋转维持五条性质，是 JDK 集合框架
        （TreeMap、TreeSet、HashMap）的核心底层结构。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要平衡</Heading3>
    <Paragraph>
      BST 的查找效率完全依赖树的<Text bold>高度</Text>：高度为 h，查找最坏需要 h 次比较。
      理想情况下 n 个节点的二叉树高度为 ⌊log₂n⌋，但退化情况下高度可达 n-1。
    </Paragraph>
    <CodeBlock
      language="text"
      title="平衡 vs 退化：同样 5 个节点，高度天差地别"
      code={`平衡 BST（高度 = 2）：        退化 BST（高度 = 4）：
       3                           1
      / \\                           \\
     1   4                           2
      \\    \\                          \\
       2    5                          3
                                        \\
                                         4
                                          \\
                                           5
查找最坏：3 次比较              查找最坏：5 次比较`}
    />
    <Paragraph>
      <Text bold>平衡的本质</Text>：让树高维持在 O(log n)，从而保证增删查均为 O(log n)。
    </Paragraph>

    <Heading3>2. AVL 树</Heading3>
    <Heading4>2.1 平衡因子</Heading4>
    <Paragraph>
      AVL 树（由 Adelson-Velsky 和 Landis 提出）在 BST 的基础上增加一条约束：
      对树中<Text bold>每一个节点</Text>，其左子树高度与右子树高度之差的绝对值不超过 1。
      这个差值称为<Text bold>平衡因子（Balance Factor，BF）</Text>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="平衡因子示意"
      code={`  BF = 左子树高度 - 右子树高度

  合法：BF ∈ {-1, 0, 1}
  非法：BF ≤ -2 或 BF ≥ 2（需要旋转恢复）

举例：
       5         ← BF = 1（左高2，右高1）√
      / \\
     3   7       ← BF = 0 √
    /
   1             ← BF = 0 √`}
    />

    <Heading4>2.2 四种旋转操作</Heading4>
    <Paragraph>
      当插入或删除导致某节点的平衡因子绝对值变为 2 时，需要通过旋转恢复平衡。
      共有四种失衡情形，对应四种旋转：
    </Paragraph>
    <Table
      head={['失衡类型', '触发条件', '修复操作', '口诀']}
      rows={[
        ['LL 型', '在失衡节点「左孩子的左子树」插入节点', '对失衡节点做「右旋」', '左左 → 右旋'],
        ['RR 型', '在失衡节点「右孩子的右子树」插入节点', '对失衡节点做「左旋」', '右右 → 左旋'],
        ['LR 型', '在失衡节点「左孩子的右子树」插入节点', '先对左孩子做「左旋」，再对失衡节点做「右旋」', '左右 → 先左后右'],
        ['RL 型', '在失衡节点「右孩子的左子树」插入节点', '先对右孩子做「右旋」，再对失衡节点做「左旋」', '右左 → 先右后左'],
      ]}
    />
    <CodeBlock
      language="text"
      title="LL 型（右旋）示意"
      code={`插入 1 导致节点 5 失衡（BF = 2）：

       5              3
      /              / \\
     3      →       1   5
    /
   1

步骤：以 5 为支点，3 上移成为新根，5 下移成为 3 的右孩子。`}
    />
    <CodeBlock
      language="text"
      title="RR 型（左旋）示意"
      code={`插入 9 导致节点 5 失衡（BF = -2）：

   5                  7
    \\                / \\
     7      →        5   9
      \\
       9

步骤：以 5 为支点，7 上移成为新根，5 下移成为 7 的左孩子。`}
    />
    <Callout type="tip" title="AVL 旋转的核心思想">
      旋转不改变二叉树的中序遍历序列（即 BST 的有序性不变），只改变节点间的父子关系，
      目的是降低树的高度、恢复平衡因子合法。
    </Callout>

    <Heading4>2.3 AVL 树的性能</Heading4>
    <Paragraph>
      由于严格保证任意节点 BF 在 [-1, 1]，AVL 树的高度始终不超过 1.44 × log₂n，
      查找、插入、删除均为 <Text bold>O(log n)</Text>。
      代价是插入/删除时可能需要多次旋转（回溯到根），维护开销较高。
    </Paragraph>

    <Heading3>3. 红黑树</Heading3>
    <Heading4>3.1 五条性质</Heading4>
    <Paragraph>
      <Text bold>红黑树（Red-Black Tree）</Text>是一种<Text bold>近似平衡</Text>的二叉查找树。
      它不要求左右子树高度差 ≤ 1（不像 AVL 那么严格），而是通过维护以下五条性质来保证
      树高不超过 2 × log₂(n+1)，从而保证 O(log n) 的操作效率：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>节点颜色性质</Text>：每个节点要么是<Text bold>红色</Text>，要么是<Text bold>黑色</Text>。
      </ListItem>
      <ListItem>
        <Text bold>根节点性质</Text>：根节点是<Text bold>黑色</Text>的。
      </ListItem>
      <ListItem>
        <Text bold>叶子（NIL）节点性质</Text>：所有叶子节点（即 null 节点，也称 NIL 节点）均为<Text bold>黑色</Text>。
      </ListItem>
      <ListItem>
        <Text bold>红色节点性质</Text>：若一个节点是红色，则它的两个子节点都是<Text bold>黑色</Text>
        （即不存在两个相邻的红色节点，红色节点不能有红色子节点）。
      </ListItem>
      <ListItem>
        <Text bold>黑色高度性质</Text>：从任意节点出发，到达其所有后代叶子节点（NIL）的路径上，
        <Text bold>经过的黑色节点数目相同</Text>（称为该节点的黑色高度，Black Height）。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="五条性质的直觉理解">
      性质 4 保证不会出现连续红节点；性质 5 保证从任何路径看到的黑节点数相同。
      两者合力保证：最长路径（红黑交替）不超过最短路径（全黑）的 2 倍，
      从而树高维持在 O(log n)。
    </Callout>
    <CodeBlock
      language="text"
      title="一棵合法红黑树示意（R=红，B=黑，NIL=黑色空叶子）"
      code={`            13(B)
           /      \\
         8(R)     17(R)
        /    \\    /    \\
      1(B)  11(B) 15(B) 25(B)
      / \\   / \\   / \\   /  \\
    NIL NIL NIL NIL NIL NIL NIL NIL

黑色高度验证（从根到任意 NIL 的黑节点数）：
  13→8→1→NIL：黑节点 13,1,NIL  = 3 ✓
  13→8→11→NIL：黑节点 13,11,NIL = 3 ✓
  13→17→15→NIL：黑节点 13,15,NIL = 3 ✓
  13→17→25→NIL：黑节点 13,25,NIL = 3 ✓
所有路径黑节点数均为 3，满足性质 5。`}
    />

    <Heading4>3.2 红黑树的维护操作</Heading4>
    <Paragraph>
      红黑树在插入或删除后，可能破坏上述五条性质，需要通过以下操作恢复：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>变色（Recoloring）</Text>：将某节点由红变黑或由黑变红，通常用于"上推"问题。
      </ListItem>
      <ListItem>
        <Text bold>旋转（Rotation）</Text>：与 AVL 旋转相同，包括左旋和右旋，调整节点的父子关系。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      新节点插入时默认着<Text bold>红色</Text>（红色节点不影响黑色高度，性质 5 不变），
      然后根据叔父节点的颜色决定是变色还是旋转，最多回溯 O(log n) 层即可完成修复。
    </Paragraph>
    <Callout type="warning" title="红黑树的完整插入/删除逻辑较复杂">
      红黑树的完整插入/删除算法需要讨论多种 case，工程中直接使用 JDK 提供的 TreeMap/TreeSet 即可。
      本节重点掌握五条性质与红黑树的整体特征，而非手写完整实现。
    </Callout>

    <Heading3>4. AVL 树 vs 红黑树：对比</Heading3>
    <Table
      head={['对比项', 'AVL 树', '红黑树']}
      rows={[
        ['平衡严格度', '严格（任意节点 |BF| ≤ 1）', '近似平衡（最长路径 ≤ 2 × 最短路径）'],
        ['树高上限', '≤ 1.44 × log₂n', '≤ 2 × log₂(n+1)'],
        ['查找效率', '略高（树更矮、更平）', '略低（树可能稍高）'],
        ['插入/删除旋转次数', '可能多（最坏 O(log n) 次旋转）', '较少（最多 3 次旋转，变色 O(log n)）'],
        ['维护开销', '较高', '较低'],
        ['适用场景', '查询频繁、修改较少', '插入/删除频繁（如 JDK 集合框架）'],
        ['JDK 典型应用', '无直接使用', 'TreeMap、TreeSet、HashMap（链表转树）'],
      ]}
    />

    <Heading3>5. 红黑树在 JDK 中的应用</Heading3>
    <Heading4>5.1 TreeMap 与 TreeSet</Heading4>
    <Paragraph>
      <InlineCode>TreeMap</InlineCode> 和 <InlineCode>TreeSet</InlineCode> 的底层都是红黑树。
      由于红黑树是 BST，<Text bold>中序遍历即为升序</Text>，因此 TreeMap 的 key 和 TreeSet 的元素
      在迭代时自动保持<Text bold>有序（默认自然升序）</Text>。
    </Paragraph>

    <Heading4>5.2 HashMap 的树化</Heading4>
    <Paragraph>
      Java 8 之后，<InlineCode>HashMap</InlineCode> 中同一个桶（bucket）的链表在
      <Text bold>链表长度 ≥ 8 且数组容量 ≥ 64</Text> 时，会把链表转换为红黑树（树化），
      使该桶的查找从 O(n) 优化到 O(log n)。当红黑树节点减少到 ≤ 6 时，再退化回链表。
    </Paragraph>
    <Callout type="tip" title="HashMap 树化的两个阈值都要满足">
      仅链表长度 ≥ 8 不够，还需要数组容量 ≥ 64。若数组容量 &lt; 64 且链表较长，
      HashMap 会优先<Text bold>扩容（resize）</Text>而非树化，因为扩容可以把链表分散到不同桶中。
    </Callout>

    <Heading3>6. 代码示例：TreeMap 自动有序遍历</Heading3>
    <CodeBlock
      title="TreeMapDemo.java"
      code={`import java.util.TreeMap;
import java.util.Map;

public class TreeMapDemo {
    public static void main(String[] args) {
        // TreeMap 底层是红黑树，key 自动按升序排列
        TreeMap<Integer, String> map = new TreeMap<>();

        // 故意乱序插入
        map.put(50, "五十");
        map.put(20, "二十");
        map.put(80, "八十");
        map.put(10, "十");
        map.put(35, "三十五");
        map.put(65, "六十五");
        map.put(90, "九十");

        System.out.println("====== TreeMap 默认升序遍历 ======");
        for (Map.Entry<Integer, String> entry : map.entrySet()) {
            System.out.println("key=" + entry.getKey() + "  value=" + entry.getValue());
        }

        System.out.println();
        System.out.println("====== 常用方法演示 ======");
        System.out.println("最小 key：" + map.firstKey());
        System.out.println("最大 key：" + map.lastKey());
        System.out.println("小于 40 的最大 key：" + map.lowerKey(40));
        System.out.println("大于 40 的最小 key：" + map.higherKey(40));
        System.out.println("key=50 的 value：" + map.get(50));

        System.out.println();
        System.out.println("====== 降序遍历（descendingMap）======");
        for (Map.Entry<Integer, String> entry : map.descendingMap().entrySet()) {
            System.out.println("key=" + entry.getKey() + "  value=" + entry.getValue());
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`====== TreeMap 默认升序遍历 ======
key=10  value=十
key=20  value=二十
key=35  value=三十五
key=50  value=五十
key=65  value=六十五
key=80  value=八十
key=90  value=九十

====== 常用方法演示 ======
最小 key：10
最大 key：90
小于 40 的最大 key：35
大于 40 的最小 key：50
key=50 的 value：五十

====== 降序遍历（descendingMap）======
key=90  value=九十
key=80  value=八十
key=65  value=六十五
key=50  value=五十
key=35  value=三十五
key=20  value=二十
key=10  value=十`}
    />
    <Paragraph>
      无论插入顺序如何混乱，遍历 TreeMap 始终按 key 升序输出——这是红黑树（BST）
      中序遍历有序性的直接体现。<InlineCode>firstKey()</InlineCode> 和
      <InlineCode>lastKey()</InlineCode> 等导航方法也因此能以 O(log n) 高效返回边界值，
      这在普通 HashMap 中是无法实现的。
    </Paragraph>
    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>
          AVL 树严格平衡（|BF| ≤ 1），查找效率最优，但插入/删除旋转开销大。
        </ListItem>
        <ListItem>
          红黑树近似平衡，五条性质保证树高 ≤ 2 × log₂(n+1)，插入/删除旋转次数少（最多 3 次），
          是实际工程的首选。
        </ListItem>
        <ListItem>
          红黑树五条性质：① 非红即黑 ② 根黑 ③ NIL 黑 ④ 红节点的孩子全黑 ⑤ 任意节点到所有 NIL 路径的黑节点数相同。
        </ListItem>
        <ListItem>
          JDK 中 TreeMap、TreeSet 底层是红黑树，提供 O(log n) 的有序操作。
        </ListItem>
        <ListItem>
          HashMap 链表长度 ≥ 8 且数组容量 ≥ 64 时树化为红黑树，提升最坏查找性能。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断红黑树性质合法性"
      code={`问：下图所示的树是否是合法的红黑树？如果不合法，违反了哪条性质？
（R=红，B=黑，NIL 节点均为黑色，图中不显示 NIL）

          10(B)
         /      \\
       5(R)     15(R)
      /    \\
   3(R)    7(B)

请逐条检查五条性质：
  性质1：节点非红即黑？
  性质2：根节点为黑？
  性质3：NIL 节点为黑？
  性质4：红节点的两个孩子均为黑？
  性质5：任意节点到所有后代 NIL 路径上黑节点数相同？`}
      answerCode={`结论：该树不是合法的红黑树，违反了性质 4。

逐条检查：
  性质1：所有节点颜色明确（R 或 B），符合 ✓
  性质2：根节点 10 是黑色，符合 ✓
  性质3：所有 NIL 叶子为黑色，符合 ✓
  性质4：违反！节点 5 是红色，但它的左孩子 3 也是红色。
         红色节点的子节点必须全为黑色，这里出现了「连续红节点」（5→3），违反性质 4 ✗
  性质5：由于树不合法，无需继续验证，但可以观察到：
         路径 10→5→3→NIL 的黑节点：10, 3（两个黑）
         路径 10→5→7→NIL 的黑节点：10, 7（两个黑）
         路径 10→15→NIL 的黑节点：10, 15（两个黑）
         黑色高度一致，性质 5 本身没有被违反。

修复方式：将 5 由红色改为黑色（但这会导致性质 5 不一致，需要整体重新调整），
          或者将 3 改为黑色（同样需要整体调整）。
          实际上红黑树插入时有完整的变色+旋转算法来修复，不能仅修改单个节点颜色。`}
    />

    <CodeBlock
      qa
      title="练习2：使用 TreeMap 实现有序词频统计"
      code={`// 要求：给定一个字符串数组 words，统计每个单词出现的次数，
// 并按单词字典序（升序）输出「单词: 次数」。
// 使用 TreeMap 实现，利用其自动有序的特性。

import java.util.TreeMap;

public class WordCount {
    public static void main(String[] args) {
        String[] words = {"banana", "apple", "cherry", "apple", "banana", "apple", "date"};

        // 请用 TreeMap 补全词频统计代码
        // 预期输出（按字典序）：
        // apple: 3
        // banana: 2
        // cherry: 1
        // date: 1
    }
}`}
      answerCode={`import java.util.TreeMap;
import java.util.Map;

public class WordCount {
    public static void main(String[] args) {
        String[] words = {"banana", "apple", "cherry", "apple", "banana", "apple", "date"};

        TreeMap<String, Integer> map = new TreeMap<>();
        for (String word : words) {
            // getOrDefault：若 key 不存在则默认值为 0，再加 1 存回去
            map.put(word, map.getOrDefault(word, 0) + 1);
        }

        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}

/* 控制台输出：
apple: 3
banana: 2
cherry: 1
date: 1

解析：TreeMap 底层红黑树以 String 的自然顺序（字典序/字母序）维护 key，
      无需手动排序，遍历 entrySet() 时自动按 key 升序输出。
      若改用 HashMap，输出顺序不确定；若需要降序，改用 new TreeMap<>(Comparator.reverseOrder())。
*/`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习3：AVL 树 vs 红黑树 场景选择"
      code={`问：以下两个场景，分别更适合使用 AVL 树还是红黑树？请说明理由。

场景 A：一个只读的静态字典，在程序启动时一次性构建完毕，
        之后频繁被多个线程查询（查询次数远远大于修改次数）。

场景 B：一个实时订单管理系统，每秒都有大量订单的插入和删除，
        同时也有频繁的查询，插入/删除与查询的比例接近 1:1。`}
      answerCode={`答案：

场景 A 更适合 AVL 树：
  理由：场景 A 以查询为主，几乎不修改。AVL 树严格平衡，树高不超过 1.44×log₂n，
  比红黑树（最高 2×log₂(n+1)）更矮，查询路径更短，查询效率略优。
  虽然构建时旋转开销更大，但一次性构建、多次查询，整体收益正向。

场景 B 更适合红黑树：
  理由：场景 B 插入/删除非常频繁。红黑树插入/删除后最多旋转 3 次（变色 O(log n)），
  维护成本远低于 AVL 树（每次插入/删除可能需要回溯并旋转 O(log n) 次）。
  牺牲少量查询性能换来大幅降低写操作开销，整体吞吐量更高。
  这也是 JDK 选择红黑树作为 TreeMap/TreeSet/HashMap 底层结构的根本原因——
  通用集合框架需要在读写混合场景下保持高性能。

总结：
  读多写少 → AVL 树（严格平衡，查询最优）
  读写均衡 / 写多 → 红黑树（旋转少，吞吐量高）`}
    />
  </article>
);

export default index;
