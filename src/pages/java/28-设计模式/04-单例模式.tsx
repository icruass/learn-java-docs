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
    <Title>单例模式（Singleton）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        有些对象在整个程序里只需要、也只应该存在<Text bold>一份</Text>：
        全局配置、数据库连接池、日志器、计数器……如果随手 <InlineCode>new</InlineCode> 出多个，
        既浪费资源，又可能导致状态不一致。单例模式（Singleton）就是用来保证
        <Text bold>一个类全局只有一个实例</Text>，并对外提供<Text bold>统一访问点</Text>的创建型模式。
        本节从一个反面例子出发，逐种实现单例，重点讲清各种写法的<Text accent bold>懒加载与线程安全</Text>差异。
      </Paragraph>
    </Callout>

    <Subtitle>一、定义与三要素</Subtitle>
    <Paragraph>
      单例模式的目标只有一句话：<Text bold>确保某个类在 JVM 中只有一个实例，并提供一个全局访问它的方法。</Text>
      要实现这个目标，几乎所有写法都围绕三个固定要素展开：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>私有构造器</Text>：把构造方法设为 <InlineCode>private</InlineCode>，
        外部无法 <InlineCode>new</InlineCode>，从源头上杜绝多实例。
      </ListItem>
      <ListItem>
        <Text bold>私有静态实例</Text>：用一个 <InlineCode>static</InlineCode> 字段持有那唯一的实例，归类本身管理。
      </ListItem>
      <ListItem>
        <Text bold>公有静态获取方法</Text>：对外暴露 <InlineCode>getInstance()</InlineCode>，作为全局访问点。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      典型使用场景：应用的全局配置对象、数据库/HTTP 连接池、日志记录器、全局唯一的 ID 生成器或计数器、
      Spring 容器里的默认 Bean（容器单例）等。下面逐一演进各种实现。
    </Paragraph>

    <Divider />

    <Subtitle>二、饿汉式：类加载即创建</Subtitle>
    <Paragraph>
      最简单的写法：在类加载时就把实例创建好，用 <InlineCode>private static final</InlineCode> 修饰。
      因为类加载过程由 JVM 保证线程安全，所以<Text bold>天生线程安全</Text>，但缺点是
      <Text bold>无法延迟加载</Text>——哪怕从没用过它，类一加载就占了内存。
    </Paragraph>
    <CodeBlock
      title="饿汉式（Eager）"
      code={`public class HungrySingleton {
    // 类加载时就初始化，JVM 保证只执行一次，线程安全
    private static final HungrySingleton INSTANCE = new HungrySingleton();

    private HungrySingleton() {}            // 私有构造器

    public static HungrySingleton getInstance() {
        return INSTANCE;                    // 直接返回，无需判空、无需加锁
    }
}`}
    />
    <Callout type="tip" title="什么时候用饿汉式">
      <Paragraph>
        实例创建开销不大、且应用启动后基本一定会用到时，饿汉式最省心：代码短、无锁、绝对线程安全。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>三、懒汉式：用时才创建</Subtitle>
    <Heading3>1. 线程不安全版（反面教材）</Heading3>
    <Paragraph>
      为了实现延迟加载，把创建动作挪到 <InlineCode>getInstance()</InlineCode> 里——用到时才 new。
      但下面这种最朴素的写法在<Text bold>多线程下是错的</Text>：
    </Paragraph>
    <CodeBlock
      title="懒汉式 - 线程不安全（错误示范）"
      code={`public class LazyUnsafe {
    private static LazyUnsafe instance;

    private LazyUnsafe() {}

    public static LazyUnsafe getInstance() {
        if (instance == null) {          // 线程 A、B 可能同时通过这一判断
            instance = new LazyUnsafe(); // 于是各自 new 一个，产生多个实例
        }
        return instance;
    }
}`}
    />
    <Callout type="danger" title="为什么会出问题">
      <Paragraph>
        当两个线程几乎同时进入 <InlineCode>getInstance()</InlineCode>，都看到 <InlineCode>instance == null</InlineCode>，
        于是都会执行 <InlineCode>new</InlineCode>，结果创建出多个对象，单例被破坏。这种写法只能用在单线程环境。
      </Paragraph>
    </Callout>

    <Heading3>2. 懒汉式 + synchronized（线程安全但慢）</Heading3>
    <Paragraph>
      给整个方法加 <InlineCode>synchronized</InlineCode> 就线程安全了，但代价是
      <Text bold>每次获取都要竞争锁</Text>——即使实例早就创建好、只是来读一下，也要排队，性能很差。
    </Paragraph>
    <CodeBlock
      title="懒汉式 + synchronized"
      code={`public class LazySync {
    private static LazySync instance;

    private LazySync() {}

    // 整个方法加锁：正确，但高并发下每次读取都串行化，性能瓶颈明显
    public static synchronized LazySync getInstance() {
        if (instance == null) {
            instance = new LazySync();
        }
        return instance;
    }
}`}
    />

    <Divider />

    <Subtitle>四、双重检查锁 DCL：volatile 的关键作用</Subtitle>
    <Paragraph>
      上一种写法的浪费在于：实例一旦创建好，后续读取根本不需要锁。双重检查锁（Double-Checked Locking）
      把锁的范围缩小——<Text bold>先不加锁判空，只有真要创建时才加锁，加锁后再判一次空</Text>，
      这样只有第一次创建会走到同步块。
    </Paragraph>
    <CodeBlock
      title="双重检查锁（DCL）- 推荐写法之一"
      code={`public class DclSingleton {
    // volatile 不可省略！原因见下文
    private static volatile DclSingleton instance;

    private DclSingleton() {}

    public static DclSingleton getInstance() {
        if (instance == null) {                     // 第一次检查：无锁，性能好
            synchronized (DclSingleton.class) {
                if (instance == null) {             // 第二次检查：防止重复创建
                    instance = new DclSingleton();
                }
            }
        }
        return instance;
    }
}`}
    />
    <Callout type="warning" title="为什么实例字段必须加 volatile">
      <Paragraph>
        <InlineCode>instance = new DclSingleton()</InlineCode> 并非原子操作，它大致分三步：
      </Paragraph>
      <UnorderedList>
        <ListItem>① 分配内存空间；</ListItem>
        <ListItem>② 调用构造器，初始化对象；</ListItem>
        <ListItem>③ 把 <InlineCode>instance</InlineCode> 指向这块内存。</ListItem>
      </UnorderedList>
      <Paragraph>
        JVM/CPU 可能发生<Text bold>指令重排</Text>，把顺序变成 ①→③→②。此时若线程 A 执行到 ③（引用已非 null）
        但还没执行 ②（对象未初始化完成），线程 B 在第一次检查时看到 <InlineCode>instance != null</InlineCode>，
        就会直接返回并使用<Text accent bold>一个尚未构造完成的"半成品"对象</Text>，引发难以排查的 bug。
        给字段加 <InlineCode>volatile</InlineCode> 可<Text bold>禁止这种重排序</Text>，并保证写入对其他线程立即可见，DCL 才真正正确。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>五、静态内部类：优雅的懒加载</Subtitle>
    <Paragraph>
      DCL 正确但略显繁琐。利用 JVM 的<Text bold>类加载机制</Text>能更优雅地兼顾懒加载与线程安全：
      把实例放进一个静态内部类里。外部类被加载时，内部类<Text bold>不会</Text>跟着加载；
      只有第一次调用 <InlineCode>getInstance()</InlineCode> 访问到内部类时，它才被加载并初始化实例——
      而类的初始化由 JVM 加锁保证只执行一次，因此天然线程安全。
    </Paragraph>
    <CodeBlock
      title="静态内部类（推荐）"
      code={`public class HolderSingleton {
    private HolderSingleton() {}

    // 私有静态内部类：HolderSingleton 加载时它不加载，实现了延迟初始化
    private static class Holder {
        private static final HolderSingleton INSTANCE = new HolderSingleton();
    }

    public static HolderSingleton getInstance() {
        return Holder.INSTANCE;   // 首次访问 Holder 才触发其初始化
    }
}`}
    />
    <Callout type="tip" title="它好在哪里">
      <Paragraph>
        既<Text bold>懒加载</Text>（用时才创建）又<Text bold>线程安全</Text>（靠 JVM 类初始化保证），
        而且没有任何 <InlineCode>synchronized</InlineCode>、没有 volatile，代码简洁、无锁开销，是非常常用的实现。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>六、枚举单例：最简洁且最安全</Subtitle>
    <Paragraph>
      《Effective Java》推荐用<Text bold>单元素枚举</Text>实现单例。枚举实例由 JVM 在类加载时创建，
      天然线程安全；更重要的是它<Text accent bold>天生防反射、天生防序列化破坏</Text>，写法还极其简短。
    </Paragraph>
    <CodeBlock
      title="枚举单例（Effective Java 首推）"
      code={`public enum EnumSingleton {
    INSTANCE;                       // 唯一实例

    // 可以像普通类一样添加字段和业务方法
    private int counter;

    public int incrementAndGet() {
        return ++counter;
    }
}

// 使用：
// int n = EnumSingleton.INSTANCE.incrementAndGet();`}
    />
    <Paragraph>
      枚举无法通过反射创建新实例（<InlineCode>Constructor.newInstance()</InlineCode> 对枚举会直接抛
      <InlineCode>IllegalArgumentException</InlineCode>），序列化/反序列化也由 JDK 保证返回同一实例，
      因此从根本上堵死了破坏单例的两条路。
    </Paragraph>

    <Divider />

    <Subtitle>七、几种实现的对比</Subtitle>
    <Table
      head={['实现方式', '是否懒加载', '是否线程安全', '防反射/序列化', '推荐度']}
      rows={[
        ['饿汉式', '否', '是', '否', '★★★☆☆'],
        ['懒汉式（不加锁）', '是', '否（错误）', '否', '☆☆☆☆☆'],
        ['懒汉式 + synchronized', '是', '是（但慢）', '否', '★★☆☆☆'],
        ['双重检查锁 DCL', '是', '是（需 volatile）', '否', '★★★★☆'],
        ['静态内部类', '是', '是', '否', '★★★★★'],
        ['枚举单例', '否', '是', '是', '★★★★★'],
      ]}
    />

    <Divider />

    <Subtitle>八、能破坏单例的途径</Subtitle>
    <Paragraph>
      除枚举外，上面几种基于普通类的实现，单例其实都可能被破坏，主要有两条路：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>反射</Text>：通过 <InlineCode>setAccessible(true)</InlineCode> 强行调用私有构造器，
        再 <InlineCode>newInstance()</InlineCode> 就能造出第二个实例。
      </ListItem>
      <ListItem>
        <Text bold>序列化</Text>：单例对象序列化后再反序列化，默认会生成一个新对象
        （可通过实现 <InlineCode>readResolve()</InlineCode> 返回原实例来防御）。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      而<Text accent bold>枚举单例对这两种攻击天然免疫</Text>，这也是它被《Effective Java》列为首选的关键原因。
    </Paragraph>

    <Divider />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>单例 = 私有构造器 + 私有静态实例 + 公有静态获取方法，保证全局唯一并提供访问点。</ListItem>
        <ListItem>饿汉式：类加载即创建，线程安全但不能懒加载。</ListItem>
        <ListItem>懒汉式不加锁是错误示范；加 <InlineCode>synchronized</InlineCode> 正确但每次都加锁、慢。</ListItem>
        <ListItem>DCL 用双重判空缩小锁范围，<Text bold>实例字段必须加 volatile</Text> 以防指令重排拿到半成品对象。</ListItem>
        <ListItem>静态内部类靠 JVM 类加载机制实现懒加载 + 线程安全，简洁无锁，日常推荐。</ListItem>
        <ListItem>枚举单例最简洁，且天然防反射、防序列化破坏，是《Effective Java》的首选。</ListItem>
        <ListItem>反射与序列化可破坏普通类单例，枚举对此免疫。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
