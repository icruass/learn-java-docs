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
    <Title>第一个 Maven 项目与标准目录结构</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一章我们知道了 Maven 是「项目管理 + 构建」工具。这一节先把一个 Maven
        项目<Text bold>长什么样</Text>搞清楚：它有一套
        <Text bold>固定的目录布局</Text>，源码、资源、测试、构建产物各有各的位置。
        Maven 奉行<Text accent bold>「约定优于配置」（Convention over Configuration）</Text>
        ——只要你把文件<Text bold>放对位置</Text>，Maven 就自动知道去哪儿找它们，
        几乎不用写任何配置。理解这套约定，是用好 Maven 的第一步。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、标准目录结构长什么样</Subtitle>
    <Paragraph>
      用 IDEA 或命令创建出来的 Maven 项目，目录大致是这样（以模块名{' '}
      <InlineCode>my-project</InlineCode> 为例）：
    </Paragraph>
    <CodeBlock
      language="text"
      title="Maven 标准目录结构"
      code={`my-project
├── pom.xml                  ← 项目配置（核心）
├── src
│   ├── main
│   │   ├── java             ← 主源代码
│   │   └── resources        ← 主资源（配置文件等）
│   └── test
│       ├── java             ← 测试源代码
│       └── resources        ← 测试资源
└── target                   ← 构建产物（编译class、jar，自动生成）`}
    />
    <Paragraph>
      记住一句话：<Text bold>main 是给「真正要发布的代码」用的，test 是给「测试代码」用的</Text>，
      两边内部又各自分 <InlineCode>java</InlineCode>（写 .java）和{' '}
      <InlineCode>resources</InlineCode>（放配置等非代码文件）。
    </Paragraph>

    <Divider />

    <Subtitle>二、逐个目录放什么</Subtitle>
    <Table
      head={['目录', '放什么', '说明']}
      rows={[
        [
          <InlineCode>pom.xml</InlineCode>,
          '项目配置文件',
          '整个项目的「身份证 + 说明书」，依赖、插件、坐标都写在这（下一节详解）',
        ],
        [
          <InlineCode>src/main/java</InlineCode>,
          '主源代码',
          '你写的业务 .java 文件，会被编译并打进最终的 jar/war',
        ],
        [
          <InlineCode>src/main/resources</InlineCode>,
          '主资源',
          '配置文件（如 application.yml、xxx.properties、mapper.xml），打包时会一起进 jar',
        ],
        [
          <InlineCode>src/test/java</InlineCode>,
          '测试源代码',
          'JUnit 等测试类，只在测试阶段运行，不会打进最终产物',
        ],
        [
          <InlineCode>src/test/resources</InlineCode>,
          '测试资源',
          '只在测试时用的配置，比如专门的测试数据库连接',
        ],
        [
          <InlineCode>target</InlineCode>,
          '构建产物',
          'Maven 自动生成：编译后的 .class、打好的 jar/war 都在这',
        ],
      ]}
    />

    <Callout type="tip" title="为什么「放对位置就不用配置」">
      <Paragraph>
        换作没有约定的老式项目，你得手动告诉构建工具：「源码在哪个文件夹、资源在哪、
        编译结果输出到哪……」一堆路径配置，每个项目还都不一样，换个项目就懵。
      </Paragraph>
      <Paragraph>
        Maven 把这些<Text bold>统一约定死了</Text>：源码就在{' '}
        <InlineCode>src/main/java</InlineCode>，资源就在{' '}
        <InlineCode>src/main/resources</InlineCode>，产物就进{' '}
        <InlineCode>target</InlineCode>。于是<Text bold>所有 Maven 项目结构都一样</Text>，
        你不用配、别人也一看就懂。这就是「约定优于配置」省心的地方。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>三、怎么创建一个 Maven 项目</Subtitle>

    <Paragraph>
      <Text bold>方式一（推荐）：用 IDEA 创建。</Text>最简单直观，几乎人人都这么干。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        菜单 <InlineCode>File → New → Project</InlineCode>；
      </ListItem>
      <ListItem>
        左侧选 <Text bold>Maven</Text>（或新版 IDEA 里「构建系统」选 Maven）；
      </ListItem>
      <ListItem>
        填好 <InlineCode>GroupId</InlineCode> / <InlineCode>ArtifactId</InlineCode>
        （下一节讲），点 Finish；
      </ListItem>
      <ListItem>
        IDEA 自动生成上面那套目录和一个 <InlineCode>pom.xml</InlineCode>，开箱即用。
      </ListItem>
    </UnorderedList>

    <Paragraph>
      <Text bold>方式二：用命令行 archetype 生成骨架。</Text>不依赖 IDE 时可用。
      <Text italic>archetype</Text> 就是<Text bold>「项目模板」</Text>的意思——
      Maven 按某个模板帮你生成一套现成的目录和文件：
    </Paragraph>
    <CodeBlock
      language="bash"
      title="用 archetype 生成一个最简单的 Java 项目骨架"
      code={`mvn archetype:generate \\
  -DgroupId=com.example \\
  -DartifactId=my-project \\
  -DarchetypeArtifactId=maven-archetype-quickstart \\
  -DinteractiveMode=false`}
    />
    <Paragraph>
      其中 <InlineCode>maven-archetype-quickstart</InlineCode> 是官方最常用的「快速开始」模板，
      会生成带 <InlineCode>App.java</InlineCode> 和一个测试类的标准结构。
      <InlineCode>-DinteractiveMode=false</InlineCode> 表示不用交互式问答，一把生成。
    </Paragraph>

    <Divider />

    <Subtitle>四、target 不要提交到 Git</Subtitle>
    <Callout type="warning" title="target 是产物，不进版本库">
      <Paragraph>
        <InlineCode>target</InlineCode> 目录里全是<Text bold>构建生成的东西</Text>
        （.class、jar），它们随时能由源码<Text bold>重新构建出来</Text>，
        属于「派生物」而非「源文件」。把它提交到 Git 不仅毫无意义，还会让仓库巨大、
        频繁冲突。
      </Paragraph>
      <Paragraph>
        正确做法：在项目根目录的 <InlineCode>.gitignore</InlineCode> 里忽略它。
      </Paragraph>
    </Callout>
    <CodeBlock
      language="text"
      title=".gitignore"
      code={`target/
*.class
.idea/
*.iml`}
    />

    <Divider />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          Maven 项目有<Text bold>固定目录结构</Text>：
          <InlineCode>pom.xml</InlineCode> +{' '}
          <InlineCode>src/main/(java|resources)</InlineCode> +{' '}
          <InlineCode>src/test/(java|resources)</InlineCode> +{' '}
          <InlineCode>target</InlineCode>。
        </ListItem>
        <ListItem>
          <Text bold>约定优于配置</Text>：文件放对位置，Maven 自动识别，不用写路径配置。
        </ListItem>
        <ListItem>
          main 放正式代码与资源，test 放测试代码与资源，
          <InlineCode>target</InlineCode> 放自动生成的产物。
        </ListItem>
        <ListItem>
          创建方式：<Text bold>IDEA 选 Maven</Text> 最方便；命令行可用{' '}
          <InlineCode>mvn archetype:generate</InlineCode>（archetype = 项目模板）。
        </ListItem>
        <ListItem>
          <InlineCode>target</InlineCode> 是产物，
          <Text bold>用 .gitignore 忽略，不要提交</Text>。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
