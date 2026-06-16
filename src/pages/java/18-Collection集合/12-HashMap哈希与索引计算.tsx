import React from 'react';
import ChapterExercises from "@/pages/java/练习题/ChapterExercises";
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
    <Title>HashMap 哈希与索引计算</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节「Map 接口与 HashMap」讲了 HashMap 怎么用，这一节深入它的底层：
        一个 key 进来后，HashMap 究竟<Text bold>怎么算出它该放进数组的哪个格子</Text>。
        整个过程分两步——先对 key 算出哈希值并做一次<Text bold>扰动</Text>，
        再由哈希值算出<Text bold>数组下标</Text>。本节把每个位运算、每个二进制位都拆开讲清楚，
        手算一个真实例子，最后对比 JDK 1.7 / 1.8 的差异。看不懂位运算也没关系，会从最基础讲起。
      </Paragraph>
    </Callout>

    {/* ───────────────── 1 预备知识 ───────────────── */}
    <Heading3>1. 预备知识：hashCode 是什么</Heading3>
    <Paragraph>
      每个 Java 对象都有一个 <InlineCode>hashCode()</InlineCode> 方法，返回一个
      <Text bold> int 整数</Text>（32 位，范围约 -21 亿 ~ +21 亿，<Text bold>可以是负数</Text>）。
      可以把它理解成对象的“身份证号”：同一个对象多次调用结果相同，内容相同的对象（正确重写后）结果也相同。
    </Paragraph>
    <CodeBlock
      title="hashCode 举例"
      code={`Integer n = 100;
System.out.println(n.hashCode());        // 100   （Integer 的哈希就是它本身）
System.out.println("apple".hashCode());  // 93029210
System.out.println("".hashCode());       // 0     （空串哈希为 0）`}
    />
    <Paragraph>
      问题来了：HashMap 内部是一个数组（叫 <InlineCode>table</InlineCode>），默认长度只有
      <Text bold> 16</Text>，下标范围是 <InlineCode>0 ~ 15</InlineCode>。
      可哈希值动辄上亿，<Text bold>怎么把一个上亿的数，映射成 0~15 之间的下标？</Text>
      这就是“索引计算”要解决的事。
    </Paragraph>

    {/* ───────────────── 2 取模 ───────────────── */}
    <Heading3>2. 最朴素的办法：取模 %</Heading3>
    <Paragraph>
      把一个大数压缩进 <InlineCode>0 ~ n-1</InlineCode> 的范围，最直接的就是<Text bold>取余数</Text>：
    </Paragraph>
    <CodeBlock
      title="取模求下标（仅作引子，HashMap 并没有这样写）"
      code={`int hashCode = 93029210;
int index = hashCode % 16;   // 93029210 % 16 = 10  →  落在 0~15 之间`}
    />
    <Paragraph>
      取模能用，但有两个缺点：① <InlineCode>%</InlineCode> 本质是除法运算，CPU 执行<Text bold>较慢</Text>；
      ② 哈希值可能为负，<InlineCode>负数 % n</InlineCode> 在 Java 中结果为负，不能直接当数组下标。
      HashMap 用了一个更快、且结果恒为非负的办法——按位与 <InlineCode>{'(n - 1) & hash'}</InlineCode>。
    </Paragraph>

    {/* ───────────────── 3 索引计算 ───────────────── */}
    <Heading3>3. 索引计算：用按位与代替取模</Heading3>
    <Heading4>3.1 为什么容量必须是 2 的幂</Heading4>
    <Paragraph>
      HashMap 数组的长度 <InlineCode>n</InlineCode> <Text bold>永远是 2 的幂</Text>：16、32、64……
      2 的幂在二进制里只有一位是 1，其余全是 0；那么 <InlineCode>n - 1</InlineCode> 的二进制就<Text bold>低位全是 1</Text>。
    </Paragraph>
    <Table
      head={['容量 n', 'n 的二进制', 'n - 1', 'n - 1 的二进制（低位全 1）']}
      rows={[
        ['16', '1 0000', '15', '0 1111'],
        ['32', '10 0000', '31', '01 1111'],
        ['64', '100 0000', '63', '011 1111'],
      ]}
    />

    <Heading4>3.2 用 &amp; 取出低几位</Heading4>
    <Paragraph>
      <Text bold>按位与（&amp;）</Text>的规则是“两个都是 1 才得 1”。
      用 <InlineCode>n - 1</InlineCode>（低位全 1、高位全 0）去“与”哈希值，效果就是：
      <Text bold>只保留哈希值的低几位，高位全部清零</Text>——结果自然落在 <InlineCode>0 ~ n-1</InlineCode>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="(n-1) & hash 只切出低位"
      code={`hash      = 93029210
          = ... 1000 0011 0101 1010   （只看低位）
n - 1     = 15
          = ... 0000 0000 0000 1111   （低 4 位是 1，其余是 0）
─────────────────────────────────────  & （按位与）
index     = ... 0000 0000 0000 1010   = 1010(二进制) = 10`}
    />
    <Paragraph>
      因为 <InlineCode>n</InlineCode> 是 2 的幂，<InlineCode>{'(n - 1) & hash'}</InlineCode> 的结果
      和 <InlineCode>hash % n</InlineCode> 对非负数完全相同，但更快、且恒为非负：
    </Paragraph>
    <Table
      head={['对比项', '(n-1) & hash', 'hash % n']}
      rows={[
        ['运算类型', '按位与（位运算）', '取余（除法运算）'],
        ['速度', '快，约一条 CPU 指令', '慢，需要做除法'],
        ['结果范围', '恒为 0 ~ n-1（非负）', '负数时结果为负，不能直接当下标'],
        ['前提条件', '要求 n 是 2 的幂', '任意 n 都可以'],
        ['等价性', 'n 为 2 的幂时，对非负数二者结果相同', '—'],
      ]}
    />

    {/* ───────────────── 4 碰撞 ───────────────── */}
    <Heading3>4. 哈希碰撞：只用低位会浪费高位信息</Heading3>
    <Paragraph>
      如果两个不同的 key 算出的下标相同，就叫<Text bold>哈希碰撞</Text>，
      它们会被放进同一个桶（bucket），形成<Text bold>链表</Text>（或在 Java 8 下转成<Text bold>红黑树</Text>）。
      碰撞越多，查询越慢，所以我们希望下标尽量<Text bold>分散均匀</Text>。
    </Paragraph>
    <Paragraph>
      但上一步 <InlineCode>{'(n - 1) & hash'}</InlineCode> 有个隐患：当 <InlineCode>n = 16</InlineCode> 时，
      只用到了哈希值的<Text bold>低 4 位</Text>，第 5 位及以上<Text bold>全部被丢弃</Text>了。
      于是只要低位相同，哪怕高位天差地别，也会撞在一起：
    </Paragraph>
    <CodeBlock
      language="text"
      title="低位相同 → 即使高位不同也会碰撞"
      code={`key A 的 hash = 0000 0000 0000 0001   →  & 1111 = 0001 = 桶 1
key B 的 hash = 1111 1111 0001 0001   →  & 1111 = 0001 = 桶 1
                ↑ 高位完全不同，却被丢弃了，两者照样碰撞`}
    />
    <Paragraph>
      高 16 位携带的“区分度”被白白浪费。<Text bold>能不能让高位也参与到下标计算里？</Text>
      这正是扰动函数要做的事。
    </Paragraph>

    {/* ───────────────── 5 扰动函数 ───────────────── */}
    <Heading3>5. 扰动函数：把高位“拌”进低位</Heading3>
    <Paragraph>
      为了解决“高位被浪费”的问题，HashMap 在算下标<Text bold>之前</Text>，先对原始哈希值做一次“扰动”。
      这是 JDK 8 的源码：
    </Paragraph>
    <CodeBlock
      title="HashMap#hash（JDK 8 源码）"
      code={`static final int hash(Object key) {
    int h;
    // key 为 null 时哈希值固定为 0（所以 null 键总是落在 0 号桶）
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}`}
    />
    <Paragraph>
      核心就一行：<InlineCode>{'h ^ (h >>> 16)'}</InlineCode>。它用到两个位运算：
      <InlineCode>{'>>>'}</InlineCode>（无符号右移）和 <InlineCode>^</InlineCode>（异或）。逐个拆解。
    </Paragraph>

    <Heading4>5.1 {'>>>'} 无符号右移</Heading4>
    <Paragraph>
      把二进制整体向右移动若干位，<Text bold>左边一律补 0</Text>（这点和 <InlineCode>{'>>'}</InlineCode>
      不同，<InlineCode>{'>>'}</InlineCode> 会补符号位）。<InlineCode>{'h >>> 16'}</InlineCode>
      的效果是：把 32 位中<Text bold>原来的高 16 位，挪到低 16 位</Text>，原来的低 16 位则被挤掉。
    </Paragraph>
    <CodeBlock
      language="text"
      title=">>> 右移示意"
      code={`1010 1100 >>> 2 = 0010 1011    （右移 2 位，左边补 0）

h        = [ 高16位 H ][ 低16位 L ]
h >>> 16 = [ 0000..0 ][ 高16位 H ]   （H 被挪到了低 16 位）`}
    />

    <Heading4>5.2 ^ 异或</Heading4>
    <Paragraph>
      异或的规则是“<Text bold>相同得 0，不同得 1</Text>”。它的作用是把两个数按位“混合”起来：
    </Paragraph>
    <Table
      head={['A 位', 'B 位', 'A ^ B', '规则']}
      rows={[
        ['0', '0', '0', '相同 → 0'],
        ['1', '1', '0', '相同 → 0'],
        ['0', '1', '1', '不同 → 1'],
        ['1', '0', '1', '不同 → 1'],
      ]}
    />
    <Paragraph>
      把 <InlineCode>h</InlineCode> 和 <InlineCode>{'h >>> 16'}</InlineCode> 异或，就是让
      <Text bold>原始的高 16 位</Text> 和 <Text bold>原始的低 16 位</Text> 逐位混合：
    </Paragraph>
    <CodeBlock
      language="text"
      title="h ^ (h >>> 16)：高低位混合"
      code={`h          = [ 高16位 H ][ 低16位 L ]
h >>> 16   = [ 0000..0 ][ 高16位 H ]
─────────────────────────────────────  ^
hash       = [   H    ][  L ^ H   ]
                        ↑ 低 16 位现在“吸收”了高 16 位的信息`}
    />
    <Paragraph>
      这样，后面再用 <InlineCode>{'(n - 1) & hash'}</InlineCode> 只取低几位时，
      这低几位已经<Text bold>融合了整个 32 位</Text>的特征，高位不同的 key 也更容易被分到不同的桶。
    </Paragraph>
    <Callout type="tip" title="为什么偏偏右移 16 位？">
      因为 int 是 32 位，右移 16 位刚好让<Text bold>高 16 位与低 16 位一一对齐</Text>做异或，
      一次操作就能让全部 32 位都影响到低位。这是“计算成本”和“散列质量”之间一个简单又划算的折中。
    </Callout>

    {/* ───────────────── 6 手算 ───────────────── */}
    <Heading3>6. 手算一遍：以 "apple" 为例</Heading3>
    <Paragraph>
      设 <InlineCode>key = "apple"</InlineCode>，容量 <InlineCode>n = 16</InlineCode>。
      已知 <InlineCode>"apple".hashCode() = 93029210</InlineCode>，我们完整走一遍“扰动 + 取下标”。
    </Paragraph>
    <CodeBlock
      language="text"
      title='手算 "apple" 的桶下标'
      code={`① 取原始哈希值
   h = "apple".hashCode() = 93029210
   h = 0000 0101 1000 1011  1000 0011 0101 1010
       └───── 高 16 位 ─────┘└───── 低 16 位 ─────┘

② 高 16 位无符号右移到低位（左边补 0）
   h >>> 16 = 0000 0000 0000 0000  0000 0101 1000 1011

③ 异或，把高位“拌”进低位
     h        = 0000 0101 1000 1011  1000 0011 0101 1010
     h >>> 16 = 0000 0000 0000 0000  0000 0101 1000 1011
   ───────────────────────────────────────────────────── ^
     hash     = 0000 0101 1000 1011  1000 0110 1101 0001   (= 93030097)

④ 用 (n-1) & hash 取低 4 位作下标
   n - 1 = 15 = 0000 0000 0000 0000  0000 0000 0000 1111
   hash       = 0000 0101 1000 1011  1000 0110 1101 0001
   ───────────────────────────────────────────────────── &
   index      = 0000 0000 0000 0000  0000 0000 0000 0001  = 1`}
    />
    <Paragraph>
      <Text bold>对比看扰动的效果：</Text>
    </Paragraph>
    <CodeBlock
      language="text"
      title="有扰动 vs 无扰动"
      code={`若【不扰动】，直接拿原始 h 的低 4 位：
   h 低 4 位    = 1010 = 10   → 会落在桶 10

做了【扰动】后：
   hash 低 4 位 = 0001 = 1    → 落在桶 1

高 16 位里的 0000 0101 1000 1011 被异或进了低位，
把最终下标从 10 改成了 1 —— 这就是扰动“让高位参与下标计算”的实际作用。`}
    />
    <Callout type="warning" title="例子里的 hashCode 是真实值">
      <InlineCode>"apple".hashCode()</InlineCode> 按 String 的公式
      <InlineCode> s[0]*31^(n-1) + s[1]*31^(n-2) + … </InlineCode> 算出来确实是
      <Text bold> 93029210</Text>，你可以自己跑一行 <InlineCode>System.out.println("apple".hashCode())</InlineCode> 验证。
    </Callout>

    {/* ───────────────── 7 null 键 ───────────────── */}
    <Heading3>7. null 键怎么办</Heading3>
    <Paragraph>
      回头看第 5 节的源码：<InlineCode>{'(key == null) ? 0 : ...'}</InlineCode>。
      当 key 为 <InlineCode>null</InlineCode> 时，<Text bold>哈希值直接定为 0</Text>，
      于是 <InlineCode>{'(n - 1) & 0 == 0'}</InlineCode>，null 键<Text bold>永远落在 0 号桶</Text>。
      这也是为什么 HashMap 允许（且只允许一个）<InlineCode>null</InlineCode> 键，而
      <InlineCode>Hashtable</InlineCode> 因为直接调用 <InlineCode>key.hashCode()</InlineCode> 不允许 null 键。
    </Paragraph>

    {/* ───────────────── 8 1.7 vs 1.8 ───────────────── */}
    <Heading3>8. JDK 1.7 与 1.8 的区别</Heading3>
    <Paragraph>
      JDK 1.7 的扰动要复杂得多——做了<Text bold>多次</Text>移位和异或；1.8 简化成了<Text bold>一次</Text>。
    </Paragraph>
    <CodeBlock
      title="JDK 1.7 的 hash（扰动 4 次）"
      code={`// JDK 1.7
final int hash(Object k) {
    int h = 0;
    h ^= k.hashCode();
    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}
// 取下标是单独的方法
static int indexFor(int h, int length) {
    return h & (length - 1);
}`}
    />
    <Table
      head={['对比项', 'JDK 1.7', 'JDK 1.8']}
      rows={[
        ['扰动次数', '多次移位 + 异或（4 次扰动）', '1 次：h ^ (h >>> 16)'],
        ['取下标', '单独的 indexFor(h, length)', '直接内联 (n-1) & hash'],
        ['底层结构', '数组 + 链表', '数组 + 链表 + 红黑树'],
        ['链表插入', '头插法（并发扩容可能成环、死循环）', '尾插法（避免成环）'],
        ['链表转树', '无', '链长 ≥ 8 且容量 ≥ 64 时转红黑树'],
      ]}
    />
    <Callout type="tip" title="为什么 1.8 敢把扰动简化">
      1.8 引入了红黑树：即便某个桶碰撞严重、链表很长，也能从 O(n) 退化保护到 O(log n)。
      碰撞的“惩罚”变小了，于是没必要再用复杂的多次扰动，
      一次 <InlineCode>{'h ^ (h >>> 16)'}</InlineCode> 在散列质量和计算速度间取得了更好的平衡。
    </Callout>

    {/* ───────────────── 9 扩容 rehash ───────────────── */}
    <Heading3>9. 进阶：扩容时的 rehash（2 的幂为何如此优雅）</Heading3>
    <Paragraph>
      当元素个数超过 <InlineCode>容量 × 0.75</InlineCode>（负载因子）时，HashMap 会<Text bold>扩容</Text>：
      <InlineCode>{'newCap = oldCap << 1'}</InlineCode>，容量翻倍、仍是 2 的幂。
      扩容意味着 <InlineCode>n</InlineCode> 变了，每个元素的下标 <InlineCode>{'(n-1) & hash'}</InlineCode>
      理论上都得重算。但 2 的幂让这件事变得极其廉价：
    </Paragraph>
    <Paragraph>
      容量从 16 变 32，掩码从 <InlineCode>1111</InlineCode> 变成 <InlineCode>1 1111</InlineCode>——
      只<Text bold>多看了一个二进制位</Text>（值为 16 = oldCap 的那一位）。所以每个元素只有两种去向：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <InlineCode>{'(hash & oldCap) == 0'}</InlineCode>：新增的那一位是 0，下标不变，<Text bold>留在原位 j</Text>。
      </ListItem>
      <ListItem>
        <InlineCode>{'(hash & oldCap) != 0'}</InlineCode>：新增的那一位是 1，<Text bold>整体后移到 j + oldCap</Text>。
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="text"
      title="扩容：一个 bit 决定去留（oldCap=16 → newCap=32）"
      code={`某元素 hash 低 5 位 = 0 0101
   旧下标 = hash & 15 = 0101 = 5
   新下标 = hash & 31 = 0 0101 = 5     →  & oldCap(16) == 0，留在原位 5

另一元素 hash 低 5 位 = 1 0101
   旧下标 = hash & 15 = 0101 = 5
   新下标 = hash & 31 = 1 0101 = 21    →  & oldCap(16) != 0，后移到 5 + 16 = 21`}
    />
    <Paragraph>
      于是扩容时，原来一个桶里的链表只会<Text bold>“一分为二”</Text>（一条留原位、一条去 j+oldCap），
      用一次按位与判断即可，<Text bold>不需要对每个元素重新取模</Text>。这就是“容量必须是 2 的幂”带来的第二个红利。
    </Paragraph>

    {/* ───────────────── 10 总结 ───────────────── */}
    <Heading3>10. 总结与关键常量</Heading3>
    <Callout type="success" title="三句话记住整个过程">
      <UnorderedList>
        <ListItem>
          <Text bold>取下标</Text>：<InlineCode>{'index = (n - 1) & hash'}</InlineCode>——n 是 2 的幂，等价于取模但更快、恒非负。
        </ListItem>
        <ListItem>
          <Text bold>为什么扰动</Text>：取下标只用到低几位，扰动让<Text bold>高位也参与</Text>，减少碰撞。
        </ListItem>
        <ListItem>
          <Text bold>怎么扰动</Text>：<InlineCode>{'hash = hashCode ^ (hashCode >>> 16)'}</InlineCode>，把高 16 位拌进低 16 位。
        </ListItem>
      </UnorderedList>
    </Callout>
    <Table
      head={['常量', '值', '含义']}
      rows={[
        ['DEFAULT_INITIAL_CAPACITY', '16 (1 << 4)', '默认初始容量'],
        ['MAXIMUM_CAPACITY', '1 << 30', '最大容量'],
        ['DEFAULT_LOAD_FACTOR', '0.75', '负载因子；元素数 > 容量 × 0.75 时扩容'],
        ['TREEIFY_THRESHOLD', '8', '同一桶链长 ≥ 8 时尝试转红黑树'],
        ['UNTREEIFY_THRESHOLD', '6', '红黑树节点 ≤ 6 时退化回链表'],
        ['MIN_TREEIFY_CAPACITY', '64', '转树要求的最小表容量；否则先扩容而非转树'],
      ]}
    />

    {/* ───────────────── 11 练习 ───────────────── */}
    <Heading3>11. 练习题</Heading3>
    <Paragraph>
      先自己想，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习1：为什么 HashMap 容量必须是 2 的幂？"
      code={`问题：
HashMap 的数组容量为什么必须是 2 的幂（16、32、64…）？
请从「索引计算」和「扩容」两个角度回答。`}
      answerCode={`答案：

【1】让 (n-1) & hash 等价于取模，且分布均匀
    当 n = 2^k 时，n-1 的二进制低 k 位全是 1（如 16-1 = 1111）。
    (n-1) & hash 正好“切出” hash 的低 k 位，结果落在 0 ~ n-1，且恒为非负。
    位运算只需约一条指令，远快于除法取模 %。
    若 n 不是 2 的幂，n-1 的二进制就会夹带 0，某些下标永远取不到，
    分布不均、碰撞增多。

【2】让扩容时的 rehash 极其廉价
    扩容时 newCap = oldCap << 1（翻倍，仍是 2 的幂），掩码只多了最高的一位。
    每个元素要么“留在原位 j”，要么“后移到 j + oldCap”，
    用 (hash & oldCap) == 0 一个判断即可决定，无需对每个元素重新取模。`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习2：手算下标"
      code={`问题：
已知某 key 的 hashCode() = 2147483647（即 0x7FFFFFFF），容量 n = 16。
求：① 不做扰动时的下标；② 做了扰动 hash = h ^ (h >>> 16) 后的下标。`}
      answerCode={`答案：

h          = 0x7FFFFFFF = 0111 1111 1111 1111  1111 1111 1111 1111
h >>> 16   = 0x00007FFF = 0000 0000 0000 0000  0111 1111 1111 1111
hash = h ^ (h >>> 16)
           = 0x7FFF8000 = 0111 1111 1111 1111  1000 0000 0000 0000

① 不扰动：h    & 15 = ...1111 = 15   → 桶 15
② 扰动后：hash & 15 = ...0000 = 0    → 桶 0

解析：原始低 16 位全是 1，与“移下来的高 16 位（也全是 1）”异或后，
      低位被翻成了 0（1 ^ 1 = 0），下标从 15 变成了 0。
      这再次说明：扰动让高位的信息真正影响了最终落桶。`}
    />
    <ChapterExercises categoryKey="collections" />
  </article>
);

export default index;
