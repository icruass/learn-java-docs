# JDBC 核心详解：概念、六步入门、各核心类与增删改查实战

> **本章导读**
>
> 前面 15 章我们都在数据库客户端里手敲 SQL。但实际项目里，是 **Java 程序自动去操作数据库**：用户在网页上点「注册」，后台 Java 代码就要把这条数据 `INSERT` 进 MySQL。**Java 程序怎么连上数据库、发送 SQL、拿回结果？** 靠的就是 **JDBC**。
>
> JDBC 是 Java 工程师的必经之路，本章要彻底讲清：
> 1. JDBC 到底是什么（一套**接口规范** + 厂商**驱动实现**）；
> 2. 操作数据库的**固定六步骤**，给出第一个能跑的完整程序；
> 3. 五个核心类/接口逐个拆解：`DriverManager`、`Connection`、`Statement`、`PreparedStatement`、`ResultSet`；
> 4. 用它们完成**增删改查**实战；
> 5. **SQL 注入**漏洞演示与 `PreparedStatement` 的解决；
> 6. 把样板代码封装成 **JDBC 工具类**，并完成一个**登录案例**。
>
> 本章是「MySQL」与「Java」的交汇点，后续连接池、JDBCTemplate、乃至 MyBatis/Spring 全部建立在它之上。示例统一操作 `db_learn` 库的 `user` 表。

---

## 〇、准备示例表

```sql
CREATE TABLE user (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(32),
  password VARCHAR(32)
);
INSERT INTO user (username, password) VALUES ('zhangsan','123'), ('lisi','456');
```

---

## 一、JDBC 是什么

**JDBC（Java DataBase Connectivity，Java 数据库连接）** 是 Sun 公司（Java 官方）定义的一套**操作所有关系型数据库的规则（接口）**。

关键理解它的「接口 + 实现」设计：

- **Sun 只定义接口**（`Connection`、`Statement`、`ResultSet` 等都在 `java.sql` 包里，是 interface），它本身不知道怎么连 MySQL，也不知道怎么连 Oracle。
- **各数据库厂商提供实现类**，打包成 `.jar`，叫做**数据库驱动（Driver）**。MySQL 的驱动就是 `mysql-connector-j-x.x.x.jar`。

```
你的 Java 代码  ——只依赖——>  JDBC 接口(java.sql.*)
                                    ↑ 实现
                          MySQL驱动jar / Oracle驱动jar / ...
```

> 💡 **这是「面向接口编程」的经典范例**：你的代码只调用 JDBC 接口，将来从 MySQL 换成 Oracle，**Java 代码几乎不用改**，只要换一个驱动 jar、改一下连接 URL 即可。这就是接口规范的价值。

**使用前提**：把 MySQL 驱动 jar 导入项目（IDEA 里把 jar 放到 `lib` 目录并 Add as Library，或用 Maven 引入依赖）。

---

## 二、快速入门：固定六步骤

下面是用 JDBC 查询 `user` 表的完整可运行程序，**JDBC 操作永远是这几步**：

```java
import java.sql.*;

public class JdbcDemo {
    public static void main(String[] args) throws Exception {
        // 1. 注册驱动（告诉程序用哪个数据库的驱动）
        Class.forName("com.mysql.cj.jdbc.Driver");

        // 2. 获取数据库连接对象 Connection
        String url  = "jdbc:mysql://localhost:3306/db_learn?useSSL=false&serverTimezone=UTC";
        String user = "root";
        String pwd  = "your_password";
        Connection conn = DriverManager.getConnection(url, user, pwd);

        // 3. 定义 SQL
        String sql = "SELECT * FROM user";

        // 4. 获取执行 SQL 的对象 Statement
        Statement stmt = conn.createStatement();

        // 5. 执行 SQL，接收返回结果
        ResultSet rs = stmt.executeQuery(sql);

        // 6. 处理结果：遍历结果集
        while (rs.next()) {
            int id = rs.getInt("id");
            String name = rs.getString("username");
            System.out.println(id + " : " + name);
        }

        // 7. 释放资源（先开后关，倒序关闭）
        rs.close();
        stmt.close();
        conn.close();
    }
}
```

记住这条主线：**注册驱动 → 获取连接 → 定义SQL → 获取执行对象 → 执行 → 处理结果 → 释放资源**。后面所有内容都是对这七步里某个类的展开。

---

## 三、DriverManager：驱动管理类

`DriverManager` 干两件事：**注册驱动** 和 **获取连接**。

### 3.1 注册驱动

```java
Class.forName("com.mysql.cj.jdbc.Driver");
```

为什么一句 `Class.forName` 就注册好了？看 MySQL 驱动类 `com.mysql.cj.jdbc.Driver` 的源码：

```java
public class Driver implements java.sql.Driver {
    static {                              // 静态代码块，类被加载时自动执行
        DriverManager.registerDriver(new Driver());   // 它自己就把自己注册了
    }
}
```

`Class.forName("...Driver")` 会触发这个类被加载，从而执行静态块完成注册。所以**我们只需 `Class.forName`，不必手动 `registerDriver`**。

> 💡 **MySQL 5 与 8 驱动类名不同**：
> - MySQL 5.x：`com.mysql.jdbc.Driver`
> - MySQL 8.x：`com.mysql.cj.jdbc.Driver`（多了 `.cj`）
>
> 💡 从 JDBC 4.0 起支持 **SPI 自动加载**，jar 包的 `META-INF/services` 里已声明驱动，连 `Class.forName` 都可省略。但**为了代码可读、习惯，仍建议写上**。

### 3.2 获取连接 getConnection

```java
Connection conn = DriverManager.getConnection(url, user, password);
```

重点是 **URL 的格式**，这是新手最易出错的地方：

```
jdbc:mysql://ip地址:端口号/数据库名?参数1=值1&参数2=值2
```

| 部分 | 说明 |
|------|------|
| `jdbc:mysql://` | 协议固定，表示用 JDBC 连 MySQL |
| `localhost:3306` | 数据库服务器 IP 和端口（默认 3306） |
| `/db_learn` | 要连接的数据库名 |
| `?useSSL=false` | 关闭 SSL 警告 |
| `&serverTimezone=UTC` | 指定时区（MySQL 8 不写会报时区错误！） |
| `&characterEncoding=utf8` | 字符编码，防中文乱码 |

```java
// 完整示例
String url = "jdbc:mysql://localhost:3306/db_learn"
           + "?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8";

// 连本机默认库时可简写（仅本机 3306 时）
String url2 = "jdbc:mysql:///db_learn?serverTimezone=UTC";
```

> 🕳️ **MySQL 8 不写 `serverTimezone` 会直接抛异常**：`The server time zone value '...' is unrecognized`。务必带上时区参数。

---

## 四、Connection：数据库连接对象

`Connection` 代表「一条到数据库的连接」，主要提供两类能力：

**① 获取执行 SQL 的对象：**

```java
Statement stmt = conn.createStatement();                 // 普通执行对象
PreparedStatement ps = conn.prepareStatement(sql);       // 预编译执行对象（推荐）
```

**② 管理事务（详见第 17 章，这里先认识 API）：**

```java
conn.setAutoCommit(false);   // 关闭自动提交 = 开启事务
conn.commit();               // 提交事务
conn.rollback();             // 回滚事务
```

---

## 五、Statement：执行 SQL 的对象

`Statement` 有两个核心方法，**用哪个取决于 SQL 类型**：

| 方法 | 用于 | 返回值 |
|------|------|--------|
| `int executeUpdate(sql)` | DML（INSERT/UPDATE/DELETE）和 DDL | 受影响的行数 |
| `ResultSet executeQuery(sql)` | DQL（SELECT） | 结果集 ResultSet |

### 5.1 executeUpdate 实战：增、删、改

```java
Statement stmt = conn.createStatement();

// 增
int c1 = stmt.executeUpdate(
    "INSERT INTO user (username, password) VALUES ('wangwu','789')");
System.out.println(c1 > 0 ? "添加成功" : "添加失败");   // 影响行数 > 0 即成功

// 改
int c2 = stmt.executeUpdate(
    "UPDATE user SET password='000' WHERE username='zhangsan'");

// 删
int c3 = stmt.executeUpdate("DELETE FROM user WHERE id=3");
```

> 💡 **判断成功的标准**：`executeUpdate` 返回「受影响行数」，`> 0` 就表示操作生效。DDL 语句（如 `CREATE TABLE`）也用 `executeUpdate`，但返回 0（DDL 不影响行）。

---

## 六、SQL 注入与 PreparedStatement

### 6.1 用 Statement 拼字符串的致命漏洞

设想一个登录功能，用 `Statement` 把用户输入拼进 SQL：

```java
String name = "随便填";
String pwd  = "a' OR '1'='1";    // ← 恶意输入
String sql = "SELECT * FROM user WHERE username='" + name
           + "' AND password='" + pwd + "'";
// 拼出来的 SQL 变成：
// SELECT * FROM user WHERE username='随便填' AND password='a' OR '1'='1'
```

`OR '1'='1'` 恒为真，**不需要正确密码就能登录成功**！这就是臭名昭著的 **SQL 注入**——用户输入「篡改」了 SQL 的逻辑。

### 6.2 解决方案：PreparedStatement 预编译

`PreparedStatement` 用 `?` 作占位符，把 SQL 的「结构」和「数据」分开：SQL 先发给数据库**预编译**好结构，用户输入只作为「纯数据」填进 `?`，**永远不会被当成 SQL 语法执行**。

```java
// SQL 用 ? 占位，结构固定
String sql = "SELECT * FROM user WHERE username = ? AND password = ?";
PreparedStatement ps = conn.prepareStatement(sql);

// 给占位符赋值（索引从 1 开始）
ps.setString(1, name);   // 第1个? = name
ps.setString(2, pwd);    // 第2个? = pwd（哪怕是 a' OR '1'='1 也只当普通字符串）

ResultSet rs = ps.executeQuery();   // 注意：这里不再传 sql 参数
```

此时 `a' OR '1'='1` 会被整体当成一个密码字符串去比对，匹配不上 → 登录失败，注入被防住。

> 💡 **PreparedStatement 的两大好处**：
> 1. **防 SQL 注入**（安全）；
> 2. **预编译可复用**，同结构 SQL 多次执行时性能更好。
>
> ✅ **实际开发中一律使用 `PreparedStatement`，基本不用 `Statement`。**

### 6.3 PreparedStatement 的增删改

```java
String sql = "INSERT INTO user (username, password) VALUES (?, ?)";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, "zhaoliu");
ps.setString(2, "111");
int count = ps.executeUpdate();        // 同样用 executeUpdate，但不传 sql
System.out.println(count > 0 ? "成功" : "失败");
```

---

## 七、ResultSet：结果集对象

`executeQuery` 返回的 `ResultSet` 是一张「查询结果表」，内部有一个**游标（cursor）**，初始指向第一行**之前**。

### 7.1 两个核心方法

| 方法 | 作用 |
|------|------|
| `boolean next()` | 游标下移一行；有数据返回 `true`，到末尾返回 `false` |
| `getXxx(列名 或 列索引)` | 取当前行某列的值，`Xxx` 是类型：`getInt`、`getString`、`getDouble`、`getDate`… |

### 7.2 遍历结果集

```java
String sql = "SELECT id, username, password FROM user";
PreparedStatement ps = conn.prepareStatement(sql);
ResultSet rs = ps.executeQuery();

while (rs.next()) {                 // 每次 next() 移到下一行
    int id = rs.getInt("id");           // 按列名取（推荐，可读性好）
    String name = rs.getString("username");
    String pwd  = rs.getString(3);      // 也可按列索引取（从 1 开始）
    System.out.println(id + ", " + name + ", " + pwd);
}
```

> 🕳️ **常见错误**：忘了写 `rs.next()` 就直接 `getXxx`，会抛 `Before start of result set`（游标还没指向任何行）。查询单行时也要先 `if(rs.next())`。

### 7.3 把结果封装成 Java 对象（JavaBean）

实战中通常把每行封装成一个对象，放进 `List`：

```java
List<User> list = new ArrayList<>();
while (rs.next()) {
    User u = new User();
    u.setId(rs.getInt("id"));
    u.setUsername(rs.getString("username"));
    u.setPassword(rs.getString("password"));
    list.add(u);
}
// list 就是查询结果，可以返回给上层使用
```

---

## 八、释放资源与 JDBC 工具类封装

### 8.1 为什么必须释放

`Connection`、`Statement`、`ResultSet` 都占用数据库/系统资源，**用完不关会导致连接耗尽、内存泄漏**。要在 `finally` 里**倒序关闭**（先开的后关）：

```java
} finally {
    if (rs != null)   try { rs.close(); }   catch (SQLException e) {}
    if (ps != null)   try { ps.close(); }   catch (SQLException e) {}
    if (conn != null) try { conn.close(); } catch (SQLException e) {}
}
```

每个类都这样写太啰嗦，于是封装成工具类。

### 8.2 配置文件 jdbc.properties

把连接信息抽到配置文件（放在 `src` 目录下），改数据库不用动代码：

```properties
# jdbc.properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/db_learn?useSSL=false&serverTimezone=UTC
username=root
password=your_password
```

### 8.3 JDBCUtils 工具类

```java
import java.io.InputStream;
import java.sql.*;
import java.util.Properties;

public class JDBCUtils {
    private static String url;
    private static String user;
    private static String password;

    // 静态块：类加载时只读一次配置、只注册一次驱动
    static {
        try {
            Properties pro = new Properties();
            // 用类加载器读 src 下的配置文件
            InputStream is = JDBCUtils.class.getClassLoader()
                                .getResourceAsStream("jdbc.properties");
            pro.load(is);

            String driver = pro.getProperty("driver");
            url      = pro.getProperty("url");
            user     = pro.getProperty("username");
            password = pro.getProperty("password");

            Class.forName(driver);     // 注册驱动
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /** 获取连接 */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }

    /** 释放资源（查询用，关 3 个） */
    public static void close(ResultSet rs, Statement stmt, Connection conn) {
        if (rs != null)   try { rs.close(); }   catch (SQLException e) { e.printStackTrace(); }
        if (stmt != null) try { stmt.close(); } catch (SQLException e) { e.printStackTrace(); }
        if (conn != null) try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
    }

    /** 释放资源（增删改用，关 2 个）—— 方法重载 */
    public static void close(Statement stmt, Connection conn) {
        close(null, stmt, conn);
    }
}
```

用了工具类后，业务代码瞬间清爽：

```java
Connection conn = null;
PreparedStatement ps = null;
ResultSet rs = null;
try {
    conn = JDBCUtils.getConnection();
    ps = conn.prepareStatement("SELECT * FROM user");
    rs = ps.executeQuery();
    while (rs.next()) { /* ... */ }
} catch (SQLException e) {
    e.printStackTrace();
} finally {
    JDBCUtils.close(rs, ps, conn);
}
```

---

## 九、综合实战：登录案例

把所学整合成一个安全的登录方法，并验证 SQL 注入失效。

```java
public class LoginDemo {
    public boolean login(String username, String password) {
        if (username == null || password == null) return false;

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = JDBCUtils.getConnection();
            // 用 ? 占位，杜绝注入
            String sql = "SELECT * FROM user WHERE username = ? AND password = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, username);
            ps.setString(2, password);
            rs = ps.executeQuery();
            return rs.next();    // 查到了 → 登录成功
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            JDBCUtils.close(rs, ps, conn);
        }
    }

    public static void main(String[] args) {
        LoginDemo demo = new LoginDemo();
        System.out.println(demo.login("zhangsan", "123"));            // true  正常登录
        System.out.println(demo.login("zhangsan", "wrong"));          // false 密码错
        System.out.println(demo.login("aaa", "a' OR '1'='1"));        // false 注入无效！
    }
}
```

最后一行如果用 `Statement` 拼字符串会返回 `true`（被注入），而用 `PreparedStatement` 返回 `false`——这就是预编译的价值。

---

## 十、本章小结

- **JDBC 本质**：Sun 定义的一套**数据库操作接口**，各厂商提供**驱动实现 jar**，面向接口编程，换库不换代码。
- **六步骤**：注册驱动 → 获取连接 → 定义 SQL → 获取执行对象 → 执行 → 处理结果 → 释放资源。
- **五大核心 API**：
  - `DriverManager`：`Class.forName` 注册驱动、`getConnection(url,user,pwd)` 获取连接（URL 要带时区！）。
  - `Connection`：`createStatement` / `prepareStatement`、事务方法。
  - `Statement`：`executeUpdate`（增删改/DDL，返回行数）、`executeQuery`（查，返回 ResultSet）。
  - `PreparedStatement`：用 `?` 占位 + `setXxx` 赋值，**防 SQL 注入 + 预编译提速**，实战首选。
  - `ResultSet`：`next()` 移动游标 + `getXxx(列)` 取值，遍历封装成对象。
- **SQL 注入**：字符串拼 SQL 会被 `OR '1'='1'` 绕过；用 `PreparedStatement` 根治。
- **工具类**：用配置文件 + 静态块封装 `getConnection` / `close`，消除样板代码。

### 常见易错问答

1. **问：`executeUpdate` 和 `executeQuery` 怎么选？**
   答：增删改（DML）和 DDL 用 `executeUpdate`（返回行数）；查询（DQL）用 `executeQuery`（返回 ResultSet）。
2. **问：用了 PreparedStatement，`executeQuery(sql)` 还传 sql 吗？**
   答：不传！SQL 已经在 `prepareStatement(sql)` 时给过了，调用时用无参的 `ps.executeQuery()` / `ps.executeUpdate()`。
3. **问：MySQL 8 连接报时区错误？**
   答：URL 里加 `serverTimezone=UTC`（或 `Asia/Shanghai`），并确认驱动类名是 `com.mysql.cj.jdbc.Driver`。
