import React, { useState, useEffect } from "react";
import "../../styles/EditSessionDialog.css";

const RescheduleDialog = ({ session, isOpen, onClose, onReschedule }) => {
  const [formData, setFormData] = useState({
    new_date: "",
    new_start_time: "",
    new_end_time: "",
    location_type: "offline",
    location_details: "",
    notes: "",
  });

  useEffect(() => {
    if (session) {
      // Pre-fill with old session data
      const startDate = new Date(session.start_time);
      setFormData({
        new_date: startDate.toISOString().split('T')[0],
        new_start_time: startDate.toTimeString().slice(0, 5),
        new_end_time: session.end_time ? new Date(session.end_time).toTimeString().slice(0, 5) : "",
        location_type: session.location_type || "offline",
        location_details: session.location_details || "",
        notes: session.notes || "",
      });
    }
  }, [session]);

  if (!isOpen || !session) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.new_date || !formData.new_start_time || !formData.new_end_time) {
      alert("Vui lòng chọn đầy đủ ngày giờ học mới");
      return;
    }

    try {
      const newStartTime = `${formData.new_date} ${formData.new_start_time}:00`;
      const newEndTime = `${formData.new_date} ${formData.new_end_time}:00`;

      await onReschedule(session.id, {
        start_time: newStartTime,
        end_time: newEndTime,
        location_type: formData.location_type,
        location_details: formData.location_details,
        notes: formData.notes,
      });

      onClose();
    } catch (error) {
      console.error("Error rescheduling session:", error);
      alert("Không thể đổi lịch. Vui lòng thử lại.");
    }
  };

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

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Đổi lịch buổi học</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="dialog-body">
          <div className="session-info-summary">
            <h3>
              {session.subject_code} - {session.subject_name}
            </h3>
            <p>Buổi học cũ: {formatDateTime(session.start_time)}</p>
            {session.cancellation_reason && (
              <p className="cancellation-reason">
                Lý do hủy: {session.cancellation_reason}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Ngày học mới *</label>
            <input
              type="date"
              name="new_date"
              value={formData.new_date}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Giờ bắt đầu *</label>
            <input
              type="time"
              name="new_start_time"
              value={formData.new_start_time}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Giờ kết thúc *</label>
            <input
              type="time"
              name="new_end_time"
              value={formData.new_end_time}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Hình thức học *</label>
            <select
              name="location_type"
              value={formData.location_type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="offline">Offline (Tại trường)</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              {formData.location_type === "online"
                ? "Link học online"
                : "Phòng học"}
            </label>
            <input
              type="text"
              name="location_details"
              value={formData.location_details}
              onChange={handleChange}
              placeholder={
                formData.location_type === "online"
                  ? "Nhập link Zoom, Google Meet, ..."
                  : "Nhập số phòng học, ví dụ: H1-101"
              }
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Nhập ghi chú cho buổi học (tùy chọn)"
              rows={3}
              className="form-textarea"
            />
          </div>
        </div>

        <div className="dialog-footer">
          <button className="btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Xác nhận đổi lịch
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleDialog;
