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
    <Title>树与二叉树</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>树（Tree）</Text>是一种层级化的非线性数据结构，现实中目录结构、组织架构、
        XML/HTML 文档都是树的直接映射。本节先讲清树的基本术语，再聚焦最重要的一种——
        <Text bold>二叉树（Binary Tree）</Text>：定义、特殊形态（满二叉树 vs 完全二叉树），
        以及四种遍历方式（前序、中序、后序、层序）的思路与代码实现。
        掌握本节是学习后续二叉查找树、平衡树的基础。
      </Paragraph>
    </Callout>

    <Heading3>1. 树的基本术语</Heading3>
    <Paragraph>
      一棵树由若干<Text bold>节点（Node）</Text>和连接节点的<Text bold>边（Edge）</Text>组成，
      满足：有且仅有一个<Text bold>根节点（Root）</Text>，其余节点各有唯一的父节点，
      且节点之间不构成环。
    </Paragraph>
    <CodeBlock
      language="text"
      title="树结构示意图"
      code={`           A          ← 根节点 (Root)，层 1
          / \\
         B   C         ← A 的子节点，层 2；B 与 C 互为兄弟节点
        / \\   \\
       D   E   F       ← 层 3；D、E 是 B 的子节点；F 是 C 的子节点
          /
         G             ← 层 4；G 是 E 的子节点（叶子节点）

  D、F、G 没有子节点，称为叶子节点（Leaf）`}
    />
    <Table
      head={['术语', '含义']}
      rows={[
        ['根节点（Root）', '树最顶端的节点，没有父节点，整棵树只有一个根'],
        ['父节点（Parent）', '直接连接某节点的上层节点，如 A 是 B 的父节点'],
        ['子节点（Child）', '直接连接某节点的下层节点，如 B、C 都是 A 的子节点'],
        ['兄弟节点（Sibling）', '具有同一父节点的节点，如 B 与 C 互为兄弟节点'],
        ['叶子节点（Leaf）', '没有子节点的节点，即度为 0 的节点'],
        ['节点的度（Degree）', '该节点拥有的子节点数量，如 A 的度为 2，D 的度为 0'],
        ['树的度', '树中所有节点的度的最大值，上图树的度为 2'],
        ['层（Level）', '根节点在第 1 层，其子节点在第 2 层，以此类推'],
        ['深度（Depth）', '从根节点到某节点的路径长度（经过的边数），根的深度为 0'],
        ['高度（Height）', '从某节点到其最远叶子节点的路径长度；整棵树的高度 = 根的高度'],
        ['子树（Subtree）', '某节点及其所有后代构成的树，如以 B 为根的子树包含 B、D、E、G'],
      ]}
    />
    <Callout type="tip" title="深度与高度的方向相反">
      深度从根往下数（根深度为 0），高度从叶子往上数（叶子高度为 0）。
      上图中节点 A 的高度为 3，节点 G 的深度为 3。部分教材从 1 开始计数，注意统一即可。
    </Callout>

    <Heading3>2. 二叉树的定义</Heading3>
    <Paragraph>
      <Text bold>二叉树（Binary Tree）</Text>是树的一种特殊形态：每个节点<Text bold>最多有两个子节点</Text>，
      分别称为<Text bold>左孩子（Left Child）</Text>和<Text bold>右孩子（Right Child）</Text>。
      左右孩子的顺序不可互换，即左子树和右子树是有区别的。
    </Paragraph>
    <Paragraph>
      用 Java 表示二叉树节点的标准写法如下，本章所有示例均沿用这个 <InlineCode>Node</InlineCode> 类：
    </Paragraph>
    <CodeBlock
      title="Node.java（本章通用节点类）"
      code={`public class Node {
    int val;       // 节点存储的值
    Node left;     // 左孩子引用
    Node right;    // 右孩子引用

    public Node(int val) {
        this.val = val;
    }
}`}
    />
    <Callout type="tip" title="二叉树节点的三种情况">
      每个节点可能处于以下三种状态之一：
      ① left == null &amp;&amp; right == null（叶子节点）；
      ② 只有 left 或只有 right（单孩子节点）；
      ③ left != null &amp;&amp; right != null（双孩子节点）。
    </Callout>

    <Heading3>3. 特殊二叉树：满二叉树与完全二叉树</Heading3>
    <Heading4>3.1 满二叉树（Full Binary Tree）</Heading4>
    <Paragraph>
      每一层的节点数都达到最大值的二叉树。高度为 h 的满二叉树共有
      <Text bold> 2^(h+1) - 1 </Text> 个节点，每个非叶子节点恰好有两个子节点。
    </Paragraph>
    <CodeBlock
      language="text"
      title="满二叉树（高度 = 2，共 7 个节点）"
      code={`        1
       / \\
      2   3
     / \\ / \\
    4  5 6  7

所有叶子（4、5、6、7）在同一层，每个非叶子节点都有两个子节点。`}
    />

    <Heading4>3.2 完全二叉树（Complete Binary Tree）</Heading4>
    <Paragraph>
      高度为 h 的完全二叉树：前 h-1 层全满，最后一层的节点<Text bold>从左向右连续排列</Text>，
      中间不能有空缺。满二叉树是完全二叉树的特例。
    </Paragraph>
    <CodeBlock
      language="text"
      title="完全二叉树 vs 非完全二叉树"
      code={`完全二叉树（合法）：        非完全二叉树（非法）：
        1                             1
       / \\                           / \\
      2   3                         2   3
     / \\ /                         / \\   \\
    4  5 6                         4  5   7   ← 最后一层右边有节点但左边缺 6，不连续`}
    />
    <Table
      head={['对比项', '满二叉树', '完全二叉树']}
      rows={[
        ['最后一层', '全满', '节点从左到右连续，可以不全满'],
        ['非叶子节点的子节点数', '一定是 2', '可以是 1 或 2'],
        ['包含关系', '满二叉树一定是完全二叉树', '完全二叉树不一定是满二叉树'],
        ['典型应用', '表达式树、对称结构', '堆（优先队列）的底层结构'],
      ]}
    />
    <Callout type="warning" title="完全二叉树和满二叉树的区别很常考">
      满二叉树要求每层全满；完全二叉树只要求最后一层从左到右连续。
      判断完全二叉树的关键：按层序编号，若编号 i 的节点存在而编号 i+1 的节点不存在，
      则 i+1 及之后的位置必须全空，否则不是完全二叉树。
    </Callout>

    <Heading3>4. 二叉树的遍历</Heading3>
    <Paragraph>
      遍历是对树中每个节点<Text bold>恰好访问一次</Text>的过程。二叉树有四种经典遍历方式，
      前三种用递归实现，层序用队列（BFS）实现。
    </Paragraph>
    <CodeBlock
      language="text"
      title="用于演示遍历的示例树"
      code={`          1
         / \\
        2   3
       / \\   \\
      4   5   6

节点值：1（根）、2（左子）、3（右子）、4（2的左子）、5（2的右子）、6（3的右子）`}
    />

    <Heading4>4.1 前序遍历（Pre-order）：根 → 左 → 右</Heading4>
    <Paragraph>
      先访问<Text bold>根节点</Text>，再递归遍历<Text bold>左子树</Text>，最后递归遍历<Text bold>右子树</Text>。
      上图前序遍历结果：1 → 2 → 4 → 5 → 3 → 6。
    </Paragraph>

    <Heading4>4.2 中序遍历（In-order）：左 → 根 → 右</Heading4>
    <Paragraph>
      先递归遍历<Text bold>左子树</Text>，再访问<Text bold>根节点</Text>，最后递归遍历<Text bold>右子树</Text>。
      上图中序遍历结果：4 → 2 → 5 → 1 → 3 → 6。
    </Paragraph>

    <Heading4>4.3 后序遍历（Post-order）：左 → 右 → 根</Heading4>
    <Paragraph>
      先递归遍历<Text bold>左子树</Text>，再递归遍历<Text bold>右子树</Text>，最后访问<Text bold>根节点</Text>。
      上图后序遍历结果：4 → 5 → 2 → 6 → 3 → 1。
    </Paragraph>

    <Heading4>4.4 层序遍历（Level-order / BFS）：按层从左到右</Heading4>
    <Paragraph>
      按层从上到下、同层从左到右依次访问每个节点，借助<Text bold>队列（Queue）</Text>实现。
      上图层序遍历结果：1 → 2 → 3 → 4 → 5 → 6。
    </Paragraph>
    <Table
      head={['遍历方式', '顺序口诀', '示例树结果', '实现方式']}
      rows={[
        ['前序（Pre-order）', '根 左 右', '1 2 4 5 3 6', '递归 / 栈'],
        ['中序（In-order）', '左 根 右', '4 2 5 1 3 6', '递归 / 栈'],
        ['后序（Post-order）', '左 右 根', '4 5 2 6 3 1', '递归 / 栈'],
        ['层序（Level-order）', '逐层从左到右', '1 2 3 4 5 6', '队列（BFS）'],
      ]}
    />

    <Heading3>5. 完整代码示例：构建二叉树 + 四种遍历</Heading3>
    <CodeBlock
      title="BinaryTree.java"
      code={`import java.util.LinkedList;
import java.util.Queue;

public class BinaryTree {

    // ====== 节点类（复用本章通用定义）======
    static class Node {
        int val;
        Node left, right;
        Node(int val) { this.val = val; }
    }

    // ====== 前序遍历：根 -> 左 -> 右 ======
    static void preOrder(Node node) {
        if (node == null) return;
        System.out.print(node.val + " ");
        preOrder(node.left);
        preOrder(node.right);
    }

    // ====== 中序遍历：左 -> 根 -> 右 ======
    static void inOrder(Node node) {
        if (node == null) return;
        inOrder(node.left);
        System.out.print(node.val + " ");
        inOrder(node.right);
    }

    // ====== 后序遍历：左 -> 右 -> 根 ======
    static void postOrder(Node node) {
        if (node == null) return;
        postOrder(node.left);
        postOrder(node.right);
        System.out.print(node.val + " ");
    }

    // ====== 层序遍历：借助队列（BFS）======
    static void levelOrder(Node root) {
        if (root == null) return;
        Queue<Node> queue = new LinkedList<>();
        queue.offer(root);                    // 根节点入队
        while (!queue.isEmpty()) {
            Node cur = queue.poll();          // 取出队头节点
            System.out.print(cur.val + " "); // 访问节点
            if (cur.left  != null) queue.offer(cur.left);  // 左孩子入队
            if (cur.right != null) queue.offer(cur.right); // 右孩子入队
        }
    }

    public static void main(String[] args) {
        /*
         * 手动构建如下二叉树：
         *       1
         *      / \\
         *     2   3
         *    / \\   \\
         *   4   5   6
         */
        Node root = new Node(1);
        root.left        = new Node(2);
        root.right       = new Node(3);
        root.left.left   = new Node(4);
        root.left.right  = new Node(5);
        root.right.right = new Node(6);

        System.out.print("前序遍历（根左右）：");
        preOrder(root);
        System.out.println();

        System.out.print("中序遍历（左根右）：");
        inOrder(root);
        System.out.println();

        System.out.print("后序遍历（左右根）：");
        postOrder(root);
        System.out.println();

        System.out.print("层序遍历（逐层）：");
        levelOrder(root);
        System.out.println();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`前序遍历（根左右）：1 2 4 5 3 6
中序遍历（左根右）：4 2 5 1 3 6
后序遍历（左右根）：4 5 2 6 3 1
层序遍历（逐层）：1 2 3 4 5 6 `}
    />
    <Paragraph>
      递归遍历的终止条件是 <InlineCode>node == null</InlineCode>，三种递归遍历唯一的区别是
      打印语句与两次递归调用的相对顺序。层序遍历用队列模拟"先进先出"：
      访问节点时，把它的左右孩子依次入队，保证同层节点按从左到右的顺序被处理。
    </Paragraph>

    <Heading3>6. 二叉树的常用性质</Heading3>
    <OrderedList>
      <ListItem>
        高度为 h（从 0 计）的二叉树，最多有 <Text bold>2^(h+1) - 1</Text> 个节点（满二叉树时取等）。
      </ListItem>
      <ListItem>
        第 i 层（从 1 计）最多有 <Text bold>2^(i-1)</Text> 个节点。
      </ListItem>
      <ListItem>
        若叶子节点数为 n0，度为 2 的节点数为 n2，则 <Text bold>n0 = n2 + 1</Text>（对任意非空二叉树成立）。
      </ListItem>
      <ListItem>
        含 n 个节点的完全二叉树高度为 <Text bold>⌊log₂n⌋</Text>，即 O(log n)。
      </ListItem>
    </OrderedList>
    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>树的核心术语：根、父子、兄弟、叶子、度、层、深度/高度、子树。</ListItem>
        <ListItem>二叉树：每节点最多两个子节点（左孩子、右孩子），左右有序。</ListItem>
        <ListItem>满二叉树每层全满；完全二叉树最后一层从左到右连续。</ListItem>
        <ListItem>四种遍历：前序（根左右）、中序（左根右）、后序（左右根）用递归；层序用队列。</ListItem>
        <ListItem>递归遍历终止条件统一为 <InlineCode>if (node == null) return;</InlineCode></ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：求二叉树的最大深度"
      code={`// 要求：给定一棵二叉树的根节点 root，
// 返回该树的最大深度（从根节点到最远叶子节点的层数，根节点算第 1 层）。
// 例如上文示例树（根1，左2，右3，4/5是2的子节点，6是3的右子节点）的最大深度为 3。
// 提示：用递归，左右子树深度的最大值 + 1 即为当前节点的深度。

static class Node {
    int val;
    Node left, right;
    Node(int val) { this.val = val; }
}

// 请补全下面的方法
static int maxDepth(Node node) {
    // 补全
}

public static void main(String[] args) {
    Node root = new Node(1);
    root.left        = new Node(2);
    root.right       = new Node(3);
    root.left.left   = new Node(4);
    root.left.right  = new Node(5);
    root.right.right = new Node(6);
    System.out.println("最大深度：" + maxDepth(root));
}`}
      answerCode={`static int maxDepth(Node node) {
    if (node == null) return 0;          // 空节点深度为 0
    int leftDepth  = maxDepth(node.left);
    int rightDepth = maxDepth(node.right);
    return Math.max(leftDepth, rightDepth) + 1;  // 左右取大，再加上当前层
}

// main 方法同题目，不重复

/* 控制台输出：
最大深度：3

解析：
  maxDepth(4) = 1, maxDepth(5) = 1
  maxDepth(2) = max(1, 1) + 1 = 2
  maxDepth(6) = 1
  maxDepth(3) = max(0, 1) + 1 = 2
  maxDepth(1) = max(2, 2) + 1 = 3
递归自底向上计算，每层取左右深度的最大值再加 1。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：统计二叉树的节点总数"
      code={`// 要求：给定二叉树的根节点，用递归方法统计并返回树中所有节点的总数量。
// 同样使用上文的示例树（共 6 个节点），预期输出：节点总数：6

static int countNodes(Node node) {
    // 补全
}

public static void main(String[] args) {
    Node root = new Node(1);
    root.left        = new Node(2);
    root.right       = new Node(3);
    root.left.left   = new Node(4);
    root.left.right  = new Node(5);
    root.right.right = new Node(6);
    System.out.println("节点总数：" + countNodes(root));
}`}
      answerCode={`static int countNodes(Node node) {
    if (node == null) return 0;                         // 空节点贡献 0
    return 1 + countNodes(node.left) + countNodes(node.right); // 当前节点 + 左子树数量 + 右子树数量
}

/* 控制台输出：
节点总数：6

解析：
  countNodes(null) = 0
  countNodes(4) = 1, countNodes(5) = 1, countNodes(6) = 1
  countNodes(2) = 1 + 1 + 1 = 3
  countNodes(3) = 1 + 0 + 1 = 2
  countNodes(1) = 1 + 3 + 2 = 6
思路：将"整棵树的节点数"分解为"左子树节点数 + 右子树节点数 + 1（当前节点）"，递归到空节点返回 0。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：判断两棵二叉树是否结构与值完全相同"
      code={`// 要求：给定两棵二叉树的根节点 p 和 q，
// 若它们的结构完全相同且每个对应位置的节点值相等，返回 true；否则返回 false。
// 提示：同时递归两棵树，每步比较当前节点值以及左右子树是否分别相同。

static boolean isSameTree(Node p, Node q) {
    // 补全
}

public static void main(String[] args) {
    // 构建树1
    Node t1 = new Node(1);
    t1.left  = new Node(2);
    t1.right = new Node(3);

    // 构建树2（与树1相同）
    Node t2 = new Node(1);
    t2.left  = new Node(2);
    t2.right = new Node(3);

    // 构建树3（与树1不同）
    Node t3 = new Node(1);
    t3.left  = new Node(2);
    t3.right = new Node(99);

    System.out.println("t1 与 t2 相同：" + isSameTree(t1, t2));
    System.out.println("t1 与 t3 相同：" + isSameTree(t1, t3));
}`}
      answerCode={`static boolean isSameTree(Node p, Node q) {
    if (p == null && q == null) return true;   // 两个都为空，相同
    if (p == null || q == null) return false;  // 一个为空一个不为空，不同
    if (p.val != q.val)         return false;  // 值不等，不同
    // 当前节点值相等，继续递归比较左右子树
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

/* 控制台输出：
t1 与 t2 相同：true
t1 与 t3 相同：false

解析：
递归的终止条件分三档：
  ① 两者均为 null → true（结构和值都"空"，匹配）
  ② 一个 null 一个非 null → false（结构不同）
  ③ 值不等 → false
三关全过后再递归比较左子树和右子树，均相同才返回 true。
*/`}
    />
  </article>
);

export default index;
