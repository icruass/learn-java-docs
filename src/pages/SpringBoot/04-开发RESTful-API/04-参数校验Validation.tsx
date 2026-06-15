import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  Table,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>参数校验 Validation</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前端传来的数据<Text bold>永远不可信</Text>：用户名可能为空、年龄可能是负数、邮箱格式可能不对。
        手写 <InlineCode>if</InlineCode> 校验既繁琐又难维护。
        Spring Boot 内置了 <Text bold>Bean Validation</Text>（基于注解），
        一个注解搞定一条校验规则，配合上节的全局异常处理器，优雅又省力。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、引入依赖</Subtitle>
    <CodeBlock
      language="xml"
      title="pom.xml"
      code={`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>`}
    />

    <Divider />

    <Subtitle>二、在 DTO 上加校验注解</Subtitle>
    <CodeBlock
      title="dto/CreateUserDTO.java"
      code={`package com.example.demo.dto;

import jakarta.validation.constraints.*;   // Spring Boot 3.x 用 jakarta

public class CreateUserDTO {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度必须在 2~20 之间")
    private String username;

    @NotNull(message = "年龄不能为空")
    @Min(value = 1,   message = "年龄不能小于 1")
    @Max(value = 150, message = "年龄不能大于 150")
    private Integer age;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;

    @Pattern(regexp = "^1[3-9]\\\\d{9}$", message = "手机号格式不正确")
    private String phone;   // 可选字段，不加 @NotBlank 就是可传可不传

    // getter / setter...
}`}
    />

    <Divider />

    <Subtitle>三、在 Controller 开启校验</Subtitle>
    <Paragraph>
      在方法参数上加 <InlineCode>@Valid</InlineCode>（或 <InlineCode>@Validated</InlineCode>），
      Spring 收到请求后自动校验；不通过时抛 <InlineCode>MethodArgumentNotValidException</InlineCode>，
      被上节的全局异常处理器捕获并返回 400：
    </Paragraph>
    <CodeBlock
      title="UserController.java"
      code={`import jakarta.validation.Valid;

@PostMapping
public Result<User> create(@Valid @RequestBody CreateUserDTO dto) {
    // 走到这里说明校验已通过，dto 里的数据是合法的
    User user = userService.create(dto);
    return Result.success(user);
}

// 路径变量/查询参数校验：在类上加 @Validated（注意：这里是 @Validated 不是 @Valid）
@RestController
@RequestMapping("/users")
@Validated   // ← 加在类上
public class UserController {

    @GetMapping("/{id}")
    public Result<User> getById(
            @PathVariable @Positive(message = "id 必须为正整数") Long id) {
        ...
    }
}`}
    />
    <Callout type="warning" title="@Valid vs @Validated">
      <UnorderedList>
        <ListItem><InlineCode>@Valid</InlineCode>（jakarta）：用在方法参数上，校验 <InlineCode>@RequestBody</InlineCode> 的对象。</ListItem>
        <ListItem><InlineCode>@Validated</InlineCode>（Spring）：用在类上，启用对 <InlineCode>@PathVariable</InlineCode>、<InlineCode>@RequestParam</InlineCode> 的校验；或用于分组校验。</ListItem>
        <ListItem>两者都能触发对象字段校验，区别在于 <InlineCode>@Validated</InlineCode> 支持「分组」功能。</ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>四、常用校验注解速查</Subtitle>
    <Table
      head={['注解', '适用类型', '说明']}
      rows={[
        ['@NotNull', '任何类型', '不能为 null'],
        ['@NotBlank', 'String', '不能为 null 且去空格后不能为空串（比 @NotEmpty 更严格）'],
        ['@NotEmpty', 'String / 集合', '不能为 null 且不能为空'],
        ['@Size(min,max)', 'String / 集合 / 数组', '长度或元素个数范围'],
        ['@Min(value)', '数字', '不能小于指定值'],
        ['@Max(value)', '数字', '不能大于指定值'],
        ['@Positive', '数字', '必须为正数（> 0）'],
        ['@PositiveOrZero', '数字', '必须为正数或 0（>= 0）'],
        ['@Email', 'String', '邮箱格式'],
        ['@Pattern(regexp)', 'String', '正则匹配'],
        ['@Past / @Future', 'LocalDate/Date', '必须是过去/未来的时间'],
      ]}
    />

    <Divider />

    <Subtitle>五、分组校验（新增 vs 更新）</Subtitle>
    <Paragraph>
      同一个 DTO 新增时 id 不传，更新时 id 必传——用<Text bold>分组校验</Text>实现：
    </Paragraph>
    <CodeBlock
      title="分组接口 + DTO"
      code={`// 定义分组（空接口，仅作为标识）
public interface CreateGroup {}
public interface UpdateGroup {}

public class UserDTO {
    @Null(groups = CreateGroup.class, message = "新增时 id 应为空")
    @NotNull(groups = UpdateGroup.class, message = "更新时 id 不能为空")
    private Long id;

    @NotBlank(groups = {CreateGroup.class, UpdateGroup.class}, message = "用户名不能为空")
    private String username;
}`}
    />
    <CodeBlock
      title="Controller 中使用分组"
      code={`// 新增时用 CreateGroup
@PostMapping
public Result<User> create(@Validated(CreateGroup.class) @RequestBody UserDTO dto) { ... }

// 更新时用 UpdateGroup
@PutMapping("/{id}")
public Result<User> update(@PathVariable Long id,
                           @Validated(UpdateGroup.class) @RequestBody UserDTO dto) { ... }`}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>引入 <InlineCode>spring-boot-starter-validation</InlineCode>，在 DTO 字段上加注解声明规则。</ListItem>
        <ListItem>Controller 参数加 <InlineCode>@Valid</InlineCode>（RequestBody）或 <InlineCode>@Validated</InlineCode>（类级别）触发校验。</ListItem>
        <ListItem>校验失败抛 <InlineCode>MethodArgumentNotValidException</InlineCode>，由全局异常处理器转为 400 响应。</ListItem>
        <ListItem>分组校验：用空接口做标记，<InlineCode>@Validated(XxxGroup.class)</InlineCode> 指定生效的组。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
