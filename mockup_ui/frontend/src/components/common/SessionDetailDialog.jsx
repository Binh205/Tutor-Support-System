import React from "react";
import "../../styles/SessionDetailDialog.css";

const SessionDetailDialog = ({ session, isOpen, onClose, userRole }) => {
  if (!isOpen || !session) return null;

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Đã lên lịch";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Đã hoàn thành";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "#4CAF50";
      case "cancelled":
        return "#f44336";
      case "completed":
        return "#9E9E9E";
      default:
        return "#2196F3";
    }
  };

  const getLocationText = () => {
    if (session.location_type === "online") {
      return `Online: ${session.location_details || "Link sẽ được cung cấp"}`;
    } else {
      return `Offline: ${session.location_details || "Phòng học chưa xác định"}`;
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Chi tiết buổi học</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="dialog-body">
          <div className="session-info-row">
            <div className="info-label">Môn học</div>
            <div className="info-value">
              {session.subject_code} - {session.subject_name}
            </div>
          </div>

          {userRole === "student" && (
            <div className="session-info-row">
              <div className="info-label">Giảng viên</div>
              <div className="info-value">{session.tutor_name}</div>
            </div>
          )}

          <div className="session-info-row">
            <div className="info-label">Thời gian</div>
            <div className="info-value">
              <div>{formatDateTime(session.start_time)}</div>
              <div className="time-range">
                {formatTime(session.start_time)} -{" "}
                {formatTime(session.end_time)}
              </div>
            </div>
          </div>

          <div className="session-info-row">
            <div className="info-label">Địa điểm</div>
            <div className="info-value">{getLocationText()}</div>
          </div>

          <div className="session-info-row">
            <div className="info-label">Trạng thái</div>
            <div className="info-value">
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(session.status) }}
              >
                {getStatusText(session.status)}
              </span>
            </div>
          </div>

          {session.notes && (
            <div className="session-info-row">
              <div className="info-label">Ghi chú</div>
              <div className="info-value">{session.notes}</div>
            </div>
          )}

          {session.cancellation_reason && (
            <div className="session-info-row cancellation-notice">
              <div className="info-label">Lý do hủy</div>
              <div className="info-value">{session.cancellation_reason}</div>
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <button className="btn-close" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailDialog;
