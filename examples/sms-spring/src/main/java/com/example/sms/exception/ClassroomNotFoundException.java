package com.example.sms.exception;

/**
 * 编班时指定的教室不存在，由 Web 层统一转成 404。
 */
public class ClassroomNotFoundException extends RuntimeException {

    public ClassroomNotFoundException(Long id) {
        super("教室不存在，id=" + id);
    }
}
