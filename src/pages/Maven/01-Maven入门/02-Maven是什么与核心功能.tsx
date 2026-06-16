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
    <Title>Maven 是什么与核心功能</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节讲了「为什么需要构建工具」。这一节正式认识主角：Maven 到底是什么，
        它的两大核心功能——<Text bold>依赖管理</Text>和<Text bold>项目构建</Text>分别解决了哪个痛点，
        以及它背后那条贯穿始终的设计哲学「约定优于配置」。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、Maven 是什么</Subtitle>
    <Paragraph>
      Maven 是 <Text bold>Apache 基金会</Text>出品的一款<Text accent bold>项目管理与构建工具</Text>，
      它基于 <Text bold>POM</Text>（Project Object Model，项目对象模型）来描述和管理一个项目。
    </Paragraph>
    <Paragraph>
      所谓「基于 POM」，就是项目根目录下的一个 <InlineCode>pom.xml</InlineCode> 文件。
      它像项目的「身份证 + 说明书」：项目叫什么、是什么版本、用到哪些依赖、怎么构建，全写在里面。
      Maven 读这个文件，就知道该替你做什么。
    </Paragraph>
    <Callout type="tip">
      记住一句话：<Text bold>在 Maven 的世界里，一切围绕 pom.xml 转</Text>。后面学的依赖、插件、打包方式，
      本质都是往这个文件里写配置。
    </Callout>

    <Divider />

    <Subtitle>二、核心功能一：依赖管理</Subtitle>
    <Paragraph>
      还记得上一节「人肉补全依赖树」的噩梦吗？Maven 的第一大核心功能就是终结它。
      你只需在 <InlineCode>pom.xml</InlineCode> 里写下一段<Text accent bold>「坐标」</Text>，
      声明你要用哪个库的哪个版本：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="一段依赖坐标 = 一个库"
      code={`<dependency>
    <groupId>com.alibaba</groupId>      <!-- 组织/团体 -->
    <artifactId>fastjson</artifactId>   <!-- 具体的项目/模块 -->
    <version>2.0.51</version>           <!-- 版本号 -->
</dependency>`}
    />
    <Paragraph>
      Maven 拿到这段坐标后，会自动从仓库下载 <InlineCode>fastjson</InlineCode> 的 jar，
      <Text bold>并把它依赖的其它 jar（传递依赖）一并下载齐</Text>，还统一管理好各自的版本。
      你再也不用挨个去找、去试。
    </Paragraph>
    <Table
      head={['坐标三要素', '英文', '含义']}
      rows={[
        ['组ID', 'groupId', '一般是公司/组织的倒序域名，如 org.springframework'],
        ['项目ID', 'artifactId', '具体的项目或模块名，如 spring-core'],
        ['版本', 'version', '该构件的版本号，如 6.1.0'],
      ]}
    />
    <Callout type="tip">
      <Text bold>GAV</Text>（groupId + artifactId + version）就是一个 jar 在 Maven 世界里的「唯一地址」，
      和「省 + 市 + 门牌号」一个道理，能精确定位到全网任意一个构件。
    </Callout>

    <Divider />

    <Subtitle>三、核心功能二：项目构建</Subtitle>
    <Paragraph>
      第二大核心功能，是把「编译、测试、打包、部署」这一整套流程标准化。
      Maven 提供了一组<Text bold>统一的命令</Text>，不管你用 IDEA、Eclipse 还是纯命令行，
      不管在你的电脑还是构建服务器上，<Text accent bold>执行结果都一致</Text>。
    </Paragraph>
    <Table
      head={['常用命令', '作用']}
      rows={[
        ['mvn clean', '清理上次构建产生的 target 目录'],
        ['mvn compile', '编译主程序源码'],
        ['mvn test', '编译并运行单元测试'],
        ['mvn package', '打包成 jar / war'],
        ['mvn install', '把构件安装到本地仓库，供其它项目引用'],
        ['mvn deploy', '把构件发布到远程（私服）仓库'],
      ]}
    />
    <Paragraph>
      于是上一节那串手敲的 <InlineCode>javac</InlineCode>、<InlineCode>jar</InlineCode> 命令，
      现在浓缩成一条：
    </Paragraph>
    <CodeBlock
      language="bash"
      title="一条命令完成清理 + 打包"
      code={`mvn clean package`}
    />

    <Divider />

    <Subtitle>四、设计哲学：约定优于配置</Subtitle>
    <Paragraph>
      Maven 之所以能这么省心，靠的是<Text accent bold>「约定优于配置」</Text>
      （Convention over Configuration）这条理念：与其让你逐项配置，不如<Text bold>事先约定好一套默认规则</Text>，
      你按约定把文件放对位置，Maven 就自动知道怎么处理，几乎不用写配置。
    </Paragraph>
    <CodeBlock
      language="text"
      title="Maven 约定的标准目录结构"
      code={`my-project
├── pom.xml                 # 项目核心配置
└── src
    ├── main
    │   ├── java            # 主程序 Java 源码（约定放这）
    │   └── resources       # 主程序配置/资源文件
    └── test
        ├── java            # 测试代码（约定放这）
        └── resources       # 测试用配置/资源文件`}
    />
    <Paragraph>
      因为约定了 <InlineCode>src/main/java</InlineCode> 放源码、<InlineCode>src/test/java</InlineCode> 放测试，
      你<Text bold>不必告诉 Maven「源码在哪」</Text>，它默认就去这些目录找。这就是约定带来的便利。
    </Paragraph>
    <Callout type="warning">
      反过来说：如果你不遵守约定，把源码乱放，Maven 就找不到、构建会失败。
      <Text bold>遵守约定，是用好 Maven 的前提。</Text>
    </Callout>

    <Divider />

    <Subtitle>五、一个最小的 pom.xml</Subtitle>
    <Paragraph>
      综合以上，一个最小可用的 <InlineCode>pom.xml</InlineCode> 大致长这样
      （注意里面用到的属性引用写法）：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml —— 最小骨架"
      code={`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <!-- 本项目自己的坐标 -->
    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0.0</version>

    <!-- 自定义属性，下面可用 \${...} 引用 -->
    <properties>
        <java.version>17</java.version>
    </properties>

    <!-- 声明依赖 -->
    <dependencies>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>2.0.51</version>
        </dependency>
    </dependencies>
</project>`}
    />
    <Callout type="note">
      上面 <InlineCode>{'<properties>'}</InlineCode> 里定义的属性，在 pom 别处可用
      <InlineCode>{'${java.version}'}</InlineCode> 这样的写法引用——这是 Maven 里到处可见的「属性占位符」，
      后续章节会专门讲。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>Maven 是 Apache 出品、<Text bold>基于 POM（pom.xml）</Text>的项目管理与构建工具。</ListItem>
        <ListItem><Text bold>依赖管理</Text>：写几行 GAV 坐标，自动下载该 jar 及其全部传递依赖。</ListItem>
        <ListItem><Text bold>项目构建</Text>：一套标准命令（clean/compile/test/package/install/deploy），跨环境结果一致。</ListItem>
        <ListItem>核心理念<Text accent bold>「约定优于配置」</Text>：按约定的目录结构放文件，几乎不用额外配置。</ListItem>
        <ListItem>一句话：把「加依赖」变成写三行坐标，把「打包」变成一条 <InlineCode>mvn package</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
