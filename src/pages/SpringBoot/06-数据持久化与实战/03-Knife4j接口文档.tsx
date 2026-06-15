import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>Knife4j 接口文档</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前后端协作的项目里，接口文档必不可少。<Text bold>Knife4j</Text> 是 Swagger 的增强版，
        集成进 Spring Boot 后代码即文档——Controller 上的注解自动生成美观的在线文档页面，
        可以直接在文档页面调试接口，告别手写文档和 Postman 来回切换。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、引入依赖</Subtitle>
    <CodeBlock
      language="xml"
      title="pom.xml"
      code={`<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
    <version>4.4.0</version>
</dependency>`}
    />
    <Callout type="warning">
      Spring Boot 3.x 必须用 <Text bold>knife4j 4.x</Text> 版本（包含 <InlineCode>jakarta</InlineCode> 的那个 starter），
      低版本不兼容 Jakarta EE。
    </Callout>

    <Divider />

    <Subtitle>二、基础配置</Subtitle>
    <CodeBlock
      language="yaml"
      title="application.yml"
      code={`springdoc:
  swagger-ui:
    path: /swagger-ui.html    # Swagger 原版 UI 地址（可选）
  api-docs:
    path: /v3/api-docs

knife4j:
  enable: true                # 开启 Knife4j 增强
  setting:
    language: zh_cn           # 界面语言
  basic:
    enable: false             # 是否开启 Basic 认证保护文档（生产环境建议开启）`}
    />
    <Paragraph>
      配置完毕，启动项目后访问 <InlineCode>http://localhost:8080/doc.html</InlineCode> 即可看到接口文档页面。
    </Paragraph>

    <Divider />

    <Subtitle>三、在代码里加文档注解</Subtitle>
    <Paragraph>
      用 OpenAPI 3 注解（<InlineCode>io.swagger.v3.oas.annotations.*</InlineCode>）给接口加描述：
    </Paragraph>
    <CodeBlock
      title="UserController.java（加文档注解）"
      code={`import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "用户管理", description = "用户的增删改查接口")   // 控制器分组名
@RestController
@RequestMapping("/users")
public class UserController {

    @Operation(summary = "获取用户列表", description = "支持按用户名关键词搜索，带分页")
    @GetMapping
    public Result<PageInfo<User>> list(
            @Parameter(description = "页码，从 1 开始") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页条数")        @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "用户名关键词，可选") @RequestParam(required = false) String keyword) {
        return Result.success(userService.page(page, size, keyword));
    }

    @Operation(summary = "按 ID 查询用户")
    @GetMapping("/{id}")
    public Result<User> getById(
            @Parameter(description = "用户 ID") @PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @Operation(summary = "新增用户")
    @PostMapping
    public Result<User> create(@RequestBody CreateUserDTO dto) {
        return Result.success(userService.create(dto));
    }
}`}
    />
    <CodeBlock
      title="DTO 上加字段描述"
      code={`import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "新增用户请求体")
public class CreateUserDTO {

    @Schema(description = "用户名，2~20 个字符", example = "张三")
    @NotBlank(message = "用户名不能为空")
    private String username;

    @Schema(description = "邮箱", example = "zhangsan@example.com")
    @Email(message = "邮箱格式不正确")
    private String email;

    @Schema(description = "年龄，1~150", example = "25")
    @Min(1) @Max(150)
    private Integer age;
}`}
    />

    <Divider />

    <Subtitle>四、生产环境关掉文档</Subtitle>
    <Paragraph>
      接口文档暴露了所有 API 细节，<Text bold>生产环境必须关闭或加鉴权</Text>：
    </Paragraph>
    <CodeBlock
      language="yaml"
      title="application-prod.yml"
      code={`# 生产环境关闭 Knife4j
knife4j:
  enable: false

# 或者开启 Basic 认证，只有输对账号密码才能查看
knife4j:
  enable: true
  basic:
    enable: true
    username: admin
    password: "your_strong_password"`}
    />
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>引入 <InlineCode>knife4j-openapi3-jakarta-spring-boot-starter</InlineCode>（4.x 对应 SB3）。</ListItem>
        <ListItem>启动后访问 <InlineCode>/doc.html</InlineCode> 查看在线文档，支持直接调试接口。</ListItem>
        <ListItem>用 <InlineCode>@Tag / @Operation / @Parameter / @Schema</InlineCode> 给 Controller 和 DTO 加描述，文档更专业。</ListItem>
        <ListItem>生产环境关闭（<InlineCode>knife4j.enable: false</InlineCode>）或开启 Basic 鉴权。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
