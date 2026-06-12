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
    <Title>匿名对象</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        通常我们创建对象都会把它赋给一个变量，然后通过变量名来调用方法。
        但有时候一个对象只需要用一次，给它起名字反而显得啰嗦。
        <Text bold>匿名对象</Text>就是"创建完直接用、不赋给任何变量"的对象写法，
        代码更简洁，也是 Java 语法中常见的惯用手法。
        本节讲清匿名对象的概念、特点、适用场景，以及不能多次使用同一匿名对象的原因。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是匿名对象</Heading3>
    <Paragraph>
      普通对象的创建方式是：先 <InlineCode>new</InlineCode> 出对象，再把它赋给一个变量，通过变量名来使用：
    </Paragraph>
    <CodeBlock
      language="text"
      title="普通对象（有名字）"
      code={`类名 变量名 = new 类名();   // 有名字：变量名
变量名.方法名();              // 通过变量名调用`}
    />
    <Paragraph>
      <Text bold>匿名对象</Text>则是直接 <InlineCode>new</InlineCode> 并立刻使用，不赋给任何变量：
    </Paragraph>
    <CodeBlock
      language="text"
      title="匿名对象（没有名字）"
      code={`new 类名().方法名();         // 没有变量，直接调用方法
new 类名();                  // 也可以只创建，什么都不做（不常用）`}
    />
    <Paragraph>
      两者本质上都是在堆内存中创建了一个对象，区别在于：
      普通对象有变量名引用它，可以多次使用；
      匿名对象没有任何变量引用，<Text bold>用完立即成为垃圾回收的候选对象</Text>，无法再次访问。
    </Paragraph>

    <Heading3>2. 匿名对象的特点</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>只能使用一次</Text>：因为没有变量名保存引用，调用完这一次就无法再引用同一个对象了。
        如果需要多次调用同一个对象的方法，必须用普通对象（有变量名）。
      </ListItem>
      <ListItem>
        <Text bold>用完即可回收</Text>：JVM 的垃圾回收器会在适当时机自动回收没有引用的对象，
        匿名对象使用后就没有任何变量指向它，内存占用很快会被释放。
      </ListItem>
      <ListItem>
        <Text bold>适合一次性场景</Text>：如果对一个对象只需调用一次方法，用匿名对象可以省去声明变量的步骤，代码更简洁。
      </ListItem>
    </UnorderedList>

    <Heading3>3. 普通对象与匿名对象对比</Heading3>
    <Table
      head={['对比项', '普通对象', '匿名对象']}
      rows={[
        ['写法', 'Student s = new Student();  s.study();', 'new Student().study();'],
        ['能否多次调用', '能，变量 s 一直引用该对象', '不能，每次 new 都是全新对象'],
        ['内存', '变量 s 持续引用，GC 暂不回收', '用完无引用，GC 可及时回收'],
        ['适用场景', '需要多次使用同一对象', '只需使用一次，不需要保留引用'],
      ]}
    />

    <Heading3>4. 示例代码</Heading3>

    <Heading4>示例 1：普通对象 vs 匿名对象</Heading4>
    <Paragraph>
      先定义一个简单的 <InlineCode>Student</InlineCode> 类，再分别用普通对象和匿名对象的方式调用其方法，
      对比两种写法的区别。
    </Paragraph>
    <CodeBlock
      title="Student.java"
      code={`public class Student {
    public void study() {
        System.out.println("学生正在学习 Java");
    }

    public void sayHello(String name) {
        System.out.println("你好，我是 " + name);
    }
}`}
    />
    <CodeBlock
      title="AnonymousDemo.java"
      code={`public class AnonymousDemo {
    public static void main(String[] args) {
        // ---- 普通对象写法 ----
        Student s = new Student();   // 创建对象，赋给变量 s
        s.study();                   // 第一次调用
        s.sayHello("小明");           // 第二次调用，s 还在，可以继续用

        System.out.println("--------");

        // ---- 匿名对象写法 ----
        new Student().study();       // 创建 Student 对象，立刻调用 study()，用完即丢
        new Student().sayHello("小红"); // 这是另一个全新的 Student 对象！
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`学生正在学习 Java
你好，我是 小明
--------
学生正在学习 Java
你好，我是 小红`} />
    <Callout type="warning" title="两个 new 是两个不同对象">
      注意匿名对象部分的 <InlineCode>new Student().study()</InlineCode> 和
      <InlineCode>new Student().sayHello("小红")</InlineCode> 是<Text bold>两次 new，两个不同的对象</Text>。
      如果 <InlineCode>Student</InlineCode> 类里有字段（成员变量），这两个对象的字段互相独立，不共享。
    </Callout>

    <Heading4>示例 2：匿名对象的错误用法——试图多次使用</Heading4>
    <CodeBlock
      title="AnonymousWrongDemo.java（错误演示）"
      code={`public class AnonymousWrongDemo {
    public static void main(String[] args) {
        // 错误示范：以为 new Student() 能被调用两次
        // 实际上每行 new 都是独立的全新对象，字段不共享
        new Student().study();
        new Student().sayHello("小华");  // 这是另一个对象，不是上面那个！

        // 如果 Student 有字段 name，下面两行访问的是不同对象的 name
        // new Student().name = "小华";  // 设置了这个对象的 name
        // System.out.println(new Student().name); // 这是另一个对象，name 是默认值！
    }
}`}
    />
    <Paragraph>
      如果需要对<Text bold>同一个对象多次操作</Text>（比如先设置属性再调用方法），
      必须用有变量名的普通对象。匿名对象只适合"创建后立刻用一次"的情况。
    </Paragraph>

    <Heading4>示例 3：匿名对象作为方法的参数（最常见用法）</Heading4>
    <Paragraph>
      匿名对象最典型的使用场景是<Text bold>作为方法的实参传入</Text>，省去中间变量，让代码更简洁。
    </Paragraph>
    <CodeBlock
      title="Teacher.java"
      code={`public class Teacher {
    // 接收一个 Student 对象，让学生进行学习
    public void teach(Student student) {
        System.out.println("老师开始上课...");
        student.study();
        System.out.println("老师：讲解完毕！");
    }
}`}
    />
    <CodeBlock
      title="PassAnonymousDemo.java"
      code={`public class PassAnonymousDemo {
    public static void main(String[] args) {
        Teacher teacher = new Teacher();

        // ---- 普通写法 ----
        Student s = new Student();   // 先创建 Student 对象赋给变量
        teacher.teach(s);            // 再作为参数传入

        System.out.println("--------");

        // ---- 匿名对象写法 ----
        teacher.teach(new Student()); // 直接 new Student() 作为实参传入，省去中间变量
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`老师开始上课...
学生正在学习 Java
老师：讲解完毕！
--------
老师开始上课...
学生正在学习 Java
老师：讲解完毕！`} />
    <Paragraph>
      两种写法效果完全相同。匿名对象作参数的写法更简洁，特别是在只需要传入对象、
      后续不再使用该对象的场景中非常常见。
      你会在以后学习 <InlineCode>Scanner</InlineCode>、集合框架等地方频繁见到这种写法。
    </Paragraph>

    <Heading4>示例 4：Scanner 的匿名对象写法</Heading4>
    <Paragraph>
      实际上 <InlineCode>Scanner</InlineCode> 也可以用匿名对象——但通常只推荐在只读取一次的情况下这样写：
    </Paragraph>
    <CodeBlock
      title="ScannerAnonymous.java"
      code={`import java.util.Scanner;

public class ScannerAnonymous {
    public static void main(String[] args) {
        // 匿名 Scanner 对象：只读取一个整数，读完就丢
        System.out.print("请输入一个整数：");
        int num = new Scanner(System.in).nextInt();
        System.out.println("你输入的是：" + num);

        // 注意：如果后续还需要继续读取，不要用匿名对象，应该用有名字的变量
        // 否则每次 new Scanner(System.in) 都是一个全新的 Scanner，可能读取混乱
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（用户输入 88）" code={`请输入一个整数：88
你输入的是：88`} />
    <Callout type="tip" title="Scanner 实际上很少用匿名对象">
      Scanner 通常需要读取多次输入，所以一般都声明为有名字的变量
      <InlineCode>Scanner sc = new Scanner(System.in);</InlineCode>。
      匿名对象的写法仅在"确实只需要读一次"的极少数情况下才使用。
    </Callout>

    <Callout type="success" title="小结">
      <Paragraph>匿名对象核心要点：</Paragraph>
      <UnorderedList>
        <ListItem>匿名对象：<InlineCode>new 类名().方法名()</InlineCode>，创建后不赋给变量，直接调用。</ListItem>
        <ListItem>只能使用一次——没有变量引用它，用完即成为 GC 候选对象，无法再访问。</ListItem>
        <ListItem>需要多次操作同一对象时，必须用普通（有名字的）对象。</ListItem>
        <ListItem>最典型用法：作为方法的实参传入，省去中间变量，让代码更简洁。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：改写为匿名对象"
      code={`// 已有如下代码，请将创建 Scanner 对象读取整数的部分
// 改写为匿名对象的写法（只读取一次 nextInt）。

import java.util.Scanner;

public class RewriteAnonymous {
    public static void main(String[] args) {
        // 原写法（有变量名）：
        Scanner sc = new Scanner(System.in);
        System.out.print("请输入一个数：");
        int n = sc.nextInt();
        System.out.println("你输入了：" + n);

        // 请将上面改写为匿名对象写法，结果相同
    }
}`}
      answerCode={`import java.util.Scanner;

public class RewriteAnonymous {
    public static void main(String[] args) {
        // 匿名对象写法：
        System.out.print("请输入一个数：");
        int n = new Scanner(System.in).nextInt();
        System.out.println("你输入了：" + n);
    }
}

/* 控制台输出（用户输入 42）：
请输入一个数：42
你输入了：42

解析：new Scanner(System.in).nextInt() 创建匿名 Scanner 对象后立刻调用 nextInt()，
      返回值赋给 n，匿名对象本身用完即可被 GC 回收。
      由于只需要读一次，此场景适合匿名对象写法。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：判断匿名对象是否可以多次使用"
      code={`// 问：下面代码有什么逻辑问题？输出结果会是什么？
// （假设 Counter 类有一个 count 字段，初始值为 0；
//  increment() 使 count 加 1；getCount() 返回 count 的值）

public class AnonymousQuestion {
    public static void main(String[] args) {
        new Counter().increment();    // (A) 对某个对象执行 increment
        new Counter().increment();    // (B) 对某个对象执行 increment
        System.out.println(new Counter().getCount()); // (C) 打印某个对象的 count
    }
}`}
      answerCode={`输出：0

逻辑问题分析：
  (A)、(B)、(C) 三行各自 new 了一个全新的 Counter 对象，互相独立，
  彼此的 count 字段不共享。

  (A) 新建对象1，count 从 0 变为 1，但没有变量引用，用完即可被回收。
  (B) 新建对象2，count 从 0 变为 1，同样用完被回收。
  (C) 新建对象3，count 还是初始值 0，getCount() 返回 0，打印 0。

正确做法（需要共享状态时，必须用有名字的对象）：

  Counter c = new Counter();
  c.increment();
  c.increment();
  System.out.println(c.getCount());   // 输出 2

解析：匿名对象每次 new 都是独立的全新对象，无法在多行之间共享状态。
      只要需要对同一对象进行多次操作，就必须用有变量名的普通对象。`}
    />

    <CodeBlock
      qa
      title="练习 3：用匿名对象作方法参数"
      code={`// 已有 Printer 类如下：
// class Printer {
//     public void print(Student s) {
//         System.out.println("打印学生信息：" + s.name);
//     }
// }
// Student 类有 String name 字段，构造方法 Student(String name)。
//
// 要求：在 main 中创建 Printer 对象（有名字），
// 然后用匿名对象的方式传入 Student，让 Printer 打印两个不同学生的信息：
// "张三" 和 "李四"。

public class PrintDemo {
    public static void main(String[] args) {
        // 请在这里补全代码
    }
}`}
      answerCode={`public class PrintDemo {
    public static void main(String[] args) {
        Printer printer = new Printer();

        // 用匿名 Student 对象作为参数传入，每次 new 一个不同姓名的 Student
        printer.print(new Student("张三"));
        printer.print(new Student("李四"));
    }
}

/* 控制台输出：
打印学生信息：张三
打印学生信息：李四

解析：new Student("张三") 和 new Student("李四") 都是匿名对象，
      直接作为实参传给 printer.print() 方法。
      这里只需要传入一次、不需要后续再用，所以匿名对象完全合适，
      省去了 Student s1 = new Student("张三"); 之类的中间变量声明。
*/`}
    />
  </article>
);

export default index;
