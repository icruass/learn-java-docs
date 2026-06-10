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
  UnorderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>条件查询 WHERE</Title>

    <Paragraph>
      前面查的都是"整张表所有行"。但真实场景里我们往往只要<Text bold>满足某些条件的行</Text>
      ——比如"工资大于 1 万的员工""研发部的人"。这就需要 <InlineCode>WHERE</InlineCode> 子句。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT 列名列表 FROM 表名 WHERE 条件;`} />
    <UnorderedList>
      <ListItem>
        <InlineCode>WHERE</InlineCode> 写在 <InlineCode>FROM</InlineCode> 后面。
      </ListItem>
      <ListItem>
        "条件"是一个<Text bold>布尔表达式</Text>，结果为"真（true）"的行才会被查出来。
      </ListItem>
      <ListItem>
        可以把它理解成一个<Text bold>筛子</Text>
        ：一行一行地过，条件成立的留下，不成立的丢掉。
      </ListItem>
    </UnorderedList>

    <Heading3>4.1 比较运算符</Heading3>
    <Paragraph>
      <InlineCode>WHERE</InlineCode> 里最常用的就是比较运算符。
    </Paragraph>
    <Table
      head={['运算符', '含义', '示例']}
      rows={[
        ['=', '等于', "salary = 8000"],
        ['>', '大于', 'salary > 10000'],
        ['<', '小于', 'salary < 8000'],
        ['>=', '大于等于', 'salary >= 9500'],
        ['<=', '小于等于', 'salary <= 8000'],
        ['!=', '不等于', "gender != '男'"],
        ['<>', '不等于', "gender <> '男'"],
      ]}
    />
    <Callout type="tip">
      提示：<InlineCode>!=</InlineCode> 和 <InlineCode>&lt;&gt;</InlineCode>{' '}
      完全等价，都表示"不等于"。<InlineCode>&lt;&gt;</InlineCode> 是标准 SQL 写法，
      <InlineCode>!=</InlineCode> 是大多数程序员更习惯的写法，两者随便用。
    </Callout>
    <Callout type="warning">
      注意：判断"相等"用<Text bold>一个等号 `=`</Text>，不是编程语言里的{' '}
      <InlineCode>==</InlineCode>！MySQL 里写 <InlineCode>==</InlineCode> 会报错。
    </Callout>
    <Paragraph>
      <Text bold>示例 1：查询工资大于 10000 的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary FROM emp WHERE salary > 10000;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary']}
      rows={[
        ['李四', '12000'],
        ['孙七', '15000'],
      ]}
    />
    <Paragraph>
      <Text bold>示例 2：查询所有女员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, gender, salary FROM emp WHERE gender = '女';`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'gender', 'salary']}
      rows={[
        ['王五', '女', '9500'],
        ['赵六', '女', '6000'],
      ]}
    />
    <Callout type="warning">
      注意：字符串值（如 <InlineCode>'女'</InlineCode>、<InlineCode>'男'</InlineCode>）必须用
      <Text bold>单引号</Text>括起来。数字（如 <InlineCode>10000</InlineCode>）不用加引号。
    </Callout>
    <Paragraph>
      <Text bold>示例 3：查询不是研发部（dept_id 不等于 1）的员工</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, dept_id FROM emp WHERE dept_id != 1;
-- 等价：WHERE dept_id <> 1;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id']}
      rows={[
        ['王五', '2'],
        ['赵六', '2'],
        ['孙七', '3'],
      ]}
    />

    <Heading3>4.2 范围查询 BETWEEN ... AND ...</Heading3>
    <Paragraph>
      当条件是"在某个区间内"时，可以用 <InlineCode>BETWEEN ... AND ...</InlineCode>
      ，比写两个 <InlineCode>&gt;=</InlineCode> 和 <InlineCode>&lt;=</InlineCode> 更简洁。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`WHERE 列名 BETWEEN 下限 AND 上限;`} />
    <UnorderedList>
      <ListItem>
        含义：列值 <Text bold>大于等于</Text> 下限 <Text bold>且 小于等于</Text> 上限。
      </ListItem>
      <ListItem>
        <Text bold>是闭区间（包含两端）</Text>，等价于{' '}
        <InlineCode>列名 &gt;= 下限 AND 列名 &lt;= 上限</InlineCode>。
      </ListItem>
      <ListItem>下限必须写在前、上限写在后，写反了查不到数据。</ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：查询工资在 8000 到 12000 之间（含 8000 和 12000）的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary FROM emp WHERE salary BETWEEN 8000 AND 12000;`} />
    <Paragraph>
      <Text bold>执行结果（8000 和 12000 都被包含进来了）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary']}
      rows={[
        ['张三', '8000'],
        ['李四', '12000'],
        ['王五', '9500'],
      ]}
    />
    <Paragraph>它完全等价于：</Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary FROM emp WHERE salary >= 8000 AND salary <= 12000;`} />
    <Callout type="danger">
      常见坑：<InlineCode>BETWEEN a AND b</InlineCode> 一定要 <Text bold>a ≤ b</Text>。如果写成{' '}
      <InlineCode>BETWEEN 12000 AND 8000</InlineCode>（大的在前），结果会是
      <Text bold>空集</Text>，因为没有任何值能"同时大于等于 12000 又小于等于 8000"。
    </Callout>
    <Callout type="tip">
      提示：<InlineCode>BETWEEN ... AND ...</InlineCode> 也能用于<Text bold>日期</Text>
      。比如查 2020 年至 2021 年入职的：
      <InlineCode>WHERE join_date BETWEEN '2020-01-01' AND '2021-12-31'</InlineCode>。
    </Callout>

    <Heading3>4.3 集合查询 IN (...)</Heading3>
    <Paragraph>
      当条件是"等于这几个值中的任意一个"时，用 <InlineCode>IN</InlineCode>，比写一堆{' '}
      <InlineCode>OR</InlineCode> 清爽得多。
    </Paragraph>
    <Paragraph>
      <Text bold>语法格式：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`WHERE 列名 IN (值1, 值2, 值3, ...);`} />
    <UnorderedList>
      <ListItem>
        含义：列值<Text bold>等于括号里任意一个值</Text>就算匹配。
      </ListItem>
      <ListItem>
        等价于 <InlineCode>列名 = 值1 OR 列名 = 值2 OR ...</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>示例：查询研发部（1）和财务部（3）的员工</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, dept_id FROM emp WHERE dept_id IN (1, 3);`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id']}
      rows={[
        ['张三', '1'],
        ['李四', '1'],
        ['孙七', '3'],
      ]}
    />
    <Paragraph>它等价于（但啰嗦得多）：</Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, dept_id FROM emp WHERE dept_id = 1 OR dept_id = 3;`} />
    <Paragraph>
      <Text bold>取反：用 `NOT IN` 查"不在这些值里"的</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, dept_id FROM emp WHERE dept_id NOT IN (1, 3);`} />
    <Paragraph>
      <Text bold>执行结果（只剩 2 号部门的人）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id']}
      rows={[
        ['王五', '2'],
        ['赵六', '2'],
      ]}
    />
    <Callout type="danger">
      常见坑：<InlineCode>NOT IN</InlineCode> 遇到 <InlineCode>NULL</InlineCode>{' '}
      会很诡异。如果 <InlineCode>IN</InlineCode> 的列表里包含 <InlineCode>NULL</InlineCode>（如{' '}
      <InlineCode>NOT IN (1, NULL)</InlineCode>
      ），整个条件可能永远返回"非真"，导致查不到任何数据。原因还是{' '}
      <InlineCode>NULL</InlineCode> 的"未知"特性（见下一节）。所以
      <Text bold>用 `NOT IN` 时务必保证列表里没有 NULL</Text>。
    </Callout>

    <Heading3>4.4 NULL 的判断：IS NULL / IS NOT NULL</Heading3>
    <Paragraph>
      这是初学者<Text bold>最容易踩的坑</Text>之一，必须单独拎出来重点讲。
    </Paragraph>
    <Paragraph>
      <Text bold>
        核心规则：判断一个值是不是 `NULL`，必须用 `IS NULL` / `IS NOT NULL`，绝对不能用
        `= NULL` 或 `!= NULL`。
      </Text>
    </Paragraph>
    <Paragraph>
      <Text bold>为什么不能用 `= NULL`？</Text>
    </Paragraph>
    <Paragraph>
      因为 <InlineCode>NULL</InlineCode> 的语义是<Text bold>"未知"</Text>。在 SQL 的三值逻辑（true
      / false / <Text bold>unknown</Text>）里：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>任何值 = NULL</InlineCode> 的结果不是 true 也不是 false，而是{' '}
        <Text bold>unknown（未知）</Text>；
      </ListItem>
      <ListItem>
        <InlineCode>WHERE</InlineCode> 只保留结果为 <Text bold>true</Text> 的行，
        <InlineCode>unknown</InlineCode> 会被当作"不满足"丢弃。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      用大白话讲：你问"某人的奖金等于'未知'吗？"——这个问题本身就没法回答"是"或"否"，所以
      MySQL 给你 <InlineCode>unknown</InlineCode>，于是一行都查不出来。
    </Paragraph>
    <Paragraph>
      <Text bold>反面示例（错误写法，查不到任何数据）：</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, bonus FROM emp WHERE bonus = NULL;`} />
    <Paragraph>
      <Text bold>执行结果：空集（Empty set），一行都没有！</Text> 明明李四、赵六的 bonus 是
      NULL，却查不出来。
    </Paragraph>
    <Paragraph>
      <Text bold>正确写法：用 `IS NULL`</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, bonus FROM emp WHERE bonus IS NULL;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'bonus']}
      rows={[
        ['李四', 'NULL'],
        ['赵六', 'NULL'],
      ]}
    />
    <Paragraph>
      <Text bold>反向：查"有奖金"的（bonus 不为 NULL），用 `IS NOT NULL`</Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, bonus FROM emp WHERE bonus IS NOT NULL;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'bonus']}
      rows={[
        ['张三', '1000'],
        ['王五', '2000'],
        ['孙七', '3000'],
      ]}
    />
    <Callout type="warning">
      <Paragraph>注意（务必牢记）：</Paragraph>
      <UnorderedList>
        <ListItem>
          判断为空：<InlineCode>IS NULL</InlineCode> ✅，<InlineCode>= NULL</InlineCode> ❌
        </ListItem>
        <ListItem>
          判断非空：<InlineCode>IS NOT NULL</InlineCode> ✅，<InlineCode>!= NULL</InlineCode> ❌、
          <InlineCode>&lt;&gt; NULL</InlineCode> ❌
        </ListItem>
      </UnorderedList>
      <Paragraph>这是 MySQL 笔试面试的高频考点，也是实际写 bug 的高发区。</Paragraph>
    </Callout>

    <Heading3>4.5 逻辑运算符 AND / OR / NOT</Heading3>
    <Paragraph>
      当一个查询有<Text bold>多个条件</Text>时，用逻辑运算符把它们连起来。
    </Paragraph>
    <Table
      head={['逻辑运算符', '等价符号', '含义', '通俗理解']}
      rows={[
        ['AND', '&&', '两个条件都成立才为真', '"并且 / 而且"'],
        ['OR', '||', '两个条件有一个成立就为真', '"或者"'],
        ['NOT', '!', '对条件取反（真变假、假变真）', '"不 / 非"'],
      ]}
    />
    <Callout type="tip">
      提示：<InlineCode>AND</InlineCode>/<InlineCode>OR</InlineCode>/
      <InlineCode>NOT</InlineCode> 是标准写法，可读性好，<Text bold>强烈推荐用单词形式</Text>。
      <InlineCode>&&</InlineCode>/<InlineCode>||</InlineCode>/<InlineCode>!</InlineCode> 是 MySQL
      提供的等价符号，能用但不推荐（其它数据库未必支持，且容易和编程语言混淆）。
    </Callout>
    <Paragraph>
      <Text bold>
        示例 1：AND——查"男性"且"工资大于 10000"的员工（两个条件都要满足）
      </Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, gender, salary FROM emp WHERE gender = '男' AND salary > 10000;`}
    />
    <Paragraph>
      <Text bold>执行结果（张三是男但工资 8000 不满足，被排除）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'gender', 'salary']}
      rows={[
        ['李四', '男', '12000'],
        ['孙七', '男', '15000'],
      ]}
    />
    <Paragraph>
      <Text bold>
        示例 2：OR——查"工资低于 7000"或"工资高于 14000"的员工（满足其一即可）
      </Text>
    </Paragraph>
    <CodeBlock language="sql" code={`SELECT ename, salary FROM emp WHERE salary < 7000 OR salary > 14000;`} />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'salary']}
      rows={[
        ['赵六', '6000'],
        ['孙七', '15000'],
      ]}
    />
    <Paragraph>
      <Text bold>示例 3：NOT——查"不是研发部"的员工</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, dept_id FROM emp WHERE NOT dept_id = 1;
-- 等价于 WHERE dept_id != 1;`}
    />
    <Paragraph>
      <Text bold>执行结果：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id']}
      rows={[
        ['王五', '2'],
        ['赵六', '2'],
        ['孙七', '3'],
      ]}
    />

    <Heading4>优先级与括号</Heading4>
    <Paragraph>
      当 <InlineCode>AND</InlineCode> 和 <InlineCode>OR</InlineCode> 混用时，要特别小心
      <Text bold>优先级</Text>：<Text bold>`NOT` &gt; `AND` &gt; `OR`</Text>（NOT 最高，AND
      次之，OR 最低）。也就是说，<InlineCode>AND</InlineCode> 会<Text bold>先</Text>于{' '}
      <InlineCode>OR</InlineCode> 结合。
    </Paragraph>
    <Paragraph>
      <Text bold>易错示例：想查"研发部或市场部里，工资大于 9000 的人"</Text>
    </Paragraph>
    <Paragraph>如果不加括号这样写：</Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ❌ 含义被理解错了
SELECT ename, dept_id, salary FROM emp
WHERE dept_id = 1 OR dept_id = 2 AND salary > 9000;`}
    />
    <Paragraph>
      由于 <InlineCode>AND</InlineCode> 优先级高，它实际被理解成：
    </Paragraph>
    <CodeBlock language="sql" code={`WHERE dept_id = 1 OR (dept_id = 2 AND salary > 9000);`} />
    <Paragraph>
      意思变成了"<Text bold>所有研发部的人</Text> 或者 <Text bold>市场部里工资&gt;9000的人</Text>
      "，这不是我们要的。
    </Paragraph>
    <Paragraph>
      <Text bold>执行结果（张三 8000 也被查出来了，因为他属于研发部）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id', 'salary']}
      rows={[
        ['张三', '1', '8000'],
        ['李四', '1', '12000'],
        ['王五', '2', '9500'],
      ]}
    />
    <Paragraph>
      <Text bold>正确写法：用括号 `()` 明确分组</Text>
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`SELECT ename, dept_id, salary FROM emp
WHERE (dept_id = 1 OR dept_id = 2) AND salary > 9000;`}
    />
    <Paragraph>
      <Text bold>执行结果（张三 8000 被正确排除）：</Text>
    </Paragraph>
    <Table
      head={['ename', 'dept_id', 'salary']}
      rows={[
        ['李四', '1', '12000'],
        ['王五', '2', '9500'],
      ]}
    />
    <Callout type="danger">
      常见坑：<Text bold>只要 `AND` 和 `OR` 同时出现，就老老实实加括号！</Text>{' '}
      不要去赌优先级，括号既能保证逻辑正确，又能让别人一眼看懂。这是写 SQL 的好习惯。
    </Callout>
  </article>
);

export default index;
