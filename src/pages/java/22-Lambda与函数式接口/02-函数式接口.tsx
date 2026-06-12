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
    <Title>函数式接口</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节说「Lambda 只能赋给函数式接口」。那什么是函数式接口？本节给出严格定义、
        讲解 <InlineCode>@FunctionalInterface</InlineCode> 注解的作用、它与默认方法/静态方法如何共存，
        并演示如何<Text bold>自定义函数式接口</Text>、把它作为方法参数来传递行为——
        这是理解 Stream、回调、策略等一切「函数式风格」代码的钥匙。
      </Paragraph>
    </Callout>

    <Heading3>1. 函数式接口的定义</Heading3>
    <Callout type="tip" title="一句话定义">
      <Text bold>有且仅有一个抽象方法</Text>的接口，就是函数式接口（Functional Interface）。
      正因为只有一个抽象方法，Lambda 才能「无歧义」地对应它——Lambda 实现的就是那唯一的抽象方法。
    </Callout>
    <Paragraph>
      你早就用过的函数式接口：<InlineCode>Runnable</InlineCode>（唯一抽象方法 <InlineCode>run</InlineCode>）、
      <InlineCode>Comparator</InlineCode>（<InlineCode>compare</InlineCode>）、
      <InlineCode>Comparable</InlineCode>（<InlineCode>compareTo</InlineCode>）。
    </Paragraph>

    <Heading3>2. @FunctionalInterface 注解</Heading3>
    <Paragraph>
      在接口上加 <InlineCode>@FunctionalInterface</InlineCode> 注解，让编译器<Text bold>强制校验</Text>
      它是否真的只有一个抽象方法。若不满足，编译报错。它类似 <InlineCode>@Override</InlineCode>——
      不写也行，但写了能防止你不小心加错方法。
    </Paragraph>
    <CodeBlock
      title="自定义函数式接口"
      code={`@FunctionalInterface
interface Calculator {
    int calc(int a, int b);     // 唯一的抽象方法

    // 若再加一个抽象方法，编译器会在这里报错：
    // int other();   // ← 取消注释会导致编译失败
}

public class FuncInterfaceDemo {
    public static void main(String[] args) {
        // 用 Lambda 实现这个接口
        Calculator add = (a, b) -> a + b;
        Calculator mul = (a, b) -> a * b;

        System.out.println("加: " + add.calc(3, 5));
        System.out.println("乘: " + mul.calc(3, 5));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`加: 8
乘: 15`}
    />
    <Callout type="warning" title="注解是「校验」而非「定义」">
      不加 <InlineCode>@FunctionalInterface</InlineCode>，只要接口实际只有一个抽象方法，
      它<Text bold>仍然是</Text>函数式接口，照样能用 Lambda。注解的价值是<Text bold>把约束显式化</Text>，
      让团队成员日后误加抽象方法时立刻编译报错。建议给打算配 Lambda 用的接口都加上。
    </Callout>

    <Heading3>3. 函数式接口可以有默认方法和静态方法</Heading3>
    <Paragraph>
      「只有一个抽象方法」指的是<Text bold>抽象方法</Text>。接口里的 <InlineCode>default</InlineCode>
      默认方法、<InlineCode>static</InlineCode> 静态方法<Text bold>不算</Text>，可以有任意多个，
      仍是函数式接口：
    </Paragraph>
    <CodeBlock
      title="带默认方法的函数式接口"
      code={`@FunctionalInterface
interface Greeting {
    String say(String name);          // 唯一抽象方法

    // 默认方法：不影响「函数式」身份
    default void greetLoudly(String name) {
        System.out.println(say(name).toUpperCase());
    }

    // 静态方法：也不影响
    static Greeting chinese() {
        return name -> "你好, " + name;
    }
}

public class DefaultMethodDemo {
    public static void main(String[] args) {
        Greeting g = name -> "Hello, " + name;   // Lambda 只需实现 say
        System.out.println(g.say("Tom"));
        g.greetLoudly("Tom");                     // 调用默认方法
        System.out.println(Greeting.chinese().say("小明")); // 调用静态方法
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`Hello, Tom
HELLO, TOM
你好, 小明`}
    />

    <Heading3>4. 把函数式接口作为方法参数——传递「行为」</Heading3>
    <Paragraph>
      这是函数式编程的精髓：方法参数不再只是「数据」，还可以是「<Text bold>一段行为</Text>」。
      调用者用 Lambda 把逻辑「注入」进来：
    </Paragraph>
    <CodeBlock
      title="行为参数化"
      code={`@FunctionalInterface
interface IntCondition {
    boolean test(int n);    // 给一个数，返回是否满足条件
}

public class BehaviorParam {
    // 方法接收一个「条件」，打印数组里满足条件的元素
    static void printIf(int[] arr, IntCondition cond) {
        for (int n : arr) {
            if (cond.test(n)) {
                System.out.print(n + " ");
            }
        }
        System.out.println();
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5, 6};

        System.out.print("偶数: ");
        printIf(arr, n -> n % 2 == 0);     // 传入「是偶数」这个行为

        System.out.print("大于3: ");
        printIf(arr, n -> n > 3);          // 传入「大于3」这个行为
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`偶数: 2 4 6
大于3: 4 5 6`}
    />
    <Callout type="tip" title="同一个方法，行为可换">
      <InlineCode>printIf</InlineCode> 的循环逻辑只写一次，「筛选条件」由调用者用 Lambda 传入。
      想换条件不用改 <InlineCode>printIf</InlineCode>，只换那行 Lambda 即可——这就是
      <Text bold>行为参数化</Text>，也是 Stream 的 <InlineCode>filter</InlineCode> 的工作原理。
    </Callout>

    <Heading3>5. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>函数式接口 = <Text bold>有且仅有一个抽象方法</Text>的接口，是 Lambda 的目标类型。</ListItem>
        <ListItem><InlineCode>@FunctionalInterface</InlineCode> 让编译器<Text bold>强制校验</Text>，不写也不影响其函数式身份。</ListItem>
        <ListItem>函数式接口里可以有任意多个 <InlineCode>default</InlineCode> 默认方法和 <InlineCode>static</InlineCode> 静态方法。</ListItem>
        <ListItem>把函数式接口作为参数，可实现<Text bold>行为参数化</Text>——把逻辑当数据传递。</ListItem>
        <ListItem>常见内置函数式接口将在下一节系统讲解。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断是否函数式接口"
      code={`判断下列接口是否为函数式接口（能否加 @FunctionalInterface）：
A: interface A { void f(); default void g(){} static void h(){} }
B: interface B { void f(); void g(); }
C: interface C { default void f(){} }
D: interface D { void f(); }   // 继承自 Object 的方法不算？`}
      answerCode={`答案：
A 是。只有 1 个抽象方法 f()，default/static 不计入，是函数式接口。
B 不是。有 2 个抽象方法 f()、g()。
C 不是。没有抽象方法（f 是 default，有实现）。
D 是。唯一抽象方法 f()。补充：接口中声明的与 Object 的 public 方法同签名的方法（如 equals/toString）
   不计入抽象方法数，所以即使写了也仍可能是函数式接口。

解析：判定只看「抽象方法」的个数是否恰为 1，default/static/Object 同签名方法都不算。`}
    />

    <CodeBlock
      qa
      title="练习2：自定义函数式接口实现字符串处理"
      code={`// 定义函数式接口 StringHandler，有方法 String handle(String s)。
// 写一个方法 process(String, StringHandler) 应用处理逻辑。
// 用它分别实现「转大写」和「加感叹号」。

public class Test {
    public static void main(String[] args) {
        // 期望：
        // HELLO
        // hello!
    }
}`}
      answerCode={`@FunctionalInterface
interface StringHandler {
    String handle(String s);
}

public class Test {
    static String process(String input, StringHandler handler) {
        return handler.handle(input);
    }

    public static void main(String[] args) {
        System.out.println(process("hello", s -> s.toUpperCase()));
        System.out.println(process("hello", s -> s + "!"));
    }
}

/* 控制台输出：
HELLO
hello!

解析：StringHandler 是单抽象方法接口，process 接收它作为「行为参数」。
      调用时用不同 Lambda 注入不同处理逻辑，process 本身无需改动——行为参数化。
      这正是 Stream 中 map(s -> ...) 的雏形。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：行为参数化求和"
      code={`// 写方法 sumWhere(int[], IntCondition)，对数组中满足条件的元素求和。
// 用它求：① 所有偶数之和 ② 所有大于2的数之和
// 数组 {1,2,3,4,5}
// 预期：偶数和=6，大于2之和=12

@FunctionalInterface
interface IntCondition {
    boolean test(int n);
}

public class Test {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        // 补全 sumWhere 与调用
    }
}`}
      answerCode={`@FunctionalInterface
interface IntCondition {
    boolean test(int n);
}

public class Test {
    static int sumWhere(int[] arr, IntCondition cond) {
        int sum = 0;
        for (int n : arr) {
            if (cond.test(n)) sum += n;
        }
        return sum;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        System.out.println("偶数和=" + sumWhere(arr, n -> n % 2 == 0));
        System.out.println("大于2之和=" + sumWhere(arr, n -> n > 2));
    }
}

/* 控制台输出：
偶数和=6
大于2之和=12

解析：sumWhere 的累加逻辑固定，筛选条件由 IntCondition 这个函数式接口注入。
      偶数：2+4=6；大于2：3+4+5=12。换条件只改 Lambda，不动方法体。
*/`}
    />
  </article>
);

export default index;
