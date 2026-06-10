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
    <Title>INSERT 添加数据</Title>

    <Subtitle>本章导读</Subtitle>
    <Paragraph>
      前面几章我们学会了如何用 <Text bold>DDL</Text>（数据定义语言，
      <InlineCode>CREATE / ALTER / DROP</InlineCode>）把"表"这个"容器"创建好——相当于在
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
      ，是下一章的重点。本章专注于"写"——增、删、改。
    </Callout>
    <Paragraph>
      <Text bold>为什么这章特别重要？</Text>
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>它是日常开发中使用频率最高的一类语句</Text>
        ：你写的每一个"注册用户""下订单""改密码""删评论"，背后都是{' '}
        <InlineCode>INSERT / UPDATE / DELETE</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>它最容易"翻车"</Text>：<InlineCode>DELETE</InlineCode> 和{' '}
        <InlineCode>UPDATE</InlineCode> 一旦<Text bold>忘了写 </Text>
        <InlineCode>WHERE</InlineCode>
        ，会瞬间把整张表的数据"团灭"，这是新手乃至老手都犯过的"删库"事故。本章会反复、重点地警示这个坑。
      </ListItem>
    </OrderedList>
    <Paragraph>
      <Text bold>与前后章的关系</Text>：上承 DDL（表已建好），下启
      DQL（查询）。学完本章，你就能把数据"灌"进表里，为下一章的各种查询练习准备好"弹药"。
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
      <Text bold>本章后续所有"执行结果"都以这份初始数据为基准</Text>
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
      重建。本章很多例子会真的改动数据，为了不互相干扰，我会在关键例子前提醒你"先恢复初始数据"。
    </Callout>

    <Divider />

    <Subtitle>1. 添加数据：INSERT</Subtitle>

    <Heading3>1.1 是什么 / 为什么</Heading3>
    <Paragraph>
      <InlineCode>INSERT</InlineCode> 就是<Text bold>往表里"插入"一行或多行新记录</Text>
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
      <Text bold>核心规则：列与值"一一对应"</Text>。
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
      。因为数据库只需"解析一次语句、做一次事务提交"，而分成 3 条{' '}
      <InlineCode>INSERT</InlineCode>
      要解析 3 次、提交 3 次。批量导入数据时，请务必用"一条多行"的写法。
    </Callout>
    <Callout type="warning" title="注意">
      一条多行 <InlineCode>INSERT</InlineCode> 是一个<Text bold>整体（原子操作）</Text>
      ——只要其中一行违反约束（比如某行的 <InlineCode>dept_id</InlineCode> 在{' '}
      <InlineCode>dept</InlineCode> 表里不存在，违反外键），
      <Text bold>整条语句失败，一行都插不进去</Text>，不会"插一半"。
    </Callout>

    <Heading3>1.5 省略列名的写法（不推荐，但要看得懂）</Heading3>
    <Paragraph>
      如果你<Text bold>不写列清单</Text>，那就表示"我要给所有列、按表定义的顺序全部赋值"：
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
          它要求你给"全部列"，少一个值就报错：
          <InlineCode>Column count doesn't match value count</InlineCode>
          （列数和值数不匹配）。
        </ListItem>
        <ListItem>
          一旦将来用 <InlineCode>ALTER TABLE</InlineCode> 给表
          <Text bold>加了一列</Text>，所有"省略列名"的旧 <InlineCode>INSERT</InlineCode>
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
      ，即"自动递增的主键"。它的值由数据库自动维护（每插一行加 1），我们通常
      <Text bold>不需要、也不应该手动指定</Text>
      。给自增列赋值有三种等价的"交给数据库自己来"的写法：
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
    <Callout type="danger" title={"常见坑：自增值\"用过不退\""}>
      如果你插入了 id=20 的行后又把它删掉，下一次自增<Text bold>仍从 21 继续</Text>
      ，不会回填 19/20 留下的空洞。这是正常现象（保证主键不重复），不要试图"补洞"。
    </Callout>

    <Divider />

    <Subtitle>2. 插入数据的注意事项（值的写法）</Subtitle>
    <Paragraph>
      这一节专门讲"<InlineCode>VALUES</InlineCode>
      里的值到底该怎么写"，是新手最容易出语法错误的地方。
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
        ）：在 SQL 里<Text bold>以"带单引号的字符串"形式书写</Text>，常用格式{' '}
        <InlineCode>'YYYY-MM-DD'</InlineCode>（如 <InlineCode>'2023-07-15'</InlineCode>
        ），数据库会自动把它转成日期。
      </ListItem>
    </UnorderedList>
    <Callout type="danger" title="常见坑">
      <UnorderedList>
        <ListItem>
          用<Text bold>双引号</Text>有时也能跑（MySQL 默认允许），但
          <Text bold>标准 SQL 用单引号</Text>，请统一用单引号，避免在开启{' '}
          <InlineCode>ANSI_QUOTES</InlineCode> 模式时把双引号当成"列名标识符"而报错。
        </ListItem>
        <ListItem>
          字符串忘了加引号会报错{' '}
          <InlineCode>Unknown column 'xxx' in 'field list'</InlineCode>——因为 MySQL
          把没加引号的 <InlineCode>张三</InlineCode> 当成了"列名"去找。
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
      第二种写法 MySQL 通常会"宽容地"把字符串 <InlineCode>'8000'</InlineCode>
      隐式转成数字 8000，<Text bold>能插进去但不规范</Text>。养成好习惯：
      <Text bold>数值就是裸数字，不加引号</Text>。
    </Paragraph>

    <Heading3>2.3 NULL 值：直接写 NULL（不加引号）</Heading3>
    <Paragraph>
      <InlineCode>bonus</InlineCode>（奖金）列允许为空。表示"没有奖金/未知"时，写关键字{' '}
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
          <InlineCode>NULL</InlineCode>（不加引号）= 真正的"空值/没有值"。
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

    <Heading3>2.4 列与值的"顺序"必须严格对应</Heading3>
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
      。这种<Text bold>"语法没错、数据全乱"</Text>的 bug 最难查。
    </Paragraph>
    <Callout type="tip" title="提示">
      <Paragraph>
        列清单的顺序<Text bold>不必和表定义顺序一致</Text>
        ，你可以自由调整，只要"列清单的顺序"和"值的顺序"互相对应即可。例如下面这样把{' '}
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
  </article>
);

export default index;
