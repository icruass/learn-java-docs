import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "constraints",
  name: "约束",
  problems: [
    {
      title: "约束的种类与作用",
      difficulty: "简单",
      question:
        "什么是约束（Constraint）？它的作用是什么？请列举 MySQL 中常见的 5 种约束，并各用一句话说明其含义。",
      answer:
        "约束是建表时对表中字段（列）施加的限制规则，用来保证数据的完整性、有效性和正确性，在数据插入或修改时由数据库自动检查，不符合规则的数据会被拒绝。\n常见的 5 种约束：\n1. 主键约束 PRIMARY KEY：唯一标识一行记录，要求非空且唯一，一张表只能有一个主键。\n2. 非空约束 NOT NULL：该字段不允许为 NULL，必须有值。\n3. 唯一约束 UNIQUE：该字段的值在整张表中不能重复（但允许为 NULL）。\n4. 默认约束 DEFAULT：插入数据时若未指定该字段的值，则自动使用给定的默认值。\n5. 外键约束 FOREIGN KEY：让本表的某字段去引用另一张表的主键，用来维护两张表之间的引用关系（参照完整性）。\n此外还有检查约束 CHECK（MySQL 8.0.16 起真正生效），用于限定字段取值范围。",
      tags: ["约束", "概念"],
    },
    {
      title: "主键与 AUTO_INCREMENT",
      difficulty: "简单",
      question:
        "请写出一张学生表 student 的建表语句：包含主键 id（整型、自增），姓名 name（字符串）。建表后只插入姓名「张三」「李四」，不手动给 id 赋值，那么这两条记录的 id 分别是多少？为什么？",
      answer:
        "PRIMARY KEY 把 id 设为主键（非空且唯一），AUTO_INCREMENT 让 id 在每次插入新行时自动 +1，因此插入时无需也不应手动给 id 赋值（可以省略该列，或写 NULL / DEFAULT）。\n默认情况下 AUTO_INCREMENT 从 1 开始、步长为 1，所以「张三」的 id 是 1，「李四」的 id 是 2。\n注意：自增值只增不减——即使把 id=2 的记录删掉，下次插入也会得到 id=3，而不会重用 2。",
      code: `-- 请补全建表语句
CREATE TABLE student (
    ...
);`,
      language: "sql",
      answerCode: `CREATE TABLE student (
    id   INT PRIMARY KEY AUTO_INCREMENT,  -- 主键 + 自增
    name VARCHAR(20)
);

INSERT INTO student (name) VALUES ('张三');  -- id 自动为 1
INSERT INTO student (name) VALUES ('李四');  -- id 自动为 2`,
      tags: ["主键", "PRIMARY KEY", "AUTO_INCREMENT"],
    },
    {
      title: "NOT NULL、UNIQUE 与 DEFAULT",
      difficulty: "中等",
      question:
        "已有如下用户表 user，username 要求非空且唯一，email 要求唯一，status 默认值为 1。请预测下面 4 条 INSERT 哪些能成功、哪些会失败，并说明原因。",
      code: `CREATE TABLE user (
    id       INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL UNIQUE,
    email    VARCHAR(50) UNIQUE,
    status   INT DEFAULT 1
);

-- (1)
INSERT INTO user (username, email) VALUES ('tom', 'tom@a.com');
-- (2)
INSERT INTO user (username, email) VALUES ('tom', 'tom2@a.com');
-- (3)
INSERT INTO user (username, email) VALUES ('jerry', NULL);
-- (4)
INSERT INTO user (email) VALUES ('lucy@a.com');`,
      language: "sql",
      answer:
        "(1) 成功。username='tom' 非空且此前无重复，email 也无重复，status 未给值则取默认值 1，最终该行 status=1。\n(2) 失败。username 是 UNIQUE，已存在 'tom'，再插入 'tom' 违反唯一约束，报「Duplicate entry 'tom'」错误。\n(3) 成功。username='jerry' 满足非空且唯一；email 虽然有 UNIQUE 约束，但唯一约束允许多个 NULL（NULL 之间不算重复），所以 email=NULL 可以插入。\n(4) 失败。没有给 username 赋值，而 username 是 NOT NULL 且没有默认值，缺省会得到 NULL，违反非空约束而报错。\n要点：UNIQUE 不限制 NULL 的个数；NOT NULL 字段若无默认值则必须显式提供值。",
      tags: ["NOT NULL", "UNIQUE", "DEFAULT", "预测结果"],
    },
    {
      title: "外键约束与级联删除 ON DELETE CASCADE",
      difficulty: "中等",
      question:
        "现有部门表 dept(id 主键, name) 和员工表 emp(id 主键, name, dept_id)，要求 emp.dept_id 引用 dept.id，并设置为「删除部门时自动删除该部门下的所有员工」。请写出 emp 表中外键的定义；并说明在没有该外键时直接删除被引用的部门会发生什么。",
      hint: "在 emp 表上用 FOREIGN KEY (dept_id) REFERENCES dept(id)，级联用 ON DELETE CASCADE。",
      answer:
        "外键应建在「多」的一方，即 emp 表上，让 dept_id 去引用 dept 表的主键 id。加上 ON DELETE CASCADE 后，删除 dept 中某条记录时，emp 中所有 dept_id 等于该值的员工会被自动一并删除（级联删除）。\n如果建立了普通外键但不带级联：当 emp 中还存在引用某部门的员工时，直接删除该部门会被外键约束阻止（报「a foreign key constraint fails」），必须先删除或修改相关员工才能删部门——这正是外键维护「参照完整性」的体现。\n常见级联动作还有 ON UPDATE CASCADE（被引用主键更新时同步更新外键）、ON DELETE SET NULL（删除时把外键置为 NULL）等。",
      code: `CREATE TABLE dept (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20)
);

CREATE TABLE emp (
    id      INT PRIMARY KEY AUTO_INCREMENT,
    name    VARCHAR(20),
    dept_id INT
    -- 在此补充外键定义
);`,
      language: "sql",
      answerCode: `CREATE TABLE emp (
    id      INT PRIMARY KEY AUTO_INCREMENT,
    name    VARCHAR(20),
    dept_id INT,
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id)
        REFERENCES dept(id)
        ON DELETE CASCADE   -- 删除部门时，级联删除其下员工
        ON UPDATE CASCADE   -- 部门 id 变化时，同步更新员工的 dept_id
);

-- 此后执行：DELETE FROM dept WHERE id = 1;
-- 会自动删除 emp 中所有 dept_id = 1 的员工`,
      tags: ["外键", "FOREIGN KEY", "级联", "ON DELETE CASCADE"],
    },
    {
      title: "根据需求设计带约束的建表语句",
      difficulty: "困难",
      question:
        "请为「图书借阅系统」设计 reader（读者）表，并据此写出完整的 CREATE TABLE 语句，满足以下需求：\n1) 读者编号 id：主键、整型、自增；\n2) 身份证号 id_card：定长 18 位字符串、非空、全表唯一；\n3) 姓名 name：最长 20 字符、非空；\n4) 性别 gender：1 个字符，默认值为 '男'；\n5) 已借数量 borrow_count：整型，默认 0，不允许为空；\n6) 注册时间 reg_time：日期时间类型，默认取当前时间。",
      hint: "逐条把需求翻译成 PRIMARY KEY / AUTO_INCREMENT / NOT NULL / UNIQUE / DEFAULT；当前时间默认值用 DEFAULT CURRENT_TIMESTAMP。",
      answer:
        "把每一条需求映射为对应的约束即可：\n- id：INT + PRIMARY KEY + AUTO_INCREMENT；\n- id_card：CHAR(18)（定长 18 位用 CHAR 更合适）+ NOT NULL + UNIQUE；\n- name：VARCHAR(20) + NOT NULL；\n- gender：CHAR(1) + DEFAULT '男'；\n- borrow_count：INT + NOT NULL + DEFAULT 0；\n- reg_time：DATETIME + DEFAULT CURRENT_TIMESTAMP（插入时若不指定则自动填入当前时间）。\n注意 NOT NULL 与 DEFAULT 可以同时使用：未提供值时用默认值，从而既保证非空又方便插入。",
      answerCode: `CREATE TABLE reader (
    id           INT          PRIMARY KEY AUTO_INCREMENT,
    id_card      CHAR(18)     NOT NULL UNIQUE,
    name         VARCHAR(20)  NOT NULL,
    gender       CHAR(1)      DEFAULT '男',
    borrow_count INT          NOT NULL DEFAULT 0,
    reg_time     DATETIME     DEFAULT CURRENT_TIMESTAMP
);`,
      tags: ["建表", "CREATE TABLE", "综合约束"],
    },
  ],
};

export default category;
