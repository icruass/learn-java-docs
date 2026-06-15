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
    <Title>三层架构与 Service 层</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        企业项目不是把所有代码堆在 Controller 里，而是按<Text bold>三层架构</Text>分工：
        Controller 只管「接收和响应」，Service 专注「业务逻辑」，Mapper 只管「数据库操作」。
        这一节讲清楚<Text bold>为什么要三层、每层该做什么、代码如何组织</Text>——这是写出可维护代码的基础。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、三层架构是什么</Subtitle>
    <Table
      head={['层', '包名', '职责', '注解']}
      rows={[
        ['表现层（Controller）', 'controller', '接收 HTTP 请求、参数校验、调用 Service、包装响应', '@RestController'],
        ['业务逻辑层（Service）', 'service', '编排业务流程、事务控制、调用 Mapper', '@Service'],
        ['数据访问层（Mapper/DAO）', 'mapper', '与数据库交互，执行 SQL', '@Mapper（MyBatis）'],
      ]}
    />
    <Paragraph>调用关系是单向的：</Paragraph>
    <CodeBlock
      language="text"
      code={`HTTP 请求 → Controller → Service → Mapper → 数据库
HTTP 响应 ← Controller ← Service ← Mapper ←`}
    />
    <Callout type="warning">
      <Text bold>Controller 不能直接调 Mapper</Text>（跳过 Service），
      因为业务逻辑（如一个操作涉及多张表的更新）应当集中在 Service 层，而不是散落在 Controller 里。
    </Callout>

    <Divider />

    <Subtitle>二、Service 层的标准写法（接口 + 实现）</Subtitle>
    <Paragraph>
      Service 层通常按「接口 + 实现类」模式写，便于后续替换实现（如切换不同数据源策略）或 Mock 测试：
    </Paragraph>
    <CodeBlock
      title="service/UserService.java（接口）"
      code={`package com.example.demo.service;

import com.example.demo.entity.User;
import java.util.List;

public interface UserService {
    List<User> listAll();
    User getById(Long id);
    User create(User user);
    User update(User user);
    void deleteById(Long id);
}`}
    />
    <CodeBlock
      title="service/impl/UserServiceImpl.java（实现类）"
      code={`package com.example.demo.service.impl;

import com.example.demo.common.BusinessException;
import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor   // Lombok：自动为 final 字段生成构造器（= 构造器注入）
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;   // 通过构造器注入 Mapper

    @Override
    public List<User> listAll() {
        return userMapper.selectAll();
    }

    @Override
    public User getById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw BusinessException.notFound("用户不存在：id=" + id);
        }
        return user;
    }

    @Override
    public User create(User user) {
        // 业务校验：用户名不能重复
        if (userMapper.selectByUsername(user.getUsername()) != null) {
            throw BusinessException.badRequest("用户名已存在：" + user.getUsername());
        }
        userMapper.insert(user);
        log.info("用户创建成功：id={}, username={}", user.getId(), user.getUsername());
        return user;
    }

    @Override
    public User update(User user) {
        getById(user.getId());   // 复用：不存在会抛异常
        userMapper.updateById(user);
        return userMapper.selectById(user.getId());
    }

    @Override
    public void deleteById(Long id) {
        getById(id);   // 不存在会抛 404
        userMapper.deleteById(id);
        log.info("用户删除：id={}", id);
    }
}`}
    />

    <Divider />

    <Subtitle>三、Entity vs DTO：该传哪个</Subtitle>
    <Table
      head={['类型', '说明', '用在哪']}
      rows={[
        ['Entity（实体类）', '与数据库表一一对应的 POJO，字段 = 列名（驼峰）', 'Service ↔ Mapper 层传输'],
        ['DTO（数据传输对象）', '接口的出入参结构，按业务需要裁剪字段', 'Controller 入参 / 出参'],
      ]}
    />
    <Paragraph>
      <Text bold>为什么不直接把 Entity 当 Controller 入参？</Text>
    </Paragraph>
    <UnorderedList>
      <ListItem>Entity 有 <InlineCode>createTime</InlineCode>、<InlineCode>updateTime</InlineCode> 等字段，不应该让客户端传；</ListItem>
      <ListItem>密码等敏感字段不应该出现在响应 JSON 里；</ListItem>
      <ListItem>分组校验（新增/更新用不同规则）靠 DTO 隔离更干净。</ListItem>
    </UnorderedList>
    <CodeBlock
      title="典型的三类 DTO"
      code={`// 新增入参
public class CreateUserDTO { ... }

// 更新入参
public class UpdateUserDTO { ... }

// 查询出参（只返回前端需要的字段，隐藏敏感字段）
public class UserVO {
    private Long id;
    private String username;
    private String email;
    // 没有 password、createTime 等敏感/无用字段
}`}
    />

    <Divider />

    <Subtitle>四、Controller 完整串联示例</Subtitle>
    <CodeBlock
      title="UserController.java（完整版）"
      code={`@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public Result<List<User>> list() {
        return Result.success(userService.listAll());
    }

    @GetMapping("/{id}")
    public Result<User> getById(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @PostMapping
    public Result<User> create(@Valid @RequestBody CreateUserDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        // ... 字段复制（或用 BeanUtils.copyProperties / MapStruct）
        return Result.success(userService.create(user));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return Result.success();
    }
}`}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>三层架构：<Text bold>Controller（接收）→ Service（业务）→ Mapper（数据库）</Text>，单向调用，不跨层。</ListItem>
        <ListItem>Service 层用「接口 + 实现类」，用 <InlineCode>@RequiredArgsConstructor + final</InlineCode> 简化构造器注入。</ListItem>
        <ListItem>业务错误在 Service 层 throw <InlineCode>BusinessException</InlineCode>，由全局异常处理器捕获。</ListItem>
        <ListItem>Controller 用 DTO 做入参，隔离 Entity；响应敏感字段用专门的 VO 过滤。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
