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
    <Title>注解概述与自定义注解</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>注解（Annotation）</Text>是 JDK5 引入的一种给代码附加<Text bold>元数据</Text>的机制。
        它像是贴在代码上的「标签」，可以被编译器、工具或运行时框架读取，从而触发某些行为。
        Spring 的 <InlineCode>@Controller</InlineCode>、MyBatis 的 <InlineCode>@Select</InlineCode>、
        Lombok 的 <InlineCode>@Data</InlineCode> 都是注解的实际应用。
        本节先理解注解的概念、内置注解，再学习如何定义自己的注解。
      </Paragraph>
    </Callout>

    <Heading3>1. 注解 vs 注释</Heading3>
    <Table
      head={['维度', '注释（Comment）', '注解（Annotation）']}
      rows={[
        ['语法', '// 单行  /** 多行 */', '@注解名(属性=值)'],
        ['读取者', '给人类程序员阅读', '给编译器、工具、运行时框架读取'],
        ['编译后', '完全丢弃，不进入字节码', '可选择保留在字节码中，甚至保留到运行时'],
        ['作用', '解释代码意图', '触发编译检查、代码生成、运行时行为'],
        ['典型用途', '解释业务逻辑', '@Override 检查重写、@Test 标记测试方法'],
      ]}
    />
    <Paragraph>
      简单记住：<Text bold>注释给人看，注解给程序看</Text>。
    </Paragraph>

    <Heading3>2. Java 内置常用注解</Heading3>
    <Paragraph>
      JDK 自带了几个最常见的注解，用于和编译器交互：
    </Paragraph>

    <Heading4>2.1 @Override</Heading4>
    <Paragraph>
      告诉编译器「这个方法是重写父类/接口的方法」。如果拼写错误导致实际上没有重写，
      编译器会报错，起到<Text bold>静态检查</Text>的作用。
    </Paragraph>
    <CodeBlock
      title="OverrideDemo.java"
      code={`public class Animal {
    public void speak() {
        System.out.println("...");
    }
}

public class Dog extends Animal {
    @Override
    public void speak() {             // 正确：确实重写了父类方法
        System.out.println("汪汪！");
    }

    // @Override
    // public void Speak() {}         // 编译错误！方法名大写，不是重写
}`}
    />

    <Heading4>2.2 @Deprecated</Heading4>
    <Paragraph>
      标记某个类/方法/字段已<Text bold>过时</Text>，不建议使用。
      调用过时 API 时，IDE 会显示删除线，编译器会产生警告。
    </Paragraph>
    <CodeBlock
      title="DeprecatedDemo.java"
      code={`public class OldApi {
    /**
     * @deprecated 请使用 {@link #newMethod()} 代替
     */
    @Deprecated
    public void oldMethod() {
        System.out.println("旧方法，即将移除");
    }

    public void newMethod() {
        System.out.println("新方法");
    }
}

public class UseOldApi {
    public static void main(String[] args) {
        OldApi api = new OldApi();
        api.oldMethod();   // IDE 显示删除线，编译器警告：deprecated
        api.newMethod();   // 正常调用
    }
}`}
    />

    <Heading4>2.3 @SuppressWarnings</Heading4>
    <Paragraph>
      抑制指定类型的编译警告，避免警告干扰重要信息。常用值：
      <InlineCode>"unchecked"</InlineCode>（泛型未检查）、
      <InlineCode>"deprecation"</InlineCode>（使用了过时API）、
      <InlineCode>"all"</InlineCode>（抑制所有警告）。
    </Paragraph>
    <CodeBlock
      title="SuppressDemo.java"
      code={`import java.util.ArrayList;
import java.util.List;

public class SuppressDemo {
    @SuppressWarnings("unchecked")   // 抑制泛型未检查警告
    public static void main(String[] args) {
        // 原始类型 List（没有泛型），正常会有"unchecked"警告
        List list = new ArrayList();
        list.add("item1");
        System.out.println(list.get(0));
    }
}`}
    />

    <Heading4>2.4 @FunctionalInterface</Heading4>
    <Paragraph>
      标记一个接口是<Text bold>函数式接口</Text>（只能有一个抽象方法）。
      如果接口有两个抽象方法，编译器会报错。配合 Lambda 表达式使用。
    </Paragraph>
    <CodeBlock
      title="FunctionalInterfaceDemo.java"
      code={`@FunctionalInterface
public interface Transformer {
    String transform(String input);  // 只有一个抽象方法，合法

    // String anotherMethod(String s);  // 取消注释会编译报错
}

public class Demo {
    public static void main(String[] args) {
        // 可以用 Lambda 实现
        Transformer upper = s -> s.toUpperCase();
        System.out.println(upper.transform("hello"));  // HELLO
    }
}`}
    />

    <Heading3>3. 自定义注解</Heading3>
    <Paragraph>
      使用 <InlineCode>@interface</InlineCode> 关键字定义注解，语法类似接口，
      但注解里声明的「方法」实际上是注解的<Text bold>属性（元素）</Text>。
    </Paragraph>

    <Heading4>3.1 注解属性的类型限制</Heading4>
    <Paragraph>
      注解属性的类型只能是以下几种（否则编译报错）：
    </Paragraph>
    <UnorderedList>
      <ListItem>基本数据类型：<InlineCode>int</InlineCode>、<InlineCode>double</InlineCode> 等（不含包装类）</ListItem>
      <ListItem><InlineCode>String</InlineCode></ListItem>
      <ListItem><InlineCode>Class</InlineCode>（或带泛型的 <InlineCode>Class&lt;?&gt;</InlineCode>）</ListItem>
      <ListItem>枚举类型</ListItem>
      <ListItem>另一个注解类型</ListItem>
      <ListItem>以上类型的<Text bold>一维数组</Text>（如 <InlineCode>String[]</InlineCode>）</ListItem>
    </UnorderedList>

    <Heading4>3.2 default 默认值</Heading4>
    <Paragraph>
      注解属性可以用 <InlineCode>default</InlineCode> 指定默认值，
      使用时如果该属性有默认值则可以省略。
    </Paragraph>

    <Heading4>3.3 value() 属性的特殊地位</Heading4>
    <Paragraph>
      如果注解只有一个属性且名称为 <InlineCode>value</InlineCode>，
      使用时可以<Text bold>省略属性名</Text>，直接写值：
      <InlineCode>@MyAnno("内容")</InlineCode> 等价于 <InlineCode>@MyAnno(value = "内容")</InlineCode>。
    </Paragraph>

    <Heading4>3.4 完整自定义注解示例</Heading4>
    <CodeBlock
      title="MyAnnotation.java — 定义自定义注解"
      code={`package com.example.annotation;

// 自定义注解：描述一个"作者信息"
public @interface MyAnnotation {
    // 属性：name，无默认值，使用时必须提供
    String name();

    // 属性：age，有默认值 0，使用时可省略
    int age() default 0;

    // 特殊属性 value，使用时可省略属性名
    String value() default "";

    // 数组属性：tags
    String[] tags() default {};
}`}
    />
    <CodeBlock
      title="UseAnnotation.java — 在类/方法/字段上使用自定义注解"
      code={`package com.example.annotation;

// 在类上使用注解（提供所有必填属性）
@MyAnnotation(name = "张三", age = 25, value = "这是一个用户类", tags = {"entity", "user"})
public class UserClass {

    // 在字段上使用注解（age 省略，tags 省略）
    @MyAnnotation(name = "userId")
    private Long id;

    // 在字段上使用注解，value 属性可省略属性名
    @MyAnnotation(name = "用户名", value = "存储用户真实姓名")
    private String username;

    // 在方法上使用注解
    @MyAnnotation(name = "保存方法", tags = {"crud", "write"})
    public void save() {
        System.out.println("保存用户...");
    }
}`}
    />

    <Heading4>3.5 注解属性是数组时的写法</Heading4>
    <CodeBlock
      title="数组属性的两种写法"
      code={`// 数组只有一个元素时，可以省略花括号
@MyAnnotation(name = "test", tags = "single")

// 多个元素时必须用花括号
@MyAnnotation(name = "test", tags = {"first", "second", "third"})`}
    />

    <Heading3>4. 注解保留策略预告</Heading3>
    <Paragraph>
      自定义注解默认只保留到<Text bold>字节码</Text>级别（CLASS 级），
      不会保留到运行时，因此无法被反射读取。
      要让反射能读取注解，必须用 <InlineCode>@Retention(RetentionPolicy.RUNTIME)</InlineCode>
      元注解来声明——这将在下一节详细讲解。
    </Paragraph>
    <Callout type="tip" title="为什么现在用反射读不到注解？">
      <Paragraph>
        如果你现在就尝试用反射读取上面定义的 <InlineCode>@MyAnnotation</InlineCode>，
        会发现返回 <InlineCode>null</InlineCode>。原因是没有加 <InlineCode>@Retention(RUNTIME)</InlineCode> 元注解，
        注解信息在编译后的 .class 文件加载时就被丢弃了。下一节会解决这个问题。
      </Paragraph>
    </Callout>

    <Heading3>5. 实际开发中注解的三大用途</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>替代 XML 配置</Text>：Spring 的 <InlineCode>@Component</InlineCode>、
        <InlineCode>@Autowired</InlineCode>、<InlineCode>@RequestMapping</InlineCode> 等，
        用注解直接在代码上声明，比 XML 更简洁直观
      </ListItem>
      <ListItem>
        <Text bold>代码生成（编译期处理）</Text>：Lombok 的 <InlineCode>@Data</InlineCode>、
        <InlineCode>@Builder</InlineCode> 在编译期生成 getter/setter/构造方法，
        减少样板代码
      </ListItem>
      <ListItem>
        <Text bold>标记与切面</Text>：自定义注解 + AOP，在方法执行前后插入日志、权限检查、
        事务等横切逻辑（如 <InlineCode>@Transactional</InlineCode>）
      </ListItem>
    </UnorderedList>

    <Heading3>6. 小结</Heading3>
    <Callout type="success" title="本节要点">
      <UnorderedList>
        <ListItem>注解是给程序读取的元数据，用 <InlineCode>@interface</InlineCode> 定义。</ListItem>
        <ListItem>四个常用内置注解：<InlineCode>@Override</InlineCode>（检查重写）、<InlineCode>@Deprecated</InlineCode>（标记过时）、<InlineCode>@SuppressWarnings</InlineCode>（抑制警告）、<InlineCode>@FunctionalInterface</InlineCode>（函数式接口检查）。</ListItem>
        <ListItem>注解属性类型限制：基本类型、String、Class、枚举、注解，及其一维数组。</ListItem>
        <ListItem>属性名为 <InlineCode>value</InlineCode> 且只有一个属性时，使用时可省略属性名。</ListItem>
        <ListItem>要让反射能读取注解，需要加 <InlineCode>@Retention(RUNTIME)</InlineCode>（下节详讲）。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：判断注解属性类型是否合法"
      code={`下列自定义注解中，哪些属性类型是合法的？哪些不合法？说明原因。

public @interface MyAnno {
    int count();            // A
    Integer level();        // B
    String name();          // C
    double[] scores();      // D
    Object data();          // E
    Class<?> target();      // F
    Thread.State state();   // G（Thread.State 是枚举）
    List<String> items();   // H
}`}
      answerCode={`A. int count()      — 合法。基本类型 int 是允许的。
B. Integer level()  — 不合法。包装类 Integer 不是基本类型，注解不允许使用包装类。
C. String name()    — 合法。String 是明确允许的类型。
D. double[] scores() — 合法。基本类型的一维数组是允许的。
E. Object data()    — 不合法。Object 既不是基本类型、String、Class、枚举，也不是注解类型。
F. Class<?> target() — 合法。Class 类型（含泛型变体）是允许的。
G. Thread.State state() — 合法。Thread.State 是枚举类型，枚举类型允许作为注解属性。
H. List<String> items() — 不合法。集合类型（List/Map 等）不在允许的类型列表中。

记忆口诀：基本类型 + String + Class + 枚举 + 注解 + 它们的一维数组，共六类。`}
    />

    <CodeBlock
      qa
      title="练习 2：定义并使用注解"
      code={`// 定义一个注解 @ApiDoc，用于描述接口文档信息，属性如下：
//   - summary: 接口摘要（String，无默认值）
//   - version: 版本号（String，默认值 "1.0"）
//   - deprecated: 是否废弃（boolean，默认 false）
//   - tags: 标签数组（String[]，默认空数组）
// 然后将其应用到以下 UserController 的两个方法上：
//   - getUser：摘要="获取用户", tags={"user","query"}
//   - deleteUser：摘要="删除用户"，deprecated=true, version="0.9"

public class UserController {
    public void getUser(Long id) { }
    public void deleteUser(Long id) { }
}`}
      answerCode={`// 定义注解
public @interface ApiDoc {
    String summary();                      // 无默认值，必须提供
    String version() default "1.0";
    boolean deprecated() default false;
    String[] tags() default {};
}

// 使用注解
public class UserController {

    @ApiDoc(summary = "获取用户", tags = {"user", "query"})
    public void getUser(Long id) {
        // version 默认 "1.0", deprecated 默认 false
    }

    @ApiDoc(summary = "删除用户", deprecated = true, version = "0.9")
    public void deleteUser(Long id) {
        // tags 默认空数组
    }
}

// 说明：
// getUser 省略了 version 和 deprecated（有默认值可以省略）。
// deleteUser 省略了 tags（有默认值可以省略）。
// summary 没有默认值，两个方法都必须提供，否则编译报错。`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习 3：注解的 value 属性特殊规则"
      code={`下面哪些注解用法是等价的？哪些会编译报错？

// 注解定义
public @interface Tag {
    String value();
    String description() default "";
}

// 用法 A
@Tag("important")

// 用法 B
@Tag(value = "important")

// 用法 C
@Tag(value = "important", description = "核心功能")

// 用法 D
@Tag("important", description = "核心功能")

// 用法 E
@Tag(description = "核心功能")`}
      answerCode={`A 和 B 等价：都只传 value="important"，其他属性用默认值。
  A 的省略写法成立，因为只传一个值且属性名为 value。

C 合法：显式写出两个属性名 = 值，没问题。

D 编译报错：一旦有多个属性需要指定（即使有一个是 value），
  就不能再省略属性名了，必须写成 @Tag(value = "important", description = "核心功能")。
  简单记：只要有两个或以上属性需要赋值，所有属性名都必须显式写出。

E 编译报错：value 没有默认值，必须提供，这里只提供了 description，value 缺失，编译不通过。

总结：value 省略属性名的规则——
  ① 只传一个值 且 ② 该属性名恰好是 value，两个条件同时满足才能省略。`}
    />
  </article>
);

export default index;
