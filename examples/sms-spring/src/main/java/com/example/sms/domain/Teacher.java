package com.example.sms.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 老师。继承自 {@link Person}，额外拥有工号与任教科目。
 *
 * <p>子类构造方法第一行用 {@code super(...)} 把公共属性交给父类初始化——
 * 这是「继承」中子类复用父类构造逻辑的标准写法。
 */
@Entity
@Table(name = "teacher")
public class Teacher extends Person {

    @Column(name = "teacher_no", nullable = false, unique = true, length = 30)
    private String teacherNo; // 工号，业务唯一编号

    @Column(nullable = false, length = 30)
    private String subject;   // 任教科目，如「数学」

    protected Teacher() {
        super();
    }

    public Teacher(String name, Gender gender, int age, String subject) {
        super(name, gender, age);
        setSubject(subject);
    }

    @Override
    public PersonType type() {
        return PersonType.TEACHER;
    }

    public String getTeacherNo() {
        return teacherNo;
    }

    /** 工号由服务层统一生成后回填，仅允许设置一次。 */
    public void setTeacherNo(String teacherNo) {
        if (this.teacherNo != null) {
            throw new IllegalStateException("工号已存在，不可重复分配");
        }
        this.teacherNo = teacherNo;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        if (subject == null || subject.trim().isEmpty()) {
            throw new IllegalArgumentException("任教科目不能为空");
        }
        this.subject = subject.trim();
    }
}
