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
    <Title>对象作为方法参数和返回值</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节已经知道：引用变量存的是对象在堆中的地址。
        本节把这个认知用在方法调用上——对象既可以作为方法的<Text bold>参数</Text>传入，
        也可以作为方法的<Text bold>返回值</Text>传出。
        理解"传的是地址"这一关键点，才能避免"以为改了副本、实际改了原对象"这类经典 bug。
      </Paragraph>
    </Callout>

    <Heading3>1. 对象作为方法参数</Heading3>
    <Paragraph>
      将对象传给方法时，传递的是<Text bold>对象的地址（引用）</Text>，而不是对象的完整拷贝。
      方法内部拿到这个地址后，可以通过它访问并修改堆中的原始对象。
    </Paragraph>
    <Table
      head={['传参类型', '传递的内容', '方法内修改是否影响原数据']}
      rows={[
        ['基本类型（int、double…）', '值的副本', '不影响（修改的是副本）'],
        ['引用类型（对象、数组）', '地址的副本（指向同一对象）', '影响（通过地址访问的是同一个堆对象）'],
      ]}
    />
    <Callout type="warning" title="传地址 vs 传值">
      Java 所有参数传递都是<Text bold>值传递</Text>——对于引用类型，传的"值"是地址本身的副本。
      因此方法内通过该地址修改对象成员会影响原对象；
      但如果在方法内把形参重新赋值为另一个对象（<InlineCode>形参 = new Xxx()</InlineCode>），
      不会影响外部变量所指向的对象。
    </Callout>

    <Heading3>2. 示例：对象作为参数，方法内修改成员</Heading3>
    <CodeBlock
      title="Student.java"
      code={`public class Student {
    String name;
    int age;

    public void introduce() {
        System.out.println("姓名：" + name + "，年龄：" + age);
    }
}`}
    />
    <CodeBlock
      title="ParamDemo.java"
      code={`public class ParamDemo {

    // 方法接收一个 Student 对象，并修改它的 age
    public static void growUp(Student stu) {
        stu.age += 1;    // 通过传入的地址，修改堆中对象的 age
        System.out.println("growUp 内部：" + stu.name + " 的年龄变为 " + stu.age);
    }

    // 方法接收 Student 对象，只读取，不修改
    public static void printInfo(Student stu) {
        System.out.println("[printInfo] " + stu.name + "，" + stu.age + " 岁");
    }

    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "张三";
        s1.age = 18;

        System.out.println("调用 growUp 之前：");
        s1.introduce();

        growUp(s1);   // 传入 s1 的地址

        System.out.println("调用 growUp 之后：");
        s1.introduce();   // age 已经被 growUp 改成了 19

        System.out.println("---");
        printInfo(s1);    // 传地址，只读取
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`调用 growUp 之前：
姓名：张三，年龄：18
growUp 内部：张三 的年龄变为 19
调用 growUp 之后：
姓名：张三，年龄：19
---
[printInfo] 张三，19 岁`} />
    <Paragraph>
      执行 <InlineCode>growUp(s1)</InlineCode> 时，形参 <InlineCode>stu</InlineCode> 得到的是
      s1 里的地址副本，两者指向同一个堆对象。
      <InlineCode>stu.age += 1</InlineCode> 直接修改了堆中对象的 age 值，
      方法结束后 s1 所指向的对象 age 已经变为 19。
    </Paragraph>

    <Heading3>3. 方法内重新赋值形参，不影响外部引用</Heading3>
    <Paragraph>
      如果在方法内把形参赋给另一个新对象，外部的引用变量并不会跟着改变：
    </Paragraph>
    <CodeBlock
      title="ReassignDemo.java"
      code={`public class ReassignDemo {

    // 把形参 stu 指向一个新对象——不影响外部 s1
    public static void reassign(Student stu) {
        stu = new Student();   // 形参 stu 现在指向新对象，与外部 s1 无关
        stu.name = "新对象";
        stu.age = 0;
        System.out.println("方法内 stu.name = " + stu.name);
    }

    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "张三";
        s1.age = 18;

        reassign(s1);

        // s1 仍然指向原来的对象，完全不受影响
        System.out.println("方法外 s1.name = " + s1.name);
        System.out.println("方法外 s1.age  = " + s1.age);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`方法内 stu.name = 新对象
方法外 s1.name = 张三
方法外 s1.age  = 18`} />
    <Paragraph>
      <InlineCode>stu = new Student()</InlineCode> 只是让形参 <InlineCode>stu</InlineCode>
      这个局部变量改为指向新对象，不会影响外部变量 <InlineCode>s1</InlineCode> 所存的地址。
      外部 s1 依然指向原来的对象，name 和 age 不变。
    </Paragraph>

    <Heading3>4. 对象作为方法返回值</Heading3>
    <Paragraph>
      方法的返回值类型可以是自定义类，此时 <InlineCode>return</InlineCode> 的是对象的地址（引用）。
      调用者拿到这个地址，就可以通过它操作返回的对象。
    </Paragraph>
    <CodeBlock
      language="text"
      title="返回对象的方法格式"
      code={`public static 类名 方法名(参数列表) {
    类名 对象 = new 类名();
    // 对对象进行初始化赋值...
    return 对象;   // 返回对象的地址
}`}
    />

    <Heading3>5. 示例：工厂方法——创建并返回对象</Heading3>
    <Heading4>Phone 类与工厂方法</Heading4>
    <CodeBlock
      title="Phone.java"
      code={`public class Phone {
    String brand;
    double price;

    public void showInfo() {
        System.out.println("品牌：" + brand + "，价格：" + price + " 元");
    }
}`}
    />
    <CodeBlock
      title="PhoneFactory.java"
      code={`public class PhoneFactory {

    // 工厂方法：根据品牌和价格创建 Phone 对象并返回
    public static Phone create(String brand, double price) {
        Phone p = new Phone();
        p.brand = brand;
        p.price = price;
        return p;   // 返回对象的地址
    }

    // 返回价格更低的那部手机
    public static Phone cheaper(Phone p1, Phone p2) {
        if (p1.price <= p2.price) {
            return p1;
        } else {
            return p2;
        }
    }

    public static void main(String[] args) {
        // 1. 通过工厂方法创建对象
        Phone mi = create("小米", 1999.0);
        Phone apple = create("苹果", 7999.0);

        mi.showInfo();
        apple.showInfo();

        System.out.println("---");

        // 2. 返回两者中价格更低的
        Phone result = cheaper(mi, apple);
        System.out.println("价格更低的手机：");
        result.showInfo();

        // 3. 验证返回的是同一个对象（地址相同）
        System.out.println("result == mi : " + (result == mi));
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`品牌：小米，价格：1999.0 元
品牌：苹果，价格：7999.0 元
---
价格更低的手机：
品牌：小米，价格：1999.0 元
result == mi : true`} />
    <Paragraph>
      <InlineCode>cheaper(mi, apple)</InlineCode> 返回的是 <InlineCode>p1</InlineCode>（即 mi 的地址）。
      <InlineCode>result == mi</InlineCode> 结果为 <InlineCode>true</InlineCode>，
      印证了 result 和 mi 指向同一个堆对象，方法返回的是地址而非对象副本。
    </Paragraph>

    <Heading3>6. 综合示例：对象既作参数又作返回值</Heading3>
    <CodeBlock
      title="StudentService.java"
      code={`public class StudentService {

    // 参数：接收两个 Student；返回值：返回年龄较大的那个
    public static Student getOlder(Student s1, Student s2) {
        if (s1.age >= s2.age) {
            return s1;
        } else {
            return s2;
        }
    }

    // 参数：接收 Student 对象，给 age 加上指定年数
    public static void addYears(Student stu, int years) {
        stu.age += years;
    }

    public static void main(String[] args) {
        Student a = new Student();
        a.name = "Alice";
        a.age = 22;

        Student b = new Student();
        b.name = "Bob";
        b.age = 25;

        // 1. 获取年龄较大的学生
        Student older = getOlder(a, b);
        System.out.println("年龄较大的是：" + older.name + "（" + older.age + " 岁）");

        // 2. 给 a 增加 3 岁
        addYears(a, 3);
        System.out.println("addYears 后，a.age = " + a.age);

        // 3. 再次比较
        older = getOlder(a, b);
        System.out.println("重新比较，年龄较大的是：" + older.name + "（" + older.age + " 岁）");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`年龄较大的是：Bob（25 岁）
addYears 后，a.age = 25
重新比较，年龄较大的是：Alice（25 岁）`} />
    <Paragraph>
      第三行输出"Alice"是因为两者 age 同为 25，<InlineCode>s1.age &gt;= s2.age</InlineCode>
      成立，返回 s1（即 a）。
      同时印证了 <InlineCode>addYears(a, 3)</InlineCode> 通过地址成功修改了 a 所指对象的 age。
    </Paragraph>

    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>对象作为参数：传递的是地址副本，方法内通过该地址可以修改原对象的成员变量。</ListItem>
        <ListItem>方法内把形参重新赋值为新对象，不影响外部引用变量。</ListItem>
        <ListItem>对象作为返回值：return 的是地址，调用者拿到地址后与原对象共享同一块堆内存。</ListItem>
        <ListItem>用 <InlineCode>==</InlineCode> 比较两个引用，结果为 <InlineCode>true</InlineCode> 表示指向同一对象。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：预测输出——对象传参后修改"
      code={`问：下面代码的控制台输出是什么？

public class Test {
    public static void change(Student s) {
        s.age = 100;
    }

    public static void main(String[] args) {
        Student stu = new Student();
        stu.name = "小明";
        stu.age = 18;

        change(stu);
        System.out.println(stu.age);
    }
}`}
      answerCode={`输出：100

分析：
调用 change(stu) 时，形参 s 获得 stu 的地址副本，两者指向同一个对象。
s.age = 100 通过该地址把堆中对象的 age 改成了 100。
方法结束后，stu 依然指向同一对象，stu.age 已是 100，打印 100。`}
    />
    <CodeBlock
      qa
      title="练习 2：编写 createStudent 工厂方法"
      code={`// 要求：在 StudentFactory 类中定义静态方法 createStudent，
// 接收 name（String）和 age（int）两个参数，
// 创建 Student 对象，赋值后返回该对象。
// 在 main 中调用两次，分别创建"小华"（19岁）和"小丽"（21岁），
// 调用各自的 introduce() 方法打印信息。

public class StudentFactory {
    public static Student createStudent(String name, int age) {
        // 请补全
    }

    public static void main(String[] args) {
        // 请补全
    }
}`}
      answerCode={`public class StudentFactory {
    public static Student createStudent(String name, int age) {
        Student s = new Student();
        s.name = name;
        s.age = age;
        return s;
    }

    public static void main(String[] args) {
        Student s1 = createStudent("小华", 19);
        Student s2 = createStudent("小丽", 21);
        s1.introduce();
        s2.introduce();
    }
}

/* 控制台输出：
姓名：小华，年龄：19
姓名：小丽，年龄：21

解析：createStudent 每次 new 出一个新对象并返回地址。
      s1 和 s2 各自指向独立的对象，互不影响。
*/`}
    />
    <CodeBlock
      qa
      title="练习 3：方法内重新赋值形参，验证外部不受影响"
      code={`// 要求：
// 编写方法 tryReplace(Student s)，在方法内执行 s = new Student()，
// 并把新对象的 name 设为 "替换品"。
// 在 main 中创建 Student 对象（name="原始"），调用 tryReplace 后打印 name，
// 验证外部对象是否被替换。

public class ReplaceTest {
    public static void tryReplace(Student s) {
        // 请补全
    }

    public static void main(String[] args) {
        // 请补全
    }
}`}
      answerCode={`public class ReplaceTest {
    public static void tryReplace(Student s) {
        s = new Student();      // 形参 s 指向新对象
        s.name = "替换品";
        System.out.println("方法内 s.name = " + s.name);
    }

    public static void main(String[] args) {
        Student original = new Student();
        original.name = "原始";

        tryReplace(original);

        // original 仍然指向原来的对象，不受影响
        System.out.println("方法外 original.name = " + original.name);
    }
}

/* 控制台输出：
方法内 s.name = 替换品
方法外 original.name = 原始

解析：s = new Student() 只是让形参 s 这个局部变量改变了指向，
      外部变量 original 存储的地址没有改变，它仍然指向原来那个对象。
      所以 original.name 依然是"原始"，未被替换。
*/`}
    />
  </article>
);

export default index;
