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
    <Title>序列化与Properties</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节介绍 Java IO 中两个重要的实用功能。
        第一部分讲<Text bold>对象序列化</Text>：如何将内存中的 Java 对象转为字节流持久化到文件，
        以及如何从文件反序列化还原对象，并介绍 <InlineCode>serialVersionUID</InlineCode> 和
        <InlineCode>transient</InlineCode> 关键字的作用。
        第二部分讲 <Text bold>Properties 类</Text>：Java 标准库中专门用于读写
        <InlineCode>.properties</InlineCode> 配置文件的工具类，是实际工程中配置管理的基础。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是序列化</Heading3>
    <Paragraph>
      程序运行时，对象存在于内存（堆）中，进程结束后对象就消失了。
      <Text bold>序列化（Serialization）</Text>是将 Java 对象转换为<Text bold>字节序列</Text>的过程，
      字节序列可以保存到磁盘文件、通过网络传输或存入数据库，实现对象的持久化与传输。
    </Paragraph>
    <Paragraph>
      <Text bold>反序列化（Deserialization）</Text>是逆向操作——将字节序列还原为 Java 对象。
    </Paragraph>
    <CodeBlock
      language="text"
      title="序列化与反序列化示意图"
      code={`序列化：Java 对象（内存）  →  ObjectOutputStream  →  字节流  →  文件/网络
反序列化：文件/网络  →  字节流  →  ObjectInputStream  →  Java 对象（内存）`}
    />

    <Heading3>2. 实现 Serializable 接口</Heading3>
    <Paragraph>
      要让一个类的对象可以被序列化，该类必须实现 <InlineCode>java.io.Serializable</InlineCode> 接口。
      该接口是一个<Text bold>标记接口（Marker Interface）</Text>——内部没有任何方法，
      仅起到「打标签」的作用，告诉 JVM 该类的对象允许序列化：
    </Paragraph>
    <CodeBlock
      title="Person.java"
      code={`import java.io.Serializable;

public class Person implements Serializable {
    // 强烈建议显式声明 serialVersionUID（见下节说明）
    private static final long serialVersionUID = 1L;

    private String name;
    private int    age;
    private transient String password; // transient：不参与序列化

    public Person(String name, int age, String password) {
        this.name     = name;
        this.age      = age;
        this.password = password;
    }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + ", password='" + password + "'}";
    }
}`}
    />

    <Heading3>3. serialVersionUID 的作用</Heading3>
    <Paragraph>
      <InlineCode>serialVersionUID</InlineCode> 是一个 <InlineCode>long</InlineCode> 类型的静态常量，
      代表该类的序列化<Text bold>版本号</Text>。
      序列化时，版本号会一起写入字节流；反序列化时，JVM 会比较字节流中的版本号与当前类的版本号：
    </Paragraph>
    <Table
      head={['场景', '结果']}
      rows={[
        ['版本号相同', '反序列化成功，对象还原'],
        ['版本号不同', '抛出 InvalidClassException，反序列化失败'],
      ]}
    />
    <Paragraph>
      如果不显式声明 <InlineCode>serialVersionUID</InlineCode>，JVM 会根据类结构自动计算一个。
      一旦类的字段或方法发生任何变化，自动计算的值就会改变，导致旧的序列化文件无法被新版本类反序列化。
    </Paragraph>
    <Callout type="warning" title="显式声明 serialVersionUID">
      在实际开发中，<Text bold>强烈建议</Text>在每个 Serializable 类中显式声明
      <InlineCode>private static final long serialVersionUID = 1L;</InlineCode>。
      这样即使后续给类新增了字段，只要版本号不变，旧的序列化文件仍可被反序列化（新增字段取默认值）。
    </Callout>

    <Heading3>4. transient 关键字</Heading3>
    <Paragraph>
      用 <InlineCode>transient</InlineCode> 修饰的字段<Text bold>不参与序列化</Text>。
      反序列化后，该字段会被赋为其类型的默认值（引用类型为 <InlineCode>null</InlineCode>，数值类型为 <InlineCode>0</InlineCode>）。
    </Paragraph>
    <Table
      head={['使用场景', '示例']}
      rows={[
        ['敏感信息（密码、密钥）', 'private transient String password;'],
        ['可由其他字段推算的冗余字段', 'private transient int cachedHashCode;'],
        ['不可序列化的对象（如 Logger）', 'private transient Logger logger;'],
        ['静态字段（static 本身就不序列化）', 'static 字段天然不序列化，不需要加 transient'],
      ]}
    />
    <Callout type="warning" title="static 字段不会被序列化">
      <InlineCode>static</InlineCode> 字段属于类，而不属于具体对象，因此<Text bold>不参与序列化</Text>。
      反序列化后，静态字段的值由当前 JVM 中该类的静态状态决定，
      与序列化时的值可能不同，开发时需特别注意。
    </Callout>

    <Heading3>5. ObjectOutputStream — 序列化到文件</Heading3>
    <Paragraph>
      <InlineCode>ObjectOutputStream</InlineCode> 继承自 <InlineCode>OutputStream</InlineCode>，
      核心方法是 <InlineCode>writeObject(Object obj)</InlineCode>，
      将传入的对象序列化并写入底层流。
    </Paragraph>
    <CodeBlock
      title="SerializeDemo.java"
      code={`import java.io.*;

public class SerializeDemo {
    public static void main(String[] args) {
        Person p = new Person("张三", 25, "secret123");
        System.out.println("序列化前：" + p);

        // 将 Person 对象序列化写入文件
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new FileOutputStream("person.dat"))) {
            oos.writeObject(p);
            System.out.println("序列化完成，已写入 person.dat");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`序列化前：Person{name='张三', age=25, password='secret123'}
序列化完成，已写入 person.dat`} />

    <Heading3>6. ObjectInputStream — 从文件反序列化</Heading3>
    <Paragraph>
      <InlineCode>ObjectInputStream</InlineCode> 的核心方法是
      <InlineCode>readObject()</InlineCode>，
      返回 <InlineCode>Object</InlineCode> 类型，需要强制类型转换：
    </Paragraph>
    <CodeBlock
      title="DeserializeDemo.java"
      code={`import java.io.*;

public class DeserializeDemo {
    public static void main(String[] args) {
        // 从文件反序列化还原 Person 对象
        try (ObjectInputStream ois = new ObjectInputStream(
                new FileInputStream("person.dat"))) {
            Person p = (Person) ois.readObject(); // 强转为 Person
            System.out.println("反序列化后：" + p);
            // 注意：password 被 transient 修饰，反序列化后为 null
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`反序列化后：Person{name='张三', age=25, password='null'}`} />
    <Paragraph>
      注意：<InlineCode>password</InlineCode> 字段被 <InlineCode>transient</InlineCode> 修饰，
      序列化时未写入，反序列化后恢复为引用类型默认值 <InlineCode>null</InlineCode>。
      <InlineCode>readObject()</InlineCode> 声明了两个受检异常：
      <InlineCode>IOException</InlineCode> 和 <InlineCode>ClassNotFoundException</InlineCode>，
      需要在 catch 中处理。
    </Paragraph>

    <Heading3>7. 序列化多个对象</Heading3>
    <Paragraph>
      一个文件中可以写入多个对象，反序列化时按写入顺序依次读取。
      也可以将多个对象先放入集合，再序列化整个集合（推荐，更简洁）：
    </Paragraph>
    <CodeBlock
      title="MultiObjectSerialization.java"
      code={`import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class MultiObjectSerialization {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        List<Person> persons = new ArrayList<>();
        persons.add(new Person("Alice", 28, "pwd1"));
        persons.add(new Person("Bob",   32, "pwd2"));
        persons.add(new Person("Carol", 26, "pwd3"));

        // 序列化整个 List
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new FileOutputStream("persons.dat"))) {
            oos.writeObject(persons);
        }

        // 反序列化整个 List
        try (ObjectInputStream ois = new ObjectInputStream(
                new FileInputStream("persons.dat"))) {
            @SuppressWarnings("unchecked")
            List<Person> restored = (List<Person>) ois.readObject();
            restored.forEach(p -> System.out.println(p));
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`Person{name='Alice', age=28, password='null'}
Person{name='Bob', age=32, password='null'}
Person{name='Carol', age=26, password='null'}`} />

    <Heading3>8. Properties 类概述</Heading3>
    <Paragraph>
      <InlineCode>java.util.Properties</InlineCode> 是 <InlineCode>Hashtable</InlineCode> 的子类，
      专门用于处理 <InlineCode>.properties</InlineCode> 格式的配置文件。
      该格式每行一条配置，形如 <InlineCode>key=value</InlineCode>，
      <InlineCode>#</InlineCode> 开头为注释行。
    </Paragraph>
    <CodeBlock
      language="text"
      title="db.properties 示例文件内容"
      code={`# 数据库连接配置
db.driver=com.mysql.cj.jdbc.Driver
db.url=jdbc:mysql://localhost:3306/mydb?useSSL=false
db.username=root
db.password=123456
db.poolSize=10`}
    />

    <Heading3>9. Properties 常用方法</Heading3>
    <Table
      head={['方法', '说明']}
      rows={[
        ['setProperty(String key, String value)', '添加或更新一个键值对'],
        ['getProperty(String key)', '根据键获取值，键不存在时返回 null'],
        ['getProperty(String key, String defaultValue)', '键不存在时返回 defaultValue'],
        ['load(InputStream inStream)', '从字节流（按 ISO-8859-1 编码）加载配置'],
        ['load(Reader reader)', '从字符流加载配置，可指定编码（推荐）'],
        ['store(OutputStream out, String comments)', '将配置写入字节流，comments 为注释头'],
        ['store(Writer writer, String comments)', '将配置写入字符流（推荐）'],
        ['stringPropertyNames()', '返回所有键的 Set<String>，可用于遍历'],
      ]}
    />

    <Heading3>10. 读取 .properties 配置文件</Heading3>
    <CodeBlock
      title="ReadProperties.java"
      code={`import java.io.*;
import java.util.Properties;

public class ReadProperties {
    public static void main(String[] args) {
        Properties props = new Properties();

        // 使用 InputStreamReader 指定 UTF-8 编码读取，防止中文值乱码
        try (Reader reader = new InputStreamReader(
                new FileInputStream("db.properties"), "UTF-8")) {
            props.load(reader);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 读取具体配置项
        String driver   = props.getProperty("db.driver");
        String url      = props.getProperty("db.url");
        String username = props.getProperty("db.username");
        String password = props.getProperty("db.password");
        // 读取不存在的键时提供默认值
        int poolSize = Integer.parseInt(props.getProperty("db.poolSize", "5"));

        System.out.println("驱动：" + driver);
        System.out.println("URL：" + url);
        System.out.println("用户名：" + username);
        System.out.println("密码：" + password);
        System.out.println("连接池大小：" + poolSize);

        System.out.println("\\n所有配置键：");
        for (String key : props.stringPropertyNames()) {
            System.out.println("  " + key + " = " + props.getProperty(key));
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`驱动：com.mysql.cj.jdbc.Driver
URL：jdbc:mysql://localhost:3306/mydb?useSSL=false
用户名：root
密码：123456
连接池大小：10

所有配置键：
  db.driver = com.mysql.cj.jdbc.Driver
  db.url = jdbc:mysql://localhost:3306/mydb?useSSL=false
  db.username = root
  db.password = 123456
  db.poolSize = 10`} />

    <Heading3>11. 写入 .properties 配置文件</Heading3>
    <CodeBlock
      title="WriteProperties.java"
      code={`import java.io.*;
import java.util.Properties;

public class WriteProperties {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.setProperty("app.name",    "MyApplication");
        props.setProperty("app.version", "2.0.1");
        props.setProperty("app.debug",   "false");
        props.setProperty("app.maxConn", "100");

        // 用 OutputStreamWriter 指定 UTF-8 编码写出，防止中文乱码
        try (Writer writer = new OutputStreamWriter(
                new FileOutputStream("app.properties"), "UTF-8")) {
            // store() 第二个参数是写在文件顶部的注释
            props.store(writer, "应用程序配置文件 - 由程序自动生成");
            System.out.println("配置文件写入完成！");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock language="text" title="生成的 app.properties 文件内容" code={`#应用程序配置文件 - 由程序自动生成
#Sat Jun 14 10:00:00 CST 2025
app.name=MyApplication
app.version=2.0.1
app.debug=false
app.maxConn=100`} />
    <Callout type="tip" title="store() 自动添加时间戳注释">
      <InlineCode>store()</InlineCode> 会在文件第一行写入你提供的注释（以 <InlineCode>#</InlineCode> 开头），
      第二行自动写入当前时间戳。这是 Java Properties 的标准行为，不必担心。
    </Callout>

    <Heading3>12. 实际应用场景</Heading3>
    <Paragraph>
      <InlineCode>.properties</InlineCode> 文件在 Java 生态中无处不在：
    </Paragraph>
    <Table
      head={['应用场景', '文件名', '说明']}
      rows={[
        ['Spring Boot 配置', 'application.properties', '数据库连接、端口、日志级别等所有配置集中管理'],
        ['国际化（i18n）', 'messages_zh_CN.properties', '多语言文字资源，key 相同，各语言文件独立'],
        ['JDBC 配置', 'db.properties', '数据库 URL、用户名、密码，与代码解耦'],
        ['日志配置', 'log4j.properties', '日志框架（Log4j）的输出级别、格式、目标配置'],
        ['Maven/Gradle 项目', 'gradle.properties', '构建工具的项目属性、仓库地址配置'],
      ]}
    />

    <Callout type="tip" title="实际项目中如何加载配置文件">
      在 Maven / Spring 项目中，<InlineCode>.properties</InlineCode> 文件通常放在
      <InlineCode>src/main/resources/</InlineCode> 目录下，打包后位于 classpath 根目录。
      可用类加载器读取：
      <br />
      <InlineCode>{'InputStream is = getClass().getClassLoader().getResourceAsStream("db.properties");'}</InlineCode>
      <br />
      这样无论项目部署在哪里，都能正确找到配置文件。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>序列化 = 对象 → 字节流；反序列化 = 字节流 → 对象；使用 <InlineCode>ObjectOutputStream.writeObject()</InlineCode> 和 <InlineCode>ObjectInputStream.readObject()</InlineCode>。</ListItem>
        <ListItem>可序列化的类必须实现 <InlineCode>Serializable</InlineCode> 标记接口，并显式声明 <InlineCode>serialVersionUID</InlineCode>。</ListItem>
        <ListItem><InlineCode>transient</InlineCode> 字段不参与序列化，反序列化后取默认值；<InlineCode>static</InlineCode> 字段同样不被序列化。</ListItem>
        <ListItem><InlineCode>Properties</InlineCode> 是处理 <InlineCode>.properties</InlineCode> 配置文件的专用类，继承自 <InlineCode>Hashtable</InlineCode>。</ListItem>
        <ListItem><InlineCode>load(Reader)</InlineCode> 读取配置，<InlineCode>store(Writer, comment)</InlineCode> 写入配置；推荐用字符流版本并指定 UTF-8 编码。</ListItem>
        <ListItem><InlineCode>getProperty(key, defaultValue)</InlineCode> 提供默认值，可防止 NPE。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>13. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：序列化概念题"
      code={`问：回答以下关于序列化的问题：

① 一个类若不实现 Serializable 接口，直接调用 writeObject() 会发生什么？
② serialVersionUID 不一致时，调用 readObject() 会抛出哪个异常？
③ 类 A 有一个字段 List<String> items，该 List 需要满足什么条件才能被序列化？
④ 下面代码有什么问题？

   public class Config implements Serializable {
       public static int version = 1;
       private String name;
   }

   序列化后修改 Config.version = 2，再反序列化，version 的值是多少？`}
      answerCode={`答案：

① 会抛出 java.io.NotSerializableException（"未序列化异常"）。
   JVM 检测到该类未实现 Serializable 接口，拒绝序列化并抛出异常。

② 抛出 java.io.InvalidClassException，错误信息类似：
   "local class incompatible: stream classdesc serialVersionUID = XXX,
    local class serialVersionUID = YYY"。

③ ArrayList 本身已实现 Serializable，满足条件。
   但 List 中存储的元素类型（这里是 String）也必须实现 Serializable。
   String 已实现 Serializable，所以 List<String> 可以序列化。
   若元素类型未实现 Serializable，序列化时会抛出 NotSerializableException。

④ 问题：static 字段不参与序列化，属于类而非对象。
   序列化时，Config.version=1 不会写入字节流。
   修改 Config.version=2 后反序列化，version 的值是当前 JVM 中的静态字段值，
   即 2（由代码修改决定），与序列化文件无关。
   这就是为什么 static 字段不应依赖序列化来保存状态。`}
    />

    <CodeBlock
      qa
      title="练习 2：完整序列化/反序列化练习"
      code={`// 定义一个 Student 类，包含以下字段：
//   - String name（姓名）
//   - int    grade（年级）
//   - transient double gpa（绩点，不序列化）
// 要求：
// 1. 创建两个 Student 对象，放入 ArrayList，序列化到 "students.dat"
// 2. 从 "students.dat" 反序列化，打印所有学生信息，观察 gpa 的值

import java.io.*;
import java.util.*;

// 补全 Student 类和 main 方法`}
      answerCode={`import java.io.*;
import java.util.*;

class Student implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    private int    grade;
    private transient double gpa; // transient：不参与序列化

    public Student(String name, int grade, double gpa) {
        this.name  = name;
        this.grade = grade;
        this.gpa   = gpa;
    }

    @Override
    public String toString() {
        return "Student{name='" + name + "', grade=" + grade + ", gpa=" + gpa + "}";
    }
}

public class StudentSerialize {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        List<Student> students = new ArrayList<>();
        students.add(new Student("张三", 2, 3.8));
        students.add(new Student("李四", 3, 3.5));

        // 序列化
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new FileOutputStream("students.dat"))) {
            oos.writeObject(students);
            System.out.println("序列化完成");
        }

        // 反序列化
        try (ObjectInputStream ois = new ObjectInputStream(
                new FileInputStream("students.dat"))) {
            @SuppressWarnings("unchecked")
            List<Student> restored = (List<Student>) ois.readObject();
            System.out.println("反序列化结果：");
            restored.forEach(System.out::println);
        }
    }
}

/*
控制台输出：
序列化完成
反序列化结果：
Student{name='张三', grade=2, gpa=0.0}
Student{name='李四', grade=3, gpa=0.0}

解析：gpa 被 transient 修饰，序列化时未写入，
      反序列化后 double 类型的默认值为 0.0。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：读写 Properties 配置文件"
      code={`// 编写程序完成以下任务：
// 1. 创建 Properties 对象，设置以下配置：
//    server.host = localhost
//    server.port = 8080
//    server.timeout = 30
// 2. 将配置写入 "server.properties" 文件，注释为 "服务器配置"
// 3. 重新读取 "server.properties"，获取 server.port 并打印（类型转为 int）
// 4. 获取不存在的键 "server.maxConn"，使用默认值 "100"

import java.io.*;
import java.util.Properties;

public class ServerConfig {
    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`import java.io.*;
import java.util.Properties;

public class ServerConfig {
    public static void main(String[] args) {
        // 第一步：创建并写入配置
        Properties writeProps = new Properties();
        writeProps.setProperty("server.host",    "localhost");
        writeProps.setProperty("server.port",    "8080");
        writeProps.setProperty("server.timeout", "30");

        try (Writer writer = new OutputStreamWriter(
                new FileOutputStream("server.properties"), "UTF-8")) {
            writeProps.store(writer, "服务器配置");
            System.out.println("配置已写入 server.properties");
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 第二步：重新读取配置
        Properties readProps = new Properties();
        try (Reader reader = new InputStreamReader(
                new FileInputStream("server.properties"), "UTF-8")) {
            readProps.load(reader);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 第三步：读取 server.port 并转为 int
        int port = Integer.parseInt(readProps.getProperty("server.port"));
        System.out.println("服务器端口：" + port);

        // 第四步：读取不存在的键，使用默认值
        String maxConn = readProps.getProperty("server.maxConn", "100");
        System.out.println("最大连接数（默认）：" + maxConn);

        System.out.println("\\n完整配置：");
        readProps.stringPropertyNames().stream().sorted().forEach(key ->
            System.out.println("  " + key + " = " + readProps.getProperty(key))
        );
    }
}

/*
控制台输出：
配置已写入 server.properties
服务器端口：8080
最大连接数（默认）：100

完整配置：
  server.host = localhost
  server.port = 8080
  server.timeout = 30

解析：
- setProperty/getProperty 处理的全是字符串，需要自行做类型转换（如 Integer.parseInt）。
- getProperty(key, defaultValue) 在键不存在时返回默认值，避免 null 导致的 NullPointerException。
- stringPropertyNames() 返回 Set<String>，结合 stream().sorted() 可按字母顺序打印所有配置项。
*/`}
    />
  </article>
);

export default index;
