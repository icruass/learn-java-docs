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
    <Title>数据库的备份与还原</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        前面我们花了大量篇幅学习如何往数据库里建表、写数据、设计关系。但有一个问题始终悬在头上：
        <Text bold>万一数据没了怎么办？</Text>{' '}
        误删一张表、硬盘坏了、要把数据从一台机器搬到另一台、上线前想留个还原点……这些都离不开
        <Text bold>备份与还原</Text>。
      </Paragraph>
      <Paragraph>本章讲清楚：</Paragraph>
      <OrderedList>
        <ListItem>
          备份的本质是什么（答案：把数据库<Text bold>导出成一堆 SQL 语句</Text>）；
        </ListItem>
        <ListItem>
          用命令行工具 <InlineCode>mysqldump</InlineCode> 备份、用{' '}
          <InlineCode>source</InlineCode> / 重定向还原；
        </ListItem>
        <ListItem>用图形化工具（SQLyog/Navicat）一键备份还原；</ListItem>
        <ListItem>备份还原中最容易踩的坑（字符集、还原前要不要先建库）。</ListItem>
      </OrderedList>
      <Paragraph>
        这是一项「平时不起眼、出事救命」的运维技能。本章沿用统一示例库{' '}
        <InlineCode>db_learn</InlineCode>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、为什么要备份，备份的本质是什么</Subtitle>

    <Heading3>1.1 备份的场景</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>防误操作</Text>：一条没加 <InlineCode>WHERE</InlineCode> 的{' '}
        <InlineCode>DELETE</InlineCode>/<InlineCode>UPDATE</InlineCode>{' '}
        就能毁掉整张表（参见第 06 章的警示）。
      </ListItem>
      <ListItem>
        <Text bold>防故障</Text>：硬盘损坏、服务器宕机、机房断电。
      </ListItem>
      <ListItem>
        <Text bold>数据迁移</Text>：把开发库搬到测试库、把本地库搬到服务器。
      </ListItem>
      <ListItem>
        <Text bold>留还原点</Text>：上线前先备份，出问题能秒回滚。
      </ListItem>
    </UnorderedList>

    <Heading3>1.2 备份的本质</Heading3>
    <Paragraph>
      MySQL 最常用的逻辑备份，
      <Text bold>
        本质是把数据库"翻译"成一个 <InlineCode>.sql</InlineCode> 文本文件
      </Text>
      ，里面是一条条能重新建库建表、插入数据的 SQL：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 一个备份文件 db_learn.sql 内部大致长这样（节选）
DROP TABLE IF EXISTS \`dept\`;
CREATE TABLE \`dept\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`dept_name\` varchar(20) DEFAULT NULL,
  \`loc\` varchar(20) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`dept\` VALUES (1,'研发部','北京'),(2,'市场部','上海'),(3,'财务部','广州');
-- ... emp 表的 DROP/CREATE/INSERT ...`}
    />
    <Paragraph>
      所以<Text bold>还原</Text>就很自然了：把这个文件里的 SQL{' '}
      <Text bold>重新执行一遍</Text>，数据库就回来了。
    </Paragraph>

    <Callout type="tip">
      这种叫<Text bold>逻辑备份</Text>（导出 SQL）。还有一种<Text bold>物理备份</Text>
      （直接复制 data 目录下的数据文件），速度快但不跨版本/跨平台，初学阶段用逻辑备份即可。
    </Callout>

    <Divider />

    <Subtitle>二、命令行备份：mysqldump</Subtitle>
    <Paragraph>
      <InlineCode>mysqldump</InlineCode> 是 MySQL 自带的导出工具，
      <Text bold>
        注意它是一个独立命令，要在操作系统的命令行里运行，不是在 mysql 登录后的{' '}
        <InlineCode>&gt;</InlineCode> 提示符里运行
      </Text>
      （这是新手最常犯的错）。
    </Paragraph>

    <Heading3>2.1 基本语法</Heading3>
    <CodeBlock
      language="bash"
      code={`mysqldump -u 用户名 -p 数据库名 > 导出文件路径.sql`}
    />
    <UnorderedList>
      <ListItem>
        <InlineCode>-u</InlineCode>：用户名；<InlineCode>-p</InlineCode>：回车后输入密码；
      </ListItem>
      <ListItem>
        <InlineCode>数据库名</InlineCode>：要备份哪个库；
      </ListItem>
      <ListItem>
        <InlineCode>&gt;</InlineCode>：操作系统的「输出重定向」，把导出的内容写进文件；
      </ListItem>
      <ListItem>文件路径建议写绝对路径，否则文件会落在当前命令行所在目录。</ListItem>
    </UnorderedList>

    <Heading3>2.2 备份单个数据库</Heading3>
    <CodeBlock
      language="bash"
      code={`# 在 Windows cmd / PowerShell / Git Bash 里执行（不要先 mysql 登录）
mysqldump -u root -p db_learn > D:/backup/db_learn.sql`}
    />
    <Paragraph>
      回车后输入密码，命令执行完没有任何提示就是成功了，去{' '}
      <InlineCode>D:/backup/</InlineCode> 下能看到{' '}
      <InlineCode>db_learn.sql</InlineCode>。
    </Paragraph>

    <Heading3>2.3 其他常用形式</Heading3>
    <CodeBlock
      language="bash"
      code={`# 只备份指定的某几张表（库名后跟表名）
mysqldump -u root -p db_learn emp dept > D:/backup/emp_dept.sql

# 备份多个数据库（用 --databases，备份文件里会含 CREATE DATABASE 语句）
mysqldump -u root -p --databases db_learn db_shop > D:/backup/two_db.sql

# 备份所有数据库
mysqldump -u root -p --all-databases > D:/backup/all.sql

# 远程主机备份：-h 指定 IP，-P 指定端口
mysqldump -h 192.168.1.100 -P 3306 -u root -p db_learn > D:/backup/remote.sql`}
    />

    <Callout type="warning">
      <Paragraph>
        <Text bold>
          <InlineCode>--databases</InlineCode> 与不加的区别：
        </Text>
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>不加</Text> <InlineCode>--databases</InlineCode>
          ：备份文件里
          <Text bold>只有表的 DROP/CREATE/INSERT，没有 CREATE DATABASE</Text>
          。还原前你必须<Text bold>先手动建好库并 <InlineCode>USE</InlineCode> 它</Text>。
        </ListItem>
        <ListItem>
          <Text bold>加</Text> <InlineCode>--databases</InlineCode>
          ：备份文件里
          <Text bold>
            包含 <InlineCode>CREATE DATABASE</InlineCode> 和{' '}
            <InlineCode>USE</InlineCode>
          </Text>
          ，还原时会自动建库。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>三、命令行还原</Subtitle>
    <Paragraph>还原有两种主流方式。</Paragraph>

    <Heading3>3.1 方式一：登录后用 SOURCE 执行</Heading3>
    <CodeBlock
      language="bash"
      code={`# 1) 先用 mysql 登录
mysql -u root -p`}
    />
    <CodeBlock
      language="sql"
      code={`-- 2) 还原前：若备份文件不含 CREATE DATABASE，需先建库并切换进去
CREATE DATABASE IF NOT EXISTS db_learn CHARACTER SET utf8mb4;
USE db_learn;

-- 3) 用 source 执行备份脚本（路径用正斜杠，或在反斜杠路径外加引号）
SOURCE D:/backup/db_learn.sql;`}
    />
    <Paragraph>
      执行后会刷屏一堆 <InlineCode>Query OK</InlineCode>，表示一条条 SQL 在重放。
    </Paragraph>

    <Heading3>3.2 方式二：不登录，用输入重定向</Heading3>
    <CodeBlock
      language="bash"
      code={`# 还原前同样要先有空库（除非备份文件含 CREATE DATABASE）
# 这一步在命令行里完成建库：
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS db_learn CHARACTER SET utf8mb4;"

# 用 < 把 sql 文件喂给指定的库
mysql -u root -p db_learn < D:/backup/db_learn.sql`}
    />
    <UnorderedList>
      <ListItem>
        <InlineCode>&lt;</InlineCode> 是「输入重定向」，把文件内容当作输入交给 mysql 执行；
      </ListItem>
      <ListItem>
        如果备份是用 <InlineCode>--databases</InlineCode>{' '}
        导出的（含建库语句），可以省略库名：
        <CodeBlock
          language="bash"
          code={`mysql -u root -p < D:/backup/two_db.sql`}
        />
      </ListItem>
    </UnorderedList>

    <Heading3>3.3 两种方式对比</Heading3>
    <Table
      head={['方式', '是否需先登录', '是否需先建库', '适用']}
      rows={[
        ['SOURCE 文件;', '是（在 mysql 内）', '一般要（除非文件含建库语句）', '已经登录、交互式操作'],
        ['mysql ... < 文件', '否（在系统命令行）', '一般要', '脚本化、自动化还原'],
      ]}
    />

    <Divider />

    <Subtitle>四、图形化工具备份与还原（SQLyog / Navicat）</Subtitle>
    <Paragraph>
      图形界面的本质和命令行一样（底层就是调用 <InlineCode>mysqldump</InlineCode>{' '}
      或生成等价 SQL），只是点鼠标更直观。
    </Paragraph>

    <Heading3>4.1 SQLyog 备份</Heading3>
    <OrderedList>
      <ListItem>
        左侧右键点击要备份的数据库 <InlineCode>db_learn</InlineCode>；
      </ListItem>
      <ListItem>
        选择 <Text bold>「备份/导出」→「以 SQL 转储文件备份数据库」</Text>（Backup
        Database As SQL Dump）；
      </ListItem>
      <ListItem>勾选要导出的内容（结构 Structure / 数据 Data / 两者都要）；</ListItem>
      <ListItem>
        选择导出文件的保存路径，点 <Text bold>Export</Text>，完成后得到{' '}
        <InlineCode>.sql</InlineCode> 文件。
      </ListItem>
    </OrderedList>

    <Heading3>4.2 SQLyog 还原</Heading3>
    <OrderedList>
      <ListItem>先确保目标库存在（没有就新建一个空库）；</ListItem>
      <ListItem>
        右键库 → <Text bold>「导入」→「执行 SQL 脚本」</Text>（Import → Execute SQL
        Script）；
      </ListItem>
      <ListItem>
        选择之前导出的 <InlineCode>.sql</InlineCode> 文件，点执行即可。
      </ListItem>
    </OrderedList>
    <Paragraph>
      Navicat 操作类似：右键库 → 「运行 SQL 文件」还原，或「转储 SQL 文件」备份。
    </Paragraph>

    <Divider />

    <Subtitle>五、注意事项与常见坑</Subtitle>
    <UnorderedList>
      <ListItem>
        🕳️{' '}
        <Text bold>
          在哪执行 <InlineCode>mysqldump</InlineCode> 搞错
        </Text>
        ：<InlineCode>mysqldump</InlineCode> 是<Text bold>操作系统命令</Text>
        ，必须在 cmd/PowerShell/终端里运行；如果你已经{' '}
        <InlineCode>mysql -u root -p</InlineCode> 登进去了，在{' '}
        <InlineCode>mysql&gt;</InlineCode> 提示符里敲{' '}
        <InlineCode>mysqldump</InlineCode> 会报语法错。反之，
        <InlineCode>SOURCE</InlineCode> 是 mysql 内部命令，只能登录后用。
      </ListItem>
      <ListItem>
        🕳️ <Text bold>还原前没建库</Text>：用「不含 CREATE DATABASE」的备份文件还原时，必须
        <Text bold>
          先 <InlineCode>CREATE DATABASE</InlineCode> 再 <InlineCode>USE</InlineCode>
        </Text>
        ，否则报 <InlineCode>No database selected</InlineCode>。
      </ListItem>
      <ListItem>
        ⚠️ <Text bold>字符集要一致</Text>：备份与还原两端字符集不一致（比如一端{' '}
        <InlineCode>utf8</InlineCode>、一端 <InlineCode>utf8mb4</InlineCode>
        ）容易导致中文乱码。建库时统一用 <InlineCode>CHARACTER SET utf8mb4</InlineCode>{' '}
        最稳妥。
      </ListItem>
      <ListItem>
        ⚠️{' '}
        <Text bold>
          <InlineCode>mysqldump</InlineCode> 需要在 PATH 里
        </Text>
        ：如果提示「不是内部或外部命令」，说明 MySQL 的 <InlineCode>bin</InlineCode>{' '}
        目录没加进系统环境变量 PATH，用绝对路径调用（如{' '}
        <InlineCode>"C:/Program Files/MySQL/MySQL Server 8.0/bin/mysqldump"</InlineCode>
        ）或把 bin 加到 PATH（参见第 02 章）。
      </ListItem>
      <ListItem>
        💡 <Text bold>定时备份思路</Text>：把 <InlineCode>mysqldump</InlineCode> 命令写进{' '}
        <InlineCode>.bat</InlineCode> 脚本，用 Windows「任务计划程序」（或 Linux 的{' '}
        <InlineCode>crontab</InlineCode>
        ）定时执行，文件名带上日期，实现每日自动备份。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>六、本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>备份的本质</Text>：把数据库导出成一个由{' '}
        <InlineCode>CREATE</InlineCode>/<InlineCode>INSERT</InlineCode> 组成的{' '}
        <InlineCode>.sql</InlineCode> 脚本（逻辑备份）。
      </ListItem>
      <ListItem>
        <Text bold>备份命令</Text>：
        <InlineCode>mysqldump -u root -p 库名 &gt; 文件.sql</InlineCode>（在系统命令行执行，不是
        mysql 内部）。
      </ListItem>
      <ListItem>
        <Text bold>还原两法</Text>：
        <UnorderedList>
          <ListItem>
            登录后 <InlineCode>SOURCE 文件.sql;</InlineCode>
          </ListItem>
          <ListItem>
            不登录 <InlineCode>mysql -u root -p 库名 &lt; 文件.sql</InlineCode>
          </ListItem>
          <ListItem>
            <Text bold>两者通常都要先建好空库</Text>（除非备份用了{' '}
            <InlineCode>--databases</InlineCode>）。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>图形化工具</Text>：SQLyog/Navicat 右键即可备份/还原，底层等价于上述命令。
      </ListItem>
      <ListItem>
        <Text bold>关键坑</Text>：搞清 <InlineCode>mysqldump</InlineCode>
        （系统命令）与 <InlineCode>SOURCE</InlineCode>
        （mysql 内命令）的运行位置、还原前先建库、字符集统一为{' '}
        <InlineCode>utf8mb4</InlineCode>。
      </ListItem>
    </UnorderedList>
  </article>
);

export default index;
