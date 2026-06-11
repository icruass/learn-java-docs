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
    <Title>三种循环的区别与选用</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前三节分别讲了 for、while、do-while，它们都能实现循环，但各有侧重。
        本节用<Text bold>表格对比</Text>三者的语法、判断时机、最少执行次数和典型场景，
        给出选用建议，再用<Text bold>同一个需求的三种写法</Text>直观感受差异，
        最后讲一个容易忽视的细节——<Text bold>循环变量的作用域</Text>。
      </Paragraph>
    </Callout>

    <Heading3>1. 三种循环横向对比</Heading3>
    <Table
      head={['对比项', 'for 循环', 'while 循环', 'do-while 循环']}
      rows={[
        [
          '语法结构',
          <InlineCode>for(初始;条件;迭代)</InlineCode>,
          <InlineCode>while(条件)</InlineCode>,
          <InlineCode>do...while(条件);</InlineCode>,
        ],
        ['判断时机', '先判断后执行', '先判断后执行', '先执行后判断'],
        ['最少执行次数', '0 次', '0 次', '1 次'],
        ['初始化位置', '在 for() 括号内', '在 while 语句前', '在 do-while 语句前'],
        ['迭代语句位置', '在 for() 括号内', '在循环体内手动写', '在循环体内手动写'],
        ['典型场景', '次数已知、固定范围遍历', '次数不确定、可能 0 次', '至少执行一次（如输入验证）'],
      ]}
    />

    <Heading3>2. 选用建议</Heading3>
    <UnorderedList>
      <ListItem>
        <Text bold>循环次数确定</Text>（如遍历 1~100、遍历数组）——优先用
        <Text accent>for 循环</Text>，三个控制部分集中在一行，结构清晰。
      </ListItem>
      <ListItem>
        <Text bold>循环次数不确定，可能一次都不需要执行</Text>（如等待条件满足）——用
        <Text accent>while 循环</Text>。
      </ListItem>
      <ListItem>
        <Text bold>至少要执行一次，再根据结果决定是否重复</Text>（如菜单提示、输入验证）——用
        <Text accent>do-while 循环</Text>，逻辑最自然。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="三句话速记选用原则">
      次数确定用 for；次数不确定、可能 0 次用 while；至少执行一次用 do-while。
    </Callout>

    <Heading3>3. 同一需求的三种写法</Heading3>
    <Paragraph>
      需求：计算 1+2+3+4+5 的和并输出，用三种循环各实现一遍，输出结果完全相同。
    </Paragraph>

    <Heading4>① for 循环版</Heading4>
    <CodeBlock
      title="SumFor.java"
      code={`public class SumFor {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 5; i++) {
            sum += i;
        }
        System.out.println("for 版求和：" + sum);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`for 版求和：15`} />

    <Heading4>② while 循环版</Heading4>
    <CodeBlock
      title="SumWhile.java"
      code={`public class SumWhile {
    public static void main(String[] args) {
        int sum = 0;
        int i = 1;          // 初始化在外面
        while (i <= 5) {
            sum += i;
            i++;            // 迭代在循环体内
        }
        System.out.println("while 版求和：" + sum);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`while 版求和：15`} />

    <Heading4>③ do-while 循环版</Heading4>
    <CodeBlock
      title="SumDoWhile.java"
      code={`public class SumDoWhile {
    public static void main(String[] args) {
        int sum = 0;
        int i = 1;
        do {
            sum += i;
            i++;
        } while (i <= 5);   // 末尾有分号
        System.out.println("do-while 版求和：" + sum);
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`do-while 版求和：15`} />

    <Callout type="success" title="三种写法的效果完全相同">
      三段代码输出的结果都是 15，在"次数确定"的场景下，for 循环写起来最简洁。
      while 和 do-while 把初始化和迭代分散在外部，代码相对冗长，
      但在次数不确定或需要至少执行一次的场景下反而更合适。
    </Callout>

    <Heading3>4. 循环变量的作用域</Heading3>
    <Paragraph>
      三种循环的循环变量作用域有一个容易忽视的差异：
    </Paragraph>

    <Heading4>for 循环：变量出循环即销毁</Heading4>
    <CodeBlock
      title="ForScope.java"
      code={`public class ForScope {
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            System.out.println("循环内 i = " + i);
        }
        // System.out.println(i);  // 编译报错！i 在这里已不存在
        System.out.println("循环已结束，i 已销毁");
    }
}`}
    />
    <Paragraph>
      在 for 括号内声明的 <InlineCode>int i</InlineCode>，作用域仅限于 for 循环内部，
      循环结束后变量立即销毁，循环外无法访问。
    </Paragraph>

    <Heading4>while / do-while：变量在循环外仍存在</Heading4>
    <CodeBlock
      title="WhileScope.java"
      code={`public class WhileScope {
    public static void main(String[] args) {
        int i = 0;           // 声明在 while 外面
        while (i < 3) {
            System.out.println("循环内 i = " + i);
            i++;
        }
        System.out.println("循环外 i = " + i);  // 合法！i 仍然存在，值为 3
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`循环内 i = 0
循环内 i = 1
循环内 i = 2
循环外 i = 3`}
    />
    <Callout type="warning" title="作用域差异的实际影响">
      while 和 do-while 的循环变量定义在外部，循环结束后<Text bold>变量仍然存在</Text>，
      这在某些场景下有用（如需要知道循环退出时变量的值），但也容易造成变量污染。
      for 循环变量在循环外不可见，更不容易出错——这也是次数确定时优先选 for 的原因之一。
    </Callout>

    <Table
      head={['', 'for 循环变量', 'while/do-while 循环变量']}
      rows={[
        ['声明位置', 'for() 括号内', '循环语句外部'],
        ['循环内是否可用', '是', '是'],
        ['循环外是否可用', '否（已销毁）', '是（仍存在）'],
      ]}
    />

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：根据场景选循环类型"
      code={`问：下面三个场景，分别最适合用哪种循环？请说明理由。

场景 A：遍历班级 30 名同学的成绩，逐一打印。
场景 B：读取用户输入的密码，直到输入正确为止（不知道用户会输错几次）。
场景 C：自动售货机弹出选择菜单，用户至少要看到一次菜单，
         再决定是否继续操作。`}
      answerCode={`场景 A：for 循环
  理由：循环次数确定（固定 30 次），for 最简洁。
  示例：for (int i = 0; i < 30; i++) { ... }

场景 B：while 循环
  理由：循环次数不确定（可能第一次就对了，也可能错很多次），
        且密码第一次可能就正确（不需要强制执行一次），while 更合适。
  示例：while (!password.equals(correct)) { ... }

场景 C：do-while 循环
  理由：菜单至少要展示一次（先展示，再判断用户是否继续），
        "先执行后判断"的 do-while 语义最贴切。
  示例：do { showMenu(); choice = getUserInput(); } while (choice != 0);`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习 2：分析作用域问题"
      code={`问：下面代码能正常编译运行吗？如果不能，错在哪里？如何修复？

public class ScopeTest {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
        System.out.println("最终 i = " + i);  // 这行对吗？
    }
}`}
      answerCode={`不能正常编译，会报错：找不到符号 i。

原因：for 循环中声明的 int i 作用域仅限于循环内部，
      循环结束后 i 就被销毁了，在循环外使用 i 会编译报错。

修复方案（把 i 声明在 for 外面）：
public class ScopeTest {
    public static void main(String[] args) {
        int i;                          // 声明在外面
        for (i = 1; i <= 5; i++) {      // 不再在括号内声明
            System.out.println(i);
        }
        System.out.println("最终 i = " + i);  // 合法，输出 6
    }
}

控制台输出：
1
2
3
4
5
最终 i = 6

注意：循环结束后 i 的值是 6（因为 i++ 执行到 i=6 时条件 i<=5 才变 false）。`}
    />
  </article>
);

export default index;
