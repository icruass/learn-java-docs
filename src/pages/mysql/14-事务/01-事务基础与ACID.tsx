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
    <Title>事务基础与 ACID 特性</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        到目前为止，我们执行的每条 SQL 都是「单打独斗」的。但真实业务里，一件事往往要
        <Text bold>好几条 SQL 一起完成才算数</Text>
        ：转账要「A 账户减钱」+「B 账户加钱」两步；下单要「插入订单」+「扣减库存」+「生成支付单」三步。这些步骤必须
        <Text bold>要么全部成功，要么全部失败</Text>——绝不能钱扣了却没到账。
      </Paragraph>
      <Paragraph>
        保证这种「打包执行、共进退」的机制，就是<Text bold>事务（Transaction）</Text>。本章讲透：
      </Paragraph>
      <OrderedList>
        <ListItem>
          事务是什么，用转账例子直观感受 <InlineCode>COMMIT</InlineCode> /{' '}
          <InlineCode>ROLLBACK</InlineCode>；
        </ListItem>
        <ListItem>MySQL 的自动提交与手动提交；</ListItem>
        <ListItem>
          事务的四大特性 <Text bold>ACID</Text>；
        </ListItem>
        <ListItem>多个事务并发时会出的三类问题（脏读、不可重复读、幻读）；</ListItem>
        <ListItem>
          四种<Text bold>隔离级别</Text>如何分别防住这些问题，并用两个会话实际演示。
        </ListItem>
      </OrderedList>
      <Paragraph>
        事务是 MySQL 和后端面试的<Text bold>绝对核心</Text>，也是第 17 章「JDBC
        事务管理」的理论基础。本章沿用 <InlineCode>db_learn</InlineCode>，新建一张账户表演示。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>〇、准备示例数据</Subtitle>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE account (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  name  VARCHAR(20),
  money DOUBLE              -- 余额
);
INSERT INTO account (name, money) VALUES ('张三', 1000), ('李四', 1000);`}
    />

    <Divider />

    <Subtitle>一、事务是什么——从一次转账说起</Subtitle>
    <Paragraph>
      <Text bold>需求</Text>：张三给李四转账 500 元。在数据库里就是两条 SQL：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`UPDATE account SET money = money - 500 WHERE name = '张三';   -- 张三 -500
UPDATE account SET money = money + 500 WHERE name = '李四';   -- 李四 +500`}
    />
    <Paragraph>
      正常情况两条都成功，没问题。但
      <Text bold>如果第一条执行完，服务器突然宕机/断电，第二条没执行</Text>呢？结果就是：
      <Text bold>张三少了 500，李四却没收到——凭空蒸发了 500 元！</Text>
    </Paragraph>
    <Paragraph>
      事务就是来解决这个问题的：把这两条 SQL <Text bold>打包成一个不可分割的整体</Text>
      。要么两条都生效，要么一条都不生效，绝不允许「只成功一半」。
    </Paragraph>

    <Divider />

    <Subtitle>二、事务的基本操作：开启、提交、回滚</Subtitle>
    <Table
      head={['操作', '语句', '含义']}
      rows={[
        ['开启事务', 'START TRANSACTION; 或 BEGIN;', '从此刻起的 SQL 进入「临时缓冲」，未真正写入'],
        ['提交事务', 'COMMIT;', '确认无误，把所有改动永久写入数据库'],
        ['回滚事务', 'ROLLBACK;', '出错了，撤销本次事务的所有改动，回到开启前'],
      ]}
    />

    <Heading3>2.1 成功提交的演示</Heading3>
    <CodeBlock
      language="sql"
      code={`START TRANSACTION;                                            -- 开启事务
UPDATE account SET money = money - 500 WHERE name = '张三';
UPDATE account SET money = money + 500 WHERE name = '李四';
COMMIT;                                                        -- 两条都OK，提交
-- 结果：张三 500，李四 1500，永久生效`}
    />

    <Heading3>2.2 出错回滚的演示</Heading3>
    <CodeBlock
      language="sql"
      code={`START TRANSACTION;
UPDATE account SET money = money - 500 WHERE name = '张三';
-- 假设此时发现李四账户异常，或第二条 SQL 出错了
ROLLBACK;                                                      -- 撤销！
-- 结果：张三仍然 1000，李四仍然 1000，就像什么都没发生过`}
    />
    <Callout type="tip">
      <Text bold>回滚的威力</Text>：哪怕你已经执行了 <InlineCode>UPDATE</InlineCode>、
      <InlineCode>DELETE</InlineCode>、<InlineCode>INSERT</InlineCode>，只要还没{' '}
      <InlineCode>COMMIT</InlineCode>，一句 <InlineCode>ROLLBACK</InlineCode>
      就能全部撤销。这是事务的「后悔药」。
    </Callout>

    <Divider />

    <Subtitle>三、自动提交 vs 手动提交</Subtitle>
    <Paragraph>
      上面用 <InlineCode>START TRANSACTION</InlineCode> 是<Text bold>手动管理事务</Text>
      。那平时我们直接执行一条 <InlineCode>UPDATE</InlineCode> 没写{' '}
      <InlineCode>COMMIT</InlineCode>，为什么也生效了？
    </Paragraph>
    <Paragraph>
      因为 <Text bold>MySQL 默认开启了「自动提交」</Text>：每执行一条 DML
      语句，就自动当作一个事务立即提交。
    </Paragraph>

    <Heading3>3.1 查看与修改自动提交开关</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 查看自动提交状态：1 表示开启（默认），0 表示关闭
SHOW VARIABLES LIKE 'autocommit';

-- 关闭自动提交（改成手动）
SET autocommit = 0;`}
    />
    <Paragraph>
      关闭后，你的每条 DML 都需要手动 <InlineCode>COMMIT</InlineCode> 才生效，否则{' '}
      <InlineCode>ROLLBACK</InlineCode> 或断开连接就丢失。
    </Paragraph>

    <Heading3>3.2 两种管理事务的方式</Heading3>
    <Table
      head={['方式', '做法', '适用']}
      rows={[
        ['显式事务', '用 START TRANSACTION … COMMIT/ROLLBACK 临时打包一组语句', '偶尔需要打包的场景（最常用）'],
        ['关闭自动提交', 'SET autocommit=0，之后所有语句都要手动提交', '整个会话都要手动控制'],
      ]}
    />
    <Callout type="tip">
      <Text bold>MySQL 与 Oracle 的差异</Text>：MySQL <Text bold>默认自动提交</Text>
      ；Oracle <Text bold>默认不自动提交</Text>（必须手动 <InlineCode>COMMIT</InlineCode>
      ）。从 Oracle 转过来的同学要特别注意这点。
    </Callout>
    <Callout type="warning">
      注意：<InlineCode>DDL</InlineCode>（如 <InlineCode>CREATE/DROP/ALTER</InlineCode>
      ）在 MySQL 里会触发<Text bold>隐式提交</Text>，无法回滚。事务通常只对 DML 有意义。
    </Callout>

    <Divider />

    <Subtitle>四、事务的四大特性 ACID</Subtitle>
    <Paragraph>
      事务必须满足四个特性，取首字母合称 <Text bold>ACID</Text>，是面试必背：
    </Paragraph>
    <Table
      head={['特性', '英文', '含义', '对应转账例子']}
      rows={[
        ['原子性', 'Atomicity', '事务是不可分割的最小单位，要么全成功要么全失败', '转账两条 SQL 是一个整体，不能只扣不加'],
        ['一致性', 'Consistency', '事务前后，数据的总量/约束保持合法一致', '转账前后，两人钱的总和恒为 2000'],
        ['隔离性', 'Isolation', '多个事务并发执行时互不干扰', '张三转账时，别人看不到他「扣了一半」的中间状态'],
        ['持久性', 'Durability', '一旦 COMMIT，改动永久保存，即使宕机也不丢', '转账成功后断电，重启数据依然是对的'],
      ]}
    />
    <Callout type="tip">
      四者关系：<Text bold>原子性是手段</Text>（保证不会执行一半），
      <Text bold>一致性是目的</Text>（最终数据合法），<Text bold>隔离性</Text>
      处理并发干扰，<Text bold>持久性</Text>靠日志（redo log）保证落盘不丢。其中
      <Text bold>隔离性是最复杂、最值得展开的</Text>，下面重点讲。
    </Callout>
  </article>
);

export default index;
