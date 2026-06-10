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
    <Title>分页查询 LIMIT 与本章小结</Title>

    <Subtitle>7. 分页查询 LIMIT</Subtitle>

    <Heading3>7.1 为什么需要分页</Heading3>
    <Paragraph>
      一张订单表可能有几百万行，前端列表一次只显示 10 条，下面是"上一页 /
      下一页"。我们绝不能把几百万行一次性查出来再让程序截取——那会撑爆内存、拖垮网络。正确做法是
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
      <InlineCode>ORDER BY</InlineCode>，否则"哪页是哪几条"不确定，原因见 7.5）。
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
    <Paragraph>以"每页 2 条"为例，套公式：</Paragraph>
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
      。<InlineCode>LIMIT</InlineCode> 是"取第几到第几行"，而"行的顺序"在没有{' '}
      <InlineCode>ORDER BY</InlineCode> 时是不确定的。后果是：你翻到第 2
      页，可能看到和第 1 页<Text bold>重复</Text>的数据，或者<Text bold>漏掉</Text>
      某些数据。务必加一个能<Text bold>唯一确定顺序</Text>的{' '}
      <InlineCode>ORDER BY</InlineCode>（通常用主键 <InlineCode>id</InlineCode>{' '}
      兜底）。
    </Paragraph>
    <Paragraph>
      <Text bold>(2) MySQL 方言说明</Text>：<InlineCode>LIMIT</InlineCode> 是{' '}
      <Text bold>MySQL（及 PostgreSQL、SQLite 等）的"方言"，不是 SQL 标准语法</Text>
      。换成别的数据库，分页写法完全不同：
    </Paragraph>
    <Table
      head={['数据库', '分页写法（取"第 2 页、每页 2 条"示意）']}
      rows={[
        ['MySQL / MariaDB', 'LIMIT 2, 2 或 LIMIT 2 OFFSET 2'],
        ['PostgreSQL', 'LIMIT 2 OFFSET 2'],
        ['Oracle 12c+', 'OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY'],
        ['Oracle 11g 及更早', '用 ROWNUM 嵌套子查询'],
        ['SQL Server 2012+', 'ORDER BY id OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY'],
      ]}
    />
    <Paragraph>
      所以"同一条分页 SQL 在 MySQL 能跑，搬到 Oracle
      就报错"是正常的——分页语法不通用，迁移数据库时要改。MyBatis
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
      这种"翻到很后面的页"，MySQL 仍需<Text bold>先扫描并丢弃前 100 万行</Text>
      ，再返回 10 行，非常慢。生产环境常用"记住上一页最后一个 id"的方式优化：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 假设上一页最后一条 id 是 1000000，下一页这样取，避免大 OFFSET
SELECT * FROM emp WHERE id > 1000000 ORDER BY id LIMIT 10;`}
    />
    <Paragraph>
      初学了解即可，知道"大 OFFSET 慢、有 <InlineCode>WHERE id &gt;</InlineCode>{' '}
      的优化套路"就行。
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
      里（即"本章导读"开头的那条，现在你应该能完全读懂了）：
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
        降序；多字段排序"先按第一个、相同再按第二个"，常用{' '}
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
        分母才是全员——选错会"算错钱"。
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
        NULL，分母只算有奖金的人。若业务上"没奖金 = 0"，应改用{' '}
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
          查"工资最高的员工是谁"，能用{' '}
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
