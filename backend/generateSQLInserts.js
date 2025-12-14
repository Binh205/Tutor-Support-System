const bcrypt = require("bcryptjs");
const fs = require("fs");

async function generateSQLInserts() {
  console.log("Generating SQL INSERT statements...\n");

  const password = "123456";
  const password_hash = await bcrypt.hash(password, 10);

  let sqlContent = `-- ============================================
-- SQL INSERT STATEMENTS FOR TUTOR SUPPORT SYSTEM
-- Generated: ${new Date().toISOString()}
-- ============================================
-- Default password for all users: ${password}
-- Password hash: ${password_hash}
-- ============================================

`;

  // ============= SEMESTERS =============
  sqlContent += `
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

`;

  // ============= USERS =============
  sqlContent += `
-- ============================================
-- INSERT USERS (STUDENTS)
-- ============================================
-- Để thêm students, copy các câu lệnh dưới đây vào SQLite Studio:

`;

  const students = [
    {
      email: "tranthib@student.hcmut.edu.vn",
      username: "tranthib",
      name: "Trần Thị B",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0901234568",
      address: "Ký túc xá khu B, ĐHQG-HCM",
    },
    {
      email: "lethic@student.hcmut.edu.vn",
      username: "lethic",
      name: "Lê Thị C",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0901234569",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "phamvand@student.hcmut.edu.vn",
      username: "phamvand",
      name: "Phạm Văn D",
      faculty: "Khoa Điện - Điện tử",
      phone: "0901234570",
      address: "Ký túc xá khu A, ĐHQG-HCM",
    },
    {
      email: "hoangthie@student.hcmut.edu.vn",
      username: "hoangthie",
      name: "Hoàng Thị E",
      faculty: "Khoa Cơ khí",
      phone: "0901234571",
      address: "123 Võ Văn Ngân, Thủ Đức",
    },
    {
      email: "vovanf@student.hcmut.edu.vn",
      username: "vovanf",
      name: "Võ Văn F",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0901234572",
      address: "Ký túc xá khu B, ĐHQG-HCM",
    },
    {
      email: "dothig@student.hcmut.edu.vn",
      username: "dothig",
      name: "Đỗ Thị G",
      faculty: "Khoa Khoa học Ứng dụng",
      phone: "0901234573",
      address: "456 Nguyễn Kiệm, Phú Nhuận",
    },
    {
      email: "buivanh@student.hcmut.edu.vn",
      username: "buivanh",
      name: "Bùi Văn H",
      faculty: "Khoa Kỹ thuật Hóa học",
      phone: "0901234574",
      address: "Ký túc xá khu A, ĐHQG-HCM",
    },
    {
      email: "ngothii@student.hcmut.edu.vn",
      username: "ngothii",
      name: "Ngô Thị I",
      faculty: "Khoa Quản lý Công nghiệp",
      phone: "0901234575",
      address: "789 Điện Biên Phủ, Q.3",
    },
    {
      email: "dangvank@student.hcmut.edu.vn",
      username: "dangvank",
      name: "Đặng Văn K",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0901234576",
      address: "Ký túc xá khu B, ĐHQG-HCM",
    },
    {
      email: "doanvanl@student.hcmut.edu.vn",
      username: "doanvanl",
      name: "Đoàn Văn L",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0901234577",
      address: "Ký túc xá khu A, ĐHQG-HCM",
    },
  ];

  students.forEach((s) => {
    sqlContent += `INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('${s.email}', '${password_hash}', '${s.username}', '${s.name}', '${s.faculty}', '${s.phone}', '${s.address}', 'student');

`;
  });

  sqlContent += `
-- ============================================
-- INSERT USERS (TUTORS)
-- ============================================
-- Để thêm tutors, copy các câu lệnh dưới đây vào SQLite Studio:

`;

  const tutors = [
    {
      email: "tutorminh@hcmut.edu.vn",
      username: "tutorminh",
      name: "Nguyễn Văn Minh",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0911111111",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutorhoa@hcmut.edu.vn",
      username: "tutorhoa",
      name: "Trần Thị Hoa",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0911111112",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutorquang@hcmut.edu.vn",
      username: "tutorquang",
      name: "Lê Văn Quang",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0911111113",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutorlan@hcmut.edu.vn",
      username: "tutorlan",
      name: "Phạm Thị Lan",
      faculty: "Khoa Điện - Điện tử",
      phone: "0911111114",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutordung@hcmut.edu.vn",
      username: "tutordung",
      name: "Hoàng Văn Dũng",
      faculty: "Khoa Cơ khí",
      phone: "0911111115",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutorlinh@hcmut.edu.vn",
      username: "tutorlinh",
      name: "Võ Thị Linh",
      faculty: "Khoa Khoa học Ứng dụng",
      phone: "0911111116",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutortuan@hcmut.edu.vn",
      username: "tutortuan",
      name: "Đỗ Văn Tuấn",
      faculty: "Khoa Kỹ thuật Hóa học",
      phone: "0911111117",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutormai@hcmut.edu.vn",
      username: "tutormai",
      name: "Bùi Thị Mai",
      faculty: "Khoa Quản lý Công nghiệp",
      phone: "0911111118",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutornam@hcmut.edu.vn",
      username: "tutornam",
      name: "Ngô Văn Nam",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0911111119",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutorthao@hcmut.edu.vn",
      username: "tutorthao",
      name: "Đặng Thị Thảo",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0911111120",
      address: "268 Lý Thường Kiệt, Q.10",
    },
  ];

  tutors.forEach((t) => {
    sqlContent += `INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES ('${t.email}', '${password_hash}', '${t.username}', '${t.name}', '${t.faculty}', '${t.phone}', '${t.address}', 'tutor');

`;
  });

  // ============= SUBJECTS =============
  sqlContent += `
-- ============================================
-- INSERT SUBJECTS
-- ============================================
-- Lưu ý: Thay đổi semester_id phù hợp với database của bạn
-- Để xem semester_id hiện có, chạy: SELECT * FROM semesters;

`;

  const subjects = [
    {
      code: "CO1007",
      name: "Cấu trúc rời rạc",
      description: "Môn học về lý thuyết tập hợp, đại số, tổ hợp và đồ thị",
      total_students: 250,
    },
    {
      code: "CO1023",
      name: "Hệ thống số",
      description: "Môn học về hệ thống số, logic số và thiết kế mạch số",
      total_students: 220,
    },
    {
      code: "CO1027",
      name: "Kỹ thuật lập trình",
      description: "Môn học về C++ và các kỹ thuật lập trình cơ bản",
      total_students: 300,
    },
    {
      code: "CO3093",
      name: "Mạng máy tính",
      description: "Môn học về kiến trúc mạng, giao thức và truyền thông mạng",
      total_students: 180,
    },
    {
      code: "CO2003",
      name: "Cấu trúc dữ liệu và giải thuật",
      description: "Môn học về các cấu trúc dữ liệu cơ bản và giải thuật",
      total_students: 280,
    },
    {
      code: "CO2013",
      name: "Hệ điều hành",
      description: "Môn học về kiến trúc và quản lý hệ điều hành",
      total_students: 200,
    },
    {
      code: "CO2039",
      name: "Cơ sở dữ liệu",
      description: "Môn học về thiết kế và quản trị cơ sở dữ liệu",
      total_students: 240,
    },
    {
      code: "CO3001",
      name: "Công nghệ phần mềm",
      description: "Môn học về quy trình phát triển phần mềm",
      total_students: 210,
    },
    {
      code: "CO3005",
      name: "Phân tích và thiết kế thuật toán",
      description: "Môn học về các kỹ thuật thiết kế và phân tích thuật toán",
      total_students: 160,
    },
    {
      code: "CO3009",
      name: "Trí tuệ nhân tạo",
      description: "Môn học về các phương pháp và ứng dụng trí tuệ nhân tạo",
      total_students: 190,
    },
    {
      code: "CO3015",
      name: "Học máy",
      description: "Môn học về các thuật toán và ứng dụng học máy",
      total_students: 170,
    },
    {
      code: "CO3021",
      name: "Xử lý ngôn ngữ tự nhiên",
      description: "Môn học về kỹ thuật xử lý và phân tích ngôn ngữ tự nhiên",
      total_students: 140,
    },
    {
      code: "CO3057",
      name: "Lập trình Web",
      description: "Môn học về phát triển ứng dụng Web front-end và back-end",
      total_students: 230,
    },
    {
      code: "CO3061",
      name: "Phát triển ứng dụng di động",
      description: "Môn học về lập trình ứng dụng trên nền tảng di động",
      total_students: 150,
    },
    {
      code: "CO3091",
      name: "Thiết kế và phân tích hệ thống",
      description: "Môn học về phương pháp thiết kế và phân tích hệ thống thông tin",
      total_students: 130,
    },
    {
      code: "CO3103",
      name: "An toàn và bảo mật thông tin",
      description: "Môn học về các kỹ thuật bảo mật và an toàn thông tin",
      total_students: 160,
    },
    {
      code: "CO3121",
      name: "Thị giác máy tính",
      description: "Môn học về xử lý ảnh và thị giác máy tính",
      total_students: 120,
    },
    {
      code: "CO3141",
      name: "Blockchain và ứng dụng",
      description: "Môn học về công nghệ blockchain và các ứng dụng",
      total_students: 100,
    },
  ];

  subjects.forEach((s) => {
    sqlContent += `INSERT INTO subjects (code, name, description, semester_id, total_students)
VALUES ('${s.code}', '${s.name}', '${s.description}', 10, ${s.total_students}); -- semester_id = 10 cho HK251

`;
  });

  // ============= TEMPLATE FOR CUSTOM DATA =============
  sqlContent += `
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
  '${password_hash}',  -- Password: ${password}
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
  '${password_hash}',  -- Password: ${password}
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
`;

  // Save to file
  const outputPath = "./seed_data.sql";
  fs.writeFileSync(outputPath, sqlContent);

  console.log(`✅ SQL file generated successfully!`);
  console.log(`📁 Location: ${outputPath}`);
  console.log(`\nBạn có thể:`);
  console.log(
    `1. Mở file ${outputPath} và copy các câu lệnh SQL cần thiết`
  );
  console.log(`2. Mở SQLite Studio và kết nối đến database data.sqlite`);
  console.log(`3. Paste các câu lệnh SQL vào SQL editor và execute`);
  console.log(`\n💡 Tip: Bạn có thể sửa trực tiếp trong file SQL trước khi copy!`);
}

generateSQLInserts();
