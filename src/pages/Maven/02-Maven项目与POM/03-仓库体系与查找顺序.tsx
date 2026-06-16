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
    <Title>仓库体系与依赖查找顺序</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前面我们在 <InlineCode>pom.xml</InlineCode> 里写下一个依赖坐标，Maven
        就能把对应的 jar「变」出来。它到底<Text bold>从哪儿弄来的</Text>？
        答案是<Text accent bold>仓库（Repository）</Text>。这一节讲清 Maven 的
        三级仓库（本地 / 私服 / 中央）、它<Text bold>按什么顺序查找下载</Text>，
        以及坐标和本地磁盘目录是怎么一一对应的。搞懂这套，依赖下不下来、为什么慢、
        jar 存哪了，你都能心里有数。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、三级仓库</Subtitle>
    <Paragraph>
      Maven 的仓库分三层，由近及远：
    </Paragraph>
    <Table
      head={['仓库', '位置', '作用', '是否必需']}
      rows={[
        [
          <Text bold>本地仓库</Text>,
          <span>本机磁盘 <InlineCode>~/.m2/repository</InlineCode></span>,
          '已下载的 jar 都缓存在这，离你最近、最快',
          '必需（自动生成）',
        ],
        [
          <Text bold>远程私服</Text>,
          '公司 / 团队内网服务器（如 Nexus）',
          '团队内部共享构件、代理中央仓库加速',
          '可选',
        ],
        [
          <Text bold>中央仓库</Text>,
          'Maven Central（Apache 官方，全球公网）',
          '全世界开源 jar 的「总仓库」，绝大多数依赖都在这',
          '默认就有',
        ],
      ]}
    />

    <Paragraph>
      <Text bold>① 本地仓库（local repository）</Text>：在你电脑上，默认路径{' '}
      <InlineCode>~/.m2/repository</InlineCode>（Windows 上即{' '}
      <InlineCode>C:\Users\你的用户名\.m2\repository</InlineCode>）。所有下载过的
      jar 都缓存在这里，相当于你本机的「jar 仓库」。
    </Paragraph>
    <Paragraph>
      <Text bold>② 远程私服（如 Nexus）</Text>：公司或团队<Text bold>自己搭</Text>的
      内网仓库，用来共享团队内部模块、并代理中央仓库做缓存加速。它是
      <Text bold>可选</Text>的——个人学习时通常没有，直连中央仓库即可。
    </Paragraph>
    <Paragraph>
      <Text bold>③ 中央仓库（Maven Central）</Text>：Apache 维护的
      <Text bold>全球官方仓库</Text>，几乎所有开源库都发布在这。Maven 自带它的地址，
      你不配置也能用。
    </Paragraph>

    <Divider />

    <Subtitle>二、依赖查找顺序</Subtitle>
    <Paragraph>
      当 Maven 需要某个依赖时，它<Text bold>由近及远</Text>地找，找到就停，
      核心原则是<Text accent bold>「先用本地缓存，没有才去远程下载，下载完再缓存到本地」</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      title="依赖查找流程"
      code={`需要某个依赖（按坐标找）
        │
        ▼
  ① 查本地仓库 (~/.m2/repository)
        │
   找到？──是──> 直接使用（最快，不联网）
        │
        否
        ▼
  ② 去远程仓库下载（有私服先走私服，否则走中央仓库）
        │
   下载成功？──是──> 缓存到本地仓库 ──> 使用
        │
        否
        ▼
     构建失败：报错「找不到依赖 / 无法下载」`}
    />
    <Paragraph>用文字再捋一遍：</Paragraph>
    <OrderedList>
      <ListItem>
        先翻<Text bold>本地仓库</Text>：有这个坐标的 jar 吗？有就直接用，
        <Text bold>根本不联网</Text>；
      </ListItem>
      <ListItem>
        本地没有，就去<Text bold>远程</Text>下载：配了私服先问私服，
        没私服就直接去<Text bold>中央仓库</Text>；
      </ListItem>
      <ListItem>
        下载到的 jar 会<Text bold>存进本地仓库</Text>缓存起来；
      </ListItem>
      <ListItem>
        <Text bold>下次</Text>再用同一个依赖，第①步就命中本地，秒取。
      </ListItem>
    </OrderedList>

    <Divider />

    <Subtitle>三、坐标与本地仓库目录的对应</Subtitle>
    <Paragraph>
      本地仓库不是把 jar 一股脑堆一起，而是<Text bold>按坐标 GAV 分层建目录</Text>
      存放：<InlineCode>groupId</InlineCode> 的点 <InlineCode>.</InlineCode>{' '}
      变成层级目录，再进 <InlineCode>artifactId</InlineCode>、再进{' '}
      <InlineCode>version</InlineCode>，jar 就躺在最里层。
    </Paragraph>
    <Paragraph>
      举例：坐标{' '}
      <InlineCode>org.springframework : spring-context : 5.3.20</InlineCode>{' '}
      在本地仓库里的路径是：
    </Paragraph>
    <CodeBlock
      language="text"
      title="坐标 → 本地仓库目录"
      code={`~/.m2/repository
└── org
    └── springframework               ← groupId: org.springframework
        └── spring-context            ← artifactId
            └── 5.3.20                ← version
                ├── spring-context-5.3.20.jar    ← 真正的 jar
                └── spring-context-5.3.20.pom    ← 它自己的 pom（记录它又依赖谁）`}
    />
    <Callout type="tip">
      知道这个规则，排查问题就方便了：依赖「下不下来 / 报红」时，去对应目录看看 jar
      到底存没存、是不是只下了半截（出现 <InlineCode>.lastUpdated</InlineCode>{' '}
      之类的文件往往就是上次没下全），删掉重新构建即可。
    </Callout>

    <Divider />

    <Subtitle>四、去哪儿查坐标</Subtitle>
    <Paragraph>
      想引用某个库，得先知道它的 GAV。最常用的网站是{' '}
      <Text bold>mvnrepository.com</Text>（Maven Repository）：搜库名，它会直接给出
      可<Text bold>复制粘贴</Text>的 <InlineCode>{'<dependency>'}</InlineCode>{' '}
      配置片段，连各个版本都列得清清楚楚。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="从 mvnrepository.com 复制来的依赖片段"
      code={`<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.3.20</version>
</dependency>`}
    />

    <Divider />

    <Callout type="tip" title="第一次构建慢是正常的">
      <Paragraph>
        新项目或新依赖<Text bold>第一次构建特别慢</Text>，不是卡了，是 Maven 正在
        从远程仓库<Text bold>一个个下载 jar</Text>（还会连带下载它们依赖的 jar）。
        下完之后全缓存进了本地仓库，<Text bold>之后再构建走本地缓存，就飞快了</Text>。
        所以「第一次慢、后面快」是 Maven 的常态，耐心等首次下载完即可。
      </Paragraph>
    </Callout>

    <Divider />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          三级仓库：<Text bold>本地仓库</Text>（
          <InlineCode>~/.m2/repository</InlineCode>，本机缓存）→{' '}
          <Text bold>远程私服</Text>（如 Nexus，可选）→{' '}
          <Text bold>中央仓库</Text>（Maven Central，官方）。
        </ListItem>
        <ListItem>
          查找顺序：<Text bold>先本地</Text>，没有再去（私服 →）中央仓库下载，
          <Text bold>下载后缓存到本地</Text>，下次直接用。
        </ListItem>
        <ListItem>
          本地仓库<Text bold>按 groupId/artifactId/version 分层</Text>存放，
          groupId 的点变成目录层级。
        </ListItem>
        <ListItem>
          查坐标用 <Text bold>mvnrepository.com</Text>，能直接复制{' '}
          <InlineCode>{'<dependency>'}</InlineCode> 片段。
        </ListItem>
        <ListItem>
          <Text bold>第一次构建慢</Text>是在下载依赖，之后走本地缓存就快了。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
