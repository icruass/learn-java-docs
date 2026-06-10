import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Heading4,
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
    <Title>DDL：操作数据库（创建、查询、修改、删除、使用）</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        前面几篇我们已经认识了 MySQL
        是什么、装好了环境、也学会了用命令行/客户端连上数据库。但连上之后，我们面对的是一个“空房子”——里面还没有属于我们自己的
        <Text bold>数据库（Database）</Text>。
      </Paragraph>
      <Paragraph>
        本章就来学习一类专门“盖房子、改房子、拆房子”的语句：
        <Text bold>DDL（Data Definition Language，数据定义语言）</Text>。
      </Paragraph>
      <Callout type="note">
        <Paragraph>类比一下：如果把 MySQL 服务器想象成一栋<Text bold>大楼</Text>，那么：</Paragraph>
        <UnorderedList>
          <ListItem>
            <Text bold>数据库（database）</Text> 就是大楼里的一个个<Text bold>房间</Text>；
          </ListItem>
          <ListItem>
            <Text bold>表（table）</Text> 是房间里的一个个<Text bold>柜子</Text>；
          </ListItem>
          <ListItem>
            <Text bold>数据（row）</Text> 是柜子里放的一份份<Text bold>文件</Text>。
          </ListItem>
        </UnorderedList>
        <Paragraph>
          本章只关心“房间”这一层：怎么创建房间、怎么查看有哪些房间、怎么改房间的属性、怎么拆掉房间、以及“我现在人在哪个房间里”。
        </Paragraph>
      </Callout>
      <Paragraph>学完本章你将能够：</Paragraph>
      <Table
        head={['操作', '关键字', '一句话说明']}
        rows={[
          ['创建（Create）', 'CREATE DATABASE', '新建一个数据库'],
          ['查询（Retrieve）', 'SHOW DATABASES / SHOW CREATE DATABASE', '查看有哪些库、查看某个库的定义'],
          ['修改（Update）', 'ALTER DATABASE', '修改库的属性（一般只改字符集）'],
          ['删除（Delete）', 'DROP DATABASE', '删除一个数据库（危险！不可恢复）'],
          ['使用（Use）', 'USE / SELECT DATABASE()', '切换到某个库 / 查看当前所在库'],
        ]}
      />
      <Callout type="tip" title="提示：这五个动作的英文首字母可以记成 CRUD 的“库版本”">
        <Paragraph>
          CRUD（增删改查）是数据库操作的万能口诀，后面学“操作表（DDL）”“操作数据（DML/DQL）”时，你会发现都是同样的套路，只是对象从“库”变成了“表”“行”。
        </Paragraph>
        <Paragraph>
          <Text bold>与前后章的关系</Text>
          ：本章是“操作数据库”，下一章会进入“操作表（建表/改表/删表）”，再往后是“操作数据（增删改查行记录）”。本章最后会
          <Text bold>亲手创建贯穿全套教程的 db_learn 库</Text>，为后续所有章节打地基。
        </Paragraph>
      </Callout>
    </Callout>

    <Divider />

    <Subtitle>1. 预备知识：DDL 是什么？SQL 语句的基本约定</Subtitle>
    <Paragraph>在动手敲命令之前，先把几个贯穿全篇的“规矩”说清楚，后面就不重复了。</Paragraph>

    <Heading3>1.1 什么是 DDL</Heading3>
    <Paragraph>SQL 语句按用途分成几大类，本章涉及的是 DDL：</Paragraph>
    <Table
      head={['类别', '全称', '作用', '典型语句']}
      rows={[
        ['DDL', 'Data Definition Language（数据定义语言）', '定义/管理结构：库、表、列', 'CREATE、ALTER、DROP、SHOW、USE'],
        ['DML', 'Data Manipulation Language（数据操作语言）', '操作表里的数据', 'INSERT、UPDATE、DELETE'],
        ['DQL', 'Data Query Language（数据查询语言）', '查询数据', 'SELECT'],
        ['DCL', 'Data Control Language（数据控制语言）', '管理权限', 'GRANT、REVOKE'],
      ]}
    />
    <Paragraph>
      本章只讲 DDL 中“操作数据库”这一小块。可以这样理解：
      <Text bold>DDL 管的是“骨架/结构”，而不是“里面装的数据”</Text>。
    </Paragraph>

    <Heading3>1.2 几条必须记住的书写约定</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>每条 SQL 语句以分号 ; 结尾。</Text> 在命令行里，不打分号回车，MySQL
        会认为你的语句还没写完，继续等你输入。
      </ListItem>
      <ListItem>
        <Text bold>SQL 关键字不区分大小写</Text>，但本教程统一<Text bold>关键字大写</Text>（如{' '}
        <InlineCode>CREATE</InlineCode>、<InlineCode>DATABASE</InlineCode>），库名/表名小写，这样可读性最好。
      </ListItem>
      <ListItem>
        <Text bold>库名、表名</Text>在 Windows 下默认不区分大小写，在 Linux
        下默认区分大小写。<Text bold>强烈建议库名一律用小写、用下划线分词</Text>（如{' '}
        <InlineCode>db_learn</InlineCode>），避免跨平台踩坑。
      </ListItem>
      <ListItem>
        可以用 <InlineCode>-- 这是注释</InlineCode>（双横线后面要有一个空格）或{' '}
        <InlineCode># 这是注释</InlineCode> 写单行注释，用 <InlineCode>/* ... */</InlineCode> 写多行注释。
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="sql"
      code={`-- 这是单行注释
CREATE DATABASE db_test;   -- 行尾注释也可以
/* 这是
   多行注释 */`}
    />
    <Callout type="tip" title="提示">
      在命令行里如果一条语句敲错了还没敲分号，可以输入 <InlineCode>\c</InlineCode>{' '}
      然后回车来取消当前这条语句，重新开始。
    </Callout>

    <Divider />

    <Subtitle>2. 创建数据库：CREATE DATABASE</Subtitle>

    <Heading3>2.1 最基础的写法</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE 数据库名;`}
    />
    <Paragraph>
      <Text bold>逐项解释：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>CREATE DATABASE</InlineCode>：固定关键字，表示“创建一个数据库”。
      </ListItem>
      <ListItem>
        <InlineCode>数据库名</InlineCode>：你给这个库起的名字。命名规则：由字母、数字、下划线组成，不要用
        MySQL 关键字，建议全小写。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE db_test;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.01 sec)`}
    />
    <Callout type="note">
      这里的 <InlineCode>1 row affected</InlineCode> 是 MySQL
      的统一反馈格式（它把“成功建了 1 个库”也说成“影响了 1 行”），看到{' '}
      <InlineCode>Query OK</InlineCode> 就代表成功了。
    </Callout>
    <Paragraph>
      此时如果你<Text bold>再执行一次完全相同的语句</Text>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE db_test;`}
    />
    <Paragraph>
      <Text bold>执行结果（报错）：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`ERROR 1007 (HY000): Can't create database 'db_test'; database exists`}
    />
    <Paragraph>
      错误号 <InlineCode>1007</InlineCode> 的意思是：
      <Text bold>这个库已经存在了，不能重复创建</Text>。这就引出了下面更安全的写法。
    </Paragraph>

    <Heading3>2.2 防止报错：CREATE DATABASE IF NOT EXISTS</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE IF NOT EXISTS 数据库名;`}
    />
    <Paragraph>
      <Text bold>逐项解释：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>IF NOT EXISTS</InlineCode>：直译就是“如果（这个库）不存在（才创建）”。
        <UnorderedList>
          <ListItem>
            如果库<Text bold>不存在</Text> → 正常创建。
          </ListItem>
          <ListItem>
            如果库<Text bold>已存在</Text> → <Text bold>什么都不做，也不报错</Text>（只给一个警告）。
          </ListItem>
        </UnorderedList>
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE IF NOT EXISTS db_test;`}
    />
    <Paragraph>
      <Text bold>执行结果（库已存在的情况）：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected, 1 warning (0.00 sec)`}
    />
    <Paragraph>
      注意这次结果里多了 <InlineCode>1 warning</InlineCode>
      （1 个警告）。它并没有真正创建，只是提示“库已经在了”。你可以用{' '}
      <InlineCode>SHOW WARNINGS;</InlineCode> 查看这个警告的内容：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW WARNINGS;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`+-------+------+----------------------------------------------+
| Level | Code | Message                                      |
+-------+------+----------------------------------------------+
| Note  | 1007 | Can't create database 'db_test'; database exists |
+-------+------+----------------------------------------------+`}
    />
    <Callout type="tip" title="提示：为什么强烈推荐写 IF NOT EXISTS？">
      因为我们经常把建库语句写进<Text bold>脚本（.sql 文件）</Text>里反复执行（比如部署、初始化）。如果不加{' '}
      <InlineCode>IF NOT EXISTS</InlineCode>
      ，第二次执行脚本就会因为“库已存在”而中途报错退出。加上它，脚本就可以<Text bold>幂等</Text>
      地反复运行而不出错。这是工程实践中的标配。
    </Callout>

    <Heading3>2.3 创建时指定字符集：CHARACTER SET</Heading3>

    <Heading4>2.3.1 先搞懂：什么是字符集（charset）和校对规则（collation）</Heading4>
    <Paragraph>
      这是很多新手忽略、但<Text bold>极其重要</Text>的一个点。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>字符集（Character Set）</Text>
        ：规定“一个字符在数据库里用什么样的二进制编码来存储”。简单说就是“
        <Text bold>怎么把中文、emoji 这些字符存成 0 和 1</Text>”。
      </ListItem>
      <ListItem>
        <Text bold>校对规则（Collation）</Text>：规定“同一个字符集下，字符
        <Text bold>怎么比较大小、怎么排序、是否区分大小写</Text>”。
      </ListItem>
    </UnorderedList>
    <Callout type="note">
      类比：字符集像是“用哪种文字写字（中文/英文/日文）”，校对规则像是“按什么顺序给这些字排序（笔画/拼音/字母）、写‘A’和‘a’算不算一个字”。
    </Callout>
    <Paragraph>
      MySQL 里最常见、也是<Text bold>当今最推荐</Text>的字符集是 <Text bold>utf8mb4</Text>。
    </Paragraph>
    <Callout type="danger" title="常见坑：utf8 ≠ 真正的 UTF-8！">
      <Paragraph>
        MySQL 里历史遗留的 <InlineCode>utf8</InlineCode>（也叫 <InlineCode>utf8mb3</InlineCode>）每个字符
        <Text bold>最多只占 3 个字节</Text>，存不下需要 4
        字节的字符——比如各种 <Text bold>emoji 😀、部分生僻汉字</Text>。一旦插入这些字符就会报错或乱码。
      </Paragraph>
      <Paragraph>
        真正完整支持 4 字节的，是 <Text bold>utf8mb4</Text>（mb4 = most bytes 4，最多 4 字节）。
      </Paragraph>
      <Paragraph>
        <Text bold>结论：新建库一律用 utf8mb4，不要再用 utf8。</Text> MySQL 8.0 起默认字符集已经是{' '}
        <InlineCode>utf8mb4</InlineCode>，但显式写出来更稳妥、可读性也更好。
      </Paragraph>
    </Callout>

    <Heading4>2.3.2 语法与示例</Heading4>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE 数据库名 CHARACTER SET 字符集名;
-- 也可以同时指定校对规则：
CREATE DATABASE 数据库名 CHARACTER SET 字符集名 COLLATE 校对规则名;`}
    />
    <Paragraph>
      <Text bold>逐项解释：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>CHARACTER SET 字符集名</InlineCode>
        ：指定这个库的默认字符集。库里新建的表如果不单独指定，就会继承库的字符集。
      </ListItem>
      <ListItem>
        <InlineCode>COLLATE 校对规则名</InlineCode>（可选）：指定校对规则。常用{' '}
        <InlineCode>utf8mb4_general_ci</InlineCode> 或 <InlineCode>utf8mb4_unicode_ci</InlineCode>，结尾的{' '}
        <InlineCode>_ci</InlineCode> 表示 case insensitive（<Text bold>不区分大小写</Text>）。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例（创建一个用 utf8mb4 的库）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE IF NOT EXISTS db_charset_demo CHARACTER SET utf8mb4;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.01 sec)`}
    />
    <Paragraph>
      <Text bold>示例（同时指定校对规则）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE IF NOT EXISTS db_charset_demo2
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;`}
    />
    <Callout type="tip" title="提示">
      <Paragraph>
        <InlineCode>CHARACTER SET</InlineCode> 可以缩写成 <InlineCode>CHARSET</InlineCode>，下面两句等价：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`CREATE DATABASE d1 CHARACTER SET utf8mb4;
CREATE DATABASE d2 CHARSET utf8mb4;`}
      />
    </Callout>

    <Heading4>2.3.3 怎么查可用的字符集和校对规则？</Heading4>
    <CodeBlock
      language="sql"
      code={`-- 查看 MySQL 支持的所有字符集
SHOW CHARACTER SET;

-- 查看某个字符集下有哪些校对规则
SHOW COLLATION WHERE Charset = 'utf8mb4';`}
    />
    <Paragraph>
      <InlineCode>SHOW CHARACTER SET;</InlineCode> 的部分结果示意：
    </Paragraph>
    <Table
      head={['Charset', 'Description', 'Default collation', 'Maxlen']}
      rows={[
        ['latin1', 'cp1252 West European', 'latin1_swedish_ci', '1'],
        ['utf8mb3', 'UTF-8 Unicode', 'utf8mb3_general_ci', '3'],
        ['utf8mb4', 'UTF-8 Unicode', 'utf8mb4_0900_ai_ci', '4'],
        ['gbk', 'GBK Simplified Chinese', 'gbk_chinese_ci', '2'],
      ]}
    />
    <Callout type="note">
      注意最后一列 <InlineCode>Maxlen</InlineCode>：<InlineCode>utf8mb4</InlineCode>{' '}
      的最大字节数是 4，这正是它能存 emoji 的原因。
    </Callout>

    <Divider />

    <Subtitle>3. 查询数据库：SHOW DATABASES / SHOW CREATE DATABASE</Subtitle>
    <Paragraph>
      建完库，我们得有办法“看见”它。查询数据库有两个层次：<Text bold>看全局有哪些库</Text> 和{' '}
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
        ['information_schema', '一个“虚拟库”，保存了所有库表的元数据（有哪些库、哪些表、哪些列等）。'],
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
      <InlineCode>'db_%'</InlineCode> 表示“以 db 开头的库名”。（<InlineCode>LIKE</InlineCode>{' '}
      的完整用法会在 DQL 查询章节细讲，这里先会用即可。）
    </Callout>

    <Heading3>3.2 查看某个库的定义：SHOW CREATE DATABASE</Heading3>
    <Paragraph>
      <InlineCode>SHOW DATABASES</InlineCode> 只告诉你“有这个库”，但<Text bold>它用的什么字符集</Text>呢？用{' '}
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
        <InlineCode>40100</InlineCode> 表示“MySQL 4.1.0
        及以上版本才执行注释里的内容”，是为了向下兼容旧版本而设计的，<Text bold>正常理解成普通 SQL 即可</Text>。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="提示">
      <InlineCode>SHOW CREATE DATABASE</InlineCode>{' '}
      是排查“为什么我存中文/emoji 乱码”的第一步——先看看库到底是不是 <InlineCode>utf8mb4</InlineCode>。
    </Callout>

    <Divider />

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
    <Callout type="danger" title="常见坑：MySQL 没有“重命名数据库”的命令！">
      <Paragraph>
        你不会找到 <InlineCode>RENAME DATABASE</InlineCode>{' '}
        这样的语句（历史上短暂出现过又被移除了，因为很危险）。如果真的要“改库名”，标准做法是：
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
    <Callout type="warning" title="注意：ALTER DATABASE 只改“库的默认字符集”，不会自动改“已存在的表和列”！">
      <Paragraph>
        库的字符集只对<Text bold>之后新建的、且没单独指定字符集的表</Text>起“默认值”作用。
        <Text bold>已经存在的表/列仍然保持它们原来的字符集</Text>。如果要把老表也一起转过来，需要对表执行{' '}
        <InlineCode>ALTER TABLE ... CONVERT TO CHARACTER SET utf8mb4;</InlineCode>（这属于“操作表”的内容，下一章会讲）。
      </Paragraph>
      <Paragraph>
        换句话说：<Text bold>改库字符集 ≈ 改“以后新建表的默认模板”，而不是“一键把存量数据全转码”</Text>。
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
      在这里是正常的，不代表失败——它指的是“受影响的数据行数”，删库这个操作本身成功了。
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
    <Paragraph>和建库对称，删库也有“安全版”写法：</Paragraph>
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
        同样，这在写脚本时非常有用：保证脚本反复执行都不会因为“库不存在”而中断。常见的“重建脚本”开头就是这两句搭配：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`DROP DATABASE IF EXISTS db_learn;
CREATE DATABASE db_learn CHARACTER SET utf8mb4;`}
      />
    </Callout>

    <Heading3>5.3 ⚠️ 重大警告：DROP 不可恢复！</Heading3>
    <Callout type="warning" title="⚠️⚠️⚠️ DROP DATABASE 会把这个库以及库里的所有表、所有数据全部物理删除，且没有“回收站”、没有“撤销”、不可恢复！">
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
      我们已经会建库、查库了。但你有没有发现一个问题：到目前为止我们的操作都是“站在大楼大厅里”对某个房间隔空喊话（每次都写全名）。真正干活（建表、增删数据）时，需要
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
    <Callout type="tip" title="提示：不切库也能操作表，用“库名.表名”全限定">
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
        报错 <InlineCode>1049</InlineCode> 表示“未知的数据库”，说明这个库压根不存在（或者名字打错了）。
      </Paragraph>
    </Callout>

    <Heading3>6.2 查看当前正在使用哪个库：SELECT DATABASE()</Heading3>
    <Paragraph>
      切来切去之后，怎么知道“我现在到底在哪个房间”？用内置函数 <InlineCode>DATABASE()</InlineCode>：
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
      结果是 <InlineCode>NULL</InlineCode>，表示“当前没有选定任何数据库”。这时若直接写不带库名的{' '}
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

    <Divider />

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
      <Text bold>第 5 步：确认“我现在在 db_learn 里”</Text>
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
-- 1) 如已存在则先删除（谨慎：会清空旧数据！仅在“重建测试环境”时使用）
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
      <Text bold>绝不要把这种“先删后建”的脚本对着有真实数据的库执行</Text>。
    </Callout>

    <Divider />

    <Subtitle>8. 本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>DDL</Text> 是“数据定义语言”，负责管理库/表/列这些<Text bold>结构</Text>；本章聚焦“操作数据库”这一层，套路就是{' '}
        <Text bold>增（CREATE）、查（SHOW）、改（ALTER）、删（DROP）、用（USE）</Text>。
      </ListItem>
      <ListItem>
        <Text bold>创建</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>CREATE DATABASE 名;</InlineCode> 最基础。
          </ListItem>
          <ListItem>
            <InlineCode>CREATE DATABASE IF NOT EXISTS 名;</InlineCode> 防止“已存在”报错，
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
            改库字符集只影响“以后新建的表”，<Text bold>不会自动转换已有表/列</Text>。
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
        Q2：CREATE DATABASE IF NOT EXISTS 加了 IF NOT EXISTS，当库已存在时是“覆盖”还是“跳过”？
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
