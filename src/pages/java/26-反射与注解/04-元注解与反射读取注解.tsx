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
    <Title>元注解与反射读取注解</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节定义了自定义注解，但还无法被反射读取。本节解决这个问题：
        先学<Text bold>元注解</Text>（修饰注解的注解），特别是
        <InlineCode>@Retention(RUNTIME)</InlineCode> 使注解保留到运行时；
        再学用反射 API 读取类、方法、字段上的注解；
        最后用一个完整的<Text bold>简易 ORM 框架雏形</Text>案例把注解+反射串起来，
        理解 MyBatis/Hibernate 等框架的核心机制。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是元注解</Heading3>
    <Paragraph>
      <Text bold>元注解</Text>就是「用来修饰注解的注解」——它们定义了自定义注解的行为规则，
      例如：这个注解能贴在哪里？保留多久？JDK 提供了四个元注解，全部在
      <InlineCode>java.lang.annotation</InlineCode> 包中。
    </Paragraph>

    <Heading3>2. 四个元注解详解</Heading3>
    <Table
      head={['元注解', '作用', '常用取值']}
      rows={[
        ['@Retention', '控制注解的生命周期（保留到哪个阶段）', 'SOURCE / CLASS / RUNTIME'],
        ['@Target', '限制注解可以贴在哪些程序元素上', 'TYPE / METHOD / FIELD / CONSTRUCTOR / PARAMETER 等'],
        ['@Documented', '注解是否出现在 Javadoc 文档中', '无属性，有此注解即生效'],
        ['@Inherited', '类上的注解是否被子类自动继承', '无属性，有此注解即生效（只对类注解有效）'],
      ]}
    />

    <Heading4>2.1 @Retention — 最重要的元注解</Heading4>
    <Table
      head={['RetentionPolicy 值', '含义', '典型用途']}
      rows={[
        ['SOURCE', '仅保留在源码中，编译时丢弃', '@Override、@SuppressWarnings（只给编译器看）'],
        ['CLASS', '保留在 .class 字节码中，但运行时不可见（默认值）', '字节码分析工具（如 ASM）'],
        ['RUNTIME', '保留到运行时，可通过反射读取', 'Spring、JUnit、MyBatis 等框架注解必须用此级别'],
      ]}
    />
    <Callout type="warning" title="只有 RUNTIME 才能被反射读取">
      <Paragraph>
        这是自定义注解最容易踩的坑：忘加 <InlineCode>@Retention(RetentionPolicy.RUNTIME)</InlineCode>，
        导致运行时反射读到 <InlineCode>null</InlineCode>。
        只要你的注解需要在运行时被框架或自己的代码读取，<Text bold>必须加上这个元注解</Text>。
      </Paragraph>
    </Callout>

    <Heading4>2.2 @Target — 限制注解的使用位置</Heading4>
    <Table
      head={['ElementType 值', '可以贴的位置']}
      rows={[
        ['TYPE', '类、接口、枚举、注解类型'],
        ['METHOD', '方法'],
        ['FIELD', '字段（包括枚举常量）'],
        ['CONSTRUCTOR', '构造方法'],
        ['PARAMETER', '方法参数'],
        ['LOCAL_VARIABLE', '局部变量'],
        ['ANNOTATION_TYPE', '注解类型（即给注解的注解，元注解用此）'],
        ['PACKAGE', '包（在 package-info.java 中使用）'],
      ]}
    />
    <Paragraph>
      <InlineCode>@Target</InlineCode> 可以同时指定多个位置：
      <InlineCode>@Target({`{ElementType.TYPE, ElementType.METHOD}`})</InlineCode>。
    </Paragraph>

    <Heading4>2.3 @Documented 与 @Inherited</Heading4>
    <UnorderedList>
      <ListItem>
        <Text bold>@Documented</Text>：加了此元注解后，目标注解会出现在 Javadoc 生成的文档中。
        例如 <InlineCode>@Override</InlineCode> 没加 @Documented（人们通常不需要在文档里看到它），
        而 <InlineCode>@Deprecated</InlineCode> 加了（需要在文档里提示 API 已过时）。
      </ListItem>
      <ListItem>
        <Text bold>@Inherited</Text>：加了此元注解后，父类上的注解会被子类<Text bold>自动继承</Text>。
        注意：只对<Text bold>类注解</Text>有效，方法/字段注解不会自动继承。
      </ListItem>
    </UnorderedList>

    <Heading3>3. 完整自定义注解示例（带全部元注解）</Heading3>
    <Paragraph>
      定义两个注解，模拟 ORM 框架（如 MyBatis Plus / JPA）中的表映射注解：
    </Paragraph>
    <CodeBlock
      title="TableName.java — 映射数据库表名"
      code={`package com.example.orm;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)   // 运行时可被反射读取
@Target(ElementType.TYPE)             // 只能贴在类上
@Documented                           // 出现在 Javadoc 中
public @interface TableName {
    String value();   // 数据库表名，使用时可省略属性名
}`}
    />
    <CodeBlock
      title="Column.java — 映射字段到数据库列"
      code={`package com.example.orm;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)   // 必须 RUNTIME 才能反射读取
@Target(ElementType.FIELD)            // 只能贴在字段上
@Documented
public @interface Column {
    String name() default "";         // 列名（空则使用字段名）
    String type() default "VARCHAR";  // 数据库类型
    int length() default 255;         // 长度
    boolean nullable() default true;  // 是否允许 NULL
}`}
    />
    <CodeBlock
      title="User.java — 使用 @TableName 和 @Column"
      code={`package com.example.orm;

@TableName("t_user")   // 映射到数据库表 t_user
public class User {

    @Column(name = "user_id", type = "BIGINT", nullable = false)
    private Long id;

    @Column(name = "user_name", type = "VARCHAR", length = 50, nullable = false)
    private String username;

    @Column(name = "user_age", type = "INT")
    private Integer age;

    @Column(name = "email", length = 100)
    private String email;

    // 没有 @Column 的字段——不映射到数据库
    private transient String tempData;

    // getters/setters 省略
    public User() {}
    public User(Long id, String username, Integer age, String email) {
        this.id       = id;
        this.username = username;
        this.age      = age;
        this.email    = email;
    }
    public Long getId()       { return id; }
    public String getUsername(){ return username; }
    public Integer getAge()   { return age; }
    public String getEmail()  { return email; }
}`}
    />

    <Heading3>4. 用反射读取注解</Heading3>
    <Paragraph>
      <InlineCode>AnnotatedElement</InlineCode> 接口（Class、Method、Field、Constructor 都实现了它）
      提供了统一的注解读取 API：
    </Paragraph>
    <Table
      head={['方法', '说明']}
      rows={[
        ['getAnnotation(Class<A> annotationType)', '获取指定类型的注解，不存在则返回 null'],
        ['getAnnotations()', '获取所有注解（含继承）'],
        ['getDeclaredAnnotations()', '获取直接声明的注解（不含继承）'],
        ['isAnnotationPresent(Class<A> annotationType)', '判断是否有某个注解，返回 boolean'],
      ]}
    />

    <Heading4>4.1 读取类上的注解</Heading4>
    <CodeBlock
      title="ReadAnnotationDemo.java — 读取 @TableName"
      code={`package com.example.orm;

public class ReadAnnotationDemo {
    public static void main(String[] args) {
        Class<?> clazz = User.class;

        // 读取类上的 @TableName 注解
        if (clazz.isAnnotationPresent(TableName.class)) {
            TableName tableAnno = clazz.getAnnotation(TableName.class);
            System.out.println("映射的表名: " + tableAnno.value());
        } else {
            System.out.println("该类没有 @TableName 注解");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`映射的表名: t_user`} />

    <Heading4>4.2 读取字段上的注解</Heading4>
    <CodeBlock
      title="ReadFieldAnnotations.java"
      code={`package com.example.orm;

import java.lang.reflect.Field;

public class ReadFieldAnnotations {
    public static void main(String[] args) {
        Class<?> clazz = User.class;
        System.out.println("字段注解信息：");

        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(Column.class)) {
                Column col = field.getAnnotation(Column.class);
                String colName = col.name().isEmpty() ? field.getName() : col.name();
                System.out.printf("  字段 %-12s -> 列名=%-12s 类型=%-8s 长度=%d nullable=%b%n",
                    field.getName(), colName, col.type(), col.length(), col.nullable());
            } else {
                System.out.printf("  字段 %-12s -> [无 @Column 注解，不映射]%n", field.getName());
            }
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`字段注解信息：
  字段 id           -> 列名=user_id      类型=BIGINT   长度=255 nullable=false
  字段 username     -> 列名=user_name    类型=VARCHAR  长度=50  nullable=false
  字段 age          -> 列名=user_age     类型=INT      长度=255 nullable=true
  字段 email        -> 列名=email        类型=VARCHAR  长度=100 nullable=true
  字段 tempData     -> [无 @Column 注解，不映射]`}
    />

    <Heading3>5. 实战案例：简易 ORM 框架雏形</Heading3>
    <Paragraph>
      结合 <InlineCode>@TableName</InlineCode> 和 <InlineCode>@Column</InlineCode>，
      用反射实现一个能根据对象自动<Text bold>生成 INSERT SQL 语句</Text>的工具类——
      这就是 MyBatis Plus / JPA 等 ORM 框架最核心的功能雏形。
    </Paragraph>
    <CodeBlock
      title="OrmUtils.java — 反射读注解生成 SQL"
      code={`package com.example.orm;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class OrmUtils {

    /**
     * 根据对象自动生成 INSERT SQL（基于 @TableName 和 @Column 注解）
     */
    public static String buildInsertSql(Object obj) throws Exception {
        Class<?> clazz = obj.getClass();

        // 1. 读取表名
        if (!clazz.isAnnotationPresent(TableName.class)) {
            throw new IllegalArgumentException(clazz.getSimpleName() + " 没有 @TableName 注解");
        }
        String tableName = clazz.getAnnotation(TableName.class).value();

        // 2. 遍历字段，收集有 @Column 注解的字段和值
        List<String> columns = new ArrayList<>();
        List<String> values  = new ArrayList<>();

        for (Field field : clazz.getDeclaredFields()) {
            if (!field.isAnnotationPresent(Column.class)) continue;

            Column col     = field.getAnnotation(Column.class);
            String colName = col.name().isEmpty() ? field.getName() : col.name();

            field.setAccessible(true);
            Object value = field.get(obj);
            if (value == null) continue;   // null 值跳过

            columns.add(colName);
            // String 类型加引号，数字不加
            if (value instanceof String) {
                values.add("'" + value + "'");
            } else {
                values.add(String.valueOf(value));
            }
        }

        // 3. 拼接 SQL
        return "INSERT INTO " + tableName
            + " (" + String.join(", ", columns) + ")"
            + " VALUES (" + String.join(", ", values) + ");";
    }

    /**
     * 根据类生成 CREATE TABLE 语句（简化版）
     */
    public static String buildCreateTableSql(Class<?> clazz) {
        if (!clazz.isAnnotationPresent(TableName.class)) {
            throw new IllegalArgumentException(clazz.getSimpleName() + " 没有 @TableName 注解");
        }
        String tableName = clazz.getAnnotation(TableName.class).value();

        StringBuilder sb = new StringBuilder("CREATE TABLE " + tableName + " (\n");
        boolean first = true;
        for (Field field : clazz.getDeclaredFields()) {
            if (!field.isAnnotationPresent(Column.class)) continue;
            Column col     = field.getAnnotation(Column.class);
            String colName = col.name().isEmpty() ? field.getName() : col.name();
            String colDef  = "  " + colName + " " + col.type();
            if (col.type().equals("VARCHAR")) colDef += "(" + col.length() + ")";
            if (!col.nullable())              colDef += " NOT NULL";
            if (!first) sb.append(",\n");
            sb.append(colDef);
            first = false;
        }
        sb.append("\n);");
        return sb.toString();
    }
}`}
    />
    <CodeBlock
      title="OrmDemo.java — 测试 OrmUtils"
      code={`package com.example.orm;

public class OrmDemo {
    public static void main(String[] args) throws Exception {
        User user = new User(1001L, "alice", 28, "alice@example.com");

        // 生成 INSERT SQL
        String insertSql = OrmUtils.buildInsertSql(user);
        System.out.println("=== INSERT SQL ===");
        System.out.println(insertSql);

        // 生成 CREATE TABLE SQL
        System.out.println("\\n=== CREATE TABLE SQL ===");
        System.out.println(OrmUtils.buildCreateTableSql(User.class));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`=== INSERT SQL ===
INSERT INTO t_user (user_id, user_name, user_age, email) VALUES (1001, 'alice', 28, 'alice@example.com');

=== CREATE TABLE SQL ===
CREATE TABLE t_user (
  user_id BIGINT NOT NULL,
  user_name VARCHAR(50) NOT NULL,
  user_age INT,
  email VARCHAR(100)
);`}
    />

    <Callout type="success" title="注解 + 反射是现代 Java 框架的核心机制">
      <Paragraph>
        这个 ORM 雏形展示了 <Text bold>Spring/MyBatis/Hibernate 共同的核心思路</Text>：
        开发者在类/字段/方法上贴注解声明意图，
        框架在运行时用反射读取这些注解，自动完成 SQL 生成、依赖注入、AOP 织入等工作。
        理解了「注解描述意图 + 反射读取并执行」这个模式，就理解了现代 Java 框架 80% 的底层原理。
      </Paragraph>
    </Callout>

    <Heading3>6. 小结</Heading3>
    <Callout type="success" title="本节要点">
      <UnorderedList>
        <ListItem>四个元注解：<InlineCode>@Retention</InlineCode>（生命周期）、<InlineCode>@Target</InlineCode>（使用位置）、<InlineCode>@Documented</InlineCode>（Javadoc）、<InlineCode>@Inherited</InlineCode>（子类继承）。</ListItem>
        <ListItem><Text bold>最关键</Text>：要让反射读取注解，必须加 <InlineCode>@Retention(RetentionPolicy.RUNTIME)</InlineCode>。</ListItem>
        <ListItem>读取注解的 API：<InlineCode>isAnnotationPresent()</InlineCode> 判断存在，<InlineCode>getAnnotation()</InlineCode> 获取注解对象，再访问属性。</ListItem>
        <ListItem>Class、Field、Method、Constructor 都可以读取其上的注解（都实现了 AnnotatedElement 接口）。</ListItem>
        <ListItem>注解 + 反射 = 现代 Java 框架的核心机制，ORM / IoC / AOP 都基于此。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：元注解知识判断"
      code={`判断下列说法是否正确：

① @Retention(RetentionPolicy.CLASS) 是注解的默认保留策略，所以不写 @Retention 时注解可以被反射读取。
② @Target(ElementType.METHOD) 标注的注解可以贴在类上也可以贴在方法上。
③ @Inherited 可以使父类方法上的注解被子类自动继承。
④ 如果注解加了 @Documented，则使用该注解的类/方法在 Javadoc 中会显示该注解信息。`}
      answerCode={`① 错。RetentionPolicy.CLASS 是默认策略，注解保留在字节码中但运行时不可见，
  反射读取会返回 null。要能被反射读取必须用 RUNTIME。

② 错。@Target(ElementType.METHOD) 只允许贴在方法上，贴在类上会编译报错。
  要同时允许贴在类和方法上，需要写 @Target({ElementType.TYPE, ElementType.METHOD})。

③ 错。@Inherited 只对类注解有效——父类上的注解可被子类继承。
  方法上的注解不受 @Inherited 影响（即使子类继承父类方法，注解也不会自动出现在子类的视角中）。

④ 正确。@Documented 的作用就是让注解出现在 Javadoc 生成的文档里，
  告诉文档读者"这个 API 使用了某个注解"。`}
    />

    <CodeBlock
      qa
      title="练习 2：补全元注解定义"
      code={`// 下面是一个用于权限校验的注解 @RequireRole，
// 要求：① 运行时可被反射读取 ② 只能贴在方法上 ③ 属性 roles 是 String 数组，默认为空数组
// 请补全缺少的元注解和属性定义。

// TODO: 补全元注解
public @interface RequireRole {
    // TODO: 补全属性
}

// 然后将其应用到 AdminController 的 deleteUser 方法上，角色为 "ADMIN" 和 "SUPER_ADMIN"
public class AdminController {
    public void deleteUser(Long userId) { }
}`}
      answerCode={`import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)   // 必须：运行时可被反射读取
@Target(ElementType.METHOD)           // 只能贴在方法上
public @interface RequireRole {
    String[] roles() default {};       // String 数组，默认空数组
}

// 使用注解
public class AdminController {

    @RequireRole(roles = {"ADMIN", "SUPER_ADMIN"})
    public void deleteUser(Long userId) {
        System.out.println("删除用户: " + userId);
    }
}

// 补充：用反射读取该注解的示例
import java.lang.reflect.Method;

public class PermissionChecker {
    public static void checkPermission(Object controller, String methodName,
                                       String currentRole) throws Exception {
        Method method = controller.getClass().getMethod(methodName, Long.class);
        if (method.isAnnotationPresent(RequireRole.class)) {
            RequireRole anno = method.getAnnotation(RequireRole.class);
            for (String role : anno.roles()) {
                if (role.equals(currentRole)) return;  // 有权限
            }
            throw new SecurityException("权限不足，需要角色: " + java.util.Arrays.toString(anno.roles()));
        }
    }
}`}
    />

    <CodeBlock
      qa
      title="练习 3：扩展 ORM 工具——生成 SELECT 语句"
      code={`// 基于本节的 @TableName 和 @Column 注解（确保都有 @Retention(RUNTIME)），
// 编写方法 buildSelectByIdSql(Class<?> clazz, Object idValue)：
// 1. 找到有 @Column 且列名含 "_id" 或字段名为 "id" 的字段作为主键列
// 2. 生成 "SELECT * FROM 表名 WHERE 主键列名 = 值" 格式的 SQL
// 用 User.class 和 id=1001 测试，期望输出：
// SELECT * FROM t_user WHERE user_id = 1001

public class OrmSelectDemo {
    public static void main(String[] args) {
        // TODO
    }
}`}
      answerCode={`import java.lang.reflect.Field;

public class OrmSelectDemo {

    static String buildSelectByIdSql(Class<?> clazz, Object idValue) {
        if (!clazz.isAnnotationPresent(TableName.class)) {
            throw new IllegalArgumentException(clazz.getSimpleName() + " 缺少 @TableName");
        }
        String tableName = clazz.getAnnotation(TableName.class).value();

        // 找主键字段：字段名为 "id" 或 @Column 的 name 包含 "_id"
        for (Field field : clazz.getDeclaredFields()) {
            if (!field.isAnnotationPresent(Column.class)) continue;

            Column col     = field.getAnnotation(Column.class);
            String colName = col.name().isEmpty() ? field.getName() : col.name();

            boolean isId = field.getName().equals("id") || colName.endsWith("_id");
            if (isId) {
                String valueStr = (idValue instanceof String)
                    ? "'" + idValue + "'"
                    : String.valueOf(idValue);
                return "SELECT * FROM " + tableName + " WHERE " + colName + " = " + valueStr + ";";
            }
        }
        throw new IllegalStateException("找不到主键字段（字段名 id 或列名以 _id 结尾）");
    }

    public static void main(String[] args) {
        String sql = buildSelectByIdSql(User.class, 1001L);
        System.out.println(sql);
        // 输出: SELECT * FROM t_user WHERE user_id = 1001;
    }
}

/* 解析：
   1. 先从 @TableName 拿表名。
   2. 遍历字段，找满足主键条件的字段（这里用简单规则：字段名=id 或列名以_id结尾）。
   3. 拼接 SQL，String 值加引号，数字不加。
   这正是 MyBatis-Plus、JPA 中 findById() 底层的简化版逻辑。
*/`}
    />
  </article>
);

export default index;
