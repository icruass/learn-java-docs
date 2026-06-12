import React from 'react';
import {
  Title,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>方法的注意事项</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        方法在使用过程中有六个高频"踩坑点"：
        不能嵌套定义、定义顺序不影响调用、void 不能参与打印/赋值、
        return 之后不能有可达代码、有返回值方法必须保证所有分支都 return、
        void 方法可以用裸 <InlineCode>return;</InlineCode> 提前结束。
        每一条都配反例和正例，帮你彻底规避编译错误。
      </Paragraph>
    </Callout>

    <Heading3>1. 方法不能嵌套定义</Heading3>
    <Paragraph>
      Java 中<Text bold>方法内部不能再定义另一个方法</Text>。
      所有方法必须直接写在类的花括号内，彼此并列，不存在嵌套包含关系。
    </Paragraph>
    <Callout type="danger" title="方法内部定义方法——编译报错">
      <CodeBlock
        title="错误示范（无法编译）"
        code={`public class NestError {
    public static void outer() {
        System.out.println("outer");

        // 错误：在方法体内定义方法，Java 不允许
        public static void inner() {
            System.out.println("inner");
        }
    }
}`}
      />
      <CodeBlock
        title="正确写法（并列定义）"
        code={`public class NestOk {

    public static void outer() {
        System.out.println("outer");
        inner();   // 调用另一个方法
    }

    // 并列定义在类内，而不是写在 outer 里面
    public static void inner() {
        System.out.println("inner");
    }

    public static void main(String[] args) {
        outer();
    }
}`}
      />
    </Callout>
    <CodeBlock language="text" title="控制台输出" code={`outer
inner`} />

    <Heading3>2. 方法定义的先后顺序不影响调用</Heading3>
    <Paragraph>
      Java 编译器在编译整个类时，会把所有方法都"登记"好，
      因此<Text bold>方法可以在定义之前被调用</Text>，定义的位置（前/后）不影响运行结果。
      这一点与某些语言（如 C 语言需要前置声明）不同。
    </Paragraph>
    <CodeBlock
      title="OrderDemo.java"
      code={`public class OrderDemo {

    // main 写在前面，但它调用的 greet 和 printLine 定义在后面
    public static void main(String[] args) {
        greet("小明");   // greet 定义在 main 后面，依然可以调用
        printLine();     // 同上
    }

    public static void greet(String name) {
        System.out.println("你好，" + name);
    }

    public static void printLine() {
        System.out.println("----------");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`你好，小明
----------`} />
    <Callout type="tip" title="惯例写法建议">
      虽然顺序不影响功能，但团队中通常有一个惯例：
      要么把 <InlineCode>main</InlineCode> 放在最前（方便找入口），
      要么放在最后（先看工具方法再看入口）。选一种风格保持一致即可。
    </Callout>

    <Heading3>3. void 方法不能参与打印调用和赋值调用</Heading3>
    <Paragraph>
      <InlineCode>void</InlineCode> 方法没有返回值，因此它<Text bold>只能单独调用</Text>，
      不能放进 <InlineCode>System.out.println()</InlineCode>，也不能赋值给变量。
      两种错误都会在编译阶段报错。
    </Paragraph>
    <Callout type="danger" title="void 方法不能用于打印调用或赋值调用">
      <CodeBlock
        title="错误示范（无法编译）"
        code={`public class VoidMisuse {

    public static void sayHi() {
        System.out.println("Hi!");
    }

    public static void main(String[] args) {
        System.out.println(sayHi());   // 编译错误：void 无值可打印
        int x = sayHi();               // 编译错误：void 无值可赋给 int
    }
}`}
      />
      <CodeBlock
        title="正确写法"
        code={`public class VoidOk {

    public static void sayHi() {
        System.out.println("Hi!");
    }

    public static void main(String[] args) {
        sayHi();   // void 方法只能单独调用
    }
}`}
      />
    </Callout>

    <Heading3>4. return 之后不能有可达代码（Unreachable Code）</Heading3>
    <Paragraph>
      执行到 <InlineCode>return</InlineCode> 后方法立即结束，
      <InlineCode>return</InlineCode> 之后的语句<Text bold>永远不会被执行</Text>。
      Java 编译器能检测到这种情况，会报"unreachable statement"（不可达语句）错误。
    </Paragraph>
    <Callout type="danger" title="return 后有代码——编译报错">
      <CodeBlock
        title="错误示范（无法编译）"
        code={`public static int compute(int n) {
    return n * 2;
    System.out.println("计算完毕");   // 编译错误：不可达语句
    return n * 3;                     // 编译错误：不可达语句
}`}
      />
      <CodeBlock
        title="正确写法（把逻辑移到 return 之前）"
        code={`public static int compute(int n) {
    System.out.println("即将计算");   // 在 return 之前，可以执行
    return n * 2;
    // return 之后不写任何代码
}`}
      />
    </Callout>
    <Paragraph>
      如果需要根据条件执行不同逻辑，应当使用 if-else 分支，而不是在同一路径上写多个 return：
    </Paragraph>
    <CodeBlock
      title="MultiReturnOk.java（多分支各自 return，正确）"
      code={`public static String classify(int n) {
    if (n > 0) {
        return "正数";      // 这条路径 return 后结束
    } else if (n < 0) {
        return "负数";      // 这条路径 return 后结束
    } else {
        return "零";        // 这条路径 return 后结束
    }
    // 三条路径都有 return，方法不会走到这里，也不需要再写代码
}`}
    />

    <Heading3>5. 有返回值的方法必须保证所有分支都有 return</Heading3>
    <Paragraph>
      如果方法声明了非 void 返回值，编译器会检查<Text bold>所有可能的执行路径</Text>，
      确保每一条路径最终都执行了 <InlineCode>return 值;</InlineCode>。
      只要有一条路径可能"漏掉" return，就会报编译错误。
    </Paragraph>
    <Callout type="danger" title="缺少 return——编译报错">
      <CodeBlock
        title="错误示范：有分支没有 return"
        code={`// 编译错误：当 n <= 0 时没有 return 语句
public static int abs(int n) {
    if (n >= 0) {
        return n;
    }
    // 当 n < 0 时走到这里，但没有 return，编译器报错
}`}
      />
      <CodeBlock
        title="正确写法：所有分支都有 return"
        code={`public static int abs(int n) {
    if (n >= 0) {
        return n;
    } else {
        return -n;   // n < 0 的路径也有 return
    }
}`}
      />
    </Callout>
    <Callout type="tip" title="末尾兜底 return 是常见写法">
      另一种常见写法是在所有 if-else 分支之后放一个"兜底" return，
      覆盖所有剩余情况：
      <CodeBlock
        title=""
        code={`public static int abs(int n) {
    if (n >= 0) {
        return n;
    }
    return -n;   // 兜底：走到这里说明 n < 0
}`}
      />
    </Callout>

    <Heading3>6. void 方法可以用裸 return; 提前结束</Heading3>
    <Paragraph>
      <InlineCode>void</InlineCode> 方法虽然不返回值，但可以在方法体任意位置写
      <InlineCode>return;</InlineCode>（注意后面没有值），
      立即结束方法执行，后续代码不再运行。
      常用于：参数不合法时提前退出，避免后续逻辑出错；
      某个条件满足时提前完成而无需继续执行。
    </Paragraph>
    <CodeBlock
      title="EarlyReturnDemo.java"
      code={`public class EarlyReturnDemo {

    // 打印 1~n；若 n < 1 则提前 return，不打印任何内容
    public static void printRange(int n) {
        if (n < 1) {
            System.out.println("n 不合法，必须 >= 1");
            return;   // 提前结束，后面的 for 循环不执行
        }
        for (int i = 1; i <= n; i++) {
            System.out.println(i);
        }
    }

    public static void main(String[] args) {
        printRange(3);
        System.out.println("---");
        printRange(-1);   // 触发提前 return
        System.out.println("---");
        printRange(2);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`1
2
3
---
n 不合法，必须 >= 1
---
1
2`} />
    <Paragraph>
      调用 <InlineCode>printRange(-1)</InlineCode> 时，<InlineCode>n &lt; 1</InlineCode> 为真，
      打印提示信息后执行 <InlineCode>return;</InlineCode>，方法立即结束，
      for 循环没有机会运行。
    </Paragraph>

    <Heading3>7. 注意事项汇总</Heading3>
    <UnorderedList>
      <ListItem><Text bold>不能嵌套定义</Text>：方法只能并列写在类内，不能写在另一个方法的方法体里。</ListItem>
      <ListItem><Text bold>顺序不影响调用</Text>：Java 编译器先扫描全类，方法定义顺序随意。</ListItem>
      <ListItem><Text bold>void 只能单独调用</Text>：放进 println 或赋值给变量都会编译报错。</ListItem>
      <ListItem><Text bold>return 后无代码</Text>：return 之后写语句会报"不可达语句"编译错误。</ListItem>
      <ListItem><Text bold>所有分支必须 return</Text>：有返回值的方法，每条执行路径都必须有 return 值。</ListItem>
      <ListItem><Text bold>void 可裸 return;</Text>：不写值，用于提前结束 void 方法。</ListItem>
    </UnorderedList>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：找出代码中的错误并修复"
      code={`// 下面代码有 3 处错误，请找出并说明原因，然后给出修复后的版本。

public class FindErrors {

    public static void printMsg() {
        System.out.println("Hello");
        return;
        System.out.println("World");   // 错误 A
    }

    public static int getValue(int n) {
        if (n > 0) {
            return n;
        }
        // 错误 B：缺少 return
    }

    public static void main(String[] args) {
        int x = printMsg();            // 错误 C
        System.out.println(getValue(5));
    }
}`}
      answerCode={`// 错误 A：return 后面有不可达语句，编译报错"unreachable statement"
// 错误 B：getValue 声明返回 int，但 n <= 0 时没有 return，编译报错
// 错误 C：printMsg() 是 void，不能赋值给 int，编译报错

// 修复后的版本：
public class FindErrors {

    public static void printMsg() {
        System.out.println("Hello");
        // 删除 return; 和后面的 println（或把 println 移到 return 前）
        System.out.println("World");
    }

    public static int getValue(int n) {
        if (n > 0) {
            return n;
        }
        return 0;   // 补充 n <= 0 时的 return，兜底
    }

    public static void main(String[] args) {
        printMsg();                     // void 方法只能单独调用
        System.out.println(getValue(5));
    }
}

/* 控制台输出：
Hello
World
5
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：补全缺失的 return 分支"
      code={`// 下面方法 getLevel 在某些情况下缺少 return，编译会报错。
// 请找出缺失的分支，补全后让代码可以正常编译和运行。
// 规则：score >= 90 返回 "A"；score >= 70 返回 "B"；score >= 60 返回 "C"；
//       其余返回 "D"。
// 在 main 里测试 95、75、62、40。

public class Exercise02 {

    public static String getLevel(int score) {
        if (score >= 90) {
            return "A";
        } else if (score >= 70) {
            return "B";
        } else if (score >= 60) {
            return "C";
        }
        // 缺少一个 return，请补全
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {

    public static String getLevel(int score) {
        if (score >= 90) {
            return "A";
        } else if (score >= 70) {
            return "B";
        } else if (score >= 60) {
            return "C";
        }
        return "D";   // 兜底：score < 60 时走到这里
    }

    public static void main(String[] args) {
        System.out.println(getLevel(95));   // A
        System.out.println(getLevel(75));   // B
        System.out.println(getLevel(62));   // C
        System.out.println(getLevel(40));   // D
    }
}

/* 控制台输出：
A
B
C
D

解析：补充末尾兜底 return "D" 后，所有分支都有 return，编译通过。
      95 >= 90 → A；75 >= 70 → B；62 >= 60 → C；40 < 60 → D。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：void 方法 + 提前 return 的综合练习"
      code={`// 要求：定义 void 方法 printDivision(int a, int b)。
// 若 b == 0，打印"除数不能为 0"并提前 return（不做除法）。
// 否则打印 a + " / " + b + " = " + (a / b)。
// 在 main 里测试 (10, 2)、(8, 0)、(15, 3)。

public class Exercise03 {

    public static void printDivision(int a, int b) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {

    public static void printDivision(int a, int b) {
        if (b == 0) {
            System.out.println("除数不能为 0");
            return;   // 提前结束，后面的除法不执行
        }
        System.out.println(a + " / " + b + " = " + (a / b));
    }

    public static void main(String[] args) {
        printDivision(10, 2);
        printDivision(8, 0);
        printDivision(15, 3);
    }
}

/* 控制台输出：
10 / 2 = 5
除数不能为 0
15 / 3 = 5

解析：当 b=0 时，打印提示后执行 return;，方法立即结束，
      后面的 println 不会执行，因此不会出现除以零的运行时错误。
*/`}
    />
  </article>
);

export default index;
