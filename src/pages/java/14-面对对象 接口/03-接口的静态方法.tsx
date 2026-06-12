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
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>接口的静态方法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        JDK 8 在引入默认方法的同时，还允许接口定义<Text bold>静态方法（static method）</Text>。
        静态方法与类中的静态方法写法一致，有具体方法体。但有一个关键区别：
        接口的静态方法<Text bold>只能通过接口名调用</Text>，不能通过实现类或实现类对象调用，
        也不能被实现类继承或重写。本节掌握格式、调用方式及与默认方法的区别。
      </Paragraph>
    </Callout>

    <Heading3>1. 静态方法的定义格式</Heading3>
    <Paragraph>
      在接口中定义静态方法，使用 <InlineCode>static</InlineCode> 关键字修饰，必须有方法体：
    </Paragraph>
    <CodeBlock
      language="text"
      title="接口静态方法格式"
      code={`public interface 接口名 {
    // 静态方法：用 static 修饰，必须有方法体
    public static 返回值类型 方法名(参数列表) {
        // 方法体
    }
}`}
    />
    <Table
      head={['要点', '说明']}
      rows={[
        ['static 关键字', '不能省略，声明这是静态方法'],
        ['public 修饰符', '可以省略，默认为 public'],
        ['方法体', '必须有具体实现，不能是抽象方法'],
        ['调用方式', '只能通过「接口名.方法名()」调用，唯一合法方式'],
        ['实现类继承', '不能继承，实现类对象无法访问接口静态方法'],
        ['实现类重写', '不能重写，实现类写同名静态方法是独立的新方法，与接口无关'],
      ]}
    />

    <Heading3>2. 静态方法只能通过接口名调用</Heading3>
    <Paragraph>
      这是接口静态方法最重要的规则，也是与类的静态方法最大的区别：
    </Paragraph>
    <Callout type="danger" title="不能用实现类名或实现类对象调用接口静态方法">
      类的静态方法可以通过类名调用，也可以（不推荐地）通过对象调用。
      但接口的静态方法<Text bold>只能通过接口名调用</Text>，以下两种方式均编译报错：
      <UnorderedList>
        <ListItem>
          <InlineCode>实现类名.接口静态方法()</InlineCode> — 编译报错，实现类不继承接口的静态方法。
        </ListItem>
        <ListItem>
          <InlineCode>实现类对象.接口静态方法()</InlineCode> — 编译报错，同上。
        </ListItem>
      </UnorderedList>
      正确写法：<InlineCode>接口名.静态方法()</InlineCode>。
    </Callout>

    <Heading3>3. 静态方法的作用</Heading3>
    <Paragraph>
      接口静态方法适合放置<Text bold>与接口密切相关的工具性方法</Text>，
      这些方法逻辑上属于这个接口的"配套工具"，不依赖具体实现类的状态，可以直接通过接口调用。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        工厂方法：<InlineCode>接口名.of(...)</InlineCode> 等创建对象的便捷方法
        （如 JDK 标准库 <InlineCode>List.of()</InlineCode>、<InlineCode>Map.of()</InlineCode>）。
      </ListItem>
      <ListItem>
        校验方法：验证参数合法性，如 <InlineCode>USB.checkVersion(int v)</InlineCode>。
      </ListItem>
      <ListItem>
        常用工具：与接口功能配套但不需要多态的辅助逻辑。
      </ListItem>
    </UnorderedList>

    <Heading3>4. 静态方法 vs 默认方法对比</Heading3>
    <Table
      head={['对比项', '静态方法', '默认方法']}
      rows={[
        ['JDK 版本', 'JDK 8+', 'JDK 8+'],
        ['关键字', 'static', 'default'],
        ['方法体', '必须有', '必须有'],
        ['调用方式', '只能「接口名.方法()」', '通过实现类对象调用'],
        ['实现类继承', '不能继承', '自动继承'],
        ['实现类重写', '不能重写', '可以重写'],
        ['典型用途', '工具方法、工厂方法', '提供默认行为、接口升级'],
      ]}
    />

    <Heading3>5. 示例代码</Heading3>
    <Heading4>示例 1：基本用法与调用方式验证</Heading4>
    <Paragraph>
      <InlineCode>USB</InlineCode> 接口新增静态方法 <InlineCode>checkVersion(int version)</InlineCode>，
      用于校验 USB 协议版本号是否合法。演示正确与错误的调用方式。
    </Paragraph>
    <CodeBlock
      title="USB.java"
      code={`public interface USB {
    void connect();
    void disconnect();

    // JDK8 新增：静态方法，校验 USB 版本号（1=USB1.0, 2=USB2.0, 3=USB3.0）
    public static void checkVersion(int version) {
        if (version == 1 || version == 2 || version == 3) {
            System.out.println("USB " + version + ".0 版本合法，可以使用");
        } else {
            System.out.println("版本号 " + version + " 不合法，仅支持 1/2/3");
        }
    }
}`}
    />
    <CodeBlock
      title="Mouse.java"
      code={`public class Mouse implements USB {

    @Override
    public void connect() {
        System.out.println("鼠标已连接");
    }

    @Override
    public void disconnect() {
        System.out.println("鼠标已断开");
    }

    // 注意：这里写一个同名静态方法，是 Mouse 自己的新方法，与 USB.checkVersion 毫无关系
    public static void checkVersion(int version) {
        System.out.println("Mouse 自己的 checkVersion，与接口无关：" + version);
    }
}`}
    />
    <CodeBlock
      title="StaticMethodDemo.java"
      code={`public class StaticMethodDemo {
    public static void main(String[] args) {
        // 正确：通过接口名调用静态方法
        USB.checkVersion(2);
        USB.checkVersion(3);
        USB.checkVersion(5);

        System.out.println("---");

        // 实现类自己的静态方法（与接口的静态方法无关）
        Mouse.checkVersion(2);

        // 下面两行会编译报错，取消注释可验证：
        // Mouse mouse = new Mouse();
        // mouse.checkVersion(2);  // 报错：接口静态方法不能通过对象调用
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`USB 2.0 版本合法，可以使用
USB 3.0 版本合法，可以使用
版本号 5 不合法，仅支持 1/2/3
---
Mouse 自己的 checkVersion，与接口无关：2`} />
    <Paragraph>
      <InlineCode>USB.checkVersion()</InlineCode> 是接口的静态方法，只能通过接口名调用。
      <InlineCode>Mouse.checkVersion()</InlineCode> 是 Mouse 类自己定义的独立静态方法，
      虽然同名，但与接口的静态方法<Text bold>没有任何继承或重写关系</Text>，两者互相独立。
    </Paragraph>

    <Heading4>示例 2：静态方法作为工厂方法</Heading4>
    <Paragraph>
      接口静态方法的另一个常见用途是提供<Text bold>工厂方法</Text>，方便创建实现类对象，
      调用方无需知道具体实现类的名字。
    </Paragraph>
    <CodeBlock
      title="LiveAble.java"
      code={`public interface LiveAble {
    void eat();
    void sleep();

    // 静态工厂方法：根据类型字符串创建对应实现类
    static LiveAble create(String type) {
        if ("cat".equals(type)) {
            return new Cat();
        } else if ("dog".equals(type)) {
            return new Dog();
        } else {
            throw new IllegalArgumentException("未知类型：" + type);
        }
    }
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat implements LiveAble {

    @Override
    public void eat() {
        System.out.println("猫在吃鱼");
    }

    @Override
    public void sleep() {
        System.out.println("猫在打盹");
    }
}`}
    />
    <CodeBlock
      title="Dog.java"
      code={`public class Dog implements LiveAble {

    @Override
    public void eat() {
        System.out.println("狗在啃骨头");
    }

    @Override
    public void sleep() {
        System.out.println("狗在趴着睡");
    }
}`}
    />
    <CodeBlock
      title="FactoryDemo.java"
      code={`public class FactoryDemo {
    public static void main(String[] args) {
        // 通过接口名调用静态工厂方法，无需写 new Cat() 或 new Dog()
        LiveAble animal1 = LiveAble.create("cat");
        animal1.eat();
        animal1.sleep();

        System.out.println("---");

        LiveAble animal2 = LiveAble.create("dog");
        animal2.eat();
        animal2.sleep();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`猫在吃鱼
猫在打盹
---
狗在啃骨头
狗在趴着睡`} />
    <Paragraph>
      调用方只写 <InlineCode>LiveAble.create("cat")</InlineCode>，不需要知道实现类叫什么。
      这种模式在 JDK 标准库中大量使用，如 <InlineCode>List.of(1, 2, 3)</InlineCode>
      返回的是内部不可变列表实现，调用方只知道是 <InlineCode>List</InlineCode>。
    </Paragraph>

    <Callout type="success" title="本节要点回顾">
      <UnorderedList>
        <ListItem>JDK 8 新增，格式：<InlineCode>public static 返回值 方法名() {}</InlineCode>，<InlineCode>static</InlineCode> 不能省。</ListItem>
        <ListItem>只能通过<Text bold>接口名.方法名()</Text>调用，不能通过实现类名或对象调用。</ListItem>
        <ListItem>不能被实现类继承，也不能被重写；实现类写同名静态方法是独立的新方法。</ListItem>
        <ListItem>适合放置与接口配套的工具方法、工厂方法等辅助逻辑。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：定义接口静态工具方法"
      code={`// 要求：
// 定义接口 MathTool，包含：
// - 静态方法 max(int a, int b)，返回较大值
// - 静态方法 isEven(int n)，返回 boolean，判断是否为偶数
// 在 main 中通过接口名调用这两个方法。

public interface MathTool {
    // 补全静态方法
}

public class Exercise01 {
    public static void main(String[] args) {
        // 通过接口名调用
        System.out.println(MathTool.max(10, 25));
        System.out.println(MathTool.max(99, 56));
        System.out.println(MathTool.isEven(4));
        System.out.println(MathTool.isEven(7));
    }
}`}
      answerCode={`public interface MathTool {

    static int max(int a, int b) {
        return a >= b ? a : b;
    }

    static boolean isEven(int n) {
        return n % 2 == 0;
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        System.out.println(MathTool.max(10, 25));
        System.out.println(MathTool.max(99, 56));
        System.out.println(MathTool.isEven(4));
        System.out.println(MathTool.isEven(7));
    }
}

/* 控制台输出：
25
99
true
false

解析：接口静态方法通过接口名调用，适合放置工具性逻辑。
      注意 public 可以省略，编译器默认补全。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：判断调用方式对错"
      code={`// 接口和实现类如下，判断 main 中哪些调用合法？

interface Validator {
    static boolean isPositive(int n) {
        return n > 0;
    }
}

class NumberValidator implements Validator {
    // 没有重写任何东西
}

public class Exercise02 {
    public static void main(String[] args) {
        // A
        System.out.println(Validator.isPositive(5));

        // B
        NumberValidator nv = new NumberValidator();
        System.out.println(nv.isPositive(5));

        // C
        System.out.println(NumberValidator.isPositive(5));
    }
}`}
      answerCode={`// A: 合法，正确写法。
//    通过接口名调用接口的静态方法，是唯一合法的调用方式。
//    输出：true

// B: 编译报错。
//    接口的静态方法不能通过实现类的对象调用。
//    报错：Cannot resolve method 'isPositive'

// C: 编译报错。
//    接口的静态方法不能通过实现类名调用（实现类不继承接口的静态方法）。
//    报错：Cannot resolve method 'isPositive'

/* 总结：接口静态方法的调用方式只有一种：接口名.方法名()
   A 正确，B 和 C 均报错。
*/`}
    />
  </article>
);

export default index;
