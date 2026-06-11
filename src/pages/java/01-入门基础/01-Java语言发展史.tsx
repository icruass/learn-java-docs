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
    <Title>Java 语言发展史</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        学一门语言，先搞清楚它<Text bold>从哪来、强在哪、长什么样</Text>，比一上来背语法更有用。
        本节回答四个问题：Java 是谁、为什么造它、凭什么火了 30 年、以及那句著名的
        <Text bold>“一次编写，到处运行”</Text>到底是怎么做到的。这部分概念性强、几乎不写代码，
        但它是你后面理解 JDK / JRE / JVM、理解“为什么 Java 程序要先编译再运行”的地图。
      </Paragraph>
    </Callout>

    <Heading3>1. Java 是怎么来的</Heading3>
    <Paragraph>
      Java 由 <Text bold>James Gosling（高斯林，“Java 之父”）</Text>带领的团队在
      <Text bold> Sun 公司（Sun Microsystems）</Text>开发，
      <Text bold>1995 年</Text>正式发布。它最初的名字叫 <InlineCode>Oak</InlineCode>（橡树），
      本是为机顶盒、家电等嵌入式设备设计的；后来赶上互联网兴起，摇身一变成了网页时代的明星语言，
      并改名为 <InlineCode>Java</InlineCode>（一种咖啡的名字，所以图标是一杯冒着热气的咖啡）。
    </Paragraph>
    <Paragraph>
      2009 年 <Text bold>Oracle（甲骨文）</Text>收购了 Sun，此后 Java 由 Oracle 主导。
      虽然中间经历过若干商业与版权风波，但 Java 至今仍是企业级后端开发<Text bold>最主流</Text>的语言之一。
    </Paragraph>

    <Callout type="tip">
      记住三个关键词就够了：<Text bold>James Gosling（人）、Sun（公司，后被 Oracle 收购）、1995（年份）</Text>。
      面试偶尔会问，但更重要的是下面的“跨平台原理”。
    </Callout>

    <Heading3>2. 关键版本：你只需记住这几个</Heading3>
    <Paragraph>
      Java 版本号经历过一次“改名”：早期叫 <InlineCode>JDK 1.0 ~ 1.4</InlineCode>，从
      <InlineCode>1.5</InlineCode> 开始官方对外称 <Text bold>Java 5</Text>（内部版本号仍是 1.5）。
      之后就是 Java 6、7、8…… 一路到现在。下面这几个是“里程碑”版本：
    </Paragraph>
    <Table
      head={['版本', '年份', '为什么重要']}
      rows={[
        ['JDK 1.0', '1996', '第一个正式版'],
        ['Java 5', '2004', '泛型、自动装箱、增强 for、枚举——现代 Java 的雏形'],
        ['Java 8', '2014', 'Lambda、Stream、新日期 API；至今企业里使用最广的版本之一'],
        ['Java 11', '2018', '第一个长期支持（LTS）的“新时代”版本'],
        ['Java 17', '2021', 'LTS，很多新项目的起步版本'],
        ['Java 21', '2023', 'LTS，引入虚拟线程等重磅特性'],
      ]}
    />
    <Callout type="warning" title="LTS 是什么">
      <Text bold>LTS（Long-Term Support，长期支持版）</Text>会被官方维护很多年，企业生产环境通常只选
      LTS 版本（如 8、11、17、21）。学习阶段用 <Text bold>JDK 17 或 21</Text> 都很合适，
      本教程的语法在这些版本上都能跑。
    </Callout>

    <Heading3>3. Java 的三大特点</Heading3>
    <Paragraph>面试高频题“Java 有什么特点”，核心就这几条：</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>跨平台（最核心）</Text>：同一份编译好的程序，能在 Windows、macOS、Linux
        上不加修改地运行——也就是那句口号 <Text accent>Write Once, Run Anywhere（一次编写，到处运行）</Text>。
      </ListItem>
      <ListItem>
        <Text bold>面向对象</Text>：万物皆对象，用类和对象来组织代码（这是后面一大半章节的主题）。
      </ListItem>
      <ListItem>
        <Text bold>自动内存管理</Text>：有<Text bold>垃圾回收（GC，Garbage Collection）</Text>，
        程序员一般不用手动释放内存，比 C/C++ 省心、也更不容易出内存泄漏。
      </ListItem>
    </UnorderedList>

    <Heading3>4. 跨平台原理：编译一次，到处运行</Heading3>
    <Paragraph>
      这是本节<Text bold>最该理解透</Text>的一点。Java 程序的运行分两步：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>编译</Text>：用编译器 <InlineCode>javac</InlineCode> 把源码
        <InlineCode>.java</InlineCode> 编译成<Text bold>字节码</Text>
        <InlineCode>.class</InlineCode>。字节码不是某个操作系统的机器码，而是一种“中间语言”。
      </ListItem>
      <ListItem>
        <Text bold>运行</Text>：由 <Text bold>JVM（Java 虚拟机）</Text>把字节码翻译成
        当前操作系统能懂的机器码并执行。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      title="一份源码，跑遍所有系统"
      code={`         编译(javac)                 运行(java)
HelloWorld.java  ───────►  HelloWorld.class  ───────►  各种操作系统
   (源代码)                  (字节码, 跨平台)        │
                                                    ├─► Windows 上的 JVM ─► Windows 机器码
                                                    ├─► macOS   上的 JVM ─► macOS   机器码
                                                    └─► Linux   上的 JVM ─► Linux   机器码`}
    />
    <Callout type="success" title="一句话点透">
      <Text bold>字节码是跨平台的，JVM 不是。</Text>正因为每个操作系统都有“自己版本”的 JVM
      去适配差异，上层的字节码才得以“到处运行”。所以跨平台靠的是 JVM，而不是 Java 语言本身有魔法。
    </Callout>

    <Heading3>5. JDK、JRE、JVM 三者关系</Heading3>
    <Paragraph>
      这三个缩写新手最容易混。用一句话区分：<Text bold>JDK 包含 JRE，JRE 包含 JVM</Text>。
    </Paragraph>
    <Table
      head={['名称', '全称', '作用', '里面有什么']}
      rows={[
        [
          <InlineCode>JVM</InlineCode>,
          'Java Virtual Machine（虚拟机）',
          '真正运行字节码的“发动机”',
          '只是一个运行引擎',
        ],
        [
          <InlineCode>JRE</InlineCode>,
          'Java Runtime Environment（运行环境）',
          '只想“运行”Java 程序，装它就够',
          'JVM + 核心类库',
        ],
        [
          <InlineCode>JDK</InlineCode>,
          'Java Development Kit（开发工具包）',
          '要“开发”Java，必须装它',
          'JRE + 编译器 javac、调试等开发工具',
        ],
      ]}
    />
    <Callout type="tip">
      做开发就装 <Text bold>JDK</Text>（它最全，包含了另外两个）。一个生活化的类比：
      JVM 是发动机，JRE 是“发动机 + 能开上路的整车”，JDK 是“整车 + 修车造车的全套工具箱”。
    </Callout>

    <Heading3>6. 练习题（概念自测）</Heading3>
    <Paragraph>
      下面用<Text bold>问答模式</Text>做几道概念题：先思考，再点右上角
      <Text accent>「看答案 →」</Text>对照。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：跨平台靠谁"
      code={`问：有人说“Java 跨平台，是因为字节码能直接在任何操作系统上运行”。
    这句话对吗？错在哪？请用一句话纠正。`}
      answerCode={`不对。字节码本身并不能被操作系统直接执行。

真正跨平台的机制是：
  · 字节码(.class) 是平台无关的“中间语言”；
  · 每个操作系统都安装了对应版本的 JVM；
  · 由 JVM 把同一份字节码翻译成本系统的机器码再执行。

一句话纠正：跨平台靠的是“各平台各自的 JVM”，而不是字节码能被系统直接运行。`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：该装哪个"
      code={`问：下面两种人，分别应该安装 JDK / JRE / JVM 中的哪一个？
  (1) 小李只想运行别人给的一个 Java 小工具，不写代码；
  (2) 小王要自己写 Java 代码、编译并运行。`}
      answerCode={`(1) 小李：装 JRE 就够（只运行，不开发）。
    —— JRE = JVM + 核心类库，能跑程序但不能编译。

(2) 小王：必须装 JDK（要开发 = 要编译）。
    —— JDK = JRE + javac 等开发工具，三者里最全。

口诀：开发装 JDK，只跑装 JRE，JVM 是被它们俩“包”在里面的发动机。`}
    />
  </article>
);

export default index;
