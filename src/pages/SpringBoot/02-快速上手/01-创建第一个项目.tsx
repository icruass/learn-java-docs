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
    <Title>创建第一个项目</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        理论铺垫完毕，开始动手。这一节用官方脚手架 <Text bold>Spring Initializr</Text> 创建一个标准
        Spring Boot 项目，并读懂自动生成的 <InlineCode>pom.xml</InlineCode>。
        创建项目<Text bold>不要手动从零搭</Text>，永远用脚手架——又快又不出错。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、环境准备</Subtitle>
    <Paragraph>开始前，确认本机装好这三样（用版本命令自检）：</Paragraph>
    <Table
      head={['工具', '要求', '自检命令']}
      rows={[
        ['JDK', '17 或更高', 'java -version'],
        ['Maven', '3.6+（IDEA 已内置，可不单独装）', 'mvn -version'],
        ['IDEA', '社区版即可，旗舰版体验更好', '—'],
      ]}
    />
    <CodeBlock
      language="bash"
      title="检查 JDK 版本（必须 17+）"
      code={`java -version
# 期望输出类似：
# openjdk version "17.0.x" ...`}
    />

    <Divider />

    <Subtitle>二、用 Spring Initializr 创建项目</Subtitle>
    <Paragraph>有两种等价方式，任选其一：</Paragraph>

    <Paragraph>
      <Text bold>方式 A：网页版</Text>，打开{' '}
      <InlineCode>https://start.spring.io</InlineCode>，按下表填写后点「GENERATE」下载 zip，解压后用 IDEA 打开：
    </Paragraph>
    <Table
      head={['选项', '推荐值']}
      rows={[
        ['Project', 'Maven'],
        ['Language', 'Java'],
        ['Spring Boot', '选最新的 3.x 正式版（不要带 SNAPSHOT/M 字样）'],
        ['Group', 'com.example'],
        ['Artifact', 'demo'],
        ['Packaging', 'Jar'],
        ['Java', '17'],
        ['Dependencies', '搜索并添加 Spring Web'],
      ]}
    />
    <Paragraph>
      <Text bold>方式 B：IDEA 内置生成器</Text>（旗舰版）：<InlineCode>File → New → Project → Spring Boot</InlineCode>，
      填写同样的信息，在依赖列表里勾选 <Text bold>Spring Web</Text>。它底层调用的就是同一个 Spring Initializr。
    </Paragraph>
    <Callout type="tip">
      <Text bold>Group + Artifact</Text> 决定了你的「基础包名」。例如 Group=<InlineCode>com.example</InlineCode>、
      Artifact=<InlineCode>demo</InlineCode>，生成的启动类就在 <InlineCode>com.example.demo</InlineCode> 包下。
      记住这个包，后面所有业务代码都要放在它之内。
    </Callout>

    <Divider />

    <Subtitle>三、读懂 pom.xml</Subtitle>
    <Paragraph>
      打开生成的 <InlineCode>pom.xml</InlineCode>，它就是项目的「依赖与构建说明书」。逐块看懂：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml（精简注释版）"
      code={`<project ...>
    <modelVersion>4.0.0</modelVersion>

    <!-- ① 继承父工程：负责版本仲裁，让下面的依赖不用写 version -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.5</version>
        <relativePath/>
    </parent>

    <!-- ② 本项目的坐标（GAV） -->
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <!-- ③ 指定 JDK 版本 -->
    <properties>
        <java.version>17</java.version>
    </properties>

    <!-- ④ 依赖列表 -->
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <!-- ⑤ 打包插件：让 mvn package 能打出「可直接运行」的 jar -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`}
    />
    <Callout type="warning">
      <Text bold>关键</Text>：那个 <InlineCode>spring-boot-maven-plugin</InlineCode> 不能删。
      它负责把所有依赖和内嵌 Tomcat 一起打进一个 jar，使得 <InlineCode>java -jar</InlineCode> 就能跑（详见本章第三节）。
    </Callout>

    <Divider />

    <Subtitle>四、首次打开：等待依赖下载</Subtitle>
    <Paragraph>
      用 IDEA 打开项目后，Maven 会自动下载 <InlineCode>pom.xml</InlineCode> 里声明的所有 jar（到本地仓库），
      右下角会有进度条。<Text bold>第一次会比较慢</Text>，耐心等它跑完。
    </Paragraph>
    <Callout type="tip" title="国内下载慢？换镜像">
      若依赖下载卡住，给 Maven 配置阿里云镜像：编辑 <InlineCode>~/.m2/settings.xml</InlineCode>，在
      <InlineCode>{'<mirrors>'}</InlineCode> 里加一个指向{' '}
      <InlineCode>https://maven.aliyun.com/repository/public</InlineCode> 的镜像，速度会快很多。
    </Callout>

    <Paragraph>常用 Maven 命令（IDEA 右侧 Maven 面板也能点击执行）：</Paragraph>
    <Table
      head={['命令', '作用']}
      rows={[
        ['mvn clean', '清理 target 目录（上次的编译产物）'],
        ['mvn compile', '编译源码'],
        ['mvn package', '打包成 jar（含编译 + 测试）'],
        ['mvn spring-boot:run', '直接启动项目（开发常用）'],
        ['mvn clean package -DskipTests', '打包但跳过测试（赶时间时）'],
      ]}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>环境三件套：<Text bold>JDK 17+、Maven、IDEA</Text>。</ListItem>
        <ListItem>用 <Text bold>Spring Initializr</Text>（网页版或 IDEA 内置）创建项目，首个依赖勾 <Text bold>Spring Web</Text>。</ListItem>
        <ListItem><InlineCode>pom.xml</InlineCode> 五要素：父工程、项目坐标、JDK 版本、依赖、打包插件。</ListItem>
        <ListItem>常用命令：<InlineCode>mvn spring-boot:run</InlineCode> 启动、<InlineCode>mvn package</InlineCode> 打包。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
