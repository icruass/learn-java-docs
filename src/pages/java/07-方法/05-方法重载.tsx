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
    <Title>方法重载</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        实际开发中，同一个功能往往需要处理不同类型或不同数量的参数，
        例如"求和"可能要处理两个 int、三个 int、两个 double……
        如果每次都起不同的方法名（<InlineCode>sumTwoInt</InlineCode>、<InlineCode>sumThreeInt</InlineCode>……），
        调用起来非常繁琐。<Text bold>方法重载（Overload）</Text>允许在同一个类中定义多个同名方法，
        只要参数列表不同，Java 编译器就能自动区分并调用正确的版本。
        本节讲清重载的定义规则、判断依据、典型示例，以及常见误区。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是方法重载</Heading3>
    <Paragraph>
      <Text bold>方法重载</Text>（Overload）：在<Text bold>同一个类</Text>中，
      定义多个<Text bold>方法名相同</Text>、但<Text bold>参数列表不同</Text>的方法，
      这些方法之间就构成重载关系。
    </Paragraph>
    <Paragraph>
      Java 编译器根据调用时传入的<Text bold>实参类型和数量</Text>，自动匹配应该调用哪个重载版本，
      这个过程叫做<Text bold>方法解析（method resolution）</Text>，发生在编译期。
    </Paragraph>

    <Heading3>2. 构成重载的判断依据</Heading3>
    <Paragraph>
      两个方法要构成重载，<Text bold>参数列表必须不同</Text>。"不同"包含以下三种情形，
      满足其中至少一种即可：
    </Paragraph>
    <OrderedList>
      <ListItem><Text bold>参数个数不同</Text>：如一个方法有 2 个参数，另一个有 3 个参数。</ListItem>
      <ListItem><Text bold>对应位置的参数类型不同</Text>：如一个是 int，另一个是 double。</ListItem>
      <ListItem><Text bold>参数顺序不同（类型组合不同）</Text>：如 (int, double) 与 (double, int)。</ListItem>
    </OrderedList>
    <Callout type="warning" title="与返回值类型、参数名称、修饰符无关">
      判断是否构成重载，<Text bold>只看参数列表</Text>，与以下三点完全无关：
      <UnorderedList>
        <ListItem>返回值类型（int 还是 void 还是 double）</ListItem>
        <ListItem>参数变量名（a、b 还是 x、y）</ListItem>
        <ListItem>修饰符（public 还是 private）</ListItem>
      </UnorderedList>
    </Callout>
    <Table
      head={['场景', '是否构成重载', '原因']}
      rows={[
        ['sum(int a, int b) 与 sum(int a, int b, int c)', '是', '参数个数不同（2 vs 3）'],
        ['sum(int a, int b) 与 sum(double a, double b)', '是', '参数类型不同（int vs double）'],
        ['sum(int a, double b) 与 sum(double a, int b)', '是', '参数顺序/类型组合不同'],
        ['sum(int a, int b) 与 sum(int x, int y)', '否', '参数列表完全相同，只有参数名不同，编译报错（方法重复定义）'],
        ['int sum(int a, int b) 与 void sum(int a, int b)', '否', '参数列表完全相同，只有返回值不同，编译报错（方法重复定义）'],
      ]}
    />

    <Heading3>3. 重载示例：sum 方法</Heading3>
    <Paragraph>
      定义多个 <InlineCode>sum</InlineCode> 方法，分别处理不同数量和类型的参数，
      展示编译器如何自动匹配正确的版本。
    </Paragraph>
    <CodeBlock
      title="OverloadSum.java"
      code={`public class OverloadSum {

    // 版本 1：两个 int 求和
    public static int sum(int a, int b) {
        System.out.println("调用了 int+int 版本");
        return a + b;
    }

    // 版本 2：三个 int 求和（参数个数不同）
    public static int sum(int a, int b, int c) {
        System.out.println("调用了 int+int+int 版本");
        return a + b + c;
    }

    // 版本 3：两个 double 求和（参数类型不同）
    public static double sum(double a, double b) {
        System.out.println("调用了 double+double 版本");
        return a + b;
    }

    // 版本 4：一个 int 一个 double（参数组合不同）
    public static double sum(int a, double b) {
        System.out.println("调用了 int+double 版本");
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(sum(3, 5));           // 匹配版本 1
        System.out.println(sum(1, 2, 3));        // 匹配版本 2
        System.out.println(sum(1.5, 2.5));       // 匹配版本 3
        System.out.println(sum(4, 1.5));         // 匹配版本 4
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`调用了 int+int 版本
8
调用了 int+int+int 版本
6
调用了 double+double 版本
4.0
调用了 int+double 版本
5.5`} />
    <Paragraph>
      调用 <InlineCode>sum(3, 5)</InlineCode> 时，两个实参都是 int，编译器匹配版本 1；
      调用 <InlineCode>sum(1.5, 2.5)</InlineCode> 时，两个实参都是 double，匹配版本 3。
      方法名完全相同，但编译器通过参数类型准确区分，无需程序员记多个名字。
    </Paragraph>

    <Heading3>4. System.out.println 就是重载的典型例子</Heading3>
    <Paragraph>
      Java 标准库里 <InlineCode>System.out.println</InlineCode> 就定义了大量重载版本，
      才能让我们既能打印 int，又能打印 double、String、boolean 等各种类型。
    </Paragraph>
    <CodeBlock
      title="PrintlnOverload.java"
      code={`public class PrintlnOverload {
    public static void main(String[] args) {
        // 以下每行调用的是不同的 println 重载版本：
        System.out.println(42);          // println(int)
        System.out.println(3.14);        // println(double)
        System.out.println(true);        // println(boolean)
        System.out.println('A');         // println(char)
        System.out.println("Hello");     // println(String)
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`42
3.14
true
A
Hello`} />

    <Heading3>5. 仅返回值不同不能构成重载</Heading3>
    <Callout type="danger" title="只有返回值类型不同——编译报错（方法重复定义）">
      <CodeBlock
        title="错误示范（无法编译）"
        code={`public class ReturnOnlyError {

    public static int getValue(int n) {
        return n * 2;
    }

    // 编译错误：与上面的方法参数列表完全相同，只有返回值不同
    // Java 不允许这样的"重载"，视为方法重复定义
    public static double getValue(int n) {
        return n * 2.0;
    }
}`}
      />
      <Paragraph>
        原因：调用 <InlineCode>getValue(5)</InlineCode> 时，编译器无法通过实参判断
        你想要 int 结果还是 double 结果，因为调用者写的是一样的。
        编译器只看参数列表来区分重载版本，返回值类型不在考量范围内。
      </Paragraph>
    </Callout>

    <Heading3>6. 完整重载对比示例</Heading3>
    <Heading4>6.1 合法的重载</Heading4>
    <CodeBlock
      title="LegalOverload.java"
      code={`public class LegalOverload {

    // 参数个数不同
    public static void print(int a) {
        System.out.println("一个 int：" + a);
    }

    public static void print(int a, int b) {
        System.out.println("两个 int：" + a + ", " + b);
    }

    // 参数类型不同
    public static void print(double a) {
        System.out.println("一个 double：" + a);
    }

    // 参数顺序不同
    public static void print(int a, double b) {
        System.out.println("int + double：" + a + ", " + b);
    }

    public static void print(double a, int b) {
        System.out.println("double + int：" + a + ", " + b);
    }

    public static void main(String[] args) {
        print(1);
        print(1, 2);
        print(3.14);
        print(1, 2.5);
        print(2.5, 1);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`一个 int：1
两个 int：1, 2
一个 double：3.14
int + double：1, 2.5
double + int：2.5, 1`} />

    <Heading4>6.2 不合法的"重载"（编译报错）</Heading4>
    <CodeBlock
      title="IllegalOverload.java（无法编译）"
      code={`public class IllegalOverload {

    public static int add(int a, int b) {
        return a + b;
    }

    // 错误 1：只有参数名不同，不构成重载，视为重复定义
    public static int add(int x, int y) {
        return x + y;
    }

    // 错误 2：只有返回值不同，不构成重载，视为重复定义
    public static double add(int a, int b) {
        return a + b;
    }
}`}
    />

    <Heading3>7. 重载 vs 重写（预告）</Heading3>
    <Paragraph>
      学到面向对象继承时，还会遇到另一个概念——<Text bold>重写（Override）</Text>。
      两者名字相近，含义完全不同，初学者容易混淆：
    </Paragraph>
    <Table
      head={['对比项', '重载（Overload）', '重写（Override）']}
      rows={[
        ['发生位置', '同一个类内', '子类对父类方法'],
        ['方法名', '相同', '相同'],
        ['参数列表', '必须不同', '必须相同'],
        ['返回值类型', '可以不同', '必须相同（或协变）'],
        ['阶段', '编译期确定调用哪个', '运行期动态分派'],
        ['关键字标注', '无特殊要求', '子类方法加 @Override 注解'],
      ]}
    />
    <Callout type="tip" title="一句话记忆">
      重载看<Text bold>参数列表</Text>，在<Text bold>同一类</Text>内，编译期决定；
      重写看<Text bold>继承关系</Text>，在<Text bold>父子类</Text>间，运行期决定。
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：判断哪些方法对构成重载"
      code={`// 以下各组方法对，判断是否构成合法重载，并说明理由。
//
// 组 A：
//   public static int calc(int a, int b)
//   public static int calc(int a, int b, int c)
//
// 组 B：
//   public static void show(String s)
//   public static void show(int n)
//
// 组 C：
//   public static double area(double r)
//   public static double area(double width, double height)
//
// 组 D：
//   public static int max(int a, int b)
//   public static double max(int a, int b)
//
// 组 E：
//   public static void greet(String name, int times)
//   public static void greet(int times, String name)`}
      answerCode={`// 组 A：合法重载
//   参数个数不同（2 vs 3），构成重载。
//
// 组 B：合法重载
//   参数类型不同（String vs int），构成重载。
//
// 组 C：合法重载
//   参数个数不同（1 vs 2），构成重载。
//
// 组 D：不合法（编译报错）
//   参数列表完全相同（都是 int, int），只有返回值不同，
//   Java 不允许，视为重复方法定义。
//
// 组 E：合法重载
//   参数顺序不同：(String, int) vs (int, String)，
//   类型组合不同，构成重载。
//   注意：虽然两个参数类型相同（都是一个 String 和一个 int），
//   但顺序不同，编译器能区分。`}
    />

    <CodeBlock
      qa
      title="练习 2：为 multiply 方法补充重载版本"
      code={`// 已有方法 multiply(int a, int b) 返回两个 int 的乘积。
// 要求再添加两个重载版本：
//   ① multiply(int a, int b, int c)：三个 int 相乘
//   ② multiply(double a, double b)：两个 double 相乘
// 在 main 里分别调用三个版本并打印结果。

public class Exercise02 {

    public static int multiply(int a, int b) {
        return a * b;
    }

    // 在这里补全两个重载版本

    public static void main(String[] args) {
        // 在这里补全调用代码
    }
}`}
      answerCode={`public class Exercise02 {

    public static int multiply(int a, int b) {
        return a * b;
    }

    // 重载版本 1：三个 int 相乘
    public static int multiply(int a, int b, int c) {
        return a * b * c;
    }

    // 重载版本 2：两个 double 相乘
    public static double multiply(double a, double b) {
        return a * b;
    }

    public static void main(String[] args) {
        System.out.println(multiply(3, 4));          // 12
        System.out.println(multiply(2, 3, 4));       // 24
        System.out.println(multiply(1.5, 2.0));      // 3.0
    }
}

/* 控制台输出：
12
24
3.0

解析：
  multiply(3,4) 匹配 int+int 版本 → 12。
  multiply(2,3,4) 匹配 int+int+int 版本 → 24。
  multiply(1.5, 2.0) 匹配 double+double 版本 → 3.0。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：设计一组 describe 重载方法"
      code={`// 要求：设计重载方法 describe，共三个版本：
//   ① describe(String name)：打印"姓名：xxx"
//   ② describe(String name, int age)：打印"姓名：xxx，年龄：xx"
//   ③ describe(String name, int age, String city)：打印"姓名：xxx，年龄：xx，城市：xxx"
// 在 main 里分别调用三个版本。

public class Exercise03 {

    // 在这里补全三个重载方法

    public static void main(String[] args) {
        // 在这里补全调用代码
    }
}`}
      answerCode={`public class Exercise03 {

    public static void describe(String name) {
        System.out.println("姓名：" + name);
    }

    public static void describe(String name, int age) {
        System.out.println("姓名：" + name + "，年龄：" + age);
    }

    public static void describe(String name, int age, String city) {
        System.out.println("姓名：" + name + "，年龄：" + age + "，城市：" + city);
    }

    public static void main(String[] args) {
        describe("小明");
        describe("小红", 20);
        describe("小刚", 22, "北京");
    }
}

/* 控制台输出：
姓名：小明
姓名：小红，年龄：20
姓名：小刚，年龄：22，城市：北京

解析：三个方法名都是 describe，参数个数分别为 1、2、3，
      构成合法重载。调用时编译器根据实参数量自动匹配。
*/`}
    />
  </article>
);

export default index;
