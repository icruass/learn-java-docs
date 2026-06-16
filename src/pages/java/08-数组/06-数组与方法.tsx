import React from 'react';
import ChapterExercises from "@/pages/java/练习题/ChapterExercises";
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
    <Title>数组与方法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        数组可以作为方法的<Text bold>参数</Text>传入，也可以作为方法的<Text bold>返回值</Text>传出。
        但有一个关键点和基本类型截然不同：<Text bold>传入的是地址，而不是数组的副本</Text>。
        这意味着方法内部对数组元素的修改，会直接反映到方法外部的原始数组上——
        搞清这个"副作用"，才能真正掌握数组与方法的协作方式。
        本节通过代码和输出一步步印证这些规律。
      </Paragraph>
    </Callout>

    <Heading3>1. 回顾：基本类型参数 vs 引用类型参数</Heading3>
    <Paragraph>
      调用方法时传入参数，Java 永远是<Text bold>值传递</Text>——把实参的值复制给形参。
      但"值"的含义对基本类型和引用类型来说是不同的：
    </Paragraph>
    <Table
      head={['参数类型', '传递的"值"是什么', '方法内修改会影响外部吗']}
      rows={[
        ['基本类型（int、double 等）', '数据本身的值（如整数 5）', '不会，形参和实参是独立的副本'],
        ['引用类型（数组、对象等）', '堆中对象的地址', '会！形参和实参指向同一个堆对象，修改共同可见'],
      ]}
    />
    <Callout type="tip" title="数组传参传的是地址（引用）">
      把数组作为参数传给方法时，方法拿到的是那个数组在堆中的地址。
      方法和调用方看的是<Text bold>同一个数组对象</Text>，对元素的任何修改都是永久的、双方可见的。
      这既是强大的能力，也是需要小心的"副作用"。
    </Callout>

    <Heading3>2. 数组作为方法参数</Heading3>
    <Heading4>2.1 方法内修改数组会影响原数组</Heading4>
    <CodeBlock
      title="ArrayParamDemo.java"
      code={`public class ArrayParamDemo {

    // 方法：把数组每个元素都加 10
    public static void addTen(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            arr[i] += 10;  // 直接修改堆中的元素
        }
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 4, 5};

        System.out.println("调用前 nums[0] = " + nums[0]);  // 1

        addTen(nums);  // 把 nums 的地址传给 arr，两者指向同一个数组

        System.out.println("调用后 nums[0] = " + nums[0]);  // 11
        System.out.println("调用后 nums[4] = " + nums[4]);  // 15
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`调用前 nums[0] = 1
调用后 nums[0] = 11
调用后 nums[4] = 15`} />
    <Paragraph>
      <InlineCode>addTen(nums)</InlineCode> 调用时，把 nums 变量中保存的地址复制给形参 arr。
      arr 和 nums 指向堆中<Text bold>同一个数组</Text>，方法内 <InlineCode>arr[i] += 10</InlineCode>
      修改的是堆里的数据，方法返回后，nums 访问同一块堆空间，可以看到所有改变。
    </Paragraph>

    <Heading4>2.2 封装"遍历打印数组"方法</Heading4>
    <Paragraph>
      把打印数组的逻辑封装成方法，多处调用，避免重复：
    </Paragraph>
    <CodeBlock
      title="PrintArrayMethod.java"
      code={`public class PrintArrayMethod {

    // 打印 int 数组（格式：[10, 20, 30]）
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

    public static void main(String[] args) {
        int[] a = {10, 20, 30};
        int[] b = {1, 3, 5, 7, 9};

        printArray(a);  // 复用同一个方法
        printArray(b);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`[10, 20, 30]
[1, 3, 5, 7, 9]`} />

    <Heading4>2.3 封装"求最大值"方法</Heading4>
    <CodeBlock
      title="MaxMethod.java"
      code={`public class MaxMethod {

    // 返回 int 数组中的最大值
    public static int getMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;  // 返回最大值（基本类型，返回值的副本）
    }

    public static void main(String[] args) {
        int[] scores = {72, 95, 88, 61, 79};
        int[] temps  = {-5, 3, 12, -8, 0};

        System.out.println("最高分：" + getMax(scores));  // 95
        System.out.println("最高温度：" + getMax(temps));  // 12
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`最高分：95
最高温度：12`} />

    <Heading3>3. 数组作为方法返回值</Heading3>
    <Paragraph>
      方法不仅可以接收数组，还可以<Text bold>返回数组</Text>。
      返回的同样是堆中数组对象的<Text bold>地址</Text>，调用方用一个数组变量接收这个地址，
      就可以使用方法创建并填充好的数组。
    </Paragraph>
    <CodeBlock
      language="text"
      title="返回数组的方法格式"
      code={`public static int[] 方法名(参数) {
    int[] result = new int[...];
    // 填充数据
    return result;  // 返回的是堆地址
}`}
    />
    <Heading4>3.1 示例：创建并返回一个新数组</Heading4>
    <CodeBlock
      title="ReturnArrayDemo.java"
      code={`public class ReturnArrayDemo {

    // 创建一个长度为 n 的数组，元素值为 1, 2, 3, ..., n
    public static int[] createRange(int n) {
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = i + 1;
        }
        return arr;  // 返回堆中数组的地址
    }

    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) System.out.print(", ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        int[] r1 = createRange(5);   // 接收方法返回的数组地址
        int[] r2 = createRange(3);

        printArray(r1);  // 1, 2, 3, 4, 5
        printArray(r2);  // 1, 2, 3
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`1, 2, 3, 4, 5
1, 2, 3`} />
    <Paragraph>
      方法内 <InlineCode>new int[n]</InlineCode> 在堆中开辟空间并填充数据，
      <InlineCode>return arr</InlineCode> 把那块空间的地址返回给调用方。
      调用方 <InlineCode>int[] r1 = createRange(5)</InlineCode> 让 r1 保存这个地址，
      后续就可以通过 r1 访问该数组。
    </Paragraph>

    <Heading4>3.2 示例：返回筛选后的新数组</Heading4>
    <CodeBlock
      title="FilterArray.java"
      code={`public class FilterArray {

    // 从原数组中筛选出所有正数，放入新数组返回
    public static int[] getPositives(int[] arr) {
        // 第一遍：统计正数个数，以确定新数组的长度
        int count = 0;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] > 0) count++;
        }

        // 创建大小恰好的新数组
        int[] result = new int[count];

        // 第二遍：把正数填入新数组
        int index = 0;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] > 0) {
                result[index] = arr[i];
                index++;
            }
        }

        return result;
    }

    public static void printArray(int[] arr) {
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) System.out.print(", ");
        }
        System.out.println("]");
    }

    public static void main(String[] args) {
        int[] data     = {3, -5, 0, 8, -1, 7, -3, 4};
        int[] positives = getPositives(data);

        System.out.print("原数组：");
        printArray(data);

        System.out.print("正数：");
        printArray(positives);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`原数组：[3, -5, 0, 8, -1, 7, -3, 4]
正数：[3, 8, 7, 4]`} />
    <Paragraph>
      两遍扫描的思路：第一遍统计正数个数（得到 4），用这个数创建恰好大小的结果数组；
      第二遍把正数依次放入。<InlineCode>data</InlineCode> 原数组未被修改，
      <InlineCode>positives</InlineCode> 是全新的独立数组。
    </Paragraph>

    <Heading3>4. 传地址副作用的完整演示</Heading3>
    <Paragraph>
      下面用一个完整示例，把"传地址会影响原数组"的规律演示得清清楚楚：
    </Paragraph>
    <CodeBlock
      title="RefSideEffect.java"
      code={`public class RefSideEffect {

    // 方法：将数组所有元素反转
    public static void reverse(int[] arr) {
        int left  = 0;
        int right = arr.length - 1;
        while (left < right) {
            int temp   = arr[left];
            arr[left]  = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        // 没有 return，但修改已经发生在堆里
    }

    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) System.out.print(" ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        int[] original = {1, 2, 3, 4, 5};

        System.out.print("reverse 调用前：");
        printArray(original);   // 1 2 3 4 5

        reverse(original);       // 传地址，方法内直接修改堆中数据

        System.out.print("reverse 调用后：");
        printArray(original);   // 5 4 3 2 1
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`reverse 调用前：1 2 3 4 5
reverse 调用后：5 4 3 2 1`} />
    <Callout type="warning" title="方法修改数组是永久性的">
      <InlineCode>reverse(original)</InlineCode> 调用后，original 数组的内容已被永久改变。
      如果需要保留原始数组不被修改，应在方法内部先创建副本，对副本操作后再返回，
      而不是直接修改传入的数组。
    </Callout>

    <Heading3>5. 方法形参接收 null 时的防御</Heading3>
    <Paragraph>
      当方法接收数组参数时，调用方可能传入 <InlineCode>null</InlineCode>。
      健壮的方法应在使用前进行判空检查：
    </Paragraph>
    <CodeBlock
      title="NullCheck.java"
      code={`public class NullCheck {

    public static int getMax(int[] arr) {
        // 防御性判空
        if (arr == null || arr.length == 0) {
            System.out.println("警告：数组为 null 或为空，无法求最大值");
            return Integer.MIN_VALUE;  // 返回 int 最小值作为哨兵
        }
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println(getMax(null));         // 传 null
        System.out.println(getMax(new int[0]));   // 传空数组
        System.out.println(getMax(new int[]{3, 7, 1}));  // 正常
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`警告：数组为 null 或为空，无法求最大值
-2147483648
警告：数组为 null 或为空，无法求最大值
-2147483648
7`} />

    <Heading3>6. 总结对比</Heading3>
    <Table
      head={['用法', '语法要点', '关键注意点']}
      rows={[
        ['数组作参数', 'public static void method(int[] arr)', '传的是地址，方法内修改元素会影响原数组'],
        ['数组作返回值', 'public static int[] method()', '返回的是地址，调用方用数组变量接收'],
        ['不想影响原数组', '方法内先 new 一个新数组复制数据，再操作新数组', '对副本操作，原数组不受影响'],
        ['接收 null 的防御', 'if (arr == null || arr.length == 0)', '传参前或方法内检查，避免 NullPointerException'],
      ]}
    />

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：封装求数组总和方法"
      code={`// 要求：定义方法 sum(int[] arr)，返回数组所有元素之和（int）。
// 在 main 里分别对 {1,2,3,4,5} 和 {10,20,30} 调用并打印结果。

public class Exercise01 {

    public static int sum(int[] arr) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise01 {

    public static int sum(int[] arr) {
        int total = 0;
        for (int i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        return total;
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5};
        int[] b = {10, 20, 30};

        System.out.println(sum(a));  // 15
        System.out.println(sum(b));  // 60
    }
}

/* 控制台输出：
15
60
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：验证方法修改数组的副作用"
      code={`// 要求：定义方法 fillZero(int[] arr)，
// 将数组所有元素都设置为 0（void，无返回值）。
// 在 main 里创建 {5, 10, 15}，打印调用前和调用后的 arr[0]，
// 验证方法确实修改了原数组。

public class Exercise02 {

    public static void fillZero(int[] arr) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {

    public static void fillZero(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            arr[i] = 0;  // 直接修改堆中的元素
        }
    }

    public static void main(String[] args) {
        int[] data = {5, 10, 15};

        System.out.println("调用前 data[0] = " + data[0]);  // 5
        fillZero(data);
        System.out.println("调用后 data[0] = " + data[0]);  // 0
        System.out.println("调用后 data[1] = " + data[1]);  // 0
        System.out.println("调用后 data[2] = " + data[2]);  // 0
    }
}

/* 控制台输出：
调用前 data[0] = 5
调用后 data[0] = 0
调用后 data[1] = 0
调用后 data[2] = 0

解析：fillZero 拿到的是 data 的地址，arr 和 data 指向同一个堆对象。
      方法内把所有元素改为 0，main 里 data 访问同一块内存，因此全变成 0。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：返回原数组的翻倍副本（不修改原数组）"
      code={`// 要求：定义方法 doubled(int[] arr)，
// 返回一个新数组，新数组每个元素是原数组对应元素的 2 倍，
// 原数组不能被修改。
// 在 main 里用 {3, 5, 7} 测试：打印原数组和新数组。

public class Exercise03 {

    public static int[] doubled(int[] arr) {
        // 在这里补全代码
    }

    public static void printArray(int[] arr) {
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) System.out.print(", ");
        }
        System.out.println("]");
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {

    public static int[] doubled(int[] arr) {
        int[] result = new int[arr.length];  // 新建独立数组，不修改原数组
        for (int i = 0; i < arr.length; i++) {
            result[i] = arr[i] * 2;
        }
        return result;  // 返回新数组的地址
    }

    public static void printArray(int[] arr) {
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) System.out.print(", ");
        }
        System.out.println("]");
    }

    public static void main(String[] args) {
        int[] original = {3, 5, 7};
        int[] result   = doubled(original);

        System.out.print("原数组：");
        printArray(original);  // [3, 5, 7]，未被修改

        System.out.print("翻倍后：");
        printArray(result);    // [6, 10, 14]
    }
}

/* 控制台输出：
原数组：[3, 5, 7]
翻倍后：[6, 10, 14]

解析：doubled 方法内部 new 了一个全新数组 result，对 result 赋值而不碰 arr，
      因此 original 保持不变。返回 result 的地址给调用方，main 用 result 接收。
*/`}
    />
    <ChapterExercises categoryKey="arrays" />
  </article>
);

export default index;
