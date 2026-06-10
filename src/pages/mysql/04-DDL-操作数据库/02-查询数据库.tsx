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
    <Title>查询数据库</Title>
    <Paragraph>
      建完库，我们得有办法"看见"它。查询数据库有两个层次：<Text bold>看全局有哪些库</Text> 和{' '}
      <Text bold>看某个库长什么样</Text>。
    </Paragraph>

    <Heading3>3.1 查看所有数据库：SHOW DATABASES</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW DATABASES;`}
    />
    <Paragraph>
      <Text bold>示例与执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW DATABASES;`}
    />
    <CodeBlock
      language="text"
      code={`+--------------------+
| Database           |
+--------------------+
| information_schema |
| db_charset_demo    |
| db_test            |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
6 rows in set (0.00 sec)`}
    />
    <Paragraph>
      你会看到除了我们刚建的 <InlineCode>db_test</InlineCode>、<InlineCode>db_charset_demo</InlineCode>，还有几个
      <Text bold>不是我们建的库</Text>：
    </Paragraph>
    <Table
      head={['系统库', '作用（了解即可，不要去改它们）']}
      rows={[
        ['information_schema', '一个"虚拟库"，保存了所有库表的元数据（有哪些库、哪些表、哪些列等）。'],
        ['mysql', 'MySQL 自己的核心库，存放用户、权限等系统信息。'],
        ['performance_schema', '性能监控相关数据。'],
        ['sys', '基于上面两个库做的一层更易读的视图，方便排查性能问题。'],
      ]}
    />
    <Callout type="warning" title="注意">
      上面这四个是 MySQL 自带的<Text bold>系统数据库</Text>，是 MySQL
      正常运行所必需的，<Text bold>千万不要删除或随意修改</Text>，否则可能导致整个数据库服务异常。
    </Callout>
    <Paragraph>
      如果你只想找名字里带某个关键字的库，可以加 <InlineCode>LIKE</InlineCode> 过滤：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW DATABASES LIKE 'db_%';`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`+-----------------+
| Database (db_%) |
+-----------------+
| db_charset_demo |
| db_test         |
+-----------------+
2 rows in set (0.00 sec)`}
    />
    <Callout type="tip">
      <InlineCode>LIKE</InlineCode> 里的 <InlineCode>%</InlineCode> 是通配符，匹配任意多个字符。
      <InlineCode>'db_%'</InlineCode> 表示"以 db 开头的库名"。（<InlineCode>LIKE</InlineCode>{' '}
      的完整用法会在 DQL 查询章节细讲，这里先会用即可。）
    </Callout>

    <Heading3>3.2 查看某个库的定义：SHOW CREATE DATABASE</Heading3>
    <Paragraph>
      <InlineCode>SHOW DATABASES</InlineCode> 只告诉你"有这个库"，但<Text bold>它用的什么字符集</Text>呢？用{' '}
      <InlineCode>SHOW CREATE DATABASE</InlineCode> 可以看到这个库<Text bold>完整的创建语句</Text>。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW CREATE DATABASE 数据库名;`}
    />
    <Paragraph>
      <Text bold>示例与执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW CREATE DATABASE db_charset_demo;`}
    />
    <CodeBlock
      language="text"
      code={`+-----------------+--------------------------------------------------------------------------------------------------------------------------------+
| Database        | Create Database                                                                                                                |
+-----------------+--------------------------------------------------------------------------------------------------------------------------------+
| db_charset_demo | CREATE DATABASE \`db_charset_demo\` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */ |
+-----------------+--------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)`}
    />
    <Paragraph>
      <Text bold>怎么读这条结果？</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        反引号 <InlineCode>`db_charset_demo`</InlineCode> 把库名括起来，是 MySQL
        的标准写法，可以避免库名和关键字冲突。
      </ListItem>
      <ListItem>
        <InlineCode>DEFAULT CHARACTER SET utf8mb4</InlineCode>：这个库的默认字符集是 utf8mb4 ——{' '}
        <Text bold>正是我们想确认的信息</Text>。
      </ListItem>
      <ListItem>
        <InlineCode>COLLATE utf8mb4_0900_ai_ci</InlineCode>：默认校对规则（MySQL 8.0 的默认值）。
      </ListItem>
      <ListItem>
        <InlineCode>/*!40100 ... */</InlineCode>：这是 MySQL 特有的<Text bold>版本化注释</Text>。
        <InlineCode>40100</InlineCode> 表示"MySQL 4.1.0
        及以上版本才执行注释里的内容"，是为了向下兼容旧版本而设计的，<Text bold>正常理解成普通 SQL 即可</Text>。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="提示">
      <InlineCode>SHOW CREATE DATABASE</InlineCode>{' '}
      是排查"为什么我存中文/emoji 乱码"的第一步——先看看库到底是不是 <InlineCode>utf8mb4</InlineCode>。
    </Callout>
  </article>
);

export default index;
