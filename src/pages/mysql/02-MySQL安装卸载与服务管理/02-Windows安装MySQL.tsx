import React from 'react';
import {
  Title,
  Heading3,
  Heading4,
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
    <Title>Windows 安装 MySQL</Title>

    <Paragraph>Windows 下有两种主流安装方式，先看对比，再分别详解：</Paragraph>

    <Table
      head={['维度', '方式一：msi 向导式安装', '方式二：zip 解压版安装']}
      rows={[
        ['安装文件', 'mysql-installer-community-x.x.x.msi', 'mysql-8.0.xx-winx64.zip'],
        ['操作难度', '⭐ 简单，鼠标点点点', '⭐⭐⭐ 需手动配置、敲命令'],
        ['自动注册服务', '✅ 向导自动帮你注册', '❌ 需手动 mysqld --install'],
        ['自动设置环境变量', '部分版本会，多数仍需手动', '❌ 全靠自己'],
        ['适合人群', '初学者、只想快速用上', '想理解原理、要装多实例、要绿色免安装'],
        ['卸载干净度', '控制面板可卸，但仍有残留（见第 6 章）', '删目录 + 删服务即可，相对干净'],
      ]}
    />

    <Callout type="tip" title="建议">
      第一次学，强烈推荐用 <Text bold>msi 向导式</Text>，省心。等你理解了目录结构和服务原理后，再尝试 zip 版以加深理解。下面两种都讲。
    </Callout>

    <Heading3>2.1 方式一：msi 安装包向导式安装</Heading3>

    <Heading4>第 1 步：下载</Heading4>
    <Paragraph>
      去 MySQL 官网下载页（<InlineCode>https://dev.mysql.com/downloads/installer/</InlineCode>），下载{' '}
      <Text bold>MySQL Installer for Windows</Text>。有两个体积：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>mysql-installer-web-community</InlineCode>（小，安装时联网下载）
      </ListItem>
      <ListItem>
        <InlineCode>mysql-installer-community</InlineCode>（大，离线全量包）
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="提示">
      网络不稳就选<Text bold>离线全量包</Text>，避免装到一半卡在下载。
    </Callout>

    <Heading4>第 2 步：选择安装类型</Heading4>
    <Paragraph>
      双击 msi 启动向导，到 <Text bold>Choosing a Setup Type</Text> 界面，常见选项：
    </Paragraph>
    <Table
      head={['选项', '含义']}
      rows={[
        ['Developer Default', '开发者全家桶（Server + Workbench + 各种连接器），体积大'],
        ['Server only', '只装服务端，最干净，推荐初学者'],
        ['Custom', '自定义勾选组件'],
      ]}
    />
    <Paragraph>
      初学选 <Text bold>Server only</Text> 即可，后面缺什么再补。
    </Paragraph>

    <Heading4>第 3 步：关键配置（重点！）</Heading4>
    <Paragraph>
      向导会依次让你配置几项，<Text bold>这几项决定了你以后怎么用，务必看清</Text>：
    </Paragraph>
    <Paragraph>
      <Text bold>(1) 网络与端口（Type and Networking）</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Config Type</Text>：选 <InlineCode>Development Computer</InlineCode>（开发机，占用内存最小）。
      </ListItem>
      <ListItem>
        <Text bold>Port（端口）</Text>：默认 <Text bold>3306</Text>。
      </ListItem>
    </UnorderedList>
    <Callout type="warning" title="注意">
      如果你这台机器上已经装过别的 MySQL，或 3306 被别的程序占用，这里要改成其它端口（如 3307），否则服务会启不来。怎么查端口占用见下方「常见坑」。
    </Callout>
    <Paragraph>
      <Text bold>(2) 认证方式（Authentication Method）</Text>
    </Paragraph>
    <Paragraph>
      MySQL 8.0 默认用 <Text bold>Use Strong Password Encryption（caching_sha2_password）</Text>{' '}
      这种更安全的新加密方式。
    </Paragraph>
    <Callout type="danger" title="常见坑">
      <Paragraph>
        很多老的 Java / PHP 客户端、老版本 Navicat 连不上 8.0，报{' '}
        <InlineCode>Authentication plugin 'caching_sha2_password' cannot be loaded</InlineCode>。
      </Paragraph>
      <UnorderedList>
        <ListItem>
          解决办法 A：这里选下面那个{' '}
          <Text bold>Use Legacy Authentication Method（mysql_native_password）</Text>，兼容性好；
        </ListItem>
        <ListItem>
          解决办法 B：保持新方式，事后升级你的客户端/驱动（JDBC 用{' '}
          <InlineCode>mysql-connector-java 8.x</InlineCode> 即可正常连）。
        </ListItem>
        <ListItem>学习阶段图省事，可以选 Legacy。</ListItem>
      </UnorderedList>
    </Callout>
    <Paragraph>
      <Text bold>(3) 设置 root 密码（Accounts and Roles）</Text>
    </Paragraph>
    <Paragraph>
      这一步给超级管理员 <Text bold>root</Text> 设密码。
    </Paragraph>
    <Callout type="warning" title="注意">
      <UnorderedList>
        <ListItem>
          这个密码<Text bold>一定要记住</Text>！忘了它后续登录、改配置都很麻烦（要进安全模式重置）。
        </ListItem>
        <ListItem>
          学习机可以设简单点（如 <InlineCode>root</InlineCode> / <InlineCode>123456</InlineCode>），但
          <Text bold>生产环境务必用强密码</Text>。
        </ListItem>
        <ListItem>此处还可「Add User」添加普通账号，初学可跳过，先用 root。</ListItem>
      </UnorderedList>
    </Callout>
    <Paragraph>
      <Text bold>(4) 注册为 Windows 服务（Windows Service）</Text>
    </Paragraph>
    <Paragraph>向导会问是否把 MySQL 安装为系统服务：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Configure MySQL Server as a Windows Service</Text>：勾上 ✅（推荐）。
      </ListItem>
      <ListItem>
        <Text bold>Windows Service Name</Text>：服务名，默认 <InlineCode>MySQL80</InlineCode>（8.0 版常见就叫这个）。
        <Text bold>这个名字要记住</Text>，后面 <InlineCode>net start</InlineCode> 要用到。
      </ListItem>
      <ListItem>
        <Text bold>Start the MySQL Server at System Startup</Text>：是否开机自启。
        <UnorderedList>
          <ListItem>学习机建议<Text bold>不勾</Text>，避免每次开机都常驻吃内存，需要时手动启；</ListItem>
          <ListItem>当服务器用就勾上。</ListItem>
        </UnorderedList>
      </ListItem>
    </UnorderedList>

    <Heading4>第 4 步：应用配置（Apply Configuration）</Heading4>
    <Paragraph>
      点 <Text bold>Execute</Text>，向导会自动执行：写配置文件 → 初始化 data 目录 → 注册服务 → 启动服务 → 应用安全设置。全部打勾即安装成功。
    </Paragraph>
    <Callout type="tip" title="关于字符集">
      msi 8.0 向导默认服务端字符集已经是 <Text bold>utf8mb4</Text>（8.0 的默认字符集就是它），一般不用手动改。
      <Text bold>强烈建议保持 utf8mb4</Text>——它是真正的「完整 UTF-8」，能存 emoji 😀 和所有中文；而老的{' '}
      <InlineCode>utf8</InlineCode>（实为 <InlineCode>utf8mb3</InlineCode>）每个字符最多 3 字节，
      <Text bold>存不了 emoji</Text>，是历史坑。若向导有 <InlineCode>Server Character Set</InlineCode> 选项，选{' '}
      <InlineCode>utf8mb4</InlineCode> 即可。怎么改见第 7 章。
    </Callout>

    <Heading3>2.2 方式二：zip 解压版安装（理解原理用）</Heading3>
    <Paragraph>
      zip 版没有向导，所有步骤都得手动，但正因如此，你能清楚看到「安装到底做了哪些事」。
    </Paragraph>

    <Heading4>第 1 步：解压</Heading4>
    <Paragraph>
      下载 <InlineCode>mysql-8.0.xx-winx64.zip</InlineCode>，解压到你想放的目录，例如：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`D:\\dev\\mysql-8.0`}
    />
    <Paragraph>
      这个目录就是 <Text bold>basedir（安装目录）</Text>。解压后里面有 <InlineCode>bin</InlineCode>、
      <InlineCode>lib</InlineCode>、<InlineCode>share</InlineCode> 等文件夹，但
      <Text bold>注意：没有 data 目录、也没有 my.ini</Text>，这俩需要我们自己来。
    </Paragraph>

    <Heading4>第 2 步：手写配置文件 my.ini</Heading4>
    <Paragraph>
      在 basedir 根目录新建 <InlineCode>my.ini</InlineCode>（注意是 <InlineCode>.ini</InlineCode> 不是{' '}
      <InlineCode>.txt</InlineCode>），写入最小可用配置：
    </Paragraph>
    <CodeBlock
      language="ini"
      code={`[mysqld]
# 端口
port=3306
# 安装目录（basedir），注意路径用正斜杠 / 或双反斜杠 \\，避免转义问题
basedir=D:/dev/mysql-8.0
# 数据目录（datadir），这个目录下一步会自动生成，不要手动建里面的文件
datadir=D:/dev/mysql-8.0/data
# 服务端默认字符集，强烈建议 utf8mb4
character-set-server=utf8mb4
# 最大连接数
max_connections=200
# 默认存储引擎
default-storage-engine=INNODB

[mysql]
# 客户端默认字符集
default-character-set=utf8mb4`}
    />
    <Callout type="warning" title="注意">
      <InlineCode>datadir</InlineCode> 指向的 <InlineCode>data</InlineCode> 目录
      <Text bold>必须不存在或为空</Text>，下一步初始化命令会自己创建并填充。如果你提前手动建了个非空 data 目录，初始化会报错。
    </Callout>

    <Heading4>第 3 步：初始化 data 目录</Heading4>
    <Paragraph>
      以<Text bold>管理员身份</Text>打开 CMD/PowerShell，进入 <InlineCode>bin</InlineCode> 目录，执行初始化：
    </Paragraph>
    <CodeBlock
      language="bash"
      code={`cd /d D:\\dev\\mysql-8.0\\bin

# 初始化数据目录，并生成一个临时 root 密码（打印在日志里）
mysqld --initialize --console`}
    />
    <Paragraph>执行后，控制台会输出一行类似：</Paragraph>
    <CodeBlock
      language="text"
      code={`[Note] [MY-010454] [Server] A temporary password is generated for root@localhost: kj3#Xa9!pQ?z`}
    />
    <Callout type="warning" title="注意">
      <Paragraph>
        <Text bold>务必复制保存最后那串「临时密码」</Text>（<InlineCode>kj3#Xa9!pQ?z</InlineCode>），第一次登录要用它，登进去后会被强制改成新密码。
      </Paragraph>
      <Paragraph>
        若用 <InlineCode>--initialize-insecure</InlineCode>（不带临时密码，root 初始为空密码）则更省事，但
        <Text bold>仅限学习机</Text>，绝不能用于生产。
      </Paragraph>
    </Callout>

    <Heading4>第 4 步：把 MySQL 注册为 Windows 服务</Heading4>
    <CodeBlock
      language="bash"
      code={`# 在 bin 目录下，--install 后面是自定义的服务名
mysqld --install MySQL80

# 输出：Service successfully installed.`}
    />

    <Heading4>第 5 步：启动服务</Heading4>
    <CodeBlock
      language="bash"
      code={`net start MySQL80`}
    />

    <Heading4>第 6 步：首次登录并修改临时密码</Heading4>
    <CodeBlock
      language="bash"
      code={`mysql -uroot -p
# 粘贴第 3 步那串临时密码`}
    />
    <Paragraph>
      登入后立即改密码，否则做任何操作都报「You must reset your password」：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER USER 'root'@'localhost' IDENTIFIED BY '你的新密码';`}
    />
    <Paragraph>
      至此 zip 版安装完成。可以看到，<Text bold>msi 向导其实就是把第 2~5 步自动帮你做了</Text>。
    </Paragraph>
    <Callout type="tip" title="配环境变量">
      （两种方式都建议做）：把 <InlineCode>bin</InlineCode> 目录加入系统 <InlineCode>PATH</InlineCode>
      ，这样在任意目录都能直接敲 <InlineCode>mysql</InlineCode>，不用每次 <InlineCode>cd</InlineCode> 到 bin。详见 2.3。
    </Callout>

    <Heading3>2.3 配置 PATH 环境变量（让 mysql 命令随处可用）</Heading3>
    <Paragraph>
      不配的话，你必须先 <InlineCode>cd</InlineCode> 到 <InlineCode>bin</InlineCode> 目录才能用{' '}
      <InlineCode>mysql</InlineCode>/<InlineCode>mysqld</InlineCode> 命令；配了就能在任何目录直接用。
    </Paragraph>
    <Paragraph>
      图形方式：<InlineCode>此电脑</InlineCode> 右键 → <InlineCode>属性</InlineCode> →{' '}
      <InlineCode>高级系统设置</InlineCode> → <InlineCode>环境变量</InlineCode> → 在「系统变量」里找到{' '}
      <InlineCode>Path</InlineCode> → 编辑 → 新增一行：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin`}
    />
    <Paragraph>
      确定后，<Text bold>重开一个</Text>命令行窗口（旧窗口不会自动刷新环境变量）验证：
    </Paragraph>
    <CodeBlock
      language="bash"
      code={`mysql --version`}
    />
  </article>
);

export default index;
