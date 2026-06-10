# DDL：操作表（增删改查表结构）、数据类型与 SQLyog 图形化工具

> **本章导读**
>
> 在上一章里，我们用 DDL（Data Definition Language，数据定义语言）学会了「操作数据库」——`CREATE DATABASE` / `SHOW DATABASES` / `DROP DATABASE` / `USE`。可是「库」只是一个空壳容器，真正用来装数据的是**表（Table）**。
>
> 你可以这样类比：
> - **数据库** = 一个 Excel 工作簿（一个 `.xlsx` 文件）；
> - **表** = 工作簿里的一张工作表（Sheet）；
> - **列（字段）** = 表头那一行（姓名、工资、入职日期……）；
> - **行（记录）** = 表里的每一条数据。
>
> 本章我们把镜头从「库」拉近到「表」，要把表这一层彻底讲透，具体包括：
> 1. **查询表**：怎么看库里有哪些表、一张表长什么样；
> 2. **创建表**：`CREATE TABLE` 的完整语法，并亲手把贯穿全套教程的 `dept`、`emp` 两张表建出来；
> 3. **数据类型**：建表时每个列要声明「类型」，这是 MySQL 最容易踩坑、也最体现功底的地方（`INT` 还是 `BIGINT`？`DOUBLE` 还是 `DECIMAL`？`CHAR` 还是 `VARCHAR`？`DATETIME` 还是 `TIMESTAMP`？）；
> 4. **删除表**：`DROP TABLE`；
> 5. **修改表**：`ALTER TABLE`——改表名、改字符集、加列、改列、删列；
> 6. **复制表结构**：`CREATE TABLE ... LIKE ...`；
> 7. **图形化工具**：SQLyog / Navicat 怎么连接、怎么可视化建库建表、为什么说「鼠标点点点的本质还是在生成 SQL」。
>
> 学完本章，你就能**徒手定义出符合业务需要、类型选得恰到好处的表结构**。这是后面所有 DML（增删改数据）、DQL（查询数据）章节的地基——没有合理的表，写再花哨的查询都是空中楼阁。

---

## 0. 准备工作：先把库建好、切进去

本章所有示例都在数据库 `db_learn` 里操作。先确保它存在并切换进去（这是上一章的内容，这里快速回顾）：

```sql
-- 如果不存在就创建，避免重复执行报错
CREATE DATABASE IF NOT EXISTS db_learn
    DEFAULT CHARACTER SET utf8mb4;

-- 切换到该库，之后的所有建表/查表都在这个库里发生
USE db_learn;
```

执行结果（命令行下）：

```
Query OK, 1 row affected (0.01 sec)
Database changed
```

> 💡 **提示**：`USE db_learn;` 之后，命令行提示符虽然不变，但「当前数据库」已经变了。后续 `CREATE TABLE emp ...` 等价于 `CREATE TABLE db_learn.emp ...`。如果不先 `USE`，又不写库名前缀，MySQL 会报 `ERROR 1046 (3D000): No database selected`。

---

## 1. DDL 操作表的整体认识

操作「表」一共四类动作，和操作「库」一一对应，记忆负担很小：

| 动作 | 关键字 | 操作库（上一章） | 操作表（本章） |
| --- | --- | --- | --- |
| 查（Retrieve） | `SHOW` / `DESC` | `SHOW DATABASES;` | `SHOW TABLES;` / `DESC 表名;` |
| 增（Create） | `CREATE` | `CREATE DATABASE 库名;` | `CREATE TABLE 表名(...);` |
| 删（Drop） | `DROP` | `DROP DATABASE 库名;` | `DROP TABLE 表名;` |
| 改（Alter） | `ALTER` | `ALTER DATABASE ...;` | `ALTER TABLE ...;` |

我们按「**先会看 → 再会建 → 弄懂类型 → 会删 → 会改 → 会复制**」的顺序展开。先教「查」，是因为你创建任何东西之后，第一反应都应该是「查一下，看看是不是真建对了」。

---

## 2. 查询表

> 💡 这一节有个小小的「先有鸡还是先有蛋」问题：库里现在还没有表，`SHOW TABLES` 会是空的。没关系，你先记住这些命令的用法，等第 3 节建完表，回头再跑一遍就能看到效果了。本节末尾会给出「建表后」的真实结果。

### 2.1 查看当前库里有哪些表：`SHOW TABLES;`

**语法格式：**

```sql
SHOW TABLES;
```

**逐项解释：**
- `SHOW TABLES` 列出**当前所选数据库**（即你 `USE` 的那个库）里的所有表名。
- 想看别的库的表，可以加 `FROM`：`SHOW TABLES FROM 库名;`。

**示例（在还没建表时执行）：**

```sql
SHOW TABLES;
```

**结果：**

```
Empty set (0.00 sec)
```

空的，符合预期。等会儿建完 `dept`、`emp` 再来看。

### 2.2 查看表结构：`DESC 表名;`

`DESC` 是 `DESCRIBE` 的缩写，用来**快速查看一张表有哪些列、每列什么类型、有没有约束**。这是日常用得最频繁的命令之一——拿到一张陌生的表，第一件事就是 `DESC` 它。

**语法格式：**

```sql
DESC 表名;
-- 或写全：DESCRIBE 表名;
```

**示例（建完 emp 表后）：**

```sql
DESC emp;
```

**结果：**

| Field | Type | Null | Key | Default | Extra |
| --- | --- | --- | --- | --- | --- |
| id | int | NO | PRI | NULL | auto_increment |
| ename | varchar(20) | YES | | NULL | |
| gender | char(1) | YES | | NULL | |
| salary | double | YES | | NULL | |
| join_date | date | YES | | NULL | |
| dept_id | int | YES | MUL | NULL | |
| bonus | double | YES | | NULL | |

**怎么读这张表：**
- **Field**：列名。
- **Type**：列的数据类型（第 3 节会逐一讲）。
- **Null**：该列是否允许为 `NULL`。`YES` 允许，`NO` 不允许。
- **Key**：键信息。`PRI` 主键、`UNI` 唯一键、`MUL` 普通索引/外键列（Multiple，表示允许重复值的索引）。
- **Default**：默认值。没设就是 `NULL`。
- **Extra**：附加信息。常见的有 `auto_increment`（自增）。

### 2.3 查看建表语句：`SHOW CREATE TABLE 表名;`

`DESC` 是「精简版」结构，而 `SHOW CREATE TABLE` 会把这张表**完整的建表 SQL**反向「打印」出来——包含字符集、存储引擎、约束的完整定义。当你想「照着已有表再建一张类似的表」或「排查字符集/引擎问题」时非常有用。

**语法格式：**

```sql
SHOW CREATE TABLE 表名;
```

**示例：**

```sql
SHOW CREATE TABLE emp;
```

**结果（关键部分）：**

```sql
CREATE TABLE `emp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ename` varchar(20) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `salary` double DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `dept_id` int DEFAULT NULL,
  `bonus` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_emp_dept` (`dept_id`),
  CONSTRAINT `fk_emp_dept` FOREIGN KEY (`dept_id`) REFERENCES `dept` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

**注意几个细节：**
- 列名/表名被反引号 `` ` `` 包起来了。反引号是 MySQL 用来「转义标识符」的，避免列名和关键字撞车（比如你真的想把列叫 `order`、`desc`）。手写时一般不用加，让 MySQL 自动加即可。
- `ENGINE=InnoDB`：存储引擎。现代 MySQL 默认就是 InnoDB（支持事务、外键、行锁），后面讲事务时会再展开。
- `DEFAULT CHARSET=utf8mb4`：字符集。
- `AUTO_INCREMENT=6`：表示下一个自增 id 会从 6 开始（因为我们已经插了 5 条数据）。

> 💡 **三者怎么选用**：日常看「有哪些表」用 `SHOW TABLES`；想快速扫一眼「字段和类型」用 `DESC`；想看「完整定义/复制建表语句」用 `SHOW CREATE TABLE`。

---

## 3. 创建表 `CREATE TABLE`

终于到了最核心的部分。**建表 = 给数据画好格子**，格子的多少（列）、每个格子能装什么（类型）、能不能空（约束），都在 `CREATE TABLE` 里一次性说清楚。

### 3.1 基本语法

**语法格式：**

```sql
CREATE TABLE 表名 (
    列名1  数据类型1  [约束1],
    列名2  数据类型2  [约束2],
    ......
    列名n  数据类型n  [约束n]   -- 注意：最后一列后面不要加逗号！
);
```

**逐项解释：**
- `表名`：表的名字。建议小写 + 下划线，见名知意（如 `emp`、`order_item`）。
- `列名`：字段名，同样建议小写 + 下划线。
- `数据类型`：这一列存什么（整数、小数、字符串、日期……），见第 4 节。
- `约束`（可选）：对这一列的额外限制，常见的有：
  - `PRIMARY KEY`：主键，唯一标识一行，不能重复、不能为空；
  - `AUTO_INCREMENT`：自增（通常配合主键，插入时不用手填 id）；
  - `NOT NULL`：非空；
  - `UNIQUE`：唯一（值不能重复，但可以为空）；
  - `DEFAULT 值`：默认值；
  - `FOREIGN KEY ... REFERENCES ...`：外键（约束本表某列必须引用另一张表已存在的值）。

> ⚠️ **注意：最常见的语法错误**——在最后一个列定义后面多写了一个逗号，例如：
> ```sql
> CREATE TABLE t (
>     id INT,
>     name VARCHAR(20),   -- ← 这个逗号是多余的
> );
> ```
> 会报 `ERROR 1064 ... You have an error in your SQL syntax`。养成习惯：**逗号是「分隔符」，加在两列之间，最后一列不加。**

### 3.2 实战：创建部门表 `dept`

`dept` 表很简单，三列：编号、部门名、所在城市。

```sql
CREATE TABLE dept (
    id        INT PRIMARY KEY AUTO_INCREMENT,   -- 部门编号：主键 + 自增
    dept_name VARCHAR(20),                       -- 部门名称：最长 20 字符
    loc       VARCHAR(20)                        -- 所在城市
);
```

**执行结果：**

```
Query OK, 0 rows affected (0.03 sec)
```

`0 rows affected` 是正常的——建表是「定义结构」，本来就没有数据行被影响。

### 3.3 实战：创建员工表 `emp`（一对多的「多」方）

`emp` 比 `dept` 复杂：它要通过 `dept_id` **外键**指向 `dept.id`，表达「一个部门有多个员工」的一对多关系。

```sql
CREATE TABLE emp (
    id        INT PRIMARY KEY AUTO_INCREMENT,   -- 员工编号
    ename     VARCHAR(20),                       -- 姓名
    gender    CHAR(1),                            -- 性别 男/女（定长 1）
    salary    DOUBLE,                             -- 工资
    join_date DATE,                               -- 入职日期（只要年月日）
    dept_id   INT,                                -- 所属部门（外键 -> dept.id）
    bonus     DOUBLE,                             -- 奖金（可能为 NULL）
    -- 外键约束：给约束起个名字 fk_emp_dept，便于以后维护
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);
```

**逐项解读外键这一行：**
- `CONSTRAINT fk_emp_dept`：给这个约束命名为 `fk_emp_dept`（fk = foreign key）。不写也行，MySQL 会自动起名，但自己起名后续删改更方便。
- `FOREIGN KEY (dept_id)`：声明本表的 `dept_id` 是外键。
- `REFERENCES dept(id)`：它引用 `dept` 表的 `id` 列。

> ⚠️ **注意：必须先建被引用的表**。`emp` 引用了 `dept`，所以**一定要先建 `dept`，再建 `emp`**。反过来会报 `ERROR 1824 ... Failed to open the referenced table 'dept'`。这就像你要在通讯录里填「公司」，得这个公司先存在。

### 3.4 顺手把数据也插进去（为后面章节做准备）

虽然插入数据属于 DML（下一章详讲），但本套教程的例子都依赖这批数据，这里先把它们灌进去：

```sql
-- 先插部门（被引用方）
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
    ('孙七','男',15000,'2018-11-05', 3, 3000);
```

**执行结果：**

```
Query OK, 3 rows affected (0.01 sec)   -- dept
Query OK, 5 rows affected (0.01 sec)   -- emp
```

现在回到第 2 节的 `SHOW TABLES;` 再跑一次：

```sql
SHOW TABLES;
```

**结果：**

| Tables_in_db_learn |
| --- |
| dept |
| emp |

两张表都在了。本章后面的修改、复制都基于这两张表。

---

## 4. MySQL 常用数据类型详解

建表时每一列都要声明类型。**选对类型 = 既省空间、又防错、又快**；选错类型轻则浪费、重则丢精度（比如用错类型导致工资多算一分钱）。MySQL 类型很多，我们按「整数 / 小数 / 字符串 / 日期时间」四大类讲，覆盖 95% 的日常场景。

### 4.1 整数类型

存「没有小数点的数」，如年龄、id、数量。区别只在于「能存多大」和「占多少字节」。

| 类型 | 字节 | 有符号范围（约） | 无符号范围（UNSIGNED） | 典型用途 |
| --- | --- | --- | --- | --- |
| `TINYINT` | 1 | -128 ~ 127 | 0 ~ 255 | 状态、布尔(0/1)、年龄 |
| `SMALLINT` | 2 | -3.2 万 ~ 3.2 万 | 0 ~ 6.5 万 | 小范围计数 |
| `INT` | 4 | -21 亿 ~ 21 亿 | 0 ~ 42 亿 | **最常用**，普通 id、数量 |
| `BIGINT` | 8 | ±9.2×10¹⁸ | 0 ~ 1.8×10¹⁹ | 大表主键、订单号、时间戳毫秒 |

**示例：**

```sql
-- 演示不同整数类型
CREATE TABLE demo_int (
    age      TINYINT,            -- 年龄 0~127 够了
    quantity INT,                -- 普通数量
    user_id  BIGINT UNSIGNED     -- 用户量可能上亿，且 id 非负，用 BIGINT UNSIGNED
);
```

**几个要点：**
- `UNSIGNED`（无符号）表示「不要负数」，能把正数上限**翻倍**。比如年龄、库存这类天然非负的字段可以加，但很多团队为简单起见统一不加，避免无符号与有符号做减法时溢出。
- 你可能见过 `INT(11)` 这种写法，**括号里的数字不是「最多存几位」**，而是「显示宽度」（配合 `ZEROFILL` 补零用），对实际能存的数值范围**毫无影响**。MySQL 8.0 已经把它标记为废弃，所以**别再写 `INT(11)`，直接写 `INT` 即可**。

> 🕳️ **常见坑**：把「手机号」存成 `INT`。手机号 11 位（如 13800138000）已经超过 `INT` 的 21 亿上限，会被截断或报错。手机号、身份证号这类「看起来是数字、但不参与加减运算、可能有前导 0」的，**应当用字符串（`VARCHAR`）存**。

### 4.2 小数类型：`FLOAT` / `DOUBLE` / `DECIMAL`

这是面试高频、生产事故高发区。三者都能存小数，但**精度机制完全不同**。

| 类型 | 字节 | 精度 | 本质 | 适用场景 |
| --- | --- | --- | --- | --- |
| `FLOAT` | 4 | 单精度，约 7 位有效数字 | **近似值**（二进制浮点） | 对精度不敏感的科学/统计数据 |
| `DOUBLE` | 8 | 双精度，约 15 位有效数字 | **近似值**（二进制浮点） | 同上，精度比 FLOAT 高 |
| `DECIMAL(M,D)` | 变长 | **精确值** | 按十进制定点存储 | **金额、价格**等不能错的钱 |

**`DECIMAL(M,D)` 语法解释：**
- `M`：总位数（精度，precision），最大 65。
- `D`：小数位数（标度，scale）。
- 例如 `DECIMAL(10,2)`：总共 10 位，其中 2 位是小数 → 最大能存 `99999999.99`（整数部分 8 位）。

**示例——直观感受「近似」与「精确」的差别：**

```sql
CREATE TABLE demo_money (
    price_double  DOUBLE,          -- 近似
    price_decimal DECIMAL(10, 2)   -- 精确
);

INSERT INTO demo_money VALUES (0.1 + 0.2, 0.1 + 0.2);

SELECT price_double, price_decimal FROM demo_money;
```

**结果：**

| price_double | price_decimal |
| --- | --- |
| 0.30000000000000004 | 0.30 |

看到了吗？`DOUBLE` 算 `0.1 + 0.2` 得到的是 `0.30000000000000004`——这不是 MySQL 的 bug，而是**所有用二进制浮点的语言（Java 的 `double`、JavaScript 的 `number` 都一样）的通病**：很多十进制小数无法用有限位二进制精确表示。而 `DECIMAL` 用十进制定点存储，结果就是干净的 `0.30`。

> ⚠️ **注意（铁律）**：**凡是和钱有关的字段（工资、价格、金额、余额），一律用 `DECIMAL`**，绝不用 `FLOAT`/`DOUBLE`。否则对账时多出 / 少了几厘钱，财务会找你麻烦。
>
> 📌 关于本教程的 `emp.salary` 用了 `DOUBLE`：那是为了和原始教学素材保持一致、且便于初学演示。**真实项目里工资应该用 `DECIMAL(10,2)`**。请把这当成一个「现实中要改正」的反面案例记住。

> 💡 **提示**：在 Java（JDBC）里，`DECIMAL` 列应当映射成 `java.math.BigDecimal`，而不是 `double`，才能保住精度：
> ```java
> BigDecimal salary = resultSet.getBigDecimal("salary");
> ```

### 4.3 字符串类型：`CHAR` vs `VARCHAR`

存文字。最核心的是搞懂**定长 `CHAR` 和变长 `VARCHAR` 的区别**。

| 类型 | 长度特性 | 存储方式 | 适用场景 |
| --- | --- | --- | --- |
| `CHAR(n)` | **定长**，固定占 n 个字符 | 不足 n 时用空格补齐到 n（取出时去掉尾部空格） | 长度几乎固定的：性别、国家代码、MD5、身份证号 |
| `VARCHAR(n)` | **变长**，最多 n 个字符 | 实际存多少占多少（+1~2 字节记长度） | 长度不定的：姓名、标题、地址、备注 |

**类比记忆**：
- `CHAR(10)` 像「**固定 10 格的格子**」，你写「张三」也照样占 10 格，剩下 8 格用空格填满——**取数据快**（每行长度固定，定位方便），但**可能浪费空间**。
- `VARCHAR(10)` 像「**伸缩抽屉**」，最多放 10 个字符，放「张三」就只占「张三」+ 一点点长度记录——**省空间**，但因为长度不定，处理上略慢一点点。

**示例：**

```sql
CREATE TABLE demo_str (
    gender   CHAR(1),        -- 性别永远 1 个字 → 定长最合适
    ename    VARCHAR(20),    -- 姓名长度不定 → 变长
    intro    VARCHAR(255)    -- 简介
);

INSERT INTO demo_str VALUES ('男', '诸葛孔明', '蜀汉丞相');
SELECT CONCAT('[', gender, ']') AS g, ename FROM demo_str;
```

**结果：**

| g | ename |
| --- | --- |
| [男] | 诸葛孔明 |

> ⚠️ **注意：长度单位是「字符」不是「字节」**。在 `utf8mb4` 下，`VARCHAR(20)` 能存 20 个汉字（早期按字节算的认知是错的，那是更老的版本/字符集）。所以 `ename VARCHAR(20)` 存「诸葛孔明」（4 字）绰绰有余。

> 🕳️ **常见坑 1**：超长截断。如果往 `VARCHAR(20)` 塞 21 个字符，在严格模式（MySQL 8 默认严格）下会**直接报错** `ERROR 1406: Data too long for column`；在非严格模式下会被悄悄截断成 20 个，丢数据。所以列长度要留足余量。

> 🕳️ **常见坑 2**：`CHAR` 的尾部空格被吃掉。`CHAR` 在比较和取出时会去掉尾部空格，存 `'abc   '` 取出来是 `'abc'`。如果你的业务真的要保留尾部空格，用 `VARCHAR`。

### 4.4 大文本与二进制：`TEXT` / `BLOB`

当内容可能很长（一篇文章、一段 JSON），超过 `VARCHAR` 上限时，用 `TEXT` 系列；存图片、文件等二进制用 `BLOB` 系列。

| 类型 | 最大长度（约） | 存什么 |
| --- | --- | --- |
| `TINYTEXT` | 255 字节 | 很短文本 |
| `TEXT` | 64 KB | 文章、长描述、JSON 字符串 |
| `MEDIUMTEXT` | 16 MB | 超长文本 |
| `LONGTEXT` | 4 GB | 极长文本 |
| `BLOB` 系列 | 同上量级 | 二进制：图片、音频、文件 |

**示例：**

```sql
CREATE TABLE demo_article (
    id      INT PRIMARY KEY AUTO_INCREMENT,
    title   VARCHAR(100),    -- 标题用 VARCHAR
    content TEXT,            -- 正文可能很长，用 TEXT
    cover   BLOB             -- 封面图二进制（实际项目更推荐存 OSS/文件系统，库里只存 URL）
);
```

> 💡 **提示**：`TEXT` / `BLOB` 不能设默认值，且检索性能不如 `VARCHAR`。实际工程里**很少把大文件直接塞进数据库**——通常把文件存到对象存储（如阿里云 OSS），数据库里只用 `VARCHAR` 存一个访问 URL。`BLOB` 了解即可。

### 4.5 日期时间类型：`DATE` / `DATETIME` / `TIMESTAMP`

存日期和时间，三者区别要分清。

| 类型 | 格式 | 范围 | 占用 | 特点 |
| --- | --- | --- | --- | --- |
| `DATE` | `YYYY-MM-DD` | 1000-01-01 ~ 9999-12-31 | 3 字节 | 只有年月日 |
| `TIME` | `HH:MM:SS` | -838:59:59 ~ 838:59:59 | 3 字节 | 只有时分秒 |
| `DATETIME` | `YYYY-MM-DD HH:MM:SS` | 1000 年 ~ 9999 年 | 8 字节 | 年月日 + 时分秒，**与时区无关，存什么取什么** |
| `TIMESTAMP` | `YYYY-MM-DD HH:MM:SS` | **1970 ~ 2038-01-19** | 4 字节 | **受时区影响**，可自动更新 |

**示例——三种类型的直观差异：**

```sql
CREATE TABLE demo_time (
    join_date  DATE,        -- 入职日期：只关心哪天 → DATE
    create_at  DATETIME,    -- 创建时间：要精确到秒，且不希望随时区变 → DATETIME
    update_at  TIMESTAMP    -- 更新时间：随系统时区，且想自动更新 → TIMESTAMP
);

INSERT INTO demo_time (join_date, create_at, update_at)
VALUES ('2020-01-10', '2020-01-10 09:30:00', '2020-01-10 09:30:00');

SELECT * FROM demo_time;
```

**结果：**

| join_date | create_at | update_at |
| --- | --- | --- |
| 2020-01-10 | 2020-01-10 09:30:00 | 2020-01-10 09:30:00 |

#### 4.5.1 `TIMESTAMP` 的两大特殊行为

**特殊点 1：受时区影响。** `TIMESTAMP` 内部实际存的是「从 1970-01-01 UTC 起的秒数（时间戳）」，读写时会根据**当前会话时区**做换算。`DATETIME` 则是「你存啥它存啥」，跟时区无关。

举例：同一行 `TIMESTAMP` 数据，把会话时区从北京（+8）改成 UTC（+0），读出来会差 8 小时；而 `DATETIME` 纹丝不动。

```sql
SET time_zone = '+08:00';
SELECT update_at FROM demo_time;   -- 2020-01-10 09:30:00

SET time_zone = '+00:00';
SELECT update_at FROM demo_time;   -- 2020-01-10 01:30:00（往前 8 小时）
```

**特殊点 2：可自动维护时间。** `TIMESTAMP`（以及 MySQL 5.6.5+ 的 `DATETIME`）支持两个自动属性：
- `DEFAULT CURRENT_TIMESTAMP`：插入新行时，自动填入「当前时间」；
- `ON UPDATE CURRENT_TIMESTAMP`：每次该行被 `UPDATE` 时，自动刷新成「当前时间」。

**示例——做一个自动维护「创建时间 + 更新时间」的表：**

```sql
CREATE TABLE demo_auto_time (
    id        INT PRIMARY KEY AUTO_INCREMENT,
    content   VARCHAR(50),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                              -- 插入时自动填
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP   -- 插入时填 + 每次改自动刷新
);

INSERT INTO demo_auto_time (content) VALUES ('第一条');
SELECT * FROM demo_auto_time;
```

**结果（时间为示意）：**

| id | content | create_at | update_at |
| --- | --- | --- | --- |
| 1 | 第一条 | 2026-06-07 10:00:00 | 2026-06-07 10:00:00 |

过一会儿更新它：

```sql
UPDATE demo_auto_time SET content = '改过了' WHERE id = 1;
SELECT * FROM demo_auto_time;
```

**结果：**

| id | content | create_at | update_at |
| --- | --- | --- | --- |
| 1 | 改过了 | 2026-06-07 10:00:00 | 2026-06-07 10:05:30 |

注意 `create_at` 没变，而 `update_at` 自动刷新了。这套机制在实际开发里非常常用，省去手动维护时间字段的麻烦。

> 🕳️ **常见坑：`TIMESTAMP` 的 2038 问题**。`TIMESTAMP` 只能表示到 **2038-01-19 03:14:07 UTC**（4 字节秒数会溢出，俗称「2038 千年虫」）。如果你的业务可能涉及 2038 年以后的时间（比如 30 年期的贷款到期日），**用 `DATETIME` 而不是 `TIMESTAMP`**。

> 💡 **`DATETIME` 还是 `TIMESTAMP`？经验法则**：
> - 想要「自动随时区换算」「自动更新」、且时间不会超过 2038 → `TIMESTAMP`（常用于 `update_time`）。
> - 想要「存啥取啥、不受时区干扰、范围大」→ `DATETIME`（常用于业务日期，如合同到期、预约时间）。
> - 只要日期不要时间 → `DATE`（如本教程的 `join_date`）。

### 4.6 数据类型选择「速查口诀」

- 整数默认 `INT`，可能上亿用 `BIGINT`，状态/布尔用 `TINYINT`。
- **钱必用 `DECIMAL`**，科学统计才考虑 `DOUBLE`，`FLOAT` 基本别用。
- 短而定长（性别、代码）用 `CHAR`，其余文字用 `VARCHAR`，超长用 `TEXT`。
- 手机号/身份证号/银行卡号 → `VARCHAR`（别用整数！）。
- 只要日期 `DATE`；要时间且怕 2038/要存啥取啥 `DATETIME`；要自动更新/时区 `TIMESTAMP`。

---

## 5. 删除表 `DROP TABLE`

### 5.1 基本语法

```sql
DROP TABLE 表名;
```

这会**连表结构带表里所有数据一起彻底删除**，不可恢复（没开 binlog 备份的话）。

**示例：**

```sql
DROP TABLE demo_int;
```

**结果：**

```
Query OK, 0 rows affected (0.02 sec)
```

### 5.2 安全删除：`IF EXISTS`

如果要删的表**不存在**，`DROP TABLE 表名;` 会报错：

```sql
DROP TABLE not_exist_table;
-- ERROR 1051 (42S02): Unknown table 'db_learn.not_exist_table'
```

加上 `IF EXISTS`，「存在才删，不存在就跳过」，不会报错——这在写**可重复执行的脚本**时几乎是标配：

```sql
DROP TABLE IF EXISTS not_exist_table;
```

**结果（不存在时）：**

```
Query OK, 0 rows affected, 1 warning (0.00 sec)
```

只给一个 warning，不报错。常见的「初始化脚本」开头都会这样写：

```sql
DROP TABLE IF EXISTS emp;
DROP TABLE IF EXISTS dept;
CREATE TABLE dept (...);
CREATE TABLE emp (...);
```

> ⚠️ **注意：删除顺序受外键约束**。`emp` 通过外键依赖 `dept`，如果先删 `dept`，会报 `ERROR 3730 ... Cannot drop table 'dept' referenced by a foreign key constraint`。所以**要先删「引用方」`emp`，再删「被引用方」`dept`**（和建表顺序正好相反）。

> 🕳️ **常见坑：`DROP` vs `DELETE` vs `TRUNCATE` 别搞混**：
> | 命令 | 类别 | 作用 | 表结构 | 能否带 WHERE | 速度 |
> | --- | --- | --- | --- | --- | --- |
> | `DROP TABLE emp` | DDL | 删表（结构+数据全没） | 没了 | 否 | 快 |
> | `TRUNCATE TABLE emp` | DDL | 清空所有数据，保留空表 | 保留 | 否 | 很快 |
> | `DELETE FROM emp` | DML | 删数据（可按条件） | 保留 | **可以** | 较慢（逐行） |
>
> 想「只清数据、保留表」用 `TRUNCATE`；想「按条件删部分数据」用 `DELETE ... WHERE`；想「连表都不要了」才用 `DROP`。

---

## 6. 修改表 `ALTER TABLE`

表建好后，业务变化常常要改它：改名、加字段、改字段类型、删字段。统一用 `ALTER TABLE`。下面逐个讲，**为了不破坏后续章节用的 `emp`/`dept`，演示尽量用临时表或在演示后改回来**。

先准备一张演示用的临时表：

```sql
CREATE TABLE student (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20)
);
```

### 6.1 修改表名：`RENAME TO`

**语法：**

```sql
ALTER TABLE 表名 RENAME TO 新表名;
```

**示例：**

```sql
ALTER TABLE student RENAME TO stu;   -- 把 student 改名为 stu
SHOW TABLES;                          -- 验证：现在叫 stu 了
ALTER TABLE stu RENAME TO student;   -- 演示完改回来，便于后面继续用
```

> 💡 也可以写 `RENAME TABLE student TO stu;`（去掉 `ALTER ...`），效果一样，而且 `RENAME TABLE` 还支持一次改多张表。

### 6.2 修改表的字符集

**语法：**

```sql
ALTER TABLE 表名 CHARACTER SET 字符集名;
```

**示例：**

```sql
-- 假设有张老表是 utf8（3 字节，不支持 emoji），改成 utf8mb4（4 字节，支持 emoji）
ALTER TABLE student CHARACTER SET utf8mb4;

-- 验证
SHOW CREATE TABLE student;
-- 末尾可见 DEFAULT CHARSET=utf8mb4
```

> 💡 **提示**：`utf8` 在 MySQL 里其实是「阉割版」（最多 3 字节，存不了 emoji 😀 这类 4 字节字符），现代项目一律用 `utf8mb4`。注意：改表的默认字符集只影响**之后新增的列**，已有列若也要改，需要用 `CONVERT TO CHARACTER SET`：
> ```sql
> ALTER TABLE student CONVERT TO CHARACTER SET utf8mb4;
> ```

### 6.3 添加列：`ADD`

**语法：**

```sql
ALTER TABLE 表名 ADD 列名 数据类型 [约束];
```

**示例——给 `student` 加一个「年龄」列：**

```sql
ALTER TABLE student ADD age INT;
DESC student;
```

**结果：**

| Field | Type | Null | Key | Default | Extra |
| --- | --- | --- | --- | --- | --- |
| id | int | NO | PRI | NULL | auto_increment |
| name | varchar(20) | YES | | NULL | |
| age | int | YES | | NULL | |

> 💡 新增列默认加在**最后**。想控制位置可用 `AFTER 某列` 或 `FIRST`：
> ```sql
> ALTER TABLE student ADD email VARCHAR(50) AFTER name;  -- 加在 name 之后
> ALTER TABLE student ADD no INT FIRST;                  -- 加在最前面
> ```

### 6.4 修改列名 + 类型：`CHANGE`

`CHANGE` 能**同时改列名和类型**，所以它需要你写两个列名：旧的和新的。

**语法：**

```sql
ALTER TABLE 表名 CHANGE 旧列名 新列名 新数据类型 [约束];
```

**示例——把 `age`（INT）改名成 `student_age` 并改类型为 `TINYINT`：**

```sql
ALTER TABLE student CHANGE age student_age TINYINT;
DESC student;
```

**结果（节选）：**

| Field | Type |
| --- | --- |
| student_age | tinyint |

> ⚠️ **注意**：`CHANGE` 后面要写**两次列名**（即使你只想改类型不改名，也得把旧名重复写一遍）。如果只想改类型、不想重复写列名，请用下面的 `MODIFY`。

### 6.5 只改类型（不改列名）：`MODIFY`

**语法：**

```sql
ALTER TABLE 表名 MODIFY 列名 新数据类型 [约束];
```

**示例——把 `student_age` 的类型从 `TINYINT` 改回 `INT`：**

```sql
ALTER TABLE student MODIFY student_age INT;
DESC student;
```

**结果（节选）：**

| Field | Type |
| --- | --- |
| student_age | int |

**`CHANGE` 与 `MODIFY` 对比记忆：**

| 关键字 | 能改列名 | 能改类型 | 语法里写几个列名 |
| --- | --- | --- | --- |
| `CHANGE` | ✅ | ✅ | 2 个（旧名 + 新名） |
| `MODIFY` | ❌ | ✅ | 1 个 |

> 🕳️ **常见坑：改类型可能丢数据**。如果列里已经有数据，把 `VARCHAR(20)` 改成 `VARCHAR(5)`，或把 `INT` 改成 `TINYINT` 时，**超出新类型范围的数据会被截断或报错**。改类型前务必确认现有数据都能放进新类型。

### 6.6 删除列：`DROP`

**语法：**

```sql
ALTER TABLE 表名 DROP 列名;
```

**示例——删掉 `student_age` 列：**

```sql
ALTER TABLE student DROP student_age;
DESC student;
```

**结果：**

| Field | Type | Null | Key | Default | Extra |
| --- | --- | --- | --- | --- | --- |
| id | int | NO | PRI | NULL | auto_increment |
| name | varchar(20) | YES | | NULL | |
| email | varchar(50) | YES | | NULL | |

> ⚠️ 注意区分：`ALTER TABLE 表名 DROP 列名;`（删一个**列**） 和 `DROP TABLE 表名;`（删整张**表**）。前者有 `ALTER`，后者没有。少写一个 `ALTER`，后果天差地别。

### 6.7 `ALTER TABLE` 子命令小结表

| 目的 | 语法 |
| --- | --- |
| 改表名 | `ALTER TABLE 表名 RENAME TO 新名;` |
| 改字符集 | `ALTER TABLE 表名 CHARACTER SET 字符集;` |
| 加列 | `ALTER TABLE 表名 ADD 列名 类型;` |
| 改列名+类型 | `ALTER TABLE 表名 CHANGE 旧列名 新列名 新类型;` |
| 只改类型 | `ALTER TABLE 表名 MODIFY 列名 新类型;` |
| 删列 | `ALTER TABLE 表名 DROP 列名;` |

演示用的临时表用完可以删掉：

```sql
DROP TABLE IF EXISTS student;
```

---

## 7. 复制表结构：`CREATE TABLE ... LIKE ...`

有时你想要一张**和现有表结构一模一样的新表**（同样的列、类型、约束、索引），但**不要数据**——比如做归档表、临时测试表。这时用 `LIKE` 最快。

**语法：**

```sql
CREATE TABLE 新表名 LIKE 旧表名;
```

**示例——照着 `emp` 复制出一张空的 `emp_bak`（备份表）：**

```sql
CREATE TABLE emp_bak LIKE emp;
DESC emp_bak;          -- 结构和 emp 完全一致
SELECT COUNT(*) FROM emp_bak;   -- 但里面没有数据
```

**结果：**

`DESC emp_bak` 输出的结构与 `emp` 完全相同；而：

| COUNT(*) |
| --- |
| 0 |

说明结构复制了，数据没复制。

> 💡 **提示：如果连数据一起要**，用 `CREATE TABLE ... AS SELECT`（这条会把查询结果连数据一起灌进新表）：
> ```sql
> CREATE TABLE emp_copy AS SELECT * FROM emp;   -- 结构 + 数据都复制
> ```
> 但要注意：`AS SELECT` 方式**不会复制主键、自增、外键、索引等约束**（只复制列和数据）。需要严格相同结构就用 `LIKE`；需要带数据再补约束就用 `AS SELECT`。

| 复制方式 | 复制结构 | 复制数据 | 复制约束/索引 |
| --- | --- | --- | --- |
| `CREATE TABLE 新 LIKE 旧` | ✅ | ❌ | ✅ |
| `CREATE TABLE 新 AS SELECT * FROM 旧` | ✅(仅列) | ✅ | ❌ |

用完清理：

```sql
DROP TABLE IF EXISTS emp_bak;
```

---

## 8. 图形化工具：SQLyog / Navicat 等

到目前为止我们都在「命令行」里敲 SQL。命令行最纯粹、最能锻炼基本功，但日常开发中，大家更常用**图形化客户端**（GUI）来连接和管理 MySQL，因为它**直观、不易记错命令、能可视化看数据**。

常见图形化工具：
- **SQLyog**：轻量、专注 MySQL，老牌教学常用。
- **Navicat**：功能全、界面友好，商业软件（有试用）。
- **DBeaver**：免费开源、跨数据库（不止 MySQL）。
- **MySQL Workbench**：MySQL 官方出品，免费。
- **DataGrip / IDEA 内置 Database 工具**：JetBrains 系，写 Java 的同学常用。

它们的操作逻辑大同小异，下面以「SQLyog / Navicat 通用流程」讲解。

### 8.1 连接配置

打开工具，新建一个连接，本质上是填这几项参数（和命令行 `mysql -h... -P... -u... -p` 一一对应）：

| GUI 里的字段 | 含义 | 常见默认值 | 对应命令行参数 |
| --- | --- | --- | --- |
| Host / 主机 | 数据库服务器地址 | `localhost` 或 `127.0.0.1` | `-h` |
| Port / 端口 | MySQL 监听端口 | `3306` | `-P` |
| Username / 用户名 | 登录账号 | `root` | `-u` |
| Password / 密码 | 登录密码 | 安装时设置的密码 | `-p` |

填好后点「测试连接 / Test Connection」，提示成功就能「连接 / Connect」。连上后，左侧会以**树形结构**列出：连接 → 数据库（库）→ 表 → 列。

> 🕳️ **常见坑**：
> - 连不上、报 `2003 - Can't connect`：多半是 MySQL 服务没启动，或端口/主机填错，或防火墙拦了。
> - 报 `1045 - Access denied`：用户名或密码错了。
> - 远程连接报错：默认 `root` 可能只允许 `localhost` 登录，需要授权远程访问（这是权限话题，后续章节讲）。

### 8.2 可视化建库、建表

- **建库**：在左侧空白处右键 → 「Create Database / 新建数据库」，弹出对话框，填库名（如 `db_learn`）、选字符集（`utf8mb4`）、排序规则，点确定。
- **建表**：在某个库下右键 → 「Create Table / 新建表」，弹出一个**表格界面**，你像填 Excel 一样一行行加列：填列名、下拉选数据类型、设长度、勾选「主键 / 非空 / 自增」等。保存时让你输入表名。

整个过程**不用记 SQL 语法**，鼠标点选即可。这就是 GUI 最大的好处——把第 3 节那些 `CREATE TABLE` 语法变成了「填表格 + 打勾」。

### 8.3 执行 SQL、查看数据

- **写 SQL**：工具里都有「Query / 查询编辑器」窗口，把 SQL 粘进去，点「执行（运行）」按钮（通常是 F9 或 Ctrl+Enter），下方就显示结果集。
- **看数据**：双击左侧某张表，会直接以**表格形式**展示数据，可以直接在格子里改、加、删行（改完点保存）——底层照样转成 `UPDATE`/`INSERT`/`DELETE` 发给数据库。

### 8.4 关键认知：图形操作的本质仍是「生成 SQL」

这是本节最想让你记住的一句话：**所有图形化操作，最终都被工具翻译成 SQL 发给 MySQL 执行。** 鼠标点点点，只是工具替你「拼 SQL」而已。

证据：当你用 GUI 可视化建完一张表后，工具通常提供「**查看 SQL / Show SQL / SQL 预览**」按钮，点开你会看到它生成的，正是和第 3 节一模一样的 `CREATE TABLE ...` 语句。

> 💡 **学习建议**：
> 1. **初学务必先用命令行 / 手写 SQL**，把语法刻进脑子里。SQL 是数据库的「普通话」，换任何工具、任何数据库（部分通用）都用得上；而 GUI 的按钮位置各家不同，学了不通用。
> 2. **熟练后再用 GUI 提效**：日常浏览数据、临时改几条记录、画 ER 图，GUI 又快又直观。
> 3. **善用 GUI 的「生成 SQL」反向学习**：不会写某条 SQL 时，先用 GUI 点出来，再看它生成的 SQL，是很好的学习方法。
>
> 一句话：**GUI 是「方向盘助力」，SQL 才是「发动机」**。会开手动挡（命令行），再开自动挡（GUI）轻轻松松；反过来只会点鼠标，一旦上了没有 GUI 的生产服务器（只能 SSH + 命令行）就抓瞎了。

---

## 9. 本章小结

- **查表三件套**：
  - `SHOW TABLES;` 看当前库有哪些表；
  - `DESC 表名;` 看精简结构（列名、类型、约束）；
  - `SHOW CREATE TABLE 表名;` 看完整建表语句（含字符集、引擎、索引）。
- **建表**：`CREATE TABLE 表名(列名 类型 [约束], ...)`，最后一列后不加逗号；有外键时**先建被引用表**。
- **数据类型口诀**：
  - 整数：默认 `INT`，超大 `BIGINT`，状态 `TINYINT`；别用 `INT(11)` 那种宽度写法。
  - 小数：**钱用 `DECIMAL`**（精确），`DOUBLE`/`FLOAT` 是近似值会丢精度。
  - 字符串：定长 `CHAR`（性别、代码），变长 `VARCHAR`（姓名、地址），超长 `TEXT`，二进制 `BLOB`；手机号/身份证用 `VARCHAR`。
  - 日期：只要日期 `DATE`；要时间且范围大/存啥取啥 `DATETIME`；要时区/自动更新且不过 2038 用 `TIMESTAMP`。
- **删表**：`DROP TABLE [IF EXISTS] 表名;`；删表注意外键依赖**先删引用方**；分清 `DROP`（删表）/`TRUNCATE`（清空）/`DELETE`（按条件删数据）。
- **改表 `ALTER TABLE`**：`RENAME TO`（改名）、`CHARACTER SET`（改字符集）、`ADD`（加列）、`CHANGE`（改名+类型，写两个列名）、`MODIFY`（只改类型，写一个列名）、`DROP`（删列）。
- **复制表结构**：`CREATE TABLE 新 LIKE 旧;`（结构+约束，不带数据）；`CREATE TABLE 新 AS SELECT ...;`（带数据，不带约束）。
- **图形化工具**：SQLyog/Navicat 等，连接 = 填 主机/端口/用户名/密码；可视化建库建表、看改数据都很方便；但**本质都是替你生成 SQL**，所以**先练好 SQL 命令，再用 GUI 提效**。

---

## 10. 常见面试 / 易错问答

**Q1：`CHAR` 和 `VARCHAR` 有什么区别？什么时候用哪个？**
A：`CHAR(n)` 定长，永远占 n 个字符，不足补空格，读取快但费空间，适合长度固定的（性别、国家码、MD5）；`VARCHAR(n)` 变长，实际多长占多长（额外 1~2 字节记长度），省空间，适合长度不定的（姓名、地址）。规则：长度几乎不变用 `CHAR`，否则用 `VARCHAR`。

**Q2：存金额为什么不能用 `FLOAT`/`DOUBLE`？**
A：它们是二进制浮点数，是**近似值**，像 `0.1+0.2` 会得到 `0.30000000000000004`，做金额累加会出现分厘误差。金额必须用 `DECIMAL(M,D)`，它按十进制定点精确存储。Java 端对应 `BigDecimal`。

**Q3：`DATETIME` 和 `TIMESTAMP` 区别？**
A：① 范围：`DATETIME` 1000~9999 年，`TIMESTAMP` 只到 2038 年（有溢出问题）。② 时区：`TIMESTAMP` 受会话时区影响、读写会换算，`DATETIME` 存啥取啥与时区无关。③ 占用：`TIMESTAMP` 4 字节、`DATETIME` 8 字节。④ 两者都支持 `DEFAULT CURRENT_TIMESTAMP` 和 `ON UPDATE CURRENT_TIMESTAMP` 自动维护时间。怕 2038、要自动更新用 `TIMESTAMP`；范围大、要稳定用 `DATETIME`。

**Q4：`ALTER TABLE` 里 `CHANGE` 和 `MODIFY` 有啥不同？**
A：`CHANGE` 能同时改**列名和类型**，语法要写两个列名（旧名 + 新名）；`MODIFY` 只能改**类型**，写一个列名即可。只改类型用 `MODIFY` 更省事。

**Q5：`DROP`、`TRUNCATE`、`DELETE` 三者区别？**
A：`DROP TABLE` 删整张表（结构+数据全没，DDL）；`TRUNCATE TABLE` 清空所有数据但保留空表结构（DDL，很快，不可加条件）；`DELETE FROM ... WHERE` 删符合条件的数据行（DML，可回滚、可带条件，逐行删较慢）。

**Q6：手机号应该用什么类型？**
A：`VARCHAR`（如 `VARCHAR(11)` 或 `VARCHAR(20)`）。原因：手机号不参与算术运算、长度固定但可能有前导 0、且 11 位会超出 `INT` 范围。同理身份证号、银行卡号都用字符串。

**Q7：`CREATE TABLE ... LIKE` 和 `CREATE TABLE ... AS SELECT` 区别？**
A：`LIKE` 复制完整结构（含主键、索引、约束）但**不复制数据**；`AS SELECT` 复制**列和数据**，但**不复制主键、自增、索引、外键**等约束。要纯结构用 `LIKE`，要带数据用 `AS SELECT`（之后再手动补约束）。

**Q8：图形化工具操作和写 SQL 是两回事吗？**
A：不是。GUI 的所有「点选」最终都被翻译成 SQL 发给数据库执行，很多工具还能让你「查看生成的 SQL」。所以学好 SQL 是根本，GUI 只是效率工具。
