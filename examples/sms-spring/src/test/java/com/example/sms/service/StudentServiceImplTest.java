package com.example.sms.service;

import com.example.sms.domain.EnrollmentStatus;
import com.example.sms.domain.Gender;
import com.example.sms.domain.Student;
import com.example.sms.dto.RegisterStudentRequest;
import com.example.sms.dto.UpdateStudentRequest;
import com.example.sms.exception.DuplicateStudentException;
import com.example.sms.exception.StudentNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * 服务层单元/集成测试，跑在 H2 上。{@code @Transactional} 让每个测试方法结束后自动回滚，
 * 互不干扰。种子教室（id=1「三年二班」）由 data.sql 在上下文启动时灌入。
 */
@SpringBootTest
@Transactional
class StudentServiceImplTest {

    @Autowired
    private StudentService studentService;

    private RegisterStudentRequest registerRequest(String name) {
        RegisterStudentRequest req = new RegisterStudentRequest();
        req.setName(name);
        req.setGender(Gender.MALE);
        req.setAge(10);
        return req;
    }

    @Test
    void register_generatesStudentNo_andDefaultsToRegistered() {
        Student student = studentService.register(registerRequest("张三"));

        assertNotNull(student.getId(), "落库后应分配主键 id");
        assertNotNull(student.getStudentNo(), "应生成学号");
        assertTrue(student.getStudentNo().startsWith("STU"), "学号应以 STU 开头");
        assertEquals(EnrollmentStatus.REGISTERED, student.getStatus());
    }

    @Test
    void register_withClassroomId_assignsClassroom() {
        RegisterStudentRequest req = registerRequest("李四");
        req.setClassroomId(1L); // 来自种子数据

        Student student = studentService.register(req);

        assertNotNull(student.getClassroom());
        assertEquals("三年二班", student.getClassroom().getName());
    }

    @Test
    void register_duplicateName_throws() {
        studentService.register(registerRequest("重名同学"));
        assertThrows(DuplicateStudentException.class,
                () -> studentService.register(registerRequest("重名同学")));
    }

    @Test
    void updateStudent_partiallyUpdatesOnlyGivenFields() {
        Student created = studentService.register(registerRequest("王五"));

        UpdateStudentRequest update = new UpdateStudentRequest();
        update.setAge(12);
        update.setStatus(EnrollmentStatus.ACTIVE);

        Student updated = studentService.updateStudent(created.getId(), update);

        assertEquals(12, updated.getAge());
        assertEquals(EnrollmentStatus.ACTIVE, updated.getStatus());
        assertEquals("王五", updated.getName(), "未提供的字段应保持不变");
    }

    @Test
    void withdrawStudent_setsStatusToWithdrawn() {
        Student created = studentService.register(registerRequest("赵六"));

        Student withdrawn = studentService.withdrawStudent(created.getId());

        assertEquals(EnrollmentStatus.WITHDRAWN, withdrawn.getStatus());
    }

    @Test
    void getStudent_notFound_throws() {
        assertThrows(StudentNotFoundException.class, () -> studentService.getStudent(999999L));
    }
}
