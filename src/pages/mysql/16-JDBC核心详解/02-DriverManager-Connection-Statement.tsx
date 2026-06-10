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
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>DriverManager、Connection 与 Statement</Title>

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
  </article>
);

export default index;
