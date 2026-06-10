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
    <Title>安装验证与服务启停</Title>

    <Subtitle>3. 安装后验证</Subtitle>
    <Paragraph>装完别急着用，先确认两件事：服务在不在、命令通不通。</Paragraph>

    <Heading3>3.1 验证服务已注册</Heading3>
    <Paragraph>
      按 <InlineCode>Win + R</InlineCode>，输入 <InlineCode>services.msc</InlineCode>{' '}
      回车，打开「服务」面板，在列表里找到你的 MySQL 服务（如 <InlineCode>MySQL80</InlineCode>）：
    </Paragraph>
    <Table
      head={['列', '期望值', '说明']}
      rows={[
        ['名称', 'MySQL80', '你安装时设的服务名'],
        ['状态', '正在运行', '说明服务端进程已起来'],
        ['启动类型', '自动 / 手动', '自动=开机自启；手动=要自己启'],
      ]}
    />
    <Paragraph>也可以用命令行查（更快）：</Paragraph>
    <CodeBlock
      language="bash"
      code={`sc query MySQL80`}
    />
    <Paragraph>
      输出里看到 <InlineCode>STATE : 4 RUNNING</InlineCode> 就说明正在运行：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`SERVICE_NAME: MySQL80
        TYPE               : 10  WIN32_OWN_PROCESS
        STATE              : 4  RUNNING
        ...`}
    />

    <Heading3>3.2 验证客户端命令可用</Heading3>
    <CodeBlock
      language="bash"
      code={`mysql --version`}
    />
    <Paragraph>期望输出（版本号以你装的为准）：</Paragraph>
    <CodeBlock
      language="text"
      code={`mysql  Ver 8.0.36 for Win64 on x86_64 (MySQL Community Server - GPL)`}
    />
    <Callout type="danger" title="常见坑">
      如果敲 <InlineCode>mysql --version</InlineCode> 报「'mysql' 不是内部或外部命令」，说明{' '}
      <Text bold>PATH 没配好</Text> 或 <Text bold>没重开命令行窗口</Text>。回到 2.3 检查 bin 路径是否加进 Path，然后
      <Text bold>关掉当前 CMD 重新开一个</Text>再试。
    </Callout>

    <Divider />

    <Subtitle>4. MySQL 服务的启动与关闭</Subtitle>
    <Paragraph>
      服务端就是那个常驻后台的 <InlineCode>mysqld</InlineCode>。你要随时能启、能停（比如改了 my.ini 必须重启服务才生效）。三种方式，按场景选。
    </Paragraph>

    <Heading3>4.1 方式一：图形方式（services.msc）</Heading3>
    <Paragraph>
      <InlineCode>Win + R</InlineCode> → <InlineCode>services.msc</InlineCode> → 找到{' '}
      <InlineCode>MySQL80</InlineCode> → 右键，菜单里有：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>启动（Start）</Text>
      </ListItem>
      <ListItem>
        <Text bold>停止（Stop）</Text>
      </ListItem>
      <ListItem>
        <Text bold>重新启动（Restart）</Text>：改完配置最常用，等于停+启。
      </ListItem>
    </UnorderedList>
    <Paragraph>适合不爱敲命令的人，直观。</Paragraph>

    <Heading3>4.2 方式二：net 命令（最常用）</Heading3>
    <CodeBlock
      language="bash"
      code={`# 启动 MySQL 服务（MySQL80 换成你的服务名）
net start MySQL80

# 关闭 MySQL 服务
net stop MySQL80`}
    />
    <Paragraph>启动成功输出：</Paragraph>
    <CodeBlock
      language="text"
      code={`MySQL80 服务正在启动 .
MySQL80 服务已经启动成功。`}
    />
    <Callout type="warning" title="注意（管理员权限）">
      <Paragraph>
        <InlineCode>net start/stop</InlineCode> <Text bold>必须在「以管理员身份运行」的命令行</Text>里执行，否则报：
      </Paragraph>
      <CodeBlock
        language="text"
        code={`发生系统错误 5。
拒绝访问。`}
      />
      <Paragraph>
        解决：开始菜单搜 <InlineCode>cmd</InlineCode> → 右键 →「以管理员身份运行」。
      </Paragraph>
    </Callout>
    <Callout type="danger" title="常见坑">
      <InlineCode>net start</InlineCode> 报 <Text bold>「服务名无效」</Text> → 你写的服务名和实际注册的不一致。MySQL 5.7 常注册成{' '}
      <InlineCode>MySQL</InlineCode>，8.0 常是 <InlineCode>MySQL80</InlineCode>。用 <InlineCode>sc query</InlineCode>{' '}
      或 services.msc 确认真实名字；也可以 <InlineCode>net start</InlineCode>（不带名字）列出所有正在运行的服务名参考。
    </Callout>

    <Heading3>4.3 方式三：sc 命令</Heading3>
    <Paragraph>
      <InlineCode>sc</InlineCode> 是 Windows 自带的服务控制工具，功能更全：
    </Paragraph>
    <CodeBlock
      language="bash"
      code={`# 启动
sc start MySQL80

# 停止
sc stop MySQL80

# 查询状态
sc query MySQL80`}
    />
    <Callout type="tip" title="提示">
      <InlineCode>net</InlineCode> vs <InlineCode>sc</InlineCode> 的区别：日常启停用{' '}
      <InlineCode>net</InlineCode> 更直观（中文反馈、会等服务启完）；<InlineCode>sc</InlineCode>{' '}
      更偏底层、能查更多细节、还能用于删除服务（见卸载章）。同样需要管理员权限。
    </Callout>

    <Heading3>4.4 三种方式对比</Heading3>
    <Table
      head={['方式', '命令/操作', '是否需管理员', '适用场景']}
      rows={[
        ['services.msc', '图形右键启停', '是（弹 UAC）', '不爱敲命令、想看启动类型'],
        ['net', 'net start/stop 服务名', '是', '日常最常用'],
        ['sc', 'sc start/stop/query 服务名', '是', '脚本化、查细节、删服务'],
      ]}
    />
  </article>
);

export default index;
