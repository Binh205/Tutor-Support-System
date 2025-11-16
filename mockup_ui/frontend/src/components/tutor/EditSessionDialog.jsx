import React, { useState, useEffect } from "react";
import "../../styles/EditSessionDialog.css";

const EditSessionDialog = ({ session, isOpen, onClose, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    location_type: "offline",
    location_details: "",
    notes: "",
  });

  const [cancellationReason, setCancellationReason] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
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

  const handleSave = async () => {
    try {
      await onSave(session.id, formData);
      onClose();
    } catch (error) {
      console.error("Error saving session:", error);
      alert("Không thể lưu thay đổi. Vui lòng thử lại.");
    }
  };

  const handleCancelSession = async () => {
    if (!cancellationReason.trim()) {
      alert("Vui lòng nhập lý do hủy buổi học");
      return;
    }

    try {
      await onCancel(session.id, cancellationReason);
      setShowCancelConfirm(false);
      setCancellationReason("");
      onClose();
    } catch (error) {
      console.error("Error cancelling session:", error);
      alert("Không thể hủy buổi học. Vui lòng thử lại.");
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

  if (showCancelConfirm) {
    return (
      <div className="dialog-overlay" onClick={onClose}>
        <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
          <div className="dialog-header">
            <h2>Hủy buổi học</h2>
            <button
              className="close-btn"
              onClick={() => setShowCancelConfirm(false)}
            >
              ×
            </button>
          </div>

          <div className="dialog-body">
            <p className="cancel-warning">
              Bạn có chắc chắn muốn hủy buổi học này? Sinh viên sẽ được thông
              báo về việc hủy.
            </p>

            <div className="form-group">
              <label>Lý do hủy *</label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Nhập lý do hủy buổi học để thông báo cho sinh viên"
                rows={4}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="dialog-footer">
            <button
              className="btn-secondary"
              onClick={() => setShowCancelConfirm(false)}
            >
              Quay lại
            </button>
            <button className="btn-danger" onClick={handleCancelSession}>
              Xác nhận hủy
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Chỉnh sửa buổi học</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="dialog-body">
          <div className="session-info-summary">
            <h3>
              {session.subject_code} - {session.subject_name}
            </h3>
            <p>{formatDateTime(session.start_time)}</p>
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
          <button
            className="btn-danger-outline"
            onClick={() => setShowCancelConfirm(true)}
          >
            Hủy buổi học
          </button>
          <div style={{ flex: 1 }} />
          <button className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSessionDialog;
