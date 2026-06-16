import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  Table,
  OrderedList,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>下载、安装与环境变量配置</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        理论讲完，动手安装。本节带你完整走一遍：装 Maven 前要先有 JDK、去哪下载、解压到哪、
        怎么配环境变量，最后用一条 <InlineCode>mvn -v</InlineCode> 验证是否装成功。每一步都标出常踩的坑。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、前置条件：先装好 JDK</Subtitle>
    <Paragraph>
      Maven 本身是用 Java 写的，<Text accent bold>它要靠 JDK 才能运行</Text>。所以装 Maven 之前，
      必须先装好 JDK，并配置好 <InlineCode>JAVA_HOME</InlineCode> 环境变量指向 JDK 的安装目录。
    </Paragraph>
    <Paragraph>先确认 JDK 已就绪：</Paragraph>
    <CodeBlock
      language="bash"
      title="验证 JDK 与 JAVA_HOME"
      code={`# 查看 Java 版本，能打印版本号说明 JDK 已装
java -version

# 查看 JAVA_HOME（Windows / macOS-Linux 二选一）
echo %JAVA_HOME%      # Windows（cmd）
echo $JAVA_HOME       # macOS / Linux`}
    />
    <Callout type="warning">
      如果 <InlineCode>JAVA_HOME</InlineCode> 是空的，Maven 后面可能找不到 JDK。
      务必先把它配好（指向 JDK 根目录，比如 <InlineCode>C:\Program Files\Java\jdk-17</InlineCode>），再继续。
    </Callout>

    <Divider />

    <Subtitle>二、下载 Maven 二进制包</Subtitle>
    <Paragraph>
      到 <Text bold>Apache Maven 官网</Text>（<InlineCode>maven.apache.org</InlineCode>）的下载页，
      选择 <Text accent bold>Binary（二进制）</Text>包下载，文件名形如
      <InlineCode>apache-maven-3.9.x-bin.zip</InlineCode>。
    </Paragraph>
    <Table
      head={['包类型', '文件名样例', '该不该下']}
      rows={[
        ['Binary 二进制包', 'apache-maven-3.9.x-bin.zip', '✅ 要这个，开箱即用'],
        ['Source 源码包', 'apache-maven-3.9.x-src.zip', '❌ 是源代码，新手不要'],
      ]}
    />
    <Paragraph>
      下载后<Text bold>解压</Text>到一个目录即可（Maven 是绿色软件，无需安装程序）。
      解压目录的选择有讲究：
    </Paragraph>
    <Callout type="danger" title="路径大坑">
      解压目录的路径里<Text bold>不要有空格、不要有中文</Text>。
      像 <InlineCode>D:\Program Files\maven</InlineCode>（含空格）或 <InlineCode>D:\软件\maven</InlineCode>（含中文）
      都可能导致后续构建出现莫名其妙的报错。建议放在如 <InlineCode>D:\dev\apache-maven-3.9.9</InlineCode> 这样的纯英文路径下。
    </Callout>

    <Divider />

    <Subtitle>三、配置环境变量</Subtitle>
    <Paragraph>
      解压完还不能直接用，要让系统在任意目录下都能找到 <InlineCode>mvn</InlineCode> 命令，
      这就需要配两个环境变量。
    </Paragraph>
    <OrderedList>
      <ListItem>
        新建 <InlineCode>MAVEN_HOME</InlineCode>，值为你的<Text bold>解压根目录</Text>
        （即包含 <InlineCode>bin</InlineCode>、<InlineCode>conf</InlineCode> 等子目录的那一层）。
      </ListItem>
      <ListItem>
        把 Maven 的 <InlineCode>bin</InlineCode> 目录加入 <InlineCode>Path</InlineCode>。
      </ListItem>
    </OrderedList>
    <Paragraph>不同系统的写法：</Paragraph>
    <Table
      head={['系统', 'MAVEN_HOME', '加入 Path 的内容']}
      rows={[
        ['Windows', 'D:\\dev\\apache-maven-3.9.9', '%MAVEN_HOME%\\bin'],
        ['macOS / Linux', '/usr/local/apache-maven-3.9.9', '$MAVEN_HOME/bin'],
      ]}
    />
    <CodeBlock
      language="bash"
      title="macOS / Linux：在 ~/.bashrc 或 ~/.zshrc 末尾追加"
      code={`export MAVEN_HOME=/usr/local/apache-maven-3.9.9
export PATH=$MAVEN_HOME/bin:$PATH

# 保存后让配置立即生效
source ~/.zshrc`}
    />
    <Paragraph>
      Windows 则在「系统属性 → 环境变量」里图形化操作：新建系统变量 <InlineCode>MAVEN_HOME</InlineCode>，
      再编辑 <InlineCode>Path</InlineCode> 新增一条 <InlineCode>%MAVEN_HOME%\bin</InlineCode>。
    </Paragraph>

    <Divider />

    <Subtitle>四、验证安装</Subtitle>
    <Paragraph>
      <Text accent bold>打开一个新的终端</Text>（关键，见下方提示），执行：
    </Paragraph>
    <CodeBlock
      language="bash"
      title="验证 Maven"
      code={`mvn -v`}
    />
    <Paragraph>能看到类似下面的输出，就说明装成功了：</Paragraph>
    <CodeBlock
      language="bash"
      title="mvn -v 的典型输出"
      code={`Apache Maven 3.9.9 (8e8579a9e76f7d015ee5ec7bfcdc97d260186937)
Maven home: D:\\dev\\apache-maven-3.9.9
Java version: 17.0.10, vendor: Oracle Corporation, runtime: C:\\Program Files\\Java\\jdk-17
Default locale: zh_CN, platform encoding: UTF-8
OS name: "windows 11", version: "10.0", arch: "amd64", family: "windows"`}
    />
    <Paragraph>
      重点看两行：<InlineCode>Apache Maven 3.9.9</InlineCode> 表示 Maven 版本正确，
      <InlineCode>Java version: 17.0.10</InlineCode> 表示 Maven 找到的 JDK——
      <Text bold>这个 Java 版本正是来自你配的 JAVA_HOME</Text>。
    </Paragraph>
    <Callout type="tip" title="两个高频问题">
      <UnorderedList>
        <ListItem>
          <Text bold>装完务必重开终端</Text>：环境变量只对「新打开」的终端生效。
          老终端里敲 <InlineCode>mvn -v</InlineCode> 报「命令未找到」，多半是没重开。
        </ListItem>
        <ListItem>
          <Text bold>mvn -v 显示的 Java 版本不对？</Text>那是 <InlineCode>JAVA_HOME</InlineCode> 指错了。
          Maven 用的 JDK 完全由 JAVA_HOME 决定，改它即可。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>装 Maven 前<Text bold>先装 JDK 并配好 JAVA_HOME</Text>，Maven 靠它运行。</ListItem>
        <ListItem>官网下 <Text bold>Binary</Text> 包，解压到<Text bold>无空格、无中文</Text>的纯英文路径。</ListItem>
        <ListItem>配 <InlineCode>MAVEN_HOME</InlineCode> 指向解压目录，再把 <InlineCode>bin</InlineCode> 加入 <InlineCode>Path</InlineCode>。</ListItem>
        <ListItem><Text bold>重开终端</Text>执行 <InlineCode>mvn -v</InlineCode>，能打印 Maven 版本和 Java 版本即成功。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
