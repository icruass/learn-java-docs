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
    <Title>泛型方法与泛型接口</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节的泛型类，类型参数作用于<Text bold>整个类</Text>。但有时我们只想让<Text bold>某个方法</Text>
        具备泛型能力，或者让<Text bold>接口</Text>支持类型参数。本节讲解<Text bold>泛型方法</Text>
        （类型参数写在返回值前）和<Text bold>泛型接口</Text>（两种实现方式），
        并辨析它们与泛型类的区别。
      </Paragraph>
    </Callout>

    <Heading3>1. 泛型方法的定义</Heading3>
    <Paragraph>
      泛型方法在<Text bold>返回值类型前面</Text>声明类型参数 <InlineCode>&lt;T&gt;</InlineCode>，
      表示「这个方法独立拥有一个类型参数」。它<Text bold>不依赖类是否是泛型类</Text>，
      普通类里也能写泛型方法。语法：
    </Paragraph>
    <CodeBlock
      language="text"
      title="泛型方法语法"
      code={`修饰符 <类型参数> 返回值类型 方法名(参数列表) {
    ...
}

// 例：<T> 紧跟在 static 之后、返回值 T 之前
public static <T> T pick(T[] arr, int i) { ... }`}
    />
    <CodeBlock
      title="泛型方法示例"
      code={`public class GenericMethod {
    // 泛型方法：打印任意类型的数组
    public static <T> void printArray(T[] arr) {
        for (T e : arr) {
            System.out.print(e + " ");
        }
        System.out.println();
    }

    // 泛型方法：返回数组的第一个元素
    public static <T> T first(T[] arr) {
        return arr[0];
    }

    public static void main(String[] args) {
        String[] words = {"a", "b", "c"};
        Integer[] nums = {1, 2, 3};

        printArray(words);   // T 自动推断为 String
        printArray(nums);    // T 自动推断为 Integer

        String f1 = first(words);
        Integer f2 = first(nums);
        System.out.println("首元素: " + f1 + ", " + f2);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`a b c
1 2 3
首元素: a, 1`}
    />
    <Callout type="tip" title="类型参数靠调用自动推断">
      调用泛型方法时<Text bold>不需要手动指定类型</Text>，编译器会根据传入的实参自动推断
      （<InlineCode>printArray(words)</InlineCode> 推断出 T=String）。
      必要时也可显式指定：<InlineCode>GenericMethod.&lt;String&gt;first(words)</InlineCode>，但很少这么写。
    </Callout>

    <Heading3>2. 泛型方法 vs 泛型类里的方法</Heading3>
    <Paragraph>
      这是个常见混淆点。注意区分：<Text bold>方法前有没有自己的 </Text><InlineCode>&lt;T&gt;</InlineCode> 声明。
    </Paragraph>
    <CodeBlock
      title="辨析"
      code={`class Box<T> {                       // 泛型类，T 属于整个类
    private T value;

    // ① 这不是泛型方法！它用的是类的 T
    public T getValue() { return value; }

    // ② 这才是泛型方法！它有自己独立的 <E>，与类的 T 无关
    public <E> void show(E e) {
        System.out.println(e);
    }
}`}
    />
    <Table
      head={['区别', '泛型类的方法', '泛型方法']}
      rows={[
        ['类型参数声明位置', '在类名后（class Box<T>）', '在方法返回值前（<E> void）'],
        ['作用范围', '整个类共享同一个 T', '仅该方法独有'],
        ['确定时机', '创建对象时（new Box<String>）', '调用方法时自动推断'],
        ['静态方法能否用', '不能用类的 T（static 方法）', '可以，泛型方法常配 static'],
      ]}
    />
    <Callout type="warning" title="静态方法要用泛型，只能是泛型方法">
      泛型类的类型参数 <InlineCode>T</InlineCode> 属于「对象」，而静态方法不依附对象，
      所以<Text bold>静态方法不能使用类的 T</Text>。静态方法想用泛型，必须自己声明成泛型方法
      （如 <InlineCode>public static &lt;T&gt; ...</InlineCode>）。
    </Callout>

    <Heading3>3. 泛型接口的定义</Heading3>
    <Paragraph>
      接口也能带类型参数，称泛型接口。最典型的就是我们用过的
      <InlineCode>Comparable&lt;T&gt;</InlineCode>、<InlineCode>List&lt;E&gt;</InlineCode>。定义语法与泛型类一致：
    </Paragraph>
    <CodeBlock
      title="定义泛型接口"
      code={`interface Container<T> {
    void put(T item);
    T get();
}`}
    />

    <Heading3>4. 实现泛型接口的两种方式</Heading3>
    <Heading4>方式一：实现时确定具体类型</Heading4>
    <CodeBlock
      title="实现类直接指定类型"
      code={`interface Container<T> {
    void put(T item);
    T get();
}

// 实现时就把 T 定死为 String
class StringContainer implements Container<String> {
    private String item;
    public void put(String item) { this.item = item; }
    public String get() { return item; }
}

public class Demo1 {
    public static void main(String[] args) {
        StringContainer c = new StringContainer();
        c.put("hello");
        System.out.println(c.get());
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`hello`} />

    <Heading4>方式二：实现类仍保持泛型</Heading4>
    <CodeBlock
      title="实现类继续把类型参数往外传"
      code={`interface Container<T> {
    void put(T item);
    T get();
}

// 实现类自己也是泛型类，把 T 继续开放给使用者
class MyContainer<T> implements Container<T> {
    private T item;
    public void put(T item) { this.item = item; }
    public T get() { return item; }
}

public class Demo2 {
    public static void main(String[] args) {
        MyContainer<Integer> c = new MyContainer<>();
        c.put(100);
        int n = c.get();
        System.out.println(n);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`100`} />
    <Table
      head={['方式', '实现类写法', '特点']}
      rows={[
        ['确定类型', 'implements Container<String>', '该实现类只服务一种类型'],
        ['保持泛型', 'class MyContainer<T> implements Container<T>', '通用，使用时再定类型'],
      ]}
    />

    <Heading3>5. 综合示例：泛型方法 + 泛型接口</Heading3>
    <CodeBlock
      title="找出数组最大值（泛型方法 + Comparable）"
      code={`public class MaxFinder {
    // 限定 T 必须可比较（Comparable），才能调用 compareTo
    public static <T extends Comparable<T>> T max(T[] arr) {
        T maxVal = arr[0];
        for (T e : arr) {
            if (e.compareTo(maxVal) > 0) {
                maxVal = e;
            }
        }
        return maxVal;
    }

    public static void main(String[] args) {
        Integer[] nums = {3, 9, 1, 7};
        String[] words = {"banana", "apple", "cherry"};

        System.out.println("最大数字: " + max(nums));
        System.out.println("最大字符串: " + max(words));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`最大数字: 9
最大字符串: cherry`}
    />
    <Callout type="tip" title="预告：有界类型参数 extends">
      上例 <InlineCode>&lt;T extends Comparable&lt;T&gt;&gt;</InlineCode> 给类型参数加了「上界」，
      要求 T 必须实现 <InlineCode>Comparable</InlineCode>，这样才能在方法里调用 <InlineCode>compareTo</InlineCode>。
      这就是「有界类型参数」，下一节的通配符会进一步展开。
    </Callout>

    <Heading3>6. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>泛型方法：类型参数声明在<Text bold>返回值前</Text>（<InlineCode>&lt;T&gt; 返回值 方法名</InlineCode>），调用时自动推断。</ListItem>
        <ListItem>泛型方法独立于类，普通类里也能有；<Text bold>静态方法要用泛型必须是泛型方法</Text>。</ListItem>
        <ListItem>区分「泛型类的方法（用类的 T）」与「泛型方法（方法自己声明 T）」。</ListItem>
        <ListItem>泛型接口实现两种方式：实现时定死类型，或实现类继续保持泛型。</ListItem>
        <ListItem><InlineCode>&lt;T extends Comparable&lt;T&gt;&gt;</InlineCode> 可给类型参数加上界，扩展可调用的方法。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：辨认泛型方法"
      code={`下面哪些是「泛型方法」？说明理由。
class Holder<T> {
    T value;
    A:  public T get() { return value; }
    B:  public <E> E echo(E e) { return e; }
    C:  public static <K> void log(K k) { System.out.println(k); }
    D:  public void set(T t) { this.value = t; }
}`}
      answerCode={`答案：B 和 C 是泛型方法；A 和 D 不是。

理由：判断标准是「方法返回值前是否有自己的 <类型参数> 声明」。
- A get()：用的是类的 T，没有自己的 <>，不是泛型方法。
- B echo()：方法前有 <E>，是泛型方法。
- C log()：方法前有 <K>，是泛型方法（且是 static——静态方法要用泛型只能这样写）。
- D set()：用的是类的 T，不是泛型方法。`}
    />

    <CodeBlock
      qa
      title="练习2：写一个泛型方法交换数组两个元素"
      code={`// 写泛型方法 swap，交换数组中下标 i、j 的元素，适用于任意类型数组。
// 验证：String[] 和 Integer[] 各交换一次。

import java.util.Arrays;

public class Test {
    public static void main(String[] args) {
        String[] s = {"a", "b", "c"};
        Integer[] n = {1, 2, 3};
        // 调用 swap 交换 s 的 0 和 2、n 的 0 和 1
        System.out.println(Arrays.toString(s));
        System.out.println(Arrays.toString(n));
    }
}`}
      answerCode={`import java.util.Arrays;

public class Test {
    public static <T> void swap(T[] arr, int i, int j) {
        T tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    public static void main(String[] args) {
        String[] s = {"a", "b", "c"};
        Integer[] n = {1, 2, 3};

        swap(s, 0, 2);
        swap(n, 0, 1);

        System.out.println(Arrays.toString(s));
        System.out.println(Arrays.toString(n));
    }
}

/* 控制台输出：
[c, b, a]
[2, 1, 3]

解析：<T> 声明在返回值 void 前，使 swap 适用于任意引用类型数组。
      调用时 T 由实参自动推断（String[] → T=String，Integer[] → T=Integer），无需手动指定。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：实现泛型接口"
      code={`// 给定泛型接口 Stack<T>（push/pop/isEmpty），
// 用 ArrayList 实现一个保持泛型的 ArrayStack<T>，并验证存取 String。

import java.util.ArrayList;

interface Stack<T> {
    void push(T t);
    T pop();
    boolean isEmpty();
}

public class Test {
    public static void main(String[] args) {
        // 期望输出：
        // C
        // B
    }
}`}
      answerCode={`import java.util.ArrayList;

interface Stack<T> {
    void push(T t);
    T pop();
    boolean isEmpty();
}

class ArrayStack<T> implements Stack<T> {
    private ArrayList<T> data = new ArrayList<>();

    public void push(T t) { data.add(t); }

    public T pop() {
        return data.remove(data.size() - 1);   // 移除并返回末尾（栈顶）
    }

    public boolean isEmpty() { return data.isEmpty(); }
}

public class Test {
    public static void main(String[] args) {
        Stack<String> stack = new ArrayStack<>();
        stack.push("A");
        stack.push("B");
        stack.push("C");
        System.out.println(stack.pop());   // C（后进先出）
        System.out.println(stack.pop());   // B
    }
}

/* 控制台输出：
C
B

解析：ArrayStack<T> 采用「保持泛型」的实现方式（class ArrayStack<T> implements Stack<T>），
      把类型参数继续开放给使用者，因此能 new ArrayStack<String> 也能换成别的类型。
      底层用 ArrayList<T> 存储，push=add 到末尾，pop=remove 末尾，实现后进先出。
*/`}
    />
  </article>
);

export default index;
