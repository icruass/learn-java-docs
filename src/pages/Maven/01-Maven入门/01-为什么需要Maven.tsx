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
    <Title>为什么需要 Maven</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        在认识 Maven 之前，先搞清楚：没有构建工具的年代，Java 项目是怎么「举步维艰」的。
        本节用三个真实痛点说明——为什么手动管理 jar、手动构建注定走不通，从而引出 Maven 存在的意义。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、痛点一：手动管理 jar 包，一个带一串</Subtitle>
    <Paragraph>
      早年写 Java 项目，要用某个第三方库，得自己去官网把它的 jar 包下载下来，丢进项目的{' '}
      <InlineCode>lib</InlineCode> 目录，再手动加到 classpath。听起来不难，真正坑人的是
      <Text accent bold>「依赖的依赖」</Text>。
    </Paragraph>
    <Paragraph>
      比如你只想用一个 JSON 解析库，结果它内部又依赖了日志库、工具库……日志库又依赖另外两个 jar。
      你以为下一个就够了，跑起来却报 <InlineCode>ClassNotFoundException</InlineCode> / <InlineCode>NoClassDefFoundError</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="text"
      title="缺了传递依赖时的典型报错"
      code={`Exception in thread "main" java.lang.NoClassDefFoundError: org/slf4j/LoggerFactory
        at com.example.JsonUtil.<clinit>(JsonUtil.java:12)
Caused by: java.lang.ClassNotFoundException: org.slf4j.LoggerFactory`}
    />
    <Paragraph>
      于是你又去搜 slf4j、下载、再跑、再报另一个缺失的类……这个过程可能要反复七八次。
      而且<Text bold>版本还必须对得上</Text>：A 库要 B 库的 1.2 版，你下成了 2.0，运行时方法签名对不上，照样炸。
      靠人肉一个个找齐「依赖树」，既繁琐又极易漏。
    </Paragraph>
    <Callout type="warning">
      手动下 jar 最折磨的不是「下载」本身，而是<Text bold>把一棵看不见的依赖树补全</Text>——
      你永远不知道还差哪几个、各自要什么版本。
    </Callout>

    <Divider />

    <Subtitle>二、痛点二：版本混乱，项目之间无法复用</Subtitle>
    <Paragraph>
      就算你历尽千辛把某个项目的 jar 凑齐了，这些 jar 是<Text bold>躺在这个项目的 lib 目录里</Text>的。
      下一个项目还要用，怎么办？再拷一份。于是同一个 <InlineCode>fastjson.jar</InlineCode> 在你硬盘上躺了十几份。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>版本乱</Text>：A 项目用的是 1.2.47，B 项目里同事拷的是 1.2.83，时间一长谁也说不清哪个项目用的哪版。
      </ListItem>
      <ListItem>
        <Text bold>体积大</Text>：每个项目都内置一整套 jar，仓库（Git）一提交，几十上百 MB 的二进制全进去了。
      </ListItem>
      <ListItem>
        <Text bold>团队难统一</Text>：你电脑上能跑，同事拉下来缺 jar；换台机器重新配 classpath，又是一遍折腾。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      根因在于：<Text accent bold>jar 包没有一个统一的「中央存放和版本标识」机制</Text>，全靠人各自为政地复制粘贴。
    </Paragraph>

    <Divider />

    <Subtitle>三、痛点三：构建过程无法标准化</Subtitle>
    <Paragraph>
      一个 Java 项目从源码到能交付，要经历一连串步骤：清理旧产物 → 编译 → 跑单元测试 → 打成 jar/war 包 → 部署。
      没有构建工具时，这些步骤要么手敲 <InlineCode>javac</InlineCode>、<InlineCode>jar</InlineCode> 命令，要么
      <Text bold>绑死在某个 IDE 的按钮上</Text>。
    </Paragraph>
    <CodeBlock
      language="bash"
      title="手动编译打包大概长这样（繁琐且易错）"
      code={`# 手动编译：得自己拼出一长串 classpath
javac -cp "lib/a.jar;lib/b.jar;lib/c.jar" -d out src/com/example/*.java

# 手动打 jar
jar -cvf app.jar -C out .

# 测试？部署？继续手敲更多命令……`}
    />
    <Paragraph>
      问题是：换台机器、换个人，classpath 里少写一个 jar、JDK 版本不一致，构建结果就不同，
      经典的<Text bold>「在我这能跑」</Text>就是这么来的。把构建依赖在 IDE 上更糟——离开那个 IDE 就没法构建，更别提自动化、上服务器了。
    </Paragraph>

    <Divider />

    <Subtitle>四、解法：一个自动管依赖 + 标准化构建的工具</Subtitle>
    <Paragraph>
      把上面三个痛点反过来想，我们真正需要的是这么一个工具：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>自动管理依赖</Text>：我只声明「我要用哪个库的哪个版本」，它就自动把这个库
        <Text accent bold>以及它所有的传递依赖</Text>一并下载齐。
      </ListItem>
      <ListItem>
        <Text bold>统一存放、按版本复用</Text>：所有 jar 集中放一处，多个项目共享，靠「坐标 + 版本」精确标识，不再到处拷贝。
      </ListItem>
      <ListItem>
        <Text bold>标准化构建</Text>：提供一套跨 IDE、跨机器结果一致的命令，编译、测试、打包一键完成。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      这个工具，就是本章的主角——<Text accent bold>Maven</Text>。下面用一张表，直观感受「传统方式 vs Maven」的差距：
    </Paragraph>
    <Table
      head={['对比维度', '传统方式（手动）', 'Maven']}
      rows={[
        ['获取依赖', '去官网一个个下载 jar', '写几行坐标，自动下载'],
        ['传递依赖', '人肉补全，反复试错', '自动解析整棵依赖树'],
        ['版本管理', '靠记忆/文件名，易乱', '坐标里显式声明版本'],
        ['jar 存放', '每个项目各拷一份', '本地仓库统一存放、共享'],
        ['构建过程', '手敲命令或绑死 IDE', '一条 mvn 命令，结果一致'],
        ['团队协作', '换人/换机器易崩', '配置随项目走，开箱即用'],
      ]}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>手动管 jar 的最大噩梦是<Text bold>补全看不见的传递依赖</Text>，繁琐且易漏。</ListItem>
        <ListItem>jar 到处拷贝导致<Text bold>版本乱、体积大、团队难统一</Text>。</ListItem>
        <ListItem>构建靠手敲命令或绑死 IDE，<Text bold>无法标准化、换环境就崩</Text>。</ListItem>
        <ListItem>我们需要一个「<Text accent bold>自动管依赖 + 标准化构建</Text>」的工具，这就是 Maven。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
