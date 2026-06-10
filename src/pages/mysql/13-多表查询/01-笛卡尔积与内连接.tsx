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
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>笛卡尔积与内连接</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        第 10 章我们把数据合理地拆成了多张表（部门一张、员工一张），第 11
        章用范式论证了这样拆的道理。但拆开之后，查询时往往需要
        <Text bold>把它们再拼回去</Text>：「查每个员工<Text bold>和他所在部门的名字</Text>
        」——员工姓名在 <InlineCode>emp</InlineCode> 表，部门名字在{' '}
        <InlineCode>dept</InlineCode> 表，一张表查不全。这就需要
        <Text bold>多表查询（连接查询）</Text>。
      </Paragraph>
      <Paragraph>
        本章是 DQL 的高级篇，也是 SQL 的<Text bold>重中之重、面试必考</Text>，要讲透：
      </Paragraph>
      <OrderedList>
        <ListItem>
          直接把两张表放一起会产生<Text bold>笛卡尔积</Text>
          这个「错误起点」，理解它才能理解连接；
        </ListItem>
        <ListItem>
          <Text bold>内连接</Text>（隐式 / 显式）——查两表都匹配上的数据；
        </ListItem>
        <ListItem>
          <Text bold>外连接</Text>（左 / 右）——以某一张表为主，把没匹配上的也查出来；
        </ListItem>
        <ListItem>
          <Text bold>子查询</Text>
          ——把一个查询的结果当作另一个查询的条件或数据源，按结果形态分三种用法；
        </ListItem>
        <ListItem>三道综合练习把上面全部串起来。</ListItem>
      </OrderedList>
      <Paragraph>
        本章沿用统一示例库 <InlineCode>db_learn</InlineCode> 的{' '}
        <InlineCode>dept</InlineCode>（部门）和 <InlineCode>emp</InlineCode>
        （员工）两表，先把它们建好。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>〇、准备示例数据</Subtitle>
    <CodeBlock
      language="sql"
      code={`-- 部门表
CREATE TABLE dept (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  dept_name VARCHAR(20),
  loc       VARCHAR(20)
);
INSERT INTO dept (dept_name, loc) VALUES
  ('研发部','北京'), ('市场部','上海'), ('财务部','广州'),
  ('行政部','深圳');   -- 行政部故意先不放人，用于演示外连接

-- 员工表
CREATE TABLE emp (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  ename     VARCHAR(20),
  gender    CHAR(1),
  salary    DOUBLE,
  join_date DATE,
  dept_id   INT,
  bonus     DOUBLE,
  CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
  ('张三','男',8000, '2020-01-10', 1, 1000),
  ('李四','男',12000,'2019-03-15', 1, NULL),
  ('王五','女',9500, '2021-06-01', 2, 2000),
  ('赵六','女',6000, '2022-09-20', 2, NULL),
  ('孙七','男',15000,'2018-11-05', 3, 3000),
  ('周八','女',7000, '2023-02-18', NULL, NULL);  -- 周八暂未分配部门，用于演示外连接`}
    />
    <Paragraph>
      注意我们特意制造了两条「孤儿」数据：<Text bold>行政部没有员工</Text>、
      <Text bold>周八没有部门</Text>
      。它们在内连接里会被「过滤掉」，在外连接里又能被「捞出来」，是理解连接差异的关键。
    </Paragraph>

    <Divider />

    <Subtitle>一、笛卡尔积：所有错误的起点</Subtitle>
    <Paragraph>
      如果天真地把两张表写在 <InlineCode>FROM</InlineCode> 后面，不加任何条件：
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT * FROM emp, dept;`} />
    <Paragraph>
      结果会是 <InlineCode>emp</InlineCode> 的每一行去和 <InlineCode>dept</InlineCode>
      的每一行<Text bold>两两组合</Text>。emp 有 6 行、dept 有 4 行，结果就是{' '}
      <Text bold>6 × 4 = 24 行</Text>。这种「行数相乘」的全组合叫
      <Text bold>笛卡尔积</Text>。
    </Paragraph>
    <Paragraph>
      绝大多数组合是无意义的（比如「张三」配上了「财务部」，但张三明明是研发部）。
      <Text bold>
        笛卡尔积本身没用，多表查询的本质就是：在笛卡尔积的基础上，用条件筛掉无意义的组合，只留下「真正有关联」的行。
      </Text>{' '}
      那个条件就是 <InlineCode>emp.dept_id = dept.id</InlineCode>。
    </Paragraph>
    <Callout type="tip">
      记住这个思维模型，内连接/外连接都是「笛卡尔积 + 过滤条件」的不同变种。
    </Callout>

    <Divider />

    <Subtitle>二、内连接 INNER JOIN</Subtitle>
    <Callout type="note">
      <Text bold>内连接：只返回两张表中「相互匹配」（连接条件成立）的行。</Text>{' '}
      没匹配上的（孤儿数据）会被丢弃。
    </Callout>
    <Paragraph>内连接有两种写法，结果完全一样。</Paragraph>

    <Heading3>2.1 隐式内连接（用 WHERE 过滤笛卡尔积）</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 查每个员工的姓名、工资 及其所在部门的名称
SELECT emp.ename, emp.salary, dept.dept_name
FROM emp, dept
WHERE emp.dept_id = dept.id;`}
    />
    <Paragraph>结果（注意：行政部没人、周八没部门，都被过滤掉了）：</Paragraph>
    <Table
      head={['ename', 'salary', 'dept_name']}
      rows={[
        ['张三', '8000', '研发部'],
        ['李四', '12000', '研发部'],
        ['王五', '9500', '市场部'],
        ['赵六', '6000', '市场部'],
        ['孙七', '15000', '财务部'],
      ]}
    />

    <Heading3>2.2 显式内连接（INNER JOIN ... ON）</Heading3>
    <CodeBlock
      language="sql"
      code={`SELECT emp.ename, emp.salary, dept.dept_name
FROM emp INNER JOIN dept     -- INNER 可省略，写 JOIN 也行
ON emp.dept_id = dept.id;`}
    />
    <Paragraph>
      结果与隐式写法<Text bold>完全相同</Text>。区别只是：连接条件写在{' '}
      <InlineCode>ON</InlineCode> 里，语义更清晰，<InlineCode>WHERE</InlineCode>
      可以专心放业务过滤条件。
    </Paragraph>
    <Callout type="tip">
      <Text bold>推荐用显式 JOIN</Text>：<InlineCode>ON</InlineCode> 管「表怎么连」，
      <InlineCode>WHERE</InlineCode> 管「连完之后筛哪些行」，职责分明，是 SQL 标准写法。
    </Callout>

    <Heading3>2.3 表别名让 SQL 更简洁</Heading3>
    <Paragraph>
      表名太长时用别名（<InlineCode>AS</InlineCode> 可省略）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT e.ename, e.salary, d.dept_name
FROM emp e          -- emp 起别名 e
JOIN dept d         -- dept 起别名 d
ON e.dept_id = d.id
WHERE e.salary > 8000;   -- 连接后再加业务条件：只看工资大于 8000 的`}
    />
    <Callout type="warning">
      <Text bold>一旦给表起了别名，后面就必须用别名</Text>，不能再用原表名{' '}
      <InlineCode>emp.ename</InlineCode>，否则报错。
    </Callout>
  </article>
);

export default index;
