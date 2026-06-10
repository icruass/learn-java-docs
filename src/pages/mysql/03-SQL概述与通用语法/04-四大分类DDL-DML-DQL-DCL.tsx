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
    <Title>四大分类 DDL / DML / DQL / DCL</Title>

    <Subtitle>五、SQL 四大分类（核心地图）</Subtitle>
    <Paragraph>
      终于到了本章最重要的部分。SQL 语句虽然五花八门，但按
      <Text bold>"它到底在操作什么"</Text>，可以干净利落地分成
      <Text bold>四大类</Text>
      。把这四类搞清楚，你今后看任何一条 SQL，都能瞬间定位它"属于哪一类、在动哪样东西"。
    </Paragraph>
    <Paragraph>
      先记住这张"四口诀"——按<Text bold>操作对象</Text>区分：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>DDL</Text> 管 <Text bold>"结构"</Text>（库长什么样、表有哪些列）
      </ListItem>
      <ListItem>
        <Text bold>DML</Text> 管 <Text bold>"数据"</Text>{' '}
        的增删改（往表里塞数据、改数据、删数据）
      </ListItem>
      <ListItem>
        <Text bold>DQL</Text> 管 <Text bold>"数据"</Text> 的查询（把数据读出来看）
      </ListItem>
      <ListItem>
        <Text bold>DCL</Text> 管 <Text bold>"权限 / 用户"</Text>（谁能干什么）
      </ListItem>
    </UnorderedList>
    <Paragraph>下面逐一展开。</Paragraph>

    <Heading3>5.1 DDL —— 数据定义语言（Data Definition Language）</Heading3>
    <Paragraph>
      <Text bold>作用：定义和管理"数据库对象的结构"</Text>
      ，比如创建/修改/删除 数据库、表、视图、索引等。
      <Text bold>它动的是"骨架"，不是"数据"。</Text>
    </Paragraph>
    <Paragraph>
      <Text bold>核心关键字：</Text>
    </Paragraph>
    <Table
      head={['关键字', '含义', '通俗理解']}
      rows={[
        ['CREATE', '创建', '盖房子 / 打货架'],
        ['ALTER', '修改', '给房子加扇窗、给货架加一格'],
        ['DROP', '删除', '把整栋房子 / 整个货架拆掉'],
        ['TRUNCATE', '清空（表）', '货架还在，但货全倒空、编号归零'],
      ]}
    />
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- CREATE：创建数据库
CREATE DATABASE db_learn;

-- CREATE：创建一张部门表（定义结构：有哪些列、什么类型）
CREATE TABLE dept (
    id        INT PRIMARY KEY AUTO_INCREMENT,  -- 部门编号
    dept_name VARCHAR(20),                      -- 部门名称
    loc       VARCHAR(20)                       -- 所在城市
);

-- ALTER：给 dept 表新增一列"电话"
ALTER TABLE dept ADD phone VARCHAR(20);

-- DROP：删除整张表（连结构带数据一起没了）
DROP TABLE dept;

-- TRUNCATE：清空 emp 表的所有数据，但保留表结构（且自增主键归零）
TRUNCATE TABLE emp;`}
    />
    <Callout type="warning" title={"注意：DDL 操作通常\"不可回滚\"，下手要谨慎！"}>
      <Paragraph>
        在 MySQL 中，<InlineCode>CREATE</InlineCode>、<InlineCode>ALTER</InlineCode>、
        <InlineCode>DROP</InlineCode>、<InlineCode>TRUNCATE</InlineCode> 等 DDL 会
        <Text bold>隐式提交（implicit commit）</Text>，意味着你
        <Text bold>没法靠 <InlineCode>ROLLBACK</InlineCode> 撤销</Text>。
        <InlineCode>DROP TABLE emp;</InlineCode>{' '}
        一旦执行，表就真没了。生产环境执行 DDL 前，请务必三思、最好先备份。
      </Paragraph>
      <Paragraph>
        🕳️{' '}
        <Text bold>
          常见坑：<InlineCode>TRUNCATE</InlineCode> vs <InlineCode>DELETE</InlineCode>{' '}
          傻傻分不清。
        </Text>
      </Paragraph>
      <Paragraph>两者都能"清空表里的数据"，但本质不同：</Paragraph>
      <Table
        head={['对比项', 'TRUNCATE TABLE emp;', 'DELETE FROM emp;']}
        rows={[
          ['所属分类', 'DDL', 'DML'],
          ['原理', '直接"摧毁重建"表，几乎不逐行处理', '一行一行地删'],
          ['速度', '快（数据多时明显快）', '慢'],
          ['能否带 WHERE 条件删部分', '❌ 不能，只能全清', '✅ 能，可只删符合条件的行'],
          ['自增主键', '重置归零（下次从 1 开始）', '不重置（接着上次的值继续）'],
          ['能否 ROLLBACK 撤销', '❌ 不能', '✅ 能（在事务中）'],
        ]}
      />
      <Paragraph>
        一句话：要<Text bold>带条件删、想能反悔</Text>用 <InlineCode>DELETE</InlineCode>
        ；要<Text bold>整表秒清、不在乎主键归零</Text>用{' '}
        <InlineCode>TRUNCATE</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading3>5.2 DML —— 数据操作语言（Data Manipulation Language）</Heading3>
    <Paragraph>
      <Text bold>作用：对表里的"数据"进行增、改、删。</Text> 注意——它操作的是
      <Text bold>表中的记录（行）</Text>，<Text bold>不动表结构</Text>。
    </Paragraph>
    <Paragraph>
      <Text bold>核心关键字：</Text>
    </Paragraph>
    <Table
      head={['关键字', '含义', '通俗理解']}
      rows={[
        ['INSERT', '插入（增）', '往货架上放一件新货'],
        ['UPDATE', '更新（改）', '把货架上某件货的标签改一下'],
        ['DELETE', '删除（删）', '把货架上某件货拿走'],
      ]}
    />
    <Paragraph>
      <Text bold>示例（在 emp 表上操作）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- INSERT：新增一名员工
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus)
VALUES ('周八', '男', 7000, '2023-03-01', 1, 500);

-- UPDATE：给"张三"涨工资到 8500（⚠️ 一定要带 WHERE！）
UPDATE emp SET salary = 8500 WHERE ename = '张三';

-- DELETE：删除"周八"这条记录（⚠️ 一定要带 WHERE！）
DELETE FROM emp WHERE ename = '周八';`}
    />
    <Paragraph>
      <Text bold>执行后 emp 表状态变化示意（以 INSERT 后为例）：</Text>
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', 'join_date', 'dept_id', 'bonus']}
      rows={[
        ['1', '张三', '男', '8000', '2020-01-10', '1', '1000'],
        ['2', '李四', '男', '12000', '2019-03-15', '1', 'NULL'],
        ['3', '王五', '女', '9500', '2021-06-01', '2', '2000'],
        ['4', '赵六', '女', '6000', '2022-09-20', '2', 'NULL'],
        ['5', '孙七', '男', '15000', '2018-11-05', '3', '3000'],
        ['6', '周八', '男', '7000', '2023-03-01', '1', '500'],
      ]}
    />
    <Callout
      type="danger"
      title="致命坑：`UPDATE` / `DELETE` 不写 `WHERE`，全表遭殃！"
    >
      <CodeBlock
        language="sql"
        code={`UPDATE emp SET salary = 0;   -- 💀 没有 WHERE：所有人的工资全被改成 0！
DELETE FROM emp;             -- 💀 没有 WHERE：整张表的数据全没了！`}
      />
      <Paragraph>
        这是新手（乃至老手）最容易酿成事故的地方。养成习惯：
        <Text bold>
          写 <InlineCode>UPDATE</InlineCode> / <InlineCode>DELETE</InlineCode> 时，先把{' '}
          <InlineCode>WHERE</InlineCode> 条件写好，再回头补前面的部分。
        </Text>
      </Paragraph>
      <Paragraph>
        💡 <Text bold>提示：开启"安全模式"防误删。</Text> MySQL 客户端可设置{' '}
        <InlineCode>SET SQL_SAFE_UPDATES = 1;</InlineCode>，开启后，没带{' '}
        <InlineCode>WHERE</InlineCode>（或 <InlineCode>WHERE</InlineCode>{' '}
        未用到键/索引）的 <InlineCode>UPDATE</InlineCode>/<InlineCode>DELETE</InlineCode>{' '}
        会被直接拒绝执行，给你一道"保险"。
      </Paragraph>
    </Callout>

    <Heading3>5.3 DQL —— 数据查询语言（Data Query Language）</Heading3>
    <Paragraph>
      <Text bold>作用：查询数据，把表里的数据"读"出来给你看。</Text>{' '}
      关键字只有一个核心：<Text bold><InlineCode>SELECT</InlineCode></Text>（常配{' '}
      <InlineCode>FROM</InlineCode>、<InlineCode>WHERE</InlineCode>、
      <InlineCode>GROUP BY</InlineCode>、<InlineCode>ORDER BY</InlineCode>、
      <InlineCode>LIMIT</InlineCode> 等）。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 最简单的查询：查 emp 表所有行所有列
SELECT * FROM emp;

-- 带条件查询：工资大于 9000 的员工的姓名和工资
SELECT ename, salary
FROM   emp
WHERE  salary > 9000
ORDER BY salary DESC;`}
    />
    <Paragraph>
      <Text bold>第二条的执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary']}
      rows={[
        ['孙七', '15000'],
        ['李四', '12000'],
        ['王五', '9500'],
      ]}
    />
    <Callout type="tip" title="提示：为什么把 DQL 单独拎出来讲？">
      <Paragraph>
        严格按学术 / 标准定义，
        <Text bold>
          <InlineCode>SELECT</InlineCode> 其实属于 DML 的一部分
        </Text>
        （它也是"操作数据"嘛）。但在实际工作中，
        <Text bold>"查询"是使用频率最高、内容最丰富、最值得花时间钻研的一块</Text>——
        <InlineCode>WHERE</InlineCode> 条件、聚合函数、分组、排序、多表连接、子查询……
        复杂度远超增删改。
      </Paragraph>
      <Paragraph>
        所以教学和工程实践中，习惯把 <InlineCode>SELECT</InlineCode> 从 DML 里
        <Text bold>单独剥离</Text>出来，称为 <Text bold>DQL</Text>，给予"一等公民"待遇。本套教程后续会用
        <Text bold>整整好几章</Text>专门讲 DQL，足见其重要性。你只要记住：
        <Text bold>"DQL 本是 DML 的一部分，因太重要而被单列。"</Text>
      </Paragraph>
      <Paragraph>
        ⚠️{' '}
        <Text bold>
          注意：<InlineCode>SELECT</InlineCode> 不修改任何数据。
        </Text>{' '}
        它是"只读"的，无论你查多少次，表里的数据都纹丝不动。这点和 DML
        的增删改有本质区别。
      </Paragraph>
    </Callout>

    <Heading3>5.4 DCL —— 数据控制语言（Data Control Language）</Heading3>
    <Paragraph>
      <Text bold>
        作用：管理"数据库用户"和"权限"——即控制"谁，能对什么，做什么"。
      </Text>{' '}
      这是 DBA（数据库管理员）的活儿，普通开发用得少，但必须知道它的存在。
    </Paragraph>
    <Paragraph>
      <Text bold>核心关键字：</Text>
    </Paragraph>
    <Table
      head={['关键字', '含义', '通俗理解']}
      rows={[
        ['GRANT', '授予权限', '发一张"门禁卡 / 通行证"'],
        ['REVOKE', '收回权限', '把通行证收回作废'],
      ]}
    />
    <Paragraph>
      （广义上 <InlineCode>CREATE USER</InlineCode>、<InlineCode>DROP USER</InlineCode>、
      <InlineCode>ALTER USER</InlineCode>、设置密码等用户管理操作也常被归入 DCL
      范畴。）
    </Paragraph>
    <Paragraph>
      <Text bold>示例：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 创建一个新用户 zhangsan，密码 123456，仅允许从本机登录
CREATE USER 'zhangsan'@'localhost' IDENTIFIED BY '123456';

-- GRANT：授予 zhangsan 对 db_learn 库的"查询 + 插入"权限
GRANT SELECT, INSERT ON db_learn.* TO 'zhangsan'@'localhost';

-- REVOKE：收回 zhangsan 的"插入"权限（以后他只能查，不能插了）
REVOKE INSERT ON db_learn.* FROM 'zhangsan'@'localhost';

-- 刷新权限，使更改立即生效（MySQL 习惯做法）
FLUSH PRIVILEGES;`}
    />
    <Paragraph>
      <Text bold>效果示意：</Text>
    </Paragraph>
    <Table
      head={['操作前', '操作后（REVOKE INSERT 之后）']}
      rows={[
        ['zhangsan 能 SELECT、能 INSERT', 'zhangsan 只能 SELECT，INSERT 会被拒绝'],
      ]}
    />
    <Callout type="tip" title={"提示：DCL 是\"安全 / 运维\"范畴。"}>
      <Paragraph>
        作为应用开发者，你日常更多是用一个<Text bold>已经配好权限的账号</Text>
        去连数据库写业务 SQL，很少亲手敲 <InlineCode>GRANT</InlineCode>/
        <InlineCode>REVOKE</InlineCode>。但理解它能帮你看懂"为什么我这个账号执行某条 SQL
        会报 <InlineCode>command denied</InlineCode>（权限不足）"——多半就是 DCL
        层面没给你对应权限。
      </Paragraph>
      <Paragraph>
        ⚠️ <Text bold>注意：</Text> 不同 MySQL 版本里，创建用户和授权的语法细节略有差异（比如旧版可在{' '}
        <InlineCode>GRANT</InlineCode> 时顺带创建用户，新版推荐先{' '}
        <InlineCode>CREATE USER</InlineCode> 再 <InlineCode>GRANT</InlineCode>
        ）。这部分会在后续"用户与权限管理"章节细讲，此处只需建立"DCL 管权限"的概念。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>六、四大分类总结对照表（务必记牢）</Subtitle>
    <Paragraph>
      这张表是本章的"浓缩精华"，建议截图 / 抄下来反复看：
    </Paragraph>
    <Table
      head={['分类', '英文全称', '中文', '核心关键字', '操作对象', '一句话用途']}
      rows={[
        [
          'DDL',
          'Data Definition Language',
          '数据定义语言',
          'CREATE、ALTER、DROP、TRUNCATE',
          '数据库、表等结构（骨架）',
          '定义和管理库 / 表的结构',
        ],
        [
          'DML',
          'Data Manipulation Language',
          '数据操作语言',
          'INSERT、UPDATE、DELETE',
          '表中的数据（记录 / 行）',
          '对表里的数据进行增、改、删',
        ],
        [
          'DQL',
          'Data Query Language',
          '数据查询语言',
          'SELECT',
          '表中的数据（只读）',
          '把数据查询出来（本属 DML，因重要而单列）',
        ],
        [
          'DCL',
          'Data Control Language',
          '数据控制语言',
          'GRANT、REVOKE',
          '用户与权限',
          '控制谁能对数据库做什么',
        ],
      ]}
    />
    <Paragraph>
      <Text bold>记忆口诀：</Text>
    </Paragraph>
    <Callout type="note">
      <Text bold>
        D-定义改结构（DDL），M-改数据增删改（DML），Q-查询只读取（DQL），C-控制管权限（DCL）。
      </Text>
    </Callout>
    <Paragraph>
      或者更短：
      <Text bold>"DDL 改骨架，DML 改血肉，DQL 只看不动，DCL 管门禁。"</Text>
    </Paragraph>
    <Callout type="tip" title="提示：怎么快速判断一条 SQL 属于哪一类？">
      看它的<Text bold>第一个关键字（动词）</Text>就够了：
      <UnorderedList>
        <ListItem>
          <InlineCode>CREATE</InlineCode> / <InlineCode>ALTER</InlineCode> /{' '}
          <InlineCode>DROP</InlineCode> / <InlineCode>TRUNCATE</InlineCode> →{' '}
          <Text bold>DDL</Text>
        </ListItem>
        <ListItem>
          <InlineCode>INSERT</InlineCode> / <InlineCode>UPDATE</InlineCode> /{' '}
          <InlineCode>DELETE</InlineCode> → <Text bold>DML</Text>
        </ListItem>
        <ListItem>
          <InlineCode>SELECT</InlineCode> → <Text bold>DQL</Text>
        </ListItem>
        <ListItem>
          <InlineCode>GRANT</InlineCode> / <InlineCode>REVOKE</InlineCode> →{' '}
          <Text bold>DCL</Text>
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
