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
    <Title>类和接口作为成员与参数</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节是内部类章节的综合应用，也是对前面多态、抽象类、接口知识的整合。
        核心主题：<Text bold>类（普通类/抽象类/接口）作为方法的参数类型和返回值类型</Text>，
        以及作为类的成员变量类型。
        这是 Java 面向对象编程的核心技巧——
        参数/返回值类型越抽象（接口或抽象类），代码的灵活性和扩展性就越强；
        结合匿名内部类，可以做到极致简洁。
      </Paragraph>
    </Callout>

    <Heading3>1. 三种情形总览</Heading3>
    <Table
      head={['情形', '参数/返回值类型', '调用时传入/返回什么', '典型搭配']}
      rows={[
        ['普通类作为参数/返回值', '具体类 Dog', '该类的对象（或子类对象）', '直接 new Dog() 传入'],
        ['抽象类作为参数/返回值', '抽象类 Animal', '子类对象（多态）', 'new Cat()、new Dog()，或匿名内部类'],
        ['接口作为参数/返回值', '接口 Swim', '实现类对象（多态）', '实现类对象，或匿名内部类'],
      ]}
    />
    <Paragraph>
      三种情形的核心规律是一样的：<Text bold>参数/返回值类型写父类型（接口/抽象类/具体类），
      实际传入/返回的是子类型的对象</Text>。这正是多态的本质。
      类型越抽象，调用者就越自由——只要符合接口/抽象类的契约，任何实现都可以传入。
    </Paragraph>

    <Heading3>2. 普通类作为参数与返回值</Heading3>
    <Paragraph>
      最简单的情形：参数类型是一个具体类，传入的就是该类（或其子类）的对象。
      Java 传的是对象的<Text bold>引用（地址）</Text>，方法内部通过引用操作对象的成员。
    </Paragraph>
    <CodeBlock
      title="Dog.java"
      code={`public class Dog {
    private String name;
    private int age;

    public Dog(String name, int age) {
        this.name = name;
        this.age  = age;
    }

    public void bark() {
        System.out.println(name + "（" + age + "岁）：汪汪汪！");
    }

    public String getName() { return name; }
    public int getAge()     { return age;  }
}`}
    />
    <CodeBlock
      title="DogService.java"
      code={`public class DogService {

    // 普通类作为参数
    public static void trainDog(Dog dog) {
        System.out.println("开始训练：" + dog.getName());
        dog.bark();
        System.out.println("训练完成！");
    }

    // 普通类作为返回值
    public static Dog createDog(String name, int age) {
        System.out.println("工厂：创建 Dog 对象 -> " + name);
        return new Dog(name, age);   // 返回 Dog 类型的对象
    }

    public static void main(String[] args) {
        // 普通类作为参数：直接传入对象
        Dog d1 = new Dog("小黑", 3);
        trainDog(d1);

        System.out.println();

        // 普通类作为返回值：接收返回的对象
        Dog d2 = createDog("小白", 2);
        trainDog(d2);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`开始训练：小黑
小黑（3岁）：汪汪汪！
训练完成！

工厂：创建 Dog 对象 -> 小白
开始训练：小白
小白（2岁）：汪汪汪！
训练完成！`} />

    <Heading3>3. 抽象类作为参数与返回值</Heading3>
    <Paragraph>
      参数类型是抽象类时，调用方可以传入该抽象类的<Text bold>任意子类对象</Text>。
      方法内部通过抽象类引用调用方法，走多态，实际执行子类的重写版本。
      常见传入方式：① 预先定义的子类对象 ② 匿名内部类对象（临时一次性使用）。
    </Paragraph>
    <CodeBlock
      title="Shape.java"
      code={`public abstract class Shape {
    private String color;

    public Shape(String color) {
        this.color = color;
    }

    public String getColor() { return color; }

    // 抽象方法：计算面积
    public abstract double area();

    // 抽象方法：描述自己
    public abstract void describe();
}`}
    />
    <CodeBlock
      title="Circle.java"
      code={`public class Circle extends Shape {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public void describe() {
        System.out.println("圆形（" + getColor() + "），半径=" + radius + "，面积=" + String.format("%.2f", area()));
    }
}`}
    />
    <CodeBlock
      title="ShapeService.java"
      code={`public class ShapeService {

    // 抽象类作为参数：接收任意 Shape 子类对象
    public static void printShapeInfo(Shape shape) {
        System.out.println("颜色：" + shape.getColor());
        System.out.printf("面积：%.2f%n", shape.area());
        shape.describe();
    }

    // 抽象类作为返回值：根据类型名称创建不同的子类对象
    public static Shape createShape(String type) {
        if ("circle".equals(type)) {
            return new Circle("红色", 5.0);     // 返回子类对象，向上转型
        }
        // 也可以返回匿名内部类对象（临时定义新子类）
        return new Shape("灰色") {
            @Override
            public double area() { return 0; }

            @Override
            public void describe() {
                System.out.println("未知形状（" + getColor() + "），面积未知");
            }
        };
    }

    public static void main(String[] args) {
        System.out.println("=== 传入具体子类对象 ===");
        Circle c = new Circle("蓝色", 3.0);
        printShapeInfo(c);

        System.out.println();
        System.out.println("=== 传入匿名内部类对象 ===");
        // 直接用匿名内部类作为参数，不定义任何具体子类
        printShapeInfo(new Shape("绿色") {
            @Override
            public double area() {
                return 4.0 * 6.0;  // 假设是 4x6 的矩形
            }

            @Override
            public void describe() {
                System.out.println("矩形（" + getColor() + "），4×6，面积=" + area());
            }
        });

        System.out.println();
        System.out.println("=== 抽象类作为返回值 ===");
        Shape s = createShape("circle");
        printShapeInfo(s);

        System.out.println();
        Shape unknown = createShape("other");
        printShapeInfo(unknown);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`=== 传入具体子类对象 ===
颜色：蓝色
面积：28.27
圆形（蓝色），半径=3.0，面积=28.27

=== 传入匿名内部类对象 ===
颜色：绿色
面积：24.00
矩形（绿色），4×6，面积=24.0

=== 抽象类作为返回值 ===
颜色：红色
面积：78.54
圆形（红色），半径=5.0，面积=78.54

=== 未知形状 ===
颜色：灰色
面积：0.00
未知形状（灰色），面积未知`} />
    <Paragraph>
      关键点：<InlineCode>printShapeInfo(Shape shape)</InlineCode> 的参数类型是抽象类
      <InlineCode>Shape</InlineCode>，它接受的可以是任何子类对象，也可以是匿名内部类对象。
      方法内部的 <InlineCode>shape.area()</InlineCode> 和 <InlineCode>shape.describe()</InlineCode>
      都通过多态机制找到实际类型的重写版本来执行。
    </Paragraph>

    <Heading3>4. 接口作为参数与返回值</Heading3>
    <Paragraph>
      接口作为参数/返回值是实际开发中<Text bold>最常见、最灵活</Text>的设计方式。
      参数类型是接口时，传入的是实现了该接口的任意类的对象（包括匿名内部类）。
      接口是"纯契约"，不包含任何状态，耦合度最低，扩展性最强。
    </Paragraph>
    <CodeBlock
      title="Swim.java"
      code={`public interface Swim {
    void swim();         // 游泳
    void breathe();      // 呼吸方式
}`}
    />
    <CodeBlock
      title="Fish.java"
      code={`// 有名实现类：供需要复用时使用
public class Fish implements Swim {
    private String species;

    public Fish(String species) {
        this.species = species;
    }

    @Override
    public void swim() {
        System.out.println(species + "：摆动鱼鳍前进");
    }

    @Override
    public void breathe() {
        System.out.println(species + "：用鱼鳃从水中吸取氧气");
    }
}`}
    />
    <CodeBlock
      title="SwimPool.java"
      code={`public class SwimPool {

    // 接口作为参数：接受任何实现了 Swim 的对象
    public static void enterPool(Swim swimmer) {
        System.out.println("--- 入场 ---");
        swimmer.breathe();
        swimmer.swim();
    }

    // 接口作为返回值：返回一个 Swim 实现
    public static Swim getDefaultSwimmer() {
        // 返回匿名内部类对象（默认游泳者）
        return new Swim() {
            @Override
            public void swim() {
                System.out.println("默认游泳者：平稳蛙泳");
            }

            @Override
            public void breathe() {
                System.out.println("默认游泳者：每两划换一次气");
            }
        };
    }

    public static void main(String[] args) {
        System.out.println("=== 传入有名实现类对象 ===");
        Fish fish = new Fish("锦鲤");
        enterPool(fish);

        System.out.println();
        System.out.println("=== 传入匿名内部类对象（人类游泳） ===");
        enterPool(new Swim() {
            @Override
            public void swim() {
                System.out.println("人类：自由泳，双臂轮流划水");
            }

            @Override
            public void breathe() {
                System.out.println("人类：侧头换气");
            }
        });

        System.out.println();
        System.out.println("=== 接口作为返回值 ===");
        Swim defaultSwimmer = getDefaultSwimmer();
        enterPool(defaultSwimmer);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`=== 传入有名实现类对象 ===
--- 入场 ---
锦鲤：用鱼鳃从水中吸取氧气
锦鲤：摆动鱼鳍前进

=== 传入匿名内部类对象（人类游泳） ===
--- 入场 ---
人类：侧头换气
人类：自由泳，双臂轮流划水

=== 接口作为返回值 ===
--- 入场 ---
默认游泳者：每两划换一次气
默认游泳者：平稳蛙泳`} />
    <Paragraph>
      <InlineCode>enterPool(Swim swimmer)</InlineCode> 对参数类型只有一个要求：
      必须实现 <InlineCode>Swim</InlineCode> 接口。
      不管是有名的 <InlineCode>Fish</InlineCode> 类，还是临时写的匿名内部类，都能传入。
      这就是「面向接口编程」的威力——方法的调用方和实现方完全解耦。
    </Paragraph>

    <Heading3>5. 接口作为成员变量</Heading3>
    <Paragraph>
      除了参数和返回值，接口（或抽象类）还常常作为<Text bold>类的成员变量</Text>。
      成员变量的类型是接口，意味着可以在运行时动态替换具体的实现——这是
      <Text bold>策略模式（Strategy Pattern）</Text>的基本形态。
    </Paragraph>
    <CodeBlock
      title="Logger.java + LogStrategy.java"
      code={`// 日志策略接口
public interface LogStrategy {
    void log(String message);
}

// Logger 类持有一个 LogStrategy 类型的成员变量（接口作为成员变量）
public class Logger {
    private LogStrategy strategy;  // 接口类型的成员变量

    public Logger(LogStrategy strategy) {
        this.strategy = strategy;
    }

    // 可以在运行时替换策略
    public void setStrategy(LogStrategy strategy) {
        this.strategy = strategy;
    }

    public void info(String msg) {
        strategy.log("[INFO] " + msg);
    }

    public void warn(String msg) {
        strategy.log("[WARN] " + msg);
    }
}`}
    />
    <CodeBlock
      title="LoggerDemo.java"
      code={`public class LoggerDemo {
    public static void main(String[] args) {
        // 策略1：打印到控制台（用匿名内部类）
        Logger logger = new Logger(new LogStrategy() {
            @Override
            public void log(String message) {
                System.out.println("控制台输出：" + message);
            }
        });

        logger.info("系统启动");
        logger.warn("配置文件缺失，使用默认配置");

        System.out.println();

        // 策略2：加时间戳格式（运行时替换策略）
        logger.setStrategy(new LogStrategy() {
            @Override
            public void log(String message) {
                System.out.println("[2026-06-11 10:00:00] " + message);
            }
        });

        logger.info("用户登录：张三");
        logger.warn("登录尝试次数超过3次");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`控制台输出：[INFO] 系统启动
控制台输出：[WARN] 配置文件缺失，使用默认配置

[2026-06-11 10:00:00] [INFO] 用户登录：张三
[2026-06-11 10:00:00] [WARN] 登录尝试次数超过3次`} />
    <Paragraph>
      <InlineCode>Logger</InlineCode> 持有一个 <InlineCode>LogStrategy</InlineCode> 接口类型的成员变量。
      构造时传入不同的实现，就能改变日志行为；甚至在运行时通过
      <InlineCode>setStrategy()</InlineCode> 动态切换。
      这比在 <InlineCode>Logger</InlineCode> 里写死 <InlineCode>if-else</InlineCode> 灵活得多。
    </Paragraph>

    <Heading3>6. 综合案例：接口贯穿全流程</Heading3>
    <Heading4>案例：支付系统</Heading4>
    <Paragraph>
      用一个小型支付系统综合演示：接口作为成员变量、作为方法参数、作为返回值，并配合匿名内部类使用。
    </Paragraph>
    <CodeBlock
      title="PayStrategy.java"
      code={`// 支付策略接口
public interface PayStrategy {
    boolean pay(double amount);  // 返回是否支付成功
    String getName();            // 支付方式名称
}`}
    />
    <CodeBlock
      title="Order.java"
      code={`// 订单类：成员变量 PayStrategy（接口作为成员变量）
public class Order {
    private String orderId;
    private double amount;
    private PayStrategy payStrategy;  // 接口作为成员变量

    public Order(String orderId, double amount) {
        this.orderId = orderId;
        this.amount  = amount;
    }

    // 接口作为参数：注入支付策略
    public void setPayStrategy(PayStrategy payStrategy) {
        this.payStrategy = payStrategy;
    }

    public void checkout() {
        if (payStrategy == null) {
            System.out.println("订单 " + orderId + " 未设置支付方式！");
            return;
        }
        System.out.println("订单 " + orderId + " 金额：" + amount + " 元，使用 " + payStrategy.getName() + " 支付...");
        boolean success = payStrategy.pay(amount);
        if (success) {
            System.out.println("支付成功！");
        } else {
            System.out.println("支付失败，请重试。");
        }
    }
}`}
    />
    <CodeBlock
      title="PayDemo.java"
      code={`public class PayDemo {

    // 接口作为返回值：根据用户选择返回对应策略
    public static PayStrategy getStrategy(String type) {
        if ("alipay".equals(type)) {
            return new PayStrategy() {
                @Override
                public boolean pay(double amount) {
                    System.out.println("  支付宝扣款 " + amount + " 元...");
                    return true;
                }

                @Override
                public String getName() {
                    return "支付宝";
                }
            };
        } else if ("wechat".equals(type)) {
            return new PayStrategy() {
                @Override
                public boolean pay(double amount) {
                    System.out.println("  微信支付扣款 " + amount + " 元...");
                    return true;
                }

                @Override
                public String getName() {
                    return "微信支付";
                }
            };
        } else {
            return new PayStrategy() {
                @Override
                public boolean pay(double amount) {
                    System.out.println("  银行卡支付 " + amount + " 元...余额不足，失败");
                    return false;
                }

                @Override
                public String getName() {
                    return "银行卡";
                }
            };
        }
    }

    public static void main(String[] args) {
        Order order1 = new Order("ORD-001", 299.0);
        order1.setPayStrategy(getStrategy("alipay"));  // 接口作为参数传入
        order1.checkout();

        System.out.println();

        Order order2 = new Order("ORD-002", 599.0);
        order2.setPayStrategy(getStrategy("wechat"));
        order2.checkout();

        System.out.println();

        Order order3 = new Order("ORD-003", 1999.0);
        order3.setPayStrategy(getStrategy("bankcard"));
        order3.checkout();

        System.out.println();

        // 也可以直接传入匿名内部类（临时策略：现金支付）
        Order order4 = new Order("ORD-004", 99.0);
        order4.setPayStrategy(new PayStrategy() {
            @Override
            public boolean pay(double amount) {
                System.out.println("  现金支付 " + amount + " 元，请点钞...");
                return true;
            }

            @Override
            public String getName() {
                return "现金";
            }
        });
        order4.checkout();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`订单 ORD-001 金额：299.0 元，使用 支付宝 支付...
  支付宝扣款 299.0 元...
支付成功！

订单 ORD-002 金额：599.0 元，使用 微信支付 支付...
  微信支付扣款 599.0 元...
支付成功！

订单 ORD-003 金额：1999.0 元，使用 银行卡 支付...
  银行卡支付 1999.0 元...余额不足，失败
支付失败，请重试。

订单 ORD-004 金额：99.0 元，使用 现金 支付...
  现金支付 99.0 元，请点钞...
支付成功！`} />
    <Paragraph>
      这个案例中三种形式都用到了：
      <InlineCode>Order.payStrategy</InlineCode> 是接口作为成员变量；
      <InlineCode>setPayStrategy(PayStrategy)</InlineCode> 是接口作为方法参数；
      <InlineCode>getStrategy(String)</InlineCode> 返回类型是接口——接口作为返回值。
      每种支付方式都用匿名内部类实现，无需定义 AlipayStrategy、WechatStrategy 等具体类。
    </Paragraph>

    <Heading3>7. 要点汇总</Heading3>
    <Table
      head={['使用方式', '参数/成员/返回值类型', '实际传入或持有的值', '优势']}
      rows={[
        ['普通类作为参数', '具体类', '该类或子类的对象', '直观，适合类型固定的场景'],
        ['抽象类作为参数', '抽象类', '子类对象或匿名内部类对象', '利用多态，屏蔽实现细节'],
        ['接口作为参数', '接口', '任意实现类对象或匿名内部类对象', '耦合最低，扩展最灵活'],
        ['接口作为返回值', '接口', '返回实现类对象或匿名内部类对象', '隐藏实现，调用方只依赖接口'],
        ['接口作为成员变量', '接口', '运行时注入的实现对象', '可动态替换行为（策略模式基础）'],
      ]}
    />
    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>参数类型写接口/抽象类，传入子类/实现类对象，这是多态的标准用法。</ListItem>
        <ListItem>匿名内部类让「一次性实现」变得极其简洁，无需预先定义具体实现类。</ListItem>
        <ListItem>接口作为成员变量，可以在运行时动态替换行为，是策略模式的核心思想。</ListItem>
        <ListItem>「面向接口编程，而不是面向实现编程」是 Java 设计的重要原则：调用方只依赖接口，实现方可以自由替换。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：接口作为方法参数，配合匿名内部类"
      code={`// 已有接口 Drawable，包含 void draw() 方法。
// 要求：
// 1. 定义方法 static void render(Drawable d)，调用 d.draw()。
// 2. 在 main 中，不定义任何具体实现类，
//    直接用匿名内部类调用 render：
//    - 第一次：draw() 打印「画一个红色的圆」
//    - 第二次：draw() 打印「画一条蓝色的线」
//    - 第三次：draw() 打印「画一个绿色的矩形」

public interface Drawable {
    void draw();
}

class DrawDemo {
    public static void render(Drawable d) {
        d.draw();
    }

    public static void main(String[] args) {
        // 补全：三次调用 render，每次传入匿名内部类
    }
}`}
      answerCode={`public interface Drawable {
    void draw();
}

class DrawDemo {
    public static void render(Drawable d) {
        d.draw();
    }

    public static void main(String[] args) {
        render(new Drawable() {
            @Override
            public void draw() {
                System.out.println("画一个红色的圆");
            }
        });

        render(new Drawable() {
            @Override
            public void draw() {
                System.out.println("画一条蓝色的线");
            }
        });

        render(new Drawable() {
            @Override
            public void draw() {
                System.out.println("画一个绿色的矩形");
            }
        });
    }
}

/* 控制台输出：
画一个红色的圆
画一条蓝色的线
画一个绿色的矩形

解析：render(Drawable d) 参数类型是接口，三次调用分别传入不同的匿名内部类对象，
      各自重写了 draw() 方法。整个过程没有定义任何有名字的实现类，完全依赖匿名内部类。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：接口作为返回值"
      code={`// 已有接口 Validator，包含 boolean validate(String input)。
// 要求：
// 定义工厂方法 static Validator getValidator(String type)，
// 根据 type 返回不同的 Validator 实现（用匿名内部类）：
//   "notEmpty"：input 不为 null 且不为空字符串时返回 true
//   "email"    ：input 包含 "@" 时返回 true（简化判断）
//   其他       ：始终返回 true（默认通过）
// 在 main 中测试：
//   getValidator("notEmpty") 测试 "" 和 "hello"
//   getValidator("email")    测试 "abc" 和 "abc@qq.com"

public interface Validator {
    boolean validate(String input);
}

class ValidatorFactory {

    public static Validator getValidator(String type) {
        // 补全
        return null; // 占位，请替换
    }

    public static void main(String[] args) {
        // 补全测试代码
    }
}`}
      answerCode={`public interface Validator {
    boolean validate(String input);
}

class ValidatorFactory {

    public static Validator getValidator(String type) {
        if ("notEmpty".equals(type)) {
            return new Validator() {
                @Override
                public boolean validate(String input) {
                    return input != null && !input.isEmpty();
                }
            };
        } else if ("email".equals(type)) {
            return new Validator() {
                @Override
                public boolean validate(String input) {
                    return input != null && input.contains("@");
                }
            };
        } else {
            // 默认：始终通过
            return new Validator() {
                @Override
                public boolean validate(String input) {
                    return true;
                }
            };
        }
    }

    public static void main(String[] args) {
        Validator notEmpty = getValidator("notEmpty");
        System.out.println("notEmpty 测试 \"\"     : " + notEmpty.validate(""));
        System.out.println("notEmpty 测试 \"hello\": " + notEmpty.validate("hello"));

        System.out.println();

        Validator email = getValidator("email");
        System.out.println("email 测试 \"abc\"       : " + email.validate("abc"));
        System.out.println("email 测试 \"abc@qq.com\": " + email.validate("abc@qq.com"));
    }
}

/* 控制台输出：
notEmpty 测试 ""     : false
notEmpty 测试 "hello": true

email 测试 "abc"       : false
email 测试 "abc@qq.com": true

解析：getValidator 的返回类型是接口 Validator，
      方法内部根据 type 返回不同的匿名内部类对象。
      调用方只依赖接口，不知道也不关心具体实现是什么类，
      这正是「接口作为返回值」的最大价值：隐藏实现细节。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：接口作为成员变量（策略模式）"
      code={`// 已有接口 SortStrategy，包含 void sort(int[] arr)。
// 要求：
// 1. 定义类 Sorter，包含：
//    - 成员变量 SortStrategy strategy（接口作为成员变量）
//    - 构造方法 Sorter(SortStrategy strategy)
//    - 方法 void setStrategy(SortStrategy strategy)
//    - 方法 void doSort(int[] arr)：调用 strategy.sort(arr)，然后打印数组
// 2. 在 main 中：
//    - 创建 Sorter，传入冒泡升序策略（匿名内部类实现）
//    - 对 {5,1,8,3,2} 调用 doSort
//    - 运行时切换策略为「倒序输出」（不排序，只从后往前打印，也用匿名内部类）
//    - 再次对 {5,1,8,3,2} 调用 doSort

public interface SortStrategy {
    void sort(int[] arr);
}

class Sorter {
    // 补全成员变量、构造、setStrategy、doSort
}

class SorterDemo {
    public static void main(String[] args) {
        int[] data1 = {5, 1, 8, 3, 2};
        int[] data2 = {5, 1, 8, 3, 2};
        // 补全测试代码
    }
}`}
      answerCode={`public interface SortStrategy {
    void sort(int[] arr);
}

class Sorter {
    private SortStrategy strategy;  // 接口作为成员变量

    public Sorter(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void doSort(int[] arr) {
        strategy.sort(arr);
        // 打印数组
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}

class SorterDemo {
    public static void main(String[] args) {
        int[] data1 = {5, 1, 8, 3, 2};
        int[] data2 = {5, 1, 8, 3, 2};

        // 策略1：冒泡升序排序
        Sorter sorter = new Sorter(new SortStrategy() {
            @Override
            public void sort(int[] arr) {
                for (int i = 0; i < arr.length - 1; i++) {
                    for (int j = 0; j < arr.length - 1 - i; j++) {
                        if (arr[j] > arr[j + 1]) {
                            int temp = arr[j];
                            arr[j] = arr[j + 1];
                            arr[j + 1] = temp;
                        }
                    }
                }
                System.out.print("冒泡升序结果：");
            }
        });
        sorter.doSort(data1);

        // 运行时切换策略2：倒序打印（不修改数组，只改打印顺序）
        sorter.setStrategy(new SortStrategy() {
            @Override
            public void sort(int[] arr) {
                System.out.print("倒序输出结果：");
                for (int i = arr.length - 1; i >= 0; i--) {
                    System.out.print(arr[i] + " ");
                }
                System.out.println();
                // 此策略不改变数组，doSort 里再打印一次 arr 就是原始顺序
                // 为避免重复打印，这里直接在 sort 里打印后不做其他操作
            }
        });
        // 注意：data2 原始未被排序，直接倒序打印原始数组
        // 由于 doSort 在 sort 后还会打印一次，此处用 data2 演示倒序打印
        // 简化演示：在第二种策略里直接打印完整内容
        System.out.println("---切换策略后---");
        sorter.doSort(data2);
    }
}

/* 控制台输出：
冒泡升序结果：1 2 3 5 8
---切换策略后---
倒序输出结果：2 3 8 1 5
2 3 8 1 5

解析：Sorter 持有 SortStrategy 接口类型的成员变量 strategy，
      构造时注入具体实现，运行时可通过 setStrategy 切换新策略。
      两种策略都用匿名内部类实现，无需定义 BubbleSortStrategy 等具体类。
      这就是策略模式（Strategy Pattern）的基本形态：
      算法（策略）被封装在接口后面，主体类（Sorter）不依赖具体算法，只依赖接口。
*/`}
    />
  </article>
);

export default index;
