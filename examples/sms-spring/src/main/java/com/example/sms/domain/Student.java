package com.example.sms.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * 学生。继承自 {@link Person}，是本系统的核心领域对象（对应数据库 student 表）。
 *
 * <p>除了注册时的基本信息（姓名/性别/年龄，来自父类），学生还持有：
 * <ul>
 *   <li>{@code studentNo}：学号，注册时由服务层生成的业务唯一编号；</li>
 *   <li>{@code classroom}：所在教室，用 {@code @ManyToOne} 关联（可为空表示尚未编班）；</li>
 *   <li>{@code headTeacher}：班主任，同样 {@code @ManyToOne}（可为空）；</li>
 *   <li>{@code status}：学籍状态。</li>
 * </ul>
 *
 * <p>{@code @ManyToOne} 默认 {@code EAGER} 抓取：查出学生时会一并查出其教室/班主任，
 * 因此在事务结束后（如 Web 层组装响应时）访问它们不会触发 LazyInitializationException。
 */
@Entity
@Table(name = "student")
public class Student extends Person {

    @Column(name = "student_no", nullable = false, unique = true, length = 30)
    private String studentNo;

    @ManyToOne
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;

    @ManyToOne
    @JoinColumn(name = "head_teacher_id")
    private Teacher headTeacher;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnrollmentStatus status;

    protected Student() {
        super();
    }

    public Student(String name, Gender gender, int age) {
        super(name, gender, age);
        this.status = EnrollmentStatus.REGISTERED; // 新生默认「已注册」
    }

    @Override
    public PersonType type() {
        return PersonType.STUDENT;
    }

    public String getStudentNo() {
        return studentNo;
    }

    /** 学号由服务层生成后回填，仅允许设置一次。 */
    public void setStudentNo(String studentNo) {
        if (this.studentNo != null) {
            throw new IllegalStateException("学号已存在，不可重复分配");
        }
        this.studentNo = studentNo;
    }

    public Classroom getClassroom() {
        return classroom;
    }

    /** 编班 / 转班。允许传入 null 表示移出当前教室。 */
    public void assignClassroom(Classroom classroom) {
        this.classroom = classroom;
    }

    public Teacher getHeadTeacher() {
        return headTeacher;
    }

    /** 分配 / 更换班主任。允许传入 null 表示取消分配。 */
    public void assignHeadTeacher(Teacher headTeacher) {
        this.headTeacher = headTeacher;
    }

    public EnrollmentStatus getStatus() {
        return status;
    }

    public void changeStatus(EnrollmentStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("学籍状态不能为空");
        }
        this.status = status;
    }
}
