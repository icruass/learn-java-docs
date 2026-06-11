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
    <Title>LinkedList 与 Vector</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <InlineCode>List</InlineCode> 接口除了 <InlineCode>ArrayList</InlineCode>，
        还有两个重要实现类：基于<Text bold>双向链表</Text>的 <InlineCode>LinkedList</InlineCode>
        和早期<Text bold>线程安全</Text>的 <InlineCode>Vector</InlineCode>。
        本节讲清它们的底层结构、独有方法、与 <InlineCode>ArrayList</InlineCode> 的性能差异，
        以及为什么 <InlineCode>Vector</InlineCode> 已被淘汰，帮助你在不同场景下做出正确选型。
      </Paragraph>
    </Callout>

    <Heading3>1. 三大 List 实现类总览</Heading3>
    <Table
      head={['实现类', '底层结构', '查询(随机访问)', '头尾增删', '中间增删', '线程安全']}
      rows={[
        ['ArrayList', '动态数组', '快 O(1)', '尾快/头慢', '慢 O(n)', '否'],
        ['LinkedList', '双向链表', '慢 O(n)', '极快 O(1)', '慢(需先定位)', '否'],
        ['Vector', '动态数组', '快 O(1)', '尾快/头慢', '慢 O(n)', '是(已过时)'],
      ]}
    />

    <Heading3>2. LinkedList 的底层：双向链表</Heading3>
    <Paragraph>
      <InlineCode>LinkedList</InlineCode> 内部由一个个<Text bold>节点（Node）</Text>串成，
      每个节点保存：数据本身、指向前一个节点的引用 <InlineCode>prev</InlineCode>、
      指向后一个节点的引用 <InlineCode>next</InlineCode>。整个链表只持有头节点 <InlineCode>first</InlineCode>
      和尾节点 <InlineCode>last</InlineCode> 的引用。
    </Paragraph>
    <CodeBlock
      language="text"
      title="双向链表结构示意"
      code={`first                                                  last
  │                                                     │
  ▼                                                     ▼
┌──────┐      ┌──────┐      ┌──────┐
│ prev │ null │ prev │◄──┐  │ prev │◄──┐
│ data │  A   │ data │   │  │ data │   │
│ next │──────│ next │───┘  │ next │ null
└──────┘   ┌─►└──────┘  ┌──►└──────┘
   B          B    C       C

新增/删除：只需改动相邻节点的 prev/next 指针，不必移动其它元素 → O(1)
随机访问 get(i)：必须从头(或尾)一个个数到第 i 个 → O(n)`}
    />
    <Callout type="tip" title="为什么链表增删快、查询慢">
      数组在内存中是<Text bold>连续</Text>的，按下标可一步算出地址，所以查询快；但中间插入要把后面元素整体后移。
      链表节点在内存中<Text bold>分散</Text>，增删只改指针所以快；但要找第 i 个元素必须从头逐个跳，所以查询慢。
    </Callout>

    <Heading3>3. LinkedList 独有的头尾操作方法</Heading3>
    <Paragraph>
      因为同时实现了 <InlineCode>Deque</InlineCode>（双端队列）接口，<InlineCode>LinkedList</InlineCode>
      提供了大量针对<Text bold>头部和尾部</Text>的便捷方法，这些是 <InlineCode>ArrayList</InlineCode> 没有的：
    </Paragraph>
    <Table
      head={['方法', '功能']}
      rows={[
        ['addFirst(E e)', '在头部添加元素'],
        ['addLast(E e)', '在尾部添加元素'],
        ['E getFirst()', '获取头部元素（不删除）'],
        ['E getLast()', '获取尾部元素（不删除）'],
        ['E removeFirst()', '删除并返回头部元素'],
        ['E removeLast()', '删除并返回尾部元素'],
        ['E peekFirst() / peekLast()', '查看头/尾元素，空集合返回 null（不抛异常）'],
        ['offerFirst / offerLast', '在头/尾添加（队列风格，返回 boolean）'],
      ]}
    />
    <Callout type="warning" title="getFirst 对空集合会抛异常">
      <InlineCode>getFirst()</InlineCode>/<InlineCode>removeFirst()</InlineCode> 在集合为空时抛
      <InlineCode>NoSuchElementException</InlineCode>；而 <InlineCode>peekFirst()</InlineCode>
      在空集合时安全地返回 <InlineCode>null</InlineCode>。需要容错时优先用 <InlineCode>peek</InlineCode> 系列。
    </Callout>

    <Heading3>4. LinkedList 完整示例</Heading3>
    <CodeBlock
      title="LinkedListDemo.java"
      code={`import java.util.LinkedList;

public class LinkedListDemo {
    public static void main(String[] args) {
        LinkedList<String> list = new LinkedList<>();

        // 普通 List 操作
        list.add("B");
        list.add("C");

        // 头尾专属操作
        list.addFirst("A");   // 加到最前
        list.addLast("D");    // 加到最后
        System.out.println("当前链表: " + list);

        // 查看头尾
        System.out.println("头元素 getFirst: " + list.getFirst());
        System.out.println("尾元素 getLast: " + list.getLast());

        // 删除头尾
        System.out.println("删除头部: " + list.removeFirst());
        System.out.println("删除尾部: " + list.removeLast());
        System.out.println("删除后: " + list);

        // 安全查看（空也不报错）
        LinkedList<String> empty = new LinkedList<>();
        System.out.println("空链表 peekFirst: " + empty.peekFirst());
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`当前链表: [A, B, C, D]
头元素 getFirst: A
尾元素 getLast: D
删除头部: A
删除尾部: D
删除后: [B, C]
空链表 peekFirst: null`}
    />

    <Heading3>5. ArrayList vs LinkedList 性能对比</Heading3>
    <Paragraph>
      二者都实现 <InlineCode>List</InlineCode>，方法用法几乎一样，区别只在底层结构带来的性能差异：
    </Paragraph>
    <Table
      head={['操作', 'ArrayList', 'LinkedList', '谁更优']}
      rows={[
        ['get(i) 随机访问', 'O(1) 直接算下标', 'O(n) 从头遍历', 'ArrayList'],
        ['尾部 add', 'O(1) 均摊', 'O(1)', '相当'],
        ['头部 add(0, e)', 'O(n) 整体后移', 'O(1) 改指针', 'LinkedList'],
        ['中间插入/删除', 'O(n) 移动元素', 'O(n) 主要耗在定位', 'ArrayList 略优(实测)'],
        ['内存占用', '较小(仅存数据)', '较大(每节点多存两个指针)', 'ArrayList'],
      ]}
    />
    <Callout type="tip" title="实战选型：多数情况选 ArrayList">
      虽然理论上链表「增删快」，但实际开发中 <InlineCode>ArrayList</InlineCode> 适用面更广：
      它随机访问快、内存省、缓存友好。只有在<Text bold>频繁在头部插入/删除</Text>
      或明确把它当<Text bold>队列/栈</Text>用时，<InlineCode>LinkedList</InlineCode> 才有优势。
      不确定时，<Text bold>默认用 ArrayList</Text>。
    </Callout>

    <Heading3>6. 用 LinkedList 模拟栈与队列</Heading3>
    <Paragraph>
      <InlineCode>LinkedList</InlineCode> 头尾操作都是 O(1)，天然适合实现栈（后进先出）和队列（先进先出）：
    </Paragraph>
    <CodeBlock
      title="LinkedListAsStackQueue.java"
      code={`import java.util.LinkedList;

public class LinkedListAsStackQueue {
    public static void main(String[] args) {
        // —— 当栈用（后进先出 LIFO）——
        LinkedList<Integer> stack = new LinkedList<>();
        stack.addLast(1);   // 压栈(入)
        stack.addLast(2);
        stack.addLast(3);
        System.out.println("出栈: " + stack.removeLast());  // 3
        System.out.println("出栈: " + stack.removeLast());  // 2
        System.out.println("栈剩余: " + stack);

        System.out.println();

        // —— 当队列用（先进先出 FIFO）——
        LinkedList<Integer> queue = new LinkedList<>();
        queue.addLast(1);   // 入队
        queue.addLast(2);
        queue.addLast(3);
        System.out.println("出队: " + queue.removeFirst());  // 1
        System.out.println("出队: " + queue.removeFirst());  // 2
        System.out.println("队列剩余: " + queue);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`出栈: 3
出栈: 2
栈剩余: [1]

出队: 1
出队: 2
队列剩余: [3]`}
    />

    <Heading3>7. Vector：被淘汰的元老</Heading3>
    <Paragraph>
      <InlineCode>Vector</InlineCode> 是 JDK 1.0 就存在的「古董」类，底层也是动态数组，
      用法与 <InlineCode>ArrayList</InlineCode> 几乎相同。它和 <InlineCode>ArrayList</InlineCode> 的核心区别：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>线程安全：</Text><InlineCode>Vector</InlineCode> 的方法都加了 <InlineCode>synchronized</InlineCode>，
        多线程下安全，但单线程也要付出同步开销，<Text bold>性能比 ArrayList 差</Text>。
      </ListItem>
      <ListItem>
        <Text bold>扩容策略：</Text><InlineCode>ArrayList</InlineCode> 默认扩容 1.5 倍，
        <InlineCode>Vector</InlineCode> 默认扩容 2 倍（更浪费内存）。
      </ListItem>
      <ListItem>
        <Text bold>独有的旧方法：</Text><InlineCode>elementAt(i)</InlineCode>、
        <InlineCode>addElement(e)</InlineCode>、<InlineCode>Enumeration</InlineCode> 遍历等，都是早期 API。
      </ListItem>
    </UnorderedList>
    <Callout type="warning" title="Vector 已过时，不要在新代码里用">
      单线程开发用 <InlineCode>ArrayList</InlineCode>；需要线程安全的列表时，
      也不该用 <InlineCode>Vector</InlineCode>，而应使用
      <InlineCode>Collections.synchronizedList(new ArrayList&lt;&gt;())</InlineCode>
      或并发包里的 <InlineCode>CopyOnWriteArrayList</InlineCode>。
      <InlineCode>Vector</InlineCode> 仅作为「了解历史」存在。
    </Callout>
    <CodeBlock
      title="VectorDemo.java（仅作了解）"
      code={`import java.util.Vector;

public class VectorDemo {
    public static void main(String[] args) {
        Vector<String> v = new Vector<>();
        v.add("A");
        v.addElement("B");          // 旧 API，等价于 add
        System.out.println("元素0: " + v.elementAt(0));  // 旧 API，等价于 get(0)
        System.out.println("Vector: " + v);
        System.out.println("容量capacity: " + v.capacity()); // 默认初始容量10
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`元素0: A
Vector: [A, B]
容量capacity: 10`}
    />

    <Heading3>8. 要点汇总</Heading3>
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>LinkedList</InlineCode> 底层是双向链表，头尾增删 O(1)，随机访问 O(n)。</ListItem>
        <ListItem><InlineCode>LinkedList</InlineCode> 实现了 <InlineCode>Deque</InlineCode>，有 <InlineCode>addFirst/removeLast</InlineCode> 等头尾方法，可当栈/队列用。</ListItem>
        <ListItem>多数场景默认用 <InlineCode>ArrayList</InlineCode>；频繁头部增删或当队列时才用 <InlineCode>LinkedList</InlineCode>。</ListItem>
        <ListItem><InlineCode>Vector</InlineCode> 线程安全但性能差、已过时；线程安全需求用并发包替代。</ListItem>
        <ListItem><InlineCode>getFirst</InlineCode> 空集合抛异常，<InlineCode>peekFirst</InlineCode> 空集合返回 null。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>9. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：选型判断"
      code={`针对以下场景，选择 ArrayList 还是 LinkedList，并说明理由：
  ① 一个排行榜，频繁按名次(下标)读取选手，偶尔在末尾追加。
  ② 一个浏览器「最近访问」列表，每次把新页面插到最前面，最多保留10条，超出删最后。
  ③ 一个待办事项，需要频繁随机查看第 N 项内容。`}
      answerCode={`答案：
  ① ArrayList —— 频繁按下标随机访问是 ArrayList 的强项 O(1)，末尾追加也快。
  ② LinkedList —— 频繁在头部插入(addFirst)、尾部删除(removeLast)都是 O(1)，正是链表强项。
  ③ ArrayList —— 频繁随机访问 get(N) 用数组结构 O(1) 最优。

解析：选型核心看「以什么操作为主」：
      随机访问多 → ArrayList；头尾增删多 → LinkedList。`}
    />

    <CodeBlock
      qa
      title="练习2：用 LinkedList 实现固定大小的历史记录"
      code={`// 实现「最近访问记录」：新记录加到最前面，最多保留 3 条，超出删除最末尾。
// 依次访问："百度", "谷歌", "必应", "搜狗"
// 预期最终输出：[搜狗, 必应, 谷歌]

import java.util.LinkedList;

public class History {
    static LinkedList<String> history = new LinkedList<>();

    static void visit(String page) {
        // 补全
    }

    public static void main(String[] args) {
        visit("百度");
        visit("谷歌");
        visit("必应");
        visit("搜狗");
        System.out.println(history);
    }
}`}
      answerCode={`import java.util.LinkedList;

public class History {
    static LinkedList<String> history = new LinkedList<>();

    static void visit(String page) {
        history.addFirst(page);          // 新记录加到最前
        if (history.size() > 3) {
            history.removeLast();        // 超出3条删最后一条
        }
    }

    public static void main(String[] args) {
        visit("百度");
        visit("谷歌");
        visit("必应");
        visit("搜狗");
        System.out.println(history);
    }
}

/* 控制台输出：
[搜狗, 必应, 谷歌]

解析：addFirst 把新页面放头部，removeLast 淘汰最旧的。
      访问顺序 百度→谷歌→必应→搜狗，加到第4个时长度超3，删掉最末的"百度"，
      剩下 [搜狗, 必应, 谷歌]。LinkedList 头尾操作 O(1)，非常适合此类场景。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：辨析 Vector 与 ArrayList"
      code={`判断对错并说明：
  ① Vector 和 ArrayList 底层都是动态数组。
  ② 因为 Vector 线程安全，所以新项目应优先使用 Vector。
  ③ ArrayList 默认扩容为原来的 2 倍。
  ④ 在多线程下需要线程安全的 List，推荐用 CopyOnWriteArrayList 而不是 Vector。`}
      answerCode={`答案：
  ① 正确。两者底层都是 Object[] 动态数组。
  ② 错误。Vector 每个方法都同步，单线程下白白损耗性能，且 API 陈旧，已过时。
     新项目单线程用 ArrayList。
  ③ 错误。ArrayList 默认扩容 1.5 倍；扩容 2 倍的是 Vector。
  ④ 正确。需要线程安全的 List 时，用 java.util.concurrent 包的 CopyOnWriteArrayList，
     或 Collections.synchronizedList 包装，性能与设计都优于古老的 Vector。

解析：记住「Vector=过时的、同步的 ArrayList，扩容2倍」即可，新代码别用它。`}
    />
  </article>
);

export default index;
