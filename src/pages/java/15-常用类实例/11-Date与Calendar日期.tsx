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
    <Title>Date 与 Calendar（传统日期）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节介绍 JDK8 之前的传统日期 API：表示时间点的 <InlineCode>Date</InlineCode>、
        格式化与解析的 <InlineCode>SimpleDateFormat</InlineCode>、以及做日期运算的
        <InlineCode>Calendar</InlineCode>。这套 API 设计上有不少坑（月份从 0 开始、线程不安全等），
        实际新项目应优先用下一节的 JDK8 新 API。但大量老代码仍在使用它们，
        <Text bold>必须看得懂、改得动</Text>，所以本节既讲用法，也重点标注它们的「坑」。
      </Paragraph>
    </Callout>

    <Heading3>1. Date：表示一个时间点</Heading3>
    <Paragraph>
      <InlineCode>java.util.Date</InlineCode> 表示一个精确到毫秒的时间点，本质就是包了一个
      「从 1970-01-01 至今的毫秒数」。
    </Paragraph>
    <CodeBlock
      title="DateDemo.java"
      code={`import java.util.Date;

public class DateDemo {
    public static void main(String[] args) {
        // 无参构造：当前时间
        Date now = new Date();
        System.out.println("当前时间: " + now);

        // 有参构造：传入毫秒数得到对应时间点
        Date epoch = new Date(0L);
        System.out.println("纪元起点: " + epoch);

        // getTime()：取出毫秒数（等同 System.currentTimeMillis()）
        System.out.println("当前毫秒: " + now.getTime());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（时间随运行时刻不同；时区为东八区）"
      code={`当前时间: Fri Jun 12 14:30:00 CST 2026
纪元起点: Thu Jan 01 08:00:00 CST 1970
当前毫秒: 1781504200000`}
    />
    <Callout type="warning" title="Date 的大量方法已过时">
      <InlineCode>Date</InlineCode> 的 <InlineCode>getYear()</InlineCode>、<InlineCode>getMonth()</InlineCode>
      等方法早已被 <Text bold>@Deprecated</Text> 标记弃用（设计有缺陷，如 year 要加 1900）。
      现在 <InlineCode>Date</InlineCode> 基本只用来表示时间点，格式化交给 <InlineCode>SimpleDateFormat</InlineCode>，
      运算交给 <InlineCode>Calendar</InlineCode>。
    </Callout>

    <Heading3>2. SimpleDateFormat：格式化与解析</Heading3>
    <Paragraph>
      <InlineCode>Date</InlineCode> 默认打印格式不友好，<InlineCode>SimpleDateFormat</InlineCode>
      负责「<Text bold>Date ↔ 字符串</Text>」双向转换。先记住常用的格式字母（大小写敏感！）：
    </Paragraph>
    <Table
      head={['字母', '含义', '示例']}
      rows={[
        ['yyyy', '四位年', '2026'],
        ['MM', '两位月（大写 M！）', '06'],
        ['dd', '两位日', '12'],
        ['HH', '24 小时制的时（大写 H）', '14'],
        ['mm', '分（小写 m）', '30'],
        ['ss', '秒', '05'],
        ['EEE', '星期', '周五'],
      ]}
    />
    <Callout type="danger" title="最经典的坑：MM 与 mm、HH 与 hh">
      <UnorderedList>
        <ListItem><Text bold>大写 MM = 月，小写 mm = 分</Text>。写反了会得到莫名其妙的结果。</ListItem>
        <ListItem><Text bold>大写 HH = 24 小时制，小写 hh = 12 小时制</Text>。要 24 小时制务必用大写。</ListItem>
      </UnorderedList>
    </Callout>
    <CodeBlock
      title="SimpleDateFormatDemo.java"
      code={`import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.Date;

public class SimpleDateFormatDemo {
    public static void main(String[] args) throws ParseException {
        Date now = new Date();

        // 格式化：Date -> String
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String text = sdf.format(now);
        System.out.println("格式化结果: " + text);

        // 解析：String -> Date
        String input = "2026-01-01 10:20:30";
        Date parsed = sdf.parse(input);
        System.out.println("解析结果: " + parsed);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`格式化结果: 2026-06-12 14:30:00
解析结果: Thu Jan 01 10:20:30 CST 2026`}
    />
    <Callout type="warning" title="SimpleDateFormat 线程不安全">
      <InlineCode>SimpleDateFormat</InlineCode> 内部有可变状态，<Text bold>不能多个线程共用同一个实例</Text>，
      否则会得到错误结果甚至异常。老代码里常见的「把它定义成 static 共享」是典型 bug。
      这也是 JDK8 推出线程安全的新 API 的原因之一。
    </Callout>

    <Heading3>3. Calendar：日期运算</Heading3>
    <Paragraph>
      要做「加 7 天」「取出年月日」这类运算，传统方式用 <InlineCode>Calendar</InlineCode>。
      它是抽象类，用 <InlineCode>Calendar.getInstance()</InlineCode> 获取实例：
    </Paragraph>
    <CodeBlock
      title="CalendarDemo.java"
      code={`import java.util.Calendar;

public class CalendarDemo {
    public static void main(String[] args) {
        Calendar c = Calendar.getInstance();   // 当前时间

        // 取出各字段（注意月份！）
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);     // 0~11！
        int day = c.get(Calendar.DAY_OF_MONTH);
        System.out.println("年: " + year);
        System.out.println("月(get值): " + month + " -> 实际月份: " + (month + 1));
        System.out.println("日: " + day);

        // 日期运算：当前时间加 7 天
        c.add(Calendar.DAY_OF_MONTH, 7);
        System.out.println("7天后的日: " + c.get(Calendar.DAY_OF_MONTH));

        // set：设置为指定日期（月份要 -1）
        Calendar c2 = Calendar.getInstance();
        c2.set(2026, 0, 1);   // 2026年1月1日（0 代表一月！）
        System.out.println("设置的月份: " + (c2.get(Calendar.MONTH) + 1));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`年: 2026
月(get值): 5 -> 实际月份: 6
日: 12
7天后的日: 19
设置的月份: 1`}
    />
    <Callout type="danger" title="天坑：Calendar 的月份从 0 开始">
      <InlineCode>Calendar</InlineCode> 里<Text bold>一月是 0、十二月是 11</Text>。
      <InlineCode>get(MONTH)</InlineCode> 取出来要 <InlineCode>+1</InlineCode> 才是真实月份；
      <InlineCode>set</InlineCode> 设置时真实月份要 <InlineCode>-1</InlineCode>。
      无数 bug 由此而来，这也是新 API 把月份改成 1~12 的直接动机。
    </Callout>

    <Heading3>4. 传统 API 的问题总结</Heading3>
    <Table
      head={['问题', '说明']}
      rows={[
        ['月份从 0 开始', 'Calendar 一月是 0，极易算错'],
        ['线程不安全', 'SimpleDateFormat 不能多线程共享'],
        ['可变对象', 'Date / Calendar 可被随意修改，难以保证安全'],
        ['API 割裂', '表示用 Date、格式化用 SimpleDateFormat、运算用 Calendar，三套割裂'],
        ['大量方法被弃用', 'Date 的 getYear 等已 @Deprecated'],
      ]}
    />
    <Callout type="tip" title="结论：新项目用 JDK8 新 API">
      正因为这些问题，JDK8 引入了全新的 <InlineCode>java.time</InlineCode> 包
      （<InlineCode>LocalDate</InlineCode>/<InlineCode>LocalDateTime</InlineCode> 等），
      不可变、线程安全、月份从 1 开始、API 统一。<Text bold>新代码一律用新 API</Text>，
      本节内容主要是为了看懂和维护老代码。下一节专门讲新 API。
    </Callout>

    <Heading3>5. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>Date</InlineCode> 表示时间点（底层是毫秒数），大量方法已弃用。</ListItem>
        <ListItem><InlineCode>SimpleDateFormat</InlineCode> 做格式化/解析：<Text bold>MM=月、mm=分、HH=24小时</Text>，且线程不安全。</ListItem>
        <ListItem><InlineCode>Calendar</InlineCode> 做日期运算，<Text bold>月份从 0 开始</Text>，get 要 +1、set 要 -1。</ListItem>
        <ListItem>传统 API 坑多（月份、线程安全、可变、割裂），新项目改用 JDK8 的 <InlineCode>java.time</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：找坑"
      code={`下面每段都有一个常见错误，请指出：
① new SimpleDateFormat("yyyy-mm-dd").format(new Date())   // 想要 年-月-日
② Calendar c = Calendar.getInstance(); c.set(2026, 6, 1); // 想设成 2026年6月1日
③ 把一个 static SimpleDateFormat 字段给多个线程同时调用 format`}
      answerCode={`答案：
① 错在 mm。小写 mm 是「分钟」，年-月-日的「月」要用大写 MM：
   正确："yyyy-MM-dd"。原写法会把月份位置填成分钟。
② 错在月份。Calendar 月份从 0 开始，set(2026, 6, 1) 实际是 7 月！
   要 2026年6月，月份应传 5：c.set(2026, 5, 1)。
③ 错在线程安全。SimpleDateFormat 不是线程安全的，多线程共享同一实例会出错。
   应每次新建、或用 ThreadLocal、或换 JDK8 的 DateTimeFormatter（线程安全）。`}
    />

    <CodeBlock
      qa
      title="练习2：格式化当前时间为中文格式"
      code={`// 把当前时间格式化为：2026年06月12日 14时30分05秒
// 提示：年用 yyyy，月 MM，日 dd，时 HH，分 mm，秒 ss，中文直接写在模板里。

import java.text.SimpleDateFormat;
import java.util.Date;

public class CnFormat {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.text.SimpleDateFormat;
import java.util.Date;

public class CnFormat {
    public static void main(String[] args) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH时mm分ss秒");
        System.out.println(sdf.format(new Date()));
    }
}

/* 控制台输出（随运行时刻不同）：
2026年06月12日 14时30分05秒

解析：模板里可以直接夹中文字面量。关键是 MM(月)、mm(分)、HH(24小时) 不要写错大小写。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：计算两个日期相差多少天"
      code={`// 计算 2026-01-01 到 2026-03-01 相差多少天。
// 思路：把两个日期字符串解析成 Date，取 getTime() 毫秒差，除以一天的毫秒数。
// 预期输出：相差 59 天

import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.Date;

public class DayDiff {
    public static void main(String[] args) throws ParseException {
        // 补全
    }
}`}
      answerCode={`import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.Date;

public class DayDiff {
    public static void main(String[] args) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date d1 = sdf.parse("2026-01-01");
        Date d2 = sdf.parse("2026-03-01");

        long diffMs = d2.getTime() - d1.getTime();        // 毫秒差
        long days = diffMs / (1000 * 60 * 60 * 24);        // 一天的毫秒数
        System.out.println("相差 " + days + " 天");
    }
}

/* 控制台输出：
相差 59 天

解析：传统 API 算日期差只能靠「毫秒数相减再换算」，繁琐且易错（闰年、夏令时等）。
      下一节会看到 JDK8 用 ChronoUnit.DAYS.between(a, b) 一行搞定，这正是新 API 的优势。
      （2026年1月31天+2月28天=59，2026非闰年）
*/`}
    />
  </article>
);

export default index;
