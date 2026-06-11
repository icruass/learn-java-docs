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
    <Title>二叉查找树（BST）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>二叉查找树（Binary Search Tree，BST）</Text>，也叫二叉排序树或二叉搜索树，
        是在普通二叉树基础上加了一条有序约束：对任意节点，左子树的所有值均小于该节点值，
        右子树的所有值均大于该节点值。这一性质让查找、插入、删除的平均时间复杂度都达到
        O(log n)，是理解后续平衡树（AVL、红黑树）的核心基础。
        本节讲清 BST 的性质、查找/插入/删除三大操作、中序遍历有序的推论，
        以及最重要的退化问题。
      </Paragraph>
    </Callout>

    <Heading3>1. BST 的核心性质</Heading3>
    <Paragraph>
      BST 在普通二叉树的基础上增加以下约束（对树中<Text bold>每一个节点</Text>都成立）：
    </Paragraph>
    <OrderedList>
      <ListItem>
        该节点的<Text bold>左子树中所有节点的值</Text>均<Text bold>小于</Text>该节点的值。
      </ListItem>
      <ListItem>
        该节点的<Text bold>右子树中所有节点的值</Text>均<Text bold>大于</Text>该节点的值。
      </ListItem>
      <ListItem>
        左、右子树本身也各自是一棵 BST（递归定义）。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="BST 性质的简洁表述">
      对 BST 中任意节点 N，有：左子树所有值 &lt; N.val &lt; 右子树所有值。
      这条性质使得"二分查找"思想可以直接应用于树结构。
    </Callout>
    <CodeBlock
      language="text"
      title="一棵合法的 BST"
      code={`          8
         / \\
        3   10
       / \\    \\
      1   6    14
         / \\   /
        4   7 13

验证：
  节点 8：左子树（1,3,4,6,7）全 < 8；右子树（10,13,14）全 > 8  ✓
  节点 3：左子树（1）< 3；右子树（4,6,7）> 3  ✓
  节点 10：无左子树；右子树（13,14）> 10  ✓`}
    />

    <Heading3>2. BST 的查找操作</Heading3>
    <Paragraph>
      从根节点出发，将目标值与当前节点值比较：
    </Paragraph>
    <OrderedList>
      <ListItem>目标值 == 当前节点值 → 找到，返回该节点。</ListItem>
      <ListItem>目标值 &lt; 当前节点值 → 目标只可能在<Text bold>左子树</Text>，递归/迭代往左走。</ListItem>
      <ListItem>目标值 &gt; 当前节点值 → 目标只可能在<Text bold>右子树</Text>，递归/迭代往右走。</ListItem>
      <ListItem>当前节点为 null → 未找到，返回 null。</ListItem>
    </OrderedList>
    <Paragraph>
      平均情况下每次比较都排除一半节点，时间复杂度为 <Text bold>O(log n)</Text>；
      最坏情况（退化成链表）为 O(n)，详见第 6 节。
    </Paragraph>

    <Heading3>3. BST 的插入操作</Heading3>
    <Paragraph>
      插入新值的路径与查找完全一致——沿查找路径走到<Text bold>空位</Text>（null）时，
      在该位置挂上新节点。BST 的插入结果是唯一确定的。
    </Paragraph>
    <OrderedList>
      <ListItem>若树为空，新节点即为根节点。</ListItem>
      <ListItem>新值 &lt; 当前节点值 → 往左走，若左孩子为 null 则插在此处。</ListItem>
      <ListItem>新值 &gt; 当前节点值 → 往右走，若右孩子为 null 则插在此处。</ListItem>
      <ListItem>新值 == 当前节点值 → 通常忽略（BST 默认不存重复值）。</ListItem>
    </OrderedList>

    <Heading3>4. BST 的删除操作（三种情况）</Heading3>
    <Paragraph>
      删除是 BST 中最复杂的操作，需要分三种情况讨论：
    </Paragraph>
    <Table
      head={['情况', '描述', '处理方式']}
      rows={[
        ['情况1：叶子节点', '被删节点没有子节点', '直接删除，父节点对应指针置 null'],
        ['情况2：单孩子', '被删节点只有左孩子或只有右孩子', '用唯一的子节点顶替被删节点的位置'],
        ['情况3：双孩子', '被删节点同时有左右子节点', '找中序后继（右子树最小值）或中序前驱（左子树最大值），用其值替换被删节点，再删掉那个后继/前驱'],
      ]}
    />
    <CodeBlock
      language="text"
      title="情况3 示例：删除节点 3（有两个子节点）"
      code={`原树：               找中序后继（右子树最小值 = 4）：    替换后：
      8                        8                              8
     / \\                      / \\                            / \\
    3   10        删 3 →      4   10          →             4   10
   / \\    \\                  / \\    \\                        \\    \\
  1   6    14               1   6    14                      6    14
     / \\   /                   / \\   /                      / \\   /
    4   7 13                  4   7 13                     (4已被移走) 7  13

步骤：① 找到节点 3 的中序后继 = 右子树中最小值 = 4
     ② 用 4 的值替换节点 3 的值
     ③ 删除原来那个值为 4 的叶子节点（此时退化为情况1）`}
    />
    <Callout type="tip" title="中序后继 vs 中序前驱">
      中序后继：右子树中最小的节点（一路往左走到底）。
      中序前驱：左子树中最大的节点（一路往右走到底）。
      两种选择都合法，效果等价，Java 实现中通常选中序后继。
    </Callout>

    <Heading3>5. 中序遍历 BST 得到升序序列</Heading3>
    <Paragraph>
      对 BST 做中序遍历（左 → 根 → 右），由于 BST 的有序性质，
      必然按<Text bold>从小到大的升序</Text>输出所有节点的值。
      这是验证一棵树是否为合法 BST 的常用方法之一。
    </Paragraph>
    <CodeBlock
      language="text"
      title="上图 BST 的中序遍历（升序验证）"
      code={`中序遍历：1 → 3 → 4 → 6 → 7 → 8 → 10 → 13 → 14

完全有序，与从小到大排列一致。`}
    />

    <Heading3>6. 代码示例：BST 插入 + 查找 + 中序遍历</Heading3>
    <CodeBlock
      title="BST.java"
      code={`public class BST {

    // 节点类
    static class Node {
        int val;
        Node left, right;
        Node(int val) { this.val = val; }
    }

    Node root;

    // ====== 插入 ======
    public void insert(int val) {
        root = insertRec(root, val);
    }

    private Node insertRec(Node node, int val) {
        if (node == null) return new Node(val);   // 找到空位，创建新节点
        if (val < node.val) {
            node.left  = insertRec(node.left,  val);  // 往左递归
        } else if (val > node.val) {
            node.right = insertRec(node.right, val);  // 往右递归
        }
        // val == node.val：忽略重复值
        return node;
    }

    // ====== 查找 ======
    public Node search(int val) {
        return searchRec(root, val);
    }

    private Node searchRec(Node node, int val) {
        if (node == null)       return null;       // 未找到
        if (val == node.val)    return node;       // 找到
        if (val < node.val)     return searchRec(node.left,  val);
        return                         searchRec(node.right, val);
    }

    // ====== 中序遍历（升序输出）======
    public void inOrder(Node node) {
        if (node == null) return;
        inOrder(node.left);
        System.out.print(node.val + " ");
        inOrder(node.right);
    }

    public static void main(String[] args) {
        BST bst = new BST();

        // 依次插入：8, 3, 10, 1, 6, 14, 4, 7, 13
        int[] values = {8, 3, 10, 1, 6, 14, 4, 7, 13};
        for (int v : values) {
            bst.insert(v);
        }

        // 中序遍历验证有序
        System.out.print("中序遍历（应为升序）：");
        bst.inOrder(bst.root);
        System.out.println();

        // 查找操作
        int target1 = 6;
        int target2 = 99;
        Node r1 = bst.search(target1);
        Node r2 = bst.search(target2);
        System.out.println("查找 " + target1 + "：" + (r1 != null ? "找到，值=" + r1.val : "未找到"));
        System.out.println("查找 " + target2 + "：" + (r2 != null ? "找到，值=" + r2.val : "未找到"));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`中序遍历（应为升序）：1 3 4 6 7 8 10 13 14
查找 6：找到，值=6
查找 99：未找到`}
    />
    <Paragraph>
      中序遍历结果 1 3 4 6 7 8 10 13 14 完全有序，验证了 BST 的有序性质。
      查找 6 只需从根 8 往左走到 3，再往右走到 6，共 3 步；
      查找 99 则一路向右走直到 null，返回"未找到"。
    </Paragraph>

    <Heading3>7. BST 的退化问题</Heading3>
    <Callout type="danger" title="按有序数据插入会使 BST 退化为链表！">
      <Paragraph>
        BST 的形状完全由<Text bold>插入顺序</Text>决定。如果依次插入已排好序的数据
        （如 1, 2, 3, 4, 5），每个新节点都只能往右挂，树会退化成一条向右倾斜的链表：
      </Paragraph>
      <CodeBlock
        language="text"
        title="按顺序插入 1→2→3→4→5 的退化 BST"
        code={`  1
   \\
    2
     \\
      3
       \\
        4
         \\
          5

高度从理想的 O(log n) 膨胀到 O(n)！
查找/插入/删除最坏时间复杂度全部退化为 O(n)，与链表无异。`}
      />
      <Paragraph>
        这就是 BST 的核心缺陷：<Text bold>性能依赖于树的平衡程度</Text>，
        最坏情况等同于线性查找。解决方案是引入<Text bold>自平衡树</Text>（AVL 树、红黑树），
        在每次插入/删除后通过旋转操作保持树的平衡，将高度始终维持在 O(log n)。
        详见下一节。
      </Paragraph>
    </Callout>
    <Table
      head={['操作', '平均时间复杂度（平衡 BST）', '最坏时间复杂度（退化链表）']}
      rows={[
        ['查找', 'O(log n)', 'O(n)'],
        ['插入', 'O(log n)', 'O(n)'],
        ['删除', 'O(log n)', 'O(n)'],
        ['中序遍历', 'O(n)', 'O(n)'],
      ]}
    />
    <Callout type="success" title="小结">
      <UnorderedList>
        <ListItem>BST 性质：对任意节点，左子树所有值 &lt; 该节点值 &lt; 右子树所有值。</ListItem>
        <ListItem>查找：从根出发，小往左大往右，平均 O(log n)。</ListItem>
        <ListItem>插入：沿查找路径走到 null，在此创建新节点。</ListItem>
        <ListItem>删除：三种情况——叶子直接删；单孩子用孩子顶替；双孩子用中序后继/前驱替换。</ListItem>
        <ListItem>中序遍历 BST 得到升序序列，可用于验证合法性。</ListItem>
        <ListItem>有序数据插入导致退化，引出平衡树（下一节）。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：在 BST 中查找最小值"
      code={`// 要求：给定一棵 BST 的根节点，返回其中最小值的节点。
// 提示：BST 最小值一定在最左边——沿左孩子一路向下走到底即可。
// 使用下面的 BST：插入顺序 8, 3, 10, 1, 6, 14

static class Node {
    int val;
    Node left, right;
    Node(int val) { this.val = val; }
}

// 请补全方法：返回以 node 为根的 BST 中值最小的节点
static Node findMin(Node node) {
    // 补全
}

public static void main(String[] args) {
    Node root = new Node(8);
    root.left        = new Node(3);
    root.right       = new Node(10);
    root.left.left   = new Node(1);
    root.left.right  = new Node(6);
    root.right.right = new Node(14);

    Node min = findMin(root);
    System.out.println("BST 最小值：" + min.val);
}`}
      answerCode={`static Node findMin(Node node) {
    if (node == null) return null;
    // 一路往左走，直到左孩子为 null，当前节点即为最小值
    while (node.left != null) {
        node = node.left;
    }
    return node;
}

/* 控制台输出：
BST 最小值：1

解析：从根 8 开始，往左走到 3，再往左走到 1，1 的左孩子为 null，
      所以 1 就是整棵 BST 的最小值。
      同理，最大值只需一路往右走到底。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：验证一棵二叉树是否为合法 BST"
      code={`// 要求：给定一棵二叉树的根节点，判断它是否满足 BST 的性质。
// 常见错误思路：只比较每个节点与直接子节点的大小关系，这是不够的！
// 正确思路：用「上下界」递归——每个节点的值必须在 (min, max) 范围内。
//   - 根节点：范围 (Long.MIN_VALUE, Long.MAX_VALUE)
//   - 递归左子树时，max 更新为当前节点值（左子树所有值必须 < 当前值）
//   - 递归右子树时，min 更新为当前节点值（右子树所有值必须 > 当前值）

static class Node {
    int val;
    Node left, right;
    Node(int val) { this.val = val; }
}

static boolean isValidBST(Node node, long min, long max) {
    // 补全
}

public static void main(String[] args) {
    // 合法 BST
    Node validRoot = new Node(5);
    validRoot.left  = new Node(3);
    validRoot.right = new Node(7);
    validRoot.left.left  = new Node(1);
    validRoot.left.right = new Node(4);

    // 非法树（节点 6 在 5 的右子树但 5 的左子树里有节点 6，违反全局约束）
    Node invalidRoot = new Node(5);
    invalidRoot.left       = new Node(3);
    invalidRoot.right      = new Node(7);
    invalidRoot.left.right = new Node(6);  // 6 > 5，应该在右子树，放左子树违反全局约束

    System.out.println("validRoot 是合法 BST：" +
        isValidBST(validRoot, Long.MIN_VALUE, Long.MAX_VALUE));
    System.out.println("invalidRoot 是合法 BST：" +
        isValidBST(invalidRoot, Long.MIN_VALUE, Long.MAX_VALUE));
}`}
      answerCode={`static boolean isValidBST(Node node, long min, long max) {
    if (node == null) return true;              // 空节点合法
    if (node.val <= min || node.val >= max) return false;  // 超出范围，非法
    // 递归验证左子树（上界收紧为当前值）和右子树（下界收紧为当前值）
    return isValidBST(node.left,  min,      node.val)
        && isValidBST(node.right, node.val, max);
}

/* 控制台输出：
validRoot 是合法 BST：true
invalidRoot 是合法 BST：false

解析：
  对 invalidRoot，节点 3 的右孩子是 6。
  当递归到 6 时，其传入的范围是 (Long.MIN_VALUE, 5)（因为 6 是 5 的左子树里的节点，
  上界是 5），但 6 >= 5，触发 false。
  仅比较父子关系会误判为合法，上下界传递才能正确捕捉全局约束。
*/`}
    />

    <CodeBlock
      qa
      title="练习3：BST 中序遍历的有序性"
      code={`// 分析题（无需写代码）：
// 已知对以下三棵二叉树做中序遍历，输出分别为：
//   树 A：中序输出 3 5 7 9 11
//   树 B：中序输出 5 3 7 1 9
//   树 C：中序输出 1 3 5 7 9
//
// 问：哪些树可能是合法的 BST？为什么？
// （提示：合法 BST 的中序遍历一定是严格升序序列）`}
      answerCode={`答案：树 A 和树 C 可能是合法 BST，树 B 不可能。

分析：
  树 A：3 5 7 9 11 —— 严格递增，符合 BST 中序有序性质，可能是合法 BST。
  树 B：5 3 7 1 9  —— 不是递增序列（5 > 3，3 > 1 均出现「下降」），
                     BST 的中序遍历必须严格升序，因此树 B 一定不是合法 BST。
  树 C：1 3 5 7 9  —— 严格递增，可能是合法 BST。

注意：中序遍历为升序是 BST 的必要条件，但不是充分条件。
  例如，若一棵树通过特殊方式构造出升序中序遍历，但节点间不满足「左子树全小于父节点」
  等全局约束，则不是合法 BST（此时需结合上下界方法判断，见练习 2）。
  实际判断合法性首选上下界递归法（练习 2 的方式）。`}
    />
  </article>
);

export default index;
