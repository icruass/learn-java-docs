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
    <Title>SQL 概述、通用语法与四大分类（DDL / DML / DQL / DCL）</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        前两章我们安装好了 MySQL、连上了数据库、也认识了“数据库 / 表 / 行 /
        列”这些基本概念。但到目前为止，我们还只是“看客”——真正要让数据库干活，靠的是一门语言：
        <Text bold>SQL</Text>。
      </Paragraph>
      <Paragraph>
        这一章就是整套教程的“语言总纲”。它本身
        <Text bold>几乎不教你具体怎么建表、怎么查数据</Text>
        （那是后面几章的事），而是先回答三个根本问题：
      </Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>SQL 是什么？</Text> 它为什么能成为操作几乎所有关系型数据库的“普通话”？
        </ListItem>
        <ListItem>
          <Text bold>怎么写 SQL 才算合法？</Text>{' '}
          大小写、分号、空格、注释……这些“书写规矩”不弄清楚，后面写任何语句都会踩坑。
        </ListItem>
        <ListItem>
          <Text bold>SQL 一共能干哪些事？</Text>{' '}
          这就是著名的“四大分类”：DDL、DML、DQL、DCL。把它们分清楚，你脑子里就有了一张地图——后面每学一条语句，你都知道它属于哪一类、操作的是“结构”还是“数据”还是“权限”。
        </ListItem>
      </OrderedList>
      <Paragraph>
        可以把本章理解为：<Text bold>先发一张地图和一本“交通规则手册”，再上路开车。</Text>{' '}
        地图就是四大分类，交通规则就是通用语法。读完本章，你不一定会写多复杂的
        SQL，但你一定能看懂任何一条 SQL“是哪一类、大概在干嘛、写得合不合规矩”。
      </Paragraph>
      <Paragraph>
        本章会用到的示例库就是全套教程统一的 <InlineCode>db_learn</InlineCode>（部门表{' '}
        <InlineCode>dept</InlineCode>、员工表{' '}
        <InlineCode>emp</InlineCode>），后续章节会反复出现，请务必先建好它们（建表语句在最后“附录”中给出，本章正文只做演示引用）。
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
        ：关系型数据库里的数据是“一行一行、一列一列”规整存放的（像 Excel
        表格），这种规整结构就叫“结构化数据”。SQL 就是为操作这种结构化数据而生的。
      </ListItem>
      <ListItem>
        <Text bold>Query（查询）</Text>：虽然名字里只有“查询”，但其实 SQL
        远不止查询，它还能建库建表、增删改数据、管理权限。名字是历史遗留，别被它骗了。
      </ListItem>
      <ListItem>
        <Text bold>Language（语言）</Text>
        ：它是一门“语言”，有自己的语法规则，你“说”给数据库听，数据库就照做。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="提示：怎么读？">
      SQL 有两种常见读法，都对：一种逐字母读 “S-Q-L”；另一种读作
      “sequel”（/ˈsiːkwəl/，谐音“C口”）。面试和日常交流随便用哪种都行。
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
        ['你写给管理员的“取货 / 上货 / 改标签”的纸条', '一条 SQL 语句'],
      ]}
    />
    <Paragraph>
      你不能自己跑进仓库乱翻，你只能
      <Text bold>写纸条（SQL）交给管理员（数据库引擎）</Text>
      ，管理员看懂后帮你执行，再把结果递给你。SQL 就是你和数据库之间唯一的“沟通语言”。
    </Paragraph>

    <Heading3>1.3 为什么是“统一语言”——一次学会，到处能用</Heading3>
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
      它们底层实现千差万别，但<Text bold>对外说的“话”大体是同一种——SQL</Text>。
    </Paragraph>
    <Paragraph>
      这意味着：你今天在 MySQL 上学会的{' '}
      <InlineCode>SELECT * FROM emp;</InlineCode>，拿到 Oracle、SQL Server 上，
      <Text bold>绝大多数情况一字不改也能跑</Text>。这就是“统一语言”的威力——
      <Text bold>学一次，走天下</Text>。
    </Paragraph>
    <Callout type="tip" title="提示：SQL 之于数据库，就像“普通话”之于全国各地。">
      各地有方言（后面会讲），但大家都会说普通话，所以来自天南海北的人能用普通话顺畅交流。SQL
      就是关系型数据库界的普通话。
    </Callout>

    <Divider />

    <Subtitle>二、SQL 标准与方言（为什么不同数据库语法有细微差异）</Subtitle>

    <Heading3>2.1 有“国标”：SQL 是有标准的</Heading3>
    <Paragraph>
      SQL 不是某家公司私有的，它是有<Text bold>国际标准</Text>的。标准由
      ISO（国际标准化组织）和 ANSI（美国国家标准学会）共同维护，历史上有
      SQL-92、SQL:1999、SQL:2003、SQL:2008…… 等多个版本（你不需要背这些年份，知道“有国标”即可）。
    </Paragraph>
    <Paragraph>
      正因为有这套标准，各家数据库才能在“主干语法”上保持一致——这就是 1.3
      节里“一次学会到处能用”的根本保证。
    </Paragraph>

    <Heading3>2.2 有“方言”：各厂商的私有扩展</Heading3>
    <Paragraph>
      但是，标准往往“管得不够细”或者“更新慢”，而每家数据库厂商为了让自己的产品更好用、更有竞争力，都会在标准之外
      <Text bold>加一些自己独有的功能或写法</Text>
      。这些“标准之外的私有部分”，就叫做<Text bold>方言（Dialect）</Text>。
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
      普通话是标准，但北京人说“倍儿好”、东北人说“贼好”、四川人说“巴适”。这些方言词外地人不一定懂，换个地方就得换说法。SQL
      方言也是同理。
    </Callout>

    <Heading3>2.3 几个能让你“立刻有感觉”的方言例子</Heading3>
    <Paragraph>
      光说概念太空，看几个真实差异（<Text bold>不用记，感受“原来真的会不一样”就够了</Text>）：
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
    <Paragraph>例如同样是“查工资最高的前 3 名员工”：</Paragraph>
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
      等，这些有的是标准、有的是 MySQL 方言。我会在涉及方言时尽量提醒你“这是 MySQL
      特有的”，这样你将来换数据库时心里有数。
    </Callout>
    <Callout type="danger" title="常见坑：把 MySQL 写法当成“SQL 通用写法”。">
      很多初学者在 MySQL 上写惯了 <InlineCode>LIMIT</InlineCode>，到了 Oracle
      上一跑就报错，还一脸懵：“我语法没错啊？”——其实是用了方言。记住：
      <Text bold>通用的才能到处跑，方言只在自家好使。</Text>
    </Callout>

    <Divider />

    <Subtitle>三、SQL 通用语法规则（书写规矩）</Subtitle>
    <Paragraph>
      这一节是“交通规则”。规则不多，但每一条都会贯穿你今后写的每一句 SQL。
    </Paragraph>

    <Heading3>3.1 可以单行写，也可以多行写</Heading3>
    <Paragraph>
      一条 SQL 语句，写成一行可以，写成多行也完全没问题。
      <Text bold>数据库不看你换不换行，它看的是“分号在哪结束”。</Text>
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
      分号 <InlineCode>;</InlineCode> 是一条 SQL 语句的<Text bold>“句号”</Text>
      ，告诉数据库：“这句话说完了，可以执行了。”
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT * FROM dept;     -- 第一条语句，到分号结束
SELECT * FROM emp;      -- 第二条语句，又到分号结束`}
    />
    <Paragraph>
      为什么需要分号？因为你可能一次性发多条语句过去，数据库得知道
      <Text bold>“从哪到哪算一句”</Text>。分号就是那个分界点。
    </Paragraph>
    <Callout type="danger" title="常见坑：忘写分号导致“假死”。">
      <Paragraph>
        在命令行客户端（如 <InlineCode>mysql&gt;</InlineCode>{' '}
        提示符下）敲了语句却忘了分号回车，你会看到提示符变成{' '}
        <InlineCode>-&gt;</InlineCode>
        ，光标停在那里好像卡住了——其实它在等你把这句“说完”（等分号）。这时只要补一个{' '}
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
        的。所以养成“每句都加分号”的好习惯，绝不吃亏。
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
        <Text bold>一眼区分“命令”和“数据”</Text>：<InlineCode>SELECT</InlineCode>、
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
    <Callout type="warning" title="注意：一个重要的“例外”——数据 / 标识符不一定不区分大小写！">
      <Paragraph>
        “不区分大小写”指的是<Text bold>关键字</Text>（<InlineCode>SELECT</InlineCode>、
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
          可能就报“表不存在”。
        </ListItem>
      </OrderedList>
      <Paragraph>
        <Text bold>常见坑：</Text> 本地 Windows 开发一切正常，部署到 Linux
        服务器后报 <InlineCode>Table 'db_learn.Emp' doesn't exist</InlineCode>
        ——十有八九就是表名大小写问题。
        <Text bold>统一规范：库名、表名、字段名一律小写</Text>，可一劳永逸避开此坑。
      </Paragraph>
    </Callout>

    <Heading3>3.4 空格与缩进：随便加，但要加得“有意义”</Heading3>
    <Paragraph>
      SQL 中，标识符 / 关键字之间的
      <Text bold>空格、换行、Tab 缩进，数据库一律当作“一个分隔符”处理</Text>
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
    <Callout type="warning" title="注意：有些地方“不能乱加空格”。">
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

    <Subtitle>四、SQL 的三种注释</Subtitle>
    <Paragraph>
      注释 = 写给<Text bold>人</Text>看的说明文字，
      <Text bold>数据库执行时会直接跳过</Text>
      。注释能帮你解释“这段 SQL 在干嘛”，也能在调试时临时“屏蔽”掉某些语句。
    </Paragraph>
    <Paragraph>
      MySQL 支持<Text bold>三种</Text>注释写法：
    </Paragraph>

    <Heading3>
      4.1 单行注释：<InlineCode>-- 注释内容</InlineCode>（标准 SQL，⚠️
      横杠后必须有空格）
    </Heading3>
    <CodeBlock
      language="sql"
      code={`-- 这是一行注释，查询所有员工
SELECT * FROM emp;

SELECT ename, salary FROM emp;  -- 注释也可以写在语句末尾`}
    />
    <Callout
      type="danger"
      title="超高频坑：`--` 后面必须跟一个空格（或控制字符），否则不被当作注释！"
    >
      <Paragraph>这是标准 SQL 的硬性规定。看对比：</Paragraph>
      <CodeBlock
        language="sql"
        code={`-- 正确：横杠、横杠、空格、再写文字
SELECT 1;

--错误：横杠后紧贴文字，MySQL 不认为这是注释，会报语法错误
SELECT 1;`}
      />
      <Paragraph>
        第二种写法里 <InlineCode>--错误...</InlineCode> 会被解析成语句的一部分，导致{' '}
        <InlineCode>You have an error in your SQL syntax</InlineCode>。
        <Text bold>口诀：</Text>
        <InlineCode>--</InlineCode> 之后，先敲个空格。
      </Paragraph>
    </Callout>

    <Heading3>
      4.2 单行注释：<InlineCode># 注释内容</InlineCode>（⚠️ MySQL 特有的方言）
    </Heading3>
    <CodeBlock
      language="sql"
      code={`# 这也是单行注释（MySQL 特有），# 后面有没有空格都行
SELECT * FROM dept;

SELECT * FROM dept;  # 也能跟在语句后面`}
    />
    <Callout type="warning" title="注意：`#` 注释是 MySQL 方言，不是标准 SQL！">
      它写起来方便（不强制要空格），但<Text bold>只有 MySQL 认</Text>。如果你的 SQL
      将来可能要在 Oracle、SQL Server 等其他数据库上运行，
      <Text bold>请改用标准的 <InlineCode>--</InlineCode> 注释</Text>，以保证可移植性。
    </Callout>

    <Heading3>
      4.3 多行注释：<InlineCode>/* 注释内容 */</InlineCode>（标准 SQL）
    </Heading3>
    <Paragraph>
      用于注释<Text bold>一大段</Text>内容，可以跨多行。以 <InlineCode>/*</InlineCode>{' '}
      开始，以 <InlineCode>*/</InlineCode> 结束。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`/*
  这是一段多行注释：
  下面这条 SQL 用于查询研发部（dept_id = 1）的所有员工，
  作者：张三   日期：2026-06-07
*/
SELECT * FROM emp WHERE dept_id = 1;

SELECT id, /* 也可以写在语句中间，把某一小段挡住 */ ename FROM emp;`}
    />
    <Callout type="tip" title="提示：用多行注释“临时禁用”一段 SQL。">
      <Paragraph>
        调试时想暂时不执行某几行，又不想删掉，用 <InlineCode>/* ... */</InlineCode>{' '}
        把它们框起来即可，省得来回删了又写。
      </Paragraph>
      <Paragraph>
        🕳️ <Text bold>常见坑：多行注释不能嵌套。</Text>
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`/* 外层 /* 内层 */ 还想继续注释 */   -- ❌ 出错！`}
      />
      <Paragraph>
        MySQL 遇到<Text bold>第一个</Text> <InlineCode>*/</InlineCode>{' '}
        就认为注释结束了，后面的 <InlineCode>还想继续注释 */</InlineCode> 会被当成 SQL
        代码而报错。<Text bold>别在多行注释里再套多行注释。</Text>
      </Paragraph>
    </Callout>

    <Heading3>4.4 三种注释速查表</Heading3>
    <Table
      head={['写法', '类型', '是否标准 SQL', '关键注意点']}
      rows={[
        ['-- 内容', '单行', '✅ 标准', '-- 后必须有空格'],
        ['# 内容', '单行', '❌ MySQL 方言', '换库可能不识别，慎用'],
        ['/* 内容 */', '多行', '✅ 标准', '不能嵌套'],
      ]}
    />

    <Divider />

    <Subtitle>五、SQL 四大分类（核心地图）</Subtitle>
    <Paragraph>
      终于到了本章最重要的部分。SQL 语句虽然五花八门，但按
      <Text bold>“它到底在操作什么”</Text>，可以干净利落地分成
      <Text bold>四大类</Text>
      。把这四类搞清楚，你今后看任何一条 SQL，都能瞬间定位它“属于哪一类、在动哪样东西”。
    </Paragraph>
    <Paragraph>
      先记住这张“四口诀”——按<Text bold>操作对象</Text>区分：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>DDL</Text> 管 <Text bold>“结构”</Text>（库长什么样、表有哪些列）
      </ListItem>
      <ListItem>
        <Text bold>DML</Text> 管 <Text bold>“数据”</Text>{' '}
        的增删改（往表里塞数据、改数据、删数据）
      </ListItem>
      <ListItem>
        <Text bold>DQL</Text> 管 <Text bold>“数据”</Text> 的查询（把数据读出来看）
      </ListItem>
      <ListItem>
        <Text bold>DCL</Text> 管 <Text bold>“权限 / 用户”</Text>（谁能干什么）
      </ListItem>
    </UnorderedList>
    <Paragraph>下面逐一展开。</Paragraph>

    <Heading3>5.1 DDL —— 数据定义语言（Data Definition Language）</Heading3>
    <Paragraph>
      <Text bold>作用：定义和管理“数据库对象的结构”</Text>
      ，比如创建/修改/删除 数据库、表、视图、索引等。
      <Text bold>它动的是“骨架”，不是“数据”。</Text>
    </Paragraph>
    <Paragraph>
      <Text bold>核心关键字：</Text>
    </Paragraph>
    <Table
      head={['关键字', '含义', '通俗理解']}
      rows={[
        ['CREATE', '创建', '盖房子 / 打货架'],
        ['ALTER', '修改', '给房子加扇窗、给货架加一格'],
        ['DROP', '删除', '把整栋房子 / 整个货架拆掉'],
        ['TRUNCATE', '清空（表）', '货架还在，但货全倒空、编号归零'],
      ]}
    />
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- CREATE：创建数据库
CREATE DATABASE db_learn;

-- CREATE：创建一张部门表（定义结构：有哪些列、什么类型）
CREATE TABLE dept (
    id        INT PRIMARY KEY AUTO_INCREMENT,  -- 部门编号
    dept_name VARCHAR(20),                      -- 部门名称
    loc       VARCHAR(20)                       -- 所在城市
);

-- ALTER：给 dept 表新增一列“电话”
ALTER TABLE dept ADD phone VARCHAR(20);

-- DROP：删除整张表（连结构带数据一起没了）
DROP TABLE dept;

-- TRUNCATE：清空 emp 表的所有数据，但保留表结构（且自增主键归零）
TRUNCATE TABLE emp;`}
    />
    <Callout type="warning" title="注意：DDL 操作通常“不可回滚”，下手要谨慎！">
      <Paragraph>
        在 MySQL 中，<InlineCode>CREATE</InlineCode>、<InlineCode>ALTER</InlineCode>、
        <InlineCode>DROP</InlineCode>、<InlineCode>TRUNCATE</InlineCode> 等 DDL 会
        <Text bold>隐式提交（implicit commit）</Text>，意味着你
        <Text bold>没法靠 <InlineCode>ROLLBACK</InlineCode> 撤销</Text>。
        <InlineCode>DROP TABLE emp;</InlineCode>{' '}
        一旦执行，表就真没了。生产环境执行 DDL 前，请务必三思、最好先备份。
      </Paragraph>
      <Paragraph>
        🕳️{' '}
        <Text bold>
          常见坑：<InlineCode>TRUNCATE</InlineCode> vs <InlineCode>DELETE</InlineCode>{' '}
          傻傻分不清。
        </Text>
      </Paragraph>
      <Paragraph>两者都能“清空表里的数据”，但本质不同：</Paragraph>
      <Table
        head={['对比项', 'TRUNCATE TABLE emp;', 'DELETE FROM emp;']}
        rows={[
          ['所属分类', 'DDL', 'DML'],
          ['原理', '直接“摧毁重建”表，几乎不逐行处理', '一行一行地删'],
          ['速度', '快（数据多时明显快）', '慢'],
          ['能否带 WHERE 条件删部分', '❌ 不能，只能全清', '✅ 能，可只删符合条件的行'],
          ['自增主键', '重置归零（下次从 1 开始）', '不重置（接着上次的值继续）'],
          ['能否 ROLLBACK 撤销', '❌ 不能', '✅ 能（在事务中）'],
        ]}
      />
      <Paragraph>
        一句话：要<Text bold>带条件删、想能反悔</Text>用 <InlineCode>DELETE</InlineCode>
        ；要<Text bold>整表秒清、不在乎主键归零</Text>用{' '}
        <InlineCode>TRUNCATE</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading3>5.2 DML —— 数据操作语言（Data Manipulation Language）</Heading3>
    <Paragraph>
      <Text bold>作用：对表里的“数据”进行增、改、删。</Text> 注意——它操作的是
      <Text bold>表中的记录（行）</Text>，<Text bold>不动表结构</Text>。
    </Paragraph>
    <Paragraph>
      <Text bold>核心关键字：</Text>
    </Paragraph>
    <Table
      head={['关键字', '含义', '通俗理解']}
      rows={[
        ['INSERT', '插入（增）', '往货架上放一件新货'],
        ['UPDATE', '更新（改）', '把货架上某件货的标签改一下'],
        ['DELETE', '删除（删）', '把货架上某件货拿走'],
      ]}
    />
    <Paragraph>
      <Text bold>示例（在 emp 表上操作）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- INSERT：新增一名员工
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus)
VALUES ('周八', '男', 7000, '2023-03-01', 1, 500);

-- UPDATE：给“张三”涨工资到 8500（⚠️ 一定要带 WHERE！）
UPDATE emp SET salary = 8500 WHERE ename = '张三';

-- DELETE：删除“周八”这条记录（⚠️ 一定要带 WHERE！）
DELETE FROM emp WHERE ename = '周八';`}
    />
    <Paragraph>
      <Text bold>执行后 emp 表状态变化示意（以 INSERT 后为例）：</Text>
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', 'join_date', 'dept_id', 'bonus']}
      rows={[
        ['1', '张三', '男', '8000', '2020-01-10', '1', '1000'],
        ['2', '李四', '男', '12000', '2019-03-15', '1', 'NULL'],
        ['3', '王五', '女', '9500', '2021-06-01', '2', '2000'],
        ['4', '赵六', '女', '6000', '2022-09-20', '2', 'NULL'],
        ['5', '孙七', '男', '15000', '2018-11-05', '3', '3000'],
        ['6', '周八', '男', '7000', '2023-03-01', '1', '500'],
      ]}
    />
    <Callout
      type="danger"
      title="致命坑：`UPDATE` / `DELETE` 不写 `WHERE`，全表遭殃！"
    >
      <CodeBlock
        language="sql"
        code={`UPDATE emp SET salary = 0;   -- 💀 没有 WHERE：所有人的工资全被改成 0！
DELETE FROM emp;             -- 💀 没有 WHERE：整张表的数据全没了！`}
      />
      <Paragraph>
        这是新手（乃至老手）最容易酿成事故的地方。养成习惯：
        <Text bold>
          写 <InlineCode>UPDATE</InlineCode> / <InlineCode>DELETE</InlineCode> 时，先把{' '}
          <InlineCode>WHERE</InlineCode> 条件写好，再回头补前面的部分。
        </Text>
      </Paragraph>
      <Paragraph>
        💡 <Text bold>提示：开启“安全模式”防误删。</Text> MySQL 客户端可设置{' '}
        <InlineCode>SET SQL_SAFE_UPDATES = 1;</InlineCode>，开启后，没带{' '}
        <InlineCode>WHERE</InlineCode>（或 <InlineCode>WHERE</InlineCode>{' '}
        未用到键/索引）的 <InlineCode>UPDATE</InlineCode>/<InlineCode>DELETE</InlineCode>{' '}
        会被直接拒绝执行，给你一道“保险”。
      </Paragraph>
    </Callout>

    <Heading3>5.3 DQL —— 数据查询语言（Data Query Language）</Heading3>
    <Paragraph>
      <Text bold>作用：查询数据，把表里的数据“读”出来给你看。</Text>{' '}
      关键字只有一个核心：<Text bold><InlineCode>SELECT</InlineCode></Text>（常配{' '}
      <InlineCode>FROM</InlineCode>、<InlineCode>WHERE</InlineCode>、
      <InlineCode>GROUP BY</InlineCode>、<InlineCode>ORDER BY</InlineCode>、
      <InlineCode>LIMIT</InlineCode> 等）。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 最简单的查询：查 emp 表所有行所有列
SELECT * FROM emp;

-- 带条件查询：工资大于 9000 的员工的姓名和工资
SELECT ename, salary
FROM   emp
WHERE  salary > 9000
ORDER BY salary DESC;`}
    />
    <Paragraph>
      <Text bold>第二条的执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary']}
      rows={[
        ['孙七', '15000'],
        ['李四', '12000'],
        ['王五', '9500'],
      ]}
    />
    <Callout type="tip" title="提示：为什么把 DQL 单独拎出来讲？">
      <Paragraph>
        严格按学术 / 标准定义，
        <Text bold>
          <InlineCode>SELECT</InlineCode> 其实属于 DML 的一部分
        </Text>
        （它也是“操作数据”嘛）。但在实际工作中，
        <Text bold>“查询”是使用频率最高、内容最丰富、最值得花时间钻研的一块</Text>——
        <InlineCode>WHERE</InlineCode> 条件、聚合函数、分组、排序、多表连接、子查询……
        复杂度远超增删改。
      </Paragraph>
      <Paragraph>
        所以教学和工程实践中，习惯把 <InlineCode>SELECT</InlineCode> 从 DML 里
        <Text bold>单独剥离</Text>出来，称为 <Text bold>DQL</Text>，给予“一等公民”待遇。本套教程后续会用
        <Text bold>整整好几章</Text>专门讲 DQL，足见其重要性。你只要记住：
        <Text bold>“DQL 本是 DML 的一部分，因太重要而被单列。”</Text>
      </Paragraph>
      <Paragraph>
        ⚠️{' '}
        <Text bold>
          注意：<InlineCode>SELECT</InlineCode> 不修改任何数据。
        </Text>{' '}
        它是“只读”的，无论你查多少次，表里的数据都纹丝不动。这点和 DML
        的增删改有本质区别。
      </Paragraph>
    </Callout>

    <Heading3>5.4 DCL —— 数据控制语言（Data Control Language）</Heading3>
    <Paragraph>
      <Text bold>
        作用：管理“数据库用户”和“权限”——即控制“谁，能对什么，做什么”。
      </Text>{' '}
      这是 DBA（数据库管理员）的活儿，普通开发用得少，但必须知道它的存在。
    </Paragraph>
    <Paragraph>
      <Text bold>核心关键字：</Text>
    </Paragraph>
    <Table
      head={['关键字', '含义', '通俗理解']}
      rows={[
        ['GRANT', '授予权限', '发一张“门禁卡 / 通行证”'],
        ['REVOKE', '收回权限', '把通行证收回作废'],
      ]}
    />
    <Paragraph>
      （广义上 <InlineCode>CREATE USER</InlineCode>、<InlineCode>DROP USER</InlineCode>、
      <InlineCode>ALTER USER</InlineCode>、设置密码等用户管理操作也常被归入 DCL
      范畴。）
    </Paragraph>
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 创建一个新用户 zhangsan，密码 123456，仅允许从本机登录
CREATE USER 'zhangsan'@'localhost' IDENTIFIED BY '123456';

-- GRANT：授予 zhangsan 对 db_learn 库的“查询 + 插入”权限
GRANT SELECT, INSERT ON db_learn.* TO 'zhangsan'@'localhost';

-- REVOKE：收回 zhangsan 的“插入”权限（以后他只能查，不能插了）
REVOKE INSERT ON db_learn.* FROM 'zhangsan'@'localhost';

-- 刷新权限，使更改立即生效（MySQL 习惯做法）
FLUSH PRIVILEGES;`}
    />
    <Paragraph>
      <Text bold>效果示意：</Text>
    </Paragraph>
    <Table
      head={['操作前', '操作后（REVOKE INSERT 之后）']}
      rows={[
        ['zhangsan 能 SELECT、能 INSERT', 'zhangsan 只能 SELECT，INSERT 会被拒绝'],
      ]}
    />
    <Callout type="tip" title="提示：DCL 是“安全 / 运维”范畴。">
      <Paragraph>
        作为应用开发者，你日常更多是用一个<Text bold>已经配好权限的账号</Text>
        去连数据库写业务 SQL，很少亲手敲 <InlineCode>GRANT</InlineCode>/
        <InlineCode>REVOKE</InlineCode>。但理解它能帮你看懂“为什么我这个账号执行某条 SQL
        会报 <InlineCode>command denied</InlineCode>（权限不足）”——多半就是 DCL
        层面没给你对应权限。
      </Paragraph>
      <Paragraph>
        ⚠️ <Text bold>注意：</Text> 不同 MySQL 版本里，创建用户和授权的语法细节略有差异（比如旧版可在{' '}
        <InlineCode>GRANT</InlineCode> 时顺带创建用户，新版推荐先{' '}
        <InlineCode>CREATE USER</InlineCode> 再 <InlineCode>GRANT</InlineCode>
        ）。这部分会在后续“用户与权限管理”章节细讲，此处只需建立“DCL 管权限”的概念。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>六、四大分类总结对照表（务必记牢）</Subtitle>
    <Paragraph>
      这张表是本章的“浓缩精华”，建议截图 / 抄下来反复看：
    </Paragraph>
    <Table
      head={['分类', '英文全称', '中文', '核心关键字', '操作对象', '一句话用途']}
      rows={[
        [
          'DDL',
          'Data Definition Language',
          '数据定义语言',
          'CREATE、ALTER、DROP、TRUNCATE',
          '数据库、表等结构（骨架）',
          '定义和管理库 / 表的结构',
        ],
        [
          'DML',
          'Data Manipulation Language',
          '数据操作语言',
          'INSERT、UPDATE、DELETE',
          '表中的数据（记录 / 行）',
          '对表里的数据进行增、改、删',
        ],
        [
          'DQL',
          'Data Query Language',
          '数据查询语言',
          'SELECT',
          '表中的数据（只读）',
          '把数据查询出来（本属 DML，因重要而单列）',
        ],
        [
          'DCL',
          'Data Control Language',
          '数据控制语言',
          'GRANT、REVOKE',
          '用户与权限',
          '控制谁能对数据库做什么',
        ],
      ]}
    />
    <Paragraph>
      <Text bold>记忆口诀：</Text>
    </Paragraph>
    <Callout type="note">
      <Text bold>
        D-定义改结构（DDL），M-改数据增删改（DML），Q-查询只读取（DQL），C-控制管权限（DCL）。
      </Text>
    </Callout>
    <Paragraph>
      或者更短：
      <Text bold>“DDL 改骨架，DML 改血肉，DQL 只看不动，DCL 管门禁。”</Text>
    </Paragraph>
    <Callout type="tip" title="提示：怎么快速判断一条 SQL 属于哪一类？">
      看它的<Text bold>第一个关键字（动词）</Text>就够了：
      <UnorderedList>
        <ListItem>
          <InlineCode>CREATE</InlineCode> / <InlineCode>ALTER</InlineCode> /{' '}
          <InlineCode>DROP</InlineCode> / <InlineCode>TRUNCATE</InlineCode> →{' '}
          <Text bold>DDL</Text>
        </ListItem>
        <ListItem>
          <InlineCode>INSERT</InlineCode> / <InlineCode>UPDATE</InlineCode> /{' '}
          <InlineCode>DELETE</InlineCode> → <Text bold>DML</Text>
        </ListItem>
        <ListItem>
          <InlineCode>SELECT</InlineCode> → <Text bold>DQL</Text>
        </ListItem>
        <ListItem>
          <InlineCode>GRANT</InlineCode> / <InlineCode>REVOKE</InlineCode> →{' '}
          <Text bold>DCL</Text>
        </ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>七、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>SQL（Structured Query Language，结构化查询语言）</Text>{' '}
        是操作关系型数据库的<Text bold>统一语言</Text>，“学一次，走天下”。
      </ListItem>
      <ListItem>
        SQL 有<Text bold>国际标准</Text>，保证主干语法通用；各厂商又有
        <Text bold>方言（私有扩展）</Text>，导致不同数据库细节有差异（如 MySQL 用{' '}
        <InlineCode>LIMIT</InlineCode>、Oracle 用 <InlineCode>ROWNUM</InlineCode>）。本教程默认讲{' '}
        <Text bold>MySQL 方言</Text>。
      </ListItem>
      <ListItem>
        <Text bold>通用语法规则</Text>：
        <UnorderedList>
          <ListItem>
            可单行可多行；<Text bold>以分号 <InlineCode>;</InlineCode> 结束</Text>一条语句。
          </ListItem>
          <ListItem>
            <Text bold>关键字不区分大小写</Text>，但<Text bold>建议大写</Text>
            ；注意库名 / 表名在 Linux 上区分大小写——<Text bold>统一小写</Text>最稳妥。
          </ListItem>
          <ListItem>
            空格 / 缩进随便加（至少一个分隔），主要用于<Text bold>提升可读性</Text>
            ；但<Text bold>引号内的空格属于数据本身</Text>。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>三种注释</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>-- 内容</InlineCode>（标准，
            <Text bold><InlineCode>--</InlineCode> 后必须有空格</Text>）
          </ListItem>
          <ListItem>
            <InlineCode># 内容</InlineCode>（<Text bold>MySQL 方言</Text>，慎用）
          </ListItem>
          <ListItem>
            <InlineCode>/* 内容 */</InlineCode>（标准多行，<Text bold>不能嵌套</Text>）
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>四大分类（核心）</Text>：
        <UnorderedList>
          <ListItem>
            <Text bold>DDL</Text>（<InlineCode>CREATE</InlineCode>/
            <InlineCode>ALTER</InlineCode>/<InlineCode>DROP</InlineCode>/
            <InlineCode>TRUNCATE</InlineCode>）—— 操作<Text bold>结构</Text>，通常不可回滚。
          </ListItem>
          <ListItem>
            <Text bold>DML</Text>（<InlineCode>INSERT</InlineCode>/
            <InlineCode>UPDATE</InlineCode>/<InlineCode>DELETE</InlineCode>）—— 操作
            <Text bold>数据</Text>，改增删时
            <Text bold>务必带 <InlineCode>WHERE</InlineCode></Text>。
          </ListItem>
          <ListItem>
            <Text bold>DQL</Text>（<InlineCode>SELECT</InlineCode>）—— <Text bold>查询</Text>
            数据，只读；本属 DML，因重要而单列，是后续学习重点。
          </ListItem>
          <ListItem>
            <Text bold>DCL</Text>（<InlineCode>GRANT</InlineCode>/
            <InlineCode>REVOKE</InlineCode>）—— 管理<Text bold>用户与权限</Text>。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        判断归类：<Text bold>看第一个关键字（动词）即可。</Text>
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>八、常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>Q1：SQL 的四大分类是什么？各自的关键字？</Text>
    </Paragraph>
    <Paragraph>
      A：DDL（<InlineCode>CREATE</InlineCode>/<InlineCode>ALTER</InlineCode>/
      <InlineCode>DROP</InlineCode>/<InlineCode>TRUNCATE</InlineCode>，操作结构）、DML（
      <InlineCode>INSERT</InlineCode>/<InlineCode>UPDATE</InlineCode>/
      <InlineCode>DELETE</InlineCode>，操作数据）、DQL（<InlineCode>SELECT</InlineCode>
      ，查询数据）、DCL（<InlineCode>GRANT</InlineCode>/<InlineCode>REVOKE</InlineCode>
      ，控制权限）。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q2：<InlineCode>DELETE</InlineCode>、<InlineCode>TRUNCATE</InlineCode>、
        <InlineCode>DROP</InlineCode> 三者的区别？
      </Text>
    </Paragraph>
    <Paragraph>A：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>DELETE</InlineCode>（DML）：逐行删数据，可带 <InlineCode>WHERE</InlineCode>{' '}
        删部分，可回滚，自增不重置，表结构还在。
      </ListItem>
      <ListItem>
        <InlineCode>TRUNCATE</InlineCode>（DDL）：整表清空，不能带{' '}
        <InlineCode>WHERE</InlineCode>，不可回滚，自增重置归零，表结构还在，速度快。
      </ListItem>
      <ListItem>
        <InlineCode>DROP</InlineCode>（DDL）：
        <Text bold>连表结构带数据一起删掉</Text>，表彻底消失，不可回滚。
      </ListItem>
      <ListItem>
        一句话：删数据用 <InlineCode>DELETE</InlineCode>/<InlineCode>TRUNCATE</InlineCode>
        ，删表用 <InlineCode>DROP</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>
        Q3：为什么 <InlineCode>SELECT</InlineCode> 被单独叫做 DQL，而不是归到 DML？
      </Text>
    </Paragraph>
    <Paragraph>
      A：从标准定义看 <InlineCode>SELECT</InlineCode>{' '}
      本属 DML（数据操作的一种）；但因查询是实际使用中最频繁、最复杂、最核心的部分，工程和教学习惯把它单独剥离出来称为
      DQL，以示重视。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q4：<InlineCode>--</InlineCode> 注释为什么有时不生效 / 报错？
      </Text>
    </Paragraph>
    <Paragraph>
      A：标准 SQL 要求 <InlineCode>--</InlineCode> 后必须紧跟一个<Text bold>空格</Text>
      （或控制字符）才被识别为注释。写成 <InlineCode>--内容</InlineCode>
      （紧贴）不会被当作注释，从而引发语法错误。
    </Paragraph>
    <Paragraph>
      <Text bold>Q5：同一条 SQL 在 MySQL 能跑，换到 Oracle 报错，为什么？</Text>
    </Paragraph>
    <Paragraph>
      A：很可能用到了 <Text bold>MySQL 方言</Text>（如 <InlineCode>LIMIT</InlineCode>、
      <InlineCode>#</InlineCode> 注释、<InlineCode>AUTO_INCREMENT</InlineCode>
      、反引号等），这些不属于通用标准，其他数据库不识别。需改用目标数据库对应的语法。
    </Paragraph>
    <Paragraph>
      <Text bold>Q6：SQL 关键字到底区分不区分大小写？</Text>
    </Paragraph>
    <Paragraph>
      A：<Text bold>关键字不区分</Text>（<InlineCode>SELECT</InlineCode> 与{' '}
      <InlineCode>select</InlineCode>{' '}
      等价）。但要注意：①列值是否区分大小写取决于排序规则（collation）；②库名 /
      表名在 Linux 下默认区分大小写、Windows
      下不区分。规范建议：关键字大写，库 / 表 / 字段名一律小写。
    </Paragraph>

    <Divider />

    <Subtitle>附录：本章示例所用建表与初始数据（统一示例库 db_learn）</Subtitle>
    <Callout type="note">
      后续各章会反复用到下面这套表与数据，请先执行一遍备用。
    </Callout>
    <CodeBlock
      language="sql"
      code={`-- 创建并切换到示例库
CREATE DATABASE IF NOT EXISTS db_learn DEFAULT CHARSET utf8mb4;
USE db_learn;

-- 部门表（dept）
CREATE TABLE dept (
    id        INT PRIMARY KEY AUTO_INCREMENT,  -- 部门编号
    dept_name VARCHAR(20),                      -- 部门名称
    loc       VARCHAR(20)                       -- 所在城市
);
INSERT INTO dept (dept_name, loc) VALUES
    ('研发部', '北京'),
    ('市场部', '上海'),
    ('财务部', '广州');

-- 员工表（emp），与 dept 一对多，dept_id 为外键
CREATE TABLE emp (
    id        INT PRIMARY KEY AUTO_INCREMENT,  -- 员工编号
    ename     VARCHAR(20),                      -- 姓名
    gender    CHAR(1),                          -- 性别 男/女
    salary    DOUBLE,                           -- 工资
    join_date DATE,                             -- 入职日期
    dept_id   INT,                              -- 所属部门(外键->dept.id)
    bonus     DOUBLE,                           -- 奖金(可能为 NULL)
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
    ('张三', '男', 8000,  '2020-01-10', 1, 1000),
    ('李四', '男', 12000, '2019-03-15', 1, NULL),
    ('王五', '女', 9500,  '2021-06-01', 2, 2000),
    ('赵六', '女', 6000,  '2022-09-20', 2, NULL),
    ('孙七', '男', 15000, '2018-11-05', 3, 3000);`}
    />
    <Callout type="tip">
      至此，你已经拿到了“地图（四大分类）”和“交通规则（通用语法）”。
      <Text bold>
        下一章起，我们将正式上路——从 DDL 开始，一步步学习如何亲手创建数据库、设计表结构。
      </Text>
    </Callout>
  </article>
);

export default index;
