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
    <Title>字符串的比较</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        比较字符串是否相等是日常编程中极高频的操作。Java 提供了两种比较手段：
        <InlineCode>==</InlineCode> 和 <InlineCode>equals</InlineCode>。
        初学者非常容易用错——<InlineCode>==</InlineCode> 比的是<Text bold>地址</Text>，
        <InlineCode>equals</InlineCode> 才比<Text bold>内容</Text>。
        本节彻底讲清两者的区别，介绍忽略大小写的比较方法，
        以及避免空指针的最佳写法。
      </Paragraph>
    </Callout>

    <Heading3>1. == 与 equals 的根本区别</Heading3>
    <Table
      head={['比较方式', '比较的是什么', '适用场景']}
      rows={[
        ['==', '两个变量存储的值（对引用类型即内存地址）', '比较基本类型的值；判断两个引用是否指向同一对象'],
        ['equals()', '字符串的实际字符内容是否一致', '判断两个字符串的内容是否相等（日常推荐用法）'],
        ['equalsIgnoreCase()', '忽略大小写的内容比较', '用户输入与关键词的不区分大小写匹配'],
      ]}
    />
    <Paragraph>
      对于基本类型（<InlineCode>int</InlineCode>、<InlineCode>double</InlineCode> 等），
      <InlineCode>==</InlineCode> 比较数值本身，结果符合直觉。
      但 String 是引用类型，<InlineCode>==</InlineCode> 比较的是两个变量中存储的<Text bold>内存地址</Text>，
      并不是字符内容，因此判断字符串内容是否相等必须用 <InlineCode>equals()</InlineCode>。
    </Paragraph>

    <Heading3>2. == 比较地址的详细演示</Heading3>
    <Paragraph>
      三种典型场景下 <InlineCode>==</InlineCode> 的行为：
    </Paragraph>
    <CodeBlock
      title="StringEqual1.java"
      code={`public class StringEqual1 {
    public static void main(String[] args) {
        // 场景 1：直接赋值的相同字面量 —— 指向常量池同一对象
        String s1 = "hello";
        String s2 = "hello";
        System.out.println("直接赋值，== ：" + (s1 == s2));   // true

        // 场景 2：一个字面量，一个 new —— 地址不同
        String s3 = new String("hello");
        System.out.println("字面量 vs new，== ：" + (s1 == s3)); // false

        // 场景 3：两个 new —— 分别在堆中新建，地址不同
        String s4 = new String("hello");
        System.out.println("new vs new，== ：" + (s3 == s4));   // false
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`直接赋值，== ：true
字面量 vs new，== ：false
new vs new，== ：false`} />
    <Callout type="danger" title="绝对不要用 == 判断字符串内容是否相等">
      场景 1 中 <InlineCode>s1 == s2</InlineCode> 为 <InlineCode>true</InlineCode>，
      是因为常量池让它们恰好指向同一对象，这是<Text bold>偶然的实现细节</Text>，而非语言规范保证的行为。
      一旦字符串来自方法返回值、用户输入或网络读取，就极可能是堆上不同对象，
      <InlineCode>==</InlineCode> 就会返回 <InlineCode>false</InlineCode>，导致逻辑错误。
      <Text bold>比较内容必须用 equals。</Text>
    </Callout>

    <Heading3>3. equals —— 比较字符串内容</Heading3>
    <Paragraph>
      <InlineCode>String</InlineCode> 类重写了 <InlineCode>equals()</InlineCode> 方法，
      逐字符比较两个字符串的内容。只要内容完全相同（大小写也相同），就返回 <InlineCode>true</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="StringEquals.java"
      code={`public class StringEquals {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = new String("hello");
        String s3 = "HELLO";
        String s4 = "world";

        System.out.println(s1.equals(s2));   // true：内容相同
        System.out.println(s1.equals(s3));   // false：大小写不同
        System.out.println(s1.equals(s4));   // false：内容不同
        System.out.println(s1.equals(null)); // false：与 null 比较返回 false，不会 NPE
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`true
false
false
false`} />
    <Callout type="tip" title="equals(null) 安全，不会抛异常">
      <InlineCode>String.equals()</InlineCode> 内部有 <InlineCode>null</InlineCode> 检查，
      传入 <InlineCode>null</InlineCode> 只会返回 <InlineCode>false</InlineCode>，不会抛出
      <InlineCode>NullPointerException</InlineCode>。
      但注意：调用方（点号左边的变量）不能为 <InlineCode>null</InlineCode>，
      否则会 NPE（详见第 5 节）。
    </Callout>

    <Heading3>4. equalsIgnoreCase —— 忽略大小写的比较</Heading3>
    <Paragraph>
      当需要不区分大小写地判断两个字符串是否相等时，使用
      <InlineCode>equalsIgnoreCase()</InlineCode>，比手动转换大小写再比较要简洁得多。
    </Paragraph>
    <CodeBlock
      title="IgnoreCaseDemo.java"
      code={`public class IgnoreCaseDemo {
    public static void main(String[] args) {
        String input = "YES";    // 模拟用户输入（可能大写、小写或混写）
        String keyword = "yes";

        // equals：区分大小写
        System.out.println(input.equals(keyword));             // false

        // equalsIgnoreCase：忽略大小写
        System.out.println(input.equalsIgnoreCase(keyword));   // true
        System.out.println("Hello".equalsIgnoreCase("hElLo")); // true
        System.out.println("Java".equalsIgnoreCase("PHP"));    // false
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`false
true
true
false`} />
    <Paragraph>
      实际应用场景：用户在命令行输入 "yes"/"Yes"/"YES" 都应被识别为确认操作，
      此时用 <InlineCode>input.equalsIgnoreCase("yes")</InlineCode> 最简洁。
    </Paragraph>

    <Heading3>5. 避免空指针：把常量写在 equals 前面</Heading3>
    <Paragraph>
      如果字符串变量可能为 <InlineCode>null</InlineCode>，直接调用它的 <InlineCode>equals</InlineCode>
      会抛出 <Text bold>NullPointerException（NPE）</Text>。
      最佳实践是把<Text bold>已知非 null 的字面量或常量</Text>写在点号左边，
      把可能为 null 的变量放到括号里作为参数传入。
    </Paragraph>
    <CodeBlock
      title="NullSafeEquals.java"
      code={`public class NullSafeEquals {
    public static void main(String[] args) {
        String userInput = null;  // 模拟从数据库或用户输入可能拿到 null

        // 危险写法：变量在前，若为 null 则 NPE
        // System.out.println(userInput.equals("admin")); // NullPointerException!

        // 安全写法一：常量在前（推荐）
        System.out.println("admin".equals(userInput));           // false，不会 NPE
        System.out.println("admin".equalsIgnoreCase(userInput)); // false，不会 NPE

        // 安全写法二：先判断 null（也可行，但写法稍繁琐）
        if (userInput != null && userInput.equals("admin")) {
            System.out.println("登录成功");
        } else {
            System.out.println("用户名为空或不匹配");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`false
false
用户名为空或不匹配`} />
    <Callout type="tip" title="常量前置是行业约定">
      <UnorderedList>
        <ListItem>
          <InlineCode>"常量".equals(变量)</InlineCode> ——
          常量不可能为 null，点号左边安全，推荐写法。
        </ListItem>
        <ListItem>
          <InlineCode>变量.equals("常量")</InlineCode> ——
          若变量为 null 会 NPE，要先做非空判断。
        </ListItem>
        <ListItem>
          若能保证变量不为 null（已做非空校验），两种写法等价；
          但养成常量前置的习惯，可消除一类潜在 Bug。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 综合对比示例</Heading3>
    <CodeBlock
      title="StringCompareAll.java"
      code={`public class StringCompareAll {
    public static void main(String[] args) {
        String a = "Java";
        String b = new String("Java");
        String c = "java";

        // == 比地址
        System.out.println("a == b               : " + (a == b));
        // equals 比内容（区分大小写）
        System.out.println("a.equals(b)          : " + a.equals(b));
        System.out.println("a.equals(c)          : " + a.equals(c));
        // equalsIgnoreCase 忽略大小写
        System.out.println("a.equalsIgnoreCase(c): " + a.equalsIgnoreCase(c));
        // 常量前置，防 null
        System.out.println("\"Java\".equals(b)     : " + "Java".equals(b));
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`a == b               : false
a.equals(b)          : true
a.equals(c)          : false
a.equalsIgnoreCase(c): true
"Java".equals(b)     : true`} />

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己分析，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：预测比较输出"
      code={`// 问：下面代码的控制台输出是什么？逐行说明原因。

String s1 = "abc";
String s2 = "abc";
String s3 = new String("abc");
String s4 = "ABC";

System.out.println(s1 == s2);
System.out.println(s1 == s3);
System.out.println(s1.equals(s3));
System.out.println(s1.equals(s4));
System.out.println(s1.equalsIgnoreCase(s4));`}
      answerCode={`/* 控制台输出：
true
false
true
false
true

逐行解析：
  s1 == s2                   → true   s1、s2 都是字面量 "abc"，指向常量池同一对象。
  s1 == s3                   → false  s3 是 new 出来的堆对象，与常量池中的 s1 地址不同。
  s1.equals(s3)              → true   内容都是 "abc"，equals 只比内容。
  s1.equals(s4)              → false  "abc" 与 "ABC" 大小写不同，equals 区分大小写。
  s1.equalsIgnoreCase(s4)    → true   忽略大小写后两者内容相同。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：用户登录验证（防 null 写法）"
      code={`// 要求：模拟登录验证。
// 如果 username 等于 "admin"（忽略大小写）且 password 等于 "123456"，
// 打印"登录成功"；否则打印"用户名或密码错误"。
// 使用安全的常量前置写法，确保即使变量为 null 也不会 NPE。

public class LoginCheck {
    public static void main(String[] args) {
        String username = "Admin";   // 用户输入，可能大写混写
        String password = "123456";

        // 在这里补全代码
    }
}`}
      answerCode={`public class LoginCheck {
    public static void main(String[] args) {
        String username = "Admin";
        String password = "123456";

        // 常量在前：即使 username/password 为 null 也不会 NPE
        if ("admin".equalsIgnoreCase(username) && "123456".equals(password)) {
            System.out.println("登录成功");
        } else {
            System.out.println("用户名或密码错误");
        }
    }
}

/* 控制台输出：
登录成功

解析：
  "admin".equalsIgnoreCase("Admin") 返回 true（忽略大小写匹配）。
  "123456".equals("123456")         返回 true。
  两个条件都满足，打印"登录成功"。
  若 username 改为 null，equalsIgnoreCase(null) 返回 false，不会 NPE。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：找出代码中的 Bug 并修正"
      code={`// 问：下面代码有 Bug，输入 "hello" 时应打印"匹配成功"，但实际走了 else 分支。
// 请找出 Bug 并修正，同时改为防 null 的安全写法。

public class BugFix {
    public static void main(String[] args) {
        String input = new String("hello");
        if (input == "hello") {
            System.out.println("匹配成功");
        } else {
            System.out.println("匹配失败");
        }
    }
}`}
      answerCode={`/* Bug 分析：
   input 是用 new String("hello") 在堆中创建的对象，
   而 "hello" 是常量池中的对象，两者地址不同，
   所以 input == "hello" 结果为 false，导致走了 else 分支。

修正后的代码：
*/
public class BugFix {
    public static void main(String[] args) {
        String input = new String("hello");
        if ("hello".equals(input)) {   // 改用 equals，常量前置防 null
            System.out.println("匹配成功");
        } else {
            System.out.println("匹配失败");
        }
    }
}

/* 控制台输出：
匹配成功

解析：equals 比较字符串内容，"hello".equals(input) 为 true，逻辑正确。
      将常量 "hello" 写在前面是防御性编程的好习惯。
*/`}
    />
  </article>
);

export default index;
