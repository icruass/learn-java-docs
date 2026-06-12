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
    <Title>Queue 与 Deque 接口</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>Queue</InlineCode>（队列）和 <InlineCode>Deque</InlineCode>（双端队列）是
        <InlineCode>Collection</InlineCode> 体系里专门描述「先进先出 / 两端操作」语义的接口。
        本节讲清队列的两套方法（抛异常 vs 返回特殊值）、<InlineCode>Deque</InlineCode> 如何同时充当
        <Text bold>队列和栈</Text>、以及三个常用实现类
        <InlineCode>ArrayDeque</InlineCode>、<InlineCode>LinkedList</InlineCode>、<InlineCode>PriorityQueue</InlineCode>
        的区别与选型，并说明为什么不再推荐使用旧的 <InlineCode>Stack</InlineCode> 类。
      </Paragraph>
    </Callout>

    <Heading3>1. Queue：先进先出（FIFO）</Heading3>
    <Paragraph>
      队列就像排队买票：先来的先服务。元素从<Text bold>队尾</Text>进入，从<Text bold>队头</Text>离开。
      <InlineCode>Queue</InlineCode> 接口为「入队、出队、查看队头」三类操作各提供了<Text bold>两套</Text>方法：
    </Paragraph>
    <Table
      head={['操作', '抛异常版本', '返回特殊值版本', '区别']}
      rows={[
        ['入队（加到队尾）', 'add(e)', 'offer(e)', '队满时：add 抛异常，offer 返回 false'],
        ['出队（移除队头）', 'remove()', 'poll()', '队空时：remove 抛异常，poll 返回 null'],
        ['查看队头（不移除）', 'element()', 'peek()', '队空时：element 抛异常，peek 返回 null'],
      ]}
    />
    <Callout type="tip" title="优先用 offer / poll / peek">
      日常开发推荐用<Text bold>返回特殊值</Text>的那一套（<InlineCode>offer</InlineCode>/
      <InlineCode>poll</InlineCode>/<InlineCode>peek</InlineCode>），因为用返回值判断成败比
      <InlineCode>try-catch</InlineCode> 捕异常更优雅、性能也更好。
    </Callout>
    <CodeBlock
      title="QueueDemo.java"
      code={`import java.util.LinkedList;
import java.util.Queue;

public class QueueDemo {
    public static void main(String[] args) {
        // LinkedList 实现了 Queue 接口
        Queue<String> queue = new LinkedList<>();

        // 入队（队尾）
        queue.offer("第1位");
        queue.offer("第2位");
        queue.offer("第3位");
        System.out.println("队列: " + queue);

        // 查看队头但不移除
        System.out.println("队头 peek: " + queue.peek());

        // 出队（队头）——先进先出
        System.out.println("出队: " + queue.poll());
        System.out.println("出队: " + queue.poll());
        System.out.println("剩余: " + queue);

        // 队空时 poll 返回 null（不抛异常）
        queue.poll();
        System.out.println("再出队(已空): " + queue.poll());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`队列: [第1位, 第2位, 第3位]
队头 peek: 第1位
出队: 第1位
出队: 第2位
剩余: [第3位]
再出队(已空): null`}
    />

    <Heading3>2. Deque：双端队列（两头都能进出）</Heading3>
    <Paragraph>
      <InlineCode>Deque</InlineCode>（Double Ended Queue，读作 "deck"）继承自 <InlineCode>Queue</InlineCode>，
      允许在<Text bold>队头和队尾</Text>都进行插入和删除。它的方法成对出现，名字带 <InlineCode>First</InlineCode>/<InlineCode>Last</InlineCode>：
    </Paragraph>
    <Table
      head={['位置', '入（抛异常/返回值）', '出（抛异常/返回值）', '查看（抛异常/返回值）']}
      rows={[
        ['队头 First', 'addFirst / offerFirst', 'removeFirst / pollFirst', 'getFirst / peekFirst'],
        ['队尾 Last', 'addLast / offerLast', 'removeLast / pollLast', 'getLast / peekLast'],
      ]}
    />

    <Heading3>3. 用 Deque 当栈（LIFO）——取代 Stack</Heading3>
    <Paragraph>
      栈是「后进先出」（LIFO），<InlineCode>Deque</InlineCode> 提供了三个专门的栈方法，
      只在<Text bold>同一端</Text>操作即可：
    </Paragraph>
    <Table
      head={['栈操作', 'Deque 方法', '等价的 Deque 头部操作']}
      rows={[
        ['压栈', 'push(e)', 'addFirst(e)'],
        ['弹栈', 'pop()', 'removeFirst()'],
        ['看栈顶', 'peek()', 'peekFirst()'],
      ]}
    />
    <CodeBlock
      title="DequeAsStack.java"
      code={`import java.util.ArrayDeque;
import java.util.Deque;

public class DequeAsStack {
    public static void main(String[] args) {
        // 官方推荐用 ArrayDeque 作栈，替代过时的 Stack 类
        Deque<String> stack = new ArrayDeque<>();

        stack.push("第1个");   // 压栈
        stack.push("第2个");
        stack.push("第3个");
        System.out.println("栈: " + stack);

        System.out.println("栈顶 peek: " + stack.peek());
        System.out.println("弹栈: " + stack.pop());   // 后进的先出
        System.out.println("弹栈: " + stack.pop());
        System.out.println("剩余: " + stack);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`栈: [第3个, 第2个, 第1个]
栈顶 peek: 第3个
弹栈: 第3个
弹栈: 第2个
剩余: [第1个]`}
    />
    <Callout type="warning" title="不要再用 java.util.Stack">
      旧的 <InlineCode>Stack</InlineCode> 类继承自 <InlineCode>Vector</InlineCode>，线程同步导致性能差，
      而且它的迭代顺序与「栈」直觉相反，是历史遗留的设计缺陷。
      <Text bold>官方文档明确建议用 ArrayDeque 替代 Stack</Text>。需要栈时请用 <InlineCode>Deque</InlineCode>。
    </Callout>

    <Heading3>4. PriorityQueue：优先级队列</Heading3>
    <Paragraph>
      <InlineCode>PriorityQueue</InlineCode> 不是按「先进先出」，而是按<Text bold>元素优先级</Text>出队——
      每次 <InlineCode>poll</InlineCode> 出来的都是当前<Text bold>最小</Text>的元素（默认自然顺序），
      底层是<Text bold>堆（小顶堆）</Text>。
    </Paragraph>
    <CodeBlock
      title="PriorityQueueDemo.java"
      code={`import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueDemo {
    public static void main(String[] args) {
        // 默认小顶堆：每次出队最小值
        Queue<Integer> pq = new PriorityQueue<>();
        pq.offer(30);
        pq.offer(10);
        pq.offer(20);
        pq.offer(5);

        // 注意：直接打印不保证有序，出队顺序才是有序的
        System.out.println("内部数组(非有序): " + pq);

        System.out.print("依次出队: ");
        while (!pq.isEmpty()) {
            System.out.print(pq.poll() + " ");   // 按从小到大出队
        }
        System.out.println();

        // 传入比较器实现大顶堆：每次出队最大值
        Queue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
        maxHeap.offer(30); maxHeap.offer(10); maxHeap.offer(20);
        System.out.println("大顶堆出队最大: " + maxHeap.poll());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`内部数组(非有序): [5, 10, 20, 30]
依次出队: 5 10 20 30
大顶堆出队最大: 30`}
    />
    <Callout type="warning" title="PriorityQueue 只保证「队头最小」，不保证整体有序">
      直接遍历或打印 <InlineCode>PriorityQueue</InlineCode> 看到的是底层堆数组，<Text bold>并非完全有序</Text>。
      只有不断 <InlineCode>poll</InlineCode> 出队，得到的序列才是有序的。
      若要一个完全有序的集合，请用 <InlineCode>TreeSet</InlineCode>。
    </Callout>

    <Heading3>5. 三大实现类选型</Heading3>
    <Table
      head={['实现类', '底层', '适合当', '特点']}
      rows={[
        ['ArrayDeque', '循环数组', '队列 / 栈', '速度快、首选，不允许 null 元素'],
        ['LinkedList', '双向链表', '队列 / 栈', '可当 List 用，允许 null'],
        ['PriorityQueue', '堆(数组)', '优先级队列', '按优先级出队，非 FIFO'],
      ]}
    />
    <Callout type="tip" title="一句话选型">
      普通队列或栈 → <Text bold>ArrayDeque</Text>（最快）；
      既要当列表又要当队列 → <InlineCode>LinkedList</InlineCode>；
      要按优先级（如任务调度、求 TopK）→ <InlineCode>PriorityQueue</InlineCode>。
    </Callout>

    <Heading3>6. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>Queue</InlineCode> 先进先出，两套方法：抛异常（<InlineCode>add/remove/element</InlineCode>）与返回特殊值（<InlineCode>offer/poll/peek</InlineCode>），优先用后者。</ListItem>
        <ListItem><InlineCode>Deque</InlineCode> 双端队列，头尾都能进出，可同时充当队列和栈。</ListItem>
        <ListItem>栈用 <InlineCode>push/pop/peek</InlineCode>，<Text bold>用 ArrayDeque 替代过时的 Stack</Text>。</ListItem>
        <ListItem><InlineCode>PriorityQueue</InlineCode> 按优先级出队，默认小顶堆，传比较器可变大顶堆；只保证队头最小，非整体有序。</ListItem>
        <ListItem>选型：普通队列/栈用 <InlineCode>ArrayDeque</InlineCode>，优先级用 <InlineCode>PriorityQueue</InlineCode>。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：辨析方法"
      code={`① Queue 队空时，poll() 和 remove() 的行为有何不同？
② 为什么推荐用 ArrayDeque 而不是 Stack 实现栈？
③ PriorityQueue 默认 poll 出队的是最大还是最小元素？
④ 下面输出什么？
   Queue<Integer> q = new LinkedList<>();
   q.offer(1); q.offer(2); q.offer(3);
   System.out.println(q.poll() + "," + q.peek());`}
      answerCode={`答案：
① 队空时 poll() 返回 null（安全）；remove() 抛 NoSuchElementException（异常）。
② Stack 继承自同步的 Vector，性能差且迭代顺序违反直觉，是历史遗留缺陷；
   ArrayDeque 基于循环数组，无同步开销，速度快，官方推荐用它替代 Stack。
③ 最小元素（默认小顶堆，自然顺序）。要出队最大需传降序比较器 (a,b)->b-a。
④ 输出 1,2 —— poll 出队队头1并返回；peek 查看新队头2但不移除。`}
    />

    <CodeBlock
      qa
      title="练习2：括号匹配（用栈）"
      code={`// 用 Deque 当栈，判断字符串括号是否正确匹配。
// 只含 ( ) [ ] { }。匹配返回 true，否则 false。
// 测试: "([]{})" -> true ;  "([)]" -> false
import java.util.ArrayDeque;
import java.util.Deque;

public class BracketMatch {
    static boolean isValid(String s) {
        // 补全
        return false;
    }
    public static void main(String[] args) {
        System.out.println(isValid("([]{})"));
        System.out.println(isValid("([)]"));
    }
}`}
      answerCode={`import java.util.ArrayDeque;
import java.util.Deque;

public class BracketMatch {
    static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);                  // 左括号压栈
            } else {
                if (stack.isEmpty()) return false;  // 没有可匹配的左括号
                char open = stack.pop();        // 弹出栈顶左括号
                if ((c == ')' && open != '(') ||
                    (c == ']' && open != '[') ||
                    (c == '}' && open != '{')) {
                    return false;               // 类型不匹配
                }
            }
        }
        return stack.isEmpty();                 // 全部匹配完栈应为空
    }
    public static void main(String[] args) {
        System.out.println(isValid("([]{})"));
        System.out.println(isValid("([)]"));
    }
}

/* 控制台输出：
true
false

解析：括号匹配是栈的经典应用。左括号压栈，右括号来时弹出栈顶比对类型。
      "([)]" 中遇到 ) 时栈顶是 [ 类型不符，返回 false。
      最后栈必须为空，否则有未闭合的左括号。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：用 PriorityQueue 求最大的 3 个数"
      code={`// 给定数组 [4, 1, 7, 3, 8, 5, 9, 2]
// 用 PriorityQueue（小顶堆，容量保持3）求最大的 3 个数。
// 预期输出（出队从小到大）：7 8 9
import java.util.PriorityQueue;

public class TopK {
    public static void main(String[] args) {
        int[] nums = {4, 1, 7, 3, 8, 5, 9, 2};
        // 补全
    }
}`}
      answerCode={`import java.util.PriorityQueue;

public class TopK {
    public static void main(String[] args) {
        int[] nums = {4, 1, 7, 3, 8, 5, 9, 2};

        // 小顶堆：堆顶是当前3个里最小的
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int n : nums) {
            pq.offer(n);
            if (pq.size() > 3) {
                pq.poll();   // 超过3个就弹掉最小的，留下较大的
            }
        }

        // 堆里剩下最大的3个，出队从小到大
        StringBuilder sb = new StringBuilder();
        while (!pq.isEmpty()) {
            sb.append(pq.poll()).append(" ");
        }
        System.out.println(sb.toString().trim());
    }
}

/* 控制台输出：
7 8 9

解析：求 TopK 最大值的经典技巧——维护一个大小为 K 的「小顶堆」。
      堆顶永远是这 K 个里最小的，新元素挤进来后若超过 K 个就弹掉堆顶(最小)，
      最终留在堆里的就是最大的 K 个。这比全排序更高效，是面试高频题。
*/`}
    />
  </article>
);

export default index;
