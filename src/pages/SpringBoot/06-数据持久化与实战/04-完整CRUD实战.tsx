import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  OrderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>完整 CRUD 实战</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前几章的所有知识——三层架构、统一响应、全局异常、参数校验、MyBatis、分页——在这一节全部串联起来，
        搭建一个从数据库到接口<Text bold>完整可运行的用户 CRUD 服务</Text>。
        跟着走一遍，企业 API 开发的基本流程就彻底清楚了。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、项目结构总览</Subtitle>
    <CodeBlock
      language="text"
      code={`com.example.demo
├── DemoApplication.java
├── common/
│   ├── Result.java              ← 统一响应体
│   ├── BusinessException.java   ← 业务异常
│   └── GlobalExceptionHandler.java
├── config/
│   ├── WebMvcConfig.java        ← 拦截器注册 + 跨域配置
│   └── LoginInterceptor.java
├── controller/
│   └── UserController.java
├── service/
│   ├── UserService.java         ← 接口
│   └── impl/UserServiceImpl.java
├── mapper/
│   └── UserMapper.java
├── entity/
│   └── User.java
└── dto/
    ├── CreateUserDTO.java
    └── UpdateUserDTO.java

resources/
├── mapper/
│   └── UserMapper.xml
└── application.yml`}
    />

    <Divider />

    <Subtitle>二、分层代码完整示例</Subtitle>

    <Heading3>Entity</Heading3>
    <CodeBlock
      title="entity/User.java"
      code={`@Data
public class User {
    private Long id;
    private String username;
    private String email;
    private Integer age;
    private LocalDateTime createTime;
}`}
    />

    <Heading3>DTO</Heading3>
    <CodeBlock
      title="dto/CreateUserDTO.java"
      code={`@Data
@Schema(description = "新增用户")
public class CreateUserDTO {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名 2~20 个字符")
    @Schema(description = "用户名", example = "张三")
    private String username;

    @Email(message = "邮箱格式不正确")
    private String email;

    @Min(1) @Max(150)
    private Integer age;
}`}
    />
    <CodeBlock
      title="dto/UpdateUserDTO.java"
      code={`@Data
public class UpdateUserDTO {
    @NotNull(message = "id 不能为空")
    private Long id;

    @Size(min = 2, max = 20, message = "用户名 2~20 个字符")
    private String username;   // 可选，不传则不更新

    @Email(message = "邮箱格式不正确")
    private String email;

    @Min(1) @Max(150)
    private Integer age;
}`}
    />

    <Heading3>Mapper 接口 + XML</Heading3>
    <CodeBlock
      title="mapper/UserMapper.java"
      code={`@Mapper
public interface UserMapper {
    List<User> selectAll();
    User selectById(Long id);
    User selectByUsername(String username);
    int insert(User user);
    int updateById(User user);
    int deleteById(Long id);
    List<User> search(@Param("keyword") String keyword,
                      @Param("minAge")  Integer minAge,
                      @Param("maxAge")  Integer maxAge);
}`}
    />
    <CodeBlock
      language="xml"
      title="resources/mapper/UserMapper.xml"
      code={`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.demo.mapper.UserMapper">

    <select id="selectAll" resultType="User">SELECT * FROM user ORDER BY id</select>

    <select id="selectById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>

    <select id="selectByUsername" resultType="User">
        SELECT * FROM user WHERE username = #{username}
    </select>

    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO user(username, email, age) VALUES(#{username}, #{email}, #{age})
    </insert>

    <update id="updateById">
        UPDATE user
        <set>
            <if test="username != null">username = #{username},</if>
            <if test="email != null">email = #{email},</if>
            <if test="age != null">age = #{age},</if>
        </set>
        WHERE id = #{id}
    </update>

    <delete id="deleteById">DELETE FROM user WHERE id = #{id}</delete>

    <select id="search" resultType="User">
        SELECT * FROM user
        <where>
            <if test="keyword != null and keyword != ''">
                AND username LIKE CONCAT('%', #{keyword}, '%')
            </if>
            <if test="minAge != null">AND age >= #{minAge}</if>
            <if test="maxAge != null">AND age &lt;= #{maxAge}</if>
        </where>
        ORDER BY id DESC
    </select>

</mapper>`}
    />

    <Heading3>Service</Heading3>
    <CodeBlock
      title="service/impl/UserServiceImpl.java"
      code={`@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    @Override
    public PageInfo<User> page(int pageNum, int pageSize, String keyword) {
        PageHelper.startPage(pageNum, pageSize);
        return new PageInfo<>(userMapper.search(keyword, null, null));
    }

    @Override
    public User getById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) throw BusinessException.notFound("用户不存在：id=" + id);
        return user;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User create(CreateUserDTO dto) {
        if (userMapper.selectByUsername(dto.getUsername()) != null) {
            throw BusinessException.badRequest("用户名已存在：" + dto.getUsername());
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setAge(dto.getAge());
        userMapper.insert(user);
        log.info("用户创建成功：id={}", user.getId());
        return user;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User update(UpdateUserDTO dto) {
        getById(dto.getId());   // 校验存在
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setAge(dto.getAge());
        userMapper.updateById(user);
        return userMapper.selectById(dto.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteById(Long id) {
        getById(id);   // 校验存在
        userMapper.deleteById(id);
        log.info("用户删除：id={}", id);
    }
}`}
    />

    <Heading3>Controller</Heading3>
    <CodeBlock
      title="controller/UserController.java"
      code={`@Tag(name = "用户管理")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "分页查询用户")
    @GetMapping
    public Result<PageInfo<User>> list(
            @RequestParam(defaultValue = "1")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false)    String keyword) {
        return Result.success(userService.page(page, size, keyword));
    }

    @Operation(summary = "按 ID 查用户")
    @GetMapping("/{id}")
    public Result<User> getById(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @Operation(summary = "新增用户")
    @PostMapping
    public Result<User> create(@Valid @RequestBody CreateUserDTO dto) {
        return Result.success(userService.create(dto));
    }

    @Operation(summary = "更新用户")
    @PutMapping
    public Result<User> update(@Valid @RequestBody UpdateUserDTO dto) {
        return Result.success(userService.update(dto));
    }

    @Operation(summary = "删除用户")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return Result.success();
    }
}`}
    />

    <Divider />

    <Subtitle>三、接口测试清单</Subtitle>
    <Paragraph>启动后用 <InlineCode>/doc.html</InlineCode> 或 Apifox 按顺序测试：</Paragraph>
    <OrderedList>
      <ListItem>
        <Text bold>POST /users</Text>：新增用户，传合法 JSON，验证返回 200 且 data 有 id；再传空用户名，验证返回 400。
      </ListItem>
      <ListItem>
        <Text bold>GET /users?page=1&size=10</Text>：分页查询，验证 data.total 和 data.list。
      </ListItem>
      <ListItem>
        <Text bold>GET /users/1</Text>：查存在的 id，返回 200；查不存在的 id，验证返回 404。
      </ListItem>
      <ListItem>
        <Text bold>PUT /users</Text>：更新，验证字段变化；不传 id 验证返回 400。
      </ListItem>
      <ListItem>
        <Text bold>DELETE /users/1</Text>：删除后再 GET，验证返回 404。
      </ListItem>
    </OrderedList>

    <Divider />

    <Subtitle>四、本套教程到此的全貌</Subtitle>
    <CodeBlock
      language="text"
      title="一个标准企业级 Spring Boot API 项目的完整技术栈"
      code={`HTTP 请求
  ↓
拦截器（LoginInterceptor）：登录校验、日志
  ↓
Controller：参数接收 @Valid 校验、调用 Service、Result 包装响应
  ↓ 异常时由 GlobalExceptionHandler 捕获
Service：业务逻辑、@Transactional 事务、PageHelper 分页
  ↓
Mapper（MyBatis）：动态 SQL、注解/XML
  ↓
MySQL 数据库（HikariCP 连接池）

横切关注点：
  - 统一响应格式（Result）
  - 全局异常处理（GlobalExceptionHandler）
  - 接口文档（Knife4j）
  - 多环境配置（Profiles）
  - 日志（@Slf4j）`}
    />

    <Callout type="success" title="完整实战小结">
      <UnorderedList>
        <ListItem>每一层职责清晰：Controller 接参数 / Service 写业务 / Mapper 操作 DB。</ListItem>
        <ListItem>用 DTO 隔离入参，避免直接暴露 Entity；响应用 <InlineCode>Result</InlineCode> 统一格式。</ListItem>
        <ListItem>参数校验 + 全局异常处理 = 前端永远拿到格式一致的错误信息。</ListItem>
        <ListItem>MyBatis 动态 SQL + PageHelper 覆盖 80% 的查询场景。</ListItem>
        <ListItem>Knife4j 文档即测试工具，提升前后端协作效率。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
