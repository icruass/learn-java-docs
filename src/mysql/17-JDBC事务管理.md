# JDBC 事务管理

> **本章导读**
>
> 第 14 章我们在 MySQL 命令行里用 `START TRANSACTION` / `COMMIT` / `ROLLBACK` 控制事务；第 16 章我们学会了用 Java（JDBC）发送 SQL。本章把两者结合：**在 Java 代码里控制事务**，让「转账」这种多步操作在程序中也能做到「要么全成功、要么全回滚」。
>
> 本章讲透：
> 1. JDBC 默认的事务行为（每条 SQL 自动提交）为什么不够用；
> 2. 用 `Connection` 的三个方法（`setAutoCommit` / `commit` / `rollback`）控制事务；
> 3. `try-catch-finally` 中管理事务的**标准写法**；
> 4. 用转账案例，对比「不开事务会丢钱」和「开事务能回滚」。
>
> 本章是第 14 章（事务理论）和第 16 章（JDBC）的合体，沿用 `db_learn` 的账户表。

---

## 〇、准备示例表

```sql
CREATE TABLE account (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  name  VARCHAR(20),
  money DOUBLE
);
INSERT INTO account (name, money) VALUES ('张三', 1000), ('李四', 1000);
```

---

## 一、JDBC 默认的事务行为

第 14 章讲过 MySQL 默认「自动提交」。在 JDBC 里同样如此：**每执行一条 SQL（`executeUpdate`），就立即自动提交一次**，无法回滚。

这意味着，下面这段转账代码**藏着大坑**：

```java
// ❌ 没有事务管理的转账（危险！）
conn = JDBCUtils.getConnection();
String sql1 = "UPDATE account SET money = money - 500 WHERE name = '张三'";
String sql2 = "UPDATE account SET money = money + 500 WHERE name = '李四'";

PreparedStatement ps1 = conn.prepareStatement(sql1);
ps1.executeUpdate();      // ← 张三的钱立刻被扣并提交！

int i = 1 / 0;            // ← 假设这里发生异常（模拟程序出错）

PreparedStatement ps2 = conn.prepareStatement(sql2);
ps2.executeUpdate();      // ← 这行根本执行不到
```

结果：第一条已经**自动提交**，张三少了 500；第二条因异常没执行，李四没收到。**500 元凭空消失**——正是第 14 章说的「执行一半」的灾难。

---

## 二、用 Connection 控制事务

JDBC 通过 `Connection` 对象的三个方法管理事务，和 SQL 命令一一对应：

| JDBC 方法 | 对应 SQL | 含义 |
|-----------|----------|------|
| `conn.setAutoCommit(false)` | `START TRANSACTION` | 关闭自动提交 = 开启事务 |
| `conn.commit()` | `COMMIT` | 提交事务，所有改动永久生效 |
| `conn.rollback()` | `ROLLBACK` | 回滚事务，撤销本次所有改动 |

核心思路：**在执行多条 SQL 之前关闭自动提交，全部成功后 `commit`，中途出错则 `rollback`。**

---

## 三、标准写法：try-catch-finally

事务管理的标准骨架如下：

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TransferDemo {
    public void transfer() {
        Connection conn = null;
        PreparedStatement ps1 = null;
        PreparedStatement ps2 = null;
        try {
            conn = JDBCUtils.getConnection();

            // ★ 开启事务：关闭自动提交
            conn.setAutoCommit(false);

            // 第一条：张三扣钱
            ps1 = conn.prepareStatement(
                    "UPDATE account SET money = money - ? WHERE name = ?");
            ps1.setDouble(1, 500);
            ps1.setString(2, "张三");
            ps1.executeUpdate();

            // 故意制造异常，验证回滚（真实代码里这里是其它业务）
            // int x = 1 / 0;

            // 第二条：李四加钱
            ps2 = conn.prepareStatement(
                    "UPDATE account SET money = money + ? WHERE name = ?");
            ps2.setDouble(1, 500);
            ps2.setString(2, "李四");
            ps2.executeUpdate();

            // ★ 两条都成功 → 提交事务
            conn.commit();
            System.out.println("转账成功");

        } catch (Exception e) {
            // ★ 出现任何异常 → 回滚事务
            if (conn != null) {
                try {
                    conn.rollback();
                    System.out.println("出现异常，事务已回滚");
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            e.printStackTrace();
        } finally {
            // 释放资源
            JDBCUtils.close(ps1, conn);   // 简化：实际可分别关 ps1、ps2
            if (ps2 != null) try { ps2.close(); } catch (SQLException e) {}
        }
    }
}
```

关键点解析：

1. **`setAutoCommit(false)` 必须在执行 SQL 之前**调用，相当于 `START TRANSACTION`。
2. **`commit()` 放在 try 的最后**，只有所有 SQL 都顺利执行才会到这一步。
3. **`rollback()` 放在 catch 里**，任何一条 SQL 抛异常都会跳到 catch 执行回滚。
4. **`rollback()` 本身也可能抛 `SQLException`**，所以要再套一层 try-catch。
5. **资源在 finally 释放**，确保连接一定被归还。

> 💡 把上面注释掉的 `int x = 1 / 0;` 放开，再跑一次：你会看到「事务已回滚」，且查询数据库 **张三、李四仍各 1000**——钱没丢。这就是事务的保护作用。

---

## 四、对比验证：开不开事务的区别

| 场景 | 第一条 UPDATE 后异常 | 最终结果 |
|------|----------------------|----------|
| **不开事务**（自动提交） | 张三扣钱已自动提交 | 张三 500、李四 1000，**丢了 500** ❌ |
| **开启事务** | 异常触发 `rollback()` | 张三 1000、李四 1000，**完好如初** ✅ |

这张表把「为什么需要 JDBC 事务」讲得明明白白。

---

## 五、注意事项与常见坑

- 🕳️ **必须是同一个 Connection**：事务是绑定在 `Connection` 上的。如果第一条 SQL 用 conn1、第二条用 conn2，它们是**两个独立事务**，回滚 conn1 根本影响不到 conn2。务必让一组事务内的所有 SQL 共用同一个 `Connection`。
- 🕳️ **忘记 commit**：开启事务（`setAutoCommit(false)`）后，如果忘了 `commit()`，连接关闭时改动会被丢弃（相当于回滚），数据「没保存上」。
- ⚠️ **rollback 要判空**：`catch` 里 `conn` 可能因为 `getConnection` 就失败而为 `null`，调用 `conn.rollback()` 前要判 `conn != null`。
- ⚠️ **连接池场景下恢复状态**：用连接池时，`conn.close()` 是把连接**归还池**而非真关闭。如果你 `setAutoCommit(false)` 后没恢复，下个借到这个连接的人会莫名处于手动提交状态。规范做法是归还前 `conn.setAutoCommit(true)` 恢复默认（很多连接池/框架会自动处理）。
- 💡 **手动管理事务很啰嗦**：上面一大段 try-catch-finally 就为转两笔钱。这正是后续 Spring 的 `@Transactional` 声明式事务、以及 JDBCTemplate 要解决的问题——把这些样板代码替你包办。

---

## 六、本章小结

- **JDBC 默认每条 SQL 自动提交**，多步操作无法保证原子性（转账会丢钱）。
- **三个方法控制事务**（绑定在 `Connection` 上）：
  - `conn.setAutoCommit(false)` 开启事务；
  - `conn.commit()` 提交；
  - `conn.rollback()` 回滚。
- **标准写法**：try 中开启事务并执行多条 SQL、末尾 `commit`；catch 中 `rollback`（注意判空和二次异常）；finally 释放资源。
- **核心前提**：同一组事务的所有 SQL **必须共用同一个 Connection**。
- **演进方向**：手动事务太繁琐，后续用 Spring 声明式事务（`@Transactional`）大幅简化。

### 常见易错问答

1. **问：`setAutoCommit(false)` 之后，每条 SQL 还会自动提交吗？**
   答：不会。从此刻起所有 SQL 都进入同一个事务，必须显式 `commit()` 才生效，否则可 `rollback()` 撤销。
2. **问：为什么我回滚了数据还是变了？**
   答：八成是「不是同一个 Connection」，或者第一条 SQL 在 `setAutoCommit(false)` 之前就执行（已自动提交）。
3. **问：commit/rollback 之后还能继续用这个 Connection 吗？**
   答：能。一次 `commit`/`rollback` 结束当前事务，之后该连接可开启新事务或继续执行（取决于 autoCommit 设置）。
