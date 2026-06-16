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
    <Title>插件与目标</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前两节我们说「<InlineCode>mvn compile</InlineCode> 会编译代码」，可生命周期的阶段本身其实<Text accent bold>什么都不会干</Text>。
        真正干活的是<Text accent bold>插件（plugin）</Text>。本节讲清阶段、插件、目标三者的关系，
        并手把手配置最常用的 <InlineCode>maven-compiler-plugin</InlineCode>——这是几乎每个项目都绕不开的一步。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、阶段不干活，干活的是插件的「目标」</Subtitle>
    <Paragraph>
      生命周期的<Text bold>阶段（phase）</Text>只是一个「时机 / 占位」，它自己不包含任何具体逻辑。
      真正执行编译、测试、打包等动作的，是一个个<Text accent bold>插件（plugin）</Text>。
      每个插件又提供若干<Text accent bold>目标（goal）</Text>，一个目标就是一个具体能干的活儿。
    </Paragraph>
    <Paragraph>
      Maven 的运作方式是：把生命周期的<Text bold>阶段</Text>，<Text accent bold>绑定</Text>到某个<Text bold>插件的目标</Text>上。
      到了这个阶段，被绑定的目标就会被执行。可以用一个公式记住：
    </Paragraph>
    <CodeBlock
      language="text"
      title="阶段 ⟶ 绑定 ⟶ 插件目标"
      code={`生命周期阶段（phase）   →   绑定到   →   插件目标（plugin:goal）   →   真正执行

例如：
  compile 阶段   →  绑定  →  maven-compiler-plugin 的 compile 目标
  test 阶段      →  绑定  →  maven-surefire-plugin 的 test 目标
  package 阶段   →  绑定  →  maven-jar-plugin 的 jar 目标（普通 jar 项目）`}
    />
    <Paragraph>
      所以当你执行 <InlineCode>mvn compile</InlineCode>，本质是 Maven 走到 compile 阶段，
      触发了绑定在上面的 <InlineCode>maven-compiler-plugin:compile</InlineCode> 目标，由它去调用编译器把代码编译出来。
    </Paragraph>

    <Divider />

    <Subtitle>二、插件:目标，也能单独执行</Subtitle>
    <Paragraph>
      除了走「执行阶段、连带触发目标」这条路，你也可以<Text bold>跳过生命周期，直接点名执行某个目标</Text>，
      格式是 <InlineCode>插件:目标</InlineCode>（用插件的简称 + 冒号 + 目标名）：
    </Paragraph>
    <CodeBlock
      language="bash"
      title="直接执行某个插件目标"
      code={`# 直接执行 compiler 插件的 compile 目标（等价于编译主代码）
mvn compiler:compile

# 直接执行 surefire 插件的 test 目标（只跑测试）
mvn surefire:test

# 通用格式：mvn 插件简称:目标名`}
    />
    <Callout type="tip" title="两种触发方式的区别">
      <Paragraph>
        <InlineCode>mvn compile</InlineCode> 是「执行 compile <Text bold>阶段</Text>」，会连带跑完它之前的阶段；
        而 <InlineCode>mvn compiler:compile</InlineCode> 是「直接执行某个<Text bold>目标</Text>」，只干这一件事、不走整条生命周期。
        日常更常用前者，后者多用于调试单个插件。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>三、最常用的 maven-compiler-plugin：指定 JDK 版本</Subtitle>
    <Paragraph>
      负责编译的 <InlineCode>maven-compiler-plugin</InlineCode> 几乎每个项目都要配，
      核心是告诉它用<Text accent bold>哪个 JDK 版本</Text>来编译你的代码（源码用什么语法、字节码编到哪个版本）。
      最直白的方式是在 <InlineCode>{'<build>'}</InlineCode> 的 <InlineCode>{'<plugins>'}</InlineCode> 里显式配置：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml — 显式配置 compiler 插件"
      code={`<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <configuration>
        <!-- 源代码使用的 JDK 语法版本 -->
        <source>17</source>
        <!-- 编译出的字节码目标版本 -->
        <target>17</target>
        <!-- 中文等非 ASCII 源码，建议显式指定编码避免乱码 -->
        <encoding>UTF-8</encoding>
      </configuration>
    </plugin>
  </plugins>
</build>`}
    />
    <Paragraph>
      上面这种写法有点啰嗦。更简洁的<Text accent bold>等价做法</Text>是：在 <InlineCode>{'<properties>'}</InlineCode> 里设几个
      Maven 预定义属性，compiler 插件会自动读取，效果完全一样：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml — 用 properties 更简洁（等价写法）"
      code={`<properties>
  <maven.compiler.source>17</maven.compiler.source>
  <maven.compiler.target>17</maven.compiler.target>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>`}
    />
    <Paragraph>
      如果是 <Text bold>Spring Boot</Text> 项目，因为继承了官方的父 POM，可以更省事——
      只设一个 <InlineCode>{'<java.version>'}</InlineCode>，父 POM 会自动把它套用到 source / target 上：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml — Spring Boot 项目的简化写法"
      code={`<properties>
  <java.version>17</java.version>
</properties>`}
    />
    <Callout type="danger" title="务必显式指定编译版本！">
      <Paragraph>
        如果<Text bold>完全不配</Text>编译版本，老版本 Maven 可能会退回到一个<Text accent bold>很老的默认 JDK 版本</Text>（如 1.5 / 1.6）来编译。
        后果是：你用了 <InlineCode>var</InlineCode>、Lambda、新 API 等较新语法，编译直接报错说「不支持」，
        而错误信息往往让人一头雾水。所以无论用哪种方式，<Text bold>一定要显式声明你的 JDK 版本</Text>，
        这是新建项目时最该第一时间检查的配置之一。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>四、其它几个常见插件</Subtitle>
    <Paragraph>
      除了 compiler，你还会经常遇到这几个插件，先混个脸熟：
    </Paragraph>
    <Table
      head={['插件', '作用', '绑定的典型阶段']}
      rows={[
        ['maven-compiler-plugin', '编译主代码 / 测试代码', 'compile / test-compile'],
        ['maven-surefire-plugin', '运行单元测试、生成测试报告', 'test'],
        ['maven-jar-plugin', '把编译结果打成普通 jar', 'package'],
        ['spring-boot-maven-plugin', '打成可直接 java -jar 运行的可执行 jar', 'package（下一章细讲）'],
      ]}
    />
    <Callout type="tip" title="spring-boot-maven-plugin 预告">
      <Paragraph>
        普通 <InlineCode>maven-jar-plugin</InlineCode> 打出的 jar 不包含依赖，没法直接运行；
        而 <InlineCode>spring-boot-maven-plugin</InlineCode> 会把所有依赖一起打进去，做成「可执行 jar（fat jar）」，
        一条 <InlineCode>java -jar</InlineCode> 就能启动。具体配置和原理，留到下一章展开。
      </Paragraph>
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          生命周期的<Text bold>阶段不干活</Text>，真正执行动作的是<Text accent bold>插件（plugin）</Text>。
        </ListItem>
        <ListItem>
          插件提供<Text bold>目标（goal）</Text>，阶段<Text bold>绑定</Text>到目标上才会执行（如 compile 阶段绑 compiler 插件的 compile 目标）。
        </ListItem>
        <ListItem>
          目标也能用 <InlineCode>插件:目标</InlineCode> 单独执行，如 <InlineCode>mvn compiler:compile</InlineCode>。
        </ListItem>
        <ListItem>
          配 JDK 版本三选一：在 plugin 里写 <InlineCode>{'<source>/<target>'}</InlineCode>、用
          <InlineCode>maven.compiler.source/target</InlineCode> 属性、或 Spring Boot 的 <InlineCode>java.version</InlineCode>。
          <Text bold>务必显式指定</Text>，否则可能默认用很老的 JDK 导致语法不被支持。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
