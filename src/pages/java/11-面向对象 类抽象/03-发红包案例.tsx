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
    <Title>发红包案例</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        本节用一个贴近生活的综合案例——<Text bold>微信群发红包</Text>——把继承、抽象类、
        <InlineCode>ArrayList</InlineCode>、随机数等知识点串联起来。
        群主把一笔钱拆成若干份放进红包集合，群成员随机抢一份，
        双方余额实时更新并打印。
        重点掌握：OOP 类的职责拆分、金额拆分算法（分为整数运算避免精度问题）、
        以及 <InlineCode>Random</InlineCode> + <InlineCode>ArrayList</InlineCode> 的配合使用。
      </Paragraph>
    </Callout>

    <Heading3>1. 需求分析与类设计</Heading3>
    <Paragraph>
      用 OOP 思想分析发红包场景，提炼出以下三个类：
    </Paragraph>
    <Table
      head={['类名', '角色', '属性', '方法']}
      rows={[
        ['User（抽象类）', '所有用户的公共父类', 'username（用户名）、balance（余额，单位：分）', 'show()：展示余额'],
        ['Manager extends User', '群主，负责发红包', '继承父类', 'sendRedPacket(int totalMoney, int count)：拆分红包，返回 ArrayList'],
        ['Member extends User', '群成员，负责抢红包', '继承父类', 'receiveRedPacket(ArrayList list)：从集合随机取一份，更新余额'],
      ]}
    />
    <Callout type="tip" title="金额用「分」而非「元」储存">
      用整数（分）代替浮点数（元）可以完全避免浮点精度问题。
      例如 100 元存为 10000 分，拆成 3 份每份约 3333 分，余数 1 分归最后一份，
      结果精确可控。展示给用户时再除以 100 转换为元。
    </Callout>

    <Heading3>2. 金额拆分算法</Heading3>
    <Paragraph>
      群主发 <InlineCode>totalMoney</InlineCode> 分（整数）拆成 <InlineCode>count</InlineCode> 份：
    </Paragraph>
    <OrderedList>
      <ListItem>
        前 <InlineCode>count - 1</InlineCode> 份每份金额 = <InlineCode>totalMoney / count</InlineCode>（整除）。
      </ListItem>
      <ListItem>
        最后一份 = <InlineCode>totalMoney - (count - 1) * (totalMoney / count)</InlineCode>，
        即总额减去前几份，余数自动归入最后一份，保证所有份额之和恰好等于总金额。
      </ListItem>
      <ListItem>
        群主余额减少 <InlineCode>totalMoney</InlineCode>。
      </ListItem>
    </OrderedList>
    <CodeBlock
      language="text"
      title="拆分示例：10000 分拆 3 份"
      code={`每份基础金额 = 10000 / 3 = 3333 分
前 2 份：3333 分、3333 分
最后 1 份：10000 - 2 * 3333 = 3334 分
合计：3333 + 3333 + 3334 = 10000 分  ✅ 精确`}
    />

    <Heading3>3. 抢红包算法</Heading3>
    <Paragraph>
      群成员抢红包时：
    </Paragraph>
    <OrderedList>
      <ListItem>
        用 <InlineCode>Random</InlineCode> 生成 <InlineCode>0</InlineCode> 到
        <InlineCode>list.size() - 1</InlineCode> 之间的随机索引。
      </ListItem>
      <ListItem>
        用 <InlineCode>list.remove(index)</InlineCode> 从集合中取出该份金额
        （remove 返回被移除的元素，同时集合大小减 1，防止同一份被抢两次）。
      </ListItem>
      <ListItem>
        成员余额增加取出的金额。
      </ListItem>
    </OrderedList>
    <Callout type="warning" title="用 remove 而非 get">
      抢到红包后必须用 <InlineCode>list.remove(index)</InlineCode> 将该份从集合中移除，
      否则同一份红包会被多人反复抢到。<InlineCode>remove</InlineCode> 的返回值就是被移除的元素，
      可直接用于更新余额，一行搞定。
    </Callout>

    <Heading3>4. 完整示例代码</Heading3>
    <Heading4>User 抽象父类</Heading4>
    <CodeBlock
      title="User.java"
      code={`public abstract class User {
    private String username;  // 用户名
    private int balance;      // 余额，单位：分

    public User(String username, int balance) {
        this.username = username;
        this.balance  = balance;
    }

    // 展示余额（单位转换为元，保留两位小数）
    public void show() {
        System.out.printf("%s 当前余额：%.2f 元%n", username, balance / 100.0);
    }

    // 提供给子类访问的 getter / setter
    public String getUsername() { return username; }
    public int    getBalance()  { return balance;  }
    public void   setBalance(int balance) { this.balance = balance; }
}`}
    />
    <Heading4>Manager 群主类</Heading4>
    <CodeBlock
      title="Manager.java"
      code={`import java.util.ArrayList;

public class Manager extends User {

    public Manager(String username, int balance) {
        super(username, balance);
    }

    /**
     * 发红包：把 totalMoney 分拆成 count 份，存入集合并返回。
     * 同时从群主余额中扣除 totalMoney 分。
     *
     * @param totalMoney 发出的总金额（单位：分）
     * @param count      拆成几份
     * @return 装有每份金额的集合
     */
    public ArrayList<Integer> sendRedPacket(int totalMoney, int count) {
        // 判断余额是否充足
        if (totalMoney > getBalance()) {
            System.out.println(getUsername() + " 余额不足，无法发红包！");
            return null;
        }

        ArrayList<Integer> list = new ArrayList<>();
        int each = totalMoney / count;  // 前 (count-1) 份每份金额

        for (int i = 0; i < count - 1; i++) {
            list.add(each);
        }
        // 最后一份 = 总额 - 已放入的金额，余数全归最后一份
        list.add(totalMoney - each * (count - 1));

        // 群主余额减少
        setBalance(getBalance() - totalMoney);

        System.out.printf("%s 发出红包 %.2f 元，共 %d 份%n",
                getUsername(), totalMoney / 100.0, count);
        return list;
    }
}`}
    />
    <Heading4>Member 群成员类</Heading4>
    <CodeBlock
      title="Member.java"
      code={`import java.util.ArrayList;
import java.util.Random;

public class Member extends User {

    public Member(String username, int balance) {
        super(username, balance);
    }

    /**
     * 抢红包：从集合中随机取出一份，余额增加对应金额。
     *
     * @param list 红包集合（会修改集合，移除已抢的那份）
     */
    public void receiveRedPacket(ArrayList<Integer> list) {
        if (list == null || list.isEmpty()) {
            System.out.println(getUsername() + " 没有抢到红包（红包已被抢完）");
            return;
        }

        // 随机索引
        int index   = new Random().nextInt(list.size());
        int money   = list.remove(index);   // 取出并从集合移除
        setBalance(getBalance() + money);

        System.out.printf("%s 抢到红包 %.2f 元%n", getUsername(), money / 100.0);
    }
}`}
    />
    <Heading4>测试主类</Heading4>
    <CodeBlock
      title="RedPacketDemo.java"
      code={`import java.util.ArrayList;

public class RedPacketDemo {
    public static void main(String[] args) {
        // 创建群主：张三，初始余额 50000 分（500 元）
        Manager manager = new Manager("张三", 50000);

        // 创建三个群成员，初始余额均为 0
        Member m1 = new Member("李四", 0);
        Member m2 = new Member("王五", 0);
        Member m3 = new Member("赵六", 0);

        System.out.println("===== 发红包前 =====");
        manager.show();
        m1.show();
        m2.show();
        m3.show();

        System.out.println();
        System.out.println("===== 张三发红包 =====");
        // 发出 100 元（10000 分），拆成 3 份
        ArrayList<Integer> redPackets = manager.sendRedPacket(10000, 3);

        System.out.println();
        System.out.println("===== 群成员抢红包 =====");
        m1.receiveRedPacket(redPackets);
        m2.receiveRedPacket(redPackets);
        m3.receiveRedPacket(redPackets);

        System.out.println();
        System.out.println("===== 发红包后 =====");
        manager.show();
        m1.show();
        m2.show();
        m3.show();
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出（随机结果，每次运行抢到金额可能不同）" code={`===== 发红包前 =====
张三 当前余额：500.00 元
李四 当前余额：0.00 元
王五 当前余额：0.00 元
赵六 当前余额：0.00 元

===== 张三发红包 =====
张三 发出红包 100.00 元，共 3 份

===== 群成员抢红包 =====
李四 抢到红包 33.33 元
王五 抢到红包 33.34 元
赵六 抢到红包 33.33 元

===== 发红包后 =====
张三 当前余额：400.00 元
李四 当前余额：33.33 元
王五 当前余额：33.34 元
赵六 当前余额：33.33 元`} />
    <Paragraph>
      三个成员抢到的金额之和为 33.33 + 33.34 + 33.33 = 100.00 元，
      与群主发出的总金额完全吻合，没有精度丢失。
      由于使用了 <InlineCode>Random</InlineCode>，每次运行时三人抢到金额的分配顺序会随机变化，
      但总和始终是 100 元。
    </Paragraph>

    <Heading3>5. 代码执行流程详解</Heading3>
    <Paragraph>
      理解整个流程有助于加深对 OOP 设计的认识：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>发红包（sendRedPacket）：</Text>
        Manager 调用 <InlineCode>sendRedPacket(10000, 3)</InlineCode>，
        先检查余额（50000 &gt;= 10000，充足），
        然后循环 2 次往 <InlineCode>list</InlineCode> 加入 3333，
        最后加入 10000 - 3333×2 = 3334，
        list = [3333, 3333, 3334]（顺序可能随 Random 变化）；
        群主余额 50000 - 10000 = 40000 分。
      </ListItem>
      <ListItem>
        <Text bold>抢红包（receiveRedPacket）：</Text>
        李四随机取到索引 0（假设），<InlineCode>list.remove(0)</InlineCode> 返回 3333，
        list 变为 [3333, 3334]，李四余额 += 3333；
        王五随机取到索引 1，<InlineCode>list.remove(1)</InlineCode> 返回 3334，
        list 变为 [3333]，王五余额 += 3334；
        赵六只剩一个，索引必为 0，取到 3333，list 变为空。
      </ListItem>
      <ListItem>
        <Text bold>展示余额（show）：</Text>
        调用父类 <InlineCode>show()</InlineCode>，将整数分转换为元打印，确保格式统一。
      </ListItem>
    </OrderedList>
    <Callout type="tip" title="为什么 User 要声明为抽象类">
      <InlineCode>User</InlineCode> 本身没有抽象方法，声明为 <InlineCode>abstract</InlineCode>
      的目的是<Text bold>禁止直接创建 User 对象</Text>——系统中不存在"只是用户"这种角色，
      每个用户必须是群主或群成员之一。这正是注意事项④的实际应用。
    </Callout>

    <Heading3>6. 扩展思考：增加余额不足的提示</Heading3>
    <Paragraph>
      当群主余额不足时，<InlineCode>sendRedPacket</InlineCode> 返回 <InlineCode>null</InlineCode>，
      调用方需要判断 null。更健壮的做法是配合成员的 <InlineCode>receiveRedPacket</InlineCode>
      对 null 判断，已在上方代码中通过
      <InlineCode>if (list == null || list.isEmpty())</InlineCode> 处理，
      避免空指针异常（NullPointerException）。
    </Paragraph>
    <CodeBlock
      title="余额不足演示片段"
      code={`Manager poorManager = new Manager("穷哥们", 500);   // 只有 5 元（500 分）
// 尝试发 100 元红包，余额不足
ArrayList<Integer> packets = poorManager.sendRedPacket(10000, 3);
// 输出：穷哥们 余额不足，无法发红包！
// packets 为 null，成员抢到的是 null，receiveRedPacket 中已做 null 判断`}
    />
    <CodeBlock language="text" title="控制台输出" code={`穷哥们 余额不足，无法发红包！`} />

    <Callout type="success" title="案例小结">
      <UnorderedList>
        <ListItem>OOP 职责拆分：User 存公共属性和展示逻辑，Manager 负责发红包，Member 负责抢红包，职责清晰。</ListItem>
        <ListItem>金额用分（整数）存储，规避浮点精度问题；展示时除以 100 转换为元。</ListItem>
        <ListItem>拆分算法：前 n-1 份整除，最后一份取余数，保证总额精确匹配。</ListItem>
        <ListItem>抢红包用 <InlineCode>list.remove(index)</InlineCode>，取出同时移除，防止重复抢。</ListItem>
        <ListItem>User 声明为 abstract 是"禁止直接 new 基类"（注意事项④）的典型应用。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习 1：在 Member 中增加「抢不到红包则打印提示」的功能验证"
      code={`// 背景：现有 Manager 和 Member 类（与正文相同）
// 要求：
// 1. 群主张三发出 100 元（10000 分）红包，只拆 2 份
// 2. 一共有 3 个成员抢，第 3 个成员应该抢不到
// 3. 验证第 3 个成员调用 receiveRedPacket 时，能正确打印"没有抢到红包（红包已被抢完）"
// 4. 打印所有人的最终余额

public class Exercise01 {
    public static void main(String[] args) {
        // 补全：群主发 10000 分，拆 2 份
        // 补全：3 个成员依次抢
        // 补全：打印所有人最终余额
    }
}`}
      answerCode={`import java.util.ArrayList;

public class Exercise01 {
    public static void main(String[] args) {
        Manager manager = new Manager("张三", 50000);
        Member m1 = new Member("李四", 0);
        Member m2 = new Member("王五", 0);
        Member m3 = new Member("赵六", 0);

        // 发 10000 分红包，只拆 2 份
        ArrayList<Integer> list = manager.sendRedPacket(10000, 2);

        m1.receiveRedPacket(list);   // 抢到一份
        m2.receiveRedPacket(list);   // 抢到最后一份
        m3.receiveRedPacket(list);   // 集合已空，打印提示

        System.out.println("===== 最终余额 =====");
        manager.show();
        m1.show();
        m2.show();
        m3.show();
    }
}

/* 控制台输出（金额随机分配，但总额为 100 元）：
张三 发出红包 100.00 元，共 2 份
李四 抢到红包 50.00 元
王五 抢到红包 50.00 元
赵六 没有抢到红包（红包已被抢完）
===== 最终余额 =====
张三 当前余额：400.00 元
李四 当前余额：50.00 元
王五 当前余额：50.00 元
赵六 当前余额：0.00 元

解析：10000 分拆 2 份，每份 5000 分（50 元）；
      集合只有 2 个元素，前两个成员各取一个，集合变空；
      第三个成员调用时 list.isEmpty() 为 true，打印提示并 return。
*/`}
    />

    <CodeBlock
      qa
      title="练习 2：修改拆分方式，实现「随机金额红包」"
      code={`// 背景：正文中是均等拆分（每份相差不超过 1 分）
// 要求：在 Manager 中新增方法 sendRandomRedPacket(int totalMoney, int count)，
//       实现随机金额拆分：
//       每次从剩余金额中随机取 1 分 ~ 剩余金额-(未分配份数) 分，
//       保证每份至少 1 分，最后一份取全部剩余金额。
//       main 中：群主发 100 元（10000 分）拆 3 份，
//       3 个成员各抢一份，打印各人余额。
//（提示：循环 count-1 次，每次 Random 取 1 ~ remaining-(count-i) 之间的值）

public class Exercise02 {
    // 补全 sendRandomRedPacket 方法（可在 Manager 里或作为 static 工具方法）
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`import java.util.ArrayList;
import java.util.Random;

// 在 Manager 中新增方法（简化起见此处以 static 演示算法核心）
public class Exercise02 {

    // 随机金额拆分
    public static ArrayList<Integer> splitRandom(int totalMoney, int count) {
        ArrayList<Integer> list    = new ArrayList<>();
        Random             random  = new Random();
        int                remaining = totalMoney;

        for (int i = 0; i < count - 1; i++) {
            // 剩余份数 = count - i
            // 每份最少 1 分，最多 remaining - (count - 1 - i) 分（给后面的份数留余地）
            int max  = remaining - (count - 1 - i);
            int each = random.nextInt(max) + 1;  // [1, max]
            list.add(each);
            remaining -= each;
        }
        list.add(remaining);   // 最后一份取全部剩余
        return list;
    }

    public static void main(String[] args) {
        Manager manager = new Manager("张三", 50000);
        Member m1 = new Member("李四", 0);
        Member m2 = new Member("王五", 0);
        Member m3 = new Member("赵六", 0);

        System.out.println("发出随机红包 100 元，共 3 份：");
        ArrayList<Integer> list = splitRandom(10000, 3);
        System.out.println("红包列表（分）：" + list);

        manager.setBalance(manager.getBalance() - 10000);

        m1.receiveRedPacket(list);
        m2.receiveRedPacket(list);
        m3.receiveRedPacket(list);

        System.out.println("===== 最终余额 =====");
        manager.show();
        m1.show();
        m2.show();
        m3.show();
    }
}

/* 控制台输出示例（随机，每次不同，但三人总额始终为 100 元）：
发出随机红包 100 元，共 3 份：
红包列表（分）：[3241, 1876, 4883]
李四 抢到红包 18.76 元
王五 抢到红包 48.83 元
赵六 抢到红包 32.41 元
===== 最终余额 =====
张三 当前余额：400.00 元
李四 当前余额：18.76 元
王五 当前余额：48.83 元
赵六 当前余额：32.41 元

解析：关键公式 —— max = remaining - (count-1-i)，
      保证每份至少 1 分，后续每份也至少有 1 分可分。
      最后一份直接取剩余，确保总和精确等于 totalMoney。
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：群主给指定成员单独转账"
      code={`// 要求：在 Manager 中新增方法 transfer(Member target, int amount)：
//       若群主余额 >= amount，则余额减少 amount，目标成员余额增加 amount，
//       打印"[群主] 向 [成员] 转账 [金额] 元"；
//       否则打印"余额不足，转账失败"。
// main 中：群主（余额 500 元）向李四转账 200 元，再向王五转账 400 元（余额不足），
//          打印三人最终余额。

public class Exercise03 {
    public static void main(String[] args) {
        // 补全
    }
}`}
      answerCode={`// 在 Manager.java 中新增 transfer 方法：
public void transfer(Member target, int amount) {
    if (amount > getBalance()) {
        System.out.println("余额不足，转账失败");
        return;
    }
    setBalance(getBalance() - amount);
    target.setBalance(target.getBalance() + amount);
    System.out.printf("%s 向 %s 转账 %.2f 元%n",
            getUsername(), target.getUsername(), amount / 100.0);
}

// 测试主类：
public class Exercise03 {
    public static void main(String[] args) {
        Manager manager = new Manager("张三", 50000);   // 500 元
        Member  m1      = new Member("李四", 0);
        Member  m2      = new Member("王五", 0);

        manager.transfer(m1, 20000);   // 转 200 元，余额 300 元
        manager.transfer(m2, 40000);   // 转 400 元，余额不足（只剩 300 元）

        System.out.println("===== 最终余额 =====");
        manager.show();
        m1.show();
        m2.show();
    }
}

/* 控制台输出：
张三 向 李四 转账 200.00 元
余额不足，转账失败
===== 最终余额 =====
张三 当前余额：300.00 元
李四 当前余额：200.00 元
王五 当前余额：0.00 元

解析：第一次转账 200 元成功（50000-20000=30000 分，即 300 元）；
      第二次转 400 元需要 40000 分，但余额只有 30000 分，不足，直接 return，
      双方余额均不变，王五仍为 0 元。
*/`}
    />
  </article>
);

export default index;
