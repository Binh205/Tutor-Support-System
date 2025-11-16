import React, { useState, useEffect } from "react";
import Calendar from "../common/Calendar";
import EditSessionDialog from "./EditSessionDialog";
import { getCurrentUser } from "../../services/userUtils";
import "../../styles/quanlyBuoiHoc.css";

export default function QuanLyBuoiHoc() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchSessions(user.id, currentDate);
    }
  }, []);

  const fetchSessions = async (tutorId, date) => {
    try {
      setLoading(true);
      setError(null);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const response = await fetch(
        `http://localhost:5000/api/sessions/tutor/calendar?tutorId=${tutorId}&year=${year}&month=${month}`
      );

      if (!response.ok) {
        throw new Error("Không thể tải lịch dạy");
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

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedSession(null);
  };

  const handleSaveSession = async (sessionId, formData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sessions/${sessionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật buổi học");
      }

      // Refresh sessions after update
      if (currentUser) {
        await fetchSessions(currentUser.id, currentDate);
      }

      alert("Đã cập nhật buổi học thành công!");
    } catch (err) {
      console.error("Error updating session:", err);
      throw err;
    }
  };

  const handleCancelSession = async (sessionId, cancellationReason) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sessions/${sessionId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cancellation_reason: cancellationReason }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể hủy buổi học");
      }

      // Refresh sessions after cancellation
      if (currentUser) {
        await fetchSessions(currentUser.id, currentDate);
      }

      alert("Đã hủy buổi học thành công! Sinh viên sẽ được thông báo.");
    } catch (err) {
      console.error("Error cancelling session:", err);
      throw err;
    }
  };

  const handleMonthChange = (newDate) => {
    setCurrentDate(newDate);
    if (currentUser) {
      fetchSessions(currentUser.id, newDate);
    }
  };

  const handleRescheduleSubmit = async (sessionId, rescheduleData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sessions/${sessionId}/reschedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rescheduleData),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể đổi lịch buổi học");
      }

      // Refresh sessions after rescheduling
      if (currentUser) {
        await fetchSessions(currentUser.id, currentDate);
      }

      alert("Đã đổi lịch buổi học thành công! Sinh viên sẽ được thông báo.");
    } catch (err) {
      console.error("Error rescheduling session:", err);
      throw err;
    }
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sessions/${sessionId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể đánh dấu hoàn thành buổi học");
      }

      // Refresh sessions after completing
      if (currentUser) {
        await fetchSessions(currentUser.id, currentDate);
      }

      alert("Đã đánh dấu buổi học hoàn thành!");
    } catch (err) {
      console.error("Error completing session:", err);
      throw err;
    }
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="quanly-buoihoc-container">
        <div className="loading-state">Đang tải lịch dạy...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quanly-buoihoc-container">
        <div className="error-state">
          <p>Lỗi: {error}</p>
          <button
            onClick={() =>
              currentUser && fetchSessions(currentUser.id, currentDate)
            }
            className="retry-btn"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quanly-buoihoc-container">
      <div className="page-header">
        <h1>Quản lý buổi học</h1>
        <p className="page-description">
          Xem và quản lý các buổi học trong tháng. Click vào buổi học để chỉnh
          sửa thông tin hoặc hủy buổi học.
        </p>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">
            {sessions.filter((s) => s.status === "scheduled" || s.status === "rescheduled").length}
          </div>
          <div className="stat-label">Buổi học còn lại</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {sessions.filter((s) => s.status === "completed").length}
          </div>
          <div className="stat-label">Đã hoàn thành</div>
        </div>
        <div className="stat-card cancelled">
          <div className="stat-number">
            {sessions.filter((s) => s.status === "cancelled").length}
          </div>
          <div className="stat-label">Đã hủy</div>
        </div>
      </div>

      <Calendar
        sessions={sessions}
        onSessionClick={handleSessionClick}
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
      />

      <EditSessionDialog
        session={selectedSession}
        isOpen={isEditDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveSession}
        onCancel={handleCancelSession}
        onReschedule={handleRescheduleSubmit}
        onComplete={handleCompleteSession}
      />
    </div>
  );
}
