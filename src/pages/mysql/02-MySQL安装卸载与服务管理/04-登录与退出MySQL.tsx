import React from 'react';
import {
  Title,
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
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>登录与退出 MySQL</Title>

    <Paragraph>
      服务端跑起来后，就可以用客户端 <InlineCode>mysql</InlineCode> <Text bold>登录</Text>进去敲 SQL 了。
    </Paragraph>

    <Heading3>5.1 登录命令完整语法</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="bash"
      code={`mysql -h 主机地址 -P 端口 -u 用户名 -p`}
    />
    <Paragraph>
      <Text bold>逐项解释：</Text>
    </Paragraph>
    <Table
      head={['选项', '含义', '默认值 / 备注']}
      rows={[
        ['-h', 'host，要连的服务器地址', '不写默认 localhost（本机）'],
        ['-P', 'Port，端口（大写 P）', '不写默认 3306'],
        ['-u', 'user，用户名', '常用 root'],
        ['-p', 'password，密码', '后面别直接跟密码，回车后再输入更安全'],
      ]}
    />
    <Callout type="warning" title="大小写极易错">
      <InlineCode>-P</InlineCode>（大写）是<Text bold>端口</Text>，<InlineCode>-p</InlineCode>（小写）是
      <Text bold>密码</Text>。写反了会出莫名其妙的错。
    </Callout>

    <Heading3>5.2 最常见：登录本机</Heading3>
    <Paragraph>
      本机登录可以省掉 <InlineCode>-h</InlineCode> 和 <InlineCode>-P</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="bash"
      code={`mysql -uroot -p`}
    />
    <Callout type="tip" title="提示">
      <InlineCode>-uroot</InlineCode> 中 <InlineCode>-u</InlineCode> 和 <InlineCode>root</InlineCode>{' '}
      之间<Text bold>可以不加空格</Text>（<InlineCode>-u root</InlineCode> 也行）；但 <InlineCode>-p</InlineCode>{' '}
      后面<Text bold>最好不要</Text>直接接密码。
    </Callout>
    <Paragraph>
      回车后提示输入密码（输入时屏幕不显示任何字符，是正常的隐藏，直接输完回车）：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Enter password: ********`}
    />
    <Paragraph>
      登录成功后看到欢迎信息和 <InlineCode>mysql&gt;</InlineCode> 提示符，就代表进来了：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Welcome to the MySQL monitor.  Commands end with ; or \\g.
Your MySQL connection id is 8
Server version: 8.0.36 MySQL Community Server - GPL

mysql>`}
    />
    <Paragraph>
      看到 <InlineCode>mysql&gt;</InlineCode> 这个提示符，就可以开始敲 SQL 了。验证一下：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT VERSION();`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`+-----------+
| VERSION() |
+-----------+
| 8.0.36    |
+-----------+
1 row in set (0.00 sec)`}
    />

    <Heading3>5.3 完整形式与登录远程主机</Heading3>
    <Paragraph>当 MySQL 不在本机、或端口不是 3306 时，就要写全：</Paragraph>
    <CodeBlock
      language="bash"
      code={`# 连本机的 3307 端口
mysql -h 127.0.0.1 -P 3307 -u root -p

# 连远程服务器（IP 192.168.1.100）的 MySQL
mysql -h 192.168.1.100 -P 3306 -u root -p`}
    />
    <Callout type="danger" title="远程登录的几个常见坑">
      <OrderedList>
        <ListItem>
          <Text bold>服务器防火墙</Text>：远程主机的防火墙没放行 3306 端口 → 连接超时。需在服务器上放行入站规则。
        </ListItem>
        <ListItem>
          <Text bold>MySQL 默认只允许本机连</Text>：root 账号默认是 <InlineCode>root@localhost</InlineCode>，远程连会报{' '}
          <InlineCode>Host 'xxx' is not allowed to connect</InlineCode>。需要在服务器上为对应用户授权远程访问（创建{' '}
          <InlineCode>'root'@'%'</InlineCode> 或指定 IP 的账户并授权），这属于权限管理章节内容，这里先知道有这回事。
        </ListItem>
        <ListItem>
          <InlineCode>bind-address</InlineCode>：服务端 my.ini 若配了 <InlineCode>bind-address=127.0.0.1</InlineCode>
          ，会只监听本机，外部连不上；要改成 <InlineCode>0.0.0.0</InlineCode> 或注释掉。
        </ListItem>
        <ListItem>
          <InlineCode>localhost</InlineCode> 与 <InlineCode>127.0.0.1</InlineCode> 不完全等价：在 MySQL 里{' '}
          <InlineCode>localhost</InlineCode> 默认走本地 socket/管道，<InlineCode>127.0.0.1</InlineCode>{' '}
          走 TCP。极少数情况下两者行为不同，远程调试时知道这点能少踩坑。
        </ListItem>
      </OrderedList>
    </Callout>

    <Heading3>5.4 退出 MySQL 客户端</Heading3>
    <Paragraph>
      登录进去后（在 <InlineCode>mysql&gt;</InlineCode> 提示符下），以下三种任选其一即可退出：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`exit;`}
    />
    <Paragraph>或</Paragraph>
    <CodeBlock
      language="sql"
      code={`quit;`}
    />
    <Paragraph>或</Paragraph>
    <CodeBlock
      language="sql"
      code={`\\q`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>（任意一种都会打印）：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Bye`}
    />
    <Paragraph>
      退出后回到普通命令行（<InlineCode>C:\</InlineCode>）。
    </Paragraph>
    <Callout type="tip" title="重点辨析">
      <Paragraph>退出客户端 ≠ 关闭服务！</Paragraph>
      <UnorderedList>
        <ListItem>
          <InlineCode>exit</InlineCode> / <InlineCode>quit</InlineCode> / <InlineCode>\q</InlineCode>
          ：只是<Text bold>断开你这一个客户端连接</Text>，后台 <InlineCode>mysqld</InlineCode>{' '}
          服务端<Text bold>照常运行</Text>，别人/别的连接不受影响。
        </ListItem>
        <ListItem>
          <InlineCode>net stop MySQL80</InlineCode>：才是<Text bold>真正关掉服务端</Text>，所有连接都断、数据库整个停掉。
        </ListItem>
      </UnorderedList>
      <Paragraph>
        想象成：<InlineCode>exit</InlineCode> 是你「关上冰箱门走开」，冰箱还在制冷；<InlineCode>net stop</InlineCode>{' '}
        才是「把冰箱电源拔了」。
      </Paragraph>
    </Callout>
  </article>
);

export default index;
