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
    <Title>第一范式 1NF 与第二范式 2NF</Title>

    <Subtitle>三、第一范式 1NF：列不可再分（原子性）</Subtitle>
    <Callout type="note">
      <Text bold>
        定义：表中每一列都是不可再分的「原子」数据项，不能是集合、数组或可拆分的复合值。
      </Text>
    </Callout>

    <Heading3>3.1 反例与修正</Heading3>
    <Paragraph>
      <Text bold>反例 1：一列存了多个值</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ❌ 违反 1NF：phone 列存了多个电话，用逗号隔开
CREATE TABLE contact_bad (
  id    INT,
  name  VARCHAR(20),
  phone VARCHAR(100)   -- '13800000001,13800000002'
);`}
    />
    <Paragraph>
      问题：想查「有几个人用了某个号码」「按第二个号码排序」都极其困难，得用字符串函数硬切。
    </Paragraph>
    <Paragraph>
      <Text bold>反例 2：列还能再分</Text>
    </Paragraph>
    <Table
      head={['id', 'name', 'address']}
      rows={[['1', '张三', '广东省深圳市南山区科技路1号']]}
    />
    <Paragraph>
      如果业务经常要按「省」「市」筛选，那 <InlineCode>address</InlineCode>{' '}
      就是可再分的，违反 1NF。
    </Paragraph>
    <Paragraph>
      <Text bold>修正</Text>：把可再分的拆成独立列（或独立表）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ✅ 满足 1NF
CREATE TABLE contact_ok (
  id       INT PRIMARY KEY,
  name     VARCHAR(20),
  province VARCHAR(20),  -- 省
  city     VARCHAR(20),  -- 市
  district VARCHAR(20),  -- 区
  street   VARCHAR(50)   -- 详细地址
);`}
    />

    <Heading3>3.2 1NF 是相对的</Heading3>
    <Paragraph>
      「原子不可分」要结合<Text bold>业务需求</Text>判断：
    </Paragraph>
    <UnorderedList>
      <ListItem>如果业务从不拆地址，把整个地址存一列也可以接受；</ListItem>
      <ListItem>如果业务要按省市筛选，就必须拆开。</ListItem>
    </UnorderedList>
    <Callout type="warning">
      <Text bold>关系型数据库天生要求 1NF</Text>
      ——你在 MySQL 里建表，每个单元格本来就只能放一个标量值，所以「不满足 1NF」往往不是语法问题，而是
      <Text bold>设计观念问题</Text>（明明该拆却硬塞）。
    </Callout>

    <Divider />

    <Subtitle>四、第二范式 2NF：消除部分依赖</Subtitle>
    <Callout type="note">
      <Text bold>
        定义：在满足 1NF
        的前提下，每一个「非主属性」都必须「完全函数依赖」于码（不能只依赖码的一部分）。
      </Text>
    </Callout>
    <Paragraph>
      2NF 只在<Text bold>码是联合字段（多列组成）</Text>
      时才有讨论意义；如果主键是单列，自动满足 2NF。
    </Paragraph>

    <Heading3>4.1 用选课表演示</Heading3>
    <Paragraph>
      回到 1.1 的烂表，它的码是 <InlineCode>(sno, cno)</InlineCode>
      。逐个检查非主属性：
    </Paragraph>
    <Table
      head={['非主属性', '实际依赖', '是否完全依赖 (sno,cno)']}
      rows={[
        ['sname', 'sno → sname', '❌ 只依赖 sno（部分依赖）'],
        ['cname', 'cno → cname', '❌ 只依赖 cno（部分依赖）'],
        ['teacher', 'cno → teacher', '❌ 只依赖 cno（部分依赖）'],
        ['teacher_tel', 'cno→teacher→tel', '❌ 部分 + 传递'],
        ['score', '(sno,cno) → score', '✅ 完全依赖'],
      ]}
    />
    <Paragraph>
      存在大量部分依赖 → <Text bold>不满足 2NF</Text>。这正是冗余的根源。
    </Paragraph>

    <Heading3>4.2 拆表使其满足 2NF</Heading3>
    <Paragraph>按「依赖谁就跟谁走」的原则拆开：</Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ✅ 学生表：sno 能决定的放一起
CREATE TABLE student (
  sno   INT PRIMARY KEY,
  sname VARCHAR(20)
);

-- ✅ 课程表：cno 能决定的放一起（先把老师也放进来，3NF 会继续优化）
CREATE TABLE course (
  cno     INT PRIMARY KEY,
  cname   VARCHAR(20),
  teacher VARCHAR(20),
  teacher_tel VARCHAR(20)
);

-- ✅ 选课成绩表：只剩完全依赖 (sno,cno) 的 score
CREATE TABLE sc (
  sno   INT,
  cno   INT,
  score INT,
  PRIMARY KEY (sno, cno),                 -- 联合主键
  FOREIGN KEY (sno) REFERENCES student(sno),
  FOREIGN KEY (cno) REFERENCES course(cno)
);`}
    />
    <Paragraph>
      现在：学生姓名只存一份、课程信息只存一份，更新/插入/删除异常基本消失。
    </Paragraph>
  </article>
);

export default index;
