import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "relations",
  name: "多表关系设计",
  problems: [
    {
      title: "三种表关系概述",
      difficulty: "简单",
      question:
        "关系型数据库中表与表之间存在哪三种基本关系？请各举一个现实例子，并简述每种关系在建表时外键应该加在哪里。",
      answer:
        "三种基本关系：\n1. 一对多（1:N）：最常见。一方的一条记录对应另一方的多条记录。例如「一个部门有多个员工」「一个用户有多个订单」。建表时把外键加在「多」的一方（如 emp 表加 dept_id 指向 dept）。\n2. 多对多（M:N）：双方互相对应多条。例如「一个学生选多门课，一门课被多个学生选」「一个订单含多种商品，一种商品出现在多个订单」。需要额外建一张中间表（关系表），里面放两个外键分别指向两张主表。\n3. 一对一（1:1）：一方的一条记录只对应另一方的一条记录。例如「一个人对应一张身份证」「用户的基本信息表与详情/扩展表」。建表时在任意一方加一个「唯一的外键」指向另一方（外键列加 UNIQUE），也可让两表共用主键。\n口诀：一对多——外键在多方；多对多——建中间表；一对一——外键加 UNIQUE。",
      tags: ["表关系", "概念"],
    },
    {
      title: "一对多：部门与员工",
      difficulty: "简单",
      question:
        "「一个部门有多名员工，一名员工只属于一个部门」属于哪种关系？请写出 dept（部门）和 emp（员工）两张表的建表语句，并正确建立它们之间的关联。",
      hint: "一对多关系，外键加在「多」的一方，即 emp 表。",
      answer:
        "这是典型的一对多关系（一个部门对多个员工）。原则是把外键加在「多」的一方：在 emp 表中增加一个 dept_id 字段，作为外键引用 dept 表的主键 id。这样每个员工通过 dept_id 指向自己所属的部门，一个部门 id 可以被多个员工引用，从而表达「一对多」。\n反过来不要在 dept 表里存员工，否则一个部门有多个员工时无法用单个字段表示。",
      answerCode: `CREATE TABLE dept (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE emp (
    id      INT PRIMARY KEY AUTO_INCREMENT,
    name    VARCHAR(20) NOT NULL,
    dept_id INT,                                   -- 外键在"多"的一方
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id)
        REFERENCES dept(id)
);`,
      language: "sql",
      tags: ["一对多", "外键"],
    },
    {
      title: "多对多：学生与课程",
      difficulty: "中等",
      question:
        "「一个学生可以选多门课程，一门课程可以被多个学生选修」属于哪种关系？应如何设计表结构？请写出 student、course 以及它们之间关系所需的全部建表语句。",
      hint: "多对多必须借助中间表，中间表里放两个外键，分别指向 student 和 course。",
      answer:
        "这是多对多关系。多对多不能只靠两张表上的外键来表示（任何一方都对应多条记录，单个外键放不下），必须引入第三张「中间表（关系表/桥表）」，例如 student_course。\n中间表中至少包含两个外键：student_id 指向 student.id，course_id 指向 course.id，每一行代表「某学生选了某门课」这一条选课记录。还可以把 (student_id, course_id) 设为联合主键以防止重复选课，并可附加成绩 score 等关系自身的属性。\n这样，多对多就被拆成了两个一对多：student 一对多 student_course、course 一对多 student_course。",
      answerCode: `CREATE TABLE student (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE course (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

-- 中间表：每行表示"某学生选了某门课"
CREATE TABLE student_course (
    student_id INT,
    course_id  INT,
    score      INT,                          -- 关系自身的属性：成绩
    PRIMARY KEY (student_id, course_id),      -- 联合主键，防止重复选课
    CONSTRAINT fk_sc_student FOREIGN KEY (student_id) REFERENCES student(id),
    CONSTRAINT fk_sc_course  FOREIGN KEY (course_id)  REFERENCES course(id)
);`,
      language: "sql",
      tags: ["多对多", "中间表", "联合主键"],
    },
    {
      title: "一对一：用户与详情表",
      difficulty: "中等",
      question:
        "把一张很「宽」的用户表拆成 user（常用字段）和 user_detail（不常用的详细字段），二者是一对一关系。请说明一对一关系如何实现，并写出 user_detail 表的设计；和普通一对多的外键相比，关键区别是什么？",
      hint: "在其中一张表加外键指向另一张表，并给这个外键加 UNIQUE，使其只能对应一条。",
      answer:
        "一对一关系可以在任意一方加一个外键指向另一方，关键在于：要给这个外键列加上 UNIQUE 唯一约束。\n与一对多的区别正在于此：一对多时外键列允许重复（多条记录指向同一主表行）；而一对一时外键加了 UNIQUE，每个被引用的主表行最多只能被引用一次，从而保证「一对一」。\n做法一（外键 + UNIQUE）：user_detail.user_id 引用 user.id，并对 user_id 加 UNIQUE。\n做法二（共享主键）：让 user_detail 的主键同时也是引用 user.id 的外键，更省事，常用于垂直拆分场景。\n拆表常见目的：把不常用/大字段分离出去，减小主表体积、提高常用查询效率。",
      answerCode: `CREATE TABLE user (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL
);

-- 做法一：外键列加 UNIQUE，保证一对一
CREATE TABLE user_detail (
    id        INT PRIMARY KEY AUTO_INCREMENT,
    user_id   INT UNIQUE,                          -- 关键：UNIQUE
    address   VARCHAR(100),
    introduce VARCHAR(255),
    CONSTRAINT fk_detail_user FOREIGN KEY (user_id) REFERENCES user(id)
);

-- 做法二（等价思路）：直接用 user 的主键作为本表主键兼外键
-- CREATE TABLE user_detail (
--     user_id INT PRIMARY KEY,
--     address VARCHAR(100),
--     CONSTRAINT fk_detail_user FOREIGN KEY (user_id) REFERENCES user(id)
-- );`,
      language: "sql",
      tags: ["一对一", "UNIQUE", "外键"],
    },
    {
      title: "综合：判断关系并设计表结构",
      difficulty: "困难",
      question:
        "某「博客系统」有如下业务描述：\n① 一个作者可以发表多篇文章，每篇文章只属于一个作者；\n② 一篇文章可以打多个标签，一个标签也可以贴在多篇文章上；\n③ 每篇文章对应且仅对应一条「文章统计」信息（阅读数、点赞数）。\n请分别判断 ①②③ 各属于哪种关系，并设计出所有需要的表（含外键），用 CREATE TABLE 表达。",
      hint: "①一对多，②多对多（建中间表），③一对一（外键加 UNIQUE 或共享主键）。",
      answer:
        "判断：\n① author 与 article 是一对多 → 在「多」的一方 article 上加外键 author_id。\n② article 与 tag 是多对多 → 建中间表 article_tag，放 article_id、tag_id 两个外键，并设为联合主键。\n③ article 与 article_stat 是一对一 → 在 article_stat 上放外键 article_id 并加 UNIQUE（或直接用 article_id 作主键兼外键）。\n这样四个实体被组织为：author 1:N article、article M:N tag（经 article_tag）、article 1:1 article_stat。",
      answerCode: `-- 作者
CREATE TABLE author (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL
);

-- ① 一对多：文章的外键指向作者
CREATE TABLE article (
    id        INT PRIMARY KEY AUTO_INCREMENT,
    title     VARCHAR(100) NOT NULL,
    author_id INT,
    CONSTRAINT fk_article_author FOREIGN KEY (author_id) REFERENCES author(id)
);

-- 标签
CREATE TABLE tag (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE
);

-- ② 多对多：文章-标签中间表
CREATE TABLE article_tag (
    article_id INT,
    tag_id     INT,
    PRIMARY KEY (article_id, tag_id),
    CONSTRAINT fk_at_article FOREIGN KEY (article_id) REFERENCES article(id),
    CONSTRAINT fk_at_tag     FOREIGN KEY (tag_id)     REFERENCES tag(id)
);

-- ③ 一对一：文章统计（article_id 加 UNIQUE）
CREATE TABLE article_stat (
    id         INT PRIMARY KEY AUTO_INCREMENT,
    article_id INT UNIQUE,
    view_count INT NOT NULL DEFAULT 0,
    like_count INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_stat_article FOREIGN KEY (article_id) REFERENCES article(id)
);`,
      language: "sql",
      tags: ["综合设计", "一对多", "多对多", "一对一"],
    },
  ],
};

export default category;
