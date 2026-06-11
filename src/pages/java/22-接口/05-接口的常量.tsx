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
    <Title>接口的常量</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        接口中不仅可以定义方法，还可以定义<Text bold>成员变量</Text>。
        但与普通类不同，接口中的成员变量默认带有 <InlineCode>public static final</InlineCode>
        三个修饰符——这意味着它是一个<Text bold>公共静态常量</Text>，
        必须在声明时赋初值，之后不可修改。
        本节掌握接口常量的格式、命名规范、访问方式以及常见错误。
      </Paragraph>
    </Callout>

    <Heading3>1. 接口中的成员变量就是常量</Heading3>
    <Paragraph>
      在接口中定义的成员变量，无论你写不写修饰符，编译器都会自动补全为
      <InlineCode>public static final</InlineCode>。三个关键字缺一不可，含义如下：
    </Paragraph>
    <Table
      head={['关键字', '含义', '影响']}
      rows={[
        ['public', '公开访问权限', '任何地方都可以访问'],
        ['static', '属于接口本身（类级别）', '不依赖实例，通过接口名直接访问'],
        ['final', '值不可修改', '必须在声明时赋初值；赋值后任何修改都是编译报错'],
      ]}
    />
    <CodeBlock
      language="text"
      title="接口常量的等价写法"
      code={`public interface 接口名 {
    // 以下四种写法完全等价，编译后都是 public static final int MAX_SPEED = 120;
    int MAX_SPEED = 120;
    public int MAX_SPEED = 120;
    static int MAX_SPEED = 120;
    public static final int MAX_SPEED = 120;
}`}
    />
    <Callout type="tip" title="推荐写法：省略修饰符或写完整">
      通常有两种约定：要么全部省略（简洁），要么写完整的 <InlineCode>public static final</InlineCode>（显式清晰）。
      不建议只写部分修饰符，容易让阅读者产生疑惑。
    </Callout>

    <Heading3>2. 常量的命名规范</Heading3>
    <Paragraph>
      接口常量遵循 Java 常量的通用命名惯例：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>全大写字母</Text>，多个单词之间用<Text bold>下划线</Text>分隔。
      </ListItem>
      <ListItem>
        名字要有语义，能表达这个常量的含义，如 <InlineCode>MAX_SPEED</InlineCode>、
        <InlineCode>MIN_AGE</InlineCode>、<InlineCode>DEFAULT_PORT</InlineCode>。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      title="命名示例"
      code={`// 好的命名（全大写 + 下划线 + 有语义）
int MAX_SPEED = 120;
int MIN_AGE = 0;
String DEFAULT_NAME = "未知";

// 不推荐的命名
int maxSpeed = 120;   // 小驼峰，常量应全大写
int m = 120;          // 无意义缩写`}
    />

    <Heading3>3. 常量的访问方式</Heading3>
    <Paragraph>
      接口常量是 <InlineCode>static</InlineCode> 的，推荐通过<Text bold>接口名访问</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      title="访问方式"
      code={`接口名.常量名          // 推荐，语义最清晰
实现类名.常量名         // 可以，但不推荐（容易误以为是实现类自己定义的）
实现类对象.常量名       // 可以，但极不推荐（static 内容不应通过对象访问）`}
    />
    <Callout type="warning" title="通过实现类访问常量不推荐">
      虽然实现类继承了接口的常量，可以通过实现类名或对象访问，
      但这样做会让代码的读者误解常量来自实现类，降低可读性。
      <Text bold>始终通过接口名访问接口常量</Text>是最清晰的写法。
    </Callout>

    <Heading3>4. 接口常量不能修改</Heading3>
    <Paragraph>
      由于有 <InlineCode>final</InlineCode> 修饰，接口常量一旦赋值便不可再修改，
      任何赋值操作都是编译报错：
    </Paragraph>
    <CodeBlock
      language="text"
      title="修改常量 → 编译报错"
      code={`// 编译报错示例：
USB.MAX_VERSION = 5;    // 报错：cannot assign a value to final variable MAX_VERSION
int[] arr = { USB.MAX_VERSION };
arr[0] = 99;            // 这里修改的是 arr[0]，不是常量本身，合法`}
    />
    <Callout type="danger" title="接口常量必须在声明时赋值">
      普通类的 <InlineCode>final</InlineCode> 字段可以在构造方法里赋值，但接口中没有构造方法，
      因此接口常量<Text bold>必须在声明的同一行给出初值</Text>，否则编译报错。
    </Callout>

    <Heading3>5. 示例代码</Heading3>
    <Heading4>示例 1：定义常量并访问</Heading4>
    <Paragraph>
      定义 <InlineCode>USB</InlineCode> 接口，包含协议版本和传输速率两个常量，
      在实现类和测试类中演示访问方式及尝试修改时的报错。
    </Paragraph>
    <CodeBlock
      title="USB.java"
      code={`public interface USB {
    // 接口常量：public static final 可全部省略
    int MAX_VERSION = 3;           // USB 最高版本号
    double MAX_SPEED_GBPS = 10.0;  // USB 3.1 最大传输速率（Gbps）
    String PROTOCOL_NAME = "Universal Serial Bus";

    void connect();
    void disconnect();
}`}
    />
    <CodeBlock
      title="Mouse.java"
      code={`public class Mouse implements USB {

    @Override
    public void connect() {
        // 实现类可以直接使用接口常量（继承来的）
        System.out.println("鼠标已连接，当前 USB 协议最高版本：" + MAX_VERSION);
    }

    @Override
    public void disconnect() {
        System.out.println("鼠标已断开");
    }
}`}
    />
    <CodeBlock
      title="ConstantDemo.java"
      code={`public class ConstantDemo {
    public static void main(String[] args) {
        // 推荐：通过接口名访问常量
        System.out.println("USB 最高版本：" + USB.MAX_VERSION);
        System.out.println("最大速率：" + USB.MAX_SPEED_GBPS + " Gbps");
        System.out.println("协议全称：" + USB.PROTOCOL_NAME);

        System.out.println("---");

        // 通过实现类也可以访问（不推荐，容易误导）
        System.out.println("通过 Mouse 访问：" + Mouse.MAX_VERSION);

        System.out.println("---");

        // 通过对象访问（极不推荐）
        Mouse mouse = new Mouse();
        mouse.connect();

        // 下面这行编译报错，取消注释可验证：
        // USB.MAX_VERSION = 5;  // 报错：cannot assign a value to final variable
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`USB 最高版本：3
最大速率：10.0 Gbps
协议全称：Universal Serial Bus
---
通过 Mouse 访问：3
---
鼠标已连接，当前 USB 协议最高版本：3`} />

    <Heading4>示例 2：接口常量作为共享配置</Heading4>
    <Paragraph>
      接口常量常用于定义一组相关的配置值，让实现类和调用方共同遵守同一套标准。
    </Paragraph>
    <CodeBlock
      title="GameConfig.java"
      code={`public interface GameConfig {
    int MAX_PLAYERS = 4;       // 最多玩家数
    int INIT_HP = 100;         // 初始生命值
    int INIT_MANA = 50;        // 初始魔法值
    String VERSION = "1.0.0";  // 游戏版本
}`}
    />
    <CodeBlock
      title="Player.java"
      code={`public class Player implements GameConfig {
    private String name;
    private int hp;
    private int mana;

    public Player(String name) {
        this.name = name;
        this.hp = INIT_HP;      // 直接使用接口常量
        this.mana = INIT_MANA;  // 直接使用接口常量
    }

    public void status() {
        System.out.println(name + " | HP:" + hp + "/" + INIT_HP
                + " | MP:" + mana + "/" + INIT_MANA);
    }
}`}
    />
    <CodeBlock
      title="GameConfigDemo.java"
      code={`public class GameConfigDemo {
    public static void main(String[] args) {
        System.out.println("游戏版本：" + GameConfig.VERSION);
        System.out.println("最大玩家数：" + GameConfig.MAX_PLAYERS);
        System.out.println("---");

        Player p1 = new Player("勇者");
        Player p2 = new Player("法师");
        p1.status();
        p2.status();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`游戏版本：1.0.0
最大玩家数：4
---
勇者 | HP:100/100 | MP:50/50
法师 | HP:100/100 | MP:50/50`} />
    <Paragraph>
      所有实现 <InlineCode>GameConfig</InlineCode> 的类都自动拥有这些常量，
      配置值改一处（接口里）全部生效。这是接口常量的经典用法——
      作为多个类共享的<Text bold>常量池</Text>。
    </Paragraph>

    <Callout type="success" title="本节要点回顾">
      <UnorderedList>
        <ListItem>接口成员变量默认为 <InlineCode>public static final</InlineCode>，三个修饰符可全部省略。</ListItem>
        <ListItem>必须在声明时赋初值，之后不可修改（任何赋值操作编译报错）。</ListItem>
        <ListItem>命名惯例：全大写字母 + 下划线，如 <InlineCode>MAX_SPEED</InlineCode>。</ListItem>
        <ListItem>推荐通过接口名访问：<InlineCode>接口名.常量名</InlineCode>，语义最清晰。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：定义并使用接口常量"
      code={`// 要求：
// 定义接口 SpeedLevel，包含三个速度等级常量：
//   LOW_SPEED = 30，MEDIUM_SPEED = 60，HIGH_SPEED = 120（单位 km/h）
// 定义实现类 Car implements SpeedLevel，有字段 name（车名）。
// Car 有方法 drive(int speed)：
//   若 speed <= LOW_SPEED，打印 "xx 慢速行驶"
//   若 speed <= MEDIUM_SPEED，打印 "xx 中速行驶"
//   否则打印 "xx 高速行驶"
// main 中创建 Car 对象，分别传入 20、60、100 测试。

public interface SpeedLevel {
    // 补全常量
}

public class Car implements SpeedLevel {
    private String name;

    public Car(String name) {
        this.name = name;
    }

    public void drive(int speed) {
        // 补全
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Car car = new Car("赛车");
        car.drive(20);
        car.drive(60);
        car.drive(100);
    }
}`}
      answerCode={`public interface SpeedLevel {
    int LOW_SPEED = 30;
    int MEDIUM_SPEED = 60;
    int HIGH_SPEED = 120;
}

public class Car implements SpeedLevel {
    private String name;

    public Car(String name) {
        this.name = name;
    }

    public void drive(int speed) {
        if (speed <= LOW_SPEED) {
            System.out.println(name + " 慢速行驶");
        } else if (speed <= MEDIUM_SPEED) {
            System.out.println(name + " 中速行驶");
        } else {
            System.out.println(name + " 高速行驶");
        }
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Car car = new Car("赛车");
        car.drive(20);
        car.drive(60);
        car.drive(100);
    }
}

/* 控制台输出：
赛车 慢速行驶
赛车 中速行驶
赛车 高速行驶

解析：Car 实现 SpeedLevel 后可以直接使用 LOW_SPEED 和 MEDIUM_SPEED 等常量，
      无需加 SpeedLevel. 前缀（但加上也没错）。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：接口常量的访问方式与修改"
      code={`// 接口如下，判断 main 中哪些行合法，哪些报错？

interface Config {
    int MAX_SIZE = 100;
    String DEFAULT_NAME = "未知";
}

class Demo implements Config {
    public void show() {
        System.out.println(MAX_SIZE);       // A：在实现类方法内直接用常量名
        System.out.println(Config.MAX_SIZE); // B：通过接口名访问
        System.out.println(Demo.MAX_SIZE);   // C：通过实现类名访问
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        System.out.println(Config.MAX_SIZE);          // D
        System.out.println(Config.DEFAULT_NAME);      // E

        Config.MAX_SIZE = 200;                         // F：尝试修改常量

        Demo d = new Demo();
        System.out.println(d.MAX_SIZE);               // G：通过对象访问
    }
}`}
      answerCode={`// A: 合法。实现类内部可以直接使用常量名（继承了接口的 static 成员）。
// B: 合法，且推荐。通过接口名访问，语义最清晰。
// C: 合法（但不推荐）。实现类名也可以访问，但会误导读者以为是 Demo 自己定义的。
// D: 合法，推荐。
// E: 合法，推荐。
// F: 编译报错！MAX_SIZE 是 final 的，不可修改。
//    报错：cannot assign a value to final variable MAX_SIZE
// G: 合法（但极不推荐）。通过对象访问 static 成员可以编译通过，
//    但 IDE 会给出警告：应该通过接口名/类名访问。

/* 总结：
   接口常量六种访问方式中，只有 F（修改）报错；
   推荐写法是 B/D/E（通过接口名）；
   A/C/G 合法但不推荐。
*/`}
    />
  </article>
);

export default index;
