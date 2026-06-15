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
    <Title>参数传递详解（含 #{'{}'} 与 ${'{}'} 区别）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        「参数怎么从 Java 方法传到 SQL」是新手最容易踩坑的地方：单个参数能直接用、
        多个参数却要加 <InlineCode>@Param</InlineCode>、对象用属性名取值……本节系统梳理
        <Text bold>四种传参场景</Text>，并讲透 MyBatis 里最重要的安全知识点——
        <InlineCode>#{'{}'}</InlineCode> 和 <InlineCode>${'{}'}</InlineCode> 的区别。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、单个简单参数</Subtitle>
    <Paragraph>
      只有一个参数（且不是对象）时，<InlineCode>#{'{}'}</InlineCode>{' '}
      里的名字可以随便写，MyBatis 不看名字，直接把唯一的参数填进去：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`User selectById(Long id);`}
    />
    <CodeBlock
      language="xml"
      code={`<!-- 写 #{id}、#{xxx} 都行，但建议与形参同名，可读性好 -->
<select id="selectById" resultType="User">
    SELECT * FROM user WHERE id = #{id}
</select>`}
    />

    <Divider />

    <Subtitle>二、多个参数：必须用 @Param（重点）</Subtitle>
    <Paragraph>
      有多个参数时，<Text bold>必须</Text>给每个参数加{' '}
      <InlineCode>@Param</InlineCode> 命名，XML 里才能用这个名字引用：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`import org.apache.ibatis.annotations.Param;

List<User> selectByNameAndAge(@Param("name") String name,
                              @Param("age") Integer age);`}
    />
    <CodeBlock
      language="xml"
      code={`<select id="selectByNameAndAge" resultType="User">
    SELECT * FROM user
    WHERE username = #{name} AND age = #{age}
</select>`}
    />
    <Callout type="danger" title="不加 @Param 会报错">
      若不加 <InlineCode>@Param</InlineCode>，MyBatis 默认把多参数包成
      <InlineCode>arg0/arg1</InlineCode>、<InlineCode>param1/param2</InlineCode>，
      你写 <InlineCode>#{'{name}'}</InlineCode> 就会报
      <InlineCode>Parameter 'name' not found</InlineCode>。
      <Text bold>多参数一律加 @Param，这是企业铁律。</Text>
    </Callout>

    <Divider />

    <Subtitle>三、对象参数（POJO）</Subtitle>
    <Paragraph>
      传一个对象时，<InlineCode>#{'{}'}</InlineCode> 里直接写
      <Text bold>属性名</Text>，MyBatis 调对应 getter 取值：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`int insert(User user);`}
    />
    <CodeBlock
      language="xml"
      code={`<insert id="insert">
    INSERT INTO user (username, age, email)
    VALUES (#{username}, #{age}, #{email})   <!-- 取 user.getUsername() 等 -->
</insert>`}
    />
    <Callout type="tip">
      嵌套对象用「点」取值，如 <InlineCode>#{'{dept.name}'}</InlineCode> 取{' '}
      <InlineCode>user.getDept().getName()</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>四、Map 参数</Subtitle>
    <Paragraph>
      参数特别多、又懒得建对象时，可以传 <InlineCode>Map</InlineCode>，
      <InlineCode>#{'{}'}</InlineCode> 里写 key：
    </Paragraph>
    <CodeBlock
      language="java"
      code={`int updateEmail(Map<String, Object> param);

// 调用
Map<String, Object> param = new HashMap<>();
param.put("id", 1L);
param.put("email", "new@example.com");
mapper.updateEmail(param);`}
    />
    <CodeBlock
      language="xml"
      code={`<update id="updateEmail">
    UPDATE user SET email = #{email} WHERE id = #{id}
</update>`}
    />
    <Callout type="warning">
      Map 传参灵活但<Text bold>弱类型、无编译检查</Text>，key 拼错只能运行时才发现。
      企业开发更推荐用对象或 <InlineCode>@Param</InlineCode>，可读性和安全性都更好。
    </Callout>

    <Divider />

    <Subtitle>五、核心安全知识：#{'{}'} 与 ${'{}'} 的区别</Subtitle>
    <Paragraph>这是 MyBatis 面试和实战的高频考点，务必理解透：</Paragraph>
    <Table
      head={['对比项', <InlineCode>#{'{}'}</InlineCode>, <InlineCode>${'{}'}</InlineCode>]}
      rows={[
        [
          '处理方式',
          '预编译占位符（PreparedStatement 的 ?）',
          '直接字符串替换（拼进 SQL）',
        ],
        ['是否带引号', '自动按类型加引号/转义', '原样拼接，不加引号'],
        [
          'SQL 注入',
          <Text bold>安全</Text>,
          <Text bold>有注入风险！</Text>,
        ],
        [
          '典型用途',
          '传「值」：条件值、参数值（99% 用它）',
          '传「SQL 片段」：动态表名/列名/排序方向',
        ],
      ]}
    />
    <Paragraph>看一眼它们生成的 SQL 就明白了：</Paragraph>
    <CodeBlock
      language="text"
      code={`SQL 模板：SELECT * FROM user WHERE username = #{name}
传入 name = "张三"
最终执行：SELECT * FROM user WHERE username = ?     （? 再用 PreparedStatement 安全绑定 "张三"）

SQL 模板：SELECT * FROM user WHERE username = ${'$'}{name}
传入 name = "张三"
最终执行：SELECT * FROM user WHERE username = 张三   （直接拼接，没有引号，还会被注入）`}
    />
    <Callout type="danger" title="${} 的注入风险演示">
      <Paragraph>
        如果用 <InlineCode>{'${name}'}</InlineCode>，攻击者传入{' '}
        <InlineCode>{`' OR '1'='1`}</InlineCode>，SQL 就变成
        <InlineCode>{`WHERE username = '' OR '1'='1'`}</InlineCode>——整张表被查出来。
        <Text bold>传值永远用 #{'{}'}。</Text>
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>六、${'{}'} 唯一合理的用途：动态表名 / 排序</Subtitle>
    <Paragraph>
      <InlineCode>#{'{}'}</InlineCode> 是占位符，<Text bold>不能用于表名、列名、ORDER BY 方向</Text>
      （那些不是「值」，加引号就错了）。这种场景才用 <InlineCode>${'{}'}</InlineCode>，
      但<Text bold>必须严格校验来源</Text>：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<!-- 动态排序字段和方向：只能用 ${'$'}{}，但 orderBy 必须是后端白名单校验过的值 -->
<select id="listOrderBy" resultType="User">
    SELECT * FROM user ORDER BY ${'$'}{orderBy} ${'$'}{direction}
</select>`}
    />
    <Callout type="warning" title="用 ${} 时务必白名单校验">
      传给 <InlineCode>{'${}'}</InlineCode> 的值<Text bold>绝不能直接来自前端</Text>。
      正确做法：后端用枚举或白名单（如只允许 <InlineCode>id</InlineCode>/
      <InlineCode>age</InlineCode>、<InlineCode>ASC</InlineCode>/<InlineCode>DESC</InlineCode>）
      校验后再传入，杜绝注入。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>单参数随意命名；<Text bold>多参数必须 @Param</Text>；对象用属性名；Map 用 key。</ListItem>
        <ListItem>
          <InlineCode>#{'{}'}</InlineCode> = 预编译占位符，<Text bold>安全</Text>，传值就用它。
        </ListItem>
        <ListItem>
          <InlineCode>{'${}'}</InlineCode> = 字符串拼接，<Text bold>有注入风险</Text>，
          只在动态表名/列名/排序时用，且必须白名单校验。
        </ListItem>
        <ListItem>一句话：<Text bold>传值用 #、传 SQL 片段才用 $</Text>。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
