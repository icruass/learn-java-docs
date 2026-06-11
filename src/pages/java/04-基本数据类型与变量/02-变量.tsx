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
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>变量</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        变量是程序中存储数据的基本单元，也是一切计算的起点。
        本节讲清变量的<Text bold>三要素</Text>（数据类型、变量名、值）、
        三种定义格式（声明同时初始化 / 先声明后赋值 / 一行定义多个），
        以及三个最容易让新手踩坑的规则：
        <Text bold>局部变量必须初始化</Text>、<Text bold>作用域</Text>、
        <Text bold>同一作用域不能重名</Text>。
      </Paragraph>
    </Callout>

    <Heading3>1. 变量是什么</Heading3>
    <Paragraph>
      可以把变量想象成一个贴了<Text bold>标签</Text>的内存盒子：
      盒子的<Text bold>大小（数据类型）</Text>决定能放什么，
      <Text bold>标签（变量名）</Text>是你找到它的方式，
      <Text bold>内容（值）</Text>随时可以换新的——这正是"变"量的含义。
    </Paragraph>
    <Table
      head={['要素', '含义', '示例']}
      rows={[
        ['数据类型', '变量能存放的数据种类，同时决定内存大小', <InlineCode>int</InlineCode>],
        ['变量名', '程序员给变量起的名字，用来读取或修改它的值', <InlineCode>age</InlineCode>],
        ['值', '变量当前存放的数据', <InlineCode>18</InlineCode>],
      ]}
    />

    <Heading3>2. 变量的三种定义格式</Heading3>

    <Heading4>① 声明并初始化（最常用）</Heading4>
    <Paragraph>
      一步完成：声明类型、起名、赋初值。格式为：
    </Paragraph>
    <CodeBlock
      language="text"
      title="格式"
      code={`数据类型 变量名 = 值;`}
    />
    <CodeBlock
      title="示例"
      code={`int age = 18;
double price = 9.9;
char grade = 'A';
boolean isOnline = true;`}
    />

    <Heading4>② 先声明，后赋值</Heading4>
    <Paragraph>
      先只声明类型和名字，暂不给初值；之后在需要时再赋值。
    </Paragraph>
    <CodeBlock
      title="示例"
      code={`int score;          // 仅声明，内存已分配，但没有有效值
score = 95;         // 赋值`}
    />
    <Callout type="danger" title="局部变量使用前必须赋值">
      <Paragraph>
        在方法内部定义的变量叫<Text bold>局部变量</Text>。局部变量没有默认值，
        如果在<Text bold>赋值之前读取</Text>它，编译器会直接报错：
      </Paragraph>
      <CodeBlock
        title="❌ 编译报错示范"
        code={`public class Demo {
    public static void main(String[] args) {
        int x;
        System.out.println(x);  // ❌ 编译报错：variable x might not have been initialized
    }
}`}
      />
      <Paragraph>
        修复方式：在使用前补上赋值 <InlineCode>x = 0;</InlineCode>，
        或者在声明时直接初始化 <InlineCode>int x = 0;</InlineCode>。
      </Paragraph>
    </Callout>

    <Heading4>③ 一行定义多个同类型变量</Heading4>
    <Paragraph>
      同一类型的多个变量可以写在一行，用英文逗号分隔。每个变量可以有或没有初始值。
    </Paragraph>
    <CodeBlock
      title="示例"
      code={`int a = 1, b = 2, c;   // a=1, b=2, c 未初始化（使用前必须赋值）
double x = 1.5, y = 2.5;`}
    />
    <Callout type="tip">
      虽然语法允许一行定义多个变量，但如果每个变量含义不同，建议<Text bold>各自单独一行</Text>，
      可读性更好，也方便加注释。
    </Callout>

    <Heading3>3. 变量的值可以被重新赋值</Heading3>
    <Paragraph>
      变量的值不是固定的——可以随时用 <InlineCode>=</InlineCode> 给它赋一个新值，
      新值会<Text bold>覆盖</Text>旧值。
    </Paragraph>
    <CodeBlock
      title="VariableReassign.java"
      code={`public class VariableReassign {
    public static void main(String[] args) {
        int score = 60;
        System.out.println("初始成绩：" + score);

        score = 80;   // 重新赋值，旧值 60 被覆盖
        System.out.println("第一次更新：" + score);

        score = score + 10;   // 在原来基础上加 10，结果 90
        System.out.println("第二次更新：" + score);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`初始成绩：60
第一次更新：80
第二次更新：90`}
    />
    <Paragraph>
      重点理解 <InlineCode>score = score + 10;</InlineCode> 这一行：
      先读取 <InlineCode>score</InlineCode> 当前值（80），加上 10 得到 90，
      再把 90 写回 <InlineCode>score</InlineCode>，完成覆盖。
      这是变量"可变"本质的最直接体现。
    </Paragraph>

    <Heading3>4. 作用域：变量在哪里有效</Heading3>
    <Paragraph>
      变量的<Text bold>作用域</Text>就是它"能被访问"的代码范围——
      从声明那一行开始，到<Text bold>包含它的那对花括号结束</Text>为止。
      出了作用域，变量就不存在了，再访问会编译报错。
    </Paragraph>
    <CodeBlock
      title="ScopeDemo.java"
      code={`public class ScopeDemo {
    public static void main(String[] args) {
        int outer = 10;   // outer 的作用域：从这行到 main 方法的 }

        if (outer > 5) {
            int inner = 20;   // inner 的作用域：从这行到 if 块的 }
            System.out.println(outer);   // ✅ outer 在这里可以访问
            System.out.println(inner);   // ✅ inner 在这里可以访问
        }

        System.out.println(outer);       // ✅ outer 仍在作用域内
        // System.out.println(inner);    // ❌ 编译报错：cannot find symbol
        // inner 的作用域已在 if 块的 } 处结束，这里访问不到它
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`10
20
10`}
    />

    <Heading3>5. 同一作用域内不能重复定义同名变量</Heading3>
    <Callout type="danger" title="同名变量重复声明会编译报错">
      <Paragraph>
        在<Text bold>同一个作用域</Text>内，不能声明两个名字相同的变量，
        否则编译报错"<Text bold>variable is already defined</Text>"。
      </Paragraph>
      <CodeBlock
        title="❌ 重复声明示范"
        code={`public class DuplicateVar {
    public static void main(String[] args) {
        int count = 1;
        int count = 2;   // ❌ 编译报错：variable count is already defined in method main(String[])
    }
}`}
      />
      <Paragraph>
        修复：去掉第二个 <InlineCode>int</InlineCode> 声明，直接赋值
        <InlineCode>count = 2;</InlineCode> 即可。
      </Paragraph>
    </Callout>

    <Heading3>6. 变量命名规范</Heading3>
    <Table
      head={['规则', '说明', '示例']}
      rows={[
        ['合法字符', '字母、数字、下划线 _、美元符 $，数字不能开头', <InlineCode>age, _name, $id, num1</InlineCode>],
        ['大小写敏感', 'age 和 Age 是两个不同的变量', <InlineCode>int age; int Age;</InlineCode>],
        ['不能是关键字', 'int、class、for 等是保留字，不能用作变量名', ''],
        ['小驼峰命名', '多个单词时首词小写，后续词首字母大写（Java 惯例）', <InlineCode>userName, totalPrice, isOnline</InlineCode>],
      ]}
    />
    <Callout type="tip">
      变量名要做到<Text bold>"见名知意"</Text>：<InlineCode>int stuAge = 18;</InlineCode> 远比
      <InlineCode>int a = 18;</InlineCode> 可读性更好。
      项目中的代码往往需要维护很多年，清晰的命名能为你（和你的同事）省去大量阅读理解的时间。
    </Callout>

    <Heading3>7. 综合示例：常见错误演示与修复</Heading3>
    <CodeBlock
      title="VariablePitfalls.java — 正确版"
      code={`public class VariablePitfalls {
    public static void main(String[] args) {
        // ✅ 声明并初始化
        int total = 0;

        // ✅ 先声明后赋值（使用前已赋值）
        int bonus;
        bonus = 100;

        // ✅ 重新赋值（覆盖，不是重新声明）
        total = 200;
        total = total + bonus;   // total = 200 + 100 = 300

        System.out.println("total = " + total);
        System.out.println("bonus = " + bonus);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`total = 300
bonus = 100`}
    />

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先独立思考，再点右上角 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：找出错误并改正"
      code={`// 下面代码有 3 处错误，请逐一找出并说明如何修复。

public class FindBugs {
    public static void main(String[] args) {
        int x;
        System.out.println(x);       // 错误 A

        int y = 10;
        int y = 20;                  // 错误 B

        if (y > 5) {
            int z = 99;
        }
        System.out.println(z);       // 错误 C
    }
}`}
      answerCode={`三处错误分析：

错误 A：int x 声明后未赋值就使用
  报错：variable x might not have been initialized
  修复：在声明时初始化，如 int x = 0;
  或在 println 之前补上 x = 0;

错误 B：同一作用域内重复声明变量 y
  报错：variable y is already defined in method main(String[])
  修复：去掉第二行的 int，改为直接赋值 y = 20;

错误 C：变量 z 在 if 块之外访问
  报错：cannot find symbol（找不到符号 z）
  原因：z 的作用域仅限于 if 块内部（那对花括号之间），
        出了 if 块 z 就不存在了。
  修复：把 z 的声明移到 if 块外面：
        int z = 0;
        if (y > 5) { z = 99; }
        System.out.println(z);

修复后的完整代码：

public class FindBugs {
    public static void main(String[] args) {
        int x = 0;
        System.out.println(x);   // 输出 0

        int y = 10;
        y = 20;                  // 直接赋值，不重新声明
        System.out.println(y);   // 输出 20

        int z = 0;
        if (y > 5) {
            z = 99;
        }
        System.out.println(z);   // 输出 99
    }
}`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习 2：预测变量多次赋值后的输出"
      code={`// 仔细阅读下面代码，预测控制台依次输出什么？

public class Predict {
    public static void main(String[] args) {
        int a = 5;
        int b = a;       // b 得到 a 当前的值
        a = 10;          // 修改 a 不影响 b

        System.out.println("a = " + a);
        System.out.println("b = " + b);

        int c = 1;
        c = c * 2;
        c = c * 2;
        c = c * 2;
        System.out.println("c = " + c);
    }
}`}
      answerCode={`控制台输出：

a = 10
b = 5
c = 8

逐步分析：

a = 5：a 的值为 5
b = a：把 a 的当前值 5 复制给 b；b = 5
a = 10：a 被重新赋值为 10，但 b 不受影响，b 仍然是 5
  → 打印 a = 10，b = 5

c = 1 初始值
c = c * 2 → c = 1 * 2 = 2
c = c * 2 → c = 2 * 2 = 4
c = c * 2 → c = 4 * 2 = 8
  → 打印 c = 8

关键点：int b = a 是"值的复制"，不是"绑定别名"。
修改 a 之后，b 不会跟着变——这是基本数据类型赋值的重要特性。`}
    />

    <UnorderedList>
      <ListItem>
        变量三要素：<Text bold>数据类型、变量名、值</Text>。
      </ListItem>
      <ListItem>
        局部变量<Text bold>使用前必须赋值</Text>，否则编译报错。
      </ListItem>
      <ListItem>
        变量的作用域从声明处开始，到<Text bold>所在花括号结束</Text>为止。
      </ListItem>
      <ListItem>
        同一作用域内<Text bold>不能重复声明同名变量</Text>；重新赋值时直接写
        <InlineCode>变量名 = 新值;</InlineCode>，不要再写类型。
      </ListItem>
      <ListItem>
        基本类型赋值是<Text bold>值的复制</Text>，两个变量相互独立，修改一个不影响另一个。
      </ListItem>
    </UnorderedList>
  </article>
);

export default index;
