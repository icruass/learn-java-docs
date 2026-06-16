import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "transaction",
  name: "事务",
  problems: [
    {
      title: "什么是事务？ACID 四大特性",
      difficulty: "简单",
      question:
        "什么是数据库事务？请说出事务的 ACID 四大特性，并分别解释它们的含义。以「张三给李四转账 500 元」为例，说明「原子性」保证了什么。",
      hint: "ACID = 原子性(Atomicity)、一致性(Consistency)、隔离性(Isolation)、持久性(Durability)。",
      answer:
        "事务是一组要么全部成功、要么全部失败的数据库操作（逻辑工作单元），是不可分割的整体。\nACID 四大特性：\n- 原子性（Atomicity）：事务中的操作要么全做，要么全不做，不允许只做一半。\n- 一致性（Consistency）：事务执行前后，数据都处于「合法/正确」的状态（如转账前后两人余额总和不变）。\n- 隔离性（Isolation）：多个事务并发执行时互不干扰，一个事务的中间状态对其他事务不可见。\n- 持久性（Durability）：事务一旦提交，对数据的修改就永久保存到磁盘，即使数据库宕机也不会丢失。\n转账例子：原子性保证「张三扣 500」和「李四加 500」这两步要么都成功、要么都不发生；绝不会出现「张三的钱扣了，但李四没收到」这种钱凭空消失的情况——一旦中途出错就整体回滚。",
      tags: ["事务", "ACID", "原子性"],
    },
    {
      title: "事务控制语句：手动实现转账事务",
      difficulty: "中等",
      question:
        "请用事务控制语句（START TRANSACTION / COMMIT / ROLLBACK）写出「张三给李四转账 500 元」的完整事务。account 表结构为 account(id, name, money)。要求：开启事务，依次扣款、加款，正常则提交、出错则回滚。再简述这三条语句各自的作用。",
      code: `-- 账户表
CREATE TABLE account (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  name  VARCHAR(20),
  money DOUBLE
);
INSERT INTO account (name, money) VALUES ('张三', 1000), ('李四', 1000);`,
      language: "sql",
      hint: "START TRANSACTION 开启；COMMIT 提交并永久生效；ROLLBACK 回滚撤销本次事务的全部改动。",
      answer:
        "三条语句作用：\n- START TRANSACTION（或 BEGIN）：开启一个事务，之后的 DML 操作都暂存、不立即生效。\n- COMMIT：提交事务，把本次事务的所有修改永久写入数据库。\n- ROLLBACK：回滚事务，撤销本次事务开启以来的全部修改，数据恢复到事务开始前的状态。\n转账要点：必须把「张三 -500」和「李四 +500」放进同一个事务，确认两步都没问题再 COMMIT；如果中途发现异常（如余额不足），就 ROLLBACK 让两步一起作废，保证原子性。\n（注意：MySQL 默认 autocommit 开启，每条语句自动提交；START TRANSACTION 会临时关闭自动提交直到 COMMIT/ROLLBACK。）",
      answerCode: `START TRANSACTION;            -- 开启事务

UPDATE account SET money = money - 500 WHERE name = '张三';  -- 张三扣 500
UPDATE account SET money = money + 500 WHERE name = '李四';  -- 李四加 500

-- 若上面都正确执行：
COMMIT;                       -- 提交，两步一起永久生效

-- 若中途出错（示意，二选一）：
-- ROLLBACK;                  -- 回滚，两步一起撤销`,
      tags: ["事务控制", "START TRANSACTION", "COMMIT", "ROLLBACK"],
    },
    {
      title: "四种隔离级别及其设置",
      difficulty: "中等",
      question:
        "SQL 标准定义了哪四种事务隔离级别？请按「隔离强度从低到高」排列，并说明级别越高对安全性和并发性能分别有什么影响。再写出 MySQL 中查看当前隔离级别、以及把当前会话设置为「读已提交」的 SQL。",
      hint: "四种：读未提交、读已提交、可重复读、串行化；越往上越安全但越慢。",
      answer:
        "从低到高四种隔离级别：\n1. 读未提交（READ UNCOMMITTED）：能读到别的事务未提交的数据，最不安全但最快。\n2. 读已提交（READ COMMITTED）：只能读到别的事务已提交的数据。\n3. 可重复读（REPEATABLE READ）：同一事务内多次读同一行结果一致。\n4. 串行化（SERIALIZABLE）：事务排队串行执行，最安全但最慢。\n规律：级别越高，能防住的并发问题越多（越安全），但并发性能越差（吞吐越低），需要在安全与性能之间权衡。",
      language: "sql",
      answerCode: `-- 查看当前隔离级别（MySQL 8；5.x 用 @@tx_isolation）
SELECT @@transaction_isolation;

-- 将当前会话设置为「读已提交」
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 设置全局隔离级别为「可重复读」
SET GLOBAL TRANSACTION ISOLATION LEVEL REPEATABLE READ;`,
      tags: ["隔离级别", "READ COMMITTED", "REPEATABLE READ"],
    },
    {
      title: "MySQL 的默认隔离级别是哪个",
      difficulty: "简单",
      question:
        "MySQL（InnoDB 引擎）默认的事务隔离级别是哪一个？它和 Oracle 的默认级别一样吗？这个默认级别在 MySQL 中能不能避免幻读？",
      hint: "MySQL 默认比大多数数据库高一级，而且靠 MVCC 做了增强。",
      answer:
        "MySQL（InnoDB）的默认隔离级别是「可重复读（REPEATABLE READ）」。\n它和 Oracle 不一样：Oracle 默认是「读已提交（READ COMMITTED）」。\n关于幻读：按 SQL 标准，可重复读理论上仍可能发生幻读；但 MySQL 的 InnoDB 通过 MVCC（多版本并发控制）+ 间隙锁（Next-Key Lock）机制，在很大程度上把幻读也避免了。所以 MySQL 选择「可重复读」作为默认，是兼顾安全与性能的折中。",
      tags: ["默认隔离级别", "可重复读", "MVCC"],
    },
    {
      title: "并发问题与隔离级别的对应关系",
      difficulty: "困难",
      question:
        "并发事务会引发「脏读、不可重复读、幻读」三类问题。请先用一句话区分这三者，然后说明：每一种问题最低需要哪个隔离级别才能解决？为什么「读已提交」能解决脏读却解决不了不可重复读？",
      hint: "脏读=读到未提交；不可重复读=读到已提交的UPDATE（同一行变了）；幻读=读到已提交的INSERT/DELETE（行数变了）。从「读未提交」往上逐级解决。",
      answer:
        "三者区别（一句话）：\n- 脏读：读到了另一个事务「还没提交」的数据（对方可能回滚，读到的是不存在的数据）。\n- 不可重复读：同一事务内两次读「同一行」，结果不同（因为中间别的事务 UPDATE 并提交了）。\n- 幻读：同一事务内两次按「同一条件」查询，行数变了（因为中间别的事务 INSERT/DELETE 并提交了）。\n各问题最低需要的隔离级别（逐级解决）：\n- 脏读：升到「读已提交（READ COMMITTED）」即可解决（只读已提交的数据）。\n- 不可重复读：升到「可重复读（REPEATABLE READ）」才能解决。\n- 幻读：理论上升到「串行化（SERIALIZABLE）」才彻底解决（MySQL 在可重复读下靠 MVCC + 间隙锁也基本避免）。\n为什么读已提交解决脏读但解决不了不可重复读：读已提交规定「只能读别人已提交的数据」，所以杜绝了读到未提交脏数据（脏读没了）；但它没有限制「同一事务内两次读必须一致」，只要中间别的事务把某行 UPDATE 并提交，本事务第二次读就会读到新值，于是出现不可重复读。要解决它必须保证整个事务期间读到的是同一份快照，这正是「可重复读」做的事。",
      tags: ["脏读", "不可重复读", "幻读", "隔离级别"],
    },
  ],
};

export default category;
