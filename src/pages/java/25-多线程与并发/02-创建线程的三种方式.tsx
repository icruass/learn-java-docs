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
    <Title>创建线程的三种方式</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        Java 中创建线程有三种经典方式：<Text bold>继承 Thread 类</Text>、
        <Text bold>实现 Runnable 接口</Text>、<Text bold>实现 Callable 接口（配合 FutureTask）</Text>。
        三种方式各有适用场景。本节通过完整代码示例对比三者的写法、优缺点，
        并特别说明 <InlineCode>start()</InlineCode> 与 <InlineCode>run()</InlineCode> 的本质区别——
        这是初学者最容易踩的第一个多线程坑。
      </Paragraph>
    </Callout>

    <Heading3>1. 方式一：继承 Thread 类</Heading3>
    <Heading4>1.1 步骤</Heading4>
    <OrderedList>
      <ListItem>定义一个类<Text bold>继承 Thread</Text></ListItem>
      <ListItem>在子类中<Text bold>重写 run() 方法</Text>，把线程要执行的任务写进去</ListItem>
      <ListItem>创建子类对象</ListItem>
      <ListItem>调用 <InlineCode>start()</InlineCode> 方法启动线程</ListItem>
    </OrderedList>

    <CodeBlock
      title="MyThread.java"
      code={`// 步骤1：继承 Thread
public class MyThread extends Thread {

    private String task;

    public MyThread(String task) {
        this.task = task;
    }

    // 步骤2：重写 run()，定义线程执行的任务
    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            // Thread.currentThread().getName() 获取当前线程名
            System.out.println(getName() + " 正在执行：" + task + "（第" + i + "次）");
            try {
                Thread.sleep(200); // 模拟耗时操作
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
    }
}
`}
    />
    <CodeBlock
      title="ThreadDemo1.java"
      code={`public class ThreadDemo1 {
    public static void main(String[] args) {
        // 步骤3：创建线程对象，可通过构造方法传名称
        MyThread t1 = new MyThread("下载文件A");
        MyThread t2 = new MyThread("下载文件B");
        t1.setName("线程-1");
        t2.setName("线程-2");

        // 步骤4：调用 start()，开启新线程
        t1.start();
        t2.start();

        // main 线程继续执行，不等待 t1/t2
        System.out.println("主线程：两个下载任务已启动");
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出（顺序不固定，体现并发）"
      code={`主线程：两个下载任务已启动
线程-1 正在执行：下载文件A（第1次）
线程-2 正在执行：下载文件B（第1次）
线程-2 正在执行：下载文件B（第2次）
线程-1 正在执行：下载文件A（第2次）
...`}
    />

    <Heading4>1.2 start() 和 run() 的本质区别</Heading4>
    <Paragraph>
      这是初学者<Text bold>最常犯的错误</Text>：直接调用 <InlineCode>run()</InlineCode> 而不是 <InlineCode>start()</InlineCode>。
    </Paragraph>
    <Table
      head={['调用方式', '执行线程', '效果', '是否开启新线程']}
      rows={[
        ['t1.start()', 'JVM 新开一个线程', '开启新线程，在新线程中异步执行 run()', '是'],
        ['t1.run()', '当前线程（如主线程）', '普通方法调用，同步执行，和调用普通方法没区别', '否'],
      ]}
    />
    <CodeBlock
      title="StartVsRunDemo.java"
      code={`public class StartVsRunDemo {
    public static void main(String[] args) {
        Thread t = new Thread(() -> {
            System.out.println("执行线程：" + Thread.currentThread().getName());
        });

        System.out.println("--- 调用 run() ---");
        t.run();   // 在主线程中执行，打印 "main"

        System.out.println("--- 调用 start() ---");
        // 注意：一个 Thread 对象只能 start() 一次，再次调用抛 IllegalThreadStateException
        Thread t2 = new Thread(() -> {
            System.out.println("执行线程：" + Thread.currentThread().getName());
        });
        t2.start(); // 新开线程执行，打印 "Thread-1"（类似名称）
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`--- 调用 run() ---
执行线程：main
--- 调用 start() ---
执行线程：Thread-1`}
    />

    <Callout type="warning" title="注意">
      <Paragraph>
        <Text bold>同一个 Thread 对象只能调用一次 start()</Text>，重复调用会抛出
        <InlineCode>IllegalThreadStateException</InlineCode>。
        继承 Thread 类的缺点是受 Java<Text bold>单继承限制</Text>——
        如果你的类已经继承了别的父类（如 extends Animal），就无法再继承 Thread。
      </Paragraph>
    </Callout>

    <Heading3>2. 方式二：实现 Runnable 接口</Heading3>
    <Heading4>2.1 步骤</Heading4>
    <OrderedList>
      <ListItem>定义一个类<Text bold>实现 Runnable 接口</Text></ListItem>
      <ListItem>重写 <InlineCode>run()</InlineCode> 方法</ListItem>
      <ListItem>创建 Runnable 实现类对象</ListItem>
      <ListItem><InlineCode>new Thread(runnable对象)</InlineCode> 封装为 Thread</ListItem>
      <ListItem>调用 <InlineCode>start()</InlineCode></ListItem>
    </OrderedList>

    <CodeBlock
      title="MyRunnable.java"
      code={`// 步骤1：实现 Runnable 接口
public class MyRunnable implements Runnable {
    private String task;

    public MyRunnable(String task) {
        this.task = task;
    }

    // 步骤2：重写 run()
    @Override
    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(Thread.currentThread().getName()
                + " 正在执行：" + task + "（第" + i + "次）");
            try {
                Thread.sleep(300);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
    }
}`}
    />
    <CodeBlock
      title="ThreadDemo2.java"
      code={`public class ThreadDemo2 {
    public static void main(String[] args) {
        // 步骤3：创建 Runnable 对象
        MyRunnable task1 = new MyRunnable("发送邮件");
        MyRunnable task2 = new MyRunnable("生成报表");

        // 步骤4-5：包装成 Thread 并 start()
        new Thread(task1, "邮件线程").start();
        new Thread(task2, "报表线程").start();

        // ===== Lambda 简写（最常用！） =====
        new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + " Lambda任务执行");
        }, "Lambda线程").start();
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`邮件线程 正在执行：发送邮件（第1次）
报表线程 正在执行：生成报表（第1次）
Lambda线程 Lambda任务执行
邮件线程 正在执行：发送邮件（第2次）
...`}
    />

    <Heading4>2.2 Runnable 的优势：资源共享</Heading4>
    <Paragraph>
      多个 Thread 对象共享同一个 Runnable 实例，非常适合<Text bold>多线程操作同一份数据</Text>的场景（比如多窗口卖同一批票）：
    </Paragraph>
    <CodeBlock
      title="SharedResourceDemo.java"
      code={`// 同一个 Runnable 对象被3个线程共享，ticket 是共享数据
// 注意：这里只演示共享资源的方式，还不是线程安全的，安全问题在下一节解决
public class SharedResourceDemo {
    public static void main(String[] args) {
        // 只创建一个 Runnable 对象
        Runnable ticketTask = new Runnable() {
            private int tickets = 100; // 共享的100张票

            @Override
            public void run() {
                while (tickets > 0) {
                    System.out.println(Thread.currentThread().getName()
                        + " 售出第 " + tickets-- + " 张票");
                }
            }
        };

        // 三个线程共享同一个 ticketTask（共享同一份 tickets）
        new Thread(ticketTask, "窗口1").start();
        new Thread(ticketTask, "窗口2").start();
        new Thread(ticketTask, "窗口3").start();
    }
}`}
    />

    <Heading3>3. 方式三：实现 Callable 接口（有返回值）</Heading3>
    <Paragraph>
      前两种方式的 <InlineCode>run()</InlineCode> 方法返回类型是 <InlineCode>void</InlineCode>，
      无法获取线程的执行结果。当需要线程<Text bold>返回计算结果</Text>或<Text bold>向外抛出受检异常</Text>时，
      需要使用 <InlineCode>Callable</InlineCode> 接口配合 <InlineCode>FutureTask</InlineCode>。
    </Paragraph>

    <Table
      head={['特性', 'Runnable', 'Callable<V>']}
      rows={[
        ['核心方法', 'run()', 'call()'],
        ['返回值', '无（void）', '有（泛型类型 V）'],
        ['受检异常', '不能抛出（需自行处理）', '可以直接抛出 Exception'],
        ['与线程的配合', '直接 new Thread(runnable)', '需要 FutureTask 包装后再 new Thread(futureTask)'],
        ['获取结果', '不支持', 'futureTask.get()（阻塞等待）'],
      ]}
    />

    <Heading4>3.1 步骤</Heading4>
    <OrderedList>
      <ListItem>定义类<Text bold>实现 Callable&lt;返回类型&gt;</Text></ListItem>
      <ListItem>重写 <InlineCode>call()</InlineCode> 方法，在其中写任务逻辑并返回结果</ListItem>
      <ListItem>创建 <InlineCode>FutureTask&lt;V&gt;(callable对象)</InlineCode> 包装器</ListItem>
      <ListItem><InlineCode>new Thread(futureTask).start()</InlineCode> 启动线程</ListItem>
      <ListItem>调用 <InlineCode>futureTask.get()</InlineCode> 获取结果（主线程会阻塞等待）</ListItem>
    </OrderedList>

    <CodeBlock
      title="SumCallable.java"
      code={`import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

// 步骤1：实现 Callable<Integer>，表示返回 Integer 类型
public class SumCallable implements Callable<Integer> {

    private int start;
    private int end;

    public SumCallable(int start, int end) {
        this.start = start;
        this.end = end;
    }

    // 步骤2：重写 call()，可以抛出异常
    @Override
    public Integer call() throws Exception {
        int sum = 0;
        for (int i = start; i <= end; i++) {
            sum += i;
        }
        System.out.println(Thread.currentThread().getName()
            + " 计算完毕，结果：" + sum);
        return sum; // 返回计算结果
    }
}`}
    />
    <CodeBlock
      title="ThreadDemo3.java"
      code={`import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

public class ThreadDemo3 {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        // 步骤3：FutureTask 包装 Callable
        FutureTask<Integer> task1 = new FutureTask<>(new SumCallable(1, 100));
        FutureTask<Integer> task2 = new FutureTask<>(new SumCallable(101, 200));

        // 步骤4：启动线程
        new Thread(task1, "计算线程-1").start();
        new Thread(task2, "计算线程-2").start();

        // 步骤5：get() 获取结果，主线程阻塞直到对应线程执行完毕
        int result1 = task1.get(); // 阻塞等待 task1 完成
        int result2 = task2.get(); // 阻塞等待 task2 完成

        System.out.println("1~100 的和：" + result1);
        System.out.println("101~200 的和：" + result2);
        System.out.println("1~200 的总和：" + (result1 + result2));
    }
}`}
    />
    <CodeBlock
      language="text"
      title="控制台输出"
      code={`计算线程-1 计算完毕，结果：5050
计算线程-2 计算完毕，结果：15050
1~100 的和：5050
101~200 的和：15050
1~200 的总和：20100`}
    />
    <Callout type="tip" title="FutureTask 的阻塞特性">
      <Paragraph>
        <InlineCode>futureTask.get()</InlineCode> 是一个<Text bold>阻塞调用</Text>：
        如果线程还没执行完，主线程会在 get() 处等待。
        可以使用 <InlineCode>get(timeout, unit)</InlineCode> 设置超时时间，
        避免主线程无限等待。如果 <InlineCode>call()</InlineCode> 方法抛出异常，
        get() 会将其包装成 <InlineCode>ExecutionException</InlineCode> 再抛出。
      </Paragraph>
    </Callout>

    <Heading3>4. 三种方式对比总结</Heading3>
    <Table
      head={['对比项', '继承 Thread', '实现 Runnable', '实现 Callable + FutureTask']}
      rows={[
        ['是否有返回值', '无', '无', '有（泛型）'],
        ['是否可抛受检异常', '否', '否', '是'],
        ['受单继承限制', '是（已继承Thread，不能再继承其他类）', '否（接口，可多实现）', '否'],
        ['资源共享', '不方便（需额外设计）', '方便（多线程共享同一Runnable）', '方便'],
        ['代码复杂度', '简单', '简单（Lambda极简）', '较复杂（需FutureTask包装）'],
        ['适用场景', '简单任务、学习使用', '大多数异步任务（最常用）', '需要获取异步计算结果'],
      ]}
    />
    <Callout type="tip" title="实际开发建议">
      <Paragraph>
        实际项目中，<Text bold>直接创建 Thread 的场景很少</Text>，
        绝大多数情况下会使用<Text bold>线程池（ExecutorService）</Text>来管理线程（下一章节讲），
        任务则用 Runnable 或 Callable 表示。
        所以 Runnable 和 Callable 是必须掌握的，而继承 Thread 更多是理解原理时使用。
      </Paragraph>
    </Callout>

    <Heading3>5. 获取和设置线程信息</Heading3>
    <CodeBlock
      title="ThreadInfoDemo.java"
      code={`public class ThreadInfoDemo {
    public static void main(String[] args) {
        // 获取当前线程（main 线程）
        Thread main = Thread.currentThread();
        System.out.println("线程名：" + main.getName());        // main
        System.out.println("线程ID：" + main.getId());          // 通常是 1
        System.out.println("线程优先级：" + main.getPriority()); // 5（默认）
        System.out.println("是否守护线程：" + main.isDaemon());  // false

        // 创建线程时设置名称
        Thread t1 = new Thread(() -> {
            System.out.println("我的名字：" + Thread.currentThread().getName());
        }, "自定义名称线程");  // 构造方法第二参数直接传名称

        // 也可以 setName() 设置
        t1.setName("修改后的名字");

        // 设置优先级（1-10，常量：MIN_PRIORITY=1, NORM_PRIORITY=5, MAX_PRIORITY=10）
        t1.setPriority(Thread.MAX_PRIORITY);

        t1.start();
    }
}`}
    />

    <Callout type="success" title="本节小结">
      <Paragraph>三种创建线程的方式各有侧重：</Paragraph>
      <UnorderedList>
        <ListItem><Text bold>继承 Thread</Text>：最直观，但受单继承限制，适合学习入门</ListItem>
        <ListItem><Text bold>实现 Runnable</Text>：最灵活常用，Lambda 写法极简，支持资源共享</ListItem>
        <ListItem><Text bold>实现 Callable + FutureTask</Text>：有返回值、可抛异常，适合需要获取异步结果的场景</ListItem>
        <ListItem>核心区别：<InlineCode>start()</InlineCode> 开启新线程，<InlineCode>run()</InlineCode> 是普通方法调用</ListItem>
      </UnorderedList>
    </Callout>

    <Heading3>6. 练习题</Heading3>
    <Paragraph>先自己思考，再点 <Text accent>「看答案 →」</Text> 对照。</Paragraph>

    <CodeBlock
      qa
      language="text"
      title="练习 1：概念辨析"
      code={`问：以下代码有什么问题？会出现什么现象？应该如何修正？

Thread t = new Thread(() -> {
    System.out.println("线程执行中：" + Thread.currentThread().getName());
});
t.run();   // 直接调用 run()
t.run();   // 再调用一次`}
      answerCode={`问题1：调用的是 run() 而不是 start()，不会开启新线程。
两次 run() 都在主线程（main）中执行，没有并发效果。
打印结果中线程名都是 "main"，而不是 "Thread-0"。

问题2（次要）：即使改成 start()，同一个 Thread 对象也不能调用两次 start()，
第二次会抛出 IllegalThreadStateException。

正确写法：
Thread t1 = new Thread(() -> {
    System.out.println("线程执行中：" + Thread.currentThread().getName());
});
Thread t2 = new Thread(() -> {
    System.out.println("线程执行中：" + Thread.currentThread().getName());
});
t1.start(); // 开启第1个新线程
t2.start(); // 开启第2个新线程`}
    />

    <CodeBlock
      qa
      title="练习 2：Callable 编程题"
      code={`// 请使用 Callable + FutureTask 实现以下功能：
// 创建一个线程，计算 1 到 n（n 由外部传入）的阶乘（n!）
// 主线程获取结果并打印：n! = xxx
// 要求：n 使用 long 类型（防止溢出），n 的值取 10

// 提示：10! = 3628800`}
      answerCode={`import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;
import java.util.concurrent.ExecutionException;

public class FactorialDemo {

    // Callable 实现类
    static class FactorialCallable implements Callable<Long> {
        private final int n;

        public FactorialCallable(int n) {
            this.n = n;
        }

        @Override
        public Long call() {
            long result = 1L;
            for (int i = 1; i <= n; i++) {
                result *= i;
            }
            return result;
        }
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        int n = 10;
        FutureTask<Long> futureTask = new FutureTask<>(new FactorialCallable(n));
        new Thread(futureTask, "计算线程").start();

        long result = futureTask.get(); // 阻塞等待结果
        System.out.println(n + "! = " + result); // 输出：10! = 3628800
    }
}`}
    />

    <CodeBlock
      qa
      title="练习 3：综合编程题"
      code={`// 模拟一个简单的"多窗口售票"场景（只关注结构，暂不考虑线程安全）：
// 共 50 张票，3 个窗口（线程）同时卖票
// 要求：
//   1. 使用实现 Runnable 接口的方式（3 个线程共享同一个 Runnable 实例）
//   2. 每售出一张打印：窗口X 售出第 N 张票
//   3. 票卖完后各窗口停止

// 思考：如果改用"继承 Thread"方式，三个线程能共享同一份票数吗？`}
      answerCode={`public class TicketDemo {
    public static void main(String[] args) {
        // Runnable 实现（匿名内部类形式，也可用 Lambda）
        Runnable ticketSeller = new Runnable() {
            private int tickets = 50; // 共享的票数

            @Override
            public void run() {
                while (true) {
                    if (tickets <= 0) break;
                    System.out.println(Thread.currentThread().getName()
                        + " 售出第 " + tickets + " 张票");
                    tickets--;
                }
            }
        };

        // 三个线程共享同一个 ticketSeller 对象 → 共享同一份 tickets
        new Thread(ticketSeller, "窗口1").start();
        new Thread(ticketSeller, "窗口2").start();
        new Thread(ticketSeller, "窗口3").start();
    }
}

// 思考答案：
// 如果继承 Thread，每个 Thread 子类对象是独立的，
// tickets 字段属于各自对象，无法直接共享（除非用 static 修饰 tickets）。
// 而 Runnable 方式可以把多个 Thread 都绑定到同一个 Runnable 实例，
// 自然共享该实例的成员变量，更符合"任务"和"执行者"分离的设计思想。

// 注意：这个版本存在线程安全问题（可能出现负票或重复售票），
// 解决方案见下一节"线程安全与synchronized"。`}
    />
  </article>
);

export default index;
