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
    <Title>API 概述与导包</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 之所以强大，不仅仅是语法本身，更在于它附带了一个极其庞大的<Text bold>类库（Class Library）</Text>。
        我们不需要从零实现"从键盘读输入""生成随机数""操作日期"这些常见功能——JDK 已经提供了现成的类，
        直接拿来用即可。这套"现成类的集合"就叫 <Text bold>API</Text>。
        本节先把 API 和 API 文档讲清楚，再讲清楚如何通过 <InlineCode>import</InlineCode> 导包来使用这些类，
        为后续学习 Scanner、Random 打好基础。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是 API</Heading3>
    <Paragraph>
      <Text bold>API（Application Programming Interface，应用程序编程接口）</Text>，
      在 Java 语境中特指 <Text bold>JDK 提供的一整套现成类与方法的集合</Text>。
      你可以把它理解成一本"工具箱手册"：JDK 里预先写好了几千个类，
      每个类都封装了特定的功能，我们直接调用它们的方法，而不需要关心内部是怎么实现的。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>不重复造轮子</Text>：从键盘读取整数、生成随机数、操作字符串……这些功能 JDK 都写好了，直接用。
      </ListItem>
      <ListItem>
        <Text bold>质量有保障</Text>：JDK 官方类库经过大量测试，可靠性远高于自己随手写一个。
      </ListItem>
      <ListItem>
        <Text bold>统一标准</Text>：全球所有 Java 程序员使用同一套 API，代码可读性和协作性更好。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      常见的 JDK API 类举例：<InlineCode>Scanner</InlineCode>（键盘输入）、
      <InlineCode>Random</InlineCode>（随机数）、<InlineCode>Math</InlineCode>（数学运算）、
      <InlineCode>String</InlineCode>（字符串）、<InlineCode>ArrayList</InlineCode>（动态数组）……
      这些都是我们接下来会陆续学到的。
    </Paragraph>

    <Heading3>2. 如何查阅 API 帮助文档</Heading3>
    <Paragraph>
      Java 官方提供了完整的在线 API 文档（Javadoc），网址为
      <InlineCode>https://docs.oracle.com/en/java/javase/</InlineCode>（选对应版本进入）。
      查阅时按照以下步骤操作，能快速找到任何一个类的用法：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>搜索类名</Text>：在搜索框输入类名，如 <InlineCode>Scanner</InlineCode>，找到对应条目点击进入。
      </ListItem>
      <ListItem>
        <Text bold>查看包名</Text>：页面顶部会显示该类所在的包，如
        <InlineCode>java.util</InlineCode> 下的 <InlineCode>Scanner</InlineCode>。
        包名决定了你需要写什么 <InlineCode>import</InlineCode> 语句。
      </ListItem>
      <ListItem>
        <Text bold>看类的说明</Text>：类名下方有一段描述，说明这个类是干什么用的，以及基本用法示例。
      </ListItem>
      <ListItem>
        <Text bold>查构造方法（Constructor）</Text>：构造方法决定如何 <InlineCode>new</InlineCode> 出该类的对象，
        参数不同代表不同的初始化方式。
      </ListItem>
      <ListItem>
        <Text bold>查成员方法（Method）</Text>：这里列出了该类所有可调用的方法，包括方法名、参数类型、返回值类型和说明。
        找到你需要的方法，照着用即可。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="看不懂英文文档？">
      API 文档全是英文，初学时可以借助翻译工具辅助阅读。重点看：
      方法名、参数列表（<Text bold>Parameters</Text>）、返回值（<Text bold>Returns</Text>）这三项，
      其余描述文字先粗读了解大意即可。长期坚持阅读，英文技术文档能力会显著提升。
    </Callout>

    <Heading3>3. 包（package）是什么</Heading3>
    <Paragraph>
      JDK 有几千个类，如果全部放在一起，命名冲突、查找困难的问题会非常严重。
      因此 Java 用<Text bold>包（package）</Text>来组织类，类似于文件系统中的"文件夹"。
    </Paragraph>
    <Table
      head={['包名', '主要内容']}
      rows={[
        ['java.lang', 'Java 最核心的类：String、Math、Integer、System 等，自动导入，无需 import'],
        ['java.util', '工具类：Scanner、Random、ArrayList、Arrays 等'],
        ['java.io', '输入输出相关：File、InputStream、OutputStream 等'],
        ['java.net', '网络相关：Socket、URL 等'],
        ['java.time', '日期时间（Java 8+）：LocalDate、LocalTime 等'],
      ]}
    />
    <Paragraph>
      包名用<Text bold>小写字母和点</Text>组成，点表示层级关系。
      例如 <InlineCode>java.util.Scanner</InlineCode> 表示：
      <InlineCode>java</InlineCode> 顶层包 → <InlineCode>util</InlineCode> 子包 → <InlineCode>Scanner</InlineCode> 类。
    </Paragraph>

    <Heading3>4. import 导包语句</Heading3>
    <Paragraph>
      使用不在 <InlineCode>java.lang</InlineCode> 包中的类时，必须在源文件顶部（类定义之前）写
      <InlineCode>import</InlineCode> 语句，告诉编译器去哪里找这个类。
    </Paragraph>
    <CodeBlock
      language="text"
      title="import 语句格式"
      code={`import 包名.类名;`}
    />
    <Table
      head={['写法', '说明', '示例']}
      rows={[
        ['导入单个类', '最常用、最推荐，明确指定使用哪个类', 'import java.util.Scanner;'],
        ['导入整个包（通配符）', '导入该包下所有类，不推荐，因为来源不清晰', 'import java.util.*;'],
      ]}
    />
    <UnorderedList>
      <ListItem>
        <Text bold>位置固定</Text>：<InlineCode>import</InlineCode> 语句必须写在
        <InlineCode>package</InlineCode> 语句（如果有）之后、类定义之前。
      </ListItem>
      <ListItem>
        <Text bold>java.lang 无需导入</Text>：<InlineCode>String</InlineCode>、
        <InlineCode>System</InlineCode>、<InlineCode>Math</InlineCode>、<InlineCode>Integer</InlineCode>
        等 <InlineCode>java.lang</InlineCode> 包下的类，JVM 自动导入，不需要写 import。
      </ListItem>
      <ListItem>
        <Text bold>同包下的类无需导入</Text>：同一个包（同一文件夹）下的类可以直接互相使用。
      </ListItem>
    </UnorderedList>
    <Callout type="warning" title="忘写 import 会报编译错误">
      如果使用了 <InlineCode>java.util.Scanner</InlineCode> 却没写 <InlineCode>import java.util.Scanner;</InlineCode>，
      编译时会报 <InlineCode>cannot find symbol</InlineCode> 错误。
      IDEA、Eclipse 等 IDE 会自动提示并帮你补全 import，但要理解其作用和位置。
    </Callout>

    <Heading3>5. 使用 JDK 现成类的完整流程</Heading3>
    <Paragraph>
      使用任何一个需要 <InlineCode>new</InlineCode> 出对象的 JDK API 类，都遵循固定的三步流程：
    </Paragraph>
    <OrderedList>
      <ListItem><Text bold>导包</Text>：在文件顶部类定义之前写 <InlineCode>import 包名.类名;</InlineCode>（java.lang 下的类跳过此步）</ListItem>
      <ListItem><Text bold>创建对象</Text>：<InlineCode>类名 变量名 = new 类名(构造参数);</InlineCode></ListItem>
      <ListItem><Text bold>调用方法</Text>：<InlineCode>变量名.方法名(参数);</InlineCode></ListItem>
    </OrderedList>

    <Heading4>示例 1：使用 Math 类（无需导包，无需 new）</Heading4>
    <Paragraph>
      <InlineCode>Math</InlineCode> 类在 <InlineCode>java.lang</InlineCode> 包中，无需 import，
      且它的方法全部是 <InlineCode>static</InlineCode> 的，直接用类名调用，不需要创建对象。
    </Paragraph>
    <CodeBlock
      title="MathDemo.java"
      code={`public class MathDemo {
    public static void main(String[] args) {
        // Math 在 java.lang 包中，无需 import，直接使用
        // Math 的方法都是 static 的，用类名直接调用，不用 new
        double result1 = Math.sqrt(16.0);   // 开平方根
        double result2 = Math.pow(2, 10);   // 2 的 10 次方
        int    result3 = Math.abs(-99);     // 取绝对值
        int    result4 = Math.max(38, 72);  // 取较大值

        System.out.println("sqrt(16) = " + result1);
        System.out.println("2^10 = " + result2);
        System.out.println("abs(-99) = " + result3);
        System.out.println("max(38, 72) = " + result4);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`sqrt(16) = 4.0
2^10 = 1024.0
abs(-99) = 99
max(38, 72) = 72`} />
    <Paragraph>
      Math 类是一个典型的"工具类"：不需要 <InlineCode>new</InlineCode> 出对象，所有方法直接通过类名调用。
      而后续学到的 <InlineCode>Scanner</InlineCode>、<InlineCode>Random</InlineCode> 则必须先
      <InlineCode>new</InlineCode> 出对象再使用——这是 API 类的两种常见使用方式。
    </Paragraph>

    <Heading4>示例 2：使用 Scanner 类（需要导包，需要 new）</Heading4>
    <Paragraph>
      <InlineCode>Scanner</InlineCode> 在 <InlineCode>java.util</InlineCode> 包中，
      需要 <InlineCode>import</InlineCode>，且必须先 <InlineCode>new</InlineCode> 出对象。
      下面是完整的三步骨架，完整用法在下一节展开。
    </Paragraph>
    <CodeBlock
      title="ScannerSkeleton.java"
      code={`import java.util.Scanner;   // 第一步：导包，位于类定义之前

public class ScannerSkeleton {
    public static void main(String[] args) {
        // 第二步：创建对象
        Scanner sc = new Scanner(System.in);

        // 第三步：调用方法接收输入
        System.out.print("请输入一个整数：");
        int num = sc.nextInt();
        System.out.println("你输入的是：" + num);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（用户输入 42）" code={`请输入一个整数：42
你输入的是：42`} />
    <Callout type="success" title="小结">
      <Paragraph>本节核心要点：</Paragraph>
      <UnorderedList>
        <ListItem>API 是 JDK 提供的现成类库，查阅官方 Javadoc 了解各类的构造方法与成员方法。</ListItem>
        <ListItem>包（package）是类的组织方式，类似文件夹；常用包有 java.lang、java.util 等。</ListItem>
        <ListItem>使用非 <InlineCode>java.lang</InlineCode> 包的类，必须在文件顶部类定义之前写 <InlineCode>import 包名.类名;</InlineCode>。</ListItem>
        <ListItem>使用 API 类的通用三步：导包 → 创建对象（new）→ 调用方法。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：判断 import 语句是否正确"
      code={`// 问：下面代码有什么问题？请指出并说明原因。

import java.lang.String;   // (A)
import java.util.*;        // (B)

public class ImportTest {
    public static void main(String[] args) {
        String s = "Hello";
        Scanner sc = new Scanner(System.in);
        System.out.println(s);
    }
}`}
      answerCode={`问题分析：
  (A) import java.lang.String; 是多余的写法。
      java.lang 包下的所有类（包括 String、System、Math 等）由 JVM 自动导入，
      不需要也不应该手动 import，删除即可。

  (B) import java.util.*; 虽然能让 Scanner 正常使用，但建议改为具体类名：
      import java.util.Scanner;
      这样更清晰，一眼就知道用了哪个类，也避免潜在的命名冲突。

推荐的正确写法：

import java.util.Scanner;

public class ImportTest {
    public static void main(String[] args) {
        String s = "Hello";
        Scanner sc = new Scanner(System.in);
        System.out.println(s);
    }
}

/* 解析：
  java.lang 下的类（String、System、Math 等）无需任何 import 语句。
  java.util 下的类需要 import，推荐精确导入单个类，而非通配符 *。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：使用 Math 类计算"
      code={`// 要求：使用 Math 类的方法，完成以下计算并打印：
// 1. 计算 9 的平方根
// 2. 计算 3 的 4 次方（3^4）
// 3. 求 -15 和 -8 中的较大值
// 4. 将 3.7 向下取整

// 提示：Math 在 java.lang 包，无需 import，直接用类名调用。

public class MathExercise {
    public static void main(String[] args) {
        // 请在这里补全代码
    }
}`}
      answerCode={`public class MathExercise {
    public static void main(String[] args) {
        // 1. 9 的平方根
        System.out.println(Math.sqrt(9));        // 3.0

        // 2. 3 的 4 次方
        System.out.println(Math.pow(3, 4));      // 81.0

        // 3. -15 和 -8 的较大值（负数越接近 0 越大，所以 -8 > -15）
        System.out.println(Math.max(-15, -8));   // -8

        // 4. 3.7 向下取整
        System.out.println(Math.floor(3.7));     // 3.0
    }
}

/* 控制台输出：
3.0
81.0
-8
3.0

解析：
  Math.sqrt(9) 返回 double 类型的 3.0。
  Math.pow(3, 4) = 3*3*3*3 = 81，返回 double 类型的 81.0。
  -8 > -15，所以 Math.max(-15, -8) = -8。
  Math.floor(3.7) 向下取整得 3.0（返回 double）。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：写出使用 Random 类的三步骨架"
      code={`// 要求：按照"导包 -> 创建对象 -> 调用方法"三步，
// 写出使用 java.util.Random 类生成一个随机整数的完整骨架代码。
// 调用方法部分使用 r.nextInt(100) 生成 0~99 的随机数并打印。

public class RandomSkeleton {
    public static void main(String[] args) {
        // 请在这里补全代码（import 写在类外面）
    }
}`}
      answerCode={`// 第一步：导包（写在类定义的上方）
import java.util.Random;

public class RandomSkeleton {
    public static void main(String[] args) {
        // 第二步：创建对象
        Random r = new Random();

        // 第三步：调用方法
        int num = r.nextInt(100);   // 生成 [0, 100) 即 0~99 的随机整数
        System.out.println("随机数：" + num);
    }
}

/* 控制台输出（每次运行结果不同，例如）：
随机数：47

解析：
  import java.util.Random; 告诉编译器 Random 类在 java.util 包中。
  new Random() 创建一个随机数生成器对象，赋给变量 r。
  r.nextInt(100) 生成 0~99（含0不含100）的随机整数。
*/`}
    />
  </article>
);

export default index;
