import React, { useState, useEffect } from "react";
import TimePicker from "../common/TimePicker";
import DatePicker from "../common/DatePicker";
import "../../styles/EditSessionDialog.css";

const EditSessionDialog = ({ session, isOpen, onClose, onSave, onCancel, onReschedule, onComplete }) => {
  const [formData, setFormData] = useState({
    location_type: "offline",
    location_details: "",
    notes: "",
  });

  const [rescheduleData, setRescheduleData] = useState({
    new_date: "",
    new_start_time: "",
    new_end_time: "",
  });

  const [cancellationReason, setCancellationReason] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
        location_type: session.location_type || "offline",
        location_details: session.location_details || "",
        notes: session.notes || "",
      });

      // Pre-fill reschedule data with current session time
      const startDate = new Date(session.start_time);
      const endDate = new Date(session.end_time);
      setRescheduleData({
        new_date: startDate.toISOString().split('T')[0],
        new_start_time: startDate.toTimeString().slice(0, 5),
        new_end_time: endDate.toTimeString().slice(0, 5),
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

  const handleRescheduleChange = (e) => {
    const { name, value } = e.target;
    setRescheduleData((prev) => ({
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

  const handleRescheduleSubmit = async () => {
    if (!rescheduleData.new_date || !rescheduleData.new_start_time || !rescheduleData.new_end_time) {
      alert("Vui lòng chọn đầy đủ ngày giờ học mới");
      return;
    }

    try {
      const newStartTime = `${rescheduleData.new_date} ${rescheduleData.new_start_time}:00`;
      const newEndTime = `${rescheduleData.new_date} ${rescheduleData.new_end_time}:00`;

      await onReschedule(session.id, {
        start_time: newStartTime,
        end_time: newEndTime,
        location_type: formData.location_type,
        location_details: formData.location_details,
        notes: formData.notes,
      });

      setShowRescheduleForm(false);
      onClose();
    } catch (error) {
      console.error("Error rescheduling session:", error);
      alert("Không thể đổi lịch. Vui lòng thử lại.");
    }
  };

  const handleCompleteSession = async () => {
    try {
      await onComplete(session.id);
      setShowCompleteConfirm(false);
      onClose();
    } catch (error) {
      console.error("Error completing session:", error);
      alert("Không thể đánh dấu hoàn thành. Vui lòng thử lại.");
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

  // Show reschedule form for cancelled sessions
  if (showRescheduleForm) {
    return (
      <div className="dialog-overlay" onClick={onClose}>
        <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
          <div className="dialog-header">
            <h2>Đổi lịch buổi học</h2>
            <button
              className="close-btn"
              onClick={() => setShowRescheduleForm(false)}
            >
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

            <DatePicker
              value={rescheduleData.new_date}
              onChange={(date) => handleRescheduleChange({
                target: { name: 'new_date', value: date }
              })}
              label="Ngày học mới"
              required={true}
            />

            <TimePicker
              value={rescheduleData.new_start_time}
              onChange={(time) => handleRescheduleChange({
                target: { name: 'new_start_time', value: time }
              })}
              label="Giờ bắt đầu"
              required={true}
            />

            <TimePicker
              value={rescheduleData.new_end_time}
              onChange={(time) => handleRescheduleChange({
                target: { name: 'new_end_time', value: time }
              })}
              label="Giờ kết thúc"
              required={true}
            />

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
              className="btn-secondary"
              onClick={() => setShowRescheduleForm(false)}
            >
              Hủy
            </button>
            <button className="btn-primary" onClick={handleRescheduleSubmit}>
              Xác nhận đổi lịch
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCompleteConfirm) {
    return (
      <div className="dialog-overlay" onClick={onClose}>
        <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
          <div className="dialog-header">
            <h2>Xác nhận hoàn thành</h2>
            <button
              className="close-btn"
              onClick={() => setShowCompleteConfirm(false)}
            >
              ×
            </button>
          </div>

          <div className="dialog-body">
            <p className="cancel-warning">
              Bạn có chắc chắn buổi học này đã hoàn thành? Sau khi đánh dấu hoàn thành,
              bạn sẽ không thể chỉnh sửa thông tin buổi học này nữa.
            </p>
          </div>

          <div className="dialog-footer">
            <button
              className="btn-secondary"
              onClick={() => setShowCompleteConfirm(false)}
            >
              Quay lại
            </button>
            <button className="btn-primary" onClick={handleCompleteSession}>
              Xác nhận hoàn thành
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  const isCompleted = session.status === "completed";
  const isCancelled = session.status === "cancelled";

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{isCompleted ? "Thông tin buổi học" : "Chỉnh sửa buổi học"}</h2>
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
            {isCompleted && (
              <p className="completed-badge" style={{ color: "#10b981", fontWeight: "bold" }}>
                ✓ Đã hoàn thành
              </p>
            )}
            {isCancelled && session.cancellation_reason && (
              <p className="cancelled-badge" style={{ color: "#f44336", fontWeight: "bold", marginTop: "8px" }}>
                ✗ Đã hủy: {session.cancellation_reason}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Hình thức học *</label>
            <select
              name="location_type"
              value={formData.location_type}
              onChange={handleChange}
              className="form-select"
              disabled={isCompleted || isCancelled}
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
              disabled={isCompleted || isCancelled}
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
              disabled={isCompleted || isCancelled}
            />
          </div>
        </div>

        <div className="dialog-footer">
          {isCompleted ? (
            <>
              <div style={{ flex: 1 }} />
              <button className="btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </>
          ) : isCancelled ? (
            <>
              <button
                className="btn-primary"
                onClick={() => setShowRescheduleForm(true)}
              >
                Đổi lịch
              </button>
              <div style={{ flex: 1 }} />
              <button className="btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-danger-outline"
                onClick={() => setShowCancelConfirm(true)}
              >
                Hủy buổi học
              </button>
              <button
                className="btn-success-outline"
                onClick={() => setShowCompleteConfirm(true)}
              >
                Đã hoàn thành
              </button>
              <div style={{ flex: 1 }} />
              <button className="btn-secondary" onClick={onClose}>
                Đóng
              </button>
              <button className="btn-primary" onClick={handleSave}>
                Lưu thay đổi
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSessionDialog;
