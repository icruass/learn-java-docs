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
    <Title>依赖声明与查找坐标</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Maven 最香的能力就是「帮你管 jar」。本节讲清楚怎么在 <InlineCode>pom.xml</InlineCode> 里
        声明一个依赖——本质上就是写一组 <Text accent bold>GAV 坐标</Text>，
        以及怎么去仓库网站查坐标、粘进项目、让 IDEA 自动下载。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、依赖就是一组坐标：dependencies 与 dependency</Subtitle>
    <Paragraph>
      没有 Maven 时，你得自己去官网下 jar、丢进 <InlineCode>lib</InlineCode>、再配 classpath。
      用 Maven 后，你<Text bold>一行 jar 都不用下</Text>，只要在 <InlineCode>pom.xml</InlineCode> 里
      写明「我要用哪个库的哪个版本」，Maven 就替你下载。
    </Paragraph>
    <Paragraph>
      所有依赖都写在 <InlineCode>{'<dependencies>'}</InlineCode> 这个大标签里，里面每一个
      <InlineCode>{'<dependency>'}</InlineCode> 就是一个依赖。而一个依赖怎么唯一定位？靠三个元素：
    </Paragraph>
    <Table
      head={['元素', '含义', '举例']}
      rows={[
        ['groupId', '组织/公司，通常是倒写的域名', 'com.mysql'],
        ['artifactId', '具体的项目/模块名', 'mysql-connector-j'],
        ['version', '版本号', '8.3.0'],
      ]}
    />
    <Paragraph>
      这三者合称 <Text accent bold>GAV 坐标</Text>。就像「省 + 市 + 门牌号」能在全世界仓库里精确
      锁定唯一一个 jar。下面是一个最常见的例子：在项目里引入 MySQL 驱动和 JUnit 测试框架。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml —— 在 dependencies 里声明两个依赖"
      code={`<dependencies>
    <!-- MySQL 驱动：连接数据库要用 -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.3.0</version>
    </dependency>

    <!-- JUnit：写单元测试要用 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>`}
    />
    <Callout type="tip">
      <InlineCode>{'<dependencies>'}</InlineCode>（复数，容器）里装多个{' '}
      <InlineCode>{'<dependency>'}</InlineCode>（单数，一个依赖），别把单复数写反了。
      上面 JUnit 多写的 <InlineCode>{'<scope>'}</InlineCode> 是「依赖范围」，下一节专门讲。
    </Callout>

    <Divider />

    <Subtitle>二、坐标去哪儿查：mvnrepository.com 实操</Subtitle>
    <Paragraph>
      坐标不用背，也不用瞎猜。最常用的查询网站是 <Text accent bold>mvnrepository.com</Text>
      （Maven 中央仓库的搜索门户）。流程很机械：
    </Paragraph>
    <OrderedList>
      <ListItem>
        打开 <InlineCode>https://mvnrepository.com</InlineCode>，在搜索框输入关键词，
        比如要找 MySQL 驱动就搜 <Text bold>mysql connector</Text>。
      </ListItem>
      <ListItem>
        在结果里点进对应的库（如 <InlineCode>MySQL Connector/J</InlineCode>），
        会列出它的所有<Text bold>历史版本</Text>。
      </ListItem>
      <ListItem>
        选一个版本（一般选用得多、较新的稳定版，页面会标 Usages 使用量），点进去。
      </ListItem>
      <ListItem>
        页面中间有个 <Text bold>Maven</Text> 选项卡，里面就是现成的{' '}
        <InlineCode>{'<dependency>'}</InlineCode> 片段，点一下复制。
      </ListItem>
      <ListItem>
        把复制到的片段，<Text bold>粘进</Text> 你 pom.xml 的{' '}
        <InlineCode>{'<dependencies>'}</InlineCode> 标签里。
      </ListItem>
    </OrderedList>
    <Paragraph>
      你从网站复制出来的，就是上一节那种标准三件套，例如：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="从 mvnrepository 复制的片段（直接粘进 dependencies）"
      code={`<!-- https://mvnrepository.com/artifact/com.mysql/mysql-connector-j -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.3.0</version>
</dependency>`}
    />
    <Callout type="warning">
      搜索时同一个库常有<Text bold>新旧两套坐标</Text>。比如 MySQL 驱动老的是{' '}
      <InlineCode>mysql:mysql-connector-java</InlineCode>，新的是{' '}
      <InlineCode>com.mysql:mysql-connector-j</InlineCode>。别新老混用，认准一套即可。
    </Callout>

    <Divider />

    <Subtitle>三、下载到哪儿：本地仓库按 GAV 存放</Subtitle>
    <Paragraph>
      依赖声明好、刷新后，Maven 会先从<Text bold>中央仓库</Text>（或公司私服）把 jar 下载到你电脑的
      <Text accent bold>本地仓库</Text>。本地仓库默认在用户目录下的{' '}
      <InlineCode>.m2/repository</InlineCode>（可在 <InlineCode>settings.xml</InlineCode> 改路径）。
    </Paragraph>
    <Paragraph>
      jar 在本地仓库里的存放路径不是乱放的，而是<Text bold>严格按 GAV 拼出来</Text>的：
      <InlineCode>groupId 的点变成目录 / artifactId / version / 文件</InlineCode>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="本地仓库目录结构（按 GAV 规律存放）"
      code={`本地仓库根：  C:\\Users\\你\\.m2\\repository

坐标 com.mysql : mysql-connector-j : 8.3.0  对应：

repository/
  com/
    mysql/                         <- groupId 的点 . 拆成多级目录
      mysql-connector-j/           <- artifactId
        8.3.0/                     <- version
          mysql-connector-j-8.3.0.jar    <- 真正的 jar
          mysql-connector-j-8.3.0.pom    <- 它自己的 pom（记录它的依赖）`}
    />
    <Paragraph>
      理解这个规律有两个好处：①下次别的项目用到同一个 jar，Maven 直接从本地仓库拿，
      <Text bold>不再重复下载</Text>；②下载出问题（比如下了一半损坏）时，你能手动定位到那个目录，
      把对应文件夹删掉重新刷新。
    </Paragraph>

    <Callout type="tip">
      <Text bold>加完依赖一定要刷新 Maven！</Text>在 IDEA 里改完 pom.xml，右上角通常会弹出一个小图标
      提示，点 <InlineCode>Load Maven Changes</InlineCode>（或右键项目 →{' '}
      <InlineCode>Maven</InlineCode> → <InlineCode>Reload Project</InlineCode>）。
      不刷新，IDEA 还不知道你加了新 jar，代码里会爆红、找不到类。
    </Callout>

    <Divider />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          依赖写在 <InlineCode>{'<dependencies>'}</InlineCode> 里，每个{' '}
          <InlineCode>{'<dependency>'}</InlineCode> 就是一组{' '}
          <Text accent bold>GAV 坐标</Text>（groupId / artifactId / version）。
        </ListItem>
        <ListItem>
          坐标去 <Text bold>mvnrepository.com</Text> 搜：搜关键词 → 选版本 →
          复制 Maven 片段 → 粘进 pom。
        </ListItem>
        <ListItem>
          下载的 jar 存在<Text bold>本地仓库</Text>（<InlineCode>.m2/repository</InlineCode>），
          目录严格<Text bold>按 GAV 规律</Text>组织，多项目共享、不重复下。
        </ListItem>
        <ListItem>
          改完 pom 记得<Text bold>刷新 / Reload Maven</Text>，否则 IDEA 不识别新依赖。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
