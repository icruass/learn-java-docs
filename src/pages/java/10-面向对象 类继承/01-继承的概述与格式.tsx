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
    <Title>继承的概述与格式</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        现实世界里，猫和狗都是动物，教师和经理都是员工——它们之间天然存在
        <Text bold>is-a（是一种）</Text>关系。Java 用<Text bold>继承（Inheritance）</Text>来表达这种关系：
        子类自动拥有父类的属性和方法，无需重复编写，从而实现代码复用、构建清晰的类体系。
        本节重点掌握继承的基本格式、父子类术语、单继承与多层继承规则，以及继承带来的好处。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是继承</Heading3>
    <Paragraph>
      继承是面向对象三大特征之一（封装、继承、多态）。
      它允许一个类<Text bold>自动获得另一个类的非私有属性和方法</Text>，
      只需在定义时用 <InlineCode>extends</InlineCode> 关键字声明即可。
      被继承的类叫<Text bold>父类（超类 / 基类）</Text>，继承父类的类叫<Text bold>子类（派生类）</Text>。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>代码复用</Text>：父类写好的属性和方法，子类直接继承使用，无需重复编写。
      </ListItem>
      <ListItem>
        <Text bold>表达 is-a 关系</Text>：Cat is-a Animal（猫是一种动物），
        继承让这种语义关系在代码中得以体现。
      </ListItem>
      <ListItem>
        <Text bold>便于扩展</Text>：子类可以在父类基础上新增特有的属性和方法，
        也可以重写父类方法来改变行为。
      </ListItem>
      <ListItem>
        <Text bold>构建类体系</Text>：通过继承可以把一组相关的类组织成层次清晰的树形结构，
        便于维护和理解。
      </ListItem>
    </UnorderedList>

    <Heading3>2. 继承的格式</Heading3>
    <Paragraph>
      Java 中用 <InlineCode>extends</InlineCode> 关键字实现继承，格式如下：
    </Paragraph>
    <CodeBlock
      language="text"
      title="继承格式"
      code={`public class 子类名 extends 父类名 {
    // 子类特有的属性和方法
    // 父类的非私有属性和方法子类自动拥有，无需重复声明
}`}
    />
    <Table
      head={['术语', '别名', '说明']}
      rows={[
        ['父类', '超类、基类（Super Class / Base Class）', '被继承的类，定义公共的属性和方法'],
        ['子类', '派生类（Sub Class / Derived Class）', '继承父类的类，自动拥有父类的非私有成员'],
        ['extends', '—', 'Java 关键字，声明继承关系，子类名写在前，父类名写在后'],
      ]}
    />
    <Callout type="tip" title="父类成员的可见性">
      子类<Text bold>自动拥有</Text>父类中 <InlineCode>public</InlineCode> 和
      <InlineCode>protected</InlineCode> 修饰的属性与方法；
      父类的 <InlineCode>private</InlineCode> 成员子类无法直接访问（但它们仍然存在于对象中，
      可通过父类提供的 getter / setter 间接操作）。
    </Callout>

    <Heading3>3. 单继承与多层继承</Heading3>
    <Paragraph>
      Java 只支持<Text bold>单继承</Text>：一个类只能有<Text bold>一个直接父类</Text>，
      <InlineCode>extends</InlineCode> 后面只能写一个类名。
      这与 C++ 不同，Java 用接口（interface）来弥补多继承的需求。
    </Paragraph>
    <CodeBlock
      language="text"
      title="单继承示意（多继承编译报错）"
      code={`// 正确：一个子类只能有一个直接父类
class Cat extends Animal { }

// 编译报错！Java 不支持多继承
// class Cat extends Animal, Pet { }  // 错误写法`}
    />
    <Paragraph>
      虽然不支持多继承，但 Java 支持<Text bold>多层继承（继承链）</Text>：
      A 继承 B，B 继承 C，形成祖孙关系。子类可以间接拥有祖先类的全部非私有成员。
    </Paragraph>
    <CodeBlock
      language="text"
      title="多层继承示意"
      code={`class Animal { }              // 顶层父类
class Pet extends Animal { }      // Pet 继承 Animal
class Cat extends Pet { }         // Cat 继承 Pet，间接也是 Animal`}
    />
    <Callout type="warning" title="继承层次不宜过深">
      继承链理论上可以无限延伸，但实际开发中层次过深会导致代码难以理解和维护。
      通常建议继承不超过 3~4 层，优先考虑"组合优于继承"的设计原则。
    </Callout>
    <Callout type="tip" title="Object 是所有类的根父类">
      Java 中每个没有写 <InlineCode>extends</InlineCode> 的类，都隐式继承自
      <InlineCode>java.lang.Object</InlineCode>。
      因此所有对象都自动拥有 <InlineCode>toString()</InlineCode>、<InlineCode>equals()</InlineCode>
      等方法。
    </Callout>

    <Heading3>4. 子类可以继承哪些成员</Heading3>
    <Table
      head={['父类成员修饰符', '同包子类', '不同包子类', '说明']}
      rows={[
        ['public', '可访问', '可访问', '最宽松，完全公开'],
        ['protected', '可访问', '可访问', '跨包子类也可以直接访问'],
        ['（默认 / 包级私有）', '可访问', '不可访问', '仅限同一包内可见'],
        ['private', '不可直接访问', '不可直接访问', '仅限本类，子类需通过 getter/setter 间接操作'],
      ]}
    />
    <Callout type="tip" title="继承的是成员，不是构造方法">
      子类<Text bold>不会继承</Text>父类的构造方法（构造方法名与类名绑定，无法被继承）。
      但子类构造方法会自动调用父类构造方法，详见第 04 节。
    </Callout>

    <Heading3>5. 完整示例：Animal → Cat / Dog</Heading3>
    <Heading4>示例 1：子类直接使用父类的属性和方法</Heading4>
    <Paragraph>
      定义 <InlineCode>Animal</InlineCode> 父类，包含 <InlineCode>name</InlineCode> 属性和
      <InlineCode>eat()</InlineCode>、<InlineCode>sleep()</InlineCode> 方法；
      定义 <InlineCode>Cat</InlineCode> 子类继承 <InlineCode>Animal</InlineCode>，
      只新增自己特有的 <InlineCode>catchMouse()</InlineCode> 方法。
    </Paragraph>
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    String name;
    int age;

    public void eat() {
        System.out.println(name + " 正在吃东西");
    }

    public void sleep() {
        System.out.println(name + " 正在睡觉");
    }
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`// Cat 继承 Animal，自动拥有 name、age、eat()、sleep()
public class Cat extends Animal {

    // Cat 特有的方法，直接使用父类的 name 属性
    public void catchMouse() {
        System.out.println(name + " 正在抓老鼠");
    }
}`}
    />
    <CodeBlock
      title="InheritanceDemo.java"
      code={`public class InheritanceDemo {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.name = "小花";     // 使用从父类继承来的属性
        cat.age  = 2;

        cat.eat();             // 调用父类继承来的方法
        cat.sleep();           // 调用父类继承来的方法
        cat.catchMouse();      // 调用 Cat 自己的方法
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`小花 正在吃东西
小花 正在睡觉
小花 正在抓老鼠`} />
    <Paragraph>
      <InlineCode>Cat</InlineCode> 类本身没有定义 <InlineCode>eat()</InlineCode> 和
      <InlineCode>sleep()</InlineCode>，也没有声明 <InlineCode>name</InlineCode> 属性，
      但通过 <InlineCode>extends Animal</InlineCode> 这些成员全部被继承，
      可以像使用自己的成员一样直接调用。
    </Paragraph>

    <Heading4>示例 2：多个子类继承同一父类，减少重复代码</Heading4>
    <Paragraph>
      <InlineCode>Dog</InlineCode> 同样继承 <InlineCode>Animal</InlineCode>，
      拥有完全相同的 <InlineCode>eat()</InlineCode>、<InlineCode>sleep()</InlineCode>，
      只新增自己特有的 <InlineCode>guard()</InlineCode> 方法。
      两个子类共享父类代码，无需重复编写。
    </Paragraph>
    <CodeBlock
      title="Dog.java"
      code={`public class Dog extends Animal {

    public void guard() {
        System.out.println(name + " 正在看门");
    }
}`}
    />
    <CodeBlock
      title="MultiChildDemo.java"
      code={`public class MultiChildDemo {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.name = "旺财";
        dog.age  = 3;
        dog.eat();       // 继承自 Animal
        dog.guard();     // Dog 自己的方法

        System.out.println("---");

        Cat cat = new Cat();
        cat.name = "小花";
        cat.eat();       // 同样继承自 Animal，eat() 只定义了一次
        cat.catchMouse();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`旺财 正在吃东西
旺财 正在看门
---
小花 正在吃东西
小花 正在抓老鼠`} />
    <Callout type="success" title="继承好处直观体现">
      <InlineCode>eat()</InlineCode> 只在 <InlineCode>Animal</InlineCode> 里写了一次，
      <InlineCode>Cat</InlineCode> 和 <InlineCode>Dog</InlineCode> 都能直接用。
      如果将来 <InlineCode>eat()</InlineCode> 的逻辑需要修改，只需改父类一处，所有子类自动生效——
      这就是继承最核心的价值：<Text bold>一处修改，处处生效</Text>。
    </Callout>

    <Heading3>6. 继承注意事项汇总</Heading3>
    <UnorderedList>
      <ListItem>
        Java 只支持<Text bold>单继承</Text>：<InlineCode>extends</InlineCode> 后只能写一个类名。
      </ListItem>
      <ListItem>
        支持<Text bold>多层继承</Text>：A extends B，B extends C，A 间接拥有 C 的全部非私有成员。
      </ListItem>
      <ListItem>
        子类继承父类的<Text bold>非私有</Text>成员变量和方法；构造方法<Text bold>不被继承</Text>。
      </ListItem>
      <ListItem>
        所有没有写 <InlineCode>extends</InlineCode> 的类，都隐式继承 <InlineCode>Object</InlineCode>。
      </ListItem>
      <ListItem>
        继承表达 <Text bold>is-a</Text> 关系；若两个类之间不是 is-a 关系，请用组合代替继承。
      </ListItem>
    </UnorderedList>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：定义 Employee 父类与 Teacher 子类"
      code={`// 要求：
// 1. 定义父类 Employee，包含属性 name（String）、salary（double）
//    和方法 work()，打印"[name] 正在工作，薪资 [salary]"
// 2. 定义子类 Teacher extends Employee，新增方法 teach()，
//    打印"[name] 正在讲课"
// 3. 在 main 中创建 Teacher 对象，name="张老师"，salary=8000.0
//    依次调用 work() 和 teach()

public class Employee {
    // 在这里补全代码
}

public class Teacher extends Employee {
    // 在这里补全代码
}

public class Exercise01 {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Employee {
    String name;
    double salary;

    public void work() {
        System.out.println(name + " 正在工作，薪资 " + salary);
    }
}

public class Teacher extends Employee {
    public void teach() {
        System.out.println(name + " 正在讲课");
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Teacher t = new Teacher();
        t.name   = "张老师";
        t.salary = 8000.0;
        t.work();   // 继承自 Employee
        t.teach();  // Teacher 自己的方法
    }
}

/* 控制台输出：
张老师 正在工作，薪资 8000.0
张老师 正在讲课

解析：Teacher 继承 Employee，自动拥有 name、salary 属性和 work() 方法，
      无需重复定义，体现了继承"代码复用"的核心价值。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：多层继承——Animal → Pet → Cat"
      code={`// 要求：按如下三层继承体系编写代码，并在 main 中验证
// Animal：属性 name，方法 breathe() 打印"[name] 在呼吸"
// Pet extends Animal：方法 beFed() 打印"[name] 被主人喂食"
// Cat extends Pet：方法 catchMouse() 打印"[name] 在抓老鼠"
// main 中创建 Cat 对象，依次调用三个方法

public class Animal { /* 补全 */ }
public class Pet extends Animal { /* 补全 */ }
public class Cat extends Pet { /* 补全 */ }

public class Exercise02 {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`public class Animal {
    String name;
    public void breathe() {
        System.out.println(name + " 在呼吸");
    }
}

public class Pet extends Animal {
    public void beFed() {
        System.out.println(name + " 被主人喂食");
    }
}

public class Cat extends Pet {
    public void catchMouse() {
        System.out.println(name + " 在抓老鼠");
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.name = "咪咪";
        cat.breathe();    // 来自 Animal（祖父类）
        cat.beFed();      // 来自 Pet（父类）
        cat.catchMouse(); // Cat 自己的方法
    }
}

/* 控制台输出：
咪咪 在呼吸
咪咪 被主人喂食
咪咪 在抓老鼠

解析：Cat 通过继承链 Cat -> Pet -> Animal 间接拥有 Animal 的成员，
      Java 仍然是单继承——每个类只有一个直接父类。
*/`}
    />
  </article>
);

export default index;
