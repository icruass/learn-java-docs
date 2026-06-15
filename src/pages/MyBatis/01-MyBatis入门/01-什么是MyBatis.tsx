import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  Table,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
  DocLink,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>什么是 MyBatis</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        在 MySQL 篇里我们学过{' '}
        <DocLink to="/mysql/16/01">原生 JDBC</DocLink> 和 Spring 的{' '}
        <DocLink to="/mysql/19/01">JDBCTemplate</DocLink>。JDBC 能用，但样板代码太多；
        JDBCTemplate 简化了流程，却仍要在 Java 里拼 SQL 字符串。
        <Text bold>MyBatis</Text> 是目前国内企业最主流的持久层框架，它把「SQL」从
        Java 代码里彻底剥离到 XML 或注解中，让你
        <Text bold>专注写 SQL，框架负责其余一切</Text>。本章先讲清楚：MyBatis
        是什么、解决了什么问题、和其它框架怎么选。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、MyBatis 是什么</Subtitle>
    <Paragraph>
      MyBatis 是一款优秀的<Text bold>持久层框架（Persistence Framework）</Text>，
      前身是 Apache 的 iBATIS。它对 JDBC 做了封装，帮你免去注册驱动、创建连接、
      创建 <InlineCode>Statement</InlineCode>、处理 <InlineCode>ResultSet</InlineCode>、
      释放资源这些繁琐又重复的过程。
    </Paragraph>
    <Paragraph>它最核心的两件事是：</Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>把 SQL 与 Java 代码分离</Text>——SQL 写在 XML
        映射文件（或注解）里，业务代码只调用一个接口方法。
      </ListItem>
      <ListItem>
        <Text bold>自动完成「参数 → SQL」和「结果集 → Java 对象」的映射</Text>
        ——你不用再手动 <InlineCode>setString(1, ...)</InlineCode>、
        也不用 <InlineCode>while(rs.next())</InlineCode> 一个字段一个字段地取值。
      </ListItem>
    </OrderedList>
    <Callout type="tip">
      记住一句话：<Text bold>MyBatis = JDBC 的样板代码全帮你写好，你只管写 SQL + 定义入参出参</Text>。
    </Callout>

    <Divider />

    <Subtitle>二、为什么需要它：原生 JDBC 的痛点</Subtitle>
    <Paragraph>回顾一段用原生 JDBC 查询用户的代码，痛点一目了然：</Paragraph>
    <CodeBlock
      language="java"
      title="原生 JDBC —— 真正的业务只有一行，其余全是样板"
      code={`Connection conn = null;
PreparedStatement ps = null;
ResultSet rs = null;
List<User> list = new ArrayList<>();
try {
    conn = DriverManager.getConnection(url, username, password); // 1. 手动连接
    ps = conn.prepareStatement("SELECT * FROM user WHERE age > ?"); // 2. 硬编码 SQL
    ps.setInt(1, 18);                                              // 3. 手动设参数
    rs = ps.executeQuery();
    while (rs.next()) {                                           // 4. 手动遍历结果
        User u = new User();
        u.setId(rs.getLong("id"));                               //    一个字段一行
        u.setUsername(rs.getString("username"));
        u.setAge(rs.getInt("age"));
        list.add(u);
    }
} catch (SQLException e) {
    e.printStackTrace();
} finally {
    // 5. 手动关资源，顺序还不能错
    if (rs != null)   try { rs.close(); }   catch (SQLException e) {}
    if (ps != null)   try { ps.close(); }   catch (SQLException e) {}
    if (conn != null) try { conn.close(); } catch (SQLException e) {}
}`}
    />
    <Paragraph>这里暴露出四个典型问题：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>样板代码多</Text>：连接、Statement、结果遍历、关资源，每次查询都要抄一遍。
      </ListItem>
      <ListItem>
        <Text bold>SQL 硬编码在 Java 里</Text>：改 SQL 要改 Java、重新编译，不利于维护。
      </ListItem>
      <ListItem>
        <Text bold>手动设参 / 手动封装结果</Text>：字段一多，
        <InlineCode>setXxx</InlineCode> / <InlineCode>getXxx</InlineCode> 写到手软，还容易写错。
      </ListItem>
      <ListItem>
        <Text bold>连接没有池化</Text>：频繁创建/关闭连接，性能差。
      </ListItem>
    </UnorderedList>
    <Paragraph>同样一个查询，用 MyBatis 写出来是这样的：</Paragraph>
    <CodeBlock
      language="java"
      title="MyBatis —— 接口一行声明，调用一行代码"
      code={`// Mapper 接口（SQL 写在对应的 XML 里）
List<User> selectByMinAge(int age);

// 业务代码
List<User> list = userMapper.selectByMinAge(18);  // 就这一行`}
    />

    <Divider />

    <Subtitle>三、MyBatis 与其它持久层框架对比</Subtitle>
    <Paragraph>
      Java 持久层框架主要有三类，理解它们的定位才好做技术选型：
    </Paragraph>
    <Table
      head={['框架', '类型', '特点', '适用场景']}
      rows={[
        [
          <Text bold>JDBC</Text>,
          '规范 / 底层 API',
          '最底层，全手动，灵活但啰嗦',
          '学习原理、极致定制',
        ],
        [
          <Text bold>MyBatis</Text>,
          '半自动 ORM',
          'SQL 自己写，映射框架做；可控、灵活、易优化',
          <Text bold>国内企业绝对主流</Text>,
        ],
        [
          'Hibernate',
          '全自动 ORM',
          '面向对象操作，自动生成 SQL；上手门槛高、SQL 难优化',
          '不想写 SQL、模型稳定的项目',
        ],
        [
          'Spring Data JPA',
          'JPA 规范实现',
          '基于 Hibernate，方法名即查询；标准化、换库容易',
          '中小型 / 标准化项目',
        ],
      ]}
    />
    <Callout type="tip" title="MyBatis 为什么在国内这么火">
      企业项目里 SQL 往往复杂（多表、统计、调优），需要 DBA 能直接看懂、能加索引提示、能精确控制。
      <Text bold>MyBatis 让 SQL 完全可见、可控</Text>，这正是它压过全自动框架 Hibernate 的关键原因。
    </Callout>

    <Divider />

    <Subtitle>四、半自动 ORM 与适用场景</Subtitle>
    <Paragraph>
      <Text bold>ORM（Object Relational Mapping，对象关系映射）</Text>
      指在「数据库表/行」和「Java 类/对象」之间建立映射。按自动化程度，MyBatis
      被称为<Text bold>「半自动」ORM</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>自动的部分</Text>：参数绑定、结果集到对象的封装（表 ↔ 对象的映射）。
      </ListItem>
      <ListItem>
        <Text bold>手动的部分</Text>：SQL 语句本身要你自己写（Hibernate 这部分是自动的）。
      </ListItem>
    </UnorderedList>
    <Paragraph>什么时候选 MyBatis：</Paragraph>
    <UnorderedList>
      <ListItem>SQL 复杂、需要精细优化（绝大多数互联网/企业后台）；</ListItem>
      <ListItem>团队熟悉 SQL，希望对每条语句都心里有数；</ListItem>
      <ListItem>需要灵活拼接动态条件、做多表统计报表。</ListItem>
    </UnorderedList>

    <Callout type="success" title="本章小结">
      <UnorderedList>
        <ListItem>
          MyBatis 是<Text bold>持久层框架</Text>，封装 JDBC，让你「专注写 SQL，框架做映射」。
        </ListItem>
        <ListItem>
          它解决了 JDBC 的四大痛点：样板多、SQL 硬编码、手动设参/封装、连接不池化。
        </ListItem>
        <ListItem>
          它是<Text bold>半自动 ORM</Text>——SQL 自己写、映射框架做，因此 SQL 可控、易优化，是国内企业主流。
        </ListItem>
        <ListItem>
          下一节我们就动手跑通第一个 MyBatis 程序。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
