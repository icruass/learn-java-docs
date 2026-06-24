package com.example.sms.exception;

/**
 * 注册时发现同名学生已存在时抛出，由 Web 层统一转成 409 Conflict。
 */
public class DuplicateStudentException extends RuntimeException {

    public DuplicateStudentException(String name) {
        super("学生已存在，姓名=" + name);
    }
}
