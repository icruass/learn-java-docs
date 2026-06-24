package com.example.sms.repository;

import com.example.sms.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 学生仓储。
 *
 * <p>只需继承 {@link JpaRepository}，Spring Data JPA 就会在运行时自动生成实现类并注入容器——
 * save / findById / findAll / deleteById / count 等通用方法全部免费获得，无需自己写实现。
 *
 * <p>{@code existsByName} 是「派生查询」：方法名即查询语义，Spring 解析方法名自动生成
 * {@code select count(*) > 0 from student where name = ?}，连 SQL 都不用写。
 */
public interface StudentRepository extends JpaRepository<Student, Long> {

    /** 按姓名判重。 */
    boolean existsByName(String name);
}
