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
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>聚合函数与 NULL 处理</Title>

    <Subtitle>2. 聚合函数（统计函数）</Subtitle>

    <Heading3>2.1 什么是聚合函数</Heading3>
    <Paragraph>
      前面所有查询都是"<Text bold>纵向</Text>地一行一行处理"。而聚合函数是"
      <Text bold>把一整列的多个值压缩成一个值</Text>"——比如把 5
      个人的工资加成一个总和、算出一个平均值。这叫"聚合（aggregate）"，也叫"纵向统计"。
    </Paragraph>
    <Paragraph>
      类比：聚合函数就像 Excel
      里选中一列数字，底部状态栏自动显示的"求和、平均值、计数"。
    </Paragraph>

    <Heading3>2.2 五个常用聚合函数</Heading3>
    <Table
      head={['函数', '作用', '说明']}
      rows={[
        ['COUNT()', '计数（统计行数）', '数"有多少个"'],
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

    <Heading3>2.4 🕳️ 常见坑：聚合函数不能直接和"普通列"一起裸查</Heading3>
    <Paragraph>
      很多新手会写出这种"看起来很合理"的语句，想查"最高工资是谁"：
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
      要查"最高工资是谁"，正确做法是用子查询（后续章节细讲），这里先给出正确结果对照：
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
      <InlineCode>AVG</InlineCode> 忽略 NULL 是"双刃剑"。如果你的业务认为"没奖金 =
      奖金 0"，那么 <InlineCode>AVG(bonus)=2000</InlineCode> 这个结果就是
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
        <InlineCode>COUNT(*)</InlineCode> 数"行"，<InlineCode>COUNT(列)</InlineCode>{' '}
        数"该列有值的格子"。
      </Text>{' '}
      当列里有 NULL 时，两者就会不一样。
    </Paragraph>
    <Callout type="tip">
      <Paragraph>
        日常统计"总共有多少条记录"，请直接用 <InlineCode>COUNT(*)</InlineCode>
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
      需求：我想统计"包含没奖金的人在内的全部 5 个人"，或者想让"没奖金 =
      0"参与平均、求和计算，怎么办？
    </Paragraph>
    <Paragraph>
      办法是用 <InlineCode>IFNULL(列, 默认值)</InlineCode>：当列为 NULL 时，把它
      <Text bold>替换成你指定的默认值</Text>，再交给聚合函数。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT
  COUNT(IFNULL(bonus, 0)) AS 全员计数,   -- NULL 被换成 0，于是"有值"，被计入
  SUM(IFNULL(bonus, 0))   AS 奖金总和,   -- 总和不变，因为加 0 不影响
  AVG(IFNULL(bonus, 0))   AS 真平均       -- 关键：分母变成 5 了
FROM emp;`}
    />
    <Paragraph>逐项解释：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>COUNT(IFNULL(bonus,0))</InlineCode>：把 2 个 NULL 变成 0 后，
        <InlineCode>bonus</InlineCode> 这一列就"全员有值"了，所以计数从 3 变成{' '}
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
          "在拿到奖金的人里，人均奖金多少" → 用 <InlineCode>AVG(bonus)</InlineCode>
          （忽略 NULL）。
        </ListItem>
        <ListItem>
          "把没奖金的也算进来，全公司人均奖金多少" → 用{' '}
          <InlineCode>AVG(IFNULL(bonus,0))</InlineCode>。
        </ListItem>
      </UnorderedList>
      <Paragraph>
        选错了，数字差近一倍，这是统计报表里最常见的"算错钱"事故。
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
  </article>
);

export default index;
