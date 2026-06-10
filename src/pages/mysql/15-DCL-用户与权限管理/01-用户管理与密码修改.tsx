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
    <Title>用户管理与密码修改</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        前面我们一直用「万能的 root」账号操作数据库。但在真实项目里，让所有程序、所有人都用 root
        是极其危险的——一旦泄露，整个数据库任人宰割。正确做法是：
        <Text bold>
          给不同的应用/人员创建专门的账号，并只授予它们「干活所必需」的最小权限
        </Text>
        （这叫最小权限原则）。
      </Paragraph>
      <Paragraph>
        管理「用户」和「权限」用的就是 SQL 四大类里的最后一类——
        <Text bold>DCL（Data Control Language，数据控制语言）</Text>。本章讲透：
      </Paragraph>
      <OrderedList>
        <ListItem>
          用户存在哪、怎么<Text bold>增删查</Text>用户；
        </ListItem>
        <ListItem>
          怎么<Text bold>修改密码</Text>（含忘记 root 密码的应急思路）；
        </ListItem>
        <ListItem>
          怎么<Text bold>授权 / 查看权限 / 撤销权限</Text>。
        </ListItem>
      </OrderedList>
      <Paragraph>
        本章是 SQL 语言体系（DDL/DML/DQL/DCL）的收官，沿用 <InlineCode>db_learn</InlineCode>{' '}
        库做授权演示。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、MySQL 用户存在哪里</Subtitle>
    <Paragraph>
      MySQL 自身用一个名为 <InlineCode>mysql</InlineCode> 的<Text bold>系统数据库</Text>
      来管理用户和权限，用户信息存在它的 <InlineCode>user</InlineCode> 表里。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 切换到系统库
USE mysql;

-- 查询所有用户（host 主机 + user 用户名 共同标识一个账号）
SELECT host, user FROM user;`}
    />
    <Paragraph>可能的结果：</Paragraph>
    <Table
      head={['host', 'user']}
      rows={[
        ['%', 'root'],
        ['localhost', 'root'],
        ['localhost', 'mysql.sys'],
      ]}
    />
    <Callout type="tip">
      <Paragraph>
        <Text bold>关键认知</Text>：MySQL 的一个「用户」其实是{' '}
        <Text bold>
          <InlineCode>用户名@主机名</InlineCode> 的组合
        </Text>
        。<InlineCode>'root'@'localhost'</InlineCode> 和{' '}
        <InlineCode>'root'@'%'</InlineCode> 是<Text bold>两个不同的账号</Text>！
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <InlineCode>localhost</InlineCode>：只能从<Text bold>本机</Text>登录；
        </ListItem>
        <ListItem>
          <InlineCode>%</InlineCode>：通配符，表示可以从
          <Text bold>任意主机（任意 IP）</Text>登录；
        </ListItem>
        <ListItem>
          具体 IP（如 <InlineCode>192.168.1.100</InlineCode>）：只能从该 IP 登录。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>二、管理用户：增、删、查</Subtitle>

    <Heading3>2.1 创建用户 CREATE USER</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 语法：CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';

-- 创建一个只能在本机登录的用户 zhangsan
CREATE USER 'zhangsan'@'localhost' IDENTIFIED BY '123456';

-- 创建一个可以从任意主机登录的用户 lisi
CREATE USER 'lisi'@'%' IDENTIFIED BY '123456';

-- 创建一个只能从指定 IP 登录的用户
CREATE USER 'wangwu'@'192.168.1.100' IDENTIFIED BY '123456';`}
    />
    <Paragraph>
      新创建的用户<Text bold>默认没有任何权限</Text>
      ，能登录但几乎什么都干不了（连库都看不到），必须再授权（见第四节）。
    </Paragraph>

    <Heading3>2.2 删除用户 DROP USER</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 语法：DROP USER '用户名'@'主机名';
DROP USER 'wangwu'@'192.168.1.100';`}
    />
    <Callout type="warning">
      注意主机名要写对：删 <InlineCode>'zhangsan'@'localhost'</InlineCode> 不会影响{' '}
      <InlineCode>'zhangsan'@'%'</InlineCode>，它们是两个账号。
    </Callout>

    <Heading3>2.3 查询用户</Heading3>
    <CodeBlock
      language="sql"
      code={`USE mysql;
SELECT host, user FROM user;          -- 查所有用户

-- 查某个用户的详细信息（含认证插件等）
SELECT host, user, plugin FROM user WHERE user = 'zhangsan';`}
    />

    <Divider />

    <Subtitle>三、修改密码</Subtitle>
    <Paragraph>
      MySQL 不同版本改密码的语法差异较大，重点记 8.0 的写法。
    </Paragraph>

    <Heading3>3.1 MySQL 8.0：用 ALTER USER（推荐）</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 语法：ALTER USER '用户名'@'主机名' IDENTIFIED BY '新密码';
ALTER USER 'zhangsan'@'localhost' IDENTIFIED BY 'newpwd123';

-- 修改当前登录用户自己的密码
ALTER USER USER() IDENTIFIED BY 'mypwd';`}
    />

    <Heading3>3.2 用 SET PASSWORD</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 改指定用户
SET PASSWORD FOR 'zhangsan'@'localhost' = 'newpwd456';
-- 改自己（旧版本写法，8.0 也支持）
SET PASSWORD = 'mypwd';`}
    />

    <Heading3>3.3 在命令行用 mysqladmin（修改 root 等，需知道旧密码）</Heading3>
    <CodeBlock
      language="bash"
      code={`# 操作系统命令行执行（不是 mysql 内部）
mysqladmin -u root -p password "新密码"
# 回车后输入旧密码`}
    />

    <Heading3>3.4 忘记 root 密码的应急思路</Heading3>
    <Callout type="danger">
      <Paragraph>这是运维高频场景，了解流程即可：</Paragraph>
      <OrderedList>
        <ListItem>
          停止 MySQL 服务（<InlineCode>net stop mysql</InlineCode>）；
        </ListItem>
        <ListItem>
          用<Text bold>跳过权限校验</Text>的方式启动：
          <InlineCode>mysqld --skip-grant-tables</InlineCode>（此时无需密码即可登录）；
        </ListItem>
        <ListItem>
          登录后修改 root 密码（8.0 下可能需先 <InlineCode>FLUSH PRIVILEGES;</InlineCode>{' '}
          再 <InlineCode>ALTER USER</InlineCode>）；
        </ListItem>
        <ListItem>正常重启服务，用新密码登录。</ListItem>
      </OrderedList>
    </Callout>
    <Callout type="warning">
      <InlineCode>--skip-grant-tables</InlineCode>{' '}
      期间数据库对任何人门户大开，务必在内网/断开外部访问下操作，改完立刻关闭该模式。
    </Callout>
  </article>
);

export default index;
