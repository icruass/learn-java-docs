import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>JDBC 事务控制基础</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        第 14 章我们在 MySQL 命令行里用 <InlineCode>START TRANSACTION</InlineCode> /{' '}
        <InlineCode>COMMIT</InlineCode> / <InlineCode>ROLLBACK</InlineCode> 控制事务；第 16
        章我们学会了用 Java（JDBC）发送 SQL。本章把两者结合：
        <Text bold>在 Java 代码里控制事务</Text>
        ，让「转账」这种多步操作在程序中也能做到「要么全成功、要么全回滚」。
      </Paragraph>
      <Paragraph>本章讲透：</Paragraph>
      <OrderedList>
        <ListItem>JDBC 默认的事务行为（每条 SQL 自动提交）为什么不够用；</ListItem>
        <ListItem>
          用 <InlineCode>Connection</InlineCode> 的三个方法（
          <InlineCode>setAutoCommit</InlineCode> / <InlineCode>commit</InlineCode> /{' '}
          <InlineCode>rollback</InlineCode>）控制事务；
        </ListItem>
        <ListItem>
          <InlineCode>try-catch-finally</InlineCode> 中管理事务的<Text bold>标准写法</Text>；
        </ListItem>
        <ListItem>用转账案例，对比「不开事务会丢钱」和「开事务能回滚」。</ListItem>
      </OrderedList>
      <Paragraph>
        本章是第 14 章（事务理论）和第 16 章（JDBC）的合体，沿用{' '}
        <InlineCode>db_learn</InlineCode> 的账户表。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>〇、准备示例表</Subtitle>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE account (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  name  VARCHAR(20),
  money DOUBLE
);
INSERT INTO account (name, money) VALUES ('张三', 1000), ('李四', 1000);`}
    />

    <Divider />

    <Subtitle>一、JDBC 默认的事务行为</Subtitle>
    <Paragraph>
      第 14 章讲过 MySQL 默认「自动提交」。在 JDBC 里同样如此：
      <Text bold>
        每执行一条 SQL（<InlineCode>executeUpdate</InlineCode>），就立即自动提交一次
      </Text>
      ，无法回滚。
    </Paragraph>
    <Paragraph>
      这意味着，下面这段转账代码<Text bold>藏着大坑</Text>：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`// ❌ 没有事务管理的转账（危险！）
conn = JDBCUtils.getConnection();
String sql1 = "UPDATE account SET money = money - 500 WHERE name = '张三'";
String sql2 = "UPDATE account SET money = money + 500 WHERE name = '李四'";

PreparedStatement ps1 = conn.prepareStatement(sql1);
ps1.executeUpdate();      // ← 张三的钱立刻被扣并提交！

int i = 1 / 0;            // ← 假设这里发生异常（模拟程序出错）

PreparedStatement ps2 = conn.prepareStatement(sql2);
ps2.executeUpdate();      // ← 这行根本执行不到`}
    />
    <Paragraph>
      结果：第一条已经<Text bold>自动提交</Text>，张三少了 500；第二条因异常没执行，李四没收到。
      <Text bold>500 元凭空消失</Text>——正是第 14 章说的「执行一半」的灾难。
    </Paragraph>

    <Divider />

    <Subtitle>二、用 Connection 控制事务</Subtitle>
    <Paragraph>
      JDBC 通过 <InlineCode>Connection</InlineCode> 对象的三个方法管理事务，和 SQL 命令一一对应：
    </Paragraph>
    <Table
      head={['JDBC 方法', '对应 SQL', '含义']}
      rows={[
        ['conn.setAutoCommit(false)', 'START TRANSACTION', '关闭自动提交 = 开启事务'],
        ['conn.commit()', 'COMMIT', '提交事务，所有改动永久生效'],
        ['conn.rollback()', 'ROLLBACK', '回滚事务，撤销本次所有改动'],
      ]}
    />
    <Paragraph>
      核心思路：
      <Text bold>
        在执行多条 SQL 之前关闭自动提交，全部成功后 <InlineCode>commit</InlineCode>，中途出错则{' '}
        <InlineCode>rollback</InlineCode>。
      </Text>
    </Paragraph>
  </article>
);

export default index;
