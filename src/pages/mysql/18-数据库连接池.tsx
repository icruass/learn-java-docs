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
    <Title>数据库连接池：概念、C3P0 与 Druid</Title>

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

    <Divider />

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

    <Divider />

    <Subtitle>六、封装 Druid 工具类 JDBCUtils</Subtitle>
    <Paragraph>
      实战中把连接池封装成工具类（升级版第 16 章的 JDBCUtils），全局只创建一个连接池：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`import com.alibaba.druid.pool.DruidDataSourceFactory;
import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.*;
import java.util.Properties;

public class JDBCUtils {
    private static DataSource ds;   // 连接池对象，全局唯一

    static {
        try {
            Properties pro = new Properties();
            InputStream is = JDBCUtils.class.getClassLoader()
                                .getResourceAsStream("druid.properties");
            pro.load(is);
            ds = DruidDataSourceFactory.createDataSource(pro);   // 只创建一次
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /** 从连接池获取连接 */
    public static Connection getConnection() throws SQLException {
        return ds.getConnection();
    }

    /** 把连接池对象暴露出去（JDBCTemplate 等会用到，见第19章） */
    public static DataSource getDataSource() {
        return ds;
    }

    /** 释放资源（查询，关 3 个；close 实为归还） */
    public static void close(ResultSet rs, Statement stmt, Connection conn) {
        if (rs != null)   try { rs.close(); }   catch (SQLException e) { e.printStackTrace(); }
        if (stmt != null) try { stmt.close(); } catch (SQLException e) { e.printStackTrace(); }
        if (conn != null) try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
    }

    /** 释放资源（增删改，关 2 个）—— 重载 */
    public static void close(Statement stmt, Connection conn) {
        close(null, stmt, conn);
    }
}`}
    />

    <Heading3>6.1 测试工具类</Heading3>
    <CodeBlock
      language="java"
      code={`public class TestJDBCUtils {
    public static void main(String[] args) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = JDBCUtils.getConnection();       // 从池里借
            ps = conn.prepareStatement("SELECT * FROM user");
            rs = ps.executeQuery();
            while (rs.next()) {
                System.out.println(rs.getInt("id") + " - " + rs.getString("username"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            JDBCUtils.close(rs, ps, conn);          // 归还回池
        }
    }
}`}
    />
    <Callout type="tip">
      注意 <InlineCode>getDataSource()</InlineCode> 方法——第 19 章的 JDBCTemplate
      需要直接拿到 <InlineCode>DataSource</InlineCode> 对象，这里提前留好接口，
      <Text bold>环环相扣</Text>。
    </Callout>

    <Divider />

    <Subtitle>七、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>为什么用连接池</Text>
        ：避免频繁创建/销毁连接的巨大开销，复用连接、限制最大数量、保护数据库。
      </ListItem>
      <ListItem>
        <Text bold>DataSource 规范</Text>：<InlineCode>javax.sql.DataSource</InlineCode>{' '}
        是连接池统一接口，核心方法 <InlineCode>getConnection()</InlineCode>；
        <Text bold>
          池化连接的 <InlineCode>close()</InlineCode> 是「归还」而非「真关闭」
        </Text>
        ，业务代码无需改动。
      </ListItem>
      <ListItem>
        <Text bold>主流产品</Text>：C3P0（XML 配置）、Druid（阿里，最常用）、HikariCP（Spring
        Boot 默认）。
      </ListItem>
      <ListItem>
        <Text bold>C3P0</Text>：放 <InlineCode>c3p0-config.xml</InlineCode> 到
        src（框架自动找），<InlineCode>new ComboPooledDataSource()</InlineCode> 创建；键名{' '}
        <InlineCode>driverClass</InlineCode>/<InlineCode>jdbcUrl</InlineCode>/
        <InlineCode>user</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>Druid</Text>：自定义 <InlineCode>druid.properties</InlineCode>，手动{' '}
        <InlineCode>load</InlineCode> 后用{' '}
        <InlineCode>DruidDataSourceFactory.createDataSource(pro)</InlineCode> 创建；键名{' '}
        <InlineCode>driverClassName</InlineCode>/<InlineCode>url</InlineCode>/
        <InlineCode>username</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>工具类</Text>：用静态块只创建一次连接池，提供{' '}
        <InlineCode>getConnection()</InlineCode>、<InlineCode>getDataSource()</InlineCode>
        、重载的 <InlineCode>close()</InlineCode>。
      </ListItem>
    </UnorderedList>

    <Heading3>常见易错问答</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>问：<InlineCode>conn.close()</InlineCode> 会把池里的连接关掉吗？</Text>
        <Paragraph>
          答：不会。连接池返回的是包装连接，<InlineCode>close()</InlineCode>{' '}
          被重写为「归还到池」，连接还在池里供复用。
        </Paragraph>
      </ListItem>
      <ListItem>
        <Text bold>问：C3P0 和 Druid 配置文件键名为什么不一样？</Text>
        <Paragraph>
          答：它们是不同产品，键名各自定义。C3P0：
          <InlineCode>driverClass/jdbcUrl/user</InlineCode>；Druid：
          <InlineCode>driverClassName/url/username</InlineCode>。务必对应。
        </Paragraph>
      </ListItem>
      <ListItem>
        <Text bold>问：连接池要在每次请求时创建吗？</Text>
        <Paragraph>
          答：绝对不要！连接池本身只应<Text bold>创建一次</Text>
          （放静态块/单例），它内部管理多个连接。每次请求只是从池里{' '}
          <InlineCode>getConnection()</InlineCode> 借一个。
        </Paragraph>
      </ListItem>
    </OrderedList>
  </article>
);

export default index;
