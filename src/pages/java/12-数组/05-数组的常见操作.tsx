import React from 'react';
import {
  Title,
  Heading3,
  Heading4,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>数组的常见操作</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        有了数组的基础知识，本节学习数组最常用的几类算法：
        <Text bold>遍历求和与平均值</Text>、<Text bold>求最大值与最小值</Text>、
        以及经典的<Text bold>数组反转</Text>（双指针交换法）。
        这些操作是几乎所有数组相关题目的基石，必须熟练掌握。
      </Paragraph>
    </Callout>

    <Heading3>1. 遍历求和与平均值</Heading3>
    <Paragraph>
      遍历求和的思路：声明一个累加变量（初始为 0），用 for 循环将每个元素逐一加到该变量上，
      循环结束后除以元素个数得到平均值。
    </Paragraph>
    <Callout type="warning" title="整数除法会截断小数">
      如果 sum 和 arr.length 都是 int，<InlineCode>sum / arr.length</InlineCode> 是整数除法，
      结果会丢弃小数部分。计算平均值时需要将其中一个转为 double：
      <InlineCode>(double) sum / arr.length</InlineCode>。
    </Callout>
    <CodeBlock
      title="SumAvgDemo.java"
      code={`public class SumAvgDemo {
    public static void main(String[] args) {
        int[] scores = {88, 92, 75, 63, 97, 80, 55, 70};

        // 求和
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
        }

        // 求平均值（转 double 避免整数除法截断）
        double avg = (double) sum / scores.length;

        System.out.println("元素总数：" + scores.length);
        System.out.println("总    和：" + sum);
        System.out.println("平  均  值：" + avg);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`元素总数：8
总    和：620
平  均  值：77.5`} />
    <Paragraph>
      验算：88 + 92 + 75 + 63 + 97 + 80 + 55 + 70 = 620，620 / 8 = 77.5，与输出吻合。
    </Paragraph>

    <Heading3>2. 求最大值与最小值</Heading3>
    <Heading4>2.1 算法思路</Heading4>
    <Paragraph>
      求最大值的经典思路：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        声明变量 <InlineCode>max</InlineCode>，用<Text bold>数组第一个元素</Text>作为初始值（不要用 0 或负无穷，
        因为不知道数组里的数值范围）。
      </ListItem>
      <ListItem>
        从索引 1 开始遍历，如果当前元素大于 <InlineCode>max</InlineCode>，就更新 <InlineCode>max</InlineCode>。
      </ListItem>
      <ListItem>
        循环结束后，<InlineCode>max</InlineCode> 就是整个数组的最大值。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      求最小值同理，只需把比较方向反过来。
    </Paragraph>
    <Callout type="tip" title="初始值一定要用数组第一个元素">
      如果把 max 初始化为 0，当数组全为负数时就会得到错误结果（0 比任何负数都大）。
      用 <InlineCode>arr[0]</InlineCode> 作初始值永远是安全的——无论数组里是什么数，
      最终结果一定在数组中。
    </Callout>
    <Heading4>2.2 代码示例</Heading4>
    <CodeBlock
      title="MaxMinDemo.java"
      code={`public class MaxMinDemo {
    public static void main(String[] args) {
        int[] nums = {34, -7, 89, 12, 56, -3, 100, 45};

        // 求最大值
        int max = nums[0];  // 用第一个元素初始化
        for (int i = 1; i < nums.length; i++) {  // 从索引 1 开始
            if (nums[i] > max) {
                max = nums[i];
            }
        }

        // 求最小值
        int min = nums[0];  // 同样用第一个元素初始化
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < min) {
                min = nums[i];
            }
        }

        System.out.println("数组：");
        for (int i = 0; i < nums.length; i++) {
            System.out.print(nums[i]);
            if (i < nums.length - 1) {
                System.out.print(", ");
            }
        }
        System.out.println();
        System.out.println("最大值：" + max);
        System.out.println("最小值：" + min);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`数组：
34, -7, 89, 12, 56, -3, 100, 45
最大值：100
最小值：-7`} />
    <Paragraph>
      遍历过程：max 从 34 开始，依次与每个元素比较。
      遇到 89 时 89 &gt; 34，max 更新为 89；遇到 100 时 100 &gt; 89，max 更新为 100；
      后续没有更大的元素，最终 max = 100。min 同理，最终为 -7。
    </Paragraph>

    <Heading4>2.3 同时记录最值的索引</Heading4>
    <Paragraph>
      实际需求中不仅要知道最大值是多少，还要知道它在数组哪个位置。
      只需额外记录索引即可：
    </Paragraph>
    <CodeBlock
      title="MaxWithIndex.java"
      code={`public class MaxWithIndex {
    public static void main(String[] args) {
        int[] temps = {22, 30, 28, 35, 25, 33, 29};

        int maxIndex = 0;  // 记录最大值所在的索引
        for (int i = 1; i < temps.length; i++) {
            if (temps[i] > temps[maxIndex]) {
                maxIndex = i;  // 更新最大值的索引
            }
        }

        System.out.println("最高温度：" + temps[maxIndex] + " 度");
        System.out.println("出现在第 " + (maxIndex + 1) + " 天（索引 " + maxIndex + "）");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`最高温度：35 度
出现在第 4 天（索引 3）`} />

    <Heading3>3. 数组反转（双指针交换法）</Heading3>
    <Heading4>3.1 思路分析</Heading4>
    <Paragraph>
      反转数组即把元素的顺序颠倒：<InlineCode>{`[1, 2, 3, 4, 5]`}</InlineCode> → <InlineCode>{`[5, 4, 3, 2, 1]`}</InlineCode>。
    </Paragraph>
    <Paragraph>
      最经典的做法是<Text bold>双指针法</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        设置左指针 <InlineCode>left = 0</InlineCode>（指向最左边），
        右指针 <InlineCode>right = arr.length - 1</InlineCode>（指向最右边）。
      </ListItem>
      <ListItem>
        每次交换 <InlineCode>arr[left]</InlineCode> 和 <InlineCode>arr[right]</InlineCode>，
        然后 left 右移（left++），right 左移（right--）。
      </ListItem>
      <ListItem>
        当 <InlineCode>left &gt;= right</InlineCode> 时停止（两指针相遇或交叉）。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="交换两个变量需要第三个临时变量">
      不能直接写 <InlineCode>arr[left] = arr[right]; arr[right] = arr[left];</InlineCode>——
      第一行执行后 arr[left] 的原始值就丢失了，第二行赋的是已被覆盖的值。
      必须借助临时变量 <InlineCode>int temp</InlineCode> 保存其中一个值。
    </Callout>
    <Heading4>3.2 代码示例</Heading4>
    <CodeBlock
      title="ReverseDemo.java"
      code={`public class ReverseDemo {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};

        System.out.print("反转前：");
        printArray(arr);

        // 双指针反转
        int left  = 0;
        int right = arr.length - 1;
        while (left < right) {
            // 三步交换
            int temp    = arr[left];
            arr[left]   = arr[right];
            arr[right]  = temp;
            // 指针向中间移动
            left++;
            right--;
        }

        System.out.print("反转后：");
        printArray(arr);
    }

    // 辅助方法：打印数组（用逗号分隔，最后换行）
    public static void printArray(int[] arr) {
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) {
                System.out.print(", ");
            }
        }
        System.out.println("]");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`反转前：[1, 2, 3, 4, 5]
反转后：[5, 4, 3, 2, 1]`} />
    <Paragraph>
      逐步执行过程：
    </Paragraph>
    <UnorderedList>
      <ListItem>第 1 次：left=0, right=4，交换 arr[0]=1 和 arr[4]=5 → <InlineCode>{`[5, 2, 3, 4, 1]`}</InlineCode></ListItem>
      <ListItem>第 2 次：left=1, right=3，交换 arr[1]=2 和 arr[3]=4 → <InlineCode>{`[5, 4, 3, 2, 1]`}</InlineCode></ListItem>
      <ListItem>第 3 次：left=2, right=2，left &gt;= right，退出循环。中间元素 3 不需要交换。</ListItem>
    </UnorderedList>
    <Heading4>3.3 偶数长度数组的反转</Heading4>
    <CodeBlock
      title="ReverseEven.java"
      code={`public class ReverseEven {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40};  // 偶数个元素

        int left  = 0;
        int right = arr.length - 1;
        while (left < right) {
            int temp   = arr[left];
            arr[left]  = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }

        // 打印结果
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) System.out.print(", ");
        }
        System.out.println();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`40, 30, 20, 10`} />
    <Paragraph>
      偶数长度（4个元素）：交换 (10,40)、交换 (20,30)，left=2 right=1 时 left &gt;= right 退出，完成。
    </Paragraph>

    <Heading3>4. 综合示例：成绩统计</Heading3>
    <CodeBlock
      title="ScoreStats.java"
      code={`public class ScoreStats {
    public static void main(String[] args) {
        int[] scores = {72, 85, 91, 60, 78, 95, 66, 83};

        // 求和与平均值
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        double avg = (double) sum / scores.length;

        // 求最大值与最小值
        int max = scores[0];
        int min = scores[0];
        for (int i = 1; i < scores.length; i++) {
            if (scores[i] > max) max = scores[i];
            if (scores[i] < min) min = scores[i];
        }

        // 统计及格人数（>= 60）
        int passCount = 0;
        for (int i = 0; i < scores.length; i++) {
            if (scores[i] >= 60) passCount++;
        }

        System.out.println("人数：" + scores.length);
        System.out.println("总分：" + sum);
        System.out.println("平均分：" + avg);
        System.out.println("最高分：" + max);
        System.out.println("最低分：" + min);
        System.out.println("及格人数：" + passCount);
        System.out.println("及格率：" + (double) passCount / scores.length * 100 + "%");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`人数：8
总分：630
平均分：78.75
最高分：95
最低分：60
及格人数：8
及格率：100.0%`} />

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：求数组中所有奇数的平均值"
      code={`// 给定 int 数组 nums = {4, 7, 2, 9, 13, 6, 5, 8}，
// 求其中所有奇数的平均值并打印（保留小数）。

public class Exercise01 {
    public static void main(String[] args) {
        int[] nums = {4, 7, 2, 9, 13, 6, 5, 8};
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise01 {
    public static void main(String[] args) {
        int[] nums = {4, 7, 2, 9, 13, 6, 5, 8};

        int sum   = 0;
        int count = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] % 2 != 0) {  // 奇数
                sum   += nums[i];
                count++;
            }
        }

        if (count > 0) {
            double avg = (double) sum / count;
            System.out.println("奇数个数：" + count);
            System.out.println("奇数平均值：" + avg);
        } else {
            System.out.println("数组中没有奇数");
        }
    }
}

/* 控制台输出：
奇数个数：4
奇数平均值：8.5

解析：奇数是 7、9、13、5，共 4 个，总和 = 34，34 / 4 = 8.5。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：反转字符串数组"
      code={`// 给定 String 数组 words = {"a", "b", "c", "d", "e"}，
// 用双指针法将其反转，然后遍历打印反转后的结果（每个元素打印在同一行，空格分隔）。

public class Exercise02 {
    public static void main(String[] args) {
        String[] words = {"a", "b", "c", "d", "e"};
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {
    public static void main(String[] args) {
        String[] words = {"a", "b", "c", "d", "e"};

        // 双指针反转
        int left  = 0;
        int right = words.length - 1;
        while (left < right) {
            String temp  = words[left];
            words[left]  = words[right];
            words[right] = temp;
            left++;
            right--;
        }

        // 打印反转后的数组
        for (int i = 0; i < words.length; i++) {
            System.out.print(words[i]);
            if (i < words.length - 1) System.out.print(" ");
        }
        System.out.println();
    }
}

/* 控制台输出：
e d c b a
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：找最大值并记录其位置"
      code={`// 给定 double 数组 temps = {23.5, 28.0, 31.2, 29.8, 26.4, 33.1, 27.7}，
// 找出最高温度，以及它出现在数组的第几个位置（从 1 开始计数），格式：
// 最高温度：33.1 度，出现在第 6 天

public class Exercise03 {
    public static void main(String[] args) {
        double[] temps = {23.5, 28.0, 31.2, 29.8, 26.4, 33.1, 27.7};
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {
    public static void main(String[] args) {
        double[] temps = {23.5, 28.0, 31.2, 29.8, 26.4, 33.1, 27.7};

        int maxIndex = 0;
        for (int i = 1; i < temps.length; i++) {
            if (temps[i] > temps[maxIndex]) {
                maxIndex = i;
            }
        }

        System.out.println("最高温度：" + temps[maxIndex] + " 度，出现在第 " + (maxIndex + 1) + " 天");
    }
}

/* 控制台输出：
最高温度：33.1 度，出现在第 6 天

解析：maxIndex 初始化为 0，遍历到索引 5（值 33.1）时更新为 5。
      33.1 是最大值，maxIndex + 1 = 6 表示第 6 天。
*/`}
    />
  </article>
);

export default index;
