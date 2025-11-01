import HCMUTLogo from "../assets/HCMUT_logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔧 FIX: Detect và sync autofill values
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
  }, []); 

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

      // Check credentials
      const account = VALID_ACCOUNTS[username];
      if (!account || account.password !== password) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      // Create user object
      const user = {
        id: username === "student" ? 1 : 2,
        username: username,
        role: account.role,
        name: account.name,
        avatar: username === "student" ? "S" : "T",
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (account.role === "student") {
        navigate("/student-dashboard");
      } else if (account.role === "tutor") {
        navigate("/tutor-dashboard");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
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
