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
    <Title>数组的定义与初始化</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        目前我们存储数据都是一个变量对应一个值，如果要存储 100 个学生的成绩，就得声明 100 个变量——这显然不现实。
        <Text bold>数组（Array）</Text>就是为了解决这个问题而生的：用一个变量名管理一组相同类型的数据，
        按顺序存储在内存的连续空间中，通过索引快速访问任意元素。
        本节掌握数组的两种定义格式、两种初始化方式，以及各类型元素的默认值规则。
      </Paragraph>
    </Callout>

    <Heading3>1. 数组是什么</Heading3>
    <Paragraph>
      数组是<Text bold>存储同一类型、固定数量数据的容器</Text>。核心特征有三点：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>同类型</Text>：一个数组只能存同一种数据类型（如全是 int，或全是 String），
        不能混放不同类型。
      </ListItem>
      <ListItem>
        <Text bold>定长</Text>：数组一旦创建，长度就固定了，不能动态增减。
        想要可变长度的集合，后续章节会学习 ArrayList。
      </ListItem>
      <ListItem>
        <Text bold>连续存储 + 快速访问</Text>：数组元素在堆内存中连续排列，
        通过索引（下标）可以直接定位任意元素，访问效率极高。
      </ListItem>
    </UnorderedList>

    <Heading3>2. 数组的定义格式</Heading3>
    <Paragraph>
      Java 提供了两种声明数组变量的语法，推荐第一种：
    </Paragraph>
    <Table
      head={['格式', '示例', '说明']}
      rows={[
        ['数据类型[] 变量名（推荐）', 'int[] arr', '中括号紧跟类型，一眼看出"这是一个 int 数组"，更符合 Java 风格'],
        ['数据类型 变量名[]（不推荐）', 'int arr[]', '中括号写在变量名后，源自 C 语言风格，Java 中合法但不推荐使用'],
      ]}
    />
    <Callout type="tip" title="为什么推荐 int[] arr 写法">
      当一行声明多个变量时，<InlineCode>int[] a, b</InlineCode> 表示 a 和 b 都是 int 数组；
      而 <InlineCode>int a[], b</InlineCode> 则表示 a 是数组、b 是普通 int——很容易产生误解。
      因此始终推荐把 <InlineCode>[]</InlineCode> 紧跟类型写，语义更清晰。
    </Callout>

    <Heading3>3. 动态初始化</Heading3>
    <Paragraph>
      <Text bold>动态初始化</Text>：只指定数组的长度，由 JVM 自动给每个元素赋默认值。
      适用于"暂时不知道具体元素值，后续再逐一赋值"的场景。
    </Paragraph>
    <CodeBlock
      language="text"
      title="动态初始化格式"
      code={`数据类型[] 变量名 = new 数据类型[长度];`}
    />
    <Paragraph>
      关键字 <InlineCode>new</InlineCode> 表示在堆内存中开辟一块连续空间；
      方括号内填写数组长度（正整数），表示能存多少个元素。
      创建后每个元素自动获得该类型的<Text bold>默认值</Text>（详见第 5 节）。
    </Paragraph>
    <CodeBlock
      title="DynamicInit.java"
      code={`public class DynamicInit {
    public static void main(String[] args) {
        // 动态初始化：创建长度为 5 的 int 数组，元素默认值全为 0
        int[] scores = new int[5];

        // 手动赋值
        scores[0] = 90;
        scores[1] = 85;
        scores[2] = 78;
        // scores[3] 和 scores[4] 未赋值，保持默认值 0

        System.out.println(scores[0]);  // 90
        System.out.println(scores[1]);  // 85
        System.out.println(scores[2]);  // 78
        System.out.println(scores[3]);  // 0（默认值）
        System.out.println(scores[4]);  // 0（默认值）
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`90
85
78
0
0`} />
    <Paragraph>
      <InlineCode>scores[3]</InlineCode> 和 <InlineCode>scores[4]</InlineCode> 没有手动赋值，
      因此保持 int 类型的默认值 0。
    </Paragraph>

    <Heading3>4. 静态初始化</Heading3>
    <Paragraph>
      <Text bold>静态初始化</Text>：在定义数组时直接指定所有元素的值，
      长度由 JVM 根据元素个数自动推断。适用于"初始数据已知"的场景。
    </Paragraph>
    <Heading4>4.1 标准格式</Heading4>
    <CodeBlock
      language="text"
      title="静态初始化标准格式"
      code={`数据类型[] 变量名 = new 数据类型[]{元素1, 元素2, 元素3, ...};`}
    />
    <Heading4>4.2 简化格式（推荐）</Heading4>
    <CodeBlock
      language="text"
      title="静态初始化简化格式"
      code={`数据类型[] 变量名 = {元素1, 元素2, 元素3, ...};`}
    />
    <Paragraph>
      简化格式省略了 <InlineCode>new 数据类型[]</InlineCode>，写法更简洁，是日常最常用的写法。
      两种格式效果完全相同，推荐优先使用简化格式。
    </Paragraph>
    <Callout type="danger" title="简化格式不能拆成两行！">
      <Paragraph>
        简化格式 <InlineCode>{`{...}`}</InlineCode> 只能与声明语句写在同一行，不能先声明再单独赋值。
        以下写法会直接<Text bold>编译报错</Text>：
      </Paragraph>
      <CodeBlock
        language="text"
        title="错误示范（编译报错）"
        code={`int[] arr;
arr = {1, 2, 3};  // 编译错误！简化格式不能出现在独立的赋值语句中`}
      />
      <Paragraph>
        如果需要先声明再赋值，必须使用标准格式：
      </Paragraph>
      <CodeBlock
        language="text"
        title="正确写法（先声明后赋值用标准格式）"
        code={`int[] arr;
arr = new int[]{1, 2, 3};  // 标准格式可以出现在独立的赋值语句中`}
      />
    </Callout>
    <CodeBlock
      title="StaticInit.java"
      code={`public class StaticInit {
    public static void main(String[] args) {
        // 标准格式静态初始化
        int[] nums1 = new int[]{10, 20, 30, 40, 50};

        // 简化格式静态初始化（推荐）
        int[] nums2 = {10, 20, 30, 40, 50};

        // 两种格式效果相同
        System.out.println(nums1[0]);  // 10
        System.out.println(nums2[0]);  // 10

        // 字符串数组（简化格式）
        String[] names = {"Alice", "Bob", "Charlie"};
        System.out.println(names[0]);  // Alice
        System.out.println(names[2]);  // Charlie

        // 先声明再赋值，必须用标准格式
        double[] prices;
        prices = new double[]{9.9, 19.9, 29.9};
        System.out.println(prices[1]);  // 19.9
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`10
10
Alice
Charlie
19.9`} />

    <Heading3>5. 各类型的默认值</Heading3>
    <Paragraph>
      使用动态初始化时，JVM 会为每个元素自动赋默认值。不同类型的默认值如下表所示：
    </Paragraph>
    <Table
      head={['数据类型', '默认值', '说明']}
      rows={[
        ['byte / short / int / long', '0', '所有整数类型默认为零'],
        ['float / double', '0.0', '浮点类型默认为零（以浮点数形式存储）'],
        ['boolean', 'false', '布尔类型默认为 false'],
        ['char', '\\u0000（空字符）', '字符类型默认为 Unicode 编码 0 对应的空字符，不是空格'],
        ['String 及所有引用类型', 'null', '引用类型默认为 null，表示"不指向任何对象"'],
      ]}
    />
    <Callout type="warning" title="char 默认值是空字符，不是空格">
      <InlineCode>char</InlineCode> 的默认值是 Unicode 编码 0 对应的空字符（<InlineCode> </InlineCode>），
      而不是空格字符（空格的 Unicode 是 32）。直接打印时看起来像空白，但两者实际是不同字符，
      在做字符比较时需要注意区分。
    </Callout>
    <CodeBlock
      title="DefaultValueDemo.java"
      code={`public class DefaultValueDemo {
    public static void main(String[] args) {
        int[]     intArr  = new int[1];
        double[]  dblArr  = new double[1];
        boolean[] boolArr = new boolean[1];
        char[]    charArr = new char[1];
        String[]  strArr  = new String[1];

        System.out.println("int     默认值：" + intArr[0]);         // 0
        System.out.println("double  默认值：" + dblArr[0]);         // 0.0
        System.out.println("boolean 默认值：" + boolArr[0]);        // false
        System.out.println("char    默认值（Unicode）：" + (int) charArr[0]); // 0
        System.out.println("String  默认值：" + strArr[0]);         // null
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`int     默认值：0
double  默认值：0.0
boolean 默认值：false
char    默认值（Unicode）：0
String  默认值：null`} />
    <Paragraph>
      将 <InlineCode>charArr[0]</InlineCode> 强制转换为 <InlineCode>int</InlineCode> 打印，
      得到 0，证明其 Unicode 值为 0（空字符），而非空格（32）。
      <InlineCode>strArr[0]</InlineCode> 输出 <InlineCode>null</InlineCode>，
      说明引用类型在动态初始化时不指向任何对象。
    </Paragraph>

    <Heading3>6. 动态初始化 vs 静态初始化</Heading3>
    <Table
      head={['对比项', '动态初始化', '静态初始化']}
      rows={[
        ['语法', 'new 类型[长度]', 'new 类型[]{值, ...} 或 {值, ...}'],
        ['元素初始值', 'JVM 自动赋默认值', '手动指定每个元素的值'],
        ['适用场景', '数量确定，值暂未知（后续逐一赋值）', '数量和值都已知，直接枚举出来'],
        ['长度是否需要手写', '必须指定', '不能指定（由元素个数自动推断）'],
      ]}
    />
    <Callout type="tip" title="静态初始化时不能同时指定长度">
      <InlineCode>new int[3]{`{1, 2, 3}`}</InlineCode> 是错误写法——既然已经列出了元素，
      长度由编译器自动计算，不能再在括号里写数字，否则编译报错。
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：动态初始化并赋值"
      code={`// 要求：
// 1. 用动态初始化创建长度为 4 的 int 数组 ages；
// 2. 依次赋值：18, 22, 17, 25；
// 3. 逐行打印每个元素（用 4 个 System.out.println）。

public class Exercise01 {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise01 {
    public static void main(String[] args) {
        int[] ages = new int[4];  // 动态初始化，长度 4，默认值全为 0
        ages[0] = 18;
        ages[1] = 22;
        ages[2] = 17;
        ages[3] = 25;

        System.out.println(ages[0]);  // 18
        System.out.println(ages[1]);  // 22
        System.out.println(ages[2]);  // 17
        System.out.println(ages[3]);  // 25
    }
}

/* 控制台输出：
18
22
17
25
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：静态初始化字符串数组"
      code={`// 要求：
// 用简化的静态初始化格式声明 String 数组 fruits，
// 包含三个元素："apple"、"banana"、"cherry"。
// 打印第一个和最后一个元素。

public class Exercise02 {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {
    public static void main(String[] args) {
        String[] fruits = {"apple", "banana", "cherry"};  // 简化静态初始化

        System.out.println(fruits[0]);  // 第一个：apple
        System.out.println(fruits[2]);  // 最后一个（索引 2）：cherry
    }
}

/* 控制台输出：
apple
cherry

解析：fruits 共 3 个元素，索引 0~2。
      fruits[0] 是 "apple"，fruits[2] 是 "cherry"。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：观察动态初始化的默认值"
      code={`// 要求：
// 用动态初始化创建 boolean 数组 flags，长度为 3，不手动赋任何值。
// 打印全部 3 个元素，观察默认值是什么。
// 再把 flags[1] 改为 true，重新打印 flags[1]。

public class Exercise03 {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {
    public static void main(String[] args) {
        boolean[] flags = new boolean[3];  // 动态初始化，不赋值

        System.out.println(flags[0]);  // false（默认值）
        System.out.println(flags[1]);  // false（默认值）
        System.out.println(flags[2]);  // false（默认值）

        flags[1] = true;               // 修改索引 1 的元素
        System.out.println(flags[1]);  // true
    }
}

/* 控制台输出：
false
false
false
true

解析：boolean 类型默认值为 false，三个元素初始全为 false。
      flags[1] = true 后再打印，输出 true。
*/`}
    />
  </article>
);

export default index;
