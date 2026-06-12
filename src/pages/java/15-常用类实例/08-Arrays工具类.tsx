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
    <Title>Arrays 工具类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        数组是 Java 中最基础的数据结构，但原生数组本身能做的事情有限——想打印数组内容、
        排序、查找，都得自己写循环，非常繁琐。
        <Text bold>java.util.Arrays</Text> 工具类为我们提供了一整套操作数组的静态方法，
        一行代码搞定常见的数组处理需求。本节重点掌握
        <InlineCode>toString()</InlineCode>、<InlineCode>sort()</InlineCode>，
        并了解 <InlineCode>binarySearch()</InlineCode>、<InlineCode>fill()</InlineCode> 的用法。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是工具类</Heading3>
    <Paragraph>
      工具类是一种<Text bold>只包含静态方法和静态常量</Text>的类，专门提供通用功能，
      不需要创建对象，直接用<Text bold>类名.方法名()</Text>调用即可。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        工具类的构造方法通常是 <InlineCode>private</InlineCode> 的，故意禁止外部创建实例。
      </ListItem>
      <ListItem>
        所有方法都是 <InlineCode>static</InlineCode> 的，调用时无需 <InlineCode>new</InlineCode>。
      </ListItem>
      <ListItem>
        常见工具类：<InlineCode>java.util.Arrays</InlineCode>（数组）、
        <InlineCode>java.lang.Math</InlineCode>（数学）、
        <InlineCode>java.util.Objects</InlineCode>（对象）等。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="工具类直接用类名调用，不用 new">
      <InlineCode>Arrays</InlineCode> 的所有方法都是静态的，正确写法是
      <InlineCode>Arrays.sort(arr)</InlineCode>，而不是
      <InlineCode>new Arrays().sort(arr)</InlineCode>。
      后者会编译报错，因为构造方法是私有的。
    </Callout>

    <Heading3>2. 导包</Heading3>
    <Paragraph>
      <InlineCode>Arrays</InlineCode> 位于 <InlineCode>java.util</InlineCode> 包，
      使用前需要在文件顶部导入：
    </Paragraph>
    <CodeBlock
      language="text"
      title="导包语句"
      code={`import java.util.Arrays;`}
    />
    <Paragraph>
      <InlineCode>java.lang</InlineCode> 包下的类（如 <InlineCode>Math</InlineCode>、
      <InlineCode>String</InlineCode>）会被 JVM 自动导入，无需手动写 import；
      但 <InlineCode>java.util.Arrays</InlineCode> 必须显式导入，否则编译报错。
    </Paragraph>

    <Heading3>3. 常用方法总览</Heading3>
    <Table
      head={['方法签名', '说明', '返回值类型']}
      rows={[
        ['Arrays.toString(arr)', '将数组转成 "[1, 2, 3]" 格式的字符串，用于打印', 'String'],
        ['Arrays.sort(arr)', '对数组升序排序（原地修改，直接改变原数组）', 'void'],
        ['Arrays.sort(arr, from, to)', '对数组 [from, to) 范围内的元素升序排序', 'void'],
        ['Arrays.binarySearch(arr, key)', '在已排序数组中二分查找 key，返回索引；未找到返回负数', 'int'],
        ['Arrays.fill(arr, val)', '将数组所有元素填充为 val', 'void'],
        ['Arrays.fill(arr, from, to, val)', '将 [from, to) 范围内的元素填充为 val', 'void'],
        ['Arrays.copyOf(arr, newLen)', '复制数组，新长度为 newLen（截断或补默认值）', '同类型数组'],
        ['Arrays.equals(arr1, arr2)', '比较两个数组内容是否完全相同', 'boolean'],
      ]}
    />

    <Heading3>4. Arrays.toString() —— 打印数组内容</Heading3>
    <Paragraph>
      直接用 <InlineCode>System.out.println(arr)</InlineCode> 打印数组，
      得到的是数组对象的内存地址（如 <InlineCode>[I@1b6d3586</InlineCode>），
      对调试毫无帮助。<InlineCode>Arrays.toString(arr)</InlineCode> 会把数组元素
      按顺序拼成 <InlineCode>[元素1, 元素2, ...]</InlineCode> 格式的字符串，
      这才是我们想看到的内容。
    </Paragraph>
    <Table
      head={['打印方式', '输出结果', '是否有用']}
      rows={[
        ['System.out.println(arr)', '[I@1b6d3586（内存地址）', '无用'],
        ['System.out.println(Arrays.toString(arr))', '[10, 30, 20, 50]', '有用'],
      ]}
    />
    <CodeBlock
      title="ArraysToStringDemo.java"
      code={`import java.util.Arrays;

public class ArraysToStringDemo {
    public static void main(String[] args) {
        int[] nums = {10, 30, 20, 50, 40};

        // 直接打印数组：得到内存地址，没有意义
        System.out.println(nums);

        // 使用 Arrays.toString()：得到格式化字符串
        System.out.println(Arrays.toString(nums));

        // 字符串数组同样适用
        String[] names = {"Alice", "Bob", "Charlie"};
        System.out.println(Arrays.toString(names));

        // double 数组
        double[] scores = {88.5, 76.0, 93.5};
        System.out.println(Arrays.toString(scores));
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`[I@1b6d3586
[10, 30, 20, 50, 40]
[Alice, Bob, Charlie]
[88.5, 76.0, 93.5]`} />
    <Paragraph>
      第一行是直接打印数组对象时 JVM 输出的内存地址表示（<InlineCode>[I</InlineCode> 表示 int 数组，
      <InlineCode>@</InlineCode> 后面是十六进制地址），每次运行结果可能不同。
      从第二行开始才是 <InlineCode>Arrays.toString()</InlineCode> 输出的真实内容。
    </Paragraph>
    <Callout type="tip" title="toString 不改变原数组">
      <InlineCode>Arrays.toString()</InlineCode> 只是生成一个新的字符串用于展示，
      原数组的内容和顺序完全不受影响。
    </Callout>

    <Heading3>5. Arrays.sort() —— 升序排序</Heading3>
    <Paragraph>
      <InlineCode>Arrays.sort(arr)</InlineCode> 对整个数组进行<Text bold>升序排序</Text>，
      排序结果直接写回原数组（原地修改）。底层对基本类型数组使用双轴快速排序算法，
      平均时间复杂度为 O(n log n)，性能优秀。
    </Paragraph>
    <Callout type="warning" title="sort 会直接修改原数组">
      调用 <InlineCode>Arrays.sort(arr)</InlineCode> 之后，原数组的元素顺序就变了。
      如果需要保留原始顺序，应先用 <InlineCode>Arrays.copyOf()</InlineCode> 复制一份再排序。
    </Callout>
    <CodeBlock
      title="ArraysSortDemo.java"
      code={`import java.util.Arrays;

public class ArraysSortDemo {
    public static void main(String[] args) {
        int[] nums = {5, 2, 8, 1, 9, 3};
        System.out.println("排序前：" + Arrays.toString(nums));

        Arrays.sort(nums);   // 升序排序，直接修改 nums
        System.out.println("排序后：" + Arrays.toString(nums));

        // 只对部分区间排序：sort(arr, fromIndex, toIndex)
        // 对下标 [1, 4) 即下标 1、2、3 的元素排序
        int[] data = {9, 7, 3, 5, 1, 6};
        System.out.println("局部排序前：" + Arrays.toString(data));
        Arrays.sort(data, 1, 4);   // 只排 data[1]、data[2]、data[3]
        System.out.println("局部排序后：" + Arrays.toString(data));
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`排序前：[5, 2, 8, 1, 9, 3]
排序后：[1, 2, 3, 5, 8, 9]
局部排序前：[9, 7, 3, 5, 1, 6]
局部排序后：[9, 3, 5, 7, 1, 6]`} />
    <Paragraph>
      局部排序 <InlineCode>sort(data, 1, 4)</InlineCode> 只对下标 1、2、3 的元素（即 7、3、5）
      进行排序，得到 3、5、7，其余位置（下标 0 的 9、下标 4 的 1、下标 5 的 6）保持不变。
      注意区间是<Text bold>左闭右开</Text>，即包含 fromIndex，不包含 toIndex。
    </Paragraph>

    <Heading3>6. Arrays.binarySearch() —— 二分查找</Heading3>
    <Paragraph>
      <InlineCode>Arrays.binarySearch(arr, key)</InlineCode> 在已排序的数组中
      二分查找目标值 <InlineCode>key</InlineCode>，返回其下标。
    </Paragraph>
    <Callout type="danger" title="必须先排序，再二分查找">
      <InlineCode>binarySearch</InlineCode> 要求数组<Text bold>已经是升序排列</Text>的，
      否则结果不可预期（可能返回错误的下标，或返回负数）。
      通常配合 <InlineCode>Arrays.sort()</InlineCode> 一起使用。
    </Callout>
    <Table
      head={['返回值', '含义']}
      rows={[
        ['&gt;= 0 的整数', '找到了，返回该元素在数组中的下标'],
        ['负数', '未找到，返回值为 -(插入点) - 1，其中插入点是该元素应插入的位置'],
      ]}
    />
    <CodeBlock
      title="BinarySearchDemo.java"
      code={`import java.util.Arrays;

public class BinarySearchDemo {
    public static void main(String[] args) {
        int[] nums = {3, 1, 7, 5, 9, 2};

        Arrays.sort(nums);   // 必须先排序！
        System.out.println("排序后：" + Arrays.toString(nums));
        // 排序后：[1, 2, 3, 5, 7, 9]

        int index1 = Arrays.binarySearch(nums, 5);   // 查找 5
        System.out.println("5 的下标：" + index1);   // 3

        int index2 = Arrays.binarySearch(nums, 4);   // 查找 4（不存在）
        System.out.println("4 的查找结果：" + index2); // 负数
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`排序后：[1, 2, 3, 5, 7, 9]
5 的下标：3
4 的查找结果：-4`} />
    <Paragraph>
      5 在排序后的数组中位于下标 3，所以返回 3。
      4 不在数组中，它应该插入到下标 3（在 3 和 5 之间），
      因此返回 -(3) - 1 = -4。
      实际开发中，判断是否找到只需检查返回值是否 &gt;= 0 即可。
    </Paragraph>

    <Heading3>7. Arrays.fill() —— 填充数组</Heading3>
    <Paragraph>
      <InlineCode>Arrays.fill(arr, val)</InlineCode> 将数组中的<Text bold>所有元素</Text>
      替换为指定值 <InlineCode>val</InlineCode>，常用于数组初始化或重置。
    </Paragraph>
    <CodeBlock
      title="ArraysFillDemo.java"
      code={`import java.util.Arrays;

public class ArraysFillDemo {
    public static void main(String[] args) {
        int[] arr = new int[5];
        System.out.println("默认值：" + Arrays.toString(arr));

        Arrays.fill(arr, 7);   // 全部填充为 7
        System.out.println("fill(7) 后：" + Arrays.toString(arr));

        // 只填充部分区间 [1, 4)，即下标 1、2、3
        Arrays.fill(arr, 1, 4, 99);
        System.out.println("fill(1,4,99) 后：" + Arrays.toString(arr));
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`默认值：[0, 0, 0, 0, 0]
fill(7) 后：[7, 7, 7, 7, 7]
fill(1,4,99) 后：[7, 99, 99, 99, 7]`} />

    <Heading3>8. 综合示例：成绩处理</Heading3>
    <Paragraph>
      结合 <InlineCode>toString()</InlineCode>、<InlineCode>sort()</InlineCode>、
      <InlineCode>binarySearch()</InlineCode> 完成一个小型成绩处理程序：
      打印原始成绩、排序后打印、查找某个分数的排名位置。
    </Paragraph>
    <CodeBlock
      title="ScoreProcessor.java"
      code={`import java.util.Arrays;

public class ScoreProcessor {
    public static void main(String[] args) {
        int[] scores = {78, 92, 65, 88, 73, 95, 81};

        System.out.println("原始成绩：" + Arrays.toString(scores));

        // 复制一份再排序，保留原始顺序
        int[] sorted = Arrays.copyOf(scores, scores.length);
        Arrays.sort(sorted);
        System.out.println("升序排列：" + Arrays.toString(sorted));

        // 查找 88 分在排序后数组中的位置（从 0 开始）
        int pos = Arrays.binarySearch(sorted, 88);
        System.out.println("88 分是第 " + (pos + 1) + " 低分（从低到高排第 " + (pos + 1) + " 名）");

        // 最低分和最高分（排序后直接取首尾）
        System.out.println("最低分：" + sorted[0]);
        System.out.println("最高分：" + sorted[sorted.length - 1]);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`原始成绩：[78, 92, 65, 88, 73, 95, 81]
升序排列：[65, 73, 78, 81, 88, 92, 95]
88 分是第 5 低分（从低到高排第 5 名）
最低分：65
最高分：95`} />
    <Paragraph>
      <InlineCode>Arrays.copyOf(scores, scores.length)</InlineCode> 创建了一个与原数组等长的副本，
      对副本排序不影响原始顺序，原始成绩数组 <InlineCode>scores</InlineCode> 保持不变。
      排序后 88 位于下标 4（从 0 计），所以是从低到高第 5 名。
    </Paragraph>

    <Callout type="success" title="小结">
      <Paragraph>
        Arrays 工具类核心要点：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          使用前必须 <InlineCode>import java.util.Arrays;</InlineCode>，所有方法都是静态的，
          用类名直接调用。
        </ListItem>
        <ListItem>
          <InlineCode>Arrays.toString(arr)</InlineCode>：把数组转成可读字符串，
          是调试数组内容的首选工具。
        </ListItem>
        <ListItem>
          <InlineCode>Arrays.sort(arr)</InlineCode>：原地升序排序，会直接修改原数组；
          需要保留原顺序时先 <InlineCode>copyOf()</InlineCode> 再排序。
        </ListItem>
        <ListItem>
          <InlineCode>Arrays.binarySearch(arr, key)</InlineCode>：必须在已排序数组上使用；
          返回 &gt;= 0 表示找到，返回负数表示未找到。
        </ListItem>
        <ListItem>
          <InlineCode>Arrays.fill(arr, val)</InlineCode>：快速初始化或重置数组所有元素。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>9. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：打印与排序"
      code={`// 要求：
// 1. 定义 int 数组 {64, 25, 12, 22, 11}
// 2. 用 Arrays.toString() 打印排序前的内容
// 3. 调用 Arrays.sort() 排序
// 4. 再次用 Arrays.toString() 打印排序后的内容

import java.util.Arrays;

public class Exercise01 {
    public static void main(String[] args) {
        // 请在这里补全代码
    }
}`}
      answerCode={`import java.util.Arrays;

public class Exercise01 {
    public static void main(String[] args) {
        int[] arr = {64, 25, 12, 22, 11};
        System.out.println("排序前：" + Arrays.toString(arr));
        Arrays.sort(arr);
        System.out.println("排序后：" + Arrays.toString(arr));
    }
}

/* 控制台输出：
排序前：[64, 25, 12, 22, 11]
排序后：[11, 12, 22, 25, 64]

解析：Arrays.sort() 对数组原地升序排序，
      Arrays.toString() 将数组格式化为可读字符串后打印。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：查找元素是否存在"
      code={`// 要求：
// 定义数组 {15, 3, 27, 8, 42, 19, 6}，
// 排序后，分别查找 27 和 100 是否在数组中，
// 打印 "27 存在，下标为 x" 或 "100 不存在"。

import java.util.Arrays;

public class Exercise02 {
    public static void main(String[] args) {
        int[] arr = {15, 3, 27, 8, 42, 19, 6};
        // 请在这里补全代码
    }
}`}
      answerCode={`import java.util.Arrays;

public class Exercise02 {
    public static void main(String[] args) {
        int[] arr = {15, 3, 27, 8, 42, 19, 6};
        Arrays.sort(arr);   // 必须先排序，binarySearch 才有效
        System.out.println("排序后：" + Arrays.toString(arr));

        int idx1 = Arrays.binarySearch(arr, 27);
        if (idx1 >= 0) {
            System.out.println("27 存在，下标为 " + idx1);
        } else {
            System.out.println("27 不存在");
        }

        int idx2 = Arrays.binarySearch(arr, 100);
        if (idx2 >= 0) {
            System.out.println("100 存在，下标为 " + idx2);
        } else {
            System.out.println("100 不存在");
        }
    }
}

/* 控制台输出：
排序后：[3, 6, 8, 15, 19, 27, 42]
27 存在，下标为 5
100 不存在

解析：先 sort 再 binarySearch，27 在排序后下标 5 处；
      100 不在数组中，binarySearch 返回负数，判断 >= 0 失败。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：fill 初始化与局部排序"
      code={`// 要求：
// 1. 创建长度为 6 的 int 数组，用 fill 全部初始化为 -1，打印。
// 2. 手动赋值：arr = {9, 4, 7, 2, 6, 1}，打印。
// 3. 只对下标 2~5（即 [2,6) 范围，含 2 不含 6）排序，打印结果。

import java.util.Arrays;

public class Exercise03 {
    public static void main(String[] args) {
        // 请在这里补全代码
    }
}`}
      answerCode={`import java.util.Arrays;

public class Exercise03 {
    public static void main(String[] args) {
        // 步骤 1：fill 初始化
        int[] arr = new int[6];
        Arrays.fill(arr, -1);
        System.out.println("fill(-1) 后：" + Arrays.toString(arr));

        // 步骤 2：手动赋值
        arr = new int[]{9, 4, 7, 2, 6, 1};
        System.out.println("赋值后：" + Arrays.toString(arr));

        // 步骤 3：只对 [2, 6) 即下标 2、3、4、5 排序
        Arrays.sort(arr, 2, 6);
        System.out.println("局部排序后：" + Arrays.toString(arr));
    }
}

/* 控制台输出：
fill(-1) 后：[-1, -1, -1, -1, -1, -1]
赋值后：[9, 4, 7, 2, 6, 1]
局部排序后：[9, 4, 1, 2, 6, 7]

解析：局部排序只对 arr[2]~arr[5]（即 7,2,6,1）排序，得到 1,2,6,7；
      arr[0]=9 和 arr[1]=4 保持不变。
*/`}
    />
  </article>
);

export default index;
