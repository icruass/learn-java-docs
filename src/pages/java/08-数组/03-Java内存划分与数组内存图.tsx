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
    <Title>Java 内存划分与数组内存图</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        很多初学者会问：<InlineCode>int[] arr = new int[3]</InlineCode> 中，
        <InlineCode>arr</InlineCode> 到底存的是什么？为什么两个变量指向同一个数组时，
        改一个另一个也跟着变？
        要真正弄清这些问题，必须理解 Java 的内存结构。
        本节介绍 JVM 内存的五个区域，重点理解<Text bold>栈（Stack）</Text>与<Text bold>堆（Heap）</Text>，
        并通过三种场景的内存图，彻底搞懂数组变量与数组对象的关系。
      </Paragraph>
    </Callout>

    <Heading3>1. JVM 内存五大区域</Heading3>
    <Paragraph>
      JVM 在运行 Java 程序时，将内存划分为以下五个区域：
    </Paragraph>
    <Table
      head={['区域', '中文名', '存放内容', '生命周期']}
      rows={[
        ['Stack（虚拟机栈）', '栈', '方法调用帧、局部变量（包括基本类型变量和引用类型变量）', '方法调用时压栈，方法结束时弹栈，自动释放'],
        ['Heap（堆）', '堆', '用 new 创建的所有对象（包括数组）', '由垃圾回收器（GC）管理，不再被引用时回收'],
        ['Method Area（方法区）', '方法区', '已加载的类信息、常量池、静态变量、方法字节码', '类加载时创建，程序结束时释放'],
        ['Native Method Stack', '本地方法栈', '执行 native（本地）方法时使用', '与虚拟机栈类似'],
        ['PC Register', '程序计数器', '当前线程正在执行的字节码指令地址', '线程私有，随线程生灭'],
      ]}
    />
    <Callout type="tip" title="入门阶段只需重点掌握栈和堆">
      方法区、本地方法栈、程序计数器是 JVM 内部细节，入门阶段了解即可。
      我们日常写的 Java 代码，99% 的内存行为都发生在<Text bold>栈</Text>和<Text bold>堆</Text>两个区域。
    </Callout>

    <Heading3>2. 栈与堆的核心区别</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>栈（Stack）</Text>：存储方法的局部变量。基本类型变量（int、double 等）
        的<Text bold>值</Text>直接存在栈里；引用类型变量（数组、对象）存的是
        <Text bold>地址</Text>（即堆中对象的内存地址）。栈的分配和释放速度极快，由 JVM 自动管理。
      </ListItem>
      <ListItem>
        <Text bold>堆（Heap）</Text>：存储用 <InlineCode>new</InlineCode> 关键字创建的对象，
        数组也属于对象，因此数组的元素数据存在堆里。堆的空间较大，
        由垃圾回收器（GC）负责回收不再使用的对象。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      因此，当我们写 <InlineCode>int[] arr = new int[3]</InlineCode> 时：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>new int[3]</InlineCode> 在<Text bold>堆</Text>中开辟了一块空间，
        存放 3 个 int 元素（默认值 0），同时这块空间有一个内存地址，例如 <InlineCode>0x1234</InlineCode>。
      </ListItem>
      <ListItem>
        变量 <InlineCode>arr</InlineCode> 在<Text bold>栈</Text>中，它存的不是数组的值，
        而是堆中那块空间的<Text bold>地址</Text> <InlineCode>0x1234</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="arr 保存的是地址，通俗叫「引用」">
      在 Java 中，这种保存地址的变量叫做<Text bold>引用（reference）</Text>。
      <InlineCode>arr</InlineCode> 变量本身只有 4 个字节（32 位 JVM）或 8 个字节（64 位 JVM），
      里面存的是一个地址编号，通过这个地址才能找到堆里的实际数组数据。
    </Callout>

    <Heading3>3. 场景一：一个数组的内存图</Heading3>
    <CodeBlock
      title="OneArray.java"
      code={`public class OneArray {
    public static void main(String[] args) {
        int[] arr = new int[3];  // 创建长度为 3 的数组
        arr[0] = 10;
        arr[1] = 20;
        arr[2] = 30;
        System.out.println(arr[0]);  // 10
        System.out.println(arr[1]);  // 20
        System.out.println(arr[2]);  // 30
    }
}`}
    />
    <CodeBlock
      language="text"
      title="内存图（示意）"
      code={`┌─────────────────────────────────────────────────────┐
│  栈（Stack）                                          │
│  ┌──────────────────────┐                            │
│  │ arr  →  0x1234       │  arr 存的是地址，不是数组值  │
│  └──────────────────────┘                            │
└─────────────────────────────────────────────────────┘
                    │ 地址 0x1234
                    ▼
┌─────────────────────────────────────────────────────┐
│  堆（Heap）                                           │
│  ┌──────────────────────────────────┐                │
│  │ 地址：0x1234                      │                │
│  │ [0] = 10                         │                │
│  │ [1] = 20                         │                │
│  │ [2] = 30                         │                │
│  └──────────────────────────────────┘                │
└─────────────────────────────────────────────────────┘`}
    />
    <Paragraph>
      <InlineCode>arr</InlineCode> 存的是地址 <InlineCode>0x1234</InlineCode>，
      通过这个地址找到堆里的数组对象，再用索引偏移就能访问具体元素。
    </Paragraph>
    <CodeBlock language="text" title="控制台输出" code={`10
20
30`} />

    <Heading3>4. 场景二：两个数组各自独立</Heading3>
    <Paragraph>
      两次 <InlineCode>new</InlineCode> 会在堆中创建两块<Text bold>独立</Text>的空间，
      两个变量保存的是<Text bold>不同的地址</Text>，互不影响。
    </Paragraph>
    <CodeBlock
      title="TwoArrays.java"
      code={`public class TwoArrays {
    public static void main(String[] args) {
        int[] arr1 = {10, 20, 30};  // 堆中地址：0xAAAA
        int[] arr2 = {40, 50, 60};  // 堆中地址：0xBBBB，全新的一块空间

        arr1[0] = 999;  // 只修改 arr1 指向的数组

        System.out.println(arr1[0]);  // 999（已修改）
        System.out.println(arr2[0]);  // 40（不受影响）
    }
}`}
    />
    <CodeBlock
      language="text"
      title="内存图（示意）"
      code={`┌─────────────────────────────────────────────────────┐
│  栈（Stack）                                          │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │ arr1 → 0xAAAA    │  │ arr2 → 0xBBBB    │          │
│  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────┘
          │                        │
          ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│  堆：0xAAAA      │      │  堆：0xBBBB      │
│  [0] = 999      │      │  [0] = 40       │
│  [1] = 20       │      │  [1] = 50       │
│  [2] = 30       │      │  [2] = 60       │
└─────────────────┘      └─────────────────┘`}
    />
    <CodeBlock language="text" title="控制台输出" code={`999
40`} />
    <Paragraph>
      修改 <InlineCode>arr1[0]</InlineCode> 不影响 <InlineCode>arr2[0]</InlineCode>，
      因为它们指向堆中<Text bold>不同的对象</Text>。
    </Paragraph>

    <Heading3>5. 场景三：两个引用指向同一个数组</Heading3>
    <Paragraph>
      当把一个数组变量赋值给另一个变量时，<Text bold>复制的是地址</Text>，而不是数组本身。
      两个变量会指向堆中<Text bold>同一块空间</Text>，通过任意一个变量修改元素，
      另一个变量访问时也会看到改变——这是初学者最容易踩的坑之一。
    </Paragraph>
    <CodeBlock
      title="SameRef.java"
      code={`public class SameRef {
    public static void main(String[] args) {
        int[] arr1 = {1, 2, 3};  // arr1 指向堆地址 0xCCCC
        int[] arr2 = arr1;        // arr2 也保存地址 0xCCCC，不是新建数组！

        System.out.println("修改前：");
        System.out.println("arr1[0] = " + arr1[0]);  // 1
        System.out.println("arr2[0] = " + arr2[0]);  // 1

        arr2[0] = 888;  // 通过 arr2 修改索引 0 的值

        System.out.println("arr2[0] 改为 888 后：");
        System.out.println("arr1[0] = " + arr1[0]);  // 888！arr1 也变了
        System.out.println("arr2[0] = " + arr2[0]);  // 888
    }
}`}
    />
    <CodeBlock
      language="text"
      title="内存图（示意）"
      code={`┌─────────────────────────────────────────────────────┐
│  栈（Stack）                                          │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │ arr1 → 0xCCCC    │  │ arr2 → 0xCCCC    │  ← 相同地址！│
│  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────┘
          │                        │
          └──────────┬─────────────┘
                     ▼
           ┌─────────────────┐
           │  堆：0xCCCC      │
           │  [0] = 888      │  ← arr2[0]=888 修改后
           │  [1] = 2        │
           │  [2] = 3        │
           └─────────────────┘`}
    />
    <CodeBlock language="text" title="控制台输出" code={`修改前：
arr1[0] = 1
arr2[0] = 1
arr2[0] 改为 888 后：
arr1[0] = 888
arr2[0] = 888`} />
    <Callout type="danger" title="赋值复制的是地址，不是数组数据">
      <Paragraph>
        <InlineCode>int[] arr2 = arr1</InlineCode> 执行后，<Text bold>并没有</Text>创建新数组，
        只是让 arr2 和 arr1 保存同一个堆地址。此后无论通过哪个变量修改数组内容，
        另一个变量也能看到变化。
      </Paragraph>
      <Paragraph>
        如果希望得到一个独立的副本，不能用简单赋值，需要手动逐元素复制，
        或者使用 <InlineCode>Arrays.copyOf()</InlineCode>（后续章节介绍）。
      </Paragraph>
    </Callout>

    <Heading3>6. 三种场景总结</Heading3>
    <Table
      head={['场景', '内存情况', '关键特征']}
      rows={[
        ['一个变量指向一个数组', '栈中一个引用 → 堆中一个数组对象', '正常情况，引用与对象一一对应'],
        ['两个变量各自 new 出数组', '栈中两个引用 → 堆中两个独立对象', '互不影响，修改其中一个不影响另一个'],
        ['两个变量指向同一个数组', '栈中两个引用 → 堆中同一个对象', '任何一方修改，所有引用都能看到变化'],
      ]}
    />

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：预测输出（两引用同一数组）"
      code={`// 问：下面代码的控制台输出是什么？请先分析内存图，再给出答案。

public class Exercise01 {
    public static void main(String[] args) {
        int[] a = {10, 20, 30};
        int[] b = a;

        b[1] = 99;
        a[2] = 88;

        System.out.println(a[0]);
        System.out.println(a[1]);
        System.out.println(a[2]);
        System.out.println(b[1]);
        System.out.println(b[2]);
    }
}`}
      answerCode={`/* 控制台输出：
10
99
88
99
88

分析：
  int[] b = a  →  b 和 a 保存同一个堆地址，指向同一个数组对象。
  b[1] = 99    →  把索引 1 的值改为 99；a[1] 也随之变为 99（同一块内存）。
  a[2] = 88    →  把索引 2 的值改为 88；b[2] 也随之变为 88（同一块内存）。
  最终数组内容：[10, 99, 88]

  a[0]=10，a[1]=99，a[2]=88，b[1]=99，b[2]=88
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：两个独立数组互不影响"
      code={`// 要求：
// 创建两个 int 数组 x 和 y，均初始化为 {1, 2, 3}（分别用 new 创建，不要互相赋值）。
// 修改 x[0] = 100，然后分别打印 x[0] 和 y[0]，说明两者是否互相影响。

public class Exercise02 {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {
    public static void main(String[] args) {
        int[] x = {1, 2, 3};       // 堆中独立的数组对象
        int[] y = {1, 2, 3};       // 堆中另一个独立的数组对象

        x[0] = 100;

        System.out.println("x[0] = " + x[0]);  // 100
        System.out.println("y[0] = " + y[0]);  // 1，不受影响
    }
}

/* 控制台输出：
x[0] = 100
y[0] = 1

解析：x 和 y 是两次 new 产生的，指向堆中两个不同的对象，修改 x 不影响 y。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：通过方法修改数组（传地址的本质）"
      code={`// 下面代码中，方法 doubleAll 把数组每个元素乘以 2。
// 问：main 里打印 nums[0] 的结果是多少？为什么？

public class Exercise03 {

    public static void doubleAll(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            arr[i] = arr[i] * 2;
        }
    }

    public static void main(String[] args) {
        int[] nums = {5, 10, 15};
        doubleAll(nums);
        System.out.println(nums[0]);  // 输出是多少？
        System.out.println(nums[1]);
        System.out.println(nums[2]);
    }
}`}
      answerCode={`/* 控制台输出：
10
20
30

解析：
  调用 doubleAll(nums) 时，把 nums 变量里保存的地址传给了形参 arr。
  arr 和 nums 指向堆中同一个数组对象。
  方法内 arr[i] = arr[i] * 2 直接修改的是堆里的数据。
  方法结束后，nums 仍然指向那块已被修改的堆空间。
  因此 main 里 nums[0]=10，nums[1]=20，nums[2]=30。

  这正是"数组传参传的是地址"的典型体现，
  方法内对数组元素的修改，在方法外部是可见的。
*/`}
    />
  </article>
);

export default index;
