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
    <Title>方法的定义格式</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节专门讲清方法定义的<Text bold>完整格式</Text>，把每一个组成部分逐一拆解：
        修饰符、返回值类型、方法名、形参列表、方法体、return 语句。
        读完之后你将能够看懂并写出任意一个基础方法，为后续的调用、重载打好基础。
      </Paragraph>
    </Callout>

    <Heading3>1. 完整定义格式</Heading3>
    <Paragraph>
      入门阶段，所有方法都写在同一个类的内部，与 <InlineCode>main</InlineCode> 方法并列，
      统一加上 <InlineCode>public static</InlineCode> 修饰符。完整格式如下：
    </Paragraph>
    <CodeBlock
      language="text"
      title="方法定义格式"
      code={`修饰符 返回值类型 方法名(参数类型 参数名, 参数类型 参数名, ...) {
    // 方法体：实现具体功能的代码
    return 返回值;   // 返回值类型为 void 时可省略，或写裸 return;
}`}
    />
    <Paragraph>
      以下是一个真实的例子，对照格式看：
    </Paragraph>
    <CodeBlock
      language="text"
      title="格式对照示例"
      code={`public static int add(int a, int b) {
//  ↑修饰符  ↑返回值类型  ↑方法名  ↑形参列表
    return a + b;
//  ↑return + 返回值（方法体）
}`}
    />

    <Heading3>2. 各部分详解</Heading3>

    <Heading4>2.1 修饰符：public static</Heading4>
    <Paragraph>
      入门阶段固定写 <InlineCode>public static</InlineCode>，与 <InlineCode>main</InlineCode> 方法保持一致。
      这样才能直接通过方法名互相调用，不需要创建对象。
      <InlineCode>public</InlineCode> 和 <InlineCode>static</InlineCode> 的深层含义
      在面向对象章节再展开，此阶段先记住固定写法即可。
    </Paragraph>
    <Callout type="tip" title="先记住固定写法">
      现阶段所有自定义方法都写 <InlineCode>public static</InlineCode>，和 main 保持一致，不要漏写或写反顺序。
    </Callout>

    <Heading4>2.2 返回值类型</Heading4>
    <Paragraph>
      返回值类型声明了方法执行结束后"交还"给调用方的数据类型。常见类型如下：
    </Paragraph>
    <Table
      head={['返回值类型', '含义', '对应的 return 语句']}
      rows={[
        ['int', '返回一个整数', 'return 42;  或  return a + b;'],
        ['double', '返回一个小数', 'return 3.14;  或  return a / b;'],
        ['boolean', '返回 true 或 false', 'return true;  或  return n > 0;'],
        ['String', '返回一段文本', 'return "hello";  或  return name;'],
        ['void', '不返回任何值', '可省略 return，或写裸 return; 提前结束'],
      ]}
    />
    <Callout type="danger" title="return 值的类型必须与声明一致">
      声明了 <InlineCode>int</InlineCode> 就必须 <InlineCode>return</InlineCode> 一个整数；
      声明了 <InlineCode>boolean</InlineCode> 就必须 <InlineCode>return true</InlineCode> 或
      <InlineCode>return false</InlineCode>。类型不匹配会直接编译报错。
    </Callout>

    <Heading4>2.3 方法名</Heading4>
    <Paragraph>
      方法名遵循<Text bold>小驼峰命名法</Text>：首字母小写，后续每个单词首字母大写，其余小写。
      方法名应当是动词或动宾结构，能一眼看出这个方法在做什么。
    </Paragraph>
    <Table
      head={['示例方法名', '是否规范', '说明']}
      rows={[
        ['calcSum', '规范', '动宾结构，小驼峰'],
        ['printLine', '规范', '动宾结构，小驼峰'],
        ['isEven', '规范', 'is 开头表示判断，返回 boolean'],
        ['getMaxValue', '规范', 'get 开头表示获取'],
        ['CalcSum', '不规范', '首字母大写是类名风格'],
        ['calc_sum', '不规范', '下划线风格不符合 Java 惯例'],
      ]}
    />

    <Heading4>2.4 形参列表</Heading4>
    <Paragraph>
      形参（形式参数）是方法定义时括号内声明的变量，作为"占位符"等待调用时传入具体值。
      格式为 <InlineCode>类型 变量名</InlineCode>，多个形参之间用逗号分隔。
      如果方法不需要任何外部数据，括号留空即可（但括号本身不能省略）。
    </Paragraph>
    <UnorderedList>
      <ListItem>无参数：<InlineCode>public static void printLine()</InlineCode></ListItem>
      <ListItem>一个参数：<InlineCode>public static void print(String msg)</InlineCode></ListItem>
      <ListItem>多个参数：<InlineCode>public static int add(int a, int b)</InlineCode></ListItem>
      <ListItem>混合类型：<InlineCode>public static String repeat(String s, int times)</InlineCode></ListItem>
    </UnorderedList>
    <Callout type="warning" title="每个参数都必须单独声明类型">
      Java 中不能像变量声明那样合并写 <InlineCode>int a, b</InlineCode>。
      形参列表中每个参数必须独立写类型，如 <InlineCode>int a, int b</InlineCode>，
      不能写成 <InlineCode>int a, b</InlineCode>，否则编译报错。
    </Callout>

    <Heading4>2.5 方法体</Heading4>
    <Paragraph>
      方法体是花括号 <InlineCode>{}</InlineCode> 内的所有代码，包含实现功能的具体逻辑：
      变量声明、计算、分支、循环、调用其他方法等，和普通代码块写法完全相同。
      方法体内定义的变量是<Text bold>局部变量</Text>，只在该方法内有效，方法执行结束后销毁。
    </Paragraph>

    <Heading4>2.6 return 的两重含义</Heading4>
    <OrderedList>
      <ListItem>
        <Text bold>返回结果</Text>：把方法计算出的值交还给调用方，
        调用处可以把它赋给变量或直接使用。
      </ListItem>
      <ListItem>
        <Text bold>结束方法</Text>：执行到 <InlineCode>return</InlineCode> 后，方法立即停止，
        后面的代码不再执行。<InlineCode>void</InlineCode> 方法可以写裸的
        <InlineCode>return;</InlineCode> 来提前退出。
      </ListItem>
    </OrderedList>

    <Heading3>3. 有返回值方法示例</Heading3>
    <Paragraph>
      下面定义三个有返回值的方法，分别返回 <InlineCode>int</InlineCode>、
      <InlineCode>double</InlineCode>、<InlineCode>boolean</InlineCode>，
      并在 <InlineCode>main</InlineCode> 里调用打印结果。
    </Paragraph>
    <CodeBlock
      title="ReturnTypeDemo.java"
      code={`public class ReturnTypeDemo {

    // 返回两数之和（int）
    public static int add(int a, int b) {
        return a + b;
    }

    // 返回圆的面积（double），参数为半径
    public static double circleArea(double r) {
        return 3.14159 * r * r;
    }

    // 判断一个整数是否为正数（boolean）
    public static boolean isPositive(int n) {
        return n > 0;
    }

    public static void main(String[] args) {
        int sum = add(8, 5);
        System.out.println("8 + 5 = " + sum);

        double area = circleArea(3.0);
        System.out.println("半径 3 的圆面积：" + area);

        boolean flag = isPositive(-2);
        System.out.println("-2 是正数吗？" + flag);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`8 + 5 = 13
半径 3 的圆面积：28.27431
-2 是正数吗？false`} />
    <Paragraph>
      <InlineCode>add(8, 5)</InlineCode>：实参 8 传给形参 <InlineCode>a</InlineCode>，
      5 传给形参 <InlineCode>b</InlineCode>，方法体执行 <InlineCode>8 + 5 = 13</InlineCode>，
      <InlineCode>return 13</InlineCode> 将结果交还给调用处，赋值给 <InlineCode>sum</InlineCode>。
    </Paragraph>

    <Heading3>4. void 方法示例</Heading3>
    <Paragraph>
      <InlineCode>void</InlineCode> 方法不返回任何值，只负责执行动作（打印、修改状态等）。
      下面演示普通 void 方法与使用裸 <InlineCode>return;</InlineCode> 提前退出的 void 方法。
    </Paragraph>
    <CodeBlock
      title="VoidDemo.java"
      code={`public class VoidDemo {

    // 打印分隔线，无参数，无返回值
    public static void printSeparator() {
        System.out.println("====================");
        // void 方法可以不写 return
    }

    // 打印问候语，有参数，无返回值
    public static void greet(String name) {
        System.out.println("你好，" + name + "！");
    }

    // 打印 1~n，若 n < 1 则提前 return 退出
    public static void printRange(int n) {
        if (n < 1) {
            System.out.println("n 必须大于等于 1");
            return;   // 提前结束，后面的循环不执行
        }
        for (int i = 1; i <= n; i++) {
            System.out.println(i);
        }
    }

    public static void main(String[] args) {
        printSeparator();
        greet("小明");
        greet("小红");
        printSeparator();
        printRange(4);
        printSeparator();
        printRange(0);   // n < 1，触发提前 return
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`====================
你好，小明！
你好，小红！
====================
1
2
3
4
====================
n 必须大于等于 1`} />
    <Paragraph>
      传入 <InlineCode>printRange(0)</InlineCode> 时，<InlineCode>n &lt; 1</InlineCode> 为真，
      打印提示信息后执行 <InlineCode>return;</InlineCode>，方法立即结束，
      for 循环不会执行，因此没有数字输出。
    </Paragraph>

    <Heading3>5. 格式对照总结表</Heading3>
    <Table
      head={['组成部分', '必须/可选', '入门阶段写法/要求']}
      rows={[
        ['修饰符', '必须', '固定写 public static'],
        ['返回值类型', '必须', 'int / double / boolean / String / void 等，不可省略'],
        ['方法名', '必须', '小驼峰，动词或动宾结构，见名知意'],
        ['括号 ()', '必须', '即使无参数也必须保留空括号'],
        ['形参列表', '可选', '每个参数单独写"类型 名字"，多个用逗号分隔'],
        ['方法体 {}', '必须', '实现功能的具体代码'],
        ['return 语句', '有返回值时必须', 'return 值; 类型必须与声明一致；void 可省略或写裸 return;'],
      ]}
    />
    <Callout type="success" title="小结">
      <Paragraph>
        方法定义的核心记忆点：
      </Paragraph>
      <UnorderedList>
        <ListItem>固定写 <InlineCode>public static</InlineCode> 修饰符（入门阶段）。</ListItem>
        <ListItem>返回值类型决定 return 后面跟什么；<InlineCode>void</InlineCode> 表示不返回任何值。</ListItem>
        <ListItem>方法名小驼峰，动词开头，见名知意。</ListItem>
        <ListItem>形参每个都要独立写类型；括号不能省略。</ListItem>
        <ListItem><InlineCode>return</InlineCode> 同时具备"返回结果"和"结束方法"两个作用。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：定义一个返回 String 的方法"
      code={`// 要求：定义方法 getDayType(int day)，参数 day 代表星期（1~7）。
// 若 day 为 1 或 7，返回 "周末"；否则返回 "工作日"。
// 返回值类型为 String，在 main 里测试 day=1、day=3、day=7。

public class Exercise01 {

    public static String getDayType(int day) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise01 {

    public static String getDayType(int day) {
        if (day == 1 || day == 7) {
            return "周末";
        } else {
            return "工作日";
        }
    }

    public static void main(String[] args) {
        System.out.println(getDayType(1));   // 周末
        System.out.println(getDayType(3));   // 工作日
        System.out.println(getDayType(7));   // 周末
    }
}

/* 控制台输出：
周末
工作日
周末

解析：day == 1 || day == 7 为 true 时走第一个分支返回 "周末"，
      否则返回 "工作日"。两个分支都有 return，编译通过。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：定义无参有返回值方法"
      code={`// 要求：定义方法 getBigger()，无参数，返回值类型 double。
// 方法体内声明 double a = 5.8, b = 3.2，返回较大的那个。
// 在 main 里打印调用结果。

public class Exercise02 {

    public static double getBigger() {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise02 {

    public static double getBigger() {
        double a = 5.8;
        double b = 3.2;
        return a >= b ? a : b;
    }

    public static void main(String[] args) {
        double result = getBigger();
        System.out.println("较大值：" + result);
    }
}

/* 控制台输出：
较大值：5.8

解析：三元运算符 a >= b ? a : b 返回 a=5.8；
      也可以用 if-else 写两个 return 分支，效果相同。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：void 方法 + 提前 return"
      code={`// 要求：定义方法 printScore(int score)，void，无返回值。
// 若 score < 0 或 score > 100，打印"分数不合法"并提前 return。
// 否则按如下规则打印等级：
//   90~100 => "优秀"，60~89 => "及格"，0~59 => "不及格"
// 在 main 里测试 printScore(95)、printScore(72)、printScore(45)、printScore(-5)。

public class Exercise03 {

    public static void printScore(int score) {
        // 在这里补全代码
    }

    public static void main(String[] args) {
        // 在这里补全代码
    }
}`}
      answerCode={`public class Exercise03 {

    public static void printScore(int score) {
        if (score < 0 || score > 100) {
            System.out.println("分数不合法");
            return;   // 提前结束，后面的逻辑不执行
        }
        if (score >= 90) {
            System.out.println("优秀");
        } else if (score >= 60) {
            System.out.println("及格");
        } else {
            System.out.println("不及格");
        }
    }

    public static void main(String[] args) {
        printScore(95);
        printScore(72);
        printScore(45);
        printScore(-5);
    }
}

/* 控制台输出：
优秀
及格
不及格
分数不合法

解析：-5 < 0 触发提前 return，打印"分数不合法"后方法立即结束，
      后续的 if-else 判断不执行。
*/`}
    />
  </article>
);

export default index;
