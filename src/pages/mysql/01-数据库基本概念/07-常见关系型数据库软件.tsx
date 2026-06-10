import React from 'react';
import {
  Title,
  Paragraph,
  Text,
  Table,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>常见关系型数据库软件巡礼</Title>
    <Paragraph>
      市面上的关系型数据库（RDBMS 软件，本质都是
      DBMS）很多，了解它们的“定位、收费、特点”有助于你工作中选型，也常出现在面试里。
    </Paragraph>
    <Table
      head={['软件', '出品方', '收费情况', '定位 / 特点']}
      rows={[
        ['Oracle', '甲骨文', '商业收费（昂贵）', '功能最强、最稳定的“重量级选手”，大型银行/电信/政府首选，运维复杂、价格高'],
        ['MySQL', '现属 Oracle', '开源免费（有企业版）', '互联网公司最流行，轻量、快、生态好，本教程主角'],
        ['Microsoft SQL Server', '微软', '商业收费（有免费版）', '与 Windows / .NET 生态深度集成，企业内部系统常用'],
        ['DB2', 'IBM', '商业收费', 'IBM 大型机/金融行业的“老牌贵族”，稳定，多见于传统大企业'],
        ['PostgreSQL', '开源社区', '开源免费', '功能强大、标准遵循度高、扩展性强，号称“最先进的开源数据库”，近年极火'],
        ['SQLite', '开源（公有领域）', '开源免费', '嵌入式、零配置、整个库就是一个文件，常用于手机 App、浏览器、小工具'],
        ['MariaDB', '开源社区', '开源免费', 'MySQL 之父在 Oracle 收购 MySQL 后另起的分支，与 MySQL 高度兼容，可平替'],
      ]}
    />
    <Paragraph>几点要补充说明：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Oracle 系“一家三口”很容易搞混</Text>：甲骨文公司{' '}
        <Text bold>Oracle</Text> 同时拥有 <Text bold>Oracle 数据库</Text>
        （收费旗舰）和 <Text bold>MySQL</Text>（开源）。所以“被 Oracle 收购”的是
        MySQL 这个产品，而“Oracle 数据库”是另一个东西。
      </ListItem>
      <ListItem>
        <Text bold>SQLite 是个异类</Text>：它<Text bold>没有独立的服务器进程</Text>
        ，不是“客户端连服务器”的模式，而是直接以一个库文件嵌进你的程序里运行。轻、小、零运维，但不适合高并发、多用户的大型系统。
      </ListItem>
      <ListItem>
        <Text bold>MariaDB 的由来很有故事</Text>：当年 Oracle 收购了 Sun（MySQL
        的东家），MySQL 创始人 Monty 担心 MySQL 不再开源，于是带着源码{' '}
        <Text bold>fork（分叉）</Text>出了 MariaDB（名字取自他女儿 Maria），坚持开源。它和
        MySQL 几乎可以无缝替换。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      从“学习/找工作”角度看，
      <Text bold>MySQL 和 PostgreSQL 是互联网公司用得最多的两个开源关系型数据库</Text>
      ，学会其一，另一个也能很快迁移。
    </Callout>
  </article>
);

export default index;
