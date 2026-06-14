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
    <Title>项目结构与启动类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        项目创建好了，先别急着写代码。花两分钟看懂<Text bold>目录结构</Text>和<Text bold>启动类</Text>，
        以及企业里约定俗成的<Text bold>分层包结构</Text>——这决定了你的代码该放在哪里，是上手开发的「地图」。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、标准目录结构</Subtitle>
    <CodeBlock
      language="text"
      title="Spring Boot 项目骨架"
      code={`demo
├── src
│   ├── main
│   │   ├── java                    ← 所有 Java 源代码
│   │   │   └── com/example/demo
│   │   │       └── DemoApplication.java   ← 启动类（程序入口）
│   │   └── resources               ← 资源文件（非代码）
│   │       ├── static/             ← 静态资源（js/css/图片）
│   │       ├── templates/          ← 模板页面（前后端不分离时用）
│   │       └── application.yml     ← 核心配置文件
│   └── test
│       └── java                    ← 测试代码
├── pom.xml                         ← Maven 依赖与构建配置
└── target/                         ← 编译/打包产物（自动生成，可删）`}
    />
    <Table
      head={['位置', '放什么']}
      rows={[
        ['src/main/java', '业务 Java 代码，全部放在「启动类所在包」之下'],
        ['src/main/resources', '配置文件、静态资源、SQL/XML 等'],
        ['application.yml / .properties', '项目主配置（端口、数据库连接等）'],
        ['src/test/java', '单元测试 / 集成测试'],
        ['target', '自动生成的 class 与 jar，不要提交到 Git'],
      ]}
    />

    <Divider />

    <Subtitle>二、启动类详解</Subtitle>
    <Paragraph>
      每个 Spring Boot 项目<Text bold>有且只有一个启动类</Text>，它是整个程序的入口：
    </Paragraph>
    <CodeBlock
      title="DemoApplication.java"
      code={`package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication   // 核心注解：开启自动配置 + 组件扫描
public class DemoApplication {

    public static void main(String[] args) {
        // 启动 Spring 应用：创建容器、扫描 Bean、启动内嵌 Tomcat
        SpringApplication.run(DemoApplication.class, args);
    }
}`}
    />
    <Paragraph>三个关键点：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>@SpringBootApplication</InlineCode>：上一章揭秘过，= 自动配置 + 组件扫描 + 配置类。
      </ListItem>
      <ListItem>
        <InlineCode>SpringApplication.run(...)</InlineCode>：真正的启动动作，返回值是 Spring 容器（<InlineCode>ApplicationContext</InlineCode>）。
      </ListItem>
      <ListItem>
        <Text bold>启动类的位置极其重要</Text>：它所在的包（这里是 <InlineCode>com.example.demo</InlineCode>）就是组件扫描的根。
      </ListItem>
    </UnorderedList>
    <Callout type="danger" title="再次强调这个高频坑">
      所有 <InlineCode>@Controller</InlineCode>、<InlineCode>@Service</InlineCode> 等组件，必须放在
      <Text bold>启动类所在包及其子包</Text>里。若把启动类误放进某个子包、或把业务类放到了启动类的上层/平级包，
      就会扫描不到，导致接口 404 或注入 <InlineCode>null</InlineCode>。<Text bold>启动类永远放最外层。</Text>
    </Callout>

    <Divider />

    <Subtitle>三、resources 目录</Subtitle>
    <UnorderedList>
      <ListItem>
        <InlineCode>application.yml</InlineCode>（或 <InlineCode>.properties</InlineCode>）：项目主配置，下一章专门讲。
      </ListItem>
      <ListItem>
        <InlineCode>static/</InlineCode>：存放静态资源，访问路径直接映射到根。如 <InlineCode>static/a.png</InlineCode> →{' '}
        <InlineCode>http://localhost:8080/a.png</InlineCode>。
      </ListItem>
      <ListItem>
        <InlineCode>templates/</InlineCode>：服务端渲染模板（Thymeleaf 等）。
        <Text bold>做前后端分离的企业 API 时基本用不到</Text>，了解即可。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>四、企业级分层包结构（必须养成的习惯）</Subtitle>
    <Paragraph>
      Spring Boot 不强制目录结构，但企业里有一套<Text bold>约定俗成的分层</Text>。
      从一开始就按这个组织代码，后面学三层架构会非常顺：
    </Paragraph>
    <CodeBlock
      language="text"
      title="推荐的包结构"
      code={`com.example.demo
├── DemoApplication.java   ← 启动类
├── controller/            ← 控制层：接收请求、返回响应（写 @RestController）
├── service/               ← 业务层：核心业务逻辑（写 @Service）
│   └── impl/              ← 业务层接口的实现类
├── mapper/                ← 持久层：操作数据库（MyBatis 的 @Mapper 接口）
├── entity/  (或 pojo)     ← 实体类：与数据库表对应的对象
├── dto/                   ← 数据传输对象：接口出入参的专用结构
├── config/                ← 配置类：自定义 Bean、拦截器、跨域等
└── common/                ← 通用工具：统一返回结果、全局异常处理等`}
    />
    <Table
      head={['层 / 包', '职责', '对应注解']}
      rows={[
        ['controller', '接收 HTTP 请求、校验参数、返回结果', '@RestController'],
        ['service', '编排业务逻辑、控制事务', '@Service'],
        ['mapper', '与数据库交互（增删改查）', '@Mapper'],
        ['entity', '映射数据库表的数据载体', '（无，普通 POJO）'],
        ['config', '集中放配置类、第三方组件 Bean', '@Configuration'],
      ]}
    />
    <Callout type="tip">
      现在这些包大多还是空的没关系，先把<Text bold>骨架建好</Text>。从第四章开始，我们会逐个往里面填东西，
      最终拼成一个完整的企业级 CRUD 接口。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>代码在 <InlineCode>src/main/java</InlineCode>，配置/资源在 <InlineCode>src/main/resources</InlineCode>。</ListItem>
        <ListItem>启动类用 <InlineCode>@SpringBootApplication</InlineCode> + <InlineCode>SpringApplication.run</InlineCode>，<Text bold>必须放在最外层包</Text>。</ListItem>
        <ListItem>企业分层包：<Text bold>controller / service / mapper / entity / config / common</Text>，从一开始就建好。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
