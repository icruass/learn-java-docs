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
    <Title>多表关系：一对多、多对多、一对一的设计与实现</Title>

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

    <Divider />

    <Subtitle>三、多对多的实现（中间表）</Subtitle>

    <Heading3>3.1 关系分析</Heading3>
    <Paragraph>
      以「学生 <InlineCode>student</InlineCode>」和「课程 <InlineCode>course</InlineCode>」为例：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        一个<Text bold>学生</Text>可以选多门<Text bold>课程</Text>；
      </ListItem>
      <ListItem>
        一门<Text bold>课程</Text>也可以被多个<Text bold>学生</Text>选。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      两个方向都是「多」，所以是<Text bold>多对多</Text>。
    </Paragraph>

    <Heading3>3.2 为什么必须引入「中间表」</Heading3>
    <Paragraph>
      多对多没法像一对多那样，在某一方直接加一个外键列——因为一个学生选了好几门课，一个字段塞不下多个课程 id（一个学生对多门课、一门课对多个学生，加在哪边都装不下）。
    </Paragraph>
    <Paragraph>
      解决办法：<Text bold>新建一张「中间表」（也叫关联表 / 连接表）</Text>，专门记录「谁选了什么」。这张表通常<Text bold>只放两个外键</Text>：一个指向学生，一个指向课程。原来的「学生选课程」这个多对多，就被拆成了<Text bold>两个一对多</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      code={` student (多)        student_course (中间表)        course (多)
+----+------+      +-----+-----+                  +----+----------+
| id | name |◄─────┤ sid | cid ├─────────────────►| id | cname    |
+----+------+      +-----+-----+                  +----+----------+
| 1  | 小明 |      |  1  |  1  |                   | 1  | Java     |
| 2  | 小红 |      |  1  |  2  |                   | 2  | MySQL    |
| 3  | 小刚 |      |  2  |  1  |                   | 3  | 前端     |
+----+------+      |  2  |  3  |                   +----+----------+
                   |  3  |  2  |
                   +-----+-----+
   一个学生 ──多──► 多条选课记录 ◄──多── 一门课程`}
    />
    <Callout type="tip">
      <Text bold>核心口诀：多对多 = 中间表，中间表 = 两方主键各引一个外键。</Text>
    </Callout>

    <Heading3>3.3 中间表的主键怎么设？—— 联合主键</Heading3>
    <Paragraph>
      中间表的 <InlineCode>(sid, cid)</InlineCode> 这一对，应该是<Text bold>唯一</Text>的：同一个学生不应该把同一门课重复选两次。最自然的做法是把 <InlineCode>sid</InlineCode> 和 <InlineCode>cid</InlineCode> 两列<Text bold>合起来当主键</Text>，这叫<Text bold>联合主键（复合主键）</Text>。
    </Paragraph>
    <Paragraph>联合主键的语法：</Paragraph>
    <CodeBlock
      language="text"
      code={`PRIMARY KEY (列1, 列2)`}
    />
    <Paragraph>
      它表示「列1 + 列2 的<Text bold>组合</Text>不能重复」，单独某一列是可以重复的（<InlineCode>sid=1</InlineCode> 可以出现多次，只要搭配的 <InlineCode>cid</InlineCode> 不同）。
    </Paragraph>

    <Heading3>3.4 完整建表演示</Heading3>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

-- 学生表
CREATE TABLE student (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20)
);

-- 课程表
CREATE TABLE course (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  cname VARCHAR(20)
);

-- 中间表：学生选课
CREATE TABLE student_course (
  sid INT,                              -- 外键 -> student.id
  cid INT,                              -- 外键 -> course.id
  PRIMARY KEY (sid, cid),               -- 联合主键：同一学生不能重复选同一门课
  CONSTRAINT fk_sc_student FOREIGN KEY (sid) REFERENCES student(id),
  CONSTRAINT fk_sc_course  FOREIGN KEY (cid) REFERENCES course(id)
);`}
    />
    <Paragraph>灌入数据：</Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO student (name) VALUES ('小明'), ('小红'), ('小刚');
INSERT INTO course (cname) VALUES ('Java'), ('MySQL'), ('前端');

-- 小明选了 Java、MySQL；小红选了 Java、前端；小刚选了 MySQL
INSERT INTO student_course (sid, cid) VALUES
  (1, 1), (1, 2),
  (2, 1), (2, 3),
  (3, 2);`}
    />
    <Paragraph>
      <InlineCode>student_course</InlineCode> 表内容：
    </Paragraph>
    <Table
      head={['sid', 'cid']}
      rows={[
        ['1', '1'],
        ['1', '2'],
        ['2', '1'],
        ['2', '3'],
        ['3', '2'],
      ]}
    />

    <Heading3>3.5 验证联合主键与外键的保护</Heading3>

    <Heading4>演示 1：重复选课 → 被联合主键拦截</Heading4>
    <CodeBlock
      language="sql"
      code={`-- 小明(1)已经选过 Java(1)，再选一次
INSERT INTO student_course (sid, cid) VALUES (1, 1);`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>（报错）：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`ERROR 1062 (23000): Duplicate entry '1-1' for key 'student_course.PRIMARY'`}
    />
    <Paragraph>
      <InlineCode>(1,1)</InlineCode> 这个组合已存在，联合主键不允许重复，避免了同一学生重复选同一门课。
    </Paragraph>

    <Heading4>演示 2：选一门不存在的课 → 被外键拦截</Heading4>
    <CodeBlock
      language="sql"
      code={`-- 没有 id=99 的课程
INSERT INTO student_course (sid, cid) VALUES (1, 99);`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>（报错）：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails
... FOREIGN KEY (\`cid\`) REFERENCES \`course\` (\`id\`)`}
    />

    <Heading4>验证查询：小明选了哪些课？</Heading4>
    <CodeBlock
      language="sql"
      code={`SELECT s.name, c.cname
FROM student s
JOIN student_course sc ON s.id = sc.sid
JOIN course c          ON c.id = sc.cid
WHERE s.name = '小明';`}
    />
    <Table
      head={['name', 'cname']}
      rows={[
        ['小明', 'Java'],
        ['小明', 'MySQL'],
      ]}
    />
    <Callout type="tip" title="提示：中间表能不能加自己的字段？">
      <Paragraph>
        完全可以。很多业务需要在「关联」上记录额外信息，比如选课表加一列「成绩 <InlineCode>score</InlineCode>」、「选课时间 <InlineCode>enroll_date</InlineCode>」。这时中间表就成了一个有自身属性的实体表。例如：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`CREATE TABLE student_course (
  sid   INT,
  cid   INT,
  score DOUBLE,                        -- 该学生该门课的成绩
  PRIMARY KEY (sid, cid),
  CONSTRAINT fk_sc_student FOREIGN KEY (sid) REFERENCES student(id),
  CONSTRAINT fk_sc_course  FOREIGN KEY (cid) REFERENCES course(id)
);`}
      />
    </Callout>
    <Callout type="danger" title="常见坑：联合主键的列顺序与重复定义">
      <UnorderedList>
        <ListItem>
          <InlineCode>PRIMARY KEY (sid, cid)</InlineCode> 与 <InlineCode>PRIMARY KEY (cid, sid)</InlineCode> 在「唯一性约束」上等价，但<Text bold>底层索引的排序方向不同</Text>，会影响按某列查询的效率（这与索引最左前缀有关，后续索引章节会讲）。一般把更常用作查询条件的列放前面。
        </ListItem>
        <ListItem>
          一张表<Text bold>只能有一个主键</Text>。如果已经用 <InlineCode>PRIMARY KEY (sid, cid)</InlineCode> 做了联合主键，就不要再给 <InlineCode>sid</InlineCode> 单独加 <InlineCode>PRIMARY KEY</InlineCode>，否则报错。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>四、一对一的实现</Subtitle>

    <Heading3>4.1 关系分析与「为什么需要一对一」</Heading3>
    <Paragraph>
      以「人 <InlineCode>person</InlineCode>」和「身份证 <InlineCode>card</InlineCode>」为例：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        一个<Text bold>人</Text>只有一张<Text bold>身份证</Text>；
      </ListItem>
      <ListItem>
        一张<Text bold>身份证</Text>只属于一个<Text bold>人</Text>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      两个方向都是「一」，这就是<Text bold>一对一</Text>。
    </Paragraph>
    <Paragraph>
      你可能会问：既然一对一，干嘛不直接把身份证号塞进 <InlineCode>person</InlineCode> 表当一个字段？确实可以。一对一独立成两张表，通常是出于这两类考虑：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>垂直拆分、提升性能</Text>：把「不常用 / 体积大」的字段拆出去。比如用户表 <InlineCode>user</InlineCode> 里有头像 <InlineCode>BLOB</InlineCode>、长简介 <InlineCode>TEXT</InlineCode> 等大字段，平时只查用户名、登录，没必要每次都把大字段一起读出来。拆成 <InlineCode>user</InlineCode>（高频小字段）+ <InlineCode>user_detail</InlineCode>（低频大字段），一对一关联。
      </ListItem>
      <ListItem>
        <Text bold>逻辑清晰 / 解耦</Text>：人和证件本就是两个独立概念，分开建表更符合现实建模。
      </ListItem>
    </OrderedList>

    <Heading3>4.2 方案一：外键 + UNIQUE（推荐，最灵活）</Heading3>
    <Paragraph>
      思路：在任意一方加外键指向另一方，<Text bold>并给这个外键列加上 <InlineCode>UNIQUE</InlineCode> 唯一约束</Text>。
    </Paragraph>
    <Paragraph>
      为什么要 <InlineCode>UNIQUE</InlineCode>？普通外键实现的是「一对多」（多个 <InlineCode>card</InlineCode> 可以指向同一个 <InlineCode>person</InlineCode>）。给外键加上 <InlineCode>UNIQUE</InlineCode>，就强制「一个 <InlineCode>person</InlineCode> 最多被一个 <InlineCode>card</InlineCode> 引用」，于是「一对多」被收窄成了「<Text bold>一对一</Text>」。
    </Paragraph>
    <Callout type="tip">
      <Text bold>核心口诀：一对一 = 一对多 + 外键列加 UNIQUE。</Text>
    </Callout>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

-- 人表
CREATE TABLE person (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20)
);

-- 身份证表：外键 person_id 指向 person，并加 UNIQUE
CREATE TABLE card (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  number    VARCHAR(20),                     -- 身份证号
  person_id INT UNIQUE,                      -- 外键 + 唯一：保证一个人最多一张证
  CONSTRAINT fk_card_person FOREIGN KEY (person_id) REFERENCES person(id)
);

INSERT INTO person (name) VALUES ('张三'), ('李四');
INSERT INTO card (number, person_id) VALUES ('110101...001', 1), ('110101...002', 2);`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：建表与插入成功。<InlineCode>person</InlineCode> 与 <InlineCode>card</InlineCode> 一一对应：
    </Paragraph>
    <Table
      head={['person.id', 'name', 'card.number', 'card.person_id']}
      rows={[
        ['1', '张三', '110101...001', '1'],
        ['2', '李四', '110101...002', '2'],
      ]}
    />

    <Heading4>演示：同一个人办第二张证 → 被 UNIQUE 拦截</Heading4>
    <CodeBlock
      language="sql"
      code={`-- 张三(person_id=1)已有一张证，再插一张指向他
INSERT INTO card (number, person_id) VALUES ('110101...003', 1);`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>（报错）：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`ERROR 1062 (23000): Duplicate entry '1' for key 'card.person_id'`}
    />
    <Paragraph>
      <InlineCode>person_id=1</InlineCode> 已存在，<InlineCode>UNIQUE</InlineCode> 不允许重复，从而保证了「一对一」。如果去掉 <InlineCode>UNIQUE</InlineCode>，这条插入就会成功，关系立刻退化成「一对多」。
    </Paragraph>

    <Heading3>4.3 方案二：共享主键</Heading3>
    <Paragraph>
      思路：让 <InlineCode>card</InlineCode> 表<Text bold>不用自增主键</Text>，而是直接把 <InlineCode>person.id</InlineCode> 同时当作 <InlineCode>card</InlineCode> 的主键<Text bold>和</Text>外键。两张表的主键值完全一致，天然一一对应。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 先删掉方案一的 card 重新演示（注意 card 是子表，可直接删）
DROP TABLE IF EXISTS card;

CREATE TABLE card (
  id     INT PRIMARY KEY,        -- 既是主键，也是外键，不自增；其值 = person.id
  number VARCHAR(20),
  CONSTRAINT fk_card_person FOREIGN KEY (id) REFERENCES person(id)
);

-- 插入时 id 必须等于已存在的 person.id
INSERT INTO card (id, number) VALUES (1, '110101...001'), (2, '110101...002');`}
    />
    <UnorderedList>
      <ListItem>
        因为 <InlineCode>card.id</InlineCode> 是主键，天生唯一 → 一个 <InlineCode>person</InlineCode> 不可能对应两张 <InlineCode>card</InlineCode>；
      </ListItem>
      <ListItem>
        因为 <InlineCode>card.id</InlineCode> 又是指向 <InlineCode>person.id</InlineCode> 的外键 → <InlineCode>card</InlineCode> 必须挂在一个真实存在的 <InlineCode>person</InlineCode> 上。
      </ListItem>
      <ListItem>两者结合，自动构成严格的一对一。</ListItem>
    </UnorderedList>

    <Heading4>两种方案对比</Heading4>
    <Table
      head={['维度', '方案一：外键 + UNIQUE', '方案二：共享主键']}
      rows={[
        ['表结构', '子表有独立自增主键 id，外键列 person_id 另设', '子表主键即外键，无独立主键'],
        ['灵活性', '高，子表可独立存在再关联，外键也可临时为 NULL', '低，子表行必须依附于主表行'],
        ['节省字段', '多一个外键列', '主键外键合一，更省'],
        ['常见程度', '更常用，推荐', '较少，用于强依赖场景'],
      ]}
    />
    <Callout type="tip" title="提示">
      实际开发中，一对一<Text bold>方案一（外键 + UNIQUE）用得最多</Text>，因为它最灵活、最直观。方案二适合「子表必然依附主表、且永远一一对应」的强绑定场景。
    </Callout>

    <Divider />

    <Subtitle>五、综合案例：商品-分类-订单-用户的多表设计</Subtitle>
    <Paragraph>
      学完三种关系，我们用一个贴近真实的小型电商业务，把它们<Text bold>综合</Text>串起来。这才是设计能力的真正考验：先做关系分析，画出关系图，再落地建表 SQL。
    </Paragraph>

    <Heading3>5.1 需求与实体</Heading3>
    <Paragraph>业务描述（电商最小模型）：</Paragraph>
    <UnorderedList>
      <ListItem>
        系统有若干<Text bold>用户（user）</Text>；
      </ListItem>
      <ListItem>
        有若干<Text bold>商品（product）</Text>，每个商品属于一个<Text bold>分类（category）</Text>，比如「手机」「图书」；
      </ListItem>
      <ListItem>
        用户可以下<Text bold>订单（orders）</Text>，一个订单由某个用户创建；
      </ListItem>
      <ListItem>
        一个订单里可以买多种商品，一种商品也能出现在多个订单里（需要记录每种商品买了几件）。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      抽取出 5 个实体：<InlineCode>user</InlineCode>（用户）、<InlineCode>category</InlineCode>（分类）、<InlineCode>product</InlineCode>（商品）、<InlineCode>orders</InlineCode>（订单）、<InlineCode>order_item</InlineCode>（订单明细，即订单与商品的中间表）。
    </Paragraph>
    <Callout type="danger" title="常见坑：表名别用 order">
      <InlineCode>ORDER</InlineCode> 是 SQL 关键字（<InlineCode>ORDER BY</InlineCode>），直接用作表名会引发语法歧义。通常改用 <InlineCode>orders</InlineCode> 或 <InlineCode>t_order</InlineCode>。本案例用 <InlineCode>orders</InlineCode>。
    </Callout>

    <Heading3>5.2 关系分析（挨个判断）</Heading3>
    <Table
      head={['实体 A', '实体 B', 'A 的一个对应 B 几个', 'B 的一个对应 A 几个', '结论', '实现']}
      rows={[
        ['category 分类', 'product 商品', '一个分类有多个商品', '一个商品属一个分类', '一对多', 'product 加外键 category_id'],
        ['user 用户', 'orders 订单', '一个用户有多个订单', '一个订单属一个用户', '一对多', 'orders 加外键 user_id'],
        ['orders 订单', 'product 商品', '一个订单含多种商品', '一种商品在多个订单中', '多对多', '中间表 order_item（含数量）'],
      ]}
    />

    <Heading3>5.3 关系图（ER 草图）</Heading3>
    <CodeBlock
      language="text"
      code={`                    +------------+
                    |  category  |  分类
                    +------------+
                          ▲ 1
                          │  一对多
                          │ *
   +--------+        +------------+        +-------------+        +--------+
   |  user  | 1    * |   orders   | 1    * | order_item  | *    1 |product |
   |  用户  |───────►|   订单     |───────►|  订单明细   |◄───────| 商品   |
   +--------+ 一对多 +------------+ 一对多  +-------------+ 多对多 +--------+
        user_id              orders_id          product_id   (中间表把
                                                              订单↔商品
                                                              的多对多
                                                              拆成两个一对多)`}
    />
    <Paragraph>读图要点：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>category → product</InlineCode>、<InlineCode>user → orders</InlineCode> 都是普通<Text bold>一对多</Text>（外键在「多」方）；
      </ListItem>
      <ListItem>
        <InlineCode>orders ↔ product</InlineCode> 是<Text bold>多对多</Text>，被中间表 <InlineCode>order_item</InlineCode> 拆成「orders 一对多 order_item」「product 一对多 order_item」两段；
      </ListItem>
      <ListItem>
        <InlineCode>order_item</InlineCode> 额外携带业务字段 <InlineCode>quantity</InlineCode>（数量）、<InlineCode>price</InlineCode>（下单时单价快照）。
      </ListItem>
    </UnorderedList>

    <Heading3>5.4 建表 SQL（注意建表顺序：被引用者在前）</Heading3>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

-- 1. 分类表（被 product 引用，先建）
CREATE TABLE category (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  cname VARCHAR(30) NOT NULL                 -- 分类名，如 手机/图书
);

-- 2. 用户表（被 orders 引用，先建）
CREATE TABLE user (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(32) NOT NULL UNIQUE,      -- 用户名唯一
  password VARCHAR(32) NOT NULL
);

-- 3. 商品表（多对一 -> category）
CREATE TABLE product (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  pname       VARCHAR(50) NOT NULL,          -- 商品名
  price       DECIMAL(10,2) NOT NULL,        -- 单价（金额用 DECIMAL，不用 DOUBLE）
  category_id INT,                           -- 外键 -> category.id
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category(id)
);

-- 4. 订单表（多对一 -> user）
CREATE TABLE orders (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  order_no    VARCHAR(32) NOT NULL UNIQUE,   -- 订单号
  user_id     INT,                           -- 外键 -> user.id
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES user(id)
);

-- 5. 订单明细中间表（orders <-> product 多对多，带数量）
CREATE TABLE order_item (
  orders_id  INT,                            -- 外键 -> orders.id
  product_id INT,                            -- 外键 -> product.id
  quantity   INT NOT NULL DEFAULT 1,         -- 购买数量
  price      DECIMAL(10,2) NOT NULL,         -- 下单时单价快照
  PRIMARY KEY (orders_id, product_id),       -- 联合主键：同一订单同一商品只一行
  CONSTRAINT fk_oi_orders  FOREIGN KEY (orders_id)  REFERENCES orders(id),
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES product(id)
);`}
    />

    <Heading3>5.5 灌入演示数据并验证</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 分类
INSERT INTO category (cname) VALUES ('手机'), ('图书');
-- 用户
INSERT INTO user (username, password) VALUES ('zhangsan','123456'), ('lisi','abcdef');
-- 商品（手机类 2 个，图书类 1 个）
INSERT INTO product (pname, price, category_id) VALUES
  ('小米手机', 1999.00, 1),
  ('华为手机', 4999.00, 1),
  ('MySQL实战', 89.00, 2);
-- 订单（zhangsan 下了 1 个订单）
INSERT INTO orders (order_no, user_id) VALUES ('NO20260607001', 1);
-- 订单明细：该订单买了 1 台小米手机、2 本 MySQL实战
INSERT INTO order_item (orders_id, product_id, quantity, price) VALUES
  (1, 1, 1, 1999.00),
  (1, 3, 2, 89.00);`}
    />
    <Paragraph>验证：查出 zhangsan 这张订单买了什么、各花了多少钱：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT u.username,
       o.order_no,
       p.pname,
       oi.quantity,
       oi.price,
       oi.quantity * oi.price AS subtotal      -- 该商品小计
FROM orders o
JOIN user        u  ON o.user_id    = u.id
JOIN order_item  oi ON oi.orders_id = o.id
JOIN product     p  ON oi.product_id = p.id
WHERE o.order_no = 'NO20260607001';`}
    />
    <Table
      head={['username', 'order_no', 'pname', 'quantity', 'price', 'subtotal']}
      rows={[
        ['zhangsan', 'NO20260607001', '小米手机', '1', '1999.00', '1999.00'],
        ['zhangsan', 'NO20260607001', 'MySQL实战', '2', '89.00', '178.00'],
      ]}
    />
    <Paragraph>
      可以看到，5 张表通过 2 个一对多 + 1 个多对多，把「谁、买了什么、买了几件、花了多少」完整且无冗余地表达了出来。这就是多表关系设计的威力。
    </Paragraph>
    <Callout type="tip" title="提示：为什么 order_item 要存 price 快照？">
      商品价格会变动。订单一旦生成，里面的成交价就该「定格」，不能因为日后商品涨价/降价而改变历史订单金额。所以下单时把当时单价复制一份存进明细表——这是「快照」思想，是设计中常见的一个深坑（直接 JOIN <InlineCode>product.price</InlineCode> 算历史订单是错误的）。
    </Callout>

    <Divider />

    <Subtitle>六、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>为什么拆表</Text>：单张大表会造成数据冗余，引发<Text bold>插入异常、更新异常、删除异常</Text>三大问题。原则——<Text bold>每个事实只存一处</Text>，再用关系把数据连回来。
      </ListItem>
      <ListItem>
        <Text bold>三种关系一句话总结</Text>：
        <Table
          head={['关系', '判断', '实现']}
          rows={[
            ['一对多 / 多对一', '一边多、一边一', '外键加在「多」的一方，指向「一」方主键'],
            ['多对多', '两边都多', '加中间表，含两个外键；常用联合主键 PRIMARY KEY(a,b) 防重复'],
            ['一对一', '两边都一', '方案一：外键 + UNIQUE（推荐）；方案二：共享主键'],
          ]}
        />
      </ListItem>
      <ListItem>
        <Text bold>外键约束</Text>保障参照完整性：外键值要么为 NULL，要么必须真实存在于主表；可配 <InlineCode>ON DELETE/UPDATE</InlineCode> 的 <InlineCode>RESTRICT / CASCADE / SET NULL</InlineCode> 策略。
      </ListItem>
      <ListItem>
        <Text bold>建表顺序</Text>：先主表后子表；<Text bold>删除顺序</Text>相反，先子表后主表。
      </ListItem>
      <ListItem>
        <Text bold>设计流程</Text>：拆实体 → 两两判断关系方向 → 一对多在多方加外键、多对多加中间表、一对一加 UNIQUE → 注意金额用 <InlineCode>DECIMAL</InlineCode>、订单存价格快照、避开 <InlineCode>order</InlineCode> 等关键字表名。
      </ListItem>
    </UnorderedList>

    <Heading3>常见面试 / 易错问答</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>问：多对多为什么不能直接加外键？</Text>
        <br />
        答：因为两个方向都是「多」，任一方加单个外键列都装不下多个对应 id，必须用中间表把它拆成两个一对多。
      </ListItem>
      <ListItem>
        <Text bold>问：一对一和一对多在实现上差一个什么？</Text>
        <br />
        答：差一个 <InlineCode>UNIQUE</InlineCode>。一对一就是「外键加在某一方并设 <InlineCode>UNIQUE</InlineCode>」，去掉 <InlineCode>UNIQUE</InlineCode> 就退化为一对多。
      </ListItem>
      <ListItem>
        <Text bold>问：外键约束有什么副作用，生产环境一定要用吗？</Text>
        <br />
        答：外键会带来额外的锁与校验开销，分库分表时也难维护。许多互联网团队选择不建物理外键，仅保留逻辑外键字段，由应用层保证一致性。学习阶段建议都加上，便于理解约束作用。
      </ListItem>
      <ListItem>
        <Text bold>问：删表为什么有时报「a foreign key constraint fails」？</Text>
        <br />
        答：要删的是被引用的主表，且子表里还有引用它的行。需先删/解除子表的引用，或建外键时设 <InlineCode>ON DELETE CASCADE/SET NULL</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>问：中间表的主键怎么设最合理？</Text>
        <br />
        答：通常用两个外键列做联合主键 <InlineCode>PRIMARY KEY (sid, cid)</InlineCode>，既能防止重复关联，又天然为关联建立了索引。
      </ListItem>
      <ListItem>
        <Text bold>问：金额字段为什么推荐 <InlineCode>DECIMAL</InlineCode> 而不是 <InlineCode>DOUBLE</InlineCode>？</Text>
        <br />
        答：<InlineCode>DOUBLE</InlineCode> 是二进制浮点，存钱会有精度误差（如 0.1+0.2≠0.3）；<InlineCode>DECIMAL(10,2)</InlineCode> 是精确定点数，适合金额。（示例库 <InlineCode>emp.salary</InlineCode> 用 <InlineCode>DOUBLE</InlineCode> 是沿用历史教学数据，真实业务请用 <InlineCode>DECIMAL</InlineCode>。）
      </ListItem>
    </OrderedList>

    <Callout type="note" title="下一章预告">
      表已经按关系拆好了，怎么把它们「拼回去」一起查询？下一章《多表查询》将系统讲解<Text bold>内连接、外连接（左/右）、自连接、子查询</Text>——你会发现本章设计的每一个外键，正是连接查询时 <InlineCode>ON</InlineCode> 后面的连接条件。
    </Callout>
  </article>
);

export default index;
