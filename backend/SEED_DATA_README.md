# Hướng dẫn Seed Data cho Tutor Support System

## 📋 Tổng quan

Dự án có **2 cách** để thêm dữ liệu vào database:

1. **Tự động**: Chạy scripts Node.js
2. **Thủ công**: Dùng SQLite Studio với file SQL

## ⚠️ QUAN TRỌNG: Migration cho Subjects Table

**Nếu bạn gặp lỗi `UNIQUE constraint failed: subjects.code`:**

Chạy migration script để sửa database schema:
```bash
node backend/migrateSubjectsSchema.js
```

**Chi tiết:** Xem file `backend/MIGRATION_SUBJECTS_SCHEMA.md`

---

## Cách 1: Sử dụng Scripts Node.js

### Chạy tất cả scripts theo thứ tự:

```bash
# Bước 1: Seed semesters (nếu chưa có)
node backend/seedSemesters.js

# Bước 2: Seed users (students + tutors)
node backend/seedUsers.js

# Bước 3: Seed subjects (môn học) - CHO NHIỀU HỌC KỲ
node backend/seedSubjectsMultipleSemesters.js

# Hoặc chỉ seed cho HK251 (cách cũ)
node backend/seedSubjects.js
```

### Chi tiết từng script:

#### 1. `seedSemesters.js` - Tạo học kỳ

Tạo 4 học kỳ:

- HK251: Học kỳ 1 năm 2025-2026 (01/09/2025 - 31/12/2025)
- HK252: Học kỳ 2 năm 2025-2026 (01/02/2026 - 30/06/2026)
- HK253: Học kỳ hè 2026 (15/06/2026 - 15/09/2026)
- HK261: Học kỳ 1 năm 2026-2027 (01/09/2026 - 31/12/2026)

```bash
node backend/seedSemesters.js
```

#### 2. `seedUsers.js` - Tạo users

Tạo:

- 11 Students (bao gồm user "student" ban đầu)
- 11 Tutors (bao gồm user "tutor" ban đầu)

Password mặc định: `123456`

```bash
node backend/seedUsers.js
```

#### 3a. `seedSubjectsMultipleSemesters.js` - Tạo môn học cho nhiều học kỳ (MỚI) ⭐

Tạo 18 môn học cho một hoặc nhiều học kỳ:

**Seed tất cả học kỳ:**
```bash
node backend/seedSubjectsMultipleSemesters.js
```

**Seed học kỳ cụ thể:**
```bash
# Chỉ HK252
node backend/seedSubjectsMultipleSemesters.js HK252

# Nhiều học kỳ
node backend/seedSubjectsMultipleSemesters.js HK251,HK252,HK253
```

**Danh sách 18 môn học:**
- CO1007: Cấu trúc rời rạc
- CO1023: Hệ thống số
- CO1027: Kỹ thuật lập trình
- CO2003: Cấu trúc dữ liệu và giải thuật
- ... và 14 môn khác (xem file chi tiết)

**Kiểm tra kết quả:**
```bash
node backend/checkSubjectsBySemester.js
```

#### 3b. `seedSubjects.js` - Tạo môn học cho HK251 (CŨ)

Chỉ tạo môn học cho HK251:

```bash
node backend/seedSubjects.js
```

---

## 🔧 Cách 2: Sử dụng SQLite Studio (Thủ công)

### Bước 1: Tạo file SQL

```bash
node backend/generateSQLInserts.js
```

File `backend/seed_data.sql` sẽ được tạo ra.

### Bước 2: Mở SQLite Studio

1. Tải và cài đặt [SQLite Studio](https://sqlitestudio.pl/)
2. Mở SQLite Studio
3. Kết nối đến database: `backend/data.sqlite`

### Bước 3: Execute SQL

1. Mở file `backend/seed_data.sql` bằng text editor
2. Copy các phần SQL bạn cần:
   - **Semesters** (dòng 15-25)
   - **Students** (dòng 33-53)
   - **Tutors** (dòng 61-91)
   - **Subjects** (dòng 99-180)
3. Paste vào SQL editor trong SQLite Studio
4. Execute (F9 hoặc Ctrl+Enter)

### Bước 4: Tùy chỉnh (Optional)

Bạn có thể sửa trực tiếp trong file `seed_data.sql` trước khi copy:

- Thay đổi thông tin users
- Thêm/bớt môn học
- Thay đổi semester_id

---

## 📊 Dữ liệu hiện có

### Semesters (4 học kỳ)

```
HK251: Học kỳ 1 năm 2025-2026
HK252: Học kỳ 2 năm 2025-2026
HK253: Học kỳ hè 2026
HK261: Học kỳ 1 năm 2026-2027
```

### Users (22 users)

**11 Students:**

- student, tranthib, lethic, phamvand, hoangthie, vovanf,
  dothig, buivanh, ngothii, dangvank, doanvanl

**11 Tutors:**

- tutor, tutorminh, tutorhoa, tutorquang, tutorlan, tutordung,
  tutorlinh, tutortuan, tutormai, tutornam, tutorthao

**Password:** `123456` (cho tất cả users mới)

### Subjects (19 môn học)

- CO1007, CO1023, CO1027, CO2003, CO2013, CO2039
- CO3001, CO3005, CO3009, CO3015, CO3021, CO3057
- CO3061, CO3091, CO3093, CO3103, CO3121, CO3141

---

## 📝 Template để tự thêm dữ liệu

File `seed_data.sql` có sẵn các template:

### Thêm Semester mới:

```sql
INSERT INTO semesters (code, name, start_date, end_date)
VALUES (
  'HK999',
  'Tên học kỳ',
  '2026-01-01',
  '2026-06-30'
);
```

### Thêm Student mới:

```sql
INSERT INTO users (email, password_hash, username, name, faculty, phone, address, role)
VALUES (
  'email@student.hcmut.edu.vn',
  '$2a$10$...',  -- Copy password hash từ file
  'username',
  'Họ và Tên',
  'Khoa',
  'Số điện thoại',
  'Địa chỉ',
  'student'
);
```

### Thêm Subject mới:

```sql
INSERT INTO subjects (code, name, description, semester_id, total_students)
VALUES (
  'CO9999',
  'Tên môn học',
  'Mô tả môn học',
  10,  -- ID của semester
  100
);
```

---

## 🔍 Queries hữu ích

### Xem tất cả users theo role:

```sql
SELECT username, name, role, email
FROM users
ORDER BY role, username;
```

### Xem tất cả môn học:

```sql
SELECT code, name, total_students
FROM subjects
ORDER BY code;
```

### Xem tất cả semesters:

```sql
SELECT * FROM semesters
ORDER BY start_date;
```

### Đếm số users theo role:

```sql
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;
```

### Xem môn học theo semester:

```sql
SELECT s.code, s.name, sem.code as semester_code
FROM subjects s
JOIN semesters sem ON s.semester_id = sem.id
ORDER BY sem.code, s.code;
```

---

## 🗑️ Reset Database (Cẩn thận!)

Nếu muốn xóa hết dữ liệu và seed lại từ đầu:

```bash
# Xóa tất cả data (CẢNH BÁO: Mất hết dữ liệu!)
node -e "const {db} = require('./backend/db'); db.run('DELETE FROM subjects'); db.run('DELETE FROM semesters'); db.run('DELETE FROM users WHERE role != \"admin\"'); db.close();"

# Seed lại từ đầu
node backend/seedSemesters.js
node backend/seedUsers.js
node backend/seedSubjects.js
```

---

## 💡 Tips

1. **Idempotent**: Các scripts có thể chạy nhiều lần mà không bị duplicate data
2. **Kiểm tra trước**: Scripts sẽ kiểm tra xem data đã tồn tại chưa trước khi insert
3. **Tùy chỉnh**: Có thể edit trực tiếp file SQL hoặc scripts JS trước khi chạy
4. **Password hash**: Để tạo password hash mới, dùng bcrypt với salt rounds = 10

---

## 📞 Liên hệ

Nếu có vấn đề, kiểm tra:

- Database file có tồn tại: `backend/data.sqlite`
- Node.js dependencies đã install: `npm install`
- Database schema đã được tạo (xem `backend/db.js`)
