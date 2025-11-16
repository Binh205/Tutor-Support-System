import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/Dashboard.module.css";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "student") {
      router.push("/tutor/dashboard");
      return;
    }

    setUser(parsedUser);

    // Load sessions from API
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  if (loading || !user) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  // Get upcoming sessions (next 3)
  const upcomingSessions = sessions.slice(0, 3);

  return (
    <div className={styles.container}>
      <Sidebar userRole="student" />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Xin chào, {user.name}! 👋</h1>
            <p className={styles.subtitle}>Đây là dashboard của bạn</p>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Buổi học sắp tới</p>
              <p className={styles.statValue}>{sessions.length}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Đã hoàn thành</p>
              <p className={styles.statValue}>12</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Đánh giá trung bình</p>
              <p className={styles.statValue}>4.8/5</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Số dư</p>
              <p className={styles.statValue}>500k VNĐ</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.contentGrid}>
          {/* Upcoming Sessions */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>📅 Buổi học sắp tới</h2>
              <a href="/student/my-schedule" className={styles.viewMore}>
                Xem tất cả →
              </a>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className={styles.sessionsList}>
                {upcomingSessions.map((session) => (
                  <div key={session.id} className={styles.sessionCard}>
                    <div className={styles.sessionHeader}>
                      <div>
                        <h3>{session.tutor}</h3>
                        <p className={styles.subject}>{session.subject}</p>
                      </div>
                      <span
                        className={`${styles.status} ${styles[session.status]}`}
                      >
                        {session.status}
                      </span>
                    </div>
                    <div className={styles.sessionDetails}>
                      <p>
                        <span>📅</span> {session.date}
                      </p>
                      <p>
                        <span>⏰</span> {session.time}
                      </p>
                      <p>
                        <span>💵</span> {session.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>Bạn chưa đăng ký buổi học nào</p>
                <a href="/student/find-tutor" className={styles.ctaBtn}>
                  Tìm gia sư ngay
                </a>
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className={styles.section}>
            <h2>🚀 Hành động nhanh</h2>
            <div className={styles.actionGrid}>
              <a href="/student/register-subject" className={styles.actionCard}>
                <div className={styles.actionIcon}>📚</div>
                <h3>Đăng ký môn học</h3>
                <p>Chọn môn học mà bạn muốn học</p>
              </a>

              <a href="/student/find-tutor" className={styles.actionCard}>
                <div className={styles.actionIcon}>🔍</div>
                <h3>Tìm gia sư</h3>
                <p>Tìm gia sư phù hợp nhất</p>
              </a>

              <a href="/student/my-schedule" className={styles.actionCard}>
                <div className={styles.actionIcon}>📅</div>
                <h3>Lịch biểu</h3>
                <p>Quản lý lịch học của bạn</p>
              </a>

              <a href="/student/feedback" className={styles.actionCard}>
                <div className={styles.actionIcon}>⭐</div>
                <h3>Đánh giá</h3>
                <p>Chia sẻ ý kiến của bạn</p>
              </a>
            </div>
          </section>
        </div>

        {/* Notes Section */}
        <section className={styles.notesSection}>
          <h2>📝 Ghi chú của tôi</h2>
          <div className={styles.notesBox}>
            <textarea
              placeholder="Viết ghi chú của bạn ở đây..."
              className={styles.notesTextarea}
              defaultValue="Ví dụ: Cần ôn tập về phương trình bậc hai..."
            />
            <button className={styles.saveBtn}>💾 Lưu ghi chú</button>
          </div>
        </section>
      </main>
    </div>
  );
}
