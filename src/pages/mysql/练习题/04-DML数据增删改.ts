import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "dml",
  name: "DML-数据增删改",
  problems: [
    {
      title: "INSERT 的三种插入写法",
      difficulty: "简单",
      question:
        "已有表 student(id INT, name VARCHAR(20), age INT, city VARCHAR(20))。请分别写出：(1) 全列插入一条记录；(2) 只给 id 和 name 插入一条记录（其余列取默认值 NULL）；(3) 一次性批量插入两条记录。",
      hint: "全列插入可以省略列名，但 VALUES 的值必须按表中列的顺序一一对应。指定列插入要把列名写清楚，未列出的列会取默认值或 NULL。批量插入用逗号分隔多组 VALUES。",
      answer:
        "三种写法的要点：\n" +
        "1. 全列插入：可以不写列名，但 VALUES 后面的值必须严格按照建表时的列顺序（id, name, age, city）排列，且个数一致。\n" +
        "2. 指定列插入：在表名后用括号列出要赋值的列，VALUES 中只给这些列的值；没有出现的 age、city 会自动取默认值（这里没设默认值，所以为 NULL）。\n" +
        "3. 批量插入：在一条 INSERT 语句中用逗号分隔多组「(...)」，比逐条插入效率更高。\n\n" +
        "注意：字符串和日期要用单引号包裹，数值不用。完整语句见参考答案代码。",
      answerCode: `-- 1. 全列插入（省略列名，值按列顺序）
INSERT INTO student VALUES (1, '张三', 20, '北京');

-- 2. 指定列插入（age、city 未给值，取 NULL）
INSERT INTO student (id, name) VALUES (2, '李四');

-- 3. 批量插入两条记录
INSERT INTO student (id, name, age, city) VALUES
    (3, '王五', 22, '上海'),
    (4, '赵六', 21, '广州');`,
      language: "sql",
      tags: ["INSERT", "批量插入", "指定列插入"],
    },
    {
      title: "陷阱：忘记 WHERE 的 UPDATE",
      difficulty: "中等",
      question:
        "某同学本意是「把 id = 5 的员工工资改为 10000」，却写成了下面这条语句。请指出这条语句的实际效果、为什么危险，并写出正确写法。",
      code: `UPDATE emp SET salary = 10000;`,
      hint: "UPDATE 语句如果不带 WHERE 子句，会作用到表中的每一行。想清楚这条语句到底更新了多少行。",
      answer:
        "实际效果：这条语句没有 WHERE 条件，会把 emp 表中「每一行」的 salary 都改成 10000，而不是只改 id = 5 的那一行——相当于全表数据被覆盖，是非常严重的误操作。\n\n" +
        "为什么危险：UPDATE / DELETE 一旦缺少 WHERE，就会无差别作用于整张表，且已经提交后很难恢复（除非有备份或开启了事务还未提交）。\n\n" +
        "正确写法：必须加上 WHERE 精确定位要修改的行。\n\n" +
        "实践建议：\n" +
        "1. 写 UPDATE / DELETE 时先写 WHERE，再写 SET / 删除动作；\n" +
        "2. 执行前可先用相同条件 SELECT 一遍，确认命中的行数是否符合预期；\n" +
        "3. 开发环境可开启 SQL 安全更新模式（sql_safe_updates），缺少 WHERE 时直接报错。",
      answerCode: `-- 正确：加 WHERE 只更新 id = 5 的那一行
UPDATE emp SET salary = 10000 WHERE id = 5;`,
      language: "sql",
      tags: ["UPDATE", "WHERE", "陷阱"],
    },
    {
      title: "按条件更新与删除",
      difficulty: "简单",
      question:
        "针对员工表 emp(id, name, dept, salary)，请写出 SQL 完成以下两个需求：(1) 把「销售部」（dept = '销售部'）所有员工的工资上调 500；(2) 删除工资低于 3000 的所有员工。",
      hint: "UPDATE 的 SET 中可以用「列 = 列 + 数值」做基于原值的修改。DELETE 同样需要 WHERE 指定删除条件。",
      answer:
        "需求 1（涨薪）：用 UPDATE，SET 里写 salary = salary + 500，表示在原工资基础上加 500；WHERE 限定只对销售部生效。\n" +
        "需求 2（删除）：用 DELETE FROM emp，WHERE 条件为 salary < 3000，只删除满足条件的行。\n\n" +
        "关键点：两条语句都依赖 WHERE 来限定影响范围；SET salary = salary + 500 这种「自引用」写法是基于该行当前值计算的。",
      answerCode: `-- 1. 销售部员工工资上调 500
UPDATE emp SET salary = salary + 500 WHERE dept = '销售部';

-- 2. 删除工资低于 3000 的员工
DELETE FROM emp WHERE salary < 3000;`,
      language: "sql",
      tags: ["UPDATE", "DELETE", "WHERE"],
    },
    {
      title: "DELETE 与 TRUNCATE 的区别",
      difficulty: "困难",
      question:
        "都能清空一张表的数据，DELETE FROM t（不带 WHERE）和 TRUNCATE TABLE t 有什么区别？请从「能否带条件、是否可回滚、自增主键、执行效率、是否触发触发器」几个方面比较，并说明各自适用场景。",
      hint: "DELETE 是 DML（逐行删除、写日志、可回滚）；TRUNCATE 偏向 DDL（整体重建、几乎不写行级日志）。重点想想删完后再插入数据时，自增 id 会从几开始。",
      answer:
        "主要区别如下：\n" +
        "1. 能否带条件：DELETE 可以带 WHERE 删除部分行；TRUNCATE 只能清空整张表，不能加条件。\n" +
        "2. 是否可回滚：DELETE 是 DML，在事务中执行可以 ROLLBACK 撤销；TRUNCATE 隐式提交、属于 DDL，执行后通常无法回滚。\n" +
        "3. 自增主键：DELETE 不会重置 AUTO_INCREMENT 计数器，删完再插入时自增 id 接着之前的最大值继续；TRUNCATE 会把自增计数器重置，再插入时 id 从 1 重新开始。\n" +
        "4. 执行效率：DELETE 逐行删除并记录日志，行数多时较慢；TRUNCATE 相当于「删表重建」，几乎不记录行级日志，清空大表时快得多。\n" +
        "5. 触发器：DELETE 会逐行触发 DELETE 触发器；TRUNCATE 不会触发触发器。\n\n" +
        "适用场景：\n" +
        "- 需要按条件删除、或希望可回滚 / 触发触发器时，用 DELETE；\n" +
        "- 只是想快速清空整张表、且不在乎能否回滚、并希望自增重置时，用 TRUNCATE。\n\n" +
        "补充：DROP TABLE 则更进一步——连表结构一起删除，TRUNCATE 只清数据保留结构。",
      tags: ["DELETE", "TRUNCATE", "DDL", "概念"],
    },
    {
      title: "找错：插入时值与列不匹配",
      difficulty: "中等",
      question:
        "表结构为 book(id INT, title VARCHAR(50), price DECIMAL(6,2))。下面这条插入语句执行会报错，请找出错误原因并改正。",
      code: `INSERT INTO book (id, title, price)
VALUES (1, 三国演义, 59.9, '畅销');`,
      hint: "数一数列名有几个、值有几个，是否一一对应。再看看字符串值有没有正确地用引号包起来。",
      answer:
        "这条语句有两个错误：\n" +
        "1. 字符串没有加单引号：书名「三国演义」是字符串，必须写成 '三国演义'，否则会被当作列名 / 标识符，导致语法或未知列错误。\n" +
        "2. 列数与值数不匹配：列只列出了 3 个（id, title, price），VALUES 里却给了 4 个值（多了一个 '畅销'），数量不一致会报「Column count doesn't match value count」错误。\n\n" +
        "改正：去掉多余的 '畅销'，并给字符串加上单引号，让列与值一一对应（id→1, title→'三国演义', price→59.9）。",
      answerCode: `INSERT INTO book (id, title, price)
VALUES (1, '三国演义', 59.9);`,
      language: "sql",
      tags: ["INSERT", "找错", "列值匹配"],
    },
  ],
};

export default category;
