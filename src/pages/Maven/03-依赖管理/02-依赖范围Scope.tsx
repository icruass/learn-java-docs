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
    <Title>依赖范围 Scope</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        同样是依赖，有的编译时要、有的只测试用、有的运行时才需要、有的根本不该打进包里。
        <InlineCode>{'<scope>'}</InlineCode>（依赖范围）就是用来控制一个依赖在
        <Text accent bold>编译 / 测试 / 运行</Text>三种场景下是否生效、以及打包时要不要带上它。
        选对 scope，是依赖管理的基本功。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、为什么需要 scope：依赖不是「一概全要」</Subtitle>
    <Paragraph>
      想象一下：JUnit 是写测试用的，<Text bold>正式上线的程序里根本不该有它</Text>；
      Lombok 只在编译期帮你生成 getter/setter，<Text bold>运行时压根用不到</Text>；
      而 Web 项目里的 <InlineCode>servlet-api</InlineCode>，你<Text bold>编译要用</Text>，
      但真正运行时是 <Text bold>Tomcat 容器</Text>提供的，你再打一份进去反而会冲突。
    </Paragraph>
    <Paragraph>
      可见，依赖在不同阶段的「需要程度」是不一样的。Maven 把程序生命周期里的 classpath 分成三类——
      <Text accent bold>编译 classpath、测试 classpath、运行 classpath</Text>，
      用 <InlineCode>{'<scope>'}</InlineCode> 来声明一个依赖在哪几类里出现，以及是否随打包带走。
    </Paragraph>

    <Divider />

    <Subtitle>二、五种 scope 一览表</Subtitle>
    <Paragraph>
      下面这张表是本节的核心，建议直接记住。「是否打包」指这个依赖最终会不会被打进
      jar/war 交付物里。
    </Paragraph>
    <Table
      head={['scope', '编译有效', '测试有效', '运行有效', '是否打包', '典型例子']}
      rows={[
        ['compile（默认）', '✅', '✅', '✅', '✅ 打包', '大多数库，如 fastjson、guava'],
        ['test', '❌', '✅', '❌', '❌ 不打包', 'junit、mockito'],
        ['provided', '✅', '✅', '❌', '❌ 不打包', 'servlet-api、lombok'],
        ['runtime', '❌', '✅', '✅', '✅ 打包', 'JDBC 驱动实现（如 MySQL 驱动）'],
        ['system', '✅', '✅', '❌', '❌ 不打包', '本地指定路径的 jar（不推荐）'],
      ]}
    />
    <UnorderedList>
      <ListItem>
        <Text bold>compile</Text>：默认值，不写 scope 就是它。全程有效、会被打包，
        日常用的大部分库都是这种。
      </ListItem>
      <ListItem>
        <Text bold>test</Text>：只在测试阶段有效，不会打进交付包。测试框架的标配。
      </ListItem>
      <ListItem>
        <Text bold>provided</Text>：编译、测试要用，但运行时由<Text bold>容器或 JDK 提供</Text>，
        所以不打包（如 servlet-api 由 Tomcat 提供，lombok 编译完就用不上）。
      </ListItem>
      <ListItem>
        <Text bold>runtime</Text>：编译时<Text bold>不需要</Text>（你的代码不直接 import 它的类），
        但测试和运行要用、要打包。JDBC <Text bold>驱动实现</Text>是经典例子——你写代码只面向 JDK 的{' '}
        <InlineCode>java.sql.*</InlineCode> 接口，具体驱动运行时才加载。
      </ListItem>
      <ListItem>
        <Text bold>system</Text>：和 provided 类似，但 jar 来自你<Text bold>本地指定的绝对路径</Text>
        （配 <InlineCode>{'<systemPath>'}</InlineCode>），脱离了仓库管理，
        <Text accent bold>强烈不推荐</Text>，了解即可。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>三、实战片段：test 与 provided 怎么写</Subtitle>
    <Paragraph>
      JUnit 是写测试用的，设成 <InlineCode>test</InlineCode>，它就不会被打进最终交付包：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="JUnit —— scope 设为 test"
      code={`<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>`}
    />
    <Paragraph>
      Web 项目里的 servlet-api，由 Tomcat 容器在运行时提供，编译用得到、但不能打包，
      设成 <InlineCode>provided</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="servlet-api —— scope 设为 provided"
      code={`<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>4.0.1</version>
    <scope>provided</scope>
</dependency>`}
    />
    <Paragraph>
      JDBC 驱动则常用 <InlineCode>runtime</InlineCode>：你的业务代码只 import JDK 的{' '}
      <InlineCode>java.sql.Connection</InlineCode> 等接口，编译期不需要驱动类，
      但运行时必须有它，否则连不上库。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="MySQL 驱动 —— scope 设为 runtime"
      code={`<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.3.0</version>
    <scope>runtime</scope>
</dependency>`}
    />

    <Callout type="warning">
      <Text bold>scope 选错的典型翻车现场：</Text>把数据库驱动错设成{' '}
      <InlineCode>provided</InlineCode>。编译、测试一切正常，一上线运行就报{' '}
      <InlineCode>ClassNotFoundException: com.mysql.cj.jdbc.Driver</InlineCode>——
      因为 provided 不打包，运行时根本没把驱动带上。
      <br />
      反过来，把本该 <InlineCode>provided</InlineCode> 的 servlet-api 写成默认{' '}
      <InlineCode>compile</InlineCode>，则可能和容器自带的同名 jar 冲突，出现诡异的{' '}
      <InlineCode>NoSuchMethodError</InlineCode> / <InlineCode>LinkageError</InlineCode>。
    </Callout>

    <Callout type="tip">
      记不住表也没关系，抓住一句口诀：<Text bold>「编译要不要、运行带不带」</Text>。
      只测试用 → test；运行时容器/JDK 给 → provided；代码不直接调、运行才需要 → runtime；
      其余 → 默认 compile。
    </Callout>

    <Divider />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          <InlineCode>{'<scope>'}</InlineCode> 控制依赖在
          <Text bold>编译 / 测试 / 运行</Text> classpath 中是否生效、以及是否被打包。
        </ListItem>
        <ListItem>
          五种：<Text bold>compile</Text>（默认，全程+打包）、<Text bold>test</Text>（仅测试）、
          <Text bold>provided</Text>（编译测试，运行由容器提供、不打包）、
          <Text bold>runtime</Text>（测试运行，编译不用）、<Text bold>system</Text>（本地路径，不推荐）。
        </ListItem>
        <ListItem>
          junit 用 test、servlet-api / lombok 用 provided、JDBC 驱动用 runtime（或默认 compile）。
        </ListItem>
        <ListItem>
          选错的最常见后果：驱动设成 provided → 运行时{' '}
          <Text accent bold>ClassNotFound</Text>。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
