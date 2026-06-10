import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>JDBCTemplate 介绍与快速入门</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        走到这里，我们已经掌握了原生 JDBC（第 16 章）、JDBC 事务（第 17
        章）、连接池（第 18 章）。但你一定也感受到了：原生 JDBC 写一次查询要{' '}
        <InlineCode>getConnection</InlineCode>、
        <InlineCode>prepareStatement</InlineCode>、<InlineCode>setXxx</InlineCode>、
        <InlineCode>executeQuery</InlineCode>、
        <InlineCode>while(rs.next())</InlineCode>、<InlineCode>close</InlineCode>
        ……
        <Text bold>一大堆重复的样板代码，真正的业务逻辑只有一两行</Text>。
      </Paragraph>
      <Paragraph>
        Spring 框架提供了 <Text bold>JDBCTemplate（JDBC 模板）</Text>
        ，把这些样板全部包办，让你
        <Text bold>一行代码完成一次增删改查</Text>。本章讲透：
      </Paragraph>
      <OrderedList>
        <ListItem>
          JDBCTemplate 是什么、需要哪些 jar、怎么创建它；
        </ListItem>
        <ListItem>
          用 <InlineCode>update()</InlineCode> 执行增删改；
        </ListItem>
        <ListItem>
          用 <InlineCode>queryForMap</InlineCode> /{' '}
          <InlineCode>queryForList</InlineCode> / <InlineCode>query</InlineCode> /{' '}
          <InlineCode>queryForObject</InlineCode> 执行各种查询，把结果自动封装成
          Map、List、JavaBean。
        </ListItem>
      </OrderedList>
      <Paragraph>
        它是本套 MySQL 教程的收官，也是通往 MyBatis、Spring Data
        等持久层框架的桥梁。本章沿用 <InlineCode>db_learn</InlineCode> 的{' '}
        <InlineCode>user</InlineCode> 表，并直接复用第 18
        章封装好的连接池工具类 <InlineCode>JDBCUtils</InlineCode>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>〇、准备工作</Subtitle>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE user (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(32),
  password VARCHAR(32)
);
INSERT INTO user (username, password) VALUES ('zhangsan','123'),('lisi','456');`}
    />
    <Paragraph>对应的 JavaBean（字段名建议与列名对应，方便自动封装）：</Paragraph>
    <CodeBlock
      language="java"
      code={`public class User {
    private Integer id;
    private String username;
    private String password;
    // 必须有无参构造 + 所有字段的 getter/setter（自动封装靠 setter）
    // ... getter/setter 省略 ...
    @Override public String toString() {
        return "User{id=" + id + ", username='" + username + "', password='" + password + "'}";
    }
}`}
    />

    <Divider />

    <Subtitle>一、JDBCTemplate 介绍</Subtitle>
    <Paragraph>
      <Text bold>JDBCTemplate</Text> 是 <Text bold>Spring 框架</Text>对 JDBC
      的轻量封装。它替你完成了：获取/释放连接、创建{' '}
      <InlineCode>PreparedStatement</InlineCode>、设置参数、遍历{' '}
      <InlineCode>ResultSet</InlineCode>、异常转换……你只需关心「SQL + 参数 +
      结果怎么封装」。
    </Paragraph>
    <Paragraph>
      <Text bold>需要的 jar</Text>（核心 4 个 + 连接池 + 驱动）：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>spring-core</InlineCode>、<InlineCode>spring-beans</InlineCode>
        、<InlineCode>spring-jdbc</InlineCode>、<InlineCode>spring-tx</InlineCode>
        （Spring 的核心、bean、jdbc、事务）；
      </ListItem>
      <ListItem>
        还有 <InlineCode>commons-logging</InlineCode>（Spring 依赖的日志）；
      </ListItem>
      <ListItem>
        连接池 jar（如 <InlineCode>druid</InlineCode>）和 MySQL 驱动 jar。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      JDBCTemplate 不自己管理连接，而是
      <Text bold>
        依赖一个 <InlineCode>DataSource</InlineCode>（连接池）
      </Text>
      来取连接——这正是第 18 章我们在 <InlineCode>JDBCUtils</InlineCode> 里留出{' '}
      <InlineCode>getDataSource()</InlineCode> 的原因，现在派上用场。
    </Callout>

    <Divider />

    <Subtitle>二、快速入门</Subtitle>
    <CodeBlock
      language="java"
      code={`import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcTemplateDemo {
    public static void main(String[] args) {
        // 用第18章连接池工具类提供的 DataSource 创建 JdbcTemplate
        JdbcTemplate template = new JdbcTemplate(JDBCUtils.getDataSource());

        // 一行搞定一次更新！
        String sql = "UPDATE user SET password = '888' WHERE id = 1";
        int count = template.update(sql);
        System.out.println("受影响行数：" + count);
    }
}`}
    />
    <Paragraph>
      对比第 16 章那一大段 try-catch-finally，是不是清爽到不可思议？这就是模板的价值。
    </Paragraph>
    <Callout type="tip">
      实际项目里 <InlineCode>JdbcTemplate</InlineCode>{' '}
      对象通常只创建一次（交给 Spring 容器管理为单例），这里为演示直接{' '}
      <InlineCode>new</InlineCode>。
    </Callout>
  </article>
);

export default index;
