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
    <Title>匿名内部类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        匿名内部类是 Java 内部类中<Text bold>使用最频繁</Text>的一种。
        它把"定义实现类（或子类）→ 起名 → 创建对象"三个步骤合并成一步，
        在 <InlineCode>new</InlineCode> 的同时完成类的定义，这个类没有名字，故称「匿名」。
        匿名内部类特别适合只需要用一次的场景，大量出现在图形界面的事件监听、
        排序器、线程任务等地方。掌握匿名内部类，是理解后续 Lambda 表达式的前提。
      </Paragraph>
    </Callout>

    <Heading3>1. 匿名内部类的前提与本质</Heading3>
    <Paragraph>
      使用匿名内部类有一个硬性前提：<Text bold>必须存在一个接口或父类</Text>。
      匿名内部类的本质是：在创建对象的同时，隐式地声明一个该接口的实现类（或该父类的子类），
      并立即创建它的一个对象。
    </Paragraph>
    <Callout type="tip" title="匿名内部类的本质">
      <Paragraph>
        以下两段代码在运行时等价：
      </Paragraph>
      <CodeBlock
        language="text"
        title="传统写法（有名字）"
        code={`// 第1步：定义实现类
class SwimImpl implements Swim {
    public void swim() {
        System.out.println("自由泳");
    }
}
// 第2步：创建对象
Swim s = new SwimImpl();`}
      />
      <CodeBlock
        language="text"
        title="匿名内部类写法（一步到位）"
        code={`Swim s = new Swim() {
    public void swim() {
        System.out.println("自由泳");
    }
};`}
      />
      匿名内部类省去了单独定义 <InlineCode>SwimImpl</InlineCode> 的过程，
      编译器会自动帮我们生成一个没有名字的类。
    </Callout>

    <Heading3>2. 匿名内部类的格式</Heading3>
    <CodeBlock
      language="text"
      title="匿名内部类格式"
      code={`接口名或父类名 对象名 = new 接口名或父类名() {
    // 重写接口的抽象方法，或重写父类的方法
    @Override
    public 返回值类型 方法名(参数列表) {
        // 方法体
    }
};  // 注意：花括号后面有分号，因为这是一条赋值语句`}
    />
    <Callout type="warning" title="大括号后面必须有分号">
      匿名内部类整体是一个<Text bold>表达式</Text>，赋值给变量的那条语句以 <InlineCode>;</InlineCode> 结尾。
      初学者常忘记最后那个分号，导致语法错误。
    </Callout>
    <Table
      head={['格式部分', '说明']}
      rows={[
        ['new 接口名() { }', '基于接口创建匿名内部类，必须重写接口中所有抽象方法'],
        ['new 父类名() { }', '基于父类（普通类或抽象类）创建匿名内部类，通常用于重写父类方法'],
        ['对象名', '可选，赋值给变量后可多次调用；也可以直接作为参数传入方法，不需要变量名'],
        ['{ } 内部', '就是类体，可以有成员变量、多个方法；但匿名内部类对象通常只用它重写的方法'],
      ]}
    />

    <Heading3>3. 匿名内部类的两种常见用法</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>赋值给变量后调用</Text>：
        <InlineCode>接口名 obj = new 接口名() {'{'} ... {'}'};</InlineCode>，
        然后用 <InlineCode>obj.方法名()</InlineCode> 调用。这种方式下同一个对象可以多次调用。
      </ListItem>
      <ListItem>
        <Text bold>直接作为方法参数传入</Text>：
        <InlineCode>someMethod(new 接口名() {'{'} ... {'}'});</InlineCode>，
        不需要命名变量，一次性传入，最简洁，也是实际开发中最常见的写法。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="匿名内部类对象一般只用一次">
      匿名内部类的"匿名"决定了它<Text bold>无法被复用</Text>——
      没有类名，就无法在其他地方 <InlineCode>new</InlineCode> 出第二个同类型对象。
      如果同一种实现需要在多处创建，应该老老实实定义一个有名字的实现类。
    </Callout>

    <Heading3>4. 匿名内部类能重写多个方法吗？</Heading3>
    <Paragraph>
      完全可以。匿名内部类的花括号内是完整的类体，可以重写接口的<Text bold>多个</Text>抽象方法，
      也可以定义新的成员变量。但要注意：新定义的成员（不是重写的方法）只能在类体内部访问，
      外部通过接口类型的变量无法访问（因为接口类型的引用只"看见"接口中定义的成员）。
    </Paragraph>

    <Heading3>5. 完整示例</Heading3>
    <Heading4>示例 1：基于接口的匿名内部类（赋值给变量）</Heading4>
    <CodeBlock
      title="Swim.java"
      code={`public interface Swim {
    void swim();  // 抽象方法
}`}
    />
    <CodeBlock
      title="AnonymousDemo1.java"
      code={`public class AnonymousDemo1 {
    public static void main(String[] args) {
        // 匿名内部类：基于 Swim 接口，赋值给变量
        Swim freeStyle = new Swim() {
            @Override
            public void swim() {
                System.out.println("自由泳：手臂轮流划水，腿打水花");
            }
        };  // 分号不能忘

        Swim breaststroke = new Swim() {
            @Override
            public void swim() {
                System.out.println("蛙泳：双臂向前伸展，双腿蛙式蹬水");
            }
        };

        freeStyle.swim();      // 调用第一个匿名内部类对象的方法
        breaststroke.swim();   // 调用第二个匿名内部类对象的方法

        // 再次调用，说明同一个对象可以多次调用
        System.out.println("---");
        freeStyle.swim();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`自由泳：手臂轮流划水，腿打水花
蛙泳：双臂向前伸展，双腿蛙式蹬水
---
自由泳：手臂轮流划水，腿打水花`} />
    <Paragraph>
      两个匿名内部类对象 <InlineCode>freeStyle</InlineCode> 和 <InlineCode>breaststroke</InlineCode>
      都实现了 <InlineCode>Swim</InlineCode> 接口，但各自重写了不同的 <InlineCode>swim()</InlineCode> 逻辑。
      编译后会生成类似 <InlineCode>AnonymousDemo1$1.class</InlineCode> 和
      <InlineCode>AnonymousDemo1$2.class</InlineCode> 的文件，这就是"匿名"类的编译产物。
    </Paragraph>

    <Heading4>示例 2：直接作为方法参数传入（最常用写法）</Heading4>
    <CodeBlock
      title="Animal.java"
      code={`public abstract class Animal {
    private String name;

    public Animal(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public abstract void sound();  // 抽象方法：发出声音
}`}
    />
    <CodeBlock
      title="AnonymousDemo2.java"
      code={`public class AnonymousDemo2 {

    // 方法接收 Animal 类型的参数（多态）
    public static void makeAnimalSound(Animal animal) {
        System.out.print(animal.getName() + " 发出声音：");
        animal.sound();
    }

    public static void main(String[] args) {
        // 写法1：先赋值给变量，再传入
        Animal dog = new Animal("小狗") {
            @Override
            public void sound() {
                System.out.println("汪汪汪！");
            }
        };
        makeAnimalSound(dog);

        // 写法2：直接作为参数传入（更简洁，最常见）
        makeAnimalSound(new Animal("小猫") {
            @Override
            public void sound() {
                System.out.println("喵喵喵！");
            }
        });

        makeAnimalSound(new Animal("小牛") {
            @Override
            public void sound() {
                System.out.println("哞哞哞！");
            }
        });
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`小狗 发出声音：汪汪汪！
小猫 发出声音：喵喵喵！
小牛 发出声音：哞哞哞！`} />
    <Paragraph>
      <InlineCode>makeAnimalSound</InlineCode> 的参数类型是抽象类
      <InlineCode>Animal</InlineCode>，方法内调用 <InlineCode>animal.sound()</InlineCode> 时走多态，
      实际执行的是匿名内部类里重写的版本。
      写法 2 直接把 <InlineCode>new Animal(...) {'{'} ... {'}'}</InlineCode> 塞进方法调用括号里，
      不需要额外命名变量，是实际项目中最常见的匿名内部类形式。
    </Paragraph>

    <Heading4>示例 3：实现多个抽象方法的匿名内部类</Heading4>
    <CodeBlock
      title="Worker.java"
      code={`public interface Worker {
    void work();    // 工作
    void rest();    // 休息
}`}
    />
    <CodeBlock
      title="AnonymousDemo3.java"
      code={`public class AnonymousDemo3 {

    public static void schedule(Worker worker) {
        System.out.println("开始上班：");
        worker.work();
        System.out.println("开始休息：");
        worker.rest();
    }

    public static void main(String[] args) {
        // 匿名内部类同时重写接口的两个抽象方法
        schedule(new Worker() {
            @Override
            public void work() {
                System.out.println("程序员：敲代码、改 Bug、写文档");
            }

            @Override
            public void rest() {
                System.out.println("程序员：刷手机、喝咖啡、闭眼5分钟");
            }
        });

        System.out.println();

        schedule(new Worker() {
            @Override
            public void work() {
                System.out.println("厨师：备菜、炒菜、装盘");
            }

            @Override
            public void rest() {
                System.out.println("厨师：擦汗、喝水、坐着缓一缓");
            }
        });
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`开始上班：
程序员：敲代码、改 Bug、写文档
开始休息：
程序员：刷手机、喝咖啡、闭眼5分钟

开始上班：
厨师：备菜、炒菜、装盘
开始休息：
厨师：擦汗、喝水、坐着缓一缓`} />
    <Paragraph>
      匿名内部类的花括号内可以重写接口的<Text bold>多个</Text>抽象方法，
      不局限于只有一个方法的接口。
      两个 <InlineCode>Worker</InlineCode> 匿名内部类对象提供了完全不同的工作和休息行为。
    </Paragraph>

    <Heading3>6. 匿名内部类的注意事项</Heading3>
    <Callout type="warning" title="匿名内部类对象只能用一次（无法复用同类型对象）">
      匿名内部类没有类名，无法在其他地方再次 <InlineCode>new</InlineCode> 出相同类型的对象。
      如果一种实现逻辑需要在多处创建，必须定义一个有名字的实现类。
    </Callout>
    <Callout type="tip" title="访问外部变量同样受 effectively final 限制">
      匿名内部类和局部内部类一样，访问所在方法的局部变量时，
      该局部变量也必须是 effectively final（赋值后不再修改）。
    </Callout>
    <Callout type="tip" title="匿名内部类是 Lambda 表达式的前身">
      JDK 8 引入的 Lambda 表达式，本质上是对「只有一个抽象方法的接口（函数式接口）的匿名内部类」的简化写法。
      例如 <InlineCode>Runnable r = () -&gt; System.out.println("run");</InlineCode>
      与 <InlineCode>Runnable r = new Runnable() {'{'} public void run() {'{'} System.out.println("run"); {'}'} {'}'};</InlineCode>
      在功能上等价。学好匿名内部类，Lambda 就水到渠成了。
    </Callout>

    <Heading3>7. 匿名内部类 vs 有名实现类对比</Heading3>
    <Table
      head={['对比维度', '匿名内部类', '有名实现类（普通写法）']}
      rows={[
        ['类名', '无', '有，可在各处引用'],
        ['复用性', '一次性，只创建一个对象', '可多次 new，可被继承'],
        ['代码量', '少，一步到位', '需要单独定义类文件'],
        ['适用场景', '只用一次、简短的逻辑', '逻辑复杂、需要复用、需要继承'],
        ['可读性', '简单逻辑时更简洁', '复杂逻辑时结构更清晰'],
      ]}
    />

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：为接口创建匿名内部类并调用"
      code={`// 要求：
// 已有接口 Speakable，包含方法 void speak()。
// 用匿名内部类分别创建两个 Speakable 对象：
//   第一个：speak() 打印「你好，我是中文！」
//   第二个：speak() 打印「Hello, I am English!」
// 分别调用两个对象的 speak() 方法。

public interface Speakable {
    void speak();
}

class SpeakDemo {
    public static void main(String[] args) {
        // 补全：用匿名内部类创建两个 Speakable 对象并调用 speak()
    }
}`}
      answerCode={`public interface Speakable {
    void speak();
}

class SpeakDemo {
    public static void main(String[] args) {
        Speakable chinese = new Speakable() {
            @Override
            public void speak() {
                System.out.println("你好，我是中文！");
            }
        };

        Speakable english = new Speakable() {
            @Override
            public void speak() {
                System.out.println("Hello, I am English!");
            }
        };

        chinese.speak();
        english.speak();
    }
}

/* 控制台输出：
你好，我是中文！
Hello, I am English!

解析：两个匿名内部类都实现了 Speakable 接口，各自重写了 speak() 方法，
      通过接口引用调用时走多态，分别执行各自的实现。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：匿名内部类直接作为方法参数"
      code={`// 要求：
// 已有接口 Comparator（自定义版，不是 java.util 的那个）：
//   int compare(int a, int b)  // a>b 返回正数，a<b 返回负数，a==b 返回0
// 已有方法 void sortAndPrint(int[] arr, Comparator comp)
//   该方法使用冒泡排序，排序顺序由 comp.compare 决定，然后打印数组。
// 在 main 中：
//   1. 调用 sortAndPrint，传入匿名内部类实现升序排列（正常顺序）
//   2. 调用 sortAndPrint，传入匿名内部类实现降序排列
// 测试数组：{5, 2, 8, 1, 9, 3}

public interface Comparator {
    int compare(int a, int b);
}

class SortDemo {

    public static void sortAndPrint(int[] arr, Comparator comp) {
        // 冒泡排序
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {
                // comp.compare(arr[j], arr[j+1]) > 0 表示需要交换
                if (comp.compare(arr[j], arr[j + 1]) > 0) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        // 打印数组
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        // 补全：分别传入升序和降序的匿名内部类
    }
}`}
      answerCode={`public interface Comparator {
    int compare(int a, int b);
}

class SortDemo {

    public static void sortAndPrint(int[] arr, Comparator comp) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (comp.compare(arr[j], arr[j + 1]) > 0) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        int[] arr1 = {5, 2, 8, 1, 9, 3};
        int[] arr2 = {5, 2, 8, 1, 9, 3};

        System.out.print("升序：");
        sortAndPrint(arr1, new Comparator() {
            @Override
            public int compare(int a, int b) {
                return a - b;  // a > b 时返回正数 -> 交换 -> 升序
            }
        });

        System.out.print("降序：");
        sortAndPrint(arr2, new Comparator() {
            @Override
            public int compare(int a, int b) {
                return b - a;  // b > a 时返回正数 -> 交换 -> 降序
            }
        });
    }
}

/* 控制台输出：
升序：1 2 3 5 8 9
降序：9 8 5 3 2 1

解析：匿名内部类直接作为参数传入方法，每次调用时临时定义不同的比较逻辑，
      不需要额外命名 AscComparator、DescComparator 等类，代码更简洁。
      这正是 Java 标准库大量使用匿名内部类（和 Lambda）的原因。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：预测匿名内部类的输出并说明原因"
      code={`// 预测下面代码的输出，并解释为什么。

interface Printer {
    void print(String msg);
}

public class AnonymousTest {
    private String prefix = "【系统】";  // 外部类成员变量

    public Printer createPrinter(String tag) {
        // tag 是方法参数（effectively final，未被修改）
        return new Printer() {
            @Override
            public void print(String msg) {
                // 访问外部类成员变量 prefix
                // 访问方法局部参数 tag（effectively final）
                System.out.println(prefix + "[" + tag + "] " + msg);
            }
        };
    }

    public static void main(String[] args) {
        AnonymousTest at = new AnonymousTest();

        Printer info = at.createPrinter("INFO");
        Printer warn = at.createPrinter("WARN");

        info.print("系统启动成功");
        warn.print("内存使用率超过80%");
        info.print("用户登录：张三");
    }
}`}
      answerCode={`// 控制台输出：
// 【系统】[INFO] 系统启动成功
// 【系统】[WARN] 内存使用率超过80%
// 【系统】[INFO] 用户登录：张三

/* 解析：
   1. createPrinter 方法每次被调用，都返回一个新的匿名内部类对象，
      该对象在其 print() 方法中：
      - 访问外部类成员变量 prefix（通过外部类对象的隐式引用）
      - 访问方法参数 tag（tag 是 effectively final，被复制到对象内部）

   2. at.createPrinter("INFO") 创建的对象，其内部保存了 tag = "INFO"；
      at.createPrinter("WARN") 创建的对象，其内部保存了 tag = "WARN"。
      两个对象各自持有不同的 tag 副本，互不影响。

   3. createPrinter 方法调用完毕后，栈帧销毁，但两个匿名内部类对象仍然活在堆上，
      它们内部已经有了 tag 的副本，因此仍能正确输出 "INFO" 和 "WARN"。
      这正是 effectively final 机制的实际价值所在。
*/`}
    />
  </article>
);

export default index;
