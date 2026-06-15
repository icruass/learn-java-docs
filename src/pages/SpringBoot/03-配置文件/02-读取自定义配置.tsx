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
    <Title>读取自定义配置</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        除了 Spring Boot 内置的配置项，你经常需要在 yml 里写<Text bold>自己的业务配置</Text>
        （如 OSS 密钥、业务开关、分页大小等），然后在代码里读出来。
        本节讲两种主流读法：简单场景用 <InlineCode>@Value</InlineCode>，
        成组的配置用 <InlineCode>@ConfigurationProperties</InlineCode>。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、@Value：读单个配置项</Subtitle>
    <Paragraph>
      最直接的方式：用 <InlineCode>{'@Value("${key}")'}</InlineCode> 注解注入到字段上。
    </Paragraph>
    <CodeBlock
      language="yaml"
      title="application.yml"
      code={`app:
  name: 我的应用
  version: 1.0.0
  page-size: 20`}
    />
    <CodeBlock
      title="读取方式"
      code={`import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppInfo {

    @Value("\${app.name}")
    private String name;

    @Value("\${app.version}")
    private String version;

    // 可以指定默认值，配置项不存在时使用默认值（不会报错）
    @Value("\${app.page-size:10}")
    private int pageSize;
}`}
    />
    <Callout type="warning">
      <UnorderedList>
        <ListItem>
          <Text bold>配置项不存在且没有默认值</Text>：启动时抛 <InlineCode>IllegalArgumentException</InlineCode>，应用起不来。
        </ListItem>
        <ListItem>
          <Text bold>@Value 只能注入到 Bean 里</Text>（即 Spring 管理的对象）。普通 <InlineCode>new</InlineCode> 出来的对象不走容器，注入无效。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>二、@ConfigurationProperties：读一组配置（推荐）</Subtitle>
    <Paragraph>
      当配置项成组出现时（如 OSS 的 accessKey / secretKey / bucket / endpoint），
      用 <InlineCode>@ConfigurationProperties</InlineCode> 把整组配置映射到一个类，更优雅、更易维护。
    </Paragraph>
    <CodeBlock
      language="yaml"
      title="application.yml"
      code={`oss:
  access-key: AKIDxxxxxxxxxxxxx
  secret-key: secretxxxxxxxxxx
  bucket: my-bucket
  endpoint: https://oss-cn-hangzhou.aliyuncs.com`}
    />
    <CodeBlock
      title="OssProperties.java（配置属性类）"
      code={`import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "oss")   // prefix 对应 yml 里的顶级 key
public class OssProperties {

    private String accessKey;    // yml: oss.access-key → 自动映射为驼峰 accessKey
    private String secretKey;
    private String bucket;
    private String endpoint;

    // 必须提供 getter/setter（Spring 靠 setter 赋值）
    // 推荐用 Lombok @Data 自动生成
    public String getAccessKey() { return accessKey; }
    public void setAccessKey(String accessKey) { this.accessKey = accessKey; }
    // ... 其他字段 getter/setter 省略
}`}
    />
    <CodeBlock
      title="在 Service 里注入并使用"
      code={`import org.springframework.stereotype.Service;

@Service
public class OssService {

    private final OssProperties ossProperties;   // 构造器注入

    public OssService(OssProperties ossProperties) {
        this.ossProperties = ossProperties;
    }

    public void upload(String filename, byte[] content) {
        System.out.println("bucket: " + ossProperties.getBucket());
        System.out.println("endpoint: " + ossProperties.getEndpoint());
        // 用 ossProperties 里的配置初始化 OSS 客户端...
    }
}`}
    />
    <Callout type="tip" title="yml 下划线/短横线 → Java 驼峰">
      Spring Boot 的「宽松绑定」会自动把配置项的 <InlineCode>access-key</InlineCode>（短横线）、
      <InlineCode>access_key</InlineCode>（下划线）、<InlineCode>accessKey</InlineCode>（驼峰）全部映射到 Java 字段
      <InlineCode>accessKey</InlineCode>，写哪种风格都行，yml 里推荐用短横线。
    </Callout>

    <Divider />

    <Subtitle>三、两种方式对比</Subtitle>
    <Table
      head={['', '@Value', '@ConfigurationProperties']}
      rows={[
        ['适用场景', '读 1~2 个散落的配置项', '读成组的业务配置'],
        ['类型安全', '只能注入 String，需手动转换', '自动类型绑定（List、Map、嵌套类均支持）'],
        ['IDE 提示', '较弱', '加 processor 依赖后有完整提示与校验'],
        ['可读性', '配置散在各处字段里', '集中在一个 Properties 类，一目了然'],
      ]}
    />
    <Paragraph>
      <Text bold>实际项目建议</Text>：业务配置成组的统一用 <InlineCode>@ConfigurationProperties</InlineCode>；
      只读一两个无关联的值用 <InlineCode>@Value</InlineCode> 即可。
    </Paragraph>

    <Divider />

    <Subtitle>四、配置类中注册 Bean</Subtitle>
    <Paragraph>
      有时需要根据配置值创建一个第三方库的对象（如 Redis 客户端、OSS 客户端），可在
      <InlineCode>@Configuration</InlineCode> 类里用 <InlineCode>@Bean</InlineCode> 注册：
    </Paragraph>
    <CodeBlock
      title="config/OssConfig.java"
      code={`import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration   // 标记为配置类（本质也是一个 @Component）
public class OssConfig {

    @Bean   // 方法返回值注册为 Bean，方法名即 Bean 名称
    public OssClient ossClient(OssProperties props) {
        // 用配置初始化第三方客户端，返回后由 Spring 容器托管
        return OssClient.builder()
            .endpoint(props.getEndpoint())
            .accessKey(props.getAccessKey())
            .secretKey(props.getSecretKey())
            .build();
    }
}`}
    />
    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><InlineCode>{'@Value("${key:默认值}")'}</InlineCode>：注入单个配置，简单直接。</ListItem>
        <ListItem><InlineCode>@ConfigurationProperties(prefix = "xxx")</InlineCode>：把一组配置映射到类，类型安全、可读性好，<Text bold>成组配置首选</Text>。</ListItem>
        <ListItem><InlineCode>@Configuration + @Bean</InlineCode>：向容器注册第三方对象，结合配置属性类使用。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
