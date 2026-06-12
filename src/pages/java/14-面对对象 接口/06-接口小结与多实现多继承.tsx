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
    <Title>接口小结与多实现多继承</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节是接口章节的收尾，做两件事：
        第一，用速查表汇总接口的五类成员（抽象方法、默认方法、静态方法、私有方法、常量）；
        第二，深入讲解接口最重要的特性——<Text bold>多实现与接口间的多继承</Text>，
        以及多实现时默认方法冲突的解决方案。最后附上接口与抽象类的完整对比表。
      </Paragraph>
    </Callout>

    <Heading3>1. 接口五类成员速查表</Heading3>
    <Table
      head={['成员类型', '完整修饰符', '可省略为', 'JDK 版本', '调用方式', '实现类可继承/重写']}
      rows={[
        ['抽象方法', 'public abstract', '省略全部', 'JDK 7+', '实现类对象.方法()', '必须重写（强制）'],
        ['默认方法', 'public default', '省略 public', 'JDK 8+', '实现类对象.方法()', '自动继承，可重写'],
        ['静态方法', 'public static', '省略 public', 'JDK 8+', '接口名.方法()', '不可继承，不可重写'],
        ['私有方法', 'private', '不可省略', 'JDK 9+', '只在接口内部调用', '不可继承，不可调用'],
        ['私有静态方法', 'private static', '不可省略', 'JDK 9+', '只在接口内部调用', '不可继承，不可调用'],
        ['常量', 'public static final', '省略全部', 'JDK 7+', '接口名.常量名（推荐）', '可继承（只读），不可修改'],
      ]}
    />

    <Heading3>2. 一个类实现多个接口</Heading3>
    <Paragraph>
      Java 中类只能单继承（<InlineCode>extends</InlineCode> 后只写一个父类），
      但可以<Text bold>同时实现多个接口</Text>，用逗号分隔：
    </Paragraph>
    <CodeBlock
      language="text"
      title="多实现格式"
      code={`public class 类名 implements 接口A, 接口B, 接口C {
    // 必须重写 A、B、C 中全部抽象方法
}`}
    />
    <Paragraph>
      多实现使一个类可以同时具备多套能力，弥补了 Java 单继承的局限性。
      实现类必须重写<Text bold>所有接口的全部抽象方法</Text>，一个都不能漏。
    </Paragraph>

    <Heading3>3. 继承父类同时实现接口</Heading3>
    <Paragraph>
      一个类可以在继承父类的同时实现接口，<Text bold>extends 在前，implements 在后</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      title="继承+实现格式"
      code={`public class 类名 extends 父类 implements 接口A, 接口B {
    // extends 必须写在 implements 前面
    // 必须重写接口中全部抽象方法（父类已有实现的除外）
}`}
    />
    <Callout type="warning" title="extends 必须在 implements 前面">
      写反了（<InlineCode>implements ... extends ...</InlineCode>）会直接编译报错。
      Java 语法规定：先写继承，再写实现。
    </Callout>

    <Heading3>4. 接口与接口之间：多继承</Heading3>
    <Paragraph>
      类只能单继承，但<Text bold>接口与接口之间可以多继承</Text>，使用 <InlineCode>extends</InlineCode>，
      且可以同时继承多个父接口：
    </Paragraph>
    <CodeBlock
      language="text"
      title="接口多继承格式"
      code={`public interface 子接口 extends 父接口A, 父接口B {
    // 子接口继承了 A 和 B 的全部方法，还可以新增自己的方法
}`}
    />
    <Paragraph>
      实现「子接口」的类，需要重写子接口本身的抽象方法，
      以及从父接口继承下来的所有抽象方法。
    </Paragraph>

    <Heading3>5. 默认方法冲突问题</Heading3>
    <Paragraph>
      当一个类实现了多个接口，而这些接口中有<Text bold>同名且同参数的默认方法</Text>时，
      实现类必须重写该方法来消除冲突，否则编译报错：
    </Paragraph>
    <CodeBlock
      language="text"
      title="默认方法冲突示例"
      code={`interface A {
    default void hello() { System.out.println("A 的 hello"); }
}
interface B {
    default void hello() { System.out.println("B 的 hello"); }
}

// 编译报错：class C inherits unrelated defaults for hello() from types A and B
class C implements A, B {
    // 必须重写 hello() 来消除歧义
    @Override
    public void hello() {
        System.out.println("C 重写了 hello，消除冲突");
        // 如果想调用某个父接口的版本，可以用接口名.super.方法()：
        // A.super.hello();
        // B.super.hello();
    }
}`}
    />
    <Callout type="danger" title="默认方法冲突必须在实现类中重写解决">
      实现类同时从多个接口继承同名默认方法时，不重写就是编译报错。
      重写后若想调用某个具体父接口的版本，使用特殊语法
      <InlineCode>接口名.super.方法名()</InlineCode>。
    </Callout>

    <Heading3>6. 接口 vs 抽象类对比</Heading3>
    <Table
      head={['对比项', '接口（interface）', '抽象类（abstract class）']}
      rows={[
        ['关键字', 'interface', 'abstract class'],
        ['继承/实现', 'implements（可多实现）', 'extends（只能单继承）'],
        ['构造方法', '没有', '有（子类通过 super() 调用）'],
        ['成员变量', '只有常量（public static final）', '普通成员变量（可有各种修饰符）'],
        ['抽象方法', '可以（默认 public abstract）', '可以（用 abstract 修饰）'],
        ['有具体实现的方法', 'default/static（JDK8+）、private（JDK9+）', '普通方法（随意写）'],
        ['设计目的', '定义规范，描述「能做什么」', '抽取公共代码，描述「是什么」'],
        ['典型使用场景', 'Runnable、Comparable、USB', 'Animal、Shape、Employee'],
      ]}
    />
    <Callout type="tip" title="何时用接口，何时用抽象类">
      <UnorderedList>
        <ListItem>
          选接口：多个<Text bold>不相关的类</Text>需要共同具备某项能力（如鸟和飞机都能飞，实现 <InlineCode>Flyable</InlineCode>）；
          或需要让一个类同时具备多套能力（多实现）。
        </ListItem>
        <ListItem>
          选抽象类：多个<Text bold>相关的类</Text>有大量公共代码需要复用，它们本质上都「是」同一类事物
          （如 Cat、Dog 都是 Animal，提取公共属性和方法到 Animal 抽象类）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 综合示例</Heading3>
    <Heading4>示例：多实现 + 继承父类 + 接口多继承</Heading4>
    <Paragraph>
      用一个完整的体系演示：<InlineCode>LiveAble</InlineCode> 和 <InlineCode>USB</InlineCode>
      是两个独立接口；<InlineCode>Connectable</InlineCode> 继承了 <InlineCode>USB</InlineCode>（接口多继承）；
      <InlineCode>Animal</InlineCode> 是父类；<InlineCode>RobotPet</InlineCode> 继承
      <InlineCode>Animal</InlineCode>，同时实现 <InlineCode>LiveAble</InlineCode> 和
      <InlineCode>Connectable</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="LiveAble.java"
      code={`public interface LiveAble {
    void eat();
    void sleep();
}`}
    />
    <CodeBlock
      title="USB.java"
      code={`public interface USB {
    void connect();
}`}
    />
    <CodeBlock
      title="Connectable.java"
      code={`// 接口多继承：Connectable 继承了 USB，并新增 sync() 方法
public interface Connectable extends USB {
    void sync();
}`}
    />
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void breathe() {
        System.out.println(name + " 在呼吸");
    }
}`}
    />
    <CodeBlock
      title="RobotPet.java"
      code={`// extends Animal（继承父类） + implements LiveAble, Connectable（多实现）
// extends 必须在 implements 前面
public class RobotPet extends Animal implements LiveAble, Connectable {

    public RobotPet(String name) {
        super(name);
    }

    // 重写 LiveAble 的全部抽象方法
    @Override
    public void eat() {
        System.out.println(name + " 扫描食物并充电");
    }

    @Override
    public void sleep() {
        System.out.println(name + " 进入待机模式");
    }

    // 重写 Connectable 继承自 USB 的 connect()
    @Override
    public void connect() {
        System.out.println(name + " 通过 USB 连接电脑");
    }

    // 重写 Connectable 自己的 sync()
    @Override
    public void sync() {
        System.out.println(name + " 同步数据完成");
    }
}`}
    />
    <CodeBlock
      title="MultiDemo.java"
      code={`public class MultiDemo {
    public static void main(String[] args) {
        RobotPet robot = new RobotPet("机器宠物");

        // 来自父类 Animal 的方法
        robot.breathe();

        // 来自接口 LiveAble
        robot.eat();
        robot.sleep();

        // 来自接口 Connectable（继承自 USB 的 connect + 自身的 sync）
        robot.connect();
        robot.sync();

        System.out.println("---");

        // 接口多态
        LiveAble la = new RobotPet("小机器人");
        la.eat();
        la.sleep();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`机器宠物 在呼吸
机器宠物 扫描食物并充电
机器宠物 进入待机模式
机器宠物 通过 USB 连接电脑
机器宠物 同步数据完成
---
小机器人 扫描食物并充电
小机器人 进入待机模式`} />
    <Paragraph>
      <InlineCode>RobotPet</InlineCode> 通过多实现同时具备了「活物行为」和「连接能力」，
      并继承了 <InlineCode>Animal</InlineCode> 的 <InlineCode>breathe()</InlineCode>。
      <InlineCode>Connectable extends USB</InlineCode> 的接口多继承让
      <InlineCode>RobotPet</InlineCode> 只需 <InlineCode>implements Connectable</InlineCode>
      就隐式获得了 <InlineCode>USB</InlineCode> 中的规范要求。
    </Paragraph>

    <Heading4>示例 2：默认方法冲突及解决</Heading4>
    <CodeBlock
      title="ConflictDemo.java"
      code={`interface A {
    default void greet() {
        System.out.println("A 接口的问候");
    }
}

interface B {
    default void greet() {
        System.out.println("B 接口的问候");
    }
}

// 必须重写 greet() 消除冲突
class C implements A, B {

    @Override
    public void greet() {
        // 选择调用 A 的版本
        A.super.greet();
        // 或调用 B 的版本：B.super.greet();
        // 或完全自己实现：System.out.println("C 的问候");
    }
}

public class ConflictDemo {
    public static void main(String[] args) {
        C c = new C();
        c.greet();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`A 接口的问候`} />

    <Callout type="success" title="接口章节总体要点">
      <OrderedList>
        <ListItem>
          接口五类成员：抽象方法（强制实现）、默认方法（JDK8，可选重写）、
          静态方法（JDK8，只能接口名调用）、私有方法（JDK9，接口内部复用）、常量（public static final）。
        </ListItem>
        <ListItem>
          一个类可以同时 <InlineCode>implements</InlineCode> 多个接口，必须重写所有接口的全部抽象方法。
        </ListItem>
        <ListItem>
          继承父类同时实现接口：<InlineCode>class C extends D implements A, B</InlineCode>，
          <InlineCode>extends</InlineCode> 在前。
        </ListItem>
        <ListItem>
          接口与接口之间多继承：<InlineCode>interface E extends A, B</InlineCode>。
        </ListItem>
        <ListItem>
          多个接口有同名默认方法时，实现类<Text bold>必须重写</Text>来解决冲突；
          若想沿用某个接口的版本，用 <InlineCode>接口名.super.方法名()</InlineCode>。
        </ListItem>
      </OrderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：多实现综合练习"
      code={`// 要求：
// 接口 Flyable：fly() 方法，打印「xx 在飞翔」
// 接口 Swimmable：swim() 方法，打印「xx 在游泳」
// 父类 Bird：有 name 字段和构造方法，有方法 chirp() 打印「xx 在鸣叫」
// 子类 Duck extends Bird implements Flyable, Swimmable：
//   重写 fly()：「xx 低空飞行」
//   重写 swim()：「xx 在水面游泳」
// main 中创建 Duck 对象（name="唐老鸭"），调用全部四个方法。

public interface Flyable {
    // 补全
}

public interface Swimmable {
    // 补全
}

public class Bird {
    // 补全
}

public class Duck extends Bird implements Flyable, Swimmable {
    // 补全
}

public class Exercise01 {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`public interface Flyable {
    void fly();
}

public interface Swimmable {
    void swim();
}

public class Bird {
    protected String name;

    public Bird(String name) {
        this.name = name;
    }

    public void chirp() {
        System.out.println(name + " 在鸣叫");
    }
}

public class Duck extends Bird implements Flyable, Swimmable {

    public Duck(String name) {
        super(name);
    }

    @Override
    public void fly() {
        System.out.println(name + " 低空飞行");
    }

    @Override
    public void swim() {
        System.out.println(name + " 在水面游泳");
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Duck duck = new Duck("唐老鸭");
        duck.chirp();   // 来自父类 Bird
        duck.fly();     // 来自接口 Flyable
        duck.swim();    // 来自接口 Swimmable
    }
}

/* 控制台输出：
唐老鸭 在鸣叫
唐老鸭 低空飞行
唐老鸭 在水面游泳

解析：Duck 同时继承 Bird（单继承）并实现 Flyable 和 Swimmable（多实现），
      一个类通过多实现拥有了「飞翔」和「游泳」两套能力，体现了接口弥补单继承局限的价值。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：接口多继承与默认方法冲突"
      code={`// 接口 Reader：有默认方法 read()，打印「Reader 读取数据」
// 接口 Writer：有默认方法 read()（同名！），打印「Writer 读取数据」
// 接口 ReadWriter extends Reader, Writer（接口多继承，继承两个接口）
// 类 FileRW implements ReadWriter，需要解决 read() 冲突，
//   自己实现 read()，先调用 Reader.super.read()，再打印「FileRW 完成读写」
// main 中创建 FileRW 对象，调用 read()。

public interface Reader {
    default void read() {
        System.out.println("Reader 读取数据");
    }
}

public interface Writer {
    default void read() {
        System.out.println("Writer 读取数据");
    }
}

public interface ReadWriter extends Reader, Writer {
    // 接口继承了两个有冲突的 read()，这里也需要重写以消除冲突
    // 补全
}

public class FileRW implements ReadWriter {
    // 补全
}

public class Exercise02 {
    public static void main(String[] args) {
        FileRW f = new FileRW();
        f.read();
    }
}`}
      answerCode={`public interface Reader {
    default void read() {
        System.out.println("Reader 读取数据");
    }
}

public interface Writer {
    default void read() {
        System.out.println("Writer 读取数据");
    }
}

// 接口 ReadWriter 继承了两个含冲突默认方法的接口，本身也必须重写 read()
public interface ReadWriter extends Reader, Writer {
    @Override
    default void read() {
        Reader.super.read();  // 调用 Reader 的版本
    }
}

// FileRW 实现 ReadWriter，继承了 ReadWriter 重写后的 read()，可以再覆盖
public class FileRW implements ReadWriter {
    @Override
    public void read() {
        ReadWriter.super.read();             // 调用 ReadWriter 的默认实现
        System.out.println("FileRW 完成读写");
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        FileRW f = new FileRW();
        f.read();
    }
}

/* 控制台输出：
Reader 读取数据
FileRW 完成读写

解析：
1. ReadWriter 继承了 Reader 和 Writer 两个含同名默认方法的接口，
   ReadWriter 本身必须重写 read() 消除冲突，选择调用 Reader.super.read()。
2. FileRW 实现 ReadWriter，可以继续重写，先调用 ReadWriter.super.read()（即 Reader 版本），
   再追加自己的逻辑。
3. 「接口名.super.方法名()」是接口默认方法冲突时调用特定父接口版本的专属语法。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：综合判断题"
      code={`// 判断下列说法正确还是错误，并说明原因。

// 1. 一个类可以同时 extends 两个父类。

// 2. 一个类可以同时 implements 两个接口。

// 3. 接口可以 extends 另一个接口。

// 4. 接口可以 implements 另一个接口。

// 5. class C extends D implements A 中，D 是类，A 是接口，语法正确。

// 6. 实现类实现接口后，如果不想重写接口的抽象方法，必须把实现类声明为 abstract。

// 7. 接口中的静态方法可以通过实现类的对象调用。

// 8. JDK8 之前的接口只能有抽象方法和常量。`}
      answerCode={`// 1. 错误。Java 是单继承，一个类只能 extends 一个父类。

// 2. 正确。Java 允许多实现，一个类可以 implements 多个接口，用逗号分隔。

// 3. 正确。接口与接口之间可以用 extends 多继承，如 interface C extends A, B {}

// 4. 错误。接口不能 implements，implements 是类实现接口的语法，接口之间用 extends。

// 5. 正确。extends 必须在 implements 前面，这是合法且规范的写法。

// 6. 正确。实现类不重写接口全部抽象方法时，必须声明为 abstract class，
//    由其子类负责补全未实现的抽象方法。

// 7. 错误。接口的静态方法只能通过接口名调用（USB.checkVersion()），
//    不能通过实现类名或实现类对象调用，这是接口静态方法区别于类静态方法的关键点。

// 8. 正确。JDK 8 才引入 default 方法和 static 方法；
//    JDK 9 才引入 private 方法。
//    JDK 8 之前接口只允许有抽象方法（public abstract）和常量（public static final）。`}
    />
  </article>
);

export default index;
