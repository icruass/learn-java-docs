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
    <Title>全局配置文件 mybatis-config.xml</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>mybatis-config.xml</InlineCode> 是 MyBatis
        的「总开关」，控制全局行为。本节按<Text bold>从上到下的固定顺序</Text>
        讲解最常用的几个标签：<InlineCode>properties</InlineCode>、
        <InlineCode>settings</InlineCode>、<InlineCode>typeAliases</InlineCode>、
        <InlineCode>environments</InlineCode>、<InlineCode>mappers</InlineCode>。
        实际项目里整合了 Spring Boot 后，这些大多被 <InlineCode>application.yml</InlineCode>
        替代，但理解它们能帮你看懂底层在配什么。
      </Paragraph>
    </Callout>

    <Divider />

    <Callout type="danger" title="标签顺序不能乱">
      MyBatis 的 DTD 规定了子标签的<Text bold>固定顺序</Text>，写错顺序会直接解析报错。
      记住这个口诀（只列常用）：
      <Text bold> properties → settings → typeAliases → typeHandlers → environments → mappers</Text>。
    </Callout>

    <Divider />

    <Subtitle>一、properties：外部化配置</Subtitle>
    <Paragraph>
      把数据库连接参数抽到 <InlineCode>.properties</InlineCode> 文件，配置与代码分离，
      也方便多环境切换：
    </Paragraph>
    <CodeBlock
      language="properties"
      title="resources/jdbc.properties"
      code={`jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/mybatis_demo?useSSL=false&serverTimezone=Asia/Shanghai
jdbc.username=root
jdbc.password=123456`}
    />
    <CodeBlock
      language="xml"
      title="mybatis-config.xml 引用"
      code={`<properties resource="jdbc.properties"/>

<!-- 之后用 ${'$'}{key} 占位引用 -->
<dataSource type="POOLED">
    <property name="driver"   value="${'$'}{jdbc.driver}"/>
    <property name="url"      value="${'$'}{jdbc.url}"/>
    <property name="username" value="${'$'}{jdbc.username}"/>
    <property name="password" value="${'$'}{jdbc.password}"/>
</dataSource>`}
    />

    <Divider />

    <Subtitle>二、settings：核心运行行为（最重要）</Subtitle>
    <Paragraph>
      <InlineCode>settings</InlineCode> 调整 MyBatis 的运行时行为，是<Text bold>最该掌握</Text>
      的部分。下面是企业项目里最常配的几个：
    </Paragraph>
    <Table
      head={['设置项', '作用', '建议值']}
      rows={[
        [
          <InlineCode>mapUnderscoreToCamelCase</InlineCode>,
          '下划线列名 user_name 自动映射驼峰字段 userName',
          <Text bold>true（强烈推荐）</Text>,
        ],
        [
          <InlineCode>logImpl</InlineCode>,
          '指定日志实现，开发期看 SQL',
          'STDOUT_LOGGING 或 SLF4J',
        ],
        [
          <InlineCode>cacheEnabled</InlineCode>,
          '是否开启二级缓存（全局开关）',
          '默认 true（实际是否生效看 Mapper）',
        ],
        [
          <InlineCode>lazyLoadingEnabled</InlineCode>,
          '关联查询是否懒加载',
          '按需，默认 false',
        ],
        [
          <InlineCode>defaultStatementTimeout</InlineCode>,
          'SQL 超时时间（秒）',
          '建议设置，如 30',
        ],
      ]}
    />
    <CodeBlock
      language="xml"
      code={`<settings>
    <setting name="mapUnderscoreToCamelCase" value="true"/>
    <setting name="logImpl" value="STDOUT_LOGGING"/>
    <setting name="defaultStatementTimeout" value="30"/>
</settings>`}
    />
    <Callout type="tip">
      <InlineCode>mapUnderscoreToCamelCase=true</InlineCode> 几乎是企业项目标配：
      数据库用下划线命名（<InlineCode>create_time</InlineCode>）、Java 用驼峰
      （<InlineCode>createTime</InlineCode>），开了它就能自动对应，省掉大量 resultMap。
    </Callout>

    <Divider />

    <Subtitle>三、typeAliases：类型别名</Subtitle>
    <Paragraph>
      在 Mapper XML 里写返回类型时，每次都写全限定名太长。别名让你用短名代替：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<typeAliases>
    <!-- 方式一：逐个起别名 -->
    <typeAlias type="com.example.entity.User" alias="User"/>

    <!-- 方式二：扫描整包，别名默认是「类名（不区分大小写）」—— 推荐 -->
    <package name="com.example.entity"/>
</typeAliases>`}
    />
    <Paragraph>
      配了之后，XML 里 <InlineCode>resultType="com.example.entity.User"</InlineCode>{' '}
      可简写为 <InlineCode>resultType="User"</InlineCode>。MyBatis
      还内置了常用别名：<InlineCode>int</InlineCode>、<InlineCode>string</InlineCode>、
      <InlineCode>long</InlineCode>、<InlineCode>map</InlineCode>、
      <InlineCode>list</InlineCode> 等，可直接使用。
    </Paragraph>

    <Divider />

    <Subtitle>四、environments：环境与数据源</Subtitle>
    <Paragraph>
      可以配多个 <InlineCode>environment</InlineCode>（开发/测试/生产），用{' '}
      <InlineCode>default</InlineCode> 指定默认启用哪个。每个环境包含
      <Text bold>事务管理器</Text>和<Text bold>数据源</Text>两部分：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<environments default="dev">
    <environment id="dev">
        <!-- 事务管理：JDBC（用 JDBC 原生提交回滚）/ MANAGED（交给容器，整合 Spring 时用） -->
        <transactionManager type="JDBC"/>
        <!-- 数据源：POOLED（带连接池）/ UNPOOLED（不池化）/ JNDI -->
        <dataSource type="POOLED">
            <property name="driver"   value="${'$'}{jdbc.driver}"/>
            <property name="url"      value="${'$'}{jdbc.url}"/>
            <property name="username" value="${'$'}{jdbc.username}"/>
            <property name="password" value="${'$'}{jdbc.password}"/>
        </dataSource>
    </environment>
</environments>`}
    />
    <Table
      head={['dataSource 类型', '说明']}
      rows={[
        ['POOLED', '使用连接池（复用连接），开发/单机测试常用'],
        ['UNPOOLED', '每次新建连接，仅用于简单演示'],
        ['JNDI', '从容器（如 Tomcat）的 JNDI 取数据源'],
      ]}
    />
    <Callout type="tip">
      整合 Spring / Spring Boot 后，<Text bold>数据源和事务由 Spring 接管</Text>
      （用 Druid、HikariCP 等专业连接池 + Spring 事务），这段
      <InlineCode>environments</InlineCode> 配置就不再需要了。
    </Callout>

    <Divider />

    <Subtitle>五、mappers：注册映射文件</Subtitle>
    <Paragraph>必须告诉 MyBatis 去哪儿找 SQL，四种注册方式：</Paragraph>
    <CodeBlock
      language="xml"
      code={`<mappers>
    <!-- 1. 相对路径（最常用，对应 resources 下的位置） -->
    <mapper resource="mapper/UserMapper.xml"/>

    <!-- 2. 用接口的全限定名（要求 XML 与接口同包同名，或用注解写 SQL） -->
    <mapper class="com.example.mapper.UserMapper"/>

    <!-- 3. 扫描整包（接口多时最省事，推荐） -->
    <package name="com.example.mapper"/>
</mappers>`}
    />
    <Callout type="warning" title="包扫描的目录约定">
      用 <InlineCode>class</InlineCode> 或 <InlineCode>package</InlineCode> 方式时，若
      SQL 写在 XML（而非注解），要求 XML 与接口
      <Text bold>同名且在 classpath 的相同包路径下</Text>。Maven 项目通常需要在{' '}
      <InlineCode>resources</InlineCode> 下建出和接口一致的包目录，或在{' '}
      <InlineCode>pom.xml</InlineCode> 配置把 <InlineCode>src/main/java</InlineCode>{' '}
      下的 xml 也一起打包。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          子标签<Text bold>顺序固定</Text>：properties → settings → typeAliases → environments → mappers。
        </ListItem>
        <ListItem>
          <InlineCode>settings</InlineCode> 最关键，企业必开{' '}
          <InlineCode>mapUnderscoreToCamelCase=true</InlineCode> 和 SQL 日志。
        </ListItem>
        <ListItem>
          <InlineCode>typeAliases</InlineCode> 用 <InlineCode>{'<package>'}</InlineCode> 整包起别名；
          <InlineCode>mappers</InlineCode> 用 <InlineCode>{'<package>'}</InlineCode> 整包注册。
        </ListItem>
        <ListItem>
          整合 Spring 后，数据源 / 事务 / 这份配置大多由 Spring 接管。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
