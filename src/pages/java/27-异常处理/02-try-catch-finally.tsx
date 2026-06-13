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
    <Title>try-catch-finally</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节我们了解了异常的分类，本节学习如何在代码中<Text bold>捕获并处理异常</Text>。
        Java 提供了 <InlineCode>try-catch-finally</InlineCode> 三个关键字构成的异常处理结构。
        本节将从基本语法讲起，依次介绍多 catch 块、finally 的执行时机、
        JDK 7 引入的多异常捕获语法，以及现代 Java 推荐的
        <Text bold>try-with-resources</Text> 自动关闭资源机制。
      </Paragraph>
    </Callout>

    <Heading3>1. 基本语法结构</Heading3>
    <Paragraph>
      <InlineCode>try-catch</InlineCode> 是异常处理的核心语法。把<Text bold>可能出现异常的代码</Text>放进
      <InlineCode>try</InlineCode> 块，在 <InlineCode>catch</InlineCode> 块中编写出现异常时的处理逻辑：
    </Paragraph>
    <CodeBlock
      title="基本 try-catch 语法"
      code={`try {
    // 可能抛出异常的代码
    // 一旦某行抛出异常，本块剩余代码跳过，直接进入对应 catch
} catch (异常类型 变量名) {
    // 异常处理代码
    // 变量名（通常叫 e）代表捕获到的异常对象
} finally {
    // 无论是否发生异常，这里的代码都会执行（可选）
}`}
    />
    <CodeBlock
      title="BasicTryCatch.java"
      code={`public class BasicTryCatch {
    public static void main(String[] args) {
        System.out.println("程序开始");

        try {
            int[] arr = new int[3];
            arr[5] = 100;  // 下标越界，抛出异常
            System.out.println("这行不会执行");  // try 中异常后的代码被跳过
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("捕获到异常：" + e.getMessage());
        }

        System.out.println("程序继续执行");  // 异常被捕获，程序不会崩溃
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`程序开始
捕获到异常：Index 5 out of bounds for length 3
程序继续执行`}
    />
    <Paragraph>
      关键点：<InlineCode>try</InlineCode> 块中异常行之后的代码不会执行，
      但异常被 <InlineCode>catch</InlineCode> 捕获后，程序会<Text bold>从 catch 块之后继续运行</Text>，
      不会崩溃。
    </Paragraph>

    <Heading3>2. 异常对象的常用方法</Heading3>
    <Paragraph>
      捕获到的异常变量（通常命名为 <InlineCode>e</InlineCode>）是一个对象，
      继承自 <InlineCode>Throwable</InlineCode>，提供以下常用方法：
    </Paragraph>
    <Table
      head={['方法', '返回类型', '描述', '示例输出']}
      rows={[
        ['getMessage()', 'String', '返回异常的详细描述信息', 'Index 5 out of bounds for length 3'],
        ['toString()', 'String', '返回异常类名 + 描述，格式：类名: 消息', 'java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3'],
        ['printStackTrace()', 'void', '将完整调用栈信息打印到标准错误流（用于调试）', '（多行，包含完整调用链路）'],
        ['getClass().getName()', 'String', '返回异常的完全限定类名', 'java.lang.ArrayIndexOutOfBoundsException'],
        ['getCause()', 'Throwable', '返回导致此异常的原始异常（异常链）', '若无原始异常则返回 null'],
      ]}
    />
    <CodeBlock
      title="ExceptionMethods.java"
      code={`public class ExceptionMethods {
    public static void main(String[] args) {
        try {
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("getMessage():   " + e.getMessage());
            System.out.println("toString():     " + e.toString());
            System.out.println("--- printStackTrace() 输出 ---");
            e.printStackTrace();  // 打印到 System.err，颜色不同
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`getMessage():   / by zero
toString():     java.lang.ArithmeticException: / by zero
--- printStackTrace() 输出 ---
java.lang.ArithmeticException: / by zero
	at ExceptionMethods.main(ExceptionMethods.java:4)`}
    />
    <Callout type="tip" title="实际开发中如何打印异常">
      生产代码中不要直接用 <InlineCode>System.out.println(e)</InlineCode>，
      而是使用日志框架（如 Logback、Log4j2）：
      <InlineCode>logger.error("操作失败", e)</InlineCode>。
      日志框架会自动记录完整的 stack trace，方便运维排查。
    </Callout>

    <Heading3>3. 多 catch 块</Heading3>
    <Paragraph>
      一段代码可能抛出多种不同类型的异常。可以写多个 <InlineCode>catch</InlineCode> 块来分别处理，
      但必须遵守<Text bold>子类在前、父类在后</Text>的顺序规则：
    </Paragraph>
    <CodeBlock
      title="MultiCatch.java"
      code={`public class MultiCatch {
    public static void parse(String input, int divisor) {
        try {
            int number = Integer.parseInt(input);  // 可能 NumberFormatException
            int result = number / divisor;         // 可能 ArithmeticException
            System.out.println("结果：" + result);
        } catch (NumberFormatException e) {
            // 先处理更具体的子类异常
            System.out.println("输入不是有效数字：" + e.getMessage());
        } catch (ArithmeticException e) {
            System.out.println("除数不能为零");
        } catch (Exception e) {
            // 最后放父类 Exception 作为兜底
            System.out.println("其他异常：" + e.getMessage());
        }
    }

    public static void main(String[] args) {
        parse("10", 2);     // 正常情况
        parse("abc", 2);    // NumberFormatException
        parse("10", 0);     // ArithmeticException
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`结果：5
输入不是有效数字：For input string: "abc"
除数不能为零`}
    />
    <Callout type="warning" title="父类 catch 不能放在子类 catch 前面">
      如果把 <InlineCode>catch (Exception e)</InlineCode> 放在
      <InlineCode>catch (NumberFormatException e)</InlineCode> 之前，
      编译器会报错：<Text bold>Exception has already been caught</Text>。
      因为 <InlineCode>Exception</InlineCode> 会捕获所有异常，后面的具体 catch 永远不会执行，
      Java 编译器发现这种"死代码"后直接拒绝编译。
    </Callout>

    <Heading3>4. finally 块</Heading3>
    <Paragraph>
      <InlineCode>finally</InlineCode> 块中的代码<Text bold>无论是否发生异常都会执行</Text>，
      通常用于释放资源（关闭文件、数据库连接、网络连接等）：
    </Paragraph>
    <CodeBlock
      title="FinallyDemo.java"
      code={`public class FinallyDemo {
    public static void test(int a, int b) {
        System.out.println("方法开始，a=" + a + ", b=" + b);
        try {
            int result = a / b;
            System.out.println("计算结果：" + result);
        } catch (ArithmeticException e) {
            System.out.println("捕获异常：" + e.getMessage());
        } finally {
            System.out.println("finally 执行（资源清理）");
        }
        System.out.println("方法结束");
    }

    public static void main(String[] args) {
        System.out.println("=== 正常情况 ===");
        test(10, 2);

        System.out.println();
        System.out.println("=== 异常情况 ===");
        test(10, 0);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`=== 正常情况 ===
方法开始，a=10, b=2
计算结果：5
finally 执行（资源清理）
方法结束

=== 异常情况 ===
方法开始，a=10, b=0
捕获异常：/ by zero
finally 执行（资源清理）
方法结束`}
    />

    <Heading4>4.1 finally 一定会执行吗？</Heading4>
    <Paragraph>
      几乎所有情况下 <InlineCode>finally</InlineCode> 都会执行，但有一个极端例外：
    </Paragraph>
    <Table
      head={['情况', 'finally 是否执行', '说明']}
      rows={[
        ['try 块正常结束', '是', '最常见情况'],
        ['try 块抛出异常被 catch 捕获', '是', 'catch 执行完后执行 finally'],
        ['try 块抛出异常未被 catch', '是', '异常传播前先执行 finally'],
        ['try 或 catch 中有 return', '是', 'return 之前先执行 finally（重要！）'],
        ['System.exit() 被调用', '否', 'JVM 进程直接终止，finally 不执行'],
        ['JVM 崩溃（如断电）', '否', '物理层面 JVM 异常退出'],
      ]}
    />

    <Heading4>4.2 finally 中的 return 覆盖问题（经典面试题）</Heading4>
    <Paragraph>
      如果 <InlineCode>try</InlineCode> 或 <InlineCode>catch</InlineCode> 块中有 <InlineCode>return</InlineCode>，
      而 <InlineCode>finally</InlineCode> 块中<Text bold>也有</Text> <InlineCode>return</InlineCode>，
      最终返回的是 <Text bold>finally 中的值</Text>——这是一个容易踩坑的陷阱：
    </Paragraph>
    <CodeBlock
      title="FinallyReturn.java"
      code={`public class FinallyReturn {

    public static int test() {
        try {
            System.out.println("try 执行");
            return 1;  // 准备返回 1，但先执行 finally
        } finally {
            System.out.println("finally 执行");
            return 2;  // finally 中的 return 覆盖了 try 中的 return
        }
    }

    public static int test2() {
        try {
            System.out.println("try 执行");
            return 10;  // 准备返回 10
        } finally {
            System.out.println("finally 执行（无 return）");
            // finally 中没有 return，所以 try 的 return 10 生效
        }
    }

    public static void main(String[] args) {
        System.out.println("test() 返回值：" + test());
        System.out.println();
        System.out.println("test2() 返回值：" + test2());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`try 执行
finally 执行
test() 返回值：2

try 执行
finally 执行（无 return）
test2() 返回值：10`}
    />
    <Callout type="warning" title="不要在 finally 中写 return">
      <InlineCode>finally</InlineCode> 中写 <InlineCode>return</InlineCode> 会覆盖
      <InlineCode>try/catch</InlineCode> 中的 <InlineCode>return</InlineCode>，
      而且如果 <InlineCode>try</InlineCode> 中抛出了异常，<InlineCode>finally</InlineCode> 的
      <InlineCode>return</InlineCode> 还会把异常"吞掉"——调用者完全感知不到异常发生了！
      <Text bold>实际开发中 finally 只做清理操作，永远不要在其中写 return。</Text>
    </Callout>

    <Heading3>5. 多异常一起捕获（JDK 7+）</Heading3>
    <Paragraph>
      JDK 7 引入了<Text bold>多异常捕获</Text>语法，用 <InlineCode>|</InlineCode> 分隔多个异常类型，
      当多种异常的处理逻辑完全相同时，可以合并到一个 catch 块，避免代码重复：
    </Paragraph>
    <CodeBlock
      title="MultiExceptionCatch.java"
      code={`public class MultiExceptionCatch {
    public static void process(String input, int divisor) {
        try {
            int n = Integer.parseInt(input);
            int r = n / divisor;
            System.out.println("结果：" + r);
        } catch (NumberFormatException | ArithmeticException e) {
            // 两种异常用同一段逻辑处理
            System.out.println("处理失败：" + e.getMessage());
        }
    }

    public static void main(String[] args) {
        process("abc", 2);   // NumberFormatException
        process("10", 0);    // ArithmeticException
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`处理失败：For input string: "abc"
处理失败：/ by zero`}
    />
    <Callout type="tip" title="多异常捕获的限制">
      使用 <InlineCode>|</InlineCode> 语法时，合并的异常类型之间不能有继承关系。
      例如 <InlineCode>catch (Exception | RuntimeException e)</InlineCode> 会编译报错，
      因为 <InlineCode>RuntimeException</InlineCode> 已经是 <InlineCode>Exception</InlineCode> 的子类，
      写在一起没有意义。
    </Callout>

    <Heading3>6. try-with-resources（JDK 7+）</Heading3>
    <Paragraph>
      在处理 IO 流、数据库连接等需要手动关闭的资源时，传统写法需要在 <InlineCode>finally</InlineCode> 块
      中关闭资源，代码冗长且容易遗漏。JDK 7 引入了 <Text bold>try-with-resources</Text> 语法，
      实现了<Text bold>自动关闭资源</Text>。
    </Paragraph>
    <Paragraph>
      要求：资源类必须实现 <InlineCode>java.lang.AutoCloseable</InlineCode> 接口
      （<InlineCode>Closeable</InlineCode> 也可以，它是 <InlineCode>AutoCloseable</InlineCode> 的子接口）。
      所有 Java IO 类（<InlineCode>InputStream</InlineCode>、<InlineCode>Reader</InlineCode> 等）均已实现该接口。
    </Paragraph>

    <Heading4>6.1 传统方式 vs try-with-resources 对比</Heading4>
    <CodeBlock
      title="TraditionalClose.java（传统 finally 关闭）"
      code={`import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class TraditionalClose {
    public static void readFile(String path) {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(path));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("读取失败：" + e.getMessage());
        } finally {
            // 必须手动关闭，还要处理 close() 自身可能抛出的异常
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    System.out.println("关闭失败：" + e.getMessage());
                }
            }
        }
    }
}`}
    />
    <CodeBlock
      title="ModernClose.java（try-with-resources 自动关闭）"
      code={`import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ModernClose {
    public static void readFile(String path) {
        // try(...) 中声明资源，代码块结束后自动调用 close()
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("读取失败：" + e.getMessage());
        }
        // reader 已自动关闭，无需手动处理
    }

    // JDK 9+ 还支持在 try 外声明资源变量，括号里直接引用
    public static void readFileJDK9(String path) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(path));
        try (reader) {  // JDK 9+ 写法：直接引用已存在的变量
            System.out.println(reader.readLine());
        }
    }
}`}
    />
    <Paragraph>
      try-with-resources 的优点：代码更简洁，资源关闭更可靠，
      即使 try 块中抛出异常也会正确调用 <InlineCode>close()</InlineCode>。
      <Text bold>JDK 7 以后处理 IO、JDBC 等资源，优先使用 try-with-resources。</Text>
    </Paragraph>

    <Heading4>6.2 自定义 AutoCloseable 资源</Heading4>
    <CodeBlock
      title="AutoCloseableDemo.java"
      code={`public class AutoCloseableDemo {

    // 自定义资源类，实现 AutoCloseable
    static class MyResource implements AutoCloseable {
        private String name;

        public MyResource(String name) {
            this.name = name;
            System.out.println(name + " 资源已打开");
        }

        public void use() {
            System.out.println(name + " 资源正在使用");
        }

        @Override
        public void close() {
            System.out.println(name + " 资源已关闭");
        }
    }

    public static void main(String[] args) {
        // try-with-resources 可以同时管理多个资源（按声明的逆序关闭）
        try (MyResource r1 = new MyResource("数据库连接");
             MyResource r2 = new MyResource("文件流")) {
            r1.use();
            r2.use();
        }
        System.out.println("try 块结束");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`数据库连接 资源已打开
文件流 资源已打开
数据库连接 资源正在使用
文件流 资源正在使用
文件流 资源已关闭
数据库连接 资源已关闭
try 块结束`}
    />

    <Heading3>7. 综合示例</Heading3>
    <Paragraph>
      下面是一个包含 try / 多 catch / finally 的完整示例：
      一个方法接收字符串和除数，解析字符串为整数，执行除法运算。
    </Paragraph>
    <CodeBlock
      title="ComprehensiveExample.java"
      code={`public class ComprehensiveExample {

    public static int divide(String numStr, int divisor) {
        System.out.println("开始计算: " + numStr + " / " + divisor);
        try {
            int number = Integer.parseInt(numStr);  // 可能 NumberFormatException
            int result = number / divisor;          // 可能 ArithmeticException
            System.out.println("计算成功，结果：" + result);
            return result;
        } catch (NumberFormatException e) {
            System.out.println("[错误] 输入不是有效整数：" + e.getMessage());
            return -1;
        } catch (ArithmeticException e) {
            System.out.println("[错误] 不能除以零");
            return -1;
        } finally {
            System.out.println("finally 执行，方法结束");
        }
    }

    public static void main(String[] args) {
        System.out.println("--- 正常情况 ---");
        divide("20", 4);

        System.out.println();
        System.out.println("--- 非数字输入 ---");
        divide("abc", 2);

        System.out.println();
        System.out.println("--- 除以零 ---");
        divide("10", 0);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`--- 正常情况 ---
开始计算: 20 / 4
计算成功，结果：5
finally 执行，方法结束

--- 非数字输入 ---
开始计算: abc / 2
[错误] 输入不是有效整数：For input string: "abc"
finally 执行，方法结束

--- 除以零 ---
开始计算: 10 / 0
[错误] 不能除以零
finally 执行，方法结束`}
    />

    <Callout type="tip" title="不要写空的 catch 块">
      <InlineCode>catch(Exception e) {`{}`}</InlineCode> 是最危险的写法：
      异常被悄悄吃掉，程序表面上"正常运行"，但实际上出了问题却毫无迹象，
      排查起来极其困难。<Text bold>至少要打印异常信息或记录日志</Text>。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>try</InlineCode> 块放可能抛出异常的代码；<InlineCode>catch</InlineCode> 块捕获并处理；<InlineCode>finally</InlineCode> 块无论如何都执行。</ListItem>
        <ListItem>多 catch 块必须<Text bold>子类在前、父类在后</Text>，否则编译报错。</ListItem>
        <ListItem>异常对象常用方法：<InlineCode>getMessage()</InlineCode>、<InlineCode>toString()</InlineCode>、<InlineCode>printStackTrace()</InlineCode>。</ListItem>
        <ListItem><InlineCode>finally</InlineCode> 几乎总会执行（<InlineCode>System.exit()</InlineCode> 除外）；<Text bold>不要在 finally 中写 return</Text>。</ListItem>
        <ListItem>JDK 7 的多异常语法 <InlineCode>catch(A | B e)</InlineCode> 可合并处理逻辑相同的异常。</ListItem>
        <ListItem>JDK 7 的 <Text bold>try-with-resources</Text> 自动关闭 AutoCloseable 资源，是处理 IO/JDBC 的最佳实践。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：finally 执行顺序分析"
      code={`问：分析以下代码，写出控制台的输出内容。

public class Quiz {
    public static int method() {
        try {
            System.out.println("A");
            int x = 1 / 0;
            System.out.println("B");
            return 1;
        } catch (ArithmeticException e) {
            System.out.println("C");
            return 2;
        } finally {
            System.out.println("D");
        }
    }

    public static void main(String[] args) {
        int result = method();
        System.out.println("返回值：" + result);
    }
}`}
      answerCode={`输出：
A
C
D
返回值：2

分析：
1. try 块开始执行，打印 "A"。
2. int x = 1 / 0 触发 ArithmeticException，"B" 不会执行，return 1 不会执行。
3. 进入 catch 块，打印 "C"，准备 return 2（但先要执行 finally）。
4. finally 块执行，打印 "D"。
5. finally 中没有 return，所以 catch 中的 return 2 生效。
6. 方法返回 2，main 方法打印 "返回值：2"。

关键点：即使 catch 中有 return，finally 也会在 return 执行前运行。`}
    />

    <CodeBlock
      qa
      title="练习 2：修复异常处理代码"
      code={`// 以下代码有两处问题，请找出并修复：
// 问题1：catch 块顺序错误（编译报错）
// 问题2：finally 中有 return，会导致 try 中抛出的异常被掩盖

public class BuggyCode {
    public static String process(String input) {
        try {
            if (input == null) {
                throw new NullPointerException("input 不能为 null");
            }
            return input.toUpperCase();
        } catch (Exception e) {          // 问题1：父类在前
            return "通用异常：" + e.getMessage();
        } catch (NullPointerException e) { // 编译报错：已被上面捕获
            return "空指针：" + e.getMessage();
        } finally {
            return "finally 的返回值";    // 问题2：finally 中有 return，吞掉异常
        }
    }
}`}
      answerCode={`// 修复后的代码：

public class FixedCode {
    public static String process(String input) {
        try {
            if (input == null) {
                throw new NullPointerException("input 不能为 null");
            }
            return input.toUpperCase();
        } catch (NullPointerException e) {  // 修复1：子类（具体）在前
            return "空指针：" + e.getMessage();
        } catch (Exception e) {             // 父类在后作兜底
            return "通用异常：" + e.getMessage();
        } finally {
            // 修复2：finally 只做清理，不写 return
            System.out.println("清理资源...");
        }
    }

    public static void main(String[] args) {
        System.out.println(process("hello"));  // 输出：HELLO
        System.out.println(process(null));     // 输出：空指针：input 不能为 null
    }
}

/* 说明：
   问题1：catch(Exception e) 在 catch(NullPointerException e) 前面，
          由于 NullPointerException 是 Exception 的子类，永远会被第一个 catch 捕获，
          第二个 catch 永远无法到达，编译器报 "Exception has already been caught"。

   问题2：finally 中的 return 会覆盖 try/catch 中的 return，
          更严重的是如果 try 抛出了未被 catch 的异常，
          finally 中的 return 会直接"吞掉"这个异常，调用者完全不知道出了问题。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：try-with-resources 改写"
      code={`// 将以下使用传统 finally 关闭资源的代码，改写为 try-with-resources 版本。
// 提示：MyConnection 已实现 AutoCloseable 接口。

public class OldStyle {
    public static void useConnection() {
        MyConnection conn = null;
        try {
            conn = new MyConnection("localhost");
            conn.query("SELECT 1");
        } catch (Exception e) {
            System.out.println("操作失败：" + e.getMessage());
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (Exception e) {
                    System.out.println("关闭连接失败");
                }
            }
        }
    }
}

// MyConnection 的接口定义（已实现 AutoCloseable）：
class MyConnection implements AutoCloseable {
    public MyConnection(String host) { System.out.println("连接到 " + host); }
    public void query(String sql)    { System.out.println("执行：" + sql); }
    @Override
    public void close()              { System.out.println("连接已关闭"); }
}`}
      answerCode={`// try-with-resources 版本（推荐写法）：

public class NewStyle {
    public static void useConnection() {
        try (MyConnection conn = new MyConnection("localhost")) {
            conn.query("SELECT 1");
        } catch (Exception e) {
            System.out.println("操作失败：" + e.getMessage());
        }
        // conn.close() 会自动调用，无需手动处理
    }

    public static void main(String[] args) {
        useConnection();
    }
}

/* 控制台输出：
连接到 localhost
执行：SELECT 1
连接已关闭

对比：
- 传统写法：~16 行（含 null 检查 + 双层 try-catch）
- 新写法：~5 行（自动关闭，代码简洁）

要点：
1. 资源声明在 try(...) 的括号中，可以声明多个，用分号分隔。
2. try 块结束后（无论正常还是异常），close() 都会被自动调用。
3. 如果 try 块和 close() 都抛出异常，try 中的异常优先，close() 的异常被"压制"
   （可通过 e.getSuppressed() 获取）。
*/`}
    />
  </article>
);

export default index;
