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
    <Title>抽象类的定义与使用</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        在继承体系中，父类往往只能描述子类"应该具备某个行为"，却无法给出合理的通用实现——
        比如动物都会"吃"，但猫和狗吃的方式差异悬殊，父类写什么内容都是强行凑数。
        Java 提供了<Text bold>抽象类（abstract class）</Text>和<Text bold>抽象方法（abstract method）</Text>机制，
        让父类只声明"有这个方法"，强制子类必须自行实现，从而在语言层面保证了多态的契约。
        本节掌握抽象类与抽象方法的定义语法、使用步骤，以及结合多态调用的完整写法。
      </Paragraph>
    </Callout>

    <Heading3>1. 抽象方法</Heading3>
    <Paragraph>
      <Text bold>抽象方法</Text>是只有方法声明、没有方法体的方法，用 <InlineCode>abstract</InlineCode> 关键字修饰。
      它相当于一份"行为契约"：声明子类必须实现该方法，但不规定怎么实现。
    </Paragraph>
    <CodeBlock
      language="text"
      title="抽象方法格式"
      code={`public abstract 返回值类型 方法名(参数列表);
// 注意：没有方法体，直接以分号结束，花括号都不写`}
    />
    <Paragraph>
      例如，声明一个"动物吃东西"的抽象方法：
    </Paragraph>
    <CodeBlock
      language="text"
      title="示例：抽象方法声明"
      code={`public abstract void eat();`}
    />
    <Callout type="danger" title="抽象方法绝不能有方法体">
      抽象方法后面直接跟分号，不能写花括号——
      哪怕是空的花括号也不行，空花括号意味着"有方法体但逻辑为空"，与抽象方法的语义相悖，
      编译器会直接报错。
    </Callout>

    <Heading3>2. 抽象类</Heading3>
    <Paragraph>
      <Text bold>含有抽象方法的类必须用 <InlineCode>abstract</InlineCode> 修饰，称为抽象类。</Text>
      抽象类同样可以拥有普通成员变量、普通方法、构造方法——它只是比普通类多了"可以含有抽象方法"的能力，
      以及"不能被直接 new"的限制。
    </Paragraph>
    <CodeBlock
      language="text"
      title="抽象类格式"
      code={`public abstract class 类名 {
    // 可以有普通成员变量
    // 可以有普通方法
    // 可以有构造方法
    // 可以有抽象方法（必须以 abstract 修饰且无方法体）
    public abstract 返回值类型 方法名(参数列表);
}`}
    />
    <Table
      head={['对比项', '普通类', '抽象类']}
      rows={[
        ['关键字', '无特殊修饰', 'abstract 修饰'],
        ['能否直接 new', '能', '不能'],
        ['能否有普通方法', '能', '能'],
        ['能否有抽象方法', '不能', '能'],
        ['能否有构造方法', '能', '能（供子类 super() 调用）'],
        ['用途', '直接使用', '作为父类被继承，定义行为契约'],
      ]}
    />
    <Callout type="warning" title="抽象类不能直接 new">
      抽象类无法被实例化：<InlineCode>new Animal()</InlineCode>（假设 Animal 是抽象类）会在编译期直接报错。
      原因很简单——抽象方法没有方法体，如果允许创建对象，调用抽象方法时就无法执行任何逻辑。
    </Callout>

    <Heading3>3. 抽象类的使用步骤</Heading3>
    <Paragraph>
      抽象类的正确使用分三步，缺一不可：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>定义子类，用 extends 继承抽象父类。</Text>
      </ListItem>
      <ListItem>
        <Text bold>在子类中重写（实现）父类的所有抽象方法</Text>，每个抽象方法都补全方法体。
      </ListItem>
      <ListItem>
        <Text bold>创建子类对象来使用。</Text>可以用普通方式 <InlineCode>Cat c = new Cat();</InlineCode>，
        也可以用多态方式 <InlineCode>Animal a = new Cat();</InlineCode>（推荐，体现面向抽象编程）。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="多态引用：Animal a = new Cat()">
      用父类（抽象类）类型的变量引用子类对象，编译期只看父类的方法声明，
      运行期自动执行子类的具体实现。这是 Java 面向对象多态特性的核心体现，
      也是抽象类最重要的使用场景。
    </Callout>

    <Heading3>4. 示例代码</Heading3>
    <Heading4>示例 1：Animal 抽象类 → Cat / Dog 子类</Heading4>
    <Paragraph>
      定义抽象父类 <InlineCode>Animal</InlineCode>，包含抽象方法 <InlineCode>eat()</InlineCode> 和
      普通方法 <InlineCode>breathe()</InlineCode>；
      子类 <InlineCode>Cat</InlineCode> 和 <InlineCode>Dog</InlineCode> 各自实现 <InlineCode>eat()</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="Animal.java"
      code={`public abstract class Animal {
    String name;

    // 普通方法：所有动物共用同一套呼吸逻辑
    public void breathe() {
        System.out.println(name + " 在呼吸：吸气 → 呼气");
    }

    // 抽象方法：只有声明，没有方法体，强制子类实现
    public abstract void eat();
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat extends Animal {

    // 必须重写父类全部抽象方法，否则 Cat 也得声明为 abstract
    @Override
    public void eat() {
        System.out.println(name + " 优雅地舔食猫粮");
    }
}`}
    />
    <CodeBlock
      title="Dog.java"
      code={`public class Dog extends Animal {

    @Override
    public void eat() {
        System.out.println(name + " 大口大口地啃骨头");
    }
}`}
    />
    <CodeBlock
      title="AbstractDemo.java"
      code={`public class AbstractDemo {
    public static void main(String[] args) {
        // 用多态方式创建对象：父类引用指向子类对象
        Animal a1 = new Cat();
        a1.name = "小白";
        a1.breathe();   // 调用父类普通方法
        a1.eat();       // 运行时执行 Cat 的 eat()

        System.out.println("---");

        Animal a2 = new Dog();
        a2.name = "旺财";
        a2.breathe();   // 调用父类普通方法
        a2.eat();       // 运行时执行 Dog 的 eat()

        System.out.println("---");

        // 也可以直接用子类类型声明变量
        Cat cat = new Cat();
        cat.name = "橘猫";
        cat.eat();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`小白 在呼吸：吸气 → 呼气
小白 优雅地舔食猫粮
---
旺财 在呼吸：吸气 → 呼气
旺财 大口大口地啃骨头
---
橘猫 优雅地舔食猫粮`} />
    <Paragraph>
      <InlineCode>a1.eat()</InlineCode> 和 <InlineCode>a2.eat()</InlineCode> 声明的类型都是
      <InlineCode>Animal</InlineCode>，但运行时 JVM 根据对象的实际类型（Cat / Dog）分别调用各自的
      <InlineCode>eat()</InlineCode>，输出内容不同——这正是多态的魔力：
      对外统一用 <InlineCode>Animal</InlineCode> 接口，内部行为各有不同。
    </Paragraph>

    <Heading4>示例 2：抽象类含多个抽象方法，子类必须全部实现</Heading4>
    <Paragraph>
      当抽象类有多个抽象方法时，子类必须<Text bold>全部实现</Text>，一个都不能少。
      下面以 <InlineCode>Shape</InlineCode>（图形）为例，含 <InlineCode>getArea()</InlineCode> 和
      <InlineCode>printInfo()</InlineCode> 两个抽象方法，并通过构造方法初始化颜色：
    </Paragraph>
    <CodeBlock
      title="Shape.java"
      code={`public abstract class Shape {
    String color;

    // 构造方法：供子类通过 super() 初始化颜色
    public Shape(String color) {
        this.color = color;
    }

    // 抽象方法 1：计算面积（子类各自实现公式）
    public abstract double getArea();

    // 抽象方法 2：打印图形信息（子类各自实现）
    public abstract void printInfo();

    // 普通方法：打印颜色（所有子类共用）
    public void printColor() {
        System.out.println("颜色：" + color);
    }
}`}
    />
    <CodeBlock
      title="Circle.java"
      code={`public class Circle extends Shape {
    double radius;

    public Circle(String color, double radius) {
        super(color);           // 调用父类构造方法初始化 color
        this.radius = radius;
    }

    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }

    @Override
    public void printInfo() {
        System.out.printf("圆形 半径=%.1f 面积=%.2f%n", radius, getArea());
    }
}`}
    />
    <CodeBlock
      title="Rectangle.java"
      code={`public class Rectangle extends Shape {
    double width;
    double height;

    public Rectangle(String color, double width, double height) {
        super(color);
        this.width  = width;
        this.height = height;
    }

    @Override
    public double getArea() {
        return width * height;
    }

    @Override
    public void printInfo() {
        System.out.printf("矩形 宽=%.1f 高=%.1f 面积=%.2f%n", width, height, getArea());
    }
}`}
    />
    <CodeBlock
      title="ShapeDemo.java"
      code={`public class ShapeDemo {
    public static void main(String[] args) {
        Shape s1 = new Circle("红色", 5.0);
        s1.printColor();
        s1.printInfo();

        System.out.println("---");

        Shape s2 = new Rectangle("蓝色", 4.0, 3.0);
        s2.printColor();
        s2.printInfo();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`颜色：红色
圆形 半径=5.0 面积=78.54
---
颜色：蓝色
矩形 宽=4.0 高=3.0 面积=12.00`} />
    <Paragraph>
      <InlineCode>Shape</InlineCode> 的构造方法通过 <InlineCode>super(color)</InlineCode> 被子类调用，
      为 <InlineCode>color</InlineCode> 赋值——这说明抽象类虽然不能被直接 new，
      但其构造方法在子类对象创建时仍然会被执行，承担父类成员的初始化工作。
    </Paragraph>

    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>抽象方法：<InlineCode>public abstract 返回值类型 方法名();</InlineCode>，无方法体，分号结尾。</ListItem>
        <ListItem>含抽象方法的类必须用 <InlineCode>abstract</InlineCode> 修饰；抽象类不能直接 new。</ListItem>
        <ListItem>子类继承抽象类后，必须重写全部抽象方法（否则子类也要声明为 abstract）。</ListItem>
        <ListItem>最佳实践：用多态 <InlineCode>Animal a = new Cat();</InlineCode> 引用子类对象，面向抽象编程。</ListItem>
        <ListItem>抽象类可以有普通成员变量、普通方法、构造方法，与普通类高度相似，只是多了抽象方法的能力。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：定义抽象类 Vehicle 及子类 Car、Bicycle"
      code={`// 要求：
// 1. 定义抽象类 Vehicle，含普通属性 brand（品牌），
//    抽象方法 move()，普通方法 printBrand() 打印"品牌：xxx"
// 2. 子类 Car 重写 move()，打印"[brand] 汽车在公路上飞驰"
// 3. 子类 Bicycle 重写 move()，打印"[brand] 自行车在小路上行驶"
// 4. main 中用多态方式分别创建 Car(品牌"宝马") 和 Bicycle(品牌"捷安特")，
//    各自调用 printBrand() 和 move()

public abstract class Vehicle {
    String brand;
    // 补全：普通方法 printBrand()
    // 补全：抽象方法 move()
}

public class Car extends Vehicle {
    // 补全 move()
}

public class Bicycle extends Vehicle {
    // 补全 move()
}

public class Exercise01 {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`public abstract class Vehicle {
    String brand;

    public void printBrand() {
        System.out.println("品牌：" + brand);
    }

    public abstract void move();
}

public class Car extends Vehicle {
    @Override
    public void move() {
        System.out.println(brand + " 汽车在公路上飞驰");
    }
}

public class Bicycle extends Vehicle {
    @Override
    public void move() {
        System.out.println(brand + " 自行车在小路上行驶");
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Vehicle v1 = new Car();
        v1.brand = "宝马";
        v1.printBrand();
        v1.move();

        System.out.println("---");

        Vehicle v2 = new Bicycle();
        v2.brand = "捷安特";
        v2.printBrand();
        v2.move();
    }
}

/* 控制台输出：
品牌：宝马
宝马 汽车在公路上飞驰
---
品牌：捷安特
捷安特 自行车在小路上行驶

解析：Vehicle 是抽象类，不能直接 new Vehicle()；
      Car 和 Bicycle 各自重写了 move()，通过多态引用 v1、v2 调用时
      运行时分别执行各自的 move() 实现，输出各不相同。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：抽象类 Employee，子类按规则计算工资"
      code={`// 要求：
// 1. 定义抽象类 Employee，含属性 name，
//    抽象方法 double getSalary()，
//    普通方法 printSalary() 打印"[name] 本月工资：[salary] 元"
// 2. 子类 FullTimeEmployee（全职）：构造方法接收月薪 monthlySalary，
//    getSalary() 直接返回 monthlySalary
// 3. 子类 PartTimeEmployee（兼职）：构造方法接收日薪 dailySalary 和工作天数 workDays，
//    getSalary() 返回 dailySalary * workDays
// 4. main 中创建全职员工"张三"月薪 8000，
//    兼职员工"李四"日薪 300 工作 15 天，分别调用 printSalary()

public abstract class Employee {
    String name;
    // 补全抽象方法 getSalary()
    // 补全普通方法 printSalary()
}

public class FullTimeEmployee extends Employee {
    // 补全
}

public class PartTimeEmployee extends Employee {
    // 补全
}

public class Exercise02 {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`public abstract class Employee {
    String name;

    public abstract double getSalary();

    public void printSalary() {
        System.out.println(name + " 本月工资：" + getSalary() + " 元");
    }
}

public class FullTimeEmployee extends Employee {
    double monthlySalary;

    public FullTimeEmployee(String name, double monthlySalary) {
        this.name          = name;
        this.monthlySalary = monthlySalary;
    }

    @Override
    public double getSalary() {
        return monthlySalary;
    }
}

public class PartTimeEmployee extends Employee {
    double dailySalary;
    int    workDays;

    public PartTimeEmployee(String name, double dailySalary, int workDays) {
        this.name        = name;
        this.dailySalary = dailySalary;
        this.workDays    = workDays;
    }

    @Override
    public double getSalary() {
        return dailySalary * workDays;
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        Employee e1 = new FullTimeEmployee("张三", 8000);
        e1.printSalary();

        Employee e2 = new PartTimeEmployee("李四", 300, 15);
        e2.printSalary();
    }
}

/* 控制台输出：
张三 本月工资：8000.0 元
李四 本月工资：4500.0 元

解析：printSalary() 在抽象父类中定义，内部调用抽象方法 getSalary()。
      运行时 e1.getSalary() 执行 FullTimeEmployee 的版本返回 8000，
      e2.getSalary() 执行 PartTimeEmployee 的版本返回 300*15=4500。
      父类的普通方法通过多态调用了各子类的具体实现——这是「模板方法模式」的雏形。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：抽象类 Phone，子类 SmartPhone 实现全部抽象方法"
      code={`// 要求：
// 1. 定义抽象类 Phone，含属性 model（型号），
//    抽象方法：call()、sendMessage()，
//    普通方法：powerOn() 打印"[model] 开机中..."
// 2. 子类 SmartPhone：
//    重写 call() 打印"[model] 正在语音通话"
//    重写 sendMessage() 打印"[model] 正在发送微信消息"
// 3. main 中用多态创建 SmartPhone(model="iPhone16")，依次调用三个方法

public abstract class Phone {
    String model;
    // 补全
}

public class SmartPhone extends Phone {
    // 补全
}

public class Exercise03 {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`public abstract class Phone {
    String model;

    public void powerOn() {
        System.out.println(model + " 开机中...");
    }

    public abstract void call();
    public abstract void sendMessage();
}

public class SmartPhone extends Phone {
    @Override
    public void call() {
        System.out.println(model + " 正在语音通话");
    }

    @Override
    public void sendMessage() {
        System.out.println(model + " 正在发送微信消息");
    }
}

public class Exercise03 {
    public static void main(String[] args) {
        Phone p = new SmartPhone();
        p.model = "iPhone16";
        p.powerOn();
        p.call();
        p.sendMessage();
    }
}

/* 控制台输出：
iPhone16 开机中...
iPhone16 正在语音通话
iPhone16 正在发送微信消息

解析：SmartPhone 必须同时重写 call() 和 sendMessage() 两个抽象方法，
      缺少任何一个都会导致编译报错（编译器要求 SmartPhone 也声明为 abstract）。
      powerOn() 是普通方法，SmartPhone 直接继承父类版本，无需重写。
*/`}
    />
  </article>
);

export default index;
