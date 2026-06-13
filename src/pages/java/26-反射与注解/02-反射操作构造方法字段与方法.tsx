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
    <Title>反射操作构造方法、字段与方法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节学了如何获取 <InlineCode>Class</InlineCode> 对象。本节进入反射的核心操作：
        通过 <InlineCode>Class</InlineCode> 对象拿到<Text bold>构造方法（Constructor）</Text>、
        <Text bold>字段（Field）</Text>和<Text bold>方法（Method）</Text>，
        并在运行时动态创建对象、读写字段、调用方法——包括 <InlineCode>private</InlineCode> 成员。
        最后结合一个简化版 IoC 容器案例，展示反射在框架中的真实应用。
      </Paragraph>
    </Callout>

    <Heading3>1. 反射操作构造方法（Constructor）</Heading3>
    <Paragraph>
      获取 <InlineCode>Constructor</InlineCode> 对象后，调用 <InlineCode>newInstance()</InlineCode>
      来创建对象，等价于 <InlineCode>new 类名(参数)</InlineCode>。
    </Paragraph>

    <Table
      head={['方法', '说明']}
      rows={[
        ['getConstructors()', '获取所有 public 构造方法（包括父类继承的，但构造方法不继承，实际只返回本类 public 构造）'],
        ['getDeclaredConstructors()', '获取本类所有构造方法，包括 private/protected/default'],
        ['getConstructor(Class<?>... paramTypes)', '获取指定参数类型的 public 构造方法'],
        ['getDeclaredConstructor(Class<?>... paramTypes)', '获取指定参数类型的任意访问级别构造方法'],
        ['constructor.newInstance(Object... args)', '调用构造方法创建对象'],
        ['constructor.setAccessible(true)', '开启私有访问权限（访问 private 构造前必须调用）'],
      ]}
    />

    <Heading4>1.1 完整示例</Heading4>
    <CodeBlock
      title="Person.java"
      code={`package com.example.reflection;

public class Person {
    private String name;
    private int age;

    // public 构造方法
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // private 构造方法（单例模式常用）
    private Person() {
        this.name = "匿名";
        this.age  = 0;
    }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}`}
    />
    <CodeBlock
      title="ConstructorDemo.java"
      code={`package com.example.reflection;

import java.lang.reflect.Constructor;

public class ConstructorDemo {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("com.example.reflection.Person");

        // --- 调用 public 构造方法 ---
        Constructor<?> publicCtor = clazz.getConstructor(String.class, int.class);
        Object p1 = publicCtor.newInstance("张三", 20);
        System.out.println("public 构造: " + p1);

        // --- 调用 private 构造方法 ---
        Constructor<?> privateCtor = clazz.getDeclaredConstructor(); // 无参
        privateCtor.setAccessible(true);   // 关键：解除私有限制
        Object p2 = privateCtor.newInstance();
        System.out.println("private 构造: " + p2);

        // --- 打印所有构造方法 ---
        System.out.println("\\n所有构造方法：");
        for (Constructor<?> c : clazz.getDeclaredConstructors()) {
            System.out.println("  " + c);
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`public 构造: Person{name='张三', age=20}
private 构造: Person{name='匿名', age=0}

所有构造方法：
  public com.example.reflection.Person(java.lang.String,int)
  private com.example.reflection.Person()`}
    />

    <Heading3>2. 反射操作字段（Field）</Heading3>
    <Paragraph>
      通过 <InlineCode>Field</InlineCode> 对象可以在运行时读取和修改任意字段，
      包括 <InlineCode>private</InlineCode> 字段（搭配 <InlineCode>setAccessible(true)</InlineCode>）。
    </Paragraph>

    <Table
      head={['方法', '说明']}
      rows={[
        ['getFields()', '获取本类及父类所有 public 字段'],
        ['getDeclaredFields()', '获取本类所有字段（含 private），不含父类'],
        ['getField(String name)', '按名称获取 public 字段（含父类）'],
        ['getDeclaredField(String name)', '按名称获取本类任意字段'],
        ['field.get(Object obj)', '获取 obj 对象中该字段的值；静态字段传 null'],
        ['field.set(Object obj, Object value)', '设置 obj 对象中该字段的值'],
        ['field.getType()', '获取字段的类型（返回 Class<?>）'],
        ['field.getName()', '获取字段名称'],
        ['field.setAccessible(true)', '开启私有访问权限'],
      ]}
    />

    <Heading4>2.1 完整示例</Heading4>
    <CodeBlock
      title="FieldDemo.java — 读取并修改 private 字段"
      code={`package com.example.reflection;

import java.lang.reflect.Field;

public class FieldDemo {
    public static void main(String[] args) throws Exception {
        Person person = new Person("李四", 25);   // 用正常 new 创建对象
        Class<?> clazz = person.getClass();

        // --- 获取并读取 private name 字段 ---
        Field nameField = clazz.getDeclaredField("name");
        nameField.setAccessible(true);               // 解除私有限制
        String oldName = (String) nameField.get(person);
        System.out.println("原始 name: " + oldName);

        // --- 修改 private name 字段 ---
        nameField.set(person, "王五");
        System.out.println("修改后对象: " + person);

        // --- 遍历所有字段 ---
        System.out.println("\\n所有字段：");
        for (Field f : clazz.getDeclaredFields()) {
            f.setAccessible(true);
            System.out.printf("  %-10s = %s%n", f.getName(), f.get(person));
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`原始 name: 李四
修改后对象: Person{name='王五', age=25}

所有字段：
  name       = 王五
  age        = 25`}
    />

    <Heading3>3. 反射操作方法（Method）</Heading3>
    <Paragraph>
      通过 <InlineCode>Method</InlineCode> 对象可以动态调用任意方法，
      包括 <InlineCode>private</InlineCode> 方法和 <InlineCode>static</InlineCode> 方法。
    </Paragraph>

    <Table
      head={['方法', '说明']}
      rows={[
        ['getMethods()', '获取本类及父类所有 public 方法（含 Object 的方法）'],
        ['getDeclaredMethods()', '获取本类所有方法（含 private），不含父类'],
        ['getMethod(String name, Class<?>... paramTypes)', '按名称和参数类型获取 public 方法'],
        ['getDeclaredMethod(String name, Class<?>... paramTypes)', '获取本类任意方法'],
        ['method.invoke(Object obj, Object... args)', '调用 obj 对象的该方法；static 方法传 null'],
        ['method.setAccessible(true)', '开启私有访问权限'],
        ['method.getReturnType()', '获取返回值类型'],
        ['method.getParameterTypes()', '获取参数类型数组'],
        ['method.getName()', '获取方法名称'],
      ]}
    />

    <Heading4>3.1 完整示例——普通方法与 static 方法</Heading4>
    <CodeBlock
      title="Calculator.java"
      code={`package com.example.reflection;

public class Calculator {
    // 普通实例方法
    public int add(int a, int b) {
        return a + b;
    }

    // private 方法
    private String format(int result) {
        return "计算结果: " + result;
    }

    // static 方法
    public static double square(double x) {
        return x * x;
    }
}`}
    />
    <CodeBlock
      title="MethodDemo.java"
      code={`package com.example.reflection;

import java.lang.reflect.Method;

public class MethodDemo {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("com.example.reflection.Calculator");
        Object calc = clazz.getConstructor().newInstance();  // 创建实例

        // --- 调用 public 实例方法 add(int, int) ---
        Method addMethod = clazz.getMethod("add", int.class, int.class);
        int sum = (int) addMethod.invoke(calc, 3, 5);
        System.out.println("3 + 5 = " + sum);

        // --- 调用 private 方法 format(int) ---
        Method formatMethod = clazz.getDeclaredMethod("format", int.class);
        formatMethod.setAccessible(true);                   // 解除私有限制
        String msg = (String) formatMethod.invoke(calc, sum);
        System.out.println(msg);

        // --- 调用 static 方法 square(double) ---
        // static 方法：invoke 第一个参数传 null
        Method squareMethod = clazz.getMethod("square", double.class);
        double result = (double) squareMethod.invoke(null, 4.0);
        System.out.println("4.0 的平方: " + result);

        // --- 遍历打印所有方法名 ---
        System.out.println("\\n本类声明的所有方法：");
        for (Method m : clazz.getDeclaredMethods()) {
            System.out.println("  " + m.getName() + " 返回类型: " + m.getReturnType().getSimpleName());
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`3 + 5 = 8
计算结果: 8
4.0 的平方: 16.0

本类声明的所有方法：
  add 返回类型: int
  format 返回类型: String
  square 返回类型: double`}
    />

    <Heading3>4. 反射的实际应用：简化版 IoC 容器</Heading3>
    <Paragraph>
      Spring 等框架在启动时读取配置文件（或扫描注解），用反射创建对象并注入依赖。
      下面用一个极简示例展示这个思路：从「配置」（这里用 Map 模拟）读取类名，
      用反射创建对象并调用指定方法。
    </Paragraph>
    <CodeBlock
      title="SimpleIoC.java — 简化版 IoC 演示"
      code={`package com.example.reflection;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

// 模拟两个业务类
class UserService {
    public void save(String username) {
        System.out.println("[UserService] 保存用户: " + username);
    }
}

class OrderService {
    public void createOrder(String item) {
        System.out.println("[OrderService] 创建订单: " + item);
    }
}

public class SimpleIoC {

    // 模拟配置文件：key=别名, value=全限定类名
    static final Map<String, String> config = new HashMap<>();
    static {
        config.put("userService",  "com.example.reflection.UserService");
        config.put("orderService", "com.example.reflection.OrderService");
    }

    // 根据别名获取对象（简化版 getBean）
    static Object getBean(String name) throws Exception {
        String className = config.get(name);
        if (className == null) throw new IllegalArgumentException("未知 bean: " + name);
        Class<?> clazz = Class.forName(className);
        return clazz.getConstructor().newInstance();  // 调用无参构造
    }

    public static void main(String[] args) throws Exception {
        // 从"容器"中获取对象，调用方不需要 import 具体类
        Object userSvc  = getBean("userService");
        Object orderSvc = getBean("orderService");

        // 反射调用方法
        Method saveMethod = userSvc.getClass().getMethod("save", String.class);
        saveMethod.invoke(userSvc, "alice");

        Method orderMethod = orderSvc.getClass().getMethod("createOrder", String.class);
        orderMethod.invoke(orderSvc, "Java教程书");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`[UserService] 保存用户: alice
[OrderService] 创建订单: Java教程书`}
    />
    <Callout type="tip" title="这就是 Spring IoC 的核心思路">
      <Paragraph>
        Spring 的 <InlineCode>ApplicationContext.getBean("userService")</InlineCode> 底层就是类似的逻辑：
        读取 XML 或扫描 <InlineCode>@Component</InlineCode> 注解拿到类名，
        用 <InlineCode>Class.forName()</InlineCode> 加载，
        再用反射创建实例、注入依赖。理解了反射，就理解了框架的灵魂。
      </Paragraph>
    </Callout>

    <Callout type="warning" title="生产代码中缓存 Method/Field 对象">
      <Paragraph>
        每次调用 <InlineCode>getMethod()</InlineCode> / <InlineCode>getDeclaredField()</InlineCode>
        都有查找开销。如果一个方法会被高频反射调用（如框架每次处理请求都反射调用 handler），
        应将 <InlineCode>Method</InlineCode> / <InlineCode>Field</InlineCode> 对象<Text bold>缓存</Text>起来（存入 Map），
        只查找一次，后续复用，可大幅减少性能损耗。
      </Paragraph>
    </Callout>

    <Heading3>5. 小结</Heading3>
    <Callout type="success" title="本节要点">
      <UnorderedList>
        <ListItem>操作构造方法：<InlineCode>getDeclaredConstructor()</InlineCode> + <InlineCode>setAccessible(true)</InlineCode> + <InlineCode>newInstance()</InlineCode>。</ListItem>
        <ListItem>操作字段：<InlineCode>getDeclaredField(name)</InlineCode> + <InlineCode>setAccessible(true)</InlineCode> + <InlineCode>get/set(obj)</InlineCode>。</ListItem>
        <ListItem>操作方法：<InlineCode>getDeclaredMethod(name, paramTypes)</InlineCode> + <InlineCode>setAccessible(true)</InlineCode> + <InlineCode>invoke(obj, args)</InlineCode>。</ListItem>
        <ListItem>static 方法调用时 <InlineCode>invoke</InlineCode> 的第一个参数传 <InlineCode>null</InlineCode>。</ListItem>
        <ListItem><Text bold>getDeclared*</Text> 系列获取本类所有成员（含 private），<Text bold>get*</Text> 系列只获取 public。</ListItem>
        <ListItem>高频反射场景应<Text bold>缓存</Text> Method/Field 对象以减少性能开销。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：概念填空"
      code={`填写合适的方法名：

① 想获取本类声明的所有字段（包括 private），应调用 __________ 方法。
② 想访问 private 字段/方法前，必须先调用 __________ 方法解除限制。
③ 用反射调用 static 方法时，invoke() 的第一个参数应传 __________。
④ getDeclaredMethods() 与 getMethods() 的区别：
   - getDeclaredMethods()：__________
   - getMethods()：__________`}
      answerCode={`① getDeclaredFields()
   （getFields() 只返回 public 字段且包含父类，getDeclaredFields() 返回本类所有字段）

② setAccessible(true)
   （对 Field、Method、Constructor 都适用）

③ null
   （静态方法不需要对象实例，传 null 表示"没有目标对象"）

④ getDeclaredMethods()：获取本类所有访问级别的方法（含 private/protected），但不包含继承的方法
   getMethods()：获取本类及所有父类/接口的 public 方法（含 Object 的 toString、hashCode 等）`}
    />

    <CodeBlock
      qa
      title="练习 2：用反射遍历对象所有字段并打印"
      code={`// 编写通用方法 printFields(Object obj)：
// 用反射遍历 obj 所有本类字段（含 private），打印 "字段名 = 字段值"
// 用以下 Book 类测试：
//   Book book = new Book("Java编程思想", 129.0);
//   printFields(book);

class Book {
    private String title;
    private double price;
    private static int count = 0;   // static 字段也应打印

    public Book(String title, double price) {
        this.title = title;
        this.price = price;
        count++;
    }
}`}
      answerCode={`import java.lang.reflect.Field;
import java.lang.reflect.Modifier;

class Book {
    private String title;
    private double price;
    private static int count = 0;

    public Book(String title, double price) {
        this.title = title;
        this.price = price;
        count++;
    }
}

public class PrintFieldsDemo {

    static void printFields(Object obj) throws IllegalAccessException {
        Class<?> clazz = obj.getClass();
        System.out.println("=== " + clazz.getSimpleName() + " 字段列表 ===");
        for (Field f : clazz.getDeclaredFields()) {
            f.setAccessible(true);
            // static 字段 get() 传 null 也可以，但传 obj 同样有效
            Object value = f.get(obj);
            String modifier = Modifier.isStatic(f.getModifiers()) ? "[static] " : "";
            System.out.printf("  %s%s = %s%n", modifier, f.getName(), value);
        }
    }

    public static void main(String[] args) throws Exception {
        Book book = new Book("Java编程思想", 129.0);
        printFields(book);
    }
}

/* 控制台输出：
=== Book 字段列表 ===
  title = Java编程思想
  price = 129.0
  [static] count = 1
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：反射调用方法——动态执行"
      code={`// 有如下 StringUtils 工具类，要求：
// 不直接调用方法，通过反射根据方法名字符串动态调用。
// 具体：给定 methodName="toUpperCase", input="hello"，用反射调用并打印结果。
// 给定 methodName="repeat", input="ha", times=3，用反射调用并打印结果。

class StringUtils {
    public String toUpperCase(String s) {
        return s.toUpperCase();
    }

    public String repeat(String s, int times) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < times; i++) sb.append(s);
        return sb.toString();
    }
}

public class DynamicInvokeDemo {
    public static void main(String[] args) {
        // TODO：用反射调用
    }
}`}
      answerCode={`import java.lang.reflect.Method;

class StringUtils {
    public String toUpperCase(String s) {
        return s.toUpperCase();
    }

    public String repeat(String s, int times) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < times; i++) sb.append(s);
        return sb.toString();
    }
}

public class DynamicInvokeDemo {
    public static void main(String[] args) throws Exception {
        StringUtils util = new StringUtils();
        Class<?> clazz = util.getClass();

        // 动态调用 toUpperCase(String)
        String methodName1 = "toUpperCase";
        Method m1 = clazz.getMethod(methodName1, String.class);
        String result1 = (String) m1.invoke(util, "hello");
        System.out.println("toUpperCase(\"hello\") = " + result1);

        // 动态调用 repeat(String, int)
        String methodName2 = "repeat";
        Method m2 = clazz.getMethod(methodName2, String.class, int.class);
        String result2 = (String) m2.invoke(util, "ha", 3);
        System.out.println("repeat(\"ha\", 3) = " + result2);
    }
}

/* 控制台输出：
toUpperCase("hello") = HELLO
repeat("ha", 3) = hahaha

解析：invoke(obj, args...) 的参数列表对应方法签名，
      基本类型参数会自动装箱（int -> Integer），
      返回值类型要强转（Object -> String）。
*/`}
    />
  </article>
);

export default index;
