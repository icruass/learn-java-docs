package com.example.sms.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Objects;

/**
 * 教室 / 班级。一个独立的实体（有自己的表），会被很多学生通过 {@code @ManyToOne} 引用。
 *
 * <p>
 * 为什么不在学生里直接放一个 {@code String className} 字段？因为班级有独立生命周期
 * （容量、年级会变、会改名）。让学生持有教室「引用」，班级改名后所有学生自动看到新名字，
 * 用字符串副本则会数据不一致。这就是领域建模里「实体 vs 值」的取舍。
 */
@Entity
@Table(name = "classroom")
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name; // 如「三年二班」

    @Column(nullable = false, length = 20)
    private String grade; // 如「三年级」

    @Column(nullable = false)
    private int capacity; // 额定容量

    protected Classroom() {
    }

    public Classroom(String name, String grade, int capacity) {
        setName(name);
        setGrade(grade);
        setCapacity(capacity);
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("教室名称不能为空");
        }
        this.name = name.trim();
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        if (grade == null || grade.trim().isEmpty()) {
            throw new IllegalArgumentException("年级不能为空");
        }
        this.grade = grade.trim();
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("教室容量必须为正数，当前为：" + capacity);
        }
        this.capacity = capacity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Classroom other = (Classroom) o;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return name + "（" + grade + "，容量 " + capacity + "）";
    }
}
