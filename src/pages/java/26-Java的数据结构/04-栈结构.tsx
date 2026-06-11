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
    <Title>栈结构（Stack）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>栈（Stack）</Text>是一种只允许在同一端进行插入和删除操作的线性数据结构。
        这一端称为<Text bold>栈顶（Top）</Text>，另一端称为<Text bold>栈底（Bottom）</Text>。
        栈的核心特征是<Text bold>后进先出（LIFO，Last In First Out）</Text>——最后压入的元素最先弹出，
        就像一摞盘子，只能从最顶上取。本节讲清栈的原理与操作、两种实现思路、Java 中的栈 API，
        并用「括号匹配」这一经典案例演示栈的威力，最后附练习巩固。
      </Paragraph>
    </Callout>

    <Heading3>1. 栈的核心特征：后进先出（LIFO）</Heading3>
    <Paragraph>
      栈只开放<Text bold>一端</Text>（栈顶）供操作，所有的插入和删除都发生在栈顶：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>压栈（push）</Text>：把新元素放到栈顶，栈顶指针上移。
      </ListItem>
      <ListItem>
        <Text bold>出栈（pop）</Text>：取出并移除栈顶元素，栈顶指针下移。
      </ListItem>
      <ListItem>
        <Text bold>查看栈顶（peek / top）</Text>：只查看栈顶元素的值，不移除它。
      </ListItem>
      <ListItem>
        <Text bold>判空（isEmpty）</Text>：判断栈内是否没有任何元素。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      形象理解：羽毛球筒——最后放进去的球最先被取出；
      手枪弹夹——最后压入的子弹最先打出。
      这种「后进先出」的顺序，使栈天然适合处理"反序"和"嵌套匹配"类问题。
    </Paragraph>
    <Callout type="tip" title="栈顶与栈底">
      栈顶（Top）是活跃端，所有操作都在这里发生；
      栈底（Bottom）是固定端，压栈越来越高，出栈越来越低。
      初始时栈为空，栈顶指针通常用 -1（数组实现）或 null（链表实现）表示空栈。
    </Callout>

    <Heading3>2. 栈的基本操作与时间复杂度</Heading3>
    <Table
      head={['操作', '方法名（Java）', '说明', '时间复杂度']}
      rows={[
        ['压栈', 'push(e)', '将元素 e 放到栈顶', 'O(1)'],
        ['出栈', 'pop()', '移除并返回栈顶元素', 'O(1)'],
        ['查看栈顶', 'peek()', '返回栈顶元素但不移除', 'O(1)'],
        ['判空', 'isEmpty()', '栈内无元素则返回 true', 'O(1)'],
        ['栈大小', 'size()', '返回栈中元素个数', 'O(1)'],
      ]}
    />
    <Paragraph>
      栈的所有核心操作都是 <Text bold>O(1)</Text>——无论栈有多少元素，压栈和出栈都只操作栈顶，
      不需要遍历，因此效率极高。
    </Paragraph>
    <Callout type="warning" title="对空栈执行 pop / peek 会抛出异常">
      对空栈调用 <InlineCode>pop()</InlineCode> 或 <InlineCode>peek()</InlineCode>，
      Java 的 <InlineCode>Stack</InlineCode> 类会抛出
      <InlineCode>EmptyStackException</InlineCode>，
      <InlineCode>ArrayDeque</InlineCode> 的 <InlineCode>pop()</InlineCode> 会抛出
      <InlineCode>NoSuchElementException</InlineCode>。
      操作前务必先用 <InlineCode>isEmpty()</InlineCode> 判断。
    </Callout>

    <Heading3>3. 两种实现思路：数组实现 vs 链表实现</Heading3>
    <Paragraph>
      栈是抽象数据结构，底层可以用<Text bold>数组</Text>或<Text bold>链表</Text>来实现，两种方案各有取舍：
    </Paragraph>
    <Table
      head={['实现方式', '核心思路', '优点', '缺点']}
      rows={[
        [
          '数组实现',
          '用一个数组存储元素，用 top 变量记录栈顶下标；push 时 top++，pop 时 top--',
          '随机访问快、内存连续、缓存友好',
          '容量固定，扩容需复制数组；可能出现「栈溢出（Stack Overflow）」',
        ],
        [
          '链表实现',
          '用单链表，头部作为栈顶；push 时头插新节点，pop 时删除头节点',
          '动态大小，无需预分配容量，不会溢出',
          '每个节点额外存储指针，内存开销稍大；不连续，缓存不友好',
        ],
      ]}
    />
    <Callout type="tip" title="栈溢出（Stack Overflow）的两个含义">
      <UnorderedList>
        <ListItem>
          <Text bold>数据结构层面</Text>：数组实现的栈已满，再 push 就会越界——这是栈溢出。
        </ListItem>
        <ListItem>
          <Text bold>JVM 层面</Text>：方法调用栈（Call Stack）太深（如无限递归），
          JVM 会抛出 <InlineCode>StackOverflowError</InlineCode>，本质是方法调用栈溢出。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>4. 栈的典型应用场景</Heading3>
    <OrderedList>
      <ListItem>
        <Text bold>方法调用栈与递归</Text>：JVM 为每次方法调用压入一个栈帧（Stack Frame），
        方法返回时弹出栈帧。递归调用就是不断压栈，递归返回就是不断弹栈。
      </ListItem>
      <ListItem>
        <Text bold>括号匹配</Text>：遇到左括号压栈，遇到右括号弹栈并检查是否匹配。
        扫描结束时栈为空则合法（本节详细演示）。
      </ListItem>
      <ListItem>
        <Text bold>表达式求值</Text>：中缀表达式转后缀（逆波兰）表达式、
        后缀表达式的计算，都依赖操作符栈和操作数栈。
      </ListItem>
      <ListItem>
        <Text bold>浏览器的前进/后退</Text>：访问新页面压栈；点击后退弹出当前页压入前进栈；
        点击前进从前进栈弹出。两个栈配合实现导航历史。
      </ListItem>
      <ListItem>
        <Text bold>撤销操作（Ctrl+Z）</Text>：每次编辑操作压栈；撤销时弹出最近操作并反向执行；
        几乎所有编辑器的撤销/重做功能都用两个栈实现。
      </ListItem>
      <ListItem>
        <Text bold>深度优先搜索（DFS）</Text>：递归 DFS 隐式使用调用栈；
        非递归 DFS 显式维护一个栈。
      </ListItem>
    </OrderedList>

    <Heading3>5. Java 中的栈：Stack 类 vs ArrayDeque</Heading3>
    <Paragraph>
      Java 提供了两种主要方式使用栈：
    </Paragraph>
    <Table
      head={['方式', '类/接口', '推荐程度', '说明']}
      rows={[
        ['遗留类', 'java.util.Stack', '不推荐', '继承自 Vector，线程安全但性能差，设计有缺陷，已是遗留 API'],
        ['推荐方式', 'java.util.ArrayDeque', '强烈推荐', '实现 Deque 接口，用 push/pop/peek 即可当栈用，性能优秀'],
        ['链表实现', 'java.util.LinkedList', '可用', '也实现 Deque，push/pop/peek 与 ArrayDeque 相同，但内存开销稍大'],
      ]}
    />
    <Callout type="danger" title="不要在新代码中使用 Stack 类">
      Java 官方文档明确建议：若需要使用栈，应优先使用 <InlineCode>Deque</InlineCode> 接口及其实现
      （如 <InlineCode>ArrayDeque</InlineCode>），而不是 <InlineCode>Stack</InlineCode> 类。
      <InlineCode>Stack</InlineCode> 继承自 <InlineCode>Vector</InlineCode>，
      导致它暴露了 <InlineCode>get(index)</InlineCode> 等随机访问方法，破坏了栈的封装性。
    </Callout>
    <Paragraph>
      用 <InlineCode>ArrayDeque</InlineCode> 当栈时，对应的方法名如下：
    </Paragraph>
    <Table
      head={['栈操作', 'Stack 类方法', 'ArrayDeque 作为栈的方法', '备注']}
      rows={[
        ['压栈', 'push(e)', 'push(e) 或 addFirst(e)', '压入栈顶（deque 的头部）'],
        ['出栈', 'pop()', 'pop() 或 removeFirst()', '移除并返回栈顶；空栈抛异常'],
        ['查看栈顶', 'peek()', 'peek() 或 peekFirst()', '只查看不移除；空栈返回 null'],
        ['判空', 'isEmpty()', 'isEmpty()', '通用'],
      ]}
    />

    <Heading3>6. 代码示例</Heading3>

    <Heading4>示例 1：ArrayDeque 基本栈操作演示</Heading4>
    <Paragraph>
      演示 <InlineCode>ArrayDeque</InlineCode> 作为栈的完整操作流程，帮助理解 LIFO 特性。
    </Paragraph>
    <CodeBlock
      title="StackBasicDemo.java"
      code={`import java.util.ArrayDeque;
import java.util.Deque;

public class StackBasicDemo {
    public static void main(String[] args) {
        // 用 ArrayDeque 充当栈（推荐写法）
        Deque<String> stack = new ArrayDeque<>();

        System.out.println("=== 压栈 push ===");
        stack.push("第1个：苹果");
        stack.push("第2个：香蕉");
        stack.push("第3个：橙子");
        System.out.println("压栈后，栈中元素数量：" + stack.size());
        System.out.println("当前栈顶（peek）：" + stack.peek());  // 只看，不移除

        System.out.println();
        System.out.println("=== 出栈 pop（LIFO 顺序）===");
        while (!stack.isEmpty()) {
            System.out.println("弹出：" + stack.pop());
        }

        System.out.println();
        System.out.println("栈是否为空：" + stack.isEmpty());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`=== 压栈 push ===
压栈后，栈中元素数量：3
当前栈顶（peek）：第3个：橙子

=== 出栈 pop（LIFO 顺序）===
弹出：第3个：橙子
弹出：第2个：香蕉
弹出：第1个：苹果

栈是否为空：true`}
    />
    <Paragraph>
      三个元素依次压入：苹果 → 香蕉 → 橙子。弹出顺序是橙子 → 香蕉 → 苹果，
      与压入顺序<Text bold>完全相反</Text>，这正是 LIFO 的体现。
      <InlineCode>peek()</InlineCode> 查看了栈顶「橙子」，但栈的大小没有变化。
    </Paragraph>

    <Heading4>示例 2：经典应用——括号匹配</Heading4>
    <Paragraph>
      给定一个只包含 <InlineCode>(</InlineCode>、<InlineCode>)</InlineCode>、
      <InlineCode>[</InlineCode>、<InlineCode>]</InlineCode>、
      <InlineCode>{`{`}</InlineCode>、<InlineCode>{`}`}</InlineCode> 的字符串，
      判断括号是否合法匹配。
    </Paragraph>
    <Paragraph>
      算法思路：遍历字符串每个字符：
    </Paragraph>
    <OrderedList>
      <ListItem>遇到左括号（<InlineCode>(</InlineCode>、<InlineCode>[</InlineCode>、<InlineCode>{`{`}</InlineCode>）：压栈。</ListItem>
      <ListItem>遇到右括号：先判断栈是否为空（为空则不合法），再弹出栈顶，检查是否与当前右括号匹配。</ListItem>
      <ListItem>遍历结束：栈为空则完全合法，栈不为空说明有未闭合的左括号。</ListItem>
    </OrderedList>
    <CodeBlock
      title="BracketMatcher.java"
      code={`import java.util.ArrayDeque;
import java.util.Deque;

public class BracketMatcher {

    public static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            // 遇到左括号，压栈
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            }
            // 遇到右括号，弹出栈顶并比对
            else if (c == ')' || c == ']' || c == '}') {
                // 栈为空：没有对应的左括号，直接不合法
                if (stack.isEmpty()) {
                    return false;
                }
                char top = stack.pop();
                // 检查弹出的左括号是否与当前右括号配对
                if (c == ')' && top != '(') return false;
                if (c == ']' && top != '[') return false;
                if (c == '}' && top != '{') return false;
            }
        }

        // 遍历结束后，栈为空才说明所有括号都已匹配
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        String[] testCases = {
            "()",
            "()[]{}",
            "(]",
            "([)]",
            "{[]}",
            "(((",
            ""
        };

        for (String test : testCases) {
            System.out.println("\"" + test + "\"  =>  " + (isValid(test) ? "合法" : "不合法"));
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`"()"  =>  合法
"()[]{}"  =>  合法
"(]"  =>  不合法
"([)]"  =>  不合法
"{[]}"  =>  合法
"((("  =>  不合法
""  =>  合法`}
    />
    <Paragraph>
      逐条分析几个关键用例：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>"([)]"</InlineCode>：压入 <InlineCode>(</InlineCode>，再压入 <InlineCode>[</InlineCode>，
        遇到 <InlineCode>)</InlineCode> 时弹出的是 <InlineCode>[</InlineCode>，不匹配 → 不合法。
      </ListItem>
      <ListItem>
        <InlineCode>"{[]}"</InlineCode>：压 <InlineCode>{`{`}</InlineCode>，压 <InlineCode>[</InlineCode>，
        遇 <InlineCode>]</InlineCode> 弹出 <InlineCode>[</InlineCode> 匹配，
        遇 <InlineCode>{`}`}</InlineCode> 弹出 <InlineCode>{`{`}</InlineCode> 匹配，栈空 → 合法。
      </ListItem>
      <ListItem>
        <InlineCode>"((("</InlineCode>：三个左括号压栈，遍历结束栈不空 → 不合法。
      </ListItem>
    </UnorderedList>

    <Heading4>示例 3：方法调用栈与递归的可视化</Heading4>
    <Paragraph>
      通过简单的递归求阶乘，直观感受方法调用栈的压栈/弹栈过程。
    </Paragraph>
    <CodeBlock
      title="RecursionStackDemo.java"
      code={`public class RecursionStackDemo {

    public static int factorial(int n) {
        System.out.println("  >> 压栈：factorial(" + n + ") 进入");
        if (n <= 1) {
            System.out.println("  << 弹栈：factorial(" + n + ") 返回 1（到底了）");
            return 1;
        }
        int result = n * factorial(n - 1);   // 递归：继续压栈
        System.out.println("  << 弹栈：factorial(" + n + ") 返回 " + result);
        return result;
    }

    public static void main(String[] args) {
        System.out.println("计算 factorial(4)：");
        int ans = factorial(4);
        System.out.println("最终结果：" + ans);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`计算 factorial(4)：
  >> 压栈：factorial(4) 进入
  >> 压栈：factorial(3) 进入
  >> 压栈：factorial(2) 进入
  >> 压栈：factorial(1) 进入
  << 弹栈：factorial(1) 返回 1（到底了）
  << 弹栈：factorial(2) 返回 2
  << 弹栈：factorial(3) 返回 6
  << 弹栈：factorial(4) 返回 24
最终结果：24`}
    />
    <Paragraph>
      输出清晰地展示了调用栈的工作：<InlineCode>factorial(4)</InlineCode> 调用
      <InlineCode>factorial(3)</InlineCode>，一层层向下压栈，直到到达基础情况；
      然后依次弹栈，每层拿到下层返回值计算自己的结果。
      整个过程由 JVM 方法调用栈（也叫执行栈）自动管理，
      这正是递归的底层机制。
    </Paragraph>

    <Heading3>7. 知识要点汇总</Heading3>
    <Table
      head={['要点', '说明']}
      rows={[
        ['核心特性', 'LIFO（后进先出），只在栈顶一端操作'],
        ['三大操作', 'push（压栈）、pop（出栈）、peek（查看栈顶），均 O(1)'],
        ['两种实现', '数组实现（容量固定，缓存友好）；链表实现（动态大小，有额外指针开销）'],
        ['Java 推荐用法', 'ArrayDeque 实现 Deque 接口，用 push/pop/peek 方法'],
        ['避免用 Stack 类', '继承 Vector，暴露随机访问，设计有缺陷，已是遗留 API'],
        ['典型应用', '方法调用栈、括号匹配、表达式求值、撤销功能、DFS'],
        ['注意事项', '操作前先 isEmpty() 判断，避免空栈异常'],
      ]}
    />
    <Callout type="success" title="小结">
      <Paragraph>栈的核心记忆口诀：</Paragraph>
      <UnorderedList>
        <ListItem>
          <Text bold>后进先出（LIFO）</Text>：最后压入的最先弹出，就像一摞盘子。
        </ListItem>
        <ListItem>
          <Text bold>只在栈顶操作</Text>：push / pop / peek 三步走，全是 O(1)。
        </ListItem>
        <ListItem>
          <Text bold>Java 用 ArrayDeque</Text>：不要用遗留的 Stack 类。
        </ListItem>
        <ListItem>
          <Text bold>括号匹配是经典</Text>：左括号压栈，右括号弹栈比对，最终栈空即合法。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：用栈判断字符串是否为回文"
      code={`// 要求：用栈判断一个字符串是否是回文（忽略大小写，只判断字母和数字字符）。
// 思路提示：将字符串前半部分的字符压栈，然后用后半部分依次与出栈内容对比。
// 示例：
//   "racecar"  =>  true
//   "hello"    =>  false
//   "A man a plan a canal Panama" 去除空格后 => true（可选挑战）

import java.util.ArrayDeque;
import java.util.Deque;

public class PalindromeStack {

    public static boolean isPalindrome(String s) {
        // 只保留字母和数字，并转为小写
        StringBuilder clean = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) {
                clean.append(Character.toLowerCase(c));
            }
        }
        String str = clean.toString();
        int len = str.length();

        Deque<Character> stack = new ArrayDeque<>();

        // 补全：将前半部分字符压栈

        // 补全：从中间位置开始，用后半部分字符与出栈字符比对

        return true; // 补全返回值
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));   // true
        System.out.println(isPalindrome("hello"));     // false
        System.out.println(isPalindrome("A man a plan a canal Panama"));  // true
    }
}`}
      answerCode={`import java.util.ArrayDeque;
import java.util.Deque;

public class PalindromeStack {

    public static boolean isPalindrome(String s) {
        // 只保留字母和数字，并转为小写
        StringBuilder clean = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) {
                clean.append(Character.toLowerCase(c));
            }
        }
        String str = clean.toString();
        int len = str.length();

        Deque<Character> stack = new ArrayDeque<>();

        // 将前半部分字符压栈
        for (int i = 0; i < len / 2; i++) {
            stack.push(str.charAt(i));
        }

        // 奇数长度时，中间字符跳过（len/2 已经指向中间之后的位置在奇偶处理上是一致的）
        // 从后半部分开始，与出栈字符逐一比对
        int start = (len % 2 == 0) ? len / 2 : len / 2 + 1;
        for (int i = start; i < len; i++) {
            if (stack.pop() != str.charAt(i)) {
                return false;
            }
        }

        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
        System.out.println(isPalindrome("hello"));
        System.out.println(isPalindrome("A man a plan a canal Panama"));
    }
}

/* 控制台输出：
true
false
true

解析：
  "racecar" 长度 7，前 3 个字符 r、a、c 压栈。
  中间字符 e 跳过（start = 4）。
  后 3 个字符 c、a、r 依次与出栈的 c、a、r 比对，全部匹配 => true。

  "hello" 长度 5，前 2 个字符 h、e 压栈。
  中间字符 l 跳过（start = 3）。
  后 2 个字符 l、o 依次与出栈的 e、h 比对，第一次就不匹配（l != e）=> false。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：用栈实现十进制转二进制"
      code={`// 要求：利用栈，将一个正整数转换为其二进制字符串表示。
// 算法：反复对数字除以 2，将余数依次压栈；最后出栈拼接即为二进制（利用了栈的反序特性）。
// 示例：
//   10  => "1010"
//   255 => "11111111"
//   1   => "1"

import java.util.ArrayDeque;
import java.util.Deque;

public class DecimalToBinary {

    public static String toBinary(int n) {
        if (n == 0) return "0";

        Deque<Integer> stack = new ArrayDeque<>();

        // 补全：反复除以 2，余数压栈

        // 补全：出栈拼接字符串

        return ""; // 补全返回值
    }

    public static void main(String[] args) {
        System.out.println(toBinary(10));   // 1010
        System.out.println(toBinary(255));  // 11111111
        System.out.println(toBinary(1));    // 1
    }
}`}
      answerCode={`import java.util.ArrayDeque;
import java.util.Deque;

public class DecimalToBinary {

    public static String toBinary(int n) {
        if (n == 0) return "0";

        Deque<Integer> stack = new ArrayDeque<>();

        // 反复除以 2，将余数（0 或 1）压栈
        while (n > 0) {
            stack.push(n % 2);
            n = n / 2;
        }

        // 出栈顺序与压栈顺序相反，恰好是高位到低位的正确二进制顺序
        StringBuilder sb = new StringBuilder();
        while (!stack.isEmpty()) {
            sb.append(stack.pop());
        }

        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(toBinary(10));
        System.out.println(toBinary(255));
        System.out.println(toBinary(1));
    }
}

/* 控制台输出：
1010
11111111
1

解析：以 10 为例：
  10 / 2 = 5 余 0  -> 压入 0
   5 / 2 = 2 余 1  -> 压入 1
   2 / 2 = 1 余 0  -> 压入 0
   1 / 2 = 0 余 1  -> 压入 1
  栈中（从顶到底）：1, 0, 1, 0
  出栈顺序（LIFO）：1, 0, 1, 0 => 拼接得 "1010" ✓

  正是栈的「反序输出」特性，让我们天然得到正确的高位到低位顺序。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：用栈模拟浏览器的后退功能"
      code={`// 要求：模拟浏览器的访问历史与后退功能。
// 规则：
//   visit(url)   访问新页面，将当前页压入「后退栈」，显示当前页面
//   back()       后退：从「后退栈」弹出上一页面作为当前页；若栈空则提示「没有更多历史记录」
// 要求用 ArrayDeque 作为后退栈，并按以下顺序操作：
//   访问 "百度"、"谷歌"、"淘宝"
//   后退一次 -> 应看到 "谷歌"
//   后退一次 -> 应看到 "百度"
//   再后退   -> 提示没有更多历史

import java.util.ArrayDeque;
import java.util.Deque;

public class BrowserHistory {
    // 补全成员变量：后退栈 和 当前页面字段

    public void visit(String url) {
        // 补全：将当前页压入后退栈，更新当前页面为 url，并打印
    }

    public void back() {
        // 补全：后退逻辑
    }

    public static void main(String[] args) {
        BrowserHistory browser = new BrowserHistory();
        browser.visit("百度");
        browser.visit("谷歌");
        browser.visit("淘宝");
        browser.back();
        browser.back();
        browser.back();
    }
}`}
      answerCode={`import java.util.ArrayDeque;
import java.util.Deque;

public class BrowserHistory {
    private Deque<String> backStack = new ArrayDeque<>();  // 后退栈
    private String currentPage = null;                     // 当前页面

    public void visit(String url) {
        if (currentPage != null) {
            backStack.push(currentPage);  // 将当前页压入后退栈
        }
        currentPage = url;
        System.out.println("当前页面：" + currentPage + "（后退栈深度：" + backStack.size() + "）");
    }

    public void back() {
        if (backStack.isEmpty()) {
            System.out.println("后退失败：没有更多历史记录");
            return;
        }
        currentPage = backStack.pop();  // 弹出上一个页面
        System.out.println("后退到：" + currentPage + "（后退栈深度：" + backStack.size() + "）");
    }

    public static void main(String[] args) {
        BrowserHistory browser = new BrowserHistory();
        browser.visit("百度");
        browser.visit("谷歌");
        browser.visit("淘宝");
        browser.back();
        browser.back();
        browser.back();
    }
}

/* 控制台输出：
当前页面：百度（后退栈深度：0）
当前页面：谷歌（后退栈深度：1）
当前页面：淘宝（后退栈深度：2）
后退到：谷歌（后退栈深度：1）
后退到：百度（后退栈深度：0）
后退失败：没有更多历史记录

解析：
  visit("百度")：currentPage = null，不压栈，currentPage = "百度"，栈空（深度 0）。
  visit("谷歌")：将 "百度" 压栈，currentPage = "谷歌"，栈深度 1。
  visit("淘宝")：将 "谷歌" 压栈，currentPage = "淘宝"，栈深度 2。
  back()：弹出 "谷歌"，currentPage = "谷歌"，栈深度 1。
  back()：弹出 "百度"，currentPage = "百度"，栈深度 0。
  back()：栈为空，打印提示。
*/`}
    />
  </article>
);

export default index;
