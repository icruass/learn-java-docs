import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Heading4,
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
    <Title>SELECT 基础语法与基础查询</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        前面几章我们学的都是"怎么把数据放进数据库"（DDL 建表、DML 增删改）。从本章开始，我们进入 MySQL 里
        <Text bold>使用频率最高、最重要</Text>的部分——
        <Text bold>DQL（Data Query Language，数据查询语言）</Text>，也就是{' '}
        <InlineCode>SELECT</InlineCode> 查询。
      </Paragraph>
      <Paragraph>
        打个比方：如果说数据库是一个巨大的仓库，前面几章是教你"怎么把货物搬进仓库、怎么摆放、怎么换货"，那么本章开始就是教你
        <Text bold>"怎么从仓库里精准地找到你想要的东西"</Text>。在真实工作中，你 90%
        以上的时间都在写查询语句——报表、列表、统计、接口数据……几乎都是{' '}
        <InlineCode>SELECT</InlineCode>。所以这一块务必学扎实。
      </Paragraph>
      <Paragraph>
        <InlineCode>SELECT</InlineCode> 是一个"大块头"，它的完整语法有 7
        个子句。本章我们先把<Text bold>全貌</Text>给你看清楚，然后聚焦讲透前三个最核心的部分：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>SELECT</Text>（查哪些列）
        </ListItem>
        <ListItem>
          <Text bold>FROM</Text>（从哪张表查）
        </ListItem>
        <ListItem>
          <Text bold>WHERE</Text>（满足什么条件才查出来）
        </ListItem>
      </UnorderedList>
      <Paragraph>
        至于 <InlineCode>GROUP BY</InlineCode>（分组）、<InlineCode>HAVING</InlineCode>
        （分组后过滤）、<InlineCode>ORDER BY</InlineCode>（排序）、
        <InlineCode>LIMIT</InlineCode>（分页），会在后续章节继续深入。本章是 DQL
        的"地基"，地基打牢了，后面的高楼才稳。
      </Paragraph>
    </Callout>

    <Callout type="note">
      本章沿用全套教程统一的示例数据库 <InlineCode>db_learn</InlineCode>，主要用到部门表{' '}
      <InlineCode>dept</InlineCode> 和员工表 <InlineCode>emp</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>0. 准备工作：建库建表与初始数据</Subtitle>
    <Paragraph>
      为了让后面所有的示例都能<Text bold>真实可执行</Text>
      ，请先把下面这段脚本完整执行一遍。后续章节也会复用这套数据，请务必保持一致。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 创建并切换到学习数据库
CREATE DATABASE IF NOT EXISTS db_learn DEFAULT CHARSET utf8mb4;
USE db_learn;

-- 部门表（一方）
CREATE TABLE dept (
    id INT PRIMARY KEY AUTO_INCREMENT,   -- 部门编号
    dept_name VARCHAR(20),               -- 部门名称
    loc VARCHAR(20)                      -- 所在城市
);
INSERT INTO dept (dept_name, loc) VALUES
    ('研发部','北京'), ('市场部','上海'), ('财务部','广州');

-- 员工表（多方，dept_id 外键指向 dept.id）
CREATE TABLE emp (
    id INT PRIMARY KEY AUTO_INCREMENT,   -- 员工编号
    ename VARCHAR(20),                   -- 姓名
    gender CHAR(1),                      -- 性别 男/女
    salary DOUBLE,                       -- 工资
    join_date DATE,                      -- 入职日期
    dept_id INT,                         -- 所属部门(外键->dept.id)
    bonus DOUBLE,                        -- 奖金(可能为 NULL，用于讲解 NULL)
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
    ('张三','男',8000, '2020-01-10', 1, 1000),
    ('李四','男',12000,'2019-03-15', 1, NULL),
    ('王五','女',9500, '2021-06-01', 2, 2000),
    ('赵六','女',6000, '2022-09-20', 2, NULL),
    ('孙七','男',15000,'2018-11-05', 3, 3000);`}
    />
    <Paragraph>
      执行后，<InlineCode>emp</InlineCode>{' '}
      表里的 5 条数据长这样（请记住它，后面每个例子都围绕它转）：
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', 'join_date', 'dept_id', 'bonus']}
      rows={[
        ['1', '张三', '男', '8000', '2020-01-10', '1', '1000'],
        ['2', '李四', '男', '12000', '2019-03-15', '1', 'NULL'],
        ['3', '王五', '女', '9500', '2021-06-01', '2', '2000'],
        ['4', '赵六', '女', '6000', '2022-09-20', '2', 'NULL'],
        ['5', '孙七', '男', '15000', '2018-11-05', '3', '3000'],
      ]}
    />
    <Paragraph>
      <InlineCode>dept</InlineCode> 表：
    </Paragraph>
    <Table
      head={['id', 'dept_name', 'loc']}
      rows={[
        ['1', '研发部', '北京'],
        ['2', '市场部', '上海'],
        ['3', '财务部', '广州'],
      ]}
    />
    <Callout type="tip">
      提示：李四和赵六的 <InlineCode>bonus</InlineCode> 是 <InlineCode>NULL</InlineCode>
      （没有奖金）。这个 <InlineCode>NULL</InlineCode> 是故意留的"坑"，本章后面会专门用它来讲{' '}
      <InlineCode>NULL</InlineCode> 的种种特性。
    </Callout>

    <Divider />

    <Subtitle>1. DQL 的地位与 SELECT 完整语法骨架</Subtitle>

    <Heading3>1.1 为什么 DQL 最重要</Heading3>
    <Paragraph>
      数据库的核心价值是<Text bold>"存"和"取"</Text>
      。存进去的数据如果取不出来、取不准，就毫无意义。而 DQL 就是负责"取"的那把钥匙。它的特点是：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>不修改数据</Text>：<InlineCode>SELECT</InlineCode>
        只读，再怎么查也不会改坏表里的数据，所以可以放心大胆地练。
      </ListItem>
      <ListItem>
        <Text bold>使用最频繁</Text>：日常开发中绝大多数 SQL 都是查询。
      </ListItem>
      <ListItem>
        <Text bold>变化最丰富</Text>
        ：从简单的"查一列"到复杂的多表关联、子查询、聚合统计，全靠它。
      </ListItem>
    </UnorderedList>

    <Heading3>1.2 SELECT 的完整语法骨架（先看全貌）</Heading3>
    <Paragraph>先把这个"骨架"刻在脑子里，后面所有查询都是它的子集：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT   字段列表           -- ① 要查哪些列（最后才执行，但写在最前面）
FROM     表名               -- ② 从哪张表查
WHERE    条件               -- ③ 行级过滤（分组前的条件）
GROUP BY 分组字段           -- ④ 按什么分组
HAVING   分组后条件         -- ⑤ 组级过滤（分组后的条件）
ORDER BY 排序字段 [ASC|DESC]-- ⑥ 按什么排序
LIMIT    起始, 条数;        -- ⑦ 分页/限制行数`}
    />
    <Paragraph>逐项速览（本章只深入①②③）：</Paragraph>
    <Table
      head={['子句', '作用', '通俗理解', '本章是否深入']}
      rows={[
        ['SELECT', '选择要显示的列', '"我想看哪几列"', '✅ 是'],
        ['FROM', '指定数据来源表', '"去哪张表里翻"', '✅ 是'],
        ['WHERE', '行过滤条件', '"只要满足条件的那些行"', '✅ 是'],
        ['GROUP BY', '分组', '"把同类的归成一堆"', '后续章节'],
        ['HAVING', '分组后过滤', '"只要满足条件的那些组"', '后续章节'],
        ['ORDER BY', '排序', '"按某列从大到小/小到大排"', '后续章节'],
        ['LIMIT', '限制行数/分页', '"只看前 10 条"', '后续章节'],
      ]}
    />
    <Callout type="warning">
      注意：上面这个<Text bold>书写顺序是固定的</Text>，不能随意调换。比如不能把{' '}
      <InlineCode>WHERE</InlineCode> 写到 <InlineCode>FROM</InlineCode>{' '}
      前面，否则报语法错误。记忆口诀：
      <Text bold>
        "selete（选） from（从） where（哪） group（组） having（再筛） order（排）
        limit（截）"
      </Text>
      。
    </Callout>
    <Callout type="tip">
      提示：书写顺序 ≠ 执行顺序。MySQL 实际执行时大致是{' '}
      <InlineCode>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</InlineCode>
      ，这也是为什么 <InlineCode>SELECT</InlineCode> 里起的别名常常不能在{' '}
      <InlineCode>WHERE</InlineCode> 里用（<InlineCode>WHERE</InlineCode> 比{' '}
      <InlineCode>SELECT</InlineCode> 先执行）。这个细节本章末尾的"常见坑"会再提。
    </Callout>

    <Divider />

    <Subtitle>2. 基础查询（SELECT ... FROM ...）</Subtitle>
    <Paragraph>
      最简单的查询只需要 <InlineCode>SELECT</InlineCode> + <InlineCode>FROM</InlineCode>{' '}
      两部分：选哪些列、从哪张表。
    </Paragraph>

    <Heading3>2.1 查询全部列：SELECT *</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT * FROM 表名;`} />
    <UnorderedList>
      <ListItem>
        <InlineCode>*</InlineCode> 是通配符，代表"这张表的<Text bold>所有列</Text>"。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：查询 emp 表的全部员工信息</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT * FROM emp;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', 'join_date', 'dept_id', 'bonus']}
      rows={[
        ['1', '张三', '男', '8000', '2020-01-10', '1', '1000'],
        ['2', '李四', '男', '12000', '2019-03-15', '1', 'NULL'],
        ['3', '王五', '女', '9500', '2021-06-01', '2', '2000'],
        ['4', '赵六', '女', '6000', '2022-09-20', '2', 'NULL'],
        ['5', '孙七', '男', '15000', '2018-11-05', '3', '3000'],
      ]}
    />
    <Callout type="danger">
      <Paragraph>
        常见坑：<InlineCode>SELECT *</InlineCode> 在<Text bold>学习、临时调试</Text>
        时很方便，但在<Text bold>正式代码（尤其是 Java / 后端接口）里强烈不建议用</Text>
        ！原因有三：
      </Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>性能差</Text>：会把不需要的大字段（如长文本、blob）也查出来，浪费网络和内存。
        </ListItem>
        <ListItem>
          <Text bold>不稳定</Text>：哪天表加了一列，<InlineCode>*</InlineCode>{' '}
          的返回结构就变了，可能把上层代码搞崩。
        </ListItem>
        <ListItem>
          <Text bold>可读性差</Text>：别人看代码不知道你到底用了哪些列。
        </ListItem>
      </OrderedList>
      <Paragraph>
        正确做法是<Text bold>明确写出要查的列</Text>，下面就讲。
      </Paragraph>
    </Callout>

    <Heading3>2.2 查询指定列</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT 列名1, 列名2, ... FROM 表名;`} />
    <UnorderedList>
      <ListItem>
        列之间用逗号 <InlineCode>,</InlineCode> 隔开。
      </ListItem>
      <ListItem>显示顺序就是你写的顺序（可以和表里定义的顺序不同）。</ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：只查员工的姓名、工资、所属部门编号</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary, dept_id FROM emp;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary', 'dept_id']}
      rows={[
        ['张三', '8000', '1'],
        ['李四', '12000', '1'],
        ['王五', '9500', '2'],
        ['赵六', '6000', '2'],
        ['孙七', '15000', '3'],
      ]}
    />
    <Paragraph>
      <Text bold>示例：调整列的显示顺序（先工资后姓名）</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT salary, ename FROM emp;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['salary', 'ename']}
      rows={[
        ['8000', '张三'],
        ['12000', '李四'],
        ['9500', '王五'],
        ['6000', '赵六'],
        ['15000', '孙七'],
      ]}
    />
    <Paragraph>
      可见，<Text bold>`SELECT` 后面列的先后顺序，决定了结果中列的先后顺序</Text>。
    </Paragraph>

    <Heading3>2.3 列的别名 AS（可省略 AS）</Heading3>
    <Paragraph>
      查询出来的列名默认就是字段名（如 <InlineCode>ename</InlineCode>、
      <InlineCode>salary</InlineCode>），但有时我们希望显示得更友好（比如显示中文"姓名""月薪"），这时用
      <Text bold>别名（alias）</Text>。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT 列名 AS 别名, 列名 别名 FROM 表名;`} />
    <UnorderedList>
      <ListItem>
        <InlineCode>AS</InlineCode> 关键字用来给列起别名。
      </ListItem>
      <ListItem>
        <Text bold>`AS` 可以省略</Text>，直接在列名后面空一格写别名即可。
      </ListItem>
      <ListItem>
        如果别名里<Text bold>包含空格或特殊字符（如中文标点）</Text>，建议用
        <Text bold>单引号或反引号</Text>括起来更稳妥。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例 1：用 AS 起中文别名</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename AS 姓名, salary AS 月薪 FROM emp;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['姓名', '月薪']}
      rows={[
        ['张三', '8000'],
        ['李四', '12000'],
        ['王五', '9500'],
        ['赵六', '6000'],
        ['孙七', '15000'],
      ]}
    />
    <Paragraph>
      <Text bold>示例 2：省略 AS（效果完全一样）</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename 姓名, salary 月薪 FROM emp;`} />
    <Paragraph>
      结果与示例 1 <Text bold>完全相同</Text>。<InlineCode>AS</InlineCode>{' '}
      写不写都行，写上更清晰、不容易让人误解。
    </Paragraph>
    <Paragraph>
      <Text bold>示例 3：别名带空格时用引号括起来</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename AS '员工 姓名', salary AS '月 薪' FROM emp;`} />
    <Paragraph>
      <Text bold>执行结果（列标题里就能带空格了）：</Text>
    </Paragraph>
    <Table
      head={['员工 姓名', '月 薪']}
      rows={[
        ['张三', '8000'],
        ['...', '...'],
      ]}
    />
    <Callout type="tip">
      提示：别名主要是<Text bold>给查询结果"改个显示名"</Text>，
      <Text bold>不会真的改表结构</Text>。表里字段名还是 <InlineCode>ename</InlineCode>、
      <InlineCode>salary</InlineCode>，别名只在这一次查询结果中生效。
    </Callout>

    <Heading3>2.4 表别名</Heading3>
    <Paragraph>
      不仅列可以起别名，<Text bold>表</Text>也可以。表别名在<Text bold>多表查询</Text>
      时特别有用（可以少写很多字），单表查询里也能用。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT 表别名.列名 FROM 表名 AS 表别名;   -- AS 同样可省略`} />
    <Paragraph>
      <Text bold>示例：给 emp 表起别名 e</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT e.ename, e.salary FROM emp AS e;
-- 等价写法（省略 AS）：
-- SELECT e.ename, e.salary FROM emp e;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary']}
      rows={[
        ['张三', '8000'],
        ['李四', '12000'],
        ['王五', '9500'],
        ['赵六', '6000'],
        ['孙七', '15000'],
      ]}
    />
    <Callout type="warning">
      <Paragraph>
        注意：<Text bold>一旦给表起了别名，原来的表名在这条语句里就不能再用了</Text>
        。比如上面起了别名 <InlineCode>e</InlineCode>，再写 <InlineCode>emp.ename</InlineCode>{' '}
        就会报错，必须写 <InlineCode>e.ename</InlineCode>。
      </Paragraph>
      <Paragraph>
        表别名的真正威力会在后续"多表连接查询"章节体现，例如{' '}
        <InlineCode>SELECT e.ename, d.dept_name FROM emp e, dept d</InlineCode>
        ，用一个字母代替长表名，语句清爽很多。
      </Paragraph>
    </Callout>
  </article>
);

export default index;
