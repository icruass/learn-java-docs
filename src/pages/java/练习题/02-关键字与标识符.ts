import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "keywords",
  name: "关键字与标识符",
  problems: [
    {
      title: "判断合法标识符",
      difficulty: "中等",
      question:
        "下列名字中，哪些是合法的 Java 标识符，哪些不合法？请逐个判断并说明理由：\n_abc、2name、int、$money、user-name",
      hint: "标识符只能由字母、数字、下划线 _ 和美元符号 $ 组成，且不能以数字开头，不能是关键字。",
      answer:
        "Java 标识符规则：只能由字母、数字、下划线 _、美元符号 $ 组成；不能以数字开头；不能是关键字或保留字；区分大小写。逐个判断：\n- _abc：合法。以下划线开头是允许的，全部由合法字符组成。\n- 2name：不合法。以数字开头，违反「不能以数字开头」规则。\n- int：不合法。int 是关键字，不能作为标识符。\n- $money：合法。以 $ 开头是允许的（虽然实践中 $ 通常留给编译器/工具生成的名字，不建议手写）。\n- user-name：不合法。包含连字符 -，- 不是合法的标识符字符（这里会被当作减法运算符）。",
      tags: ["标识符", "命名规则"],
    },
    {
      title: "标识符命名规则简答",
      difficulty: "简单",
      question:
        "回答以下关于标识符命名规则的问题：\n(1) 标识符能不能以数字开头？\n(2) 能不能直接使用关键字（如 class、for）作为变量名？\n(3) 下划线 _ 和美元符号 $ 能否出现在标识符中？能否作为开头？",
      answer:
        "(1) 不能以数字开头。标识符必须以字母、下划线 _ 或美元符号 $ 开头，数字只能出现在非首位。\n(2) 不能。关键字（如 class、for、int、public）是 Java 语言保留的，不能用作标识符。\n(3) 下划线 _ 和美元符号 $ 都是合法的标识符字符，既可以出现在中间，也可以作为开头（如 _name、$value 都合法）。补充：单独一个下划线 _ 从 Java 9 起被保留，不能单独作为标识符使用。",
      tags: ["标识符", "命名规则"],
    },
    {
      title: "关键字与字面量的概念",
      difficulty: "简单",
      question:
        "关于 Java 关键字，下面的说法是否正确？请判断并说明理由：\n(1) 所有关键字都是全小写的。\n(2) true、false、null 都是关键字。",
      answer:
        "(1) 正确。Java 的关键字全部由小写字母组成，例如 public、static、class、if、for、int 等，没有任何大写字母。所以 Public、INT 这种写法不是关键字。\n(2) 不正确。true 和 false 是布尔字面量（boolean literal），null 是空引用字面量（null literal），它们都属于「字面量/常量值」而不是关键字。不过它们和关键字一样是保留的，同样不能用作标识符。",
      tags: ["关键字", "字面量"],
    },
    {
      title: "驼峰命名规范改错",
      difficulty: "中等",
      question:
        "下面这段代码能编译通过，但命名不符合 Java 的驼峰命名规范（约定俗成的代码风格）。请指出哪些命名不规范，并按规范改写。",
      code: `public class student_info {
    int StudentAge;
    public void Get_name() {
        int user_name = 0;
    }
}`,
      hint: "类名用大驼峰（每个单词首字母大写），变量名和方法名用小驼峰（首字母小写，后续单词首字母大写）。",
      answer:
        "Java 命名约定：类名使用大驼峰（UpperCamelCase，每个单词首字母大写）；变量名、方法名使用小驼峰（lowerCamelCase，第一个单词首字母小写，其余单词首字母大写）；一般不使用下划线连接单词（常量除外，常量用全大写加下划线）。逐项问题：\n- 类名 student_info：应改为大驼峰 StudentInfo。\n- 字段 StudentAge：变量名应是小驼峰，首字母应小写，改为 studentAge。\n- 方法名 Get_name：方法名应是小驼峰且不用下划线，改为 getName。\n- 局部变量 user_name：改为小驼峰 userName。",
      answerCode: `public class StudentInfo {
    int studentAge;
    public void getName() {
        int userName = 0;
    }
}`,
      tags: ["命名规范", "驼峰命名"],
    },
    {
      title: "常见关键字的分类",
      difficulty: "困难",
      question:
        "Java 的关键字按用途可以分成若干类。请为下列每一类各举出 2 个关键字：\n(1) 定义基本数据类型的关键字\n(2) 定义访问权限（修饰符）的关键字\n(3) 用于流程控制的关键字\n(4) 用于定义类、接口、继承关系的关键字",
      answer:
        "参考答案（每类举例，不唯一）：\n(1) 基本数据类型：int、double（还有 byte、short、long、float、char、boolean）。\n(2) 访问权限/修饰符：public、private（还有 protected；以及非访问修饰符 static、final、abstract 等）。\n(3) 流程控制：if、for（还有 else、while、do、switch、case、break、continue、return）。\n(4) 类/接口/继承：class、interface（还有 extends 继承、implements 实现、new 创建对象）。\n说明：这些都是全小写的关键字，是 Java 语言保留的，不能作为标识符使用。",
      tags: ["关键字", "分类"],
    },
  ],
};

export default category;
