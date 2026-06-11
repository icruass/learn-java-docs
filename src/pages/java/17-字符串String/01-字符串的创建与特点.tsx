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
    <Title>字符串的创建与特点</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>String</Text> 是 Java 中使用最频繁的类之一，用于表示一段文字。
        与 <InlineCode>int</InlineCode>、<InlineCode>char</InlineCode> 等基本类型不同，
        String 是<Text bold>引用类型</Text>，变量存储的是对象的地址，而不是字符本身。
        本节重点掌握：两种创建方式的区别、字符串内容不可变的含义，
        以及字符串常量池带来的 <InlineCode>==</InlineCode> 比较"坑"。
      </Paragraph>
    </Callout>

    <Heading3>1. String 是引用类型</Heading3>
    <Paragraph>
      Java 的数据类型分为两大类：<Text bold>基本类型</Text>（byte、short、int、long、float、double、char、boolean）
      和<Text bold>引用类型</Text>（类、接口、数组）。
      String 是 <InlineCode>java.lang</InlineCode> 包中的一个类，属于引用类型。
    </Paragraph>
    <Table
      head={['对比项', '基本类型（如 int）', '引用类型（如 String）']}
      rows={[
        ['变量存储的内容', '实际数据值（如 42）', '对象在堆内存中的地址'],
        ['默认值', '0 / false / \'\\0\'', 'null'],
        ['赋值操作', '直接复制数值', '复制地址（两个变量指向同一对象）'],
        ['== 比较', '比较数值是否相等', '比较地址是否相同（不是比内容！）'],
      ]}
    />
    <Callout type="warning" title="String 变量保存的是地址">
      写 <InlineCode>String s = "hello";</InlineCode> 时，变量 <InlineCode>s</InlineCode>
      里存放的是 <InlineCode>"hello"</InlineCode> 对象在内存中的地址，而不是字符
      <InlineCode>h</InlineCode>、<InlineCode>e</InlineCode>、<InlineCode>l</InlineCode> 本身。
      理解这一点是理解后面所有 String 特性的基础。
    </Callout>

    <Heading3>2. 两种创建字符串的方式</Heading3>
    <Paragraph>
      创建 String 对象有两种常见写法，它们在内存分配上有本质区别：
    </Paragraph>
    <Table
      head={['方式', '写法示例', '对象存放位置', '常量池']}
      rows={[
        ['直接赋值（字面量）', 'String s = "abc";', '字符串常量池（方法区/堆）', '相同字面量只创建一个对象，共享复用'],
        ['new 构造（无参/char[]）', 'String s = new String("abc");', '堆内存（Heap）', '每次 new 都在堆中创建新对象'],
        ['new String(char[])', 'String s = new String(new char[]{\'a\',\'b\'});', '堆内存（Heap）', '根据字符数组内容创建新对象'],
      ]}
    />

    <Heading4>方式一：直接赋值（推荐日常使用）</Heading4>
    <Paragraph>
      这是最常用的写法。JVM 在加载类时，会把程序中出现的所有字符串字面量
      放入<Text bold>字符串常量池</Text>。若池中已有相同内容的字符串，则直接复用，不再新建对象。
    </Paragraph>
    <CodeBlock
      title="StringCreate1.java"
      code={`public class StringCreate1 {
    public static void main(String[] args) {
        String s1 = "abc";   // JVM 在常量池中创建 "abc"，s1 指向它
        String s2 = "abc";   // 常量池已有 "abc"，s2 直接复用，指向同一对象
        String s3 = "xyz";   // 常量池中没有 "xyz"，新建后 s3 指向它

        System.out.println(s1 == s2);  // true：两者地址相同（同一个常量池对象）
        System.out.println(s1 == s3);  // false：地址不同
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`true
false`} />

    <Heading4>方式二：new String(...)</Heading4>
    <Paragraph>
      使用 <InlineCode>new</InlineCode> 关键字时，无论常量池是否存在相同内容，
      都会在<Text bold>堆内存</Text>中新建一个 String 对象。因此两次 <InlineCode>new</InlineCode>
      出来的对象地址必然不同，即使内容完全一样。
    </Paragraph>
    <CodeBlock
      title="StringCreate2.java"
      code={`public class StringCreate2 {
    public static void main(String[] args) {
        String s1 = new String("abc");  // 堆中新建对象 A
        String s2 = new String("abc");  // 堆中再新建对象 B（与 A 不同地址）
        String s3 = "abc";              // 常量池中的对象 C

        System.out.println(s1 == s2);   // false：A 和 B 是两个不同的堆对象
        System.out.println(s1 == s3);   // false：堆对象 A 与常量池对象 C 地址不同
        System.out.println(s1.equals(s2)); // true：内容都是 "abc"（equals 比内容）
        System.out.println(s1.equals(s3)); // true：内容都是 "abc"
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`false
false
true
true`} />

    <Heading4>方式三：new String(char[])</Heading4>
    <Paragraph>
      可以把字符数组转成字符串，在处理字符级操作后重新组合字符串时很有用。
    </Paragraph>
    <CodeBlock
      title="StringCreate3.java"
      code={`public class StringCreate3 {
    public static void main(String[] args) {
        char[] chars = {'J', 'a', 'v', 'a'};
        String s = new String(chars);   // 将字符数组转为字符串
        System.out.println(s);          // Java
        System.out.println(s.length()); // 4
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`Java
4`} />

    <Heading3>3. 字符串内容不可变（immutable）</Heading3>
    <Paragraph>
      String 最重要的特性之一：<Text bold>字符串对象一旦创建，其内容永远不能改变</Text>。
      任何看起来"修改"字符串的操作，实际上都是产生了一个<Text bold>全新的字符串对象</Text>，
      原对象内容丝毫不变。
    </Paragraph>
    <CodeBlock
      title="StringImmutable.java"
      code={`public class StringImmutable {
    public static void main(String[] args) {
        String s = "hello";
        System.out.println(s);          // hello

        // "修改"字符串：s 重新指向新对象，原 "hello" 对象内容不变
        s = s + " world";
        System.out.println(s);          // hello world

        // 原来的 "hello" 对象依然存在于内存中（只是 s 不再指向它了）
        String s2 = "hello";
        System.out.println(s2);         // hello（原内容未被修改）

        // toUpperCase 也是返回新对象
        String upper = s2.toUpperCase();
        System.out.println(s2);         // hello（s2 本身未变）
        System.out.println(upper);      // HELLO（新对象）
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`hello
hello world
hello
hello
HELLO`} />
    <Paragraph>
      执行 <InlineCode>s = s + " world"</InlineCode> 时，JVM 创建了一个内容为
      <InlineCode>"hello world"</InlineCode> 的新字符串对象，然后把变量 <InlineCode>s</InlineCode>
      指向这个新对象。原来的 <InlineCode>"hello"</InlineCode> 对象内容不变，只是没有变量引用它了
      （将来会被垃圾回收）。
    </Paragraph>
    <Callout type="tip" title="不可变性带来的好处">
      <UnorderedList>
        <ListItem>线程安全：多个线程可以同时读取同一个 String 对象，不存在竞争问题。</ListItem>
        <ListItem>常量池能够共享复用：正是因为内容不可变，相同字面量才能放心地被多个变量共享。</ListItem>
        <ListItem>可用作 HashMap 的键：不可变保证了哈希值稳定。</ListItem>
      </UnorderedList>
    </Callout>
    <Callout type="warning" title="频繁拼接字符串性能差">
      正因为每次"修改"都创建新对象，在循环中大量拼接字符串时要用
      <InlineCode>StringBuilder</InlineCode> 而不是直接用 <InlineCode>+</InlineCode>，
      否则会产生大量临时对象，影响性能。
    </Callout>

    <Heading3>4. 字符串常量池详解</Heading3>
    <Paragraph>
      字符串常量池（String Constant Pool）是 JVM 为字符串字面量维护的一块特殊内存区域
      （Java 8 及以后在堆中）。其核心机制：
    </Paragraph>
    <OrderedList>
      <ListItem>
        程序中出现字符串字面量时，JVM 先检查常量池中是否已有该内容的对象。
      </ListItem>
      <ListItem>
        若已有，直接返回池中对象的引用（不新建）；若没有，在池中创建一个新对象再返回引用。
      </ListItem>
      <ListItem>
        使用 <InlineCode>new String(...)</InlineCode> 始终在堆中创建新对象，
        与常量池中的对象是两个不同的实例。
      </ListItem>
    </OrderedList>
    <CodeBlock
      title="ConstantPool.java"
      code={`public class ConstantPool {
    public static void main(String[] args) {
        // 直接赋值：s1、s2 都指向常量池中同一个 "java" 对象
        String s1 = "java";
        String s2 = "java";

        // new：s3、s4 分别是堆中两个独立对象
        String s3 = new String("java");
        String s4 = new String("java");

        System.out.println("s1 == s2 : " + (s1 == s2));  // true
        System.out.println("s1 == s3 : " + (s1 == s3));  // false
        System.out.println("s3 == s4 : " + (s3 == s4));  // false

        // equals 比较内容，全部为 true
        System.out.println("s1.equals(s3) : " + s1.equals(s3)); // true
        System.out.println("s3.equals(s4) : " + s3.equals(s4)); // true
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`s1 == s2 : true
s1 == s3 : false
s3 == s4 : false
s1.equals(s3) : true
s3.equals(s4) : true`} />
    <Callout type="danger" title="不要用 == 判断字符串内容是否相等">
      <InlineCode>==</InlineCode> 比较的是<Text bold>内存地址</Text>，不是字符串内容。
      两个内容完全相同的字符串，如果一个来自常量池、一个来自 <InlineCode>new</InlineCode>，
      <InlineCode>==</InlineCode> 就会返回 <InlineCode>false</InlineCode>，产生难以排查的 Bug。
      <Text bold>比较字符串内容必须使用 equals 方法</Text>，详见下一节。
    </Callout>

    <Heading3>5. null 与空字符串的区别</Heading3>
    <Paragraph>
      初学者常混淆 <InlineCode>null</InlineCode> 和空字符串 <InlineCode>""</InlineCode>，两者有本质区别：
    </Paragraph>
    <Table
      head={['', 'null', '空字符串 ""']}
      rows={[
        ['含义', '变量没有指向任何对象', '指向一个内容为空（长度为 0）的字符串对象'],
        ['对象是否存在', '无对象', '有对象，只是内容为空'],
        ['调用方法', '会抛出 NullPointerException', '可正常调用 length()、equals() 等'],
        ['length()', '不能调用（NPE）', '返回 0'],
      ]}
    />
    <CodeBlock
      title="NullVsEmpty.java"
      code={`public class NullVsEmpty {
    public static void main(String[] args) {
        String s1 = null;    // s1 不指向任何对象
        String s2 = "";      // s2 指向一个空字符串对象

        System.out.println(s2.length());       // 0
        System.out.println("".equals(s2));     // true

        // System.out.println(s1.length());    // 报错！NullPointerException
        System.out.println(s1 == null);        // true
        System.out.println(s2 == null);        // false
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`0
true
true
false`} />

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己分析，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：判断 == 的输出结果"
      code={`// 问：下面代码的控制台输出是什么？请逐行分析原因。

public class Exercise01 {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";
        String c = new String("hello");
        String d = new String("hello");

        System.out.println(a == b);
        System.out.println(a == c);
        System.out.println(c == d);
        System.out.println(a.equals(c));
    }
}`}
      answerCode={`/* 控制台输出：
true
false
false
true

解析：
  a == b：a 和 b 都是直接赋值的字面量 "hello"，JVM 让它们指向常量池中同一个对象，地址相同，== 为 true。
  a == c：c 是 new 出来的堆对象，与常量池中的 a 地址不同，== 为 false。
  c == d：c 和 d 各自 new 出来，是堆中两个不同对象，地址不同，== 为 false。
  a.equals(c)：equals 比较内容，两者内容都是 "hello"，结果为 true。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：字符串不可变特性验证"
      code={`// 要求：
// 1. 创建字符串 s = "Java"
// 2. 调用 s.toUpperCase() 得到大写版本并打印
// 3. 再次打印 s 本身，验证原字符串是否被修改
// 4. 用 new String(char[]) 方式，将 char[]{'H','i'} 创建字符串并打印

public class Exercise02 {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {
    public static void main(String[] args) {
        String s = "Java";
        String upper = s.toUpperCase();  // 返回新对象，s 本身不变
        System.out.println(upper);       // JAVA
        System.out.println(s);           // Java（原字符串未被修改）

        char[] chars = {'H', 'i'};
        String hi = new String(chars);
        System.out.println(hi);          // Hi
    }
}

/* 控制台输出：
JAVA
Java
Hi

解析：toUpperCase() 返回一个新的字符串对象，原变量 s 指向的 "Java" 对象内容不变。
      这印证了 String 内容不可变的特性。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：常量池与 new 的内存分析"
      code={`// 问：下面代码共创建了几个字符串对象？每个变量分别指向哪个对象？
// 请画出内存示意图并说明 == 的结果。

String s1 = "abc";
String s2 = "abc";
String s3 = new String("abc");
String s4 = new String("abc");`}
      answerCode={`/* 答：共创建了 3 个字符串对象。

内存分析：
  常量池：1 个 "abc" 对象（地址假设为 @100）
          s1 --> @100
          s2 --> @100  （与 s1 指向同一个）

  堆内存：s3 --> @200  （new 出来的对象 A）
          s4 --> @300  （new 出来的对象 B，与 A 不同）

== 结果：
  s1 == s2  →  true  （同一个常量池对象）
  s1 == s3  →  false （常量池 vs 堆）
  s3 == s4  →  false （两个不同堆对象）
  s1.equals(s3)  →  true  （内容均为 "abc"）

注意：执行 new String("abc") 时，如果常量池中还没有 "abc"，
      JVM 会先在常量池中创建 "abc"，然后再在堆中创建新对象，
      所以 new String("abc") 有可能创建 1 或 2 个对象（取决于常量池中是否已有）。
*/`}
    />
  </article>
);

export default index;
