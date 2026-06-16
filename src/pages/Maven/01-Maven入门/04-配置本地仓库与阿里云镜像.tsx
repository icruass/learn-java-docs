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
    <Title>配置本地仓库与阿里云镜像</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Maven 装好后还差最后一步「调教」：告诉它把下载的 jar 放哪（本地仓库），
        以及从哪下载更快（镜像）。这两项配置都写在 <InlineCode>settings.xml</InlineCode> 里。
        不配镜像，国内下依赖会慢到怀疑人生——这是新手最该立刻解决的问题。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、settings.xml：Maven 的全局配置文件</Subtitle>
    <Paragraph>
      <InlineCode>settings.xml</InlineCode> 是 Maven 的全局配置文件，本地仓库、镜像、私服账号等都配在这。
      它有两个可放位置，<Text bold>用户级优先于全局级</Text>：
    </Paragraph>
    <Table
      head={['位置', '路径', '作用范围']}
      rows={[
        ['全局配置', 'MAVEN_HOME/conf/settings.xml', '本机所有用户'],
        ['用户配置', '~/.m2/settings.xml', '仅当前用户（优先级更高）'],
      ]}
    />
    <Callout type="tip">
      推荐<Text bold>直接改 MAVEN_HOME/conf/settings.xml</Text>（简单，全机生效）。
      若用户目录下也有一份，则以用户目录那份为准。下面的配置两处通用。
    </Callout>

    <Divider />

    <Subtitle>二、配置本地仓库 localRepository</Subtitle>
    <Paragraph>
      Maven 下载的所有 jar 都缓存在<Text accent bold>本地仓库</Text>里，多个项目共享这一份（这就解决了上节说的「到处拷 jar」）。
      默认位置在用户目录下的 <InlineCode>~/.m2/repository</InlineCode>。
    </Paragraph>
    <Paragraph>
      问题是：这个目录会越积越大（几个 GB 很常见），而它默认在 C 盘（系统盘）。
      建议改到别的盘，给系统盘减负：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="settings.xml —— 自定义本地仓库路径（顶层 <settings> 直接子元素）"
      code={`<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0">

    <!-- 把本地仓库改到 D 盘，避免占用系统盘 -->
    <localRepository>D:/dev/maven-repository</localRepository>

</settings>`}
    />
    <Callout type="warning">
      <InlineCode>{'<localRepository>'}</InlineCode> 必须是 <InlineCode>{'<settings>'}</InlineCode> 的
      <Text bold>直接子元素</Text>，别塞进别的标签里。路径同样建议<Text bold>无空格、无中文</Text>，
      目录不存在 Maven 会自动创建。
    </Callout>

    <Divider />

    <Subtitle>三、配置阿里云镜像加速下载</Subtitle>
    <Paragraph>
      Maven 默认从位于国外的<Text bold>中央仓库</Text>（Maven Central）下载依赖，国内访问又慢又容易断。
      解决办法是配一个<Text accent bold>镜像（mirror）</Text>：把对中央仓库的请求，统统转发到速度快的
      <Text bold>阿里云仓库</Text>。
    </Paragraph>
    <Paragraph>
      在 <InlineCode>settings.xml</InlineCode> 的 <InlineCode>{'<mirrors>'}</InlineCode> 节点里加入：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="settings.xml —— 阿里云镜像"
      code={`<mirrors>
    <mirror>
        <!-- 镜像的唯一标识，随便起个有意义的名字 -->
        <id>aliyunmaven</id>
        <!-- 关键：替换哪个仓库。central = 替换默认的中央仓库 -->
        <mirrorOf>central</mirrorOf>
        <!-- 镜像名称，描述用 -->
        <name>阿里云公共仓库</name>
        <!-- 阿里云仓库地址 -->
        <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
</mirrors>`}
    />

    <Divider />

    <Subtitle>四、mirrorOf 写 central 还是 *？</Subtitle>
    <Paragraph>
      <InlineCode>{'<mirrorOf>'}</InlineCode> 决定「这个镜像替换掉哪些仓库的请求」，两种常见写法区别很大：
    </Paragraph>
    <Table
      head={['mirrorOf 的值', '含义', '建议']}
      rows={[
        ['central', '只替换默认的中央仓库，其它仓库照常直连', '✅ 推荐，最稳妥'],
        ['*', '替换所有仓库（含项目里声明的私服等）的请求', '⚠️ 慎用，可能误伤私服'],
      ]}
    />
    <Paragraph>
      多数情况写 <InlineCode>central</InlineCode> 就够了：你只是想加速「下公共依赖」这件事。
      写成 <InlineCode>*</InlineCode> 会把<Text bold>所有</Text>仓库请求都拦到阿里云，
      如果项目本身配了公司私服，私服里的私有包就可能下不到了。
    </Paragraph>
    <Callout type="danger" title="镜像没配好的后果">
      <Text bold>不配镜像，或地址写错</Text>，最典型的现象就是：执行构建时长时间卡在
      <InlineCode>Downloading from central: ...</InlineCode> 不动，几分钟才下一个 jar，构建奇慢甚至超时失败。
      遇到「构建一直在下载、慢得离谱」，<Text bold>第一反应就该检查镜像配置</Text>。
    </Callout>

    <Divider />

    <Subtitle>五、可选：用 profile 统一编译 JDK 版本</Subtitle>
    <Paragraph>
      还可以用一个 <InlineCode>{'<profile>'}</InlineCode> 给<Text bold>本机所有项目</Text>设定默认的编译 JDK 版本，
      省得每个项目都单独配。简单了解即可：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="settings.xml —— 全局默认 JDK 17（可选）"
      code={`<profiles>
    <profile>
        <id>jdk-17</id>
        <activation>
            <activeByDefault>true</activeByDefault>
            <jdk>17</jdk>
        </activation>
        <properties>
            <maven.compiler.source>17</maven.compiler.source>
            <maven.compiler.target>17</maven.compiler.target>
            <maven.compiler.compilerVersion>17</maven.compiler.compilerVersion>
        </properties>
    </profile>
</profiles>`}
    />
    <Callout type="note">
      这只是「全局默认」。<Text bold>项目自己的 pom.xml 里若指定了 JDK 版本，会覆盖这里</Text>，
      所以更推荐在各项目的 pom.xml 中显式声明编译版本，settings.xml 里这段了解即可。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>全局配置写在 <InlineCode>settings.xml</InlineCode>（<InlineCode>MAVEN_HOME/conf/</InlineCode> 或 <InlineCode>~/.m2/</InlineCode>，后者优先）。</ListItem>
        <ListItem><InlineCode>{'<localRepository>'}</InlineCode> 把本地仓库迁出系统盘，多项目共享这份缓存。</ListItem>
        <ListItem><InlineCode>{'<mirrors>'}</InlineCode> 配阿里云镜像（<InlineCode>https://maven.aliyun.com/repository/public</InlineCode>）大幅加速下载。</ListItem>
        <ListItem><InlineCode>{'<mirrorOf>'}</InlineCode> 一般写 <Text bold>central</Text>；写 <Text bold>*</Text> 会拦截所有仓库，可能误伤私服。</ListItem>
        <ListItem>构建一直卡在 Downloading，<Text bold>先查镜像配置</Text>。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
