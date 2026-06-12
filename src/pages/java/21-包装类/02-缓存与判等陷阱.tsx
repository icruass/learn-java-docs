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
    <Title>包装类的缓存与判等陷阱</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>Integer a = 127; Integer b = 127;</InlineCode> 时 <InlineCode>a == b</InlineCode> 是
        <InlineCode>true</InlineCode>，可换成 <InlineCode>128</InlineCode> 却变成 <InlineCode>false</InlineCode>——
        这是 Java 面试的「世纪难题」，根源是包装类的<Text bold>整型缓存池</Text>。
        本节讲透这个陷阱的来龙去脉，并给出唯一正确的结论：
        <Text bold>比较包装类的值，永远用 equals，不要用 ==</Text>。
      </Paragraph>
    </Callout>

    <Heading3>1. 现象：同样的值，== 结果却不同</Heading3>
    <CodeBlock
      title="令人困惑的 ==="
      code={`public class IntegerCache {
    public static void main(String[] args) {
        Integer a = 127;
        Integer b = 127;
        System.out.println("127: a == b ? " + (a == b));

        Integer c = 128;
        Integer d = 128;
        System.out.println("128: c == d ? " + (c == d));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`127: a == b ? true
128: c == d ? false`}
    />
    <Paragraph>
      值都相等，为什么 127 是 <InlineCode>true</InlineCode>、128 却是 <InlineCode>false</InlineCode>？
    </Paragraph>

    <Heading3>2. 根源：Integer 的缓存池（-128 ~ 127）</Heading3>
    <Paragraph>
      <InlineCode>Integer a = 127</InlineCode> 自动装箱调用的是 <InlineCode>Integer.valueOf(127)</InlineCode>。
      而 <InlineCode>valueOf</InlineCode> 内部有一个缓存：对 <Text bold>-128 ~ 127</Text> 之间的值，
      <Text bold>返回同一个缓存对象</Text>；超出这个范围才 <InlineCode>new</InlineCode> 新对象。
    </Paragraph>
    <CodeBlock
      language="text"
      title="Integer.valueOf 的简化逻辑"
      code={`public static Integer valueOf(int i) {
    if (i >= -128 && i <= 127) {     // 在缓存范围
        return IntegerCache.cache[i + 128];  // 返回缓存中同一个对象
    }
    return new Integer(i);            // 超范围，新建对象
}`}
    />
    <UnorderedList>
      <ListItem>
        <InlineCode>127</InlineCode> 在缓存范围 → <InlineCode>a</InlineCode> 和 <InlineCode>b</InlineCode>
        指向<Text bold>同一个缓存对象</Text> → <InlineCode>==</InlineCode>（比地址）为 <InlineCode>true</InlineCode>。
      </ListItem>
      <ListItem>
        <InlineCode>128</InlineCode> 超出缓存 → <InlineCode>c</InlineCode> 和 <InlineCode>d</InlineCode>
        是<Text bold>两个不同的新对象</Text> → <InlineCode>==</InlineCode> 为 <InlineCode>false</InlineCode>。
      </ListItem>
    </UnorderedList>
    <Callout type="note" title="为什么是这个范围">
      缓存小整数是为了<Text bold>性能优化</Text>——小整数使用极其频繁，复用同一对象能省内存、提速。
      默认范围是 <InlineCode>-128 ~ 127</InlineCode>（正好是一个 byte 的范围），上界可通过 JVM 参数调大。
    </Callout>

    <Heading3>3. 其它包装类的缓存情况</Heading3>
    <Table
      head={['包装类', '缓存范围', '说明']}
      rows={[
        ['Integer / Short / Long', '-128 ~ 127', '最常考的就是 Integer'],
        ['Byte', '全部（-128~127）', 'byte 范围本就在内，全部缓存'],
        ['Character', '0 ~ 127', 'ASCII 范围'],
        ['Boolean', 'TRUE / FALSE 两个', '全部缓存'],
        ['Float / Double', '无缓存', '浮点数不缓存，== 永远比地址'],
      ]}
    />

    <Heading3>4. == 的真正含义（再次强调）</Heading3>
    <Paragraph>
      关键要分清 <InlineCode>==</InlineCode> 在比什么：
    </Paragraph>
    <UnorderedList>
      <ListItem>两边都是<Text bold>基本类型</Text>（int 等）→ <InlineCode>==</InlineCode> 比<Text bold>数值</Text>，永远可靠。</ListItem>
      <ListItem>两边是<Text bold>包装类对象</Text>（Integer 等）→ <InlineCode>==</InlineCode> 比<Text bold>对象地址</Text>，受缓存影响，不可靠。</ListItem>
    </UnorderedList>
    <CodeBlock
      title="一个 int 一个 Integer 时会拆箱"
      code={`public class MixCompare {
    public static void main(String[] args) {
        Integer x = 1000;
        int y = 1000;
        // 一边是基本类型，== 会把 Integer 拆箱成 int 再比数值
        System.out.println("x == y ? " + (x == y));   // true！按数值比

        Integer m = 1000;
        Integer n = 1000;
        // 两边都是 Integer，比地址，超出缓存 -> false
        System.out.println("m == n ? " + (m == n));   // false
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`x == y ? true
m == n ? false`}
    />
    <Callout type="warning" title="混合比较会触发拆箱">
      只要 <InlineCode>==</InlineCode> 有一边是基本类型，另一边的包装类就会<Text bold>自动拆箱</Text>，
      变成数值比较（所以 <InlineCode>x == y</InlineCode> 是 true）。这又引出一个隐患：
      若包装类那边是 <InlineCode>null</InlineCode>，拆箱会 NPE。
    </Callout>

    <Heading3>5. 正确做法：用 equals 比较值</Heading3>
    <CodeBlock
      title="equals 永远按值比较"
      code={`public class UseEquals {
    public static void main(String[] args) {
        Integer a = 128;
        Integer b = 128;

        System.out.println("== :     " + (a == b));        // false（地址）
        System.out.println("equals : " + a.equals(b));      // true（值）

        Integer big1 = 999999;
        Integer big2 = 999999;
        System.out.println("大数 equals: " + big1.equals(big2));  // true
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`== :     false
equals : true
大数 equals: true`}
    />
    <Callout type="success" title="铁律">
      <Text bold>比较两个包装类对象的值，一律用 equals（或先拆箱成基本类型再用 ==）。
      绝不要直接用 == 比较两个包装类对象</Text>，否则会被缓存范围坑得莫名其妙。
      注意 equals 比较前要确保对象非 null。
    </Callout>

    <Heading3>6. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>Integer.valueOf</InlineCode> 对 <InlineCode>-128~127</InlineCode> 返回缓存对象，超出则 new 新对象。</ListItem>
        <ListItem>因此两个 <InlineCode>Integer</InlineCode>：127 时 <InlineCode>==</InlineCode> 为 true，128 时为 false。</ListItem>
        <ListItem><InlineCode>==</InlineCode>：基本类型比数值（可靠）；包装类对象比地址（受缓存影响，不可靠）。</ListItem>
        <ListItem>一边基本类型一边包装类，<InlineCode>==</InlineCode> 会拆箱按数值比（但 null 会 NPE）。</ListItem>
        <ListItem><Text bold>比较包装类的值一律用 equals</Text>，且先确保非 null。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：预测每个 == 的结果"
      code={`Integer a = 100, b = 100;
Integer c = 200, d = 200;
int e = 200;
Integer f = 200;

System.out.println(a == b);      // ①
System.out.println(c == d);      // ②
System.out.println(e == f);      // ③
System.out.println(c.equals(d)); // ④`}
      answerCode={`答案：
① true  —— 100 在缓存范围 -128~127，a、b 是同一缓存对象
② false —— 200 超出缓存，c、d 是两个不同对象，== 比地址
③ true  —— 一边是 int(e)，f 自动拆箱成 int 比数值，200==200
④ true  —— equals 按值比较，与缓存无关

解析：①②对比展示缓存边界效应；③说明混合比较会拆箱；④给出正确姿势 equals。`}
    />

    <CodeBlock
      qa
      title="练习2：修复一个真实 bug"
      code={`// 某登录校验：比较用户传来的 userId 和数据库查出的 id（都是 Integer）。
// 测试时小 id 正常，上线后大 id 用户却总登录失败，为什么？怎么修？

class Account {
    Integer id;
    Account(Integer id) { this.id = id; }
}

public class Login {
    static boolean check(Integer inputId, Account acc) {
        return inputId == acc.id;     // bug 在这
    }
    public static void main(String[] args) {
        System.out.println(check(100, new Account(100)));    // true
        System.out.println(check(100000, new Account(100000))); // false?!
    }
}`}
      answerCode={`// 原因：用 == 比较两个 Integer 对象，比的是地址。
// 小 id（-128~127）命中缓存恰好是同一对象，== 碰巧为 true；
// 大 id 超出缓存是不同对象，== 为 false，于是登录失败。
// 这种「小数据测试通过、大数据上线翻车」是极典型的缓存陷阱。

class Account {
    Integer id;
    Account(Integer id) { this.id = id; }
}

public class Login {
    static boolean check(Integer inputId, Account acc) {
        // 修复：用 equals 按值比较（注意防 null）
        return inputId != null && inputId.equals(acc.id);
    }
    public static void main(String[] args) {
        System.out.println(check(100, new Account(100)));
        System.out.println(check(100000, new Account(100000)));
    }
}

/* 控制台输出（修复后）：
true
true

解析：把 == 改成 equals 即可。这正是「比较包装类用 equals」铁律的现实意义——
      用 == 写的代码可能在小数据下「看起来是对的」，埋下上线才爆的雷。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：辨析综合题"
      code={`判断对错并说明：
① Double a = 1.0; Double b = 1.0; 则 a == b 为 true。
② 两边都是 int 时用 == 比较是安全的。
③ Integer x = null; int y = x; 能正常运行。
④ 要判断两个 Integer 值是否相等，最佳做法是 a.equals(b)。`}
      answerCode={`答案：
① 错。Double/Float 没有缓存，a、b 是不同对象，== 比地址为 false（应用 equals）。
② 对。基本类型 int 的 == 比较的是数值，永远可靠，不受缓存影响。
③ 错。x 为 null，赋给 int 触发拆箱 x.intValue()，对 null 调方法抛 NullPointerException。
④ 基本正确。a.equals(b) 按值比较不受缓存影响；更严谨是先确保 a 非 null（或用 Objects.equals(a, b) 同时防两边 null）。

解析：浮点包装类无缓存、基本类型 == 安全、null 拆箱会 NPE、值比较用 equals/Objects.equals——
      四条覆盖了包装类判等的全部要点。`}
    />
  </article>
);

export default index;
