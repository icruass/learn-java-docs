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
    <Title>线程安全与 synchronized</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        上一节的多窗口卖票代码存在隐患——多个线程同时操作共享数据，
        会出现<Text bold>负数票、重复售票</Text>等"灵异现象"。这就是<Text bold>线程安全问题</Text>。
        本节从问题复现出发，讲解 Java 最基础的同步方案 <InlineCode>synchronized</InlineCode>，
        然后介绍死锁的成因与避免，最后引入更灵活的 <InlineCode>ReentrantLock</InlineCode> 和
        <InlineCode>volatile</InlineCode>，构建完整的线程安全知识体系。
      </Paragraph>
    </Callout>

    <Heading3>1. 线程安全问题演示（卖票案例）</Heading3>
    <Heading4>1.1 不安全的卖票代码</Heading4>
    <CodeBlock
      title="UnsafeTicket.java"
      code={`public class UnsafeTicket implements Runnable {
    private int tickets = 100; // 共享的票数

    @Override
    public void run() {
        while (true) {
            if (tickets > 0) {
                // 问题就在这里：判断 tickets > 0 到执行 tickets-- 之间，
                // 可能有其他线程也通过了 if 判断，导致重复售票或负票
                try {
                    Thread.sleep(10); // 模拟网络延迟，放大线程安全问题
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
                System.out.println(Thread.currentThread().getName()
                    + " 售出第 " + tickets-- + " 张票");
            } else {
                break;
            }
        }
    }

    public static void main(String[] args) {
        UnsafeTicket task = new UnsafeTicket();
        new Thread(task, "窗口1").start();
        new Thread(task, "窗口2").start();
        new Thread(task, "窗口3").start();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="可能的控制台输出（问题现象）"
      code={`窗口1 售出第 100 张票
窗口2 售出第 100 张票   ← 重复售票！
窗口3 售出第 99 张票
...
窗口1 售出第 1 张票
窗口2 售出第 0 张票    ← 第 0 张票根本不存在！
窗口3 售出第 -1 张票   ← 出现了负票！`}
    />

    <Heading4>1.2 问题根因分析</Heading4>
    <Paragraph>
      线程安全问题的根本原因是：<Text bold>多线程操作同一共享数据时，操作不是原子性的</Text>。
      以 <InlineCode>tickets--</InlineCode> 为例，它在 CPU 层面分 3 步：
    </Paragraph>
    <OrderedList>
      <ListItem>读取 tickets 的值到寄存器（读）</ListItem>
      <ListItem>寄存器的值减 1（算）</ListItem>
      <ListItem>将结果写回 tickets（写）</ListItem>
    </OrderedList>
    <Paragraph>
      线程A 执行到第 1 步读到 <InlineCode>tickets = 1</InlineCode>，
      还没写回，线程B 也读到 <InlineCode>tickets = 1</InlineCode>，
      两个线程都认为还有票，都去卖，最终 tickets 变成 <InlineCode>-1</InlineCode>。
    </Paragraph>

    <Heading3>2. synchronized 同步方案</Heading3>
    <Paragraph>
      <InlineCode>synchronized</InlineCode> 是 Java 内置的同步关键字，
      本质是给一段代码加<Text bold>互斥锁（Monitor Lock）</Text>：
      同一时刻只允许一个线程执行被锁住的代码块，其他线程排队等待。
    </Paragraph>

    <Heading4>2.1 方式一：同步代码块</Heading4>
    <CodeBlock
      title="语法格式"
      code={`synchronized (锁对象) {
    // 需要同步的代码（临界区）
}`}
    />
    <Callout type="warning" title="锁对象的关键要求">
      <Paragraph>
        <Text bold>所有线程必须使用同一个锁对象</Text>，否则互相不认识对方的锁，同步失效。
        锁对象可以是任意 Java 对象，但常见选择是：
        <InlineCode>this</InlineCode>（当前实例，Runnable 场景下只有一个实例，可以用）、
        <Text bold>独立的静态 Object</Text>、或 <InlineCode>类名.class</InlineCode>。
      </Paragraph>
    </Callout>
    <CodeBlock
      title="SafeTicket.java（同步代码块版）"
      code={`public class SafeTicket implements Runnable {
    private int tickets = 100;
    // 定义一把锁——所有线程共享同一个 Runnable 实例，所以 this 也可以用作锁
    private final Object lock = new Object();

    @Override
    public void run() {
        while (true) {
            synchronized (lock) {  // 进入同步块前必须获取 lock 锁
                if (tickets <= 0) {
                    break; // 票卖完，退出循环
                }
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
                System.out.println(Thread.currentThread().getName()
                    + " 售出第 " + tickets-- + " 张票");
            } // 离开同步块时自动释放锁，其他线程可以竞争
        }
    }

    public static void main(String[] args) {
        SafeTicket task = new SafeTicket();
        new Thread(task, "窗口1").start();
        new Thread(task, "窗口2").start();
        new Thread(task, "窗口3").start();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（正常，无负票、无重复）"
      code={`窗口1 售出第 100 张票
窗口3 售出第 99 张票
窗口2 售出第 98 张票
...
窗口1 售出第 2 张票
窗口3 售出第 1 张票`}
    />

    <Heading4>2.2 方式二：同步方法</Heading4>
    <Paragraph>
      在方法声明上加 <InlineCode>synchronized</InlineCode> 关键字，
      整个方法体就是一个同步代码块。
    </Paragraph>
    <Table
      head={['同步方法类型', '锁对象', '语法']}
      rows={[
        ['实例同步方法', 'this（当前对象）', 'public synchronized void method() { ... }'],
        ['静态同步方法', '类名.class（类的 Class 对象）', 'public static synchronized void method() { ... }'],
      ]}
    />
    <CodeBlock
      title="SafeTicketV2.java（同步方法版）"
      code={`public class SafeTicketV2 implements Runnable {
    private int tickets = 100;

    // 同步方法：锁是 this（即 SafeTicketV2 的实例）
    private synchronized void sell() {
        if (tickets <= 0) return;
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return;
        }
        System.out.println(Thread.currentThread().getName()
            + " 售出第 " + tickets-- + " 张票");
    }

    @Override
    public void run() {
        while (tickets > 0) {
            sell();
        }
    }

    public static void main(String[] args) {
        SafeTicketV2 task = new SafeTicketV2();
        new Thread(task, "窗口1").start();
        new Thread(task, "窗口2").start();
        new Thread(task, "窗口3").start();
    }
}`}
    />
    <Callout type="tip" title="同步方法 vs 同步代码块">
      <Paragraph>
        同步方法是对整个方法加锁，粒度较粗；同步代码块可以<Text bold>缩小锁的范围</Text>，
        只锁真正需要保护的代码，减少其他线程的等待时间，性能更好。
        实际开发中优先考虑同步代码块，并让同步块尽量短小。
      </Paragraph>
    </Callout>

    <Heading3>3. 死锁问题</Heading3>
    <Heading4>3.1 什么是死锁</Heading4>
    <Paragraph>
      死锁是指<Text bold>两个或多个线程互相持有对方需要的锁，又都在等待对方释放，导致所有线程永久阻塞</Text>。
      四个必要条件（Coffman 条件）：互斥、持有并等待、不可剥夺、循环等待——四者缺一不可。
    </Paragraph>
    <CodeBlock
      title="DeadLockDemo.java"
      code={`public class DeadLockDemo {
    private static final Object lockA = new Object();
    private static final Object lockB = new Object();

    public static void main(String[] args) {
        // 线程1：先获取 lockA，再尝试获取 lockB
        Thread t1 = new Thread(() -> {
            synchronized (lockA) {
                System.out.println("线程1 获取了 lockA，等待 lockB...");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lockB) { // 此时 lockB 被线程2持有，永远等待
                    System.out.println("线程1 获取了 lockB");
                }
            }
        }, "线程1");

        // 线程2：先获取 lockB，再尝试获取 lockA
        Thread t2 = new Thread(() -> {
            synchronized (lockB) {
                System.out.println("线程2 获取了 lockB，等待 lockA...");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lockA) { // 此时 lockA 被线程1持有，永远等待
                    System.out.println("线程2 获取了 lockA");
                }
            }
        }, "线程2");

        t1.start();
        t2.start();
        // 程序将在此卡死，两个线程永远无法继续
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（程序卡死，不会继续）"
      code={`线程1 获取了 lockA，等待 lockB...
线程2 获取了 lockB，等待 lockA...
（程序卡住，不再输出任何内容）`}
    />

    <Heading4>3.2 如何避免死锁</Heading4>
    <UnorderedList>
      <ListItem>
        <Text bold>固定加锁顺序</Text>：所有线程按照相同的顺序获取锁（如总是先获取 lockA 再获取 lockB），
        破坏"循环等待"条件，是最简单有效的方式。
      </ListItem>
      <ListItem>
        <Text bold>缩小锁粒度</Text>：尽量不在持有一把锁时去申请另一把锁，减少嵌套锁的使用。
      </ListItem>
      <ListItem>
        <Text bold>使用 tryLock 超时</Text>：使用 <InlineCode>ReentrantLock.tryLock(timeout, unit)</InlineCode>
        尝试获取锁，超时后放弃并释放已持有的锁，再重试，避免永久等待。
      </ListItem>
      <ListItem>
        <Text bold>使用工具检测</Text>：通过 <InlineCode>jstack</InlineCode> 命令或 VisualVM
        可以检测到死锁的线程堆栈，辅助排查。
      </ListItem>
    </UnorderedList>

    <Heading3>4. Lock 接口（java.util.concurrent.locks）</Heading3>
    <Paragraph>
      JDK 5 引入了 <InlineCode>java.util.concurrent.locks</InlineCode> 包，
      提供了比 <InlineCode>synchronized</InlineCode> 更灵活的锁机制。
      最常用的实现类是 <InlineCode>ReentrantLock</InlineCode>（可重入锁）。
    </Paragraph>

    <Table
      head={['特性', 'synchronized', 'ReentrantLock']}
      rows={[
        ['用法', '关键字，自动加解锁', '手动调用 lock()/unlock()'],
        ['是否可重入', '是', '是'],
        ['锁是否可中断', '不可中断等待', '可通过 lockInterruptibly() 响应中断'],
        ['是否支持超时', '不支持', '支持 tryLock(timeout, unit)'],
        ['是否支持公平锁', '不支持（非公平）', '支持（构造时传 true 开启公平锁）'],
        ['是否支持多条件', '只有一个等待队列', '支持多个 Condition 对象'],
        ['忘记解锁风险', '无（自动释放）', '有（必须在 finally 中 unlock()）'],
      ]}
    />

    <Heading4>4.1 ReentrantLock 基本用法</Heading4>
    <CodeBlock
      title="SafeTicketWithLock.java"
      code={`import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SafeTicketWithLock implements Runnable {
    private int tickets = 100;
    // 创建锁对象（默认非公平锁；传 true 为公平锁）
    private final Lock lock = new ReentrantLock();

    @Override
    public void run() {
        while (true) {
            lock.lock(); // 获取锁（阻塞直到获取成功）
            try {
                if (tickets <= 0) {
                    break;
                }
                Thread.sleep(10);
                System.out.println(Thread.currentThread().getName()
                    + " 售出第 " + tickets-- + " 张票");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } finally {
                lock.unlock(); // 必须在 finally 中释放锁！否则异常时锁永远不释放
            }
        }
    }

    public static void main(String[] args) {
        SafeTicketWithLock task = new SafeTicketWithLock();
        new Thread(task, "窗口1").start();
        new Thread(task, "窗口2").start();
        new Thread(task, "窗口3").start();
    }
}`}
    />
    <Callout type="warning" title="必须在 finally 中 unlock()">
      <Paragraph>
        使用 ReentrantLock 时，<Text bold>务必将 unlock() 放在 finally 块中</Text>。
        如果 try 块中抛出异常而没有 finally 保证解锁，锁将永远不会释放，
        所有等待该锁的线程都会永久阻塞——比死锁更难排查。
      </Paragraph>
    </Callout>

    <Heading4>4.2 tryLock 超时避免死锁</Heading4>
    <CodeBlock
      title="TryLockDemo.java"
      code={`import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class TryLockDemo {
    private static final ReentrantLock lockA = new ReentrantLock();
    private static final ReentrantLock lockB = new ReentrantLock();

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            while (true) {
                if (lockA.tryLock()) { // 非阻塞尝试获取
                    try {
                        Thread.sleep(50);
                        if (lockB.tryLock(200, TimeUnit.MILLISECONDS)) { // 超时等待 200ms
                            try {
                                System.out.println("线程1 同时持有 A 和 B，执行任务");
                                return;
                            } finally {
                                lockB.unlock();
                            }
                        }
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return;
                    } finally {
                        lockA.unlock();
                    }
                }
                // 没获取到，稍等再重试
                try { Thread.sleep(10); } catch (InterruptedException e) { return; }
            }
        }, "线程1");

        // 线程2 同理，不再重复
        t1.start();
    }
}`}
    />

    <Heading3>5. volatile 关键字</Heading3>
    <Heading4>5.1 内存可见性问题</Heading4>
    <Paragraph>
      Java 内存模型（JMM）中，每个线程都有自己的<Text bold>工作内存（本地缓存）</Text>，
      线程读写变量时先操作工作内存，再同步到主内存。当一个线程修改了变量，
      另一个线程可能还在读缓存中的旧值，这就是<Text bold>内存可见性问题</Text>。
    </Paragraph>
    <CodeBlock
      title="VisibilityProblem.java"
      code={`public class VisibilityProblem {
    // 没有 volatile，线程B 可能永远看不到线程A 对 running 的修改
    private static boolean running = true;

    public static void main(String[] args) throws InterruptedException {
        Thread workerThread = new Thread(() -> {
            System.out.println("工作线程开始运行");
            while (running) {
                // 线程B 可能一直循环，因为它的工作内存里 running 永远是 true
            }
            System.out.println("工作线程检测到 running=false，停止");
        });

        workerThread.start();
        Thread.sleep(1000);

        running = false; // 主线程修改，但工作线程可能看不到！
        System.out.println("主线程设置 running=false");
    }
}`}
    />

    <Heading4>5.2 volatile 解决可见性</Heading4>
    <CodeBlock
      title="VolatileDemo.java"
      code={`public class VolatileDemo {
    // volatile 保证：写操作立即刷新到主内存，读操作总是从主内存读
    private static volatile boolean running = true;

    public static void main(String[] args) throws InterruptedException {
        Thread workerThread = new Thread(() -> {
            System.out.println("工作线程开始运行");
            while (running) {
                // 有 volatile 后，每次读 running 都从主内存读，能及时看到修改
            }
            System.out.println("工作线程检测到 running=false，停止");
        });

        workerThread.start();
        Thread.sleep(1000);

        running = false; // 立即刷新到主内存，工作线程可以看到
        System.out.println("主线程设置 running=false");
    }
}`}
    />

    <Table
      head={['特性', 'volatile', 'synchronized']}
      rows={[
        ['保证可见性', '是', '是'],
        ['保证原子性', '否（i++ 这类操作不安全）', '是（同步块内所有操作原子）'],
        ['保证有序性（禁止指令重排）', '是', '是'],
        ['性能', '轻量级', '相对较重'],
        ['适用场景', '状态标志位、单次赋值', '需要原子操作的复合操作'],
      ]}
    />
    <Callout type="warning" title="volatile 不能替代 synchronized">
      <Paragraph>
        <InlineCode>volatile</InlineCode> 只能保证<Text bold>可见性</Text>，
        <Text bold>不能保证原子性</Text>。
        对于 <InlineCode>count++</InlineCode>（读-改-写三步操作）这类复合操作，
        多线程下仍然不安全，必须使用 <InlineCode>synchronized</InlineCode> 或
        <InlineCode>AtomicInteger</InlineCode> 等原子类。
        <InlineCode>volatile</InlineCode> 最适合的场景是<Text bold>状态标志位</Text>
        （如上面的 running 变量），即只有一个线程写、多个线程读的简单场景。
      </Paragraph>
    </Callout>

    <Callout type="success" title="本节小结">
      <Paragraph>线程安全是多线程编程的核心挑战，本节的知识框架：</Paragraph>
      <UnorderedList>
        <ListItem>线程安全问题根源：共享数据的非原子操作在线程切换时被打断</ListItem>
        <ListItem><InlineCode>synchronized</InlineCode> 提供互斥锁，分同步代码块（粒度小）和同步方法（粒度大）两种形式</ListItem>
        <ListItem>死锁四要素：互斥、持有并等待、不可剥夺、循环等待；破坏任一即可避免</ListItem>
        <ListItem><InlineCode>ReentrantLock</InlineCode> 更灵活，支持超时获取锁，但必须在 finally 中解锁</ListItem>
        <ListItem><InlineCode>volatile</InlineCode> 保证可见性但不保证原子性，适合状态标志位</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。</Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：概念辨析"
      code={`问：下面关于 synchronized 的说法，哪些正确？

A. synchronized(this) 中，this 指的是调用该方法的对象，
   不同线程如果持有不同对象，就算加了 synchronized 也不互斥。
B. 静态同步方法的锁是 this。
C. 一个线程在持有某对象的锁时，可以再次进入以该对象为锁的另一个同步块（可重入）。
D. synchronized 可以修饰类（直接写在 class 前面）。`}
      answerCode={`A. 正确。synchronized(this) 的锁是"this 这个实例对象"，
   如果两个线程持有的是不同实例（如 new SafeTicket() 各自 new 了一个），
   它们的 this 是不同对象，不互斥。
   这正是 Runnable 方式比继承 Thread 更适合共享资源的原因之一。

B. 错误。静态同步方法的锁是"类名.class"（即该类的 Class 对象），
   而不是 this（this 是实例，静态方法根本没有 this）。

C. 正确。synchronized 是可重入锁（Reentrant），
   同一个线程可以多次获取同一把锁，不会自己锁死自己。
   ReentrantLock 同理（名字里 Re-entrant 就是"可重入"的意思）。

D. 错误。synchronized 可以修饰：实例方法、静态方法、代码块，
   不能直接修饰类定义。`}
    />

    <CodeBlock
      qa
      title="练习 2：死锁分析"
      code={`// 以下代码是否会产生死锁？请分析原因。

public class Quiz2 {
    private static final Object lock = new Object();

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            synchronized (lock) {
                System.out.println("线程1 获取锁");
                synchronized (lock) {  // 同一把锁，再次进入
                    System.out.println("线程1 再次进入同步块");
                }
            }
        });

        Thread t2 = new Thread(() -> {
            synchronized (lock) {
                System.out.println("线程2 获取锁");
            }
        });

        t1.start();
        t2.start();
    }
}`}
      answerCode={`不会产生死锁。

原因分析：
1. synchronized 是可重入锁。线程1 在已经持有 lock 的情况下，
   再次申请同一把锁 lock，不会阻塞自己——可重入性保证了这一点。
   内部的 synchronized(lock) 直接成功，正常执行完毕后逐层释放。

2. 死锁需要"两个或多个线程，互相持有对方需要的不同锁"。
   这里只有一把锁，而且两个线程申请的是同一把锁，只会有一个排队等另一个，
   但不构成循环等待，不是死锁。

程序正常输出（顺序不固定）：
线程1 获取锁
线程1 再次进入同步块
线程2 获取锁`}
    />

    <CodeBlock
      qa
      title="练习 3：编程题 - 用 ReentrantLock 实现线程安全的计数器"
      code={`// 实现一个线程安全的计数器类 SafeCounter，要求：
// 1. 内部用 ReentrantLock 保证线程安全（不用 synchronized）
// 2. 支持 increment()、decrement()、getCount() 三个方法
// 3. 在 main 方法中，启动 3 个线程各自调用 increment() 1000 次，
//    等所有线程结束后打印最终计数（应该是 3000）

// 提示：注意 finally 中 unlock()`}
      answerCode={`import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SafeCounter {
    private int count = 0;
    private final Lock lock = new ReentrantLock();

    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock(); // 无论是否异常，都要释放锁
        }
    }

    public void decrement() {
        lock.lock();
        try {
            count--;
        } finally {
            lock.unlock();
        }
    }

    public int getCount() {
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) throws InterruptedException {
        SafeCounter counter = new SafeCounter();

        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) counter.increment();
        }, "线程1");

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) counter.increment();
        }, "线程2");

        Thread t3 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) counter.increment();
        }, "线程3");

        t1.start(); t2.start(); t3.start();
        t1.join(); t2.join(); t3.join(); // 等待三个线程都执行完

        System.out.println("最终计数：" + counter.getCount()); // 输出：最终计数：3000
    }
}`}
    />
  </article>
);

export default index;
