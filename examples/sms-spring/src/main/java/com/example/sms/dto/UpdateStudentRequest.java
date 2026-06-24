package com.example.sms.dto;

import com.example.sms.domain.EnrollmentStatus;
import com.example.sms.domain.Gender;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * 「编辑学生」请求体，支持部分更新（partial update）。
 *
 * <p>约定：字段为 {@code null} 表示「本次不修改该项」，只有显式赋值的字段才会被更新。
 * 因此这里不能用 {@code @NotNull}——那会要求每个字段都必传。年龄给了范围校验，
 * 但 {@code @Min/@Max} 对 {@code null} 不生效（视为通过），正好满足「可选但若填则需合法」。
 */
public class UpdateStudentRequest {

    private String name;

    private Gender gender;

    @Min(value = 1, message = "年龄必须在 1~150 之间")
    @Max(value = 150, message = "年龄必须在 1~150 之间")
    private Integer age;

    private Long classroomId;

    private Long headTeacherId;

    private EnrollmentStatus status;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Long getClassroomId() {
        return classroomId;
    }

    public void setClassroomId(Long classroomId) {
        this.classroomId = classroomId;
    }

    public Long getHeadTeacherId() {
        return headTeacherId;
    }

    public void setHeadTeacherId(Long headTeacherId) {
        this.headTeacherId = headTeacherId;
    }

    public EnrollmentStatus getStatus() {
        return status;
    }

    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }
}
