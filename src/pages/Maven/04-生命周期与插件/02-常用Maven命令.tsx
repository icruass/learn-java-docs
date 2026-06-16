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
    <Title>常用 Maven 命令</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节讲清了生命周期和阶段，本节把日常真正会敲的几条命令逐个过一遍：
        它们各自<Text accent bold>做什么、产物落在哪、对环境有什么影响</Text>，
        再讲几个高频组合与参数（跳过测试、强制更新等）。记熟这几条，日常构建就够用了。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、六条最常用的命令</Subtitle>
    <Paragraph>
      Maven 命令的本质，其实就是<Text bold>「触发某个生命周期阶段」</Text>。
      你敲 <InlineCode>mvn 阶段名</InlineCode>，Maven 就跑到那个阶段（并连带跑完它之前的阶段）。下面这张表请重点记忆：
    </Paragraph>
    <Table
      head={['命令', '作用', '产物 / 影响']}
      rows={[
        ['mvn clean', '清理上次构建的产物', '删除整个 target/ 目录'],
        ['mvn compile', '编译主代码', '生成 target/classes 下的 .class 文件'],
        ['mvn test', '编译并运行单元测试', '生成测试报告（target/surefire-reports）'],
        ['mvn package', '打包', '在 target/ 下生成 jar 或 war'],
        ['mvn install', '安装到本地仓库', '把构件复制进本地仓库，供本机其它项目依赖'],
        ['mvn deploy', '发布到远程私服', '把构件上传到远程仓库，供团队共享'],
      ]}
    />
    <Paragraph>
      <Text bold>从上到下做的事越来越多</Text>：因为这些阶段在 default 生命周期里是依次排列的，
      靠后的命令会自动把前面的步骤一并完成。比如 <InlineCode>mvn install</InlineCode> 必然先编译、跑测试、打包，才轮到安装。
    </Paragraph>

    <Callout type="tip" title="install 与 deploy 的区别（容易混）">
      <Paragraph>
        <InlineCode>install</InlineCode> 装到的是<Text accent bold>本地仓库</Text>（你电脑上的 <InlineCode>~/.m2/repository</InlineCode>），
        只有这台机器、这个用户能用；<InlineCode>deploy</InlineCode> 推到的是<Text accent bold>远程私服</Text>（如团队的 Nexus），
        全团队都能拉取。自己本机模块间相互依赖用 install，对外共享用 deploy。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>二、组合命令：clean + 阶段</Subtitle>
    <Paragraph>
      还记得「三套生命周期彼此独立」吗？<InlineCode>package</InlineCode> 不会自动 clean，
      旧的 target 产物可能残留下来。所以最常见的写法是把两套生命周期的命令<Text bold>串在一行</Text>：
    </Paragraph>
    <CodeBlock
      language="bash"
      title="日常最高频的组合命令"
      code={`# 先清理 target，再重新打包（最常用）
mvn clean package

# 先清理，再安装到本地仓库
mvn clean install

# 多个命令可以连写，按书写顺序执行
mvn clean compile test`}
    />
    <Callout type="tip" title="打包、发布前习惯先 clean">
      <Paragraph>
        正式打包、安装或发布前，养成 <InlineCode>mvn clean ...</InlineCode> 的习惯。
        否则上一次构建的旧 <InlineCode>.class</InlineCode> 或旧 jar 可能残留在 target 里，
        和这次的结果混在一起，导致「改了代码却没生效」「线上跑的是旧逻辑」这类极难排查的诡异问题。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>三、常用参数</Subtitle>
    <Paragraph>
      命令后面还能跟一些参数，微调构建行为。最常用的是这几个：
    </Paragraph>
    <Table
      head={['参数', '含义', '区别 / 要点']}
      rows={[
        ['-DskipTests', '跳过「运行」测试', '测试代码仍会被编译，只是不执行'],
        ['-Dmaven.test.skip=true', '跳过测试的「编译和运行」', '连测试代码都不编译，更彻底也更快'],
        ['-U', '强制更新依赖', '强制重新检查并下载快照（SNAPSHOT）/ 重新拉取'],
        ['-pl 模块名', '只构建指定模块', '多模块项目里单独构建某个子模块'],
      ]}
    />
    <CodeBlock
      language="bash"
      title="参数用法示例"
      code={`# 打包，但跳过运行测试（测试代码照常编译）
mvn package -DskipTests

# 打包，连测试代码都不编译（更快，但更激进）
mvn package -Dmaven.test.skip=true

# 强制更新快照依赖 / 重新下载，常用于「明明发了新版却拉不到」时
mvn clean install -U`}
    />
    <Callout type="warning" title="-DskipTests vs -Dmaven.test.skip=true">
      <Paragraph>
        两者都能让测试不运行，但区别在「测试代码编不编译」：
        <InlineCode>-DskipTests</InlineCode> 只是<Text bold>不跑</Text>测试，测试代码仍会被编译（编译错了照样报错）；
        <InlineCode>-Dmaven.test.skip=true</InlineCode> 则<Text bold>连测试代码都跳过编译</Text>。
        临时想快点出包用前者更稳妥，因为它至少保证测试代码能编过。
      </Paragraph>
    </Callout>
    <Callout type="danger" title="跳过测试只是临时手段">
      <Paragraph>
        <InlineCode>skipTests</InlineCode> 这类参数适合本地临时快速出包，
        <Text bold>不要</Text>把它当成常态、更不要写进 CI 流水线——那等于把单元测试这道质量防线直接拆了，
        坏掉的代码会一路畅通无阻地打进包里。
      </Paragraph>
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          六条核心命令：<InlineCode>clean</InlineCode>（删 target）、<InlineCode>compile</InlineCode>（编主代码）、
          <InlineCode>test</InlineCode>（跑测试）、<InlineCode>package</InlineCode>（打包）、
          <InlineCode>install</InlineCode>（装本地仓库）、<InlineCode>deploy</InlineCode>（发远程私服）。
        </ListItem>
        <ListItem>
          命令本质是<Text bold>触发某个生命周期阶段</Text>，靠后的命令会连带跑完前面的步骤。
        </ListItem>
        <ListItem>
          最高频组合是 <InlineCode>mvn clean package</InlineCode>：先清理再打包，避免旧产物残留。
        </ListItem>
        <ListItem>
          <InlineCode>-DskipTests</InlineCode> 只跳运行、<InlineCode>-Dmaven.test.skip=true</InlineCode> 连编译都跳；
          <InlineCode>-U</InlineCode> 强制更新快照 / 重新下载。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
