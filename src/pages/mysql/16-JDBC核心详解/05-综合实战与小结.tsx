import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>综合实战与本章小结</Title>

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
