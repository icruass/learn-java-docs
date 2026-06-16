import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "jdbc",
  name: "JDBC",
  problems: [
    {
      title: "JDBC 操作数据库的基本步骤",
      difficulty: "简单",
      question:
        "什么是 JDBC？请按顺序写出使用 JDBC 操作数据库（以执行一条查询 SELECT 为例）的基本步骤。",
      hint: "六步：注册驱动 → 获取连接 → 创建 Statement → 执行 SQL → 处理结果集 → 释放资源。",
      answer:
        "JDBC（Java DataBase Connectivity）是 Java 访问关系型数据库的一套标准 API（一组接口），各数据库厂商提供具体实现（驱动 jar）。使用步骤通常为：\n1. 注册驱动：加载数据库驱动类（MySQL 5 之后可省略，会自动加载）。\n2. 获取连接 Connection：通过 DriverManager.getConnection(url, user, password) 得到数据库连接。\n3. 创建执行对象：用 Connection 创建 Statement 或 PreparedStatement。\n4. 执行 SQL：查询用 executeQuery（返回 ResultSet），增删改用 executeUpdate（返回受影响行数）。\n5. 处理结果：遍历 ResultSet 取出查询结果（增删改则根据返回行数判断是否成功）。\n6. 释放资源：按「后开先关」的顺序关闭 ResultSet、Statement、Connection（放在 finally 或 try-with-resources 中）。",
      answerCode: `Connection conn = null;
Statement stmt = null;
ResultSet rs = null;
try {
    // 1. 注册驱动（MySQL 5+ 可省略）
    Class.forName("com.mysql.cj.jdbc.Driver");
    // 2. 获取连接
    String url = "jdbc:mysql://localhost:3306/db_learn";
    conn = DriverManager.getConnection(url, "root", "123456");
    // 3. 创建执行对象
    stmt = conn.createStatement();
    // 4. 执行 SQL
    rs = stmt.executeQuery("SELECT id, name FROM account");
    // 5. 处理结果集
    while (rs.next()) {
        System.out.println(rs.getInt("id") + " - " + rs.getString("name"));
    }
} catch (Exception e) {
    e.printStackTrace();
} finally {
    // 6. 释放资源（后开先关）
    try { if (rs != null) rs.close(); } catch (Exception e) { }
    try { if (stmt != null) stmt.close(); } catch (Exception e) { }
    try { if (conn != null) conn.close(); } catch (Exception e) { }
}`,
      language: "java",
      tags: ["JDBC", "操作步骤", "Connection"],
    },
    {
      title: "Statement 与 PreparedStatement 的区别",
      difficulty: "中等",
      question:
        "JDBC 中 Statement 和 PreparedStatement 都能执行 SQL，它们有什么区别？为什么开发中更推荐用 PreparedStatement？请用 PreparedStatement 写出「按用户名和密码查询用户」的代码片段。",
      hint: "PreparedStatement 预编译、用 ? 占位符 + setXxx 传参，能防 SQL 注入，重复执行还能复用编译结果。",
      answer:
        "区别：\n1. 拼接方式：Statement 把参数用字符串拼进 SQL，PreparedStatement 用 ? 作占位符，再通过 setXxx(序号, 值) 传参（序号从 1 开始）。\n2. 预编译：PreparedStatement 会先把 SQL 模板发给数据库预编译，相同 SQL 多次执行可复用编译结果，性能更好。\n3. 安全：PreparedStatement 的参数是「值」而非「SQL 片段」，能有效防止 SQL 注入；Statement 拼接字符串则容易被注入。\n推荐原因：更安全（防注入）、性能更好（预编译可复用）、代码更清晰（不用手动拼接和处理引号），所以实际开发优先用 PreparedStatement。",
      answerCode: `String sql = "SELECT * FROM user WHERE username = ? AND password = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, username); // 给第 1 个 ? 赋值
pstmt.setString(2, password); // 给第 2 个 ? 赋值
ResultSet rs = pstmt.executeQuery();
if (rs.next()) {
    System.out.println("登录成功");
} else {
    System.out.println("用户名或密码错误");
}`,
      language: "java",
      tags: ["Statement", "PreparedStatement", "预编译"],
    },
    {
      title: "找错：SQL 注入的原理与防范",
      difficulty: "困难",
      question:
        "下面这段「登录校验」代码用 Statement 拼接 SQL，存在严重安全隐患。请指出：（1）这叫什么攻击？原理是什么？（2）如果用户在密码框输入 a' OR '1'='1，最终执行的 SQL 变成什么？会发生什么后果？（3）应如何改正。",
      code: `String username = request.getParameter("username");
String password = request.getParameter("password");

String sql = "SELECT * FROM user WHERE username = '" + username
           + "' AND password = '" + password + "'";

Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(sql);
if (rs.next()) {
    System.out.println("登录成功");
}`,
      language: "java",
      hint: "用户输入被当成了 SQL 语法的一部分。把恒成立的 OR '1'='1' 拼进去，WHERE 条件就永远为真。",
      answer:
        "（1）这叫 SQL 注入（SQL Injection）。原理是：程序把用户输入用字符串拼接的方式直接拼进 SQL，用户输入里的引号、关键字被数据库当成「SQL 语法」而不是「普通数据」来解析，从而篡改了原本的 SQL 逻辑。\n（2）当 password 输入 a' OR '1'='1 时，拼出的 SQL 变为：\nSELECT * FROM user WHERE username = 'xxx' AND password = 'a' OR '1'='1'\n由于 OR '1'='1' 恒为真，整个 WHERE 条件永远成立，查询会返回所有用户记录，rs.next() 为 true，于是「不需要正确密码就能登录成功」，即被绕过登录（严重时还能删库、脱库）。\n（3）改正：改用 PreparedStatement，用 ? 占位符 + setString 传参。这样用户输入只会被当作「参数值」处理（引号会被自动转义/参数化），不会改变 SQL 结构，从根本上防止注入。",
      answerCode: `String sql = "SELECT * FROM user WHERE username = ? AND password = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, username);  // 输入只作为「值」，不会改变 SQL 结构
pstmt.setString(2, password);
ResultSet rs = pstmt.executeQuery();
if (rs.next()) {
    System.out.println("登录成功");
}`,
      tags: ["SQL注入", "PreparedStatement", "安全"],
    },
    {
      title: "JDBC 事务控制（转账）",
      difficulty: "中等",
      question:
        "JDBC 默认每执行一条 SQL 就自动提交一次。要把「张三转账给李四」的两条 UPDATE 放进同一个事务，应该怎么做？请写出关键代码，体现「关闭自动提交、成功提交、异常回滚」。涉及哪几个 Connection 方法？",
      hint: "conn.setAutoCommit(false) 开启手动事务；全部成功后 conn.commit()；catch 里 conn.rollback()。",
      answer:
        "JDBC 中事务由 Connection 控制，关键三个方法：\n- conn.setAutoCommit(false)：关闭自动提交，开启手动事务（之后的多条 SQL 视为一个事务）。\n- conn.commit()：所有 SQL 都成功后，提交事务，修改永久生效。\n- conn.rollback()：捕获到异常时回滚，撤销本事务已执行的所有修改。\n做法：在执行两条 UPDATE 之前调用 setAutoCommit(false)；两条都执行完后调用 commit()；在 catch 块里调用 rollback()。这样就能保证两步「要么都成功、要么都撤销」，满足原子性。",
      answerCode: `Connection conn = null;
try {
    conn = DriverManager.getConnection(url, user, password);
    conn.setAutoCommit(false); // ① 关闭自动提交，开启事务

    String sql = "UPDATE account SET money = money + ? WHERE name = ?";
    PreparedStatement pstmt = conn.prepareStatement(sql);

    pstmt.setDouble(1, -500); pstmt.setString(2, "张三"); // 张三 -500
    pstmt.executeUpdate();

    // int x = 1 / 0;  // 假设这里出异常

    pstmt.setDouble(1, 500);  pstmt.setString(2, "李四"); // 李四 +500
    pstmt.executeUpdate();

    conn.commit();             // ② 都成功，提交事务
} catch (Exception e) {
    e.printStackTrace();
    try { if (conn != null) conn.rollback(); } catch (Exception ex) { } // ③ 出错，回滚
} finally {
    try { if (conn != null) conn.close(); } catch (Exception e) { }
}`,
      language: "java",
      tags: ["JDBC事务", "setAutoCommit", "commit", "rollback"],
    },
    {
      title: "ResultSet 遍历查询结果集",
      difficulty: "简单",
      question:
        "执行 SELECT 查询后会得到一个 ResultSet（结果集）。请说明 ResultSet 如何遍历多行数据？next() 方法的作用和返回值是什么？取某一列的值用什么方法、可以怎么定位列？写出遍历 emp 表（id、ename、salary）的代码片段。",
      hint: "ResultSet 内部有一个「游标」，初始在第一行之前；next() 把游标下移一行，有数据返回 true。取值用 getXxx，可按列名或列序号（从 1 开始）。",
      answer:
        "ResultSet 内部维护一个游标（cursor），初始位置在第一行「之前」。\n- next() 方法：把游标向下移动一行；如果新的一行存在数据返回 true，否则（已到末尾）返回 false。因此常配合 while (rs.next()) 循环逐行遍历，每次循环处理「当前行」。\n- 取列值用 getXxx(...) 方法，按列的数据类型选择，如 getInt、getString、getDouble。定位列有两种方式：① 按列名，如 rs.getString(\"ename\")，可读性好、推荐；② 按列序号（从 1 开始，对应 SELECT 中列的顺序），如 rs.getInt(1)。\n注意：getXxx 中的列序号从 1 开始，不是从 0 开始。",
      answerCode: `ResultSet rs = stmt.executeQuery("SELECT id, ename, salary FROM emp");
while (rs.next()) {                 // 游标下移一行，有数据则继续
    int id = rs.getInt("id");        // 按列名取值（推荐）
    String name = rs.getString(2);   // 按列序号取值（从 1 开始）
    double salary = rs.getDouble("salary");
    System.out.println(id + " - " + name + " - " + salary);
}`,
      language: "java",
      tags: ["ResultSet", "结果集遍历", "next"],
    },
  ],
};

export default category;
