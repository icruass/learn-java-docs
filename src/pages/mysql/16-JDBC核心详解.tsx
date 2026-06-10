import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>JDBC 核心详解：概念、六步入门、各核心类与增删改查实战</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        前面 15 章我们都在数据库客户端里手敲 SQL。但实际项目里，是{' '}
        <Text bold>Java 程序自动去操作数据库</Text>：用户在网页上点「注册」，后台
        Java 代码就要把这条数据 <InlineCode>INSERT</InlineCode> 进 MySQL。
        <Text bold>Java 程序怎么连上数据库、发送 SQL、拿回结果？</Text> 靠的就是{' '}
        <Text bold>JDBC</Text>。
      </Paragraph>
      <Paragraph>JDBC 是 Java 工程师的必经之路，本章要彻底讲清：</Paragraph>
      <OrderedList>
        <ListItem>
          JDBC 到底是什么（一套<Text bold>接口规范</Text> + 厂商<Text bold>驱动实现</Text>）；
        </ListItem>
        <ListItem>
          操作数据库的<Text bold>固定六步骤</Text>，给出第一个能跑的完整程序；
        </ListItem>
        <ListItem>
          五个核心类/接口逐个拆解：<InlineCode>DriverManager</InlineCode>、
          <InlineCode>Connection</InlineCode>、<InlineCode>Statement</InlineCode>、
          <InlineCode>PreparedStatement</InlineCode>、<InlineCode>ResultSet</InlineCode>；
        </ListItem>
        <ListItem>
          用它们完成<Text bold>增删改查</Text>实战；
        </ListItem>
        <ListItem>
          <Text bold>SQL 注入</Text>漏洞演示与 <InlineCode>PreparedStatement</InlineCode> 的解决；
        </ListItem>
        <ListItem>
          把样板代码封装成 <Text bold>JDBC 工具类</Text>，并完成一个<Text bold>登录案例</Text>。
        </ListItem>
      </OrderedList>
      <Paragraph>
        本章是「MySQL」与「Java」的交汇点，后续连接池、JDBCTemplate、乃至
        MyBatis/Spring 全部建立在它之上。示例统一操作 <InlineCode>db_learn</InlineCode>{' '}
        库的 <InlineCode>user</InlineCode> 表。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>〇、准备示例表</Subtitle>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE user (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(32),
  password VARCHAR(32)
);
INSERT INTO user (username, password) VALUES ('zhangsan','123'), ('lisi','456');`}
    />

    <Divider />

    <Subtitle>一、JDBC 是什么</Subtitle>
    <Paragraph>
      <Text bold>JDBC（Java DataBase Connectivity，Java 数据库连接）</Text> 是 Sun
      公司（Java 官方）定义的一套<Text bold>操作所有关系型数据库的规则（接口）</Text>。
    </Paragraph>
    <Paragraph>关键理解它的「接口 + 实现」设计：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Sun 只定义接口</Text>（<InlineCode>Connection</InlineCode>、
        <InlineCode>Statement</InlineCode>、<InlineCode>ResultSet</InlineCode> 等都在{' '}
        <InlineCode>java.sql</InlineCode> 包里，是 interface），它本身不知道怎么连
        MySQL，也不知道怎么连 Oracle。
      </ListItem>
      <ListItem>
        <Text bold>各数据库厂商提供实现类</Text>，打包成 <InlineCode>.jar</InlineCode>
        ，叫做<Text bold>数据库驱动（Driver）</Text>。MySQL 的驱动就是{' '}
        <InlineCode>mysql-connector-j-x.x.x.jar</InlineCode>。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      code={`你的 Java 代码  ——只依赖——>  JDBC 接口(java.sql.*)
                                    ↑ 实现
                          MySQL驱动jar / Oracle驱动jar / ...`}
    />
    <Callout type="tip">
      <Text bold>这是「面向接口编程」的经典范例</Text>：你的代码只调用 JDBC
      接口，将来从 MySQL 换成 Oracle，<Text bold>Java 代码几乎不用改</Text>
      ，只要换一个驱动 jar、改一下连接 URL 即可。这就是接口规范的价值。
    </Callout>
    <Paragraph>
      <Text bold>使用前提</Text>：把 MySQL 驱动 jar 导入项目（IDEA 里把 jar 放到{' '}
      <InlineCode>lib</InlineCode> 目录并 Add as Library，或用 Maven 引入依赖）。
    </Paragraph>

    <Divider />

    <Subtitle>二、快速入门：固定六步骤</Subtitle>
    <Paragraph>
      下面是用 JDBC 查询 <InlineCode>user</InlineCode> 表的完整可运行程序，
      <Text bold>JDBC 操作永远是这几步</Text>：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`import java.sql.*;

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
}`}
    />
    <Paragraph>
      记住这条主线：
      <Text bold>
        注册驱动 → 获取连接 → 定义SQL → 获取执行对象 → 执行 → 处理结果 → 释放资源
      </Text>
      。后面所有内容都是对这七步里某个类的展开。
    </Paragraph>

    <Divider />

    <Subtitle>三、DriverManager：驱动管理类</Subtitle>
    <Paragraph>
      <InlineCode>DriverManager</InlineCode> 干两件事：<Text bold>注册驱动</Text> 和{' '}
      <Text bold>获取连接</Text>。
    </Paragraph>

    <Heading3>3.1 注册驱动</Heading3>
    <CodeBlock language="java" code={`Class.forName("com.mysql.cj.jdbc.Driver");`} />
    <Paragraph>
      为什么一句 <InlineCode>Class.forName</InlineCode> 就注册好了？看 MySQL 驱动类{' '}
      <InlineCode>com.mysql.cj.jdbc.Driver</InlineCode> 的源码：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`public class Driver implements java.sql.Driver {
    static {                              // 静态代码块，类被加载时自动执行
        DriverManager.registerDriver(new Driver());   // 它自己就把自己注册了
    }
}`}
    />
    <Paragraph>
      <InlineCode>Class.forName("...Driver")</InlineCode>{' '}
      会触发这个类被加载，从而执行静态块完成注册。所以
      <Text bold>
        我们只需 <InlineCode>Class.forName</InlineCode>，不必手动{' '}
        <InlineCode>registerDriver</InlineCode>
      </Text>
      。
    </Paragraph>
    <Callout type="tip">
      <Paragraph>
        <Text bold>MySQL 5 与 8 驱动类名不同</Text>：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          MySQL 5.x：<InlineCode>com.mysql.jdbc.Driver</InlineCode>
        </ListItem>
        <ListItem>
          MySQL 8.x：<InlineCode>com.mysql.cj.jdbc.Driver</InlineCode>（多了{' '}
          <InlineCode>.cj</InlineCode>）
        </ListItem>
      </UnorderedList>
      <Paragraph>
        从 JDBC 4.0 起支持 <Text bold>SPI 自动加载</Text>，jar 包的{' '}
        <InlineCode>META-INF/services</InlineCode> 里已声明驱动，连{' '}
        <InlineCode>Class.forName</InlineCode> 都可省略。但
        <Text bold>为了代码可读、习惯，仍建议写上</Text>。
      </Paragraph>
    </Callout>

    <Heading3>3.2 获取连接 getConnection</Heading3>
    <CodeBlock
      language="java"
      code={`Connection conn = DriverManager.getConnection(url, user, password);`}
    />
    <Paragraph>
      重点是 <Text bold>URL 的格式</Text>，这是新手最易出错的地方：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`jdbc:mysql://ip地址:端口号/数据库名?参数1=值1&参数2=值2`}
    />
    <Table
      head={['部分', '说明']}
      rows={[
        ['jdbc:mysql://', '协议固定，表示用 JDBC 连 MySQL'],
        ['localhost:3306', '数据库服务器 IP 和端口（默认 3306）'],
        ['/db_learn', '要连接的数据库名'],
        ['?useSSL=false', '关闭 SSL 警告'],
        ['&serverTimezone=UTC', '指定时区（MySQL 8 不写会报时区错误！）'],
        ['&characterEncoding=utf8', '字符编码，防中文乱码'],
      ]}
    />
    <CodeBlock
      language="java"
      code={`// 完整示例
String url = "jdbc:mysql://localhost:3306/db_learn"
           + "?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8";

// 连本机默认库时可简写（仅本机 3306 时）
String url2 = "jdbc:mysql:///db_learn?serverTimezone=UTC";`}
    />
    <Callout type="danger">
      <Text bold>
        MySQL 8 不写 <InlineCode>serverTimezone</InlineCode> 会直接抛异常
      </Text>
      ：<InlineCode>The server time zone value '...' is unrecognized</InlineCode>
      。务必带上时区参数。
    </Callout>

    <Divider />

    <Subtitle>四、Connection：数据库连接对象</Subtitle>
    <Paragraph>
      <InlineCode>Connection</InlineCode> 代表「一条到数据库的连接」，主要提供两类能力：
    </Paragraph>
    <Paragraph>
      <Text bold>① 获取执行 SQL 的对象：</Text>
    </Paragraph>
    <CodeBlock
      language="java"
      code={`Statement stmt = conn.createStatement();                 // 普通执行对象
PreparedStatement ps = conn.prepareStatement(sql);       // 预编译执行对象（推荐）`}
    />
    <Paragraph>
      <Text bold>② 管理事务（详见第 17 章，这里先认识 API）：</Text>
    </Paragraph>
    <CodeBlock
      language="java"
      code={`conn.setAutoCommit(false);   // 关闭自动提交 = 开启事务
conn.commit();               // 提交事务
conn.rollback();             // 回滚事务`}
    />

    <Divider />

    <Subtitle>五、Statement：执行 SQL 的对象</Subtitle>
    <Paragraph>
      <InlineCode>Statement</InlineCode> 有两个核心方法，
      <Text bold>用哪个取决于 SQL 类型</Text>：
    </Paragraph>
    <Table
      head={['方法', '用于', '返回值']}
      rows={[
        ['int executeUpdate(sql)', 'DML（INSERT/UPDATE/DELETE）和 DDL', '受影响的行数'],
        ['ResultSet executeQuery(sql)', 'DQL（SELECT）', '结果集 ResultSet'],
      ]}
    />

    <Heading3>5.1 executeUpdate 实战：增、删、改</Heading3>
    <CodeBlock
      language="java"
      code={`Statement stmt = conn.createStatement();

// 增
int c1 = stmt.executeUpdate(
    "INSERT INTO user (username, password) VALUES ('wangwu','789')");
System.out.println(c1 > 0 ? "添加成功" : "添加失败");   // 影响行数 > 0 即成功

// 改
int c2 = stmt.executeUpdate(
    "UPDATE user SET password='000' WHERE username='zhangsan'");

// 删
int c3 = stmt.executeUpdate("DELETE FROM user WHERE id=3");`}
    />
    <Callout type="tip">
      <Text bold>判断成功的标准</Text>：<InlineCode>executeUpdate</InlineCode>{' '}
      返回「受影响行数」，<InlineCode>&gt; 0</InlineCode> 就表示操作生效。DDL
      语句（如 <InlineCode>CREATE TABLE</InlineCode>）也用{' '}
      <InlineCode>executeUpdate</InlineCode>，但返回 0（DDL 不影响行）。
    </Callout>

    <Divider />

    <Subtitle>六、SQL 注入与 PreparedStatement</Subtitle>

    <Heading3>6.1 用 Statement 拼字符串的致命漏洞</Heading3>
    <Paragraph>
      设想一个登录功能，用 <InlineCode>Statement</InlineCode> 把用户输入拼进 SQL：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`String name = "随便填";
String pwd  = "a' OR '1'='1";    // ← 恶意输入
String sql = "SELECT * FROM user WHERE username='" + name
           + "' AND password='" + pwd + "'";
// 拼出来的 SQL 变成：
// SELECT * FROM user WHERE username='随便填' AND password='a' OR '1'='1'`}
    />
    <Paragraph>
      <InlineCode>OR '1'='1'</InlineCode> 恒为真，
      <Text bold>不需要正确密码就能登录成功</Text>！这就是臭名昭著的{' '}
      <Text bold>SQL 注入</Text>——用户输入「篡改」了 SQL 的逻辑。
    </Paragraph>

    <Heading3>6.2 解决方案：PreparedStatement 预编译</Heading3>
    <Paragraph>
      <InlineCode>PreparedStatement</InlineCode> 用 <InlineCode>?</InlineCode>{' '}
      作占位符，把 SQL 的「结构」和「数据」分开：SQL 先发给数据库
      <Text bold>预编译</Text>好结构，用户输入只作为「纯数据」填进{' '}
      <InlineCode>?</InlineCode>，<Text bold>永远不会被当成 SQL 语法执行</Text>。
    </Paragraph>
    <CodeBlock
      language="java"
      code={`// SQL 用 ? 占位，结构固定
String sql = "SELECT * FROM user WHERE username = ? AND password = ?";
PreparedStatement ps = conn.prepareStatement(sql);

// 给占位符赋值（索引从 1 开始）
ps.setString(1, name);   // 第1个? = name
ps.setString(2, pwd);    // 第2个? = pwd（哪怕是 a' OR '1'='1 也只当普通字符串）

ResultSet rs = ps.executeQuery();   // 注意：这里不再传 sql 参数`}
    />
    <Paragraph>
      此时 <InlineCode>a' OR '1'='1</InlineCode>{' '}
      会被整体当成一个密码字符串去比对，匹配不上 → 登录失败，注入被防住。
    </Paragraph>
    <Callout type="tip">
      <Paragraph>
        <Text bold>PreparedStatement 的两大好处</Text>：
      </Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>防 SQL 注入</Text>（安全）；
        </ListItem>
        <ListItem>
          <Text bold>预编译可复用</Text>，同结构 SQL 多次执行时性能更好。
        </ListItem>
      </OrderedList>
    </Callout>
    <Callout type="success">
      <Text bold>
        实际开发中一律使用 <InlineCode>PreparedStatement</InlineCode>，基本不用{' '}
        <InlineCode>Statement</InlineCode>。
      </Text>
    </Callout>

    <Heading3>6.3 PreparedStatement 的增删改</Heading3>
    <CodeBlock
      language="java"
      code={`String sql = "INSERT INTO user (username, password) VALUES (?, ?)";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, "zhaoliu");
ps.setString(2, "111");
int count = ps.executeUpdate();        // 同样用 executeUpdate，但不传 sql
System.out.println(count > 0 ? "成功" : "失败");`}
    />

    <Divider />

    <Subtitle>七、ResultSet：结果集对象</Subtitle>
    <Paragraph>
      <InlineCode>executeQuery</InlineCode> 返回的 <InlineCode>ResultSet</InlineCode>{' '}
      是一张「查询结果表」，内部有一个<Text bold>游标（cursor）</Text>
      ，初始指向第一行<Text bold>之前</Text>。
    </Paragraph>

    <Heading3>7.1 两个核心方法</Heading3>
    <Table
      head={['方法', '作用']}
      rows={[
        ['boolean next()', '游标下移一行；有数据返回 true，到末尾返回 false'],
        [
          'getXxx(列名 或 列索引)',
          '取当前行某列的值，Xxx 是类型：getInt、getString、getDouble、getDate…',
        ],
      ]}
    />

    <Heading3>7.2 遍历结果集</Heading3>
    <CodeBlock
      language="java"
      code={`String sql = "SELECT id, username, password FROM user";
PreparedStatement ps = conn.prepareStatement(sql);
ResultSet rs = ps.executeQuery();

while (rs.next()) {                 // 每次 next() 移到下一行
    int id = rs.getInt("id");           // 按列名取（推荐，可读性好）
    String name = rs.getString("username");
    String pwd  = rs.getString(3);      // 也可按列索引取（从 1 开始）
    System.out.println(id + ", " + name + ", " + pwd);
}`}
    />
    <Callout type="danger">
      <Text bold>常见错误</Text>：忘了写 <InlineCode>rs.next()</InlineCode> 就直接{' '}
      <InlineCode>getXxx</InlineCode>，会抛{' '}
      <InlineCode>Before start of result set</InlineCode>
      （游标还没指向任何行）。查询单行时也要先 <InlineCode>if(rs.next())</InlineCode>。
    </Callout>

    <Heading3>7.3 把结果封装成 Java 对象（JavaBean）</Heading3>
    <Paragraph>
      实战中通常把每行封装成一个对象，放进 <InlineCode>List</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`List<User> list = new ArrayList<>();
while (rs.next()) {
    User u = new User();
    u.setId(rs.getInt("id"));
    u.setUsername(rs.getString("username"));
    u.setPassword(rs.getString("password"));
    list.add(u);
}
// list 就是查询结果，可以返回给上层使用`}
    />

    <Divider />

    <Subtitle>八、释放资源与 JDBC 工具类封装</Subtitle>

    <Heading3>8.1 为什么必须释放</Heading3>
    <Paragraph>
      <InlineCode>Connection</InlineCode>、<InlineCode>Statement</InlineCode>、
      <InlineCode>ResultSet</InlineCode> 都占用数据库/系统资源，
      <Text bold>用完不关会导致连接耗尽、内存泄漏</Text>。要在{' '}
      <InlineCode>finally</InlineCode> 里<Text bold>倒序关闭</Text>（先开的后关）：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`} finally {
    if (rs != null)   try { rs.close(); }   catch (SQLException e) {}
    if (ps != null)   try { ps.close(); }   catch (SQLException e) {}
    if (conn != null) try { conn.close(); } catch (SQLException e) {}
}`}
    />
    <Paragraph>每个类都这样写太啰嗦，于是封装成工具类。</Paragraph>

    <Heading3>8.2 配置文件 jdbc.properties</Heading3>
    <Paragraph>
      把连接信息抽到配置文件（放在 <InlineCode>src</InlineCode>{' '}
      目录下），改数据库不用动代码：
    </Paragraph>
    <CodeBlock
      language="properties"
      code={`# jdbc.properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/db_learn?useSSL=false&serverTimezone=UTC
username=root
password=your_password`}
    />

    <Heading3>8.3 JDBCUtils 工具类</Heading3>
    <CodeBlock
      language="java"
      code={`import java.io.InputStream;
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
}`}
    />
    <Paragraph>用了工具类后，业务代码瞬间清爽：</Paragraph>
    <CodeBlock
      language="java"
      code={`Connection conn = null;
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
}`}
    />

    <Divider />

    <Subtitle>九、综合实战：登录案例</Subtitle>
    <Paragraph>把所学整合成一个安全的登录方法，并验证 SQL 注入失效。</Paragraph>
    <CodeBlock
      language="java"
      code={`public class LoginDemo {
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
}`}
    />
    <Paragraph>
      最后一行如果用 <InlineCode>Statement</InlineCode> 拼字符串会返回{' '}
      <InlineCode>true</InlineCode>（被注入），而用{' '}
      <InlineCode>PreparedStatement</InlineCode> 返回{' '}
      <InlineCode>false</InlineCode>——这就是预编译的价值。
    </Paragraph>

    <Divider />

    <Subtitle>十、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>JDBC 本质</Text>：Sun 定义的一套<Text bold>数据库操作接口</Text>
        ，各厂商提供<Text bold>驱动实现 jar</Text>，面向接口编程，换库不换代码。
      </ListItem>
      <ListItem>
        <Text bold>六步骤</Text>：注册驱动 → 获取连接 → 定义 SQL → 获取执行对象 →
        执行 → 处理结果 → 释放资源。
      </ListItem>
      <ListItem>
        <Text bold>五大核心 API</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>DriverManager</InlineCode>：<InlineCode>Class.forName</InlineCode>{' '}
            注册驱动、<InlineCode>getConnection(url,user,pwd)</InlineCode>{' '}
            获取连接（URL 要带时区！）。
          </ListItem>
          <ListItem>
            <InlineCode>Connection</InlineCode>：<InlineCode>createStatement</InlineCode>{' '}
            / <InlineCode>prepareStatement</InlineCode>、事务方法。
          </ListItem>
          <ListItem>
            <InlineCode>Statement</InlineCode>：<InlineCode>executeUpdate</InlineCode>
            （增删改/DDL，返回行数）、<InlineCode>executeQuery</InlineCode>（查，返回
            ResultSet）。
          </ListItem>
          <ListItem>
            <InlineCode>PreparedStatement</InlineCode>：用 <InlineCode>?</InlineCode>{' '}
            占位 + <InlineCode>setXxx</InlineCode> 赋值，
            <Text bold>防 SQL 注入 + 预编译提速</Text>，实战首选。
          </ListItem>
          <ListItem>
            <InlineCode>ResultSet</InlineCode>：<InlineCode>next()</InlineCode>{' '}
            移动游标 + <InlineCode>getXxx(列)</InlineCode> 取值，遍历封装成对象。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>SQL 注入</Text>：字符串拼 SQL 会被 <InlineCode>OR '1'='1'</InlineCode>{' '}
        绕过；用 <InlineCode>PreparedStatement</InlineCode> 根治。
      </ListItem>
      <ListItem>
        <Text bold>工具类</Text>：用配置文件 + 静态块封装{' '}
        <InlineCode>getConnection</InlineCode> / <InlineCode>close</InlineCode>
        ，消除样板代码。
      </ListItem>
    </UnorderedList>

    <Heading3>常见易错问答</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>
          问：<InlineCode>executeUpdate</InlineCode> 和{' '}
          <InlineCode>executeQuery</InlineCode> 怎么选？
        </Text>
        答：增删改（DML）和 DDL 用 <InlineCode>executeUpdate</InlineCode>
        （返回行数）；查询（DQL）用 <InlineCode>executeQuery</InlineCode>（返回
        ResultSet）。
      </ListItem>
      <ListItem>
        <Text bold>
          问：用了 PreparedStatement，<InlineCode>executeQuery(sql)</InlineCode> 还传
          sql 吗？
        </Text>
        答：不传！SQL 已经在 <InlineCode>prepareStatement(sql)</InlineCode>{' '}
        时给过了，调用时用无参的 <InlineCode>ps.executeQuery()</InlineCode> /{' '}
        <InlineCode>ps.executeUpdate()</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>问：MySQL 8 连接报时区错误？</Text>
        答：URL 里加 <InlineCode>serverTimezone=UTC</InlineCode>（或{' '}
        <InlineCode>Asia/Shanghai</InlineCode>），并确认驱动类名是{' '}
        <InlineCode>com.mysql.cj.jdbc.Driver</InlineCode>。
      </ListItem>
    </OrderedList>
  </article>
);

export default index;
