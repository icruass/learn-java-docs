import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>图形化工具与本章小结</Title>

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
