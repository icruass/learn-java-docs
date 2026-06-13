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
    <Title>字节流</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        字节流是 Java IO 的基础，能处理<Text bold>任意类型</Text>的文件——文本、图片、音频、视频、压缩包……
        本节先介绍 <InlineCode>FileInputStream</InlineCode> 的两种读取方式（单字节 vs 字节数组），
        再介绍 <InlineCode>FileOutputStream</InlineCode> 的写入与追加，
        然后演示最常见的<Text bold>文件复制</Text>案例，
        最后讲解推荐的资源关闭方式 <InlineCode>try-with-resources</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading3>1. FileInputStream — 读取文件</Heading3>

    <Heading4>1.1 构造方法</Heading4>
    <Table
      head={['构造方法', '说明']}
      rows={[
        ['FileInputStream(String name)', '传入文件路径字符串，文件不存在则抛出 FileNotFoundException'],
        ['FileInputStream(File file)', '传入 File 对象，更面向对象，推荐'],
      ]}
    />

    <Heading4>1.2 read() — 每次读 1 个字节</Heading4>
    <Paragraph>
      <InlineCode>int read()</InlineCode> 每次从流中读取<Text bold>一个字节</Text>，
      返回该字节的值（范围 0～255）；若已到达文件末尾，返回 <InlineCode>-1</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="ReadOneByte.java"
      code={`import java.io.FileInputStream;
import java.io.IOException;

public class ReadOneByte {
    public static void main(String[] args) {
        try (FileInputStream fis = new FileInputStream("hello.txt")) {
            int b;
            while ((b = fis.read()) != -1) {
                // b 是字节值（0-255），强转 char 可显示英文字符
                System.out.print((char) b);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock language="text" title="hello.txt 内容 & 控制台输出" code={`Hello IO!`} />
    <Callout type="warning" title="单字节读取效率极低">
      每次调用 <InlineCode>read()</InlineCode> 都触发一次系统调用，读取大文件时会非常慢。
      实际开发中应使用字节数组版本 <InlineCode>read(byte[])</InlineCode>，见下节。
    </Callout>

    <Heading4>1.3 read(byte[] b) — 每次读一组字节（推荐）</Heading4>
    <Paragraph>
      <InlineCode>int read(byte[] b)</InlineCode> 每次最多读取 <InlineCode>b.length</InlineCode> 个字节，
      填充到数组 <InlineCode>b</InlineCode> 中，返回<Text bold>实际读到的字节数</Text>；
      若已到达末尾，返回 <InlineCode>-1</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="ReadByteArray.java"
      code={`import java.io.FileInputStream;
import java.io.IOException;

public class ReadByteArray {
    public static void main(String[] args) {
        try (FileInputStream fis = new FileInputStream("hello.txt")) {
            byte[] buf = new byte[1024]; // 每次最多读 1024 个字节
            int len;
            while ((len = fis.read(buf)) != -1) {
                // 注意：必须用 len，不能用 buf.length
                // 最后一次读取可能不足 1024 字节
                String s = new String(buf, 0, len);
                System.out.print(s);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <Callout type="tip" title="new String(buf, 0, len) 的写法">
      <InlineCode>new String(buf, 0, len)</InlineCode> 只将字节数组中
      <Text bold>实际读到的部分</Text>转为字符串。
      如果写成 <InlineCode>new String(buf)</InlineCode>，最后一次读取时数组末尾残留旧数据，会导致输出内容多出垃圾字符。
    </Callout>

    <Heading4>1.4 read(byte[], int off, int len)</Heading4>
    <Paragraph>
      还有第三个重载：<InlineCode>int read(byte[] b, int off, int len)</InlineCode>，
      从数组 <InlineCode>b</InlineCode> 的 <InlineCode>off</InlineCode> 位置开始，
      最多读入 <InlineCode>len</InlineCode> 个字节。用于需要精确控制偏移量的场景，日常使用较少。
    </Paragraph>

    <Heading3>2. FileOutputStream — 写入文件</Heading3>

    <Heading4>2.1 构造方法</Heading4>
    <Table
      head={['构造方法', '说明']}
      rows={[
        ['FileOutputStream(String name)', '覆盖模式：若文件不存在则创建，存在则清空后写入'],
        ['FileOutputStream(String name, boolean append)', 'append=true 为追加模式，在文件末尾继续写入而不清空'],
        ['FileOutputStream(File file)', '传入 File 对象，覆盖模式'],
        ['FileOutputStream(File file, boolean append)', '传入 File 对象，append=true 为追加模式'],
      ]}
    />
    <Callout type="warning" title="默认覆盖模式会清空原文件">
      <InlineCode>new FileOutputStream("a.txt")</InlineCode> 会在文件存在时
      <Text bold>先清空再写入</Text>。若只想追加内容，务必传第二个参数
      <InlineCode>true</InlineCode>：<InlineCode>new FileOutputStream("a.txt", true)</InlineCode>。
    </Callout>

    <Heading4>2.2 write() 方法</Heading4>
    <Table
      head={['方法', '说明']}
      rows={[
        ['write(int b)', '写入单个字节（只取 b 的低 8 位）'],
        ['write(byte[] b)', '写入字节数组的全部内容'],
        ['write(byte[] b, int off, int len)', '写入字节数组从 off 开始的 len 个字节'],
      ]}
    />

    <Heading4>2.3 换行写法</Heading4>
    <Paragraph>
      写换行符时需注意不同平台的差异：
    </Paragraph>
    <Table
      head={['平台', '换行符', '说明']}
      rows={[
        ['Windows', '\\r\\n（回车+换行）', '两个字节'],
        ['macOS / Linux', '\\n（换行）', '一个字节'],
        ['Java 推荐', 'System.lineSeparator()', '自动获取当前平台换行符，跨平台兼容'],
      ]}
    />
    <CodeBlock
      title="WriteFile.java"
      code={`import java.io.FileOutputStream;
import java.io.IOException;

public class WriteFile {
    public static void main(String[] args) {
        // 写入内容到文件（覆盖模式）
        try (FileOutputStream fos = new FileOutputStream("output.txt")) {
            String line1 = "第一行内容";
            String line2 = "第二行内容";
            String sep = System.lineSeparator(); // 平台无关换行符

            fos.write(line1.getBytes()); // String → byte[]，使用系统默认编码
            fos.write(sep.getBytes());
            fos.write(line2.getBytes());
            fos.write(sep.getBytes());
            System.out.println("写入完成！");
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 追加内容到同一文件
        try (FileOutputStream fos = new FileOutputStream("output.txt", true)) {
            fos.write("追加第三行".getBytes());
            fos.write(System.lineSeparator().getBytes());
            System.out.println("追加完成！");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`写入完成！
追加完成！`} />
    <CodeBlock language="text" title="output.txt 文件内容" code={`第一行内容
第二行内容
追加第三行`} />

    <Heading3>3. 文件复制案例（字节流）</Heading3>
    <Paragraph>
      字节流复制文件是最经典的 IO 应用：一边从源文件读字节，一边向目标文件写字节。
      由于字节流不解析内容，可以复制任何类型的文件（包括图片、视频、可执行文件）。
    </Paragraph>
    <CodeBlock
      title="FileCopy.java"
      code={`import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileCopy {
    public static void main(String[] args) {
        String src  = "D:/source/photo.jpg";   // 源文件路径
        String dest = "D:/backup/photo.jpg";   // 目标文件路径

        long startTime = System.currentTimeMillis();

        // try-with-resources 可同时声明多个资源，用分号隔开
        try (FileInputStream  fis = new FileInputStream(src);
             FileOutputStream fos = new FileOutputStream(dest)) {

            byte[] buf = new byte[8192]; // 8 KB 缓冲区
            int len;
            while ((len = fis.read(buf)) != -1) {
                fos.write(buf, 0, len);  // 只写实际读到的字节数
            }

            long cost = System.currentTimeMillis() - startTime;
            System.out.println("复制完成，耗时 " + cost + " ms");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（示例）" code={`复制完成，耗时 23 ms`} />
    <Callout type="tip" title="缓冲区大小的选择">
      缓冲区（<InlineCode>byte[] buf</InlineCode>）太小（如 1 字节）会导致大量系统调用；
      太大（如 100 MB）会占用过多内存。通常选择
      <Text bold>4KB～16KB</Text>（4096～16384 字节）是经验上的较优值，
      兼顾内存和效率。
    </Callout>

    <Heading3>4. 资源关闭：try-with-resources</Heading3>
    <Paragraph>
      JDK 7 引入的 <InlineCode>try-with-resources</InlineCode> 是关闭 IO 流的<Text bold>最佳实践</Text>。
      只需将流声明在 <InlineCode>try(...)</InlineCode> 的括号内，代码块正常结束或发生异常时
      都会自动调用 <InlineCode>close()</InlineCode>，无需手写 <InlineCode>finally</InlineCode>。
    </Paragraph>
    <Table
      head={['写法', '特点', '推荐度']}
      rows={[
        ['try-with-resources（JDK 7+）', '代码简洁，自动关闭，异常安全', '强烈推荐'],
        ['try-catch-finally（传统）', '需手动在 finally 中调用 close()，代码冗长', '了解即可'],
        ['不关闭流', '资源泄漏，文件被占用，程序运行时间长后崩溃', '禁止'],
      ]}
    />
    <CodeBlock
      title="传统写法 vs try-with-resources 对比"
      code={`// ❌ 传统写法：finally 中关闭，代码繁琐
FileInputStream fis = null;
try {
    fis = new FileInputStream("a.txt");
    // ... 读操作 ...
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (fis != null) {
        try {
            fis.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

// ✅ try-with-resources：简洁、安全
try (FileInputStream fis = new FileInputStream("a.txt")) {
    // ... 读操作 ...
} catch (IOException e) {
    e.printStackTrace();
}
// fis.close() 已由 JVM 自动调用`}
    />
    <Callout type="tip" title="try-with-resources 多资源关闭顺序">
      声明多个资源时（用 <InlineCode>;</InlineCode> 分隔），关闭顺序与声明顺序<Text bold>相反</Text>——
      最后声明的流最先关闭，这符合后进先出的栈式结构，可以防止因关闭顺序错误导致的数据丢失。
    </Callout>

    <Heading3>5. 字节流读写中文的注意事项</Heading3>
    <Paragraph>
      字节流本质上以字节为单位读写，完全不理解字符编码。
      对于纯 ASCII 文本（英文、数字），每个字符正好是 1 个字节，字节流读写没有问题；
      但对于中文（UTF-8 下每个汉字 3 个字节，GBK 下 2 个字节），
      如果缓冲区大小恰好在汉字中间截断，就会出现乱码。
    </Paragraph>
    <Callout type="warning" title="字节流读文本可能乱码">
      当缓冲区大小不是字符编码单位的整数倍时，汉字会被截断，转换成字符串后出现「???」等乱码。
      <Text bold>处理纯文本文件时，推荐使用字符流</Text>（FileReader / FileWriter），
      或者将字节流用 <InlineCode>InputStreamReader</InlineCode> 包装并指定正确的字符集。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>FileInputStream</InlineCode> 从文件读字节；<InlineCode>FileOutputStream</InlineCode> 向文件写字节。</ListItem>
        <ListItem><InlineCode>read(byte[])</InlineCode> 比 <InlineCode>read()</InlineCode> 效率高得多，实际应用中必须使用数组版本。</ListItem>
        <ListItem>写操作用 <InlineCode>fos.write(buf, 0, len)</InlineCode> 而非 <InlineCode>fos.write(buf)</InlineCode>，防止末尾脏数据。</ListItem>
        <ListItem>追加写文件：构造方法第二个参数传 <InlineCode>true</InlineCode>。</ListItem>
        <ListItem>字节流可复制任何类型文件；处理文本中文时，推荐使用字符流。</ListItem>
        <ListItem>使用 <InlineCode>try-with-resources</InlineCode> 确保流一定被关闭。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：概念题"
      code={`问：关于 FileInputStream 的 read(byte[] buf) 方法，回答以下问题：

① 方法的返回值含义是什么？
② 为什么必须用返回值 len 而不是 buf.length 来构造字符串？
③ 返回 -1 代表什么？此后再次调用 read() 会发生什么？`}
      answerCode={`答案：

① 返回值是本次实际读取的字节数（大于 0）；
   若已到达文件末尾，返回 -1。

② 因为最后一次读取时，文件剩余字节数可能小于 buf.length，
   数组末尾仍保留上一次读取的旧数据（脏数据）。
   用 len 可以只取本次实际读到的部分：new String(buf, 0, len)。

③ 返回 -1 表示输入流已到达末尾（End Of File）。
   此后继续调用 read() 仍会返回 -1，不会抛出异常，
   但应当在循环条件中判断 -1 并退出，避免死循环。`}
    />

    <CodeBlock
      qa
      title="练习 2：文件统计"
      code={`// 编写程序，统计文件 "article.txt" 中字节总数和换行符（\\n）的数量，
// 并打印：
//   总字节数：XXX
//   行数：XXX（换行符数量即近似行数）

import java.io.FileInputStream;
import java.io.IOException;

public class CountLines {
    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`import java.io.FileInputStream;
import java.io.IOException;

public class CountLines {
    public static void main(String[] args) {
        long totalBytes = 0;
        int lines = 0;

        try (FileInputStream fis = new FileInputStream("article.txt")) {
            byte[] buf = new byte[4096];
            int len;
            while ((len = fis.read(buf)) != -1) {
                totalBytes += len;
                for (int i = 0; i < len; i++) {
                    if (buf[i] == '\\n') {   // '\\n' 字节值为 10
                        lines++;
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println("总字节数：" + totalBytes);
        System.out.println("行数：" + lines);
    }
}

/*
解析：
- '\\n' 的 ASCII/UTF-8 字节值为 10，字节流可以直接比较。
- 使用 4096 字节缓冲区避免单字节读取的效率问题。
- totalBytes 用 long 而非 int，防止文件超过 2GB 时溢出。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：带追加的文件写入"
      code={`// 编写程序实现以下功能：
// 1. 向 "log.txt" 写入第一条日志（覆盖模式）：[INFO] 程序启动
// 2. 向同一文件追加第二条日志（追加模式）：[INFO] 任务完成
// 3. 读取 "log.txt" 全部内容并打印到控制台
//
// 提示：写入中文时，调用 str.getBytes("UTF-8") 指定编码避免乱码。

import java.io.*;

public class LogWriter {
    public static void main(String[] args) throws IOException {
        // 补全代码
    }
}`}
      answerCode={`import java.io.*;

public class LogWriter {
    public static void main(String[] args) throws IOException {
        String newLine = System.lineSeparator();

        // 1. 覆盖模式写入第一条日志
        try (FileOutputStream fos = new FileOutputStream("log.txt")) {
            fos.write(("[INFO] 程序启动" + newLine).getBytes("UTF-8"));
        }

        // 2. 追加模式写入第二条日志
        try (FileOutputStream fos = new FileOutputStream("log.txt", true)) {
            fos.write(("[INFO] 任务完成" + newLine).getBytes("UTF-8"));
        }

        // 3. 读取并打印全部内容
        try (FileInputStream fis = new FileInputStream("log.txt")) {
            byte[] buf = new byte[1024];
            int len;
            while ((len = fis.read(buf)) != -1) {
                System.out.print(new String(buf, 0, len, "UTF-8"));
            }
        }
    }
}

/* 控制台输出：
[INFO] 程序启动
[INFO] 任务完成

解析：
- 第一次用覆盖模式，确保文件内容干净；
- 第二次用追加模式（true），不清空已有内容；
- 读取时同样指定 UTF-8 编码，与写入一致，防止乱码。
*/`}
    />
  </article>
);

export default index;
