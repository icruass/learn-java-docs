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
    <Title>MyBatis 动态 SQL 与分页</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        企业接口里最常见的需求是「<Text bold>条件搜索 + 分页</Text>」——
        条件不固定（用户可能只传部分参数），结果要分页。
        这一节讲 MyBatis 的动态 SQL 标签（<InlineCode>{'<if>'}</InlineCode>、
        <InlineCode>{'<foreach>'}</InlineCode>）和分页插件 <Text bold>PageHelper</Text>，
        掌握这两样，日常 80% 的查询需求都能搞定。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、动态 SQL 核心标签</Subtitle>

    <Paragraph>
      <Text bold>{'<if>'}：条件拼接</Text>（最常用）
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<select id="search" resultType="User">
    SELECT * FROM user
    <where>                             <!-- <where> 自动添加 WHERE，并去掉多余的 AND/OR -->
        <if test="username != null and username != ''">
            AND username LIKE CONCAT('%', #{username}, '%')
        </if>
        <if test="minAge != null">
            AND age >= #{minAge}
        </if>
        <if test="maxAge != null">
            AND age &lt;= #{maxAge}      <!-- XML 里 < 要转义为 &lt; -->
        </if>
    </where>
    ORDER BY id DESC
</select>`}
    />

    <Paragraph>
      <Text bold>{'<set>'}：动态 UPDATE</Text>（自动去掉末尾多余的逗号）
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<update id="updateSelective">
    UPDATE user
    <set>
        <if test="username != null">username = #{username},</if>
        <if test="email != null">email = #{email},</if>
        <if test="age != null">age = #{age},</if>
    </set>
    WHERE id = #{id}
</update>`}
    />

    <Paragraph>
      <Text bold>{'<foreach>'}：IN 查询批量操作</Text>
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<!-- 批量查询：SELECT * FROM user WHERE id IN (1, 2, 3) -->
<select id="selectByIds" resultType="User">
    SELECT * FROM user WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>

<!-- 批量插入（效率远高于循环单条插入） -->
<insert id="batchInsert">
    INSERT INTO user (username, email, age) VALUES
    <foreach collection="users" item="u" separator=",">
        (#{u.username}, #{u.email}, #{u.age})
    </foreach>
</insert>`}
    />
    <CodeBlock
      title="对应的 Mapper 接口方法"
      code={`List<User> selectByIds(@Param("ids") List<Long> ids);
int batchInsert(@Param("users") List<User> users);`}
    />
    <Callout type="warning" title="参数用 @Param 明确命名">
      当 Mapper 方法有<Text bold>多个参数</Text>或参数是<Text bold>集合</Text>时，必须用{' '}
      <InlineCode>{'@Param("xxx")'}</InlineCode> 给参数命名，XML 里的 <InlineCode>{'#{xxx}'}</InlineCode> 才能对上。
    </Callout>

    <Divider />

    <Subtitle>二、#{} 和 ${} 的区别（安全必知）</Subtitle>
    <Table
      head={['', '#{}', '${}']}
      rows={[
        ['处理方式', '预编译（PreparedStatement 参数占位符）', '直接字符串替换（字符串拼接）'],
        ['SQL 注入', '安全，自动转义', '有 SQL 注入风险！！！'],
        ['适用场景', '条件值、参数值', '动态表名/列名（极少用，且需严格校验来源）'],
      ]}
    />
    <Callout type="danger" title="永远用 #{} 传参数值">
      <InlineCode>${'$'}{'{username}'}</InlineCode> 会直接把变量值拼入 SQL 字符串，存在 SQL 注入风险。
      <Text bold>传参数值时必须用 <InlineCode>#{'#{}'}</InlineCode></Text>，
      只有在需要动态表名/列名这种极端场景才用 <InlineCode>${'{}'}</InlineCode>，且要严格校验值来源。
    </Callout>

    <Divider />

    <Subtitle>三、分页：PageHelper 插件</Subtitle>
    <Paragraph>
      手写 LIMIT 分页既繁琐又容易出错。<Text bold>PageHelper</Text> 是 MyBatis 最流行的分页插件，
      一行代码搞定分页，并自动计算总数。
    </Paragraph>

    <Paragraph><Text bold>① 引入依赖</Text></Paragraph>
    <CodeBlock
      language="xml"
      title="pom.xml"
      code={`<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>2.1.0</version>
</dependency>`}
    />

    <Paragraph><Text bold>② 配置（可选，默认值通常够用）</Text></Paragraph>
    <CodeBlock
      language="yaml"
      title="application.yml"
      code={`pagehelper:
  helper-dialect: mysql        # 指定数据库方言
  reasonable: true             # pageNum 超出范围时自动修正（< 1 返回第一页，> 总页数返回最后一页）
  support-methods-arguments: true`}
    />

    <Paragraph><Text bold>③ Service 层使用</Text></Paragraph>
    <CodeBlock
      title="UserService 分页查询"
      code={`import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    public PageInfo<User> page(int pageNum, int pageSize, String keyword) {
        // PageHelper.startPage 必须紧接在查询方法之前调用
        PageHelper.startPage(pageNum, pageSize);

        // 这里只写"没有 LIMIT 的普通查询"，PageHelper 自动拦截并追加 LIMIT
        List<User> users = userMapper.search(keyword, null, null);

        // 用 PageInfo 包装，包含 total（总条数）、pages（总页数）、list（当前页数据）等
        return new PageInfo<>(users);
    }
}`}
    />
    <CodeBlock
      title="Controller 接收并返回分页结果"
      code={`@GetMapping
public Result<PageInfo<User>> list(
        @RequestParam(defaultValue = "1")  int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false)    String keyword) {
    return Result.success(userService.page(page, size, keyword));
}`}
    />
    <Paragraph>
      调用 <InlineCode>GET /users?page=1&size=10&keyword=张</InlineCode>，响应 JSON 大致为：
    </Paragraph>
    <CodeBlock
      language="json"
      code={`{
  "code": 200,
  "message": "success",
  "data": {
    "list": [{ "id": 1, "username": "张三" }],
    "total": 1,
    "pageNum": 1,
    "pageSize": 10,
    "pages": 1,
    "isFirstPage": true,
    "isLastPage": true
  }
}`}
    />
    <Callout type="danger" title="PageHelper 最重要的注意事项">
      <InlineCode>PageHelper.startPage()</InlineCode> 调用后，<Text bold>必须紧接着执行查询</Text>（中间不能有其他 DB 操作），
      否则分页会作用到错误的查询上，甚至导致<Text bold>线程安全问题</Text>（PageHelper 用 ThreadLocal 传分页参数）。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>动态 SQL：<InlineCode>{'<where>/<if>'}</InlineCode> 条件拼接，<InlineCode>{'<set>/<if>'}</InlineCode> 动态更新，<InlineCode>{'<foreach>'}</InlineCode> 批量操作。</ListItem>
        <ListItem>参数传值<Text bold>永远用 <InlineCode>#{'#{}'}</InlineCode></Text>，防止 SQL 注入。</ListItem>
        <ListItem>PageHelper：<InlineCode>PageHelper.startPage(page, size)</InlineCode> 紧跟查询调用，用 <InlineCode>PageInfo</InlineCode> 包装结果。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
