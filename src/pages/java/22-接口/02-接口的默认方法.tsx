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
    <Title>接口的默认方法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        JDK 8 之前，接口里只能有抽象方法。一旦给接口新增一个抽象方法，所有实现类都必须跟着改——
        这在大型项目中代价极高。JDK 8 引入了<Text bold>默认方法（default method）</Text>：
        接口方法可以有具体实现，实现类<Text bold>自动继承</Text>默认实现，也可以选择<Text bold>覆盖重写</Text>。
        本节掌握默认方法的格式、使用场景、实现类重写的规则，以及与抽象方法的区别。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要默认方法</Heading3>
    <Paragraph>
      假设你写了一个接口 <InlineCode>USB</InlineCode>，已经有 100 个实现类。
      现在要给接口新增一个 <InlineCode>powerSupply()</InlineCode> 方法，
      如果它是抽象方法，100 个实现类全部编译报错，全部都要改——这叫<Text bold>接口升级困难</Text>。
    </Paragraph>
    <Paragraph>
      解决方案：把新增方法定义为<Text bold>默认方法</Text>，提供一个通用实现。
      原来的 100 个实现类一行代码不改也能正常编译，需要特殊行为的实现类再重写即可。
    </Paragraph>

    <Heading3>2. 默认方法的定义格式</Heading3>
    <Paragraph>
      在接口中定义默认方法，需要在返回值类型前加 <InlineCode>default</InlineCode> 关键字，
      且必须有方法体：
    </Paragraph>
    <CodeBlock
      language="text"
      title="接口默认方法格式"
      code={`public interface 接口名 {
    // 抽象方法（照常）
    void abstractMethod();

    // 默认方法：有方法体，用 default 修饰
    public default 返回值类型 方法名(参数列表) {
        // 方法体
    }
}`}
    />
    <Table
      head={['要点', '说明']}
      rows={[
        ['default 关键字', '不能省略，它告诉编译器这是有方法体的接口方法，而非抽象方法'],
        ['public 修饰符', '可以省略，编译器自动补全为 public'],
        ['方法体', '必须有 {}，里面写具体逻辑；与普通方法体写法相同'],
        ['实现类自动继承', '实现类不重写时，自动拥有默认方法的实现'],
        ['实现类可以重写', '重写时去掉 default 关键字，写法与普通重写相同'],
      ]}
    />
    <Callout type="danger" title="重写默认方法时必须去掉 default">
      实现类重写接口的默认方法时，<Text bold>不能保留 default 关键字</Text>，
      直接写 <InlineCode>@Override public 返回值 方法名() {}</InlineCode> 即可。
      <InlineCode>default</InlineCode> 是接口专用关键字，类中使用会编译报错。
    </Callout>

    <Heading3>3. 默认方法的使用规则</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>实现类直接继承使用</Text>：实现类不重写默认方法，则自动拥有接口的默认实现，
        通过实现类对象直接调用。
      </ListItem>
      <ListItem>
        <Text bold>实现类可以重写</Text>：实现类重写后，调用时执行实现类的版本（与重写抽象方法规则相同）。
      </ListItem>
      <ListItem>
        <Text bold>默认方法内可以调用接口中的其他方法</Text>：包括抽象方法，运行时执行的是实现类的版本（多态）。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="默认方法与抽象方法的本质区别">
      抽象方法是「必须完成的任务」，实现类强制重写；
      默认方法是「可选升级」，实现类可用可改，接口本身已提供兜底实现。
    </Callout>

    <Heading3>4. 示例代码</Heading3>
    <Heading4>示例 1：两个实现类，一个沿用默认方法，一个重写</Heading4>
    <Paragraph>
      <InlineCode>USB</InlineCode> 接口新增默认方法 <InlineCode>powerSupply()</InlineCode>，
      表示"提供电源"。<InlineCode>Mouse</InlineCode> 沿用默认实现，
      <InlineCode>Keyboard</InlineCode> 重写为自己的行为。
    </Paragraph>
    <CodeBlock
      title="USB.java"
      code={`public interface USB {
    // 抽象方法（原有，照常）
    void connect();
    void disconnect();

    // JDK8 新增：默认方法，提供兜底实现
    public default void powerSupply() {
        System.out.println("USB 接口提供 5V 标准供电");
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

    // 不重写 powerSupply()，自动继承接口的默认实现
}`}
    />
    <CodeBlock
      title="Keyboard.java"
      code={`public class Keyboard implements USB {

    @Override
    public void connect() {
        System.out.println("键盘已连接");
    }

    @Override
    public void disconnect() {
        System.out.println("键盘已断开");
    }

    // 重写默认方法：去掉 default，其他写法与普通重写相同
    @Override
    public void powerSupply() {
        System.out.println("机械键盘需要更多电量，使用独立供电");
    }
}`}
    />
    <CodeBlock
      title="DefaultMethodDemo.java"
      code={`public class DefaultMethodDemo {
    public static void main(String[] args) {
        USB mouse = new Mouse();
        mouse.connect();
        mouse.powerSupply();    // 沿用接口默认实现
        mouse.disconnect();

        System.out.println("---");

        USB keyboard = new Keyboard();
        keyboard.connect();
        keyboard.powerSupply(); // 使用 Keyboard 重写后的版本
        keyboard.disconnect();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`鼠标已连接
USB 接口提供 5V 标准供电
鼠标已断开
---
键盘已连接
机械键盘需要更多电量，使用独立供电
键盘已断开`} />
    <Paragraph>
      <InlineCode>Mouse</InlineCode> 没有重写 <InlineCode>powerSupply()</InlineCode>，
      调用时执行接口的默认版本；<InlineCode>Keyboard</InlineCode> 重写了，执行自己的版本。
      两种行为共存，且原来已有的实现类无需改动——这就是默认方法解决接口升级问题的核心价值。
    </Paragraph>

    <Heading4>示例 2：默认方法内调用接口的抽象方法</Heading4>
    <Paragraph>
      默认方法可以在方法体内调用接口中的抽象方法，实际执行时会调用实现类重写的版本，体现多态。
    </Paragraph>
    <CodeBlock
      title="LiveAble.java"
      code={`public interface LiveAble {
    String getName();  // 抽象方法，由实现类提供名字

    void eat();        // 抽象方法

    // 默认方法：调用了同接口的抽象方法 getName() 和 eat()
    default void dailyRoutine() {
        System.out.println(getName() + " 开始日常活动：");
        eat();
        System.out.println(getName() + " 日常活动结束");
    }
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat implements LiveAble {

    @Override
    public String getName() {
        return "小猫";
    }

    @Override
    public void eat() {
        System.out.println("小猫在吃鱼");
    }
    // 不重写 dailyRoutine()，直接继承默认实现
}`}
    />
    <CodeBlock
      title="Dog.java"
      code={`public class Dog implements LiveAble {

    @Override
    public String getName() {
        return "小狗";
    }

    @Override
    public void eat() {
        System.out.println("小狗在啃骨头");
    }
    // 不重写 dailyRoutine()，直接继承默认实现
}`}
    />
    <CodeBlock
      title="DefaultCallDemo.java"
      code={`public class DefaultCallDemo {
    public static void main(String[] args) {
        LiveAble cat = new Cat();
        cat.dailyRoutine();

        System.out.println("---");

        LiveAble dog = new Dog();
        dog.dailyRoutine();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`小猫 开始日常活动：
小猫在吃鱼
小猫 日常活动结束
---
小狗 开始日常活动：
小狗在啃骨头
小狗 日常活动结束`} />
    <Paragraph>
      <InlineCode>dailyRoutine()</InlineCode> 是默认方法，在它的方法体里调用了
      <InlineCode>getName()</InlineCode> 和 <InlineCode>eat()</InlineCode> 两个抽象方法。
      运行时依据对象的实际类型（<InlineCode>Cat</InlineCode> 或 <InlineCode>Dog</InlineCode>）
      决定调用哪个版本——这是<Text bold>多态在接口默认方法内的应用</Text>，非常实用。
    </Paragraph>

    <Callout type="success" title="本节要点回顾">
      <UnorderedList>
        <ListItem>JDK 8 新增，解决接口升级不破坏已有实现类的问题。</ListItem>
        <ListItem>格式：<InlineCode>public default 返回值 方法名() {}</InlineCode>，<InlineCode>default</InlineCode> 不能省。</ListItem>
        <ListItem>实现类自动继承默认实现，也可以重写（重写时去掉 default）。</ListItem>
        <ListItem>默认方法体内可以调用接口的其他方法，执行时按实际对象类型走多态。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：给接口新增默认方法，不破坏已有实现类"
      code={`// 已有接口和实现类如下，要求在不修改 OldImpl 的前提下，
// 给 Printable 接口新增默认方法 printBanner()，
// 打印 "=== 内容 ===" 格式（内容通过抽象方法 getContent() 获取）。
// 新建 NewImpl 实现 Printable，重写 getContent() 返回"NewImpl的内容"，
// 并重写 printBanner() 打印 "*** 内容 ***" 格式。

public interface Printable {
    String getContent();
    // 在这里新增默认方法 printBanner()
}

// 已有实现类，不能修改
public class OldImpl implements Printable {
    @Override
    public String getContent() {
        return "OldImpl的内容";
    }
}

// 新建实现类，重写 printBanner()
public class NewImpl implements Printable {
    // 补全
}

public class Exercise01 {
    public static void main(String[] args) {
        Printable old = new OldImpl();
        old.printBanner();   // 使用默认实现

        Printable newObj = new NewImpl();
        newObj.printBanner(); // 使用重写后的实现
    }
}`}
      answerCode={`public interface Printable {
    String getContent();

    default void printBanner() {
        System.out.println("=== " + getContent() + " ===");
    }
}

// OldImpl 无需修改，自动继承 printBanner() 默认实现
public class OldImpl implements Printable {
    @Override
    public String getContent() {
        return "OldImpl的内容";
    }
}

public class NewImpl implements Printable {
    @Override
    public String getContent() {
        return "NewImpl的内容";
    }

    @Override
    public void printBanner() {
        System.out.println("*** " + getContent() + " ***");
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Printable old = new OldImpl();
        old.printBanner();

        Printable newObj = new NewImpl();
        newObj.printBanner();
    }
}

/* 控制台输出：
=== OldImpl的内容 ===
*** NewImpl的内容 ***

解析：OldImpl 不需要任何修改就能使用新的默认方法，
      NewImpl 重写了 printBanner() 实现了不同的格式。
      这正是默认方法「接口升级不破坏已有实现类」的核心价值。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：判断默认方法重写的写法是否正确"
      code={`// 接口如下，判断 A、B、C 三种写法哪个正确？

interface Greeting {
    default void hello() {
        System.out.println("Hello from interface");
    }
}

// A
class ImplA implements Greeting {
    @Override
    public default void hello() {
        System.out.println("Hello from ImplA");
    }
}

// B
class ImplB implements Greeting {
    @Override
    public void hello() {
        System.out.println("Hello from ImplB");
    }
}

// C
class ImplC implements Greeting {
    // 什么都不写
}

// 请分析 A B C 各自的正确性`}
      answerCode={`// A: 编译报错。
//    实现类中方法不能使用 default 关键字，default 是接口专属关键字，
//    在类里使用 default 会直接编译报错。

// B: 正确。
//    重写接口默认方法时去掉 default，加 @Override，
//    其余写法与普通重写完全相同，这是标准写法。

// C: 正确（不重写，继承默认实现）。
//    实现类不重写默认方法时，自动继承接口的默认实现。
//    ImplC 的 hello() 调用时输出 "Hello from interface"。

/* 总结：
   重写接口默认方法 = 普通重写规则
   唯一特殊点：去掉 default 关键字
*/`}
    />

    <CodeBlock
      qa
      title="练习3：默认方法实现「模板方法」模式"
      code={`// 要求：定义接口 DataProcessor，包含：
// - 抽象方法 readData()，返回 String
// - 抽象方法 processData(String data)，返回 String
// - 默认方法 execute()：依次调用 readData() 和 processData()，
//   打印 "读取数据：xxx"、"处理结果：yyy"
// 实现类 UpperCaseProcessor：readData() 返回 "hello world"，
//   processData() 将数据转为大写并返回。
// 在 main 中调用 execute()。

public interface DataProcessor {
    // 补全抽象方法和默认方法
}

public class UpperCaseProcessor implements DataProcessor {
    // 补全
}

public class Exercise03 {
    public static void main(String[] args) {
        DataProcessor dp = new UpperCaseProcessor();
        dp.execute();
    }
}`}
      answerCode={`public interface DataProcessor {
    String readData();
    String processData(String data);

    default void execute() {
        String raw = readData();
        System.out.println("读取数据：" + raw);
        String result = processData(raw);
        System.out.println("处理结果：" + result);
    }
}

public class UpperCaseProcessor implements DataProcessor {

    @Override
    public String readData() {
        return "hello world";
    }

    @Override
    public String processData(String data) {
        return data.toUpperCase();
    }
}

public class Exercise03 {
    public static void main(String[] args) {
        DataProcessor dp = new UpperCaseProcessor();
        dp.execute();
    }
}

/* 控制台输出：
读取数据：hello world
处理结果：HELLO WORLD

解析：execute() 是默认方法，定义了「读取 → 处理」的固定流程骨架，
      具体的读取和处理逻辑由实现类决定。
      这种模式叫「模板方法模式」，接口默认方法让它在接口层面也能实现。
*/`}
    />
  </article>
);

export default index;
