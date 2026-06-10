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
    <Title>第三范式 3NF、反范式与小结</Title>

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
