import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "sql-basics",
  name: "SQL通用语法与分类",
  problems: [
    {
      title: "SQL 四大分类各管什么",
      difficulty: "简单",
      question:
        "SQL 语句按功能通常分为 DDL、DML、DQL、DCL 四大类，请分别写出它们的英文全称，并说明每一类各自负责操作什么（管什么）。",
      answer:
        "SQL 四大分类：\n" +
        "1. DDL（Data Definition Language，数据定义语言）：用来定义/管理数据库对象的「结构」，如创建、修改、删除 数据库、表、字段等。代表关键字：CREATE、ALTER、DROP、TRUNCATE。\n" +
        "2. DML（Data Manipulation Language，数据操作语言）：用来对表中的「数据记录」进行增、删、改。代表关键字：INSERT、UPDATE、DELETE。\n" +
        "3. DQL（Data Query Language，数据查询语言）：用来「查询」表中的数据记录。代表关键字：SELECT（配合 WHERE、GROUP BY、ORDER BY 等）。\n" +
        "4. DCL（Data Control Language，数据控制语言）：用来管理数据库的「用户和权限」，控制谁能访问、能做什么。代表关键字：GRANT（授权）、REVOKE（撤权）。\n\n" +
        "记忆要点：DDL 管「结构」、DML 管「数据增删改」、DQL 管「查」、DCL 管「权限」。",
      tags: ["DDL", "DML", "DQL", "DCL", "分类"],
    },
    {
      title: "判断语句属于哪一类 SQL",
      difficulty: "中等",
      question:
        "请判断下列每条 SQL 语句分别属于 DDL、DML、DQL、DCL 中的哪一类，并简要说明理由。",
      code: `-- 1
CREATE TABLE student (id INT, name VARCHAR(20));
-- 2
INSERT INTO student VALUES (1, '张三');
-- 3
SELECT * FROM student;
-- 4
GRANT SELECT ON db.student TO 'tom'@'localhost';
-- 5
UPDATE student SET name = '李四' WHERE id = 1;
-- 6
DROP TABLE student;`,
      language: "sql",
      hint: "看动词：CREATE/DROP 改的是「结构」，INSERT/UPDATE 改的是「数据」，SELECT 是「查询」，GRANT 是「授权」。",
      answer:
        "逐条判断：\n" +
        "1. CREATE TABLE ... —— DDL，创建表（定义结构）。\n" +
        "2. INSERT INTO ... —— DML，向表中插入数据记录。\n" +
        "3. SELECT * FROM ... —— DQL，查询数据。\n" +
        "4. GRANT SELECT ... TO ... —— DCL，给用户授予权限。\n" +
        "5. UPDATE ... SET ... —— DML，修改表中已有的数据记录。\n" +
        "6. DROP TABLE ... —— DDL，删除表（删除结构）。\n\n" +
        "归类汇总：DDL → 第 1、6 条；DML → 第 2、5 条；DQL → 第 3 条；DCL → 第 4 条。",
      tags: ["分类判断", "DDL", "DML", "DQL", "DCL"],
    },
    {
      title: "SQL 的三种注释写法",
      difficulty: "简单",
      question:
        "MySQL 中编写 SQL 时支持哪几种注释方式？请分别写出它们的语法格式，并说明单行注释中容易被忽略的一个细节。",
      hint: "MySQL 支持两种单行注释和一种多行注释，其中一种单行注释对「空格」有要求。",
      answer:
        "MySQL 支持三种注释写法：\n" +
        "1. 单行注释 -- ：用「两个连字符 + 一个空格」开头，从此处到行尾都是注释。注意：-- 后面必须跟一个空格（或控制符），否则 MySQL 不会把它当注释，例如 `--abc` 不是合法注释，`-- abc` 才是。\n" +
        "2. 单行注释 # ：从 # 开始到行尾都是注释，这是 MySQL 特有的写法，# 后面不强制要求空格。\n" +
        "3. 多行注释 /* ... */ ：可以跨越多行，/* 与 */ 之间的内容都被忽略，常用于注释掉一大段 SQL。\n\n" +
        "示例见参考答案代码。其中要特别记住「-- 后必须有空格」这个易错点。",
      answerCode: `-- 这是单行注释（注意 -- 后面有空格）
SELECT * FROM student;   # 这也是单行注释（# 写法）
/*
  这是多行注释，
  可以写很多行说明。
*/
SELECT name FROM student;`,
      language: "sql",
      tags: ["注释", "语法"],
    },
    {
      title: "SQL 通用语法规则判断对错",
      difficulty: "中等",
      question:
        "关于 MySQL 的通用语法规则，下面 4 句说法是否正确？请逐条判断「对/错」并说明理由：\n1. 一条 SQL 语句可以写在一行，也可以写成多行，最后用分号结尾。\n2. SQL 的关键字区分大小写，SELECT 必须全大写才能执行。\n3. 多条 SQL 语句之间用分号(;)分隔。\n4. 关键字之间可以用一个或多个空格、换行来分隔。",
      hint: "重点辨析「关键字是否区分大小写」这一条，其余三条都描述了正确的通用规则。",
      answer:
        "逐条判断：\n" +
        "1. 正确。SQL 语句可以单行书写，也可以根据可读性写成多行，结尾用分号 ; 表示一条语句结束。\n" +
        "2. 错误。SQL 的关键字「不区分大小写」，SELECT、select、Select 都能执行；只是为了规范和可读性，习惯上把关键字写成大写。（注意：在某些系统/配置下，数据库名、表名等标识符可能区分大小写，但关键字本身不区分。）\n" +
        "3. 正确。多条 SQL 语句之间使用分号 ; 进行分隔，逐条执行。\n" +
        "4. 正确。关键字、字段、表名之间可以使用空格或换行（一个或多个）来分隔，多余的空白会被忽略，不影响执行。\n\n" +
        "小结：四句中只有第 2 句是错的——SQL 关键字不区分大小写，但推荐大写。",
      tags: ["通用语法", "大小写", "分号"],
    },
    {
      title: "DDL 与 DML 的区别",
      difficulty: "困难",
      question:
        "DDL 和 DML 都属于「修改」类的 SQL，它们最本质的区别是什么？请从「操作对象」「典型关键字」「对数据的影响」三个角度说明。再思考：TRUNCATE TABLE 和 DELETE FROM 都能清空表数据，它们一个属于 DDL、一个属于 DML，请指出二者的差异。",
      hint: "关键在于：DDL 改的是表「结构」，DML 改的是表里的「数据」；TRUNCATE 是「重建表」式的清空。",
      answer:
        "DDL 与 DML 的本质区别：\n" +
        "1. 操作对象不同：DDL（数据定义语言）操作的是数据库/表的「结构」（库、表、字段本身的定义）；DML（数据操作语言）操作的是表中已有的「数据记录」。\n" +
        "2. 典型关键字不同：DDL 是 CREATE、ALTER、DROP、TRUNCATE；DML 是 INSERT、UPDATE、DELETE。\n" +
        "3. 对数据的影响不同：DDL 改变的是「有没有这张表、表长什么样」；DML 改变的是「表里有哪些行、行里是什么值」。\n\n" +
        "TRUNCATE TABLE 与 DELETE FROM 的差异（都能清空一张表的数据）：\n" +
        "- DELETE FROM 属于 DML：逐行删除记录，可以加 WHERE 条件只删部分行；删除可被事务回滚（rollback）；不重置自增主键计数。\n" +
        "- TRUNCATE TABLE 属于 DDL：相当于「删除整张表再按原结构重建一张空表」，只能整体清空、不能加 WHERE；速度更快；通常不能回滚；会重置自增主键从 1 开始。\n\n" +
        "一句话：要「按条件删、能回滚」用 DELETE（DML）；要「快速全表清空并重置自增」用 TRUNCATE（DDL）。",
      tags: ["DDL", "DML", "TRUNCATE", "DELETE", "对比"],
    },
  ],
};

export default category;
