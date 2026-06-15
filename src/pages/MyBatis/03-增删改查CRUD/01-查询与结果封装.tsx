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
    <Title>查询与结果封装</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        查询是用得最多的操作。本节把企业开发里最常见的几种查询写法过一遍：
        查单个、查列表、模糊查询、返回 <InlineCode>Map</InlineCode>、查总数 /
        是否存在，重点讲清楚<Text bold>结果是怎么封装的</Text>，
        以及 MyBatis 怎么根据方法返回值决定调 selectOne 还是 selectList。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、查询单个对象</Subtitle>
    <CodeBlock
      language="java"
      title="UserMapper.java"
      code={`User selectById(Long id);`}
    />
    <CodeBlock
      language="xml"
      code={`<select id="selectById" resultType="User">
    SELECT id, username, age, email FROM user WHERE id = #{id}
</select>`}
    />
    <Callout type="warning" title="查不到返回 null，查到多条会报错">
      返回单对象时，若结果为 0 条返回 <InlineCode>null</InlineCode>；若查出
      <Text bold>多于一条</Text>会抛 <InlineCode>TooManyResultsException</InlineCode>。
      所以「按唯一键查」才用单对象返回，否则用 <InlineCode>List</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>二、查询列表</Subtitle>
    <Paragraph>
      返回 <InlineCode>List&lt;User&gt;</InlineCode>，但 XML 里{' '}
      <InlineCode>resultType</InlineCode> 仍写<Text bold>集合里的元素类型</Text>
      （<InlineCode>User</InlineCode>），不是 List——MyBatis
      看到方法返回 List 会自动收集每一行。
    </Paragraph>
    <CodeBlock
      language="java"
      code={`List<User> selectAll();`}
    />
    <CodeBlock
      language="xml"
      code={`<select id="selectAll" resultType="User">
    SELECT id, username, age, email FROM user ORDER BY id
</select>`}
    />
    <Callout type="tip">
      列表查询查不到时返回<Text bold>空集合（size=0）</Text>而非{' '}
      <InlineCode>null</InlineCode>，所以遍历前不必判空（但取第一个元素仍要判空）。
    </Callout>

    <Divider />

    <Subtitle>三、模糊查询（推荐 CONCAT）</Subtitle>
    <Paragraph>
      模糊查询要用 <InlineCode>#{'{}'}</InlineCode> 传参（防注入），通配符{' '}
      <InlineCode>%</InlineCode> 用 SQL 的 <InlineCode>CONCAT</InlineCode> 拼接：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<select id="searchByName" resultType="User">
    SELECT * FROM user
    WHERE username LIKE CONCAT('%', #{keyword}, '%')
</select>`}
    />
    <Callout type="danger" title="不要用 ${} 拼 LIKE">
      千万别写成 <InlineCode>{"LIKE '%${keyword}%'"}</InlineCode>——
      <InlineCode>{'${}'}</InlineCode> 是字符串直接拼接，会带来
      <Text bold>SQL 注入风险</Text>。用 <InlineCode>CONCAT</InlineCode> +{' '}
      <InlineCode>#{'{}'}</InlineCode> 才安全（参数传递那节会详解二者区别）。
    </Callout>

    <Divider />

    <Subtitle>四、结果封装成 Map</Subtitle>
    <Paragraph>
      当查询结果<Text bold>没有对应实体类</Text>（如统计、临时多列），可以用{' '}
      <InlineCode>Map</InlineCode> 接收，键是列名、值是列值：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`// 单行 → Map<列名, 值>
Map<String, Object> selectStatById(Long id);`}
    />
    <CodeBlock
      language="xml"
      code={`<select id="selectStatById" resultType="map">
    SELECT username AS name, age, email FROM user WHERE id = #{id}
</select>`}
    />
    <Paragraph>
      也能让多行结果按某个键聚成一个大 Map，用方法上的{' '}
      <InlineCode>@MapKey</InlineCode> 指定用哪一列做 key：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`// 返回 Map<id, User>，方便按 id 直接取
@MapKey("id")
Map<Long, User> selectAllAsMap();`}
    />

    <Divider />

    <Subtitle>五、查总数 / 判断是否存在</Subtitle>
    <CodeBlock
      language="java"
      code={`long count();                 // 总数
int countByAge(Integer age);  // 条件计数`}
    />
    <CodeBlock
      language="xml"
      code={`<select id="count" resultType="long">
    SELECT COUNT(*) FROM user
</select>

<select id="countByAge" resultType="int">
    SELECT COUNT(*) FROM user WHERE age = #{age}
</select>`}
    />
    <Callout type="tip">
      <Text bold>判断是否存在</Text>建议用{' '}
      <InlineCode>SELECT COUNT(*) ... LIMIT 1</InlineCode> 或{' '}
      <InlineCode>SELECT EXISTS(...)</InlineCode> 返回{' '}
      <InlineCode>boolean</InlineCode>，比把整条记录查出来再判空更高效。
    </Callout>

    <Divider />

    <Subtitle>六、MyBatis 怎么决定调 One 还是 List</Subtitle>
    <Paragraph>
      你只管声明方法返回值，MyBatis 会根据<Text bold>方法返回类型</Text>自动选择：
    </Paragraph>
    <Table
      head={['方法返回类型', 'MyBatis 内部调用', '说明']}
      rows={[
        ['User', 'selectOne', '0 条→null，多条→异常'],
        ['List<User>', 'selectList', '0 条→空集合'],
        ['Map<String,Object>', 'selectOne（封装成 map）', '单行多列'],
        ['int / long', 'selectOne', '聚合结果，如 COUNT'],
      ]}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          单对象：0 条返回 null、多条抛异常；列表：0 条返回空集合。
        </ListItem>
        <ListItem>
          List 查询的 <InlineCode>resultType</InlineCode> 写<Text bold>元素类型</Text>，不是 List。
        </ListItem>
        <ListItem>
          模糊查询用 <InlineCode>CONCAT('%', #{'{kw}'}, '%')</InlineCode>，绝不用{' '}
          <InlineCode>{'${}'}</InlineCode> 拼接。
        </ListItem>
        <ListItem>
          无实体时用 <InlineCode>resultType="map"</InlineCode>；
          计数 / 判存在直接返回 <InlineCode>int</InlineCode>/<InlineCode>long</InlineCode>/<InlineCode>boolean</InlineCode>。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
