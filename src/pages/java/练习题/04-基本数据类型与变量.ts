import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "datatypes",
  name: "基本数据类型与变量",
  problems: [
    {
      title: "Java 的八种基本数据类型",
      difficulty: "简单",
      question:
        "请说出 Java 的八种基本数据类型（基本类型），并写出每种类型所占的字节数。它们的默认值分别是什么？",
      hint: "可以按「整数类型 / 浮点类型 / 字符类型 / 布尔类型」四类来记。",
      answer:
        "Java 共有八种基本数据类型：\n" +
        "1. 整数类型：byte（1 字节）、short（2 字节）、int（4 字节）、long（8 字节）；\n" +
        "2. 浮点类型：float（4 字节）、double（8 字节）；\n" +
        "3. 字符类型：char（2 字节，存储一个 Unicode 字符）；\n" +
        "4. 布尔类型：boolean（理论上只需 1 位，JVM 中通常按 1 字节处理）。\n\n" +
        "默认值（仅指作为成员变量/数组元素时，局部变量没有默认值，必须先赋值）：\n" +
        "byte/short/int 为 0，long 为 0L，float 为 0.0f，double 为 0.0d，char 为 '\\u0000'（即数值 0 的空字符），boolean 为 false。",
      tags: ["基本数据类型", "字节数", "默认值"],
    },
    {
      title: "自动类型转换与强制类型转换",
      difficulty: "中等",
      question:
        "阅读下列代码，写出每条 println 的输出，并解释为什么会出现这样的结果（注意精度丢失）。",
      code: `public class Convert {
    public static void main(String[] args) {
        int i = 5;
        double d = i;        // 自动类型转换（小转大）
        System.out.println(d);

        double pi = 3.99;
        int x = (int) pi;    // 强制类型转换（大转小）
        System.out.println(x);

        double money = 1.0 / 3.0;
        System.out.println(money);
    }
}`,
      hint: "int 转 double 是「向上转型」，安全无损；double 强转 int 直接丢弃小数部分，不会四舍五入。",
      answer:
        "输出依次为：\n" +
        "5.0\n" +
        "3\n" +
        "0.3333333333333333\n\n" +
        "解释：\n" +
        "1. `double d = i;` 是自动类型转换，int 的取值范围被 double 完全包含，因此 5 变为 5.0，无精度丢失。\n" +
        "2. `(int) pi` 是强制类型转换，把 double 转成 int 时直接「截断」小数部分（并非四舍五入），所以 3.99 变成 3，这里发生了精度丢失。\n" +
        "3. `1.0 / 3.0` 是浮点除法，结果是无限循环小数，double 只能保存有限位有效数字，因此打印出 0.3333333333333333（这也是一种精度问题）。",
      tags: ["类型转换", "精度丢失"],
    },
    {
      title: "byte 整型溢出",
      difficulty: "中等",
      question: "下面这段代码的输出是什么？请解释「整型溢出」是怎么发生的。",
      code: `public class Overflow {
    public static void main(String[] args) {
        byte b = 127;
        b++;
        System.out.println(b);
    }
}`,
      hint: "byte 是 1 字节有符号整数，取值范围是 -128 ~ 127。想象一个首尾相接的「钟表盘」。",
      answer:
        "输出为：-128。\n\n" +
        "byte 占 1 字节，能表示的范围是 -128 到 127。当 b 已经是最大值 127 时再执行 b++（加 1），结果超出了能表示的最大值，于是「绕回」到最小值 -128，这就是整型溢出（overflow）。\n\n" +
        "本质上是因为整数在内存中以补码（二进制）存储：127 的补码是 0111_1111，加 1 后变成 1000_0000，而这个补码对应的有符号数正好是 -128。所有整数类型（byte/short/int/long）溢出后都会以这种方式回绕，且不会抛出异常。",
      tags: ["整型溢出", "byte", "补码"],
    },
    {
      title: "char 参与算术运算",
      difficulty: "简单",
      question:
        "下列代码会输出什么？为什么字符相加得到的是一个数字而不是字符？",
      code: `public class CharMath {
    public static void main(String[] args) {
        char c = 'a';
        System.out.println('a' + 1);
        System.out.println((char) ('a' + 1));
    }
}`,
      hint: "字符 'a' 在 Unicode/ASCII 中的编码值是 97。char 参与算术运算时会先被提升为 int。",
      answer:
        "输出依次为：\n" +
        "98\n" +
        "b\n\n" +
        "原因：char 在 Java 中本质上是一个无符号的整数编码（'a' 对应编码值 97）。当 char 参与算术运算（如 + - * /）时，会自动提升为 int 再计算，所以 'a' + 1 实际是 97 + 1 = 98，打印出整数 98。\n\n" +
        "如果希望得到字符结果，需要把运算结果再强制转换回 char：`(char) ('a' + 1)` 会把 98 当作编码值解释为字符 'b'。",
      tags: ["char", "字符编码", "类型提升"],
    },
    {
      title: "找错：在作用域外使用局部变量",
      difficulty: "困难",
      question:
        "下面这段代码无法通过编译，请指出错误所在的原因，并给出一种修改方案。",
      code: `public class Scope {
    public static void main(String[] args) {
        if (args.length == 0) {
            int count = 10;
        }
        System.out.println(count);  // 这里报错
    }
}`,
      hint: "注意 count 是在哪一对花括号 {} 里声明的，它的「生命周期」到哪里结束？",
      answer:
        "错误原因：count 是在 if 语句的代码块 `{ ... }` 内部声明的局部变量，它的作用域仅限于这对花括号之间。一旦 if 块结束，count 就被销毁了。因此在 if 块外面的 `System.out.println(count);` 处，编译器找不到这个变量，会报「cannot find symbol（找不到符号）」的编译错误。\n\n" +
        "修改方案：把 count 的声明提升到 if 块之外（即与 println 处于同一个或更外层的作用域），并在声明时赋初值。修改后的代码见参考答案代码。",
      answerCode: `public class Scope {
    public static void main(String[] args) {
        int count = 0;            // 声明提升到外层作用域，并赋初值
        if (args.length == 0) {
            count = 10;           // 此处只做赋值
        }
        System.out.println(count);  // 现在可以正常访问
    }
}`,
      tags: ["变量作用域", "局部变量"],
    },
  ],
};

export default category;
