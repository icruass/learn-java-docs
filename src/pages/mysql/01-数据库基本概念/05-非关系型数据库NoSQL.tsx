import React from 'react';
import {
  Title,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>非关系型数据库 NoSQL：当“二维表”不够用时</Title>
    <Paragraph>
      关系型数据库很强，但不是万能的。当数据
      <Text bold>结构多变、追求极致性能、数据量爆炸式增长</Text>
      时，硬塞进二维表反而别扭。于是出现了 <Text bold>NoSQL</Text>。
    </Paragraph>

    <Heading3>5.1 NoSQL 到底是什么意思？</Heading3>
    <Paragraph>
      <InlineCode>NoSQL</InlineCode> 通常解释为{' '}
      <Text bold>“Not Only SQL”（不仅仅是 SQL）</Text>
      ，而不是“拒绝 SQL”。它泛指<Text bold>一切非关系型的数据库</Text>
      。它们的共同特点：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>不强制用二维表</Text>，数据模型灵活；
      </ListItem>
      <ListItem>
        <Text bold>通常不强求 ACID</Text>，更追求高并发、高可扩展（能轻松加机器扩容）；
      </ListItem>
      <ListItem>很多没有固定“表结构（schema）”，字段可以随时变。</ListItem>
    </UnorderedList>

    <Heading3>5.2 NoSQL 的四大类</Heading3>
    <Paragraph>按“数据怎么组织”，NoSQL 主要分四类：</Paragraph>
    <Table
      head={['类型', '一句话模型', '代表产品', '典型适用场景']}
      rows={[
        ['键值型', '一个 key 对一个 value，像超大号 HashMap', 'Redis、Memcached', '缓存、计数器、Session、排行榜——读写极快'],
        ['文档型', '存“类 JSON”的文档，字段可随意嵌套/变化', 'MongoDB', '结构多变的数据：商品详情、日志、用户配置'],
        ['列族型', '按“列”存储，适合超大规模稀疏数据', 'HBase、Cassandra', '海量数据分析、时序数据、大数据平台'],
        ['图型', '用“节点 + 边”存关系', 'Neo4j', '关系网络：社交好友、知识图谱、推荐、风控'],
      ]}
    />
    <Paragraph>
      <Text bold>直观感受一下“键值型”和“文档型”长啥样：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`键值型 (Redis)：  就像 Java 的 Map<String, String>
   "user:1001:name"  ->  "张三"
   "online_count"    ->  "528"

文档型 (MongoDB)：每条数据是一份独立的 JSON，结构可以各不相同
   {
     "_id": 1, "ename": "张三", "gender": "男",
     "salary": 8000,
     "skills": ["Java", "MySQL"],     // 可以直接存数组
     "address": { "city": "北京" }    // 可以嵌套对象
   }`}
    />
    <Callout type="tip">
      注意文档型里 <InlineCode>skills</InlineCode> 是个数组、
      <InlineCode>address</InlineCode>
      是个嵌套对象——这在关系型数据库里要拆好几张表才能表达。
      <Text bold>“结构灵活”正是 NoSQL 的最大卖点。</Text>
    </Callout>
    <Callout type="warning">
      NoSQL <Text bold>不是用来取代关系型数据库的</Text>
      ，而是“各管一段”。现实项目里常常<Text bold>两者并用</Text>
      ：核心业务数据（订单、账户）放 MySQL 保证 ACID；缓存、热点数据放 Redis
      提速；非结构化日志放 MongoDB。能根据场景选型，才是高手。
    </Callout>
  </article>
);

export default index;
