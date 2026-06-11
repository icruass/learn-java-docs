// ⚠️ 此文件由脚本自动生成，请勿手动修改。
// 数据源：src/pages/java/ 目录结构（可由各页面/文件夹的 export const route 覆盖）
// 重新生成：node src/routes/scripts/java.mjs（或 node src/routes/scripts/index.mjs 一键生成全部）

export default [
  {
    path: "/java",
    name: "Java",
    icon: "☕",
    routes: [
      {
        path: "/java/01",
        name: "入门基础",
        routes: [
          {
            path: "/java/01/01",
            name: "Java语言发展史",
            component: "@/pages/java/01-入门基础/01-Java语言发展史",
          },
          {
            path: "/java/01/02",
            name: "HelloWorld",
            component: "@/pages/java/01-入门基础/02-HelloWorld",
          },
          {
            path: "/java/01/03",
            name: "注释",
            component: "@/pages/java/01-入门基础/03-注释",
          },
        ],
      },
      {
        path: "/java/02",
        name: "关键字与标识符",
        routes: [
          {
            path: "/java/02/01",
            name: "关键字",
            component: "@/pages/java/02-关键字与标识符/01-关键字",
          },
          {
            path: "/java/02/02",
            name: "标识符",
            component: "@/pages/java/02-关键字与标识符/02-标识符",
          },
        ],
      },
      {
        path: "/java/03",
        name: "常量",
        routes: [
          {
            path: "/java/03/01",
            name: "常量的概念与分类",
            component: "@/pages/java/03-常量/01-常量的概念与分类",
          },
          {
            path: "/java/03/02",
            name: "常量的打印输出",
            component: "@/pages/java/03-常量/02-常量的打印输出",
          },
        ],
      },
      {
        path: "/java/04",
        name: "基本数据类型与变量",
        routes: [
          {
            path: "/java/04/01",
            name: "基本数据类型",
            component: "@/pages/java/04-基本数据类型与变量/01-基本数据类型",
          },
          {
            path: "/java/04/02",
            name: "变量",
            component: "@/pages/java/04-基本数据类型与变量/02-变量",
          },
        ],
      },
      {
        path: "/java/05",
        name: "数据类型转换",
        routes: [
          {
            path: "/java/05/01",
            name: "自动类型转换",
            component: "@/pages/java/05-数据类型转换/01-自动类型转换",
          },
          {
            path: "/java/05/02",
            name: "强制类型转换",
            component: "@/pages/java/05-数据类型转换/02-强制类型转换",
          },
          {
            path: "/java/05/03",
            name: "类型转换注意事项",
            component: "@/pages/java/05-数据类型转换/03-类型转换注意事项",
          },
          {
            path: "/java/05/04",
            name: "ASCII编码表",
            component: "@/pages/java/05-数据类型转换/04-ASCII编码表",
          },
        ],
      },
      {
        path: "/java/06",
        name: "运算符",
        routes: [
          {
            path: "/java/06/01",
            name: "算术运算符",
            component: "@/pages/java/06-运算符/01-算术运算符",
          },
          {
            path: "/java/06/02",
            name: "赋值运算符",
            component: "@/pages/java/06-运算符/02-赋值运算符",
          },
          {
            path: "/java/06/03",
            name: "比较运算符",
            component: "@/pages/java/06-运算符/03-比较运算符",
          },
          {
            path: "/java/06/04",
            name: "逻辑运算符",
            component: "@/pages/java/06-运算符/04-逻辑运算符",
          },
          {
            path: "/java/06/05",
            name: "三元运算符",
            component: "@/pages/java/06-运算符/05-三元运算符",
          },
        ],
      },
      {
        path: "/java/07",
        name: "方法入门",
        routes: [
          {
            path: "/java/07/01",
            name: "方法的定义与调用",
            component: "@/pages/java/07-方法入门/01-方法的定义与调用",
          },
          {
            path: "/java/07/02",
            name: "JShell与编译器优化",
            component: "@/pages/java/07-方法入门/02-JShell与编译器优化",
          },
        ],
      },
      {
        path: "/java/08",
        name: "流程控制 选择结构",
        routes: [
          {
            path: "/java/08/01",
            name: "顺序结构",
            component: "@/pages/java/08-流程控制_选择结构/01-顺序结构",
          },
          {
            path: "/java/08/02",
            name: "if选择结构",
            component: "@/pages/java/08-流程控制_选择结构/02-if选择结构",
          },
          {
            path: "/java/08/03",
            name: "switch选择结构",
            component: "@/pages/java/08-流程控制_选择结构/03-switch选择结构",
          },
        ],
      },
      {
        path: "/java/09",
        name: "流程控制 循环结构",
        routes: [
          {
            path: "/java/09/01",
            name: "for循环",
            component: "@/pages/java/09-流程控制_循环结构/01-for循环",
          },
          {
            path: "/java/09/02",
            name: "while循环",
            component: "@/pages/java/09-流程控制_循环结构/02-while循环",
          },
          {
            path: "/java/09/03",
            name: "dowhile循环",
            component: "@/pages/java/09-流程控制_循环结构/03-dowhile循环",
          },
          {
            path: "/java/09/04",
            name: "三种循环的区别",
            component: "@/pages/java/09-流程控制_循环结构/04-三种循环的区别",
          },
          {
            path: "/java/09/05",
            name: "break与continue",
            component: "@/pages/java/09-流程控制_循环结构/05-break与continue",
          },
          {
            path: "/java/09/06",
            name: "死循环与循环嵌套",
            component: "@/pages/java/09-流程控制_循环结构/06-死循环与循环嵌套",
          },
        ],
      },
      {
        path: "/java/10",
        name: "IDE开发工具",
        routes: [
          {
            path: "/java/10/01",
            name: "IntelliJ IDEA使用说明",
            component: "@/pages/java/10-IDE开发工具/01-IntelliJ_IDEA使用说明",
          },
        ],
      },
      {
        path: "/java/11",
        name: "方法",
        routes: [
          {
            path: "/java/11/01",
            name: "方法的定义格式",
            component: "@/pages/java/11-方法/01-方法的定义格式",
          },
          {
            path: "/java/11/02",
            name: "方法的三种调用格式",
            component: "@/pages/java/11-方法/02-方法的三种调用格式",
          },
          {
            path: "/java/11/03",
            name: "方法练习",
            component: "@/pages/java/11-方法/03-方法练习",
          },
          {
            path: "/java/11/04",
            name: "方法的注意事项",
            component: "@/pages/java/11-方法/04-方法的注意事项",
          },
          {
            path: "/java/11/05",
            name: "方法重载",
            component: "@/pages/java/11-方法/05-方法重载",
          },
        ],
      },
      {
        path: "/java/12",
        name: "数组",
        routes: [
          {
            path: "/java/12/01",
            name: "数组的定义与初始化",
            component: "@/pages/java/12-数组/01-数组的定义与初始化",
          },
          {
            path: "/java/12/02",
            name: "数组元素的访问",
            component: "@/pages/java/12-数组/02-数组元素的访问",
          },
          {
            path: "/java/12/03",
            name: "Java内存划分与数组内存图",
            component: "@/pages/java/12-数组/03-Java内存划分与数组内存图",
          },
          {
            path: "/java/12/04",
            name: "数组常见问题",
            component: "@/pages/java/12-数组/04-数组常见问题",
          },
          {
            path: "/java/12/05",
            name: "数组的常见操作",
            component: "@/pages/java/12-数组/05-数组的常见操作",
          },
          {
            path: "/java/12/06",
            name: "数组与方法",
            component: "@/pages/java/12-数组/06-数组与方法",
          },
        ],
      },
      {
        path: "/java/13",
        name: "面向对象 类与对象",
        routes: [
          {
            path: "/java/13/01",
            name: "面向对象思想",
            component: "@/pages/java/13-面向对象_类与对象/01-面向对象思想",
          },
          {
            path: "/java/13/02",
            name: "类的定义与对象使用",
            component: "@/pages/java/13-面向对象_类与对象/02-类的定义与对象使用",
          },
          {
            path: "/java/13/03",
            name: "对象的内存图",
            component: "@/pages/java/13-面向对象_类与对象/03-对象的内存图",
          },
          {
            path: "/java/13/04",
            name: "对象作为方法参数和返回值",
            component: "@/pages/java/13-面向对象_类与对象/04-对象作为方法参数和返回值",
          },
          {
            path: "/java/13/05",
            name: "成员变量和局部变量的区别",
            component: "@/pages/java/13-面向对象_类与对象/05-成员变量和局部变量的区别",
          },
        ],
      },
      {
        path: "/java/14",
        name: "面向对象 封装与构造",
        routes: [
          {
            path: "/java/14/01",
            name: "封装与private",
            component: "@/pages/java/14-面向对象_封装与构造/01-封装与private",
          },
          {
            path: "/java/14/02",
            name: "this关键字",
            component: "@/pages/java/14-面向对象_封装与构造/02-this关键字",
          },
          {
            path: "/java/14/03",
            name: "构造方法",
            component: "@/pages/java/14-面向对象_封装与构造/03-构造方法",
          },
          {
            path: "/java/14/04",
            name: "定义一个标准的类",
            component: "@/pages/java/14-面向对象_封装与构造/04-定义一个标准的类",
          },
        ],
      },
      {
        path: "/java/15",
        name: "常用类 Scanner 匿名对象 Random",
        routes: [
          {
            path: "/java/15/01",
            name: "API概述",
            component: "@/pages/java/15-常用类_Scanner_匿名对象_Random/01-API概述",
          },
          {
            path: "/java/15/02",
            name: "Scanner键盘输入",
            component: "@/pages/java/15-常用类_Scanner_匿名对象_Random/02-Scanner键盘输入",
          },
          {
            path: "/java/15/03",
            name: "匿名对象",
            component: "@/pages/java/15-常用类_Scanner_匿名对象_Random/03-匿名对象",
          },
          {
            path: "/java/15/04",
            name: "Random随机数",
            component: "@/pages/java/15-常用类_Scanner_匿名对象_Random/04-Random随机数",
          },
        ],
      },
      {
        path: "/java/16",
        name: "集合 对象数组与ArrayList",
        routes: [
          {
            path: "/java/16/01",
            name: "对象数组",
            component: "@/pages/java/16-集合_对象数组与ArrayList/01-对象数组",
          },
          {
            path: "/java/16/02",
            name: "ArrayList基本使用",
            component: "@/pages/java/16-集合_对象数组与ArrayList/02-ArrayList基本使用",
          },
          {
            path: "/java/16/03",
            name: "ArrayList练习",
            component: "@/pages/java/16-集合_对象数组与ArrayList/03-ArrayList练习",
          },
        ],
      },
      {
        path: "/java/17",
        name: "字符串String",
        routes: [
          {
            path: "/java/17/01",
            name: "字符串的创建与特点",
            component: "@/pages/java/17-字符串String/01-字符串的创建与特点",
          },
          {
            path: "/java/17/02",
            name: "字符串的比较",
            component: "@/pages/java/17-字符串String/02-字符串的比较",
          },
          {
            path: "/java/17/03",
            name: "字符串的常用方法",
            component: "@/pages/java/17-字符串String/03-字符串的常用方法",
          },
          {
            path: "/java/17/04",
            name: "字符串练习",
            component: "@/pages/java/17-字符串String/04-字符串练习",
          },
        ],
      },
      {
        path: "/java/18",
        name: "static静态",
        routes: [
          {
            path: "/java/18/01",
            name: "static修饰成员",
            component: "@/pages/java/18-static静态/01-static修饰成员",
          },
          {
            path: "/java/18/02",
            name: "静态代码块",
            component: "@/pages/java/18-static静态/02-静态代码块",
          },
        ],
      },
      {
        path: "/java/19",
        name: "常用工具类 Arrays与Math",
        routes: [
          {
            path: "/java/19/01",
            name: "Arrays工具类",
            component: "@/pages/java/19-常用工具类_Arrays与Math/01-Arrays工具类",
          },
          {
            path: "/java/19/02",
            name: "Math工具类",
            component: "@/pages/java/19-常用工具类_Arrays与Math/02-Math工具类",
          },
        ],
      },
      {
        path: "/java/20",
        name: "继承",
        routes: [
          {
            path: "/java/20/01",
            name: "继承的概述与格式",
            component: "@/pages/java/20-继承/01-继承的概述与格式",
          },
          {
            path: "/java/20/02",
            name: "成员变量与方法的访问特点",
            component: "@/pages/java/20-继承/02-成员变量与方法的访问特点",
          },
          {
            path: "/java/20/03",
            name: "方法的覆盖重写",
            component: "@/pages/java/20-继承/03-方法的覆盖重写",
          },
          {
            path: "/java/20/04",
            name: "构造方法的访问特点",
            component: "@/pages/java/20-继承/04-构造方法的访问特点",
          },
          {
            path: "/java/20/05",
            name: "super与this三种用法",
            component: "@/pages/java/20-继承/05-super与this三种用法",
          },
        ],
      },
      {
        path: "/java/21",
        name: "抽象类",
        routes: [
          {
            path: "/java/21/01",
            name: "抽象类的定义与使用",
            component: "@/pages/java/21-抽象类/01-抽象类的定义与使用",
          },
          {
            path: "/java/21/02",
            name: "抽象类注意事项",
            component: "@/pages/java/21-抽象类/02-抽象类注意事项",
          },
          {
            path: "/java/21/03",
            name: "发红包案例",
            component: "@/pages/java/21-抽象类/03-发红包案例",
          },
        ],
      },
      {
        path: "/java/22",
        name: "接口",
        routes: [
          {
            path: "/java/22/01",
            name: "接口的定义与抽象方法",
            component: "@/pages/java/22-接口/01-接口的定义与抽象方法",
          },
          {
            path: "/java/22/02",
            name: "接口的默认方法",
            component: "@/pages/java/22-接口/02-接口的默认方法",
          },
          {
            path: "/java/22/03",
            name: "接口的静态方法",
            component: "@/pages/java/22-接口/03-接口的静态方法",
          },
          {
            path: "/java/22/04",
            name: "接口的私有方法",
            component: "@/pages/java/22-接口/04-接口的私有方法",
          },
          {
            path: "/java/22/05",
            name: "接口的常量",
            component: "@/pages/java/22-接口/05-接口的常量",
          },
          {
            path: "/java/22/06",
            name: "接口小结与多实现多继承",
            component: "@/pages/java/22-接口/06-接口小结与多实现多继承",
          },
        ],
      },
      {
        path: "/java/23",
        name: "多态",
        routes: [
          {
            path: "/java/23/01",
            name: "多态的格式与使用",
            component: "@/pages/java/23-多态/01-多态的格式与使用",
          },
          {
            path: "/java/23/02",
            name: "多态中成员的访问特点",
            component: "@/pages/java/23-多态/02-多态中成员的访问特点",
          },
          {
            path: "/java/23/03",
            name: "多态的好处与转型",
            component: "@/pages/java/23-多态/03-多态的好处与转型",
          },
        ],
      },
      {
        path: "/java/24",
        name: "final与权限修饰符",
        routes: [
          {
            path: "/java/24/01",
            name: "final关键字",
            component: "@/pages/java/24-final与权限修饰符/01-final关键字",
          },
          {
            path: "/java/24/02",
            name: "四种权限修饰符",
            component: "@/pages/java/24-final与权限修饰符/02-四种权限修饰符",
          },
        ],
      },
      {
        path: "/java/25",
        name: "内部类",
        routes: [
          {
            path: "/java/25/01",
            name: "成员内部类",
            component: "@/pages/java/25-内部类/01-成员内部类",
          },
          {
            path: "/java/25/02",
            name: "局部内部类",
            component: "@/pages/java/25-内部类/02-局部内部类",
          },
          {
            path: "/java/25/03",
            name: "匿名内部类",
            component: "@/pages/java/25-内部类/03-匿名内部类",
          },
          {
            path: "/java/25/04",
            name: "类和接口作为成员与参数",
            component: "@/pages/java/25-内部类/04-类和接口作为成员与参数",
          },
        ],
      },
      {
        path: "/java/26",
        name: "Java的数据结构",
        routes: [
          {
            path: "/java/26/01",
            name: "数据结构概述",
            component: "@/pages/java/26-Java的数据结构/01-数据结构概述",
          },
          {
            path: "/java/26/02",
            name: "数组结构",
            component: "@/pages/java/26-Java的数据结构/02-数组结构",
          },
          {
            path: "/java/26/03",
            name: "链表结构",
            component: "@/pages/java/26-Java的数据结构/03-链表结构",
          },
          {
            path: "/java/26/04",
            name: "栈结构",
            component: "@/pages/java/26-Java的数据结构/04-栈结构",
          },
          {
            path: "/java/26/05",
            name: "队列结构",
            component: "@/pages/java/26-Java的数据结构/05-队列结构",
          },
          {
            path: "/java/26/06",
            name: "树与二叉树",
            component: "@/pages/java/26-Java的数据结构/06-树与二叉树",
          },
          {
            path: "/java/26/07",
            name: "二叉查找树",
            component: "@/pages/java/26-Java的数据结构/07-二叉查找树",
          },
          {
            path: "/java/26/08",
            name: "平衡二叉树与红黑树",
            component: "@/pages/java/26-Java的数据结构/08-平衡二叉树与红黑树",
          },
          {
            path: "/java/26/09",
            name: "哈希表",
            component: "@/pages/java/26-Java的数据结构/09-哈希表",
          },
          {
            path: "/java/26/10",
            name: "堆与优先队列",
            component: "@/pages/java/26-Java的数据结构/10-堆与优先队列",
          },
        ],
      },
      {
        path: "/java/27",
        name: "Java的Collection集合类",
        routes: [
          {
            path: "/java/27/01",
            name: "集合框架概述",
            component: "@/pages/java/27-Java的Collection集合类/01-集合框架概述",
          },
          {
            path: "/java/27/04",
            name: "List接口与ArrayList",
            component: "@/pages/java/27-Java的Collection集合类/04-List接口与ArrayList",
          },
          {
            path: "/java/27/06",
            name: "Set接口与HashSet",
            component: "@/pages/java/27-Java的Collection集合类/06-Set接口与HashSet",
          },
          {
            path: "/java/27/08",
            name: "Map接口与HashMap",
            component: "@/pages/java/27-Java的Collection集合类/08-Map接口与HashMap",
          },
        ],
      },
    ],
  },
];
