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
    <Title>StringBuilder 与 StringBuffer</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        我们已经知道 <InlineCode>String</InlineCode> 是<Text bold>不可变</Text>的——每次「修改」都会产生新对象。
        当需要频繁拼接、修改字符串（尤其在循环里）时，这会造成大量临时对象、性能低下。
        Java 为此提供了<Text bold>可变字符串</Text>：<InlineCode>StringBuilder</InlineCode> 和
        <InlineCode>StringBuffer</InlineCode>。本节讲清它们的原理、常用方法
        （<InlineCode>append/insert/delete/reverse</InlineCode> 等）、链式调用，
        以及二者在<Text bold>线程安全与性能</Text>上的取舍。这是字符串部分最重要的内容之一。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要可变字符串</Heading3>
    <Paragraph>
      <InlineCode>String</InlineCode> 不可变意味着 <InlineCode>s = s + "x"</InlineCode> 并不是「在原串后追加」，
      而是<Text bold>新建</Text>一个串、把旧内容和 "x" 拷过去、再让 <InlineCode>s</InlineCode> 指向新串，旧串成垃圾。
      在循环里这种代价会急剧放大：
    </Paragraph>
    <CodeBlock
      title="反面教材：循环用 + 拼接"
      code={`public class BadConcat {
    public static void main(String[] args) {
        String s = "";
        for (int i = 0; i < 5; i++) {
            s = s + i;   // 每次都 new 一个新 String 对象！
        }
        System.out.println(s);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`01234`}
    />
    <Callout type="warning" title="循环拼接的性能陷阱">
      上面循环只有 5 次看不出问题，但若循环上万次，会产生上万个临时 <InlineCode>String</InlineCode> 对象，
      时间复杂度退化到 <InlineCode>O(n²)</InlineCode>（每次拷贝越来越长的内容）。
      <Text bold>凡是「循环 / 大量拼接字符串」的场景，都应改用 StringBuilder。</Text>
    </Callout>

    <Heading3>2. StringBuilder 的本质</Heading3>
    <Paragraph>
      <InlineCode>StringBuilder</InlineCode> 内部维护一个<Text bold>可扩容的字符数组</Text>
      （JDK9 起为 <InlineCode>byte[]</InlineCode>）。append 时直接往数组里写，容量不够才扩容，
      <Text bold>全程只操作同一个对象</Text>，不产生大量中间对象，因此拼接效率极高。
    </Paragraph>
    <Table
      head={['对比项', 'String', 'StringBuilder']}
      rows={[
        ['可变性', '不可变（每次操作生成新对象）', '可变（原地修改同一对象）'],
        ['底层', 'final 字符数组', '可扩容字符数组'],
        ['拼接性能', '低（循环中 O(n²)）', '高（O(n)）'],
        ['线程安全', '是（因不可变）', '否'],
        ['适用', '少量、固定的字符串', '频繁拼接 / 修改'],
      ]}
    />

    <Heading3>3. 创建与常用方法</Heading3>
    <Table
      head={['方法', '功能', '返回值']}
      rows={[
        ['append(x)', '在末尾追加（可接任意类型）', 'StringBuilder 本身（支持链式）'],
        ['insert(index, x)', '在指定位置插入', 'StringBuilder 本身'],
        ['delete(start, end)', '删除 [start, end) 的字符', 'StringBuilder 本身'],
        ['deleteCharAt(index)', '删除指定位置一个字符', 'StringBuilder 本身'],
        ['replace(start, end, str)', '用 str 替换 [start, end)', 'StringBuilder 本身'],
        ['reverse()', '整体反转', 'StringBuilder 本身'],
        ['length()', '当前长度', 'int'],
        ['charAt(index) / setCharAt(i, c)', '取 / 改某位字符', 'char / void'],
        ['toString()', '转回不可变 String', 'String'],
      ]}
    />
    <Callout type="tip" title="为什么大多数方法返回 StringBuilder 自己">
      <InlineCode>append</InlineCode> 等方法 <InlineCode>return this</InlineCode>，所以能像
      <InlineCode>sb.append("a").append("b").append("c")</InlineCode> 这样<Text bold>链式调用</Text>，
      一气呵成。这是「建造者模式（Builder）」的典型体现，也是它名字里 Builder 的由来。
    </Callout>
    <CodeBlock
      title="StringBuilderDemo.java"
      code={`public class StringBuilderDemo {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();

        // append：链式追加，可接任意类型
        sb.append("Hello").append(", ").append("Java").append(123).append(true);
        System.out.println("append 后: " + sb);
        System.out.println("当前长度: " + sb.length());

        // insert：在下标 5 处插入
        sb.insert(5, "[X]");
        System.out.println("insert 后: " + sb);

        // delete：删除 [5, 8)
        sb.delete(5, 8);
        System.out.println("delete 后: " + sb);

        // reverse：整体反转
        StringBuilder r = new StringBuilder("abcde");
        System.out.println("reverse: " + r.reverse());

        // toString：转回 String
        String result = sb.toString();
        System.out.println("toString: " + result);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`append 后: Hello, Java123true
当前长度: 16
insert 后: Hello[X], Java123true
delete 后: Hello, Java123true
reverse: edcba
toString: Hello, Java123true`}
    />

    <Heading3>4. 用 StringBuilder 重写循环拼接</Heading3>
    <CodeBlock
      title="GoodConcat.java"
      code={`public class GoodConcat {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            sb.append(i);          // 原地追加，不产生中间对象
        }
        String s = sb.toString();  // 用完转回 String
        System.out.println(s);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`01234`} />
    <Callout type="tip" title="初始容量优化">
      如果能预估最终长度，<InlineCode>new StringBuilder(1024)</InlineCode> 预设容量可减少扩容次数，
      进一步提速。默认初始容量是 16，不够时按「原容量×2 + 2」扩容。
    </Callout>

    <Heading3>5. StringBuilder vs StringBuffer</Heading3>
    <Paragraph>
      两者 <Text bold>API 完全一样</Text>（方法名、参数都相同），唯一区别是线程安全：
    </Paragraph>
    <Table
      head={['对比项', 'StringBuilder', 'StringBuffer']}
      rows={[
        ['出现版本', 'JDK5', 'JDK1.0'],
        ['线程安全', '否（不加锁）', '是（方法用 synchronized 修饰）'],
        ['性能', '快', '略慢（同步开销）'],
        ['推荐场景', '单线程（绝大多数情况）', '多线程共享同一个可变字符串时'],
      ]}
    />
    <Callout type="success" title="如何选择">
      <UnorderedList>
        <ListItem><Text bold>默认用 StringBuilder</Text>——日常开发几乎都是单线程拼接，它更快。</ListItem>
        <ListItem>只有当<Text bold>多个线程会同时修改同一个</Text>可变字符串对象时，才需要 <InlineCode>StringBuffer</InlineCode>。</ListItem>
        <ListItem>需要不可变、共享、当 Map 的 key → 用 <InlineCode>String</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 易错点：toString 之后才是 String</Heading3>
    <CodeBlock
      title="CommonMistake.java"
      code={`public class CommonMistake {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("abc");

        // sb 不是 String，不能直接用 String 的方法
        // sb.substring 其实存在，但 sb.equals 比的是对象地址！
        StringBuilder sb2 = new StringBuilder("abc");
        System.out.println("sb.equals(sb2): " + sb.equals(sb2));        // false！
        System.out.println("内容比较:        " + sb.toString().equals(sb2.toString())); // true
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`sb.equals(sb2): false
内容比较:        true`}
    />
    <Callout type="danger" title="StringBuilder 没有重写 equals">
      <InlineCode>StringBuilder</InlineCode>/<InlineCode>StringBuffer</InlineCode>
      <Text bold>没有重写 equals</Text>，<InlineCode>sb.equals(sb2)</InlineCode> 比的是地址，永远 false。
      要比较内容，必须先 <InlineCode>toString()</InlineCode> 转成 String 再 <InlineCode>equals</InlineCode>。
    </Callout>

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>String 不可变，频繁拼接会产生大量临时对象，循环中性能退化为 O(n²)。</ListItem>
        <ListItem><InlineCode>StringBuilder</InlineCode> 是可变字符串，原地修改，拼接高效，是循环拼接的标准做法。</ListItem>
        <ListItem>核心方法 <InlineCode>append/insert/delete/reverse</InlineCode> 都返回自身，支持<Text bold>链式调用</Text>。</ListItem>
        <ListItem>用完用 <InlineCode>toString()</InlineCode> 转回 String。</ListItem>
        <ListItem><InlineCode>StringBuilder</InlineCode>(快, 不安全) vs <InlineCode>StringBuffer</InlineCode>(慢, 线程安全)，默认选前者。</ListItem>
        <ListItem>它们没重写 <InlineCode>equals</InlineCode>，比较内容要先 <InlineCode>toString</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测输出"
      code={`StringBuilder sb = new StringBuilder("abc");
sb.append("de").insert(0, ">").reverse();
System.out.println(sb);
System.out.println(sb.length());

StringBuilder a = new StringBuilder("hi");
StringBuilder b = new StringBuilder("hi");
System.out.println(a.equals(b));

问：以上输出分别是什么？`}
      answerCode={`答案：
edcba>     —— "abc"→append"de"得"abcde"→insert(0,">")得">abcde"→reverse得"edcba>"
6          —— ">abcde" 反转后共 6 个字符
false      —— StringBuilder 没重写 equals，比较的是地址，内容相同也返回 false

解析：链式调用从左到右依次执行；最后一步 reverse 把 ">abcde" 整体倒置成 "edcba>"。
      比较内容须用 a.toString().equals(b.toString())。`}
    />

    <CodeBlock
      qa
      title="练习2：把数组拼成 [a, b, c] 格式（用 StringBuilder）"
      code={`// 不用 String.join，用 StringBuilder 手动拼接，输出形如 [a, b, c]。
// 输入: {"a", "b", "c"}
// 预期输出: [a, b, c]

public class Bracket {
    public static void main(String[] args) {
        String[] arr = {"a", "b", "c"};
        // 补全
    }
}`}
      answerCode={`public class Bracket {
    public static void main(String[] args) {
        String[] arr = {"a", "b", "c"};

        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < arr.length; i++) {
            sb.append(arr[i]);
            if (i != arr.length - 1) {   // 最后一个后面不加 ", "
                sb.append(", ");
            }
        }
        sb.append("]");
        System.out.println(sb.toString());
    }
}

/* 控制台输出：
[a, b, c]

解析：用 StringBuilder 原地拼接，关键是判断「不是最后一个才追加分隔符」，
      避免出现 [a, b, c, ] 这种尾部多余逗号。这其实就是 Arrays.toString 的实现思路。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：判断回文串"
      code={`// 用 StringBuilder.reverse() 判断字符串是否是回文（正读反读相同）。
// "level" -> true ; "hello" -> false

public class Palindrome {
    static boolean isPalindrome(String s) {
        // 补全
        return false;
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome("level"));
        System.out.println(isPalindrome("hello"));
    }
}`}
      answerCode={`public class Palindrome {
    static boolean isPalindrome(String s) {
        String reversed = new StringBuilder(s).reverse().toString();
        return s.equals(reversed);   // 注意是 String 的 equals
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome("level"));
        System.out.println(isPalindrome("hello"));
    }
}

/* 控制台输出：
true
false

解析：用 StringBuilder 反转后转回 String，再用 String.equals 比较内容。
      "level" 反转还是 "level"，相等 → 回文；"hello" 反转是 "olleh"，不等 → 非回文。
      切记最后比较要用 String 的 equals，不能用 StringBuilder.equals。
*/`}
    />
  </article>
);

export default index;
