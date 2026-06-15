// ⚠️ 此文件由脚本自动生成，请勿手动修改。
// 数据源：src/pages/MyBatis/ 目录结构（可由各页面/文件夹的 export const route 覆盖）
// 重新生成：node src/routes/scripts/MyBatis.mjs（或 node src/routes/scripts/index.mjs 一键生成全部）

export default [
  {
    path: "/MyBatis",
    name: "MyBatis",
    icon: "🐦",
    routes: [
      {
        path: "/MyBatis/01",
        name: "MyBatis入门",
        routes: [
          {
            path: "/MyBatis/01/01",
            name: "什么是MyBatis",
            component: "@/pages/MyBatis/01-MyBatis入门/01-什么是MyBatis",
          },
          {
            path: "/MyBatis/01/02",
            name: "快速入门第一个程序",
            component: "@/pages/MyBatis/01-MyBatis入门/02-快速入门第一个程序",
          },
          {
            path: "/MyBatis/01/03",
            name: "核心组件与工作流程",
            component: "@/pages/MyBatis/01-MyBatis入门/03-核心组件与工作流程",
          },
        ],
      },
      {
        path: "/MyBatis/02",
        name: "核心配置",
        routes: [
          {
            path: "/MyBatis/02/01",
            name: "全局配置文件",
            component: "@/pages/MyBatis/02-核心配置/01-全局配置文件",
          },
          {
            path: "/MyBatis/02/02",
            name: "Mapper映射文件",
            component: "@/pages/MyBatis/02-核心配置/02-Mapper映射文件",
          },
        ],
      },
      {
        path: "/MyBatis/03",
        name: "增删改查CRUD",
        routes: [
          {
            path: "/MyBatis/03/01",
            name: "查询与结果封装",
            component: "@/pages/MyBatis/03-增删改查CRUD/01-查询与结果封装",
          },
          {
            path: "/MyBatis/03/02",
            name: "增删改与主键回填",
            component: "@/pages/MyBatis/03-增删改查CRUD/02-增删改与主键回填",
          },
          {
            path: "/MyBatis/03/03",
            name: "参数传递详解",
            component: "@/pages/MyBatis/03-增删改查CRUD/03-参数传递详解",
          },
        ],
      },
      {
        path: "/MyBatis/04",
        name: "结果映射ResultMap",
        routes: [
          {
            path: "/MyBatis/04/01",
            name: "resultMap基础",
            component: "@/pages/MyBatis/04-结果映射ResultMap/01-resultMap基础",
          },
          {
            path: "/MyBatis/04/02",
            name: "关联查询association与collection",
            component: "@/pages/MyBatis/04-结果映射ResultMap/02-关联查询association与collection",
          },
        ],
      },
      {
        path: "/MyBatis/05",
        name: "动态SQL",
        routes: [
          {
            path: "/MyBatis/05/01",
            name: "if-where-set-trim",
            component: "@/pages/MyBatis/05-动态SQL/01-if-where-set-trim",
          },
          {
            path: "/MyBatis/05/02",
            name: "foreach-choose-sql片段",
            component: "@/pages/MyBatis/05-动态SQL/02-foreach-choose-sql片段",
          },
        ],
      },
      {
        path: "/MyBatis/06",
        name: "企业级实战与进阶",
        routes: [
          {
            path: "/MyBatis/06/01",
            name: "缓存机制",
            component: "@/pages/MyBatis/06-企业级实战与进阶/01-缓存机制",
          },
          {
            path: "/MyBatis/06/02",
            name: "整合Spring与最佳实践",
            component: "@/pages/MyBatis/06-企业级实战与进阶/02-整合Spring与最佳实践",
          },
        ],
      },
    ],
  },
];
