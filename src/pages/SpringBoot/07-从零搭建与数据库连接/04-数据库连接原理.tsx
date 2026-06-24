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
    <Title>数据库连接原理（核心）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        这一节是整篇的<Text bold>核心</Text>：讲清一个 Java 程序连上数据库到底需要哪些东西、
        JDBC URL 每段是什么意思，以及 Spring Boot 为什么「不写连接代码也能自动连上」。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、连数据库需要这 4（+1）样东西</Subtitle>
    <Table
      head={['#', '东西', '说明', '在本项目哪里']}
      rows={[
        [
          '①',
          '驱动 Driver',
          'Java 用 JDBC 作统一接口标准，但各数据库协议不同，要各自的驱动 jar。连 MySQL 用 mysql-connector-java（提供 com.mysql.cj.jdbc.Driver）',
          'pom.xml 依赖',
        ],
        [
          '②',
          '连接地址 JDBC URL',
          '告诉程序「库在哪、怎么连」',
          'application.yml 的 spring.datasource.url',
        ],
        ['③', '凭证', '用户名 / 密码', 'username / password'],
        [
          '④',
          '连接池',
          '预开一批连接反复复用，而非每次查询新开。Spring Boot 默认用 HikariCP',
          '自动',
        ],
        [
          '+⑤',
          '方言 Dialect',
          '告诉 Hibernate 按哪种数据库的语法生成 SQL',
          'database-platform: ...MySQL8Dialect',
        ],
      ]}
    />

    <Divider />

    <Subtitle>二、JDBC URL 拆解</Subtitle>
    <CodeBlock
      language="text"
      code={`jdbc:mysql://localhost:3306/sms?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true`}
    />
    <UnorderedList>
      <ListItem><InlineCode>jdbc:mysql://</InlineCode>——用 JDBC、走 mysql 驱动</ListItem>
      <ListItem><InlineCode>localhost:3306</InlineCode>——数据库在本机、3306 端口</ListItem>
      <ListItem><InlineCode>/sms</InlineCode>——连名为 <InlineCode>sms</InlineCode> 的库</ListItem>
      <ListItem>
        <InlineCode>createDatabaseIfNotExist=true</InlineCode>——库不存在就自动建（所以没手动建 sms 也能用）
      </ListItem>
      <ListItem>
        <InlineCode>serverTimezone=Asia/Shanghai</InlineCode>——时区（不写有的版本报错）
      </ListItem>
      <ListItem>
        <InlineCode>characterEncoding=utf8</InlineCode>——按 UTF-8 传输，中文不乱码
      </ListItem>
      <ListItem>
        <InlineCode>useSSL=false</InlineCode> / <InlineCode>allowPublicKeyRetrieval=true</InlineCode>——本地关 SSL、配合 MySQL8 密码加密方式取公钥
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>三、Spring Boot 怎么「自动连上」</Subtitle>
    <Paragraph>传统 JDBC 要手写：</Paragraph>
    <CodeBlock
      language="java"
      code={`Class.forName("com.mysql.cj.jdbc.Driver");
Connection c = DriverManager.getConnection(url, user, password);`}
    />
    <Paragraph>
      Spring Boot 帮你省了：启动时它发现「classpath 有 JDBC 驱动 + 你配了 <InlineCode>spring.datasource.*</InlineCode>」，
      就<Text bold>自动</Text>创建一个带 HikariCP 连接池的 <InlineCode>DataSource</InlineCode> 并注入。
      你一行连接代码都不用写——这叫<Text bold>自动配置（auto-configuration）</Text>。
    </Paragraph>

    <Divider />

    <Subtitle>四、profile：一套代码切不同数据库</Subtitle>
    <UnorderedList>
      <ListItem><InlineCode>src/main/resources/application.yml</InlineCode> 是默认配置。</ListItem>
      <ListItem>
        可以再放 <InlineCode>{'application-{名字}.yml'}</InlineCode> 作为某个 profile 的配置。
      </ListItem>
      <ListItem>
        启动加 <InlineCode>--spring.profiles.active=名字</InlineCode>，该 profile 的配置会<Text bold>覆盖</Text>默认值。
      </ListItem>
      <ListItem>这就是「换数据库不改 Java 代码、只切配置」的原理。</ListItem>
    </UnorderedList>
    <Callout type="tip">
      <Paragraph>
        本项目最终把默认配置直接设成了 MySQL（见下一节），所以<Text bold>日常启动不需要任何 profile 参数</Text>。
      </Paragraph>
    </Callout>
  </article>
);

export default index;
