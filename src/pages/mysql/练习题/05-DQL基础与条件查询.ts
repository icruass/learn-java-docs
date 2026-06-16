import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "dql-basic",
  name: "DQL-基础与条件查询",
  problems: [
    {
      title: "SELECT 基础与列别名 AS",
      difficulty: "简单",
      question:
        "针对员工表 emp(id, name, salary)，请写出 SQL：查询每位员工的姓名和「年薪」（月薪 salary 乘以 12），要求结果中两列的标题分别显示为「姓名」和「年薪」。并说明 SELECT * 与指定列查询的区别，以及 AS 关键字的作用。",
      hint: "列后面跟 AS 别名 可以给该列起一个显示名；AS 可以省略。年薪是 salary * 12 这样的计算列，特别适合用别名。",
      answer:
        "AS 的作用：给查询结果中的列（或表）起一个临时的「别名」，影响的是结果集显示的标题，不改变数据库中真正的列名。计算列、函数列尤其需要别名，否则标题会很难看（默认就是表达式本身）。AS 可以省略，写成「salary * 12 年薪」也成立。\n\n" +
        "SELECT * 与指定列的区别：\n" +
        "- SELECT * 查询所有列，写起来方便，但会返回不需要的列、可读性差，列顺序还依赖表结构；\n" +
        "- 指定列查询只取需要的列，性能更好、含义更清晰，是推荐写法。\n\n" +
        "本题对中文别名建议用引号或反引号包裹（含特殊字符时必须），完整语句见参考答案代码。",
      answerCode: `-- 用 AS 给列起别名（AS 可省略）
SELECT name AS '姓名',
       salary * 12 AS '年薪'
FROM emp;`,
      language: "sql",
      tags: ["SELECT", "别名", "AS"],
    },
    {
      title: "WHERE 多种条件：范围、集合、NULL",
      difficulty: "中等",
      question:
        "表 student(id, name, age, city)。请写出 SQL 完成：(1) 查询年龄在 18 到 25 之间（含边界）的学生；(2) 查询城市是「北京」「上海」「广州」之一的学生；(3) 查询 city 字段为空（没有填写城市）的学生。",
      hint: "连续范围用 BETWEEN ... AND ...；离散的多个取值用 IN (...)；判断字段为空不能用 = NULL，要用 IS NULL。",
      answer:
        "三个查询分别使用不同的条件运算：\n" +
        "1. 范围用 BETWEEN a AND b，包含两端边界，等价于 age >= 18 AND age <= 25。\n" +
        "2. 多个离散取值用 IN (值1, 值2, ...)，比写一串 OR 更简洁，等价于 city = '北京' OR city = '上海' OR city = '广州'。\n" +
        "3. 判断「空值」必须用 IS NULL，绝对不能写 city = NULL。因为在 SQL 里 NULL 表示「未知」，任何值（包括 NULL 自己）与 NULL 用 = 比较结果都是 UNKNOWN（既非真也非假），导致查不到任何行。判断非空则用 IS NOT NULL。",
      answerCode: `-- 1. 年龄在 18~25 之间（含边界）
SELECT * FROM student WHERE age BETWEEN 18 AND 25;

-- 2. 城市是北京/上海/广州之一
SELECT * FROM student WHERE city IN ('北京', '上海', '广州');

-- 3. 城市为空
SELECT * FROM student WHERE city IS NULL;`,
      language: "sql",
      tags: ["WHERE", "BETWEEN", "IN", "IS NULL"],
    },
    {
      title: "LIKE 模糊查询：% 与 _ 的匹配判断",
      difficulty: "中等",
      question:
        "LIKE 中通配符 % 和 _ 有什么区别？现有姓名数据：'张三'、'张三丰'、'李三'、'张伟'。请判断下面每个条件能匹配到上面哪些姓名：(1) name LIKE '张%'；(2) name LIKE '张_'；(3) name LIKE '%三%'。",
      hint: "% 匹配任意个（0 个或多个）字符；_ 只匹配「恰好一个」字符。一个汉字算一个字符。",
      answer:
        "通配符区别：\n" +
        "- % 匹配任意长度（包括 0 个）的任意字符；\n" +
        "- _（下划线）只匹配「恰好一个」字符。\n\n" +
        "逐条判断（数据：张三、张三丰、李三、张伟）：\n" +
        "1. '张%'：以「张」开头，后面任意。匹配 → 张三、张三丰、张伟（李三不以张开头，不匹配）。\n" +
        "2. '张_'：「张」后面只能再有恰好一个字符，即总长度为 2 个字的、以张开头的名字。匹配 → 张三、张伟（张三丰是 3 个字，不匹配；李三不以张开头，不匹配）。\n" +
        "3. '%三%'：名字中任意位置包含「三」。匹配 → 张三、张三丰、李三（张伟里没有「三」，不匹配）。\n\n" +
        "小结：'张%' 重在「开头」、'张_' 重在「开头且长度固定」、'%三%' 重在「包含」。",
      tags: ["LIKE", "模糊查询", "通配符"],
    },
    {
      title: "DISTINCT 去重",
      difficulty: "简单",
      question:
        "员工表 emp 中有一列 dept（部门）存在重复值。请写出 SQL 查询出公司「一共有哪些部门」（不重复）。并说明 DISTINCT 作用于多列时是如何去重的。",
      hint: "在 SELECT 后、列名前加 DISTINCT 即可去掉重复行。DISTINCT 对其后所有列的「组合」去重。",
      answer:
        "查询不重复的部门：在 SELECT 后、列名前加 DISTINCT，写 SELECT DISTINCT dept FROM emp;，结果中每个部门只出现一次。\n\n" +
        "DISTINCT 作用于多列时：例如 SELECT DISTINCT dept, city FROM emp，它是对「dept 和 city 的组合」整体去重，只有两列的值都相同的行才算重复，而不是分别对每列去重。\n\n" +
        "注意：DISTINCT 必须紧跟在 SELECT 之后，且对其后列出的所有列同时生效，不能只给中间某一列去重。",
      answerCode: `-- 查询所有不重复的部门
SELECT DISTINCT dept FROM emp;`,
      language: "sql",
      tags: ["DISTINCT", "去重", "SELECT"],
    },
    {
      title: "组合条件查询（综合）",
      difficulty: "困难",
      question:
        "商品表 product(id, name, category, price, stock)。请写一条 SQL，查询满足以下全部条件的商品的「名称、价格」两列：分类为「手机」或「电脑」，且价格在 2000 到 8000 之间，且库存 stock 不为 NULL。结果按价格从高到低排列。",
      hint: "多个条件用 AND 连接；其中「手机或电脑」是一个 OR / IN 的小组合，注意它与其它 AND 条件混用时要不要加括号。最后用 ORDER BY ... DESC 排序。",
      answer:
        "拆解条件：\n" +
        "1. 分类是手机或电脑：用 category IN ('手机', '电脑')。注意如果写成 category = '手机' OR category = '电脑'，由于 OR 优先级低于 AND，必须用括号括起来，否则逻辑会出错；用 IN 则天然是一个整体，更安全。\n" +
        "2. 价格区间：price BETWEEN 2000 AND 8000。\n" +
        "3. 库存非空：stock IS NOT NULL。\n" +
        "4. 三组条件之间是「且」的关系，用 AND 连接。\n" +
        "5. 排序：ORDER BY price DESC 实现价格从高到低。\n\n" +
        "只选 name、price 两列即可，完整语句见参考答案代码。",
      answerCode: `SELECT name, price
FROM product
WHERE category IN ('手机', '电脑')
  AND price BETWEEN 2000 AND 8000
  AND stock IS NOT NULL
ORDER BY price DESC;`,
      language: "sql",
      tags: ["WHERE", "AND", "IN", "综合查询"],
    },
  ],
};

export default category;
