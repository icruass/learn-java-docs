import React from 'react';
import {
  Title,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>常见 NoSQL：Redis 与 MongoDB</Title>
    <Paragraph>
      NoSQL 产品里，Java 开发者最常打交道的是这两位，单独认识一下。
    </Paragraph>

    <Heading3>8.1 Redis（键值型，缓存之王）</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>类型</Text>：键值（Key-Value）型，开源免费。
      </ListItem>
      <ListItem>
        <Text bold>最大特点</Text>：数据主要存在<Text bold>内存</Text>里，所以读写
        <Text bold>极快</Text>（每秒可达几万到几十万次操作）。
      </ListItem>
      <ListItem>
        <Text bold>典型用途</Text>：
        <UnorderedList>
          <ListItem>
            <Text bold>缓存</Text>：把数据库里的热点数据缓存到 Redis，减轻 MySQL
            压力（这是它最经典的角色）；
          </ListItem>
          <ListItem>
            <Text bold>计数器 / 排行榜</Text>：网站在线人数、点赞数、游戏排行榜；
          </ListItem>
          <ListItem>
            <Text bold>分布式 Session、分布式锁、消息队列</Text>等。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>数据结构丰富</Text>：不只是简单的 key-value，还支持 List、Set、Hash、有序集合等，像“加强版的内存数据结构服务器”。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      你几乎可以把 Redis
      理解成“一个独立运行、可被所有服务共享、还能持久化到磁盘的超大号{' '}
      <InlineCode>HashMap</InlineCode>”。
    </Callout>

    <Heading3>8.2 MongoDB（文档型，灵活结构之王）</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>类型</Text>：文档（Document）型，开源（社区版免费）。
      </ListItem>
      <ListItem>
        <Text bold>最大特点</Text>：以<Text bold>类 JSON 的文档（BSON）</Text>
        存数据，<Text bold>无需预先定义表结构</Text>
        ，字段随时增减，嵌套数组/对象随便存。
      </ListItem>
      <ListItem>
        <Text bold>典型用途</Text>：
        <UnorderedList>
          <ListItem>结构经常变化的数据：商品详情、用户画像、各种配置；</ListItem>
          <ListItem>海量日志、爬虫数据、内容管理系统（CMS）；</ListItem>
          <ListItem>需要快速迭代、不想频繁改表结构的项目。</ListItem>
        </UnorderedList>
      </ListItem>
    </UnorderedList>
    <Callout type="warning">
      Redis 偏“<Text bold>快</Text>”（缓存、临时高频数据），MongoDB 偏“
      <Text bold>灵活 + 海量</Text>”（结构多变的大数据）。两者定位不同，常和 MySQL
      一起出现在同一个项目里，各司其职。
    </Callout>
  </article>
);

export default index;
