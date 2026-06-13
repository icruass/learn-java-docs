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
    <Title>多线程基础概念</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        多线程是 Java 后端开发中绕不开的核心主题。本节从最基础的概念入手：
        搞清楚<Text bold>程序、进程、线程</Text>三者的关系，理解<Text bold>并发与并行</Text>的区别，
        掌握线程的<Text bold>六种生命周期状态</Text>，以及 JVM 中的主线程与守护线程。
        这些概念是学习线程创建、线程安全、线程池的地基——概念不清，后面的代码写再多也会云里雾里。
      </Paragraph>
    </Callout>

    <Heading3>1. 程序、进程、线程的区别</Heading3>
    <Paragraph>
      这三个词经常混用，但含义截然不同。简单类比：
      <Text bold>程序</Text>是菜谱（静态的文字），<Text bold>进程</Text>是厨师照着菜谱做菜的整个过程（占用了厨房、锅碗瓢盆），
      <Text bold>线程</Text>是厨师的一只手（一个厨师可以两手并用，同时做两件事）。
    </Paragraph>
    <Table
      head={['概念', '定义', '内存', '数量关系', '举例']}
      rows={[
        ['程序', '磁盘上的静态代码文件', '不占用运行内存', '可有多个实例', 'QQ.exe 安装包'],
        ['进程', '运行中的程序，由OS分配资源', '独立内存空间，互相隔离', '一个程序可启动多个进程', '运行中的 QQ（任务管理器可见）'],
        ['线程', '进程内的一个执行单元（执行路径）', '共享所在进程的堆内存', '一个进程至少一个线程，可有多个', 'QQ 同时收消息、播放声音、更新好友列表'],
      ]}
    />
    <Callout type="tip" title="关键点">
      <Paragraph>
        线程是 CPU 调度的最小单位，进程是操作系统资源分配的最小单位。
        同一进程内的多个线程<Text bold>共享堆内存和方法区</Text>，但每个线程拥有自己独立的<Text bold>栈（Stack）</Text>和<Text bold>程序计数器（PC Register）</Text>。
        这就是为什么多线程会产生"线程安全问题"——大家操作同一块内存，容易打架。
      </Paragraph>
    </Callout>

    <Heading3>2. 并发 vs 并行</Heading3>
    <Paragraph>
      多线程程序的执行方式取决于 CPU 核心数量。理解并发与并行的区别，
      能帮你更好地判断程序在什么硬件环境下能真正"同时"运行。
    </Paragraph>
    <Table
      head={['概念', '英文', 'CPU核心要求', '执行方式', '生活类比']}
      rows={[
        ['并发', 'Concurrency', '单核或多核均可', '多个线程交替执行，宏观上看起来同时', '一个收银员快速轮流服务多位顾客'],
        ['并行', 'Parallelism', '必须多核', '多个线程在不同核心上真正同时执行', '多个收银员同时各自服务一位顾客'],
      ]}
    />
    <Paragraph>
      在单核 CPU 上，所谓的"多线程"实质是<Text bold>并发</Text>：操作系统通过极快的<Text bold>上下文切换（Context Switch）</Text>，
      让每个线程轮流占用 CPU，由于切换速度极快（毫秒级甚至微秒级），人感觉是"同时"在跑。
      在多核 CPU 上，才能实现真正的<Text bold>并行</Text>。
    </Paragraph>
    <Callout type="warning" title="注意">
      <Paragraph>
        Java 程序实际上在执行时往往是<Text bold>并发+并行共存</Text>的：多核 CPU 上可以并行，
        但线程数往往多于核心数，超出的部分仍然并发轮转。不必过度纠结这个区别，
        但面试中被问到时要能清楚区分。
      </Paragraph>
    </Callout>

    <Heading3>3. 多线程的优缺点</Heading3>
    <Heading4>3.1 优点</Heading4>
    <UnorderedList>
      <ListItem>
        <Text bold>提高 CPU 利用率</Text>：当一个线程在等待 IO（磁盘读写、网络请求）时，
        另一个线程可以继续使用 CPU，避免 CPU 空闲浪费。
      </ListItem>
      <ListItem>
        <Text bold>提升用户响应速度</Text>：GUI 程序（如 Android App）可以把耗时操作放在后台线程，
        主线程继续响应用户点击，界面不卡顿。
      </ListItem>
      <ListItem>
        <Text bold>充分利用多核硬件</Text>：现代服务器动辄几十核，多线程才能让硬件物尽其用，提升程序吞吐量。
      </ListItem>
    </UnorderedList>
    <Heading4>3.2 缺点</Heading4>
    <UnorderedList>
      <ListItem>
        <Text bold>线程安全问题</Text>：多个线程操作共享数据时，若不加同步，会出现数据错乱，
        如超卖、计数不准等 Bug，且复现概率低、极难排查。
      </ListItem>
      <ListItem>
        <Text bold>调试困难</Text>：多线程 Bug（竞态条件、死锁）的触发具有随机性，
        在开发机上不出现、上线后才暴露的情况很常见。
      </ListItem>
      <ListItem>
        <Text bold>资源开销</Text>：每个线程都需要分配栈内存（默认 512KB～1MB），
        线程切换也需要保存和恢复上下文，线程过多反而降低性能。
      </ListItem>
    </UnorderedList>

    <Heading3>4. JVM 中的线程</Heading3>
    <Paragraph>
      一个 Java 程序启动后，JVM 内部并不只有你写的 <InlineCode>main</InlineCode> 方法那一个线程。
      用 <InlineCode>jstack</InlineCode> 命令或调试器查看，会发现有好几个线程在同时运行：
    </Paragraph>
    <UnorderedList>
      <ListItem>
        <Text bold>主线程（main thread）</Text>：程序入口，执行 <InlineCode>public static void main(String[] args)</InlineCode>。
        这是用户线程，main 方法执行完毕后，如果没有其他用户线程，JVM 就会退出。
      </ListItem>
      <ListItem>
        <Text bold>GC 线程（垃圾回收线程）</Text>：负责自动回收不再使用的对象，是<Text bold>守护线程</Text>。
      </ListItem>
      <ListItem>
        <Text bold>其他 JVM 内部线程</Text>：如 JIT 编译器线程、Finalizer 线程等，也是守护线程。
      </ListItem>
    </UnorderedList>

    <Heading4>4.1 用户线程 vs 守护线程</Heading4>
    <Table
      head={['类型', '说明', '典型例子', '如何设置']}
      rows={[
        ['用户线程（User Thread）', 'JVM 会等待所有用户线程执行完才退出', '主线程、我们自己创建的线程', '默认就是用户线程'],
        ['守护线程（Daemon Thread）', '只要所有用户线程结束，JVM 立即退出，守护线程随之销毁', 'GC 线程、后台心跳线程', '调用 thread.setDaemon(true)，必须在 start() 之前调用'],
      ]}
    />
    <CodeBlock
      title="DaemonThreadDemo.java"
      code={`public class DaemonThreadDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread daemon = new Thread(() -> {
            while (true) {
                System.out.println("守护线程运行中...");
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    break;
                }
            }
        });

        // 必须在 start() 之前设置，否则抛 IllegalThreadStateException
        daemon.setDaemon(true);
        daemon.start();

        // 主线程（用户线程）睡 2 秒后结束
        Thread.sleep(2000);
        System.out.println("主线程结束，JVM 即将退出，守护线程被强制销毁");
        // main 方法结束后，守护线程不会继续运行
    }
}`}
    />

    <Heading3>5. 线程的六种状态</Heading3>
    <Paragraph>
      Java 线程的状态定义在 <InlineCode>Thread.State</InlineCode> 枚举中，共 6 种。
      理解状态转换是分析线程问题（如线程卡住、死锁）的关键。
    </Paragraph>
    <Table
      head={['状态', '说明', '如何进入', '如何离开']}
      rows={[
        ['NEW（新建）', '线程对象已创建，但尚未启动', 'new Thread()', '调用 start()'],
        ['RUNNABLE（可运行）', '正在 JVM 中运行，或等待 CPU 时间片（就绪+运行的合并态）', '调用 start()', '等待锁 / IO / sleep / 运行结束'],
        ['BLOCKED（阻塞）', '等待获取 synchronized 锁', '竞争 synchronized 锁失败', '成功获取锁，回到 RUNNABLE'],
        ['WAITING（无限等待）', '无限期等待，需要其他线程显式唤醒', '调用 Object.wait() / Thread.join()', '其他线程调用 notify() / notifyAll() / join线程结束'],
        ['TIMED_WAITING（计时等待）', '有超时的等待，到时间自动返回', '调用 Thread.sleep(ms) / Object.wait(ms) / join(ms)', '超时到期，或被提前唤醒'],
        ['TERMINATED（终止）', '线程执行完毕，或因异常退出', 'run() 方法正常结束或抛出未捕获异常', '终止状态不可逆转'],
      ]}
    />
    <CodeBlock
      language="text"
      title="线程状态转换图（简化版）"
      code={`           start()
NEW  ──────────────►  RUNNABLE
                          │
              ┌───────────┼─────────────────────┐
              │           │                     │
              ▼           ▼                     ▼
          BLOCKED      WAITING           TIMED_WAITING
          (等synchronized锁) (wait/join)  (sleep/wait(ms))
              │           │                     │
              └───────────┴─────────────────────┘
                          │  (获取锁 / 被notify / 超时)
                          ▼
                       RUNNABLE
                          │
                          ▼
                      TERMINATED`}
    />
    <Callout type="tip" title="常考点">
      <Paragraph>
        <Text bold>BLOCKED 和 WAITING 的区别</Text>很常被面试考到：BLOCKED 是在等 synchronized 锁（被动阻塞，
        只要别人释放锁就能竞争）；WAITING 是主动调用 <InlineCode>wait()</InlineCode> 放弃 CPU，
        必须等其他线程调用 <InlineCode>notify()</InlineCode> 才会醒来。
        另外，<Text bold>sleep() 不释放锁，wait() 会释放锁</Text>，这是非常重要的区别。
      </Paragraph>
    </Callout>

    <Heading3>6. Thread 类的常用方法</Heading3>
    <Table
      head={['方法', '说明', '注意事项']}
      rows={[
        ['Thread.currentThread()', '静态方法，返回当前正在执行的线程对象', '任意位置都可调用'],
        ['getName() / setName(name)', '获取/设置线程名称', '默认名称为 Thread-0、Thread-1...'],
        ['getPriority() / setPriority(n)', '获取/设置优先级（1～10，默认5）', '优先级高只是被调度概率更大，不保证一定先执行'],
        ['Thread.sleep(ms)', '静态方法，让当前线程休眠指定毫秒', '不释放锁；需处理 InterruptedException'],
        ['join()', '等待该线程执行完毕再继续', '调用者线程进入 WAITING；可传超时参数'],
        ['interrupt()', '中断线程（设置中断标志位）', '不会强制停止线程，sleep/wait 会抛 InterruptedException'],
        ['isInterrupted()', '判断线程是否被标记为中断', '不清除中断标志'],
        ['Thread.interrupted()', '静态方法，判断当前线程是否中断，并清除标志', '注意：会重置中断状态'],
        ['isAlive()', '判断线程是否还活着（未终止）', 'start() 之后、run() 结束之前返回 true'],
        ['isDaemon() / setDaemon(b)', '判断/设置是否为守护线程', 'setDaemon 必须在 start() 前调用'],
      ]}
    />
    <CodeBlock
      title="ThreadMethodsDemo.java"
      code={`public class ThreadMethodsDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread t = new Thread(() -> {
            // 在线程内部获取当前线程对象
            Thread current = Thread.currentThread();
            System.out.println("线程名：" + current.getName());
            System.out.println("线程优先级：" + current.getPriority());
            System.out.println("是否守护线程：" + current.isDaemon());

            try {
                Thread.sleep(1000); // 当前线程休眠 1 秒
            } catch (InterruptedException e) {
                System.out.println("线程被中断了！");
            }
        });

        t.setName("工作线程-1");
        t.setPriority(Thread.MAX_PRIORITY); // 最高优先级 = 10
        t.start();

        System.out.println("主线程等待 t 执行完...");
        t.join(); // 主线程阻塞，直到 t 结束
        System.out.println("t 已结束，主线程继续");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`主线程等待 t 执行完...
线程名：工作线程-1
线程优先级：10
是否守护线程：false
t 已结束，主线程继续`}
    />

    <Callout type="success" title="本节小结">
      <Paragraph>本节建立了多线程编程的认知框架，核心要点如下：</Paragraph>
      <UnorderedList>
        <ListItem>线程是进程内的执行单元，共享堆内存，独享栈和程序计数器</ListItem>
        <ListItem>并发 = 交替执行（单核），并行 = 真正同时（多核）</ListItem>
        <ListItem>线程有 6 种状态：NEW → RUNNABLE ↔ BLOCKED/WAITING/TIMED_WAITING → TERMINATED</ListItem>
        <ListItem>守护线程随用户线程消亡而销毁，必须在 start() 前设置 setDaemon(true)</ListItem>
        <ListItem>sleep() 不释放锁，wait() 释放锁——这个区别贯穿整个多线程学习</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>7. 练习题</Heading3>
    <Paragraph>先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。</Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：概念辨析"
      code={`问：以下说法哪些正确，哪些错误？请逐条判断并说明理由。

A. 一个进程可以包含多个线程，一个线程也可以属于多个进程。
B. 多核 CPU 上，多线程程序一定以并行方式执行。
C. Java 中线程的优先级越高，它一定先于低优先级线程执行完毕。
D. 调用 thread.setDaemon(true) 后，该线程将在所有用户线程结束时被 JVM 自动销毁。`}
      answerCode={`A. 错误。线程归属于且只归属于一个进程，不能跨进程。

B. 错误。即使是多核 CPU，如果线程数多于核心数，超出部分仍然并发执行。
   多核 CPU 上是"并行 + 并发"共存，不是纯并行。

C. 错误。优先级高只是被操作系统调度的概率更大，具体调度由 OS 决定，
   Java 不保证高优先级线程一定先完成。不能依赖优先级来控制执行顺序。

D. 正确。守护线程的生命周期依附于用户线程，当最后一个用户线程结束，
   JVM 退出，守护线程随之被销毁，无论它的 run() 方法是否执行完毕。`}
    />

    <CodeBlock
      qa
      language="text"
      title="练习 2：线程状态分析"
      code={`问：请描述以下每行代码执行后，线程 t 的状态是什么？

Thread t = new Thread(() -> {
    synchronized (lock) {          // (D) 假设 lock 已被其他线程持有
        try {
            lock.wait();           // (E)
        } catch (InterruptedException e) {}
    }
});
// (A) 此时 t 的状态？
t.start();
// (B) start() 后 t 的状态？
Thread.sleep(100); // 主线程睡一下，确保 t 开始运行
// (C) t 运行起来后，执行到 synchronized 行时，假设 lock 被其他线程持有，t 的状态？
// (D) 见上方注释
// (E) 当 t 获得 lock 并执行 lock.wait() 后，t 的状态？`}
      answerCode={`(A) new Thread() 之后，t.start() 之前 → NEW（新建）

(B) t.start() 之后 → RUNNABLE（可运行）
    注意：RUNNABLE 包含"就绪"和"正在执行"两个子状态，Java 不区分。

(C) 执行到 synchronized(lock)，发现 lock 被其他线程持有，
    无法获取锁 → BLOCKED（阻塞）

(D) 同 (C)，BLOCKED 状态，等待其他线程释放 synchronized 锁

(E) 获取到 lock 进入同步块，执行 lock.wait() 后，
    t 释放 lock 并进入 → WAITING（无限等待）
    只有其他线程调用 lock.notify() / lock.notifyAll() 后，
    t 才会尝试重新获取 lock，回到 RUNNABLE（或先经过 BLOCKED）`}
    />

    <CodeBlock
      qa
      title="练习 3：编程题"
      code={`// 请编写一个程序，创建两个线程：
// 线程A：每隔 300ms 打印一次"线程A执行中"，共打印 5 次
// 线程B：每隔 500ms 打印一次"线程B执行中"，共打印 3 次
// 要求：主线程等待两个线程都执行完毕后，打印"所有线程执行完毕"
// 提示：使用 join() 方法`}
      answerCode={`public class JoinDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread threadA = new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                System.out.println("线程A执行中 - 第" + i + "次");
                try {
                    Thread.sleep(300);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }, "线程A");

        Thread threadB = new Thread(() -> {
            for (int i = 1; i <= 3; i++) {
                System.out.println("线程B执行中 - 第" + i + "次");
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }, "线程B");

        threadA.start();
        threadB.start();

        // 主线程等待 A 和 B 都执行完
        threadA.join();
        threadB.join();

        System.out.println("所有线程执行完毕");
    }
}`}
    />
  </article>
);

export default index;
