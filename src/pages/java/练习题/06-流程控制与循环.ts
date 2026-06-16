import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "flow",
  name: "流程控制与循环",
  problems: [
    {
      title: "switch 的 break 穿透",
      difficulty: "中等",
      question:
        "下面的 switch 语句故意漏写了部分 break，请写出当 day = 2 时的输出，并解释「case 穿透（fall-through）」现象。",
      code: `public class SwitchFall {
    public static void main(String[] args) {
        int day = 2;
        switch (day) {
            case 1:
                System.out.println("一");
            case 2:
                System.out.println("二");
            case 3:
                System.out.println("三");
                break;
            case 4:
                System.out.println("四");
            default:
                System.out.println("其他");
        }
    }
}`,
      hint: "switch 从匹配的 case 开始执行，遇到 break 才会跳出。如果某个 case 没有 break，会「掉进」下一个 case 继续执行。",
      answer:
        "当 day = 2 时，输出为：\n" +
        "二\n" +
        "三\n\n" +
        "解释：switch 会从匹配成功的 `case 2` 开始执行，打印「二」。由于 case 2 后面没有 break，程序会继续「穿透」执行 case 3，打印「三」，直到遇到 case 3 中的 break 才跳出 switch。case 4 和 default 不会被执行。\n\n" +
        "这种漏写 break 导致继续执行后续分支的现象就叫 case 穿透（fall-through）。它有时被故意利用（多个 case 共享同一段逻辑），但更多时候是 bug，所以编写 switch 时务必记得在每个 case 末尾加 break。",
      tags: ["switch", "break", "case穿透"],
    },
    {
      title: "打印九九乘法表",
      difficulty: "中等",
      question:
        "请使用嵌套的 for 循环打印出标准的九九乘法表（下三角形式，例如第一行 `1*1=1`，第二行 `1*2=2  2*2=4`，依此类推）。",
      hint: "外层循环控制行（i 从 1 到 9），内层循环控制列（j 从 1 到 i）。每打印完一行用换行。",
      answer:
        "思路：用两层 for 循环。外层变量 i 表示当前行（也就是乘法的第二个因数），从 1 到 9；内层变量 j 表示当前列（第一个因数），从 1 到 i（这样才是下三角，避免重复）。内层每次打印 `j*i=积`，每行结束后换行。完整代码见参考答案代码。",
      answerCode: `public class MultiTable {
    public static void main(String[] args) {
        for (int i = 1; i <= 9; i++) {           // 控制行
            for (int j = 1; j <= i; j++) {       // 控制列，j <= i 形成下三角
                System.out.print(j + "*" + i + "=" + (j * i) + "\\t");
            }
            System.out.println();                // 每行结束换行
        }
    }
}`,
      tags: ["for循环", "嵌套循环", "九九乘法表"],
    },
    {
      title: "判断闰年",
      difficulty: "简单",
      question:
        "请说明判断「闰年」的规则，并编写一段代码判断给定年份 year 是否为闰年，输出 true 或 false。",
      hint: "闰年规则：能被 4 整除但不能被 100 整除，或者能被 400 整除。",
      answer:
        "闰年的判断规则：一个年份满足以下任一条件即为闰年——\n" +
        "1. 能被 4 整除，同时不能被 100 整除（普通闰年）；\n" +
        "2. 能被 400 整除（世纪闰年，如 2000 年是闰年，而 1900 年不是）。\n\n" +
        "用一个布尔表达式即可表示：`(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)`。完整代码见参考答案代码。",
      answerCode: `public class LeapYear {
    public static void main(String[] args) {
        int year = 2024;
        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        System.out.println(year + " 是闰年吗？" + isLeap);  // 2024 -> true
    }
}`,
      tags: ["闰年", "条件判断", "取模"],
    },
    {
      title: "用循环求 1~100 的和",
      difficulty: "简单",
      question: "请使用 while 或 for 循环，计算并打印出 1 加到 100 的总和。",
      hint: "用一个累加变量 sum，初值为 0，循环中每次把当前数字加进去。结果应为 5050。",
      answer:
        "思路：定义一个累加器 sum（初值 0），让循环变量 i 从 1 遍历到 100，每次执行 `sum += i`，循环结束后 sum 就是 1+2+...+100 的总和，结果为 5050。下面给出 for 循环的写法（用 while 同理）。",
      answerCode: `public class Sum {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;          // 累加
        }
        System.out.println("1~100 的和为：" + sum);  // 输出：5050
    }
}`,
      tags: ["for循环", "累加", "求和"],
    },
    {
      title: "break 与 continue 的区别",
      difficulty: "中等",
      question:
        "下面这段嵌套循环用到了 break 和 continue，请写出完整的输出，并解释两者的区别。",
      code: `public class BreakContinue {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (j == 2) {
                    continue;   // 跳过本次内层循环
                }
                if (i == 3) {
                    break;      // 跳出内层循环
                }
                System.out.println("i=" + i + ", j=" + j);
            }
        }
    }
}`,
      hint: "continue 只是跳过本次循环剩余语句、进入下一次迭代；break 直接结束（跳出）当前所在的那一层循环。注意它们都只作用于最内层循环。",
      answer:
        "输出为：\n" +
        "i=1, j=1\n" +
        "i=1, j=3\n" +
        "i=2, j=1\n" +
        "i=2, j=3\n\n" +
        "逐步分析：\n" +
        "- 当 i=1 或 i=2 时：j=1 正常打印；j=2 触发 continue，跳过本次打印直接进入下一轮；j=3 正常打印。所以每个这样的 i 打印两行。\n" +
        "- 当 i=3 时：j=1 时先判断 `j == 2` 为假，再判断 `i == 3` 为真，触发 break，立即跳出内层循环，因此 i=3 这一轮一行都不打印。\n\n" +
        "区别小结：\n" +
        "1. continue：结束「本次」迭代，跳过循环体内剩余语句，直接进入下一次循环条件判断；循环本身继续。\n" +
        "2. break：彻底「跳出」当前所在的这一层循环，后续迭代都不再执行。\n" +
        "在嵌套循环中，两者默认都只影响最内层循环（若要跳出外层可使用带标签 label 的 break）。",
      tags: ["break", "continue", "嵌套循环"],
    },
    {
      title: "判断素数（质数）",
      difficulty: "困难",
      question:
        "请编写一段代码判断给定的整数 n 是否为素数（质数），并输出判断结果。要求考虑 n <= 1 的边界情况，并尽量减少循环次数。",
      hint:
        "素数是大于 1 且只能被 1 和它本身整除的整数。判断时只需用 2 到 √n 之间的数去试除：若都除不尽则是素数。一旦发现能整除即可提前结束。",
      answer:
        "素数定义：大于 1，且除了 1 和它本身之外没有其他正因数的整数（最小的素数是 2）。\n\n" +
        "判断思路：\n" +
        "1. 边界处理：若 n <= 1，直接判定为「不是素数」。\n" +
        "2. 试除法：用 i 从 2 循环到 √n（即 i * i <= n），只要 n 能被其中任意一个 i 整除（n % i == 0），就说明 n 有除 1 和自身以外的因数，不是素数，可立即 break 提前结束。\n" +
        "3. 之所以只需检查到 √n：因为若 n = a * b 且 a <= b，则必有 a <= √n，所以较小的因数一定出现在 √n 之前，无需检查更大的数，从而减少循环次数。\n\n" +
        "完整代码见参考答案代码。",
      answerCode: `public class Prime {
    public static void main(String[] args) {
        int n = 29;
        boolean isPrime = true;

        if (n <= 1) {
            isPrime = false;              // 0、1 和负数都不是素数
        } else {
            for (int i = 2; i * i <= n; i++) {  // 只需检查到 √n
                if (n % i == 0) {
                    isPrime = false;      // 找到因数，不是素数
                    break;                // 提前结束循环
                }
            }
        }

        System.out.println(n + " 是素数吗？" + isPrime);  // 29 -> true
    }
}`,
      tags: ["素数", "循环优化", "break"],
    },
  ],
};

export default category;
