import React from 'react';
import {
  Title,
  Heading3,
  Heading4,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Table,
  Callout,
  UnorderedList,
  OrderedList,
  ListItem,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>线程通信与线程池</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        多线程不仅要解决"安全"问题，还要解决"协作"问题——让线程在合适的时机等待、唤醒，
        高效地完成分工任务。本节前半部分讲<Text bold>等待唤醒机制（wait/notify）</Text>
        和经典的<Text bold>生产者消费者模式</Text>；后半部分讲
        <Text bold>线程池</Text>——实际项目中几乎不会手动创建线程，
        而是统一通过线程池来管理，理解线程池的参数和工作原理是 Java 后端开发者的必备技能。
      </Paragraph>
    </Callout>

    <Heading3>1. 线程通信：等待唤醒机制</Heading3>
    <Heading4>1.1 为什么需要线程通信</Heading4>
    <Paragraph>
      考虑一个仓库场景：生产者往仓库放货，消费者从仓库取货。
      如果仓库满了，生产者必须<Text bold>等待</Text>；如果仓库空了，消费者必须<Text bold>等待</Text>。
      单靠 synchronized 只能保证互斥，但无法实现"条件不满足时主动让出 CPU 并等待通知"的协作逻辑。
      这就需要 <InlineCode>wait()</InlineCode> / <InlineCode>notify()</InlineCode>。
    </Paragraph>

    <Heading4>1.2 wait()、notify()、notifyAll() 三个方法</Heading4>
    <Paragraph>
      这三个方法定义在 <InlineCode>Object</InlineCode> 类中（不是 Thread），
      意味着<Text bold>任何对象都可以作为等待/唤醒的信号量</Text>。
    </Paragraph>
    <Table
      head={['方法', '作用', '调用后线程状态', '是否释放锁']}
      rows={[
        ['wait()', '让当前线程进入等待，释放锁，等待唤醒', 'WAITING', '是，释放锁'],
        ['wait(ms)', '有超时的等待，到时间自动唤醒', 'TIMED_WAITING', '是，释放锁'],
        ['notify()', '唤醒等待该锁对象的任意一个线程', '等待线程变为 BLOCKED（去竞争锁）', '否，持有者继续持锁'],
        ['notifyAll()', '唤醒等待该锁对象的所有线程', '所有等待线程变为 BLOCKED', '否'],
      ]}
    />
    <Callout type="warning" title="必须在 synchronized 块内调用">
      <Paragraph>
        <InlineCode>wait()</InlineCode>、<InlineCode>notify()</InlineCode>、<InlineCode>notifyAll()</InlineCode>
        <Text bold>必须在 synchronized 代码块或同步方法中调用</Text>，且调用对象必须是当前持有的锁对象，
        否则运行时抛出 <InlineCode>IllegalMonitorStateException</InlineCode>。
        原因：这三个方法依赖"监视器（Monitor）"机制，而 synchronized 正是获取监视器的方式。
      </Paragraph>
    </Callout>

    <Heading4>1.3 sleep() 与 wait() 的关键区别</Heading4>
    <Table
      head={['对比项', 'Thread.sleep(ms)', 'Object.wait()']}
      rows={[
        ['所属类', 'Thread（静态方法）', 'Object'],
        ['是否释放锁', '不释放锁', '释放锁'],
        ['唤醒方式', '时间到自动醒', '需要其他线程调用 notify()/notifyAll()'],
        ['是否需要在 synchronized 中', '不需要', '必须在 synchronized 中'],
        ['线程状态', 'TIMED_WAITING', 'WAITING（无参）/ TIMED_WAITING（有参）'],
      ]}
    />
    <Callout type="tip" title="面试高频：sleep 和 wait 的区别">
      <Paragraph>
        最关键的一条：<Text bold>sleep() 抱着锁睡觉，wait() 放下锁等待</Text>。
        sleep 期间其他线程无法获取该锁；wait 之后锁被释放，其他线程可以进入同步块。
      </Paragraph>
    </Callout>

    <Heading4>1.4 完整生产者消费者示例</Heading4>
    <CodeBlock
      title="Warehouse.java（共享仓库）"
      code={`// 共享仓库：最多存放 5 个产品
public class Warehouse {
    private int stock = 0;        // 当前库存
    private final int MAX = 5;    // 最大容量

    // 生产（放入仓库）
    public synchronized void produce() {
        // 库存满时，生产者等待（用 while 而非 if，防止虚假唤醒）
        while (stock >= MAX) {
            System.out.println(Thread.currentThread().getName() + " 仓库满，等待消费...");
            try {
                wait(); // 释放锁，进入等待
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
        stock++;
        System.out.println(Thread.currentThread().getName()
            + " 生产了1个，当前库存：" + stock);
        notifyAll(); // 唤醒所有等待的消费者
    }

    // 消费（从仓库取出）
    public synchronized void consume() {
        // 库存空时，消费者等待
        while (stock <= 0) {
            System.out.println(Thread.currentThread().getName() + " 仓库空，等待生产...");
            try {
                wait(); // 释放锁，进入等待
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
        stock--;
        System.out.println(Thread.currentThread().getName()
            + " 消费了1个，当前库存：" + stock);
        notifyAll(); // 唤醒所有等待的生产者
    }
}`}
    />
    <CodeBlock
      title="ProducerConsumerDemo.java"
      code={`public class ProducerConsumerDemo {
    public static void main(String[] args) {
        Warehouse warehouse = new Warehouse();

        // 2 个生产者线程
        Runnable producer = () -> {
            for (int i = 0; i < 8; i++) {
                warehouse.produce();
                try { Thread.sleep(200); } catch (InterruptedException e) { return; }
            }
        };

        // 3 个消费者线程
        Runnable consumer = () -> {
            for (int i = 0; i < 5; i++) {
                warehouse.consume();
                try { Thread.sleep(300); } catch (InterruptedException e) { return; }
            }
        };

        new Thread(producer, "生产者-A").start();
        new Thread(producer, "生产者-B").start();
        new Thread(consumer, "消费者-1").start();
        new Thread(consumer, "消费者-2").start();
        new Thread(consumer, "消费者-3").start();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（部分，顺序因调度而异）"
      code={`生产者-A 生产了1个，当前库存：1
生产者-B 生产了1个，当前库存：2
消费者-1 消费了1个，当前库存：1
生产者-A 生产了1个，当前库存：2
消费者-2 消费了1个，当前库存：1
消费者-3 仓库空，等待生产...
生产者-B 生产了1个，当前库存：2
消费者-3 消费了1个，当前库存：1
...`}
    />

    <Callout type="tip" title="为什么用 while 而不是 if">
      <Paragraph>
        等待条件判断应该使用 <Text bold>while</Text> 而不是 if。
        原因是<Text bold>虚假唤醒（Spurious Wakeup）</Text>：
        线程在某些情况下可能在没有调用 notify() 的情况下被唤醒，
        用 while 可以在唤醒后重新检查条件，确保条件真正满足时才继续。
        这是 Java 并发编程的标准写法。
      </Paragraph>
    </Callout>

    <Heading3>2. 为什么需要线程池</Heading3>
    <Paragraph>
      每次需要异步执行任务时都手动 <InlineCode>new Thread().start()</InlineCode>，存在严重问题：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>创建销毁开销大</Text>：每次创建线程都要分配栈内存（默认约 512KB）、
        操作系统内核资源，任务完成后再销毁。高并发时这个开销非常显著。
      </ListItem>
      <ListItem>
        <Text bold>线程数量不可控</Text>：来一个请求创建一个线程，1000 个并发就有 1000 个线程，
        上下文切换的开销反而拖垮性能，甚至 OOM。
      </ListItem>
      <ListItem>
        <Text bold>缺乏统一管理</Text>：线程的执行状态、异常捕获、优雅停机都难以统一处理。
      </ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>线程池</Text>的解决思路：预先创建一批线程放在"池"里，
      任务来了直接从池中取一个空闲线程执行，执行完后线程<Text bold>不销毁而是归还到池中</Text>，
      等待下一个任务。核心优势：<Text bold>复用线程、控制并发数、统一管理</Text>。
    </Paragraph>

    <Heading3>3. Executors 工厂类（快速创建线程池）</Heading3>
    <Paragraph>
      <InlineCode>java.util.concurrent.Executors</InlineCode> 提供了几个静态方法，
      可以快速创建常见类型的线程池：
    </Paragraph>
    <Table
      head={['方法', '描述', '底层参数特点', '适用场景']}
      rows={[
        ['Executors.newFixedThreadPool(n)', '固定大小线程池', '核心线程数 = 最大线程数 = n，队列无界', '并发量稳定的后台任务'],
        ['Executors.newCachedThreadPool()', '可缓存线程池', '核心线程数0，最大 Integer.MAX_VALUE，线程60s空闲后回收', '大量短期异步任务'],
        ['Executors.newSingleThreadExecutor()', '单线程池', '只有1个线程，顺序执行所有任务', '需要顺序执行、不希望多线程并发'],
        ['Executors.newScheduledThreadPool(n)', '定时任务线程池', '支持延迟执行、周期执行', '定时任务、轮询'],
      ]}
    />

    <Heading3>4. ExecutorService 接口</Heading3>
    <Paragraph>
      所有线程池都实现 <InlineCode>ExecutorService</InlineCode> 接口，核心方法如下：
    </Paragraph>
    <Table
      head={['方法', '说明']}
      rows={[
        ['submit(Runnable)', '提交 Runnable 任务，返回 Future<?>'],
        ['submit(Callable<T>)', '提交 Callable 任务，返回 Future<T>，可获取结果'],
        ['execute(Runnable)', '提交 Runnable 任务，无返回值（不能获取异常）'],
        ['shutdown()', '停止接受新任务，等待已提交的任务全部完成后关闭'],
        ['shutdownNow()', '立即关闭，尝试中断正在执行的任务，返回未执行的任务列表'],
        ['isShutdown()', '是否已调用 shutdown()'],
        ['isTerminated()', '是否所有任务都已执行完毕且线程池已关闭'],
        ['awaitTermination(timeout, unit)', '阻塞等待线程池关闭，超时返回'],
      ]}
    />

    <Heading4>4.1 完整线程池示例</Heading4>
    <CodeBlock
      title="ThreadPoolDemo.java"
      code={`import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ThreadPoolDemo {
    public static void main(String[] args) throws Exception {
        // 创建固定大小为 3 的线程池
        ExecutorService pool = Executors.newFixedThreadPool(3);

        // 提交 5 个任务（3个线程复用执行5个任务）
        for (int i = 1; i <= 5; i++) {
            final int taskId = i;
            pool.submit(() -> {
                System.out.println(Thread.currentThread().getName()
                    + " 执行任务 " + taskId + " 开始");
                try {
                    Thread.sleep(500); // 模拟耗时
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println(Thread.currentThread().getName()
                    + " 执行任务 " + taskId + " 完成");
            });
        }

        // 停止接受新任务，等待已提交任务执行完毕
        pool.shutdown();

        // 可选：等待最多 10 秒，确保所有任务完成
        // pool.awaitTermination(10, TimeUnit.SECONDS);
        System.out.println("所有任务已提交，等待执行...");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（体现线程复用）"
      code={`所有任务已提交，等待执行...
pool-1-thread-1 执行任务 1 开始
pool-1-thread-2 执行任务 2 开始
pool-1-thread-3 执行任务 3 开始
pool-1-thread-1 执行任务 1 完成
pool-1-thread-1 执行任务 4 开始   ← 线程1 复用，执行第4个任务
pool-1-thread-2 执行任务 2 完成
pool-1-thread-2 执行任务 5 开始   ← 线程2 复用，执行第5个任务
pool-1-thread-3 执行任务 3 完成
pool-1-thread-1 执行任务 4 完成
pool-1-thread-2 执行任务 5 完成`}
    />

    <Heading3>5. ThreadPoolExecutor：自定义线程池（推荐方式）</Heading3>
    <Paragraph>
      <InlineCode>Executors</InlineCode> 工厂方法虽然方便，但存在隐患（见下方警告）。
      生产环境推荐直接使用 <InlineCode>ThreadPoolExecutor</InlineCode> 构造方法，
      明确每个参数，避免资源耗尽风险。
    </Paragraph>

    <Heading4>5.1 ThreadPoolExecutor 的 7 个核心参数</Heading4>
    <CodeBlock
      title="ThreadPoolExecutor 构造方法"
      code={`public ThreadPoolExecutor(
    int corePoolSize,          // 1. 核心线程数
    int maximumPoolSize,       // 2. 最大线程数
    long keepAliveTime,        // 3. 非核心线程的最大空闲时间
    TimeUnit unit,             // 4. keepAliveTime 的时间单位
    BlockingQueue<Runnable> workQueue,  // 5. 工作队列（存放等待的任务）
    ThreadFactory threadFactory,        // 6. 线程工厂（创建线程的方式）
    RejectedExecutionHandler handler    // 7. 拒绝策略（任务过多时的处理方式）
)`}
    />
    <Table
      head={['参数', '说明', '典型值/选择']}
      rows={[
        ['corePoolSize', '线程池常驻的核心线程数，即使空闲也不销毁', 'CPU密集型：CPU核心数+1；IO密集型：2×CPU核心数'],
        ['maximumPoolSize', '线程池允许的最大线程数（含核心线程）', '必须 >= corePoolSize'],
        ['keepAliveTime', '超出核心线程数的多余线程，空闲超过此时间后销毁', '常用 60 秒'],
        ['unit', 'keepAliveTime 的单位', 'TimeUnit.SECONDS / MILLISECONDS 等'],
        ['workQueue', '核心线程全忙时，任务进入等待队列', 'ArrayBlockingQueue（有界）/ LinkedBlockingQueue（无界，慎用）'],
        ['threadFactory', '创建线程的工厂，可自定义线程名、优先级等', 'Executors.defaultThreadFactory() 或自定义'],
        ['handler', '队列满且线程数到最大时，新任务的处理策略', '见下表4种策略'],
      ]}
    />

    <Heading4>5.2 4 种拒绝策略</Heading4>
    <Table
      head={['拒绝策略类', '行为', '适用场景']}
      rows={[
        ['AbortPolicy（默认）', '直接抛出 RejectedExecutionException', '任务不能丢失时，让调用方感知到异常'],
        ['CallerRunsPolicy', '由提交任务的线程（调用方）自己来执行该任务', '不想丢失任务，且可以降低提交速度'],
        ['DiscardPolicy', '静默丢弃该任务，不抛异常', '允许丢失任务的非关键场景'],
        ['DiscardOldestPolicy', '丢弃队列中最老的任务，再尝试重新提交当前任务', '新任务比老任务更重要时'],
      ]}
    />

    <Heading4>5.3 线程池工作流程</Heading4>
    <CodeBlock
      language="text"
      title="任务提交流程（重要！面试必考）"
      code={`提交新任务
    │
    ▼
当前线程数 < corePoolSize？
    ├── 是 → 创建新核心线程，直接执行任务
    └── 否
        ▼
    工作队列未满？
        ├── 是 → 任务加入工作队列排队
        └── 否
            ▼
        当前线程数 < maximumPoolSize？
            ├── 是 → 创建非核心线程，直接执行任务
            └── 否 → 触发拒绝策略（handler）`}
    />

    <Heading4>5.4 自定义线程池完整示例</Heading4>
    <CodeBlock
      title="CustomThreadPoolDemo.java"
      code={`import java.util.concurrent.*;

public class CustomThreadPoolDemo {
    public static void main(String[] args) {
        // 自定义线程池：核心2线程，最大4线程，队列容量3，超时60秒
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
            2,                                      // corePoolSize
            4,                                      // maximumPoolSize
            60L,                                    // keepAliveTime
            TimeUnit.SECONDS,                       // unit
            new ArrayBlockingQueue<>(3),            // workQueue（有界队列，容量3）
            new ThreadFactory() {                   // 自定义线程名
                private int count = 0;
                @Override
                public Thread newThread(Runnable r) {
                    return new Thread(r, "自定义线程-" + (++count));
                }
            },
            new ThreadPoolExecutor.CallerRunsPolicy() // 拒绝策略：调用者执行
        );

        // 最多能同时处理：4个线程 + 3个队列 = 7个任务
        // 超过7个才会触发 CallerRunsPolicy
        for (int i = 1; i <= 7; i++) {
            final int id = i;
            pool.submit(() -> {
                System.out.println(Thread.currentThread().getName()
                    + " 执行任务-" + id);
                try { Thread.sleep(1000); } catch (InterruptedException e) {}
            });
        }

        pool.shutdown();
    }
}`}
    />

    <Callout type="tip" title="实际开发建议：用 ThreadPoolExecutor 而非 Executors">
      <Paragraph>
        阿里巴巴 Java 开发手册明确规定：<Text bold>线程池不允许使用 Executors 创建</Text>，
        应通过 ThreadPoolExecutor 明确参数。原因：
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <InlineCode>newFixedThreadPool</InlineCode> 和 <InlineCode>newSingleThreadExecutor</InlineCode>
          使用的是<Text bold>无界队列 LinkedBlockingQueue</Text>，在任务堆积时会无限增长，导致 OOM。
        </ListItem>
        <ListItem>
          <InlineCode>newCachedThreadPool</InlineCode> 的最大线程数是
          <InlineCode>Integer.MAX_VALUE</InlineCode>（约21亿），
          高并发时可能创建大量线程导致 OOM 或 CPU 耗尽。
        </ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 综合对比：线程通信 vs 线程池</Heading3>
    <Table
      head={['技术', '解决什么问题', '核心 API', '典型场景']}
      rows={[
        ['wait/notify', '线程间协作、条件等待', 'Object.wait() / notify() / notifyAll()', '生产者消费者、限流缓冲'],
        ['线程池', '线程的创建销毁开销、并发数控制', 'ExecutorService / ThreadPoolExecutor', '处理大量并发请求、批量异步任务'],
      ]}
    />

    <Callout type="success" title="本节小结">
      <Paragraph>本节涵盖了多线程"协作"和"管理"两大主题：</Paragraph>
      <UnorderedList>
        <ListItem>wait()/notify() 必须在 synchronized 块内调用，wait() 释放锁，sleep() 不释放锁</ListItem>
        <ListItem>生产者消费者模式用 while 检查条件（防止虚假唤醒），notifyAll() 唤醒所有等待线程</ListItem>
        <ListItem>线程池复用线程，避免频繁创建销毁的开销，核心是 ThreadPoolExecutor 的 7 个参数</ListItem>
        <ListItem>任务提交流程：核心线程 → 工作队列 → 非核心线程 → 拒绝策略</ListItem>
        <ListItem>生产环境用 ThreadPoolExecutor 自定义参数，不用 Executors 工厂方法（避免 OOM）</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。</Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：概念辨析"
      code={`问：回答以下问题。

1. wait() 和 sleep() 最关键的区别是什么？各处于哪种线程状态？

2. 以下代码正确吗？如果不正确，问题在哪？
   public void doSomething() {
       this.wait(); // 直接调用 wait()
   }

3. 线程池 ThreadPoolExecutor 有一个大小为 5 的有界工作队列，
   corePoolSize=2，maximumPoolSize=4。
   当同时提交 10 个任务时，各会发生什么？`}
      answerCode={`1. 最关键区别：
   - sleep()：不释放锁，时间到自动醒来 → TIMED_WAITING 状态
   - wait()：释放锁，需要 notify()/notifyAll() 唤醒 → WAITING 状态（无参）
             或 TIMED_WAITING（有超时参数）

2. 不正确。wait() 必须在 synchronized 代码块或同步方法中调用，
   且调用 wait() 的对象必须是当前持有的锁对象。
   直接调用会抛出 IllegalMonitorStateException。
   正确写法：
   public synchronized void doSomething() {
       this.wait();
   }

3. 10 个任务的处理流程：
   - 任务1、2：当前线程数(0) < corePoolSize(2) → 创建2个核心线程，立即执行
   - 任务3～7：核心线程全忙，队列未满 → 进入工作队列排队（队列放5个，3,4,5,6,7）
   - 任务8、9：队列已满，线程数(2) < maximumPoolSize(4) → 创建2个非核心线程，立即执行
   - 任务10：队列满 且 线程数已到最大(4) → 触发拒绝策略`}
    />

    <CodeBlock
      qa
      title="练习 2：wait/notify 编程题"
      code={`// 实现一个简单的"轮流打印"程序：
// 两个线程 A 和 B，要求严格按照 A → B → A → B... 的顺序交替打印
// 线程 A 打印：A-1, A-2, A-3（共3次）
// 线程 B 打印：B-1, B-2, B-3（共3次）
// 最终输出顺序必须是：A-1, B-1, A-2, B-2, A-3, B-3

// 提示：用一个共享标志位（如 boolean turn = true 表示A的回合）
// 搭配 wait() / notifyAll() 实现`}
      answerCode={`public class AlternatePrint {

    private static final Object lock = new Object();
    private static boolean isATurn = true; // true = A 的回合，false = B 的回合

    public static void main(String[] args) {
        Thread threadA = new Thread(() -> {
            for (int i = 1; i <= 3; i++) {
                synchronized (lock) {
                    while (!isATurn) { // 不是A的回合，等待
                        try { lock.wait(); } catch (InterruptedException e) { return; }
                    }
                    System.out.println("A-" + i);
                    isATurn = false;   // 轮到 B 了
                    lock.notifyAll();  // 唤醒 B
                }
            }
        }, "线程-A");

        Thread threadB = new Thread(() -> {
            for (int i = 1; i <= 3; i++) {
                synchronized (lock) {
                    while (isATurn) { // 不是B的回合，等待
                        try { lock.wait(); } catch (InterruptedException e) { return; }
                    }
                    System.out.println("B-" + i);
                    isATurn = true;    // 轮到 A 了
                    lock.notifyAll();  // 唤醒 A
                }
            }
        }, "线程-B");

        threadA.start();
        threadB.start();
    }
}

// 输出：
// A-1
// B-1
// A-2
// B-2
// A-3
// B-3`}
    />

    <CodeBlock
      qa
      title="练习 3：线程池编程题"
      code={`// 使用 ThreadPoolExecutor 创建一个自定义线程池，要求：
// 1. 核心线程数：2，最大线程数：4
// 2. 工作队列：有界队列，容量为 5
// 3. 拒绝策略：AbortPolicy（抛异常）
// 4. 提交 6 个 Callable 任务，每个任务返回自己的编号（1-6）
// 5. 主线程收集所有结果并打印总和（应为 1+2+3+4+5+6=21）

// 提示：用 Future<Integer> 收集每个任务的结果`}
      answerCode={`import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class ThreadPoolCallableDemo {
    public static void main(String[] args) throws Exception {
        // 1. 创建自定义线程池
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
            2,                                   // corePoolSize
            4,                                   // maximumPoolSize
            60L, TimeUnit.SECONDS,               // keepAliveTime + unit
            new ArrayBlockingQueue<>(5),         // 有界工作队列，容量5
            Executors.defaultThreadFactory(),    // 默认线程工厂
            new ThreadPoolExecutor.AbortPolicy() // 拒绝策略：抛异常
        );

        // 2. 提交6个Callable任务，收集Future
        List<Future<Integer>> futures = new ArrayList<>();
        for (int i = 1; i <= 6; i++) {
            final int num = i;
            Future<Integer> future = pool.submit(() -> {
                System.out.println(Thread.currentThread().getName()
                    + " 计算任务 " + num);
                Thread.sleep(200); // 模拟耗时
                return num; // 返回任务编号
            });
            futures.add(future);
        }

        // 3. 收集结果，计算总和
        int sum = 0;
        for (Future<Integer> f : futures) {
            sum += f.get(); // 阻塞等待每个结果
        }

        System.out.println("所有任务结果之和：" + sum); // 输出：21

        pool.shutdown();
    }
}`}
    />
  </article>
);

export default index;
