# Debug: Stats hiển thị 0 cho tutornam và tutorthao

## ✅ Backend đã được kiểm tra - HOẠT ĐỘNG TÔT!

Tôi đã test và xác nhận:

### tutornam (id=27):
- **16 sessions** trong semester HK251:
  - 13 scheduled
  - 1 completed
  - 1 cancelled
  - 1 rescheduled

### tutorthao (id=28):
- **30 sessions** trong semester HK251

### API Endpoint hoạt động:
```bash
curl "http://localhost:5000/api/sessions/tutor/semester?tutorId=27&semesterId=10"
```
Trả về đầy đủ 16 sessions với đúng status.

---

## 🔍 NGUYÊN NHÂN: Frontend chưa fetch được data

### Bước 1: RESTART FRONTEND (BẮT BUỘC!)

```bash
# Dừng frontend hiện tại (Ctrl+C)
cd frontend
npm start
```

### Bước 2: CLEAR BROWSER CACHE

**Cách 1: Hard Reload**
1. Mở DevTools (F12)
2. Click chuột phải vào nút Refresh
3. Chọn "Empty Cache and Hard Reload"

**Cách 2: Manual Clear**
1. F12 → Application tab
2. Storage → Clear storage
3. Click "Clear site data"
4. Refresh trang (Ctrl+R)

### Bước 3: KIỂM TRA CONSOLE LOG

Sau khi làm 2 bước trên, đăng nhập với `tutornam` hoặc `tutorthao`, vào trang **"Quản lý buổi học"**.

Mở DevTools (F12) → Console tab, bạn PHẢI thấy:

```
Component mounted, current user: {id: 27, username: "tutornam", ...}
Current semester: {id: 10, code: "HK251", ...}
useEffect triggered - currentUser: {...} currentSemester: {...}
Both available, fetching semester sessions...
Fetching semester sessions for tutor 27, semester 10
Semester sessions: [... array 16 phần tử]
```

### Bước 4: KIỂM TRA UI

Trên trang "Quản lý buổi học", bạn sẽ thấy:

```
Học kỳ: Học kỳ 1 năm 2025-2026 (Tổng: 16 buổi)

Buổi học còn lại (cả học kỳ): 13
Đã hoàn thành (cả học kỳ): 1
Đã hủy (cả học kỳ): 1
```

---

## ❌ NẾU VẪN KHÔNG HOẠT ĐỘNG

### Lỗi 1: Console log hiển thị "No user found in localStorage!"

**Nguyên nhân:** Chưa đăng nhập hoặc session đã hết hạn.

**Cách sửa:**
1. Đăng xuất (nếu có nút Logout)
2. Đăng nhập lại với:
   - Username: `tutornam`
   - Password: `123456`

### Lỗi 2: Console log hiển thị "Waiting for currentSemester..."

**Nguyên nhân:** API `/api/schedules/current-semester` không trả về data.

**Kiểm tra:**
```bash
curl http://localhost:5000/api/schedules/current-semester
```

Nếu thấy "Cannot GET" → Backend chưa restart!

**Cách sửa:**
```bash
cd backend
# Dừng backend (Ctrl+C)
npm start
```

### Lỗi 3: Console log hiển thị "Failed to fetch semester sessions: 400"

**Nguyên nhân:** API được gọi với sai parameters.

**Kiểm tra Console log** xem có dòng:
```
Fetching semester sessions for tutor undefined, semester undefined
```

Nếu có → currentUser hoặc currentSemester chưa được set.

### Lỗi 4: Console log hiển thị "Semester sessions: []"

**Nguyên nhân:** Tutor chưa có class hoặc sessions.

**Cách sửa:**
1. Vào trang **"Tạo lịch học"**
2. Tạo lịch rảnh
3. Tạo lớp học
4. Tạo lịch học định kỳ
5. Sessions sẽ tự động được tạo

**Hoặc test với user khác đã có data:**
- Username: `tutor`, Password: `tutor` (có 47 sessions)

---

## 🧪 TEST NHANH

### Test Backend:
```bash
# Test 1: Current semester
curl http://localhost:5000/api/schedules/current-semester

# Test 2: Sessions cho tutornam
curl "http://localhost:5000/api/sessions/tutor/semester?tutorId=27&semesterId=10"

# Test 3: Sessions cho tutorthao
curl "http://localhost:5000/api/sessions/tutor/semester?tutorId=28&semesterId=10"
```

Cả 3 phải trả về JSON data (không phải HTML error page).

### Test Database:
```bash
cd backend
node -e "const {getSessionsByTutorAndSemester, db} = require('./db'); getSessionsByTutorAndSemester(27, 10).then(s => {console.log('tutornam sessions:', s.length); console.log('Status:', s.map(x => x.status)); db.close();});"
```

Phải hiển thị: `tutornam sessions: 16`

---

## 📋 CHECKLIST ĐẦY ĐỦ

- [ ] Backend đã restart sau khi sửa code
- [ ] Frontend đã restart sau khi sửa code
- [ ] Browser cache đã clear (Hard Reload)
- [ ] API `/api/schedules/current-semester` hoạt động (test bằng curl)
- [ ] API `/api/sessions/tutor/semester` hoạt động (test bằng curl)
- [ ] Đăng nhập với đúng user (tutornam hoặc tutorthao)
- [ ] Console log hiển thị "Semester sessions: [... array có data]"
- [ ] UI hiển thị "(Tổng: XX buổi)" với XX > 0

---

## 💡 GHI CHÚ

- Code frontend đã được cập nhật với nhiều console logs để debug
- Sau khi debug xong, bạn có thể xóa các dòng `console.log()` nếu muốn
- Backend API đã được test và hoạt động 100% chính xác
- Vấn đề chỉ nằm ở việc frontend chưa fetch được data (do chưa restart/clear cache)

---

## 🎯 KẾT LUẬN

**Backend**: ✅ Hoạt động tốt, có đầy đủ data
**Frontend**: ❌ Cần restart + clear cache
**Root cause**: Code mới chưa được load vào browser

**Solution**: Restart frontend + Clear browser cache + Đăng nhập lại
