-- ============================================
-- SQL INSERT STATEMENTS FOR TUTOR SUPPORT SYSTEM
-- Generated: 2025-12-05T06:37:34.001Z
-- ============================================
-- Default password for all users: 123456
-- Password hash: $2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG
-- ============================================


-- ============================================
-- INSERT SEMESTERS
-- ============================================
-- Để thêm semesters, copy các câu lệnh dưới đây vào SQLite Studio:

INSERT INTO semesters (code, name, start_date, end_date)
VALUES ('HK251', 'Học kỳ 1 năm 2025-2026', '2025-09-01', '2025-12-31');

INSERT INTO semesters (code, name, start_date, end_date)
VALUES ('HK252', 'Học kỳ 2 năm 2025-2026', '2026-02-01', '2026-06-30');

INSERT INTO semesters (code, name, start_date, end_date)
VALUES ('HK253', 'Học kỳ hè 2026', '2026-06-15', '2026-09-15');

INSERT INTO semesters (code, name, start_date, end_date)
VALUES ('HK261', 'Học kỳ 1 năm 2026-2027', '2026-09-01', '2026-12-31');


-- ============================================
-- INSERT USERS (STUDENTS)
-- ============================================
-- Để thêm students, copy các câu lệnh dưới đây vào SQLite Studio:

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tranthib@student.hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tranthib', 'Trần Thị B', 'Khoa Khoa học và Kỹ thuật Máy tính', '0901234568', 'Ký túc xá khu B, ĐHQG-HCM', 'student');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('lethic@student.hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'lethic', 'Lê Thị C', 'Khoa Khoa học và Kỹ thuật Máy tính', '0901234569', '268 Lý Thường Kiệt, Q.10', 'student');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('phamvand@student.hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'phamvand', 'Phạm Văn D', 'Khoa Điện - Điện tử', '0901234570', 'Ký túc xá khu A, ĐHQG-HCM', 'student');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('hoangthie@student.hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'hoangthie', 'Hoàng Thị E', 'Khoa Cơ khí', '0901234571', '123 Võ Văn Ngân, Thủ Đức', 'student');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('vovanf@student.hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'vovanf', 'Võ Văn F', 'Khoa Khoa học và Kỹ thuật Máy tính', '0901234572', 'Ký túc xá khu B, ĐHQG-HCM', 'student');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('dothig@student.hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'dothig', 'Đỗ Thị G', 'Khoa Khoa học Ứng dụng', '0901234573', '456 Nguyễn Kiệm, Phú Nhuận', 'student');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('buivanh@student.hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'buivanh', 'Bùi Văn H', 'Khoa Kỹ thuật Hóa học', '0901234574', 'Ký túc xá khu A, ĐHQG-HCM', 'student');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('ngothii@student.hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'ngothii', 'Ngô Thị I', 'Khoa Quản lý Công nghiệp', '0901234575', '789 Điện Biên Phủ, Q.3', 'student');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('dangvank@student.hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'dangvank', 'Đặng Văn K', 'Khoa Khoa học và Kỹ thuật Máy tính', '0901234576', 'Ký túc xá khu B, ĐHQG-HCM', 'student');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('doanvanl@student.hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'doanvanl', 'Đoàn Văn L', 'Khoa Khoa học và Kỹ thuật Máy tính', '0901234577', 'Ký túc xá khu A, ĐHQG-HCM', 'student');


-- ============================================
-- INSERT USERS (TUTORS)
-- ============================================
-- Để thêm tutors, copy các câu lệnh dưới đây vào SQLite Studio:

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tutorminh@hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tutorminh', 'Nguyễn Văn Minh', 'Khoa Khoa học và Kỹ thuật Máy tính', '0911111111', '268 Lý Thường Kiệt, Q.10', 'tutor');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tutorhoa@hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tutorhoa', 'Trần Thị Hoa', 'Khoa Khoa học và Kỹ thuật Máy tính', '0911111112', '268 Lý Thường Kiệt, Q.10', 'tutor');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tutorquang@hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tutorquang', 'Lê Văn Quang', 'Khoa Khoa học và Kỹ thuật Máy tính', '0911111113', '268 Lý Thường Kiệt, Q.10', 'tutor');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tutorlan@hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tutorlan', 'Phạm Thị Lan', 'Khoa Điện - Điện tử', '0911111114', '268 Lý Thường Kiệt, Q.10', 'tutor');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tutordung@hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tutordung', 'Hoàng Văn Dũng', 'Khoa Cơ khí', '0911111115', '268 Lý Thường Kiệt, Q.10', 'tutor');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tutorlinh@hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tutorlinh', 'Võ Thị Linh', 'Khoa Khoa học Ứng dụng', '0911111116', '268 Lý Thường Kiệt, Q.10', 'tutor');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tutortuan@hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tutortuan', 'Đỗ Văn Tuấn', 'Khoa Kỹ thuật Hóa học', '0911111117', '268 Lý Thường Kiệt, Q.10', 'tutor');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tutormai@hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tutormai', 'Bùi Thị Mai', 'Khoa Quản lý Công nghiệp', '0911111118', '268 Lý Thường Kiệt, Q.10', 'tutor');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tutornam@hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tutornam', 'Ngô Văn Nam', 'Khoa Khoa học và Kỹ thuật Máy tính', '0911111119', '268 Lý Thường Kiệt, Q.10', 'tutor');

INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('tutorthao@hcmut.edu.vn', '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG', 'tutorthao', 'Đặng Thị Thảo', 'Khoa Khoa học và Kỹ thuật Máy tính', '0911111120', '268 Lý Thường Kiệt, Q.10', 'tutor');


-- ============================================
-- INSERT SUBJECTS
-- ============================================
-- Lưu ý: Thay đổi semester_id phù hợp với database của bạn
-- Để xem semester_id hiện có, chạy: SELECT * FROM semesters;

Execution finished with errors.
Result: UNIQUE constraint failed: subjects.code
At line 1:
INSERT INTO subjects (code, name, description, semester_id, total_students)
VALUES ('CO1007', 'Cấu trúc rời rạc', 'Môn học về lý thuyết tập hợp, đại số, tổ hợp và đồ thị', 11, 250);

-- ============================================
-- TEMPLATE ĐỂ TỰ THÊM DỮ LIỆU
-- ============================================

-- Template thêm semester mới:
/*
INSERT INTO semesters (code, name, start_date, end_date)
VALUES (
  'HK999',
  'Tên học kỳ',
  '2026-01-01',  -- Ngày bắt đầu (YYYY-MM-DD)
  '2026-06-30'   -- Ngày kết thúc (YYYY-MM-DD)
);
*/

-- Template thêm student mới:
/*
INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES (
  'email@student.hcmut.edu.vn',
  '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG',  -- Password: 123456
  'username',
  'Họ và Tên',
  'Khoa',
  'Số điện thoại',
  'Địa chỉ',
  'student'
);
*/

-- Template thêm tutor mới:
/*
INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES (
  'email@hcmut.edu.vn',
  '$2a$10$NXAHbXe3/6AP9YIrsblAI.pGV/MMsSlILKR4lgEAFhOLx34rp9KQG',  -- Password: 123456
  'username',
  'Họ và Tên',
  'Khoa',
  'Số điện thoại',
  'Địa chỉ',
  'tutor'
);
*/

-- Template thêm môn học mới:
/*
INSERT INTO subjects (code, name, description, semester_id, total_students)
VALUES (
  'CO9999',
  'Tên môn học',
  'Mô tả môn học',
  10,  -- Thay bằng semester_id phù hợp
  100  -- Số lượng sinh viên dự kiến
);
*/

-- ============================================
-- QUERY HỮU ÍCH
-- ============================================

-- Xem tất cả users theo role:
-- SELECT username, name, role, email FROM users ORDER BY role, username;

-- Xem tất cả môn học:
-- SELECT code, name, total_students FROM subjects ORDER BY code;

-- Xem tất cả semesters:
-- SELECT * FROM semesters;

-- Đếm số users theo role:
-- SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Xóa user theo username (nếu cần):
-- DELETE FROM users WHERE username = 'username_here';

-- Xóa subject theo code (nếu cần):
-- DELETE FROM subjects WHERE code = 'CO9999';

-- ============================================
-- END OF FILE
-- ============================================
