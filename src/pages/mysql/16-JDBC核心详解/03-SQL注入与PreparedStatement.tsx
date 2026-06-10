import React from 'react';
import {
  Title,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>SQL 注入与 PreparedStatement</Title>

    <Heading3>6.1 用 Statement 拼字符串的致命漏洞</Heading3>
    <Paragraph>
      设想一个登录功能，用 <InlineCode>Statement</InlineCode> 把用户输入拼进 SQL：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`String name = "随便填";
String pwd  = "a' OR '1'='1";    // ← 恶意输入
String sql = "SELECT * FROM user WHERE username='" + name
           + "' AND password='" + pwd + "'";
// 拼出来的 SQL 变成：
// SELECT * FROM user WHERE username='随便填' AND password='a' OR '1'='1'`}
    />
    <Paragraph>
      <InlineCode>OR '1'='1'</InlineCode> 恒为真，
      <Text bold>不需要正确密码就能登录成功</Text>！这就是臭名昭著的{' '}
      <Text bold>SQL 注入</Text>——用户输入「篡改」了 SQL 的逻辑。
    </Paragraph>

    <Heading3>6.2 解决方案：PreparedStatement 预编译</Heading3>
    <Paragraph>
      <InlineCode>PreparedStatement</InlineCode> 用 <InlineCode>?</InlineCode>{' '}
      作占位符，把 SQL 的「结构」和「数据」分开：SQL 先发给数据库
      <Text bold>预编译</Text>好结构，用户输入只作为「纯数据」填进{' '}
      <InlineCode>?</InlineCode>，<Text bold>永远不会被当成 SQL 语法执行</Text>。
    </Paragraph>
    <CodeBlock
      language="java"
      code={`// SQL 用 ? 占位，结构固定
String sql = "SELECT * FROM user WHERE username = ? AND password = ?";
PreparedStatement ps = conn.prepareStatement(sql);

// 给占位符赋值（索引从 1 开始）
ps.setString(1, name);   // 第1个? = name
ps.setString(2, pwd);    // 第2个? = pwd（哪怕是 a' OR '1'='1 也只当普通字符串）

ResultSet rs = ps.executeQuery();   // 注意：这里不再传 sql 参数`}
    />
    <Paragraph>
      此时 <InlineCode>a' OR '1'='1</InlineCode>{' '}
      会被整体当成一个密码字符串去比对，匹配不上 → 登录失败，注入被防住。
    </Paragraph>
    <Callout type="tip">
      <Paragraph>
        <Text bold>PreparedStatement 的两大好处</Text>：
      </Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>防 SQL 注入</Text>（安全）；
        </ListItem>
        <ListItem>
          <Text bold>预编译可复用</Text>，同结构 SQL 多次执行时性能更好。
        </ListItem>
      </OrderedList>
    </Callout>
    <Callout type="success">
      <Text bold>
        实际开发中一律使用 <InlineCode>PreparedStatement</InlineCode>，基本不用{' '}
        <InlineCode>Statement</InlineCode>。
      </Text>
    </Callout>

    <Heading3>6.3 PreparedStatement 的增删改</Heading3>
    <CodeBlock
      language="java"
      code={`String sql = "INSERT INTO user (username, password) VALUES (?, ?)";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, "zhaoliu");
ps.setString(2, "111");
int count = ps.executeUpdate();        // 同样用 executeUpdate，但不传 sql
System.out.println(count > 0 ? "成功" : "失败");`}
    />

    <Divider />
  </article>
);

export default index;
