// ⚠️ 此文件由脚本自动生成，请勿手动修改。
// 数据源：src/pages/mysql/ 目录结构（可由各页面/文件夹的 export const route 覆盖）
// 重新生成：node src/routes/scripts/mysql.mjs（或 node src/routes/scripts/index.mjs 一键生成全部）

export default [
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
            name: "DB-DBMS-SQL",
            component: "@/pages/mysql/01-数据库基本概念/02-DB-DBMS-SQL",
          },
          {
            path: "/mysql/01/03",
            name: "数据库的层级模型",
            component: "@/pages/mysql/01-数据库基本概念/03-数据库的层级模型",
          },
          {
            path: "/mysql/01/04",
            name: "关系型数据库RDBMS",
            component: "@/pages/mysql/01-数据库基本概念/04-关系型数据库RDBMS",
          },
          {
            path: "/mysql/01/05",
            name: "非关系型数据库NoSQL",
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
            name: "常见NoSQL-Redis与MongoDB",
            component:
              "@/pages/mysql/01-数据库基本概念/08-常见NoSQL-Redis与MongoDB",
          },
          {
            path: "/mysql/01/09",
            name: "MySQL的历史与特点",
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
            name: "Windows安装MySQL",
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
            name: "登录与退出MySQL",
            component:
              "@/pages/mysql/02-MySQL安装卸载与服务管理/04-登录与退出MySQL",
          },
          {
            path: "/mysql/02/05",
            name: "彻底卸载MySQL",
            component:
              "@/pages/mysql/02-MySQL安装卸载与服务管理/05-彻底卸载MySQL",
          },
          {
            path: "/mysql/02/06",
            name: "目录结构配置文件与小结",
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
            name: "SQL是什么与标准方言",
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
            name: "四大分类DDL-DML-DQL-DCL",
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
            name: "预备知识与CREATE-DATABASE",
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
            name: "修改删除切换数据库",
            component: "@/pages/mysql/04-DDL-操作数据库/03-修改删除切换数据库",
          },
          {
            path: "/mysql/04/04",
            name: "完整演示与小结",
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
            name: "CREATE-TABLE与数据类型",
            component:
              "@/pages/mysql/05-DDL-操作表与图形化工具/02-CREATE-TABLE与数据类型",
          },
          {
            path: "/mysql/05/03",
            name: "修改删除复制表",
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
            name: "INSERT添加数据",
            component: "@/pages/mysql/06-DML-数据增删改/01-INSERT添加数据",
          },
          {
            path: "/mysql/06/02",
            name: "UPDATE修改数据",
            component: "@/pages/mysql/06-DML-数据增删改/02-UPDATE修改数据",
          },
          {
            path: "/mysql/06/03",
            name: "DELETE删除数据与小结",
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
            name: "SELECT基础语法与基础查询",
            component:
              "@/pages/mysql/07-DQL-基础查询与条件查询/01-SELECT基础语法与基础查询",
          },
          {
            path: "/mysql/07/02",
            name: "去重计算列与NULL处理",
            component:
              "@/pages/mysql/07-DQL-基础查询与条件查询/02-去重计算列与NULL处理",
          },
          {
            path: "/mysql/07/03",
            name: "条件查询WHERE",
            component:
              "@/pages/mysql/07-DQL-基础查询与条件查询/03-条件查询WHERE",
          },
          {
            path: "/mysql/07/04",
            name: "模糊查询LIKE与小结",
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
            name: "排序查询ORDER-BY",
            component:
              "@/pages/mysql/08-DQL-排序-聚合-分组-分页/01-排序查询ORDER-BY",
          },
          {
            path: "/mysql/08/02",
            name: "聚合函数与NULL处理",
            component:
              "@/pages/mysql/08-DQL-排序-聚合-分组-分页/02-聚合函数与NULL处理",
          },
          {
            path: "/mysql/08/03",
            name: "分组查询GROUP-BY与HAVING",
            component:
              "@/pages/mysql/08-DQL-排序-聚合-分组-分页/03-分组查询GROUP-BY与HAVING",
          },
          {
            path: "/mysql/08/04",
            name: "分页查询LIMIT与小结",
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
            name: "约束概述与NOT-NULL",
            component: "@/pages/mysql/09-约束/01-约束概述与NOT-NULL",
          },
          {
            path: "/mysql/09/02",
            name: "UNIQUE主键与AUTO-INCREMENT",
            component: "@/pages/mysql/09-约束/02-UNIQUE主键与AUTO-INCREMENT",
          },
          {
            path: "/mysql/09/03",
            name: "外键级联与小结",
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
            name: "综合案例与小结",
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
            name: "1NF与2NF",
            component: "@/pages/mysql/11-数据库三大范式/02-1NF与2NF",
          },
          {
            path: "/mysql/11/03",
            name: "3NF反范式与小结",
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
            name: "mysqldump备份与还原",
            component:
              "@/pages/mysql/12-数据库备份与还原/01-mysqldump备份与还原",
          },
          {
            path: "/mysql/12/02",
            name: "图形化工具与小结",
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
            name: "综合练习与小结",
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
            name: "事务基础与ACID",
            component: "@/pages/mysql/14-事务/01-事务基础与ACID",
          },
          {
            path: "/mysql/14/02",
            name: "并发隔离级别与小结",
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
            name: "权限管理与小结",
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
            name: "JDBC介绍与快速入门",
            component: "@/pages/mysql/16-JDBC核心详解/01-JDBC介绍与快速入门",
          },
          {
            path: "/mysql/16/02",
            name: "DriverManager-Connection-Statement",
            component:
              "@/pages/mysql/16-JDBC核心详解/02-DriverManager-Connection-Statement",
          },
          {
            path: "/mysql/16/03",
            name: "SQL注入与PreparedStatement",
            component:
              "@/pages/mysql/16-JDBC核心详解/03-SQL注入与PreparedStatement",
          },
          {
            path: "/mysql/16/04",
            name: "ResultSet与JDBC工具类",
            component: "@/pages/mysql/16-JDBC核心详解/04-ResultSet与JDBC工具类",
          },
          {
            path: "/mysql/16/05",
            name: "综合实战与小结",
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
            name: "JDBC事务控制基础",
            component: "@/pages/mysql/17-JDBC事务管理/01-JDBC事务控制基础",
          },
          {
            path: "/mysql/17/02",
            name: "标准写法对比与小结",
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
            name: "连接池概念与DataSource规范",
            component:
              "@/pages/mysql/18-数据库连接池/01-连接池概念与DataSource规范",
          },
          {
            path: "/mysql/18/02",
            name: "C3P0与Druid使用",
            component: "@/pages/mysql/18-数据库连接池/02-C3P0与Druid使用",
          },
          {
            path: "/mysql/18/03",
            name: "Druid工具类与小结",
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
            name: "JDBCTemplate介绍与快速入门",
            component:
              "@/pages/mysql/19-JDBCTemplate/01-JDBCTemplate介绍与快速入门",
          },
          {
            path: "/mysql/19/02",
            name: "DML与DQL查询方法",
            component: "@/pages/mysql/19-JDBCTemplate/02-DML与DQL查询方法",
          },
          {
            path: "/mysql/19/03",
            name: "综合示例与小结",
            component: "@/pages/mysql/19-JDBCTemplate/03-综合示例与小结",
          },
        ],
      },
    ],
  },
];
