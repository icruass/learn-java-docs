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
    <Title>多态的好处与转型</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        多态极大提升了代码的扩展性与灵活性，但同时带来一个弊端：
        父类引用无法直接调用子类特有的方法。
        为了解决这个问题，Java 提供了<Text bold>类型转换</Text>机制，
        分为自动的<Text bold>向上转型</Text>（子 → 父）和手动的<Text bold>向下转型</Text>（父 → 子）。
        本节讲清好处、弊端、两种转型的语法与风险，并介绍用
        <InlineCode>instanceof</InlineCode> 安全判断后再转型的最佳实践。
      </Paragraph>
    </Callout>

    <Heading3>1. 多态的好处</Heading3>
    <Paragraph>
      多态的核心好处是<Text bold>提高扩展性与灵活性</Text>——同一套代码可以处理不同类型的子类对象，
      将来新增子类时，已有代码无需改动。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>方法形参使用父类型</Text>：一个方法可以接收任意子类对象，
        无需为每个子类单独写重载版本。
      </ListItem>
      <ListItem>
        <Text bold>数组/集合使用父类型</Text>：用父类型数组可以存储不同子类对象，
        统一遍历调用同名方法，行为各不相同。
      </ListItem>
      <ListItem>
        <Text bold>符合开闭原则</Text>：对扩展开放（新增子类），对修改关闭（已有方法不变）。
      </ListItem>
    </UnorderedList>

    <Heading3>2. 多态的弊端</Heading3>
    <Paragraph>
      多态下父类引用的功能受限于父类——子类特有的方法（父类中没有声明的）无法通过父类引用直接调用。
    </Paragraph>
    <CodeBlock
      language="text"
      title="弊端示意"
      code={`Animal a = new Cat();
a.eat();         // 合法：Animal 有 eat()
a.catchMouse();  // 编译报错：Animal 中没有 catchMouse()，即使 Cat 有也不行`}
    />
    <Callout type="warning" title="父类引用只能看到父类的成员">
      多态引用在编译期被限制为父类视角，只有父类中声明过的方法才能通过它调用。
      若需要使用子类特有功能，必须先进行<Text bold>向下转型</Text>。
    </Callout>

    <Heading3>3. 向上转型（自动转型，子 → 父）</Heading3>
    <Paragraph>
      向上转型是指将子类对象赋给父类引用，Java <Text bold>自动完成</Text>，无需任何强制转换语法。
      这也是多态格式本身就在做的事情：
    </Paragraph>
    <CodeBlock
      language="text"
      title="向上转型格式"
      code={`父类型 变量名 = new 子类型();   // 自动向上转型，安全，无需强制转换`}
    />
    <Table
      head={['特点', '说明']}
      rows={[
        ['方向', '子类 → 父类（由小范围到大范围）'],
        ['是否需要强转', '不需要，自动完成'],
        ['是否安全', '完全安全，子类一定"是"父类的一种'],
        ['能访问的成员', '只能访问父类中有的成员（编译看左边）'],
      ]}
    />

    <Heading3>4. 向下转型（强制转型，父 → 子）</Heading3>
    <Paragraph>
      向下转型是指将父类引用强制转换回子类型，目的是调用子类特有的方法。
      语法上需要<Text bold>手动写强制转换</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      title="向下转型格式"
      code={`子类型 变量名 = (子类型) 父类引用;   // 强制向下转型`}
    />
    <Table
      head={['特点', '说明']}
      rows={[
        ['方向', '父类 → 子类（由大范围到小范围）'],
        ['是否需要强转', '需要，语法上写 (子类型)'],
        ['是否安全', '不一定安全，转错类型会抛 ClassCastException'],
        ['能访问的成员', '可以访问子类特有的全部成员'],
      ]}
    />
    <Callout type="danger" title="ClassCastException——转型错误的运行时异常">
      <Paragraph>
        向下转型在<Text bold>编译期不报错</Text>（只要两个类型存在继承关系），
        但在<Text bold>运行期</Text>，如果实际对象并不是目标子类型，
        Java 会抛出 <InlineCode>ClassCastException</InlineCode>（类型转换异常），程序崩溃。
      </Paragraph>
      <Paragraph>
        例如：<InlineCode>Animal a = new Dog();</InlineCode> 之后执行
        <InlineCode>Cat c = (Cat) a;</InlineCode>——编译通过，但运行时 a 实际是 Dog，
        不能转成 Cat，抛 ClassCastException。
      </Paragraph>
    </Callout>

    <Heading3>5. instanceof 安全判断</Heading3>
    <Paragraph>
      为了避免 <InlineCode>ClassCastException</InlineCode>，
      在向下转型之前应先用 <InlineCode>instanceof</InlineCode> 关键字判断对象的真实类型：
    </Paragraph>
    <CodeBlock
      language="text"
      title="instanceof 语法"
      code={`if (变量名 instanceof 类型名) {
    // 判断为 true，说明变量指向的对象确实是该类型（或其子类），安全转型
    类型名 子类变量 = (类型名) 变量名;
}`}
    />
    <UnorderedList>
      <ListItem>
        <InlineCode>instanceof</InlineCode> 返回 <InlineCode>boolean</InlineCode>，
        <InlineCode>true</InlineCode> 表示对象是该类型或其子类的实例。
      </ListItem>
      <ListItem>
        先判断再转型，可以完全避免 <InlineCode>ClassCastException</InlineCode>。
      </ListItem>
      <ListItem>
        变量为 <InlineCode>null</InlineCode> 时，<InlineCode>null instanceof 任意类型</InlineCode>
        返回 <InlineCode>false</InlineCode>，不会空指针，安全。
      </ListItem>
    </UnorderedList>

    <Heading3>6. 完整示例代码</Heading3>
    <Heading4>示例 1：向上转型与向下转型</Heading4>
    <Paragraph>
      演示完整流程：向上转型创建多态引用 → 调用通用方法 → 向下转型调用子类特有方法。
    </Paragraph>
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    public void eat() {
        System.out.println("动物在吃东西");
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

    // Cat 特有方法，Animal 中没有
    public void catchMouse() {
        System.out.println("猫在抓老鼠");
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

    // Dog 特有方法，Animal 中没有
    public void fetch() {
        System.out.println("狗在捡飞盘");
    }
}`}
    />
    <CodeBlock
      title="CastDemo.java"
      code={`public class CastDemo {
    public static void main(String[] args) {
        // 向上转型（自动）：子类对象赋给父类引用
        Animal a = new Cat();   // Cat 自动向上转型为 Animal

        // 通过父类引用调用共有方法，运行执行子类重写版本
        a.eat();   // 猫在吃猫粮

        // a.catchMouse();  // 编译报错：Animal 没有 catchMouse()

        // 向下转型（强制）：将父类引用转回子类型，才能调用子类特有方法
        Cat cat = (Cat) a;   // a 实际指向 Cat 对象，转型安全
        cat.catchMouse();    // 现在可以调用 Cat 特有方法了

        System.out.println("---");

        // 再来一组：Dog
        Animal a2 = new Dog();   // 向上转型
        a2.eat();
        Dog dog = (Dog) a2;      // 向下转型
        dog.fetch();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`猫在吃猫粮
猫在抓老鼠
---
狗在啃骨头
狗在捡飞盘`} />

    <Heading4>示例 2：ClassCastException 触发与 instanceof 防护</Heading4>
    <Paragraph>
      演示将 <InlineCode>Dog</InlineCode> 对象错误转型为 <InlineCode>Cat</InlineCode>
      导致异常，以及用 <InlineCode>instanceof</InlineCode> 安全判断的正确做法。
    </Paragraph>
    <CodeBlock
      title="ClassCastDemo.java"
      code={`public class ClassCastDemo {
    public static void main(String[] args) {
        Animal a = new Dog();   // 实际对象是 Dog

        // 错误的向下转型：a 实际是 Dog，强转为 Cat 会在运行时抛 ClassCastException
        // Cat cat = (Cat) a;   // 编译通过，但运行时崩溃！

        // 正确做法：先用 instanceof 判断，再转型
        if (a instanceof Cat) {
            Cat cat = (Cat) a;
            cat.catchMouse();
        } else {
            System.out.println("a 不是 Cat，无法调用 catchMouse()");
        }

        if (a instanceof Dog) {
            Dog dog = (Dog) a;
            dog.fetch();        // 安全转型后调用 Dog 特有方法
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`a 不是 Cat，无法调用 catchMouse()
狗在捡飞盘`} />
    <Paragraph>
      通过 <InlineCode>instanceof</InlineCode> 判断，程序不再因错误转型而崩溃。
      <InlineCode>a instanceof Cat</InlineCode> 返回 <InlineCode>false</InlineCode>（a 实际是 Dog），
      进入 else 分支；<InlineCode>a instanceof Dog</InlineCode> 返回 <InlineCode>true</InlineCode>，
      安全地转型并调用了 <InlineCode>Dog</InlineCode> 的特有方法。
    </Paragraph>

    <Heading4>示例 3：多态形参 + 向下转型综合运用</Heading4>
    <Paragraph>
      实际开发中常见的模式：方法形参用父类型接收任意子类对象，
      方法内部用 <InlineCode>instanceof</InlineCode> 判断实际类型，再向下转型调用特有行为。
    </Paragraph>
    <CodeBlock
      title="AnimalManager.java"
      code={`public class AnimalManager {

    // 形参用父类型，统一接收所有 Animal 子类
    public static void manage(Animal animal) {
        animal.eat();   // 多态，调用各自重写的 eat()

        // 根据实际类型，向下转型调用特有功能
        if (animal instanceof Cat) {
            Cat cat = (Cat) animal;
            cat.catchMouse();
        } else if (animal instanceof Dog) {
            Dog dog = (Dog) animal;
            dog.fetch();
        }
        System.out.println("---");
    }

    public static void main(String[] args) {
        manage(new Cat());
        manage(new Dog());
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`猫在吃猫粮
猫在抓老鼠
---
狗在啃骨头
狗在捡飞盘
---`} />
    <Paragraph>
      <InlineCode>manage</InlineCode> 方法只写一次，却能处理 <InlineCode>Cat</InlineCode>
      和 <InlineCode>Dog</InlineCode> 两种子类对象，并在运行时安全地调用各自的特有方法。
      将来新增 <InlineCode>Bird</InlineCode> 子类，只需在 <InlineCode>manage</InlineCode>
      方法里增加一个 <InlineCode>else if</InlineCode> 分支即可，不影响现有逻辑。
    </Paragraph>

    <Callout type="success" title="小结">
      <Paragraph>多态转型核心要点：</Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>好处</Text>：方法形参用父类型，可统一处理所有子类对象，提升扩展性，符合开闭原则。
        </ListItem>
        <ListItem>
          <Text bold>弊端</Text>：父类引用无法调用子类特有方法，只能调用父类中声明的方法。
        </ListItem>
        <ListItem>
          <Text bold>向上转型</Text>：<InlineCode>Animal a = new Cat();</InlineCode>，自动完成，安全。
        </ListItem>
        <ListItem>
          <Text bold>向下转型</Text>：<InlineCode>Cat c = (Cat) a;</InlineCode>，手动强转，存在
          <InlineCode>ClassCastException</InlineCode> 风险。
        </ListItem>
        <ListItem>
          <Text bold>instanceof 安全判断</Text>：先判断再转型，彻底规避
          <InlineCode>ClassCastException</InlineCode>。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：向上转型与向下转型基础练习"
      code={`// 要求：
// 1. 父类 Shape 有 draw() 方法，打印"图形在绘制"
// 2. 子类 Circle 重写 draw()，打印"圆形在绘制"；有特有方法 calcArea()，打印"计算圆的面积"
// 3. 用多态格式创建 Circle 对象赋给 Shape 引用，调用 draw()
// 4. 向下转型后调用 Circle 的 calcArea()

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

    public void calcArea() {
        // 补全
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        // 1. 向上转型
        // 2. 调用 draw()
        // 3. 向下转型
        // 4. 调用 calcArea()
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

    public void calcArea() {
        System.out.println("计算圆的面积");
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        // 1. 向上转型（自动）
        Shape s = new Circle();

        // 2. 调用父类有的方法，运行执行子类重写版本
        s.draw();

        // 3. 向下转型（手动强转），才能调用 Circle 特有方法
        Circle c = (Circle) s;

        // 4. 调用子类特有方法
        c.calcArea();
    }
}

/* 控制台输出：
圆形在绘制
计算圆的面积

解析：s.draw() 通过多态执行 Circle 的重写版本；
      s 本来就指向 Circle 对象，向下转型安全；
      转型后可调用 Circle 特有的 calcArea()。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：instanceof 安全判断练习"
      code={`// 已知 Animal、Cat（有 catchMouse()）、Dog（有 fetch()），
// 完成 performAction 方法：接收 Animal 参数，先调用 eat()，
// 再用 instanceof 判断是 Cat 还是 Dog，调用对应的特有方法。

public class Exercise02 {

    public static void performAction(Animal animal) {
        // 1. 调用 eat()（多态）
        // 2. instanceof 判断类型
        // 3. 向下转型并调用特有方法
    }

    public static void main(String[] args) {
        performAction(new Cat());
        System.out.println("---");
        performAction(new Dog());
    }
}`}
      answerCode={`public class Exercise02 {

    public static void performAction(Animal animal) {
        animal.eat();   // 多态调用，各执行子类重写版本

        if (animal instanceof Cat) {
            Cat cat = (Cat) animal;
            cat.catchMouse();
        } else if (animal instanceof Dog) {
            Dog dog = (Dog) animal;
            dog.fetch();
        }
    }

    public static void main(String[] args) {
        performAction(new Cat());
        System.out.println("---");
        performAction(new Dog());
    }
}

/* 控制台输出：
猫在吃猫粮
猫在抓老鼠
---
狗在啃骨头
狗在捡飞盘

解析：instanceof 先判断实际类型，确认无误后再向下转型，
      完全规避 ClassCastException 风险，是向下转型的最佳实践。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：ClassCastException 分析与修复"
      code={`// 下面代码会在运行时抛出 ClassCastException，请指出原因并修复（用 instanceof 判断）。

public class Exercise03 {
    public static void main(String[] args) {
        Animal a = new Dog();   // 实际对象是 Dog

        // 下面这行会发生什么？
        Cat cat = (Cat) a;
        cat.catchMouse();
    }
}`}
      answerCode={`// 问题分析：
// a 实际指向的是 Dog 对象，强行转型为 Cat 时，
// 编译器不报错（Dog 和 Cat 都是 Animal 的子类，编译器认为语法合法），
// 但运行时 JVM 检查发现 Dog 对象根本不是 Cat 类型，抛出 ClassCastException。

// 修复方案：先用 instanceof 判断，确认类型后再转型
public class Exercise03 {
    public static void main(String[] args) {
        Animal a = new Dog();

        if (a instanceof Cat) {
            Cat cat = (Cat) a;
            cat.catchMouse();
        } else {
            System.out.println("a 的实际类型不是 Cat，跳过 catchMouse()");
            // 如果是 Dog，可以调用 Dog 的特有方法
            if (a instanceof Dog) {
                Dog dog = (Dog) a;
                dog.fetch();
            }
        }
    }
}

/* 控制台输出：
a 的实际类型不是 Cat，跳过 catchMouse()
狗在捡飞盘

解析：instanceof 返回 false（a 是 Dog，不是 Cat），进入 else 分支，
      避免了 ClassCastException；随后判断 instanceof Dog 为 true，安全转型调用 fetch()。
      原则：只要做向下转型，必须先用 instanceof 判断，这是工程实践中的强制规范。
*/`}
    />
  </article>
);

export default index;
