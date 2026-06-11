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
    <Title>Java 关键字</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        关键字是 Java 语法的"骨架"——每一个都有固定含义，编译器见到它就会触发特定行为。
        本节先搞清楚<Text bold>什么是关键字、三个核心特征</Text>，再分类列出常见关键字，
        最后说明两个容易混淆的概念：<Text bold>字面量</Text>和<Text bold>保留字</Text>。
        这些知识点是后续所有章节的前提，务必牢记。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是关键字</Heading3>
    <Paragraph>
      <Text bold>关键字（Keyword）</Text>是 Java 语言预先定义、赋予了
      <Text bold>特殊语法含义</Text>的单词。例如 <InlineCode>int</InlineCode> 表示整数类型，
      <InlineCode>class</InlineCode> 表示定义一个类，<InlineCode>if</InlineCode> 表示条件判断。
      编译器在解析程序时，一旦看到这些单词，就会按预定规则处理，
      <Text bold>不允许</Text>我们把它们当作变量名、类名等自定义名称来使用。
    </Paragraph>

    <Heading3>2. 关键字的三大特征</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>全部小写</Text>：Java 的关键字没有任何一个包含大写字母。
        例如正确是 <InlineCode>class</InlineCode>，而 <InlineCode>Class</InlineCode>、
        <InlineCode>CLASS</InlineCode> 都<Text bold>不是</Text>关键字（大小写不同就是不同的标识符）。
      </ListItem>
      <ListItem>
        <Text bold>编辑器 / IDE 中有特殊颜色高亮</Text>：在 IntelliJ IDEA、VS Code 等工具里，
        关键字通常显示为橙色或蓝色，方便快速辨认。
      </ListItem>
      <ListItem>
        <Text bold>不能用作自定义标识符</Text>：变量名、类名、方法名、包名等都不能取名为关键字，
        否则编译报错。
      </ListItem>
    </UnorderedList>

    <Heading3>3. 关键字分类速览</Heading3>
    <Paragraph>
      Java 共有 <Text bold>50 个</Text>关键字（不含保留字），按用途可分为以下几类，
      掌握常见的即可，不需要一次背完——用得多了自然就记住了。
    </Paragraph>

    <Heading4>① 数据类型关键字</Heading4>
    <Table
      head={['关键字', '含义']}
      rows={[
        [<InlineCode>byte</InlineCode>, '8 位整数，范围 -128 ~ 127'],
        [<InlineCode>short</InlineCode>, '16 位整数，范围 -32768 ~ 32767'],
        [<InlineCode>int</InlineCode>, '32 位整数，最常用的整数类型'],
        [<InlineCode>long</InlineCode>, '64 位整数，字面量需加后缀 L，如 100L'],
        [<InlineCode>float</InlineCode>, '32 位单精度浮点数，字面量需加后缀 f，如 3.14f'],
        [<InlineCode>double</InlineCode>, '64 位双精度浮点数，小数默认就是 double'],
        [<InlineCode>char</InlineCode>, '16 位 Unicode 字符，用单引号，如 \'A\''],
        [<InlineCode>boolean</InlineCode>, '布尔类型，只有 true 和 false 两个值'],
      ]}
    />

    <Heading4>② 流程控制关键字</Heading4>
    <Table
      head={['关键字', '含义']}
      rows={[
        [<InlineCode>if</InlineCode>, '条件判断'],
        [<InlineCode>else</InlineCode>, '否则分支，与 if 配合'],
        [<InlineCode>switch</InlineCode>, '多分支选择'],
        [<InlineCode>case</InlineCode>, 'switch 的分支标签'],
        [<InlineCode>default</InlineCode>, 'switch 的默认分支'],
        [<InlineCode>for</InlineCode>, 'for 循环'],
        [<InlineCode>while</InlineCode>, 'while 循环'],
        [<InlineCode>do</InlineCode>, 'do-while 循环的开头'],
        [<InlineCode>break</InlineCode>, '跳出循环或 switch'],
        [<InlineCode>continue</InlineCode>, '跳过本次循环，继续下一次'],
        [<InlineCode>return</InlineCode>, '从方法返回，可携带返回值'],
      ]}
    />

    <Heading4>③ 修饰符关键字</Heading4>
    <Table
      head={['关键字', '含义']}
      rows={[
        [<InlineCode>public</InlineCode>, '公开访问权限，任何地方可访问'],
        [<InlineCode>protected</InlineCode>, '受保护，同包及子类可访问'],
        [<InlineCode>private</InlineCode>, '私有，只有本类可访问'],
        [<InlineCode>static</InlineCode>, '静态，属于类本身而非某个对象'],
        [<InlineCode>final</InlineCode>, '最终，修饰变量表示常量，修饰类/方法表示不可继承/重写'],
        [<InlineCode>abstract</InlineCode>, '抽象，修饰类或方法，不提供具体实现'],
      ]}
    />

    <Heading4>④ 类与对象关键字</Heading4>
    <Table
      head={['关键字', '含义']}
      rows={[
        [<InlineCode>class</InlineCode>, '定义一个类'],
        [<InlineCode>interface</InlineCode>, '定义一个接口'],
        [<InlineCode>extends</InlineCode>, '继承父类'],
        [<InlineCode>implements</InlineCode>, '实现接口'],
        [<InlineCode>new</InlineCode>, '创建对象（实例化）'],
        [<InlineCode>this</InlineCode>, '引用当前对象'],
        [<InlineCode>super</InlineCode>, '引用父类对象或调用父类构造器'],
      ]}
    />

    <Heading4>⑤ 其他常用关键字</Heading4>
    <Table
      head={['关键字', '含义']}
      rows={[
        [<InlineCode>void</InlineCode>, '表示方法无返回值'],
        [<InlineCode>package</InlineCode>, '声明当前文件所在的包'],
        [<InlineCode>import</InlineCode>, '引入其他包中的类'],
        [<InlineCode>try</InlineCode>, '异常处理的 try 块'],
        [<InlineCode>catch</InlineCode>, '捕获异常'],
        [<InlineCode>finally</InlineCode>, '无论是否发生异常都会执行的块'],
        [<InlineCode>instanceof</InlineCode>, '判断对象是否是某个类的实例'],
        [<InlineCode>throw</InlineCode>, '手动抛出异常'],
        [<InlineCode>throws</InlineCode>, '声明方法可能抛出的异常'],
      ]}
    />

    <Heading3>4. 两个容易混淆的概念</Heading3>

    <Callout type="warning" title="true / false / null 是字面量，不是关键字">
      <Paragraph>
        严格来说，<InlineCode>true</InlineCode>、<InlineCode>false</InlineCode>、
        <InlineCode>null</InlineCode> 在 Java 语言规范中被归类为
        <Text bold>字面量（Literal）</Text>，而非关键字。
        但它们同样是保留的特殊词，<Text bold>不能用作标识符</Text>，效果和关键字一样。
        学习阶段不用纠结分类，记住"不能拿来命名"就够了。
      </Paragraph>
    </Callout>

    <Callout type="note" title="goto / const 是保留字（Reserved Words）">
      <Paragraph>
        <InlineCode>goto</InlineCode> 和 <InlineCode>const</InlineCode> 是 Java 的
        <Text bold>保留字（Reserved Words）</Text>——Java 目前<Text bold>没有使用</Text>它们，
        但已经"占座"，将来版本可能会赋予含义。
        因此同样<Text bold>不能用作标识符</Text>，写成变量名或类名会直接编译报错。
      </Paragraph>
    </Callout>

    <Heading3>5. 代码示例：关键字在程序里的样子</Heading3>
    <Paragraph>
      下面这段代码综合运用了多个关键字，每行注释标出了涉及的关键字分类：
    </Paragraph>
    <CodeBlock
      title="KeywordDemo.java"
      code={`public class KeywordDemo {          // public、class

    public static void main(String[] args) {  // public、static、void

        // 数据类型关键字
        int age = 18;
        boolean isAdult = true;

        // 流程控制关键字
        if (age >= 18) {
            System.out.println("已成年");
        } else {
            System.out.println("未成年");
        }

        // for 循环
        for (int i = 1; i <= 3; i++) {
            System.out.println("第 " + i + " 次循环");
        }

        // final 修饰常量
        final double PI = 3.14159;
        System.out.println("PI = " + PI);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`已成年
第 1 次循环
第 2 次循环
第 3 次循环
PI = 3.14159`}
    />

    <Heading3>6. 反例：用关键字做变量名，编译直接报错</Heading3>
    <Paragraph>
      下面展示用关键字命名变量会发生什么——IDE 会立刻飘红，<InlineCode>javac</InlineCode> 编译也会失败：
    </Paragraph>
    <CodeBlock
      title="KeywordAsNameError.java（错误示范，无法编译）"
      code={`public class KeywordAsNameError {
    public static void main(String[] args) {
        int class = 1;      // ❌ 编译错误：class 是关键字
        int static = 2;     // ❌ 编译错误：static 是关键字
        int for = 3;        // ❌ 编译错误：for 是关键字
        int goto = 4;       // ❌ 编译错误：goto 是保留字，同样不可用
    }
}`}
    />
    <Callout type="danger" title="常见坑：大小写不同 ≠ 绕过限制">
      <Paragraph>
        <InlineCode>Int</InlineCode>、<InlineCode>Public</InlineCode>、
        <InlineCode>Class</InlineCode> 都不是关键字（Java 严格区分大小写），
        所以可以用作变量名，编译不会报错。
        但这是<Text bold>非常糟糕的习惯</Text>——极易与真正的关键字混淆，
        团队协作时会让人抓狂，<Text bold>实际开发中坚决不要这样命名</Text>。
      </Paragraph>
      <CodeBlock
        title="大小写不同的情况"
        code={`// 以下三行可以编译通过（但强烈不建议！）
int Int = 100;       // 变量名 Int（大写I），不是关键字 int
String Class = "hi"; // 变量名 Class（大写C），不是关键字 class
boolean Static = false; // 变量名 Static（大写S），不是关键字 static`}
      />
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先独立判断，再点 <Text accent>「看答案 →」</Text> 核对。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：判断下列单词的身份"
      code={`判断下面每个单词，填写它属于哪一类：
  A. Java 关键字（Keyword）
  B. 字面量（Literal，如 true/false/null）
  C. 保留字（Reserved Word，如 goto/const）
  D. 以上都不是，可以用作标识符

① int
② True
③ null
④ goto
⑤ class
⑥ final
⑦ const
⑧ hello`}
      answerCode={`① int       → A. 关键字（数据类型）
② True      → D. 以上都不是，可以用作标识符
              （注意：true 是字面量，但 True 大写T，不是关键字/字面量，可以命名）
③ null      → B. 字面量（表示空引用）
④ goto      → C. 保留字（Java 未使用，但已占座，不能做标识符）
⑤ class     → A. 关键字（用于定义类）
⑥ final     → A. 关键字（修饰符，表示不可变/不可继承）
⑦ const     → C. 保留字（Java 未使用，但不能做标识符）
⑧ hello     → D. 以上都不是，可以合法用作标识符`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：找出代码中的关键字"
      code={`问：下面这段代码里，哪些单词是 Java 关键字？请列出来。

public class Animal {
    private String name;
    private int age;

    public void speak() {
        if (age > 0) {
            System.out.println(name + " says hello!");
        }
    }
}`}
      answerCode={`关键字列表（共 8 个，重复出现按出现位置各算一次）：

public   — 修饰符（出现 2 次：class 前、void 前）
class    — 类定义关键字
private  — 修饰符（出现 2 次：两个字段前）
void     — 方法返回类型
if       — 流程控制
int      — 数据类型关键字
String   — 注意：String 是类名（首字母大写），不是关键字！

总结：public、class、private、void、if、int 是关键字；
      String、Animal、name、age、speak 是标识符（自定义名称）。`}
    />
  </article>
);

export default index;
