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
    <Title>DELETE、TRUNCATE 与本章小结</Title>

    <Subtitle>4. 删除数据：DELETE</Subtitle>

    <Heading3>4.1 是什么 / 为什么</Heading3>
    <Paragraph>
      <InlineCode>DELETE</InlineCode> 用于
      <Text bold>删除表中满足条件的行（整行删除）</Text>
      。注意它删的是"行"，不是"某个列的值"——想清空某个格子用的是{' '}
      <InlineCode>UPDATE ... SET 列 = NULL</InlineCode>，而不是{' '}
      <InlineCode>DELETE</InlineCode>。
    </Paragraph>
    <Paragraph>
      类比：在 Excel 里<Text bold>选中若干行 → 右键删除行</Text>。
    </Paragraph>

    <Heading3>4.2 语法格式</Heading3>
    <CodeBlock language="sql" code={`DELETE FROM 表名 WHERE 条件;`} />
    <Paragraph>
      <Text bold>逐项解释</Text>：
    </Paragraph>
    <Table
      head={['部分', '含义', '是否必须']}
      rows={[
        ['DELETE FROM 表名', '从哪张表删', '必须'],
        ['WHERE 条件', '只删满足条件的行', '语法可省略，但省略=删全表，极危险！'],
      ]}
    />
    <Callout type="note">
      注意是 <InlineCode>DELETE FROM 表名</InlineCode>，<Text bold>不写列名</Text>
      ——因为删除是"删整行"，谈不上删某一列。
    </Callout>

    <Heading3>4.3 示例：删一行 / 删多行</Heading3>
    <Callout type="note">操作前请确保是初始数据。</Callout>
    <CodeBlock
      language="sql"
      code={`-- 删一行：删除 id=4 的"赵六"
DELETE FROM emp WHERE id = 4;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>1 row affected</InlineCode>
      ，赵六这一行从表中消失。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 删多行：删除所有工资低于 8000 的员工
DELETE FROM emp WHERE salary < 8000;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>WHERE</InlineCode>
      命中几行就删几行（基于初始数据，命中赵六 6000 一人，
      <InlineCode>1 row affected</InlineCode>）。
    </Paragraph>

    <Heading3>4.4 ⚠️ 最危险的一点：DELETE 不写 WHERE = 删光全表！</Heading3>
    <CodeBlock
      language="sql"
      code={`-- 💀 灾难示例：删除 emp 表里的所有行！
DELETE FROM emp;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>N rows affected</InlineCode>（N =
      全表行数），<Text bold>整张表被清空</Text>
      （但表结构还在，是个空表）。这就是新闻里常说的"删库跑路"级别的事故。
    </Paragraph>
    <Paragraph>
      <Text bold>避免方法和 UPDATE 完全一样</Text>：开启{' '}
      <InlineCode>SQL_SAFE_UPDATES</InlineCode>、先 <InlineCode>SELECT</InlineCode>
      确认范围、用事务包裹。这里不再重复。
    </Paragraph>
    <Callout type="danger" title="常见坑：外键约束导致删不掉">
      <Paragraph>
        <InlineCode>dept</InlineCode> 是"父表"，<InlineCode>emp</InlineCode> 通过外键{' '}
        <InlineCode>fk_emp_dept</InlineCode> 引用它。如果你想删除研发部：
      </Paragraph>
      <CodeBlock language="sql" code={`DELETE FROM dept WHERE id = 1;`} />
      <Paragraph>
        会报错：
        <InlineCode>
          Cannot delete or update a parent row: a foreign key constraint fails ...
        </InlineCode>
      </Paragraph>
      <Paragraph>
        原因：研发部下还挂着张三、李四（<InlineCode>emp.dept_id = 1</InlineCode>
        ），数据库不允许你删掉"还被别人引用着"的父记录，否则那些员工就成了"无主孤儿"。
      </Paragraph>
      <Paragraph>
        <Text bold>正确顺序</Text>：先删（或改派）子表 <InlineCode>emp</InlineCode>
        里属于该部门的员工，再删父表 <InlineCode>dept</InlineCode> 的部门。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>5. DELETE 与 TRUNCATE TABLE 的区别（重点）</Subtitle>
    <Paragraph>
      想"把一张表的数据全部清空"，有两条路：<InlineCode>DELETE FROM 表名;</InlineCode>{' '}
      和 <InlineCode>TRUNCATE TABLE 表名;</InlineCode>
      。它们结果看起来一样（表都空了），但
      <Text bold>底层机制、性能、副作用完全不同</Text>，这也是高频面试题。
    </Paragraph>
    <Callout type="note">
      注：<InlineCode>TRUNCATE</InlineCode> 严格说属于 <Text bold>DDL</Text>
      （它的本质是"删表重建"），但因为它常被拿来和 <InlineCode>DELETE</InlineCode>
      对比清空数据，所以放在本章一起讲。
    </Callout>

    <Heading3>5.1 TRUNCATE 的用法</Heading3>
    <CodeBlock
      language="sql"
      code={`TRUNCATE TABLE emp;
-- TABLE 关键字可省略，写成 TRUNCATE emp; 也行`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>emp</InlineCode> 表瞬间被清空。
    </Paragraph>

    <Heading3>5.2 核心区别对比表</Heading3>
    <Table
      head={['对比项', 'DELETE FROM emp;', 'TRUNCATE TABLE emp;']}
      rows={[
        ['所属语言', 'DML（数据操作）', 'DDL（数据定义）'],
        [
          '删除方式',
          '逐行删除，每删一行记一条日志',
          '直接"删掉整张表再重建一个同结构的空表"',
        ],
        ['速度（大表）', '慢（行越多越慢）', '极快（几乎与行数无关）'],
        ['能否带 WHERE 条件删部分', '能（DELETE ... WHERE ...）', '不能，只能全清空'],
        [
          '事务与回滚',
          '在事务中可 ROLLBACK 撤销（数据能找回）',
          '不可回滚，删了就真没了',
        ],
        ['触发器 DELETE 触发器', '会触发', '不触发'],
        [
          '自增列 AUTO_INCREMENT',
          '不重置，继续接着原来的最大值',
          '重置归 1，下次插入 id 从 1 重新开始',
        ],
        ['返回的受影响行数', '真实删除的行数', '通常返回 0（它不是逐行删）'],
      ]}
    />

    <Heading3>5.3 用例子直观感受"自增是否重置"</Heading3>
    <Paragraph>这是两者最常被考、也最直观的差异。</Paragraph>
    <Paragraph>
      <Text bold>实验 A：用 DELETE 清空，自增不重置</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 假设 emp 此刻最大 id 是 5
DELETE FROM emp;                         -- 全删，表空了
INSERT INTO emp (ename, dept_id) VALUES ('新人', 1);
SELECT id FROM emp;                      -- 看看新人的 id`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：新人的 <InlineCode>id = 6</InlineCode>
      。虽然表被清空，但自增计数器"记得"曾经到过 5，继续从 6 发号。
    </Paragraph>
    <Paragraph>
      <Text bold>实验 B：用 TRUNCATE 清空，自增归 1</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 同样假设清空前最大 id 是 5
TRUNCATE TABLE emp;                      -- 删表重建，计数器归零
INSERT INTO emp (ename, dept_id) VALUES ('新人', 1);
SELECT id FROM emp;                      -- 看看新人的 id`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：新人的 <InlineCode>id = 1</InlineCode>。因为{' '}
      <InlineCode>TRUNCATE</InlineCode> 把表"重建"了，自增计数器回到初始值。
    </Paragraph>

    <Heading3>5.4 用例子感受"能否回滚"</Heading3>
    <CodeBlock
      language="sql"
      code={`START TRANSACTION;        -- 开启事务
DELETE FROM emp;          -- 把数据删光
SELECT COUNT(*) FROM emp; -- 结果：0（看起来没了）
ROLLBACK;                 -- 后悔了，回滚！
SELECT COUNT(*) FROM emp; -- 结果：恢复成 5，数据全回来了！`}
    />
    <Paragraph>
      <InlineCode>DELETE</InlineCode> 在事务里可以靠 <InlineCode>ROLLBACK</InlineCode>
      救回来。而 <InlineCode>TRUNCATE</InlineCode> 即使写在事务里，也
      <Text bold>无法靠 </Text>
      <InlineCode>ROLLBACK</InlineCode>
      <Text bold> 找回数据</Text>（它会隐式提交，删了就是删了）。
    </Paragraph>

    <Heading3>5.5 该用哪个？</Heading3>
    <Table
      head={['场景', '推荐']}
      rows={[
        ['只删一部分行（带条件）', '只能用 DELETE（TRUNCATE 不支持条件）'],
        ['需要事务保护、可能要反悔', '用 DELETE'],
        ['表上有需要触发的 DELETE 触发器', '用 DELETE'],
        ['想彻底清空大表、追求速度、且不需要反悔、希望自增归零', '用 TRUNCATE'],
      ]}
    />
    <Callout type="danger" title="常见坑">
      <InlineCode>TRUNCATE</InlineCode> 同样<Text bold>受外键约束限制</Text>
      。如果有别的表用外键引用了 <InlineCode>emp</InlineCode>，
      <InlineCode>TRUNCATE TABLE emp</InlineCode> 会被拒绝。另外{' '}
      <InlineCode>TRUNCATE</InlineCode> 没有"软删除/找回"机制，
      <Text bold>生产环境慎用</Text>，操作前务必确认表名没写错、确实要全清。
    </Callout>
    <Callout type="tip" title="顺带一提 DROP TABLE emp;">
      那是把<Text bold>整张表（结构 + 数据）一起删掉</Text>
      ，删完表都不存在了，连"空表"都没有。区别记忆：
      <InlineCode>DELETE</InlineCode>/<InlineCode>TRUNCATE</InlineCode> =
      倒空柜子里的东西（柜子还在）；<InlineCode>DROP</InlineCode> = 连柜子一起扔掉。
    </Callout>

    <Divider />

    <Subtitle>6. 综合实战：在 emp 表上完整走一遍增删改</Subtitle>
    <Paragraph>
      下面把本章知识串成一条完整的"业务剧情"，请按顺序执行体会。
      <Text bold>开始前先恢复初始数据</Text>（用第 0 节脚本{' '}
      <InlineCode>DROP</InlineCode> 后重建 <InlineCode>emp</InlineCode>，或确保它是初始的
      5 行）。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`USE db_learn;

-- ========== 增 INSERT ==========
-- 剧情1：研发部新招 2 名员工（一条语句插多行，显式列名）
INSERT INTO emp (ename, gender, salary, join_date, dept_id, bonus) VALUES
  ('阿强', '男', 9000, '2024-01-15', 1, 1000),
  ('阿珍', '女', 9200, '2024-02-20', 1, NULL);   -- 阿珍暂无奖金

-- 剧情2：新成立"运维部"并招 1 人（先建部门，再招人，注意外键依赖）
INSERT INTO dept (dept_name, loc) VALUES ('运维部', '深圳');         -- 假设生成 id=4
INSERT INTO emp (ename, gender, salary, join_date, dept_id) VALUES
  ('阿亮', '男', 8500, '2024-03-01', 4);                            -- 入职运维部，bonus 省略→NULL`}
    />
    <Paragraph>
      <Text bold>结果</Text>：<InlineCode>emp</InlineCode>
      新增 3 行（阿强、阿珍、阿亮），<InlineCode>dept</InlineCode>
      新增 1 行（运维部）。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ========== 改 UPDATE ==========
-- 剧情3：给市场部(dept_id=2)全员涨薪 5%
UPDATE emp SET salary = salary * 1.05 WHERE dept_id = 2;

-- 剧情4：把所有"无奖金(NULL)"的人统一补发 500（注意用 IS NULL，不能用 = NULL）
UPDATE emp SET bonus = 500 WHERE bonus IS NULL;

-- 剧情5：阿强表现优秀，单独涨薪到 12000 并发奖金 3000（多列同改 + 按主键精确定位）
UPDATE emp SET salary = 12000, bonus = 3000 WHERE ename = '阿强';`}
    />
    <Paragraph>
      <Text bold>结果</Text>：市场部每人工资 ×1.05；原本 bonus 为 NULL
      的人（李四、赵六、阿珍、阿亮……）bonus 变 500；阿强工资 12000、奖金 3000。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ========== 删 DELETE ==========
-- 剧情6：阿亮离职，删除其记录（按主键/唯一条件，安全）
DELETE FROM emp WHERE ename = '阿亮';

-- 剧情7：清退所有工资低于 7000 的员工（按条件删多行）
DELETE FROM emp WHERE salary < 7000;

-- 剧情8（演示外键保护）：试图解散没人了的"运维部"
DELETE FROM dept WHERE dept_name = '运维部';
--   若该部门已无员工引用，删除成功；
--   若还有员工的 dept_id 指向它，会报外键错误，需先处理员工再删部门。`}
    />
    <Paragraph>
      <Text bold>结果</Text>：阿亮被删；工资 &lt; 7000
      的员工被清退；只要运维部下已无员工，部门删除成功。
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ========== 验证：把改完的数据查出来看看 ==========
SELECT id, ename, gender, salary, dept_id, bonus FROM emp ORDER BY id;`}
    />
    <Callout type="tip" title="提示">
      上面剧情里我故意全程使用了"显式列名 INSERT""每条 UPDATE/DELETE 都带 WHERE""NULL
      用 IS NULL 判断"这些<Text bold>好习惯</Text>。请把它们当成肌肉记忆固定下来。
    </Callout>

    <Divider />

    <Subtitle>7. 一点延伸：DML 与事务（理解"为什么 DELETE 能反悔"）</Subtitle>
    <Paragraph>
      本章已经多次提到事务，这里做个最小化的说明，方便你理解"安全网"是怎么来的（事务的完整内容会在后续章节深入）。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>DML 语句默认是"自动提交"的</Text>：你执行完{' '}
        <InlineCode>INSERT/UPDATE/DELETE</InlineCode>，改动会
        <Text bold>立即永久生效</Text>（<InlineCode>autocommit=ON</InlineCode>
        ）。所以平时手滑删错了，往往来不及反悔。
      </ListItem>
      <ListItem>
        如果<Text bold>手动开启事务</Text>，改动会先"暂存"，直到你{' '}
        <InlineCode>COMMIT</InlineCode>（确认提交）才永久生效，或{' '}
        <InlineCode>ROLLBACK</InlineCode>（回滚）撤销：
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="sql"
      code={`START TRANSACTION;              -- 开启事务（手动接管提交）
UPDATE emp SET salary = 1;      -- 危险操作，但还没真正生效
SELECT salary FROM emp;         -- 一看全成 1 了，坏了！
ROLLBACK;                       -- 撤销！数据恢复到事务开始前
-- 如果确认无误，则用 COMMIT; 来永久提交`}
    />
    <Callout type="tip" title="提示">
      执行有风险的批量 <InlineCode>UPDATE/DELETE</InlineCode> 前，先{' '}
      <InlineCode>START TRANSACTION;</InlineCode>，改完用 <InlineCode>SELECT</InlineCode>
      核对，没问题再 <InlineCode>COMMIT</InlineCode>，有问题就{' '}
      <InlineCode>ROLLBACK</InlineCode>——这是工程上保命的标准动作。
    </Callout>

    <Divider />

    <Subtitle>本章小结</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>DML 三剑客</Text>：<InlineCode>INSERT</InlineCode>（增）、
        <InlineCode>UPDATE</InlineCode>（改）、<InlineCode>DELETE</InlineCode>
        （删）；查询用的 <InlineCode>SELECT</InlineCode> 属于 DQL，是下一章内容。
      </ListItem>
      <ListItem>
        <Text bold>INSERT</Text>
        <UnorderedList>
          <ListItem>
            标准写法 <InlineCode>INSERT INTO 表(列...) VALUES(值...)</InlineCode>，
            <Text bold>列与值一一对应</Text>，强烈建议<Text bold>显式写列名</Text>。
          </ListItem>
          <ListItem>
            省略列名则必须<Text bold>按表顺序给全部列的值</Text>，脆弱，不推荐。
          </ListItem>
          <ListItem>
            一条语句可插多行：<InlineCode>VALUES (..),(..),(..)</InlineCode>，
            <Text bold>效率更高</Text>，且是"全成功或全失败"的原子操作。
          </ListItem>
          <ListItem>
            自增列可<Text bold>省略 / 写 </Text>
            <InlineCode>NULL</InlineCode>
            <Text bold> / 写 </Text>
            <InlineCode>DEFAULT</InlineCode> 让其自动生成。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>值的写法</Text>：字符串和日期加<Text bold>单引号</Text>；数值
        <Text bold>不加</Text>引号；空值写 <InlineCode>NULL</InlineCode>（≠ 字符串{' '}
        <InlineCode>'NULL'</InlineCode>）；列与值顺序要严格对应。
      </ListItem>
      <ListItem>
        <Text bold>UPDATE</Text>：<InlineCode>UPDATE 表 SET 列=值,... WHERE 条件</InlineCode>
        ；等号右边可引用列自身（如 <InlineCode>salary = salary*1.1</InlineCode>）。
      </ListItem>
      <ListItem>
        <Text bold>DELETE</Text>：<InlineCode>DELETE FROM 表 WHERE 条件</InlineCode>
        ；删的是整行；受外键约束保护（删父表前要先处理子表）。
      </ListItem>
      <ListItem>
        <Text bold>❗最重要的安全红线</Text>：<InlineCode>UPDATE</InlineCode> /{' '}
        <InlineCode>DELETE</InlineCode>
        <Text bold> 不写 </Text>
        <InlineCode>WHERE</InlineCode>
        <Text bold> 会作用于全表</Text>！避免方法：开启{' '}
        <InlineCode>SQL_SAFE_UPDATES</InlineCode>、改删前先用相同{' '}
        <InlineCode>WHERE</InlineCode> 跑 <InlineCode>SELECT</InlineCode>
        确认、用事务 <InlineCode>START TRANSACTION ... ROLLBACK/COMMIT</InlineCode>{' '}
        兜底。
      </ListItem>
      <ListItem>
        <Text bold>判 NULL 用 </Text>
        <InlineCode>IS NULL</InlineCode> / <InlineCode>IS NOT NULL</InlineCode>
        ，绝不能用 <InlineCode>= NULL</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>DELETE vs TRUNCATE</Text>：DELETE
        逐行删、可带条件、可事务回滚、自增不重置；TRUNCATE
        删表重建、不能带条件、不可回滚、速度快、自增归 1、不触发触发器。
      </ListItem>
    </UnorderedList>

    <Subtitle>常见面试 / 易错问答</Subtitle>
    <Paragraph>
      <Text bold>
        Q1：<InlineCode>DELETE FROM emp;</InlineCode> 和{' '}
        <InlineCode>TRUNCATE TABLE emp;</InlineCode> 有什么区别？
      </Text>
    </Paragraph>
    <Paragraph>
      A：DELETE 是 DML、逐行删除、可加 WHERE 删部分、可在事务中回滚、不重置自增；TRUNCATE
      是 DDL、删表重建、只能全清、不可回滚、速度快、自增归 1、不触发删除触发器。需要按条件删或可能反悔时用
      DELETE，要快速彻底清空大表用 TRUNCATE。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q2：<InlineCode>DELETE</InlineCode>、<InlineCode>TRUNCATE</InlineCode>、
        <InlineCode>DROP</InlineCode> 三者的区别？
      </Text>
    </Paragraph>
    <Paragraph>
      A：DELETE 删行（数据，表在）；TRUNCATE 清空所有行（删表重建，表在但自增归
      1）；DROP 删整张表（结构和数据都没了，表都不存在了）。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q3：执行了 <InlineCode>UPDATE emp SET salary=1;</InlineCode>（忘了
        WHERE）该怎么补救？
      </Text>
    </Paragraph>
    <Paragraph>
      A：若开了事务且未提交，立刻 <InlineCode>ROLLBACK</InlineCode>
      ；若已自动提交，则只能靠备份/binlog 恢复。预防胜于补救：开启{' '}
      <InlineCode>SQL_SAFE_UPDATES</InlineCode>、先 SELECT 确认、用事务包裹。
    </Paragraph>
    <Paragraph>
      <Text bold>Q4：自增主键删了几行后，再插入会复用被删的 id 吗？</Text>
    </Paragraph>
    <Paragraph>
      A：不会。DELETE 不重置自增计数器，会继续从历史最大值 +1
      发号，留下空洞是正常的；只有 TRUNCATE（或重置{' '}
      <InlineCode>AUTO_INCREMENT</InlineCode>）才会让它从 1 重新开始。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q5：为什么 <InlineCode>WHERE bonus = NULL</InlineCode> 查不到/改不到任何行？
      </Text>
    </Paragraph>
    <Paragraph>
      A：NULL 表示"未知"，任何与 NULL 的 <InlineCode>=</InlineCode>、
      <InlineCode>&lt;&gt;</InlineCode> 比较结果都是"未知（既非真也非假）"，WHERE
      只保留结果为真的行，所以命中 0 行。判断空值必须用 <InlineCode>IS NULL</InlineCode>{' '}
      / <InlineCode>IS NOT NULL</InlineCode>。
    </Paragraph>
    <Paragraph>
      <Text bold>
        Q6：一条 <InlineCode>INSERT ... VALUES (..),(..),(..)</InlineCode>{' '}
        里有一行违反约束，会怎样？
      </Text>
    </Paragraph>
    <Paragraph>
      A：默认整条语句失败、全部回滚，一行都插不进去（原子性）。它不会"插成功的留下、失败的丢弃"。
    </Paragraph>
    <Paragraph>
      <Text bold>Q7：插入时自增列怎么写最好？</Text>
    </Paragraph>
    <Paragraph>
      A：最推荐在列清单里直接<Text bold>省略</Text>该列；也可写{' '}
      <InlineCode>NULL</InlineCode> 或 <InlineCode>DEFAULT</InlineCode>
      让数据库自动生成。不要手动指定具体值，以免和将来的自增冲突。
    </Paragraph>
  </article>
);

export default index;
