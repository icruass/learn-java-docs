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
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>C3P0 与 Druid 使用</Title>

    <Subtitle>四、C3P0 的使用</Subtitle>

    <Heading3>4.1 准备工作</Heading3>
    <OrderedList>
      <ListItem>
        导入两个 jar：<InlineCode>c3p0-x.x.x.jar</InlineCode>、
        <InlineCode>mchange-commons-java-x.x.x.jar</InlineCode>，外加 MySQL 驱动 jar；
      </ListItem>
      <ListItem>
        在 <Text bold>src 根目录</Text>下放配置文件，名字<Text bold>必须</Text>叫{' '}
        <InlineCode>c3p0-config.xml</InlineCode>（框架自动按这个名字找）。
      </ListItem>
    </OrderedList>

    <Heading3>4.2 c3p0-config.xml 配置</Heading3>
    <CodeBlock
      language="xml"
      code={`<?xml version="1.0" encoding="UTF-8"?>
<c3p0-config>
    <!-- 默认配置：new ComboPooledDataSource() 不传参时用这个 -->
    <default-config>
        <property name="driverClass">com.mysql.cj.jdbc.Driver</property>
        <property name="jdbcUrl">jdbc:mysql://localhost:3306/db_learn?useSSL=false&amp;serverTimezone=UTC</property>
        <property name="user">root</property>
        <property name="password">your_password</property>

        <!-- 连接池参数 -->
        <property name="initialPoolSize">5</property>   <!-- 初始连接数 -->
        <property name="maxPoolSize">10</property>      <!-- 最大连接数 -->
        <property name="checkoutTimeout">3000</property><!-- 借连接的超时(毫秒) -->
    </default-config>

    <!-- 命名配置：new ComboPooledDataSource("otherc3p0") 时用这个 -->
    <named-config name="otherc3p0">
        <property name="driverClass">com.mysql.cj.jdbc.Driver</property>
        <property name="jdbcUrl">jdbc:mysql://localhost:3306/db_test?serverTimezone=UTC</property>
        <property name="user">root</property>
        <property name="password">your_password</property>
        <property name="maxPoolSize">8</property>
    </named-config>
</c3p0-config>`}
    />
    <Callout type="warning">
      XML 里 URL 的 <InlineCode>&amp;</InlineCode> 必须写成实体{' '}
      <InlineCode>&amp;amp;</InlineCode>，否则 XML 解析报错。
    </Callout>

    <Heading3>4.3 使用 C3P0</Heading3>
    <CodeBlock
      language="java"
      code={`import com.mchange.v2.c3p0.ComboPooledDataSource;
import javax.sql.DataSource;
import java.sql.Connection;

public class C3P0Demo {
    public static void main(String[] args) throws Exception {
        // 创建连接池对象（自动读取 c3p0-config.xml 的 default-config）
        DataSource ds = new ComboPooledDataSource();
        // 若用命名配置：new ComboPooledDataSource("otherc3p0");

        // 从池中借连接
        Connection conn = ds.getConnection();
        System.out.println(conn);

        // ... 正常用 conn 执行 SQL（和第16章一样）...

        conn.close();   // 归还给池子，不是真关闭
    }
}`}
    />

    <Heading3>4.4 核心配置项含义</Heading3>
    <Table
      head={['配置项', '含义']}
      rows={[
        ['driverClass', '驱动类名'],
        ['jdbcUrl', '连接 URL'],
        ['user / password', '账号密码'],
        ['initialPoolSize', '池启动时初始化的连接数'],
        ['maxPoolSize', '池中最大连接数'],
        ['checkoutTimeout', '借不到连接时等待多久就超时(毫秒)'],
      ]}
    />

    <Divider />

    <Subtitle>五、Druid 的使用（重点）</Subtitle>
    <Paragraph>
      Druid 是阿里开源的连接池，功能强、有监控、能防 SQL 注入，国内项目用得最多。
    </Paragraph>

    <Heading3>5.1 准备工作</Heading3>
    <OrderedList>
      <ListItem>
        导入 <InlineCode>druid-x.x.x.jar</InlineCode> 和 MySQL 驱动 jar；
      </ListItem>
      <ListItem>
        在 src 下放配置文件 <InlineCode>druid.properties</InlineCode>（
        <Text bold>名字可自定义，需手动加载</Text>，这点和 C3P0 不同）。
      </ListItem>
    </OrderedList>

    <Heading3>5.2 druid.properties 配置</Heading3>
    <CodeBlock
      language="properties"
      code={`# 注意 Druid 的键名和 C3P0 不一样！
driverClassName=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/db_learn?useSSL=false&serverTimezone=UTC
username=root
password=your_password

# 连接池参数
initialSize=5          # 初始连接数
maxActive=10           # 最大连接数
maxWait=3000           # 获取连接最大等待时间(毫秒)`}
    />
    <Callout type="warning">
      Druid 的键名是 <InlineCode>driverClassName</InlineCode> /{' '}
      <InlineCode>url</InlineCode> / <InlineCode>username</InlineCode> /{' '}
      <InlineCode>password</InlineCode>，和 C3P0 的 <InlineCode>driverClass</InlineCode> /{' '}
      <InlineCode>jdbcUrl</InlineCode> / <InlineCode>user</InlineCode> 不同，别记混了。
    </Callout>

    <Heading3>5.3 使用 Druid</Heading3>
    <CodeBlock
      language="java"
      code={`import com.alibaba.druid.pool.DruidDataSourceFactory;
import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Properties;

public class DruidDemo {
    public static void main(String[] args) throws Exception {
        // 1. 加载 properties 配置文件
        Properties pro = new Properties();
        InputStream is = DruidDemo.class.getClassLoader()
                            .getResourceAsStream("druid.properties");
        pro.load(is);

        // 2. 用工厂根据配置创建连接池对象
        DataSource ds = DruidDataSourceFactory.createDataSource(pro);

        // 3. 借连接
        Connection conn = ds.getConnection();
        System.out.println(conn);

        // ... 执行 SQL ...

        conn.close();   // 归还
    }
}`}
    />
    <Callout type="tip">
      与 C3P0 的区别：Druid 需要<Text bold>自己加载 properties 并交给{' '}
      <InlineCode>DruidDataSourceFactory.createDataSource()</InlineCode></Text>；C3P0
      是自动找 <InlineCode>c3p0-config.xml</InlineCode>。
    </Callout>
  </article>
);

export default index;
