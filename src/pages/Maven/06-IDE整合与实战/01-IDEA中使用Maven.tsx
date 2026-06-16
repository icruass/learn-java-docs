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
    <Title>IDEA 中使用 Maven</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前面都是在讲 Maven 本身，但真实开发里你几乎<Text bold>不会去命令行手敲 mvn</Text>，
        而是在 <Text accent bold>IntelliJ IDEA</Text> 里点点鼠标就把 Maven 用起来了。
        本节讲三件事：怎么<Text bold>配置</Text> IDEA 用哪套 Maven、Maven <Text bold>工具窗口</Text>怎么用、
        以及改了 pom 后怎么<Text bold>刷新</Text>让依赖生效。配好这三样，开发体验天差地别。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、配置 Maven：Settings 里的三项关键设置</Subtitle>
    <Paragraph>
      IDEA 自带了一套内置 Maven，开箱即用。但内置版本未必是你想要的、镜像也没配，
      所以第一件事就是去把它指向<Text bold>你自己装好、并配过阿里云镜像的 Maven</Text>。
      路径：<InlineCode>File → Settings → Build, Execution, Deployment → Build Tools → Maven</InlineCode>。
    </Paragraph>
    <Paragraph>
      这个页面看着选项多，真正关键的只有三项：
    </Paragraph>
    <Table
      head={['设置项', '含义', '建议填法']}
      rows={[
        [
          'Maven home path',
          '用哪套 Maven（内置 Bundled，还是你自己装的）',
          '选你自己装的目录，如 D:\\apache-maven-3.9.6',
        ],
        [
          'User settings file',
          'settings.xml 的位置（镜像、私服、本地仓库都配在这里）',
          '勾 Override，指向你配了阿里云镜像的那份 settings.xml',
        ],
        [
          'Local repository',
          '本地仓库路径（下载的 jar 存这儿）',
          '一般不用手填，会随 settings.xml 自动带出',
        ],
      ]}
    />
    <Paragraph>
      逻辑是一条链：你选的 <Text bold>Maven home</Text> 决定用哪套 mvn；
      勾上 Override 后指定的 <Text bold>User settings file</Text> 决定读哪份配置；
      而 <Text bold>Local repository</Text> 通常写在 settings.xml 的{' '}
      <InlineCode>{'<localRepository>'}</InlineCode> 里，IDEA 读到后会自动回填，所以你只要配好前两项即可。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="settings.xml —— 阿里云镜像 + 本地仓库路径（IDEA 会自动读取）"
      code={`<settings>
    <!-- 本地仓库路径：建议放非系统盘 -->
    <localRepository>D:/maven-repo</localRepository>

    <mirrors>
        <!-- 阿里云镜像：下载又快又稳 -->
        <mirror>
            <id>aliyun</id>
            <name>aliyun maven</name>
            <mirrorOf>central</mirrorOf>
            <url>https://maven.aliyun.com/repository/public</url>
        </mirror>
    </mirrors>
</settings>`}
    />
    <Callout type="tip" title="强烈建议这样配">
      <Paragraph>
        勾选<Text bold>用自己装的 Maven</Text>（而非 Bundled），并把 User settings file
        指向<Text bold>配好阿里云镜像的 settings.xml</Text>。这样下载依赖才快——
        否则走默认的国外中央仓库，动辄几十 KB/s，几个依赖能等到你怀疑人生。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>二、Maven 工具窗口：右侧那块面板</Subtitle>
    <Paragraph>
      配好后，IDEA 右侧（或 <InlineCode>View → Tool Windows → Maven</InlineCode>）会出现一个
      <Text accent bold>Maven 工具窗口</Text>。它把命令行那套东西全做成了可点击的树形菜单，
      是你日常和 Maven 打交道的主战场。结构大致是这样：
    </Paragraph>
    <CodeBlock
      language="text"
      title="Maven 工具窗口结构示意"
      code={`Maven  [刷新↻] [+] [执行▶] [设置⚙]
└─ my-project (你的项目名)
   ├─ Lifecycle          <- 生命周期：双击即可执行
   │   ├─ clean              清理 target
   │   ├─ validate
   │   ├─ compile            编译主代码
   │   ├─ test               跑测试
   │   ├─ package            打包成 jar/war
   │   ├─ verify
   │   ├─ install            装进本地仓库
   │   └─ deploy             发布到私服
   ├─ Plugins            <- 插件及其目标(goal)
   │   ├─ compiler
   │   │   └─ compiler:compile
   │   └─ surefire
   │       └─ surefire:test
   └─ Dependencies       <- 依赖树：能看清谁依赖了谁
       ├─ org.springframework...
       └─ ...`}
    />
    <Paragraph>
      三块各管一摊：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Lifecycle（生命周期）</Text>：列出 <InlineCode>clean</InlineCode>、
        <InlineCode>compile</InlineCode>、<InlineCode>package</InlineCode>、<InlineCode>install</InlineCode> 等阶段，
        <Text bold>双击</Text>任意一个就等于在命令行敲 <InlineCode>mvn 该阶段</InlineCode>。
        想「先清后打」就按住 Ctrl 同时选中 clean 和 package 再执行。
      </ListItem>
      <ListItem>
        <Text bold>Plugins（插件）</Text>：列出当前项目用到的插件和它们的
        <Text accent bold>目标（goal）</Text>，比如 <InlineCode>compiler:compile</InlineCode>、
        <InlineCode>spring-boot:run</InlineCode>。需要单独跑某个插件目标时在这儿点。
      </ListItem>
      <ListItem>
        <Text bold>Dependencies（依赖）</Text>：以<Text bold>树形</Text>展示项目的所有依赖，
        包括传递进来的间接依赖。排查「这个 jar 是谁带进来的 / 版本冲突」时非常有用。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      执行任意阶段后，IDEA 底部的 <InlineCode>Run</InlineCode> 窗口会打印完整的 Maven 日志，
      跟命令行输出一模一样。构建失败时，<Text bold>就去这里看红色的报错信息</Text>，别瞎猜。
    </Callout>

    <Divider />

    <Subtitle>三、改了 pom.xml 之后：一定要 Reload</Subtitle>
    <Paragraph>
      这是新手最容易踩的坑。你在 <InlineCode>pom.xml</InlineCode> 里新加了一个
      <InlineCode>{'<dependency>'}</InlineCode>，代码里却 <Text bold>import 报红、找不到类</Text>——
      多半不是依赖写错了，而是<Text accent bold>没刷新</Text>。
    </Paragraph>
    <Paragraph>
      原因：IDEA 不会每敲一个字就重读 pom。你改完 pom 后，它还停留在旧的依赖状态，
      自然不认识新加的 jar。解决办法就是手动让它重新读 pom、重新解析依赖：
    </Paragraph>
    <OrderedList>
      <ListItem>
        改完 pom 后，编辑器右上角通常会冒出一个小图标（一个旋转的刷新箭头），
        点它上面的 <InlineCode>Load Maven Changes</InlineCode> 即可。
      </ListItem>
      <ListItem>
        或者直接去 Maven 工具窗口，点左上角的<Text bold>刷新按钮 ↻</Text>（Reload All Maven Projects）。
      </ListItem>
      <ListItem>
        也可以右键项目 → <InlineCode>Maven</InlineCode> → <InlineCode>Reload Project</InlineCode>。
      </ListItem>
    </OrderedList>
    <Paragraph>
      Reload 后 IDEA 会按新的 pom 去本地仓库/远程仓库取依赖、重建索引，红线随之消失。
    </Paragraph>
    <Callout type="danger" title="依赖爆红？先怀疑这两点">
      <Paragraph>
        代码里出现<Text bold>红色波浪线、找不到类</Text>，绝大多数情况是这两个原因之一：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>没 Reload</Text>：pom 改了但没刷新 ——
          按上面的方法点一下 Reload 通常立刻好。
        </ListItem>
        <ListItem>
          <Text bold>没下下来</Text>：依赖根本没下载成功（网络/镜像问题，或本地仓库里残留了
          <InlineCode>.lastUpdated</InlineCode> 文件）—— 看底部 Maven 日志有没有下载失败的红字，
          配好镜像后再次 Reload，或用 <InlineCode>mvn -U</InlineCode> 强制重新下载（下一页详述）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          在 <InlineCode>Settings → Build Tools → Maven</InlineCode> 配三项：
          <Text bold>Maven home</Text>（用自己装的）、
          <Text bold>User settings file</Text>（指向配好镜像的 settings.xml）、
          <Text bold>Local repository</Text>（一般随 settings 自动带出）。
        </ListItem>
        <ListItem>
          右侧 <Text accent bold>Maven 工具窗口</Text>三大块：
          <Text bold>Lifecycle</Text>（双击执行 clean/package 等）、
          <Text bold>Plugins</Text>（插件目标）、<Text bold>Dependencies</Text>（依赖树）。
        </ListItem>
        <ListItem>
          改完 <InlineCode>pom.xml</InlineCode> 一定要 <Text bold>Reload / Load Maven Changes</Text>，否则新依赖不生效。
        </ListItem>
        <ListItem>
          依赖<Text bold>爆红</Text>九成是「没 Reload」或「没下下来」，按提示排查即可。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
