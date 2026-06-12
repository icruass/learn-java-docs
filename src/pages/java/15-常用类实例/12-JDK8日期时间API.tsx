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
    <Title>JDK8 新日期时间 API</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        JDK8 引入了全新的 <InlineCode>java.time</InlineCode> 包，彻底解决了传统 Date/Calendar 的痛点：
        <Text bold>不可变、线程安全、月份从 1 开始、API 统一直观</Text>。本节讲解核心的三个类
        <InlineCode>LocalDate</InlineCode>（日期）、<InlineCode>LocalTime</InlineCode>（时间）、
        <InlineCode>LocalDateTime</InlineCode>（日期+时间），以及格式化 <InlineCode>DateTimeFormatter</InlineCode>、
        时间间隔 <InlineCode>Period</InlineCode>/<InlineCode>Duration</InlineCode>。这是<Text bold>现代 Java 处理时间的标准</Text>。
      </Paragraph>
    </Callout>

    <Heading3>1. 三大核心类</Heading3>
    <Table
      head={['类', '表示', '示例']}
      rows={[
        ['LocalDate', '只有日期（年月日）', '2026-06-12'],
        ['LocalTime', '只有时间（时分秒）', '14:30:05'],
        ['LocalDateTime', '日期 + 时间', '2026-06-12T14:30:05'],
      ]}
    />
    <Callout type="tip" title="它们都是不可变的">
      这三个类都是<Text bold>不可变对象</Text>（像 String 一样）。所有「修改」方法（如 <InlineCode>plusDays</InlineCode>）
      都<Text bold>返回新对象</Text>，原对象不变——这正是它们线程安全的根本原因。
    </Callout>

    <Heading3>2. 创建：now 与 of</Heading3>
    <CodeBlock
      title="CreateDemo.java"
      code={`import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

public class CreateDemo {
    public static void main(String[] args) {
        // now()：当前
        System.out.println("今天: " + LocalDate.now());
        System.out.println("此刻: " + LocalTime.now());
        System.out.println("当前: " + LocalDateTime.now());

        // of(...)：指定值构造（月份就是 1~12，直观！）
        LocalDate date = LocalDate.of(2026, 6, 12);
        LocalTime time = LocalTime.of(14, 30, 5);
        LocalDateTime dt = LocalDateTime.of(2026, 6, 12, 14, 30, 5);
        System.out.println("指定日期: " + date);
        System.out.println("指定时间: " + time);
        System.out.println("指定日期时间: " + dt);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（now 部分随运行时刻不同）"
      code={`今天: 2026-06-12
此刻: 14:30:05.123
当前: 2026-06-12T14:30:05.123
指定日期: 2026-06-12
指定时间: 14:30:05
指定日期时间: 2026-06-12T14:30:05`}
    />
    <Callout type="success" title="终于，月份从 1 开始了">
      <InlineCode>LocalDate.of(2026, 6, 12)</InlineCode> 就是 6 月 12 日，<Text bold>所见即所得</Text>，
      不再像 Calendar 那样要 -1。这是新 API 最受欢迎的改进之一。
    </Callout>

    <Heading3>3. 取值：getXxx</Heading3>
    <CodeBlock
      title="GetDemo.java"
      code={`import java.time.LocalDateTime;

public class GetDemo {
    public static void main(String[] args) {
        LocalDateTime dt = LocalDateTime.of(2026, 6, 12, 14, 30, 5);

        System.out.println("年: " + dt.getYear());
        System.out.println("月: " + dt.getMonthValue());   // 1~12，直接可用
        System.out.println("日: " + dt.getDayOfMonth());
        System.out.println("时: " + dt.getHour());
        System.out.println("分: " + dt.getMinute());
        System.out.println("星期: " + dt.getDayOfWeek());   // 枚举
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`年: 2026
月: 6
日: 12
时: 14
分: 30
星期: FRIDAY`}
    />
    <Callout type="warning" title="getMonthValue vs getMonth">
      <InlineCode>getMonthValue()</InlineCode> 返回 int（6）；<InlineCode>getMonth()</InlineCode>
      返回的是 <InlineCode>Month</InlineCode> 枚举（<InlineCode>JUNE</InlineCode>）。需要数字用前者。
    </Callout>

    <Heading3>4. 运算：plus / minus / with</Heading3>
    <Paragraph>
      所有运算方法都返回<Text bold>新对象</Text>，可链式调用：
    </Paragraph>
    <Table
      head={['方法', '作用']}
      rows={[
        ['plusDays / plusMonths / plusYears / plusHours...', '加上一段时间'],
        ['minusDays / minusMonths...', '减去一段时间'],
        ['withYear / withMonth / withDayOfMonth', '替换某个字段为指定值'],
        ['isBefore / isAfter / isEqual', '比较先后'],
      ]}
    />
    <CodeBlock
      title="CalcDemo.java"
      code={`import java.time.LocalDate;

public class CalcDemo {
    public static void main(String[] args) {
        LocalDate today = LocalDate.of(2026, 6, 12);

        System.out.println("7天后:  " + today.plusDays(7));
        System.out.println("1个月前: " + today.minusMonths(1));
        System.out.println("明年同天: " + today.plusYears(1));

        // with：把日期改到当月 1 号
        System.out.println("本月1号: " + today.withDayOfMonth(1));

        // 原对象不变（不可变性）
        System.out.println("today 仍是: " + today);

        // 比较
        LocalDate other = LocalDate.of(2026, 1, 1);
        System.out.println("today 在 other 之后? " + today.isAfter(other));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`7天后:  2026-06-19
1个月前: 2026-05-12
明年同天: 2027-06-12
本月1号: 2026-06-01
today 仍是: 2026-06-12
today 在 other 之后? true`}
    />

    <Heading3>5. 格式化：DateTimeFormatter（线程安全）</Heading3>
    <Paragraph>
      新 API 用 <InlineCode>DateTimeFormatter</InlineCode> 做格式化与解析，它<Text bold>线程安全</Text>，
      可以放心定义成常量复用。格式字母与 SimpleDateFormat 基本一致（<InlineCode>yyyy-MM-dd HH:mm:ss</InlineCode>）：
    </Paragraph>
    <CodeBlock
      title="FormatDemo.java"
      code={`import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FormatDemo {
    public static void main(String[] args) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // 格式化：LocalDateTime -> String
        LocalDateTime dt = LocalDateTime.of(2026, 6, 12, 14, 30, 5);
        String text = dt.format(fmt);
        System.out.println("格式化: " + text);

        // 解析：String -> LocalDateTime
        LocalDateTime parsed = LocalDateTime.parse("2026-01-01 10:20:30", fmt);
        System.out.println("解析: " + parsed);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`格式化: 2026-06-12 14:30:05
解析: 2026-01-01T10:20:30`}
    />
    <Callout type="tip" title="格式化的方向：对象.format vs 类.parse">
      <UnorderedList>
        <ListItem>对象 → 字符串：<InlineCode>dateTime.format(fmt)</InlineCode></ListItem>
        <ListItem>字符串 → 对象：<InlineCode>LocalDateTime.parse(str, fmt)</InlineCode></ListItem>
      </UnorderedList>
      和老 API 的 <InlineCode>sdf.format / sdf.parse</InlineCode> 思路一致，只是更安全。
    </Callout>

    <Heading3>6. 时间间隔：Period 与 Duration</Heading3>
    <Table
      head={['类', '衡量', '配合']}
      rows={[
        ['Period', '以「年/月/日」为单位的间隔', 'LocalDate'],
        ['Duration', '以「时/分/秒」为单位的间隔', 'LocalTime / LocalDateTime'],
        ['ChronoUnit', '直接算两个时间相差多少个某单位', '通用，最常用'],
      ]}
    />
    <CodeBlock
      title="IntervalDemo.java"
      code={`import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;

public class IntervalDemo {
    public static void main(String[] args) {
        LocalDate start = LocalDate.of(2026, 1, 1);
        LocalDate end = LocalDate.of(2026, 3, 1);

        // Period：拆成 年-月-日
        Period p = Period.between(start, end);
        System.out.println("相差: " + p.getMonths() + " 个月 " + p.getDays() + " 天");

        // ChronoUnit：直接算总天数（最常用）
        long days = ChronoUnit.DAYS.between(start, end);
        System.out.println("总共相差: " + days + " 天");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`相差: 2 个月 0 天
总共相差: 59 天`}
    />
    <Callout type="success" title="对比传统 API 的进步">
      上一节算「相差多少天」要手动做毫秒相减除以 86400000，又繁琐又易错。
      这里 <InlineCode>ChronoUnit.DAYS.between(a, b)</InlineCode> 一行搞定，且自动处理闰年等细节。
    </Callout>

    <Heading3>7. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>三大类：<InlineCode>LocalDate</InlineCode>（日期）、<InlineCode>LocalTime</InlineCode>（时间）、<InlineCode>LocalDateTime</InlineCode>（两者）。</ListItem>
        <ListItem>创建用 <InlineCode>now()</InlineCode>/<InlineCode>of()</InlineCode>，<Text bold>月份就是 1~12</Text>，所见即所得。</ListItem>
        <ListItem>不可变：<InlineCode>plusDays</InlineCode> 等返回新对象，原对象不变，因此线程安全。</ListItem>
        <ListItem>格式化用 <InlineCode>DateTimeFormatter</InlineCode>（线程安全，可做常量）：对象 <InlineCode>.format</InlineCode>、类 <InlineCode>.parse</InlineCode>。</ListItem>
        <ListItem>算间隔用 <InlineCode>Period</InlineCode>（年月日）/<InlineCode>Duration</InlineCode>（时分秒）/<InlineCode>ChronoUnit.between</InlineCode>。</ListItem>
        <ListItem><Text bold>新项目一律用这套 API</Text>，告别 Date/Calendar 的坑。</ListItem>
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
      code={`LocalDate d = LocalDate.of(2026, 6, 12);
System.out.println(d.getMonthValue());
System.out.println(d.plusDays(20));
System.out.println(d);                       // plusDays 之后再打印 d
System.out.println(d.isLeapYear());          // 2026 是闰年吗

问：四行分别输出什么？`}
      answerCode={`答案：
6            —— 月份直接是 6，不用 +1
2026-07-02   —— 6月12日加20天，6月30天，跨到7月2日
2026-06-12   —— d 不可变！plusDays 返回的是新对象，原 d 没变
false        —— 2026 不是闰年（不能被4整除）

解析：核心考点是「不可变性」——所有运算都不改原对象，必须用返回值接收。
      很多人误以为 d.plusDays(20) 会改变 d，这是新手常见误区。`}
    />

    <CodeBlock
      qa
      title="练习2：计算某人的年龄"
      code={`// 给定出生日期 2000-03-15，计算到 2026-06-12 时的周岁年龄。
// 用 Period 或 ChronoUnit 实现。
// 预期输出：26 岁

import java.time.LocalDate;
import java.time.Period;

public class Age {
    public static void main(String[] args) {
        LocalDate birth = LocalDate.of(2000, 3, 15);
        LocalDate today = LocalDate.of(2026, 6, 12);
        // 补全
    }
}`}
      answerCode={`import java.time.LocalDate;
import java.time.Period;

public class Age {
    public static void main(String[] args) {
        LocalDate birth = LocalDate.of(2000, 3, 15);
        LocalDate today = LocalDate.of(2026, 6, 12);

        Period p = Period.between(birth, today);
        System.out.println(p.getYears() + " 岁");
    }
}

/* 控制台输出：
26 岁

解析：Period.between 自动按「年月日」拆分间隔，getYears() 正好是周岁。
      它会正确处理「生日是否已过」——若 today 改成 2026-01-01（生日还没到），结果会是 25 岁。
      这种边界正确性正是手动算毫秒难以保证的。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：格式化并解析"
      code={`// 1) 把 2026-06-12T14:30:05 格式化成 "2026/06/12 14:30"
// 2) 再把字符串 "2026/12/25 00:00" 解析回 LocalDateTime 并打印
// 用同一个 DateTimeFormatter（pattern: yyyy/MM/dd HH:mm）

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FmtParse {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FmtParse {
    public static void main(String[] args) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");

        // 1) 格式化
        LocalDateTime dt = LocalDateTime.of(2026, 6, 12, 14, 30, 5);
        System.out.println(dt.format(fmt));

        // 2) 解析
        LocalDateTime parsed = LocalDateTime.parse("2026/12/25 00:00", fmt);
        System.out.println(parsed);
    }
}

/* 控制台输出：
2026/06/12 14:30
2026-12-25T00:00

解析：格式化用「对象.format(fmt)」，解析用「LocalDateTime.parse(str, fmt)」，
      两个方向共用同一个 formatter。注意 pattern 必须与字符串结构完全匹配，否则抛
      DateTimeParseException。DateTimeFormatter 线程安全，定义成 static final 常量复用即可。
*/`}
    />
  </article>
);

export default index;
