import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>本章小结与面试问答</Title>

    <Subtitle>本章小结</Subtitle>
    <Paragraph>把本章的核心要点列成清单，回顾一下：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>为什么要数据库</Text>：相比 txt/Excel
        等普通文件，数据库解决了五大痛点——
        <Text bold>查找慢、并发乱、数据冗余不一致、无校验、难共享/备份/授权</Text>。
      </ListItem>
      <ListItem>
        <Text bold>DB / DBMS / SQL 三者关系</Text>：
        <UnorderedList>
          <ListItem>DB = 数据本身（仓库里的书）；</ListItem>
          <ListItem>DBMS = 管理数据的软件（图书管理员，如 MySQL）；</ListItem>
          <ListItem>SQL = 与 DBMS 沟通的标准语言（你说的话）。</ListItem>
          <ListItem>
            口语里的“MySQL 数据库”通常指 <Text bold>DBMS 软件</Text>
            ，而真正的“数据库”是它里面的库（如 <InlineCode>db_learn</InlineCode>）。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>层级模型</Text>：<InlineCode>DBMS → 数据库 → 表 → 行(记录)/列(字段)</InlineCode>
        。一张表 ≈ Java 里的 <InlineCode>List&lt;对象&gt;</InlineCode>，列 ≈
        成员变量，行 ≈ 对象，<InlineCode>NULL</InlineCode> ≈ <InlineCode>null</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>关系型数据库（RDBMS）</Text>：用二维表存数据、表间可建关系（外键、JOIN），事务满足{' '}
        <Text bold>ACID（原子性、一致性、隔离性、持久性）</Text>
        ，适合订单/账户等强一致业务。
      </ListItem>
      <ListItem>
        <Text bold>非关系型数据库（NoSQL）</Text>：结构灵活、扩展性强、性能高，分
        <Text bold>键值（Redis）、文档（MongoDB）、列族（HBase）、图（Neo4j）</Text>{' '}
        四类，常作为 RDBMS 的补充与之并用。
      </ListItem>
      <ListItem>
        <Text bold>常见 RDBMS 软件</Text>：Oracle（收费旗舰）、MySQL（开源主流，本教程主角）、SQL
        Server（微软系）、DB2（IBM 系）、PostgreSQL（强大开源）、SQLite（嵌入式单文件）、MariaDB（MySQL
        的开源分支）。
      </ListItem>
      <ListItem>
        <Text bold>MySQL</Text>：1995 诞生，收购链路{' '}
        <Text bold>MySQL AB → Sun → Oracle</Text>；分
        <Text bold>社区版（免费）/企业版（付费）</Text>；
        <Text bold>8.x 默认 utf8mb4、性能更好、特性更全</Text>，新项目首选；因免费、易学、岗位需求大、与
        Java 生态契合，成为 <Text bold>Java 学习的首选数据库</Text>。
      </ListItem>
    </UnorderedList>

    <Subtitle>常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>Q1：DB、DBMS、SQL 有什么区别？</Text>
    </Paragraph>
    <Paragraph>
      A：DB 是数据本身（仓库）；DBMS 是管理数据的软件（如 MySQL、Oracle）；SQL
      是操作数据库的标准语言。三者是“数据—管理软件—操作语言”的关系。
    </Paragraph>
    <Paragraph>
      <Text bold>Q2：我们平时说“用 MySQL 数据库”，这个说法严谨吗？</Text>
    </Paragraph>
    <Paragraph>
      A：不太严谨。MySQL 是一个 <Text bold>DBMS（软件）</Text>
      ，真正的“数据库（DB）”是 MySQL 内部你创建的那些库（如{' '}
      <InlineCode>db_learn</InlineCode>）。一个 MySQL 软件里可以装很多个数据库。
    </Paragraph>
    <Paragraph>
      <Text bold>Q3：关系型和非关系型数据库的核心区别？</Text>
    </Paragraph>
    <Paragraph>
      A：关系型用结构固定的二维表、支持表间关系和多表
      JOIN、事务满足
      ACID，适合强一致业务；非关系型结构灵活、易横向扩展、性能高但事务通常较弱，适合缓存、海量、灵活结构的数据。两者常配合使用。
    </Paragraph>
    <Paragraph>
      <Text bold>Q4：ACID 是哪四个？</Text>
    </Paragraph>
    <Paragraph>
      A：原子性（Atomicity，全做或全不做）、一致性（Consistency，前后状态合法）、隔离性（Isolation，并发互不干扰）、持久性（Durability，提交后永久保存）。
    </Paragraph>
    <Paragraph>
      <Text bold>Q5：MySQL 现在属于哪家公司？收购历史是怎样的？</Text>
    </Paragraph>
    <Paragraph>
      A：现属 <Text bold>Oracle（甲骨文）</Text>。链路：MySQL AB（瑞典）→ 被 Sun
      收购（2008）→ Sun 被 Oracle 收购（2010）。MySQL 创始人后来 fork 出了 MariaDB。
    </Paragraph>
    <Paragraph>
      <Text bold>Q6：MySQL 5.7 和 8.0 最直观的区别是什么？</Text>
    </Paragraph>
    <Paragraph>
      A：默认字符集不同——5.x 默认 <InlineCode>latin1</InlineCode>
      （易中文乱码），8.x 默认 <InlineCode>utf8mb4</InlineCode>（原生支持中文与
      emoji）；此外 8.x 性能更好，新增窗口函数、CTE 等特性，默认认证插件也换成了更安全的{' '}
      <InlineCode>caching_sha2_password</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：Redis 和 MySQL 是竞争关系吗？项目里会一起用吗？</Text>
    </Paragraph>
    <Paragraph>
      A：不是非此即彼。MySQL（关系型）负责持久、强一致的核心数据；Redis（键值型
      NoSQL）做缓存、加速热点读写。实际项目里两者经常<Text bold>搭配使用</Text>，各司其职。
    </Paragraph>

    <Callout type="note" title="下一章预告">
      概念已经清楚，下一章我们就动手<Text bold>安装并配置 MySQL（社区版）</Text>
      ，连上数据库，为写下第一条 SQL 做好准备。
    </Callout>
  </article>
);

export default index;
