import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  Callout,
  Table,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>核心概念厘清</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        本章记录从「裸机」到「用 Maven 跑起 Spring Boot 并连上 MySQL」的完整步骤与背后原理，
        是一次从零搭建 <Text bold>sms-spring</Text> 项目的企业级流程复盘。
      </Paragraph>
      <Paragraph>
        <Text bold>本机环境</Text>：Windows 11 · JDK 11 · 后装 Maven 3.9.x + MySQL 8.0 · 客户端用 DBeaver。
      </Paragraph>
      <Paragraph>
        <Text bold>为什么是 Spring Boot 2.7.x</Text>：Spring Boot 3.x 需要 JDK 17+，而本机是 JDK 11，
        所以选支持 Java 8/11 的最后一条产品线 2.7.x（用 <InlineCode>javax.*</InlineCode> 命名空间，而非 <InlineCode>jakarta.*</InlineCode>）。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>先厘清几个概念</Subtitle>
    <Paragraph>
      初学时最容易混淆「装什么、不装什么」。下面这张表把几个高频说法对应到它实际是什么：
    </Paragraph>
    <Table
      head={['说法', '实际是什么']}
      rows={[
        ['「安装 Maven」', '装一个构建工具：负责下载依赖、编译、测试、打包。必须装。'],
        [
          '「安装 Spring」',
          'Spring 不用单独安装。它只是一堆 jar 依赖，写在 pom.xml 里，mvn 会自动从中央仓库下载。',
        ],
        [
          '「安装数据库」',
          'MySQL 要装（一个独立的服务器软件）；H2 不用装（它是个 jar，随项目走）。',
        ],
        ['「连接数据库」', '让 Java 程序通过「驱动 + 地址 + 凭证」登录到数据库服务器。'],
      ]}
    />

    <Callout type="success" title="一句话总结">
      <Paragraph>
        <Text bold>Maven 和 MySQL 要装；Spring / H2 是依赖，不用装。</Text>
      </Paragraph>
    </Callout>
  </article>
);

export default index;
