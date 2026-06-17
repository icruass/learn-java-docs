import React from 'react';
import {
  Title,
  Subtitle,
  Heading3,
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
    <Title>代理模式（Proxy）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        <Text bold>代理模式</Text>为目标对象提供一个「替身」，在不修改目标类源码的前提下，
        于真正方法调用的<Text accent bold>前后插入增强逻辑</Text>（日志、权限、事务、缓存、延迟加载）或控制对目标的访问。
        本节从痛点出发，依次讲解静态代理、JDK 动态代理、CGLIB，并落地到 Spring AOP 与 MyBatis。
      </Paragraph>
    </Callout>

    <Subtitle>一、痛点：增强逻辑无处安放</Subtitle>
    <Paragraph>
      假设有一个 <InlineCode>UserService</InlineCode>，现在要给每个方法加上「执行耗时日志」。
      最直接的做法是把日志代码直接写进业务方法里：
    </Paragraph>
    <CodeBlock
      title="把增强逻辑硬塞进业务方法（反面教材）"
      code={`public class UserServiceImpl implements UserService {
    @Override
    public void addUser(String name) {
        long start = System.currentTimeMillis();   // 日志代码混入业务
        System.out.println("addUser 开始");
        // ===== 真正的业务逻辑 =====
        System.out.println("新增用户：" + name);
        // =========================
        long cost = System.currentTimeMillis() - start; // 又是日志代码
        System.out.println("addUser 耗时 " + cost + "ms");
    }
    // deleteUser、updateUser... 每个方法都要重复抄一遍日志代码
}`}
    />
    <UnorderedList>
      <ListItem>业务逻辑被日志、计时代码淹没，<Text bold>职责不清</Text>。</ListItem>
      <ListItem>每个方法都要复制粘贴同样的增强代码，<Text bold>无法复用</Text>。</ListItem>
      <ListItem>哪天日志格式要改，得逐个方法去改，<Text bold>难以维护</Text>。</ListItem>
      <ListItem>如果目标类是第三方 jar，根本<Text bold>没法改源码</Text>。</ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>二、定义与角色</Subtitle>
    <Paragraph>
      代理模式让代理对象与目标对象<Text bold>实现同一接口</Text>，代理内部持有目标对象的引用，
      外界通过代理来访问目标。代理在转发调用前后做增强，从而把「增强逻辑」与「业务逻辑」解耦。
    </Paragraph>
    <Table
      head={['角色', '说明', '示例']}
      rows={[
        ['Subject（抽象主题）', '代理与目标共同实现的接口', 'UserService'],
        ['RealSubject（真实主题）', '被代理的目标对象，负责真正的业务', 'UserServiceImpl'],
        ['Proxy（代理）', '持有目标引用，前后插入增强后再转发调用', 'UserServiceProxy'],
      ]}
    />

    <Divider />

    <Subtitle>三、静态代理：手写一个代理类</Subtitle>
    <Paragraph>
      静态代理就是程序员<Text bold>手动编写</Text>一个实现了相同接口的代理类，把目标对象包进去，
      在方法前后加上增强逻辑。
    </Paragraph>
    <CodeBlock
      title="静态代理：给 UserService 加日志"
      code={`// 1. 抽象主题：接口
public interface UserService {
    void addUser(String name);
}

// 2. 真实主题：纯净的业务实现
public class UserServiceImpl implements UserService {
    @Override
    public void addUser(String name) {
        System.out.println("新增用户：" + name);
    }
}

// 3. 代理：实现同一接口，持有目标引用
public class UserServiceProxy implements UserService {
    private final UserService target;          // 持有目标

    public UserServiceProxy(UserService target) {
        this.target = target;
    }

    @Override
    public void addUser(String name) {
        long start = System.currentTimeMillis();   // 前置增强
        target.addUser(name);                      // 转发给目标
        long cost = System.currentTimeMillis() - start;
        System.out.println("addUser 耗时 " + cost + "ms"); // 后置增强
    }
}

// 4. 使用
public class Demo {
    public static void main(String[] args) {
        UserService service = new UserServiceProxy(new UserServiceImpl());
        service.addUser("张三");
    }
}`}
    />
    <Callout type="warning" title="静态代理的致命缺点">
      <Paragraph>
        一个代理类只能代理一个接口；接口里有 10 个方法，代理类就要写 10 个转发方法。
        系统中有 100 个 Service 就要写 100 个代理类，<Text bold>类爆炸</Text>，增强逻辑也无法跨类复用。
        于是有了运行时自动生成代理的「动态代理」。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>四、JDK 动态代理：基于接口</Subtitle>
    <Paragraph>
      JDK 动态代理由 <InlineCode>java.lang.reflect.Proxy</InlineCode> 在<Text accent bold>运行时</Text>
      动态生成代理类（无需手写），所有方法调用都被路由到一个统一的
      <InlineCode>InvocationHandler.invoke()</InlineCode> 里集中处理增强。它要求<Text bold>目标必须实现接口</Text>。
    </Paragraph>
    <CodeBlock
      title="JDK 动态代理完整示例"
      code={`import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

// 增强逻辑集中在一个 Handler 里，对所有方法生效
public class LogHandler implements InvocationHandler {
    private final Object target;               // 任意目标对象

    public LogHandler(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        long start = System.currentTimeMillis();
        System.out.println("调用方法：" + method.getName());
        Object result = method.invoke(target, args);   // 反射转发给目标
        long cost = System.currentTimeMillis() - start;
        System.out.println(method.getName() + " 耗时 " + cost + "ms");
        return result;
    }
}

public class Demo {
    public static void main(String[] args) {
        UserService target = new UserServiceImpl();

        // 运行时生成代理对象，无需手写代理类
        UserService proxy = (UserService) Proxy.newProxyInstance(
                target.getClass().getClassLoader(),      // 类加载器
                target.getClass().getInterfaces(),       // 目标实现的接口
                new LogHandler(target));                 // 增强处理器

        proxy.addUser("李四");   // 实际进入 LogHandler.invoke
    }
}`}
    />
    <Paragraph>
      一个 <InlineCode>LogHandler</InlineCode> 就能为<Text bold>任意</Text>实现了接口的对象加日志，
      彻底解决了静态代理的类爆炸问题。
    </Paragraph>

    <Heading3>CGLIB：基于子类继承</Heading3>
    <Paragraph>
      如果目标类<Text bold>没有实现任何接口</Text>，JDK 动态代理就无能为力。这时可以用 CGLIB：
      它通过 ASM 在运行时<Text accent bold>生成目标类的子类</Text>，重写父类方法并织入增强。
      因为靠继承实现，所以<Text bold>无法代理 final 类和 final 方法</Text>。
    </Paragraph>

    <Heading3>三种方式对比</Heading3>
    <Table
      head={['维度', '静态代理', 'JDK 动态代理', 'CGLIB']}
      rows={[
        ['实现原理', '手写代理类', '运行时基于接口生成代理类', '运行时生成目标类的子类'],
        ['是否需接口', '需要', '必须有接口', '不需要接口'],
        ['增强复用', '差，每类一个代理', '好，Handler 通用', '好，Interceptor 通用'],
        ['限制', '类爆炸', '目标须实现接口', '不能代理 final 类/方法'],
        ['性能', '高（编译期确定）', '反射调用，略低', '生成子类，调用较快'],
        ['依赖', '无', 'JDK 自带', '需引入 cglib/asm'],
      ]}
    />

    <Divider />

    <Subtitle>五、框架中的代理</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>Spring AOP</Text>：声明式事务（<InlineCode>@Transactional</InlineCode>）、日志/权限切面，
        本质都是给 Bean 生成代理。默认<Text accent bold>有接口时用 JDK 动态代理，无接口时用 CGLIB</Text>
        （可通过 <InlineCode>proxyTargetClass=true</InlineCode> 强制全用 CGLIB）。
      </ListItem>
      <ListItem>
        <Text bold>MyBatis Mapper</Text>：我们只写 <InlineCode>UserMapper</InlineCode> 接口而没有实现类，
        MyBatis 用 JDK 动态代理在运行时生成接口的实现，<InlineCode>invoke</InlineCode> 中根据方法去执行对应 SQL。
      </ListItem>
      <ListItem>
        <Text bold>RPC 框架</Text>（Dubbo、Feign）：远程调用的本地「桩」也是动态代理，把方法调用编码成网络请求。
      </ListItem>
    </UnorderedList>
    <Callout type="tip" title="为什么事务注解写在 private 方法上不生效">
      <Paragraph>
        Spring 代理只能拦截「通过代理对象调用的 public 方法」。在类内部用 <InlineCode>this.xxx()</InlineCode>
        自调用，或调用 private 方法，都绕过了代理对象，增强（如事务）自然失效。这是代理机制的天然边界。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>六、优缺点与适用场景</Subtitle>
    <Table
      head={['优点', '缺点']}
      rows={[
        ['不改目标源码即可增强功能', '设计上多了一层代理，调用链变长'],
        ['增强逻辑与业务逻辑解耦、可复用', '动态代理依赖反射，有一定性能开销'],
        ['可控制对目标的访问（权限/延迟加载）', '代理生成与调试相对复杂'],
      ]}
    />
    <Paragraph>
      <Text bold>适用场景：</Text>需要为方法统一加日志、计时、权限、事务、缓存等横切关注点；
      远程调用的本地代理；大对象的延迟加载（虚拟代理）；对资源访问做控制（保护代理）。
    </Paragraph>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>代理模式：代理与目标实现同一接口，前后插入增强，解耦增强与业务。</ListItem>
        <ListItem>静态代理手写、简单直观，但每类一个代理导致类爆炸。</ListItem>
        <ListItem>JDK 动态代理基于接口、运行时生成，增强集中在 <InlineCode>InvocationHandler</InlineCode>。</ListItem>
        <ListItem>CGLIB 基于子类继承，可代理无接口的类，但不能代理 final。</ListItem>
        <ListItem>Spring AOP、MyBatis Mapper、RPC 桩都建立在动态代理之上。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
