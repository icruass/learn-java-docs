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
    <Title>排除依赖与版本锁定</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节我们靠 <InlineCode>mvn dependency:tree</InlineCode> 看清了依赖冲突，这一节学三招处理它：
        ①用 <InlineCode>{'<exclusions>'}</InlineCode> <Text accent bold>排掉</Text>不想要的传递依赖；
        ②用 <InlineCode>{'<dependencyManagement>'}</InlineCode> <Text accent bold>统一锁定版本</Text>；
        ③认识 <InlineCode>{'<optional>'}</InlineCode> 可选依赖。这三招是多模块项目里依赖管理的核心手段。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、排除依赖：exclusions 砍掉不想要的传递 jar</Subtitle>
    <Paragraph>
      传递依赖虽好，但有时它带进来的某个 jar 你<Text bold>并不想要</Text>——可能和别的库冲突、
      可能你想换一个实现、也可能它和容器自带的重复了。这时用{' '}
      <InlineCode>{'<exclusions>'}</InlineCode> 把这个传递进来的依赖<Text accent bold>排除</Text>掉。
    </Paragraph>
    <Paragraph>
      写法是：在「<Text bold>带来它的那个直接依赖</Text>」里加一个{' '}
      <InlineCode>{'<exclusions>'}</InlineCode>，列出要排掉的{' '}
      <InlineCode>groupId</InlineCode> + <InlineCode>artifactId</InlineCode>（排除时
      <Text bold>不写 version</Text>，因为是把它整个排掉）：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="在 spring-core 里排掉它传递来的 commons-logging"
      code={`<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.3.39</version>
    <exclusions>
        <!-- 排掉 spring-core 默认带进来的 commons-logging，改用别的日志桥接 -->
        <exclusion>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>`}
    />
    <Callout type="warning">
      要排哪个、它是被谁带进来的，<Text bold>先用 <InlineCode>mvn dependency:tree</InlineCode> 看清楚</Text>，
      再把 <InlineCode>{'<exclusions>'}</InlineCode> 写到对应的那个直接依赖里。
      写错位置（加到没带它的依赖上）是排不掉的。
    </Callout>

    <Divider />

    <Subtitle>二、dependencyManagement：只锁版本，不真正引入</Subtitle>
    <Paragraph>
      项目一大，同一个库在好几个地方被用到，版本各写各的就乱了。
      <InlineCode>{'<dependencyManagement>'}</InlineCode> 的作用是
      <Text accent bold>集中声明版本、统一锁定</Text>。它和{' '}
      <InlineCode>{'<dependencies>'}</InlineCode> 最关键的区别是：
    </Paragraph>
    <Table
      head={['标签', '作用', '会不会真正引入 jar']}
      rows={[
        [
          'dependencyManagement',
          '只「声明/锁定版本」，给后面用的人当版本字典',
          '❌ 不引入',
        ],
        ['dependencies', '真正把依赖引入到当前模块', '✅ 引入'],
      ]}
    />
    <Paragraph>
      用法分两步：先在 <InlineCode>{'<dependencyManagement>'}</InlineCode> 里把依赖
      <Text bold>连同版本</Text>声明好；之后在 <InlineCode>{'<dependencies>'}</InlineCode> 里
      真正引用时就可以<Text accent bold>省略 version</Text>，版本自动取上面锁定的那个。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="dependencyManagement 锁版本 + dependencies 省 version"
      code={`<!-- 1) 集中锁定版本：这里声明了，但并不会真把 jar 引进来 -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.3.0</version>      <!-- 版本在这里统一定 -->
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
        </dependency>
    </dependencies>
</dependencyManagement>

<!-- 2) 真正引入：不写 version，自动用上面锁定的版本 -->
<dependencies>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <!-- 注意：这里没有 <version>，由 dependencyManagement 决定 -->
    </dependency>
</dependencies>`}
    />
    <Paragraph>
      版本号还常配合<Text bold>属性</Text>使用，把版本抽到 <InlineCode>{'<properties>'}</InlineCode> 里，
      改一处即可全局生效：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="用属性集中维护版本号"
      code={`<properties>
    <mysql.version>8.3.0</mysql.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>\${mysql.version}</version>  <!-- 引用上面的属性 -->
        </dependency>
    </dependencies>
</dependencyManagement>`}
    />
    <Callout type="tip">
      光写 <InlineCode>{'<dependencyManagement>'}</InlineCode> 而不在{' '}
      <InlineCode>{'<dependencies>'}</InlineCode> 里引用，<Text bold>当前模块是拿不到那个 jar 的</Text>
      ——因为它只「管版本」不「引依赖」。想真正用，仍要在{' '}
      <InlineCode>{'<dependencies>'}</InlineCode> 里写一笔（只是可以省 version）。
    </Callout>

    <Divider />

    <Subtitle>三、optional：可选依赖，不向下传递</Subtitle>
    <Paragraph>
      给一个依赖加上 <InlineCode>{'<optional>true</optional>'}</InlineCode>，
      表示它是<Text accent bold>可选依赖</Text>：当前模块自己能正常用它，
      但<Text bold>不会沿着传递链传给下游</Text>。
    </Paragraph>
    <CodeBlock
      language="xml"
      title="把某依赖标记为可选（不向下传递）"
      code={`<dependency>
    <groupId>org.example</groupId>
    <artifactId>fancy-feature</artifactId>
    <version>1.2.0</version>
    <optional>true</optional>   <!-- 我自己用，但别人依赖我时不自动获得它 -->
</dependency>`}
    />
    <Paragraph>
      含义是：如果 B 把某依赖标成 optional，那么当 A 依赖 B 时，A
      <Text bold>不会</Text>自动获得这个 optional 依赖。常见于「某功能用得上、但不是人人都需要」的库——
      把选择权交还给真正用到该功能的下游，由它自己显式声明。简单理解：
      <Text accent bold>optional 是「主动切断」自己这一环的传递</Text>。
    </Paragraph>

    <Divider />

    <Subtitle>四、放到多模块项目里看：父 POM 统一版本</Subtitle>
    <Paragraph>
      上面的三招，威力在<Text bold>多模块项目</Text>里才真正体现。大型项目往往拆成几十个模块，
      各模块都用 Spring、各模块都用 MySQL 驱动——要是每个模块各写各的版本，
      迟早出现「<Text accent bold>模块 A 用 5.3、模块 B 用 5.2</Text>」的版本打架。
    </Paragraph>
    <Paragraph>
      标准做法是：在<Text bold>父 POM</Text> 的{' '}
      <InlineCode>{'<dependencyManagement>'}</InlineCode> 里把所有公共依赖的版本
      <Text accent bold>统一锁定</Text>，各子模块的 <InlineCode>{'<dependencies>'}</InlineCode> 里
      只写坐标、不写版本。这样升级版本时<Text bold>只改父 POM 一处</Text>，全项目跟着变，再也不会各模块版本对不齐。
    </Paragraph>
    <Callout type="note" title="与「聚合与继承」一章呼应">
      <Paragraph>
        「父 POM 用 <InlineCode>{'<dependencyManagement>'}</InlineCode> 统一版本、子模块继承」
        正是 Maven <Text bold>继承</Text>机制的核心用法。这里先建立印象：
        <Text accent bold>dependencyManagement 是多模块版本管理的统一阀门</Text>。
        具体怎么搭父子模块、<InlineCode>{'<parent>'}</InlineCode> 和{' '}
        <InlineCode>{'<modules>'}</InlineCode> 怎么写，留到「聚合与继承」一章详解。
      </Paragraph>
    </Callout>

    <Divider />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          <InlineCode>{'<exclusions>'}</InlineCode>：在「带来它的那个直接依赖」里，按 G+A
          <Text bold>排除</Text>不想要的传递依赖（不写 version）。
        </ListItem>
        <ListItem>
          <InlineCode>{'<dependencyManagement>'}</InlineCode>：<Text accent bold>只锁版本、不引入</Text>；
          子模块 / 本模块在 <InlineCode>{'<dependencies>'}</InlineCode> 里引用时可<Text bold>省略 version</Text>。
        </ListItem>
        <ListItem>
          二者区别：dependencyManagement「管版本」，dependencies「真引入」——只写前者拿不到 jar。
        </ListItem>
        <ListItem>
          <InlineCode>{'<optional>true</optional>'}</InlineCode>：可选依赖，自己能用但
          <Text bold>不向下传递</Text>给依赖方。
        </ListItem>
        <ListItem>
          多模块项目靠父 POM 的 <Text bold>dependencyManagement 统一版本</Text>，避免各模块版本打架。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
