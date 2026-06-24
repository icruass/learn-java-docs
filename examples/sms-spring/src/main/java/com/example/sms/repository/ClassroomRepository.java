package com.example.sms.repository;

import com.example.sms.domain.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 教室仓储。继承 {@link JpaRepository} 即获得全部通用增删改查能力。
 */
public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
}
