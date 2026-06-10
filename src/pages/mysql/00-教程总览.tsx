import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  Callout,
  Table,
  OrderedList,
  ListItem,
  DocLink,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>MySQL 系统学习教程</Title>

    <Callout type="note" title="教程说明">
      <Paragraph>
        本教程将原始视频目录（p477–p568）扩展为{' '}
        <Text bold>19 篇成体系的中文教学文档</Text>
        ，由浅入深、环环相扣，面向「有编程基础、但 MySQL
        不熟」的读者。每个知识点都配<Text bold>真实可执行的 SQL/Java 示例</Text>
        ，并标注 ⚠️ 注意、💡 提示、🕳️ 常见坑。
      </Paragraph>
      <Paragraph>
        <Text bold>全套文档共用同一套示例数据库 </Text>
        <InlineCode>db_learn</InlineCode>（<InlineCode>dept</InlineCode>/
        <InlineCode>emp</InlineCode> 员工部门、<InlineCode>student</InlineCode>/
        <InlineCode>course</InlineCode> 选课、<InlineCode>account</InlineCode>{' '}
        账户、<InlineCode>user</InlineCode>{' '}
        用户等），例子前后呼应，串成一条完整的学习主线。
      </Paragraph>
    </Callout>

    <Subtitle>学习路线与目录</Subtitle>

    <Text bold>第一部分：入门与环境（理解数据库 + 装好环境）</Text>
    <Table
      head={['#', '文档', '你将学到']}
      rows={[
        ['01', <DocLink to="/docs/mysql/01/01">数据库基本概念</DocLink>, 'DB/DBMS/SQL 关系、关系型 vs NoSQL、常见数据库软件'],
        ['02', <DocLink to="/docs/mysql/02">MySQL 安装卸载与服务管理</DocLink>, '安装/卸载、服务启停、登录退出、目录结构'],
        ['03', <DocLink to="/docs/mysql/03">SQL 概述与通用语法</DocLink>, 'SQL 语法规则、注释、四大分类 DDL/DML/DQL/DCL'],
      ]}
    />

    <Text bold>第二部分：DDL &amp; DML（建库建表、增删改数据）</Text>
    <Table
      head={['#', '文档', '你将学到']}
      rows={[
        ['04', <DocLink to="/docs/mysql/04">DDL-操作数据库</DocLink>, '库的创建/查询/修改/删除、USE 切换'],
        ['05', <DocLink to="/docs/mysql/05">DDL-操作表与图形化工具</DocLink>, '建表、数据类型详解、改表、SQLyog'],
        ['06', <DocLink to="/docs/mysql/06">DML-数据增删改</DocLink>, 'INSERT / DELETE / UPDATE、DELETE vs TRUNCATE'],
      ]}
    />

    <Text bold>第三部分：DQL 查询（数据库最核心的能力）</Text>
    <Table
      head={['#', '文档', '你将学到']}
      rows={[
        ['07', <DocLink to="/docs/mysql/07">DQL-基础查询与条件查询</DocLink>, 'SELECT、别名、去重、WHERE、LIKE 模糊查询'],
        ['08', <DocLink to="/docs/mysql/08">DQL-排序-聚合-分组-分页</DocLink>, 'ORDER BY、聚合函数、GROUP BY/HAVING、LIMIT 分页'],
      ]}
    />

    <Text bold>第四部分：约束与表设计（如何把表设计好）</Text>
    <Table
      head={['#', '文档', '你将学到']}
      rows={[
        ['09', <DocLink to="/docs/mysql/09">约束</DocLink>, '非空/唯一/主键/自增/外键/级联'],
        ['10', <DocLink to="/docs/mysql/10">多表关系设计</DocLink>, '一对多/多对多/一对一 的设计与实现'],
        ['11', <DocLink to="/docs/mysql/11">数据库三大范式</DocLink>, '1NF/2NF/3NF、函数依赖、反范式'],
        ['12', <DocLink to="/docs/mysql/12">数据库备份与还原</DocLink>, 'mysqldump 备份、source/重定向 还原'],
      ]}
    />

    <Text bold>第五部分：多表查询、事务与权限（进阶核心）</Text>
    <Table
      head={['#', '文档', '你将学到']}
      rows={[
        ['13', <DocLink to="/docs/mysql/13">多表查询</DocLink>, '笛卡尔积、内连接、外连接、子查询三形态'],
        ['14', <DocLink to="/docs/mysql/14">事务</DocLink>, 'ACID、并发三问题、四种隔离级别'],
        ['15', <DocLink to="/docs/mysql/15">DCL-用户与权限管理</DocLink>, '用户增删查、改密码、GRANT/REVOKE 授权'],
      ]}
    />

    <Text bold>第六部分：JDBC —— 用 Java 操作数据库</Text>
    <Table
      head={['#', '文档', '你将学到']}
      rows={[
        ['16', <DocLink to="/docs/mysql/16">JDBC 核心详解</DocLink>, '六步骤、五大核心类、防 SQL 注入、工具类、登录案例'],
        ['17', <DocLink to="/docs/mysql/17">JDBC 事务管理</DocLink>, 'setAutoCommit/commit/rollback、转账案例'],
        ['18', <DocLink to="/docs/mysql/18">数据库连接池</DocLink>, '连接池原理、C3P0、Druid 与工具类封装'],
        ['19', <DocLink to="/docs/mysql/19">JDBCTemplate</DocLink>, 'Spring 封装、update/query/queryForObject'],
      ]}
    />

    <Subtitle>公共示例数据库一览（db_learn）</Subtitle>
    <Table
      head={['表', '含义', '主要用在']}
      rows={[
        ['dept / emp', '部门 / 员工（一对多 + 外键）', '约束、多表查询、聚合分组'],
        ['student / course / student_course', '学生 / 课程（多对多 + 中间表）', '多表关系、范式'],
        ['person / card', '人 / 身份证（一对一）', '多表关系'],
        ['account', '账户（余额）', '事务、JDBC 事务'],
        ['user', '用户（登录）', 'JDBC、连接池、JDBCTemplate'],
      ]}
    />

    <Subtitle>建议学习方式</Subtitle>
    <OrderedList>
      <ListItem>
        <Text bold>按编号顺序学</Text>
        ：文档是层层递进设计的，后一章常依赖前一章的表和概念。
      </ListItem>
      <ListItem>
        <Text bold>边看边敲</Text>：每个 SQL 示例都亲手在 MySQL
        里跑一遍，结果和文档对照。
      </ListItem>
      <ListItem>
        <Text bold>重点章多花时间</Text>：第 07/08（DQL）、第 13（多表查询）、第
        14（事务）、第 16（JDBC）是重中之重，也是面试高频。
      </ListItem>
      <ListItem>
        <Text bold>关注 🕳️ 常见坑</Text>：这些是真实开发中最容易栽跟头的地方。
      </ListItem>
    </OrderedList>
  </article>
);

export default index;
