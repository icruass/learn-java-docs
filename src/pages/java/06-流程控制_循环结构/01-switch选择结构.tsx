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
    <Title>switch 选择结构</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        当需要对同一个变量或表达式的<Text bold>多个固定值</Text>分别处理时，
        与其写一大串 <InlineCode>else if</InlineCode>，不如用
        <InlineCode>switch</InlineCode>——结构更清晰、可读性更强。
        本节讲清 <InlineCode>switch</InlineCode> 的完整语法、支持的数据类型，
        以及最重要的难点：<Text bold>case 穿透（fall-through）</Text>。
      </Paragraph>
    </Callout>

    <Heading3>1. 语法结构</Heading3>
    <CodeBlock
      title="switch 完整语法"
      code={`switch (表达式) {
    case 值1:
        // 表达式 == 值1 时执行
        break;          // 跳出 switch，不再往下执行
    case 值2:
        // 表达式 == 值2 时执行
        break;
    case 值3:
        // 表达式 == 值3 时执行
        break;
    default:
        // 以上 case 都不匹配时执行（可省略）
        break;
}`}
    />
    <Paragraph>
      执行流程：先计算 <InlineCode>switch</InlineCode> 括号里<Text bold>表达式的值</Text>，
      然后从上往下逐一与每个 <InlineCode>case</InlineCode> 的值比较；
      找到第一个相等的 <InlineCode>case</InlineCode> 后，<Text bold>从那里开始执行</Text>，
      遇到 <InlineCode>break</InlineCode> 才跳出整个 <InlineCode>switch</InlineCode>。
      如果没有任何 <InlineCode>case</InlineCode> 匹配，则执行 <InlineCode>default</InlineCode> 分支。
    </Paragraph>

    <Heading3>2. 支持的数据类型</Heading3>
    <Table
      head={['类型', '是否支持', '说明']}
      rows={[
        [<InlineCode>byte / short / int / char</InlineCode>, '支持', '最基本的整数类型和字符类型'],
        [<InlineCode>String</InlineCode>, '支持（Java 7+）', '比较字符串内容，底层用 equals'],
        ['枚举（enum）', '支持', '常用于状态、方向等有限值集合'],
        [<InlineCode>long</InlineCode>, '不支持', '范围过大，switch 不接受'],
        [<InlineCode>float / double</InlineCode>, '不支持', '浮点数无法精确比较，设计上排除'],
        [<InlineCode>boolean</InlineCode>, '不支持', '只有 true/false，用 if 即可'],
      ]}
    />
    <Callout type="warning" title="case 后的值必须是常量且不重复">
      <UnorderedList>
        <ListItem>
          <InlineCode>case</InlineCode> 后面只能写<Text bold>编译期常量</Text>（字面量或
          <InlineCode>final</InlineCode> 常量），不能写变量，也不能写范围（如
          <InlineCode>case x &gt; 10:</InlineCode> 是非法的）。
        </ListItem>
        <ListItem>
          同一个 <InlineCode>switch</InlineCode> 里，每个 <InlineCode>case</InlineCode>
          的值<Text bold>不能重复</Text>，否则编译报错。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>3. 重点难点：case 穿透（fall-through）</Heading3>
    <Paragraph>
      这是 <InlineCode>switch</InlineCode> 里<Text bold>最容易出 bug 的地方</Text>。
      如果某个 <InlineCode>case</InlineCode> 执行完后<Text bold>没有 <InlineCode>break</InlineCode></Text>，
      程序<Text bold>不会停下来，而是继续执行下一个 <InlineCode>case</InlineCode> 的代码</Text>，
      直到遇到 <InlineCode>break</InlineCode> 或 <InlineCode>switch</InlineCode> 结束为止。
      这种现象叫做 <Text accent>fall-through（穿透/贯穿）</Text>。
    </Paragraph>

    <Heading4>穿透示例：漏写 break</Heading4>
    <Paragraph>
      下面的例子中，<InlineCode>case 2</InlineCode> 没有 <InlineCode>break</InlineCode>，
      会发生什么？请先自己预测，再看输出：
    </Paragraph>
    <CodeBlock
      title="FallThroughDemo.java（漏写 break）"
      code={`public class FallThroughDemo {
    public static void main(String[] args) {
        int day = 2;

        switch (day) {
            case 1:
                System.out.println("星期一");
                break;
            case 2:
                System.out.println("星期二");
                // 没有 break！
            case 3:
                System.out.println("星期三");
                // 没有 break！
            case 4:
                System.out.println("星期四");
                break;
            default:
                System.out.println("其他");
                break;
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（day = 2，注意输出了三行！）" code={`星期二
星期三
星期四`} />
    <Paragraph>
      <Text bold>原因分析</Text>：<InlineCode>day = 2</InlineCode>，匹配 <InlineCode>case 2</InlineCode>，
      打印"星期二"。但 <InlineCode>case 2</InlineCode> 没有 <InlineCode>break</InlineCode>，
      程序<Text bold>穿透到 <InlineCode>case 3</InlineCode></Text>，打印"星期三"，
      <InlineCode>case 3</InlineCode> 也没有 <InlineCode>break</InlineCode>，继续穿透到
      <InlineCode>case 4</InlineCode>，打印"星期四"，遇到 <InlineCode>break</InlineCode> 才跳出。
    </Paragraph>
    <Callout type="danger" title="穿透是 bug 的重灾区">
      漏写 <InlineCode>break</InlineCode> 是 <InlineCode>switch</InlineCode>
      中最典型的错误。每写完一个 <InlineCode>case</InlineCode> 就立刻问自己：
      <Text bold>"这里需要 break 吗？"</Text>。如果没有特意设计穿透，就加上 <InlineCode>break</InlineCode>。
    </Callout>

    <Heading4>加上 break 的正确版本</Heading4>
    <CodeBlock
      title="FallThroughFixed.java（正确版）"
      code={`public class FallThroughFixed {
    public static void main(String[] args) {
        int day = 2;

        switch (day) {
            case 1:
                System.out.println("星期一");
                break;
            case 2:
                System.out.println("星期二");
                break;  // 加上 break，执行完立即跳出
            case 3:
                System.out.println("星期三");
                break;
            case 4:
                System.out.println("星期四");
                break;
            default:
                System.out.println("其他");
                break;
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（修复后）" code={`星期二`} />

    <Heading4>有时穿透是"故意的"</Heading4>
    <Paragraph>
      穿透并非只有坏处。当多个 <InlineCode>case</InlineCode> 需要执行<Text bold>完全相同的逻辑</Text>时，
      可以故意利用穿透把它们叠在一起，减少重复代码：
    </Paragraph>
    <CodeBlock
      title="穿透的合理利用：节假日判断"
      code={`public class Holiday {
    public static void main(String[] args) {
        int day = 6;  // 6 = 星期六

        switch (day) {
            case 6:  // 星期六和星期日共用同一段逻辑
            case 7:
                System.out.println("周末，可以休息！");
                break;
            default:
                System.out.println("工作日，努力搬砖！");
                break;
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（day = 6）" code={`周末，可以休息！`} />

    <Heading3>4. default 的位置与作用</Heading3>
    <Paragraph>
      <InlineCode>default</InlineCode> 是"所有 <InlineCode>case</InlineCode> 都不匹配时的兜底"，
      类似于 <InlineCode>if-else if-else</InlineCode> 里最后的 <InlineCode>else</InlineCode>。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>可以省略</Text>：不写 <InlineCode>default</InlineCode> 时，若所有
        <InlineCode>case</InlineCode> 都不匹配，<InlineCode>switch</InlineCode> 直接结束，什么也不做。
      </ListItem>
      <ListItem>
        <Text bold>位置任意</Text>：<InlineCode>default</InlineCode> 可以写在最前面、中间或最后，
        但<Text bold>习惯上写在最后</Text>，便于阅读。
      </ListItem>
      <ListItem>
        无论 <InlineCode>default</InlineCode> 写在哪里，都是"兜底"逻辑，
        只有所有 <InlineCode>case</InlineCode> 都不匹配时才进入。
      </ListItem>
    </UnorderedList>

    <Heading3>5. 新式 switch（JDK 14+ 箭头语法，了解即可）</Heading3>
    <Paragraph>
      JDK 14 引入了<Text bold>箭头 switch（Switch Expressions）</Text>。
      用 <InlineCode>-&gt;</InlineCode> 代替冒号，每个分支<Text bold>天然不穿透</Text>，
      不需要写 <InlineCode>break</InlineCode>，代码更简洁。如果只是入门阶段，了解有这个语法即可，
      传统写法在所有版本都适用。
    </Paragraph>
    <CodeBlock
      title="新式 switch（JDK 14+，仅作了解）"
      code={`int day = 3;
// 箭头 switch，每个分支不穿透，无需 break
switch (day) {
    case 1 -> System.out.println("星期一");
    case 2 -> System.out.println("星期二");
    case 3 -> System.out.println("星期三");
    case 4 -> System.out.println("星期四");
    case 5 -> System.out.println("星期五");
    default -> System.out.println("周末");
}`}
    />
    <CodeBlock language="text" title="控制台输出（day = 3）" code={`星期三`} />

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己独立完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>
    <CodeBlock
      qa
      title="练习 1：根据数字输出星期几"
      code={`// 要求：给定 day = 4，用 switch 输出对应的星期名称。
// 1 → 星期一，2 → 星期二，……，7 → 星期日
// 其他数值 → 输出 "输入错误，请输入 1-7"

public class WeekDay {
    public static void main(String[] args) {
        int day = 4;

        // 请补全 switch 代码
    }
}`}
      answerCode={`public class WeekDay {
    public static void main(String[] args) {
        int day = 4;

        switch (day) {
            case 1:
                System.out.println("星期一");
                break;
            case 2:
                System.out.println("星期二");
                break;
            case 3:
                System.out.println("星期三");
                break;
            case 4:
                System.out.println("星期四");
                break;
            case 5:
                System.out.println("星期五");
                break;
            case 6:
                System.out.println("星期六");
                break;
            case 7:
                System.out.println("星期日");
                break;
            default:
                System.out.println("输入错误，请输入 1-7");
                break;
        }
    }
}

/* 控制台输出（day = 4）：
星期四
*/`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：预测含穿透的输出"
      code={`问：下面代码的控制台输出是什么？请逐步分析。

public class Predict {
    public static void main(String[] args) {
        int n = 2;
        switch (n) {
            case 1:
                System.out.println("A");
                break;
            case 2:
                System.out.println("B");
            case 3:
                System.out.println("C");
                break;
            case 4:
                System.out.println("D");
                break;
            default:
                System.out.println("E");
        }
    }
}`}
      answerCode={`输出：
B
C

逐步分析：
  1. n = 2，匹配 case 2，执行：System.out.println("B")，打印 B。
  2. case 2 没有 break，发生穿透，继续执行 case 3。
  3. 执行：System.out.println("C")，打印 C。
  4. case 3 有 break，跳出 switch，结束。
  5. case 4 和 default 均不执行。

关键：穿透只看"有没有 break"，不再重新比较 case 值。
进入 case 3 是因为穿透，而不是因为 n == 3。`}
    />
  </article>
);

export default index;
