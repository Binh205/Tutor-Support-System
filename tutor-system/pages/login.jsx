// pages/login.jsx
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Lưu user vào localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect theo role
        if (data.user.role === "student") {
          router.push("/student/dashboard");
        } else if (data.user.role === "tutor") {
          router.push("/tutor/dashboard");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fillStudentCredentials = () => {
    setEmail("student1@example.com");
    setPassword("123456");
  };

  const fillTutorCredentials = () => {
    setEmail("tutor1@example.com");
    setPassword("123456");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>🎓 Tutor Support System</h1>
        <p className={styles.subtitle}>Login to your account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className={styles.divider}>Or use demo accounts</div>

        <div className={styles.demoButtons}>
          <button
            type="button"
            onClick={fillStudentCredentials}
            className={styles.demoBtn}
          >
            👨‍🎓 Student Demo
          </button>
          <button
            type="button"
            onClick={fillTutorCredentials}
            className={styles.demoBtn}
          >
            👩‍🏫 Tutor Demo
          </button>
        </div>

        <p className={styles.footer}>
          Default password: <strong>123456</strong>
        </p>
      </div>
    </div>
  );
}
