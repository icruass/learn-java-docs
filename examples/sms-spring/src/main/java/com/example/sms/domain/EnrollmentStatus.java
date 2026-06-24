package com.example.sms.domain;

/**
 * 学籍状态。
 *
 * <p>真实系统里「删除学生」往往不是物理删除，而是把状态流转到 {@link #WITHDRAWN}（退学）
 * 等终态——历史数据要留痕。本示例同时提供物理删除和状态流转两种能力，方便对比。
 */
public enum EnrollmentStatus {

    /** 已注册，尚未编班/正式上课。 */
    REGISTERED("已注册"),
    /** 在读。 */
    ACTIVE("在读"),
    /** 休学。 */
    SUSPENDED("休学"),
    /** 毕业（终态）。 */
    GRADUATED("毕业"),
    /** 退学（终态）。 */
    WITHDRAWN("退学");

    private final String displayName;

    EnrollmentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /** 是否为终态：终态学生不允许再被编辑核心信息。 */
    public boolean isTerminal() {
        return this == GRADUATED || this == WITHDRAWN;
    }
}
