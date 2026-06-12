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
    <Title>数据结构概述</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>数据结构（Data Structure）</Text>是计算机存储、组织和管理数据的方式。
        选择合适的数据结构，直接决定程序增删查改的效率。
        本节从「是什么、为什么学」出发，区分逻辑结构与物理存储结构，
        给出常见数据结构的横向对比总览，最后系统讲解大 O 时间复杂度与空间复杂度，
        为后续各章的深入学习打好基础。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是数据结构</Heading3>
    <Paragraph>
      数据结构是<Text bold>数据的组织、存储和管理方式</Text>，描述数据元素之间的关系。
      同样是存一批整数，放在数组里还是链表里，对「查第 100 个元素」和「在中间插入一个元素」的效率会天壤之别。
      因此，数据结构与算法是密不可分的一对——算法是解决问题的步骤，数据结构是算法赖以高效运行的载体。
    </Paragraph>
    <Callout type="tip" title="一个直观类比">
      把数据想象成图书馆里的书：
      按书架顺序摆放（数组）可以快速找到第 N 本，但插入一本书需要把后面全部挪位；
      用活页夹串起来（链表）插入很方便，但找第 N 本得从头翻起。
      不同的「摆放方式」就是不同的数据结构。
    </Callout>

    <Heading3>2. 为什么要学数据结构</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>决定程序的运行效率</Text>：数据量小时感觉不出差别，数据量到百万、千万级时，
        O(1) 与 O(n) 的差距就是「瞬间完成」与「卡死」的差距。
      </ListItem>
      <ListItem>
        <Text bold>Java 集合框架的基础</Text>：<InlineCode>ArrayList</InlineCode> 底层是数组，
        <InlineCode>LinkedList</InlineCode> 底层是双向链表，
        <InlineCode>HashMap</InlineCode> 底层是哈希表 + 红黑树——
        懂了数据结构才能理解集合框架，才能在面试中说清楚「为什么用这个集合」。
      </ListItem>
      <ListItem>
        <Text bold>算法面试的必考项</Text>：力扣（LeetCode）几乎所有题目都涉及数组、链表、树、图、哈希表中的一种或多种。
      </ListItem>
      <ListItem>
        <Text bold>架构设计的工具箱</Text>：消息队列用队列、系统日志用栈做回溯、数据库索引用 B+ 树——
        这些都是数据结构在工程中的直接应用。
      </ListItem>
    </OrderedList>

    <Heading3>3. 逻辑结构与物理（存储）结构</Heading3>
    <Paragraph>
      数据结构分两个维度来看：<Text bold>逻辑结构</Text>描述数据元素之间的逻辑关系（与存储无关），
      <Text bold>物理结构</Text>（也称存储结构）描述数据在内存中实际怎么放。
    </Paragraph>

    <Heading4>3.1 逻辑结构的四种形式</Heading4>
    <Table
      head={['逻辑结构', '特征', '典型例子']}
      rows={[
        ['集合结构', '元素间除「同属一个集合」外无其他关系，无序、无重复要求', '数学集合、Java 的 Set'],
        ['线性结构', '元素一对一，有唯一前驱和唯一后继（首尾除外）', '数组、链表、栈、队列'],
        ['树形结构', '元素一对多，每个节点最多一个父节点、可有多个子节点', '二叉树、B+ 树、文件目录'],
        ['图形结构', '元素多对多，任意两节点之间均可有关系', '社交网络、地图路网、依赖关系图'],
      ]}
    />

    <Heading4>3.2 物理（存储）结构的两种形式</Heading4>
    <Table
      head={['物理结构', '内存布局', '优点', '缺点', '对应逻辑结构的典型实现']}
      rows={[
        ['顺序存储', '一段连续的内存地址，元素紧挨着', '随机访问 O(1)，CPU 缓存友好', '插入/删除需搬移元素，大小固定', '数组实现线性表、堆'],
        ['链式存储', '分散在内存各处，每个节点额外存指针指向下一节点', '插入/删除只改指针 O(1)，动态扩容', '随机访问需从头遍历 O(n)，额外内存开销', '链表、树、图的邻接表'],
      ]}
    />
    <Callout type="warning" title="逻辑结构与物理结构可以交叉组合">
      同一种逻辑结构可以用不同物理结构实现：
      栈（逻辑上是线性结构）既可以用数组实现（<InlineCode>ArrayDeque</InlineCode>），
      也可以用链表实现（<InlineCode>LinkedList</InlineCode>）。
      理解这一点，才不会把「数据结构的概念」和「具体实现」混淆。
    </Callout>

    <Heading3>4. 常见数据结构总览</Heading3>
    <Table
      head={['数据结构', '存储方式', '访问', '查找', '插入/删除', '典型适用场景']}
      rows={[
        ['数组', '顺序（连续内存）', 'O(1)', '无序 O(n)；有序二分 O(log n)', 'O(n)', '下标随机访问、固定大小数据集'],
        ['链表', '链式（分散指针）', 'O(n)', 'O(n)', 'O(1)（已知节点位置）', '频繁插入删除、不需随机访问'],
        ['栈', '顺序或链式', 'O(1)（仅栈顶）', 'O(n)', 'O(1)（仅栈顶 push/pop）', '括号匹配、函数调用栈、撤销操作'],
        ['队列', '顺序或链式', 'O(1)（队头队尾）', 'O(n)', 'O(1)（队头出/队尾入）', '任务调度、消息队列、BFS 广度优先搜索'],
        ['哈希表', '顺序（数组 + 链表/树）', 'O(1) 均摊', 'O(1) 均摊', 'O(1) 均摊', '键值对存储、去重、快速查找'],
        ['二叉搜索树', '链式', 'O(log n) 均摊', 'O(log n) 均摊', 'O(log n) 均摊', '有序动态集合、范围查询'],
        ['堆', '顺序（数组模拟完全二叉树）', 'O(1)（仅堆顶）', 'O(n)', 'O(log n)', '优先队列、TopK 问题、堆排序'],
        ['图', '邻接矩阵或邻接表', 'O(1)/O(degree)', 'O(V+E)', 'O(1)/O(1)', '路径规划、社交关系、依赖分析'],
      ]}
    />
    <Callout type="tip" title="复杂度数值均为理想/平均情况">
      表中复杂度为平均情况。哈希表最坏情况可退化到 O(n)（全部哈希冲突）；
      二叉搜索树若不平衡（退化成链表）也可达 O(n)。
      实际开发中 Java 的 <InlineCode>HashMap</InlineCode> 和 <InlineCode>TreeMap</InlineCode>
      已做了大量优化，可放心使用。
    </Callout>

    <Heading3>5. 时间复杂度与空间复杂度——大 O 表示法</Heading3>
    <Paragraph>
      衡量算法效率有两把尺子：<Text bold>时间复杂度</Text>（执行步骤随数据量 n 的增长趋势）和
      <Text bold>空间复杂度</Text>（额外内存占用随 n 的增长趋势）。
      两者都用<Text bold>大 O 表示法（Big O Notation）</Text>描述——只保留增长最快的项，忽略系数和低阶项。
    </Paragraph>
    <Callout type="tip" title="大 O 的本质">
      大 O 描述的是「最坏情况下的上界」或「数量级」，不关心具体的常数系数。
      例如：执行了 3n + 5 步 → O(n)；执行了 2n² + 100n + 999 步 → O(n²)。
    </Callout>

    <Heading4>5.1 常见时间复杂度说明与对比</Heading4>
    <Table
      head={['复杂度', '名称', '含义', 'n=1000 时的大致操作数', '典型例子']}
      rows={[
        ['O(1)', '常数阶', '无论 n 多大，操作次数固定', '1', '数组下标访问、哈希表查找'],
        ['O(log n)', '对数阶', '每次操作将问题规模减半', '约 10', '二分查找、平衡树操作'],
        ['O(n)', '线性阶', '操作次数与 n 成正比', '1 000', '数组遍历、链表查找'],
        ['O(n log n)', '线性对数阶', 'n 次操作，每次 log n 级别', '约 10 000', '归并排序、快速排序（均摊）'],
        ['O(n²)', '平方阶', '双层嵌套循环', '1 000 000', '冒泡排序、选择排序'],
        ['O(2ⁿ)', '指数阶', '每增加一个元素，规模翻倍', '约 10³⁰¹', '暴力枚举所有子集（不可接受）'],
      ]}
    />

    <Heading4>5.2 增长趋势对比（n 从小到大时各复杂度的差异）</Heading4>
    <CodeBlock
      language="text"
      title="各复杂度随 n 增长的操作数量对比"
      code={`n        O(1)   O(log n)  O(n)    O(n log n)  O(n²)
---------------------------------------------------------
10       1      3         10      30          100
100      1      7         100     700         10,000
1,000    1      10        1,000   10,000      1,000,000
10,000   1      13        10,000  130,000     100,000,000
100,000  1      17        100,000 1,700,000   10,000,000,000

结论：O(1) 最优；O(n²) 在 n 超过万级时性能急剧恶化。`}
    />

    <Heading4>5.3 代码示例：用循环演示不同复杂度</Heading4>
    <CodeBlock
      title="ComplexityDemo.java"
      code={`public class ComplexityDemo {

    // O(1)：无论 n 多大，只执行一次操作
    public static int getFirst(int[] arr) {
        return arr[0];  // 直接下标访问，一步到位
    }

    // O(log n)：每次将搜索范围减半（二分查找）
    // 前提：arr 已排好序
    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    // O(n)：遍历数组，操作次数与 n 成正比
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }

    // O(n²)：双层嵌套，操作次数是 n 的平方
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] sorted = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};  // 已排序数组

        // O(1)
        System.out.println("O(1) 取第一个元素: " + getFirst(sorted));

        // O(log n)：在 10 个元素中二分查找 13
        System.out.println("O(log n) 二分查找 13，索引: " + binarySearch(sorted, 13));

        // O(n)：线性查找 13
        System.out.println("O(n) 线性查找 13，索引: " + linearSearch(sorted, 13));

        // O(n²)：冒泡排序
        int[] unsorted = {5, 3, 9, 1, 7};
        bubbleSort(unsorted);
        System.out.print("O(n²) 冒泡排序结果: ");
        for (int v : unsorted) System.out.print(v + " ");
        System.out.println();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`O(1) 取第一个元素: 1
O(log n) 二分查找 13，索引: 6
O(n) 线性查找 13，索引: 6
O(n²) 冒泡排序结果: 1 3 5 7 9 `}
    />
    <Paragraph>
      四个方法完成的任务相似，但背后的效率相差悬殊：
      <InlineCode>getFirst</InlineCode> 永远只走 1 步（O(1)）；
      <InlineCode>binarySearch</InlineCode> 在 10 个元素中最多走 4 步（O(log n)）；
      <InlineCode>linearSearch</InlineCode> 最坏要走 10 步（O(n)）；
      <InlineCode>bubbleSort</InlineCode> 对 5 个元素要走约 10 步（O(n²)），
      若换成 10 000 个元素则需约 1 亿步——性能灾难。
    </Paragraph>

    <Heading4>5.4 空间复杂度</Heading4>
    <Paragraph>
      空间复杂度衡量算法运行时<Text bold>额外申请的内存</Text>随 n 的增长趋势（不含输入本身占用的空间）。
    </Paragraph>
    <Table
      head={['空间复杂度', '含义', '典型例子']}
      rows={[
        ['O(1)', '额外内存固定，与 n 无关', '原地排序（冒泡、选择），只用几个临时变量'],
        ['O(n)', '额外内存与 n 成正比', '创建一个与输入等长的辅助数组'],
        ['O(log n)', '递归调用栈深度为 log n', '二分查找的递归版本'],
        ['O(n²)', '二维辅助数组', '动态规划某些问题的二维 dp 表'],
      ]}
    />
    <Callout type="tip" title="时间与空间的权衡（Time-Space Tradeoff）">
      算法设计中常见「用空间换时间」的思路：例如哈希表用额外 O(n) 空间，换来 O(1) 的查找时间；
      动态规划用额外的 dp 数组，避免重复计算从而降低时间复杂度。
      没有绝对最优，需要根据具体场景权衡。
    </Callout>

    <Heading3>6. 知识点汇总</Heading3>
    <Table
      head={['概念', '核心要点']}
      rows={[
        ['数据结构', '数据元素及其相互关系的组织方式，决定增删查改的效率'],
        ['逻辑结构', '集合、线性、树形、图形四种，描述逻辑关系，与存储无关'],
        ['物理结构', '顺序存储（连续内存，随机访问快）和链式存储（分散指针，插删快）'],
        ['大 O 表示法', '描述算法效率的数量级，忽略常数系数和低阶项'],
        ['O(1)', '常数阶，最优，操作次数与 n 无关'],
        ['O(log n)', '对数阶，很优，每步将问题减半，二分查找/平衡树'],
        ['O(n)', '线性阶，常见且可接受，需遍历全部元素'],
        ['O(n log n)', '线性对数阶，良好，主流排序算法的目标'],
        ['O(n²)', '平方阶，较差，n 超万级时应尽量避免'],
        ['空间复杂度', '额外内存开销，常与时间复杂度做权衡'],
      ]}
    />
    <Callout type="success" title="小结">
      <Paragraph>
        数据结构是编程的地基——选错了数据结构，再精妙的算法也发挥不出来。
        本节建立了「逻辑结构 vs 物理结构」「时间复杂度 vs 空间复杂度」两对核心认知框架。
        从下一节开始，我们将逐一深入每种具体的数据结构，
        结合 Java 代码与实际操作，把每个知识点讲透。
      </Paragraph>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断时间复杂度"
      code={`问：分析下面三段代码各自的时间复杂度（以 n 表示数据规模）。

// 代码 A
for (int i = 0; i < n; i++) {
    System.out.println(i);
}

// 代码 B
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        System.out.println(i + "," + j);
    }
}

// 代码 C
int i = n;
while (i > 1) {
    System.out.println(i);
    i = i / 2;   // 每次折半
}`}
      answerCode={`代码 A：O(n)
  外层循环执行 n 次，每次打印一行，共 n 步，线性阶。

代码 B：O(n²)
  双层嵌套，外层 n 次 × 内层 n 次 = n² 次打印，平方阶。
  是冒泡排序、选择排序的典型复杂度。

代码 C：O(log n)
  i 从 n 开始每次除以 2，循环次数约为 log₂(n)。
  例如 n=1024 时只循环 10 次（1024→512→…→2→1），对数阶。

口诀：单层遍历 → O(n)；双层嵌套 → O(n²)；每次折半/翻倍 → O(log n)。`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习2：逻辑结构分类"
      code={`问：下列场景各属于哪种逻辑结构（集合、线性、树形、图形）？
请说明理由。

(1) 班级名单（学号不重复，无特定顺序）
(2) 排队买票的队伍（先来先服务）
(3) 公司组织架构（CEO → 部门总监 → 员工）
(4) 城市地铁线路图（多条线路相互交叉）`}
      answerCode={`(1) 集合结构
    元素（学号）之间除「都属于同一个班」外没有其他关系，无序、无重复，是典型的集合。

(2) 线性结构
    队伍中每个人都有唯一的前驱（前面那人）和唯一的后继（后面那人），
    队头和队尾是两个端点，符合线性结构的定义。

(3) 树形结构
    CEO 是根节点，每个员工只有一个直接上级（一个父节点），
    但可以有多个下级（多个子节点），是典型的树形（层级）结构。

(4) 图形结构
    每个地铁站是节点，站与站之间的轨道是边；一个站可以连接多条线路、多个站，
    是多对多的关系，属于图形结构。`}
    />

    <CodeBlock
      qa
      title="练习3：统计方法的时间和空间复杂度"
      code={`// 下面方法用于找出数组中的最大值和次大值，
// 请分析其时间复杂度和空间复杂度。

public class FindTopTwo {
    public static void findTopTwo(int[] arr) {
        int max1 = Integer.MIN_VALUE;  // 最大值
        int max2 = Integer.MIN_VALUE;  // 次大值
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] > max1) {
                max2 = max1;
                max1 = arr[i];
            } else if (arr[i] > max2) {
                max2 = arr[i];
            }
        }
        System.out.println("最大值: " + max1 + "，次大值: " + max2);
    }

    public static void main(String[] args) {
        int[] data = {3, 1, 9, 5, 7, 2, 8};
        findTopTwo(data);
    }
}`}
      answerCode={`public class FindTopTwo {
    public static void findTopTwo(int[] arr) {
        int max1 = Integer.MIN_VALUE;
        int max2 = Integer.MIN_VALUE;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] > max1) {
                max2 = max1;
                max1 = arr[i];
            } else if (arr[i] > max2) {
                max2 = arr[i];
            }
        }
        System.out.println("最大值: " + max1 + "，次大值: " + max2);
    }

    public static void main(String[] args) {
        int[] data = {3, 1, 9, 5, 7, 2, 8};
        findTopTwo(data);
    }
}

/* 控制台输出：
最大值: 9，次大值: 8

时间复杂度分析：O(n)
  只有一层 for 循环，遍历 arr.length 次，每次做常数步操作，整体线性阶。

空间复杂度分析：O(1)
  除了两个 int 类型的临时变量 max1、max2 之外，
  没有申请任何与 n 相关的额外内存，空间消耗固定，常数阶。

解析：这是一个「时间 O(n)、空间 O(1)」的优秀实现——
  只需一次遍历、固定的两个变量，就完成了找最大值和次大值的任务。
*/`}
    />
  </article>
);

export default index;
