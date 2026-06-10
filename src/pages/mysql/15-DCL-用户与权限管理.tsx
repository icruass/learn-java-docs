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
    <Title>DCL：用户管理与权限管理</Title>

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

    <Divider />

    <Subtitle>四、权限管理：授权、查看、撤销</Subtitle>

    <Heading3>4.1 常见权限种类</Heading3>
    <Table
      head={['权限', '作用']}
      rows={[
        ['SELECT', '查询数据'],
        ['INSERT', '插入数据'],
        ['UPDATE', '修改数据'],
        ['DELETE', '删除数据'],
        ['CREATE', '创建库/表'],
        ['DROP', '删除库/表'],
        ['ALTER', '修改表结构'],
        ['ALL 或 ALL PRIVILEGES', '上述所有权限'],
      ]}
    />

    <Heading3>4.2 授予权限 GRANT</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 语法：GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';

-- ① 授予 zhangsan 对 db_learn 库 emp 表的查询和插入权限
GRANT SELECT, INSERT ON db_learn.emp TO 'zhangsan'@'localhost';

-- ② 授予对 db_learn 库下所有表的全部权限（* 代表库内所有表）
GRANT ALL ON db_learn.* TO 'zhangsan'@'localhost';

-- ③ 授予对所有库所有表的全部权限（*.* —— 相当于超级管理员，慎用）
GRANT ALL ON *.* TO 'lisi'@'%';`}
    />
    <Paragraph>
      <InlineCode>ON</InlineCode> 后面的「<InlineCode>库.表</InlineCode>」是权限范围：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>db_learn.emp</InlineCode>：只对这一张表；
      </ListItem>
      <ListItem>
        <InlineCode>db_learn.*</InlineCode>：对这个库的所有表；
      </ListItem>
      <ListItem>
        <InlineCode>*.*</InlineCode>：对所有库所有表。
      </ListItem>
    </UnorderedList>

    <Heading3>4.3 查看权限 SHOW GRANTS</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 语法：SHOW GRANTS FOR '用户名'@'主机名';
SHOW GRANTS FOR 'zhangsan'@'localhost';`}
    />
    <Paragraph>
      会列出该用户当前拥有的所有 <InlineCode>GRANT</InlineCode> 语句，一目了然。
    </Paragraph>

    <Heading3>4.4 撤销权限 REVOKE</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 语法：REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名';

-- 撤销 zhangsan 对 emp 表的插入权限（保留查询）
REVOKE INSERT ON db_learn.emp FROM 'zhangsan'@'localhost';

-- 撤销所有权限
REVOKE ALL ON db_learn.* FROM 'zhangsan'@'localhost';`}
    />

    <Heading3>4.5 刷新权限 FLUSH PRIVILEGES</Heading3>
    <Paragraph>
      某些直接修改 <InlineCode>mysql</InlineCode> 系统表的操作后，需要让权限立即生效：
    </Paragraph>
    <CodeBlock language="sql" code={`FLUSH PRIVILEGES;`} />
    <Callout type="tip">
      用标准的 <InlineCode>GRANT</InlineCode> / <InlineCode>REVOKE</InlineCode> /{' '}
      <InlineCode>CREATE USER</InlineCode> 语句时，MySQL 会自动刷新，
      <Text bold>通常不需要手动 FLUSH</Text>；只有直接 <InlineCode>UPDATE mysql.user</InlineCode>{' '}
      改表时才必须手动刷新。
    </Callout>

    <Divider />

    <Subtitle>五、注意事项与常见坑</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>新建用户连不上库</Text>：新用户默认零权限，登录后{' '}
        <InlineCode>SHOW DATABASES</InlineCode>{' '}
        几乎看不到东西——这不是 bug，是没授权，记得 <InlineCode>GRANT</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>主机名不匹配登录失败</Text>：用 <InlineCode>'zhangsan'@'localhost'</InlineCode>{' '}
        这个账号，从别的机器（非本机）连会被拒。要远程连，得创建{' '}
        <InlineCode>'zhangsan'@'%'</InlineCode> 或对应 IP 的账号。
      </ListItem>
      <ListItem>
        <Text bold>最小权限原则</Text>：应用程序账号只给它真正需要的权限（一般{' '}
        <InlineCode>SELECT/INSERT/UPDATE/DELETE</InlineCode> 即可），
        <Text bold>不要随手给 ALL ON *.*</Text>，更不要让应用直接用 root。
      </ListItem>
      <ListItem>
        <Text bold>% 不包含本机的某些情况</Text>：历史上 <InlineCode>%</InlineCode>{' '}
        在某些版本不覆盖 <InlineCode>localhost</InlineCode> 的 socket 登录，远程连不上时可同时建{' '}
        <InlineCode>@'%'</InlineCode> 与 <InlineCode>@'localhost'</InlineCode> 排查。
      </ListItem>
      <ListItem>
        <Text bold>8.0 认证插件变化</Text>：MySQL 8.0 默认认证插件是{' '}
        <InlineCode>caching_sha2_password</InlineCode>
        ，老客户端/驱动可能连不上，必要时创建用户时指定{' '}
        <InlineCode>IDENTIFIED WITH mysql_native_password BY '密码'</InlineCode>。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>六、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>DCL</Text> 负责「用户」和「权限」，是 SQL 四大类（DDL/DML/DQL/DCL）的收尾。
      </ListItem>
      <ListItem>
        <Text bold>用户 = 用户名@主机名</Text>：<InlineCode>localhost</InlineCode>（本机）/
        <InlineCode>%</InlineCode>（任意主机）/具体 IP 是不同账号。
      </ListItem>
      <ListItem>
        <Text bold>用户增删查</Text>：
        <UnorderedList>
          <ListItem>
            建：<InlineCode>CREATE USER '名'@'主机' IDENTIFIED BY '密码';</InlineCode>
          </ListItem>
          <ListItem>
            删：<InlineCode>DROP USER '名'@'主机';</InlineCode>
          </ListItem>
          <ListItem>
            查：<InlineCode>USE mysql; SELECT host,user FROM user;</InlineCode>
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>改密码</Text>：8.0 用{' '}
        <InlineCode>ALTER USER '名'@'主机' IDENTIFIED BY '新密码';</InlineCode>；命令行用{' '}
        <InlineCode>mysqladmin</InlineCode>；忘记 root 用{' '}
        <InlineCode>--skip-grant-tables</InlineCode> 应急。
      </ListItem>
      <ListItem>
        <Text bold>权限三件套</Text>：
        <UnorderedList>
          <ListItem>
            授权 <InlineCode>GRANT 权限 ON 库.表 TO '名'@'主机';</InlineCode>
          </ListItem>
          <ListItem>
            查看 <InlineCode>SHOW GRANTS FOR '名'@'主机';</InlineCode>
          </ListItem>
          <ListItem>
            撤销 <InlineCode>REVOKE 权限 ON 库.表 FROM '名'@'主机';</InlineCode>
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>安全准则</Text>：最小权限原则，应用账号不用 root、不给{' '}
        <InlineCode>ALL ON *.*</InlineCode>。
      </ListItem>
    </UnorderedList>
  </article>
);

export default index;
