import type { ExerciseCategory } from "./types";

const category: ExerciseCategory = {
  key: "oop",
  name: "面向对象",
  problems: [
    {
      title: "编写 Student 类（构造器与 this）",
      difficulty: "简单",
      question:
        "请编写一个 Student 类，包含两个属性 name（String）和 age（int），一个带参构造器用于初始化这两个属性，以及一个 introduce 方法打印自我介绍。在构造器里用 this 区分「成员变量」和「同名参数」。然后在 main 中创建对象并调用。",
      hint: "当构造器参数名和成员变量同名时，this.name 表示成员变量，name 表示参数。",
      answer:
        "类是对象的模板，对象是类的实例。构造器用于在 new 对象时初始化属性，它的名字必须和类名相同、没有返回值类型。\n当构造器形参与成员变量同名时（都叫 name、age），方法体内直接写 name 指的是「就近的」参数，要用 this.name 才能访问当前对象的成员变量，因此用 this.name = name; 完成赋值。\nthis 代表「当前对象」的引用。",
      answerCode: `public class Student {
    private String name;
    private int age;

    // 带参构造器
    public Student(String name, int age) {
        this.name = name; // this.name 是成员变量，name 是参数
        this.age = age;
    }

    public void introduce() {
        System.out.println("我叫" + name + "，今年" + age + "岁");
    }

    public static void main(String[] args) {
        Student s = new Student("小明", 18);
        s.introduce(); // 我叫小明，今年18岁
    }
}`,
      tags: ["类与对象", "构造器", "this"],
    },
    {
      title: "找错：直接访问 private 字段",
      difficulty: "简单",
      question:
        "下面代码想要设置和读取账户余额，但编译不通过。请说明封装的概念、错误原因，并用 getter/setter 改正（setter 中加一个余额不能为负的校验）。",
      code: `public class Account {
    private double balance;
}

public class Test {
    public static void main(String[] args) {
        Account acc = new Account();
        acc.balance = 100;              // 编译错误
        System.out.println(acc.balance); // 编译错误
    }
}`,
      hint: "private 成员只能在本类内部访问。封装就是「隐藏字段、通过公开方法访问」。",
      answer:
        "封装：把对象的属性私有化（private），不让外部直接访问，只通过公开的方法（getter/setter）来读写，这样可以在方法里加校验、保护数据的合法性。\n错误原因：balance 被声明为 private，只能在 Account 类内部访问，Test 类中用 acc.balance 直接读写会编译报错（balance has private access）。\n改正：为 balance 提供公开的 getBalance / setBalance 方法，并在 setBalance 中校验余额不能为负，外部改为调用这两个方法。",
      answerCode: `public class Account {
    private double balance;

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        if (balance < 0) {
            System.out.println("余额不能为负");
            return;
        }
        this.balance = balance;
    }
}

class Test {
    public static void main(String[] args) {
        Account acc = new Account();
        acc.setBalance(100);                  // 通过 setter 设置
        System.out.println(acc.getBalance()); // 通过 getter 读取：100.0
    }
}`,
      tags: ["封装", "private", "getter/setter"],
    },
    {
      title: "继承与 super：构造调用顺序",
      difficulty: "中等",
      question: "阅读下面代码，写出 new Dog() 时的输出，并解释父子类构造器的调用顺序。",
      code: `class Animal {
    public Animal() {
        System.out.println("Animal 构造器");
    }
}

class Dog extends Animal {
    public Dog() {
        System.out.println("Dog 构造器");
    }
}

public class Demo {
    public static void main(String[] args) {
        new Dog();
    }
}`,
      hint: "子类构造器第一行有一个隐式的 super()，会先调用父类构造器。",
      answer:
        "输出：\nAnimal 构造器\nDog 构造器\n\n原因：创建子类对象时，必须先初始化继承自父类的部分。子类构造器的第一行如果没有显式写 super(...) 或 this(...)，编译器会自动加上一个隐式的 super()，去调用父类的无参构造器。所以执行 new Dog() 时，先进入 Dog 构造器，第一行隐式 super() 先把父类 Animal 构造器执行完（打印「Animal 构造器」），再继续执行 Dog 构造器剩余部分（打印「Dog 构造器」）。\n结论：构造顺序是「先父后子」。",
      tags: ["继承", "super", "构造顺序"],
    },
    {
      title: "多态：父类引用调用重写方法",
      difficulty: "中等",
      question:
        "阅读下面代码，写出输出，并解释为什么父类引用 a 调用的是子类 Cat 的 sound 方法（运行时多态/动态绑定）。",
      code: `class Animal {
    public void sound() {
        System.out.println("动物在叫");
    }
}

class Cat extends Animal {
    @Override
    public void sound() {
        System.out.println("喵喵");
    }
}

public class Demo {
    public static void main(String[] args) {
        Animal a = new Cat(); // 父类引用指向子类对象
        a.sound();
    }
}`,
      hint: "成员方法的调用看的是「实际创建的对象类型」，而不是引用的声明类型。",
      answer:
        "输出：\n喵喵\n\n这是多态（运行时多态）。a 的「编译类型/声明类型」是 Animal，但它实际指向的对象是 Cat。对于被重写（@Override）的成员方法，Java 在运行时根据「对象的真实类型」来决定调用哪个版本，这叫动态绑定。Cat 重写了 sound，所以 a.sound() 实际执行的是 Cat 的版本，输出「喵喵」。\n注意：通过父类引用 a 只能调用 Animal 中声明过的方法；如果 Cat 有 Animal 没有的方法，需要先向下转型 ((Cat) a).方法() 才能调用。",
      tags: ["多态", "方法重写", "动态绑定"],
    },
    {
      title: "抽象类与接口的区别",
      difficulty: "困难",
      question:
        "请比较「抽象类（abstract class）」和「接口（interface）」的主要区别，并说明各自的适用场景。",
      hint: "从继承数量、成员能放什么、设计语义（is-a vs has-a / can-do）几个角度对比。",
      answer:
        "主要区别（以现代 Java 为准）：\n1) 继承数量：一个类只能 extends 一个抽象类（单继承），但可以 implements 多个接口（多实现）。\n2) 构造器：抽象类可以有构造器（供子类 super 调用初始化字段），接口没有构造器、不能直接实例化。\n3) 成员变量：抽象类可有普通成员变量（各种访问修饰符）；接口里的「字段」默认且只能是 public static final 常量。\n4) 方法：抽象类既可有抽象方法、也可有普通（已实现）方法；接口的方法默认是 public abstract，从 Java 8 起接口还可以有 default 方法和 static 方法、Java 9 起可有 private 方法。\n5) 设计语义：抽象类表达「is-a」（是一种……）的强继承关系，用于在一组关系紧密、有共同状态和行为的类之间抽取公共部分；接口表达「can-do」的能力/契约（如 Comparable 可比较、Runnable 可运行），适合给不相关的类赋予某种能力，强调「多继承能力」与解耦。\n选择原则：需要共享字段与部分实现、表达紧密的父子关系时用抽象类；只需定义一组行为规范、且希望被多种不同类型实现时用接口。",
      tags: ["抽象类", "接口", "面向对象设计"],
    },
  ],
};

export default category;
