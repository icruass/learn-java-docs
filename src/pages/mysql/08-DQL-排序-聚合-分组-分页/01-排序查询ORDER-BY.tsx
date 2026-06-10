import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>排序查询 ORDER BY</Title>

    <Subtitle>本章导读</Subtitle>
    <Paragraph>
      在上一章，我们已经掌握了 DQL 最基础的能力：用{' '}
      <InlineCode>SELECT ... FROM ... WHERE ...</InlineCode> 把表里
      <Text bold>符合条件的行</Text>
      一条条挑出来。但在真实业务里，光把数据"挑出来"是远远不够的，老板更关心的往往是这样的问题：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        "把工资从高到低排个序给我看看" —— 这是<Text bold>排序</Text>；
      </ListItem>
      <ListItem>
        "公司一共多少人？平均工资多少？最高工资多少？" —— 这是
        <Text bold>聚合（统计）</Text>；
      </ListItem>
      <ListItem>
        "每个部门各自的平均工资分别是多少？" —— 这是<Text bold>分组</Text>；
      </ListItem>
      <ListItem>
        "数据有几万条，前端一页只显示 10 条，怎么取第 3 页？" —— 这是
        <Text bold>分页</Text>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      本章就是把 DQL
      从"查一行行的原始数据"升级到"查统计结果、查报表"的关键一跃。它在整个 SQL
      学习里处于承上启下的位置：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>承上</Text>：所有例子仍然建立在上一章的{' '}
        <InlineCode>WHERE</InlineCode> 过滤之上；
      </ListItem>
      <ListItem>
        <Text bold>启下</Text>：本章的 <InlineCode>GROUP BY</InlineCode>
        、聚合函数是后面学习多表连接查询、子查询做报表统计的地基。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      学完本章，你将能写出一条像模像样的"统计报表 SQL"，比如这样一条把本章知识点全用上的语句（先有个印象，本章末尾你会完全看懂它）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT dept_id, COUNT(*) AS 人数, AVG(salary) AS 平均工资
FROM emp
WHERE salary > 7000          -- 分组前过滤：只统计工资 > 7000 的人
GROUP BY dept_id             -- 按部门分组
HAVING AVG(salary) > 8000    -- 分组后过滤：只保留平均工资 > 8000 的部门
ORDER BY 平均工资 DESC       -- 按平均工资降序
LIMIT 0, 2;                  -- 分页：取第 1 页，每页 2 条`}
    />
    <Callout type="tip">
      本章一定要<Text bold>亲手敲</Text>。统计类 SQL 看着简单，但{' '}
      <InlineCode>WHERE</InlineCode> 和 <InlineCode>HAVING</InlineCode>
      谁先谁后、<InlineCode>COUNT(*)</InlineCode> 和{' '}
      <InlineCode>COUNT(列)</InlineCode> 差在哪，不动手就永远似懂非懂。
    </Callout>

    <Divider />

    <Subtitle>0. 准备工作：建库建表与示例数据</Subtitle>
    <Paragraph>
      本章沿用全套教程统一的 <InlineCode>db_learn</InlineCode>
      数据库与员工/部门表。为保证你能直接复现每一条结果，请先执行下面的脚本（已经建过的同学可跳过，或者先{' '}
      <InlineCode>DROP</InlineCode> 再重建以保证数据一致）。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 创建并切换数据库
CREATE DATABASE IF NOT EXISTS db_learn DEFAULT CHARSET utf8mb4;
USE db_learn;

-- 部门表
CREATE TABLE dept (
  id INT PRIMARY KEY AUTO_INCREMENT,   -- 部门编号
  dept_name VARCHAR(20),               -- 部门名称
  loc VARCHAR(20)                      -- 所在城市
);
INSERT INTO dept (dept_name, loc) VALUES
  ('研发部','北京'), ('市场部','上海'), ('财务部','广州');

-- 员工表
CREATE TABLE emp (
  id INT PRIMARY KEY AUTO_INCREMENT,   -- 员工编号
  ename VARCHAR(20),                   -- 姓名
  gender CHAR(1),                      -- 性别 男/女
  salary DOUBLE,                       -- 工资
  join_date DATE,                      -- 入职日期
  dept_id INT,                         -- 所属部门(外键->dept.id)
  bonus DOUBLE,                        -- 奖金(可能为 NULL，用于讲解 NULL)
  CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
  ('张三','男',8000, '2020-01-10', 1, 1000),
  ('李四','男',12000,'2019-03-15', 1, NULL),
  ('王五','女',9500, '2021-06-01', 2, 2000),
  ('赵六','女',6000, '2022-09-20', 2, NULL),
  ('孙七','男',15000,'2018-11-05', 3, 3000);`}
    />
    <Paragraph>
      执行后 <InlineCode>emp</InlineCode>
      表里的数据如下（这张表会贯穿全章，建议你截图或抄下来对照）：
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', 'join_date', 'dept_id', 'bonus']}
      rows={[
        ['1', '张三', '男', '8000', '2020-01-10', '1', '1000'],
        ['2', '李四', '男', '12000', '2019-03-15', '1', 'NULL'],
        ['3', '王五', '女', '9500', '2021-06-01', '2', '2000'],
        ['4', '赵六', '女', '6000', '2022-09-20', '2', 'NULL'],
        ['5', '孙七', '男', '15000', '2018-11-05', '3', '3000'],
      ]}
    />
    <Paragraph>注意两点，后面反复要用：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>bonus</InlineCode>（奖金）有两个 <InlineCode>NULL</InlineCode>
        （李四、赵六），专门用来演示 NULL 对聚合的影响。
      </ListItem>
      <ListItem>
        <InlineCode>dept_id</InlineCode>：1=研发部、2=市场部、3=财务部。研发部 2
        人、市场部 2 人、财务部 1 人。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>1. 排序查询 ORDER BY</Subtitle>

    <Heading3>1.1 为什么需要排序</Heading3>
    <Paragraph>
      默认情况下，<InlineCode>SELECT</InlineCode>
      查出来的行是"没有保证顺序"的——你不能假设它一定按主键升序返回（虽然小表常常看起来是）。只要你想让结果
      <Text bold>按某个规则排好队</Text>，就必须显式写{' '}
      <InlineCode>ORDER BY</InlineCode>。
    </Paragraph>
    <Callout type="warning">
      不写 <InlineCode>ORDER BY</InlineCode> 时，结果顺序是
      <Text bold>不确定的</Text>，不要依赖它。哪怕现在看着是有序的，换台机器、加了索引、数据量变大后顺序就可能变。要顺序就一定写{' '}
      <InlineCode>ORDER BY</InlineCode>。
    </Callout>

    <Heading3>1.2 语法格式</Heading3>
    <CodeBlock
      language="text"
      code={`SELECT 列1, 列2, ...
FROM 表名
[WHERE 条件]
ORDER BY 排序列1 [ASC|DESC], 排序列2 [ASC|DESC], ... ;`}
    />
    <Paragraph>逐项解释：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>
          <InlineCode>ORDER BY</InlineCode> 排序列
        </Text>
        ：按哪一（几）列排队。可以是字段名，也可以是表达式、甚至是{' '}
        <InlineCode>SELECT</InlineCode> 里起的别名。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>ASC</InlineCode>
        </Text>
        ：ascending，<Text bold>升序</Text>（从小到大，从 A 到 Z，从旧到新）。
        <Text bold>这是默认值</Text>，不写就是它。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>DESC</InlineCode>
        </Text>
        ：descending，<Text bold>降序</Text>（从大到小）。
      </ListItem>
      <ListItem>
        <Text bold>多字段</Text>：用逗号分隔，
        <Text bold>
          先按第一个字段排，第一个字段相同的行再按第二个字段排
        </Text>
        ，以此类推。
      </ListItem>
    </UnorderedList>

    <Heading3>1.3 单字段排序示例</Heading3>
    <Paragraph>
      <Text bold>例 1：按工资升序（默认）</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, salary
FROM emp
ORDER BY salary;          -- 等价于 ORDER BY salary ASC`}
    />
    <Paragraph>结果（从低到高）：</Paragraph>
    <Table
      head={['id', 'ename', 'salary']}
      rows={[
        ['4', '赵六', '6000'],
        ['1', '张三', '8000'],
        ['3', '王五', '9500'],
        ['2', '李四', '12000'],
        ['5', '孙七', '15000'],
      ]}
    />
    <Paragraph>
      <Text bold>例 2：按工资降序</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, salary
FROM emp
ORDER BY salary DESC;`}
    />
    <Paragraph>结果（从高到低）：</Paragraph>
    <Table
      head={['id', 'ename', 'salary']}
      rows={[
        ['5', '孙七', '15000'],
        ['2', '李四', '12000'],
        ['3', '王五', '9500'],
        ['1', '张三', '8000'],
        ['4', '赵六', '6000'],
      ]}
    />

    <Heading3>1.4 多字段排序示例</Heading3>
    <Paragraph>
      类比：体育课排队，<Text bold>先按身高从高到矮排</Text>
      ；如果两个人一样高（身高相同），<Text bold>再按学号从小到大排</Text>
      。身高就是"第一排序字段"，学号是"第二排序字段"，只有在第一字段"打平"时第二字段才起作用。
    </Paragraph>
    <Paragraph>
      我们的 5 条数据工资各不相同，看不出第二字段的效果，先按
      <Text bold>性别</Text>分一下再看：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, gender, salary
FROM emp
ORDER BY gender ASC, salary DESC;   -- 先按性别升序，性别相同再按工资降序`}
    />
    <Paragraph>
      结果：性别先分成"男""女"两堆（<InlineCode>女</InlineCode>{' '}
      在前是因为字符比较里它排前面，下面会解释），每堆内部再按工资从高到低：
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', '']}
      rows={[
        ['3', '王五', '女', '9500', '← 女，组内工资最高'],
        ['4', '赵六', '女', '6000', '← 女'],
        ['5', '孙七', '男', '15000', '← 男，组内工资最高'],
        ['2', '李四', '男', '12000', '← 男'],
        ['1', '张三', '男', '8000', '← 男'],
      ]}
    />
    <Callout type="tip">
      每个字段可以<Text bold>单独</Text>指定升降。上例{' '}
      <InlineCode>gender ASC, salary DESC</InlineCode>{' '}
      表示"性别升序、工资降序"，这是两件独立的事。<InlineCode>DESC</InlineCode>{' '}
      <Text bold>只作用于它紧挨着的前一个字段</Text>，不会顺延到后面。
    </Callout>
    <Paragraph>
      最经典的一条（任务点名要求）——工资降序，工资相同的按员工号升序：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, salary
FROM emp
ORDER BY salary DESC, id ASC;`}
    />
    <Paragraph>
      这条的含义：先把工资高的排前面；万一有两个人工资一样（本例没有），就让{' '}
      <InlineCode>id</InlineCode> 小的排前面，保证顺序<Text bold>稳定可预期</Text>
      。这是工程上极常用的写法——<Text bold>用一个唯一列（如主键 id）做最后的"兜底排序"</Text>
      ，避免顺序抖动。
    </Paragraph>

    <Heading3>1.5 排序的进阶与坑</Heading3>
    <Paragraph>
      <Text bold>(1) 中文/字符的排序规则</Text>
      ：上例中"女"排在"男"前面，并不是因为拼音，而是按列的
      <Text bold>字符集排序规则（collation）</Text>比较的。如果你想按拼音排序，要让列使用支持拼音的
      collation，或用 <InlineCode>CONVERT(ename USING gbk)</InlineCode>{' '}
      转换后排序：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename FROM emp ORDER BY CONVERT(ename USING gbk);`}
    />
    <Paragraph>
      初学阶段记住一句话即可：
      <Text bold>
        字符的排序结果取决于字符集与 collation，不一定符合你直觉里的"拼音顺序"。
      </Text>
    </Paragraph>
    <Paragraph>
      <Text bold>(2) 按别名/表达式排序</Text>：<InlineCode>ORDER BY</InlineCode>{' '}
      可以直接用 <InlineCode>SELECT</InlineCode>{' '}
      里起的别名，因为排序在投影（选列）之后执行：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, salary * 12 AS year_salary
FROM emp
ORDER BY year_salary DESC;        -- 用别名排序，OK`}
    />
    <Table
      head={['ename', 'year_salary']}
      rows={[
        ['孙七', '180000'],
        ['李四', '144000'],
        ['王五', '114000'],
        ['张三', '96000'],
        ['赵六', '72000'],
      ]}
    />
    <Paragraph>
      <Text bold>
        (3) 🕳️ 常见坑：NULL 在排序里排哪儿？
      </Text>
    </Paragraph>
    <Paragraph>
      MySQL 里 <InlineCode>ORDER BY</InlineCode> 把{' '}
      <Text bold>
        <InlineCode>NULL</InlineCode> 当作"最小值"
      </Text>
      ：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        升序 <InlineCode>ASC</InlineCode> 时，<InlineCode>NULL</InlineCode> 排在
        <Text bold>最前面</Text>；
      </ListItem>
      <ListItem>
        降序 <InlineCode>DESC</InlineCode> 时，<InlineCode>NULL</InlineCode> 排在
        <Text bold>最后面</Text>。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="sql"
      code={`SELECT ename, bonus
FROM emp
ORDER BY bonus ASC;`}
    />
    <Paragraph>结果（两个 NULL 跑到了最前面）：</Paragraph>
    <Table
      head={['ename', 'bonus']}
      rows={[
        ['李四', 'NULL'],
        ['赵六', 'NULL'],
        ['张三', '1000'],
        ['王五', '2000'],
        ['孙七', '3000'],
      ]}
    />
    <Paragraph>
      如果你希望"有奖金的排前面、没奖金的垫底"，可以用{' '}
      <InlineCode>IFNULL</InlineCode> 把 NULL 换成一个值，或用{' '}
      <InlineCode>ISNULL</InlineCode> 辅助排序：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 让 NULL 当 0 处理后再降序：有奖金的在前，NULL 在最后
SELECT ename, bonus
FROM emp
ORDER BY IFNULL(bonus, 0) DESC;`}
    />
    <Paragraph>
      <Text bold>
        (4) 🕳️ 常见坑：<InlineCode>ORDER BY 1</InlineCode>{' '}
        是按"第几列"排，不是按数字 1
      </Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, salary FROM emp ORDER BY 2 DESC;  -- 按第 2 列(salary)降序`}
    />
    <Paragraph>
      这种"用列序号排序"的写法可读性差、改 SELECT 列时极易出错，
      <Text bold>不推荐</Text>，了解即可。
    </Paragraph>
  </article>
);

export default index;
