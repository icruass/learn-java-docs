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
    <Title>成员内部类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 允许把一个类定义在另一个类的内部，这种类称为<Text bold>内部类（Inner Class）</Text>。
        内部类按定义位置的不同，分为成员内部类、局部内部类、匿名内部类和静态嵌套类四种。
        本节聚焦最基础的一种——<Text bold>成员内部类</Text>：定义在外部类的成员位置（类中方法外），
        与成员变量、成员方法并列。掌握它的定义方式、创建格式以及访问规则，是理解其他内部类的基础。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是内部类</Heading3>
    <Paragraph>
      内部类就是<Text bold>定义在另一个类内部的类</Text>。
      包含内部类的那个类称为<Text bold>外部类（Outer Class）</Text>。
      内部类与外部类之间有天然的访问特权——内部类可以直接访问外部类的所有成员（包括
      <InlineCode>private</InlineCode> 修饰的），这是普通类做不到的。
    </Paragraph>
    <Table
      head={['分类', '定义位置', '本节是否涉及']}
      rows={[
        ['成员内部类', '外部类的成员位置（类中方法外）', '是，本节重点'],
        ['局部内部类', '某个方法的内部（局部位置）', '下一节'],
        ['匿名内部类', '创建对象的同时定义类，没有名字', '第三节'],
        ['静态嵌套类', '外部类成员位置，用 static 修饰', '不在本章范围'],
      ]}
    />

    <Heading3>2. 成员内部类的定义格式</Heading3>
    <Paragraph>
      成员内部类写在外部类的花括号内、与成员变量和成员方法并列，格式如下：
    </Paragraph>
    <CodeBlock
      language="text"
      title="成员内部类定义格式"
      code={`public class 外部类名 {
    // 外部类成员变量
    private int outerField;

    // 成员内部类（定义在成员位置）
    public class 内部类名 {
        // 内部类成员变量、成员方法
        public void innerMethod() {
            // 可以直接访问外部类的 outerField（包括 private）
        }
    }
}`}
    />
    <Callout type="tip" title="访问权限修饰符">
      成员内部类本身可以被 <InlineCode>public</InlineCode>、
      <InlineCode>protected</InlineCode>、默认（包访问）或 <InlineCode>private</InlineCode> 修饰，
      常见写法是 <InlineCode>public</InlineCode> 或默认（不加修饰符）。
    </Callout>

    <Heading3>3. 成员内部类的核心特点</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>内部类可以直接访问外部类的所有成员</Text>，包括
        <InlineCode>private</InlineCode> 修饰的成员变量和成员方法，无需借助对象引用。
      </ListItem>
      <ListItem>
        <Text bold>外部类访问内部类成员，必须先创建内部类对象</Text>，再通过对象访问，
        不能直接访问。
      </ListItem>
      <ListItem>
        成员内部类与外部类共享一个 <InlineCode>.class</InlineCode> 编译单元，
        编译后会生成 <InlineCode>外部类名$内部类名.class</InlineCode> 文件。
      </ListItem>
    </OrderedList>
    <Callout type="warning" title="外部类访问内部类需要先创建对象">
      外部类的方法不能像访问自己成员变量那样直接访问内部类的成员。
      必须先 <InlineCode>new 内部类名()</InlineCode> 得到内部类对象，再通过对象访问。
    </Callout>

    <Heading3>4. 在外部创建成员内部类对象的格式</Heading3>
    <Paragraph>
      在<Text bold>外部类以外</Text>的地方（如 <InlineCode>main</InlineCode> 方法）创建内部类对象，
      语法与普通类不同，格式固定如下：
    </Paragraph>
    <CodeBlock
      language="text"
      title="在外部创建成员内部类对象的格式"
      code={`外部类名.内部类名 对象名 = new 外部类名().new 内部类名();`}
    />
    <Paragraph>
      这行代码分两步：先 <InlineCode>new 外部类名()</InlineCode> 创建外部类对象，
      再紧接着 <InlineCode>.new 内部类名()</InlineCode> 基于该外部类对象创建内部类对象。
      内部类对象内部持有对外部类对象的引用，这也是它能访问外部类 <InlineCode>private</InlineCode> 成员的原因。
    </Paragraph>
    <Callout type="tip" title="也可以先保存外部类对象再创建内部类对象">
      <CodeBlock
        language="text"
        title="分步写法（等价）"
        code={`外部类名 outer = new 外部类名();
外部类名.内部类名 inner = outer.new 内部类名();`}
      />
      两种写法完全等价，分步写法在外部类对象需要复用时更清晰。
    </Callout>

    <Heading3>5. 同名成员变量的访问：外部类名.this.变量名</Heading3>
    <Paragraph>
      当内部类与外部类存在<Text bold>同名成员变量</Text>时，在内部类方法中直接写变量名，
      访问的是<Text bold>内部类自己的</Text>那个变量（就近原则）。
      若要明确访问<Text bold>外部类的</Text>同名变量，需要使用
      <InlineCode>外部类名.this.变量名</InlineCode> 语法。
    </Paragraph>
    <Table
      head={['写法', '访问目标']}
      rows={[
        ['name', '就近原则：内部类自己声明的 name'],
        ['this.name', '内部类自己声明的 name（与 name 等价）'],
        ['外部类名.this.name', '外部类声明的 name（跨层访问外部类对象的成员）'],
      ]}
    />
    <Callout type="danger" title="不能用 super.name 访问外部类同名变量">
      <InlineCode>super</InlineCode> 指的是父类，与外部类无关。
      访问外部类的同名成员变量，唯一正确的写法是
      <InlineCode>外部类名.this.变量名</InlineCode>，不能写成
      <InlineCode>super.变量名</InlineCode>。
    </Callout>

    <Heading3>6. 完整示例</Heading3>
    <Heading4>示例 1：基本定义与访问</Heading4>
    <Paragraph>
      定义外部类 <InlineCode>Outer</InlineCode>，内含私有成员变量和成员内部类
      <InlineCode>Inner</InlineCode>；演示内部类访问外部类私有成员，以及外部类访问内部类方法。
    </Paragraph>
    <CodeBlock
      title="Outer.java"
      code={`public class Outer {
    // 外部类私有成员变量
    private String outerName = "外部类-张三";
    private int outerAge = 30;

    // 成员内部类
    public class Inner {
        private String innerName = "内部类-李四";

        // 内部类方法：直接访问外部类的 private 成员，无需任何额外操作
        public void show() {
            System.out.println("内部类方法被调用");
            System.out.println("访问外部类私有变量 outerName = " + outerName);
            System.out.println("访问外部类私有变量 outerAge  = " + outerAge);
            System.out.println("内部类自己的 innerName = " + innerName);
        }
    }

    // 外部类方法：访问内部类成员，必须先创建内部类对象
    public void outerMethod() {
        Inner inner = new Inner();   // 在外部类内部创建内部类对象，可直接 new Inner()
        inner.show();
        System.out.println("外部类方法：通过内部类对象访问 innerName = " + inner.innerName);
    }
}`}
    />
    <CodeBlock
      title="OuterDemo.java"
      code={`public class OuterDemo {
    public static void main(String[] args) {
        // 在外部创建成员内部类对象的固定格式
        Outer.Inner oi = new Outer().new Inner();
        oi.show();

        System.out.println();

        // 通过外部类方法演示外部类访问内部类
        Outer outer = new Outer();
        outer.outerMethod();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`内部类方法被调用
访问外部类私有变量 outerName = 外部类-张三
访问外部类私有变量 outerAge  = 30
内部类自己的 innerName = 内部类-李四

内部类方法被调用
访问外部类私有变量 outerName = 外部类-张三
访问外部类私有变量 outerAge  = 30
内部类自己的 innerName = 内部类-李四
外部类方法：通过内部类对象访问 innerName = 内部类-李四`} />
    <Paragraph>
      关键点：内部类的 <InlineCode>show()</InlineCode> 方法中直接写
      <InlineCode>outerName</InlineCode> 和 <InlineCode>outerAge</InlineCode>，
      编译器知道这是外部类的成员，直接访问，无需任何对象引用——这是内部类独有的特权。
      而外部类的 <InlineCode>outerMethod()</InlineCode> 必须先 <InlineCode>new Inner()</InlineCode>
      再通过对象访问，与访问普通类成员的方式相同。
    </Paragraph>

    <Heading4>示例 2：同名成员变量的区分访问</Heading4>
    <Paragraph>
      外部类和内部类都有一个叫 <InlineCode>name</InlineCode> 的成员变量，
      演示如何在内部类方法中分别访问两个 <InlineCode>name</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="ShadowDemo.java"
      code={`public class ShadowDemo {
    private String name = "外部类的name";   // 外部类成员变量

    public class Inner {
        private String name = "内部类的name"; // 内部类成员变量，与外部类同名

        public void printNames() {
            String name = "方法局部变量name";  // 方法内局部变量，再次同名

            System.out.println("局部变量  name = " + name);              // 就近：局部变量
            System.out.println("内部类成员 name = " + this.name);         // this：内部类自己
            System.out.println("外部类成员 name = " + ShadowDemo.this.name); // 外部类名.this：外部类
        }
    }

    public static void main(String[] args) {
        ShadowDemo.Inner inner = new ShadowDemo().new Inner();
        inner.printNames();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`局部变量  name = 方法局部变量name
内部类成员 name = 内部类的name
外部类成员 name = 外部类的name`} />
    <Paragraph>
      三层同名变量依次对应三种访问方式：直接写 <InlineCode>name</InlineCode> 取局部变量；
      <InlineCode>this.name</InlineCode> 取内部类的成员变量；
      <InlineCode>ShadowDemo.this.name</InlineCode> 取外部类的成员变量。
      记住：<InlineCode>外部类名.this</InlineCode> 代表的是"外部类的当前对象"。
    </Paragraph>

    <Heading4>示例 3：综合——外部类内部嵌套使用</Heading4>
    <CodeBlock
      title="Body.java"
      code={`// 模拟"人体"（外部类）包含"心脏"（内部类）的关系
public class Body {
    private String bodyName;
    private int heartRate;   // 心率（bpm），private

    public Body(String bodyName, int heartRate) {
        this.bodyName = bodyName;
        this.heartRate = heartRate;
    }

    // 成员内部类：心脏
    public class Heart {
        private String color;

        public Heart(String color) {
            this.color = color;
        }

        // 内部类直接访问外部类的 private 成员 heartRate
        public void beat() {
            System.out.println(bodyName + " 的心脏（" + color + "）正在跳动，心率：" + heartRate + " bpm");
        }
    }

    // 外部类提供方法，对外暴露心脏行为
    public void showHeartBeat() {
        Heart heart = new Heart("红色");
        heart.beat();
    }
}`}
    />
    <CodeBlock
      title="BodyDemo.java"
      code={`public class BodyDemo {
    public static void main(String[] args) {
        // 方式1：通过外部类方法间接使用内部类
        Body body = new Body("小明", 72);
        body.showHeartBeat();

        System.out.println();

        // 方式2：在外部直接创建内部类对象
        Body.Heart heart = new Body("小红", 68).new Heart("粉红色");
        heart.beat();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`小明 的心脏（红色）正在跳动，心率：72 bpm

小红 的心脏（粉红色）正在跳动，心率：68 bpm`} />

    <Heading3>7. 成员内部类要点汇总</Heading3>
    <Table
      head={['要点', '说明']}
      rows={[
        ['定义位置', '外部类的成员位置（类中方法外），与成员变量、成员方法并列'],
        ['内部类访问外部类', '可直接访问外部类所有成员，包含 private，无需对象引用'],
        ['外部类访问内部类', '必须先创建内部类对象，再通过对象访问内部类成员'],
        ['外部创建内部类对象', '外部类名.内部类名 obj = new 外部类名().new 内部类名();'],
        ['同名变量访问外部类', '使用 外部类名.this.变量名 来明确访问外部类的同名成员变量'],
        ['编译产物', '外部类名$内部类名.class，两个 .class 文件'],
      ]}
    />
    <Callout type="success" title="小结">
      <Paragraph>成员内部类的核心记忆点：</Paragraph>
      <UnorderedList>
        <ListItem>内部类定义在外部类成员位置，天然能访问外部类所有（含 private）成员。</ListItem>
        <ListItem>外部类要用内部类，必须先 <InlineCode>new</InlineCode> 出内部类对象。</ListItem>
        <ListItem>外部创建格式固定：<InlineCode>外部类名.内部类名 obj = new 外部类名().new 内部类名();</InlineCode></ListItem>
        <ListItem>同名变量时，<InlineCode>外部类名.this.变量名</InlineCode> 用于访问外部类的那份。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：定义成员内部类并在外部创建对象"
      code={`// 要求：
// 1. 定义外部类 Computer，包含 private 成员变量 brand（品牌）和 price（价格）。
// 2. 在 Computer 内部定义成员内部类 CPU，包含成员变量 model（型号）和方法 run()。
//    run() 打印格式：「品牌」电脑的「型号」CPU 正在运行，售价：「price」元
//    （注意：直接访问外部类的 brand 和 price，不需要传参）
// 3. 在 main 中，用外部创建格式创建 CPU 对象并调用 run()。

public class Computer {
    // 补全成员变量

    public Computer(String brand, double price) {
        // 补全
    }

    // 补全成员内部类 CPU
}

class ComputerTest {
    public static void main(String[] args) {
        // 补全：用外部创建格式创建 CPU 对象并调用 run()
    }
}`}
      answerCode={`public class Computer {
    private String brand;
    private double price;

    public Computer(String brand, double price) {
        this.brand = brand;
        this.price = price;
    }

    public class CPU {
        private String model;

        public CPU(String model) {
            this.model = model;
        }

        // 直接访问外部类的 private 成员 brand 和 price
        public void run() {
            System.out.println(brand + " 电脑的 " + model + " CPU 正在运行，售价：" + price + " 元");
        }
    }
}

class ComputerTest {
    public static void main(String[] args) {
        Computer.CPU cpu = new Computer("苹果", 12999.0).new CPU("M3");
        cpu.run();
    }
}

/* 控制台输出：
苹果 电脑的 M3 CPU 正在运行，售价：12999.0 元

解析：new Computer("苹果", 12999.0) 先创建外部类对象，
      .new CPU("M3") 再基于该外部类对象创建内部类对象。
      内部类 run() 中直接访问了外部类 private 变量 brand 和 price。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：同名变量的区分访问"
      code={`// 要求：
// 外部类 School 有成员变量 name = "清华大学"。
// 内部类 Student 也有成员变量 name = "张同学"。
// 在 Student 的方法 introduce() 中，局部变量 name = "临时名字"。
// 请在 introduce() 里分三行分别打印：局部变量的 name、内部类成员的 name、外部类成员的 name。

public class School {
    String name = "清华大学";

    public class Student {
        String name = "张同学";

        public void introduce() {
            String name = "临时名字";
            // 打印三行，分别访问三层 name
        }
    }

    public static void main(String[] args) {
        School.Student stu = new School().new Student();
        stu.introduce();
    }
}`}
      answerCode={`public class School {
    String name = "清华大学";

    public class Student {
        String name = "张同学";

        public void introduce() {
            String name = "临时名字";
            System.out.println("局部变量  name = " + name);              // 就近：局部变量
            System.out.println("内部类成员 name = " + this.name);         // this：内部类
            System.out.println("外部类成员 name = " + School.this.name);  // 外部类名.this：外部类
        }
    }

    public static void main(String[] args) {
        School.Student stu = new School().new Student();
        stu.introduce();
    }
}

/* 控制台输出：
局部变量  name = 临时名字
内部类成员 name = 张同学
外部类成员 name = 清华大学

解析：三层同名变量的访问规则——
  直接写变量名：就近原则，取最近作用域（方法局部变量）。
  this.变量名：取当前类（内部类）的成员变量。
  外部类名.this.变量名：取外部类的成员变量，这是访问外部类同名成员的唯一正确方式。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：在外部类方法中访问内部类"
      code={`// 要求：
// 定义外部类 Library（图书馆），包含 private String libraryName。
// 内部类 Book 包含 private String title 和 int pages。
// 内部类 Book 的方法 info() 打印：「libraryName」馆藏：「title」，共「pages」页
// 外部类 Library 的方法 showBook(String title, int pages) 在方法内创建 Book 对象并调用 info()。
// 在 main 中只调用外部类方法 showBook，不直接创建 Book 对象。

public class Library {
    private String libraryName;

    public Library(String libraryName) {
        this.libraryName = libraryName;
    }

    // 补全成员内部类 Book

    // 补全外部类方法 showBook
}

class LibraryTest {
    public static void main(String[] args) {
        Library lib = new Library("国家图书馆");
        lib.showBook("Java编程思想", 880);
        lib.showBook("算法导论", 1292);
    }
}`}
      answerCode={`public class Library {
    private String libraryName;

    public Library(String libraryName) {
        this.libraryName = libraryName;
    }

    // 成员内部类
    private class Book {
        private String title;
        private int pages;

        public Book(String title, int pages) {
            this.title = title;
            this.pages = pages;
        }

        public void info() {
            // 直接访问外部类的 private 成员 libraryName
            System.out.println(libraryName + " 馆藏：" + title + "，共 " + pages + " 页");
        }
    }

    // 外部类方法：在方法内创建内部类对象（不需要特殊格式，直接 new Book()）
    public void showBook(String title, int pages) {
        Book book = new Book(title, pages);
        book.info();
    }
}

class LibraryTest {
    public static void main(String[] args) {
        Library lib = new Library("国家图书馆");
        lib.showBook("Java编程思想", 880);
        lib.showBook("算法导论", 1292);
    }
}

/* 控制台输出：
国家图书馆 馆藏：Java编程思想，共 880 页
国家图书馆 馆藏：算法导论，共 1292 页

解析：外部类方法内部创建内部类对象，直接写 new Book() 即可，不需要外部那套
      「外部类名.内部类名 obj = new 外部类名().new 内部类名()」格式。
      那个格式只有在外部类以外的地方才需要用到。
*/`}
    />
  </article>
);

export default index;
