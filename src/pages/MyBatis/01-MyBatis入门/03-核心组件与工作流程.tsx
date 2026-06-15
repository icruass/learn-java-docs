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
    <Title>核心组件与工作流程</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节我们照着步骤把程序跑通了，但 <InlineCode>getMapper</InlineCode>{' '}
        拿到的接口明明没有实现类，为什么能执行 SQL？这一节拆开 MyBatis
        的「发动机」，讲清楚<Text bold>四大核心对象</Text>、
        <Text bold>Mapper 代理的原理</Text>和<Text bold>一条 SQL 的完整执行链路</Text>。
        理解了它，排错和看源码都会轻松很多。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、四大核心对象及其生命周期</Subtitle>
    <Table
      head={['对象', '作用', '生命周期（作用域）']}
      rows={[
        [
          <InlineCode>SqlSessionFactoryBuilder</InlineCode>,
          '读配置、建造 Factory',
          <Text bold>方法级</Text>,
        ],
        [
          <InlineCode>SqlSessionFactory</InlineCode>,
          '生产 SqlSession 的工厂',
          <Text bold>应用级（单例）</Text>,
        ],
        [
          <InlineCode>SqlSession</InlineCode>,
          '一次会话，执行 SQL、管理事务',
          <Text bold>请求/方法级</Text>,
        ],
        [
          <InlineCode>Mapper 代理</InlineCode>,
          '接口的运行时实现，调方法即执行 SQL',
          '跟随所属 SqlSession',
        ],
      ]}
    />
    <Callout type="danger" title="生命周期用错 = 性能灾难 / 线程不安全">
      <UnorderedList>
        <ListItem>
          <InlineCode>SqlSessionFactory</InlineCode> 一旦建好就<Text bold>全局单例</Text>常驻，
          <Text bold>绝不要</Text>每次操作都重建（重建要重新解析所有配置，极慢）。
        </ListItem>
        <ListItem>
          <InlineCode>SqlSession</InlineCode> <Text bold>不是线程安全的</Text>，
          绝不能多个线程共用、也不能定义成成员变量；它应该「方法内打开、用完即关」。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>二、它们之间的关系</Subtitle>
    <CodeBlock
      language="text"
      title="自上而下的生产链"
      code={`mybatis-config.xml
       │  read
       ▼
SqlSessionFactoryBuilder  ──build()──▶  SqlSessionFactory  (单例,全程一个)
                                              │ openSession()
                                              ▼
                                         SqlSession  (一次会话/一个线程)
                                              │ getMapper(UserMapper.class)
                                              ▼
                                     UserMapper 代理对象  (动态生成)
                                              │ selectById(1L)
                                              ▼
                                       执行 SQL，返回 User`}
    />

    <Divider />

    <Subtitle>三、Mapper 代理：接口没实现类，为什么能调用？</Subtitle>
    <Paragraph>
      答案是<Text bold>动态代理（JDK Dynamic Proxy）</Text>。当你调用{' '}
      <InlineCode>session.getMapper(UserMapper.class)</InlineCode> 时，MyBatis
      用 <InlineCode>MapperProxyFactory</InlineCode> 在运行时生成一个实现了该接口的
      <Text bold>代理对象</Text>。你调用接口方法时，实际进入代理的统一拦截逻辑：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`mapper.selectById(1L)
   │
   ▼  代理拦截，做三件事：
   1. 用「接口全限定名 + 方法名」拼出 statementId = com.example.mapper.UserMapper.selectById
   2. 用这个 id 找到对应的 <select> 标签（即那条 SQL）
   3. 委托给 SqlSession 执行：sqlSession.selectOne(statementId, 1L)`}
    />
    <Paragraph>
      这正是上一节强调「namespace = 接口全限定名、id = 方法名」的根本原因——
      <Text bold>它们拼起来就是 MyBatis 定位 SQL 的唯一钥匙</Text>。
    </Paragraph>
    <Callout type="tip">
      代理机制还带来一个好处：Mapper 接口可以直接交给 Spring
      容器注入使用（<InlineCode>@Autowired</InlineCode>），这是后面整合 Spring
      的基础。
    </Callout>

    <Divider />

    <Subtitle>四、一条 SQL 的完整执行流程</Subtitle>
    <Paragraph>从代理往下，内部还有几个关键角色协作：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Configuration</Text>：全局配置的「内存镜像」，启动时由 XML
        解析而来，持有所有 <Text bold>MappedStatement</Text>（一个标签 = 一个）。
      </ListItem>
      <ListItem>
        <Text bold>Executor 执行器</Text>：真正干活的人，负责调度、缓存、调用 JDBC。
      </ListItem>
      <ListItem>
        <Text bold>StatementHandler</Text>：创建并设置{' '}
        <InlineCode>PreparedStatement</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>ParameterHandler / ResultSetHandler</Text>：分别负责
        「Java 参数 → SQL 占位符」和「ResultSet → Java 对象」。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      title="selectById(1L) 内部流转"
      code={`Mapper 代理
   └─▶ SqlSession
         └─▶ Executor（先查一级缓存，命中直接返回）
               └─▶ StatementHandler 创建 PreparedStatement
                     ├─ ParameterHandler 把 1L 填进 #{id} 占位符
                     ├─ 执行 SQL，拿到 ResultSet
                     └─ ResultSetHandler 把每行封装成 User 对象
   ◀── 返回 User（同时存入一级缓存）`}
    />
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          四大对象：<InlineCode>SqlSessionFactoryBuilder</InlineCode>（建工厂）、
          <InlineCode>SqlSessionFactory</InlineCode>（<Text bold>单例</Text>）、
          <InlineCode>SqlSession</InlineCode>（<Text bold>非线程安全，用完即关</Text>）、Mapper 代理。
        </ListItem>
        <ListItem>
          Mapper 接口靠<Text bold>动态代理</Text>工作，用「namespace + id」定位 SQL。
        </ListItem>
        <ListItem>
          执行链路：代理 → SqlSession → Executor →
          StatementHandler → 参数/结果处理器，中间还夹着一级缓存。
        </ListItem>
        <ListItem>
          记牢生命周期：Factory 单例常驻、Session 短命且线程不安全。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
