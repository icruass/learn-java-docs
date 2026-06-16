import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "dql-group",
  name: "DQL-排序聚合分组分页",
  problems: [
    {
      title: "ORDER BY 多字段排序",
      difficulty: "简单",
      question:
        "员工表 emp(id, name, dept, salary)。请写一条 SQL，先按部门 dept 升序排列，部门相同的再按工资 salary 从高到低排列。并说明 ASC 和 DESC 的含义，以及多字段排序的执行顺序。",
      hint: "ORDER BY 后可以跟多个列，用逗号分隔。每个列可单独指定 ASC（升序，默认）或 DESC（降序）。",
      answer:
        "ASC 表示升序（从小到大），是默认值，可省略；DESC 表示降序（从大到小）。\n\n" +
        "多字段排序的执行顺序：按 ORDER BY 后列的「书写先后」逐级排序——先按第一个列排；只有当第一个列的值相同时，才用第二个列来决定这些行的先后；以此类推。\n\n" +
        "本题：dept ASC 是主排序（部门升序），salary DESC 是次排序（同部门内工资降序）。每个列的升降序是各自独立的，所以可以一个升序、一个降序混用。完整语句见参考答案代码。",
      answerCode: `-- 先按部门升序，部门相同再按工资降序
SELECT id, name, dept, salary
FROM emp
ORDER BY dept ASC, salary DESC;`,
      language: "sql",
      tags: ["ORDER BY", "ASC", "DESC", "多字段排序"],
    },
    {
      title: "聚合函数与 NULL：COUNT(*) 和 COUNT(列)",
      difficulty: "中等",
      question:
        "表 emp 共有 10 行，其中 bonus（奖金）列有 3 行为 NULL、7 行有数值。请说明聚合函数对 NULL 的处理规则，并回答：(1) COUNT(*)、(2) COUNT(bonus)、(3) AVG(bonus) 的统计结果分别是基于多少行计算的？",
      hint: "除 COUNT(*) 外，聚合函数都会跳过 NULL。COUNT(*) 统计行数，COUNT(列) 统计该列非 NULL 的个数。AVG 是「非空之和 ÷ 非空个数」。",
      answer:
        "核心规则：除了 COUNT(*)，所有聚合函数（SUM、AVG、MAX、MIN、COUNT(列)）都会「忽略 NULL」，即只对非 NULL 的值参与计算。\n\n" +
        "本题（共 10 行，bonus 有 3 个 NULL、7 个有值）：\n" +
        "1. COUNT(*) = 10：统计的是「行数」，与某列是否为 NULL 无关，所以是全部 10 行。\n" +
        "2. COUNT(bonus) = 7：统计的是 bonus 列中「非 NULL 的个数」，3 个 NULL 被跳过，结果为 7。\n" +
        "3. AVG(bonus)：只对 7 个非空值求平均，即「7 个值之和 ÷ 7」，分母是 7 而不是 10。这点很关键——如果业务上希望 NULL 当作 0 参与平均，则需要先用 IFNULL(bonus, 0) 把 NULL 转成 0 再算。\n\n" +
        "记忆要点：要统计「总行数」用 COUNT(*)；COUNT(列) 实际是在数该列有多少个有值的数据。",
      tags: ["聚合函数", "COUNT", "NULL", "AVG"],
    },
    {
      title: "GROUP BY 分组统计",
      difficulty: "中等",
      question:
        "员工表 emp(id, name, dept, salary)。请写一条 SQL，统计「每个部门的人数」和「每个部门的平均工资」，并按部门名称排序。结果包含三列：部门、人数、平均工资。",
      hint: "按部门分组用 GROUP BY dept；分组后对每组用 COUNT(*) 求人数、AVG(salary) 求平均工资。SELECT 里出现的非聚合列应当是分组列。",
      answer:
        "思路：GROUP BY dept 把同一部门的行归为一组，然后聚合函数会对「每一组」分别计算。\n" +
        "- COUNT(*) 得到每组的行数（人数）；\n" +
        "- AVG(salary) 得到每组的平均工资；\n" +
        "- 用别名让结果列名更直观。\n\n" +
        "重要规则：使用 GROUP BY 后，SELECT 中出现的列要么是分组列（dept），要么被聚合函数包裹；不要选未分组又未聚合的列（如直接选 name），否则结果没有意义（标准 SQL 会报错）。最后用 ORDER BY dept 排序。完整语句见参考答案代码。",
      answerCode: `SELECT dept AS '部门',
       COUNT(*) AS '人数',
       AVG(salary) AS '平均工资'
FROM emp
GROUP BY dept
ORDER BY dept;`,
      language: "sql",
      tags: ["GROUP BY", "聚合函数", "分组统计"],
    },
    {
      title: "HAVING 与 WHERE 的区别",
      difficulty: "困难",
      question:
        "WHERE 和 HAVING 都是过滤，它们有什么本质区别？现需求：统计每个部门的平均工资，但只保留「平均工资高于 8000」的部门。下面这条 SQL 为什么不对，应该怎么改？",
      code: `SELECT dept, AVG(salary) AS avg_sal
FROM emp
WHERE AVG(salary) > 8000
GROUP BY dept;`,
      hint: "WHERE 在分组「之前」对原始行过滤，此时还没有分组、也算不出 AVG；HAVING 在分组「之后」对每组的聚合结果过滤。聚合条件应该放在哪个子句？",
      answer:
        "WHERE 与 HAVING 的本质区别：\n" +
        "- WHERE 在分组之前执行，针对的是「原始的每一行」，因此 WHERE 里不能使用聚合函数（此时 AVG / COUNT 等还没有计算）。\n" +
        "- HAVING 在 GROUP BY 分组之后执行，针对的是「每个分组的聚合结果」，所以筛选聚合值（如 AVG(salary) > 8000）必须用 HAVING。\n\n" +
        "题中语句为什么错：它把聚合条件 AVG(salary) > 8000 写在了 WHERE 里，而 WHERE 阶段还没分组、无法对一组数据求平均，会直接报错。\n\n" +
        "改法：把这个条件移到 GROUP BY 之后的 HAVING 子句中。执行顺序大致是 FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY。\n\n" +
        "补充：如果还要先排除某些原始行（如剔除试用期员工），那部分非聚合条件仍放在 WHERE，二者可以同时使用、各司其职。",
      answerCode: `-- 聚合条件改用 HAVING
SELECT dept, AVG(salary) AS avg_sal
FROM emp
GROUP BY dept
HAVING AVG(salary) > 8000;`,
      language: "sql",
      tags: ["HAVING", "WHERE", "GROUP BY", "执行顺序"],
    },
    {
      title: "LIMIT 分页与偏移量公式",
      difficulty: "中等",
      question:
        "LIMIT 用于分页。请说明 LIMIT 偏移量, 条数 中两个参数的含义，并给出「第 n 页、每页 m 条」时偏移量的计算公式。然后写出对 article 表（按 id 升序）查询「每页 10 条、第 3 页」数据的 SQL。",
      hint: "LIMIT 偏移量, 条数 中偏移量是「跳过多少行」，从 0 开始计。第 1 页跳过 0 行，第 2 页跳过 m 行……推出第 n 页跳过几行。",
      answer:
        "LIMIT 两个参数的含义：写法为 LIMIT 偏移量, 条数。\n" +
        "- 偏移量（offset）：跳过前面多少行，从 0 开始计数（第 1 行的偏移量是 0）；\n" +
        "- 条数：从偏移位置往后取多少行。\n" +
        "（只写一个数时，LIMIT m 等价于 LIMIT 0, m，即取前 m 条。）\n\n" +
        "分页偏移量公式：设每页 m 条，求第 n 页：\n" +
        "    偏移量 = (n - 1) * m，条数 = m\n" +
        "验证：第 1 页 offset = 0，第 2 页 offset = m，第 3 页 offset = 2m……符合预期。\n\n" +
        "本题：每页 m = 10、第 n = 3 页 → 偏移量 = (3 - 1) * 10 = 20，条数 = 10，即 LIMIT 20, 10。分页通常要配合 ORDER BY 保证顺序稳定。完整语句见参考答案代码。",
      answerCode: `-- 每页 10 条，第 3 页：偏移量 = (3-1)*10 = 20
SELECT * FROM article
ORDER BY id
LIMIT 20, 10;`,
      language: "sql",
      tags: ["LIMIT", "分页", "偏移量"],
    },
  ],
};

export default category;
