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
    <Title>DQL 进阶：排序、聚合函数、分组查询与分页查询</Title>

    <Subtitle>本章导读</Subtitle>
    <Paragraph>
      在上一章，我们已经掌握了 DQL 最基础的能力：用{' '}
      <InlineCode>SELECT ... FROM ... WHERE ...</InlineCode> 把表里
      <Text bold>符合条件的行</Text>
      一条条挑出来。但在真实业务里，光把数据“挑出来”是远远不够的，老板更关心的往往是这样的问题：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        “把工资从高到低排个序给我看看” —— 这是<Text bold>排序</Text>；
      </ListItem>
      <ListItem>
        “公司一共多少人？平均工资多少？最高工资多少？” —— 这是
        <Text bold>聚合（统计）</Text>；
      </ListItem>
      <ListItem>
        “每个部门各自的平均工资分别是多少？” —— 这是<Text bold>分组</Text>；
      </ListItem>
      <ListItem>
        “数据有几万条，前端一页只显示 10 条，怎么取第 3 页？” —— 这是
        <Text bold>分页</Text>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      本章就是把 DQL
      从“查一行行的原始数据”升级到“查统计结果、查报表”的关键一跃。它在整个 SQL
      学习里处于承上启下的位置：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>承上</Text>：所有例子仍然建立在上一章的{' '}
        <InlineCode>WHERE</InlineCode> 过滤之上；
      </ListItem>
      <ListItem>
        <Text bold>启下</Text>：本章的 <InlineCode>GROUP BY</InlineCode>
        、聚合函数是后面学习多表连接查询、子查询做报表统计的地基。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      学完本章，你将能写出一条像模像样的“统计报表 SQL”，比如这样一条把本章知识点全用上的语句（先有个印象，本章末尾你会完全看懂它）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT dept_id, COUNT(*) AS 人数, AVG(salary) AS 平均工资
FROM emp
WHERE salary > 7000          -- 分组前过滤：只统计工资 > 7000 的人
GROUP BY dept_id             -- 按部门分组
HAVING AVG(salary) > 8000    -- 分组后过滤：只保留平均工资 > 8000 的部门
ORDER BY 平均工资 DESC       -- 按平均工资降序
LIMIT 0, 2;                  -- 分页：取第 1 页，每页 2 条`}
    />
    <Callout type="tip">
      本章一定要<Text bold>亲手敲</Text>。统计类 SQL 看着简单，但{' '}
      <InlineCode>WHERE</InlineCode> 和 <InlineCode>HAVING</InlineCode>
      谁先谁后、<InlineCode>COUNT(*)</InlineCode> 和{' '}
      <InlineCode>COUNT(列)</InlineCode> 差在哪，不动手就永远似懂非懂。
    </Callout>

    <Divider />

    <Subtitle>0. 准备工作：建库建表与示例数据</Subtitle>
    <Paragraph>
      本章沿用全套教程统一的 <InlineCode>db_learn</InlineCode>
      数据库与员工/部门表。为保证你能直接复现每一条结果，请先执行下面的脚本（已经建过的同学可跳过，或者先{' '}
      <InlineCode>DROP</InlineCode> 再重建以保证数据一致）。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 创建并切换数据库
CREATE DATABASE IF NOT EXISTS db_learn DEFAULT CHARSET utf8mb4;
USE db_learn;

-- 部门表
CREATE TABLE dept (
  id INT PRIMARY KEY AUTO_INCREMENT,   -- 部门编号
  dept_name VARCHAR(20),               -- 部门名称
  loc VARCHAR(20)                      -- 所在城市
);
INSERT INTO dept (dept_name, loc) VALUES
  ('研发部','北京'), ('市场部','上海'), ('财务部','广州');

-- 员工表
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
      执行后 <InlineCode>emp</InlineCode>
      表里的数据如下（这张表会贯穿全章，建议你截图或抄下来对照）：
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
    <Paragraph>注意两点，后面反复要用：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>bonus</InlineCode>（奖金）有两个 <InlineCode>NULL</InlineCode>
        （李四、赵六），专门用来演示 NULL 对聚合的影响。
      </ListItem>
      <ListItem>
        <InlineCode>dept_id</InlineCode>：1=研发部、2=市场部、3=财务部。研发部 2
        人、市场部 2 人、财务部 1 人。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>1. 排序查询 ORDER BY</Subtitle>

    <Heading3>1.1 为什么需要排序</Heading3>
    <Paragraph>
      默认情况下，<InlineCode>SELECT</InlineCode>
      查出来的行是“没有保证顺序”的——你不能假设它一定按主键升序返回（虽然小表常常看起来是）。只要你想让结果
      <Text bold>按某个规则排好队</Text>，就必须显式写{' '}
      <InlineCode>ORDER BY</InlineCode>。
    </Paragraph>
    <Callout type="warning">
      不写 <InlineCode>ORDER BY</InlineCode> 时，结果顺序是
      <Text bold>不确定的</Text>，不要依赖它。哪怕现在看着是有序的，换台机器、加了索引、数据量变大后顺序就可能变。要顺序就一定写{' '}
      <InlineCode>ORDER BY</InlineCode>。
    </Callout>

    <Heading3>1.2 语法格式</Heading3>
    <CodeBlock
      language="text"
      code={`SELECT 列1, 列2, ...
FROM 表名
[WHERE 条件]
ORDER BY 排序列1 [ASC|DESC], 排序列2 [ASC|DESC], ... ;`}
    />
    <Paragraph>逐项解释：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>
          <InlineCode>ORDER BY</InlineCode> 排序列
        </Text>
        ：按哪一（几）列排队。可以是字段名，也可以是表达式、甚至是{' '}
        <InlineCode>SELECT</InlineCode> 里起的别名。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>ASC</InlineCode>
        </Text>
        ：ascending，<Text bold>升序</Text>（从小到大，从 A 到 Z，从旧到新）。
        <Text bold>这是默认值</Text>，不写就是它。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>DESC</InlineCode>
        </Text>
        ：descending，<Text bold>降序</Text>（从大到小）。
      </ListItem>
      <ListItem>
        <Text bold>多字段</Text>：用逗号分隔，
        <Text bold>
          先按第一个字段排，第一个字段相同的行再按第二个字段排
        </Text>
        ，以此类推。
      </ListItem>
    </UnorderedList>

    <Heading3>1.3 单字段排序示例</Heading3>
    <Paragraph>
      <Text bold>例 1：按工资升序（默认）</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, salary
FROM emp
ORDER BY salary;          -- 等价于 ORDER BY salary ASC`}
    />
    <Paragraph>结果（从低到高）：</Paragraph>
    <Table
      head={['id', 'ename', 'salary']}
      rows={[
        ['4', '赵六', '6000'],
        ['1', '张三', '8000'],
        ['3', '王五', '9500'],
        ['2', '李四', '12000'],
        ['5', '孙七', '15000'],
      ]}
    />
    <Paragraph>
      <Text bold>例 2：按工资降序</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, salary
FROM emp
ORDER BY salary DESC;`}
    />
    <Paragraph>结果（从高到低）：</Paragraph>
    <Table
      head={['id', 'ename', 'salary']}
      rows={[
        ['5', '孙七', '15000'],
        ['2', '李四', '12000'],
        ['3', '王五', '9500'],
        ['1', '张三', '8000'],
        ['4', '赵六', '6000'],
      ]}
    />

    <Heading3>1.4 多字段排序示例</Heading3>
    <Paragraph>
      类比：体育课排队，<Text bold>先按身高从高到矮排</Text>
      ；如果两个人一样高（身高相同），<Text bold>再按学号从小到大排</Text>
      。身高就是“第一排序字段”，学号是“第二排序字段”，只有在第一字段“打平”时第二字段才起作用。
    </Paragraph>
    <Paragraph>
      我们的 5 条数据工资各不相同，看不出第二字段的效果，先按
      <Text bold>性别</Text>分一下再看：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, gender, salary
FROM emp
ORDER BY gender ASC, salary DESC;   -- 先按性别升序，性别相同再按工资降序`}
    />
    <Paragraph>
      结果：性别先分成“男”“女”两堆（<InlineCode>女</InlineCode>{' '}
      在前是因为字符比较里它排前面，下面会解释），每堆内部再按工资从高到低：
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', '']}
      rows={[
        ['3', '王五', '女', '9500', '← 女，组内工资最高'],
        ['4', '赵六', '女', '6000', '← 女'],
        ['5', '孙七', '男', '15000', '← 男，组内工资最高'],
        ['2', '李四', '男', '12000', '← 男'],
        ['1', '张三', '男', '8000', '← 男'],
      ]}
    />
    <Callout type="tip">
      每个字段可以<Text bold>单独</Text>指定升降。上例{' '}
      <InlineCode>gender ASC, salary DESC</InlineCode>{' '}
      表示“性别升序、工资降序”，这是两件独立的事。<InlineCode>DESC</InlineCode>{' '}
      <Text bold>只作用于它紧挨着的前一个字段</Text>，不会顺延到后面。
    </Callout>
    <Paragraph>
      最经典的一条（任务点名要求）——工资降序，工资相同的按员工号升序：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, salary
FROM emp
ORDER BY salary DESC, id ASC;`}
    />
    <Paragraph>
      这条的含义：先把工资高的排前面；万一有两个人工资一样（本例没有），就让{' '}
      <InlineCode>id</InlineCode> 小的排前面，保证顺序<Text bold>稳定可预期</Text>
      。这是工程上极常用的写法——<Text bold>用一个唯一列（如主键 id）做最后的“兜底排序”</Text>
      ，避免顺序抖动。
    </Paragraph>

    <Heading3>1.5 排序的进阶与坑</Heading3>
    <Paragraph>
      <Text bold>(1) 中文/字符的排序规则</Text>
      ：上例中“女”排在“男”前面，并不是因为拼音，而是按列的
      <Text bold>字符集排序规则（collation）</Text>比较的。如果你想按拼音排序，要让列使用支持拼音的
      collation，或用 <InlineCode>CONVERT(ename USING gbk)</InlineCode>{' '}
      转换后排序：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename FROM emp ORDER BY CONVERT(ename USING gbk);`}
    />
    <Paragraph>
      初学阶段记住一句话即可：
      <Text bold>
        字符的排序结果取决于字符集与 collation，不一定符合你直觉里的“拼音顺序”。
      </Text>
    </Paragraph>
    <Paragraph>
      <Text bold>(2) 按别名/表达式排序</Text>：<InlineCode>ORDER BY</InlineCode>{' '}
      可以直接用 <InlineCode>SELECT</InlineCode>{' '}
      里起的别名，因为排序在投影（选列）之后执行：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, salary * 12 AS year_salary
FROM emp
ORDER BY year_salary DESC;        -- 用别名排序，OK`}
    />
    <Table
      head={['ename', 'year_salary']}
      rows={[
        ['孙七', '180000'],
        ['李四', '144000'],
        ['王五', '114000'],
        ['张三', '96000'],
        ['赵六', '72000'],
      ]}
    />
    <Paragraph>
      <Text bold>(3) 🕳️ 常见坑：NULL 在排序里排哪儿？</Text>
    </Paragraph>
    <Paragraph>
      MySQL 里 <InlineCode>ORDER BY</InlineCode> 把{' '}
      <Text bold>
        <InlineCode>NULL</InlineCode> 当作“最小值”
      </Text>
      ：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        升序 <InlineCode>ASC</InlineCode> 时，<InlineCode>NULL</InlineCode> 排在
        <Text bold>最前面</Text>；
      </ListItem>
      <ListItem>
        降序 <InlineCode>DESC</InlineCode> 时，<InlineCode>NULL</InlineCode> 排在
        <Text bold>最后面</Text>。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="sql"
      code={`SELECT ename, bonus
FROM emp
ORDER BY bonus ASC;`}
    />
    <Paragraph>结果（两个 NULL 跑到了最前面）：</Paragraph>
    <Table
      head={['ename', 'bonus']}
      rows={[
        ['李四', 'NULL'],
        ['赵六', 'NULL'],
        ['张三', '1000'],
        ['王五', '2000'],
        ['孙七', '3000'],
      ]}
    />
    <Paragraph>
      如果你希望“有奖金的排前面、没奖金的垫底”，可以用{' '}
      <InlineCode>IFNULL</InlineCode> 把 NULL 换成一个值，或用{' '}
      <InlineCode>ISNULL</InlineCode> 辅助排序：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 让 NULL 当 0 处理后再降序：有奖金的在前，NULL 在最后
SELECT ename, bonus
FROM emp
ORDER BY IFNULL(bonus, 0) DESC;`}
    />
    <Paragraph>
      <Text bold>
        (4) 🕳️ 常见坑：<InlineCode>ORDER BY 1</InlineCode>{' '}
        是按“第几列”排，不是按数字 1
      </Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, salary FROM emp ORDER BY 2 DESC;  -- 按第 2 列(salary)降序`}
    />
    <Paragraph>
      这种“用列序号排序”的写法可读性差、改 SELECT 列时极易出错，
      <Text bold>不推荐</Text>，了解即可。
    </Paragraph>

    <Divider />

    <Subtitle>2. 聚合函数（统计函数）</Subtitle>

    <Heading3>2.1 什么是聚合函数</Heading3>
    <Paragraph>
      前面所有查询都是“<Text bold>纵向</Text>地一行一行处理”。而聚合函数是“
      <Text bold>把一整列的多个值压缩成一个值</Text>”——比如把 5
      个人的工资加成一个总和、算出一个平均值。这叫“聚合（aggregate）”，也叫“纵向统计”。
    </Paragraph>
    <Paragraph>
      类比：聚合函数就像 Excel
      里选中一列数字，底部状态栏自动显示的“求和、平均值、计数”。
    </Paragraph>

    <Heading3>2.2 五个常用聚合函数</Heading3>
    <Table
      head={['函数', '作用', '说明']}
      rows={[
        ['COUNT()', '计数（统计行数）', '数“有多少个”'],
        ['SUM()', '求和', '只对数值列有意义'],
        ['AVG()', '求平均值', '只对数值列有意义'],
        ['MAX()', '求最大值', '数值、日期、字符串都可以'],
        ['MIN()', '求最小值', '数值、日期、字符串都可以'],
      ]}
    />

    <Heading3>2.3 对 emp.salary 逐个演示</Heading3>
    <Paragraph>
      <Text bold>例 1：统计员工总人数</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT COUNT(*) AS 总人数 FROM emp;`} />
    <Table head={['总人数']} rows={[['5']]} />
    <Paragraph>
      <Text bold>例 2：工资总和、平均、最高、最低</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT
  SUM(salary) AS 工资总和,
  AVG(salary) AS 平均工资,
  MAX(salary) AS 最高工资,
  MIN(salary) AS 最低工资
FROM emp;`}
    />
    <Paragraph>
      计算过程：总和 = 8000+12000+9500+6000+15000 = 50500；平均 = 50500/5 = 10100。
    </Paragraph>
    <Table
      head={['工资总和', '平均工资', '最高工资', '最低工资']}
      rows={[['50500', '10100', '15000', '6000']]}
    />
    <Callout type="tip">
      聚合函数<Text bold>默认对整张表（或满足 <InlineCode>WHERE</InlineCode> 的所有行）作为一个整体</Text>
      计算，最终只返回<Text bold>一行</Text>结果。所以{' '}
      <InlineCode>SELECT COUNT(*) FROM emp;</InlineCode> 永远只有一行。
    </Callout>
    <Paragraph>
      <Text bold>例 3：聚合函数可以和 <InlineCode>WHERE</InlineCode> 搭配</Text> ——
      先过滤，再统计。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 只统计研发部(dept_id=1)的平均工资
SELECT AVG(salary) AS 研发部平均工资
FROM emp
WHERE dept_id = 1;`}
    />
    <Paragraph>
      研发部是张三(8000)、李四(12000)，平均 = (8000+12000)/2 = 10000。
    </Paragraph>
    <Table head={['研发部平均工资']} rows={[['10000']]} />
    <Paragraph>
      <Text bold>
        例 4：<InlineCode>MAX/MIN</InlineCode> 也能用于日期，找最早/最晚入职
      </Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT MIN(join_date) AS 最早入职, MAX(join_date) AS 最晚入职 FROM emp;`}
    />
    <Table
      head={['最早入职', '最晚入职']}
      rows={[['2018-11-05', '2022-09-20']]}
    />

    <Heading3>2.4 🕳️ 常见坑：聚合函数不能直接和“普通列”一起裸查</Heading3>
    <Paragraph>
      很多新手会写出这种“看起来很合理”的语句，想查“最高工资是谁”：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ❌ 这是错误/有歧义的写法！
SELECT ename, MAX(salary) FROM emp;`}
    />
    <Paragraph>
      问题在于：<InlineCode>MAX(salary)</InlineCode>{' '}
      把整列压成一个值（15000），但 <InlineCode>ename</InlineCode> 有 5
      个值，数据库不知道该配哪个名字。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        在 MySQL{' '}
        <Text bold>
          开启了 <InlineCode>ONLY_FULL_GROUP_BY</InlineCode>（默认开启）
        </Text>{' '}
        时，这条会直接<Text bold>报错</Text>。
      </ListItem>
      <ListItem>
        即使没报错（旧版本/关掉该模式），返回的 <InlineCode>ename</InlineCode> 也是
        <Text bold>随机某一行</Text>的，<Text bold>不保证是 15000 对应的孙七</Text>
        ，结果不可信。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      要查“最高工资是谁”，正确做法是用子查询（后续章节细讲），这里先给出正确结果对照：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, salary FROM emp WHERE salary = (SELECT MAX(salary) FROM emp);`}
    />
    <Table head={['ename', 'salary']} rows={[['孙七', '15000']]} />
    <Paragraph>
      记住一句话：
      <Text bold>
        聚合函数和普通列不能随便混在一起 SELECT，除非那个普通列是{' '}
        <InlineCode>GROUP BY</InlineCode> 的分组列
      </Text>
      （见第 4 节）。
    </Paragraph>

    <Divider />

    <Subtitle>3. 聚合函数与 NULL（重点）</Subtitle>
    <Paragraph>
      这一节是聚合里最容易踩、面试也最爱问的地方，务必弄懂。
    </Paragraph>

    <Heading3>3.1 核心规则：聚合函数默认忽略 NULL</Heading3>
    <Paragraph>
      <InlineCode>SUM / AVG / MAX / MIN / COUNT(列)</InlineCode> 在计算时，会把值为{' '}
      <InlineCode>NULL</InlineCode> 的格子<Text bold>当作不存在，直接跳过</Text>
      ，而不是当成 0。
    </Paragraph>
    <Paragraph>
      我们用 <InlineCode>bonus</InlineCode>（奖金）列来验证，它有两个
      NULL（李四、赵六）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT
  COUNT(bonus) AS 有奖金人数,
  SUM(bonus)   AS 奖金总和,
  AVG(bonus)   AS 奖金平均,
  MAX(bonus)   AS 奖金最高,
  MIN(bonus)   AS 奖金最低
FROM emp;`}
    />
    <Paragraph>非 NULL 的奖金只有 3 个：1000、2000、3000。</Paragraph>
    <Table
      head={['有奖金人数', '奖金总和', '奖金平均', '奖金最高', '奖金最低']}
      rows={[['3', '6000', '2000', '3000', '1000']]}
    />
    <Paragraph>
      请特别注意 <Text bold>
        <InlineCode>AVG(bonus) = 2000</InlineCode>
      </Text>
      ：它是 <InlineCode>6000 / 3</InlineCode>（<Text bold>只除以有值的 3 个人</Text>
      ），而不是 <InlineCode>6000 / 5 = 1200</InlineCode>（全员 5 人）。
    </Paragraph>
    <Callout type="warning">
      <InlineCode>AVG</InlineCode> 忽略 NULL 是“双刃剑”。如果你的业务认为“没奖金 =
      奖金 0”，那么 <InlineCode>AVG(bonus)=2000</InlineCode> 这个结果就是
      <Text bold>偏高、错误</Text>的，因为它无视了赵六、李四这两个
      0。这种语义上的坑比语法错误更隐蔽。
    </Callout>

    <Heading3>
      3.2 <InlineCode>COUNT(*)</InlineCode> vs{' '}
      <InlineCode>COUNT(列)</InlineCode>：最经典的区别
    </Heading3>
    <Table
      head={['写法', '含义', '是否受 NULL 影响']}
      rows={[
        ['COUNT(*)', '统计总行数（有几行算几行）', '不受影响，NULL 行照样算'],
        ['COUNT(列名)', '统计该列中非 NULL 的值的个数', '该列为 NULL 的行不计入'],
        ['COUNT(1)', '等价于 COUNT(*)，统计总行数', '不受影响'],
        ['COUNT(DISTINCT 列)', '统计该列去重后的非 NULL 值个数', 'NULL 不计'],
      ]}
    />
    <Paragraph>一条 SQL 看尽区别：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT
  COUNT(*)     AS 总行数,
  COUNT(salary) AS 工资非空数,
  COUNT(bonus) AS 奖金非空数,
  COUNT(1)     AS count_1
FROM emp;`}
    />
    <Paragraph>
      <InlineCode>salary</InlineCode> 列 5 个都有值；<InlineCode>bonus</InlineCode>{' '}
      列只有 3 个有值（2 个 NULL）。
    </Paragraph>
    <Table
      head={['总行数', '工资非空数', '奖金非空数', 'count_1']}
      rows={[['5', '5', '3', '5']]}
    />
    <Paragraph>
      一句话总结：
      <Text bold>
        <InlineCode>COUNT(*)</InlineCode> 数“行”，<InlineCode>COUNT(列)</InlineCode>{' '}
        数“该列有值的格子”。
      </Text>{' '}
      当列里有 NULL 时，两者就会不一样。
    </Paragraph>
    <Callout type="tip">
      <Paragraph>
        日常统计“总共有多少条记录”，请直接用 <InlineCode>COUNT(*)</InlineCode>
        （语义最清晰，性能也好）。不要用{' '}
        <InlineCode>COUNT(某个可能为 NULL 的列)</InlineCode>，否则会少数。
      </Paragraph>
      <Paragraph>
        关于 <InlineCode>COUNT(*)</InlineCode> 和 <InlineCode>COUNT(1)</InlineCode>{' '}
        的性能：在现代 MySQL（InnoDB）里两者<Text bold>几乎没有差别</Text>
        ，优化器会做同样处理，不必纠结，能看懂就行。
      </Paragraph>
    </Callout>

    <Heading3>
      3.3 如何把 NULL 也算进去：<InlineCode>COUNT(IFNULL(...))</InlineCode> 与{' '}
      <InlineCode>IFNULL</InlineCode>
    </Heading3>
    <Paragraph>
      需求：我想统计“包含没奖金的人在内的全部 5 个人”，或者想让“没奖金 =
      0”参与平均、求和计算，怎么办？
    </Paragraph>
    <Paragraph>
      办法是用 <InlineCode>IFNULL(列, 默认值)</InlineCode>：当列为 NULL 时，把它
      <Text bold>替换成你指定的默认值</Text>，再交给聚合函数。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT
  COUNT(IFNULL(bonus, 0)) AS 全员计数,   -- NULL 被换成 0，于是“有值”，被计入
  SUM(IFNULL(bonus, 0))   AS 奖金总和,   -- 总和不变，因为加 0 不影响
  AVG(IFNULL(bonus, 0))   AS 真平均       -- 关键：分母变成 5 了
FROM emp;`}
    />
    <Paragraph>逐项解释：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>COUNT(IFNULL(bonus,0))</InlineCode>：把 2 个 NULL 变成 0 后，
        <InlineCode>bonus</InlineCode> 这一列就“全员有值”了，所以计数从 3 变成{' '}
        <Text bold>5</Text>。
      </ListItem>
      <ListItem>
        <InlineCode>AVG(IFNULL(bonus,0))</InlineCode>：现在 5 个数是
        1000、0、2000、0、3000，平均 = 6000 / <Text bold>5</Text> ={' '}
        <Text bold>1200</Text>。和 3.1 节的 2000 形成鲜明对比。
      </ListItem>
    </UnorderedList>
    <Table
      head={['全员计数', '奖金总和', '真平均']}
      rows={[['5', '6000', '1200']]}
    />
    <Paragraph>对比记忆：</Paragraph>
    <Table
      head={['写法', '结果（平均）', '含义']}
      rows={[
        ['AVG(bonus)', '2000', '没奖金的人不参与平均'],
        ['AVG(IFNULL(bonus, 0))', '1200', '没奖金的当 0，全员参与'],
      ]}
    />
    <Callout type="danger">
      <Paragraph>常见坑：到底该用哪个？取决于业务语义——</Paragraph>
      <UnorderedList>
        <ListItem>
          “在拿到奖金的人里，人均奖金多少” → 用 <InlineCode>AVG(bonus)</InlineCode>
          （忽略 NULL）。
        </ListItem>
        <ListItem>
          “把没奖金的也算进来，全公司人均奖金多少” → 用{' '}
          <InlineCode>AVG(IFNULL(bonus,0))</InlineCode>。
        </ListItem>
      </UnorderedList>
      <Paragraph>
        选错了，数字差近一倍，这是统计报表里最常见的“算错钱”事故。
      </Paragraph>
    </Callout>
    <Paragraph>
      补充：<InlineCode>IFNULL(a, b)</InlineCode> 是 MySQL 的函数（标准 SQL
      里对应 <InlineCode>COALESCE(a, b)</InlineCode>，
      <InlineCode>COALESCE</InlineCode> 还能接多个参数，取第一个非 NULL
      的）。两者你都会遇到：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT IFNULL(bonus, 0), COALESCE(bonus, 0) FROM emp;  -- 这两列结果完全相同`}
    />

    <Divider />

    <Subtitle>4. 分组查询 GROUP BY</Subtitle>

    <Heading3>4.1 从“整体统计”到“分组统计”</Heading3>
    <Paragraph>
      第 2 节的聚合是把<Text bold>整张表当成一个组</Text>算出一个总数。但现实需求往往是“
      <Text bold>分门别类</Text>地统计”：每个部门各自的平均工资、每种性别各自的人数……这就需要先
      <Text bold>分组</Text>，再对<Text bold>每个组</Text>分别做聚合。
    </Paragraph>
    <Paragraph>
      类比：班里 30 个学生，老师说“按男女分成两组，各组报一下平均分”。
      <InlineCode>GROUP BY gender</InlineCode> 就是“按性别分组”，
      <InlineCode>AVG(score)</InlineCode>{' '}
      就是“各组报平均分”。最终结果有几行，取决于分成了几组。
    </Paragraph>

    <Heading3>4.2 语法格式</Heading3>
    <CodeBlock
      language="text"
      code={`SELECT 分组列, 聚合函数(...)
FROM 表名
[WHERE 分组前的条件]
GROUP BY 分组列
[HAVING 分组后的条件]
[ORDER BY ...]
[LIMIT ...];`}
    />

    <Heading3>4.3 基础示例：按部门求平均工资</Heading3>
    <CodeBlock
      language="sql"
      code={`SELECT dept_id, AVG(salary) AS 平均工资
FROM emp
GROUP BY dept_id;`}
    />
    <Paragraph>
      数据库做的事：先把 5 行按 <InlineCode>dept_id</InlineCode> 分成 3
      堆，再对每堆算 <InlineCode>AVG(salary)</InlineCode>：
    </Paragraph>
    <UnorderedList>
      <ListItem>研发部(1)：张三8000、李四12000 → 平均 10000</ListItem>
      <ListItem>市场部(2)：王五9500、赵六6000 → 平均 7750</ListItem>
      <ListItem>财务部(3)：孙七15000 → 平均 15000</ListItem>
    </UnorderedList>
    <Paragraph>
      结果（<Text bold>有几个组就几行</Text>）：
    </Paragraph>
    <Table
      head={['dept_id', '平均工资']}
      rows={[
        ['1', '10000'],
        ['2', '7750'],
        ['3', '15000'],
      ]}
    />
    <Paragraph>通常还会带上每组的人数，更像一张报表：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT dept_id,
       COUNT(*)    AS 人数,
       AVG(salary) AS 平均工资,
       MAX(salary) AS 最高工资,
       MIN(salary) AS 最低工资
FROM emp
GROUP BY dept_id;`}
    />
    <Table
      head={['dept_id', '人数', '平均工资', '最高工资', '最低工资']}
      rows={[
        ['1', '2', '10000', '12000', '8000'],
        ['2', '2', '7750', '9500', '6000'],
        ['3', '1', '15000', '15000', '15000'],
      ]}
    />

    <Heading3>4.4 核心规则：分组后 SELECT 只能出现“分组列 + 聚合函数”</Heading3>
    <Paragraph>
      这是 <InlineCode>GROUP BY</InlineCode> 最重要、也是新手最常错的规则：
    </Paragraph>
    <Callout type="note">
      <Text bold>
        一旦使用了 <InlineCode>GROUP BY</InlineCode>，<InlineCode>SELECT</InlineCode>{' '}
        后面只允许出现两类东西：①出现在 <InlineCode>GROUP BY</InlineCode>{' '}
        里的分组列；②聚合函数。
      </Text>{' '}
      其他普通列都不允许（在 <InlineCode>ONLY_FULL_GROUP_BY</InlineCode> 模式下会报错）。
    </Callout>
    <Paragraph>
      为什么？因为分组后<Text bold>一行代表“一整个组”</Text>
      。比如研发部这一组有张三、李四两个人，你写{' '}
      <InlineCode>SELECT ename</InlineCode>
      ，数据库不知道该显示“张三”还是“李四”——这是没有意义的。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ❌ 错误：ename 既不是分组列，也不是聚合函数
SELECT dept_id, ename, AVG(salary) FROM emp GROUP BY dept_id;
-- 报错：ename is not in GROUP BY clause and ... ONLY_FULL_GROUP_BY`}
    />
    <CodeBlock
      language="sql"
      code={`-- ✅ 正确：要么 ename 在 GROUP BY 里，要么用聚合函数包住
SELECT dept_id, COUNT(ename) AS 人数 FROM emp GROUP BY dept_id;  -- 用聚合`}
    />
    <Callout type="warning">
      注意 <InlineCode>ONLY_FULL_GROUP_BY</InlineCode>：这是 MySQL 5.7+
      默认开启的“严格模式”，专门拦截上面这种有歧义的写法。老教程/老项目里可能见过“
      <InlineCode>SELECT *</InlineCode> 配 <InlineCode>GROUP BY</InlineCode>
      也能跑”的代码，那是关掉了该模式、靠 MySQL“随便挑一行”的危险特性，
      <Text bold>结果不可靠，强烈不建议</Text>。本章所有例子都以严格模式为准。
    </Callout>
    <Paragraph>可以按多列分组（先按性别、再按部门细分）：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT gender, dept_id, COUNT(*) AS 人数
FROM emp
GROUP BY gender, dept_id;`}
    />
    <Table
      head={['gender', 'dept_id', '人数', '']}
      rows={[
        ['男', '1', '2', '← 男+研发：张三、李四'],
        ['女', '2', '2', '← 女+市场：王五、赵六'],
        ['男', '3', '1', '← 男+财务：孙七'],
      ]}
    />

    <Divider />

    <Subtitle>5. WHERE 与 HAVING 的区别（重点中的重点）</Subtitle>

    <Heading3>5.1 一句话区别</Heading3>
    <Table
      head={['维度', 'WHERE', 'HAVING']}
      rows={[
        ['执行时机', '分组之前，对原始行过滤', '分组之后，对每个组的结果过滤'],
        ['能否用聚合函数', '不能（此时还没算出聚合值）', '可以（这正是它存在的意义）'],
        ['过滤对象', '一行行的原始数据', '一组组的统计结果'],
        ['配合谁', '通常配 SELECT，与 GROUP BY 无关也可用', '几乎总是配 GROUP BY 一起用'],
      ]}
    />
    <Paragraph>类比：开运动会，要算“各班平均身高超过 1.7 米的班级”。</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>WHERE</InlineCode>：在分班统计<Text bold>之前</Text>
        ，先把“请假没来的同学”剔除（针对单个人/单行的过滤）。
      </ListItem>
      <ListItem>
        <InlineCode>HAVING</InlineCode>：分班算完平均身高<Text bold>之后</Text>
        ，再筛掉“平均身高 ≤ 1.7 米”的班级（针对整组的统计结果过滤）。
      </ListItem>
    </UnorderedList>

    <Heading3>5.2 SQL 的逻辑执行顺序（理解 WHERE/HAVING 先后的关键）</Heading3>
    <Paragraph>
      虽然我们<Text bold>书写</Text>顺序是{' '}
      <InlineCode>
        SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT
      </InlineCode>
      ，但数据库<Text bold>实际执行</Text>的顺序是：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`1. FROM      —— 先确定从哪张表取数据
2. WHERE     —— 对原始行逐行过滤（不能用聚合函数）
3. GROUP BY  —— 把过滤后剩下的行分组
4. (聚合)    —— 对每个组计算 COUNT/SUM/AVG...
5. HAVING    —— 对“分组+聚合”后的结果再过滤（可以用聚合函数）
6. SELECT    —— 挑选要显示的列、计算别名
7. ORDER BY  —— 排序
8. LIMIT     —— 取其中一段（分页）`}
    />
    <Paragraph>记住这个顺序，很多“坑”就迎刃而解了：</Paragraph>
    <UnorderedList>
      <ListItem>
        为什么 <InlineCode>WHERE</InlineCode> 不能用聚合函数？因为{' '}
        <InlineCode>WHERE</InlineCode>（第 2 步）执行时，分组和聚合（第 3、4
        步）<Text bold>还没发生</Text>，<InlineCode>AVG(salary)</InlineCode>{' '}
        此刻根本不存在。
      </ListItem>
      <ListItem>
        为什么 <InlineCode>HAVING</InlineCode> 能用聚合函数？因为它在第 5
        步，聚合值已经算好了。
      </ListItem>
      <ListItem>
        为什么 <InlineCode>WHERE</InlineCode> 不能用 <InlineCode>SELECT</InlineCode>{' '}
        里起的别名，而 <InlineCode>ORDER BY</InlineCode> 可以？因为{' '}
        <InlineCode>SELECT</InlineCode>（第 6 步）在 <InlineCode>WHERE</InlineCode>
        （第 2 步）之后、在 <InlineCode>ORDER BY</InlineCode>（第 7 步）之前。
      </ListItem>
    </UnorderedList>

    <Heading3>5.3 对比示例</Heading3>
    <Paragraph>
      <Text bold>用 WHERE（分组前过滤）</Text>：先剔除工资 ≤ 7000
      的人，再按部门分组算平均。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT dept_id, AVG(salary) AS 平均工资
FROM emp
WHERE salary > 7000      -- 赵六(6000)在这一步就被剔除了
GROUP BY dept_id;`}
    />
    <Paragraph>赵六被剔除后，市场部只剩王五(9500)：</Paragraph>
    <Table
      head={['dept_id', '平均工资', '']}
      rows={[
        ['1', '10000', '研发部：张三、李四'],
        ['2', '9500', '市场部：只剩王五（赵六被 WHERE 滤掉）'],
        ['3', '15000', '财务部：孙七'],
      ]}
    />
    <Paragraph>
      <Text bold>用 HAVING（分组后过滤）</Text>
      ：所有人都参与分组算平均，最后只保留“平均工资 &gt; 8000”的部门。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT dept_id, AVG(salary) AS 平均工资
FROM emp
GROUP BY dept_id
HAVING AVG(salary) > 8000;   -- 对每组算出的平均工资再过滤`}
    />
    <Paragraph>
      三个部门的平均是 10000、7750、15000，只有 7750 的市场部被筛掉：
    </Paragraph>
    <Table
      head={['dept_id', '平均工资']}
      rows={[
        ['1', '10000'],
        ['3', '15000'],
      ]}
    />
    <Callout type="danger">
      常见坑：<Text bold>别拿 <InlineCode>HAVING</InlineCode> 干{' '}
      <InlineCode>WHERE</InlineCode> 的活</Text>。如果你的过滤条件
      <Text bold>不涉及聚合</Text>（比如 <InlineCode>salary &gt; 7000</InlineCode>、
      <InlineCode>dept_id = 1</InlineCode>），就应该放在{' '}
      <InlineCode>WHERE</InlineCode> 里，而不是 <InlineCode>HAVING</InlineCode>
      。原因：<InlineCode>WHERE</InlineCode> 在分组前就把数据量缩小了，效率更高；
      <InlineCode>HAVING</InlineCode> 是先把所有行都分组聚合完再扔，浪费。能用{' '}
      <InlineCode>WHERE</InlineCode> 就别用 <InlineCode>HAVING</InlineCode>。
    </Callout>
    <Callout type="danger">
      常见坑：<InlineCode>WHERE</InlineCode> 里写聚合函数必报错。例如{' '}
      <InlineCode>WHERE AVG(salary) &gt; 8000</InlineCode> 会直接报{' '}
      <InlineCode>Invalid use of group function</InlineCode>。涉及聚合的过滤一律用{' '}
      <InlineCode>HAVING</InlineCode>。
    </Callout>
    <Callout type="tip">
      <InlineCode>HAVING</InlineCode> 里可以用 <InlineCode>SELECT</InlineCode>{' '}
      中的聚合别名（MySQL 支持），下面综合示例会用到，比如{' '}
      <InlineCode>HAVING 平均工资 &gt; 8000</InlineCode>
      。但为了可读性和跨数据库兼容，很多人仍习惯写完整的{' '}
      <InlineCode>HAVING AVG(salary) &gt; 8000</InlineCode>。两种都对。
    </Callout>

    <Divider />

    <Subtitle>6. 综合示例：把前面全部串起来</Subtitle>
    <Paragraph>
      现在做这道“面试级”的题，它一次性用到{' '}
      <InlineCode>WHERE + GROUP BY + 聚合 + HAVING</InlineCode>：
    </Paragraph>
    <Callout type="note">
      <Text bold>需求</Text>：统计<Text bold>每个部门</Text>里
      <Text bold>工资大于 7000 的人</Text>的<Text bold>人数与平均工资</Text>
      ，并且<Text bold>只显示这部分人的平均工资 &gt; 8000 的部门</Text>。
    </Callout>
    <Paragraph>拆解需求 → 映射到子句：</Paragraph>
    <OrderedList>
      <ListItem>
        “工资大于 7000 的人” → 这是对<Text bold>单个人（行）</Text>的过滤，且
        <Text bold>不涉及聚合</Text> → 放 <InlineCode>WHERE salary &gt; 7000</InlineCode>。
      </ListItem>
      <ListItem>
        “每个部门” → 按部门分组 → <InlineCode>GROUP BY dept_id</InlineCode>。
      </ListItem>
      <ListItem>
        “人数与平均工资” → 聚合 → <InlineCode>COUNT(*)</InlineCode>、
        <InlineCode>AVG(salary)</InlineCode>。
      </ListItem>
      <ListItem>
        “只显示平均工资 &gt; 8000 的部门” → 这是对<Text bold>分组后的统计结果</Text>
        过滤，<Text bold>涉及聚合</Text> → 放{' '}
        <InlineCode>HAVING AVG(salary) &gt; 8000</InlineCode>。
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="sql"
      code={`SELECT dept_id,
       COUNT(*)    AS 人数,
       AVG(salary) AS 平均工资
FROM emp
WHERE salary > 7000              -- ① 分组前：把工资<=7000的赵六剔除
GROUP BY dept_id                 -- ② 按部门分组
HAVING AVG(salary) > 8000;       -- ③ 分组后：只留平均工资>8000的部门`}
    />
    <Paragraph>我们一步步“手算”验证（按执行顺序）：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>WHERE 过滤后</Text>剩下的人：张三(8000,部1)、李四(12000,部1)、王五(9500,部2)、孙七(15000,部3)。赵六(6000)
        被剔除。
      </ListItem>
      <ListItem>
        <Text bold>GROUP BY 分组并聚合</Text>：
        <UnorderedList>
          <ListItem>
            部门 1：张三、李四 → 人数 2，平均 (8000+12000)/2 = 10000
          </ListItem>
          <ListItem>部门 2：只剩王五 → 人数 1，平均 9500</ListItem>
          <ListItem>部门 3：孙七 → 人数 1，平均 15000</ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>HAVING 过滤</Text>（平均 &gt; 8000）：部门 1（10000 ✓）、部门
        2（9500 ✓）、部门 3（15000 ✓）都满足，全部保留。
      </ListItem>
    </UnorderedList>
    <Paragraph>最终结果：</Paragraph>
    <Table
      head={['dept_id', '人数', '平均工资']}
      rows={[
        ['1', '2', '10000'],
        ['2', '1', '9500'],
        ['3', '1', '15000'],
      ]}
    />
    <Callout type="tip">
      注意部门 2 的人数是 <Text bold>1</Text> 不是 2——因为赵六在{' '}
      <InlineCode>WHERE</InlineCode> 阶段就被筛掉了，没进入分组。这正是“
      <InlineCode>WHERE</InlineCode> 影响参与统计的样本”的直接体现。如果把过滤改成放{' '}
      <InlineCode>HAVING</InlineCode>，赵六会先参与平均（拉低市场部平均到
      7750），结果就完全不同了。
    </Callout>
    <Paragraph>
      如果再想把结果按平均工资从高到低排，并显示部门名（需要连表，下一章详解），可以这样初步加上排序：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT dept_id, COUNT(*) AS 人数, AVG(salary) AS 平均工资
FROM emp
WHERE salary > 7000
GROUP BY dept_id
HAVING AVG(salary) > 8000
ORDER BY 平均工资 DESC;          -- 用 SELECT 里的别名排序`}
    />
    <Table
      head={['dept_id', '人数', '平均工资']}
      rows={[
        ['3', '1', '15000'],
        ['1', '2', '10000'],
        ['2', '1', '9500'],
      ]}
    />

    <Divider />

    <Subtitle>7. 分页查询 LIMIT</Subtitle>

    <Heading3>7.1 为什么需要分页</Heading3>
    <Paragraph>
      一张订单表可能有几百万行，前端列表一次只显示 10 条，下面是“上一页 /
      下一页”。我们绝不能把几百万行一次性查出来再让程序截取——那会撑爆内存、拖垮网络。正确做法是
      <Text bold>让数据库只返回这一页需要的 N 条</Text>，这就是分页。
    </Paragraph>

    <Heading3>7.2 语法格式</Heading3>
    <Paragraph>
      MySQL 用 <InlineCode>LIMIT</InlineCode> 实现分页，有两种写法：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`-- 写法一：只限制条数（取前 N 条）
SELECT ... FROM ... LIMIT 条数;

-- 写法二：指定起始位置 + 条数（真正的分页）
SELECT ... FROM ... LIMIT 起始索引, 每页条数;`}
    />
    <Paragraph>
      逐项解释（<Text bold>这是最关键的两点</Text>）：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>起始索引从 0 开始</Text>：第 1 条数据的索引是{' '}
        <InlineCode>0</InlineCode>，第 2 条是 <InlineCode>1</InlineCode>……（和数组下标一样，从
        0 数）。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>LIMIT a, b</InlineCode> 的含义
        </Text>
        ：<Text bold>跳过前 <InlineCode>a</InlineCode> 条，从第{' '}
        <InlineCode>a</InlineCode> 条（含）开始取 <InlineCode>b</InlineCode> 条</Text>。
      </ListItem>
    </UnorderedList>

    <Heading3>7.3 基础示例</Heading3>
    <Paragraph>
      先按 <InlineCode>id</InlineCode> 排好序（分页几乎必须配{' '}
      <InlineCode>ORDER BY</InlineCode>，否则“哪页是哪几条”不确定，原因见 7.5）。
    </Paragraph>
    <Paragraph>
      <Text bold>取前 2 条：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, salary FROM emp ORDER BY id LIMIT 2;
-- 等价于 LIMIT 0, 2`}
    />
    <Table
      head={['id', 'ename', 'salary']}
      rows={[
        ['1', '张三', '8000'],
        ['2', '李四', '12000'],
      ]}
    />
    <Paragraph>
      <Text bold>跳过前 2 条，取接下来的 2 条（即第 3、4 条）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, salary FROM emp ORDER BY id LIMIT 2, 2;
--                                            ↑起始索引2(跳过id=1,2) ↑取2条`}
    />
    <Table
      head={['id', 'ename', 'salary']}
      rows={[
        ['3', '王五', '9500'],
        ['4', '赵六', '6000'],
      ]}
    />

    <Heading3>7.4 分页公式（务必背下来）</Heading3>
    <CodeBlock
      language="text"
      code={`起始索引 = (页码 - 1) × 每页条数
SQL:  LIMIT (页码 - 1) * 每页条数, 每页条数`}
    />
    <Paragraph>以“每页 2 条”为例，套公式：</Paragraph>
    <Table
      head={['页码', '起始索引 = (页码-1)×2', 'SQL', '取到的 id']}
      rows={[
        ['第 1 页', '(1-1)×2 = 0', 'LIMIT 0, 2', '1, 2'],
        ['第 2 页', '(2-1)×2 = 2', 'LIMIT 2, 2', '3, 4'],
        ['第 3 页', '(3-1)×2 = 4', 'LIMIT 4, 2', '5'],
      ]}
    />
    <Paragraph>验证第 2 页：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename FROM emp ORDER BY id LIMIT 2, 2;`}
    />
    <Table
      head={['id', 'ename']}
      rows={[
        ['3', '王五'],
        ['4', '赵六'],
      ]}
    />
    <Paragraph>
      第 3 页只剩 1 条（一共 5 条，最后一页凑不满 2 条），
      <InlineCode>LIMIT</InlineCode> 会<Text bold>返回它能取到的所有行，不会报错</Text>
      ：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename FROM emp ORDER BY id LIMIT 4, 2;`}
    />
    <Table head={['id', 'ename']} rows={[['5', '孙七']]} />
    <Callout type="tip">
      <Paragraph>
        实际开发里，分页 SQL 几乎都是程序拼出来的。比如 Java 中：
      </Paragraph>
      <CodeBlock
        language="java"
        code={`int pageNo = 2;       // 当前页码（用户点的）
int pageSize = 10;    // 每页条数
int offset = (pageNo - 1) * pageSize;   // 起始索引
String sql = "SELECT * FROM emp ORDER BY id LIMIT ?, ?";
// 给占位符依次绑定 offset 和 pageSize`}
      />
      <Paragraph>
        强烈建议用 <InlineCode>PreparedStatement</InlineCode> 的占位符{' '}
        <InlineCode>?</InlineCode> 绑定，而不是字符串拼接，既防 SQL 注入又更清晰。
      </Paragraph>
    </Callout>

    <Heading3>7.5 关于分页的注意事项与坑</Heading3>
    <Paragraph>
      <Text bold>
        (1) 🕳️ 分页一定要配 <InlineCode>ORDER BY</InlineCode>
      </Text>
      。<InlineCode>LIMIT</InlineCode> 是“取第几到第几行”，而“行的顺序”在没有{' '}
      <InlineCode>ORDER BY</InlineCode> 时是不确定的。后果是：你翻到第 2
      页，可能看到和第 1 页<Text bold>重复</Text>的数据，或者<Text bold>漏掉</Text>
      某些数据。务必加一个能<Text bold>唯一确定顺序</Text>的{' '}
      <InlineCode>ORDER BY</InlineCode>（通常用主键 <InlineCode>id</InlineCode>{' '}
      兜底）。
    </Paragraph>
    <Paragraph>
      <Text bold>(2) MySQL 方言说明</Text>：<InlineCode>LIMIT</InlineCode> 是{' '}
      <Text bold>MySQL（及 PostgreSQL、SQLite 等）的“方言”，不是 SQL 标准语法</Text>
      。换成别的数据库，分页写法完全不同：
    </Paragraph>
    <Table
      head={['数据库', '分页写法（取“第 2 页、每页 2 条”示意）']}
      rows={[
        ['MySQL / MariaDB', 'LIMIT 2, 2 或 LIMIT 2 OFFSET 2'],
        ['PostgreSQL', 'LIMIT 2 OFFSET 2'],
        ['Oracle 12c+', 'OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY'],
        ['Oracle 11g 及更早', '用 ROWNUM 嵌套子查询'],
        ['SQL Server 2012+', 'ORDER BY id OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY'],
      ]}
    />
    <Paragraph>
      所以“同一条分页 SQL 在 MySQL 能跑，搬到 Oracle
      就报错”是正常的——分页语法不通用，迁移数据库时要改。MyBatis
      的分页插件（如 PageHelper）就是帮你屏蔽这些方言差异的。
    </Paragraph>
    <Paragraph>
      补充：MySQL 里 <InlineCode>LIMIT 2, 2</InlineCode> 还有一种更易读的等价写法{' '}
      <InlineCode>LIMIT 2 OFFSET 2</InlineCode>（OFFSET 后面是起始索引、LIMIT
      后面是条数，注意这种写法两个数字的顺序和 <InlineCode>LIMIT a,b</InlineCode> 是
      <Text bold>反的</Text>），别记混。
    </Paragraph>
    <Paragraph>
      <Text bold>(3) 🕳️ 深分页（大偏移量）性能坑</Text>：像{' '}
      <InlineCode>LIMIT 1000000, 10</InlineCode>{' '}
      这种“翻到很后面的页”，MySQL 仍需<Text bold>先扫描并丢弃前 100 万行</Text>
      ，再返回 10 行，非常慢。生产环境常用“记住上一页最后一个 id”的方式优化：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 假设上一页最后一条 id 是 1000000，下一页这样取，避免大 OFFSET
SELECT * FROM emp WHERE id > 1000000 ORDER BY id LIMIT 10;`}
    />
    <Paragraph>
      初学了解即可，知道“大 OFFSET 慢、有 <InlineCode>WHERE id &gt;</InlineCode>{' '}
      的优化套路”就行。
    </Paragraph>
    <Paragraph>
      <Text bold>
        (4) <InlineCode>LIMIT</InlineCode> 总是放在整条语句的最后
      </Text>
      （<InlineCode>ORDER BY</InlineCode> 之后）。它在逻辑执行顺序里是第 8
      步、最后一步——先排好序，再切出那一页。
    </Paragraph>

    <Heading3>7.6 综合：分页 + 排序 + 聚合分组一起用</Heading3>
    <Paragraph>
      把本章所有知识点合在一条 SQL
      里（即“本章导读”开头的那条，现在你应该能完全读懂了）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT dept_id, COUNT(*) AS 人数, AVG(salary) AS 平均工资
FROM emp
WHERE salary > 7000          -- 分组前过滤
GROUP BY dept_id             -- 按部门分组
HAVING AVG(salary) > 8000    -- 分组后过滤
ORDER BY 平均工资 DESC       -- 按平均工资降序
LIMIT 0, 2;                  -- 只取前 2 个部门（第 1 页，每页 2 条）`}
    />
    <Paragraph>
      执行顺序回顾：
      <InlineCode>
        FROM → WHERE → GROUP BY → 聚合 → HAVING → SELECT → ORDER BY → LIMIT
      </InlineCode>
      。结果（在第 6 节排序结果基础上取前 2 行）：
    </Paragraph>
    <Table
      head={['dept_id', '人数', '平均工资']}
      rows={[
        ['3', '1', '15000'],
        ['1', '2', '10000'],
      ]}
    />

    <Divider />

    <Subtitle>本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>
          排序 <InlineCode>ORDER BY 列 [ASC|DESC]</InlineCode>
        </Text>
        ：<InlineCode>ASC</InlineCode> 升序（默认）、<InlineCode>DESC</InlineCode>{' '}
        降序；多字段排序“先按第一个、相同再按第二个”，常用{' '}
        <InlineCode>ORDER BY salary DESC, id ASC</InlineCode> 让顺序稳定。不写{' '}
        <InlineCode>ORDER BY</InlineCode> 顺序不可靠。MySQL 中{' '}
        <InlineCode>NULL</InlineCode> 在升序时排最前。
      </ListItem>
      <ListItem>
        <Text bold>
          聚合函数 <InlineCode>COUNT/SUM/AVG/MAX/MIN</InlineCode>
        </Text>
        ：把一列多个值压成一个值，整表只返回一行。可配{' '}
        <InlineCode>WHERE</InlineCode>{' '}
        先过滤再统计。聚合列不能和普通列裸混（除非是分组列）。
      </ListItem>
      <ListItem>
        <Text bold>聚合与 NULL</Text>：默认<Text bold>忽略 NULL</Text>。
        <InlineCode>COUNT(*)</InlineCode> 数行数（含 NULL 行），
        <InlineCode>COUNT(列)</InlineCode> 只数该列非 NULL 的格子。要把 NULL
        计入用 <InlineCode>COUNT(IFNULL(bonus,0))</InlineCode>；
        <InlineCode>AVG(bonus)</InlineCode> 分母只算有值的人，
        <InlineCode>AVG(IFNULL(bonus,0))</InlineCode>{' '}
        分母才是全员——选错会“算错钱”。
      </ListItem>
      <ListItem>
        <Text bold>
          分组 <InlineCode>GROUP BY</InlineCode>
        </Text>
        ：先分堆、再对每堆聚合，有几组返回几行。
        <Text bold>
          分组后 <InlineCode>SELECT</InlineCode> 只能出现分组列和聚合函数
        </Text>
        （<InlineCode>ONLY_FULL_GROUP_BY</InlineCode> 严格模式会拦截违规写法）。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>WHERE</InlineCode> vs <InlineCode>HAVING</InlineCode>
        </Text>
        ：<InlineCode>WHERE</InlineCode> 在分组<Text bold>前</Text>
        过滤、不能用聚合函数；<InlineCode>HAVING</InlineCode> 在分组
        <Text bold>后</Text>过滤、可用聚合函数。执行顺序{' '}
        <InlineCode>
          FROM→WHERE→GROUP BY→聚合→HAVING→SELECT→ORDER BY→LIMIT
        </InlineCode>
        。能用 <InlineCode>WHERE</InlineCode> 就别用{' '}
        <InlineCode>HAVING</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>
          分页 <InlineCode>LIMIT 起始索引, 每页条数</InlineCode>
        </Text>
        ：起始索引<Text bold>从 0 开始</Text>；公式{' '}
        <InlineCode>起始索引=(页码-1)×每页条数</InlineCode>。
        <InlineCode>LIMIT</InlineCode> 是 MySQL 方言（Oracle/SQL Server
        写法不同）。分页务必配 <InlineCode>ORDER BY</InlineCode>，并警惕大 OFFSET
        的深分页性能问题。
      </ListItem>
    </UnorderedList>

    <Subtitle>常见面试 / 易错问答</Subtitle>
    <OrderedList>
      <ListItem>
        <Text bold>
          <InlineCode>COUNT(*)</InlineCode>、<InlineCode>COUNT(1)</InlineCode>、
          <InlineCode>COUNT(列)</InlineCode> 有什么区别？
        </Text>
        <br />
        <InlineCode>COUNT(*)</InlineCode> 和 <InlineCode>COUNT(1)</InlineCode>{' '}
        都统计总行数（含 NULL 行），现代 InnoDB 下性能基本一致；
        <InlineCode>COUNT(列)</InlineCode> 只统计该列非 NULL 的值的个数，列里有
        NULL 时会比 <InlineCode>COUNT(*)</InlineCode> 少。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>WHERE</InlineCode> 和 <InlineCode>HAVING</InlineCode>{' '}
          能互换吗？为什么 <InlineCode>WHERE</InlineCode> 不能写聚合函数？
        </Text>
        <br />
        不能随意互换。按执行顺序，<InlineCode>WHERE</InlineCode>
        （分组前）执行时聚合还没算出来，所以不能用聚合函数；
        <InlineCode>HAVING</InlineCode>（分组后）才能用。不涉及聚合的过滤应放{' '}
        <InlineCode>WHERE</InlineCode>（更早过滤、更高效）。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>AVG(bonus)</InlineCode> 结果偏高，为什么？怎么修正？
        </Text>
        <br />
        因为 <InlineCode>AVG</InlineCode> 忽略
        NULL，分母只算有奖金的人。若业务上“没奖金 = 0”，应改用{' '}
        <InlineCode>AVG(IFNULL(bonus,0))</InlineCode>，让分母变成全员。
      </ListItem>
      <ListItem>
        <Text bold>
          用了 <InlineCode>GROUP BY dept_id</InlineCode> 后，为什么{' '}
          <InlineCode>SELECT ename</InlineCode> 报错？
        </Text>
        <br />
        分组后一行代表一个组，<InlineCode>ename</InlineCode>{' '}
        在一个组里有多个值，显示哪个没有意义。
        <InlineCode>ONLY_FULL_GROUP_BY</InlineCode> 模式会报错。
        <InlineCode>SELECT</InlineCode> 只能放分组列或聚合函数。
      </ListItem>
      <ListItem>
        <Text bold>
          查“工资最高的员工是谁”，能用{' '}
          <InlineCode>SELECT ename, MAX(salary) FROM emp</InlineCode> 吗？
        </Text>
        <br />
        不能（严格模式报错，非严格模式返回的 <InlineCode>ename</InlineCode>{' '}
        也不可信）。应使用子查询：
        <InlineCode>
          SELECT ename, salary FROM emp WHERE salary = (SELECT MAX(salary) FROM
          emp);
        </InlineCode>
      </ListItem>
      <ListItem>
        <Text bold>
          第 5 页、每页 20 条，<InlineCode>LIMIT</InlineCode> 怎么写？
        </Text>
        <br />
        起始索引 = (5-1)×20 = 80，写作 <InlineCode>LIMIT 80, 20</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>
          分页为什么必须加 <InlineCode>ORDER BY</InlineCode>？
        </Text>
        <br />
        不加 <InlineCode>ORDER BY</InlineCode>{' '}
        时行顺序不确定，翻页可能出现重复或遗漏。要用能唯一确定顺序的列（如主键{' '}
        <InlineCode>id</InlineCode>）排序。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>LIMIT 100000, 10</InlineCode> 为什么慢？
        </Text>
        <br />
        MySQL 要先扫描并丢弃前 10 万行才返回 10 行（深分页问题）。可用{' '}
        <InlineCode>WHERE id &gt; 上一页最后id ORDER BY id LIMIT 10</InlineCode>{' '}
        优化。
      </ListItem>
    </OrderedList>
  </article>
);

export default index;
