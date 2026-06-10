import React from 'react';
import {
  Title,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>DB、DBMS、SQL：三个最容易混的概念</Title>
    <Paragraph>
      刚入门的人常把这三个词混着说。其实它们分工非常清楚，<Text bold>一句话区分</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>DB（DataBase，数据库）</Text>：存数据的“<Text bold>仓库</Text>
        ”——是被管理的“数据本身”。
      </ListItem>
      <ListItem>
        <Text bold>DBMS（DataBase Management System，数据库管理系统）</Text>
        ：管理这个仓库的“<Text bold>软件/管理员</Text>”——比如 MySQL、Oracle
        这些软件，本质都是 DBMS。
      </ListItem>
      <ListItem>
        <Text bold>SQL（Structured Query Language，结构化查询语言）</Text>
        ：你和 DBMS 沟通用的“<Text bold>命令/语言</Text>
        ”——你说“给我查工资大于 9000 的人”，就用 SQL 写出来。
      </ListItem>
    </UnorderedList>

    <Heading3>2.1 用一个生活类比彻底记住</Heading3>
    <Paragraph>
      把整套东西想象成一个<Text bold>图书馆</Text>：
    </Paragraph>
    <Table
      head={['概念', '类比', '说明']}
      rows={[
        ['DB', '馆里的书', '真正被存储、被查询的数据'],
        ['DBMS', '图书管理员', '负责存书、找书、保管、不让乱拿的那个“系统”'],
        ['SQL', '你说的话', '“帮我找本《Java 编程思想》”——你下达指令用的语言'],
      ]}
    />
    <Paragraph>
      你（程序/用户）<Text bold>从不直接去翻书堆</Text>，而是把需求用 SQL
      告诉管理员（DBMS），管理员去仓库（DB）里操作，再把结果递给你。
    </Paragraph>

    <Heading3>2.2 用 Java 的视角再看一遍</Heading3>
    <Paragraph>如果你写过 Java，可以这样对应：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>DBMS</Text> ≈ 你安装在电脑上的那个<Text bold>软件进程</Text>
        （比如 <InlineCode>mysqld.exe</InlineCode>
        在后台运行），相当于一个一直待命的“服务”。
      </ListItem>
      <ListItem>
        <Text bold>DB</Text> ≈ 这个软件管理的<Text bold>一组数据文件</Text>
        （具体存在磁盘上，你不用关心格式）。
      </ListItem>
      <ListItem>
        <Text bold>SQL</Text> ≈ 你的 Java 程序通过 JDBC
        <Text bold>发给数据库的那条命令字符串</Text>，例如：
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="java"
      code={`// Java 程序里，最终发给数据库的就是一条 SQL 字符串
String sql = "SELECT * FROM emp WHERE salary > 9000";`}
    />
    <CodeBlock
      language="sql"
      code={`-- 这条 SQL 就是“你说的话”，由 DBMS（如 MySQL）负责执行
SELECT * FROM emp WHERE salary > 9000;`}
    />
    <Paragraph>
      <Text bold>它们的关系图（从外到内）：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`用 SQL 下命令
      │
      ▼
┌─────────────────────────────────────┐
│   DBMS（如 MySQL 软件，负责管理）     │
│   ┌─────────────────────────────┐   │
│   │   DB（一个个数据库/仓库）     │   │
│   │   ┌───────────────────────┐ │   │
│   │   │  表 / 行 / 列（数据）  │ │   │
│   │   └───────────────────────┘ │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘`}
    />
    <Callout type="warning">
      日常口语里我们常说“我在用 MySQL 数据库”，这里的“MySQL”其实指的是
      <Text bold>DBMS</Text>（软件），而真正叫“数据库（DB）”的，是 MySQL
      里面那一个个你自己建的库（比如我们接下来要建的{' '}
      <InlineCode>db_learn</InlineCode>）。<Text bold>软件 ≠ 数据库</Text>，别再混了。
    </Callout>
    <Callout type="danger">
      很多人以为“SQL 是 MySQL 专属的”。其实 <Text bold>SQL 是一套国际标准语言</Text>
      （ISO/ANSI 标准），Oracle、SQL Server、PostgreSQL
      都支持。各家会在标准之上加自己的“方言”（比如 MySQL 的{' '}
      <InlineCode>LIMIT</InlineCode>、SQL Server 的 <InlineCode>TOP</InlineCode>
      ），但<Text bold>核心语法是通用的</Text>
      。这意味着你学会 MySQL 的 SQL，换别的数据库也能很快上手。
    </Callout>
  </article>
);

export default index;
