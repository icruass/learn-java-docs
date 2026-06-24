package com.example.sms.web;

import com.example.sms.domain.Classroom;
import com.example.sms.repository.ClassroomRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 教室的只读接口——主要用于在编班前查出可用的教室 id。
 *
 * <p>教室是「参考数据」（结构扁平、无敏感字段、无懒加载关联），这里为简洁直接返回实体；
 * 在更严格的系统里同样会包一层响应 DTO。本示例聚焦学生接口，故教室/老师只给只读查询。
 */
@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    private final ClassroomRepository classroomRepository;

    public ClassroomController(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    @GetMapping
    public List<Classroom> list() {
        return classroomRepository.findAll();
    }
}
