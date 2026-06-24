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
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>用 Maven 构建与运行（生命周期）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        装好 Maven 后，日常开发就靠它的<Text bold>生命周期命令</Text>来构建、测试、运行。
        本节讲清生命周期主线，以及 <InlineCode>pom.xml</InlineCode> 里最关键的三块内容。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、生命周期主线</Subtitle>
    <Paragraph>
      Maven 的核心是一条<Text bold>生命周期</Text>主线，<Text bold>执行某阶段会自动先跑它前面的所有阶段</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`validate → compile → test → package → verify → install → deploy`}
    />
    <Paragraph>
      常用命令（在项目根目录 <InlineCode>sms-spring/</InlineCode> 下执行）：
    </Paragraph>
    <CodeBlock
      language="bash"
      code={`mvn clean            # 删除 target/，从干净状态开始
mvn test             # 编译 + 跑测试
mvn package          # 打成可执行 jar（target/sms-spring-0.0.1-SNAPSHOT.jar）
mvn spring-boot:run  # 开发期直接启动服务
java -jar target/sms-spring-0.0.1-SNAPSHOT.jar   # 跑打好的 jar（更接近线上）`}
    />

    <Divider />

    <Subtitle>二、pom.xml 的三块关键内容</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>{'<parent> spring-boot-starter-parent'}</Text>：统一管理依赖版本和插件，自己写依赖时大多不用写版本号。
      </ListItem>
      <ListItem>
        <Text bold>{'<dependencies> 各种 starter'}</Text>：<InlineCode>web</InlineCode>（REST）、
        <InlineCode>data-jpa</InlineCode>（ORM）、<InlineCode>validation</InlineCode>（校验）、
        <InlineCode>h2</InlineCode> / <InlineCode>mysql-connector-java</InlineCode>（驱动）。
      </ListItem>
      <ListItem>
        <Text bold>spring-boot-maven-plugin</Text>：让 <InlineCode>mvn spring-boot:run</InlineCode> 可用、并把项目打成可独立运行的 jar。
      </ListItem>
    </UnorderedList>

    <Callout type="warning" title="踩过的坑：MySQL 驱动要显式写版本">
      <Paragraph>
        Spring Boot 的 BOM <Text bold>并不管理所有依赖</Text>。<InlineCode>mysql:mysql-connector-java</InlineCode> 就没被管理，
        必须<Text bold>显式写版本</Text>（本项目用 <InlineCode>8.0.33</InlineCode>），否则报
        <InlineCode>{"'dependencies.dependency.version' for mysql:mysql-connector-java:jar is missing"}</InlineCode>。
      </Paragraph>
    </Callout>

    <Callout type="warning" title="编码坑：源码用 UTF-8">
      <Paragraph>
        Windows 默认字符集是 GBK。<InlineCode>pom.xml</InlineCode> 里要有
        <InlineCode>{'<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>'}</InlineCode>，
        否则中文源码 / 字符串可能乱码。
      </Paragraph>
    </Callout>
  </article>
);

export default index;
