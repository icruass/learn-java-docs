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
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>数组元素的访问</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        数组创建好之后，如何读取和修改里面的元素？如何知道数组有多少个元素？如何把所有元素挨个处理一遍？
        本节聚焦三件事：<Text bold>用索引读写元素</Text>、<Text bold>用 length 属性获取长度</Text>、
        以及<Text bold>用 for 循环遍历数组</Text>——这三点是后续所有数组操作的基础。
      </Paragraph>
    </Callout>

    <Heading3>1. 索引（下标）</Heading3>
    <Paragraph>
      数组中每个元素都有一个唯一的编号，叫做<Text bold>索引</Text>（也叫下标、index）。
      Java 数组的索引从 <Text bold>0</Text> 开始，最后一个元素的索引是 <Text bold>长度 - 1</Text>。
    </Paragraph>
    <Table
      head={['数组', 'arr[0]', 'arr[1]', 'arr[2]', 'arr[3]', 'arr[4]']}
      rows={[
        ['int[] arr = {10, 20, 30, 40, 50}', '10', '20', '30', '40', '50'],
        ['索引', '0', '1', '2', '3', '4'],
      ]}
    />
    <Callout type="warning" title="索引从 0 开始，不是从 1 开始">
      初学者最容易犯的错误：认为第一个元素的索引是 1。
      Java（以及绝大多数编程语言）数组索引都从 <Text bold>0</Text> 开始。
      长度为 5 的数组，有效索引是 0、1、2、3、4，<Text bold>没有索引 5</Text>。
    </Callout>

    <Heading3>2. 读取与赋值</Heading3>
    <Paragraph>
      访问数组元素的格式是 <InlineCode>数组名[索引]</InlineCode>，既可以读取值，也可以赋值：
    </Paragraph>
    <CodeBlock
      language="text"
      title="读取与赋值格式"
      code={`// 读取：把元素的值取出来使用
数据类型 变量 = 数组名[索引];

// 赋值：把新值存入指定位置
数组名[索引] = 新值;`}
    />
    <CodeBlock
      title="AccessDemo.java"
      code={`public class AccessDemo {
    public static void main(String[] args) {
        int[] arr = {100, 200, 300, 400, 500};

        // 读取元素
        int first = arr[0];   // 读取第一个元素
        int last  = arr[4];   // 读取最后一个元素
        System.out.println("第一个：" + first);  // 100
        System.out.println("最后一个：" + last);  // 500

        // 赋值（修改元素）
        arr[2] = 999;          // 把索引 2 的值从 300 改为 999
        System.out.println("修改后 arr[2]：" + arr[2]);  // 999

        // 也可以在表达式中直接使用数组元素
        System.out.println("arr[0] + arr[1] = " + (arr[0] + arr[1]));  // 300
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`第一个：100
最后一个：500
修改后 arr[2]：999
arr[0] + arr[1] = 300`} />

    <Heading3>3. length 属性</Heading3>
    <Paragraph>
      每个数组对象都有一个内置的 <InlineCode>length</InlineCode> 属性，
      记录该数组中元素的总数量。使用方式是 <InlineCode>数组名.length</InlineCode>。
    </Paragraph>
    <Callout type="danger" title="length 是属性，不是方法，后面没有括号">
      字符串的长度是 <InlineCode>str.length()</InlineCode>（带括号，是方法调用）；
      而数组的长度是 <InlineCode>arr.length</InlineCode>（不带括号，是属性读取）。
      写成 <InlineCode>arr.length()</InlineCode> 会直接编译报错，这是常见易混点。
    </Callout>
    <CodeBlock
      title="LengthDemo.java"
      code={`public class LengthDemo {
    public static void main(String[] args) {
        int[]    nums  = {3, 1, 4, 1, 5, 9, 2, 6};
        String[] words = {"hello", "world"};

        System.out.println("nums 的长度：" + nums.length);   // 8
        System.out.println("words 的长度：" + words.length); // 2

        // 利用 length 访问最后一个元素（通用写法）
        System.out.println("nums 最后一个元素：" + nums[nums.length - 1]);  // 6
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`nums 的长度：8
words 的长度：2
nums 最后一个元素：6`} />
    <Paragraph>
      <InlineCode>nums[nums.length - 1]</InlineCode> 是访问最后一个元素的通用写法，
      无论数组长度多少，这个表达式永远指向最后一个元素，非常实用。
    </Paragraph>

    <Heading3>4. 用 for 循环遍历数组</Heading3>
    <Paragraph>
      实际开发中很少只访问单个元素，更多是需要对<Text bold>所有元素</Text>依次处理——这就是<Text bold>遍历</Text>。
      结合 <InlineCode>arr.length</InlineCode> 和 for 循环是最标准的遍历写法：
    </Paragraph>
    <CodeBlock
      language="text"
      title="标准遍历格式"
      code={`for (int i = 0; i < arr.length; i++) {
    // 用 arr[i] 访问第 i 个元素
}`}
    />
    <Callout type="tip" title="循环条件用 &lt; 而不是 &lt;=">
      有效索引是 0 到 <InlineCode>arr.length - 1</InlineCode>，所以条件写
      <InlineCode>i &lt; arr.length</InlineCode>（严格小于），而不是
      <InlineCode>i &lt;= arr.length</InlineCode>（小于等于）。
      后者在 <InlineCode>i == arr.length</InlineCode> 时访问越界，引发运行时异常。
    </Callout>

    <Heading4>示例 1：打印所有元素</Heading4>
    <CodeBlock
      title="TraverseDemo.java"
      code={`public class TraverseDemo {
    public static void main(String[] args) {
        String[] fruits = {"apple", "banana", "cherry", "durian"};

        // 用 for + length 遍历打印每个元素
        for (int i = 0; i < fruits.length; i++) {
            System.out.println("fruits[" + i + "] = " + fruits[i]);
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`fruits[0] = apple
fruits[1] = banana
fruits[2] = cherry
fruits[3] = durian`} />

    <Heading4>示例 2：求整型数组的总和与平均值</Heading4>
    <CodeBlock
      title="SumAndAvgDemo.java"
      code={`public class SumAndAvgDemo {
    public static void main(String[] args) {
        int[] scores = {88, 92, 75, 63, 97, 80};

        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];  // 累加每个元素
        }

        // 注意：sum 和 scores.length 都是 int，整除会丢失小数
        // 需要将其中一个转为 double，才能得到带小数的平均值
        double avg = (double) sum / scores.length;

        System.out.println("总分：" + sum);                  // 495
        System.out.println("平均分：" + avg);                // 82.5
        System.out.println("元素个数：" + scores.length);    // 6
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`总分：495
平均分：82.5
元素个数：6`} />
    <Paragraph>
      关键细节：<InlineCode>sum / scores.length</InlineCode> 是两个 int 相除，结果直接截断小数，
      得到 82 而非 82.5。加上 <InlineCode>(double)</InlineCode> 强制类型转换后，
      整数提升为浮点数再相除，结果才正确。
    </Paragraph>

    <Heading4>示例 3：统计满足条件的元素个数</Heading4>
    <CodeBlock
      title="CountDemo.java"
      code={`public class CountDemo {
    public static void main(String[] args) {
        int[] nums = {5, 12, 3, 18, 7, 20, 9, 14};

        // 统计大于 10 的元素个数
        int count = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 10) {
                count++;
            }
        }

        System.out.println("大于 10 的元素共 " + count + " 个");  // 4
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`大于 10 的元素共 4 个`} />
    <Paragraph>
      大于 10 的元素是 12、18、20、14，共 4 个，与输出一致。
    </Paragraph>

    <Heading3>5. 综合示例：遍历 + 求和 + 打印</Heading3>
    <CodeBlock
      title="ArraySummary.java"
      code={`public class ArraySummary {
    public static void main(String[] args) {
        double[] prices = {9.9, 25.5, 12.0, 38.8, 6.6};

        System.out.println("所有商品价格：");
        double total = 0;

        for (int i = 0; i < prices.length; i++) {
            System.out.println("  第 " + (i + 1) + " 件：" + prices[i] + " 元");
            total += prices[i];
        }

        System.out.println("共 " + prices.length + " 件商品");
        System.out.println("合计：" + total + " 元");
        System.out.println("均价：" + total / prices.length + " 元");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`所有商品价格：
  第 1 件：9.9 元
  第 2 件：25.5 元
  第 3 件：12.0 元
  第 4 件：38.8 元
  第 5 件：6.6 元
共 5 件商品
合计：92.8 元
均价：18.56 元`} />

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：遍历打印数组并求和"
      code={`// 要求：给定 int 数组 data = {4, 8, 15, 16, 23, 42}，
// 用 for 循环遍历，逐行打印每个元素，
// 循环结束后打印所有元素之和。

public class Exercise01 {
    public static void main(String[] args) {
        int[] data = {4, 8, 15, 16, 23, 42};
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise01 {
    public static void main(String[] args) {
        int[] data = {4, 8, 15, 16, 23, 42};

        int sum = 0;
        for (int i = 0; i < data.length; i++) {
            System.out.println(data[i]);
            sum += data[i];
        }
        System.out.println("总和：" + sum);
    }
}

/* 控制台输出：
4
8
15
16
23
42
总和：108
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：修改数组元素并重新打印"
      code={`// 给定 int 数组 nums = {1, 2, 3, 4, 5}，
// 将每个元素都乘以 2（修改原数组），
// 然后遍历打印修改后的所有元素。

public class Exercise02 {
    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 4, 5};
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {
    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 4, 5};

        // 第一遍：每个元素乘以 2
        for (int i = 0; i < nums.length; i++) {
            nums[i] = nums[i] * 2;
        }

        // 第二遍：打印修改后的元素
        for (int i = 0; i < nums.length; i++) {
            System.out.println(nums[i]);
        }
    }
}

/* 控制台输出：
2
4
6
8
10

解析：每个元素乘以 2：1→2，2→4，3→6，4→8，5→10。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：统计负数个数并求负数之和"
      code={`// 给定 int 数组 vals = {5, -3, 8, -7, 0, -1, 4, -9}，
// 遍历数组，统计其中负数的个数，并求所有负数的总和，
// 最后打印：负数共 X 个，总和为 Y。

public class Exercise03 {
    public static void main(String[] args) {
        int[] vals = {5, -3, 8, -7, 0, -1, 4, -9};
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {
    public static void main(String[] args) {
        int[] vals = {5, -3, 8, -7, 0, -1, 4, -9};

        int count = 0;
        int sum   = 0;
        for (int i = 0; i < vals.length; i++) {
            if (vals[i] < 0) {
                count++;
                sum += vals[i];
            }
        }

        System.out.println("负数共 " + count + " 个，总和为 " + sum);
    }
}

/* 控制台输出：
负数共 4 个，总和为 -20

解析：负数是 -3、-7、-1、-9，共 4 个，总和 = -3 + (-7) + (-1) + (-9) = -20。
*/`}
    />
  </article>
);

export default index;
