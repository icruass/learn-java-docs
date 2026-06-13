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
    <Title>缓冲流与转换流</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前两节的字节流和字符流是直接操作数据的「节点流」，每次读写都会触发系统调用，效率较低。
        本节介绍两类重要的「处理流」：
        <Text bold>缓冲流</Text>通过内置缓冲区大幅提升读写效率；
        <Text bold>转换流</Text>则充当字节流与字符流之间的桥梁，并支持指定字符集，解决编码不一致导致的乱码问题。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要缓冲流</Heading3>
    <Paragraph>
      每次调用 <InlineCode>FileInputStream.read()</InlineCode> 或
      <InlineCode>FileOutputStream.write()</InlineCode>，
      Java 都要向操作系统发起一次系统调用，而系统调用的开销远高于内存操作。
      对于大文件，这意味着数以百万计的系统调用，耗时极长。
    </Paragraph>
    <Paragraph>
      缓冲流（Buffered 系列）内置了一个缓冲区（默认 <Text bold>8 192 字节 = 8 KB</Text>）：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>读取时：</Text>一次性从磁盘读取 8 KB 放入缓冲区，之后的 <InlineCode>read()</InlineCode> 直接从内存缓冲区取数据，不再频繁触发系统调用。
      </ListItem>
      <ListItem>
        <Text bold>写入时：</Text>先把数据积攒到缓冲区，缓冲区满了再一次性写到磁盘，减少写操作次数。
      </ListItem>
    </UnorderedList>

    <Heading3>2. BufferedInputStream / BufferedOutputStream</Heading3>

    <Heading4>2.1 构造方法</Heading4>
    <Table
      head={['构造方法', '说明']}
      rows={[
        ['BufferedInputStream(InputStream in)', '包装一个字节输入流，使用默认 8 KB 缓冲区'],
        ['BufferedInputStream(InputStream in, int size)', '包装输入流，指定缓冲区大小（字节）'],
        ['BufferedOutputStream(OutputStream out)', '包装一个字节输出流，使用默认 8 KB 缓冲区'],
        ['BufferedOutputStream(OutputStream out, int size)', '包装输出流，指定缓冲区大小'],
      ]}
    />

    <Heading4>2.2 用法</Heading4>
    <Paragraph>
      缓冲流的读写方法与普通字节流完全相同（<InlineCode>read()</InlineCode>、<InlineCode>read(byte[])</InlineCode>、
      <InlineCode>write()</InlineCode> 等），只是底层自动利用缓冲区提升效率：
    </Paragraph>
    <CodeBlock
      title="BufferedCopy.java — 用缓冲流复制大文件"
      code={`import java.io.*;

public class BufferedCopy {
    public static void main(String[] args) {
        String src  = "D:/videos/movie.mp4";
        String dest = "D:/backup/movie.mp4";

        long start = System.currentTimeMillis();

        // 双层包装：BufferedInputStream 包裹 FileInputStream
        try (BufferedInputStream  bis = new BufferedInputStream(new FileInputStream(src));
             BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(dest))) {

            byte[] buf = new byte[8192];
            int len;
            while ((len = bis.read(buf)) != -1) {
                bos.write(buf, 0, len);
            }
            // bos.flush(); // try-with-resources 的 close() 会自动 flush，可省略

        } catch (IOException e) {
            e.printStackTrace();
        }

        long cost = System.currentTimeMillis() - start;
        System.out.println("复制完成，耗时 " + cost + " ms");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（100 MB 文件，示例）" code={`复制完成，耗时 312 ms`} />
    <Callout type="tip" title="关闭最外层包装流即可">
      当多层流嵌套时，只需关闭最外层的包装流（如 <InlineCode>bis</InlineCode>），
      它会自动调用被包装的内层流的 <InlineCode>close()</InlineCode>，
      不需要分别关闭每一层。
    </Callout>

    <Heading3>3. BufferedReader / BufferedWriter</Heading3>

    <Heading4>3.1 特有方法</Heading4>
    <Paragraph>
      字符缓冲流在字符流的基础上新增了两个<Text bold>独有方法</Text>，是实际开发中最常用的文本读写 API：
    </Paragraph>
    <Table
      head={['方法', '所属类', '说明']}
      rows={[
        ['String readLine()', 'BufferedReader', '读取一整行（不含换行符），到达末尾时返回 null'],
        ['void newLine()', 'BufferedWriter', '写入当前系统的换行符（跨平台兼容，等价于 System.lineSeparator()）'],
      ]}
    />

    <Heading4>3.2 构造方法</Heading4>
    <Table
      head={['构造方法', '说明']}
      rows={[
        ['BufferedReader(Reader in)', '包装字符输入流，默认 8192 字符缓冲区'],
        ['BufferedReader(Reader in, int sz)', '包装字符输入流，指定缓冲区大小'],
        ['BufferedWriter(Writer out)', '包装字符输出流，默认 8192 字符缓冲区'],
        ['BufferedWriter(Writer out, int sz)', '包装字符输出流，指定缓冲区大小'],
      ]}
    />

    <Heading4>3.3 逐行读取文本文件示例</Heading4>
    <CodeBlock
      title="ReadLines.java"
      code={`import java.io.*;

public class ReadLines {
    public static void main(String[] args) {
        // 假设 data.csv 内容如下：
        // 姓名,年龄,城市
        // 张三,25,北京
        // 李四,30,上海

        try (BufferedReader br = new BufferedReader(new FileReader("data.csv"))) {
            String line;
            int lineNum = 0;
            while ((line = br.readLine()) != null) { // readLine() 返回 null 表示末尾
                lineNum++;
                System.out.println("第" + lineNum + "行：" + line);
            }
            System.out.println("共 " + lineNum + " 行");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`第1行：姓名,年龄,城市
第2行：张三,25,北京
第3行：李四,30,上海
共 3 行`} />

    <Heading4>3.4 用 BufferedWriter 写文件</Heading4>
    <CodeBlock
      title="WriteLines.java"
      code={`import java.io.*;
import java.util.List;

public class WriteLines {
    public static void main(String[] args) {
        List<String> names = List.of("Alice", "Bob", "Charlie", "Diana");

        try (BufferedWriter bw = new BufferedWriter(new FileWriter("names.txt"))) {
            for (String name : names) {
                bw.write(name);
                bw.newLine(); // 写入系统换行符，跨平台兼容
            }
            System.out.println("写入完成！");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />

    <Heading3>4. 效率对比</Heading3>
    <Paragraph>
      下表展示对一个约 50 MB 文本文件进行复制时，不同写法的耗时对比（参考数据，实际结果因硬件而异）：
    </Paragraph>
    <Table
      head={['写法', '缓冲区', '50 MB 文件复制耗时（参考）', '说明']}
      rows={[
        ['FileInputStream.read() 单字节', '无', '~30 000 ms（约 30 秒）', '每字节一次系统调用，极慢'],
        ['FileInputStream.read(byte[1024])', '手动 1 KB', '~200 ms', '手动缓冲，效率明显提升'],
        ['BufferedInputStream + read(byte[8192])', '自动 8 KB + 手动 8 KB', '~100 ms', '双缓冲，效率最优'],
        ['BufferedInputStream + read() 单字节', '自动 8 KB', '~500 ms', '有缓冲但单字节循环开销仍大'],
      ]}
    />
    <Callout type="tip" title="最佳实践：缓冲流 + 字节数组">
      实际开发中，推荐<Text bold>缓冲流 + 字节数组缓冲区</Text>的组合：
      <InlineCode>BufferedInputStream</InlineCode> 包裹 <InlineCode>FileInputStream</InlineCode>，
      再用 <InlineCode>read(byte[])</InlineCode> 读取，两层缓冲叠加效率最佳。
    </Callout>

    <Heading3>5. 转换流：InputStreamReader / OutputStreamWriter</Heading3>

    <Heading4>5.1 作用</Heading4>
    <Paragraph>
      转换流是字节流和字符流之间的<Text bold>桥梁</Text>。它们继承自字符流（<InlineCode>Reader</InlineCode> /
      <InlineCode>Writer</InlineCode>），但构造时需要传入字节流，并可以<Text bold>指定字符集</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>InputStreamReader</InlineCode>：将 <InlineCode>InputStream</InlineCode>（字节流）
        包装为 <InlineCode>Reader</InlineCode>（字符流），读取时按指定编码将字节解码为字符。
      </ListItem>
      <ListItem>
        <InlineCode>OutputStreamWriter</InlineCode>：将 <InlineCode>OutputStream</InlineCode>（字节流）
        包装为 <InlineCode>Writer</InlineCode>（字符流），写入时按指定编码将字符编码为字节。
      </ListItem>
    </UnorderedList>

    <Heading4>5.2 构造方法</Heading4>
    <Table
      head={['构造方法', '说明']}
      rows={[
        ['InputStreamReader(InputStream in)', '使用系统默认字符集'],
        ['InputStreamReader(InputStream in, String charsetName)', '指定字符集名称，如 "UTF-8"、"GBK"'],
        ['InputStreamReader(InputStream in, Charset cs)', '传入 Charset 对象（推荐，StandardCharsets.UTF_8）'],
        ['OutputStreamWriter(OutputStream out)', '使用系统默认字符集'],
        ['OutputStreamWriter(OutputStream out, String charsetName)', '指定字符集名称'],
        ['OutputStreamWriter(OutputStream out, Charset cs)', '传入 Charset 对象'],
      ]}
    />

    <Heading4>5.3 解决 GBK 文件读取乱码问题</Heading4>
    <Paragraph>
      在中文 Windows 系统上，很多旧文件使用 GBK 编码保存。
      若直接用 <InlineCode>FileReader</InlineCode>（系统默认 UTF-8 或 GBK 不一致时）读取，就会乱码。
      使用 <InlineCode>InputStreamReader</InlineCode> 并显式指定 GBK 可解决此问题：
    </Paragraph>
    <CodeBlock
      title="ReadGBK.java — 读取 GBK 编码文件"
      code={`import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.charset.Charset;

public class ReadGBK {
    public static void main(String[] args) {
        // 假设 old_file.txt 是 GBK 编码，当前系统默认字符集是 UTF-8
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(
                        new FileInputStream("old_file.txt"),
                        Charset.forName("GBK")          // 明确指定 GBK 编码
                )
        )) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line); // 正确输出中文，无乱码
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />

    <Heading4>5.4 写入指定编码的文件</Heading4>
    <CodeBlock
      title="WriteUTF8.java — 写入 UTF-8 文件"
      code={`import java.io.*;
import java.nio.charset.StandardCharsets;

public class WriteUTF8 {
    public static void main(String[] args) {
        // 无论系统默认编码是什么，强制以 UTF-8 写入
        try (BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(
                        new FileOutputStream("output_utf8.txt"),
                        StandardCharsets.UTF_8
                )
        )) {
            bw.write("这是 UTF-8 编码的中文内容");
            bw.newLine();
            bw.write("跨平台通用，不会乱码");
            System.out.println("写入完成！");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />

    <Heading4>5.5 FileReader / FileWriter 与转换流的关系</Heading4>
    <Paragraph>
      实际上，<InlineCode>FileReader</InlineCode> 和 <InlineCode>FileWriter</InlineCode>
      是 <InlineCode>InputStreamReader</InlineCode> / <InlineCode>OutputStreamWriter</InlineCode> 的子类，
      只是省略了指定字符集的步骤：
    </Paragraph>
    <CodeBlock
      language="text"
      title="FileReader 等价写法"
      code={`// FileReader("a.txt") 等价于：
new InputStreamReader(new FileInputStream("a.txt"), Charset.defaultCharset())

// 所以当系统默认编码与文件编码不一致时，FileReader 会乱码
// 解决方案：显式使用 InputStreamReader 并指定编码`}
    />

    <Heading3>6. 完整流嵌套结构总结</Heading3>
    <CodeBlock
      language="text"
      title="常见流嵌套组合速查"
      code={`// 1. 高效读取文本文件（推荐日常使用）
BufferedReader br = new BufferedReader(new FileReader("a.txt"));

// 2. 高效读取指定编码的文本文件
BufferedReader br = new BufferedReader(
    new InputStreamReader(new FileInputStream("a.txt"), StandardCharsets.UTF_8));

// 3. 高效写入文本文件
BufferedWriter bw = new BufferedWriter(new FileWriter("a.txt"));

// 4. 高效写入指定编码的文本文件
BufferedWriter bw = new BufferedWriter(
    new OutputStreamWriter(new FileOutputStream("a.txt"), StandardCharsets.UTF_8));

// 5. 高效复制二进制文件
BufferedInputStream  bis = new BufferedInputStream(new FileInputStream("src.bin"));
BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("dst.bin"));`}
    />

    <Callout type="tip" title="JDK 11+ 简化方案">
      JDK 11 引入了 <InlineCode>Files.readString(Path, Charset)</InlineCode> 和
      <InlineCode>Files.writeString(Path, CharSequence, Charset)</InlineCode>，
      可以用一行代码完成读写文本文件，内部自动处理缓冲和编码：
      <br />
      <InlineCode>String content = Files.readString(Path.of("a.txt"), StandardCharsets.UTF_8);</InlineCode>
      <br />
      日常开发中推荐优先使用这种简洁写法。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>缓冲流（BufferedInputStream/OutputStream/Reader/Writer）通过内置缓冲区减少系统调用，大幅提升读写效率。</ListItem>
        <ListItem><InlineCode>BufferedReader.readLine()</InlineCode> 是逐行读取文本的利器，返回 null 表示末尾。</ListItem>
        <ListItem><InlineCode>BufferedWriter.newLine()</InlineCode> 写入跨平台换行符，优于硬编码 <InlineCode>\n</InlineCode>。</ListItem>
        <ListItem>转换流 <InlineCode>InputStreamReader</InlineCode> / <InlineCode>OutputStreamWriter</InlineCode> 是字节流与字符流的桥梁，支持指定字符集。</ListItem>
        <ListItem>读取非系统默认编码的文件时，必须使用转换流并明确指定字符集，否则中文会乱码。</ListItem>
        <ListItem>JDK 11+ 可用 <InlineCode>Files.readString/writeString</InlineCode> 简化文本文件操作。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：概念辨析"
      code={`问：判断以下说法是否正确，并说明理由：

① BufferedInputStream 的默认缓冲区大小是 1024 字节。
② BufferedReader.readLine() 读取的行字符串中包含行末的换行符。
③ InputStreamReader 本质上是一个字符流（继承自 Reader）。
④ 对同一个 FileOutputStream 先包装 BufferedOutputStream，再包装 ObjectOutputStream，
   关闭 ObjectOutputStream 后，FileOutputStream 也会被自动关闭。`}
      answerCode={`答案：

① 错误。BufferedInputStream 的默认缓冲区大小是 8192 字节（8 KB），不是 1024 字节。

② 错误。readLine() 返回的字符串不包含行末的换行符（\\n 或 \\r\\n）。
   这也是为什么在写回时需要手动补充换行符（bw.newLine() 或 bw.write("\\n")）。

③ 正确。InputStreamReader 继承自 Reader（字符流），
   它接受一个 InputStream 作为构造参数，将字节流转换为字符流，
   同时支持指定字符集进行解码。

④ 正确。流的关闭遵循「关外层带内层」原则，
   关闭 ObjectOutputStream 会调用其 close()，进而关闭被包装的 BufferedOutputStream，
   后者关闭时再关闭最底层的 FileOutputStream。
   因此只需关闭最外层流即可释放所有资源。`}
    />

    <CodeBlock
      qa
      title="练习 2：逐行处理 CSV"
      code={`// 文件 "scores.csv" 内容如下：
// 张三,85
// 李四,92
// 王五,78
//
// 读取该文件，计算平均分并打印：
//   张三：85
//   李四：92
//   王五：78
//   平均分：85.00

import java.io.*;

public class AvgScore {
    public static void main(String[] args) {
        // 补全代码（使用 BufferedReader）
    }
}`}
      answerCode={`import java.io.*;

public class AvgScore {
    public static void main(String[] args) {
        int total = 0;
        int count = 0;

        try (BufferedReader br = new BufferedReader(new FileReader("scores.csv"))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",");
                String name  = parts[0];
                int    score = Integer.parseInt(parts[1].trim());
                System.out.println(name + "：" + score);
                total += score;
                count++;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (count > 0) {
            System.out.printf("平均分：%.2f%n", (double) total / count);
        }
    }
}

/*
控制台输出：
张三：85
李四：92
王五：78
平均分：85.00

解析：
- readLine() 每次返回一行内容（不含换行符），null 表示末尾。
- split(",") 按逗号分割，取姓名和分数。
- trim() 去除可能存在的空白字符后再 parseInt()。
- printf("%.2f%n", ...) 格式化保留两位小数输出。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：编码转换"
      code={`// 将 GBK 编码的文件 "gbk_file.txt" 重新编码后保存为 UTF-8 格式的 "utf8_file.txt"。
// 要求：逐行读取，逐行写入，使用缓冲流提升效率。

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class ConvertEncoding {
    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class ConvertEncoding {
    public static void main(String[] args) {
        try (
            // 以 GBK 编码读取源文件
            BufferedReader br = new BufferedReader(
                new InputStreamReader(
                    new FileInputStream("gbk_file.txt"),
                    Charset.forName("GBK")
                )
            );
            // 以 UTF-8 编码写入目标文件
            BufferedWriter bw = new BufferedWriter(
                new OutputStreamWriter(
                    new FileOutputStream("utf8_file.txt"),
                    StandardCharsets.UTF_8
                )
            )
        ) {
            String line;
            while ((line = br.readLine()) != null) {
                bw.write(line);
                bw.newLine();
            }
            System.out.println("编码转换完成：GBK → UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
解析：
- 读取端：FileInputStream（字节）→ InputStreamReader（指定 GBK）→ BufferedReader（缓冲+readLine）
- 写入端：FileOutputStream（字节）→ OutputStreamWriter（指定 UTF-8）→ BufferedWriter（缓冲+newLine）
- 核心思路：InputStreamReader 将 GBK 字节解码为 Unicode 字符，
            OutputStreamWriter 将 Unicode 字符编码为 UTF-8 字节写出，
            中间以 Java char（Unicode）作为统一中转格式。
*/`}
    />
  </article>
);

export default index;
