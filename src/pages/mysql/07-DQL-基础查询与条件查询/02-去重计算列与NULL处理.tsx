import React from 'react';
import {
  Title,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>去重、计算列与 NULL 处理</Title>

    <Heading3>3.1 去重 DISTINCT</Heading3>
    <Paragraph>
      有时一列里有很多重复值，我们只想看"有哪些不同的值"，这时用{' '}
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
      <Text bold>示例 2：DISTINCT 作用于多列时，是"整行组合"去重</Text>
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
      是"只对 gender 去重"，其实是<Text bold>对 gender 和 dept_id 的组合</Text>
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
      <Text bold>示例 1：计算每位员工的"年薪"（月薪 × 12）</Text>
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
      注意：这种计算<Text bold>只影响查询结果的"显示"，不会真的修改表里的数据</Text>。
      <InlineCode>emp</InlineCode> 表里 <InlineCode>salary</InlineCode>{' '}
      仍然是原值。要真正改数据得用 <InlineCode>UPDATE</InlineCode>（DML），那是另一回事。
    </Callout>

    <Heading3>3.3 NULL 的处理：IFNULL</Heading3>
    <Paragraph>
      现在我们来对付那个埋好的"坑"——<InlineCode>bonus</InlineCode> 列里的{' '}
      <InlineCode>NULL</InlineCode>。
    </Paragraph>
    <Paragraph>
      先理解 <InlineCode>NULL</InlineCode> 是什么：
      <Text bold>
        `NULL` 表示"未知 / 没有值 / 空"，它不是数字 0，也不是空字符串 `''`
      </Text>
      ，而是"什么都没有"。
    </Paragraph>
    <Paragraph>
      这会带来一个很坑的问题：
      <Text bold>任何数值和 `NULL` 做运算，结果都是 `NULL`！</Text>
    </Paragraph>
    <Paragraph>
      <Text bold>反面示例：直接计算"工资 + 奖金"</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary, bonus, salary + bonus AS 月收入 FROM emp;`} />
    <Paragraph>
      <Text bold>执行结果（注意李四、赵六的"月收入"变成了 NULL）：</Text>
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
        如果"列名"的值<Text bold>不是 NULL</Text>，就返回它本身；
      </ListItem>
      <ListItem>
        如果"列名"的值<Text bold>是 NULL</Text>，就返回"默认值"。
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
  </article>
);

export default index;
