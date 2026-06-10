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
    <Title>修改、删除与切换数据库</Title>

    <Subtitle>4. 修改数据库：ALTER DATABASE</Subtitle>

    <Heading3>4.1 能改什么、不能改什么</Heading3>
    <Paragraph>
      对于数据库这个层级，<Text bold>实际中几乎只会去改一件事：默认字符集 / 校对规则</Text>。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        ✅ 可以改：库的<Text bold>默认字符集和校对规则</Text>。
      </ListItem>
      <ListItem>
        ❌ 不建议（也没有直接语法）改：<Text bold>库名</Text>。
      </ListItem>
    </UnorderedList>
    <Callout type="danger" title={"常见坑：MySQL 没有\"重命名数据库\"的命令！"}>
      <Paragraph>
        你不会找到 <InlineCode>RENAME DATABASE</InlineCode>{' '}
        这样的语句（历史上短暂出现过又被移除了，因为很危险）。如果真的要"改库名"，标准做法是：
      </Paragraph>
      <OrderedList>
        <ListItem>新建一个目标名的库；</ListItem>
        <ListItem>
          把所有表迁移过去（如用 <InlineCode>mysqldump</InlineCode> 导出再导入，或逐表{' '}
          <InlineCode>RENAME TABLE 旧库.表 TO 新库.表</InlineCode>）；
        </ListItem>
        <ListItem>删除旧库。</ListItem>
      </OrderedList>
      <Paragraph>
        所以请在<Text bold>建库时就把名字想好</Text>，避免后期折腾。
      </Paragraph>
    </Callout>

    <Heading3>4.2 修改字符集的语法与示例</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER DATABASE 数据库名 CHARACTER SET 字符集名;
-- 可同时改校对规则：
ALTER DATABASE 数据库名 CHARACTER SET 字符集名 COLLATE 校对规则名;`}
    />
    <Paragraph>
      <Text bold>示例（假设有个老库 db_test 当初建成了 latin1，现在改成 utf8mb4）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER DATABASE db_test CHARACTER SET utf8mb4;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.01 sec)`}
    />
    <Paragraph>改完之后再查一下，验证是否生效：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW CREATE DATABASE db_test;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`+---------+---------------------------------------------------------------------------------------------------+
| Database | Create Database                                                                                  |
+---------+---------------------------------------------------------------------------------------------------+
| db_test | CREATE DATABASE \`db_test\` /*!40100 DEFAULT CHARACTER SET utf8mb4 ... */ ...                        |
+---------+---------------------------------------------------------------------------------------------------+`}
    />
    <Paragraph>
      可以看到字符集已经变成 <InlineCode>utf8mb4</InlineCode>。
    </Paragraph>
    <Callout type="warning" title={"注意：ALTER DATABASE 只改\"库的默认字符集\"，不会自动改\"已存在的表和列\"！"}>
      <Paragraph>
        库的字符集只对<Text bold>之后新建的、且没单独指定字符集的表</Text>起"默认值"作用。
        <Text bold>已经存在的表/列仍然保持它们原来的字符集</Text>。如果要把老表也一起转过来，需要对表执行{' '}
        <InlineCode>ALTER TABLE ... CONVERT TO CHARACTER SET utf8mb4;</InlineCode>（这属于"操作表"的内容，下一章会讲）。
      </Paragraph>
      <Paragraph>
        换句话说：<Text bold>改库字符集 ≈ 改"以后新建表的默认模板"，而不是"一键把存量数据全转码"</Text>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>5. 删除数据库：DROP DATABASE</Subtitle>

    <Heading3>5.1 语法与示例</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP DATABASE 数据库名;`}
    />
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP DATABASE db_charset_demo2;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected (0.02 sec)`}
    />
    <Callout type="note">
      <InlineCode>0 rows affected</InlineCode>{' '}
      在这里是正常的，不代表失败——它指的是"受影响的数据行数"，删库这个操作本身成功了。
    </Callout>

    <Heading3>5.2 防止报错：DROP DATABASE IF EXISTS</Heading3>
    <Paragraph>
      如果删一个<Text bold>不存在</Text>的库：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP DATABASE db_not_exist;`}
    />
    <Paragraph>
      <Text bold>执行结果（报错）：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`ERROR 1008 (HY000): Can't drop database 'db_not_exist'; database doesn't exist`}
    />
    <Paragraph>和建库对称，删库也有"安全版"写法：</Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP DATABASE IF EXISTS 数据库名;`}
    />
    <UnorderedList>
      <ListItem>
        <InlineCode>IF EXISTS</InlineCode>：如果库存在才删；不存在就什么都不做、不报错（只给个警告）。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP DATABASE IF EXISTS db_not_exist;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected, 1 warning (0.00 sec)`}
    />
    <Callout type="note">
      <Paragraph>
        同样，这在写脚本时非常有用：保证脚本反复执行都不会因为"库不存在"而中断。常见的"重建脚本"开头就是这两句搭配：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`DROP DATABASE IF EXISTS db_learn;
CREATE DATABASE db_learn CHARACTER SET utf8mb4;`}
      />
    </Callout>

    <Heading3>5.3 ⚠️ 重大警告：DROP 不可恢复！</Heading3>
    <Callout type="warning" title={"⚠️⚠️⚠️ DROP DATABASE 会把这个库以及库里的所有表、所有数据全部物理删除，且没有\"回收站\"、没有\"撤销\"、不可恢复！"}>
      <UnorderedList>
        <ListItem>
          它<Text bold>不会</Text>给你弹二次确认框，回车即生效。
        </ListItem>
        <ListItem>
          一旦执行，唯一的找回方式是从<Text bold>备份</Text>里恢复（如果你有备份的话）。
        </ListItem>
      </UnorderedList>
    </Callout>
    <Callout type="danger" title="常见坑 / 血泪经验：">
      <OrderedList>
        <ListItem>
          <Text bold>删库前务必看清当前连的是哪台服务器</Text>——别在生产环境上敲了本来该在测试环境敲的命令。
        </ListItem>
        <ListItem>
          <Text bold>删之前先想清楚名字有没有打错</Text>——比如想删 <InlineCode>db_test_tmp</InlineCode>{' '}
          结果手滑写成 <InlineCode>db_test</InlineCode>。
        </ListItem>
        <ListItem>
          重要数据在删库前先 <InlineCode>mysqldump</InlineCode> 备份一份。
        </ListItem>
        <ListItem>
          生产环境给账号收紧权限，普通业务账号根本不应该有 <InlineCode>DROP</InlineCode> 权限。
        </ListItem>
      </OrderedList>
      <Paragraph>
        一句话：<Text bold>DROP DATABASE 是本章最危险的命令，敲之前请深呼吸。</Text>
      </Paragraph>
    </Callout>
    <Callout type="tip" title="辨析">
      <Paragraph>
        你可能听过 <InlineCode>DROP</InlineCode>、<InlineCode>TRUNCATE</InlineCode>、
        <InlineCode>DELETE</InlineCode> 三兄弟，这里先打个预防针（细节在后续章节）：
      </Paragraph>
      <Table
        head={['命令', '作用对象', '删什么', '能否恢复']}
        rows={[
          ['DROP DATABASE', '整个库', '库 + 所有表 + 所有数据 + 结构', '否（要靠备份）'],
          ['DROP TABLE', '一张表', '表 + 数据 + 结构', '否'],
          ['TRUNCATE TABLE', '一张表', '只清空数据，保留表结构', '否'],
          ['DELETE FROM 表', '表里的行', '删数据（可带条件）', '在事务中可回滚'],
        ]}
      />
    </Callout>

    <Divider />

    <Subtitle>6. 使用 / 切换数据库：USE 与 SELECT DATABASE()</Subtitle>
    <Paragraph>
      我们已经会建库、查库了。但你有没有发现一个问题：到目前为止我们的操作都是"站在大楼大厅里"对某个房间隔空喊话（每次都写全名）。真正干活（建表、增删数据）时，需要
      <Text bold>先走进某个房间</Text>——这就是 <InlineCode>USE</InlineCode>。
    </Paragraph>

    <Heading3>6.1 切换数据库：USE</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE 数据库名;`}
    />
    <Paragraph>
      <Text bold>示例与执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_test;`}
    />
    <CodeBlock
      language="text"
      code={`Database changed`}
    />
    <Paragraph>
      看到 <InlineCode>Database changed</InlineCode>，就表示你<Text bold>当前的工作上下文</Text>已经切到{' '}
      <InlineCode>db_test</InlineCode> 了。之后你写 <InlineCode>SHOW TABLES;</InlineCode>、
      <InlineCode>SELECT ... FROM emp;</InlineCode> 这种不带库名的语句，MySQL 都默认在{' '}
      <InlineCode>db_test</InlineCode> 这个库里找。
    </Paragraph>
    <Callout type="tip" title={"提示：不切库也能操作表，用\"库名.表名\"全限定"}>
      <Paragraph>
        即使没有 <InlineCode>USE</InlineCode>，你也可以用 <InlineCode>库名.表名</InlineCode>{' '}
        的形式直接操作任意库的表，例如：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`SELECT * FROM db_test.emp;`}
      />
      <Paragraph>
        当你需要<Text bold>跨库</Text>操作，或者懒得切来切去时，这种全限定写法很方便。但日常在固定一个库里干活时，先{' '}
        <InlineCode>USE</InlineCode> 一下更省事。
      </Paragraph>
    </Callout>
    <Callout type="warning" title="注意">
      <Paragraph>
        如果 <InlineCode>USE</InlineCode> 一个不存在的库：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`USE db_xxx;`}
      />
      <CodeBlock
        language="text"
        code={`ERROR 1049 (42000): Unknown database 'db_xxx'`}
      />
      <Paragraph>
        报错 <InlineCode>1049</InlineCode> 表示"未知的数据库"，说明这个库压根不存在（或者名字打错了）。
      </Paragraph>
    </Callout>

    <Heading3>6.2 查看当前正在使用哪个库：SELECT DATABASE()</Heading3>
    <Paragraph>
      切来切去之后，怎么知道"我现在到底在哪个房间"？用内置函数 <InlineCode>DATABASE()</InlineCode>：
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT DATABASE();`}
    />
    <Paragraph>
      <Text bold>示例与执行结果（已经 USE db_test 之后）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT DATABASE();`}
    />
    <CodeBlock
      language="text"
      code={`+------------+
| DATABASE() |
+------------+
| db_test    |
+------------+
1 row in set (0.00 sec)`}
    />
    <Paragraph>
      如果你<Text bold>还没 USE 过任何库</Text>就执行这条语句：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`+------------+
| DATABASE() |
+------------+
| NULL       |
+------------+
1 row in set (0.00 sec)`}
    />
    <Paragraph>
      结果是 <InlineCode>NULL</InlineCode>，表示"当前没有选定任何数据库"。这时若直接写不带库名的{' '}
      <InlineCode>SHOW TABLES;</InlineCode> 会报错{' '}
      <InlineCode>ERROR 1046 (3D000): No database selected</InlineCode>（没有选中数据库）。
    </Paragraph>
    <Callout type="tip" title="提示">
      <Paragraph>
        在命令行里其实还有更直观的提醒——很多客户端（如 MySQL 8 自带 client，配合{' '}
        <InlineCode>prompt</InlineCode> 设置）可以把当前库名显示在提示符上。比如执行：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`prompt \\d> `}
      />
      <Paragraph>
        之后提示符会变成 <InlineCode>db_test&gt;</InlineCode>，一眼就能看到当前库。
      </Paragraph>
    </Callout>
  </article>
);

export default index;
