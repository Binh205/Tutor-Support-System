import { useState, useEffect } from "react";

export default function ThongTinCaNhan({ open, onClose, user, onSave }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(user || {});
  }, [user, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((s) => ({ ...s, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Keep name/email/department readonly (they exist in form but should not be changed here)
    const updated = { ...user, ...form };
    // Persist to localStorage
    try {
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save user:", err);
    }
    if (onSave) onSave(updated);
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>Thông tin cá nhân</h3>
        <form onSubmit={handleSave} className="profile-form">
          <div className="profile-row">
            <div className="avatar-preview">
              {form?.avatar ? (
                <img src={form.avatar} alt="avatar" />
              ) : (
                <div className="avatar-fallback">
                  {(form.name || "?").charAt(0)}
                </div>
              )}
            </div>
            <div className="avatar-actions">
              <label className="file-label">
                Change avatar
                <input type="file" accept="image/*" onChange={handleAvatar} />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input type="text" value={form?.name || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="text" value={form?.username || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Faculty / Department</label>
            <input type="text" value={form?.faculty || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={form?.phone || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={form?.address || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
