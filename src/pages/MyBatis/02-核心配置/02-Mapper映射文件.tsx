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
    <Title>Mapper 映射文件详解</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        如果说 <InlineCode>mybatis-config.xml</InlineCode> 是总开关，那 Mapper
        映射文件就是<Text bold>你每天打交道最多的地方</Text>——所有 SQL
        都写在这里。本节讲清 Mapper XML 的整体骨架、四大 CRUD 标签
        （<InlineCode>{'<select>'}</InlineCode>/<InlineCode>{'<insert>'}</InlineCode>/
        <InlineCode>{'<update>'}</InlineCode>/<InlineCode>{'<delete>'}</InlineCode>）
        以及它们的常用属性。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、整体骨架</Subtitle>
    <CodeBlock
      language="xml"
      code={`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!-- namespace 是这份 Mapper 的「命名空间」，必须等于对应接口的全限定名 -->
<mapper namespace="com.example.mapper.UserMapper">

    <!-- 各种 SQL 标签写在这里 -->

</mapper>`}
    />
    <Paragraph>
      <InlineCode>namespace</InlineCode> 有两个作用：① 与 Mapper 接口绑定；
      ② 隔离命名——不同 Mapper 里可以有同名的 <InlineCode>id</InlineCode>，靠
      namespace 区分（最终的 statementId = namespace + "." + id）。
    </Paragraph>

    <Divider />

    <Subtitle>二、四大标签速览</Subtitle>
    <Table
      head={['标签', '用途', '常配返回/主键属性']}
      rows={[
        [<InlineCode>{'<select>'}</InlineCode>, '查询', 'resultType / resultMap'],
        [<InlineCode>{'<insert>'}</InlineCode>, '新增', 'useGeneratedKeys / keyProperty'],
        [<InlineCode>{'<update>'}</InlineCode>, '修改', '返回受影响行数（int）'],
        [<InlineCode>{'<delete>'}</InlineCode>, '删除', '返回受影响行数（int）'],
      ]}
    />
    <Callout type="tip">
      增删改（insert/update/delete）的 Java 方法返回值通常用{' '}
      <InlineCode>int</InlineCode>，表示<Text bold>受影响的行数</Text>，无需在 XML
      里声明返回类型。
    </Callout>

    <Divider />

    <Subtitle>三、select 与它的属性</Subtitle>
    <CodeBlock
      language="xml"
      code={`<select id="selectById"
        parameterType="long"
        resultType="User">
    SELECT * FROM user WHERE id = #{id}
</select>`}
    />
    <Table
      head={['属性', '说明', '是否必填']}
      rows={[
        [<InlineCode>id</InlineCode>, '与接口方法名一致', '必填'],
        [
          <InlineCode>resultType</InlineCode>,
          '结果封装成的类型（每行一个对象）',
          <Text bold>resultType / resultMap 二选一</Text>,
        ],
        [
          <InlineCode>resultMap</InlineCode>,
          '引用自定义映射规则（列名≠字段名、关联查询时用）',
          '同上',
        ],
        [
          <InlineCode>parameterType</InlineCode>,
          '入参类型，一般可省略（MyBatis 能推断）',
          '可省',
        ],
      ]}
    />
    <Callout type="warning" title="resultType vs resultMap 别混">
      <UnorderedList>
        <ListItem>
          <InlineCode>resultType</InlineCode>：列名和字段名能对上时用（配合驼峰映射，
          覆盖绝大多数场景）。
        </ListItem>
        <ListItem>
          <InlineCode>resultMap</InlineCode>：列名与字段名对不上、或要做一对一/一对多
          关联映射时用（下一章专讲）。
        </ListItem>
        <ListItem>两者<Text bold>只能选一个</Text>，同时写会报错。</ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>四、insert / update / delete</Subtitle>
    <CodeBlock
      language="xml"
      code={`<!-- 新增：useGeneratedKeys 让数据库自增主键回填到 user.id -->
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO user (username, age, email)
    VALUES (#{username}, #{age}, #{email})
</insert>

<update id="update">
    UPDATE user SET username = #{username}, age = #{age} WHERE id = #{id}
</update>

<delete id="delete">
    DELETE FROM user WHERE id = #{id}
</delete>`}
    />
    <Paragraph>
      <InlineCode>useGeneratedKeys</InlineCode> 和{' '}
      <InlineCode>keyProperty</InlineCode> 是新增时的高频组合，下一章「增删改与主键回填」
      会专门展开。
    </Paragraph>

    <Divider />

    <Subtitle>五、关于 SQL 里的特殊字符</Subtitle>
    <Paragraph>
      Mapper 是 XML 文件，<InlineCode>{'<'}</InlineCode>、
      <InlineCode>{'&'}</InlineCode> 等是 XML 保留字符，直接写会破坏解析。两种处理方式：
    </Paragraph>
    <Table
      head={['原字符', '转义写法', '示例']}
      rows={[
        [<InlineCode>{'<'}</InlineCode>, <InlineCode>&lt;</InlineCode>, 'age &lt; 30'],
        [<InlineCode>{'<='}</InlineCode>, <InlineCode>&lt;=</InlineCode>, 'age &lt;= 30'],
        [<InlineCode>{'>'}</InlineCode>, <InlineCode>&gt;</InlineCode>, '通常可不转义'],
        [<InlineCode>{'&'}</InlineCode>, <InlineCode>&amp;</InlineCode>, 'a &amp; b'],
      ]}
    />
    <Paragraph>
      或者用 <Text bold>CDATA</Text> 区把整段 SQL 包起来，内部不再解析特殊字符：
    </Paragraph>
    <CodeBlock
      language="xml"
      code={`<select id="selectYoung" resultType="User">
    <![CDATA[
        SELECT * FROM user WHERE age < #{age} AND age > 0
    ]]>
</select>`}
    />
    <Callout type="tip">
      实践中：偶尔一两个 <InlineCode>{'<'}</InlineCode> 用 <InlineCode>&lt;</InlineCode>
      转义；一大段含多个比较符的复杂 SQL，用 <InlineCode>CDATA</InlineCode> 更清爽。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          Mapper 骨架 = DOCTYPE + <InlineCode>{'<mapper namespace="接口全限定名">'}</InlineCode>。
        </ListItem>
        <ListItem>
          四大标签：<InlineCode>{'<select>'}</InlineCode> 配 resultType/resultMap，
          增删改返回受影响行数。
        </ListItem>
        <ListItem>
          <InlineCode>resultType</InlineCode>（能对上字段）与{' '}
          <InlineCode>resultMap</InlineCode>（需自定义映射）二选一。
        </ListItem>
        <ListItem>
          SQL 里的 <InlineCode>{'<'}</InlineCode>/<InlineCode>{'&'}</InlineCode>{' '}
          要转义，或用 <InlineCode>CDATA</InlineCode> 包裹。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
