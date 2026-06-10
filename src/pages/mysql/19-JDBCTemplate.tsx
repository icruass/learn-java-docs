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
    <Title>JDBCTemplate：Spring 对 JDBC 的封装</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        走到这里，我们已经掌握了原生 JDBC（第 16 章）、JDBC 事务（第 17
        章）、连接池（第 18 章）。但你一定也感受到了：原生 JDBC 写一次查询要{' '}
        <InlineCode>getConnection</InlineCode>、
        <InlineCode>prepareStatement</InlineCode>、<InlineCode>setXxx</InlineCode>、
        <InlineCode>executeQuery</InlineCode>、
        <InlineCode>while(rs.next())</InlineCode>、<InlineCode>close</InlineCode>
        ……
        <Text bold>一大堆重复的样板代码，真正的业务逻辑只有一两行</Text>。
      </Paragraph>
      <Paragraph>
        Spring 框架提供了 <Text bold>JDBCTemplate（JDBC 模板）</Text>
        ，把这些样板全部包办，让你
        <Text bold>一行代码完成一次增删改查</Text>。本章讲透：
      </Paragraph>
      <OrderedList>
        <ListItem>
          JDBCTemplate 是什么、需要哪些 jar、怎么创建它；
        </ListItem>
        <ListItem>
          用 <InlineCode>update()</InlineCode> 执行增删改；
        </ListItem>
        <ListItem>
          用 <InlineCode>queryForMap</InlineCode> /{' '}
          <InlineCode>queryForList</InlineCode> / <InlineCode>query</InlineCode> /{' '}
          <InlineCode>queryForObject</InlineCode> 执行各种查询，把结果自动封装成
          Map、List、JavaBean。
        </ListItem>
      </OrderedList>
      <Paragraph>
        它是本套 MySQL 教程的收官，也是通往 MyBatis、Spring Data
        等持久层框架的桥梁。本章沿用 <InlineCode>db_learn</InlineCode> 的{' '}
        <InlineCode>user</InlineCode> 表，并直接复用第 18
        章封装好的连接池工具类 <InlineCode>JDBCUtils</InlineCode>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>〇、准备工作</Subtitle>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE user (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(32),
  password VARCHAR(32)
);
INSERT INTO user (username, password) VALUES ('zhangsan','123'),('lisi','456');`}
    />
    <Paragraph>对应的 JavaBean（字段名建议与列名对应，方便自动封装）：</Paragraph>
    <CodeBlock
      language="java"
      code={`public class User {
    private Integer id;
    private String username;
    private String password;
    // 必须有无参构造 + 所有字段的 getter/setter（自动封装靠 setter）
    // ... getter/setter 省略 ...
    @Override public String toString() {
        return "User{id=" + id + ", username='" + username + "', password='" + password + "'}";
    }
}`}
    />

    <Divider />

    <Subtitle>一、JDBCTemplate 介绍</Subtitle>
    <Paragraph>
      <Text bold>JDBCTemplate</Text> 是 <Text bold>Spring 框架</Text>对 JDBC
      的轻量封装。它替你完成了：获取/释放连接、创建{' '}
      <InlineCode>PreparedStatement</InlineCode>、设置参数、遍历{' '}
      <InlineCode>ResultSet</InlineCode>、异常转换……你只需关心「SQL + 参数 +
      结果怎么封装」。
    </Paragraph>
    <Paragraph>
      <Text bold>需要的 jar</Text>（核心 4 个 + 连接池 + 驱动）：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>spring-core</InlineCode>、<InlineCode>spring-beans</InlineCode>
        、<InlineCode>spring-jdbc</InlineCode>、<InlineCode>spring-tx</InlineCode>
        （Spring 的核心、bean、jdbc、事务）；
      </ListItem>
      <ListItem>
        还有 <InlineCode>commons-logging</InlineCode>（Spring 依赖的日志）；
      </ListItem>
      <ListItem>
        连接池 jar（如 <InlineCode>druid</InlineCode>）和 MySQL 驱动 jar。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      JDBCTemplate 不自己管理连接，而是
      <Text bold>
        依赖一个 <InlineCode>DataSource</InlineCode>（连接池）
      </Text>
      来取连接——这正是第 18 章我们在 <InlineCode>JDBCUtils</InlineCode> 里留出{' '}
      <InlineCode>getDataSource()</InlineCode> 的原因，现在派上用场。
    </Callout>

    <Divider />

    <Subtitle>二、快速入门</Subtitle>
    <CodeBlock
      language="java"
      code={`import org.springframework.jdbc.core.JdbcTemplate;

public class JdbcTemplateDemo {
    public static void main(String[] args) {
        // 用第18章连接池工具类提供的 DataSource 创建 JdbcTemplate
        JdbcTemplate template = new JdbcTemplate(JDBCUtils.getDataSource());

        // 一行搞定一次更新！
        String sql = "UPDATE user SET password = '888' WHERE id = 1";
        int count = template.update(sql);
        System.out.println("受影响行数：" + count);
    }
}`}
    />
    <Paragraph>
      对比第 16 章那一大段 try-catch-finally，是不是清爽到不可思议？这就是模板的价值。
    </Paragraph>
    <Callout type="tip">
      实际项目里 <InlineCode>JdbcTemplate</InlineCode>{' '}
      对象通常只创建一次（交给 Spring 容器管理为单例），这里为演示直接{' '}
      <InlineCode>new</InlineCode>。
    </Callout>

    <Divider />

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

    <Divider />

    <Subtitle>五、综合示例：一个简单的 UserDao</Subtitle>
    <Paragraph>
      把 JDBCTemplate 用在标准的 DAO（数据访问对象）里，这就是工程中持久层的雏形：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

public class UserDao {
    // 整个应用共用一个 template（依赖第18章的连接池）
    private final JdbcTemplate template = new JdbcTemplate(JDBCUtils.getDataSource());

    /** 查询所有用户 */
    public List<User> findAll() {
        return template.query("SELECT * FROM user",
                new BeanPropertyRowMapper<>(User.class));
    }

    /** 按 id 查询单个用户 */
    public User findById(int id) {
        List<User> list = template.query("SELECT * FROM user WHERE id = ?",
                new BeanPropertyRowMapper<>(User.class), id);
        return list.isEmpty() ? null : list.get(0);   // 比 queryForObject 更安全
    }

    /** 新增用户，返回是否成功 */
    public boolean add(User u) {
        int c = template.update("INSERT INTO user (username, password) VALUES (?, ?)",
                u.getUsername(), u.getPassword());
        return c > 0;
    }

    /** 统计用户总数 */
    public long count() {
        return template.queryForObject("SELECT COUNT(*) FROM user", Long.class);
    }
}`}
    />
    <Paragraph>
      对比第 16 章原生 JDBC 的同等功能，代码量减少了一大半，且没有一处需要手动{' '}
      <InlineCode>close</InlineCode>——这正是 JDBCTemplate 的意义。
    </Paragraph>

    <Divider />

    <Subtitle>六、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>JDBCTemplate</Text> 是 Spring 对 JDBC
        的封装，免去连接管理、<InlineCode>PreparedStatement</InlineCode>、
        <InlineCode>ResultSet</InlineCode> 遍历、资源释放等样板代码。
      </ListItem>
      <ListItem>
        <Text bold>创建</Text>：<InlineCode>new JdbcTemplate(dataSource)</InlineCode>
        ，依赖一个连接池（<InlineCode>DataSource</InlineCode>）——复用第 18 章{' '}
        <InlineCode>JDBCUtils.getDataSource()</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>增删改</Text>：<InlineCode>update(sql, 参数...)</InlineCode>
        ，返回影响行数，底层用 PreparedStatement 防注入。
      </ListItem>
      <ListItem>
        <Text bold>查询</Text>（按返回形态选）：
        <UnorderedList>
          <ListItem>
            <InlineCode>queryForMap</InlineCode> → 单行 Map；
          </ListItem>
          <ListItem>
            <InlineCode>queryForList</InlineCode> → 多行 List&lt;Map&gt;；
          </ListItem>
          <ListItem>
            <InlineCode>
              query(sql, new BeanPropertyRowMapper&lt;&gt;(Bean.class), 参数...)
            </InlineCode>{' '}
            → 多行 List&lt;Bean&gt;（<Text bold>最常用</Text>）；
          </ListItem>
          <ListItem>
            <InlineCode>queryForObject</InlineCode> → 单个值（如
            COUNT）或单个对象。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>注意</Text>：<InlineCode>queryForMap</InlineCode>/
        <InlineCode>queryForObject</InlineCode> 要求结果正好一行；
        <InlineCode>BeanPropertyRowMapper</InlineCode> 要求列名与属性名对应、Bean
        有无参构造。
      </ListItem>
    </UnorderedList>

    <Heading3>常见易错问答</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>
          问：<InlineCode>query</InlineCode> 和{' '}
          <InlineCode>queryForObject</InlineCode> 怎么选？
        </Text>
        <br />
        答：返回多行用 <InlineCode>query</InlineCode>（得 List）；明确只有一行（或一个聚合值）用{' '}
        <InlineCode>queryForObject</InlineCode>。不确定行数、可能为空时用{' '}
        <InlineCode>query</InlineCode> 更安全。
      </ListItem>
      <ListItem>
        <Text bold>问：列名是下划线、属性是驼峰，封装为 null 怎么办？</Text>
        <br />
        答：<InlineCode>BeanPropertyRowMapper</InlineCode>{' '}
        默认按名匹配。给 SQL 列起驼峰别名（
        <InlineCode>SELECT user_name AS userName</InlineCode>
        ），或使用支持驼峰下划线转换的映射器。
      </ListItem>
      <ListItem>
        <Text bold>问：JDBCTemplate 还要手动管理连接和事务吗？</Text>
        <br />
        答：连接由它配合连接池自动取还，不用手动 close；事务可继续用第 17
        章方式，但更优雅的是配合 Spring 的声明式事务{' '}
        <InlineCode>@Transactional</InlineCode>
        ，这是后续框架学习的内容。
      </ListItem>
    </OrderedList>

    <Divider />

    <Callout type="success">
      <Text bold>全套 MySQL 教程到此结束！</Text>{' '}
      从「数据库是什么」一路走到「用 Spring JDBCTemplate
      优雅地操作数据库」，你已经完整走通了{' '}
      <Text bold>
        数据库设计 → SQL 操作 → 事务/权限 → Java 程序访问数据库 → 连接池 →
        框架封装
      </Text>{' '}
      的全链路。下一步可以进入 MyBatis、Spring、Spring Boot
      的持久层学习，它们都站在你现在掌握的这些基础之上。
    </Callout>
  </article>
);

export default index;
