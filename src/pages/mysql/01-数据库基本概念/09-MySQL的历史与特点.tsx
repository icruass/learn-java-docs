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
  OrderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>MySQL 的历史与特点（我们为什么选它）</Title>
    <Paragraph>
      终于轮到主角。理解 MySQL
      的来龙去脉，能帮你在版本选择、社区版/企业版等问题上不踩坑。
    </Paragraph>

    <Heading3>9.1 简要历史脉络</Heading3>
    <CodeBlock
      language="text"
      code={`1995 年  瑞典 MySQL AB 公司发布 MySQL，开源、免费、轻量，迅速风靡互联网。
            │
2008 年  Sun Microsystems（升阳）以约 10 亿美元收购 MySQL AB。
            │
2010 年  Oracle（甲骨文）收购 Sun —— MySQL 从此归 Oracle 所有。
            │
            │  （MySQL 创始人 Monty 担忧其开源前景，fork 出了 MariaDB）
            ▼
至今     MySQL 仍是全球最流行的开源关系型数据库之一，被海量互联网公司使用。`}
    />
    <Callout type="danger">
      面试常问“MySQL 现在属于哪家公司？”——答案是 <Text bold>Oracle（甲骨文）</Text>
      ，而不是它最初的 MySQL AB，也不是 Sun。收购链路是：
      <Text bold>MySQL AB → Sun → Oracle</Text>。
    </Callout>

    <Heading3>9.2 社区版 vs 企业版</Heading3>
    <Table
      head={['版本', '是否收费', '面向人群 / 特点']}
      rows={[
        ['社区版 (Community)', '免费、开源', '个人学习、绝大多数互联网公司用的就是它，功能完全够用'],
        ['企业版 (Enterprise)', '付费', '提供额外的监控、备份、安全、技术支持等高级特性与官方服务'],
      ]}
    />
    <Callout type="tip">
      我们整套教程、以及你日常学习开发，<Text bold>用免费的社区版就够了</Text>
      。下一章安装时，下载的也是社区版。
    </Callout>

    <Heading3>9.3 MySQL 5.x 与 8.x 的主要区别</Heading3>
    <Paragraph>
      你在网上会看到 5.7 和 8.0 两个常见版本，简单了解它们的差异（不必死记，有个印象即可）：
    </Paragraph>
    <Table
      head={['对比点', 'MySQL 5.x（如 5.7）', 'MySQL 8.x（如 8.0+）']}
      rows={[
        ['默认字符集', 'latin1（易出中文乱码）', 'utf8mb4（完整支持中文、emoji，更省心）'],
        ['性能', '较好', '显著优化，整体更快'],
        ['新特性', '较少', '支持窗口函数、CTE（WITH 公用表表达式）、隐藏索引等现代 SQL 特性'],
        ['默认认证插件', 'mysql_native_password', 'caching_sha2_password（更安全，但老客户端/驱动可能连不上，需注意）'],
        ['数据字典', '部分用表 + 部分用文件', '统一的事务性数据字典，更可靠'],
      ]}
    />
    <Callout type="warning">
      新项目<Text bold>建议直接用 MySQL 8.x</Text>（默认{' '}
      <InlineCode>utf8mb4</InlineCode>省去大量中文乱码烦恼，特性也更全）。
    </Callout>
    <Callout type="danger">
      升到 8.x 后，老的客户端工具或旧版 JDBC 驱动可能因为默认认证插件变成{' '}
      <InlineCode>caching_sha2_password</InlineCode> 而<Text bold>连不上数据库</Text>
      。解决办法是升级驱动，或把用户的认证方式改回{' '}
      <InlineCode>mysql_native_password</InlineCode>。这个坑后面安装/JDBC
      章节会再遇到，先有印象。
    </Callout>

    <Heading3>9.4 MySQL 的核心特点</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>开源免费</Text>：社区版免费，学习、创业零成本。
      </ListItem>
      <ListItem>
        <Text bold>轻量、安装简单、上手快</Text>：相比 Oracle，部署和维护门槛低很多。
      </ListItem>
      <ListItem>
        <Text bold>性能好、够稳定</Text>：完全能扛住绝大多数互联网业务的并发量。
      </ListItem>
      <ListItem>
        <Text bold>跨平台</Text>：Windows、Linux、macOS 都能跑。
      </ListItem>
      <ListItem>
        <Text bold>生态成熟、资料海量</Text>：用的人多，遇到问题几乎都能搜到答案；和
        Java、PHP、Python 等语言的整合都非常成熟。
      </ListItem>
      <ListItem>
        <Text bold>支持标准 SQL</Text>：学会它，迁移到别的关系型数据库也很容易。
      </ListItem>
    </UnorderedList>

    <Heading3>9.5 为什么 Java 学习首选 MySQL？</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>免费开源</Text>：学习不花钱，环境随便装、随便折腾。
      </ListItem>
      <ListItem>
        <Text bold>就业刚需</Text>：国内绝大多数 Java 岗位、互联网公司都在用
        MySQL，会它=有饭吃。
      </ListItem>
      <ListItem>
        <Text bold>轻量易学</Text>：对新手友好，不会被复杂的安装和运维劝退，能把精力放在“学
        SQL 本身”。
      </ListItem>
      <ListItem>
        <Text bold>与 Java 生态无缝衔接</Text>：JDBC、MyBatis、Spring Data JPA 等都把
        MySQL 当作头号支持对象，学完 SQL 就能顺畅接入 Java 项目（本套教程后面会有 JDBC
        实战）。
      </ListItem>
      <ListItem>
        <Text bold>学一通百</Text>：MySQL 用的是标准 SQL，掌握后再学 Oracle、PostgreSQL
        等事半功倍。
      </ListItem>
    </OrderedList>
    <Callout type="success" title="结论">
      对 Java 开发者来说，
      <Text bold>MySQL 是性价比最高的数据库入门选择</Text>
      ——免费、好学、岗位需求大、和 Java 配合好。这也是本套教程选它的原因。
    </Callout>
  </article>
);

export default index;
