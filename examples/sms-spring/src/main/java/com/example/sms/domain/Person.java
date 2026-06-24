package com.example.sms.domain;

import javax.persistence.Column;
import javax.persistence.Enumerated;
import javax.persistence.EnumType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.util.Objects;

/**
 * 「人」——学生和老师的公共抽象父类。
 *
 * <p>
 * 这是「继承」在 JPA 里的典型落地：用 {@code @MappedSuperclass} 把 id、姓名、性别、
 * 年龄这些公共列「下沉」到父类。它本身不对应任何表，子类（{@link Student}/{@link Teacher}）
 * 各自建表（student / teacher），并把这些列复制进自己的表里。
 *
 * <p>
 * 设计要点：
 * <ul>
 * <li>字段 {@code private}，对外只通过带校验的方法读写——领域对象拒绝脏数据进入；</li>
 * <li>JPA 要求实体有一个无参构造方法（这里设为 {@code protected}），仅供框架反射使用；</li>
 * <li>setter 不声明为 {@code final}：Hibernate 要对实体做字节码增强/生成代理子类，
 * {@code final} 方法会冲突（启动报 "Setter methods of lazy classes cannot be final"）。
 * 这是纯 Java 版 sms（setter 设 final）与 JPA 版的一个差异点；</li>
 * <li>{@code id} 由数据库自增分配（{@code GenerationType.IDENTITY}），业务代码不应篡改。</li>
 * </ul>
 */
@MappedSuperclass
public abstract class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    @Column(nullable = false)
    private int age;

    /** 仅供 JPA 反射实例化使用，业务代码请用带参构造方法。 */
    protected Person() {
    }

    protected Person(String name, Gender gender, int age) {
        setName(name);
        setGender(gender);
        setAge(age);
    }

    /** 该角色的人员类型，由子类给出（多态）。 */
    public abstract PersonType type();

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("姓名不能为空");
        }
        this.name = name.trim();
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = Objects.requireNonNull(gender, "性别不能为空");
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age <= 0 || age > 150) {
            throw new IllegalArgumentException("年龄必须在 1~150 之间，当前为：" + age);
        }
        this.age = age;
    }

    /** 实体相等性以 id 为准（同一身份的对象即相等）。 */
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Person other = (Person) o;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(getClass(), id);
    }
}
