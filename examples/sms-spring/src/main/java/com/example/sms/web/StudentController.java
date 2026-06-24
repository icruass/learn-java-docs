package com.example.sms.web;

import com.example.sms.domain.Student;
import com.example.sms.dto.RegisterStudentRequest;
import com.example.sms.dto.StudentResponse;
import com.example.sms.dto.UpdateStudentRequest;
import com.example.sms.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 学生相关的 REST 接口。
 *
 * <p>{@code @RestController} = {@code @Controller} + {@code @ResponseBody}：方法返回值
 * 自动序列化为 JSON。{@code @RequestMapping("/api/students")} 给本类所有接口加统一前缀。
 *
 * <p>分层职责：Controller 只负责「收请求 / 校验入参 / 调用 service / 把实体映射成响应 DTO /
 * 给出合适的 HTTP 状态码」，不写业务逻辑。
 *
 * <p>接口一览：
 * <pre>
 *   POST   /api/students            注册学生         -> 201
 *   GET    /api/students            学生列表         -> 200
 *   GET    /api/students/{id}       学生详情         -> 200 / 404
 *   PATCH  /api/students/{id}       编辑学生(部分更新) -> 200 / 404 / 409
 *   DELETE /api/students/{id}       物理删除         -> 204 / 404
 *   POST   /api/students/{id}/withdraw  退学(软删除)  -> 200 / 404
 * </pre>
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /** 注册学生。成功返回 201 Created，并在 Location 头给出新资源地址。 */
    @PostMapping
    public ResponseEntity<StudentResponse> register(@Valid @RequestBody RegisterStudentRequest request) {
        Student student = studentService.register(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(student.getId())
                .toUri();
        return ResponseEntity.created(location).body(StudentResponse.from(student));
    }

    /** 查询全部学生。 */
    @GetMapping
    public List<StudentResponse> list() {
        return studentService.listStudents().stream()
                .map(StudentResponse::from)
                .collect(Collectors.toList());
    }

    /** 按 id 查询学生详情。 */
    @GetMapping("/{id}")
    public StudentResponse get(@PathVariable Long id) {
        return StudentResponse.from(studentService.getStudent(id));
    }

    /** 编辑学生（部分更新）：只更新请求里显式给出的字段。 */
    @PatchMapping("/{id}")
    public StudentResponse update(@PathVariable Long id,
                                  @Valid @RequestBody UpdateStudentRequest request) {
        return StudentResponse.from(studentService.updateStudent(id, request));
    }

    /** 物理删除学生。成功返回 204 No Content（无响应体）。 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    /** 退学：软删除，把学籍状态流转为「退学」，保留记录。 */
    @PostMapping("/{id}/withdraw")
    public StudentResponse withdraw(@PathVariable Long id) {
        return StudentResponse.from(studentService.withdrawStudent(id));
    }
}
