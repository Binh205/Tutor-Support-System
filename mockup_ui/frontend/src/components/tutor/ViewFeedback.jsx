import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/userUtils";
import "../../styles/ViewFeedback.css";

export default function ViewFeedback() {
  const [currentUser, setCurrentUser] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchSemesters();
    }
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tutor/semesters");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách học kỳ");
      }
      const data = await response.json();
      setSemesters(data);
    } catch (err) {
      console.error("Error fetching semesters:", err);
      setError(err.message);
    }
  };

  const fetchClasses = async (semesterId, tutorId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tutor/classes?semesterId=${semesterId}&tutorId=${tutorId}`
      );
      if (!response.ok) {
        throw new Error("Không thể tải danh sách lớp");
      }
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError(err.message);
    }
  };

  const handleSemesterChange = (e) => {
    const semesterId = e.target.value;
    setSelectedSemester(semesterId);
    setSelectedClass("");
    setClasses([]);
    setFeedbacks([]);

    if (semesterId && currentUser) {
      fetchClasses(semesterId, currentUser.id);
    }
  };

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setFeedbacks([]);

    if (!classId || !currentUser) return;

    // Fetch feedbacks
    try {
      setLoading(true);
      const url = `http://localhost:5000/api/feedbacks/tutor/${currentUser.id}?semesterId=${selectedSemester}&classId=${classId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Không thể tải feedback");
      }

      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="star-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? "filled" : ""}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="view-feedback-container">
      <div className="page-header">
        <h1>Xem Feedback</h1>
        <p className="page-description">
          Xem đánh giá và góp ý từ sinh viên về buổi học
        </p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label>Học kỳ *</label>
          <select
            value={selectedSemester}
            onChange={handleSemesterChange}
            className="form-select"
          >
            <option value="">-- Chọn học kỳ --</option>
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id}>
                {sem.code} - {sem.name}
              </option>
            ))}
          </select>
        </div>

        {selectedSemester && (
          <div className="filter-group">
            <label>Môn học/Lớp *</label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="form-select"
            >
              <option value="">-- Chọn lớp --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.subject_code} - {cls.subject_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-state">Đang tải feedback...</div>
      )}

      {!loading && feedbacks.length > 0 && (
        <div className="feedbacks-section">
          <div className="feedbacks-header">
            <h2>Danh sách Feedback</h2>
            <p className="total-count">Tổng: {feedbacks.length} feedback</p>
          </div>

          <div className="feedbacks-list">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="feedback-card">
                <div className="feedback-header">
                  <div className="feedback-info">
                    <span className="session-date">
                      Buổi học: {formatDate(feedback.session_date)}
                    </span>
                    <span className="student-name">
                      {feedback.is_anonymous
                        ? "Ẩn danh"
                        : feedback.student_name}
                    </span>
                  </div>
                  <div className="feedback-date">
                    {formatDate(feedback.created_at)}
                  </div>
                </div>

                <div className="feedback-rating">
                  {renderStars(feedback.rating)}
                  <span className="rating-value">{feedback.rating}/5</span>
                </div>

                {feedback.comment && (
                  <div className="feedback-comment">
                    <p>{feedback.comment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && selectedClass && feedbacks.length === 0 && (
        <div className="empty-state">
          <p>Chưa có feedback nào cho lớp này</p>
        </div>
      )}
    </div>
  );
}
