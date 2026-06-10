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
    <Title>DML：数据的添加、删除、修改</Title>

    <Subtitle>本章导读</Subtitle>
    <Paragraph>
      前面几章我们学会了如何用 <Text bold>DDL</Text>（数据定义语言，
      <InlineCode>CREATE / ALTER / DROP</InlineCode>）把“表”这个“容器”创建好——相当于在
      Excel 里画好了表头和列。但<Text bold>画好的表里还是空的</Text>
      ，要让它真正有用，必须往里面<Text bold>装数据</Text>、<Text bold>改数据</Text>、
      <Text bold>删数据</Text>。
    </Paragraph>
    <Paragraph>
      这就是本章的主角：
      <Text bold>DML（Data Manipulation Language，数据操作语言）</Text>
      。它只干三件事：
    </Paragraph>
    <Table
      head={['操作', '关键字', '大白话', '对应 CRUD']}
      rows={[
        ['增（添加）', 'INSERT', '往表里塞一行（或多行）新数据', 'Create'],
        ['删（删除）', 'DELETE', '把符合条件的行从表里抹掉', 'Delete'],
        ['改（修改）', 'UPDATE', '把已有的行里的某些值改掉', 'Update'],
      ]}
    />
    <Callout type="tip" title="提示">
      CRUD 里的 <Text bold>R（Read，查询）</Text> 用的是 <InlineCode>SELECT</InlineCode>
      ，它属于 <Text bold>DQL（数据查询语言）</Text>
      ，是下一章的重点。本章专注于“写”——增、删、改。
    </Callout>
    <Paragraph>
      <Text bold>为什么这章特别重要？</Text>
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>它是日常开发中使用频率最高的一类语句</Text>
        ：你写的每一个“注册用户”“下订单”“改密码”“删评论”，背后都是{' '}
        <InlineCode>INSERT / UPDATE / DELETE</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>它最容易“翻车”</Text>：<InlineCode>DELETE</InlineCode> 和{' '}
        <InlineCode>UPDATE</InlineCode> 一旦<Text bold>忘了写 </Text>
        <InlineCode>WHERE</InlineCode>
        ，会瞬间把整张表的数据“团灭”，这是新手乃至老手都犯过的“删库”事故。本章会反复、重点地警示这个坑。
      </ListItem>
    </OrderedList>
    <Paragraph>
      <Text bold>与前后章的关系</Text>：上承 DDL（表已建好），下启
      DQL（查询）。学完本章，你就能把数据“灌”进表里，为下一章的各种查询练习准备好“弹药”。
    </Paragraph>

    <Divider />

    <Subtitle>0. 准备工作：建库建表（沿用全套教程的公共示例）</Subtitle>
    <Paragraph>
      本章所有例子都基于数据库 <InlineCode>db_learn</InlineCode> 的两张核心表：部门表{' '}
      <InlineCode>dept</InlineCode> 与员工表 <InlineCode>emp</InlineCode>
      （一对多关系：一个部门有多名员工）。如果你前面章节已经建过，可以跳过；为保证每章可独立运行，这里再贴一遍完整的建库建表脚本。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 1. 创建并切换数据库
CREATE DATABASE IF NOT EXISTS db_learn DEFAULT CHARSET utf8mb4;
USE db_learn;

-- 2. 部门表
CREATE TABLE dept (
  id INT PRIMARY KEY AUTO_INCREMENT,   -- 部门编号
  dept_name VARCHAR(20),               -- 部门名称
  loc VARCHAR(20)                      -- 所在城市
);

INSERT INTO dept (dept_name, loc) VALUES
  ('研发部','北京'), ('市场部','上海'), ('财务部','广州');

-- 3. 员工表
CREATE TABLE emp (
  id INT PRIMARY KEY AUTO_INCREMENT,   -- 员工编号
  ename VARCHAR(20),                   -- 姓名
  gender CHAR(1),                      -- 性别 男/女
  salary DOUBLE,                       -- 工资
  join_date DATE,                      -- 入职日期
  dept_id INT,                         -- 所属部门(外键->dept.id)
  bonus DOUBLE,                        -- 奖金(可能为 NULL，用于讲解 NULL)
  CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);

INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
  ('张三','男',8000, '2020-01-10', 1, 1000),
  ('李四','男',12000,'2019-03-15', 1, NULL),
  ('王五','女',9500, '2021-06-01', 2, 2000),
  ('赵六','女',6000, '2022-09-20', 2, NULL),
  ('孙七','男',15000,'2018-11-05', 3, 3000);`}
    />
    <Paragraph>
      执行后，<InlineCode>emp</InlineCode> 表的初始数据如下（
      <Text bold>本章后续所有“执行结果”都以这份初始数据为基准</Text>
      ，除非特别说明）：
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', 'join_date', 'dept_id', 'bonus']}
      rows={[
        ['1', '张三', '男', '8000', '2020-01-10', '1', '1000'],
        ['2', '李四', '男', '12000', '2019-03-15', '1', 'NULL'],
        ['3', '王五', '女', '9500', '2021-06-01', '2', '2000'],
        ['4', '赵六', '女', '6000', '2022-09-20', '2', 'NULL'],
        ['5', '孙七', '男', '15000', '2018-11-05', '3', '3000'],
      ]}
    />
    <Callout type="tip" title="提示">
      练习增删改时，建议你<Text bold>单独开一个练习库或练习表</Text>
      ，或者随时准备好上面这段脚本，改坏了就 <InlineCode>DROP TABLE</InlineCode>
      重建。本章很多例子会真的改动数据，为了不互相干扰，我会在关键例子前提醒你“先恢复初始数据”。
    </Callout>

    <Divider />

    <Subtitle>1. 添加数据：INSERT</Subtitle>

    <Heading3>1.1 是什么 / 为什么</Heading3>
    <Paragraph>
      <InlineCode>INSERT</InlineCode> 就是<Text bold>往表里“插入”一行或多行新记录</Text>
      。表是二维的（行 × 列），插入的本质是：
      <Text bold>给每一列指定一个值，凑成完整的一行，追加到表的末尾</Text>。
    </Paragraph>
    <Paragraph>
      类比：表就像一个 Excel 工作表，<InlineCode>INSERT</InlineCode>
      就是在最下面<Text bold>新增一行</Text>并填好每个单元格。
    </Paragraph>

    <Heading3>1.2 语法格式（标准写法：指定列名）</Heading3>
    <CodeBlock
      language="sql"
      code={`INSERT INTO 表名 (列1, 列2, 列3, ...) VALUES (值1, 值2, 值3, ...);`}
    />
    <Paragraph>
      <Text bold>逐项解释</Text>：
    </Paragraph>
    <Table
      head={['部分', '含义']}
      rows={[
        ['INSERT INTO 表名', '指明要往哪张表里插数据'],
        ['(列1, 列2, ...)', '你打算给哪些列赋值（列清单，可只写一部分列）'],
        ['VALUES', '关键字，后面跟具体的值'],
        ['(值1, 值2, ...)', '与前面的列清单一一对应的值'],
      ]}
    />
    <Paragraph>
      <Text bold>核心规则：列与值“一一对应”</Text>。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        列清单写了 3 个列，<InlineCode>VALUES</InlineCode> 后面就必须给 3 个值；
      </ListItem>
      <ListItem>
        顺序、个数、类型都要对得上：第 1 个值给第 1 列，第 2 个值给第 2 列……
      </ListItem>
    </UnorderedList>

    <Heading3>1.3 示例：插入一行（指定列名）</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 给研发部(dept_id=1)新增一名员工"周八"
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus)
VALUES ('周八', '男', 7000, '2023-02-01', 1, 500);`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：提示 <InlineCode>Query OK, 1 row affected</InlineCode>
      （1 行受影响）。此时表里多了一行：
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', 'join_date', 'dept_id', 'bonus']}
      rows={[
        ['...', '...', '...', '...', '...', '...', '...'],
        ['6', '周八', '男', '7000', '2023-02-01', '1', '500'],
      ]}
    />
    <Callout type="note">
      注意：<InlineCode>id</InlineCode> 我们<Text bold>没写</Text>
      ，它是自增主键，自动取了 6（接着之前最大的 5）。下文 1.6 节会专门讲自增列。
    </Callout>

    <Heading3>1.4 一次插入多行（推荐！效率高）</Heading3>
    <Paragraph>
      不用写多条 <InlineCode>INSERT</InlineCode>，在一条语句里用逗号分隔多组{' '}
      <InlineCode>VALUES</InlineCode> 即可：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO 表名 (列1, 列2, ...) VALUES
  (值1a, 值2a, ...),
  (值1b, 值2b, ...),
  (值1c, 值2c, ...);`}
    />
    <Paragraph>
      <Text bold>示例</Text>：一次给市场部、财务部各补几个人。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
  ('吴九', '女', 8800, '2023-03-10', 2, NULL),
  ('郑十', '男', 6500, '2023-04-05', 3, 800),
  ('钱多多', '女', 20000, '2023-05-20', 1, 5000);`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>Query OK, 3 rows affected</InlineCode>
      （3 行受影响）。一条语句插入了 3 行。
    </Paragraph>
    <Callout type="tip" title="提示">
      一次插入多行不仅写起来短，<Text bold>性能也明显更好</Text>
      。因为数据库只需“解析一次语句、做一次事务提交”，而分成 3 条{' '}
      <InlineCode>INSERT</InlineCode>
      要解析 3 次、提交 3 次。批量导入数据时，请务必用“一条多行”的写法。
    </Callout>
    <Callout type="warning" title="注意">
      一条多行 <InlineCode>INSERT</InlineCode> 是一个<Text bold>整体（原子操作）</Text>
      ——只要其中一行违反约束（比如某行的 <InlineCode>dept_id</InlineCode> 在{' '}
      <InlineCode>dept</InlineCode> 表里不存在，违反外键），
      <Text bold>整条语句失败，一行都插不进去</Text>，不会“插一半”。
    </Callout>

    <Heading3>1.5 省略列名的写法（不推荐，但要看得懂）</Heading3>
    <Paragraph>
      如果你<Text bold>不写列清单</Text>，那就表示“我要给所有列、按表定义的顺序全部赋值”：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 不写列名，必须按 emp 表定义顺序给"全部列"的值：
-- id, ename, gender, salary, join_date, dept_id, bonus
INSERT INTO emp VALUES
  (NULL, '冯十一', '男', 9000, '2023-06-01', 2, 1200);`}
    />
    <Paragraph>
      <Text bold>逐项解释</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        因为没写列清单，<InlineCode>VALUES</InlineCode> 里必须
        <Text bold>给齐全部 7 个列</Text>，<Text bold>一个都不能少、顺序一个都不能错</Text>。
      </ListItem>
      <ListItem>
        第一个 <InlineCode>id</InlineCode> 列是自增主键，我们不想自己指定，就填{' '}
        <InlineCode>NULL</InlineCode>（让它自动生成）。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>Query OK, 1 row affected</InlineCode>
      ，新增一行，<InlineCode>id</InlineCode> 自动取下一个值。
    </Paragraph>
    <Callout type="danger" title="常见坑：省略列名很脆弱">
      <UnorderedList>
        <ListItem>
          它要求你给“全部列”，少一个值就报错：
          <InlineCode>Column count doesn't match value count</InlineCode>
          （列数和值数不匹配）。
        </ListItem>
        <ListItem>
          一旦将来用 <InlineCode>ALTER TABLE</InlineCode> 给表
          <Text bold>加了一列</Text>，所有“省略列名”的旧 <InlineCode>INSERT</InlineCode>
          语句都会因为列数对不上而<Text bold>全部报错</Text>，维护起来非常痛苦。
        </ListItem>
      </UnorderedList>
      <Paragraph>
        ✅ <Text bold>强烈建议</Text>：<Text bold>永远显式写出列名</Text>（即 1.2
        的标准写法）。这样可读性好、对加列不敏感、还能只插部分列。本教程后续也都用标准写法。
      </Paragraph>
    </Callout>

    <Heading3>1.6 自增列（AUTO_INCREMENT）怎么填</Heading3>
    <Paragraph>
      <InlineCode>emp.id</InlineCode> 定义为{' '}
      <InlineCode>INT PRIMARY KEY AUTO_INCREMENT</InlineCode>
      ，即“自动递增的主键”。它的值由数据库自动维护（每插一行加 1），我们通常
      <Text bold>不需要、也不应该手动指定</Text>
      。给自增列赋值有三种等价的“交给数据库自己来”的写法：
    </Paragraph>
    <Table
      head={['写法', '示例', '含义']}
      rows={[
        [
          '省略该列（推荐）',
          'INSERT INTO emp (ename, gender, ...) VALUES (...)（列清单里不含 id）',
          '不提它，数据库自动生成',
        ],
        [
          '写 NULL',
          "INSERT INTO emp VALUES (NULL, '某某', ...)",
          '显式让它自动生成',
        ],
        [
          '写 DEFAULT',
          "INSERT INTO emp VALUES (DEFAULT, '某某', ...)",
          '同上，用默认行为（即自增）',
        ],
      ]}
    />
    <Paragraph>
      <Text bold>示例对比</Text>（三种写法效果相同，都让 id 自动生成）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 写法1：省略 id 列（最推荐）
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus)
VALUES ('自增测试A', '男', 5000, '2024-01-01', 1, NULL);

-- 写法2：id 位置写 NULL（省略列名，必须给全列）
INSERT INTO emp VALUES (NULL, '自增测试B', '女', 5000, '2024-01-02', 1, NULL);

-- 写法3：id 位置写 DEFAULT（省略列名，必须给全列）
INSERT INTO emp VALUES (DEFAULT, '自增测试C', '男', 5000, '2024-01-03', 1, NULL);`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：三行依次插入，<InlineCode>id</InlineCode>
      自动取连续递增的值（例如 11、12、13）。
    </Paragraph>
    <Callout type="danger" title="常见坑：自增值“用过不退”">
      如果你插入了 id=20 的行后又把它删掉，下一次自增<Text bold>仍从 21 继续</Text>
      ，不会回填 19/20 留下的空洞。这是正常现象（保证主键不重复），不要试图“补洞”。
    </Callout>

    <Divider />

    <Subtitle>2. 插入数据的注意事项（值的写法）</Subtitle>
    <Paragraph>
      这一节专门讲“<InlineCode>VALUES</InlineCode>
      里的值到底该怎么写”，是新手最容易出语法错误的地方。
    </Paragraph>

    <Heading3>2.1 字符串、日期：必须用单引号 ' '</Heading3>
    <CodeBlock
      language="sql"
      code={`INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus)
VALUES ('陈十二', '女', 7700, '2023-07-15', 2, 600);
--       ↑字符串    ↑字符       数值不加引号  ↑日期当字符串(带引号)`}
    />
    <UnorderedList>
      <ListItem>
        字符/字符串类型（<InlineCode>CHAR</InlineCode>、<InlineCode>VARCHAR</InlineCode>
        ）：<InlineCode>'张三'</InlineCode>、<InlineCode>'男'</InlineCode>，
        <Text bold>两边加单引号</Text>。
      </ListItem>
      <ListItem>
        日期/时间类型（<InlineCode>DATE</InlineCode>、<InlineCode>DATETIME</InlineCode>
        ）：在 SQL 里<Text bold>以“带单引号的字符串”形式书写</Text>，常用格式{' '}
        <InlineCode>'YYYY-MM-DD'</InlineCode>（如 <InlineCode>'2023-07-15'</InlineCode>
        ），数据库会自动把它转成日期。
      </ListItem>
    </UnorderedList>
    <Callout type="danger" title="常见坑">
      <UnorderedList>
        <ListItem>
          用<Text bold>双引号</Text>有时也能跑（MySQL 默认允许），但
          <Text bold>标准 SQL 用单引号</Text>，请统一用单引号，避免在开启{' '}
          <InlineCode>ANSI_QUOTES</InlineCode> 模式时把双引号当成“列名标识符”而报错。
        </ListItem>
        <ListItem>
          字符串忘了加引号会报错{' '}
          <InlineCode>Unknown column 'xxx' in 'field list'</InlineCode>——因为 MySQL
          把没加引号的 <InlineCode>张三</InlineCode> 当成了“列名”去找。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>2.2 数值类型：不要加引号</Heading3>
    <CodeBlock
      language="sql"
      code={`-- ✅ 正确：salary 是 DOUBLE，直接写数字
INSERT INTO emp (ename, gender, salary, dept_id) VALUES ('黄十三', '男', 8000, 1);

-- ⚠️ 不规范：给数字加了引号（'8000'）
INSERT INTO emp (ename, gender, salary, dept_id) VALUES ('黄十三', '男', '8000', 1);`}
    />
    <Paragraph>
      第二种写法 MySQL 通常会“宽容地”把字符串 <InlineCode>'8000'</InlineCode>
      隐式转成数字 8000，<Text bold>能插进去但不规范</Text>。养成好习惯：
      <Text bold>数值就是裸数字，不加引号</Text>。
    </Paragraph>

    <Heading3>2.3 NULL 值：直接写 NULL（不加引号）</Heading3>
    <Paragraph>
      <InlineCode>bonus</InlineCode>（奖金）列允许为空。表示“没有奖金/未知”时，写关键字{' '}
      <InlineCode>NULL</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO emp (ename, gender, salary, dept_id, bonus)
VALUES ('刘十四', '女', 7000, 2, NULL);   -- bonus 为 NULL`}
    />
    <Callout type="danger" title="常见坑：NULL 和 'NULL' 完全不同！">
      <UnorderedList>
        <ListItem>
          <InlineCode>NULL</InlineCode>（不加引号）= 真正的“空值/没有值”。
        </ListItem>
        <ListItem>
          <InlineCode>'NULL'</InlineCode>（加了引号）= 一个
          <Text bold>长度为 4 的字符串</Text>，内容就是 N、U、L、L 四个字母。
        </ListItem>
      </UnorderedList>
      <Paragraph>
        千万别给该为空的列写成 <InlineCode>'NULL'</InlineCode>
        ，那是个实实在在的字符串，不是空。
      </Paragraph>
    </Callout>

    <Heading3>2.4 列与值的“顺序”必须严格对应</Heading3>
    <Paragraph>
      <InlineCode>INSERT</InlineCode> 是<Text bold>按位置</Text>配对的：列清单的第 N
      个列，配 <InlineCode>VALUES</InlineCode> 的第 N 个值。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ✅ 正确：值的顺序与列清单一致
INSERT INTO emp (ename, gender, salary) VALUES ('正确哥', '男', 9000);

-- 🕳️ 逻辑错误（但语法不报错！）：把 gender 和 salary 的值写反了
INSERT INTO emp (ename, gender, salary) VALUES ('坑货', 9000, '男');`}
    />
    <Paragraph>
      第二条：你打算让 <InlineCode>gender='男'</InlineCode>、
      <InlineCode>salary=9000</InlineCode>，结果因为值写反，变成往{' '}
      <InlineCode>gender</InlineCode> 里塞 <InlineCode>9000</InlineCode>、往{' '}
      <InlineCode>salary</InlineCode> 里塞 <InlineCode>'男'</InlineCode>
      。这种<Text bold>“语法没错、数据全乱”</Text>的 bug 最难查。
    </Paragraph>
    <Callout type="tip" title="提示">
      <Paragraph>
        列清单的顺序<Text bold>不必和表定义顺序一致</Text>
        ，你可以自由调整，只要“列清单的顺序”和“值的顺序”互相对应即可。例如下面这样把{' '}
        <InlineCode>salary</InlineCode> 写在前面也完全合法：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`INSERT INTO emp (salary, ename, gender) VALUES (9000, '随意哥', '男');`}
      />
    </Callout>

    <Heading3>2.5 没赋值的列会怎样？</Heading3>
    <Paragraph>
      如果列清单里<Text bold>没有</Text>
      某个列（且该列允许为空或有默认值），那一行里该列会被填上：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        它的 <InlineCode>DEFAULT</InlineCode> 默认值（如果建表时定义了{' '}
        <InlineCode>DEFAULT</InlineCode>）；
      </ListItem>
      <ListItem>
        否则填 <InlineCode>NULL</InlineCode>（如果该列允许 NULL）；
      </ListItem>
      <ListItem>
        如果该列<Text bold>既无默认值、又是 </Text>
        <InlineCode>NOT NULL</InlineCode>，则<Text bold>报错</Text>（必须显式给值）。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="sql"
      code={`-- 只给了 ename、dept_id，其余列（gender/salary/join_date/bonus）会变成 NULL
INSERT INTO emp (ename, dept_id) VALUES ('简约哥', 1);`}
    />
    <Paragraph>
      <Text bold>执行后该行</Text>：
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', 'join_date', 'dept_id', 'bonus']}
      rows={[
        ['...', '简约哥', 'NULL', 'NULL', 'NULL', '1', 'NULL'],
      ]}
    />

    <Divider />

    <Subtitle>3. 修改数据：UPDATE</Subtitle>
    <Callout type="note">
      在讲删除之前先讲修改，因为它和删除一样<Text bold>强依赖 </Text>
      <InlineCode>WHERE</InlineCode>，理解了 <InlineCode>WHERE</InlineCode>
      的重要性，再看删除就更警觉。
    </Callout>

    <Heading3>3.1 是什么 / 为什么</Heading3>
    <Paragraph>
      <InlineCode>UPDATE</InlineCode> 用于
      <Text bold>修改表中已存在的行的某些列的值</Text>
      。它不会增加或减少行数，只是把“现有行里的某些格子”改成新值。
    </Paragraph>
    <Paragraph>
      类比：在 Excel 里<Text bold>双击某个单元格，把里面的内容改掉</Text>。
    </Paragraph>

    <Heading3>3.2 语法格式</Heading3>
    <CodeBlock
      language="sql"
      code={`UPDATE 表名 SET 列1 = 值1, 列2 = 值2, ... WHERE 条件;`}
    />
    <Paragraph>
      <Text bold>逐项解释</Text>：
    </Paragraph>
    <Table
      head={['部分', '含义', '是否必须']}
      rows={[
        ['UPDATE 表名', '要改哪张表', '必须'],
        ['SET 列1=值1, 列2=值2', '把哪些列改成什么值（多列用逗号隔开）', '必须'],
        ['WHERE 条件', '只改满足条件的行', '语法上可省略，但实战中几乎必须写！'],
      ]}
    />

    <Heading3>3.3 示例：改一行</Heading3>
    <Callout type="note">
      操作前请确保是初始数据。给“张三”（id=1）涨薪到 8500，并补发奖金 1500。
    </Callout>
    <CodeBlock
      language="sql"
      code={`UPDATE emp SET salary = 8500, bonus = 1500 WHERE id = 1;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>Query OK, 1 row affected</InlineCode>
      （1 行受影响）。张三这一行变为：
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', 'join_date', 'dept_id', 'bonus']}
      rows={[
        ['1', '张三', '男', '8500', '2020-01-10', '1', '1500'],
      ]}
    />

    <Heading3>3.4 示例：按条件改多行</Heading3>
    <Paragraph>
      <InlineCode>WHERE</InlineCode> 命中几行，就改几行。给
      <Text bold>研发部（dept_id=1）的所有人</Text>统一上调 10% 工资：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`UPDATE emp SET salary = salary * 1.1 WHERE dept_id = 1;`}
    />
    <Paragraph>
      <Text bold>逐项解释</Text>：<InlineCode>SET salary = salary * 1.1</InlineCode>
      表示“新工资 = 原工资 × 1.1”，等号右边可以引用列自己当前的值。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果</Text>（基于初始数据，研发部有张三 8000、李四 12000 两人）：
      <InlineCode>2 rows affected</InlineCode>。
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary（原→新）', 'dept_id']}
      rows={[
        ['1', '张三', '男', '8000 → 8800', '1'],
        ['2', '李四', '男', '12000 → 13200', '1'],
      ]}
    />

    <Heading3>3.5 ⚠️ 最危险的一点：UPDATE 不写 WHERE = 全表都改！</Heading3>
    <Paragraph>
      <Text bold>
        <InlineCode>WHERE</InlineCode> 是“筛选哪些行”的条件。如果不写{' '}
        <InlineCode>WHERE</InlineCode>，UPDATE 会作用于表里的每一行。
      </Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 💀 灾难示例：忘写 WHERE，全公司每个人的工资都被改成 1 块钱！
UPDATE emp SET salary = 1;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>N rows affected</InlineCode>（N =
      全表行数），<Text bold>所有员工的 salary 全变成 1</Text>
      。这种事故在生产环境足以让人“卷铺盖走人”。
    </Paragraph>

    <Heading4>如何避免“忘写 WHERE”的灾难</Heading4>
    <OrderedList>
      <ListItem>
        <Text bold>开启“安全更新模式”</Text>
        <InlineCode>sql_safe_updates</InlineCode>（强烈推荐给 MySQL
        命令行/客户端）。开启后，
        <Text bold>
          没有 <InlineCode>WHERE</InlineCode>（或 <InlineCode>WHERE</InlineCode>{' '}
          没用到主键/索引键）的 UPDATE/DELETE 会被直接拒绝执行
        </Text>
        ：
        <CodeBlock
          language="sql"
          code={`SET SQL_SAFE_UPDATES = 1;     -- 1=开启，0=关闭`}
        />
        <Paragraph>
          开启后再执行 <InlineCode>UPDATE emp SET salary = 1;</InlineCode> 会报错：
          <InlineCode>
            Error Code: 1175. You are using safe update mode and you tried to update a
            table without a WHERE that uses a KEY column ...
          </InlineCode>
          （你处于安全更新模式，却尝试在没有用到键列的 WHERE 的情况下更新表。）
        </Paragraph>
        <Callout type="tip" title="提示">
          在 MySQL Workbench 里这个选项默认就是开着的，这也是为什么很多人发现“在
          Workbench 里没法不写 WHERE”。
        </Callout>
      </ListItem>
      <ListItem>
        <Text bold>先 </Text>
        <InlineCode>SELECT</InlineCode>
        <Text bold> 后 </Text>
        <InlineCode>UPDATE</InlineCode>：改之前，先用同样的{' '}
        <InlineCode>WHERE</InlineCode> 跑一遍 <InlineCode>SELECT</InlineCode>
        ，确认“命中的就是你想改的那些行”，再把 <InlineCode>SELECT ... FROM</InlineCode>
        换成 <InlineCode>UPDATE ... SET</InlineCode>。
        <CodeBlock
          language="sql"
          code={`-- 第一步：先查，确认范围对不对
SELECT * FROM emp WHERE dept_id = 1;
-- 第二步：确认无误后再改
UPDATE emp SET salary = salary * 1.1 WHERE dept_id = 1;`}
        />
      </ListItem>
      <ListItem>
        <Text bold>包在事务里</Text>：手动开事务，改完先看结果，不对就{' '}
        <InlineCode>ROLLBACK</InlineCode> 回滚（详见第 5 节）。
      </ListItem>
    </OrderedList>
    <Callout type="danger" title="常见坑：WHERE 条件命中 0 行">
      如果 <InlineCode>WHERE id = 9999</InlineCode> 而表里没有这个 id，语句
      <Text bold>不会报错</Text>，只是 <InlineCode>0 rows affected</InlineCode>（0
      行受影响）——什么都没改。看到“0 行受影响”要警觉：是不是条件写错了？
    </Callout>
    <Callout type="danger" title="常见坑：判断 NULL 不能用 =">
      <Paragraph>
        想把“没有奖金的人”的 bonus 设为 0，<Text bold>不能</Text>写{' '}
        <InlineCode>WHERE bonus = NULL</InlineCode>（它永远不成立，命中 0 行），必须用{' '}
        <InlineCode>IS NULL</InlineCode>：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`UPDATE emp SET bonus = 0 WHERE bonus IS NULL;   -- ✅ 正确
-- UPDATE emp SET bonus = 0 WHERE bonus = NULL;  -- ❌ 命中 0 行，无效果`}
      />
    </Callout>

    <Divider />

    <Subtitle>4. 删除数据：DELETE</Subtitle>

    <Heading3>4.1 是什么 / 为什么</Heading3>
    <Paragraph>
      <InlineCode>DELETE</InlineCode> 用于
      <Text bold>删除表中满足条件的行（整行删除）</Text>
      。注意它删的是“行”，不是“某个列的值”——想清空某个格子用的是{' '}
      <InlineCode>UPDATE ... SET 列 = NULL</InlineCode>，而不是{' '}
      <InlineCode>DELETE</InlineCode>。
    </Paragraph>
    <Paragraph>
      类比：在 Excel 里<Text bold>选中若干行 → 右键删除行</Text>。
    </Paragraph>

    <Heading3>4.2 语法格式</Heading3>
    <CodeBlock language="sql" code={`DELETE FROM 表名 WHERE 条件;`} />
    <Paragraph>
      <Text bold>逐项解释</Text>：
    </Paragraph>
    <Table
      head={['部分', '含义', '是否必须']}
      rows={[
        ['DELETE FROM 表名', '从哪张表删', '必须'],
        ['WHERE 条件', '只删满足条件的行', '语法可省略，但省略=删全表，极危险！'],
      ]}
    />
    <Callout type="note">
      注意是 <InlineCode>DELETE FROM 表名</InlineCode>，<Text bold>不写列名</Text>
      ——因为删除是“删整行”，谈不上删某一列。
    </Callout>

    <Heading3>4.3 示例：删一行 / 删多行</Heading3>
    <Callout type="note">操作前请确保是初始数据。</Callout>
    <CodeBlock
      language="sql"
      code={`-- 删一行：删除 id=4 的"赵六"
DELETE FROM emp WHERE id = 4;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>1 row affected</InlineCode>
      ，赵六这一行从表中消失。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 删多行：删除所有工资低于 8000 的员工
DELETE FROM emp WHERE salary < 8000;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>WHERE</InlineCode>
      命中几行就删几行（基于初始数据，命中赵六 6000 一人，
      <InlineCode>1 row affected</InlineCode>）。
    </Paragraph>

    <Heading3>4.4 ⚠️ 最危险的一点：DELETE 不写 WHERE = 删光全表！</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 💀 灾难示例：删除 emp 表里的所有行！
DELETE FROM emp;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>N rows affected</InlineCode>（N =
      全表行数），<Text bold>整张表被清空</Text>
      （但表结构还在，是个空表）。这就是新闻里常说的“删库跑路”级别的事故。
    </Paragraph>
    <Paragraph>
      <Text bold>避免方法和 UPDATE 完全一样</Text>：开启{' '}
      <InlineCode>SQL_SAFE_UPDATES</InlineCode>、先 <InlineCode>SELECT</InlineCode>
      确认范围、用事务包裹。这里不再重复。
    </Paragraph>
    <Callout type="danger" title="常见坑：外键约束导致删不掉">
      <Paragraph>
        <InlineCode>dept</InlineCode> 是“父表”，<InlineCode>emp</InlineCode> 通过外键{' '}
        <InlineCode>fk_emp_dept</InlineCode> 引用它。如果你想删除研发部：
      </Paragraph>
      <CodeBlock language="sql" code={`DELETE FROM dept WHERE id = 1;`} />
      <Paragraph>
        会报错：
        <InlineCode>
          Cannot delete or update a parent row: a foreign key constraint fails ...
        </InlineCode>
      </Paragraph>
      <Paragraph>
        原因：研发部下还挂着张三、李四（<InlineCode>emp.dept_id = 1</InlineCode>
        ），数据库不允许你删掉“还被别人引用着”的父记录，否则那些员工就成了“无主孤儿”。
      </Paragraph>
      <Paragraph>
        <Text bold>正确顺序</Text>：先删（或改派）子表 <InlineCode>emp</InlineCode>
        里属于该部门的员工，再删父表 <InlineCode>dept</InlineCode> 的部门。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>5. DELETE 与 TRUNCATE TABLE 的区别（重点）</Subtitle>
    <Paragraph>
      想“把一张表的数据全部清空”，有两条路：<InlineCode>DELETE FROM 表名;</InlineCode>{' '}
      和 <InlineCode>TRUNCATE TABLE 表名;</InlineCode>
      。它们结果看起来一样（表都空了），但
      <Text bold>底层机制、性能、副作用完全不同</Text>，这也是高频面试题。
    </Paragraph>
    <Callout type="note">
      注：<InlineCode>TRUNCATE</InlineCode> 严格说属于 <Text bold>DDL</Text>
      （它的本质是“删表重建”），但因为它常被拿来和 <InlineCode>DELETE</InlineCode>
      对比清空数据，所以放在本章一起讲。
    </Callout>

    <Heading3>5.1 TRUNCATE 的用法</Heading3>
    <CodeBlock
      language="sql"
      code={`TRUNCATE TABLE emp;
-- TABLE 关键字可省略，写成 TRUNCATE emp; 也行`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>emp</InlineCode> 表瞬间被清空。
    </Paragraph>

    <Heading3>5.2 核心区别对比表</Heading3>
    <Table
      head={['对比项', 'DELETE FROM emp;', 'TRUNCATE TABLE emp;']}
      rows={[
        ['所属语言', 'DML（数据操作）', 'DDL（数据定义）'],
        [
          '删除方式',
          '逐行删除，每删一行记一条日志',
          '直接"删掉整张表再重建一个同结构的空表"',
        ],
        ['速度（大表）', '慢（行越多越慢）', '极快（几乎与行数无关）'],
        ['能否带 WHERE 条件删部分', '能（DELETE ... WHERE ...）', '不能，只能全清空'],
        [
          '事务与回滚',
          '在事务中可 ROLLBACK 撤销（数据能找回）',
          '不可回滚，删了就真没了',
        ],
        ['触发器 DELETE 触发器', '会触发', '不触发'],
        [
          '自增列 AUTO_INCREMENT',
          '不重置，继续接着原来的最大值',
          '重置归 1，下次插入 id 从 1 重新开始',
        ],
        ['返回的受影响行数', '真实删除的行数', '通常返回 0（它不是逐行删）'],
      ]}
    />

    <Heading3>5.3 用例子直观感受“自增是否重置”</Heading3>
    <Paragraph>这是两者最常被考、也最直观的差异。</Paragraph>
    <Paragraph>
      <Text bold>实验 A：用 DELETE 清空，自增不重置</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 假设 emp 此刻最大 id 是 5
DELETE FROM emp;                         -- 全删，表空了
INSERT INTO emp (ename, dept_id) VALUES ('新人', 1);
SELECT id FROM emp;                      -- 看看新人的 id`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：新人的 <InlineCode>id = 6</InlineCode>
      。虽然表被清空，但自增计数器“记得”曾经到过 5，继续从 6 发号。
    </Paragraph>
    <Paragraph>
      <Text bold>实验 B：用 TRUNCATE 清空，自增归 1</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 同样假设清空前最大 id 是 5
TRUNCATE TABLE emp;                      -- 删表重建，计数器归零
INSERT INTO emp (ename, dept_id) VALUES ('新人', 1);
SELECT id FROM emp;                      -- 看看新人的 id`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：新人的 <InlineCode>id = 1</InlineCode>。因为{' '}
      <InlineCode>TRUNCATE</InlineCode> 把表“重建”了，自增计数器回到初始值。
    </Paragraph>

    <Heading3>5.4 用例子感受“能否回滚”</Heading3>
    <CodeBlock
      language="sql"
      code={`START TRANSACTION;        -- 开启事务
DELETE FROM emp;          -- 把数据删光
SELECT COUNT(*) FROM emp; -- 结果：0（看起来没了）
ROLLBACK;                 -- 后悔了，回滚！
SELECT COUNT(*) FROM emp; -- 结果：恢复成 5，数据全回来了！`}
    />
    <Paragraph>
      <InlineCode>DELETE</InlineCode> 在事务里可以靠 <InlineCode>ROLLBACK</InlineCode>
      救回来。而 <InlineCode>TRUNCATE</InlineCode> 即使写在事务里，也
      <Text bold>无法靠 </Text>
      <InlineCode>ROLLBACK</InlineCode>
      <Text bold> 找回数据</Text>（它会隐式提交，删了就是删了）。
    </Paragraph>

    <Heading3>5.5 该用哪个？</Heading3>
    <Table
      head={['场景', '推荐']}
      rows={[
        ['只删一部分行（带条件）', '只能用 DELETE（TRUNCATE 不支持条件）'],
        ['需要事务保护、可能要反悔', '用 DELETE'],
        ['表上有需要触发的 DELETE 触发器', '用 DELETE'],
        ['想彻底清空大表、追求速度、且不需要反悔、希望自增归零', '用 TRUNCATE'],
      ]}
    />
    <Callout type="danger" title="常见坑">
      <InlineCode>TRUNCATE</InlineCode> 同样<Text bold>受外键约束限制</Text>
      。如果有别的表用外键引用了 <InlineCode>emp</InlineCode>，
      <InlineCode>TRUNCATE TABLE emp</InlineCode> 会被拒绝。另外{' '}
      <InlineCode>TRUNCATE</InlineCode> 没有“软删除/找回”机制，
      <Text bold>生产环境慎用</Text>，操作前务必确认表名没写错、确实要全清。
    </Callout>
    <Callout type="tip" title="顺带一提 DROP TABLE emp;">
      那是把<Text bold>整张表（结构 + 数据）一起删掉</Text>
      ，删完表都不存在了，连“空表”都没有。区别记忆：
      <InlineCode>DELETE</InlineCode>/<InlineCode>TRUNCATE</InlineCode> =
      倒空柜子里的东西（柜子还在）；<InlineCode>DROP</InlineCode> = 连柜子一起扔掉。
    </Callout>

    <Divider />

    <Subtitle>6. 综合实战：在 emp 表上完整走一遍增删改</Subtitle>
    <Paragraph>
      下面把本章知识串成一条完整的“业务剧情”，请按顺序执行体会。
      <Text bold>开始前先恢复初始数据</Text>（用第 0 节脚本{' '}
      <InlineCode>DROP</InlineCode> 后重建 <InlineCode>emp</InlineCode>，或确保它是初始的
      5 行）。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

-- ========== 增 INSERT ==========
-- 剧情1：研发部新招 2 名员工（一条语句插多行，显式列名）
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
  ('阿强', '男', 9000, '2024-01-15', 1, 1000),
  ('阿珍', '女', 9200, '2024-02-20', 1, NULL);   -- 阿珍暂无奖金

-- 剧情2：新成立"运维部"并招 1 人（先建部门，再招人，注意外键依赖）
INSERT INTO dept (dept_name, loc) VALUES ('运维部', '深圳');         -- 假设生成 id=4
INSERT INTO emp (ename, gender, salary, join_date, dept_id) VALUES
  ('阿亮', '男', 8500, '2024-03-01', 4);                            -- 入职运维部，bonus 省略→NULL`}
    />
    <Paragraph>
      <Text bold>结果</Text>：<InlineCode>emp</InlineCode>
      新增 3 行（阿强、阿珍、阿亮），<InlineCode>dept</InlineCode>
      新增 1 行（运维部）。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ========== 改 UPDATE ==========
-- 剧情3：给市场部(dept_id=2)全员涨薪 5%
UPDATE emp SET salary = salary * 1.05 WHERE dept_id = 2;

-- 剧情4：把所有"无奖金(NULL)"的人统一补发 500（注意用 IS NULL，不能用 = NULL）
UPDATE emp SET bonus = 500 WHERE bonus IS NULL;

-- 剧情5：阿强表现优秀，单独涨薪到 12000 并发奖金 3000（多列同改 + 按主键精确定位）
UPDATE emp SET salary = 12000, bonus = 3000 WHERE ename = '阿强';`}
    />
    <Paragraph>
      <Text bold>结果</Text>：市场部每人工资 ×1.05；原本 bonus 为 NULL
      的人（李四、赵六、阿珍、阿亮……）bonus 变 500；阿强工资 12000、奖金 3000。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ========== 删 DELETE ==========
-- 剧情6：阿亮离职，删除其记录（按主键/唯一条件，安全）
DELETE FROM emp WHERE ename = '阿亮';

-- 剧情7：清退所有工资低于 7000 的员工（按条件删多行）
DELETE FROM emp WHERE salary < 7000;

-- 剧情8（演示外键保护）：试图解散没人了的"运维部"
DELETE FROM dept WHERE dept_name = '运维部';
--   若该部门已无员工引用，删除成功；
--   若还有员工的 dept_id 指向它，会报外键错误，需先处理员工再删部门。`}
    />
    <Paragraph>
      <Text bold>结果</Text>：阿亮被删；工资 &lt; 7000
      的员工被清退；只要运维部下已无员工，部门删除成功。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ========== 验证：把改完的数据查出来看看 ==========
SELECT id, ename, gender, salary, dept_id, bonus FROM emp ORDER BY id;`}
    />
    <Callout type="tip" title="提示">
      上面剧情里我故意全程使用了“显式列名 INSERT”“每条 UPDATE/DELETE 都带 WHERE”“NULL
      用 IS NULL 判断”这些<Text bold>好习惯</Text>。请把它们当成肌肉记忆固定下来。
    </Callout>

    <Divider />

    <Subtitle>7. 一点延伸：DML 与事务（理解“为什么 DELETE 能反悔”）</Subtitle>
    <Paragraph>
      本章已经多次提到事务，这里做个最小化的说明，方便你理解“安全网”是怎么来的（事务的完整内容会在后续章节深入）。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>DML 语句默认是“自动提交”的</Text>：你执行完{' '}
        <InlineCode>INSERT/UPDATE/DELETE</InlineCode>，改动会
        <Text bold>立即永久生效</Text>（<InlineCode>autocommit=ON</InlineCode>
        ）。所以平时手滑删错了，往往来不及反悔。
      </ListItem>
      <ListItem>
        如果<Text bold>手动开启事务</Text>，改动会先“暂存”，直到你{' '}
        <InlineCode>COMMIT</InlineCode>（确认提交）才永久生效，或{' '}
        <InlineCode>ROLLBACK</InlineCode>（回滚）撤销：
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="sql"
      code={`START TRANSACTION;              -- 开启事务（手动接管提交）
UPDATE emp SET salary = 1;      -- 危险操作，但还没真正生效
SELECT salary FROM emp;         -- 一看全成 1 了，坏了！
ROLLBACK;                       -- 撤销！数据恢复到事务开始前
-- 如果确认无误，则用 COMMIT; 来永久提交`}
    />
    <Callout type="tip" title="提示">
      执行有风险的批量 <InlineCode>UPDATE/DELETE</InlineCode> 前，先{' '}
      <InlineCode>START TRANSACTION;</InlineCode>，改完用 <InlineCode>SELECT</InlineCode>
      核对，没问题再 <InlineCode>COMMIT</InlineCode>，有问题就{' '}
      <InlineCode>ROLLBACK</InlineCode>——这是工程上保命的标准动作。
    </Callout>

    <Divider />

    <Subtitle>本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>DML 三剑客</Text>：<InlineCode>INSERT</InlineCode>（增）、
        <InlineCode>UPDATE</InlineCode>（改）、<InlineCode>DELETE</InlineCode>
        （删）；查询用的 <InlineCode>SELECT</InlineCode> 属于 DQL，是下一章内容。
      </ListItem>
      <ListItem>
        <Text bold>INSERT</Text>
        <UnorderedList>
          <ListItem>
            标准写法 <InlineCode>INSERT INTO 表(列...) VALUES(值...)</InlineCode>，
            <Text bold>列与值一一对应</Text>，强烈建议<Text bold>显式写列名</Text>。
          </ListItem>
          <ListItem>
            省略列名则必须<Text bold>按表顺序给全部列的值</Text>，脆弱，不推荐。
          </ListItem>
          <ListItem>
            一条语句可插多行：<InlineCode>VALUES (..),(..),(..)</InlineCode>，
            <Text bold>效率更高</Text>，且是“全成功或全失败”的原子操作。
          </ListItem>
          <ListItem>
            自增列可<Text bold>省略 / 写 </Text>
            <InlineCode>NULL</InlineCode>
            <Text bold> / 写 </Text>
            <InlineCode>DEFAULT</InlineCode> 让其自动生成。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>值的写法</Text>：字符串和日期加<Text bold>单引号</Text>；数值
        <Text bold>不加</Text>引号；空值写 <InlineCode>NULL</InlineCode>（≠ 字符串{' '}
        <InlineCode>'NULL'</InlineCode>）；列与值顺序要严格对应。
      </ListItem>
      <ListItem>
        <Text bold>UPDATE</Text>：<InlineCode>UPDATE 表 SET 列=值,... WHERE 条件</InlineCode>
        ；等号右边可引用列自身（如 <InlineCode>salary = salary*1.1</InlineCode>）。
      </ListItem>
      <ListItem>
        <Text bold>DELETE</Text>：<InlineCode>DELETE FROM 表 WHERE 条件</InlineCode>
        ；删的是整行；受外键约束保护（删父表前要先处理子表）。
      </ListItem>
      <ListItem>
        <Text bold>❗最重要的安全红线</Text>：<InlineCode>UPDATE</InlineCode> /{' '}
        <InlineCode>DELETE</InlineCode>
        <Text bold> 不写 </Text>
        <InlineCode>WHERE</InlineCode>
        <Text bold> 会作用于全表</Text>！避免方法：开启{' '}
        <InlineCode>SQL_SAFE_UPDATES</InlineCode>、改删前先用相同{' '}
        <InlineCode>WHERE</InlineCode> 跑 <InlineCode>SELECT</InlineCode>
        确认、用事务 <InlineCode>START TRANSACTION ... ROLLBACK/COMMIT</InlineCode>{' '}
        兜底。
      </ListItem>
      <ListItem>
        <Text bold>判 NULL 用 </Text>
        <InlineCode>IS NULL</InlineCode> / <InlineCode>IS NOT NULL</InlineCode>
        ，绝不能用 <InlineCode>= NULL</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>DELETE vs TRUNCATE</Text>：DELETE
        逐行删、可带条件、可事务回滚、自增不重置；TRUNCATE
        删表重建、不能带条件、不可回滚、速度快、自增归 1、不触发触发器。
      </ListItem>
    </UnorderedList>

    <Subtitle>常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>
        Q1：<InlineCode>DELETE FROM emp;</InlineCode> 和{' '}
        <InlineCode>TRUNCATE TABLE emp;</InlineCode> 有什么区别？
      </Text>
    </Paragraph>
    <Paragraph>
      A：DELETE 是 DML、逐行删除、可加 WHERE 删部分、可在事务中回滚、不重置自增；TRUNCATE
      是 DDL、删表重建、只能全清、不可回滚、速度快、自增归 1、不触发删除触发器。需要按条件删或可能反悔时用
      DELETE，要快速彻底清空大表用 TRUNCATE。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q2：<InlineCode>DELETE</InlineCode>、<InlineCode>TRUNCATE</InlineCode>、
        <InlineCode>DROP</InlineCode> 三者的区别？
      </Text>
    </Paragraph>
    <Paragraph>
      A：DELETE 删行（数据，表在）；TRUNCATE 清空所有行（删表重建，表在但自增归
      1）；DROP 删整张表（结构和数据都没了，表都不存在了）。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q3：执行了 <InlineCode>UPDATE emp SET salary=1;</InlineCode>（忘了
        WHERE）该怎么补救？
      </Text>
    </Paragraph>
    <Paragraph>
      A：若开了事务且未提交，立刻 <InlineCode>ROLLBACK</InlineCode>
      ；若已自动提交，则只能靠备份/binlog 恢复。预防胜于补救：开启{' '}
      <InlineCode>SQL_SAFE_UPDATES</InlineCode>、先 SELECT 确认、用事务包裹。
    </Paragraph>
    <Paragraph>
      <Text bold>Q4：自增主键删了几行后，再插入会复用被删的 id 吗？</Text>
    </Paragraph>
    <Paragraph>
      A：不会。DELETE 不重置自增计数器，会继续从历史最大值 +1
      发号，留下空洞是正常的；只有 TRUNCATE（或重置{' '}
      <InlineCode>AUTO_INCREMENT</InlineCode>）才会让它从 1 重新开始。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q5：为什么 <InlineCode>WHERE bonus = NULL</InlineCode> 查不到/改不到任何行？
      </Text>
    </Paragraph>
    <Paragraph>
      A：NULL 表示“未知”，任何与 NULL 的 <InlineCode>=</InlineCode>、
      <InlineCode>&lt;&gt;</InlineCode> 比较结果都是“未知（既非真也非假）”，WHERE
      只保留结果为真的行，所以命中 0 行。判断空值必须用 <InlineCode>IS NULL</InlineCode>{' '}
      / <InlineCode>IS NOT NULL</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q6：一条 <InlineCode>INSERT ... VALUES (..),(..),(..)</InlineCode>{' '}
        里有一行违反约束，会怎样？
      </Text>
    </Paragraph>
    <Paragraph>
      A：默认整条语句失败、全部回滚，一行都插不进去（原子性）。它不会“插成功的留下、失败的丢弃”。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：插入时自增列怎么写最好？</Text>
    </Paragraph>
    <Paragraph>
      A：最推荐在列清单里直接<Text bold>省略</Text>该列；也可写{' '}
      <InlineCode>NULL</InlineCode> 或 <InlineCode>DEFAULT</InlineCode>
      让数据库自动生成。不要手动指定具体值，以免和将来的自增冲突。
    </Paragraph>
  </article>
);

export default index;
