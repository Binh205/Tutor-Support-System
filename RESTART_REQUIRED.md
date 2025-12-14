# ⚠️ QUAN TRỌNG: CẦN RESTART BACKEND VÀ FRONTEND

## Vấn đề hiện tại:
Phần thống kê buổi học hiển thị **0** cho tất cả các chỉ số vì:
1. Backend đã được cập nhật nhưng **CHƯA RESTART**
2. Frontend đã được cập nhật nhưng **CHƯA REBUILD**

---

## ✅ Cách sửa:

### 1. Restart Backend (BẮT BUỘC)

```bash
# Dừng backend hiện tại (Ctrl+C nếu đang chạy)
# Sau đó chạy lại:
cd backend
npm start
```

hoặc nếu dùng nodemon:
```bash
cd backend
nodemon server.js
```

### 2. Restart Frontend (BẮT BUỘC)

```bash
# Dừng frontend hiện tại (Ctrl+C nếu đang chạy)
# Sau đó chạy lại:
cd frontend
npm start
```

### 3. Clear Browser Cache (Khuyến nghị)

- Mở DevTools (F12)
- Click chuột phải vào nút Refresh
- Chọn "Empty Cache and Hard Reload"

hoặc:
- Ctrl+Shift+Del → Clear Cache
- F5 để refresh

---

## 🔍 Kiểm tra xem đã hoạt động chưa:

### Bước 1: Kiểm tra API Backend
Mở trình duyệt và vào:
```
http://localhost:5000/api/schedules/current-semester
```

Kết quả mong đợi (JSON):
```json
{
  "id": 10,
  "code": "HK251",
  "name": "Học kỳ 1 năm 2025-2026",
  "start_date": "2025-09-01",
  "end_date": "2025-12-31",
  ...
}
```

Nếu thấy "Cannot GET /api/schedules/current-semester" → Backend chưa restart!

### Bước 2: Kiểm tra Console Log

Mở DevTools (F12) → Console tab

Sau khi vào trang "Quản lý buổi học", bạn sẽ thấy:
```
Current semester: {id: 10, code: "HK251", ...}
Fetching semester sessions for tutor X, semester 10
Semester sessions: [... danh sách sessions]
```

### Bước 3: Kiểm tra UI

Trên trang "Quản lý buổi học", bạn sẽ thấy:
- **Học kỳ: Học kỳ 1 năm 2025-2026 (Tổng: XX buổi)** ← Số này KHÔNG phải 0
- **Buổi học còn lại (cả học kỳ)**: XX
- **Đã hoàn thành (cả học kỳ)**: XX
- **Đã hủy (cả học kỳ)**: XX

---

## 🐛 Nếu vẫn không hoạt động:

### Kiểm tra 1: Backend có sessions không?

```bash
cd backend
node -e "const {getSessionsByTutorAndSemester, db} = require('./db'); getSessionsByTutorAndSemester(8, 10).then(s => {console.log('Sessions:', s.length); db.close();});"
```

Nếu thấy "Sessions: 0" → Chưa có dữ liệu sessions. Cần tạo lịch học trước.

### Kiểm tra 2: User đang login là tutor không?

Chỉ **tutor** mới thấy trang "Quản lý buổi học".
- Login với username: `tutor`, password: `tutor`
- Hoặc: `tutorminh`, password: `123456`

### Kiểm tra 3: Tutor có class nào không?

Vào trang **"Tạo lịch học"** để:
1. Thiết lập lịch rảnh
2. Tạo lớp học
3. Tạo lịch học định kỳ

Sau đó sessions sẽ tự động được tạo.

---

## 📋 Tóm tắt thay đổi:

### Backend:
1. Thêm API endpoint: `GET /api/schedules/current-semester`
2. Thêm API endpoint: `GET /api/sessions/tutor/semester`
3. Thêm API endpoint: `GET /api/sessions/student/semester`
4. Tự động tính số tuần từ semester dates (không còn hardcode 15)

### Frontend:
1. Stats hiện giờ tính theo **cả học kỳ** thay vì theo tháng
2. Hiển thị tên học kỳ và tổng số buổi học
3. Thêm console logs để debug

---

## 💡 Lưu ý:

- Backend và Frontend phải được **RESTART** sau mỗi lần sửa code
- Nếu dùng `nodemon` thì backend sẽ tự restart
- Frontend cần Ctrl+C và `npm start` lại
- Clear browser cache nếu thấy UI không cập nhật
