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
    <Title>并发问题、隔离级别与本章小结</Title>

    <Subtitle>五、并发事务带来的三大问题</Subtitle>
    <Paragraph>
      当多个事务<Text bold>同时</Text>
      操作同一份数据时，如果隔离做得不好，会出现三类经典问题。理解它们是理解隔离级别的前提。
    </Paragraph>
    <Paragraph>假设有事务 A、事务 B 同时运行：</Paragraph>

    <Heading3>5.1 脏读（Dirty Read）</Heading3>
    <Callout type="note">
      <Text bold>一个事务读到了另一个事务「还没提交」的数据。</Text>
    </Callout>
    <CodeBlock
      language="text"
      code={`事务B：UPDATE account SET money=money-500 WHERE name='张三';  -- 改了但没提交
事务A：SELECT money FROM account WHERE name='张三';            -- 读到 500（脏数据！）
事务B：ROLLBACK;                                               -- B 回滚了，张三其实还是1000
-- 事务A 拿着一个"根本不存在"的500去做决策，错了`}
    />
    <Paragraph>危害最大——读到的可能是会被撤销的「幻象数据」。</Paragraph>

    <Heading3>5.2 不可重复读（Non-Repeatable Read）</Heading3>
    <Callout type="note">
      <Text bold>同一个事务内，两次读同一行，结果却不一样</Text>（因为中间别的事务
      <Text bold>改并提交</Text>了）。
    </Callout>
    <CodeBlock
      language="text"
      code={`事务A：SELECT money FROM account WHERE name='张三';  -- 读到 1000
事务B：UPDATE account SET money=2000 WHERE name='张三'; COMMIT;
事务A：SELECT money FROM account WHERE name='张三';  -- 又读，变成 2000 了！
-- 同一事务里两次读不一致，针对的是"行内容被 UPDATE"`}
    />

    <Heading3>5.3 幻读（Phantom Read）</Heading3>
    <Callout type="note">
      <Text bold>同一个事务内，两次按同一条件查询，行数却变了</Text>（因为别的事务
      <Text bold>插入/删除</Text>并提交了）。
    </Callout>
    <CodeBlock
      language="text"
      code={`事务A：SELECT COUNT(*) FROM account WHERE money>500;  -- 读到 2 行
事务B：INSERT INTO account VALUES (3,'王五',8000); COMMIT;
事务A：SELECT COUNT(*) FROM account WHERE money>500;  -- 变成 3 行，多出一条"幻影"
-- 针对的是"行数被 INSERT/DELETE"`}
    />
    <Callout type="tip">
      <Text bold>三者区别一句话</Text>：
      <UnorderedList>
        <ListItem>
          脏读 = 读到<Text bold>未提交</Text>的改动；
        </ListItem>
        <ListItem>
          不可重复读 = 读到<Text bold>已提交的 UPDATE</Text>（同一行内容变了）；
        </ListItem>
        <ListItem>
          幻读 = 读到<Text bold>已提交的 INSERT/DELETE</Text>（行数变了）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>六、四种隔离级别</Subtitle>
    <Paragraph>
      为了在「数据安全」和「并发性能」之间取舍，SQL 标准定义了<Text bold>四种隔离级别</Text>
      ，级别越高越安全但越慢。
    </Paragraph>
    <Table
      head={['级别', '名称', '脏读', '不可重复读', '幻读', '性能']}
      rows={[
        ['1', '读未提交 READ UNCOMMITTED', '❌会发生', '❌会', '❌会', '最快'],
        ['2', '读已提交 READ COMMITTED', '✅避免', '❌会', '❌会', '较快（Oracle默认）'],
        ['3', '可重复读 REPEATABLE READ', '✅避免', '✅避免', '⚠️理论会(MySQL靠MVCC基本避免)', '中（MySQL默认）'],
        ['4', '串行化 SERIALIZABLE', '✅避免', '✅避免', '✅避免', '最慢（事务排队执行）'],
      ]}
    />
    <UnorderedList>
      <ListItem>
        <Text bold>级别越高，越能防住更多问题，但并发性能越差。</Text>
      </ListItem>
      <ListItem>
        <Text bold>MySQL（InnoDB）默认是「可重复读 REPEATABLE READ」</Text>，且通过 MVCC
        机制在很大程度上连幻读也避免了，是兼顾安全与性能的折中。
      </ListItem>
      <ListItem>
        <Text bold>Oracle 默认是「读已提交 READ COMMITTED」</Text>。
      </ListItem>
    </UnorderedList>

    <Heading3>6.1 查看与设置隔离级别</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 查看当前隔离级别（MySQL 8）
SELECT @@transaction_isolation;       -- MySQL 5.x 用 @@tx_isolation

-- 设置隔离级别（SESSION 当前会话 / GLOBAL 全局）
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET GLOBAL  TRANSACTION ISOLATION LEVEL REPEATABLE READ;`}
    />

    <Divider />

    <Subtitle>七、隔离级别实操演示（两个会话）</Subtitle>
    <Paragraph>
      要演示并发，需要<Text bold>开两个 mysql 客户端窗口</Text>（或 SQLyog
      两个查询标签），分别模拟事务 A 和事务 B。
    </Paragraph>

    <Heading3>7.1 演示一：在「读未提交」下复现脏读</Heading3>
    <CodeBlock
      language="sql"
      code={`-- ① 两个窗口都先设为读未提交
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;`}
    />
    <CodeBlock
      language="sql"
      code={`-- ② 窗口B（转账方）：开启事务，扣钱但先不提交
START TRANSACTION;
UPDATE account SET money = money - 500 WHERE name = '张三';
-- 暂停，不要 COMMIT`}
    />
    <CodeBlock
      language="sql"
      code={`-- ③ 窗口A（查询方）：开启事务去查
START TRANSACTION;
SELECT money FROM account WHERE name = '张三';   -- 竟然读到了 500（脏读！B还没提交）`}
    />
    <CodeBlock
      language="sql"
      code={`-- ④ 窗口B：回滚
ROLLBACK;     -- 张三其实仍是 1000，但窗口A刚才读到的500是假的 → 脏读发生`}
    />

    <Heading3>7.2 演示二：升到「读已提交」，脏读消失</Heading3>
    <CodeBlock
      language="sql"
      code={`-- ① 两窗口都改为读已提交
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`}
    />
    <Paragraph>
      重复上面 ②③ 的步骤：这次窗口 A 的查询<Text bold>只会读到 1000</Text>（B
      未提交的改动看不到），脏读被解决。但如果 B 提交后 A
      再查，会读到新值——这就暴露了「不可重复读」，需要再升到{' '}
      <InlineCode>REPEATABLE READ</InlineCode> 才能避免。
    </Paragraph>
    <Callout type="tip">
      <Text bold>演示的规律</Text>：把隔离级别从低往高调，能逐个观察到「脏读消失 →
      不可重复读消失 → 幻读消失」的过程，亲手跑一遍比背表深刻得多。
    </Callout>

    <Divider />

    <Subtitle>八、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>事务</Text>：把多条 SQL 打包成「要么全成功、要么全失败」的整体，靠{' '}
        <InlineCode>COMMIT</InlineCode>（提交）/<InlineCode>ROLLBACK</InlineCode>
        （回滚）控制。
      </ListItem>
      <ListItem>
        <Text bold>开启方式</Text>：<InlineCode>START TRANSACTION;</InlineCode> …{' '}
        <InlineCode>COMMIT;</InlineCode>/<InlineCode>ROLLBACK;</InlineCode>；MySQL 默认{' '}
        <Text bold>自动提交</Text>（<InlineCode>autocommit=1</InlineCode>），可{' '}
        <InlineCode>SET autocommit=0</InlineCode> 改手动。
      </ListItem>
      <ListItem>
        <Text bold>ACID</Text>
        ：原子性（不可分割）、一致性（数据合法）、隔离性（并发不干扰）、持久性（提交永久）。
      </ListItem>
      <ListItem>
        <Text bold>并发三问题</Text>：脏读（读未提交）、不可重复读（读到已提交的
        UPDATE）、幻读（读到已提交的 INSERT/DELETE）。
      </ListItem>
      <ListItem>
        <Text bold>四隔离级别</Text>（由低到高）：读未提交 &lt; 读已提交 &lt;{' '}
        <Text bold>可重复读（MySQL 默认）</Text> &lt; 串行化；级别越高越安全越慢。
      </ListItem>
      <ListItem>
        <Text bold>查看/设置</Text>：<InlineCode>SELECT @@transaction_isolation;</InlineCode>
        、<InlineCode>SET SESSION TRANSACTION ISOLATION LEVEL ...</InlineCode>。
      </ListItem>
    </UnorderedList>

    <Heading3>常见易错问答</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>问：MySQL 默认隔离级别是什么？能防幻读吗？</Text>
        <Paragraph>
          答：默认 <Text bold>REPEATABLE READ（可重复读）</Text>
          。理论上该级别允许幻读，但 InnoDB 借助 MVCC + 间隙锁在绝大多数场景下也避免了幻读。
        </Paragraph>
      </ListItem>
      <ListItem>
        <Text bold>问：DDL 能回滚吗？</Text>
        <Paragraph>
          答：不能。<InlineCode>CREATE/ALTER/DROP</InlineCode> 在 MySQL
          中会隐式提交，事务回滚只对 DML 有效。
        </Paragraph>
      </ListItem>
      <ListItem>
        <Text bold>问：为什么不直接都用最高的 SERIALIZABLE？</Text>
        <Paragraph>
          答：串行化让事务排队执行，并发性能极差。实际是按业务对一致性的要求，选最低够用的级别。
        </Paragraph>
      </ListItem>
    </OrderedList>
  </article>
);

export default index;
