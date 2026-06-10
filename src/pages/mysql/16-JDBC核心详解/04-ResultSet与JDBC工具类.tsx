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
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>ResultSet 与 JDBC 工具类</Title>

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
  </article>
);

export default index;
