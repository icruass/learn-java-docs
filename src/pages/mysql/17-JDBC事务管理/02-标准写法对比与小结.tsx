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
    <Title>标准写法、对比验证与本章小结</Title>

    <Subtitle>三、标准写法：try-catch-finally</Subtitle>
    <Paragraph>事务管理的标准骨架如下：</Paragraph>
    <CodeBlock
      language="java"
      code={`import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TransferDemo {
    public void transfer() {
        Connection conn = null;
        PreparedStatement ps1 = null;
        PreparedStatement ps2 = null;
        try {
            conn = JDBCUtils.getConnection();

            // ★ 开启事务：关闭自动提交
            conn.setAutoCommit(false);

            // 第一条：张三扣钱
            ps1 = conn.prepareStatement(
                    "UPDATE account SET money = money - ? WHERE name = ?");
            ps1.setDouble(1, 500);
            ps1.setString(2, "张三");
            ps1.executeUpdate();

            // 故意制造异常，验证回滚（真实代码里这里是其它业务）
            // int x = 1 / 0;

            // 第二条：李四加钱
            ps2 = conn.prepareStatement(
                    "UPDATE account SET money = money + ? WHERE name = ?");
            ps2.setDouble(1, 500);
            ps2.setString(2, "李四");
            ps2.executeUpdate();

            // ★ 两条都成功 → 提交事务
            conn.commit();
            System.out.println("转账成功");

        } catch (Exception e) {
            // ★ 出现任何异常 → 回滚事务
            if (conn != null) {
                try {
                    conn.rollback();
                    System.out.println("出现异常，事务已回滚");
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            e.printStackTrace();
        } finally {
            // 释放资源
            JDBCUtils.close(ps1, conn);   // 简化：实际可分别关 ps1、ps2
            if (ps2 != null) try { ps2.close(); } catch (SQLException e) {}
        }
    }
}`}
    />
    <Paragraph>关键点解析：</Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>
          <InlineCode>setAutoCommit(false)</InlineCode> 必须在执行 SQL 之前
        </Text>
        调用，相当于 <InlineCode>START TRANSACTION</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>commit()</InlineCode> 放在 try 的最后
        </Text>
        ，只有所有 SQL 都顺利执行才会到这一步。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>rollback()</InlineCode> 放在 catch 里
        </Text>
        ，任何一条 SQL 抛异常都会跳到 catch 执行回滚。
      </ListItem>
      <ListItem>
        <Text bold>
          <InlineCode>rollback()</InlineCode> 本身也可能抛 <InlineCode>SQLException</InlineCode>
        </Text>
        ，所以要再套一层 try-catch。
      </ListItem>
      <ListItem>
        <Text bold>资源在 finally 释放</Text>，确保连接一定被归还。
      </ListItem>
    </OrderedList>
    <Callout type="tip">
      把上面注释掉的 <InlineCode>int x = 1 / 0;</InlineCode>{' '}
      放开，再跑一次：你会看到「事务已回滚」，且查询数据库{' '}
      <Text bold>张三、李四仍各 1000</Text>——钱没丢。这就是事务的保护作用。
    </Callout>

    <Divider />

    <Subtitle>四、对比验证：开不开事务的区别</Subtitle>
    <Table
      head={['场景', '第一条 UPDATE 后异常', '最终结果']}
      rows={[
        ['不开事务（自动提交）', '张三扣钱已自动提交', '张三 500、李四 1000，丢了 500 ❌'],
        ['开启事务', '异常触发 rollback()', '张三 1000、李四 1000，完好如初 ✅'],
      ]}
    />
    <Paragraph>这张表把「为什么需要 JDBC 事务」讲得明明白白。</Paragraph>

    <Divider />

    <Subtitle>五、注意事项与常见坑</Subtitle>
    <Callout type="danger">
      <Text bold>
        必须是同一个 Connection
      </Text>
      ：事务是绑定在 <InlineCode>Connection</InlineCode> 上的。如果第一条 SQL 用
      conn1、第二条用 conn2，它们是<Text bold>两个独立事务</Text>，回滚 conn1
      根本影响不到 conn2。务必让一组事务内的所有 SQL 共用同一个{' '}
      <InlineCode>Connection</InlineCode>。
    </Callout>
    <Callout type="danger">
      <Text bold>忘记 commit</Text>：开启事务（
      <InlineCode>setAutoCommit(false)</InlineCode>）后，如果忘了{' '}
      <InlineCode>commit()</InlineCode>，连接关闭时改动会被丢弃（相当于回滚），数据「没保存上」。
    </Callout>
    <Callout type="warning">
      <Text bold>rollback 要判空</Text>：<InlineCode>catch</InlineCode> 里{' '}
      <InlineCode>conn</InlineCode> 可能因为 <InlineCode>getConnection</InlineCode>{' '}
      就失败而为 <InlineCode>null</InlineCode>，调用{' '}
      <InlineCode>conn.rollback()</InlineCode> 前要判{' '}
      <InlineCode>conn != null</InlineCode>。
    </Callout>
    <Callout type="warning">
      <Text bold>连接池场景下恢复状态</Text>：用连接池时，<InlineCode>conn.close()</InlineCode>{' '}
      是把连接<Text bold>归还池</Text>而非真关闭。如果你{' '}
      <InlineCode>setAutoCommit(false)</InlineCode>{' '}
      后没恢复，下个借到这个连接的人会莫名处于手动提交状态。规范做法是归还前{' '}
      <InlineCode>conn.setAutoCommit(true)</InlineCode>{' '}
      恢复默认（很多连接池/框架会自动处理）。
    </Callout>
    <Callout type="tip">
      <Text bold>手动管理事务很啰嗦</Text>：上面一大段 try-catch-finally
      就为转两笔钱。这正是后续 Spring 的 <InlineCode>@Transactional</InlineCode>{' '}
      声明式事务、以及 JDBCTemplate 要解决的问题——把这些样板代码替你包办。
    </Callout>

    <Divider />

    <Subtitle>六、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>JDBC 默认每条 SQL 自动提交</Text>，多步操作无法保证原子性（转账会丢钱）。
      </ListItem>
      <ListItem>
        <Text bold>三个方法控制事务</Text>（绑定在 <InlineCode>Connection</InlineCode> 上）：
        <UnorderedList>
          <ListItem>
            <InlineCode>conn.setAutoCommit(false)</InlineCode> 开启事务；
          </ListItem>
          <ListItem>
            <InlineCode>conn.commit()</InlineCode> 提交；
          </ListItem>
          <ListItem>
            <InlineCode>conn.rollback()</InlineCode> 回滚。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>标准写法</Text>：try 中开启事务并执行多条 SQL、末尾{' '}
        <InlineCode>commit</InlineCode>；catch 中 <InlineCode>rollback</InlineCode>
        （注意判空和二次异常）；finally 释放资源。
      </ListItem>
      <ListItem>
        <Text bold>核心前提</Text>：同一组事务的所有 SQL{' '}
        <Text bold>必须共用同一个 Connection</Text>。
      </ListItem>
      <ListItem>
        <Text bold>演进方向</Text>：手动事务太繁琐，后续用 Spring 声明式事务（
        <InlineCode>@Transactional</InlineCode>）大幅简化。
      </ListItem>
    </UnorderedList>

    <Heading3>常见易错问答</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>
          问：<InlineCode>setAutoCommit(false)</InlineCode> 之后，每条 SQL 还会自动提交吗？
        </Text>
        <br />
        答：不会。从此刻起所有 SQL 都进入同一个事务，必须显式 <InlineCode>commit()</InlineCode>{' '}
        才生效，否则可 <InlineCode>rollback()</InlineCode> 撤销。
      </ListItem>
      <ListItem>
        <Text bold>问：为什么我回滚了数据还是变了？</Text>
        <br />
        答：八成是「不是同一个 Connection」，或者第一条 SQL 在{' '}
        <InlineCode>setAutoCommit(false)</InlineCode> 之前就执行（已自动提交）。
      </ListItem>
      <ListItem>
        <Text bold>问：commit/rollback 之后还能继续用这个 Connection 吗？</Text>
        <br />
        答：能。一次 <InlineCode>commit</InlineCode>/<InlineCode>rollback</InlineCode>{' '}
        结束当前事务，之后该连接可开启新事务或继续执行（取决于 autoCommit 设置）。
      </ListItem>
    </OrderedList>
  </article>
);

export default index;
