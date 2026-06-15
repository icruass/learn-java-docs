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
    <Title>运行项目与热部署</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        这一节让项目<Text bold>真正跑起来</Text>：四种启动方式、看懂启动日志、改端口，
        再配上<Text bold>热部署（DevTools）</Text>免去反复重启的痛苦，最后学会打成可执行 jar——
        这就是「怎么运行」的完整闭环。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、写一个接口，准备开跑</Subtitle>
    <Paragraph>
      在 <InlineCode>controller</InlineCode> 包下新建一个最简单的接口（注意包要在启动类之下）：
    </Paragraph>
    <CodeBlock
      title="controller/HelloController.java"
      code={`package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }
}`}
    />

    <Divider />

    <Subtitle>二、四种启动方式</Subtitle>
    <OrderedList>
      <ListItem>
        <Text bold>IDEA 里运行（开发最常用）</Text>：打开启动类，点 <InlineCode>main</InlineCode> 方法左侧的绿色三角，
        或右键 <InlineCode>Run 'DemoApplication'</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>Maven 插件启动</Text>：项目根目录执行 <InlineCode>mvn spring-boot:run</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>打包后用 java 运行</Text>：<InlineCode>mvn package</InlineCode> 后{' '}
        <InlineCode>java -jar target/demo-0.0.1-SNAPSHOT.jar</InlineCode>（上线就用这种）。
      </ListItem>
      <ListItem>
        <Text bold>IDEA 的 Services 面板</Text>：可同时管理多个 Spring Boot 服务，适合微服务多模块。
      </ListItem>
    </OrderedList>
    <Paragraph>
      启动成功后，浏览器访问 <InlineCode>http://localhost:8080/hello</InlineCode>，看到
      <InlineCode>Hello, Spring Boot!</InlineCode> 就成功了 🎉。
    </Paragraph>

    <Divider />

    <Subtitle>三、看懂启动日志</Subtitle>
    <CodeBlock
      language="text"
      title="控制台关键日志"
      code={`  .   ____          _            __ _ _
 /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\
( ( )\\___ | '_ | '_| | '_ \\/ _\` | \\ \\ \\ \\
 \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\\__, | / / / /
 =========|_|==============|___/=/_/_/_/

Tomcat initialized with port 8080 (http)   ← 内嵌 Tomcat 端口
Starting Servlet engine: [Apache Tomcat/...]
Tomcat started on port 8080 (http)
Started DemoApplication in 1.83 seconds      ← 启动耗时，看到这行就成功了`}
    />
    <Callout type="tip">
      看到 <InlineCode>Started ... in X seconds</InlineCode> 表示启动成功。若启动失败，重点看日志里红色的
      <InlineCode>APPLICATION FAILED TO START</InlineCode> 区块，它会用大白话告诉你哪里错了（如端口被占用）。
    </Callout>

    <Divider />

    <Subtitle>四、修改端口与访问前缀</Subtitle>
    <Paragraph>
      默认端口 <InlineCode>8080</InlineCode>。若被占用或想自定义，在 <InlineCode>application.yml</InlineCode> 改：
    </Paragraph>
    <CodeBlock
      language="yaml"
      title="application.yml"
      code={`server:
  port: 8081                    # 改端口
  servlet:
    context-path: /api          # 给所有接口加统一前缀`}
    />
    <Paragraph>
      改成上面这样后，接口访问地址变为 <InlineCode>http://localhost:8081/api/hello</InlineCode>。
      <InlineCode>context-path</InlineCode> 在企业里常用来给一个服务的所有接口加统一前缀。
    </Paragraph>

    <Divider />

    <Subtitle>五、热部署 DevTools：告别反复重启</Subtitle>
    <Paragraph>
      开发时每改一行代码都手动重启，太痛苦。<Text bold>spring-boot-devtools</Text> 能在代码变动后
      <Text bold>自动重启</Text>应用（比冷启动快得多）。三步开启：
    </Paragraph>
    <Paragraph>
      <Text bold>① 引入依赖</Text>：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml"
      code={`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>     <!-- 标记为开发期工具，打包上线时不会带上 -->
</dependency>`}
    />
    <Paragraph>
      <Text bold>② 开启 IDEA 自动编译</Text>：勾选 <InlineCode>Settings → Build, Execution, Deployment → Compiler →
      Build project automatically</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>③ 允许运行时自动 make</Text>：在 <InlineCode>Settings → Advanced Settings</InlineCode> 中勾选
      <InlineCode>Allow auto-make to start even if developed application is currently running</InlineCode>
      （老版本 IDEA 在 Registry 里搜 <InlineCode>compiler.automake.allow.when.app.running</InlineCode>）。
    </Paragraph>
    <Callout type="tip">
      配好后改动代码会自动触发重启；也可随时按 <InlineCode>Ctrl + F9</InlineCode> 手动构建立即生效。
      <Text bold>注意</Text>：DevTools 只重启「你的代码」，依赖不变，所以比完整重启快很多，但仍是「重启」，不是改一行立即热替换。
    </Callout>

    <Divider />

    <Subtitle>六、打包成可执行 jar（上线方式）</Subtitle>
    <Paragraph>
      Spring Boot 的杀手锏：把<Text bold>内嵌 Tomcat + 所有依赖 + 你的代码</Text>打成一个「胖 jar」，
      在任何装了 JDK 的机器上一条命令就能跑，无需预装 Tomcat。
    </Paragraph>
    <CodeBlock
      language="bash"
      title="打包并运行"
      code={`# 1. 打包（产物在 target/ 下）
mvn clean package -DskipTests

# 2. 运行
java -jar target/demo-0.0.1-SNAPSHOT.jar

# 3. 运行时临时指定端口（命令行参数优先级最高）
java -jar target/demo-0.0.1-SNAPSHOT.jar --server.port=9000`}
    />
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>开发用 <Text bold>IDEA 运行</Text> 或 <InlineCode>mvn spring-boot:run</InlineCode>；上线用 <InlineCode>java -jar</InlineCode>。</ListItem>
        <ListItem>看到 <InlineCode>Started ... in X seconds</InlineCode> 即启动成功；启动失败看 <InlineCode>APPLICATION FAILED TO START</InlineCode>。</ListItem>
        <ListItem>改端口/前缀：<InlineCode>server.port</InlineCode> 与 <InlineCode>server.servlet.context-path</InlineCode>。</ListItem>
        <ListItem>引入 <Text bold>devtools</Text> + 开启 IDEA 自动编译，实现保存即重启。</ListItem>
        <ListItem><InlineCode>mvn package</InlineCode> 打出胖 jar，<InlineCode>java -jar</InlineCode> 直接运行，自带 Tomcat。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
