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
  OrderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>数组常见问题</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        使用数组时最容易遇到两类运行时异常，程序会突然崩溃并打印一大堆红色错误信息，
        让初学者不知所措。本节深入剖析这两大"拦路虎"：
        <Text bold>ArrayIndexOutOfBoundsException（数组索引越界）</Text>和
        <Text bold>NullPointerException（空指针）</Text>——
        搞清触发原因、学会看异常信息、掌握修正方法，遇到时就能快速定位并修复。
      </Paragraph>
    </Callout>

    <Heading3>1. 异常概述</Heading3>
    <Paragraph>
      Java 中的<Text bold>异常（Exception）</Text>是程序在运行阶段发生的错误。
      异常发生时，JVM 会终止当前方法、打印异常信息（包含异常类型和出错行号），
      帮助开发者定位问题。数组使用中最常见的两个运行时异常是：
    </Paragraph>
    <Table
      head={['异常类型', '触发时机', '英文全称含义']}
      rows={[
        ['ArrayIndexOutOfBoundsException', '访问了不存在的索引（负数或 &gt;= 数组长度）', '数组索引越出边界'],
        ['NullPointerException', '对值为 null 的引用调用了方法或访问了属性/元素', '空指针（对空对象做了操作）'],
      ]}
    />
    <Callout type="tip" title="运行时异常 vs 编译错误">
      这两类异常都是<Text bold>运行时异常</Text>，编译时不会报错，只有运行到那行代码时才会崩溃。
      因此即使代码能编译通过，也不代表它一定正确。
    </Callout>

    <Heading3>2. ArrayIndexOutOfBoundsException（数组索引越界）</Heading3>
    <Heading4>2.1 触发原因</Heading4>
    <Paragraph>
      数组的有效索引范围是 <InlineCode>0</InlineCode> 到 <InlineCode>arr.length - 1</InlineCode>。
      一旦使用超出这个范围的索引（包括等于 <InlineCode>arr.length</InlineCode> 或负数），
      就会抛出 <InlineCode>ArrayIndexOutOfBoundsException</InlineCode>。
    </Paragraph>
    <Heading4>2.2 触发示例与异常信息</Heading4>
    <CodeBlock
      title="OutOfBoundsDemo.java"
      code={`public class OutOfBoundsDemo {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30};  // 长度为 3，有效索引 0、1、2

        System.out.println(arr[0]);   // 正常：10
        System.out.println(arr[2]);   // 正常：30

        // 以下两行均会触发异常
        System.out.println(arr[3]);   // 越界！索引 3 不存在（长度才 3）
        System.out.println(arr[-1]);  // 越界！负数索引不合法
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台异常信息（arr[3] 触发）"
      code={`10
30
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
    at OutOfBoundsDemo.main(OutOfBoundsDemo.java:8)`}
    />
    <Paragraph>
      异常信息的关键部分解读：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <InlineCode>ArrayIndexOutOfBoundsException</InlineCode>：异常类型，明确告诉你是索引越界。
      </ListItem>
      <ListItem>
        <InlineCode>Index 3 out of bounds for length 3</InlineCode>：
        具体说明访问了索引 3，但数组长度只有 3（有效索引最大为 2）。
      </ListItem>
      <ListItem>
        <InlineCode>at OutOfBoundsDemo.main(OutOfBoundsDemo.java:8)</InlineCode>：
        出错位置在 <InlineCode>OutOfBoundsDemo.java</InlineCode> 文件第 8 行。
      </ListItem>
    </OrderedList>
    <Heading4>2.3 常见触发场景</Heading4>
    <Table
      head={['场景', '错误代码示例', '问题所在']}
      rows={[
        ['访问 arr[arr.length]', 'arr[arr.length]', 'length 为 3 时有效索引最大是 2，访问 3 越界'],
        ['循环条件写成 &lt;=', 'for (int i = 0; i &lt;= arr.length; i++)', 'i 等于 arr.length 时访问越界'],
        ['使用负数索引', 'arr[-1]', '负数索引在 Java 中不合法'],
        ['用户输入作为索引未做范围检查', 'arr[userInput]', '用户可能输入超出范围的数字'],
      ]}
    />
    <Heading4>2.4 修正方法</Heading4>
    <Callout type="danger" title="循环条件绝对不能用 i &lt;= arr.length">
      for 循环遍历数组时，条件必须是 <InlineCode>i &lt; arr.length</InlineCode>（严格小于），
      而不是 <InlineCode>i &lt;= arr.length</InlineCode>（小于等于）。
      后者在 i 等于 arr.length 时会访问不存在的索引，直接崩溃。
    </Callout>
    <CodeBlock
      title="FixedLoop.java"
      code={`public class FixedLoop {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30};

        // 错误写法（i <= arr.length 会越界）
        // for (int i = 0; i <= arr.length; i++) {
        //     System.out.println(arr[i]);
        // }

        // 正确写法（i < arr.length 严格小于）
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }

        // 访问最后一个元素：用 arr.length - 1，不要直接写 arr.length
        System.out.println("最后一个：" + arr[arr.length - 1]);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`10
20
30
最后一个：30`} />

    <Heading3>3. NullPointerException（空指针异常）</Heading3>
    <Heading4>3.1 触发原因</Heading4>
    <Paragraph>
      <InlineCode>null</InlineCode> 表示"不指向任何对象"。当一个引用类型变量的值为
      <InlineCode>null</InlineCode>，却对它进行了以下操作时，就会抛出
      <InlineCode>NullPointerException</InlineCode>：
    </Paragraph>
    <OrderedList>
      <ListItem>访问数组元素：<InlineCode>arr[0]</InlineCode></ListItem>
      <ListItem>读取数组长度：<InlineCode>arr.length</InlineCode></ListItem>
      <ListItem>调用对象方法（后续章节会涉及）</ListItem>
    </OrderedList>
    <Heading4>3.2 触发示例与异常信息</Heading4>
    <CodeBlock
      title="NullDemo.java"
      code={`public class NullDemo {
    public static void main(String[] args) {
        int[] arr = null;  // arr 不指向任何数组对象

        // 以下两行均会触发 NullPointerException
        System.out.println(arr.length);  // NPE！null 没有 length 属性
        System.out.println(arr[0]);      // NPE！null 无法通过索引访问元素
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台异常信息（arr.length 触发）"
      code={`Exception in thread "main" java.lang.NullPointerException: Cannot read the array length because "arr" is null
    at NullDemo.main(NullDemo.java:6)`}
    />
    <Paragraph>
      异常信息解读：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <InlineCode>NullPointerException</InlineCode>：异常类型，是空指针问题。
      </ListItem>
      <ListItem>
        <InlineCode>Cannot read the array length because "arr" is null</InlineCode>：
        JVM 直接告诉你，因为 arr 是 null，所以无法读取数组长度。
        （Java 17+ 的 NPE 提示更加详细）
      </ListItem>
      <ListItem>
        <InlineCode>at NullDemo.main(NullDemo.java:6)</InlineCode>：出错在第 6 行。
      </ListItem>
    </OrderedList>
    <Heading4>3.3 另一个常见场景：动态初始化后的 String 数组</Heading4>
    <CodeBlock
      title="NullStringDemo.java"
      code={`public class NullStringDemo {
    public static void main(String[] args) {
        String[] names = new String[3];  // 动态初始化，元素默认为 null

        // 直接调用 null 字符串的方法 → NullPointerException
        // System.out.println(names[0].length());  // NPE！

        // 正确做法：先判断不为 null 再使用
        if (names[0] != null) {
            System.out.println(names[0].length());
        } else {
            System.out.println("names[0] 是 null，还未赋值");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`names[0] 是 null，还未赋值`} />
    <Heading4>3.4 修正方法</Heading4>
    <Callout type="danger" title="使用数组前必须确保它不为 null">
      <Paragraph>
        两个最常见的 null 来源：
      </Paragraph>
      <OrderedList>
        <ListItem>直接声明了数组变量但没有 new（<InlineCode>int[] arr;</InlineCode> 或
          <InlineCode>int[] arr = null;</InlineCode>），就去使用 arr。</ListItem>
        <ListItem>方法返回了 null 而调用方没有判空，直接对返回值操作。</ListItem>
      </OrderedList>
      <Paragraph>
        修正原则：<Text bold>在使用引用类型变量之前，确保它已经指向了一个真实的对象</Text>。
        如果不确定，可以先用 <InlineCode>if (arr != null)</InlineCode> 判断。
      </Paragraph>
    </Callout>
    <CodeBlock
      title="SafeAccess.java"
      code={`public class SafeAccess {
    public static void main(String[] args) {
        int[] arr = null;

        // 方式一：使用前确保 new 了数组
        arr = new int[]{1, 2, 3};
        System.out.println(arr[0]);  // 正常，输出 1

        // 方式二：使用前判空
        int[] maybeNull = null;
        if (maybeNull != null) {
            System.out.println(maybeNull.length);
        } else {
            System.out.println("数组为 null，跳过操作");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`1
数组为 null，跳过操作`} />

    <Heading3>4. 两大异常对比总结</Heading3>
    <Table
      head={['对比项', 'ArrayIndexOutOfBoundsException', 'NullPointerException']}
      rows={[
        ['触发时机', '索引 &lt; 0 或 &gt;= arr.length', '对 null 引用访问元素或属性'],
        ['异常信息关键字', 'Index X out of bounds for length Y', 'is null'],
        ['数组是否存在', '存在，但索引不合法', '数组对象根本不存在（null）'],
        ['典型错误', 'arr[arr.length]、i &lt;= arr.length', 'int[] arr = null; arr[0]'],
        ['修正思路', '检查索引范围，循环用 i &lt; arr.length', '使用前确保已 new，或先判 null'],
      ]}
    />

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己分析，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：找出并修正越界错误"
      code={`// 下面代码有一处会触发 ArrayIndexOutOfBoundsException，
// 请找出错误行，说明原因，并给出修正后的代码。

public class Exercise01 {
    public static void main(String[] args) {
        int[] data = {10, 20, 30, 40, 50};

        for (int i = 0; i <= data.length; i++) {
            System.out.println(data[i]);
        }
    }
}`}
      answerCode={`// 错误原因：
// data.length 为 5，有效索引是 0~4。
// 循环条件 i <= data.length 会让 i 取到 5，
// data[5] 不存在，触发 ArrayIndexOutOfBoundsException。

// 修正后的代码（把 <= 改为 <）：
public class Exercise01 {
    public static void main(String[] args) {
        int[] data = {10, 20, 30, 40, 50};

        for (int i = 0; i < data.length; i++) {  // 严格小于
            System.out.println(data[i]);
        }
    }
}

/* 控制台输出：
10
20
30
40
50
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：预测哪行触发 NullPointerException"
      code={`// 问：下面代码第几行会抛出 NullPointerException？为什么？
// 如何修正？

public class Exercise02 {
    public static void main(String[] args) {
        String[] arr = new String[3];  // 行 3
        System.out.println(arr.length);  // 行 4
        System.out.println(arr[0]);      // 行 5
        System.out.println(arr[0].toUpperCase());  // 行 6
    }
}`}
      answerCode={`// 答：第 6 行触发 NullPointerException。
// 原因：
//   new String[3] 动态初始化，元素默认为 null。
//   第 4 行：arr.length 访问的是数组对象的属性，arr 本身不为 null，正常输出 3。
//   第 5 行：arr[0] 的值是 null，打印 null 不会报错（println 对 null 有特殊处理）。
//   第 6 行：对 null 调用 .toUpperCase() 方法 → NullPointerException。

// 修正方法：赋值后再调用方法，或先判空。
public class Exercise02 {
    public static void main(String[] args) {
        String[] arr = new String[3];
        arr[0] = "hello";  // 先赋值

        System.out.println(arr.length);              // 3
        System.out.println(arr[0]);                  // hello
        System.out.println(arr[0].toUpperCase());    // HELLO
    }
}

/* 控制台输出：
3
hello
HELLO
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：综合——安全访问数组最后一个元素"
      code={`// 要求：写一个方法 getLast(int[] arr)，
// 返回数组最后一个元素的值。
// 需要考虑两种异常情况：
//   1. arr 为 null → 打印"数组为 null"并返回 -1；
//   2. arr 长度为 0 → 打印"数组为空"并返回 -1。
// 在 main 里分别测试三种情况：null 数组、空数组、正常数组 {5,10,15}。

public class Exercise03 {

    public static int getLast(int[] arr) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {

    public static int getLast(int[] arr) {
        if (arr == null) {
            System.out.println("数组为 null");
            return -1;
        }
        if (arr.length == 0) {
            System.out.println("数组为空");
            return -1;
        }
        return arr[arr.length - 1];  // 安全访问最后一个元素
    }

    public static void main(String[] args) {
        System.out.println(getLast(null));             // 数组为 null，返回 -1
        System.out.println(getLast(new int[0]));       // 数组为空，返回 -1
        System.out.println(getLast(new int[]{5, 10, 15})); // 正常，返回 15
    }
}

/* 控制台输出：
数组为 null
-1
数组为空
-1
15

解析：
  getLast(null)       → 触发第一个判断，打印"数组为 null"，return -1。
  getLast(new int[0]) → null 检查通过，但 arr.length == 0，打印"数组为空"，return -1。
  getLast({5,10,15})  → 两项检查均通过，arr.length - 1 = 2，返回 arr[2] = 15。
*/`}
    />
  </article>
);

export default index;
