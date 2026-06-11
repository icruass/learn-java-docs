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
    <Title>定义一个标准的类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        学完封装、this、构造方法之后，是时候把它们整合在一起，写出一个
        <Text bold>标准的 Java 实体类（JavaBean）</Text>。
        JavaBean 是 Java 开发中最基础、最常见的类结构，几乎所有框架（Spring、MyBatis 等）
        都要求实体类满足这套规范。本节介绍标准类的四大要素，给出完整的
        <InlineCode>Student</InlineCode> 类范例，再演示测试类用两种不同方式创建并使用对象，
        让你对整个封装体系有一个完整的认识。
      </Paragraph>
    </Callout>

    <Heading3>1. 标准 JavaBean 四大要素</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>所有成员变量用 private 修饰</Text>——隐藏内部细节，防止外部直接读写。
      </ListItem>
      <ListItem>
        <Text bold>提供无参构造方法</Text>——框架（如 MyBatis、Jackson）通过反射创建对象时默认调用无参构造；
        同时也为"先创建再 setter 赋值"的使用方式提供支持。
      </ListItem>
      <ListItem>
        <Text bold>提供全参构造方法</Text>——允许调用者一行代码创建并初始化完整对象，方便快捷。
      </ListItem>
      <ListItem>
        <Text bold>为每个成员变量提供 getXxx() / setXxx() 方法</Text>——对外暴露受控的读写接口，
        setter 中可以加合法性校验。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="可选的第五要素：toString() 方法">
      很多时候还会加上 <InlineCode>toString()</InlineCode> 方法（覆盖 Object 的默认实现），
      以便打印对象时直接看到有意义的内容而不是内存地址。本节末尾会演示这一点，
      <InlineCode>toString()</InlineCode> 的完整讲解见"面向对象进阶"章节。
    </Callout>

    <Heading3>2. 标准 JavaBean 完整范例</Heading3>
    <Heading4>第一步：定义标准类 Student</Heading4>
    <Paragraph>
      字段：<InlineCode>name</InlineCode>（姓名）、<InlineCode>age</InlineCode>（年龄）、
      <InlineCode>gender</InlineCode>（性别）、<InlineCode>score</InlineCode>（成绩）。
    </Paragraph>
    <CodeBlock
      title="Student.java（完整标准类）"
      code={`public class Student {

    // ===== 要素一：所有成员变量 private =====
    private String name;
    private int    age;
    private String gender;
    private double score;

    // ===== 要素二：无参构造方法 =====
    public Student() {
    }

    // ===== 要素三：全参构造方法 =====
    public Student(String name, int age, String gender, double score) {
        this.name   = name;
        this.age    = age;
        this.gender = gender;
        this.score  = score;
    }

    // ===== 要素四：每个字段的 getter / setter =====

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        if (age < 0 || age > 150) {
            System.out.println("年龄不合法：" + age);
            return;
        }
        this.age = age;
    }

    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    public double getScore() {
        return score;
    }
    public void setScore(double score) {
        if (score < 0.0 || score > 100.0) {
            System.out.println("成绩不合法：" + score);
            return;
        }
        this.score = score;
    }

    // ===== 可选：展示方法 =====
    public void show() {
        System.out.println("姓名：" + name
                + "，年龄：" + age
                + "，性别：" + gender
                + "，成绩：" + score);
    }
}`}
    />

    <Heading4>第二步：编写测试类，用两种方式创建对象</Heading4>
    <CodeBlock
      title="StudentTest.java"
      code={`public class StudentTest {
    public static void main(String[] args) {

        // ===== 方式一：无参构造 + setter 逐个赋值 =====
        Student s1 = new Student();   // 调用无参构造
        s1.setName("张三");
        s1.setAge(18);
        s1.setGender("男");
        s1.setScore(92.5);
        System.out.println("--- 方式一创建 ---");
        s1.show();

        // 验证 setter 校验功能
        s1.setAge(-5);     // 非法，被拦截
        s1.setScore(110);  // 非法，被拦截
        System.out.println("尝试非法赋值后：");
        s1.show();         // age 和 score 保持原值

        System.out.println();

        // ===== 方式二：全参构造，一行创建并初始化 =====
        Student s2 = new Student("李四", 20, "女", 88.0);
        System.out.println("--- 方式二创建 ---");
        s2.show();

        // 通过 getter 读取单个字段
        System.out.println("李四的成绩是：" + s2.getScore());

        System.out.println();

        // ===== 方式三：全参构造创建后再用 setter 修改部分字段 =====
        Student s3 = new Student("王五", 22, "男", 75.0);
        System.out.println("--- 修改前 ---");
        s3.show();
        s3.setScore(80.0);  // 成绩更新
        System.out.println("--- 修改后 ---");
        s3.show();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`--- 方式一创建 ---
姓名：张三，年龄：18，性别：男，成绩：92.5
年龄不合法：-5
成绩不合法：110.0
尝试非法赋值后：
姓名：张三，年龄：18，性别：男，成绩：92.5

--- 方式二创建 ---
姓名：李四，年龄：20，性别：女，成绩：88.0
李四的成绩是：88.0

--- 修改前 ---
姓名：王五，年龄：22，性别：男，成绩：75.0
--- 修改后 ---
姓名：王五，年龄：22，性别：男，成绩：80.0`}
    />
    <Paragraph>
      方式一体现了"灵活性"：先创建空对象，再一个个 setter；
      方式二体现了"便捷性"：构造时一次性传入所有值；
      方式三展示了全参构造创建后仍可通过 setter 修改局部字段。三种方式可根据需要自由选择。
    </Paragraph>

    <Heading3>3. 为什么要同时提供两种构造方法</Heading3>
    <Table
      head={['使用场景', '推荐方式']}
      rows={[
        ['创建时已知所有初始值', '全参构造，一行搞定，简洁'],
        ['创建时只知道部分值，后续补充', '无参构造 + setter，灵活'],
        ['框架（Spring/MyBatis）通过反射创建对象', '必须有无参构造，否则框架报错'],
        ['想对字段赋值做合法性校验', '无论哪种构造后，通过 setter 校验'],
      ]}
    />
    <Callout type="warning" title="全参构造中也可以加校验">
      严格来说，全参构造的参数也可能是非法值。如果需要，可以在全参构造中加校验逻辑。
      本节为简洁起见未加，实际项目中视情况决定。
    </Callout>

    <Heading3>4. 另一个完整范例：Phone 类</Heading3>
    <Paragraph>
      再给出一个 <InlineCode>Phone</InlineCode>（手机）类的完整示范，巩固标准类写法。
    </Paragraph>
    <CodeBlock
      title="Phone.java"
      code={`public class Phone {

    private String brand;       // 品牌
    private String model;       // 型号
    private double price;       // 价格（元）
    private double screenSize;  // 屏幕尺寸（英寸）

    // 无参构造
    public Phone() {
    }

    // 全参构造
    public Phone(String brand, String model, double price, double screenSize) {
        this.brand      = brand;
        this.model      = model;
        this.price      = price;
        this.screenSize = screenSize;
    }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public double getPrice() { return price; }
    public void setPrice(double price) {
        if (price < 0) {
            System.out.println("价格不能为负：" + price);
            return;
        }
        this.price = price;
    }

    public double getScreenSize() { return screenSize; }
    public void setScreenSize(double screenSize) {
        if (screenSize <= 0) {
            System.out.println("屏幕尺寸不合法：" + screenSize);
            return;
        }
        this.screenSize = screenSize;
    }

    public void show() {
        System.out.println(brand + " " + model
                + " | 价格：" + price + " 元"
                + " | 屏幕：" + screenSize + " 英寸");
    }
}`}
    />
    <CodeBlock
      title="PhoneTest.java"
      code={`public class PhoneTest {
    public static void main(String[] args) {
        // 全参构造
        Phone p1 = new Phone("苹果", "iPhone 15", 5999.0, 6.1);
        p1.show();

        // 无参构造 + setter
        Phone p2 = new Phone();
        p2.setBrand("华为");
        p2.setModel("Mate 60");
        p2.setPrice(6499.0);
        p2.setScreenSize(6.69);
        p2.show();

        // 非法价格
        p1.setPrice(-100);
        System.out.println("非法赋值后 p1 价格：" + p1.getPrice());  // 仍是 5999.0
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`苹果 iPhone 15 | 价格：5999.0 元 | 屏幕：6.1 英寸
华为 Mate 60 | 价格：6499.0 元 | 屏幕：6.69 英寸
价格不能为负：-100.0
非法赋值后 p1 价格：5999.0`}
    />

    <Heading3>5. 标准类四要素总结</Heading3>
    <Callout type="success" title="标准 JavaBean 四要素口诀">
      <UnorderedList>
        <ListItem>
          <Text bold>私有字段</Text>：所有成员变量加 <InlineCode>private</InlineCode>，隐藏细节。
        </ListItem>
        <ListItem>
          <Text bold>无参构造</Text>：必须手动提供（写了有参构造后编译器不再赠送），供框架和灵活使用场景调用。
        </ListItem>
        <ListItem>
          <Text bold>全参构造</Text>：方便一行代码创建完整对象。
        </ListItem>
        <ListItem>
          <Text bold>getter / setter</Text>：每个字段配一对，setter 中按需加校验，提供受控的读写接口。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：从零写一个标准的 Book 类"
      code={`// 要求：
// 1. 定义 Book 类，字段：title(String)、author(String)、price(double)、pages(int)。
// 2. 满足标准 JavaBean 四要素（private 字段、无参构造、全参构造、getter/setter）。
// 3. setPrice() 校验价格不能为负；setPages() 校验页数必须大于 0。
// 4. 提供 show() 展示方法。
// 5. 在 BookTest 中用两种方式各创建一个 Book 对象并调用 show()，
//    同时测试一次非法 setPrice()。

public class Book {
    // 在这里补全代码
}

public class BookTest {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Book {
    private String title;
    private String author;
    private double price;
    private int    pages;

    public Book() {
    }

    public Book(String title, String author, double price, int pages) {
        this.title  = title;
        this.author = author;
        this.price  = price;
        this.pages  = pages;
    }

    public String getTitle()  { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public double getPrice()  { return price; }
    public void setPrice(double price) {
        if (price < 0) {
            System.out.println("价格不能为负：" + price);
            return;
        }
        this.price = price;
    }

    public int getPages() { return pages; }
    public void setPages(int pages) {
        if (pages <= 0) {
            System.out.println("页数必须大于 0：" + pages);
            return;
        }
        this.pages = pages;
    }

    public void show() {
        System.out.println("《" + title + "》 作者：" + author
                + " | 价格：" + price + " 元 | 页数：" + pages);
    }
}

public class BookTest {
    public static void main(String[] args) {
        // 方式一：全参构造
        Book b1 = new Book("Java 编程思想", "Bruce Eckel", 108.0, 880);
        b1.show();

        // 方式二：无参构造 + setter
        Book b2 = new Book();
        b2.setTitle("深入理解 Java 虚拟机");
        b2.setAuthor("周志明");
        b2.setPrice(89.0);
        b2.setPages(464);
        b2.show();

        // 测试非法价格
        b1.setPrice(-10.0);
        System.out.println("非法赋值后 b1 价格：" + b1.getPrice());
    }
}

/* 控制台输出：
《Java 编程思想》 作者：Bruce Eckel | 价格：108.0 元 | 页数：880
《深入理解 Java 虚拟机》 作者：周志明 | 价格：89.0 元 | 页数：464
价格不能为负：-10.0
非法赋值后 b1 价格：108.0
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：找出标准类中不符合规范的地方"
      code={`// 下面的 Employee 类不完全符合 JavaBean 规范，请找出所有问题并修复。

public class Employee {
    public String name;          // 问题 1？
    private int age;
    private double salary;

    // 问题 2？（缺少什么构造方法）
    public Employee(String name, int age, double salary) {
        this.name   = name;
        this.age    = age;
        this.salary = salary;
    }

    public String getName() { return name; }
    // 问题 3？（name 的 setter 在哪里）

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    // 问题 4？（salary 的 getter/setter 在哪里）

    public void show() {
        System.out.println(name + "，年龄：" + age + "，薪资：" + salary);
    }
}`}
      answerCode={`/* 问题列表：
  1. name 是 public，违反"所有成员变量私有"原则，应改为 private。
  2. 缺少无参构造（写了有参构造后编译器不再赠送），应手动添加。
  3. 缺少 name 的 setName() 方法。
  4. 缺少 salary 的 getScore()/setSalary() 方法。

修复后的完整代码：
*/

public class Employee {
    private String name;        // 修复 1：改为 private
    private int age;
    private double salary;

    // 修复 2：补充无参构造
    public Employee() {
    }

    public Employee(String name, int age, double salary) {
        this.name   = name;
        this.age    = age;
        this.salary = salary;
    }

    public String getName() { return name; }
    // 修复 3：补充 setName
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    // 修复 4：补充 salary 的 getter/setter
    public double getSalary() { return salary; }
    public void setSalary(double salary) {
        if (salary < 0) {
            System.out.println("薪资不能为负：" + salary);
            return;
        }
        this.salary = salary;
    }

    public void show() {
        System.out.println(name + "，年龄：" + age + "，薪资：" + salary);
    }
}

/* 示例输出（无参构造 + setter 方式）：
Employee e = new Employee();
e.setName("小明");
e.setAge(28);
e.setSalary(12000.0);
e.show();
// 输出：小明，年龄：28，薪资：12000.0
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：创建标准类 Rectangle 并计算面积与周长"
      code={`// 要求：
// 1. 定义 Rectangle（矩形）标准类，字段：width(double)、height(double)。
// 2. 满足 JavaBean 四要素；setWidth/setHeight 校验值必须大于 0。
// 3. 提供 area()（面积 = width * height）和 perimeter()（周长 = 2*(width+height)）方法。
// 4. 在 main 中创建两个矩形：
//    第一个用全参构造（width=4.0, height=3.0），打印面积和周长。
//    第二个用无参构造，setWidth(-1.0)（非法），再 setWidth(5.0)，setHeight(2.0)，打印面积和周长。

public class Rectangle {
    // 在这里补全代码
}

public class RectangleTest {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Rectangle {
    private double width;
    private double height;

    public Rectangle() {
    }

    public Rectangle(double width, double height) {
        this.width  = width;
        this.height = height;
    }

    public double getWidth() { return width; }
    public void setWidth(double width) {
        if (width <= 0) {
            System.out.println("宽度必须大于 0：" + width);
            return;
        }
        this.width = width;
    }

    public double getHeight() { return height; }
    public void setHeight(double height) {
        if (height <= 0) {
            System.out.println("高度必须大于 0：" + height);
            return;
        }
        this.height = height;
    }

    public double area() {
        return width * height;
    }

    public double perimeter() {
        return 2 * (width + height);
    }
}

public class RectangleTest {
    public static void main(String[] args) {
        // 全参构造
        Rectangle r1 = new Rectangle(4.0, 3.0);
        System.out.println("r1 面积：" + r1.area() + "，周长：" + r1.perimeter());

        // 无参构造 + setter（含非法赋值）
        Rectangle r2 = new Rectangle();
        r2.setWidth(-1.0);   // 非法，被拦截
        r2.setWidth(5.0);    // 合法
        r2.setHeight(2.0);
        System.out.println("r2 面积：" + r2.area() + "，周长：" + r2.perimeter());
    }
}

/* 控制台输出：
r1 面积：12.0，周长：14.0
宽度必须大于 0：-1.0
r2 面积：10.0，周长：14.0

解析：
  r1：4 * 3 = 12，2*(4+3) = 14。
  r2：setWidth(-1.0) 被校验拦截，width 保持默认值 0.0，随后 setWidth(5.0) 成功。
  r2 面积 = 5.0 * 2.0 = 10.0，周长 = 2*(5+2) = 14.0。
*/`}
    />
  </article>
);

export default index;
