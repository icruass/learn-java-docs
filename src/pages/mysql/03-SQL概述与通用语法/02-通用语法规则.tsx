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
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>通用语法规则</Title>
    <Paragraph>
      这一节是"交通规则"。规则不多，但每一条都会贯穿你今后写的每一句 SQL。
    </Paragraph>

    <Heading3>3.1 可以单行写，也可以多行写</Heading3>
    <Paragraph>
      一条 SQL 语句，写成一行可以，写成多行也完全没问题。
      <Text bold>数据库不看你换不换行，它看的是"分号在哪结束"。</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 写成一行：完全合法
SELECT id, ename, salary FROM emp WHERE dept_id = 1;`}
    />
    <CodeBlock
      language="sql"
      code={`-- 写成多行：同样合法，而且更清晰（推荐复杂语句这样写）
SELECT id,
       ename,
       salary
FROM   emp
WHERE  dept_id = 1;`}
    />
    <Paragraph>
      上面两条语句<Text bold>含义完全相同，执行结果也完全相同</Text>：
    </Paragraph>
    <Table
      head={['id', 'ename', 'salary']}
      rows={[
        ['1', '张三', '8000'],
        ['2', '李四', '12000'],
      ]}
    />
    <Callout type="tip" title="提示：复杂语句强烈建议多行 + 缩进。">
      简单的 <InlineCode>SELECT * FROM emp;</InlineCode> 一行就够；但当语句长到带{' '}
      <InlineCode>WHERE</InlineCode>、<InlineCode>GROUP BY</InlineCode>、
      <InlineCode>ORDER BY</InlineCode>
      、多表连接时，把每个子句单独成行、对齐缩进，可读性会天差地别。代码是给人看的，机器不挑，但你的同事（和半年后的你自己）会感谢你。
    </Callout>

    <Heading3>
      3.2 每条语句以分号 <InlineCode>;</InlineCode> 结束
    </Heading3>
    <Paragraph>
      分号 <InlineCode>;</InlineCode> 是一条 SQL 语句的<Text bold>"句号"</Text>
      ，告诉数据库："这句话说完了，可以执行了。"
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT * FROM dept;     -- 第一条语句，到分号结束
SELECT * FROM emp;      -- 第二条语句，又到分号结束`}
    />
    <Paragraph>
      为什么需要分号？因为你可能一次性发多条语句过去，数据库得知道
      <Text bold>"从哪到哪算一句"</Text>。分号就是那个分界点。
    </Paragraph>
    <Callout type="danger" title={"常见坑：忘写分号导致\"假死\"。"}>
      <Paragraph>
        在命令行客户端（如 <InlineCode>mysql&gt;</InlineCode>{' '}
        提示符下）敲了语句却忘了分号回车，你会看到提示符变成{' '}
        <InlineCode>-&gt;</InlineCode>
        ，光标停在那里好像卡住了——其实它在等你把这句"说完"（等分号）。这时只要补一个{' '}
        <InlineCode>;</InlineCode> 再回车即可：
      </Paragraph>
      <CodeBlock
        language="bash"
        code={`mysql> SELECT * FROM emp
    -> ;          # 这里补上分号，语句才真正执行`}
      />
      <Paragraph>
        <Text bold>提示：</Text>在图形客户端（Navicat、DataGrip、DBeaver、SQLyog
        等）里，如果一次只执行一条语句，<Text bold>省略结尾分号通常也能跑</Text>
        ；但只要你一次执行多条，分号就是<Text bold>强制</Text>
        的。所以养成"每句都加分号"的好习惯，绝不吃亏。
      </Paragraph>
    </Callout>

    <Heading3>3.3 不区分大小写，但关键字建议大写</Heading3>
    <Paragraph>
      <Text bold>SQL 关键字不区分大小写。</Text> 下面这三条语句，对 MySQL 来说
      <Text bold>完全一样</Text>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT * FROM emp;
select * from emp;
SeLeCt * FrOm EmP;`}
    />
    <Paragraph>它们的执行结果一模一样（返回 emp 表全部 5 行）。</Paragraph>
    <Paragraph>
      那为什么大家约定俗成<Text bold>关键字用大写</Text>？
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>一眼区分"命令"和"数据"</Text>：<InlineCode>SELECT</InlineCode>、
        <InlineCode>FROM</InlineCode>、<InlineCode>WHERE</InlineCode> 大写，表名{' '}
        <InlineCode>emp</InlineCode>、字段名 <InlineCode>salary</InlineCode>{' '}
        小写，读起来层次分明。
      </ListItem>
      <ListItem>
        <Text bold>行业惯例 / 显专业</Text>：几乎所有教材、文档、规范都这么写。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="sql"
      code={`-- 推荐风格：关键字大写，库名/表名/字段名小写
SELECT ename, salary
FROM   emp
WHERE  salary > 9000;`}
    />
    <Callout type="warning" title={"注意：一个重要的\"例外\"——数据 / 标识符不一定不区分大小写！"}>
      <Paragraph>
        "不区分大小写"指的是<Text bold>关键字</Text>（<InlineCode>SELECT</InlineCode>、
        <InlineCode>FROM</InlineCode> 这些）。但有两个东西要小心：
      </Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>存进去的数据值</Text>：默认排序规则下，
          <InlineCode>WHERE ename = '张三'</InlineCode>{' '}
          与值是否大小写敏感，取决于该列的<Text bold>字符集与排序规则（collation）</Text>
          。英文字母比如 <InlineCode>'abc'</InlineCode> 和{' '}
          <InlineCode>'ABC'</InlineCode>，在 MySQL 默认的{' '}
          <InlineCode>utf8mb4_general_ci</InlineCode>（ci = case insensitive，不区分大小写）下会被当作相等；如果用了{' '}
          <InlineCode>_cs</InlineCode>（case sensitive）或 <InlineCode>_bin</InlineCode>{' '}
          排序规则，则区分大小写。
        </ListItem>
        <ListItem>
          <Text bold>库名 / 表名</Text>：在 <Text bold>Linux</Text> 服务器上，MySQL
          的库名、表名<Text bold>默认区分大小写</Text>（因为底层是文件，Linux
          文件名区分大小写）；在 <Text bold>Windows</Text> 上默认不区分。所以{' '}
          <InlineCode>SELECT * FROM Emp;</InlineCode> 在 Windows 能跑，搬到 Linux
          可能就报"表不存在"。
        </ListItem>
      </OrderedList>
      <Paragraph>
        <Text bold>常见坑：</Text> 本地 Windows 开发一切正常，部署到 Linux
        服务器后报 <InlineCode>Table 'db_learn.Emp' doesn't exist</InlineCode>
        ——十有八九就是表名大小写问题。
        <Text bold>统一规范：库名、表名、字段名一律小写</Text>，可一劳永逸避开此坑。
      </Paragraph>
    </Callout>

    <Heading3>3.4 空格与缩进：随便加，但要加得"有意义"</Heading3>
    <Paragraph>
      SQL 中，标识符 / 关键字之间的
      <Text bold>空格、换行、Tab 缩进，数据库一律当作"一个分隔符"处理</Text>
      ，多加几个、少加几个（只要至少有一个）都不影响结果。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 下面两条等价（一个空格 vs 一堆空格 + 换行）
SELECT ename FROM emp;

SELECT      ename
FROM        emp;`}
    />
    <Paragraph>
      所以空格的作用<Text bold>不是给机器看的，是给人看的</Text>
      ——用它来对齐、缩进、分组，让语句更易读。
    </Paragraph>
    <Callout type="warning" title={"注意：有些地方\"不能乱加空格\"。"}>
      <UnorderedList>
        <ListItem>
          函数名和它的括号之间，标准上可以有空格（如 <InlineCode>COUNT (*)</InlineCode>
          ），但<Text bold>强烈建议不要加</Text>，写成 <InlineCode>COUNT(*)</InlineCode>
          ，更清晰也更兼容。
        </ListItem>
        <ListItem>
          字符串<Text bold>引号内部</Text>的空格是<Text bold>数据本身</Text>
          ，加了就改变了数据！<InlineCode>'张三'</InlineCode> 和{' '}
          <InlineCode>'张三 '</InlineCode>（后面多个空格）是
          <Text bold>两个不同的值</Text>。
        </ListItem>
      </UnorderedList>
      <CodeBlock
        language="sql"
        code={`-- 这两个查的不是一回事！
SELECT * FROM emp WHERE ename = '张三';     -- 能查到张三
SELECT * FROM emp WHERE ename = '张三 ';    -- 末尾多空格，查不到`}
      />
    </Callout>

    <Divider />
  </article>
);

export default index;
