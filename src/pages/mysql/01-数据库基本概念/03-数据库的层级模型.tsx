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
    <Title>数据库的层级模型：DBMS → 数据库 → 表 → 行/列</Title>
    <Paragraph>
      这是<Text bold>全书最重要的一张“心智地图”</Text>，请务必记牢。
    </Paragraph>

    <Heading3>3.1 四个层级</Heading3>
    <Paragraph>
      一个 DBMS（如 MySQL 软件）里，可以装很多个<Text bold>数据库</Text>
      ；一个数据库里，可以有很多张<Text bold>表</Text>；一张表，由很多
      <Text bold>行</Text>和<Text bold>列</Text>组成。层层包含，像“俄罗斯套娃”。
    </Paragraph>
    <CodeBlock
      language="text"
      code={`DBMS（MySQL 软件）
└── 数据库 db_learn          ← 一个项目通常用一个数据库
    ├── 表 dept（部门表）
    └── 表 emp（员工表）       ← 表是真正存数据的二维结构
        ├── 列：id  ename  gender  salary ...   （字段，定义“有哪些属性”）
        └── 行：(1,张三,男,8000,...)            （记录，一行就是一个具体的员工）`}
    />
    <Paragraph>各层级的专业术语对照（中英文你都会遇到）：</Paragraph>
    <Table
      head={['层级', '中文叫法', '英文 / 别名', '它是什么']}
      rows={[
        ['1', '数据库管理系统', 'DBMS', '管理一切的软件'],
        ['2', '数据库', 'Database / Schema', '一组相关表的集合（一个项目一库）'],
        ['3', '表', 'Table', '二维表格，真正存数据的地方'],
        ['4', '行 / 记录', 'Row / Record', '一行就是一条完整数据'],
        ['4', '列 / 字段', 'Column / Field', '一列就是一个属性'],
      ]}
    />

    <Heading3>3.2 “二维表”长什么样</Heading3>
    <Paragraph>
      表（Table）就是我们最熟悉的<Text bold>二维表格</Text>
      ——有表头（列），有一行行数据（行）。以 <InlineCode>emp</InlineCode> 表为例：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`        ┌────┬───────┬────────┬────────┬────────────┬─────────┬───────┐
列名 →  │ id │ ename │ gender │ salary │ join_date  │ dept_id │ bonus │   ← 列(字段)
        ├────┼───────┼────────┼────────┼────────────┼─────────┼───────┤
行(记录)→│ 1  │ 张三  │  男    │  8000  │ 2020-01-10 │    1    │ 1000  │
        │ 2  │ 李四  │  男    │ 12000  │ 2019-03-15 │    1    │ NULL  │
        │ 3  │ 王五  │  女    │  9500  │ 2021-06-01 │    2    │ 2000  │
        └────┴───────┴────────┴────────┴────────────┴─────────┴───────┘`}
    />
    <UnorderedList>
      <ListItem>
        <Text bold>列（字段）</Text>
        ：定义“一个员工有哪些属性”——编号、姓名、性别、工资……每列还规定了
        <Text bold>数据类型</Text>（比如 <InlineCode>salary</InlineCode> 必须是数字）。
      </ListItem>
      <ListItem>
        <Text bold>行（记录）</Text>：每一行是<Text bold>一个具体的员工</Text>
        的完整信息。
      </ListItem>
    </UnorderedList>

    <Heading3>3.3 用 Java 类比：表 = 一个对象的集合</Heading3>
    <Paragraph>
      这是给程序员最直观的类比——<Text bold>一张表，就相当于 Java
      里“某个类的对象列表”</Text>：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`// 一行(记录) ≈ 一个 Java 对象
class Emp {
    int     id;        // ≈ 列 id
    String  ename;     // ≈ 列 ename
    char    gender;    // ≈ 列 gender
    double  salary;    // ≈ 列 salary
    LocalDate joinDate;// ≈ 列 join_date
    int     deptId;    // ≈ 列 dept_id
    Double  bonus;     // ≈ 列 bonus（用包装类型 Double 才能表示 NULL）
}

// 一张表(table) ≈ 一个 List<对象>
List<Emp> empTable = List.of(
    new Emp(1, "张三", '男', 8000,  ..., 1, 1000.0),
    new Emp(2, "李四", '男', 12000, ..., 1, null),   // bonus 为 null
    new Emp(3, "王五", '女', 9500,  ..., 2, 2000.0)
);`}
    />
    <Paragraph>对照记忆：</Paragraph>
    <Table
      head={['数据库概念', 'Java 概念']}
      rows={[
        ['表（Table）', 'List<对象>'],
        ['列 / 字段', '类的一个成员变量'],
        ['列的数据类型', '成员变量的类型'],
        ['行 / 记录', '一个对象实例'],
        ['NULL', 'Java 的 null'],
      ]}
    />
    <Callout type="tip">
      注意上面 <InlineCode>bonus</InlineCode> 用的是 <InlineCode>Double</InlineCode>
      （包装类）而不是 <InlineCode>double</InlineCode>
      （基本类型）。因为数据库里 <InlineCode>bonus</InlineCode> 列
      <Text bold>允许为 NULL</Text>（李四没有奖金），而 Java 基本类型{' '}
      <InlineCode>double</InlineCode> 无法表示“空”，必须用能装{' '}
      <InlineCode>null</InlineCode> 的包装类。这正好对应数据库里“
      <Text bold>NULL 表示未知/不存在</Text>”的概念——后面讲{' '}
      <InlineCode>NULL</InlineCode> 时还会专门展开。
    </Callout>
    <Callout type="warning">
      上面只是“类比”帮助理解，并不是说表在磁盘上真的是个 List。表底层是 DBMS
      用专门的数据结构（如 B+ 树）存储的，但对你写 SQL 来说，
      <Text bold>把它当成“带类型约束的二维表 / 对象集合”去理解就完全够用了</Text>。
    </Callout>
  </article>
);

export default index;
