package com.example.sms.domain;

/**
 * 人员类型。用枚举表达「学生 / 老师」，由各自的领域对象通过 {@code type()} 返回（多态）。
 */
public enum PersonType {

    STUDENT("学生"),
    TEACHER("老师");

    private final String displayName;

    PersonType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
