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
    <Title>起步依赖与自动配置</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节讲了 IoC/DI——Spring 的「内功」。这一节讲 Spring Boot 真正让人爽的两个特性：
        <Text bold>起步依赖（Starter）</Text>解决「jar 包怎么引」，
        <Text bold>自动配置</Text>解决「组件怎么配」。最后揭秘那个无处不在的{' '}
        <InlineCode>@SpringBootApplication</InlineCode> 注解。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、起步依赖 Starter：一个顶一堆</Subtitle>
    <Paragraph>
      传统项目里，做 Web 开发你得手动引入 Spring MVC、Tomcat、Jackson(JSON)、日志……一大堆 jar，还要保证版本互相兼容。
      Spring Boot 把它们打包成一个<Text bold>「起步依赖」</Text>：你只引<Text bold>一个</Text>，全套就齐了。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml —— 一个依赖搞定整个 Web 开发"
      code={`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <!-- 注意：没写 version！版本由父工程统一管理（见第二节） -->
</dependency>`}
    />
    <Paragraph>常用 Starter 一览（按需引入即可）：</Paragraph>
    <Table
      head={['Starter', '作用']}
      rows={[
        ['spring-boot-starter-web', 'Web 开发全家桶：Spring MVC + 内嵌 Tomcat + JSON'],
        ['spring-boot-starter-validation', '参数校验（Hibernate Validator）'],
        ['spring-boot-starter-jdbc', 'JDBC + HikariCP 连接池'],
        ['spring-boot-starter-test', '测试套件：JUnit 5 + Mockito（默认自带）'],
        ['spring-boot-starter-aop', '面向切面编程'],
        ['mybatis-spring-boot-starter', '整合 MyBatis（第三方提供，非官方 org.springframework.boot）'],
      ]}
    />
    <Callout type="tip">
      官方 Starter 命名都是 <InlineCode>spring-boot-starter-*</InlineCode>；第三方（如 MyBatis、Knife4j）提供的则形如
      <InlineCode>*-spring-boot-starter</InlineCode>，注意区分前后缀。
    </Callout>

    <Divider />

    <Subtitle>二、版本仲裁：为什么不用写 version</Subtitle>
    <Paragraph>
      上面的依赖没有 <InlineCode>{'<version>'}</InlineCode>，却不会报错——因为项目「继承」了一个
      <Text bold>父工程 spring-boot-starter-parent</Text>，它已经把几百个常用依赖的兼容版本都定好了，这叫
      <Text accent bold>版本仲裁</Text>。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml 顶部 —— 继承父工程"
      code={`<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.5</version>  <!-- 以 start.spring.io 生成的最新 3.x 稳定版为准 -->
    <relativePath/>
</parent>

<properties>
    <java.version>17</java.version>  <!-- 指定 JDK 版本，父工程会据此配置编译插件 -->
</properties>`}
    />
    <Callout type="success">
      好处：你只在 <InlineCode>{'<parent>'}</InlineCode> 里维护<Text bold>一个</Text> Spring Boot 版本号，
      所有官方依赖的版本就都对齐了，从根上杜绝「依赖版本冲突」。
    </Callout>

    <Divider />

    <Subtitle>三、自动配置：约定优于配置</Subtitle>
    <Paragraph>
      引入 starter 只是「把 jar 放进来」，<Text bold>自动配置</Text>才是真正帮你「把组件配好」的魔法。它的逻辑是
      <Text bold>「按需装配」</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>检测到 classpath 里有 Tomcat 相关类 → 自动配好并启动一个内嵌 Tomcat；</ListItem>
      <ListItem>检测到有 Spring MVC 的类 → 自动配好 <InlineCode>DispatcherServlet</InlineCode>、JSON 转换器等；</ListItem>
      <ListItem>检测到你配了数据库连接信息 → 自动配好数据源（连接池）。</ListItem>
    </UnorderedList>
    <Paragraph>
      这套机制底层靠的是<Text bold>条件装配注解</Text>（如 <InlineCode>@ConditionalOnClass</InlineCode>、
      <InlineCode>@ConditionalOnMissingBean</InlineCode>）：满足条件才装配。
      而「约定优于配置」意味着——<Text bold>默认值通常就是对的</Text>（比如端口默认 8080），你只在需要改时才写配置。
    </Paragraph>

    <Divider />

    <Subtitle>四、揭秘 @SpringBootApplication</Subtitle>
    <Paragraph>
      启动类上那个 <InlineCode>@SpringBootApplication</InlineCode> 是个「组合注解」，等价于同时贴了三个注解：
    </Paragraph>
    <Table
      head={['它包含的注解', '作用']}
      rows={[
        ['@SpringBootConfiguration', '标记这是一个配置类'],
        ['@EnableAutoConfiguration', '开启上面讲的「自动配置」总开关'],
        ['@ComponentScan', '开启组件扫描（默认扫描本类所在包及子包）'],
      ]}
    />
    <CodeBlock
      title="所以这两种写法是等价的"
      code={`// 写法一：组合注解（实际开发都这么写）
@SpringBootApplication
public class DemoApplication { /* ... */ }

// 写法二：拆开写（仅用于理解，不要这样写）
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan
public class DemoApplication { /* ... */ }`}
    />
    <Callout type="danger" title="呼应上一节的坑">
      正因为 <InlineCode>@ComponentScan</InlineCode> 默认从「启动类所在包」开始扫描，所以
      <Text bold>启动类必须放在所有业务包的最外层</Text>，否则下层的 <InlineCode>@Service</InlineCode> 等扫不到。
    </Callout>

    <Divider />

    <Subtitle>五、查看到底生效了哪些自动配置</Subtitle>
    <Paragraph>
      想知道「Spring Boot 偷偷帮我配了什么」，在 <InlineCode>application.properties</InlineCode> 里开启调试日志：
    </Paragraph>
    <CodeBlock
      language="properties"
      title="application.properties"
      code={`debug=true`}
    />
    <Paragraph>
      重新启动，控制台会打印一份 <Text bold>CONDITIONS EVALUATION REPORT</Text>，
      分两部分：<InlineCode>Positive matches</InlineCode>（已生效的自动配置）和
      <InlineCode>Negative matches</InlineCode>（因条件不满足而跳过的）。这是排查「为什么某配置没生效」的利器。
    </Paragraph>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><Text bold>起步依赖</Text>：一个 starter 引入一整套兼容的 jar，按需选用。</ListItem>
        <ListItem><Text bold>版本仲裁</Text>：继承 <InlineCode>spring-boot-starter-parent</InlineCode>，依赖不用写版本号，从根上避免冲突。</ListItem>
        <ListItem><Text bold>自动配置</Text>：按 classpath 里有什么、缺什么 Bean，自动「条件装配」组件。</ListItem>
        <ListItem><InlineCode>@SpringBootApplication</InlineCode> = 配置类 + 开启自动配置 + 组件扫描。</ListItem>
        <ListItem>用 <InlineCode>debug=true</InlineCode> 可查看自动配置的生效报告。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
