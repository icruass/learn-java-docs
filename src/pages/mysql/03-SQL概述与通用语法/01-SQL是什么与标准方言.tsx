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
    <Title>SQL 是什么与标准方言</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        前两章我们安装好了 MySQL、连上了数据库、也认识了"数据库 / 表 / 行 /
        列"这些基本概念。但到目前为止，我们还只是"看客"——真正要让数据库干活，靠的是一门语言：
        <Text bold>SQL</Text>。
      </Paragraph>
      <Paragraph>
        这一章就是整套教程的"语言总纲"。它本身
        <Text bold>几乎不教你具体怎么建表、怎么查数据</Text>
        （那是后面几章的事），而是先回答三个根本问题：
      </Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>SQL 是什么？</Text> 它为什么能成为操作几乎所有关系型数据库的"普通话"？
        </ListItem>
        <ListItem>
          <Text bold>怎么写 SQL 才算合法？</Text>{' '}
          大小写、分号、空格、注释……这些"书写规矩"不弄清楚，后面写任何语句都会踩坑。
        </ListItem>
        <ListItem>
          <Text bold>SQL 一共能干哪些事？</Text>{' '}
          这就是著名的"四大分类"：DDL、DML、DQL、DCL。把它们分清楚，你脑子里就有了一张地图——后面每学一条语句，你都知道它属于哪一类、操作的是"结构"还是"数据"还是"权限"。
        </ListItem>
      </OrderedList>
      <Paragraph>
        可以把本章理解为：<Text bold>先发一张地图和一本"交通规则手册"，再上路开车。</Text>{' '}
        地图就是四大分类，交通规则就是通用语法。读完本章，你不一定会写多复杂的
        SQL，但你一定能看懂任何一条 SQL"是哪一类、大概在干嘛、写得合不合规矩"。
      </Paragraph>
      <Paragraph>
        本章会用到的示例库就是全套教程统一的 <InlineCode>db_learn</InlineCode>（部门表{' '}
        <InlineCode>dept</InlineCode>、员工表{' '}
        <InlineCode>emp</InlineCode>），后续章节会反复出现，请务必先建好它们（建表语句在最后"附录"中给出，本章正文只做演示引用）。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、SQL 是什么</Subtitle>

    <Heading3>1.1 一句话定义</Heading3>
    <Paragraph>
      <Text bold>SQL = Structured Query Language = 结构化查询语言。</Text>
    </Paragraph>
    <Paragraph>
      它是一门<Text bold>专门用来操作关系型数据库</Text>的语言。注意三个关键词：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Structured（结构化）</Text>
        ：关系型数据库里的数据是"一行一行、一列一列"规整存放的（像 Excel
        表格），这种规整结构就叫"结构化数据"。SQL 就是为操作这种结构化数据而生的。
      </ListItem>
      <ListItem>
        <Text bold>Query（查询）</Text>：虽然名字里只有"查询"，但其实 SQL
        远不止查询，它还能建库建表、增删改数据、管理权限。名字是历史遗留，别被它骗了。
      </ListItem>
      <ListItem>
        <Text bold>Language（语言）</Text>
        ：它是一门"语言"，有自己的语法规则，你"说"给数据库听，数据库就照做。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="提示：怎么读？">
      SQL 有两种常见读法，都对：一种逐字母读 "S-Q-L"；另一种读作
      "sequel"（/ˈsiːkwəl/，谐音"C口"）。面试和日常交流随便用哪种都行。
    </Callout>

    <Heading3>1.2 一个最直观的类比</Heading3>
    <Paragraph>
      把数据库想象成一个<Text bold>巨大的、带管理员的仓库</Text>：
    </Paragraph>
    <Table
      head={['现实世界', '数据库世界']}
      rows={[
        ['仓库', '数据库服务器（MySQL）'],
        ['仓库里的一个个房间', '一个个数据库（database / schema）'],
        ['房间里的货架', '表（table）'],
        ['货架上的一格', '一行记录（row）'],
        ['你写给管理员的"取货 / 上货 / 改标签"的纸条', '一条 SQL 语句'],
      ]}
    />
    <Paragraph>
      你不能自己跑进仓库乱翻，你只能
      <Text bold>写纸条（SQL）交给管理员（数据库引擎）</Text>
      ，管理员看懂后帮你执行，再把结果递给你。SQL 就是你和数据库之间唯一的"沟通语言"。
    </Paragraph>

    <Heading3>1.3 为什么是"统一语言"——一次学会，到处能用</Heading3>
    <Paragraph>这是 SQL 最大的价值所在。市面上的关系型数据库很多：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>MySQL</Text>（本教程主角，开源、互联网公司最常用）
      </ListItem>
      <ListItem>
        <Text bold>Oracle</Text>（商业、银行 / 电信等大型企业常用）
      </ListItem>
      <ListItem>
        <Text bold>SQL Server</Text>（微软出品）
      </ListItem>
      <ListItem>
        <Text bold>PostgreSQL</Text>（开源、功能强大）
      </ListItem>
      <ListItem>
        <Text bold>SQLite</Text>（轻量级，手机 App、小工具常用）
      </ListItem>
      <ListItem>……</ListItem>
    </UnorderedList>
    <Paragraph>
      它们底层实现千差万别，但<Text bold>对外说的"话"大体是同一种——SQL</Text>。
    </Paragraph>
    <Paragraph>
      这意味着：你今天在 MySQL 上学会的{' '}
      <InlineCode>SELECT * FROM emp;</InlineCode>，拿到 Oracle、SQL Server 上，
      <Text bold>绝大多数情况一字不改也能跑</Text>。这就是"统一语言"的威力——
      <Text bold>学一次，走天下</Text>。
    </Paragraph>
    <Callout type="tip" title={"提示：SQL 之于数据库，就像\"普通话\"之于全国各地。"}>
      各地有方言（后面会讲），但大家都会说普通话，所以来自天南海北的人能用普通话顺畅交流。SQL
      就是关系型数据库界的普通话。
    </Callout>

    <Divider />

    <Subtitle>二、SQL 标准与方言（为什么不同数据库语法有细微差异）</Subtitle>

    <Heading3>2.1 有"国标"：SQL 是有标准的</Heading3>
    <Paragraph>
      SQL 不是某家公司私有的，它是有<Text bold>国际标准</Text>的。标准由
      ISO（国际标准化组织）和 ANSI（美国国家标准学会）共同维护，历史上有
      SQL-92、SQL:1999、SQL:2003、SQL:2008…… 等多个版本（你不需要背这些年份，知道"有国标"即可）。
    </Paragraph>
    <Paragraph>
      正因为有这套标准，各家数据库才能在"主干语法"上保持一致——这就是 1.3
      节里"一次学会到处能用"的根本保证。
    </Paragraph>

    <Heading3>2.2 有"方言"：各厂商的私有扩展</Heading3>
    <Paragraph>
      但是，标准往往"管得不够细"或者"更新慢"，而每家数据库厂商为了让自己的产品更好用、更有竞争力，都会在标准之外
      <Text bold>加一些自己独有的功能或写法</Text>
      。这些"标准之外的私有部分"，就叫做<Text bold>方言（Dialect）</Text>。
    </Paragraph>
    <Paragraph>于是就出现了这样的局面：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>主干（标准 SQL）</Text>：人人都遵守，通用。
      </ListItem>
      <ListItem>
        <Text bold>枝叶（方言）</Text>：各家不同，换数据库就可能要改。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="类比：">
      普通话是标准，但北京人说"倍儿好"、东北人说"贼好"、四川人说"巴适"。这些方言词外地人不一定懂，换个地方就得换说法。SQL
      方言也是同理。
    </Callout>

    <Heading3>2.3 几个能让你"立刻有感觉"的方言例子</Heading3>
    <Paragraph>
      光说概念太空，看几个真实差异（<Text bold>不用记，感受"原来真的会不一样"就够了</Text>）：
    </Paragraph>
    <Table
      head={['需求', 'MySQL 写法', 'Oracle 写法', 'SQL Server 写法']}
      rows={[
        ['查询前 3 行', '... LIMIT 3', '... WHERE ROWNUM <= 3', 'SELECT TOP 3 ...'],
        ['自动增长主键', 'AUTO_INCREMENT', '序列 SEQUENCE + 触发器', 'IDENTITY(1,1)'],
        ['字符串拼接', "CONCAT('a','b')", "'a' || 'b'", "'a' + 'b'"],
        ['取系统当前时间', 'NOW()', 'SYSDATE', 'GETDATE()'],
      ]}
    />
    <Paragraph>例如同样是"查工资最高的前 3 名员工"：</Paragraph>
    <CodeBlock
      language="sql"
      code={`-- MySQL 方言：用 LIMIT
SELECT ename, salary
FROM emp
ORDER BY salary DESC
LIMIT 3;`}
    />
    <CodeBlock
      language="sql"
      code={`-- Oracle 方言（同样需求，写法完全不同）：用 ROWNUM
SELECT ename, salary
FROM (SELECT ename, salary FROM emp ORDER BY salary DESC)
WHERE ROWNUM <= 3;`}
    />
    <Paragraph>
      <Text bold>执行结果（在 db_learn 上跑 MySQL 那条）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary']}
      rows={[
        ['孙七', '15000'],
        ['李四', '12000'],
        ['王五', '9500'],
      ]}
    />
    <Callout type="warning" title="注意：本教程默认讲的是 MySQL 方言。">
      后面我们会用到 <InlineCode>LIMIT</InlineCode>、
      <InlineCode>AUTO_INCREMENT</InlineCode>、<InlineCode># 注释</InlineCode>、反引号{' '}
      <InlineCode>`字段名`</InlineCode>{' '}
      等，这些有的是标准、有的是 MySQL 方言。我会在涉及方言时尽量提醒你"这是 MySQL
      特有的"，这样你将来换数据库时心里有数。
    </Callout>
    <Callout type="danger" title={"常见坑：把 MySQL 写法当成\"SQL 通用写法\"。"}>
      很多初学者在 MySQL 上写惯了 <InlineCode>LIMIT</InlineCode>，到了 Oracle
      上一跑就报错，还一脸懵："我语法没错啊？"——其实是用了方言。记住：
      <Text bold>通用的才能到处跑，方言只在自家好使。</Text>
    </Callout>
  </article>
);

export default index;
