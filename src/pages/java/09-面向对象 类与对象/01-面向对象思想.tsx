import React from 'react';
import {
  Title,
  Heading3,
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
    <Title>面向对象思想</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 是一门<Text bold>面向对象（Object-Oriented）</Text>的编程语言。
        理解面向对象的思想，是学好 Java 最重要的一步。
        本节先用生活类比说清楚什么是"面向对象"，再和"面向过程"做对比，
        最后预告面向对象的三大特征，以及类与对象的核心关系。
      </Paragraph>
    </Callout>

    <Heading3>1. 面向过程 vs 面向对象</Heading3>
    <Paragraph>
      编程解决问题有两种主流思路：<Text bold>面向过程</Text>和<Text bold>面向对象</Text>。
      用一个经典的生活案例——"洗衣服"——来对比理解：
    </Paragraph>
    <Table
      head={['', '面向过程', '面向对象']}
      rows={[
        ['思维方式', '我来亲自执行每一个步骤', '把任务交给"具备这个能力的对象"去做'],
        ['"洗衣服"怎么做', '①拿衣服 ②放水 ③加洗衣液 ④搓洗 ⑤漂洗 ⑥拧干', '找到洗衣机，调用它的"洗涤"功能，按下启动键'],
        ['关注点', '每一步怎么做（How）', '找谁去做（Who），让它做什么（What）'],
        ['代表语言', 'C、Pascal', 'Java、Python、C++'],
      ]}
    />
    <Paragraph>
      面向过程就像"自己手洗"：你要知道每一个细节步骤，亲力亲为。
      面向对象就像"用洗衣机"：你不需要知道洗衣机内部如何运转，
      只需要知道"把衣服放进去、按下按钮"，剩下的交给洗衣机（对象）去完成。
    </Paragraph>

    <Heading3>2. 把大象装进冰箱——两种思路对比</Heading3>
    <Paragraph>
      再看另一个更直观的例子："把大象装进冰箱，需要几步？"
    </Paragraph>
    <Table
      head={['步骤', '面向过程的写法', '面向对象的写法']}
      rows={[
        ['第一步', '打开冰箱门', '冰箱.打开门()'],
        ['第二步', '把大象放进去', '大象.进入(冰箱)'],
        ['第三步', '关上冰箱门', '冰箱.关闭门()'],
      ]}
    />
    <Paragraph>
      面向对象的写法中，<Text bold>冰箱</Text>和<Text bold>大象</Text>都是"对象"，
      每个对象负责自己该做的事情，我们只是<Text bold>指挥者</Text>，
      告诉各个对象"你该做什么"，而不关心它们内部具体怎么实现。
    </Paragraph>
    <Callout type="tip" title="面向对象的核心理念">
      面向对象编程的核心是：<Text bold>找到合适的对象，让它完成对应的功能</Text>。
      我们是"指挥者"，对象是"执行者"。好的面向对象设计，
      就是把现实世界中的事物抽象成程序中的对象，让各个对象各司其职。
    </Callout>

    <Heading3>3. 面向对象的三大特征（预告）</Heading3>
    <Paragraph>
      Java 面向对象有三大核心特征，后续章节会逐一深入讲解，这里先有整体认知：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>封装（Encapsulation）</Text>：把数据（属性）和操作数据的方法捆绑在一起，
        对外隐藏内部实现细节，只暴露必要的接口。就像洗衣机——你只需要会按按钮，
        不需要了解内部的电机和水泵如何工作。
      </ListItem>
      <ListItem>
        <Text bold>继承（Inheritance）</Text>：子类可以继承父类已有的属性和方法，
        在父类基础上进行扩展，实现代码复用。就像儿子继承了父亲的财产，
        还可以在此基础上自己再创造更多。
      </ListItem>
      <ListItem>
        <Text bold>多态（Polymorphism）</Text>：同一个方法调用，作用在不同对象上，
        可以产生不同的行为。就像"叫"这个动作，狗叫是"汪汪"，猫叫是"喵喵"，
        同一个"叫"的指令，不同的动物有不同的表现。
      </ListItem>
    </OrderedList>

    <Heading3>4. 类与对象的关系</Heading3>
    <Paragraph>
      理解面向对象，最关键的两个概念是<Text bold>类（class）</Text>和<Text bold>对象（object）</Text>。
    </Paragraph>
    <Table
      head={['概念', '是什么', '生活类比']}
      rows={[
        ['类（class）', '对一类事物的抽象描述，是"模板"或"蓝图"，定义了这类事物有哪些属性和行为', '手机的设计图纸、饼干模具、"人类"这个物种概念'],
        ['对象（object）', '类的一个具体实例，是按照模板创建出来的真实存在的事物', '你手里那部具体的手机、用模具做出的那块饼干、某一个具体的人'],
      ]}
    />
    <Paragraph>
      类是<Text bold>抽象的</Text>，对象是<Text bold>具体的</Text>。
      类好比"手机设计图纸"，里面规定了手机有品牌、型号、颜色等属性，
      有打电话、发短信、拍照等功能；
      而张三手里的那部红色 iPhone、李四手里的那部黑色小米，
      就是根据这份"设计图纸"制造出来的两个具体对象。
    </Paragraph>
    <UnorderedList>
      <ListItem>
        同一个类可以创建出<Text bold>无数个</Text>对象，每个对象的属性值可以不同，
        但它们都拥有类定义的相同属性名和行为。
      </ListItem>
      <ListItem>
        对象是类的<Text bold>实例化</Text>结果，在 Java 中用 <InlineCode>new</InlineCode> 关键字来创建对象。
      </ListItem>
      <ListItem>
        没有类，就无法创建对象；没有对象，类只是一张"空蓝图"，什么事也干不了。
      </ListItem>
    </UnorderedList>

    <Heading3>5. 用代码感受类与对象</Heading3>
    <Paragraph>
      下面是一个最简单的示例，先感受一下类和对象的样子（完整语法在下一节详解）：
    </Paragraph>
    <CodeBlock
      title="Phone.java"
      code={`// 类：对"手机"这类事物的抽象描述（蓝图/模板）
public class Phone {
    // 属性（成员变量）：手机有哪些特征
    String brand;   // 品牌
    String color;   // 颜色
    double price;   // 价格

    // 行为（成员方法）：手机能做什么
    public void call(String number) {
        System.out.println(brand + " 手机正在拨打：" + number);
    }

    public void takePicture() {
        System.out.println(brand + " 手机正在拍照");
    }
}`}
    />
    <CodeBlock
      title="PhoneTest.java"
      code={`public class PhoneTest {
    public static void main(String[] args) {
        // 根据 Phone 类，创建两个具体的对象（实例）
        Phone phone1 = new Phone();   // 对象1
        phone1.brand = "小米";
        phone1.color = "黑色";
        phone1.price = 2999.0;

        Phone phone2 = new Phone();   // 对象2
        phone2.brand = "苹果";
        phone2.color = "红色";
        phone2.price = 7999.0;

        // 让各自的对象执行行为
        phone1.call("10086");
        phone2.takePicture();
        System.out.println("手机1品牌：" + phone1.brand + "，颜色：" + phone1.color);
        System.out.println("手机2价格：" + phone2.price + " 元");
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`小米 手机正在拨打：10086
苹果 手机正在拍照
手机1品牌：小米，颜色：黑色
手机2价格：7999.0 元`} />
    <Paragraph>
      从输出可以看出：<InlineCode>phone1</InlineCode> 和 <InlineCode>phone2</InlineCode>
      都是 <InlineCode>Phone</InlineCode> 类的对象，它们拥有相同的属性名（brand、color、price）
      和方法（call、takePicture），但各自的属性值是独立的、互不干扰的。
    </Paragraph>

    <Callout type="success" title="小结">
      <Paragraph>本节核心要点：</Paragraph>
      <UnorderedList>
        <ListItem>面向对象：找到合适的对象，让它完成功能；我们做指挥者，不关心内部实现细节。</ListItem>
        <ListItem>三大特征：封装、继承、多态，后续章节逐一展开。</ListItem>
        <ListItem><Text bold>类</Text>是抽象模板（蓝图），<Text bold>对象</Text>是类的具体实例；用 <InlineCode>new</InlineCode> 创建对象。</ListItem>
        <ListItem>同一个类可以创建多个对象，各对象的属性值独立存储、互不影响。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>
    <CodeBlock
      qa
      language="text"
      title="练习 1：概念辨析"
      code={`判断下列说法是否正确，并说明理由：

A. 类是对象的具体实例，对象是抽象的模板。
B. 同一个类创建的两个对象，修改其中一个对象的属性值，不会影响另一个对象的属性值。
C. 面向对象编程中，使用者需要关心对象内部每一步的实现细节。
D. Java 的三大面向对象特征是：封装、继承、多态。`}
      answerCode={`A. 错误。说反了。类是抽象的模板（蓝图），对象才是类的具体实例。
   例如："手机设计图纸"是类，你手里那部具体的手机才是对象。

B. 正确。每个对象都有自己独立的一份属性存储空间（在堆内存中），
   修改 phone1.brand 不会影响 phone2.brand。

C. 错误。面向对象的优势之一就是封装：使用者只需知道"让谁做什么"（接口），
   不需要关心内部实现细节。就像用洗衣机，不需要懂电机原理。

D. 正确。封装（隐藏内部细节）、继承（子类复用父类）、多态（同一方法不同表现）
   是 Java 面向对象的三大特征。`}
    />
    <CodeBlock
      qa
      language="text"
      title="练习 2：用面向对象思路分析场景"
      code={`场景：一个学生管理系统，需要对学生进行管理。
请用面向对象思路回答以下问题：
1. 这个场景中可以抽象出哪些"类"？（列举至少 3 个）
2. 以"学生"为例，该类应有的属性和行为各至少 3 个。
3. "张三"（某个具体的学生）对应的是"类"还是"对象"？`}
      answerCode={`1. 可以抽象出的类：
   - Student（学生）
   - Teacher（教师）
   - Course（课程）
   - Classroom（教室）
   - Grade（成绩）等

2. Student 类示例：
   属性（描述学生有什么）：
     String name;        // 姓名
     int age;            // 年龄
     String studentId;   // 学号
   行为（描述学生能做什么）：
     study()             // 学习
     takeExam()          // 参加考试
     submitAssignment()  // 提交作业

3. "张三"是"对象"。
   "学生"（Student）是类，是抽象的模板；
   "张三"是根据 Student 类创建出来的一个具体实例，是对象。
   用代码表示：Student zhangSan = new Student();`}
    />
    <CodeBlock
      qa
      title="练习 3：补全代码——创建 Dog 类并实例化"
      code={`// 要求：
// 1. 定义 Dog 类，包含属性 name（String）和 age（int），
//    以及方法 bark()（打印 "xxx 在叫：汪汪汪！"，xxx 是狗的名字）。
// 2. 在 DogTest 的 main 方法中，创建两只狗：
//    dog1：name="旺财", age=3，调用 bark()
//    dog2：name="小白", age=1，调用 bark()
//    分别打印两只狗的 age。

public class Dog {
    // 请补全属性和方法
}

public class DogTest {
    public static void main(String[] args) {
        // 请补全代码
    }
}`}
      answerCode={`public class Dog {
    String name;
    int age;

    public void bark() {
        System.out.println(name + " 在叫：汪汪汪！");
    }
}

public class DogTest {
    public static void main(String[] args) {
        Dog dog1 = new Dog();
        dog1.name = "旺财";
        dog1.age = 3;
        dog1.bark();

        Dog dog2 = new Dog();
        dog2.name = "小白";
        dog2.age = 1;
        dog2.bark();

        System.out.println("旺财的年龄：" + dog1.age);
        System.out.println("小白的年龄：" + dog2.age);
    }
}

/* 控制台输出：
旺财 在叫：汪汪汪！
小白 在叫：汪汪汪！
旺财的年龄：3
小白的年龄：1
*/`}
    />
  </article>
);

export default index;
