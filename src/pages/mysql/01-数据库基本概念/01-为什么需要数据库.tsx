import React from "react";
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
} from "@/components/doc";

const index: React.FC = () => (
  <article>
    <Title>为什么需要数据库</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        这是整套 MySQL 教程的第一章。在敲第一条 SQL 之前，我们先把“地基”打好：
        <Text bold>
          数据库到底解决了什么问题？为什么不用 txt、Excel 直接存数据？DB / DBMS
          / SQL
          三者是什么关系？市面上那么多数据库（Oracle、MySQL、Redis、MongoDB……）该怎么分类、怎么选？
        </Text>
      </Paragraph>
      <Paragraph>
        这些概念听起来“虚”，但它们决定了你后面所有操作的“心智模型”。本章不写很多
        SQL（毕竟环境还没装），重点是把概念讲透、把脑子里的地图画清楚。等你建立起“DBMS
        → 数据库 → 表 → 行/列”这套层级模型后，
        <Text bold>第 2 章安装 MySQL、第 3 章写第一条 SQL</Text> 都会水到渠成。
      </Paragraph>
      <Paragraph>
        读者画像：你已经会写代码（比如 Java），但对数据库不熟。所以本章会
        <Text bold>大量用 Java 类比</Text>，帮你把已有的知识迁移过来。
      </Paragraph>
    </Callout>

    <Paragraph>
      学任何技术，先问“它解决了什么痛点”，比直接背定义有用得多。
    </Paragraph>
    <Paragraph>假设你在做一个公司的“员工管理系统”，要存这样的数据：</Paragraph>

    <Table
      head={["员工编号", "姓名", "性别", "工资", "入职日期", "部门"]}
      rows={[
        ["1", "张三", "男", "8000", "2020-01-10", "研发部"],
        ["2", "李四", "男", "12000", "2019-03-15", "研发部"],
        ["3", "王五", "女", "9500", "2021-06-01", "市场部"],
      ]}
    />

    <Callout type="tip">
      上面这张表，正是我们整套教程会反复使用的 <InlineCode>emp</InlineCode>
      （员工）表。先混个眼熟，后面每一章都会见到它。
    </Callout>

    <Heading3>1.1 方案 A：用普通文件（txt / CSV / Excel）存</Heading3>
    <Paragraph>最朴素的想法是：把数据写进一个文件。比如用 CSV：</Paragraph>
    <CodeBlock
      language="text"
      code={`1,张三,男,8000,2020-01-10,研发部
2,李四,男,12000,2019-03-15,研发部
3,王五,女,9500,2021-06-01,市场部`}
    />
    <Paragraph>
      数据量小（几十行）时确实够用。但只要业务一长大，下面这 5
      个痛点会接连爆发。
    </Paragraph>

    <Heading4>痛点 1：查找慢（没有索引）</Heading4>
    <Paragraph>需求：“找出工资大于 9000 的员工”。</Paragraph>
    <Paragraph>
      用文件存，你只能写代码<Text bold>从头到尾一行行扫描</Text>
      （全文件遍历）。100 行还好，<Text bold>100 万行</Text>
      呢？每查一次都要把整个文件读一遍，慢得让人崩溃。
    </Paragraph>
    <Paragraph>
      而数据库可以建<Text bold>索引</Text>（类比“书的目录 /
      字典的偏旁部首检字表”）：不用翻完整本书，直接跳到目标位置。后面专门有一章讲索引，这里先记住一句话：
      <Text bold>数据库天生为“高效查找”而生</Text>。
    </Paragraph>

    <Heading4>痛点 2：并发访问会出乱子（无并发控制）</Heading4>
    <Paragraph>需求：A、B 两个人同时给“张三”发工资。</Paragraph>
    <UnorderedList>
      <ListItem>A 读到张三工资 8000，准备加 1000；</ListItem>
      <ListItem>与此同时 B 也读到 8000，准备加 2000；</ListItem>
      <ListItem>A 写回 9000，B 写回 10000……</ListItem>
    </UnorderedList>
    <Paragraph>
      最终张三的工资取决于“谁后写”，其中一笔加薪<Text bold>凭空消失</Text>
      了（这叫“丢失更新”）。普通文件没有任何机制阻止这种事，多个程序同时写一个文件，轻则数据错乱，重则文件损坏。
    </Paragraph>
    <Paragraph>
      数据库则提供<Text bold>锁</Text>和<Text bold>事务</Text>
      来保证并发安全（这是数据库的核心价值之一，后面有专章讲事务）。
    </Paragraph>

    <Heading4>痛点 3：数据冗余 + 不一致（无规范化）</Heading4>
    <Paragraph>
      注意上表里“研发部”出现了两次。如果研发部改名叫“技术部”，你得把
      <Text bold>每一行</Text>
      都改一遍。一旦漏改一行，数据库里就同时存在“研发部”和“技术部”，到底哪个对？这就是
      <Text bold>冗余导致的不一致</Text>。
    </Paragraph>
    <Paragraph>
      数据库可以把“部门”单独拆成一张 <InlineCode>dept</InlineCode>
      表，员工表里只存“部门编号”。改名时只改 <InlineCode>dept</InlineCode>
      表一处即可——这就是后面要讲的<Text bold>表的关系/范式设计</Text>。
    </Paragraph>

    <Heading4>痛点 4：没有数据校验（无约束）</Heading4>
    <Paragraph>
      文件不会拦你：性别字段你写个“abc”、工资写成负数、入职日期写成“昨天”，文件统统照单全收，等到程序读取时才报错（甚至不报错，直接算出离谱结果）。
    </Paragraph>
    <Paragraph>
      数据库可以加<Text bold>约束（Constraint）</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>工资必须是数字、不能为负；</ListItem>
      <ListItem>性别只能是“男/女”；</ListItem>
      <ListItem>员工编号不能重复（主键）；</ListItem>
      <ListItem>部门编号必须真实存在（外键）。</ListItem>
    </UnorderedList>
    <Paragraph>
      不合法的数据，<Text bold>根本插不进去</Text>——数据从源头就被守住了。
    </Paragraph>

    <Heading4>痛点 5：难共享、难备份、难权限管理</Heading4>
    <Paragraph>
      文件存在某台电脑上，别的程序、别的同事想用就得拷来拷去；想做“只能看不能改”的权限控制几乎不可能；想定时备份、想多人通过网络同时访问，更是难上加难。
    </Paragraph>
    <Paragraph>
      数据库是一个<Text bold>独立的服务（Server）</Text>
      ，所有人通过网络连接它、按权限访问同一份数据，备份、恢复、审计都有成熟方案。
    </Paragraph>

    <Heading3>1.2 小结：文件 vs 数据库</Heading3>
    <Table
      head={["能力", "普通文件（txt/Excel）", "数据库"]}
      rows={[
        ["海量数据查找", "慢，全文件扫描", "快，可建索引"],
        ["并发读写", "容易冲突、损坏", "锁 + 事务保证安全"],
        ["数据冗余/一致性", "难控制，易不一致", "可拆表、加约束"],
        ["数据校验", "无", "丰富的约束"],
        ["共享/权限/备份", "困难", "天生支持，方案成熟"],
      ]}
    />
    <Callout type="success" title="一句话总结">
      当数据量大、要被多人/多程序长期、安全、高效地访问时，就该上数据库。
    </Callout>
  </article>
);

export default index;
