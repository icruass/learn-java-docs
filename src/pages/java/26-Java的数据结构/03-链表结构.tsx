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
    <Title>链表结构</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>链表（Linked List）</Text>是链式存储的典型代表，也是数组的最重要替代品。
        链表放弃了「连续内存」的要求，改为让每个节点持有一个指向下一节点的引用（指针），
        从而将分散在内存各处的节点串联成一个逻辑上连续的序列。
        这一设计使得插入和删除操作只需修改指针、无需搬移元素，代价降为 O(1)；
        但随机访问必须从头遍历，代价升为 O(n)。
        本节手写单向链表的完整实现，深入理解链表的工作原理。
      </Paragraph>
    </Callout>

    <Heading3>1. 链表的核心概念：节点</Heading3>
    <Paragraph>
      链表由一个个<Text bold>节点（Node）</Text>组成，每个节点包含两部分：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>数据域（data）</Text>：存储实际的数据值。
      </ListItem>
      <ListItem>
        <Text bold>指针域（next / prev）</Text>：存储指向下一个（或上一个）节点的引用。
        在 Java 中，这个「指针」就是对象引用。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      链表持有一个<Text bold>头节点（head）</Text>引用作为入口，通过 head 可以依次访问链表中的所有节点。
      最后一个节点的 next 为 <InlineCode>null</InlineCode>，表示链表结束。
    </Paragraph>

    <Heading3>2. 三种常见链表结构</Heading3>

    <Heading4>2.1 单向链表（Singly Linked List）</Heading4>
    <CodeBlock
      language="text"
      title="单向链表结构示意"
      code={`head
  ↓
[10 | next] → [20 | next] → [30 | next] → [40 | null]
                                                  ↑
                                             最后一个节点，next = null`}
    />
    <Paragraph>
      每个节点只有一个 <InlineCode>next</InlineCode> 指针，只能<Text bold>从前往后</Text>遍历，
      无法往回走。Java 的 <InlineCode>LinkedList</InlineCode> 实际上是双向链表，
      但单向链表是理解链表的最佳起点。
    </Paragraph>

    <Heading4>2.2 双向链表（Doubly Linked List）</Heading4>
    <CodeBlock
      language="text"
      title="双向链表结构示意"
      code={`head                                              tail
  ↓                                                   ↓
[null|10|next] ⇄ [prev|20|next] ⇄ [prev|30|next] ⇄ [prev|40|null]

每个节点多一个 prev 指针，可以双向遍历。
Java 的 LinkedList、ArrayDeque 底层使用双向链表。`}
    />
    <Paragraph>
      每个节点同时持有 <InlineCode>next</InlineCode>（后继）和 <InlineCode>prev</InlineCode>（前驱）两个引用。
      双向链表支持从尾到头反向遍历，也能在已知节点的情况下向前/向后插入，
      但每个节点多占一个引用的内存空间（Java 中是 8 字节，64 位 JVM）。
    </Paragraph>

    <Heading4>2.3 循环链表（Circular Linked List）</Heading4>
    <CodeBlock
      language="text"
      title="循环链表结构示意"
      code={`head
  ↓
[10 | next] → [20 | next] → [30 | next] → [40 | next]
    ↑                                            |
    └────────────────────────────────────────────┘
                最后一个节点的 next 指回 head，形成环`}
    />
    <Paragraph>
      最后一个节点的 <InlineCode>next</InlineCode> 指回链表头部，形成一个环。
      循环链表常用于实现<Text bold>环形缓冲区</Text>和<Text bold>约瑟夫问题</Text>等场景。
      遍历时需要特别注意终止条件（不能用 <InlineCode>node != null</InlineCode>，而要用 <InlineCode>node != head</InlineCode>），
      否则会无限循环。
    </Paragraph>

    <Heading4>2.4 三种链表对比</Heading4>
    <Table
      head={['类型', '指针数量', '遍历方向', '额外内存', '适用场景']}
      rows={[
        ['单向链表', '1个（next）', '只能从前往后', '最少', '简单序列、栈的链表实现'],
        ['双向链表', '2个（next+prev）', '前后双向', '每节点多1个引用', '需要双向遍历、从尾部快速操作（如 Java LinkedList）'],
        ['循环链表', '1个（next，尾→头）', '无限循环', '与单向相同', '环形缓冲区、轮询调度、约瑟夫问题'],
      ]}
    />

    <Heading3>3. 链表的核心操作与时间复杂度</Heading3>

    <Heading4>3.1 插入：O(1)（已知插入位置的前驱节点）</Heading4>
    <Paragraph>
      在节点 A 和节点 B 之间插入新节点 C，只需两步：
    </Paragraph>
    <CodeBlock
      language="text"
      title="链表插入操作（修改两个指针即可）"
      code={`插入前：  A → B
              ↑   ↑
          节点A  节点B

步骤1：C.next = B      （新节点C先指向B）
步骤2：A.next = C      （再让A指向C）

插入后：  A → C → B

注意：两步顺序不能颠倒！先做步骤2会导致 B 的引用丢失。`}
    />
    <Callout type="danger" title="插入顺序不能颠倒">
      必须先让新节点 C 指向后继节点 B，再让前驱节点 A 指向 C。
      如果先做 <InlineCode>A.next = C</InlineCode>，则 A 原来指向 B 的引用就丢失了，
      之后无法再做 <InlineCode>C.next = B</InlineCode>（B 已经找不到了）。
    </Callout>

    <Heading4>3.2 删除：O(1)（已知被删节点的前驱节点）</Heading4>
    <CodeBlock
      language="text"
      title="链表删除操作（只改一个指针）"
      code={`删除前：  A → B → C

步骤：A.next = C    （跳过 B，直接指向 C）

删除后：  A → C
         B 已无引用指向它，Java GC 会自动回收它的内存`}
    />

    <Heading4>3.3 查找：O(n)（必须从 head 遍历）</Heading4>
    <Paragraph>
      链表不支持随机访问，要找第 k 个节点，必须从 <InlineCode>head</InlineCode> 开始沿
      <InlineCode>next</InlineCode> 指针一步一步往下走，最坏情况走 n 步。
      这是链表相对于数组最大的劣势。
    </Paragraph>

    <Heading4>3.4 复杂度汇总</Heading4>
    <Table
      head={['操作', '时间复杂度', '备注']}
      rows={[
        ['头插（在 head 前插入）', 'O(1)', '直接修改 head 指针'],
        ['尾插（在尾部追加）', 'O(n) 或 O(1)', '若维护 tail 指针则 O(1)，否则需先遍历到尾 O(n)'],
        ['在已知节点后插入', 'O(1)', '只修改两个指针'],
        ['按索引查找节点', 'O(n)', '必须从 head 开始遍历 k 步'],
        ['按值查找节点', 'O(n)', '最坏遍历全部节点'],
        ['删除头节点', 'O(1)', 'head = head.next'],
        ['删除已知前驱节点后的节点', 'O(1)', '只修改一个指针'],
        ['删除尾节点', 'O(n)', '需先遍历到倒数第二个节点'],
      ]}
    />

    <Heading3>4. 数组 vs 链表：全面对比</Heading3>
    <Table
      head={['对比维度', '数组', '链表']}
      rows={[
        ['内存布局', '连续内存，一次申请', '分散内存，节点按需申请'],
        ['随机访问', 'O(1)，支持下标直接访问', 'O(n)，必须从头遍历'],
        ['头部插入/删除', 'O(n)，需整体移动元素', 'O(1)，只改 head 指针'],
        ['中间插入/删除', 'O(n)，需移动后续元素', 'O(1)（已知前驱）+ O(n) 查找前驱'],
        ['尾部追加', 'O(1)（有空位）', 'O(1)（维护 tail）或 O(n)'],
        ['扩容', 'O(n)，需创建新数组并复制', '无需扩容，按需增加节点'],
        ['额外内存开销', '无（只存数据）', '每节点多存 1~2 个引用'],
        ['CPU 缓存命中率', '高（连续内存，预取友好）', '低（内存分散，缓存失效率高）'],
        ['适用场景', '频繁随机访问，数量稳定', '频繁插入删除，数量动态变化'],
      ]}
    />
    <Callout type="tip" title="Java 实战选型建议">
      <UnorderedList>
        <ListItem>
          需要频繁通过索引访问 → 用 <InlineCode>ArrayList</InlineCode>（底层数组）。
        </ListItem>
        <ListItem>
          需要频繁在头部/中间插入删除，且不需要随机访问 → 用 <InlineCode>LinkedList</InlineCode>（底层双向链表）。
        </ListItem>
        <ListItem>
          实际上 <InlineCode>ArrayList</InlineCode> 在绝大多数场景性能更好，因为数组的 CPU 缓存命中率远高于链表。
          只有在确定瓶颈在于头部/中间的大量插入删除时，才优先考虑 <InlineCode>LinkedList</InlineCode>。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5. 完整示例：手写单向链表</Heading3>
    <Paragraph>
      从零实现一个支持头插、尾插、按值删除和遍历打印的单向链表，彻底理解链表的工作原理。
    </Paragraph>

    <Heading4>示例 1：Node 类 + 链表基本操作</Heading4>
    <CodeBlock
      title="MyLinkedList.java"
      code={`public class MyLinkedList {

    // ===== 内部节点类 =====
    static class Node {
        int data;       // 数据域
        Node next;      // 指针域：指向下一个节点

        Node(int data) {
            this.data = data;
            this.next = null;
        }
    }

    // ===== 链表属性 =====
    private Node head;   // 头节点引用（链表的入口）
    private int size;    // 有效节点数量

    // 构造方法：空链表
    public MyLinkedList() {
        head = null;
        size = 0;
    }

    // ===== 头插法：在链表头部插入新节点 O(1) =====
    public void addFirst(int data) {
        Node newNode = new Node(data);
        newNode.next = head;  // 新节点的 next 指向原来的 head
        head = newNode;       // head 更新为新节点
        size++;
        System.out.println("头插 " + data + " 完成");
    }

    // ===== 尾插法：在链表尾部追加新节点 O(n) =====
    public void addLast(int data) {
        Node newNode = new Node(data);
        if (head == null) {
            // 空链表直接作为头节点
            head = newNode;
        } else {
            // 遍历到最后一个节点
            Node curr = head;
            while (curr.next != null) {
                curr = curr.next;
            }
            curr.next = newNode;  // 最后一个节点的 next 指向新节点
        }
        size++;
        System.out.println("尾插 " + data + " 完成");
    }

    // ===== 按值删除：删除第一个值等于 target 的节点 O(n) =====
    public boolean removeByValue(int target) {
        if (head == null) return false;

        // 情况1：头节点就是目标
        if (head.data == target) {
            head = head.next;   // head 直接指向第二个节点（原头节点会被 GC 回收）
            size--;
            System.out.println("删除节点 " + target + "（原头节点）");
            return true;
        }

        // 情况2：在后续节点中查找
        Node prev = head;
        Node curr = head.next;
        while (curr != null) {
            if (curr.data == target) {
                prev.next = curr.next;  // 跳过 curr，前驱直接指向后继
                size--;
                System.out.println("删除节点 " + target);
                return true;
            }
            prev = curr;
            curr = curr.next;
        }

        System.out.println("未找到节点 " + target);
        return false;
    }

    // ===== 遍历打印 =====
    public void print() {
        if (head == null) {
            System.out.println("链表为空");
            return;
        }
        StringBuilder sb = new StringBuilder("链表(size=" + size + "): head → ");
        Node curr = head;
        while (curr != null) {
            sb.append(curr.data);
            if (curr.next != null) sb.append(" → ");
            curr = curr.next;
        }
        sb.append(" → null");
        System.out.println(sb.toString());
    }

    // ===== 获取有效节点数 =====
    public int size() {
        return size;
    }
}`}
    />

    <Heading4>示例 2：测试类，综合验证所有操作</Heading4>
    <CodeBlock
      title="MyLinkedListTest.java"
      code={`public class MyLinkedListTest {
    public static void main(String[] args) {
        MyLinkedList list = new MyLinkedList();

        System.out.println("===== 头插测试 =====");
        list.addFirst(30);
        list.print();
        list.addFirst(20);
        list.print();
        list.addFirst(10);
        list.print();

        System.out.println();
        System.out.println("===== 尾插测试 =====");
        list.addLast(40);
        list.print();
        list.addLast(50);
        list.print();

        System.out.println();
        System.out.println("===== 删除测试 =====");
        list.removeByValue(10);  // 删除头节点
        list.print();

        list.removeByValue(30);  // 删除中间节点
        list.print();

        list.removeByValue(50);  // 删除尾节点
        list.print();

        list.removeByValue(99);  // 删除不存在的值
        list.print();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`===== 头插测试 =====
头插 30 完成
链表(size=1): head → 30 → null
头插 20 完成
链表(size=2): head → 20 → 30 → null
头插 10 完成
链表(size=3): head → 10 → 20 → 30 → null

===== 尾插测试 =====
尾插 40 完成
链表(size=4): head → 10 → 20 → 30 → 40 → null
尾插 50 完成
链表(size=5): head → 10 → 20 → 30 → 40 → 50 → null

===== 删除测试 =====
删除节点 10（原头节点）
链表(size=4): head → 20 → 30 → 40 → 50 → null
删除节点 30
链表(size=3): head → 20 → 40 → 50 → null
删除节点 50
链表(size=2): head → 20 → 40 → null
未找到节点 99
链表(size=2): head → 20 → 40 → null`}
    />
    <Paragraph>
      头插法每次把新节点加到最前面，所以三次头插 30、20、10 之后，链表顺序是 10 → 20 → 30（逆序）。
      删除操作分三种情况：删除头节点只需 <InlineCode>head = head.next</InlineCode>；
      删除中间节点通过 <InlineCode>prev.next = curr.next</InlineCode> 跳过目标节点；
      被跳过的节点在 Java 中会被垃圾回收器自动回收，无需手动释放内存。
    </Paragraph>

    <Heading4>示例 3：链表反转（经典面试题）</Heading4>
    <Paragraph>
      将链表 1 → 2 → 3 → 4 → 5 反转为 5 → 4 → 3 → 2 → 1。
      核心思路：用三个指针 <InlineCode>prev</InlineCode>、<InlineCode>curr</InlineCode>、
      <InlineCode>next</InlineCode> 逐个反转每个节点的 next 方向。
    </Paragraph>
    <CodeBlock
      title="ReverseLinkedList.java"
      code={`public class ReverseLinkedList {

    static class Node {
        int data;
        Node next;
        Node(int data) { this.data = data; }
    }

    // 反转链表，返回新的头节点
    public static Node reverse(Node head) {
        Node prev = null;   // 前驱（反转后成为 next）
        Node curr = head;   // 当前节点

        while (curr != null) {
            Node nextTemp = curr.next;  // 保存下一节点，防止断链
            curr.next = prev;           // 反转：当前节点的 next 指向前驱
            prev = curr;                // 前驱前进
            curr = nextTemp;            // 当前前进
        }
        // 循环结束时，curr == null，prev 指向原来的最后一个节点（新头）
        return prev;
    }

    public static void printList(Node head) {
        Node curr = head;
        while (curr != null) {
            System.out.print(curr.data);
            if (curr.next != null) System.out.print(" → ");
            curr = curr.next;
        }
        System.out.println(" → null");
    }

    public static void main(String[] args) {
        // 构建链表 1 → 2 → 3 → 4 → 5
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        head.next.next.next = new Node(4);
        head.next.next.next.next = new Node(5);

        System.out.print("反转前: ");
        printList(head);

        head = reverse(head);

        System.out.print("反转后: ");
        printList(head);
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`反转前: 1 → 2 → 3 → 4 → 5 → null
反转后: 5 → 4 → 3 → 2 → 1 → null`}
    />
    <Paragraph>
      三指针法是链表反转的标准解法，时间复杂度 O(n)，空间复杂度 O(1)。
      每轮循环做三件事：保存 <InlineCode>curr.next</InlineCode> 防止断链，
      将 <InlineCode>curr.next</InlineCode> 指向 <InlineCode>prev</InlineCode> 实现反转，
      然后 <InlineCode>prev</InlineCode> 和 <InlineCode>curr</InlineCode> 各前进一步。
    </Paragraph>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：在指定位置插入节点"
      code={`// 要求：
// 在 MyLinkedList 中增加一个方法 addAt(int index, int data)，
// 在索引 index 处插入值为 data 的新节点（索引从 0 开始）。
// index=0 等价于头插；index=size 等价于尾插；index 越界则打印错误信息。
//
// 示例：链表 10 → 20 → 30，在 index=1 处插入 99 后变为 10 → 99 → 20 → 30。

// 在 MyLinkedList 类中补全 addAt 方法：
public void addAt(int index, int data) {
    // 补全代码
}`}
      answerCode={`public void addAt(int index, int data) {
    if (index < 0 || index > size) {
        System.out.println("索引 " + index + " 越界，有效范围 [0, " + size + "]");
        return;
    }
    if (index == 0) {
        addFirst(data);  // 复用头插逻辑
        return;
    }
    // 找到索引 index-1 的节点（插入位置的前驱）
    Node prev = head;
    for (int i = 0; i < index - 1; i++) {
        prev = prev.next;
    }
    // 执行插入：新节点先指向 prev.next，再让 prev 指向新节点
    Node newNode = new Node(data);
    newNode.next = prev.next;   // 步骤1：新节点指向后继（不能颠倒！）
    prev.next = newNode;        // 步骤2：前驱指向新节点
    size++;
    System.out.println("在索引 " + index + " 处插入 " + data + " 完成");
}

/* 测试代码：
MyLinkedList list = new MyLinkedList();
list.addLast(10); list.addLast(20); list.addLast(30);
list.print();         // head → 10 → 20 → 30 → null
list.addAt(1, 99);
list.print();         // head → 10 → 99 → 20 → 30 → null
list.addAt(0, 5);
list.print();         // head → 5 → 10 → 99 → 20 → 30 → null
list.addAt(5, 100);
list.print();         // head → 5 → 10 → 99 → 20 → 30 → 100 → null

控制台输出：
链表(size=3): head → 10 → 20 → 30 → null
在索引 1 处插入 99 完成
链表(size=4): head → 10 → 99 → 20 → 30 → null
头插 5 完成
链表(size=5): head → 5 → 10 → 99 → 20 → 30 → null
在索引 5 处插入 100 完成
链表(size=6): head → 5 → 10 → 99 → 20 → 30 → 100 → null

解析：找到第 index-1 个节点作为前驱，然后两步插入。
      关键是两步顺序：先让新节点.next = prev.next，再让 prev.next = 新节点，不能颠倒。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：判断链表是否存在环"
      code={`// 要求：
// 给定一个单向链表的 head 节点，判断链表中是否存在环（循环链表）。
// 要求：时间复杂度 O(n)，空间复杂度 O(1)——不能使用 HashSet 等额外数据结构。
// 提示：使用「快慢指针（Floyd 判环算法）」——
//       慢指针每次走 1 步，快指针每次走 2 步；
//       若存在环，快慢指针必然在环内相遇；若无环，快指针会先到达 null。

static class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

public static boolean hasCycle(Node head) {
    // 补全代码
}`}
      answerCode={`static class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

public static boolean hasCycle(Node head) {
    if (head == null || head.next == null) return false;

    Node slow = head;        // 慢指针，每次走 1 步
    Node fast = head.next;   // 快指针，每次走 2 步

    while (slow != fast) {
        // 快指针到达 null，说明无环
        if (fast == null || fast.next == null) return false;
        slow = slow.next;         // 慢指针走 1 步
        fast = fast.next.next;    // 快指针走 2 步
    }
    // slow == fast，相遇了，说明有环
    return true;
}

/* 测试代码：
// 构建有环链表：1 → 2 → 3 → 4 → 2（4 指回 2，形成环）
Node n1 = new Node(1);
Node n2 = new Node(2);
Node n3 = new Node(3);
Node n4 = new Node(4);
n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2;  // 形成环
System.out.println("有环链表：" + hasCycle(n1));  // true

// 构建无环链表：1 → 2 → 3 → null
Node a = new Node(1);
Node b = new Node(2);
Node c = new Node(3);
a.next = b; b.next = c;
System.out.println("无环链表：" + hasCycle(a));   // false

控制台输出：
有环链表：true
无环链表：false

解析：快慢指针算法（Floyd 判环）是链表经典算法。
  无环时：快指针最终到达 null，退出。
  有环时：快指针比慢指针每轮多走 1 步，相当于在环内「追及」慢指针，
          设环长为 L，最多经过 L 轮后两者必然相遇。
  时间 O(n)，空间 O(1)，是面试高频考题。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：链表与数组的选型分析"
      code={`问：以下四个业务场景，应该选择数组（ArrayList）还是链表（LinkedList）？
请说明理由，并给出各操作的大致时间复杂度。

(1) 学生成绩管理系统：需要按学号（索引）快速查询成绩，
    偶尔追加新学生，极少在中间插入。

(2) 浏览器的前进/后退历史：用户点击「后退」弹出最近一条，
    点击「前进」也弹出最近一条，频繁在两端操作。

(3) 任务调度队列：任务按到达顺序排队，新任务总是加到队尾，
    调度器总是取队头任务执行，数量可能非常大。

(4) 日志系统：每秒产生数千条日志，按时间顺序追加到末尾，
    几乎不查询具体索引，只需定期把整个列表导出。`}
      answerCode={`(1) 选 ArrayList（数组）
    核心需求是「按学号（索引）快速查询」→ 随机访问 O(1)，数组最优。
    追加新学生在末尾 → ArrayList 均摊 O(1)。
    极少在中间插入 → 即使偶尔 O(n) 也可接受。
    链表随机访问 O(n)，完全不适合。

(2) 选 LinkedList（双向链表）/ ArrayDeque（数组双端队列也可）
    核心需求是「在两端频繁弹出/插入」→ 链表两端操作 O(1)（维护 head 和 tail）。
    ArrayDeque 底层用环形数组，两端操作也是 O(1)，实际性能往往更好。
    不需要按索引访问，所以数组的随机访问优势用不上。

(3) 选 LinkedList 或 ArrayDeque（本质是队列）
    核心需求是「队尾入、队头出（FIFO 队列）」→ 两端 O(1)。
    ArrayList 做队头删除需要移动全部元素 O(n)，数量大时不可接受。
    Java 中推荐用 ArrayDeque 作为队列实现，比 LinkedList 更高效（缓存友好）。

(4) 选 ArrayList（数组）
    核心需求是「只追加末尾 + 定期批量导出」→ 末尾追加 O(1)，批量遍历 O(n)。
    数组内存连续，遍历时 CPU 缓存命中率高，导出性能更佳。
    LinkedList 的分散内存在大量遍历时缓存效率极差，不适合日志这种写多读（遍历）的场景。`}
    />
  </article>
);

export default index;
