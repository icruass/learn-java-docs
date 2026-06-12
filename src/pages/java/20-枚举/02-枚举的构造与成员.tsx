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
    <Title>枚举的构造与成员</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        枚举不只是「一组名字」——既然它本质是类，就可以拥有<Text bold>字段、构造方法、普通方法</Text>，
        甚至让每个枚举项<Text bold>携带自己的数据</Text>（如每个星期对应的中文名、每个行星对应的质量）。
        本节讲解带参数的枚举项、私有构造方法，以及如何在枚举里定义方法，
        还会进阶到「每个枚举项重写抽象方法」的高级用法。
      </Paragraph>
    </Callout>

    <Heading3>1. 给枚举项附带数据</Heading3>
    <Paragraph>
      在枚举项后面加<Text bold>括号传参</Text>，配合<Text bold>私有构造方法</Text>和字段，
      就能让每个枚举项携带额外信息。例如让每个星期带上中文名：
    </Paragraph>
    <CodeBlock
      title="带数据的枚举"
      code={`enum Week {
    // 每个枚举项后面用括号传入构造参数
    MON("星期一"), TUE("星期二"), WED("星期三"),
    THU("星期四"), FRI("星期五"), SAT("星期六"), SUN("星期日");

    private final String cn;   // 字段：中文名

    // 构造方法必须是私有的（枚举项不能在外部 new）
    private Week(String cn) {
        this.cn = cn;
    }

    // 普通方法：对外提供中文名
    public String getCn() {
        return cn;
    }
}

public class EnumField {
    public static void main(String[] args) {
        Week d = Week.WED;
        System.out.println("英文: " + d);            // 枚举项名
        System.out.println("中文: " + d.getCn());     // 携带的数据
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`英文: WED
中文: 星期三`}
    />
    <Callout type="warning" title="三条硬性规则">
      <UnorderedList>
        <ListItem>带参数的枚举项必须有<Text bold>对应的构造方法</Text>。</ListItem>
        <ListItem>枚举的构造方法<Text bold>只能是 private</Text>（写不写都默认私有），外部无法调用。</ListItem>
        <ListItem>枚举项列表必须写在<Text bold>枚举体的第一行</Text>，且以分号结尾（后面还有其它成员时）。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>2. 多个字段的枚举</Heading3>
    <Paragraph>
      枚举项可以携带多个数据，构造方法接收多个参数。例如用枚举表示行星，每个带半径和质量：
    </Paragraph>
    <CodeBlock
      title="多字段枚举"
      code={`enum Planet {
    EARTH(5.976e+24, 6.37814e6),     // 质量, 半径
    MARS(6.421e+23, 3.3972e6);

    private final double mass;
    private final double radius;

    Planet(double mass, double radius) {
        this.mass = mass;
        this.radius = radius;
    }

    // 计算该行星表面重力加速度
    public double gravity() {
        final double G = 6.67300E-11;
        return G * mass / (radius * radius);
    }
}

public class PlanetDemo {
    public static void main(String[] args) {
        System.out.printf("地球重力: %.2f%n", Planet.EARTH.gravity());
        System.out.printf("火星重力: %.2f%n", Planet.MARS.gravity());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`地球重力: 9.80
火星重力: 3.71`}
    />

    <Heading3>3. 枚举可以有方法</Heading3>
    <Paragraph>
      枚举里可以定义任意普通方法、静态方法。这让枚举不只是数据，还能封装行为：
    </Paragraph>
    <CodeBlock
      title="带方法的枚举"
      code={`enum Operation {
    ADD("+"), SUB("-"), MUL("*"), DIV("/");

    private final String symbol;
    Operation(String symbol) { this.symbol = symbol; }

    public String getSymbol() { return symbol; }

    // 静态方法：根据符号找枚举项
    public static Operation fromSymbol(String s) {
        for (Operation op : values()) {     // values() 见下一节
            if (op.symbol.equals(s)) return op;
        }
        throw new IllegalArgumentException("未知运算符: " + s);
    }
}

public class OperationDemo {
    public static void main(String[] args) {
        Operation op = Operation.MUL;
        System.out.println("符号: " + op.getSymbol());
        System.out.println("由 + 查到: " + Operation.fromSymbol("+"));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`符号: *
由 + 查到: ADD`}
    />

    <Heading3>4. 进阶：每个枚举项重写抽象方法</Heading3>
    <Paragraph>
      枚举可以声明<Text bold>抽象方法</Text>，然后让<Text bold>每个枚举项各自实现</Text>。
      这相当于「每个枚举项是一个独立的策略对象」，能优雅地消除大量 if/switch。
      接着上面的运算符，让每个运算自己实现计算逻辑：
    </Paragraph>
    <CodeBlock
      title="枚举 + 抽象方法（策略模式）"
      code={`enum Operation {
    ADD("+") {
        public double apply(double a, double b) { return a + b; }
    },
    SUB("-") {
        public double apply(double a, double b) { return a - b; }
    },
    MUL("*") {
        public double apply(double a, double b) { return a * b; }
    },
    DIV("/") {
        public double apply(double a, double b) { return a / b; }
    };

    private final String symbol;
    Operation(String symbol) { this.symbol = symbol; }

    // 抽象方法：每个枚举项必须实现
    public abstract double apply(double a, double b);

    public String getSymbol() { return symbol; }
}

public class CalcDemo {
    public static void main(String[] args) {
        double x = 6, y = 3;
        for (Operation op : Operation.values()) {
            System.out.printf("%.0f %s %.0f = %.1f%n",
                    x, op.getSymbol(), y, op.apply(x, y));
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`6 + 3 = 9.0
6 - 3 = 3.0
6 * 3 = 18.0
6 / 3 = 2.0`}
    />
    <Callout type="tip" title="这是企业代码里很优雅的写法">
      用「枚举 + 抽象方法」可以把「类型 → 行为」的映射封装进枚举本身，
      调用方只需 <InlineCode>op.apply(a, b)</InlineCode>，无需写一长串 <InlineCode>switch</InlineCode>。
      这是<Text bold>用枚举实现策略模式</Text>的经典手法。
    </Callout>

    <Heading3>5. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>枚举项可<Text bold>带参数</Text>，配合私有构造方法和字段，携带额外数据。</ListItem>
        <ListItem>枚举的构造方法<Text bold>必须私有</Text>；枚举项列表必须在第一行。</ListItem>
        <ListItem>枚举可以有字段、普通方法、静态方法，能封装行为。</ListItem>
        <ListItem>枚举可声明<Text bold>抽象方法</Text>，每个枚举项各自实现——优雅替代 switch（策略模式）。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断对错"
      code={`① 枚举的构造方法可以是 public。
② 枚举项 RED("红") 这种写法，要求枚举有一个接收 String 的构造方法。
③ 枚举不能定义普通方法。
④ 枚举可以声明 abstract 方法，并让每个枚举项实现。`}
      answerCode={`答案：
① 错。枚举构造方法只能是 private（写成 public 会编译错误）；不写修饰符也默认私有。
② 对。带参数的枚举项必须有匹配的构造方法，RED("红") 需要 EnumName(String) 构造方法。
③ 错。枚举可以有字段、普通方法、静态方法，能封装数据与行为。
④ 对。这是枚举的高级用法，每个枚举项以匿名类形式重写抽象方法，常用于策略模式。`}
    />

    <CodeBlock
      qa
      title="练习2：带数据的尺寸枚举"
      code={`// 定义服装尺寸枚举 Size，每个尺寸带一个中文名和对应的胸围(cm)：
//   S("小码", 88), M("中码", 96), L("大码", 104), XL("加大码", 112)
// 提供 getCn() 和 getBust()，打印 L 的信息。

public class Test {
    public static void main(String[] args) {
        // 期望输出：L -> 大码, 胸围104cm
    }
}`}
      answerCode={`enum Size {
    S("小码", 88), M("中码", 96), L("大码", 104), XL("加大码", 112);

    private final String cn;
    private final int bust;

    Size(String cn, int bust) {
        this.cn = cn;
        this.bust = bust;
    }

    public String getCn() { return cn; }
    public int getBust() { return bust; }
}

public class Test {
    public static void main(String[] args) {
        Size s = Size.L;
        System.out.println(s + " -> " + s.getCn() + ", 胸围" + s.getBust() + "cm");
    }
}

/* 控制台输出：
L -> 大码, 胸围104cm

解析：每个枚举项携带两个数据（中文名、胸围），构造方法接收两个参数。
      枚举项把「常量」和「与之绑定的属性」打包在一起，比用 Map 维护映射更内聚、更安全。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：用枚举+抽象方法实现折扣策略"
      code={`// 定义会员等级枚举 Level，每个等级有不同折扣算法：
//   NORMAL：原价；  VIP：打 9 折；  SVIP：打 8 折再减 10。
// 用抽象方法 price(double original) 让每个等级自己实现。
// 验证：原价 200，三个等级各算一次。

public class Test {
    public static void main(String[] args) {
        // 期望：
        // NORMAL: 200.0
        // VIP: 180.0
        // SVIP: 150.0
    }
}`}
      answerCode={`enum Level {
    NORMAL {
        public double price(double original) { return original; }
    },
    VIP {
        public double price(double original) { return original * 0.9; }
    },
    SVIP {
        public double price(double original) { return original * 0.8 - 10; }
    };

    public abstract double price(double original);
}

public class Test {
    public static void main(String[] args) {
        double original = 200;
        for (Level lv : Level.values()) {
            System.out.println(lv + ": " + lv.price(original));
        }
    }
}

/* 控制台输出：
NORMAL: 200.0
VIP: 180.0
SVIP: 150.0

解析：每个等级把自己的折扣算法封装在重写的 price 方法里。
      调用方只需 level.price(original)，新增等级时只加一个枚举项即可，
      不必修改散落各处的 if/switch——这正是枚举实现策略模式的威力。
*/`}
    />
  </article>
);

export default index;
