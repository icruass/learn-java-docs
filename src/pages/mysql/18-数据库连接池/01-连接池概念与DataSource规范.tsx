import React from 'react';
import {
  Title,
  Subtitle,
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
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>连接池概念与 DataSource 规范</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        第 16 章里，我们每次操作数据库都 <InlineCode>DriverManager.getConnection(...)</InlineCode> 现连一个，用完{' '}
        <InlineCode>close()</InlineCode> 关掉。这在练习里没问题，但
        <Text bold>在真实高并发系统里是性能灾难</Text>
        ：建立一个数据库连接要经过 TCP 握手、身份认证等一系列开销，频繁地「创建—用一下—销毁」极其浪费，并发一高连接数还会失控。
      </Paragraph>
      <Paragraph>
        解决办法是<Text bold>数据库连接池（Connection Pool）</Text>
        ：预先创建好一批连接放进「池子」里，谁要用就<Text bold>借</Text>一个，用完
        <Text bold>还</Text>回去，反复复用。本章讲透：
      </Paragraph>
      <OrderedList>
        <ListItem>
          连接池解决什么问题、<InlineCode>DataSource</InlineCode>{' '}
          规范、「池化连接的 close 不是真关闭而是归还」这个关键认知；
        </ListItem>
        <ListItem>主流连接池产品；</ListItem>
        <ListItem>
          <Text bold>C3P0</Text> 的使用与 XML 配置；
        </ListItem>
        <ListItem>
          <Text bold>Druid</Text>（阿里出品，国内最常用）的使用、properties 配置，以及封装成工具类。
        </ListItem>
      </OrderedList>
      <Paragraph>
        本章是对第 16 章 JDBC 的工程化升级，沿用 <InlineCode>db_learn</InlineCode> 的{' '}
        <InlineCode>user</InlineCode> 表。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、为什么需要连接池</Subtitle>

    <Heading3>1.1 不用连接池的痛</Heading3>
    <CodeBlock
      language="java"
      code={`// 每来一个请求就这么干一次
Connection conn = DriverManager.getConnection(url, user, pwd);  // 创建：慢、重
// ... 执行一条 SQL（可能就几毫秒）...
conn.close();                                                   // 销毁：又把连接丢了`}
    />
    <Paragraph>问题：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>创建连接开销大</Text>：每次都要握手、认证、分配资源，耗时远超 SQL 本身；
      </ListItem>
      <ListItem>
        <Text bold>并发失控</Text>：1000 个请求同时来，就瞬间创建 1000 个连接，数据库被压垮；
      </ListItem>
      <ListItem>
        <Text bold>资源浪费</Text>：连接用几毫秒就扔，下一个请求又从头建。
      </ListItem>
    </UnorderedList>

    <Heading3>1.2 连接池的思路：借与还</Heading3>
    <Paragraph>
      连接池是一个<Text bold>装着若干现成连接的容器</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`        ┌──────── 连接池 ────────┐
请求A ──借──>  [conn1] [conn2] [conn3] ... ──还──> 归还后供下一个请求复用
        └────────────────────────┘`}
    />
    <UnorderedList>
      <ListItem>
        程序启动时，池子<Text bold>预先创建</Text>好一批连接（如 5 个）；
      </ListItem>
      <ListItem>
        谁要用就<Text bold>借</Text>一个（不用现建，极快）；
      </ListItem>
      <ListItem>
        用完 <Text bold>归还</Text> 到池子（不是真关闭），给下一个人接着用；
      </ListItem>
      <ListItem>
        池子还能<Text bold>限制最大连接数</Text>，并发再高也不会无限创建，保护数据库。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      <Text bold>核心收益</Text>：连接复用 → 省去反复创建销毁的开销；数量受控 →
      保护数据库。这是所有生产级 Java 应用的标配。
    </Callout>

    <Divider />

    <Subtitle>二、DataSource 规范</Subtitle>
    <Paragraph>
      和 JDBC 一样，Java 为连接池也定义了<Text bold>统一接口</Text>：
      <InlineCode>javax.sql.DataSource</InlineCode>。各连接池产品（C3P0、Druid…）都实现它。
    </Paragraph>
    <Paragraph>核心方法只有一个：</Paragraph>
    <CodeBlock
      language="java"
      code={`Connection getConnection();   // 从池中获取一个连接`}
    />
    <Callout type="warning">
      <Paragraph>
        <Text bold>最重要的认知</Text>：从连接池拿到的 <InlineCode>Connection</InlineCode>
        ，调用它的 <InlineCode>close()</InlineCode>{' '}
        <Text bold>不是真正关闭连接，而是把连接「归还」给池子</Text>！
      </Paragraph>
      <Paragraph>
        这是连接池的「障眼法」——它返回的是一个<Text bold>包装过的 Connection</Text>
        ，重写了 <InlineCode>close()</InlineCode> 方法。所以你的业务代码
        <Text bold>完全不用改写</Text>，照样 <InlineCode>conn.close()</InlineCode>
        ，只是行为从「关闭」变成了「归还」。这正是面向接口编程的威力：换成连接池，JDBC
        业务代码几乎零改动。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>三、主流连接池产品</Subtitle>
    <Table
      head={['产品', '出品', '特点']}
      rows={[
        ['DBCP', 'Apache', '较早期，Tomcat 自带'],
        ['C3P0', '开源', '经典稳定，Hibernate 常用，配置用 XML'],
        ['Druid', '阿里巴巴', '国产，功能强大（监控、防注入），国内最流行'],
        ['HikariCP', '开源', '性能极致，Spring Boot 默认'],
      ]}
    />
    <Paragraph>
      本章重点讲教学最常用的 <Text bold>C3P0</Text> 和实战最常用的 <Text bold>Druid</Text>。
    </Paragraph>
  </article>
);

export default index;
