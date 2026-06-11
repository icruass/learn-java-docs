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
    <Title>static 修饰成员</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 中的成员分为两种：一种<Text bold>属于对象</Text>，每个对象各自拥有一份；
        另一种<Text bold>属于类本身</Text>，所有对象共用同一份。
        用 <InlineCode>static</InlineCode> 修饰的成员就属于后者，叫做<Text bold>静态成员</Text>。
        本节讲清静态变量与静态方法的定义、调用方式、共享特性，
        以及最关键的访问规则——"静态方法中不能直接访问非静态成员"，
        并用一个经典的"对象计数器"示例把共享特性演示得一清二楚。
      </Paragraph>
    </Callout>

    <Heading3>1. static 的含义</Heading3>
    <Paragraph>
      <Text bold>static</Text> 是 Java 关键字，字面含义是"静态的"，实际含义是
      <Text bold>属于类，而不属于某个具体对象</Text>。
      普通（非静态）成员在每次 <InlineCode>new</InlineCode> 出一个对象时都会创建一份新的；
      而静态成员在<Text bold>类加载时就已经存在</Text>，整个程序运行期间只有<Text bold>一份</Text>，
      被该类所有对象共享。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>静态变量（类变量）</Text>：用 <InlineCode>static</InlineCode> 修饰的成员变量，
        所有对象共享同一个值，也叫"类变量"。
      </ListItem>
      <ListItem>
        <Text bold>静态方法（类方法）</Text>：用 <InlineCode>static</InlineCode> 修饰的方法，
        不依赖任何对象，可以直接通过类名调用，也叫"类方法"。
      </ListItem>
    </UnorderedList>

    <Heading3>2. 静态变量</Heading3>
    <Heading4>2.1 定义格式</Heading4>
    <CodeBlock
      language="text"
      title="静态变量定义格式（写在类中、方法外）"
      code={`static 数据类型 变量名;
static 数据类型 变量名 = 初始值;`}
    />
    <Heading4>2.2 特点</Heading4>
    <UnorderedList>
      <ListItem>
        随<Text bold>类加载</Text>而创建，随类卸载而销毁，生命周期比对象更长。
      </ListItem>
      <ListItem>
        存储在<Text bold>方法区</Text>（JDK 8 起为元空间），内存中只保存一份。
      </ListItem>
      <ListItem>
        所有该类的对象<Text bold>共享</Text>同一个静态变量；任何一个对象修改它，
        其他对象看到的值也会同步改变。
      </ListItem>
      <ListItem>
        推荐用<Text bold>类名.静态变量名</Text>访问；用对象名访问虽然语法合法，
        但会产生误导，不推荐。
      </ListItem>
    </UnorderedList>

    <Heading3>3. 静态方法</Heading3>
    <Heading4>3.1 定义格式</Heading4>
    <CodeBlock
      language="text"
      title="静态方法定义格式（写在类中）"
      code={`public static 返回值类型 方法名(参数列表) {
    // 方法体
}`}
    />
    <Heading4>3.2 调用方式</Heading4>
    <Paragraph>
      静态方法不需要对象，直接用类名调用。用对象名调用在语法上也合法，
      但编译器会发出警告，因为这样的写法容易让读者以为该方法属于对象，
      <Text bold>强烈推荐始终使用类名调用</Text>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="调用方式对比"
      code={`类名.静态方法名(参数);   // 推荐，语义清晰
对象名.静态方法名(参数);  // 合法但不推荐，IDE 通常会发出警告`}
    />

    <Heading3>4. 静态成员 vs 非静态成员对比</Heading3>
    <Table
      head={['对比项', '静态成员（static）', '非静态成员（实例）']}
      rows={[
        ['所属', '属于类本身', '属于每个对象'],
        ['内存份数', '整个程序只有一份', '每个对象各有一份'],
        ['存储位置', '方法区（元空间）', '堆内存（对象内部）'],
        ['生命周期', '类加载时创建，程序结束时销毁', '对象 new 时创建，对象被回收时销毁'],
        ['推荐访问方式', '类名.成员', '对象名.成员'],
        ['是否需要 new', '不需要，可直接通过类名使用', '必须先 new 出对象'],
      ]}
    />

    <Heading3>5. 访问规则：静态与非静态的相互关系</Heading3>
    <Callout type="danger" title="静态方法中不能直接访问非静态成员，也没有 this">
      <Paragraph>
        静态方法属于类，在类加载时就存在；而非静态成员（实例变量、实例方法）
        属于对象，只有执行 <InlineCode>new</InlineCode> 之后才存在。
        如果静态方法里直接写非静态成员的名字，JVM 不知道你指的是哪个对象的成员
        ——此时根本没有对象——编译器会<Text bold>直接报错</Text>。
      </Paragraph>
      <Paragraph>
        同样，<InlineCode>this</InlineCode> 代表"当前对象"，
        静态方法调用时不依赖对象，所以静态方法内<Text bold>没有 this</Text>，写了也是编译报错。
      </Paragraph>
    </Callout>
    <Callout type="tip" title="非静态方法可以访问静态成员">
      非静态（实例）方法必须通过对象调用，此时对象已经存在，
      所以它既能访问自己的实例成员，也能直接访问类的静态成员，<Text bold>两者均合法</Text>。
    </Callout>
    <Table
      head={['在哪里写代码', '能否直接访问静态成员', '能否直接访问非静态成员', '有无 this']}
      rows={[
        ['静态方法内', '可以', '不可以（编译报错）', '没有（编译报错）'],
        ['非静态方法内', '可以', '可以', '有'],
      ]}
    />

    <Heading3>6. 示例代码</Heading3>
    <Heading4>示例 1：静态变量共享——对象计数器</Heading4>
    <Paragraph>
      定义 <InlineCode>Counter</InlineCode> 类，用静态变量 <InlineCode>count</InlineCode>
      记录一共创建了多少个对象。每次执行构造方法时 <InlineCode>count++</InlineCode>，
      不管是哪个对象触发的，<InlineCode>count</InlineCode> 都指向同一块内存，因此累加效果正确。
    </Paragraph>
    <CodeBlock
      title="Counter.java"
      code={`public class Counter {

    // 静态变量：属于类，所有对象共享，记录一共创建了多少个 Counter 对象
    static int count = 0;

    // 实例变量：属于每个对象，记录该对象自己的编号
    int id;

    // 构造方法：每次 new 对象时自动执行
    public Counter() {
        count++;        // 静态变量累加，所有对象共享同一个 count
        id = count;     // 把当前总数赋给本对象的编号
        System.out.println("创建了第 " + id + " 个对象，当前 count = " + count);
    }

    public static void main(String[] args) {
        Counter c1 = new Counter();
        Counter c2 = new Counter();
        Counter c3 = new Counter();

        // 推荐用类名访问静态变量
        System.out.println("总共创建了 " + Counter.count + " 个对象");

        // 用对象名访问（不推荐），但访问的是同一个静态变量
        System.out.println("通过 c1 访问 count：" + c1.count);
        System.out.println("通过 c2 访问 count：" + c2.count);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`创建了第 1 个对象，当前 count = 1
创建了第 2 个对象，当前 count = 2
创建了第 3 个对象，当前 count = 3
总共创建了 3 个对象
通过 c1 访问 count：3
通过 c2 访问 count：3`}
    />
    <Paragraph>
      关键观察：<InlineCode>c1.count</InlineCode> 和 <InlineCode>c2.count</InlineCode>
      打印的都是 3，因为它们访问的是<Text bold>同一个静态变量</Text>，
      而不是各自对象内部的独立副本。这就是"共享"的核心含义。
      实例变量 <InlineCode>id</InlineCode> 则相反，每个对象各自保存自己的编号（1、2、3 各不相同）。
    </Paragraph>

    <Heading4>示例 2：静态工具方法</Heading4>
    <Paragraph>
      定义工具类 <InlineCode>MathUtil</InlineCode>，所有方法都是静态的，不需要
      <InlineCode>new</InlineCode> 对象即可直接调用——这也是 Java 标准库
      <InlineCode>Math</InlineCode> 类的设计思路。
    </Paragraph>
    <CodeBlock
      title="MathUtil.java"
      code={`public class MathUtil {

    // 静态常量：圆周率（static final 是常量的惯用写法）
    static final double PI = 3.14159265;

    // 静态方法：返回两数中的较大值
    public static int max(int a, int b) {
        return a >= b ? a : b;
    }

    // 静态方法：计算圆的面积（直接访问静态变量 PI，合法）
    public static double circleArea(double r) {
        return PI * r * r;
    }

    public static void main(String[] args) {
        // 直接用类名调用，不需要 new 对象
        System.out.println(MathUtil.max(10, 25));
        System.out.println(MathUtil.circleArea(5));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`25
78.53981625`}
    />

    <Heading4>示例 3：静态方法访问非静态成员——编译报错演示</Heading4>
    <Paragraph>
      下面故意写错，展示编译器在静态方法中访问非静态成员时的报错原因：
    </Paragraph>
    <CodeBlock
      title="WrongDemo.java（故意演示错误，不要照抄）"
      code={`public class WrongDemo {

    String name = "Java";   // 非静态实例变量

    public static void show() {
        // 错误！静态方法中不能直接访问非静态成员变量
        // System.out.println(name);       // 编译报错

        // 错误！静态方法中不能使用 this
        // System.out.println(this.name);  // 编译报错

        // 正确：先 new 出对象，再通过对象访问
        WrongDemo obj = new WrongDemo();
        System.out.println(obj.name);      // 合法
    }

    public static void main(String[] args) {
        show();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`Java`}
    />
    <Callout type="warning" title="理解报错背后的原因">
      静态方法在类加载时就存在；而实例变量 <InlineCode>name</InlineCode>
      只在执行 <InlineCode>new WrongDemo()</InlineCode> 之后才分配内存。
      如果静态方法里直接写 <InlineCode>name</InlineCode>，JVM 不知道你要的是哪个对象的
      <InlineCode>name</InlineCode>（此时根本没有对象），编译器因此拒绝该代码。
    </Callout>

    <Heading4>示例 4：非静态方法可以访问静态成员</Heading4>
    <CodeBlock
      title="AccessDemo.java"
      code={`public class AccessDemo {

    static int staticVal = 100;   // 静态变量
    int instanceVal = 200;        // 实例变量

    // 非静态方法：可以同时访问静态成员和实例成员
    public void printBoth() {
        System.out.println("静态变量 staticVal = " + staticVal);      // 合法
        System.out.println("实例变量 instanceVal = " + instanceVal);  // 合法
        System.out.println("通过 this：" + this.instanceVal);         // 合法
    }

    // 静态方法：只能访问静态成员
    public static void printStatic() {
        System.out.println("静态方法访问 staticVal = " + staticVal);  // 合法
        // System.out.println(instanceVal);  // 非法，编译报错
    }

    public static void main(String[] args) {
        AccessDemo obj = new AccessDemo();
        obj.printBoth();    // 通过对象调用非静态方法
        printStatic();      // 同类内调用静态方法，可省略类名
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`静态变量 staticVal = 100
实例变量 instanceVal = 200
通过 this：200
静态方法访问 staticVal = 100`}
    />

    <Callout type="success" title="小结">
      <Paragraph>
        static 核心要点：
      </Paragraph>
      <UnorderedList>
        <ListItem>static 成员属于类，随类加载而存在，整个程序只有一份，所有对象共享。</ListItem>
        <ListItem>推荐用<Text bold>类名.静态成员</Text>访问，语义清晰不产生误导。</ListItem>
        <ListItem>
          静态方法中<Text bold>不能</Text>直接访问非静态成员，也<Text bold>没有 this</Text>。
        </ListItem>
        <ListItem>非静态方法可以访问静态成员（实例方法访问两类成员均合法）。</ListItem>
        <ListItem>静态变量适合存放"全类共享"的数据，如计数器、常量配置等。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：分析静态变量共享的输出"
      code={`// 问：下面代码的控制台输出是什么？请逐行分析原因。

public class Quiz1 {
    static int x = 0;
    int y = 0;

    public Quiz1() {
        x++;
        y++;
    }

    public static void main(String[] args) {
        Quiz1 a = new Quiz1();
        Quiz1 b = new Quiz1();
        Quiz1 c = new Quiz1();
        System.out.println("a.x=" + a.x + ", a.y=" + a.y);
        System.out.println("b.x=" + b.x + ", b.y=" + b.y);
        System.out.println("Quiz1.x=" + Quiz1.x);
    }
}`}
      answerCode={`/* 控制台输出：
a.x=3, a.y=1
b.x=3, b.y=1
Quiz1.x=3

解析：
  x 是静态变量，三次 new 各执行一次 x++，最终累加到 3。
  所有对象共享同一个 x，因此 a.x 和 b.x 都是 3。
  y 是实例变量，每次 new 都创建独立的 y，各自执行一次 y++，所以 a.y=1, b.y=1。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：编写静态工具方法"
      code={`// 要求：定义 StringUtil 类，在其中编写静态方法：
//   public static boolean isPalindrome(String s)
// 判断字符串 s 是否是回文（正读反读一样，如 "abcba"、"level"）。
// 在 main 里用类名调用，测试 "racecar"、"hello"、"madam"。

public class StringUtil {

    public static boolean isPalindrome(String s) {
        // 补全代码
    }

    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`public class StringUtil {

    public static boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(StringUtil.isPalindrome("racecar")); // true
        System.out.println(StringUtil.isPalindrome("hello"));   // false
        System.out.println(StringUtil.isPalindrome("madam"));   // true
    }
}

/* 控制台输出：
true
false
true

解析：isPalindrome 是静态方法，用类名直接调用，不需要 new 对象。
      双指针从两端向中间扫描，发现不同字符即返回 false，全部匹配则返回 true。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：为学生类添加静态计数器"
      code={`// 要求：定义 Student 类，包含：
//   - 静态变量 totalCount，记录创建了多少个 Student 对象（初始 0）
//   - 实例变量 name（String）
//   - 构造方法接收 name，执行时让 totalCount 自增
//   - 静态方法 getTotalCount()，返回 totalCount
// 在 main 里创建 3 个 Student 对象，最后通过类名调用 getTotalCount() 打印总数。

public class Student {

    // 补全成员变量

    public Student(String name) {
        // 补全构造方法
    }

    public static int getTotalCount() {
        // 补全静态方法
    }

    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`public class Student {

    static int totalCount = 0;  // 静态变量，所有对象共享
    String name;                // 实例变量，每个对象独立

    public Student(String name) {
        this.name = name;
        totalCount++;           // 每次创建对象，静态计数器 +1
        System.out.println("创建学生：" + name + "，当前总数：" + totalCount);
    }

    public static int getTotalCount() {
        return totalCount;      // 静态方法只访问静态成员，合法
    }

    public static void main(String[] args) {
        new Student("张三");
        new Student("李四");
        new Student("王五");
        System.out.println("学生总人数：" + Student.getTotalCount());
    }
}

/* 控制台输出：
创建学生：张三，当前总数：1
创建学生：李四，当前总数：2
创建学生：王五，当前总数：3
学生总人数：3

解析：totalCount 是静态变量，三次构造方法执行后累计到 3。
      getTotalCount() 是静态方法，用 Student.getTotalCount() 调用，不需要对象。
*/`}
    />
  </article>
);

export default index;
