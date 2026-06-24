import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  Callout,
  Table,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>验证与排错</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        连上之后怎么确认「真的连上了 MySQL 而不是还在用 H2」，以及连接 / 测试常见报错怎么快速定位。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、确认应用真的连上了 MySQL</Subtitle>
    <Paragraph>看启动日志：</Paragraph>
    <UnorderedList>
      <ListItem>✅ <InlineCode>HikariPool-1 - Start completed</InlineCode></ListItem>
      <ListItem>✅ URL 是 <InlineCode>jdbc:mysql://localhost:3306/sms</InlineCode></ListItem>
      <ListItem>✅ <InlineCode>Started SmsApplication in X seconds</InlineCode></ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>二、持久化验证（MySQL vs H2 的本质区别）</Subtitle>
    <Paragraph>
      注册一个学生 → 在 DBeaver 刷新 <InlineCode>sms.student</InlineCode> 看到它 →
      <Text bold>停掉应用、重启、再查，数据还在</Text> = 真正落盘（H2 重启就没了）。
    </Paragraph>

    <Divider />

    <Subtitle>三、连接常见错误对照</Subtitle>
    <Table
      head={['报错', '多半原因']}
      rows={[
        ["Access denied for user 'root'", '用户名 / 密码错'],
        ['Communications link failure', 'MySQL 没启动 / 主机或端口错'],
        ["Unknown database 'sms'", '库名错（本项目有 createDatabaseIfNotExist，一般不会）'],
      ]}
    />

    <Divider />

    <Subtitle>四、看测试报错的正确姿势</Subtitle>
    <Paragraph>失败后看 <InlineCode>target/surefire-reports/*.txt</InlineCode>：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>ERROR</Text> = 上下文没起来（如配置 / 连接问题）；<Text bold>Failure</Text> = 跑起来了但断言不过。
      </ListItem>
      <ListItem>
        重点看 <InlineCode>Caused by</InlineCode> 那几行，它指向真正的根因。
      </ListItem>
    </UnorderedList>
  </article>
);

export default index;
