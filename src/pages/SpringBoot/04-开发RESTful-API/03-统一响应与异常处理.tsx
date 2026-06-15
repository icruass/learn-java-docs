import React from 'react';
import {
  Title,
  Subtitle,
  Paragraph,
  Text,
  InlineCode,
  CodeBlock,
  Callout,
  UnorderedList,
  ListItem,
  Divider,
} from '@/components/doc';

const index: React.FC = () => (
  <article>
    <Title>统一响应与全局异常处理</Title>

    <Callout type="note" title="本节导读">
      <Paragraph>
        企业级 API 有两个铁律：① 所有接口返回<Text bold>格式统一的 JSON</Text>（便于前端解析）；
        ② 任何异常都要被<Text bold>统一拦截并返回规范错误信息</Text>（不能把 Spring 的默认错误页面暴露给前端）。
        这一节把这两个「基础设施」搭起来，写一次、全项目复用。
      </Paragraph>
    </Callout>

    <Divider />

    <Subtitle>一、统一响应体 Result</Subtitle>
    <Paragraph>
      企业里约定：所有接口返回同一种结构的 JSON，通常包含<Text bold>状态码、消息、数据</Text>三个字段：
    </Paragraph>
    <CodeBlock
      language="json"
      title="成功响应示例"
      code={`{
  "code": 200,
  "message": "success",
  "data": { "id": 1, "username": "张三" }
}`}
    />
    <CodeBlock
      language="json"
      title="失败响应示例"
      code={`{
  "code": 404,
  "message": "用户不存在",
  "data": null
}`}
    />
    <Paragraph>用一个泛型类封装：</Paragraph>
    <CodeBlock
      title="common/Result.java"
      code={`package com.example.demo.common;

public class Result<T> {

    private int code;
    private String message;
    private T data;

    // 私有构造，只通过静态工厂方法创建
    private Result(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /** 成功，带数据 */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }

    /** 成功，无数据 */
    public static <T> Result<T> success() {
        return new Result<>(200, "success", null);
    }

    /** 失败 */
    public static <T> Result<T> error(int code, String message) {
        return new Result<>(code, message, null);
    }

    // getter / setter（或用 @Data）
    public int getCode() { return code; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}`}
    />
    <Paragraph>Controller 里统一返回 <InlineCode>Result</InlineCode>：</Paragraph>
    <CodeBlock
      title="UserController.java（使用 Result 包装）"
      code={`@GetMapping("/{id}")
public Result<User> getById(@PathVariable Long id) {
    User user = userService.getById(id);
    return Result.success(user);
}

@PostMapping
public Result<User> create(@RequestBody User user) {
    User created = userService.create(user);
    return Result.success(created);
}`}
    />

    <Divider />

    <Subtitle>二、业务异常类</Subtitle>
    <Paragraph>
      先定义一个业务异常类，用于在 Service 层抛出「可预期」的业务错误（如「用户不存在」）：
    </Paragraph>
    <CodeBlock
      title="common/BusinessException.java"
      code={`package com.example.demo.common;

public class BusinessException extends RuntimeException {

    private final int code;

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    // 快捷构造：常见错误码
    public static BusinessException notFound(String message) {
        return new BusinessException(404, message);
    }

    public static BusinessException badRequest(String message) {
        return new BusinessException(400, message);
    }

    public int getCode() { return code; }
}`}
    />
    <CodeBlock
      title="Service 里抛出业务异常"
      code={`public User getById(Long id) {
    User user = userMapper.selectById(id);
    if (user == null) {
        throw BusinessException.notFound("用户不存在：id=" + id);
    }
    return user;
}`}
    />

    <Divider />

    <Subtitle>三、全局异常处理器 @RestControllerAdvice</Subtitle>
    <Paragraph>
      在 Controller 层捕获所有异常，统一转化为 <InlineCode>Result</InlineCode> 格式返回，
      让前端永远拿到「格式一致的 JSON」，而不是 Spring 的白板错误页面：
    </Paragraph>
    <CodeBlock
      title="common/GlobalExceptionHandler.java"
      code={`package com.example.demo.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice   // = @ControllerAdvice + @ResponseBody，拦截所有 Controller 的异常
public class GlobalExceptionHandler {

    /** 处理业务异常（我们自定义的） */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusiness(BusinessException e) {
        log.warn("业务异常：{}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }

    /** 处理参数校验失败（下节讲 @Valid 时会触发） */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .findFirst()
                .orElse("参数不合法");
        log.warn("参数校验失败：{}", message);
        return Result.error(400, message);
    }

    /** 兜底：处理所有未预期的异常（系统异常） */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleAll(Exception e) {
        log.error("系统异常", e);    // 系统异常才打 error 级别，含堆栈
        return Result.error(500, "服务器内部错误，请稍后重试");
    }
}`}
    />

    <Callout type="tip">
      <Text bold>异常处理顺序</Text>：Spring 会优先匹配最精确的 <InlineCode>@ExceptionHandler</InlineCode>。
      所以 <InlineCode>BusinessException</InlineCode> 处理器比 <InlineCode>Exception</InlineCode> 兜底处理器优先级高，
      不用担心被兜底的覆盖掉。
    </Callout>

    <Divider />

    <Subtitle>四、整体流程</Subtitle>
    <CodeBlock
      language="text"
      code={`HTTP 请求
  ↓
Controller 接收请求
  ↓ 调用
Service 执行业务逻辑
  ├─ 正常：return 数据 → Controller 包成 Result.success(data)
  └─ 异常：throw BusinessException →
              ↓
        GlobalExceptionHandler 捕获
              ↓
        返回 Result.error(code, message)
  ↓
JSON 响应返回前端（格式始终统一）`}
    />

    <Callout type="success" title="本节小结">
      <UnorderedList>
        <ListItem>定义泛型 <InlineCode>Result{'<T>'}</InlineCode> 统一接口响应格式（code / message / data）。</ListItem>
        <ListItem>定义 <InlineCode>BusinessException</InlineCode> 承载业务错误，Service 层抛出，不需要每个 Controller 单独 try-catch。</ListItem>
        <ListItem><InlineCode>@RestControllerAdvice + @ExceptionHandler</InlineCode> 全局捕获异常，转换为统一 Result 返回。</ListItem>
        <ListItem>异常分层处理：业务异常打 warn、系统异常打 error（含堆栈）。</ListItem>
      </UnorderedList>
    </Callout>
  </article>
);

export default index;
