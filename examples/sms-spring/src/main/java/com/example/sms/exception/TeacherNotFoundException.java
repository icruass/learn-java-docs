package com.example.sms.exception;

/**
 * 分配班主任时指定的老师不存在，由 Web 层统一转成 404。
 */
public class TeacherNotFoundException extends RuntimeException {

    public TeacherNotFoundException(Long id) {
        super("老师不存在，id=" + id);
    }
}
