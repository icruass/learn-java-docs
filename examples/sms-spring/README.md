# sms-spring · 基于 Spring Boot 的学生管理系统

这是同目录纯 Java 版 [`sms`](../sms) 的「Spring 落地版」。`sms` 里那些手写的接口、依赖注入、
仓储抽象，在这里都用 Spring Boot 的标准方式实现：能启动服务、连接数据库、对外提供 REST 接口。

> 定位：**最基础但结构完整**的企业级骨架。聚焦学生（Student）的几个真实接口，
> 教室/老师只提供只读查询作配套。

> 📘 想从零开始（装 Maven/MySQL、连库原理、H2→MySQL 切换、踩过的坑）：见
> [从零搭建与数据库连接指南](从零搭建与数据库连接指南.md)。

---

## 一、技术栈

| 关注点 | 选型                                          | 说明                                                                                                             |
| ------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 框架   | Spring Boot **2.7.18**                        | 本机是 **JDK 11**，而 Spring Boot 3.x 需要 JDK 17+，故选支持 Java 8/11 的最后一条产品线（用 `javax.*` 命名空间） |
| Web    | spring-boot-starter-web                       | 内嵌 Tomcat + Spring MVC，写 REST 接口                                                                           |
| 持久化 | spring-boot-starter-data-jpa（Hibernate）     | 领域对象 ↔ 数据库表自动映射                                                                                      |
| 校验   | spring-boot-starter-validation                | 请求体入参校验                                                                                                   |
| 数据库 | **H2 内存库（默认）** / MySQL（可选 profile） | H2 零配置即可启动                                                                                                |
| 构建   | Maven                                         | `pom.xml`                                                                                                        |

---

## 二、分层结构

```
src/main/java/com/example/sms/
├── SmsApplication.java          启动入口（main 方法）
├── domain/                      领域层：实体 + 枚举（JPA 映射在这里）
│   ├── Person.java              抽象父类 @MappedSuperclass（公共字段）
│   ├── Student.java  Teacher.java  Classroom.java   @Entity
│   ├── Gender.java  EnrollmentStatus.java  PersonType.java
├── repository/                  仓储层：继承 JpaRepository，自动获得增删改查
│   ├── StudentRepository.java  ClassroomRepository.java  TeacherRepository.java
├── service/                     业务层：业务规则 + 事务编排
│   ├── StudentService.java（接口）
│   └── StudentServiceImpl.java（@Service 实现）
├── dto/                         数据传输对象（接口的输入/输出契约）
│   ├── RegisterStudentRequest.java  UpdateStudentRequest.java  StudentResponse.java
├── web/                         Web 层：Controller + 全局异常处理
│   ├── StudentController.java  ClassroomController.java  TeacherController.java
│   ├── GlobalExceptionHandler.java  ApiError.java
└── exception/                   自定义业务异常
    └── StudentNotFoundException.java 等

src/main/resources/
├── application.yml              默认配置（H2）
└── db/mysql-seed.sql            MySQL 手动灌种子数据脚本
```

请求流向：`Controller → Service → Repository → 数据库`，响应再反向用 `StudentResponse` 组装返回。

---

## 三、如何运行

### 用 Maven 命令行

若已安装 Maven（`mvn -v` 能输出版本）：

```bash
cd src/ExampleCode/sms-spring
mvn spring-boot:run          # 启动
mvn test                     # 跑测试
mvn clean package            # 打成可执行 jar
java -jar target/sms-spring-0.0.1-SNAPSHOT.jar
```

启动成功后日志出现 `Tomcat started on port(s): 8080`，服务即就绪。

---

## 四、数据库

### 默认：MySQL

前提：本机已装 MySQL 8。配置见 `application-mysql.yml`（按需改用户名/密码），然后带 profile 启动：

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
# 或
java -jar target/sms-spring-0.0.1-SNAPSHOT.jar --spring.profiles.active=mysql
```

- 连接串里 `createDatabaseIfNotExist=true` 会自动建库 `sms`；
- `ddl-auto=update` 让 Hibernate 自动建表；
- 种子数据手动执行一次：`mysql -uroot -p sms < src/main/resources/db/mysql-seed.sql`。

---

## 五、接口清单与示例

基址：`http://localhost:8080`

| 方法   | 路径                          | 说明                 | 成功码 |
| ------ | ----------------------------- | -------------------- | ------ |
| POST   | `/api/students`               | 注册学生             | 201    |
| GET    | `/api/students`               | 学生列表             | 200    |
| GET    | `/api/students/{id}`          | 学生详情             | 200    |
| PATCH  | `/api/students/{id}`          | 编辑（部分更新）     | 200    |
| DELETE | `/api/students/{id}`          | 物理删除             | 204    |
| POST   | `/api/students/{id}/withdraw` | 退学（软删除）       | 200    |
| GET    | `/api/classrooms`             | 教室列表（查 id 用） | 200    |
| GET    | `/api/teachers`               | 老师列表（查 id 用） | 200    |

### curl 示例

```bash
# 1. 注册学生（同时编入 1 号教室）
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","gender":"MALE","age":10,"classroomId":1}'

# 2. 学生列表
curl http://localhost:8080/api/students

# 3. 学生详情
curl http://localhost:8080/api/students/1

# 4. 部分更新：改年龄、设为在读、分配 1 号班主任
curl -X PATCH http://localhost:8080/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"age":11,"status":"ACTIVE","headTeacherId":1}'

# 5. 退学（软删除）
curl -X POST http://localhost:8080/api/students/1/withdraw

# 6. 物理删除
curl -X DELETE http://localhost:8080/api/students/1
```

注册成功返回示例：

```json
{
  "id": 1,
  "studentNo": "STU20260001",
  "name": "张三",
  "gender": "男",
  "age": 10,
  "classroomId": 1,
  "classroomName": "三年二班",
  "headTeacherId": null,
  "headTeacherName": null,
  "status": "已注册",
  "statusCode": "REGISTERED"
}
```

错误统一返回 `ApiError`（由 `GlobalExceptionHandler` 翻译），例如查询不存在的学生：

```json
{
  "timestamp": "2026-06-24T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "学生不存在，id=999",
  "path": "/api/students/999"
}
```

---

## 六、和纯 Java 版 `sms` 的对照

| 概念     | `sms`（纯 Java 手写）               | `sms-spring`（Spring 实现）              |
| -------- | ----------------------------------- | ---------------------------------------- |
| 依赖注入 | 自己 `new` 后构造方法传入           | `@Service` + 构造注入，容器自动装配      |
| 仓储     | 手写 `InMemoryStudentRepository`    | 继承 `JpaRepository`，实现自动生成       |
| 存储     | 内存 `Map`                          | 真数据库（H2/MySQL），Hibernate 映射     |
| 对外入口 | `StudentManagementDemo` 命令行      | `@RestController` HTTP 接口              |
| 异常处理 | 调用方自行处理                      | `@RestControllerAdvice` 全局转 HTTP 码   |
| 入参     | `RegisterStudentCommand` 不可变对象 | `RegisterStudentRequest` + `@Valid` 校验 |

业务逻辑（判重、生成学号、终态不可编辑、退学软删除）两版本完全一致——
变的只是「框架怎么把这些零件装起来」。

---

## 七、刻意保留的简化（便于聚焦基础）

- 学号用「现有学生数 + 1」生成，仅演示；真实系统用独立发号器并处理并发与删除空洞。
- 教室/老师只提供只读查询，且直接返回实体（参考数据，无敏感字段）。
- 未引入分页、鉴权、Flyway 等；这些是下一步可加的「进阶项」。
