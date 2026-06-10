import React from 'react';
import {
  Title,
  Subtitle,
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
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>MySQL 的安装、卸载、服务启停与登录退出、目录结构</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        上一章我们认识了「MySQL 是什么、为什么要用数据库」，停留在概念层面。但概念会用嘴说还不够，你得先让 MySQL{' '}
        <Text bold>真正跑在你自己电脑上</Text>，才能动手敲 SQL。
      </Paragraph>
      <Paragraph>本章就是你和 MySQL 的「第一次亲密接触」，目标非常务实：</Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>装上它</Text>——Windows 下两种安装方式（向导式 msi、解压版 zip）该怎么选、怎么装；
        </ListItem>
        <ListItem>
          <Text bold>管得住它</Text>——MySQL 装好后是一个常驻后台的「服务（Service）」，你要会启、会停；
        </ListItem>
        <ListItem>
          <Text bold>进得去它</Text>——通过 <InlineCode>mysql</InlineCode> 命令行客户端登录进数据库、再安全退出；
        </ListItem>
        <ListItem>
          <Text bold>看得懂它</Text>——MySQL 安装目录里那一堆文件夹（bin、data、my.ini……）分别是干嘛的；
        </ListItem>
        <ListItem>
          <Text bold>卸得干净</Text>——某天想重装或换版本时，如何「彻底」卸载，避免残留把下次安装坑死。
        </ListItem>
      </OrderedList>
      <Paragraph>
        你可以把 MySQL 想象成一台「电冰箱」：<Text bold>安装</Text>=把冰箱搬进厨房接好电；
        <Text bold>服务启停</Text>=按下冰箱的开/关机键；<Text bold>登录</Text>
        =打开冰箱门往里放/取东西；<Text bold>目录结构</Text>
        =冰箱的各个隔层（冷冻区、冷藏区、说明书）；<Text bold>卸载</Text>
        =搬走冰箱并把插座、说明书一并收走。本章学完，你就能完全掌控这台「数据冰箱」了。
      </Paragraph>
      <Paragraph>
        后续所有章节（建库建表、增删改查、事务、索引……）都建立在「你已经能登录进 MySQL」这个前提上，所以本章是整套教程的
        <Text bold>地基</Text>，务必跟着动手做一遍。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>1. 准备工作：先搞清楚几个概念</Subtitle>
    <Paragraph>在动手之前，先把几个贯穿全章的名词理清楚，后面就不会一头雾水。</Paragraph>

    <Table
      head={['名词', '通俗解释', '类比']}
      rows={[
        ['MySQL 服务端（Server）', '真正存数据、跑 SQL 的后台程序，进程名 mysqld.exe（多了个 d，代表 daemon 守护进程）', '冰箱本身（一直通着电，默默工作）'],
        ['MySQL 客户端（Client）', '你用来连服务端、敲 SQL 的工具，命令行版叫 mysql.exe', '你这个「往冰箱里放东西的人」'],
        ['服务（Windows Service）', '服务端被注册成 Windows 后台服务后，可随开机自启、可被启停管理', '冰箱的「电源总闸」'],
        ['端口（Port）', '服务端监听的「门牌号」，MySQL 默认 3306', '冰箱所在房间的门牌号，客户端按门牌找上门'],
        ['root 用户', 'MySQL 安装后自带的「超级管理员」账号，权限最大', '冰箱主人，拥有所有钥匙'],
        ['basedir', 'MySQL 的安装目录（程序放哪）', '冰箱的「机身」'],
        ['datadir', 'MySQL 的数据目录（你的库表数据存哪）', '冰箱里实际存的「食物」'],
      ]}
    />

    <Callout type="tip" title="提示">
      初学者最容易混的是「服务端」和「客户端」。它俩是两个程序：服务端 <InlineCode>mysqld</InlineCode>{' '}
      在后台一直运行；你每次敲 <InlineCode>mysql</InlineCode>{' '}
      进去都是开了一个新的客户端连接，退出客户端不影响服务端继续运行。这点想清楚，后面「为什么停了 mysql 客户端服务还在」就不会奇怪了。
    </Callout>

    <Paragraph>
      本章用到的版本以 <Text bold>MySQL 8.0</Text>（社区版 Community Server）为例，路径示例统一假设安装在{' '}
      <InlineCode>C:\Program Files\MySQL\MySQL Server 8.0</InlineCode>
      。你的实际路径可能不同，按自己的来即可。
    </Paragraph>

    <Divider />

    <Subtitle>2. Windows 下安装 MySQL</Subtitle>
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

    <Divider />

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

    <Divider />

    <Subtitle>5. 登录与退出 MySQL</Subtitle>
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

    <Divider />

    <Subtitle>6. 彻底卸载 MySQL（重装/换版本必看）</Subtitle>
    <Callout type="danger" title="为什么单独大讲卸载？">
      因为 MySQL <Text bold>「装容易，卸干净难」</Text>。最经典的坑就是：直接在控制面板卸载，但{' '}
      <Text bold>data 目录、注册表项、残留服务、环境变量</Text> 没清理，结果<Text bold>重装时</Text>新装的 MySQL 读到旧 data 或旧服务，初始化失败、服务起不来、root 密码对不上……新手往往卡在这里好几个小时。所以「彻底」二字是关键。
    </Callout>
    <Paragraph>
      按顺序执行下面<Text bold>五步</Text>，一步都别省。
    </Paragraph>

    <Heading3>第 1 步：停止 MySQL 服务</Heading3>
    <Paragraph>正在运行的服务无法被干净卸载，先停：</Paragraph>
    <CodeBlock
      language="bash"
      code={`net stop MySQL80`}
    />

    <Heading3>第 2 步：控制面板卸载程序</Heading3>
    <Paragraph>
      <InlineCode>控制面板</InlineCode> → <InlineCode>程序和功能</InlineCode>（或设置 → 应用）→ 找到{' '}
      <Text bold>MySQL Server 8.0</Text>（以及 MySQL Installer、Connector 等相关项）→ 卸载。
    </Paragraph>
    <Callout type="tip" title="提示">
      若当初是 <Text bold>zip 版</Text> 安装，没有「程序和功能」里的条目，跳过本步，但要多做下面第 2.5 步「手动删除服务」。
    </Callout>

    <Heading3>第 2.5 步（zip 版/有残留服务时）：删除注册的服务</Heading3>
    <Paragraph>
      控制面板卸载有时不会删掉服务注册项，用 <InlineCode>sc delete</InlineCode> 手动删（管理员命令行）：
    </Paragraph>
    <CodeBlock
      language="bash"
      code={`# 先确保服务已停止，再删除
sc delete MySQL80

# 输出：[SC] DeleteService 成功`}
    />
    <Callout type="warning" title="注意">
      删服务前<Text bold>必须先 stop</Text>，否则服务处于「标记为删除」的半残状态，得重启电脑才彻底消失。
    </Callout>

    <Heading3>第 3 步：删除安装目录与 data 目录</Heading3>
    <Paragraph>把这两个目录彻底删掉（找到你实际的 basedir 和 datadir）：</Paragraph>
    <UnorderedList>
      <ListItem>
        安装目录（basedir），如 <InlineCode>C:\Program Files\MySQL\</InlineCode>
      </ListItem>
      <ListItem>
        <Text bold>数据目录（datadir）</Text>，8.0 默认常在隐藏路径：
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      code={`C:\\ProgramData\\MySQL\\MySQL Server 8.0\\`}
    />
    <Callout type="warning" title="注意">
      <Paragraph>
        <Text bold>这是最容易漏的一步！</Text> <InlineCode>C:\ProgramData</InlineCode>{' '}
        是<Text bold>隐藏文件夹</Text>，资源管理器默认看不到。
      </Paragraph>
      <UnorderedList>
        <ListItem>
          打开方式：地址栏直接粘贴 <InlineCode>C:\ProgramData</InlineCode> 回车；或「查看」里勾上「隐藏的项目」。
        </ListItem>
        <ListItem>
          <Text bold>data 目录里就是你所有的库表数据</Text>。卸载前如果里面有重要数据，<Text bold>先备份</Text>再删！删了不可恢复。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>第 4 步：清理注册表残留</Heading3>
    <Paragraph>
      按 <InlineCode>Win + R</InlineCode> → 输入 <InlineCode>regedit</InlineCode>{' '}
      打开注册表编辑器，检查并删除以下位置中与 MySQL 相关的残留项（如果存在）：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\MySQL80
HKEY_LOCAL_MACHINE\\SOFTWARE\\MySQL AB`}
    />
    <Callout type="warning" title="注意">
      <Paragraph>
        编辑注册表有风险，<Text bold>删之前最好先导出备份</Text>（选中项 → 右键 → 导出）。只删确认是 MySQL 的项，别误删其它。
      </Paragraph>
      <Paragraph>
        如果第 2.5 步用 <InlineCode>sc delete</InlineCode> 成功删了服务，<InlineCode>Services\MySQL80</InlineCode>{' '}
        这一项通常会自动消失，可不必手动删。
      </Paragraph>
    </Callout>

    <Heading3>第 5 步：清理环境变量</Heading3>
    <Paragraph>
      回到 <InlineCode>环境变量</InlineCode> 设置（见 2.3），在 <InlineCode>Path</InlineCode>{' '}
      里把当初加的那行 MySQL <InlineCode>bin</InlineCode> 路径删掉：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin   ← 删除这一行`}
    />

    <Heading3>卸载检查清单</Heading3>
    <Paragraph>全部做完后，对照确认「干净」了：</Paragraph>
    <Table
      head={['检查项', '干净的标志']}
      rows={[
        ['服务', 'services.msc 里找不到 MySQL；sc query MySQL80 报「指定的服务未安装」'],
        ['程序', '控制面板「程序和功能」无 MySQL 条目'],
        ['安装目录', 'basedir 已删'],
        ['数据目录', 'C:\\ProgramData\\MySQL\\ 已删（注意隐藏目录）'],
        ['注册表', '上述两处无 MySQL 残留'],
        ['环境变量', 'Path 中无 MySQL bin'],
        ['命令验证', '新开命令行敲 mysql --version 提示「不是内部或外部命令」'],
      ]}
    />
    <Callout type="danger" title="重装失败的典型现场">
      装到「Apply Configuration」时卡在 <InlineCode>Starting the server</InlineCode> 失败，多半是
      <Text bold>旧 data 目录没删</Text>——新初始化想建 data，发现已存在旧的、密码/版本对不上，于是失败。回到第 3 步把 data 彻底删干净再重装即可。
    </Callout>

    <Divider />

    <Subtitle>7. MySQL 安装目录结构详解</Subtitle>
    <Paragraph>
      装好后进入安装目录（basedir，如 <InlineCode>C:\Program Files\MySQL\MySQL Server 8.0\</InlineCode>
      ），你会看到一堆文件夹。逐个认识它们的作用，这能帮你理解 MySQL「东西都放在哪」。
    </Paragraph>
    <CodeBlock
      language="text"
      code={`MySQL Server 8.0\\
├── bin\\          ← 可执行程序（命令）都在这
├── data\\         ← 数据文件！（8.0 常被放到 C:\\ProgramData\\MySQL\\... 下，见下文）
├── docs\\         ← 文档
├── include\\      ← C/C++ 头文件（写 C 程序连 MySQL 用）
├── lib\\          ← 库文件（.dll/.lib），程序运行依赖
├── share\\        ← 共享资源：错误信息多语言文件、初始化 SQL、字符集定义等
└── my.ini        ← 核心配置文件（也可能在 ProgramData 里）`}
    />

    <Heading3>7.1 bin 目录——可执行程序</Heading3>
    <Paragraph>这是你接触最多的目录，里面是各种命令行工具：</Paragraph>
    <Table
      head={['程序', '作用']}
      rows={[
        ['mysqld.exe', '服务端主程序（后台守护进程，真正干活的）'],
        ['mysql.exe', '客户端，你登录敲 SQL 用的就是它'],
        ['mysqladmin.exe', '管理工具（改密码、查状态、关服务等）'],
        ['mysqldump.exe', '逻辑备份工具，把库表导出成 .sql 文件（备份/迁移必用）'],
        ['mysqlimport.exe', '数据导入工具'],
        ['mysql_upgrade.exe', '版本升级后修复系统表'],
      ]}
    />
    <Callout type="tip" title="记忆法">
      带 <InlineCode>d</InlineCode> 的 <InlineCode>mysqld</InlineCode> 是 daemon（服务端，后台）；不带{' '}
      <InlineCode>d</InlineCode> 的 <InlineCode>mysql</InlineCode> 是你（客户端）。
    </Callout>

    <Heading3>7.2 data 目录——数据文件（最重要、最不能乱动）</Heading3>
    <Paragraph>
      这里存放<Text bold>所有的真实数据</Text>：每个数据库一个子文件夹，表数据存在表空间文件（InnoDB 的{' '}
      <InlineCode>.ibd</InlineCode>）里，还有日志文件等。
    </Paragraph>
    <CodeBlock
      language="text"
      code={`data\\
├── ib_buffer_pool        ← 缓冲池转储
├── ibdata1               ← 系统表空间
├── ib_logfile* / #ib_redo* ← 重做日志（redo log，崩溃恢复用）
├── mysql\\                ← 系统库（账号、权限等）
├── performance_schema\\   ← 性能监控库
├── db_learn\\             ← 你自己建的库（如本教程的 db_learn）就长这样
│   └── emp.ibd           ← emp 表的数据文件
└── 主机名.err            ← 错误日志（服务起不来时看它！）`}
    />
    <Callout type="warning" title="铁律">
      <OrderedList>
        <ListItem>
          <Text bold>绝不要手动去 data 目录里删/改/拷贝文件</Text>来「删库」或「搬数据」，极易损坏。要操作数据请用 SQL，要备份请用{' '}
          <InlineCode>mysqldump</InlineCode>。
        </ListItem>
        <ListItem>卸载时这个目录是「数据老家」，重装前没删干净就是各种诡异问题的根源（见第 6 章）。</ListItem>
        <ListItem>
          <Text bold>服务起不来时</Text>，第一件事就是去 data 目录看 <InlineCode>主机名.err</InlineCode> 错误日志，里面有失败原因。
        </ListItem>
      </OrderedList>
    </Callout>
    <Callout type="tip" title="为什么 8.0 的 data 在 C:\ProgramData？">
      msi 安装时把「程序」放 <InlineCode>Program Files</InlineCode>、把「数据」放 <InlineCode>ProgramData</InlineCode>
      ，是为了符合 Windows 权限规范（Program Files 默认只读）。具体路径以 my.ini 里的 <InlineCode>datadir</InlineCode> 为准。
    </Callout>

    <Heading3>7.3 my.ini——核心配置文件</Heading3>
    <Paragraph>
      MySQL 的「总开关面板」，端口、目录、字符集、连接数等都在这里配置。文件分若干段（<InlineCode>[mysqld]</InlineCode>{' '}
      给服务端、<InlineCode>[mysql]</InlineCode> 给客户端、<InlineCode>[client]</InlineCode> 给所有客户端工具）。
    </Paragraph>
    <Paragraph>典型内容（节选并加注释）：</Paragraph>
    <CodeBlock
      language="ini"
      code={`[mysqld]
# 服务端监听端口
port=3306
# 安装目录（basedir）
basedir="C:/Program Files/MySQL/MySQL Server 8.0/"
# 数据目录（datadir）—— 你的库表数据真正存放的地方
datadir="C:/ProgramData/MySQL/MySQL Server 8.0/Data"
# 服务端默认字符集（强烈建议 utf8mb4）
character-set-server=utf8mb4
# 默认存储引擎
default-storage-engine=INNODB
# 最大并发连接数
max_connections=151

[mysql]
# mysql 客户端默认字符集
default-character-set=utf8mb4`}
    />
    <Table
      head={['配置项', '所在段', '含义']}
      rows={[
        ['port', '[mysqld]', '服务端端口，默认 3306'],
        ['basedir', '[mysqld]', 'MySQL 安装目录'],
        ['datadir', '[mysqld]', '数据存放目录'],
        ['character-set-server', '[mysqld]', '服务端默认字符集'],
        ['max_connections', '[mysqld]', '最大连接数'],
        ['default-character-set', '[mysql]/[client]', '客户端默认字符集'],
      ]}
    />
    <Callout type="tip" title="怎么快速找到我的 my.ini 在哪？">
      <Paragraph>登进 MySQL 后执行：</Paragraph>
      <CodeBlock
        language="sql"
        code={`SHOW VARIABLES LIKE 'basedir';
SHOW VARIABLES LIKE 'datadir';`}
      />
      <Paragraph>
        也可以在 services.msc 里看 MySQL 服务的「属性 → 可执行文件路径」，里面 <InlineCode>--defaults-file=</InlineCode>{' '}
        后面就是 my.ini 的真实路径。
      </Paragraph>
    </Callout>

    <Heading3>7.4 其它目录</Heading3>
    <Table
      head={['目录', '作用']}
      rows={[
        ['lib\\', '运行所需的库文件（动态/静态库），缺了 MySQL 跑不起来，别动'],
        ['share\\', '共享资源：各语言错误提示文件、字符集/排序规则定义、初始化系统库的 SQL 脚本'],
        ['include\\', 'C/C++ 开发头文件，用 C 语言连 MySQL 时才用'],
        ['docs\\', '自带文档（部分版本有）'],
      ]}
    />

    <Divider />

    <Subtitle>8. 配置文件 my.ini 常改项详解</Subtitle>
    <Paragraph>
      日常学习/开发中，你最可能改的就是下面三项。<Text bold>改完任何一项，都必须重启 MySQL 服务才生效</Text>（
      <InlineCode>net stop</InlineCode> + <InlineCode>net start</InlineCode>，或 services.msc 里 Restart）。
    </Paragraph>

    <Heading3>8.1 默认字符集（character set）—— 最常改</Heading3>
    <Paragraph>
      <Text bold>目的</Text>：让数据库默认用 <InlineCode>utf8mb4</InlineCode>，彻底解决中文/emoji 乱码、存不进去的问题。
    </Paragraph>
    <Paragraph>
      在 <InlineCode>my.ini</InlineCode> 中确保有：
    </Paragraph>
    <CodeBlock
      language="ini"
      code={`[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci

[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4`}
    />
    <Table
      head={['配置', '段', '作用']}
      rows={[
        ['character-set-server', '[mysqld]', '新建库表的默认字符集'],
        ['collation-server', '[mysqld]', '默认排序规则（影响比较/排序）'],
        ['default-character-set', '[client]/[mysql]', '客户端发送/接收数据用的字符集'],
      ]}
    />
    <Paragraph>改完重启后，进 MySQL 验证：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW VARIABLES LIKE 'character%';`}
    />
    <Paragraph>
      <Text bold>期望结果（关键几行）：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`+--------------------------+--------------------+
| Variable_name            | Value              |
+--------------------------+--------------------+
| character_set_client     | utf8mb4            |
| character_set_connection | utf8mb4            |
| character_set_database   | utf8mb4            |
| character_set_results    | utf8mb4            |
| character_set_server     | utf8mb4            |
+--------------------------+--------------------+`}
    />
    <Callout type="danger" title="utf8 的历史坑">
      MySQL 里的 <InlineCode>utf8</InlineCode> 其实是 <InlineCode>utf8mb3</InlineCode>（每字符最多 3 字节），
      <Text bold>存不了 4 字节字符（如 emoji 😀、部分生僻字）</Text>，插入时报{' '}
      <InlineCode>Incorrect string value</InlineCode>。<Text bold>utf8mb4 才是真·完整 UTF-8</Text>，永远优先用它。MySQL 8.0 默认已是{' '}
      <InlineCode>utf8mb4</InlineCode>，老版本（5.7 及以前）建好习惯手动改。
    </Callout>

    <Heading3>8.2 端口（port）</Heading3>
    <Paragraph>
      <Text bold>目的</Text>：当 3306 被占用，或一台机器要装多个 MySQL 实例时，改端口。
    </Paragraph>
    <CodeBlock
      language="ini"
      code={`[mysqld]
port=3307`}
    />
    <Paragraph>改完重启服务。之后登录就要带上新端口：</Paragraph>
    <CodeBlock
      language="bash"
      code={`mysql -uroot -P 3307 -p`}
    />
    <Callout type="danger" title="怎么查端口是否被占用">
      <Paragraph>（管理员命令行）：</Paragraph>
      <CodeBlock
        language="bash"
        code={`netstat -ano | findstr 3306`}
      />
      <Paragraph>
        若有输出，最后一列是占用进程的 PID，再去任务管理器按 PID 定位是谁占的。3306 被占是「服务启动失败」的常见原因之一。
      </Paragraph>
    </Callout>

    <Heading3>8.3 最大连接数（max_connections）</Heading3>
    <Paragraph>
      <Text bold>目的</Text>：限制同时连接 MySQL 的客户端数量上限。默认 <Text bold>151</Text>，连接数多的应用容易顶满。
    </Paragraph>
    <CodeBlock
      language="ini"
      code={`[mysqld]
max_connections=300`}
    />
    <Paragraph>查看当前值与历史峰值：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SHOW VARIABLES LIKE 'max_connections';
SHOW STATUS LIKE 'Max_used_connections';`}
    />
    <Paragraph>
      <Text bold>结果示意：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`+-----------------+-------+        +----------------------+-------+
| Variable_name   | Value |        | Variable_name        | Value |
+-----------------+-------+        +----------------------+-------+
| max_connections | 300   |        | Max_used_connections | 27    |
+-----------------+-------+        +----------------------+-------+`}
    />
    <Callout type="danger" title="常见坑">
      应用报 <InlineCode>Too many connections</InlineCode>，就是连接数超过 <InlineCode>max_connections</InlineCode>{' '}
      了。临时可在线调（<InlineCode>SET GLOBAL max_connections=500;</InlineCode>{' '}
      立即生效但重启失效），永久要写进 my.ini。根因往往是<Text bold>连接没关闭/连接池配置不当</Text>，调大上限只是治标。
    </Callout>
    <Callout type="warning" title="注意">
      <InlineCode>max_connections</InlineCode> 别盲目调超大，每个连接都吃内存，调太大会拖垮内存。按实际并发量 + 适当余量来设。
    </Callout>
    <Callout type="tip" title="在线改 vs 改配置文件">
      很多参数能用 <InlineCode>SET GLOBAL 变量=值;</InlineCode> <Text bold>临时</Text>在线修改（无需重启，但
      <Text bold>重启即失效</Text>）；要<Text bold>永久</Text>生效必须写进 my.ini 并重启服务。两者配合：先{' '}
      <InlineCode>SET GLOBAL</InlineCode> 试效果，确认好了再落到 my.ini。
    </Callout>

    <Divider />

    <Subtitle>本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>安装两种方式</Text>：msi 向导式（推荐初学，自动注册服务）、zip 解压版（手动{' '}
        <InlineCode>my.ini</InlineCode> + <InlineCode>mysqld --initialize</InlineCode> +{' '}
        <InlineCode>mysqld --install</InlineCode>，能看清原理）。关键配置：
        <Text bold>端口 3306、root 密码（务必记住）、字符集 utf8mb4、注册为服务</Text>。
      </ListItem>
      <ListItem>
        <Text bold>安装后验证</Text>：<InlineCode>services.msc</InlineCode> 看服务在不在、
        <InlineCode>mysql --version</InlineCode> 看命令通不通；命令不通多半是 PATH 没配或没重开窗口。
      </ListItem>
      <ListItem>
        <Text bold>服务启停</Text>：三种方式——<InlineCode>services.msc</InlineCode> 图形、
        <InlineCode>net start/stop 服务名</InlineCode>（最常用）、<InlineCode>sc start/stop</InlineCode>。
        <Text bold>都需要管理员权限</Text>；服务名 8.0 常为 <InlineCode>MySQL80</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>登录退出</Text>：<InlineCode>mysql -h 主机 -P 端口 -u 用户 -p</InlineCode>；本机可简写为{' '}
        <InlineCode>mysql -uroot -p</InlineCode>。<Text bold>-P 是端口（大写）、-p 是密码（小写）</Text>。退出用{' '}
        <InlineCode>exit</InlineCode> / <InlineCode>quit</InlineCode> / <InlineCode>\q</InlineCode>，但退出客户端 ≠ 关服务。
      </ListItem>
      <ListItem>
        <Text bold>目录结构</Text>：<InlineCode>bin</InlineCode>（可执行：mysqld 服务端 / mysql 客户端）、
        <InlineCode>data</InlineCode>（真实数据，绝不手动改）、<InlineCode>my.ini</InlineCode>
        （核心配置：port/basedir/datadir/character-set-server）、<InlineCode>lib</InlineCode>、
        <InlineCode>share</InlineCode> 等。
      </ListItem>
      <ListItem>
        <Text bold>彻底卸载五步</Text>：停服务 → 控制面板卸载 →（zip 版 <InlineCode>sc delete</InlineCode> 删服务）→ 删 basedir 与 data 目录（
        <InlineCode>C:\ProgramData</InlineCode> 隐藏目录易漏）→ 清注册表 → 清环境变量。
        <Text bold>残留 data/服务是重装失败的头号原因</Text>。
      </ListItem>
      <ListItem>
        <Text bold>my.ini 常改三项</Text>：字符集（<InlineCode>character-set-server=utf8mb4</InlineCode>，避坑{' '}
        <InlineCode>utf8</InlineCode>≠完整 UTF-8）、端口（<InlineCode>port</InlineCode>，配合{' '}
        <InlineCode>netstat</InlineCode> 查占用）、最大连接数（<InlineCode>max_connections</InlineCode>，默认 151）。改完
        <Text bold>必须重启服务</Text>。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>Q1：mysqld 和 mysql 有什么区别？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>mysqld</InlineCode>（带 d，daemon）是<Text bold>服务端</Text>后台进程，真正存数据、执行 SQL；
      <InlineCode>mysql</InlineCode> 是<Text bold>客户端</Text>，你用它连服务端、敲 SQL。退出{' '}
      <InlineCode>mysql</InlineCode> 客户端不会关掉 <InlineCode>mysqld</InlineCode> 服务端。
    </Paragraph>
    <Paragraph>
      <Text bold>Q2：-P 和 -p 区别？</Text>
    </Paragraph>
    <Paragraph>
      A：大写 <InlineCode>-P</InlineCode> 指定<Text bold>端口</Text>（Port），小写 <InlineCode>-p</InlineCode>{' '}
      指定<Text bold>密码</Text>（password）。最易写反。
    </Paragraph>
    <Paragraph>
      <Text bold>Q3：MySQL 8.0 用 utf8 还是 utf8mb4？为什么？</Text>
    </Paragraph>
    <Paragraph>
      A：用 <Text bold>utf8mb4</Text>。因为 MySQL 的 <InlineCode>utf8</InlineCode> 实为{' '}
      <InlineCode>utf8mb3</InlineCode>，每字符最多 3 字节，<Text bold>存不了 emoji 和部分 4 字节字符</Text>；
      <InlineCode>utf8mb4</InlineCode> 才是完整 UTF-8。8.0 默认即 <InlineCode>utf8mb4</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q4：net start mysql 报「拒绝访问/系统错误 5」怎么办？</Text>
    </Paragraph>
    <Paragraph>A：没用管理员权限。以「管理员身份运行」命令行后重试。</Paragraph>
    <Paragraph>
      <Text bold>Q5：为什么卸载后重装老是失败？</Text>
    </Paragraph>
    <Paragraph>
      A：八成是 <Text bold>data 目录（常在 C:\ProgramData\MySQL 隐藏路径）或残留服务/注册表没删干净</Text>，新安装初始化时与旧残留冲突。按本章「彻底卸载五步」清理后再装。
    </Paragraph>
    <Paragraph>
      <Text bold>Q6：改了 my.ini 不生效？</Text>
    </Paragraph>
    <Paragraph>
      A：(1) 改的可能不是 MySQL 实际加载的那个 my.ini（用 <InlineCode>SHOW VARIABLES LIKE 'datadir'</InlineCode>{' '}
      或服务属性的 <InlineCode>--defaults-file</InlineCode> 确认真实路径）；(2) 改完<Text bold>没重启服务</Text>——配置文件改动必须{' '}
      <InlineCode>net stop</InlineCode> + <InlineCode>net start</InlineCode> 才生效。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：localhost 和 127.0.0.1 登录有区别吗？</Text>
    </Paragraph>
    <Paragraph>
      A：在 MySQL 里 <InlineCode>localhost</InlineCode> 默认走本地 socket/命名管道，<InlineCode>127.0.0.1</InlineCode>{' '}
      走 TCP。权限表里 <InlineCode>user@localhost</InlineCode> 与 <InlineCode>user@127.0.0.1</InlineCode>{' '}
      是不同的授权对象，少数场景两者行为不同，远程/本地连接调试时要留意。
    </Paragraph>
    <Paragraph>
      <Text bold>Q8：报 Too many connections 怎么处理？</Text>
    </Paragraph>
    <Paragraph>
      A：连接数超过 <InlineCode>max_connections</InlineCode>（默认 151）。临时{' '}
      <InlineCode>SET GLOBAL max_connections=更大值;</InlineCode>，永久写进 my.ini 重启。但要排查是否连接泄漏（没关连接），否则只是治标。
    </Paragraph>
  </article>
);

export default index;
