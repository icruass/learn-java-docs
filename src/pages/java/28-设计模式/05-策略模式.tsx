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
    <Title>策略模式（Strategy）</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        同一件事往往有<Text bold>多种做法</Text>：支付可以用微信、支付宝、银行卡；折扣可以按会员等级、按节日、按满减规则。
        如果用一堆 <InlineCode>if-else</InlineCode>/<InlineCode>switch</InlineCode> 把这些算法堆在一个方法里，
        每加一种就要改源码。策略模式把每个算法封装成独立的类，让它们<Text bold>可以自由替换</Text>，
        从而消除分支、符合「开闭原则」。
      </Paragraph>
    </Callout>

    <Subtitle>一、痛点：if-else 堆出来的「巨型方法」</Subtitle>
    <Paragraph>
      假设我们要根据支付方式计算实际扣款（不同渠道有不同手续费/优惠规则）。最直觉的写法就是一连串条件判断：
    </Paragraph>
    <CodeBlock
      title="反面教材：所有算法挤在一个方法里"
      code={`public class PayService {
    // type: "WECHAT" / "ALIPAY" / "BANK"
    public double pay(String type, double amount) {
        if ("WECHAT".equals(type)) {
            // 微信：满 100 减 5
            return amount > 100 ? amount - 5 : amount;
        } else if ("ALIPAY".equals(type)) {
            // 支付宝：统一 9.5 折
            return amount * 0.95;
        } else if ("BANK".equals(type)) {
            // 银行卡：收 1% 手续费
            return amount * 1.01;
        } else {
            throw new IllegalArgumentException("不支持的支付方式: " + type);
        }
    }
}`}
    />
    <Paragraph>这种写法的问题：</Paragraph>
    <UnorderedList>
      <ListItem><Text bold>方法越来越大：</Text>每种支付方式的逻辑全塞在一个方法里，难读难维护。</ListItem>
      <ListItem><Text bold>违反开闭原则：</Text>每新增一种支付方式，都要<Text accent bold>修改</Text>这个方法的源码，容易碰坏已有分支。</ListItem>
      <ListItem><Text bold>难以复用与测试：</Text>某个算法想单独拿去别处用、或单独写单元测试，都很别扭。</ListItem>
    </UnorderedList>

    <Divider />

    <Subtitle>二、定义与角色</Subtitle>
    <Paragraph>
      <Text accent bold>策略模式</Text>：定义一系列算法，把<Text bold>每个算法封装成独立的策略类</Text>，
      让它们可以相互替换；算法的变化独立于使用它的客户端。换句话说——
      把「会变的算法」从「调用算法的代码」里抽出去。
    </Paragraph>
    <Table
      head={['角色', '说明', '本例对应']}
      rows={[
        ['Strategy（策略接口）', '定义所有算法的统一行为', 'PayStrategy'],
        ['ConcreteStrategy（具体策略）', '实现接口，封装某一种具体算法', 'WechatPay / AliPay / BankPay'],
        ['Context（上下文）', '持有一个策略引用，对外提供调用入口，可运行时切换策略', 'PayContext'],
      ]}
    />

    <Divider />

    <Subtitle>三、完整代码实现</Subtitle>
    <Heading3>1. 策略接口</Heading3>
    <CodeBlock
      title="PayStrategy.java"
      code={`public interface PayStrategy {
    /** 根据原始金额计算实际扣款金额 */
    double calc(double amount);
}`}
    />

    <Heading3>2. 多个具体策略</Heading3>
    <CodeBlock
      title="三种支付策略"
      code={`public class WechatPay implements PayStrategy {
    @Override
    public double calc(double amount) {
        return amount > 100 ? amount - 5 : amount; // 满 100 减 5
    }
}

public class AliPay implements PayStrategy {
    @Override
    public double calc(double amount) {
        return amount * 0.95; // 统一 9.5 折
    }
}

public class BankPay implements PayStrategy {
    @Override
    public double calc(double amount) {
        return amount * 1.01; // 收 1% 手续费
    }
}`}
    />

    <Heading3>3. Context 持有并调用策略</Heading3>
    <CodeBlock
      title="PayContext.java"
      code={`public class PayContext {
    private PayStrategy strategy;

    public PayContext(PayStrategy strategy) {
        this.strategy = strategy;
    }

    /** 运行时切换策略 */
    public void setStrategy(PayStrategy strategy) {
        this.strategy = strategy;
    }

    public double pay(double amount) {
        // 上下文不关心是哪种算法，只负责委托
        return strategy.calc(amount);
    }
}`}
    />

    <Heading3>4. 客户端使用</Heading3>
    <CodeBlock
      title="测试"
      code={`public class Demo {
    public static void main(String[] args) {
        PayContext ctx = new PayContext(new WechatPay());
        System.out.println(ctx.pay(120)); // 115.0

        // 运行时换一种策略，无需改 PayContext
        ctx.setStrategy(new AliPay());
        System.out.println(ctx.pay(120)); // 114.0

        ctx.setStrategy(new BankPay());
        System.out.println(ctx.pay(120)); // 121.2
    }
}`}
    />
    <Callout type="tip" title="新增支付方式时">
      只需新建一个 <InlineCode>implements PayStrategy</InlineCode> 的类，
      <Text bold>完全不用改动 PayContext 和已有策略</Text>——这就是「对扩展开放、对修改关闭」。
    </Callout>

    <Divider />

    <Subtitle>四、与 Lambda 结合</Subtitle>
    <Paragraph>
      注意到 <InlineCode>PayStrategy</InlineCode> 只有<Text bold>一个抽象方法</Text>，它天然就是一个
      <Text accent bold>函数式接口</Text>。从 Java 8 起，可以直接用 <InlineCode>Lambda</InlineCode> 传入策略，
      省去一堆只有一行逻辑的实现类：
    </Paragraph>
    <CodeBlock
      title="Lambda 版：无需为每种算法写一个类"
      code={`// 接口加上 @FunctionalInterface 更清晰（可选）
@FunctionalInterface
public interface PayStrategy {
    double calc(double amount);
}

public class Demo {
    public static void main(String[] args) {
        PayContext ctx = new PayContext(amount -> amount > 100 ? amount - 5 : amount);
        System.out.println(ctx.pay(120)); // 115.0 —— 微信规则

        ctx.setStrategy(amount -> amount * 0.95);
        System.out.println(ctx.pay(120)); // 114.0 —— 支付宝规则

        ctx.setStrategy(amount -> amount * 1.01);
        System.out.println(ctx.pay(120)); // 121.2 —— 银行卡规则
    }
}`}
    />
    <Callout type="note" title="什么时候用 Lambda，什么时候用类">
      算法逻辑简单、临时使用 → <Text bold>Lambda</Text> 最省事；
      算法逻辑复杂、需要起名字便于复用/测试/被 Spring 管理 → 还是用<Text bold>独立策略类</Text>更合适。
    </Callout>

    <Divider />

    <Subtitle>五、JDK 与框架中的策略模式</Subtitle>
    <UnorderedList>
      <ListItem>
        <Text bold>Comparator —— 最典型的排序策略：</Text>
        给 <InlineCode>Collections.sort</InlineCode> / <InlineCode>list.sort</InlineCode>
        传入不同的 <InlineCode>Comparator</InlineCode>，就是在切换「比较算法」这个策略。
      </ListItem>
      <ListItem>
        <Text bold>Runnable：</Text><InlineCode>Thread</InlineCode> 是 Context，
        <InlineCode>Runnable</InlineCode> 是要执行的策略，线程不关心你具体跑什么任务。
      </ListItem>
      <ListItem>
        <Text bold>Spring：</Text>把同一接口的多个实现都交给容器，按类型/名字注入，再按业务条件选用某个策略。
      </ListItem>
    </UnorderedList>
    <CodeBlock
      title="Comparator 就是排序策略"
      code={`List<String> list = new ArrayList<>(List.of("banana", "fig", "apple"));

// 策略一：按字典序
list.sort(Comparator.naturalOrder());

// 策略二：按长度（同一份数据，换个策略结果不同）
list.sort(Comparator.comparingInt(String::length));

// 策略三：按长度降序
list.sort(Comparator.comparingInt(String::length).reversed());`}
    />
    <CodeBlock
      title="Spring 中按类型收集所有策略"
      code={`@Service
public class PayService {
    // Spring 自动把所有 PayStrategy 实现注入这个 Map，key 为 bean 名称
    private final Map<String, PayStrategy> strategyMap;

    public PayService(Map<String, PayStrategy> strategyMap) {
        this.strategyMap = strategyMap;
    }

    public double pay(String type, double amount) {
        PayStrategy strategy = strategyMap.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("不支持的支付方式: " + type);
        }
        return strategy.calc(amount); // 再也没有 if-else 链
    }
}`}
    />

    <Divider />

    <Subtitle>六、优缺点与适用场景</Subtitle>
    <Table
      head={['优点', '缺点']}
      rows={[
        ['消除多重条件分支（if-else / switch）', '策略类数量会增多'],
        ['新增算法不改旧代码，符合开闭原则', '客户端需了解有哪些策略、各自适用场景'],
        ['每个算法独立、易复用、易单元测试', '简单逻辑用策略类可能「过度设计」'],
      ]}
    />
    <Heading3>适用场景</Heading3>
    <UnorderedList>
      <ListItem>同一行为有<Text bold>多种实现/算法</Text>，需要在运行时选择或切换。</ListItem>
      <ListItem>代码里出现大量<Text bold>因「类型」而异的 if-else / switch</Text>。</ListItem>
      <ListItem>典型例子：支付方式、折扣/运费计算、排序规则、文件压缩算法、日志输出格式等。</ListItem>
    </UnorderedList>

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem><Text bold>核心：</Text>把「会变的算法」封装成可互换的策略类，让算法独立于使用它的客户端。</ListItem>
        <ListItem><Text bold>三角色：</Text>Strategy（接口）、ConcreteStrategy（具体算法）、Context（持有并委托调用）。</ListItem>
        <ListItem><Text bold>好处：</Text>消除条件分支、符合开闭原则，新增算法不改旧代码。</ListItem>
        <ListItem><Text bold>进阶：</Text>函数式接口 + Lambda 可省去大量实现类；<InlineCode>Comparator</InlineCode>、<InlineCode>Runnable</InlineCode>、Spring 多实现注入都是它的现实身影。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
