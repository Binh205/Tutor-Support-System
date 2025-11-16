"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/components/Sidebar.module.css";

export default function Sidebar({ userRole = "student" }) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const studentLinks = [
    { href: "/student/dashboard", label: "📊 Dashboard", icon: "📊" },
    {
      href: "/student/register-subject",
      label: "📚 Đăng ký môn học",
      icon: "📚",
    },
    { href: "/student/find-tutor", label: "🔍 Tìm gia sư", icon: "🔍" },
    { href: "/student/my-schedule", label: "📅 Lịch học của tôi", icon: "📅" },
    { href: "/student/feedback", label: "⭐ Đánh giá", icon: "⭐" },
  ];

  const tutorLinks = [
    { href: "/tutor/dashboard", label: "📊 Dashboard", icon: "📊" },
    { href: "/tutor/create-session", label: "➕ Tạo buổi học", icon: "➕" },
    {
      href: "/tutor/manage-sessions",
      label: "⚙️ Quản lý buổi học",
      icon: "⚙️",
    },
    { href: "/tutor/track-progress", label: "📈 Theo dõi tiến độ", icon: "📈" },
  ];

  const links = userRole === "tutor" ? tutorLinks : studentLinks;
  const currentPath = router.pathname;

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
      >
        {/* Close button for mobile */}
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
          ✕
        </button>

        {/* Logo/Title */}
        <div className={styles.logo}>
          <h2>🎓 Tutor Hub</h2>
        </div>

        {/* Navigation Links */}
        <nav className={styles.nav}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`${styles.navLink} ${
                  currentPath === link.href ? styles.active : ""
                }`}
              >
                <span className={styles.icon}>{link.icon}</span>
                <span className={styles.label}>{link.label}</span>
              </a>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          🚪 Đăng xuất
        </button>
      </aside>
    </>
  );
}
