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
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>本章小结与面试问答</Title>

    <Subtitle>七、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>SQL（Structured Query Language，结构化查询语言）</Text>{' '}
        是操作关系型数据库的<Text bold>统一语言</Text>，"学一次，走天下"。
      </ListItem>
      <ListItem>
        SQL 有<Text bold>国际标准</Text>，保证主干语法通用；各厂商又有
        <Text bold>方言（私有扩展）</Text>，导致不同数据库细节有差异（如 MySQL 用{' '}
        <InlineCode>LIMIT</InlineCode>、Oracle 用 <InlineCode>ROWNUM</InlineCode>）。本教程默认讲{' '}
        <Text bold>MySQL 方言</Text>。
      </ListItem>
      <ListItem>
        <Text bold>通用语法规则</Text>：
        <UnorderedList>
          <ListItem>
            可单行可多行；<Text bold>以分号 <InlineCode>;</InlineCode> 结束</Text>一条语句。
          </ListItem>
          <ListItem>
            <Text bold>关键字不区分大小写</Text>，但<Text bold>建议大写</Text>
            ；注意库名 / 表名在 Linux 上区分大小写——<Text bold>统一小写</Text>最稳妥。
          </ListItem>
          <ListItem>
            空格 / 缩进随便加（至少一个分隔），主要用于<Text bold>提升可读性</Text>
            ；但<Text bold>引号内的空格属于数据本身</Text>。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>三种注释</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>-- 内容</InlineCode>（标准，
            <Text bold><InlineCode>--</InlineCode> 后必须有空格</Text>）
          </ListItem>
          <ListItem>
            <InlineCode># 内容</InlineCode>（<Text bold>MySQL 方言</Text>，慎用）
          </ListItem>
          <ListItem>
            <InlineCode>/* 内容 */</InlineCode>（标准多行，<Text bold>不能嵌套</Text>）
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>四大分类（核心）</Text>：
        <UnorderedList>
          <ListItem>
            <Text bold>DDL</Text>（<InlineCode>CREATE</InlineCode>/
            <InlineCode>ALTER</InlineCode>/<InlineCode>DROP</InlineCode>/
            <InlineCode>TRUNCATE</InlineCode>）—— 操作<Text bold>结构</Text>，通常不可回滚。
          </ListItem>
          <ListItem>
            <Text bold>DML</Text>（<InlineCode>INSERT</InlineCode>/
            <InlineCode>UPDATE</InlineCode>/<InlineCode>DELETE</InlineCode>）—— 操作
            <Text bold>数据</Text>，改增删时
            <Text bold>务必带 <InlineCode>WHERE</InlineCode></Text>。
          </ListItem>
          <ListItem>
            <Text bold>DQL</Text>（<InlineCode>SELECT</InlineCode>）—— <Text bold>查询</Text>
            数据，只读；本属 DML，因重要而单列，是后续学习重点。
          </ListItem>
          <ListItem>
            <Text bold>DCL</Text>（<InlineCode>GRANT</InlineCode>/
            <InlineCode>REVOKE</InlineCode>）—— 管理<Text bold>用户与权限</Text>。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        判断归类：<Text bold>看第一个关键字（动词）即可。</Text>
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>八、常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>Q1：SQL 的四大分类是什么？各自的关键字？</Text>
    </Paragraph>
    <Paragraph>
      A：DDL（<InlineCode>CREATE</InlineCode>/<InlineCode>ALTER</InlineCode>/
      <InlineCode>DROP</InlineCode>/<InlineCode>TRUNCATE</InlineCode>，操作结构）、DML（
      <InlineCode>INSERT</InlineCode>/<InlineCode>UPDATE</InlineCode>/
      <InlineCode>DELETE</InlineCode>，操作数据）、DQL（<InlineCode>SELECT</InlineCode>
      ，查询数据）、DCL（<InlineCode>GRANT</InlineCode>/<InlineCode>REVOKE</InlineCode>
      ，控制权限）。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q2：<InlineCode>DELETE</InlineCode>、<InlineCode>TRUNCATE</InlineCode>、
        <InlineCode>DROP</InlineCode> 三者的区别？
      </Text>
    </Paragraph>
    <Paragraph>A：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>DELETE</InlineCode>（DML）：逐行删数据，可带 <InlineCode>WHERE</InlineCode>{' '}
        删部分，可回滚，自增不重置，表结构还在。
      </ListItem>
      <ListItem>
        <InlineCode>TRUNCATE</InlineCode>（DDL）：整表清空，不能带{' '}
        <InlineCode>WHERE</InlineCode>，不可回滚，自增重置归零，表结构还在，速度快。
      </ListItem>
      <ListItem>
        <InlineCode>DROP</InlineCode>（DDL）：
        <Text bold>连表结构带数据一起删掉</Text>，表彻底消失，不可回滚。
      </ListItem>
      <ListItem>
        一句话：删数据用 <InlineCode>DELETE</InlineCode>/<InlineCode>TRUNCATE</InlineCode>
        ，删表用 <InlineCode>DROP</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>
        Q3：为什么 <InlineCode>SELECT</InlineCode> 被单独叫做 DQL，而不是归到 DML？
      </Text>
    </Paragraph>
    <Paragraph>
      A：从标准定义看 <InlineCode>SELECT</InlineCode>{' '}
      本属 DML（数据操作的一种）；但因查询是实际使用中最频繁、最复杂、最核心的部分，工程和教学习惯把它单独剥离出来称为
      DQL，以示重视。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q4：<InlineCode>--</InlineCode> 注释为什么有时不生效 / 报错？
      </Text>
    </Paragraph>
    <Paragraph>
      A：标准 SQL 要求 <InlineCode>--</InlineCode> 后必须紧跟一个<Text bold>空格</Text>
      （或控制字符）才被识别为注释。写成 <InlineCode>--内容</InlineCode>
      （紧贴）不会被当作注释，从而引发语法错误。
    </Paragraph>
    <Paragraph>
      <Text bold>Q5：同一条 SQL 在 MySQL 能跑，换到 Oracle 报错，为什么？</Text>
    </Paragraph>
    <Paragraph>
      A：很可能用到了 <Text bold>MySQL 方言</Text>（如 <InlineCode>LIMIT</InlineCode>、
      <InlineCode>#</InlineCode> 注释、<InlineCode>AUTO_INCREMENT</InlineCode>
      、反引号等），这些不属于通用标准，其他数据库不识别。需改用目标数据库对应的语法。
    </Paragraph>
    <Paragraph>
      <Text bold>Q6：SQL 关键字到底区分不区分大小写？</Text>
    </Paragraph>
    <Paragraph>
      A：<Text bold>关键字不区分</Text>（<InlineCode>SELECT</InlineCode> 与{' '}
      <InlineCode>select</InlineCode>{' '}
      等价）。但要注意：①列值是否区分大小写取决于排序规则（collation）；②库名 /
      表名在 Linux 下默认区分大小写、Windows
      下不区分。规范建议：关键字大写，库 / 表 / 字段名一律小写。
    </Paragraph>

    <Divider />

    <Subtitle>附录：本章示例所用建表与初始数据（统一示例库 db_learn）</Subtitle>
    <Callout type="note">
      后续各章会反复用到下面这套表与数据，请先执行一遍备用。
    </Callout>
    <CodeBlock
      language="sql"
      code={`-- 创建并切换到示例库
CREATE DATABASE IF NOT EXISTS db_learn DEFAULT CHARSET utf8mb4;
USE db_learn;

-- 部门表（dept）
CREATE TABLE dept (
    id        INT PRIMARY KEY AUTO_INCREMENT,  -- 部门编号
    dept_name VARCHAR(20),                      -- 部门名称
    loc       VARCHAR(20)                       -- 所在城市
);
INSERT INTO dept (dept_name, loc) VALUES
    ('研发部', '北京'),
    ('市场部', '上海'),
    ('财务部', '广州');

-- 员工表（emp），与 dept 一对多，dept_id 为外键
CREATE TABLE emp (
    id        INT PRIMARY KEY AUTO_INCREMENT,  -- 员工编号
    ename     VARCHAR(20),                      -- 姓名
    gender    CHAR(1),                          -- 性别 男/女
    salary    DOUBLE,                           -- 工资
    join_date DATE,                             -- 入职日期
    dept_id   INT,                              -- 所属部门(外键->dept.id)
    bonus     DOUBLE,                           -- 奖金(可能为 NULL)
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
    ('张三', '男', 8000,  '2020-01-10', 1, 1000),
    ('李四', '男', 12000, '2019-03-15', 1, NULL),
    ('王五', '女', 9500,  '2021-06-01', 2, 2000),
    ('赵六', '女', 6000,  '2022-09-20', 2, NULL),
    ('孙七', '男', 15000, '2018-11-05', 3, 3000);`}
    />
    <Callout type="tip">
      至此，你已经拿到了"地图（四大分类）"和"交通规则（通用语法）"。
      <Text bold>
        下一章起，我们将正式上路——从 DDL 开始，一步步学习如何亲手创建数据库、设计表结构。
      </Text>
    </Callout>
  </article>
);

export default index;
