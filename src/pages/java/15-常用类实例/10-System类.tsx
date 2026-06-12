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
    <Title>System 类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>java.lang.System</InlineCode> 是一个与「系统」打交道的工具类——你早就在用它的
        <InlineCode>System.out.println</InlineCode> 了。本节系统介绍它最常用的几个静态成员与方法：
        标准流 <InlineCode>out/err/in</InlineCode>、获取时间的
        <InlineCode>currentTimeMillis</InlineCode> 与 <InlineCode>nanoTime</InlineCode>、
        数组拷贝 <InlineCode>arraycopy</InlineCode>、退出程序 <InlineCode>exit</InlineCode>、
        以及读取系统属性与环境变量。
      </Paragraph>
    </Callout>

    <Heading3>1. System 是什么</Heading3>
    <Paragraph>
      <InlineCode>System</InlineCode> 是 <InlineCode>final</InlineCode> 类，<Text bold>不能创建对象</Text>
      （构造方法私有），所有成员都是 <InlineCode>static</InlineCode>，直接用类名访问。它的常用成员：
    </Paragraph>
    <Table
      head={['成员 / 方法', '作用']}
      rows={[
        ['System.out', '标准输出流（PrintStream），打印到控制台'],
        ['System.err', '标准错误流，输出错误信息（通常显示为红色）'],
        ['System.in', '标准输入流（InputStream），Scanner 底层用的就是它'],
        ['currentTimeMillis()', '返回从 1970-01-01 至今的毫秒数'],
        ['nanoTime()', '返回纳秒级时间戳，用于精确测量耗时'],
        ['arraycopy(...)', '高效复制数组'],
        ['exit(int status)', '终止 JVM，status 为 0 表示正常退出'],
        ['getProperty(key)', '获取系统属性（如 java 版本、操作系统）'],
        ['getenv(name)', '获取操作系统环境变量'],
        ['gc()', '建议 JVM 进行垃圾回收（只是建议）'],
      ]}
    />

    <Heading3>2. 标准流：out / err / in</Heading3>
    <CodeBlock
      title="StdStream.java"
      code={`public class StdStream {
    public static void main(String[] args) {
        System.out.println("这是普通输出");   // 标准输出
        System.err.println("这是错误输出");   // 标准错误（IDE 中常显示为红色）

        // System.in 是输入流，Scanner 正是包装了它
        // Scanner sc = new Scanner(System.in);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`这是普通输出
这是错误输出`}
    />

    <Heading3>3. 计时：currentTimeMillis 与 nanoTime</Heading3>
    <Paragraph>
      测量一段代码耗时是最常见的用途。<InlineCode>currentTimeMillis</InlineCode> 返回毫秒，
      <InlineCode>nanoTime</InlineCode> 返回纳秒（更精确，但只能用于「计算时间差」，不代表真实时钟）。
    </Paragraph>
    <CodeBlock
      title="TimeDemo.java"
      code={`public class TimeDemo {
    public static void main(String[] args) {
        long start = System.currentTimeMillis();

        // 模拟一段耗时操作
        long sum = 0;
        for (int i = 0; i < 100_000_000L; i++) {
            sum += i;
        }

        long end = System.currentTimeMillis();
        System.out.println("累加结果: " + sum);
        System.out.println("耗时: " + (end - start) + " 毫秒");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（耗时随机器不同）"
      code={`累加结果: 4999999950000000
耗时: 45 毫秒`}
    />
    <Callout type="tip" title="毫秒数也是「时间戳」的来源">
      <InlineCode>currentTimeMillis()</InlineCode> 返回的就是「Unix 时间戳（毫秒）」，
      它是 <InlineCode>new Date()</InlineCode>、日志时间等的底层来源。1970-01-01 00:00:00 GMT 称为「纪元（epoch）」。
    </Callout>

    <Heading3>4. arraycopy：高效数组复制</Heading3>
    <Paragraph>
      <InlineCode>System.arraycopy</InlineCode> 是底层 native 方法，复制数组比手写循环更快。
      其签名为：
    </Paragraph>
    <CodeBlock
      language="text"
      title="方法签名"
      code={`System.arraycopy(
    Object src,      // 源数组
    int srcPos,      // 从源数组的哪个下标开始拷
    Object dest,     // 目标数组
    int destPos,     // 放到目标数组的哪个下标起
    int length       // 拷贝几个元素
);`}
    />
    <CodeBlock
      title="ArrayCopyDemo.java"
      code={`import java.util.Arrays;

public class ArrayCopyDemo {
    public static void main(String[] args) {
        int[] src = {1, 2, 3, 4, 5};
        int[] dest = new int[5];

        // 把 src 下标 1 起的 3 个元素，拷到 dest 下标 0 起
        System.arraycopy(src, 1, dest, 0, 3);

        System.out.println("源数组:   " + Arrays.toString(src));
        System.out.println("目标数组: " + Arrays.toString(dest));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`源数组:   [1, 2, 3, 4, 5]
目标数组: [2, 3, 4, 0, 0]`}
    />
    <Callout type="note" title="ArrayList 扩容底层就用它">
      <InlineCode>ArrayList</InlineCode> 扩容、删除中间元素时的「数组搬移」，底层调用的正是
      <InlineCode>System.arraycopy</InlineCode>，因为它比 Java 循环快得多。
    </Callout>

    <Heading3>5. exit：终止程序</Heading3>
    <CodeBlock
      title="ExitDemo.java"
      code={`public class ExitDemo {
    public static void main(String[] args) {
        System.out.println("程序开始");
        System.exit(0);                  // 立即终止 JVM，0 表示正常
        System.out.println("这行永远不会执行");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`程序开始`} />
    <Callout type="warning" title="exit 会直接结束整个 JVM">
      <InlineCode>System.exit(0)</InlineCode> 表示正常退出，非 0（如 <InlineCode>exit(1)</InlineCode>）表示异常退出。
      它会立刻终止程序，<Text bold>后面的代码、未执行的 finally 都不再运行</Text>，使用需谨慎。
    </Callout>

    <Heading3>6. 系统属性与环境变量</Heading3>
    <CodeBlock
      title="SysInfo.java"
      code={`public class SysInfo {
    public static void main(String[] args) {
        // 系统属性：JVM 层面的配置
        System.out.println("Java 版本: " + System.getProperty("java.version"));
        System.out.println("操作系统: " + System.getProperty("os.name"));
        System.out.println("用户目录: " + System.getProperty("user.home"));

        // 环境变量：操作系统层面的配置（示例，结果因机器而异）
        System.out.println("PATH 是否存在: " + (System.getenv("PATH") != null));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（因环境不同而异）"
      code={`Java 版本: 17.0.8
操作系统: Windows 11
用户目录: C:\\Users\\you
PATH 是否存在: true`}
    />
    <Callout type="tip" title="getProperty vs getenv">
      <InlineCode>getProperty</InlineCode> 取的是<Text bold>JVM 系统属性</Text>（java 版本、os 名称等，可用 -D 参数设置）；
      <InlineCode>getenv</InlineCode> 取的是<Text bold>操作系统环境变量</Text>（如 PATH、JAVA_HOME）。
    </Callout>

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>System</InlineCode> 是不可实例化的工具类，成员全为静态。</ListItem>
        <ListItem><InlineCode>out/err/in</InlineCode> 是三大标准流；Scanner 底层用的是 <InlineCode>System.in</InlineCode>。</ListItem>
        <ListItem><InlineCode>currentTimeMillis</InlineCode>（毫秒）/<InlineCode>nanoTime</InlineCode>（纳秒）用于计时，前者也是时间戳来源。</ListItem>
        <ListItem><InlineCode>arraycopy</InlineCode> 是高效数组复制，ArrayList 扩容靠它。</ListItem>
        <ListItem><InlineCode>exit</InlineCode> 终止 JVM（0 正常）；<InlineCode>getProperty/getenv</InlineCode> 读系统属性/环境变量。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：概念判断"
      code={`① 可以用 new System() 创建 System 对象吗？
② System.currentTimeMillis() 返回的是从什么时间开始计算的？
③ 测量代码耗时，用 currentTimeMillis 还是 nanoTime 更精确？
④ System.exit(0) 之后的 finally 块会执行吗？`}
      answerCode={`答案：
① 不能。System 的构造方法是私有的，且类被设计为工具类，只能通过类名访问静态成员。
② 从 1970-01-01 00:00:00 GMT（Unix 纪元 epoch）到现在的毫秒数。
③ nanoTime 更精确（纳秒级），适合测量「时间差」；但它不代表真实时钟，不能用来表示日期。
④ 不会。System.exit 会立即终止 JVM，finally 也不再执行（这是 finally「几乎总会执行」的少数例外之一）。`}
    />

    <CodeBlock
      qa
      title="练习2：测量两种拼接的耗时差距"
      code={`// 用 System.currentTimeMillis 测量「+ 拼接」与「StringBuilder」拼接 5 万次的耗时，
// 打印各自毫秒数，直观感受性能差距。

public class ConcatTiming {
    public static void main(String[] args) {
        int n = 50000;
        // 补全
    }
}`}
      answerCode={`public class ConcatTiming {
    public static void main(String[] args) {
        int n = 50000;

        long t1 = System.currentTimeMillis();
        String s = "";
        for (int i = 0; i < n; i++) {
            s = s + "x";
        }
        long t2 = System.currentTimeMillis();

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append("x");
        }
        sb.toString();
        long t3 = System.currentTimeMillis();

        System.out.println("+ 拼接耗时:        " + (t2 - t1) + " ms");
        System.out.println("StringBuilder耗时: " + (t3 - t2) + " ms");
    }
}

/* 控制台输出（量级差异是关键，具体数值随机器不同）：
+ 拼接耗时:        1100 ms
StringBuilder耗时: 1 ms

解析：典型的「前后各取一次 currentTimeMillis，相减得耗时」套路。
      结果印证了字符串章节的结论：循环拼接必须用 StringBuilder。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：用 arraycopy 实现数组的中间插入"
      code={`// 在数组 {1,2,4,5} 的下标 2 处插入 3，得到 {1,2,3,4,5}。
// 提示：先把下标 2 及之后的元素整体后移一位，再赋值。
// 用 System.arraycopy 实现后移。

import java.util.Arrays;

public class InsertDemo {
    public static void main(String[] args) {
        int[] arr = {1, 2, 4, 5, 0};   // 末尾预留一个空位
        int insertIndex = 2;
        int value = 3;
        // 补全
        System.out.println(Arrays.toString(arr));
    }
}`}
      answerCode={`import java.util.Arrays;

public class InsertDemo {
    public static void main(String[] args) {
        int[] arr = {1, 2, 4, 5, 0};   // 末尾预留一个空位
        int insertIndex = 2;
        int value = 3;

        // 把 [insertIndex, 末尾-1) 的元素整体后移一位
        // src=arr, srcPos=2, dest=arr, destPos=3, length=2 （把 4,5 移到后面）
        System.arraycopy(arr, insertIndex, arr, insertIndex + 1,
                arr.length - insertIndex - 1);

        // 在空出的位置放入新值
        arr[insertIndex] = value;

        System.out.println(Arrays.toString(arr));
    }
}

/* 控制台输出：
[1, 2, 3, 4, 5]

解析：数组中间插入的本质是「后续元素整体后移、腾出位置」。
      System.arraycopy 一行完成搬移，这正是 ArrayList.add(index, e) 的底层原理。
*/`}
    />
  </article>
);

export default index;
