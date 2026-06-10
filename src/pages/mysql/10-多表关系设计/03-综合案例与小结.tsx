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
    <Title>综合案例与本章小结</Title>

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
