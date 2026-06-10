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
    <Title>目录结构、配置文件与小结</Title>

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
