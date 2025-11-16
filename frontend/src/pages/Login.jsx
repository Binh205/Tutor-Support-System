import HCMUTLogo from "../assets/HCMUT_logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import normalizeUser from "../services/userUtils";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔧 FIX: Detect và sync autofill values
  // Ignore exhaustive-deps for autofill sync (reads DOM inputs directly)
  useEffect(() => {
    const timer = setTimeout(() => {
      const usernameInput = document.getElementById("username");
      const passwordInput = document.getElementById("password");

      if (usernameInput?.value && !username) {
        setUsername(usernameInput.value);
      }
      if (passwordInput?.value && !password) {
        setPassword(passwordInput.value);
      }
    }, 100); // Delay 100ms để browser autofill hoàn tất

    return () => clearTimeout(timer);
  }, [username, password]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Valid accounts
  const VALID_ACCOUNTS = {
    student: { password: "student", role: "student", name: "Student User" },
    tutor: { password: "tutor", role: "tutor", name: "Tutor User" },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Validate inputs
      if (!username || !password) {
        setError("Username and password are required");
        setLoading(false);
        return;
      }

      // Build payload: if user typed an email use email, otherwise send username
      const trimmed = username.trim();
      const payload = trimmed.includes("@")
        ? { email: trimmed, password }
        : { username: trimmed, password };

      // Call backend API
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => null);
      if (!resp.ok) {
        const msg = data?.error || data?.message || "Login failed";
        setError(msg);
        setLoading(false);
        return;
      }

      // success: store token and user
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        // Normalize user so frontend can use `user.avatar` (absolute URL)
        const normalized = normalizeUser(data.user);
        localStorage.setItem("user", JSON.stringify(normalized));
      }

      // Redirect based on role (fallback to student-dashboard)
      const role =
        data.user?.role || (username === "tutor" ? "tutor" : "student");
      if (role === "tutor") navigate("/tutor-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      console.error(err);
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  const fillStudentCredentials = () => {
    setUsername("student");
    setPassword("student");
  };

  const fillTutorCredentials = () => {
    setUsername("tutor");
    setPassword("tutor");
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Section - Login Form */}
        <div className="login-form-section">
          <div className="login-header">
            <img src={HCMUTLogo} alt="HCMUT Logo" className="logo-image" />
            <h1>Tutor Support System</h1>
            <p>Login to your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🔓" : "🔒"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <div className="demo-section">
            <p className="demo-title">Or use demo accounts</p>
            <div className="demo-buttons">
              <button
                type="button"
                onClick={fillStudentCredentials}
                className="demo-btn"
                disabled={loading}
              >
                👨‍🎓 Student Demo
              </button>
              <button
                type="button"
                onClick={fillTutorCredentials}
                className="demo-btn"
                disabled={loading}
              >
                👩‍🏫 Tutor Demo
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Info */}
        <div className="login-info-section">
          <div className="info-box">
            <h2>📝 Demo Credentials</h2>
            <div className="credential-item">
              <h3>Student Account</h3>
              <p>
                <strong>Username:</strong> student
              </p>
              <p>
                <strong>Password:</strong> student
              </p>
            </div>
            <div className="credential-item">
              <h3>Tutor Account</h3>
              <p>
                <strong>Username:</strong> tutor
              </p>
              <p>
                <strong>Password:</strong> tutor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
