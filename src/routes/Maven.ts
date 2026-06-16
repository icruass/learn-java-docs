// ⚠️ 此文件由脚本自动生成，请勿手动修改。
// 数据源：src/pages/Maven/ 目录结构（可由各页面/文件夹的 export const route 覆盖）
// 重新生成：node src/routes/scripts/Maven.mjs（或 node src/routes/scripts/index.mjs 一键生成全部）

export default [
  {
    path: "/Maven",
    name: "Maven",
    icon: "📦",
    routes: [
      {
        path: "/Maven/01",
        name: "Maven入门",
        routes: [
          {
            path: "/Maven/01/01",
            name: "为什么需要Maven",
            component: "@/pages/Maven/01-Maven入门/01-为什么需要Maven",
          },
          {
            path: "/Maven/01/02",
            name: "Maven是什么与核心功能",
            component: "@/pages/Maven/01-Maven入门/02-Maven是什么与核心功能",
          },
          {
            path: "/Maven/01/03",
            name: "下载安装与环境变量",
            component: "@/pages/Maven/01-Maven入门/03-下载安装与环境变量",
          },
          {
            path: "/Maven/01/04",
            name: "配置本地仓库与阿里云镜像",
            component: "@/pages/Maven/01-Maven入门/04-配置本地仓库与阿里云镜像",
          },
        ],
      },
      {
        path: "/Maven/02",
        name: "Maven项目与POM",
        routes: [
          {
            path: "/Maven/02/01",
            name: "第一个Maven项目与目录结构",
            component: "@/pages/Maven/02-Maven项目与POM/01-第一个Maven项目与目录结构",
          },
          {
            path: "/Maven/02/02",
            name: "POM详解与坐标GAV",
            component: "@/pages/Maven/02-Maven项目与POM/02-POM详解与坐标GAV",
          },
          {
            path: "/Maven/02/03",
            name: "仓库体系与查找顺序",
            component: "@/pages/Maven/02-Maven项目与POM/03-仓库体系与查找顺序",
          },
        ],
      },
      {
        path: "/Maven/03",
        name: "依赖管理",
        routes: [
          {
            path: "/Maven/03/01",
            name: "依赖声明与查找坐标",
            component: "@/pages/Maven/03-依赖管理/01-依赖声明与查找坐标",
          },
          {
            path: "/Maven/03/02",
            name: "依赖范围Scope",
            component: "@/pages/Maven/03-依赖管理/02-依赖范围Scope",
          },
          {
            path: "/Maven/03/03",
            name: "依赖传递与冲突调解",
            component: "@/pages/Maven/03-依赖管理/03-依赖传递与冲突调解",
          },
          {
            path: "/Maven/03/04",
            name: "排除依赖与版本锁定",
            component: "@/pages/Maven/03-依赖管理/04-排除依赖与版本锁定",
          },
        ],
      },
      {
        path: "/Maven/04",
        name: "生命周期与插件",
        routes: [
          {
            path: "/Maven/04/01",
            name: "三套生命周期与阶段",
            component: "@/pages/Maven/04-生命周期与插件/01-三套生命周期与阶段",
          },
          {
            path: "/Maven/04/02",
            name: "常用Maven命令",
            component: "@/pages/Maven/04-生命周期与插件/02-常用Maven命令",
          },
          {
            path: "/Maven/04/03",
            name: "插件与目标",
            component: "@/pages/Maven/04-生命周期与插件/03-插件与目标",
          },
        ],
      },
      {
        path: "/Maven/05",
        name: "聚合与继承",
        routes: [
          {
            path: "/Maven/05/01",
            name: "继承父子工程统一版本",
            component: "@/pages/Maven/05-聚合与继承/01-继承父子工程统一版本",
          },
          {
            path: "/Maven/05/02",
            name: "聚合多模块项目",
            component: "@/pages/Maven/05-聚合与继承/02-聚合多模块项目",
          },
        ],
      },
      {
        path: "/Maven/06",
        name: "IDE整合与实战",
        routes: [
          {
            path: "/Maven/06/01",
            name: "IDEA中使用Maven",
            component: "@/pages/Maven/06-IDE整合与实战/01-IDEA中使用Maven",
          },
          {
            path: "/Maven/06/02",
            name: "整合SpringBoot打包可执行jar",
            component: "@/pages/Maven/06-IDE整合与实战/02-整合SpringBoot打包可执行jar",
          },
          {
            path: "/Maven/06/03",
            name: "常见问题与最佳实践",
            component: "@/pages/Maven/06-IDE整合与实战/03-常见问题与最佳实践",
          },
        ],
      },
    ],
  },
];
