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
    <Title>适配器模式（Adapter）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        出国旅行时，你的充电器插头插不进当地的插座，于是带上了一个
        <Text bold>转接头</Text>；笔记本只有 USB-C 口，要接老式 HDMI 显示器，又得用一个
        <Text bold>Type-C 转 HDMI 转接头</Text>。转接头本身不发电、不传图像，它只做一件事：
        <Text accent bold>把一种接口转换成另一种接口</Text>，让两个原本插不到一起的设备协作起来。
        软件里的适配器模式做的正是同一件事。
      </Paragraph>
    </Callout>

    <Subtitle>一、痛点：接口不兼容，又改不了源码</Subtitle>
    <Paragraph>
      假设客户端代码统一面向一个「目标接口」<InlineCode>Target</InlineCode>编程，它期望对象提供
      <InlineCode>output5V()</InlineCode>方法（输出 5V 直流电给手机充电）：
    </Paragraph>
    <CodeBlock
      title="客户端期望的目标接口"
      code={`// 客户端只认这个接口
interface Voltage5V {
    int output5V();
}

class Phone {
    public void charge(Voltage5V power) {
        int v = power.output5V();
        System.out.println("手机以 " + v + "V 充电");
    }
}`}
    />
    <Paragraph>
      可现实里我们手上只有一个家用交流电源类<InlineCode>Voltage220V</InlineCode>——它可能来自第三方库，
      源码不能改，方法名、返回值也对不上：
    </Paragraph>
    <CodeBlock
      title="已有的、不兼容的类（被适配者）"
      code={`// 第三方/遗留类，接口与 Phone 期望的完全不同
class Voltage220V {
    public int output220V() {
        return 220;
    }
}`}
    />
    <Paragraph>
      <InlineCode>Phone.charge()</InlineCode>需要的是<InlineCode>Voltage5V</InlineCode>，而我们只有
      <InlineCode>Voltage220V</InlineCode>，两者无法直接对接。直接把 220V 接进去会「烧手机」（编译都过不了）。
      此时既不能改客户端、又不能改第三方类，就需要一个「中间人」把 220V 降压并转换成客户端认识的 5V 接口。
    </Paragraph>

    <Divider />

    <Subtitle>二、定义与角色</Subtitle>
    <Paragraph>
      <Text accent bold>适配器模式（Adapter Pattern）</Text>：将一个类的接口转换成客户端所期望的另一个接口，
      使原本因接口不兼容而无法一起工作的类能够协同工作。它属于<Text bold>结构型模式</Text>。
    </Paragraph>
    <Table
      head={['角色', '说明']}
      rows={[
        ['Target（目标接口）', '客户端真正期望调用的接口，本例为 Voltage5V'],
        ['Adaptee（被适配者）', '已存在、接口不兼容但功能需要被复用的类，本例为 Voltage220V'],
        ['Adapter（适配器）', '核心角色，实现 Target 并在内部调用 Adaptee，完成接口转换'],
        ['Client（客户端）', '面向 Target 编程，只与目标接口打交道，本例为 Phone'],
      ]}
    />

    <Divider />

    <Subtitle>三、两种实现方式</Subtitle>

    <Heading3>1. 类适配器：通过继承</Heading3>
    <Paragraph>
      让适配器<Text bold>继承 Adaptee</Text>、同时<Text bold>实现 Target</Text>，在目标方法里调用从父类继承来的方法：
    </Paragraph>
    <CodeBlock
      title="类适配器"
      code={`// 继承被适配者，实现目标接口
class VoltageAdapterByExtends extends Voltage220V implements Voltage5V {
    @Override
    public int output5V() {
        int src = output220V();   // 调用父类（Adaptee）的方法
        int dst = src / 44;       // 220V 降压为 5V
        return dst;
    }
}

public class Demo1 {
    public static void main(String[] args) {
        Phone phone = new Phone();
        phone.charge(new VoltageAdapterByExtends()); // 手机以 5V 充电
    }
}`}
    />
    <Callout type="warning" title="类适配器的局限">
      <Paragraph>
        Java 单继承：适配器一旦<InlineCode>extends Voltage220V</InlineCode>，就无法再继承别的类；
        而且它把 Adaptee 的所有 public 方法都暴露了出来，耦合更紧。因此类适配器使用受限。
      </Paragraph>
    </Callout>

    <Heading3>2. 对象适配器：通过组合（推荐）</Heading3>
    <Paragraph>
      让适配器<Text bold>持有一个 Adaptee 的引用</Text>（组合），而不是继承它。这遵循
      <Text accent bold>「组合优于继承」</Text>原则，也是实际开发中最常用的写法：
    </Paragraph>
    <CodeBlock
      title="对象适配器"
      code={`// 内部持有被适配者实例，实现目标接口
class VoltageAdapterByCompose implements Voltage5V {
    private final Voltage220V adaptee; // 组合，而非继承

    public VoltageAdapterByCompose(Voltage220V adaptee) {
        this.adaptee = adaptee;
    }

    @Override
    public int output5V() {
        int src = adaptee.output220V(); // 委托给被适配者
        return src / 44;
    }
}

public class Demo2 {
    public static void main(String[] args) {
        Voltage220V home = new Voltage220V();
        Phone phone = new Phone();
        // 把不兼容的 220V 包装成客户端认识的 5V
        phone.charge(new VoltageAdapterByCompose(home)); // 手机以 5V 充电
    }
}`}
    />
    <Paragraph>
      对象适配器把「被适配的对象」从外部传入，因此可以适配 Adaptee 及其任意子类，灵活性更高；
      同时它不暴露 Adaptee 的内部方法，封装性更好。
    </Paragraph>

    <Divider />

    <Subtitle>四、JDK 与框架中的适配器</Subtitle>
    <Paragraph>
      适配器在标准库和主流框架里随处可见，最典型的是 <Text bold>IO 流</Text>中字节流到字符流的转换：
    </Paragraph>
    <CodeBlock
      title="InputStreamReader：把字节流适配成字符流"
      code={`// InputStream（字节流，Adaptee）-> Reader（字符流，Target）
InputStream byteIn = System.in;            // 被适配者：字节流
Reader reader = new InputStreamReader(byteIn, "UTF-8"); // 适配器
BufferedReader br = new BufferedReader(reader);
String line = br.readLine();               // 客户端按字符读取`}
    />
    <UnorderedList>
      <ListItem>
        <InlineCode>InputStreamReader</InlineCode> / <InlineCode>OutputStreamWriter</InlineCode>：
        把面向字节的<InlineCode>InputStream/OutputStream</InlineCode>适配成面向字符的
        <InlineCode>Reader/Writer</InlineCode>，是对象适配器的经典实现。
      </ListItem>
      <ListItem>
        <InlineCode>Arrays.asList(T...)</InlineCode>：把数组「适配」成
        <InlineCode>List</InlineCode>接口，让数组也能以集合的方式被遍历访问。
      </ListItem>
      <ListItem>
        整个<InlineCode>java.io</InlineCode>体系大量使用装饰器与适配器协作来桥接字节/字符、缓冲、转换。
      </ListItem>
      <ListItem>
        Spring MVC 的<InlineCode>HandlerAdapter</InlineCode>：把形态各异的 Handler
        （注解控制器、实现接口的控制器等）统一适配成<InlineCode>DispatcherServlet</InlineCode>
        能调用的<InlineCode>handle(...)</InlineCode>形式，从而支持多种处理器并存。
      </ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>五、两种适配器对比</Subtitle>
    <Table
      head={['对比项', '类适配器（继承）', '对象适配器（组合）']}
      rows={[
        ['实现方式', 'extends Adaptee + implements Target', '持有 Adaptee 引用 + implements Target'],
        ['能否适配子类', '只能适配指定的 Adaptee 类', '可适配 Adaptee 及其所有子类'],
        ['耦合度', '较高，暴露父类方法', '较低，仅委托所需方法'],
        ['是否占用继承名额', '是（Java 单继承受限）', '否'],
        ['推荐程度', '受限场景', '更常用、更推荐'],
      ]}
    />

    <Divider />

    <Subtitle>六、优缺点与适用场景</Subtitle>
    <Paragraph>
      <Text bold>优点</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>复用已有/第三方类的功能，无需修改其源码（符合开闭原则）。</ListItem>
      <ListItem>将「接口转换」逻辑集中到适配器，客户端与被适配者解耦。</ListItem>
      <ListItem>对象适配器灵活，一个适配器可服务于多个被适配子类。</ListItem>
    </UnorderedList>
    <Paragraph>
      <Text bold>缺点</Text>：
    </Paragraph>
    <UnorderedList>
      <ListItem>过度使用会让系统中充斥「转换层」，调用链变长、可读性下降。</ListItem>
      <ListItem>类适配器受单继承限制，且暴露过多父类方法。</ListItem>
    </UnorderedList>
    <Callout type="tip" title="什么时候用适配器">
      <Paragraph>
        当你想使用一个已有类，但它的接口与你的需求<Text bold>不匹配</Text>，且这个类的
        <Text bold>功能本身是可复用的</Text>（不是要新增功能，而是要「转接口」）——这正是适配器的主场。
        常见于整合遗留代码、对接第三方 SDK、统一多个来源的不一致接口。
      </Paragraph>
    </Callout>

    <Divider />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>
          适配器模式的本质是<Text accent bold>接口转换</Text>：像转接头一样，把 Adaptee 的接口转成
          Client 期望的 Target 接口。
        </ListItem>
        <ListItem>
          四个角色：<Text bold>Target</Text>（目标接口）、<Text bold>Adaptee</Text>（被适配者）、
          <Text bold>Adapter</Text>（适配器）、<Text bold>Client</Text>（客户端）。
        </ListItem>
        <ListItem>
          两种实现：类适配器用<Text bold>继承</Text>、对象适配器用<Text bold>组合</Text>；
          优先选择对象适配器（组合优于继承）。
        </ListItem>
        <ListItem>
          JDK 中的<InlineCode>InputStreamReader</InlineCode>、<InlineCode>Arrays.asList</InlineCode>
          与 Spring MVC 的<InlineCode>HandlerAdapter</InlineCode>都是典型实例。
        </ListItem>
        <ListItem>
          适用于「接口不兼容但功能可复用」的场景，让旧代码与新系统优雅协作。
        </ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
