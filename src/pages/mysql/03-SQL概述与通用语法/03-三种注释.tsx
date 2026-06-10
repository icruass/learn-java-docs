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
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>三种注释</Title>
    <Paragraph>
      注释 = 写给<Text bold>人</Text>看的说明文字，
      <Text bold>数据库执行时会直接跳过</Text>
      。注释能帮你解释"这段 SQL 在干嘛"，也能在调试时临时"屏蔽"掉某些语句。
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
    <Callout type="tip" title={"提示：用多行注释\"临时禁用\"一段 SQL。"}>
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
  </article>
);

export default index;
