package com.example.sms.web;

import com.example.sms.domain.Teacher;
import com.example.sms.repository.TeacherRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 老师的只读接口——主要用于在分配班主任前查出可用的老师 id。
 *
 * <p>同 {@link ClassroomController}：作为参考数据这里直接返回实体，聚焦演示学生接口。
 */
@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherRepository teacherRepository;

    public TeacherController(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    @GetMapping
    public List<Teacher> list() {
        return teacherRepository.findAll();
    }
}
