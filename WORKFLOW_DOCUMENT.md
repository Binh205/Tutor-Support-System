# Tutor Support System - Complete Workflow Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Tutor Workflow](#tutor-workflow)
3. [Student Workflow](#student-workflow)
4. [Data Models](#data-models)
5. [Business Rules & Constraints](#business-rules--constraints)

---

## System Overview

### Các Thành Phần Chính:
- **Tutor**: Giảng viên dạy kèm (phần bù/hỗ trợ)
- **Student**: Sinh viên học kèm
- **Subject**: Môn học (1 môn có thể do nhiều tutor quản lý)
- **Class**: Lớp học kèm (1 tutor + 1 môn = 1 class)
- **Session**: Buổi học cụ thể (ngày/giờ cụ thể)
- **Schedule**: Lịch rảnh định kỳ của tutor

### Mối Quan Hệ:
```
Semester (Kỳ học)
├── Subject (Môn học)
│   ├── Class 1 (Tutor A, max 20 SV)
│   ├── Class 2 (Tutor B, max 20 SV)
│   ├── Class 3 (Tutor C, max 20 SV)
│   ├── Class 4 (Tutor D, max 20 SV)
│   └── Class 5 (Tutor E, max 20 SV)
│       [Max 5 tutor cho 1 môn học]
│
├── Tutor (có tối đa 1-3 môn dạy/kỳ)
│   ├── Free Schedule (Lịch rảnh định kỳ: T2-T6, 16:30-20:00)
│   ├── Class 1 (Môn X)
│   │   ├── Recurring Schedule (T2, T4 hàng tuần)
│   │   ├── Session (buổi học cụ thể)
│   │   ├── Session (buổi học cụ thể)
│   │   └── ...
│   └── Class 2 (Môn Y)
│       └── ...
```

---

## Tutor Workflow

### **Phase 1: Chuẩn Bị Đầu Kỳ**

#### 1.1 Đăng Ký Dạy Môn Học
**Thời điểm**: Đầu kỳ (khoảng 1-2 tuần trước kỳ học chính thức)

**Flow**:
1. Tutor vào Dashboard → Click "Đăng ký dạy môn học"
2. Chọn Semester (kỳ hiện tại)
3. Chọn Subject (môn học cần dạy)
4. System kiểm tra:
   - ✓ Môn này đã có ≥5 tutor chưa? 
     - Nếu YES → Không cho phép (đã đủ)
     - Nếu NO → Tiếp tục
   - ✓ Tutor đã dạy ≥3 môn trong kỳ này chưa?
     - Nếu YES → Không cho phép
     - Nếu NO → Tiếp tục
5. Tutor nhập:
   - Số lượng sinh viên tối đa/class (mặc định 20)
   - Các ghi chú
6. Click "Xác nhận" → Tạo Class
7. System tạo "My Classes" section cho Tutor

**Output**: Một Class được tạo, tutor có thể bắt đầu set lịch

---

#### 1.2 Set Lịch Rảnh Định Kỳ (Free Schedule)
**Thời điểm**: Sau khi đăng ký dạy môn

**Flow** (TaoLichHoc.jsx):
1. Tutor click "Tạo lịch học" → Vào TaoLichHoc
2. Chọn Class (môn học cần tạo lịch)
3. **Bước 1: Tạo lịch rảnh cơ bản**
   - Chọn các ngày trong tuần: T2, T3, T4, T5, T6 (multi-select)
   - Chọn giờ bắt đầu và kết thúc (time picker)
   - Ví dụ: T2, T4, T6 từ 16:30-20:00
   - Button: "Lưu lịch rảnh"
4. **Bước 2: Tạo lịch học định kỳ cho Class này**
   - Dựa vào lịch rảnh đã set, tutor chọn những ngày nào sẽ dạy
   - Ví dụ: Mỗi T2, T4 có 1 buổi học (Mỗi tuần)
   - Tutor có thể tạo 1-3 buổi/tuần tùy ý
   - Chọn giờ cụ thể (phải nằm trong lịch rảnh)
   - Chọn số lượng session: "Tất cả kỳ" hoặc "N tuần từ tuần X"
   - Button: "Tạo lịch học"

5. System tự động sinh ra các Session cho từng tuần

**Output**: 
- Free Schedule được lưu
- Recurring Schedule được tạo
- Sessions được sinh ra hàng tuần tự động

**Example**:
```
Free Schedule: T2, T4, T6 (16:30-20:00)
Recurring Schedule cho Class X:
  - T2: 16:30-20:00 (mỗi tuần)
  - T4: 18:00-21:30 (mỗi tuần)

Sessions tự động sinh:
  - Week 1: T2 16:30, T4 18:00
  - Week 2: T2 16:30, T4 18:00
  - ... (tất cả các tuần)
```

---

### **Phase 2: Quản Lý Hàng Tuần**

#### 2.1 Quản Lý Buổi Học (QuanLyBuoiHoc.jsx)
**Thời điểm**: Hàng tuần trong kỳ học

**Main View**:
1. Tutor vào "Quản lý buổi học"
2. Chọn Class (nếu có nhiều class)
3. Chọn tuần xem (calendar picker hoặc next/prev week)
4. Hiển thị danh sách buổi học trong tuần:
   ```
   Tuần 5 - Môn X
   ├─ T2, 16:30-20:00
   │  Status: [Scheduled] 
   │  Số SV đăng ký: 15/20
   │  Actions: [Chỉnh sửa] [Hủy] [Chi tiết]
   │
   └─ T4, 18:00-21:30
      Status: [Scheduled]
      Số SV đăng ký: 20/20
      Actions: [Chỉnh sửa] [Hủy] [Chi tiết]
   ```

---

#### 2.2 Chỉnh Sửa Lịch Buổi Học (Reschedule)
**Action**: Tutor click "Chỉnh sửa" buổi học

**Flow**:
1. Modal mở ra, hiển thị:
   - Thời gian hiện tại
   - Danh sách sinh viên đã đăng ký
   - Lịch rảnh của tutor (exclude time slots of other classes)
   
2. Tutor chọn:
   - Ngày mới (chỉ các ngày trong free schedule)
   - Giờ mới (phải không trùng với classes khác)
   
3. System kiểm tra:
   - ✓ Slot mới có trùng với class khác không?
   - ✓ Có sinh viên nào bị conflict không?
   
4. Nếu OK → Click "Xác nhận" → Session được dời
5. System gửi notification cho tất cả sinh viên: "Tutor X đã dời lịch từ T2 16:30 → T3 17:00"

**Output**: Session được cập nhật

---

#### 2.3 Hủy Buổi Học & Vote Reschedule
**Action**: Tutor click "Hủy" buổi học

**Flow**:
1. Modal hủy buổi mở ra:
   - Input: Lý do hủy (bắt buộc)
   - Info: Số sinh viên sẽ bị ảnh hưởng
   
2. Tutor click "Xác nhận hủy"

3. System:
   - Đánh dấu Session: Status = "Cancelled"
   - Gửi notification cho tất cả sinh viên: "Tutor X hủy buổi T2 16:30 vì [lý do]"
   - Tự động mở form "Tạo Poll Reschedule"

4. **Tutor tạo Poll Reschedule**:
   - Tutor tạo 2-4 options cho buổi bù
   - Mỗi option gồm: ngày, giờ, mô tả (tuỳ ý)
   - Tất cả options phải nằm trong Free Schedule
   - Không trùng với classes khác
   - Click "Kích hoạt poll"

5. System:
   - Tạo Poll record
   - Set deadline = now + 48 hours
   - Gửi notification cho sinh viên: "Tutor X mở poll vote slot bù, hạn chót 48h"
   - Status: "Pending Reschedule"

**Poll Duration** (48 hours):
- Sinh viên vote (xem phần Student Workflow)
- Tutor có thể xem real-time vote count
- Khi deadline tới, system tự động xác định option có vote cao nhất
- Nếu hòa → tutor phải chọn 1 option
- Tutor click "Chốt slot bù này" → tạo Session mới

6. System:
   - Tạo Session mới từ option được chốt
   - Xóa Poll
   - Gửi notification cho sinh viên: "Buổi bù sẽ học T5 17:00"
   - Status: "Rescheduled"

**Output**: Buổi học bị hủy → Poll vote → Chốt slot bù → Tạo Session mới

---

#### 2.4 Xem Chi Tiết Buổi Học
**Action**: Tutor click "Chi tiết" buổi học

**Flow**:
1. Modal/Page mở ra, hiển thị:
   - Thời gian: T2, 16:30-20:00
   - Danh sách sinh viên đã đăng ký (20 sinh viên)
     - Tên, ID, email
     - Trạng thái: Có mặt / Vắng mặt / Chưa điểm danh
   - Lịch sử thay đổi: "Được tạo ngày X", "Dời từ T3 sang T2", etc.
   - Ghi chú

2. Tutor có thể:
   - Cập nhật trạng thái điểm danh (mark present/absent)
   - Thêm ghi chú
   - Export danh sách

---

### **Phase 3: Kết Thúc Kỳ**

#### 3.1 Xem Tổng Hợp Kỳ
**Action**: Tutor xem báo cáo kỳ

**Hiển thị**:
- Tổng số buổi học dạy
- Số buổi được dời / hủy / bù
- Tổng sinh viên đã học
- Phân bố sinh viên theo class
- Feedback từ sinh viên (nếu có)

---

## Student Workflow

### **Phase 1: Đăng Ký Học (Đầu Kỳ)**

#### 1.1 Tìm Kiếm Môn Học & Class
**Flow** (DangKyMonHoc.jsx):
1. Student vào "Đăng ký môn học"
2. Chọn Semester (kỳ hiện tại)
3. Search môn học:
   - Input: Mã môn hoặc tên môn
   - Hiển thị danh sách kết quả
   
4. Chọn 1 môn → Xem danh sách các Class (tutor) dạy môn này:
   ```
   Môn X - Python Cơ Bản (100 SV)
   ├─ Class 1 - Tutor A
   │  Schedule: T2, T4 16:30-20:00
   │  Đã đăng ký: 20/20 [FULL]
   │
   ├─ Class 2 - Tutor B
   │  Schedule: T3, T5 18:00-21:30
   │  Đã đăng ký: 15/20 [CÒN]
   │  Button: [Đăng ký]
   │
   ├─ Class 3 - Tutor C
   │  Schedule: T4, T6 17:00-20:30
   │  Đã đăng ký: 20/20 [FULL]
   │
   └─ Class 4 - Tutor D
      Schedule: T2, T5 19:00-22:30
      Đã đăng ký: 18/20 [CÒN]
      Button: [Đăng ký]
   ```

#### 1.2 Xem Chi Tiết Class
**Action**: Student click vào 1 Class

**Hiển thị**:
- Tên tutor, email, SĐT
- Lịch dạy chi tiết (tất cả các buổi trong kỳ)
- Số lượng tối đa
- Số lượng đã đăng ký
- Lịch rảnh của tutor (để student biết tutor busy khi nào)
- Feedback từ sinh viên cũ (nếu có)
- Button: "Đăng ký" hoặc "Đã đăng ký"

#### 1.3 Đăng Ký Class
**Flow**:
1. Student click "Đăng ký"
2. System kiểm tra:
   - ✓ Class còn slot trống không?
   - ✓ Student có conflict lịch không? (check với các class khác đã đăng ký)
   
3. Nếu OK → Đăng ký thành công
4. System gửi notification cho student: "Đăng ký thành công môn X với tutor A"
5. Student được thêm vào danh sách của Class

**Output**: Student đã đăng ký vào 1 Class, locked cho cả kỳ

---

### **Phase 2: Học Hàng Tuần**

#### 2.1 Xem Lịch Học (My Classes)
**Flow** (QuanLyLichHoc.jsx):
1. Student vào "Quản lý lịch học"
2. Hiển thị danh sách các class đã đăng ký:
   ```
   Kỳ này bạn đang học:
   ├─ Môn X - Tutor A
   │  Tuần này:
   │  ├─ T2, 16:30-20:00 [Scheduled]
   │  └─ T4, 18:00-21:30 [Scheduled]
   │  
   │  Tuần sau:
   │  ├─ T2, 16:30-20:00 [Scheduled]
   │  └─ T4, 18:00-21:30 [Scheduled - Poll Vote]
   │     (Tutor hủy buổi T5 vì bận, vote buổi bù)
   │
   └─ Môn Y - Tutor B
      ...
   ```

3. Nếu có Poll vote chưa làm → Highlight
   - Text: "⚠️ Tutor hủy buổi T5 18:00, bạn chưa vote buổi bù"
   - Button: "Vote ngay"

---

#### 2.2 Voting Buổi Học Bù
**Flow** (khi Poll được kích hoạt):
1. Student nhận notification: "Tutor X hủy buổi, vote slot bù trong 48h"
2. Student click notification → Vào Vote Modal
3. Modal hiển thị:
   ```
   Buổi hủy: T5, 18:00-21:30 (Lý do: Bận họp)
   
   Vote cho buổi bù (hạn chót: 48h, còn lại: 32h):
   ○ Option 1: T4, 16:30-20:00 (5 vote)
   ○ Option 2: T5, 17:00-20:30 (3 vote)
   ○ Option 3: T6, 19:00-22:30 (5 vote)
   ○ Option 4: CN, 14:00-17:30 (2 vote)
   
   Button: [Vote] [Cancel]
   ```

4. Student chọn 1 option, click "Vote"
5. System:
   - Ghi lại vote của student
   - Vote count cập nhật real-time
   - Student thấy tick: "✓ Bạn đã vote cho Option 1"
   - Không cho phép vote lại

6. Khi poll kết thúc:
   - Student nhận notification: "Buổi bù được chốt vào [option được chọn]"
   - Lịch học tự động cập nhật

**Output**: Student vote xong, lịch học cập nhật tự động

---

#### 2.3 Nhận Thông Báo Thay Đổi Lịch
**Scenarios**:

**Scenario A: Tutor dời lịch (reschedule)**
- Notification: "Tutor X đã dời buổi T2 16:30 → T3 17:00"
- Student tự động thấy lịch cập nhật trong "My Classes"

**Scenario B: Tutor hủy buổi**
- Notification: "Tutor X hủy buổi T2 16:30 (Lý do: Bận họp)"
- Buổi học status: "Cancelled"
- Nếu có poll → nhận vote notification
- Khi poll chốt → lịch cập nhật tự động

**Scenario C: Buổi bù được chốt**
- Notification: "Buổi bù được chốt vào T4 18:00"
- Buổi học mới xuất hiện trong lịch

---

#### 2.4 Xem Chi Tiết Buổi Học
**Action**: Student click vào 1 buổi học

**Hiển thị**:
- Thời gian: T2, 16:30-20:00
- Tutor: Tên, email, SĐT
- Địa điểm (nếu có)
- Ghi chú
- Trạng thái: Scheduled / Cancelled / Rescheduled / Completed
- Lịch sử: "Tạo ngày X", "Dời từ T3 sang T2", "Bị hủy ngày X"

---

### **Phase 3: Feedback (Sau Kỳ)**

#### 3.1 Gửi Feedback
**Flow** (Feedback.jsx):
1. Student vào "Feedback"
2. Chọn 1 class đã học
3. Nhập feedback:
   - Rating: 1-5 sao
   - Điểm mạnh của tutor
   - Điểm cần cải thiện
   - Bình luận tự do
4. Click "Gửi"
5. Feedback được lưu, có thể ảnh hưởng đến xếp hạng tutor (future feature)

---

## Data Models

### Tutor Free Schedule
```javascript
{
  id: "schedule_xxx",
  tutorId: "tutor_xxx",
  semesterId: "sem_xxx",
  daysOfWeek: [1, 3, 5],  // T2, T4, T6 (0=CN, 1=T2, ..., 6=T7)
  startTime: "16:30",      // HH:MM format
  endTime: "20:00",
  createdAt: "2025-11-15T10:00:00Z",
  updatedAt: "2025-11-15T10:00:00Z"
}
```

### Recurring Schedule (Lịch học định kỳ)
```javascript
{
  id: "recurring_xxx",
  classId: "class_xxx",
  dayOfWeek: 1,            // T2
  startTime: "16:30",
  endTime: "20:00",
  startWeek: 1,            // Bắt đầu tuần 1
  endWeek: 15,             // Kết thúc tuần 15
  createdAt: "2025-11-15T10:00:00Z",
  
  // Generated sessions từ recurring schedule này:
  sessions: ["session_1", "session_2", ...]
}
```

### Session (Buổi học cụ thể)
```javascript
{
  id: "session_xxx",
  classId: "class_xxx",
  recurringScheduleId: "recurring_xxx",  // Nếu từ recurring
  startTime: "2025-11-18T16:30:00Z",
  endTime: "2025-11-18T20:00:00Z",
  status: "scheduled" | "cancelled" | "rescheduled" | "completed",
  registeredStudents: ["student_1", "student_2", ...],
  maxCapacity: 20,
  attendanceList: {
    "student_1": "present" | "absent" | "not_marked",
    ...
  },
  notes: "Bài học về cấu trúc dữ liệu",
  rescheduleReason: "Bận họp",  // Nếu status = cancelled/rescheduled
  rescheduledToSessionId: "session_yyy",  // Session bù được chốt
  createdAt: "2025-11-15T10:00:00Z",
  updatedAt: "2025-11-15T10:00:00Z"
}
```

### Reschedule Poll
```javascript
{
  id: "poll_xxx",
  cancelledSessionId: "session_xxx",
  classId: "class_xxx",
  tutorId: "tutor_xxx",
  reason: "Bận họp",
  options: [
    {
      id: 1,
      dayOfWeek: 4,         // T5
      startTime: "16:30",
      endTime: "20:00",
      description: "Thứ năm chiều"
    },
    {
      id: 2,
      dayOfWeek: 5,         // T6
      startTime: "18:00",
      endTime: "21:30",
      description: "Thứ sáu tối"
    },
    ...
  ],
  studentVotes: {
    "student_1": 1,        // Chọn option 1
    "student_2": 2,
    ...
  },
  createdAt: "2025-11-15T10:00:00Z",
  deadline: "2025-11-17T10:00:00Z",  // +48h
  status: "active" | "closed",
  selectedOptionId: 1,     // Option được chốt (khi status = closed)
  rescheduledSessionId: "session_yyy",  // Session bù được tạo
  closedAt: "2025-11-17T10:05:00Z"
}
```

### Class (Lớp học kèm)
```javascript
{
  id: "class_xxx",
  subjectId: "subject_xxx",
  tutorId: "tutor_xxx",
  semesterId: "sem_xxx",
  maxCapacity: 20,
  registeredStudents: ["student_1", "student_2", ...],
  description: "Lớp kèm Python cơ bản",
  createdAt: "2025-11-15T10:00:00Z",
  updatedAt: "2025-11-15T10:00:00Z"
}
```

### Subject (Môn học)
```javascript
{
  id: "subject_xxx",
  code: "CS101",
  name: "Python Cơ Bản",
  description: "Học lập trình Python từ cơ bản",
  totalStudents: 100,      // Số sinh viên chính khóa
  semesterId: "sem_xxx",
  tutorClasses: ["class_1", "class_2", ...]  // Classes của các tutor
}
```

---

## Business Rules & Constraints

### Tutor Constraints:
1. **Số môn dạy/kỳ**: 1-3 môn (tối đa 3)
2. **Số tutor/môn**: Tối đa 5 tutor dạy 1 môn
3. **Max sinh viên/class**: 20 sinh viên (tutor có thể set khác)
4. **Free Schedule**: Bắt buộc tạo trước khi tạo lịch học
5. **Recurring Schedule**: Không trùng thời gian giữa các class
6. **Reschedule Poll**:
   - 2-4 options
   - Deadline: 48 giờ
   - Các options phải nằm trong Free Schedule
   - Không trùng với class khác

### Student Constraints:
1. **Một class/môn/kỳ**: Student chỉ học 1 class của 1 tutor cho 1 môn
2. **Lock lịch**: Sau đăng ký, student lock cho cả kỳ
3. **Vote một lần**: Không được vote lại trong poll
4. **Tuần bắt đầu**: Có thể đăng ký đến hết tuần 1 (sau đó không đăng ký được)

### System Constraints:
1. **Poll Auto-Close**: Poll tự động đóng sau 48h
2. **Session Auto-Create**: Sessions tự động sinh từ recurring schedule
3. **Notification**: Auto-send khi có thay đổi lịch
4. **Attendance**: Tutor đánh dấu điểm danh sau buổi học

---

## Future Enhancements:
- [ ] Integration với Google Calendar
- [ ] Video call cho buổi học online
- [ ] Grading system cho tutor
- [ ] Analytics dashboard cho admin
- [ ] Automatic makeup session suggestion (AI)
- [ ] Multi-language support

---

**Document Version**: 1.0  
**Last Updated**: 15/11/2025  
**Status**: Ready for Development
