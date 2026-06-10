# DDL：操作数据库（创建、查询、修改、删除、使用）

## 本章导读

前面几篇我们已经认识了 MySQL 是什么、装好了环境、也学会了用命令行/客户端连上数据库。但连上之后，我们面对的是一个“空房子”——里面还没有属于我们自己的**数据库（Database）**。

本章就来学习一类专门“盖房子、改房子、拆房子”的语句：**DDL（Data Definition Language，数据定义语言）**。

> 类比一下：如果把 MySQL 服务器想象成一栋**大楼**，那么：
> - **数据库（database）** 就是大楼里的一个个**房间**；
> - **表（table）** 是房间里的一个个**柜子**；
> - **数据（row）** 是柜子里放的一份份**文件**。
>
> 本章只关心“房间”这一层：怎么创建房间、怎么查看有哪些房间、怎么改房间的属性、怎么拆掉房间、以及“我现在人在哪个房间里”。

学完本章你将能够：

| 操作 | 关键字 | 一句话说明 |
| --- | --- | --- |
| 创建（Create） | `CREATE DATABASE` | 新建一个数据库 |
| 查询（Retrieve） | `SHOW DATABASES` / `SHOW CREATE DATABASE` | 查看有哪些库、查看某个库的定义 |
| 修改（Update） | `ALTER DATABASE` | 修改库的属性（一般只改字符集） |
| 删除（Delete） | `DROP DATABASE` | 删除一个数据库（危险！不可恢复） |
| 使用（Use） | `USE` / `SELECT DATABASE()` | 切换到某个库 / 查看当前所在库 |

> 💡 **提示：这五个动作的英文首字母可以记成 CRUD 的“库版本”**。CRUD（增删改查）是数据库操作的万能口诀，后面学“操作表（DDL）”“操作数据（DML/DQL）”时，你会发现都是同样的套路，只是对象从“库”变成了“表”“行”。
>
> **与前后章的关系**：本章是“操作数据库”，下一章会进入“操作表（建表/改表/删表）”，再往后是“操作数据（增删改查行记录）”。本章最后会**亲手创建贯穿全套教程的 `db_learn` 库**，为后续所有章节打地基。

---

## 1. 预备知识：DDL 是什么？SQL 语句的基本约定

在动手敲命令之前，先把几个贯穿全篇的“规矩”说清楚，后面就不重复了。

### 1.1 什么是 DDL

SQL 语句按用途分成几大类，本章涉及的是 DDL：

| 类别 | 全称 | 作用 | 典型语句 |
| --- | --- | --- | --- |
| **DDL** | Data Definition Language（数据定义语言） | 定义/管理**结构**：库、表、列 | `CREATE`、`ALTER`、`DROP`、`SHOW`、`USE` |
| DML | Data Manipulation Language（数据操作语言） | 操作表里的**数据** | `INSERT`、`UPDATE`、`DELETE` |
| DQL | Data Query Language（数据查询语言） | **查询**数据 | `SELECT` |
| DCL | Data Control Language（数据控制语言） | 管理**权限** | `GRANT`、`REVOKE` |

本章只讲 DDL 中“操作数据库”这一小块。可以这样理解：**DDL 管的是“骨架/结构”，而不是“里面装的数据”**。

### 1.2 几条必须记住的书写约定

1. **每条 SQL 语句以分号 `;` 结尾。** 在命令行里，不打分号回车，MySQL 会认为你的语句还没写完，继续等你输入。
2. **SQL 关键字不区分大小写**，但本教程统一**关键字大写**（如 `CREATE`、`DATABASE`），库名/表名小写，这样可读性最好。
3. **库名、表名**在 Windows 下默认不区分大小写，在 Linux 下默认区分大小写。**强烈建议库名一律用小写、用下划线分词**（如 `db_learn`），避免跨平台踩坑。
4. 可以用 `-- 这是注释`（双横线后面要有一个空格）或 `# 这是注释` 写单行注释，用 `/* ... */` 写多行注释。

```sql
-- 这是单行注释
CREATE DATABASE db_test;   -- 行尾注释也可以
/* 这是
   多行注释 */
```

> 💡 **提示**：在命令行里如果一条语句敲错了还没敲分号，可以输入 `\c` 然后回车来取消当前这条语句，重新开始。

---

## 2. 创建数据库：CREATE DATABASE

### 2.1 最基础的写法

**语法格式：**

```sql
CREATE DATABASE 数据库名;
```

**逐项解释：**

- `CREATE DATABASE`：固定关键字，表示“创建一个数据库”。
- `数据库名`：你给这个库起的名字。命名规则：由字母、数字、下划线组成，不要用 MySQL 关键字，建议全小写。

**示例：**

```sql
CREATE DATABASE db_test;
```

**执行结果：**

```
Query OK, 1 row affected (0.01 sec)
```

> 这里的 `1 row affected` 是 MySQL 的统一反馈格式（它把“成功建了 1 个库”也说成“影响了 1 行”），看到 `Query OK` 就代表成功了。

此时如果你**再执行一次完全相同的语句**：

```sql
CREATE DATABASE db_test;
```

**执行结果（报错）：**

```
ERROR 1007 (HY000): Can't create database 'db_test'; database exists
```

错误号 `1007` 的意思是：**这个库已经存在了，不能重复创建**。这就引出了下面更安全的写法。

### 2.2 防止报错：CREATE DATABASE IF NOT EXISTS

**语法格式：**

```sql
CREATE DATABASE IF NOT EXISTS 数据库名;
```

**逐项解释：**

- `IF NOT EXISTS`：直译就是“如果（这个库）不存在（才创建）”。
  - 如果库**不存在** → 正常创建。
  - 如果库**已存在** → **什么都不做，也不报错**（只给一个警告）。

**示例：**

```sql
CREATE DATABASE IF NOT EXISTS db_test;
```

**执行结果（库已存在的情况）：**

```
Query OK, 1 row affected, 1 warning (0.00 sec)
```

注意这次结果里多了 `1 warning`（1 个警告）。它并没有真正创建，只是提示“库已经在了”。你可以用 `SHOW WARNINGS;` 查看这个警告的内容：

```sql
SHOW WARNINGS;
```

**执行结果：**

```
+-------+------+----------------------------------------------+
| Level | Code | Message                                      |
+-------+------+----------------------------------------------+
| Note  | 1007 | Can't create database 'db_test'; database exists |
+-------+------+----------------------------------------------+
```

> 💡 **提示：为什么强烈推荐写 `IF NOT EXISTS`？**
> 因为我们经常把建库语句写进**脚本（.sql 文件）**里反复执行（比如部署、初始化）。如果不加 `IF NOT EXISTS`，第二次执行脚本就会因为“库已存在”而中途报错退出。加上它，脚本就可以**幂等**地反复运行而不出错。这是工程实践中的标配。

### 2.3 创建时指定字符集：CHARACTER SET

#### 2.3.1 先搞懂：什么是字符集（charset）和校对规则（collation）

这是很多新手忽略、但**极其重要**的一个点。

- **字符集（Character Set）**：规定“一个字符在数据库里用什么样的二进制编码来存储”。简单说就是“**怎么把中文、emoji 这些字符存成 0 和 1**”。
- **校对规则（Collation）**：规定“同一个字符集下，字符**怎么比较大小、怎么排序、是否区分大小写**”。

> 类比：字符集像是“用哪种文字写字（中文/英文/日文）”，校对规则像是“按什么顺序给这些字排序（笔画/拼音/字母）、写‘A’和‘a’算不算一个字”。

MySQL 里最常见、也是**当今最推荐**的字符集是 **`utf8mb4`**。

> 🕳️ **常见坑：`utf8` ≠ 真正的 UTF-8！**
> MySQL 里历史遗留的 `utf8`（也叫 `utf8mb3`）每个字符**最多只占 3 个字节**，存不下需要 4 字节的字符——比如各种 **emoji 😀、部分生僻汉字**。一旦插入这些字符就会报错或乱码。
> 真正完整支持 4 字节的，是 **`utf8mb4`**（mb4 = most bytes 4，最多 4 字节）。
> **结论：新建库一律用 `utf8mb4`，不要再用 `utf8`。** MySQL 8.0 起默认字符集已经是 `utf8mb4`，但显式写出来更稳妥、可读性也更好。

#### 2.3.2 语法与示例

**语法格式：**

```sql
CREATE DATABASE 数据库名 CHARACTER SET 字符集名;
-- 也可以同时指定校对规则：
CREATE DATABASE 数据库名 CHARACTER SET 字符集名 COLLATE 校对规则名;
```

**逐项解释：**

- `CHARACTER SET 字符集名`：指定这个库的默认字符集。库里新建的表如果不单独指定，就会继承库的字符集。
- `COLLATE 校对规则名`（可选）：指定校对规则。常用 `utf8mb4_general_ci` 或 `utf8mb4_unicode_ci`，结尾的 `_ci` 表示 case insensitive（**不区分大小写**）。

**示例（创建一个用 utf8mb4 的库）：**

```sql
CREATE DATABASE IF NOT EXISTS db_charset_demo CHARACTER SET utf8mb4;
```

**执行结果：**

```
Query OK, 1 row affected (0.01 sec)
```

**示例（同时指定校对规则）：**

```sql
CREATE DATABASE IF NOT EXISTS db_charset_demo2
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
```

> 💡 **提示**：`CHARACTER SET` 可以缩写成 `CHARSET`，下面两句等价：
> ```sql
> CREATE DATABASE d1 CHARACTER SET utf8mb4;
> CREATE DATABASE d2 CHARSET utf8mb4;
> ```

#### 2.3.3 怎么查可用的字符集和校对规则？

```sql
-- 查看 MySQL 支持的所有字符集
SHOW CHARACTER SET;

-- 查看某个字符集下有哪些校对规则
SHOW COLLATION WHERE Charset = 'utf8mb4';
```

`SHOW CHARACTER SET;` 的部分结果示意：

| Charset | Description | Default collation | Maxlen |
| --- | --- | --- | --- |
| latin1 | cp1252 West European | latin1_swedish_ci | 1 |
| utf8mb3 | UTF-8 Unicode | utf8mb3_general_ci | 3 |
| utf8mb4 | UTF-8 Unicode | utf8mb4_0900_ai_ci | 4 |
| gbk | GBK Simplified Chinese | gbk_chinese_ci | 2 |

> 注意最后一列 `Maxlen`：`utf8mb4` 的最大字节数是 4，这正是它能存 emoji 的原因。

---

## 3. 查询数据库：SHOW DATABASES / SHOW CREATE DATABASE

建完库，我们得有办法“看见”它。查询数据库有两个层次：**看全局有哪些库** 和 **看某个库长什么样**。

### 3.1 查看所有数据库：SHOW DATABASES

**语法格式：**

```sql
SHOW DATABASES;
```

**示例与执行结果：**

```sql
SHOW DATABASES;
```

```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| db_charset_demo    |
| db_test            |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
6 rows in set (0.00 sec)
```

你会看到除了我们刚建的 `db_test`、`db_charset_demo`，还有几个**不是我们建的库**：

| 系统库 | 作用（了解即可，不要去改它们） |
| --- | --- |
| `information_schema` | 一个“虚拟库”，保存了所有库表的**元数据**（有哪些库、哪些表、哪些列等）。 |
| `mysql` | MySQL 自己的核心库，存放**用户、权限**等系统信息。 |
| `performance_schema` | 性能监控相关数据。 |
| `sys` | 基于上面两个库做的一层更易读的视图，方便排查性能问题。 |

> ⚠️ **注意**：上面这四个是 MySQL 自带的**系统数据库**，是 MySQL 正常运行所必需的，**千万不要删除或随意修改**，否则可能导致整个数据库服务异常。

如果你只想找名字里带某个关键字的库，可以加 `LIKE` 过滤：

```sql
SHOW DATABASES LIKE 'db_%';
```

**执行结果：**

```
+-----------------+
| Database (db_%) |
+-----------------+
| db_charset_demo |
| db_test         |
+-----------------+
2 rows in set (0.00 sec)
```

> 💡 `LIKE` 里的 `%` 是通配符，匹配任意多个字符。`'db_%'` 表示“以 db 开头的库名”。（`LIKE` 的完整用法会在 DQL 查询章节细讲，这里先会用即可。）

### 3.2 查看某个库的定义：SHOW CREATE DATABASE

`SHOW DATABASES` 只告诉你“有这个库”，但**它用的什么字符集**呢？用 `SHOW CREATE DATABASE` 可以看到这个库**完整的创建语句**。

**语法格式：**

```sql
SHOW CREATE DATABASE 数据库名;
```

**示例与执行结果：**

```sql
SHOW CREATE DATABASE db_charset_demo;
```

```
+-----------------+--------------------------------------------------------------------------------------------------------------------------------+
| Database        | Create Database                                                                                                                |
+-----------------+--------------------------------------------------------------------------------------------------------------------------------+
| db_charset_demo | CREATE DATABASE `db_charset_demo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */ |
+-----------------+--------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

**怎么读这条结果？**

- 反引号 `` `db_charset_demo` `` 把库名括起来，是 MySQL 的标准写法，可以避免库名和关键字冲突。
- `DEFAULT CHARACTER SET utf8mb4`：这个库的默认字符集是 utf8mb4 —— **正是我们想确认的信息**。
- `COLLATE utf8mb4_0900_ai_ci`：默认校对规则（MySQL 8.0 的默认值）。
- `/*!40100 ... */`：这是 MySQL 特有的**版本化注释**。`40100` 表示“MySQL 4.1.0 及以上版本才执行注释里的内容”，是为了向下兼容旧版本而设计的，**正常理解成普通 SQL 即可**。

> 💡 **提示**：`SHOW CREATE DATABASE` 是排查“为什么我存中文/emoji 乱码”的第一步——先看看库到底是不是 `utf8mb4`。

---

## 4. 修改数据库：ALTER DATABASE

### 4.1 能改什么、不能改什么

对于数据库这个层级，**实际中几乎只会去改一件事：默认字符集 / 校对规则**。

- ✅ 可以改：库的**默认字符集和校对规则**。
- ❌ 不建议（也没有直接语法）改：**库名**。

> 🕳️ **常见坑：MySQL 没有“重命名数据库”的命令！**
> 你不会找到 `RENAME DATABASE` 这样的语句（历史上短暂出现过又被移除了，因为很危险）。如果真的要“改库名”，标准做法是：
> 1. 新建一个目标名的库；
> 2. 把所有表迁移过去（如用 `mysqldump` 导出再导入，或逐表 `RENAME TABLE 旧库.表 TO 新库.表`）；
> 3. 删除旧库。
>
> 所以请在**建库时就把名字想好**，避免后期折腾。

### 4.2 修改字符集的语法与示例

**语法格式：**

```sql
ALTER DATABASE 数据库名 CHARACTER SET 字符集名;
-- 可同时改校对规则：
ALTER DATABASE 数据库名 CHARACTER SET 字符集名 COLLATE 校对规则名;
```

**示例（假设有个老库 `db_test` 当初建成了 latin1，现在改成 utf8mb4）：**

```sql
ALTER DATABASE db_test CHARACTER SET utf8mb4;
```

**执行结果：**

```
Query OK, 1 row affected (0.01 sec)
```

改完之后再查一下，验证是否生效：

```sql
SHOW CREATE DATABASE db_test;
```

**执行结果：**

```
+---------+---------------------------------------------------------------------------------------------------+
| Database | Create Database                                                                                  |
+---------+---------------------------------------------------------------------------------------------------+
| db_test | CREATE DATABASE `db_test` /*!40100 DEFAULT CHARACTER SET utf8mb4 ... */ ...                        |
+---------+---------------------------------------------------------------------------------------------------+
```

可以看到字符集已经变成 `utf8mb4`。

> ⚠️ **注意：`ALTER DATABASE` 只改“库的默认字符集”，不会自动改“已存在的表和列”！**
> 库的字符集只对**之后新建的、且没单独指定字符集的表**起“默认值”作用。**已经存在的表/列仍然保持它们原来的字符集**。如果要把老表也一起转过来，需要对表执行 `ALTER TABLE ... CONVERT TO CHARACTER SET utf8mb4;`（这属于“操作表”的内容，下一章会讲）。
> 换句话说：**改库字符集 ≈ 改“以后新建表的默认模板”，而不是“一键把存量数据全转码”**。

---

## 5. 删除数据库：DROP DATABASE

### 5.1 语法与示例

**语法格式：**

```sql
DROP DATABASE 数据库名;
```

**示例：**

```sql
DROP DATABASE db_charset_demo2;
```

**执行结果：**

```
Query OK, 0 rows affected (0.02 sec)
```

> `0 rows affected` 在这里是正常的，不代表失败——它指的是“受影响的数据行数”，删库这个操作本身成功了。

### 5.2 防止报错：DROP DATABASE IF EXISTS

如果删一个**不存在**的库：

```sql
DROP DATABASE db_not_exist;
```

**执行结果（报错）：**

```
ERROR 1008 (HY000): Can't drop database 'db_not_exist'; database doesn't exist
```

和建库对称，删库也有“安全版”写法：

**语法格式：**

```sql
DROP DATABASE IF EXISTS 数据库名;
```

- `IF EXISTS`：如果库存在才删；不存在就什么都不做、不报错（只给个警告）。

**示例：**

```sql
DROP DATABASE IF EXISTS db_not_exist;
```

**执行结果：**

```
Query OK, 0 rows affected, 1 warning (0.00 sec)
```

> 同样，这在写脚本时非常有用：保证脚本反复执行都不会因为“库不存在”而中断。常见的“重建脚本”开头就是这两句搭配：
> ```sql
> DROP DATABASE IF EXISTS db_learn;
> CREATE DATABASE db_learn CHARACTER SET utf8mb4;
> ```

### 5.3 ⚠️ 重大警告：DROP 不可恢复！

> ⚠️⚠️⚠️ **`DROP DATABASE` 会把这个库以及库里的所有表、所有数据全部物理删除，且没有“回收站”、没有“撤销”、不可恢复！**
>
> - 它**不会**给你弹二次确认框，回车即生效。
> - 一旦执行，唯一的找回方式是从**备份**里恢复（如果你有备份的话）。
>
> 🕳️ **常见坑 / 血泪经验：**
> 1. **删库前务必看清当前连的是哪台服务器**——别在生产环境上敲了本来该在测试环境敲的命令。
> 2. **删之前先想清楚名字有没有打错**——比如想删 `db_test_tmp` 结果手滑写成 `db_test`。
> 3. 重要数据在删库前先 `mysqldump` 备份一份。
> 4. 生产环境给账号收紧权限，普通业务账号根本不应该有 `DROP` 权限。
>
> 一句话：**`DROP DATABASE` 是本章最危险的命令，敲之前请深呼吸。**

> 💡 **辨析**：你可能听过 `DROP`、`TRUNCATE`、`DELETE` 三兄弟，这里先打个预防针（细节在后续章节）：
> | 命令 | 作用对象 | 删什么 | 能否恢复 |
> | --- | --- | --- | --- |
> | `DROP DATABASE` | 整个库 | 库 + 所有表 + 所有数据 + 结构 | 否（要靠备份） |
> | `DROP TABLE` | 一张表 | 表 + 数据 + 结构 | 否 |
> | `TRUNCATE TABLE` | 一张表 | 只清空数据，保留表结构 | 否 |
> | `DELETE FROM 表` | 表里的行 | 删数据（可带条件） | 在事务中可回滚 |

---

## 6. 使用 / 切换数据库：USE 与 SELECT DATABASE()

我们已经会建库、查库了。但你有没有发现一个问题：到目前为止我们的操作都是“站在大楼大厅里”对某个房间隔空喊话（每次都写全名）。真正干活（建表、增删数据）时，需要**先走进某个房间**——这就是 `USE`。

### 6.1 切换数据库：USE

**语法格式：**

```sql
USE 数据库名;
```

**示例与执行结果：**

```sql
USE db_test;
```

```
Database changed
```

看到 `Database changed`，就表示你**当前的工作上下文**已经切到 `db_test` 了。之后你写 `SHOW TABLES;`、`SELECT ... FROM emp;` 这种不带库名的语句，MySQL 都默认在 `db_test` 这个库里找。

> 💡 **提示：不切库也能操作表，用“库名.表名”全限定**
> 即使没有 `USE`，你也可以用 `库名.表名` 的形式直接操作任意库的表，例如：
> ```sql
> SELECT * FROM db_test.emp;
> ```
> 当你需要**跨库**操作，或者懒得切来切去时，这种全限定写法很方便。但日常在固定一个库里干活时，先 `USE` 一下更省事。

> ⚠️ **注意**：如果 `USE` 一个不存在的库：
> ```sql
> USE db_xxx;
> ```
> ```
> ERROR 1049 (42000): Unknown database 'db_xxx'
> ```
> 报错 `1049` 表示“未知的数据库”，说明这个库压根不存在（或者名字打错了）。

### 6.2 查看当前正在使用哪个库：SELECT DATABASE()

切来切去之后，怎么知道“我现在到底在哪个房间”？用内置函数 `DATABASE()`：

**语法格式：**

```sql
SELECT DATABASE();
```

**示例与执行结果（已经 USE db_test 之后）：**

```sql
SELECT DATABASE();
```

```
+------------+
| DATABASE() |
+------------+
| db_test    |
+------------+
1 row in set (0.00 sec)
```

如果你**还没 USE 过任何库**就执行这条语句：

```
+------------+
| DATABASE() |
+------------+
| NULL       |
+------------+
1 row in set (0.00 sec)
```

结果是 `NULL`，表示“当前没有选定任何数据库”。这时若直接写不带库名的 `SHOW TABLES;` 会报错 `ERROR 1046 (3D000): No database selected`（没有选中数据库）。

> 💡 **提示**：在命令行里其实还有更直观的提醒——很多客户端（如 MySQL 8 自带 client，配合 `prompt` 设置）可以把当前库名显示在提示符上。比如执行：
> ```sql
> prompt \d> 
> ```
> 之后提示符会变成 `db_test>`，一眼就能看到当前库。

---

## 7. 完整演示：创建并使用贯穿全套教程的 db_learn 库

现在把本章学到的东西串起来，**亲手把后续所有章节都要用的 `db_learn` 库准备好**。请跟着敲一遍，建立肌肉记忆。

### 7.1 一步步来

**第 1 步：先看看现在有哪些库（确认 db_learn 还不存在）**

```sql
SHOW DATABASES;
```

**第 2 步：安全地创建 db_learn，并指定 utf8mb4 字符集**

```sql
CREATE DATABASE IF NOT EXISTS db_learn CHARACTER SET utf8mb4;
```

执行结果：

```
Query OK, 1 row affected (0.01 sec)
```

**第 3 步：验证创建结果与字符集**

```sql
SHOW CREATE DATABASE db_learn;
```

执行结果：

```
+----------+-----------------------------------------------------------------------------------------------------------+
| Database | Create Database                                                                                          |
+----------+-----------------------------------------------------------------------------------------------------------+
| db_learn | CREATE DATABASE `db_learn` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ ...        |
+----------+-----------------------------------------------------------------------------------------------------------+
```

确认是 `utf8mb4`，放心。

**第 4 步：切换进 db_learn 库**

```sql
USE db_learn;
```

执行结果：

```
Database changed
```

**第 5 步：确认“我现在在 db_learn 里”**

```sql
SELECT DATABASE();
```

执行结果：

```
+----------+
| DATABASE() |
+----------+
| db_learn |
+----------+
```

到这里，房间已经盖好、人也走进去了。下一章我们就在这个 `db_learn` 里创建贯穿全套教程的两张核心表 `dept`（部门）和 `emp`（员工）。

### 7.2 可复用的初始化脚本（推荐写法）

把上面的关键步骤整理成一个**幂等脚本**，存成 `init_db_learn.sql`，将来重建环境时直接执行即可：

```sql
-- init_db_learn.sql：初始化教学库 db_learn
-- 1) 如已存在则先删除（谨慎：会清空旧数据！仅在“重建测试环境”时使用）
DROP DATABASE IF EXISTS db_learn;

-- 2) 重新创建，显式指定 utf8mb4，保证中文/emoji 不乱码
CREATE DATABASE db_learn CHARACTER SET utf8mb4;

-- 3) 进入该库，后续建表语句都作用在它身上
USE db_learn;

-- （下一章会在这里继续追加 CREATE TABLE dept / emp ...）
```

在命令行里执行脚本文件的方式：

```bash
# 方式一：登录后用 source 命令执行
mysql -u root -p
mysql> source D:/sql/init_db_learn.sql;

# 方式二：在系统终端里直接重定向执行
mysql -u root -p < D:/sql/init_db_learn.sql
```

> ⚠️ **注意**：脚本第 1 行的 `DROP DATABASE IF EXISTS db_learn;` 会**清空 db_learn 里已有的一切**。在学习/测试阶段这很方便（保证每次都是干净环境），但**绝不要把这种“先删后建”的脚本对着有真实数据的库执行**。

---

## 8. 本章小结

- **DDL** 是“数据定义语言”，负责管理库/表/列这些**结构**；本章聚焦“操作数据库”这一层，套路就是 **增（CREATE）、查（SHOW）、改（ALTER）、删（DROP）、用（USE）**。
- **创建**：
  - `CREATE DATABASE 名;` 最基础。
  - `CREATE DATABASE IF NOT EXISTS 名;` 防止“已存在”报错，**脚本里强烈推荐**。
  - `CREATE DATABASE 名 CHARACTER SET utf8mb4;` 指定字符集；**新库一律用 `utf8mb4`，别用残缺的 `utf8`**。
- **查询**：
  - `SHOW DATABASES;` 看所有库（注意四个系统库别乱动）。
  - `SHOW CREATE DATABASE 名;` 看某库的完整定义和字符集，是排查乱码的第一步。
- **修改**：
  - `ALTER DATABASE 名 CHARACTER SET utf8mb4;` 实际几乎只用来改字符集；**MySQL 不支持直接改库名**，建库前就把名字想好。
  - 改库字符集只影响“以后新建的表”，**不会自动转换已有表/列**。
- **删除**：
  - `DROP DATABASE 名;` / `DROP DATABASE IF EXISTS 名;`。
  - **极度危险、不可恢复**，删前确认环境、确认库名、做好备份。
- **使用**：
  - `USE 名;` 切换当前库；也可以用 `库名.表名` 全限定跨库操作。
  - `SELECT DATABASE();` 查看当前所在库，返回 `NULL` 表示还没选库。
- 我们已经亲手建好了贯穿全套教程的 **`db_learn`** 库，下一章正式建表。

---

## 9. 常见面试 / 易错问答

**Q1：`utf8` 和 `utf8mb4` 有什么区别？该用哪个？**
A：MySQL 的 `utf8`（即 `utf8mb3`）每字符最多 3 字节，存不了 emoji 和部分生僻字；`utf8mb4` 最多 4 字节，完整支持。**一律用 `utf8mb4`**。

**Q2：`CREATE DATABASE IF NOT EXISTS` 加了 `IF NOT EXISTS`，当库已存在时是“覆盖”还是“跳过”？**
A：是**跳过**——什么都不做、不报错、不影响已有数据，只给一个警告。它绝不会覆盖或清空原库。

**Q3：怎么查看一个数据库用的是什么字符集？**
A：`SHOW CREATE DATABASE 库名;`，看返回里的 `DEFAULT CHARACTER SET`。

**Q4：MySQL 怎么给数据库改名？**
A：**没有直接命令**（没有 `RENAME DATABASE`）。标准做法是新建目标库 → 迁移所有表 → 删除旧库。所以建库时就要把名字定好。

**Q5：`ALTER DATABASE db CHARACTER SET utf8mb4;` 之后，库里老表的乱码就解决了吗？**
A：**不一定**。它只改库的默认字符集，对**已存在的表和列不生效**；老表要单独 `ALTER TABLE ... CONVERT TO CHARACTER SET utf8mb4;`。

**Q6：`DROP DATABASE` 删错了能恢复吗？**
A：**不能**靠数据库自身恢复，没有回收站。唯一出路是从**备份**还原。所以删库前务必确认环境、库名，并提前备份。

**Q7：执行了 `SELECT DATABASE();` 返回 `NULL` 是出错了吗？**
A：不是错误，表示当前会话**还没有用 `USE` 选定任何库**。此时不带库名的表操作会报 `No database selected`。

**Q8：`SHOW DATABASES;` 里那些 `information_schema`、`mysql`、`sys` 是什么，能删吗？**
A：是 MySQL 自带的**系统库**，存元数据、权限、性能信息等，是数据库正常运行所必需的，**绝对不能删/改**。
