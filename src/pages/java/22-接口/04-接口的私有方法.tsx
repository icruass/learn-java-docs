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
    <Title>接口的私有方法</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        JDK 8 引入了默认方法和静态方法后，接口中的代码逻辑越来越多。
        当多个默认方法或静态方法中存在相同的重复代码时，如何复用？
        JDK 9 为此引入了<Text bold>接口私有方法（private method）</Text>：
        专门用于在接口内部抽取重复逻辑，<Text bold>只供接口内部调用，对外完全不可见</Text>。
        本节掌握两种私有方法的格式及典型使用场景。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要私有方法</Heading3>
    <Paragraph>
      假设接口里有两个默认方法 <InlineCode>methodA()</InlineCode> 和 <InlineCode>methodB()</InlineCode>，
      它们都需要执行一段相同的日志记录逻辑。如果每个默认方法里都写一遍，代码就重复了。
    </Paragraph>
    <Paragraph>
      把这段重复逻辑提取成一个方法是自然的想法，但这个方法应该是：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>接口内部可用</Text>：default/static 方法可以调用它。
      </ListItem>
      <ListItem>
        <Text bold>外部不可见</Text>：不应该暴露给实现类或外部代码，它只是内部实现细节。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      JDK 9 引入的私有方法正好满足这两点：它只能在接口内部被调用，外部完全无法访问。
    </Paragraph>

    <Heading3>2. 两种私有方法的格式</Heading3>
    <Paragraph>
      接口私有方法分两种，分别供默认方法和静态方法调用：
    </Paragraph>
    <CodeBlock
      language="text"
      title="接口私有方法格式"
      code={`public interface 接口名 {

    // 普通私有方法：供 default 方法调用
    private 返回值类型 方法名(参数列表) {
        // 方法体
    }

    // 静态私有方法：供 static 方法调用
    private static 返回值类型 方法名(参数列表) {
        // 方法体
    }
}`}
    />
    <Table
      head={['类型', '修饰符', '供谁调用', 'JDK 版本']}
      rows={[
        ['普通私有方法', 'private', '接口内的 default 方法', 'JDK 9+'],
        ['静态私有方法', 'private static', '接口内的 static 方法', 'JDK 9+'],
      ]}
    />
    <Callout type="warning" title="私有方法只能在接口内部调用">
      接口私有方法对实现类完全不可见：
      实现类不能继承私有方法，不能重写私有方法，也不能通过任何方式调用它。
      它就像接口内部的「辅助工具」，只服务于接口自身的其他方法。
    </Callout>

    <Heading3>3. 调用关系规则</Heading3>
    <Table
      head={['接口内的方法', '可以调用普通私有方法', '可以调用静态私有方法']}
      rows={[
        ['default 方法', '可以', '可以（因为 static 方法也可以被 default 方法访问）'],
        ['static 方法', '不能（static 方法不能访问实例相关内容）', '可以'],
        ['private 方法', '可以', '不能'],
        ['private static 方法', '不能', '可以'],
      ]}
    />
    <Callout type="tip" title="记忆规律：static 只能调 static">
      与类中的静态方法规则一致：静态方法只能调用静态的内容。
      所以接口中的 static 方法和 private static 方法只能互相调用；
      普通的 default 方法和 private 方法才有「实例上下文」，可以互相调用。
    </Callout>

    <Heading3>4. 示例代码</Heading3>
    <Heading4>示例 1：两个默认方法共用私有方法抽取重复逻辑</Heading4>
    <Paragraph>
      <InlineCode>LiveAble</InlineCode> 接口有两个默认方法 <InlineCode>morningRoutine()</InlineCode>
      和 <InlineCode>eveningRoutine()</InlineCode>，都需要打印一行分隔线。
      把打印分隔线的逻辑抽取到私有方法 <InlineCode>printDivider()</InlineCode> 中复用。
    </Paragraph>
    <CodeBlock
      title="LiveAble.java"
      code={`public interface LiveAble {
    void eat();
    String getName();

    // 默认方法：早间例程
    default void morningRoutine() {
        printDivider();                              // 调用私有方法
        System.out.println(getName() + " 早晨起床");
        eat();
        System.out.println(getName() + " 早晨出发");
        printDivider();                              // 再次调用
    }

    // 默认方法：晚间例程
    default void eveningRoutine() {
        printDivider();
        System.out.println(getName() + " 晚上回家");
        eat();
        System.out.println(getName() + " 晚上睡觉");
        printDivider();
    }

    // 私有方法：只在接口内部使用，供 default 方法调用，对外不可见
    private void printDivider() {
        System.out.println("====================");
    }
}`}
    />
    <CodeBlock
      title="Cat.java"
      code={`public class Cat implements LiveAble {

    @Override
    public String getName() {
        return "小猫";
    }

    @Override
    public void eat() {
        System.out.println("小猫在吃鱼");
    }
    // 不重写默认方法，也无法访问 printDivider()
}`}
    />
    <CodeBlock
      title="PrivateMethodDemo.java"
      code={`public class PrivateMethodDemo {
    public static void main(String[] args) {
        LiveAble cat = new Cat();
        cat.morningRoutine();
        System.out.println();
        cat.eveningRoutine();

        // 下面这行无法通过编译，私有方法对实现类不可见：
        // cat.printDivider();   // 报错
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`====================
小猫 早晨起床
小猫在吃鱼
小猫 早晨出发
====================

====================
小猫 晚上回家
小猫在吃鱼
小猫 晚上睡觉
====================`} />
    <Paragraph>
      <InlineCode>printDivider()</InlineCode> 是私有方法，被两个默认方法复用，
      避免了重复代码。实现类 <InlineCode>Cat</InlineCode> 完全感知不到
      <InlineCode>printDivider()</InlineCode> 的存在——它是接口的内部实现细节。
    </Paragraph>

    <Heading4>示例 2：静态私有方法供静态方法复用</Heading4>
    <Paragraph>
      <InlineCode>USB</InlineCode> 接口有两个静态方法：<InlineCode>checkVersion()</InlineCode>
      和 <InlineCode>printInfo()</InlineCode>，两者都需要打印一段固定格式的前缀。
      把前缀逻辑抽取到静态私有方法中。
    </Paragraph>
    <CodeBlock
      title="USB.java"
      code={`public interface USB {
    void connect();

    // 静态方法：校验版本
    static void checkVersion(int version) {
        printHeader();                    // 调用静态私有方法
        if (version >= 1 && version <= 3) {
            System.out.println("USB " + version + ".0 版本合法");
        } else {
            System.out.println("版本号 " + version + " 不合法");
        }
    }

    // 静态方法：打印 USB 规格信息
    static void printInfo() {
        printHeader();                    // 同样调用静态私有方法
        System.out.println("USB 支持热插拔，最大传输速率 10Gbps (USB3.1)");
    }

    // 静态私有方法：只能被接口内的 static 方法调用
    private static void printHeader() {
        System.out.println("[USB 接口规范工具]");
    }
}`}
    />
    <CodeBlock
      title="StaticPrivateDemo.java"
      code={`public class StaticPrivateDemo {
    public static void main(String[] args) {
        USB.checkVersion(2);
        System.out.println("---");
        USB.printInfo();

        // 下面这行无法编译，私有方法对外不可见：
        // USB.printHeader();  // 报错
    }
}`}
    />
    <CodeBlock language="text" title="控制台输出" code={`[USB 接口规范工具]
USB 2.0 版本合法
---
[USB 接口规范工具]
USB 支持热插拔，最大传输速率 10Gbps (USB3.1)`} />
    <Paragraph>
      <InlineCode>printHeader()</InlineCode> 是静态私有方法，被两个静态方法复用，
      避免了重复打印前缀的代码。外部无论通过接口名还是其他方式都无法调用它。
    </Paragraph>

    <Callout type="success" title="本节要点回顾">
      <UnorderedList>
        <ListItem>JDK 9 新增，用于抽取接口内部重复逻辑，对外完全不可见。</ListItem>
        <ListItem>普通私有方法 <InlineCode>private 返回值 方法名(){}</InlineCode>：供 <InlineCode>default</InlineCode> 方法调用。</ListItem>
        <ListItem>静态私有方法 <InlineCode>private static 返回值 方法名(){}</InlineCode>：供 <InlineCode>static</InlineCode> 方法调用。</ListItem>
        <ListItem>实现类无法继承、重写或调用私有方法，它是接口的内部细节。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>5. 练习题</Heading3>
    <Paragraph>
      先自己完成，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      title="练习1：用私有方法抽取重复代码"
      code={`// 接口 Logger 有两个默认方法：
// - infoLog(String msg)：打印 "[INFO] msg"
// - errorLog(String msg)：打印 "[ERROR] msg"
// 两个方法都需要在打印前先打印当前时间戳（模拟，直接打印固定字符串 "2026-06-11"）。
// 要求：把打印时间戳的逻辑抽取为私有方法 printTimestamp()，在两个默认方法中调用。
// 实现类 AppLogger，不重写任何方法。
// main 中通过 AppLogger 对象分别调用两个方法。

public interface Logger {
    // 补全两个默认方法和一个私有方法
}

public class AppLogger implements Logger {
    // 不需要写任何内容
}

public class Exercise01 {
    public static void main(String[] args) {
        Logger logger = new AppLogger();
        logger.infoLog("系统启动成功");
        logger.errorLog("连接数据库失败");
    }
}`}
      answerCode={`public interface Logger {

    default void infoLog(String msg) {
        printTimestamp();
        System.out.println("[INFO] " + msg);
    }

    default void errorLog(String msg) {
        printTimestamp();
        System.out.println("[ERROR] " + msg);
    }

    private void printTimestamp() {
        System.out.println("2026-06-11");
    }
}

public class AppLogger implements Logger {
    // 自动继承两个默认方法，无需写任何内容
}

public class Exercise01 {
    public static void main(String[] args) {
        Logger logger = new AppLogger();
        logger.infoLog("系统启动成功");
        logger.errorLog("连接数据库失败");
    }
}

/* 控制台输出：
2026-06-11
[INFO] 系统启动成功
2026-06-11
[ERROR] 连接数据库失败

解析：printTimestamp() 是私有方法，被两个 default 方法复用，
      AppLogger 完全感知不到 printTimestamp() 的存在，体现了接口内部封装。
*/`}
    />

    <CodeBlock
      qa
      title="练习2：选择正确的私有方法类型"
      code={`// 接口 Calculator 有以下需求：
// 1. 静态方法 add(int a, int b) 和 multiply(int a, int b) 在计算前都需要
//    校验两个参数都大于 0，校验失败打印"参数必须大于0"并返回 -1。
//    把校验逻辑抽取为私有方法。
// 2. 默认方法 describe(String op, int a, int b) 调用 getName()（抽象方法）
//    打印 "xxx 执行了 op 运算"，其中 xxx 来自 getName()。
//    两个 default 方法（假设还有另一个 describeResult）都需要先打印名字标头，
//    把标头打印逻辑抽取为私有方法。
// 只需定义接口结构（不需要写实现类），写出正确的私有方法类型（private 还是 private static）。

public interface Calculator {
    String getName();   // 抽象方法

    // 补全：两个静态方法 add / multiply，共用一个私有校验方法
    // 补全：一个默认方法 describe(String op, int a, int b)，共用一个私有打印标头方法
}`}
      answerCode={`public interface Calculator {
    String getName();

    // 静态方法：共用 checkArgs 静态私有方法
    static int add(int a, int b) {
        if (!checkArgs(a, b)) return -1;
        return a + b;
    }

    static int multiply(int a, int b) {
        if (!checkArgs(a, b)) return -1;
        return a * b;
    }

    // 静态私有方法：供 static 方法调用，校验参数
    private static boolean checkArgs(int a, int b) {
        if (a <= 0 || b <= 0) {
            System.out.println("参数必须大于0");
            return false;
        }
        return true;
    }

    // 默认方法：共用 printHeader 普通私有方法
    default void describe(String op, int a, int b) {
        printHeader();
        System.out.println(getName() + " 执行了 " + op + " 运算：" + a + " 和 " + b);
    }

    // 普通私有方法：供 default 方法调用，打印标头
    private void printHeader() {
        System.out.println("--- 计算器日志 ---");
    }
}

/* 解析：
   - checkArgs 是 private static：因为 add/multiply 是 static 方法，
     static 方法只能调用 static 内容，所以辅助方法必须是 private static。
   - printHeader 是 private（非 static）：因为 describe 是 default 方法，
     default 方法有实例上下文，可以调用普通 private 方法。
   判断规则：调用者是 static 方法 → 私有方法用 private static；
             调用者是 default 方法 → 私有方法用 private。
*/`}
    />
  </article>
);

export default index;
