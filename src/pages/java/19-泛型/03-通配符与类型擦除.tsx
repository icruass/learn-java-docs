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
    <Title>通配符与类型擦除</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节讲泛型里两块进阶但极重要的内容。其一是<Text bold>通配符 ?</Text>——用于「我不关心具体类型，
        但要约束范围」的场景，包括上限 <InlineCode>? extends</InlineCode> 与下限 <InlineCode>? super</InlineCode>；
        其二是<Text bold>类型擦除</Text>——理解 Java 泛型「只在编译期存在」的本质，
        能解释一系列看似奇怪的限制。这两点是面试高频，也是真正用好泛型的关键。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要通配符</Heading3>
    <Paragraph>
      先看一个反直觉的事实：<InlineCode>List&lt;Integer&gt;</InlineCode> <Text bold>不是</Text>
      <InlineCode>List&lt;Number&gt;</InlineCode> 的子类型，尽管 Integer 是 Number 的子类。
    </Paragraph>
    <CodeBlock
      title="泛型不具备「协变」"
      code={`import java.util.ArrayList;
import java.util.List;

public class WhyWildcard {
    static void printAll(List<Number> list) {  // 只接受 List<Number>
        for (Number n : list) System.out.print(n + " ");
        System.out.println();
    }

    public static void main(String[] args) {
        List<Integer> ints = new ArrayList<>();
        ints.add(1); ints.add(2);
        // printAll(ints);   // 编译错误！List<Integer> 不是 List<Number>
    }
}`}
    />
    <Callout type="warning" title="泛型是「不变」的">
      虽然 <InlineCode>Integer extends Number</InlineCode>，但 <InlineCode>List&lt;Integer&gt;</InlineCode>
      和 <InlineCode>List&lt;Number&gt;</InlineCode> 之间<Text bold>没有继承关系</Text>。
      要让方法能接收「各种元素类型的 List」，就得用通配符 <InlineCode>?</InlineCode>。
    </Callout>

    <Heading3>2. 无界通配符 ?</Heading3>
    <Paragraph>
      <InlineCode>?</InlineCode> 表示「任意类型」。<InlineCode>List&lt;?&gt;</InlineCode> 意为
      「元素类型未知的 List」，可以接收任何 <InlineCode>List&lt;具体类型&gt;</InlineCode>：
    </Paragraph>
    <CodeBlock
      title="无界通配符"
      code={`import java.util.ArrayList;
import java.util.List;

public class Unbounded {
    // 接收任意元素类型的 List
    static void printSize(List<?> list) {
        System.out.println("大小: " + list.size());
    }

    public static void main(String[] args) {
        printSize(new ArrayList<String>());
        List<Integer> nums = new ArrayList<>();
        nums.add(1);
        printSize(nums);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`大小: 0
大小: 1`} />
    <Callout type="danger" title="List<?> 不能 add（除了 null）">
      因为不知道 <InlineCode>?</InlineCode> 具体是什么类型，编译器禁止往 <InlineCode>List&lt;?&gt;</InlineCode>
      里 <InlineCode>add</InlineCode> 元素（无法保证类型安全），只能读取（按 Object 读）或 add null。
      所以 <InlineCode>List&lt;?&gt;</InlineCode> 适合「<Text bold>只读遍历</Text>」的场景。
    </Callout>

    <Heading3>3. 上界通配符 ? extends（只读）</Heading3>
    <Paragraph>
      <InlineCode>? extends 类型</InlineCode> 表示「该类型或其子类」，即给通配符设一个<Text bold>上界</Text>。
      <InlineCode>List&lt;? extends Number&gt;</InlineCode> 可接收 <InlineCode>List&lt;Integer&gt;</InlineCode>、
      <InlineCode>List&lt;Double&gt;</InlineCode> 等：
    </Paragraph>
    <CodeBlock
      title="上界通配符"
      code={`import java.util.ArrayList;
import java.util.List;

public class UpperBound {
    // 接收 Number 及其任意子类的 List，求和
    static double sum(List<? extends Number> list) {
        double total = 0;
        for (Number n : list) {     // 读出来当 Number 用，安全
            total += n.doubleValue();
        }
        return total;
    }

    public static void main(String[] args) {
        List<Integer> ints = new ArrayList<>();
        ints.add(1); ints.add(2); ints.add(3);

        List<Double> doubles = new ArrayList<>();
        doubles.add(1.5); doubles.add(2.5);

        System.out.println("整数和: " + sum(ints));
        System.out.println("小数和: " + sum(doubles));
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`整数和: 6.0
小数和: 4.0`} />
    <Callout type="warning" title="extends 是「只读」的">
      <InlineCode>? extends Number</InlineCode> 能保证「读出来的至少是 Number」，所以读取安全；
      但<Text bold>不能 add</Text>（除 null）——因为不知道实际是 Integer 还是 Double 的列表，
      加任何具体值都可能类型不符。<Text bold>extends = 生产者（Producer），适合取数据。</Text>
    </Callout>

    <Heading3>4. 下界通配符 ? super（只写）</Heading3>
    <Paragraph>
      <InlineCode>? super 类型</InlineCode> 表示「该类型或其父类」，即设一个<Text bold>下界</Text>。
      <InlineCode>List&lt;? super Integer&gt;</InlineCode> 可接收 <InlineCode>List&lt;Integer&gt;</InlineCode>、
      <InlineCode>List&lt;Number&gt;</InlineCode>、<InlineCode>List&lt;Object&gt;</InlineCode>：
    </Paragraph>
    <CodeBlock
      title="下界通配符"
      code={`import java.util.ArrayList;
import java.util.List;

public class LowerBound {
    // 往列表里添加 Integer：只要这个列表能装下 Integer 即可
    static void addNumbers(List<? super Integer> list) {
        for (int i = 1; i <= 3; i++) {
            list.add(i);        // 写入安全：Integer 一定是 ? super Integer 的合法元素
        }
    }

    public static void main(String[] args) {
        List<Number> nums = new ArrayList<>();
        addNumbers(nums);       // List<Number> 可接收
        System.out.println(nums);

        List<Object> objs = new ArrayList<>();
        addNumbers(objs);       // List<Object> 也可接收
        System.out.println(objs);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`[1, 2, 3]
[1, 2, 3]`} />
    <Callout type="tip" title="PECS 口诀：Producer Extends, Consumer Super">
      <UnorderedList>
        <ListItem>要从泛型集合里<Text bold>取数据（生产者）</Text> → 用 <InlineCode>? extends</InlineCode>（只读）。</ListItem>
        <ListItem>要往泛型集合里<Text bold>存数据（消费者）</Text> → 用 <InlineCode>? super</InlineCode>（可写）。</ListItem>
      </UnorderedList>
      这条 <Text bold>PECS</Text> 原则是使用通配符的黄金法则。
    </Callout>

    <Heading3>5. 三种通配符对比</Heading3>
    <Table
      head={['写法', '含义', '能读吗', '能写吗']}
      rows={[
        ['List<?>', '未知类型', '能（当 Object）', '不能（除 null）'],
        ['List<? extends Number>', 'Number 或其子类', '能（当 Number）', '不能（除 null）'],
        ['List<? super Integer>', 'Integer 或其父类', '能（当 Object）', '能（写 Integer 及其子类）'],
      ]}
    />

    <Heading3>6. 类型擦除：泛型的真相</Heading3>
    <Paragraph>
      Java 泛型是<Text bold>编译期的语法糖</Text>。编译完成后，所有泛型信息都会被「擦除」——
      <InlineCode>List&lt;String&gt;</InlineCode> 和 <InlineCode>List&lt;Integer&gt;</InlineCode>
      在运行时<Text bold>是同一个类</Text> <InlineCode>List</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="运行时泛型已被擦除"
      code={`import java.util.ArrayList;
import java.util.List;

public class TypeErasure {
    public static void main(String[] args) {
        List<String> strList = new ArrayList<>();
        List<Integer> intList = new ArrayList<>();

        // 运行时 getClass 相同——泛型已被擦除
        System.out.println(strList.getClass() == intList.getClass());
        System.out.println(strList.getClass().getName());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`true
java.util.ArrayList`}
    />
    <Callout type="note" title="擦除成什么">
      类型参数在擦除后会被替换为它的<Text bold>上界</Text>：无界的 <InlineCode>T</InlineCode> 擦成
      <InlineCode>Object</InlineCode>；有界的 <InlineCode>&lt;T extends Number&gt;</InlineCode> 擦成
      <InlineCode>Number</InlineCode>。编译器在需要的地方自动插入强制转换，所以你用起来感觉「有类型」。
    </Callout>

    <Heading3>7. 类型擦除带来的限制</Heading3>
    <Paragraph>
      理解了擦除，就能解释泛型的一系列「不能这样写」：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>不能 new 泛型对象：</Text><InlineCode>new T()</InlineCode> 非法——运行时 T 已不存在，不知道 new 什么。
      </ListItem>
      <ListItem>
        <Text bold>不能用泛型创建数组：</Text><InlineCode>new T[10]</InlineCode> 非法。
      </ListItem>
      <ListItem>
        <Text bold>不能对泛型用 instanceof：</Text><InlineCode>obj instanceof List&lt;String&gt;</InlineCode> 非法
        （运行时只有 List，分不出 String）。
      </ListItem>
      <ListItem>
        <Text bold>静态成员不能用类的类型参数：</Text>T 属于对象，静态成员属于类，时机对不上。
      </ListItem>
      <ListItem>
        <Text bold>不能用基本类型做类型参数：</Text>因为擦除后是 Object，基本类型不是对象。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      title="一个由擦除导致的有趣现象"
      code={`import java.util.ArrayList;
import java.util.List;

public class ErasureTrick {
    public static void main(String[] args) throws Exception {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);

        // 利用反射「绕过」编译期检查，往 List<Integer> 塞字符串
        list.getClass().getMethod("add", Object.class).invoke(list, "我是字符串");

        System.out.println("list = " + list);   // 居然塞进去了
        // list.get(2) 若按 Integer 取用会在此刻才抛 ClassCastException
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`list = [1, 2, 我是字符串]`}
    />
    <Paragraph>
      这正说明：泛型检查只在编译期，运行时的 <InlineCode>List</InlineCode> 根本不在乎元素类型。
      日常编码遵守泛型即可，这个例子只为加深对「擦除」的理解。
    </Paragraph>

    <Heading3>8. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>泛型「不变」：<InlineCode>List&lt;Integer&gt;</InlineCode> 不是 <InlineCode>List&lt;Number&gt;</InlineCode> 的子类。</ListItem>
        <ListItem><InlineCode>?</InlineCode> 无界（只读）、<InlineCode>? extends</InlineCode> 上界（只读）、<InlineCode>? super</InlineCode> 下界（可写）。</ListItem>
        <ListItem><Text bold>PECS</Text>：取数据用 extends，存数据用 super。</ListItem>
        <ListItem>类型擦除：泛型是编译期语法糖，运行时 <InlineCode>List&lt;String&gt;</InlineCode> 与 <InlineCode>List&lt;Integer&gt;</InlineCode> 是同一类。</ListItem>
        <ListItem>擦除导致：不能 <InlineCode>new T()</InlineCode>、不能 <InlineCode>new T[]</InlineCode>、不能 <InlineCode>instanceof 泛型</InlineCode>、静态成员不能用类的 T。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>9. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：选择通配符"
      code={`为下列方法签名选择合适的通配符（? / ? extends X / ? super X）：
① 一个方法要遍历打印一个数字列表的所有元素（只读）。
② 一个方法要往传入的列表里添加若干 Integer。
③ 一个方法只需要返回列表的元素个数，不关心类型。`}
      answerCode={`答案：
① List<? extends Number>
   理由：只读取（遍历打印），用 extends；接收 Integer/Double 等各种数字列表。
② List<? super Integer>
   理由：要写入 Integer，用 super；接收 List<Integer>/List<Number>/List<Object>。
③ List<?>
   理由：完全不关心元素类型，只调 size()，用无界通配符即可。

口诀回顾——PECS：取数据(Producer)用 extends，存数据(Consumer)用 super。`}
    />

    <CodeBlock
      qa
      title="练习2：判断能否编译"
      code={`List<? extends Number> a = new ArrayList<Integer>();
① a.add(1);              // 能编译吗？
② Number n = a.get(0);   // 假设非空，能编译吗？

List<? super Integer> b = new ArrayList<Number>();
③ b.add(100);            // 能编译吗？
④ Integer x = b.get(0);  // 能编译吗？`}
      answerCode={`答案：
① 不能。? extends Number 是只读的，不能 add（除 null）。无法确定 a 到底是哪种子类列表。
② 能。读出来至少是 Number，赋给 Number 安全。
③ 能。? super Integer 可写入 Integer 及其子类。
④ 不能。? super Integer 读出来只能保证是 Object（下界之上可能是 Number/Object），
   不能直接赋给 Integer，需强转：Integer x = (Integer) b.get(0);

解析：再次印证 PECS——extends 能读不能写，super 能写，读只能按 Object。`}
    />

    <CodeBlock
      qa
      title="练习3：解释类型擦除现象"
      code={`下面代码会输出什么？解释原因。

import java.util.*;

public class Test {
    public static void main(String[] args) {
        Map<String, Integer> m1 = new HashMap<>();
        List<Double> l1 = new ArrayList<>();
        Map<Integer, String> m2 = new HashMap<>();

        System.out.println(m1.getClass() == m2.getClass());
        System.out.println(m1.getClass().getSimpleName());
        // 下面这行能编译吗？  if (l1 instanceof List<Double>) {}
    }
}`}
      answerCode={`答案（前两行输出）：
true
HashMap

解释：
- 类型擦除后，Map<String,Integer> 与 Map<Integer,String> 运行时都是同一个类 HashMap，
  所以 getClass() 相等，getSimpleName() 都是 "HashMap"。
- 最后一行「l1 instanceof List<Double>」无法编译：运行时泛型已被擦除，只剩 List，
  JVM 区分不出 List<Double> 与 List<String>，所以带泛型参数的 instanceof 是非法的。
  合法写法是 l1 instanceof List（裸类型）或 List<?>。

结论：凡是「运行时需要知道具体泛型类型」的操作（instanceof 泛型、new T()、new T[]）都不被允许，
      根源都是类型擦除。`}
    />
  </article>
);

export default index;
