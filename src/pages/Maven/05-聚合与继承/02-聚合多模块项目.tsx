import React from 'react';
import {
  Title, Subtitle, Paragraph, Text, InlineCode, CodeBlock, Callout, Table, UnorderedList, ListItem, Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>聚合：一键构建多模块</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节用<Text accent bold>继承</Text>解决了多模块的配置重复。但模块之间还有依赖关系
        （web 依赖 service，service 依赖 dao），怎么一次把它们全构建好？本节讲 Maven 的
        <Text accent bold>聚合</Text>——用一个 <InlineCode>{'<modules>'}</InlineCode> 清单，让你在父工程里
        <Text bold>一条命令构建所有模块</Text>，顺序还不用你操心。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、痛点：挨个构建模块，还得记顺序</Subtitle>
    <Paragraph>
      多模块项目里模块互相依赖，典型的依赖链是这样的：
    </Paragraph>
    <CodeBlock
      language="text"
      title="模块依赖关系"
      code={`web      ──依赖──>  service  ──依赖──>  dao  ──依赖──>  common`}
    />
    <Paragraph>
      没有聚合时，要把整个项目构建出来，你得<Text bold>按依赖顺序一个个手动 install</Text>：
      被依赖的必须先装进本地仓库，依赖它的才能编译通过。
    </Paragraph>
    <CodeBlock
      language="bash"
      title="手动逐个构建：既麻烦，还必须记对顺序"
      code={`# 必须从最底层开始，顺序错了就编译失败
cd common  && mvn install
cd ../dao  && mvn install
cd ../service && mvn install
cd ../web  && mvn install`}
    />
    <Callout type="warning">
      模块一多，依赖关系盘根错节，<Text bold>人脑排顺序极易出错</Text>——
      先装了 service 却还没装它依赖的 dao，构建就直接报「找不到依赖」而失败。
    </Callout>

    <Divider />

    <Subtitle>二、解法：用 modules 列出子模块，一键全构建</Subtitle>
    <Paragraph>
      聚合（aggregation）的做法是：找一个<Text accent bold>聚合工程</Text>（通常就是上一节那个
      packaging=pom 的父工程），在它的 pom 里用 <InlineCode>{'<modules>'}</InlineCode> 把所有子模块列出来：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="parent/pom.xml（聚合工程，packaging 必须是 pom）"
      code={`<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>my-parent</artifactId>
  <version>1.0.0</version>
  <!-- 聚合工程同样要 pom：它只负责「组织」，不产出 jar -->
  <packaging>pom</packaging>

  <!-- 列出参与聚合的所有子模块（这里写的是模块目录名） -->
  <modules>
    <module>common</module>
    <module>dao</module>
    <module>service</module>
    <module>web</module>
  </modules>
</project>`}
    />
    <Paragraph>
      配好以后，<Text accent bold>只需在聚合工程目录下执行一条命令</Text>，所有模块就被一起构建：
    </Paragraph>
    <CodeBlock
      language="bash"
      title="在聚合工程根目录执行一次即可"
      code={`mvn install`}
    />
    <Callout type="tip" title="顺序交给 Maven，不用你管">
      执行构建时<Text bold>无需关心模块的先后顺序</Text>。Maven 会自动分析各模块间的依赖关系，
      做一次<Text accent bold>拓扑排序</Text>，按「被依赖的先构建」的正确顺序一次性构建全部模块——
      上面那个 <InlineCode>common → dao → service → web</InlineCode> 的顺序，是 Maven 自己算出来的。
    </Callout>
    <Paragraph>
      <Text bold>小提示</Text>：<InlineCode>{'<module>'}</InlineCode> 里填的是子模块相对于聚合工程的
      <Text accent bold>目录名（路径）</Text>，不是子模块的 artifactId。多数项目里目录名和 artifactId 一致，但本质上是路径。
    </Paragraph>

    <Divider />

    <Subtitle>三、聚合 vs 继承：区别与联系</Subtitle>
    <Paragraph>
      聚合和继承经常被一起提到，很容易混。它俩解决的是<Text bold>两个不同的问题</Text>，方向也正好相反：
    </Paragraph>
    <Table
      head={['对比维度', '聚合（aggregation）', '继承（inheritance）']}
      rows={[
        ['解决的问题', '一键构建多个模块', '复用公共配置与版本'],
        ['方向', '父知道有哪些子（自上而下）', '子知道父是谁（自下而上）'],
        ['关键标签', '父 pom 里的 <modules>', '子 pom 里的 <parent>'],
        ['配置写在哪', '聚合工程（父）', '父工程声明，子工程引用'],
        ['对子模块的认知', '父列出子模块清单', '子声明继承自父'],
      ]}
    />
    <Paragraph>
      <Text bold>它们的联系</Text>：虽然概念独立，但在真实项目里，
      <Text accent bold>聚合和继承通常由同一个 pom（同一个父工程）同时承担</Text>——
      这个父工程既用 <InlineCode>{'<modules>'}</InlineCode> 聚合所有子模块以便一键构建，
      又用 <InlineCode>{'<properties>'}</InlineCode> / <InlineCode>{'<dependencyManagement>'}</InlineCode>
      让子工程继承公共配置。于是你只维护这一个父 pom，就同时拿到了「统一构建」和「统一配置」两份好处。
    </Paragraph>
    <Callout type="note">
      记忆口诀：<Text bold>聚合看 modules（父管子）</Text>，<Text bold>继承看 parent（子认父）</Text>；
      二者方向相反，但常常长在同一个父工程身上。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>聚合解决<Text bold>多模块一键构建</Text>：在 packaging=pom 的聚合工程里用 <InlineCode>{'<modules>'}</InlineCode> 列出所有子模块。</ListItem>
        <ListItem>在聚合工程执行 <InlineCode>mvn install</InlineCode>，Maven 会<Text accent bold>自动拓扑排序、按正确顺序</Text>一次性构建全部模块，无需手动记顺序。</ListItem>
        <ListItem><InlineCode>{'<module>'}</InlineCode> 填的是子模块<Text bold>目录名/路径</Text>，不是 artifactId。</ListItem>
        <ListItem>聚合（父管子，用于构建）与继承（子认父，用于复用配置）方向相反，<Text bold>但实际中常由同一个父 pom 同时承担</Text>。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
