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
    <Title>抽象类注意事项</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节学会了抽象类的基础用法，但实际编码时还有很多细节容易踩坑：
        抽象类到底能不能有构造方法？可不可以没有抽象方法？子类如果不想重写抽象方法该怎么办？
        本节逐条拆解这五大注意事项，每条都配有示例与反例，
        帮你在写代码时少走弯路。
      </Paragraph>
    </Callout>

    <Heading3>1. 注意事项总览</Heading3>
    <Table
      head={['编号', '结论', '关键词']}
      rows={[
        ['①', '抽象类不能创建对象（不能 new）', '编译报错'],
        ['②', '抽象类可以有构造方法，供子类通过 super() 调用', '初始化父类成员'],
        ['③', '抽象类可以同时含有普通成员（变量 + 方法）和抽象方法', '两者共存'],
        ['④', '抽象类可以没有任何抽象方法（但意义不大，只为禁止 new）', '纯禁止实例化'],
        ['⑤', '子类继承抽象类必须重写全部抽象方法，否则子类也要加 abstract', '抽象传递'],
      ]}
    />

    <Heading3>2. ① 抽象类不能创建对象</Heading3>
    <Paragraph>
      用 <InlineCode>new</InlineCode> 直接实例化抽象类，编译器立即报错。
      这是抽象类最基本的规则——抽象类中可能存在没有方法体的抽象方法，
      若允许创建对象，调用这些方法时 JVM 无代码可执行。
    </Paragraph>
    <CodeBlock
      title="InstantiateAbstractDemo.java（错误示范）"
      code={`public abstract class Animal {
    public abstract void eat();
}

public class InstantiateAbstractDemo {
    public static void main(String[] args) {
        // 编译错误：Animal is abstract; cannot be instantiated
        Animal a = new Animal();   // ❌ 不允许！
    }
}`}
    />
    <Callout type="danger" title="编译期即报错，不是运行期">
      这是编译期错误，代码甚至不会被执行到。
      IDE 通常会在你敲下 <InlineCode>new Animal()</InlineCode> 时立刻画红线提醒。
      正确做法是创建子类对象，可以用多态方式：<InlineCode>Animal a = new Cat();</InlineCode>。
    </Callout>

    <Heading3>3. ② 抽象类可以有构造方法</Heading3>
    <Paragraph>
      抽象类虽然不能被直接 new，但<Text bold>可以定义构造方法</Text>。
      子类在创建对象时，会通过 <InlineCode>super()</InlineCode> 调用父类构造方法，
      完成父类成员变量的初始化。
    </Paragraph>
    <Paragraph>
      如果父类没有无参构造方法（只有有参构造方法），子类构造方法的第一行必须显式调用
      <InlineCode>super(参数)</InlineCode>，否则编译报错。
    </Paragraph>
    <CodeBlock
      title="AbstractConstructorDemo.java"
      code={`public abstract class Animal {
    String name;
    int    age;

    // 抽象类的有参构造方法，供子类调用
    public Animal(String name, int age) {
        this.name = name;
        this.age  = age;
    }

    public abstract void eat();
}

public class Cat extends Animal {

    // 子类必须显式调用父类有参构造方法
    public Cat(String name, int age) {
        super(name, age);   // 调用 Animal(String, int)
    }

    @Override
    public void eat() {
        System.out.println(name + "（" + age + "岁）优雅地舔食猫粮");
    }
}

public class AbstractConstructorDemo {
    public static void main(String[] args) {
        Animal a = new Cat("小白", 2);
        a.eat();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`小白（2岁）优雅地舔食猫粮`} />
    <Paragraph>
      <InlineCode>new Cat("小白", 2)</InlineCode> 时，Cat 的构造方法第一行调用
      <InlineCode>super("小白", 2)</InlineCode>，执行 Animal 的构造方法，
      将 <InlineCode>name</InlineCode> 和 <InlineCode>age</InlineCode> 赋值，
      然后才继续执行 Cat 自己的构造方法体。
    </Paragraph>
    <Callout type="tip" title="子类 super() 调用时机">
      <InlineCode>super()</InlineCode> 或 <InlineCode>super(参数)</InlineCode> 必须写在子类构造方法的
      <Text bold>第一行</Text>。如果子类不写，编译器会默认插入无参 <InlineCode>super()</InlineCode>；
      若父类没有无参构造方法，则必须手动写有参 <InlineCode>super(参数)</InlineCode>，否则编译报错。
    </Callout>

    <Heading3>4. ③ 抽象类可以同时含有普通成员和抽象方法</Heading3>
    <Paragraph>
      抽象类中，<Text bold>普通成员变量、普通方法与抽象方法可以自由共存</Text>。
      普通方法封装所有子类共用的逻辑（避免重复），抽象方法约定子类各自不同的行为。
    </Paragraph>
    <CodeBlock
      title="MixedAbstractDemo.java"
      code={`public abstract class Employee {
    String name;
    double baseSalary;   // 基本工资（普通成员变量）

    public Employee(String name, double baseSalary) {
        this.name       = name;
        this.baseSalary = baseSalary;
    }

    // 普通方法：所有员工共用的打卡逻辑
    public void clockIn() {
        System.out.println(name + " 已打卡上班");
    }

    // 抽象方法：奖金计算方式因职位不同而不同
    public abstract double getBonus();

    // 普通方法：打印工资单（调用抽象方法，运行时多态）
    public void printPayslip() {
        System.out.printf("%s 基本工资:%.0f 奖金:%.0f 合计:%.0f%n",
                name, baseSalary, getBonus(), baseSalary + getBonus());
    }
}

public class SalesEmployee extends Employee {
    double salesAmount;   // 销售额

    public SalesEmployee(String name, double baseSalary, double salesAmount) {
        super(name, baseSalary);
        this.salesAmount = salesAmount;
    }

    @Override
    public double getBonus() {
        return salesAmount * 0.05;   // 销售额的 5% 作为奖金
    }
}

public class MixedAbstractDemo {
    public static void main(String[] args) {
        Employee e = new SalesEmployee("王销售", 5000, 80000);
        e.clockIn();
        e.printPayslip();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`王销售 已打卡上班
王销售 基本工资:5000 奖金:4000 合计:9000`} />
    <Paragraph>
      <InlineCode>printPayslip()</InlineCode> 是父类的普通方法，内部调用了抽象方法
      <InlineCode>getBonus()</InlineCode>。运行时通过多态，执行的是
      <InlineCode>SalesEmployee</InlineCode> 的 <InlineCode>getBonus()</InlineCode>，
      返回 80000 × 5% = 4000。这种"父类普通方法调用抽象方法"的模式，
      在设计模式中称为<Text bold>模板方法模式</Text>。
    </Paragraph>

    <Heading3>5. ④ 抽象类可以没有抽象方法</Heading3>
    <Paragraph>
      一个类只要加了 <InlineCode>abstract</InlineCode> 修饰，即便其中没有任何抽象方法，
      它也是抽象类，同样不能被直接 new。这种用法的典型目的是：
      <Text bold>只想禁止外部直接创建该类的对象</Text>，强制使用者只能通过子类来使用。
    </Paragraph>
    <CodeBlock
      title="NoAbstractMethodDemo.java"
      code={`// 没有任何抽象方法，但加了 abstract，目的是禁止直接 new
public abstract class BaseConfig {
    String host = "localhost";
    int    port = 8080;

    public void printInfo() {
        System.out.println("服务地址：" + host + ":" + port);
    }
    // 没有任何抽象方法
}

public class AppConfig extends BaseConfig {
    // 不需要重写任何方法，直接继承即可
}

public class NoAbstractMethodDemo {
    public static void main(String[] args) {
        // BaseConfig cfg = new BaseConfig();  // ❌ 编译报错
        BaseConfig cfg = new AppConfig();       // ✅ 通过子类创建
        cfg.printInfo();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`服务地址：localhost:8080`} />
    <Callout type="warning" title="没有抽象方法的抽象类意义有限">
      虽然语法合法，但没有抽象方法的抽象类在实际项目中较少见。
      这种情况通常用于框架设计中禁止直接实例化基类，或作为某个体系的"根节点"使用。
      日常业务代码中若遇到这种写法，要问清楚设计意图。
    </Callout>

    <Heading3>6. ⑤ 子类不重写全部抽象方法，则子类也必须是抽象类</Heading3>
    <Paragraph>
      当子类继承了抽象父类，但<Text bold>没有重写全部抽象方法</Text>时，
      那些未被重写的抽象方法会"传递"给子类，子类同样存在抽象方法，
      因此子类也必须声明为 <InlineCode>abstract</InlineCode>，否则编译报错。
    </Paragraph>
    <Paragraph>
      这种"抽象类继承抽象类"的情况在多级继承体系中会出现：
      中间层只实现部分行为，将剩余抽象方法留给更具体的子类去完成。
    </Paragraph>
    <CodeBlock
      title="AbstractChainDemo.java"
      code={`public abstract class Animal {
    public abstract void eat();
    public abstract void sleep();
}

// Pet 只实现了 sleep()，没有实现 eat()，
// 所以 Pet 也必须声明为 abstract，否则编译报错
public abstract class Pet extends Animal {
    String owner;

    @Override
    public void sleep() {
        System.out.println("宠物 " + owner + " 的宠物在睡觉");
    }
    // eat() 仍是抽象的，由具体子类实现
}

// Cat 继承 Pet，实现了剩余的 eat()，不再有未实现的抽象方法
// 因此 Cat 是普通类，可以被 new
public class Cat extends Pet {
    public Cat(String owner) {
        this.owner = owner;
    }

    @Override
    public void eat() {
        System.out.println(owner + " 的猫在吃猫粮");
    }
}

public class AbstractChainDemo {
    public static void main(String[] args) {
        Animal a = new Cat("小明");
        a.eat();
        a.sleep();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`小明 的猫在吃猫粮
宠物 小明 的宠物在睡觉`} />
    <Paragraph>
      <InlineCode>Animal</InlineCode> 有两个抽象方法；
      <InlineCode>Pet</InlineCode> 只实现了 <InlineCode>sleep()</InlineCode>，
      <InlineCode>eat()</InlineCode> 未实现，所以 <InlineCode>Pet</InlineCode> 必须是抽象类；
      <InlineCode>Cat</InlineCode> 实现了 <InlineCode>eat()</InlineCode>，
      所有抽象方法都有了实现，<InlineCode>Cat</InlineCode> 才是普通类，可以被 new。
    </Paragraph>
    <Callout type="danger" title="子类漏写抽象方法的实现，编译立即报错">
      如果把 <InlineCode>Pet</InlineCode> 中的 <InlineCode>abstract</InlineCode> 去掉，
      编译器会报错：Pet is not abstract and does not override abstract method eat() in Animal。
      只要未实现父类的全部抽象方法，自身就必须加 <InlineCode>abstract</InlineCode>。
    </Callout>

    <Heading3>7. 五条注意事项综合示例</Heading3>
    <Heading4>完整演示</Heading4>
    <Paragraph>
      下面用一段代码同时演示上述五条规则，并在注释中标注对应规则编号：
    </Paragraph>
    <CodeBlock
      title="AllRulesDemo.java"
      code={`// 抽象父类：含构造方法（规则②）、普通方法 + 抽象方法共存（规则③）
public abstract class Shape {
    String color;

    public Shape(String color) {       // 规则②：抽象类可以有构造方法
        this.color = color;
    }

    public void printColor() {         // 规则③：普通方法
        System.out.println("颜色：" + color);
    }

    public abstract double getArea();  // 规则③：抽象方法
}

// 中间抽象类：没有实现 getArea()，所以仍必须是 abstract（规则⑤）
public abstract class RegularShape extends Shape {
    int sides;  // 边数

    public RegularShape(String color, int sides) {
        super(color);
        this.sides = sides;
    }

    public void printSides() {
        System.out.println("边数：" + sides);
    }
    // getArea() 未实现，RegularShape 必须是 abstract（规则⑤）
}

// 具体子类：实现了全部抽象方法，可以被 new
public class Square extends RegularShape {
    double side;

    public Square(String color, double side) {
        super(color, 4);
        this.side = side;
    }

    @Override
    public double getArea() {
        return side * side;
    }
}

public class AllRulesDemo {
    public static void main(String[] args) {
        // Shape s = new Shape("红色");           // ❌ 规则①：抽象类不能 new
        // RegularShape r = new RegularShape(...); // ❌ 规则①：抽象类不能 new

        Shape s = new Square("绿色", 5.0);  // ✅ 用子类对象
        s.printColor();
        ((RegularShape) s).printSides();    // 强转后调用中间类的方法
        System.out.printf("面积：%.1f%n", s.getArea());
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`颜色：绿色
边数：4
面积：25.0`} />

    <Callout type="success" title="五条注意事项速记">
      <OrderedList>
        <ListItem>抽象类不能 new —— 编译报错。</ListItem>
        <ListItem>抽象类可以有构造方法 —— 供子类 super() 初始化父类成员。</ListItem>
        <ListItem>普通成员与抽象方法自由共存 —— 普通方法写共用逻辑，抽象方法定行为契约。</ListItem>
        <ListItem>可以没有抽象方法 —— 只是为了禁止直接 new，实际项目中较少见。</ListItem>
        <ListItem>子类没实现全部抽象方法，子类也必须是 abstract —— 抽象向下传递。</ListItem>
      </OrderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：指出以下代码中的所有错误并修正"
      code={`// 下面代码有多处错误，请找出并说明原因，然后写出修正后的代码
public abstract class Animal {
    public abstract void eat() {    // 错误 A
        System.out.println("吃东西");
    }
    public abstract void sleep();
}

public class Dog extends Animal {   // 错误 B：缺少对某个抽象方法的实现
    @Override
    public void eat() {
        System.out.println("狗在啃骨头");
    }
    // sleep() 未实现
}

public class Demo {
    public static void main(String[] args) {
        Animal a = new Animal();    // 错误 C
        a.eat();
    }
}`}
      answerCode={`// 错误分析：
// 错误 A：抽象方法不能有方法体，不能写花括号，应去掉方法体，改为分号结尾
// 错误 B：Dog 没有实现 sleep()，但 Dog 没有声明为 abstract，必须二选一：
//         要么实现 sleep()，要么把 Dog 也声明为 abstract class Dog
// 错误 C：Animal 是抽象类，不能直接 new Animal()

// 修正方案一：Dog 实现 sleep()（更常见）
public abstract class Animal {
    public abstract void eat();      // 修正 A：去掉方法体
    public abstract void sleep();
}

public class Dog extends Animal {   // 修正 B：补全 sleep() 实现
    @Override
    public void eat() {
        System.out.println("狗在啃骨头");
    }

    @Override
    public void sleep() {
        System.out.println("狗在睡觉");
    }
}

public class Demo {
    public static void main(String[] args) {
        Animal a = new Dog();        // 修正 C：用子类对象
        a.eat();
        a.sleep();
    }
}

/* 控制台输出：
狗在啃骨头
狗在睡觉

解析：三处错误对应三条注意事项：
  A → 规则③抽象方法不能有方法体
  B → 规则⑤子类必须实现全部抽象方法，否则自身也要 abstract
  C → 规则①抽象类不能 new
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：设计抽象类 Printer，中间抽象类 ColorPrinter，具体类 InkjetPrinter"
      code={`// 要求：
// 1. 抽象类 Printer：含属性 brand，有参构造方法；
//    普通方法 powerOn() 打印"[brand] 打印机启动"；
//    抽象方法 print()、scanDocument()
// 2. 抽象类 ColorPrinter extends Printer：
//    实现 print()，打印"[brand] 彩色打印中..."；
//    不实现 scanDocument()（留给子类）
// 3. 具体类 InkjetPrinter extends ColorPrinter：
//    实现 scanDocument()，打印"[brand] 喷墨扫描中..."
// 4. main 中用 Printer 类型引用创建 InkjetPrinter("惠普")，
//    依次调用三个方法

// 补全代码
public abstract class Printer {
}

public abstract class ColorPrinter extends Printer {
}

public class InkjetPrinter extends ColorPrinter {
}

public class Exercise02 {
    public static void main(String[] args) {
    }
}`}
      answerCode={`public abstract class Printer {
    String brand;

    public Printer(String brand) {
        this.brand = brand;
    }

    public void powerOn() {
        System.out.println(brand + " 打印机启动");
    }

    public abstract void print();
    public abstract void scanDocument();
}

// ColorPrinter 实现了 print()，但没实现 scanDocument()，仍是抽象类
public abstract class ColorPrinter extends Printer {
    public ColorPrinter(String brand) {
        super(brand);
    }

    @Override
    public void print() {
        System.out.println(brand + " 彩色打印中...");
    }
    // scanDocument() 未实现，留给子类
}

// InkjetPrinter 实现了全部抽象方法，是普通类，可以被 new
public class InkjetPrinter extends ColorPrinter {
    public InkjetPrinter(String brand) {
        super(brand);
    }

    @Override
    public void scanDocument() {
        System.out.println(brand + " 喷墨扫描中...");
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        Printer p = new InkjetPrinter("惠普");
        p.powerOn();
        p.print();
        p.scanDocument();
    }
}

/* 控制台输出：
惠普 打印机启动
惠普 彩色打印中...
惠普 喷墨扫描中...

解析：Printer → ColorPrinter → InkjetPrinter 三层继承：
  Printer 有两个抽象方法；
  ColorPrinter 实现了 print()，scanDocument() 未实现，必须是 abstract（规则⑤）；
  InkjetPrinter 实现了 scanDocument()，所有抽象方法都有实现，才是普通可 new 的类。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：不含抽象方法的抽象类"
      code={`// 要求：
// 设计一个抽象类 SingletonBase，它没有任何抽象方法，
// 但声明为 abstract 是为了防止被直接实例化。
// 它含一个普通方法 describe() 打印"这是单例基类"。
// 子类 AppSingleton 继承 SingletonBase，不添加任何方法。
// main 中创建 AppSingleton 对象并调用 describe()。
// 同时在注释中说明：为什么这里要把基类声明为 abstract？

public abstract class SingletonBase {
    // 补全
}

public class AppSingleton extends SingletonBase {
    // 无需添加任何内容
}

public class Exercise03 {
    public static void main(String[] args) {
        // 补全
        // SingletonBase b = new SingletonBase(); // 这行为什么不行？
    }
}`}
      answerCode={`public abstract class SingletonBase {
    // 没有抽象方法，但加了 abstract 以禁止直接 new
    public void describe() {
        System.out.println("这是单例基类");
    }
}

public class AppSingleton extends SingletonBase {
    // 继承 SingletonBase，无需添加方法
}

public class Exercise03 {
    public static void main(String[] args) {
        SingletonBase b = new AppSingleton();  // ✅ 通过子类创建
        b.describe();

        // SingletonBase b2 = new SingletonBase(); // ❌ 编译报错
        // 原因：SingletonBase 是 abstract，即便没有抽象方法，
        //       加了 abstract 关键字后就不能被直接 new。
        //       这是规则④的应用：纯粹为了禁止实例化，与是否含抽象方法无关。
    }
}

/* 控制台输出：
这是单例基类

解析：规则④——抽象类可以没有抽象方法，abstract 关键字本身就足以禁止 new。
      这种写法在框架设计中有时用于强制用户必须继承后才能使用，
      确保运行时对象类型是某个具体子类而非基类本身。
*/`}
    />
  </article>
);

export default index;
