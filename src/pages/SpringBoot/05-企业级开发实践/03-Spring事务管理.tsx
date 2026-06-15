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
    <Title>Spring 事务管理</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        转账场景：从 A 扣了钱，还没给 B 加，服务器宕机——钱丢了。
        <Text bold>事务</Text>保证「一组数据库操作要么全成功，要么全回滚」。
        Spring Boot 的 <InlineCode>@Transactional</InlineCode> 让你<Text bold>一个注解搞定事务</Text>，
        但错误用法比不用还危险——本节讲清楚正确用法和常见陷阱。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、@Transactional：最简用法</Subtitle>
    <Paragraph>
      把 <InlineCode>@Transactional</InlineCode> 加到 Service 方法上，
      方法正常返回时<Text bold>自动提交</Text>，抛出<Text bold>非受检异常（RuntimeException 及其子类）</Text>时<Text bold>自动回滚</Text>：
    </Paragraph>
    <CodeBlock
      title="转账示例"
      code={`import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountMapper accountMapper;

    @Transactional   // 开启事务
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        // 扣减转出方余额
        int updated = accountMapper.deduct(fromId, amount);
        if (updated == 0) {
            throw new BusinessException(400, "余额不足或账户不存在");
        }

        // 模拟异常：这里抛出 → 上面的 deduct 也会回滚
        // if (true) throw new RuntimeException("模拟故障");

        // 增加转入方余额
        accountMapper.increase(toId, amount);

        // 方法正常结束 → 两步操作一起提交
    }
}`}
    />
    <Callout type="warning" title="只回滚 RuntimeException（默认）">
      <InlineCode>@Transactional</InlineCode> 默认只对 <InlineCode>RuntimeException</InlineCode>（非受检异常）回滚，
      受检异常（<InlineCode>Exception</InlineCode> 及其子类，如 <InlineCode>IOException</InlineCode>）<Text bold>不会回滚</Text>。
      若需要对受检异常也回滚，用：
      <CodeBlock code={`@Transactional(rollbackFor = Exception.class)  // 对所有异常都回滚（推荐）`} />
      企业项目建议统一用 <InlineCode>rollbackFor = Exception.class</InlineCode>，以防漏掉受检异常。
    </Callout>

    <Divider />

    <Subtitle>二、@Transactional 加在哪里</Subtitle>
    <Table
      head={['位置', '说明']}
      rows={[
        ['Service 方法上（推荐）', '精确控制哪个方法开启事务，粒度最细'],
        ['Service 类上', '类里所有 public 方法都开启事务，粒度粗，查询方法也会开事务（有开销）'],
        ['Controller 上', '错误！事务应在 Service 层，Controller 层不应感知数据库操作'],
      ]}
    />

    <Divider />

    <Subtitle>三、事务传播行为（Propagation）</Subtitle>
    <Paragraph>
      当一个已开启事务的方法 A 调用另一个标注了 <InlineCode>@Transactional</InlineCode> 的方法 B 时，B 该怎么处理？
      这由<Text bold>传播行为</Text>决定：
    </Paragraph>
    <Table
      head={['传播行为', '说明', '常用场景']}
      rows={[
        ['REQUIRED（默认）', '有事务就加入，没有就新开', '绝大多数场景'],
        ['REQUIRES_NEW', '总是新开一个事务，挂起外层事务', '需要独立提交的子操作（如记录操作日志）'],
        ['NESTED', '在外层事务内开一个嵌套事务（保存点）', '部分回滚场景'],
        ['NOT_SUPPORTED', '不在事务中执行，挂起外层事务', '耗时的查询，避免占用事务资源'],
      ]}
    />
    <CodeBlock
      title="REQUIRES_NEW 典型用法：记录操作日志不受主事务影响"
      code={`@Service
public class LogService {

    private final LogMapper logMapper;

    // 即使调用方事务回滚，日志仍然会记录下来（因为是独立事务）
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveLog(String action) {
        logMapper.insert(new OperationLog(action));
    }
}`}
    />

    <Divider />

    <Subtitle>四、三个经典坑</Subtitle>

    <Paragraph>
      <Text bold>坑 1：自调用（同类方法调用）事务失效</Text>
    </Paragraph>
    <CodeBlock
      title="事务失效的反面教材"
      code={`@Service
public class OrderService {

    // ❌ 这里调用同类的 createOrder，事务不生效！
    // 因为 this.createOrder() 不经过 Spring 代理，@Transactional 的 AOP 切不到
    public void batchCreate(List<Order> orders) {
        orders.forEach(o -> this.createOrder(o));
    }

    @Transactional
    public void createOrder(Order order) {
        // ...
    }
}`}
    />
    <Callout type="danger">
      Spring 事务靠 AOP 代理实现。<Text bold>同一个类内部方法调用（<InlineCode>this.xxx()</InlineCode>）</Text>
      不走代理，<InlineCode>@Transactional</InlineCode> 不生效。
      解法：把被调用的方法抽到另一个 Service，让 Spring 代理注入后调用。
    </Callout>

    <Paragraph>
      <Text bold>坑 2：事务方法不能是 private</Text>
    </Paragraph>
    <CodeBlock
      code={`// ❌ private 方法上的 @Transactional 无效
@Transactional
private void doSomething() { ... }

// ✅ 必须是 public
@Transactional
public void doSomething() { ... }`}
    />

    <Paragraph>
      <Text bold>坑 3：异常被吞导致不回滚</Text>
    </Paragraph>
    <CodeBlock
      code={`@Transactional
public void createUser(User user) {
    try {
        userMapper.insert(user);
        // 某处抛出 RuntimeException
    } catch (Exception e) {
        log.error("出错了", e);
        // ❌ 异常被吞了！Spring 感知不到异常，不会回滚
    }
}

// ✅ 捕获后需要手动标记回滚，或重新抛出
catch (Exception e) {
    log.error("出错了", e);
    TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); // 手动标记回滚
    // 或者: throw new RuntimeException(e); // 重新抛出
}`}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>加 <InlineCode>@Transactional(rollbackFor = Exception.class)</InlineCode> 到 Service 方法，开启事务并对所有异常回滚。</ListItem>
        <ListItem>传播行为默认 <InlineCode>REQUIRED</InlineCode>（加入已有事务）；日志等独立操作用 <InlineCode>REQUIRES_NEW</InlineCode>。</ListItem>
        <ListItem>三大坑：<Text bold>同类方法自调用失效、private 方法失效、异常被吞不回滚</Text>。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
