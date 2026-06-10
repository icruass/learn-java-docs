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
    <Title>外键、级联与本章小结</Title>

    <Subtitle>6. 外键约束 FOREIGN KEY</Subtitle>

    <Heading3>6.1 是什么 / 为什么</Heading3>
    <Paragraph>
      到目前为止，我们讲的约束都作用在<Text bold>单张表内部</Text>。而<Text bold>外键（Foreign Key）是用来维护两张表之间关系一致性的</Text>——这是它和前面所有约束最大的不同。
    </Paragraph>
    <Paragraph>
      回到我们的业务：一个部门有多个员工，每个员工属于一个部门（<Text bold>一对多</Text>）。员工表 <InlineCode>emp</InlineCode> 用一个 <InlineCode>dept_id</InlineCode> 列来记录"我属于哪个部门"，它的值应该对应 <InlineCode>dept</InlineCode> 表里某个真实存在的 <InlineCode>id</InlineCode>。
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
      外键约束保证了：<Text bold><InlineCode>emp.dept_id</InlineCode> 里出现的每一个值，都必须在 <InlineCode>dept.id</InlineCode> 里真实存在（或者为 NULL）</Text>。这就杜绝了"员工属于一个根本不存在的部门"这种脏数据，这叫<Text bold>引用完整性</Text>。
    </Paragraph>
    <Callout type="warning">
      <Text bold>注意</Text>：外键约束只在 <Text bold>InnoDB 存储引擎</Text>下生效（MySQL 8.0 默认就是 InnoDB）。如果用的是 MyISAM 引擎，写了外键也不会真正约束。本章默认 InnoDB。
    </Callout>
    <Callout type="danger">
      <Text bold>被引用列必须是主键或唯一键</Text>：外键所引用的那一列（这里是 <InlineCode>dept.id</InlineCode>），<Text bold>必须是主键或带唯一约束</Text>。否则 MySQL 会报错（<InlineCode>errno: 150</InlineCode>），因为"被指向的目标本身得是唯一可定位的"。
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

    <Heading3>6.3 外键约束的"拦截"演示</Heading3>
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
      外键挡住了脏数据："你说这个员工属于 99 号部门，可 99 号部门根本不存在！"
    </Callout>
    <Callout type="tip">
      <Text bold>提示</Text>：<InlineCode>dept_id</InlineCode> 允许为 <InlineCode>NULL</InlineCode>（我们没给它加 <InlineCode>NOT NULL</InlineCode>），所以可以插入"暂时不属于任何部门"的员工——外键约束<Text bold>对 <InlineCode>NULL</InlineCode> 放行</Text>（和唯一约束类似）。如果业务要求每个员工都必须有部门，就给 <InlineCode>dept_id</InlineCode> 加上 <InlineCode>NOT NULL</InlineCode>。
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
        外键又挡了一次，方向相反："你想删 1 号部门，可还有员工挂在它名下，删了这些员工就成了'孤儿'！"
      </Paragraph>
      <Paragraph>
        这就解释了 5.2 节那个细节——为什么 <InlineCode>DROP TABLE</InlineCode> 时<Text bold>必须先删 <InlineCode>emp</InlineCode> 再删 <InlineCode>dept</InlineCode></Text>：因为 <InlineCode>emp</InlineCode> 引用着 <InlineCode>dept</InlineCode>，你不能先把被引用的表删掉。
      </Paragraph>
    </Callout>
    <Callout type="note" title={"小结：外键约束限制了\"删\" 和 \"改\" 两个方向"}>
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
        另外，<Text bold>删除外键约束 ≠ 删除外键列</Text>。<InlineCode>DROP FOREIGN KEY</InlineCode> 只是解除了那条"引用规则"，<InlineCode>dept_id</InlineCode> 这一列以及它的数据还在。
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
    <Paragraph>但有时业务确实需要"连锁反应"：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>级联更新</Text>：如果 1 号部门的编号要改成 100，希望所有"原本属于 1 号部门的员工"的 <InlineCode>dept_id</InlineCode> 也自动跟着变成 100。
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
    <Paragraph>可选的"级联动作"有：</Paragraph>
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
      <Text bold>提示</Text>：<InlineCode>ON UPDATE</InlineCode> 管的是"主表被引用列被修改时"的行为，<InlineCode>ON DELETE</InlineCode> 管的是"主表行被删除时"的行为，两者可以分别设置、互不影响。
    </Callout>

    <Heading3>7.2 创建带级联的外键</Heading3>
    <Paragraph>
      我们把 <InlineCode>emp</InlineCode> 的外键改造成"级联更新 + 级联删除"。先删掉旧外键，再加带级联的新外键：
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
          <Text bold><InlineCode>ON DELETE CASCADE</InlineCode> 会"悄悄"删掉大量数据。</Text> 你以为只删了一个部门，实际上可能连带删掉了成百上千条员工记录，且<Text bold>没有任何额外提示</Text>。删错部门 = 一连串数据蒸发。
        </ListItem>
        <ListItem>
          <Text bold>删除可能像多米诺骨牌一样层层蔓延。</Text> 如果 <InlineCode>emp</InlineCode> 又被别的表（如"工资流水表"）以级联外键引用，删一个部门可能引发跨多张表的连锁删除，影响范围难以预估。
        </ListItem>
        <ListItem>
          <Text bold>数据"不知不觉"被改写，排查困难。</Text> 出了问题回头查日志，往往看不出这些行是"被级联带走的"。
        </ListItem>
      </OrderedList>
    </Callout>
    <Callout type="tip">
      <Paragraph>
        <Text bold>实战建议</Text>：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>生产环境对"删除"要极其谨慎</Text>。很多团队<Text bold>不用 <InlineCode>ON DELETE CASCADE</InlineCode></Text>，而是采用<Text bold>"逻辑删除"</Text>（给表加一个 <InlineCode>deleted</InlineCode> 标志位，删除时只是把它置为 1，数据并不真正消失），既安全又可追溯。
        </ListItem>
        <ListItem>
          <InlineCode>ON UPDATE CASCADE</InlineCode> 相对安全（因为通常不会去改主键），但实践中也很少改主键，所以用得也不多。
        </ListItem>
        <ListItem>
          究竟"在数据库层用外键 + 级联"还是"在应用层（Java 代码）手动维护关系"，业界一直有争论。互联网大厂的规范（如《阿里巴巴 Java 开发手册》）<Text bold>强制不允许使用外键与级联</Text>，理由是：外键影响写入性能、增加分库分表难度、把业务约束耦合进了数据库。而传统企业 / 中小项目里，外键能省很多心、更安全。<Text bold>没有绝对的对错，理解原理、按团队规范来。</Text>
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7.6 把示例库恢复成标准状态</Heading3>
    <Paragraph>
      刚才的演示打乱了数据，最后把它恢复成本套教程统一的"5 员工 + 3 部门"标准状态，方便后续章节继续使用。注意：因为外键现在带 <InlineCode>CASCADE</InlineCode>，重建数据前我们把外键改回普通（无级联）版本，更贴近公共示例的原始定义：
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
      <Text bold>提示</Text>：上面 <InlineCode>DELETE FROM emp;</InlineCode> 之所以放在 <InlineCode>DELETE FROM dept;</InlineCode> 之前，正是因为外键——必须先清掉"引用方"，才能清"被引用方"。这个顺序规律会贯穿你今后所有涉及外键的操作。
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
        <Text bold><InlineCode>NULL</InlineCode> 的特殊性贯穿全章</Text>：唯一约束、外键约束都对 <InlineCode>NULL</InlineCode> "网开一面"；要彻底禁止空值得额外加 <InlineCode>NOT NULL</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>自增的两条铁律</Text>：从 1 开始（可改起始值）、只增不减（删行不回填，<InlineCode>id</InlineCode> 可能不连续）。
      </ListItem>
      <ListItem>
        <Text bold>外键限制"删"和"改"</Text>：默认不能删 / 改主表里还被引用的行；要联动就用<Text bold>级联</Text>。
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
      A：① 主键非空且唯一，唯一约束允许 <InlineCode>NULL</InlineCode>（且可多个 <InlineCode>NULL</InlineCode>）；② 一张表只能有一个主键，但可以有多个唯一约束；③ 主键是"行的唯一标识"，语义上更强。底层都靠索引实现。
    </Paragraph>
    <Paragraph>
      <Text bold>Q2：唯一约束的列能存几个 <InlineCode>NULL</InlineCode>？为什么？</Text>
    </Paragraph>
    <Paragraph>
      A：可以存<Text bold>多个</Text>。因为 <InlineCode>NULL</InlineCode> 表示"未知"，两个未知之间无法判定相等（<InlineCode>NULL = NULL</InlineCode> 结果为未知，不为真），所以不算重复。
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
      A：因为外键约束保护了引用完整性，不允许出现"引用了不存在部门"的孤儿员工。要删的话：① 先把该部门下的员工删除或改到别的部门；② 或者给外键设置 <InlineCode>ON DELETE CASCADE</InlineCode>（连员工一起删）/ <InlineCode>ON DELETE SET NULL</InlineCode>（把员工的 <InlineCode>dept_id</InlineCode> 置空）；③ 或者临时删除外键约束。
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
      A：① 影响写入性能（每次增删改都要做引用检查）；② 增加分库分表 / 数据迁移的复杂度；③ 把业务规则耦合进数据库，不利于水平扩展。所以《阿里巴巴 Java 开发手册》等规范要求不用外键，改在应用层（代码）维护关系。但这是工程权衡，并非外键"错了"——中小项目用外键往往更安全省心。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：<InlineCode>NOT NULL</InlineCode>、空字符串 <InlineCode>''</InlineCode>、<InlineCode>0</InlineCode> 三者关系？</Text>
    </Paragraph>
    <Paragraph>
      A：<InlineCode>NOT NULL</InlineCode> 只禁止"没有值"（<InlineCode>NULL</InlineCode>），但 <InlineCode>''</InlineCode> 和 <InlineCode>0</InlineCode> 都是"有值"的，不受 <InlineCode>NOT NULL</InlineCode> 限制，仍可正常插入。
    </Paragraph>
  </article>
);

export default index;
