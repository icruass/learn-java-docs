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
    <Title>Controller 与常用注解</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Controller 是 Spring Boot 对外暴露接口的入口层。
        这一节讲清楚<Text bold>两种 Controller 的区别</Text>、
        <Text bold>HTTP 方法映射注解</Text>，以及企业里真正用的接口长什么样——
        理解这些，你就能独立写出规范的 RESTful 接口。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、@Controller vs @RestController</Subtitle>
    <Table
      head={['注解', '返回值处理', '适用场景']}
      rows={[
        ['@Controller', '返回字符串时跳转到对应的视图模板（如 Thymeleaf 页面）', '服务端渲染，前后端不分离'],
        ['@RestController', '返回值自动序列化为 JSON 写入响应体', '前后端分离，开发 API 接口（企业主流）'],
      ]}
    />
    <Paragraph>
      <InlineCode>@RestController</InlineCode> = <InlineCode>@Controller</InlineCode> +{' '}
      <InlineCode>@ResponseBody</InlineCode>。做企业 API<Text bold>始终用 @RestController</Text>。
    </Paragraph>
    <CodeBlock
      title="最简单的 RestController"
      code={`package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")    // 这个 Controller 下所有接口共享的路径前缀
public class UserController {

    @GetMapping            // GET /users —— 获取列表
    public String list() {
        return "user list";
    }
}`}
    />

    <Divider />

    <Subtitle>二、HTTP 方法与对应注解（RESTful 规范）</Subtitle>
    <Paragraph>
      RESTful 风格用 <Text bold>HTTP 方法</Text>表达操作语义，用 <Text bold>URL</Text> 表达资源。
    </Paragraph>
    <Table
      head={['HTTP 方法', 'Spring 注解', '语义', '典型 URL 示例']}
      rows={[
        ['GET', '@GetMapping', '查询（不改变数据）', 'GET /users 或 GET /users/1'],
        ['POST', '@PostMapping', '新增', 'POST /users'],
        ['PUT', '@PutMapping', '全量更新', 'PUT /users/1'],
        ['PATCH', '@PatchMapping', '部分更新（较少用）', 'PATCH /users/1'],
        ['DELETE', '@DeleteMapping', '删除', 'DELETE /users/1'],
      ]}
    />
    <Callout type="tip">
      以上注解都是 <InlineCode>@RequestMapping</InlineCode> 的快捷方式。例如{' '}
      <InlineCode>@GetMapping("/users")</InlineCode> 等价于{' '}
      <InlineCode>@RequestMapping(value = "/users", method = RequestMethod.GET)</InlineCode>。
      实际开发统一用快捷注解，更简洁。
    </Callout>

    <Divider />

    <Subtitle>三、一个完整的 CRUD Controller 骨架</Subtitle>
    <Paragraph>
      以「用户」资源为例，标准的 RESTful Controller 长这样（业务逻辑委托给 Service，下一章讲三层架构）：
    </Paragraph>
    <CodeBlock
      title="UserController.java"
      code={`package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;   // 构造器注入（推荐）

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /users → 查全部
    @GetMapping
    public List<User> list() {
        return userService.listAll();
    }

    // GET /users/{id} → 按 id 查单个
    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    // POST /users → 新增（请求体传 JSON）
    @PostMapping
    public User create(@RequestBody User user) {
        return userService.create(user);
    }

    // PUT /users/{id} → 更新
    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.update(user);
    }

    // DELETE /users/{id} → 删除
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteById(id);
    }
}`}
    />
    <Callout type="note">
      现在 <InlineCode>UserService</InlineCode> 还不存在，编译会报错。不用担心，后面章节会把整个三层结构填完整，
      这里先把 Controller 的结构形态记住。
    </Callout>

    <Divider />

    <Subtitle>四、@RequestMapping 放类上 vs 方法上</Subtitle>
    <CodeBlock
      title="路径拼接规则"
      code={`@RestController
@RequestMapping("/api/v1")        // 类级别前缀
public class ProductController {

    @GetMapping("/products")      // 最终路径：/api/v1/products
    public String list() { ... }

    @GetMapping("/products/{id}") // 最终路径：/api/v1/products/{id}
    public String getById(...) { ... }
}`}
    />
    <Paragraph>
      类级别的 <InlineCode>@RequestMapping</InlineCode> 就是这个 Controller 所有接口共享的前缀，
      与 <InlineCode>application.yml</InlineCode> 里的 <InlineCode>server.servlet.context-path</InlineCode> 叠加生效。
    </Paragraph>

    <Divider />

    <Subtitle>五、用 Postman / Apifox 测试接口</Subtitle>
    <Paragraph>
      API 接口不能直接在浏览器里测试 POST/PUT/DELETE，需要借助工具：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>Postman</Text>：最经典的接口测试工具，国际上主流。
      </ListItem>
      <ListItem>
        <Text bold>Apifox</Text>：国内流行，集成了文档、测试、Mock，团队协作友好，推荐使用。
      </ListItem>
      <ListItem>
        <Text bold>IDEA HTTP Client</Text>：IDEA 内置，在项目里建 <InlineCode>.http</InlineCode> 文件直接发请求，方便版本管理。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      language="text"
      title="IDEA HTTP Client 示例（.http 文件）"
      code={`### 获取所有用户
GET http://localhost:8080/users
Accept: application/json

### 新增用户
POST http://localhost:8080/users
Content-Type: application/json

{
  "username": "张三",
  "age": 25
}`}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>做 API 用 <InlineCode>@RestController</InlineCode>（= @Controller + @ResponseBody），返回值自动序列化为 JSON。</ListItem>
        <ListItem>HTTP 方法映射：GET→查、POST→增、PUT→改、DELETE→删，对应 <InlineCode>@GetMapping</InlineCode> 等快捷注解。</ListItem>
        <ListItem>类上加 <InlineCode>@RequestMapping</InlineCode> 作为接口前缀，方法上再加具体路径。</ListItem>
        <ListItem>用 Apifox / Postman 测试非 GET 接口。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
