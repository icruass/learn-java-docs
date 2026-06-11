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
    <Title>final 关键字</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>final</InlineCode> 是 Java 中的一个修饰符，字面含义是"最终的、不可改变的"。
        它可以修饰<Text bold>类、方法、局部变量、成员变量</Text>四类目标，
        每种用法的限制都不同，但核心思想一致：<Text bold>一旦确定，不允许再改变</Text>。
        本节逐一讲清四种用法，并重点剖析"引用类型变量被 final 修饰"时容易踩的坑。
      </Paragraph>
    </Callout>

    <Heading3>1. final 修饰类——禁止被继承</Heading3>
    <Paragraph>
      用 <InlineCode>final</InlineCode> 修饰的类称为<Text bold>最终类</Text>，该类<Text bold>不能拥有子类</Text>，
      任何试图继承它的代码都会在编译期报错。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        Java 标准库中有大量 final 类，例如 <InlineCode>java.lang.String</InlineCode>、
        <InlineCode>java.lang.Integer</InlineCode>、<InlineCode>java.lang.Math</InlineCode> 等，
        目的是保证这些核心类的行为不被子类篡改，确保安全性与稳定性。
      </ListItem>
      <ListItem>
        final 类的方法隐式地都是 final 的（因为根本不存在子类去重写它们），
        但成员变量不会自动变成 final，仍然可以修改。
      </ListItem>
      <ListItem>
        final 类自身可以正常实例化、调用方法，限制的仅仅是"被继承"这件事。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      title="FinalClassDemo.java"
      code={`// final 修饰类：该类不能被继承
final class Constants {
    static final double PI = 3.14159265358979;

    public void printPI() {
        System.out.println("PI = " + PI);
    }
}

// 编译报错：Cannot inherit from final 'Constants'
// class MyConstants extends Constants { }

public class FinalClassDemo {
    public static void main(String[] args) {
        Constants c = new Constants();  // 可以正常实例化
        c.printPI();                    // 可以正常调用方法
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`PI = 3.141592653589793`} />
    <Callout type="danger" title="继承 final 类会编译报错">
      一旦某个类被声明为 <InlineCode>final</InlineCode>，任何 <InlineCode>extends</InlineCode> 它的写法
      都会在编译期立即报错：<InlineCode>Cannot inherit from final 'XxxClass'</InlineCode>。
      这不是运行期异常，而是编译直接失败。
    </Callout>

    <Heading3>2. final 修饰方法——禁止被重写</Heading3>
    <Paragraph>
      用 <InlineCode>final</InlineCode> 修饰的方法称为<Text bold>最终方法</Text>，子类<Text bold>可以继承并调用</Text>该方法，
      但<Text bold>不能覆盖重写</Text>它。适用场景：某个方法的逻辑非常关键，不允许子类修改行为（比如模板方法模式中固定的骨架步骤）。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        final 方法与普通方法调用方式完全相同，只是编译器多加了一道"禁止重写"的门。
      </ListItem>
      <ListItem>
        <InlineCode>private</InlineCode> 方法本质上也无法被重写（子类根本看不见），
        但语义不同：private 是"不可见"，final 是"可见但锁定"。
      </ListItem>
      <ListItem>
        <InlineCode>static</InlineCode> 方法可以与 <InlineCode>final</InlineCode> 同时使用；
        <InlineCode>abstract</InlineCode> 方法不能与 <InlineCode>final</InlineCode> 同时使用
        （abstract 要求必须重写，final 禁止重写，两者矛盾）。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      title="FinalMethodDemo.java"
      code={`class Vehicle {
    // final 方法：核心安全逻辑，不允许子类修改
    public final void startEngine() {
        System.out.println("发动机点火，执行安全检查...");
    }

    // 普通方法：允许子类重写
    public void drive() {
        System.out.println("Vehicle 行驶中");
    }
}

class Car extends Vehicle {
    // 可以正常重写普通方法
    @Override
    public void drive() {
        System.out.println("Car 以 120km/h 行驶");
    }

    // 编译报错：'startEngine()' cannot override 'startEngine()' in Vehicle; overridden method is final
    // @Override
    // public void startEngine() { }
}

public class FinalMethodDemo {
    public static void main(String[] args) {
        Car car = new Car();
        car.startEngine();  // 继承自 Vehicle，调用 Vehicle 的 final 方法
        car.drive();        // 调用 Car 自己重写的版本
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`发动机点火，执行安全检查...
Car 以 120km/h 行驶`} />
    <Paragraph>
      子类 <InlineCode>Car</InlineCode> 继承了 <InlineCode>startEngine()</InlineCode>，
      可以正常调用；但若试图用 <InlineCode>@Override</InlineCode> 重写它，编译器立刻报错。
      <InlineCode>drive()</InlineCode> 没有 final，子类自由重写没有任何问题。
    </Paragraph>

    <Heading3>3. final 修饰局部变量——只能赋值一次</Heading3>
    <Paragraph>
      用 <InlineCode>final</InlineCode> 修饰方法内的局部变量时，该变量<Text bold>只能被赋值一次</Text>。
      赋值时机有两种：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>声明时直接赋值</Text>：<InlineCode>final int x = 10;</InlineCode>，
        之后任何修改 x 的操作都会编译报错。
      </ListItem>
      <ListItem>
        <Text bold>先声明后赋值</Text>：<InlineCode>final int y;</InlineCode> 先声明，
        后续某处 <InlineCode>y = 20;</InlineCode> 完成唯一一次赋值；
        赋值后同样不能再改。注意：在赋值之前读取 y 也会编译报错（未初始化）。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="final 局部变量的实际用途">
      在方法体内把不需要修改的变量声明为 <InlineCode>final</InlineCode>，
      可以防止自己或他人不小心修改它，让代码意图更清晰，
      也能帮助 JVM 做一定的优化。匿名内部类或 Lambda 中引用的外部局部变量，
      Java 8 之后要求它必须是 final 或"等效 final"（effective final，即声明后从未修改）。
    </Callout>
    <CodeBlock
      title="FinalLocalVarDemo.java"
      code={`public class FinalLocalVarDemo {
    public static void main(String[] args) {
        // 方式一：声明时赋值
        final int MAX = 100;
        System.out.println("MAX = " + MAX);
        // MAX = 200;  // 编译报错：Cannot assign a value to final variable 'MAX'

        // 方式二：先声明后赋值（只能赋值一次）
        final String greeting;
        greeting = "Hello, Java!";  // 第一次赋值，合法
        System.out.println(greeting);
        // greeting = "Hi";  // 第二次赋值，编译报错

        // final 修饰 for 循环变量（每次循环是新的变量）
        for (final int n : new int[]{1, 2, 3}) {
            // n = 0;  // 编译报错
            System.out.println("n = " + n);
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`MAX = 100
Hello, Java!
n = 1
n = 2
n = 3`} />

    <Heading3>4. final 修饰成员变量——必须在规定时机完成赋值</Heading3>
    <Paragraph>
      用 <InlineCode>final</InlineCode> 修饰的<Text bold>成员变量（实例变量或类变量）</Text>，
      规则比局部变量更严格：Java 编译器要求它<Text bold>必须在对象初始化完成前获得一个值</Text>，且只能赋值一次。
      合法的赋值时机如下：
    </Paragraph>
    <Table
      head={['成员变量类型', '合法赋值时机']}
      rows={[
        ['实例 final 变量（无 static）', '① 声明时直接赋值；② 构造方法中赋值（每个构造方法都必须覆盖到）'],
        ['类 final 变量（有 static）', '① 声明时直接赋值；② 静态初始化块 static{ } 中赋值'],
      ]}
    />
    <Callout type="warning" title="final 成员变量不能在普通方法里赋值">
      <InlineCode>final</InlineCode> 成员变量<Text bold>不能在普通实例方法中赋值</Text>，
      因为普通方法可以被多次调用，而 final 只允许赋值一次。
      只有构造方法（或静态初始化块）能保证"恰好在初始化时执行一次"。
    </Callout>
    <Paragraph>
      实际开发中，<InlineCode>static final</InlineCode> 组合最为常见，用于定义<Text bold>全局常量</Text>，
      命名规范是<Text bold>全大写字母加下划线</Text>，例如 <InlineCode>MAX_SIZE</InlineCode>、<InlineCode>DEFAULT_TIMEOUT</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="FinalFieldDemo.java"
      code={`public class FinalFieldDemo {

    // static final：全局常量，声明时赋值，命名全大写
    static final int MAX_SCORE = 100;
    static final String APP_NAME;

    static {
        // 静态初始化块中完成 APP_NAME 的赋值（也只能赋值这一次）
        APP_NAME = "JavaLearn";
    }

    // 实例 final 变量：每个对象有自己的值，在构造方法中赋值
    final String id;

    public FinalFieldDemo(String id) {
        this.id = id;   // 构造方法中赋值，合法且只此一次
    }

    public void printInfo() {
        System.out.println("App: " + APP_NAME + "  MaxScore: " + MAX_SCORE + "  ID: " + id);
        // this.id = "other";  // 编译报错：Cannot assign a value to final variable 'id'
    }

    public static void main(String[] args) {
        FinalFieldDemo obj1 = new FinalFieldDemo("U001");
        FinalFieldDemo obj2 = new FinalFieldDemo("U002");
        obj1.printInfo();
        obj2.printInfo();
        System.out.println("常量: " + MAX_SCORE + ", " + APP_NAME);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`App: JavaLearn  MaxScore: 100  ID: U001
App: JavaLearn  MaxScore: 100  ID: U002
常量: 100, JavaLearn`} />
    <Paragraph>
      <InlineCode>MAX_SCORE</InlineCode> 和 <InlineCode>APP_NAME</InlineCode> 是类级别的全局常量，
      所有对象共享同一份；<InlineCode>id</InlineCode> 是实例级 final 变量，
      每个对象在构造时确定自己的值，之后不可更改。
    </Paragraph>

    <Heading3>5. 特别注意：final 修饰引用类型变量</Heading3>
    <Paragraph>
      这是初学者最容易误解的点。<InlineCode>final</InlineCode> 修饰引用类型变量时，
      锁住的是<Text bold>变量中存储的地址（引用）不可改变</Text>——即不能让该变量指向另一个新对象；
      但<Text bold>被引用对象内部的属性仍然可以修改</Text>，因为那些属性不受这个 final 约束。
    </Paragraph>
    <Callout type="danger" title="final 引用 ≠ 对象不可变">
      <InlineCode>final</InlineCode> 让引用本身"冻结"，但对象的内容照样可以改。
      若要让对象真正不可变，需要把对象的所有字段也声明为 final（或者使用不可变类设计），
      仅靠引用变量上的 final 是不够的。
    </Callout>
    <CodeBlock
      title="FinalReferenceDemo.java"
      code={`class Point {
    int x;
    int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}

public class FinalReferenceDemo {
    public static void main(String[] args) {
        final Point p = new Point(1, 2);

        // 合法：修改对象内部的属性（final 只锁住引用，不锁对象内容）
        p.x = 100;
        p.y = 200;
        System.out.println("p.x=" + p.x + ", p.y=" + p.y);

        // 编译报错：Cannot assign a value to final variable 'p'
        // p = new Point(3, 4);   // 不能让 p 指向新对象

        // final 修饰数组：同理，数组内容可改，引用不可改
        final int[] arr = {1, 2, 3};
        arr[0] = 99;                    // 合法：修改数组元素
        System.out.println("arr[0]=" + arr[0]);
        // arr = new int[]{4, 5, 6};   // 编译报错：不能让 arr 指向新数组
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`p.x=100, p.y=200
arr[0]=99`} />
    <Paragraph>
      <InlineCode>p</InlineCode> 是 final 的，所以 <InlineCode>p = new Point(3, 4)</InlineCode> 会编译报错；
      但 <InlineCode>p.x = 100</InlineCode> 完全合法，因为我们修改的是 <InlineCode>Point</InlineCode> 对象内部的字段，
      而不是 <InlineCode>p</InlineCode> 变量本身。数组同理。
    </Paragraph>

    <Heading3>6. 四种用法汇总对比</Heading3>
    <Table
      head={['修饰目标', '核心限制', '常见用途']}
      rows={[
        ['final 类', '该类不能被继承，不能有子类', '保护核心类（如 String、Integer）；工具类设计'],
        ['final 方法', '该方法不能被子类覆盖重写，但可被继承调用', '锁定关键业务逻辑，防止被篡改'],
        ['final 局部变量', '只能赋值一次（声明时或先声明后赋值均可）', '表达「此值不变」的意图；Lambda 捕获变量'],
        ['final 成员变量', '必须在声明时或构造方法（静态块）中完成唯一一次赋值', '实例不变属性；配合 static 定义全局常量'],
      ]}
    />
    <Callout type="success" title="final 关键字核心要点">
      <UnorderedList>
        <ListItem>final 类——<Text bold>不能继承</Text>；final 方法——<Text bold>不能重写</Text>。</ListItem>
        <ListItem>final 局部变量——<Text bold>只能赋值一次</Text>，可先声明后赋值。</ListItem>
        <ListItem>final 成员变量——必须在<Text bold>声明时或构造方法/静态块</Text>中完成赋值；常与 static 组合做全局常量，命名全大写加下划线。</ListItem>
        <ListItem>final 修饰<Text bold>引用类型</Text>时，锁的是「地址不可变」，对象内部属性仍可修改。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：final 修饰成员变量与常量"
      code={`// 要求：
// 定义 Circle 类，包含：
//   - static final 常量 PI = 3.14159
//   - final 实例变量 radius（在构造方法中赋值）
//   - 方法 area() 返回圆的面积（PI * radius * radius）
// main 中创建两个 Circle，radius 分别为 5 和 10，打印各自面积。

public class Circle {
    // 在这里补全常量和成员变量

    public Circle(double radius) {
        // 在这里补全构造方法
    }

    public double area() {
        // 在这里补全
        return 0;
    }

    public static void main(String[] args) {
        // 在这里补全
    }
}`}
      answerCode={`public class Circle {
    static final double PI = 3.14159;
    final double radius;

    public Circle(double radius) {
        this.radius = radius;   // final 实例变量在构造方法中赋值
    }

    public double area() {
        return PI * radius * radius;
    }

    public static void main(String[] args) {
        Circle c1 = new Circle(5);
        Circle c2 = new Circle(10);
        System.out.println("c1 面积: " + c1.area());
        System.out.println("c2 面积: " + c2.area());
    }
}

/* 控制台输出：
c1 面积: 78.53975
c2 面积: 314.159

解析：PI 是 static final 全局常量，声明时赋值；
      radius 是实例 final 变量，每个对象在构造时确定，之后不可修改。
      两者都只有一次赋值机会，符合 final 的语义。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：final 修饰引用类型变量"
      code={`// 要求：阅读下面代码，判断哪些行合法、哪些行会编译报错，并说明原因。

class Box {
    int size;
    Box(int size) { this.size = size; }
}

public class Exercise02 {
    public static void main(String[] args) {
        final Box box = new Box(10);

        // 行 A
        box.size = 20;

        // 行 B
        System.out.println(box.size);

        // 行 C
        box = new Box(30);

        // 行 D
        final int[] nums = {1, 2, 3};
        nums[1] = 99;

        // 行 E
        nums = new int[]{4, 5, 6};
    }
}`}
      answerCode={`// 行 A：合法。修改的是 box 所引用对象的属性，不是 box 引用本身。
// 行 B：合法。读取引用对象的属性，没有任何限制。
// 行 C：编译报错。试图让 final 变量 box 指向新对象，违反 final 约束。
//        错误信息：Cannot assign a value to final variable 'box'
// 行 D：合法。修改数组元素，不改变 nums 引用的地址。
// 行 E：编译报错。试图让 final 变量 nums 指向新数组，违反 final 约束。

/* 核心结论：
   final 修饰引用类型时，只保证该引用变量「地址不变」——
   不能让它指向新对象（行 C、行 E 报错），
   但被引用对象的内容完全可以修改（行 A、行 D 合法）。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：final 类与 final 方法的继承行为"
      code={`// 要求：根据下面的继承关系，判断哪些操作合法，并写出 main 的实际输出。

final class MathHelper {
    public int square(int n) {
        return n * n;
    }
}

class Shape {
    public final String describe() {
        return "我是一个图形";
    }

    public String color() {
        return "黑色";
    }
}

class Circle extends Shape {
    // 尝试重写 describe()：是否合法？
    // @Override
    // public String describe() { return "我是圆"; }

    @Override
    public String color() {
        return "红色";
    }
}

public class Exercise03 {
    public static void main(String[] args) {
        // A: 合法？
        MathHelper mh = new MathHelper();
        System.out.println(mh.square(5));

        // B: 合法？
        // class SubMath extends MathHelper { }

        Circle c = new Circle();
        System.out.println(c.describe());
        System.out.println(c.color());
    }
}`}
      answerCode={`// A：合法。final 类本身可以正常实例化并调用方法，只是不能被继承。
// B：编译报错。MathHelper 是 final 类，不能有子类。
//    错误：Cannot inherit from final 'MathHelper'
// describe() 重写：编译报错。describe() 是 final 方法，不能被子类重写。
//    错误：'describe()' cannot override 'describe()'; overridden method is final
// color() 重写：合法。color() 是普通方法，可以被重写。

public class Exercise03 {
    public static void main(String[] args) {
        MathHelper mh = new MathHelper();
        System.out.println(mh.square(5));

        Circle c = new Circle();
        System.out.println(c.describe());  // 继承 Shape 的 final 方法，输出父类版本
        System.out.println(c.color());     // Circle 重写了 color()，输出子类版本
    }
}

/* 控制台输出：
25
我是一个图形
红色

解析：
  - mh.square(5) 正常调用，输出 25。
  - c.describe() 调用继承自 Shape 的 final 方法，输出「我是一个图形」，不能被重写。
  - c.color() 调用 Circle 重写的版本，输出「红色」。
*/`}
    />
  </article>
);

export default index;
