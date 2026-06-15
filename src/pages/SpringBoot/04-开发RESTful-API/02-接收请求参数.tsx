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
    <Title>接收请求参数</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前端给后端传参数有多种方式：URL 里的路径变量、查询字符串、请求体 JSON……
        每种方式对应不同的注解。<Text bold>用错注解是新手最常见的 Bug 来源</Text>，本节逐一讲清楚。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、路径变量 @PathVariable</Subtitle>
    <Paragraph>
      URL 路径中的占位符，常用于<Text bold>指定操作哪个资源</Text>（如按 id 查询/删除）。
    </Paragraph>
    <CodeBlock
      code={`// 接口：GET /users/42
@GetMapping("/{id}")
public User getById(@PathVariable Long id) {
    return userService.getById(id);
}

// 路径变量名与参数名不一致时，显式指定
@GetMapping("/orders/{orderId}/items/{itemId}")
public String getOrderItem(
        @PathVariable("orderId") Long oid,
        @PathVariable("itemId")  Long iid) {
    return "order=" + oid + ", item=" + iid;
}`}
    />

    <Divider />

    <Subtitle>二、查询参数 @RequestParam</Subtitle>
    <Paragraph>
      URL 中 <InlineCode>?key=value&key2=value2</InlineCode> 格式的参数，常用于<Text bold>过滤、分页、搜索</Text>。
    </Paragraph>
    <CodeBlock
      code={`// 接口：GET /users?page=1&size=10&keyword=张
@GetMapping
public List<User> list(
        @RequestParam(defaultValue = "1")  int page,     // 有默认值，可不传
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false)    String keyword // 可选参数
) {
    return userService.list(page, size, keyword);
}`}
    />
    <Callout type="tip">
      <InlineCode>required = false</InlineCode> 表示这个参数可以不传（Java 里为 <InlineCode>null</InlineCode>）；
      <InlineCode>defaultValue</InlineCode> 设了默认值后也自动变成非必传。不写这两个属性则<Text bold>默认必传</Text>，缺少会报 400。
    </Callout>

    <Divider />

    <Subtitle>三、请求体 @RequestBody（JSON）</Subtitle>
    <Paragraph>
      POST/PUT 提交 JSON 数据时使用，Spring 自动把 JSON 反序列化为 Java 对象。
    </Paragraph>
    <CodeBlock
      code={`// 接口：POST /users，请求体：{"username":"张三","age":25}
@PostMapping
public User create(@RequestBody User user) {
    // user.getUsername() → "张三"，user.getAge() → 25
    return userService.create(user);
}

// POST /users/search，复杂查询条件也可用 RequestBody
@PostMapping("/search")
public List<User> search(@RequestBody UserSearchDTO dto) {
    return userService.search(dto);
}`}
    />
    <Callout type="warning" title="Content-Type 必须是 application/json">
      使用 <InlineCode>@RequestBody</InlineCode> 时，请求头 <InlineCode>Content-Type</InlineCode> 必须是{' '}
      <InlineCode>application/json</InlineCode>，否则 Spring 不会解析请求体，抛 415 错误。
      用 Postman/Apifox 发 POST 请求时记得选「Body → raw → JSON」。
    </Callout>

    <Divider />

    <Subtitle>四、请求头 @RequestHeader</Subtitle>
    <CodeBlock
      code={`// 从请求头里取 token（认证场景常用）
@GetMapping("/profile")
public User getProfile(
        @RequestHeader("Authorization") String token) {
    // token 值如 "Bearer eyJhbGciOiJIUzI1NiJ9..."
    return userService.getByToken(token);
}`}
    />

    <Divider />

    <Subtitle>五、表单参数（x-www-form-urlencoded）</Subtitle>
    <Paragraph>
      HTML 表单默认提交格式，参数也用 <InlineCode>@RequestParam</InlineCode> 接收（与 GET 查询参数同一个注解）。
      前后端分离的项目<Text bold>很少用这种格式</Text>，了解即可。
    </Paragraph>
    <CodeBlock
      code={`// 表单提交：username=张三&password=123
@PostMapping("/login")
public String login(
        @RequestParam String username,
        @RequestParam String password) {
    return "ok";
}`}
    />

    <Divider />

    <Subtitle>六、五种参数方式速查对比</Subtitle>
    <Table
      head={['注解', '参数位置', '常见场景', '示例']}
      rows={[
        ['@PathVariable', 'URL 路径变量 /{id}', '操作特定资源', 'GET /users/1'],
        ['@RequestParam', 'URL 查询字符串 ?k=v', '过滤、分页、搜索', 'GET /users?page=1'],
        ['@RequestBody', '请求体 JSON', 'POST/PUT 提交对象数据', 'POST /users，体内 JSON'],
        ['@RequestHeader', '请求头', '获取 token、语言等', 'Authorization: Bearer ...'],
        ['无注解（对象）', '查询字符串，自动装配', '多个查询参数打包', '字段名匹配即可'],
      ]}
    />
    <Callout type="note">
      「无注解（对象）」意思是：方法参数是一个普通对象（非 <InlineCode>@RequestBody</InlineCode>），
      Spring 会自动把 URL 查询参数按字段名绑定进去，适合查询条件参数多的场景：
    </Callout>
    <CodeBlock
      code={`// 查询参数自动装配到对象：GET /users?page=1&size=10&keyword=张
@GetMapping
public List<User> list(UserQueryDTO query) {   // 无注解
    // query.getPage() → 1, query.getKeyword() → "张"
    return userService.list(query);
}

// 对应的 DTO
public class UserQueryDTO {
    private int page = 1;
    private int size = 10;
    private String keyword;
    // getter / setter...
}`}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>@PathVariable</InlineCode>：取路径占位符，如 <InlineCode>/users/{'{id}'}</InlineCode>。</ListItem>
        <ListItem><InlineCode>@RequestParam</InlineCode>：取 URL 查询参数，可设 <InlineCode>required=false</InlineCode> 或 <InlineCode>defaultValue</InlineCode>。</ListItem>
        <ListItem><InlineCode>@RequestBody</InlineCode>：接收 JSON 请求体，Content-Type 必须是 <InlineCode>application/json</InlineCode>。</ListItem>
        <ListItem>多个查询参数可以用「无注解对象」接收，字段名匹配自动装配。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
