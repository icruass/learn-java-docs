import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "constants",
  name: "常量",
  problems: [
    {
      title: "常量（字面量）的分类",
      difficulty: "简单",
      question:
        "Java 中的常量（字面量）按照数据类型可以分为哪几类？请逐类各举一个例子。",
      answer:
        "常量是在程序运行中其值不会改变的量，按字面量类型可分为：\n1. 整数常量：如 100、-5、0。\n2. 小数（浮点）常量：如 3.14、-0.5、2.0。\n3. 字符常量：用单引号括起来的单个字符，如 'a'、'中'、'9'。\n4. 字符串常量：用双引号括起来的内容，如 \"Hello\"、\"\"（空串）。\n5. 布尔常量：只有两个值 true 和 false。\n6. 空常量：null，表示「没有任何对象」，只能赋给引用类型。",
      tags: ["常量", "字面量", "分类"],
    },
    {
      title: "用 final 定义常量并二次赋值",
      difficulty: "中等",
      question:
        "在 Java 中可以用 final 关键字定义「值不可改变」的常量。阅读下面的代码，它能否编译通过？为什么？如果不能，应如何修改才能正确运行（保持 PI 是常量）？",
      code: `public class ConstDemo {
    public static void main(String[] args) {
        final double PI = 3.14;
        PI = 3.1415;
        System.out.println(PI);
    }
}`,
      hint: "final 修饰的变量一旦被赋值，就不能再被重新赋值。",
      answer:
        "不能编译通过。final 修饰的变量是常量，一旦完成初始化赋值，就不能再被重新赋值。代码中 PI 已被赋值为 3.14，第二行 PI = 3.1415 试图再次赋值，编译器会报错：cannot assign a value to final variable PI（无法为 final 变量再次赋值）。\n修改方法：删除二次赋值的语句，直接在定义时给出最终的值。常量名按约定使用全大写。",
      answerCode: `public class ConstDemo {
    public static void main(String[] args) {
        final double PI = 3.1415;   // 定义时一次性赋值，之后不再修改
        System.out.println(PI);
    }
}`,
      tags: ["final", "常量", "找错"],
    },
    {
      title: "转义字符的输出预测",
      difficulty: "中等",
      question:
        "阅读下面的代码，写出程序运行后控制台的输出（注意每个转义字符的含义）。",
      code: `public class EscapeDemo {
    public static void main(String[] args) {
        System.out.println("a\\tb");
        System.out.println("c\\nd");
        System.out.println("e\\\\f");
        System.out.println("say \\"hi\\"");
    }
}`,
      hint: "\\t 是制表符（Tab），\\n 是换行，\\\\ 表示一个反斜杠，\\\" 表示一个双引号。",
      answer:
        "各转义字符含义：\\t 制表符（横向跳到下一个制表位）、\\n 换行、\\\\ 一个反斜杠 \\、\\\" 一个双引号 \"。逐行分析：\n- \"a\\tb\" 输出：a 与 b 之间有一个 Tab 间隔，即 a    b\n- \"c\\nd\" 输出：c 与 d 中间换行，c 在一行，d 在下一行\n- \"e\\\\f\" 输出：e\\f（中间是一个反斜杠）\n- \"say \\\"hi\\\"\" 输出：say \"hi\"\n\n完整输出（共 5 行，因为第二条语句内部换了一次行）：\na\tb\nc\nd\ne\\f\nsay \"hi\"",
      tags: ["转义字符", "输出预测", "字符串"],
    },
    {
      title: "字符常量与字符串常量的区别",
      difficulty: "简单",
      question:
        "'a'（单引号）和 \"a\"（双引号）有什么区别？它们的数据类型分别是什么？下面两行代码哪一行能编译通过，哪一行会报错？\n   char c = 'a';\n   char s = \"a\";",
      answer:
        "'a' 是字符常量，类型是 char，表示「一个字符」，必须且只能包含一个字符，用单引号括起来。\n\"a\" 是字符串常量，类型是 String，表示「一串字符」（可以是 0 个、1 个或多个），用双引号括起来。二者类型不同，不能混用。\n所以：\n- char c = 'a';  正确。把一个字符赋给 char 变量。\n- char s = \"a\";  报错。\"a\" 是 String，不能赋给 char 类型变量（类型不兼容：incompatible types: String cannot be converted to char）。若要存字符串，应写 String s = \"a\";",
      tags: ["字符常量", "字符串常量", "char"],
    },
    {
      title: "不同进制字面量的十进制值",
      difficulty: "中等",
      question:
        "Java 支持用前缀表示不同进制的整数字面量。请写出下列每个字面量对应的十进制值，并说明它是几进制：\n0x1F、0b1010、010、100",
      hint: "0x 开头是十六进制，0b 开头是二进制，以 0 开头（后面还有数字）是八进制，普通数字是十进制。",
      answer:
        "Java 整数字面量的进制前缀：0x（或 0X）表示十六进制，0b（或 0B）表示二进制，以 0 开头且后面跟数字表示八进制，没有前缀就是十进制。逐个换算：\n- 0x1F：十六进制。1×16 + 15 = 31，十进制值为 31。\n- 0b1010：二进制。8 + 0 + 2 + 0 = 10，十进制值为 10。\n- 010：八进制（注意以 0 开头）。1×8 + 0 = 8，十进制值为 8。\n- 100：十进制（无前缀）。值就是 100。\n小提醒：010 容易被误以为是十,它其实是八进制的 8，写代码时要小心前导 0。",
      tags: ["进制", "字面量", "整数"],
    },
  ],
};

export default category;
