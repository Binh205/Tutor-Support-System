# Tutor Support System (TSS)

Hệ thống quản lý dạy kèm một-một cho sinh viên và gia sư, hỗ trợ đăng ký lớp học, quản lý lịch học, điểm danh và đánh giá.

## Tổng quan

Tutor Support System là nền tảng web full-stack giúp quản lý hoạt động dạy kèm, bao gồm:

- **Sinh viên**: Đăng ký lớp học, xem lịch học, tham gia poll đổi lịch, đánh giá buổi học
- **Gia sư**: Tạo lớp học, quản lý lịch rảnh, quản lý buổi học (hủy/đổi lịch), xem phản hồi từ sinh viên

## Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js** - Server framework
- **SQLite3** - Database
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File upload (avatar)

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## Cấu trúc dự án

```
TutorSupportSystem/
├── backend/           # Node.js + Express backend
│   ├── controllers/   # Business logic
│   ├── routes/        # API endpoints
│   ├── server.js      # Entry point
│   ├── db.js          # Database setup
│   ├── data.sqlite    # SQLite database file
│   └── package.json
│
└── frontend/          # React + Vite frontend
    ├── src/
    │   ├── pages/          # Main pages
    │   ├── components/     # React components
    │   ├── services/       # API services
    │   ├── App.jsx         # App router
    │   └── main.jsx        # Entry point
    └── package.json
```

## Tính năng chính

### Dành cho Sinh viên
- Đăng ký/hủy đăng ký lớp học kèm theo môn học và học kỳ
- Xem lịch học theo tháng (calendar view)
- Tham gia poll bỏ phiếu đổi lịch học
- Đánh giá buổi học (rating 1-5 sao, có thể ẩn danh)

### Dành cho Gia sư
- Tạo lớp học kèm và thiết lập lịch định kỳ
- Quản lý lịch rảnh (free schedule)
- Quản lý buổi học: hủy, đổi lịch, hoàn thành
- Tạo poll đổi lịch cho sinh viên bỏ phiếu
- Xem feedback từ sinh viên

### Tính năng hệ thống
- Xác thực JWT
- Phân quyền theo vai trò (student/tutor)
- Upload avatar
- Hỗ trợ lớp học online/offline
- Theo dõi trạng thái buổi học (scheduled/completed/cancelled/rescheduled)
- Ngăn conflict lịch học

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập

### Students
- `GET /api/student/current-semester` - Lấy học kỳ hiện tại
- `GET /api/student/subjects?semesterId=...` - Danh sách môn học
- `GET /api/student/classes-by-subject?subjectId=...` - Lớp học theo môn
- `POST /api/student/classes/:classId/register` - Đăng ký lớp
- `DELETE /api/student/classes/:classId/unregister` - Hủy đăng ký
- `GET /api/student/registered-classes` - Lớp đã đăng ký

### Sessions
- `GET /api/sessions/student/calendar` - Lịch học sinh viên
- `GET /api/sessions/tutor/calendar` - Lịch học gia sư
- `POST /api/sessions/:id/cancel` - Hủy buổi học
- `POST /api/sessions/:id/reschedule` - Đổi lịch
- `POST /api/sessions/:id/complete` - Hoàn thành buổi học
- `POST /api/sessions/polls` - Tạo poll đổi lịch
- `POST /api/sessions/polls/:id/vote` - Bỏ phiếu

### Tutor
- `POST /api/tutor/class` - Tạo lớp học
- `GET /api/tutor/classes` - Danh sách lớp của gia sư
- `POST /api/tutor/schedule` - Tạo lịch rảnh
- `POST /api/tutor/class/:classId/recurring-schedule` - Tạo lịch định kỳ

### Feedbacks
- `POST /api/feedbacks` - Gửi feedback
- `GET /api/feedbacks/tutor/:tutorId` - Xem feedback của gia sư
- `GET /api/feedbacks/completed-no-feedback/:classId` - Buổi học chưa có feedback

## Database Schema

Hệ thống sử dụng SQLite với các bảng chính:

- `users` - Tài khoản người dùng (sinh viên/gia sư)
- `semesters` - Học kỳ
- `subjects` - Môn học
- `classes` - Lớp học kèm
- `free_schedules` - Lịch rảnh của gia sư
- `recurring_schedules` - Lịch định kỳ của lớp
- `sessions` - Buổi học cụ thể
- `class_registrations` - Đăng ký lớp học
- `session_attendance` - Điểm danh
- `feedbacks` - Đánh giá buổi học
- `reschedule_polls` - Poll đổi lịch

## Chạy ứng dụng

### Backend
```bash
cd backend
npm install
npm start        # Production
npm run dev      # Development với nodemon
```

Backend chạy tại: `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview production build
```

Frontend chạy tại: `http://localhost:5173` (hoặc port Vite chỉ định)

## Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

## Lưu ý

- Database SQLite được khởi tạo tự động khi chạy backend lần đầu
- Dữ liệu mẫu (seed data) có sẵn trong thư mục `backend/seed files/`
- Frontend tự động kết nối tới backend qua Axios (cấu hình trong `src/services/api.js`)
- Cần chạy cả backend và frontend đồng thời để sử dụng đầy đủ

## Version History

- **v1b** - Phiên bản ổn định hiện tại
- **v1a** - Phiên bản thử nghiệm
- **v1.0** - Phiên bản đầu tiên

## License

Academic project - Đại học Khoa học Tự nhiên TP.HCM

---

Developed with React, Express, and SQLite
