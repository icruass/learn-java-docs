package com.example.sms.service;

import com.example.sms.domain.Classroom;
import com.example.sms.domain.EnrollmentStatus;
import com.example.sms.domain.Student;
import com.example.sms.domain.Teacher;
import com.example.sms.dto.RegisterStudentRequest;
import com.example.sms.dto.UpdateStudentRequest;
import com.example.sms.exception.ClassroomNotFoundException;
import com.example.sms.exception.DuplicateStudentException;
import com.example.sms.exception.StudentNotFoundException;
import com.example.sms.exception.TeacherNotFoundException;
import com.example.sms.repository.ClassroomRepository;
import com.example.sms.repository.StudentRepository;
import com.example.sms.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

/**
 * {@link StudentService} 的默认实现。
 *
 * <p>{@code @Service}：交给 Spring 容器管理。依赖通过构造方法注入（Spring 自动把三个仓储传进来）——
 * 本类不自己 {@code new} 仓储，便于测试时换成 Mock。
 *
 * <p>{@code @Transactional}：每个写方法在一个数据库事务里执行，整段要么全成功要么全回滚；
 * 同时让懒加载的关联在方法返回前都能正常访问。只读方法标注 {@code readOnly = true} 作优化提示。
 */
@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ClassroomRepository classroomRepository;
    private final TeacherRepository teacherRepository;

    public StudentServiceImpl(StudentRepository studentRepository,
                              ClassroomRepository classroomRepository,
                              TeacherRepository teacherRepository) {
        this.studentRepository = studentRepository;
        this.classroomRepository = classroomRepository;
        this.teacherRepository = teacherRepository;
    }

    @Override
    public Student register(RegisterStudentRequest request) {
        // 1. 业务规则：同名学生不允许重复注册
        if (studentRepository.existsByName(request.getName())) {
            throw new DuplicateStudentException(request.getName());
        }

        // 2. 构造领域对象（构造方法内部已完成姓名/性别/年龄的合法性校验）
        Student student = new Student(request.getName(), request.getGender(), request.getAge());

        // 3. 生成业务学号并回填
        student.setStudentNo(generateStudentNo());

        // 4. 可选：注册时直接编班
        if (request.getClassroomId() != null) {
            student.assignClassroom(requireClassroom(request.getClassroomId()));
        }

        // 5. 落库（仓储会分配主键 id）
        return studentRepository.save(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Student> listStudents() {
        return studentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Student getStudent(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }

    @Override
    public Student updateStudent(Long id, UpdateStudentRequest request) {
        Student student = getStudent(id);

        if (student.getStatus().isTerminal()) {
            throw new IllegalStateException(
                    "学生已处于终态（" + student.getStatus().getDisplayName() + "），不可编辑");
        }

        // 仅对显式赋值（非 null）的字段做更新，实现部分更新
        if (request.getName() != null) {
            student.setName(request.getName());
        }
        if (request.getGender() != null) {
            student.setGender(request.getGender());
        }
        if (request.getAge() != null) {
            student.setAge(request.getAge());
        }
        if (request.getClassroomId() != null) {
            student.assignClassroom(requireClassroom(request.getClassroomId()));
        }
        if (request.getHeadTeacherId() != null) {
            student.assignHeadTeacher(requireTeacher(request.getHeadTeacherId()));
        }
        if (request.getStatus() != null) {
            student.changeStatus(request.getStatus());
        }

        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException(id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    public Student withdrawStudent(Long id) {
        Student student = getStudent(id);
        student.changeStatus(EnrollmentStatus.WITHDRAWN);
        return studentRepository.save(student);
    }

    // ---------- 私有辅助方法（封装内部细节，不对外暴露）----------

    /**
     * 生成业务学号，形如 {@code STU2026 0001}（去空格）。
     *
     * <p>用「现有学生数 + 1」作流水号，演示足矣；真实系统会用独立序列/发号器，
     * 并考虑删除后空洞、并发等问题。
     */
    private String generateStudentNo() {
        long seq = studentRepository.count() + 1;
        return String.format("STU%d%04d", Year.now().getValue(), seq);
    }

    private Classroom requireClassroom(Long classroomId) {
        return classroomRepository.findById(classroomId)
                .orElseThrow(() -> new ClassroomNotFoundException(classroomId));
    }

    private Teacher requireTeacher(Long teacherId) {
        return teacherRepository.findById(teacherId)
                .orElseThrow(() -> new TeacherNotFoundException(teacherId));
    }
}
