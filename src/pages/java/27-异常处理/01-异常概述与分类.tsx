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
    <Title>异常概述与分类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        程序在运行时难免遇到各种意外情况——用户输入了非法数据、文件不存在、网络中断……
        这些都会导致程序无法继续正常执行。Java 提供了一套完整的<Text bold>异常处理机制</Text>，
        让我们能够优雅地应对这些意外，而不是让程序直接崩溃。
        本节先理解什么是异常，再梳理 Java 异常体系的层级结构，
        最后重点区分<Text bold>受检异常</Text>和<Text bold>非受检异常</Text>这一核心概念。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是异常</Heading3>
    <Paragraph>
      <Text bold>异常（Exception）</Text>是程序在运行过程中出现的<Text bold>非正常情况</Text>，
      它会阻止程序按照正常的逻辑继续执行。注意：异常不是语法错误（语法错误在编译期就被发现），
      而是在程序<Text bold>运行期间</Text>才暴露的问题。
    </Paragraph>
    <Paragraph>
      常见的异常触发场景包括：
    </Paragraph>
    <UnorderedList>
      <ListItem>访问了 <InlineCode>null</InlineCode> 对象的属性或方法（<InlineCode>NullPointerException</InlineCode>）</ListItem>
      <ListItem>数组下标超出范围（<InlineCode>ArrayIndexOutOfBoundsException</InlineCode>）</ListItem>
      <ListItem>整数除以零（<InlineCode>ArithmeticException</InlineCode>）</ListItem>
      <ListItem>将字符串转为数字时格式不正确（<InlineCode>NumberFormatException</InlineCode>）</ListItem>
      <ListItem>读取的文件不存在（<InlineCode>FileNotFoundException</InlineCode>）</ListItem>
    </UnorderedList>

    <Heading4>1.1 没有异常处理时的问题</Heading4>
    <Paragraph>
      如果代码中出现异常，且没有任何处理机制，JVM 会打印一段<Text bold>堆栈跟踪信息（stack trace）</Text>
      并立即终止程序，后续代码全部不执行。下面是一个经典例子：
    </Paragraph>
    <CodeBlock
      title="NoHandling.java"
      code={`public class NoHandling {
    public static void main(String[] args) {
        System.out.println("程序开始");

        int[] arr = new int[3];
        arr[5] = 100;  // 下标越界！

        System.out.println("这行永远不会被执行");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（程序崩溃）"
      code={`程序开始
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3
	at NoHandling.main(NoHandling.java:6)`}
    />
    <Paragraph>
      可以看到：第一行 "程序开始" 正常输出，但第 6 行异常发生后，程序立即崩溃，
      最后一行 "这行永远不会被执行" 果然没有输出。JVM 打印的错误信息包含：
    </Paragraph>
    <UnorderedList>
      <ListItem><Text bold>异常类型</Text>：<InlineCode>java.lang.ArrayIndexOutOfBoundsException</InlineCode></ListItem>
      <ListItem><Text bold>错误描述</Text>：Index 5 out of bounds for length 3</ListItem>
      <ListItem><Text bold>调用栈</Text>：at NoHandling.main(NoHandling.java:6)，精确到文件名和行号</ListItem>
    </UnorderedList>
    <Callout type="tip" title="学会读 stack trace">
      看到红色的异常信息不要慌。从上往下读：第一行是异常类型和描述，
      后面 <InlineCode>at</InlineCode> 开头的每一行是调用链路。
      <Text bold>最靠上的 at 行</Text>往往就是异常真正发生的位置，从那里开始排查。
    </Callout>

    <Heading3>2. Java 异常体系结构</Heading3>
    <Paragraph>
      Java 中所有的异常和错误都继承自 <InlineCode>java.lang.Throwable</InlineCode>，
      这是整个异常体系的根类。<InlineCode>Throwable</InlineCode> 下分两大分支：
      <InlineCode>Error</InlineCode> 和 <InlineCode>Exception</InlineCode>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="Java 异常体系继承关系（ASCII 图）"
      code={`java.lang.Throwable（异常体系根类）
├── java.lang.Error（JVM 级别严重错误，通常不可恢复）
│   ├── StackOverflowError    （栈内存溢出，常见于无限递归）
│   ├── OutOfMemoryError      （堆内存溢出，OOM）
│   ├── VirtualMachineError   （JVM 内部错误）
│   └── ...
│
└── java.lang.Exception（程序级别异常，可以被捕获处理）
    ├── RuntimeException（运行时异常 / 非受检异常，编译器不强制处理）
    │   ├── NullPointerException          （空指针）
    │   ├── ArrayIndexOutOfBoundsException（数组越界）
    │   ├── ClassCastException            （类型转换失败）
    │   ├── NumberFormatException         （数字格式错误）
    │   ├── ArithmeticException           （算术异常，如除以零）
    │   ├── IllegalArgumentException      （非法参数）
    │   ├── IllegalStateException         （非法状态）
    │   └── ...
    │
    ├── IOException（输入输出异常，受检异常）
    │   ├── FileNotFoundException         （文件不存在）
    │   └── ...
    ├── SQLException（数据库异常，受检异常）
    ├── ClassNotFoundException（类未找到，受检异常）
    ├── InterruptedException（线程中断，受检异常）
    └── ...`}
    />

    <Heading3>3. Error 与 Exception 的区别</Heading3>
    <Paragraph>
      <InlineCode>Error</InlineCode> 和 <InlineCode>Exception</InlineCode> 虽然都继承自
      <InlineCode>Throwable</InlineCode>，但它们代表完全不同性质的问题：
    </Paragraph>
    <Table
      head={['对比维度', 'Error', 'Exception']}
      rows={[
        ['严重程度', 'JVM 级别严重错误', '程序级别可处理的异常'],
        ['可恢复性', '通常不可恢复', '可以被捕获并恢复程序正常运行'],
        ['产生原因', 'JVM 内部问题、系统资源耗尽', '代码逻辑问题、外部环境问题'],
        ['是否处理', '一般不做处理（无能为力）', '应当捕获处理或向上传递'],
        ['常见例子', 'StackOverflowError、OutOfMemoryError', 'IOException、NullPointerException'],
      ]}
    />
    <CodeBlock
      title="ErrorDemo.java（演示 StackOverflowError）"
      code={`public class ErrorDemo {
    // 无限递归 → 栈溢出
    public static void recurse() {
        recurse();  // 不停调用自己，栈帧一直压栈
    }

    public static void main(String[] args) {
        recurse();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`Exception in thread "main" java.lang.StackOverflowError
	at ErrorDemo.recurse(ErrorDemo.java:3)
	at ErrorDemo.recurse(ErrorDemo.java:3)
	... (repeated thousands of times)`}
    />
    <Callout type="tip" title="99% 的异常处理针对 Exception 体系">
      <InlineCode>Error</InlineCode> 发生时程序已经处于严重错误状态，
      即使 <InlineCode>catch(Error e)</InlineCode> 捕获了也几乎无法做有意义的恢复。
      日常开发中我们几乎只处理 <InlineCode>Exception</InlineCode> 及其子类。
      <InlineCode>OutOfMemoryError</InlineCode> 通常意味着需要调整 JVM 内存参数或优化代码，
      而不是在代码里 catch 它。
    </Callout>

    <Heading3>4. 受检异常 vs 非受检异常（核心概念）</Heading3>
    <Paragraph>
      <InlineCode>Exception</InlineCode> 体系下进一步分为两类，这是 Java 异常处理中<Text bold>最重要的区分</Text>：
    </Paragraph>
    <Table
      head={['对比维度', '受检异常（Checked Exception）', '非受检异常（Unchecked Exception）']}
      rows={[
        ['定义', '继承 Exception 但不继承 RuntimeException 的异常', '继承 RuntimeException 的异常'],
        ['编译器要求', '必须显式处理（try-catch 或 throws），否则编译报错', '编译器不强制处理，处理与否由开发者决定'],
        ['触发原因', '通常由外部因素引起（文件、网络、数据库等）', '通常是代码逻辑错误（空指针、越界、类型错误）'],
        ['可预见性', '可以预见并提前准备处理方案', '理论上应通过规范代码避免发生'],
        ['典型例子', 'IOException、SQLException、ClassNotFoundException、InterruptedException', 'NullPointerException、ArrayIndexOutOfBoundsException、ClassCastException、NumberFormatException、ArithmeticException'],
      ]}
    />
    <Paragraph>
      受检异常的核心思想是：Java 编译器认为这类情况是<Text bold>合理可预期的</Text>，
      开发者必须在代码中明确说明"我知道这里可能出问题，我的处理方案是……"。
      而非受检异常则被认为是开发者<Text bold>应当通过良好编码习惯避免</Text>的错误。
    </Paragraph>
    <CodeBlock
      title="CheckedVsUnchecked.java"
      code={`import java.io.FileReader;
import java.io.IOException;

public class CheckedVsUnchecked {

    // 受检异常示例：不处理 IOException，编译直接报错
    public static void readFile() throws IOException {
        FileReader reader = new FileReader("test.txt");  // 可能抛出 FileNotFoundException
        reader.close();
    }

    // 非受检异常示例：编译器不强制处理，但运行时可能崩溃
    public static void accessNull() {
        String s = null;
        System.out.println(s.length());  // NullPointerException，但编译通过
    }

    public static void main(String[] args) {
        // 调用受检异常方法，必须处理
        try {
            readFile();
        } catch (IOException e) {
            System.out.println("文件读取失败：" + e.getMessage());
        }

        // 调用非受检异常方法，编译器不强制处理（但此处会崩溃）
        accessNull();
    }
}`}
    />

    <Heading3>5. 常见异常详解</Heading3>
    <Paragraph>
      下表列出了开发中最常遇到的异常，了解其触发场景有助于快速定位 bug：
    </Paragraph>
    <Table
      head={['异常类名', '中文描述', '触发场景', '示例触发代码']}
      rows={[
        ['NullPointerException', '空指针异常', '对 null 对象调用方法或访问属性', 'String s = null; s.length();'],
        ['ArrayIndexOutOfBoundsException', '数组下标越界', '访问数组时下标 < 0 或 >= length', 'int[] a = new int[3]; a[3] = 1;'],
        ['ClassCastException', '类型转换异常', '强制类型转换时类型不兼容', 'Object o = "hi"; Integer i = (Integer) o;'],
        ['NumberFormatException', '数字格式异常', '字符串无法解析为数字', 'Integer.parseInt("abc");'],
        ['ArithmeticException', '算术异常', '整数除以零', 'int r = 10 / 0;'],
        ['StringIndexOutOfBoundsException', '字符串下标越界', '访问字符串不存在的字符位置', '"hi".charAt(5);'],
        ['IllegalArgumentException', '非法参数异常', '方法接收到不合法的参数', 'new ArrayList(-1);'],
        ['StackOverflowError', '栈溢出错误', '无限递归导致调用栈耗尽', '方法无终止条件地调用自身'],
        ['OutOfMemoryError', '内存溢出错误', '堆内存不足，无法分配对象', '创建超大数组或无限往集合中添加对象'],
      ]}
    />

    <Heading4>5.1 NullPointerException（NPE）详解</Heading4>
    <Paragraph>
      <InlineCode>NullPointerException</InlineCode> 是 Java 中<Text bold>最常见</Text>的运行时异常，
      没有之一。JDK 14 起引入了<Text bold>有用的 NPE 提示</Text>，能精确告诉你是哪个变量为 null：
    </Paragraph>
    <CodeBlock
      title="NPEDemo.java"
      code={`public class NPEDemo {
    public static void main(String[] args) {
        String name = null;

        // 以下操作都会触发 NPE
        // name.length();       // 对 null 调用方法
        // name.charAt(0);      // 对 null 调用方法
        // System.out.println(name.toUpperCase()); // 对 null 调用方法

        // JDK 14+ 的 NPE 信息更详细：
        // Cannot invoke "String.length()" because "name" is null
        System.out.println(name.length());
    }
}`}
    />
    <Callout type="warning" title="预防 NPE 的基本原则">
      <UnorderedList>
        <ListItem>使用对象前先判断是否为 null：<InlineCode>if (obj != null)</InlineCode></ListItem>
        <ListItem>方法返回值可能为 null 时，调用前先检查</ListItem>
        <ListItem>JDK 8 起可以用 <InlineCode>Optional</InlineCode> 包装可能为 null 的值</ListItem>
        <ListItem>字符串比较用 <InlineCode>"常量".equals(变量)</InlineCode> 避免 NPE</ListItem>
      </UnorderedList>
    </Callout>

    <Heading4>5.2 ClassCastException 详解</Heading4>
    <CodeBlock
      title="ClassCastDemo.java"
      code={`public class ClassCastDemo {
    public static void main(String[] args) {
        Object obj = "Hello";  // obj 实际上是 String

        // 正确：向下转型前先用 instanceof 判断
        if (obj instanceof String) {
            String s = (String) obj;
            System.out.println("字符串长度：" + s.length());
        }

        // 错误：直接强转为不相关的类型
        Integer num = (Integer) obj;  // 运行时 ClassCastException！
    }
}`}
    />

    <Heading3>6. 异常体系总结对比</Heading3>
    <Table
      head={['层级', '类名', '类型', '是否强制处理', '说明']}
      rows={[
        ['根类', 'Throwable', '-', '-', '所有异常和错误的根类'],
        ['第二层', 'Error', 'Error', '否', 'JVM 级别严重错误，通常不处理'],
        ['第二层', 'Exception', 'Exception', '视子类而定', '程序级别异常，可处理'],
        ['第三层', 'RuntimeException', '非受检异常', '否（编译器不强制）', '代码逻辑错误，应通过规范编码避免'],
        ['第三层', '其他 Exception 子类', '受检异常', '是（必须处理）', '外部环境问题，需明确处理方案'],
      ]}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>异常是程序运行中出现的非正常情况，未处理时程序会打印 stack trace 并崩溃。</ListItem>
        <ListItem>Java 异常体系根类是 <InlineCode>Throwable</InlineCode>，分为 <InlineCode>Error</InlineCode> 和 <InlineCode>Exception</InlineCode> 两大分支。</ListItem>
        <ListItem><InlineCode>Error</InlineCode> 是 JVM 级别严重错误，通常无法恢复，不做处理；<InlineCode>Exception</InlineCode> 是程序级别异常，可以被捕获处理。</ListItem>
        <ListItem><Text bold>受检异常</Text>（Checked）继承自 Exception（非 RuntimeException），编译器强制处理；<Text bold>非受检异常</Text>（Unchecked）继承自 RuntimeException，编译器不强制处理。</ListItem>
        <ListItem>最常见的非受检异常：NPE、数组越界、类型转换、数字格式、算术异常。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：异常分类概念题"
      code={`问：判断以下说法是否正确，并说明理由。

① RuntimeException 是受检异常（Checked Exception）。
② 所有的 Error 都继承自 Exception。
③ 受检异常如果不处理，程序可以正常编译通过。
④ NullPointerException 和 IOException 都属于 Exception 的子类，
   但只有 IOException 在不处理时会导致编译错误。`}
      answerCode={`答案：

① 错误。RuntimeException 是非受检异常（Unchecked Exception）。
   受检异常是继承 Exception 但不继承 RuntimeException 的那些子类（如 IOException）。

② 错误。Error 和 Exception 都直接继承自 Throwable，两者是平级关系，
   Error 并不是 Exception 的子类。

③ 错误。受检异常（Checked Exception）如果不使用 try-catch 处理，
   也不用 throws 声明，编译器会直接报错，无法通过编译。

④ 正确。IOException 是受检异常（直接继承 Exception），
   编译器强制要求处理。NullPointerException 继承自 RuntimeException，
   是非受检异常，编译器不强制处理，但运行时可能崩溃。`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习 2：异常触发分析"
      code={`问：以下每段代码会抛出什么异常？请写出异常类名并说明原因。

① String s = null;
   int len = s.length();

② int[] arr = {1, 2, 3};
   System.out.println(arr[3]);

③ String s = "abc";
   int n = Integer.parseInt(s);

④ Object obj = Integer.valueOf(42);
   String str = (String) obj;

⑤ int result = 10 / 0;`}
      answerCode={`答案：

① NullPointerException（NPE）
   原因：s 是 null，对 null 调用 .length() 方法触发空指针异常。

② ArrayIndexOutOfBoundsException
   原因：数组长度为 3，有效下标是 0、1、2，访问下标 3 越界。

③ NumberFormatException
   原因："abc" 不是合法的整数字符串，Integer.parseInt() 无法解析，抛出数字格式异常。

④ ClassCastException
   原因：obj 实际上是 Integer 类型，不能强转为 String，两者没有继承关系。

⑤ ArithmeticException: / by zero
   原因：整数除法中除数为 0，触发算术异常。注意：浮点数除以 0.0 不会抛异常，
   而是得到 Infinity 或 NaN。`}
    />

    <CodeBlock
      qa
      title="练习 3：编写触发各类异常的代码"
      code={`// 要求：补全以下代码，使每个方法在调用时分别触发指定的异常。
// 提示：不需要显式 throw，让代码自然触发即可。

public class TriggerExceptions {

    // 触发 NullPointerException
    public static void triggerNPE() {
        // 补全：声明一个 String 变量赋值为 null，然后调用其方法
    }

    // 触发 ArrayIndexOutOfBoundsException
    public static void triggerArrayOOB() {
        // 补全：创建长度为 2 的数组，访问下标 10
    }

    // 触发 ArithmeticException
    public static void triggerArithmetic() {
        // 补全：做一个整数除以零的运算
    }

    // 触发 NumberFormatException
    public static void triggerNumberFormat() {
        // 补全：把非数字字符串解析为整数
    }

    public static void main(String[] args) {
        triggerNPE();
    }
}`}
      answerCode={`public class TriggerExceptions {

    // 触发 NullPointerException
    public static void triggerNPE() {
        String s = null;
        System.out.println(s.length()); // s 为 null，调用方法 → NPE
    }

    // 触发 ArrayIndexOutOfBoundsException
    public static void triggerArrayOOB() {
        int[] arr = new int[2]; // 有效下标：0, 1
        System.out.println(arr[10]); // 下标 10 越界
    }

    // 触发 ArithmeticException
    public static void triggerArithmetic() {
        int result = 10 / 0; // 整数除以零
        System.out.println(result);
    }

    // 触发 NumberFormatException
    public static void triggerNumberFormat() {
        int n = Integer.parseInt("hello"); // "hello" 不是数字
        System.out.println(n);
    }

    public static void main(String[] args) {
        triggerNPE();
        // 输出：Exception in thread "main" java.lang.NullPointerException
        //       Cannot invoke "String.length()" because "s" is null
    }
}

/* 说明：
   - triggerNPE()      → NullPointerException
   - triggerArrayOOB() → ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 2
   - triggerArithmetic()    → ArithmeticException: / by zero
   - triggerNumberFormat()  → NumberFormatException: For input string: "hello"
*/`}
    />
  </article>
);

export default index;
