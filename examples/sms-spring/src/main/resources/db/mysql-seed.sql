-- MySQL 种子数据（手动执行一次即可）。
-- 用法：先用 mysql profile 启动一次应用让 Hibernate 自动建表，再执行本脚本：
--   mysql -uroot -p sms < mysql-seed.sql

INSERT INTO classroom (name, grade, capacity) VALUES ('三年二班', '三年级', 45);
INSERT INTO classroom (name, grade, capacity) VALUES ('四年一班', '四年级', 40);

INSERT INTO teacher (name, gender, age, teacher_no, subject) VALUES ('王老师', 'FEMALE', 35, 'T20260001', '数学');
INSERT INTO teacher (name, gender, age, teacher_no, subject) VALUES ('李老师', 'MALE',   42, 'T20260002', '语文');
