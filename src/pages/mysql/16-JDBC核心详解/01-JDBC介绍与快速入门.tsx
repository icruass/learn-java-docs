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
    <Title>JDBC 介绍与快速入门</Title>

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
  </article>
);

export default index;
