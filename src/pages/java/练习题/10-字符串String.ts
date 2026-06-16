import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "string",
  name: "字符串String",
  problems: [
    {
      title: "String 的不可变性",
      difficulty: "简单",
      question:
        "Java 中的 String 被称为「不可变（immutable）」对象，这是什么意思？既然不可变，为什么下面这段代码看起来「修改」了字符串 s 的内容？请解释 s 最终指向的是什么。",
      code: `String s = "abc";
s = s + "def";
System.out.println(s); // abcdef`,
      hint: "区分「变量 s 这个引用」和「s 所指向的那个 String 对象」。",
      answer:
        "不可变指的是：一个 String 对象一旦被创建，它内部保存的字符内容就永远不会改变；String 类没有提供任何能修改自身字符内容的方法（substring、replace、concat 等都不会改原对象，而是返回一个新的 String）。\n上面的代码并没有修改 \"abc\" 这个对象，而是：\n1. s + \"def\" 在内存中创建了一个全新的字符串对象 \"abcdef\"；\n2. 再把变量 s 的引用指向这个新对象。\n原来的 \"abc\" 对象本身没有任何改变，只是变量 s 不再指向它了。\n之所以设计成不可变，主要是为了线程安全、可以安全地作为 HashMap 的键，以及支持字符串常量池的复用。如果需要频繁拼接/修改字符串，应使用可变的 StringBuilder。",
      tags: ["String", "不可变性"],
    },
    {
      title: "== 与 equals 比较字符串（字符串常量池）",
      difficulty: "中等",
      question:
        "阅读下面的代码，写出每一条 println 的输出（true / false），并解释原因，重点说明 == 和 equals 在比较字符串时的区别，以及字符串常量池起到的作用。",
      code: `String a = "abc";
String b = "abc";
String c = new String("abc");

System.out.println(a == b);        // (1)
System.out.println(a == c);        // (2)
System.out.println(a.equals(c));   // (3)
System.out.println(a == c.intern());// (4)`,
      hint: "字面量 \"abc\" 会进入字符串常量池；new String(...) 一定在堆上新建对象。== 比的是地址，equals 比的是内容。",
      answer:
        "输出依次为：\n(1) true\n(2) false\n(3) true\n(4) true\n\n原因：\n- == 比较的是两个引用是否指向同一个对象（即内存地址是否相同）；String 重写了 equals，比较的是两个字符串的字符内容是否相同。\n- a 和 b 都是字面量 \"abc\"，编译期会被放入「字符串常量池」并复用同一个对象，所以 a == b 为 true。\n- c 是用 new String(\"abc\") 创建的，new 一定在堆中新建一个对象，它和常量池里的 \"abc\" 不是同一个对象，所以 a == c 为 false。\n- a.equals(c) 比较内容，两者内容都是 \"abc\"，所以为 true。\n- c.intern() 会返回常量池中内容相同的那个对象（也就是 a 指向的对象），所以 a == c.intern() 为 true。\n结论：判断字符串内容是否相等，永远用 equals，不要用 ==。",
      tags: ["==与equals", "字符串常量池"],
    },
    {
      title: "String 常用方法预测输出",
      difficulty: "中等",
      question:
        "阅读下面使用 String 常用方法的代码，写出每一条 println 的输出。涉及 length、charAt、substring、indexOf、replace、split 等方法。",
      code: `String s = "Hello,World";

System.out.println(s.length());          // (1)
System.out.println(s.charAt(1));         // (2)
System.out.println(s.indexOf("World"));  // (3)
System.out.println(s.substring(6));      // (4)
System.out.println(s.substring(0, 5));   // (5)
System.out.println(s.replace("l", "L")); // (6)

String[] parts = s.split(",");
System.out.println(parts[0] + "-" + parts[1]); // (7)`,
      hint: "字符串下标从 0 开始；substring(start, end) 是「含头不含尾」；indexOf 找不到时返回 -1。",
      answer:
        "输出依次为：\n(1) 11 —— 字符串长度（包含逗号，共 11 个字符）。\n(2) e —— 下标 1 的字符（下标从 0 开始，0 是 'H'，1 是 'e'）。\n(3) 6 —— 子串 \"World\" 第一次出现的起始下标。\n(4) World —— substring(6) 从下标 6 截取到末尾。\n(5) Hello —— substring(0, 5) 截取下标 [0, 5)，即 0、1、2、3、4 共 5 个字符，含头不含尾。\n(6) HeLLo,WorLd —— replace 把所有的 'l' 替换为 'L'（替换全部，不只是第一个）。\n(7) Hello-World —— split(\",\") 以逗号分割成 [\"Hello\", \"World\"]，parts[0] 是 \"Hello\"，parts[1] 是 \"World\"。\n注意：以上方法都不会修改原字符串 s，而是返回新的字符串。",
      tags: ["String方法", "输出预测"],
    },
    {
      title: "反转一个字符串",
      difficulty: "简单",
      question:
        "请编写一个方法 reverse(String s)，返回把字符串 s 字符顺序反转后的结果。例如输入 \"hello\" 返回 \"olleh\"。请至少给出一种实现，并说明用 StringBuilder 实现的简便方式。",
      hint: "StringBuilder 自带 reverse() 方法；也可以自己从后往前遍历拼接。",
      answer:
        "最简单的方式是利用 StringBuilder 的 reverse() 方法：new StringBuilder(s).reverse().toString()。\n如果要手动实现，可以从字符串末尾往前遍历，依次把字符追加到 StringBuilder 中。\n注意不要用 String 直接 += 拼接来做反转，因为 String 不可变，循环中每次拼接都会创建新对象，效率低；用 StringBuilder（可变字符序列）更高效。\n下面给出两种写法。",
      answerCode: `// 写法一：直接用 StringBuilder.reverse()
public static String reverse(String s) {
    return new StringBuilder(s).reverse().toString();
}

// 写法二：手动从后往前拼接
public static String reverse2(String s) {
    StringBuilder sb = new StringBuilder();
    for (int i = s.length() - 1; i >= 0; i--) {
        sb.append(s.charAt(i));
    }
    return sb.toString();
}

// 测试
public static void main(String[] args) {
    System.out.println(reverse("hello"));  // olleh
    System.out.println(reverse2("hello")); // olleh
}`,
      tags: ["StringBuilder", "字符串反转", "编程实现"],
    },
    {
      title: "统计某个字符在字符串中出现的次数",
      difficulty: "困难",
      question:
        "请编写一个方法 countChar(String s, char target)，返回字符 target 在字符串 s 中出现的次数。例如 countChar(\"banana\", 'a') 应返回 3。要求遍历整个字符串进行统计，并考虑 s 为 null 或空串的情况。再进一步：如何统计字符串中每个字符各自出现的次数？",
      hint: "用一个计数器变量，遍历每个字符（charAt 或 toCharArray），与 target 相等就加一。统计所有字符可以用 HashMap<Character, Integer>。",
      answer:
        "基本思路：定义一个计数器 count = 0，从头到尾遍历字符串的每个字符，凡是与 target 相等就 count++，遍历结束返回 count。\n边界处理：如果 s 为 null 或长度为 0，直接返回 0，避免空指针。\n进阶（统计每个字符的次数）：用 HashMap<Character, Integer> 记录，遍历时对每个字符做「取出旧值（默认 0）+1 再放回」，可用 map.getOrDefault(c, 0) + 1 或 map.merge(c, 1, Integer::sum) 简化。\n下面给出两段实现。",
      answerCode: `// 统计单个字符出现次数
public static int countChar(String s, char target) {
    if (s == null || s.isEmpty()) {
        return 0;
    }
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == target) {
            count++;
        }
    }
    return count;
}

// 进阶：统计每个字符各自出现的次数
public static java.util.Map<Character, Integer> countAll(String s) {
    java.util.Map<Character, Integer> map = new java.util.HashMap<>();
    if (s == null) return map;
    for (char c : s.toCharArray()) {
        map.put(c, map.getOrDefault(c, 0) + 1);
    }
    return map;
}

public static void main(String[] args) {
    System.out.println(countChar("banana", 'a')); // 3
    System.out.println(countAll("banana"));        // {b=1, a=3, n=2}
}`,
      tags: ["遍历", "字符统计", "HashMap"],
    },
  ],
};

export default category;
