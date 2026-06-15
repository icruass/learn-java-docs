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
    <Title>IoC 与 DI 核心思想</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>IoC（控制反转）和 DI（依赖注入）是整个 Spring 的地基</Text>。
        理解了它，你才能明白为什么 Spring Boot 里到处是 <InlineCode>@Service</InlineCode>、
        <InlineCode>@Autowired</InlineCode>，以及「对象到底是谁创建的」。
        这一节不背概念，而是从「痛点 → 解法」一步步推导出来。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、传统方式的痛点：强耦合</Subtitle>
    <Paragraph>
      假设 Controller（控制层）要调用 Service（业务层），Service 又要调用 Dao（数据访问层）。
      用最朴素的写法，就是层层 <InlineCode>new</InlineCode>：
    </Paragraph>
    <CodeBlock
      title="强耦合的写法（反面教材）"
      code={`public class UserService {
    // 业务层自己 new 出数据访问层 —— 写死了具体实现
    private UserDao userDao = new UserDaoMySQLImpl();

    public User getUser(int id) {
        return userDao.findById(id);
    }
}`}
    />
    <Paragraph>问题在哪？</Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>换实现要改源码</Text>：哪天要把 <InlineCode>UserDaoMySQLImpl</InlineCode> 换成
        <InlineCode>UserDaoOracleImpl</InlineCode>，得回来改这行 <InlineCode>new</InlineCode>。
      </ListItem>
      <ListItem>
        <Text bold>对象关系散落各处</Text>：成百上千个对象互相 <InlineCode>new</InlineCode>，谁依赖谁、谁先创建，全靠人脑维护。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>二、IoC：把「控制权」交出去</Subtitle>
    <Paragraph>
      <Text bold>IoC（Inversion of Control，控制反转）</Text>的核心思想是：
      <Text accent bold>对象的创建权，从「程序员手动 new」反转给「Spring 容器」统一负责</Text>。
    </Paragraph>
    <CodeBlock
      language="text"
      title="控制权的反转"
      code={`传统：  你的代码 ──new──> 创建对象、管理对象（控制权在你手里）

IoC ： Spring 容器 ──创建/管理──> 所有对象（控制权交给了容器）
       你的代码 ──向容器要──> 拿到现成的对象`}
    />
    <Paragraph>
      这个「容器」就是 <Text bold>Spring 容器（ApplicationContext）</Text>。被它管理的对象，统称为
      <Text accent bold>Bean</Text>。Spring Boot 启动时，容器会自动创建并持有这些 Bean，用的时候直接「取」即可。
    </Paragraph>

    <Divider />

    <Subtitle>三、DI：容器主动把依赖「喂」给你</Subtitle>
    <Paragraph>
      <Text bold>DI（Dependency Injection，依赖注入）是 IoC 的具体实现手段</Text>。
      当容器发现「UserService 需要一个 UserDao」时，会主动从容器里找到合适的 Bean，
      <Text bold>注入（赋值）</Text>给 UserService——你不用自己 <InlineCode>new</InlineCode>。
    </Paragraph>
    <Callout type="tip">
      一句话理解二者关系：<Text bold>IoC 是「思想/目标」（控制权交给容器），DI 是「做法/手段」（容器把依赖注入进来）</Text>。
    </Callout>

    <Divider />

    <Subtitle>四、在 Spring Boot 里怎么用</Subtitle>
    <Paragraph>分两步：① 把类「交给容器管理」；② 在需要的地方「让容器注入」。</Paragraph>

    <Paragraph>
      <Text bold>第一步：用注解声明 Bean。</Text> 在类上加注解，Spring 启动时会扫描并把它们创建为 Bean：
    </Paragraph>
    <Table
      head={['注解', '语义（贴哪一层）', '说明']}
      rows={[
        ['@Component', '通用组件', '最基础的「交给容器管理」注解'],
        ['@Controller / @RestController', '控制层（Web 接口）', '处理 HTTP 请求'],
        ['@Service', '业务逻辑层', '写核心业务'],
        ['@Repository', '数据访问层', '操作数据库'],
      ]}
    />
    <Callout type="note">
      后三个本质上都是 <InlineCode>@Component</InlineCode> 的「特化版」，功能一样，只是<Text bold>语义更清晰</Text>，
      让人一眼看出这个类属于哪一层。
    </Callout>

    <Paragraph>
      <Text bold>第二步：注入依赖。</Text> 下面把上面的反面教材改造成 Spring 风格：
    </Paragraph>
    <CodeBlock
      title="UserService.java（推荐：构造器注入）"
      code={`import org.springframework.stereotype.Service;

@Service  // ① 交给容器管理，成为一个 Bean
public class UserService {

    private final UserDao userDao;

    // ② 构造器注入：容器创建 UserService 时，自动把容器里的 UserDao Bean 传进来
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public User getUser(int id) {
        return userDao.findById(id);
    }
}`}
    />
    <Paragraph>
      注意：这里依赖的是 <InlineCode>UserDao</InlineCode>「接口」，而不是某个具体实现类。
      换实现时只要换一个被容器管理的实现 Bean，<Text bold>这段业务代码一个字都不用改</Text>——这就是 IoC/DI 解耦的价值。
    </Paragraph>

    <Divider />

    <Subtitle>五、三种注入方式与选择</Subtitle>
    <CodeBlock
      title="三种写法对比"
      code={`@Service
public class OrderService {

    // 写法1：字段注入（@Autowired 直接放字段上）—— 简洁，但不推荐
    @Autowired
    private UserDao userDao;

    // 写法2：Setter 注入 —— 较少用
    private PayDao payDao;
    @Autowired
    public void setPayDao(PayDao payDao) { this.payDao = payDao; }

    // 写法3：构造器注入（推荐！）—— 字段可设为 final，依赖关系一目了然
    private final ItemDao itemDao;
    public OrderService(ItemDao itemDao) { this.itemDao = itemDao; }
}`}
    />
    <Callout type="warning" title="官方推荐构造器注入">
      <Paragraph>
        Spring 官方推荐<Text bold>构造器注入</Text>，原因：① 依赖可声明为 <InlineCode>final</InlineCode>，保证不可变、线程安全；
        ② 创建对象时依赖就必须齐全，避免空指针；③ 不依赖 Spring 也能 <InlineCode>new</InlineCode> 出来，方便写单元测试。
      </Paragraph>
      <Paragraph>
        当类只有一个构造器时，<InlineCode>@Autowired</InlineCode> 可以省略不写（Spring 会自动注入）。
        配合 Lombok 的 <InlineCode>@RequiredArgsConstructor</InlineCode>，还能自动为 final 字段生成构造器，更省事。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>六、Bean 扫描范围：为什么注解能生效</Subtitle>
    <Paragraph>
      Spring Boot 默认只扫描<Text bold>「启动类所在包，及其所有子包」</Text>。也就是说，你的
      <InlineCode>@Service</InlineCode>、<InlineCode>@Controller</InlineCode> 等类，
      必须放在启动类同级或更深的目录里，否则不会被扫描到、注入时会报错。
    </Paragraph>
    <CodeBlock
      language="text"
      title="标准包结构（启动类放在最外层）"
      code={`com.example.demo
├── DemoApplication.java   ← 启动类（扫描根）
├── controller/            ← 这些包都在启动类之下，会被自动扫描
├── service/
└── mapper/`}
    />
    <Callout type="danger" title="常见坑">
      如果某个 <InlineCode>@Service</InlineCode> 放在了启动类的「上层包」或「平级的另一个包」，
      会报 <InlineCode>NoSuchBeanDefinitionException</InlineCode> 或注入为 <InlineCode>null</InlineCode>。
      记住：<Text bold>启动类要放在所有业务代码包的最外层</Text>。
    </Callout>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><Text bold>IoC</Text>：对象创建权从程序员反转给 Spring 容器；被容器管理的对象叫 <Text bold>Bean</Text>。</ListItem>
        <ListItem><Text bold>DI</Text>：容器自动把依赖注入进来，是 IoC 的实现手段。</ListItem>
        <ListItem>用 <InlineCode>@Component/@Service/@Repository/@Controller</InlineCode> 声明 Bean。</ListItem>
        <ListItem>优先用<Text bold>构造器注入</Text>（final 字段、便于测试、避免空指针）。</ListItem>
        <ListItem>Bean 只在<Text bold>启动类所在包及子包</Text>内被扫描，启动类要放最外层。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
