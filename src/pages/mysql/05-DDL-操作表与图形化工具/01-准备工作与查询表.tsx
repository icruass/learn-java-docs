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
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>准备工作与查询表</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        在上一章里，我们用 DDL（Data Definition Language，数据定义语言）学会了「操作数据库」——
        <InlineCode>CREATE DATABASE</InlineCode> / <InlineCode>SHOW DATABASES</InlineCode> /{' '}
        <InlineCode>DROP DATABASE</InlineCode> / <InlineCode>USE</InlineCode>
        。可是「库」只是一个空壳容器，真正用来装数据的是<Text bold>表（Table）</Text>。
      </Paragraph>
      <Paragraph>你可以这样类比：</Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>数据库</Text> = 一个 Excel 工作簿（一个 <InlineCode>.xlsx</InlineCode> 文件）；
        </ListItem>
        <ListItem>
          <Text bold>表</Text> = 工作簿里的一张工作表（Sheet）；
        </ListItem>
        <ListItem>
          <Text bold>列（字段）</Text> = 表头那一行（姓名、工资、入职日期……）；
        </ListItem>
        <ListItem>
          <Text bold>行（记录）</Text> = 表里的每一条数据。
        </ListItem>
      </UnorderedList>
      <Paragraph>本章我们把镜头从「库」拉近到「表」，要把表这一层彻底讲透，具体包括：</Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>查询表</Text>：怎么看库里有哪些表、一张表长什么样；
        </ListItem>
        <ListItem>
          <Text bold>创建表</Text>：<InlineCode>CREATE TABLE</InlineCode> 的完整语法，并亲手把贯穿全套教程的{' '}
          <InlineCode>dept</InlineCode>、<InlineCode>emp</InlineCode> 两张表建出来；
        </ListItem>
        <ListItem>
          <Text bold>数据类型</Text>：建表时每个列要声明「类型」，这是 MySQL 最容易踩坑、也最体现功底的地方（
          <InlineCode>INT</InlineCode> 还是 <InlineCode>BIGINT</InlineCode>？<InlineCode>DOUBLE</InlineCode> 还是{' '}
          <InlineCode>DECIMAL</InlineCode>？<InlineCode>CHAR</InlineCode> 还是 <InlineCode>VARCHAR</InlineCode>？
          <InlineCode>DATETIME</InlineCode> 还是 <InlineCode>TIMESTAMP</InlineCode>？）；
        </ListItem>
        <ListItem>
          <Text bold>删除表</Text>：<InlineCode>DROP TABLE</InlineCode>；
        </ListItem>
        <ListItem>
          <Text bold>修改表</Text>：<InlineCode>ALTER TABLE</InlineCode>——改表名、改字符集、加列、改列、删列；
        </ListItem>
        <ListItem>
          <Text bold>复制表结构</Text>：<InlineCode>CREATE TABLE ... LIKE ...</InlineCode>；
        </ListItem>
        <ListItem>
          <Text bold>图形化工具</Text>：SQLyog / Navicat 怎么连接、怎么可视化建库建表、为什么说「鼠标点点点的本质还是在生成 SQL」。
        </ListItem>
      </OrderedList>
      <Paragraph>
        学完本章，你就能<Text bold>徒手定义出符合业务需要、类型选得恰到好处的表结构</Text>
        。这是后面所有 DML（增删改数据）、DQL（查询数据）章节的地基——没有合理的表，写再花哨的查询都是空中楼阁。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>0. 准备工作：先把库建好、切进去</Subtitle>
    <Paragraph>
      本章所有示例都在数据库 <InlineCode>db_learn</InlineCode>{' '}
      里操作。先确保它存在并切换进去（这是上一章的内容，这里快速回顾）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 如果不存在就创建，避免重复执行报错
CREATE DATABASE IF NOT EXISTS db_learn
    DEFAULT CHARACTER SET utf8mb4;

-- 切换到该库，之后的所有建表/查表都在这个库里发生
USE db_learn;`}
    />
    <Paragraph>执行结果（命令行下）：</Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.01 sec)
Database changed`}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：<InlineCode>USE db_learn;</InlineCode>{' '}
      之后，命令行提示符虽然不变，但「当前数据库」已经变了。后续 <InlineCode>CREATE TABLE emp ...</InlineCode> 等价于{' '}
      <InlineCode>CREATE TABLE db_learn.emp ...</InlineCode>。如果不先 <InlineCode>USE</InlineCode>
      ，又不写库名前缀，MySQL 会报 <InlineCode>ERROR 1046 (3D000): No database selected</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>1. DDL 操作表的整体认识</Subtitle>
    <Paragraph>操作「表」一共四类动作，和操作「库」一一对应，记忆负担很小：</Paragraph>
    <Table
      head={['动作', '关键字', '操作库（上一章）', '操作表（本章）']}
      rows={[
        ['查（Retrieve）', 'SHOW / DESC', 'SHOW DATABASES;', 'SHOW TABLES; / DESC 表名;'],
        ['增（Create）', 'CREATE', 'CREATE DATABASE 库名;', 'CREATE TABLE 表名(...);'],
        ['删（Drop）', 'DROP', 'DROP DATABASE 库名;', 'DROP TABLE 表名;'],
        ['改（Alter）', 'ALTER', 'ALTER DATABASE ...;', 'ALTER TABLE ...;'],
      ]}
    />
    <Paragraph>
      我们按「<Text bold>先会看 → 再会建 → 弄懂类型 → 会删 → 会改 → 会复制</Text>
      」的顺序展开。先教「查」，是因为你创建任何东西之后，第一反应都应该是「查一下，看看是不是真建对了」。
    </Paragraph>

    <Divider />

    <Subtitle>2. 查询表</Subtitle>
    <Callout type="tip">
      这一节有个小小的「先有鸡还是先有蛋」问题：库里现在还没有表，<InlineCode>SHOW TABLES</InlineCode>{' '}
      会是空的。没关系，你先记住这些命令的用法，等第 3 节建完表，回头再跑一遍就能看到效果了。本节末尾会给出「建表后」的真实结果。
    </Callout>

    <Heading3>2.1 查看当前库里有哪些表：<InlineCode>SHOW TABLES;</InlineCode></Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SHOW TABLES;`} />
    <Paragraph>
      <Text bold>逐项解释：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>SHOW TABLES</InlineCode> 列出<Text bold>当前所选数据库</Text>（即你 <InlineCode>USE</InlineCode>
        {' '}的那个库）里的所有表名。
      </ListItem>
      <ListItem>
        想看别的库的表，可以加 <InlineCode>FROM</InlineCode>：<InlineCode>SHOW TABLES FROM 库名;</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例（在还没建表时执行）：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SHOW TABLES;`} />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <CodeBlock language="text" code={`Empty set (0.00 sec)`} />
    <Paragraph>
      空的，符合预期。等会儿建完 <InlineCode>dept</InlineCode>、<InlineCode>emp</InlineCode> 再来看。
    </Paragraph>

    <Heading3>2.2 查看表结构：<InlineCode>DESC 表名;</InlineCode></Heading3>
    <Paragraph>
      <InlineCode>DESC</InlineCode> 是 <InlineCode>DESCRIBE</InlineCode> 的缩写，用来
      <Text bold>快速查看一张表有哪些列、每列什么类型、有没有约束</Text>
      。这是日常用得最频繁的命令之一——拿到一张陌生的表，第一件事就是 <InlineCode>DESC</InlineCode> 它。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DESC 表名;
-- 或写全：DESCRIBE 表名;`}
    />
    <Paragraph>
      <Text bold>示例（建完 emp 表后）：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`DESC emp;`} />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <Table
      head={['Field', 'Type', 'Null', 'Key', 'Default', 'Extra']}
      rows={[
        ['id', 'int', 'NO', 'PRI', 'NULL', 'auto_increment'],
        ['ename', 'varchar(20)', 'YES', '', 'NULL', ''],
        ['gender', 'char(1)', 'YES', '', 'NULL', ''],
        ['salary', 'double', 'YES', '', 'NULL', ''],
        ['join_date', 'date', 'YES', '', 'NULL', ''],
        ['dept_id', 'int', 'YES', 'MUL', 'NULL', ''],
        ['bonus', 'double', 'YES', '', 'NULL', ''],
      ]}
    />
    <Paragraph>
      <Text bold>怎么读这张表：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Field</Text>：列名。
      </ListItem>
      <ListItem>
        <Text bold>Type</Text>：列的数据类型（第 3 节会逐一讲）。
      </ListItem>
      <ListItem>
        <Text bold>Null</Text>：该列是否允许为 <InlineCode>NULL</InlineCode>。<InlineCode>YES</InlineCode> 允许，
        <InlineCode>NO</InlineCode> 不允许。
      </ListItem>
      <ListItem>
        <Text bold>Key</Text>：键信息。<InlineCode>PRI</InlineCode> 主键、<InlineCode>UNI</InlineCode> 唯一键、
        <InlineCode>MUL</InlineCode> 普通索引/外键列（Multiple，表示允许重复值的索引）。
      </ListItem>
      <ListItem>
        <Text bold>Default</Text>：默认值。没设就是 <InlineCode>NULL</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>Extra</Text>：附加信息。常见的有 <InlineCode>auto_increment</InlineCode>（自增）。
      </ListItem>
    </UnorderedList>

    <Heading3>2.3 查看建表语句：<InlineCode>SHOW CREATE TABLE 表名;</InlineCode></Heading3>
    <Paragraph>
      <InlineCode>DESC</InlineCode> 是「精简版」结构，而 <InlineCode>SHOW CREATE TABLE</InlineCode> 会把这张表
      <Text bold>完整的建表 SQL</Text>
      反向「打印」出来——包含字符集、存储引擎、约束的完整定义。当你想「照着已有表再建一张类似的表」或「排查字符集/引擎问题」时非常有用。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SHOW CREATE TABLE 表名;`} />
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SHOW CREATE TABLE emp;`} />
    <Paragraph>
      <Text bold>结果（关键部分）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE \`emp\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`ename\` varchar(20) DEFAULT NULL,
  \`gender\` char(1) DEFAULT NULL,
  \`salary\` double DEFAULT NULL,
  \`join_date\` date DEFAULT NULL,
  \`dept_id\` int DEFAULT NULL,
  \`bonus\` double DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`fk_emp_dept\` (\`dept_id\`),
  CONSTRAINT \`fk_emp_dept\` FOREIGN KEY (\`dept_id\`) REFERENCES \`dept\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`}
    />
    <Paragraph>
      <Text bold>注意几个细节：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        列名/表名被反引号 <InlineCode>`</InlineCode> 包起来了。反引号是 MySQL
        用来「转义标识符」的，避免列名和关键字撞车（比如你真的想把列叫 <InlineCode>order</InlineCode>、
        <InlineCode>desc</InlineCode>）。手写时一般不用加，让 MySQL 自动加即可。
      </ListItem>
      <ListItem>
        <InlineCode>ENGINE=InnoDB</InlineCode>：存储引擎。现代 MySQL 默认就是
        InnoDB（支持事务、外键、行锁），后面讲事务时会再展开。
      </ListItem>
      <ListItem>
        <InlineCode>DEFAULT CHARSET=utf8mb4</InlineCode>：字符集。
      </ListItem>
      <ListItem>
        <InlineCode>AUTO_INCREMENT=6</InlineCode>：表示下一个自增 id 会从 6 开始（因为我们已经插了 5 条数据）。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      <Text bold>三者怎么选用</Text>：日常看「有哪些表」用 <InlineCode>SHOW TABLES</InlineCode>
      ；想快速扫一眼「字段和类型」用 <InlineCode>DESC</InlineCode>；想看「完整定义/复制建表语句」用{' '}
      <InlineCode>SHOW CREATE TABLE</InlineCode>。
    </Callout>
  </article>
);

export default index;
