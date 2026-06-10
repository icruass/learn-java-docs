import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>Druid 工具类封装与本章小结</Title>

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
