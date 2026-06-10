# DCL：用户管理与权限管理

> **本章导读**
>
> 前面我们一直用「万能的 root」账号操作数据库。但在真实项目里，让所有程序、所有人都用 root 是极其危险的——一旦泄露，整个数据库任人宰割。正确做法是：**给不同的应用/人员创建专门的账号，并只授予它们「干活所必需」的最小权限**（这叫最小权限原则）。
>
> 管理「用户」和「权限」用的就是 SQL 四大类里的最后一类——**DCL（Data Control Language，数据控制语言）**。本章讲透：
> 1. 用户存在哪、怎么**增删查**用户；
> 2. 怎么**修改密码**（含忘记 root 密码的应急思路）；
> 3. 怎么**授权 / 查看权限 / 撤销权限**。
>
> 本章是 SQL 语言体系（DDL/DML/DQL/DCL）的收官，沿用 `db_learn` 库做授权演示。

---

## 一、MySQL 用户存在哪里

MySQL 自身用一个名为 `mysql` 的**系统数据库**来管理用户和权限，用户信息存在它的 `user` 表里。

```sql
-- 切换到系统库
USE mysql;

-- 查询所有用户（host 主机 + user 用户名 共同标识一个账号）
SELECT host, user FROM user;
```

可能的结果：

| host | user |
|------|------|
| % | root |
| localhost | root |
| localhost | mysql.sys |

> 💡 **关键认知**：MySQL 的一个「用户」其实是 **`用户名@主机名` 的组合**。`'root'@'localhost'` 和 `'root'@'%'` 是**两个不同的账号**！
> - `localhost`：只能从**本机**登录；
> - `%`：通配符，表示可以从**任意主机（任意 IP）**登录；
> - 具体 IP（如 `192.168.1.100`）：只能从该 IP 登录。

---

## 二、管理用户：增、删、查

### 2.1 创建用户 CREATE USER

```sql
-- 语法：CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';

-- 创建一个只能在本机登录的用户 zhangsan
CREATE USER 'zhangsan'@'localhost' IDENTIFIED BY '123456';

-- 创建一个可以从任意主机登录的用户 lisi
CREATE USER 'lisi'@'%' IDENTIFIED BY '123456';

-- 创建一个只能从指定 IP 登录的用户
CREATE USER 'wangwu'@'192.168.1.100' IDENTIFIED BY '123456';
```

新创建的用户**默认没有任何权限**，能登录但几乎什么都干不了（连库都看不到），必须再授权（见第四节）。

### 2.2 删除用户 DROP USER

```sql
-- 语法：DROP USER '用户名'@'主机名';
DROP USER 'wangwu'@'192.168.1.100';
```

> ⚠️ 注意主机名要写对：删 `'zhangsan'@'localhost'` 不会影响 `'zhangsan'@'%'`，它们是两个账号。

### 2.3 查询用户

```sql
USE mysql;
SELECT host, user FROM user;          -- 查所有用户

-- 查某个用户的详细信息（含认证插件等）
SELECT host, user, plugin FROM user WHERE user = 'zhangsan';
```

---

## 三、修改密码

MySQL 不同版本改密码的语法差异较大，重点记 8.0 的写法。

### 3.1 MySQL 8.0：用 ALTER USER（推荐）

```sql
-- 语法：ALTER USER '用户名'@'主机名' IDENTIFIED BY '新密码';
ALTER USER 'zhangsan'@'localhost' IDENTIFIED BY 'newpwd123';

-- 修改当前登录用户自己的密码
ALTER USER USER() IDENTIFIED BY 'mypwd';
```

### 3.2 用 SET PASSWORD

```sql
-- 改指定用户
SET PASSWORD FOR 'zhangsan'@'localhost' = 'newpwd456';
-- 改自己（旧版本写法，8.0 也支持）
SET PASSWORD = 'mypwd';
```

### 3.3 在命令行用 mysqladmin（修改 root 等，需知道旧密码）

```bash
# 操作系统命令行执行（不是 mysql 内部）
mysqladmin -u root -p password "新密码"
# 回车后输入旧密码
```

### 3.4 忘记 root 密码的应急思路

> 🕳️ 这是运维高频场景，了解流程即可：
1. 停止 MySQL 服务（`net stop mysql`）；
2. 用**跳过权限校验**的方式启动：`mysqld --skip-grant-tables`（此时无需密码即可登录）；
3. 登录后修改 root 密码（8.0 下可能需先 `FLUSH PRIVILEGES;` 再 `ALTER USER`）；
4. 正常重启服务，用新密码登录。

> ⚠️ `--skip-grant-tables` 期间数据库对任何人门户大开，务必在内网/断开外部访问下操作，改完立刻关闭该模式。

---

## 四、权限管理：授权、查看、撤销

### 4.1 常见权限种类

| 权限 | 作用 |
|------|------|
| `SELECT` | 查询数据 |
| `INSERT` | 插入数据 |
| `UPDATE` | 修改数据 |
| `DELETE` | 删除数据 |
| `CREATE` | 创建库/表 |
| `DROP` | 删除库/表 |
| `ALTER` | 修改表结构 |
| `ALL` 或 `ALL PRIVILEGES` | 上述所有权限 |

### 4.2 授予权限 GRANT

```sql
-- 语法：GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';

-- ① 授予 zhangsan 对 db_learn 库 emp 表的查询和插入权限
GRANT SELECT, INSERT ON db_learn.emp TO 'zhangsan'@'localhost';

-- ② 授予对 db_learn 库下所有表的全部权限（* 代表库内所有表）
GRANT ALL ON db_learn.* TO 'zhangsan'@'localhost';

-- ③ 授予对所有库所有表的全部权限（*.* —— 相当于超级管理员，慎用）
GRANT ALL ON *.* TO 'lisi'@'%';
```

`ON` 后面的「`库.表`」是权限范围：
- `db_learn.emp`：只对这一张表；
- `db_learn.*`：对这个库的所有表；
- `*.*`：对所有库所有表。

### 4.3 查看权限 SHOW GRANTS

```sql
-- 语法：SHOW GRANTS FOR '用户名'@'主机名';
SHOW GRANTS FOR 'zhangsan'@'localhost';
```

会列出该用户当前拥有的所有 `GRANT` 语句，一目了然。

### 4.4 撤销权限 REVOKE

```sql
-- 语法：REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名';

-- 撤销 zhangsan 对 emp 表的插入权限（保留查询）
REVOKE INSERT ON db_learn.emp FROM 'zhangsan'@'localhost';

-- 撤销所有权限
REVOKE ALL ON db_learn.* FROM 'zhangsan'@'localhost';
```

### 4.5 刷新权限 FLUSH PRIVILEGES

某些直接修改 `mysql` 系统表的操作后，需要让权限立即生效：

```sql
FLUSH PRIVILEGES;
```

> 💡 用标准的 `GRANT` / `REVOKE` / `CREATE USER` 语句时，MySQL 会自动刷新，**通常不需要手动 `FLUSH`**；只有直接 `UPDATE mysql.user` 改表时才必须手动刷新。

---

## 五、注意事项与常见坑

- 🕳️ **新建用户连不上库**：新用户默认零权限，登录后 `SHOW DATABASES` 几乎看不到东西——这不是 bug，是没授权，记得 `GRANT`。
- 🕳️ **主机名不匹配登录失败**：用 `'zhangsan'@'localhost'` 这个账号，从别的机器（非本机）连会被拒。要远程连，得创建 `'zhangsan'@'%'` 或对应 IP 的账号。
- ⚠️ **最小权限原则**：应用程序账号只给它真正需要的权限（一般 `SELECT/INSERT/UPDATE/DELETE` 即可），**不要随手给 `ALL ON *.*`**，更不要让应用直接用 root。
- ⚠️ **`%` 不包含本机的某些情况**：历史上 `%` 在某些版本不覆盖 `localhost` 的 socket 登录，远程连不上时可同时建 `@'%'` 与 `@'localhost'` 排查。
- ⚠️ **8.0 认证插件变化**：MySQL 8.0 默认认证插件是 `caching_sha2_password`，老客户端/驱动可能连不上，必要时创建用户时指定 `IDENTIFIED WITH mysql_native_password BY '密码'`。

---

## 六、本章小结

- **DCL** 负责「用户」和「权限」，是 SQL 四大类（DDL/DML/DQL/DCL）的收尾。
- **用户 = 用户名@主机名**：`localhost`（本机）/`%`（任意主机）/具体 IP 是不同账号。
- **用户增删查**：
  - 建：`CREATE USER '名'@'主机' IDENTIFIED BY '密码';`
  - 删：`DROP USER '名'@'主机';`
  - 查：`USE mysql; SELECT host,user FROM user;`
- **改密码**：8.0 用 `ALTER USER '名'@'主机' IDENTIFIED BY '新密码';`；命令行用 `mysqladmin`；忘记 root 用 `--skip-grant-tables` 应急。
- **权限三件套**：
  - 授权 `GRANT 权限 ON 库.表 TO '名'@'主机';`
  - 查看 `SHOW GRANTS FOR '名'@'主机';`
  - 撤销 `REVOKE 权限 ON 库.表 FROM '名'@'主机';`
- **安全准则**：最小权限原则，应用账号不用 root、不给 `ALL ON *.*`。
