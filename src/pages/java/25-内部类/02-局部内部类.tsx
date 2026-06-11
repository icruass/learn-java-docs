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
    <Title>局部内部类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        局部内部类是定义在<Text bold>方法内部</Text>的类，它的作用域仅限于定义它的那个方法。
        与成员内部类相比，局部内部类更像是"一次性工具"——只在某个方法内临时使用，出了方法就看不见它。
        本节的核心难点是：局部内部类访问所在方法的局部变量时，该变量必须是
        <Text bold>「事实最终的」（effectively final）</Text>——
        理解这条规则背后的原因，比死记规则本身更重要。
      </Paragraph>
    </Callout>

    <Heading3>1. 局部内部类的定义与位置</Heading3>
    <Paragraph>
      局部内部类定义在方法体内，格式上就是在方法花括号里写一个普通的类定义：
    </Paragraph>
    <CodeBlock
      language="text"
      title="局部内部类定义格式"
      code={`public class 外部类名 {

    public void someMethod() {
        // 局部内部类：定义在方法内部
        class 局部内部类名 {
            // 成员变量和成员方法
            public void localInnerMethod() {
                // ...
            }
        }

        // 只能在这个方法内部使用局部内部类
        局部内部类名 obj = new 局部内部类名();
        obj.localInnerMethod();
    }
}`}
    />
    <Callout type="warning" title="局部内部类只能在定义它的方法内使用">
      局部内部类的作用域与方法内的局部变量相同——出了方法就完全看不见。
      其他方法、其他类无法访问或使用该局部内部类。
      因此局部内部类<Text bold>不能加访问权限修饰符</Text>（<InlineCode>public</InlineCode>、
      <InlineCode>private</InlineCode> 等），它本就不对外可见。
    </Callout>

    <Heading3>2. 局部内部类能访问的内容</Heading3>
    <Table
      head={['能否访问', '内容', '说明']}
      rows={[
        ['能', '外部类的所有成员（含 private）', '与成员内部类相同，拥有对外部类对象的隐式引用'],
        ['能', '所在方法的局部变量', '但必须满足「事实最终」（effectively final）限制'],
        ['能', '方法的参数', '方法参数本质也是局部变量，同样受 effectively final 限制'],
      ]}
    />

    <Heading3>3. effectively final：局部变量的最终要求</Heading3>
    <Paragraph>
      当局部内部类访问所在方法的局部变量时，Java 要求该变量是
      <Text bold>「事实最终的（effectively final）」</Text>：
      即该变量从赋值之后，在整个方法里都没有被再次修改。
      JDK 8 之前必须显式加 <InlineCode>final</InlineCode> 关键字；
      JDK 8 起编译器自动检测，只要变量从未被修改就满足条件，可以省略 <InlineCode>final</InlineCode>，
      但语义上它仍然是 final 的。
    </Paragraph>
    <Callout type="warning" title="为什么必须是 effectively final？">
      <Paragraph>
        原因在于<Text bold>生命周期不匹配</Text>：
      </Paragraph>
      <OrderedList>
        <ListItem>
          方法的局部变量存储在栈帧（Stack Frame）上。方法执行完毕，栈帧销毁，局部变量随之消失。
        </ListItem>
        <ListItem>
          但局部内部类创建的对象存储在堆（Heap）上。对象的生命周期可以超过方法的生命周期（只要还有引用指向它）。
        </ListItem>
        <ListItem>
          如果内部类对象在方法执行完后还活着，但它引用的局部变量已经在栈上消失了，
          那内部类该去哪里读这个变量？
        </ListItem>
        <ListItem>
          Java 的解决方案是：在创建局部内部类对象时，把局部变量的值<Text bold>复制一份</Text>保存到对象里。
          为了保证"复制品"和"原件"的值永远一致，原件必须不可改变——这就是 effectively final 的本质。
        </ListItem>
      </OrderedList>
    </Callout>
    <Callout type="danger" title="修改局部变量导致编译报错">
      <CodeBlock
        language="text"
        title="报错示例（伪代码）"
        code={`public void method() {
    int count = 10;  // 局部变量

    class LocalInner {
        public void show() {
            System.out.println(count);  // 访问局部变量
        }
    }

    count = 20;  // 编译报错！count 被内部类使用后不能再修改（破坏了 effectively final）
}`}
      />
      报错信息类似：<InlineCode>Variable used in local class should be effectively final</InlineCode>。
    </Callout>

    <Heading3>4. 局部内部类 vs 成员内部类</Heading3>
    <Table
      head={['对比维度', '成员内部类', '局部内部类']}
      rows={[
        ['定义位置', '外部类的成员位置（类中方法外）', '方法体内'],
        ['作用域', '整个外部类', '仅限定义它的那个方法'],
        ['访问权限修饰符', '可加 public/private 等', '不能加（对外不可见，加了无意义）'],
        ['访问外部类成员', '可直接访问所有成员（含 private）', '可直接访问所有成员（含 private）'],
        ['访问方法局部变量', '不涉及（不在方法内）', '可以，但变量必须是 effectively final'],
        ['使用频率', '较常见', '较少，匿名内部类通常可替代'],
      ]}
    />

    <Heading3>5. 完整示例</Heading3>
    <Heading4>示例 1：基本的局部内部类</Heading4>
    <Paragraph>
      在方法内定义局部内部类，访问外部类成员变量和方法的局部变量（满足 effectively final）。
    </Paragraph>
    <CodeBlock
      title="LocalInnerDemo.java"
      code={`public class LocalInnerDemo {
    private String outerField = "外部类成员变量";  // 外部类成员变量

    public void greet(String greeting) {
        // greeting 是方法参数（也是局部变量），从未被修改 -> effectively final
        String suffix = "！";  // 局部变量，从未被修改 -> effectively final

        // 定义局部内部类（方法内部，无访问修饰符）
        class Greeter {
            public void sayHello(String name) {
                // 直接访问外部类成员变量
                System.out.println("外部类字段：" + outerField);
                // 直接访问方法的局部变量和参数（effectively final）
                System.out.println(greeting + "，" + name + suffix);
            }
        }

        // 只能在本方法内使用
        Greeter g = new Greeter();
        g.sayHello("张三");
        g.sayHello("李四");
    }

    public static void main(String[] args) {
        LocalInnerDemo demo = new LocalInnerDemo();
        demo.greet("你好");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`外部类字段：外部类成员变量
你好，张三！
外部类字段：外部类成员变量
你好，李四！`} />
    <Paragraph>
      <InlineCode>greeting</InlineCode>（方法参数）和 <InlineCode>suffix</InlineCode>（局部变量）
      都满足 effectively final——整个方法中没有对它们进行二次赋值，
      因此局部内部类可以直接引用它们。
    </Paragraph>

    <Heading4>示例 2：effectively final 的正确用法演示</Heading4>
    <CodeBlock
      title="FinalDemo.java"
      code={`public class FinalDemo {

    public void correctUsage() {
        int x = 100;    // x 赋值后从未被修改，effectively final
        // JDK 8+ 可省略 final 关键字，语义上仍是 final

        class Inner {
            public void show() {
                System.out.println("正确：x = " + x);  // 合法，x 是 effectively final
            }
        }

        new Inner().show();
        // 注意：如果在这里加上 x = 200; 那么 Inner.show() 中访问 x 就会编译报错
    }

    public static void main(String[] args) {
        new FinalDemo().correctUsage();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`正确：x = 100`} />

    <Heading4>示例 3：局部内部类访问外部类私有成员</Heading4>
    <CodeBlock
      title="Calculator.java"
      code={`public class Calculator {
    private double base;    // 外部类私有成员变量：基准值

    public Calculator(double base) {
        this.base = base;
    }

    // 在方法内定义局部内部类，直接访问外部类 private 成员 base
    public void calculate(double input) {
        String unit = "元";  // 局部变量，effectively final（方法内不再修改）

        class Formatter {
            public void printAdd() {
                // 直接访问外部类 private 成员 base 和方法局部变量 unit、input
                double result = base + input;
                System.out.println("基准 " + base + unit + " + 输入 " + input + unit + " = " + result + unit);
            }

            public void printMultiply() {
                double result = base * input;
                System.out.println("基准 " + base + unit + " x 输入 " + input + " = " + result + unit);
            }
        }

        Formatter fmt = new Formatter();
        fmt.printAdd();
        fmt.printMultiply();
    }

    public static void main(String[] args) {
        Calculator calc = new Calculator(1000.0);
        calc.calculate(500.0);
        System.out.println("---");
        calc.calculate(2.5);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`基准 1000.0元 + 输入 500.0元 = 1500.0元
基准 1000.0元 x 输入 500.0 = 500000.0元
---
基准 1000.0元 + 输入 2.5元 = 1002.5元
基准 1000.0元 x 输入 2.5 = 2500.0元`} />
    <Paragraph>
      局部内部类 <InlineCode>Formatter</InlineCode> 同时访问了外部类的私有成员
      <InlineCode>base</InlineCode>（来自外部类对象）和方法的局部变量
      <InlineCode>input</InlineCode>、<InlineCode>unit</InlineCode>（均满足 effectively final）。
      这是局部内部类的典型使用场景：在某个方法内临时组织一段逻辑，无需暴露给外部。
    </Paragraph>

    <Heading3>6. 要点汇总</Heading3>
    <Table
      head={['要点', '说明']}
      rows={[
        ['定义位置', '方法体内部，与方法内的局部变量并列'],
        ['作用域', '只能在定义它的那个方法内使用，出了方法就不能访问'],
        ['访问外部类成员', '可直接访问所有成员（含 private），同成员内部类'],
        ['访问局部变量/参数', '可以，但该变量必须是 effectively final（赋值后不再修改）'],
        ['访问权限修饰符', '不可加 public/private/protected，因为对外不可见'],
        ['effectively final 原因', '局部变量生命周期短（方法结束即消亡），内部类对象生命周期可能更长，Java 采用复制策略，要求原值不变'],
      ]}
    />
    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>局部内部类定义在方法内部，作用域仅限该方法，不能加访问修饰符。</ListItem>
        <ListItem>可直接访问外部类所有成员（含 private）。</ListItem>
        <ListItem>访问方法局部变量时，该变量必须是 effectively final（赋值后不再改变）。</ListItem>
        <ListItem>effectively final 的本质原因是生命周期不匹配——Java 用「复制值」解决问题，因此要求原值不可变。</ListItem>
        <ListItem>实际开发中，局部内部类较少直接使用，通常用匿名内部类替代（下一节）。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：定义局部内部类并访问外部类成员"
      code={`// 要求：
// 外部类 Printer 有 private 成员变量 prefix（前缀字符串）。
// 在 Printer 的方法 printList(String[] items) 中：
//   1. 定义局部内部类 LineFormatter，包含方法 format(int index, String item)，
//      打印格式：「prefix」[序号] 内容（序号从1开始）
//   2. 循环调用 format 打印 items 数组的每一项。
// 在 main 中测试：prefix=">>", items={"苹果","香蕉","橙子"}

public class Printer {
    private String prefix;

    public Printer(String prefix) {
        this.prefix = prefix;
    }

    public void printList(String[] items) {
        // 补全：定义局部内部类 LineFormatter 并使用它打印
    }

    public static void main(String[] args) {
        Printer p = new Printer(">>");
        p.printList(new String[]{"苹果", "香蕉", "橙子"});
    }
}`}
      answerCode={`public class Printer {
    private String prefix;

    public Printer(String prefix) {
        this.prefix = prefix;
    }

    public void printList(String[] items) {
        // 局部内部类：定义在方法内部，可直接访问外部类 private 成员 prefix
        class LineFormatter {
            public void format(int index, String item) {
                System.out.println(prefix + "[" + index + "] " + item);
            }
        }

        LineFormatter formatter = new LineFormatter();
        for (int i = 0; i < items.length; i++) {
            formatter.format(i + 1, items[i]);
        }
    }

    public static void main(String[] args) {
        Printer p = new Printer(">>");
        p.printList(new String[]{"苹果", "香蕉", "橙子"});
    }
}

/* 控制台输出：
>>[1] 苹果
>>[2] 香蕉
>>[3] 橙子

解析：局部内部类 LineFormatter 定义在方法 printList 内部，
      可直接访问外部类的 private 成员 prefix，
      对象 formatter 只在方法内使用，出了方法就不可见。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：判断哪些局部变量可被局部内部类访问"
      code={`// 下面代码片段中，哪些局部变量可以被局部内部类访问？哪些不能？请逐一说明原因。

public class Test {
    public void method(int param) {     // 情况A：方法参数 param，后面会被修改
        int a = 10;                     // 情况B：局部变量 a，之后不再修改
        int b = 20;                     // 情况C：局部变量 b，之后会被修改
        String s = "hello";             // 情况D：局部变量 s，之后不再修改

        b = 30;  // b 被重新赋值

        class Inner {
            public void show() {
                // 逐行判断合法性：
                System.out.println(param); // 行1 合法还是报错？
                System.out.println(a);     // 行2 合法还是报错？
                System.out.println(b);     // 行3 合法还是报错？
                System.out.println(s);     // 行4 合法还是报错？
            }
        }
        new Inner().show();
        param = 99;  // param 被修改
    }
}`}
      answerCode={`// 分析：
// 情况A：param 在方法末尾被 param = 99 修改，所以不是 effectively final。
//        行1 编译报错。
//        （若删掉 param = 99，则 param 从未修改，行1 就合法）

// 情况B：a = 10 赋值后整个方法内未再修改 -> effectively final -> 行2 合法。

// 情况C：b = 20 后又 b = 30，b 被二次赋值 -> 不是 effectively final -> 行3 编译报错。

// 情况D：s = "hello" 赋值后未被修改 -> effectively final -> 行4 合法。

// 修正后的合法版本（去掉两处问题）：
public class Test {
    public void method(int param) {
        int a = 10;
        int b = 20;
        String s = "hello";
        // 删除 b = 30 和 param = 99

        class Inner {
            public void show() {
                System.out.println(param); // 合法：param 未被修改
                System.out.println(a);     // 合法：a 未被修改
                System.out.println(b);     // 合法：b 未被修改
                System.out.println(s);     // 合法：s 未被修改
            }
        }
        new Inner().show();
    }

    public static void main(String[] args) {
        new Test().method(5);
    }
}

/* 控制台输出：
5
10
20
hello

总结：effectively final = 赋值之后，在该变量的整个作用域内没有任何地方对它重新赋值。
      只要有任意一行对该变量赋了新值（无论在内部类定义前还是定义后），该变量就不是 effectively final。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：局部内部类的作用域限制"
      code={`// 下面代码有编译错误，请找出错误并解释原因，给出修正方案。

public class ScopeTest {
    public void methodA() {
        class Helper {
            public void help() {
                System.out.println("Helper 在 methodA 中被定义");
            }
        }
        new Helper().help();
    }

    public void methodB() {
        // 试图在 methodB 中使用 methodA 里定义的局部内部类
        Helper h = new Helper();  // 编译错误！
        h.help();
    }

    public static void main(String[] args) {
        ScopeTest t = new ScopeTest();
        t.methodA();
        t.methodB();
    }
}`}
      answerCode={`// 错误原因：
// Helper 是定义在 methodA 方法内部的局部内部类，
// 它的作用域仅限于 methodA 的方法体内。
// methodB 完全看不到 Helper 这个类型，因此编译报错：找不到符号 Helper。

// 修正方案：把 Helper 提升为成员内部类
public class ScopeTest {
    // 把 Helper 移到成员位置，所有方法都能访问
    class Helper {
        public void help() {
            System.out.println("Helper 作为成员内部类，所有方法都可以使用");
        }
    }

    public void methodA() {
        new Helper().help();
    }

    public void methodB() {
        new Helper().help();  // 现在合法
    }

    public static void main(String[] args) {
        ScopeTest t = new ScopeTest();
        t.methodA();
        t.methodB();
    }
}

/* 控制台输出：
Helper 作为成员内部类，所有方法都可以使用
Helper 作为成员内部类，所有方法都可以使用

解析：局部内部类的作用域是硬性限制，不是访问权限问题，
      无论怎么调整修饰符都无法让它跨方法使用。
      需要跨方法共享时，应该改用成员内部类。
*/`}
    />
  </article>
);

export default index;
