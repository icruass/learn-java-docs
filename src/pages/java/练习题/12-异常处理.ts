import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "exceptions",
  name: "异常处理",
  problems: [
    {
      title: "try-catch-finally 的执行顺序（含 return）",
      difficulty: "中等",
      question:
        "阅读下面的代码，写出方法 test() 的返回值，并解释 finally 块中的 return 对结果的影响，以及 try-catch-finally 的整体执行顺序。",
      code: `public static int test() {
    try {
        System.out.println("try");
        return 1;
    } catch (Exception e) {
        System.out.println("catch");
        return 2;
    } finally {
        System.out.println("finally");
        return 3;
    }
}`,
      hint: "finally 块总是会执行；如果 finally 里有 return，它会「覆盖」try/catch 里的 return。",
      answer:
        "控制台先打印：\ntry\nfinally\n方法最终返回 3。\n\n执行顺序解析：\n1. 进入 try，打印 \"try\"，执行到 return 1 时，会先把返回值 1 准备好，但在真正返回之前必须先执行 finally。\n2. 没有异常，所以不进入 catch。\n3. 执行 finally，打印 \"finally\"；由于 finally 里有 return 3，它会直接结束方法并返回 3，从而「覆盖」了 try 中原本要返回的 1。\n规律：finally 块一定会执行（除非 JVM 退出等极端情况）；当 finally 中存在 return 时，它的返回值会覆盖 try/catch 的返回值。\n实践建议：不要在 finally 中写 return，这会让返回值难以预测、还会吞掉异常，应只在 finally 中做资源清理（如关闭流）。",
      tags: ["try-catch-finally", "return", "输出预测"],
    },
    {
      title: "受检异常 vs 运行时异常",
      difficulty: "简单",
      question:
        "Java 的异常分为「受检异常（checked exception）」和「运行时异常（unchecked / runtime exception）」。请说明它们的区别（编译器是否强制处理、各自的父类是什么），并各举一个常见例子，比如 IOException 和 NullPointerException 分别属于哪一类。",
      answer:
        "区别：\n1. 受检异常（checked）：继承自 Exception（但不继承 RuntimeException）。编译器会强制要求处理——要么用 try-catch 捕获，要么在方法签名上用 throws 声明抛出，否则编译不通过。它代表「可预料、应当处理」的外部问题。例子：IOException（读写文件出错）、SQLException（数据库操作出错）、ClassNotFoundException。\n2. 运行时异常（unchecked）：继承自 RuntimeException（RuntimeException 又继承自 Exception）。编译器不强制处理，可以不写 try-catch 也能编译通过；它通常代表程序的逻辑 bug，应该靠修正代码来避免，而不是靠捕获。例子：NullPointerException（空指针）、ArrayIndexOutOfBoundsException（数组越界）、ClassCastException（类型转换错误）、ArithmeticException（除以 0）。\n所以：IOException 是受检异常（必须处理），NullPointerException 是运行时异常（不强制处理，靠避免）。\n补充：还有 Error（如 OutOfMemoryError、StackOverflowError），表示 JVM 层面的严重错误，一般不捕获处理。",
      tags: ["受检异常", "运行时异常", "异常分类"],
    },
    {
      title: "throw 与 throws 的区别（找错）",
      difficulty: "中等",
      question:
        "初学者常把 throw 和 throws 搞混。请先说明这两个关键字的区别，然后指出下面代码中的错误并改正：方法想在年龄为负时抛出异常，但写法有误。",
      code: `// 期望：age 为负数时抛出受检异常 Exception
public static void checkAge(int age) {
    if (age < 0) {
        throws new Exception("年龄不能为负");
    }
    System.out.println("年龄合法: " + age);
}`,
      hint: "throw 用在方法体内「抛出一个异常对象」；throws 用在方法签名上「声明这个方法可能抛出哪些异常」。抛出受检异常的方法必须 throws 声明。",
      answer:
        "throw 与 throws 的区别：\n- throw：是动作，用在方法体内部，后面跟一个异常对象，表示「此刻抛出这个异常」，一次只抛一个，如 throw new Exception(...)。\n- throws：是声明，用在方法签名（方法名后、{ 之前），后面跟一个或多个异常类型，表示「本方法可能抛出这些异常，调用者需要处理」，多个用逗号隔开。\n\n代码中的两处问题：\n1. 方法体内写成了 throws，应该用 throw（抛出动作）。\n2. Exception 是受检异常，方法内抛出它就必须在方法签名上用 throws Exception 声明（或改抛 RuntimeException 这类免检异常），否则编译不通过。\n改正见下方代码。",
      answerCode: `// 改正后：throw 抛对象，方法签名用 throws 声明
public static void checkAge(int age) throws Exception {
    if (age < 0) {
        throw new Exception("年龄不能为负");  // throw：抛出
    }
    System.out.println("年龄合法: " + age);
}

// 调用方需要处理这个受检异常
public static void main(String[] args) {
    try {
        checkAge(-1);
    } catch (Exception e) {
        System.out.println("捕获到异常: " + e.getMessage());
    }
}`,
      tags: ["throw", "throws", "找错"],
    },
    {
      title: "识别抛出的是哪种运行时异常",
      difficulty: "中等",
      question:
        "下面有三段独立的代码片段，每段运行时都会抛出一个运行时异常。请分别指出每段抛出的是哪种异常（类名），并说明原因。",
      code: `// 片段 A
String s = null;
System.out.println(s.length());

// 片段 B
int[] arr = {1, 2, 3};
System.out.println(arr[3]);

// 片段 C
Object obj = "hello";
Integer n = (Integer) obj;`,
      hint: "想想：对 null 调方法会怎样？数组合法下标范围是多少？把 String 强转成 Integer 行不行？",
      answer:
        "三段分别抛出：\n片段 A：NullPointerException（空指针异常）。s 的值是 null，对 null 调用 length() 方法时没有对象可调用，抛出 NPE。\n片段 B：ArrayIndexOutOfBoundsException（数组下标越界异常）。数组 arr 长度为 3，合法下标是 0、1、2；访问 arr[3] 超出了范围，抛出越界异常。\n片段 C：ClassCastException（类型转换异常）。obj 实际指向的是一个 String 对象，无法被强制转换成 Integer，两者没有继承关系，运行时抛出类型转换异常。\n这三种都是运行时异常（继承自 RuntimeException），编译器不强制处理，通常通过修正代码（先判空、检查下标、确认类型）来避免，而不是靠 try-catch。",
      tags: ["NullPointerException", "数组越界", "ClassCastException"],
    },
    {
      title: "自定义异常并抛出",
      difficulty: "困难",
      question:
        "请自定义一个受检异常类 InsufficientBalanceException（余额不足异常，继承 Exception），要求它能携带一条错误信息。然后写一个 withdraw(double balance, double amount) 方法模拟取款：当取款金额大于余额时，抛出该自定义异常；否则返回取款后的余额。最后在 main 中调用并用 try-catch 处理。",
      hint: "自定义异常类通常提供一个接收 String message 的构造方法，并调用 super(message)。抛出受检异常的方法要在签名上 throws。",
      answer:
        "实现要点：\n1. 自定义异常类继承 Exception（这样它是受检异常）；提供一个带 String message 的构造方法，内部调用 super(message)，把信息交给父类保存，之后可通过 getMessage() 取出。\n2. withdraw 方法中判断：若 amount > balance，则 throw new InsufficientBalanceException(...)；因为是受检异常，方法签名要加 throws InsufficientBalanceException。\n3. 调用处用 try-catch 捕获，在 catch 中通过 e.getMessage() 拿到错误信息。\n自定义异常的意义：用有业务含义的异常类型表达特定错误，便于调用方针对性地捕获和处理，比直接抛通用 Exception 更清晰。完整代码见下方。",
      answerCode: `// 1. 自定义受检异常
class InsufficientBalanceException extends Exception {
    public InsufficientBalanceException(String message) {
        super(message);  // 把错误信息交给父类保存
    }
}

public class BankDemo {
    // 2. 取款方法：余额不足时抛出自定义异常
    public static double withdraw(double balance, double amount)
            throws InsufficientBalanceException {
        if (amount > balance) {
            throw new InsufficientBalanceException(
                "余额不足：当前余额 " + balance + "，尝试取出 " + amount);
        }
        return balance - amount;
    }

    // 3. 调用并处理
    public static void main(String[] args) {
        try {
            double left = withdraw(100, 30);
            System.out.println("取款成功，剩余: " + left); // 取款成功，剩余: 70.0

            withdraw(100, 200); // 触发异常
        } catch (InsufficientBalanceException e) {
            System.out.println("取款失败: " + e.getMessage());
        }
    }
}`,
      tags: ["自定义异常", "throw", "编程实现"],
    },
  ],
};

export default category;
