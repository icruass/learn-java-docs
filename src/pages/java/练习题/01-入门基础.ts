import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "basics",
  name: "入门基础",
  problems: [
    {
      title: "JDK、JRE、JVM 的区别",
      difficulty: "简单",
      question:
        "请简要说明 JDK、JRE、JVM 三者分别是什么，它们之间是怎样的包含关系？如果只想运行别人写好的 Java 程序（不开发），最少需要装哪一个？",
      answer:
        "JVM（Java Virtual Machine，Java 虚拟机）：真正运行 Java 字节码（.class）的核心，负责把字节码翻译成各平台的机器指令，是 Java「一次编写、到处运行」的关键。\nJRE（Java Runtime Environment，Java 运行环境）：JVM + 运行时所需的核心类库（如 java.lang 等），是运行 Java 程序的最小环境。\nJDK（Java Development Kit，Java 开发工具包）：JRE + 开发工具（如编译器 javac、打包工具 jar、文档工具 javadoc 等），用于开发 Java 程序。\n包含关系：JDK ⊃ JRE ⊃ JVM。\n如果只运行不开发，理论上装 JRE 即可；不过从 JDK 9 起 Oracle 不再单独提供 JRE 安装包，实际开发与学习阶段直接安装 JDK 最省事。",
      tags: ["JDK", "JRE", "JVM"],
    },
    {
      title: "编写第一个 HelloWorld 程序",
      difficulty: "简单",
      question:
        "请编写一个名为 HelloWorld 的类，在 main 方法中向控制台打印一行「Hello, World!」。要求写出标准的 main 方法签名，并说明这个文件应该叫什么名字。",
      hint: "public 类的类名必须和源文件名完全一致（区分大小写）。main 方法是程序入口，签名是固定的。",
      answer:
        "源文件必须命名为 HelloWorld.java（与 public 类名完全一致，包括大小写）。\nmain 方法的标准签名是：public static void main(String[] args)，它是 JVM 启动程序时调用的入口方法，缺一不可：\n- public：JVM 在类外部调用，必须公开；\n- static：JVM 无需创建对象即可调用；\n- void：main 不返回值；\n- String[] args：接收命令行参数。\n使用 System.out.println(...) 打印并自动换行。",
      answerCode: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      tags: ["HelloWorld", "main方法"],
    },
    {
      title: "找出 HelloWorld 中的三处错误",
      difficulty: "中等",
      question:
        "下面这段代码保存在文件 Hello.java 中，编译运行时报错。请找出代码中的 3 处错误并说明如何改正。",
      code: `public class HelloWorld {
    public static void mian(String[] args) {
        System.out.println("Hello, World!")
    }
}`,
      answer:
        "三处错误：\n1. 类名与文件名不符：public 类名为 HelloWorld，但文件名是 Hello.java。public 类的类名必须与文件名完全一致，应把文件改名为 HelloWorld.java（或把类名改为 Hello）。\n2. main 方法拼写错误：mian 应为 main。拼错后 JVM 找不到入口方法，运行时会报「找不到主方法」。\n3. 语句缺少分号：println(...) 这一行结尾缺少分号 ;，Java 每条语句必须以分号结束，否则编译报错。\n改正后即可正常编译运行。",
      answerCode: `// 文件名：HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      tags: ["找错", "main方法", "语法"],
    },
    {
      title: "javac 与 java 命令的作用",
      difficulty: "简单",
      question:
        "假设有源文件 HelloWorld.java，请说明用命令行手动编译并运行它需要哪两条命令，它们各自的作用是什么？编译会生成什么文件？",
      hint: "一条负责「编译」，一条负责「运行」。注意 java 命令后面跟的是什么。",
      answer:
        "完整流程分两步：\n1. 编译：javac HelloWorld.java —— javac 是 Java 编译器，把源代码 .java 编译成 JVM 能识别的字节码文件 HelloWorld.class。\n2. 运行：java HelloWorld —— java 命令启动 JVM 并运行指定的类。注意这里写的是「类名」HelloWorld，不带 .class 后缀，也不要写成 HelloWorld.class。\n概括：源码(.java) --javac编译--> 字节码(.class) --java运行(JVM)--> 程序输出。",
      answerCode: `javac HelloWorld.java   # 编译，生成 HelloWorld.class
java HelloWorld         # 运行（类名，不带 .class）`,
      tags: ["javac", "java命令", "编译运行"],
    },
    {
      title: "三种注释的区别与代码输出",
      difficulty: "中等",
      question:
        "Java 有哪三种注释？它们各自的写法和用途是什么？阅读下面的代码，写出程序运行后控制台的输出。",
      code: `public class CommentDemo {
    public static void main(String[] args) {
        // System.out.println("A");
        System.out.println("B"); /* 打印 B */
        /*
        System.out.println("C");
        */
        System.out.println("D"); /** 文档注释也是注释 */
    }
}`,
      answer:
        "三种注释：\n1. 单行注释 //：从 // 到本行结尾都是注释，常用于解释单行代码。\n2. 多行注释 /* ... */：可跨越多行，注释内的所有内容都被忽略，注意不能嵌套。\n3. 文档注释 /** ... */：写在类、方法、字段之前，可由 javadoc 工具提取生成 API 文档，本质上运行时也被当作注释忽略。\n\n注释中的代码不会被执行，所以：\n- 第一行 println(\"A\") 被 // 注释，不输出；\n- println(\"B\") 正常执行，行尾的 /* 打印 B */ 是注释；\n- println(\"C\") 被 /* */ 包裹，不输出；\n- println(\"D\") 正常执行。\n\n因此输出为：\nB\nD",
      tags: ["注释", "输出预测"],
    },
  ],
};

export default category;
