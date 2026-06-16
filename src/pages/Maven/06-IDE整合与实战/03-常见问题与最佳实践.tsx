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
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>常见问题与最佳实践</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        这是 Maven 章节的收尾页。前半部分把开发中最常踩的<Text accent bold>坑</Text>
        按「现象 → 原因 → 解决」逐条列清楚，遇到问题能照着排查；后半部分给出一套
        <Text accent bold>最佳实践</Text>清单，照做能少踩九成坑。最后用一张
        <Text bold>知识地图</Text>把整个 Maven 章节串起来。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、常见问题（坑）</Subtitle>
    <Paragraph>
      下面这五个问题，几乎每个用 Maven 的人都会遇到。先看汇总表快速对照，再逐条展开：
    </Paragraph>
    <Table
      head={['现象', '根本原因', '解决方案']}
      rows={[
        ['依赖下载失败 / 极慢', '走默认国外中央仓库，没配镜像', '配阿里云镜像'],
        [
          '依赖卡住下不动，出现 .lastUpdated 文件',
          '上次下载失败留下了「失败标记」',
          '删对应目录，或 mvn -U 强制重下',
        ],
        ['编译报错、版本对不上', 'JDK 版本不一致', '统一 compiler 版本 / 核对 Project SDK'],
        ['pom 改了不生效', 'IDEA 还停留在旧依赖状态', 'Reload Maven'],
        ['多模块依赖版本打架', '各模块各写各的版本', 'dependencyManagement 统一管理'],
      ]}
    />

    <Paragraph>
      <Text bold>① 依赖下载失败 / 很慢。</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem><Text bold>现象</Text>：第一次构建时卡在下载，速度只有几 KB/s，甚至超时报错。</ListItem>
      <ListItem><Text bold>原因</Text>：默认从国外的 Maven 中央仓库下载，国内访问又慢又不稳。</ListItem>
      <ListItem>
        <Text bold>解决</Text>：在 <InlineCode>settings.xml</InlineCode> 配<Text accent bold>阿里云镜像</Text>，
        让所有下载都走国内镜像。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="xml"
      title="settings.xml —— 配阿里云镜像（解决下载慢）"
      code={`<mirrors>
    <mirror>
        <id>aliyun</id>
        <name>aliyun maven</name>
        <mirrorOf>central</mirrorOf>
        <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
</mirrors>`}
    />

    <Paragraph>
      <Text bold>② 依赖卡在下载，本地仓库出现 .lastUpdated 文件。</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>现象</Text>：某个依赖死活下不下来，去本地仓库对应目录一看，里面没有 jar，
        只有一堆 <InlineCode>xxx.jar.lastUpdated</InlineCode> 文件。
      </ListItem>
      <ListItem>
        <Text bold>原因</Text>：Maven 上次下载失败后，会留下 <InlineCode>.lastUpdated</InlineCode> 标记，
        默认<Text bold>一天内不会再去重试</Text>，于是就一直「卡」着。
      </ListItem>
      <ListItem>
        <Text bold>解决</Text>：把本地仓库里那个依赖的整个目录<Text bold>删掉</Text>，
        或加 <InlineCode>-U</InlineCode> 参数<Text accent bold>强制更新、重新下载</Text>。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="bash"
      title="强制重新下载依赖"
      code={`# -U (update) 强制检查并重新下载（无视 .lastUpdated 标记）
mvn clean package -U

# 或者手动删掉本地仓库里下了一半的那个依赖目录，再重新 Reload
# 例： D:/maven-repo/com/example/some-lib/  整个删掉`}
    />

    <Paragraph>
      <Text bold>③ JDK 版本不一致，编译报错。</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>现象</Text>：报 <InlineCode>无效的目标发行版</InlineCode>、
        <InlineCode>不支持发行版本 X</InlineCode>，或语法明明没错却编译失败。
      </ListItem>
      <ListItem>
        <Text bold>原因</Text>：Maven 编译用的 Java 版本，和 IDEA 项目实际用的 JDK 对不上。
      </ListItem>
      <ListItem>
        <Text bold>解决</Text>：在 <InlineCode>{'<properties>'}</InlineCode> 里<Text accent bold>统一指定编译版本</Text>，
        同时检查 IDEA 的 <InlineCode>Project Structure → Project SDK</InlineCode> 是否一致。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="xml"
      title="pom.xml —— 用 properties 统一编译版本"
      code={`<properties>
    <!-- 一处定义，编译器统一按这个 JDK 版本来 -->
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>`}
    />

    <Paragraph>
      <Text bold>④ pom 改了不生效。</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>现象</Text>：加了依赖代码还是爆红，或改了版本却没变化。
      </ListItem>
      <ListItem>
        <Text bold>原因</Text>：IDEA 没有重新读 pom，还停留在旧的依赖状态。
      </ListItem>
      <ListItem>
        <Text bold>解决</Text>：点 <InlineCode>Load Maven Changes</InlineCode>，或在 Maven 工具窗口点
        <Text accent bold>Reload ↻</Text>（上一页讲过）。
      </ListItem>
    </UnorderedList>

    <Paragraph>
      <Text bold>⑤ 多模块版本打架。</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>现象</Text>：多模块项目里，A 模块用某库 1.0、B 模块用 2.0，运行时报
        <InlineCode>NoSuchMethodError</InlineCode> 之类的诡异错误。
      </ListItem>
      <ListItem>
        <Text bold>原因</Text>：各模块各写各的版本，没有统一来源，传递依赖一仲裁就乱套。
      </ListItem>
      <ListItem>
        <Text bold>解决</Text>：在父 pom 用 <InlineCode>{'<dependencyManagement>'}</InlineCode>
        <Text accent bold>集中声明版本</Text>，子模块只写坐标不写版本，全局保持一致。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>二、最佳实践</Subtitle>
    <Paragraph>
      把下面这几条养成习惯，上面那些坑大半都不会再找上你：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>统一镜像源</Text>：团队 settings.xml 一律配<Text accent bold>阿里云镜像</Text>（或公司私服），
        下载又快又一致。
      </ListItem>
      <ListItem>
        <Text bold>集中管版本</Text>：版本号写进 <InlineCode>{'<properties>'}</InlineCode>，
        依赖版本用 <InlineCode>{'<dependencyManagement>'}</InlineCode> 统一管理，
        改版本只改一处，杜绝多模块版本打架。
      </ListItem>
      <ListItem>
        <Text bold>定期排冲突</Text>：定期跑 <InlineCode>mvn dependency:tree</InlineCode>
        看依赖树，及早发现版本冲突和不该出现的传递依赖。
      </ListItem>
      <ListItem>
        <Text bold>打包前先 clean</Text>：习惯用 <InlineCode>mvn clean package</InlineCode>，
        先清掉旧 <InlineCode>target</InlineCode> 再构建，避免新旧产物混在一起。
      </ListItem>
      <ListItem>
        <Text bold>本地仓库放非系统盘</Text>：把 <InlineCode>{'<localRepository>'}</InlineCode>
        指到 D 盘等非系统盘，不占 C 盘、重装系统也不丢。
      </ListItem>
      <ListItem>
        <Text bold>把 target 加进 .gitignore</Text>：<InlineCode>target/</InlineCode> 是构建产物，
        随时能重新生成，<Text bold>绝不该提交</Text>到 Git。
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="text"
      title=".gitignore —— 忽略 Maven 构建产物"
      code={`# Maven 构建输出目录，不入库
target/

# IDEA 工程文件（按团队约定，通常也忽略）
.idea/
*.iml`}
    />
    <Callout type="tip">
      <Text bold>团队协作</Text>时，只提交 <InlineCode>pom.xml</InlineCode> 和源码即可。
      别人拉下来 Reload 一下，Maven 会按 pom 自动把依赖下齐——这正是「依赖声明化」的意义：
      <Text bold>jar 不入库，靠 pom 复现</Text>。
    </Callout>

    <Divider />

    <Callout type="success" title="Maven 知识地图">
      <Paragraph>
        到这里整个 Maven 章节就讲完了。回头串一遍脉络，你就能看清各部分是怎么环环相扣的：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <Text accent bold>① 入门</Text>：搞懂没有 Maven 时手动管 jar、配 classpath 有多痛，
          Maven 是<Text bold>项目管理与构建工具</Text>，核心解决「依赖管理 + 标准化构建」。
        </ListItem>
        <ListItem>
          <Text accent bold>② 项目与 POM</Text>：<InlineCode>pom.xml</InlineCode> 是项目的「身份证 + 说明书」，
          用 <Text bold>GAV 坐标</Text>定位一切，约定了标准目录结构。
        </ListItem>
        <ListItem>
          <Text accent bold>③ 依赖管理</Text>：声明 <InlineCode>{'<dependency>'}</InlineCode> 自动下载，
          理解<Text bold>传递依赖、scope 范围、版本仲裁</Text>，依赖存进本地仓库复用。
        </ListItem>
        <ListItem>
          <Text accent bold>④ 生命周期与插件</Text>：<InlineCode>clean / default / site</InlineCode> 三套生命周期，
          阶段会<Text bold>连带跑前面</Text>；真正干活的是<Text bold>插件的目标</Text>。
        </ListItem>
        <ListItem>
          <Text accent bold>⑤ 聚合与继承</Text>：父 pom 用 <InlineCode>{'<modules>'}</InlineCode> 聚合、
          子模块靠 <InlineCode>{'<parent>'}</InlineCode> 继承，
          <InlineCode>{'<dependencyManagement>'}</InlineCode> 统一管版本，搞定多模块大项目。
        </ListItem>
        <ListItem>
          <Text accent bold>⑥ IDE 与实战</Text>：在 <Text bold>IDEA</Text> 里配置并使用 Maven、
          把 Spring Boot 项目打成<Text bold>可执行 fat jar</Text>，以及本节的避坑与最佳实践。
        </ListItem>
      </UnorderedList>
      <Paragraph>
        一句话收尾：<Text bold>Maven 让「构建一个 Java 项目」变成一件标准化、可复现、自动化的事</Text>。
        坐标、依赖、生命周期、插件、继承——掌握这几块，你就能驾驭从单模块到多模块的各类工程。
      </Paragraph>
    </Callout>
  </article>
);

export default index;
