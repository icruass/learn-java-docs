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
    <Title>POM 详解与坐标 GAV</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节我们看到项目根目录有个 <InlineCode>pom.xml</InlineCode>，它是
        <Text accent bold>整个 Maven 项目的核心配置文件</Text>。这一节把它彻底拆开讲：
        根元素、最关键的<Text bold>坐标 GAV 三要素</Text>、版本里的{' '}
        <InlineCode>SNAPSHOT</InlineCode> 与 <InlineCode>RELEASE</InlineCode>、
        打包类型 <InlineCode>packaging</InlineCode>，以及用{' '}
        <InlineCode>properties</InlineCode> 统一管理版本号。最后给一份
        <Text bold>带详细注释的完整 pom.xml</Text>。看懂它，往后所有依赖、插件配置都不再陌生。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、POM 是什么</Subtitle>
    <Paragraph>
      <Text bold>POM = Project Object Model（项目对象模型）</Text>。Maven 把一个项目的
      所有信息——它叫什么、什么版本、依赖哪些库、用哪些插件、怎么打包——都用 XML
      描述在 <InlineCode>pom.xml</InlineCode> 里。Maven 干的每一件事，本质上都是
      <Text bold>读这个文件</Text>来决定的。
    </Paragraph>
    <Paragraph>
      最小的 <InlineCode>pom.xml</InlineCode> 长这样，有两处是<Text bold>固定不变</Text>的：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="最小 pom.xml 骨架"
      code={`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <!-- 固定写 4.0.0，是 POM 的模型版本，不要改 -->
    <modelVersion>4.0.0</modelVersion>

    <!-- 坐标三要素 GAV -->
    <groupId>com.example</groupId>
    <artifactId>my-project</artifactId>
    <version>1.0.0</version>

</project>`}
    />
    <UnorderedList>
      <ListItem>
        <Text bold>根元素 <InlineCode>{'<project>'}</InlineCode></Text>：所有配置都包在它里面；
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>{'<modelVersion>4.0.0</modelVersion>'}</InlineCode>
        </Text>
        ：POM 模型的版本，<Text bold>固定就是 4.0.0</Text>，记住照抄即可。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>二、坐标 GAV 三要素（最重要）</Subtitle>
    <Paragraph>
      Maven 用<Text accent bold>坐标（Coordinate）</Text>在仓库里
      <Text bold>唯一定位</Text>一个构件（jar），就像快递地址唯一定位一个家。坐标由
      三要素组成，合称 <Text bold>GAV</Text>：
    </Paragraph>
    <Table
      head={['要素', '元素', '含义', '取值规范 / 示例']}
      rows={[
        [
          <Text bold>G</Text>,
          <InlineCode>groupId</InlineCode>,
          '组织 / 公司标识',
          '一般用公司域名倒写，如 com.example、org.springframework',
        ],
        [
          <Text bold>A</Text>,
          <InlineCode>artifactId</InlineCode>,
          '项目 / 模块名',
          '本项目自己的名字，如 my-project、spring-core',
        ],
        [
          <Text bold>V</Text>,
          <InlineCode>version</InlineCode>,
          '版本号',
          '如 1.0.0、5.3.20、1.0.0-SNAPSHOT',
        ],
      ]}
    />
    <Paragraph>
      三者合起来 <InlineCode>groupId:artifactId:version</InlineCode> 在整个 Maven
      世界里<Text bold>唯一</Text>。你引别人的库，靠的就是写对这三个；别人引你的库，也一样。
    </Paragraph>
    <Callout type="tip">
      <InlineCode>groupId</InlineCode> 域名倒写不是强制语法，而是<Text bold>业界惯例</Text>
      ——域名全球唯一，倒写后能极大降低和别人「撞名」的概率。
    </Callout>

    <Divider />

    <Subtitle>三、版本号：SNAPSHOT 与 RELEASE</Subtitle>
    <Paragraph>
      <InlineCode>version</InlineCode> 里有两种特殊含义的版本，必须分清：
    </Paragraph>
    <Table
      head={['类型', '写法', '含义', '能否被覆盖更新']}
      rows={[
        [
          <Text bold>SNAPSHOT（快照）</Text>,
          '如 1.0.0-SNAPSHOT',
          '开发中的不稳定版本，同一版本号内容会一直变',
          '能。每次构建可拉取最新快照，反复覆盖',
        ],
        [
          <Text bold>RELEASE（正式发布）</Text>,
          '如 1.0.0',
          '正式发布版，一经发布内容就定死',
          '不能。同一版本号永远是同一份内容，不可变',
        ],
      ]}
    />
    <Paragraph>
      简单记：<Text bold>SNAPSHOT 是「开发版，随时变」，RELEASE 是「正式版，钉死了」</Text>。
      团队协作时，没发布定稿的模块挂 <InlineCode>-SNAPSHOT</InlineCode>，别人就能
      及时拿到你的最新改动；一旦定稿对外发布，就用不带 SNAPSHOT 的正式版本号。
    </Paragraph>
    <Callout type="warning" title="别用 SNAPSHOT 当线上版本">
      <InlineCode>-SNAPSHOT</InlineCode> 的内容是<Text bold>会变的</Text>，今天构建和明天
      构建可能拿到不同的 jar。线上 / 对外发布<Text bold>必须用正式版本号</Text>，
      保证「同一版本 = 同一份代码」，否则线上行为飘忽不定，事故难排查。
    </Callout>

    <Divider />

    <Subtitle>四、打包类型 packaging</Subtitle>
    <Paragraph>
      <InlineCode>{'<packaging>'}</InlineCode> 决定这个项目最终<Text bold>打成什么</Text>。
      不写时默认是 <InlineCode>jar</InlineCode>。
    </Paragraph>
    <Table
      head={['取值', '产物', '典型用途']}
      rows={[
        [
          <InlineCode>jar</InlineCode>,
          '一个 .jar',
          '默认值。普通 Java 库、工具模块、Spring Boot 应用',
        ],
        [
          <InlineCode>war</InlineCode>,
          '一个 .war',
          '传统 Web 项目，部署到 Tomcat 等外部容器',
        ],
        [
          <InlineCode>pom</InlineCode>,
          '不产出 jar/war',
          '父工程 / 聚合工程，本身只管理子模块和依赖（后面多模块章节会用到）',
        ],
      ]}
    />

    <Divider />

    <Subtitle>五、用 properties 统一管理版本号</Subtitle>
    <Paragraph>
      <InlineCode>{'<properties>'}</InlineCode> 用来定义<Text bold>自定义属性</Text>，
      然后在 POM 别处用 <InlineCode>{'${属性名}'}</InlineCode>{' '}
      引用。它最常见的两个用途：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>设置编译参数和编码</Text>，比如指定用 JDK 17 编译、源码用 UTF-8；
      </ListItem>
      <ListItem>
        <Text bold>把版本号抽出来集中管理</Text>：定义一个{' '}
        <InlineCode>{'${xxx.version}'}</InlineCode>，多个依赖统一引用，
        升级时只改一处。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      下面演示：定义编码、编译版本，以及一个自定义版本号属性{' '}
      <InlineCode>{'${spring.version}'}</InlineCode>，并在依赖里引用它（注意 XML
      里引用属性的写法 <InlineCode>{'${...}'}</InlineCode>）：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="properties 与引用"
      code={`<properties>
    <!-- 源码 / 编译目标的 JDK 版本 -->
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <!-- 源码文件编码，统一 UTF-8，根治中文乱码 -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <!-- 自定义版本号属性：集中管理 Spring 版本 -->
    <spring.version>5.3.20</spring.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <!-- 引用上面定义的属性，升级只需改 properties 一处 -->
        <version>\${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>\${spring.version}</version>
    </dependency>
</dependencies>`}
    />
    <Callout type="tip" title="为什么要抽成属性">
      没抽属性时，spring-context、spring-jdbc、spring-tx 等十几个依赖各写一遍版本号；
      升级 Spring 时要逐个改，漏一个就版本不一致、报奇怪的错。抽成{' '}
      <InlineCode>{'${spring.version}'}</InlineCode> 后，
      <Text bold>升级只改一行</Text>，全项目同步，干净又安全。
    </Callout>

    <Divider />

    <Subtitle>六、一份带注释的完整 pom.xml</Subtitle>
    <Paragraph>把上面所有元素串起来，就是一份典型的 POM：</Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml"
      code={`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <!-- POM 模型版本：固定 4.0.0，不可改 -->
    <modelVersion>4.0.0</modelVersion>

    <!-- ============ 坐标 GAV：唯一标识本项目 ============ -->
    <groupId>com.example</groupId>      <!-- 组织：公司域名倒写 -->
    <artifactId>my-project</artifactId> <!-- 项目名 -->
    <version>1.0.0-SNAPSHOT</version>   <!-- 开发中用 SNAPSHOT -->

    <!-- 打包方式：jar(默认) / war / pom -->
    <packaging>jar</packaging>

    <!-- 可选的项目描述信息 -->
    <name>my-project</name>
    <description>我的第一个 Maven 项目</description>

    <!-- ============ 自定义属性：集中管理编码、JDK、版本号 ============ -->
    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <junit.version>5.9.2</junit.version>
    </properties>

    <!-- ============ 依赖：本项目要用到的第三方库 ============ -->
    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <!-- 引用上面定义的属性 -->
            <version>\${junit.version}</version>
            <!-- scope=test 表示只在测试时用，不打进产物 -->
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>`}
    />
    <Callout type="warning" title="XML 里属性引用的写法">
      <Paragraph>
        在 <InlineCode>pom.xml</InlineCode> 中引用属性，写法就是{' '}
        <InlineCode>{'${junit.version}'}</InlineCode> 这种「美元加大括号」。
        Maven 在构建时会把它<Text bold>替换</Text>成{' '}
        <InlineCode>{'<properties>'}</InlineCode> 里定义的值。属性名要和定义处
        <Text bold>完全一致</Text>，拼错了 Maven 不会报「未定义」，而是原样保留导致版本号错误。
      </Paragraph>
    </Callout>

    <Divider />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          <InlineCode>pom.xml</InlineCode> 是 Maven 核心配置（
          <Text bold>P</Text>roject <Text bold>O</Text>bject{' '}
          <Text bold>M</Text>odel），根元素{' '}
          <InlineCode>{'<project>'}</InlineCode>，
          <InlineCode>{'<modelVersion>'}</InlineCode> 固定 4.0.0。
        </ListItem>
        <ListItem>
          <Text bold>坐标 GAV</Text>：<InlineCode>groupId</InlineCode>（域名倒写）+{' '}
          <InlineCode>artifactId</InlineCode>（项目名）+{' '}
          <InlineCode>version</InlineCode>（版本），三者唯一定位一个构件。
        </ListItem>
        <ListItem>
          <Text bold>SNAPSHOT</Text> 开发快照，可覆盖更新；
          <Text bold>RELEASE</Text> 正式版，内容不可变。线上用正式版。
        </ListItem>
        <ListItem>
          <InlineCode>packaging</InlineCode>：<InlineCode>jar</InlineCode>（默认）/{' '}
          <InlineCode>war</InlineCode>（Web）/ <InlineCode>pom</InlineCode>（父工程）。
        </ListItem>
        <ListItem>
          <InlineCode>{'<properties>'}</InlineCode> 定义属性，用{' '}
          <InlineCode>{'${名}'}</InlineCode> 引用，常用于统一编码、JDK 版本和依赖版本号。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
