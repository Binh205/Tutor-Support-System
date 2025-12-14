import { useState, useEffect } from "react";
import {
  getSemestersAPI,
  createFreeScheduleAPI,
  getFreeScheduleAPI,
  updateFreeScheduleAPI,
  getSubjectsAPI,
  createClassAPI,
  getClassesByTutorAPI,
  getTutorSchedulesAPI,
  createRecurringScheduleAPI,
  deleteClassAPI,
} from "../../services/api";
import TimePicker from "../common/TimePicker";
import styles from "../../styles/taoLichHoc.module.css";

const DAYS_OF_WEEK = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function TaoLichHoc() {
  // Get tutor from localStorage
  const [user, setUser] = useState(null);
  const tutorId = user?.id || null;

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);

  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showFreeScheduleModal, setShowFreeScheduleModal] = useState(false);
  const [freeScheduleData, setFreeScheduleData] = useState({
    daysOfWeek: [],
    startTime: "00:00",
    endTime: "00:00",
  });
  const [message, setMessage] = useState(null);
  const [freeSchedule, setFreeSchedule] = useState(null);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classFormData, setClassFormData] = useState({
    subject_id: "",
    max_capacity: 10,
    description: "",
    selectedDay: "",
    startTime: "",
    endTime: "",
  });
  const [existingSchedules, setExistingSchedules] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);

  // Auto-close message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Load semesters on mount
  useEffect(() => {
    if (tutorId) {
      (async () => {
        try {
          const data = await getSemestersAPI();
          setSemesters(data);
          if (data.length > 0) {
            setSelectedSemester(data[0]);
            loadFreeSchedule(data[0].id);
            loadSubjects(data[0].id);
            loadClasses(data[0].id);
            loadExistingSchedules(data[0].id);
          }
        } catch {
          setMessage({ type: "error", text: "Failed to load semesters" });
        }
      })();
    }
  }, [tutorId]);

  const loadFreeSchedule = async (semesterId) => {
    try {
      const schedule = await getFreeScheduleAPI(tutorId, semesterId);
      setFreeSchedule(schedule);
      // Set available days from free schedule
      if (schedule && schedule.days_of_week) {
        setAvailableDays(schedule.days_of_week);
      }
    } catch {
      setFreeSchedule(null);
      setAvailableDays([]);
    }
  };

  const loadSubjects = async (semesterId) => {
    try {
      const data = await getSubjectsAPI(semesterId);
      setSubjects(data);
    } catch {
      setSubjects([]);
    }
  };

  const loadClasses = async (semesterId) => {
    try {
      const data = await getClassesByTutorAPI(tutorId, semesterId);
      setClasses(data);
    } catch {
      setClasses([]);
    }
  };

  const loadExistingSchedules = async (semesterId) => {
    try {
      const data = await getTutorSchedulesAPI(tutorId, semesterId);
      setExistingSchedules(data);
    } catch {
      setExistingSchedules([]);
    }
  };

  const handleSemesterChange = (sem) => {
    setSelectedSemester(sem);
    loadFreeSchedule(sem.id);
    loadSubjects(sem.id);
    loadClasses(sem.id);
    loadExistingSchedules(sem.id);
  };

  const toggleDay = (day) => {
    setFreeScheduleData((prev) => {
      const updated = prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day];
      return { ...prev, daysOfWeek: updated };
    });
  };

  const submitFreeSchedule = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      if (freeScheduleData.daysOfWeek.length === 0) {
        setMessage({ type: "error", text: "Vui lòng chọn ít nhất một ngày" });
        return;
      }

      const payload = {
        tutor_id: tutorId,
        semester_id: selectedSemester.id,
        days_of_week: freeScheduleData.daysOfWeek,
        start_time: freeScheduleData.startTime,
        end_time: freeScheduleData.endTime,
      };

      let res;
      if (freeSchedule) {
        res = await updateFreeScheduleAPI(freeSchedule.id, payload);
        setMessage({ type: "success", text: "Cập nhật lịch rảnh thành công!" });
      } else {
        res = await createFreeScheduleAPI(payload);
        setMessage({ type: "success", text: "Tạo lịch rảnh thành công!" });
      }
      setFreeSchedule(res);
      setAvailableDays(res.days_of_week);
      setShowFreeScheduleModal(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || err.message,
      });
    }
  };

  // Check if time slot conflicts with existing schedules
  const checkTimeConflict = (day, startTime, endTime) => {
    const conflicts = existingSchedules.filter((schedule) => {
      if (schedule.day_of_week !== day) return false;

      // Check time overlap
      const existingStart = schedule.start_time;
      const existingEnd = schedule.end_time;

      // Time overlap logic: two time ranges overlap if:
      // (StartA < EndB) and (EndA > StartB)
      return (startTime < existingEnd) && (endTime > existingStart);
    });

    return conflicts;
  };

  const submitCreateClass = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      if (!classFormData.subject_id) {
        setMessage({ type: "error", text: "Vui lòng chọn môn học" });
        return;
      }

      if (!freeSchedule) {
        setMessage({
          type: "error",
          text: "Vui lòng tạo lịch rảnh trước khi tạo môn học",
        });
        return;
      }

      if (!classFormData.selectedDay) {
        setMessage({ type: "error", text: "Vui lòng chọn ngày học" });
        return;
      }

      if (!classFormData.startTime || !classFormData.endTime) {
        setMessage({ type: "error", text: "Vui lòng chọn giờ bắt đầu và kết thúc" });
        return;
      }

      if (classFormData.startTime >= classFormData.endTime) {
        setMessage({ type: "error", text: "Giờ kết thúc phải sau giờ bắt đầu" });
        return;
      }

      // Check if time is within free schedule
      if (classFormData.startTime < freeSchedule.start_time ||
          classFormData.endTime > freeSchedule.end_time) {
        setMessage({
          type: "error",
          text: `Giờ học phải trong khoảng lịch rảnh (${freeSchedule.start_time} - ${freeSchedule.end_time})`,
        });
        return;
      }

      // Check for conflicts
      const conflicts = checkTimeConflict(
        parseInt(classFormData.selectedDay),
        classFormData.startTime,
        classFormData.endTime
      );

      if (conflicts.length > 0) {
        const conflictInfo = conflicts.map(c =>
          `${c.subject_code} (${c.start_time}-${c.end_time})`
        ).join(", ");
        setMessage({
          type: "error",
          text: `Trùng lịch với: ${conflictInfo}`,
        });
        return;
      }

      // Create class first
      const classPayload = {
        subject_id: classFormData.subject_id,
        tutor_id: tutorId,
        semester_id: selectedSemester.id,
        max_capacity: parseInt(classFormData.max_capacity) || 10,
        description: classFormData.description || "",
      };

      const newClass = await createClassAPI(classPayload);

      // Then create recurring schedule for the class
      const schedulePayload = {
        day_of_week: parseInt(classFormData.selectedDay),
        start_time: classFormData.startTime,
        end_time: classFormData.endTime,
        start_week: 1,
        end_week: 15,
      };

      await createRecurringScheduleAPI(newClass.id, schedulePayload);

      setMessage({ type: "success", text: "Tạo lớp học thành công!" });
      setShowCreateClassModal(false);
      setClassFormData({
        subject_id: "",
        max_capacity: 10,
        description: "",
        selectedDay: "",
        startTime: "",
        endTime: "",
      });
      loadClasses(selectedSemester.id);
      loadExistingSchedules(selectedSemester.id);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || err.message,
      });
    }
  };

  const handleDeleteClass = async (classId, className) => {
    // Confirm before deleting
    if (!window.confirm(`Bạn có chắc chắn muốn xóa lớp "${className}"?\n\nLưu ý: Việc này sẽ xóa tất cả lịch học và danh sách sinh viên đã đăng ký.`)) {
      return;
    }

    try {
      await deleteClassAPI(classId);
      setMessage({ type: "success", text: "Xóa lớp học thành công!" });

      // Reload classes and schedules
      if (selectedSemester) {
        loadClasses(selectedSemester.id);
        loadExistingSchedules(selectedSemester.id);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || err.message || "Xóa lớp học thất bại",
      });
    }
  };

  const renderCalendar = () => {
    if (!freeSchedule) {
      return (
        <div className={styles.emptyCalendar}>
          <p>Chưa có lịch rảnh. Nhấn "+ Thêm mới" để tạo lịch rảnh</p>
        </div>
      );
    }

    return (
      <div className={styles.calendar}>
        <div className={styles.calendarHeader}>
          <h4>
            Lịch rảnh: {freeSchedule.start_time} - {freeSchedule.end_time}
          </h4>
          <div className={styles.dayGrid}>
            {DAYS_OF_WEEK.map((day, idx) => (
              <div
                key={idx}
                className={`${styles.dayCell} ${
                  freeSchedule.days_of_week.includes(idx) ? styles.active : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderClasses = () => {
    if (classes.length === 0) {
      return (
        <div className={styles.emptyCalendar}>
          <p>Chưa có môn học. Nhấn "+ Thêm mới" để tạo</p>
        </div>
      );
    }

    return (
      <div className={styles.classList}>
        {classes.map((cls) => (
          <div key={cls.id} className={styles.classItem}>
            <div className={styles.classItemHeader}>
              <h4>
                {cls.subject_code} - {cls.subject_name}
              </h4>
              <button
                className={styles.deleteBtn}
                onClick={() =>
                  handleDeleteClass(cls.id, `${cls.subject_code} - ${cls.subject_name}`)
                }
                title="Xóa lớp học"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
            <div className={styles.classItemBody}>
              <p>
                <strong>Sỉ số:</strong> {cls.max_capacity} sinh viên
              </p>
              {cls.day_of_week !== null && cls.day_of_week !== undefined && (
                <p>
                  <strong>Lịch học:</strong> {DAYS_OF_WEEK[cls.day_of_week]}, {cls.start_time} - {cls.end_time}
                </p>
              )}
              {cls.description && (
                <p>
                  <strong>Mô tả:</strong> {cls.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2>Tạo lịch học</h2>

      {/* Semester selector */}
      <div className={styles.semesterSelector}>
        <label>Chọn kỳ học: </label>
        <select
          value={selectedSemester?.id || ""}
          onChange={(e) => {
            const sem = semesters.find((s) => s.id === Number(e.target.value));
            if (sem) handleSemesterChange(sem);
          }}
        >
          {semesters.map((sem) => (
            <option key={sem.id} value={sem.id}>
              {sem.code} - {sem.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main content grid */}
      <div className={styles.mainGrid}>
        {/* Left: Free Schedule */}
        <section className={styles.box}>
          <div className={styles.boxHeader}>
            <h3>Tạo lịch rảnh cho Tutor</h3>
            <button
              onClick={() => setShowFreeScheduleModal(true)}
              className={styles.addBtn}
            >
              + Thêm mới
            </button>
          </div>
          {renderCalendar()}
        </section>

        {/* Right: Create Class */}
        <section className={styles.box}>
          <div className={styles.boxHeader}>
            <h3>Tạo lớp học</h3>
            <button
              onClick={() => setShowCreateClassModal(true)}
              className={styles.addBtn}
              disabled={!freeSchedule}
            >
              + Thêm mới
            </button>
          </div>
          {renderClasses()}
        </section>
      </div>

      {/* Free Schedule Modal */}
      {showFreeScheduleModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Tạo lịch rảnh</h3>
              <button
                onClick={() => setShowFreeScheduleModal(false)}
                className={styles.closeBtn}
              >
                ✕
              </button>
            </div>
            <form onSubmit={submitFreeSchedule}>
              <div className={styles.formGroup}>
                <label>Chọn các ngày trong tuần:</label>
                <div className={styles.daysCheckbox}>
                  {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                    <label key={d}>
                      <input
                        type="checkbox"
                        checked={freeScheduleData.daysOfWeek.includes(d)}
                        onChange={() => toggleDay(d)}
                      />
                      {DAYS_OF_WEEK[d]}
                    </label>
                  ))}
                </div>
              </div>
              <div className={styles.timeRow}>
                <TimePicker
                  label="Giờ bắt đầu"
                  value={freeScheduleData.startTime}
                  onChange={(newTime) =>
                    setFreeScheduleData({
                      ...freeScheduleData,
                      startTime: newTime,
                    })
                  }
                  required
                />
                <TimePicker
                  label="Giờ kết thúc"
                  value={freeScheduleData.endTime}
                  onChange={(newTime) =>
                    setFreeScheduleData({
                      ...freeScheduleData,
                      endTime: newTime,
                    })
                  }
                  required
                />
              </div>
              <div className={styles.modalFooter}>
                <button type="submit" className={styles.submitBtn}>
                  Xác nhận
                </button>
                <button
                  type="button"
                  onClick={() => setShowFreeScheduleModal(false)}
                  className={styles.cancelBtn}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Class Modal - NEW UI */}
      {showCreateClassModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Tạo lớp học</h3>
              <button
                onClick={() => setShowCreateClassModal(false)}
                className={styles.closeBtn}
              >
                ✕
              </button>
            </div>
            <form onSubmit={submitCreateClass}>
              {/* Step 1: Choose Subject */}
              <div className={styles.formGroup}>
                <label>Chọn môn học: *</label>
                <select
                  value={classFormData.subject_id}
                  onChange={(e) =>
                    setClassFormData({
                      ...classFormData,
                      subject_id: Number(e.target.value),
                    })
                  }
                  required
                >
                  <option value="">-- Chọn môn học --</option>
                  {subjects.map((subj) => (
                    <option key={subj.id} value={subj.id}>
                      {subj.code} - {subj.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Max Capacity */}
              <div className={styles.formGroup}>
                <label>Sỉ số tối đa: *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={classFormData.max_capacity}
                  onChange={(e) =>
                    setClassFormData({
                      ...classFormData,
                      max_capacity: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Step 3: Choose Day from Free Schedule */}
              <div className={styles.formGroup}>
                <label>Chọn ngày học: *</label>
                <select
                  value={classFormData.selectedDay}
                  onChange={(e) =>
                    setClassFormData({
                      ...classFormData,
                      selectedDay: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">-- Chọn ngày --</option>
                  {availableDays.map((dayIdx) => (
                    <option key={dayIdx} value={dayIdx}>
                      {DAYS_OF_WEEK[dayIdx]}
                    </option>
                  ))}
                </select>
                <small className={styles.helpText}>
                  Chỉ hiển thị các ngày trong lịch rảnh của bạn
                </small>
              </div>

              {/* Step 4: Choose Time */}
              <div className={styles.formGroup}>
                <label>Giờ học: *</label>
                <div className={styles.timeRow}>
                  <TimePicker
                    label="Từ"
                    value={classFormData.startTime}
                    onChange={(newTime) =>
                      setClassFormData({
                        ...classFormData,
                        startTime: newTime,
                      })
                    }
                    required
                  />
                  <TimePicker
                    label="Đến"
                    value={classFormData.endTime}
                    onChange={(newTime) =>
                      setClassFormData({
                        ...classFormData,
                        endTime: newTime,
                      })
                    }
                    required
                  />
                </div>
                {freeSchedule && (
                  <small className={styles.helpText}>
                    Lịch rảnh: {freeSchedule.start_time} - {freeSchedule.end_time}
                  </small>
                )}
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label>Mô tả (tùy chọn):</label>
                <textarea
                  value={classFormData.description}
                  onChange={(e) =>
                    setClassFormData({
                      ...classFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Mô tả chi tiết về lớp học..."
                  rows="3"
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="submit" className={styles.submitBtn}>
                  Tạo lớp
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateClassModal(false)}
                  className={styles.cancelBtn}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
