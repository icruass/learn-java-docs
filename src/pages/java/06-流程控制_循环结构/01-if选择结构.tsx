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
    <Title>if 选择结构</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        顺序结构让程序"一条路走到底"，但现实中往往需要<Text bold>根据条件决定走哪条路</Text>。
        <InlineCode>if</InlineCode> 语句就是 Java 里最基本的选择（分支）结构，它让程序能够
        "判断 → 选择 → 执行"。本节讲清三种形式的语法、条件表达式的要求，以及三个新手必知的常见坑。
      </Paragraph>
    </Callout>

    <Heading3>1. if 的三种形式</Heading3>

    <Heading4>① 单分支 if</Heading4>
    <Paragraph>
      只有"满足条件才执行"，不满足则直接跳过。
    </Paragraph>
    <CodeBlock
      title="语法：单分支 if"
      code={`if (条件表达式) {
    // 条件为 true 时执行的语句
}`}
    />

    <Heading4>② 双分支 if-else</Heading4>
    <Paragraph>
      条件满足走一条路，不满足走另一条路，两条路<Text bold>必走其一</Text>。
    </Paragraph>
    <CodeBlock
      title="语法：双分支 if-else"
      code={`if (条件表达式) {
    // 条件为 true 时执行
} else {
    // 条件为 false 时执行
}`}
    />

    <Heading4>③ 多分支 if-else if-else</Heading4>
    <Paragraph>
      多个条件依次判断，<Text bold>第一个满足的分支执行后，后续分支全部跳过</Text>。
      最后的 <InlineCode>else</InlineCode> 是兜底分支，可以省略。
    </Paragraph>
    <CodeBlock
      title="语法：多分支 if-else if-else"
      code={`if (条件1) {
    // 条件1 为 true 时执行
} else if (条件2) {
    // 条件1 为 false 且条件2 为 true 时执行
} else if (条件3) {
    // 条件1、2 均为 false 且条件3 为 true 时执行
} else {
    // 以上条件全部为 false 时执行（兜底）
}`}
    />

    <Heading3>2. 条件表达式的要求</Heading3>
    <Paragraph>
      <InlineCode>if</InlineCode> 后括号里的<Text bold>条件表达式必须是 boolean 类型</Text>，
      即结果只能是 <InlineCode>true</InlineCode> 或 <InlineCode>false</InlineCode>。
      Java 不像 C/C++ 允许用整数或对象代替布尔值——在 Java 里，
      <InlineCode>if (1)</InlineCode> 或 <InlineCode>if (0)</InlineCode> 直接编译报错。
    </Paragraph>
    <Table
      head={['常用条件写法', '含义']}
      rows={[
        [<InlineCode>a &gt; b</InlineCode>, 'a 大于 b'],
        [<InlineCode>a &gt;= b</InlineCode>, 'a 大于等于 b'],
        [<InlineCode>a == b</InlineCode>, 'a 等于 b（注意是两个等号）'],
        [<InlineCode>a != b</InlineCode>, 'a 不等于 b'],
        [<InlineCode>a &gt; 0 &amp;&amp; b &gt; 0</InlineCode>, 'a 和 b 同时大于 0（逻辑与）'],
        [<InlineCode>a &gt; 0 || b &gt; 0</InlineCode>, 'a 或 b 至少一个大于 0（逻辑或）'],
        [<InlineCode>!flag</InlineCode>, '对 flag 取反'],
      ]}
    />

    <Heading3>3. 三个常见坑</Heading3>
    <Callout type="danger" title="坑 1：if 后面误加分号（变成空语句）">
      <Paragraph>
        在 <InlineCode>if (条件)</InlineCode> 后面直接加了一个 <InlineCode>;</InlineCode>，
        这个分号会被当作 <InlineCode>if</InlineCode> 控制的"空语句"——即条件成立时什么也不做。
        而后面大括号里的代码<Text bold>永远都会执行</Text>，完全变成了顺序结构，与条件无关。
      </Paragraph>
      <CodeBlock
        title="错误示范：if 后误加分号"
        code={`int score = 30;
if (score >= 60);   // ← 这个分号就是 if 的"执行体"，是个空操作
{
    // 这里不属于 if 了！无论 score 是多少都会执行
    System.out.println("及格了");   // 会被错误地打印出来
}`}
      />
    </Callout>
    <Callout type="danger" title="坑 2：省略大括号时 if 只控制紧跟的第一条语句">
      <Paragraph>
        如果不写大括号，<InlineCode>if</InlineCode> 只管它后面<Text bold>紧跟的第一条语句</Text>，
        第二条开始就不受控制了，永远执行。
      </Paragraph>
      <CodeBlock
        title="容易误解的省略大括号写法"
        code={`int score = 30;
if (score >= 60)
    System.out.println("及格");   // 只有这一行受 if 控制
    System.out.println("继续加油"); // 这行永远执行！和 if 无关

// 建议：养成写大括号的习惯，可以避免此类 bug`}
      />
    </Callout>
    <Callout type="danger" title="坑 3：把 == 写成 =">
      <Paragraph>
        <InlineCode>==</InlineCode> 是<Text bold>比较运算符</Text>（判断是否相等），
        <InlineCode>=</InlineCode> 是<Text bold>赋值运算符</Text>。
        在 <InlineCode>if</InlineCode> 条件里把 <InlineCode>==</InlineCode> 写成
        <InlineCode>=</InlineCode> 会直接编译报错（因为赋值表达式的结果是整数，不是 boolean），
        反而是 Java 给了你保护；但在比较对象时用 <InlineCode>==</InlineCode> 比较的是引用而非内容，
        这个坑后面讲字符串时会专门说。
      </Paragraph>
    </Callout>

    <Heading3>4. 示例：根据分数判断等级</Heading3>
    <Paragraph>
      用多分支 <InlineCode>if-else if-else</InlineCode> 根据成绩输出等级：
      90 分及以上为优秀，80 分及以上为良好，70 分及以上为中等，60 分及以上为及格，60 分以下为不及格。
    </Paragraph>
    <CodeBlock
      title="GradeDemo.java"
      code={`public class GradeDemo {
    public static void main(String[] args) {
        int score = 85;

        if (score >= 90) {
            System.out.println("等级：优秀");
        } else if (score >= 80) {
            System.out.println("等级：良好");
        } else if (score >= 70) {
            System.out.println("等级：中等");
        } else if (score >= 60) {
            System.out.println("等级：及格");
        } else {
            System.out.println("等级：不及格");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（score = 85）" code={`等级：良好`} />
    <Paragraph>
      为什么 score = 85 走的是第二个分支（而不是第一个）？因为第一个条件
      <InlineCode>score &gt;= 90</InlineCode> 不满足，程序才继续判断
      <InlineCode>score &gt;= 80</InlineCode>，85 满足，输出"良好"，
      后续所有 <InlineCode>else if</InlineCode> 和 <InlineCode>else</InlineCode> 全部跳过。
    </Paragraph>

    <Heading3>5. 示例：判断奇偶</Heading3>
    <Paragraph>
      用双分支 <InlineCode>if-else</InlineCode> 判断一个整数是奇数还是偶数：
    </Paragraph>
    <CodeBlock
      title="OddEvenDemo.java"
      code={`public class OddEvenDemo {
    public static void main(String[] args) {
        int num = 7;

        if (num % 2 == 0) {
            System.out.println(num + " 是偶数");
        } else {
            System.out.println(num + " 是奇数");
        }
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（num = 7）" code={`7 是奇数`} />
    <Paragraph>
      <InlineCode>num % 2</InlineCode> 是取余运算：7 除以 2 余 1，不等于 0，
      所以 <InlineCode>num % 2 == 0</InlineCode> 为 <InlineCode>false</InlineCode>，
      走 <InlineCode>else</InlineCode> 分支，输出"奇数"。
    </Paragraph>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己独立完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>
    <CodeBlock
      qa
      title="练习 1：判断闰年"
      code={`// 要求：给定 year = 2024，判断是否为闰年并打印结果。
// 闰年的条件：能被 4 整除且不能被 100 整除，或者能被 400 整除。

public class LeapYear {
    public static void main(String[] args) {
        int year = 2024;

        // 请在这里补全 if 判断代码，输出 "xxxx年是闰年" 或 "xxxx年不是闰年"
    }
}`}
      answerCode={`public class LeapYear {
    public static void main(String[] args) {
        int year = 2024;

        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            System.out.println(year + "年是闰年");
        } else {
            System.out.println(year + "年不是闰年");
        }
    }
}

/* 控制台输出：
2024年是闰年

说明：2024 % 4 == 0（满足）且 2024 % 100 != 0（满足），
所以整个条件为 true，输出"是闰年"。
*/`}
    />
    <CodeBlock
      qa
      title="练习 2：求三个数中的最大值"
      code={`// 要求：已知 a=15, b=28, c=7，用 if-else if-else 找出最大值并打印。

public class MaxOfThree {
    public static void main(String[] args) {
        int a = 15;
        int b = 28;
        int c = 7;

        // 请补全代码，输出 "最大值是：xx"
    }
}`}
      answerCode={`public class MaxOfThree {
    public static void main(String[] args) {
        int a = 15;
        int b = 28;
        int c = 7;

        int max;
        if (a >= b && a >= c) {
            max = a;
        } else if (b >= a && b >= c) {
            max = b;
        } else {
            max = c;
        }

        System.out.println("最大值是：" + max);
    }
}

/* 控制台输出：
最大值是：28

说明：15 >= 28 不成立，跳过第一分支；
28 >= 15 且 28 >= 7 成立，走第二分支，max = 28。
*/`}
    />
    <CodeBlock
      qa
      title="练习 3：根据分数输出等级（含边界）"
      code={`// 要求：score = 72，用 if-else if-else 输出等级。
// 规则：>= 90 → 优秀；>= 80 → 良好；>= 70 → 中等；>= 60 → 及格；< 60 → 不及格
// 同时，如果 score < 0 或 score > 100，输出 "分数无效"。

public class GradeCheck {
    public static void main(String[] args) {
        int score = 72;

        // 请补全代码
    }
}`}
      answerCode={`public class GradeCheck {
    public static void main(String[] args) {
        int score = 72;

        if (score < 0 || score > 100) {
            System.out.println("分数无效");
        } else if (score >= 90) {
            System.out.println("等级：优秀");
        } else if (score >= 80) {
            System.out.println("等级：良好");
        } else if (score >= 70) {
            System.out.println("等级：中等");
        } else if (score >= 60) {
            System.out.println("等级：及格");
        } else {
            System.out.println("等级：不及格");
        }
    }
}

/* 控制台输出（score = 72）：
等级：中等

要点：先检查非法输入（< 0 或 > 100），再从高到低判断等级。
多分支 if-else if 的条件是"互斥"的：第一个满足就执行，后续全跳过。
*/`}
    />
  </article>
);

export default index;
