import React from 'react';
import {
  Title,
  Heading3,
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
    <Title>关系型数据库 RDBMS：表 + 关系 + ACID</Title>
    <Paragraph>
      上面讲的“用二维表存数据、表和表之间有关系”，正是
      <Text bold>关系型数据库（RDBMS，Relational DataBase Management System）</Text>
      的核心思想。我们这套教程的主角 MySQL，就是关系型数据库。
    </Paragraph>

    <Heading3>4.1 “关系”体现在哪？</Heading3>
    <Paragraph>
      “关系型”不只是说“表是一种关系”，更重要的是<Text bold>表与表之间能建立联系</Text>
      。回到痛点 3：我们把“部门”从员工表里拆出去，单独建一张{' '}
      <InlineCode>dept</InlineCode> 表：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 部门表：每个部门一行
CREATE TABLE dept (
    id INT PRIMARY KEY AUTO_INCREMENT,   -- 部门编号
    dept_name VARCHAR(20),               -- 部门名称
    loc VARCHAR(20)                      -- 所在城市
);

INSERT INTO dept (dept_name, loc) VALUES
    ('研发部','北京'),
    ('市场部','上海'),
    ('财务部','广州');`}
    />
    <Paragraph>
      <InlineCode>dept</InlineCode> 表的内容：
    </Paragraph>
    <Table
      head={['id', 'dept_name', 'loc']}
      rows={[
        ['1', '研发部', '北京'],
        ['2', '市场部', '上海'],
        ['3', '财务部', '广州'],
      ]}
    />
    <Paragraph>
      然后员工表 <InlineCode>emp</InlineCode> 只存一个{' '}
      <InlineCode>dept_id</InlineCode>（部门编号），用它“指向”{' '}
      <InlineCode>dept</InlineCode> 表里的某一行——这就是<Text bold>外键关系</Text>：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`CREATE TABLE emp (
    id INT PRIMARY KEY AUTO_INCREMENT,   -- 员工编号
    ename VARCHAR(20),                   -- 姓名
    gender CHAR(1),                      -- 性别 男/女
    salary DOUBLE,                       -- 工资
    join_date DATE,                      -- 入职日期
    dept_id INT,                         -- 所属部门(外键 -> dept.id)
    bonus DOUBLE,                        -- 奖金(可能为 NULL)
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES dept(id)
);`}
    />
    <Paragraph>这样一来：</Paragraph>
    <UnorderedList>
      <ListItem>
        研发部改名，只改 <InlineCode>dept</InlineCode>
        表一处，所有员工“自动”跟着变（因为他们只是引用编号）——解决了冗余/不一致。
      </ListItem>
      <ListItem>
        <InlineCode>dept_id</InlineCode> 必须是 <InlineCode>dept</InlineCode> 表里
        <Text bold>真实存在</Text>的编号，否则插不进去——这就是外键约束的“校验”。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      表间关系有三种典型形态，后面会专章讲，这里先有个印象：
      <UnorderedList>
        <ListItem>
          <Text bold>一对多</Text>：一个部门有多个员工（
          <InlineCode>dept</InlineCode> ↔ <InlineCode>emp</InlineCode>）。
        </ListItem>
        <ListItem>
          <Text bold>多对多</Text>：一个学生选多门课，一门课有多个学生（用中间表{' '}
          <InlineCode>student_course</InlineCode> 连接 <InlineCode>student</InlineCode>{' '}
          和 <InlineCode>course</InlineCode>）。
        </ListItem>
        <ListItem>
          <Text bold>一对一</Text>：一个人对应一张身份证（
          <InlineCode>person</InlineCode> ↔ <InlineCode>card</InlineCode>）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>4.2 ACID：关系型数据库的“四大金刚”</Heading3>
    <Paragraph>
      关系型数据库最被信赖的原因，是它的<Text bold>事务（Transaction）</Text>满足{' '}
      <Text bold>ACID</Text> 四大特性。<Text bold>事务</Text>
      就是“一组要么全做、要么全不做的操作”，最经典的例子是<Text bold>银行转账</Text>
      ：A 给 B 转 100 元 = “A 减 100” + “B 加 100”，这两步必须捆成一个整体。
    </Paragraph>
    <Table
      head={['字母', '特性', '英文', '一句话解释', '转账例子']}
      rows={[
        ['A', '原子性', 'Atomicity', '一组操作要么全成功，要么全失败（不可分割）', '“A 扣钱”和“B 加钱”不能只做一半'],
        ['C', '一致性', 'Consistency', '操作前后，数据始终处于“合法/正确”的状态', '转账前后，两人总金额不变'],
        ['I', '隔离性', 'Isolation', '多个事务并发执行时互不干扰', '别人同时转账，不会看到你“扣了但没到账”的中间态'],
        ['D', '持久性', 'Durability', '事务一旦提交，结果永久保存（断电也不丢）', '转账成功后，就算服务器立刻断电，钱也已到账'],
      ]}
    />
    <Callout type="warning">
      ACID 是关系型数据库相比文件、相比很多 NoSQL 的<Text bold>核心优势</Text>
      。涉及钱、订单、库存这类“一分都不能错”的业务，几乎都选关系型数据库。事务和
      ACID 后面有专门一整章详讲，这里先记住这四个字母代表什么。
    </Callout>
  </article>
);

export default index;
