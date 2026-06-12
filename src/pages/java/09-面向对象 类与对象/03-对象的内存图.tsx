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
    <Title>对象的内存图</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        要真正理解对象，就必须搞清楚它在内存里是怎么存的。
        本节用 ASCII 内存示意图，讲清楚三种典型情形：
        ①一个对象的内存布局，②两个独立对象，③两个引用变量指向同一对象。
        第③种情形是初学者最容易出 bug 的地方，重点理解。
      </Paragraph>
    </Callout>

    <Heading3>1. Java 内存的两块关键区域</Heading3>
    <Paragraph>
      理解对象内存图，先了解 Java 运行时内存中最常被提及的两个区域：
    </Paragraph>
    <Table
      head={['内存区域', '存放内容', '特点']}
      rows={[
        ['栈（Stack）', '方法调用信息、局部变量（包括引用变量本身）', '由 JVM 自动管理，方法结束后自动回收；存放速度快，空间较小'],
        ['堆（Heap）', 'new 出来的对象本体（成员变量的值存在这里）', '空间大；由垃圾回收器（GC）管理；对象地址（引用）被栈中的变量持有'],
        ['方法区（Method Area）', '类的字节码信息、静态变量、方法的代码', '类加载时放入；方法的代码只有一份，所有对象共享'],
      ]}
    />
    <Callout type="tip" title="引用变量存的是地址">
      <InlineCode>Student s1 = new Student();</InlineCode> 这行代码里：
      <UnorderedList>
        <ListItem>栈中的变量 <InlineCode>s1</InlineCode> 存放的是一个<Text bold>内存地址</Text>（指向堆中的对象）。</ListItem>
        <ListItem>堆中存放的才是真正的对象（成员变量 name、age 的值）。</ListItem>
      </UnorderedList>
      这就是为什么 String、数组、自定义类型叫"引用类型"——变量里存的是引用（地址），而不是值本身。
    </Callout>

    <Heading3>2. 情形一：一个对象的内存图</Heading3>
    <Paragraph>
      以下代码执行后，内存中发生了什么：
    </Paragraph>
    <CodeBlock
      title="OneObject.java"
      code={`public class OneObject {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "张三";
        s1.age = 18;
        s1.study();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="内存示意图（一个对象）"
      code={`┌─────────────────────────────────────────────────────────────┐
│                        方法区                                │
│   Student 类的字节码：study() 方法的代码（所有对象共享）        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐        ┌────────────────────────────┐
│       栈（Stack）     │        │        堆（Heap）           │
│                      │        │                            │
│  main() 栈帧：        │        │  地址 0x0011（Student对象）  │
│  ┌──────────────┐    │        │  ┌──────────────────────┐  │
│  │ s1 = 0x0011 │────┼───────▶│  │ name = "张三"        │  │
│  └──────────────┘    │        │  │ age  = 18            │  │
│                      │        │  └──────────────────────┘  │
└──────────────────────┘        └────────────────────────────┘`}
    />
    <Paragraph>
      执行过程：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>new Student()</InlineCode> 在堆中申请一块内存，创建 Student 对象，
        成员变量 name 默认为 null，age 默认为 0；把这块内存的地址（如 0x0011）返回。
      </ListItem>
      <ListItem>
        栈中的变量 <InlineCode>s1</InlineCode> 存储该地址 0x0011。
      </ListItem>
      <ListItem>
        <InlineCode>s1.name = "张三"</InlineCode>：顺着 s1 里存的地址找到堆中的对象，把 name 改为"张三"。
      </ListItem>
      <ListItem>
        调用 <InlineCode>s1.study()</InlineCode>：方法代码在方法区，执行时方法区读取堆中对象的 name 值打印。
      </ListItem>
    </UnorderedList>

    <Heading3>3. 情形二：两个独立对象</Heading3>
    <Paragraph>
      创建两个对象时，堆中产生两块独立的内存，各自存储自己的成员变量值：
    </Paragraph>
    <CodeBlock
      title="TwoObjects.java"
      code={`public class TwoObjects {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "张三";
        s1.age = 18;

        Student s2 = new Student();
        s2.name = "李四";
        s2.age = 20;

        System.out.println(s1.name + "，" + s1.age);
        System.out.println(s2.name + "，" + s2.age);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`张三，18
李四，20`} />
    <CodeBlock
      language="text"
      title="内存示意图（两个独立对象）"
      code={`┌──────────────────────┐        ┌────────────────────────────────────────┐
│       栈（Stack）     │        │              堆（Heap）                  │
│                      │        │                                        │
│  ┌──────────────┐    │        │  地址 0x0011（第一个 Student 对象）        │
│  │ s1 = 0x0011 │────┼───────▶│  ┌────────────────────┐               │
│  └──────────────┘    │        │  │ name = "张三"      │               │
│  ┌──────────────┐    │        │  │ age  = 18          │               │
│  │ s2 = 0x0022 │────┼──────┐ │  └────────────────────┘               │
│  └──────────────┘    │      │ │                                        │
│                      │      │ │  地址 0x0022（第二个 Student 对象）        │
└──────────────────────┘      └▶│  ┌────────────────────┐               │
                                │  │ name = "李四"      │               │
                                │  │ age  = 20          │               │
                                │  └────────────────────┘               │
                                └────────────────────────────────────────┘`}
    />
    <Paragraph>
      两个对象在堆中各自占据独立的内存空间，修改 s1 的属性完全不影响 s2 的属性，反之亦然。
    </Paragraph>

    <Heading3>4. 情形三：两个引用变量指向同一对象</Heading3>
    <Heading4>代码与输出</Heading4>
    <Paragraph>
      这是最容易出 bug 的情形：将一个引用变量赋值给另一个，两者指向<Text bold>同一个对象</Text>，
      通过任意一个引用修改成员变量，另一个引用看到的值也会跟着变化。
    </Paragraph>
    <CodeBlock
      title="SameObject.java"
      code={`public class SameObject {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "张三";
        s1.age = 18;

        // 把 s1 赋给 s2：s2 拿到的是 s1 里存的地址，两者指向同一个对象
        Student s2 = s1;

        System.out.println("赋值后，修改前：");
        System.out.println("s1.name = " + s1.name + "，s1.age = " + s1.age);
        System.out.println("s2.name = " + s2.name + "，s2.age = " + s2.age);

        // 通过 s2 修改 age
        s2.age = 99;

        System.out.println("通过 s2 修改 age 后：");
        System.out.println("s1.age = " + s1.age);   // 也变成 99，因为 s1 和 s2 指向同一对象
        System.out.println("s2.age = " + s2.age);   // 99
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`赋值后，修改前：
s1.name = 张三，s1.age = 18
s2.name = 张三，s2.age = 18
通过 s2 修改 age 后：
s1.age = 99
s2.age = 99`} />
    <Heading4>内存示意图</Heading4>
    <CodeBlock
      language="text"
      title="内存示意图（两个引用指向同一对象）"
      code={`┌──────────────────────┐        ┌────────────────────────────┐
│       栈（Stack）     │        │        堆（Heap）           │
│                      │        │                            │
│  ┌──────────────┐    │        │  地址 0x0011（Student对象）  │
│  │ s1 = 0x0011 │────┼────┐   │  ┌──────────────────────┐  │
│  └──────────────┘    │    └──▶│  │ name = "张三"        │  │
│  ┌──────────────┐    │    ┌──▶│  │ age  = 99            │  │
│  │ s2 = 0x0011 │────┼────┘   │  └──────────────────────┘  │
│  └──────────────┘    │        │                            │
│                      │        └────────────────────────────┘
└──────────────────────┘`}
    />
    <Paragraph>
      执行 <InlineCode>Student s2 = s1;</InlineCode> 时，只是把 s1 里存的地址（0x0011）复制给了 s2。
      此时 s1 和 s2 都存着同一个地址，指向堆中同一个 Student 对象。
      因此，无论通过 s1 还是 s2 修改成员变量，都是在修改同一块堆内存，两个引用看到的效果完全一致。
    </Paragraph>
    <Callout type="danger" title="区分「两个对象」和「两个引用指向同一对象」">
      <UnorderedList>
        <ListItem>
          <Text bold>两个独立对象</Text>：<InlineCode>Student s1 = new Student(); Student s2 = new Student();</InlineCode>
          ——两次 new，堆中有两块内存，互相独立。
        </ListItem>
        <ListItem>
          <Text bold>两个引用同一对象</Text>：<InlineCode>Student s1 = new Student(); Student s2 = s1;</InlineCode>
          ——一次 new，堆中只有一块内存，s1 和 s2 同时指向它，修改一个另一个也会受影响。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5. null 赋值：断开引用</Heading3>
    <Paragraph>
      将引用变量赋为 <InlineCode>null</InlineCode>，表示它不再指向任何对象。
      若此后通过该变量访问成员，会抛出 <InlineCode>NullPointerException</InlineCode>：
    </Paragraph>
    <CodeBlock
      title="NullDemo.java"
      code={`public class NullDemo {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "张三";

        Student s2 = s1;     // s2 也指向同一个对象

        s1 = null;           // s1 断开引用，不再指向任何对象
        // s1.study();       // 若执行这行会抛出 NullPointerException

        // s2 仍然指向原来的对象，不受 s1=null 影响
        System.out.println("s2.name = " + s2.name);   // 仍然可以正常访问
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`s2.name = 张三`} />
    <Paragraph>
      <InlineCode>s1 = null</InlineCode> 只是让 s1 这个变量不再持有地址，
      堆中的对象本身并没有立刻消失（GC 判断没有引用指向它后才会回收）。
      s2 依然持有原来的地址，可以正常访问对象。
    </Paragraph>

    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>栈存引用变量（地址），堆存对象本体（成员变量的值），方法代码在方法区共享。</ListItem>
        <ListItem>两次 <InlineCode>new</InlineCode> = 堆中两个独立对象，互不影响。</ListItem>
        <ListItem><InlineCode>s2 = s1</InlineCode> 是地址拷贝，两个变量指向同一对象；通过任一引用修改成员，另一个也能看到变化。</ListItem>
        <ListItem><InlineCode>s1 = null</InlineCode> 断开引用，对原对象通过其他引用仍可访问；对 null 变量调用方法则 NullPointerException。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：预测输出——两个引用同一对象"
      code={`问：下面代码的控制台输出是什么？请逐行分析。

Student a = new Student();
a.name = "小明";
a.age = 15;

Student b = a;
b.name = "小红";

System.out.println(a.name);
System.out.println(b.age);

a.age = 20;
System.out.println(b.age);`}
      answerCode={`输出：
小红
15
20

逐行分析：
1. new Student() 在堆中创建对象，a 保存地址（假设 0x100）。
2. a.name = "小明"，a.age = 15：对象属性赋值。
3. Student b = a：b 也存储 0x100，a 和 b 指向同一对象。
4. b.name = "小红"：通过 b 修改了 0x100 对象的 name，变成"小红"。
5. a.name → a 也指向 0x100，name 已是"小红"，输出"小红"。
6. b.age → 还是 0x100 对象的 age=15，输出 15。
7. a.age = 20：通过 a 修改 0x100 对象的 age 为 20。
8. b.age → b 也指向 0x100，age 已变为 20，输出 20。`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：判断堆中有几个对象"
      code={`判断下列每段代码执行后，堆中共有几个 Student 对象？

// 代码段 A
Student s1 = new Student();
Student s2 = new Student();
Student s3 = s1;

// 代码段 B
Student a = new Student();
a = new Student();

// 代码段 C
Student x = new Student();
Student y = x;
y = new Student();`}
      answerCode={`代码段 A：堆中有 2 个对象。
  s1 和 s3 指向同一个对象，s2 指向另一个对象，共 2 个。

代码段 B：堆中有 2 个对象（但第一个已经没有引用指向它，等待 GC 回收）。
  第一行 new 出对象1，a 指向它；
  第二行再 new 出对象2，a 改为指向对象2；
  对象1 现在没有任何引用，成为"垃圾"，会被 GC 回收，但此刻仍在堆中。

代码段 C：堆中有 2 个对象。
  x = new Student()：对象1，x 指向它；
  y = x：y 也指向对象1；
  y = new Student()：对象2，y 改为指向对象2；
  此时 x 仍然指向对象1，对象1 不是垃圾。共 2 个对象，x 和 y 各指向一个。`}
    />
    <CodeBlock
      qa
      title="练习 3：代码补全——通过第二个引用修改对象并验证"
      code={`// 要求：
// 1. 创建 Student 对象 stu1，name="Alice", age=20
// 2. 创建 Student 对象 stu2，令 stu2 = stu1（同一对象）
// 3. 通过 stu2 将 age 修改为 25
// 4. 打印 stu1.age，验证它也变成了 25
// 5. 再打印 stu1 == stu2 的结果（引用比较，应为 true）

public class RefTest {
    public static void main(String[] args) {
        // 请补全代码
    }
}`}
      answerCode={`public class RefTest {
    public static void main(String[] args) {
        Student stu1 = new Student();
        stu1.name = "Alice";
        stu1.age = 20;

        Student stu2 = stu1;   // stu2 和 stu1 指向同一对象

        stu2.age = 25;         // 通过 stu2 修改

        System.out.println("stu1.age = " + stu1.age);  // 25，因为指向同一对象
        System.out.println(stu1 == stu2);               // true，地址相同
    }
}

/* 控制台输出：
stu1.age = 25
true

解析：stu1 == stu2 比较的是两个引用变量存储的地址是否相同。
      因为 stu2 = stu1 是地址拷贝，两者存的地址完全一样，所以 == 结果为 true。
*/`}
    />
  </article>
);

export default index;
