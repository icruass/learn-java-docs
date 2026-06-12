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
    <Title>枚举常用方法与应用</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        所有枚举都隐式继承 <InlineCode>java.lang.Enum</InlineCode>，因此自动拥有一批通用方法：
        遍历用的 <InlineCode>values()</InlineCode>、名字与序号 <InlineCode>name()/ordinal()</InlineCode>、
        字符串转枚举 <InlineCode>valueOf()</InlineCode> 等。本节讲透这些方法，介绍专为枚举优化的高效集合
        <InlineCode>EnumMap</InlineCode>/<InlineCode>EnumSet</InlineCode>，并总结枚举在企业开发中的典型应用与避坑点。
      </Paragraph>
    </Callout>

    <Heading3>1. 枚举的内置方法一览</Heading3>
    <Table
      head={['方法', '作用', '说明']}
      rows={[
        ['values()', '返回所有枚举项的数组', '编译器自动生成的静态方法'],
        ['name()', '返回枚举项的名字（字符串）', '与 toString() 默认结果相同'],
        ['ordinal()', '返回枚举项的序号（从 0 开始）', '按定义顺序'],
        ['valueOf(String)', '根据名字返回对应枚举项', '名字不存在抛 IllegalArgumentException'],
        ['compareTo(E)', '按 ordinal 比较先后', '可用于排序'],
      ]}
    />
    <CodeBlock
      title="内置方法演示"
      code={`enum Week { MON, TUE, WED, THU, FRI, SAT, SUN }

public class EnumMethods {
    public static void main(String[] args) {
        // values()：遍历所有枚举项
        for (Week w : Week.values()) {
            // name() 名字，ordinal() 序号
            System.out.println(w.ordinal() + " -> " + w.name());
        }

        System.out.println("------");

        // valueOf：字符串 -> 枚举项
        Week w = Week.valueOf("FRI");
        System.out.println("valueOf(\\"FRI\\") = " + w + "，序号 " + w.ordinal());

        // compareTo：按 ordinal 比较
        System.out.println("MON.compareTo(WED) = " + Week.MON.compareTo(Week.WED));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`0 -> MON
1 -> TUE
2 -> WED
3 -> THU
4 -> FRI
5 -> SAT
6 -> SUN
------
valueOf("FRI") = FRI，序号 4
MON.compareTo(WED) = -2`}
    />

    <Heading3>2. valueOf 的异常处理</Heading3>
    <CodeBlock
      title="valueOf 传入非法名字会抛异常"
      code={`enum Color { RED, GREEN, BLUE }

public class ValueOfDemo {
    public static void main(String[] args) {
        System.out.println(Color.valueOf("RED"));   // 正常

        try {
            Color.valueOf("PURPLE");   // 不存在
        } catch (IllegalArgumentException e) {
            System.out.println("没有这个枚举项: " + e.getMessage());
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`RED
没有这个枚举项: No enum constant Color.PURPLE`}
    />
    <Callout type="warning" title="valueOf 大小写敏感，且对非法值抛异常">
      <InlineCode>valueOf</InlineCode> 必须传<Text bold>完全匹配</Text>的名字（区分大小写），
      传 <InlineCode>"red"</InlineCode> 或不存在的名字都会抛 <InlineCode>IllegalArgumentException</InlineCode>。
      解析外部输入（如接口参数）时务必 try-catch 或先校验。
    </Callout>

    <Heading3>3. 慎用 ordinal()</Heading3>
    <Callout type="danger" title="不要依赖 ordinal 的具体数值">
      <InlineCode>ordinal()</InlineCode> 返回的是「定义顺序」。一旦有人<Text bold>调整枚举项顺序</Text>
      或<Text bold>在中间插入新项</Text>，所有序号都会变，依赖它存数据库或做逻辑判断就会出大 bug。
      <Text bold>需要稳定编号时，应自己定义一个字段</Text>（如上一节的带参数枚举），而不是用 ordinal。
    </Callout>
    <CodeBlock
      title="正例：用自定义 code 而非 ordinal"
      code={`enum Status {
    PENDING(1), PAID(2), DONE(5);   // code 与顺序解耦，可稳定存库

    private final int code;
    Status(int code) { this.code = code; }
    public int getCode() { return code; }
}

public class CodeDemo {
    public static void main(String[] args) {
        // 即使以后在 PENDING、PAID 之间插入新状态，已有 code 不受影响
        System.out.println("DONE 的稳定编号: " + Status.DONE.getCode());
        System.out.println("DONE 的 ordinal: " + Status.DONE.ordinal());
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`DONE 的稳定编号: 5
DONE 的 ordinal: 2`} />

    <Heading3>4. EnumMap 与 EnumSet：专为枚举优化的集合</Heading3>
    <Paragraph>
      当 key 是枚举时，用 <InlineCode>EnumMap</InlineCode> 比 <InlineCode>HashMap</InlineCode> 更快更省
      （底层是数组）；表示「一组枚举值」用 <InlineCode>EnumSet</InlineCode> 比 <InlineCode>HashSet</InlineCode> 高效：
    </Paragraph>
    <CodeBlock
      title="EnumMap / EnumSet"
      code={`import java.util.EnumMap;
import java.util.EnumSet;

enum Week { MON, TUE, WED, THU, FRI, SAT, SUN }

public class EnumCollections {
    public static void main(String[] args) {
        // EnumMap：枚举 -> 安排
        EnumMap<Week, String> plan = new EnumMap<>(Week.class);
        plan.put(Week.MON, "开会");
        plan.put(Week.FRI, "复盘");
        System.out.println("周一安排: " + plan.get(Week.MON));

        // EnumSet：表示「周末」这组值
        EnumSet<Week> weekend = EnumSet.of(Week.SAT, Week.SUN);
        System.out.println("周六是周末吗: " + weekend.contains(Week.SAT));
        System.out.println("工作日集合: " + EnumSet.complementOf(weekend));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`周一安排: 开会
周六是周末吗: true
工作日集合: [MON, TUE, WED, THU, FRI]`}
    />
    <Callout type="tip" title="有枚举 key/元素就优先用 EnumMap/EnumSet">
      它们底层用数组（按 ordinal 索引），<Text bold>性能和内存都优于 HashMap/HashSet</Text>，
      且遍历顺序就是枚举定义顺序。涉及枚举的映射或集合，优先选它们。
    </Callout>

    <Heading3>5. 枚举的典型应用场景</Heading3>
    <Table
      head={['场景', '示例']}
      rows={[
        ['状态机', '订单状态、审批流程、连接状态'],
        ['固定分类/类型', '性别、用户角色、支付方式、日志级别'],
        ['单例模式', '用单元素枚举实现线程安全的单例（《Effective Java》推荐）'],
        ['策略封装', '枚举 + 抽象方法，把行为绑定到类型'],
        ['常量分组', '替代一堆 public static final 常量'],
      ]}
    />
    <CodeBlock
      title="枚举实现单例（最简洁、天然线程安全）"
      code={`enum Singleton {
    INSTANCE;   // 唯一实例

    private int count = 0;
    public void add() { count++; }
    public int getCount() { return count; }
}

public class SingletonDemo {
    public static void main(String[] args) {
        Singleton.INSTANCE.add();
        Singleton.INSTANCE.add();
        System.out.println("计数: " + Singleton.INSTANCE.getCount());
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`计数: 2`} />

    <Heading3>6. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>values()</InlineCode> 遍历、<InlineCode>name()</InlineCode> 取名、<InlineCode>ordinal()</InlineCode> 取序号、<InlineCode>valueOf()</InlineCode> 字符串转枚举。</ListItem>
        <ListItem><InlineCode>valueOf</InlineCode> 大小写敏感，非法名抛 <InlineCode>IllegalArgumentException</InlineCode>，解析外部输入要防异常。</ListItem>
        <ListItem><Text bold>不要依赖 ordinal 的数值</Text>，需要稳定编号请自定义字段。</ListItem>
        <ListItem>枚举做 key/元素时优先用 <InlineCode>EnumMap</InlineCode>/<InlineCode>EnumSet</InlineCode>，更快更省。</ListItem>
        <ListItem>枚举常用于状态机、固定分类、策略封装、单例。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测输出"
      code={`enum E { A, B, C }

System.out.println(E.values().length);
System.out.println(E.B.ordinal());
System.out.println(E.B.name());
System.out.println(E.valueOf("C") == E.C);

问：四行分别输出什么？`}
      answerCode={`答案：
3      —— values() 返回 [A, B, C]，长度 3
1      —— B 的序号（从 0 开始：A=0, B=1, C=2）
B      —— name() 返回枚举项名字
true   —— valueOf("C") 拿到的就是单例 E.C，== 成立

解析：values/ordinal/name/valueOf 是枚举最常用的四个内置方法，务必熟练。`}
    />

    <CodeBlock
      qa
      title="练习2：统计每个枚举出现次数（EnumMap）"
      code={`// 给定一组日志级别，用 EnumMap 统计每个级别出现的次数。
// 输入: [INFO, ERROR, INFO, WARN, ERROR, INFO]
// 预期输出（按枚举定义顺序）：
//   INFO=3
//   WARN=1
//   ERROR=2

import java.util.EnumMap;

enum LogLevel { INFO, WARN, ERROR }

public class Test {
    public static void main(String[] args) {
        LogLevel[] logs = {LogLevel.INFO, LogLevel.ERROR, LogLevel.INFO,
                           LogLevel.WARN, LogLevel.ERROR, LogLevel.INFO};
        // 补全
    }
}`}
      answerCode={`import java.util.EnumMap;
import java.util.Map;

enum LogLevel { INFO, WARN, ERROR }

public class Test {
    public static void main(String[] args) {
        LogLevel[] logs = {LogLevel.INFO, LogLevel.ERROR, LogLevel.INFO,
                           LogLevel.WARN, LogLevel.ERROR, LogLevel.INFO};

        EnumMap<LogLevel, Integer> count = new EnumMap<>(LogLevel.class);
        for (LogLevel lv : logs) {
            count.put(lv, count.getOrDefault(lv, 0) + 1);
        }

        for (Map.Entry<LogLevel, Integer> e : count.entrySet()) {
            System.out.println(e.getKey() + "=" + e.getValue());
        }
    }
}

/* 控制台输出：
INFO=3
WARN=1
ERROR=2

解析：EnumMap 以枚举为 key，底层用数组按 ordinal 索引，遍历顺序就是定义顺序（INFO/WARN/ERROR）。
      getOrDefault 实现计数。同样的需求用 HashMap 也行，但 EnumMap 更快更省且顺序可预期。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：辨析 ordinal 的风险"
      code={`// 某系统这样把订单状态存进数据库：保存 status.ordinal()。
enum Status { PENDING, PAID, DONE }   // 当前版本
// 后来产品要求在 PAID 和 DONE 之间加一个 SHIPPED：
enum Status2 { PENDING, PAID, SHIPPED, DONE }   // 新版本

// 问：旧数据库里存的 DONE 的值，在新版本会被解读成什么？为什么？怎么避免？`}
      answerCode={`答案：
旧库里 DONE 存的是 ordinal()=2。
新版本里 ordinal=2 对应的是 SHIPPED（PENDING=0, PAID=1, SHIPPED=2, DONE=3）。
于是所有旧的「已完成(DONE)」订单都会被错误解读成「已发货(SHIPPED)」——严重数据错乱！

原因：ordinal() 是按定义顺序自动编号的，中间插入新项会导致后面所有项的序号整体后移。

避免方法：永远不要用 ordinal() 持久化或做业务判断。应给枚举定义一个稳定的 code 字段：
  enum Status {
      PENDING(1), PAID(2), DONE(5);
      private final int code;
      Status(int code){ this.code = code; }
      public int getCode(){ return code; }
      public static Status fromCode(int c){
          for (Status s : values()) if (s.code == c) return s;
          throw new IllegalArgumentException("未知code:" + c);
      }
  }
存库存 getCode()，读库用 fromCode()，与定义顺序彻底解耦。`}
    />
  </article>
);

export default index;
