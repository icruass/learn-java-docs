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
    <Title>DQL：基础查询、条件查询与模糊查询</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        前面几章我们学的都是“怎么把数据放进数据库”（DDL 建表、DML 增删改）。从本章开始，我们进入 MySQL 里
        <Text bold>使用频率最高、最重要</Text>的部分——
        <Text bold>DQL（Data Query Language，数据查询语言）</Text>，也就是{' '}
        <InlineCode>SELECT</InlineCode> 查询。
      </Paragraph>
      <Paragraph>
        打个比方：如果说数据库是一个巨大的仓库，前面几章是教你“怎么把货物搬进仓库、怎么摆放、怎么换货”，那么本章开始就是教你
        <Text bold>“怎么从仓库里精准地找到你想要的东西”</Text>。在真实工作中，你 90%
        以上的时间都在写查询语句——报表、列表、统计、接口数据……几乎都是{' '}
        <InlineCode>SELECT</InlineCode>。所以这一块务必学扎实。
      </Paragraph>
      <Paragraph>
        <InlineCode>SELECT</InlineCode> 是一个“大块头”，它的完整语法有 7
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
        的“地基”，地基打牢了，后面的高楼才稳。
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
      （没有奖金）。这个 <InlineCode>NULL</InlineCode> 是故意留的“坑”，本章后面会专门用它来讲{' '}
      <InlineCode>NULL</InlineCode> 的种种特性。
    </Callout>

    <Divider />

    <Subtitle>1. DQL 的地位与 SELECT 完整语法骨架</Subtitle>

    <Heading3>1.1 为什么 DQL 最重要</Heading3>
    <Paragraph>
      数据库的核心价值是<Text bold>“存”和“取”</Text>
      。存进去的数据如果取不出来、取不准，就毫无意义。而 DQL 就是负责“取”的那把钥匙。它的特点是：
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
        ：从简单的“查一列”到复杂的多表关联、子查询、聚合统计，全靠它。
      </ListItem>
    </UnorderedList>

    <Heading3>1.2 SELECT 的完整语法骨架（先看全貌）</Heading3>
    <Paragraph>先把这个“骨架”刻在脑子里，后面所有查询都是它的子集：</Paragraph>
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
        ['SELECT', '选择要显示的列', '“我想看哪几列”', '✅ 是'],
        ['FROM', '指定数据来源表', '“去哪张表里翻”', '✅ 是'],
        ['WHERE', '行过滤条件', '“只要满足条件的那些行”', '✅ 是'],
        ['GROUP BY', '分组', '“把同类的归成一堆”', '后续章节'],
        ['HAVING', '分组后过滤', '“只要满足条件的那些组”', '后续章节'],
        ['ORDER BY', '排序', '“按某列从大到小/小到大排”', '后续章节'],
        ['LIMIT', '限制行数/分页', '“只看前 10 条”', '后续章节'],
      ]}
    />
    <Callout type="warning">
      注意：上面这个<Text bold>书写顺序是固定的</Text>，不能随意调换。比如不能把{' '}
      <InlineCode>WHERE</InlineCode> 写到 <InlineCode>FROM</InlineCode>{' '}
      前面，否则报语法错误。记忆口诀：
      <Text bold>
        “selete（选） from（从） where（哪） group（组） having（再筛） order（排）
        limit（截）”
      </Text>
      。
    </Callout>
    <Callout type="tip">
      提示：书写顺序 ≠ 执行顺序。MySQL 实际执行时大致是{' '}
      <InlineCode>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</InlineCode>
      ，这也是为什么 <InlineCode>SELECT</InlineCode> 里起的别名常常不能在{' '}
      <InlineCode>WHERE</InlineCode> 里用（<InlineCode>WHERE</InlineCode> 比{' '}
      <InlineCode>SELECT</InlineCode> 先执行）。这个细节本章末尾的“常见坑”会再提。
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
        <InlineCode>*</InlineCode> 是通配符，代表“这张表的<Text bold>所有列</Text>”。
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
      <InlineCode>salary</InlineCode>），但有时我们希望显示得更友好（比如显示中文“姓名”“月薪”），这时用
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
      提示：别名主要是<Text bold>给查询结果“改个显示名”</Text>，
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
        表别名的真正威力会在后续“多表连接查询”章节体现，例如{' '}
        <InlineCode>SELECT e.ename, d.dept_name FROM emp e, dept d</InlineCode>
        ，用一个字母代替长表名，语句清爽很多。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>3. 去重、计算列与 NULL 处理</Subtitle>

    <Heading3>3.1 去重 DISTINCT</Heading3>
    <Paragraph>
      有时一列里有很多重复值，我们只想看“有哪些不同的值”，这时用{' '}
      <InlineCode>DISTINCT</InlineCode>（去重）。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT DISTINCT 列名 FROM 表名;`} />
    <UnorderedList>
      <ListItem>
        <InlineCode>DISTINCT</InlineCode> 紧跟在 <InlineCode>SELECT</InlineCode> 后面。
      </ListItem>
      <ListItem>
        它对<Text bold>后面所有列的组合</Text>去重，而不是只对第一列去重。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例 1：员工分布在哪些部门（去掉重复的 dept_id）</Text>
    </Paragraph>
    <Paragraph>不去重的话：</Paragraph>
    <CodeBlock language="sql" code={`SELECT dept_id FROM emp;`} />
    <Table
      head={['dept_id']}
      rows={[['1'], ['1'], ['2'], ['2'], ['3']]}
    />
    <Paragraph>
      1 和 2 各出现了两次。加上 <InlineCode>DISTINCT</InlineCode>：
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT DISTINCT dept_id FROM emp;`} />
    <Paragraph>
      <Text bold>执行结果（重复的被合并）：</Text>
    </Paragraph>
    <Table head={['dept_id']} rows={[['1'], ['2'], ['3']]} />
    <Paragraph>
      <Text bold>示例 2：DISTINCT 作用于多列时，是“整行组合”去重</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT DISTINCT gender, dept_id FROM emp;`} />
    <Paragraph>
      会把 <InlineCode>(gender, dept_id)</InlineCode>{' '}
      <Text bold>这个组合</Text>作为一个整体去重：
    </Paragraph>
    <Table
      head={['gender', 'dept_id']}
      rows={[
        ['男', '1'],
        ['女', '2'],
        ['男', '3'],
      ]}
    />
    <Callout type="danger">
      常见坑：很多初学者以为 <InlineCode>SELECT DISTINCT gender, dept_id</InlineCode>
      是“只对 gender 去重”，其实是<Text bold>对 gender 和 dept_id 的组合</Text>
      去重。只要两列的值不是完全相同，就会被保留。比如上面 <InlineCode>(男,1)</InlineCode>{' '}
      和 <InlineCode>(男,3)</InlineCode> 因为 dept_id 不同，都被保留了下来。
    </Callout>

    <Heading3>3.2 查询时进行计算（数值列运算）</Heading3>
    <Paragraph>
      <InlineCode>SELECT</InlineCode> 后面不仅能写列名，还能写<Text bold>表达式</Text>
      ，对数值列做加减乘除运算，结果作为新的一列显示出来。
    </Paragraph>
    <Paragraph>
      <Text bold>支持的算术运算符：</Text>
    </Paragraph>
    <Table
      head={['运算符', '含义', '示例']}
      rows={[
        ['+', '加', 'salary + 100'],
        ['-', '减', 'salary - 100'],
        ['*', '乘', 'salary * 12'],
        ['/', '除', 'salary / 2'],
        ['%', '取余/取模', 'salary % 1000'],
      ]}
    />
    <Paragraph>
      <Text bold>示例 1：计算每位员工的“年薪”（月薪 × 12）</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary, salary * 12 AS 年薪 FROM emp;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary', '年薪']}
      rows={[
        ['张三', '8000', '96000'],
        ['李四', '12000', '144000'],
        ['王五', '9500', '114000'],
        ['赵六', '6000', '72000'],
        ['孙七', '15000', '180000'],
      ]}
    />
    <Callout type="tip">
      提示：计算列<Text bold>一定要起别名</Text>！如果不起别名，列标题就会原样显示成{' '}
      <InlineCode>salary * 12</InlineCode>，又长又难看，前端/Java
      拿到这个奇怪的列名也不好处理。
    </Callout>
    <Paragraph>
      <Text bold>示例 2：涨薪 500 后的工资</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary AS 原工资, salary + 500 AS 涨薪后 FROM emp;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', '原工资', '涨薪后']}
      rows={[
        ['张三', '8000', '8500'],
        ['李四', '12000', '12500'],
        ['王五', '9500', '10000'],
        ['赵六', '6000', '6500'],
        ['孙七', '15000', '15500'],
      ]}
    />
    <Callout type="warning">
      注意：这种计算<Text bold>只影响查询结果的“显示”，不会真的修改表里的数据</Text>。
      <InlineCode>emp</InlineCode> 表里 <InlineCode>salary</InlineCode>{' '}
      仍然是原值。要真正改数据得用 <InlineCode>UPDATE</InlineCode>（DML），那是另一回事。
    </Callout>

    <Heading3>3.3 NULL 的处理：IFNULL</Heading3>
    <Paragraph>
      现在我们来对付那个埋好的“坑”——<InlineCode>bonus</InlineCode> 列里的{' '}
      <InlineCode>NULL</InlineCode>。
    </Paragraph>
    <Paragraph>
      先理解 <InlineCode>NULL</InlineCode> 是什么：
      <Text bold>
        `NULL` 表示“未知 / 没有值 / 空”，它不是数字 0，也不是空字符串 `''`
      </Text>
      ，而是“什么都没有”。
    </Paragraph>
    <Paragraph>
      这会带来一个很坑的问题：
      <Text bold>任何数值和 `NULL` 做运算，结果都是 `NULL`！</Text>
    </Paragraph>
    <Paragraph>
      <Text bold>反面示例：直接计算“工资 + 奖金”</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary, bonus, salary + bonus AS 月收入 FROM emp;`} />
    <Paragraph>
      <Text bold>执行结果（注意李四、赵六的“月收入”变成了 NULL）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary', 'bonus', '月收入']}
      rows={[
        ['张三', '8000', '1000', '9000'],
        ['李四', '12000', 'NULL', 'NULL'],
        ['王五', '9500', '2000', '11500'],
        ['赵六', '6000', 'NULL', 'NULL'],
        ['孙七', '15000', '3000', '18000'],
      ]}
    />
    <Paragraph>
      李四明明有 12000 的工资，结果月收入却显示 <InlineCode>NULL</InlineCode>
      ！这显然不符合我们的预期。原因就是 <InlineCode>12000 + NULL = NULL</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>
        解决办法：用 `IFNULL` 函数把 `NULL` 替换成默认值（比如 0）。
      </Text>
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`IFNULL(列名, 默认值)`} />
    <UnorderedList>
      <ListItem>
        如果“列名”的值<Text bold>不是 NULL</Text>，就返回它本身；
      </ListItem>
      <ListItem>
        如果“列名”的值<Text bold>是 NULL</Text>，就返回“默认值”。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>正确示例：把没奖金的当成 0 来算</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename,
       salary,
       bonus,
       salary + IFNULL(bonus, 0) AS 月收入
FROM emp;`}
    />
    <Paragraph>
      <Text bold>执行结果（这下对了）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary', 'bonus', '月收入']}
      rows={[
        ['张三', '8000', '1000', '9000'],
        ['李四', '12000', 'NULL', '12000'],
        ['王五', '9500', '2000', '11500'],
        ['赵六', '6000', 'NULL', '6000'],
        ['孙七', '15000', '3000', '18000'],
      ]}
    />
    <Paragraph>
      <InlineCode>IFNULL(bonus, 0)</InlineCode> 把李四、赵六的 <InlineCode>NULL</InlineCode>{' '}
      当成 0，于是 <InlineCode>12000 + 0 = 12000</InlineCode>，结果正常了。
    </Paragraph>
    <Callout type="tip">
      提示：<InlineCode>IFNULL</InlineCode> 在做
      <Text bold>计算和聚合统计</Text>（如求工资奖金总和、平均收入）时几乎是必备的，否则一个{' '}
      <InlineCode>NULL</InlineCode> 就能把整列结果污染掉。后续讲聚合函数（
      <InlineCode>SUM</InlineCode>、<InlineCode>AVG</InlineCode>）时还会用到它。
    </Callout>
    <Callout type="danger">
      常见坑：<InlineCode>IFNULL</InlineCode> 是 <Text bold>MySQL 特有</Text>
      的函数。标准 SQL 里类似功能叫 <InlineCode>COALESCE(列, 默认值)</InlineCode>（
      <InlineCode>COALESCE</InlineCode> 还能写多个参数，返回第一个非 NULL
      的值），跨数据库时更通用。本套教程以 MySQL 为准，用 <InlineCode>IFNULL</InlineCode>{' '}
      即可。
    </Callout>

    <Divider />

    <Subtitle>4. 条件查询 WHERE</Subtitle>
    <Paragraph>
      前面查的都是“整张表所有行”。但真实场景里我们往往只要<Text bold>满足某些条件的行</Text>
      ——比如“工资大于 1 万的员工”“研发部的人”。这就需要 <InlineCode>WHERE</InlineCode> 子句。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT 列名列表 FROM 表名 WHERE 条件;`} />
    <UnorderedList>
      <ListItem>
        <InlineCode>WHERE</InlineCode> 写在 <InlineCode>FROM</InlineCode> 后面。
      </ListItem>
      <ListItem>
        “条件”是一个<Text bold>布尔表达式</Text>，结果为“真（true）”的行才会被查出来。
      </ListItem>
      <ListItem>
        可以把它理解成一个<Text bold>筛子</Text>
        ：一行一行地过，条件成立的留下，不成立的丢掉。
      </ListItem>
    </UnorderedList>

    <Heading3>4.1 比较运算符</Heading3>
    <Paragraph>
      <InlineCode>WHERE</InlineCode> 里最常用的就是比较运算符。
    </Paragraph>
    <Table
      head={['运算符', '含义', '示例']}
      rows={[
        ['=', '等于', "salary = 8000"],
        ['>', '大于', 'salary > 10000'],
        ['<', '小于', 'salary < 8000'],
        ['>=', '大于等于', 'salary >= 9500'],
        ['<=', '小于等于', 'salary <= 8000'],
        ['!=', '不等于', "gender != '男'"],
        ['<>', '不等于', "gender <> '男'"],
      ]}
    />
    <Callout type="tip">
      提示：<InlineCode>!=</InlineCode> 和 <InlineCode>&lt;&gt;</InlineCode>{' '}
      完全等价，都表示“不等于”。<InlineCode>&lt;&gt;</InlineCode> 是标准 SQL 写法，
      <InlineCode>!=</InlineCode> 是大多数程序员更习惯的写法，两者随便用。
    </Callout>
    <Callout type="warning">
      注意：判断“相等”用<Text bold>一个等号 `=`</Text>，不是编程语言里的{' '}
      <InlineCode>==</InlineCode>！MySQL 里写 <InlineCode>==</InlineCode> 会报错。
    </Callout>
    <Paragraph>
      <Text bold>示例 1：查询工资大于 10000 的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary FROM emp WHERE salary > 10000;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary']}
      rows={[
        ['李四', '12000'],
        ['孙七', '15000'],
      ]}
    />
    <Paragraph>
      <Text bold>示例 2：查询所有女员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, gender, salary FROM emp WHERE gender = '女';`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'gender', 'salary']}
      rows={[
        ['王五', '女', '9500'],
        ['赵六', '女', '6000'],
      ]}
    />
    <Callout type="warning">
      注意：字符串值（如 <InlineCode>'女'</InlineCode>、<InlineCode>'男'</InlineCode>）必须用
      <Text bold>单引号</Text>括起来。数字（如 <InlineCode>10000</InlineCode>）不用加引号。
    </Callout>
    <Paragraph>
      <Text bold>示例 3：查询不是研发部（dept_id 不等于 1）的员工</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, dept_id FROM emp WHERE dept_id != 1;
-- 等价：WHERE dept_id <> 1;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id']}
      rows={[
        ['王五', '2'],
        ['赵六', '2'],
        ['孙七', '3'],
      ]}
    />

    <Heading3>4.2 范围查询 BETWEEN ... AND ...</Heading3>
    <Paragraph>
      当条件是“在某个区间内”时，可以用 <InlineCode>BETWEEN ... AND ...</InlineCode>
      ，比写两个 <InlineCode>&gt;=</InlineCode> 和 <InlineCode>&lt;=</InlineCode> 更简洁。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`WHERE 列名 BETWEEN 下限 AND 上限;`} />
    <UnorderedList>
      <ListItem>
        含义：列值 <Text bold>大于等于</Text> 下限 <Text bold>且 小于等于</Text> 上限。
      </ListItem>
      <ListItem>
        <Text bold>是闭区间（包含两端）</Text>，等价于{' '}
        <InlineCode>列名 &gt;= 下限 AND 列名 &lt;= 上限</InlineCode>。
      </ListItem>
      <ListItem>下限必须写在前、上限写在后，写反了查不到数据。</ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：查询工资在 8000 到 12000 之间（含 8000 和 12000）的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary FROM emp WHERE salary BETWEEN 8000 AND 12000;`} />
    <Paragraph>
      <Text bold>执行结果（8000 和 12000 都被包含进来了）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary']}
      rows={[
        ['张三', '8000'],
        ['李四', '12000'],
        ['王五', '9500'],
      ]}
    />
    <Paragraph>它完全等价于：</Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary FROM emp WHERE salary >= 8000 AND salary <= 12000;`} />
    <Callout type="danger">
      常见坑：<InlineCode>BETWEEN a AND b</InlineCode> 一定要 <Text bold>a ≤ b</Text>。如果写成{' '}
      <InlineCode>BETWEEN 12000 AND 8000</InlineCode>（大的在前），结果会是
      <Text bold>空集</Text>，因为没有任何值能“同时大于等于 12000 又小于等于 8000”。
    </Callout>
    <Callout type="tip">
      提示：<InlineCode>BETWEEN ... AND ...</InlineCode> 也能用于<Text bold>日期</Text>
      。比如查 2020 年至 2021 年入职的：
      <InlineCode>WHERE join_date BETWEEN '2020-01-01' AND '2021-12-31'</InlineCode>。
    </Callout>

    <Heading3>4.3 集合查询 IN (...)</Heading3>
    <Paragraph>
      当条件是“等于这几个值中的任意一个”时，用 <InlineCode>IN</InlineCode>，比写一堆{' '}
      <InlineCode>OR</InlineCode> 清爽得多。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`WHERE 列名 IN (值1, 值2, 值3, ...);`} />
    <UnorderedList>
      <ListItem>
        含义：列值<Text bold>等于括号里任意一个值</Text>就算匹配。
      </ListItem>
      <ListItem>
        等价于 <InlineCode>列名 = 值1 OR 列名 = 值2 OR ...</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：查询研发部（1）和财务部（3）的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, dept_id FROM emp WHERE dept_id IN (1, 3);`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id']}
      rows={[
        ['张三', '1'],
        ['李四', '1'],
        ['孙七', '3'],
      ]}
    />
    <Paragraph>它等价于（但啰嗦得多）：</Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, dept_id FROM emp WHERE dept_id = 1 OR dept_id = 3;`} />
    <Paragraph>
      <Text bold>取反：用 `NOT IN` 查“不在这些值里”的</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, dept_id FROM emp WHERE dept_id NOT IN (1, 3);`} />
    <Paragraph>
      <Text bold>执行结果（只剩 2 号部门的人）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id']}
      rows={[
        ['王五', '2'],
        ['赵六', '2'],
      ]}
    />
    <Callout type="danger">
      常见坑：<InlineCode>NOT IN</InlineCode> 遇到 <InlineCode>NULL</InlineCode>{' '}
      会很诡异。如果 <InlineCode>IN</InlineCode> 的列表里包含 <InlineCode>NULL</InlineCode>（如{' '}
      <InlineCode>NOT IN (1, NULL)</InlineCode>
      ），整个条件可能永远返回“非真”，导致查不到任何数据。原因还是{' '}
      <InlineCode>NULL</InlineCode> 的“未知”特性（见下一节）。所以
      <Text bold>用 `NOT IN` 时务必保证列表里没有 NULL</Text>。
    </Callout>

    <Heading3>4.4 NULL 的判断：IS NULL / IS NOT NULL</Heading3>
    <Paragraph>
      这是初学者<Text bold>最容易踩的坑</Text>之一，必须单独拎出来重点讲。
    </Paragraph>
    <Paragraph>
      <Text bold>
        核心规则：判断一个值是不是 `NULL`，必须用 `IS NULL` / `IS NOT NULL`，绝对不能用
        `= NULL` 或 `!= NULL`。
      </Text>
    </Paragraph>
    <Paragraph>
      <Text bold>为什么不能用 `= NULL`？</Text>
    </Paragraph>
    <Paragraph>
      因为 <InlineCode>NULL</InlineCode> 的语义是<Text bold>“未知”</Text>。在 SQL 的三值逻辑（true
      / false / <Text bold>unknown</Text>）里：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>任何值 = NULL</InlineCode> 的结果不是 true 也不是 false，而是{' '}
        <Text bold>unknown（未知）</Text>；
      </ListItem>
      <ListItem>
        <InlineCode>WHERE</InlineCode> 只保留结果为 <Text bold>true</Text> 的行，
        <InlineCode>unknown</InlineCode> 会被当作“不满足”丢弃。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      用大白话讲：你问“某人的奖金等于‘未知’吗？”——这个问题本身就没法回答“是”或“否”，所以
      MySQL 给你 <InlineCode>unknown</InlineCode>，于是一行都查不出来。
    </Paragraph>
    <Paragraph>
      <Text bold>反面示例（错误写法，查不到任何数据）：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, bonus FROM emp WHERE bonus = NULL;`} />
    <Paragraph>
      <Text bold>执行结果：空集（Empty set），一行都没有！</Text> 明明李四、赵六的 bonus 是
      NULL，却查不出来。
    </Paragraph>
    <Paragraph>
      <Text bold>正确写法：用 `IS NULL`</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, bonus FROM emp WHERE bonus IS NULL;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'bonus']}
      rows={[
        ['李四', 'NULL'],
        ['赵六', 'NULL'],
      ]}
    />
    <Paragraph>
      <Text bold>反向：查“有奖金”的（bonus 不为 NULL），用 `IS NOT NULL`</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, bonus FROM emp WHERE bonus IS NOT NULL;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'bonus']}
      rows={[
        ['张三', '1000'],
        ['王五', '2000'],
        ['孙七', '3000'],
      ]}
    />
    <Callout type="warning">
      <Paragraph>注意（务必牢记）：</Paragraph>
      <UnorderedList>
        <ListItem>
          判断为空：<InlineCode>IS NULL</InlineCode> ✅，<InlineCode>= NULL</InlineCode> ❌
        </ListItem>
        <ListItem>
          判断非空：<InlineCode>IS NOT NULL</InlineCode> ✅，<InlineCode>!= NULL</InlineCode> ❌、
          <InlineCode>&lt;&gt; NULL</InlineCode> ❌
        </ListItem>
      </UnorderedList>
      <Paragraph>这是 MySQL 笔试面试的高频考点，也是实际写 bug 的高发区。</Paragraph>
    </Callout>

    <Heading3>4.5 逻辑运算符 AND / OR / NOT</Heading3>
    <Paragraph>
      当一个查询有<Text bold>多个条件</Text>时，用逻辑运算符把它们连起来。
    </Paragraph>
    <Table
      head={['逻辑运算符', '等价符号', '含义', '通俗理解']}
      rows={[
        ['AND', '&&', '两个条件都成立才为真', '“并且 / 而且”'],
        ['OR', '||', '两个条件有一个成立就为真', '“或者”'],
        ['NOT', '!', '对条件取反（真变假、假变真）', '“不 / 非”'],
      ]}
    />
    <Callout type="tip">
      提示：<InlineCode>AND</InlineCode>/<InlineCode>OR</InlineCode>/
      <InlineCode>NOT</InlineCode> 是标准写法，可读性好，<Text bold>强烈推荐用单词形式</Text>。
      <InlineCode>&&</InlineCode>/<InlineCode>||</InlineCode>/<InlineCode>!</InlineCode> 是 MySQL
      提供的等价符号，能用但不推荐（其它数据库未必支持，且容易和编程语言混淆）。
    </Callout>
    <Paragraph>
      <Text bold>
        示例 1：AND——查“男性”且“工资大于 10000”的员工（两个条件都要满足）
      </Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, gender, salary FROM emp WHERE gender = '男' AND salary > 10000;`}
    />
    <Paragraph>
      <Text bold>执行结果（张三是男但工资 8000 不满足，被排除）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'gender', 'salary']}
      rows={[
        ['李四', '男', '12000'],
        ['孙七', '男', '15000'],
      ]}
    />
    <Paragraph>
      <Text bold>
        示例 2：OR——查“工资低于 7000”或“工资高于 14000”的员工（满足其一即可）
      </Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary FROM emp WHERE salary < 7000 OR salary > 14000;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary']}
      rows={[
        ['赵六', '6000'],
        ['孙七', '15000'],
      ]}
    />
    <Paragraph>
      <Text bold>示例 3：NOT——查“不是研发部”的员工</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, dept_id FROM emp WHERE NOT dept_id = 1;
-- 等价于 WHERE dept_id != 1;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id']}
      rows={[
        ['王五', '2'],
        ['赵六', '2'],
        ['孙七', '3'],
      ]}
    />

    <Heading4>优先级与括号</Heading4>
    <Paragraph>
      当 <InlineCode>AND</InlineCode> 和 <InlineCode>OR</InlineCode> 混用时，要特别小心
      <Text bold>优先级</Text>：<Text bold>`NOT` &gt; `AND` &gt; `OR`</Text>（NOT 最高，AND
      次之，OR 最低）。也就是说，<InlineCode>AND</InlineCode> 会<Text bold>先</Text>于{' '}
      <InlineCode>OR</InlineCode> 结合。
    </Paragraph>
    <Paragraph>
      <Text bold>易错示例：想查“研发部或市场部里，工资大于 9000 的人”</Text>
    </Paragraph>
    <Paragraph>如果不加括号这样写：</Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ❌ 含义被理解错了
SELECT ename, dept_id, salary FROM emp
WHERE dept_id = 1 OR dept_id = 2 AND salary > 9000;`}
    />
    <Paragraph>
      由于 <InlineCode>AND</InlineCode> 优先级高，它实际被理解成：
    </Paragraph>
    <CodeBlock language="sql" code={`WHERE dept_id = 1 OR (dept_id = 2 AND salary > 9000);`} />
    <Paragraph>
      意思变成了“<Text bold>所有研发部的人</Text> 或者 <Text bold>市场部里工资&gt;9000的人</Text>
      ”，这不是我们要的。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果（张三 8000 也被查出来了，因为他属于研发部）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id', 'salary']}
      rows={[
        ['张三', '1', '8000'],
        ['李四', '1', '12000'],
        ['王五', '2', '9500'],
      ]}
    />
    <Paragraph>
      <Text bold>正确写法：用括号 `()` 明确分组</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, dept_id, salary FROM emp
WHERE (dept_id = 1 OR dept_id = 2) AND salary > 9000;`}
    />
    <Paragraph>
      <Text bold>执行结果（张三 8000 被正确排除）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id', 'salary']}
      rows={[
        ['李四', '1', '12000'],
        ['王五', '2', '9500'],
      ]}
    />
    <Callout type="danger">
      常见坑：<Text bold>只要 `AND` 和 `OR` 同时出现，就老老实实加括号！</Text>{' '}
      不要去赌优先级，括号既能保证逻辑正确，又能让别人一眼看懂。这是写 SQL 的好习惯。
    </Callout>

    <Divider />

    <Subtitle>5. 模糊查询 LIKE</Subtitle>
    <Paragraph>
      前面的比较都是“精确匹配”（等于、大于……）。但很多时候我们只记得“姓张的”“名字带五的”这种
      <Text bold>部分信息</Text>，这就需要<Text bold>模糊查询 `LIKE`</Text>，配合
      <Text bold>通配符</Text>使用。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`WHERE 列名 LIKE '匹配模式';`} />
    <Paragraph>两个通配符（核心中的核心）：</Paragraph>
    <Table
      head={['通配符', '含义', '类比']}
      rows={[
        ['%', '匹配任意多个字符（含0个）', '像“万能牌”，能顶任意长度'],
        ['_', '匹配任意单个字符（恰好1个）', '像“占一个坑”，不多不少一个'],
      ]}
    />
    <Callout type="tip">
      提示：记忆法——<InlineCode>%</InlineCode> 是“百分比”、量大，代表“任意多个”；
      <InlineCode>_</InlineCode> 是“一条下划线、一个空位”，代表“恰好一个”。
    </Callout>

    <Heading3>5.1 % 通配符：匹配任意多个字符</Heading3>
    <Paragraph>
      <Text bold>示例 1：查询所有“张”姓员工（姓张，名字几个字都行）</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '张%';`} />
    <Paragraph>
      <InlineCode>'张%'</InlineCode> 表示“以‘张’开头，后面跟任意多个字符”。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table head={['ename']} rows={[['张三']]} />
    <Paragraph>
      <Text bold>示例 2：查询名字里包含“五”的员工（不管在开头、中间还是结尾）</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '%五%';`} />
    <Paragraph>
      <InlineCode>'%五%'</InlineCode>{' '}
      表示“‘五’前面任意字符、后面也任意字符”，即只要名字里有“五”就匹配。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table head={['ename']} rows={[['王五']]} />
    <Paragraph>
      <Text bold>示例 3：查询名字以“三”结尾的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '%三';`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table head={['ename']} rows={[['张三']]} />

    <Heading3>5.2 _ 通配符：匹配单个字符</Heading3>
    <Paragraph>
      <Text bold>示例：查询名字是“两个字、且第二个字是‘四’”的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '_四';`} />
    <Paragraph>
      <InlineCode>'_四'</InlineCode>{' '}
      表示“<Text bold>第一个位置是任意一个字符</Text>，第二个位置必须是‘四’”——也就是名字
      <Text bold>恰好两个字、以‘四’结尾</Text>。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table head={['ename']} rows={[['李四']]} />
    <Callout type="danger">
      常见坑：<InlineCode>_</InlineCode> 严格匹配<Text bold>一个</Text>字符，多一个少一个都不行。
      <UnorderedList>
        <ListItem>
          <InlineCode>LIKE '_四'</InlineCode> 只能匹配“X四”这种两字名（如李四），匹配不到“张大四”这种三字名。
        </ListItem>
        <ListItem>
          如果想匹配“以四结尾、字数不限”，要用 <InlineCode>%</InlineCode>：
          <InlineCode>LIKE '%四'</InlineCode>。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5.3 % 和 _ 组合使用</Heading3>
    <Paragraph>两个通配符可以一起用，组合出更精确的模式。</Paragraph>
    <Paragraph>
      <Text bold>示例：查询“名字第一个字是‘王’，且总共两个字”的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '王_';`} />
    <Paragraph>
      <InlineCode>'王_'</InlineCode> 表示“以‘王’开头，后面再跟<Text bold>恰好一个</Text>字符”。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table head={['ename']} rows={[['王五']]} />

    <Heading3>5.4 LIKE 的注意事项与坑</Heading3>
    <Paragraph>
      <Text bold>坑 1：不带通配符的 LIKE，等同于精确匹配 `=`</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '张三';`} />
    <Paragraph>
      这没有用到 <InlineCode>%</InlineCode> 或 <InlineCode>_</InlineCode>，所以效果和{' '}
      <InlineCode>WHERE ename = '张三'</InlineCode> 一模一样，只能查到完全等于“张三”的。
    </Paragraph>
    <Paragraph>
      <Text bold>坑 2：想查“真正的 % 或 _ 符号”怎么办？用转义</Text>
    </Paragraph>
    <Paragraph>
      如果某列的数据里<Text bold>本身就含有 `%` 或 `_`</Text>{' '}
      这两个字符（比如折扣字段存了“50%”），直接 <InlineCode>LIKE '%50%%'</InlineCode> 会把{' '}
      <InlineCode>%</InlineCode> 当通配符。这时要用 <InlineCode>ESCAPE</InlineCode>{' '}
      指定转义符：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 查 discount 列中真正包含 "50%" 字符的行
SELECT * FROM some_table WHERE discount LIKE '%50\\%%' ESCAPE '\\';`}
    />
    <Paragraph>
      <InlineCode>ESCAPE '\\'</InlineCode> 告诉 MySQL：<InlineCode>\\</InlineCode> 后面的那个{' '}
      <InlineCode>%</InlineCode> 是普通字符，不是通配符。
    </Paragraph>
    <Callout type="warning">
      注意：本套示例数据 <InlineCode>emp</InlineCode> 里没有这种带特殊符号的数据，此处只作了解，知道有这个机制即可。
    </Callout>
    <Paragraph>
      <Text bold>坑 3：以 % 开头的 LIKE 性能差</Text>
    </Paragraph>
    <Paragraph>
      <InlineCode>LIKE '%五%'</InlineCode> 和 <InlineCode>LIKE '%五'</InlineCode>（以{' '}
      <InlineCode>%</InlineCode> 开头）会导致<Text bold>索引失效</Text>，MySQL
      不得不逐行扫描整张表，数据量大时很慢。而 <InlineCode>LIKE '张%'</InlineCode>（
      <InlineCode>%</InlineCode> 在结尾）则能用上索引。所以：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>能用 `'前缀%'` 就别用 `'%关键字%'`</Text>；
      </ListItem>
      <ListItem>
        真要做“包含”式全文检索，应考虑<Text bold>全文索引（FULLTEXT）</Text>
        或专门的搜索引擎（如 ElasticSearch），这是后话。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>坑 4：LIKE 大小写是否敏感？</Text>
    </Paragraph>
    <Paragraph>
      默认情况下，MySQL 的 <InlineCode>LIKE</InlineCode> 对<Text bold>英文字母大小写不敏感</Text>
      （取决于列的字符集排序规则 collation，如默认的 <InlineCode>utf8mb4_general_ci</InlineCode>{' '}
      里 <InlineCode>ci</InlineCode> 就是 case-insensitive 不区分大小写）。例如{' '}
      <InlineCode>LIKE 'a%'</InlineCode> 也能匹配到 <InlineCode>Apple</InlineCode>
      。如需严格区分大小写，可用 <InlineCode>LIKE BINARY 'a%'</InlineCode>
      。中文不涉及大小写问题，本章数据不受影响。
    </Paragraph>

    <Divider />

    <Subtitle>6. 综合演练</Subtitle>
    <Paragraph>把本章学的串起来，看一个稍复杂的真实查询：</Paragraph>
    <Paragraph>
      <Text bold>
        需求：查询“研发部或市场部”里、“工资在
        8000~13000 之间”、“有奖金”的男员工，显示姓名、工资、奖金，以及工资奖金合计（奖金为空算
        0），并把合计列叫“月收入”。
      </Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename            AS 姓名,
       salary           AS 工资,
       bonus            AS 奖金,
       salary + IFNULL(bonus, 0) AS 月收入
FROM emp
WHERE dept_id IN (1, 2)            -- 研发部或市场部
  AND salary BETWEEN 8000 AND 13000 -- 工资区间（闭区间）
  AND bonus IS NOT NULL             -- 有奖金（非 NULL）
  AND gender = '男';                -- 男员工`}
    />
    <Paragraph>逐个条件套到数据上分析：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>dept_id IN (1,2)</InlineCode>：留下 张三、李四、王五、赵六；
      </ListItem>
      <ListItem>
        <InlineCode>salary BETWEEN 8000 AND 13000</InlineCode>：赵六 6000 出局 → 留下
        张三(8000)、李四(12000)、王五(9500)；
      </ListItem>
      <ListItem>
        <InlineCode>bonus IS NOT NULL</InlineCode>：李四 bonus 为 NULL 出局 → 留下 张三、王五；
      </ListItem>
      <ListItem>
        <InlineCode>gender = '男'</InlineCode>：王五是女，出局 → 只剩 张三。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['姓名', '工资', '奖金', '月收入']}
      rows={[['张三', '8000', '1000', '9000']]}
    />
    <Callout type="tip">
      提示：写复杂 <InlineCode>WHERE</InlineCode> 时，习惯把每个条件单独成行、
      <InlineCode>AND</InlineCode>/<InlineCode>OR</InlineCode>{' '}
      放在行首对齐，可读性会好很多——就像上面那样。
    </Callout>

    <Divider />

    <Subtitle>7. 本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>DQL（SELECT）是最常用、最重要</Text>的 SQL，只读不改，可放心练习。
      </ListItem>
      <ListItem>
        <Text bold>完整骨架</Text>：
        <InlineCode>SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT</InlineCode>
        ，书写顺序固定。本章深入了前三个：<InlineCode>SELECT</InlineCode>（查哪些列）、
        <InlineCode>FROM</InlineCode>（查哪张表）、<InlineCode>WHERE</InlineCode>（行过滤）。
      </ListItem>
      <ListItem>
        <Text bold>基础查询</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>SELECT *</InlineCode> 查全部列（<Text bold>正式代码别用</Text>
            ，要显式写列名）；
          </ListItem>
          <ListItem>
            列别名用 <InlineCode>AS</InlineCode>（<Text bold>可省略</Text>
            ），表别名同理（起了别名后原表名不能再用）。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>去重 / 计算 / 空值</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>DISTINCT</InlineCode> 去重，作用于<Text bold>后面所有列的组合</Text>；
          </ListItem>
          <ListItem>
            <InlineCode>SELECT</InlineCode> 里可写算术表达式（如{' '}
            <InlineCode>salary * 12</InlineCode>），记得<Text bold>起别名</Text>，且
            <Text bold>不改原数据</Text>；
          </ListItem>
          <ListItem>
            <InlineCode>NULL</InlineCode> 表示“未知”，
            <Text bold>任何值与 NULL 运算都得 NULL</Text>，用{' '}
            <InlineCode>IFNULL(列, 默认值)</InlineCode> 兜底。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>条件查询 WHERE</Text>：
        <UnorderedList>
          <ListItem>
            比较运算符 <InlineCode>&gt; &lt; &gt;= &lt;= =</InlineCode>，不等于用{' '}
            <InlineCode>!=</InlineCode> 或 <InlineCode>&lt;&gt;</InlineCode>（相等用
            <Text bold>一个</Text> <InlineCode>=</InlineCode>）；
          </ListItem>
          <ListItem>
            区间用 <InlineCode>BETWEEN a AND b</InlineCode>（<Text bold>闭区间</Text>，a 必须 ≤
            b）；
          </ListItem>
          <ListItem>
            集合用 <InlineCode>IN (...)</InlineCode> / <InlineCode>NOT IN (...)</InlineCode>；
          </ListItem>
          <ListItem>
            <Text bold>判空必须用 `IS NULL` / `IS NOT NULL`，绝不能用 `= NULL`</Text>；
          </ListItem>
          <ListItem>
            多条件用 <InlineCode>AND</InlineCode> / <InlineCode>OR</InlineCode> /{' '}
            <InlineCode>NOT</InlineCode>，优先级 <InlineCode>NOT &gt; AND &gt; OR</InlineCode>，
            <Text bold>混用时务必加括号</Text>。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>模糊查询 LIKE</Text>：<InlineCode>%</InlineCode> 匹配任意多个字符，
        <InlineCode>_</InlineCode> 匹配单个字符；<InlineCode>'前缀%'</InlineCode> 能用索引，
        <InlineCode>'%关键字%'</InlineCode> 会全表扫描。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>8. 常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>Q1：判断某列是否为空，能不能用 `WHERE 列 = NULL`？</Text>
    </Paragraph>
    <Paragraph>
      不能。<InlineCode>= NULL</InlineCode> 永远返回 <InlineCode>unknown</InlineCode>
      ，查不到任何行。必须用 <InlineCode>IS NULL</InlineCode> / <InlineCode>IS NOT NULL</InlineCode>
      。根本原因是 <InlineCode>NULL</InlineCode> 表示“未知值”，参与比较运算结果是“未知”，而{' '}
      <InlineCode>WHERE</InlineCode> 只保留结果为真的行。
    </Paragraph>
    <Paragraph>
      <Text bold>Q2：`!=` 和 `&lt;&gt;` 有区别吗？</Text>
    </Paragraph>
    <Paragraph>
      没有区别，都是“不等于”。<InlineCode>&lt;&gt;</InlineCode> 是标准 SQL 写法，
      <InlineCode>!=</InlineCode> 是程序员习惯写法，MySQL 两者都支持。
    </Paragraph>
    <Paragraph>
      <Text bold>Q3：`SELECT salary + bonus` 为什么有的行变成 NULL 了？怎么解决？</Text>
    </Paragraph>
    <Paragraph>
      因为该行 <InlineCode>bonus</InlineCode> 是 <InlineCode>NULL</InlineCode>，而任何数{' '}
      <InlineCode>+ NULL = NULL</InlineCode>。解决：<InlineCode>salary + IFNULL(bonus, 0)</InlineCode>
      ，把 NULL 当 0 处理。
    </Paragraph>
    <Paragraph>
      <Text bold>Q4：`BETWEEN 10 AND 20` 包含 10 和 20 吗？</Text>
    </Paragraph>
    <Paragraph>
      包含。它是<Text bold>闭区间</Text>，等价于 <InlineCode>&gt;= 10 AND &lt;= 20</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q5：`DISTINCT a, b` 是只对 a 去重吗？</Text>
    </Paragraph>
    <Paragraph>
      不是。是对 <InlineCode>(a, b)</InlineCode> 这个<Text bold>组合</Text>整体去重，只有 a 和 b
      都相同的行才会被合并。
    </Paragraph>
    <Paragraph>
      <Text bold>Q6：`WHERE dept_id = 1 OR dept_id = 2 AND salary &gt; 9000` 的结果对吗？</Text>
    </Paragraph>
    <Paragraph>
      逻辑容易错。因为 <InlineCode>AND</InlineCode> 优先级高于 <InlineCode>OR</InlineCode>，它等于{' '}
      <InlineCode>dept_id = 1 OR (dept_id = 2 AND salary &gt; 9000)</InlineCode>
      。若本意是“(1部门 或 2部门) 且 工资&gt;9000”，必须加括号：
      <InlineCode>(dept_id = 1 OR dept_id = 2) AND salary &gt; 9000</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：`LIKE '_四'` 和 `LIKE '%四'` 有什么区别？</Text>
    </Paragraph>
    <Paragraph>
      <InlineCode>_四</InlineCode> 匹配“恰好两个字、以四结尾”（如李四），<InlineCode>_</InlineCode>{' '}
      严格代表一个字符；<InlineCode>%四</InlineCode> 匹配“以四结尾、长度不限”（如李四、张大四都行），
      <InlineCode>%</InlineCode> 代表任意多个字符。
    </Paragraph>
    <Paragraph>
      <Text bold>Q8：为什么尽量别用 `LIKE '%xxx%'`？</Text>
    </Paragraph>
    <Paragraph>
      以 <InlineCode>%</InlineCode>{' '}
      开头会导致索引失效、全表扫描，大数据量下性能很差。能用 <InlineCode>'前缀%'</InlineCode>
      就用前缀匹配；需要“包含”式搜索时考虑全文索引或专业搜索引擎。
    </Paragraph>
  </article>
);

export default index;
