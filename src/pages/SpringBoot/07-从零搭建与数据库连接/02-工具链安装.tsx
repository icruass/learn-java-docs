import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  OrderedList,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>工具链安装</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        按「<Text bold>Maven 和 MySQL 要装；Spring / H2 不用装</Text>」的结论，
        这一节把必须装的三样工具——JDK、Maven、MySQL——逐个装好并验证。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、确认 JDK（已有 JDK 11）</Subtitle>
    <CodeBlock
      language="bash"
      code={`java -version          # 看到 11.x 即可
echo %JAVA_HOME%       # CMD；Git Bash 用 echo $JAVA_HOME`}
    />
    <Callout type="warning" title="常见坑：JAVA_HOME 指向 JDK 根目录">
      <Paragraph>
        <InlineCode>JAVA_HOME</InlineCode> 必须指向 JDK <Text bold>根目录</Text>，例如
        <InlineCode>C:\Program Files\Java\jdk-11.0.16</InlineCode>——结尾不能带 <InlineCode>\bin</InlineCode>，
        否则 Maven 报 <InlineCode>JAVA_HOME is set to an invalid directory</InlineCode>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>二、安装 Maven</Subtitle>
    <OrderedList>
      <ListItem>
        到 <InlineCode>https://maven.apache.org/download.cgi</InlineCode> 下载 <Text bold>Binary zip</Text>
        （<InlineCode>apache-maven-3.9.x-bin.zip</InlineCode>）。
      </ListItem>
      <ListItem>解压到不带中文 / 空格的路径，例如 <InlineCode>D:\maven</InlineCode>。</ListItem>
      <ListItem>
        配环境变量（Win11 搜「编辑系统环境变量」→ 环境变量）：
        <UnorderedList>
          <ListItem>新建 <InlineCode>MAVEN_HOME</InlineCode> = <InlineCode>D:\maven</InlineCode></ListItem>
          <ListItem>编辑 <InlineCode>Path</InlineCode>，新增 <InlineCode>%MAVEN_HOME%\bin</InlineCode></ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        <Text bold>开新终端</Text>验证（旧终端不会刷新环境变量）：
      </ListItem>
    </OrderedList>
    <CodeBlock language="bash" code={`mvn -v`} />
    <Paragraph>
      应输出 Maven 版本、Maven home、以及正确的 <InlineCode>Java version</InlineCode> 和 <InlineCode>JAVA_HOME</InlineCode>。
    </Paragraph>
    <Callout type="tip" title="Maven 是干嘛的">
      <Paragraph>
        管依赖（自动下 jar）、按标准目录结构编译、跑测试、打包成 jar。
        企业里几乎不靠「在 IDE 点运行」，而靠 Maven 的生命周期命令。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>三、安装 MySQL 8</Subtitle>
    <OrderedList>
      <ListItem>
        到 <InlineCode>https://dev.mysql.com/downloads/installer/</InlineCode> 下载体积大的
        <Text bold>MySQL Installer</Text>（完整离线版），底部「No thanks, just start my download」直接下。
      </ListItem>
      <ListItem>
        安装类型选 <Text bold>Developer Default</Text>（含 MySQL Server + Workbench 图形客户端）。
      </ListItem>
      <ListItem>
        配置 Server 的关键项：
        <UnorderedList>
          <ListItem>
            <Text bold>Type and Networking</Text>：Development Computer，端口 <Text bold>3306</Text>。
          </ListItem>
          <ListItem>
            <Text bold>Authentication</Text>：默认「Use Strong Password Encryption」（MySQL 8 默认，驱动已兼容）。
          </ListItem>
          <ListItem>
            <Text bold>Accounts</Text>：设置 <Text bold>root 密码</Text>（本示例用 <InlineCode>root</InlineCode>）。
          </ListItem>
          <ListItem>
            <Text bold>Windows Service</Text>：勾选配置为服务 + 开机自启（服务名默认 <InlineCode>MySQL80</InlineCode>）。
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>
        验证：开始菜单「MySQL 8.0 Command Line Client」输密码进入，敲 <InlineCode>SHOW DATABASES;</InlineCode>；
        或用 <Text bold>DBeaver</Text> 连 <InlineCode>localhost:3306</InlineCode> / <InlineCode>root</InlineCode> / <InlineCode>root</InlineCode>。
      </ListItem>
    </OrderedList>
  </article>
);

export default index;
