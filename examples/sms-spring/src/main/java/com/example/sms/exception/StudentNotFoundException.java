package com.example.sms.exception;

/**
 * 按 id 查找学生但不存在时抛出。
 *
 * <p>继承自 {@link RuntimeException}（非受检异常）：这类「调用方传了不存在的 id」属于业务错误，
 * 不强制 try-catch，统一交给 Web 层的 {@code GlobalExceptionHandler} 转成 404 响应。
 */
public class StudentNotFoundException extends RuntimeException {

    public StudentNotFoundException(Long id) {
        super("学生不存在，id=" + id);
    }
}
