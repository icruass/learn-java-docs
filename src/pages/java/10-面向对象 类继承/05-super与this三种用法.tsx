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
    <Title>super 与 this 三种用法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>super</InlineCode> 和 <InlineCode>this</InlineCode> 是 Java 中两个特殊的关键字，
        它们都可以引用对象，但引用的对象不同。
        <Text bold>this</Text> 引用<Text bold>本类（当前）对象</Text>，
        <Text bold>super</Text> 引用<Text bold>父类部分</Text>（本对象中从父类继承来的那部分）。
        两者各有三种用法：访问成员变量、调用成员方法、调用构造方法。
        本节通过对比表 + 综合示例，把六种用法一次性讲清。
      </Paragraph>
    </Callout>

    <Heading3>1. this 的三种用法</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>this.成员变量</Text>：访问本类的实例变量，通常用于区分同名的局部变量与成员变量。
      </ListItem>
      <ListItem>
        <Text bold>this.成员方法()</Text>：调用本类的实例方法（可省略 <InlineCode>this.</InlineCode>，但显式写出更清晰）。
      </ListItem>
      <ListItem>
        <Text bold>this(参数)</Text>：在本类的一个构造方法中调用本类的另一个构造方法，
        必须写在构造方法的<Text bold>第一行</Text>。
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="text"
      title="this 三种用法格式"
      code={`this.成员变量名              // 访问本类成员变量
this.成员方法名(参数)         // 调用本类成员方法
this(参数)                   // 调用本类的另一个构造方法（必须在构造方法第一行）`}
    />

    <Heading3>2. super 的三种用法</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>super.成员变量</Text>：访问父类中被子类同名变量遮蔽的成员变量。
      </ListItem>
      <ListItem>
        <Text bold>super.成员方法()</Text>：调用父类中被子类重写的成员方法，在重写方法内复用父类逻辑。
      </ListItem>
      <ListItem>
        <Text bold>super(参数)</Text>：在子类构造方法中调用父类的构造方法，
        必须写在子类构造方法的<Text bold>第一行</Text>。
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="text"
      title="super 三种用法格式"
      code={`super.成员变量名             // 访问父类成员变量
super.成员方法名(参数)        // 调用父类成员方法
super(参数)                  // 调用父类的构造方法（必须在子类构造方法第一行）`}
    />

    <Heading3>3. super 与 this 全面对比表</Heading3>
    <Table
      head={['用法类型', 'this 写法', 'this 含义', 'super 写法', 'super 含义']}
      rows={[
        [
          '访问成员变量',
          'this.name',
          '本类（子类）声明的实例变量 name',
          'super.name',
          '父类声明的实例变量 name',
        ],
        [
          '调用成员方法',
          'this.eat()',
          '调用本类的 eat() 方法（子类版本）',
          'super.eat()',
          '调用父类的 eat() 方法（跳过子类重写）',
        ],
        [
          '调用构造方法',
          'this(参数)',
          '调用本类的另一个构造方法',
          'super(参数)',
          '调用父类的构造方法',
        ],
        [
          '能否在普通方法中使用',
          '能',
          '—',
          '能',
          '—',
        ],
        [
          '调用构造时的位置要求',
          '必须在构造方法第一行',
          '—',
          '必须在构造方法第一行',
          '—',
        ],
        [
          '能否在 static 方法中使用',
          '不能',
          'this 代表对象，static 方法不属于对象',
          '不能',
          'super 依赖对象，static 方法不属于对象',
        ],
      ]}
    />

    <Heading3>4. 关键限制：super() 与 this() 不能同时出现</Heading3>
    <Callout type="danger" title="super(...) 和 this(...) 都必须在构造方法第一行，因此二者不能共存">
      <Paragraph>
        <InlineCode>super(参数)</InlineCode> 和 <InlineCode>this(参数)</InlineCode>
        都要求写在构造方法的<Text bold>第一行</Text>，而一个方法只有一个"第一行"，
        所以它们<Text bold>绝对不能在同一个构造方法中同时出现</Text>，否则编译报错。
      </Paragraph>
      <CodeBlock
        title="编译报错示例"
        code={`public class Cat extends Animal {
    String color;

    public Cat(String name, String color) {
        super(name);      // 第一行：调用父类构造
        this(color);      // 编译报错！this() 也要求在第一行，二者冲突
    }
}`}
      />
      <Paragraph>
        解决思路：把公共逻辑集中到其中一个构造方法中，其他构造用
        <InlineCode>this()</InlineCode> 委托过去，或者把父类初始化逻辑直接交给
        <InlineCode>super()</InlineCode>。
      </Paragraph>
    </Callout>
    <Callout type="tip" title="this() 的委托链">
      <InlineCode>this(参数)</InlineCode> 可以让构造方法之间形成委托链：
      无参构造 → 调用有参构造，有参构造 → 调用 super(参数)。
      这样每种情况最终都经过同一套父类初始化路径，既能保证 super 被调用，
      又能提供多种构造方式，避免重复代码。
    </Callout>

    <Heading3>5. 综合示例：Animal / Cat 完整演示六种用法</Heading3>
    <Heading4>示例 1：this 三种用法</Heading4>
    <CodeBlock
      title="Employee.java（演示 this 三种用法）"
      code={`public class Employee {
    String name;
    double salary;

    // this(...) 用法：无参构造委托给有参构造
    public Employee() {
        this("无名员工", 3000.0);   // 调用下面的有参构造，必须第一行
        System.out.println("Employee 无参构造完成");
    }

    // 有参构造
    public Employee(String name, double salary) {
        this.name   = name;      // this.成员变量：区分同名局部变量
        this.salary = salary;
        System.out.println("Employee 有参构造：" + name + ", " + salary);
    }

    public void introduce() {
        System.out.println("姓名：" + this.name + "，薪资：" + this.salary);
        this.printSeparator();    // this.方法()：调用本类方法
    }

    public void printSeparator() {
        System.out.println("----------");
    }
}`}
    />
    <CodeBlock
      title="ThisDemo.java"
      code={`public class ThisDemo {
    public static void main(String[] args) {
        System.out.println("=== 无参构造（委托给有参）===");
        Employee e1 = new Employee();
        e1.introduce();

        System.out.println();
        System.out.println("=== 有参构造 ===");
        Employee e2 = new Employee("张三", 8000.0);
        e2.introduce();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`=== 无参构造（委托给有参）===
Employee 有参构造：无名员工, 3000.0
Employee 无参构造完成
姓名：无名员工，薪资：3000.0
----------

=== 有参构造 ===
Employee 有参构造：张三, 8000.0
姓名：张三，薪资：8000.0
----------`} />
    <Paragraph>
      注意无参构造的执行顺序：先执行 <InlineCode>this(...)</InlineCode>（跳到有参构造执行），
      有参构造执行完毕回到无参构造，再执行 <InlineCode>this()</InlineCode> 之后的语句。
    </Paragraph>

    <Heading4>示例 2：super 三种用法综合演示</Heading4>
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    String name;

    public Animal(String name) {
        this.name = name;
        System.out.println("Animal 构造：" + name);
    }

    public void eat() {
        System.out.println(name + " 在吃东西（父类版本）");
    }
}`}
    />
    <CodeBlock
      title="Cat.java（演示 super 三种用法）"
      code={`public class Cat extends Animal {
    String name;      // 子类同名变量，遮蔽父类 name
    String color;

    // super(参数) 用法：调用父类有参构造
    public Cat(String parentName, String selfName, String color) {
        super(parentName);         // super(参数)：调用父类构造，必须第一行
        this.name  = selfName;     // 初始化子类的 name
        this.color = color;
        System.out.println("Cat 构造：selfName=" + selfName + ", color=" + color);
    }

    @Override
    public void eat() {
        super.eat();               // super.方法()：调用父类被重写的 eat()
        System.out.println(name + " 还爱吃小鱼干（子类追加）");
    }

    public void showNames() {
        System.out.println("子类 name = " + this.name);    // this.成员变量
        System.out.println("父类 name = " + super.name);   // super.成员变量
    }
}`}
    />
    <CodeBlock
      title="SuperDemo.java"
      code={`public class SuperDemo {
    public static void main(String[] args) {
        Cat cat = new Cat("动物小花", "猫小花", "橘色");
        System.out.println();

        cat.showNames();    // 演示 super.变量 vs this.变量
        System.out.println();

        cat.eat();          // 演示 super.方法() 在重写中的使用
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`Animal 构造：动物小花
Cat 构造：selfName=猫小花, color=橘色

子类 name = 猫小花
父类 name = 动物小花

动物小花 在吃东西（父类版本）
猫小花 还爱吃小鱼干（子类追加）`} />
    <Paragraph>
      三种 super 用法一次呈现：
      <InlineCode>super(parentName)</InlineCode> 初始化父类属性；
      <InlineCode>super.name</InlineCode> 访问被子类变量遮蔽的父类 name；
      <InlineCode>super.eat()</InlineCode> 在重写方法内复用父类逻辑。
    </Paragraph>

    <Heading4>示例 3：this() 委托链 + super() 的完整构造体系</Heading4>
    <CodeBlock
      title="Teacher.java（this() 委托 + super() 链）"
      code={`public class Teacher extends Employee {
    String subject;

    // 主构造（有参），包含所有参数
    public Teacher(String name, double salary, String subject) {
        super(name, salary);       // 调用父类有参构造，必须第一行
        this.subject = subject;
        System.out.println("Teacher 主构造：subject=" + subject);
    }

    // 便利构造 1：默认薪资 6000
    public Teacher(String name, String subject) {
        this(name, 6000.0, subject);   // 委托给主构造，必须第一行
        System.out.println("Teacher 便利构造 1 完成");
    }

    // 便利构造 2：默认姓名+薪资
    public Teacher() {
        this("新教师", 5000.0, "未定科目");  // 委托给主构造，必须第一行
        System.out.println("Teacher 便利构造 2 完成");
    }

    @Override
    public void work() {
        super.work();
        System.out.println(name + " 正在备课（科目：" + subject + "）");
    }
}`}
    />
    <CodeBlock
      title="ChainDemo.java"
      code={`public class ChainDemo {
    public static void main(String[] args) {
        System.out.println("=== 便利构造 2（无参）===");
        Teacher t1 = new Teacher();
        t1.work();

        System.out.println();
        System.out.println("=== 便利构造 1（name+subject）===");
        Teacher t2 = new Teacher("李老师", "物理");
        t2.work();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`=== 便利构造 2（无参）===
Employee 有参构造：新教师, 5000.0
Teacher 主构造：subject=未定科目
Teacher 便利构造 2 完成
新教师 正在处理日常事务
新教师 正在备课（科目：未定科目）

=== 便利构造 1（name+subject）===
Employee 有参构造：李老师, 6000.0
Teacher 主构造：subject=物理
Teacher 便利构造 1 完成
李老师 正在处理日常事务
李老师 正在备课（科目：物理）`} />
    <Paragraph>
      委托链的执行路径：<InlineCode>Teacher()</InlineCode> →
      <InlineCode>this("新教师", 5000.0, "未定科目")</InlineCode> →
      <InlineCode>super(name, salary)</InlineCode> → Employee 有参构造。
      整条链最终都通过 <InlineCode>super()</InlineCode> 到达父类，保证父类被正确初始化。
    </Paragraph>

    <Heading3>6. 六种用法速查汇总</Heading3>
    <Table
      head={['关键字', '用法', '格式', '位置限制', '典型场景']}
      rows={[
        ['this', '访问本类成员变量', 'this.name', '无', '区分同名局部变量与成员变量'],
        ['this', '调用本类成员方法', 'this.eat()', '无', '显式标明调用本类方法，增加可读性'],
        ['this', '调用本类其他构造', 'this(参数)', '构造方法第一行', '构造委托，减少重复初始化代码'],
        ['super', '访问父类成员变量', 'super.name', '无', '父子类有同名变量时访问父类的'],
        ['super', '调用父类成员方法', 'super.eat()', '无', '重写方法内复用父类逻辑'],
        ['super', '调用父类构造方法', 'super(参数)', '构造方法第一行', '子类构造初始化父类属性'],
      ]}
    />
    <Callout type="danger" title="this(...) 与 super(...) 不能同时出现在同一构造方法中">
      两者都要求在构造方法第一行，同一构造方法只能选其一。
      需要两者都用时，用 <InlineCode>this()</InlineCode> 委托给另一个构造方法，
      让那个构造方法去调用 <InlineCode>super()</InlineCode>。
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：预测 super / this 混合使用时的输出"
      code={`// 预测下面代码的输出

class Base {
    String msg = "Base-msg";
    public void greet() {
        System.out.println("Base greet: " + msg);
    }
}

class Sub extends Base {
    String msg = "Sub-msg";

    public Sub() {
        this("hello");   // 委托给有参构造
        System.out.println("Sub 无参构造完成");
    }

    public Sub(String tag) {
        super();         // 调用父类无参构造（可省略，但写出来更清晰）
        System.out.println("Sub 有参构造：tag=" + tag);
    }

    @Override
    public void greet() {
        super.greet();
        System.out.println("Sub greet: " + this.msg + " / super.msg=" + super.msg);
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Sub s = new Sub();
        s.greet();
    }
}`}
      answerCode={`// 控制台输出：
// Sub 有参构造：tag=hello
// Sub 无参构造完成
// Base greet: Base-msg
// Sub greet: Sub-msg / super.msg=Base-msg

/* 逐步解析：
   1. new Sub() 触发无参构造；
   2. 无参构造第一行 this("hello") 跳到有参构造 Sub(String tag)；
   3. 有参构造第一行 super() 调用父类 Base 的无参构造（无打印）；
   4. 有参构造打印"Sub 有参构造：tag=hello"；
   5. 回到无参构造，打印"Sub 无参构造完成"；
   6. s.greet() 走 Sub 重写的版本：
      - super.greet() 执行父类 greet()，打印"Base greet: Base-msg"
        （父类方法里的 msg 访问的是父类自己的 Base-msg）
      - 打印"Sub greet: Sub-msg / super.msg=Base-msg"
        （this.msg 是子类的，super.msg 是父类的）
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：用 this() 委托构造 + super() 完成 Teacher 类"
      code={`// 要求：在 Employee / Teacher 体系中：
// Employee 有有参构造 Employee(String name, double salary)
// Teacher 需要提供三个构造：
//   1. Teacher(String name, double salary, String subject)：主构造，调用 super(name, salary)
//   2. Teacher(String name, String subject)：薪资默认 7000，委托给构造 1
//   3. Teacher()：name="新老师", salary=5000, subject="待定"，委托给构造 1
// 验证：new Teacher() 创建对象后打印 name / salary / subject

class Employee {
    String name;
    double salary;
    public Employee(String name, double salary) {
        this.name   = name;
        this.salary = salary;
    }
}

class Teacher extends Employee {
    String subject;
    // 补全三个构造方法
}

public class Exercise02 {
    public static void main(String[] args) {
        Teacher t = new Teacher();
        System.out.println(t.name + " / " + t.salary + " / " + t.subject);
    }
}`}
      answerCode={`class Employee {
    String name;
    double salary;
    public Employee(String name, double salary) {
        this.name   = name;
        this.salary = salary;
    }
}

class Teacher extends Employee {
    String subject;

    // 主构造
    public Teacher(String name, double salary, String subject) {
        super(name, salary);     // 初始化父类部分
        this.subject = subject;
    }

    // 便利构造 1
    public Teacher(String name, String subject) {
        this(name, 7000.0, subject);   // 委托给主构造
    }

    // 便利构造 2（无参）
    public Teacher() {
        this("新老师", 5000.0, "待定");  // 委托给主构造
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        Teacher t = new Teacher();
        System.out.println(t.name + " / " + t.salary + " / " + t.subject);
    }
}

/* 控制台输出：
新老师 / 5000.0 / 待定

解析：委托链：Teacher() -> this("新老师",5000.0,"待定") -> 主构造 -> super(name,salary)
      每种构造方式最终都经过主构造，只有一处真正调用 super()，代码不重复。
      注意：this() 和 super() 不能同时出现在同一构造方法里——
      这里便利构造用 this() 委托，super() 只在主构造里调用，完美规避冲突。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：找出代码中 super / this 的错误并修正"
      code={`// 下面代码有两处错误，请找出并修正

class Animal {
    String name;
    public Animal(String name) {
        this.name = name;
    }
}

class Dog extends Animal {
    String breed;

    public Dog(String breed) {
        this.breed = breed;   // 错误 A
        super(breed);
    }

    public Dog(String name, String breed) {
        super(name);
        this("unknown");      // 错误 B
        this.breed = breed;
    }
}
// 请指出两处错误的原因，并给出正确代码`}
      answerCode={`// 错误 A：super(breed) 不在构造方法第一行
//   super(...) 必须是构造方法第一条语句，
//   前面写了 this.breed = breed 导致编译报错。

// 错误 B：this() 不在构造方法第一行（super() 已占据第一行位置）
//   super(...) 和 this(...) 都要求在第一行，不能同时出现在同一构造方法里。

// 修正后的代码：
class Animal {
    String name;
    public Animal(String name) {
        this.name = name;
    }
}

class Dog extends Animal {
    String breed;

    // 修正 A：super 放第一行
    public Dog(String breed) {
        super("未知动物");    // 第一行调用父类构造（用默认名）
        this.breed = breed;
    }

    // 修正 B：去掉 this()，直接赋值（super 已在第一行，不能再有 this()）
    public Dog(String name, String breed) {
        super(name);         // 第一行调用父类构造
        this.breed = breed;  // 普通赋值语句
    }
}

/* 总结两条铁律：
   1. super(...) 必须是构造方法的第一条语句
   2. this(...) 也必须是构造方法的第一条语句
   两条规则叠加的结论：super(...) 与 this(...) 不能同时出现在同一个构造方法里
*/`}
    />
  </article>
);

export default index;
