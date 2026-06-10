import React from 'react';
import {
  Title,
  Heading3,
  Heading4,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>UPDATE 修改数据</Title>
    <Callout type="note">
      在讲删除之前先讲修改，因为它和删除一样<Text bold>强依赖 </Text>
      <InlineCode>WHERE</InlineCode>，理解了 <InlineCode>WHERE</InlineCode>
      的重要性，再看删除就更警觉。
    </Callout>

    <Heading3>3.1 是什么 / 为什么</Heading3>
    <Paragraph>
      <InlineCode>UPDATE</InlineCode> 用于
      <Text bold>修改表中已存在的行的某些列的值</Text>
      。它不会增加或减少行数，只是把"现有行里的某些格子"改成新值。
    </Paragraph>
    <Paragraph>
      类比：在 Excel 里<Text bold>双击某个单元格，把里面的内容改掉</Text>。
    </Paragraph>

    <Heading3>3.2 语法格式</Heading3>
    <CodeBlock
      language="sql"
      code={`UPDATE 表名 SET 列1 = 值1, 列2 = 值2, ... WHERE 条件;`}
    />
    <Paragraph>
      <Text bold>逐项解释</Text>：
    </Paragraph>
    <Table
      head={['部分', '含义', '是否必须']}
      rows={[
        ['UPDATE 表名', '要改哪张表', '必须'],
        ['SET 列1=值1, 列2=值2', '把哪些列改成什么值（多列用逗号隔开）', '必须'],
        ['WHERE 条件', '只改满足条件的行', '语法上可省略，但实战中几乎必须写！'],
      ]}
    />

    <Heading3>3.3 示例：改一行</Heading3>
    <Callout type="note">
      操作前请确保是初始数据。给"张三"（id=1）涨薪到 8500，并补发奖金 1500。
    </Callout>
    <CodeBlock
      language="sql"
      code={`UPDATE emp SET salary = 8500, bonus = 1500 WHERE id = 1;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>Query OK, 1 row affected</InlineCode>
      （1 行受影响）。张三这一行变为：
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary', 'join_date', 'dept_id', 'bonus']}
      rows={[
        ['1', '张三', '男', '8500', '2020-01-10', '1', '1500'],
      ]}
    />

    <Heading3>3.4 示例：按条件改多行</Heading3>
    <Paragraph>
      <InlineCode>WHERE</InlineCode> 命中几行，就改几行。给
      <Text bold>研发部（dept_id=1）的所有人</Text>统一上调 10% 工资：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`UPDATE emp SET salary = salary * 1.1 WHERE dept_id = 1;`}
    />
    <Paragraph>
      <Text bold>逐项解释</Text>：<InlineCode>SET salary = salary * 1.1</InlineCode>
      表示"新工资 = 原工资 × 1.1"，等号右边可以引用列自己当前的值。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果</Text>（基于初始数据，研发部有张三 8000、李四 12000 两人）：
      <InlineCode>2 rows affected</InlineCode>。
    </Paragraph>
    <Table
      head={['id', 'ename', 'gender', 'salary（原→新）', 'dept_id']}
      rows={[
        ['1', '张三', '男', '8000 → 8800', '1'],
        ['2', '李四', '男', '12000 → 13200', '1'],
      ]}
    />

    <Heading3>3.5 ⚠️ 最危险的一点：UPDATE 不写 WHERE = 全表都改！</Heading3>
    <Paragraph>
      <Text bold>
        <InlineCode>WHERE</InlineCode> 是"筛选哪些行"的条件。如果不写{' '}
        <InlineCode>WHERE</InlineCode>，UPDATE 会作用于表里的每一行。
      </Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 💀 灾难示例：忘写 WHERE，全公司每个人的工资都被改成 1 块钱！
UPDATE emp SET salary = 1;`}
    />
    <Paragraph>
      <Text bold>执行结果</Text>：<InlineCode>N rows affected</InlineCode>（N =
      全表行数），<Text bold>所有员工的 salary 全变成 1</Text>
      。这种事故在生产环境足以让人"卷铺盖走人"。
    </Paragraph>

    <Heading4>如何避免"忘写 WHERE"的灾难</Heading4>
    <OrderedList>
      <ListItem>
        <Text bold>开启"安全更新模式"</Text>
        <InlineCode>sql_safe_updates</InlineCode>（强烈推荐给 MySQL
        命令行/客户端）。开启后，
        <Text bold>
          没有 <InlineCode>WHERE</InlineCode>（或 <InlineCode>WHERE</InlineCode>{' '}
          没用到主键/索引键）的 UPDATE/DELETE 会被直接拒绝执行
        </Text>
        ：
        <CodeBlock
          language="sql"
          code={`SET SQL_SAFE_UPDATES = 1;     -- 1=开启，0=关闭`}
        />
        <Paragraph>
          开启后再执行 <InlineCode>UPDATE emp SET salary = 1;</InlineCode> 会报错：
          <InlineCode>
            Error Code: 1175. You are using safe update mode and you tried to update a
            table without a WHERE that uses a KEY column ...
          </InlineCode>
          （你处于安全更新模式，却尝试在没有用到键列的 WHERE 的情况下更新表。）
        </Paragraph>
        <Callout type="tip" title="提示">
          在 MySQL Workbench 里这个选项默认就是开着的，这也是为什么很多人发现"在
          Workbench 里没法不写 WHERE"。
        </Callout>
      </ListItem>
      <ListItem>
        <Text bold>先 </Text>
        <InlineCode>SELECT</InlineCode>
        <Text bold> 后 </Text>
        <InlineCode>UPDATE</InlineCode>：改之前，先用同样的{' '}
        <InlineCode>WHERE</InlineCode> 跑一遍 <InlineCode>SELECT</InlineCode>
        ，确认"命中的就是你想改的那些行"，再把 <InlineCode>SELECT ... FROM</InlineCode>
        换成 <InlineCode>UPDATE ... SET</InlineCode>。
        <CodeBlock
          language="sql"
          code={`-- 第一步：先查，确认范围对不对
SELECT * FROM emp WHERE dept_id = 1;
-- 第二步：确认无误后再改
UPDATE emp SET salary = salary * 1.1 WHERE dept_id = 1;`}
        />
      </ListItem>
      <ListItem>
        <Text bold>包在事务里</Text>：手动开事务，改完先看结果，不对就{' '}
        <InlineCode>ROLLBACK</InlineCode> 回滚（详见第 5 节）。
      </ListItem>
    </OrderedList>
    <Callout type="danger" title="常见坑：WHERE 条件命中 0 行">
      如果 <InlineCode>WHERE id = 9999</InlineCode> 而表里没有这个 id，语句
      <Text bold>不会报错</Text>，只是 <InlineCode>0 rows affected</InlineCode>（0
      行受影响）——什么都没改。看到"0 行受影响"要警觉：是不是条件写错了？
    </Callout>
    <Callout type="danger" title="常见坑：判断 NULL 不能用 =">
      <Paragraph>
        想把"没有奖金的人"的 bonus 设为 0，<Text bold>不能</Text>写{' '}
        <InlineCode>WHERE bonus = NULL</InlineCode>（它永远不成立，命中 0 行），必须用{' '}
        <InlineCode>IS NULL</InlineCode>：
      </Paragraph>
      <CodeBlock
        language="sql"
        code={`UPDATE emp SET bonus = 0 WHERE bonus IS NULL;   -- ✅ 正确
-- UPDATE emp SET bonus = 0 WHERE bonus = NULL;  -- ❌ 命中 0 行，无效果`}
      />
    </Callout>

    <Divider />
  </article>
);

export default index;
