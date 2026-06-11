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
    <Title>成员变量与方法的访问特点</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        父类和子类都有自己的成员变量和方法，当它们的名字相同时，访问的到底是哪一个？
        本节重点讲清两条核心规则：成员变量遵循<Text bold>就近原则</Text>（局部 → 本类 → 父类），
        成员方法看<Text bold>new 的对象类型</Text>（子类有重写就用子类的）。
        同时介绍如何用 <InlineCode>super.变量</InlineCode> 和 <InlineCode>super.方法()</InlineCode>
        显式访问父类版本。
      </Paragraph>
    </Callout>

    <Heading3>1. 成员变量的访问：就近原则</Heading3>
    <Paragraph>
      在子类的方法中访问一个变量时，Java 按以下顺序逐层查找，找到即停：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>局部变量</Text>：方法内部声明的变量（包括方法参数）。
      </ListItem>
      <ListItem>
        <Text bold>本类成员变量</Text>：子类自己声明的实例变量。
      </ListItem>
      <ListItem>
        <Text bold>父类成员变量</Text>：父类中声明的非私有实例变量。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="用 super. 明确访问父类成员变量">
      当子类和父类有同名成员变量时，直接写变量名访问的是<Text bold>子类的</Text>（就近）。
      若要访问父类的同名变量，必须加 <InlineCode>super.</InlineCode> 前缀：
      <InlineCode>super.变量名</InlineCode>。
    </Callout>
    <Callout type="warning" title="private 变量不能通过 super. 访问">
      父类的 <InlineCode>private</InlineCode> 成员变量子类无法直接访问，
      即使加了 <InlineCode>super.</InlineCode> 也不行，需通过父类提供的 getter 方法获取。
    </Callout>

    <Heading3>2. 成员变量访问示例</Heading3>
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    String name = "动物";   // 父类成员变量
    int age = 0;
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat extends Animal {
    String name = "猫";    // 子类同名成员变量，遮蔽了父类的 name

    public void show() {
        String name = "局部猫";  // 局部变量，进一步遮蔽子类成员变量

        System.out.println(name);         // 1. 局部变量：局部猫
        System.out.println(this.name);    // 2. 本类成员变量：猫
        System.out.println(super.name);   // 3. 父类成员变量：动物
        System.out.println(super.age);    // 父类 age，子类没有同名的，直接继承
    }
}`}
    />
    <CodeBlock
      title="FieldAccessDemo.java"
      code={`public class FieldAccessDemo {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.show();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`局部猫
猫
动物
0`} />
    <Paragraph>
      三条就近原则清晰体现：不加前缀访问局部变量；<InlineCode>this.</InlineCode> 访问子类成员变量；
      <InlineCode>super.</InlineCode> 穿透到父类成员变量。
      <InlineCode>age</InlineCode> 子类没有同名声明，直接沿用父类的，值为 0。
    </Paragraph>

    <Heading3>3. 成员方法的访问：看 new 的对象</Heading3>
    <Paragraph>
      调用方法时，Java 看的是<Text bold>实际创建的对象类型</Text>（即 <InlineCode>new</InlineCode> 后面写的是哪个类）：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        如果子类<Text bold>重写了</Text>该方法，则调用<Text bold>子类的版本</Text>。
      </ListItem>
      <ListItem>
        如果子类<Text bold>没有重写</Text>，则向上找父类的版本。
      </ListItem>
      <ListItem>
        通过 <InlineCode>super.方法名()</InlineCode> 可以在子类内部显式调用父类的方法。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="方法查找方向与变量相同：就近（子类优先）">
      方法的查找同样是"就近原则"：先看子类有没有，有就用子类的；没有再去父类找。
      这也是后续章节"方法重写"的底层逻辑。
    </Callout>

    <Heading3>4. 成员方法访问示例</Heading3>
    <CodeBlock
      title="Animal.java"
      code={`public class Animal {
    public void eat() {
        System.out.println("动物在吃东西");
    }

    public void sleep() {
        System.out.println("动物在睡觉");
    }
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat extends Animal {

    // 子类重写了 eat()
    @Override
    public void eat() {
        System.out.println("猫在吃猫粮");
    }

    // Cat 没有重写 sleep()，使用父类版本

    public void show() {
        eat();           // 调用子类自己重写的 eat()
        super.eat();     // 显式调用父类的 eat()
        sleep();         // 子类没有 sleep()，自动找到父类的 sleep()
    }
}`}
    />
    <CodeBlock
      title="MethodAccessDemo.java"
      code={`public class MethodAccessDemo {
    public static void main(String[] args) {
        Cat cat = new Cat();
        cat.show();

        System.out.println("---");

        // new 的是 Cat 对象，调用 eat() 走子类重写的版本
        cat.eat();
        // sleep() 子类没有，走父类版本
        cat.sleep();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`猫在吃猫粮
动物在吃东西
动物在睡觉
---
猫在吃猫粮
动物在睡觉`} />
    <Paragraph>
      <InlineCode>eat()</InlineCode> 被 <InlineCode>Cat</InlineCode> 重写，所以
      不论在子类内部还是外部，只要 <InlineCode>new</InlineCode> 的是
      <InlineCode>Cat</InlineCode>，调用 <InlineCode>eat()</InlineCode> 都走子类版本。
      <InlineCode>super.eat()</InlineCode> 是唯一能在子类内部调用父类原版方法的方式。
      <InlineCode>sleep()</InlineCode> 子类未重写，自动向上找到父类版本执行。
    </Paragraph>

    <Heading3>5. 综合示例：父子同名变量与方法对比</Heading3>
    <Paragraph>
      用一个更完整的示例展示：父子类同时存在同名变量和同名方法时的完整访问行为。
    </Paragraph>
    <CodeBlock
      title="Employee.java"
      code={`public class Employee {
    String position = "员工";   // 父类成员变量
    int num = 10;

    public void introduce() {
        System.out.println("我是" + position + "，编号 " + num);
    }
}`}
    />
    <CodeBlock
      title="Teacher.java"
      code={`public class Teacher extends Employee {
    String position = "教师";   // 子类同名成员变量
    int num = 20;

    @Override
    public void introduce() {
        // 分别打印局部、子类、父类的同名变量
        System.out.println("子类 position = " + position);          // 子类成员变量
        System.out.println("父类 position = " + super.position);    // 父类成员变量
        System.out.println("子类 num = " + this.num);               // 子类 num
        System.out.println("父类 num = " + super.num);              // 父类 num

        // 调用父类的 introduce()
        super.introduce();
    }

    public void teach() {
        System.out.println(position + " 正在讲课");  // 访问子类的 position
    }
}`}
    />
    <CodeBlock
      title="MemberAccessDemo.java"
      code={`public class MemberAccessDemo {
    public static void main(String[] args) {
        Teacher t = new Teacher();
        t.introduce();
        System.out.println("---");
        t.teach();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`子类 position = 教师
父类 position = 员工
子类 num = 20
父类 num = 10
我是员工，编号 10
---
教师 正在讲课`} />
    <Paragraph>
      <InlineCode>super.introduce()</InlineCode> 调用的是父类 <InlineCode>Employee</InlineCode>
      中的 <InlineCode>introduce()</InlineCode>，该方法里直接写 <InlineCode>position</InlineCode>
      和 <InlineCode>num</InlineCode>，是在父类作用域中访问，所以拿到的是父类自己的成员变量值
      （"员工"和 10），与子类的覆盖无关。
    </Paragraph>

    <Heading3>6. 访问规则汇总</Heading3>
    <Table
      head={['访问目标', '写法', '查找顺序']}
      rows={[
        ['变量（无前缀）', 'num', '局部变量 → 子类成员变量 → 父类成员变量'],
        ['子类成员变量', 'this.num', '直接访问子类声明的实例变量'],
        ['父类成员变量', 'super.num', '直接访问父类声明的实例变量'],
        ['方法（无前缀）', 'eat()', '子类有重写就用子类的，否则向上找父类'],
        ['父类方法', 'super.eat()', '显式调用父类版本的方法'],
      ]}
    />

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：预测同名变量的输出"
      code={`// 下面代码的控制台输出是什么？

class Base {
    int x = 100;
}

class Child extends Base {
    int x = 200;

    public void print() {
        int x = 300;
        System.out.println(x);
        System.out.println(this.x);
        System.out.println(super.x);
    }
}

public class Exercise01 {
    public static void main(String[] args) {
        new Child().print();
    }
}`}
      answerCode={`// 控制台输出：
// 300
// 200
// 100

/* 解析：
   x（无前缀）：先找局部变量，找到 x=300，输出 300。
   this.x：    跳过局部变量，找子类成员变量 x=200，输出 200。
   super.x：   直接访问父类成员变量 x=100，输出 100。
   三层就近原则完整体现：局部 > 本类成员 > 父类成员。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：方法访问与 super.方法() 练习"
      code={`// 要求：
// 父类 Animal 有方法 speak()，打印"动物在叫"
// 子类 Dog 重写 speak()，打印"汪汪汪"，并在重写方法内通过 super.speak() 先打印父类版本
// main 中创建 Dog 对象并调用 speak()

public class Animal {
    public void speak() {
        // 补全
    }
}

public class Dog extends Animal {
    @Override
    public void speak() {
        // 先调用父类版本，再打印子类内容
        // 补全
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.speak();
    }
}`}
      answerCode={`public class Animal {
    public void speak() {
        System.out.println("动物在叫");
    }
}

public class Dog extends Animal {
    @Override
    public void speak() {
        super.speak();                   // 先调用父类版本
        System.out.println("汪汪汪");   // 再输出子类内容
    }
}

public class Exercise02 {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.speak();
    }
}

/* 控制台输出：
动物在叫
汪汪汪

解析：new 的是 Dog 对象，调用 speak() 走 Dog 重写的版本；
      重写版本内部先用 super.speak() 执行父类逻辑，再追加子类逻辑，
      这是继承中"复用父类行为再扩展"的经典写法。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：综合——成员变量与方法的就近原则"
      code={`// 补全 Teacher 类的 describe() 方法，要求：
// 1. 先打印子类的 subject 变量（用 this. 或直接写）
// 2. 再打印父类的 position 变量（用 super.）
// 3. 最后调用父类的 work() 方法（用 super.）

class Employee {
    String position = "员工";
    public void work() {
        System.out.println(position + " 正在工作");
    }
}

class Teacher extends Employee {
    String position = "教师";
    String subject  = "数学";

    public void describe() {
        // 补全：打印 subject、父类 position、调用父类 work()
    }
}

public class Exercise03 {
    public static void main(String[] args) {
        new Teacher().describe();
    }
}`}
      answerCode={`class Employee {
    String position = "员工";
    public void work() {
        System.out.println(position + " 正在工作");
    }
}

class Teacher extends Employee {
    String position = "教师";
    String subject  = "数学";

    public void describe() {
        System.out.println("科目：" + subject);              // 子类成员变量
        System.out.println("父类身份：" + super.position);   // 父类成员变量
        super.work();                                        // 调用父类方法
    }
}

public class Exercise03 {
    public static void main(String[] args) {
        new Teacher().describe();
    }
}

/* 控制台输出：
科目：数学
父类身份：员工
员工 正在工作

解析：super.position 拿到父类的"员工"，而不是子类重写的"教师"；
      super.work() 在父类 work() 方法内部访问的 position 是父类自己的成员变量，
      所以打印"员工 正在工作"而非"教师 正在工作"。
*/`}
    />
  </article>
);

export default index;
