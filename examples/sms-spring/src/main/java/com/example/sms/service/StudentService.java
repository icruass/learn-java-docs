package com.example.sms.service;

import com.example.sms.domain.Student;
import com.example.sms.dto.RegisterStudentRequest;
import com.example.sms.dto.UpdateStudentRequest;

import java.util.List;

/**
 * 学生管理服务——系统对外暴露的「业务能力」总入口。
 *
 * <p>这一层承载所有业务规则（判重、生成学号、校验状态流转、编班/分配老师时的存在性检查），
 * 把领域对象与仓储「编排」在一起。Controller 只跟这个接口打交道，不直接碰仓储。
 *
 * <p>面向接口编程：Controller 依赖接口而非实现，便于替换与测试。
 */
public interface StudentService {

    /** 注册新学生：校验 → 判重 → 生成学号 →（可选）编班 → 落库。 */
    Student register(RegisterStudentRequest request);

    /** 获取全部学生列表。 */
    List<Student> listStudents();

    /** 按 id 获取单个学生；不存在则抛 {@code StudentNotFoundException}。 */
    Student getStudent(Long id);

    /** 编辑学生：可改基本信息，也可改教室、班主任、学籍状态（部分更新）。 */
    Student updateStudent(Long id, UpdateStudentRequest request);

    /** 物理删除学生。 */
    void deleteStudent(Long id);

    /** 软删除：把学籍状态流转为「退学」，保留历史记录。 */
    Student withdrawStudent(Long id);
}
