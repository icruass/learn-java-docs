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
    <Title>字符流</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        字符流是专为<Text bold>纯文本文件</Text>设计的流，它在字节流的基础上增加了
        字符编码/解码逻辑，彻底解决了字节流读写中文时可能出现乱码的问题。
        本节首先演示字节流读中文的乱码现象，然后介绍
        <InlineCode>FileReader</InlineCode>（读）和 <InlineCode>FileWriter</InlineCode>（写）的用法，
        包括 <InlineCode>flush()</InlineCode> 与 <InlineCode>close()</InlineCode> 的区别，
        最后提供完整的文本文件复制案例，并对比字节流与字符流的适用边界。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要字符流</Heading3>
    <Paragraph>
      在 UTF-8 编码下，一个中文汉字占 <Text bold>3 个字节</Text>；在 GBK 编码下占 2 个字节。
      当用字节流读取中文文本时，如果缓冲区大小恰好在汉字字节边界截断，
      就会把一个完整汉字拆成两段分别转换，产生乱码。
    </Paragraph>
    <CodeBlock
      title="乱码演示（反例，不推荐）"
      code={`import java.io.FileInputStream;
import java.io.IOException;

public class GarbledDemo {
    public static void main(String[] args) {
        // 假设 chinese.txt 内容是 "你好世界"（UTF-8，共 12 字节）
        try (FileInputStream fis = new FileInputStream("chinese.txt")) {
            byte[] buf = new byte[5]; // 缓冲区故意设为 5，不是 3 的倍数
            int len;
            while ((len = fis.read(buf)) != -1) {
                // UTF-8 中 "你" 占 3 字节，"好" 占 3 字节
                // buf[0..4] 会截断 "好" 字，导致乱码
                System.out.print(new String(buf, 0, len)); // ⚠️ 可能乱码
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock language="text" title="可能的控制台输出（乱码）" code={`你好???界`} />
    <Paragraph>
      字符流的底层仍然是字节，但它会以<Text bold>字符为单位</Text>解码，
      保证每次操作的是一个完整字符，因此不会出现上述截断问题。
    </Paragraph>

    <Heading3>2. FileReader — 读取文本文件</Heading3>

    <Heading4>2.1 构造方法</Heading4>
    <Table
      head={['构造方法', '说明']}
      rows={[
        ['FileReader(String fileName)', '传入文件路径，使用系统默认字符集（通常为 UTF-8 或 GBK）'],
        ['FileReader(File file)', '传入 File 对象'],
        ['FileReader(File file, Charset charset)', '（JDK 11+）传入 File 对象并指定字符集，推荐'],
      ]}
    />
    <Callout type="tip" title="JDK 11+ 可指定字符集">
      JDK 11 之前，<InlineCode>FileReader</InlineCode> 只能使用系统默认字符集（通常是平台相关的），
      在 Windows 上可能是 GBK，在 Linux 上通常是 UTF-8，存在跨平台乱码风险。
      JDK 11 起支持 <InlineCode>new FileReader(file, StandardCharsets.UTF_8)</InlineCode>，
      建议在需要明确编码的场景使用。
    </Callout>

    <Heading4>2.2 read() — 每次读 1 个字符</Heading4>
    <Paragraph>
      <InlineCode>int read()</InlineCode> 每次读取一个字符，返回该字符对应的 int 值（0～65535）；
      到达文件末尾时返回 <InlineCode>-1</InlineCode>。
    </Paragraph>
    <CodeBlock
      title="ReadOneChar.java"
      code={`import java.io.FileReader;
import java.io.IOException;

public class ReadOneChar {
    public static void main(String[] args) {
        // 假设 poem.txt 内容是 "春眠不觉晓"
        try (FileReader fr = new FileReader("poem.txt")) {
            int ch;
            while ((ch = fr.read()) != -1) {
                System.out.print((char) ch); // 强转为 char 即可正确输出汉字
            }
            System.out.println(); // 换行
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`春眠不觉晓`} />

    <Heading4>2.3 read(char[] cbuf) — 高效读取（推荐）</Heading4>
    <Paragraph>
      与字节流类似，字符流也有数组版本，每次读多个字符，效率更高。
    </Paragraph>
    <CodeBlock
      title="ReadCharArray.java"
      code={`import java.io.FileReader;
import java.io.IOException;

public class ReadCharArray {
    public static void main(String[] args) {
        try (FileReader fr = new FileReader("poem.txt")) {
            char[] cbuf = new char[1024]; // 字符数组，每次最多读 1024 个字符
            int len;
            while ((len = fr.read(cbuf)) != -1) {
                // 同样要用 len，不能用 cbuf.length
                String s = new String(cbuf, 0, len);
                System.out.print(s);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />

    <Heading3>3. FileWriter — 写入文本文件</Heading3>

    <Heading4>3.1 构造方法</Heading4>
    <Table
      head={['构造方法', '说明']}
      rows={[
        ['FileWriter(String fileName)', '覆盖模式，文件不存在则创建'],
        ['FileWriter(String fileName, boolean append)', 'append=true 追加模式'],
        ['FileWriter(File file)', '覆盖模式，传 File 对象'],
        ['FileWriter(File file, Charset charset)', '（JDK 11+）指定字符集，覆盖模式'],
        ['FileWriter(File file, Charset charset, boolean append)', '（JDK 11+）指定字符集 + 追加模式'],
      ]}
    />

    <Heading4>3.2 write() 方法</Heading4>
    <Table
      head={['方法', '说明']}
      rows={[
        ['write(int c)', '写入单个字符'],
        ['write(String str)', '写入字符串（最常用）'],
        ['write(String str, int off, int len)', '写入字符串的一部分'],
        ['write(char[] cbuf)', '写入字符数组'],
        ['write(char[] cbuf, int off, int len)', '写入字符数组的一部分'],
      ]}
    />

    <Heading4>3.3 flush() 和 close() 的区别</Heading4>
    <Paragraph>
      字符流内部有缓冲区，<InlineCode>write()</InlineCode> 调用后数据可能只在缓冲区中，
      尚未真正写到磁盘。需要通过以下两个方法将缓冲区内容刷出：
    </Paragraph>
    <Table
      head={['方法', '作用', '调用后流状态']}
      rows={[
        ['flush()', '将缓冲区数据强制写到磁盘，但流仍然打开可以继续写入', '流保持打开'],
        ['close()', '先执行 flush()，再关闭流，释放所有资源，关闭后不可再写', '流已关闭'],
      ]}
    />
    <Callout type="warning" title="只 write() 不 close() 会丢数据">
      如果程序异常退出或者忘记调用 <InlineCode>close()</InlineCode>，
      缓冲区里尚未写盘的数据会<Text bold>全部丢失</Text>！
      使用 <InlineCode>try-with-resources</InlineCode> 可确保 <InlineCode>close()</InlineCode> 一定被调用。
    </Callout>
    <CodeBlock
      title="WriteFile.java"
      code={`import java.io.FileWriter;
import java.io.IOException;

public class WriteFile {
    public static void main(String[] args) {
        // 写入中文内容到文件
        try (FileWriter fw = new FileWriter("story.txt")) {
            fw.write("床前明月光，");
            fw.write(System.lineSeparator());
            fw.write("疑是地上霜。");
            fw.write(System.lineSeparator());
            fw.write("举头望明月，");
            fw.write(System.lineSeparator());
            fw.write("低头思故乡。");
            fw.write(System.lineSeparator());
            // try-with-resources 结束时自动调用 close()，先 flush 后关流
            System.out.println("写入完成！");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock language="text" title="story.txt 文件内容" code={`床前明月光，
疑是地上霜。
举头望明月，
低头思故乡。`} />

    <Heading3>4. 文本文件复制（字符流）</Heading3>
    <Paragraph>
      用字符流复制 <InlineCode>.txt</InlineCode> 文件与字节流复制逻辑类似，
      但以字符为单位，对中文更友好：
    </Paragraph>
    <CodeBlock
      title="TextFileCopy.java"
      code={`import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class TextFileCopy {
    public static void main(String[] args) {
        String src  = "D:/docs/readme.txt";
        String dest = "D:/docs/readme_copy.txt";

        try (FileReader  fr = new FileReader(src);
             FileWriter  fw = new FileWriter(dest)) {

            char[] cbuf = new char[1024];
            int len;
            while ((len = fr.read(cbuf)) != -1) {
                fw.write(cbuf, 0, len);
            }
            System.out.println("文本文件复制完成！");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`}
    />

    <Heading3>5. 字节流 vs 字符流 对比</Heading3>
    <Table
      head={['对比维度', '字节流（InputStream/OutputStream）', '字符流（Reader/Writer）']}
      rows={[
        ['处理单位', '字节（byte，8 bit）', '字符（char，16 bit）'],
        ['顶级父类', 'InputStream / OutputStream', 'Reader / Writer'],
        ['适用文件', '任意文件（图片、视频、文本均可）', '仅纯文本文件'],
        ['中文乱码', '可能出现（取决于缓冲区切割位置）', '不会乱码（字符为单位操作）'],
        ['是否理解编码', '否，直接操作原始字节', '是，内部自动处理字符编码转换'],
        ['读写字符串', '需手动调用 getBytes() / new String()', '直接 write(String)，read(char[])'],
        ['典型类', 'FileInputStream、FileOutputStream', 'FileReader、FileWriter'],
      ]}
    />

    <Callout type="tip" title="字符流只能处理文本文件">
      <Text bold>图片、音频、视频、ZIP 等二进制文件绝对不能用字符流处理！</Text>
      字符流会将字节序列按字符编码解释，遇到无效编码字节时可能用替换字符（如 <InlineCode>?</InlineCode>）
      替换，导致文件内容被破坏，复制后的文件无法打开。
    </Callout>

    <Heading3>6. 完整综合示例：读写配置文件</Heading3>
    <Paragraph>
      下面展示一个实际开发中常见的场景：读取一个配置文件，修改其中一行，再写回：
    </Paragraph>
    <CodeBlock
      title="ConfigEditor.java"
      code={`import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class ConfigEditor {
    public static void main(String[] args) throws IOException {
        String configFile = "config.txt";

        // 第一步：读取全部内容
        StringBuilder sb = new StringBuilder();
        try (FileReader fr = new FileReader(configFile)) {
            char[] cbuf = new char[512];
            int len;
            while ((len = fr.read(cbuf)) != -1) {
                sb.append(cbuf, 0, len);
            }
        }

        String content = sb.toString();
        System.out.println("原始内容：");
        System.out.println(content);

        // 第二步：修改内容（将旧版本号替换为新版本号）
        String updated = content.replace("version=1.0", "version=2.0");

        // 第三步：覆盖写回文件
        try (FileWriter fw = new FileWriter(configFile)) {
            fw.write(updated);
        }

        System.out.println("修改后内容：");
        System.out.println(updated);
    }
}`}
    />
    <CodeBlock language="text" title="config.txt 原始内容" code={`app=MyApp
version=1.0
debug=false`} />
    <CodeBlock language="text" title="修改后 config.txt 内容" code={`app=MyApp
version=2.0
debug=false`} />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>字符流以字符为单位操作，天然支持中文，不会出现截断乱码。</ListItem>
        <ListItem><InlineCode>FileReader</InlineCode> 读文本文件；<InlineCode>FileWriter</InlineCode> 写文本文件。</ListItem>
        <ListItem><InlineCode>read(char[])</InlineCode> 比 <InlineCode>read()</InlineCode> 效率高，使用时注意用返回的 <InlineCode>len</InlineCode>。</ListItem>
        <ListItem><InlineCode>flush()</InlineCode> 刷缓冲但不关流；<InlineCode>close()</InlineCode> 先 flush 再关流——推荐用 try-with-resources 自动关闭。</ListItem>
        <ListItem>字符流只适用于纯文本文件；图片、视频等二进制文件必须用字节流。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：flush 与 close 概念题"
      code={`问：请回答以下关于 FileWriter 的问题：

① 调用 flush() 之后还能继续调用 write() 吗？
② 调用 close() 之后再调用 write() 会发生什么？
③ 如果只调用 write() 而忘记调用 close()，文件里会有内容吗？为什么？`}
      answerCode={`答案：

① 可以继续调用 write()。
   flush() 只是将缓冲区中的数据强制写到磁盘，流本身并未关闭，后续仍可继续写入。

② 会抛出 IOException："Stream closed"（流已关闭）。
   close() 关闭流之后，任何读写操作都会抛出异常。

③ 不一定有内容（或内容不完整）。
   FileWriter 内部有缓冲区，write() 只是把数据放入缓冲区，
   缓冲区满了才会自动刷到磁盘。如果程序正常退出，JVM 会尝试关闭流（触发 flush），
   但如果程序异常崩溃，缓冲区中的数据将全部丢失。
   因此必须确保 close() 被调用（推荐 try-with-resources）。`}
    />

    <CodeBlock
      qa
      title="练习 2：逐字符统计汉字数量"
      code={`// 读取文件 "text.txt"，统计其中汉字的数量并打印结果。
// 判断汉字的方法：Unicode 范围 \\u4E00 ~ \\u9FA5（常用汉字区）。
// 例如文件内容 "Hello你好World世界" → 汉字数：4

import java.io.FileReader;
import java.io.IOException;

public class CountChinese {
    public static void main(String[] args) {
        // 补全代码
    }
}`}
      answerCode={`import java.io.FileReader;
import java.io.IOException;

public class CountChinese {
    public static void main(String[] args) {
        int chineseCount = 0;

        try (FileReader fr = new FileReader("text.txt")) {
            int ch;
            while ((ch = fr.read()) != -1) {
                // 汉字 Unicode 范围：\\u4E00（19968）~ \\u9FA5（40869）
                if (ch >= '\\u4E00' && ch <= '\\u9FA5') {
                    chineseCount++;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println("汉字数：" + chineseCount);
    }
}

/*
解析：
- FileReader.read() 每次返回一个字符的 Unicode 值（int 类型）。
- 中文汉字的 Unicode 码点在 \\u4E00~\\u9FA5 范围内（CJK统一汉字基本区）。
- 注意：这里用单字节 read() 而非数组版本，是因为统计时需要逐字符检查，
  若用 read(char[]) 也可以，只需遍历数组中每个字符做同样判断。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：文本文件内容翻转"
      code={`// 将文件 "original.txt" 的内容按行翻转顺序后写入 "reversed.txt"。
// 例如 original.txt 内容：
//   第一行
//   第二行
//   第三行
// reversed.txt 输出：
//   第三行
//   第二行
//   第一行
//
// 提示：可先用 FileReader 读取全部内容存入 List，再逆序用 FileWriter 写出。

import java.io.*;
import java.util.*;

public class ReverseLines {
    public static void main(String[] args) throws IOException {
        // 补全代码
    }
}`}
      answerCode={`import java.io.*;
import java.util.*;

public class ReverseLines {
    public static void main(String[] args) throws IOException {
        List<String> lines = new ArrayList<>();

        // 第一步：读取所有行
        try (FileReader fr = new FileReader("original.txt")) {
            char[] cbuf = new char[1024];
            int len;
            StringBuilder sb = new StringBuilder();
            while ((len = fr.read(cbuf)) != -1) {
                sb.append(cbuf, 0, len);
            }
            // 按换行符分割
            String[] arr = sb.toString().split("\\n");
            for (String line : arr) {
                // trim() 去掉 Windows 换行符残留的 \\r
                lines.add(line.trim());
            }
        }

        // 第二步：翻转行顺序
        Collections.reverse(lines);

        // 第三步：写入新文件
        try (FileWriter fw = new FileWriter("reversed.txt")) {
            for (int i = 0; i < lines.size(); i++) {
                fw.write(lines.get(i));
                if (i < lines.size() - 1) {
                    fw.write(System.lineSeparator());
                }
            }
        }

        System.out.println("翻转完成，结果已写入 reversed.txt");
    }
}

/*
解析：
- 读取全部内容放入 StringBuilder，再按 \\n 分割成行列表；
- Collections.reverse() 原地翻转列表；
- 写回时用 System.lineSeparator() 保证跨平台换行符正确。
*/`}
    />
  </article>
);

export default index;
