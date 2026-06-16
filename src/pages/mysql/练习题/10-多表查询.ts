import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "joins",
  name: "多表查询",
  problems: [
    {
      title: "什么是笛卡尔积？如何避免",
      difficulty: "简单",
      question:
        "把员工表 emp（5 行）和部门表 dept（4 行）不加任何条件一起查询时，结果会有多少行？这种现象叫什么？为什么会出现「无意义的组合」？实际开发中应如何避免？",
      code: `-- emp 有 5 行，dept 有 4 行
SELECT * FROM emp, dept;`,
      language: "sql",
      hint: "想想「每一行都和对方的每一行配一次」会得到多少种组合。",
      answer:
        "结果是 5 × 4 = 20 行。这种把两张表的每一行两两组合的现象叫「笛卡尔积」（交叉连接）。\n它把本不相干的行也强行拼到一起：比如「张三」会和「市场部、财务部、行政部」这些他根本不属于的部门各配一行，所以绝大多数组合是无意义的。\n避免方法：加上「连接条件」，把外键和主键关联起来，只保留真正对应的行。例如用 WHERE 把 emp.dept_id 和 dept.id 关联（隐式内连接），或用 INNER JOIN ... ON（显式内连接）。",
      answerCode: `-- 加上连接条件，过滤掉无意义的组合，只剩 5 行
SELECT * FROM emp, dept WHERE emp.dept_id = dept.id;`,
      tags: ["笛卡尔积", "交叉连接", "连接条件"],
    },
    {
      title: "内连接的隐式与显式两种写法",
      difficulty: "简单",
      question:
        "内连接（INNER JOIN）有「隐式」和「显式」两种写法，请分别写出查询「每个员工的姓名 ename 及其所属部门名 dept_name」的 SQL，并说明两者的区别。表：emp(ename, dept_id)、dept(id, dept_name)。",
      hint: "隐式用逗号分隔表 + WHERE 写条件；显式用 INNER JOIN ... ON 写条件。",
      answer:
        "两种写法查询结果完全相同，都只返回 emp.dept_id 在 dept 中能匹配上的行（两表都匹配的交集）。\n隐式内连接：表之间用逗号隔开，连接条件写在 WHERE 里，是早期 SQL92 的写法。\n显式内连接：用 INNER JOIN（INNER 可省略）连接两表，连接条件写在 ON 里，是 SQL99 推荐写法。\n区别：显式写法把「连接条件 ON」和「过滤条件 WHERE」分开，语义更清晰、可读性更好，多表连接时不易写漏条件，推荐使用显式写法。",
      language: "sql",
      answerCode: `-- 隐式内连接
SELECT e.ename, d.dept_name
FROM emp e, dept d
WHERE e.dept_id = d.id;

-- 显式内连接（推荐）
SELECT e.ename, d.dept_name
FROM emp e INNER JOIN dept d ON e.dept_id = d.id;`,
      tags: ["内连接", "INNER JOIN", "隐式连接", "显式连接"],
    },
    {
      title: "左外连接和右外连接的区别",
      difficulty: "中等",
      question:
        "LEFT JOIN（左外连接）和 RIGHT JOIN（右外连接）有什么区别？分别会保留哪张表的全部数据？已知 dept 中「行政部」暂时没有任何员工，emp 中有一名员工的 dept_id 为 NULL（未分配部门）。要「查出所有部门，连同部门里的员工（没有员工的部门也要显示）」，应该用哪种连接？写出 SQL。",
      code: `-- 表结构
-- emp(id, ename, dept_id)
-- dept(id, dept_name)   行政部没有员工`,
      language: "sql",
      hint: "「以 JOIN 左边的表为主」就是左外连接；要「所有部门都显示」就让 dept 在主的一侧。",
      answer:
        "区别在于「以哪张表为主、全部保留」：\n- 左外连接 LEFT JOIN：保留左表（JOIN 左边那张表）的全部行，右表没匹配上的列补 NULL。\n- 右外连接 RIGHT JOIN：保留右表（JOIN 右边那张表）的全部行，左表没匹配上的列补 NULL。\n二者只是主表方向不同，A LEFT JOIN B 等价于 B RIGHT JOIN A。\n本题要「所有部门都显示」，就让 dept 作为被全部保留的那张表。可以写成 dept LEFT JOIN emp（dept 在左），这样「行政部」也会出现，对应的员工列为 NULL。\n（如果改用内连接，行政部会因为没有匹配的员工而被漏掉。）",
      answerCode: `-- 让 dept 作为主表全部保留：用左外连接
SELECT d.dept_name, e.ename
FROM dept d LEFT JOIN emp e ON d.id = e.dept_id;

-- 等价的右外连接写法（把 dept 放右边）
SELECT d.dept_name, e.ename
FROM emp e RIGHT JOIN dept d ON d.id = e.dept_id;`,
      tags: ["左外连接", "右外连接", "LEFT JOIN", "RIGHT JOIN"],
    },
    {
      title: "子查询：WHERE 型与 FROM 型",
      difficulty: "中等",
      question:
        "（1）用「WHERE 型子查询」查出「工资高于公司平均工资」的所有员工姓名 ename 和工资 salary。（2）用「FROM 型子查询」：先按部门分组算出每个部门的平均工资，再从这个结果里查出「平均工资高于 8000」的部门。表：emp(ename, salary, dept_id)。",
      hint: "WHERE 型：把子查询的结果（一个标量）当作过滤条件；FROM 型：把子查询的结果（一张临时表）当作数据源，记得给它起别名。",
      answer:
        "子查询就是嵌套在另一条 SQL 里的查询，按它出现的位置常见两类：\n（1）WHERE 型子查询：子查询返回「单个值」（公司平均工资），把它放到外层 WHERE 的条件里做比较。注意不能直接写 WHERE salary > AVG(salary)（聚合函数不能用在 WHERE 中），必须用子查询 (SELECT AVG(salary) FROM emp)。\n（2）FROM 型子查询：子查询返回「一张结果表」（每个部门的平均工资），把它放在 FROM 后当作临时表来再查询，必须给这张临时表起别名（如 t）。",
      language: "sql",
      answerCode: `-- (1) WHERE 型子查询：高于公司平均工资的员工
SELECT ename, salary
FROM emp
WHERE salary > (SELECT AVG(salary) FROM emp);

-- (2) FROM 型子查询：平均工资高于 8000 的部门
SELECT t.dept_id, t.avg_sal
FROM (
    SELECT dept_id, AVG(salary) AS avg_sal
    FROM emp
    GROUP BY dept_id
) t
WHERE t.avg_sal > 8000;`,
      tags: ["子查询", "WHERE型子查询", "FROM型子查询"],
    },
    {
      title: "综合：查询每个部门及其员工的详细信息",
      difficulty: "困难",
      question:
        "给定部门表 dept(id, dept_name, loc) 与员工表 emp(id, ename, salary, dept_id)。请完成：（1）查询每个员工的姓名、工资及其所在部门名称、所在地（只要有部门的员工）；（2）统计每个部门的「部门名称、员工人数、平均工资」，并且没有员工的部门人数要显示为 0；（3）查出「人数最多的那个部门」的部门名称。",
      code: `CREATE TABLE dept (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  dept_name VARCHAR(20),
  loc       VARCHAR(20)
);
CREATE TABLE emp (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  ename   VARCHAR(20),
  salary  DOUBLE,
  dept_id INT
);`,
      language: "sql",
      hint: "(1) 内连接即可；(2) 要让没员工的部门也出现，用 dept LEFT JOIN emp，并用 COUNT(emp.id) 而不是 COUNT(*)；(3) 分组后按人数排序取第一名，用 ORDER BY ... DESC LIMIT 1。",
      answer:
        "（1）只要「有部门的员工」，用内连接把 emp 和 dept 按 dept_id = id 关联即可。\n（2）要让「没有员工的部门」也出现，必须以 dept 为主表做左外连接（dept LEFT JOIN emp）；统计人数时要用 COUNT(e.id) 而不是 COUNT(*)：因为左连接后没员工的部门那一行 e.id 为 NULL，COUNT(e.id) 会忽略 NULL 从而得到 0，而 COUNT(*) 会把那一行也算成 1。\n（3）先按部门分组数出人数，再按人数降序排序，用 LIMIT 1 取人数最多的那个部门。",
      answerCode: `-- (1) 每个员工及其部门信息（内连接）
SELECT e.ename, e.salary, d.dept_name, d.loc
FROM emp e INNER JOIN dept d ON e.dept_id = d.id;

-- (2) 每个部门的人数与平均工资（左外连接，没员工的也显示）
SELECT d.dept_name,
       COUNT(e.id)        AS emp_count,
       IFNULL(AVG(e.salary), 0) AS avg_salary
FROM dept d LEFT JOIN emp e ON d.id = e.dept_id
GROUP BY d.id, d.dept_name;

-- (3) 人数最多的部门
SELECT d.dept_name, COUNT(e.id) AS emp_count
FROM dept d INNER JOIN emp e ON d.id = e.dept_id
GROUP BY d.id, d.dept_name
ORDER BY emp_count DESC
LIMIT 1;`,
      tags: ["多表查询", "外连接", "分组统计", "COUNT"],
    },
  ],
};

export default category;
