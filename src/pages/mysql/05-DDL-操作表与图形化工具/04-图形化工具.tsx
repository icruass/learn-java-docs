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
    <Title>图形化工具</Title>

    <Subtitle>8. 图形化工具：SQLyog / Navicat 等</Subtitle>
    <Paragraph>
      到目前为止我们都在「命令行」里敲 SQL。命令行最纯粹、最能锻炼基本功，但日常开发中，大家更常用
      <Text bold>图形化客户端</Text>（GUI）来连接和管理 MySQL，因为它<Text bold>直观、不易记错命令、能可视化看数据</Text>。
    </Paragraph>
    <Paragraph>常见图形化工具：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>SQLyog</Text>：轻量、专注 MySQL，老牌教学常用。
      </ListItem>
      <ListItem>
        <Text bold>Navicat</Text>：功能全、界面友好，商业软件（有试用）。
      </ListItem>
      <ListItem>
        <Text bold>DBeaver</Text>：免费开源、跨数据库（不止 MySQL）。
      </ListItem>
      <ListItem>
        <Text bold>MySQL Workbench</Text>：MySQL 官方出品，免费。
      </ListItem>
      <ListItem>
        <Text bold>DataGrip / IDEA 内置 Database 工具</Text>：JetBrains 系，写 Java 的同学常用。
      </ListItem>
    </UnorderedList>
    <Paragraph>它们的操作逻辑大同小异，下面以「SQLyog / Navicat 通用流程」讲解。</Paragraph>

    <Heading3>8.1 连接配置</Heading3>
    <Paragraph>
      打开工具，新建一个连接，本质上是填这几项参数（和命令行 <InlineCode>mysql -h... -P... -u... -p</InlineCode>{' '}
      一一对应）：
    </Paragraph>
    <Table
      head={['GUI 里的字段', '含义', '常见默认值', '对应命令行参数']}
      rows={[
        ['Host / 主机', '数据库服务器地址', 'localhost 或 127.0.0.1', '-h'],
        ['Port / 端口', 'MySQL 监听端口', '3306', '-P'],
        ['Username / 用户名', '登录账号', 'root', '-u'],
        ['Password / 密码', '登录密码', '安装时设置的密码', '-p'],
      ]}
    />
    <Paragraph>
      填好后点「测试连接 / Test Connection」，提示成功就能「连接 / Connect」。连上后，左侧会以
      <Text bold>树形结构</Text>列出：连接 → 数据库（库）→ 表 → 列。
    </Paragraph>
    <Callout type="danger">
      <Text bold>常见坑</Text>：
      <UnorderedList>
        <ListItem>
          连不上、报 <InlineCode>2003 - Can't connect</InlineCode>：多半是 MySQL
          服务没启动，或端口/主机填错，或防火墙拦了。
        </ListItem>
        <ListItem>
          报 <InlineCode>1045 - Access denied</InlineCode>：用户名或密码错了。
        </ListItem>
        <ListItem>
          远程连接报错：默认 <InlineCode>root</InlineCode> 可能只允许 <InlineCode>localhost</InlineCode>
          {' '}登录，需要授权远程访问（这是权限话题，后续章节讲）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8.2 可视化建库、建表</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>建库</Text>：在左侧空白处右键 → 「Create Database / 新建数据库」，弹出对话框，填库名（如{' '}
        <InlineCode>db_learn</InlineCode>）、选字符集（<InlineCode>utf8mb4</InlineCode>）、排序规则，点确定。
      </ListItem>
      <ListItem>
        <Text bold>建表</Text>：在某个库下右键 → 「Create Table / 新建表」，弹出一个<Text bold>表格界面</Text>
        ，你像填 Excel 一样一行行加列：填列名、下拉选数据类型、设长度、勾选「主键 / 非空 /
        自增」等。保存时让你输入表名。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      整个过程<Text bold>不用记 SQL 语法</Text>，鼠标点选即可。这就是 GUI 最大的好处——把第 3 节那些{' '}
      <InlineCode>CREATE TABLE</InlineCode> 语法变成了「填表格 + 打勾」。
    </Paragraph>

    <Heading3>8.3 执行 SQL、查看数据</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>写 SQL</Text>：工具里都有「Query / 查询编辑器」窗口，把 SQL 粘进去，点「执行（运行）」按钮（通常是
        F9 或 Ctrl+Enter），下方就显示结果集。
      </ListItem>
      <ListItem>
        <Text bold>看数据</Text>：双击左侧某张表，会直接以<Text bold>表格形式</Text>
        展示数据，可以直接在格子里改、加、删行（改完点保存）——底层照样转成{' '}
        <InlineCode>UPDATE</InlineCode>/<InlineCode>INSERT</InlineCode>/<InlineCode>DELETE</InlineCode>{' '}
        发给数据库。
      </ListItem>
    </UnorderedList>

    <Heading3>8.4 关键认知：图形操作的本质仍是「生成 SQL」</Heading3>
    <Paragraph>
      这是本节最想让你记住的一句话：<Text bold>所有图形化操作，最终都被工具翻译成 SQL 发给 MySQL 执行。</Text>{' '}
      鼠标点点点，只是工具替你「拼 SQL」而已。
    </Paragraph>
    <Paragraph>
      证据：当你用 GUI 可视化建完一张表后，工具通常提供「<Text bold>查看 SQL / Show SQL / SQL 预览</Text>
      」按钮，点开你会看到它生成的，正是和第 3 节一模一样的 <InlineCode>CREATE TABLE ...</InlineCode> 语句。
    </Paragraph>
    <Callout type="tip">
      <Paragraph>
        <Text bold>学习建议</Text>：
      </Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold>初学务必先用命令行 / 手写 SQL</Text>，把语法刻进脑子里。SQL
          是数据库的「普通话」，换任何工具、任何数据库（部分通用）都用得上；而 GUI
          的按钮位置各家不同，学了不通用。
        </ListItem>
        <ListItem>
          <Text bold>熟练后再用 GUI 提效</Text>：日常浏览数据、临时改几条记录、画 ER 图，GUI 又快又直观。
        </ListItem>
        <ListItem>
          <Text bold>善用 GUI 的「生成 SQL」反向学习</Text>：不会写某条 SQL 时，先用 GUI 点出来，再看它生成的
          SQL，是很好的学习方法。
        </ListItem>
      </OrderedList>
      <Paragraph>
        一句话：<Text bold>GUI 是「方向盘助力」，SQL 才是「发动机」</Text>。会开手动挡（命令行），再开自动挡（GUI）轻轻松松；反过来只会点鼠标，一旦上了没有
        GUI 的生产服务器（只能 SSH + 命令行）就抓瞎了。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>9. 本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>查表三件套</Text>：
        <UnorderedList>
          <ListItem>
            <InlineCode>SHOW TABLES;</InlineCode> 看当前库有哪些表；
          </ListItem>
          <ListItem>
            <InlineCode>DESC 表名;</InlineCode> 看精简结构（列名、类型、约束）；
          </ListItem>
          <ListItem>
            <InlineCode>SHOW CREATE TABLE 表名;</InlineCode> 看完整建表语句（含字符集、引擎、索引）。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>建表</Text>：<InlineCode>CREATE TABLE 表名(列名 类型 [约束], ...)</InlineCode>
        ，最后一列后不加逗号；有外键时<Text bold>先建被引用表</Text>。
      </ListItem>
      <ListItem>
        <Text bold>数据类型口诀</Text>：
        <UnorderedList>
          <ListItem>
            整数：默认 <InlineCode>INT</InlineCode>，超大 <InlineCode>BIGINT</InlineCode>，状态{' '}
            <InlineCode>TINYINT</InlineCode>；别用 <InlineCode>INT(11)</InlineCode> 那种宽度写法。
          </ListItem>
          <ListItem>
            小数：<Text bold>钱用 <InlineCode>DECIMAL</InlineCode></Text>（精确），
            <InlineCode>DOUBLE</InlineCode>/<InlineCode>FLOAT</InlineCode> 是近似值会丢精度。
          </ListItem>
          <ListItem>
            字符串：定长 <InlineCode>CHAR</InlineCode>（性别、代码），变长 <InlineCode>VARCHAR</InlineCode>
            （姓名、地址），超长 <InlineCode>TEXT</InlineCode>，二进制 <InlineCode>BLOB</InlineCode>
            ；手机号/身份证用 <InlineCode>VARCHAR</InlineCode>。
          </ListItem>
          <ListItem>
            日期：只要日期 <InlineCode>DATE</InlineCode>；要时间且范围大/存啥取啥 <InlineCode>DATETIME</InlineCode>
            ；要时区/自动更新且不过 2038 用 <InlineCode>TIMESTAMP</InlineCode>。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>删表</Text>：<InlineCode>DROP TABLE [IF EXISTS] 表名;</InlineCode>
        ；删表注意外键依赖<Text bold>先删引用方</Text>；分清 <InlineCode>DROP</InlineCode>（删表）/
        <InlineCode>TRUNCATE</InlineCode>（清空）/<InlineCode>DELETE</InlineCode>（按条件删数据）。
      </ListItem>
      <ListItem>
        <Text bold>改表 <InlineCode>ALTER TABLE</InlineCode></Text>：<InlineCode>RENAME TO</InlineCode>
        （改名）、<InlineCode>CHARACTER SET</InlineCode>（改字符集）、<InlineCode>ADD</InlineCode>（加列）、
        <InlineCode>CHANGE</InlineCode>（改名+类型，写两个列名）、<InlineCode>MODIFY</InlineCode>
        （只改类型，写一个列名）、<InlineCode>DROP</InlineCode>（删列）。
      </ListItem>
      <ListItem>
        <Text bold>复制表结构</Text>：<InlineCode>CREATE TABLE 新 LIKE 旧;</InlineCode>（结构+约束，不带数据）；
        <InlineCode>CREATE TABLE 新 AS SELECT ...;</InlineCode>（带数据，不带约束）。
      </ListItem>
      <ListItem>
        <Text bold>图形化工具</Text>：SQLyog/Navicat 等，连接 = 填
        主机/端口/用户名/密码；可视化建库建表、看改数据都很方便；但<Text bold>本质都是替你生成 SQL</Text>
        ，所以<Text bold>先练好 SQL 命令，再用 GUI 提效</Text>。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>10. 常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>Q1：<InlineCode>CHAR</InlineCode> 和 <InlineCode>VARCHAR</InlineCode> 有什么区别？什么时候用哪个？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>CHAR(n)</InlineCode> 定长，永远占 n 个字符，不足补空格，读取快但费空间，适合长度固定的（性别、国家码、MD5）；
      <InlineCode>VARCHAR(n)</InlineCode> 变长，实际多长占多长（额外 1~2
      字节记长度），省空间，适合长度不定的（姓名、地址）。规则：长度几乎不变用 <InlineCode>CHAR</InlineCode>
      ，否则用 <InlineCode>VARCHAR</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q2：存金额为什么不能用 <InlineCode>FLOAT</InlineCode>/<InlineCode>DOUBLE</InlineCode>？</Text>
    </Paragraph>
    <Paragraph>
      A：它们是二进制浮点数，是<Text bold>近似值</Text>，像 <InlineCode>0.1+0.2</InlineCode> 会得到{' '}
      <InlineCode>0.30000000000000004</InlineCode>，做金额累加会出现分厘误差。金额必须用{' '}
      <InlineCode>DECIMAL(M,D)</InlineCode>，它按十进制定点精确存储。Java 端对应 <InlineCode>BigDecimal</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q3：<InlineCode>DATETIME</InlineCode> 和 <InlineCode>TIMESTAMP</InlineCode> 区别？</Text>
    </Paragraph>
    <Paragraph>
      A：① 范围：<InlineCode>DATETIME</InlineCode> 1000~9999 年，<InlineCode>TIMESTAMP</InlineCode> 只到 2038
      年（有溢出问题）。② 时区：<InlineCode>TIMESTAMP</InlineCode> 受会话时区影响、读写会换算，
      <InlineCode>DATETIME</InlineCode> 存啥取啥与时区无关。③ 占用：<InlineCode>TIMESTAMP</InlineCode> 4 字节、
      <InlineCode>DATETIME</InlineCode> 8 字节。④ 两者都支持 <InlineCode>DEFAULT CURRENT_TIMESTAMP</InlineCode>{' '}
      和 <InlineCode>ON UPDATE CURRENT_TIMESTAMP</InlineCode> 自动维护时间。怕 2038、要自动更新用{' '}
      <InlineCode>TIMESTAMP</InlineCode>；范围大、要稳定用 <InlineCode>DATETIME</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q4：<InlineCode>ALTER TABLE</InlineCode> 里 <InlineCode>CHANGE</InlineCode> 和{' '}
      <InlineCode>MODIFY</InlineCode> 有啥不同？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>CHANGE</InlineCode> 能同时改<Text bold>列名和类型</Text>，语法要写两个列名（旧名 +
      新名）；<InlineCode>MODIFY</InlineCode> 只能改<Text bold>类型</Text>，写一个列名即可。只改类型用{' '}
      <InlineCode>MODIFY</InlineCode> 更省事。
    </Paragraph>
    <Paragraph>
      <Text bold>Q5：<InlineCode>DROP</InlineCode>、<InlineCode>TRUNCATE</InlineCode>、
      <InlineCode>DELETE</InlineCode> 三者区别？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>DROP TABLE</InlineCode> 删整张表（结构+数据全没，DDL）；<InlineCode>TRUNCATE TABLE</InlineCode>{' '}
      清空所有数据但保留空表结构（DDL，很快，不可加条件）；<InlineCode>DELETE FROM ... WHERE</InlineCode>{' '}
      删符合条件的数据行（DML，可回滚、可带条件，逐行删较慢）。
    </Paragraph>
    <Paragraph>
      <Text bold>Q6：手机号应该用什么类型？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>VARCHAR</InlineCode>（如 <InlineCode>VARCHAR(11)</InlineCode> 或{' '}
      <InlineCode>VARCHAR(20)</InlineCode>）。原因：手机号不参与算术运算、长度固定但可能有前导 0、且 11
      位会超出 <InlineCode>INT</InlineCode> 范围。同理身份证号、银行卡号都用字符串。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：<InlineCode>CREATE TABLE ... LIKE</InlineCode> 和{' '}
      <InlineCode>CREATE TABLE ... AS SELECT</InlineCode> 区别？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>LIKE</InlineCode> 复制完整结构（含主键、索引、约束）但<Text bold>不复制数据</Text>；
      <InlineCode>AS SELECT</InlineCode> 复制<Text bold>列和数据</Text>，但
      <Text bold>不复制主键、自增、索引、外键</Text>等约束。要纯结构用 <InlineCode>LIKE</InlineCode>
      ，要带数据用 <InlineCode>AS SELECT</InlineCode>（之后再手动补约束）。
    </Paragraph>
    <Paragraph>
      <Text bold>Q8：图形化工具操作和写 SQL 是两回事吗？</Text>
    </Paragraph>
    <Paragraph>
      A：不是。GUI 的所有「点选」最终都被翻译成 SQL
      发给数据库执行，很多工具还能让你「查看生成的 SQL」。所以学好 SQL 是根本，GUI 只是效率工具。
    </Paragraph>
  </article>
);

export default index;
