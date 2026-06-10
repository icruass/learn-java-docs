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
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>DML 与 DQL 查询方法</Title>

    <Subtitle>三、执行 DML：update() 方法</Subtitle>
    <Paragraph>
      <InlineCode>update(String sql, Object... args)</InlineCode> 用于{' '}
      <Text bold>增、删、改</Text>，返回受影响的行数。<InlineCode>?</InlineCode>{' '}
      占位符的值依次作为后面的可变参数传入（
      <Text bold>底层就是 PreparedStatement，天然防注入</Text>）。
    </Paragraph>
    <CodeBlock
      language="java"
      code={`JdbcTemplate template = new JdbcTemplate(JDBCUtils.getDataSource());

// 增
String insert = "INSERT INTO user (username, password) VALUES (?, ?)";
int c1 = template.update(insert, "wangwu", "789");   // ? 依次 = wangwu, 789

// 改
String update = "UPDATE user SET password = ? WHERE username = ?";
int c2 = template.update(update, "000", "zhangsan");

// 删
String delete = "DELETE FROM user WHERE id = ?";
int c3 = template.update(delete, 4);

System.out.println(c1 + ", " + c2 + ", " + c3);`}
    />
    <Callout type="tip">
      占位符参数直接跟在 SQL 后面按顺序写，不用再{' '}
      <InlineCode>ps.setString(1, ...)</InlineCode>，模板替你做了。
    </Callout>

    <Divider />

    <Subtitle>四、执行 DQL：各种查询方法</Subtitle>
    <Paragraph>
      JDBCTemplate 的查询方法很多，按「<Text bold>返回什么形态</Text>
      」选用，这是本章的重点。
    </Paragraph>

    <Heading3>4.1 queryForMap：查询单行，封装成 Map</Heading3>
    <Paragraph>
      把一行的「列名 → 值」封装成一个 <InlineCode>Map</InlineCode>。
    </Paragraph>
    <CodeBlock
      language="java"
      code={`// 查 id=1 的用户
String sql = "SELECT * FROM user WHERE id = ?";
Map<String, Object> map = template.queryForMap(sql, 1);
System.out.println(map);
// 输出：{id=1, username=zhangsan, password=888}`}
    />
    <Callout type="warning">
      <InlineCode>queryForMap</InlineCode> 要求结果<Text bold>有且仅有一行</Text>
      ：查出 0 行或多行都会抛异常（
      <InlineCode>IncorrectResultSizeDataAccessException</InlineCode>）。
    </Callout>

    <Heading3>4.2 queryForList：查询多行，封装成 List&lt;Map&gt;</Heading3>
    <Paragraph>每一行是一个 Map，多行组成 List。</Paragraph>
    <CodeBlock
      language="java"
      code={`String sql = "SELECT * FROM user";
List<Map<String, Object>> list = template.queryForList(sql);
for (Map<String, Object> row : list) {
    System.out.println(row);
}
// {id=1, username=zhangsan, password=888}
// {id=2, username=lisi, password=456}
// ...`}
    />
    <Paragraph>
      <InlineCode>queryForList</InlineCode> 不限定行数，0 行返回空
      List，适合「不关心封装成对象、只要原始数据」的场景。
    </Paragraph>

    <Heading3>
      4.3 query + BeanPropertyRowMapper：查询多行，封装成 List&lt;JavaBean&gt;
    </Heading3>
    <Paragraph>
      <Text bold>这是实战最常用的查询方式</Text>：把每一行自动封装成一个 JavaBean
      对象。
    </Paragraph>
    <CodeBlock
      language="java"
      code={`import org.springframework.jdbc.core.BeanPropertyRowMapper;
import java.util.List;

String sql = "SELECT * FROM user";
List<User> users = template.query(sql, new BeanPropertyRowMapper<>(User.class));
for (User u : users) {
    System.out.println(u);
}
// User{id=1, username='zhangsan', password='888'}
// User{id=2, username='lisi', password='456'}`}
    />
    <Paragraph>
      <InlineCode>BeanPropertyRowMapper&lt;&gt;(User.class)</InlineCode>{' '}
      会自动把<Text bold>列名对应到 JavaBean 的属性</Text>（调用 setter）。
    </Paragraph>
    <Callout type="warning">
      <Paragraph>
        <Text bold>列名要能对应上属性名</Text>：列 <InlineCode>username</InlineCode>{' '}
        ↔ 属性 <InlineCode>username</InlineCode>。若数据库用下划线命名（如{' '}
        <InlineCode>user_name</InlineCode>）而 Java 用驼峰（
        <InlineCode>userName</InlineCode>
        ），默认对应不上，要么给 SQL 列起别名（
        <InlineCode>SELECT user_name AS userName</InlineCode>
        ），要么用支持驼峰映射的配置。
      </Paragraph>
      <Paragraph>
        JavaBean <Text bold>必须有无参构造方法</Text>（封装时先{' '}
        <InlineCode>new</InlineCode> 再 set），否则报错。
      </Paragraph>
    </Callout>
    <Paragraph>带条件查询同样支持：</Paragraph>
    <CodeBlock
      language="java"
      code={`String sql = "SELECT * FROM user WHERE password = ?";
List<User> list = template.query(sql, new BeanPropertyRowMapper<>(User.class), "456");`}
    />

    <Heading3>4.4 queryForObject：查询单个值 / 单个对象</Heading3>
    <Paragraph>
      <Text bold>用法一：查询聚合结果等单个值</Text>
    </Paragraph>
    <CodeBlock
      language="java"
      code={`// 查总记录数（COUNT 返回一个值）
String sql = "SELECT COUNT(*) FROM user";
Long total = template.queryForObject(sql, Long.class);   // 指定返回类型
System.out.println("共 " + total + " 条");`}
    />
    <Paragraph>
      <Text bold>用法二：查询单个对象（结果恰好一行）</Text>
    </Paragraph>
    <CodeBlock
      language="java"
      code={`String sql = "SELECT * FROM user WHERE id = ?";
User u = template.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), 1);
System.out.println(u);   // User{id=1, ...}`}
    />
    <Callout type="warning">
      和 <InlineCode>queryForMap</InlineCode> 一样，
      <InlineCode>queryForObject</InlineCode> 要求结果<Text bold>正好一行</Text>，0
      行或多行都抛异常。查可能为空的情况，建议用 <InlineCode>query(...)</InlineCode>{' '}
      拿 List 再判断是否为空，更安全。
    </Callout>

    <Heading3>4.5 方法速查表</Heading3>
    <Table
      head={['方法', '用途', '返回']}
      rows={[
        ['update(sql, args...)', '增 / 删 / 改', 'int 影响行数'],
        ['queryForMap(sql, args...)', '查询单行', 'Map<String,Object>（列名→值）'],
        ['queryForList(sql, args...)', '查询多行', 'List<Map<String,Object>>'],
        ['query(sql, rowMapper, args...)', '查询多行→对象', 'List<JavaBean>'],
        ['queryForObject(sql, 类型/rowMapper, args...)', '查询单个值/单个对象', '单个值或单个 JavaBean'],
      ]}
    />
  </article>
);

export default index;
