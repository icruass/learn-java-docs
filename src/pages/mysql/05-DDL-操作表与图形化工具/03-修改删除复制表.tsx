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
    <Title>修改、删除与复制表</Title>

    <Subtitle>5. 删除表 <InlineCode>DROP TABLE</InlineCode></Subtitle>

    <Heading3>5.1 基本语法</Heading3>
    <CodeBlock language="sql" code={`DROP TABLE 表名;`} />
    <Paragraph>
      这会<Text bold>连表结构带表里所有数据一起彻底删除</Text>，不可恢复（没开 binlog 备份的话）。
    </Paragraph>
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`DROP TABLE demo_int;`} />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <CodeBlock language="text" code={`Query OK, 0 rows affected (0.02 sec)`} />

    <Heading3>5.2 安全删除：<InlineCode>IF EXISTS</InlineCode></Heading3>
    <Paragraph>
      如果要删的表<Text bold>不存在</Text>，<InlineCode>DROP TABLE 表名;</InlineCode> 会报错：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP TABLE not_exist_table;
-- ERROR 1051 (42S02): Unknown table 'db_learn.not_exist_table'`}
    />
    <Paragraph>
      加上 <InlineCode>IF EXISTS</InlineCode>，「存在才删，不存在就跳过」，不会报错——这在写
      <Text bold>可重复执行的脚本</Text>时几乎是标配：
    </Paragraph>
    <CodeBlock language="sql" code={`DROP TABLE IF EXISTS not_exist_table;`} />
    <Paragraph>
      <Text bold>结果（不存在时）：</Text>
    </Paragraph>
    <CodeBlock language="text" code={`Query OK, 0 rows affected, 1 warning (0.00 sec)`} />
    <Paragraph>只给一个 warning，不报错。常见的「初始化脚本」开头都会这样写：</Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP TABLE IF EXISTS emp;
DROP TABLE IF EXISTS dept;
CREATE TABLE dept (...);
CREATE TABLE emp (...);`}
    />
    <Callout type="warning">
      <Text bold>注意：删除顺序受外键约束</Text>。<InlineCode>emp</InlineCode> 通过外键依赖{' '}
      <InlineCode>dept</InlineCode>，如果先删 <InlineCode>dept</InlineCode>，会报{' '}
      <InlineCode>ERROR 3730 ... Cannot drop table 'dept' referenced by a foreign key constraint</InlineCode>
      。所以<Text bold>要先删「引用方」<InlineCode>emp</InlineCode>，再删「被引用方」<InlineCode>dept</InlineCode></Text>
      （和建表顺序正好相反）。
    </Callout>
    <Callout type="danger">
      <Paragraph>
        <Text bold>常见坑：<InlineCode>DROP</InlineCode> vs <InlineCode>DELETE</InlineCode> vs{' '}
        <InlineCode>TRUNCATE</InlineCode> 别搞混</Text>：
      </Paragraph>
      <Table
        head={['命令', '类别', '作用', '表结构', '能否带 WHERE', '速度']}
        rows={[
          ['DROP TABLE emp', 'DDL', '删表（结构+数据全没）', '没了', '否', '快'],
          ['TRUNCATE TABLE emp', 'DDL', '清空所有数据，保留空表', '保留', '否', '很快'],
          ['DELETE FROM emp', 'DML', '删数据（可按条件）', '保留', '可以', '较慢（逐行）'],
        ]}
      />
      <Paragraph>
        想「只清数据、保留表」用 <InlineCode>TRUNCATE</InlineCode>；想「按条件删部分数据」用{' '}
        <InlineCode>DELETE ... WHERE</InlineCode>；想「连表都不要了」才用 <InlineCode>DROP</InlineCode>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>6. 修改表 <InlineCode>ALTER TABLE</InlineCode></Subtitle>
    <Paragraph>
      表建好后，业务变化常常要改它：改名、加字段、改字段类型、删字段。统一用 <InlineCode>ALTER TABLE</InlineCode>
      。下面逐个讲，<Text bold>为了不破坏后续章节用的 <InlineCode>emp</InlineCode>/<InlineCode>dept</InlineCode>
      ，演示尽量用临时表或在演示后改回来</Text>。
    </Paragraph>
    <Paragraph>先准备一张演示用的临时表：</Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE student (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20)
);`}
    />

    <Heading3>6.1 修改表名：<InlineCode>RENAME TO</InlineCode></Heading3>
    <Paragraph>
      <Text bold>语法：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`ALTER TABLE 表名 RENAME TO 新表名;`} />
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE student RENAME TO stu;   -- 把 student 改名为 stu
SHOW TABLES;                          -- 验证：现在叫 stu 了
ALTER TABLE stu RENAME TO student;   -- 演示完改回来，便于后面继续用`}
    />
    <Callout type="tip">
      也可以写 <InlineCode>RENAME TABLE student TO stu;</InlineCode>（去掉 <InlineCode>ALTER ...</InlineCode>
      ），效果一样，而且 <InlineCode>RENAME TABLE</InlineCode> 还支持一次改多张表。
    </Callout>

    <Heading3>6.2 修改表的字符集</Heading3>
    <Paragraph>
      <Text bold>语法：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`ALTER TABLE 表名 CHARACTER SET 字符集名;`} />
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 假设有张老表是 utf8（3 字节，不支持 emoji），改成 utf8mb4（4 字节，支持 emoji）
ALTER TABLE student CHARACTER SET utf8mb4;

-- 验证
SHOW CREATE TABLE student;
-- 末尾可见 DEFAULT CHARSET=utf8mb4`}
    />
    <Callout type="tip">
      <Paragraph>
        <Text bold>提示</Text>：<InlineCode>utf8</InlineCode> 在 MySQL 里其实是「阉割版」（最多 3
        字节，存不了 emoji 😀 这类 4 字节字符），现代项目一律用 <InlineCode>utf8mb4</InlineCode>
        。注意：改表的默认字符集只影响<Text bold>之后新增的列</Text>，已有列若也要改，需要用{' '}
        <InlineCode>CONVERT TO CHARACTER SET</InlineCode>：
      </Paragraph>
      <CodeBlock language="sql" code={`ALTER TABLE student CONVERT TO CHARACTER SET utf8mb4;`} />
    </Callout>

    <Heading3>6.3 添加列：<InlineCode>ADD</InlineCode></Heading3>
    <Paragraph>
      <Text bold>语法：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`ALTER TABLE 表名 ADD 列名 数据类型 [约束];`} />
    <Paragraph>
      <Text bold>示例——给 <InlineCode>student</InlineCode> 加一个「年龄」列：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE student ADD age INT;
DESC student;`}
    />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <Table
      head={['Field', 'Type', 'Null', 'Key', 'Default', 'Extra']}
      rows={[
        ['id', 'int', 'NO', 'PRI', 'NULL', 'auto_increment'],
        ['name', 'varchar(20)', 'YES', '', 'NULL', ''],
        ['age', 'int', 'YES', '', 'NULL', ''],
      ]}
    />
    <Callout type="tip">
      <Paragraph>
        新增列默认加在<Text bold>最后</Text>。想控制位置可用 <InlineCode>AFTER 某列</InlineCode> 或{' '}
        <InlineCode>FIRST</InlineCode>：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`ALTER TABLE student ADD email VARCHAR(50) AFTER name;  -- 加在 name 之后
ALTER TABLE student ADD no INT FIRST;                  -- 加在最前面`}
      />
    </Callout>

    <Heading3>6.4 修改列名 + 类型：<InlineCode>CHANGE</InlineCode></Heading3>
    <Paragraph>
      <InlineCode>CHANGE</InlineCode> 能<Text bold>同时改列名和类型</Text>
      ，所以它需要你写两个列名：旧的和新的。
    </Paragraph>
    <Paragraph>
      <Text bold>语法：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`ALTER TABLE 表名 CHANGE 旧列名 新列名 新数据类型 [约束];`} />
    <Paragraph>
      <Text bold>示例——把 <InlineCode>age</InlineCode>（INT）改名成 <InlineCode>student_age</InlineCode>{' '}
      并改类型为 <InlineCode>TINYINT</InlineCode>：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE student CHANGE age student_age TINYINT;
DESC student;`}
    />
    <Paragraph>
      <Text bold>结果（节选）：</Text>
    </Paragraph>
    <Table
      head={['Field', 'Type']}
      rows={[['student_age', 'tinyint']]}
    />
    <Callout type="warning">
      <Text bold>注意</Text>：<InlineCode>CHANGE</InlineCode> 后面要写<Text bold>两次列名</Text>
      （即使你只想改类型不改名，也得把旧名重复写一遍）。如果只想改类型、不想重复写列名，请用下面的{' '}
      <InlineCode>MODIFY</InlineCode>。
    </Callout>

    <Heading3>6.5 只改类型（不改列名）：<InlineCode>MODIFY</InlineCode></Heading3>
    <Paragraph>
      <Text bold>语法：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`ALTER TABLE 表名 MODIFY 列名 新数据类型 [约束];`} />
    <Paragraph>
      <Text bold>示例——把 <InlineCode>student_age</InlineCode> 的类型从 <InlineCode>TINYINT</InlineCode>{' '}
      改回 <InlineCode>INT</InlineCode>：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE student MODIFY student_age INT;
DESC student;`}
    />
    <Paragraph>
      <Text bold>结果（节选）：</Text>
    </Paragraph>
    <Table
      head={['Field', 'Type']}
      rows={[['student_age', 'int']]}
    />
    <Paragraph>
      <Text bold><InlineCode>CHANGE</InlineCode> 与 <InlineCode>MODIFY</InlineCode> 对比记忆：</Text>
    </Paragraph>
    <Table
      head={['关键字', '能改列名', '能改类型', '语法里写几个列名']}
      rows={[
        ['CHANGE', '✅', '✅', '2 个（旧名 + 新名）'],
        ['MODIFY', '❌', '✅', '1 个'],
      ]}
    />
    <Callout type="danger">
      <Text bold>常见坑：改类型可能丢数据</Text>。如果列里已经有数据，把 <InlineCode>VARCHAR(20)</InlineCode>{' '}
      改成 <InlineCode>VARCHAR(5)</InlineCode>，或把 <InlineCode>INT</InlineCode> 改成{' '}
      <InlineCode>TINYINT</InlineCode> 时，<Text bold>超出新类型范围的数据会被截断或报错</Text>
      。改类型前务必确认现有数据都能放进新类型。
    </Callout>

    <Heading3>6.6 删除列：<InlineCode>DROP</InlineCode></Heading3>
    <Paragraph>
      <Text bold>语法：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`ALTER TABLE 表名 DROP 列名;`} />
    <Paragraph>
      <Text bold>示例——删掉 <InlineCode>student_age</InlineCode> 列：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE student DROP student_age;
DESC student;`}
    />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <Table
      head={['Field', 'Type', 'Null', 'Key', 'Default', 'Extra']}
      rows={[
        ['id', 'int', 'NO', 'PRI', 'NULL', 'auto_increment'],
        ['name', 'varchar(20)', 'YES', '', 'NULL', ''],
        ['email', 'varchar(50)', 'YES', '', 'NULL', ''],
      ]}
    />
    <Callout type="warning">
      注意区分：<InlineCode>ALTER TABLE 表名 DROP 列名;</InlineCode>（删一个<Text bold>列</Text>） 和{' '}
      <InlineCode>DROP TABLE 表名;</InlineCode>（删整张<Text bold>表</Text>）。前者有 <InlineCode>ALTER</InlineCode>
      ，后者没有。少写一个 <InlineCode>ALTER</InlineCode>，后果天差地别。
    </Callout>

    <Heading3>6.7 <InlineCode>ALTER TABLE</InlineCode> 子命令小结表</Heading3>
    <Table
      head={['目的', '语法']}
      rows={[
        ['改表名', 'ALTER TABLE 表名 RENAME TO 新名;'],
        ['改字符集', 'ALTER TABLE 表名 CHARACTER SET 字符集;'],
        ['加列', 'ALTER TABLE 表名 ADD 列名 类型;'],
        ['改列名+类型', 'ALTER TABLE 表名 CHANGE 旧列名 新列名 新类型;'],
        ['只改类型', 'ALTER TABLE 表名 MODIFY 列名 新类型;'],
        ['删列', 'ALTER TABLE 表名 DROP 列名;'],
      ]}
    />
    <Paragraph>演示用的临时表用完可以删掉：</Paragraph>
    <CodeBlock language="sql" code={`DROP TABLE IF EXISTS student;`} />

    <Divider />

    <Subtitle>7. 复制表结构：<InlineCode>CREATE TABLE ... LIKE ...</InlineCode></Subtitle>
    <Paragraph>
      有时你想要一张<Text bold>和现有表结构一模一样的新表</Text>（同样的列、类型、约束、索引），但
      <Text bold>不要数据</Text>——比如做归档表、临时测试表。这时用 <InlineCode>LIKE</InlineCode> 最快。
    </Paragraph>
    <Paragraph>
      <Text bold>语法：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`CREATE TABLE 新表名 LIKE 旧表名;`} />
    <Paragraph>
      <Text bold>示例——照着 <InlineCode>emp</InlineCode> 复制出一张空的 <InlineCode>emp_bak</InlineCode>（备份表）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE emp_bak LIKE emp;
DESC emp_bak;          -- 结构和 emp 完全一致
SELECT COUNT(*) FROM emp_bak;   -- 但里面没有数据`}
    />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <Paragraph>
      <InlineCode>DESC emp_bak</InlineCode> 输出的结构与 <InlineCode>emp</InlineCode> 完全相同；而：
    </Paragraph>
    <Table
      head={['COUNT(*)']}
      rows={[['0']]}
    />
    <Paragraph>说明结构复制了，数据没复制。</Paragraph>
    <Callout type="tip">
      <Paragraph>
        <Text bold>提示：如果连数据一起要</Text>，用 <InlineCode>CREATE TABLE ... AS SELECT</InlineCode>
        （这条会把查询结果连数据一起灌进新表）：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`CREATE TABLE emp_copy AS SELECT * FROM emp;   -- 结构 + 数据都复制`}
      />
      <Paragraph>
        但要注意：<InlineCode>AS SELECT</InlineCode> 方式<Text bold>不会复制主键、自增、外键、索引等约束</Text>
        （只复制列和数据）。需要严格相同结构就用 <InlineCode>LIKE</InlineCode>；需要带数据再补约束就用{' '}
        <InlineCode>AS SELECT</InlineCode>。
      </Paragraph>
    </Callout>
    <Table
      head={['复制方式', '复制结构', '复制数据', '复制约束/索引']}
      rows={[
        ['CREATE TABLE 新 LIKE 旧', '✅', '❌', '✅'],
        ['CREATE TABLE 新 AS SELECT * FROM 旧', '✅(仅列)', '✅', '❌'],
      ]}
    />
    <Paragraph>用完清理：</Paragraph>
    <CodeBlock language="sql" code={`DROP TABLE IF EXISTS emp_bak;`} />
  </article>
);

export default index;
