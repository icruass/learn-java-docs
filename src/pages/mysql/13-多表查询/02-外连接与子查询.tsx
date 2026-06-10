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
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>外连接与子查询</Title>

    <Subtitle>三、外连接 OUTER JOIN</Subtitle>
    <Paragraph>
      内连接会丢弃「孤儿」。但有时我们<Text bold>就是想看到没匹配上的那一方</Text>
      ——比如「列出所有部门，哪怕这个部门一个人都没有」。这就要用外连接。
    </Paragraph>

    <Heading3>3.1 左外连接 LEFT JOIN</Heading3>
    <Callout type="note">
      <Text bold>以左表为主</Text>：左表的<Text bold>所有行都保留</Text>
      ，右表没匹配上的部分用 <InlineCode>NULL</InlineCode> 填充。
    </Callout>
    <CodeBlock
      language="sql"
      code={`-- 查询所有部门，以及各部门下的员工（没有员工的部门也要列出来）
SELECT d.dept_name, e.ename
FROM dept d                  -- dept 在左，作为主表
LEFT JOIN emp e
ON d.id = e.dept_id;`}
    />
    <Paragraph>结果（行政部保留了，员工列为 NULL）：</Paragraph>
    <Table
      head={['dept_name', 'ename']}
      rows={[
        ['研发部', '张三'],
        ['研发部', '李四'],
        ['市场部', '王五'],
        ['市场部', '赵六'],
        ['财务部', '孙七'],
        ['行政部', 'NULL'],
      ]}
    />
    <Paragraph>
      注意：周八（没部门）<Text bold>不会出现</Text>
      ，因为左表是 dept，周八不在 dept 里。
    </Paragraph>

    <Heading3>3.2 右外连接 RIGHT JOIN</Heading3>
    <Callout type="note">
      <Text bold>以右表为主</Text>：右表的所有行都保留，左表没匹配上的用{' '}
      <InlineCode>NULL</InlineCode> 填充。
    </Callout>
    <CodeBlock
      language="sql"
      code={`-- 查询所有员工，以及其部门（没有部门的员工也要列出来）
SELECT d.dept_name, e.ename
FROM dept d
RIGHT JOIN emp e            -- emp 在右，作为主表
ON d.id = e.dept_id;`}
    />
    <Paragraph>结果（周八保留了，部门列为 NULL）：</Paragraph>
    <Table
      head={['dept_name', 'ename']}
      rows={[
        ['研发部', '张三'],
        ['研发部', '李四'],
        ['市场部', '王五'],
        ['市场部', '赵六'],
        ['财务部', '孙七'],
        ['NULL', '周八'],
      ]}
    />
    <Callout type="tip">
      <InlineCode>A LEFT JOIN B</InlineCode> 等价于 <InlineCode>B RIGHT JOIN A</InlineCode>。
      <Text bold>实际开发中绝大多数人统一用 </Text>
      <InlineCode>LEFT JOIN</InlineCode>，把主表放左边，思路更顺。
    </Callout>

    <Heading3>3.3 内连接 vs 外连接 一图看懂</Heading3>
    <Table
      head={['连接方式', '保留谁', '在我们的数据里']}
      rows={[
        ['INNER JOIN', '只保留两边都匹配的', '5 行（不含行政部、不含周八）'],
        ['LEFT JOIN（dept 在左）', '左表(部门)全保留', '6 行（多了「行政部 / NULL」）'],
        ['RIGHT JOIN（emp 在右）', '右表(员工)全保留', '6 行（多了「NULL / 周八」）'],
      ]}
    />
    <Callout type="warning">
      MySQL <Text bold>不支持</Text> <InlineCode>FULL OUTER JOIN</InlineCode>
      （全外连接）。需要「两边孤儿都要」时，用 <InlineCode>LEFT JOIN</InlineCode> 的结果{' '}
      <InlineCode>UNION</InlineCode> 上 <InlineCode>RIGHT JOIN</InlineCode> 的结果来模拟。
    </Callout>

    <Divider />

    <Subtitle>四、子查询（嵌套查询）</Subtitle>
    <Callout type="note">
      <Text bold>子查询：一个 SELECT 语句嵌套在另一个 SQL 语句里</Text>
      （通常用括号包起来）。内层查询的结果，供外层查询使用。
    </Callout>
    <Paragraph>
      按<Text bold>子查询结果的形态</Text>，分三种情况，这是掌握子查询的关键分类。
    </Paragraph>

    <Heading3>4.1 情况一：结果是「单行单列」——当作一个值，配比较运算符</Heading3>
    <Paragraph>
      子查询只返回一个值（一个标量），就可以用{' '}
      <InlineCode>&gt; &lt; = &gt;= &lt;= != </InlineCode> 等比较运算符直接拿来比较。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 需求：查询工资高于"全公司平均工资"的员工
-- 第一步：先单独算平均工资
SELECT AVG(salary) FROM emp;     -- 假设结果是 9583.33

-- 第二步：把它塞进 WHERE 当条件值（子查询）
SELECT ename, salary
FROM emp
WHERE salary > (SELECT AVG(salary) FROM emp);`}
    />
    <Paragraph>
      结果：李四(12000)、王五(9500 不行，低于9583？看具体值)、孙七(15000)等高于平均的员工。
    </Paragraph>
    <Callout type="tip">
      为什么必须用子查询而不能写 <InlineCode>WHERE salary &gt; AVG(salary)</InlineCode>
      ？因为<Text bold>聚合函数不能直接写在 WHERE 里</Text>（WHERE
      在分组聚合之前执行），所以只能先用子查询把平均值算出来。
    </Callout>
    <CodeBlock
      language="sql"
      code={`-- 类似例子：查工资最高的员工是谁
SELECT ename, salary FROM emp
WHERE salary = (SELECT MAX(salary) FROM emp);`}
    />

    <Heading3>4.2 情况二：结果是「多行单列」——当作一个集合，配 IN / ANY / ALL</Heading3>
    <Paragraph>
      子查询返回一列里的多个值，用 <InlineCode>IN</InlineCode>（在……之中）来匹配。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 需求：查询"研发部"和"市场部"的所有员工
-- 子查询先查出这两个部门的 id（多行单列）
SELECT id FROM dept WHERE dept_name IN ('研发部','市场部');   -- 返回 1,2

-- 外层用 IN 匹配
SELECT ename, salary, dept_id
FROM emp
WHERE dept_id IN (SELECT id FROM dept WHERE dept_name IN ('研发部','市场部'));`}
    />
    <Paragraph>结果：张三、李四、王五、赵六。</Paragraph>
    <Callout type="tip">
      <InlineCode>IN (子查询)</InlineCode> 适合「在一组动态值之中」；还有{' '}
      <InlineCode>&gt; ANY</InlineCode>（大于其中任意一个，即大于最小值）、
      <InlineCode>&gt; ALL</InlineCode>（大于所有，即大于最大值）等高级用法。
    </Callout>

    <Heading3>4.3 情况三：结果是「多行多列」——当作一张虚拟表，放在 FROM 后</Heading3>
    <Paragraph>
      当子查询返回的是多行多列（像一张小表），就可以把它当成一张临时表参与连接，
      <Text bold>必须给这张虚拟表起别名</Text>。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 需求：查询 2020-01-01 之后入职的员工 及其部门信息
-- 把"入职晚的员工"先筛成一张虚拟表 t，再和 dept 连接
SELECT t.ename, t.join_date, d.dept_name
FROM (SELECT * FROM emp WHERE join_date > '2020-01-01') t   -- t 是子查询当表，必须起别名
JOIN dept d
ON t.dept_id = d.id;`}
    />
    <Paragraph>结果：张三、王五、赵六、周八（周八没部门会被内连接过滤）等。</Paragraph>
    <Callout type="warning">
      <Text bold>FROM 后的子查询（派生表）必须起别名</Text>，否则 MySQL 报{' '}
      <InlineCode>Every derived table must have its own alias</InlineCode>。
    </Callout>

    <Heading3>4.4 三种子查询用法速查</Heading3>
    <Table
      head={['子查询结果形态', '用在哪', '配什么', '例子']}
      rows={[
        ['单行单列（一个值）', 'WHERE', '> < = != >= <=', 'salary > (SELECT AVG(salary)...)'],
        ['多行单列（一列多值）', 'WHERE', 'IN / ANY / ALL', 'dept_id IN (SELECT id FROM dept...)'],
        ['多行多列（一张表）', 'FROM', '当虚拟表 JOIN（必须起别名）', 'FROM (SELECT...) t JOIN dept d ...'],
      ]}
    />
  </article>
);

export default index;
