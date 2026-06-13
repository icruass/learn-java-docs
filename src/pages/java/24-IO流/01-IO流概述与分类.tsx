import React from 'react';
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
  OrderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>IO流概述与分类</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        IO 流（Input/Output Stream）是 Java 程序与外部世界交换数据的桥梁。
        本节首先解释「流」的概念，说明为什么需要 IO 流；
        然后介绍 Java IO 体系的<Text bold>四大顶级父类</Text>——
        <InlineCode>InputStream</InlineCode>、<InlineCode>OutputStream</InlineCode>、
        <InlineCode>Reader</InlineCode>、<InlineCode>Writer</InlineCode>；
        接着从方向、类型、功能三个维度对流进行分类；
        最后给出 <InlineCode>java.io</InlineCode> 包常用类速查表以及使用 IO 流的通用步骤。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是流</Heading3>
    <Paragraph>
      在 Java 中，「流」（Stream）是一种<Text bold>有方向的数据序列</Text>——数据从一端连续不断地流向另一端，
      就像水在管道中流动一样。流屏蔽了底层数据源或目标的细节（磁盘文件、网络套接字、内存数组……），
      让程序员以统一的方式读写数据。
    </Paragraph>
    <Paragraph>
      流的两个核心要素：
    </Paragraph>
    <UnorderedList>
      <ListItem><Text bold>数据源（Source）</Text>：数据从哪里来，例如硬盘上的文件、键盘输入、网络数据包。</ListItem>
      <ListItem><Text bold>数据目标（Sink）</Text>：数据去哪里，例如写入硬盘文件、发送到网络、打印到控制台。</ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      title="流的示意图"
      code={`数据源（文件/网络/内存）  ──→  输入流  ──→  Java 程序
Java 程序               ──→  输出流  ──→  数据目标（文件/网络/内存）`}
    />

    <Heading3>2. 为什么需要 IO 流</Heading3>
    <Paragraph>
      程序运行期间产生的数据都在内存里，进程结束后就消失了。IO 流让程序能够：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>文件读写：</Text>把数据持久化到磁盘（日志记录、配置文件、导出报表），或从磁盘读取数据供程序使用。
      </ListItem>
      <ListItem>
        <Text bold>网络传输：</Text>通过 Socket 发送 / 接收字节流，实现客户端与服务器之间的数据交换。
      </ListItem>
      <ListItem>
        <Text bold>进程通信：</Text>通过标准输入 / 输出流与其他进程或操作系统命令交互。
      </ListItem>
      <ListItem>
        <Text bold>对象序列化：</Text>将 Java 对象转为字节流保存或传输，再反序列化还原为对象。
      </ListItem>
    </OrderedList>

    <Heading3>3. IO 流的四大顶级父类</Heading3>
    <Paragraph>
      <InlineCode>java.io</InlineCode> 包中的所有流类都继承自以下四个抽象父类，它们是整个 IO 体系的根基：
    </Paragraph>
    <Table
      head={['抽象父类', '流方向', '处理单位', '典型子类']}
      rows={[
        ['InputStream', '输入（读）', '字节（byte，8位）', 'FileInputStream、BufferedInputStream'],
        ['OutputStream', '输出（写）', '字节（byte，8位）', 'FileOutputStream、BufferedOutputStream'],
        ['Reader', '输入（读）', '字符（char，16位）', 'FileReader、BufferedReader'],
        ['Writer', '输出（写）', '字符（char，16位）', 'FileWriter、BufferedWriter'],
      ]}
    />
    <Callout type="tip" title="四大父类均为抽象类">
      <InlineCode>InputStream</InlineCode>、<InlineCode>OutputStream</InlineCode>、
      <InlineCode>Reader</InlineCode>、<InlineCode>Writer</InlineCode> 都是<Text bold>抽象类</Text>，
      不能直接实例化。实际使用时需要创建它们的具体子类对象，例如
      <InlineCode>new FileInputStream("a.txt")</InlineCode>。
    </Callout>

    <Heading3>4. 流的三种分类方式</Heading3>

    <Heading4>4.1 按流的方向分：输入流 vs 输出流</Heading4>
    <Paragraph>
      以 Java 程序为中心：数据流向程序为输入，数据从程序流出为输出。
    </Paragraph>
    <Table
      head={['分类', '方向', '顶级父类', '作用']}
      rows={[
        ['输入流', '外部 → 程序（读）', 'InputStream / Reader', '从文件、网络等读取数据到程序'],
        ['输出流', '程序 → 外部（写）', 'OutputStream / Writer', '将程序中的数据写出到文件、网络等'],
      ]}
    />

    <Heading4>4.2 按处理单位分：字节流 vs 字符流</Heading4>
    <Table
      head={['分类', '处理单位', '顶级父类', '适用场景', '能否处理中文']}
      rows={[
        ['字节流', '1 个字节（8 bit）', 'InputStream / OutputStream', '任意文件（图片、视频、音频、压缩包、文本均可）', '可以，但读文本中文可能乱码'],
        ['字符流', '1 个字符（16 bit）', 'Reader / Writer', '纯文本文件（.txt、.java、.xml 等）', '专为字符设计，不会乱码'],
      ]}
    />
    <Callout type="tip" title="字节流是万能流">
      所有文件在底层都是字节序列，因此字节流可以处理<Text bold>任意类型</Text>的文件。
      字符流本质上是在字节流外包了一层编码/解码逻辑，只适合纯文本，但处理文本更方便、不易乱码。
    </Callout>

    <Heading4>4.3 按功能分：节点流 vs 处理流（包装流）</Heading4>
    <Table
      head={['分类', '别名', '特点', '示例']}
      rows={[
        ['节点流', '原始流', '直接与数据源/目标连接，只提供基本读写功能', 'FileInputStream、FileReader'],
        ['处理流', '包装流', '包装节点流，在其基础上增强功能（缓冲、编码转换等）', 'BufferedInputStream、InputStreamReader'],
      ]}
    />
    <Paragraph>
      处理流采用<Text bold>装饰器模式</Text>——构造时传入一个已有的流对象，从而在不改变原类的前提下增强功能：
    </Paragraph>
    <CodeBlock
      language="text"
      title="包装流示意"
      code={`// 节点流（直连文件）
FileInputStream fis = new FileInputStream("data.bin");

// 处理流（包装节点流，增加缓冲功能）
BufferedInputStream bis = new BufferedInputStream(fis);

// 还可以继续包装（多层装饰）
DataInputStream dis = new DataInputStream(bis);`}
    />

    <Heading3>5. IO 流体系继承图</Heading3>
    <CodeBlock
      language="text"
      title="java.io 流体系（主要类）"
      code={`字节流
├── InputStream（抽象）
│   ├── FileInputStream          ← 读文件（节点流）
│   ├── BufferedInputStream      ← 缓冲读（处理流）
│   ├── DataInputStream          ← 读基本类型（处理流）
│   ├── ObjectInputStream        ← 反序列化（处理流）
│   └── ByteArrayInputStream     ← 读内存字节数组（节点流）
│
└── OutputStream（抽象）
    ├── FileOutputStream         ← 写文件（节点流）
    ├── BufferedOutputStream     ← 缓冲写（处理流）
    ├── DataOutputStream         ← 写基本类型（处理流）
    ├── ObjectOutputStream       ← 序列化（处理流）
    └── ByteArrayOutputStream    ← 写内存字节数组（节点流）

字符流
├── Reader（抽象）
│   ├── FileReader               ← 读文本文件（节点流）
│   ├── BufferedReader           ← 缓冲读，支持 readLine()（处理流）
│   └── InputStreamReader        ← 字节流转字符流，可指定编码（处理流）
│
└── Writer（抽象）
    ├── FileWriter               ← 写文本文件（节点流）
    ├── BufferedWriter           ← 缓冲写，支持 newLine()（处理流）
    └── OutputStreamWriter       ← 字符流转字节流，可指定编码（处理流）`}
    />

    <Heading3>6. java.io 常用类速查表</Heading3>
    <Table
      head={['类名', '流类型', '方向', '说明']}
      rows={[
        ['FileInputStream', '字节节点流', '输入', '从文件读取字节'],
        ['FileOutputStream', '字节节点流', '输出', '向文件写入字节，支持追加模式'],
        ['BufferedInputStream', '字节处理流', '输入', '带 8KB 缓冲区，提高读取效率'],
        ['BufferedOutputStream', '字节处理流', '输出', '带 8KB 缓冲区，提高写入效率'],
        ['ObjectInputStream', '字节处理流', '输入', '从字节流反序列化 Java 对象'],
        ['ObjectOutputStream', '字节处理流', '输出', '将 Java 对象序列化为字节流'],
        ['FileReader', '字符节点流', '输入', '从文本文件读取字符（使用系统默认编码）'],
        ['FileWriter', '字符节点流', '输出', '向文本文件写入字符，支持追加模式'],
        ['BufferedReader', '字符处理流', '输入', '带缓冲，支持 readLine() 逐行读取'],
        ['BufferedWriter', '字符处理流', '输出', '带缓冲，支持 newLine() 写换行符'],
        ['InputStreamReader', '字符处理流', '输入', '字节流→字符流，可指定字符集（如 UTF-8）'],
        ['OutputStreamWriter', '字符处理流', '输出', '字符流→字节流，可指定字符集（如 GBK）'],
      ]}
    />

    <Heading3>7. 使用 IO 流的通用步骤</Heading3>
    <Paragraph>
      无论使用哪种流，操作步骤都遵循同一模式：
    </Paragraph>
    <OrderedList>
      <ListItem><Text bold>创建流对象</Text>：通过构造方法指定数据源或目标（文件路径、另一个流等）。</ListItem>
      <ListItem><Text bold>执行读/写操作</Text>：调用 <InlineCode>read()</InlineCode> / <InlineCode>write()</InlineCode> 等方法传输数据。</ListItem>
      <ListItem><Text bold>关闭流</Text>：调用 <InlineCode>close()</InlineCode> 释放系统资源（文件句柄、内存缓冲区等）。关闭输出流前，处理流会自动 <InlineCode>flush()</InlineCode>。</ListItem>
    </OrderedList>
    <CodeBlock
      title="IOTemplate.java"
      code={`import java.io.FileInputStream;
import java.io.IOException;

public class IOTemplate {
    public static void main(String[] args) {
        // 推荐写法：try-with-resources，自动关闭流
        try (FileInputStream fis = new FileInputStream("hello.txt")) {
            // 步骤2：读取数据
            int b;
            while ((b = fis.read()) != -1) {
                System.out.print((char) b);
            }
        } catch (IOException e) {
            // 步骤3：close() 由 try-with-resources 自动调用
            e.printStackTrace();
        }
    }
}`}
    />
    <Callout type="warning" title="流必须关闭！">
      IO 流关联操作系统的文件句柄等资源，<Text bold>不关闭会导致资源泄漏</Text>。
      强烈推荐使用 <InlineCode>try-with-resources</InlineCode>（JDK 7+）语法，
      它会在代码块结束时自动调用 <InlineCode>close()</InlineCode>，
      即使发生异常也不例外。
    </Callout>

    <Heading3>8. 异常处理说明</Heading3>
    <Paragraph>
      几乎所有 IO 操作都声明了受检异常 <InlineCode>IOException</InlineCode>，必须显式处理：
    </Paragraph>
    <Table
      head={['处理方式', '代码形式', '适用场景']}
      rows={[
        ['try-catch-finally（传统）', 'try { ... } finally { close() }', 'JDK 7 以前，或需要精细控制关闭逻辑时'],
        ['try-with-resources（推荐）', 'try (XxxStream s = new ...) { ... }', 'JDK 7+，代码简洁，自动关闭'],
        ['throws 声明上抛', 'public void foo() throws IOException', '工具方法向调用者抛出，不在此处处理'],
      ]}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>流是有方向的数据序列，分为输入流（读）和输出流（写）。</ListItem>
        <ListItem>四大顶级抽象父类：<InlineCode>InputStream</InlineCode>、<InlineCode>OutputStream</InlineCode>（字节）；<InlineCode>Reader</InlineCode>、<InlineCode>Writer</InlineCode>（字符）。</ListItem>
        <ListItem>字节流处理任意文件，字符流专为文本设计，读写中文更安全。</ListItem>
        <ListItem>节点流直连数据源；处理流包装节点流，增强功能（缓冲、编码转换等）。</ListItem>
        <ListItem>使用 IO 流三步：创建→操作→关闭；推荐 try-with-resources 自动关闭。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>9. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：流的分类概念题"
      code={`问：请根据下列场景，说明应选择哪种流（字节流/字符流），并简述理由。

① 将一张 PNG 图片从 D 盘复制到 E 盘。
② 读取一个 UTF-8 编码的 .txt 日志文件，逐行输出内容。
③ 将 Java 对象序列化后保存到文件。
④ 向一个文本文件末尾追加一段中文说明。`}
      answerCode={`答案：

① 字节流（FileInputStream + FileOutputStream）
   理由：图片是二进制文件，字符流无法正确处理非文本内容，必须用字节流原样复制字节。

② 字符流（FileReader 或 BufferedReader 包装 InputStreamReader）
   理由：.txt 是纯文本，字符流可以正确处理字符编码；
         BufferedReader 的 readLine() 方法可直接按行读取，比字节流方便。

③ 字节流（ObjectOutputStream）
   理由：序列化输出的是字节序列，ObjectOutputStream 继承自 OutputStream（字节流体系）。

④ 字符流（FileWriter，构造方法第二个参数传 true 开启追加模式）
   理由：追加中文文本使用字符流更安全，不会出现编码问题；
         new FileWriter("file.txt", true) 表示追加而非覆盖。`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习 2：四大父类判断题"
      code={`判断下列说法是否正确，并说明理由：

① InputStream 可以直接用 new InputStream() 创建对象。
② FileReader 是字符流，因此它继承自 InputStream。
③ 处理流（包装流）必须包装一个已存在的流对象。
④ 字节流只能处理英文字符，不能处理中文。`}
      answerCode={`答案：

① 错误。InputStream 是抽象类，不能直接实例化。
   必须使用具体子类，如 new FileInputStream("a.txt")。

② 错误。FileReader 是字符流，继承自 Reader（而非 InputStream）。
   字节流体系的根是 InputStream/OutputStream，字符流体系的根是 Reader/Writer，两者独立。

③ 正确。处理流采用装饰器模式，构造方法需要传入一个节点流或其他处理流。
   例如：new BufferedInputStream(new FileInputStream("a.bin"))。

④ 错误。字节流可以处理任意数据，包括中文字节序列。
   但是，如果用字节流直接读取文本后转换为字符串时没有指定正确的字符集，才会出现乱码。
   字节流本身并没有「不支持中文」的限制。`}
    />

    <CodeBlock
      qa
      title="练习 3：补全代码"
      code={`// 补全下面的代码框架，使用 try-with-resources 语法打开一个文件输入流，
// 读取文件 "data.txt" 的所有字节并统计字节总数，最后打印：
// "文件共 X 个字节"

import java.io.FileInputStream;
import java.io.IOException;

public class CountBytes {
    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`import java.io.FileInputStream;
import java.io.IOException;

public class CountBytes {
    public static void main(String[] args) {
        int count = 0;
        try (FileInputStream fis = new FileInputStream("data.txt")) {
            while (fis.read() != -1) {
                count++;
            }
            System.out.println("文件共 " + count + " 个字节");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
解析：
1. try-with-resources：FileInputStream 声明在 try(...) 中，代码块结束后自动调用 close()。
2. fis.read() 每次读 1 个字节，返回 0~255 的整数；返回 -1 表示已到达文件末尾。
3. 每读到一个字节 count 加 1，循环结束即得文件字节总数。
4. 若文件不存在，FileInputStream 构造方法会抛出 FileNotFoundException（IOException 子类），
   被 catch 块捕获并打印堆栈。
*/`}
    />
  </article>
);

export default index;
