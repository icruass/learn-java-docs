import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "methods",
  name: "方法",
  problems: [
    {
      title: "定义并调用一个求和方法",
      difficulty: "简单",
      question:
        "请定义一个方法 sum，接收两个 int 参数并返回它们的和，然后在 main 方法中调用它，打印 3 和 5 的和。",
      hint: "方法的语法是：修饰符 返回值类型 方法名(参数列表) { 方法体 }。在类中定义的方法若要被 main 直接调用，通常加 static。",
      answer:
        "方法用来封装一段可复用的逻辑。sum 的返回值类型是 int，形参是两个 int。调用时把实参 3、5 传给形参 a、b，方法通过 return 把结果返回给调用处。因为 main 是 static 的，所以同类中被它直接调用的 sum 也要声明为 static（否则需要先创建对象再调用）。",
      answerCode: `public class Demo {
    // 求两数之和的方法
    public static int sum(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int result = sum(3, 5);
        System.out.println("和为：" + result); // 和为：8
    }
}`,
      tags: ["方法定义", "方法调用"],
    },
    {
      title: "判断方法重载",
      difficulty: "中等",
      question:
        "下面这组方法中，哪些与 add(int a, int b) 构成重载（overload）？请逐一判断并说明为什么「仅返回值类型不同」不算重载。",
      code: `// 已有方法
public int add(int a, int b) { return a + b; }

// 候选方法
// (A) public int add(int a, int b, int c) { return a + b + c; }
// (B) public double add(double a, double b) { return a + b; }
// (C) public int add(int x, int y) { return x - y; }
// (D) public double add(int a, int b) { return a + b; }`,
      hint: "重载只看「方法名相同 + 参数列表不同（个数、类型或顺序）」，与返回值类型、参数名都无关。",
      answer:
        "判断重载只看方法名是否相同、参数列表（个数/类型/顺序）是否不同，跟返回值类型和形参名无关。\n(A) 参数个数不同（2 个 vs 3 个），构成重载，✅。\n(B) 参数类型不同（int,int vs double,double），构成重载，✅。\n(C) 参数列表与原方法完全一样（都是 int,int），只是形参名和方法体不同，这不构成重载，会被认为是「重复定义同一个方法」而编译报错，❌。\n(D) 参数列表与原方法一样（int,int），只有返回值类型不同（int vs double），❌——编译报错。\n原因：调用方法时是按「方法名 + 实参」来匹配的，编译器只凭这些就要确定调用哪个方法；返回值可以被忽略（如直接写 add(1,2); 不接收返回值），所以仅靠返回值无法区分两个方法，因此不允许仅返回值不同。",
      tags: ["方法重载", "overload"],
    },
    {
      title: "值传递：基本类型 vs 引用类型",
      difficulty: "中等",
      question: "阅读下面代码，写出程序的输出，并解释为什么基本类型和数组的表现不同。",
      code: `public class Demo {
    public static void change(int x, int[] arr) {
        x = 100;
        arr[0] = 100;
    }

    public static void main(String[] args) {
        int a = 1;
        int[] b = {1, 2, 3};
        change(a, b);
        System.out.println(a);
        System.out.println(b[0]);
    }
}`,
      hint: "Java 永远是值传递。基本类型传的是「值的副本」，引用类型传的是「引用（地址）的副本」。",
      answer:
        "输出：\n1\n100\n\nJava 只有值传递。\n对基本类型 a：传给方法的是 a 的值的副本，方法里把副本 x 改成 100，不影响 main 中的 a，所以 a 仍是 1。\n对数组 b：数组是引用类型，传给方法的是「引用（地址）的副本」。x... 不，是 arr 这个副本和 b 指向同一个数组对象，所以 arr[0]=100 修改的是同一块数组内存，main 里看到 b[0] 也变成 100。\n关键：传引用副本 ≠ 传引用本身。如果在方法里写 arr = new int[]{9}，并不会改变 main 中 b 的指向。",
      tags: ["值传递", "引用类型"],
    },
    {
      title: "递归求阶乘 n!",
      difficulty: "中等",
      question:
        "用递归实现求 n 的阶乘（n! = n × (n-1) × ... × 1，且 0! = 1）。请写出方法，并说明递归必须具备的两个要素。",
      hint: "递归 = 递归出口（base case） + 递归调用（把问题缩小一步）。",
      answer:
        "递归必须具备两个要素：①递归出口（终止条件），否则会无限递归导致栈溢出 StackOverflowError；②每次递归要让问题规模缩小，逐步逼近出口。\n求阶乘的递推关系是 n! = n × (n-1)!，出口是 0! = 1（或 1! = 1）。例如 factorial(5) = 5×factorial(4) = ... = 5×4×3×2×1 = 120。",
      answerCode: `public class Demo {
    public static long factorial(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("n 不能为负数");
        }
        if (n == 0) {      // 递归出口
            return 1;
        }
        return n * factorial(n - 1); // 递归调用，规模缩小
    }

    public static void main(String[] args) {
        System.out.println(factorial(5)); // 120
    }
}`,
      tags: ["递归", "阶乘"],
    },
    {
      title: "递归求斐波那契第 n 项",
      difficulty: "困难",
      question:
        "斐波那契数列定义为：F(1)=1, F(2)=1, F(n)=F(n-1)+F(n-2)（n≥3）。请用递归实现求第 n 项，并简要说明朴素递归的效率问题以及如何优化。",
      hint: "注意有两个递归出口。朴素递归会重复计算大量子问题。",
      answer:
        "斐波那契有两个出口：F(1)=1、F(2)=1；其余 F(n)=F(n-1)+F(n-2)。\n朴素递归的问题：同一个子问题会被反复计算，例如算 F(5) 时 F(3) 会被算很多次，时间复杂度约为 O(2^n)，n 稍大就非常慢。\n优化方式：①记忆化（用数组/Map 缓存已算过的结果），把复杂度降到 O(n)；②改用循环（迭代）自底向上计算，只保留前两个值，时间 O(n)、空间 O(1)，是最推荐的写法。下面给出朴素递归与迭代两种实现。",
      answerCode: `public class Demo {
    // 朴素递归（直观但慢，O(2^n)）
    public static long fibRecursive(int n) {
        if (n == 1 || n == 2) {
            return 1;
        }
        return fibRecursive(n - 1) + fibRecursive(n - 2);
    }

    // 迭代（推荐，O(n) 时间、O(1) 空间）
    public static long fibIterative(int n) {
        if (n == 1 || n == 2) {
            return 1;
        }
        long prev = 1, curr = 1;
        for (int i = 3; i <= n; i++) {
            long next = prev + curr;
            prev = curr;
            curr = next;
        }
        return curr;
    }

    public static void main(String[] args) {
        System.out.println(fibRecursive(10)); // 55
        System.out.println(fibIterative(10));  // 55
    }
}`,
      tags: ["递归", "斐波那契", "算法优化"],
    },
  ],
};

export default category;
