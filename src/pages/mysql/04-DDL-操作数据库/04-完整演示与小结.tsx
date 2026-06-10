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
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>完整演示与本章小结</Title>

    <Subtitle>7. 完整演示：创建并使用贯穿全套教程的 db_learn 库</Subtitle>
    <Paragraph>
      现在把本章学到的东西串起来，<Text bold>亲手把后续所有章节都要用的 db_learn 库准备好</Text>
      。请跟着敲一遍，建立肌肉记忆。
    </Paragraph>

    <Heading3>7.1 一步步来</Heading3>
    <Paragraph>
      <Text bold>第 1 步：先看看现在有哪些库（确认 db_learn 还不存在）</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW DATABASES;`}
    />
    <Paragraph>
      <Text bold>第 2 步：安全地创建 db_learn，并指定 utf8mb4 字符集</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE IF NOT EXISTS db_learn CHARACTER SET utf8mb4;`}
    />
    <Paragraph>执行结果：</Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.01 sec)`}
    />
    <Paragraph>
      <Text bold>第 3 步：验证创建结果与字符集</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW CREATE DATABASE db_learn;`}
    />
    <Paragraph>执行结果：</Paragraph>
    <CodeBlock
      language="text"
      code={`+----------+-----------------------------------------------------------------------------------------------------------+
| Database | Create Database                                                                                          |
+----------+-----------------------------------------------------------------------------------------------------------+
| db_learn | CREATE DATABASE \`db_learn\` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ ...        |
+----------+-----------------------------------------------------------------------------------------------------------+`}
    />
    <Paragraph>
      确认是 <InlineCode>utf8mb4</InlineCode>，放心。
    </Paragraph>
    <Paragraph>
      <Text bold>第 4 步：切换进 db_learn 库</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;`}
    />
    <Paragraph>执行结果：</Paragraph>
    <CodeBlock
      language="text"
      code={`Database changed`}
    />
    <Paragraph>
      <Text bold>第 5 步：确认"我现在在 db_learn 里"</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT DATABASE();`}
    />
    <Paragraph>执行结果：</Paragraph>
    <CodeBlock
      language="text"
      code={`+----------+
| DATABASE() |
+----------+
| db_learn |
+----------+`}
    />
    <Paragraph>
      到这里，房间已经盖好、人也走进去了。下一章我们就在这个 <InlineCode>db_learn</InlineCode>{' '}
      里创建贯穿全套教程的两张核心表 <InlineCode>dept</InlineCode>（部门）和{' '}
      <InlineCode>emp</InlineCode>（员工）。
    </Paragraph>

    <Heading3>7.2 可复用的初始化脚本（推荐写法）</Heading3>
    <Paragraph>
      把上面的关键步骤整理成一个<Text bold>幂等脚本</Text>，存成{' '}
      <InlineCode>init_db_learn.sql</InlineCode>，将来重建环境时直接执行即可：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- init_db_learn.sql：初始化教学库 db_learn
-- 1) 如已存在则先删除（谨慎：会清空旧数据！仅在"重建测试环境"时使用）
DROP DATABASE IF EXISTS db_learn;

-- 2) 重新创建，显式指定 utf8mb4，保证中文/emoji 不乱码
CREATE DATABASE db_learn CHARACTER SET utf8mb4;

-- 3) 进入该库，后续建表语句都作用在它身上
USE db_learn;

-- （下一章会在这里继续追加 CREATE TABLE dept / emp ...）`}
    />
    <Paragraph>在命令行里执行脚本文件的方式：</Paragraph>
    <CodeBlock
      language="bash"
      code={`# 方式一：登录后用 source 命令执行
mysql -u root -p
mysql> source D:/sql/init_db_learn.sql;

# 方式二：在系统终端里直接重定向执行
mysql -u root -p < D:/sql/init_db_learn.sql`}
    />
    <Callout type="warning" title="注意">
      脚本第 1 行的 <InlineCode>DROP DATABASE IF EXISTS db_learn;</InlineCode> 会
      <Text bold>清空 db_learn 里已有的一切</Text>
      。在学习/测试阶段这很方便（保证每次都是干净环境），但
      <Text bold>绝不要把这种"先删后建"的脚本对着有真实数据的库执行</Text>。
    </Callout>

    <Divider />

    <Subtitle>8. 本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>DDL</Text> 是"数据定义语言"，负责管理库/表/列这些<Text bold>结构</Text>；本章聚焦"操作数据库"这一层，套路就是{' '}
        <Text bold>增（CREATE）、查（SHOW）、改（ALTER）、删（DROP）、用（USE）</Text>。
      </ListItem>
      <ListItem>
        <Text bold>创建</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>CREATE DATABASE 名;</InlineCode> 最基础。
          </ListItem>
          <ListItem>
            <InlineCode>CREATE DATABASE IF NOT EXISTS 名;</InlineCode> 防止"已存在"报错，
            <Text bold>脚本里强烈推荐</Text>。
          </ListItem>
          <ListItem>
            <InlineCode>CREATE DATABASE 名 CHARACTER SET utf8mb4;</InlineCode> 指定字符集；
            <Text bold>新库一律用 utf8mb4，别用残缺的 utf8</Text>。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>查询</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>SHOW DATABASES;</InlineCode> 看所有库（注意四个系统库别乱动）。
          </ListItem>
          <ListItem>
            <InlineCode>SHOW CREATE DATABASE 名;</InlineCode> 看某库的完整定义和字符集，是排查乱码的第一步。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>修改</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>ALTER DATABASE 名 CHARACTER SET utf8mb4;</InlineCode> 实际几乎只用来改字符集；
            <Text bold>MySQL 不支持直接改库名</Text>，建库前就把名字想好。
          </ListItem>
          <ListItem>
            改库字符集只影响"以后新建的表"，<Text bold>不会自动转换已有表/列</Text>。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>删除</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>DROP DATABASE 名;</InlineCode> / <InlineCode>DROP DATABASE IF EXISTS 名;</InlineCode>。
          </ListItem>
          <ListItem>
            <Text bold>极度危险、不可恢复</Text>，删前确认环境、确认库名、做好备份。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>使用</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>USE 名;</InlineCode> 切换当前库；也可以用 <InlineCode>库名.表名</InlineCode> 全限定跨库操作。
          </ListItem>
          <ListItem>
            <InlineCode>SELECT DATABASE();</InlineCode> 查看当前所在库，返回 <InlineCode>NULL</InlineCode> 表示还没选库。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        我们已经亲手建好了贯穿全套教程的 <Text bold>db_learn</Text> 库，下一章正式建表。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>9. 常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>Q1：utf8 和 utf8mb4 有什么区别？该用哪个？</Text>
    </Paragraph>
    <Paragraph>
      A：MySQL 的 <InlineCode>utf8</InlineCode>（即 <InlineCode>utf8mb3</InlineCode>）每字符最多 3
      字节，存不了 emoji 和部分生僻字；<InlineCode>utf8mb4</InlineCode> 最多 4 字节，完整支持。
      <Text bold>一律用 utf8mb4</Text>。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q2：CREATE DATABASE IF NOT EXISTS 加了 IF NOT EXISTS，当库已存在时是"覆盖"还是"跳过"？
      </Text>
    </Paragraph>
    <Paragraph>
      A：是<Text bold>跳过</Text>——什么都不做、不报错、不影响已有数据，只给一个警告。它绝不会覆盖或清空原库。
    </Paragraph>
    <Paragraph>
      <Text bold>Q3：怎么查看一个数据库用的是什么字符集？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>SHOW CREATE DATABASE 库名;</InlineCode>，看返回里的{' '}
      <InlineCode>DEFAULT CHARACTER SET</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q4：MySQL 怎么给数据库改名？</Text>
    </Paragraph>
    <Paragraph>
      A：<Text bold>没有直接命令</Text>（没有 <InlineCode>RENAME DATABASE</InlineCode>
      ）。标准做法是新建目标库 → 迁移所有表 → 删除旧库。所以建库时就要把名字定好。
    </Paragraph>
    <Paragraph>
      <Text bold>Q5：ALTER DATABASE db CHARACTER SET utf8mb4; 之后，库里老表的乱码就解决了吗？</Text>
    </Paragraph>
    <Paragraph>
      A：<Text bold>不一定</Text>。它只改库的默认字符集，对<Text bold>已存在的表和列不生效</Text>；老表要单独{' '}
      <InlineCode>ALTER TABLE ... CONVERT TO CHARACTER SET utf8mb4;</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q6：DROP DATABASE 删错了能恢复吗？</Text>
    </Paragraph>
    <Paragraph>
      A：<Text bold>不能</Text>靠数据库自身恢复，没有回收站。唯一出路是从<Text bold>备份</Text>还原。所以删库前务必确认环境、库名，并提前备份。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：执行了 SELECT DATABASE(); 返回 NULL 是出错了吗？</Text>
    </Paragraph>
    <Paragraph>
      A：不是错误，表示当前会话<Text bold>还没有用 USE 选定任何库</Text>。此时不带库名的表操作会报{' '}
      <InlineCode>No database selected</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q8：SHOW DATABASES; 里那些 information_schema、mysql、sys 是什么，能删吗？</Text>
    </Paragraph>
    <Paragraph>
      A：是 MySQL 自带的<Text bold>系统库</Text>，存元数据、权限、性能信息等，是数据库正常运行所必需的，
      <Text bold>绝对不能删/改</Text>。
    </Paragraph>
  </article>
);

export default index;
