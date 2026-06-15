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
    <Title>缓存机制：一级缓存与二级缓存</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        MyBatis 内置两级缓存：<Text bold>一级缓存</Text>（默认开启，SqlSession 级）和
        <Text bold>二级缓存</Text>（需手动开启，Mapper/namespace 级）。
        理解它们能帮你解释「为什么同一个查询第二次没发 SQL」这类现象。
        但本节也会直说一个结论：<Text bold>企业项目里二级缓存通常不用</Text>，
        缓存交给 Redis 更靠谱。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、一级缓存（默认开启）</Subtitle>
    <Paragraph>
      一级缓存的作用域是<Text bold>同一个 SqlSession</Text>。在同一个 Session 里，
      执行<Text bold>相同的查询</Text>（同 statement、同参数），第二次直接从缓存拿，不再发 SQL：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`try (SqlSession session = factory.openSession()) {
    UserMapper mapper = session.getMapper(UserMapper.class);
    User u1 = mapper.selectById(1L);   // 发出 SQL，结果存入一级缓存
    User u2 = mapper.selectById(1L);   // 命中缓存，不发 SQL
    System.out.println(u1 == u2);      // true：是同一个对象引用
}`}
    />
    <Paragraph><Text bold>一级缓存会失效 / 清空的情况：</Text></Paragraph>
    <UnorderedList>
      <ListItem>换了一个 <InlineCode>SqlSession</InlineCode>（缓存不跨 Session）；</ListItem>
      <ListItem>两次查询之间执行了 <Text bold>增删改并 commit</Text>（数据可能变了，清空缓存）；</ListItem>
      <ListItem>手动调用 <InlineCode>session.clearCache()</InlineCode>；</ListItem>
      <ListItem>查询参数不同。</ListItem>
    </UnorderedList>
    <Callout type="warning" title="一级缓存可能读到「脏数据」">
      因为它只在单个 Session 内有效：A 的 Session 缓存了 user，期间 B 在另一个 Session
      改了这条记录，A 再查仍是旧值。所以一级缓存适合<Text bold>一次请求内</Text>的短周期复用，
      不适合长期持有 Session。
    </Callout>

    <Divider />

    <Subtitle>二、二级缓存（需手动开启）</Subtitle>
    <Paragraph>
      二级缓存作用域是 <Text bold>namespace（Mapper）级</Text>，可以
      <Text bold>跨 SqlSession 共享</Text>。开启需两步：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="① 全局开关（默认就是 true，确认开着）"
      code={`<settings>
    <setting name="cacheEnabled" value="true"/>
</settings>`}
    />
    <CodeBlock
      language="xml"
      title="② 在需要缓存的 Mapper XML 里加 <cache/>"
      code={`<mapper namespace="com.example.mapper.UserMapper">
    <cache/>   <!-- 开启本 Mapper 的二级缓存 -->
    ...
</mapper>`}
    />
    <Paragraph>
      此外，被缓存的实体类需要实现 <InlineCode>Serializable</InlineCode>。
      命中规则：SqlSession <Text bold>提交或关闭后</Text>，查询结果才会写入二级缓存供后续 Session 读取。
    </Paragraph>

    <Divider />

    <Subtitle>三、两级缓存对比</Subtitle>
    <Table
      head={['', '一级缓存', '二级缓存']}
      rows={[
        ['作用域', 'SqlSession（一次会话）', 'namespace / Mapper（跨会话）'],
        ['开启方式', '默认开启，无法关闭', '需 <cache/> + 全局开关'],
        ['共享范围', '同一个 Session 内', '同一 Mapper 的不同 Session 间'],
        ['失效时机', '增删改 commit、换 Session、clearCache', '本 namespace 有写操作时清空'],
      ]}
    />

    <Divider />

    <Subtitle>四、企业实践：为什么很少用二级缓存</Subtitle>
    <Paragraph>
      面试常考二级缓存，但真实项目里<Text bold>极少启用</Text>，原因很现实：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>多表关联时易脏读</Text>：二级缓存按 namespace 隔离，A 表的 Mapper
        改了数据，引用了 A 表的 B Mapper 缓存却不知道，导致读到过期数据。
      </ListItem>
      <ListItem>
        <Text bold>分布式失效</Text>：默认二级缓存在单机 JVM 内存里，多实例部署时各存各的，
        无法统一失效。
      </ListItem>
      <ListItem>
        <Text bold>有更好的替代</Text>：缓存需求统一交给{' '}
        <Text bold>Redis</Text>（配 Spring Cache 或手动操作），可控、可观测、可分布式。
      </ListItem>
    </UnorderedList>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          <Text bold>一级缓存</Text>：SqlSession 级，<Text bold>默认开启</Text>，
          同会话相同查询命中；增删改/换会话即失效。
        </ListItem>
        <ListItem>
          <Text bold>二级缓存</Text>：namespace 级，需 <InlineCode>{'<cache/>'}</InlineCode> 开启，可跨会话。
        </ListItem>
        <ListItem>
          <Text bold>实战结论</Text>：一级缓存了解即可、不用操心；二级缓存基本不开，
          缓存用 Redis。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
