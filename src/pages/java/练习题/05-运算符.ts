import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "operators",
  name: "运算符",
  problems: [
    {
      title: "整数除法与取模运算",
      difficulty: "简单",
      question: "写出下列每条 println 的输出，并解释整数除法与取模（%）的规则。",
      code: `public class Mod {
    public static void main(String[] args) {
        System.out.println(7 / 2);
        System.out.println(7 % 2);
        System.out.println(-7 % 3);
        System.out.println(7 % -3);
    }
}`,
      hint: "两个 int 相除结果仍是 int（小数部分被丢弃）。Java 中取模结果的符号与「被除数」一致。",
      answer:
        "输出依次为：\n" +
        "3\n" +
        "1\n" +
        "-1\n" +
        "1\n\n" +
        "解释：\n" +
        "1. `7 / 2`：两个整数相除得到整数，丢弃小数部分，结果为 3（不是 3.5）。\n" +
        "2. `7 % 2`：7 除以 2 余 1，结果为 1。\n" +
        "3. `-7 % 3`：在 Java 中，取模结果的符号与被除数（左边的 -7）相同，-7 = 3 * (-2) + (-1)，余数为 -1。\n" +
        "4. `7 % -3`：被除数 7 为正，结果为正，7 = (-3) * (-2) + 1，余数为 1。\n\n" +
        "记忆要点：a % b 的符号只看 a（被除数）。",
      tags: ["整数除法", "取模", "运算符"],
    },
    {
      title: "i++ 与 ++i 的区别",
      difficulty: "中等",
      question:
        "阅读下列代码，写出 b 的最终值，并解释后置自增（a++）与前置自增（++a）在表达式中的区别。",
      code: `public class IncDec {
    public static void main(String[] args) {
        int a = 1;
        int b = a++ + ++a;
        System.out.println("a = " + a);
        System.out.println("b = " + b);
    }
}`,
      hint: "a++ 先用旧值参与运算再自增；++a 先自增再用新值参与运算。逐步把每个子表达式的取值算出来。",
      answer:
        "输出为：\n" +
        "a = 3\n" +
        "b = 4\n\n" +
        "逐步分析（初始 a = 1）：\n" +
        "1. 计算 `a++`：后置自增，先取出 a 的当前值 1 用于表达式，然后 a 自增为 2。此时这一项的值是 1。\n" +
        "2. 计算 `++a`：前置自增，先把 a 从 2 自增为 3，再取出新值 3 用于表达式。此时这一项的值是 3。\n" +
        "3. 因此 b = 1 + 3 = 4，而 a 最终为 3。\n\n" +
        "区别小结：a++（后置）返回自增前的旧值，++a（前置）返回自增后的新值；两者对变量本身的最终影响都是加 1。",
      tags: ["自增自减", "前置后置"],
    },
    {
      title: "逻辑短路求值",
      difficulty: "中等",
      question:
        "下列代码利用了 && 和 || 的「短路」特性，请写出最终 a、b 的值以及打印结果，并解释短路是如何发生的。",
      code: `public class ShortCircuit {
    static int a = 0;
    static int b = 0;

    static boolean incA() { a++; return true; }
    static boolean incB() { b++; return true; }

    public static void main(String[] args) {
        boolean r1 = (false && incA());  // && 短路
        boolean r2 = (true || incB());   // || 短路
        System.out.println("a = " + a);
        System.out.println("b = " + b);
        System.out.println(r1 + ", " + r2);
    }
}`,
      hint: "&& 左边为 false 时，整体已确定为 false，右边不再执行；|| 左边为 true 时，整体已确定为 true，右边不再执行。",
      answer:
        "输出为：\n" +
        "a = 0\n" +
        "b = 0\n" +
        "false, true\n\n" +
        "解释：\n" +
        "1. `false && incA()`：&& 是短路与，左操作数为 false 时，整个表达式结果已经确定为 false，因此右边的 incA() 根本不会被调用，a 保持为 0，r1 = false。\n" +
        "2. `true || incB()`：|| 是短路或，左操作数为 true 时，整个表达式结果已经确定为 true，因此右边的 incB() 也不会被调用，b 保持为 0，r2 = true。\n\n" +
        "短路求值的好处：既能提升性能，也常用于「先判空再访问」的安全写法，例如 `if (obj != null && obj.isOk())`。如果使用不短路的 & 和 |，则两边都会被求值。",
      tags: ["逻辑运算符", "短路求值"],
    },
    {
      title: "用三元运算符求两数最大值",
      difficulty: "简单",
      question:
        "请使用三元运算符（条件运算符 ? :），编写一段代码求出两个整数 x 和 y 中的较大值并打印出来。简要说明三元运算符的语法。",
      hint: "三元运算符的语法是：条件 ? 值1 : 值2。当条件为 true 取值1，否则取值2。",
      answer:
        "三元运算符的语法为：`条件表达式 ? 表达式1 : 表达式2`。当条件为 true 时，整个表达式的结果是「表达式1」，否则是「表达式2」。它常用于根据条件在两个值之间二选一，可以替代简单的 if-else 赋值。\n\n" +
        "求最大值的思路：判断 `x > y` 是否成立，成立则取 x，否则取 y。完整代码见参考答案代码。",
      answerCode: `public class Max {
    public static void main(String[] args) {
        int x = 8;
        int y = 5;
        int max = (x > y) ? x : y;   // x 大取 x，否则取 y
        System.out.println("较大值是：" + max);  // 输出：较大值是：8
    }
}`,
      tags: ["三元运算符", "条件运算符"],
    },
    {
      title: "位运算与复合赋值运算符",
      difficulty: "困难",
      question: "写出下列每条 println 的输出，并解释 <<、&、| 以及复合赋值运算符 += 的作用。",
      code: `public class Bits {
    public static void main(String[] args) {
        System.out.println(1 << 4);     // 左移
        System.out.println(6 & 3);      // 按位与
        System.out.println(6 | 3);      // 按位或
        int a = 10;
        a += 5 * 2;                     // 复合赋值
        System.out.println(a);
    }
}`,
      hint: "把数字写成二进制再做运算：6 是 0110，3 是 0011。x << n 相当于 x 乘以 2 的 n 次方。",
      answer:
        "输出依次为：\n" +
        "16\n" +
        "2\n" +
        "7\n" +
        "20\n\n" +
        "解释：\n" +
        "1. `1 << 4`：左移运算，把 1 的二进制向左移动 4 位，相当于 1 × 2^4 = 16。\n" +
        "2. `6 & 3`：按位与，对应二进制位都为 1 时结果位才为 1。0110 & 0011 = 0010，即 2。\n" +
        "3. `6 | 3`：按位或，对应二进制位只要有一个为 1 结果位就为 1。0110 | 0011 = 0111，即 7。\n" +
        "4. `a += 5 * 2`：复合赋值运算符，等价于 `a = a + (5 * 2)`，注意先算右边的 5 * 2 = 10，再 a = 10 + 10 = 20。\n\n" +
        "补充：复合赋值运算符（+=、-=、*=、/=、%= 等）会自动进行类型转换，例如 `byte b = 1; b += 1;` 是合法的，而 `b = b + 1;` 反而会报错（因为 b + 1 结果是 int）。",
      tags: ["位运算", "左移", "复合赋值"],
    },
  ],
};

export default category;
