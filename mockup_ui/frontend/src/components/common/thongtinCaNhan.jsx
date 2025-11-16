import { useState, useEffect } from "react";
import apiClient from "../../services/api";
import normalizeUser from "../../services/userUtils";

export default function ThongTinCaNhan({ open, onClose, user, onSave }) {
  const [form, setForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState("");

  useEffect(() => {
    setForm(user || {});
    // If user already has an avatar URL, show it as preview
    setAvatarPreview(user?.avatar || null);
  }, [user, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // store File for upload, and show preview using object URL
    setAvatarFile(file);
    setAvatarFileName(file.name);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Keep name/email/department readonly (they exist in form but should not be changed here)
    const updatedLocal = { ...user, ...form };

    (async () => {
      try {
        // If user id present and backend available, upload avatar first then update phone/address
        if (user?.id) {
          // Upload avatar if selected
          if (avatarFile) {
            const fd = new FormData();
            fd.append("avatar", avatarFile);
            await apiClient.post(`/users/${user.id}/avatar`, fd, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          }

          // Update basic fields
          await apiClient.put(`/users/${user.id}`, {
            phone: form.phone || "",
            address: form.address || "",
          });

          // Fetch latest profile
          const resp = await apiClient.get(`/users/${user.id}`);
          const latest = resp.data;
          const normalized = normalizeUser(latest);
          try {
            localStorage.setItem("user", JSON.stringify(normalized));
          } catch {
            // ignore localStorage failures
          }
          if (onSave) onSave(normalized);
          if (onClose) onClose();
          return;
        }

        // Fallback: persist locally if no backend
        try {
          const normal = normalizeUser(updatedLocal);
          localStorage.setItem("user", JSON.stringify(normal));
          if (onSave) onSave(normal);
        } catch (err) {
          console.error("Failed to save user:", err);
          if (onSave) onSave(updatedLocal);
        }
        if (onClose) onClose();
      } catch (err) {
        console.error(
          "Profile save failed:",
          err.response || err.message || err
        );
      }
    })();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>Thông tin cá nhân</h3>
        <form onSubmit={handleSave} className="profile-form">
          <div className="profile-row">
            <div className="avatar-preview">
              {avatarPreview || form?.avatar ? (
                <img src={avatarPreview || form.avatar} alt="avatar" />
              ) : (
                <div className="avatar-fallback">
                  {(form.name || "?").charAt(0)}
                </div>
              )}
            </div>
            <div className="avatar-actions">
              <label className="file-label">
                <span className="file-button">Choose File</span>
                <span className="file-name">
                  {avatarFileName || "No file chosen"}
                </span>
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
            <input type="text" value={form?.email || ""} readOnly />
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
