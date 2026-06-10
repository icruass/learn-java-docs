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
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>CREATE TABLE 与数据类型</Title>

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
  </article>
);

export default index;
