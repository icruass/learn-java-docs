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
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>第一个程序 HelloWorld</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        几乎所有语言的第一课都是“在屏幕上打印 Hello World”。别小看这十几个字符，它能帮你
        <Text bold>跑通从“写代码”到“看到输出”的完整链路</Text>，并认识 Java 程序最基本的骨架：
        <InlineCode>class</InlineCode>、<InlineCode>main</InlineCode> 方法、
        <InlineCode>System.out.println</InlineCode>。本节把每一行、每一个单词都讲清楚，
        再演示怎么编译运行，最后罗列新手最常踩的几个坑。
      </Paragraph>
    </Callout>

    <Heading3>1. 完整代码先睹为快</Heading3>
    <CodeBlock
      title="HelloWorld.java"
      code={`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`}
    />
    <Paragraph>运行它，控制台会输出：</Paragraph>
    <CodeBlock language="text" title="控制台输出" code={`Hello, World!`} />

    <Heading3>2. 逐行拆解：每个单词都有用</Heading3>
    <Heading4>① public class HelloWorld：类的外壳</Heading4>
    <Paragraph>
      定义一个<Text bold>类（class）</Text>，名字叫 <InlineCode>HelloWorld</InlineCode>。
      Java 规定：所有代码都得写在类里面，没有“游离”的代码。
    </Paragraph>
    <Callout type="warning" title="文件名必须和 public 类名一模一样">
      如果类被 <InlineCode>public</InlineCode> 修饰，那么<Text bold>文件名必须与类名完全相同</Text>
      （含大小写），扩展名是 <InlineCode>.java</InlineCode>。所以
      <InlineCode>public class HelloWorld</InlineCode> 必须存进
      <InlineCode>HelloWorld.java</InlineCode>，否则编译直接报错。
    </Callout>

    <Heading4>② public static void main(String[] args)</Heading4>
    <Paragraph>
      这是 <Text bold>主方法（main 方法）</Text>，是程序的<Text bold>入口</Text>——JVM
      运行你的程序时，就从这里第一行开始执行。它的写法是<Text bold>固定格式</Text>，
      建议先“背下来”，每个部分的含义后面章节会逐一展开：
    </Paragraph>
    <Table
      head={['部分', '含义']}
      rows={[
        [<InlineCode>public</InlineCode>, '公开的，JVM 在任何地方都能调用到它'],
        [<InlineCode>static</InlineCode>, '静态的，不用创建对象就能直接运行（见 static 章节）'],
        [<InlineCode>void</InlineCode>, '没有返回值'],
        [<InlineCode>main</InlineCode>, '方法名，JVM 固定找名为 main 的方法作为入口'],
        [
          <InlineCode>String[] args</InlineCode>,
          '参数：运行时从命令行传进来的字符串数组（暂时用不到）',
        ],
      ]}
    />

    <Heading4>③ System.out.println("Hello, World!");</Heading4>
    <Paragraph>
      这行才是真正“干活”的：把双引号里的内容打印到控制台。拆开看：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>System.out</InlineCode>：标准输出（控制台）。
      </ListItem>
      <ListItem>
        <InlineCode>println</InlineCode>：print line，打印内容并<Text bold>换行</Text>；
        若用 <InlineCode>print</InlineCode> 则打印后<Text bold>不换行</Text>。
      </ListItem>
      <ListItem>
        <InlineCode>"Hello, World!"</InlineCode>：要打印的字符串，必须用
        <Text bold>英文双引号</Text>括起来。
      </ListItem>
      <ListItem>
        结尾的 <InlineCode>;</InlineCode>：Java 里<Text bold>每条语句都以英文分号结束</Text>。
      </ListItem>
    </UnorderedList>

    <Heading3>3. 怎么编译和运行</Heading3>
    <Paragraph>
      抛开 IDE，理解“命令行两步走”能帮你看清 Java 的运行机制（对应上一节的“先编译、再运行”）：
    </Paragraph>
    <CodeBlock
      language="bash"
      title="命令行编译 + 运行"
      code={`# 第 1 步：编译，得到 HelloWorld.class（字节码）
javac HelloWorld.java

# 第 2 步：运行，注意只写类名，不要带 .class
java HelloWorld`}
    />
    <Callout type="danger" title="最常见的低级错误：java HelloWorld.class">
      运行时写成 <InlineCode>java HelloWorld.class</InlineCode> 会报错。
      <Text bold>运行只写类名 </Text>
      <InlineCode>java HelloWorld</InlineCode>，不要带扩展名。
    </Callout>

    <Heading3>4. 新手高频坑（对照自查）</Heading3>
    <Table
      head={['报错/现象', '原因', '怎么改']}
      rows={[
        ['找不到或无法加载主类', '类名和文件名不一致 / 运行时多写了 .class', '保证文件名=类名；运行只写类名'],
        ['需要 \';\'（need \';\'）', '某条语句末尾漏了分号', '补上英文分号 ;'],
        ['程序包不存在 / 符号找不到', '把中文符号当英文用，如 “ ” ， ；', '引号、括号、分号一律用英文半角'],
        ['大小写相关错误', 'Java 严格区分大小写，main 写成 Main', '关键字、方法名照抄，区分大小写'],
      ]}
    />
    <Callout type="tip">
      90% 的入门报错就两类：<Text bold>中文标点</Text>（尤其是分号、引号、括号）和
      <Text bold>大小写</Text>。报错看不懂时，先扫一遍这两点。
    </Callout>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己写/改，再点右上角 <Text accent>「看答案 →」</Text>对照。
    </Paragraph>
    <CodeBlock
      qa
      title="练习 1：打印自我介绍"
      code={`// 要求：新建 Info.java，运行后在控制台依次打印三行：
//   我叫张三
//   今年18岁
//   爱好是写Java
// 提示：用三条 System.out.println

public class Info {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Info {
    public static void main(String[] args) {
        System.out.println("我叫张三");
        System.out.println("今年18岁");
        System.out.println("爱好是写Java");
    }
}

/* 控制台输出：
我叫张三
今年18岁
爱好是写Java
*/`}
    />
    <CodeBlock
      qa
      title="练习 2：找出并修复 4 个错误"
      code={`// 下面这段代码有 4 处错误，请找出来并改对。
// （提示：类名/大小写/标点/分号）

public class hello {
    public static void Main(String[] args) {
        System.out.println("Hello"）
        System.out.println("World");
    }
}`}
      answerCode={`public class Hello {                 // 错误1: 文件名若为 Hello.java, 类名应为 Hello(大写H)
    public static void main(String[] args) {   // 错误2: Main -> main(JVM 只认小写 main)
        System.out.println("Hello");     // 错误3: 中文右括号 ） -> 英文 ) ; 错误4: 这行结尾漏了分号
        System.out.println("World");
    }
}

/* 说明：
   1) public 类的类名必须与文件名一致，且习惯类名首字母大写；
   2) 入口方法名固定为小写 main；
   3) "Hello" 后面用了中文括号 ） 且漏了分号，应改为英文 ) 并补 ;
*/`}
    />
  </article>
);

export default index;
