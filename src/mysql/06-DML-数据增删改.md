# DML：数据的添加、删除、修改

## 本章导读

前面几章我们学会了如何用 **DDL**（数据定义语言，`CREATE / ALTER / DROP`）把"表"这个"容器"创建好——相当于在 Excel 里画好了表头和列。但**画好的表里还是空的**，要让它真正有用，必须往里面**装数据**、**改数据**、**删数据**。

这就是本章的主角：**DML（Data Manipulation Language，数据操作语言）**。它只干三件事：

| 操作 | 关键字 | 大白话 | 对应 CRUD |
|------|--------|--------|-----------|
| 增（添加） | `INSERT` | 往表里塞一行（或多行）新数据 | Create |
| 删（删除） | `DELETE` | 把符合条件的行从表里抹掉 | Delete |
| 改（修改） | `UPDATE` | 把已有的行里的某些值改掉 | Update |

> 💡 **提示**：CRUD 里的 **R（Read，查询）** 用的是 `SELECT`，它属于 **DQL（数据查询语言）**，是下一章的重点。本章专注于"写"——增、删、改。

**为什么这章特别重要？**
1. **它是日常开发中使用频率最高的一类语句**：你写的每一个"注册用户""下订单""改密码""删评论"，背后都是 `INSERT / UPDATE / DELETE`。
2. **它最容易"翻车"**：`DELETE` 和 `UPDATE` 一旦**忘了写 `WHERE`**，会瞬间把整张表的数据"团灭"，这是新手乃至老手都犯过的"删库"事故。本章会反复、重点地警示这个坑。

**与前后章的关系**：上承 DDL（表已建好），下启 DQL（查询）。学完本章，你就能把数据"灌"进表里，为下一章的各种查询练习准备好"弹药"。

---

## 0. 准备工作：建库建表（沿用全套教程的公共示例）

本章所有例子都基于数据库 `db_learn` 的两张核心表：部门表 `dept` 与员工表 `emp`（一对多关系：一个部门有多名员工）。如果你前面章节已经建过，可以跳过；为保证每章可独立运行，这里再贴一遍完整的建库建表脚本。

```sql
-- 1. 创建并切换数据库
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
  ('孙七','男',15000,'2018-11-05', 3, 3000);
```

执行后，`emp` 表的初始数据如下（**本章后续所有"执行结果"都以这份初始数据为基准**，除非特别说明）：

| id | ename | gender | salary | join_date  | dept_id | bonus |
|----|-------|--------|--------|------------|---------|-------|
| 1  | 张三  | 男     | 8000   | 2020-01-10 | 1       | 1000  |
| 2  | 李四  | 男     | 12000  | 2019-03-15 | 1       | NULL  |
| 3  | 王五  | 女     | 9500   | 2021-06-01 | 2       | 2000  |
| 4  | 赵六  | 女     | 6000   | 2022-09-20 | 2       | NULL  |
| 5  | 孙七  | 男     | 15000  | 2018-11-05 | 3       | 3000  |

> 💡 **提示**：练习增删改时，建议你**单独开一个练习库或练习表**，或者随时准备好上面这段脚本，改坏了就 `DROP TABLE` 重建。本章很多例子会真的改动数据，为了不互相干扰，我会在关键例子前提醒你"先恢复初始数据"。

---

## 1. 添加数据：INSERT

### 1.1 是什么 / 为什么

`INSERT` 就是**往表里"插入"一行或多行新记录**。表是二维的（行 × 列），插入的本质是：**给每一列指定一个值，凑成完整的一行，追加到表的末尾**。

类比：表就像一个 Excel 工作表，`INSERT` 就是在最下面**新增一行**并填好每个单元格。

### 1.2 语法格式（标准写法：指定列名）

```sql
INSERT INTO 表名 (列1, 列2, 列3, ...) VALUES (值1, 值2, 值3, ...);
```

**逐项解释**：

| 部分 | 含义 |
|------|------|
| `INSERT INTO 表名` | 指明要往哪张表里插数据 |
| `(列1, 列2, ...)` | 你打算给**哪些列**赋值（列清单，可只写一部分列） |
| `VALUES` | 关键字，后面跟具体的值 |
| `(值1, 值2, ...)` | 与前面的列清单**一一对应**的值 |

**核心规则：列与值"一一对应"**。
- 列清单写了 3 个列，`VALUES` 后面就必须给 3 个值；
- 顺序、个数、类型都要对得上：第 1 个值给第 1 列，第 2 个值给第 2 列……

### 1.3 示例：插入一行（指定列名）

```sql
-- 给研发部(dept_id=1)新增一名员工"周八"
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus)
VALUES ('周八', '男', 7000, '2023-02-01', 1, 500);
```

**执行结果**：提示 `Query OK, 1 row affected`（1 行受影响）。此时表里多了一行：

| id | ename | gender | salary | join_date  | dept_id | bonus |
|----|-------|--------|--------|------------|---------|-------|
| ... | ... | ... | ... | ... | ... | ... |
| 6  | 周八  | 男     | 7000   | 2023-02-01 | 1       | 500   |

> 注意：`id` 我们**没写**，它是自增主键，自动取了 6（接着之前最大的 5）。下文 1.6 节会专门讲自增列。

### 1.4 一次插入多行（推荐！效率高）

不用写多条 `INSERT`，在一条语句里用逗号分隔多组 `VALUES` 即可：

```sql
INSERT INTO 表名 (列1, 列2, ...) VALUES
  (值1a, 值2a, ...),
  (值1b, 值2b, ...),
  (值1c, 值2c, ...);
```

**示例**：一次给市场部、财务部各补几个人。

```sql
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
  ('吴九', '女', 8800, '2023-03-10', 2, NULL),
  ('郑十', '男', 6500, '2023-04-05', 3, 800),
  ('钱多多', '女', 20000, '2023-05-20', 1, 5000);
```

**执行结果**：`Query OK, 3 rows affected`（3 行受影响）。一条语句插入了 3 行。

> 💡 **提示**：一次插入多行不仅写起来短，**性能也明显更好**。因为数据库只需"解析一次语句、做一次事务提交"，而分成 3 条 `INSERT` 要解析 3 次、提交 3 次。批量导入数据时，请务必用"一条多行"的写法。

> ⚠️ **注意**：一条多行 `INSERT` 是一个**整体（原子操作）**——只要其中一行违反约束（比如某行的 `dept_id` 在 `dept` 表里不存在，违反外键），**整条语句失败，一行都插不进去**，不会"插一半"。

### 1.5 省略列名的写法（不推荐，但要看得懂）

如果你**不写列清单**，那就表示"我要给所有列、按表定义的顺序全部赋值"：

```sql
-- 不写列名，必须按 emp 表定义顺序给"全部列"的值：
-- id, ename, gender, salary, join_date, dept_id, bonus
INSERT INTO emp VALUES
  (NULL, '冯十一', '男', 9000, '2023-06-01', 2, 1200);
```

**逐项解释**：
- 因为没写列清单，`VALUES` 里必须**给齐全部 7 个列**，**一个都不能少、顺序一个都不能错**。
- 第一个 `id` 列是自增主键，我们不想自己指定，就填 `NULL`（让它自动生成）。

**执行结果**：`Query OK, 1 row affected`，新增一行，`id` 自动取下一个值。

> 🕳️ **常见坑：省略列名很脆弱**。
> - 它要求你给"全部列"，少一个值就报错：`Column count doesn't match value count`（列数和值数不匹配）。
> - 一旦将来用 `ALTER TABLE` 给表**加了一列**，所有"省略列名"的旧 `INSERT` 语句都会因为列数对不上而**全部报错**，维护起来非常痛苦。
>
> ✅ **强烈建议**：**永远显式写出列名**（即 1.2 的标准写法）。这样可读性好、对加列不敏感、还能只插部分列。本教程后续也都用标准写法。

### 1.6 自增列（AUTO_INCREMENT）怎么填

`emp.id` 定义为 `INT PRIMARY KEY AUTO_INCREMENT`，即"自动递增的主键"。它的值由数据库自动维护（每插一行加 1），我们通常**不需要、也不应该手动指定**。给自增列赋值有三种等价的"交给数据库自己来"的写法：

| 写法 | 示例 | 含义 |
|------|------|------|
| **省略该列**（推荐） | `INSERT INTO emp (ename, gender, ...) VALUES (...)`（列清单里不含 id） | 不提它，数据库自动生成 |
| 写 `NULL` | `INSERT INTO emp VALUES (NULL, '某某', ...)` | 显式让它自动生成 |
| 写 `DEFAULT` | `INSERT INTO emp VALUES (DEFAULT, '某某', ...)` | 同上，用默认行为（即自增） |

**示例对比**（三种写法效果相同，都让 id 自动生成）：

```sql
-- 写法1：省略 id 列（最推荐）
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus)
VALUES ('自增测试A', '男', 5000, '2024-01-01', 1, NULL);

-- 写法2：id 位置写 NULL（省略列名，必须给全列）
INSERT INTO emp VALUES (NULL, '自增测试B', '女', 5000, '2024-01-02', 1, NULL);

-- 写法3：id 位置写 DEFAULT（省略列名，必须给全列）
INSERT INTO emp VALUES (DEFAULT, '自增测试C', '男', 5000, '2024-01-03', 1, NULL);
```

**执行结果**：三行依次插入，`id` 自动取连续递增的值（例如 11、12、13）。

> 🕳️ **常见坑：自增值"用过不退"**。如果你插入了 id=20 的行后又把它删掉，下一次自增**仍从 21 继续**，不会回填 19/20 留下的空洞。这是正常现象（保证主键不重复），不要试图"补洞"。

---

## 2. 插入数据的注意事项（值的写法）

这一节专门讲"`VALUES` 里的值到底该怎么写"，是新手最容易出语法错误的地方。

### 2.1 字符串、日期：必须用**单引号** `' '`

```sql
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus)
VALUES ('陈十二', '女', 7700, '2023-07-15', 2, 600);
--       ↑字符串    ↑字符       数值不加引号  ↑日期当字符串(带引号)
```

- 字符/字符串类型（`CHAR`、`VARCHAR`）：`'张三'`、`'男'`，**两边加单引号**。
- 日期/时间类型（`DATE`、`DATETIME`）：在 SQL 里**以"带单引号的字符串"形式书写**，常用格式 `'YYYY-MM-DD'`（如 `'2023-07-15'`），数据库会自动把它转成日期。

> 🕳️ **常见坑**：
> - 用**双引号**有时也能跑（MySQL 默认允许），但**标准 SQL 用单引号**，请统一用单引号，避免在开启 `ANSI_QUOTES` 模式时把双引号当成"列名标识符"而报错。
> - 字符串忘了加引号会报错 `Unknown column 'xxx' in 'field list'`——因为 MySQL 把没加引号的 `张三` 当成了"列名"去找。

### 2.2 数值类型：**不要**加引号

```sql
-- ✅ 正确：salary 是 DOUBLE，直接写数字
INSERT INTO emp (ename, gender, salary, dept_id) VALUES ('黄十三', '男', 8000, 1);

-- ⚠️ 不规范：给数字加了引号（'8000'）
INSERT INTO emp (ename, gender, salary, dept_id) VALUES ('黄十三', '男', '8000', 1);
```

第二种写法 MySQL 通常会"宽容地"把字符串 `'8000'` 隐式转成数字 8000，**能插进去但不规范**。养成好习惯：**数值就是裸数字，不加引号**。

### 2.3 NULL 值：直接写 `NULL`（不加引号）

`bonus`（奖金）列允许为空。表示"没有奖金/未知"时，写关键字 `NULL`：

```sql
INSERT INTO emp (ename, gender, salary, dept_id, bonus)
VALUES ('刘十四', '女', 7000, 2, NULL);   -- bonus 为 NULL
```

> 🕳️ **常见坑：`NULL` 和 `'NULL'` 完全不同！**
> - `NULL`（不加引号）= 真正的"空值/没有值"。
> - `'NULL'`（加了引号）= 一个**长度为 4 的字符串**，内容就是 N、U、L、L 四个字母。
>
> 千万别给该为空的列写成 `'NULL'`，那是个实实在在的字符串，不是空。

### 2.4 列与值的"顺序"必须严格对应

`INSERT` 是**按位置**配对的：列清单的第 N 个列，配 `VALUES` 的第 N 个值。

```sql
-- ✅ 正确：值的顺序与列清单一致
INSERT INTO emp (ename, gender, salary) VALUES ('正确哥', '男', 9000);

-- 🕳️ 逻辑错误（但语法不报错！）：把 gender 和 salary 的值写反了
INSERT INTO emp (ename, gender, salary) VALUES ('坑货', 9000, '男');
```

第二条：你打算让 `gender='男'`、`salary=9000`，结果因为值写反，变成往 `gender` 里塞 `9000`、往 `salary` 里塞 `'男'`。这种**"语法没错、数据全乱"**的 bug 最难查。

> 💡 **提示**：列清单的顺序**不必和表定义顺序一致**，你可以自由调整，只要"列清单的顺序"和"值的顺序"互相对应即可。例如下面这样把 `salary` 写在前面也完全合法：
> ```sql
> INSERT INTO emp (salary, ename, gender) VALUES (9000, '随意哥', '男');
> ```

### 2.5 没赋值的列会怎样？

如果列清单里**没有**某个列（且该列允许为空或有默认值），那一行里该列会被填上：
- 它的 **`DEFAULT` 默认值**（如果建表时定义了 `DEFAULT`）；
- 否则填 **`NULL`**（如果该列允许 NULL）；
- 如果该列**既无默认值、又是 `NOT NULL`**，则**报错**（必须显式给值）。

```sql
-- 只给了 ename、dept_id，其余列（gender/salary/join_date/bonus）会变成 NULL
INSERT INTO emp (ename, dept_id) VALUES ('简约哥', 1);
```

**执行后该行**：

| id | ename  | gender | salary | join_date | dept_id | bonus |
|----|--------|--------|--------|-----------|---------|-------|
| ... | 简约哥 | NULL   | NULL   | NULL      | 1       | NULL  |

---

## 3. 修改数据：UPDATE

> 在讲删除之前先讲修改，因为它和删除一样**强依赖 `WHERE`**，理解了 `WHERE` 的重要性，再看删除就更警觉。

### 3.1 是什么 / 为什么

`UPDATE` 用于**修改表中已存在的行的某些列的值**。它不会增加或减少行数，只是把"现有行里的某些格子"改成新值。

类比：在 Excel 里**双击某个单元格，把里面的内容改掉**。

### 3.2 语法格式

```sql
UPDATE 表名 SET 列1 = 值1, 列2 = 值2, ... WHERE 条件;
```

**逐项解释**：

| 部分 | 含义 | 是否必须 |
|------|------|----------|
| `UPDATE 表名` | 要改哪张表 | 必须 |
| `SET 列1=值1, 列2=值2` | 把哪些列改成什么值（多列用逗号隔开） | 必须 |
| `WHERE 条件` | **只改满足条件的行** | **语法上可省略，但实战中几乎必须写！** |

### 3.3 示例：改一行

> 操作前请确保是初始数据。给"张三"（id=1）涨薪到 8500，并补发奖金 1500。

```sql
UPDATE emp SET salary = 8500, bonus = 1500 WHERE id = 1;
```

**执行结果**：`Query OK, 1 row affected`（1 行受影响）。张三这一行变为：

| id | ename | gender | salary  | join_date  | dept_id | bonus |
|----|-------|--------|---------|------------|---------|-------|
| 1  | 张三  | 男     | **8500** | 2020-01-10 | 1       | **1500** |

### 3.4 示例：按条件改多行

`WHERE` 命中几行，就改几行。给**研发部（dept_id=1）的所有人**统一上调 10% 工资：

```sql
UPDATE emp SET salary = salary * 1.1 WHERE dept_id = 1;
```

**逐项解释**：`SET salary = salary * 1.1` 表示"新工资 = 原工资 × 1.1"，等号右边可以引用列自己当前的值。

**执行结果**（基于初始数据，研发部有张三 8000、李四 12000 两人）：`2 rows affected`。

| id | ename | gender | salary（原→新） | dept_id |
|----|-------|--------|-----------------|---------|
| 1  | 张三  | 男     | 8000 → **8800** | 1 |
| 2  | 李四  | 男     | 12000 → **13200** | 1 |

### 3.5 ⚠️ 最危险的一点：UPDATE 不写 WHERE = 全表都改！

**`WHERE` 是"筛选哪些行"的条件。如果不写 `WHERE`，UPDATE 会作用于表里的每一行。**

```sql
-- 💀 灾难示例：忘写 WHERE，全公司每个人的工资都被改成 1 块钱！
UPDATE emp SET salary = 1;
```

**执行结果**：`N rows affected`（N = 全表行数），**所有员工的 salary 全变成 1**。这种事故在生产环境足以让人"卷铺盖走人"。

#### 如何避免"忘写 WHERE"的灾难

1. **开启"安全更新模式"`sql_safe_updates`**（强烈推荐给 MySQL 命令行/客户端）。开启后，**没有 `WHERE`（或 `WHERE` 没用到主键/索引键）的 UPDATE/DELETE 会被直接拒绝执行**：
   ```sql
   SET SQL_SAFE_UPDATES = 1;     -- 1=开启，0=关闭
   ```
   开启后再执行 `UPDATE emp SET salary = 1;` 会报错：
   `Error Code: 1175. You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column ...`
   （你处于安全更新模式，却尝试在没有用到键列的 WHERE 的情况下更新表。）
   > 💡 在 MySQL Workbench 里这个选项默认就是开着的，这也是为什么很多人发现"在 Workbench 里没法不写 WHERE"。

2. **先 `SELECT` 后 `UPDATE`**：改之前，先用同样的 `WHERE` 跑一遍 `SELECT`，确认"命中的就是你想改的那些行"，再把 `SELECT ... FROM` 换成 `UPDATE ... SET`。
   ```sql
   -- 第一步：先查，确认范围对不对
   SELECT * FROM emp WHERE dept_id = 1;
   -- 第二步：确认无误后再改
   UPDATE emp SET salary = salary * 1.1 WHERE dept_id = 1;
   ```

3. **包在事务里**：手动开事务，改完先看结果，不对就 `ROLLBACK` 回滚（详见第 5 节）。

> 🕳️ **常见坑：`WHERE` 条件命中 0 行**。如果 `WHERE id = 9999` 而表里没有这个 id，语句**不会报错**，只是 `0 rows affected`（0 行受影响）——什么都没改。看到"0 行受影响"要警觉：是不是条件写错了？

> 🕳️ **常见坑：判断 NULL 不能用 `=`**。想把"没有奖金的人"的 bonus 设为 0，**不能**写 `WHERE bonus = NULL`（它永远不成立，命中 0 行），必须用 `IS NULL`：
> ```sql
> UPDATE emp SET bonus = 0 WHERE bonus IS NULL;   -- ✅ 正确
> -- UPDATE emp SET bonus = 0 WHERE bonus = NULL;  -- ❌ 命中 0 行，无效果
> ```

---

## 4. 删除数据：DELETE

### 4.1 是什么 / 为什么

`DELETE` 用于**删除表中满足条件的行（整行删除）**。注意它删的是"行"，不是"某个列的值"——想清空某个格子用的是 `UPDATE ... SET 列 = NULL`，而不是 `DELETE`。

类比：在 Excel 里**选中若干行 → 右键删除行**。

### 4.2 语法格式

```sql
DELETE FROM 表名 WHERE 条件;
```

**逐项解释**：

| 部分 | 含义 | 是否必须 |
|------|------|----------|
| `DELETE FROM 表名` | 从哪张表删 | 必须 |
| `WHERE 条件` | **只删满足条件的行** | **语法可省略，但省略=删全表，极危险！** |

> 注意是 `DELETE FROM 表名`，**不写列名**——因为删除是"删整行"，谈不上删某一列。

### 4.3 示例：删一行 / 删多行

> 操作前请确保是初始数据。

```sql
-- 删一行：删除 id=4 的"赵六"
DELETE FROM emp WHERE id = 4;
```
**执行结果**：`1 row affected`，赵六这一行从表中消失。

```sql
-- 删多行：删除所有工资低于 8000 的员工
DELETE FROM emp WHERE salary < 8000;
```
**执行结果**：`WHERE` 命中几行就删几行（基于初始数据，命中赵六 6000 一人，`1 row affected`）。

### 4.4 ⚠️ 最危险的一点：DELETE 不写 WHERE = 删光全表！

```sql
-- 💀 灾难示例：删除 emp 表里的所有行！
DELETE FROM emp;
```

**执行结果**：`N rows affected`（N = 全表行数），**整张表被清空**（但表结构还在，是个空表）。这就是新闻里常说的"删库跑路"级别的事故。

**避免方法和 UPDATE 完全一样**：开启 `SQL_SAFE_UPDATES`、先 `SELECT` 确认范围、用事务包裹。这里不再重复。

> 🕳️ **常见坑：外键约束导致删不掉**。`dept` 是"父表"，`emp` 通过外键 `fk_emp_dept` 引用它。如果你想删除研发部：
> ```sql
> DELETE FROM dept WHERE id = 1;
> ```
> 会报错：`Cannot delete or update a parent row: a foreign key constraint fails ...`
> 原因：研发部下还挂着张三、李四（`emp.dept_id = 1`），数据库不允许你删掉"还被别人引用着"的父记录，否则那些员工就成了"无主孤儿"。
> **正确顺序**：先删（或改派）子表 `emp` 里属于该部门的员工，再删父表 `dept` 的部门。

---

## 5. DELETE 与 TRUNCATE TABLE 的区别（重点）

想"把一张表的数据全部清空"，有两条路：`DELETE FROM 表名;` 和 `TRUNCATE TABLE 表名;`。它们结果看起来一样（表都空了），但**底层机制、性能、副作用完全不同**，这也是高频面试题。

> 注：`TRUNCATE` 严格说属于 **DDL**（它的本质是"删表重建"），但因为它常被拿来和 `DELETE` 对比清空数据，所以放在本章一起讲。

### 5.1 TRUNCATE 的用法

```sql
TRUNCATE TABLE emp;
-- TABLE 关键字可省略，写成 TRUNCATE emp; 也行
```

**执行结果**：`emp` 表瞬间被清空。

### 5.2 核心区别对比表

| 对比项 | `DELETE FROM emp;` | `TRUNCATE TABLE emp;` |
|--------|--------------------|------------------------|
| 所属语言 | DML（数据操作） | DDL（数据定义） |
| 删除方式 | **逐行删除**，每删一行记一条日志 | **直接"删掉整张表再重建一个同结构的空表"** |
| 速度（大表） | 慢（行越多越慢） | 极快（几乎与行数无关） |
| 能否带 `WHERE` 条件删部分 | **能**（`DELETE ... WHERE ...`） | **不能**，只能全清空 |
| 事务与回滚 | 在事务中可 `ROLLBACK` **撤销**（数据能找回） | **不可回滚**，删了就真没了 |
| 触发器 `DELETE` 触发器 | 会触发 | **不触发** |
| 自增列 `AUTO_INCREMENT` | **不重置**，继续接着原来的最大值 | **重置归 1**，下次插入 id 从 1 重新开始 |
| 返回的受影响行数 | 真实删除的行数 | 通常返回 0（它不是逐行删） |

### 5.3 用例子直观感受"自增是否重置"

这是两者最常被考、也最直观的差异。

**实验 A：用 DELETE 清空，自增不重置**

```sql
-- 假设 emp 此刻最大 id 是 5
DELETE FROM emp;                         -- 全删，表空了
INSERT INTO emp (ename, dept_id) VALUES ('新人', 1);
SELECT id FROM emp;                      -- 看看新人的 id
```
**执行结果**：新人的 `id = 6`。虽然表被清空，但自增计数器"记得"曾经到过 5，继续从 6 发号。

**实验 B：用 TRUNCATE 清空，自增归 1**

```sql
-- 同样假设清空前最大 id 是 5
TRUNCATE TABLE emp;                      -- 删表重建，计数器归零
INSERT INTO emp (ename, dept_id) VALUES ('新人', 1);
SELECT id FROM emp;                      -- 看看新人的 id
```
**执行结果**：新人的 `id = 1`。因为 `TRUNCATE` 把表"重建"了，自增计数器回到初始值。

### 5.4 用例子感受"能否回滚"

```sql
START TRANSACTION;        -- 开启事务
DELETE FROM emp;          -- 把数据删光
SELECT COUNT(*) FROM emp; -- 结果：0（看起来没了）
ROLLBACK;                 -- 后悔了，回滚！
SELECT COUNT(*) FROM emp; -- 结果：恢复成 5，数据全回来了！
```
`DELETE` 在事务里可以靠 `ROLLBACK` 救回来。而 `TRUNCATE` 即使写在事务里，也**无法靠 `ROLLBACK` 找回数据**（它会隐式提交，删了就是删了）。

### 5.5 该用哪个？

| 场景 | 推荐 |
|------|------|
| 只删一部分行（带条件） | 只能用 `DELETE`（`TRUNCATE` 不支持条件） |
| 需要事务保护、可能要反悔 | 用 `DELETE` |
| 表上有需要触发的 `DELETE` 触发器 | 用 `DELETE` |
| 想彻底清空大表、追求速度、且不需要反悔、希望自增归零 | 用 `TRUNCATE` |

> 🕳️ **常见坑**：`TRUNCATE` 同样**受外键约束限制**。如果有别的表用外键引用了 `emp`，`TRUNCATE TABLE emp` 会被拒绝。另外 `TRUNCATE` 没有"软删除/找回"机制，**生产环境慎用**，操作前务必确认表名没写错、确实要全清。

> 💡 **顺带一提 `DROP TABLE emp;`**：那是把**整张表（结构 + 数据）一起删掉**，删完表都不存在了，连"空表"都没有。区别记忆：`DELETE`/`TRUNCATE` = 倒空柜子里的东西（柜子还在）；`DROP` = 连柜子一起扔掉。

---

## 6. 综合实战：在 emp 表上完整走一遍增删改

下面把本章知识串成一条完整的"业务剧情"，请按顺序执行体会。**开始前先恢复初始数据**（用第 0 节脚本 `DROP` 后重建 `emp`，或确保它是初始的 5 行）。

```sql
USE db_learn;

-- ========== 增 INSERT ==========
-- 剧情1：研发部新招 2 名员工（一条语句插多行，显式列名）
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
  ('阿强', '男', 9000, '2024-01-15', 1, 1000),
  ('阿珍', '女', 9200, '2024-02-20', 1, NULL);   -- 阿珍暂无奖金

-- 剧情2：新成立"运维部"并招 1 人（先建部门，再招人，注意外键依赖）
INSERT INTO dept (dept_name, loc) VALUES ('运维部', '深圳');         -- 假设生成 id=4
INSERT INTO emp (ename, gender, salary, join_date, dept_id) VALUES
  ('阿亮', '男', 8500, '2024-03-01', 4);                            -- 入职运维部，bonus 省略→NULL
```
**结果**：`emp` 新增 3 行（阿强、阿珍、阿亮），`dept` 新增 1 行（运维部）。

```sql
-- ========== 改 UPDATE ==========
-- 剧情3：给市场部(dept_id=2)全员涨薪 5%
UPDATE emp SET salary = salary * 1.05 WHERE dept_id = 2;

-- 剧情4：把所有"无奖金(NULL)"的人统一补发 500（注意用 IS NULL，不能用 = NULL）
UPDATE emp SET bonus = 500 WHERE bonus IS NULL;

-- 剧情5：阿强表现优秀，单独涨薪到 12000 并发奖金 3000（多列同改 + 按主键精确定位）
UPDATE emp SET salary = 12000, bonus = 3000 WHERE ename = '阿强';
```
**结果**：市场部每人工资 ×1.05；原本 bonus 为 NULL 的人（李四、赵六、阿珍、阿亮……）bonus 变 500；阿强工资 12000、奖金 3000。

```sql
-- ========== 删 DELETE ==========
-- 剧情6：阿亮离职，删除其记录（按主键/唯一条件，安全）
DELETE FROM emp WHERE ename = '阿亮';

-- 剧情7：清退所有工资低于 7000 的员工（按条件删多行）
DELETE FROM emp WHERE salary < 7000;

-- 剧情8（演示外键保护）：试图解散没人了的"运维部"
DELETE FROM dept WHERE dept_name = '运维部';
--   若该部门已无员工引用，删除成功；
--   若还有员工的 dept_id 指向它，会报外键错误，需先处理员工再删部门。
```
**结果**：阿亮被删；工资 < 7000 的员工被清退；只要运维部下已无员工，部门删除成功。

```sql
-- ========== 验证：把改完的数据查出来看看 ==========
SELECT id, ename, gender, salary, dept_id, bonus FROM emp ORDER BY id;
```

> 💡 **提示**：上面剧情里我故意全程使用了"显式列名 INSERT""每条 UPDATE/DELETE 都带 WHERE""NULL 用 IS NULL 判断"这些**好习惯**。请把它们当成肌肉记忆固定下来。

---

## 7. 一点延伸：DML 与事务（理解"为什么 DELETE 能反悔"）

本章已经多次提到事务，这里做个最小化的说明，方便你理解"安全网"是怎么来的（事务的完整内容会在后续章节深入）。

- **DML 语句默认是"自动提交"的**：你执行完 `INSERT/UPDATE/DELETE`，改动会**立即永久生效**（`autocommit=ON`）。所以平时手滑删错了，往往来不及反悔。
- 如果**手动开启事务**，改动会先"暂存"，直到你 `COMMIT`（确认提交）才永久生效，或 `ROLLBACK`（回滚）撤销：

```sql
START TRANSACTION;              -- 开启事务（手动接管提交）
UPDATE emp SET salary = 1;      -- 危险操作，但还没真正生效
SELECT salary FROM emp;         -- 一看全成 1 了，坏了！
ROLLBACK;                       -- 撤销！数据恢复到事务开始前
-- 如果确认无误，则用 COMMIT; 来永久提交
```

> 💡 **提示**：执行有风险的批量 `UPDATE/DELETE` 前，先 `START TRANSACTION;`，改完用 `SELECT` 核对，没问题再 `COMMIT`，有问题就 `ROLLBACK`——这是工程上保命的标准动作。

---

## 本章小结

- **DML 三剑客**：`INSERT`（增）、`UPDATE`（改）、`DELETE`（删）；查询用的 `SELECT` 属于 DQL，是下一章内容。
- **INSERT**
  - 标准写法 `INSERT INTO 表(列...) VALUES(值...)`，**列与值一一对应**，强烈建议**显式写列名**。
  - 省略列名则必须**按表顺序给全部列的值**，脆弱，不推荐。
  - 一条语句可插多行：`VALUES (..),(..),(..)`，**效率更高**，且是"全成功或全失败"的原子操作。
  - 自增列可**省略 / 写 `NULL` / 写 `DEFAULT`** 让其自动生成。
- **值的写法**：字符串和日期加**单引号**；数值**不加**引号；空值写 `NULL`（≠ 字符串 `'NULL'`）；列与值顺序要严格对应。
- **UPDATE**：`UPDATE 表 SET 列=值,... WHERE 条件`；等号右边可引用列自身（如 `salary = salary*1.1`）。
- **DELETE**：`DELETE FROM 表 WHERE 条件`；删的是整行；受外键约束保护（删父表前要先处理子表）。
- **❗最重要的安全红线**：`UPDATE` / `DELETE` **不写 `WHERE` 会作用于全表**！避免方法：开启 `SQL_SAFE_UPDATES`、改删前先用相同 `WHERE` 跑 `SELECT` 确认、用事务 `START TRANSACTION ... ROLLBACK/COMMIT` 兜底。
- **判 NULL 用 `IS NULL` / `IS NOT NULL`**，绝不能用 `= NULL`。
- **DELETE vs TRUNCATE**：DELETE 逐行删、可带条件、可事务回滚、自增不重置；TRUNCATE 删表重建、不能带条件、不可回滚、速度快、自增归 1、不触发触发器。

## 常见面试 / 易错问答

**Q1：`DELETE FROM emp;` 和 `TRUNCATE TABLE emp;` 有什么区别？**
A：DELETE 是 DML、逐行删除、可加 WHERE 删部分、可在事务中回滚、不重置自增；TRUNCATE 是 DDL、删表重建、只能全清、不可回滚、速度快、自增归 1、不触发删除触发器。需要按条件删或可能反悔时用 DELETE，要快速彻底清空大表用 TRUNCATE。

**Q2：`DELETE`、`TRUNCATE`、`DROP` 三者的区别？**
A：DELETE 删行（数据，表在）；TRUNCATE 清空所有行（删表重建，表在但自增归 1）；DROP 删整张表（结构和数据都没了，表都不存在了）。

**Q3：执行了 `UPDATE emp SET salary=1;`（忘了 WHERE）该怎么补救？**
A：若开了事务且未提交，立刻 `ROLLBACK`；若已自动提交，则只能靠备份/binlog 恢复。预防胜于补救：开启 `SQL_SAFE_UPDATES`、先 SELECT 确认、用事务包裹。

**Q4：自增主键删了几行后，再插入会复用被删的 id 吗？**
A：不会。DELETE 不重置自增计数器，会继续从历史最大值 +1 发号，留下空洞是正常的；只有 TRUNCATE（或重置 `AUTO_INCREMENT`）才会让它从 1 重新开始。

**Q5：为什么 `WHERE bonus = NULL` 查不到/改不到任何行？**
A：NULL 表示"未知"，任何与 NULL 的 `=`、`<>` 比较结果都是"未知（既非真也非假）"，WHERE 只保留结果为真的行，所以命中 0 行。判断空值必须用 `IS NULL` / `IS NOT NULL`。

**Q6：一条 `INSERT ... VALUES (..),(..),(..)` 里有一行违反约束，会怎样？**
A：默认整条语句失败、全部回滚，一行都插不进去（原子性）。它不会"插成功的留下、失败的丢弃"。

**Q7：插入时自增列怎么写最好？**
A：最推荐在列清单里直接**省略**该列；也可写 `NULL` 或 `DEFAULT` 让数据库自动生成。不要手动指定具体值，以免和将来的自增冲突。
