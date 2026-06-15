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
    <Title>整合 MyBatis</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前面章节的 Mapper 一直是「占位符」。这一节把 MyBatis 真正接入 Spring Boot，
        配通数据库，并讲清楚两种写 SQL 的方式：<Text bold>注解 SQL</Text>（简单语句）和
        <Text bold>XML 映射文件</Text>（复杂查询）。本节完成后，整个项目就能读写数据库了。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、引入依赖</Subtitle>
    <CodeBlock
      language="xml"
      title="pom.xml"
      code={`<!-- MyBatis Spring Boot Starter -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.3</version>   <!-- 对应 Spring Boot 3.x 的版本，注意 MyBatis 3.0+ 才支持 SB3 -->
</dependency>

<!-- MySQL 驱动 -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Lombok（简化实体类） -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>`}
    />

    <Divider />

    <Subtitle>二、配置数据源</Subtitle>
    <CodeBlock
      language="yaml"
      title="application-dev.yml"
      code={`spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8
    username: root
    password: "123456"

mybatis:
  mapper-locations: classpath:mapper/*.xml          # XML 文件位置
  type-aliases-package: com.example.demo.entity     # 实体类包（XML 中可省略全类名）
  configuration:
    map-underscore-to-camel-case: true              # 列名 user_name → 字段 userName（强烈推荐）`}
    />

    <Divider />

    <Subtitle>三、准备数据库表和实体类</Subtitle>
    <CodeBlock
      language="sql"
      title="建表 SQL"
      code={`CREATE TABLE user (
    id          BIGINT       PRIMARY KEY AUTO_INCREMENT,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(100),
    age         INT,
    create_time DATETIME     DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO user (username, email, age) VALUES
('张三', 'zhangsan@example.com', 25),
('李四', 'lisi@example.com', 30);`}
    />
    <CodeBlock
      title="entity/User.java"
      code={`package com.example.demo.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data   // Lombok：自动生成 getter/setter/toString/equals/hashCode
public class User {
    private Long id;
    private String username;
    private String email;
    private Integer age;
    private LocalDateTime createTime;   // 数据库 create_time → Java createTime（靠 map-underscore-to-camel-case）
}`}
    />

    <Divider />

    <Subtitle>四、Mapper 接口：两种写 SQL 的方式</Subtitle>

    <Paragraph>
      <Text bold>方式 A：注解 SQL</Text>（适合简单语句，直接写在接口方法上）
    </Paragraph>
    <CodeBlock
      title="mapper/UserMapper.java（注解方式）"
      code={`package com.example.demo.mapper;

import com.example.demo.entity.User;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper   // 告诉 MyBatis 这是 Mapper 接口，自动生成代理实现类
public interface UserMapper {

    @Select("SELECT * FROM user")
    List<User> selectAll();

    @Select("SELECT * FROM user WHERE id = #{id}")
    User selectById(Long id);

    @Select("SELECT * FROM user WHERE username = #{username}")
    User selectByUsername(String username);

    @Insert("INSERT INTO user(username, email, age) VALUES(#{username}, #{email}, #{age})")
    @Options(useGeneratedKeys = true, keyProperty = "id")  // 回填自增主键
    int insert(User user);

    @Update("UPDATE user SET username=#{username}, email=#{email}, age=#{age} WHERE id=#{id}")
    int updateById(User user);

    @Delete("DELETE FROM user WHERE id = #{id}")
    int deleteById(Long id);
}`}
    />

    <Paragraph>
      <Text bold>方式 B：XML 映射文件</Text>（适合复杂 SQL，如动态查询、多表关联）
    </Paragraph>
    <CodeBlock
      title="mapper/UserMapper.java（接口，只写方法声明）"
      code={`@Mapper
public interface UserMapper {
    List<User> selectAll();
    User selectById(Long id);
    int insert(User user);
    int updateById(User user);
    int deleteById(Long id);
    // 复杂查询：带动态条件
    List<User> selectByCondition(@Param("username") String username,
                                  @Param("minAge") Integer minAge);
}`}
    />
    <CodeBlock
      language="xml"
      title="resources/mapper/UserMapper.xml"
      code={`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.demo.mapper.UserMapper">

    <!-- resultType 可以省略包名，因为配了 type-aliases-package -->
    <select id="selectAll" resultType="User">
        SELECT * FROM user
    </select>

    <select id="selectById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>

    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO user(username, email, age)
        VALUES(#{username}, #{email}, #{age})
    </insert>

    <update id="updateById">
        UPDATE user
        <set>
            <if test="username != null">username = #{username},</if>
            <if test="email != null">email = #{email},</if>
            <if test="age != null">age = #{age},</if>
        </set>
        WHERE id = #{id}
    </update>

    <delete id="deleteById">
        DELETE FROM user WHERE id = #{id}
    </delete>

    <!-- 动态查询：username 和 minAge 都是可选条件 -->
    <select id="selectByCondition" resultType="User">
        SELECT * FROM user
        <where>
            <if test="username != null and username != ''">
                AND username LIKE CONCAT('%', #{username}, '%')
            </if>
            <if test="minAge != null">
                AND age >= #{minAge}
            </if>
        </where>
        ORDER BY id DESC
    </select>

</mapper>`}
    />

    <Divider />

    <Subtitle>五、启用 Mapper 扫描</Subtitle>
    <Paragraph>有两种方式，二选一：</Paragraph>
    <CodeBlock
      title="方式 A：每个 Mapper 接口加 @Mapper（上面已用）"
      code={`@Mapper
public interface UserMapper { ... }`}
    />
    <CodeBlock
      title="方式 B：在启动类加 @MapperScan（一劳永逸）"
      code={`@SpringBootApplication
@MapperScan("com.example.demo.mapper")   // 指定 Mapper 包，包下接口自动注册
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}`}
    />
    <Callout type="tip">
      推荐用 <InlineCode>@MapperScan</InlineCode>：启动类声明一次，Mapper 包下所有接口都不用再单独加 <InlineCode>@Mapper</InlineCode>。
    </Callout>

    <Table
      head={['对比项', '注解 SQL', 'XML 映射文件']}
      rows={[
        ['适用场景', '简单 CRUD，SQL 短且固定', '动态 SQL、复杂多表查询'],
        ['可读性', '分散在代码里，简单的场景直观', '集中在 XML，长 SQL 更好管理'],
        ['可维护性', '改 SQL 要改 Java 文件', '改 XML 不需重新编译（热部署友好）'],
        ['团队惯例', '小项目 / 快速原型', '企业级项目主流选择'],
      ]}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>引入 <InlineCode>mybatis-spring-boot-starter</InlineCode> + <InlineCode>mysql-connector-j</InlineCode>，配置 <InlineCode>spring.datasource</InlineCode> 和 <InlineCode>mybatis.*</InlineCode>。</ListItem>
        <ListItem>开启 <InlineCode>map-underscore-to-camel-case: true</InlineCode>，数据库下划线自动映射为 Java 驼峰。</ListItem>
        <ListItem>简单 SQL 用注解，复杂/动态 SQL 用 XML——二者可以混用。</ListItem>
        <ListItem>启动类加 <InlineCode>@MapperScan</InlineCode>，整包 Mapper 接口一次注册。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
