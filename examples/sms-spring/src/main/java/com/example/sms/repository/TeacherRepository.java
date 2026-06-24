package com.example.sms.repository;

import com.example.sms.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 老师仓储。继承 {@link JpaRepository} 即获得全部通用增删改查能力。
 */
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
