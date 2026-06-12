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
    <Title>Object 类与 equals / hashCode</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>Object</InlineCode> 是 Java 中<Text bold>所有类的「祖先」</Text>——任何类
        （哪怕你没写 <InlineCode>extends</InlineCode>）都默认继承自它。理解 <InlineCode>Object</InlineCode>
        提供的几个方法，是写出正确类的前提。本节讲透最常被重写的三个方法：
        <InlineCode>toString()</InlineCode>、<InlineCode>equals()</InlineCode>、
        <InlineCode>hashCode()</InlineCode>，重点剖析<Text bold>为什么重写 equals 必须同时重写 hashCode</Text>
        ——这是集合（HashSet / HashMap）正确工作的基石。
      </Paragraph>
    </Callout>

    <Heading3>1. Object：万类之父</Heading3>
    <Paragraph>
      下面两种写法完全等价——不写 <InlineCode>extends</InlineCode> 时，编译器自动让你继承
      <InlineCode>Object</InlineCode>：
    </Paragraph>
    <CodeBlock
      title="所有类都隐式继承 Object"
      code={`class Student { }
// 等价于
class Student extends Object { }`}
    />
    <Paragraph>
      因此任何对象都能调用 <InlineCode>Object</InlineCode> 的方法。常用的有：
    </Paragraph>
    <Table
      head={['方法', '默认行为', '是否常重写']}
      rows={[
        ['toString()', '返回 "类名@十六进制哈希码"', '常重写（输出可读信息）'],
        ['equals(Object o)', '比较两个引用是否指向同一对象（== 地址）', '常重写（改为按内容比较）'],
        ['hashCode()', '返回对象的哈希码（默认与地址相关）', '常重写（与 equals 保持一致）'],
        ['getClass()', '返回运行时的 Class 对象', '不重写（final 方法）'],
        ['clone()', '克隆对象', '偶尔重写'],
      ]}
    />

    <Heading3>2. toString()：默认输出毫无可读性</Heading3>
    <CodeBlock
      title="不重写 toString 的窘境"
      code={`class Student {
    String name;
    int age;
    Student(String name, int age) { this.name = name; this.age = age; }
}

public class ToStringDemo {
    public static void main(String[] args) {
        Student s = new Student("张三", 20);
        System.out.println(s);              // 默认调用 toString
        System.out.println(s.toString());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（哈希码部分每次运行不同）"
      code={`Student@1b6d3586
Student@1b6d3586`}
    />
    <Paragraph>
      默认 <InlineCode>toString</InlineCode> 只输出「类名@哈希码」，看不到对象内容。重写后即可输出有意义的信息：
    </Paragraph>
    <CodeBlock
      title="重写 toString"
      code={`class Student {
    String name;
    int age;
    Student(String name, int age) { this.name = name; this.age = age; }

    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + "}";
    }
}

public class ToStringOverride {
    public static void main(String[] args) {
        System.out.println(new Student("张三", 20));
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`Student{name='张三', age=20}`} />
    <Callout type="tip" title="System.out.println 会自动调用 toString">
      打印对象、字符串拼接对象时，都会自动调用其 <InlineCode>toString()</InlineCode>。
      IDE 通常能一键生成 <InlineCode>toString</InlineCode>（IDEA: Alt+Insert → toString）。
    </Callout>

    <Heading3>3. equals()：默认比地址，常需改为比内容</Heading3>
    <Paragraph>
      <InlineCode>Object.equals</InlineCode> 的默认实现就是 <InlineCode>==</InlineCode>，比较两个引用是否是同一个对象。
      但业务上我们往往认为「<Text bold>属性都相同就算相等</Text>」，这就需要重写：
    </Paragraph>
    <CodeBlock
      title="不重写 equals：两个内容相同的对象也不相等"
      code={`class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
}

public class EqualsDefault {
    public static void main(String[] args) {
        Point a = new Point(1, 2);
        Point b = new Point(1, 2);
        System.out.println(a == b);        // false：不同对象
        System.out.println(a.equals(b));    // false：默认 equals 等于 ==
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`false
false`} />
    <Paragraph>
      重写 <InlineCode>equals</InlineCode> 的标准模板（务必遵循这套判断顺序）：
    </Paragraph>
    <CodeBlock
      title="equals 标准写法"
      code={`@Override
public boolean equals(Object o) {
    if (this == o) return true;             // 1. 同一对象，直接 true
    if (o == null || getClass() != o.getClass()) return false; // 2. 类型不符
    Point p = (Point) o;                    // 3. 向下转型
    return x == p.x && y == p.y;            // 4. 逐个比较关键字段
}`}
    />
    <Callout type="warning" title="equals 的五个约定（自反、对称、传递、一致、非空）">
      重写 <InlineCode>equals</InlineCode> 必须满足：自反性（<InlineCode>a.equals(a)</InlineCode> 为 true）、
      对称性（<InlineCode>a.equals(b)</InlineCode> 与 <InlineCode>b.equals(a)</InlineCode> 结果相同）、
      传递性、一致性，以及 <InlineCode>a.equals(null)</InlineCode> 恒为 false。
      用上面的标准模板就能自动满足这些约定。
    </Callout>

    <Heading3>4. 核心规则：重写 equals 必须重写 hashCode</Heading3>
    <Paragraph>
      <InlineCode>hashCode()</InlineCode> 返回一个 int 哈希码，<InlineCode>HashSet</InlineCode>、
      <InlineCode>HashMap</InlineCode> 用它来快速定位元素。Java 规定了
      <Text bold>equals 与 hashCode 的契约</Text>：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>两个对象 equals 相等，则它们的 hashCode 必须相等。</Text>
      </ListItem>
      <ListItem>
        两个对象 hashCode 相等，equals 不一定相等（允许哈希冲突）。
      </ListItem>
    </OrderedList>
    <Callout type="danger" title="只重写 equals 不重写 hashCode 会出大问题">
      如果只重写 <InlineCode>equals</InlineCode>，两个「内容相等」的对象 <InlineCode>equals</InlineCode> 为 true，
      但 <InlineCode>hashCode</InlineCode> 仍是默认的（基于地址，各不相同）。放进
      <InlineCode>HashSet</InlineCode> 时，它们会被分到不同的「桶」里，导致<Text bold>去重失效、查不到、删不掉</Text>——
      这是集合中最隐蔽的 bug 之一。
    </Callout>
    <CodeBlock
      title="反面案例：只重写 equals 导致 HashSet 去重失败"
      code={`import java.util.HashSet;
import java.util.Set;

class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }
    // 故意不重写 hashCode！
}

public class BrokenHashSet {
    public static void main(String[] args) {
        Set<Point> set = new HashSet<>();
        set.add(new Point(1, 2));
        set.add(new Point(1, 2));   // 内容相同，本应被去重
        System.out.println("元素个数: " + set.size());
        System.out.println("能否查到: " + set.contains(new Point(1, 2)));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（错误结果）"
      code={`元素个数: 2
能否查到: false`}
    />
    <Paragraph>
      两个相同的点没被去重（size=2），连查都查不到——正是因为没重写 <InlineCode>hashCode</InlineCode>。
    </Paragraph>

    <Heading3>5. 正确做法：equals 与 hashCode 成对重写</Heading3>
    <Paragraph>
      用 <InlineCode>java.util.Objects</InlineCode> 工具类可以一行生成，简洁又安全：
    </Paragraph>
    <CodeBlock
      title="标准的成对重写"
      code={`import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);   // 用相同的关键字段生成哈希码
    }

    @Override
    public String toString() { return "(" + x + "," + y + ")"; }
}

public class CorrectHashSet {
    public static void main(String[] args) {
        Set<Point> set = new HashSet<>();
        set.add(new Point(1, 2));
        set.add(new Point(1, 2));   // 正确去重
        System.out.println("元素个数: " + set.size());
        System.out.println("能否查到: " + set.contains(new Point(1, 2)));
        System.out.println("集合内容: " + set);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（正确结果）"
      code={`元素个数: 1
能否查到: true
集合内容: [(1,2)]`}
    />
    <Callout type="tip" title="务必用相同的字段">
      <InlineCode>equals</InlineCode> 比较了哪些字段，<InlineCode>hashCode</InlineCode> 就应该用哪些字段
      （上例都是 x、y）。IDE 可一键同时生成二者（IDEA: Alt+Insert → equals() and hashCode()），
      强烈建议用 IDE 生成而非手写。
    </Callout>

    <Heading3>6. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>Object</InlineCode> 是所有类的父类，提供 <InlineCode>toString/equals/hashCode</InlineCode> 等通用方法。</ListItem>
        <ListItem><InlineCode>toString</InlineCode> 默认输出「类名@哈希码」，重写后可输出可读内容。</ListItem>
        <ListItem><InlineCode>equals</InlineCode> 默认比地址（等于 ==），按内容比较需用标准模板重写。</ListItem>
        <ListItem><Text bold>重写 equals 必须同时重写 hashCode</Text>，否则 HashSet/HashMap 去重、查找全部失效。</ListItem>
        <ListItem>用 <InlineCode>Objects.hash(...)</InlineCode> 生成 hashCode，且字段要与 equals 一致；推荐 IDE 一键生成。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：判断对错"
      code={`① 任何类不写 extends 也是 Object 的子类。
② 重写了 equals 就能保证 HashSet 正确去重。
③ 两个对象 hashCode 相同，它们一定 equals 相等。
④ a.equals(b) 为 true，则 a.hashCode() 必须等于 b.hashCode()。`}
      answerCode={`答案：
① 对。所有类默认隐式继承 Object。
② 错。还必须同时重写 hashCode，否则对象被分到不同桶，去重/查找失效。
③ 错。hashCode 相同只代表落在同一个桶（可能是哈希冲突），是否相等仍由 equals 决定。
④ 对。这正是 equals-hashCode 契约的第一条：相等的对象哈希码必须相等。

解析：契约是「equals 相等 ⇒ hashCode 相等」，反之不成立。这是 HashSet/HashMap 工作的前提。`}
    />

    <CodeBlock
      qa
      title="练习2：为 Student 正确重写三个方法"
      code={`// 要求：Student 按「学号 id + 姓名 name」判定相等，
// 重写 equals、hashCode、toString，并验证 HashSet 去重。
// 数据：两个 (1001,"张三") 应被视为同一人。
// 预期：size = 1

import java.util.*;

class Student {
    int id;
    String name;
    Student(int id, String name) { this.id = id; this.name = name; }
    // 补全 equals / hashCode / toString
}

public class StudentEquals {
    public static void main(String[] args) {
        Set<Student> set = new HashSet<>();
        set.add(new Student(1001, "张三"));
        set.add(new Student(1001, "张三"));
        System.out.println("size = " + set.size());
        System.out.println(set);
    }
}`}
      answerCode={`import java.util.*;

class Student {
    int id;
    String name;
    Student(int id, String name) { this.id = id; this.name = name; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student s = (Student) o;
        return id == s.id && Objects.equals(name, s.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "Student{id=" + id + ", name='" + name + "'}";
    }
}

public class StudentEquals {
    public static void main(String[] args) {
        Set<Student> set = new HashSet<>();
        set.add(new Student(1001, "张三"));
        set.add(new Student(1001, "张三"));
        System.out.println("size = " + set.size());
        System.out.println(set);
    }
}

/* 控制台输出：
size = 1
[Student{id=1001, name='张三'}]

解析：equals 比较 id 和 name；hashCode 用相同的 id、name 生成。
      注意 name 是引用类型，用 Objects.equals 比较可避免 name 为 null 时的空指针。
      两者字段一致，HashSet 才能正确去重。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：找出 bug"
      code={`// 下面的 Money 类放进 HashMap 当 key 时，明明 put 进去了，却 get 不到，为什么？
// 请指出问题并修复。

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

class Money {
    int yuan;
    Money(int yuan) { this.yuan = yuan; }

    @Override
    public int hashCode() { return Objects.hash(yuan); }
    // 注意：重写了 hashCode，但没重写 equals
}

public class MoneyKey {
    public static void main(String[] args) {
        Map<Money, String> map = new HashMap<>();
        map.put(new Money(100), "一百元");
        System.out.println(map.get(new Money(100)));  // 输出 null？
    }
}`}
      answerCode={`// 问题：只重写了 hashCode，没重写 equals。
// HashMap 定位 key 的流程是：先用 hashCode 找到桶，再用 equals 在桶内逐个比对。
// 两个 Money(100) 的 hashCode 相同（找到同一个桶），但 equals 用的是默认的「比地址」，
// 不同对象地址不同 → equals 为 false → 认为不是同一个 key → 返回 null。

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

class Money {
    int yuan;
    Money(int yuan) { this.yuan = yuan; }

    @Override
    public boolean equals(Object o) {              // 补上 equals
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return yuan == ((Money) o).yuan;
    }

    @Override
    public int hashCode() { return Objects.hash(yuan); }
}

public class MoneyKey {
    public static void main(String[] args) {
        Map<Money, String> map = new HashMap<>();
        map.put(new Money(100), "一百元");
        System.out.println(map.get(new Money(100)));
    }
}

/* 控制台输出：
一百元

解析：equals 和 hashCode 必须「成对出现」。只重写一个都会让 HashMap/HashSet 行为异常：
      只重写 equals → 落不到同一个桶；只重写 hashCode → 落到同桶但 equals 不通过。
      两者都重写且字段一致，才能正确作为 key 使用。
*/`}
    />
  </article>
);

export default index;
