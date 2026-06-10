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
    <Title>预备知识与 CREATE DATABASE</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        前面几篇我们已经认识了 MySQL
        是什么、装好了环境、也学会了用命令行/客户端连上数据库。但连上之后，我们面对的是一个"空房子"——里面还没有属于我们自己的
        <Text bold>数据库（Database）</Text>。
      </Paragraph>
      <Paragraph>
        本章就来学习一类专门"盖房子、改房子、拆房子"的语句：
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
          本章只关心"房间"这一层：怎么创建房间、怎么查看有哪些房间、怎么改房间的属性、怎么拆掉房间、以及"我现在人在哪个房间里"。
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
      <Callout type="tip" title={"提示：这五个动作的英文首字母可以记成 CRUD 的\"库版本\""}>
        <Paragraph>
          CRUD（增删改查）是数据库操作的万能口诀，后面学"操作表（DDL）""操作数据（DML/DQL）"时，你会发现都是同样的套路，只是对象从"库"变成了"表""行"。
        </Paragraph>
        <Paragraph>
          <Text bold>与前后章的关系</Text>
          ：本章是"操作数据库"，下一章会进入"操作表（建表/改表/删表）"，再往后是"操作数据（增删改查行记录）"。本章最后会
          <Text bold>亲手创建贯穿全套教程的 db_learn 库</Text>，为后续所有章节打地基。
        </Paragraph>
      </Callout>
    </Callout>

    <Divider />

    <Subtitle>1. 预备知识：DDL 是什么？SQL 语句的基本约定</Subtitle>
    <Paragraph>在动手敲命令之前，先把几个贯穿全篇的"规矩"说清楚，后面就不重复了。</Paragraph>

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
      本章只讲 DDL 中"操作数据库"这一小块。可以这样理解：
      <Text bold>DDL 管的是"骨架/结构"，而不是"里面装的数据"</Text>。
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
        <InlineCode>CREATE DATABASE</InlineCode>：固定关键字，表示"创建一个数据库"。
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
      的统一反馈格式（它把"成功建了 1 个库"也说成"影响了 1 行"），看到{' '}
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
        <InlineCode>IF NOT EXISTS</InlineCode>：直译就是"如果（这个库）不存在（才创建）"。
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
      （1 个警告）。它并没有真正创建，只是提示"库已经在了"。你可以用{' '}
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
      ，第二次执行脚本就会因为"库已存在"而中途报错退出。加上它，脚本就可以<Text bold>幂等</Text>
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
        ：规定"一个字符在数据库里用什么样的二进制编码来存储"。简单说就是"
        <Text bold>怎么把中文、emoji 这些字符存成 0 和 1</Text>"。
      </ListItem>
      <ListItem>
        <Text bold>校对规则（Collation）</Text>：规定"同一个字符集下，字符
        <Text bold>怎么比较大小、怎么排序、是否区分大小写</Text>"。
      </ListItem>
    </UnorderedList>
    <Callout type="note">
      类比：字符集像是"用哪种文字写字（中文/英文/日文）"，校对规则像是"按什么顺序给这些字排序（笔画/拼音/字母）、写'A'和'a'算不算一个字"。
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
  </article>
);

export default index;
