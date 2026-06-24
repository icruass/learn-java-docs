package com.example.sms.web;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 统一的错误响应体。所有异常最终都被 {@link GlobalExceptionHandler} 转成这个结构返回，
 * 前端拿到的报错格式始终一致。
 *
 * <p>{@code @JsonInclude(NON_NULL)}：值为 null 的字段不出现在 JSON 里
 * （比如非校验类错误就不会带 {@code fieldErrors}）。
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    private final LocalDateTime timestamp;
    private final int status;             // HTTP 状态码，如 404
    private final String error;           // 状态码短语，如 "Not Found"
    private final String message;         // 给人看的错误说明
    private final String path;            // 出错的请求路径
    private final Map<String, String> fieldErrors; // 字段级校验错误（仅 400 校验失败时有）

    public ApiError(LocalDateTime timestamp, int status, String error,
                    String message, String path, Map<String, String> fieldErrors) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.fieldErrors = fieldErrors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}
