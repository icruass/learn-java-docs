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
    <Title>封装与 private</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        面向对象的三大特性之一是<Text bold>封装（Encapsulation）</Text>。
        封装的核心思想是：将对象的内部状态（成员变量）隐藏起来，只对外暴露经过控制的访问接口。
        本节讲清为什么需要封装、<InlineCode>private</InlineCode> 关键字的作用，
        以及配套的 <InlineCode>getXxx()</InlineCode> / <InlineCode>setXxx()</InlineCode> 方法该怎么写，
        并演示在 setter 里加合法性校验，从根本上杜绝非法数据进入对象。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要封装</Heading3>
    <Paragraph>
      假设我们有一个 <InlineCode>Student</InlineCode> 类，里面有 <InlineCode>age</InlineCode> 字段。
      如果成员变量是公开的（<InlineCode>public</InlineCode>），任何地方都可以直接给它赋值：
    </Paragraph>
    <CodeBlock
      title="问题演示（无封装）"
      code={`Student s = new Student();
s.age = -20;   // 完全合法，编译不报错，但年龄为负数是非法数据！
s.age = 999;   // 同样合法，完全失控`}
    />
    <Paragraph>
      这样的代码在语法上没有问题，但年龄为负数、超过合理范围的数据会悄悄进入对象，
      导致程序运行结果不可预测，而且编译器和运行时都无法感知。
    </Paragraph>
    <Paragraph>
      封装就是为了解决这个问题：<Text bold>把成员变量藏起来，只通过受控的方法去读写</Text>，
      在方法里就可以加各种校验逻辑，把非法数据拒之门外。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>安全性</Text>：防止外部代码随意修改内部状态，杜绝非法数据。
      </ListItem>
      <ListItem>
        <Text bold>灵活性</Text>：内部实现细节可以自由修改，只要对外接口不变，调用方不受影响。
      </ListItem>
      <ListItem>
        <Text bold>可维护性</Text>：数据的读写逻辑集中在 getter/setter 里，修改校验规则只需改一处。
      </ListItem>
    </UnorderedList>

    <Heading3>2. private 关键字</Heading3>
    <Paragraph>
      <InlineCode>private</InlineCode> 是 Java 中访问权限最严格的修饰符，被它修饰的成员只能在
      <Text bold>本类内部</Text>访问，类的外部（包括同一个包中的其他类）都无法直接访问。
    </Paragraph>
    <Table
      head={['修饰符', '同一类', '同一包', '子类', '任意位置']}
      rows={[
        ['private', '可以', '不可以', '不可以', '不可以'],
        ['（默认，不写）', '可以', '可以', '不可以', '不可以'],
        ['protected', '可以', '可以', '可以', '不可以'],
        ['public', '可以', '可以', '可以', '可以'],
      ]}
    />
    <Callout type="tip" title="入门阶段记住一条原则">
      成员变量统一用 <InlineCode>private</InlineCode> 修饰，对外提供的方法用
      <InlineCode>public</InlineCode> 修饰。这是 Java 开发的标准实践。
    </Callout>

    <Heading3>3. getter 与 setter 方法</Heading3>
    <Paragraph>
      成员变量私有化后，外部代码无法直接访问，需要通过<Text bold>公共的访问方法</Text>来间接读写：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>getter（获取方法）</Text>：命名规则为 <InlineCode>get + 字段名（首字母大写）</InlineCode>，
        无参数，返回值类型与字段类型相同，方法体直接 return 字段值。
      </ListItem>
      <ListItem>
        <Text bold>setter（设置方法）</Text>：命名规则为 <InlineCode>set + 字段名（首字母大写）</InlineCode>，
        参数类型与字段类型相同，返回值类型为 <InlineCode>void</InlineCode>，
        方法体中可以加合法性校验，通过校验后再赋值。
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="text"
      title="getter / setter 格式"
      code={`// getter 格式
public 字段类型 getXxx() {
    return xxx;
}

// setter 格式（可含校验逻辑）
public void setXxx(字段类型 xxx) {
    // 可选：合法性校验
    this.xxx = xxx;
}`}
    />
    <Callout type="warning" title="boolean 类型的 getter 命名特殊">
      对于 <InlineCode>boolean</InlineCode> 类型的字段，getter 通常命名为
      <InlineCode>isXxx()</InlineCode> 而不是 <InlineCode>getXxx()</InlineCode>。
      例如字段 <InlineCode>active</InlineCode> 对应的 getter 是 <InlineCode>isActive()</InlineCode>。
    </Callout>

    <Heading3>4. 完整封装示例</Heading3>
    <Heading4>示例 1：基础封装</Heading4>
    <Paragraph>
      定义一个 <InlineCode>Student</InlineCode> 类，将 <InlineCode>name</InlineCode> 和
      <InlineCode>age</InlineCode> 私有化，提供 getter/setter，并在 <InlineCode>setAge()</InlineCode>
      中加入年龄合法性校验（0 ~ 150 之间）。
    </Paragraph>
    <CodeBlock
      title="Student.java"
      code={`public class Student {

    // 成员变量全部私有化，外部无法直接访问
    private String name;
    private int age;

    // name 的 getter
    public String getName() {
        return name;
    }

    // name 的 setter（name 一般不需要校验，直接赋值）
    public void setName(String name) {
        this.name = name;
    }

    // age 的 getter
    public int getAge() {
        return age;
    }

    // age 的 setter：加入合法性校验，拒绝非法年龄
    public void setAge(int age) {
        if (age < 0 || age > 150) {
            System.out.println("年龄不合法：" + age + "，赋值失败！");
            return;  // 直接返回，不执行赋值
        }
        this.age = age;
    }

    // 展示学生信息（辅助方法）
    public void show() {
        System.out.println("姓名：" + name + "，年龄：" + age);
    }
}`}
    />
    <CodeBlock
      title="StudentTest.java"
      code={`public class StudentTest {
    public static void main(String[] args) {
        Student s = new Student();

        // 通过 setter 赋值
        s.setName("张三");
        s.setAge(20);
        s.show();

        // 尝试赋非法年龄
        s.setAge(-5);
        s.show();  // age 保持原值 20，非法赋值被拦截

        // 通过 getter 读取字段值
        System.out.println("姓名是：" + s.getName());
        System.out.println("年龄是：" + s.getAge());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`姓名：张三，年龄：20
年龄不合法：-5，赋值失败！
姓名：张三，年龄：20
姓名是：张三
年龄是：20`}
    />
    <Paragraph>
      当调用 <InlineCode>setAge(-5)</InlineCode> 时，setter 内部校验发现 -5 不在合法范围内，
      打印提示信息后直接 <InlineCode>return</InlineCode>，<InlineCode>this.age = age</InlineCode>
      这行代码根本不会执行，所以 <InlineCode>age</InlineCode> 仍然保持之前的值 20。
    </Paragraph>

    <Heading4>示例 2：直接访问 private 字段会报编译错误</Heading4>
    <Paragraph>
      如果在类外部直接访问 <InlineCode>private</InlineCode> 修饰的字段，编译器会立刻报错，
      从语言层面彻底封堵非法访问的入口。
    </Paragraph>
    <CodeBlock
      title="编译错误演示（仅供理解，不可运行）"
      code={`Student s = new Student();
s.name = "李四";   // 编译错误：name has private access in Student
s.age  = -20;     // 编译错误：age has private access in Student`}
    />
    <Callout type="danger" title="private 字段在类外部直接赋值会编译报错">
      一旦字段被 <InlineCode>private</InlineCode> 修饰，外部代码试图通过
      <InlineCode>对象.字段名</InlineCode> 直接读写，IDE 会立即标红，编译也会失败。
      这正是封装的意义所在——从语法层面强制要求所有外部访问都走受控的方法。
    </Callout>

    <Heading4>示例 3：setter 中多条件校验</Heading4>
    <Paragraph>
      setter 的校验逻辑可以任意复杂。下面演示对 <InlineCode>score</InlineCode>（成绩）字段加 0~100 范围校验：
    </Paragraph>
    <CodeBlock
      title="ScoreBean.java"
      code={`public class ScoreBean {

    private String subject;  // 科目名称
    private double score;    // 成绩，合法范围 0.0 ~ 100.0

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        if (score < 0.0 || score > 100.0) {
            System.out.println("成绩 " + score + " 超出范围 [0, 100]，忽略本次赋值。");
            return;
        }
        this.score = score;
    }

    public void show() {
        System.out.println(subject + " 成绩：" + score);
    }
}

// 测试代码（写在 main 方法中）
// ScoreBean sb = new ScoreBean();
// sb.setSubject("数学");
// sb.setScore(95.5);
// sb.show();
// sb.setScore(110);   // 非法，被拦截
// sb.show();          // 仍然是 95.5`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`数学 成绩：95.5
成绩 110.0 超出范围 [0, 100]，忽略本次赋值。
数学 成绩：95.5`}
    />

    <Heading3>5. 封装思想总结</Heading3>
    <Callout type="success" title="封装三步走">
      <UnorderedList>
        <ListItem>
          第一步：用 <InlineCode>private</InlineCode> 修饰所有成员变量，隐藏内部细节。
        </ListItem>
        <ListItem>
          第二步：为每个字段提供 <InlineCode>public</InlineCode> 的 getter（只读）和 setter（只写）。
        </ListItem>
        <ListItem>
          第三步：在 setter 中加入合法性校验，把好数据入口关。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：封装 Person 类"
      code={`// 要求：
// 1. 定义 Person 类，私有字段：name(String)、age(int)。
// 2. 提供 getter 和 setter。
// 3. setAge() 中校验年龄必须在 1~120 之间，非法则打印提示并不赋值。
// 4. 提供 show() 方法打印姓名和年龄。
// 5. 在 main 中创建对象，分别测试合法和非法年龄。

public class Person {
    // 在这里补全代码
}

public class PersonTest {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Person {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age < 1 || age > 120) {
            System.out.println("年龄 " + age + " 不合法，赋值失败！");
            return;
        }
        this.age = age;
    }

    public void show() {
        System.out.println("姓名：" + name + "，年龄：" + age);
    }
}

public class PersonTest {
    public static void main(String[] args) {
        Person p = new Person();
        p.setName("王五");
        p.setAge(25);
        p.show();

        p.setAge(200);  // 非法
        p.show();       // age 仍为 25
    }
}

/* 控制台输出：
姓名：王五，年龄：25
年龄 200 不合法，赋值失败！
姓名：王五，年龄：25

解析：setAge(200) 因超出 1~120 范围被拦截，age 保持原值 25 不变。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：封装 BankAccount 类"
      code={`// 要求：
// 1. 定义 BankAccount 类，私有字段：owner(String)、balance(double)。
// 2. 提供 getter/setter。
// 3. setBalance() 校验余额不能为负数，非法则打印提示并不赋值。
// 4. 在 main 中测试合法和非法余额设置，并用 getter 读取后打印。

public class BankAccount {
    // 在这里补全代码
}

public class BankAccountTest {
    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class BankAccount {
    private String owner;
    private double balance;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        if (balance < 0) {
            System.out.println("余额不能为负数：" + balance);
            return;
        }
        this.balance = balance;
    }
}

public class BankAccountTest {
    public static void main(String[] args) {
        BankAccount account = new BankAccount();
        account.setOwner("赵六");
        account.setBalance(5000.0);
        System.out.println(account.getOwner() + " 的余额：" + account.getBalance());

        account.setBalance(-100.0);   // 非法，被拦截
        System.out.println("设置非法余额后：" + account.getBalance());  // 仍是 5000.0
    }
}

/* 控制台输出：
赵六 的余额：5000.0
余额不能为负数：-100.0
设置非法余额后：5000.0

解析：setBalance(-100.0) 因为余额小于 0 被拦截，balance 保持原值 5000.0。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：找出封装代码中的错误"
      code={`// 下面的代码有 2 处错误，请找出并说明原因。

public class Cat {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        name = name;   // 错误 1：？
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}

public class CatTest {
    public static void main(String[] args) {
        Cat c = new Cat();
        c.setName("咪咪");
        c.name = "旺财";   // 错误 2：？
        System.out.println(c.getName());
    }
}`}
      answerCode={`/* 错误分析：

错误 1（setName 方法体）：
    name = name;
    等号两侧都是局部变量 name（形参），把形参赋给自身，成员变量 name 根本没有被赋值。
    正确写法：this.name = name;
    this.name 指向成员变量，右边的 name 是形参，这样才能把传入值赋给成员变量。

错误 2（CatTest 中）：
    c.name = "旺财";
    name 是 private 字段，类外部无法直接访问，这行代码会造成编译错误：
    "name has private access in Cat"
    正确做法：通过 setter 修改，即 c.setName("旺财");
*/`}
    />
  </article>
);

export default index;
