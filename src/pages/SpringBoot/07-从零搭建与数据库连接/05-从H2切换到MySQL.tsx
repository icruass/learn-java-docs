import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  Callout,
  OrderedList,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>从 H2 切换到 MySQL（我们走过的路）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        项目一开始用 H2 内存库快速跑起来，后来改成「应用用 MySQL、H2 只留给测试」的企业标准做法。
        本节复盘为什么这么选、H2 当初长在哪些地方，以及改造的具体步骤。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、为什么一开始用 H2</Subtitle>
    <Paragraph>
      H2 是<Text bold>用 Java 写的内存数据库</Text>，零安装、随应用启停、讲 SQL、走 JDBC。
      适合<Text bold>开发演示和跑测试</Text>：启动快、自包含。
      代价是数据在内存里、<Text bold>重启即丢</Text>，所以生产不用它。
    </Paragraph>

    <Divider />

    <Subtitle>二、H2 当初「长」在 5 个地方</Subtitle>
    <OrderedList>
      <ListItem><InlineCode>pom.xml</InlineCode> 的 <InlineCode>com.h2database:h2</InlineCode> 依赖</ListItem>
      <ListItem>
        <InlineCode>application.yml</InlineCode> 的 H2 数据源 + <InlineCode>h2.console</InlineCode> + <InlineCode>sql.init</InlineCode>
      </ListItem>
      <ListItem><InlineCode>data.sql</InlineCode>（H2 启动时自动灌的种子数据）</ListItem>
      <ListItem><InlineCode>application-mysql.yml</InlineCode>（为「切换」而存在的第二份配置）</ListItem>
      <ListItem>
        两个 <InlineCode>@SpringBootTest</InlineCode> 测试类（默认读 application.yml，即跑在 H2 上）
      </ListItem>
    </OrderedList>

    <Divider />

    <Subtitle>三、改造目标与步骤</Subtitle>
    <Callout type="tip" title="原则">
      <Paragraph>
        <Text bold>应用用 MySQL</Text>（数据要持久）；<Text bold>测试用 H2 内存库</Text>（要快、要自包含、不依赖本机 MySQL）。
      </Paragraph>
    </Callout>
    <OrderedList>
      <ListItem>
        <Text bold>改默认配置为 MySQL</Text>——把 <InlineCode>src/main/resources/application.yml</InlineCode> 改成 MySQL 数据源
        （url / driver / username / password + <InlineCode>ddl-auto: update</InlineCode> + <InlineCode>MySQL8Dialect</InlineCode>）。
      </ListItem>
      <ListItem>
        <Text bold>删切换用配置</Text>——删除 <InlineCode>application-mysql.yml</InlineCode>
        （默认已是 MySQL，不再需要 <InlineCode>--spring.profiles.active</InlineCode>）。
      </ListItem>
      <ListItem>
        <Text bold>删 H2 自动种子</Text>——删除 <InlineCode>src/main/resources/data.sql</InlineCode>
        （MySQL 的种子用 <InlineCode>db/mysql-seed.sql</InlineCode> 手动灌一次即可）。
      </ListItem>
      <ListItem>
        <Text bold>H2 降级为仅测试</Text>——<InlineCode>pom.xml</InlineCode> 里给 H2 依赖加
        <InlineCode>{'<scope>test</scope>'}</InlineCode>：打包 / 运行应用时不含 H2，只有 <InlineCode>mvn test</InlineCode> 时才有。
      </ListItem>
      <ListItem>
        <Text bold>给测试单配 H2</Text>——新建：
        <UnorderedList>
          <ListItem>
            <InlineCode>src/test/resources/application.yml</InlineCode>：指向 H2 内存库
            （<InlineCode>create-drop</InlineCode> + <InlineCode>defer-datasource-initialization: true</InlineCode>
            + <InlineCode>sql.init.mode: always</InlineCode> + <InlineCode>encoding: UTF-8</InlineCode>）。
          </ListItem>
          <ListItem>
            <InlineCode>src/test/resources/data.sql</InlineCode>：测试用种子数据（2 教室 + 2 老师）。
          </ListItem>
        </UnorderedList>
      </ListItem>
    </OrderedList>
    <Callout type="tip">
      <Paragraph>
        跑测试时 <InlineCode>src/test/resources</InlineCode> 的配置会<Text bold>盖过</Text> <InlineCode>src/main</InlineCode>，
        于是测试自动用 H2，和你的 MySQL 互不干扰。
      </Paragraph>
    </Callout>

    <Callout type="warning" title="踩过的坑">
      <UnorderedList>
        <ListItem>
          <InlineCode>spring.sql.init.mode: always</InlineCode> <Text bold>不允许 data.sql 是空文件</Text>，
          否则报 <InlineCode>{"'script' must not be null or empty"}</InlineCode>。要么文件有内容，要么干脆别建。
        </ListItem>
        <ListItem>
          读 <InlineCode>data.sql</InlineCode> 默认用平台字符集（Windows=GBK）→ 中文乱码。
          要加 <InlineCode>spring.sql.init.encoding: UTF-8</InlineCode>。
        </ListItem>
        <ListItem>
          实体（<InlineCode>@Entity</InlineCode>）的 setter <Text bold>不能是 final</Text>，
          否则 Hibernate 代理报 <InlineCode>Setter methods of lazy classes cannot be final</InlineCode>。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
