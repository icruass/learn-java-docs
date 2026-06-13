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
    <Title>throw 与 throws</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节学习了如何用 <InlineCode>try-catch</InlineCode> 捕获异常，
        本节学习另外两个关键字：<InlineCode>throw</InlineCode> 和 <InlineCode>throws</InlineCode>。
        它们发音相近、拼写相似，但功能完全不同。
        <InlineCode>throw</InlineCode> 用于<Text bold>主动抛出</Text>一个异常对象；
        <InlineCode>throws</InlineCode> 用于在方法签名上<Text bold>声明</Text>该方法可能抛出哪些受检异常。
        本节还将介绍异常的传递链路和异常链（cause）机制。
      </Paragraph>
    </Callout>

    <Heading3>1. throw —— 手动抛出异常</Heading3>
    <Paragraph>
      <InlineCode>throw</InlineCode> 关键字用于在代码中<Text bold>主动创建并抛出</Text>一个异常对象。
      典型使用场景：参数校验失败、业务规则不满足、检测到非法状态时。
    </Paragraph>

    <Heading4>1.1 基本语法</Heading4>
    <CodeBlock
      language="text"
      title="throw 语法格式"
      code={`throw new 异常类名("异常描述信息");

// 也可以先创建对象再抛出
异常类名 e = new 异常类名("信息");
throw e;`}
    />
    <Paragraph>
      <InlineCode>throw</InlineCode> 后面必须跟一个<Text bold>异常对象</Text>
      （<InlineCode>Throwable</InlineCode> 及其子类的实例）。
      <InlineCode>throw</InlineCode> 语句执行后，当前方法<Text bold>立即停止执行</Text>，
      <InlineCode>throw</InlineCode> 之后的代码不会被执行（unreachable code）。
    </Paragraph>

    <Heading4>1.2 参数校验示例</Heading4>
    <CodeBlock
      title="Person.java"
      code={`public class Person {
    private String name;
    private int age;

    public void setAge(int age) {
        // 参数校验：年龄不合法时主动抛出异常
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("年龄不合法，应在 0 到 150 之间，当前值：" + age);
        }
        this.age = age;
        System.out.println("年龄设置成功：" + age);
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("姓名不能为空");
        }
        this.name = name;
    }

    public static void main(String[] args) {
        Person p = new Person();

        try {
            p.setAge(25);   // 正常
            p.setAge(-5);   // 触发 throw
        } catch (IllegalArgumentException e) {
            System.out.println("捕获到异常：" + e.getMessage());
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`年龄设置成功：25
捕获到异常：年龄不合法，应在 0 到 150 之间，当前值：-5`}
    />

    <Heading4>1.3 throw 之后的代码不会执行</Heading4>
    <CodeBlock
      title="UnreachableCode.java"
      code={`public class UnreachableCode {
    public static void checkPositive(int n) {
        if (n <= 0) {
            throw new IllegalArgumentException("必须是正数");
            // System.out.println("这行是 unreachable code");  // 编译器警告/报错
        }
        System.out.println("合法的正数：" + n);
    }

    public static void main(String[] args) {
        checkPositive(5);   // 正常执行
        checkPositive(-1);  // throw 后方法立即结束
        System.out.println("这行不会执行"); // 上一行抛出异常，这里不执行
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`合法的正数：5
Exception in thread "main" java.lang.IllegalArgumentException: 必须是正数
	at UnreachableCode.checkPositive(UnreachableCode.java:3)
	at UnreachableCode.main(UnreachableCode.java:11)`}
    />

    <Heading3>2. throws —— 声明方法可能抛出的异常</Heading3>
    <Paragraph>
      <InlineCode>throws</InlineCode> 写在方法签名的参数列表之后，用于声明该方法可能抛出哪些<Text bold>受检异常</Text>。
      它的含义是：<Text accent>「我这个方法自己不处理这个异常，交给调用者来处理」</Text>。
      调用者看到 <InlineCode>throws</InlineCode> 声明后，必须选择：用 <InlineCode>try-catch</InlineCode> 处理，
      或者继续用 <InlineCode>throws</InlineCode> 向上传递。
    </Paragraph>

    <Heading4>2.1 基本语法</Heading4>
    <CodeBlock
      language="text"
      title="throws 语法格式"
      code={`// 声明单个受检异常
public void method() throws IOException {
    // ...
}

// 声明多个受检异常，逗号分隔
public void method() throws IOException, SQLException {
    // ...
}`}
    />

    <Heading4>2.2 完整示例：文件读取</Heading4>
    <CodeBlock
      title="FileProcessor.java"
      code={`import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class FileProcessor {

    // 声明可能抛出 IOException，不在此方法内处理
    public static String readFirstLine(String path) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(path));
        String line = reader.readLine();
        reader.close();
        return line;
    }

    public static void main(String[] args) {
        // 调用方必须处理 IOException（try-catch 或继续 throws）
        try {
            String line = readFirstLine("hello.txt");
            System.out.println("第一行内容：" + line);
        } catch (IOException e) {
            System.out.println("文件读取失败：" + e.getMessage());
        }
    }
}`}
    />
    <Callout type="tip" title="throws 声明的异常可以多于实际抛出的">
      <InlineCode>throws</InlineCode> 是一种对外的"声明"，
      它说的是"这个方法<Text bold>可能</Text>抛出这些异常"，
      即使实际上某次运行没有抛出，也没有问题。
      反过来，如果方法体内实际 throw 了受检异常，但方法签名没有 throws 声明，编译会报错。
    </Callout>

    <Heading4>2.3 throws 的传递效果</Heading4>
    <CodeBlock
      title="ThrowsChain.java"
      code={`import java.io.IOException;

public class ThrowsChain {

    // 底层方法：声明 throws IOException
    public static void readData() throws IOException {
        throw new IOException("磁盘读取失败");
    }

    // 中间方法：不处理，继续 throws
    public static void processData() throws IOException {
        readData();
    }

    // 顶层方法：最终处理异常
    public static void main(String[] args) {
        try {
            processData();
        } catch (IOException e) {
            System.out.println("最终处理异常：" + e.getMessage());
        }
    }
}`}
    />

    <Heading3>3. throw vs throws 对比</Heading3>
    <Table
      head={['对比维度', 'throw', 'throws']}
      rows={[
        ['位置', '写在方法体内部（某行代码中）', '写在方法签名上，参数列表之后'],
        ['数量', '每次只能抛出一个异常对象', '可以声明多个异常类型，逗号分隔'],
        ['用途', '主动创建并抛出一个异常', '声明方法可能向外传播哪些受检异常'],
        ['针对对象', '针对具体的异常实例', '针对异常类型（类名）'],
        ['是否强制', '执行到时必然抛出', '声明的异常不一定真的被抛出'],
        ['语法', 'throw new XxxException("msg")', 'public void m() throws XxxException'],
      ]}
    />
    <CodeBlock
      title="ThrowVsThrows.java（综合对比）"
      code={`import java.io.IOException;

public class ThrowVsThrows {

    // throws：声明可能抛出 IOException（受检异常）
    public static void methodA() throws IOException {
        // throw：实际抛出一个 IOException 实例
        throw new IOException("IO 错误发生了");
    }

    // throws：声明可能抛出多种受检异常
    public static void methodB() throws IOException, InterruptedException {
        // 方法体中可能 throw 这些类型的异常
        throw new IOException("连接超时");
    }

    // 非受检异常不需要 throws 声明（也可以加，但不强制）
    public static void methodC() {
        throw new IllegalArgumentException("非法参数");
    }
}`}
    />

    <Heading3>4. 异常的处理方式选择</Heading3>
    <Paragraph>
      当一个方法中出现异常时，有两种处理方式可以选择：
    </Paragraph>
    <Table
      head={['处理方式', '适用场景', '语法']}
      rows={[
        ['捕获（try-catch）', '调用者有能力恢复程序，知道该怎么处理这个异常', 'try { ... } catch (XxxException e) { ... }'],
        ['抛出（throws）', '调用者更适合处理，或当前方法不知道如何处理', 'public void method() throws XxxException'],
      ]}
    />
    <Paragraph>
      核心原则：<Text bold>谁有能力处理，谁来处理</Text>。
      底层工具方法（如文件读取、数据库操作）通常使用 <InlineCode>throws</InlineCode> 声明异常，
      让业务层或 UI 层来决定如何处理（是重试、是提示用户还是记录日志）。
    </Paragraph>
    <Callout type="tip" title="main 方法也可以 throws">
      <InlineCode>public static void main(String[] args) throws Exception</InlineCode> 是合法的写法，
      通常在测试代码或工具类的 main 方法中使用，省去 try-catch 的麻烦。
      但生产代码的 main 方法应当处理所有异常，避免向 JVM 传播。
    </Callout>

    <Heading3>5. 异常传递链路演示</Heading3>
    <Paragraph>
      当异常从深层方法向上传播时，JVM 会记录完整的调用栈。
      下面演示方法 A 调用 B，B 调用 C，C 抛出异常，A 最终捕获的完整过程：
    </Paragraph>
    <CodeBlock
      title="ExceptionPropagation.java"
      code={`public class ExceptionPropagation {

    // 最底层：C 抛出异常
    public static void methodC() {
        System.out.println("methodC 执行");
        throw new RuntimeException("C 中发生了错误");
    }

    // 中间层：B 调用 C，不捕获，异常向上传播
    public static void methodB() {
        System.out.println("methodB 执行");
        methodC();
        System.out.println("methodB 结束（不会执行）");
    }

    // 顶层：A 调用 B，捕获异常
    public static void methodA() {
        System.out.println("methodA 执行");
        try {
            methodB();
        } catch (RuntimeException e) {
            System.out.println("methodA 捕获到异常：" + e.getMessage());
            System.out.println("--- 完整调用栈 ---");
            e.printStackTrace();
        }
        System.out.println("methodA 继续执行");
    }

    public static void main(String[] args) {
        methodA();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`methodA 执行
methodB 执行
methodC 执行
methodA 捕获到异常：C 中发生了错误
--- 完整调用栈 ---
java.lang.RuntimeException: C 中发生了错误
	at ExceptionPropagation.methodC(ExceptionPropagation.java:6)
	at ExceptionPropagation.methodB(ExceptionPropagation.java:12)
	at ExceptionPropagation.methodA(ExceptionPropagation.java:20)
	at ExceptionPropagation.main(ExceptionPropagation.java:30)
methodA 继续执行`}
    />
    <Paragraph>
      读 stack trace 的技巧：<Text bold>从上往下</Text>第一个 <InlineCode>at</InlineCode> 行是异常真正发生的位置（methodC 的第 6 行），
      往下依次是调用链：methodB → methodA → main。
      找到项目自己的代码（非 JDK 内部类），从最上面的那行开始排查。
    </Paragraph>

    <Heading3>6. 异常链（Exception Chaining）</Heading3>
    <Paragraph>
      在分层架构中，底层异常（如 <InlineCode>SQLException</InlineCode>）
      通常不应该直接暴露给上层调用者，而是应该被<Text bold>包装</Text>成更有业务含义的高层异常抛出。
      这就是<Text bold>异常链</Text>（Exception Chaining）：捕获低级异常，以其为 cause 创建新的高级异常抛出。
    </Paragraph>

    <Heading4>6.1 构造器传入 cause</Heading4>
    <Paragraph>
      <InlineCode>Throwable</InlineCode> 的多个构造器接收一个 <InlineCode>cause</InlineCode> 参数：
    </Paragraph>
    <CodeBlock
      language="text"
      title="Throwable 的常用构造器"
      code={`// 只有描述信息
new XxxException("描述")

// 有描述 + 原始 cause（异常链）
new XxxException("描述", cause)

// 只有 cause
new XxxException(cause)`}
    />

    <Heading4>6.2 完整异常链示例</Heading4>
    <CodeBlock
      title="ExceptionChaining.java"
      code={`// 自定义业务层异常
class ServiceException extends RuntimeException {
    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

// 自定义数据访问层异常
class DataAccessException extends RuntimeException {
    public DataAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}

public class ExceptionChaining {

    // 数据库访问层：捕获底层 SQLException，包装为 DataAccessException
    public static void queryDatabase(int userId) {
        try {
            // 模拟底层 SQL 异常（实际代码中是真实的 SQL 操作）
            if (userId <= 0) {
                throw new java.sql.SQLException("无效的用户 ID: " + userId);
            }
            System.out.println("查询用户 " + userId + " 成功");
        } catch (java.sql.SQLException e) {
            // 包装为数据访问层异常，保留原始 cause
            throw new DataAccessException("查询用户数据失败", e);
        }
    }

    // 业务层：捕获 DataAccessException，包装为 ServiceException
    public static void getUserInfo(int userId) {
        try {
            queryDatabase(userId);
        } catch (DataAccessException e) {
            throw new ServiceException("获取用户信息失败", e);
        }
    }

    public static void main(String[] args) {
        try {
            getUserInfo(-1);
        } catch (ServiceException e) {
            System.out.println("业务异常：" + e.getMessage());

            // 获取直接 cause
            Throwable directCause = e.getCause();
            System.out.println("直接原因：" + directCause.getMessage());

            // 获取根本原因（继续 getCause）
            Throwable rootCause = directCause.getCause();
            System.out.println("根本原因：" + rootCause.getMessage());

            // 打印完整的异常链 stack trace
            System.out.println();
            System.out.println("--- 完整异常链 ---");
            e.printStackTrace();
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`业务异常：获取用户信息失败
直接原因：查询用户数据失败
根本原因：无效的用户 ID: -1

--- 完整异常链 ---
ServiceException: 获取用户信息失败
	at ExceptionChaining.getUserInfo(ExceptionChaining.java:36)
	at ExceptionChaining.main(ExceptionChaining.java:41)
Caused by: DataAccessException: 查询用户数据失败
	at ExceptionChaining.queryDatabase(ExceptionChaining.java:25)
	at ExceptionChaining.getUserInfo(ExceptionChaining.java:33)
	... 1 more
Caused by: java.sql.SQLException: 无效的用户 ID: -1
	at ExceptionChaining.queryDatabase(ExceptionChaining.java:21)
	... 2 more`}
    />
    <Paragraph>
      注意 stack trace 中的 <InlineCode>Caused by:</InlineCode> 部分——这就是异常链的体现。
      通过 <InlineCode>getCause()</InlineCode> 逐层查找，能看到完整的"事故原因链"，
      方便快速定位根本问题。
    </Paragraph>
    <Callout type="tip" title="异常链的价值">
      <UnorderedList>
        <ListItem><Text bold>对调用者友好</Text>：高层看到语义清晰的业务异常（ServiceException），不暴露底层细节。</ListItem>
        <ListItem><Text bold>对开发者友好</Text>：printStackTrace() 显示完整异常链，根本原因一目了然。</ListItem>
        <ListItem><Text bold>不要直接 e.printStackTrace() 就完事</Text>：应当包装成有意义的异常向上传递，或记录日志后以合适的方式响应。</ListItem>
      </UnorderedList>
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>throw</InlineCode> 写在方法体内，用于主动抛出一个异常对象；throw 之后的代码不会执行。</ListItem>
        <ListItem><InlineCode>throws</InlineCode> 写在方法签名上，用于声明方法可能抛出哪些受检异常，让调用者必须处理。</ListItem>
        <ListItem>异常可以向上传播：深层方法 throw → 中间方法 throws → 顶层方法 catch，整个传播路径记录在 stack trace 中。</ListItem>
        <ListItem>异常链（cause）让底层异常被包装成高层业务异常抛出，既对调用者友好，又保留了根本原因信息。</ListItem>
        <ListItem>核心原则：<Text bold>谁有能力处理，谁来处理</Text>。底层方法 throws，业务层或顶层 catch。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：throw 与 throws 区分"
      code={`问：下列说法中，哪些正确，哪些错误？请说明理由。

① throw 可以一次抛出多个异常对象，如 throw new IOException(), new SQLException()。
② throws 声明的受检异常，方法体内一定会被抛出。
③ 非受检异常（RuntimeException 及其子类）可以用 throws 声明，也可以不声明。
④ 方法内调用了一个声明 throws IOException 的方法，当前方法必须 try-catch 或继续 throws。
⑤ throw new RuntimeException("msg") 之后的代码可以正常执行。`}
      answerCode={`答案：

① 错误。throw 每次只能抛出一个异常对象，语法上只能写一个对象。
   如果需要抛出多个，需要多个 throw 语句（通常放在不同的 if-else 分支中）。

② 错误。throws 是一种"声明"，表示可能会抛出，但不保证一定抛出。
   例如方法声明 throws IOException，但某些执行路径完全正常，没有 IOException 发生。

③ 正确。非受检异常（RuntimeException 及其子类）可以选择性地用 throws 声明，
   编译器不强制要求。加上 throws 是对调用者的提示，说明可能发生的异常类型。

④ 正确。受检异常具有"传染性"——调用了一个 throws IOException 的方法后，
   当前方法必须：① try-catch 处理，或 ② 在方法签名加 throws IOException 继续向上传递。
   否则编译报错。

⑤ 错误。throw 语句执行后，方法立即停止，throw 之后的代码是 unreachable code，
   不会执行。编译器甚至可能警告或报错（具体取决于编译器和 IDE）。`}
    />

    <CodeBlock
      qa
      title="练习 2：添加参数校验"
      code={`// 为以下 BankAccount 类的 deposit 和 withdraw 方法添加参数校验，
// 使用 throw 抛出 IllegalArgumentException。
// 要求：
// - deposit(amount)：amount <= 0 时抛出异常，消息："存款金额必须为正数"
// - withdraw(amount)：amount <= 0 时抛出异常，消息："取款金额必须为正数"
//                    amount > balance 时抛出异常，消息："余额不足，当前余额：xxx"

public class BankAccount {
    private double balance;

    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        // 添加参数校验
        balance += amount;
        System.out.println("存款成功，当前余额：" + balance);
    }

    public void withdraw(double amount) {
        // 添加参数校验
        balance -= amount;
        System.out.println("取款成功，当前余额：" + balance);
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount(1000);
        try {
            account.deposit(500);
            account.withdraw(200);
            account.deposit(-100);   // 应抛出异常
        } catch (IllegalArgumentException e) {
            System.out.println("操作失败：" + e.getMessage());
        }
    }
}`}
      answerCode={`public class BankAccount {
    private double balance;

    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("存款金额必须为正数");
        }
        balance += amount;
        System.out.println("存款成功，当前余额：" + balance);
    }

    public void withdraw(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("取款金额必须为正数");
        }
        if (amount > balance) {
            throw new IllegalArgumentException("余额不足，当前余额：" + balance);
        }
        balance -= amount;
        System.out.println("取款成功，当前余额：" + balance);
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount(1000);

        try {
            account.deposit(500);      // 成功，余额 1500
            account.withdraw(200);     // 成功，余额 1300
            account.deposit(-100);     // 抛出异常
        } catch (IllegalArgumentException e) {
            System.out.println("操作失败：" + e.getMessage());
        }

        // 继续测试
        try {
            account.withdraw(9999);    // 余额不足，抛出异常
        } catch (IllegalArgumentException e) {
            System.out.println("操作失败：" + e.getMessage());
        }
    }
}

/* 控制台输出：
存款成功，当前余额：1500.0
取款成功，当前余额：1300.0
操作失败：存款金额必须为正数
操作失败：余额不足，当前余额：1300.0
*/`}
    />

    <CodeBlock
      qa
      title="练习 3：异常链构建"
      code={`// 完成以下代码，演示异常链：
// UserService.getUserById() 调用 UserDao.findById()
// UserDao.findById() 在 id <= 0 时抛出 IllegalArgumentException
// UserService 捕获后，包装成 ServiceException（RuntimeException 子类）重新抛出
// main 方法捕获 ServiceException，打印消息和 cause 消息

class ServiceException extends RuntimeException {
    // 补全构造器（需要 message + cause）
}

class UserDao {
    public static String findById(int id) {
        // 补全：id <= 0 时 throw IllegalArgumentException("ID 不合法: " + id)
        return "用户_" + id;
    }
}

class UserService {
    public static String getUserById(int id) {
        // 补全：调用 UserDao.findById，捕获异常后包装为 ServiceException 抛出
    }
}

public class ExceptionChainQuiz {
    public static void main(String[] args) {
        try {
            System.out.println(UserService.getUserById(5));   // 正常
            System.out.println(UserService.getUserById(-1));  // 触发异常链
        } catch (ServiceException e) {
            System.out.println("Service 层异常：" + e.getMessage());
            System.out.println("根本原因：" + e.getCause().getMessage());
        }
    }
}`}
      answerCode={`class ServiceException extends RuntimeException {
    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

class UserDao {
    public static String findById(int id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID 不合法: " + id);
        }
        return "用户_" + id;
    }
}

class UserService {
    public static String getUserById(int id) {
        try {
            return UserDao.findById(id);
        } catch (IllegalArgumentException e) {
            // 包装为业务层异常，保留原始 cause
            throw new ServiceException("获取用户失败", e);
        }
    }
}

public class ExceptionChainQuiz {
    public static void main(String[] args) {
        try {
            System.out.println(UserService.getUserById(5));   // 正常
            System.out.println(UserService.getUserById(-1));  // 触发异常链
        } catch (ServiceException e) {
            System.out.println("Service 层异常：" + e.getMessage());
            System.out.println("根本原因：" + e.getCause().getMessage());
        }
    }
}

/* 控制台输出：
用户_5
Service 层异常：获取用户失败
根本原因：ID 不合法: -1

解析：
- UserService 捕获了 IllegalArgumentException（来自 UserDao）
- 将其作为 cause 包装进新的 ServiceException 抛出
- main 方法捕获 ServiceException 时，可以通过 getCause() 拿到原始的 IllegalArgumentException
- 这就是异常链，既对外暴露语义清晰的业务异常，又保留了根本原因信息
*/`}
    />
  </article>
);

export default index;
