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
    <Title>多环境 Profiles 与日志</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        同一个项目在<Text bold>开发、测试、生产</Text>三个环境下数据库地址、日志级别、第三方接口都不同。
        <Text bold>Spring Profiles</Text> 让你优雅地管理多套配置，做到「一套代码、多套配置、切换只要改一行」。
        最后再讲日志配置——这是排查线上问题的必备技能。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、多环境配置文件命名规则</Subtitle>
    <Paragraph>
      在 <InlineCode>src/main/resources/</InlineCode> 下按规则建多个配置文件：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`resources/
├── application.yml           ← 公共配置（所有环境共享）
├── application-dev.yml       ← 开发环境专属配置
├── application-test.yml      ← 测试环境专属配置
└── application-prod.yml      ← 生产环境专属配置`}
    />
    <Paragraph>
      命名规则：<InlineCode>{'application-{profile名}.yml'}</InlineCode>。
      激活哪个 profile，对应文件就生效，且<Text bold>会覆盖 application.yml 中的同名配置</Text>（公共配置仍保留）。
    </Paragraph>

    <Divider />

    <Subtitle>二、激活 Profile：三种方式</Subtitle>

    <Paragraph><Text bold>方式 1：在 application.yml 里指定（开发常用）</Text></Paragraph>
    <CodeBlock
      language="yaml"
      title="application.yml"
      code={`spring:
  profiles:
    active: dev     # 激活 dev profile，会加载 application-dev.yml`}
    />

    <Paragraph><Text bold>方式 2：命令行参数（上线运维常用，优先级最高）</Text></Paragraph>
    <CodeBlock
      language="bash"
      code={`# 启动时指定，会覆盖 application.yml 里的 active
java -jar app.jar --spring.profiles.active=prod`}
    />

    <Paragraph><Text bold>方式 3：环境变量（Docker / K8s 常用）</Text></Paragraph>
    <CodeBlock
      language="bash"
      code={`SPRING_PROFILES_ACTIVE=prod java -jar app.jar`}
    />
    <Callout type="tip">
      <Text bold>最佳实践</Text>：<InlineCode>application.yml</InlineCode> 里写 <InlineCode>active: dev</InlineCode>
      作为开发默认值；上线时通过命令行或环境变量覆盖为 <InlineCode>prod</InlineCode>，
      不用修改任何文件，一键切换。
    </Callout>

    <Divider />

    <Subtitle>三、配置文件示例</Subtitle>
    <CodeBlock
      language="yaml"
      title="application.yml（公共配置）"
      code={`spring:
  application:
    name: demo
  profiles:
    active: dev         # 默认激活开发环境

# 公共的 MyBatis 配置（各环境相同）
mybatis:
  configuration:
    map-underscore-to-camel-case: true`}
    />
    <CodeBlock
      language="yaml"
      title="application-dev.yml（开发环境）"
      code={`server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo_dev?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: "123456"

# 开发环境：打印 SQL 日志，方便调试
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

logging:
  level:
    com.example.demo: debug   # 自己的代码打 debug 级别`}
    />
    <CodeBlock
      language="yaml"
      title="application-prod.yml（生产环境）"
      code={`server:
  port: 80

spring:
  datasource:
    url: jdbc:mysql://prod-db-server:3306/demo?useSSL=true&serverTimezone=Asia/Shanghai
    username: \${DB_USERNAME}    # 从环境变量读取，不硬编码密码！
    password: \${DB_PASSWORD}

logging:
  level:
    root: warn                  # 生产环境只打 warn 及以上，减少 I/O`}
    />
    <Callout type="danger" title="生产环境密码绝对不能硬编码">
      生产配置里的密码用 <InlineCode>${'{DB_PASSWORD}'}</InlineCode> 语法引用环境变量，
      通过 K8s Secret / 运维配置下发，源码仓库里不存任何明文密码。
    </Callout>

    <Divider />

    <Subtitle>四、日志配置</Subtitle>
    <Paragraph>
      Spring Boot 默认使用 <Text bold>Logback</Text> 作为日志实现，你只需在 yml 里配几行就够了：
    </Paragraph>
    <CodeBlock
      language="yaml"
      title="application.yml 日志配置"
      code={`logging:
  level:
    root: info                          # 全局日志级别（默认 info）
    com.example.demo.mapper: debug      # 某个包单独设级别（如打印 SQL）
    org.springframework.web: warn       # Spring Web 只打 warn 及以上，减少噪音
  file:
    name: logs/app.log                  # 输出到文件（相对路径，从项目根目录起）
  pattern:
    console: "%d{HH:mm:ss} %-5level [%thread] %logger{36} - %msg%n"   # 控制台格式`}
    />

    <Paragraph>日志级别从低到高（越高越严重，设了某级别就只打该级别及以上的）：</Paragraph>
    <Table
      head={['级别', '使用场景']}
      rows={[
        ['TRACE', '最详细的跟踪，极少用'],
        ['DEBUG', '开发调试，如 SQL 语句、变量值'],
        ['INFO', '关键业务流程节点（默认级别）'],
        ['WARN', '可恢复的异常或配置问题'],
        ['ERROR', '需要立即处理的错误'],
      ]}
    />

    <Paragraph>在代码里用日志（用 <InlineCode>Logger</InlineCode>，不要用 <InlineCode>System.out.println</InlineCode>）：</Paragraph>
    <CodeBlock
      title="规范写法（推荐 Lombok @Slf4j）"
      code={`import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j         // Lombok 注解，自动生成 private static final Logger log = ...
@Service
public class UserService {

    public void createUser(String username) {
        log.info("创建用户：{}", username);       // {} 是占位符，比字符串拼接高效
        try {
            // 业务逻辑...
        } catch (Exception e) {
            log.error("创建用户失败，username={}", username, e);   // 最后一个参数传异常，打印堆栈
        }
    }
}`}
    />
    <Callout type="warning">
      <Text bold>不要用 System.out.println</Text> 记录日志：① 没有级别过滤；② 上线后无法关闭；
      ③ 没有时间戳、线程、类名等上下文信息。统一用 <InlineCode>@Slf4j + log.xxx()</InlineCode>。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>多环境：<InlineCode>application-{'{profile}'}.yml</InlineCode> 管专属配置，公共配置放 <InlineCode>application.yml</InlineCode>。</ListItem>
        <ListItem>激活 Profile：开发在 yml 里写 <InlineCode>active: dev</InlineCode>；上线用命令行 <InlineCode>--spring.profiles.active=prod</InlineCode>。</ListItem>
        <ListItem>生产环境密码通过环境变量 <InlineCode>${'{VAR_NAME}'}</InlineCode> 注入，不硬编码。</ListItem>
        <ListItem>日志：<InlineCode>logging.level.*</InlineCode> 控制级别，代码里用 <Text bold>@Slf4j + log.xxx()</Text>，禁用 <InlineCode>System.out.println</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
