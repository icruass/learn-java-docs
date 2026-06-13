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
    <Title>反射概述与Class类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 的<Text bold>反射（Reflection）</Text>是指程序在<Text bold>运行时</Text>动态地获取类的信息，
        并操作类的构造方法、字段和方法，而不需要在编译期就写死类名。
        Spring、MyBatis、JUnit 等几乎所有主流框架都以反射为基础。
        本节先理解反射能做什么，再掌握反射的入口——<InlineCode>Class</InlineCode> 类的三种获取方式和常用方法。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是反射</Heading3>
    <Paragraph>
      正常情况下，我们写代码时就已经确定要用哪个类，例如 <InlineCode>new Student()</InlineCode>。
      这叫<Text bold>编译期确定</Text>——类名写死在源码里。
    </Paragraph>
    <Paragraph>
      反射则不同：它允许程序在<Text bold>运行期</Text>，通过一个字符串（类的全限定名）
      来加载类、创建对象、调用方法——类名可以来自配置文件、数据库、网络，运行前根本不知道是哪个类。
    </Paragraph>
    <Paragraph>
      反射主要能做四件事：
    </Paragraph>
    <UnorderedList>
      <ListItem><Text bold>动态获取类信息</Text>：类名、父类、实现的接口、字段列表、方法列表等</ListItem>
      <ListItem><Text bold>动态创建对象</Text>：不写 <InlineCode>new 类名()</InlineCode>，通过 Class 对象创建实例</ListItem>
      <ListItem><Text bold>动态调用方法</Text>：不写 <InlineCode>对象.方法名()</InlineCode>，通过 Method 对象调用</ListItem>
      <ListItem><Text bold>动态访问/修改字段</Text>：包括 <InlineCode>private</InlineCode> 字段（需要 setAccessible）</ListItem>
    </UnorderedList>

    <Heading3>2. 反射的优缺点</Heading3>
    <Table
      head={['维度', '说明']}
      rows={[
        ['优点：灵活性强', '运行时才决定用哪个类，框架可以通过配置文件驱动行为，无需修改源码'],
        ['优点：框架基础', 'Spring IoC、MyBatis Mapper、JUnit 测试方法发现等都依赖反射'],
        ['优点：通用工具', '可以编写与具体类无关的通用代码（如序列化、ORM 映射）'],
        ['缺点：性能开销', '反射调用比直接调用慢约 10~50 倍，频繁使用应缓存 Method/Field 对象'],
        ['缺点：破坏封装', 'setAccessible(true) 可绕过 private，削弱了访问控制'],
        ['缺点：编译期无检查', '方法名、字段名写成字符串，拼写错误只在运行时才报错'],
      ]}
    />

    <Heading3>3. Class 类——反射的入口</Heading3>
    <Paragraph>
      Java 中每一个类（包括基本类型、数组、接口）在被 JVM 加载后，
      都会在堆内存中生成一个对应的 <InlineCode>Class</InlineCode> 对象（类型为 <InlineCode>java.lang.Class</InlineCode>）。
      这个 <InlineCode>Class</InlineCode> 对象就是反射的<Text bold>入口</Text>，
      通过它可以拿到该类的所有元数据（构造方法、字段、方法等）。
    </Paragraph>
    <Callout type="tip" title="同一个类只有一个 Class 对象">
      无论通过哪种方式获取，同一个类在同一个 ClassLoader 下只对应<Text bold>唯一一个</Text> Class 对象。
      可以用 <InlineCode>==</InlineCode> 或比较 hashCode 验证这一点。
    </Callout>

    <Heading4>3.1 获取 Class 对象的三种方式</Heading4>
    <OrderedList>
      <ListItem>
        <Text bold>类名.class</Text>——编译期已知类型时使用，最简洁，不会触发静态初始化
      </ListItem>
      <ListItem>
        <Text bold>对象.getClass()</Text>——已经有一个对象实例时使用，返回该对象的运行时类型
      </ListItem>
      <ListItem>
        <Text bold>Class.forName("全限定类名")</Text>——类名来自字符串（配置文件等），是<Text bold>框架中最常用</Text>的方式，
        会触发类的静态初始化
      </ListItem>
    </OrderedList>

    <CodeBlock
      title="GetClassDemo.java — 三种方式获取同一个 Class 对象"
      code={`package com.example.reflection;

public class GetClassDemo {
    public static void main(String[] args) throws ClassNotFoundException {
        // 方式1：类名.class（编译期确定，不触发静态初始化）
        Class<String> c1 = String.class;

        // 方式2：对象.getClass()（已有实例时）
        String str = "Hello";
        Class<?> c2 = str.getClass();

        // 方式3：Class.forName("全限定类名")（运行时动态加载，框架常用）
        Class<?> c3 = Class.forName("java.lang.String");

        // 验证三者是同一个 Class 对象
        System.out.println("c1 == c2: " + (c1 == c2));        // true
        System.out.println("c2 == c3: " + (c2 == c3));        // true
        System.out.println("c1 hashCode: " + c1.hashCode());
        System.out.println("c2 hashCode: " + c2.hashCode());
        System.out.println("c3 hashCode: " + c3.hashCode());  // 三者相同
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`c1 == c2: true
c2 == c3: true
c1 hashCode: 1735600054
c2 hashCode: 1735600054
c3 hashCode: 1735600054`}
    />

    <Heading4>3.2 Class 对象的常用方法</Heading4>
    <Table
      head={['方法', '返回值', '说明']}
      rows={[
        ['getName()', 'String', '返回全限定类名，如 java.lang.String'],
        ['getSimpleName()', 'String', '返回简单类名，如 String'],
        ['getSuperclass()', 'Class<?>',  '返回直接父类的 Class 对象'],
        ['getInterfaces()', 'Class<?>[]', '返回直接实现的所有接口'],
        ['getPackage()', 'Package', '返回包信息'],
        ['getModifiers()', 'int', '返回修饰符掩码，用 Modifier.toString() 解析'],
        ['newInstance()', 'Object', '调用无参构造方法创建实例（已过时，建议用 getConstructor().newInstance()）'],
        ['isInterface()', 'boolean', '是否是接口'],
        ['isEnum()', 'boolean', '是否是枚举'],
        ['isArray()', 'boolean', '是否是数组类型'],
      ]}
    />

    <Heading3>4. 反射获取类信息完整示例</Heading3>
    <Paragraph>
      先定义一个带继承和接口的 <InlineCode>Student</InlineCode> 类，再用反射打印它的所有元信息：
    </Paragraph>
    <CodeBlock
      title="Student.java"
      code={`package com.example.reflection;

import java.io.Serializable;

public class Student extends Person implements Serializable, Comparable<Student> {
    private String name;
    private int age;

    public Student() {}
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge()     { return age; }

    @Override
    public int compareTo(Student other) {
        return Integer.compare(this.age, other.age);
    }
}

// Person.java（同包）
class Person {
    protected String id;
    public void breathe() { System.out.println("breathing..."); }
}`}
    />
    <CodeBlock
      title="ClassInfoDemo.java — 用反射打印 Student 的类信息"
      code={`package com.example.reflection;

import java.lang.reflect.Modifier;

public class ClassInfoDemo {
    public static void main(String[] args) throws ClassNotFoundException {
        // 获取 Class 对象（使用 forName 模拟框架从配置读取类名的场景）
        Class<?> clazz = Class.forName("com.example.reflection.Student");

        System.out.println("=== 基本信息 ===");
        System.out.println("全限定名:    " + clazz.getName());
        System.out.println("简单类名:    " + clazz.getSimpleName());
        System.out.println("包名:        " + clazz.getPackage().getName());
        System.out.println("修饰符:      " + Modifier.toString(clazz.getModifiers()));

        System.out.println("\\n=== 继承关系 ===");
        System.out.println("父类:        " + clazz.getSuperclass().getSimpleName());

        System.out.print("实现的接口:  ");
        for (Class<?> iface : clazz.getInterfaces()) {
            System.out.print(iface.getSimpleName() + "  ");
        }
        System.out.println();

        System.out.println("\\n=== 是否判断 ===");
        System.out.println("是接口?      " + clazz.isInterface());
        System.out.println("是枚举?      " + clazz.isEnum());
        System.out.println("是数组?      " + clazz.isArray());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`=== 基本信息 ===
全限定名:    com.example.reflection.Student
简单类名:    Student
包名:        com.example.reflection
修饰符:      public

=== 继承关系 ===
父类:        Person
实现的接口:  Serializable  Comparable

=== 是否判断 ===
是接口?      false
是枚举?      false
是数组?      false`}
    />

    <Callout type="tip" title="Class.forName() 会触发类的静态初始化">
      <Paragraph>
        调用 <InlineCode>Class.forName("完整类名")</InlineCode> 时，JVM 会加载该类并执行其
        <Text bold>静态代码块（static {}）</Text>。
        而 <InlineCode>类名.class</InlineCode> 不一定触发静态初始化（取决于 JVM 规范的「主动引用」规则）。
        如果你的类有静态初始化逻辑（如注册驱动：<InlineCode>Class.forName("com.mysql.cj.jdbc.Driver")</InlineCode>），
        必须用 forName 方式，不能用 <InlineCode>.class</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading3>5. 小结</Heading3>
    <Callout type="success" title="本节要点">
      <UnorderedList>
        <ListItem>反射让程序在<Text bold>运行时</Text>动态获取类信息、创建对象、调用方法，是框架开发的基础。</ListItem>
        <ListItem>反射的代价：<Text bold>性能开销</Text>和<Text bold>破坏封装</Text>；应用代码中尽量减少不必要的反射。</ListItem>
        <ListItem><InlineCode>Class</InlineCode> 对象是反射的入口，三种获取方式：<InlineCode>.class</InlineCode>、<InlineCode>getClass()</InlineCode>、<InlineCode>Class.forName()</InlineCode>。</ListItem>
        <ListItem>同一个类只有<Text bold>唯一一个</Text> Class 对象（同 ClassLoader 下）。</ListItem>
        <ListItem><InlineCode>Class.forName()</InlineCode> 会触发静态初始化，适合框架从配置文件动态加载类。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：概念判断"
      code={`判断下列说法是否正确：

① 同一个类在 JVM 中可以有多个 Class 对象（每个对象实例对应一个 Class 对象）。
② Class.forName("java.lang.String") 和 String.class 获取到的是同一个 Class 对象。
③ 调用 String.class 一定会触发 String 类的静态代码块执行。
④ 反射可以访问并修改 private 字段的值，因此 private 在反射面前毫无意义。`}
      answerCode={`① 错。同一个类在同一个 ClassLoader 中只对应唯一一个 Class 对象。
  不同 ClassLoader 加载同一个类会得到不同的 Class 对象，但这是高级场景。
  总之，对象实例可以有无数个，但 Class 对象只有一个。

② 正确。只要 ClassLoader 相同，无论哪种方式获取，结果都是同一个对象（== 比较为 true）。

③ 错。用 .class 语法获取 Class 对象属于「被动引用」，JVM 规范不要求触发静态初始化。
  Class.forName() 才一定会触发静态初始化（执行 static {} 块）。

④ 说法过于绝对。需要先调用 field.setAccessible(true) 才能绕过访问控制。
  另外，安全管理器（SecurityManager）可以禁止这种操作，框架中 private 仍然具有设计上的封装意义。`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习 2：三种方式对比"
      code={`下面三段代码分别用什么方式获取 Class 对象？各自适用于什么场景？

// 代码A
Class<Integer> ca = Integer.class;

// 代码B
Integer num = 42;
Class<?> cb = num.getClass();

// 代码C
Class<?> cc = Class.forName("java.lang.Integer");`}
      answerCode={`代码A：类名.class 语法
  适用场景：编译期就知道类型，写法最简洁，性能最好（不涉及字符串查找），
  常用于注解处理、泛型参数传递等。

代码B：对象.getClass()
  适用场景：已经有一个对象实例，想知道它的运行时类型（尤其是多态时），
  例如 "判断两个对象的运行时类型是否一致"。

代码C：Class.forName("全限定类名")
  适用场景：类名来自外部（配置文件、数据库、用户输入），运行前不知道类名，
  是框架开发（Spring、MyBatis、JDBC驱动加载）中最常用的方式。
  注意：会抛 ClassNotFoundException，需要处理。
  注意：会触发静态初始化（执行 static {} 块）。`}
    />

    <CodeBlock
      qa
      title="练习 3：编程题——打印任意类的基本信息"
      code={`// 编写方法 printClassInfo(String className)：
// 接收一个全限定类名字符串，用反射打印该类的：
//   - 简单类名
//   - 父类简单名（如果父类是 Object 则打印 "无自定义父类"）
//   - 实现的接口数量
// 在 main 中分别传入 "java.util.ArrayList" 和 "java.lang.Thread" 测试。

public class ClassInfoPrinter {
    public static void main(String[] args) {
        // TODO
    }
}`}
      answerCode={`import java.lang.reflect.Modifier;

public class ClassInfoPrinter {

    static void printClassInfo(String className) {
        try {
            Class<?> clazz = Class.forName(className);
            System.out.println("=== " + clazz.getSimpleName() + " ===");
            System.out.println("简单类名: " + clazz.getSimpleName());

            Class<?> superClass = clazz.getSuperclass();
            if (superClass == null || superClass == Object.class) {
                System.out.println("父类:     无自定义父类");
            } else {
                System.out.println("父类:     " + superClass.getSimpleName());
            }

            Class<?>[] ifaces = clazz.getInterfaces();
            System.out.println("接口数量: " + ifaces.length);
            System.out.println();
        } catch (ClassNotFoundException e) {
            System.out.println("找不到类: " + className);
        }
    }

    public static void main(String[] args) {
        printClassInfo("java.util.ArrayList");
        printClassInfo("java.lang.Thread");
    }
}

/* 控制台输出：
=== ArrayList ===
简单类名: ArrayList
父类:     AbstractList
接口数量: 4

=== Thread ===
简单类名: Thread
父类:     Object（输出"无自定义父类"）
接口数量: 2
*/`}
    />
  </article>
);

export default index;
