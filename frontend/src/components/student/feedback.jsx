import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/userUtils";
import "../../styles/Feedback.css";

export default function Feedback() {
  const [currentUser, setCurrentUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchCurrentClasses(user.id);
    }
  }, []);

  const fetchCurrentClasses = async (studentId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/feedbacks/student/${studentId}/current-classes`
      );

      if (!response.ok) {
        throw new Error("Không thể tải danh sách môn học");
      }

      const data = await response.json();
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    if (!classId) {
      setSelectedClass(null);
      setSessions([]);
      setSelectedSession(null);
      return;
    }

    const selectedClassData = classes.find((c) => c.id === parseInt(classId));
    setSelectedClass(selectedClassData);
    setSelectedSession(null);
    setSessions([]);

    // Fetch completed sessions without feedback
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/feedbacks/class/${classId}/completed-no-feedback?studentId=${currentUser.id}`
      );

      if (!response.ok) {
        throw new Error("Không thể tải danh sách buổi học");
      }

      const data = await response.json();
      setSessions(data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (e) => {
    const sessionId = e.target.value;
    if (!sessionId) {
      setSelectedSession(null);
      return;
    }

    const session = sessions.find((s) => s.id === parseInt(sessionId));
    setSelectedSession(session);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSession) {
      alert("Vui lòng chọn buổi học");
      return;
    }

    if (rating === 0) {
      alert("Vui lòng chọn đánh giá");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: selectedSession.id,
          student_id: currentUser.id,
          class_id: selectedClass.id,
          tutor_id: selectedClass.tutor_id,
          rating,
          comment,
          is_anonymous: isAnonymous,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể gửi feedback");
      }

      alert("Đã gửi feedback thành công!");

      // Reset form
      setRating(0);
      setComment("");
      setIsAnonymous(false);
      setSelectedSession(null);

      // Refresh sessions list
      handleClassChange({ target: { value: selectedClass.id } });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedClass(null);
    setSelectedSession(null);
    setSessions([]);
    setRating(0);
    setComment("");
    setIsAnonymous(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading && classes.length === 0) {
    return (
      <div className="feedback-container">
        <div className="loading-state">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="page-header">
        <h1>Gửi Feedback</h1>
        <p className="page-description">
          Đánh giá buổi học và góp ý để cải thiện chất lượng giảng dạy
        </p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="feedback-form-container">
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label>Môn học *</label>
            <select
              value={selectedClass?.id || ""}
              onChange={handleClassChange}
              className="form-select"
              required
            >
              <option value="">-- Chọn môn học --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.subject_code} - {cls.subject_name}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div className="form-group">
              <label>Giảng viên</label>
              <input
                type="text"
                value={selectedClass.tutor_name || ""}
                className="form-input"
                disabled
              />
            </div>
          )}

          {selectedClass && (
            <div className="form-group">
              <label>Buổi học *</label>
              <select
                value={selectedSession?.id || ""}
                onChange={handleSessionChange}
                className="form-select"
                required
              >
                <option value="">-- Chọn buổi học --</option>
                {sessions.length === 0 ? (
                  <option value="" disabled>
                    Không có buổi học nào để feedback
                  </option>
                ) : (
                  sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {formatDate(session.start_time)}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {selectedSession && (
            <>
              <div className="form-group">
                <label>Đánh giá *</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        star <= (hoveredRating || rating) ? "filled" : ""
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      ★
                    </span>
                  ))}
                  <span className="rating-text">
                    {rating > 0 && `${rating}/5`}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Bình luận</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập góp ý, nhận xét của bạn về buổi học..."
                  rows={5}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span>Feedback ẩn danh (Giảng viên sẽ không biết tên bạn)</span>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Đang gửi..." : "Gửi feedback"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
