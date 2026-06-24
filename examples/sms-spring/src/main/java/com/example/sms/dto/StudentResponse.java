package com.example.sms.dto;

import com.example.sms.domain.Student;

/**
 * 「学生」响应体（输出 DTO）。
 *
 * <p>为什么不直接把 {@link Student} 实体序列化返回？
 * <ul>
 *   <li>避免把数据库结构、JPA 代理、内部关联一股脑暴露给前端；</li>
 *   <li>可以裁剪/加工字段（如把教室对象压平成 classroomName，给枚举附带中文名）；</li>
 *   <li>接口契约与持久化模型解耦，改表不一定要改接口。</li>
 * </ul>
 * 用静态工厂 {@link #from(Student)} 完成「实体 → DTO」的映射。
 */
public class StudentResponse {

    private Long id;
    private String studentNo;
    private String name;
    private String gender;        // 中文展示名，如「男」
    private int age;
    private Long classroomId;
    private String classroomName; // 教室名（压平自关联对象），未编班为 null
    private Long headTeacherId;
    private String headTeacherName;
    private String status;        // 中文展示名，如「在读」
    private String statusCode;    // 枚举名，如「ACTIVE」，便于前端按值判断

    public static StudentResponse from(Student student) {
        StudentResponse r = new StudentResponse();
        r.id = student.getId();
        r.studentNo = student.getStudentNo();
        r.name = student.getName();
        r.gender = student.getGender().getDisplayName();
        r.age = student.getAge();
        if (student.getClassroom() != null) {
            r.classroomId = student.getClassroom().getId();
            r.classroomName = student.getClassroom().getName();
        }
        if (student.getHeadTeacher() != null) {
            r.headTeacherId = student.getHeadTeacher().getId();
            r.headTeacherName = student.getHeadTeacher().getName();
        }
        r.status = student.getStatus().getDisplayName();
        r.statusCode = student.getStatus().name();
        return r;
    }

    public Long getId() {
        return id;
    }

    public String getStudentNo() {
        return studentNo;
    }

    public String getName() {
        return name;
    }

    public String getGender() {
        return gender;
    }

    public int getAge() {
        return age;
    }

    public Long getClassroomId() {
        return classroomId;
    }

    public String getClassroomName() {
        return classroomName;
    }

    public Long getHeadTeacherId() {
        return headTeacherId;
    }

    public String getHeadTeacherName() {
        return headTeacherName;
    }

    public String getStatus() {
        return status;
    }

    public String getStatusCode() {
        return statusCode;
    }
}
