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
    <Title>resultMap 基础</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        前面查询都用 <InlineCode>resultType</InlineCode>，它能自动把「同名列」映射到
        Java 字段。但现实中列名和字段名经常对不上（下划线 vs 驼峰、别名、历史命名），
        这时就要用 <InlineCode>resultMap</InlineCode> 自定义映射规则。
        <InlineCode>resultMap</InlineCode> 是 MyBatis
        <Text bold>最强大的特性</Text>，也是关联查询的基础，本节先打牢它的基本用法。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、为什么需要 resultMap</Subtitle>
    <Paragraph>
      <InlineCode>resultType</InlineCode> 的自动映射规则是：
      <Text bold>把列名当作属性名去找同名字段</Text>。一旦列名 ≠ 字段名，那一列就映射不上，
      对应字段是 <InlineCode>null</InlineCode>。例如表用下划线、实体用驼峰：
    </Paragraph>
    <CodeBlock
      language="sql"
      code={`-- 表结构：列名是下划线风格
CREATE TABLE t_user (
    user_id     BIGINT PRIMARY KEY,
    user_name   VARCHAR(50),
    create_time DATETIME
);`}
    />
    <CodeBlock
      language="java"
      code={`// 实体：字段是驼峰风格
public class User {
    private Long id;             // 对应 user_id（名字还不一样）
    private String userName;     // 对应 user_name
    private LocalDateTime createTime;  // 对应 create_time
}`}
    />
    <Paragraph>
      用 <InlineCode>resultType="User"</InlineCode> 查询，
      <InlineCode>user_name</InlineCode>/<InlineCode>create_time</InlineCode>{' '}
      都映射不上（字段全是 null）。解决办法有两个。
    </Paragraph>

    <Divider />

    <Subtitle>二、先试最省事的：开启驼峰映射</Subtitle>
    <Paragraph>
      如果差异<Text bold>仅仅是「下划线 ↔ 驼峰」</Text>，根本不用写 resultMap，
      开一个全局设置即可（前面配置章节讲过）：
    </Paragraph>
    <CodeBlock
      language="xml"
      title="mybatis-config.xml"
      code={`<settings>
    <setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>`}
    />
    <Paragraph>
      开启后，<InlineCode>user_name → userName</InlineCode>、
      <InlineCode>create_time → createTime</InlineCode> 自动对应。
    </Paragraph>
    <Callout type="warning">
      但驼峰映射救不了 <InlineCode>user_id → id</InlineCode> 这种
      <Text bold>名字本质不同</Text>的情况（它只处理下划线转驼峰）。这就得靠
      resultMap，或在 SQL 里用别名 <InlineCode>SELECT user_id AS id</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>三、resultMap 的写法</Subtitle>
    <Paragraph>
      在 Mapper XML 里先定义一个 <InlineCode>{'<resultMap>'}</InlineCode>，再让查询用{' '}
      <InlineCode>resultMap="xxx"</InlineCode> 引用它（注意：是 resultMap 不是 resultType）：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<!-- id：本 resultMap 的唯一标识；type：映射成的 Java 类型 -->
<resultMap id="userMap" type="User">
    <!-- <id> 映射主键列（用于缓存和关联去重，性能更好） -->
    <id     property="id"         column="user_id"/>
    <!-- <result> 映射普通列：property=Java 字段，column=数据库列 -->
    <result property="userName"   column="user_name"/>
    <result property="createTime" column="create_time"/>
</resultMap>

<!-- 查询引用上面的 resultMap -->
<select id="selectById" resultMap="userMap">
    SELECT user_id, user_name, create_time FROM t_user WHERE user_id = #{id}
</select>`}
    />
    <Table
      head={['标签 / 属性', '含义']}
      rows={[
        [<InlineCode>{'<resultMap id type>'}</InlineCode>, '定义一条映射规则，type 是目标类型'],
        [<InlineCode>{'<id>'}</InlineCode>, '映射主键列（一个 resultMap 建议都配上）'],
        [<InlineCode>{'<result>'}</InlineCode>, '映射普通列'],
        [<InlineCode>property</InlineCode>, 'Java 实体的字段名'],
        [<InlineCode>column</InlineCode>, '数据库的列名（或 SQL 里的别名）'],
      ]}
    />
    <Callout type="tip" title="为什么主键要用 <id> 而不是 <result>">
      <InlineCode>{'<id>'}</InlineCode> 告诉 MyBatis「这是主键」，在做<Text bold>关联结果去重</Text>
      （一对多的嵌套映射）和缓存时，MyBatis 靠它判断两行是不是同一个对象，
      性能和正确性都更好。所以即便列名能对上，也建议显式写 <InlineCode>{'<id>'}</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>四、自动映射 + 手动映射混用</Subtitle>
    <Paragraph>
      默认情况下，<InlineCode>resultMap</InlineCode> 里
      <Text bold>没显式声明的列，仍会按自动映射规则尝试匹配</Text>。
      所以常见做法是：只为「对不上的列」写 <InlineCode>{'<result>'}</InlineCode>，
      其余同名列交给自动映射，省去逐字段罗列：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<resultMap id="userMap" type="User">
    <id     property="id"       column="user_id"/>     <!-- 名字不同，手动 -->
    <result property="userName" column="user_name"/>   <!-- 若开了驼峰，这行也能省 -->
    <!-- email、age 等同名列：不写，自动映射 -->
</resultMap>`}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          列名 = 字段名（或仅下划线/驼峰差异）→ 用 <InlineCode>resultType</InlineCode> +
          <InlineCode>mapUnderscoreToCamelCase</InlineCode> 即可。
        </ListItem>
        <ListItem>
          名字本质不同、或需关联映射 → 用 <InlineCode>resultMap</InlineCode>。
        </ListItem>
        <ListItem>
          resultMap 用 <InlineCode>{'<id>'}</InlineCode>（主键）+
          <InlineCode>{'<result>'}</InlineCode>（普通列）配 property/column。
        </ListItem>
        <ListItem>
          未声明的同名列仍走自动映射，可只写「对不上的列」。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
