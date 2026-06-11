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
    <Title>数组结构</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>数组（Array）</Text>是最基础、最常用的数据结构，也是顺序存储的典型代表。
        它在物理上占据一段<Text bold>连续的内存空间</Text>，凭借这一特性实现了
        O(1) 的随机访问——这是链表等结构无法比拟的优势。
        本节深入讲解数组的内存模型、随机访问原理、查找/插入/删除的复杂度来源，
        配合完整的 Java 代码示例演示元素搬移过程，最后给出优缺点与适用场景的总结。
      </Paragraph>
    </Callout>

    <Heading3>1. 数组的物理内存模型</Heading3>
    <Paragraph>
      声明一个数组 <InlineCode>int[] arr = new int[5]</InlineCode> 时，JVM 在堆内存中申请一块
      <Text bold>连续的</Text>内存区域，每个 int 元素占 4 字节，5 个元素共 20 字节紧挨着存放。
    </Paragraph>
    <CodeBlock
      language="text"
      title="数组内存布局示意（int[5]，假设首地址为 1000）"
      code={`索引:    [0]     [1]     [2]     [3]     [4]
地址:   1000    1004    1008    1012    1016
内容:  [ 10 ] [ 20 ] [ 30 ] [ 40 ] [ 50 ]
        ↑
    首地址（base address）

地址计算公式：元素[i]的地址 = 首地址 + i × 元素字节数
           arr[3] 的地址 = 1000 + 3 × 4 = 1012  ✓`}
    />
    <Paragraph>
      正是这个<Text bold>地址计算公式</Text>让数组实现了 O(1) 随机访问：
      只需做一次加法和一次乘法，无论数组有多大、索引是多少，CPU 都能在常数时间内直接定位目标元素，
      不需要逐个遍历。
    </Paragraph>
    <Callout type="tip" title="Java 中数组的存储细节">
      Java 的基本类型数组（<InlineCode>int[]</InlineCode>、<InlineCode>double[]</InlineCode> 等）
      在堆中连续存储元素值本身；
      引用类型数组（<InlineCode>String[]</InlineCode>、<InlineCode>Object[]</InlineCode> 等）
      连续存储的是对象的<Text bold>引用（地址）</Text>，对象本身散落在堆的各处。
      无论哪种情况，数组本身的「引用槽」是连续的，随机访问仍然是 O(1)。
    </Callout>

    <Heading3>2. 核心操作的时间复杂度分析</Heading3>

    <Heading4>2.1 随机访问：O(1)</Heading4>
    <Paragraph>
      通过索引访问元素，利用地址公式直接定位，不涉及任何循环。
      无论数组有 10 个还是 10 亿个元素，时间开销恒定，这是数组最大的优势。
    </Paragraph>

    <Heading4>2.2 查找：无序 O(n)，有序 O(log n)</Heading4>
    <Paragraph>
      如果数组<Text bold>未排序</Text>，只能从头到尾逐个比较（线性查找），最坏情况比较 n 次，O(n)。
    </Paragraph>
    <Paragraph>
      如果数组<Text bold>已排序</Text>，可以使用<Text bold>二分查找（Binary Search）</Text>：
      每次比较中间元素，根据大小关系将搜索范围缩小一半，最坏情况约 log₂n 次，O(log n)。
    </Paragraph>

    <Heading4>2.3 插入：O(n)</Heading4>
    <Paragraph>
      在索引 <InlineCode>k</InlineCode> 处插入新元素，必须先将
      <InlineCode>arr[k]</InlineCode> 到 <InlineCode>arr[n-1]</InlineCode> 的所有元素整体向右移动一位，
      才能腾出空位。最坏情况（在头部插入）需要移动 n 个元素，O(n)。
    </Paragraph>

    <Heading4>2.4 删除：O(n)</Heading4>
    <Paragraph>
      删除索引 <InlineCode>k</InlineCode> 处的元素后，必须将
      <InlineCode>arr[k+1]</InlineCode> 到 <InlineCode>arr[n-1]</InlineCode> 的所有元素整体向左移动一位，
      填补空缺（否则数组中间会出现「空洞」，破坏连续性语义）。最坏情况（删头部）需移动 n-1 个元素，O(n)。
    </Paragraph>

    <Heading4>2.5 复杂度汇总表</Heading4>
    <Table
      head={['操作', '时间复杂度', '原因说明']}
      rows={[
        ['随机访问 arr[i]', 'O(1)', '地址公式直接定位，一步到达'],
        ['在末尾追加（未满）', 'O(1)', '直接写入 arr[n]，无需移动'],
        ['在末尾删除', 'O(1)', '直接将 size--，无需移动'],
        ['线性查找（无序）', 'O(n)', '最坏需遍历全部元素'],
        ['二分查找（有序）', 'O(log n)', '每步折半，约 log₂n 次比较'],
        ['在中间/头部插入', 'O(n)', '需将插入点之后的元素全部右移'],
        ['在中间/头部删除', 'O(n)', '需将删除点之后的元素全部左移'],
      ]}
    />

    <Heading3>3. 数组的局限：长度固定</Heading3>
    <Paragraph>
      Java 中数组一旦创建，<Text bold>长度不可改变</Text>。如果需要存更多元素，
      只能新建一个更大的数组，把旧数据全部复制过去，这一操作的时间复杂度是 O(n)。
    </Paragraph>
    <Paragraph>
      <InlineCode>ArrayList</InlineCode> 正是为了解决这个问题而封装的：
      它内部维护一个数组，当数组装满时自动扩容（新建 1.5 倍大小的数组并复制），
      对外暴露动态增删的接口，均摊复杂度仍为 O(1)。
    </Paragraph>
    <Callout type="warning" title="数组越界是最常见的运行时异常">
      访问 <InlineCode>arr[arr.length]</InlineCode> 或负数索引会抛出
      <InlineCode>ArrayIndexOutOfBoundsException</InlineCode>。
      数组有效索引范围是 0 到 <InlineCode>arr.length - 1</InlineCode>，
      任何时候都要检查边界。
    </Callout>

    <Heading3>4. 优缺点与适用场景</Heading3>
    <Table
      head={['维度', '内容']}
      rows={[
        ['优点', 'O(1) 随机访问；内存连续，CPU 缓存命中率高；实现简单'],
        ['缺点', '长度固定，扩容代价大；插入/删除需移动大量元素，O(n)；内存必须连续，大数组可能申请失败'],
        ['适合场景', '元素数量已知且变化不频繁；需要频繁通过下标访问元素；数据需要排序后进行二分查找'],
        ['不适合场景', '频繁在中间插入/删除；数据量动态增长且难以预估上限'],
      ]}
    />

    <Heading3>5. 完整示例：插入与删除元素（演示元素搬移过程）</Heading3>

    <Heading4>示例 1：在指定位置插入元素</Heading4>
    <Paragraph>
      用一个「有效长度」变量 <InlineCode>size</InlineCode> 模拟动态数组，
      演示在索引 2 处插入新元素时，后续元素如何整体右移。
    </Paragraph>
    <CodeBlock
      title="ArrayInsert.java"
      code={`import java.util.Arrays;

public class ArrayInsert {

    /**
     * 在 arr 的 index 位置插入 value。
     * size：当前有效元素个数（arr 的实际长度应比 size 至少大 1，留出空位）
     * 返回新的有效长度。
     */
    public static int insert(int[] arr, int size, int index, int value) {
        // 第一步：从最后一个有效元素开始，依次向右移动一位
        // 注意：必须从右往左移，否则会覆盖还没移走的元素
        for (int i = size - 1; i >= index; i--) {
            arr[i + 1] = arr[i];
        }
        // 第二步：将 value 放到腾出的空位
        arr[index] = value;
        return size + 1;
    }

    public static void main(String[] args) {
        // 申请容量为 8 的数组，初始有效元素 5 个
        int[] arr = new int[8];
        arr[0] = 10; arr[1] = 20; arr[2] = 30; arr[3] = 40; arr[4] = 50;
        int size = 5;

        System.out.println("插入前: " + Arrays.toString(Arrays.copyOf(arr, size)));
        System.out.println("在索引 2 处插入 99 ...");

        // 逐步展示移动过程
        System.out.println("  右移: arr[4]=50 → arr[5]");
        System.out.println("  右移: arr[3]=40 → arr[4]");
        System.out.println("  右移: arr[2]=30 → arr[3]");
        System.out.println("  放入: arr[2] = 99");

        size = insert(arr, size, 2, 99);

        System.out.println("插入后: " + Arrays.toString(Arrays.copyOf(arr, size)));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`插入前: [10, 20, 30, 40, 50]
在索引 2 处插入 99 ...
  右移: arr[4]=50 → arr[5]
  右移: arr[3]=40 → arr[4]
  右移: arr[2]=30 → arr[3]
  放入: arr[2] = 99
插入后: [10, 20, 99, 30, 40, 50]`}
    />
    <Paragraph>
      关键点：右移必须<Text bold>从右向左</Text>进行。
      如果从左向右移，<InlineCode>arr[2]</InlineCode> 的值会先被 <InlineCode>arr[3]</InlineCode> 覆盖，
      接着 <InlineCode>arr[3]</InlineCode> 又被覆盖……最终所有位置都变成 30，数据丢失。
      从右向左则安全：每次移动的都是还未被覆盖的原始值。
    </Paragraph>

    <Heading4>示例 2：删除指定位置的元素</Heading4>
    <Paragraph>
      删除索引 1（值为 20）的元素，后续元素整体左移填补空缺。
    </Paragraph>
    <CodeBlock
      title="ArrayDelete.java"
      code={`import java.util.Arrays;

public class ArrayDelete {

    /**
     * 删除 arr 中索引为 index 的元素。
     * 返回新的有效长度。
     */
    public static int delete(int[] arr, int size, int index) {
        // 从 index+1 开始，每个元素向左移动一位
        // 注意：必须从左往右移，否则会覆盖还没移走的元素
        for (int i = index; i < size - 1; i++) {
            arr[i] = arr[i + 1];
        }
        // 最后一个位置已无用，可以置 0（可选，防止内存泄漏）
        arr[size - 1] = 0;
        return size - 1;
    }

    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        int size = 5;

        System.out.println("删除前: " + Arrays.toString(Arrays.copyOf(arr, size)));
        System.out.println("删除索引 1 处的元素（值=20）...");

        System.out.println("  左移: arr[1]=arr[2]=30");
        System.out.println("  左移: arr[2]=arr[3]=40");
        System.out.println("  左移: arr[3]=arr[4]=50");
        System.out.println("  清零: arr[4]=0");

        size = delete(arr, size, 1);

        System.out.println("删除后: " + Arrays.toString(Arrays.copyOf(arr, size)));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`删除前: [10, 20, 30, 40, 50]
删除索引 1 处的元素（值=20）...
  左移: arr[1]=arr[2]=30
  左移: arr[2]=arr[3]=40
  左移: arr[3]=arr[4]=50
  清零: arr[4]=0
删除后: [10, 30, 40, 50]`}
    />
    <Paragraph>
      删除操作是插入的逆过程，方向是<Text bold>从左向右</Text>覆盖。
      注意最后一位置需要清 0（或清 null），否则对于引用类型数组会造成内存泄漏——
      旧对象的引用还留在数组里，GC 无法回收它。
    </Paragraph>

    <Heading4>示例 3：有序数组的二分查找</Heading4>
    <CodeBlock
      title="BinarySearchDemo.java"
      code={`public class BinarySearchDemo {

    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;  // 防止 (left+right) 溢出
            System.out.println("  搜索范围 [" + left + ", " + right + "]，中间索引 mid=" + mid + "，值=" + arr[mid]);

            if (arr[mid] == target) {
                return mid;           // 找到目标
            } else if (arr[mid] < target) {
                left = mid + 1;       // 目标在右半段
            } else {
                right = mid - 1;      // 目标在左半段
            }
        }
        return -1;  // 未找到
    }

    public static void main(String[] args) {
        int[] sorted = {5, 12, 18, 25, 33, 47, 56, 68, 74, 90};

        System.out.println("有序数组: [5, 12, 18, 25, 33, 47, 56, 68, 74, 90]");
        System.out.println("查找 47:");
        int idx = binarySearch(sorted, 47);
        System.out.println("结果：索引 = " + idx);

        System.out.println();
        System.out.println("查找 100（不存在）:");
        int idx2 = binarySearch(sorted, 100);
        System.out.println("结果：索引 = " + idx2 + "（-1 表示未找到）");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`有序数组: [5, 12, 18, 25, 33, 47, 56, 68, 74, 90]
查找 47:
  搜索范围 [0, 9]，中间索引 mid=4，值=33
  搜索范围 [5, 9]，中间索引 mid=7，值=68
  搜索范围 [5, 6]，中间索引 mid=5，值=47
结果：索引 = 5

查找 100（不存在）:
  搜索范围 [0, 9]，中间索引 mid=4，值=33
  搜索范围 [5, 9]，中间索引 mid=7，值=68
  搜索范围 [8, 9]，中间索引 mid=8，值=74
  搜索范围 [9, 9]，中间索引 mid=9，值=90
  搜索范围 [10, 9]，退出循环
结果：索引 = -1（-1 表示未找到）`}
    />
    <Paragraph>
      查找 47 只比较了 3 次（数组共 10 个元素），远少于线性查找的最坏 10 次。
      二分查找要求数组<Text bold>必须有序</Text>，这也是它的前提条件。
    </Paragraph>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：手写数组元素右移插入"
      code={`// 要求：
// 给定初始数组 {1, 3, 5, 7, 9}，容量为 8（后三位为 0）。
// 在索引 0（最前面）插入值 0，然后打印插入后的有效部分。
// 要求：不使用 Arrays 工具类，手动完成右移逻辑，并打印每一步右移过程。

import java.util.Arrays;

public class ArrayInsertHead {
    public static void main(String[] args) {
        int[] arr = new int[8];
        arr[0]=1; arr[1]=3; arr[2]=5; arr[3]=7; arr[4]=9;
        int size = 5;

        // 在索引 0 处插入值 0
        // 补全：打印右移过程 + 执行插入
    }
}`}
      answerCode={`import java.util.Arrays;

public class ArrayInsertHead {
    public static void main(String[] args) {
        int[] arr = new int[8];
        arr[0]=1; arr[1]=3; arr[2]=5; arr[3]=7; arr[4]=9;
        int size = 5;

        System.out.println("插入前: " + Arrays.toString(Arrays.copyOf(arr, size)));
        System.out.println("在索引 0 处插入值 0，右移过程：");

        // 从右向左移动
        for (int i = size - 1; i >= 0; i--) {
            System.out.println("  arr[" + (i+1) + "] = arr[" + i + "] = " + arr[i]);
            arr[i + 1] = arr[i];
        }
        arr[0] = 0;
        size++;

        System.out.println("插入后: " + Arrays.toString(Arrays.copyOf(arr, size)));
    }
}

/* 控制台输出：
插入前: [1, 3, 5, 7, 9]
在索引 0 处插入值 0，右移过程：
  arr[5] = arr[4] = 9
  arr[4] = arr[3] = 7
  arr[3] = arr[2] = 5
  arr[2] = arr[1] = 3
  arr[1] = arr[0] = 1
插入后: [0, 1, 3, 5, 7, 9]

解析：在头部插入是插入操作的最坏情况，需要移动全部 5 个元素，体现了 O(n) 的代价。
      关键：必须从右向左移，先移最右边的元素，保证不覆盖未搬运的数据。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：删除数组中所有指定值"
      code={`// 要求：
// 给定数组 {3, 1, 4, 1, 5, 9, 2, 6, 1, 3}，删除其中所有值为 1 的元素。
// 打印删除后的有效部分（不能使用 ArrayList 等集合类）。
// 提示：可以用「双指针」思路——用一个指针 write 记录写入位置，
//       read 指针遍历所有元素，遇到非 1 的才写入，最终 write 就是新的 size。

public class RemoveAll {
    public static void main(String[] args) {
        int[] arr = {3, 1, 4, 1, 5, 9, 2, 6, 1, 3};
        int size = arr.length;
        // 补全：删除所有值为 1 的元素
    }
}`}
      answerCode={`import java.util.Arrays;

public class RemoveAll {
    public static void main(String[] args) {
        int[] arr = {3, 1, 4, 1, 5, 9, 2, 6, 1, 3};
        int size = arr.length;

        System.out.println("删除前: " + Arrays.toString(arr));

        // 双指针：write 是写入指针，read 是读取指针
        int write = 0;
        for (int read = 0; read < size; read++) {
            if (arr[read] != 1) {          // 只保留非 1 的元素
                arr[write] = arr[read];
                write++;
            }
        }
        size = write;  // 新的有效长度

        System.out.println("删除所有 1 后: " + Arrays.toString(Arrays.copyOf(arr, size)));
        System.out.println("新长度: " + size);
    }
}

/* 控制台输出：
删除前: [3, 1, 4, 1, 5, 9, 2, 6, 1, 3]
删除所有 1 后: [3, 4, 5, 9, 2, 6, 3]
新长度: 7

解析：双指针是处理「原地删除」问题的经典技巧。
      read 遍历每个元素，遇到不需删除的就写到 write 位置，write 自增；
      遇到需要删除的（值为 1）则 read 继续，write 不动。
      最终 write 的值就是有效元素数量。
      时间复杂度 O(n)，空间复杂度 O(1)。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：判断数组结构的时间复杂度"
      code={`问：分析下列操作对于一个长度为 n 的数组各自的时间复杂度，并说明原因。

(1) 访问 arr[n/2]（取中间元素）
(2) 在已排序数组中用二分查找值为 target 的元素
(3) 在索引 0 处插入一个新元素（假设数组容量足够）
(4) 删除数组中最后一个元素（直接将 size 减 1）
(5) 在未排序数组中查找最小值`}
      answerCode={`(1) O(1)
    数组支持随机访问，arr[n/2] 通过地址公式 首地址 + (n/2) × 元素字节数 直接定位，与 n 无关。

(2) O(log n)
    有序数组二分查找，每次将搜索范围减半，最多比较 log₂n 次。

(3) O(n)
    在索引 0 处插入，需要将全部 n 个元素向右移动一位，是插入操作的最坏情况。

(4) O(1)
    只需 size-- 即可，不需要移动任何元素。这是数组末尾删除的特殊优势。

(5) O(n)
    数组未排序，无法利用二分，只能线性遍历一遍才能确定最小值。`}
    />
  </article>
);

export default index;
