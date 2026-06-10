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
    <Title>DDL：操作表（增删改查表结构）、数据类型与 SQLyog 图形化工具</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        在上一章里，我们用 DDL（Data Definition Language，数据定义语言）学会了「操作数据库」——
        <InlineCode>CREATE DATABASE</InlineCode> / <InlineCode>SHOW DATABASES</InlineCode> /{' '}
        <InlineCode>DROP DATABASE</InlineCode> / <InlineCode>USE</InlineCode>
        。可是「库」只是一个空壳容器，真正用来装数据的是<Text bold>表（Table）</Text>。
      </Paragraph>
      <Paragraph>你可以这样类比：</Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>数据库</Text> = 一个 Excel 工作簿（一个 <InlineCode>.xlsx</InlineCode> 文件）；
        </ListItem>
        <ListItem>
          <Text bold>表</Text> = 工作簿里的一张工作表（Sheet）；
        </ListItem>
        <ListItem>
          <Text bold>列（字段）</Text> = 表头那一行（姓名、工资、入职日期……）；
        </ListItem>
        <ListItem>
          <Text bold>行（记录）</Text> = 表里的每一条数据。
        </ListItem>
      </UnorderedList>
      <Paragraph>本章我们把镜头从「库」拉近到「表」，要把表这一层彻底讲透，具体包括：</Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>查询表</Text>：怎么看库里有哪些表、一张表长什么样；
        </ListItem>
        <ListItem>
          <Text bold>创建表</Text>：<InlineCode>CREATE TABLE</InlineCode> 的完整语法，并亲手把贯穿全套教程的{' '}
          <InlineCode>dept</InlineCode>、<InlineCode>emp</InlineCode> 两张表建出来；
        </ListItem>
        <ListItem>
          <Text bold>数据类型</Text>：建表时每个列要声明「类型」，这是 MySQL 最容易踩坑、也最体现功底的地方（
          <InlineCode>INT</InlineCode> 还是 <InlineCode>BIGINT</InlineCode>？<InlineCode>DOUBLE</InlineCode> 还是{' '}
          <InlineCode>DECIMAL</InlineCode>？<InlineCode>CHAR</InlineCode> 还是 <InlineCode>VARCHAR</InlineCode>？
          <InlineCode>DATETIME</InlineCode> 还是 <InlineCode>TIMESTAMP</InlineCode>？）；
        </ListItem>
        <ListItem>
          <Text bold>删除表</Text>：<InlineCode>DROP TABLE</InlineCode>；
        </ListItem>
        <ListItem>
          <Text bold>修改表</Text>：<InlineCode>ALTER TABLE</InlineCode>——改表名、改字符集、加列、改列、删列；
        </ListItem>
        <ListItem>
          <Text bold>复制表结构</Text>：<InlineCode>CREATE TABLE ... LIKE ...</InlineCode>；
        </ListItem>
        <ListItem>
          <Text bold>图形化工具</Text>：SQLyog / Navicat 怎么连接、怎么可视化建库建表、为什么说「鼠标点点点的本质还是在生成 SQL」。
        </ListItem>
      </OrderedList>
      <Paragraph>
        学完本章，你就能<Text bold>徒手定义出符合业务需要、类型选得恰到好处的表结构</Text>
        。这是后面所有 DML（增删改数据）、DQL（查询数据）章节的地基——没有合理的表，写再花哨的查询都是空中楼阁。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>0. 准备工作：先把库建好、切进去</Subtitle>
    <Paragraph>
      本章所有示例都在数据库 <InlineCode>db_learn</InlineCode>{' '}
      里操作。先确保它存在并切换进去（这是上一章的内容，这里快速回顾）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 如果不存在就创建，避免重复执行报错
CREATE DATABASE IF NOT EXISTS db_learn
    DEFAULT CHARACTER SET utf8mb4;

-- 切换到该库，之后的所有建表/查表都在这个库里发生
USE db_learn;`}
    />
    <Paragraph>执行结果（命令行下）：</Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.01 sec)
Database changed`}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：<InlineCode>USE db_learn;</InlineCode>{' '}
      之后，命令行提示符虽然不变，但「当前数据库」已经变了。后续 <InlineCode>CREATE TABLE emp ...</InlineCode> 等价于{' '}
      <InlineCode>CREATE TABLE db_learn.emp ...</InlineCode>。如果不先 <InlineCode>USE</InlineCode>
      ，又不写库名前缀，MySQL 会报 <InlineCode>ERROR 1046 (3D000): No database selected</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>1. DDL 操作表的整体认识</Subtitle>
    <Paragraph>操作「表」一共四类动作，和操作「库」一一对应，记忆负担很小：</Paragraph>
    <Table
      head={['动作', '关键字', '操作库（上一章）', '操作表（本章）']}
      rows={[
        ['查（Retrieve）', 'SHOW / DESC', 'SHOW DATABASES;', 'SHOW TABLES; / DESC 表名;'],
        ['增（Create）', 'CREATE', 'CREATE DATABASE 库名;', 'CREATE TABLE 表名(...);'],
        ['删（Drop）', 'DROP', 'DROP DATABASE 库名;', 'DROP TABLE 表名;'],
        ['改（Alter）', 'ALTER', 'ALTER DATABASE ...;', 'ALTER TABLE ...;'],
      ]}
    />
    <Paragraph>
      我们按「<Text bold>先会看 → 再会建 → 弄懂类型 → 会删 → 会改 → 会复制</Text>
      」的顺序展开。先教「查」，是因为你创建任何东西之后，第一反应都应该是「查一下，看看是不是真建对了」。
    </Paragraph>

    <Divider />

    <Subtitle>2. 查询表</Subtitle>
    <Callout type="tip">
      这一节有个小小的「先有鸡还是先有蛋」问题：库里现在还没有表，<InlineCode>SHOW TABLES</InlineCode>{' '}
      会是空的。没关系，你先记住这些命令的用法，等第 3 节建完表，回头再跑一遍就能看到效果了。本节末尾会给出「建表后」的真实结果。
    </Callout>

    <Heading3>2.1 查看当前库里有哪些表：<InlineCode>SHOW TABLES;</InlineCode></Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SHOW TABLES;`} />
    <Paragraph>
      <Text bold>逐项解释：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>SHOW TABLES</InlineCode> 列出<Text bold>当前所选数据库</Text>（即你 <InlineCode>USE</InlineCode>
        {' '}的那个库）里的所有表名。
      </ListItem>
      <ListItem>
        想看别的库的表，可以加 <InlineCode>FROM</InlineCode>：<InlineCode>SHOW TABLES FROM 库名;</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例（在还没建表时执行）：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SHOW TABLES;`} />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <CodeBlock language="text" code={`Empty set (0.00 sec)`} />
    <Paragraph>
      空的，符合预期。等会儿建完 <InlineCode>dept</InlineCode>、<InlineCode>emp</InlineCode> 再来看。
    </Paragraph>

    <Heading3>2.2 查看表结构：<InlineCode>DESC 表名;</InlineCode></Heading3>
    <Paragraph>
      <InlineCode>DESC</InlineCode> 是 <InlineCode>DESCRIBE</InlineCode> 的缩写，用来
      <Text bold>快速查看一张表有哪些列、每列什么类型、有没有约束</Text>
      。这是日常用得最频繁的命令之一——拿到一张陌生的表，第一件事就是 <InlineCode>DESC</InlineCode> 它。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DESC 表名;
-- 或写全：DESCRIBE 表名;`}
    />
    <Paragraph>
      <Text bold>示例（建完 emp 表后）：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`DESC emp;`} />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <Table
      head={['Field', 'Type', 'Null', 'Key', 'Default', 'Extra']}
      rows={[
        ['id', 'int', 'NO', 'PRI', 'NULL', 'auto_increment'],
        ['ename', 'varchar(20)', 'YES', '', 'NULL', ''],
        ['gender', 'char(1)', 'YES', '', 'NULL', ''],
        ['salary', 'double', 'YES', '', 'NULL', ''],
        ['join_date', 'date', 'YES', '', 'NULL', ''],
        ['dept_id', 'int', 'YES', 'MUL', 'NULL', ''],
        ['bonus', 'double', 'YES', '', 'NULL', ''],
      ]}
    />
    <Paragraph>
      <Text bold>怎么读这张表：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Field</Text>：列名。
      </ListItem>
      <ListItem>
        <Text bold>Type</Text>：列的数据类型（第 3 节会逐一讲）。
      </ListItem>
      <ListItem>
        <Text bold>Null</Text>：该列是否允许为 <InlineCode>NULL</InlineCode>。<InlineCode>YES</InlineCode> 允许，
        <InlineCode>NO</InlineCode> 不允许。
      </ListItem>
      <ListItem>
        <Text bold>Key</Text>：键信息。<InlineCode>PRI</InlineCode> 主键、<InlineCode>UNI</InlineCode> 唯一键、
        <InlineCode>MUL</InlineCode> 普通索引/外键列（Multiple，表示允许重复值的索引）。
      </ListItem>
      <ListItem>
        <Text bold>Default</Text>：默认值。没设就是 <InlineCode>NULL</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>Extra</Text>：附加信息。常见的有 <InlineCode>auto_increment</InlineCode>（自增）。
      </ListItem>
    </UnorderedList>

    <Heading3>2.3 查看建表语句：<InlineCode>SHOW CREATE TABLE 表名;</InlineCode></Heading3>
    <Paragraph>
      <InlineCode>DESC</InlineCode> 是「精简版」结构，而 <InlineCode>SHOW CREATE TABLE</InlineCode> 会把这张表
      <Text bold>完整的建表 SQL</Text>
      反向「打印」出来——包含字符集、存储引擎、约束的完整定义。当你想「照着已有表再建一张类似的表」或「排查字符集/引擎问题」时非常有用。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SHOW CREATE TABLE 表名;`} />
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SHOW CREATE TABLE emp;`} />
    <Paragraph>
      <Text bold>结果（关键部分）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE \`emp\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`ename\` varchar(20) DEFAULT NULL,
  \`gender\` char(1) DEFAULT NULL,
  \`salary\` double DEFAULT NULL,
  \`join_date\` date DEFAULT NULL,
  \`dept_id\` int DEFAULT NULL,
  \`bonus\` double DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`fk_emp_dept\` (\`dept_id\`),
  CONSTRAINT \`fk_emp_dept\` FOREIGN KEY (\`dept_id\`) REFERENCES \`dept\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`}
    />
    <Paragraph>
      <Text bold>注意几个细节：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        列名/表名被反引号 <InlineCode>`</InlineCode> 包起来了。反引号是 MySQL
        用来「转义标识符」的，避免列名和关键字撞车（比如你真的想把列叫 <InlineCode>order</InlineCode>、
        <InlineCode>desc</InlineCode>）。手写时一般不用加，让 MySQL 自动加即可。
      </ListItem>
      <ListItem>
        <InlineCode>ENGINE=InnoDB</InlineCode>：存储引擎。现代 MySQL 默认就是
        InnoDB（支持事务、外键、行锁），后面讲事务时会再展开。
      </ListItem>
      <ListItem>
        <InlineCode>DEFAULT CHARSET=utf8mb4</InlineCode>：字符集。
      </ListItem>
      <ListItem>
        <InlineCode>AUTO_INCREMENT=6</InlineCode>：表示下一个自增 id 会从 6 开始（因为我们已经插了 5 条数据）。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      <Text bold>三者怎么选用</Text>：日常看「有哪些表」用 <InlineCode>SHOW TABLES</InlineCode>
      ；想快速扫一眼「字段和类型」用 <InlineCode>DESC</InlineCode>；想看「完整定义/复制建表语句」用{' '}
      <InlineCode>SHOW CREATE TABLE</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>3. 创建表 <InlineCode>CREATE TABLE</InlineCode></Subtitle>
    <Paragraph>
      终于到了最核心的部分。<Text bold>建表 = 给数据画好格子</Text>
      ，格子的多少（列）、每个格子能装什么（类型）、能不能空（约束），都在 <InlineCode>CREATE TABLE</InlineCode>{' '}
      里一次性说清楚。
    </Paragraph>

    <Heading3>3.1 基本语法</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    列名1  数据类型1  [约束1],
    列名2  数据类型2  [约束2],
    ......
    列名n  数据类型n  [约束n]   -- 注意：最后一列后面不要加逗号！
);`}
    />
    <Paragraph>
      <Text bold>逐项解释：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>表名</InlineCode>：表的名字。建议小写 + 下划线，见名知意（如 <InlineCode>emp</InlineCode>、
        <InlineCode>order_item</InlineCode>）。
      </ListItem>
      <ListItem>
        <InlineCode>列名</InlineCode>：字段名，同样建议小写 + 下划线。
      </ListItem>
      <ListItem>
        <InlineCode>数据类型</InlineCode>：这一列存什么（整数、小数、字符串、日期……），见第 4 节。
      </ListItem>
      <ListItem>
        <InlineCode>约束</InlineCode>（可选）：对这一列的额外限制，常见的有：
        <UnorderedList>
          <ListItem>
            <InlineCode>PRIMARY KEY</InlineCode>：主键，唯一标识一行，不能重复、不能为空；
          </ListItem>
          <ListItem>
            <InlineCode>AUTO_INCREMENT</InlineCode>：自增（通常配合主键，插入时不用手填 id）；
          </ListItem>
          <ListItem>
            <InlineCode>NOT NULL</InlineCode>：非空；
          </ListItem>
          <ListItem>
            <InlineCode>UNIQUE</InlineCode>：唯一（值不能重复，但可以为空）；
          </ListItem>
          <ListItem>
            <InlineCode>DEFAULT 值</InlineCode>：默认值；
          </ListItem>
          <ListItem>
            <InlineCode>FOREIGN KEY ... REFERENCES ...</InlineCode>：外键（约束本表某列必须引用另一张表已存在的值）。
          </ListItem>
        </UnorderedList>
      </ListItem>
    </UnorderedList>
    <Callout type="warning">
      <Paragraph>
        <Text bold>注意：最常见的语法错误</Text>——在最后一个列定义后面多写了一个逗号，例如：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`CREATE TABLE t (
    id INT,
    name VARCHAR(20),   -- ← 这个逗号是多余的
);`}
      />
      <Paragraph>
        会报 <InlineCode>ERROR 1064 ... You have an error in your SQL syntax</InlineCode>
        。养成习惯：<Text bold>逗号是「分隔符」，加在两列之间，最后一列不加。</Text>
      </Paragraph>
    </Callout>

    <Heading3>3.2 实战：创建部门表 <InlineCode>dept</InlineCode></Heading3>
    <Paragraph>
      <InlineCode>dept</InlineCode> 表很简单，三列：编号、部门名、所在城市。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE dept (
    id        INT PRIMARY KEY AUTO_INCREMENT,   -- 部门编号：主键 + 自增
    dept_name VARCHAR(20),                       -- 部门名称：最长 20 字符
    loc       VARCHAR(20)                        -- 所在城市
);`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock language="text" code={`Query OK, 0 rows affected (0.03 sec)`} />
    <Paragraph>
      <InlineCode>0 rows affected</InlineCode> 是正常的——建表是「定义结构」，本来就没有数据行被影响。
    </Paragraph>

    <Heading3>3.3 实战：创建员工表 <InlineCode>emp</InlineCode>（一对多的「多」方）</Heading3>
    <Paragraph>
      <InlineCode>emp</InlineCode> 比 <InlineCode>dept</InlineCode> 复杂：它要通过 <InlineCode>dept_id</InlineCode>{' '}
      <Text bold>外键</Text>指向 <InlineCode>dept.id</InlineCode>，表达「一个部门有多个员工」的一对多关系。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE emp (
    id        INT PRIMARY KEY AUTO_INCREMENT,   -- 员工编号
    ename     VARCHAR(20),                       -- 姓名
    gender    CHAR(1),                            -- 性别 男/女（定长 1）
    salary    DOUBLE,                             -- 工资
    join_date DATE,                               -- 入职日期（只要年月日）
    dept_id   INT,                                -- 所属部门（外键 -> dept.id）
    bonus     DOUBLE,                             -- 奖金（可能为 NULL）
    -- 外键约束：给约束起个名字 fk_emp_dept，便于以后维护
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);`}
    />
    <Paragraph>
      <Text bold>逐项解读外键这一行：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>CONSTRAINT fk_emp_dept</InlineCode>：给这个约束命名为 <InlineCode>fk_emp_dept</InlineCode>（fk
        = foreign key）。不写也行，MySQL 会自动起名，但自己起名后续删改更方便。
      </ListItem>
      <ListItem>
        <InlineCode>FOREIGN KEY (dept_id)</InlineCode>：声明本表的 <InlineCode>dept_id</InlineCode> 是外键。
      </ListItem>
      <ListItem>
        <InlineCode>REFERENCES dept(id)</InlineCode>：它引用 <InlineCode>dept</InlineCode> 表的{' '}
        <InlineCode>id</InlineCode> 列。
      </ListItem>
    </UnorderedList>
    <Callout type="warning">
      <Text bold>注意：必须先建被引用的表</Text>。<InlineCode>emp</InlineCode> 引用了 <InlineCode>dept</InlineCode>
      ，所以<Text bold>一定要先建 <InlineCode>dept</InlineCode>，再建 <InlineCode>emp</InlineCode></Text>
      。反过来会报 <InlineCode>ERROR 1824 ... Failed to open the referenced table 'dept'</InlineCode>
      。这就像你要在通讯录里填「公司」，得这个公司先存在。
    </Callout>

    <Heading3>3.4 顺手把数据也插进去（为后面章节做准备）</Heading3>
    <Paragraph>
      虽然插入数据属于 DML（下一章详讲），但本套教程的例子都依赖这批数据，这里先把它们灌进去：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 先插部门（被引用方）
INSERT INTO dept (dept_name, loc) VALUES
    ('研发部','北京'),
    ('市场部','上海'),
    ('财务部','广州');

-- 再插员工（引用方），dept_id 必须是上面已存在的 1/2/3
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
    ('张三','男',8000, '2020-01-10', 1, 1000),
    ('李四','男',12000,'2019-03-15', 1, NULL),   -- 李四没奖金，用 NULL
    ('王五','女',9500, '2021-06-01', 2, 2000),
    ('赵六','女',6000, '2022-09-20', 2, NULL),
    ('孙七','男',15000,'2018-11-05', 3, 3000);`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 3 rows affected (0.01 sec)   -- dept
Query OK, 5 rows affected (0.01 sec)   -- emp`}
    />
    <Paragraph>
      现在回到第 2 节的 <InlineCode>SHOW TABLES;</InlineCode> 再跑一次：
    </Paragraph>
    <CodeBlock language="sql" code={`SHOW TABLES;`} />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <Table
      head={['Tables_in_db_learn']}
      rows={[['dept'], ['emp']]}
    />
    <Paragraph>两张表都在了。本章后面的修改、复制都基于这两张表。</Paragraph>

    <Divider />

    <Subtitle>4. MySQL 常用数据类型详解</Subtitle>
    <Paragraph>
      建表时每一列都要声明类型。<Text bold>选对类型 = 既省空间、又防错、又快</Text>
      ；选错类型轻则浪费、重则丢精度（比如用错类型导致工资多算一分钱）。MySQL 类型很多，我们按「整数 / 小数 / 字符串
      / 日期时间」四大类讲，覆盖 95% 的日常场景。
    </Paragraph>

    <Heading3>4.1 整数类型</Heading3>
    <Paragraph>存「没有小数点的数」，如年龄、id、数量。区别只在于「能存多大」和「占多少字节」。</Paragraph>
    <Table
      head={['类型', '字节', '有符号范围（约）', '无符号范围（UNSIGNED）', '典型用途']}
      rows={[
        ['TINYINT', '1', '-128 ~ 127', '0 ~ 255', '状态、布尔(0/1)、年龄'],
        ['SMALLINT', '2', '-3.2 万 ~ 3.2 万', '0 ~ 6.5 万', '小范围计数'],
        ['INT', '4', '-21 亿 ~ 21 亿', '0 ~ 42 亿', '最常用，普通 id、数量'],
        ['BIGINT', '8', '±9.2×10¹⁸', '0 ~ 1.8×10¹⁹', '大表主键、订单号、时间戳毫秒'],
      ]}
    />
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 演示不同整数类型
CREATE TABLE demo_int (
    age      TINYINT,            -- 年龄 0~127 够了
    quantity INT,                -- 普通数量
    user_id  BIGINT UNSIGNED     -- 用户量可能上亿，且 id 非负，用 BIGINT UNSIGNED
);`}
    />
    <Paragraph>
      <Text bold>几个要点：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>UNSIGNED</InlineCode>（无符号）表示「不要负数」，能把正数上限<Text bold>翻倍</Text>
        。比如年龄、库存这类天然非负的字段可以加，但很多团队为简单起见统一不加，避免无符号与有符号做减法时溢出。
      </ListItem>
      <ListItem>
        你可能见过 <InlineCode>INT(11)</InlineCode> 这种写法，<Text bold>括号里的数字不是「最多存几位」</Text>
        ，而是「显示宽度」（配合 <InlineCode>ZEROFILL</InlineCode> 补零用），对实际能存的数值范围
        <Text bold>毫无影响</Text>。MySQL 8.0 已经把它标记为废弃，所以<Text bold>别再写{' '}
        <InlineCode>INT(11)</InlineCode>，直接写 <InlineCode>INT</InlineCode> 即可</Text>。
      </ListItem>
    </UnorderedList>
    <Callout type="danger">
      <Text bold>常见坑</Text>：把「手机号」存成 <InlineCode>INT</InlineCode>。手机号 11
      位（如 13800138000）已经超过 <InlineCode>INT</InlineCode>{' '}
      的 21 亿上限，会被截断或报错。手机号、身份证号这类「看起来是数字、但不参与加减运算、可能有前导
      0」的，<Text bold>应当用字符串（<InlineCode>VARCHAR</InlineCode>）存</Text>。
    </Callout>

    <Heading3>4.2 小数类型：<InlineCode>FLOAT</InlineCode> / <InlineCode>DOUBLE</InlineCode> / <InlineCode>DECIMAL</InlineCode></Heading3>
    <Paragraph>
      这是面试高频、生产事故高发区。三者都能存小数，但<Text bold>精度机制完全不同</Text>。
    </Paragraph>
    <Table
      head={['类型', '字节', '精度', '本质', '适用场景']}
      rows={[
        ['FLOAT', '4', '单精度，约 7 位有效数字', '近似值（二进制浮点）', '对精度不敏感的科学/统计数据'],
        ['DOUBLE', '8', '双精度，约 15 位有效数字', '近似值（二进制浮点）', '同上，精度比 FLOAT 高'],
        ['DECIMAL(M,D)', '变长', '精确值', '按十进制定点存储', '金额、价格等不能错的钱'],
      ]}
    />
    <Paragraph>
      <Text bold><InlineCode>DECIMAL(M,D)</InlineCode> 语法解释：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>M</InlineCode>：总位数（精度，precision），最大 65。
      </ListItem>
      <ListItem>
        <InlineCode>D</InlineCode>：小数位数（标度，scale）。
      </ListItem>
      <ListItem>
        例如 <InlineCode>DECIMAL(10,2)</InlineCode>：总共 10 位，其中 2 位是小数 → 最大能存{' '}
        <InlineCode>99999999.99</InlineCode>（整数部分 8 位）。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例——直观感受「近似」与「精确」的差别：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE demo_money (
    price_double  DOUBLE,          -- 近似
    price_decimal DECIMAL(10, 2)   -- 精确
);

INSERT INTO demo_money VALUES (0.1 + 0.2, 0.1 + 0.2);

SELECT price_double, price_decimal FROM demo_money;`}
    />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <Table
      head={['price_double', 'price_decimal']}
      rows={[['0.30000000000000004', '0.30']]}
    />
    <Paragraph>
      看到了吗？<InlineCode>DOUBLE</InlineCode> 算 <InlineCode>0.1 + 0.2</InlineCode> 得到的是{' '}
      <InlineCode>0.30000000000000004</InlineCode>——这不是 MySQL 的 bug，而是
      <Text bold>所有用二进制浮点的语言（Java 的 <InlineCode>double</InlineCode>、JavaScript 的{' '}
      <InlineCode>number</InlineCode> 都一样）的通病</Text>
      ：很多十进制小数无法用有限位二进制精确表示。而 <InlineCode>DECIMAL</InlineCode>{' '}
      用十进制定点存储，结果就是干净的 <InlineCode>0.30</InlineCode>。
    </Paragraph>
    <Callout type="warning">
      <Text bold>注意（铁律）</Text>：<Text bold>凡是和钱有关的字段（工资、价格、金额、余额），一律用{' '}
      <InlineCode>DECIMAL</InlineCode></Text>，绝不用 <InlineCode>FLOAT</InlineCode>/<InlineCode>DOUBLE</InlineCode>
      。否则对账时多出 / 少了几厘钱，财务会找你麻烦。
    </Callout>
    <Callout type="note">
      关于本教程的 <InlineCode>emp.salary</InlineCode> 用了 <InlineCode>DOUBLE</InlineCode>
      ：那是为了和原始教学素材保持一致、且便于初学演示。<Text bold>真实项目里工资应该用{' '}
      <InlineCode>DECIMAL(10,2)</InlineCode></Text>。请把这当成一个「现实中要改正」的反面案例记住。
    </Callout>
    <Callout type="tip">
      <Paragraph>
        <Text bold>提示</Text>：在 Java（JDBC）里，<InlineCode>DECIMAL</InlineCode> 列应当映射成{' '}
        <InlineCode>java.math.BigDecimal</InlineCode>，而不是 <InlineCode>double</InlineCode>，才能保住精度：
      </Paragraph>
      <CodeBlock
        language="java"
        code={`BigDecimal salary = resultSet.getBigDecimal("salary");`}
      />
    </Callout>

    <Heading3>4.3 字符串类型：<InlineCode>CHAR</InlineCode> vs <InlineCode>VARCHAR</InlineCode></Heading3>
    <Paragraph>
      存文字。最核心的是搞懂<Text bold>定长 <InlineCode>CHAR</InlineCode> 和变长{' '}
      <InlineCode>VARCHAR</InlineCode> 的区别</Text>。
    </Paragraph>
    <Table
      head={['类型', '长度特性', '存储方式', '适用场景']}
      rows={[
        ['CHAR(n)', '定长，固定占 n 个字符', '不足 n 时用空格补齐到 n（取出时去掉尾部空格）', '长度几乎固定的：性别、国家代码、MD5、身份证号'],
        ['VARCHAR(n)', '变长，最多 n 个字符', '实际存多少占多少（+1~2 字节记长度）', '长度不定的：姓名、标题、地址、备注'],
      ]}
    />
    <Paragraph>
      <Text bold>类比记忆</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>CHAR(10)</InlineCode> 像「<Text bold>固定 10 格的格子</Text>
        」，你写「张三」也照样占 10 格，剩下 8 格用空格填满——<Text bold>取数据快</Text>
        （每行长度固定，定位方便），但<Text bold>可能浪费空间</Text>。
      </ListItem>
      <ListItem>
        <InlineCode>VARCHAR(10)</InlineCode> 像「<Text bold>伸缩抽屉</Text>
        」，最多放 10 个字符，放「张三」就只占「张三」+ 一点点长度记录——<Text bold>省空间</Text>
        ，但因为长度不定，处理上略慢一点点。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE demo_str (
    gender   CHAR(1),        -- 性别永远 1 个字 → 定长最合适
    ename    VARCHAR(20),    -- 姓名长度不定 → 变长
    intro    VARCHAR(255)    -- 简介
);

INSERT INTO demo_str VALUES ('男', '诸葛孔明', '蜀汉丞相');
SELECT CONCAT('[', gender, ']') AS g, ename FROM demo_str;`}
    />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <Table
      head={['g', 'ename']}
      rows={[['[男]', '诸葛孔明']]}
    />
    <Callout type="warning">
      <Text bold>注意：长度单位是「字符」不是「字节」</Text>。在 <InlineCode>utf8mb4</InlineCode> 下，
      <InlineCode>VARCHAR(20)</InlineCode> 能存 20 个汉字（早期按字节算的认知是错的，那是更老的版本/字符集）。所以{' '}
      <InlineCode>ename VARCHAR(20)</InlineCode> 存「诸葛孔明」（4 字）绰绰有余。
    </Callout>
    <Callout type="danger">
      <Text bold>常见坑 1</Text>：超长截断。如果往 <InlineCode>VARCHAR(20)</InlineCode> 塞 21 个字符，在严格模式（MySQL 8
      默认严格）下会<Text bold>直接报错</Text> <InlineCode>ERROR 1406: Data too long for column</InlineCode>
      ；在非严格模式下会被悄悄截断成 20 个，丢数据。所以列长度要留足余量。
    </Callout>
    <Callout type="danger">
      <Text bold>常见坑 2</Text>：<InlineCode>CHAR</InlineCode> 的尾部空格被吃掉。<InlineCode>CHAR</InlineCode>{' '}
      在比较和取出时会去掉尾部空格，存 <InlineCode>'abc   '</InlineCode> 取出来是 <InlineCode>'abc'</InlineCode>
      。如果你的业务真的要保留尾部空格，用 <InlineCode>VARCHAR</InlineCode>。
    </Callout>

    <Heading3>4.4 大文本与二进制：<InlineCode>TEXT</InlineCode> / <InlineCode>BLOB</InlineCode></Heading3>
    <Paragraph>
      当内容可能很长（一篇文章、一段 JSON），超过 <InlineCode>VARCHAR</InlineCode> 上限时，用{' '}
      <InlineCode>TEXT</InlineCode> 系列；存图片、文件等二进制用 <InlineCode>BLOB</InlineCode> 系列。
    </Paragraph>
    <Table
      head={['类型', '最大长度（约）', '存什么']}
      rows={[
        ['TINYTEXT', '255 字节', '很短文本'],
        ['TEXT', '64 KB', '文章、长描述、JSON 字符串'],
        ['MEDIUMTEXT', '16 MB', '超长文本'],
        ['LONGTEXT', '4 GB', '极长文本'],
        ['BLOB 系列', '同上量级', '二进制：图片、音频、文件'],
      ]}
    />
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE demo_article (
    id      INT PRIMARY KEY AUTO_INCREMENT,
    title   VARCHAR(100),    -- 标题用 VARCHAR
    content TEXT,            -- 正文可能很长，用 TEXT
    cover   BLOB             -- 封面图二进制（实际项目更推荐存 OSS/文件系统，库里只存 URL）
);`}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：<InlineCode>TEXT</InlineCode> / <InlineCode>BLOB</InlineCode>
      {' '}不能设默认值，且检索性能不如 <InlineCode>VARCHAR</InlineCode>
      。实际工程里<Text bold>很少把大文件直接塞进数据库</Text>
      ——通常把文件存到对象存储（如阿里云 OSS），数据库里只用 <InlineCode>VARCHAR</InlineCode> 存一个访问 URL。
      <InlineCode>BLOB</InlineCode> 了解即可。
    </Callout>

    <Heading3>4.5 日期时间类型：<InlineCode>DATE</InlineCode> / <InlineCode>DATETIME</InlineCode> / <InlineCode>TIMESTAMP</InlineCode></Heading3>
    <Paragraph>存日期和时间，三者区别要分清。</Paragraph>
    <Table
      head={['类型', '格式', '范围', '占用', '特点']}
      rows={[
        ['DATE', 'YYYY-MM-DD', '1000-01-01 ~ 9999-12-31', '3 字节', '只有年月日'],
        ['TIME', 'HH:MM:SS', '-838:59:59 ~ 838:59:59', '3 字节', '只有时分秒'],
        ['DATETIME', 'YYYY-MM-DD HH:MM:SS', '1000 年 ~ 9999 年', '8 字节', '年月日 + 时分秒，与时区无关，存什么取什么'],
        ['TIMESTAMP', 'YYYY-MM-DD HH:MM:SS', '1970 ~ 2038-01-19', '4 字节', '受时区影响，可自动更新'],
      ]}
    />
    <Paragraph>
      <Text bold>示例——三种类型的直观差异：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE demo_time (
    join_date  DATE,        -- 入职日期：只关心哪天 → DATE
    create_at  DATETIME,    -- 创建时间：要精确到秒，且不希望随时区变 → DATETIME
    update_at  TIMESTAMP    -- 更新时间：随系统时区，且想自动更新 → TIMESTAMP
);

INSERT INTO demo_time (join_date, create_at, update_at)
VALUES ('2020-01-10', '2020-01-10 09:30:00', '2020-01-10 09:30:00');

SELECT * FROM demo_time;`}
    />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <Table
      head={['join_date', 'create_at', 'update_at']}
      rows={[['2020-01-10', '2020-01-10 09:30:00', '2020-01-10 09:30:00']]}
    />

    <Heading4>4.5.1 <InlineCode>TIMESTAMP</InlineCode> 的两大特殊行为</Heading4>
    <Paragraph>
      <Text bold>特殊点 1：受时区影响。</Text> <InlineCode>TIMESTAMP</InlineCode>{' '}
      内部实际存的是「从 1970-01-01 UTC 起的秒数（时间戳）」，读写时会根据<Text bold>当前会话时区</Text>做换算。
      <InlineCode>DATETIME</InlineCode> 则是「你存啥它存啥」，跟时区无关。
    </Paragraph>
    <Paragraph>
      举例：同一行 <InlineCode>TIMESTAMP</InlineCode> 数据，把会话时区从北京（+8）改成
      UTC（+0），读出来会差 8 小时；而 <InlineCode>DATETIME</InlineCode> 纹丝不动。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SET time_zone = '+08:00';
SELECT update_at FROM demo_time;   -- 2020-01-10 09:30:00

SET time_zone = '+00:00';
SELECT update_at FROM demo_time;   -- 2020-01-10 01:30:00（往前 8 小时）`}
    />
    <Paragraph>
      <Text bold>特殊点 2：可自动维护时间。</Text> <InlineCode>TIMESTAMP</InlineCode>（以及 MySQL 5.6.5+ 的{' '}
      <InlineCode>DATETIME</InlineCode>）支持两个自动属性：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>DEFAULT CURRENT_TIMESTAMP</InlineCode>：插入新行时，自动填入「当前时间」；
      </ListItem>
      <ListItem>
        <InlineCode>ON UPDATE CURRENT_TIMESTAMP</InlineCode>：每次该行被 <InlineCode>UPDATE</InlineCode>{' '}
        时，自动刷新成「当前时间」。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例——做一个自动维护「创建时间 + 更新时间」的表：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE demo_auto_time (
    id        INT PRIMARY KEY AUTO_INCREMENT,
    content   VARCHAR(50),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                              -- 插入时自动填
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP   -- 插入时填 + 每次改自动刷新
);

INSERT INTO demo_auto_time (content) VALUES ('第一条');
SELECT * FROM demo_auto_time;`}
    />
    <Paragraph>
      <Text bold>结果（时间为示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'content', 'create_at', 'update_at']}
      rows={[['1', '第一条', '2026-06-07 10:00:00', '2026-06-07 10:00:00']]}
    />
    <Paragraph>过一会儿更新它：</Paragraph>
    <CodeBlock
      language="sql"
      code={`UPDATE demo_auto_time SET content = '改过了' WHERE id = 1;
SELECT * FROM demo_auto_time;`}
    />
    <Paragraph>
      <Text bold>结果：</Text>
    </Paragraph>
    <Table
      head={['id', 'content', 'create_at', 'update_at']}
      rows={[['1', '改过了', '2026-06-07 10:00:00', '2026-06-07 10:05:30']]}
    />
    <Paragraph>
      注意 <InlineCode>create_at</InlineCode> 没变，而 <InlineCode>update_at</InlineCode>{' '}
      自动刷新了。这套机制在实际开发里非常常用，省去手动维护时间字段的麻烦。
    </Paragraph>
    <Callout type="danger">
      <Text bold>常见坑：<InlineCode>TIMESTAMP</InlineCode> 的 2038 问题</Text>。
      <InlineCode>TIMESTAMP</InlineCode> 只能表示到 <Text bold>2038-01-19 03:14:07 UTC</Text>（4
      字节秒数会溢出，俗称「2038 千年虫」）。如果你的业务可能涉及 2038 年以后的时间（比如 30
      年期的贷款到期日），<Text bold>用 <InlineCode>DATETIME</InlineCode> 而不是{' '}
      <InlineCode>TIMESTAMP</InlineCode></Text>。
    </Callout>
    <Callout type="tip">
      <Paragraph>
        <Text bold><InlineCode>DATETIME</InlineCode> 还是 <InlineCode>TIMESTAMP</InlineCode>？经验法则</Text>：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          想要「自动随时区换算」「自动更新」、且时间不会超过 2038 → <InlineCode>TIMESTAMP</InlineCode>（常用于{' '}
          <InlineCode>update_time</InlineCode>）。
        </ListItem>
        <ListItem>
          想要「存啥取啥、不受时区干扰、范围大」→ <InlineCode>DATETIME</InlineCode>（常用于业务日期，如合同到期、预约时间）。
        </ListItem>
        <ListItem>
          只要日期不要时间 → <InlineCode>DATE</InlineCode>（如本教程的 <InlineCode>join_date</InlineCode>）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>4.6 数据类型选择「速查口诀」</Heading3>
    <UnorderedList>
      <ListItem>
        整数默认 <InlineCode>INT</InlineCode>，可能上亿用 <InlineCode>BIGINT</InlineCode>，状态/布尔用{' '}
        <InlineCode>TINYINT</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>钱必用 <InlineCode>DECIMAL</InlineCode></Text>，科学统计才考虑 <InlineCode>DOUBLE</InlineCode>，
        <InlineCode>FLOAT</InlineCode> 基本别用。
      </ListItem>
      <ListItem>
        短而定长（性别、代码）用 <InlineCode>CHAR</InlineCode>，其余文字用 <InlineCode>VARCHAR</InlineCode>
        ，超长用 <InlineCode>TEXT</InlineCode>。
      </ListItem>
      <ListItem>
        手机号/身份证号/银行卡号 → <InlineCode>VARCHAR</InlineCode>（别用整数！）。
      </ListItem>
      <ListItem>
        只要日期 <InlineCode>DATE</InlineCode>；要时间且怕 2038/要存啥取啥 <InlineCode>DATETIME</InlineCode>
        ；要自动更新/时区 <InlineCode>TIMESTAMP</InlineCode>。
      </ListItem>
    </UnorderedList>

    <Divider />

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

    <Divider />

    <Subtitle>8. 图形化工具：SQLyog / Navicat 等</Subtitle>
    <Paragraph>
      到目前为止我们都在「命令行」里敲 SQL。命令行最纯粹、最能锻炼基本功，但日常开发中，大家更常用
      <Text bold>图形化客户端</Text>（GUI）来连接和管理 MySQL，因为它<Text bold>直观、不易记错命令、能可视化看数据</Text>。
    </Paragraph>
    <Paragraph>常见图形化工具：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>SQLyog</Text>：轻量、专注 MySQL，老牌教学常用。
      </ListItem>
      <ListItem>
        <Text bold>Navicat</Text>：功能全、界面友好，商业软件（有试用）。
      </ListItem>
      <ListItem>
        <Text bold>DBeaver</Text>：免费开源、跨数据库（不止 MySQL）。
      </ListItem>
      <ListItem>
        <Text bold>MySQL Workbench</Text>：MySQL 官方出品，免费。
      </ListItem>
      <ListItem>
        <Text bold>DataGrip / IDEA 内置 Database 工具</Text>：JetBrains 系，写 Java 的同学常用。
      </ListItem>
    </UnorderedList>
    <Paragraph>它们的操作逻辑大同小异，下面以「SQLyog / Navicat 通用流程」讲解。</Paragraph>

    <Heading3>8.1 连接配置</Heading3>
    <Paragraph>
      打开工具，新建一个连接，本质上是填这几项参数（和命令行 <InlineCode>mysql -h... -P... -u... -p</InlineCode>{' '}
      一一对应）：
    </Paragraph>
    <Table
      head={['GUI 里的字段', '含义', '常见默认值', '对应命令行参数']}
      rows={[
        ['Host / 主机', '数据库服务器地址', 'localhost 或 127.0.0.1', '-h'],
        ['Port / 端口', 'MySQL 监听端口', '3306', '-P'],
        ['Username / 用户名', '登录账号', 'root', '-u'],
        ['Password / 密码', '登录密码', '安装时设置的密码', '-p'],
      ]}
    />
    <Paragraph>
      填好后点「测试连接 / Test Connection」，提示成功就能「连接 / Connect」。连上后，左侧会以
      <Text bold>树形结构</Text>列出：连接 → 数据库（库）→ 表 → 列。
    </Paragraph>
    <Callout type="danger">
      <Text bold>常见坑</Text>：
      <UnorderedList>
        <ListItem>
          连不上、报 <InlineCode>2003 - Can't connect</InlineCode>：多半是 MySQL
          服务没启动，或端口/主机填错，或防火墙拦了。
        </ListItem>
        <ListItem>
          报 <InlineCode>1045 - Access denied</InlineCode>：用户名或密码错了。
        </ListItem>
        <ListItem>
          远程连接报错：默认 <InlineCode>root</InlineCode> 可能只允许 <InlineCode>localhost</InlineCode>
          {' '}登录，需要授权远程访问（这是权限话题，后续章节讲）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8.2 可视化建库、建表</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>建库</Text>：在左侧空白处右键 → 「Create Database / 新建数据库」，弹出对话框，填库名（如{' '}
        <InlineCode>db_learn</InlineCode>）、选字符集（<InlineCode>utf8mb4</InlineCode>）、排序规则，点确定。
      </ListItem>
      <ListItem>
        <Text bold>建表</Text>：在某个库下右键 → 「Create Table / 新建表」，弹出一个<Text bold>表格界面</Text>
        ，你像填 Excel 一样一行行加列：填列名、下拉选数据类型、设长度、勾选「主键 / 非空 /
        自增」等。保存时让你输入表名。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      整个过程<Text bold>不用记 SQL 语法</Text>，鼠标点选即可。这就是 GUI 最大的好处——把第 3 节那些{' '}
      <InlineCode>CREATE TABLE</InlineCode> 语法变成了「填表格 + 打勾」。
    </Paragraph>

    <Heading3>8.3 执行 SQL、查看数据</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>写 SQL</Text>：工具里都有「Query / 查询编辑器」窗口，把 SQL 粘进去，点「执行（运行）」按钮（通常是
        F9 或 Ctrl+Enter），下方就显示结果集。
      </ListItem>
      <ListItem>
        <Text bold>看数据</Text>：双击左侧某张表，会直接以<Text bold>表格形式</Text>
        展示数据，可以直接在格子里改、加、删行（改完点保存）——底层照样转成{' '}
        <InlineCode>UPDATE</InlineCode>/<InlineCode>INSERT</InlineCode>/<InlineCode>DELETE</InlineCode>{' '}
        发给数据库。
      </ListItem>
    </UnorderedList>

    <Heading3>8.4 关键认知：图形操作的本质仍是「生成 SQL」</Heading3>
    <Paragraph>
      这是本节最想让你记住的一句话：<Text bold>所有图形化操作，最终都被工具翻译成 SQL 发给 MySQL 执行。</Text>{' '}
      鼠标点点点，只是工具替你「拼 SQL」而已。
    </Paragraph>
    <Paragraph>
      证据：当你用 GUI 可视化建完一张表后，工具通常提供「<Text bold>查看 SQL / Show SQL / SQL 预览</Text>
      」按钮，点开你会看到它生成的，正是和第 3 节一模一样的 <InlineCode>CREATE TABLE ...</InlineCode> 语句。
    </Paragraph>
    <Callout type="tip">
      <Paragraph>
        <Text bold>学习建议</Text>：
      </Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>初学务必先用命令行 / 手写 SQL</Text>，把语法刻进脑子里。SQL
          是数据库的「普通话」，换任何工具、任何数据库（部分通用）都用得上；而 GUI
          的按钮位置各家不同，学了不通用。
        </ListItem>
        <ListItem>
          <Text bold>熟练后再用 GUI 提效</Text>：日常浏览数据、临时改几条记录、画 ER 图，GUI 又快又直观。
        </ListItem>
        <ListItem>
          <Text bold>善用 GUI 的「生成 SQL」反向学习</Text>：不会写某条 SQL 时，先用 GUI 点出来，再看它生成的
          SQL，是很好的学习方法。
        </ListItem>
      </OrderedList>
      <Paragraph>
        一句话：<Text bold>GUI 是「方向盘助力」，SQL 才是「发动机」</Text>。会开手动挡（命令行），再开自动挡（GUI）轻轻松松；反过来只会点鼠标，一旦上了没有
        GUI 的生产服务器（只能 SSH + 命令行）就抓瞎了。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>9. 本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>查表三件套</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>SHOW TABLES;</InlineCode> 看当前库有哪些表；
          </ListItem>
          <ListItem>
            <InlineCode>DESC 表名;</InlineCode> 看精简结构（列名、类型、约束）；
          </ListItem>
          <ListItem>
            <InlineCode>SHOW CREATE TABLE 表名;</InlineCode> 看完整建表语句（含字符集、引擎、索引）。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>建表</Text>：<InlineCode>CREATE TABLE 表名(列名 类型 [约束], ...)</InlineCode>
        ，最后一列后不加逗号；有外键时<Text bold>先建被引用表</Text>。
      </ListItem>
      <ListItem>
        <Text bold>数据类型口诀</Text>：
        <UnorderedList>
          <ListItem>
            整数：默认 <InlineCode>INT</InlineCode>，超大 <InlineCode>BIGINT</InlineCode>，状态{' '}
            <InlineCode>TINYINT</InlineCode>；别用 <InlineCode>INT(11)</InlineCode> 那种宽度写法。
          </ListItem>
          <ListItem>
            小数：<Text bold>钱用 <InlineCode>DECIMAL</InlineCode></Text>（精确），
            <InlineCode>DOUBLE</InlineCode>/<InlineCode>FLOAT</InlineCode> 是近似值会丢精度。
          </ListItem>
          <ListItem>
            字符串：定长 <InlineCode>CHAR</InlineCode>（性别、代码），变长 <InlineCode>VARCHAR</InlineCode>
            （姓名、地址），超长 <InlineCode>TEXT</InlineCode>，二进制 <InlineCode>BLOB</InlineCode>
            ；手机号/身份证用 <InlineCode>VARCHAR</InlineCode>。
          </ListItem>
          <ListItem>
            日期：只要日期 <InlineCode>DATE</InlineCode>；要时间且范围大/存啥取啥 <InlineCode>DATETIME</InlineCode>
            ；要时区/自动更新且不过 2038 用 <InlineCode>TIMESTAMP</InlineCode>。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>删表</Text>：<InlineCode>DROP TABLE [IF EXISTS] 表名;</InlineCode>
        ；删表注意外键依赖<Text bold>先删引用方</Text>；分清 <InlineCode>DROP</InlineCode>（删表）/
        <InlineCode>TRUNCATE</InlineCode>（清空）/<InlineCode>DELETE</InlineCode>（按条件删数据）。
      </ListItem>
      <ListItem>
        <Text bold>改表 <InlineCode>ALTER TABLE</InlineCode></Text>：<InlineCode>RENAME TO</InlineCode>
        （改名）、<InlineCode>CHARACTER SET</InlineCode>（改字符集）、<InlineCode>ADD</InlineCode>（加列）、
        <InlineCode>CHANGE</InlineCode>（改名+类型，写两个列名）、<InlineCode>MODIFY</InlineCode>
        （只改类型，写一个列名）、<InlineCode>DROP</InlineCode>（删列）。
      </ListItem>
      <ListItem>
        <Text bold>复制表结构</Text>：<InlineCode>CREATE TABLE 新 LIKE 旧;</InlineCode>（结构+约束，不带数据）；
        <InlineCode>CREATE TABLE 新 AS SELECT ...;</InlineCode>（带数据，不带约束）。
      </ListItem>
      <ListItem>
        <Text bold>图形化工具</Text>：SQLyog/Navicat 等，连接 = 填
        主机/端口/用户名/密码；可视化建库建表、看改数据都很方便；但<Text bold>本质都是替你生成 SQL</Text>
        ，所以<Text bold>先练好 SQL 命令，再用 GUI 提效</Text>。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>10. 常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>Q1：<InlineCode>CHAR</InlineCode> 和 <InlineCode>VARCHAR</InlineCode> 有什么区别？什么时候用哪个？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>CHAR(n)</InlineCode> 定长，永远占 n 个字符，不足补空格，读取快但费空间，适合长度固定的（性别、国家码、MD5）；
      <InlineCode>VARCHAR(n)</InlineCode> 变长，实际多长占多长（额外 1~2
      字节记长度），省空间，适合长度不定的（姓名、地址）。规则：长度几乎不变用 <InlineCode>CHAR</InlineCode>
      ，否则用 <InlineCode>VARCHAR</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q2：存金额为什么不能用 <InlineCode>FLOAT</InlineCode>/<InlineCode>DOUBLE</InlineCode>？</Text>
    </Paragraph>
    <Paragraph>
      A：它们是二进制浮点数，是<Text bold>近似值</Text>，像 <InlineCode>0.1+0.2</InlineCode> 会得到{' '}
      <InlineCode>0.30000000000000004</InlineCode>，做金额累加会出现分厘误差。金额必须用{' '}
      <InlineCode>DECIMAL(M,D)</InlineCode>，它按十进制定点精确存储。Java 端对应 <InlineCode>BigDecimal</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q3：<InlineCode>DATETIME</InlineCode> 和 <InlineCode>TIMESTAMP</InlineCode> 区别？</Text>
    </Paragraph>
    <Paragraph>
      A：① 范围：<InlineCode>DATETIME</InlineCode> 1000~9999 年，<InlineCode>TIMESTAMP</InlineCode> 只到 2038
      年（有溢出问题）。② 时区：<InlineCode>TIMESTAMP</InlineCode> 受会话时区影响、读写会换算，
      <InlineCode>DATETIME</InlineCode> 存啥取啥与时区无关。③ 占用：<InlineCode>TIMESTAMP</InlineCode> 4 字节、
      <InlineCode>DATETIME</InlineCode> 8 字节。④ 两者都支持 <InlineCode>DEFAULT CURRENT_TIMESTAMP</InlineCode>{' '}
      和 <InlineCode>ON UPDATE CURRENT_TIMESTAMP</InlineCode> 自动维护时间。怕 2038、要自动更新用{' '}
      <InlineCode>TIMESTAMP</InlineCode>；范围大、要稳定用 <InlineCode>DATETIME</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q4：<InlineCode>ALTER TABLE</InlineCode> 里 <InlineCode>CHANGE</InlineCode> 和{' '}
      <InlineCode>MODIFY</InlineCode> 有啥不同？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>CHANGE</InlineCode> 能同时改<Text bold>列名和类型</Text>，语法要写两个列名（旧名 +
      新名）；<InlineCode>MODIFY</InlineCode> 只能改<Text bold>类型</Text>，写一个列名即可。只改类型用{' '}
      <InlineCode>MODIFY</InlineCode> 更省事。
    </Paragraph>
    <Paragraph>
      <Text bold>Q5：<InlineCode>DROP</InlineCode>、<InlineCode>TRUNCATE</InlineCode>、
      <InlineCode>DELETE</InlineCode> 三者区别？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>DROP TABLE</InlineCode> 删整张表（结构+数据全没，DDL）；<InlineCode>TRUNCATE TABLE</InlineCode>{' '}
      清空所有数据但保留空表结构（DDL，很快，不可加条件）；<InlineCode>DELETE FROM ... WHERE</InlineCode>{' '}
      删符合条件的数据行（DML，可回滚、可带条件，逐行删较慢）。
    </Paragraph>
    <Paragraph>
      <Text bold>Q6：手机号应该用什么类型？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>VARCHAR</InlineCode>（如 <InlineCode>VARCHAR(11)</InlineCode> 或{' '}
      <InlineCode>VARCHAR(20)</InlineCode>）。原因：手机号不参与算术运算、长度固定但可能有前导 0、且 11
      位会超出 <InlineCode>INT</InlineCode> 范围。同理身份证号、银行卡号都用字符串。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：<InlineCode>CREATE TABLE ... LIKE</InlineCode> 和{' '}
      <InlineCode>CREATE TABLE ... AS SELECT</InlineCode> 区别？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>LIKE</InlineCode> 复制完整结构（含主键、索引、约束）但<Text bold>不复制数据</Text>；
      <InlineCode>AS SELECT</InlineCode> 复制<Text bold>列和数据</Text>，但
      <Text bold>不复制主键、自增、索引、外键</Text>等约束。要纯结构用 <InlineCode>LIKE</InlineCode>
      ，要带数据用 <InlineCode>AS SELECT</InlineCode>（之后再手动补约束）。
    </Paragraph>
    <Paragraph>
      <Text bold>Q8：图形化工具操作和写 SQL 是两回事吗？</Text>
    </Paragraph>
    <Paragraph>
      A：不是。GUI 的所有「点选」最终都被翻译成 SQL
      发给数据库执行，很多工具还能让你「查看生成的 SQL」。所以学好 SQL 是根本，GUI 只是效率工具。
    </Paragraph>
  </article>
);

export default index;
