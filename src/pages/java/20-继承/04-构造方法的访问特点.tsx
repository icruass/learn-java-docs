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
    <Title>构造方法的访问特点</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        创建子类对象时，不只是执行子类的构造方法——父类也会被"初始化"。
        本节讲清一条核心规则：<Text bold>子类构造方法执行前，一定会先调用父类构造方法</Text>。
        掌握默认隐含的 <InlineCode>super()</InlineCode>、显式调用父类有参构造
        <InlineCode>super(参数)</InlineCode>、以及父类无无参构造时的编译报错原因与解决方案。
      </Paragraph>
    </Callout>

    <Heading3>1. 核心规则：子类构造先调父类构造</Heading3>
    <Paragraph>
      在 Java 中，<Text bold>每个子类的构造方法，在执行自己的代码之前，都必须先完成父类的初始化</Text>。
      这是因为子类对象包含了从父类继承来的属性，这些属性需要先被父类的构造方法初始化，
      子类才能安全使用它们。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        如果子类构造方法中<Text bold>没有显式写</Text> <InlineCode>super(...)</InlineCode>，
        Java 编译器会自动在第一行插入 <InlineCode>super();</InlineCode>——调用父类的<Text bold>无参构造方法</Text>。
      </ListItem>
      <ListItem>
        可以手动写 <InlineCode>super(参数);</InlineCode> 来显式调用父类的<Text bold>有参构造方法</Text>。
      </ListItem>
      <ListItem>
        <InlineCode>super(...)</InlineCode> 必须写在子类构造方法的<Text bold>第一行</Text>，否则编译报错。
      </ListItem>
    </UnorderedList>

    <Heading3>2. 默认隐含 super() 示例</Heading3>
    <Paragraph>
      在没有显式写 <InlineCode>super()</InlineCode> 时，编译器自动加上。
      通过在构造方法中打印语句，可以清楚看到"先父后子"的执行顺序。
    </Paragraph>
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    String name;

    // 父类无参构造方法
    public Animal() {
        System.out.println("Animal 无参构造执行");
    }
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat extends Animal {

    // 子类无参构造方法
    // 编译器在第一行自动加了 super();（调用 Animal()）
    public Cat() {
        // super();  ← 虽然没写，但编译器自动插入这一句
        System.out.println("Cat 无参构造执行");
    }
}`}
    />
    <CodeBlock
      title="ConstructorDemo.java"
      code={`public class ConstructorDemo {
    public static void main(String[] args) {
        System.out.println("开始创建 Cat 对象：");
        Cat cat = new Cat();
        System.out.println("Cat 对象创建完毕");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`开始创建 Cat 对象：
Animal 无参构造执行
Cat 无参构造执行
Cat 对象创建完毕`} />
    <Paragraph>
      执行顺序：创建 <InlineCode>Cat</InlineCode> 对象时，
      先执行父类 <InlineCode>Animal</InlineCode> 的构造方法，再执行
      <InlineCode>Cat</InlineCode> 自己的构造方法，始终是<Text bold>先父后子</Text>。
    </Paragraph>

    <Heading3>3. 显式调用父类有参构造 super(参数)</Heading3>
    <Paragraph>
      当父类有有参构造方法，需要向父类传递初始化参数时，使用 <InlineCode>super(参数)</InlineCode>
      显式调用，同样必须写在子类构造方法的第一行。
    </Paragraph>
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    String name;
    int age;

    // 父类无参构造
    public Animal() {
        System.out.println("Animal 无参构造执行");
    }

    // 父类有参构造
    public Animal(String name, int age) {
        this.name = name;
        this.age  = age;
        System.out.println("Animal 有参构造执行：name=" + name + ", age=" + age);
    }
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat extends Animal {
    String color;

    // 子类有参构造，使用 super(参数) 调用父类有参构造
    public Cat(String name, int age, String color) {
        super(name, age);       // 必须在第一行，调用父类有参构造
        this.color = color;
        System.out.println("Cat 有参构造执行：color=" + color);
    }

    // 子类无参构造，使用 super() 调用父类无参构造（可以不写，编译器自动加）
    public Cat() {
        super();    // 显式写出来更清晰
        this.color = "白色";
        System.out.println("Cat 无参构造执行");
    }
}`}
    />
    <CodeBlock
      title="SuperParamDemo.java"
      code={`public class SuperParamDemo {
    public static void main(String[] args) {
        System.out.println("=== 创建有参 Cat ===");
        Cat cat1 = new Cat("小花", 2, "橘色");

        System.out.println();
        System.out.println("=== 创建无参 Cat ===");
        Cat cat2 = new Cat();

        System.out.println();
        System.out.println("cat1: " + cat1.name + " " + cat1.age + " " + cat1.color);
        System.out.println("cat2: " + cat2.name + " " + cat2.age + " " + cat2.color);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`=== 创建有参 Cat ===
Animal 有参构造执行：name=小花, age=2
Cat 有参构造执行：color=橘色

=== 创建无参 Cat ===
Animal 无参构造执行
Cat 无参构造执行

cat1: 小花 2 橘色
cat2: null 0 白色`} />
    <Paragraph>
      <InlineCode>super(name, age)</InlineCode> 把参数交给父类有参构造初始化了
      <InlineCode>name</InlineCode> 和 <InlineCode>age</InlineCode>，
      子类只需负责初始化自己特有的 <InlineCode>color</InlineCode>，
      职责清晰，避免重复赋值代码。
    </Paragraph>

    <Heading3>4. 危险：父类没有无参构造时的编译报错</Heading3>
    <Callout type="danger" title="父类只有有参构造时，子类构造必须显式调用 super(参数)">
      <Paragraph>
        当你在父类中手动定义了有参构造方法，Java 就<Text bold>不再自动生成无参构造</Text>。
        此时如果子类构造方法没有显式写 <InlineCode>super(参数)</InlineCode>，
        编译器会尝试插入 <InlineCode>super()</InlineCode>，但父类根本没有无参构造——
        <Text bold>编译报错</Text>！
      </Paragraph>
      <CodeBlock
        title="编译报错示例"
        code={`public class Animal {
    String name;

    // 只定义了有参构造，Java 不再自动生成无参构造
    public Animal(String name) {
        this.name = name;
    }
}

public class Cat extends Animal {
    // 编译报错！
    // 编译器尝试插入 super()，但 Animal 没有无参构造
    public Cat() {
        // 隐式的 super() 找不到对应的父类构造方法
        System.out.println("Cat 构造执行");
    }
}`}
      />
      <Paragraph>
        解决方案有两种：
      </Paragraph>
      <OrderedList>
        <ListItem>
          在子类构造中显式写 <InlineCode>super(参数);</InlineCode>，匹配父类有参构造。
        </ListItem>
        <ListItem>
          在父类中手动补充一个无参构造方法。
        </ListItem>
      </OrderedList>
      <CodeBlock
        title="解决方案 1：子类显式调用 super(参数)"
        code={`public class Cat extends Animal {
    public Cat(String name) {
        super(name);    // 显式匹配父类有参构造，放在第一行
        System.out.println("Cat 构造执行");
    }
}`}
      />
      <CodeBlock
        title="解决方案 2：父类补充无参构造"
        code={`public class Animal {
    String name;

    public Animal() { }   // 手动补充无参构造

    public Animal(String name) {
        this.name = name;
    }
}`}
      />
    </Callout>

    <Heading3>5. 多层继承的构造执行顺序</Heading3>
    <Paragraph>
      多层继承时，构造方法的执行顺序沿继承链<Text bold>从顶层祖先类到最底层子类</Text>，
      一层一层"先父后子"执行。
    </Paragraph>
    <CodeBlock
      title="MultiLayerConstructorDemo.java"
      code={`class Animal {
    public Animal() {
        System.out.println("1. Animal 构造执行");
    }
}

class Pet extends Animal {
    public Pet() {
        // super(); 隐式存在
        System.out.println("2. Pet 构造执行");
    }
}

class Cat extends Pet {
    public Cat() {
        // super(); 隐式存在
        System.out.println("3. Cat 构造执行");
    }
}

public class MultiLayerConstructorDemo {
    public static void main(String[] args) {
        System.out.println("创建 Cat 对象：");
        Cat cat = new Cat();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`创建 Cat 对象：
1. Animal 构造执行
2. Pet 构造执行
3. Cat 构造执行`} />
    <Paragraph>
      无论继承链有多长，构造执行顺序永远是从继承链顶端的祖先类开始，
      逐层向下到最终子类，确保每一层的属性都被正确初始化。
    </Paragraph>

    <Heading3>6. super() 必须在第一行</Heading3>
    <Callout type="danger" title="super(...) 必须是构造方法的第一条语句">
      <InlineCode>super(...)</InlineCode> 必须写在子类构造方法的<Text bold>第一行</Text>，
      在它之前不能有任何其他语句（包括变量声明、打印、赋值等），否则编译报错。
      原因：Java 要保证父类在子类之前被初始化，任何"子类的操作"都不能先于父类初始化。
      <CodeBlock
        title="编译报错示例（super 不在第一行）"
        code={`public class Cat extends Animal {
    public Cat(String name) {
        System.out.println("准备初始化");  // 编译报错！super() 之前不能有语句
        super(name);
    }
}`}
      />
    </Callout>

    <Heading3>7. 构造方法访问特点汇总</Heading3>
    <Table
      head={['场景', '处理方式', '注意']}
      rows={[
        ['子类构造没有写 super()', '编译器自动在第一行插入 super()', '父类必须有无参构造，否则编译报错'],
        ['子类构造写了 super(参数)', '调用父类对应的有参构造方法', '必须是第一行；参数类型要匹配'],
        ['父类只有有参构造，无无参构造', '子类必须显式写 super(参数)', '否则编译报错'],
        ['多层继承', '从顶层祖先类开始，逐层向下执行构造', '每层都会先调父类构造，再执行自己的构造'],
      ]}
    />

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：预测构造执行顺序"
      code={`// 下面代码的控制台输出是什么？

class Person {
    String name;
    public Person(String name) {
        this.name = name;
        System.out.println("Person 构造：" + name);
    }
}

class Student extends Person {
    int grade;
    public Student(String name, int grade) {
        super(name);
        this.grade = grade;
        System.out.println("Student 构造：grade=" + grade);
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Student s = new Student("小明", 3);
        System.out.println("姓名：" + s.name + "，年级：" + s.grade);
    }
}`}
      answerCode={`// 控制台输出：
// Person 构造：小明
// Student 构造：grade=3
// 姓名：小明，年级：3

/* 解析：
   1. new Student("小明", 3) 触发 Student 构造方法；
   2. 第一行 super("小明") 先跳到父类 Person 构造，打印"Person 构造：小明"；
   3. Person 构造完成，回到 Student 构造，执行 this.grade=3，打印"Student 构造：grade=3"；
   4. main 中打印姓名和年级。
   执行顺序严格遵循"先父后子"原则。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：为 Employee / Teacher 添加有参构造并链式初始化"
      code={`// 要求：
// 父类 Employee：属性 name（String）、salary（double）
//   提供有参构造 Employee(String name, double salary)，
//   打印"Employee 构造：[name]"
// 子类 Teacher extends Employee：属性 subject（String）
//   提供有参构造 Teacher(String name, double salary, String subject)
//   用 super(name, salary) 初始化父类部分，打印"Teacher 构造：[subject]"
// main 中创建 Teacher("王老师", 9000.0, "语文")，依次打印三条语句

public class Employee {
    // 补全
}

public class Teacher extends Employee {
    // 补全
}

public class Exercise02 {
    public static void main(String[] args) {
        Teacher t = new Teacher("王老师", 9000.0, "语文");
        System.out.println("姓名=" + t.name + " 薪资=" + t.salary + " 科目=" + t.subject);
    }
}`}
      answerCode={`public class Employee {
    String name;
    double salary;

    public Employee(String name, double salary) {
        this.name   = name;
        this.salary = salary;
        System.out.println("Employee 构造：" + name);
    }
}

public class Teacher extends Employee {
    String subject;

    public Teacher(String name, double salary, String subject) {
        super(name, salary);        // 第一行：调用父类有参构造
        this.subject = subject;
        System.out.println("Teacher 构造：" + subject);
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        Teacher t = new Teacher("王老师", 9000.0, "语文");
        System.out.println("姓名=" + t.name + " 薪资=" + t.salary + " 科目=" + t.subject);
    }
}

/* 控制台输出：
Employee 构造：王老师
Teacher 构造：语文
姓名=王老师 薪资=9000.0 科目=语文

解析：super(name, salary) 把初始化工作委托给父类，子类只负责自己特有的 subject，
      职责清晰，代码不重复——这是有参构造链的标准写法。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：分析并修复编译错误"
      code={`// 下面代码有编译错误，请找出原因并给出修复方案

class Vehicle {
    String brand;
    int speed;

    // 只定义了有参构造，没有无参构造
    public Vehicle(String brand, int speed) {
        this.brand = brand;
        this.speed = speed;
    }
}

class Car extends Vehicle {
    int doors;

    // 没有显式写 super(...)
    public Car(int doors) {
        this.doors = doors;
    }
}

// 请说明报错原因，并给出两种修复方案`}
      answerCode={`// 报错原因：
// Car 的构造方法没有显式写 super(...)，
// 编译器自动插入 super()，但 Vehicle 没有无参构造方法，
// 导致编译报错：No suitable constructor found for Vehicle()

// 修复方案 1：在 Car 构造中显式调用父类有参构造
class Car extends Vehicle {
    int doors;

    public Car(String brand, int speed, int doors) {
        super(brand, speed);    // 第一行，匹配父类有参构造
        this.doors = doors;
    }
}

// 修复方案 2：在 Vehicle 中手动补充无参构造
class Vehicle {
    String brand;
    int speed;

    public Vehicle() { }   // 手动添加无参构造

    public Vehicle(String brand, int speed) {
        this.brand = brand;
        this.speed = speed;
    }
}

/* 解析：
   根本原因：只要在类中写了有参构造，Java 就不再自动生成无参构造。
   最佳实践：定义了有参构造时，同时手动补充无参构造，
            避免子类或使用方因找不到无参构造而报错。
*/`}
    />
  </article>
);

export default index;
