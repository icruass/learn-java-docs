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
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>成员变量和局部变量的区别</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 中的变量按定义位置不同，分为<Text bold>成员变量</Text>和<Text bold>局部变量</Text>两大类。
        它们在定义位置、内存位置、生命周期、默认值、作用域等五个维度上都有明显区别。
        搞清楚这些区别，能帮你避免"变量未初始化"报错、作用域混乱等常见问题。
      </Paragraph>
    </Callout>

    <Heading3>1. 定义位置不同</Heading3>
    <Paragraph>
      这是区分两类变量最直接的标准——<Text bold>看花括号的层级</Text>：
    </Paragraph>
    <Table
      head={['变量类型', '定义位置', '示例']}
      rows={[
        ['成员变量（Member Variable）', '类中、所有方法的外面', 'class Student { String name; int age; }'],
        ['局部变量（Local Variable）', '方法内部，或方法的参数列表上', 'public void study() { int count = 0; }'],
      ]}
    />
    <CodeBlock
      title="位置示意.java"
      code={`public class PositionDemo {
    // ↓ 成员变量：类中、方法外
    String name;
    int age;

    public void show() {
        // ↓ 局部变量：方法内部
        int times = 3;
        System.out.println(name + " 执行了 " + times + " 次");
    }

    // ↓ 参数 n 也是局部变量（定义在方法声明上）
    public void repeat(int n) {
        for (int i = 0; i < n; i++) {   // ↓ i 也是局部变量（for 语句内）
            System.out.println(name);
        }
    }
}`}
    />

    <Heading3>2. 内存位置不同</Heading3>
    <Table
      head={['变量类型', '存储位置', '说明']}
      rows={[
        ['成员变量', '堆（Heap）', '作为对象的一部分存在堆中，随对象一起创建'],
        ['局部变量', '栈（Stack）', '方法调用时压栈，存储在该方法的栈帧中'],
      ]}
    />
    <Paragraph>
      这也是为什么同一个类的不同对象，成员变量各自独立——因为每个对象都在堆中占据独立的内存块。
      而局部变量在栈帧中，方法执行完毕，整个栈帧弹出，局部变量随之消失。
    </Paragraph>

    <Heading3>3. 生命周期不同</Heading3>
    <Table
      head={['变量类型', '何时创建', '何时销毁']}
      rows={[
        ['成员变量', '对象被 new 出来时', '对象没有任何引用指向它时，等待 GC 回收（随对象一起消亡）'],
        ['局部变量', '所在方法被调用时（执行到声明那行时）', '所在方法调用结束，或超出所在代码块的花括号范围时'],
      ]}
    />
    <Paragraph>
      成员变量的生命周期和对象绑定，只要对象还活着，成员变量就活着。
      局部变量的生命周期非常短暂，方法一结束就消失，下次调用同一方法会重新创建。
    </Paragraph>

    <Heading3>4. 默认值不同（最容易出错！）</Heading3>
    <Table
      head={['变量类型', '默认值', '不赋值直接使用的后果']}
      rows={[
        ['成员变量', '有默认值（int→0，double→0.0，boolean→false，引用类型→null）', '可以直接使用，不报错'],
        ['局部变量', '没有默认值', '编译直接报错：variable xxx might not have been initialized'],
      ]}
    />
    <Callout type="danger" title="局部变量必须先赋值再使用">
      Java 编译器会检测局部变量是否在使用前已被赋值。
      如果发现可能未赋值就使用，<Text bold>编译阶段就会报错</Text>，程序根本跑不起来。
      这是 Java 编译器的安全保护机制，防止使用垃圾值。
    </Callout>

    <Heading3>5. 作用域不同</Heading3>
    <Table
      head={['变量类型', '作用域', '说明']}
      rows={[
        ['成员变量', '整个类中都可以访问', '类中所有方法都能直接使用成员变量，无需传参'],
        ['局部变量', '只在定义它的代码块（花括号）内有效', '出了花括号就不存在了，其他方法无法访问'],
      ]}
    />

    <Heading3>6. 五维对比汇总表</Heading3>
    <Table
      head={['对比维度', '成员变量', '局部变量']}
      rows={[
        ['定义位置', '类中、方法外', '方法内或方法参数列表上'],
        ['内存位置', '堆（Heap）', '栈（Stack）'],
        ['生命周期', '随对象创建 / 随对象消亡', '随方法调用创建 / 随方法结束消亡'],
        ['默认值', '有默认值（0 / 0.0 / false / null）', '没有默认值，必须手动赋值后才能使用'],
        ['作用域', '整个类（所有方法可访问）', '仅在所在的代码块（花括号）内有效'],
      ]}
    />

    <Heading3>7. 代码示例</Heading3>
    <Heading4>示例 1：成员变量有默认值，局部变量没有</Heading4>
    <CodeBlock
      title="DefaultValueDemo.java"
      code={`public class DefaultValueDemo {
    // 成员变量：不赋初值，有默认值
    int memberInt;
    double memberDouble;
    boolean memberBool;
    String memberStr;

    public void showMemberDefaults() {
        // 直接使用，不报错
        System.out.println("memberInt    = " + memberInt);
        System.out.println("memberDouble = " + memberDouble);
        System.out.println("memberBool   = " + memberBool);
        System.out.println("memberStr    = " + memberStr);
    }

    public void localVariableDemo() {
        int localInt;
        // System.out.println(localInt);   // 编译报错！局部变量未赋值

        localInt = 42;                     // 先赋值
        System.out.println("localInt = " + localInt);   // 再使用，OK
    }

    public static void main(String[] args) {
        DefaultValueDemo obj = new DefaultValueDemo();
        obj.showMemberDefaults();
        System.out.println("---");
        obj.localVariableDemo();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`memberInt    = 0
memberDouble = 0.0
memberBool   = false
memberStr    = null
---
localInt = 42`} />

    <Heading4>示例 2：作用域——成员变量与局部变量同名时</Heading4>
    <Paragraph>
      当局部变量与成员变量同名时，在该局部变量的作用域内，局部变量会<Text bold>遮蔽</Text>同名的成员变量
      （就近原则）。若要访问成员变量，需要用 <InlineCode>this.变量名</InlineCode>（this 在后续章节详解）：
    </Paragraph>
    <CodeBlock
      title="ScopeDemo.java"
      code={`public class ScopeDemo {
    int age = 30;   // 成员变量

    public void test() {
        int age = 18;   // 局部变量，与成员变量同名

        // 就近原则：优先使用局部变量
        System.out.println("局部变量 age = " + age);          // 18
        // 用 this 明确访问成员变量
        System.out.println("成员变量 age = " + this.age);     // 30
    }

    public void noConflict() {
        // 这个方法里没有同名局部变量，直接访问成员变量
        System.out.println("成员变量 age = " + age);          // 30
    }

    public static void main(String[] args) {
        ScopeDemo obj = new ScopeDemo();
        obj.test();
        System.out.println("---");
        obj.noConflict();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`局部变量 age = 18
成员变量 age = 30
---
成员变量 age = 30`} />
    <Paragraph>
      在 <InlineCode>test()</InlineCode> 方法中，局部变量 <InlineCode>age = 18</InlineCode> 遮蔽了成员变量 <InlineCode>age = 30</InlineCode>。
      直接写 <InlineCode>age</InlineCode> 访问的是局部变量；
      写 <InlineCode>this.age</InlineCode> 才能访问成员变量。
      在 <InlineCode>noConflict()</InlineCode> 中没有同名局部变量，直接写 <InlineCode>age</InlineCode> 就是成员变量。
    </Paragraph>

    <Heading4>示例 3：生命周期——局部变量每次方法调用重新创建</Heading4>
    <CodeBlock
      title="LifecycleDemo.java"
      code={`public class LifecycleDemo {
    int callCount = 0;   // 成员变量，随对象存活，记录调用次数

    public void increment() {
        int localTemp = 0;   // 局部变量，每次调用方法时重新创建，从 0 开始
        localTemp++;
        callCount++;         // 成员变量累加
        System.out.println("localTemp = " + localTemp + "，callCount = " + callCount);
    }

    public static void main(String[] args) {
        LifecycleDemo obj = new LifecycleDemo();
        obj.increment();   // localTemp 每次都是新的 0，callCount 累加
        obj.increment();
        obj.increment();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`localTemp = 1，callCount = 1
localTemp = 1，callCount = 2
localTemp = 1，callCount = 3`} />
    <Paragraph>
      每次调用 <InlineCode>increment()</InlineCode>，局部变量 <InlineCode>localTemp</InlineCode>
      都重新创建并初始化为 0，加 1 后变成 1，方法结束后销毁；
      而成员变量 <InlineCode>callCount</InlineCode> 属于对象，每次调用后保留上次的值并继续累加。
    </Paragraph>

    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem><Text bold>位置</Text>：成员变量在类中方法外；局部变量在方法内或参数列表上。</ListItem>
        <ListItem><Text bold>内存</Text>：成员变量在堆（随对象）；局部变量在栈（随方法栈帧）。</ListItem>
        <ListItem><Text bold>生命周期</Text>：成员变量随对象；局部变量随方法调用。</ListItem>
        <ListItem><Text bold>默认值</Text>：成员变量有默认值；局部变量没有，必须先赋值再使用，否则编译报错。</ListItem>
        <ListItem><Text bold>作用域</Text>：成员变量整个类可用；局部变量仅在所在代码块内有效。</ListItem>
        <ListItem>同名时局部变量遮蔽成员变量，用 <InlineCode>this.变量名</InlineCode> 区分。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：判断变量类型并分析"
      code={`判断下列代码中每个变量是"成员变量"还是"局部变量"，并说明其默认值（如有）。

public class Counter {
    int count;                  // 变量 A
    String label;               // 变量 B

    public void add(int step) { // 变量 C
        int result = count + step; // 变量 D
        count = result;
    }

    public boolean isZero() {
        boolean flag;           // 变量 E
        flag = (count == 0);
        return flag;
    }
}`}
      answerCode={`变量 A（count）：成员变量。默认值为 0（int 类型）。
变量 B（label）：成员变量。默认值为 null（String 是引用类型）。
变量 C（step）：局部变量（方法参数）。没有默认值；调用时由实参传入，必须有值。
变量 D（result）：局部变量（方法内部）。没有默认值，但代码中有 count + step 赋值，OK。
变量 E（flag）：局部变量（方法内部）。没有默认值；若在 flag = (count == 0) 之前就使用 flag，会编译报错。
               代码中是先赋值再 return，所以没问题。`}
    />
    <CodeBlock
      qa
      title="练习 2：找出编译错误并修正"
      code={`// 下面代码有一处会编译报错，找出来并说明原因，然后修正。

public class BugDemo {
    int score;   // 成员变量

    public void printDouble() {
        int doubled;
        System.out.println("两倍分数：" + doubled * 2);   // 问题在这里
        doubled = score * 2;
    }

    public static void main(String[] args) {
        BugDemo obj = new BugDemo();
        obj.score = 90;
        obj.printDouble();
    }
}`}
      answerCode={`错误原因：
局部变量 doubled 在第 6 行被使用（doubled * 2），但此时它还没有赋值。
局部变量没有默认值，编译器检测到这里可能使用了未初始化的变量，直接报错：
  variable doubled might not have been initialized

修正方法：先赋值再使用，调换赋值和打印的顺序：

public class BugDemo {
    int score;

    public void printDouble() {
        int doubled;
        doubled = score * 2;                              // 先赋值
        System.out.println("两倍分数：" + doubled * 2);   // 再使用
    }

    public static void main(String[] args) {
        BugDemo obj = new BugDemo();
        obj.score = 90;
        obj.printDouble();
    }
}

/* 控制台输出：
两倍分数：360

解析：doubled = 90 * 2 = 180，180 * 2 = 360。
*/`}
    />
    <CodeBlock
      qa
      title="练习 3：成员变量与局部变量同名遮蔽"
      code={`// 要求：
// 1. 定义 Rectangle 类，成员变量 width=10, height=5。
// 2. 定义方法 area(int width, int height)，
//    参数名故意与成员变量同名。
//    方法内打印两行：
//      "参数 width=xxx, height=xxx"（局部变量/参数的值）
//      "成员变量 width=xxx, height=xxx"（成员变量的值）
//    再返回 参数width * 参数height 的结果。
// 3. 在 main 中创建对象，调用 area(3, 4)，打印返回值。

public class Rectangle {
    int width = 10;
    int height = 5;

    public int area(int width, int height) {
        // 请补全
    }

    public static void main(String[] args) {
        // 请补全
    }
}`}
      answerCode={`public class Rectangle {
    int width = 10;
    int height = 5;

    public int area(int width, int height) {
        // 参数（局部变量）遮蔽了同名的成员变量
        System.out.println("参数 width=" + width + ", height=" + height);
        // 用 this 访问被遮蔽的成员变量
        System.out.println("成员变量 width=" + this.width + ", height=" + this.height);
        return width * height;   // 使用参数计算
    }

    public static void main(String[] args) {
        Rectangle rect = new Rectangle();
        int result = rect.area(3, 4);
        System.out.println("area(3, 4) = " + result);
    }
}

/* 控制台输出：
参数 width=3, height=4
成员变量 width=10, height=5
area(3, 4) = 12

解析：方法参数 width=3、height=4 在方法内遮蔽了成员变量 width=10、height=5。
      直接写 width 访问的是参数（值为 3）；
      写 this.width 才能访问成员变量（值为 10）。
      返回值 3 * 4 = 12 用的是参数。
*/`}
    />
  </article>
);

export default index;
