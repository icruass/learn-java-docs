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
    <Title>依赖传递与冲突调解</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Maven 最省心的地方在于「<Text accent bold>依赖传递</Text>」：你只声明直接要用的库，
        它依赖的库会被<Text bold>自动捎带</Text>进来。但便利的另一面是「版本冲突」——
        同一个库被不同路径带进来了不同版本。本节讲清楚传递怎么发生、冲突怎么来，
        以及 Maven 用哪两条原则自动调解，最后教你用一条命令定位问题。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、传递性依赖：A 要 B，自动捎来 C</Subtitle>
    <Paragraph>
      假设你的项目 A 依赖了库 B，而 B 自己又依赖了库 C。在 Maven 里，你
      <Text bold>只需要在 pom 写 B</Text>，C 会被自动带进来，不用你手写。这就是
      <Text accent bold>传递性依赖（transitive dependency）</Text>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="依赖传递示意"
      code={`你的项目 A
   └─ 依赖 B          <- 你在 pom.xml 里只写了这一行
        └─ 依赖 C     <- C 由 B 传递进来，A 自动获得，无需手写

最终 A 的 classpath 里同时有 B 和 C`}
    />
    <Paragraph>
      回想没有 Maven 的年代，你得手动把 B、C 以及 C 再依赖的东西一个个找齐——这正是
      Maven 替你干掉的苦力活。一个常见例子：你只引入一个 JSON 库，它内部依赖的日志库、
      工具库会顺带全部到位。
    </Paragraph>
    <Callout type="tip">
      传递让你「少写很多依赖」，但也意味着你的 classpath 里有<Text bold>大量你没亲手写过的 jar</Text>。
      这就是后面冲突的根源——出问题时别只盯着自己写的那几行。
    </Callout>

    <Divider />

    <Subtitle>二、版本冲突是怎么来的</Subtitle>
    <Paragraph>
      冲突的本质很简单：<Text accent bold>同一个库，被不同路径传递进来了不同的版本</Text>。
      比如：
    </Paragraph>
    <CodeBlock
      language="text"
      title="同一个库 X 被两条路径带进来，版本却不同"
      code={`你的项目 A
   ├─ 依赖 B
   │     └─ 传递依赖 X 1.0      <- 路径一：A → B → X(1.0)
   └─ 依赖 C
         └─ 传递依赖 X 2.0      <- 路径二：A → C → X(2.0)

问题：classpath 里只能有一个 X，到底用 1.0 还是 2.0？`}
    />
    <Paragraph>
      classpath 上同一个库不可能同时放两个版本，Maven 必须<Text bold>挑一个</Text>。
      挑错了就可能在运行时报 <InlineCode>NoSuchMethodError</InlineCode>、
      <InlineCode>ClassNotFoundException</InlineCode> 这类「版本对不上」的经典错误。
      那么 Maven 按什么规则挑？看下一节。
    </Paragraph>

    <Divider />

    <Subtitle>三、两条调解原则：短路径优先、同长度先声明优先</Subtitle>
    <Paragraph>
      Maven 自动调解冲突，靠的就是下面两条原则，<Text bold>按顺序</Text>判断：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text accent bold>路径最短者优先</Text>：从你的项目出发，到达那个库的「跳数」越少越优先。
      </ListItem>
      <ListItem>
        <Text accent bold>路径长度相同，则先声明者优先</Text>：跳数一样时，谁在 pom 里<Text bold>写在前面</Text>，
        就用谁带来的版本。
      </ListItem>
    </OrderedList>
    <Paragraph>
      用一个具体例子体会「短路径优先」。假设：
    </Paragraph>
    <CodeBlock
      language="text"
      title="例：短路径优先"
      code={`你的项目 A
   ├─ 依赖 B
   │     └─ 依赖 X 1.0       <- 路径 A→B→X，长度 2
   └─ 依赖 X 1.1            <- 路径 A→X，  长度 1（更短！）

结论：A→X 只有 1 跳，比 A→B→X 的 2 跳更短
     => 最终采用 X 1.1`}
    />
    <Paragraph>
      再看「同长度先声明优先」。当两条路径一样长时，比的是<Text bold>在 pom 里出现的先后</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      title="例：同长度则先声明优先"
      code={`你的项目 A 的 pom.xml 里：
   先写  依赖 B → 传递 X 1.0     <- 路径长度都是 2
   后写  依赖 C → 传递 X 2.0     <- 路径长度也是 2

两条路径一样长（都 2 跳），比谁先声明：
B 写在 C 前面  =>  最终采用 B 带来的 X 1.0`}
    />
    <Table
      head={['先比什么', '规则', '一句话记忆']}
      rows={[
        ['第 1 步', '路径最短者优先', '离你越近越赢'],
        ['第 2 步', '长度相同则先声明者优先', '一样近，先写的赢'],
      ]}
    />
    <Callout type="warning">
      注意：「先声明优先」比的是<Text bold>声明顺序</Text>，<Text bold>不是版本号大小</Text>！
      很多人以为 Maven 会自动选高版本，<Text accent bold>它不会</Text>。
      所以有时它选中的偏偏是个旧版本，这正是冲突排查里最容易踩的认知坑。
    </Callout>

    <Divider />

    <Subtitle>四、用 mvn dependency:tree 看依赖树</Subtitle>
    <Paragraph>
      冲突看不见摸不着，怎么定位？答案是把整棵依赖树打出来。命令是：
    </Paragraph>
    <CodeBlock
      language="bash"
      title="打印依赖树"
      code={`# 在项目根目录（有 pom.xml 的地方）执行
mvn dependency:tree

# 只想看某个库被谁带进来，可以过滤（-Dincludes=groupId:artifactId）
mvn dependency:tree -Dincludes=org.slf4j:slf4j-api`}
    />
    <Paragraph>
      输出大概长这样，缩进表示层级，被<Text bold>调解掉（落选）</Text>的版本会标注{' '}
      <InlineCode>omitted for conflict</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="text"
      title="mvn dependency:tree 输出（示意）"
      code={`[INFO] com.example:my-app:jar:1.0.0
[INFO] +- org.example:B:jar:2.1.0:compile
[INFO] |  \\- org.slf4j:slf4j-api:jar:1.7.36:compile        <- 最终采用这个
[INFO] \\- org.example:C:jar:3.0.0:compile
[INFO]    \\- (org.slf4j:slf4j-api:jar:1.7.25:compile - omitted for conflict with 1.7.36)
                                                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                       这版本被冲突调解掉了`}
    />
    <Paragraph>
      看懂这棵树，你就能回答三个关键问题：①某个库<Text bold>是谁带进来的</Text>（看它上一层）；
      ②实际生效的是<Text bold>哪个版本</Text>；③有没有版本被{' '}
      <InlineCode>omitted for conflict</InlineCode> 掉。定位到「带进来的人」后，
      就能用下一节的 <InlineCode>{'<exclusions>'}</InlineCode> 或{' '}
      <InlineCode>{'<dependencyManagement>'}</InlineCode> 去处理。
    </Paragraph>

    <Callout type="tip">
      <Text bold>排依赖冲突第一招，永远是先跑 <InlineCode>mvn dependency:tree</InlineCode>。</Text>
      不要凭感觉猜，先把树打出来看清「谁带来的、最终用了哪版」，再动手。
      （IDEA 也有图形化的 Dependency Analyzer，原理一样。）
    </Callout>

    <Divider />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          <Text bold>传递性依赖</Text>：A 依赖 B、B 依赖 C，则 A 自动获得 C，不用手写——这是 Maven 的省心之处。
        </ListItem>
        <ListItem>
          <Text bold>版本冲突</Text>来自：同一个库被<Text bold>不同路径</Text>传递进来不同版本，
          而 classpath 只能留一个。
        </ListItem>
        <ListItem>
          调解两原则：①<Text accent bold>路径最短者优先</Text>；②长度相同则
          <Text accent bold>先声明者优先</Text>（注意：不是选高版本！）。
        </ListItem>
        <ListItem>
          定位冲突第一招：<InlineCode>mvn dependency:tree</InlineCode>，
          看清谁带来的、最终用哪版、哪版被 <InlineCode>omitted for conflict</InlineCode>。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
