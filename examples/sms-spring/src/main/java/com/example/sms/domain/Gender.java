package com.example.sms.domain;

/**
 * 性别。
 *
 * <p>用枚举而非 String/int：取值范围被编译器锁死，不会出现脏数据；
 * 存库时配合 {@code @Enumerated(EnumType.STRING)} 以「MALE/FEMALE」入库，可读且稳定。
 */
public enum Gender {

    MALE("男"),
    FEMALE("女");

    private final String displayName;

    Gender(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
