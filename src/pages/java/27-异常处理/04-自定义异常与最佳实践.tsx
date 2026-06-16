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
    <Title>自定义异常与最佳实践</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前几节学习了如何捕获、抛出和传递异常。本节进一步介绍如何创建<Text bold>自定义异常类</Text>，
        让异常信息更贴近业务语义；然后通过<Text bold>完整的银行转账案例</Text>展示自定义异常的实际用法；
        最后总结异常处理的<Text bold>最佳实践</Text>，帮助你写出"优雅失败"的生产级代码。
      </Paragraph>
    </Callout>

    <Heading3>1. 为什么需要自定义异常</Heading3>
    <Paragraph>
      Java 内置了很多异常类，但它们都是技术性的描述（如 <InlineCode>IllegalArgumentException</InlineCode>、
      <InlineCode>IllegalStateException</InlineCode>），很难体现具体的<Text bold>业务含义</Text>。
      自定义异常的核心价值在于：
    </Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>业务语义清晰。</Text>
        <InlineCode>InsufficientBalanceException</InlineCode>（余额不足）比
        <InlineCode>RuntimeException("余额不足")</InlineCode> 更具表达力，
        调用者一眼就知道是什么业务场景。
      </ListItem>
      <ListItem>
        <Text bold>便于精准捕获。</Text>
        可以只 catch 特定的业务异常，而不是用宽泛的 <InlineCode>Exception</InlineCode> 一网打尽，
        避免意外掩盖其他异常。
      </ListItem>
      <ListItem>
        <Text bold>区分业务错误和系统错误。</Text>
        业务异常（用户余额不足）和系统异常（数据库连接失败）的处理策略截然不同，
        用不同的异常类可以在 catch 块中分别处理。
      </ListItem>
      <ListItem>
        <Text bold>可以携带更多业务信息。</Text>
        自定义异常可以添加额外字段，如错误码（errorCode）、订单号等，方便日志和监控系统处理。
      </ListItem>
    </OrderedList>

    <Heading3>2. 自定义受检异常（继承 Exception）</Heading3>
    <Paragraph>
      自定义受检异常继承 <InlineCode>Exception</InlineCode>，编译器强制调用者处理。
      适合用于<Text bold>可恢复的业务错误</Text>，调用者需要明确针对这类情况做处理。
    </Paragraph>

    <Heading4>2.1 命名规范与标准结构</Heading4>
    <Paragraph>
      自定义异常类名通常以 <InlineCode>Exception</InlineCode> 结尾，如
      <InlineCode>AgeOutOfRangeException</InlineCode>、<InlineCode>UserNotFoundException</InlineCode>。
      推荐提供以下几个构造器：
    </Paragraph>
    <CodeBlock
      title="AgeOutOfRangeException.java"
      code={`/**
 * 年龄超出合法范围时抛出的受检异常。
 * 继承 Exception，调用者必须显式处理。
 */
public class AgeOutOfRangeException extends Exception {

    // 1. 无参构造器（使用默认消息）
    public AgeOutOfRangeException() {
        super("年龄超出合法范围（0 ~ 150）");
    }

    // 2. 带消息的构造器
    public AgeOutOfRangeException(String message) {
        super(message);
    }

    // 3. 带消息和原始 cause 的构造器（支持异常链）
    public AgeOutOfRangeException(String message, Throwable cause) {
        super(message, cause);
    }
}`}
    />
    <CodeBlock
      title="PersonWithChecked.java（使用受检异常）"
      code={`public class PersonWithChecked {
    private String name;
    private int age;

    // 声明 throws，调用者必须处理
    public void setAge(int age) throws AgeOutOfRangeException {
        if (age < 0 || age > 150) {
            throw new AgeOutOfRangeException(
                "年龄不合法：" + age + "，应在 0 到 150 之间"
            );
        }
        this.age = age;
    }

    public static void main(String[] args) {
        PersonWithChecked p = new PersonWithChecked();

        // 调用者必须 try-catch 或 throws，否则编译报错
        try {
            p.setAge(25);
            System.out.println("年龄设置成功：25");
            p.setAge(-1);
        } catch (AgeOutOfRangeException e) {
            System.out.println("捕获业务异常：" + e.getMessage());
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`年龄设置成功：25
捕获业务异常：年龄不合法：-1，应在 0 到 150 之间`}
    />

    <Heading3>3. 自定义非受检异常（继承 RuntimeException）</Heading3>
    <Paragraph>
      自定义非受检异常继承 <InlineCode>RuntimeException</InlineCode>，编译器不强制处理。
      适合用于<Text bold>编程错误</Text>或<Text bold>调用方应当避免的情况</Text>
      （如传入了非法参数、违反了业务前置条件），以及调用者不需要每次都显式处理的异常。
    </Paragraph>
    <Paragraph>
      现代 Java 项目（尤其是 Spring Boot）大量使用非受检异常，因为受检异常会导致方法签名膨胀，
      并在多层架构中引发"throws 传染病"。
    </Paragraph>
    <CodeBlock
      title="InsufficientBalanceException.java"
      code={`/**
 * 账户余额不足时抛出的非受检异常。
 * 继承 RuntimeException，调用者可以选择处理，也可以不处理。
 */
public class InsufficientBalanceException extends RuntimeException {

    private final double currentBalance;
    private final double requiredAmount;

    public InsufficientBalanceException(double currentBalance, double requiredAmount) {
        super(String.format(
            "余额不足：当前余额 %.2f，需要 %.2f，缺少 %.2f",
            currentBalance, requiredAmount, requiredAmount - currentBalance
        ));
        this.currentBalance = currentBalance;
        this.requiredAmount = requiredAmount;
    }

    // 提供 getter，让捕获者获取结构化的业务数据
    public double getCurrentBalance() { return currentBalance; }
    public double getRequiredAmount() { return requiredAmount; }
    public double getShortfall() { return requiredAmount - currentBalance; }
}`}
    />

    <Heading3>4. 完整业务案例：银行转账</Heading3>
    <Paragraph>
      下面用银行转账场景展示自定义异常的完整用法：
    </Paragraph>
    <CodeBlock
      title="BankTransfer.java（完整案例）"
      code={`/**
 * 完整银行转账案例，演示自定义异常的实际使用。
 */

// 自定义：账户不存在异常（受检 → 调用者必须处理）
class AccountNotFoundException extends Exception {
    public AccountNotFoundException(String accountId) {
        super("账户不存在：" + accountId);
    }
}

// 自定义：余额不足异常（非受检 → 可选处理）
class InsufficientBalanceException extends RuntimeException {
    private final double balance;
    private final double amount;

    public InsufficientBalanceException(double balance, double amount) {
        super(String.format("余额不足：当前 %.2f，需要 %.2f", balance, amount));
        this.balance = balance;
        this.amount = amount;
    }

    public double getBalance() { return balance; }
    public double getAmount() { return amount; }
}

// 银行账户类
class BankAccount {
    private final String id;
    private double balance;

    public BankAccount(String id, double balance) {
        this.id = id;
        this.balance = balance;
    }

    public String getId() { return id; }
    public double getBalance() { return balance; }

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("存款金额必须为正数");
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("取款金额必须为正数");
        if (amount > balance) throw new InsufficientBalanceException(balance, amount);
        balance -= amount;
    }
}

// 银行服务类
class BankService {
    private java.util.Map<String, BankAccount> accounts = new java.util.HashMap<>();

    public void addAccount(BankAccount account) {
        accounts.put(account.getId(), account);
    }

    // throws AccountNotFoundException：调用者必须处理账户不存在的情况
    public void transfer(String fromId, String toId, double amount)
            throws AccountNotFoundException {

        // 查找账户（受检异常：账户不存在是需要明确处理的场景）
        BankAccount from = accounts.get(fromId);
        if (from == null) throw new AccountNotFoundException(fromId);

        BankAccount to = accounts.get(toId);
        if (to == null) throw new AccountNotFoundException(toId);

        // 余额检查（非受检异常：调用方应避免传入超额金额）
        from.withdraw(amount);  // 可能抛出 InsufficientBalanceException
        to.deposit(amount);

        System.out.printf("转账成功：%s → %s，金额 %.2f%n", fromId, toId, amount);
    }
}

public class BankTransfer {
    public static void main(String[] args) {
        BankService service = new BankService();
        service.addAccount(new BankAccount("ACC001", 1000.0));
        service.addAccount(new BankAccount("ACC002", 500.0));

        System.out.println("=== 正常转账 ===");
        try {
            service.transfer("ACC001", "ACC002", 300.0);
        } catch (AccountNotFoundException e) {
            System.out.println("账户异常：" + e.getMessage());
        }

        System.out.println();
        System.out.println("=== 余额不足 ===");
        try {
            service.transfer("ACC002", "ACC001", 10000.0);
        } catch (AccountNotFoundException e) {
            System.out.println("账户异常：" + e.getMessage());
        } catch (InsufficientBalanceException e) {
            System.out.printf("转账失败：%s（缺口：%.2f）%n",
                e.getMessage(),
                e.getAmount() - e.getBalance());
        }

        System.out.println();
        System.out.println("=== 账户不存在 ===");
        try {
            service.transfer("ACC001", "ACC999", 100.0);
        } catch (AccountNotFoundException e) {
            System.out.println("转账失败：" + e.getMessage());
        }
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`=== 正常转账 ===
转账成功：ACC001 → ACC002，金额 300.00

=== 余额不足 ===
转账失败：余额不足：当前 800.00，需要 10000.00（缺口：9200.00）

=== 账户不存在 ===
转账失败：账户不存在：ACC999`}
    />

    <Heading3>5. 异常处理最佳实践</Heading3>

    <Heading4>5.1 最佳实践 vs 常见错误对比</Heading4>
    <Table
      head={['分类', '最佳实践', '常见错误', '问题说明']}
      rows={[
        ['精准捕获', '捕获具体异常：catch(FileNotFoundException e)', 'catch(Exception e) 一刀切', '宽泛捕获会掩盖不同类型的异常，难以针对性处理'],
        ['异常信息', '提供有意义的消息：new XxxException("用户ID不合法: " + id)', 'new Exception("error")', '模糊的信息让开发者无法快速定位问题'],
        ['流程控制', '用 if/else 判断正常逻辑，异常只用于异常情况', '用 try-catch 代替 if，用异常控制正常流程', '异常处理有额外性能开销，且代码可读性差'],
        ['异常选择', '可恢复业务错误用受检异常；编程错误/不可恢复用非受检', '所有地方都用 RuntimeException 或都用 Exception', '语义不清，调用者无法区分是否需要处理'],
        ['日志记录', '至少打印异常信息：logger.error("msg", e)', '空 catch 块：catch(Exception e) {}', '异常被静默吞掉，程序看似正常但问题已发生'],
        ['资源管理', '使用 try-with-resources 管理 IO/JDBC 资源', '在 finally 手动关闭，忘写 null 检查', '可能泄露资源或双重关闭'],
        ['异常转换', '捕获低级异常后包装成业务异常（保留 cause）', '直接打印 e.printStackTrace() 完事', '调用者看不到业务语义，也没有日志框架记录'],
      ]}
    />

    <Heading4>5.2 空 catch 块 —— 最危险的反模式</Heading4>
    <CodeBlock
      title="EmptyCatch.java（反面教材）"
      code={`// 千万不要这样写！
public class EmptyCatch {
    public static String getConfig(String key) {
        try {
            return loadFromFile(key);
        } catch (Exception e) {
            // 什么都不做！！！
            // 异常被静默吞掉，方法返回 null
            // 调用者得到 null，可能在别处触发 NPE，但原始原因已经消失
        }
        return null;
    }

    // 正确做法（至少记日志）：
    public static String getConfigFixed(String key) {
        try {
            return loadFromFile(key);
        } catch (Exception e) {
            // 方案1：记录日志（推荐）
            System.err.println("[ERROR] 读取配置失败，key=" + key + "，原因：" + e.getMessage());
            // 方案2：如果有默认值，返回默认值
            return "default_value";
        }
    }

    private static String loadFromFile(String key) throws Exception {
        throw new Exception("文件不存在");
    }
}`}
    />

    <Heading4>5.3 不要在 finally 中抛出新异常</Heading4>
    <CodeBlock
      title="FinallyThrow.java（反面教材）"
      code={`public class FinallyThrow {

    // 错误：finally 中抛出新异常，会掩盖原始异常
    public static void badMethod() {
        try {
            throw new RuntimeException("原始异常");  // 真正的问题
        } finally {
            throw new RuntimeException("finally 中的异常");  // 覆盖了原始异常！
        }
        // 调用者只能看到 "finally 中的异常"，原始问题被掩盖
    }

    // 正确：finally 只做清理，不抛出新异常
    public static void goodMethod() {
        try {
            throw new RuntimeException("原始异常");
        } finally {
            try {
                // 清理操作可能失败时，用内层 try-catch 处理，不向外抛
                System.out.println("清理资源...");
            } catch (Exception cleanupEx) {
                System.err.println("清理失败（忽略）：" + cleanupEx.getMessage());
            }
        }
    }
}`}
    />

    <Heading4>5.4 不要在循环中 try-catch</Heading4>
    <CodeBlock
      title="TryCatchInLoop.java"
      code={`import java.util.Arrays;
import java.util.List;

public class TryCatchInLoop {

    // 低效写法：try-catch 放在循环内部（每次循环都有额外开销）
    public static int sumBad(List<String> numbers) {
        int sum = 0;
        for (String s : numbers) {
            try {
                sum += Integer.parseInt(s);
            } catch (NumberFormatException e) {
                // 每次迭代都可能进入 catch，性能差，逻辑也不清晰
                System.out.println("跳过非数字：" + s);
            }
        }
        return sum;
    }

    // 推荐写法1：try-catch 放在循环外（如果任一元素非法就整体失败）
    public static int sumGood1(List<String> numbers) {
        int sum = 0;
        try {
            for (String s : numbers) {
                sum += Integer.parseInt(s);
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("列表包含非数字元素：" + e.getMessage(), e);
        }
        return sum;
    }

    // 推荐写法2：使用 Stream + filter 过滤非法值（函数式风格）
    public static int sumGood2(List<String> numbers) {
        return numbers.stream()
            .filter(s -> s.matches("-?\\d+"))  // 只保留合法整数字符串
            .mapToInt(Integer::parseInt)
            .sum();
    }

    public static void main(String[] args) {
        List<String> data = Arrays.asList("1", "2", "abc", "4", "5");
        System.out.println("sumBad:   " + sumBad(data));    // 跳过 abc，sum=12
        System.out.println("sumGood2: " + sumGood2(data));  // 同上，sum=12
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`跳过非数字：abc
sumBad:   12
sumGood2: 12`}
    />

    <Heading4>5.5 使用异常表达"不可能"状态</Heading4>
    <CodeBlock
      title="ImpossibleState.java"
      code={`public class ImpossibleState {
    enum Direction { NORTH, SOUTH, EAST, WEST }

    public static String describe(Direction dir) {
        switch (dir) {
            case NORTH: return "向北";
            case SOUTH: return "向南";
            case EAST:  return "向东";
            case WEST:  return "向西";
            default:
                // 理论上永远不会到这里，但用异常防止枚举新增值时忘记更新
                throw new IllegalStateException("未知方向：" + dir);
        }
    }
}`}
    />

    <Heading3>6. 自定义异常设计检查清单</Heading3>
    <Paragraph>
      设计自定义异常时，可以用以下清单自我检查：
    </Paragraph>
    <Table
      head={['检查项', '推荐做法']}
      rows={[
        ['命名', '以 Exception 结尾，前缀体现业务含义（如 UserNotFoundException）'],
        ['继承关系', '可恢复业务错误继承 Exception；编程错误或不强制处理继承 RuntimeException'],
        ['构造器', '提供至少：(String message) 和 (String message, Throwable cause) 两个构造器'],
        ['额外字段', '需要携带结构化信息时添加私有字段（如 errorCode、userId）并提供 getter'],
        ['文档', '用 Javadoc 说明异常的触发条件和含义'],
        ['层级', '同一模块的异常可以建立层级（如 AppException → ServiceException → OrderException）'],
      ]}
    />

    <Heading3>7. 完整的异常处理全景图</Heading3>
    <CodeBlock
      language="text"
      title="异常处理决策树"
      code={`遇到异常情况时，如何处理？

1. 这是我的方法内部能完全恢复的情况吗？
   → 是：try-catch 处理，恢复后继续执行
   → 否：继续往下看

2. 调用者比我更清楚该怎么处理吗？
   → 是：throws 声明，让调用者处理
   → 否：继续往下看

3. 这是可预期的业务错误（如用户输入非法、资源不存在）？
   → 是：抛出受检异常（继承 Exception），强制调用者处理
   → 否：继续往下看

4. 这是编程错误或调用者应当避免的情况？
   → 是：抛出非受检异常（继承 RuntimeException），让调用者选择处理

5. 无论如何，都要确保：
   □ 异常信息有意义（包含上下文信息）
   □ 不要空 catch 块，至少记日志
   □ 需要释放资源时用 try-with-resources 或 finally
   □ 保留异常链（new XxxException("msg", cause)）`}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>自定义异常让业务语义更清晰，便于精准捕获，可携带额外业务信息。</ListItem>
        <ListItem>自定义受检异常继承 <InlineCode>Exception</InlineCode>（强制处理），自定义非受检异常继承 <InlineCode>RuntimeException</InlineCode>（可选处理）。</ListItem>
        <ListItem>标准构造器：无参、<InlineCode>(String message)</InlineCode>、<InlineCode>(String message, Throwable cause)</InlineCode>。</ListItem>
        <ListItem><Text bold>最佳实践</Text>：精准捕获、有意义的消息、不用异常控制流程、记录日志、try-with-resources 管理资源。</ListItem>
        <ListItem><Text bold>常见错误</Text>：空 catch 块、finally 中抛异常或写 return、循环内 try-catch、用异常控制正常流程。</ListItem>
        <ListItem>好的异常处理让程序"优雅失败"：用户得到有意义的反馈，开发者得到清晰的调试信息。</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>8. 练习题</Heading3>
    <Paragraph>
      先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。
    </Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：设计自定义异常层级"
      code={`问：为一个电商系统设计异常类层级，要求：

1. 所有业务异常的根类：AppException（非受检，继承 RuntimeException）
2. 订单相关异常：OrderException（继承 AppException）
   - 订单不存在：OrderNotFoundException
   - 订单状态不合法（如重复支付）：InvalidOrderStatusException
3. 商品相关异常：ProductException（继承 AppException）
   - 商品库存不足：OutOfStockException，需要携带商品 ID 和当前库存量

请写出这些异常类的完整定义（构造器 + 字段）。`}
      answerCode={`// 1. 业务异常根类
public class AppException extends RuntimeException {
    public AppException(String message) {
        super(message);
    }
    public AppException(String message, Throwable cause) {
        super(message, cause);
    }
}

// 2. 订单相关异常
public class OrderException extends AppException {
    public OrderException(String message) { super(message); }
    public OrderException(String message, Throwable cause) { super(message, cause); }
}

public class OrderNotFoundException extends OrderException {
    private final String orderId;
    public OrderNotFoundException(String orderId) {
        super("订单不存在：" + orderId);
        this.orderId = orderId;
    }
    public String getOrderId() { return orderId; }
}

public class InvalidOrderStatusException extends OrderException {
    public InvalidOrderStatusException(String orderId, String currentStatus, String requiredStatus) {
        super(String.format("订单 %s 状态不合法：当前为 %s，需要 %s", orderId, currentStatus, requiredStatus));
    }
}

// 3. 商品相关异常
public class ProductException extends AppException {
    public ProductException(String message) { super(message); }
    public ProductException(String message, Throwable cause) { super(message, cause); }
}

public class OutOfStockException extends ProductException {
    private final String productId;
    private final int currentStock;
    private final int requiredQuantity;

    public OutOfStockException(String productId, int currentStock, int requiredQuantity) {
        super(String.format("商品 %s 库存不足：当前 %d，需要 %d", productId, currentStock, requiredQuantity));
        this.productId = productId;
        this.currentStock = currentStock;
        this.requiredQuantity = requiredQuantity;
    }

    public String getProductId() { return productId; }
    public int getCurrentStock() { return currentStock; }
    public int getRequiredQuantity() { return requiredQuantity; }
}

// 使用示例：
// try {
//     orderService.payOrder("ORDER-001");
// } catch (OrderNotFoundException e) {
//     // 订单不存在的处理
// } catch (InvalidOrderStatusException e) {
//     // 订单状态不对的处理
// } catch (AppException e) {
//     // 其他业务异常的兜底处理
// }`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习 2：异常处理代码审查"
      code={`问：审查以下代码，找出所有的异常处理问题（至少找到 4 个），并说明改进方案。

public class BadExceptionCode {

    public static String getUserName(int userId) {
        try {
            return fetchFromDatabase(userId);
        } catch (Exception e) {        // 问题？
            // 什么都不做
        }
        return null;
    }

    public static int parseAndDivide(String a, String b) {
        int result = 0;
        try {
            result = Integer.parseInt(a) / Integer.parseInt(b);
        } catch (NumberFormatException e) {
            return 0;
        } catch (Exception e) {        // 问题？
            return 0;
        } catch (ArithmeticException e) { // 问题？
            return 0;
        } finally {
            return result;             // 问题？
        }
    }

    private static String fetchFromDatabase(int userId) throws Exception {
        if (userId <= 0) throw new Exception("invalid");
        return "User_" + userId;
    }
}`}
      answerCode={`找到的问题：

问题1：空 catch 块（getUserName 中的 catch）
  catch(Exception e) {} 悄悄吞掉了异常，方法返回 null，
  调用者不知道出了问题，还可能因为拿到 null 而在其他地方触发 NPE。
  改进：至少打印日志，或者重新抛出语义更清晰的异常。

问题2：catch 顺序错误（parseAndDivide 中 Exception 在 ArithmeticException 前）
  catch(Exception e) 捕获了所有异常，后面的 catch(ArithmeticException e) 永远无法执行。
  编译器会报：Exception has already been caught。
  改进：将具体异常（ArithmeticException）放在前面，Exception 作为兜底放最后。

问题3：catch 过于宽泛
  catch(Exception e) 无法区分 NumberFormatException 和 ArithmeticException，
  对两种不同错误给出相同的处理（return 0），不合适。
  改进：分开处理，或使用 JDK 7 的 catch(NumberFormatException | ArithmeticException e)。

问题4：finally 中有 return
  finally 中的 return result 会覆盖 try/catch 中的任何 return，
  而且如果 try 中抛出了未被捕获的异常，finally 的 return 会把异常吞掉！
  改进：去掉 finally 中的 return，只保留 try/catch 中的 return。

修复后的代码：

public class FixedExceptionCode {

    public static String getUserName(int userId) {
        try {
            return fetchFromDatabase(userId);
        } catch (Exception e) {
            System.err.println("查询用户失败，userId=" + userId + "，原因：" + e.getMessage());
            throw new RuntimeException("查询用户失败", e); // 或返回 Optional.empty()
        }
    }

    public static int parseAndDivide(String a, String b) {
        try {
            return Integer.parseInt(a) / Integer.parseInt(b);
        } catch (NumberFormatException e) {
            System.err.println("参数不是有效整数：" + e.getMessage());
            return 0;
        } catch (ArithmeticException e) {    // 具体异常在前
            System.err.println("除数为零");
            return 0;
        }
        // 去掉了 finally 中的 return
    }
}`}
    />

    <CodeBlock
      qa
      title="练习 3：完整自定义异常应用"
      code={`// 实现一个简单的学生成绩管理系统，要求：
// 1. 定义自定义非受检异常 ScoreOutOfRangeException（成绩超出范围 0~100）
//    额外携带字段：studentName 和 score
// 2. 定义 Student 类，setScore 方法在成绩不合法时 throw 该异常
// 3. main 方法演示正常设置和异常场景，catch 时打印结构化信息

public class StudentScoreDemo {
    // 补全代码...

    public static void main(String[] args) {
        // 正常场景：设置成绩 85
        // 异常场景：设置成绩 110（超出范围）
        // 捕获异常并打印：学生名、非法成绩值
    }
}`}
      answerCode={`// 自定义异常
class ScoreOutOfRangeException extends RuntimeException {
    private final String studentName;
    private final int score;

    public ScoreOutOfRangeException(String studentName, int score) {
        super(String.format("学生 %s 的成绩 %d 超出合法范围（0~100）", studentName, score));
        this.studentName = studentName;
        this.score = score;
    }

    public String getStudentName() { return studentName; }
    public int getScore() { return score; }
}

// 学生类
class Student {
    private String name;
    private int score;

    public Student(String name) {
        this.name = name;
    }

    public void setScore(int score) {
        if (score < 0 || score > 100) {
            throw new ScoreOutOfRangeException(name, score);
        }
        this.score = score;
        System.out.println(name + " 的成绩设置为：" + score);
    }

    public int getScore() { return score; }
    public String getName() { return name; }
}

public class StudentScoreDemo {
    public static void main(String[] args) {
        Student alice = new Student("Alice");
        Student bob = new Student("Bob");

        // 正常场景
        try {
            alice.setScore(85);
            bob.setScore(92);
        } catch (ScoreOutOfRangeException e) {
            System.out.println("设置失败：" + e.getMessage());
        }

        System.out.println();

        // 异常场景
        try {
            alice.setScore(110);
        } catch (ScoreOutOfRangeException e) {
            System.out.println("=== 成绩异常 ===");
            System.out.println("学生姓名：" + e.getStudentName());
            System.out.println("非法成绩：" + e.getScore());
            System.out.println("异常消息：" + e.getMessage());
        }

        // 负数也不合法
        try {
            bob.setScore(-5);
        } catch (ScoreOutOfRangeException e) {
            System.out.println("=== 成绩异常 ===");
            System.out.println("学生：" + e.getStudentName() + "，成绩：" + e.getScore());
        }
    }
}

/* 控制台输出：
Alice 的成绩设置为：85
Bob 的成绩设置为：92

=== 成绩异常 ===
学生姓名：Alice
非法成绩：110
异常消息：学生 Alice 的成绩 110 超出合法范围（0~100）
=== 成绩异常 ===
学生：Bob，成绩：-5
*/`}
    />
    <ChapterExercises categoryKey="exceptions" />
  </article>
);

export default index;
