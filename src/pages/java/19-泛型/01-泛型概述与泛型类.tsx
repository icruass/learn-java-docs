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
    <Title>泛型概述与泛型类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        你在集合里早就见过 <InlineCode>List&lt;String&gt;</InlineCode> 这样的写法，那个尖括号里的就是
        <Text bold>泛型</Text>。泛型（Generics）是 JDK5 引入的「类型参数化」机制——
        让类、接口、方法在定义时不写死类型，使用时再指定。本节先讲清<Text bold>为什么需要泛型</Text>
        （类型安全 + 免强转），再讲如何定义和使用<Text bold>泛型类</Text>。
      </Paragraph>
    </Callout>

    <Heading3>1. 没有泛型的痛点</Heading3>
    <Paragraph>
      JDK5 之前，集合只能存 <InlineCode>Object</InlineCode>，取出时必须强转，且编译器无法帮你检查类型：
    </Paragraph>
    <CodeBlock
      title="没有泛型的隐患"
      code={`import java.util.ArrayList;

public class NoGeneric {
    public static void main(String[] args) {
        ArrayList list = new ArrayList();   // 不写泛型
        list.add("hello");
        list.add(123);          // 居然也能加进去，类型混乱

        String s = (String) list.get(0);    // 取出必须强转
        String s2 = (String) list.get(1);   // 运行时才崩：ClassCastException
        System.out.println(s2);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（运行时异常）"
      code={`Exception in thread "main" java.lang.ClassCastException:
  class java.lang.Integer cannot be cast to class java.lang.String`}
    />
    <Callout type="warning" title="问题本质：错误被推迟到运行时">
      没有泛型时，类型错误编译期发现不了，只能等运行时 <InlineCode>ClassCastException</InlineCode> 爆出来，
      难以排查。泛型的核心价值就是<Text bold>把类型检查提前到编译期</Text>。
    </Callout>

    <Heading3>2. 用了泛型之后</Heading3>
    <CodeBlock
      title="有泛型的安全"
      code={`import java.util.ArrayList;

public class WithGeneric {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();  // 指定只存 String
        list.add("hello");
        // list.add(123);    // 编译期直接报错，加不进去

        String s = list.get(0);   // 无需强转，直接得到 String
        System.out.println("取出: " + s + "，长度: " + s.length());
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`取出: hello，长度: 5`} />
    <Table
      head={['对比', '无泛型', '有泛型']}
      rows={[
        ['类型检查', '运行时（晚）', '编译期（早）'],
        ['取值', '必须强转', '自动是目标类型'],
        ['安全性', '易抛 ClassCastException', '编译期拦截错误'],
        ['可读性', '不知道集合装什么', '一眼看出元素类型'],
      ]}
    />

    <Heading3>3. 定义泛型类</Heading3>
    <Paragraph>
      在类名后面加 <InlineCode>&lt;类型参数&gt;</InlineCode> 就成了泛型类。类型参数是个「占位符」，
      创建对象时才被替换成具体类型。语法：
    </Paragraph>
    <CodeBlock
      language="text"
      title="泛型类语法"
      code={`修饰符 class 类名<类型参数> {
    // 类型参数可在类内当作一种类型使用
}

// 类型参数命名是约定俗成（大写单字母）：
//   T —— Type（类型）
//   E —— Element（元素，集合常用）
//   K / V —— Key / Value（键值，Map 常用）
//   N —— Number（数字）`}
    />
    <CodeBlock
      title="自定义泛型类 Box"
      code={`// T 是类型参数，代表「装什么类型」由使用者决定
class Box<T> {
    private T content;          // 用 T 作为字段类型

    public void set(T content) { this.content = content; }
    public T get() { return content; }
}

public class BoxDemo {
    public static void main(String[] args) {
        // 装字符串
        Box<String> sBox = new Box<>();
        sBox.set("Java");
        String s = sBox.get();         // 直接是 String
        System.out.println("字符串盒子: " + s);

        // 装整数
        Box<Integer> iBox = new Box<>();
        iBox.set(100);
        int n = iBox.get();            // 直接是 Integer，自动拆箱
        System.out.println("整数盒子: " + n);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`字符串盒子: Java
整数盒子: 100`}
    />
    <Callout type="tip" title="一次定义，多种类型复用">
      <InlineCode>Box&lt;T&gt;</InlineCode> 只写一次，就能安全地装字符串、整数、甚至自定义对象。
      这正是泛型「代码复用 + 类型安全」兼得的体现——不必为每种类型写一个 <InlineCode>StringBox</InlineCode>、
      <InlineCode>IntBox</InlineCode>。
    </Callout>

    <Heading3>4. 多个类型参数</Heading3>
    <Paragraph>
      泛型类可以有多个类型参数，用逗号分隔。比如模拟一对键值：
    </Paragraph>
    <CodeBlock
      title="多类型参数 Pair"
      code={`class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }
    public K getKey() { return key; }
    public V getValue() { return value; }

    @Override
    public String toString() {
        return "(" + key + " = " + value + ")";
    }
}

public class PairDemo {
    public static void main(String[] args) {
        Pair<String, Integer> p1 = new Pair<>("年龄", 20);
        Pair<Integer, String> p2 = new Pair<>(1, "第一名");
        System.out.println(p1);
        System.out.println(p2);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`(年龄 = 20)
(第一名... 等)`}
    />
    <CodeBlock language="text" title="实际控制台输出" code={`(年龄 = 20)
(1 = 第一名)`} />

    <Heading3>5. 钻石操作符 &lt;&gt;</Heading3>
    <Paragraph>
      JDK7 起，<InlineCode>new</InlineCode> 右边的泛型可以省略，写成空尖括号 <InlineCode>&lt;&gt;</InlineCode>
      （称「钻石操作符」），编译器会根据左边自动推断：
    </Paragraph>
    <CodeBlock
      title="钻石操作符"
      code={`// JDK7 之前：两边都要写全
Box<String> b1 = new Box<String>();
// JDK7 起：右边用 <> 即可，自动推断为 String
Box<String> b2 = new Box<>();`}
    />
    <Callout type="warning" title="泛型只能是引用类型">
      尖括号里只能填<Text bold>引用类型</Text>，不能填基本类型。要装 int 必须写
      <InlineCode>Box&lt;Integer&gt;</InlineCode>（用包装类），不能写 <InlineCode>Box&lt;int&gt;</InlineCode>。
      存取时由自动装箱/拆箱机制衔接。
    </Callout>

    <Heading3>6. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>泛型 = 类型参数化，把类型检查从运行时提前到<Text bold>编译期</Text>。</ListItem>
        <ListItem>好处：类型安全（加错类型编译报错）+ 取值免强转 + 代码可复用。</ListItem>
        <ListItem>泛型类：<InlineCode>class 类名&lt;T&gt;</InlineCode>，T 在类内当类型用，创建对象时指定。</ListItem>
        <ListItem>常用参数名：<InlineCode>T/E/K/V/N</InlineCode>；可有多个，如 <InlineCode>Pair&lt;K, V&gt;</InlineCode>。</ListItem>
        <ListItem>泛型只能是引用类型；JDK7 起 new 右边可用钻石操作符 <InlineCode>&lt;&gt;</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断对错"
      code={`① 泛型能让类型错误在运行时才暴露。
② Box<int> 是合法的写法。
③ ArrayList<String> 取出元素不需要强制类型转换。
④ 一个泛型类只能有一个类型参数。`}
      answerCode={`答案：
① 错。恰恰相反，泛型把类型检查提前到编译期，让错误在编译时就暴露。
② 错。泛型只能用引用类型，int 要写成 Integer：Box<Integer>。
③ 对。声明了元素类型为 String，get() 直接返回 String，无需强转。
④ 错。可以有多个，如 Pair<K, V>、Map<K, V>，用逗号分隔。`}
    />

    <CodeBlock
      qa
      title="练习2：自定义一个泛型容器"
      code={`// 定义泛型类 MyContainer<T>，能存一个元素，提供 put/take 方法，
// 并有 isEmpty() 判断是否为空（取走后置空）。
// 用它分别存 String 和 Double 验证。

public class Test {
    public static void main(String[] args) {
        // 期望：
        // 容器为空? true
        // 取出: hello
        // 取出: 3.14
    }
}`}
      answerCode={`class MyContainer<T> {
    private T item;

    public void put(T item) { this.item = item; }

    public T take() {
        T tmp = item;
        item = null;       // 取走后置空
        return tmp;
    }

    public boolean isEmpty() { return item == null; }
}

public class Test {
    public static void main(String[] args) {
        MyContainer<String> c = new MyContainer<>();
        System.out.println("容器为空? " + c.isEmpty());

        c.put("hello");
        System.out.println("取出: " + c.take());

        MyContainer<Double> d = new MyContainer<>();
        d.put(3.14);
        System.out.println("取出: " + d.take());
    }
}

/* 控制台输出：
容器为空? true
取出: hello
取出: 3.14

解析：T 作为字段、参数、返回值类型贯穿全类。同一个 MyContainer<T> 既能装 String 又能装 Double，
      类型安全且无需强转——这就是泛型类的复用价值。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：用泛型重构存在隐患的代码"
      code={`// 下面代码有类型隐患，请用泛型改写 ScoreList，使其只能存 Integer，
// 并去掉强制转换。

import java.util.ArrayList;

class ScoreList {
    private ArrayList list = new ArrayList();   // 未用泛型
    public void add(Object o) { list.add(o); }
    public Object get(int i) { return list.get(i); }
}

public class Test {
    public static void main(String[] args) {
        ScoreList sl = new ScoreList();
        sl.add(90);
        int score = (int) sl.get(0);    // 需强转
        System.out.println(score);
    }
}`}
      answerCode={`import java.util.ArrayList;

class ScoreList {
    private ArrayList<Integer> list = new ArrayList<>();  // 指定 Integer
    public void add(Integer o) { list.add(o); }
    public Integer get(int i) { return list.get(i); }
}

public class Test {
    public static void main(String[] args) {
        ScoreList sl = new ScoreList();
        sl.add(90);
        // sl.add("abc");   // 现在加字符串会编译报错
        int score = sl.get(0);    // 无需强转
        System.out.println(score);
    }
}

/* 控制台输出：
90

解析：把内部 ArrayList 指定为 ArrayList<Integer>，方法参数/返回值也用 Integer，
      既阻止了加入非整数（编译期拦截），又去掉了强转。
      进阶：还可把 ScoreList 本身设计成泛型类 class ScoreList<T>，通用性更强。
*/`}
    />
  </article>
);

export default index;
