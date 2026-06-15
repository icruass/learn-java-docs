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
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>快速入门：第一个 MyBatis 程序</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        理论讲再多不如跑一遍。本节用最朴素的方式（不依赖 Spring）搭一个 MyBatis
        工程，完成「按 id 查询用户」。跑通后你就掌握了 MyBatis 的
        <Text bold>五件套</Text>：依赖、全局配置、实体类、Mapper（接口 + XML）、启动代码。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>〇、准备数据库</Subtitle>
    <CodeBlock
      language="sql"
      code={`CREATE DATABASE IF NOT EXISTS mybatis_demo DEFAULT CHARSET utf8mb4;
USE mybatis_demo;

CREATE TABLE user (
    id          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(50)  NOT NULL,
    age         INT,
    email       VARCHAR(100)
);

INSERT INTO user (username, age, email) VALUES
('张三', 25, 'zhangsan@example.com'),
('李四', 30, 'lisi@example.com');`}
    />

    <Divider />

    <Subtitle>一、引入依赖</Subtitle>
    <CodeBlock
      language="xml"
      title="pom.xml"
      code={`<dependencies>
    <!-- MyBatis 核心 -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.16</version>
    </dependency>
    <!-- MySQL 驱动 -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.4.0</version>
    </dependency>
</dependencies>`}
    />

    <Divider />

    <Subtitle>二、全局配置文件 mybatis-config.xml</Subtitle>
    <Paragraph>
      放在 <InlineCode>resources</InlineCode> 根目录，告诉 MyBatis：连哪个库、加载哪些
      Mapper。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="resources/mybatis-config.xml"
      code={`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!-- 开启驼峰映射：列名 user_name 自动对应字段 userName（企业必开） -->
    <settings>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>

    <!-- 给实体类起别名，XML 里就能用 user 代替 com.example.entity.User -->
    <typeAliases>
        <package name="com.example.entity"/>
    </typeAliases>

    <!-- 数据库环境 -->
    <environments default="dev">
        <environment id="dev">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">  <!-- POOLED：MyBatis 自带的简单连接池 -->
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis_demo?useSSL=false&amp;serverTimezone=Asia/Shanghai"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 注册 Mapper 映射文件 -->
    <mappers>
        <mapper resource="mapper/UserMapper.xml"/>
    </mappers>

</configuration>`}
    />
    <Callout type="warning">
      XML 里 URL 的 <InlineCode>&</InlineCode> 必须写成 <InlineCode>&amp;amp;</InlineCode>
      （转义），否则解析报错。
    </Callout>

    <Divider />

    <Subtitle>三、实体类（POJO）</Subtitle>
    <CodeBlock
      language="java"
      title="com/example/entity/User.java"
      code={`public class User {
    private Long id;
    private String username;
    private Integer age;
    private String email;
    // 省略：无参构造 + getter/setter + toString
}`}
    />
    <Callout type="tip">
      字段类型一律用<Text bold>包装类型</Text>（<InlineCode>Long</InlineCode>、
      <InlineCode>Integer</InlineCode>）而非基本类型（<InlineCode>long</InlineCode>、
      <InlineCode>int</InlineCode>）：数据库 <InlineCode>NULL</InlineCode> 能正确映射为{' '}
      <InlineCode>null</InlineCode>，基本类型会报错或给默认值。
    </Callout>

    <Divider />

    <Subtitle>四、Mapper：接口 + XML</Subtitle>
    <Paragraph>
      <Text bold>接口</Text>只写方法声明（不写实现，MyBatis 运行时会生成代理）：
    </Paragraph>
    <CodeBlock
      language="java"
      title="com/example/mapper/UserMapper.java"
      code={`public interface UserMapper {
    User selectById(Long id);
}`}
    />
    <Paragraph>
      <Text bold>XML</Text> 写 SQL，靠 <InlineCode>namespace</InlineCode> +{' '}
      <InlineCode>id</InlineCode> 与接口方法一一对应：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="resources/mapper/UserMapper.xml"
      code={`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!-- namespace 必须是 Mapper 接口的全限定名 -->
<mapper namespace="com.example.mapper.UserMapper">

    <!-- id 必须等于接口里的方法名；resultType 是返回的实体类型（已配别名，写 user） -->
    <select id="selectById" resultType="user">
        SELECT * FROM user WHERE id = #{id}
    </select>

</mapper>`}
    />
    <Callout type="danger" title="三个「必须对上」">
      <OrderedList>
        <ListItem>
          XML 的 <InlineCode>namespace</InlineCode> = 接口的<Text bold>全限定类名</Text>；
        </ListItem>
        <ListItem>
          标签的 <InlineCode>id</InlineCode> = 接口的<Text bold>方法名</Text>；
        </ListItem>
        <ListItem>
          参数 / 返回类型与方法签名一致。三者任一对不上都会在运行时报错。
        </ListItem>
      </OrderedList>
    </Callout>

    <Divider />

    <Subtitle>五、启动代码：跑通它</Subtitle>
    <CodeBlock
      language="java"
      title="测试 main 方法"
      code={`import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import java.io.InputStream;

public class MyBatisDemo {
    public static void main(String[] args) throws Exception {
        // 1. 读取全局配置，构建 SqlSessionFactory（整个应用只建一次）
        InputStream in = Resources.getResourceAsStream("mybatis-config.xml");
        SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(in);

        // 2. 开启一次会话（一次数据库操作的上下文）
        try (SqlSession session = factory.openSession()) {
            // 3. 拿到 Mapper 接口的代理对象
            UserMapper mapper = session.getMapper(UserMapper.class);
            // 4. 像调用普通方法一样执行 SQL
            User user = mapper.selectById(1L);
            System.out.println(user);
        } // try-with-resources 自动 close session
    }
}`}
    />
    <Paragraph>运行，控制台打印出 id=1 的用户，第一个 MyBatis 程序就跑通了。</Paragraph>

    <Divider />

    <Subtitle>六、强烈建议：开启 SQL 日志</Subtitle>
    <Paragraph>
      开发时一定要能看到 MyBatis 实际执行的 SQL 和参数。最简单的方式是在{' '}
      <InlineCode>settings</InlineCode> 里加一行（用标准输出打印）：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="mybatis-config.xml 的 settings 内追加"
      code={`<setting name="logImpl" value="STDOUT_LOGGING"/>`}
    />
    <Callout type="tip">
      生产项目通常配 <InlineCode>SLF4J</InlineCode> + Logback 打到日志文件；Spring Boot
      里则只需在配置文件设置 Mapper 包的日志级别为 <InlineCode>debug</InlineCode> 即可。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          MyBatis 工程五件套：<Text bold>依赖、mybatis-config.xml、实体类、Mapper（接口+XML）、启动代码</Text>。
        </ListItem>
        <ListItem>
          启动三步走：<InlineCode>SqlSessionFactoryBuilder</InlineCode> →{' '}
          <InlineCode>SqlSessionFactory</InlineCode> →{' '}
          <InlineCode>SqlSession.getMapper()</InlineCode>。
        </ListItem>
        <ListItem>
          接口与 XML 靠 <Text bold>namespace=全限定名、id=方法名</Text> 绑定。
        </ListItem>
        <ListItem>
          实体字段用包装类型；开发期务必开启 SQL 日志。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
