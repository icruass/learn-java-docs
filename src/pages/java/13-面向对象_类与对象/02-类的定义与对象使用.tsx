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
    <Title>类的定义与对象使用</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节理解了面向对象的思想，本节正式动手写代码：
        学会如何<Text bold>定义一个类</Text>（包含成员变量和成员方法），
        如何<Text bold>创建对象</Text>，以及如何通过对象<Text bold>访问成员</Text>。
        这是面向对象编程最基础、最核心的操作，后续所有内容都建立在此之上。
      </Paragraph>
    </Callout>

    <Heading3>1. 类的组成</Heading3>
    <Paragraph>
      一个类由两部分组成：<Text bold>成员变量</Text>（属性）和<Text bold>成员方法</Text>（行为）。
    </Paragraph>
    <Table
      head={['组成部分', '别名', '位置', '作用', '示例']}
      rows={[
        ['成员变量', '属性、字段（field）', '类中、方法外', '描述对象"有什么"，每个对象都有自己独立的一份', 'String name; int age;'],
        ['成员方法', '行为、方法（method）', '类中', '描述对象"能做什么"，与之前学的方法相比去掉了 static', 'public void study() { ... }'],
      ]}
    />
    <Callout type="warning" title="成员方法去掉 static">
      在入门方法章节，我们写的都是 <InlineCode>public static void xxx()</InlineCode>。
      进入面向对象之后，类的成员方法<Text bold>去掉 static</Text>，变成
      <InlineCode>public void xxx()</InlineCode>。
      加了 static 的方法属于类本身，去掉 static 的方法属于对象。
      具体原因在后续"static 关键字"章节会深入讲解。
    </Callout>

    <Heading3>2. 类的定义格式</Heading3>
    <CodeBlock
      language="text"
      title="类的定义格式"
      code={`public class 类名 {
    // 成员变量（属性）：写在类中、方法外
    数据类型 变量名;
    数据类型 变量名;

    // 成员方法（行为）：去掉 static
    public 返回值类型 方法名(参数列表) {
        方法体;
    }
}`}
    />
    <Paragraph>
      类名要求：首字母大写，符合大驼峰命名法（UpperCamelCase），
      如 <InlineCode>Student</InlineCode>、<InlineCode>PhoneManager</InlineCode>。
      类名要见名知意，能直接说明这个类描述的是什么事物。
    </Paragraph>

    <Heading3>3. 创建对象与访问成员</Heading3>
    <Paragraph>
      定义好类之后，用 <InlineCode>new</InlineCode> 关键字创建对象：
    </Paragraph>
    <CodeBlock
      language="text"
      title="创建对象的格式"
      code={`类名 对象名 = new 类名();`}
    />
    <Paragraph>
      创建对象后，通过<Text bold>点（.）运算符</Text>访问成员变量或调用成员方法：
    </Paragraph>
    <CodeBlock
      language="text"
      title="访问成员的格式"
      code={`// 访问成员变量（读取或赋值）
对象名.成员变量名
对象名.成员变量名 = 值;

// 调用成员方法
对象名.方法名(实参);`}
    />

    <Heading3>4. 成员变量的默认值</Heading3>
    <Paragraph>
      成员变量在对象创建时会自动赋予默认值，无需手动初始化（这一点与局部变量不同）：
    </Paragraph>
    <Table
      head={['数据类型', '默认值']}
      rows={[
        ['byte、short、int、long', '0'],
        ['float、double', '0.0'],
        ['char', ["'\\u0000'（空字符）"]],
        ['boolean', 'false'],
        ['引用类型（String、数组、对象等）', 'null'],
      ]}
    />
    <Callout type="tip" title="null 是什么">
      <InlineCode>null</InlineCode> 表示"不指向任何对象"，是引用类型变量的默认值。
      如果对一个值为 <InlineCode>null</InlineCode> 的引用调用方法或访问成员，
      会抛出 <InlineCode>NullPointerException（空指针异常）</InlineCode>，这是 Java 中最常见的运行时错误之一。
    </Callout>

    <Heading3>5. 完整示例：Student 类</Heading3>
    <Heading4>定义 Student 类</Heading4>
    <Paragraph>
      定义一个 <InlineCode>Student</InlineCode> 类，包含姓名、年龄两个属性，
      以及学习和吃饭两个行为：
    </Paragraph>
    <CodeBlock
      title="Student.java"
      code={`public class Student {
    // 成员变量（属性）：写在类中，方法外
    String name;   // 姓名，默认值为 null
    int age;       // 年龄，默认值为 0

    // 成员方法（行为）：去掉 static
    public void study() {
        System.out.println(name + " 正在认真学习 Java！");
    }

    public void eat(String food) {
        System.out.println(name + " 正在吃" + food);
    }

    public String introduce() {
        return "我叫 " + name + "，今年 " + age + " 岁。";
    }
}`}
    />
    <Heading4>创建对象并使用</Heading4>
    <Paragraph>
      新建一个测试类，创建 <InlineCode>Student</InlineCode> 对象并进行操作：
    </Paragraph>
    <CodeBlock
      title="StudentTest.java"
      code={`public class StudentTest {
    public static void main(String[] args) {
        // 1. 创建第一个 Student 对象
        Student s1 = new Student();
        // 2. 给成员变量赋值
        s1.name = "张三";
        s1.age = 18;
        // 3. 调用成员方法
        s1.study();
        s1.eat("红烧肉");
        System.out.println(s1.introduce());

        System.out.println("---");

        // 4. 创建第二个 Student 对象，展示各对象数据独立
        Student s2 = new Student();
        s2.name = "李四";
        s2.age = 20;
        s2.study();
        System.out.println(s2.introduce());

        System.out.println("---");

        // 5. 演示成员变量默认值：不赋值直接访问
        Student s3 = new Student();
        System.out.println("s3.name 默认值：" + s3.name);   // null
        System.out.println("s3.age  默认值：" + s3.age);    // 0
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`张三 正在认真学习 Java！
张三 正在吃红烧肉
我叫 张三，今年 18 岁。
---
李四 正在认真学习 Java！
我叫 李四，今年 20 岁。
---
s3.name 默认值：null
s3.age  默认值：0`} />
    <Paragraph>
      执行过程分析：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <InlineCode>new Student()</InlineCode> 在堆内存中创建一个 Student 对象，
        对象内部的 name 初始化为 null，age 初始化为 0；
        变量 <InlineCode>s1</InlineCode> 保存该对象的地址（引用）。
      </ListItem>
      <ListItem>
        通过 <InlineCode>s1.name = "张三"</InlineCode> 赋值后，s1 所指向的对象的 name 变为"张三"。
      </ListItem>
      <ListItem>
        调用 <InlineCode>s1.study()</InlineCode> 时，方法内部的 <InlineCode>name</InlineCode>
        就是 s1 这个对象的 name，即"张三"。
      </ListItem>
      <ListItem>
        <InlineCode>s2</InlineCode> 是另一个独立的对象，修改 s2 的属性不会影响 s1 的属性。
      </ListItem>
      <ListItem>
        <InlineCode>s3</InlineCode> 创建后没有赋值，直接访问其 name（null）和 age（0）——这就是成员变量的默认值。
      </ListItem>
    </OrderedList>

    <Heading3>6. 一个文件中类的书写规范</Heading3>
    <Paragraph>
      实际开发中，通常<Text bold>一个 .java 文件只定义一个 public 类</Text>，且文件名必须与 public 类名完全一致。
      入门阶段常见的做法是把 Student 类和测试类（StudentTest）分别放在两个文件里。
    </Paragraph>
    <Callout type="warning" title="文件名与类名一致">
      如果类用 <InlineCode>public</InlineCode> 修饰，文件名<Text bold>必须</Text>与类名完全一致（包括大小写），
      例如 <InlineCode>Student</InlineCode> 类必须存放在 <InlineCode>Student.java</InlineCode> 中，
      否则编译报错。一个 .java 文件中最多只能有一个 public 类。
    </Callout>

    <Callout type="success" title="小结">
      <Paragraph>类的定义与对象使用核心要点：</Paragraph>
      <UnorderedList>
        <ListItem>类的组成：<Text bold>成员变量</Text>（类中方法外）+ <Text bold>成员方法</Text>（去掉 static）。</ListItem>
        <ListItem>创建对象：<InlineCode>类名 对象名 = new 类名();</InlineCode></ListItem>
        <ListItem>访问成员：<InlineCode>对象名.成员变量</InlineCode> 和 <InlineCode>对象名.方法名()</InlineCode></ListItem>
        <ListItem>成员变量有默认值（整数 0、小数 0.0、布尔 false、引用类型 null）；局部变量没有。</ListItem>
        <ListItem>多个对象的成员变量独立存储，互不影响。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>
    <CodeBlock
      qa
      title="练习 1：定义 Car 类并创建对象"
      code={`// 要求：
// 1. 定义 Car 类，包含：
//    成员变量：brand（String，品牌）、color（String，颜色）、speed（int，当前速度）
//    成员方法：
//      accelerate(int delta)：速度加 delta，并打印"xxx 加速，当前速度：yyy km/h"
//      brake()：速度归零，并打印"xxx 刹车，已停止"
// 2. 在 CarTest 的 main 中：
//    创建一辆 brand="宝马", color="白色" 的 Car 对象
//    调用 accelerate(60)，再调用 accelerate(40)，再调用 brake()

public class Car {
    // 请补全
}

public class CarTest {
    public static void main(String[] args) {
        // 请补全
    }
}`}
      answerCode={`public class Car {
    String brand;
    String color;
    int speed;

    public void accelerate(int delta) {
        speed += delta;
        System.out.println(brand + " 加速，当前速度：" + speed + " km/h");
    }

    public void brake() {
        speed = 0;
        System.out.println(brand + " 刹车，已停止");
    }
}

public class CarTest {
    public static void main(String[] args) {
        Car car = new Car();
        car.brand = "宝马";
        car.color = "白色";

        car.accelerate(60);
        car.accelerate(40);
        car.brake();
    }
}

/* 控制台输出：
宝马 加速，当前速度：60 km/h
宝马 加速，当前速度：100 km/h
宝马 刹车，已停止
*/`}
    />
    <CodeBlock
      qa
      title="练习 2：两个对象数据独立验证"
      code={`// 要求：
// 创建两个 Student 对象 s1 和 s2：
//   s1：name="小明", age=17
//   s2：name="小红", age=16
// 先打印两个对象各自的 name 和 age，
// 然后把 s1.age 改为 18，再次打印两个对象的 age，
// 验证修改 s1 不会影响 s2。

public class IndependentTest {
    public static void main(String[] args) {
        // 请补全代码
    }
}`}
      answerCode={`public class IndependentTest {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "小明";
        s1.age = 17;

        Student s2 = new Student();
        s2.name = "小红";
        s2.age = 16;

        System.out.println("修改前：");
        System.out.println(s1.name + " 年龄：" + s1.age);
        System.out.println(s2.name + " 年龄：" + s2.age);

        s1.age = 18;   // 只修改 s1

        System.out.println("修改后：");
        System.out.println(s1.name + " 年龄：" + s1.age);   // 18
        System.out.println(s2.name + " 年龄：" + s2.age);   // 仍然是 16，不受影响
    }
}

/* 控制台输出：
修改前：
小明 年龄：17
小红 年龄：16
修改后：
小明 年龄：18
小红 年龄：16

解析：s1 和 s2 是两个独立的对象，各自在堆内存中有自己的存储空间。
      修改 s1.age 只影响 s1 所指向的那块内存，s2 完全不受影响。
*/`}
    />
    <CodeBlock
      qa
      title="练习 3：默认值验证"
      code={`// 要求：
// 定义一个 Box 类，包含如下成员变量（不赋任何初值）：
//   int width、double height、boolean isEmpty、String label
// 在 BoxTest 的 main 中创建 Box 对象后，
// 直接打印以上四个成员变量，观察默认值。

public class Box {
    // 请补全
}

public class BoxTest {
    public static void main(String[] args) {
        // 请补全
    }
}`}
      answerCode={`public class Box {
    int width;
    double height;
    boolean isEmpty;
    String label;
}

public class BoxTest {
    public static void main(String[] args) {
        Box box = new Box();
        System.out.println("width   = " + box.width);
        System.out.println("height  = " + box.height);
        System.out.println("isEmpty = " + box.isEmpty);
        System.out.println("label   = " + box.label);
    }
}

/* 控制台输出：
width   = 0
height  = 0.0
isEmpty = false
label   = null

解析：成员变量在对象创建时自动赋予默认值：
  int  -> 0
  double -> 0.0
  boolean -> false
  String（引用类型）-> null
*/`}
    />
  </article>
);

export default index;
