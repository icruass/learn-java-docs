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
    <Title>多态的格式与使用</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        多态是面向对象的三大特征之一（封装、继承、多态）。
        简单说，<Text bold>多态就是"同一个父类引用，指向不同子类对象，调用同名方法时表现出不同行为"</Text>。
        本节讲清多态成立的三个前提、核心格式，并通过
        <InlineCode>Animal</InlineCode> → <InlineCode>Cat</InlineCode> / <InlineCode>Dog</InlineCode>
        一套体系演示完整的多态用法。
      </Paragraph>
    </Callout>

    <Heading3>1. 多态的三个前提</Heading3>
    <Paragraph>
      多态能够成立，必须同时满足以下三个条件，缺一不可：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>有继承或实现关系</Text>：子类继承父类（<InlineCode>extends</InlineCode>），
        或实现类实现接口（<InlineCode>implements</InlineCode>）。
      </ListItem>
      <ListItem>
        <Text bold>有方法重写</Text>：子类对父类（或接口）中的方法进行了
        <InlineCode>@Override</InlineCode> 重写。
      </ListItem>
      <ListItem>
        <Text bold>有父类引用指向子类对象</Text>：声明的变量类型是父类型（或接口类型），
        但实际创建的是子类对象，即 <InlineCode>父类型 变量名 = new 子类型();</InlineCode>。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="三个前提缺一不可">
      没有继承/实现 → 根本无法写出父类引用指向子类对象的代码；
      没有方法重写 → 调用哪个子类对象的方法结果都一样，多态无意义；
      没有父类引用 → 只是普通的对象创建，不涉及多态。
    </Callout>

    <Heading3>2. 多态的格式</Heading3>
    <Paragraph>
      多态的核心格式分为两种，本质相同——<Text bold>左边声明父类型/接口，右边 new 子类型/实现类</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      title="多态格式"
      code={`// 格式一：类的多态（父类引用指向子类对象）
父类型 对象名 = new 子类型();

// 格式二：接口的多态（接口引用指向实现类对象）
接口名 对象名 = new 实现类名();`}
    />
    <Table
      head={['格式', '左边（引用类型）', '右边（实际对象）', '示例']}
      rows={[
        ['类的多态', '父类名', '子类名', 'Animal a = new Cat();'],
        ['接口的多态', '接口名', '实现类名', 'Runnable r = new Thread();'],
      ]}
    />
    <Callout type="warning" title="左右类型不能反过来">
      只能用父类型引用指向子类对象，不能用子类型引用指向父类对象。
      例如 <InlineCode>Cat c = new Animal();</InlineCode> 会编译报错，
      因为 Animal 不一定具备 Cat 的所有特征。
    </Callout>

    <Heading3>3. 多态下方法调用的本质</Heading3>
    <Paragraph>
      通过多态引用调用方法时，<Text bold>编译看左边（父类型必须有该方法），运行看右边（执行子类重写的版本）</Text>。
      这意味着：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        如果父类中没有该方法，编译直接报错，即便子类有也不行——因为编译器只看引用类型（左边）。
      </ListItem>
      <ListItem>
        如果父类有该方法，且子类进行了重写，则运行时执行的是子类重写后的版本。
      </ListItem>
      <ListItem>
        如果父类有该方法，子类未重写，则调用的是父类原版方法。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="口诀：编译看左边，运行看右边">
      这条口诀专门针对<Text bold>成员方法</Text>，是理解多态行为的核心。
      成员变量没有这条规则（成员变量编译和运行都看左边），详见下一节。
    </Callout>

    <Heading3>4. 完整示例代码</Heading3>
    <Heading4>示例 1：Animal / Cat / Dog 多态</Heading4>
    <Paragraph>
      定义父类 <InlineCode>Animal</InlineCode>，子类 <InlineCode>Cat</InlineCode> 和
      <InlineCode>Dog</InlineCode> 各自重写 <InlineCode>eat()</InlineCode> 方法，
      用父类引用分别指向两个子类对象，观察同一行调用语句产生不同输出。
    </Paragraph>
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    public void eat() {
        System.out.println("动物在吃东西");
    }

    public void sleep() {
        System.out.println("动物在睡觉");
    }
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat extends Animal {
    @Override
    public void eat() {
        System.out.println("猫在吃猫粮");
    }
}`}
    />
    <CodeBlock
      title="Dog.java"
      code={`public class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println("狗在啃骨头");
    }
}`}
    />
    <CodeBlock
      title="PolymorphismDemo.java"
      code={`public class PolymorphismDemo {
    public static void main(String[] args) {
        // 多态格式：父类引用指向子类对象
        Animal a1 = new Cat();   // a1 的引用类型是 Animal，实际对象是 Cat
        Animal a2 = new Dog();   // a2 的引用类型是 Animal，实际对象是 Dog

        // 编译看左边（Animal 有 eat()，编译通过）；运行看右边（执行各子类重写的版本）
        a1.eat();    // 执行 Cat 重写的 eat()
        a2.eat();    // 执行 Dog 重写的 eat()

        System.out.println("---");

        // sleep() 子类均未重写，走父类原版
        a1.sleep();
        a2.sleep();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`猫在吃猫粮
狗在啃骨头
---
动物在睡觉
动物在睡觉`} />
    <Paragraph>
      <InlineCode>a1</InlineCode> 和 <InlineCode>a2</InlineCode> 声明类型完全相同（都是
      <InlineCode>Animal</InlineCode>），调用的方法名也完全相同（都是 <InlineCode>eat()</InlineCode>），
      但因为指向的实际对象不同，运行结果截然不同——这就是多态的核心价值。
      <InlineCode>sleep()</InlineCode> 因为子类没有重写，两个对象调用结果相同，走父类版本。
    </Paragraph>

    <Heading4>示例 2：接口多态</Heading4>
    <Paragraph>
      接口多态与类的多态格式完全对称——接口充当"父类型"，实现类充当"子类型"。
    </Paragraph>
    <CodeBlock
      title="Speakable.java"
      code={`public interface Speakable {
    void speak();
}`}
    />
    <CodeBlock
      title="Cat.java（新增实现）"
      code={`public class Cat extends Animal implements Speakable {
    @Override
    public void eat() {
        System.out.println("猫在吃猫粮");
    }

    @Override
    public void speak() {
        System.out.println("猫：喵喵喵");
    }
}`}
    />
    <CodeBlock
      title="Dog.java（新增实现）"
      code={`public class Dog extends Animal implements Speakable {
    @Override
    public void eat() {
        System.out.println("狗在啃骨头");
    }

    @Override
    public void speak() {
        System.out.println("狗：汪汪汪");
    }
}`}
    />
    <CodeBlock
      title="InterfacePolymorphismDemo.java"
      code={`public class InterfacePolymorphismDemo {
    public static void main(String[] args) {
        // 接口多态：接口引用指向实现类对象
        Speakable s1 = new Cat();
        Speakable s2 = new Dog();

        s1.speak();   // 执行 Cat 的 speak()
        s2.speak();   // 执行 Dog 的 speak()
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`猫：喵喵喵
狗：汪汪汪`} />

    <Heading4>示例 3：多态作为方法参数——体现扩展性</Heading4>
    <Paragraph>
      多态最大的价值体现在<Text bold>方法形参使用父类型</Text>：一个方法可以接收任意子类对象，
      无需为每个子类单独写重载版本，代码高度可扩展。
    </Paragraph>
    <CodeBlock
      title="AnimalFeeder.java"
      code={`public class AnimalFeeder {

    // 形参类型是父类 Animal，可以传入任意 Animal 子类对象
    public static void feed(Animal animal) {
        System.out.print("喂食：");
        animal.eat();   // 运行时根据实际对象执行对应的重写方法
    }

    public static void main(String[] args) {
        feed(new Cat());   // 传入 Cat 对象
        feed(new Dog());   // 传入 Dog 对象
        // 未来新增 Bird 类只要继承 Animal 并重写 eat()，无需修改 feed 方法
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`喂食：猫在吃猫粮
喂食：狗在啃骨头`} />
    <Paragraph>
      <InlineCode>feed</InlineCode> 方法只写了一次，却能处理所有 <InlineCode>Animal</InlineCode>
      的子类——将来新增 <InlineCode>Bird</InlineCode>、<InlineCode>Fish</InlineCode> 等子类时，
      <InlineCode>feed</InlineCode> 方法本身<Text bold>完全不需要改动</Text>，只要新类继承
      <InlineCode>Animal</InlineCode> 并重写 <InlineCode>eat()</InlineCode> 即可。
      这就是多态带来的<Text bold>开闭原则</Text>（对扩展开放，对修改关闭）。
    </Paragraph>

    <Callout type="success" title="小结">
      <Paragraph>多态核心要点：</Paragraph>
      <UnorderedList>
        <ListItem>三个前提：继承/实现关系 + 方法重写 + 父类引用指向子类对象。</ListItem>
        <ListItem>格式：<InlineCode>父类型 变量 = new 子类型();</InlineCode> 或 <InlineCode>接口 变量 = new 实现类();</InlineCode>。</ListItem>
        <ListItem>方法调用：编译看左边（父类型必须有该方法），运行看右边（执行子类重写的版本）。</ListItem>
        <ListItem>最大价值：方法形参用父类型，可统一处理所有子类对象，提升扩展性。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：判断多态成立的条件"
      code={`// 下面哪些写法构成多态？哪些会编译报错？请逐一分析原因。
// 已知：Cat 继承 Animal，Animal 有 eat() 方法，Cat 重写了 eat()

// 写法 A
Animal a = new Cat();
a.eat();

// 写法 B
Cat c = new Animal();  // ???

// 写法 C：Animal 没有 catchMouse() 方法，Cat 有
Animal a2 = new Cat();
a2.catchMouse();       // ???

// 请在注释里写出每种写法是否合法，以及原因。`}
      answerCode={`// 写法 A：合法，构成多态。
// 父类引用 Animal 指向子类对象 Cat，三个前提均满足，a.eat() 运行时执行 Cat 重写的版本。

// 写法 B：编译报错。
// 不能用子类型引用指向父类对象，Animal 没有 Cat 的全部特征，类型不兼容。

// 写法 C：编译报错。
// 编译看左边：a2 的声明类型是 Animal，Animal 中没有 catchMouse() 方法，
// 编译器找不到该方法 → 编译失败。
// 多态下父类引用只能调用父类中存在的方法，子类特有方法无法直接调用。

/* 解析：
   多态的三个前提都要满足；调用方法时，父类中必须存在该方法，否则编译不通过。
   子类特有方法需要先向下转型（强转为子类型）才能调用，详见「多态的好处与转型」章节。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：补全多态格式并预测输出"
      code={`// 要求：
// 1. Shape 是父类，有 draw() 方法，打印"图形在绘制"
// 2. Circle 继承 Shape，重写 draw()，打印"圆形在绘制"
// 3. Rectangle 继承 Shape，重写 draw()，打印"矩形在绘制"
// 4. 用多态格式分别创建 Circle 和 Rectangle 对象，调用 draw()，预测输出

public class Shape {
    public void draw() {
        // 补全
    }
}

public class Circle extends Shape {
    @Override
    public void draw() {
        // 补全
    }
}

public class Rectangle extends Shape {
    @Override
    public void draw() {
        // 补全
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        // 用多态格式创建对象并调用 draw()
        // 补全
    }
}`}
      answerCode={`public class Shape {
    public void draw() {
        System.out.println("图形在绘制");
    }
}

public class Circle extends Shape {
    @Override
    public void draw() {
        System.out.println("圆形在绘制");
    }
}

public class Rectangle extends Shape {
    @Override
    public void draw() {
        System.out.println("矩形在绘制");
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        Shape s1 = new Circle();      // 多态：父类引用指向子类对象
        Shape s2 = new Rectangle();   // 多态：父类引用指向子类对象

        s1.draw();   // 编译看左边（Shape 有 draw），运行看右边（Circle 的版本）
        s2.draw();   // 运行看右边（Rectangle 的版本）
    }
}

/* 控制台输出：
圆形在绘制
矩形在绘制

解析：s1 和 s2 声明类型均为 Shape，但实际对象分别是 Circle 和 Rectangle，
      运行时各自执行重写后的 draw() 版本，体现了"同一引用类型、不同运行行为"的多态特征。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：多态形参——统一处理多个子类"
      code={`// 要求：定义 printAnimalInfo(Animal animal) 方法（static）
// 该方法调用 animal.eat() 和 animal.sleep()
// 在 main 里分别传入 Cat 和 Dog 对象调用该方法
// （Cat、Dog、Animal 的定义与本节示例相同）

public class Exercise03 {

    public static void printAnimalInfo(Animal animal) {
        // 补全
    }

    public static void main(String[] args) {
        // 补全：分别传入 Cat 和 Dog
    }
}`}
      answerCode={`public class Exercise03 {

    public static void printAnimalInfo(Animal animal) {
        animal.eat();
        animal.sleep();
    }

    public static void main(String[] args) {
        printAnimalInfo(new Cat());
        System.out.println("---");
        printAnimalInfo(new Dog());
    }
}

/* 控制台输出：
猫在吃猫粮
动物在睡觉
---
狗在啃骨头
动物在睡觉

解析：printAnimalInfo 的形参类型是 Animal，传入 Cat 或 Dog 都合法（向上转型自动发生）。
      eat() 因子类重写而各不相同；sleep() 子类未重写，统一走父类版本。
      形参用父类型是多态最常见的实用场景。
*/`}
    />
  </article>
);

export default index;
