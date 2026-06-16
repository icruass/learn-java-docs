import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "normalization",
  name: "数据库三大范式",
  problems: [
    {
      title: "三大范式各是什么",
      difficulty: "简单",
      question:
        "数据库设计中的「三大范式」分别叫什么？请用一句话概括每一范式的核心要求，并说明它们之间是「层层递进」的关系。",
      answer:
        "三大范式（范式即设计规范，级别越高要求越严）：\n1. 第一范式 1NF：每一列都是「原子的」，即字段不可再分，不能在一个字段里塞多个值。\n2. 第二范式 2NF：在满足 1NF 的前提下，消除「非主属性对联合主键的部分依赖」——即非主键字段必须依赖于「完整的主键」，而不能只依赖主键的一部分。\n3. 第三范式 3NF：在满足 2NF 的前提下，消除「传递依赖」——非主键字段之间不能相互依赖，即非主键字段必须「直接」依赖于主键，而不是依赖另一个非主键字段。\n层层递进：必须先满足低一级范式才谈得上更高一级，即 满足 3NF 一定满足 2NF，满足 2NF 一定满足 1NF。",
      tags: ["三大范式", "概念"],
    },
    {
      title: "判断是否满足 1NF 并改正",
      difficulty: "简单",
      question:
        "下面这张联系人表是否满足第一范式 1NF？如果不满足，指出违反点并给出改正后的表结构。",
      code: `-- contact 表（部分数据）
-- id |  name  |        phone
--  1 |  张三  |  138-0000-0001, 010-66666
--  2 |  李四  |  139-0000-0002`,
      language: "sql",
      answer:
        "不满足 1NF。1NF 要求每个字段都是原子的、不可再分；而这里 phone 列把「手机号、座机号」两个值塞进了同一个单元格（用逗号隔开），属于一个字段存了多个值，违反了原子性。\n这样设计的坏处：无法方便地按某一个电话查询、统计或更新，必须做字符串拆分。\n改正思路有两种：\n1) 若电话种类固定，可拆成多列：mobile（手机）、tel（座机）。\n2) 若一个人电话个数不定，更规范的做法是把电话单独建一张表，与联系人构成一对多（见下方 answerCode）。",
      answerCode: `-- 方案一：拆成原子列
CREATE TABLE contact (
    id     INT PRIMARY KEY AUTO_INCREMENT,
    name   VARCHAR(20),
    mobile VARCHAR(20),   -- 手机号，单独一列
    tel    VARCHAR(20)    -- 座机号，单独一列
);

-- 方案二：电话不定个数 -> 单独建表（一对多）
CREATE TABLE contact (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20)
);
CREATE TABLE contact_phone (
    id         INT PRIMARY KEY AUTO_INCREMENT,
    contact_id INT,
    phone      VARCHAR(20),   -- 每行只存一个电话
    CONSTRAINT fk_phone_contact FOREIGN KEY (contact_id) REFERENCES contact(id)
);`,
      tags: ["1NF", "原子性", "找错改错"],
    },
    {
      title: "理解 2NF：部分依赖",
      difficulty: "中等",
      question:
        "下表是学生选课成绩表，主键为联合主键 (student_id, course_id)。请分析它违反了第几范式，原因是什么，应如何拆分？",
      code: `-- score 表，主键 = (student_id, course_id)
-- student_id | course_id | student_name | course_name | score
--      1      |    101    |    张三      |   数据库     |  90
--      1      |    102    |    张三      |   操作系统   |  85
--      2      |    101    |    李四      |   数据库     |  78`,
      language: "sql",
      answer:
        "违反第二范式 2NF（它满足 1NF，但不满足 2NF）。\n原因：主键是联合主键 (student_id, course_id)。分析各非主键字段的依赖：\n- student_name 只由 student_id 决定（同一个学生不管选哪门课，姓名都一样），它只依赖主键的「一部分」student_id；\n- course_name 只由 course_id 决定，也只依赖主键的「一部分」course_id；\n- 只有 score 才真正同时依赖完整主键 (student_id, course_id)。\nstudent_name、course_name 对联合主键存在「部分依赖」，这违反 2NF，会带来数据冗余（张三的名字重复存多次）和更新异常（改名要改多行）。\n拆分：把只依赖部分主键的字段拆到对应主表——student(id, name)、course(id, name)，原表只保留真正依赖完整主键的 score。",
      answerCode: `CREATE TABLE student (
    id   INT PRIMARY KEY,
    name VARCHAR(20)        -- 只依赖 student_id，归入 student 表
);

CREATE TABLE course (
    id   INT PRIMARY KEY,
    name VARCHAR(30)        -- 只依赖 course_id，归入 course 表
);

CREATE TABLE score (
    student_id INT,
    course_id  INT,
    score      INT,         -- 只有它真正依赖完整联合主键
    PRIMARY KEY (student_id, course_id),
    CONSTRAINT fk_score_student FOREIGN KEY (student_id) REFERENCES student(id),
    CONSTRAINT fk_score_course  FOREIGN KEY (course_id)  REFERENCES course(id)
);`,
      tags: ["2NF", "部分依赖"],
    },
    {
      title: "理解 3NF：传递依赖",
      difficulty: "中等",
      question:
        "下面的员工表主键是 emp_id，单一主键。它满足 2NF，但仍有问题。请判断它违反第几范式、原因，并给出拆分方案。",
      code: `-- emp 表，主键 = emp_id
-- emp_id | emp_name | dept_id | dept_name |  dept_location
--   1    |  张三    |   10    |   研发部   |     北京
--   2    |  李四    |   10    |   研发部   |     北京
--   3    |  王五    |   20    |   市场部   |     上海`,
      hint: "看看 dept_name、dept_location 是直接依赖 emp_id，还是先依赖 dept_id？",
      answer:
        "违反第三范式 3NF（它满足 1NF、2NF，但不满足 3NF）。\n原因：3NF 要求非主键字段直接依赖主键，不允许「传递依赖」。这里依赖链是：emp_id → dept_id → dept_name / dept_location。也就是 dept_name、dept_location 其实是先依赖 dept_id，再由 dept_id 依赖 emp_id，属于通过 dept_id 的「传递依赖」，并非直接依赖主键 emp_id。\n危害：每个研发部员工都重复存「研发部 / 北京」，造成冗余；部门改名或搬迁要改多行（更新异常）；某部门暂时没有员工时其信息无处存放（插入异常）。\n拆分：把部门相关字段抽到独立的 dept 表，emp 表只保留外键 dept_id 指向它。",
      answerCode: `CREATE TABLE dept (
    id       INT PRIMARY KEY,
    name     VARCHAR(30),
    location VARCHAR(30)      -- 部门信息只存一份
);

CREATE TABLE emp (
    emp_id   INT PRIMARY KEY,
    emp_name VARCHAR(20),
    dept_id  INT,            -- 只保留外键，消除传递依赖
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);`,
      tags: ["3NF", "传递依赖", "找错改错"],
    },
    {
      title: "范式的作用与反范式权衡",
      difficulty: "困难",
      question:
        "遵守三大范式能带来什么好处？是不是范式级别越高、拆表越细就一定越好？在实际项目中为什么有时会「反范式（冗余字段）」设计？请结合查询性能谈谈如何权衡。",
      answer:
        "范式的作用（好处）：通过逐步拆表消除数据冗余，从而避免三类异常——插入异常、更新异常、删除异常，让同一数据「只存一份」，数据一致性和可维护性更好。\n但范式并非越高越好：\n- 范式级别越高、表拆得越细，查询时就需要更多的多表连接（JOIN）。JOIN 越多，查询越复杂、性能越低，尤其在大数据量、高并发读取的场景下代价明显。\n- 因此实际项目常做「反范式设计」：有意识地在表中保留少量冗余字段（比如订单表里直接冗余一份下单时的商品名、单价），用「空间换时间」，减少 JOIN、提升读性能；典型如报表、缓存、读多写少的业务。\n权衡原则：\n1) 一般以 3NF 作为设计基准，保证数据规范、减少冗余；\n2) 在确有性能瓶颈、且该数据很少变动时，才有针对性地引入冗余（反范式）；\n3) 反范式的代价是要自己维护冗余数据的一致性（一处修改、多处同步），需要用程序、触发器或定时任务来保证不出现数据不一致。\n一句话：范式保证「正确与不冗余」，反范式追求「查询性能」，实际开发是在两者之间做取舍，而非一味追求高范式。",
      tags: ["范式作用", "反范式", "性能权衡", "概念"],
    },
  ],
};

export default category;
