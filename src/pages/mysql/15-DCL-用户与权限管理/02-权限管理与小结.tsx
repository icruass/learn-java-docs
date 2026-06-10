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
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>权限管理与本章小结</Title>

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
