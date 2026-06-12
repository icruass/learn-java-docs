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
    <Title>构造方法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        每次用 <InlineCode>new</InlineCode> 关键字创建对象时，Java 都会自动调用一个特殊的方法——
        <Text bold>构造方法（Constructor，也叫构造器）</Text>。
        它的作用是在对象刚被创建时就完成初始化工作，让对象一出生就拥有合理的初始状态。
        本节讲清构造方法的格式与特点、无参构造与有参构造的区别、编译器的默认赠送规则，
        以及构造方法重载，并配合完整代码和输出演示。
      </Paragraph>
    </Callout>

    <Heading3>1. 构造方法是什么</Heading3>
    <Paragraph>
      构造方法是一种特殊的方法，专门在创建对象（<InlineCode>new 类名()</InlineCode>）时被调用，
      用来给成员变量赋初始值。它最大的特殊之处在于：<Text bold>方法名与类名完全相同，且没有任何返回值类型</Text>
      （连 <InlineCode>void</InlineCode> 都不能写）。
    </Paragraph>
    <CodeBlock
      language="text"
      title="构造方法格式"
      code={`public 类名(参数类型 参数名, ...) {
    // 初始化代码
}`}
    />
    <Table
      head={['要点', '说明']}
      rows={[
        ['方法名', '必须与类名完全相同（大小写一致）'],
        ['返回值类型', '没有返回值类型，连 void 也不能写——写了就变成普通方法了'],
        ['return', '不能 return 一个值；可以写裸的 return; 提前结束（很少用）'],
        ['调用时机', '仅在 new 对象时由 JVM 自动调用，不能像普通方法那样手动调用'],
        ['访问修饰符', '通常写 public，以便其他类可以 new 该类的对象'],
      ]}
    />
    <Callout type="danger" title="构造方法没有返回值类型">
      如果写了返回值类型（哪怕是 <InlineCode>void</InlineCode>），那它就不再是构造方法，
      而是一个和类同名的普通方法，编译器不会在 <InlineCode>new</InlineCode> 时调用它。
      这是初学者非常容易犯的错误。
    </Callout>

    <Heading3>2. 无参构造方法</Heading3>
    <Paragraph>
      不接收任何参数的构造方法称为<Text bold>无参构造方法（无参构造器）</Text>。
      使用 <InlineCode>new 类名()</InlineCode>（括号内为空）时调用的就是无参构造。
    </Paragraph>
    <CodeBlock
      title="NoArgConstructor.java"
      code={`public class NoArgConstructor {

    private String name;
    private int age;

    // 无参构造方法：不接收参数，成员变量保持默认值（null、0 等）
    public NoArgConstructor() {
        System.out.println("无参构造方法被调用了");
        // 不写任何赋值，字段保持 Java 默认值
    }

    public void show() {
        System.out.println("name=" + name + ", age=" + age);
    }

    public static void main(String[] args) {
        NoArgConstructor obj = new NoArgConstructor();  // 调用无参构造
        obj.show();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`无参构造方法被调用了
name=null, age=0`}
    />
    <Paragraph>
      对象被创建时，无参构造方法自动执行，成员变量 <InlineCode>name</InlineCode> 和
      <InlineCode>age</InlineCode> 未被赋值，保持默认值（引用类型默认 <InlineCode>null</InlineCode>，
      <InlineCode>int</InlineCode> 默认 <InlineCode>0</InlineCode>）。
    </Paragraph>

    <Heading3>3. 有参构造方法</Heading3>
    <Paragraph>
      接收参数的构造方法称为<Text bold>有参构造方法</Text>。通过它可以在创建对象的同时
      传入初始值，让对象一出生就具备完整状态，避免后续一个个调用 setter。
    </Paragraph>
    <CodeBlock
      title="Student.java（有参构造）"
      code={`public class Student {

    private String name;
    private int age;

    // 有参构造方法：接收 name 和 age，直接完成初始化
    public Student(String name, int age) {
        this.name = name;   // this.name 是成员变量，name 是形参
        this.age = age;
        System.out.println("有参构造调用：" + this.name + ", " + this.age);
    }

    public String getName() { return name; }
    public int getAge()     { return age;  }

    public void show() {
        System.out.println("学生：" + name + "，年龄：" + age);
    }
}`}
    />
    <CodeBlock
      title="StudentTest.java"
      code={`public class StudentTest {
    public static void main(String[] args) {
        // new 时直接传入初始值，调用有参构造
        Student s1 = new Student("张三", 18);
        s1.show();

        Student s2 = new Student("李四", 20);
        s2.show();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`有参构造调用：张三, 18
学生：张三，年龄：18
有参构造调用：李四, 20
学生：李四，年龄：20`}
    />

    <Heading3>4. 编译器的默认无参构造</Heading3>
    <Paragraph>
      当你定义一个类，但<Text bold>没有写任何构造方法</Text>时，Java 编译器会自动为你添加一个
      <Text bold>空的无参构造方法</Text>（方法体为空，什么都不做）。这就是为什么从来没写过构造方法，
      却可以 <InlineCode>new 类名()</InlineCode> 成功——用的就是编译器赠送的那个。
    </Paragraph>
    <CodeBlock
      language="text"
      title="编译器自动添加的无参构造（示意）"
      code={`// 你写的：
public class Cat {
    private String name;
}

// 编译器看到的（等价于）：
public class Cat {
    private String name;

    // 编译器自动赠送的无参构造，你看不到，但它存在
    public Cat() {
    }
}`}
    />
    <Callout type="danger" title="自己写了构造方法后，编译器不再赠送无参构造">
      <Paragraph>
        一旦你自己定义了<Text bold>任意一个</Text>构造方法（无论有参还是无参），
        编译器就不再自动添加无参构造了。
      </Paragraph>
      <Paragraph>
        这意味着：如果你只写了有参构造，却在别处用 <InlineCode>new 类名()</InlineCode>（无参），
        编译器会报错——<Text bold>找不到无参构造</Text>。
        所以实际开发中，通常要同时手动提供无参构造和有参构造。
      </Paragraph>
    </Callout>
    <CodeBlock
      title="编译错误演示（仅供理解）"
      code={`public class Book {
    private String title;

    // 只写了有参构造，没有无参构造
    public Book(String title) {
        this.title = title;
    }
}

// 使用时：
Book b1 = new Book("Java 编程");   // 正常，调用有参构造
Book b2 = new Book();              // 编译错误！找不到无参构造 Book()`}
    />

    <Heading3>5. 构造方法重载</Heading3>
    <Paragraph>
      与普通方法一样，构造方法也可以<Text bold>重载（Overload）</Text>——在同一个类中定义多个构造方法，
      参数列表不同（类型或数量不同），JVM 根据 <InlineCode>new</InlineCode> 时传入的参数自动匹配调用哪个。
    </Paragraph>
    <CodeBlock
      title="Student.java（无参 + 全参构造，重载）"
      code={`public class Student {

    private String name;
    private int age;
    private String gender;

    // 无参构造：创建一个"空"学生对象，后续用 setter 补充信息
    public Student() {
        System.out.println("调用了无参构造");
    }

    // 两参构造：只传 name 和 age
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
        System.out.println("调用了两参构造：" + name + ", " + age);
    }

    // 全参构造：三个字段全部初始化
    public Student(String name, int age, String gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        System.out.println("调用了全参构造：" + name + ", " + age + ", " + gender);
    }

    public void show() {
        System.out.println("姓名：" + name
                + "，年龄：" + age
                + "，性别：" + gender);
    }

    // getter / setter（省略部分以节省篇幅）
    public String getName()  { return name;   }
    public int getAge()      { return age;    }
    public String getGender(){ return gender; }
    public void setName(String name)    { this.name = name;     }
    public void setAge(int age)         { this.age = age;       }
    public void setGender(String gender){ this.gender = gender; }
}`}
    />
    <CodeBlock
      title="StudentTest.java"
      code={`public class StudentTest {
    public static void main(String[] args) {
        // 使用无参构造，再用 setter 补充数据
        Student s1 = new Student();
        s1.setName("张三");
        s1.setAge(18);
        s1.setGender("男");
        s1.show();

        System.out.println("---");

        // 使用两参构造
        Student s2 = new Student("李四", 20);
        s2.setGender("女");
        s2.show();

        System.out.println("---");

        // 使用全参构造，一次性初始化所有字段
        Student s3 = new Student("王五", 22, "男");
        s3.show();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`调用了无参构造
姓名：张三，年龄：18，性别：男
---
调用了两参构造：李四, 20
姓名：李四，年龄：20，性别：女
---
调用了全参构造：王五, 22, 男
姓名：王五，年龄：22，性别：男`}
    />

    <Heading3>6. 无参构造 vs 有参构造 对比</Heading3>
    <Table
      head={['对比维度', '无参构造', '有参构造']}
      rows={[
        ['调用方式', 'new Student()', 'new Student("张三", 18)'],
        ['初始化时机', '对象创建后需再调用 setter 赋值', '创建时直接传入初始值，一步到位'],
        ['字段初始值', '保持 Java 默认值（null / 0 等）', '由传入参数决定'],
        ['使用场景', '不确定初始值，或需要逐步配置对象', '已知所有或部分初始值，快速创建对象'],
        ['是否必须提供', '若不写任何构造，编译器自动赠送；写了有参后需手动补充', '需要时手动定义'],
      ]}
    />
    <Callout type="tip" title="实践建议：同时提供无参构造和全参构造">
      实际开发中，<Text bold>通常同时提供无参构造和全参构造</Text>，给调用者最大的灵活性：
      既可以先 new 再 setter，也可以 new 时直接传入所有值。
      这正是下一节"标准 JavaBean"的核心要求之一。
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：给 Car 类添加构造方法"
      code={`// 要求：
// 1. 定义 Car 类，私有字段：brand(String)、price(double)、year(int)。
// 2. 提供无参构造和全参构造（三个字段）。
// 3. 提供 show() 方法打印三个字段。
// 4. 在 main 中分别用两种方式创建 Car 对象并调用 show()。

public class Car {
    // 在这里补全代码
}

public class CarTest {
    public static void main(String[] args) {
        // 方式一：无参构造 + setter
        // 方式二：全参构造
    }
}`}
      answerCode={`public class Car {
    private String brand;
    private double price;
    private int year;

    // 无参构造
    public Car() {
    }

    // 全参构造
    public Car(String brand, double price, int year) {
        this.brand = brand;
        this.price = price;
        this.year  = year;
    }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public void show() {
        System.out.println("品牌：" + brand + "，价格：" + price + "，年份：" + year);
    }
}

public class CarTest {
    public static void main(String[] args) {
        // 方式一：无参构造 + setter
        Car c1 = new Car();
        c1.setBrand("丰田");
        c1.setPrice(180000.0);
        c1.setYear(2022);
        c1.show();

        // 方式二：全参构造
        Car c2 = new Car("比亚迪", 150000.0, 2023);
        c2.show();
    }
}

/* 控制台输出：
品牌：丰田，价格：180000.0，年份：2022
品牌：比亚迪，价格：150000.0，年份：2023
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：分析构造方法的调用顺序与输出"
      code={`// 预测下面代码的控制台输出，并说明每行输出的原因。

public class Box {
    private int width;
    private int height;

    public Box() {
        System.out.println("无参构造：width=" + width + ", height=" + height);
    }

    public Box(int width, int height) {
        this.width  = width;
        this.height = height;
        System.out.println("有参构造：width=" + width + ", height=" + height);
    }

    public int area() {
        return width * height;
    }
}

// main 中：
// Box b1 = new Box();
// Box b2 = new Box(4, 5);
// System.out.println("b1 面积：" + b1.area());
// System.out.println("b2 面积：" + b2.area());`}
      answerCode={`/* 控制台输出：
无参构造：width=0, height=0
有参构造：width=4, height=5
b1 面积：0
b2 面积：20

逐步分析：
1. new Box() 调用无参构造，此时 width 和 height 均为默认值 0，打印第 1 行。
2. new Box(4, 5) 调用有参构造，width=4, height=5，打印第 2 行。
3. b1.area() = 0 * 0 = 0，打印第 3 行。
4. b2.area() = 4 * 5 = 20，打印第 4 行。

注意：无参构造没有给字段赋值，int 字段默认值是 0，所以 b1.area() 为 0。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：修复因缺少无参构造导致的编译错误"
      code={`// 下面代码有编译错误，请找出原因并修复。

public class Phone {
    private String model;
    private double screenSize;

    // 只定义了有参构造
    public Phone(String model, double screenSize) {
        this.model      = model;
        this.screenSize = screenSize;
    }

    public void show() {
        System.out.println("型号：" + model + "，屏幕：" + screenSize);
    }
}

public class PhoneTest {
    public static void main(String[] args) {
        Phone p1 = new Phone();              // 第一行：有没有问题？
        p1.setModel("iPhone 15");
        p1.setScreenSize(6.1);
        p1.show();

        Phone p2 = new Phone("小米14", 6.36);  // 第二行：有没有问题？
        p2.show();
    }
}`}
      answerCode={`/* 错误分析：
  Phone 类只定义了有参构造，编译器不再赠送无参构造。
  PhoneTest 第一行 new Phone() 找不到无参构造 —— 编译错误。
  另外 Phone 类没有提供 setModel/setScreenSize，调用也会报错。

修复方案：在 Phone 类中手动添加无参构造，并补充 setter：
*/

public class Phone {
    private String model;
    private double screenSize;

    // 补充无参构造（手动添加，因为有了有参构造编译器不再自动赠送）
    public Phone() {
    }

    public Phone(String model, double screenSize) {
        this.model      = model;
        this.screenSize = screenSize;
    }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public double getScreenSize() { return screenSize; }
    public void setScreenSize(double screenSize) { this.screenSize = screenSize; }

    public void show() {
        System.out.println("型号：" + model + "，屏幕：" + screenSize);
    }
}

public class PhoneTest {
    public static void main(String[] args) {
        Phone p1 = new Phone();
        p1.setModel("iPhone 15");
        p1.setScreenSize(6.1);
        p1.show();

        Phone p2 = new Phone("小米14", 6.36);
        p2.show();
    }
}

/* 控制台输出：
型号：iPhone 15，屏幕：6.1
型号：小米14，屏幕：6.36
*/`}
    />
  </article>
);

export default index;
