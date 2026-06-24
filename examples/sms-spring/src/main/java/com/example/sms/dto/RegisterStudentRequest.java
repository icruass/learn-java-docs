package com.example.sms.dto;

import com.example.sms.domain.Gender;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 「注册学生」请求体（输入 DTO）。
 *
 * <p>用注解声明入参规则，配合 Controller 上的 {@code @Valid} 自动校验：不合法的请求
 * 会在进入业务逻辑前就被拦下，由 {@code GlobalExceptionHandler} 统一返回 400。
 *
 * <p>之所以单独建 DTO 而不直接收 {@link com.example.sms.domain.Student} 实体：把「外部输入」
 * 与「领域对象」隔离，避免外部请求直接构造出非法实体，也方便日后字段演进。
 */
public class RegisterStudentRequest {

    @NotBlank(message = "姓名不能为空")
    private String name;

    @NotNull(message = "性别不能为空")
    private Gender gender;

    @NotNull(message = "年龄不能为空")
    @Min(value = 1, message = "年龄必须在 1~150 之间")
    @Max(value = 150, message = "年龄必须在 1~150 之间")
    private Integer age;

    /** 可选：注册时直接编班；为 null 表示暂不编班。 */
    private Long classroomId;

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
}
