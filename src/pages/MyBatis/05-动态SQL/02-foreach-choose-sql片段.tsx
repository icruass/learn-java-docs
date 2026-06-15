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
    <Title>动态 SQL：foreach、choose 与 SQL 片段</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        接上一节，继续动态 SQL 的另外几个利器：
        <InlineCode>{'<foreach>'}</InlineCode> 处理「批量 / IN 查询」，
        <InlineCode>{'<choose>'}</InlineCode> 处理「多选一」分支，
        <InlineCode>{'<sql>'}</InlineCode> + <InlineCode>{'<include>'}</InlineCode>
        复用重复片段。掌握这些，企业里的复杂查询基本都能拼出来。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、foreach：遍历集合</Subtitle>
    <Paragraph>最典型的两个用途：IN 查询、批量插入。</Paragraph>

    <Paragraph>
      <Text bold>① IN 查询</Text>
    </Paragraph>
    <CodeBlock
      language="java"
      code={`List<User> selectByIds(@Param("ids") List<Long> ids);`}
    />
    <CodeBlock
      language="xml"
      code={`<select id="selectByIds" resultType="User">
    SELECT * FROM user WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
<!-- ids = [1,2,3] 时拼成：WHERE id IN (1, 2, 3) -->`}
    />

    <Paragraph>
      <Text bold>② 批量插入</Text>（一条 SQL 插多行，远快于循环单条插）
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<insert id="batchInsert">
    INSERT INTO user (username, age, email) VALUES
    <foreach collection="users" item="u" separator=",">
        (#{u.username}, #{u.age}, #{u.email})
    </foreach>
</insert>`}
    />
    <Paragraph><InlineCode>{'<foreach>'}</InlineCode> 的五个属性：</Paragraph>
    <Table
      head={['属性', '含义']}
      rows={[
        [<InlineCode>collection</InlineCode>, '要遍历的集合（@Param 指定的名字；List 默认名是 list，数组是 array）'],
        [<InlineCode>item</InlineCode>, '每次迭代的元素变量名，SQL 里用 #{item} 引用'],
        [<InlineCode>open</InlineCode>, '整体前缀，如 ('],
        [<InlineCode>separator</InlineCode>, '元素之间的分隔符，如 ,'],
        [<InlineCode>close</InlineCode>, '整体后缀，如 )'],
      ]}
    />
    <Callout type="warning" title="两个实战注意点">
      <UnorderedList>
        <ListItem>
          <Text bold>空集合要先判断</Text>：IN 里集合为空会拼出{' '}
          <InlineCode>IN ()</InlineCode> 语法错误，调用前先判非空，或用{' '}
          <InlineCode>{'<if>'}</InlineCode> 包一层。
        </ListItem>
        <ListItem>
          <Text bold>批量别太大</Text>：一次几千上万条会超出 SQL 长度 / 占位符上限，
          建议分批（如每 500 条一批）。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>二、choose / when / otherwise：多选一</Subtitle>
    <Paragraph>
      类似 Java 的 <InlineCode>switch</InlineCode>：从上往下，<Text bold>只命中第一个</Text>
      成立的 <InlineCode>{'<when>'}</InlineCode>，都不成立才走{' '}
      <InlineCode>{'<otherwise>'}</InlineCode>。适合「按优先级选一个查询条件」：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<select id="searchByPriority" resultType="User">
    SELECT * FROM user
    <where>
        <choose>
            <when test="id != null">
                AND id = #{id}                 <!-- 有 id 就只按 id 查 -->
            </when>
            <when test="username != null and username != ''">
                AND username = #{username}     <!-- 否则按用户名查 -->
            </when>
            <otherwise>
                AND status = 1                 <!-- 都没有就查默认：启用状态 -->
            </otherwise>
        </choose>
    </where>
</select>`}
    />
    <Callout type="tip">
      <InlineCode>{'<if>'}</InlineCode> 是「每个独立判断，可同时成立多个」；
      <InlineCode>{'<choose>'}</InlineCode> 是「互斥，只取一个」。按需求选用。
    </Callout>

    <Divider />

    <Subtitle>三、sql + include：复用 SQL 片段</Subtitle>
    <Paragraph>
      多个查询反复写一长串字段列表，既啰嗦又难维护。
      <InlineCode>{'<sql>'}</InlineCode> 定义可复用片段，
      <InlineCode>{'<include>'}</InlineCode> 引用它：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<!-- 定义片段：常用列清单（避免 SELECT *，又不想到处重复） -->
<sql id="baseColumns">
    id, username, age, email, create_time
</sql>

<select id="selectById" resultType="User">
    SELECT <include refid="baseColumns"/> FROM user WHERE id = #{id}
</select>

<select id="selectAll" resultType="User">
    SELECT <include refid="baseColumns"/> FROM user
</select>`}
    />
    <Callout type="tip">
      改字段时只改 <InlineCode>{'<sql>'}</InlineCode> 一处，所有引用处同步生效。
      跨 Mapper 引用时，<InlineCode>refid</InlineCode> 要带 namespace，如{' '}
      <InlineCode>refid="com.example.mapper.UserMapper.baseColumns"</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>四、bind：预处理变量（模糊查询更优雅）</Subtitle>
    <Paragraph>
      <InlineCode>{'<bind>'}</InlineCode> 能在 SQL 执行前算一个变量。常用来拼模糊查询的
      <InlineCode>%keyword%</InlineCode>，比 <InlineCode>CONCAT</InlineCode>
      更直观且数据库无关：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<select id="searchByName" resultType="User">
    <bind name="pattern" value="'%' + keyword + '%'"/>
    SELECT * FROM user WHERE username LIKE #{pattern}
</select>`}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          <InlineCode>{'<foreach>'}</InlineCode>：IN 查询与批量插入；注意空集合判断、批量分批。
        </ListItem>
        <ListItem>
          <InlineCode>{'<choose>/<when>/<otherwise>'}</InlineCode>：互斥多选一，类似 switch。
        </ListItem>
        <ListItem>
          <InlineCode>{'<sql>+<include>'}</InlineCode>：抽取复用片段，统一维护字段列表。
        </ListItem>
        <ListItem>
          <InlineCode>{'<bind>'}</InlineCode>：执行前算变量，模糊查询更优雅。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
