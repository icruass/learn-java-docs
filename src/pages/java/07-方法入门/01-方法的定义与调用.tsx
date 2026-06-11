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
    <Title>方法的定义与调用</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        随着程序规模变大，把所有逻辑都堆在 <InlineCode>main</InlineCode> 里会越来越难以阅读和维护。
        <Text bold>方法（Method）</Text>就是解决这个问题的利器——把一段独立的功能封装成一个"命名代码块"，
        需要时直接调用，避免重复，让 <InlineCode>main</InlineCode> 保持清晰。
        本节聚焦入门阶段最常用的写法：把方法和 <InlineCode>main</InlineCode> 并列写在同一个类里，
        统一加上 <InlineCode>public static</InlineCode> 修饰。
      </Paragraph>
    </Callout>

    <Heading3>1. 方法是什么</Heading3>
    <Paragraph>
      方法是一段<Text bold>有名字的、可被反复调用的代码块</Text>。
      定义一次，想用多少次就调用多少次，不需要复制粘贴同样的代码。
      好的方法只做一件事，名字能直接说明它在做什么，比如
      <InlineCode>printLine()</InlineCode>、<InlineCode>sum()</InlineCode>、
      <InlineCode>isEven()</InlineCode>。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>复用</Text>：同一段逻辑只写一遍，到处调用。
      </ListItem>
      <ListItem>
        <Text bold>分而治之</Text>：把大问题拆成小方法，每个方法只负责一件事，更容易测试和调试。
      </ListItem>
      <ListItem>
        <Text bold>让 main 更清晰</Text>：<InlineCode>main</InlineCode> 变成"指挥官"，只负责调度，
        具体细节交给各个方法去做。
      </ListItem>
    </UnorderedList>

    <Heading3>2. 方法的定义格式</Heading3>
    <Paragraph>
      入门阶段，方法和 <InlineCode>main</InlineCode> 一样写在类的内部、并列关系（不能嵌套），
      都加上 <InlineCode>public static</InlineCode> 修饰符。完整格式如下：
    </Paragraph>
    <CodeBlock
      language="text"
      title="方法定义格式"
      code={`public static 返回值类型 方法名(参数类型 参数名, ...) {
    // 方法体：要执行的代码
    return 返回值;   // 若返回值类型为 void，则省略或写 return;
}`}
    />
    <Table
      head={['部分', '说明']}
      rows={[
        [<InlineCode>public static</InlineCode>, '入门阶段固定写法，与 main 方法保持一致，后续章节再展开含义'],
        ['返回值类型', '方法执行完后"交还"给调用者的数据类型，如 int、double、boolean、String；不返回任何值则写 void'],
        ['方法名', '自起，遵循小驼峰命名法（首字母小写，后续单词首字母大写），如 calcSum、printLine'],
        ['参数列表', '调用时从外部传入的数据，格式为"类型 名字"，多个参数用逗号分隔；不需要参数则留空括号'],
        [<InlineCode>return 值</InlineCode>, '把结果返回给调用者，同时结束方法；void 方法可省略或写裸的 return; 提前退出'],
      ]}
    />
    <Callout type="warning" title="方法不能嵌套定义">
      Java 中<Text bold>方法内部不能再定义另一个方法</Text>。所有方法必须并列写在类的花括号内，
      彼此之间是平级关系，而不是包含关系。
    </Callout>

    <Heading3>3. 形参与实参</Heading3>
    <Paragraph>
      方法定义时括号里声明的变量叫<Text bold>形参（形式参数）</Text>，它只是占位符，没有具体值；
      调用方法时括号里传入的具体值叫<Text bold>实参（实际参数）</Text>。
      Java 会把实参的值<Text bold>复制</Text>给形参，方法内部修改形参不影响外部变量（基本类型的情况下）。
    </Paragraph>
    <Table
      head={['概念', '出现位置', '示例']}
      rows={[
        ['形参', '方法定义时的参数列表', 'public static int sum(int a, int b) — a、b 是形参'],
        ['实参', '调用方法时传入的具体值', 'sum(3, 5) — 3、5 是实参，分别传给 a、b'],
      ]}
    />

    <Heading3>4. return 的两重含义</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>返回结果</Text>：把方法计算出的值"交还"给调用者，
        调用处可以把它赋给变量或直接使用。
      </ListItem>
      <ListItem>
        <Text bold>结束方法</Text>：执行到 <InlineCode>return</InlineCode> 后，方法立即停止，
        <InlineCode>return</InlineCode> 之后的代码不会被执行。
        <InlineCode>void</InlineCode> 方法可以写裸的 <InlineCode>return;</InlineCode>
        来提前结束，例如在某个条件满足时直接退出，不再往下走。
      </ListItem>
    </OrderedList>
    <Callout type="danger" title="return 值的类型必须与返回值类型一致">
      声明 <InlineCode>int</InlineCode> 就必须 return 一个 <InlineCode>int</InlineCode>，
      声明 <InlineCode>boolean</InlineCode> 就必须 return <InlineCode>true</InlineCode> 或
      <InlineCode>false</InlineCode>。类型不匹配编译会直接报错。
    </Callout>
    <Callout type="warning" title="定义了不调用，方法就不会执行">
      方法只有被调用时才会运行。单纯写一个方法定义，如果 <InlineCode>main</InlineCode> 里从不调用它，
      那这段代码永远不会执行，但也不会报错。
    </Callout>

    <Heading3>5. 示例代码</Heading3>
    <Heading4>示例 1：有返回值的方法</Heading4>
    <Paragraph>
      定义 <InlineCode>sum</InlineCode> 方法接收两个整数、返回它们的和，在 <InlineCode>main</InlineCode> 里调用并打印结果。
    </Paragraph>
    <CodeBlock
      title="MethodDemo.java"
      code={`public class MethodDemo {

    // 定义方法：求两数之和，返回 int
    public static int sum(int a, int b) {
        return a + b;  // 计算结果并返回
    }

    public static void main(String[] args) {
        int result = sum(3, 5);          // 调用 sum，实参 3 和 5 传给形参 a 和 b
        System.out.println(result);      // 打印返回值

        System.out.println(sum(10, 20)); // 也可以直接把调用放进 println
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`8
30`} />
    <Paragraph>
      执行过程：调用 <InlineCode>sum(3, 5)</InlineCode> 时，实参 3 复制给形参
      <InlineCode>a</InlineCode>，实参 5 复制给形参 <InlineCode>b</InlineCode>，
      方法体执行 <InlineCode>a + b</InlineCode> 得 8，<InlineCode>return 8</InlineCode>
      把 8 交还给调用处，赋给变量 <InlineCode>result</InlineCode>。
    </Paragraph>

    <Heading4>示例 2：void 方法与提前 return</Heading4>
    <Paragraph>
      <InlineCode>printLine()</InlineCode> 打印一条分隔线，无需返回值；
      <InlineCode>printIfPositive()</InlineCode> 演示 <InlineCode>void</InlineCode> 方法用裸
      <InlineCode>return;</InlineCode> 提前结束。
    </Paragraph>
    <CodeBlock
      title="VoidMethodDemo.java"
      code={`public class VoidMethodDemo {

    // void 方法：打印分隔线，不返回任何值
    public static void printLine() {
        System.out.println("--------------------");
    }

    // void 方法：只打印正数，否则提前 return
    public static void printIfPositive(int n) {
        if (n <= 0) {
            return;  // 提前结束，后面的 println 不会执行
        }
        System.out.println("正数：" + n);
    }

    public static void main(String[] args) {
        printLine();
        printIfPositive(5);
        printIfPositive(-3);   // 小于等于 0，提前 return，什么都不打印
        printIfPositive(8);
        printLine();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`--------------------
正数：5
正数：8
--------------------`} />
    <Paragraph>
      当传入 <InlineCode>-3</InlineCode> 时，<InlineCode>n &lt;= 0</InlineCode> 为真，执行
      <InlineCode>return;</InlineCode>，方法立即结束，下面的
      <InlineCode>System.out.println</InlineCode> 不会被执行，所以控制台没有输出 <InlineCode>-3</InlineCode> 相关的行。
    </Paragraph>

    <Heading4>示例 3：综合——多个方法协作</Heading4>
    <CodeBlock
      title="MultiMethodDemo.java"
      code={`public class MultiMethodDemo {

    // 求两数之和
    public static int sum(int a, int b) {
        return a + b;
    }

    // 求两数之积
    public static int multiply(int a, int b) {
        return a * b;
    }

    // 打印格式化结果（void，调用上面两个方法）
    public static void printResult(int x, int y) {
        System.out.println(x + " + " + y + " = " + sum(x, y));
        System.out.println(x + " * " + y + " = " + multiply(x, y));
    }

    public static void main(String[] args) {
        printResult(3, 4);
        printLine();
        printResult(6, 7);
    }

    public static void printLine() {
        System.out.println("----------");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`3 + 4 = 7
3 * 4 = 12
----------
6 + 7 = 13
6 * 7 = 42`} />
    <Callout type="success" title="小结">
      <Paragraph>
        方法的核心要点：
      </Paragraph>
      <UnorderedList>
        <ListItem>定义格式：<InlineCode>public static 返回值类型 方法名(参数列表)</InlineCode> 加方法体。</ListItem>
        <ListItem>有返回值就用 <InlineCode>return 值;</InlineCode>；无返回值写 <InlineCode>void</InlineCode>。</ListItem>
        <ListItem>形参是占位符，实参是调用时传入的具体值；两者类型要匹配。</ListItem>
        <ListItem>方法定义了不调用就不执行；方法不能嵌套定义另一个方法。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>
    <CodeBlock
      qa
      title="练习 1：max —— 返回两数中的较大值"
      code={`// 要求：定义 max(int a, int b) 方法，返回 a 和 b 中较大的那个数。
// 在 main 里调用 max(10, 20) 和 max(99, 56)，分别打印结果。

public class Exercise01 {

    public static int max(int a, int b) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise01 {

    public static int max(int a, int b) {
        if (a >= b) {
            return a;
        } else {
            return b;
        }
        // 也可以用三元运算符一行搞定：return a >= b ? a : b;
    }

    public static void main(String[] args) {
        System.out.println(max(10, 20));  // 20
        System.out.println(max(99, 56));  // 99
    }
}

/* 控制台输出：
20
99
*/`}
    />
    <CodeBlock
      qa
      title="练习 2：isEven —— 判断一个整数是否为偶数"
      code={`// 要求：定义 isEven(int n) 方法，返回 boolean。
// 若 n 是偶数返回 true，奇数返回 false。
// 在 main 里测试 isEven(4)、isEven(7)、isEven(0)，打印结果。

public class Exercise02 {

    public static boolean isEven(int n) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {

    public static boolean isEven(int n) {
        return n % 2 == 0;  // 能被 2 整除即为偶数
    }

    public static void main(String[] args) {
        System.out.println(isEven(4));   // true
        System.out.println(isEven(7));   // false
        System.out.println(isEven(0));   // true（0 是偶数，0 % 2 == 0）
    }
}

/* 控制台输出：
true
false
true
*/`}
    />
    <CodeBlock
      qa
      title="练习 3：printRepeat —— void 方法，重复打印字符串"
      code={`// 要求：定义 printRepeat(String word, int times) 方法（void，无返回值）。
// 循环打印 word 共 times 次，每次独占一行。
// 若 times <= 0，直接提前 return，什么都不打印。
// 在 main 里调用 printRepeat("Java", 3) 和 printRepeat("Hi", 0)。

public class Exercise03 {

    public static void printRepeat(String word, int times) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {

    public static void printRepeat(String word, int times) {
        if (times <= 0) {
            return;  // 提前结束，什么都不做
        }
        for (int i = 0; i < times; i++) {
            System.out.println(word);
        }
    }

    public static void main(String[] args) {
        printRepeat("Java", 3);
        printRepeat("Hi", 0);   // times=0，提前 return，无输出
    }
}

/* 控制台输出：
Java
Java
Java
（printRepeat("Hi", 0) 没有任何输出）
*/`}
    />
  </article>
);

export default index;
