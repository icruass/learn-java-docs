import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>综合练习与本章小结</Title>

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
