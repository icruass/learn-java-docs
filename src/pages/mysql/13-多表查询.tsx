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
    <Title>多表查询：笛卡尔积、内连接、外连接与子查询</Title>

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

    <Divider />

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

    <Divider />

    <Subtitle>五、综合练习</Subtitle>
    <Callout type="note">
      全部基于上面的 <InlineCode>dept</InlineCode> / <InlineCode>emp</InlineCode>{' '}
      数据，先自己想，再看答案。
    </Callout>

    <Heading3>练习 1：查询每个员工的姓名、工资、部门名称、部门所在城市</Heading3>
    <Paragraph>
      <Text bold>分析</Text>：员工信息在 emp，部门名和城市在 dept，按{' '}
      <InlineCode>dept_id = id</InlineCode> 内连接。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT e.ename, e.salary, d.dept_name, d.loc
FROM emp e
JOIN dept d ON e.dept_id = d.id;`}
    />

    <Heading3>练习 2：查询每个部门的名称 和 该部门的平均工资（没有员工的部门平均工资显示为 NULL）</Heading3>
    <Paragraph>
      <Text bold>分析</Text>：要保留「没员工的部门」（行政部），所以用{' '}
      <InlineCode>LEFT JOIN</InlineCode>；再按部门分组求平均。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT d.dept_name, AVG(e.salary) AS avg_salary
FROM dept d
LEFT JOIN emp e ON d.id = e.dept_id
GROUP BY d.id, d.dept_name;`}
    />
    <Paragraph>
      结果里「行政部」的 <InlineCode>avg_salary</InlineCode> 为{' '}
      <InlineCode>NULL</InlineCode>（它一个员工都没有）。
    </Paragraph>

    <Heading3>练习 3：查询工资高于其所在部门平均工资的员工</Heading3>
    <Paragraph>
      <Text bold>分析</Text>
      ：典型「相关子查询」——先把「各部门平均工资」算成一张虚拟表，再和员工连接比较。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT e.ename, e.salary, e.dept_id, t.avg_sal
FROM emp e
JOIN (
    SELECT dept_id, AVG(salary) AS avg_sal
    FROM emp
    GROUP BY dept_id
) t
ON e.dept_id = t.dept_id
WHERE e.salary > t.avg_sal;`}
    />
    <Paragraph>
      这道题把<Text bold>子查询当虚拟表 + 内连接 + 比较</Text>
      三个知识点全用上了，是多表查询的集大成。
    </Paragraph>

    <Divider />

    <Subtitle>六、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>笛卡尔积</Text>
        ：两表直接组合产生「行数相乘」的全组合，多数无意义；连接查询 = 笛卡尔积 +
        过滤条件。
      </ListItem>
      <ListItem>
        <Text bold>内连接</Text>：只要两边都匹配的行；
        <UnorderedList>
          <ListItem>
            隐式：<InlineCode>FROM a, b WHERE a.x = b.y</InlineCode>
          </ListItem>
          <ListItem>
            显式（推荐）：<InlineCode>FROM a JOIN b ON a.x = b.y</InlineCode>
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>外连接</Text>：保留某一方的全部，缺失方补 NULL；
        <UnorderedList>
          <ListItem>
            左外 <InlineCode>LEFT JOIN</InlineCode>（左表为主）、右外{' '}
            <InlineCode>RIGHT JOIN</InlineCode>（右表为主）；
          </ListItem>
          <ListItem>
            MySQL 无 <InlineCode>FULL JOIN</InlineCode>，用 <InlineCode>UNION</InlineCode>{' '}
            模拟。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>子查询三形态</Text>：
        <UnorderedList>
          <ListItem>单行单列 → WHERE 里配比较运算符；</ListItem>
          <ListItem>
            多行单列 → WHERE 里配 <InlineCode>IN</InlineCode>；
          </ListItem>
          <ListItem>多行多列 → FROM 里当虚拟表（必须起别名）。</ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>实战要点</Text>：用表别名、显式 JOIN、ON 管连接 / WHERE 管过滤。
      </ListItem>
    </UnorderedList>

    <Heading3>常见易错问答</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>问：内连接和外连接结果不一样，怎么选？</Text>
        答：只要「两边都匹配」的数据用内连接；需要「保留没匹配上的一方」（如没员工的部门）就用外连接。
      </ListItem>
      <ListItem>
        <Text bold>
          问：<InlineCode>WHERE</InlineCode> 写连接条件和 <InlineCode>ON</InlineCode>{' '}
          写有啥区别？
        </Text>
        答：内连接里两者结果相同；但<Text bold>外连接里差别很大</Text>——
        <InlineCode>ON</InlineCode> 里的条件影响「怎么连/补不补 NULL」，
        <InlineCode>WHERE</InlineCode>
        里的条件是连完之后再过滤，可能把补出来的 NULL
        行又滤掉，导致外连接「退化」成内连接。
      </ListItem>
      <ListItem>
        <Text bold>问：子查询和 JOIN 能互换吗？</Text>
        答：很多场景能互换。一般 JOIN
        性能更好、可读性更强；子查询在表达「先算个值再比较」时更直观。
      </ListItem>
    </OrderedList>
  </article>
);

export default index;
