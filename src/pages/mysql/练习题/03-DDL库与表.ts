import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "ddl",
  name: "DDL-库与表",
  problems: [
    {
      title: "创建、查看、切换、删除数据库",
      difficulty: "简单",
      question:
        "请分别写出完成下列操作的 SQL 语句：\n1. 查询服务器上已有的所有数据库；\n2. 创建一个名为 db_school 的数据库（要求：若该库已存在则不报错）；\n3. 切换到 db_school 库以便后续在其中建表；\n4. 删除 db_school 数据库（要求：若该库不存在也不报错）。",
      hint: "想想用 IF NOT EXISTS / IF EXISTS 来避免「已存在」或「不存在」时报错。切换库用 USE。",
      answer:
        "对应的 SQL 如下（见参考答案代码）：\n" +
        "1. SHOW DATABASES; 查看所有数据库。\n" +
        "2. CREATE DATABASE IF NOT EXISTS db_school; 创建库，加 IF NOT EXISTS 表示库已存在时不报错。\n" +
        "3. USE db_school; 切换当前使用的数据库，之后的建表等操作都作用在这个库上。\n" +
        "4. DROP DATABASE IF EXISTS db_school; 删除库，加 IF EXISTS 表示库不存在时也不报错。\n\n" +
        "注意：DROP DATABASE 会连同库中所有表和数据一并删除，操作前务必谨慎。",
      answerCode: `-- 1. 查看所有数据库
SHOW DATABASES;

-- 2. 创建数据库（已存在则不报错）
CREATE DATABASE IF NOT EXISTS db_school;

-- 3. 切换到该数据库
USE db_school;

-- 4. 删除数据库（不存在也不报错）
DROP DATABASE IF EXISTS db_school;`,
      language: "sql",
      tags: ["CREATE DATABASE", "DROP DATABASE", "USE"],
    },
    {
      title: "根据字段需求编写建表语句",
      difficulty: "中等",
      question:
        "现在要创建一张员工表 emp，请根据下列字段需求选择合适的数据类型并写出 CREATE TABLE 语句：\n- id：员工编号，整数，作为主键，自动增长；\n- name：姓名，最多 20 个字符；\n- gender：性别，固定 1 个字符（男/女）；\n- salary：月薪，需要精确到小数点后 2 位的金额；\n- hire_date：入职日期，只需要年月日；\n- create_time：记录创建时间，需要精确到时分秒。",
      hint: "整数用 INT；定长字符用 CHAR，变长字符用 VARCHAR；金额这类要精确的小数用 DECIMAL；只有日期用 DATE，日期+时间用 DATETIME。自增用 AUTO_INCREMENT。",
      answer:
        "数据类型选择思路：\n" +
        "- id 整数主键自增 → INT，配合 PRIMARY KEY 和 AUTO_INCREMENT。\n" +
        "- name 最多 20 个字符、长度不固定 → VARCHAR(20)（变长，省空间）。\n" +
        "- gender 固定 1 个字符 → CHAR(1)（定长，适合长度固定的内容）。\n" +
        "- salary 精确到 2 位小数的金额 → DECIMAL(10,2)，10 是总位数、2 是小数位数；金额不能用 FLOAT/DOUBLE，否则会有精度误差。\n" +
        "- hire_date 只要年月日 → DATE（格式 YYYY-MM-DD）。\n" +
        "- create_time 要时分秒 → DATETIME（格式 YYYY-MM-DD HH:MM:SS）。\n\n" +
        "完整建表语句见参考答案代码。",
      answerCode: `CREATE TABLE emp (
    id INT PRIMARY KEY AUTO_INCREMENT,   -- 员工编号，主键，自增
    name VARCHAR(20),                    -- 姓名，变长字符串
    gender CHAR(1),                      -- 性别，定长 1 个字符
    salary DECIMAL(10, 2),               -- 月薪，精确到 2 位小数
    hire_date DATE,                      -- 入职日期（年月日）
    create_time DATETIME                 -- 创建时间（年月日时分秒）
);`,
      language: "sql",
      tags: ["CREATE TABLE", "数据类型", "建表"],
    },
    {
      title: "用 ALTER TABLE 修改表结构",
      difficulty: "中等",
      question:
        "已有员工表 emp，请针对下列每个需求写出对应的 ALTER TABLE（或改表名）语句：\n1. 新增一列 email，类型为 VARCHAR(50)；\n2. 把 name 列的类型修改为 VARCHAR(30)；\n3. 把 gender 列删除；\n4. 把整张表 emp 改名为 employee。",
      hint: "新增列用 ADD，修改列类型用 MODIFY，删除列用 DROP，改表名用 RENAME TO（或 ALTER TABLE ... RENAME TO ...）。",
      answer:
        "各操作对应的 SQL（见参考答案代码）：\n" +
        "1. 增加列：ALTER TABLE emp ADD email VARCHAR(50);\n" +
        "2. 修改列的数据类型：ALTER TABLE emp MODIFY name VARCHAR(30);（MODIFY 用于只改类型，不改列名；若要同时改列名则用 CHANGE 旧名 新名 类型）\n" +
        "3. 删除列：ALTER TABLE emp DROP email; 这里以删除某列为例，删除 gender 即 ALTER TABLE emp DROP gender;。\n" +
        "4. 修改表名：ALTER TABLE emp RENAME TO employee;（也可写 RENAME TABLE emp TO employee;）。\n\n" +
        "记忆要点：ADD 加列、MODIFY 改类型、CHANGE 改列名+类型、DROP 删列、RENAME 改表名。",
      answerCode: `-- 1. 新增列 email
ALTER TABLE emp ADD email VARCHAR(50);

-- 2. 修改 name 列的类型
ALTER TABLE emp MODIFY name VARCHAR(30);

-- 3. 删除 gender 列
ALTER TABLE emp DROP gender;

-- 4. 把表 emp 改名为 employee
ALTER TABLE emp RENAME TO employee;`,
      language: "sql",
      tags: ["ALTER TABLE", "ADD", "MODIFY", "DROP", "RENAME"],
    },
    {
      title: "找出建表语句中的错误",
      difficulty: "中等",
      question:
        "下面这条建表语句在 MySQL 中执行会报错，请找出其中的 2 处问题并改正。",
      code: `CREATE TABLE student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR,
    age INT,
    score DECIMAL(5,2),
)`,
      language: "sql",
      hint: "注意 VARCHAR 必须指定长度；再看看所有列定义写完后，最后一列后面是否多了点什么；语句结尾还少了什么。",
      answer:
        "主要有 2 处问题：\n" +
        "1. VARCHAR 没有指定长度：name VARCHAR 是错误的，VARCHAR 必须写明最大长度，如 VARCHAR(20)。（CHAR 在 MySQL 中可省略长度默认为 1，但 VARCHAR 必须指定。）\n" +
        "2. 最后一个字段后面多了一个逗号：score DECIMAL(5,2), 后面紧接着就是右括号 )，多出的这个逗号会导致语法错误，应删除最后一列定义末尾的逗号。\n" +
        "此外，规范的 SQL 语句应以分号 ; 结尾。\n\n" +
        "改正后的语句见参考答案代码。",
      answerCode: `CREATE TABLE student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20),        -- 1. 补上长度
    age INT,
    score DECIMAL(5, 2)      -- 2. 删除这一行末尾多余的逗号
);                            -- 别忘了分号结尾`,
      tags: ["找错", "CREATE TABLE", "语法"],
    },
    {
      title: "CHAR 与 VARCHAR 的区别，以及 DROP 与清空表",
      difficulty: "困难",
      question:
        "这是两个常被混淆的概念，请分别回答：\n（1）CHAR 和 VARCHAR 都用来存字符串，它们有什么区别？分别适合存储什么样的数据？例如「身份证号(固定18位)」「用户昵称(长度不定)」应各自选哪个？\n（2）DROP TABLE 和「清空表」（TRUNCATE TABLE）有什么区别？",
      hint: "CHAR 是定长、VARCHAR 是变长，从「存储空间」和「性能」两方面比较；DROP 删的是整张表，TRUNCATE 只删数据保留表结构。",
      answer:
        "（1）CHAR 与 VARCHAR 的区别：\n" +
        "- CHAR(n)：定长字符串，无论实际存多少字符，都固定占用 n 个字符的空间，不足部分用空格补齐。优点是长度固定、存取速度略快；缺点是可能浪费空间。适合存储「长度固定」的数据，如性别、身份证号(固定18位)、手机号、状态码等。\n" +
        "- VARCHAR(n)：变长字符串，最多存 n 个字符，实际占用空间按真实长度决定（另需少量字节记录长度）。优点是节省空间；适合存储「长度不固定」的数据，如用户昵称、地址、备注等。\n" +
        "- 举例：身份证号固定 18 位 → 用 CHAR(18)；用户昵称长度不定 → 用 VARCHAR(50)。\n" +
        "- 一句话：定长选 CHAR（省时间/省心），变长选 VARCHAR（省空间）。\n\n" +
        "（2）DROP TABLE 与清空表（TRUNCATE TABLE）的区别：\n" +
        "- DROP TABLE student：删除「整张表」，表结构和数据全部消失，之后这张表就不存在了，再访问会报错。\n" +
        "- TRUNCATE TABLE student：只清空表中的「所有数据」，但「保留表结构」（列定义还在），相当于把表恢复成一张空表，还能继续往里插入数据；它会重置自增主键、速度快、通常不能回滚。\n" +
        "- 对比 DELETE FROM student（不加 WHERE 也能清空数据）：DELETE 是逐行删除、可加条件、可回滚，但不重置自增；TRUNCATE 是整体清空、更快、重置自增。\n\n" +
        "小结：删「表本身」用 DROP，只删「数据保留结构」用 TRUNCATE（或带条件的 DELETE）。",
      tags: ["CHAR", "VARCHAR", "DROP TABLE", "TRUNCATE", "对比"],
    },
  ],
};

export default category;
