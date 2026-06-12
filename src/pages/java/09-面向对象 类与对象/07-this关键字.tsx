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
    <Title>this 关键字</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        写 setter 方法时，形参名和成员变量名往往完全相同——这时如果不加任何修饰，
        编译器会按<Text bold>就近原则</Text>把两者都当作局部变量，导致成员变量根本没有被赋值。
        <InlineCode>this</InlineCode> 关键字就是专门解决这个"同名冲突"问题的。
        本节讲清 this 的含义、核心用途，以及不写 this 时会出现的 bug，帮助你在封装代码中正确使用它。
      </Paragraph>
    </Callout>

    <Heading3>1. this 是什么</Heading3>
    <Paragraph>
      <InlineCode>this</InlineCode> 是 Java 中一个特殊的引用，它永远指向<Text bold>当前正在执行该方法的那个对象</Text>。
      简单记：<Text bold>谁调用方法，this 就指向谁</Text>。
    </Paragraph>
    <Paragraph>
      <InlineCode>this</InlineCode> 由 JVM 在对象调用方法时自动传入，不需要（也不能）手动声明。
      你只需要在需要明确"这是成员变量而不是局部变量"的地方，在变量名前加上 <InlineCode>this.</InlineCode> 即可。
    </Paragraph>
    <Table
      head={['写法', '访问的是哪个变量']}
      rows={[
        ['name（无前缀）', '就近原则：优先访问当前方法的局部变量（包括形参）'],
        ['this.name', '明确访问当前对象的成员变量'],
      ]}
    />
    <Callout type="tip" title="就近原则">
      Java 中变量查找遵循就近原则：先在当前方法的局部变量（含形参）中找，找不到再找成员变量。
      如果局部变量和成员变量同名，不写 <InlineCode>this.</InlineCode> 就只能访问局部变量，
      成员变量被"遮住"了。
    </Callout>

    <Heading3>2. 不写 this 的 bug 演示</Heading3>
    <Paragraph>
      下面这段代码是一个非常常见的新手错误：setter 里 <InlineCode>name = name</InlineCode>
      两边都是形参，成员变量永远是初始值（<InlineCode>null</InlineCode>）。
    </Paragraph>
    <CodeBlock
      title="BugDemo.java（错误写法）"
      code={`public class BugDemo {

    private String name;
    private int age;

    // 错误写法：没有 this，赋值语句两边都是形参，成员变量未被修改
    public void setName(String name) {
        name = name;   // 等号两侧都是局部变量 name，自己赋给自己，成员变量 name 纹丝不动
    }

    public void setAge(int age) {
        age = age;     // 同理，成员变量 age 永远是默认值 0
    }

    public void show() {
        System.out.println("姓名：" + name + "，年龄：" + age);
    }

    public static void main(String[] args) {
        BugDemo obj = new BugDemo();
        obj.setName("张三");
        obj.setAge(18);
        obj.show();    // 期望输出"张三 18"，实际输出"null 0"！
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（出乎意料的结果）"
      code={`姓名：null，年龄：0`}
    />
    <Paragraph>
      <InlineCode>setName("张三")</InlineCode> 调用时，形参 <InlineCode>name</InlineCode>
      的值是 "张三"，但 <InlineCode>name = name</InlineCode> 仅仅是把 "张三" 赋给了形参自身，
      成员变量 <InlineCode>name</InlineCode> 根本没有被动过，仍然是 <InlineCode>null</InlineCode>。
      这就是不写 <InlineCode>this</InlineCode> 引发的 bug。
    </Paragraph>

    <Heading3>3. 正确写法：用 this 区分成员变量与形参</Heading3>
    <CodeBlock
      title="CorrectDemo.java（正确写法）"
      code={`public class CorrectDemo {

    private String name;
    private int age;

    // 正确写法：this.name 指向成员变量，右侧 name 是形参
    public void setName(String name) {
        this.name = name;   // 把形参 name 的值赋给成员变量 this.name
    }

    public void setAge(int age) {
        if (age < 0 || age > 150) {
            System.out.println("年龄不合法：" + age);
            return;
        }
        this.age = age;     // 把形参 age 的值赋给成员变量 this.age
    }

    public void show() {
        System.out.println("姓名：" + name + "，年龄：" + age);
    }

    public static void main(String[] args) {
        CorrectDemo obj = new CorrectDemo();
        obj.setName("张三");
        obj.setAge(18);
        obj.show();   // 输出正确结果

        CorrectDemo obj2 = new CorrectDemo();
        obj2.setName("李四");
        obj2.setAge(25);
        obj2.show();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`姓名：张三，年龄：18
姓名：李四，年龄：25`}
    />
    <Paragraph>
      <InlineCode>obj.setName("张三")</InlineCode> 执行时，<InlineCode>this</InlineCode>
      指向 obj 这个对象，<InlineCode>this.name = name</InlineCode> 将形参 "张三" 赋给了
      obj 的成员变量 <InlineCode>name</InlineCode>，赋值成功。
      <InlineCode>obj2</InlineCode> 调用同一个方法时，<InlineCode>this</InlineCode> 指向 obj2，
      两个对象互不干扰。
    </Paragraph>

    <Heading3>4. this 指向的可视化理解</Heading3>
    <Paragraph>
      每次通过对象调用方法，JVM 都会把当前对象的内存地址作为隐含的 <InlineCode>this</InlineCode>
      传入方法。因此同一个方法被不同对象调用时，<InlineCode>this</InlineCode> 指向不同的内存空间：
    </Paragraph>
    <CodeBlock
      title="this 指向示意"
      code={`// 假设 obj1 的地址是 0x001，obj2 的地址是 0x002
CorrectDemo obj1 = new CorrectDemo();   // obj1 -> 0x001
CorrectDemo obj2 = new CorrectDemo();   // obj2 -> 0x002

obj1.setName("张三");  // 方法内 this 指向 0x001，修改的是 obj1 的 name
obj2.setName("李四");  // 方法内 this 指向 0x002，修改的是 obj2 的 name

// obj1 和 obj2 各自独立，互不影响`}
    />

    <Heading3>5. this 的使用场景汇总</Heading3>
    <Table
      head={['场景', '写法', '说明']}
      rows={[
        [
          '同名冲突（最常见）',
          'this.name = name;',
          '左边 this.name 是成员变量，右边 name 是形参',
        ],
        [
          '在方法中调用本类其他方法',
          'this.show();',
          'this 可以省略，直接写 show() 效果相同',
        ],
        [
          '在构造方法中调用另一个构造方法',
          'this(参数);',
          '必须写在构造方法的第一行，下一节讲解',
        ],
      ]}
    />
    <Callout type="warning" title="非同名情况下 this 可以省略">
      当方法内没有与成员变量同名的局部变量时，<InlineCode>this.</InlineCode> 可以省略不写——
      编译器会自动在成员变量中查找。加上 <InlineCode>this.</InlineCode> 也没有问题，
      只是稍显冗余。<Text bold>但 setter 中建议始终写 this.</Text>，养成好习惯。
    </Callout>

    <Heading3>6. 综合示例：完整的封装类</Heading3>
    <Paragraph>
      下面给出一个完整的 <InlineCode>Teacher</InlineCode> 类，所有 setter 都正确使用了
      <InlineCode>this</InlineCode>，并演示多个对象互不影响：
    </Paragraph>
    <CodeBlock
      title="Teacher.java"
      code={`public class Teacher {

    private String name;
    private String subject;  // 任教科目
    private int experience;  // 教龄（年），不能为负

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        if (experience < 0) {
            System.out.println("教龄不能为负：" + experience);
            return;
        }
        this.experience = experience;
    }

    public void introduce() {
        System.out.println("我是 " + name + "，任教 " + subject
                + "，教龄 " + experience + " 年。");
    }
}`}
    />
    <CodeBlock
      title="TeacherTest.java"
      code={`public class TeacherTest {
    public static void main(String[] args) {
        Teacher t1 = new Teacher();
        t1.setName("王老师");
        t1.setSubject("数学");
        t1.setExperience(10);
        t1.introduce();

        Teacher t2 = new Teacher();
        t2.setName("李老师");
        t2.setSubject("英语");
        t2.setExperience(-2);   // 非法，被拦截
        t2.setExperience(5);    // 合法，覆盖为 5
        t2.introduce();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`我是 王老师，任教 数学，教龄 10 年。
教龄不能为负：-2
我是 李老师，任教 英语，教龄 5 年。`}
    />

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：找出并修复 this 相关 bug"
      code={`// 下面的 Dog 类中有 bug，Dog 对象始终打印默认值。
// 请找出所有错误并修复。

public class Dog {
    private String name;
    private String breed;
    private int age;

    public void setName(String name) {
        name = name;       // 有问题？
    }

    public void setBreed(String breed) {
        this.breed = breed;  // 这行正确吗？
    }

    public void setAge(int age) {
        age = age;         // 有问题？
    }

    public void show() {
        System.out.println(name + "(" + breed + ")，" + age + " 岁");
    }
}

// 测试：
// Dog d = new Dog();
// d.setName("旺财");
// d.setBreed("金毛");
// d.setAge(3);
// d.show();
// 期望输出：旺财(金毛)，3 岁
// 实际输出：null(金毛)，0 岁`}
      answerCode={`public class Dog {
    private String name;
    private String breed;
    private int age;

    public void setName(String name) {
        this.name = name;   // 修复：加 this.，左边是成员变量，右边是形参
    }

    public void setBreed(String breed) {
        this.breed = breed;  // 本来就是正确的
    }

    public void setAge(int age) {
        this.age = age;     // 修复：加 this.，左边是成员变量，右边是形参
    }

    public void show() {
        System.out.println(name + "(" + breed + ")，" + age + " 岁");
    }
}

/* 控制台输出：
旺财(金毛)，3 岁

解析：
  setName 和 setAge 原来的写法都是"形参 = 形参"，是自我赋值，成员变量未改变。
  加上 this. 之后，左侧变为成员变量，赋值才真正有效。
  setBreed 本来就写了 this.breed，所以 breed 可以正常赋值。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：用 this 完整写一个 Circle 类"
      code={`// 要求：
// 1. 定义 Circle 类，私有字段 radius（double，半径）。
// 2. setRadius() 中用 this.radius = radius，并校验半径必须大于 0。
// 3. 提供 getRadius() 和 area() 方法（面积 = 3.14 * r * r）。
// 4. 在 main 中测试合法半径和非法半径（负数），并打印面积。

public class Circle {
    // 在这里补全代码
}

public class CircleTest {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Circle {
    private double radius;

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        if (radius <= 0) {
            System.out.println("半径必须大于 0，当前值：" + radius);
            return;
        }
        this.radius = radius;   // this.radius 是成员变量，radius 是形参
    }

    public double area() {
        return 3.14 * radius * radius;
    }
}

public class CircleTest {
    public static void main(String[] args) {
        Circle c = new Circle();

        c.setRadius(5.0);
        System.out.println("半径：" + c.getRadius());
        System.out.println("面积：" + c.area());

        c.setRadius(-3.0);   // 非法，被拦截
        System.out.println("非法设置后半径：" + c.getRadius());  // 仍是 5.0
    }
}

/* 控制台输出：
半径：5.0
面积：78.5
半径必须大于 0，当前值：-3.0
非法设置后半径：5.0

解析：
  setRadius 中 this.radius = radius 正确区分了成员变量和形参。
  setRadius(-3.0) 因校验失败而提前 return，成员变量 radius 保持 5.0 不变。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：预测输出"
      code={`// 下面代码的控制台输出是什么？解释原因。

public class Counter {
    private int count;

    public void setCount(int count) {
        this.count = count;
    }

    public void increment(int count) {
        // 注意：这里的 count 是形参，不是成员变量
        System.out.println("形参 count = " + count);
        System.out.println("成员变量 this.count = " + this.count);
        this.count = this.count + count;  // 成员变量 += 形参
    }

    public void show() {
        System.out.println("最终 count = " + this.count);
    }
}

// main 中：
// Counter c = new Counter();
// c.setCount(10);
// c.increment(5);
// c.show();`}
      answerCode={`/* 控制台输出：
形参 count = 5
成员变量 this.count = 10
最终 count = 15

解析：
  setCount(10) 将成员变量 this.count 赋为 10。
  increment(5) 调用时，形参 count = 5，this.count = 10（成员变量）。
  this.count = this.count + count = 10 + 5 = 15。
  所以 show() 打印 15。

  关键点：increment 方法内，count 指形参（值为 5），
  this.count 才是成员变量（值为 10）——两者同名，this. 是唯一区分手段。
*/`}
    />
  </article>
);

export default index;
