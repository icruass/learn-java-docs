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
    <Title>整合 Spring Boot 打包可执行 jar</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        你写 Spring Boot 项目时其实一直在用 Maven，只是没太留意它在背后干了什么。
        本节把 Maven 在 Spring Boot 项目里的<Text accent bold>三件关键事</Text>讲透：
        <InlineCode>spring-boot-starter-parent</InlineCode> 怎么帮你省掉版本号、
        <Text bold>starter 起步依赖</Text>一行顶一堆、以及最关键的——
        靠 <InlineCode>spring-boot-maven-plugin</InlineCode> 把项目打成一个
        <Text bold>能直接 java -jar 运行</Text>的可执行 jar。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、parent 统一管版本：引 starter 不用写 version</Subtitle>
    <Paragraph>
      新建 Spring Boot 项目，pom 开头一般都有这么一段 <InlineCode>{'<parent>'}</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml —— 继承 spring-boot-starter-parent"
      code={`<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
    <relativePath/> <!-- 从仓库查找父 pom，不从本地路径找 -->
</parent>`}
    />
    <Paragraph>
      <InlineCode>spring-boot-starter-parent</InlineCode> 是 Spring Boot 官方提供的<Text bold>父 pom</Text>。
      它最大的价值是内部用 <InlineCode>{'<dependencyManagement>'}</InlineCode>
      <Text accent bold>统一锁定了一大批常用依赖的版本号</Text>——Spring、Jackson、日志、数据库驱动……
      几乎你能想到的库它都帮你定好了一个经过兼容性验证的版本。
    </Paragraph>
    <Paragraph>
      带来的直接好处：你在 <InlineCode>{'<dependencies>'}</InlineCode> 里引那些被管理的依赖时，
      <Text bold>完全不用写 version</Text>，由 parent 统一决定。这就避免了各依赖版本互相打架的「依赖地狱」。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="引官方 starter 不写版本，版本由 parent 决定"
      code={`<dependencies>
    <!-- 注意：没有 <version>，版本由 parent 统一管理 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>`}
    />
    <Callout type="tip">
      想覆盖 parent 定的某个版本（比如换个更高版的 Spring），不用改 parent，
      只要在自己 pom 的 <InlineCode>{'<properties>'}</InlineCode> 里重定义对应属性即可，
      例如 <InlineCode>{'<spring-framework.version>6.1.6</spring-framework.version>'}</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>二、starter 起步依赖：一行引入一整套</Subtitle>
    <Paragraph>
      上面那行 <InlineCode>spring-boot-starter-web</InlineCode> 看着只是一个依赖，
      实际上它是个<Text accent bold>起步依赖（starter）</Text>——本身几乎没什么代码，
      作用是<Text bold>把开发某类功能所需的一整套依赖打包好</Text>，靠 Maven 的
      <Text bold>传递依赖</Text>机制一次性全拉进来。
    </Paragraph>
    <Paragraph>
      就拿 web 开发来说，你只写一行 <InlineCode>spring-boot-starter-web</InlineCode>，
      Maven 会顺着它的依赖链，把下面这些<Text bold>自动</Text>带进来：
    </Paragraph>
    <Table
      head={['starter 传递进来的依赖', '作用']}
      rows={[
        ['spring-boot-starter (基础)', 'Spring Boot 自动配置、核心容器'],
        ['spring-webmvc', 'Spring MVC，写 Controller、处理请求'],
        ['spring-boot-starter-tomcat', '内置 Tomcat 容器，不用单独装服务器'],
        ['spring-boot-starter-json (Jackson)', 'JSON 序列化/反序列化'],
      ]}
    />
    <Paragraph>
      这就是 starter 的威力：<Text bold>约定大于配置</Text>。你不用再一个个去找 Spring MVC、Tomcat、
      Jackson 的坐标和兼容版本，一个 starter 全搞定。常见的还有
      <InlineCode>spring-boot-starter-data-jpa</InlineCode>（数据库）、
      <InlineCode>spring-boot-starter-test</InlineCode>（测试）等。
    </Paragraph>
    <Callout type="note">
      想看一个 starter 到底带进来了哪些 jar，去 IDEA 的 Maven 工具窗口展开
      <Text bold>Dependencies</Text> 树，或执行 <InlineCode>mvn dependency:tree</InlineCode> 一目了然。
    </Callout>

    <Divider />

    <Subtitle>三、spring-boot-maven-plugin：打成可执行 fat jar</Subtitle>
    <Paragraph>
      普通 Maven <InlineCode>package</InlineCode> 打出来的 jar，<Text bold>只含你自己的 class</Text>，
      不含任何第三方依赖，也没有启动入口——根本没法 <InlineCode>java -jar</InlineCode> 直接跑。
      Spring Boot 项目能「一个 jar 走天下」，全靠这个插件：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml —— Spring Boot 项目的构建插件"
      code={`<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>`}
    />
    <Paragraph>
      它的核心目标（goal）是 <Text accent bold>repackage</Text>。Maven 默认 package 先打出一个普通 jar，
      然后这个插件的 repackage 接力，把<Text bold>所有依赖 jar、内置 Tomcat、以及一个启动引导类</Text>
      全部塞进去，<Text bold>重新打包</Text>成一个能独立运行的
      <Text accent bold>fat jar（也叫 uber jar / 可执行 jar）</Text>。
    </Paragraph>
    <Paragraph>
      它在 <InlineCode>package</InlineCode> 阶段自动绑定执行，所以你照常 <InlineCode>mvn package</InlineCode> 即可，
      产物里会多出一个带依赖、可直接运行的 jar（旁边那个 <InlineCode>.jar.original</InlineCode> 才是原始的瘦 jar）。
    </Paragraph>
    <CodeBlock
      language="text"
      title="package 后 target 目录里的产物"
      code={`target/
  my-app-0.0.1-SNAPSHOT.jar           <- 可执行 fat jar（内含依赖 + 内置 Tomcat）
  my-app-0.0.1-SNAPSHOT.jar.original  <- 原始瘦 jar（只含你的 class，备份）`}
    />

    <Divider />

    <Subtitle>四、打包并运行：mvn package + java -jar</Subtitle>
    <Paragraph>
      流程就两步：先用 Maven 打包，再用 <InlineCode>java -jar</InlineCode> 启动。
      因为 Tomcat 已经内置在 jar 里，运行后服务（默认 8080 端口）就直接起来了，
      <Text bold>不需要</Text>你额外装、配任何 Tomcat。
    </Paragraph>
    <CodeBlock
      language="bash"
      title="打包并运行 Spring Boot 可执行 jar"
      code={`# 1. 清理 + 打包（repackage 会在 package 阶段自动执行）
mvn clean package

# 2. 直接运行打好的 fat jar，内置 Tomcat 随之启动
java -jar target/my-app-0.0.1-SNAPSHOT.jar

# 文件名带版本号，懒得手敲可用通配符
java -jar target/*.jar

# 开发期想直接跑、不打包，也可以用插件目标：
mvn spring-boot:run`}
    />
    <Paragraph>
      打出来的这个 jar 是<Text bold>自包含</Text>的，可以直接拷到任意装了 JDK 的服务器上
      <InlineCode>java -jar</InlineCode> 启动，部署极其省心——这正是 Spring Boot + Maven 组合最爽的地方。
    </Paragraph>
    <Callout type="danger" title="少了这个插件，jar 跑不起来">
      <Paragraph>
        如果<Text bold>忘了加 spring-boot-maven-plugin</Text>，<InlineCode>mvn package</InlineCode> 只会打出
        一个<Text bold>瘦 jar</Text>：里面没有第三方依赖、没有内置 Tomcat、也没有
        <InlineCode>Main-Class</InlineCode> 启动入口。这时 <InlineCode>java -jar</InlineCode> 会直接报
        <InlineCode>no main manifest attribute</InlineCode> 或 <InlineCode>ClassNotFoundException</InlineCode>，
        根本启动不了。<Text bold>记住：可执行 jar = package + 这个插件的 repackage。</Text>
      </Paragraph>
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          <InlineCode>spring-boot-starter-parent</InlineCode> 作为 <InlineCode>{'<parent>'}</InlineCode>，
          用 <Text bold>dependencyManagement 统一管版本</Text>，引官方 starter 时<Text bold>不用写 version</Text>。
        </ListItem>
        <ListItem>
          <Text accent bold>starter 起步依赖</Text>（如 <InlineCode>spring-boot-starter-web</InlineCode>）
          靠传递依赖，<Text bold>一行引入一整套</Text>开发所需的库（含内置 Tomcat）。
        </ListItem>
        <ListItem>
          <InlineCode>spring-boot-maven-plugin</InlineCode> 的 <Text accent bold>repackage</Text> 目标，
          把项目打成<Text bold>内置 Tomcat、可独立运行的 fat jar</Text>。
        </ListItem>
        <ListItem>
          <InlineCode>mvn clean package</InlineCode> 打包，<InlineCode>java -jar target/xxx.jar</InlineCode> 直接启动；
          少了那个插件，打出的瘦 jar 跑不起来。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
