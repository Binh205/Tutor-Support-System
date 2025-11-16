import React, { useState, useEffect } from "react";
import "../../styles/Calendar.css";

const Calendar = ({
  sessions,
  onSessionClick,
  currentDate: externalCurrentDate,
  onMonthChange,
}) => {
  const [currentDate, setCurrentDate] = useState(
    externalCurrentDate || new Date()
  );
  const [calendarDays, setCalendarDays] = useState([]);

  // Sync with external currentDate if provided
  useEffect(() => {
    if (externalCurrentDate) {
      setCurrentDate(externalCurrentDate);
    }
  }, [externalCurrentDate]);

  useEffect(() => {
    generateCalendar();
  }, [currentDate, sessions]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, sessions: [] });
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const daySessions = sessions.filter((session) => {
        const sessionDate = new Date(session.start_time)
          .toISOString()
          .split("T")[0];
        return sessionDate === dateStr;
      });
      days.push({ date: day, sessions: daySessions });
    }

    setCalendarDays(days);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(newDate);
    if (onMonthChange) {
      onMonthChange(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(newDate);
    if (onMonthChange) {
      onMonthChange(newDate);
    }
  };

  const handleToday = () => {
    const newDate = new Date();
    setCurrentDate(newDate);
    if (onMonthChange) {
      onMonthChange(newDate);
    }
  };

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const getSessionColor = (status) => {
    switch (status) {
      case "scheduled":
        return "#4CAF50";
      case "cancelled":
        return "#9E9E9E"; // Grey for cancelled
      case "rescheduled":
        return "#FF9800"; // Orange for rescheduled
      case "completed":
        return "#607D8B"; // Dark grey for completed
      default:
        return "#2196F3";
    }
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-btn">
          &lt;
        </button>
        <h2>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className="nav-btn">
          &gt;
        </button>
        <button onClick={handleToday} className="today-btn">
          Hôm nay
        </button>
      </div>

      <div className="calendar-grid">
        {weekDays.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${!day.date ? "empty-day" : ""} ${
              day.date === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()
                ? "today"
                : ""
            }`}
          >
            {day.date && (
              <>
                <div className="day-number">{day.date}</div>
                <div className="day-sessions">
                  {day.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="session-item"
                      style={{
                        backgroundColor: getSessionColor(session.status),
                      }}
                      onClick={() => onSessionClick(session)}
                    >
                      <div className="session-time">
                        {formatTime(session.start_time)}
                      </div>
                      <div className="session-title">
                        {session.subject_name}
                      </div>
                      {session.status === "cancelled" && (
                        <div className="session-cancelled-badge">Đã hủy</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
