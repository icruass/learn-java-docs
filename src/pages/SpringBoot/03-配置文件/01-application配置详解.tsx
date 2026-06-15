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
    <Title>application 配置详解</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>application.yml</InlineCode> 是 Spring Boot 的「总控台」——端口、数据库连接、日志级别……
        几乎所有运行参数都在这里控制。本节先搞清楚两种格式的区别，再把最常用的配置项逐条讲清楚。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、两种格式：properties vs yaml</Subtitle>
    <Paragraph>
      Spring Boot 支持 <InlineCode>.properties</InlineCode> 和 <InlineCode>.yml</InlineCode> 两种格式，功能完全等价。
      <Text bold>新项目推荐用 yml</Text>：层级结构更清晰，重复前缀不用写多遍。
    </Paragraph>
    <CodeBlock
      language="properties"
      title="application.properties 写法"
      code={`server.port=8080
server.servlet.context-path=/api
spring.datasource.url=jdbc:mysql://localhost:3306/demo
spring.datasource.username=root
spring.datasource.password=123456`}
    />
    <CodeBlock
      language="yaml"
      title="application.yml 写法（等价，推荐）"
      code={`server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo
    username: root
    password: "123456"    # 纯数字密码加引号，防止被当成数字解析`}
    />
    <Callout type="warning" title="yml 语法注意事项">
      <UnorderedList>
        <ListItem>冒号后面<Text bold>必须有一个空格</Text>：<InlineCode>key: value</InlineCode>，不能写成 <InlineCode>key:value</InlineCode>。</ListItem>
        <ListItem>用<Text bold>缩进（2 个空格）</Text>表示层级，<Text bold>不能用 Tab</Text>。</ListItem>
        <ListItem>纯数字的字符串值（如密码 <InlineCode>123456</InlineCode>）要加引号，否则被解析成整数。</ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>二、常用配置项速查</Subtitle>
    <Paragraph>以下是企业开发最常见的配置，按模块分类：</Paragraph>

    <Paragraph><Text bold>服务器配置</Text></Paragraph>
    <CodeBlock
      language="yaml"
      code={`server:
  port: 8080                        # 监听端口，默认 8080
  servlet:
    context-path: /api              # 接口统一前缀，默认 /（无前缀）
  tomcat:
    connection-timeout: 20000       # 连接超时（毫秒）
    threads:
      max: 200                      # 最大线程数`}
    />

    <Paragraph><Text bold>数据库连接（整合 MyBatis 时）</Text></Paragraph>
    <CodeBlock
      language="yaml"
      code={`spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8
    username: root
    password: "your_password"
    driver-class-name: com.mysql.cj.jdbc.Driver   # Spring Boot 通常能自动推断，可省略
    hikari:                         # HikariCP 连接池（Spring Boot 默认）
      maximum-pool-size: 20         # 最大连接数
      minimum-idle: 5               # 最小空闲连接数`}
    />

    <Paragraph><Text bold>MyBatis 配置</Text></Paragraph>
    <CodeBlock
      language="yaml"
      code={`mybatis:
  mapper-locations: classpath:mapper/*.xml          # XML 映射文件位置
  type-aliases-package: com.example.demo.entity     # 实体类包，mapper xml 中可省略全类名
  configuration:
    map-underscore-to-camel-case: true  # 数据库下划线 user_name → Java 驼峰 userName（强烈推荐开启）
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  # 开发时打印 SQL，上线前关掉`}
    />

    <Paragraph><Text bold>应用基本信息</Text></Paragraph>
    <CodeBlock
      language="yaml"
      code={`spring:
  application:
    name: user-service    # 应用名称，微服务注册发现时用到`}
    />

    <Divider />

    <Subtitle>三、配置优先级（从高到低）</Subtitle>
    <Paragraph>
      同一个配置项可以在多个地方设置，Spring Boot 按以下优先级取值（数字越小越高）：
    </Paragraph>
    <Table
      head={['优先级', '来源', '常见场景']}
      rows={[
        ['1（最高）', '命令行参数 --server.port=9000', '临时修改，上线运维常用'],
        ['2', 'JAVA_OPTS / 系统环境变量', 'Docker / K8s 注入配置'],
        ['3', 'application-{profile}.yml（激活的 profile）', '多环境配置（下节讲）'],
        ['4', 'application.yml / .properties', '默认配置'],
        ['5（最低）', '代码里的默认值（@Value 的 defaultValue）', '兜底'],
      ]}
    />
    <Callout type="tip">
      这个优先级很重要：上线时通过<Text bold>命令行参数或环境变量覆盖</Text>数据库密码等敏感配置，
      不用改代码也不用动配置文件，安全又方便。
    </Callout>

    <Divider />

    <Subtitle>四、查 IDE 配置提示</Subtitle>
    <Paragraph>
      在 <InlineCode>application.yml</InlineCode> 里输入前缀（如 <InlineCode>server.</InlineCode>），
      IDEA 会弹出智能提示。若提示没出现，检查是否引入了：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml —— 开启配置提示支持"
      code={`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>`}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>新项目统一用 <InlineCode>application.yml</InlineCode>，冒号后空格、2 空格缩进、纯数字字符串加引号。</ListItem>
        <ListItem>常用配置：<InlineCode>server.port</InlineCode>、<InlineCode>spring.datasource.*</InlineCode>、<InlineCode>mybatis.*</InlineCode>。</ListItem>
        <ListItem>优先级：命令行 {'>'} 环境变量 {'>'} profile 配置 {'>'} application.yml {'>'} 代码默认值。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
