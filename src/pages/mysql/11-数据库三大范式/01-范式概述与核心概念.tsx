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
    <Title>范式概述与核心概念</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        上一章我们学会了把数据拆成多张表、用主外键把它们关联起来。但马上会冒出一个问题：
        <Text bold>到底该拆到什么程度？</Text>{' '}
        一张表里放哪些列才算「设计得好」？拆得太碎查询麻烦，拆得太粗又会冗余混乱。
      </Paragraph>
      <Paragraph>
        数据库前辈们把「怎样设计才算合理」总结成了一套<Text bold>规范</Text>，叫做
        <Text bold>范式（Normal Form，NF）</Text>。本章要讲清楚三件事：
      </Paragraph>
      <OrderedList>
        <ListItem>
          范式到底是为了解决什么问题（答案：<Text bold>消除冗余、避免增删改异常</Text>）；
        </ListItem>
        <ListItem>
          第一范式 1NF、第二范式 2NF、第三范式 3NF <Text bold>各自要求什么</Text>
          ，怎么用例子判断一张表满不满足；
        </ListItem>
        <ListItem>
          工程实践中为什么有时又要<Text bold>反范式</Text>（故意冗余）。
        </ListItem>
      </OrderedList>
      <Paragraph>
        这一章是<Text bold>承上启下</Text>
        的：它把上一章「多表关系设计」上升到理论高度，告诉你拆表的依据；同时它是后面性能优化的基础——很多慢查询的根源就是表没设计好。本章沿用统一示例库{' '}
        <InlineCode>db_learn</InlineCode>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、为什么需要范式</Subtitle>

    <Heading3>1.1 从一个「什么都往里塞」的烂表说起</Heading3>
    <Paragraph>
      假设我们要管理「学生选课成绩」，图省事用一张大表全装下：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- ❌ 反面教材：学生、课程、老师、成绩全揉在一张表
CREATE TABLE study_bad (
  sno       INT,            -- 学号
  sname     VARCHAR(20),    -- 学生姓名
  cno       INT,            -- 课程号
  cname     VARCHAR(20),    -- 课程名
  teacher   VARCHAR(20),    -- 任课老师
  teacher_tel VARCHAR(20),  -- 老师电话
  score     INT             -- 成绩
);

INSERT INTO study_bad VALUES
  (1,'张三',101,'数据库','王老师','13800000001',90),
  (1,'张三',102,'操作系统','李老师','13800000002',85),
  (2,'李四',101,'数据库','王老师','13800000001',78),
  (2,'李四',102,'操作系统','李老师','13800000002',88);`}
    />
    <Paragraph>查出来：</Paragraph>
    <Table
      head={['sno', 'sname', 'cno', 'cname', 'teacher', 'teacher_tel', 'score']}
      rows={[
        ['1', '张三', '101', '数据库', '王老师', '13800000001', '90'],
        ['1', '张三', '102', '操作系统', '李老师', '13800000002', '85'],
        ['2', '李四', '101', '数据库', '王老师', '13800000001', '78'],
        ['2', '李四', '102', '操作系统', '李老师', '13800000002', '88'],
      ]}
    />

    <Heading3>1.2 烂表带来的四种「异常」</Heading3>
    <Paragraph>
      仔细看会发现「数据库 / 王老师 / 13800000001」这一串信息被重复存了很多遍——这就是
      <Text bold>数据冗余</Text>。冗余会引发四种典型问题：
    </Paragraph>
    <Table
      head={['异常', '含义', '在上表中的体现']}
      rows={[
        ['数据冗余', '同一份数据重复存储，浪费空间', '王老师的电话存了 N 遍（每个选数据库的学生一行）'],
        ['更新异常', '改一处要改很多行，漏改就不一致', '王老师换电话，要 UPDATE 所有「数据库」行，漏一行就两个电话并存'],
        ['插入异常', '想插入 A 数据却被迫连带 B 数据', '新开一门「编译原理」课但还没人选，没法单独录入这门课（没有 sno/score 这行插不进去，主键还会冲突）'],
        ['删除异常', '删 B 数据时把不该删的 A 也删没了', '选「操作系统」的人全退课，删完这些行后，李老师的信息也随之消失了'],
      ]}
    />
    <Paragraph>
      <Text bold>范式就是为了系统性地消除这些异常而诞生的设计规则。</Text>
    </Paragraph>

    <Heading3>1.3 范式的层级关系</Heading3>
    <Paragraph>
      范式由低到高是逐级递进的、<Text bold>包含关系</Text>：
    </Paragraph>
    <CodeBlock
      language="text"
      code={`1NF ⊃ 2NF ⊃ 3NF ⊃ BCNF ⊃ 4NF ⊃ 5NF`}
    />
    <UnorderedList>
      <ListItem>满足 2NF 的表，一定先满足 1NF；</ListItem>
      <ListItem>满足 3NF 的表，一定先满足 2NF；</ListItem>
      <ListItem>范式越高，冗余越小，但表越多、查询时连接越多。</ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>日常工作中，把表设计到第三范式（3NF）就足够了</Text>
      ，所以本章重点讲 1NF、2NF、3NF。
    </Paragraph>

    <Divider />

    <Subtitle>二、几个必须先搞懂的概念</Subtitle>
    <Paragraph>
      范式的定义里反复出现「函数依赖」「码」「主属性」这些术语，先用大白话讲清楚，否则后面看不懂。
    </Paragraph>

    <Heading3>2.1 函数依赖（Functional Dependency）</Heading3>
    <Callout type="note">
      <Text bold>如果知道了 A 就能唯一确定 B，就说 B 函数依赖于 A，记作 A → B。</Text>
    </Callout>
    <Paragraph>
      类比：知道了你的「身份证号」就能唯一确定你的「姓名」，所以{' '}
      <InlineCode>身份证号 → 姓名</InlineCode>。反过来不成立（同名的人很多）。
    </Paragraph>
    <Paragraph>在上面的烂表里：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>sno → sname</InlineCode>（知道学号就知道姓名）
      </ListItem>
      <ListItem>
        <InlineCode>cno → cname</InlineCode>（知道课程号就知道课程名）
      </ListItem>
      <ListItem>
        <InlineCode>cno → teacher</InlineCode>（这门课固定一个老师，知道课程号就知道老师）
      </ListItem>
      <ListItem>
        <InlineCode>teacher → teacher_tel</InlineCode>（知道老师就知道他电话）
      </ListItem>
      <ListItem>
        <InlineCode>(sno, cno) → score</InlineCode>（必须同时知道哪个学生、哪门课，才能确定成绩）
      </ListItem>
    </UnorderedList>

    <Heading3>2.2 完全函数依赖 vs 部分函数依赖</Heading3>
    <Paragraph>
      当依赖的「左边」是<Text bold>一组字段（联合）</Text>时，要进一步区分：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>完全函数依赖</Text>：B 依赖于 A 这<Text bold>整组</Text>
        字段，缺一个都不行。 例：<InlineCode>(sno, cno) → score</InlineCode>，光有 sno
        或光有 cno 都定不了成绩 → <Text bold>完全依赖</Text>。
      </ListItem>
      <ListItem>
        <Text bold>部分函数依赖</Text>：B 其实只依赖于 A 中的<Text bold>一部分</Text>
        字段。 例：<InlineCode>(sno, cno) → sname</InlineCode>，但实际上光靠{' '}
        <InlineCode>sno</InlineCode> 就能确定 <InlineCode>sname</InlineCode> 了，cno
        是多余的 → <Text bold>部分依赖</Text>。
      </ListItem>
    </UnorderedList>

    <Heading3>2.3 传递函数依赖</Heading3>
    <Callout type="note">
      A → B，B → C，且 B 不能反推 A，那么 A → C 就是<Text bold>传递依赖</Text>。
    </Callout>
    <Paragraph>
      例：<InlineCode>sno → teacher</InlineCode>（间接）、
      <InlineCode>teacher → teacher_tel</InlineCode>，于是{' '}
      <InlineCode>sno → teacher_tel</InlineCode> 是
      <Text bold>通过 teacher 绕了一道</Text>的传递依赖。
    </Paragraph>

    <Heading3>2.4 码（Key）与主属性</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>码（候选码）</Text>：能<Text bold>唯一确定一整行</Text>
        的最小字段组合。上面的烂表里，能定位一行的是{' '}
        <InlineCode>(sno, cno)</InlineCode>（学号+课程号），所以{' '}
        <InlineCode>(sno, cno)</InlineCode> 是码。
      </ListItem>
      <ListItem>
        <Text bold>主码（主键）</Text>：从候选码里选一个当主键。
      </ListItem>
      <ListItem>
        <Text bold>主属性</Text>：包含在任何一个码里的字段，如{' '}
        <InlineCode>sno</InlineCode>、<InlineCode>cno</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>非主属性</Text>：不在任何码里的字段，如{' '}
        <InlineCode>sname</InlineCode>、<InlineCode>cname</InlineCode>、
        <InlineCode>teacher</InlineCode>、<InlineCode>teacher_tel</InlineCode>、
        <InlineCode>score</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      记住这句话，后面 2NF/3NF 的定义都围绕它转：
      <Text bold>范式约束的核心，就是「非主属性」该怎样依赖「码」。</Text>
    </Callout>
  </article>
);

export default index;
