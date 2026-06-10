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
    <Title>分组查询 GROUP BY 与 HAVING</Title>

    <Subtitle>4. 分组查询 GROUP BY</Subtitle>

    <Heading3>4.1 从"整体统计"到"分组统计"</Heading3>
    <Paragraph>
      第 2 节的聚合是把<Text bold>整张表当成一个组</Text>算出一个总数。但现实需求往往是"
      <Text bold>分门别类</Text>地统计"：每个部门各自的平均工资、每种性别各自的人数……这就需要先
      <Text bold>分组</Text>，再对<Text bold>每个组</Text>分别做聚合。
    </Paragraph>
    <Paragraph>
      类比：班里 30 个学生，老师说"按男女分成两组，各组报一下平均分"。
      <InlineCode>GROUP BY gender</InlineCode> 就是"按性别分组"，
      <InlineCode>AVG(score)</InlineCode>{' '}
      就是"各组报平均分"。最终结果有几行，取决于分成了几组。
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

    <Heading3>4.4 核心规则：分组后 SELECT 只能出现"分组列 + 聚合函数"</Heading3>
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
      为什么？因为分组后<Text bold>一行代表"一整个组"</Text>
      。比如研发部这一组有张三、李四两个人，你写{' '}
      <InlineCode>SELECT ename</InlineCode>
      ，数据库不知道该显示"张三"还是"李四"——这是没有意义的。
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
      默认开启的"严格模式"，专门拦截上面这种有歧义的写法。老教程/老项目里可能见过"
      <InlineCode>SELECT *</InlineCode> 配 <InlineCode>GROUP BY</InlineCode>
      也能跑"的代码，那是关掉了该模式、靠 MySQL"随便挑一行"的危险特性，
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
    <Paragraph>类比：开运动会，要算"各班平均身高超过 1.7 米的班级"。</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>WHERE</InlineCode>：在分班统计<Text bold>之前</Text>
        ，先把"请假没来的同学"剔除（针对单个人/单行的过滤）。
      </ListItem>
      <ListItem>
        <InlineCode>HAVING</InlineCode>：分班算完平均身高<Text bold>之后</Text>
        ，再筛掉"平均身高 ≤ 1.7 米"的班级（针对整组的统计结果过滤）。
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
5. HAVING    —— 对"分组+聚合"后的结果再过滤（可以用聚合函数）
6. SELECT    —— 挑选要显示的列、计算别名
7. ORDER BY  —— 排序
8. LIMIT     —— 取其中一段（分页）`}
    />
    <Paragraph>记住这个顺序，很多"坑"就迎刃而解了：</Paragraph>
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
      ：所有人都参与分组算平均，最后只保留"平均工资 &gt; 8000"的部门。
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
      现在做这道"面试级"的题，它一次性用到{' '}
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
        "工资大于 7000 的人" → 这是对<Text bold>单个人（行）</Text>的过滤，且
        <Text bold>不涉及聚合</Text> → 放 <InlineCode>WHERE salary &gt; 7000</InlineCode>。
      </ListItem>
      <ListItem>
        "每个部门" → 按部门分组 → <InlineCode>GROUP BY dept_id</InlineCode>。
      </ListItem>
      <ListItem>
        "人数与平均工资" → 聚合 → <InlineCode>COUNT(*)</InlineCode>、
        <InlineCode>AVG(salary)</InlineCode>。
      </ListItem>
      <ListItem>
        "只显示平均工资 &gt; 8000 的部门" → 这是对<Text bold>分组后的统计结果</Text>
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
    <Paragraph>我们一步步"手算"验证（按执行顺序）：</Paragraph>
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
      <InlineCode>WHERE</InlineCode> 阶段就被筛掉了，没进入分组。这正是"
      <InlineCode>WHERE</InlineCode> 影响参与统计的样本"的直接体现。如果把过滤改成放{' '}
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
  </article>
);

export default index;
