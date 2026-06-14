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
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>什么是 Spring Boot</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        学完 Java 基础、MySQL 与 JDBC，你已经能写出「连接数据库、执行 SQL」的程序。但要做出一个
        <Text bold>真正能对外提供接口、跑在服务器上的企业级后端</Text>，还差一座桥——
        <Text bold>Spring Boot</Text>。它是当今 Java 后端开发的<Text bold>绝对主流</Text>，
        几乎所有公司的 Java 项目都基于它。
      </Paragraph>
      <Paragraph>本章先把「它是什么、为什么用它、用哪个版本」讲清楚，让你心里有底，再动手写代码。</Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、先认识 Spring：它解决什么问题</Subtitle>
    <Paragraph>
      <Text bold>Spring</Text> 是 Java 企业开发的<Text bold>事实标准框架</Text>，诞生于 2004 年。它的两大基石你会反复听到：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>IoC（控制反转）/ DI（依赖注入）</Text>：由「容器」统一创建和管理对象，并自动把依赖装配好——
        你不再到处 <InlineCode>new</InlineCode> 对象（下一节详解）。
      </ListItem>
      <ListItem>
        <Text bold>AOP（面向切面）</Text>：把日志、事务、权限这类「横切逻辑」从业务代码里抽出来，统一管理。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      Spring 很强大，但<Text bold>传统 Spring 项目配置极其繁琐</Text>，这正是 Spring Boot 出现的原因：
    </Paragraph>
    <UnorderedList>
      <ListItem>要写大量 XML 配置文件，把每个对象、每条规则都声明一遍；</ListItem>
      <ListItem>要手动挑选并对齐一堆 jar 包的版本，稍有不慎就「依赖冲突」；</ListItem>
      <ListItem>要自己装 Tomcat，把项目打成 war 包再部署上去，启动慢、调试麻烦。</ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>二、Spring Boot 是什么</Subtitle>
    <Paragraph>
      <Text bold>Spring Boot 不是一个新框架，而是 Spring 的「脚手架 / 全家桶」</Text>。
      它在 Spring 之上做了一层封装，核心理念是
      <Text accent bold>「约定优于配置（Convention over Configuration）」</Text>——
      用合理的默认值替你把绝大部分配置做好，让你<Text bold>开箱即用、专注业务</Text>。
    </Paragraph>
    <Table
      head={['维度', '传统 Spring', 'Spring Boot']}
      rows={[
        ['依赖管理', '手动逐个引入 jar、对齐版本', '一个 starter 搞定一整套，版本自动仲裁'],
        ['配置方式', '大量 XML / Java 配置', '约定默认值 + 一个 application.yml'],
        ['运行方式', '打 war 包，部署到外部 Tomcat', '内嵌 Tomcat，打 jar 包，java -jar 直接跑'],
        ['上手速度', '搭环境就要半天', '几分钟跑起一个 Web 接口'],
      ]}
    />

    <Divider />

    <Subtitle>三、四大核心特性</Subtitle>
    <Paragraph>记住这四点，就抓住了 Spring Boot 的精髓（后面章节会逐一动手）：</Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>起步依赖（Starter）</Text>：把一类功能需要的 jar 打成一个「套餐」。引入
        <InlineCode>spring-boot-starter-web</InlineCode>，Web 开发要的 Spring MVC、Tomcat、JSON 处理一次性全有。
      </ListItem>
      <ListItem>
        <Text bold>自动配置（Auto-Configuration）</Text>：根据你引入了什么依赖，<Text bold>自动</Text>帮你配置好对应组件。
        引入了 web starter，它就自动配好 Tomcat 和 MVC，你一行配置都不用写。
      </ListItem>
      <ListItem>
        <Text bold>内嵌服务器</Text>：Tomcat 直接打包进你的程序，
        <InlineCode>java -jar</InlineCode> 一条命令就能启动一个 Web 服务，无需单独安装。
      </ListItem>
      <ListItem>
        <Text bold>生产级特性</Text>：内置健康检查、指标监控（Actuator）、外部化配置等，让应用直接具备「上线」能力。
      </ListItem>
    </OrderedList>

    <Divider />

    <Subtitle>四、先感受一下：20 行跑起一个 Web 接口</Subtitle>
    <Paragraph>
      下面这段<Text bold>完整、可运行</Text>的代码，启动后访问{' '}
      <InlineCode>http://localhost:8080/hello</InlineCode> 就能看到返回——
      不用配 Tomcat、不用写 XML，这就是 Spring Boot 的威力：
    </Paragraph>
    <CodeBlock
      title="DemoApplication.java"
      code={`import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController            // 这是一个 Web 接口类，返回值直接当作响应体
@SpringBootApplication     // 标记这是 Spring Boot 应用的入口
public class DemoApplication {

    @GetMapping("/hello")  // 浏览器 GET /hello 时调用此方法
    public String hello() {
        return "Hello, Spring Boot!";
    }

    public static void main(String[] args) {
        // 一行代码：启动内嵌 Tomcat + Spring 容器
        SpringApplication.run(DemoApplication.class, args);
    }
}`}
    />
    <Callout type="tip">
      现在看不懂这些注解很正常。本套教程会从「创建项目 → 跑起来 → 写接口 → 连数据库 → 做成企业级」一步步带你拆解每一行。
    </Callout>

    <Divider />

    <Subtitle>五、版本与技术栈选择（重要）</Subtitle>
    <Paragraph>
      Spring Boot 目前有两大版本分支，<Text bold>选错版本会导致大量代码报错</Text>，必须先搞清楚：
    </Paragraph>
    <Table
      head={['', 'Spring Boot 2.x', 'Spring Boot 3.x（本教程）']}
      rows={[
        ['JDK 要求', 'Java 8+', 'Java 17+（强制）'],
        ['企业包命名', 'javax.* （如 javax.servlet）', 'jakarta.* （如 jakarta.servlet）'],
        ['现状', '老项目维护为主', '新项目主流，官方主力维护'],
      ]}
    />
    <Callout type="warning" title="javax 与 jakarta 的坑">
      从 Spring Boot 3 开始，所有企业级 API 的包名从 <InlineCode>javax.*</InlineCode> 改成了{' '}
      <InlineCode>jakarta.*</InlineCode>（如校验注解 <InlineCode>jakarta.validation</InlineCode>、Servlet
      <InlineCode>jakarta.servlet</InlineCode>）。
      你在网上抄老代码时若 <InlineCode>import javax.xxx</InlineCode> 报错，多半就是版本不匹配——
      把 <InlineCode>javax</InlineCode> 换成 <InlineCode>jakarta</InlineCode> 即可。
    </Callout>
    <Paragraph>
      <Text bold>本教程统一使用以下技术栈</Text>（也是 2025 年后新项目的标准组合）：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Spring Boot 3.x</Text> + <Text bold>Java 17</Text>（与本站 Java 教程保持一致）；
      </ListItem>
      <ListItem>
        <Text bold>Maven</Text> 作为构建 / 依赖管理工具；
      </ListItem>
      <ListItem>
        <Text bold>MyBatis</Text> 作为持久层框架，<Text bold>MySQL</Text> 作为数据库（你已经学过）。
      </ListItem>
    </UnorderedList>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>Spring 是 Java 企业开发的标准框架，核心是 IoC/DI 与 AOP，但传统配置繁琐。</ListItem>
        <ListItem>Spring Boot 是 Spring 的「脚手架」，理念是<Text bold>约定优于配置</Text>，让你开箱即用。</ListItem>
        <ListItem>四大特性：<Text bold>起步依赖、自动配置、内嵌服务器、生产级特性</Text>。</ListItem>
        <ListItem>本教程用 <Text bold>Spring Boot 3.x + Java 17 + Maven + MyBatis</Text>；注意 3.x 用 <InlineCode>jakarta.*</InlineCode> 而非 <InlineCode>javax.*</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
