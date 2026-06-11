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
    <Title>方法的覆盖重写</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        子类继承父类的方法后，有时需要修改它的行为——猫和狗都会"叫"，但叫声完全不同。
        Java 提供了<Text bold>方法覆盖重写（Override）</Text>机制：
        子类定义一个与父类<Text bold>方法名、参数列表完全相同</Text>的方法，
        就会覆盖父类版本，调用时执行子类的逻辑。
        本节重点掌握重写的语法规则、<InlineCode>@Override</InlineCode> 注解的作用，
        以及重写与重载的本质区别。
      </Paragraph>
    </Callout>

    <Heading3>1. 什么是方法覆盖重写</Heading3>
    <Paragraph>
      在子类中定义一个方法，要求满足以下条件，就构成对父类方法的<Text bold>覆盖重写（Override）</Text>：
    </Paragraph>
    <OrderedList>
      <ListItem>方法名与父类方法<Text bold>完全相同</Text>。</ListItem>
      <ListItem>参数列表（参数个数、类型、顺序）与父类方法<Text bold>完全相同</Text>。</ListItem>
      <ListItem>
        返回值类型与父类方法<Text bold>相同，或者是其子类类型</Text>（协变返回类型，初学阶段写相同即可）。
      </ListItem>
      <ListItem>
        子类方法的访问权限<Text bold>不能比父类更低</Text>（可以更宽，不能更窄）。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="重写的本质：子类用自己的版本替换父类版本">
      重写后，通过子类对象调用该方法时，执行的是子类的版本；
      只有通过 <InlineCode>super.方法名()</InlineCode> 才能在子类内部调用父类的原版本。
    </Callout>

    <Heading3>2. @Override 注解</Heading3>
    <Paragraph>
      在重写方法前加上 <InlineCode>@Override</InlineCode> 注解，
      编译器会<Text bold>自动校验该方法是否真的构成重写</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        如果方法名拼错、参数列表对不上——加了 <InlineCode>@Override</InlineCode> 后编译直接报错，
        帮助提前发现错误。
      </ListItem>
      <ListItem>
        不加 <InlineCode>@Override</InlineCode>，方法名拼错只会变成"新增方法"而非重写，
        运行时调用父类版本，逻辑悄悄出错却不报错。
      </ListItem>
      <ListItem>
        <InlineCode>@Override</InlineCode> 是可选的，但<Text bold>强烈建议始终加上</Text>，
        是良好的编码习惯。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      title="@Override 的典型用法"
      code={`@Override
public void eat() {
    // 子类的具体实现
}`}
    />

    <Heading3>3. 重写的三条硬性规则</Heading3>
    <Table
      head={['规则', '说明', '违反后果']}
      rows={[
        ['方法名 + 参数列表必须完全一致', '名字或参数不同就不是重写，而是新增方法', '逻辑静默出错，加 @Override 能让编译器报错'],
        ['子类访问权限 ≥ 父类访问权限', 'public 可重写为 public，protected 可重写为 public/protected，不能缩小', '编译报错'],
        ['返回值类型相同或为其子类型', '基本类型必须完全相同；引用类型允许协变（子类类型）', '编译报错'],
      ]}
    />
    <Callout type="danger" title="私有方法和静态方法不能被重写">
      父类的 <InlineCode>private</InlineCode> 方法子类根本无法访问，更谈不上重写——
      子类写同名方法只是新增了一个独立方法。
      父类的 <InlineCode>static</InlineCode> 方法也不能被重写（只能被隐藏），
      因为重写依赖运行时对象类型判断，而 static 方法属于类本身，与对象无关。
    </Callout>

    <Heading3>4. 重写 vs 重载——本质区别</Heading3>
    <Table
      head={['对比项', '重写（Override）', '重载（Overload）']}
      rows={[
        ['发生位置', '子类中，与父类之间', '同一个类中'],
        ['方法名', '必须相同', '必须相同'],
        ['参数列表', '必须完全相同', '必须不同（个数/类型/顺序至少一项不同）'],
        ['返回值类型', '相同或为父类返回类型的子类', '无限制'],
        ['访问权限', '不能比父类更低', '无限制'],
        ['触发时机', '运行时（动态绑定，由对象类型决定）', '编译时（由参数列表决定）'],
        ['关键注解', '@Override（建议加）', '无专用注解'],
      ]}
    />
    <Callout type="warning" title="重写和重载最容易混淆的点">
      重载是<Text bold>同类中</Text>同名方法有不同参数，编译期决定调哪个；
      重写是<Text bold>子父类之间</Text>参数列表完全相同的同名方法，运行期由对象类型决定调哪个。
      两者概念截然不同，不要混淆。
    </Callout>

    <Heading3>5. 示例代码</Heading3>
    <Heading4>示例 1：子类重写父类方法</Heading4>
    <Paragraph>
      <InlineCode>Animal</InlineCode> 有 <InlineCode>eat()</InlineCode> 和
      <InlineCode>speak()</InlineCode> 方法；
      <InlineCode>Cat</InlineCode> 和 <InlineCode>Dog</InlineCode> 分别重写 <InlineCode>speak()</InlineCode>
      来体现各自的叫声。
    </Paragraph>
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    String name;

    public void eat() {
        System.out.println(name + " 在吃东西");
    }

    public void speak() {
        System.out.println(name + " 发出叫声");
    }
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat extends Animal {

    @Override
    public void speak() {
        System.out.println(name + " 说：喵喵喵~");
    }
}`}
    />
    <CodeBlock
      title="Dog.java"
      code={`public class Dog extends Animal {

    @Override
    public void speak() {
        System.out.println(name + " 说：汪汪汪！");
    }
}`}
    />
    <CodeBlock
      title="OverrideDemo.java"
      code={`public class OverrideDemo {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.name = "小花";
        cat.eat();     // 没有重写，使用父类版本
        cat.speak();   // 重写了，使用 Cat 的版本

        System.out.println("---");

        Dog dog = new Dog();
        dog.name = "旺财";
        dog.eat();     // 没有重写，使用父类版本
        dog.speak();   // 重写了，使用 Dog 的版本
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`小花 在吃东西
小花 说：喵喵喵~
---
旺财 在吃东西
旺财 说：汪汪汪！`} />
    <Paragraph>
      <InlineCode>eat()</InlineCode> 没有被重写，Cat 和 Dog 都沿用父类版本，输出相同格式；
      <InlineCode>speak()</InlineCode> 被各自重写，输出内容不同——这就是重写的价值：
      <Text bold>相同的方法名，不同的行为</Text>，面向对象多态的基础。
    </Paragraph>

    <Heading4>示例 2：重写中用 super.方法() 复用父类逻辑</Heading4>
    <Paragraph>
      有时子类不是完全替换父类方法，而是在父类逻辑基础上追加新功能。
      用 <InlineCode>super.方法()</InlineCode> 先执行父类逻辑，再追加子类特有逻辑。
    </Paragraph>
    <CodeBlock
      title="Employee.java"
      code={`public class Employee {
    String name;

    public void work() {
        System.out.println(name + " 正在处理日常工作");
    }
}`}
    />
    <CodeBlock
      title="Teacher.java"
      code={`public class Teacher extends Employee {

    @Override
    public void work() {
        super.work();   // 先复用父类逻辑
        System.out.println(name + " 还在批改作业");   // 再追加教师特有逻辑
    }
}`}
    />
    <CodeBlock
      title="SuperCallDemo.java"
      code={`public class SuperCallDemo {
    public static void main(String[] args) {
        Teacher t = new Teacher();
        t.name = "李老师";
        t.work();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`李老师 正在处理日常工作
李老师 还在批改作业`} />
    <Paragraph>
      这种"<InlineCode>super.方法()</InlineCode> + 追加逻辑"的模式非常常见，
      既避免代码重复，又能满足子类特有需求。
    </Paragraph>

    <Heading4>示例 3：@Override 保护你不犯拼写错误</Heading4>
    <CodeBlock
      title="ErrorDemo.java（演示不加 @Override 的隐患）"
      code={`public class Animal {
    public void speak() {
        System.out.println("动物叫");
    }
}

public class Cat extends Animal {
    // 忘记加 @Override，方法名拼错成 speek
    // 编译器不报错，只是新增了一个 speek() 方法，speak() 仍然是父类版本
    public void speek() {
        System.out.println("喵喵喵");
    }
}

public class ErrorDemo {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.speak();   // 实际调用的是父类版本，因为 Cat 没有真正重写 speak()
    }
}
// 输出：动物叫   （不是预期的"喵喵喵"，错误难以察觉）

// 如果加上 @Override，编译器立刻报错：
// @Override
// public void speek() { ... }   // 报错：方法 speek() 不存在于父类中`}
    />
    <Callout type="success" title="重写核心要点">
      <UnorderedList>
        <ListItem>方法名 + 参数列表必须与父类完全一致，否则是新增而非重写。</ListItem>
        <ListItem>返回值类型相同（或为子类型），访问权限不能缩小。</ListItem>
        <ListItem>私有方法和静态方法不能被重写。</ListItem>
        <ListItem>始终加 <InlineCode>@Override</InlineCode>，让编译器帮你校验。</ListItem>
        <ListItem>用 <InlineCode>super.方法()</InlineCode> 在重写中复用父类逻辑。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：重写 toString() 方法"
      code={`// 要求：定义 Animal 类，包含属性 name 和 age，
// 重写 Object 类的 toString() 方法，返回格式：
// "Animal{name='小花', age=2}"
// 在 main 中创建对象并直接打印（println 会自动调用 toString()）

public class Animal {
    String name;
    int age;

    // 补全 toString() 重写
}

public class Exercise01 {
    public static void main(String[] args) {
        Animal a = new Animal();
        a.name = "小花";
        a.age  = 2;
        System.out.println(a);  // 自动调用 toString()
    }
}`}
      answerCode={`public class Animal {
    String name;
    int age;

    @Override
    public String toString() {
        return "Animal{name='" + name + "', age=" + age + "}";
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        Animal a = new Animal();
        a.name = "小花";
        a.age  = 2;
        System.out.println(a);
    }
}

/* 控制台输出：
Animal{name='小花', age=2}

解析：println 打印对象时自动调用 toString()，
      重写 toString() 后输出可读性强的字符串，而非默认的内存地址格式（如 Animal@1b6d3586）。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：重写方法并用 super 复用父类逻辑"
      code={`// 要求：
// 父类 Employee 有 work() 方法，打印"[name] 在处理日常事务"
// 子类 Manager extends Employee，重写 work() 方法：
//   先调用父类 work()，再打印"[name] 还在开会"
// main 中创建 Manager，name="王经理"，调用 work()

public class Employee {
    String name;
    public void work() {
        System.out.println(name + " 在处理日常事务");
    }
}

public class Manager extends Employee {
    // 补全重写方法
}

public class Exercise02 {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`public class Employee {
    String name;
    public void work() {
        System.out.println(name + " 在处理日常事务");
    }
}

public class Manager extends Employee {
    @Override
    public void work() {
        super.work();                              // 复用父类逻辑
        System.out.println(name + " 还在开会");   // 追加子类特有逻辑
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        Manager m = new Manager();
        m.name = "王经理";
        m.work();
    }
}

/* 控制台输出：
王经理 在处理日常事务
王经理 还在开会

解析：@Override 确保方法名正确重写；super.work() 复用父类逻辑，
      避免重复编写"处理日常事务"的代码，这是重写中最常见的实用模式。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：判断是否构成重写"
      code={`// 父类如下，判断 A~E 哪些子类方法构成对父类方法的正确重写？

class Animal {
    public void eat(String food) { }
    protected int getAge() { return 0; }
}

class Cat extends Animal {
    // A
    public void eat(String food) { }

    // B
    public void eat(String food, int times) { }

    // C
    private void eat(String food) { }

    // D
    public int getAge() { return 1; }

    // E
    protected int getAge() { return 2; }
}

// 请在注释中说明每个方法是否构成重写，以及原因`}
      answerCode={`// A: 构成重写 (Override)
//    方法名、参数列表、返回值类型完全一致，访问权限 public == public，符合所有规则。

// B: 不构成重写（是重载 Overload）
//    参数列表不同（多了一个 int 参数），是对 eat() 的重载，不是重写。

// C: 编译报错（违反访问权限规则）
//    子类把 public 降为 private，访问权限收窄，违反重写规则，加 @Override 会编译报错。

// D: 构成重写
//    方法名、参数列表、返回值类型一致；访问权限 public > protected，变宽了，合法。

// E: 构成重写
//    方法名、参数列表、返回值类型一致；访问权限 protected == protected，合法。

/* 总结：
   判断是否构成重写的核心三问：
   1. 方法名 + 参数列表完全相同？（不同则是重载或新增方法）
   2. 返回值类型相同或为其子类型？
   3. 子类访问权限 >= 父类访问权限？（只能更宽，不能更窄）
*/`}
    />
  </article>
);

export default index;
