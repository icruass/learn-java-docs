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
    <Title>多对多与一对一</Title>

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
  </article>
);

export default index;
