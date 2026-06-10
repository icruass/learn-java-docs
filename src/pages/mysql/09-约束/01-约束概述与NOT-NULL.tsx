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
    <Title>约束概述与非空约束 NOT NULL</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>前面几章我们已经会建表、会增删改查（CRUD）了。但你有没有想过这样几个问题：</Paragraph>
      <UnorderedList>
        <ListItem>
          如果有人往"员工姓名"这一列里插入了一个 <InlineCode>NULL</InlineCode>，业务上算不算"没有姓名的员工"？
        </ListItem>
        <ListItem>
          如果两个用户注册了<Text bold>完全相同</Text>的用户名，登录时该认哪一个？
        </ListItem>
        <ListItem>
          如果某条员工记录的 <InlineCode>dept_id</InlineCode> 写成了 <InlineCode>999</InlineCode>，可数据库里<Text bold>根本没有 999 这个部门</Text>，这条数据还有意义吗？
        </ListItem>
      </UnorderedList>
      <Paragraph>
        这些问题的本质是：<Text bold>光能存数据还不够，我们还要保证存进去的数据是"干净、正确、彼此一致"的</Text>。这就是「约束（Constraint）」要解决的事情。
      </Paragraph>
      <Paragraph>
        约束是数据库交给我们的"守门员"：它在数据<Text bold>写入的那一刻</Text>就帮我们把关，不符合规则的数据根本进不来。这比我们在 Java 代码里写一堆 <InlineCode>if</InlineCode> 判断要可靠得多——因为不管数据从哪条路（后台程序、运维手工 SQL、第三方导入脚本）进来，数据库这道关都拦得住。
      </Paragraph>
      <Paragraph>
        本章我们会从"为什么需要约束"讲起，依次讲透 <Text bold>非空、唯一、主键、自增、外键、级联</Text> 这六大主题。这是数据库设计的"地基课"，学完之后你回头看前面建的表，会发现它们其实是"裸奔"的——而本章就是给它们穿上护甲。下一章我们会进入"多表设计与三大范式"，到时候你会发现，<Text bold>外键约束正是多表关系落地的关键工具</Text>，所以本章一定要打牢。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>1. 约束概述：它到底是什么、为什么需要</Subtitle>

    <Heading3>1.1 一个类比：约束就是"表单的填写规则"</Heading3>
    <Paragraph>想象你去办银行卡，柜员递给你一张表单：</Paragraph>
    <UnorderedList>
      <ListItem>
        "姓名"一栏<Text bold>必须填</Text>（不能空着）——这就是 <Text bold>非空约束</Text>；
      </ListItem>
      <ListItem>
        "身份证号"一栏<Text bold>全国唯一，不能和别人重复</Text>——这就是 <Text bold>唯一约束</Text>；
      </ListItem>
      <ListItem>
        银行内部给你这张卡分配一个<Text bold>唯一的卡号</Text>，靠它就能精确定位到你这个人——这就是 <Text bold>主键约束</Text>；
      </ListItem>
      <ListItem>
        卡号是<Text bold>系统自动生成、一个接一个往后排</Text>的——这就是 <Text bold>自动增长</Text>；
      </ListItem>
      <ListItem>
        表单里有一栏"开户网点"，你只能从<Text bold>银行真实存在的网点列表里选</Text>，不能瞎写一个不存在的网点——这就是 <Text bold>外键约束</Text>；
      </ListItem>
      <ListItem>
        "账户状态"一栏你不填，系统<Text bold>默认填"正常"</Text>——这就是 <Text bold>默认约束</Text>；
      </ListItem>
      <ListItem>
        "年龄"一栏要求<Text bold>必须 ≥ 18</Text>，填个 5 岁系统直接拒绝——这就是 <Text bold>检查约束</Text>。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      <Paragraph>
        <Text bold>提示</Text>：约束（Constraint）= <Text bold>作用在表的列上的、用来限制数据的规则</Text>。它的核心目的只有一个——<Text bold>保证数据的完整性（Integrity）和正确性（Correctness）</Text>。
      </Paragraph>
      <Paragraph>所谓"完整性"，可以拆成三块来理解：</Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>实体完整性</Text>：表中每一行都能被唯一区分（靠主键 / 唯一）。
        </ListItem>
        <ListItem>
          <Text bold>域完整性</Text>：每一列的取值都在合理范围内（靠非空 / 默认 / 检查）。
        </ListItem>
        <ListItem>
          <Text bold>引用完整性</Text>：表与表之间的关联是"说得通"的，不会出现"引用了一个不存在的对象"（靠外键）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>1.2 约束的分类总览</Heading3>
    <Paragraph>MySQL 中常用的约束有以下几类，先有个全局印象，后面逐个展开：</Paragraph>
    <Table
      head={['约束', '关键字', '作用', '一句话记忆']}
      rows={[
        ['非空约束', 'NOT NULL', '列值不允许为 NULL', '"这一栏必须填"'],
        ['唯一约束', 'UNIQUE', '列值不允许重复', '"这一栏不许撞车"'],
        ['主键约束', 'PRIMARY KEY', '非空 且 唯一，行的唯一标识', '"身份证号，一表只有一个"'],
        ['自动增长', 'AUTO_INCREMENT', '主键值自动 +1 生成', '"排队取号机"'],
        ['外键约束', 'FOREIGN KEY', '维护两表之间的引用一致性', '"只能选真实存在的部门"'],
        ['默认约束', 'DEFAULT', '不填时使用默认值', '"不填就给你填个默认的"'],
        ['检查约束', 'CHECK（MySQL 8.0.16+ 真正生效）', '列值必须满足指定条件', '"年龄必须 ≥ 18"'],
      ]}
    />
    <Callout type="warning">
      <Text bold>注意</Text>：<InlineCode>CHECK</InlineCode> 约束在 <Text bold>MySQL 8.0.16 之前</Text>虽然语法上能写，但会被<Text bold>直接忽略</Text>（解析后丢弃），不报错也不生效，这是个经典的"坑"。从 8.0.16 开始才真正校验。本章以 8.0 为主，所有示例都在 8.0 环境下可执行。
    </Callout>

    <Heading3>1.3 准备公共示例库</Heading3>
    <Paragraph>
      本套教程统一使用 <InlineCode>db_learn</InlineCode> 数据库。本章主要围绕<Text bold>部门表 <InlineCode>dept</InlineCode></Text> 和<Text bold>员工表 <InlineCode>emp</InlineCode></Text>（一对多关系）展开。为了不影响前面章节已有的数据，我们后面会在"干净"的环境下逐步建表演示。先把库建好：
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
      <Text bold>提示</Text>：本章很多示例会"先建一个临时小表演示约束效果，再删掉"。为避免和正式的 <InlineCode>dept</InlineCode> / <InlineCode>emp</InlineCode> 冲突，演示用的临时表我会起名 <InlineCode>t_demo</InlineCode>、<InlineCode>t_user_demo</InlineCode> 之类。看到这种名字，就知道它只是"一次性演示道具"。
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
          <InlineCode>NULL</InlineCode> 表示<Text bold>"这个值未知 / 不存在 / 没填"</Text>，它什么都不是。
        </ListItem>
      </UnorderedList>
      <Paragraph>
        所以一个列即使加了 <InlineCode>NOT NULL</InlineCode>，你仍然可以往里插 <InlineCode>0</InlineCode> 或 <InlineCode>''</InlineCode>——因为它们都是"有值"的。<InlineCode>NOT NULL</InlineCode> 拦的只是"压根没值"这种情况。
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
      <Text bold>示例：</Text> 建一个演示表，要求"姓名 <InlineCode>ename</InlineCode> 必须填、性别 <InlineCode>gender</InlineCode> 必须填"：
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
      "悄悄地"不写 <InlineCode>ename</InlineCode> 列——<Text bold>同样报错</Text>（因为非空列没有默认值时，相当于要插 <InlineCode>NULL</InlineCode>）：
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
      <Text bold>常见坑</Text>：上面两种情况报的错误码不同（<InlineCode>1048</InlineCode> vs <InlineCode>1364</InlineCode>），但本质都是"非空列你没给值"。<InlineCode>1048</InlineCode> 是"你明确给了 NULL"，<InlineCode>1364</InlineCode> 是"你压根没提这一列，且它没默认值"。
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
      <Text bold>注意</Text>：<InlineCode>MODIFY</InlineCode> 是<Text bold>整列重定义</Text>。也就是说，你写 <InlineCode>MODIFY salary DOUBLE NOT NULL</InlineCode>，必须把<Text bold>数据类型 <InlineCode>DOUBLE</InlineCode> 也带上</Text>，否则会丢失原来的类型信息。它不像"追加一个属性"，而是"把这一列从头到尾重新声明一遍"。
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
  </article>
);

export default index;
