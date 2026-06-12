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
    <Title>包装类与装箱拆箱</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 有 8 种基本数据类型（int、double 等），它们不是对象，不能直接放进集合、不能调用方法。
        为此 Java 为每种基本类型配了一个对应的<Text bold>包装类（Wrapper Class）</Text>，
        把基本值「包」成对象。本节讲清 8 大包装类、为什么需要它们、以及基本类型与包装类之间的
        <Text bold>自动装箱（autoboxing）与自动拆箱（unboxing）</Text>机制。
      </Paragraph>
    </Callout>

    <Heading3>1. 八大基本类型与包装类对照</Heading3>
    <Table
      head={['基本类型', '包装类', '父类']}
      rows={[
        ['byte', 'Byte', 'Number'],
        ['short', 'Short', 'Number'],
        ['int', 'Integer（注意不是 Int）', 'Number'],
        ['long', 'Long', 'Number'],
        ['float', 'Float', 'Number'],
        ['double', 'Double', 'Number'],
        ['char', 'Character（注意不是 Char）', 'Object'],
        ['boolean', 'Boolean', 'Object'],
      ]}
    />
    <Callout type="warning" title="两个特殊命名">
      包装类名基本是「基本类型首字母大写」，但有两个例外要记牢：
      <InlineCode>int → Integer</InlineCode>、<InlineCode>char → Character</InlineCode>。
      其余 6 个都是首字母大写（Byte/Short/Long/Float/Double/Boolean）。
    </Callout>

    <Heading3>2. 为什么需要包装类</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>集合只能装对象。</Text><InlineCode>List&lt;int&gt;</InlineCode> 非法，必须写
        <InlineCode>List&lt;Integer&gt;</InlineCode>。泛型只接受引用类型。
      </ListItem>
      <ListItem>
        <Text bold>提供实用方法。</Text>包装类带了大量静态工具方法，如
        <InlineCode>Integer.parseInt</InlineCode>、<InlineCode>Integer.MAX_VALUE</InlineCode>、进制转换等。
      </ListItem>
      <ListItem>
        <Text bold>可以表示 null。</Text>基本类型必须有值（int 默认 0），而包装类可以是
        <InlineCode>null</InlineCode>，能表达「没有值/未设置」（如数据库字段为空）。
      </ListItem>
    </UnorderedList>

    <Heading3>3. 手动装箱与拆箱（了解机制）</Heading3>
    <Paragraph>
      <Text bold>装箱</Text>：基本类型 → 包装对象；<Text bold>拆箱</Text>：包装对象 → 基本类型。
      早期需要手动调用方法：
    </Paragraph>
    <CodeBlock
      title="手动装箱/拆箱（旧写法）"
      code={`public class ManualBoxing {
    public static void main(String[] args) {
        // 手动装箱：int -> Integer
        Integer boxed = Integer.valueOf(100);

        // 手动拆箱：Integer -> int
        int unboxed = boxed.intValue();

        System.out.println("装箱: " + boxed);
        System.out.println("拆箱: " + unboxed);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`装箱: 100
拆箱: 100`} />
    <Callout type="note" title="构造方法已过时">
      <InlineCode>new Integer(100)</InlineCode> 这种构造方式从 JDK9 起被标记为
      <Text bold>@Deprecated</Text>（每次都创建新对象，浪费内存）。需要手动装箱请用
      <InlineCode>Integer.valueOf(100)</InlineCode>（有缓存，见下一节）。
    </Callout>

    <Heading3>4. 自动装箱与自动拆箱</Heading3>
    <Paragraph>
      JDK5 起，编译器会<Text bold>自动</Text>完成装箱拆箱，代码里可以像混用一样直接赋值，
      编译器在背后帮你插入 <InlineCode>valueOf</InlineCode> / <InlineCode>intValue</InlineCode>：
    </Paragraph>
    <CodeBlock
      title="自动装箱/拆箱"
      code={`import java.util.ArrayList;
import java.util.List;

public class AutoBoxing {
    public static void main(String[] args) {
        // 自动装箱：int 字面量 100 自动变 Integer
        Integer a = 100;

        // 自动拆箱：Integer 自动变 int 参与运算
        int b = a + 50;

        System.out.println("a = " + a);
        System.out.println("b = " + b);

        // 集合里最常见：add(int) 自动装箱，get() 后自动拆箱
        List<Integer> list = new ArrayList<>();
        list.add(1);          // 自动装箱
        list.add(2);
        int sum = list.get(0) + list.get(1);   // 自动拆箱
        System.out.println("sum = " + sum);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`a = 100
b = 150
sum = 3`}
    />
    <Callout type="tip" title="它只是「语法糖」">
      自动装箱拆箱是<Text bold>编译期</Text>帮你写好的代码：<InlineCode>Integer a = 100</InlineCode>
      实际是 <InlineCode>Integer a = Integer.valueOf(100)</InlineCode>；<InlineCode>int b = a</InlineCode>
      实际是 <InlineCode>int b = a.intValue()</InlineCode>。理解这点，才能看懂下一节的缓存陷阱与空指针问题。
    </Callout>

    <Heading3>5. 自动拆箱的空指针陷阱</Heading3>
    <Paragraph>
      既然拆箱实际是调用 <InlineCode>.intValue()</InlineCode>，那么对 <InlineCode>null</InlineCode> 拆箱
      就会抛 <InlineCode>NullPointerException</InlineCode>：
    </Paragraph>
    <CodeBlock
      title="拆箱 null 导致 NPE"
      code={`public class UnboxNPE {
    public static void main(String[] args) {
        Integer obj = null;
        try {
            int n = obj;        // 等价于 obj.intValue()，对 null 调方法 → NPE
            System.out.println(n);
        } catch (NullPointerException e) {
            System.out.println("拆箱 null 抛出了 NullPointerException");
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`拆箱 null 抛出了 NullPointerException`}
    />
    <Callout type="danger" title="包装类可能为 null，拆箱前要小心">
      这是企业开发的高频 bug：从数据库/接口拿到的 <InlineCode>Integer</InlineCode> 可能是
      <InlineCode>null</InlineCode>，一旦把它赋给 <InlineCode>int</InlineCode> 或参与运算（隐式拆箱），
      就会 NPE。涉及可能为 null 的包装类，拆箱前务必判空。
    </Callout>

    <Heading3>6. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>8 种基本类型各有包装类，特殊命名：<InlineCode>int→Integer</InlineCode>、<InlineCode>char→Character</InlineCode>。</ListItem>
        <ListItem>需要包装类的原因：集合/泛型只收对象、提供工具方法、可表示 null。</ListItem>
        <ListItem>装箱 = 基本→对象（<InlineCode>valueOf</InlineCode>），拆箱 = 对象→基本（<InlineCode>intValue</InlineCode>）。</ListItem>
        <ListItem>JDK5 起<Text bold>自动装箱拆箱</Text>，是编译期语法糖，集合存取时无处不在。</ListItem>
        <ListItem><Text bold>对 null 自动拆箱会抛 NPE</Text>——包装类参与运算前要判空。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：写出包装类名"
      code={`写出下列基本类型对应的包装类：
int、char、boolean、long、double、byte`}
      answerCode={`答案：
int     -> Integer   （特殊，不是 Int）
char    -> Character （特殊，不是 Char）
boolean -> Boolean
long    -> Long
double  -> Double
byte    -> Byte

解析：除 Integer、Character 外，其余都是「基本类型首字母大写」。这两个特殊命名是必背点。`}
    />

    <CodeBlock
      qa
      title="练习2：找出会抛 NPE 的代码"
      code={`import java.util.HashMap;
import java.util.Map;

public class Test {
    public static void main(String[] args) {
        Map<String, Integer> scores = new HashMap<>();
        scores.put("张三", 90);

        int li = scores.get("李四") + 10;   // 李四不存在
        System.out.println(li);
    }
}

问：这段代码会怎样？为什么？如何修复？`}
      answerCode={`答案：抛 NullPointerException。

原因：scores 里没有 "李四"，map.get("李四") 返回 null（Integer 类型）。
      "null + 10" 会触发自动拆箱 null.intValue()，对 null 调方法 → NPE。

修复方案（任选）：
① 先判空：
   Integer v = scores.get("李四");
   int li = (v == null ? 0 : v) + 10;
② 用 getOrDefault 给默认值：
   int li = scores.getOrDefault("李四", 0) + 10;

控制台输出（修复后）：10

解析：从 Map/数据库/接口拿到的包装类极可能是 null，参与运算（隐式拆箱）前必须处理 null。
      getOrDefault 是最优雅的方案。`}
    />

    <CodeBlock
      qa
      title="练习3：解释自动装箱拆箱发生在哪"
      code={`Integer a = 10;          // 第1处
int b = a;               // 第2处
Integer c = a + b;       // 第3处
list.add(5);             // 第4处（list 是 List<Integer>）

问：标出每一处发生的是「装箱」还是「拆箱」，并说明编译器实际做了什么。`}
      answerCode={`答案：
第1处 装箱：int 10 -> Integer。编译器：Integer a = Integer.valueOf(10);
第2处 拆箱：Integer -> int。     编译器：int b = a.intValue();
第3处 先拆箱再装箱：a + b 需要 a 拆箱成 int 做加法（a.intValue() + b），
      结果是 int 15，再装箱赋给 Integer c：Integer c = Integer.valueOf(15);
第4处 装箱：add 需要 Integer 参数，int 5 自动装箱：list.add(Integer.valueOf(5));

解析：凡是「基本类型出现在需要对象的位置」就装箱；「包装类出现在需要基本类型的位置（赋值给基本类型、参与算术/比较运算）」就拆箱。
      运算表达式里常常先拆箱算完再装箱。看穿这层语法糖，就能预判性能与 NPE 问题。`}
    />
  </article>
);

export default index;
