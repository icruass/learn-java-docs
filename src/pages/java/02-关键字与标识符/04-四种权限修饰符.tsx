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
    <Title>四种权限修饰符</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 用<Text bold>权限修饰符</Text>来控制类、方法、变量等成员"谁能访问"。
        四种权限由大到小依次是：
        <InlineCode>public</InlineCode>（公开）、
        <InlineCode>protected</InlineCode>（受保护）、
        <Text bold>默认/缺省</Text>（什么都不写，也叫 package-private，包级私有）、
        <InlineCode>private</InlineCode>（私有）。
        理解它们的差异，是掌握<Text bold>封装</Text>这一面向对象核心思想的基础。
        本节重点讲清"四种修饰符在不同场景下的可见范围"，并给出实际开发中的选择建议。
      </Paragraph>
    </Callout>

    <Heading3>1. 四种权限修饰符一览</Heading3>
    <Paragraph>
      先从最宽到最严，了解每种修饰符的基本含义：
    </Paragraph>
    <Table
      head={['修饰符', '关键词', '一句话含义']}
      rows={[
        ['公开', 'public', '任何地方都能访问，毫无限制'],
        ['受保护', 'protected', '同包内可访问；不同包的子类也可访问；不同包的无关类不能访问'],
        ['默认（包级私有）', '（什么都不写）', '同一个包内可访问；不同包（无论是否子类）均不可访问'],
        ['私有', 'private', '只有声明该成员的那个类内部可以访问，其他任何地方都不行'],
      ]}
    />
    <Callout type="tip" title="「默认」不是关键字">
      <Text bold>默认权限</Text>没有关键字，就是<Text bold>什么修饰符都不写</Text>。
      它也常被称为 package-private（包私有），意思是"在本包内可见"。
      不要把它和 <InlineCode>default</InlineCode> 关键字混淆——
      <InlineCode>default</InlineCode> 关键字只用于接口中定义默认方法，与权限无关。
    </Callout>

    <Heading3>2. 可见范围详细对比表</Heading3>
    <Paragraph>
      下表以"能否访问"（✔ 能 / ✘ 不能）展示四种修饰符在四个场景下的可见性：
    </Paragraph>
    <Table
      head={['访问场景', 'public', 'protected', '默认（不写）', 'private']}
      rows={[
        ['同一个类中', '✔', '✔', '✔', '✔'],
        ['同一个包中（其他类）', '✔', '✔', '✔', '✘'],
        ['不同包的子类中', '✔', '✔', '✘', '✘'],
        ['不同包的无关类中', '✔', '✘', '✘', '✘'],
      ]}
    />
    <Paragraph>
      关键规律：从左往右，可见范围依次缩小；从上往下，访问条件越来越严格。
      <InlineCode>public</InlineCode> 全列打勾；<InlineCode>private</InlineCode> 仅第一行打勾。
    </Paragraph>
    <Callout type="warning" title="protected 的跨包访问仅限子类，且必须通过继承">
      在不同包中，<InlineCode>protected</InlineCode> 成员只能在<Text bold>子类自身的方法体内</Text>通过
      <InlineCode>this</InlineCode> 或子类对象访问，
      不能通过父类对象直接访问（即便是在子类方法里也不行）。
      这个细节初学阶段记住结论即可：<Text bold>跨包必须借助继承关系</Text>。
    </Callout>

    <Heading3>3. 修饰符能用在哪里</Heading3>
    <Paragraph>
      并非所有地方都能使用四种修饰符：
    </Paragraph>
    <Table
      head={['目标', '可使用的权限修饰符', '说明']}
      rows={[
        ['外部类（顶层类）', 'public、默认', '外部类只允许 public 或默认，不允许 protected/private'],
        ['成员变量', 'public、protected、默认、private', '四种均可，根据封装需要选择'],
        ['成员方法', 'public、protected、默认、private', '四种均可'],
        ['构造方法', 'public、protected、默认、private', '四种均可，private 构造方法可实现单例模式'],
        ['内部类', 'public、protected、默认、private', '内部类是类的成员，规则与成员相同'],
      ]}
    />
    <Callout type="danger" title="外部类不能用 protected 或 private 修饰">
      如果你写 <InlineCode>private class MyClass</InlineCode> 或
      <InlineCode>protected class MyClass</InlineCode>（顶层类），
      编译器会直接报错。外部类只允许 <InlineCode>public</InlineCode> 或不写（默认）。
    </Callout>

    <Heading3>4. 示例代码</Heading3>
    <Heading4>示例 1：同包内的访问演示</Heading4>
    <Paragraph>
      同一个包 <InlineCode>com.example</InlineCode> 下，<InlineCode>Person</InlineCode> 类有四种权限的成员，
      <InlineCode>PersonTest</InlineCode> 演示哪些能访问、哪些不能访问。
    </Paragraph>
    <CodeBlock
      title="com/example/Person.java"
      code={`package com.example;

public class Person {
    public    String publicName    = "public 名字";
    protected String protectedName = "protected 名字";
              String defaultName   = "默认 名字";     // 不写修饰符
    private   String privateName   = "private 名字";

    // private 成员通过公开的 getter 方法对外暴露
    public String getPrivateName() {
        return privateName;
    }

    public void showAll() {
        // 同一个类内，四种权限都可访问
        System.out.println(publicName);
        System.out.println(protectedName);
        System.out.println(defaultName);
        System.out.println(privateName);
    }
}`}
    />
    <CodeBlock
      title="com/example/PersonTest.java（同包，其他类）"
      code={`package com.example;

public class PersonTest {
    public static void main(String[] args) {
        Person p = new Person();

        System.out.println(p.publicName);     // 合法：public
        System.out.println(p.protectedName);  // 合法：同包，protected 可访问
        System.out.println(p.defaultName);    // 合法：同包，默认可访问
        // System.out.println(p.privateName); // 编译报错：private 仅限同类

        // 通过公开的 getter 访问 private 成员
        System.out.println(p.getPrivateName());
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`public 名字
protected 名字
默认 名字
private 名字`} />

    <Heading4>示例 2：不同包中的子类访问（protected 体现继承特性）</Heading4>
    <CodeBlock
      title="com/other/Student.java（不同包，子类）"
      code={`package com.other;

import com.example.Person;

// 不同包的子类
public class Student extends Person {
    public void test() {
        System.out.println(publicName);     // 合法：public，任何地方可见
        System.out.println(protectedName);  // 合法：不同包的子类，protected 可访问
        // System.out.println(defaultName); // 编译报错：不同包，默认权限不可访问
        // System.out.println(privateName); // 编译报错：private 仅限 Person 类内部
    }
}`}
    />
    <CodeBlock
      title="com/other/Stranger.java（不同包，无关类）"
      code={`package com.other;

import com.example.Person;

// 不同包的无关类（没有继承 Person）
public class Stranger {
    public void test() {
        Person p = new Person();
        System.out.println(p.publicName);      // 合法：public
        // System.out.println(p.protectedName);// 编译报错：不同包且不是子类
        // System.out.println(p.defaultName);  // 编译报错：不同包
        // System.out.println(p.privateName);  // 编译报错：private
    }
}`}
    />
    <Paragraph>
      通过这两个类的对比，<InlineCode>protected</InlineCode> 的特殊之处就很清晰：
      跨包场景下，只有继承了 <InlineCode>Person</InlineCode> 的 <InlineCode>Student</InlineCode> 才能访问
      <InlineCode>protectedName</InlineCode>；而没有继承关系的 <InlineCode>Stranger</InlineCode> 则不行。
    </Paragraph>

    <Heading4>示例 3：private 构造方法的实用场景</Heading4>
    <Paragraph>
      将构造方法设为 <InlineCode>private</InlineCode>，外部就无法直接 <InlineCode>new</InlineCode> 该类，
      常用于<Text bold>工具类</Text>（禁止实例化）或<Text bold>单例模式</Text>（只允许通过静态方法获取唯一实例）。
    </Paragraph>
    <CodeBlock
      title="MathUtils.java（工具类，禁止实例化）"
      code={`public class MathUtils {

    // private 构造方法：外部无法 new MathUtils()
    private MathUtils() {}

    // 所有方法均为 static，直接通过类名调用
    public static int add(int a, int b) {
        return a + b;
    }

    public static int max(int a, int b) {
        return a > b ? a : b;
    }

    public static void main(String[] args) {
        // MathUtils mu = new MathUtils();  // 编译报错：构造方法是 private
        System.out.println(MathUtils.add(3, 5));
        System.out.println(MathUtils.max(10, 7));
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`8
10`} />

    <Heading3>5. 封装的最佳实践</Heading3>
    <Paragraph>
      面向对象的<Text bold>封装原则</Text>要求：<Text bold>尽量隐藏实现细节，只暴露必要的接口</Text>。
      权限修饰符是实现封装的核心工具。以下是实际开发中经过验证的选择规则：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>成员变量几乎总是 private</Text>：不允许外部随意读写，
        通过 <InlineCode>getXxx()</InlineCode> / <InlineCode>setXxx()</InlineCode> 方法对外暴露，
        方法内可以加入校验逻辑（如 age 不能为负数）。
      </ListItem>
      <ListItem>
        <Text bold>对外公开的方法用 public</Text>：这就是"接口"，是你给外部提供服务的入口，命名要清晰。
      </ListItem>
      <ListItem>
        <Text bold>内部辅助方法用 private</Text>：只在类内调用、不对外暴露的实现细节，
        这样修改内部逻辑时不会影响外部代码。
      </ListItem>
      <ListItem>
        <Text bold>需要子类使用但不对外暴露时用 protected</Text>：专门为子类扩展留的"后门"，
        比父类 private 更开放，比 public 更克制。
      </ListItem>
      <ListItem>
        <Text bold>默认权限用于同包内协作</Text>：同一个模块（包）内的类需要互访，
        但不想暴露给外部包时使用，框架开发中较常见。
      </ListItem>
    </OrderedList>
    <CodeBlock
      title="BankAccount.java（封装的完整示例）"
      code={`public class BankAccount {
    private String owner;   // 私有：不允许外部直接修改
    private double balance; // 私有：余额只能通过方法操作

    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        // 通过私有方法做校验，保证初始余额合法
        setBalance(initialBalance);
    }

    // 公开：对外提供存款接口
    public void deposit(double amount) {
        if (amount <= 0) {
            System.out.println("存款金额必须大于 0");
            return;
        }
        balance += amount;
        System.out.println(owner + " 存入 " + amount + "，当前余额：" + balance);
    }

    // 公开：对外提供取款接口
    public void withdraw(double amount) {
        if (amount <= 0) {
            System.out.println("取款金额必须大于 0");
            return;
        }
        if (amount > balance) {
            System.out.println("余额不足，当前余额：" + balance);
            return;
        }
        balance -= amount;
        System.out.println(owner + " 取出 " + amount + "，当前余额：" + balance);
    }

    // 公开 getter：只读，外部只能查询余额，不能直接修改
    public double getBalance() {
        return balance;
    }

    public String getOwner() {
        return owner;
    }

    // 私有 setter：包含校验逻辑，只供类内使用
    private void setBalance(double balance) {
        if (balance < 0) {
            this.balance = 0;
        } else {
            this.balance = balance;
        }
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount("张三", 1000);
        account.deposit(500);
        account.withdraw(200);
        account.withdraw(2000);  // 余额不足
        System.out.println("最终余额：" + account.getBalance());
        // account.balance = 99999;  // 编译报错：balance 是 private
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`张三 存入 500.0，当前余额：1500.0
张三 取出 200.0，当前余额：1300.0
余额不足，当前余额：1300.0
最终余额：1300.0`} />
    <Paragraph>
      <InlineCode>balance</InlineCode> 和 <InlineCode>owner</InlineCode> 都是 private，
      外部无法直接修改；所有操作都必须经过 <InlineCode>deposit()</InlineCode>、<InlineCode>withdraw()</InlineCode>
      等公开方法，这些方法内含参数校验，确保数据始终处于合法状态——这就是封装的核心价值。
    </Paragraph>

    <Callout type="success" title="权限修饰符选择建议">
      <UnorderedList>
        <ListItem>
          <Text bold>成员变量</Text>：优先 <InlineCode>private</InlineCode>，配合 getter/setter 对外暴露。
        </ListItem>
        <ListItem>
          <Text bold>对外接口方法</Text>：<InlineCode>public</InlineCode>，名字简洁清晰。
        </ListItem>
        <ListItem>
          <Text bold>内部实现细节</Text>：<InlineCode>private</InlineCode>，随时可以改而不影响外部。
        </ListItem>
        <ListItem>
          <Text bold>专为子类扩展</Text>：<InlineCode>protected</InlineCode>，有继承语义时选它。
        </ListItem>
        <ListItem>
          <Text bold>外部类</Text>：只有 <InlineCode>public</InlineCode> 和默认（不写）两种选择，
          不能用 private/protected。
        </ListItem>
        <ListItem>
          总体原则：<Text bold>能 private 就 private，需要开放再扩大</Text>，
          而非"先 public，出了问题再收紧"。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：为 Student 类添加正确的封装"
      code={`// 要求：把下面 Student 类的成员变量全部改为 private，
// 并为 name（只读，只提供 getter）和 age（读写，提供 getter/setter，
// setter 中要求 age 必须在 1~150 之间，否则打印「年龄不合法」并不赋值）
// 提供对应的访问方法。
// main 中测试：创建 Student，设置合法年龄 20 和非法年龄 -5，打印信息。

public class Student {
    String name;  // 改为 private，只读
    int age;      // 改为 private，读写（含校验）

    public Student(String name, int age) {
        this.name = name;
        this.age  = age;
    }

    // 补全 getter/setter

    public static void main(String[] args) {
        // 补全测试代码
    }
}`}
      answerCode={`public class Student {
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        setAge(age);  // 构造时也走 setter 校验
    }

    // name 只读
    public String getName() {
        return name;
    }

    // age 读写
    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age < 1 || age > 150) {
            System.out.println("年龄不合法：" + age);
        } else {
            this.age = age;
        }
    }

    public static void main(String[] args) {
        Student s = new Student("小明", 20);
        System.out.println(s.getName() + "，年龄：" + s.getAge());

        s.setAge(-5);   // 非法，打印提示，age 不变
        System.out.println("设置非法年龄后：" + s.getAge());

        s.setAge(18);   // 合法
        System.out.println("设置合法年龄后：" + s.getAge());
    }
}

/* 控制台输出：
小明，年龄：20
年龄不合法：-5
设置非法年龄后：20
设置合法年龄后：18

解析：将成员变量设为 private 并通过方法控制访问，
      setter 中的校验保证了数据的合法性——这正是封装的核心价值所在。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：判断权限访问是否合法"
      code={`// 两个包：com.shop（商店包）和 com.user（用户包）
// 判断下面标注了 // ? 的每行代码是否合法，并说明原因。

// === 文件：com/shop/Product.java ===
package com.shop;
public class Product {
    public    String name     = "商品";
    protected double price    = 99.9;
              int    stock     = 50;     // 默认权限
    private   String secretId = "X001";
}

// === 文件：com/shop/ShopManager.java ===
package com.shop;
public class ShopManager {
    public void check() {
        Product p = new Product();
        System.out.println(p.name);      // 行 A ?
        System.out.println(p.price);     // 行 B ?
        System.out.println(p.stock);     // 行 C ?
        System.out.println(p.secretId);  // 行 D ?
    }
}

// === 文件：com/user/VipUser.java ===
package com.user;
import com.shop.Product;
public class VipUser extends Product {
    public void view() {
        System.out.println(name);        // 行 E ?
        System.out.println(price);       // 行 F ?
        System.out.println(stock);       // 行 G ?
        System.out.println(secretId);    // 行 H ?
    }
}

// === 文件：com/user/Guest.java ===
package com.user;
import com.shop.Product;
public class Guest {
    public void browse() {
        Product p = new Product();
        System.out.println(p.name);      // 行 I ?
        System.out.println(p.price);     // 行 J ?
    }
}`}
      answerCode={`// 行 A：合法。ShopManager 与 Product 同包，public 成员无限制。
// 行 B：合法。同包，protected 成员可访问。
// 行 C：合法。同包，默认权限成员可访问。
// 行 D：编译报错。private 仅限 Product 类内部，同包其他类也不行。

// 行 E：合法。VipUser 继承 Product，name 是 public，任何地方可见。
// 行 F：合法。VipUser 是 Product 的子类（不同包），protected 成员对子类可见。
// 行 G：编译报错。stock 是默认权限，仅限 com.shop 包内，不同包的子类也不行。
// 行 H：编译报错。private 仅限 Product 类内部。

// 行 I：合法。Guest 在不同包，但 name 是 public，全局可见。
// 行 J：编译报错。Guest 与 Product 不同包且无继承关系，protected 不可访问。

/* 口诀记忆：
   public   — 全通
   protected — 同包通 + 跨包子类通
   默认      — 仅同包通
   private  — 仅同类通
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：设计带权限控制的 Counter 类"
      code={`// 要求：设计一个计数器 Counter 类：
//   - count 是私有成员变量，初始值 0
//   - increment() 公开方法，count 加 1
//   - decrement() 公开方法，count 减 1，但 count 最小为 0（不能减到负数）
//   - reset() 公开方法，将 count 归零
//   - getCount() 公开方法，返回当前 count 值
//   - isZero() 私有辅助方法，判断 count 是否为 0（供 decrement 内部使用）
// main 中：increment 3次，decrement 1次，打印；再 decrement 5次（超出范围），打印；reset 后打印。

public class Counter {
    // 补全代码
}`}
      answerCode={`public class Counter {
    private int count = 0;

    public void increment() {
        count++;
    }

    public void decrement() {
        if (isZero()) {
            System.out.println("已经是 0，不能继续减");
            return;
        }
        count--;
    }

    public void reset() {
        count = 0;
    }

    public int getCount() {
        return count;
    }

    // 私有辅助方法：只供类内部使用，不对外暴露
    private boolean isZero() {
        return count == 0;
    }

    public static void main(String[] args) {
        Counter c = new Counter();
        c.increment();
        c.increment();
        c.increment();  // count = 3
        c.decrement();  // count = 2
        System.out.println("当前计数：" + c.getCount());

        // 多次 decrement，超过下限
        for (int i = 0; i < 5; i++) {
            c.decrement();
        }
        System.out.println("多次减后：" + c.getCount());

        c.reset();
        System.out.println("重置后：" + c.getCount());
    }
}

/* 控制台输出：
当前计数：2
已经是 0，不能继续减
已经是 0，不能继续减
已经是 0，不能继续减
多次减后：0
重置后：0

解析：count 被 private 保护，外部不能直接修改；
      isZero() 是私有辅助方法，只在 decrement() 内调用，
      外部无法调用，这正是「最小暴露原则」的体现。
*/`}
    />
  </article>
);

export default index;
