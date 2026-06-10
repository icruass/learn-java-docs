import type { DocRoute } from "./types";

/**
 * ============================================================================
 * 文档侧边栏 / 路由 树状数据（单一数据源）
 * ============================================================================
 * 这份数组是站点最重要的一块数据：
 *   1. 渲染左侧侧边栏（分组 + 菜单项）
 *   2. 经 `flattenDocRoutes` 转换后，作为 Umi 的二级路由挂在 DocLayout 下
 *
 * 约定：
 *   - 有 `component` 的节点 = 一个真实页面（侧边栏可点击的叶子项）
 *   - 没有 `component` 但有 `routes` 的节点 = 仅作为侧边栏分组标题（不产生路由）
 *
 * 先用几条测试数据把框架跑通，后续直接往这棵树里加节点即可。
 */
export const sqlDocRoutes: DocRoute[] = [
  {
    path: "/mysql",
    name: "MySQL",
    icon: "🐬",
    routes: [
      {
        path: "/mysql/01",
        name: "数据库基本概念",
        routes: [
          {
            path: "/mysql/01/01",
            name: "为什么需要数据库",
            component: "@/pages/mysql/01-数据库基本概念/01-为什么需要数据库",
          },
          {
            path: "/mysql/01/02",
            name: "DB、DBMS、SQL",
            component: "@/pages/mysql/01-数据库基本概念/02-DB-DBMS-SQL",
          },
          {
            path: "/mysql/01/03",
            name: "数据库的层级模型",
            component: "@/pages/mysql/01-数据库基本概念/03-数据库的层级模型",
          },
          {
            path: "/mysql/01/04",
            name: "关系型数据库 RDBMS",
            component: "@/pages/mysql/01-数据库基本概念/04-关系型数据库RDBMS",
          },
          {
            path: "/mysql/01/05",
            name: "非关系型数据库 NoSQL",
            component: "@/pages/mysql/01-数据库基本概念/05-非关系型数据库NoSQL",
          },
          {
            path: "/mysql/01/06",
            name: "关系型与非关系型对比",
            component:
              "@/pages/mysql/01-数据库基本概念/06-关系型与非关系型对比",
          },
          {
            path: "/mysql/01/07",
            name: "常见关系型数据库软件",
            component:
              "@/pages/mysql/01-数据库基本概念/07-常见关系型数据库软件",
          },
          {
            path: "/mysql/01/08",
            name: "常见 NoSQL：Redis 与 MongoDB",
            component:
              "@/pages/mysql/01-数据库基本概念/08-常见NoSQL-Redis与MongoDB",
          },
          {
            path: "/mysql/01/09",
            name: "MySQL 的历史与特点",
            component: "@/pages/mysql/01-数据库基本概念/09-MySQL的历史与特点",
          },
          {
            path: "/mysql/01/10",
            name: "本章小结与面试问答",
            component: "@/pages/mysql/01-数据库基本概念/10-本章小结与面试问答",
          },
        ],
      },
      {
        path: "/mysql/02",
        name: "MySQL安装卸载与服务管理",
        routes: [
          {
            path: "/mysql/02/01",
            name: "本章导读与基本概念",
            component:
              "@/pages/mysql/02-MySQL安装卸载与服务管理/01-本章导读与基本概念",
          },
          {
            path: "/mysql/02/02",
            name: "Windows 安装 MySQL",
            component:
              "@/pages/mysql/02-MySQL安装卸载与服务管理/02-Windows安装MySQL",
          },
          {
            path: "/mysql/02/03",
            name: "安装验证与服务启停",
            component:
              "@/pages/mysql/02-MySQL安装卸载与服务管理/03-安装验证与服务启停",
          },
          {
            path: "/mysql/02/04",
            name: "登录与退出 MySQL",
            component:
              "@/pages/mysql/02-MySQL安装卸载与服务管理/04-登录与退出MySQL",
          },
          {
            path: "/mysql/02/05",
            name: "彻底卸载 MySQL",
            component:
              "@/pages/mysql/02-MySQL安装卸载与服务管理/05-彻底卸载MySQL",
          },
          {
            path: "/mysql/02/06",
            name: "目录结构、配置文件与小结",
            component:
              "@/pages/mysql/02-MySQL安装卸载与服务管理/06-目录结构配置文件与小结",
          },
        ],
      },
      {
        path: "/mysql/03",
        name: "SQL概述与通用语法",
        routes: [
          {
            path: "/mysql/03/01",
            name: "SQL 是什么与标准方言",
            component:
              "@/pages/mysql/03-SQL概述与通用语法/01-SQL是什么与标准方言",
          },
          {
            path: "/mysql/03/02",
            name: "通用语法规则",
            component: "@/pages/mysql/03-SQL概述与通用语法/02-通用语法规则",
          },
          {
            path: "/mysql/03/03",
            name: "三种注释",
            component: "@/pages/mysql/03-SQL概述与通用语法/03-三种注释",
          },
          {
            path: "/mysql/03/04",
            name: "四大分类 DDL / DML / DQL / DCL",
            component:
              "@/pages/mysql/03-SQL概述与通用语法/04-四大分类DDL-DML-DQL-DCL",
          },
          {
            path: "/mysql/03/05",
            name: "本章小结与面试问答",
            component:
              "@/pages/mysql/03-SQL概述与通用语法/05-本章小结与面试问答",
          },
        ],
      },
      {
        path: "/mysql/04",
        name: "DDL-操作数据库",
        routes: [
          {
            path: "/mysql/04/01",
            name: "预备知识与 CREATE DATABASE",
            component:
              "@/pages/mysql/04-DDL-操作数据库/01-预备知识与CREATE-DATABASE",
          },
          {
            path: "/mysql/04/02",
            name: "查询数据库",
            component: "@/pages/mysql/04-DDL-操作数据库/02-查询数据库",
          },
          {
            path: "/mysql/04/03",
            name: "修改、删除与切换数据库",
            component: "@/pages/mysql/04-DDL-操作数据库/03-修改删除切换数据库",
          },
          {
            path: "/mysql/04/04",
            name: "完整演示与本章小结",
            component: "@/pages/mysql/04-DDL-操作数据库/04-完整演示与小结",
          },
        ],
      },
      {
        path: "/mysql/05",
        name: "DDL-操作表与图形化工具",
        routes: [
          {
            path: "/mysql/05/01",
            name: "准备工作与查询表",
            component:
              "@/pages/mysql/05-DDL-操作表与图形化工具/01-准备工作与查询表",
          },
          {
            path: "/mysql/05/02",
            name: "CREATE TABLE 与数据类型",
            component:
              "@/pages/mysql/05-DDL-操作表与图形化工具/02-CREATE-TABLE与数据类型",
          },
          {
            path: "/mysql/05/03",
            name: "修改、删除与复制表",
            component:
              "@/pages/mysql/05-DDL-操作表与图形化工具/03-修改删除复制表",
          },
          {
            path: "/mysql/05/04",
            name: "图形化工具",
            component: "@/pages/mysql/05-DDL-操作表与图形化工具/04-图形化工具",
          },
        ],
      },
      {
        path: "/mysql/06",
        name: "DML-数据增删改",
        routes: [
          {
            path: "/mysql/06/01",
            name: "INSERT 添加数据",
            component: "@/pages/mysql/06-DML-数据增删改/01-INSERT添加数据",
          },
          {
            path: "/mysql/06/02",
            name: "UPDATE 修改数据",
            component: "@/pages/mysql/06-DML-数据增删改/02-UPDATE修改数据",
          },
          {
            path: "/mysql/06/03",
            name: "DELETE、TRUNCATE 与本章小结",
            component:
              "@/pages/mysql/06-DML-数据增删改/03-DELETE删除数据与小结",
          },
        ],
      },
      {
        path: "/mysql/07",
        name: "DQL-基础查询与条件查询",
        routes: [
          {
            path: "/mysql/07/01",
            name: "SELECT 基础语法与基础查询",
            component:
              "@/pages/mysql/07-DQL-基础查询与条件查询/01-SELECT基础语法与基础查询",
          },
          {
            path: "/mysql/07/02",
            name: "去重、计算列与 NULL 处理",
            component:
              "@/pages/mysql/07-DQL-基础查询与条件查询/02-去重计算列与NULL处理",
          },
          {
            path: "/mysql/07/03",
            name: "条件查询 WHERE",
            component:
              "@/pages/mysql/07-DQL-基础查询与条件查询/03-条件查询WHERE",
          },
          {
            path: "/mysql/07/04",
            name: "模糊查询 LIKE 与本章小结",
            component:
              "@/pages/mysql/07-DQL-基础查询与条件查询/04-模糊查询LIKE与小结",
          },
        ],
      },
      {
        path: "/mysql/08",
        name: "DQL-排序-聚合-分组-分页",
        routes: [
          {
            path: "/mysql/08/01",
            name: "排序查询 ORDER BY",
            component:
              "@/pages/mysql/08-DQL-排序-聚合-分组-分页/01-排序查询ORDER-BY",
          },
          {
            path: "/mysql/08/02",
            name: "聚合函数与 NULL 处理",
            component:
              "@/pages/mysql/08-DQL-排序-聚合-分组-分页/02-聚合函数与NULL处理",
          },
          {
            path: "/mysql/08/03",
            name: "分组查询 GROUP BY 与 HAVING",
            component:
              "@/pages/mysql/08-DQL-排序-聚合-分组-分页/03-分组查询GROUP-BY与HAVING",
          },
          {
            path: "/mysql/08/04",
            name: "分页查询 LIMIT 与本章小结",
            component:
              "@/pages/mysql/08-DQL-排序-聚合-分组-分页/04-分页查询LIMIT与小结",
          },
        ],
      },
      {
        path: "/mysql/09",
        name: "约束",
        routes: [
          {
            path: "/mysql/09/01",
            name: "约束概述与非空约束 NOT NULL",
            component: "@/pages/mysql/09-约束/01-约束概述与NOT-NULL",
          },
          {
            path: "/mysql/09/02",
            name: "UNIQUE、主键与自动增长",
            component: "@/pages/mysql/09-约束/02-UNIQUE主键与AUTO-INCREMENT",
          },
          {
            path: "/mysql/09/03",
            name: "外键、级联与本章小结",
            component: "@/pages/mysql/09-约束/03-外键级联与小结",
          },
        ],
      },
      {
        path: "/mysql/10",
        name: "多表关系设计",
        routes: [
          {
            path: "/mysql/10/01",
            name: "多表设计的必要性与一对多",
            component:
              "@/pages/mysql/10-多表关系设计/01-多表设计的必要性与一对多",
          },
          {
            path: "/mysql/10/02",
            name: "多对多与一对一",
            component: "@/pages/mysql/10-多表关系设计/02-多对多与一对一",
          },
          {
            path: "/mysql/10/03",
            name: "综合案例与本章小结",
            component: "@/pages/mysql/10-多表关系设计/03-综合案例与小结",
          },
        ],
      },
      {
        path: "/mysql/11",
        name: "数据库三大范式",
        routes: [
          {
            path: "/mysql/11/01",
            name: "范式概述与核心概念",
            component: "@/pages/mysql/11-数据库三大范式/01-范式概述与核心概念",
          },
          {
            path: "/mysql/11/02",
            name: "第一范式 1NF 与第二范式 2NF",
            component: "@/pages/mysql/11-数据库三大范式/02-1NF与2NF",
          },
          {
            path: "/mysql/11/03",
            name: "第三范式 3NF、反范式与小结",
            component: "@/pages/mysql/11-数据库三大范式/03-3NF反范式与小结",
          },
        ],
      },
      {
        path: "/mysql/12",
        name: "数据库备份与还原",
        routes: [
          {
            path: "/mysql/12/01",
            name: "mysqldump 备份与命令行还原",
            component:
              "@/pages/mysql/12-数据库备份与还原/01-mysqldump备份与还原",
          },
          {
            path: "/mysql/12/02",
            name: "图形化工具与本章小结",
            component: "@/pages/mysql/12-数据库备份与还原/02-图形化工具与小结",
          },
        ],
      },
      {
        path: "/mysql/13",
        name: "多表查询",
        routes: [
          {
            path: "/mysql/13/01",
            name: "笛卡尔积与内连接",
            component: "@/pages/mysql/13-多表查询/01-笛卡尔积与内连接",
          },
          {
            path: "/mysql/13/02",
            name: "外连接与子查询",
            component: "@/pages/mysql/13-多表查询/02-外连接与子查询",
          },
          {
            path: "/mysql/13/03",
            name: "综合练习与本章小结",
            component: "@/pages/mysql/13-多表查询/03-综合练习与小结",
          },
        ],
      },
      {
        path: "/mysql/14",
        name: "事务",
        routes: [
          {
            path: "/mysql/14/01",
            name: "事务基础与 ACID 特性",
            component: "@/pages/mysql/14-事务/01-事务基础与ACID",
          },
          {
            path: "/mysql/14/02",
            name: "并发问题、隔离级别与本章小结",
            component: "@/pages/mysql/14-事务/02-并发隔离级别与小结",
          },
        ],
      },
      {
        path: "/mysql/15",
        name: "DCL-用户与权限管理",
        routes: [
          {
            path: "/mysql/15/01",
            name: "用户管理与密码修改",
            component:
              "@/pages/mysql/15-DCL-用户与权限管理/01-用户管理与密码修改",
          },
          {
            path: "/mysql/15/02",
            name: "权限管理与本章小结",
            component: "@/pages/mysql/15-DCL-用户与权限管理/02-权限管理与小结",
          },
        ],
      },
      {
        path: "/mysql/16",
        name: "JDBC核心详解",
        routes: [
          {
            path: "/mysql/16/01",
            name: "JDBC 介绍与快速入门",
            component: "@/pages/mysql/16-JDBC核心详解/01-JDBC介绍与快速入门",
          },
          {
            path: "/mysql/16/02",
            name: "DriverManager、Connection 与 Statement",
            component:
              "@/pages/mysql/16-JDBC核心详解/02-DriverManager-Connection-Statement",
          },
          {
            path: "/mysql/16/03",
            name: "SQL 注入与 PreparedStatement",
            component:
              "@/pages/mysql/16-JDBC核心详解/03-SQL注入与PreparedStatement",
          },
          {
            path: "/mysql/16/04",
            name: "ResultSet 与 JDBC 工具类",
            component: "@/pages/mysql/16-JDBC核心详解/04-ResultSet与JDBC工具类",
          },
          {
            path: "/mysql/16/05",
            name: "综合实战与本章小结",
            component: "@/pages/mysql/16-JDBC核心详解/05-综合实战与小结",
          },
        ],
      },
      {
        path: "/mysql/17",
        name: "JDBC事务管理",
        routes: [
          {
            path: "/mysql/17/01",
            name: "JDBC 事务控制基础",
            component: "@/pages/mysql/17-JDBC事务管理/01-JDBC事务控制基础",
          },
          {
            path: "/mysql/17/02",
            name: "标准写法、对比验证与本章小结",
            component: "@/pages/mysql/17-JDBC事务管理/02-标准写法对比与小结",
          },
        ],
      },
      {
        path: "/mysql/18",
        name: "数据库连接池",
        routes: [
          {
            path: "/mysql/18/01",
            name: "连接池概念与 DataSource 规范",
            component:
              "@/pages/mysql/18-数据库连接池/01-连接池概念与DataSource规范",
          },
          {
            path: "/mysql/18/02",
            name: "C3P0 与 Druid 使用",
            component: "@/pages/mysql/18-数据库连接池/02-C3P0与Druid使用",
          },
          {
            path: "/mysql/18/03",
            name: "Druid 工具类封装与本章小结",
            component: "@/pages/mysql/18-数据库连接池/03-Druid工具类与小结",
          },
        ],
      },
      {
        path: "/mysql/19",
        name: "JDBCTemplate",
        routes: [
          {
            path: "/mysql/19/01",
            name: "JDBCTemplate 介绍与快速入门",
            component:
              "@/pages/mysql/19-JDBCTemplate/01-JDBCTemplate介绍与快速入门",
          },
          {
            path: "/mysql/19/02",
            name: "DML 与 DQL 查询方法",
            component: "@/pages/mysql/19-JDBCTemplate/02-DML与DQL查询方法",
          },
          {
            path: "/mysql/19/03",
            name: "综合示例与本章小结",
            component: "@/pages/mysql/19-JDBCTemplate/03-综合示例与小结",
          },
        ],
      },
    ],
  },
];

export const javaDocRoutes: DocRoute[] = [
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
            component:
              "@/pages/java/13-面向对象_类与对象/02-类的定义与对象使用",
          },
          {
            path: "/java/13/03",
            name: "对象的内存图",
            component: "@/pages/java/13-面向对象_类与对象/03-对象的内存图",
          },
          {
            path: "/java/13/04",
            name: "对象作为方法参数和返回值",
            component:
              "@/pages/java/13-面向对象_类与对象/04-对象作为方法参数和返回值",
          },
          {
            path: "/java/13/05",
            name: "成员变量和局部变量的区别",
            component:
              "@/pages/java/13-面向对象_类与对象/05-成员变量和局部变量的区别",
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
            component:
              "@/pages/java/14-面向对象_封装与构造/04-定义一个标准的类",
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
            component:
              "@/pages/java/15-常用类_Scanner_匿名对象_Random/01-API概述",
          },
          {
            path: "/java/15/02",
            name: "Scanner键盘输入",
            component:
              "@/pages/java/15-常用类_Scanner_匿名对象_Random/02-Scanner键盘输入",
          },
          {
            path: "/java/15/03",
            name: "匿名对象",
            component:
              "@/pages/java/15-常用类_Scanner_匿名对象_Random/03-匿名对象",
          },
          {
            path: "/java/15/04",
            name: "Random随机数",
            component:
              "@/pages/java/15-常用类_Scanner_匿名对象_Random/04-Random随机数",
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
            component:
              "@/pages/java/16-集合_对象数组与ArrayList/02-ArrayList基本使用",
          },
          {
            path: "/java/16/03",
            name: "ArrayList练习",
            component:
              "@/pages/java/16-集合_对象数组与ArrayList/03-ArrayList练习",
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
            component:
              "@/pages/java/19-常用工具类_Arrays与Math/01-Arrays工具类",
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
    ],
  },
];

export const docRoutes: DocRoute[] = [...javaDocRoutes, ...sqlDocRoutes];

/** 站点默认进入的文档页：始终取菜单树里的「第一个可点击 item」，首页重定向到此处 */
export const DEFAULT_DOC_PATH = flattenDocRoutes(docRoutes)[0]?.path ?? "";

/**
 * 将树状文档数据「拍平」为 Umi 可用的路由数组。
 * 只保留带有 component 的节点（真实页面）；分组节点本身不生成路由，
 * 但其子节点会被递归收集。
 *
 * 注意：此函数在 Node（.umirc.ts 构建期）和浏览器端都可安全运行（纯数据处理）。
 */
export function flattenDocRoutes(routes: DocRoute[]): DocRoute[] {
  const result: DocRoute[] = [];

  const walk = (nodes: DocRoute[]) => {
    nodes.forEach((node) => {
      if (node.component) {
        result.push({
          path: node.path,
          name: node.name,
          component: node.component,
        });
      }
      if (node.routes?.length) {
        walk(node.routes);
      }
    });
  };

  walk(routes);
  return result;
}
