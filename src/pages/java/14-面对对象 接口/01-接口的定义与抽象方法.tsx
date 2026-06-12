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
    <Title>接口的定义与抽象方法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        现实中有很多"规范"：USB 接口规定了数据传输的标准，不管是哪家厂商的设备，只要符合这套规范就能互相通信。
        Java 里的<Text bold>接口（interface）</Text>正是同样的思路——它是一种<Text bold>公共规范标准</Text>，
        规定了一组抽象方法，任何类只要"实现"这个接口，就必须按规范提供具体行为。
        本节掌握接口的定义格式、抽象方法的特点、实现类的写法，以及如何通过多态使用接口。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是接口</Heading3>
    <Paragraph>
      接口是 Java 中一种<Text bold>引用数据类型</Text>，和类（class）地位相同，
      编译后同样生成 <InlineCode>.class</InlineCode> 字节码文件。
      接口的核心作用是<Text bold>定义一组规范</Text>：它只说"需要做什么"，不说"怎么做"——
      具体怎么做由实现类来负责。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>公共规范</Text>：接口就像一份"合同"，实现类必须履行合同里列出的所有条款（抽象方法）。
      </ListItem>
      <ListItem>
        <Text bold>解耦</Text>：调用方只依赖接口，不依赖具体实现类，方便后续替换实现。
      </ListItem>
      <ListItem>
        <Text bold>多实现</Text>：一个类可以同时实现多个接口，弥补 Java 单继承的限制（后续章节详述）。
      </ListItem>
    </UnorderedList>

    <Heading3>2. 接口的定义格式</Heading3>
    <Paragraph>
      定义接口使用关键字 <InlineCode>interface</InlineCode>，而不是 <InlineCode>class</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="text"
      title="接口定义格式"
      code={`public interface 接口名 {
    // 抽象方法（方法体只有分号，没有花括号内容）
    public abstract 返回值类型 方法名(参数列表);

    // public abstract 可以全部省略，编译器自动补全
    返回值类型 方法名(参数列表);
}`}
    />
    <Callout type="tip" title="接口名的命名惯例">
      接口名通常是形容词或以「able」结尾，表示"具备某种能力"，如
      <InlineCode>Runnable</InlineCode>、<InlineCode>Comparable</InlineCode>、
      <InlineCode>LiveAble</InlineCode>；也可以是名词，如 <InlineCode>USB</InlineCode>。
      首字母大写，遵循大驼峰命名法。
    </Callout>

    <Heading3>3. 接口中的抽象方法</Heading3>
    <Paragraph>
      接口中定义的方法默认就是抽象方法，修饰符固定为 <InlineCode>public abstract</InlineCode>。
      这两个关键字可以全部省略、省略一个或都写上，编译器都会自动补全为
      <InlineCode>public abstract</InlineCode>。
    </Paragraph>
    <Table
      head={['写法', '编译后等价于', '是否推荐']}
      rows={[
        ['void eat();', 'public abstract void eat();', '推荐（简洁）'],
        ['abstract void eat();', 'public abstract void eat();', '可以'],
        ['public void eat();', 'public abstract void eat();', '可以'],
        ['public abstract void eat();', 'public abstract void eat();', '完整写法，也可以'],
      ]}
    />
    <Callout type="warning" title="抽象方法没有方法体">
      接口中的抽象方法只有声明，<Text bold>没有花括号 {} 包裹的方法体</Text>，直接以分号结束。
      如果写了方法体（哪怕是空的 <InlineCode>{}</InlineCode>）就不再是抽象方法。
    </Callout>

    <Heading3>4. 实现接口：implements 关键字</Heading3>
    <Paragraph>
      类"实现"接口使用关键字 <InlineCode>implements</InlineCode>，格式如下：
    </Paragraph>
    <CodeBlock
      language="text"
      title="实现接口格式"
      code={`public class 类名 implements 接口名 {
    // 必须重写接口中全部抽象方法
    @Override
    public 返回值类型 方法名(参数列表) {
        // 具体实现
    }
}`}
    />
    <Paragraph>
      实现类必须遵守以下规则，否则编译报错：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>重写接口的全部抽象方法</Text>：一个都不能漏，每个方法都要有具体实现。
      </ListItem>
      <ListItem>
        <Text bold>访问权限必须是 public</Text>：接口的抽象方法是 public 的，重写时不能降低权限，
        因此实现类必须用 <InlineCode>public</InlineCode> 修饰。
      </ListItem>
      <ListItem>
        <Text bold>特例——抽象类可以不重写</Text>：如果实现类本身也是抽象类（用 <InlineCode>abstract</InlineCode> 修饰），
        则可以不重写，留给其子类来完成。
      </ListItem>
    </OrderedList>
    <Callout type="danger" title="实现类漏写方法会编译报错">
      若实现类没有重写接口的某个抽象方法，编译器报错：
      「类名 is not abstract and does not override abstract method 方法名 in 接口名」。
      解决方案：要么补全所有重写，要么将实现类声明为 <InlineCode>abstract class</InlineCode>。
    </Callout>

    <Heading3>5. 接口不能 new，通过多态使用</Heading3>
    <Paragraph>
      接口是抽象的规范，<Text bold>不能直接 new 出对象</Text>。
      要使用接口，必须通过它的实现类对象。最常用的方式是<Text bold>接口多态</Text>：
      左边声明为接口类型，右边 new 出实现类对象。
    </Paragraph>
    <CodeBlock
      language="text"
      title="接口多态格式"
      code={`接口名 变量名 = new 实现类();   // 多态写法
实现类名 变量名 = new 实现类();  // 普通写法，也合法`}
    />
    <Callout type="tip" title="为什么推荐多态写法">
      用接口类型声明变量，将来想换一个实现类，只需改 new 后面的类名，调用代码无需修改——
      这就是"面向接口编程"的核心价值，也是 Java 企业开发中最常见的实践。
    </Callout>

    <Heading3>6. 完整示例</Heading3>
    <Heading4>示例：USB 接口规范</Heading4>
    <Paragraph>
      定义 <InlineCode>USB</InlineCode> 接口，规定所有 USB 设备都必须实现
      <InlineCode>connect()</InlineCode> 和 <InlineCode>disconnect()</InlineCode> 两个方法。
      <InlineCode>Mouse</InlineCode> 和 <InlineCode>Keyboard</InlineCode> 分别实现各自的行为。
    </Paragraph>
    <CodeBlock
      title="USB.java"
      code={`public interface USB {
    // 连接（public abstract 可省略）
    void connect();

    // 断开连接
    void disconnect();
}`}
    />
    <CodeBlock
      title="Mouse.java"
      code={`public class Mouse implements USB {

    @Override
    public void connect() {
        System.out.println("鼠标已连接，准备就绪");
    }

    @Override
    public void disconnect() {
        System.out.println("鼠标已断开连接");
    }
}`}
    />
    <CodeBlock
      title="Keyboard.java"
      code={`public class Keyboard implements USB {

    @Override
    public void connect() {
        System.out.println("键盘已连接，准备就绪");
    }

    @Override
    public void disconnect() {
        System.out.println("键盘已断开连接");
    }
}`}
    />
    <CodeBlock
      title="InterfaceDemo.java"
      code={`public class InterfaceDemo {
    public static void main(String[] args) {
        // 接口多态：左边 USB 接口类型，右边 new 实现类
        USB device1 = new Mouse();
        device1.connect();
        device1.disconnect();

        System.out.println("---");

        USB device2 = new Keyboard();
        device2.connect();
        device2.disconnect();

        System.out.println("---");

        // 普通写法也合法
        Mouse mouse = new Mouse();
        mouse.connect();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`鼠标已连接，准备就绪
鼠标已断开连接
---
键盘已连接，准备就绪
键盘已断开连接
---
鼠标已连接，准备就绪`} />
    <Paragraph>
      <InlineCode>device1</InlineCode> 和 <InlineCode>device2</InlineCode> 的声明类型都是
      <InlineCode>USB</InlineCode> 接口，但实际指向不同的实现类对象，调用同名方法时各自执行自己的实现——
      这正是接口多态的体现。
    </Paragraph>

    <Heading4>示例 2：实现类没写完会怎样</Heading4>
    <Paragraph>
      下面演示如果实现类只重写了部分方法，编译器会如何处理。
    </Paragraph>
    <CodeBlock
      title="BadDevice.java（演示编译报错场景）"
      code={`// 错误示范：只重写了 connect()，漏掉了 disconnect()
// 编译器会报错：BadDevice is not abstract and does not override
//              abstract method disconnect() in USB
public class BadDevice implements USB {

    @Override
    public void connect() {
        System.out.println("BadDevice 连接");
    }

    // disconnect() 没写 → 编译报错

}

// 解决方案一：补全 disconnect() 方法
// 解决方案二：把 BadDevice 改为抽象类
// abstract class BadDevice implements USB { ... }`}
    />
    <Callout type="success" title="本节要点回顾">
      <UnorderedList>
        <ListItem>接口用 <InlineCode>interface</InlineCode> 定义，编译后也是 .class 文件。</ListItem>
        <ListItem>接口中的抽象方法修饰符固定为 <InlineCode>public abstract</InlineCode>，可全部省略。</ListItem>
        <ListItem>实现类用 <InlineCode>implements</InlineCode> 关键字，必须重写全部抽象方法且用 <InlineCode>public</InlineCode>。</ListItem>
        <ListItem>接口不能 new，通过实现类对象使用；推荐多态写法 <InlineCode>接口名 变量 = new 实现类()</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：定义 LiveAble 接口并实现"
      code={`// 要求：
// 1. 定义接口 LiveAble，包含两个抽象方法：eat() 和 sleep()，均无参数无返回值。
// 2. 定义实现类 Cat implements LiveAble，eat() 打印"猫在吃鱼"，sleep() 打印"猫在睡觉"。
// 3. 在 main 中用接口多态创建 Cat 对象并调用两个方法。

public interface LiveAble {
    // 补全两个抽象方法
}

public class Cat implements LiveAble {
    // 补全重写
}

public class Exercise01 {
    public static void main(String[] args) {
        // 用接口多态方式创建 Cat 对象并调用
    }
}`}
      answerCode={`public interface LiveAble {
    void eat();
    void sleep();
}

public class Cat implements LiveAble {

    @Override
    public void eat() {
        System.out.println("猫在吃鱼");
    }

    @Override
    public void sleep() {
        System.out.println("猫在睡觉");
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        LiveAble animal = new Cat();  // 接口多态
        animal.eat();
        animal.sleep();
    }
}

/* 控制台输出：
猫在吃鱼
猫在睡觉

解析：LiveAble 接口规定了 eat() 和 sleep() 两个规范，Cat 实现接口后提供了具体行为。
      用 LiveAble 类型声明变量，是面向接口编程的标准写法。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：判断哪些写法正确"
      code={`// 下面哪些写法能通过编译？请逐一分析原因。

interface Shape {
    double area();
    double perimeter();
}

// A
class Circle implements Shape {
    double radius;
    public double area() { return 3.14 * radius * radius; }
    public double perimeter() { return 2 * 3.14 * radius; }
}

// B
class Square implements Shape {
    double side;
    public double area() { return side * side; }
    // 没有重写 perimeter()
}

// C
abstract class Triangle implements Shape {
    // 两个方法都不重写
}

// D
Shape s = new Shape();  // 直接 new 接口

// 请说明 A B C D 各自能否通过编译及原因`}
      answerCode={`// A: 能通过编译。
//    Circle 实现了 Shape 的全部抽象方法（area 和 perimeter），符合规范。

// B: 编译报错。
//    Square 缺少 perimeter() 的重写，且没有声明为 abstract class，
//    编译器报错：Square is not abstract and does not override abstract method perimeter() in Shape

// C: 能通过编译。
//    Triangle 被声明为 abstract class，抽象类允许不实现接口的抽象方法，
//    留给 Triangle 的子类来完成。

// D: 编译报错。
//    接口不能直接 new，Shape 是接口没有构造方法，
//    编译器报错：Shape is abstract; cannot be instantiated

/* 总结：
   - 普通实现类必须重写全部抽象方法
   - abstract 修饰的实现类可以暂不重写
   - 接口本身不能 new
*/`}
    />

    <CodeBlock
      qa
      title="练习3：用多态编写「充电桩」方法"
      code={`// 要求：
// 接口 Chargeable 有一个方法 charge()，无参数无返回值。
// 实现类 Phone：charge() 打印"手机正在充电"
// 实现类 Laptop：charge() 打印"笔记本正在充电"
// 定义方法 startCharge(Chargeable device)，调用 device.charge()。
// 在 main 中分别传入 Phone 和 Laptop 对象调用 startCharge。

public interface Chargeable {
    // 补全
}

public class Phone implements Chargeable {
    // 补全
}

public class Laptop implements Chargeable {
    // 补全
}

public class Exercise03 {
    public static void startCharge(Chargeable device) {
        // 补全
    }

    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`public interface Chargeable {
    void charge();
}

public class Phone implements Chargeable {
    @Override
    public void charge() {
        System.out.println("手机正在充电");
    }
}

public class Laptop implements Chargeable {
    @Override
    public void charge() {
        System.out.println("笔记本正在充电");
    }
}

public class Exercise03 {
    public static void startCharge(Chargeable device) {
        device.charge();
    }

    public static void main(String[] args) {
        startCharge(new Phone());
        startCharge(new Laptop());
    }
}

/* 控制台输出：
手机正在充电
笔记本正在充电

解析：startCharge 方法的参数类型是接口 Chargeable，
      传入任何实现了该接口的对象都能正常工作，这正是"面向接口编程"的价值：
      调用方代码不依赖具体实现类，扩展性极强。
*/`}
    />
  </article>
);

export default index;
