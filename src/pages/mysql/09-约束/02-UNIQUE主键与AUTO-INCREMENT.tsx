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
    <Title>UNIQUE、主键与自动增长</Title>

    <Subtitle>3. 唯一约束 UNIQUE</Subtitle>

    <Heading3>3.1 是什么 / 为什么</Heading3>
    <Paragraph>
      <InlineCode>UNIQUE</InlineCode> 约束保证<Text bold>某一列（或几列的组合）的值不能重复</Text>。典型场景：用户名、手机号、身份证号、邮箱——这些字段在业务上天然要求"一人一个，不许撞"。
    </Paragraph>

    <Heading3>3.2 建表时添加唯一约束</Heading3>
    <Paragraph>唯一约束有两种写法，效果一样：</Paragraph>
    <Paragraph>
      <Text bold>写法一（列级，写在列后面）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    列名 数据类型 UNIQUE,
    ...
);`}
    />
    <Paragraph>
      <Text bold>写法二（表级，单独一行，可以起名字）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    列名 数据类型,
    ...,
    CONSTRAINT 约束名 UNIQUE (列名)
);`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 建一个用户演示表，要求用户名 <InlineCode>username</InlineCode> 唯一：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

CREATE TABLE t_user_demo (
    id       INT,
    username VARCHAR(32),
    phone    VARCHAR(20),
    -- 给唯一约束起个名字，方便以后删除；约束名习惯用 uk_ 开头(unique key)
    CONSTRAINT uk_username UNIQUE (username)
);`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected (0.03 sec)`}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：约束起名字是个好习惯。<InlineCode>uk_xxx</InlineCode>（unique key）、<InlineCode>pk_xxx</InlineCode>（primary key）、<InlineCode>fk_xxx</InlineCode>（foreign key）是常见的命名前缀。<Text bold>起了名字，删除时就能精确指定要删哪个。</Text>
    </Callout>

    <Heading3>3.3 唯一约束生效演示</Heading3>
    <Paragraph>插入第一条——成功：</Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_user_demo (id, username, phone) VALUES (1, 'zhangsan', '13800000001');`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.00 sec)`}
    />
    <Paragraph>
      再插入一个<Text bold>相同的</Text> <InlineCode>username</InlineCode>——<Text bold>报错</Text>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_user_demo (id, username, phone) VALUES (2, 'zhangsan', '13800000002');`}
    />
    <CodeBlock
      language="text"
      code={`ERROR 1062 (23000): Duplicate entry 'zhangsan' for key 't_user_demo.uk_username'`}
    />
    <Callout type="note">
      错误信息里 <InlineCode>Duplicate entry 'zhangsan' for key 'uk_username'</InlineCode> 直接告诉你：是 <InlineCode>uk_username</InlineCode> 这个唯一键发现了重复值 <InlineCode>zhangsan</InlineCode>。
    </Callout>

    <Heading3>3.4 重点：UNIQUE 列允许多个 NULL</Heading3>
    <Paragraph>
      这是一个<Text bold>反直觉但极其重要</Text>的知识点：
    </Paragraph>
    <Callout type="note">
      ⭐ <Text bold>唯一约束允许出现多个 <InlineCode>NULL</InlineCode>。</Text>
    </Callout>
    <Paragraph>
      为什么？回到 <InlineCode>NULL</InlineCode> 的本质——它表示"未知"。两个"未知"之间，数据库<Text bold>无法判断它们是否相等</Text>（在 SQL 标准里，<InlineCode>NULL = NULL</InlineCode> 的结果不是 <InlineCode>TRUE</InlineCode>，而是 <InlineCode>NULL</InlineCode>/未知）。既然没法判定它们"相等"，那就<Text bold>不算重复</Text>，于是多个 <InlineCode>NULL</InlineCode> 可以共存。
    </Paragraph>
    <Paragraph>
      <Text bold>演示：</Text> 给 <InlineCode>phone</InlineCode> 也加个唯一约束，然后插入多条 <InlineCode>phone</InlineCode> 为 <InlineCode>NULL</InlineCode> 的数据：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 先给 phone 列追加唯一约束(下一节会专门讲 ALTER 加唯一约束)
ALTER TABLE t_user_demo ADD CONSTRAINT uk_phone UNIQUE (phone);

INSERT INTO t_user_demo (id, username, phone) VALUES (3, 'lisi',  NULL);
INSERT INTO t_user_demo (id, username, phone) VALUES (4, 'wangwu', NULL);`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.00 sec)   -- id=3
Query OK, 1 row affected (0.00 sec)   -- id=4，两个 NULL 都能插进去！`}
    />
    <Paragraph>查询确认：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT * FROM t_user_demo;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'username', 'phone']}
      rows={[
        ['1', 'zhangsan', '13800000001'],
        ['3', 'lisi', 'NULL'],
        ['4', 'wangwu', 'NULL'],
      ]}
    />
    <Callout type="note">
      <Paragraph>
        看到了吗？<InlineCode>id=3</InlineCode> 和 <InlineCode>id=4</InlineCode> 的 <InlineCode>phone</InlineCode> 都是 <InlineCode>NULL</InlineCode>，<Text bold>并不冲突</Text>。
      </Paragraph>
      <Paragraph>
        <Text bold>常见坑</Text>：很多人以为"唯一就是从头到尾不能有两个一样的值"，于是被多个 <InlineCode>NULL</InlineCode> 能共存搞懵。记住口诀：<Text bold>唯一约束只管"有值的"不许重复，对 <InlineCode>NULL</InlineCode> 网开一面。</Text> 如果业务上确实要求"最多一个空都不行"，应该给这列同时加 <InlineCode>NOT NULL</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading3>3.5 建表后添加唯一约束</Heading3>
    <Paragraph>
      <Text bold>语法（两种写法）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 写法一：ALTER ... ADD CONSTRAINT（推荐，能起名字）
ALTER TABLE 表名 ADD CONSTRAINT 约束名 UNIQUE (列名);

-- 写法二：ALTER ... ADD UNIQUE（不起名字，MySQL 自动命名，通常就是列名)
ALTER TABLE 表名 ADD UNIQUE (列名);`}
    />
    <Paragraph>
      上一节我们已经用过写法一给 <InlineCode>phone</InlineCode> 加约束了，这里不再重复。
    </Paragraph>

    <Heading3>3.6 删除唯一约束（重点：用 DROP INDEX）</Heading3>
    <Callout type="warning">
      <Text bold>注意（本节最大的坑）：删除唯一约束，用的是 <InlineCode>DROP INDEX</InlineCode>，不是 <InlineCode>DROP CONSTRAINT</InlineCode>！</Text>
    </Callout>
    <Paragraph>
      为什么？因为在 MySQL 中，<Text bold>唯一约束在底层是通过"唯一索引（Unique Index）"实现的</Text>。你创建一个 <InlineCode>UNIQUE</InlineCode> 约束，MySQL 实际上是建了一个唯一索引。所以删除它，本质是删除这个索引。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE 表名 DROP INDEX 约束名/索引名;`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 删除 <InlineCode>username</InlineCode> 上的唯一约束（它的名字是我们建表时起的 <InlineCode>uk_username</InlineCode>）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE t_user_demo DROP INDEX uk_username;`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0`}
    />
    <Paragraph>
      删除后，再插入重复的 <InlineCode>username</InlineCode> 就不会报错了：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_user_demo (id, username, phone) VALUES (5, 'lisi', '13800000005');
-- 此时已有 id=3 的 lisi，因为约束已删，这条也能成功`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.00 sec)`}
    />
    <Callout type="tip">
      <Paragraph>
        <Text bold>提示：如果不记得约束 / 索引的名字怎么办？</Text> 用下面这条命令查看一张表上的所有索引：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`SHOW INDEX FROM t_user_demo;`}
      />
      <Paragraph>
        在结果中 <InlineCode>Key_name</InlineCode> 列就是索引名（也就是删除时要写的名字）；<InlineCode>Non_unique</InlineCode> 为 <InlineCode>0</InlineCode> 表示这是唯一索引。
      </Paragraph>
      <Paragraph>
        <Text bold>常见坑</Text>：如果你建唯一约束时<Text bold>没起名字</Text>（用了 <InlineCode>ADD UNIQUE (phone)</InlineCode>），MySQL 会用<Text bold>列名</Text>作为索引名（这里就是 <InlineCode>phone</InlineCode>）。如果一列上有多个索引，第二个会自动加后缀变成 <InlineCode>phone_2</InlineCode>。删除前用 <InlineCode>SHOW INDEX</InlineCode> 确认名字最稳妥。
      </Paragraph>
    </Callout>
    <Paragraph>清理演示表：</Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP TABLE t_user_demo;`}
    />

    <Divider />

    <Subtitle>4. 主键约束 PRIMARY KEY</Subtitle>

    <Heading3>4.1 是什么 / 为什么</Heading3>
    <Paragraph>
      主键（Primary Key）是一张表的<Text bold>"行的唯一标识"</Text>——就像每个人的身份证号，靠它能精确、唯一地定位到表中的某一行。
    </Paragraph>
    <Paragraph>主键有三条铁律：</Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>非空</Text>（<InlineCode>NOT NULL</InlineCode>）：主键列不能有 <InlineCode>NULL</InlineCode>（因为"未知"的东西没法当身份标识）。
      </ListItem>
      <ListItem>
        <Text bold>唯一</Text>（<InlineCode>UNIQUE</InlineCode>）：主键值不能重复（否则定位不到唯一一行）。
      </ListItem>
      <ListItem>
        <Text bold>一张表只能有一个主键</Text>（但一个主键可以由多列组成，叫"联合主键"）。
      </ListItem>
    </OrderedList>
    <Callout type="tip">
      <Text bold>提示</Text>：你可以把主键理解为 <InlineCode>NOT NULL</InlineCode> + <InlineCode>UNIQUE</InlineCode> 的"合体加强版"，再加上"一表一个"的限制。所以主键列<Text bold>天然就是非空且唯一的</Text>，不用再额外加这两个约束。
    </Callout>

    <Heading3>4.2 建表时添加主键</Heading3>
    <Paragraph>
      <Text bold>写法一（列级）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    列名 数据类型 PRIMARY KEY,
    ...
);`}
    />
    <Paragraph>
      <Text bold>写法二（表级，可起名 / 可做联合主键）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    列名 数据类型,
    ...,
    PRIMARY KEY (列名)            -- 联合主键就写 PRIMARY KEY (列1, 列2)
);`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 这正是我们公共示例库里 <InlineCode>dept</InlineCode> 表的雏形，先用列级写法建一个简化版演示：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

CREATE TABLE t_demo (
    id        INT PRIMARY KEY,   -- id 作为主键：非空且唯一
    dept_name VARCHAR(20)
);

DESC t_demo;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['Field', 'Type', 'Null', 'Key', 'Default', 'Extra']}
      rows={[
        ['id', 'int', 'NO', 'PRI', 'NULL', ''],
        ['dept_name', 'varchar(20)', 'YES', '', 'NULL', ''],
      ]}
    />
    <Callout type="note">
      <InlineCode>Key</InlineCode> 列出现 <InlineCode>PRI</InlineCode>（primary），同时 <InlineCode>Null</InlineCode> 自动变成了 <InlineCode>NO</InlineCode>——这印证了"主键自带非空"。
    </Callout>

    <Heading3>4.3 主键生效演示</Heading3>
    <Paragraph>插入正常数据：</Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_demo (id, dept_name) VALUES (1, '研发部');`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.00 sec)`}
    />
    <Paragraph>
      插入<Text bold>重复主键</Text>——报错（违反唯一性）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_demo (id, dept_name) VALUES (1, '市场部');`}
    />
    <CodeBlock
      language="text"
      code={`ERROR 1062 (23000): Duplicate entry '1' for key 't_demo.PRIMARY'`}
    />
    <Paragraph>
      插入 <Text bold>主键为 NULL</Text>——报错（违反非空性）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_demo (id, dept_name) VALUES (NULL, '财务部');`}
    />
    <CodeBlock
      language="text"
      code={`ERROR 1048 (23000): Column 'id' cannot be null`}
    />
    <Callout type="note">
      注意主键的索引名固定叫 <InlineCode>PRIMARY</InlineCode>（错误信息里 <InlineCode>for key 't_demo.PRIMARY'</InlineCode>）。
    </Callout>

    <Heading3>4.4 建表后添加 / 删除主键</Heading3>
    <Paragraph>
      <Text bold>添加主键的语法：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE 表名 ADD PRIMARY KEY (列名);`}
    />
    <Paragraph>
      <Text bold>删除主键的语法（主键只有一个，所以不用指定名字）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE 表名 DROP PRIMARY KEY;`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 先建一个没有主键的表，再用 <InlineCode>ALTER</InlineCode> 加上、删掉：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 1) 建一个无主键的表
CREATE TABLE t_demo2 (
    id   INT,
    name VARCHAR(20)
);

-- 2) 后期补上主键
ALTER TABLE t_demo2 ADD PRIMARY KEY (id);`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected (0.03 sec)`}
    />
    <CodeBlock
      language="sql"
      code={`-- 3) 删除主键
ALTER TABLE t_demo2 DROP PRIMARY KEY;`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected (0.02 sec)`}
    />
    <Callout type="danger">
      <Paragraph>
        <Text bold>常见坑 1</Text>：如果一张表的主键列同时带有 <InlineCode>AUTO_INCREMENT</InlineCode>（自增），那么<Text bold>不能直接 <InlineCode>DROP PRIMARY KEY</InlineCode></Text>，会报错：
      </Paragraph>
      <CodeBlock
        language="text"
        code={`ERROR 1075 (42000): Incorrect table definition; there can be only one auto column and it must be defined as a key`}
      />
      <Paragraph>
        因为 MySQL 规定"自增列必须是键"。要先用 <InlineCode>MODIFY</InlineCode> 去掉 <InlineCode>AUTO_INCREMENT</InlineCode>，再删主键。
      </Paragraph>
      <Paragraph>
        <Text bold>常见坑 2</Text>：用 <InlineCode>ALTER TABLE ... ADD PRIMARY KEY (id)</InlineCode> 添加主键时，如果 <InlineCode>id</InlineCode> 列<Text bold>已有重复值或 NULL</Text>，会失败。必须先把数据清理干净。
      </Paragraph>
    </Callout>
    <Paragraph>清理：</Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP TABLE t_demo, t_demo2;`}
    />

    <Divider />

    <Subtitle>5. 主键自动增长 AUTO_INCREMENT</Subtitle>

    <Heading3>5.1 是什么 / 为什么</Heading3>
    <Paragraph>
      每张表都需要主键，但每次插入时手动想一个"不重复的 id"太麻烦了。<InlineCode>AUTO_INCREMENT</InlineCode>（自动增长）就是让数据库<Text bold>自动帮我们生成一个不断递增的整数主键</Text>——就像取号机，每来一个新客户就吐一个比上一个大 1 的号码。
    </Paragraph>
    <Callout type="warning">
      <Text bold>注意</Text>：<InlineCode>AUTO_INCREMENT</InlineCode> 必须用在<Text bold>整数类型</Text>的列上，并且这一列<Text bold>必须是键</Text>（通常就是主键）。它几乎总是和 <InlineCode>PRIMARY KEY</InlineCode> 搭配出现。
    </Callout>

    <Heading3>5.2 基本用法</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ...
);`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 这就是我们公共示例库标准的 <InlineCode>dept</InlineCode> 表！现在正式建出来：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

-- 如果之前练习时建过，先删掉重来（保证干净）
DROP TABLE IF EXISTS emp;     -- emp 引用了 dept，必须先删 emp(后面外键章节会讲原因)
DROP TABLE IF EXISTS dept;

CREATE TABLE dept (
    id        INT PRIMARY KEY AUTO_INCREMENT,   -- 部门编号，自增主键
    dept_name VARCHAR(20),                        -- 部门名称
    loc       VARCHAR(20)                         -- 所在城市
);`}
    />
    <Paragraph>
      插入时<Text bold>省略主键</Text>（或写 <InlineCode>NULL</InlineCode> / <InlineCode>DEFAULT</InlineCode>），让它自动生成：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO dept (dept_name, loc) VALUES
    ('研发部', '北京'),
    ('市场部', '上海'),
    ('财务部', '广州');

SELECT * FROM dept;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'dept_name', 'loc']}
      rows={[
        ['1', '研发部', '北京'],
        ['2', '市场部', '上海'],
        ['3', '财务部', '广州'],
      ]}
    />
    <Callout type="note">
      我们没填 <InlineCode>id</InlineCode>，MySQL 自动从 <Text bold>1 开始</Text>，依次给了 1、2、3。
    </Callout>

    <Heading3>5.3 重点：删除行不会"回填"空缺</Heading3>
    <Callout type="note">
      ⭐ <Text bold>自增值只增不减。删掉中间的行，腾出来的号也不会被重新用。</Text>
    </Callout>
    <Paragraph>
      <Text bold>演示：</Text> 删掉 <InlineCode>id=3</InlineCode> 的部门，再插入一条新部门：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DELETE FROM dept WHERE id = 3;          -- 删掉财务部(id=3)

INSERT INTO dept (dept_name, loc) VALUES ('人事部', '深圳');

SELECT * FROM dept;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'dept_name', 'loc']}
      rows={[
        ['1', '研发部', '北京'],
        ['2', '市场部', '上海'],
        ['4', '人事部', '深圳'],
      ]}
    />
    <Callout type="note">
      新插入的"人事部"拿到的是 <Text bold>4，而不是 3</Text>！数据库内部维护了一个"下一个自增值"的计数器，删除行<Text bold>不会让它回退</Text>。这保证了主键的"永不重复"，但也意味着 <Text bold>id 可能不连续</Text>——这是正常现象，不要试图去"补洞"。
    </Callout>
    <Callout type="danger">
      <Paragraph>
        <Text bold>常见坑：<InlineCode>TRUNCATE</InlineCode> 会重置计数器，<InlineCode>DELETE</InlineCode> 不会。</Text>
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <InlineCode>DELETE FROM dept;</InlineCode>（删所有行）后再插入，自增值<Text bold>接着之前的最大值往后排</Text>。
        </ListItem>
        <ListItem>
          <InlineCode>TRUNCATE TABLE dept;</InlineCode>（清空表）后再插入，自增值<Text bold>重新从 1 开始</Text>。
        </ListItem>
      </UnorderedList>
      <Paragraph>把上面这张表恢复成标准的三个部门（删掉演示加的人事部，并手动补回财务部）：</Paragraph>
      <CodeBlock
        language="sql"
        code={`DELETE FROM dept WHERE id = 4;                          -- 删掉演示的人事部
INSERT INTO dept (id, dept_name, loc) VALUES (3, '财务部', '广州');  -- 显式指定 id=3 补回`}
      />
      <Paragraph>
        是的，你<Text bold>可以手动指定自增列的值</Text>（显式写 <InlineCode>id</InlineCode>），MySQL 会接受；并且如果你指定的值比当前计数器还大，计数器还会"跳"到这个值之后。
      </Paragraph>
    </Callout>

    <Heading3>5.4 指定自增的起始值</Heading3>
    <Paragraph>默认从 1 开始。如果想从别的值开始（比如订单号从 10000 起），有两种方式：</Paragraph>
    <Paragraph>
      <Text bold>方式一：建表时用表选项 <InlineCode>AUTO_INCREMENT=</InlineCode>：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE t_order_demo (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50)
) AUTO_INCREMENT = 10000;          -- 起始值设为 10000

INSERT INTO t_order_demo (title) VALUES ('第一笔订单');
SELECT * FROM t_order_demo;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'title']}
      rows={[['10000', '第一笔订单']]}
    />
    <Paragraph>
      <Text bold>方式二：建表后用 <InlineCode>ALTER</InlineCode> 修改起始值：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE t_order_demo AUTO_INCREMENT = 20000;
INSERT INTO t_order_demo (title) VALUES ('又一笔订单');
SELECT * FROM t_order_demo;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'title']}
      rows={[
        ['10000', '第一笔订单'],
        ['20000', '又一笔订单'],
      ]}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：<InlineCode>ALTER TABLE ... AUTO_INCREMENT = N</InlineCode> 只能把计数器<Text bold>往大调</Text>，不能调到比当前已有最大值还小的数（否则 MySQL 会自动忽略，仍从安全值继续）。
    </Callout>
    <Paragraph>清理：</Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP TABLE t_order_demo;`}
    />

    <Heading3>5.5 与 JDBC 的联系（拓展）</Heading3>
    <Paragraph>
      实际开发中，自增主键插入后，我们常常需要<Text bold>拿到刚生成的那个 id</Text>（比如插入订单后要把订单明细关联上去）。在 JDBC 里可以这样取回：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`String sql = "INSERT INTO dept (dept_name, loc) VALUES (?, ?)";
// 关键：第二个参数告诉驱动"我要拿回自动生成的主键"
try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, "测试部");
    ps.setString(2, "杭州");
    ps.executeUpdate();

    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (keys.next()) {
            long newId = keys.getLong(1);   // 这就是数据库自动生成的 id
            System.out.println("新部门的 id = " + newId);
        }
    }
}`}
    />
    <Callout type="tip">
      这段代码会在后续 JDBC 章节详细展开，这里先建立"自增主键 ↔ <InlineCode>getGeneratedKeys()</InlineCode>"的印象即可。
    </Callout>
  </article>
);

export default index;
