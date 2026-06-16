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
    <Title>三套生命周期与阶段</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        每次敲 <InlineCode>mvn package</InlineCode>、<InlineCode>mvn clean</InlineCode>，背后到底发生了什么？
        Maven 把「构建一个项目」这件事，抽象成了三套互不相干的<Text accent bold>生命周期（lifecycle）</Text>，
        每套生命周期又由一连串有顺序的<Text accent bold>阶段（phase）</Text>组成。
        理解了这套模型，你就能预判任何一条 mvn 命令会做哪些事、做到哪一步。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、三套相互独立的生命周期</Subtitle>
    <Paragraph>
      Maven 内置了<Text bold>三套</Text>生命周期，它们各管一摊、互不触发：
    </Paragraph>
    <Table
      head={['生命周期', '负责什么', '常用程度']}
      rows={[
        ['clean', '清理上一次构建产生的 target 目录及其产物', '高'],
        ['default（也叫 build）', '项目的核心构建：编译、测试、打包、安装、部署', '最高'],
        ['site', '生成项目的站点文档（report、javadoc 等）', '低，了解即可'],
      ]}
    />
    <Paragraph>
      其中 <Text accent bold>default 生命周期</Text>是绝对主角，日常 90% 的命令都落在这套里。
      <InlineCode>clean</InlineCode> 负责「打扫战场」，<InlineCode>site</InlineCode> 用来生成项目文档网站，平时几乎用不上。
    </Paragraph>
    <Callout type="warning" title="三套彼此独立">
      <Paragraph>
        三套生命周期是<Text bold>平行、独立</Text>的——执行 <InlineCode>clean</InlineCode> 绝<Text bold>不会</Text>顺带触发
        build；执行 build 里的 <InlineCode>package</InlineCode> 也不会自动先 clean。
        想「先清理再打包」，得把两套生命周期的命令写在一起：<InlineCode>mvn clean package</InlineCode>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>二、default 生命周期的关键阶段</Subtitle>
    <Paragraph>
      default 生命周期内部由几十个阶段组成，但你真正要记住的是下面这条<Text bold>主干顺序</Text>。
      它们是<Text accent bold>有先后的</Text>，靠前的先执行：
    </Paragraph>
    <CodeBlock
      language="text"
      title="default 生命周期的关键阶段（从前到后）"
      code={`validate   → 校验项目配置是否正确、必要信息是否齐全
compile    → 编译主代码（src/main/java）到 target/classes
test       → 用合适的框架运行单元测试（编译并执行 src/test/java）
package    → 把编译结果打包成可分发格式，如 jar / war，放到 target 下
verify     → 对打包结果做集成测试 / 检查，确认质量合格
install    → 把打好的包安装到「本地仓库」，供本机其它项目依赖
deploy     → 把最终的包发布到「远程仓库（私服）」，供团队共享`}
    />
    <Paragraph>
      日常最常打交道的就是 <InlineCode>compile</InlineCode>、<InlineCode>test</InlineCode>、
      <InlineCode>package</InlineCode>、<InlineCode>install</InlineCode>、<InlineCode>deploy</InlineCode> 这几个。
      可以把它们想成一条流水线：源码从左边进去，一步步被编译、测试、打包，最后被安装或发布出去。
    </Paragraph>

    <Divider />

    <Subtitle>三、关键规则：执行某阶段，会自动跑完它之前的所有阶段</Subtitle>
    <Paragraph>
      这是整个生命周期模型里<Text accent bold>最重要的一条规则</Text>：当你执行某一个阶段时，
      Maven 会<Text bold>从该生命周期的第一个阶段开始，按顺序把它之前（含它自己）的所有阶段都执行一遍</Text>。
    </Paragraph>
    <Paragraph>
      所以你<Text bold>不需要</Text>手动一步步 <InlineCode>compile</InlineCode> 再 <InlineCode>test</InlineCode> 再
      <InlineCode>package</InlineCode>。直接一条 <InlineCode>mvn package</InlineCode>，Maven 自动替你跑完前面所有步骤：
    </Paragraph>
    <CodeBlock
      language="bash"
      title="一条命令，自动触发它之前的所有阶段"
      code={`# 执行 package，Maven 实际会依次执行：
#   validate → ... → compile → ... → test → ... → package
mvn package

# 执行 install，则连 package 也会先跑：
#   validate → compile → test → package → verify → install
mvn install`}
    />
    <Callout type="tip" title="一句话记住">
      <Paragraph>
        阶段越靠后，「连带做的事」越多。<InlineCode>mvn install</InlineCode> 实际上把编译、测试、打包全都做了，
        因为这些阶段都排在 <InlineCode>install</InlineCode> 之前。
      </Paragraph>
    </Callout>
    <Callout type="danger" title="注意：只在同一套生命周期内连带">
      <Paragraph>
        这条「自动跑前面阶段」的规则只在<Text bold>同一套生命周期内</Text>生效。
        <InlineCode>package</InlineCode> 属于 default，它绝不会去触发 clean 生命周期的 <InlineCode>clean</InlineCode> 阶段。
        换句话说，<InlineCode>mvn package</InlineCode> <Text bold>不会</Text>帮你删掉旧的 target——旧产物可能和新结果混在一起。
        这也正是大家习惯写 <InlineCode>mvn clean package</InlineCode> 的原因。
      </Paragraph>
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          Maven 把构建抽象成<Text bold>三套独立生命周期</Text>：<InlineCode>clean</InlineCode>（清理）、
          <InlineCode>default/build</InlineCode>（核心构建）、<InlineCode>site</InlineCode>（站点文档，了解即可）。
        </ListItem>
        <ListItem>
          default 的主干阶段顺序：
          <InlineCode>validate → compile → test → package → verify → install → deploy</InlineCode>。
        </ListItem>
        <ListItem>
          <Text accent bold>核心规则</Text>：执行某个阶段，会自动按顺序跑完它之前的所有阶段（<InlineCode>mvn package</InlineCode> 会先 compile、test）。
        </ListItem>
        <ListItem>
          三套生命周期<Text bold>彼此独立</Text>，clean 不会触发 build，所以常把 clean 和 package 写在一起。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
