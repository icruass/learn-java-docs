package com.example.sms.web;

import com.example.sms.exception.ClassroomNotFoundException;
import com.example.sms.exception.DuplicateStudentException;
import com.example.sms.exception.StudentNotFoundException;
import com.example.sms.exception.TeacherNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 全局异常处理器。
 *
 * <p>{@code @RestControllerAdvice} 让本类拦截所有 Controller 抛出的异常，统一翻译成
 * 「合适的 HTTP 状态码 + 一致的 {@link ApiError} JSON」。好处：业务代码只管抛语义化异常，
 * 不必在每个接口里写 try-catch；前端拿到的错误格式永远一致。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 三类「找不到资源」统一 404。 */
    @ExceptionHandler({
            StudentNotFoundException.class,
            ClassroomNotFoundException.class,
            TeacherNotFoundException.class
    })
    public ResponseEntity<ApiError> handleNotFound(RuntimeException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), req, null);
    }

    /** 同名学生重复注册 -> 409 Conflict。 */
    @ExceptionHandler(DuplicateStudentException.class)
    public ResponseEntity<ApiError> handleDuplicate(DuplicateStudentException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), req, null);
    }

    /** 状态机/业务约束冲突（如编辑终态学生） -> 409 Conflict。 */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiError> handleIllegalState(IllegalStateException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), req, null);
    }

    /** 领域对象校验失败（如姓名为空、年龄越界） -> 400 Bad Request。 */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req, null);
    }

    /** {@code @Valid} 入参校验失败 -> 400，并附上每个字段的具体错误。 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(fe -> fieldErrors.putIfAbsent(fe.getField(), fe.getDefaultMessage()));
        return build(HttpStatus.BAD_REQUEST, "请求参数校验失败", req, fieldErrors);
    }

    /** 请求体无法解析（JSON 格式错、枚举值非法等） -> 400。 */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleNotReadable(HttpMessageNotReadableException ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, "请求体格式不正确或字段取值非法", req, null);
    }

    /**
     * 用错了 HTTP 方法（如对只支持 POST/GET 的路径发 PUT） -> 405 Method Not Allowed。
     *
     * <p>这类异常是 Spring MVC 框架抛的，且都是 {@code Exception} 的子类——若不显式处理，
     * 会被下面的兜底 {@code Exception} 处理器误判成 500。所以必须在兜底之前单独接住，
     * 还原成语义正确的 4xx。
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex,
                                                             HttpServletRequest req) {
        return build(HttpStatus.METHOD_NOT_ALLOWED, ex.getMessage(), req, null);
    }

    /** 请求的 Content-Type 不支持（如忘了带 application/json） -> 415 Unsupported Media Type。 */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiError> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex,
                                                                HttpServletRequest req) {
        return build(HttpStatus.UNSUPPORTED_MEDIA_TYPE, ex.getMessage(), req, null);
    }

    /** 兜底：未预料到的异常 -> 500，避免把堆栈细节直接暴露给调用方。 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "服务器内部错误", req, null);
    }

    private ResponseEntity<ApiError> build(HttpStatus status, String message,
                                           HttpServletRequest req, Map<String, String> fieldErrors) {
        ApiError body = new ApiError(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                req.getRequestURI(),
                fieldErrors);
        return ResponseEntity.status(status).body(body);
    }
}
