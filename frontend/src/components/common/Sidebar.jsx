import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/App.css";
import "../../styles/Sidebar.css";
import ThongTinCaNhan from "./thongtinCaNhan";
import normalizeUser from "../../services/userUtils";

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setUser(normalizeUser(parsed));
        } catch {
          setUser(null);
        }
      }
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleCollapsed = () => setCollapsed((s) => !s);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-top">
          <h2 className="brand">
            <span className="brand-text">Tutor Support System</span>
          </h2>
          <button
            className="toggle-btn"
            onClick={toggleCollapsed}
            aria-label="Toggle sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        {user && (
          <div
            className="sidebar-user"
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            onClick={() => setShowProfile(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setShowProfile(true);
            }}
          >
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" />
              ) : (
                <div className="avatar-fallback">
                  {(user.name || "?").charAt(0)}
                </div>
              )}
            </div>
            <div className="name">{user.name}</div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {user?.role === "student" && (
          <ul className="menu-list">
            <li>
              <NavLink
                to="/student-dashboard/dang-ky-mon-hoc"
                className={({ isActive }) =>
                  "menu-link" + (isActive ? " active" : "")
                }
              >
                <i
                  className="fa-solid fa-book-open icon"
                  aria-hidden="true"
                ></i>
                <span className="label">Đăng ký môn học</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student-dashboard/quan-ly-lich-hoc"
                className={({ isActive }) =>
                  "menu-link" + (isActive ? " active" : "")
                }
              >
                <i
                  className="fa-solid fa-calendar-days icon"
                  aria-hidden="true"
                ></i>
                <span className="label">Quản lý lịch học</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student-dashboard/feedback"
                className={({ isActive }) =>
                  "menu-link" + (isActive ? " active" : "")
                }
              >
                <i
                  className="fa-solid fa-comment-dots icon"
                  aria-hidden="true"
                ></i>
                <span className="label">Feedback</span>
              </NavLink>
            </li>
          </ul>
        )}

        {user?.role === "tutor" && (
          <ul className="menu-list">
            <li>
              <NavLink
                to="/tutor-dashboard/tao-lich-hoc"
                className={({ isActive }) =>
                  "menu-link" + (isActive ? " active" : "")
                }
              >
                <i className="fa-solid fa-plus icon" aria-hidden="true"></i>
                <span className="label">Tạo lịch học</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tutor-dashboard/quan-ly-buoi-hoc"
                className={({ isActive }) =>
                  "menu-link" + (isActive ? " active" : "")
                }
              >
                <i
                  className="fa-solid fa-calendar-check icon"
                  aria-hidden="true"
                ></i>
                <span className="label">Quản lý buổi học</span>
              </NavLink>
            </li>

            {/* <li>
              <NavLink
                to="/tutor-dashboard/theo-doi-tien-do"
                className={({ isActive }) =>
                  "menu-link" + (isActive ? " active" : "")
                }
              >
                <i
                  className="fa-solid fa-chart-line icon"
                  aria-hidden="true"
                ></i>
                <span className="label">Theo dõi tiến độ</span>
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/tutor-dashboard/view-feedback"
                className={({ isActive }) =>
                  "menu-link" + (isActive ? " active" : "")
                }
              >
                <i className="fa-solid fa-comments icon" aria-hidden="true"></i>
                <span className="label">Xem Feedback</span>
              </NavLink>
            </li>
          </ul>
        )}

        {!user && <div className="no-user">Vui lòng đăng nhập để xem menu</div>}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <button className="logout-btn" onClick={handleLogout}>
            <i
              className="fa-solid fa-arrow-right-from-bracket icon"
              aria-hidden="true"
            ></i>
            <span className="label">Logout</span>
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              "menu-link" + (isActive ? " active" : "")
            }
          >
            <i className="fa-solid fa-sign-in-alt icon" aria-hidden="true"></i>
            <span className="label">Go to Login</span>
          </NavLink>
        )}
      </div>
      <ThongTinCaNhan
        open={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onSave={(u) => setUser(u)}
      />
    </aside>
  );
}
