import { useEffect, useState, useRef } from "react";
import {
  getCurrentSemesterAPI,
  getSubjectsBySemesterAPI,
  getClassesBySubjectAPI,
  registerClassAPI,
  getStudentRegisteredClassesAPI,
} from "../../services/api";
import "../../styles/dangkyMonHoc.css";

export default function DangKyMonHoc() {
  // Get user from localStorage
  const [user, setUser] = useState(null);

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

  const [currentSemester, setCurrentSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success", "error", "info"

  const searchBoxRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch current semester on mount
  useEffect(() => {
    fetchCurrentSemester();
  }, []);

  // Fetch registered classes for student
  useEffect(() => {
    if (user?.id) {
      fetchRegisteredClasses();
    }
  }, [user?.id]);

  // Fetch classes when subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchClassesBySubject();
    } else {
      setAvailableClasses([]);
    }
  }, [selectedSubject]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function fetchCurrentSemester() {
    try {
      setLoading(true);
      const semester = await getCurrentSemesterAPI();
      setCurrentSemester(semester);

      // Load subjects for current semester
      if (semester?.id) {
        const subjectsData = await getSubjectsBySemesterAPI(semester.id);
        setSubjects(subjectsData);
      }
    } catch (error) {
      console.error(error);
      setMessage("Không tìm thấy học kỳ hiện tại");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchClassesBySubject() {
    try {
      setLoading(true);
      const data = await getClassesBySubjectAPI(selectedSubject.id);
      setAvailableClasses(data);
    } catch (error) {
      console.error(error);
      setMessage("Không thể tải danh sách lớp");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRegisteredClasses() {
    try {
      const data = await getStudentRegisteredClassesAPI(user.id);
      setRegisteredClasses(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRegister(classId) {
    if (!user?.id) {
      setMessage("Vui lòng đăng nhập");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      await registerClassAPI(classId, user.id);
      setMessage("Đăng ký thành công!");
      setMessageType("success");

      // Refresh lists
      setTimeout(() => {
        fetchClassesBySubject();
        fetchRegisteredClasses();
        setMessage("");
      }, 1500);
    } catch (error) {
      if (error.statusCode === 409) {
        setMessage("Bạn đã đăng ký lớp này rồi!");
        setMessageType("error");
      } else {
        setMessage(error.message || "Đăng ký thất bại, vui lòng thử lại");
        setMessageType("error");
      }
    } finally {
      setLoading(false);
    }
  }

  const isClassRegistered = (classId) => {
    return registeredClasses.some((c) => c.class_id === classId);
  };

  // Filter subjects based on search input
  const filteredSubjects = subjects.filter((subject) => {
    const search = searchInput.toLowerCase();
    return (
      subject.code.toLowerCase().includes(search) ||
      subject.name.toLowerCase().includes(search)
    );
  });

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    setShowDropdown(true);
  };

  const handleSearchInputFocus = () => {
    setShowDropdown(true);
  };

  const handleSearchInputKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!searchInput.trim()) {
        // Empty input + Enter = show all subjects
        setShowDropdown(true);
      } else if (filteredSubjects.length === 1) {
        // Only one match, select it
        selectSubject(filteredSubjects[0]);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const selectSubject = (subject) => {
    setSelectedSubject(subject);
    setSearchInput(`${subject.code} - ${subject.name}`);
    setShowDropdown(false);
  };

  const clearSelection = () => {
    setSelectedSubject(null);
    setSearchInput("");
    setShowDropdown(false);
    setAvailableClasses([]);
  };

  return (
    <div className="dang-ky-mon-hoc-container">
      <h1>Đăng Ký Môn Học</h1>

      {/* Message Alert */}
      {message && (
        <div className={`alert alert-${messageType}`}>
          {message}
          <button className="close-alert" onClick={() => setMessage("")}>
            ×
          </button>
        </div>
      )}

      {/* Current Semester Info */}
      {currentSemester && (
        <div className="current-semester-banner">
          <h2>
            Học kỳ hiện tại: {currentSemester.code} - {currentSemester.name}
          </h2>
          <p className="semester-dates">
            {currentSemester.start_date && currentSemester.end_date && (
              <>
                Từ{" "}
                {new Date(currentSemester.start_date).toLocaleDateString(
                  "vi-VN"
                )}{" "}
                -{" "}
                {new Date(currentSemester.end_date).toLocaleDateString("vi-VN")}
              </>
            )}
          </p>
        </div>
      )}

      {/* Searchable Subject Selector */}
      <div className="subject-selector-section">
        <h3>Chọn môn học</h3>
        <div className="searchbox-container">
          <div className="search-input-wrapper" ref={searchBoxRef}>
            <input
              type="text"
              className="subject-searchbox"
              placeholder="Nhập tên hoặc mã môn học, hoặc nhấn Enter để xem tất cả..."
              value={searchInput}
              onChange={handleSearchInputChange}
              onFocus={handleSearchInputFocus}
              onKeyDown={handleSearchInputKeyDown}
              disabled={loading || !currentSemester}
            />
            {selectedSubject && (
              <button
                className="clear-search-btn"
                onClick={clearSelection}
                title="Xóa lựa chọn"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && filteredSubjects.length > 0 && (
            <div className="subject-dropdown" ref={dropdownRef}>
              {filteredSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className={`subject-option ${
                    selectedSubject?.id === subject.id ? "selected" : ""
                  }`}
                  onClick={() => selectSubject(subject)}
                >
                  <span className="subject-code-opt">{subject.code}</span>
                  <span className="subject-name-opt">{subject.name}</span>
                </div>
              ))}
            </div>
          )}

          {showDropdown && filteredSubjects.length === 0 && searchInput && (
            <div className="subject-dropdown">
              <div className="no-results">Không tìm thấy môn học</div>
            </div>
          )}
        </div>
      </div>

      {/* Classes List */}
      {selectedSubject && (
        <div className="classes-section">
          <h3>Danh sách lớp học - {selectedSubject.code}</h3>

          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : availableClasses.length === 0 ? (
            <div className="no-classes">
              Chưa có lớp nào được mở cho môn học này
            </div>
          ) : (
            <div className="classes-grid">
              {availableClasses.map((classItem) => {
                const isRegistered = isClassRegistered(classItem.id);
                const isFull =
                  classItem.registered_count >= classItem.max_capacity;

                return (
                  <div
                    key={classItem.id}
                    className={`class-card ${
                      isRegistered ? "registered" : ""
                    } ${isFull ? "full" : ""}`}
                  >
                    <div className="class-header">
                      <h4 className="subject-code">{classItem.subject_code}</h4>
                      {isRegistered && (
                        <span className="badge-registered">✓ Đã đăng ký</span>
                      )}
                    </div>

                    <div className="class-body">
                      <p className="subject-name">{classItem.subject_name}</p>

                      <div className="class-info">
                        <p>
                          <strong>Giảng viên:</strong> {classItem.tutor_name}
                        </p>
                        {classItem.day_of_week !== null &&
                          classItem.day_of_week !== undefined && (
                            <p>
                              <strong>Lịch học:</strong> Thứ{" "}
                              {classItem.day_of_week === 0
                                ? "CN"
                                : classItem.day_of_week + 1}
                              , {classItem.start_time} - {classItem.end_time}
                            </p>
                          )}
                        {classItem.description && (
                          <p>
                            <strong>Mô tả:</strong> {classItem.description}
                          </p>
                        )}
                        <p
                          className={
                            isFull ? "capacity-full" : "capacity-available"
                          }
                        >
                          <strong>Sức chứa:</strong>{" "}
                          {classItem.registered_count}/{classItem.max_capacity}
                        </p>
                      </div>

                      {isFull && !isRegistered && (
                        <div className="warning-full">⚠ Lớp đã đầy</div>
                      )}
                    </div>

                    <div className="class-footer">
                      <button
                        className={`btn ${
                          isRegistered
                            ? "btn-secondary"
                            : isFull
                            ? "btn-disabled"
                            : "btn-primary"
                        }`}
                        onClick={() => handleRegister(classItem.id)}
                        disabled={loading || isRegistered || isFull}
                      >
                        {isRegistered
                          ? "Đã đăng ký"
                          : isFull
                          ? "Lớp đầy"
                          : "Đăng ký"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Registered Classes Section */}
      {registeredClasses.length > 0 && (
        <div className="registered-classes-section">
          <h3>Lớp đã đăng ký</h3>
          <div className="registered-list">
            {registeredClasses.map((classItem) => (
              <div key={classItem.registration_id} className="registered-item">
                <div className="registered-info">
                  <p className="code-name">
                    {classItem.subject_code} - {classItem.subject_name}
                  </p>
                  <p className="tutor-info">
                    Giảng viên: {classItem.tutor_name}
                  </p>
                  {classItem.day_of_week !== null &&
                    classItem.day_of_week !== undefined && (
                      <p className="schedule-info">
                        Lịch học: Thứ{" "}
                        {classItem.day_of_week === 0
                          ? "CN"
                          : classItem.day_of_week + 1}
                        , {classItem.start_time} - {classItem.end_time}
                      </p>
                    )}
                  <p className="registered-date">
                    Đăng ký:{" "}
                    {new Date(classItem.registered_at).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
