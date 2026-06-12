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
    <Title>Optional 类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>NullPointerException</InlineCode>（空指针）是 Java 最常见的异常。
        JDK8 引入的 <InlineCode>Optional&lt;T&gt;</InlineCode> 是一个「<Text bold>可能装着值，也可能为空</Text>」
        的容器，用来<Text bold>优雅地表达和处理「可能没有值」</Text>，避免到处写 <InlineCode>if (x != null)</InlineCode>。
        上一节 <InlineCode>findFirst</InlineCode>、<InlineCode>max</InlineCode> 的返回值就是它。本节讲清它的创建、
        取值、以及 <InlineCode>map/filter/orElse</InlineCode> 等链式用法和最佳实践。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要 Optional</Heading3>
    <CodeBlock
      title="传统的 null 检查：层层嵌套、易遗漏"
      code={`// 想拿到「用户的地址的城市的名字」，任何一层为 null 都会 NPE
public class NullHell {
    static String getCity(User user) {
        if (user != null) {
            Address addr = user.getAddress();
            if (addr != null) {
                return addr.getCity();
            }
        }
        return "未知";
    }
}
// User / Address 为示意类`}
    />
    <Callout type="warning" title="null 的问题">
      用 <InlineCode>null</InlineCode> 表示「没有值」有两大问题：一是调用方<Text bold>很容易忘记判空</Text>
      而导致 NPE；二是看方法签名 <InlineCode>String getCity()</InlineCode> 时，
      <Text bold>无法得知它会不会返回 null</Text>。<InlineCode>Optional</InlineCode> 把「可能为空」写进类型，
      让这件事显式化。
    </Callout>

    <Heading3>2. 创建 Optional</Heading3>
    <Table
      head={['方法', '作用', '注意']}
      rows={[
        ['Optional.of(value)', '创建一个非空 Optional', 'value 为 null 会抛 NPE'],
        ['Optional.ofNullable(value)', '创建 Optional，允许 value 为 null', '最常用，安全'],
        ['Optional.empty()', '创建一个空 Optional', '表示「没有值」'],
      ]}
    />
    <CodeBlock
      title="创建演示"
      code={`import java.util.Optional;

public class CreateOptional {
    public static void main(String[] args) {
        Optional<String> a = Optional.of("hello");        // 明确非空
        Optional<String> b = Optional.ofNullable(null);   // 允许为空 -> 空 Optional
        Optional<String> c = Optional.empty();            // 空

        System.out.println("a 有值吗: " + a.isPresent());
        System.out.println("b 有值吗: " + b.isPresent());
        System.out.println("c 为空吗: " + c.isEmpty());   // JDK11+

        // Optional.of(null) 会抛 NPE —— 不确定是否为 null 时用 ofNullable
        try {
            Optional.of(null);
        } catch (NullPointerException e) {
            System.out.println("Optional.of(null) 抛 NPE");
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`a 有值吗: true
b 有值吗: false
c 为空吗: true
Optional.of(null) 抛 NPE`}
    />
    <Callout type="tip" title="不确定就用 ofNullable">
      <InlineCode>of</InlineCode> 要求参数非空（否则 NPE）；当值可能为 null（如方法返回、Map 取值）时，
      一律用 <InlineCode>ofNullable</InlineCode>。
    </Callout>

    <Heading3>3. 取值：orElse 系列（推荐）</Heading3>
    <Paragraph>
      直接用 <InlineCode>get()</InlineCode> 取值，若 Optional 为空会抛
      <InlineCode>NoSuchElementException</InlineCode>，<Text bold>这等于没解决问题</Text>。
      应该用 <InlineCode>orElse</InlineCode> 系列提供「兜底值」：
    </Paragraph>
    <Table
      head={['方法', '行为']}
      rows={[
        ['get()', '有值返回值；空则抛异常（不推荐直接用）'],
        ['orElse(默认值)', '有值返回值；空则返回默认值'],
        ['orElseGet(supplier)', '有值返回值；空则调用 supplier 生成默认值（惰性）'],
        ['orElseThrow()', '有值返回值；空则抛异常（可自定义异常）'],
      ]}
    />
    <CodeBlock
      title="orElse 系列"
      code={`import java.util.Optional;

public class GetValue {
    public static void main(String[] args) {
        Optional<String> present = Optional.of("数据");
        Optional<String> empty = Optional.empty();

        System.out.println(present.orElse("默认"));   // 数据
        System.out.println(empty.orElse("默认"));      // 默认

        // orElseGet：只有在为空时才执行 supplier（适合默认值构造代价高的情况）
        String v = empty.orElseGet(() -> "动态生成的默认值");
        System.out.println(v);

        // orElseThrow：为空时抛自定义异常
        try {
            empty.orElseThrow(() -> new RuntimeException("值不存在!"));
        } catch (RuntimeException e) {
            System.out.println("捕获: " + e.getMessage());
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`数据
默认
动态生成的默认值
捕获: 值不存在!`}
    />
    <Callout type="warning" title="orElse vs orElseGet">
      <InlineCode>orElse(x)</InlineCode> 的参数 <InlineCode>x</InlineCode> <Text bold>无论是否为空都会先计算</Text>；
      <InlineCode>orElseGet(() -&gt; x)</InlineCode> 只有为空时才执行。
      当默认值的构造开销大（如查数据库）时，用 <InlineCode>orElseGet</InlineCode> 更高效。
    </Callout>

    <Heading3>4. 链式处理：map / filter / ifPresent</Heading3>
    <Paragraph>
      <InlineCode>Optional</InlineCode> 真正的威力在于像 Stream 一样链式处理，
      把「判空 + 取值 + 转换」串成一条优雅的链：
    </Paragraph>
    <CodeBlock
      title="map / filter / ifPresent"
      code={`import java.util.Optional;

public class ChainOptional {
    public static void main(String[] args) {
        Optional<String> name = Optional.of("  Alice  ");

        // map：有值才转换，空则保持空（自动跳过，不会 NPE）
        Optional<Integer> len = name.map(String::trim).map(String::length);
        System.out.println("处理后长度: " + len.orElse(-1));

        // filter：不满足条件就变空
        Optional<Integer> age = Optional.of(15);
        String result = age.filter(a -> a >= 18)
                           .map(a -> "成年")
                           .orElse("未成年");
        System.out.println(result);

        // ifPresent：有值才执行（替代 if(x!=null)）
        Optional.of("有值").ifPresent(s -> System.out.println("ifPresent: " + s));
        Optional.empty().ifPresent(s -> System.out.println("不会执行"));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`处理后长度: 5
未成年
ifPresent: 有值`}
    />
    <Callout type="tip" title="map 链自动处理空">
      <InlineCode>name.map(...).map(...)</InlineCode> 中，任意一步若结果为空，后续 map 自动跳过，
      最终安全地落到 <InlineCode>orElse</InlineCode>。这就把开头那段「层层 if 判空」压成了一条链。
    </Callout>

    <Heading3>5. 重写开头的「地狱嵌套」</Heading3>
    <CodeBlock
      title="用 Optional 优雅取链式属性"
      code={`import java.util.Optional;

class Address { String city; Address(String c){ city = c; } String getCity(){ return city; } }
class User { Address address; User(Address a){ address = a; } Address getAddress(){ return address; } }

public class Elegant {
    static String getCity(User user) {
        return Optional.ofNullable(user)
                .map(User::getAddress)     // user 为空则整体为空
                .map(Address::getCity)     // address 为空则整体为空
                .orElse("未知");           // 任意环节空 -> 兜底"未知"
    }

    public static void main(String[] args) {
        System.out.println(getCity(new User(new Address("北京"))));
        System.out.println(getCity(new User(null)));   // address 为空
        System.out.println(getCity(null));             // user 为空
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`北京
未知
未知`}
    />

    <Heading3>6. 使用建议（避免误用）</Heading3>
    <UnorderedList>
      <ListItem><Text bold>用于返回值</Text>：方法可能「查不到」时返回 <InlineCode>Optional</InlineCode>，明确告知调用方。</ListItem>
      <ListItem><Text bold>不要用作字段、方法参数</Text>：会让代码更啰嗦，且 Optional 本身可能为 null，得不偿失。</ListItem>
      <ListItem><Text bold>少用 get()</Text>：优先 <InlineCode>orElse/orElseGet/map/ifPresent</InlineCode>，否则和裸 null 一样危险。</ListItem>
      <ListItem><Text bold>集合不要用 Optional 包</Text>：空集合本身就能表达「没有」，直接返回空 List 即可。</ListItem>
    </UnorderedList>

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>Optional&lt;T&gt;</InlineCode> 是「可能有值/可能为空」的容器，把「可能为空」写进类型，对抗 NPE。</ListItem>
        <ListItem>创建：<InlineCode>of</InlineCode>（非空）、<InlineCode>ofNullable</InlineCode>（可空，最常用）、<InlineCode>empty</InlineCode>。</ListItem>
        <ListItem>取值用 <InlineCode>orElse/orElseGet/orElseThrow</InlineCode>，<Text bold>少用 get()</Text>。</ListItem>
        <ListItem><InlineCode>map/filter/ifPresent</InlineCode> 链式处理，自动跳过空值，替代层层 if 判空。</ListItem>
        <ListItem>主要用于<Text bold>方法返回值</Text>；不要当字段/参数，集合直接返回空集合。</ListItem>
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
      code={`Optional<String> o1 = Optional.of("Java");
Optional<String> o2 = Optional.empty();

System.out.println(o1.map(String::length).orElse(-1));
System.out.println(o2.map(String::length).orElse(-1));
System.out.println(o1.filter(s -> s.length() > 10).orElse("太短"));
System.out.println(o2.isPresent());

问：四行分别输出什么？`}
      answerCode={`答案：
4      —— o1 有值 "Java"，map 取长度 4
-1     —— o2 为空，map 跳过，orElse 返回 -1
太短   —— o1 的 "Java" 长度 4 不>10，filter 后变空，orElse 返回 "太短"
false  —— o2 为空，isPresent 为 false

解析：map/filter 对空 Optional 自动「短路跳过」，最终落到 orElse 的兜底值——
      全程不会 NPE，这正是 Optional 的设计目的。`}
    />

    <CodeBlock
      qa
      title="练习2：安全地从 Map 取值并处理"
      code={`// 从 Map 中取出某 key 的值（可能不存在），要求：
// 存在则返回它的两倍，不存在则返回 0。用 Optional 实现，不写 if。
import java.util.*;

public class Test {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("a", 10);
        // 求 "a" 和 "b" 的结果
        // 预期：a -> 20，b -> 0
    }
}`}
      answerCode={`import java.util.*;

public class Test {
    static int doubleOrZero(Map<String, Integer> map, String key) {
        return Optional.ofNullable(map.get(key))   // 可能为 null
                .map(v -> v * 2)                    // 有值才翻倍
                .orElse(0);                         // 无值兜底 0
    }

    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("a", 10);

        System.out.println("a -> " + doubleOrZero(map, "a"));
        System.out.println("b -> " + doubleOrZero(map, "b"));
    }
}

/* 控制台输出：
a -> 20
b -> 0

解析：map.get(key) 可能返回 null，用 Optional.ofNullable 包住，
      map 做转换（翻倍），orElse 兜底。整段没有一个 if，也不会 NPE。
      对比 getOrDefault：本例若只是取默认值可用 getOrDefault，但需要「对取到的值再加工」时 Optional 链更顺手。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：辨析 orElse 与 orElseGet"
      code={`// 下面两段，"创建默认值" 分别会不会被打印？为什么？
String makeDefault() {
    System.out.println("创建默认值");
    return "default";
}

Optional<String> present = Optional.of("有值");
String a = present.orElse(makeDefault());        // 段1
String b = present.orElseGet(() -> makeDefault()); // 段2`}
      answerCode={`答案：
段1（orElse）：会打印 "创建默认值"。
段2（orElseGet）：不会打印。

原因：
- orElse(makeDefault()) 中，makeDefault() 是一个「方法调用表达式」，在传参时就会被执行，
  无论 Optional 是否有值——所以即使 present 有值用不上默认值，"创建默认值" 也照样被打印了。
- orElseGet(() -> makeDefault()) 传的是一个 Supplier（Lambda），只有当 Optional 为空、
  真正需要默认值时才会调用它。present 有值，所以 Lambda 根本没执行。

结论：当默认值的构造有副作用或开销大（查库、远程调用）时，必须用 orElseGet 而非 orElse，
      否则会做无用功甚至产生意外副作用。这是 Optional 的经典考点。`}
    />
  </article>
);

export default index;
