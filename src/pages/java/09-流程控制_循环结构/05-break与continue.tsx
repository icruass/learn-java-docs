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
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>break 与 continue</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        循环执行过程中，有时需要提前终止或跳过某次迭代——这就是
        <Text bold>break</Text> 和 <Text bold>continue</Text> 的用途。
        本节讲清两者的含义、执行效果、作用范围，并通过精确的代码示例和输出演示，
        最后介绍进阶的标签写法，以及 continue 在 while 中的一个常见陷阱。
      </Paragraph>
    </Callout>

    <Heading3>1. break 与 continue 概览</Heading3>
    <Table
      head={['关键字', '作用', '执行后跳到哪里']}
      rows={[
        [
          <InlineCode>break</InlineCode>,
          '立即终止整个循环（或 switch），循环不再继续',
          '循环结构之后的第一条语句',
        ],
        [
          <InlineCode>continue</InlineCode>,
          '跳过本次循环体中剩余的语句，直接进入下一次循环',
          'for：执行迭代语句再判断条件；while/do-while：直接判断条件',
        ],
      ]}
    />
    <Callout type="warning" title="只作用于最近的一层循环">
      break 和 continue <Text bold>只影响它们所在的那一层循环</Text>，
      在嵌套循环中，它们不会自动跳出外层循环（需要标签才能做到，见第 4 节）。
    </Callout>

    <Heading3>2. break 示例：遇到 5 就停止</Heading3>
    <Paragraph>
      在循环 1~10 中，遇到数字 5 时立即终止循环：
    </Paragraph>
    <CodeBlock
      title="BreakDemo.java"
      code={`public class BreakDemo {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            if (i == 5) {
                System.out.println("遇到 5，break 退出循环");
                break;   // 立即终止 for 循环
            }
            System.out.println("i = " + i);
        }
        System.out.println("循环已结束");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`i = 1
i = 2
i = 3
i = 4
遇到 5，break 退出循环
循环已结束`}
    />
    <Paragraph>
      注意：打印了 1、2、3、4 之后，<InlineCode>i = 5</InlineCode> 时触发 break，
      "i = 5"这行<Text bold>没有</Text>被打印（break 语句在 println 之前），
      循环直接终止，跳到循环后的语句继续执行。
    </Paragraph>

    <Heading3>3. continue 示例：跳过偶数，只打印奇数</Heading3>
    <Paragraph>
      在循环 1~9 中，遇到偶数时跳过本次迭代，只打印奇数：
    </Paragraph>
    <CodeBlock
      title="ContinueDemo.java"
      code={`public class ContinueDemo {
    public static void main(String[] args) {
        for (int i = 1; i <= 9; i++) {
            if (i % 2 == 0) {
                continue;   // 偶数跳过，直接执行 i++，进入下一次判断
            }
            System.out.println("奇数：" + i);
        }
        System.out.println("循环结束");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`奇数：1
奇数：3
奇数：5
奇数：7
奇数：9
循环结束`}
    />
    <Paragraph>
      每当 i 是偶数（2、4、6、8）时，<InlineCode>continue</InlineCode> 让程序跳过
      <InlineCode>System.out.println</InlineCode>，直接执行 <InlineCode>i++</InlineCode>（for 的迭代语句），
      然后重新判断条件。奇数正常执行打印。
    </Paragraph>

    <Heading3>4. 进阶：带标签的 break / continue（跳出多层循环）</Heading3>
    <Paragraph>
      普通的 break/continue 只能影响最近的一层循环。如果需要从嵌套循环中一次性跳出外层，
      可以使用<Text bold>标签（label）</Text>：
    </Paragraph>
    <CodeBlock
      title="LabelBreakDemo.java"
      code={`public class LabelBreakDemo {
    public static void main(String[] args) {
        outer:                          // 标签：给外层循环命名
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (i == 2 && j == 2) {
                    System.out.println("break outer：i=" + i + ", j=" + j);
                    break outer;        // 直接跳出外层循环
                }
                System.out.println("i=" + i + ", j=" + j);
            }
        }
        System.out.println("循环结束");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`i=1, j=1
i=1, j=2
i=1, j=3
i=2, j=1
break outer：i=2, j=2
循环结束`}
    />
    <Callout type="tip" title="标签在实际开发中不常用">
      带标签的 break/continue 虽然功能强大，但会让代码逻辑变得复杂、难以维护。
      实际开发中更常见的做法是把内层循环提取成一个方法，再用 <InlineCode>return</InlineCode> 退出。
      了解标签的存在即可，不需要频繁使用。
    </Callout>

    <Heading3>5. 注意点：continue 在 while 中容易造成死循环</Heading3>
    <Callout type="danger" title="while + continue：迭代语句必须在 continue 之前">
      <Paragraph>
        在 for 循环里，<InlineCode>continue</InlineCode> 跳过循环体剩余语句后，
        会自动执行 for 括号内的迭代语句（如 <InlineCode>i++</InlineCode>），所以没问题。
      </Paragraph>
      <Paragraph>
        但在 while 循环里，迭代语句是手动写在循环体内的——如果迭代语句写在
        <InlineCode>continue</InlineCode> 之后，<InlineCode>continue</InlineCode> 会跳过它，
        导致循环变量永不更新，产生<Text bold>死循环</Text>！
      </Paragraph>
      <CodeBlock
        title="死循环示范（continue 跳过了 i++）"
        code={`int i = 1;
while (i <= 10) {
    if (i % 2 == 0) {
        continue;   // i 是偶数时 continue，但 i++ 在下面，被跳过了！
    }
    System.out.println(i);
    i++;            // 只有奇数才能执行到这里，i=2 时永远 continue
}`}
      />
      <CodeBlock
        title="正确写法（迭代语句在 continue 之前）"
        code={`int i = 1;
while (i <= 10) {
    i++;              // 先更新 i，再判断是否 continue
    if (i % 2 == 0) {
        continue;     // 现在 continue 不会跳过 i++ 了
    }
    System.out.println(i - 1);  // 注意补偿 i 已提前加 1
}`}
      />
      <Paragraph>
        更推荐的写法是直接调整条件逻辑，避免在 while 中用 continue，或者改用 for 循环。
      </Paragraph>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：预测含 break/continue 的输出"
      code={`问：下面代码的控制台输出是什么？

for (int i = 1; i <= 6; i++) {
    if (i == 3) continue;
    if (i == 5) break;
    System.out.println(i);
}`}
      answerCode={`输出：
1
2
4

逐步分析：
  i=1：不触发任何条件，打印 1
  i=2：不触发任何条件，打印 2
  i=3：触发 continue，跳过 println，直接 i++，去下一轮
  i=4：不触发任何条件，打印 4
  i=5：触发 break，立即退出循环，5 和 6 都不打印

关键：continue 让 3 被跳过；break 让 5（及之后）不被打印。`}
    />

    <CodeBlock
      qa
      title="练习 2：用 break 找第一个满足条件的数"
      code={`// 要求：在 1~100 中，找到第一个满足"既能被 3 整除又能被 7 整除"的数，
// 输出该数后立即停止（不需要找全部，只找第一个）。

public class FindFirst {
    public static void main(String[] args) {
        // 请在这里补全代码
    }
}`}
      answerCode={`public class FindFirst {
    public static void main(String[] args) {
        for (int i = 1; i <= 100; i++) {
            if (i % 3 == 0 && i % 7 == 0) {
                System.out.println("第一个同时被 3 和 7 整除的数：" + i);
                break;   // 找到第一个就停止，不继续遍历
            }
        }
    }
}

/* 控制台输出：
第一个同时被 3 和 7 整除的数：21

解析：21 = 3×7，是 1~100 中第一个同时满足条件的数。
      break 保证找到后立即退出，不会继续遍历后面的 42、63、84 等。
*/`}
    />
  </article>
);

export default index;
