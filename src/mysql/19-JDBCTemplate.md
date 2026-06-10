# JDBCTemplate：Spring 对 JDBC 的封装

> **本章导读**
>
> 走到这里，我们已经掌握了原生 JDBC（第 16 章）、JDBC 事务（第 17 章）、连接池（第 18 章）。但你一定也感受到了：原生 JDBC 写一次查询要 `getConnection`、`prepareStatement`、`setXxx`、`executeQuery`、`while(rs.next())`、`close`……**一大堆重复的样板代码，真正的业务逻辑只有一两行**。
>
> Spring 框架提供了 **JDBCTemplate（JDBC 模板）**，把这些样板全部包办，让你**一行代码完成一次增删改查**。本章讲透：
> 1. JDBCTemplate 是什么、需要哪些 jar、怎么创建它；
> 2. 用 `update()` 执行增删改；
> 3. 用 `queryForMap` / `queryForList` / `query` / `queryForObject` 执行各种查询，把结果自动封装成 Map、List、JavaBean。
>
> 它是本套 MySQL 教程的收官，也是通往 MyBatis、Spring Data 等持久层框架的桥梁。本章沿用 `db_learn` 的 `user` 表，并直接复用第 18 章封装好的连接池工具类 `JDBCUtils`。

---

## 〇、准备工作

```sql
CREATE TABLE user (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(32),
  password VARCHAR(32)
);
INSERT INTO user (username, password) VALUES ('zhangsan','123'),('lisi','456');
```

对应的 JavaBean（字段名建议与列名对应，方便自动封装）：

```java
public class User {
    private Integer id;
    private String username;
    private String password;
    // 必须有无参构造 + 所有字段的 getter/setter（自动封装靠 setter）
    // ... getter/setter 省略 ...
    @Override public String toString() {
        return "User{id=" + id + ", username='" + username + "', password='" + password + "'}";
    }
}
```

---

## 一、JDBCTemplate 介绍

**JDBCTemplate** 是 **Spring 框架**对 JDBC 的轻量封装。它替你完成了：获取/释放连接、创建 `PreparedStatement`、设置参数、遍历 `ResultSet`、异常转换……你只需关心「SQL + 参数 + 结果怎么封装」。

**需要的 jar**（核心 4 个 + 连接池 + 驱动）：

- `spring-core`、`spring-beans`、`spring-jdbc`、`spring-tx`（Spring 的核心、bean、jdbc、事务）；
- 还有 `commons-logging`（Spring 依赖的日志）；
- 连接池 jar（如 `druid`）和 MySQL 驱动 jar。

> 💡 JDBCTemplate 不自己管理连接，而是**依赖一个 `DataSource`（连接池）**来取连接——这正是第 18 章我们在 `JDBCUtils` 里留出 `getDataSource()` 的原因，现在派上用场。

---

## 二、快速入门

```java
import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcTemplateDemo {
    public static void main(String[] args) {
        // 用第18章连接池工具类提供的 DataSource 创建 JdbcTemplate
        JdbcTemplate template = new JdbcTemplate(JDBCUtils.getDataSource());

        // 一行搞定一次更新！
        String sql = "UPDATE user SET password = '888' WHERE id = 1";
        int count = template.update(sql);
        System.out.println("受影响行数：" + count);
    }
}
```

对比第 16 章那一大段 try-catch-finally，是不是清爽到不可思议？这就是模板的价值。

> 💡 实际项目里 `JdbcTemplate` 对象通常只创建一次（交给 Spring 容器管理为单例），这里为演示直接 `new`。

---

## 三、执行 DML：update() 方法

`update(String sql, Object... args)` 用于 **增、删、改**，返回受影响的行数。`?` 占位符的值依次作为后面的可变参数传入（**底层就是 PreparedStatement，天然防注入**）。

```java
JdbcTemplate template = new JdbcTemplate(JDBCUtils.getDataSource());

// 增
String insert = "INSERT INTO user (username, password) VALUES (?, ?)";
int c1 = template.update(insert, "wangwu", "789");   // ? 依次 = wangwu, 789

// 改
String update = "UPDATE user SET password = ? WHERE username = ?";
int c2 = template.update(update, "000", "zhangsan");

// 删
String delete = "DELETE FROM user WHERE id = ?";
int c3 = template.update(delete, 4);

System.out.println(c1 + ", " + c2 + ", " + c3);
```

> 💡 占位符参数直接跟在 SQL 后面按顺序写，不用再 `ps.setString(1, ...)`，模板替你做了。

---

## 四、执行 DQL：各种查询方法

JDBCTemplate 的查询方法很多，按「**返回什么形态**」选用，这是本章的重点。

### 4.1 queryForMap：查询单行，封装成 Map

把一行的「列名 → 值」封装成一个 `Map`。

```java
// 查 id=1 的用户
String sql = "SELECT * FROM user WHERE id = ?";
Map<String, Object> map = template.queryForMap(sql, 1);
System.out.println(map);
// 输出：{id=1, username=zhangsan, password=888}
```

> ⚠️ `queryForMap` 要求结果**有且仅有一行**：查出 0 行或多行都会抛异常（`IncorrectResultSizeDataAccessException`）。

### 4.2 queryForList：查询多行，封装成 List<Map>

每一行是一个 Map，多行组成 List。

```java
String sql = "SELECT * FROM user";
List<Map<String, Object>> list = template.queryForList(sql);
for (Map<String, Object> row : list) {
    System.out.println(row);
}
// {id=1, username=zhangsan, password=888}
// {id=2, username=lisi, password=456}
// ...
```

`queryForList` 不限定行数，0 行返回空 List，适合「不关心封装成对象、只要原始数据」的场景。

### 4.3 query + BeanPropertyRowMapper：查询多行，封装成 List<JavaBean>

**这是实战最常用的查询方式**：把每一行自动封装成一个 JavaBean 对象。

```java
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import java.util.List;

String sql = "SELECT * FROM user";
List<User> users = template.query(sql, new BeanPropertyRowMapper<>(User.class));
for (User u : users) {
    System.out.println(u);
}
// User{id=1, username='zhangsan', password='888'}
// User{id=2, username='lisi', password='456'}
```

`BeanPropertyRowMapper<>(User.class)` 会自动把**列名对应到 JavaBean 的属性**（调用 setter）。

> ⚠️ **列名要能对应上属性名**：列 `username` ↔ 属性 `username`。若数据库用下划线命名（如 `user_name`）而 Java 用驼峰（`userName`），默认对应不上，要么给 SQL 列起别名（`SELECT user_name AS userName`），要么用支持驼峰映射的配置。
>
> ⚠️ JavaBean **必须有无参构造方法**（封装时先 `new` 再 set），否则报错。

带条件查询同样支持：

```java
String sql = "SELECT * FROM user WHERE password = ?";
List<User> list = template.query(sql, new BeanPropertyRowMapper<>(User.class), "456");
```

### 4.4 queryForObject：查询单个值 / 单个对象

**用法一：查询聚合结果等单个值**

```java
// 查总记录数（COUNT 返回一个值）
String sql = "SELECT COUNT(*) FROM user";
Long total = template.queryForObject(sql, Long.class);   // 指定返回类型
System.out.println("共 " + total + " 条");
```

**用法二：查询单个对象（结果恰好一行）**

```java
String sql = "SELECT * FROM user WHERE id = ?";
User u = template.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), 1);
System.out.println(u);   // User{id=1, ...}
```

> ⚠️ 和 `queryForMap` 一样，`queryForObject` 要求结果**正好一行**，0 行或多行都抛异常。查可能为空的情况，建议用 `query(...)` 拿 List 再判断是否为空，更安全。

### 4.5 方法速查表

| 方法 | 用途 | 返回 |
|------|------|------|
| `update(sql, args...)` | 增 / 删 / 改 | `int` 影响行数 |
| `queryForMap(sql, args...)` | 查询**单行** | `Map<String,Object>`（列名→值） |
| `queryForList(sql, args...)` | 查询**多行** | `List<Map<String,Object>>` |
| `query(sql, rowMapper, args...)` | 查询**多行→对象** | `List<JavaBean>` |
| `queryForObject(sql, 类型/rowMapper, args...)` | 查询**单个值/单个对象** | 单个值或单个 JavaBean |

---

## 五、综合示例：一个简单的 UserDao

把 JDBCTemplate 用在标准的 DAO（数据访问对象）里，这就是工程中持久层的雏形：

```java
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

public class UserDao {
    // 整个应用共用一个 template（依赖第18章的连接池）
    private final JdbcTemplate template = new JdbcTemplate(JDBCUtils.getDataSource());

    /** 查询所有用户 */
    public List<User> findAll() {
        return template.query("SELECT * FROM user",
                new BeanPropertyRowMapper<>(User.class));
    }

    /** 按 id 查询单个用户 */
    public User findById(int id) {
        List<User> list = template.query("SELECT * FROM user WHERE id = ?",
                new BeanPropertyRowMapper<>(User.class), id);
        return list.isEmpty() ? null : list.get(0);   // 比 queryForObject 更安全
    }

    /** 新增用户，返回是否成功 */
    public boolean add(User u) {
        int c = template.update("INSERT INTO user (username, password) VALUES (?, ?)",
                u.getUsername(), u.getPassword());
        return c > 0;
    }

    /** 统计用户总数 */
    public long count() {
        return template.queryForObject("SELECT COUNT(*) FROM user", Long.class);
    }
}
```

对比第 16 章原生 JDBC 的同等功能，代码量减少了一大半，且没有一处需要手动 `close`——这正是 JDBCTemplate 的意义。

---

## 六、本章小结

- **JDBCTemplate** 是 Spring 对 JDBC 的封装，免去连接管理、`PreparedStatement`、`ResultSet` 遍历、资源释放等样板代码。
- **创建**：`new JdbcTemplate(dataSource)`，依赖一个连接池（`DataSource`）——复用第 18 章 `JDBCUtils.getDataSource()`。
- **增删改**：`update(sql, 参数...)`，返回影响行数，底层用 PreparedStatement 防注入。
- **查询**（按返回形态选）：
  - `queryForMap` → 单行 Map；
  - `queryForList` → 多行 List<Map>；
  - `query(sql, new BeanPropertyRowMapper<>(Bean.class), 参数...)` → 多行 List<Bean>（**最常用**）；
  - `queryForObject` → 单个值（如 COUNT）或单个对象。
- **注意**：`queryForMap`/`queryForObject` 要求结果正好一行；`BeanPropertyRowMapper` 要求列名与属性名对应、Bean 有无参构造。

### 常见易错问答

1. **问：`query` 和 `queryForObject` 怎么选？**
   答：返回多行用 `query`（得 List）；明确只有一行（或一个聚合值）用 `queryForObject`。不确定行数、可能为空时用 `query` 更安全。
2. **问：列名是下划线、属性是驼峰，封装为 null 怎么办？**
   答：`BeanPropertyRowMapper` 默认按名匹配。给 SQL 列起驼峰别名（`SELECT user_name AS userName`），或使用支持驼峰下划线转换的映射器。
3. **问：JDBCTemplate 还要手动管理连接和事务吗？**
   答：连接由它配合连接池自动取还，不用手动 close；事务可继续用第 17 章方式，但更优雅的是配合 Spring 的声明式事务 `@Transactional`，这是后续框架学习的内容。

---

> 🎉 **全套 MySQL 教程到此结束！** 从「数据库是什么」一路走到「用 Spring JDBCTemplate 优雅地操作数据库」，你已经完整走通了 **数据库设计 → SQL 操作 → 事务/权限 → Java 程序访问数据库 → 连接池 → 框架封装** 的全链路。下一步可以进入 MyBatis、Spring、Spring Boot 的持久层学习，它们都站在你现在掌握的这些基础之上。
