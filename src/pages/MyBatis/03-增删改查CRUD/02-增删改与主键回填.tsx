import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>增、删、改与主键回填</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        增删改（写操作）和查询有两点不同：① 它们会改数据，所以
        <Text bold>必须提交事务</Text>才真正生效；② 新增时我们常常需要拿到
        <Text bold>数据库生成的自增主键</Text>。本节讲透写操作的写法、事务提交，
        以及主键回填的两种方式。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、INSERT 新增</Subtitle>
    <CodeBlock
      language="java"
      code={`int insert(User user);   // 返回受影响行数`}
    />
    <CodeBlock
      language="xml"
      code={`<insert id="insert">
    INSERT INTO user (username, age, email)
    VALUES (#{username}, #{age}, #{email})
</insert>`}
    />
    <Paragraph>
      入参是 <InlineCode>User</InlineCode> 对象时，<InlineCode>#{'{username}'}</InlineCode>{' '}
      直接取对象的 <InlineCode>getUsername()</InlineCode>，无需 <InlineCode>@Param</InlineCode>。
    </Paragraph>

    <Divider />

    <Subtitle>二、UPDATE 与 DELETE</Subtitle>
    <CodeBlock
      language="xml"
      code={`<update id="update">
    UPDATE user
    SET username = #{username}, age = #{age}, email = #{email}
    WHERE id = #{id}
</update>

<delete id="deleteById">
    DELETE FROM user WHERE id = #{id}
</delete>`}
    />
    <Callout type="tip">
      写操作返回的 <InlineCode>int</InlineCode> 是受影响行数。可据此判断是否操作成功，
      例如 <InlineCode>update(user) == 0</InlineCode> 说明没有匹配到 id，更新没生效。
    </Callout>

    <Divider />

    <Subtitle>三、关键：写操作必须提交事务</Subtitle>
    <Paragraph>
      在<Text bold>不整合 Spring 的原生 MyBatis</Text> 里，
      <InlineCode>openSession()</InlineCode> 默认<Text bold>不自动提交</Text>。
      执行完增删改后不 <InlineCode>commit()</InlineCode>，数据库里什么都不会变（事务回滚）。
    </Paragraph>
    <CodeBlock
      language="java"
      title="方式一：手动提交（推荐，可控制回滚）"
      code={`try (SqlSession session = factory.openSession()) {
    UserMapper mapper = session.getMapper(UserMapper.class);
    User u = new User();
    u.setUsername("王五");
    u.setAge(28);
    mapper.insert(u);
    session.commit();   // ← 不加这一行，数据不会真正写入！
} // 出异常时未 commit，try-with-resources 关闭即回滚`}
    />
    <CodeBlock
      language="java"
      title="方式二：开启自动提交"
      code={`// openSession(true) 表示 autoCommit=true，每条语句自动提交
try (SqlSession session = factory.openSession(true)) {
    session.getMapper(UserMapper.class).insert(u);
} // 无需手动 commit`}
    />
    <Callout type="warning">
      自动提交虽省事，但<Text bold>失去了事务控制</Text>（无法把多条操作绑成一个原子单元）。
      生产代码一律<Text bold>手动提交</Text>，或交给 Spring 事务管理（整合后
      <InlineCode>@Transactional</InlineCode> 自动处理提交/回滚，不用再手写 commit）。
    </Callout>

    <Divider />

    <Subtitle>四、主键回填：拿到自增 id</Subtitle>
    <Paragraph>
      新增后业务常需要刚插入记录的主键（比如再插一条关联数据）。
      <InlineCode>insert</InlineCode> 方法本身只返回行数，主键要靠
      <Text bold>回填</Text>机制写回到入参对象里。
    </Paragraph>

    <Paragraph>
      <Text bold>方式一：useGeneratedKeys（MySQL 等支持自增的库，推荐）</Text>
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO user (username, age, email)
    VALUES (#{username}, #{age}, #{email})
</insert>`}
    />
    <UnorderedList>
      <ListItem>
        <InlineCode>useGeneratedKeys="true"</InlineCode>：让 JDBC 取回数据库生成的主键；
      </ListItem>
      <ListItem>
        <InlineCode>keyProperty="id"</InlineCode>：把取回的主键塞进入参对象的{' '}
        <InlineCode>id</InlineCode> 属性。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="java"
      title="调用后即可读到 id"
      code={`User u = new User();
u.setUsername("王五");
mapper.insert(u);
System.out.println(u.getId());  // 已被回填为数据库生成的自增主键`}
    />

    <Paragraph>
      <Text bold>方式二：selectKey（适用于不支持自增的库，或需要自定义主键，如 Oracle 序列、UUID）</Text>
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<insert id="insert">
    <!-- order=BEFORE：先取主键再插入；AFTER：插入后再取（如 MySQL 的 LAST_INSERT_ID） -->
    <selectKey keyProperty="id" resultType="long" order="AFTER">
        SELECT LAST_INSERT_ID()
    </selectKey>
    INSERT INTO user (username, age, email)
    VALUES (#{username}, #{age}, #{email})
</insert>`}
    />
    <Callout type="tip">
      MySQL 优先用更简洁的 <InlineCode>useGeneratedKeys</InlineCode>；
      <InlineCode>selectKey</InlineCode> 主要留给 Oracle（
      <InlineCode>序列.NEXTVAL</InlineCode>，<InlineCode>order="BEFORE"</InlineCode>）
      或自定义主键策略的场景。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          增删改返回受影响行数；入参是对象时 <InlineCode>#{'{属性名}'}</InlineCode> 直接取值。
        </ListItem>
        <ListItem>
          <Text bold>原生 MyBatis 写操作必须 <InlineCode>commit()</InlineCode></Text>，
          否则数据不落库；或用 <InlineCode>openSession(true)</InlineCode> 自动提交。
        </ListItem>
        <ListItem>
          主键回填：MySQL 用 <InlineCode>useGeneratedKeys + keyProperty</InlineCode>；
          其它库 / 自定义主键用 <InlineCode>{'<selectKey>'}</InlineCode>。
        </ListItem>
        <ListItem>
          整合 Spring 后，提交/回滚交给 <InlineCode>@Transactional</InlineCode>，不再手写 commit。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
