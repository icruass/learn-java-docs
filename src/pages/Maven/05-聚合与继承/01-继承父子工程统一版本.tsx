import React from 'react';
import {
  Title, Subtitle, Paragraph, Text, InlineCode, CodeBlock, Callout, Table, UnorderedList, ListItem, Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>继承：父子工程统一管理</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        当一个项目被拆成 common、dao、service、web 多个模块后，你会发现每个模块的{' '}
        <InlineCode>pom.xml</InlineCode> 里抄着几乎一模一样的依赖和版本号。本节讲 Maven 的
        <Text accent bold>继承</Text>——把这些公共配置抽到一个父工程里集中管理，子模块直接继承，从此告别复制粘贴和版本打架。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、痛点：每个模块都在抄同一份配置</Subtitle>
    <Paragraph>
      假设项目拆成了四个模块，它们都要用 Spring、JUnit、日志这几个库。没有继承时，
      <Text bold>每个模块的 pom 都得把这些依赖连同版本号原封不动写一遍</Text>：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="dao/pom.xml（service、web... 里几乎一字不差地再抄一遍）"
      code={`<dependencies>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.3.27</version>
  </dependency>
  <dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
  </dependency>
  <!-- 日志、工具库... 每个模块都要再写一份 -->
</dependencies>`}
    />
    <Paragraph>
      这样做的麻烦在于：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>重复</Text>：四个模块四份几乎相同的依赖清单，加一个库要改四个文件。
      </ListItem>
      <ListItem>
        <Text bold>版本易不一致</Text>：dao 里 Spring 写成 5.3.27，service 里手抖写成 5.2.0，
        运行期就可能因为同一个库出现两个版本而冲突，排查起来极其费劲。
      </ListItem>
      <ListItem>
        <Text bold>升级痛苦</Text>：想把 Spring 升到 6.x，得逐个模块改版本号，漏一个就埋雷。
      </ListItem>
    </UnorderedList>
    <Callout type="warning">
      根因是<Text bold>配置和版本没有「单一来源」</Text>——同一个版本号被复制到多处，迟早会有人改了这份忘了那份。
    </Callout>

    <Divider />

    <Subtitle>二、解法：抽一个父工程，子工程去继承</Subtitle>
    <Paragraph>
      Maven 的继承思路很简单，分三步：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        建一个<Text accent bold>父工程</Text>，它<Text bold>不写任何业务代码</Text>，只负责管配置，
        所以打包类型必须是 <InlineCode>{'<packaging>pom</packaging>'}</InlineCode>（而不是 jar/war）。
      </ListItem>
      <ListItem>
        子工程用 <InlineCode>{'<parent>'}</InlineCode> 标签指定父工程的 GAV（groupId、artifactId、version），表明「我爸是谁」。
      </ListItem>
      <ListItem>
        于是子工程就<Text bold>自动继承</Text>了父工程里的 <InlineCode>{'<properties>'}</InlineCode>、
        <InlineCode>{'<dependencies>'}</InlineCode>、<InlineCode>{'<dependencyManagement>'}</InlineCode>、
        插件配置等内容。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>三、父 POM：集中定义版本 + 锁版本</Subtitle>
    <Paragraph>
      父工程做两件事：用 <InlineCode>{'<properties>'}</InlineCode> 把所有版本号集中成「变量」，
      再用 <InlineCode>{'<dependencyManagement>'}</InlineCode> 统一锁定每个依赖的版本。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="parent/pom.xml（父工程，packaging=pom，不写代码）"
      code={`<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>my-parent</artifactId>
  <version>1.0.0</version>
  <!-- 关键：父工程打包类型是 pom，它本身不产出 jar/war -->
  <packaging>pom</packaging>

  <!-- 1) 版本号集中成属性，统一一处维护 -->
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <spring.version>5.3.27</spring.version>
    <junit.version>4.13.2</junit.version>
  </properties>

  <!-- 2) dependencyManagement 只「锁版本」，不真正引入依赖 -->
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>\${spring.version}</version>
      </dependency>
      <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>\${junit.version}</version>
        <scope>test</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
</project>`}
    />
    <Callout type="warning" title="属性引用必须用反斜杠转义">
      上面在 <InlineCode>{'<version>'}</InlineCode> 里引用属性，写的是
      <InlineCode>{'\\${spring.version}'}</InlineCode>——本教程的源码里必须加反斜杠，
      最终渲染出来才是正确的 <InlineCode>{'${spring.version}'}</InlineCode>。你在真实 pom.xml 里直接写
      <InlineCode>{'${spring.version}'}</InlineCode> 即可。
    </Callout>
    <Paragraph>
      <Text bold>注意区分两个标签</Text>：<InlineCode>{'<dependencyManagement>'}</InlineCode> 只是
      <Text accent bold>「声明版本」的清单</Text>，写在这里的依赖<Text bold>不会</Text>真正被引入；
      它的作用是「谁要用，统一按我这个版本」。真正引入依赖还是要靠子工程的 <InlineCode>{'<dependencies>'}</InlineCode>。
    </Paragraph>

    <Divider />

    <Subtitle>四、子 POM：引依赖不再写 version</Subtitle>
    <Paragraph>
      子工程先用 <InlineCode>{'<parent>'}</InlineCode> 认爹，然后引依赖时
      <Text accent bold>只写 groupId + artifactId，版本号交给父工程</Text>：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="dao/pom.xml（子工程）"
      code={`<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>

  <!-- 指定父工程的 GAV：我的爹是 my-parent 1.0.0 -->
  <parent>
    <groupId>com.example</groupId>
    <artifactId>my-parent</artifactId>
    <version>1.0.0</version>
  </parent>

  <!-- 子工程的 groupId / version 通常可省略（直接继承父工程的） -->
  <artifactId>my-dao</artifactId>

  <dependencies>
    <!-- 不写 version！版本由父工程的 dependencyManagement 决定 -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
    </dependency>
  </dependencies>
</project>`}
    />
    <Callout type="tip">
      子工程里 <InlineCode>{'<groupId>'}</InlineCode> 和 <InlineCode>{'<version>'}</InlineCode> 一般可以不写，
      它们会直接继承父工程的值，全项目天然保持同一个 groupId 和版本节奏。需要时也可单独覆盖。
    </Callout>

    <Divider />

    <Subtitle>五、哪些会被继承</Subtitle>
    <Paragraph>
      并不是父工程里写啥都继承。常见可继承的内容如下：
    </Paragraph>
    <Table
      head={['父工程中的元素', '子工程是否继承', '说明']}
      rows={[
        ['<properties>', '继承', '父工程定义的版本号等属性，子工程可直接引用'],
        ['<dependencies>', '继承', '父工程直接写的依赖，所有子工程都会真正拿到（要慎用）'],
        ['<dependencyManagement>', '继承', '只锁版本，子工程引同名依赖时自动套用版本'],
        ['<build>/<plugins>', '继承', '编译插件、打包插件等构建配置统一生效'],
        ['<repositories>', '继承', '私服等仓库地址也会被子工程继承'],
        ['<artifactId>', '不继承', '每个模块的 artifactId 必须自己定，否则无法区分'],
      ]}
    />
    <Callout type="note">
      <Text bold>dependencyManagement 与 dependencies 的取舍</Text>：放进
      <InlineCode>{'<dependencyManagement>'}</InlineCode> 的依赖是「用到才生效、用时不写版本」，更灵活、最常用；
      直接写进父工程 <InlineCode>{'<dependencies>'}</InlineCode> 的则会强加给所有子模块，只适合放真正人人都要的东西（如 JUnit 测试库）。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>继承解决的是<Text bold>配置和版本的重复</Text>——把公共部分抽到父工程，子工程直接复用。</ListItem>
        <ListItem>父工程不写代码，打包类型必须是 <Text accent bold>pom</Text>。</ListItem>
        <ListItem>子工程用 <InlineCode>{'<parent>'}</InlineCode> 指定父工程 GAV，即可继承属性、依赖与插件配置。</ListItem>
        <ListItem>版本号集中放 <InlineCode>{'<properties>'}</InlineCode> + <InlineCode>{'<dependencyManagement>'}</InlineCode>，子工程引依赖<Text bold>不写 version</Text>，全项目版本统一、升级只改一处。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
