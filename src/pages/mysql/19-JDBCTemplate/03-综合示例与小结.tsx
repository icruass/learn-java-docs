import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>综合示例与本章小结</Title>

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
