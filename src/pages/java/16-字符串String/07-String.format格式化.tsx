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
    <Title>String.format 格式化</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        当我们需要把数字、文本按特定格式（保留两位小数、补零对齐、百分比、千分位等）拼成字符串时，
        用 <InlineCode>+</InlineCode> 手动拼会很笨拙。Java 提供了
        <InlineCode>String.format</InlineCode> 和 <InlineCode>System.out.printf</InlineCode>，
        通过<Text bold>占位符（格式说明符）</Text>一次性完成格式化。本节系统讲解常用占位符
        <InlineCode>%d %s %f %.2f %05d %,d</InlineCode> 等的含义与用法。
      </Paragraph>
    </Callout>

    <Heading3>1. 基本用法</Heading3>
    <Paragraph>
      <InlineCode>String.format(模板, 参数...)</InlineCode> 返回格式化后的字符串；
      <InlineCode>System.out.printf</InlineCode> 直接打印（不换行，需要自己加 <InlineCode>%n</InlineCode> 或 <InlineCode>\\n</InlineCode>）。
      模板里的 <InlineCode>%</InlineCode> 开头的就是占位符，按顺序被后面的参数替换：
    </Paragraph>
    <CodeBlock
      title="FormatBasic.java"
      code={`public class FormatBasic {
    public static void main(String[] args) {
        String name = "张三";
        int age = 20;

        // format 返回字符串
        String s = String.format("姓名：%s，年龄：%d", name, age);
        System.out.println(s);

        // printf 直接打印；%n 是跨平台换行
        System.out.printf("姓名：%s，年龄：%d%n", name, age);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`姓名：张三，年龄：20
姓名：张三，年龄：20`}
    />

    <Heading3>2. 常用占位符一览</Heading3>
    <Table
      head={['占位符', '含义', '示例参数', '输出']}
      rows={[
        ['%s', '字符串（任意对象，调 toString）', '"abc"', 'abc'],
        ['%d', '十进制整数', '255', '255'],
        ['%f', '浮点数（默认 6 位小数）', '3.14', '3.140000'],
        ['%.2f', '浮点数，保留 2 位小数（四舍五入）', '3.14159', '3.14'],
        ['%b', '布尔值', 'true', 'true'],
        ['%c', '字符', "'A'", 'A'],
        ['%x / %X', '十六进制（小写 / 大写）', '255', 'ff / FF'],
        ['%o', '八进制', '8', '10'],
        ['%e', '科学计数法', '12345.6', '1.234560e+04'],
        ['%%', '输出一个百分号 %', '—', '%'],
        ['%n', '换行（跨平台）', '—', '换行'],
      ]}
    />
    <Callout type="warning" title="占位符类型要和参数匹配">
      用 <InlineCode>%d</InlineCode> 去格式化一个 <InlineCode>double</InlineCode>，或用 <InlineCode>%f</InlineCode>
      去格式化 <InlineCode>int</InlineCode>，都会抛 <InlineCode>IllegalFormatConversionException</InlineCode>。
      记住：整数 <InlineCode>%d</InlineCode>、小数 <InlineCode>%f</InlineCode>、文本 <InlineCode>%s</InlineCode>。
    </Callout>

    <Heading3>3. 宽度、对齐与补零</Heading3>
    <Paragraph>
      在 <InlineCode>%</InlineCode> 和类型字母之间可以加「修饰符」控制宽度和填充，常用于<Text bold>表格对齐、编号补零</Text>：
    </Paragraph>
    <Table
      head={['写法', '含义']}
      rows={[
        ['%5d', '至少占 5 个字符宽，右对齐，左边补空格'],
        ['%-5d', '至少占 5 宽，左对齐（- 表示左对齐）'],
        ['%05d', '至少占 5 宽，左边补 0（编号常用）'],
        ['%,d', '整数加千分位分隔符（如 1,000,000）'],
        ['%10.2f', '总宽 10，保留 2 位小数，右对齐'],
        ['%+d', '正数也显示 + 号'],
      ]}
    />
    <CodeBlock
      title="FormatWidth.java"
      code={`public class FormatWidth {
    public static void main(String[] args) {
        // 补零：订单号常用
        System.out.println(String.format("订单号：%05d", 42));     // 00042

        // 右对齐 / 左对齐（| 用来看清边界）
        System.out.printf("|%5d|%n", 7);     // 右对齐
        System.out.printf("|%-5d|%n", 7);    // 左对齐

        // 千分位
        System.out.println(String.format("金额：%,d 元", 1234567)); // 1,234,567

        // 保留两位小数 + 宽度
        System.out.printf("单价：%8.2f%n", 3.14159);

        // 百分号本身要写 %%
        System.out.println(String.format("完成度：%d%%", 85));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`订单号：00042
|    7|
|7    |
金额：1,234,567 元
单价：    3.14
完成度：85%`}
    />

    <Heading3>4. 保留小数的常见用途</Heading3>
    <Paragraph>
      <InlineCode>%.2f</InlineCode> 是最高频的用法之一——金额、成绩、百分比都要控制小数位。
      注意它会<Text bold>四舍五入</Text>：
    </Paragraph>
    <CodeBlock
      title="FormatDecimal.java"
      code={`public class FormatDecimal {
    public static void main(String[] args) {
        double price = 19.9;
        double rate = 0.8567;

        System.out.println(String.format("价格：%.2f", price));      // 补足两位
        System.out.println(String.format("四舍五入：%.2f", 3.14159)); // 3.14
        System.out.println(String.format("进位：%.2f", 2.675));       // 注意浮点精度
        System.out.println(String.format("百分比：%.1f%%", rate * 100)); // 85.7%
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`价格：19.90
四舍五入：3.14
进位：2.67
百分比：85.7%`}
    />
    <Callout type="warning" title="浮点精度的小坑">
      上面 <InlineCode>2.675</InlineCode> 保留两位得到的是 <InlineCode>2.67</InlineCode> 而非预期的 2.68，
      因为 <InlineCode>2.675</InlineCode> 在二进制浮点里实际略小于 2.675。
      涉及<Text bold>金额等精确计算</Text>时，应使用 <InlineCode>BigDecimal</InlineCode>，
      而不是 <InlineCode>double</InlineCode> + format。
    </Callout>

    <Heading3>5. 参数索引：重复使用同一参数</Heading3>
    <Paragraph>
      用 <InlineCode>%1$s</InlineCode> 这样的「位置索引」可以指定用第几个参数，便于重复引用：
    </Paragraph>
    <CodeBlock
      title="FormatIndex.java"
      code={`public class FormatIndex {
    public static void main(String[] args) {
        // %1$s 表示第1个参数，%2$s 表示第2个
        String s = String.format("%1$s 喜欢 %2$s，%2$s 也喜欢 %1$s", "猫", "鱼");
        System.out.println(s);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`猫 喜欢 鱼，鱼 也喜欢 猫`}
    />

    <Heading3>6. 综合示例：打印一张对齐的成绩表</Heading3>
    <CodeBlock
      title="ScoreTable.java"
      code={`public class ScoreTable {
    public static void main(String[] args) {
        String[] names = {"张三", "李四", "王五"};
        int[] ids = {1, 23, 105};
        double[] scores = {95.5, 88.25, 76.8};

        // 表头：%-6s 左对齐占6，%6s 右对齐占6
        System.out.printf("%-6s%8s%10s%n", "姓名", "学号", "成绩");
        for (int i = 0; i < names.length; i++) {
            // 学号补零到3位，成绩保留1位小数
            System.out.printf("%-6s%8s%10.1f%n",
                    names[i], String.format("%03d", ids[i]), scores[i]);
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`姓名      学号        成绩
张三       001      95.5
李四       023      88.3
王五       105      76.8`}
    />

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>String.format</InlineCode> 返回字符串，<InlineCode>printf</InlineCode> 直接打印（需手动换行 <InlineCode>%n</InlineCode>）。</ListItem>
        <ListItem>核心占位符：<InlineCode>%s</InlineCode> 文本、<InlineCode>%d</InlineCode> 整数、<InlineCode>%f</InlineCode> 小数、<InlineCode>%.2f</InlineCode> 保留两位。</ListItem>
        <ListItem>修饰符：<InlineCode>%05d</InlineCode> 补零、<InlineCode>%-5d</InlineCode> 左对齐、<InlineCode>%,d</InlineCode> 千分位、<InlineCode>%%</InlineCode> 百分号。</ListItem>
        <ListItem>占位符类型必须与参数匹配，否则抛 <InlineCode>IllegalFormatConversionException</InlineCode>。</ListItem>
        <ListItem>精确金额计算请用 <InlineCode>BigDecimal</InlineCode>，别依赖 <InlineCode>double</InlineCode> + <InlineCode>%.2f</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测输出"
      code={`System.out.println(String.format("%05d", 88));
System.out.println(String.format("%.2f", 1.005 * 100 / 100)); // 关注 1.0 的显示
System.out.println(String.format("%,d", 1000000));
System.out.println(String.format("%-4d|", 5));
System.out.println(String.format("%d%%", 50));

问：以上 5 行分别输出什么？`}
      answerCode={`答案：
00088       —— 补零到 5 位
1.00        —— 1.005*100/100=1.0，保留两位补零为 1.00
1,000,000   —— 千分位分隔
5   |       —— 左对齐占4位，右侧补3个空格再接 |
50%         —— %% 转义为一个百分号

解析：%05d 左补零；%-4d 左对齐补空格；%,d 千分位；%% 输出百分号。
      这些都是日常格式化输出（编号、金额、进度）的高频组合。`}
    />

    <CodeBlock
      qa
      title="练习2：格式化金额与折扣"
      code={`// 商品原价 299.0 元，打 8.5 折。
// 用 String.format 输出：
//   原价：¥299.00
//   折扣：85.0%
//   现价：¥254.15
// （现价 = 原价 * 0.85，保留两位）

public class Discount {
    public static void main(String[] args) {
        double price = 299.0;
        double discount = 0.85;
        // 补全
    }
}`}
      answerCode={`public class Discount {
    public static void main(String[] args) {
        double price = 299.0;
        double discount = 0.85;
        double now = price * discount;

        System.out.println(String.format("原价：¥%.2f", price));
        System.out.println(String.format("折扣：%.1f%%", discount * 100));
        System.out.println(String.format("现价：¥%.2f", now));
    }
}

/* 控制台输出：
原价：¥299.00
折扣：85.0%
现价：¥254.15

解析：%.2f 控制金额两位小数，%.1f%% 显示带一位小数的百分比（注意 %% 才是百分号）。
      提醒：真实电商的金额计算应使用 BigDecimal 以避免浮点误差，这里仅作格式化演示。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：生成对齐的编号列表"
      code={`// 用 printf 输出 3 行，编号补零到 3 位、商品名左对齐占 8 位、价格保留两位右对齐占 8 位：
// 商品：苹果 5.5 / 香蕉 3.25 / 西瓜 12.8
// 预期输出（| 为对齐参考，不必打印）：
// 001 苹果      |    5.50
// 002 香蕉      |    3.25
// 003 西瓜      |   12.80

public class ItemList {
    public static void main(String[] args) {
        String[] names = {"苹果", "香蕉", "西瓜"};
        double[] prices = {5.5, 3.25, 12.8};
        // 补全
    }
}`}
      answerCode={`public class ItemList {
    public static void main(String[] args) {
        String[] names = {"苹果", "香蕉", "西瓜"};
        double[] prices = {5.5, 3.25, 12.8};

        for (int i = 0; i < names.length; i++) {
            System.out.printf("%03d %-8s|%8.2f%n", i + 1, names[i], prices[i]);
        }
    }
}

/* 控制台输出：
001 苹果      |    5.50
002 香蕉      |    3.25
003 西瓜      |   12.80

解析：%03d 编号补零；%-8s 商品名左对齐占8；%8.2f 价格右对齐占8且两位小数；
      %n 换行。组合修饰符即可生成整齐的列表/报表。
      注意：中文字符在终端里通常占两个英文宽度，实际对齐效果会因字体而略有差异。
*/`}
    />
  </article>
);

export default index;
