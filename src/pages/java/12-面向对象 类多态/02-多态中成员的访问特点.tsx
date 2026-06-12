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
    <Title>多态中成员的访问特点</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        使用多态时（<InlineCode>父类型 变量 = new 子类型();</InlineCode>），
        通过该变量访问<Text bold>成员变量</Text>和<Text bold>成员方法</Text>，
        遵循完全不同的规则：
        成员变量"编译和运行都看左边（父类型）"，
        成员方法"编译看左边（父类型必须有），运行看右边（执行子类重写版本）"。
        搞清这两条规则，才能准确预测多态下的输出结果，避免踩坑。
      </Paragraph>
    </Callout>

    <Heading3>1. 两条核心规则总览</Heading3>
    <Table
      head={['访问目标', '编译期（能否通过编译）', '运行期（实际执行哪个）', '口诀']}
      rows={[
        ['成员变量', '看左边（父类型有该变量才合法）', '看左边（取父类型的值）', '编译运行都看左'],
        ['成员方法', '看左边（父类型有该方法才合法）', '看右边（执行子类重写版本）', '编译看左，运行看右'],
      ]}
    />
    <Callout type="danger" title="成员变量没有多态！">
      <Paragraph>
        成员变量不存在"运行看右边"这回事。
        即使父子类都有同名成员变量，通过<Text bold>父类引用</Text>访问到的永远是<Text bold>父类的那个值</Text>，
        子类重新声明的同名变量被"遮蔽"，绝不会因为 new 的是子类而变成子类的值。
        多态只对成员方法生效。
      </Paragraph>
    </Callout>

    <Heading3>2. 成员变量访问特点详解</Heading3>
    <Paragraph>
      父子类如果都声明了同名成员变量，并不是"重写"，而是子类的变量<Text bold>遮蔽</Text>了父类的变量。
      通过多态引用（父类型变量）访问时，Java 的规则很简单：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>编译期</Text>：查看左边声明的类型（父类型），父类型中是否存在该变量；
        不存在则编译报错。
      </ListItem>
      <ListItem>
        <Text bold>运行期</Text>：同样在左边声明的类型（父类型）中取值；
        哪怕 new 的是子类，也不会去取子类的同名变量。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="为什么成员变量不参与多态？">
      方法重写是 Java 虚拟机在运行时根据实际对象类型进行的动态分派，这是多态的底层机制。
      但成员变量没有重写机制，只有遮蔽（shadowing），JVM 不会对变量做动态分派，
      编译器直接按引用类型（左边）确定访问哪个变量。
    </Callout>

    <Heading3>3. 成员方法访问特点详解</Heading3>
    <Paragraph>
      成员方法才是多态真正发挥作用的地方：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>编译期</Text>：查看左边声明的类型（父类型），父类型中必须存在该方法，
        否则编译器报"找不到符号"错误——哪怕子类有这个方法也没用。
      </ListItem>
      <ListItem>
        <Text bold>运行期</Text>：JVM 查看右边实际对象的类型（子类型），
        若子类重写了该方法，执行子类的重写版本；
        若子类未重写，沿继承链向上找到父类版本执行。
      </ListItem>
    </OrderedList>
    <Callout type="warning" title="父类中没有的方法，多态引用无法调用">
      多态下，父类引用只能调用父类中定义的方法。
      子类特有的方法（父类里没有）无法通过父类引用直接调用，
      需要先做向下转型（强制转换为子类型），详见下一节。
    </Callout>

    <Heading3>4. 完整示例代码</Heading3>
    <Heading4>示例 1：Fu / Zi 成员变量与方法对比</Heading4>
    <Paragraph>
      父类 <InlineCode>Fu</InlineCode> 和子类 <InlineCode>Zi</InlineCode> 都有成员变量
      <InlineCode>num</InlineCode> 和方法 <InlineCode>show()</InlineCode>，
      用多态引用 <InlineCode>Fu f = new Zi();</InlineCode> 分别访问，观察差异。
    </Paragraph>
    <CodeBlock
      title="Fu.java"
      code={`public class Fu {
    int num = 10;   // 父类成员变量

    public void show() {
        System.out.println("Fu 的 show 方法，num = " + num);
    }
}`}
    />
    <CodeBlock
      title="Zi.java"
      code={`public class Zi extends Fu {
    int num = 20;   // 子类同名成员变量（遮蔽父类，不是重写）

    @Override
    public void show() {
        System.out.println("Zi 的 show 方法，num = " + num);
    }
}`}
    />
    <CodeBlock
      title="PolymorphismMemberDemo.java"
      code={`public class PolymorphismMemberDemo {
    public static void main(String[] args) {
        // 多态：父类引用指向子类对象
        Fu f = new Zi();

        // 访问成员变量：编译运行都看左边（父类 Fu）
        System.out.println(f.num);   // 结果是 10（父类的 num），不是 20

        // 访问成员方法：编译看左边，运行看右边（子类 Zi 的重写版本）
        f.show();    // 执行 Zi 重写的 show()，而非 Fu 的

        System.out.println("---");

        // 对比：用子类引用直接访问，变量和方法都是子类的
        Zi z = new Zi();
        System.out.println(z.num);   // 20（子类的 num）
        z.show();                    // Zi 的 show()
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`10
Zi 的 show 方法，num = 20
---
20
Zi 的 show 方法，num = 20`} />
    <Paragraph>
      关键对比：<InlineCode>f.num</InlineCode> 打印 10（父类值），
      而 <InlineCode>f.show()</InlineCode> 执行 <InlineCode>Zi</InlineCode> 的版本且内部的
      <InlineCode>num</InlineCode> 是 20——注意 <InlineCode>show()</InlineCode> 方法体内的
      <InlineCode>num</InlineCode> 是在子类 <InlineCode>Zi</InlineCode> 的作用域内访问，
      拿到的是 <InlineCode>Zi</InlineCode> 自己的 <InlineCode>num = 20</InlineCode>，
      这与通过多态引用直接访问 <InlineCode>f.num</InlineCode>（得到父类的 10）是两件不同的事。
    </Paragraph>

    <Heading4>示例 2：Animal / Cat / Dog 完整体系验证</Heading4>
    <Paragraph>
      用更贴近实际的动物体系演示：父类 <InlineCode>Animal</InlineCode> 与子类都有
      <InlineCode>type</InlineCode> 变量和 <InlineCode>eat()</InlineCode> 方法，
      通过多态引用逐一验证两条规则。
    </Paragraph>
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    String type = "动物";   // 父类成员变量

    public void eat() {
        System.out.println(type + "在吃东西");
    }
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat extends Animal {
    String type = "猫";   // 子类同名成员变量，遮蔽父类

    @Override
    public void eat() {
        System.out.println(type + "在吃猫粮");   // 方法体内 type 是子类的"猫"
    }
}`}
    />
    <CodeBlock
      title="Dog.java"
      code={`public class Dog extends Animal {
    String type = "狗";   // 子类同名成员变量，遮蔽父类

    @Override
    public void eat() {
        System.out.println(type + "在啃骨头");
    }
}`}
    />
    <CodeBlock
      title="MemberAccessDemo.java"
      code={`public class MemberAccessDemo {
    public static void main(String[] args) {
        Animal a1 = new Cat();
        Animal a2 = new Dog();

        // 成员变量：编译运行都看左边（Animal），输出父类的 type 值"动物"
        System.out.println("a1.type = " + a1.type);   // 动物（不是"猫"）
        System.out.println("a2.type = " + a2.type);   // 动物（不是"狗"）

        System.out.println("---");

        // 成员方法：运行看右边，各执行子类重写版本
        a1.eat();   // 猫在吃猫粮
        a2.eat();   // 狗在啃骨头
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`a1.type = 动物
a2.type = 动物
---
猫在吃猫粮
狗在啃骨头`} />
    <Paragraph>
      两行 <InlineCode>type</InlineCode> 都输出"动物"，精准印证"成员变量编译运行都看左边"；
      两行 <InlineCode>eat()</InlineCode> 分别执行各子类的重写版本，
      印证"成员方法运行看右边"。
    </Paragraph>

    <Heading4>示例 3：编译看左边——父类没有的方法无法调用</Heading4>
    <Paragraph>
      演示"编译看左边"的含义：父类 <InlineCode>Animal</InlineCode> 没有
      <InlineCode>catchMouse()</InlineCode>，即使子类 <InlineCode>Cat</InlineCode> 有，
      通过 <InlineCode>Animal</InlineCode> 引用也无法调用——编译报错。
    </Paragraph>
    <CodeBlock
      title="编译失败示例（仅用于说明）"
      code={`public class Cat extends Animal {
    @Override
    public void eat() {
        System.out.println("猫在吃猫粮");
    }

    // Cat 特有方法，父类 Animal 中没有
    public void catchMouse() {
        System.out.println("猫在抓老鼠");
    }
}

public class CompileErrorDemo {
    public static void main(String[] args) {
        Animal a = new Cat();

        a.eat();           // 合法：Animal 有 eat()，编译通过，运行执行 Cat 的版本
        // a.catchMouse(); // 编译报错：Animal 中没有 catchMouse()
                           // 编译器看的是 a 的声明类型 Animal，找不到该方法
    }
}`}
    />
    <Callout type="danger" title="编译看左边的实际含义">
      <Paragraph>
        <InlineCode>a</InlineCode> 的声明类型是 <InlineCode>Animal</InlineCode>，
        编译器只知道它是一个 <InlineCode>Animal</InlineCode>，
        不知道（也不关心）运行时它指向的是哪个子类。
        因此，编译期只在 <InlineCode>Animal</InlineCode> 的方法列表中查找，
        找不到 <InlineCode>catchMouse()</InlineCode> 就直接报错。
        若要调用子类特有方法，必须先向下转型：<InlineCode>Cat c = (Cat) a;</InlineCode>，
        详见下一节「多态的好处与转型」。
      </Paragraph>
    </Callout>

    <Heading3>5. 规则汇总口诀表</Heading3>
    <Table
      head={['成员类型', '编译期看哪边', '运行期看哪边', '有无多态']}
      rows={[
        ['成员变量', '左边（父类型）', '左边（父类型）', '无多态，永远是父类的值'],
        ['成员方法', '左边（父类型）', '右边（子类型）', '有多态，子类重写后执行子类版本'],
      ]}
    />
    <Callout type="tip" title="口诀速记">
      <UnorderedList>
        <ListItem>成员变量：<Text bold>编译运行都看左（父类）</Text>，不存在多态。</ListItem>
        <ListItem>成员方法：<Text bold>编译看左，运行看右</Text>，子类重写生效。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：预测多态下成员变量与方法的输出"
      code={`// 下面代码的控制台输出是什么？请逐行分析。

class Base {
    int x = 100;
    public void print() {
        System.out.println("Base print, x = " + x);
    }
}

class Sub extends Base {
    int x = 200;
    @Override
    public void print() {
        System.out.println("Sub print, x = " + x);
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Base b = new Sub();
        System.out.println(b.x);
        b.print();
    }
}`}
      answerCode={`// 控制台输出：
// 100
// Sub print, x = 200

/* 解析：
   b.x：
     成员变量，编译运行都看左边。b 的声明类型是 Base，取 Base 的 x = 100。
     不会取 Sub 的 x = 200，因为成员变量没有多态。

   b.print()：
     成员方法，编译看左边（Base 有 print()，编译通过），运行看右边（new 的是 Sub）。
     Sub 重写了 print()，执行 Sub 的版本，打印 "Sub print, x = 200"。
     注意：Sub 的 print() 方法体内 x 在 Sub 作用域取值为 200，
     这与通过多态引用访问 b.x 得到父类的 100 是两件不同的事。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：Animal / Cat 多态成员访问完整分析"
      code={`// 预测下面代码的输出，并解释原因。

class Animal {
    String name = "动物";
    public void speak() {
        System.out.println(name + "在叫");
    }
}

class Cat extends Animal {
    String name = "猫";
    @Override
    public void speak() {
        System.out.println(name + "：喵喵喵");
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        Animal a = new Cat();

        System.out.println(a.name);  // 输出什么？
        a.speak();                   // 输出什么？
    }
}`}
      answerCode={`// 控制台输出：
// 动物
// 猫：喵喵喵

/* 解析：
   a.name：
     成员变量，编译运行都看左边。a 的类型是 Animal，取 Animal 的 name = "动物"。
     不会取 Cat 的 name = "猫"，成员变量不参与多态。

   a.speak()：
     成员方法，编译看左边（Animal 有 speak()），运行看右边（new 的是 Cat）。
     Cat 重写了 speak()，执行 Cat 的版本。
     Cat 的 speak() 方法体内 name 在 Cat 作用域取值，得到 Cat 自己的 name = "猫"，
     所以打印"猫：喵喵喵"，而不是"动物：喵喵喵"。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：综合——多条多态引用对比"
      code={`// 预测下面四行的输出，并逐一解释成员变量与成员方法的访问规则。

class Shape {
    String color = "无色";
    public void draw() {
        System.out.println("图形在绘制，颜色：" + color);
    }
}

class Circle extends Shape {
    String color = "红色";
    @Override
    public void draw() {
        System.out.println("圆形在绘制，颜色：" + color);
    }
}

class Square extends Shape {
    String color = "蓝色";
    @Override
    public void draw() {
        System.out.println("正方形在绘制，颜色：" + color);
    }
}

public class Exercise03 {
    public static void main(String[] args) {
        Shape s1 = new Circle();
        Shape s2 = new Square();

        System.out.println(s1.color);  // ?
        System.out.println(s2.color);  // ?
        s1.draw();                     // ?
        s2.draw();                     // ?
    }
}`}
      answerCode={`// 控制台输出：
// 无色
// 无色
// 圆形在绘制，颜色：红色
// 正方形在绘制，颜色：蓝色

/* 解析：
   s1.color 和 s2.color：
     成员变量，编译运行都看左边（Shape），取 Shape 的 color = "无色"，
     绝不会因为 new 的是 Circle 或 Square 而取子类的 color。

   s1.draw()：
     运行看右边，new 的是 Circle，执行 Circle 重写的 draw()，
     方法体内 color 在 Circle 作用域取值，为"红色"，打印"圆形在绘制，颜色：红色"。

   s2.draw()：
     运行看右边，new 的是 Square，执行 Square 重写的 draw()，color = "蓝色"。

   核心结论：
     通过多态引用直接访问 .color 是父类的值（无色），
     但在子类方法体内访问 color 是子类自己的值（红色/蓝色），两者切勿混淆。
*/`}
    />
  </article>
);

export default index;
