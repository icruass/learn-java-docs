import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  Table,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>关联查询：association 与 collection</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        企业数据天然是多表关联的：一个订单属于一个用户（<Text bold>多对一</Text>），
        一个用户有多个订单（<Text bold>一对多</Text>）。MyBatis 用
        <InlineCode>{'<association>'}</InlineCode>（关联一个对象）和
        <InlineCode>{'<collection>'}</InlineCode>（关联一个集合）把关联数据
        直接映射进对象，让你拿到「带着用户信息的订单」或「带着订单列表的用户」。
        本节还会讲两种实现方式的取舍，以及绕不开的 <Text bold>N+1 问题</Text>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>〇、示例模型</Subtitle>
    <CodeBlock
      language="java"
      code={`public class User {
    private Long id;
    private String username;
    private List<Order> orders;   // 一对多：一个用户的多个订单
}

public class Order {
    private Long id;
    private String orderNo;
    private BigDecimal amount;
    private User user;            // 多对一：订单所属的用户
}`}
    />

    <Divider />

    <Subtitle>一、association：多对一 / 一对一</Subtitle>
    <Paragraph>
      查询订单时，把所属用户一起查出来装进 <InlineCode>order.user</InlineCode>。
      用一条 <InlineCode>JOIN</InlineCode> + <InlineCode>{'<association>'}</InlineCode> 映射：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<resultMap id="orderWithUser" type="Order">
    <id     property="id"      column="order_id"/>
    <result property="orderNo" column="order_no"/>
    <result property="amount"  column="amount"/>

    <!-- association：把关联的「一个对象」映射进 user 字段 -->
    <association property="user" javaType="User">
        <id     property="id"       column="user_id"/>
        <result property="username" column="username"/>
    </association>
</resultMap>

<select id="selectOrderById" resultMap="orderWithUser">
    SELECT o.id AS order_id, o.order_no, o.amount,
           u.id AS user_id, u.username
    FROM orders o
    JOIN user u ON o.user_id = u.id
    WHERE o.id = #{id}
</select>`}
    />
    <Callout type="tip">
      两张表都有 <InlineCode>id</InlineCode> 列，JOIN 后会冲突，所以用别名
      （<InlineCode>o.id AS order_id</InlineCode>、<InlineCode>u.id AS user_id</InlineCode>）
      区分，resultMap 的 <InlineCode>column</InlineCode> 也对应别名。
    </Callout>

    <Divider />

    <Subtitle>二、collection：一对多</Subtitle>
    <Paragraph>
      查询用户时，把他的所有订单装进 <InlineCode>user.orders</InlineCode> 列表。
      用 <InlineCode>{'<collection>'}</InlineCode>，并配 <InlineCode>ofType</InlineCode>
      指明集合元素类型：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<resultMap id="userWithOrders" type="User">
    <id     property="id"       column="user_id"/>
    <result property="username" column="username"/>

    <!-- collection：把关联的「多条记录」映射成 List；ofType 是元素类型 -->
    <collection property="orders" ofType="Order">
        <id     property="id"      column="order_id"/>
        <result property="orderNo" column="order_no"/>
        <result property="amount"  column="amount"/>
    </collection>
</resultMap>

<select id="selectUserWithOrders" resultMap="userWithOrders">
    SELECT u.id AS user_id, u.username,
           o.id AS order_id, o.order_no, o.amount
    FROM user u
    LEFT JOIN orders o ON o.user_id = u.id
    WHERE u.id = #{id}
</select>`}
    />
    <Callout type="danger" title="一对多必须配 <id>，否则去重失败">
      JOIN 后一个用户有 3 个订单 = 返回 3 行。MyBatis 靠 <InlineCode>{'<id>'}</InlineCode>
      （这里是 <InlineCode>user_id</InlineCode>）判断「这 3 行是同一个用户」，
      从而合并成 1 个 User、3 个 Order。<Text bold>不配 {'<id>'} 会得到 3 个重复的 User</Text>。
    </Callout>
    <Table
      head={['', 'association', 'collection']}
      rows={[
        ['关系', '多对一 / 一对一', '一对多'],
        ['映射目标', '单个对象', 'List 集合'],
        ['类型属性', <InlineCode>javaType</InlineCode>, <InlineCode>ofType</InlineCode>],
      ]}
    />

    <Divider />

    <Subtitle>三、两种实现：嵌套结果 vs 嵌套查询</Subtitle>
    <Paragraph>上面用的是<Text bold>嵌套结果（JOIN 一次查完）</Text>。另一种是<Text bold>嵌套查询（分多次查）</Text>：</Paragraph>
    <CodeBlock
      language="xml"
      title="嵌套查询：association 用 select 再发一条 SQL"
      code={`<resultMap id="orderWithUser2" type="Order">
    <id     property="id"      column="id"/>
    <result property="orderNo" column="order_no"/>
    <!-- 不 JOIN，而是拿 user_id 再调用另一个查询去查 user -->
    <association property="user"
                 column="user_id"
                 javaType="User"
                 select="com.example.mapper.UserMapper.selectById"/>
</resultMap>`}
    />
    <Table
      head={['方式', '优点', '缺点']}
      rows={[
        [
          <Text bold>嵌套结果（JOIN）</Text>,
          '一条 SQL 搞定，无 N+1',
          'SQL 较长，字段要起别名',
        ],
        [
          <Text bold>嵌套查询（select）</Text>,
          '配置简单，可复用已有查询、支持懒加载',
          <Text bold>容易引发 N+1 问题</Text>,
        ],
      ]}
    />

    <Divider />

    <Subtitle>四、N+1 问题（必知的性能坑）</Subtitle>
    <Paragraph>
      用「嵌套查询」查 100 个订单的所属用户时：先查订单（<Text bold>1</Text> 条 SQL 得到
      100 个订单），再对每个订单各发一条查用户的 SQL（<Text bold>N=100</Text> 条）——
      共 <Text bold>1 + N</Text> 条 SQL，这就是 <Text bold>N+1 问题</Text>，数据量一大性能急剧下降。
    </Paragraph>
    <CodeBlock
      language="text"
      code={`-- 嵌套查询查 100 个订单的用户，实际发出：
SELECT * FROM orders;                 -- 1 条
SELECT * FROM user WHERE id = 1;      -- 第 1 条
SELECT * FROM user WHERE id = 2;      -- 第 2 条
... 共 100 条                          -- 第 N 条
-- 合计 1 + 100 = 101 条 SQL！`}
    />
    <Callout type="success" title="如何避免 N+1">
      <UnorderedList>
        <ListItem>
          <Text bold>首选用嵌套结果（JOIN）</Text>：一条 SQL 拿到全部数据，从根上没有 N+1。
        </ListItem>
        <ListItem>
          必须用嵌套查询时，开启<Text bold>懒加载</Text>
          （<InlineCode>lazyLoadingEnabled=true</InlineCode>），用到关联对象才查。
        </ListItem>
        <ListItem>
          或改为「先查主表，再用 <InlineCode>IN</InlineCode> 批量查关联表」，在内存里组装。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          <InlineCode>{'<association>'}</InlineCode>（配 <InlineCode>javaType</InlineCode>）映射多对一/一对一；
          <InlineCode>{'<collection>'}</InlineCode>（配 <InlineCode>ofType</InlineCode>）映射一对多。
        </ListItem>
        <ListItem>一对多必须配 <InlineCode>{'<id>'}</InlineCode>，MyBatis 靠它合并重复行。</ListItem>
        <ListItem>
          实现分嵌套结果（JOIN，推荐）和嵌套查询（select，简单但有 N+1）。
        </ListItem>
        <ListItem>
          牢记 <Text bold>N+1 问题</Text>：优先 JOIN，必要时懒加载或 IN 批量查。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
