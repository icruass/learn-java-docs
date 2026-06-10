import React from 'react';
import {
  Title,
  Text,
  Table,
  Callout,
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>关系型 vs 非关系型：一张对比表看清楚</Title>
    <Table
      head={['对比维度', '关系型数据库（RDBMS）', '非关系型数据库（NoSQL）']}
      rows={[
        ['数据模型', '二维表（行 + 列），结构固定', '键值 / 文档 / 列 / 图，结构灵活'],
        ['表结构(Schema)', '严格预定义，字段不能乱加', '大多无固定 schema，字段可随时变'],
        ['查询语言', '标准 SQL', '各家自定义 API / 查询方式'],
        ['表间关系', '支持外键、多表 JOIN 关联查询', '弱，通常不支持 JOIN（需在程序里处理）'],
        ['事务 / ACID', '强支持，数据强一致', '多数较弱（部分支持，常为最终一致）'],
        ['扩展方式', '偏向纵向扩展（升级单机配置）', '偏向横向扩展（加机器即可）'],
        ['性能', '复杂关联查询强，超高并发吃力', '简单读写极快，能扛海量高并发'],
        ['代表产品', 'MySQL、Oracle、PostgreSQL', 'Redis、MongoDB、HBase、Neo4j'],
        ['典型场景', '订单、账户、ERP 等强一致业务', '缓存、日志、海量数据、灵活结构数据'],
      ]}
    />
    <Callout type="success" title="选型口诀">
      <UnorderedList>
        <ListItem>
          数据<Text bold>规整、关系多、要求强一致（钱/订单）</Text> → 关系型（如 MySQL）。
        </ListItem>
        <ListItem>
          数据<Text bold>多变、量巨大、要极致读写性能</Text> → NoSQL（如 Redis / MongoDB）。
        </ListItem>
        <ListItem>
          大型项目往往<Text bold>两者搭配使用</Text>。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
