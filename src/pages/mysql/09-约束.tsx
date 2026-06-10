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
    <Title>约束：非空、唯一、主键、自增、外键与级联</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>前面几章我们已经会建表、会增删改查（CRUD）了。但你有没有想过这样几个问题：</Paragraph>
      <UnorderedList>
        <ListItem>
          如果有人往“员工姓名”这一列里插入了一个 <InlineCode>NULL</InlineCode>，业务上算不算“没有姓名的员工”？
        </ListItem>
        <ListItem>
          如果两个用户注册了<Text bold>完全相同</Text>的用户名，登录时该认哪一个？
        </ListItem>
        <ListItem>
          如果某条员工记录的 <InlineCode>dept_id</InlineCode> 写成了 <InlineCode>999</InlineCode>，可数据库里<Text bold>根本没有 999 这个部门</Text>，这条数据还有意义吗？
        </ListItem>
      </UnorderedList>
      <Paragraph>
        这些问题的本质是：<Text bold>光能存数据还不够，我们还要保证存进去的数据是“干净、正确、彼此一致”的</Text>。这就是「约束（Constraint）」要解决的事情。
      </Paragraph>
      <Paragraph>
        约束是数据库交给我们的“守门员”：它在数据<Text bold>写入的那一刻</Text>就帮我们把关，不符合规则的数据根本进不来。这比我们在 Java 代码里写一堆 <InlineCode>if</InlineCode> 判断要可靠得多——因为不管数据从哪条路（后台程序、运维手工 SQL、第三方导入脚本）进来，数据库这道关都拦得住。
      </Paragraph>
      <Paragraph>
        本章我们会从“为什么需要约束”讲起，依次讲透 <Text bold>非空、唯一、主键、自增、外键、级联</Text> 这六大主题。这是数据库设计的“地基课”，学完之后你回头看前面建的表，会发现它们其实是“裸奔”的——而本章就是给它们穿上护甲。下一章我们会进入“多表设计与三大范式”，到时候你会发现，<Text bold>外键约束正是多表关系落地的关键工具</Text>，所以本章一定要打牢。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>1. 约束概述：它到底是什么、为什么需要</Subtitle>

    <Heading3>1.1 一个类比：约束就是“表单的填写规则”</Heading3>
    <Paragraph>想象你去办银行卡，柜员递给你一张表单：</Paragraph>
    <UnorderedList>
      <ListItem>
        “姓名”一栏<Text bold>必须填</Text>（不能空着）——这就是 <Text bold>非空约束</Text>；
      </ListItem>
      <ListItem>
        “身份证号”一栏<Text bold>全国唯一，不能和别人重复</Text>——这就是 <Text bold>唯一约束</Text>；
      </ListItem>
      <ListItem>
        银行内部给你这张卡分配一个<Text bold>唯一的卡号</Text>，靠它就能精确定位到你这个人——这就是 <Text bold>主键约束</Text>；
      </ListItem>
      <ListItem>
        卡号是<Text bold>系统自动生成、一个接一个往后排</Text>的——这就是 <Text bold>自动增长</Text>；
      </ListItem>
      <ListItem>
        表单里有一栏“开户网点”，你只能从<Text bold>银行真实存在的网点列表里选</Text>，不能瞎写一个不存在的网点——这就是 <Text bold>外键约束</Text>；
      </ListItem>
      <ListItem>
        “账户状态”一栏你不填，系统<Text bold>默认填“正常”</Text>——这就是 <Text bold>默认约束</Text>；
      </ListItem>
      <ListItem>
        “年龄”一栏要求<Text bold>必须 ≥ 18</Text>，填个 5 岁系统直接拒绝——这就是 <Text bold>检查约束</Text>。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      <Paragraph>
        <Text bold>提示</Text>：约束（Constraint）= <Text bold>作用在表的列上的、用来限制数据的规则</Text>。它的核心目的只有一个——<Text bold>保证数据的完整性（Integrity）和正确性（Correctness）</Text>。
      </Paragraph>
      <Paragraph>所谓“完整性”，可以拆成三块来理解：</Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>实体完整性</Text>：表中每一行都能被唯一区分（靠主键 / 唯一）。
        </ListItem>
        <ListItem>
          <Text bold>域完整性</Text>：每一列的取值都在合理范围内（靠非空 / 默认 / 检查）。
        </ListItem>
        <ListItem>
          <Text bold>引用完整性</Text>：表与表之间的关联是“说得通”的，不会出现“引用了一个不存在的对象”（靠外键）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>1.2 约束的分类总览</Heading3>
    <Paragraph>MySQL 中常用的约束有以下几类，先有个全局印象，后面逐个展开：</Paragraph>
    <Table
      head={['约束', '关键字', '作用', '一句话记忆']}
      rows={[
        ['非空约束', 'NOT NULL', '列值不允许为 NULL', '“这一栏必须填”'],
        ['唯一约束', 'UNIQUE', '列值不允许重复', '“这一栏不许撞车”'],
        ['主键约束', 'PRIMARY KEY', '非空 且 唯一，行的唯一标识', '“身份证号，一表只有一个”'],
        ['自动增长', 'AUTO_INCREMENT', '主键值自动 +1 生成', '“排队取号机”'],
        ['外键约束', 'FOREIGN KEY', '维护两表之间的引用一致性', '“只能选真实存在的部门”'],
        ['默认约束', 'DEFAULT', '不填时使用默认值', '“不填就给你填个默认的”'],
        ['检查约束', 'CHECK（MySQL 8.0.16+ 真正生效）', '列值必须满足指定条件', '“年龄必须 ≥ 18”'],
      ]}
    />
    <Callout type="warning">
      <Text bold>注意</Text>：<InlineCode>CHECK</InlineCode> 约束在 <Text bold>MySQL 8.0.16 之前</Text>虽然语法上能写，但会被<Text bold>直接忽略</Text>（解析后丢弃），不报错也不生效，这是个经典的“坑”。从 8.0.16 开始才真正校验。本章以 8.0 为主，所有示例都在 8.0 环境下可执行。
    </Callout>

    <Heading3>1.3 准备公共示例库</Heading3>
    <Paragraph>
      本套教程统一使用 <InlineCode>db_learn</InlineCode> 数据库。本章主要围绕<Text bold>部门表 <InlineCode>dept</InlineCode></Text> 和<Text bold>员工表 <InlineCode>emp</InlineCode></Text>（一对多关系）展开。为了不影响前面章节已有的数据，我们后面会在“干净”的环境下逐步建表演示。先把库建好：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 如果还没有这个库，先创建它
CREATE DATABASE IF NOT EXISTS db_learn
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;

-- 切换到该库
USE db_learn;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.01 sec)   -- CREATE DATABASE
Database changed                       -- USE db_learn`}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：本章很多示例会“先建一个临时小表演示约束效果，再删掉”。为避免和正式的 <InlineCode>dept</InlineCode> / <InlineCode>emp</InlineCode> 冲突，演示用的临时表我会起名 <InlineCode>t_demo</InlineCode>、<InlineCode>t_user_demo</InlineCode> 之类。看到这种名字，就知道它只是“一次性演示道具”。
    </Callout>

    <Divider />

    <Subtitle>2. 非空约束 NOT NULL</Subtitle>

    <Heading3>2.1 是什么 / 为什么</Heading3>
    <Paragraph>
      <InlineCode>NOT NULL</InlineCode> 的含义非常直白：<Text bold>这一列的值不能为空（NULL）</Text>。
    </Paragraph>
    <Paragraph>这里要先澄清一个新手最容易混淆的点：</Paragraph>
    <Callout type="danger">
      <Paragraph>
        <Text bold>常见坑：<InlineCode>NULL</InlineCode> ≠ <InlineCode>0</InlineCode>，<InlineCode>NULL</InlineCode> ≠ 空字符串 <InlineCode>''</InlineCode></Text>
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <InlineCode>0</InlineCode> 是一个<Text bold>确定的数字</Text>；
        </ListItem>
        <ListItem>
          <InlineCode>''</InlineCode>（空字符串）是一个<Text bold>长度为 0 的、确定的字符串</Text>；
        </ListItem>
        <ListItem>
          <InlineCode>NULL</InlineCode> 表示<Text bold>“这个值未知 / 不存在 / 没填”</Text>，它什么都不是。
        </ListItem>
      </UnorderedList>
      <Paragraph>
        所以一个列即使加了 <InlineCode>NOT NULL</InlineCode>，你仍然可以往里插 <InlineCode>0</InlineCode> 或 <InlineCode>''</InlineCode>——因为它们都是“有值”的。<InlineCode>NOT NULL</InlineCode> 拦的只是“压根没值”这种情况。
      </Paragraph>
    </Callout>

    <Heading3>2.2 建表时添加非空约束</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    列名 数据类型 NOT NULL,
    ...
);`}
    />
    <Paragraph>
      <Text bold>逐项解释：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        把 <InlineCode>NOT NULL</InlineCode> 直接写在列定义的数据类型后面即可。
      </ListItem>
      <ListItem>
        一张表可以有任意多个 <InlineCode>NOT NULL</InlineCode> 列。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：</Text> 建一个演示表，要求“姓名 <InlineCode>ename</InlineCode> 必须填、性别 <InlineCode>gender</InlineCode> 必须填”：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

CREATE TABLE t_demo (
    id     INT,
    ename  VARCHAR(20) NOT NULL,   -- 姓名不能为空
    gender CHAR(1)     NOT NULL,   -- 性别不能为空
    salary DOUBLE                  -- 工资允许为空
);`}
    />
    <Paragraph>
      我们用 <InlineCode>DESC</InlineCode>（describe，描述表结构）看看效果：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DESC t_demo;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['Field', 'Type', 'Null', 'Key', 'Default', 'Extra']}
      rows={[
        ['id', 'int', 'YES', '', 'NULL', ''],
        ['ename', 'varchar(20)', 'NO', '', 'NULL', ''],
        ['gender', 'char(1)', 'NO', '', 'NULL', ''],
        ['salary', 'double', 'YES', '', 'NULL', ''],
      ]}
    />
    <Callout type="note">
      看 <InlineCode>Null</InlineCode> 这一列：<InlineCode>NO</InlineCode> 表示<Text bold>不允许为空</Text>，<InlineCode>YES</InlineCode> 表示<Text bold>允许为空</Text>。<InlineCode>ename</InlineCode>、<InlineCode>gender</InlineCode> 是 <InlineCode>NO</InlineCode>，符合预期。
    </Callout>

    <Heading3>2.3 插入 NULL 会报错（演示）</Heading3>
    <Paragraph>正常插入（都填了值）——成功：</Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_demo (id, ename, gender, salary) VALUES (1, '张三', '男', 8000);`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.00 sec)`}
    />
    <Paragraph>
      显式插入 <InlineCode>NULL</InlineCode> 到非空列——<Text bold>报错</Text>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_demo (id, ename, gender, salary) VALUES (2, NULL, '女', 9500);`}
    />
    <CodeBlock
      language="text"
      code={`ERROR 1048 (23000): Column 'ename' cannot be null`}
    />
    <Paragraph>
      “悄悄地”不写 <InlineCode>ename</InlineCode> 列——<Text bold>同样报错</Text>（因为非空列没有默认值时，相当于要插 <InlineCode>NULL</InlineCode>）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_demo (id, gender, salary) VALUES (3, '男', 6000);`}
    />
    <CodeBlock
      language="text"
      code={`ERROR 1364 (HY000): Field 'ename' doesn't have a default value`}
    />
    <Callout type="danger">
      <Text bold>常见坑</Text>：上面两种情况报的错误码不同（<InlineCode>1048</InlineCode> vs <InlineCode>1364</InlineCode>），但本质都是“非空列你没给值”。<InlineCode>1048</InlineCode> 是“你明确给了 NULL”，<InlineCode>1364</InlineCode> 是“你压根没提这一列，且它没默认值”。
    </Callout>

    <Heading3>2.4 建表后用 ALTER 添加 / 删除非空约束</Heading3>
    <Paragraph>
      表已经建好了，后来才想起来某列应该非空，可以用 <InlineCode>ALTER TABLE ... MODIFY</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>添加非空约束的语法：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE 表名 MODIFY 列名 数据类型 NOT NULL;`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 给 <InlineCode>t_demo</InlineCode> 的 <InlineCode>salary</InlineCode> 列补上非空约束：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE t_demo MODIFY salary DOUBLE NOT NULL;`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.02 sec)
Records: 1  Duplicates: 0  Warnings: 0`}
    />
    <Callout type="warning">
      <Text bold>注意</Text>：<InlineCode>MODIFY</InlineCode> 是<Text bold>整列重定义</Text>。也就是说，你写 <InlineCode>MODIFY salary DOUBLE NOT NULL</InlineCode>，必须把<Text bold>数据类型 <InlineCode>DOUBLE</InlineCode> 也带上</Text>，否则会丢失原来的类型信息。它不像“追加一个属性”，而是“把这一列从头到尾重新声明一遍”。
    </Callout>
    <Callout type="danger">
      <Text bold>常见坑</Text>：如果表里<Text bold>已经有数据</Text>，且某行的 <InlineCode>salary</InlineCode> 当前就是 <InlineCode>NULL</InlineCode>，那么这条 <InlineCode>MODIFY ... NOT NULL</InlineCode> 会<Text bold>失败</Text>，因为已有数据违反了新约束。要先把这些 <InlineCode>NULL</InlineCode> 数据补全（如 <InlineCode>UPDATE t_demo SET salary = 0 WHERE salary IS NULL;</InlineCode>）再加约束。
    </Callout>
    <Paragraph>
      <Text bold>删除非空约束（即改回允许为空）的语法</Text>——同样用 <InlineCode>MODIFY</InlineCode>，只是去掉 <InlineCode>NOT NULL</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE 表名 MODIFY 列名 数据类型 NULL;
-- 或者直接不写，等同于 NULL（允许为空）
ALTER TABLE 表名 MODIFY 列名 数据类型;`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 把 <InlineCode>salary</InlineCode> 改回允许为空：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE t_demo MODIFY salary DOUBLE NULL;`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.02 sec)
Records: 1  Duplicates: 0  Warnings: 0`}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：和后面要讲的唯一约束、主键不同，<Text bold>非空约束没有名字</Text>，所以删除它不能用 <InlineCode>DROP CONSTRAINT</InlineCode>，只能用 <InlineCode>MODIFY</InlineCode> 重定义这一列。记住这个区别。
    </Callout>
    <Paragraph>演示完毕，清理掉这张临时表：</Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP TABLE t_demo;`}
    />

    <Divider />

    <Subtitle>3. 唯一约束 UNIQUE</Subtitle>

    <Heading3>3.1 是什么 / 为什么</Heading3>
    <Paragraph>
      <InlineCode>UNIQUE</InlineCode> 约束保证<Text bold>某一列（或几列的组合）的值不能重复</Text>。典型场景：用户名、手机号、身份证号、邮箱——这些字段在业务上天然要求“一人一个，不许撞”。
    </Paragraph>

    <Heading3>3.2 建表时添加唯一约束</Heading3>
    <Paragraph>唯一约束有两种写法，效果一样：</Paragraph>
    <Paragraph>
      <Text bold>写法一（列级，写在列后面）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    列名 数据类型 UNIQUE,
    ...
);`}
    />
    <Paragraph>
      <Text bold>写法二（表级，单独一行，可以起名字）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    列名 数据类型,
    ...,
    CONSTRAINT 约束名 UNIQUE (列名)
);`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 建一个用户演示表，要求用户名 <InlineCode>username</InlineCode> 唯一：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

CREATE TABLE t_user_demo (
    id       INT,
    username VARCHAR(32),
    phone    VARCHAR(20),
    -- 给唯一约束起个名字，方便以后删除；约束名习惯用 uk_ 开头(unique key)
    CONSTRAINT uk_username UNIQUE (username)
);`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected (0.03 sec)`}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：约束起名字是个好习惯。<InlineCode>uk_xxx</InlineCode>（unique key）、<InlineCode>pk_xxx</InlineCode>（primary key）、<InlineCode>fk_xxx</InlineCode>（foreign key）是常见的命名前缀。<Text bold>起了名字，删除时就能精确指定要删哪个。</Text>
    </Callout>

    <Heading3>3.3 唯一约束生效演示</Heading3>
    <Paragraph>插入第一条——成功：</Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_user_demo (id, username, phone) VALUES (1, 'zhangsan', '13800000001');`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.00 sec)`}
    />
    <Paragraph>
      再插入一个<Text bold>相同的</Text> <InlineCode>username</InlineCode>——<Text bold>报错</Text>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_user_demo (id, username, phone) VALUES (2, 'zhangsan', '13800000002');`}
    />
    <CodeBlock
      language="text"
      code={`ERROR 1062 (23000): Duplicate entry 'zhangsan' for key 't_user_demo.uk_username'`}
    />
    <Callout type="note">
      错误信息里 <InlineCode>Duplicate entry 'zhangsan' for key 'uk_username'</InlineCode> 直接告诉你：是 <InlineCode>uk_username</InlineCode> 这个唯一键发现了重复值 <InlineCode>zhangsan</InlineCode>。
    </Callout>

    <Heading3>3.4 重点：UNIQUE 列允许多个 NULL</Heading3>
    <Paragraph>
      这是一个<Text bold>反直觉但极其重要</Text>的知识点：
    </Paragraph>
    <Callout type="note">
      ⭐ <Text bold>唯一约束允许出现多个 <InlineCode>NULL</InlineCode>。</Text>
    </Callout>
    <Paragraph>
      为什么？回到 <InlineCode>NULL</InlineCode> 的本质——它表示“未知”。两个“未知”之间，数据库<Text bold>无法判断它们是否相等</Text>（在 SQL 标准里，<InlineCode>NULL = NULL</InlineCode> 的结果不是 <InlineCode>TRUE</InlineCode>，而是 <InlineCode>NULL</InlineCode>/未知）。既然没法判定它们“相等”，那就<Text bold>不算重复</Text>，于是多个 <InlineCode>NULL</InlineCode> 可以共存。
    </Paragraph>
    <Paragraph>
      <Text bold>演示：</Text> 给 <InlineCode>phone</InlineCode> 也加个唯一约束，然后插入多条 <InlineCode>phone</InlineCode> 为 <InlineCode>NULL</InlineCode> 的数据：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 先给 phone 列追加唯一约束(下一节会专门讲 ALTER 加唯一约束)
ALTER TABLE t_user_demo ADD CONSTRAINT uk_phone UNIQUE (phone);

INSERT INTO t_user_demo (id, username, phone) VALUES (3, 'lisi',  NULL);
INSERT INTO t_user_demo (id, username, phone) VALUES (4, 'wangwu', NULL);`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.00 sec)   -- id=3
Query OK, 1 row affected (0.00 sec)   -- id=4，两个 NULL 都能插进去！`}
    />
    <Paragraph>查询确认：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT * FROM t_user_demo;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'username', 'phone']}
      rows={[
        ['1', 'zhangsan', '13800000001'],
        ['3', 'lisi', 'NULL'],
        ['4', 'wangwu', 'NULL'],
      ]}
    />
    <Callout type="note">
      <Paragraph>
        看到了吗？<InlineCode>id=3</InlineCode> 和 <InlineCode>id=4</InlineCode> 的 <InlineCode>phone</InlineCode> 都是 <InlineCode>NULL</InlineCode>，<Text bold>并不冲突</Text>。
      </Paragraph>
      <Paragraph>
        <Text bold>常见坑</Text>：很多人以为“唯一就是从头到尾不能有两个一样的值”，于是被多个 <InlineCode>NULL</InlineCode> 能共存搞懵。记住口诀：<Text bold>唯一约束只管“有值的”不许重复，对 <InlineCode>NULL</InlineCode> 网开一面。</Text> 如果业务上确实要求“最多一个空都不行”，应该给这列同时加 <InlineCode>NOT NULL</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading3>3.5 建表后添加唯一约束</Heading3>
    <Paragraph>
      <Text bold>语法（两种写法）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 写法一：ALTER ... ADD CONSTRAINT（推荐，能起名字）
ALTER TABLE 表名 ADD CONSTRAINT 约束名 UNIQUE (列名);

-- 写法二：ALTER ... ADD UNIQUE（不起名字，MySQL 自动命名，通常就是列名)
ALTER TABLE 表名 ADD UNIQUE (列名);`}
    />
    <Paragraph>
      上一节我们已经用过写法一给 <InlineCode>phone</InlineCode> 加约束了，这里不再重复。
    </Paragraph>

    <Heading3>3.6 删除唯一约束（重点：用 DROP INDEX）</Heading3>
    <Callout type="warning">
      <Text bold>注意（本节最大的坑）：删除唯一约束，用的是 <InlineCode>DROP INDEX</InlineCode>，不是 <InlineCode>DROP CONSTRAINT</InlineCode>！</Text>
    </Callout>
    <Paragraph>
      为什么？因为在 MySQL 中，<Text bold>唯一约束在底层是通过“唯一索引（Unique Index）”实现的</Text>。你创建一个 <InlineCode>UNIQUE</InlineCode> 约束，MySQL 实际上是建了一个唯一索引。所以删除它，本质是删除这个索引。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE 表名 DROP INDEX 约束名/索引名;`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 删除 <InlineCode>username</InlineCode> 上的唯一约束（它的名字是我们建表时起的 <InlineCode>uk_username</InlineCode>）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE t_user_demo DROP INDEX uk_username;`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0`}
    />
    <Paragraph>
      删除后，再插入重复的 <InlineCode>username</InlineCode> 就不会报错了：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_user_demo (id, username, phone) VALUES (5, 'lisi', '13800000005');
-- 此时已有 id=3 的 lisi，因为约束已删，这条也能成功`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.00 sec)`}
    />
    <Callout type="tip">
      <Paragraph>
        <Text bold>提示：如果不记得约束 / 索引的名字怎么办？</Text> 用下面这条命令查看一张表上的所有索引：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`SHOW INDEX FROM t_user_demo;`}
      />
      <Paragraph>
        在结果中 <InlineCode>Key_name</InlineCode> 列就是索引名（也就是删除时要写的名字）；<InlineCode>Non_unique</InlineCode> 为 <InlineCode>0</InlineCode> 表示这是唯一索引。
      </Paragraph>
      <Paragraph>
        <Text bold>常见坑</Text>：如果你建唯一约束时<Text bold>没起名字</Text>（用了 <InlineCode>ADD UNIQUE (phone)</InlineCode>），MySQL 会用<Text bold>列名</Text>作为索引名（这里就是 <InlineCode>phone</InlineCode>）。如果一列上有多个索引，第二个会自动加后缀变成 <InlineCode>phone_2</InlineCode>。删除前用 <InlineCode>SHOW INDEX</InlineCode> 确认名字最稳妥。
      </Paragraph>
    </Callout>
    <Paragraph>清理演示表：</Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP TABLE t_user_demo;`}
    />

    <Divider />

    <Subtitle>4. 主键约束 PRIMARY KEY</Subtitle>

    <Heading3>4.1 是什么 / 为什么</Heading3>
    <Paragraph>
      主键（Primary Key）是一张表的<Text bold>“行的唯一标识”</Text>——就像每个人的身份证号，靠它能精确、唯一地定位到表中的某一行。
    </Paragraph>
    <Paragraph>主键有三条铁律：</Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>非空</Text>（<InlineCode>NOT NULL</InlineCode>）：主键列不能有 <InlineCode>NULL</InlineCode>（因为“未知”的东西没法当身份标识）。
      </ListItem>
      <ListItem>
        <Text bold>唯一</Text>（<InlineCode>UNIQUE</InlineCode>）：主键值不能重复（否则定位不到唯一一行）。
      </ListItem>
      <ListItem>
        <Text bold>一张表只能有一个主键</Text>（但一个主键可以由多列组成，叫“联合主键”）。
      </ListItem>
    </OrderedList>
    <Callout type="tip">
      <Text bold>提示</Text>：你可以把主键理解为 <InlineCode>NOT NULL</InlineCode> + <InlineCode>UNIQUE</InlineCode> 的“合体加强版”，再加上“一表一个”的限制。所以主键列<Text bold>天然就是非空且唯一的</Text>，不用再额外加这两个约束。
    </Callout>

    <Heading3>4.2 建表时添加主键</Heading3>
    <Paragraph>
      <Text bold>写法一（列级）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    列名 数据类型 PRIMARY KEY,
    ...
);`}
    />
    <Paragraph>
      <Text bold>写法二（表级，可起名 / 可做联合主键）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    列名 数据类型,
    ...,
    PRIMARY KEY (列名)            -- 联合主键就写 PRIMARY KEY (列1, 列2)
);`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 这正是我们公共示例库里 <InlineCode>dept</InlineCode> 表的雏形，先用列级写法建一个简化版演示：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

CREATE TABLE t_demo (
    id        INT PRIMARY KEY,   -- id 作为主键：非空且唯一
    dept_name VARCHAR(20)
);

DESC t_demo;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['Field', 'Type', 'Null', 'Key', 'Default', 'Extra']}
      rows={[
        ['id', 'int', 'NO', 'PRI', 'NULL', ''],
        ['dept_name', 'varchar(20)', 'YES', '', 'NULL', ''],
      ]}
    />
    <Callout type="note">
      <InlineCode>Key</InlineCode> 列出现 <InlineCode>PRI</InlineCode>（primary），同时 <InlineCode>Null</InlineCode> 自动变成了 <InlineCode>NO</InlineCode>——这印证了“主键自带非空”。
    </Callout>

    <Heading3>4.3 主键生效演示</Heading3>
    <Paragraph>插入正常数据：</Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_demo (id, dept_name) VALUES (1, '研发部');`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.00 sec)`}
    />
    <Paragraph>
      插入<Text bold>重复主键</Text>——报错（违反唯一性）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_demo (id, dept_name) VALUES (1, '市场部');`}
    />
    <CodeBlock
      language="text"
      code={`ERROR 1062 (23000): Duplicate entry '1' for key 't_demo.PRIMARY'`}
    />
    <Paragraph>
      插入 <Text bold>主键为 NULL</Text>——报错（违反非空性）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO t_demo (id, dept_name) VALUES (NULL, '财务部');`}
    />
    <CodeBlock
      language="text"
      code={`ERROR 1048 (23000): Column 'id' cannot be null`}
    />
    <Callout type="note">
      注意主键的索引名固定叫 <InlineCode>PRIMARY</InlineCode>（错误信息里 <InlineCode>for key 't_demo.PRIMARY'</InlineCode>）。
    </Callout>

    <Heading3>4.4 建表后添加 / 删除主键</Heading3>
    <Paragraph>
      <Text bold>添加主键的语法：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE 表名 ADD PRIMARY KEY (列名);`}
    />
    <Paragraph>
      <Text bold>删除主键的语法（主键只有一个，所以不用指定名字）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE 表名 DROP PRIMARY KEY;`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 先建一个没有主键的表，再用 <InlineCode>ALTER</InlineCode> 加上、删掉：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 1) 建一个无主键的表
CREATE TABLE t_demo2 (
    id   INT,
    name VARCHAR(20)
);

-- 2) 后期补上主键
ALTER TABLE t_demo2 ADD PRIMARY KEY (id);`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected (0.03 sec)`}
    />
    <CodeBlock
      language="sql"
      code={`-- 3) 删除主键
ALTER TABLE t_demo2 DROP PRIMARY KEY;`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected (0.02 sec)`}
    />
    <Callout type="danger">
      <Paragraph>
        <Text bold>常见坑 1</Text>：如果一张表的主键列同时带有 <InlineCode>AUTO_INCREMENT</InlineCode>（自增），那么<Text bold>不能直接 <InlineCode>DROP PRIMARY KEY</InlineCode></Text>，会报错：
      </Paragraph>
      <CodeBlock
        language="text"
        code={`ERROR 1075 (42000): Incorrect table definition; there can be only one auto column and it must be defined as a key`}
      />
      <Paragraph>
        因为 MySQL 规定“自增列必须是键”。要先用 <InlineCode>MODIFY</InlineCode> 去掉 <InlineCode>AUTO_INCREMENT</InlineCode>，再删主键。
      </Paragraph>
      <Paragraph>
        <Text bold>常见坑 2</Text>：用 <InlineCode>ALTER TABLE ... ADD PRIMARY KEY (id)</InlineCode> 添加主键时，如果 <InlineCode>id</InlineCode> 列<Text bold>已有重复值或 NULL</Text>，会失败。必须先把数据清理干净。
      </Paragraph>
    </Callout>
    <Paragraph>清理：</Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP TABLE t_demo, t_demo2;`}
    />

    <Divider />

    <Subtitle>5. 主键自动增长 AUTO_INCREMENT</Subtitle>

    <Heading3>5.1 是什么 / 为什么</Heading3>
    <Paragraph>
      每张表都需要主键，但每次插入时手动想一个“不重复的 id”太麻烦了。<InlineCode>AUTO_INCREMENT</InlineCode>（自动增长）就是让数据库<Text bold>自动帮我们生成一个不断递增的整数主键</Text>——就像取号机，每来一个新客户就吐一个比上一个大 1 的号码。
    </Paragraph>
    <Callout type="warning">
      <Text bold>注意</Text>：<InlineCode>AUTO_INCREMENT</InlineCode> 必须用在<Text bold>整数类型</Text>的列上，并且这一列<Text bold>必须是键</Text>（通常就是主键）。它几乎总是和 <InlineCode>PRIMARY KEY</InlineCode> 搭配出现。
    </Callout>

    <Heading3>5.2 基本用法</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 表名 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ...
);`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 这就是我们公共示例库标准的 <InlineCode>dept</InlineCode> 表！现在正式建出来：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

-- 如果之前练习时建过，先删掉重来（保证干净）
DROP TABLE IF EXISTS emp;     -- emp 引用了 dept，必须先删 emp(后面外键章节会讲原因)
DROP TABLE IF EXISTS dept;

CREATE TABLE dept (
    id        INT PRIMARY KEY AUTO_INCREMENT,   -- 部门编号，自增主键
    dept_name VARCHAR(20),                        -- 部门名称
    loc       VARCHAR(20)                         -- 所在城市
);`}
    />
    <Paragraph>
      插入时<Text bold>省略主键</Text>（或写 <InlineCode>NULL</InlineCode> / <InlineCode>DEFAULT</InlineCode>），让它自动生成：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO dept (dept_name, loc) VALUES
    ('研发部', '北京'),
    ('市场部', '上海'),
    ('财务部', '广州');

SELECT * FROM dept;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'dept_name', 'loc']}
      rows={[
        ['1', '研发部', '北京'],
        ['2', '市场部', '上海'],
        ['3', '财务部', '广州'],
      ]}
    />
    <Callout type="note">
      我们没填 <InlineCode>id</InlineCode>，MySQL 自动从 <Text bold>1 开始</Text>，依次给了 1、2、3。
    </Callout>

    <Heading3>5.3 重点：删除行不会“回填”空缺</Heading3>
    <Callout type="note">
      ⭐ <Text bold>自增值只增不减。删掉中间的行，腾出来的号也不会被重新用。</Text>
    </Callout>
    <Paragraph>
      <Text bold>演示：</Text> 删掉 <InlineCode>id=3</InlineCode> 的部门，再插入一条新部门：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DELETE FROM dept WHERE id = 3;          -- 删掉财务部(id=3)

INSERT INTO dept (dept_name, loc) VALUES ('人事部', '深圳');

SELECT * FROM dept;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'dept_name', 'loc']}
      rows={[
        ['1', '研发部', '北京'],
        ['2', '市场部', '上海'],
        ['4', '人事部', '深圳'],
      ]}
    />
    <Callout type="note">
      新插入的“人事部”拿到的是 <Text bold>4，而不是 3</Text>！数据库内部维护了一个“下一个自增值”的计数器，删除行<Text bold>不会让它回退</Text>。这保证了主键的“永不重复”，但也意味着 <Text bold>id 可能不连续</Text>——这是正常现象，不要试图去“补洞”。
    </Callout>
    <Callout type="danger">
      <Paragraph>
        <Text bold>常见坑：<InlineCode>TRUNCATE</InlineCode> 会重置计数器，<InlineCode>DELETE</InlineCode> 不会。</Text>
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <InlineCode>DELETE FROM dept;</InlineCode>（删所有行）后再插入，自增值<Text bold>接着之前的最大值往后排</Text>。
        </ListItem>
        <ListItem>
          <InlineCode>TRUNCATE TABLE dept;</InlineCode>（清空表）后再插入，自增值<Text bold>重新从 1 开始</Text>。
        </ListItem>
      </UnorderedList>
      <Paragraph>把上面这张表恢复成标准的三个部门（删掉演示加的人事部，并手动补回财务部）：</Paragraph>
      <CodeBlock
        language="sql"
        code={`DELETE FROM dept WHERE id = 4;                          -- 删掉演示的人事部
INSERT INTO dept (id, dept_name, loc) VALUES (3, '财务部', '广州');  -- 显式指定 id=3 补回`}
      />
      <Paragraph>
        是的，你<Text bold>可以手动指定自增列的值</Text>（显式写 <InlineCode>id</InlineCode>），MySQL 会接受；并且如果你指定的值比当前计数器还大，计数器还会“跳”到这个值之后。
      </Paragraph>
    </Callout>

    <Heading3>5.4 指定自增的起始值</Heading3>
    <Paragraph>默认从 1 开始。如果想从别的值开始（比如订单号从 10000 起），有两种方式：</Paragraph>
    <Paragraph>
      <Text bold>方式一：建表时用表选项 <InlineCode>AUTO_INCREMENT=</InlineCode>：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE t_order_demo (
    id   INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(50)
) AUTO_INCREMENT = 10000;          -- 起始值设为 10000

INSERT INTO t_order_demo (title) VALUES ('第一笔订单');
SELECT * FROM t_order_demo;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'title']}
      rows={[['10000', '第一笔订单']]}
    />
    <Paragraph>
      <Text bold>方式二：建表后用 <InlineCode>ALTER</InlineCode> 修改起始值：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE t_order_demo AUTO_INCREMENT = 20000;
INSERT INTO t_order_demo (title) VALUES ('又一笔订单');
SELECT * FROM t_order_demo;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'title']}
      rows={[
        ['10000', '第一笔订单'],
        ['20000', '又一笔订单'],
      ]}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：<InlineCode>ALTER TABLE ... AUTO_INCREMENT = N</InlineCode> 只能把计数器<Text bold>往大调</Text>，不能调到比当前已有最大值还小的数（否则 MySQL 会自动忽略，仍从安全值继续）。
    </Callout>
    <Paragraph>清理：</Paragraph>
    <CodeBlock
      language="sql"
      code={`DROP TABLE t_order_demo;`}
    />

    <Heading3>5.5 与 JDBC 的联系（拓展）</Heading3>
    <Paragraph>
      实际开发中，自增主键插入后，我们常常需要<Text bold>拿到刚生成的那个 id</Text>（比如插入订单后要把订单明细关联上去）。在 JDBC 里可以这样取回：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`String sql = "INSERT INTO dept (dept_name, loc) VALUES (?, ?)";
// 关键：第二个参数告诉驱动“我要拿回自动生成的主键”
try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, "测试部");
    ps.setString(2, "杭州");
    ps.executeUpdate();

    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (keys.next()) {
            long newId = keys.getLong(1);   // 这就是数据库自动生成的 id
            System.out.println("新部门的 id = " + newId);
        }
    }
}`}
    />
    <Callout type="tip">
      这段代码会在后续 JDBC 章节详细展开，这里先建立“自增主键 ↔ <InlineCode>getGeneratedKeys()</InlineCode>”的印象即可。
    </Callout>

    <Divider />

    <Subtitle>6. 外键约束 FOREIGN KEY</Subtitle>

    <Heading3>6.1 是什么 / 为什么</Heading3>
    <Paragraph>
      到目前为止，我们讲的约束都作用在<Text bold>单张表内部</Text>。而<Text bold>外键（Foreign Key）是用来维护两张表之间关系一致性的</Text>——这是它和前面所有约束最大的不同。
    </Paragraph>
    <Paragraph>
      回到我们的业务：一个部门有多个员工，每个员工属于一个部门（<Text bold>一对多</Text>）。员工表 <InlineCode>emp</InlineCode> 用一个 <InlineCode>dept_id</InlineCode> 列来记录“我属于哪个部门”，它的值应该对应 <InlineCode>dept</InlineCode> 表里某个真实存在的 <InlineCode>id</InlineCode>。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>dept</InlineCode> 是<Text bold>主表（父表 / 被引用表）</Text>；
      </ListItem>
      <ListItem>
        <InlineCode>emp</InlineCode> 是<Text bold>从表（子表 / 引用表）</Text>；
      </ListItem>
      <ListItem>
        <InlineCode>emp.dept_id</InlineCode> 是外键，它<Text bold>引用</Text> <InlineCode>dept.id</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      外键约束保证了：<Text bold><InlineCode>emp.dept_id</InlineCode> 里出现的每一个值，都必须在 <InlineCode>dept.id</InlineCode> 里真实存在（或者为 NULL）</Text>。这就杜绝了“员工属于一个根本不存在的部门”这种脏数据，这叫<Text bold>引用完整性</Text>。
    </Paragraph>
    <Callout type="warning">
      <Text bold>注意</Text>：外键约束只在 <Text bold>InnoDB 存储引擎</Text>下生效（MySQL 8.0 默认就是 InnoDB）。如果用的是 MyISAM 引擎，写了外键也不会真正约束。本章默认 InnoDB。
    </Callout>
    <Callout type="danger">
      <Text bold>被引用列必须是主键或唯一键</Text>：外键所引用的那一列（这里是 <InlineCode>dept.id</InlineCode>），<Text bold>必须是主键或带唯一约束</Text>。否则 MySQL 会报错（<InlineCode>errno: 150</InlineCode>），因为“被指向的目标本身得是唯一可定位的”。
    </Callout>

    <Heading3>6.2 建表时定义外键</Heading3>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE 从表名 (
    ...,
    外键列 数据类型,
    CONSTRAINT 外键名 FOREIGN KEY (外键列) REFERENCES 主表名(被引用列)
);`}
    />
    <Paragraph>
      <Text bold>逐项解释：</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>CONSTRAINT 外键名</InlineCode>：给外键起名字（习惯 <InlineCode>fk_</InlineCode> 开头），可省略但强烈建议写，方便后续删除。
      </ListItem>
      <ListItem>
        <InlineCode>FOREIGN KEY (外键列)</InlineCode>：声明本表的哪一列是外键。
      </ListItem>
      <ListItem>
        <InlineCode>REFERENCES 主表名(被引用列)</InlineCode>：指明它引用哪张表的哪一列。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：</Text> 正式建出我们的公共示例 <InlineCode>emp</InlineCode> 表（<InlineCode>dept</InlineCode> 已在 5.2 节建好且有 3 条数据）：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

CREATE TABLE emp (
    id        INT PRIMARY KEY AUTO_INCREMENT,   -- 员工编号
    ename     VARCHAR(20),                        -- 姓名
    gender    CHAR(1),                            -- 性别 男/女
    salary    DOUBLE,                             -- 工资
    join_date DATE,                               -- 入职日期
    dept_id   INT,                                -- 所属部门(外键)
    bonus     DOUBLE,                             -- 奖金(可能为 NULL)
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);

-- 插入标准的 5 条员工数据
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
    ('张三', '男', 8000,  '2020-01-10', 1, 1000),
    ('李四', '男', 12000, '2019-03-15', 1, NULL),
    ('王五', '女', 9500,  '2021-06-01', 2, 2000),
    ('赵六', '女', 6000,  '2022-09-20', 2, NULL),
    ('孙七', '男', 15000, '2018-11-05', 3, 3000);`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 5 rows affected (0.01 sec)
Records: 5  Duplicates: 0  Warnings: 0`}
    />
    <Paragraph>至此，我们的两张核心表和数据都准备好了。验证一下：</Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT e.id, e.ename, e.dept_id, d.dept_name
FROM emp e JOIN dept d ON e.dept_id = d.id;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'ename', 'dept_id', 'dept_name']}
      rows={[
        ['1', '张三', '1', '研发部'],
        ['2', '李四', '1', '研发部'],
        ['3', '王五', '2', '市场部'],
        ['4', '赵六', '2', '市场部'],
        ['5', '孙七', '3', '财务部'],
      ]}
    />

    <Heading3>6.3 外键约束的“拦截”演示</Heading3>
    <Paragraph>
      <Text bold>演示 1：插入一个引用了不存在部门的员工——报错。</Text>
    </Paragraph>
    <Paragraph>
      <InlineCode>dept</InlineCode> 里只有 id = 1、2、3，我们故意插一个 <InlineCode>dept_id = 99</InlineCode>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`INSERT INTO emp (ename, gender, salary, join_date, dept_id)
VALUES ('错误员工', '男', 5000, '2023-01-01', 99);`}
    />
    <CodeBlock
      language="text"
      code={`ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails
(\`db_learn\`.\`emp\`, CONSTRAINT \`fk_emp_dept\` FOREIGN KEY (\`dept_id\`) REFERENCES \`dept\` (\`id\`))`}
    />
    <Callout type="note">
      外键挡住了脏数据：“你说这个员工属于 99 号部门，可 99 号部门根本不存在！”
    </Callout>
    <Callout type="tip">
      <Text bold>提示</Text>：<InlineCode>dept_id</InlineCode> 允许为 <InlineCode>NULL</InlineCode>（我们没给它加 <InlineCode>NOT NULL</InlineCode>），所以可以插入“暂时不属于任何部门”的员工——外键约束<Text bold>对 <InlineCode>NULL</InlineCode> 放行</Text>（和唯一约束类似）。如果业务要求每个员工都必须有部门，就给 <InlineCode>dept_id</InlineCode> 加上 <InlineCode>NOT NULL</InlineCode>。
    </Callout>
    <Paragraph>
      <Text bold>演示 2：删除一个还有员工的部门——报错。</Text>
    </Paragraph>
    <Paragraph>部门 1（研发部）下面有张三、李四两名员工。我们尝试删除它：</Paragraph>
    <CodeBlock
      language="sql"
      code={`DELETE FROM dept WHERE id = 1;`}
    />
    <CodeBlock
      language="text"
      code={`ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails
(\`db_learn\`.\`emp\`, CONSTRAINT \`fk_emp_dept\` FOREIGN KEY (\`dept_id\`) REFERENCES \`dept\` (\`id\`))`}
    />
    <Callout type="note">
      <Paragraph>
        外键又挡了一次，方向相反：“你想删 1 号部门，可还有员工挂在它名下，删了这些员工就成了‘孤儿’！”
      </Paragraph>
      <Paragraph>
        这就解释了 5.2 节那个细节——为什么 <InlineCode>DROP TABLE</InlineCode> 时<Text bold>必须先删 <InlineCode>emp</InlineCode> 再删 <InlineCode>dept</InlineCode></Text>：因为 <InlineCode>emp</InlineCode> 引用着 <InlineCode>dept</InlineCode>，你不能先把被引用的表删掉。
      </Paragraph>
    </Callout>
    <Callout type="note" title="小结：外键约束限制了“删” 和 “改” 两个方向">
      <Table
        head={['操作', '在主表 dept 上', '在从表 emp 上']}
        rows={[
          ['插入', '随便插（主表是被引用方）', 'dept_id 必须指向已存在的部门'],
          ['删除', '不能删还被引用的部门', '随便删（删员工不影响部门）'],
          ['修改', '不能改被引用的部门 id', '改 dept_id 只能改成已存在的值'],
        ]}
      />
    </Callout>
    <Paragraph>
      那如果业务上<Text bold>确实</Text>想删掉一个部门，怎么办？这就引出了下一节的「级联操作」。在那之前，先看看怎么管理外键本身。
    </Paragraph>

    <Heading3>6.4 建表后添加 / 删除外键</Heading3>
    <Paragraph>
      <Text bold>添加外键的语法：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE 从表名
    ADD CONSTRAINT 外键名 FOREIGN KEY (外键列) REFERENCES 主表名(被引用列);`}
    />
    <Paragraph>
      <Text bold>删除外键的语法（注意：删外键用 <InlineCode>DROP FOREIGN KEY</InlineCode>）：</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`ALTER TABLE 从表名 DROP FOREIGN KEY 外键名;`}
    />
    <Paragraph>
      <Text bold>示例：</Text> 先删掉 <InlineCode>emp</InlineCode> 上的外键，再重新加回来：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 删除外键(此后 emp.dept_id 就不再受约束了)
ALTER TABLE emp DROP FOREIGN KEY fk_emp_dept;`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 0 rows affected (0.02 sec)`}
    />
    <CodeBlock
      language="sql"
      code={`-- 重新添加外键
ALTER TABLE emp
    ADD CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id);`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 5 rows affected (0.04 sec)
Records: 5  Duplicates: 0  Warnings: 0`}
    />
    <Callout type="danger">
      <Paragraph>
        <Text bold>常见坑：三种 <InlineCode>DROP</InlineCode> 别搞混！</Text>
      </Paragraph>
      <Table
        head={['删除对象', '用的语法']}
        rows={[
          ['删唯一约束', 'ALTER TABLE 表 DROP INDEX 索引名;'],
          ['删主键', 'ALTER TABLE 表 DROP PRIMARY KEY;'],
          ['删外键', 'ALTER TABLE 表 DROP FOREIGN KEY 外键名;'],
        ]}
      />
      <Paragraph>
        另外，<Text bold>删除外键约束 ≠ 删除外键列</Text>。<InlineCode>DROP FOREIGN KEY</InlineCode> 只是解除了那条“引用规则”，<InlineCode>dept_id</InlineCode> 这一列以及它的数据还在。
      </Paragraph>
      <Paragraph>
        <Text bold>提示</Text>：忘了外键叫什么名字？查表的建表语句即可：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`SHOW CREATE TABLE emp;`}
      />
      <Paragraph>
        输出里会看到 <InlineCode>CONSTRAINT `fk_emp_dept` FOREIGN KEY ...</InlineCode>，那个反引号里的就是外键名。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>7. 级联操作：ON UPDATE / ON DELETE CASCADE</Subtitle>

    <Heading3>7.1 是什么 / 为什么</Heading3>
    <Paragraph>
      上一节我们看到：<Text bold>主表里被引用的行，默认是不能改、不能删的</Text>（这种默认行为叫 <InlineCode>RESTRICT</InlineCode>）。
    </Paragraph>
    <Paragraph>但有时业务确实需要“连锁反应”：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>级联更新</Text>：如果 1 号部门的编号要改成 100，希望所有“原本属于 1 号部门的员工”的 <InlineCode>dept_id</InlineCode> 也自动跟着变成 100。
      </ListItem>
      <ListItem>
        <Text bold>级联删除</Text>：如果一个部门被裁撤，希望该部门下的所有员工记录也自动被删除。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      这就是<Text bold>级联操作（Cascade）</Text>：让从表的数据，<Text bold>随着主表的变化自动联动</Text>。
    </Paragraph>
    <Paragraph>定义外键时，可以在末尾追加级联规则：</Paragraph>
    <CodeBlock
      language="sql"
      code={`CONSTRAINT 外键名 FOREIGN KEY (外键列) REFERENCES 主表(被引用列)
    ON UPDATE 级联动作
    ON DELETE 级联动作`}
    />
    <Paragraph>可选的“级联动作”有：</Paragraph>
    <Table
      head={['动作', '含义']}
      rows={[
        ['CASCADE', '级联：主表改/删，从表跟着改/删'],
        ['SET NULL', '主表改/删时，把从表对应的外键列置为 NULL（要求该列允许为 NULL）'],
        ['RESTRICT', '限制（默认）：只要从表还在引用，就不允许主表改/删'],
        ['NO ACTION', '在 MySQL 中效果同 RESTRICT'],
      ]}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：<InlineCode>ON UPDATE</InlineCode> 管的是“主表被引用列被修改时”的行为，<InlineCode>ON DELETE</InlineCode> 管的是“主表行被删除时”的行为，两者可以分别设置、互不影响。
    </Callout>

    <Heading3>7.2 创建带级联的外键</Heading3>
    <Paragraph>
      我们把 <InlineCode>emp</InlineCode> 的外键改造成“级联更新 + 级联删除”。先删掉旧外键，再加带级联的新外键：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

ALTER TABLE emp DROP FOREIGN KEY fk_emp_dept;

ALTER TABLE emp
    ADD CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE;`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 5 rows affected (0.04 sec)
Records: 5  Duplicates: 0  Warnings: 0`}
    />

    <Heading3>7.3 演示级联更新（ON UPDATE CASCADE）</Heading3>
    <Paragraph>
      当前数据：员工张三、李四的 <InlineCode>dept_id</InlineCode> 都是 1（研发部）。现在我们把研发部的 <InlineCode>id</InlineCode> 从 1 改成 100：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`UPDATE dept SET id = 100 WHERE id = 1;`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0`}
    />
    <Paragraph>
      查看员工表——张三、李四的 <InlineCode>dept_id</InlineCode> <Text bold>自动变成了 100</Text>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, dept_id FROM emp;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'ename', 'dept_id']}
      rows={[
        ['1', '张三', '100'],
        ['2', '李四', '100'],
        ['3', '王五', '2'],
        ['4', '赵六', '2'],
        ['5', '孙七', '3'],
      ]}
    />
    <Callout type="note">
      <Paragraph>
        我们只改了主表 <InlineCode>dept</InlineCode> 一行，从表 <InlineCode>emp</InlineCode> 里相关的两行<Text bold>自动跟着改了</Text>——这就是 <InlineCode>ON UPDATE CASCADE</InlineCode>。先把它改回来，方便后面演示：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`UPDATE dept SET id = 1 WHERE id = 100;   -- emp 里的 dept_id 又会自动变回 1`}
      />
    </Callout>

    <Heading3>7.4 演示级联删除（ON DELETE CASCADE）</Heading3>
    <Paragraph>
      现在删除 2 号部门（市场部）。它下面有王五（id=3）、赵六（id=4）两名员工：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`DELETE FROM dept WHERE id = 2;`}
    />
    <CodeBlock
      language="text"
      code={`Query OK, 1 row affected (0.01 sec)`}
    />
    <Paragraph>
      查看员工表——王五、赵六<Text bold>自动被删除了</Text>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT id, ename, dept_id FROM emp;`}
    />
    <Paragraph>
      <Text bold>执行结果（示意）：</Text>
    </Paragraph>
    <Table
      head={['id', 'ename', 'dept_id']}
      rows={[
        ['1', '张三', '1'],
        ['2', '李四', '1'],
        ['5', '孙七', '3'],
      ]}
    />
    <Callout type="note">
      只删了主表一个部门，从表里挂在它名下的两名员工<Text bold>被连锁删除</Text>——这就是 <InlineCode>ON DELETE CASCADE</InlineCode> 的威力，也是它的<Text bold>危险</Text>所在。
    </Callout>

    <Heading3>7.5 级联的风险与建议</Heading3>
    <Callout type="danger">
      <Paragraph>
        <Text bold>常见坑 / 风险</Text>：
      </Paragraph>
      <OrderedList>
        <ListItem>
          <Text bold><InlineCode>ON DELETE CASCADE</InlineCode> 会“悄悄”删掉大量数据。</Text> 你以为只删了一个部门，实际上可能连带删掉了成百上千条员工记录，且<Text bold>没有任何额外提示</Text>。删错部门 = 一连串数据蒸发。
        </ListItem>
        <ListItem>
          <Text bold>删除可能像多米诺骨牌一样层层蔓延。</Text> 如果 <InlineCode>emp</InlineCode> 又被别的表（如“工资流水表”）以级联外键引用，删一个部门可能引发跨多张表的连锁删除，影响范围难以预估。
        </ListItem>
        <ListItem>
          <Text bold>数据“不知不觉”被改写，排查困难。</Text> 出了问题回头查日志，往往看不出这些行是“被级联带走的”。
        </ListItem>
      </OrderedList>
    </Callout>
    <Callout type="tip">
      <Paragraph>
        <Text bold>实战建议</Text>：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>生产环境对“删除”要极其谨慎</Text>。很多团队<Text bold>不用 <InlineCode>ON DELETE CASCADE</InlineCode></Text>，而是采用<Text bold>“逻辑删除”</Text>（给表加一个 <InlineCode>deleted</InlineCode> 标志位，删除时只是把它置为 1，数据并不真正消失），既安全又可追溯。
        </ListItem>
        <ListItem>
          <InlineCode>ON UPDATE CASCADE</InlineCode> 相对安全（因为通常不会去改主键），但实践中也很少改主键，所以用得也不多。
        </ListItem>
        <ListItem>
          究竟“在数据库层用外键 + 级联”还是“在应用层（Java 代码）手动维护关系”，业界一直有争论。互联网大厂的规范（如《阿里巴巴 Java 开发手册》）<Text bold>强制不允许使用外键与级联</Text>，理由是：外键影响写入性能、增加分库分表难度、把业务约束耦合进了数据库。而传统企业 / 中小项目里，外键能省很多心、更安全。<Text bold>没有绝对的对错，理解原理、按团队规范来。</Text>
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7.6 把示例库恢复成标准状态</Heading3>
    <Paragraph>
      刚才的演示打乱了数据，最后把它恢复成本套教程统一的“5 员工 + 3 部门”标准状态，方便后续章节继续使用。注意：因为外键现在带 <InlineCode>CASCADE</InlineCode>，重建数据前我们把外键改回普通（无级联）版本，更贴近公共示例的原始定义：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

-- 1) 清空两张表(先清从表 emp，再清主表 dept)
DELETE FROM emp;
DELETE FROM dept;

-- 2) 把外键恢复成不带级联的标准版本
ALTER TABLE emp DROP FOREIGN KEY fk_emp_dept;
ALTER TABLE emp
    ADD CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id);

-- 3) 重新灌入标准数据(显式指定 id，保证编号是 1/2/3 与 1~5)
INSERT INTO dept (id, dept_name, loc) VALUES
    (1, '研发部', '北京'),
    (2, '市场部', '上海'),
    (3, '财务部', '广州');

INSERT INTO emp (id, ename, gender, salary, join_date, dept_id, bonus) VALUES
    (1, '张三', '男', 8000,  '2020-01-10', 1, 1000),
    (2, '李四', '男', 12000, '2019-03-15', 1, NULL),
    (3, '王五', '女', 9500,  '2021-06-01', 2, 2000),
    (4, '赵六', '女', 6000,  '2022-09-20', 2, NULL),
    (5, '孙七', '男', 15000, '2018-11-05', 3, 3000);`}
    />
    <Callout type="tip">
      <Text bold>提示</Text>：上面 <InlineCode>DELETE FROM emp;</InlineCode> 之所以放在 <InlineCode>DELETE FROM dept;</InlineCode> 之前，正是因为外键——必须先清掉“引用方”，才能清“被引用方”。这个顺序规律会贯穿你今后所有涉及外键的操作。
    </Callout>

    <Divider />

    <Subtitle>8. 本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>约束的本质</Text>：在数据写入时把关，保证数据的<Text bold>完整性与正确性</Text>。它比应用层的 <InlineCode>if</InlineCode> 校验更可靠，因为不管数据从哪条路进来都拦得住。
      </ListItem>
      <ListItem>
        <Text bold>六大约束速记</Text>：
        <Table
          head={['约束', '关键字', '一句话', '添加(ALTER)', '删除(ALTER)']}
          rows={[
            ['非空', 'NOT NULL', '必须填', 'MODIFY 列 类型 NOT NULL', 'MODIFY 列 类型 NULL'],
            ['唯一', 'UNIQUE', '不许重复（允许多个 NULL）', 'ADD CONSTRAINT uk_x UNIQUE(列)', 'DROP INDEX 名'],
            ['主键', 'PRIMARY KEY', '非空+唯一，一表一个', 'ADD PRIMARY KEY(列)', 'DROP PRIMARY KEY'],
            ['自增', 'AUTO_INCREMENT', '自动生成递增主键', 'MODIFY 列 类型 AUTO_INCREMENT', 'MODIFY 列 类型（去掉它）'],
            ['外键', 'FOREIGN KEY', '引用必须真实存在', 'ADD CONSTRAINT fk_x FOREIGN KEY(列) REFERENCES 主表(列)', 'DROP FOREIGN KEY 名'],
            ['默认', 'DEFAULT', '不填给默认值', 'ALTER 列 SET DEFAULT 值', 'ALTER 列 DROP DEFAULT'],
          ]}
        />
      </ListItem>
      <ListItem>
        <Text bold>三个最容易记混的删除语法</Text>：唯一用 <InlineCode>DROP INDEX</InlineCode>，主键用 <InlineCode>DROP PRIMARY KEY</InlineCode>，外键用 <InlineCode>DROP FOREIGN KEY</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold><InlineCode>NULL</InlineCode> 的特殊性贯穿全章</Text>：唯一约束、外键约束都对 <InlineCode>NULL</InlineCode> “网开一面”；要彻底禁止空值得额外加 <InlineCode>NOT NULL</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>自增的两条铁律</Text>：从 1 开始（可改起始值）、只增不减（删行不回填，<InlineCode>id</InlineCode> 可能不连续）。
      </ListItem>
      <ListItem>
        <Text bold>外键限制“删”和“改”</Text>：默认不能删 / 改主表里还被引用的行；要联动就用<Text bold>级联</Text>。
      </ListItem>
      <ListItem>
        <Text bold>级联（CASCADE）是把双刃剑</Text>：<InlineCode>ON DELETE CASCADE</InlineCode> 能连锁删数据，方便但危险，生产环境慎用，很多团队改用逻辑删除或禁用外键。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>9. 常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>Q1：主键约束和唯一约束有什么区别？</Text>
    </Paragraph>
    <Paragraph>
      A：① 主键非空且唯一，唯一约束允许 <InlineCode>NULL</InlineCode>（且可多个 <InlineCode>NULL</InlineCode>）；② 一张表只能有一个主键，但可以有多个唯一约束；③ 主键是“行的唯一标识”，语义上更强。底层都靠索引实现。
    </Paragraph>
    <Paragraph>
      <Text bold>Q2：唯一约束的列能存几个 <InlineCode>NULL</InlineCode>？为什么？</Text>
    </Paragraph>
    <Paragraph>
      A：可以存<Text bold>多个</Text>。因为 <InlineCode>NULL</InlineCode> 表示“未知”，两个未知之间无法判定相等（<InlineCode>NULL = NULL</InlineCode> 结果为未知，不为真），所以不算重复。
    </Paragraph>
    <Paragraph>
      <Text bold>Q3：<InlineCode>DELETE</InlineCode> 删光数据后，自增主键会从 1 重新开始吗？<InlineCode>TRUNCATE</InlineCode> 呢？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>DELETE</InlineCode> <Text bold>不会</Text>重置，新数据接着之前的最大值往后排；<InlineCode>TRUNCATE</InlineCode> <Text bold>会</Text>把自增计数器重置为初始值（从 1 重新开始）。
    </Paragraph>
    <Paragraph>
      <Text bold>Q4：为什么删一个还有员工的部门会报错？怎么才能删？</Text>
    </Paragraph>
    <Paragraph>
      A：因为外键约束保护了引用完整性，不允许出现“引用了不存在部门”的孤儿员工。要删的话：① 先把该部门下的员工删除或改到别的部门；② 或者给外键设置 <InlineCode>ON DELETE CASCADE</InlineCode>（连员工一起删）/ <InlineCode>ON DELETE SET NULL</InlineCode>（把员工的 <InlineCode>dept_id</InlineCode> 置空）；③ 或者临时删除外键约束。
    </Paragraph>
    <Paragraph>
      <Text bold>Q5：删除唯一约束为什么用 <InlineCode>DROP INDEX</InlineCode> 而不是 <InlineCode>DROP CONSTRAINT</InlineCode>？</Text>
    </Paragraph>
    <Paragraph>
      A：因为 MySQL 的唯一约束在底层是用<Text bold>唯一索引</Text>实现的，本质上删的是那个索引。语法是 <InlineCode>ALTER TABLE 表 DROP INDEX 索引名;</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>Q6：外键约束有什么缺点？为什么有些公司禁用它？</Text>
    </Paragraph>
    <Paragraph>
      A：① 影响写入性能（每次增删改都要做引用检查）；② 增加分库分表 / 数据迁移的复杂度；③ 把业务规则耦合进数据库，不利于水平扩展。所以《阿里巴巴 Java 开发手册》等规范要求不用外键，改在应用层（代码）维护关系。但这是工程权衡，并非外键“错了”——中小项目用外键往往更安全省心。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：<InlineCode>NOT NULL</InlineCode>、空字符串 <InlineCode>''</InlineCode>、<InlineCode>0</InlineCode> 三者关系？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>NOT NULL</InlineCode> 只禁止“没有值”（<InlineCode>NULL</InlineCode>），但 <InlineCode>''</InlineCode> 和 <InlineCode>0</InlineCode> 都是“有值”的，不受 <InlineCode>NOT NULL</InlineCode> 限制，仍可正常插入。
    </Paragraph>
  </article>
);

export default index;
