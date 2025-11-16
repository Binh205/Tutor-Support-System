# Tóm tắt luồng hoạt động hệ thống & các bước tiếp theo

Mục tiêu: tài liệu này tóm tắt luồng nghiệp vụ chính, API, bảng dữ liệu quan trọng và đề xuất việc triển khai tiếp theo (tiếng Việt).

---

## 1. Đối tượng (Actors)

- Tutor (giảng viên/tutor) — tạo môn, tạo lịch rảnh, tạo lịch định kỳ, quản lý buổi học.
- Student (sinh viên) — xem lớp, đăng ký lớp, bỏ/đổi lịch, vote cho reschedule.
- System (server) — lưu trữ dữ liệu, điều phối session, gửi lỗi/feedback.

## 2. Bảng dữ liệu chính (DB tables) — tóm tắt

- `semesters` (id, code, name, start_date, end_date, ...)
- `subjects` (id, code, name, semester_id, ...)
- `classes` (id, tutor_id, subject_id, semester_id, start_time, end_time, max_capacity, description, days, ...)
- `free_schedules` (id, tutor_id, date, start_time, end_time, ...) — lịch rảnh 1 lần
- `recurring_schedules` (id, tutor_id, weekday, start_time, end_time, ...) — lịch định kỳ
- `sessions` (id, class_id, date, start_time, end_time, status, attendance_info, ...) — buổi học thực tế
- `class_registrations` (id, class_id, student_id, registered_at) — đăng ký lớp
- `reschedule_polls` (id, session_id, proposer_id, proposed_times, expires_at, ...) — poll đổi lịch
- `poll_votes` (id, poll_id, voter_id, vote_choice)
- `session_attendance` (id, session_id, student_id, status)

## 3. Các API quan trọng (hiện đã/đề xuất)

- Semesters

  - GET `/api/semesters` — list semesters (ORDER BY ASC để hiển thị HK251→HK261)

- Subjects

  - GET `/api/subjects?semesterId=<id>` — list môn theo kỳ

- Classes (Tutor)

  - POST `/api/tutor/class` — tạo lớp (payload: tutor_id, subject_id, semester_id, days/start_time/end_time, max_capacity, description)
  - GET `/api/tutor/classes?tutorId=<>&semesterId=<>` — lấy danh sách lớp kèm `subject_code` + `subject_name` (JOIN subjects)

- Classes (Student)

  - GET `/api/classes?semesterId=<>` — danh sách lớp công khai cho kỳ
  - POST `/api/classes/:classId/register` — đăng ký lớp (payload: student_id)
    - Nếu đã đăng ký → trả lỗi rõ ràng: HTTP 409 + body { error: "Đã đăng ký rồi" }

- Schedules

  - POST `/api/tutor/free-schedule` — tutor thêm lịch rảnh 1 lần
  - POST `/api/tutor/recurring-schedule` — thêm lịch định kỳ
  - GET `/api/tutor/schedules?tutorId=&semesterId=` — lấy lịch tutor

- Sessions

  - POST `/api/sessions` — tạo buổi học từ lớp/hoặc từ lịch (class_id, date, start_time, end_time)
  - GET `/api/sessions?classId=` — danh sách buổi học
  - POST `/api/sessions/:id/attendance` — ghi danh điểm danh

- Reschedule Polls
  - POST `/api/sessions/:id/polls` — tạo poll đổi lịch
  - POST `/api/polls/:id/vote` — vote cho poll

## 4. Luồng nghiệp vụ chính (sequence flows)

1. Tutor tạo Class

- Tutor chọn `semester` (chỉ cho phép kỳ hiện tại hoặc trước đó, UI cần filter)
- Chọn `subject` (từ danh sách môn của kỳ)
- Chọn ngày trong tuần (`days`), chọn `start_time` & `end_time` (format `HH:MM`, 24h)
- Gửi POST `/api/tutor/class` → server tạo record `classes`
- Server trả về class mới; frontend làm mới danh sách lớp

2. Student xem & đăng ký Class

- Student GET `/api/classes?semesterId=` → hiển thị class cards
- Khi nhấn `Đăng ký` → frontend gọi POST `/api/classes/:id/register` với `student_id`
- Server cố gắng INSERT vào `class_registrations`:
  - Nếu thành công → 200 OK + message success
  - Nếu gặp duplicate (UNIQUE constraint) → return 409 + { error: "Đã đăng ký rồi" }
- Frontend xử lý: nếu 409 → hiển thị alert `Đã đăng ký rồi` (không show generic error)

3. Tutor tạo session (buổi học) từ class hoặc lịch

- Tutor chọn lớp → tạo `session` cho ngày cụ thể (POST `/api/sessions`)
- Server lưu `sessions` (liên kết `class_id`)

4. Student reschedule poll

- Nếu tutor/cảnh báo/need a change → tạo poll `/api/sessions/:id/polls` với các times
- Students vote → POST `/api/polls/:id/vote`
- Server tallies votes, nếu poll closed và một time thắng → hệ thống cập nhật `sessions` hoặc thông báo tutor

5. Attendance

- Sau buổi → tutor POST `/api/sessions/:id/attendance` với danh sách `student_id` và `status`

## 5. UI/UX rules & validation

- Semester selector:
  - Source: `GET /api/semesters` ORDER BY ASC, UI hiển thị từ sớm → muộn (251 → 261)
  - Chỉ cho phép tạo lớp cho kỳ hiện tại hoặc trước đó: cần xác định `current_semester` (server-side preferred)
- Time inputs:
  - Sử dụng dropdown `hour` 00–23 và `minute` 00–59 để tránh AM/PM
  - Store format `HH:MM` in DB
- Checkbox cho `days`:
  - Có thể dùng state React để gán class `checked` cho label; CSS dựa theo class đó để đổi nền màu xanh
- Error handling:
  - Map SQL UNIQUE violation → HTTP 409 với message cụ thể (ví dụ: "Đã đăng ký rồi")
  - Frontend: check status codes; nếu 409 → show localized message; nếu 400 → show validation; else → show generic fallback

## 6. Server-side enforcement (quan trọng)

- Validate semester permission server-side: prevent creating classes for future semesters even if frontend sent the request.
- When inserting into `class_registrations`, use a UNIQUE constraint `(class_id, student_id)` and catch the constraint error to return 409.

## 7. Recommended files / code places hiện có

- Backend DB helpers: `mockup_ui/backend/db.js` — chỗ chỉnh ORDER BY cho `getSemesters()` và JOIN subjects trong `getClassesByTutorAndSemester`.
- Backend routes/controllers: `mockup_ui/backend/controllers/*` and `mockup_ui/backend/routes/*` (check `schedules`, `auth`, `sessions` files).
- Frontend: `mockup_ui/frontend/src/components/tutor/taoLichHoc.jsx` — nơi đã thêm UI cho tạo lớp & time pickers.
- Frontend API wrappers: `mockup_ui/frontend/src/services/api.js` — add/adjust `registerClass` to handle 409.

## 8. Next steps (gợi ý cho chat/ticket tiếp theo)

1. Implement student registration endpoint (if missing) to return HTTP 409 + `{ error: "Đã đăng ký rồi" }` on duplicate.
2. Update frontend `register` flow to parse 409 and show `Đã đăng ký rồi` message.
3. Implement `current_semester` logic server-side and enforce creation permissions.
4. Implement Session management endpoints + UI: create session, list sessions per tutor/class, attendance.
5. Implement Reschedule Poll endpoints and UI flow (create poll, vote, close poll).
6. Fix checkbox label styling using React-controlled class toggles (avoid relying on `:has()` for cross-browser safety).
7. Add small tests for critical flows (registration duplicate handling, semester permission).

## 9. How to convert this file to Word (optional)

- If you want a `.docx`, from repo root you can use `pandoc` (if installed):

PowerShell example:

```powershell
cd "D:/HK251/Software Engineering/TutorSupportSystem/mockup_ui/docs"
pandoc system_flow_and_next_steps.md -o system_flow_and_next_steps.docx
```

Or open the `.md` directly in Microsoft Word (recent versions support opening Markdown and saving as `.docx`).

---

Nếu bạn muốn, tôi có thể: 1) tạo luôn file `.docx` bằng `pandoc` (nếu bạn cho phép chạy lệnh), hoặc 2) tiếp tục tạo ticket/code cho bước tiếp theo (ví dụ: cài endpoint đăng ký với 409 handling). Bạn muốn làm tiếp gì?
