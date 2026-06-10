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
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>数据库设计范式：1NF、2NF、3NF 详解</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        上一章我们学会了把数据拆成多张表、用主外键把它们关联起来。但马上会冒出一个问题：
        <Text bold>到底该拆到什么程度？</Text>{' '}
        一张表里放哪些列才算「设计得好」？拆得太碎查询麻烦，拆得太粗又会冗余混乱。
      </Paragraph>
      <Paragraph>
        数据库前辈们把「怎样设计才算合理」总结成了一套<Text bold>规范</Text>，叫做
        <Text bold>范式（Normal Form，NF）</Text>。本章要讲清楚三件事：
      </Paragraph>
      <OrderedList>
        <ListItem>
          范式到底是为了解决什么问题（答案：<Text bold>消除冗余、避免增删改异常</Text>）；
        </ListItem>
        <ListItem>
          第一范式 1NF、第二范式 2NF、第三范式 3NF <Text bold>各自要求什么</Text>
          ，怎么用例子判断一张表满不满足；
        </ListItem>
        <ListItem>
          工程实践中为什么有时又要<Text bold>反范式</Text>（故意冗余）。
        </ListItem>
      </OrderedList>
      <Paragraph>
        这一章是<Text bold>承上启下</Text>
        的：它把上一章「多表关系设计」上升到理论高度，告诉你拆表的依据；同时它是后面性能优化的基础——很多慢查询的根源就是表没设计好。本章沿用统一示例库{' '}
        <InlineCode>db_learn</InlineCode>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、为什么需要范式</Subtitle>

    <Heading3>1.1 从一个「什么都往里塞」的烂表说起</Heading3>
    <Paragraph>
      假设我们要管理「学生选课成绩」，图省事用一张大表全装下：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ❌ 反面教材：学生、课程、老师、成绩全揉在一张表
CREATE TABLE study_bad (
  sno       INT,            -- 学号
  sname     VARCHAR(20),    -- 学生姓名
  cno       INT,            -- 课程号
  cname     VARCHAR(20),    -- 课程名
  teacher   VARCHAR(20),    -- 任课老师
  teacher_tel VARCHAR(20),  -- 老师电话
  score     INT             -- 成绩
);

INSERT INTO study_bad VALUES
  (1,'张三',101,'数据库','王老师','13800000001',90),
  (1,'张三',102,'操作系统','李老师','13800000002',85),
  (2,'李四',101,'数据库','王老师','13800000001',78),
  (2,'李四',102,'操作系统','李老师','13800000002',88);`}
    />
    <Paragraph>查出来：</Paragraph>
    <Table
      head={['sno', 'sname', 'cno', 'cname', 'teacher', 'teacher_tel', 'score']}
      rows={[
        ['1', '张三', '101', '数据库', '王老师', '13800000001', '90'],
        ['1', '张三', '102', '操作系统', '李老师', '13800000002', '85'],
        ['2', '李四', '101', '数据库', '王老师', '13800000001', '78'],
        ['2', '李四', '102', '操作系统', '李老师', '13800000002', '88'],
      ]}
    />

    <Heading3>1.2 烂表带来的四种「异常」</Heading3>
    <Paragraph>
      仔细看会发现「数据库 / 王老师 / 13800000001」这一串信息被重复存了很多遍——这就是
      <Text bold>数据冗余</Text>。冗余会引发四种典型问题：
    </Paragraph>
    <Table
      head={['异常', '含义', '在上表中的体现']}
      rows={[
        ['数据冗余', '同一份数据重复存储，浪费空间', '王老师的电话存了 N 遍（每个选数据库的学生一行）'],
        ['更新异常', '改一处要改很多行，漏改就不一致', '王老师换电话，要 UPDATE 所有「数据库」行，漏一行就两个电话并存'],
        ['插入异常', '想插入 A 数据却被迫连带 B 数据', '新开一门「编译原理」课但还没人选，没法单独录入这门课（没有 sno/score 这行插不进去，主键还会冲突）'],
        ['删除异常', '删 B 数据时把不该删的 A 也删没了', '选「操作系统」的人全退课，删完这些行后，李老师的信息也随之消失了'],
      ]}
    />
    <Paragraph>
      <Text bold>范式就是为了系统性地消除这些异常而诞生的设计规则。</Text>
    </Paragraph>

    <Heading3>1.3 范式的层级关系</Heading3>
    <Paragraph>
      范式由低到高是逐级递进的、<Text bold>包含关系</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`1NF ⊃ 2NF ⊃ 3NF ⊃ BCNF ⊃ 4NF ⊃ 5NF`}
    />
    <UnorderedList>
      <ListItem>满足 2NF 的表，一定先满足 1NF；</ListItem>
      <ListItem>满足 3NF 的表，一定先满足 2NF；</ListItem>
      <ListItem>范式越高，冗余越小，但表越多、查询时连接越多。</ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>日常工作中，把表设计到第三范式（3NF）就足够了</Text>
      ，所以本章重点讲 1NF、2NF、3NF。
    </Paragraph>

    <Divider />

    <Subtitle>二、几个必须先搞懂的概念</Subtitle>
    <Paragraph>
      范式的定义里反复出现「函数依赖」「码」「主属性」这些术语，先用大白话讲清楚，否则后面看不懂。
    </Paragraph>

    <Heading3>2.1 函数依赖（Functional Dependency）</Heading3>
    <Callout type="note">
      <Text bold>如果知道了 A 就能唯一确定 B，就说 B 函数依赖于 A，记作 A → B。</Text>
    </Callout>
    <Paragraph>
      类比：知道了你的「身份证号」就能唯一确定你的「姓名」，所以{' '}
      <InlineCode>身份证号 → 姓名</InlineCode>。反过来不成立（同名的人很多）。
    </Paragraph>
    <Paragraph>在上面的烂表里：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>sno → sname</InlineCode>（知道学号就知道姓名）
      </ListItem>
      <ListItem>
        <InlineCode>cno → cname</InlineCode>（知道课程号就知道课程名）
      </ListItem>
      <ListItem>
        <InlineCode>cno → teacher</InlineCode>（这门课固定一个老师，知道课程号就知道老师）
      </ListItem>
      <ListItem>
        <InlineCode>teacher → teacher_tel</InlineCode>（知道老师就知道他电话）
      </ListItem>
      <ListItem>
        <InlineCode>(sno, cno) → score</InlineCode>（必须同时知道哪个学生、哪门课，才能确定成绩）
      </ListItem>
    </UnorderedList>

    <Heading3>2.2 完全函数依赖 vs 部分函数依赖</Heading3>
    <Paragraph>
      当依赖的「左边」是<Text bold>一组字段（联合）</Text>时，要进一步区分：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>完全函数依赖</Text>：B 依赖于 A 这<Text bold>整组</Text>
        字段，缺一个都不行。 例：<InlineCode>(sno, cno) → score</InlineCode>，光有 sno
        或光有 cno 都定不了成绩 → <Text bold>完全依赖</Text>。
      </ListItem>
      <ListItem>
        <Text bold>部分函数依赖</Text>：B 其实只依赖于 A 中的<Text bold>一部分</Text>
        字段。 例：<InlineCode>(sno, cno) → sname</InlineCode>，但实际上光靠{' '}
        <InlineCode>sno</InlineCode> 就能确定 <InlineCode>sname</InlineCode> 了，cno
        是多余的 → <Text bold>部分依赖</Text>。
      </ListItem>
    </UnorderedList>

    <Heading3>2.3 传递函数依赖</Heading3>
    <Callout type="note">
      A → B，B → C，且 B 不能反推 A，那么 A → C 就是<Text bold>传递依赖</Text>。
    </Callout>
    <Paragraph>
      例：<InlineCode>sno → teacher</InlineCode>（间接）、
      <InlineCode>teacher → teacher_tel</InlineCode>，于是{' '}
      <InlineCode>sno → teacher_tel</InlineCode> 是
      <Text bold>通过 teacher 绕了一道</Text>的传递依赖。
    </Paragraph>

    <Heading3>2.4 码（Key）与主属性</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>码（候选码）</Text>：能<Text bold>唯一确定一整行</Text>
        的最小字段组合。上面的烂表里，能定位一行的是{' '}
        <InlineCode>(sno, cno)</InlineCode>（学号+课程号），所以{' '}
        <InlineCode>(sno, cno)</InlineCode> 是码。
      </ListItem>
      <ListItem>
        <Text bold>主码（主键）</Text>：从候选码里选一个当主键。
      </ListItem>
      <ListItem>
        <Text bold>主属性</Text>：包含在任何一个码里的字段，如{' '}
        <InlineCode>sno</InlineCode>、<InlineCode>cno</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>非主属性</Text>：不在任何码里的字段，如{' '}
        <InlineCode>sname</InlineCode>、<InlineCode>cname</InlineCode>、
        <InlineCode>teacher</InlineCode>、<InlineCode>teacher_tel</InlineCode>、
        <InlineCode>score</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      记住这句话，后面 2NF/3NF 的定义都围绕它转：
      <Text bold>范式约束的核心，就是「非主属性」该怎样依赖「码」。</Text>
    </Callout>

    <Divider />

    <Subtitle>三、第一范式 1NF：列不可再分（原子性）</Subtitle>
    <Callout type="note">
      <Text bold>
        定义：表中每一列都是不可再分的「原子」数据项，不能是集合、数组或可拆分的复合值。
      </Text>
    </Callout>

    <Heading3>3.1 反例与修正</Heading3>
    <Paragraph>
      <Text bold>反例 1：一列存了多个值</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ❌ 违反 1NF：phone 列存了多个电话，用逗号隔开
CREATE TABLE contact_bad (
  id    INT,
  name  VARCHAR(20),
  phone VARCHAR(100)   -- '13800000001,13800000002'
);`}
    />
    <Paragraph>
      问题：想查「有几个人用了某个号码」「按第二个号码排序」都极其困难，得用字符串函数硬切。
    </Paragraph>
    <Paragraph>
      <Text bold>反例 2：列还能再分</Text>
    </Paragraph>
    <Table
      head={['id', 'name', 'address']}
      rows={[['1', '张三', '广东省深圳市南山区科技路1号']]}
    />
    <Paragraph>
      如果业务经常要按「省」「市」筛选，那 <InlineCode>address</InlineCode>{' '}
      就是可再分的，违反 1NF。
    </Paragraph>
    <Paragraph>
      <Text bold>修正</Text>：把可再分的拆成独立列（或独立表）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ✅ 满足 1NF
CREATE TABLE contact_ok (
  id       INT PRIMARY KEY,
  name     VARCHAR(20),
  province VARCHAR(20),  -- 省
  city     VARCHAR(20),  -- 市
  district VARCHAR(20),  -- 区
  street   VARCHAR(50)   -- 详细地址
);`}
    />

    <Heading3>3.2 1NF 是相对的</Heading3>
    <Paragraph>
      「原子不可分」要结合<Text bold>业务需求</Text>判断：
    </Paragraph>
    <UnorderedList>
      <ListItem>如果业务从不拆地址，把整个地址存一列也可以接受；</ListItem>
      <ListItem>如果业务要按省市筛选，就必须拆开。</ListItem>
    </UnorderedList>
    <Callout type="warning">
      <Text bold>关系型数据库天生要求 1NF</Text>
      ——你在 MySQL 里建表，每个单元格本来就只能放一个标量值，所以「不满足 1NF」往往不是语法问题，而是
      <Text bold>设计观念问题</Text>（明明该拆却硬塞）。
    </Callout>

    <Divider />

    <Subtitle>四、第二范式 2NF：消除部分依赖</Subtitle>
    <Callout type="note">
      <Text bold>
        定义：在满足 1NF
        的前提下，每一个「非主属性」都必须「完全函数依赖」于码（不能只依赖码的一部分）。
      </Text>
    </Callout>
    <Paragraph>
      2NF 只在<Text bold>码是联合字段（多列组成）</Text>
      时才有讨论意义；如果主键是单列，自动满足 2NF。
    </Paragraph>

    <Heading3>4.1 用选课表演示</Heading3>
    <Paragraph>
      回到 1.1 的烂表，它的码是 <InlineCode>(sno, cno)</InlineCode>
      。逐个检查非主属性：
    </Paragraph>
    <Table
      head={['非主属性', '实际依赖', '是否完全依赖 (sno,cno)']}
      rows={[
        ['sname', 'sno → sname', '❌ 只依赖 sno（部分依赖）'],
        ['cname', 'cno → cname', '❌ 只依赖 cno（部分依赖）'],
        ['teacher', 'cno → teacher', '❌ 只依赖 cno（部分依赖）'],
        ['teacher_tel', 'cno→teacher→tel', '❌ 部分 + 传递'],
        ['score', '(sno,cno) → score', '✅ 完全依赖'],
      ]}
    />
    <Paragraph>
      存在大量部分依赖 → <Text bold>不满足 2NF</Text>。这正是冗余的根源。
    </Paragraph>

    <Heading3>4.2 拆表使其满足 2NF</Heading3>
    <Paragraph>按「依赖谁就跟谁走」的原则拆开：</Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ✅ 学生表：sno 能决定的放一起
CREATE TABLE student (
  sno   INT PRIMARY KEY,
  sname VARCHAR(20)
);

-- ✅ 课程表：cno 能决定的放一起（先把老师也放进来，3NF 会继续优化）
CREATE TABLE course (
  cno     INT PRIMARY KEY,
  cname   VARCHAR(20),
  teacher VARCHAR(20),
  teacher_tel VARCHAR(20)
);

-- ✅ 选课成绩表：只剩完全依赖 (sno,cno) 的 score
CREATE TABLE sc (
  sno   INT,
  cno   INT,
  score INT,
  PRIMARY KEY (sno, cno),                 -- 联合主键
  FOREIGN KEY (sno) REFERENCES student(sno),
  FOREIGN KEY (cno) REFERENCES course(cno)
);`}
    />
    <Paragraph>
      现在：学生姓名只存一份、课程信息只存一份，更新/插入/删除异常基本消失。
    </Paragraph>

    <Divider />

    <Subtitle>五、第三范式 3NF：消除传递依赖</Subtitle>
    <Callout type="note">
      <Text bold>
        定义：在满足 2NF
        的前提下，任何「非主属性」都不能「传递依赖」于码——也就是非主属性之间不能互相决定。
      </Text>
    </Callout>
    <Paragraph>
      通俗说：
      <Text bold>
        非主属性必须直接依赖主键，而不是「依赖另一个非主属性，再由它依赖主键」。
      </Text>
    </Paragraph>

    <Heading3>5.1 上面的 course 表还没到 3NF</Heading3>
    <Paragraph>
      看 4.2 里的 <InlineCode>course</InlineCode> 表，码是{' '}
      <InlineCode>cno</InlineCode>：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>cno → teacher</InlineCode>（课程决定老师）✅ 直接
      </ListItem>
      <ListItem>
        <InlineCode>teacher → teacher_tel</InlineCode>（老师决定电话）
      </ListItem>
      <ListItem>
        于是 <InlineCode>cno → teacher → teacher_tel</InlineCode> 是
        <Text bold>传递依赖</Text> ❌
      </ListItem>
    </UnorderedList>
    <Paragraph>
      后果：同一个老师教多门课时，他的电话又被重复存了，改电话又要改多行——
      <Text bold>更新异常重现</Text>。
    </Paragraph>

    <Heading3>5.2 继续拆表满足 3NF</Heading3>
    <Paragraph>把「老师」单独拎出来：</Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ✅ 老师表
CREATE TABLE teacher (
  tno   INT PRIMARY KEY,
  tname VARCHAR(20),
  tel   VARCHAR(20)
);

-- ✅ 课程表只保留指向老师的外键，不再冗余存老师信息
CREATE TABLE course (
  cno   INT PRIMARY KEY,
  cname VARCHAR(20),
  tno   INT,                              -- 外键指向老师
  FOREIGN KEY (tno) REFERENCES teacher(tno)
);`}
    />
    <Paragraph>
      至此，每张表的非主属性都<Text bold>直接、完全</Text>
      依赖于自己的主键，达到了 3NF。
    </Paragraph>

    <Heading3>5.3 经典面试例子：员工表冗余存部门信息</Heading3>
    <Paragraph>
      这是最常被问到的 3NF 反例，直接对应我们的{' '}
      <InlineCode>emp</InlineCode>/<InlineCode>dept</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ❌ 违反 3NF：员工表里冗余存了部门名和部门地址
CREATE TABLE emp_bad (
  id        INT PRIMARY KEY,
  ename     VARCHAR(20),
  dept_id   INT,            -- 部门编号
  dept_name VARCHAR(20),    -- 传递依赖：id→dept_id→dept_name
  dept_loc  VARCHAR(20)     -- 传递依赖：id→dept_id→dept_loc
);`}
    />
    <UnorderedList>
      <ListItem>
        <InlineCode>id → dept_id</InlineCode>、<InlineCode>dept_id → dept_name</InlineCode>
        ，所以 <InlineCode>dept_name</InlineCode> 传递依赖于主键 → 违反 3NF。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>修正</Text>（也就是我们全程在用的标准设计）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ✅ 部门信息独立成表，员工表只留外键 dept_id
CREATE TABLE dept (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  dept_name VARCHAR(20),
  loc       VARCHAR(20)
);
CREATE TABLE emp (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  ename   VARCHAR(20),
  dept_id INT,
  FOREIGN KEY (dept_id) REFERENCES dept(id)
);`}
    />
    <Callout type="tip">
      <Text bold>一句话记忆三范式</Text>：
      <UnorderedList>
        <ListItem>
          <Text bold>1NF</Text>：列不可再分（别在一列里塞多个值）。
        </ListItem>
        <ListItem>
          <Text bold>2NF</Text>：消除部分依赖（联合主键时，别让字段只依赖主键的一半）。
        </ListItem>
        <ListItem>
          <Text bold>3NF</Text>
          ：消除传递依赖（别让非主属性靠另一个非主属性间接依赖主键）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>六、反范式：工程中的取舍</Subtitle>
    <Paragraph>
      范式追求「零冗余」，但代价是<Text bold>表变多、查询要 JOIN 很多张表</Text>
      ，在高并发或大数据量下连接开销很大。
    </Paragraph>
    <Paragraph>
      因此工程上常会<Text bold>有意违反范式、故意冗余</Text>，叫
      <Text bold>反范式（Denormalization）</Text>：
    </Paragraph>
    <Paragraph>
      <Text bold>例子</Text>：订单表里冗余存一份「下单时的商品名称和单价」。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE order_item (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  order_id   INT,
  product_id INT,
  -- 下面两列其实能从 product 表查到，但故意冗余存一份
  product_name  VARCHAR(50),   -- 冗余：下单那一刻的商品名
  price_at_order DOUBLE,       -- 冗余：下单那一刻的单价
  quantity   INT
);`}
    />
    <Paragraph>
      为什么这里冗余是<Text bold>对的</Text>？
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>性能</Text>：展示历史订单时不必再 JOIN 商品表。
      </ListItem>
      <ListItem>
        <Text bold>业务正确性</Text>：商品涨价或改名后，
        <Text bold>历史订单必须保留下单时的快照</Text>
        ，绝不能跟着变。这种「历史快照」场景，冗余不是缺陷而是需求。
      </ListItem>
    </OrderedList>
    <Callout type="warning">
      <Text bold>
        反范式不是「不懂范式而乱设计」，而是「懂了范式之后，为了性能或业务正确性主动做的权衡」
      </Text>
      。冗余的代价是你要自己负责维护一致性。先把范式学扎实，再谈反范式。
    </Callout>

    <Divider />

    <Subtitle>七、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>范式的目的</Text>：消除数据冗余，避免
        <Text bold>更新异常、插入异常、删除异常</Text>。
      </ListItem>
      <ListItem>
        <Text bold>三个前置概念</Text>：函数依赖（A→B）、码（唯一确定一行的最小字段组）、主属性/非主属性。
      </ListItem>
      <ListItem>
        <Text bold>三大范式（层层递进，高范式必先满足低范式）</Text>：
        <Table
          head={['范式', '要求', '一句话']}
          rows={[
            ['1NF', '列原子、不可再分', '一格只放一个值'],
            ['2NF', '非主属性完全依赖码', '消除「部分依赖」（仅联合主键时需注意）'],
            ['3NF', '非主属性不传递依赖码', '消除「传递依赖」'],
          ]}
        />
      </ListItem>
      <ListItem>
        <Text bold>实战标准</Text>：表设计到 <Text bold>3NF</Text>{' '}
        即可，对应的就是我们全程使用的 <InlineCode>dept/emp</InlineCode>、
        <InlineCode>student/course/sc</InlineCode> 这种「主表 + 关系表」结构。
      </ListItem>
      <ListItem>
        <Text bold>反范式</Text>：为了查询性能或历史快照，主动冗余，但要自己保证一致性。
      </ListItem>
    </UnorderedList>

    <Heading3>常见易错问答</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>问：主键是单列时还要管 2NF 吗？</Text>
        <br />
        答：单列主键自动满足 2NF（不存在「部分依赖」），重点检查 3NF（有没有传递依赖）。
      </ListItem>
      <ListItem>
        <Text bold>问：3NF 一定没有冗余吗？</Text>
        <br />
        答：3NF 消除了「非主属性传递依赖」导致的冗余，但更严格的场景还有 BCNF。日常 3NF 足够。
      </ListItem>
      <ListItem>
        <Text bold>问：范式越高越好吗？</Text>
        <br />
        答：不是。范式越高表越多、JOIN 越多，要在「规范」和「性能」之间权衡，这正是反范式存在的理由。
      </ListItem>
    </OrderedList>
  </article>
);

export default index;
