import React from 'react';
import {
  Title, Subtitle, Heading3, Paragraph, Text, InlineCode, CodeBlock, Callout, Table, UnorderedList, ListItem, Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>建造者模式（Builder）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        当一个类有<Text bold>很多属性</Text>（几个必填、一大堆可选）时，构造对象就成了麻烦事：
        要么写一堆参数爆炸的「重叠构造器」，要么用 setter 导致对象可变且可能构造不完整。
        <Text accent bold>建造者模式</Text>用一个链式 Builder 把对象的「构建过程」和「最终表示」分开，
        既保证可读性，又能产出<Text bold>不可变</Text>的目标对象。
      </Paragraph>
    </Callout>

    <Subtitle>一、痛点：属性多的类，怎么构造都难受</Subtitle>

    <Heading3>方案 A：重叠构造器（telescoping constructor）</Heading3>
    <Paragraph>
      传统做法是为「必填 + 不同可选组合」各写一个构造器，层层叠加。属性一多，参数就开始爆炸：
    </Paragraph>
    <CodeBlock
      title="重叠构造器：参数爆炸、可读性差"
      code={`public class Computer {
    private final String cpu;     // 必填
    private final String ram;     // 必填
    private final String disk;    // 可选
    private final String gpu;     // 可选
    private final boolean bluetooth; // 可选

    public Computer(String cpu, String ram) {
        this(cpu, ram, "256G SSD");
    }
    public Computer(String cpu, String ram, String disk) {
        this(cpu, ram, disk, "集成显卡");
    }
    public Computer(String cpu, String ram, String disk, String gpu) {
        this(cpu, ram, disk, gpu, false);
    }
    public Computer(String cpu, String ram, String disk, String gpu, boolean bluetooth) {
        this.cpu = cpu; this.ram = ram; this.disk = disk;
        this.gpu = gpu; this.bluetooth = bluetooth;
    }
}

// 调用方：这一长串 true/null 到底是什么？根本看不懂
Computer c = new Computer("i9", "32G", "1T SSD", "RTX4090", true);`}
    />
    <Paragraph>
      问题很明显：参数顺序容易记错（两个 <InlineCode>String</InlineCode> 写反编译器都不报错）；
      想跳过中间某个可选参数还得传 <InlineCode>null</InlineCode>；构造器数量随可选参数指数级膨胀。
    </Paragraph>

    <Heading3>方案 B：无参构造 + setter</Heading3>
    <CodeBlock
      title="JavaBean 写法：对象可变、可能构造不完整"
      code={`Computer c = new Computer();
c.setCpu("i9");
c.setRam("32G");
// 忘了校验：disk、gpu 都没设，对象处于「半成品」状态
// 而且 setter 让对象始终可变，无法做成不可变（线程不安全）`}
    />
    <Callout type="warning" title="setter 方式的两个硬伤">
      <UnorderedList>
        <ListItem><Text bold>构造不完整</Text>：对象在多次 setter 调用之间处于不一致状态，无法在「一处」做完整性校验。</ListItem>
        <ListItem><Text bold>无法不可变</Text>：暴露了 setter，字段就不能是 <InlineCode>final</InlineCode>，丧失不可变对象的线程安全优势。</ListItem>
      </UnorderedList>
    </Callout>

    <Divider />

    <Subtitle>二、定义与角色</Subtitle>
    <Paragraph>
      <Text accent bold>建造者模式（Builder Pattern）</Text>：将一个复杂对象的<Text bold>构建</Text>与它的<Text bold>表示</Text>分离，
      通过一个 Builder 逐步、链式地设置各个属性，最后调用 <InlineCode>build()</InlineCode> 一次性得到（通常不可变的）目标对象。
    </Paragraph>
    <Table
      head={['角色', '说明']}
      rows={[
        ['Product（产品）', '最终要构建的复杂对象，构造器私有，字段通常为 final'],
        ['Builder（建造者）', '提供链式 setter，持有构建过程中的中间状态'],
        ['链式调用', '每个 setter 返回 this，可连续点用，可读性强'],
        ['build()', '收尾方法：做完整性校验并 new 出 Product 实例'],
      ]}
    />

    <Divider />

    <Subtitle>三、经典实现：静态内部类 Builder</Subtitle>
    <Paragraph>
      最常用的写法是把 Builder 写成目标类的<Text bold>静态内部类</Text>：目标类构造器私有（只接收 Builder），
      每个 setter 返回 <InlineCode>this</InlineCode> 以支持链式调用，<InlineCode>build()</InlineCode> 返回外部类实例。
    </Paragraph>
    <CodeBlock
      title="Computer.java：必填字段放 Builder 构造器，可选字段链式设置"
      code={`public class Computer {
    // 全部 final —— 构建完成后不可变，天然线程安全
    private final String cpu;       // 必填
    private final String ram;       // 必填
    private final String disk;      // 可选
    private final String gpu;       // 可选
    private final boolean bluetooth;// 可选

    // 私有构造器：只能通过 Builder 创建
    private Computer(Builder builder) {
        this.cpu = builder.cpu;
        this.ram = builder.ram;
        this.disk = builder.disk;
        this.gpu = builder.gpu;
        this.bluetooth = builder.bluetooth;
    }

    public String getCpu()      { return cpu; }
    public String getRam()      { return ram; }
    public String getDisk()     { return disk; }
    public String getGpu()      { return gpu; }
    public boolean hasBluetooth() { return bluetooth; }

    @Override
    public String toString() {
        return "Computer{cpu=" + cpu + ", ram=" + ram + ", disk=" + disk
                + ", gpu=" + gpu + ", bluetooth=" + bluetooth + "}";
    }

    // ===== 静态内部类 Builder =====
    public static class Builder {
        // 必填字段由 Builder 构造器强制传入
        private final String cpu;
        private final String ram;
        // 可选字段给默认值
        private String disk = "256G SSD";
        private String gpu  = "集成显卡";
        private boolean bluetooth = false;

        public Builder(String cpu, String ram) {
            this.cpu = cpu;
            this.ram = ram;
        }

        public Builder disk(String disk)        { this.disk = disk; return this; }
        public Builder gpu(String gpu)          { this.gpu = gpu; return this; }
        public Builder bluetooth(boolean on)    { this.bluetooth = on; return this; }

        public Computer build() {
            // 在这里集中做完整性 / 合法性校验
            if (cpu == null || ram == null) {
                throw new IllegalStateException("cpu 和 ram 为必填项");
            }
            return new Computer(this);
        }
    }
}`}
    />
    <CodeBlock
      title="调用方：链式、自解释、想设哪个设哪个"
      code={`Computer c = new Computer.Builder("i9", "32G") // 必填
        .disk("1T SSD")     // 可选
        .gpu("RTX4090")     // 可选
        .bluetooth(true)    // 可选
        .build();

System.out.println(c);
// Computer{cpu=i9, ram=32G, disk=1T SSD, gpu=RTX4090, bluetooth=true}

// 只填必填项也行，可选项走默认值
Computer mini = new Computer.Builder("i5", "16G").build();`}
    />
    <Callout type="tip" title="为什么必填字段放进 Builder 的构造器？">
      <Paragraph>
        把必填字段做成 Builder 构造器的参数，可以在<Text bold>编译期</Text>就强制调用方提供它们；
        可选字段则用链式方法逐个设置。这样既杜绝了「忘填必填项」，又保留了可选项的灵活性。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>四、JDK 与主流框架中的应用</Subtitle>
    <Table
      head={['出处', '说明']}
      rows={[
        ['StringBuilder / StringBuffer', '最常见的建造者：append() 返回 this 链式拼接，最后 toString() 得到结果'],
        ['Stream.builder()', 'Stream.<T>builder().add(a).add(b).build() 构建流'],
        ['Calendar.Builder', 'new Calendar.Builder().setDate(2026,5,17).build() 构建 Calendar'],
        ['Lombok @Builder', '在类上加注解，编译期自动生成 Builder，省去手写样板代码'],
        ['OkHttp Request.Builder', 'new Request.Builder().url(...).header(...).get().build() 构建 HTTP 请求'],
      ]}
    />
    <CodeBlock
      title="StringBuilder：你天天在用的建造者"
      code={`String sql = new StringBuilder()
        .append("SELECT * FROM user")
        .append(" WHERE age > 18")
        .append(" ORDER BY id")
        .toString();`}
    />
    <CodeBlock
      title="Lombok @Builder：注解一行，自动生成 Builder"
      code={`@Builder
public class Person {
    private String name;
    private int age;
    private String email;
}

// 使用（Builder 由 Lombok 自动生成）
Person p = Person.builder()
        .name("张三")
        .age(20)
        .email("zs@x.com")
        .build();`}
    />

    <Divider />

    <Subtitle>五、优缺点与适用场景</Subtitle>
    <Table
      head={['优点', '缺点']}
      rows={[
        ['可读性强：链式调用、参数自解释', '需要额外编写 Builder 代码（可用 Lombok 缓解）'],
        ['可产出不可变对象，线程安全', '类结构更复杂，简单对象用它属于过度设计'],
        ['可选参数随意组合，避免构造器爆炸', '每次构建都多创建一个 Builder 中间对象'],
        ['build() 中可集中做完整性校验', ''],
      ]}
    />
    <Paragraph>
      <Text bold>适用场景</Text>：当一个类参数较多（一般 4 个以上）、可选参数多、需要不可变对象，
      或希望构造过程更可读、能在创建时统一校验时，就该考虑建造者模式。
      反之，属性很少（两三个）的简单类，直接用构造器即可，无需引入 Builder。
    </Paragraph>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>痛点：重叠构造器<Text bold>参数爆炸</Text>、setter 让对象<Text bold>可变且可能不完整</Text>。</ListItem>
        <ListItem>定义：分离对象的「构建」与「表示」，链式设置属性后 <InlineCode>build()</InlineCode> 产出目标对象。</ListItem>
        <ListItem>实现：目标类构造器私有 + <Text bold>静态内部类 Builder</Text>，setter 返回 <InlineCode>this</InlineCode>，必填字段放 Builder 构造器。</ListItem>
        <ListItem>实例：<InlineCode>StringBuilder</InlineCode>、<InlineCode>Stream.builder()</InlineCode>、<InlineCode>Calendar.Builder</InlineCode>、Lombok <InlineCode>@Builder</InlineCode>、OkHttp <InlineCode>Request.Builder</InlineCode>。</ListItem>
        <ListItem>适用：参数多 / 可选多 / 要不可变；代价是多写一份 Builder 样板代码。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
