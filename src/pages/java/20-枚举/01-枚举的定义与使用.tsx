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
    <Title>枚举的定义与使用</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        当一个变量的取值是<Text bold>固定的、有限的几个</Text>（如星期一到星期日、订单状态待付款/已付款/已发货），
        用整数常量或字符串表示既不安全又难读。JDK5 引入的<Text bold>枚举（enum）</Text>专门解决这个问题。
        本节讲解枚举的定义语法、为什么它比「常量」更好，以及枚举在 <InlineCode>switch</InlineCode> 中的用法。
      </Paragraph>
    </Callout>

    <Heading3>1. 枚举之前：用常量表示「有限取值」的弊端</Heading3>
    <CodeBlock
      title="用 int 常量表示季节（不推荐）"
      code={`public class OldWay {
    public static final int SPRING = 0;
    public static final int SUMMER = 1;
    public static final int AUTUMN = 2;
    public static final int WINTER = 3;

    static void describe(int season) {
        System.out.println("季节编号: " + season);
    }

    public static void main(String[] args) {
        describe(SUMMER);
        describe(99);     // 非法值也能传进来，编译器不拦！
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`季节编号: 1
季节编号: 99`} />
    <Callout type="warning" title="常量方案的三大问题">
      <UnorderedList>
        <ListItem><Text bold>不安全</Text>：方法参数是 int，传 99 这种非法值也能编译通过。</ListItem>
        <ListItem><Text bold>不可读</Text>：打印出来是 0/1/2，看不出语义。</ListItem>
        <ListItem><Text bold>无约束</Text>：无法限定「只能是这四个值之一」。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>2. 枚举的定义</Heading3>
    <Paragraph>
      用关键字 <InlineCode>enum</InlineCode> 定义枚举，把所有可能的取值（称「枚举常量」/「枚举项」）
      列在大括号里，用逗号分隔：
    </Paragraph>
    <CodeBlock
      language="text"
      title="枚举语法"
      code={`修饰符 enum 枚举名 {
    常量1, 常量2, 常量3;   // 枚举项，习惯全大写
}`}
    />
    <CodeBlock
      title="定义并使用 Season 枚举"
      code={`enum Season {
    SPRING, SUMMER, AUTUMN, WINTER;   // 四个枚举项
}

public class EnumDemo {
    // 参数类型直接是 Season，只能传这四个之一
    static void describe(Season season) {
        System.out.println("当前季节: " + season);
    }

    public static void main(String[] args) {
        Season s = Season.SUMMER;    // 用「枚举名.枚举项」访问
        describe(s);
        describe(Season.WINTER);
        // describe(99);   // 编译错误！类型不符，从根上杜绝非法值
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`当前季节: SUMMER
当前季节: WINTER`}
    />
    <Callout type="success" title="枚举的优势">
      <UnorderedList>
        <ListItem><Text bold>类型安全</Text>：参数是 <InlineCode>Season</InlineCode>，传别的类型直接编译报错。</ListItem>
        <ListItem><Text bold>可读</Text>：打印就是 <InlineCode>SUMMER</InlineCode>，语义清晰。</ListItem>
        <ListItem><Text bold>取值受限</Text>：编译器保证只能是定义的那几项。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>3. 枚举的本质：一种特殊的类</Heading3>
    <Paragraph>
      <InlineCode>enum</InlineCode> 编译后其实是一个<Text bold>继承自 java.lang.Enum 的特殊类</Text>，
      每个枚举项都是该类的一个<Text bold>静态常量实例</Text>（单例）。所以：
    </Paragraph>
    <UnorderedList>
      <ListItem>枚举项天生是<Text bold>单例</Text>，整个 JVM 只有一个，可以放心用 <InlineCode>==</InlineCode> 比较。</ListItem>
      <ListItem>枚举不能被 <InlineCode>new</InlineCode>（构造方法只能是私有），不能被继承。</ListItem>
    </UnorderedList>
    <CodeBlock
      title="枚举用 == 比较安全"
      code={`enum Color { RED, GREEN, BLUE }

public class EnumEquals {
    public static void main(String[] args) {
        Color a = Color.RED;
        Color b = Color.RED;
        System.out.println(a == b);          // true：同一个单例
        System.out.println(a.equals(b));      // true
        System.out.println(a == Color.BLUE);  // false
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`true
true
false`} />
    <Callout type="tip" title="枚举比较用 == 还是 equals？">
      两者都可以且结果一致。但 <InlineCode>==</InlineCode> 更优：它<Text bold>不会有空指针</Text>
      （<InlineCode>null == Color.RED</InlineCode> 安全返回 false，而 <InlineCode>null.equals(...)</InlineCode> 抛 NPE），
      且是编译期类型检查。所以<Text bold>枚举比较推荐用 ==</Text>。
    </Callout>

    <Heading3>4. 枚举与 switch 的天作之合</Heading3>
    <Paragraph>
      <InlineCode>switch</InlineCode> 支持枚举，而且 <InlineCode>case</InlineCode> 后面<Text bold>直接写枚举项名</Text>
      （不要写「枚举名.项」，否则编译错误）：
    </Paragraph>
    <CodeBlock
      title="枚举 + switch"
      code={`enum Week { MON, TUE, WED, THU, FRI, SAT, SUN }

public class EnumSwitch {
    static String kind(Week day) {
        switch (day) {
            case SAT:        // 注意：直接写 SAT，不写 Week.SAT
            case SUN:
                return "周末";
            default:
                return "工作日";
        }
    }

    public static void main(String[] args) {
        System.out.println("周三: " + kind(Week.WED));
        System.out.println("周六: " + kind(Week.SAT));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`周三: 工作日
周六: 周末`}
    />
    <Callout type="warning" title="case 后面只写枚举项名">
      在 <InlineCode>switch(day)</InlineCode> 里，<InlineCode>case SAT</InlineCode> 是对的，
      写成 <InlineCode>case Week.SAT</InlineCode> 反而编译报错——因为 switch 已经知道是 Week 类型了。
    </Callout>

    <Heading3>5. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>枚举用于表示<Text bold>固定、有限</Text>的一组取值，比 int/字符串常量更安全可读。</ListItem>
        <ListItem>定义：<InlineCode>enum 名 {`{ A, B, C }`}</InlineCode>；访问：<InlineCode>枚举名.枚举项</InlineCode>。</ListItem>
        <ListItem>本质是继承 <InlineCode>Enum</InlineCode> 的特殊类，每个枚举项是<Text bold>单例</Text>，不能 new、不能继承。</ListItem>
        <ListItem>枚举比较<Text bold>推荐用 ==</Text>（不怕空指针，编译期检查）。</ListItem>
        <ListItem><InlineCode>switch</InlineCode> 支持枚举，<InlineCode>case</InlineCode> 后<Text bold>只写枚举项名</Text>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断对错"
      code={`① 枚举项可以用 new 来创建。
② 枚举可以被其它类继承（extends）。
③ 枚举比较用 == 可能抛空指针异常。
④ switch 的 case 后面要写「枚举名.枚举项」。`}
      answerCode={`答案：
① 错。枚举的构造方法是私有的，不能 new；枚举项在类加载时就创建好了（单例）。
② 错。枚举已隐式继承 java.lang.Enum，Java 不支持多继承，所以枚举不能再 extends 别的类，也不能被继承。
③ 错。== 对 null 安全（null == X 返回 false 不报错）；反而 equals 在左边为 null 时才抛 NPE。
④ 错。case 后只写枚举项名（如 case SAT），写成 Week.SAT 会编译错误。`}
    />

    <CodeBlock
      qa
      title="练习2：用枚举表示订单状态"
      code={`// 定义订单状态枚举 OrderStatus（待付款 PENDING、已付款 PAID、已发货 SHIPPED、已完成 DONE），
// 写方法 next(OrderStatus) 返回下一个状态（DONE 的下一个仍是 DONE），用 switch 实现。
// 验证：PENDING -> ? , SHIPPED -> ?

public class Test {
    public static void main(String[] args) {
        // 期望：
        // PENDING 的下一步: PAID
        // SHIPPED 的下一步: DONE
    }
}`}
      answerCode={`enum OrderStatus { PENDING, PAID, SHIPPED, DONE }

public class Test {
    static OrderStatus next(OrderStatus s) {
        switch (s) {
            case PENDING: return OrderStatus.PAID;
            case PAID:    return OrderStatus.SHIPPED;
            case SHIPPED: return OrderStatus.DONE;
            default:      return OrderStatus.DONE;   // DONE 已是终态
        }
    }

    public static void main(String[] args) {
        System.out.println("PENDING 的下一步: " + next(OrderStatus.PENDING));
        System.out.println("SHIPPED 的下一步: " + next(OrderStatus.SHIPPED));
    }
}

/* 控制台输出：
PENDING 的下一步: PAID
SHIPPED 的下一步: DONE

解析：用枚举建模状态机非常自然——类型安全、语义清晰，switch 的 case 直接写枚举项名。
      这是企业开发里枚举最典型的用途之一（状态、类型、分类）。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：找错并改正"
      code={`enum Light { RED, YELLOW, GREEN }

public class Test {
    static void go(Light light) {
        switch (light) {
            case Light.RED:                       // 错误1
                System.out.println("停");
                break;
            case GREEN:
                System.out.println("行");
        }
    }
    public static void main(String[] args) {
        Light l = new Light();                    // 错误2
        go(Light.RED);
    }
}`}
      answerCode={`// 错误1：case 后不能写 Light.RED，应直接写 RED。
// 错误2：枚举不能 new，应通过 Light.RED 等枚举项获取。

enum Light { RED, YELLOW, GREEN }

public class Test {
    static void go(Light light) {
        switch (light) {
            case RED:                 // 改正：直接写枚举项名
                System.out.println("停");
                break;
            case GREEN:
                System.out.println("行");
        }
    }
    public static void main(String[] args) {
        Light l = Light.RED;          // 改正：用枚举项，不能 new
        go(l);
    }
}

/* 控制台输出：
停

解析：两处都是枚举最常见的语法错误。记住：枚举项通过「枚举名.项」获取（不能 new），
      switch 的 case 后只写「项名」（不带枚举名前缀）。
*/`}
    />
  </article>
);

export default index;
