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
    <Title>模糊查询 LIKE 与本章小结</Title>

    <Subtitle>5. 模糊查询 LIKE</Subtitle>
    <Paragraph>
      前面的比较都是"精确匹配"（等于、大于……）。但很多时候我们只记得"姓张的""名字带五的"这种
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
        ['%', '匹配任意多个字符（含0个）', '像"万能牌"，能顶任意长度'],
        ['_', '匹配任意单个字符（恰好1个）', '像"占一个坑"，不多不少一个'],
      ]}
    />
    <Callout type="tip">
      提示：记忆法——<InlineCode>%</InlineCode> 是"百分比"、量大，代表"任意多个"；
      <InlineCode>_</InlineCode> 是"一条下划线、一个空位"，代表"恰好一个"。
    </Callout>

    <Heading3>5.1 % 通配符：匹配任意多个字符</Heading3>
    <Paragraph>
      <Text bold>示例 1：查询所有"张"姓员工（姓张，名字几个字都行）</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '张%';`} />
    <Paragraph>
      <InlineCode>'张%'</InlineCode> 表示"以'张'开头，后面跟任意多个字符"。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table head={['ename']} rows={[['张三']]} />
    <Paragraph>
      <Text bold>示例 2：查询名字里包含"五"的员工（不管在开头、中间还是结尾）</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '%五%';`} />
    <Paragraph>
      <InlineCode>'%五%'</InlineCode>{' '}
      表示"'五'前面任意字符、后面也任意字符"，即只要名字里有"五"就匹配。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table head={['ename']} rows={[['王五']]} />
    <Paragraph>
      <Text bold>示例 3：查询名字以"三"结尾的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '%三';`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table head={['ename']} rows={[['张三']]} />

    <Heading3>5.2 _ 通配符：匹配单个字符</Heading3>
    <Paragraph>
      <Text bold>示例：查询名字是"两个字、且第二个字是'四'"的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '_四';`} />
    <Paragraph>
      <InlineCode>'_四'</InlineCode>{' '}
      表示"<Text bold>第一个位置是任意一个字符</Text>，第二个位置必须是'四'"——也就是名字
      <Text bold>恰好两个字、以'四'结尾</Text>。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table head={['ename']} rows={[['李四']]} />
    <Callout type="danger">
      常见坑：<InlineCode>_</InlineCode> 严格匹配<Text bold>一个</Text>字符，多一个少一个都不行。
      <UnorderedList>
        <ListItem>
          <InlineCode>LIKE '_四'</InlineCode> 只能匹配"X四"这种两字名（如李四），匹配不到"张大四"这种三字名。
        </ListItem>
        <ListItem>
          如果想匹配"以四结尾、字数不限"，要用 <InlineCode>%</InlineCode>：
          <InlineCode>LIKE '%四'</InlineCode>。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5.3 % 和 _ 组合使用</Heading3>
    <Paragraph>两个通配符可以一起用，组合出更精确的模式。</Paragraph>
    <Paragraph>
      <Text bold>示例：查询"名字第一个字是'王'，且总共两个字"的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename FROM emp WHERE ename LIKE '王_';`} />
    <Paragraph>
      <InlineCode>'王_'</InlineCode> 表示"以'王'开头，后面再跟<Text bold>恰好一个</Text>字符"。
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
      <InlineCode>WHERE ename = '张三'</InlineCode> 一模一样，只能查到完全等于"张三"的。
    </Paragraph>
    <Paragraph>
      <Text bold>坑 2：想查"真正的 % 或 _ 符号"怎么办？用转义</Text>
    </Paragraph>
    <Paragraph>
      如果某列的数据里<Text bold>本身就含有 `%` 或 `_`</Text>{' '}
      这两个字符（比如折扣字段存了"50%"），直接 <InlineCode>LIKE '%50%%'</InlineCode> 会把{' '}
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
        真要做"包含"式全文检索，应考虑<Text bold>全文索引（FULLTEXT）</Text>
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
        需求：查询"研发部或市场部"里、"工资在
        8000~13000 之间"、"有奖金"的男员工，显示姓名、工资、奖金，以及工资奖金合计（奖金为空算
        0），并把合计列叫"月收入"。
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
            <InlineCode>NULL</InlineCode> 表示"未知"，
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
      。根本原因是 <InlineCode>NULL</InlineCode> 表示"未知值"，参与比较运算结果是"未知"，而{' '}
      <InlineCode>WHERE</InlineCode> 只保留结果为真的行。
    </Paragraph>
    <Paragraph>
      <Text bold>Q2：`!=` 和 `&lt;&gt;` 有区别吗？</Text>
    </Paragraph>
    <Paragraph>
      没有区别，都是"不等于"。<InlineCode>&lt;&gt;</InlineCode> 是标准 SQL 写法，
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
      。若本意是"(1部门 或 2部门) 且 工资&gt;9000"，必须加括号：
      <InlineCode>(dept_id = 1 OR dept_id = 2) AND salary &gt; 9000</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：`LIKE '_四'` 和 `LIKE '%四'` 有什么区别？</Text>
    </Paragraph>
    <Paragraph>
      <InlineCode>_四</InlineCode> 匹配"恰好两个字、以四结尾"（如李四），<InlineCode>_</InlineCode>{' '}
      严格代表一个字符；<InlineCode>%四</InlineCode> 匹配"以四结尾、长度不限"（如李四、张大四都行），
      <InlineCode>%</InlineCode> 代表任意多个字符。
    </Paragraph>
    <Paragraph>
      <Text bold>Q8：为什么尽量别用 `LIKE '%xxx%'`？</Text>
    </Paragraph>
    <Paragraph>
      以 <InlineCode>%</InlineCode>{' '}
      开头会导致索引失效、全表扫描，大数据量下性能很差。能用 <InlineCode>'前缀%'</InlineCode>
      就用前缀匹配；需要"包含"式搜索时考虑全文索引或专业搜索引擎。
    </Paragraph>
  </article>
);

export default index;
