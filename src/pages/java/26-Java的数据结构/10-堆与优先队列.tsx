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
    <Title>堆（Heap）与优先队列（PriorityQueue）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>堆（Heap）</Text>是一棵满足特定有序性的<Text bold>完全二叉树</Text>，
        支持以 O(log n) 的代价插入或删除元素，并以 O(1) 随时取到「最值」（最大或最小）。
        堆是优先队列、堆排序、TopK 问题的核心数据结构。
        Java 标准库中的 <InlineCode>PriorityQueue&lt;E&gt;</InlineCode> 就是堆的直接封装：
        默认小顶堆，支持传入自定义 <InlineCode>Comparator</InlineCode> 变为大顶堆或任意优先级。
        本节系统讲解堆的定义与性质、数组存储方式、核心操作（上浮/下沉）、
        时间复杂度，以及在 Java 中的使用和典型应用场景。
      </Paragraph>
    </Callout>

    <Heading3>1. 堆的定义与分类</Heading3>
    <Paragraph>
      <Text bold>堆</Text>必须满足两个条件：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>结构性</Text>：是一棵<Text bold>完全二叉树</Text>
        （从根到最后一层自左向右填满，最后一层可不满但节点靠左）。
      </ListItem>
      <ListItem>
        <Text bold>有序性（堆序性）</Text>：每个父节点与其子节点满足固定的大小关系。
      </ListItem>
    </OrderedList>
    <Table
      head={['堆类型', '堆序性', '堆顶元素', '适用场景']}
      rows={[
        ['大顶堆（Max-Heap）', '每个父节点 ≥ 其所有子节点', '最大值', '求最大值、堆排序（升序）'],
        ['小顶堆（Min-Heap）', '每个父节点 ≤ 其所有子节点', '最小值', '求最小值、优先队列、堆排序（降序）'],
      ]}
    />
    <Callout type="tip" title="堆只保证父子有序，不保证兄弟有序">
      堆的有序性仅约束父节点与子节点之间的关系，同层两个兄弟节点之间没有大小限制。
      因此堆<Text bold>不是</Text>排好序的结构，只保证「堆顶最值」随时可达。
    </Callout>

    <Heading3>2. 堆的数组存储方式</Heading3>
    <Paragraph>
      完全二叉树可以用数组紧凑存储（下标从 0 开始），无需额外的指针。
      按层序（BFS 顺序）依次把树的节点存入数组，父子节点的下标满足以下规律：
    </Paragraph>
    <Table
      head={['节点', '数组下标公式（父节点下标为 i）', '说明']}
      rows={[
        ['父节点', 'i', '—'],
        ['左子节点', '2 * i + 1', '父节点 i 的左孩子'],
        ['右子节点', '2 * i + 2', '父节点 i 的右孩子'],
        ['任意子节点的父节点', '(child - 1) / 2（整除）', '子节点下标为 child'],
      ]}
    />
    <CodeBlock
      language="text"
      title="小顶堆的数组存储示意"
      code={`         1          ← 堆顶（最小值），下标 0
       /   \\
      3     2         下标 1、2
     / \\   / \\
    7   5  4   8      下标 3、4、5、6

数组：[1, 3, 2, 7, 5, 4, 8]
       0  1  2  3  4  5  6

验证：
  下标 0（值 1）的左孩子：2*0+1 = 1（值 3）✓
  下标 0（值 1）的右孩子：2*0+2 = 2（值 2）✓
  下标 1（值 3）的父节点：(1-1)/2 = 0（值 1）✓
  下标 5（值 4）的父节点：(5-1)/2 = 2（值 2）✓`}
    />
    <Paragraph>
      这种数组存储方式的优点：内存连续、缓存友好、无需指针开销，
      通过简单的下标算术就能定位父节点和子节点，实现高效的上浮和下沉操作。
    </Paragraph>

    <Heading3>3. 堆的核心操作：上浮（siftUp）与下沉（siftDown）</Heading3>

    <Heading4>3.1 入堆（插入）—— 上浮（siftUp）</Heading4>
    <Paragraph>
      插入新元素时，先将其追加到数组末尾（完全二叉树最后一个位置），
      然后不断与父节点比较：若违反堆序性，则与父节点<Text bold>交换</Text>，
      向上走直到满足堆序性或到达根节点，该过程称为<Text bold>上浮（siftUp / heapify-up）</Text>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="小顶堆插入元素 2 的上浮过程"
      code={`初始堆：[1, 3, 4, 7, 5, 8, 9]

插入 2，追加到末尾（下标 7）：
  [1, 3, 4, 7, 5, 8, 9, 2]

上浮 2（下标 7）：
  父节点下标 = (7-1)/2 = 3，值 = 7；2 < 7，交换
  [1, 3, 4, 2, 5, 8, 9, 7]
  当前下标 = 3，父节点下标 = (3-1)/2 = 1，值 = 3；2 < 3，交换
  [1, 2, 4, 3, 5, 8, 9, 7]
  当前下标 = 1，父节点下标 = (1-1)/2 = 0，值 = 1；2 >= 1，停止

结果：[1, 2, 4, 3, 5, 8, 9, 7]  ← 仍是合法小顶堆`}
    />

    <Heading4>3.2 出堆（取堆顶）—— 下沉（siftDown）</Heading4>
    <Paragraph>
      取出堆顶（最值）时，不能直接删除下标 0 的元素（会破坏完全二叉树结构）。
      正确做法：将数组最后一个元素移到堆顶，删除原末尾，然后让新堆顶元素
      不断与<Text bold>较小（小顶堆）或较大（大顶堆）的子节点</Text>交换，
      向下走直到满足堆序性，该过程称为<Text bold>下沉（siftDown / heapify-down）</Text>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="小顶堆取出堆顶 1 的下沉过程"
      code={`堆：[1, 2, 4, 3, 5, 8, 9, 7]

取出堆顶 1，把末尾元素 7 移到堆顶，删除末尾：
  [7, 2, 4, 3, 5, 8, 9]

下沉 7（下标 0）：
  左孩子 1（值 2），右孩子 2（值 4）；较小的是左孩子 2；7 > 2，交换
  [2, 7, 4, 3, 5, 8, 9]
  下标 = 1；左孩子 3（值 3），右孩子 4（值 5）；较小的是左孩子 3；7 > 3，交换
  [2, 3, 4, 7, 5, 8, 9]
  下标 = 3；左孩子 7（超出数组范围），停止

结果：[2, 3, 4, 7, 5, 8, 9]  ← 仍是合法小顶堆，堆顶变为次小值 2`}
    />

    <Heading3>4. 堆操作的时间复杂度</Heading3>
    <Table
      head={['操作', '时间复杂度', '说明']}
      rows={[
        ['查看堆顶（peek）', 'O(1)', '直接返回数组下标 0 的元素'],
        ['插入（offer）', 'O(log n)', '追加末尾后上浮，最多走树高层'],
        ['删除堆顶（poll）', 'O(log n)', '末尾移堆顶后下沉，最多走树高层'],
        ['删除任意元素', 'O(log n)', '找到后替换为末尾元素，再上浮或下沉'],
        ['建堆（heapify）', 'O(n)', '从最后一个非叶节点开始逐一下沉，均摊 O(n)'],
        ['堆排序（n 次 poll）', 'O(n log n)', '每次 poll O(log n)，共 n 次'],
      ]}
    />
    <Callout type="tip" title="建堆比逐个插入更快">
      把 n 个无序元素建成堆，直接使用「从后向前 siftDown」的方式只需 O(n)，
      比逐个调用 offer（O(n log n)）快一倍以上，这也是 <InlineCode>PriorityQueue</InlineCode>
      接受 <InlineCode>Collection</InlineCode> 参数时内部的实现方式。
    </Callout>

    <Heading3>5. Java PriorityQueue 的使用</Heading3>
    <Paragraph>
      Java 的 <InlineCode>PriorityQueue&lt;E&gt;</InlineCode> 在 <InlineCode>java.util</InlineCode> 包中，
      底层是<Text bold>小顶堆</Text>（自然顺序，即最小元素优先出队）。
      若需要大顶堆或自定义优先级，传入 <InlineCode>Comparator</InlineCode> 即可。
    </Paragraph>
    <Table
      head={['方法', '作用', '时间复杂度']}
      rows={[
        ['offer(e) / add(e)', '插入元素，触发上浮', 'O(log n)'],
        ['peek()', '查看堆顶，不移除；队空返回 null', 'O(1)'],
        ['poll()', '移除并返回堆顶；队空返回 null', 'O(log n)'],
        ['remove()', '移除并返回堆顶；队空抛异常', 'O(log n)'],
        ['size()', '元素个数', 'O(1)'],
        ['isEmpty()', '是否为空', 'O(1)'],
        ['contains(o)', '是否包含元素 o', 'O(n)（需遍历）'],
      ]}
    />
    <Callout type="warning" title="PriorityQueue 的 for-each 遍历不保证顺序">
      直接用 for-each 或迭代器遍历 <InlineCode>PriorityQueue</InlineCode> 时，
      输出的顺序<Text bold>不是</Text>有序的（只是数组的存储顺序）。
      要按优先级顺序取元素，必须反复调用 <InlineCode>poll()</InlineCode>。
    </Callout>

    <Heading3>6. 典型应用场景</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>优先队列（任务调度）</Text>：每次取出优先级最高（或最低）的任务处理，
        O(log n) 插入和取出，比排序后取效率高。
      </ListItem>
      <ListItem>
        <Text bold>TopK 问题</Text>：从海量数据中取前 K 大或前 K 小。
        维护一个大小为 K 的小顶堆（求前 K 大）：遍历数据时，若元素大于堆顶则替换堆顶并重新调整，
        遍历结束堆内即为前 K 大，总时间复杂度 O(n log K)，远优于全排序 O(n log n)。
      </ListItem>
      <ListItem>
        <Text bold>堆排序</Text>：建堆 O(n) + 依次 poll O(n log n) = O(n log n)，
        原地排序，空间复杂度 O(1)。
      </ListItem>
      <ListItem>
        <Text bold>图算法</Text>：Dijkstra 最短路径、Prim 最小生成树均依赖优先队列选最小边/距离。
      </ListItem>
    </UnorderedList>

    <Heading3>7. 示例代码</Heading3>

    <Heading4>示例 1：默认小顶堆出队顺序</Heading4>
    <Paragraph>
      演示 <InlineCode>PriorityQueue&lt;Integer&gt;</InlineCode> 默认为小顶堆，
      插入无序数字后 <InlineCode>poll()</InlineCode> 总是返回当前最小值。
    </Paragraph>
    <CodeBlock
      title="MinHeapDemo.java"
      code={`import java.util.PriorityQueue;

public class MinHeapDemo {
    public static void main(String[] args) {
        // 默认小顶堆（自然顺序：小的优先出队）
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        minHeap.offer(5);
        minHeap.offer(1);
        minHeap.offer(8);
        minHeap.offer(3);
        minHeap.offer(2);

        System.out.println("堆大小：" + minHeap.size());
        System.out.println("堆顶（最小值）：" + minHeap.peek());

        // 依次 poll，每次取出当前最小值
        System.out.print("出队顺序（小顶堆）：");
        while (!minHeap.isEmpty()) {
            System.out.print(minHeap.poll() + " ");
        }
        System.out.println();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`堆大小：5
堆顶（最小值）：1
出队顺序（小顶堆）：1 2 3 5 8`}
    />
    <Paragraph>
      无论插入顺序如何，每次 <InlineCode>poll()</InlineCode> 都返回当前堆中最小的元素，
      出队序列从小到大，体现了小顶堆「最小值优先」的特性。
    </Paragraph>

    <Heading4>示例 2：自定义大顶堆</Heading4>
    <Paragraph>
      通过传入 <InlineCode>Comparator.reverseOrder()</InlineCode> 将默认小顶堆改为大顶堆，
      出队顺序变为从大到小。
    </Paragraph>
    <CodeBlock
      title="MaxHeapDemo.java"
      code={`import java.util.Comparator;
import java.util.PriorityQueue;

public class MaxHeapDemo {
    public static void main(String[] args) {
        // 大顶堆：传入 reverseOrder()，大的优先出队
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

        maxHeap.offer(5);
        maxHeap.offer(1);
        maxHeap.offer(8);
        maxHeap.offer(3);
        maxHeap.offer(2);

        System.out.println("堆顶（最大值）：" + maxHeap.peek());

        System.out.print("出队顺序（大顶堆）：");
        while (!maxHeap.isEmpty()) {
            System.out.print(maxHeap.poll() + " ");
        }
        System.out.println();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`堆顶（最大值）：8
出队顺序（大顶堆）：8 5 3 2 1`}
    />

    <Heading4>示例 3：自定义对象的优先队列（按任务优先级调度）</Heading4>
    <Paragraph>
      演示任务调度场景：每个 <InlineCode>Task</InlineCode> 有优先级（数值越小优先级越高），
      用 <InlineCode>PriorityQueue</InlineCode> 每次取出优先级最高（数值最小）的任务执行。
    </Paragraph>
    <CodeBlock
      title="TaskScheduler.java"
      code={`import java.util.PriorityQueue;

public class TaskScheduler {

    // 任务类
    static class Task {
        String name;
        int priority;  // 优先级，数值越小优先级越高

        Task(String name, int priority) {
            this.name = name;
            this.priority = priority;
        }

        @Override
        public String toString() {
            return "Task{name='" + name + "', priority=" + priority + "}";
        }
    }

    public static void main(String[] args) {
        // 按 priority 升序排列：priority 最小的最先出队（优先级最高）
        PriorityQueue<Task> taskQueue = new PriorityQueue<>(
            (a, b) -> a.priority - b.priority
        );

        taskQueue.offer(new Task("发邮件", 3));
        taskQueue.offer(new Task("修复线上 Bug", 1));
        taskQueue.offer(new Task("写文档", 5));
        taskQueue.offer(new Task("代码审查", 2));
        taskQueue.offer(new Task("开周会", 4));

        System.out.println("任务调度顺序：");
        while (!taskQueue.isEmpty()) {
            Task t = taskQueue.poll();
            System.out.println("  执行：" + t);
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`任务调度顺序：
  执行：Task{name='修复线上 Bug', priority=1}
  执行：Task{name='代码审查', priority=2}
  执行：Task{name='发邮件', priority=3}
  执行：Task{name='开周会', priority=4}
  执行：Task{name='写文档', priority=5}`}
    />
    <Paragraph>
      Lambda 表达式 <InlineCode>(a, b) -&gt; a.priority - b.priority</InlineCode> 定义了比较规则：
      priority 更小的排在前面（即优先级更高的先出队）。
      这是 <InlineCode>PriorityQueue</InlineCode> 自定义排序的标准写法，
      等价于 <InlineCode>Comparator.comparingInt(t -&gt; t.priority)</InlineCode>。
    </Paragraph>

    <Heading4>示例 4：用小顶堆求数组前 K 大元素（TopK）</Heading4>
    <Paragraph>
      经典 TopK 解法：维护一个大小为 K 的<Text bold>小顶堆</Text>，
      遍历数组时，若当前元素大于堆顶（小顶堆的堆顶是堆内最小值），则替换堆顶。
      遍历结束后，堆内存储的就是前 K 大的元素。
    </Paragraph>
    <CodeBlock
      language="text"
      title="TopK 思路示意（K=3，求前 3 大）"
      code={`数组：[3, 1, 9, 5, 7, 2, 8, 4, 6]
小顶堆（大小 <= 3），堆顶是堆内最小值

遍历：
  3 → 堆大小 < 3，直接入堆：[3]
  1 → 堆大小 < 3，直接入堆：[1, 3]
  9 → 堆大小 < 3，直接入堆：[1, 3, 9]
  5 → 堆已满，堆顶 1 < 5，替换：poll 1，offer 5 → [3, 5, 9]
  7 → 堆顶 3 < 7，替换：poll 3，offer 7 → [5, 7, 9]
  2 → 堆顶 5 > 2，2 不够大，跳过
  8 → 堆顶 5 < 8，替换：poll 5，offer 8 → [7, 8, 9]
  4 → 堆顶 7 > 4，跳过
  6 → 堆顶 7 > 6，跳过

最终堆：[7, 8, 9]  → 前 3 大元素为 7、8、9`}
    />
    <CodeBlock
      title="TopKDemo.java"
      code={`import java.util.Arrays;
import java.util.PriorityQueue;

public class TopKDemo {
    /**
     * 返回数组中前 k 大的元素（用小顶堆实现，时间复杂度 O(n log k)）
     */
    public static int[] topK(int[] nums, int k) {
        // 小顶堆（默认），大小维持 k
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        for (int num : nums) {
            if (minHeap.size() < k) {
                minHeap.offer(num);               // 堆未满，直接入堆
            } else if (num > minHeap.peek()) {    // 当前元素比堆顶（堆内最小值）大
                minHeap.poll();                   // 移除堆顶（淘汰最小的）
                minHeap.offer(num);               // 新元素入堆
            }
        }

        // 把堆内元素取出放入结果数组
        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = minHeap.poll();
        }
        return result;
    }

    public static void main(String[] args) {
        int[] nums = {3, 1, 9, 5, 7, 2, 8, 4, 6};
        int k = 3;
        int[] topK = topK(nums, k);
        System.out.println("原数组：" + Arrays.toString(nums));
        System.out.println("前 " + k + " 大元素（小到大）：" + Arrays.toString(topK));

        // 再验证一次
        int[] nums2 = {10, 4, 3, 50, 23, 90};
        int k2 = 2;
        System.out.println("原数组：" + Arrays.toString(nums2));
        System.out.println("前 " + k2 + " 大元素（小到大）：" + Arrays.toString(topK(nums2, k2)));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`原数组：[3, 1, 9, 5, 7, 2, 8, 4, 6]
前 3 大元素（小到大）：[7, 8, 9]
原数组：[10, 4, 3, 50, 23, 90]
前 2 大元素（小到大）：[50, 90]`}
    />
    <Paragraph>
      为什么用<Text bold>小顶堆</Text>而不是大顶堆来求前 K 大？
      小顶堆的堆顶始终是堆内最小值，相当于「候选区的门槛」：
      新元素只有大于当前门槛才能入围，自动淘汰最弱的，始终保留最强的 K 个。
      若用大顶堆则需存所有数据后取前 K 个，空间复杂度 O(n)；
      小顶堆方案空间复杂度仅 O(K)，尤其适合数据量远大于 K 的场景（如从亿级日志中找 Top100）。
    </Paragraph>

    <Heading3>8. 要点汇总</Heading3>
    <Table
      head={['要点', '结论']}
      rows={[
        ['堆结构', '完全二叉树 + 堆序性（父 ≥ 子 或 父 ≤ 子）'],
        ['数组存储', '下标 i 的左孩子 2i+1、右孩子 2i+2、父节点 (i-1)/2'],
        ['插入', '追加末尾 + 上浮（siftUp），O(log n)'],
        ['删除堆顶', '末尾替换堆顶 + 下沉（siftDown），O(log n)'],
        ['查看堆顶', 'O(1)，直接取下标 0'],
        ['Java PriorityQueue', '默认小顶堆；传 Comparator.reverseOrder() 得大顶堆'],
        ['TopK 惯用法', '前 K 大 → 小顶堆维护 K 个候选；前 K 小 → 大顶堆维护 K 个候选'],
        ['建堆', 'O(n)；逐个 offer O(n log n)'],
      ]}
    />
    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>堆 = 完全二叉树 + 父子有序；用数组存储无需指针，父子关系靠下标算术确定。</ListItem>
        <ListItem>核心操作：上浮（插入后修复）和下沉（删堆顶后修复），均 O(log n)；取堆顶 O(1)。</ListItem>
        <ListItem>
          <InlineCode>PriorityQueue</InlineCode> 默认小顶堆，传
          <InlineCode>Comparator</InlineCode> 可自定义任意优先级，是优先队列/TopK 的首选工具。
        </ListItem>
        <ListItem>TopK：求前 K 大用小顶堆（大小维持 K）；求前 K 小用大顶堆，空间 O(K)、时间 O(n log K)。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>9. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：合并 K 个有序数组（用小顶堆）"
      code={`// 要求：
// 给定 K 个升序整数数组，将它们合并成一个升序数组并打印。
// 示例：
//   arr1 = {1, 4, 7}
//   arr2 = {2, 5, 8}
//   arr3 = {3, 6, 9}
// 期望输出：1 2 3 4 5 6 7 8 9
//
// 提示：
//   用 PriorityQueue 存储「当前各数组的最小未处理元素」，
//   每次 poll 最小值输出，再把对应数组的下一个元素 offer 进去。
//   可以用 int[] {value, arrayIndex, elementIndex} 三元组入堆。

import java.util.PriorityQueue;

public class MergeKSortedArrays {
    public static void main(String[] args) {
        int[][] arrays = {
            {1, 4, 7},
            {2, 5, 8},
            {3, 6, 9}
        };
        // 补全代码：合并并打印结果
    }
}`}
      answerCode={`import java.util.PriorityQueue;

public class MergeKSortedArrays {
    public static void main(String[] args) {
        int[][] arrays = {
            {1, 4, 7},
            {2, 5, 8},
            {3, 6, 9}
        };

        // 小顶堆，按 int[0]（元素值）排序
        // int[0] = 值，int[1] = 数组下标，int[2] = 元素下标
        PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);

        // 把每个数组的第一个元素加入堆
        for (int i = 0; i < arrays.length; i++) {
            if (arrays[i].length > 0) {
                minHeap.offer(new int[]{arrays[i][0], i, 0});
            }
        }

        StringBuilder sb = new StringBuilder();
        while (!minHeap.isEmpty()) {
            int[] curr = minHeap.poll();
            int val = curr[0], arrIdx = curr[1], eleIdx = curr[2];
            sb.append(val).append(" ");

            // 若对应数组还有下一个元素，加入堆
            int nextIdx = eleIdx + 1;
            if (nextIdx < arrays[arrIdx].length) {
                minHeap.offer(new int[]{arrays[arrIdx][nextIdx], arrIdx, nextIdx});
            }
        }

        System.out.println("合并结果：" + sb.toString().trim());
    }
}

/* 控制台输出：
合并结果：1 2 3 4 5 6 7 8 9

解析：小顶堆每次 poll 全局最小值，再把该数组的下一个元素补充进堆，
  保持堆大小始终 ≤ K。总时间复杂度 O(n log K)，其中 n 为元素总数，K 为数组个数。
  这是「多路归并」的经典堆应用。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：数组中第 K 个最大元素"
      code={`// 要求：
// 给定整数数组 nums 和整数 k，返回数组中第 k 个最大的元素。
// 注意：是第 k 个最大，不是第 k 个不同的最大。
//
// 示例1：nums = {3, 2, 1, 5, 6, 4}，k = 2 → 输出 5
// 示例2：nums = {3, 2, 3, 1, 2, 4, 5, 5, 6}，k = 4 → 输出 4
//
// 要求用小顶堆（PriorityQueue 默认）实现，时间复杂度 O(n log k)。

import java.util.PriorityQueue;

public class KthLargest {
    public static int findKthLargest(int[] nums, int k) {
        // 补全代码
    }

    public static void main(String[] args) {
        System.out.println(findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2));       // 5
        System.out.println(findKthLargest(new int[]{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4)); // 4
    }
}`}
      answerCode={`import java.util.PriorityQueue;

public class KthLargest {
    public static int findKthLargest(int[] nums, int k) {
        // 小顶堆，维护大小为 k 的候选集
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll();  // 超过 k 个时淘汰最小的
            }
        }

        // 堆顶即为第 k 大元素
        return minHeap.peek();
    }

    public static void main(String[] args) {
        System.out.println(findKthLargest(new int[]{3, 2, 1, 5, 6, 4}, 2));          // 5
        System.out.println(findKthLargest(new int[]{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4)); // 4
    }
}

/* 控制台输出：
5
4

解析：维护一个大小为 k 的小顶堆，堆内始终是「遍历过的数中最大的 k 个」。
  堆满后再来一个新元素时，若它大于堆顶（当前第 k 大的候选），则淘汰堆顶换入新元素，
  否则新元素不够大，直接丢弃。遍历结束后堆顶就是第 k 大元素。
  时间复杂度 O(n log k)，空间复杂度 O(k)。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：用 PriorityQueue 模拟医院叫号系统"
      code={`// 要求：
// 医院挂号时，病人有病情等级（1=最危急，5=普通）。
// 用 PriorityQueue 模拟叫号：每次叫出当前等待中病情最危急（等级数字最小）的病人。
//
// 病人列表（姓名，等级）：
//   王大爷, 3    李小明, 1    张阿姨, 2    赵同学, 1    孙老师, 4
//
// 要求按叫号顺序打印：「叫号：xxx（等级 x）」

import java.util.PriorityQueue;

public class HospitalQueue {
    // 病人类
    static class Patient {
        String name;
        int level;  // 等级，1 最危急

        Patient(String name, int level) {
            this.name = name;
            this.level = level;
        }
    }

    public static void main(String[] args) {
        // 补全：创建 PriorityQueue，添加病人，依次叫号打印
    }
}`}
      answerCode={`import java.util.PriorityQueue;

public class HospitalQueue {
    static class Patient {
        String name;
        int level;

        Patient(String name, int level) {
            this.name = name;
            this.level = level;
        }
    }

    public static void main(String[] args) {
        // 按 level 升序排列：等级数字越小（越危急）越先出队
        PriorityQueue<Patient> queue = new PriorityQueue<>(
            (a, b) -> a.level - b.level
        );

        queue.offer(new Patient("王大爷", 3));
        queue.offer(new Patient("李小明", 1));
        queue.offer(new Patient("张阿姨", 2));
        queue.offer(new Patient("赵同学", 1));
        queue.offer(new Patient("孙老师", 4));

        System.out.println("=== 医院叫号 ===");
        while (!queue.isEmpty()) {
            Patient p = queue.poll();
            System.out.println("叫号：" + p.name + "（等级 " + p.level + "）");
        }
    }
}

/* 控制台输出：
=== 医院叫号 ===
叫号：李小明（等级 1）
叫号：赵同学（等级 1）
叫号：张阿姨（等级 2）
叫号：王大爷（等级 3）
叫号：孙老师（等级 4）

解析：两位等级为 1 的病人（李小明、赵同学）最先被叫号，它们相互之间的顺序由入队先后决定
（PriorityQueue 对相同优先级的元素不保证相对顺序）。
自定义 Comparator (a, b) -> a.level - b.level 使得等级数字小的先出队，完美模拟了
「危急程度高的优先就诊」的业务逻辑。
*/`}
    />
  </article>
);

export default index;
