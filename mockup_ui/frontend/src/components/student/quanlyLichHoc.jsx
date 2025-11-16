import React, { useState, useEffect } from "react";
import Calendar from "../common/Calendar";
import SessionDetailDialog from "../common/SessionDetailDialog";
import { getCurrentUser } from "../../services/userUtils";
import "../../styles/quanlyLichHoc.css";

export default function QuanLyLichHoc() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchSessions(user.id, new Date());
    }
  }, []);

  const fetchSessions = async (studentId, date) => {
    try {
      setLoading(true);
      setError(null);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const response = await fetch(
        `http://localhost:5000/api/sessions/student/calendar?studentId=${studentId}&year=${year}&month=${month}`
      );

      if (!response.ok) {
        throw new Error("Không thể tải lịch học");
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
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSession(null);
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="quanly-lichhoc-container">
        <div className="loading-state">Đang tải lịch học...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quanly-lichhoc-container">
        <div className="error-state">
          <p>Lỗi: {error}</p>
          <button
            onClick={() => currentUser && fetchSessions(currentUser.id, currentDate)}
            className="retry-btn"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quanly-lichhoc-container">
      <div className="page-header">
        <h1>Quản lý lịch học</h1>
        <p className="page-description">
          Xem lịch học của các môn đã đăng ký trong tháng
        </p>
      </div>

      <Calendar
        sessions={sessions}
        onSessionClick={handleSessionClick}
        currentUser={currentUser}
      />

      <SessionDetailDialog
        session={selectedSession}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        userRole="student"
      />
    </div>
  );
}
