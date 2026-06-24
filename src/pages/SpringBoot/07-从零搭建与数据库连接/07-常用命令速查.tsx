import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>常用命令速查</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        把前面用到的命令汇总成一页速查表，按「验证工具链 → 构建测试运行 → 灌种子 → 调接口」的顺序排列。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>验证工具链</Subtitle>
    <CodeBlock
      language="bash"
      code={`java -version
mvn -v`}
    />

    <Subtitle>构建 / 测试 / 运行（在 sms-spring/ 下）</Subtitle>
    <CodeBlock
      language="bash"
      code={`mvn clean test                                   # 跑测试（用 H2）
mvn clean package                                # 打 jar
mvn spring-boot:run                              # 启动（默认连 MySQL，无需 profile）
java -jar target/sms-spring-0.0.1-SNAPSHOT.jar   # 跑 jar`}
    />

    <Subtitle>手动给 MySQL 灌种子</Subtitle>
    <Paragraph>首次需要时执行；用 UTF-8 避免中文乱码：</Paragraph>
    <CodeBlock
      language="bash"
      code={`mysql -uroot -proot --default-character-set=utf8mb4 sms < src/main/resources/db/mysql-seed.sql`}
    />

    <Subtitle>调接口</Subtitle>
    <CodeBlock
      language="bash"
      code={`curl http://localhost:8080/api/classrooms
curl -X POST http://localhost:8080/api/students -H "Content-Type: application/json" -d "{\\"name\\":\\"Tom\\",\\"gender\\":\\"MALE\\",\\"age\\":8,\\"classroomId\\":1}"`}
    />

    <Callout type="warning" title="Windows 命令行中文坑">
      <Paragraph>
        Windows 命令行里 <InlineCode>curl -d</InlineCode> 直接写<Text bold>中文</Text>会乱码报 400（跟应用无关）；
        测中文用 Postman、或把 JSON 存成 UTF-8 文件再 <InlineCode>curl --data-binary @文件</InlineCode>，
        或用浏览器同源 <InlineCode>fetch</InlineCode>。
      </Paragraph>
    </Callout>
  </article>
);

export default index;
