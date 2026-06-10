import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Heading4,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>多表设计的必要性与一对多</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        前面几章我们一直在「单张表」里打转：建表、增删改查、约束、聚合、子查询……但真实业务里，数据从来不是孤立的——员工属于部门、学生选了课程、一个人有一张身份证。这些「谁属于谁」「谁关联谁」的关系，最终都要落到<Text bold>多张表之间的关系设计</Text>上。
      </Paragraph>
      <Paragraph>本章要解决三个问题：</Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>为什么</Text>不把所有数据塞进一张大表？（答案：消除冗余）
        </ListItem>
        <ListItem>
          现实世界的关系归纳为<Text bold>三类</Text>：一对一、一对多、多对多，它们各自<Text bold>怎么用 SQL 实现</Text>？
        </ListItem>
        <ListItem>
          如何把一个完整的小业务，<Text bold>从关系分析到建表 SQL</Text> 一步步落地？
        </ListItem>
      </OrderedList>
      <Paragraph>
        它是<Text bold>承上启下</Text>的关键一章：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>承上</Text>：用到了前面学的主键、外键、<InlineCode>UNIQUE</InlineCode>、<InlineCode>NOT NULL</InlineCode> 等约束知识；
        </ListItem>
        <ListItem>
          <Text bold>启下</Text>：下一章的「多表查询（连接查询 JOIN）」，本质就是把本章设计好的多张表「按关系拼回去查」。<Text bold>先有合理的表关系设计，才有干净高效的多表查询。</Text> 所以这一章是整个「多表」体系的地基，务必吃透。
        </ListItem>
      </UnorderedList>
      <Paragraph>
        全章沿用统一示例库 <InlineCode>db_learn</InlineCode>，并按需引入 <InlineCode>dept/emp</InlineCode>、<InlineCode>student/course/student_course</InlineCode>、<InlineCode>person/card</InlineCode> 等表。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、为什么要拆成多张表</Subtitle>

    <Heading3>1.1 一个反面教材：把所有信息塞进一张表</Heading3>
    <Paragraph>
      假设老板说：「我要管理员工，每个员工属于一个部门，给我建张表。」最朴素（也最糟糕）的做法是——一张大表全装下：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ❌ 反面教材：部门信息和员工信息混在一张表里
CREATE TABLE emp_bad (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  ename     VARCHAR(20),    -- 员工姓名
  salary    DOUBLE,         -- 工资
  dept_name VARCHAR(20),    -- 部门名称（直接写在员工行里）
  loc       VARCHAR(20)     -- 部门所在城市（直接写在员工行里）
);

INSERT INTO emp_bad (ename, salary, dept_name, loc) VALUES
  ('张三', 8000,  '研发部', '北京'),
  ('李四', 12000, '研发部', '北京'),
  ('王五', 9500,  '市场部', '上海'),
  ('赵六', 6000,  '市场部', '上海'),
  ('孙七', 15000, '财务部', '广州');`}
    />
    <Paragraph>查出来是这样：</Paragraph>
    <Table
      head={['id', 'ename', 'salary', 'dept_name', 'loc']}
      rows={[
        ['1', '张三', '8000', '研发部', '北京'],
        ['2', '李四', '12000', '研发部', '北京'],
        ['3', '王五', '9500', '市场部', '上海'],
        ['4', '赵六', '6000', '市场部', '上海'],
        ['5', '孙七', '15000', '财务部', '广州'],
      ]}
    />
    <Paragraph>看起来能用，但问题非常严重。</Paragraph>

    <Heading3>1.2 大表带来的三大「异常」</Heading3>
    <Paragraph>
      把同一份信息（部门名、城市）在多行里重复存，数据库术语叫<Text bold>数据冗余</Text>。冗余会引发三种典型异常：
    </Paragraph>
    <Table
      head={['异常类型', '描述', '在上表中的体现']}
      rows={[
        ['插入异常', '想存某信息却被迫连带存别的', '新成立一个「人事部（深圳）」，但还没招人，无法单独记录这个部门（emp_bad 至少要有一个员工才有行）'],
        ['更新异常', '改一处信息要改很多行，容易漏改', '「研发部」从北京搬到「天津」，要把所有研发部员工的 loc 全改一遍，漏改一行就数据不一致'],
        ['删除异常', '删数据时连带丢掉本不该丢的信息', '财务部只有孙七一人，删掉孙七，「财务部、广州」这个部门信息也跟着消失了'],
      ]}
    />
    <Callout type="tip" title="提示：冗余的本质">
      冗余 = 同一个事实被存了多份。一旦多份之间不一致，数据库就「自相矛盾」了。解决之道：<Text bold>每个事实只在一个地方存储一次</Text>——这正是「拆表」的核心动机。
    </Callout>

    <Heading3>1.3 正确做法：拆成两张表，用「关系」连起来</Heading3>
    <Paragraph>
      把「部门」这个独立概念抽出去单独建表，员工表里只保留一个「指针」——<InlineCode>dept_id</InlineCode>，指向它所属的部门：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ✅ 部门信息独立成表（每个部门只存一行）
CREATE TABLE dept (
  id        INT PRIMARY KEY AUTO_INCREMENT,  -- 部门编号
  dept_name VARCHAR(20),                     -- 部门名称
  loc       VARCHAR(20)                      -- 所在城市
);

-- ✅ 员工表里不再重复存部门名/城市，只存一个 dept_id 引用部门
CREATE TABLE emp (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  ename     VARCHAR(20),
  salary    DOUBLE,
  dept_id   INT                              -- 指向 dept.id
);`}
    />
    <Paragraph>这样：</Paragraph>
    <UnorderedList>
      <ListItem>
        部门信息只在 <InlineCode>dept</InlineCode> 表存一份 → 改部门城市只改一行，<Text bold>没有更新异常</Text>；
      </ListItem>
      <ListItem>
        没员工的部门照样能在 <InlineCode>dept</InlineCode> 里建一行 → <Text bold>没有插入异常</Text>；
      </ListItem>
      <ListItem>
        删光某部门的员工，<InlineCode>dept</InlineCode> 里的部门行还在 → <Text bold>没有删除异常</Text>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      而「张三属于研发部」这件事，通过 <InlineCode>emp.dept_id = dept.id</InlineCode> 这个<Text bold>关系</Text>来表达。把数据按关系拆开存，再用关系连回来——这就是关系型数据库（Relational Database）名字的由来。
    </Paragraph>

    <Heading3>1.4 三种关系总览</Heading3>
    <Paragraph>现实世界的实体之间，关系归纳起来只有三大类：</Paragraph>
    <Table
      head={['关系类型', '含义', '生活例子', '实现要点（先记结论，下文逐一展开）']}
      rows={[
        ['一对多 / 多对一', 'A 中一行 对应 B 中多行；B 中一行只对应 A 中一行', '一个部门有多个员工；一个员工只属于一个部门', '在「多」的一方加外键，指向「一」的一方主键'],
        ['多对多', 'A 中一行对应 B 中多行，同时 B 中一行也对应 A 中多行', '一个学生选多门课；一门课被多个学生选', '加一张中间表，含两个外键分别指向 A、B'],
        ['一对一', 'A 中一行只对应 B 中一行，反之亦然', '一个人对应一张身份证', '任一方加外键并设 UNIQUE；或两表共享主键'],
      ]}
    />
    <Callout type="tip" title="关键判断技巧">
      <Paragraph>分析两个实体 A、B 的关系，问两个方向各一遍即可：</Paragraph>
      <UnorderedList>
        <ListItem>「A 的一个，对应 B 的几个？」</ListItem>
        <ListItem>「B 的一个，对应 A 的几个？」</ListItem>
      </UnorderedList>
      <Paragraph>一边多一边一 → 一对多；两边都多 → 多对多；两边都一 → 一对一。</Paragraph>
    </Callout>
    <Paragraph>下面我们对三种关系逐一动手实现。</Paragraph>

    <Divider />

    <Subtitle>二、一对多 / 多对一的实现（最常见）</Subtitle>

    <Heading3>2.1 关系分析</Heading3>
    <Paragraph>
      以「部门 <InlineCode>dept</InlineCode>」和「员工 <InlineCode>emp</InlineCode>」为例：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        一个<Text bold>部门</Text>有多个<Text bold>员工</Text> → 一对多；
      </ListItem>
      <ListItem>
        一个<Text bold>员工</Text>只属于一个<Text bold>部门</Text> → 多对一。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      「一对多」和「多对一」是<Text bold>同一个关系的两种叫法</Text>，只是站的角度不同。它是实际开发中出现频率最高的关系。
    </Paragraph>

    <Heading3>2.2 实现原则：外键加在「多」的一方</Heading3>
    <Callout type="tip">
      <Text bold>核心口诀：外键建在「多」的一方，指向「一」的一方的主键。</Text>
    </Callout>
    <Paragraph>
      为什么不反过来（在 <InlineCode>dept</InlineCode> 里存员工）？因为「一」的一方（部门）对应「多」（多个员工），如果把员工存进部门行，一个字段塞不下多个员工，又会退化成冗余。而「多」的一方（员工）只对应「一」个部门，存一个 <InlineCode>dept_id</InlineCode> 刚刚好。
    </Paragraph>
    <CodeBlock
      language="text"
      code={`   dept (一)                         emp (多)
+----+-----------+        +----+-------+---------+
| id | dept_name |        | id | ename | dept_id |  ← 外键指向 dept.id
+----+-----------+        +----+-------+---------+
| 1  | 研发部    |◄───────┤ 1  | 张三  |    1    |
| 2  | 市场部    |◄──┐    │ 2  | 李四  |    1    |
| 3  | 财务部    |   │    │ 3  | 王五  |    2    |
+----+-----------+   └────┤ 4  | 赵六  |    2    |
                         │ 5  | 孙七  |    3    |
                         +----+-------+---------+`}
    />

    <Heading3>2.3 完整建表 + 外键演示（沿用统一示例数据）</Heading3>

    <Heading4>第一步：建「一」的一方（被引用的表必须先存在）</Heading4>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE IF NOT EXISTS db_learn DEFAULT CHARSET utf8mb4;
USE db_learn;

-- 部门表（一）
CREATE TABLE dept (
  id        INT PRIMARY KEY AUTO_INCREMENT,  -- 部门编号（主键）
  dept_name VARCHAR(20),                     -- 部门名称
  loc       VARCHAR(20)                      -- 所在城市
);

INSERT INTO dept (dept_name, loc) VALUES
  ('研发部','北京'),
  ('市场部','上海'),
  ('财务部','广州');`}
    />

    <Heading4>第二步：建「多」的一方，并加外键约束</Heading4>
    <Paragraph>外键约束的标准语法：</Paragraph>
    <CodeBlock
      language="text"
      code={`CONSTRAINT 外键名 FOREIGN KEY (本表的外键列) REFERENCES 主表(主表的主键列)`}
    />
    <Paragraph>逐项解释：</Paragraph>
    <Table
      head={['部分', '含义']}
      rows={[
        ['CONSTRAINT 外键名', '给这个外键约束起个名字（如 fk_emp_dept），便于以后删除/查看；可省略，省略时 MySQL 自动起名'],
        ['FOREIGN KEY (本表列)', '声明本表的哪一列是外键'],
        ['REFERENCES 主表(列)', '指明这个外键引用「哪张主表的哪一列」，被引用列必须是主键或唯一键'],
      ]}
    />
    <CodeBlock
      language="sql"
      code={`-- 员工表（多）
CREATE TABLE emp (
  id        INT PRIMARY KEY AUTO_INCREMENT,  -- 员工编号
  ename     VARCHAR(20),                     -- 姓名
  gender    CHAR(1),                         -- 性别 男/女
  salary    DOUBLE,                          -- 工资
  join_date DATE,                            -- 入职日期
  dept_id   INT,                             -- 所属部门（外键 -> dept.id）
  bonus     DOUBLE,                          -- 奖金（可能为 NULL）
  -- 外键约束：emp.dept_id 引用 dept.id
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
      <Text bold>执行结果</Text>：两张表建立成功，<InlineCode>emp</InlineCode> 表通过 <InlineCode>dept_id</InlineCode> 关联到 <InlineCode>dept</InlineCode>。简单验证一下关联效果（连接查询下一章细讲，这里先感受）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT e.ename, e.salary, d.dept_name, d.loc
FROM emp e
JOIN dept d ON e.dept_id = d.id;`}
    />
    <Table
      head={['ename', 'salary', 'dept_name', 'loc']}
      rows={[
        ['张三', '8000', '研发部', '北京'],
        ['李四', '12000', '研发部', '北京'],
        ['王五', '9500', '市场部', '上海'],
        ['赵六', '6000', '市场部', '上海'],
        ['孙七', '15000', '财务部', '广州'],
      ]}
    />
    <Paragraph>
      部门信息只在 <InlineCode>dept</InlineCode> 存了一份，却能精准地拼回每个员工，冗余被彻底消除。
    </Paragraph>

    <Heading3>2.4 外键约束到底「约束」了什么？</Heading3>
    <Paragraph>
      加了外键后，数据库会<Text bold>自动替你守护数据的一致性</Text>（这叫「参照完整性 / Referential Integrity」）。它强制保证：<Text bold><InlineCode>emp.dept_id</InlineCode> 的值，要么是 NULL，要么必须真实存在于 <InlineCode>dept.id</InlineCode> 中。</Text>
    </Paragraph>

    <Heading4>演示 1：插入一个不存在的部门 → 被拒绝</Heading4>
    <CodeBlock
      language="sql"
      code={`-- dept 表里没有 id=99 的部门
INSERT INTO emp (ename, gender, salary, dept_id) VALUES ('钱八','男', 7000, 99);`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>（报错）：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`ERROR 1452 (23000): Cannot add or update a child row:
a foreign key constraint fails (\`db_learn\`.\`emp\`, CONSTRAINT \`fk_emp_dept\`
FOREIGN KEY (\`dept_id\`) REFERENCES \`dept\` (\`id\`))`}
    />
    <Paragraph>数据库阻止了「员工挂到一个不存在的部门」这种脏数据。</Paragraph>

    <Heading4>演示 2：删除「还有员工」的部门 → 被拒绝</Heading4>
    <CodeBlock
      language="sql"
      code={`-- 研发部(id=1)下还有张三、李四
DELETE FROM dept WHERE id = 1;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>（报错）：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`ERROR 1451 (23000): Cannot delete or update a parent row:
a foreign key constraint fails (\`db_learn\`.\`emp\`, CONSTRAINT \`fk_emp_dept\`
FOREIGN KEY (\`dept_id\`) REFERENCES \`dept\` (\`id\`))`}
    />
    <Paragraph>数据库阻止了「删掉部门却留下一群没人管的员工」这种悬空引用。</Paragraph>
    <Callout type="danger" title="常见坑：建表顺序与删表顺序相反">
      <UnorderedList>
        <ListItem>
          <Text bold>建表</Text>：必须<Text bold>先建被引用的主表</Text>（<InlineCode>dept</InlineCode>），再建带外键的子表（<InlineCode>emp</InlineCode>）。反过来会报「主表不存在」。
        </ListItem>
        <ListItem>
          <Text bold>删表 / 删数据</Text>：顺序相反——必须<Text bold>先删子表</Text>（<InlineCode>emp</InlineCode>）或先解除引用，再删主表（<InlineCode>dept</InlineCode>）。否则触发上面演示 2 的错误。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>2.5 给已存在的表追加 / 删除外键</Heading3>
    <Paragraph>
      如果建表时忘了加外键，或想事后调整，可以用 <InlineCode>ALTER TABLE</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 追加外键（假设 emp 当初没写外键）
ALTER TABLE emp
  ADD CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id);

-- 删除外键（用建表时起的名字 fk_emp_dept）
ALTER TABLE emp DROP FOREIGN KEY fk_emp_dept;`}
    />
    <Callout type="tip" title="提示">
      删外键用的是约束名 <InlineCode>fk_emp_dept</InlineCode>，不是列名 <InlineCode>dept_id</InlineCode>。所以建外键时<Text bold>起个见名知意的名字</Text>（推荐格式 <InlineCode>fk_子表_主表</InlineCode>）很重要。
    </Callout>

    <Heading3>2.6 级联操作：ON DELETE / ON UPDATE</Heading3>
    <Paragraph>
      默认情况下，删除被引用的父行会被拒绝（如演示 2）。但有时业务希望「删了部门，该部门的员工 <InlineCode>dept_id</InlineCode> 自动置空」或「自动跟着删」，可以指定级联行为：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 重建外键，加上级联策略
ALTER TABLE emp DROP FOREIGN KEY fk_emp_dept;

ALTER TABLE emp
  ADD CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
  ON DELETE SET NULL      -- 删除部门时，把对应员工的 dept_id 设为 NULL
  ON UPDATE CASCADE;      -- 部门 id 变化时，员工的 dept_id 跟着改`}
    />
    <Paragraph>可选的策略：</Paragraph>
    <Table
      head={['策略', '行为（以 ON DELETE 为例）']}
      rows={[
        ['RESTRICT / NO ACTION', '默认。父行被引用时，拒绝删除/更新'],
        ['CASCADE', '级联：删父行 → 自动删掉所有引用它的子行'],
        ['SET NULL', '删父行 → 把子行的外键列设为 NULL（该列必须允许 NULL）'],
      ]}
    />
    <Callout type="warning" title="注意">
      <InlineCode>CASCADE</InlineCode> 很方便也很危险——删一个部门可能连带删掉几百个员工，且无提示。生产环境对级联删除要格外谨慎。
    </Callout>
    <Callout type="tip" title="提示：要不要建物理外键？">
      外键约束保证了数据一致性，但在高并发、分库分表场景下会带来锁和性能开销。很多互联网团队选择<Text bold>不建物理外键</Text>，仅在表设计上保留 <InlineCode>dept_id</InlineCode> 这个「逻辑外键」字段，由应用程序代码来保证一致性。<Text bold>学习阶段建议都加上物理外键</Text>，能直观看到约束的保护作用；工作中是否使用，按团队规范来。
    </Callout>
  </article>
);

export default index;
