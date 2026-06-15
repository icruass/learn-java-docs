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
  DocLink,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>动态 SQL：if / where / set / trim</Title>

    <Callout type="note" title="本章导读">
      <Paragraph>
        动态 SQL 是 MyBatis 的<Text bold>招牌能力</Text>，也是它压过 JDBCTemplate
        的关键。企业里「条件搜索」无处不在——用户传了哪个条件就按哪个查，没传就不加。
        靠 Java 拼字符串又丑又危险，MyBatis 用 <InlineCode>{'<if>'}</InlineCode>、
        <InlineCode>{'<where>'}</InlineCode>、<InlineCode>{'<set>'}</InlineCode>、
        <InlineCode>{'<trim>'}</InlineCode> 这几个标签优雅解决。本节是动态 SQL 的核心。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、if：条件拼接</Subtitle>
    <Paragraph>
      <InlineCode>{'<if test="条件">'}</InlineCode> 里的 SQL 片段，只有
      <InlineCode>test</InlineCode> 为真时才拼进去。<InlineCode>test</InlineCode>
      用的是 OGNL 表达式（直接写参数名即可）：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<select id="search" resultType="User">
    SELECT * FROM user WHERE 1 = 1
    <if test="username != null and username != ''">
        AND username LIKE CONCAT('%', #{username}, '%')
    </if>
    <if test="age != null">
        AND age = #{age}
    </if>
</select>`}
    />
    <Callout type="warning" title="为什么这里写了 WHERE 1 = 1">
      如果不写 <InlineCode>1 = 1</InlineCode>，当 username 为空、age
      不为空时，拼出来是 <InlineCode>WHERE AND age = ?</InlineCode>——多了个 AND，语法错误。
      <InlineCode>1 = 1</InlineCode> 是一种「兜底」写法，但<Text bold>不够优雅</Text>，
      正解是下面的 <InlineCode>{'<where>'}</InlineCode>。
    </Callout>

    <Divider />

    <Subtitle>二、where：自动处理 WHERE 和多余的 AND/OR</Subtitle>
    <Paragraph>
      <InlineCode>{'<where>'}</InlineCode> 标签很聪明：① 只有内部有内容时才生成{' '}
      <InlineCode>WHERE</InlineCode>；② 自动去掉紧跟在 WHERE 后面
      <Text bold>多余的 AND / OR</Text>。于是 <InlineCode>1 = 1</InlineCode> 可以彻底扔掉：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<select id="search" resultType="User">
    SELECT * FROM user
    <where>
        <if test="username != null and username != ''">
            AND username LIKE CONCAT('%', #{username}, '%')
        </if>
        <if test="age != null">
            AND age = #{age}
        </if>
    </where>
</select>`}
    />
    <Paragraph>效果：</Paragraph>
    <UnorderedList>
      <ListItem>两个条件都没传 → 不生成 WHERE，查全部；</ListItem>
      <ListItem>
        只传 age → <InlineCode>WHERE age = ?</InlineCode>（开头多余的 AND 被自动去掉）；
      </ListItem>
      <ListItem>
        都传 → <InlineCode>WHERE username LIKE ? AND age = ?</InlineCode>。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>三、set：动态 UPDATE</Subtitle>
    <Paragraph>
      更新时常常只想改「传了值的字段」（部分更新）。<InlineCode>{'<set>'}</InlineCode>{' '}
      会自动加 <InlineCode>SET</InlineCode> 并去掉末尾<Text bold>多余的逗号</Text>：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<update id="updateSelective">
    UPDATE user
    <set>
        <if test="username != null">username = #{username},</if>
        <if test="age != null">age = #{age},</if>
        <if test="email != null">email = #{email},</if>
    </set>
    WHERE id = #{id}
</update>`}
    />
    <Callout type="danger" title="动态更新一定要带 WHERE">
      <InlineCode>{'<set>'}</InlineCode> 只管 SET 子句。<Text bold>WHERE 条件要写在
      {' <set> '}外面</Text>，且务必保证有 WHERE——否则会更新全表！
      另外若所有 <InlineCode>{'<if>'}</InlineCode> 都不成立，<InlineCode>{'<set>'}</InlineCode>
      为空会生成非法 SQL，业务上应保证至少有一个字段要改。
    </Callout>

    <Divider />

    <Subtitle>四、trim：where / set 的「底层通用版」</Subtitle>
    <Paragraph>
      <InlineCode>{'<where>'}</InlineCode> 和 <InlineCode>{'<set>'}</InlineCode> 其实是
      <InlineCode>{'<trim>'}</InlineCode> 的特例。<InlineCode>{'<trim>'}</InlineCode>
      可以自定义「加什么前缀/后缀、去掉什么前缀/后缀」，应对更灵活的场景：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<!-- 等价于 <where> -->
<trim prefix="WHERE" prefixOverrides="AND |OR ">
    ...
</trim>

<!-- 等价于 <set> -->
<trim prefix="SET" suffixOverrides=",">
    ...
</trim>`}
    />
    <Paragraph>四个属性的含义：</Paragraph>
    <UnorderedList>
      <ListItem>
        <InlineCode>prefix</InlineCode> / <InlineCode>suffix</InlineCode>：
        在内容前 / 后加上指定字符串（仅当内容非空）；
      </ListItem>
      <ListItem>
        <InlineCode>prefixOverrides</InlineCode> / <InlineCode>suffixOverrides</InlineCode>：
        去掉内容开头 / 结尾匹配到的字符串（用 <InlineCode>|</InlineCode> 分隔多个候选）。
      </ListItem>
    </UnorderedList>
    <Callout type="tip">
      日常 90% 的场景用 <InlineCode>{'<where>'}</InlineCode> 和{' '}
      <InlineCode>{'<set>'}</InlineCode> 就够了，更简洁；只有它们满足不了的特殊拼接
      （比如自定义前后缀）才动用 <InlineCode>{'<trim>'}</InlineCode>。
    </Callout>

    <Callout type="success" title="本章小结">
      <UnorderedList>
        <ListItem>
          <InlineCode>{'<if test="...">'}</InlineCode>：条件成立才拼接，test 用 OGNL。
        </ListItem>
        <ListItem>
          <InlineCode>{'<where>'}</InlineCode>：自动加 WHERE、去掉开头多余 AND/OR，取代 <InlineCode>1=1</InlineCode>。
        </ListItem>
        <ListItem>
          <InlineCode>{'<set>'}</InlineCode>：动态 UPDATE，自动去末尾逗号；<Text bold>WHERE 写在外面别漏</Text>。
        </ListItem>
        <ListItem>
          <InlineCode>{'<trim>'}</InlineCode>：where/set 的通用底座，需自定义前后缀时才用。
        </ListItem>
        <ListItem>
          下一节看 <DocLink to="/MyBatis/05/02">foreach、choose 与 SQL 片段复用</DocLink>。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
