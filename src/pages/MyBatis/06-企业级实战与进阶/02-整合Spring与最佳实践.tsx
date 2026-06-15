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
  DocLink,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>整合 Spring 与最佳实践</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前面我们都用「原生 MyBatis」手动管理 <InlineCode>SqlSession</InlineCode>
        和事务。但真实企业项目里，MyBatis 几乎总是和 <Text bold>Spring / Spring Boot</Text>
        一起用——Spring 接管连接、Session 和事务，你只管写 Mapper 接口和 SQL。
        本节讲整合后的变化、生产级最佳实践、常见报错排查，并介绍国内极火的
        <Text bold>MyBatis-Plus</Text>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、整合后，什么变了</Subtitle>
    <Table
      head={['关注点', '原生 MyBatis', '整合 Spring 后']}
      rows={[
        ['SqlSession', '手动 openSession / close', <Text bold>Spring 自动管理（线程安全）</Text>],
        ['事务提交', '手动 session.commit()', <Text bold>@Transactional 自动提交/回滚</Text>],
        ['获取 Mapper', 'session.getMapper(...)', '@Autowired 直接注入'],
        ['数据源', 'environments 里配', '交给 Druid / HikariCP 等连接池'],
        ['配置位置', 'mybatis-config.xml', 'application.yml 的 mybatis.* / spring.datasource'],
      ]}
    />
    <Callout type="tip">
      一句话：整合后 MyBatis「藏」到了 Spring 背后，你的代码里
      <Text bold>只剩 Mapper 接口、XML（或注解）和 Service 调用</Text>，干净很多。
    </Callout>

    <Divider />

    <Subtitle>二、Spring Boot 整合三步</Subtitle>
    <Paragraph>
      Spring Boot 下用 <InlineCode>mybatis-spring-boot-starter</InlineCode> 整合，核心三步：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="① 依赖（pom.xml）"
      code={`<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.3</version>
</dependency>`}
    />
    <CodeBlock
      language="yaml"
      title="② 配置（application.yml）"
      code={`spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mybatis_demo
    username: root
    password: "123456"

mybatis:
  mapper-locations: classpath:mapper/*.xml        # XML 位置
  type-aliases-package: com.example.entity        # 实体别名包
  configuration:
    map-underscore-to-camel-case: true            # 驼峰映射（企业必开）`}
    />
    <CodeBlock
      language="java"
      title="③ 启动类扫描 Mapper 接口"
      code={`@SpringBootApplication
@MapperScan("com.example.mapper")   // 扫描整个 Mapper 包，省去每个接口加 @Mapper
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}`}
    />
    <CodeBlock
      language="java"
      title="Service 里直接注入使用"
      code={`@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;   // 构造器注入

    @Transactional   // 多条写操作绑成一个事务，异常自动回滚（不用再手写 commit）
    public void register(User user) {
        userMapper.insert(user);
        // ... 其它写操作，任一抛异常则整体回滚
    }
}`}
    />
    <Callout type="note">
      Spring Boot 整合的<Text bold>更完整流程</Text>（建表、实体、注解 SQL vs XML、Mapper
      扫描方式对比）见{' '}
      <DocLink to="/SpringBoot/06/01">Spring Boot 篇 · 整合 MyBatis</DocLink>，
      动态 SQL + 分页插件 PageHelper 见{' '}
      <DocLink to="/SpringBoot/06/02">Spring Boot 篇 · MyBatis 动态 SQL 与分页</DocLink>。
    </Callout>

    <Divider />

    <Subtitle>三、了解 MyBatis-Plus（国内主流增强）</Subtitle>
    <Paragraph>
      <Text bold>MyBatis-Plus（简称 MP）</Text>是在 MyBatis 之上的增强工具——
      <Text bold>只做增强，不做改变</Text>，原有 MyBatis 用法完全保留。它最大的价值是
      <Text bold>单表 CRUD 一行不用写</Text>：继承 <InlineCode>BaseMapper</InlineCode>
      就自动拥有增删改查、分页、条件构造器。
    </Paragraph>
    <CodeBlock
      language="java"
      code={`// 继承 BaseMapper<User> 即获得 insert/selectById/updateById/deleteById/selectPage... 等
public interface UserMapper extends BaseMapper<User> {
    // 复杂 SQL 仍可像原生 MyBatis 一样自己写
}

// 用条件构造器查询，无需写 SQL
List<User> list = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .like(User::getUsername, "张")
        .ge(User::getAge, 18)
        .orderByDesc(User::getId));`}
    />
    <Table
      head={['能力', '原生 MyBatis', 'MyBatis-Plus']}
      rows={[
        ['单表 CRUD', '自己写 SQL', '内置，零 SQL'],
        ['分页', '靠 PageHelper 等插件', '内置分页插件'],
        ['条件拼接', '动态 SQL 标签', 'QueryWrapper / LambdaQueryWrapper'],
        ['复杂多表 SQL', '手写', <Text bold>同样手写（和 MyBatis 一致）</Text>],
      ]}
    />
    <Callout type="tip">
      实际企业项目<Text bold>大量使用 MyBatis-Plus</Text>：简单表用它的内置方法提效，
      复杂查询回落到原生 MyBatis 写 XML。先把本套 MyBatis 基础打牢，MP 上手会非常快。
    </Callout>

    <Divider />

    <Subtitle>四、最佳实践清单</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>开启驼峰映射</Text>：<InlineCode>map-underscore-to-camel-case: true</InlineCode>，
        省掉大量 resultMap。
      </ListItem>
      <ListItem>
        <Text bold>传值一律 #{'{}'}</Text>，动态表名/排序用 ${'{}'} 时务必白名单校验。
      </ListItem>
      <ListItem>
        <Text bold>多参数加 @Param</Text>；优先用对象/接口传参，少用 Map。
      </ListItem>
      <ListItem>
        <Text bold>事务交给 @Transactional</Text>，不要手写 commit；注意它只对
        <Text bold>非 RuntimeException</Text> 默认不回滚，必要时配{' '}
        <InlineCode>rollbackFor = Exception.class</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>避免 SELECT *</Text>，用 <InlineCode>{'<sql>'}</InlineCode> 维护字段列表；关联查询警惕 N+1。
      </ListItem>
      <ListItem>
        <Text bold>开发期开 SQL 日志</Text>（Mapper 包日志级别设 debug），上线关掉或降级。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>五、常见报错速查</Subtitle>
    <Table
      head={['报错关键字', '原因', '解决']}
      rows={[
        [
          'Invalid bound statement (not found)',
          'XML 没被加载 / namespace 或 id 对不上 / XML 没打进 jar',
          '查 mapper-locations、namespace=接口全限定名、id=方法名',
        ],
        [
          "Parameter 'xxx' not found",
          '多参数没加 @Param',
          '给每个参数加 @Param("xxx")',
        ],
        [
          'There is no getter for property',
          '#{} 里的名字在参数对象里没有对应属性/getter',
          '核对属性名拼写，或用 @Param 命名',
        ],
        [
          'TooManyResultsException',
          '期望单条却查出多条',
          '改用 List 返回，或在 SQL 加唯一条件 / LIMIT 1',
        ],
        [
          '列名映射不上（字段为 null）',
          '列名≠字段名且没开驼峰/没配 resultMap',
          '开驼峰映射、用别名，或写 resultMap',
        ],
      ]}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          整合 Spring 后：Session 和事务由 Spring 托管，Mapper 用
          <InlineCode>@MapperScan</InlineCode> + <InlineCode>@Autowired</InlineCode>，
          事务用 <InlineCode>@Transactional</InlineCode>。
        </ListItem>
        <ListItem>
          <Text bold>MyBatis-Plus</Text> 让单表 CRUD 零代码，复杂 SQL 仍回落原生 MyBatis。
        </ListItem>
        <ListItem>
          记牢最佳实践（驼峰、#{'{}'}、@Param、@Transactional、防 N+1）和常见报错速查表。
        </ListItem>
        <ListItem>
          至此 MyBatis 基础与实战已成体系，配合 SQL 功底即可上手企业持久层开发。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
